import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface CartStore {
  cart: any[];
  addToCart: (product: any) => void;
  removeFromCart: (product: any) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (product) => {
        // validar si existe el producto par ver si se le suma uno o se agrega el producto
        // si esta sumarle uno a la cantidad del producto
        // si no esta agregar el pdoducto al carro

        const productInCart = get().cart.find((p) => p.id === product.id);

        if (productInCart) {
          // si encuentra un procuto el carrito
          // newCart es igual al mapeo de carrito obteniendo cada producto comparandolo si es igual al producto que se 
          // quiere añadir si es asi, agrega el producto pero tambien agrega un campo cantidad mas 1 , si no coinciden deja el produco
          const newCart = get().cart.map((p) =>
            p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p
          );

          set((state) => ({
            cart: newCart
          }))

          return;
        }

        set((state) => ({
          cart: [...state.cart,{ ...product, quantity: 1}],
        }));
      },
      // toma el estado actual del carro y le añade un producto
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
