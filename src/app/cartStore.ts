import { create } from 'zustand';

interface CartItem {
  id: number;
  qty: number;
}

interface CartState {
  cart: CartItem[];
  addToCart: (id: number) => void;
  removeFromCart: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  cart: [],
  addToCart: (id) =>
    set((state) => {
      const found = state.cart.find((item) => item.id === id);
      if (found) {
        return {
          cart: state.cart.map((item) =>
            item.id === id ? { ...item, qty: item.qty + 1 } : item
          ),
        };
      }
      return { cart: [...state.cart, { id, qty: 1 }] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0),
    })),
  clearCart: () => set({ cart: [] }),
})); 