"use client";
import React, { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import type QRCodeType from "react-qr-code";
import { useCartStore } from "./cartStore";

// Dynamically import react-qr-code to avoid SSR issues
const QRCode = dynamic(() => import("react-qr-code"), { ssr: false }) as typeof QRCodeType;

// Hardcoded product data
const PRODUCTS = [
  {
    id: 1,
    name: "T-Shirt",
    priceUsd: 25.0,
    image: "/file.svg",
  },
  {
    id: 2,
    name: "Mug",
    priceUsd: 15.0,
    image: "/window.svg",
  },
  {
    id: 3,
    name: "Sticker Pack",
    priceUsd: 5.0,
    image: "/globe.svg",
  },
];

// Fixed BTC address for demo
const BITCOIN_ADDRESS = "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh";
// Hardcoded BTC/USD rate for demo
const BTC_USD_RATE = 60000; // 1 BTC = $60,000

function usdToBtc(usd: number) {
  return (usd / BTC_USD_RATE).toFixed(8);
}

export default function Home() {
  const [showCheckout, setShowCheckout] = useState(false);
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const clearCart = useCartStore((state) => state.clearCart);

  const cartItems = cart.map((item) => {
    const product = PRODUCTS.find((p) => p.id === item.id)!;
    return { ...product, qty: item.qty };
  });

  const totalUsd = cartItems.reduce(
    (sum, item) => sum + item.priceUsd * item.qty,
    0
  );
  const totalBtc = usdToBtc(totalUsd);

  const bitcoinUri = `bitcoin:${BITCOIN_ADDRESS}?amount=${totalBtc}`;

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)] flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Demo Store</h1>
      {!showCheckout ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
            {PRODUCTS.map((product) => (
              <div
                key={product.id}
                className="border rounded-lg p-6 flex flex-col items-center shadow-md bg-white dark:bg-black"
              >
                <Image
                  src={product.image}
                  alt={product.name}
                  width={80}
                  height={80}
                  className="mb-4"
                />
                <div className="font-semibold text-lg mb-2">{product.name}</div>
                <div className="mb-4">${product.priceUsd.toFixed(2)}</div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => addToCart(product.id)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          <div className="w-full max-w-md border rounded-lg p-6 bg-white dark:bg-black shadow-md">
            <h2 className="text-xl font-bold mb-4">Cart</h2>
            {cartItems.length === 0 ? (
              <div className="text-gray-500">Your cart is empty.</div>
            ) : (
              <ul className="mb-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="flex justify-between items-center mb-2">
                    <span>
                      {item.name} x {item.qty}
                    </span>
                    <span>
                      ${(item.priceUsd * item.qty).toFixed(2)}
                      <button
                        className="ml-4 text-red-500 hover:underline"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Remove
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-between font-semibold mb-4">
              <span>Total:</span>
              <span>${totalUsd.toFixed(2)} USD</span>
            </div>
            <button
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              onClick={() => setShowCheckout(true)}
              disabled={cartItems.length === 0}
            >
              Checkout
            </button>
            {cartItems.length > 0 && (
              <button
                className="w-full mt-2 bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
                onClick={clearCart}
              >
                Clear Cart
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="w-full max-w-md border rounded-lg p-6 bg-white dark:bg-black shadow-md flex flex-col items-center">
          <h2 className="text-xl font-bold mb-4">Checkout</h2>
          <div className="mb-4">Scan to pay with Bitcoin:</div>
          <div className="bg-white p-4 rounded mb-4">
            <QRCode value={bitcoinUri} size={180} />
          </div>
          <div className="mb-2 text-center break-all">
            <div className="font-mono text-xs">{BITCOIN_ADDRESS}</div>
            <div className="font-mono text-xs">Amount: {totalBtc} BTC</div>
          </div>
          <button
            className="mt-4 w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400"
            onClick={() => {
              setShowCheckout(false);
              clearCart();
            }}
          >
            Back to Store
          </button>
        </div>
      )}
    </div>
  );
}
