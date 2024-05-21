import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CartStore {
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (product: any) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      cart: [],
      addToCart: (product) =>
        // toma el estado actual del carro y le añade un producto 
        set((state) => ({ cart: [...state.cart, product] })),
        // clasico filter para remover productos
      removeFromCart: (product) =>
        set((state) => ({
          cart: state.cart.filter((p) => p.id !== product.id),
        })),
    }),
    // nombre al usar persist
    { name: "cartStore" }
  )
);
