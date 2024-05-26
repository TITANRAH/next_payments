"use client";
import { Card, Button } from "@/components/ui";
import { useCartStore } from "@/store/cartStore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import PayPalButton from "./paypal-button";

export function CartList() {
  // traigo el estado del carrito
  const cart = useCartStore((state) => state.cart);
  // traigo el remove
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const router = useRouter();

  // traigo la sesion actual
  const { data: session } = useSession();

  console.log(session);

  return (
    <div>
      {/* recorro el stado y lo muestro  */}
      {cart.map((product) => (
        <Card key={product.id}>
          <div className="flex justify-between">
            <div>
              <img
                src={product.image}
                alt=""
                className="w-32 h-32 object-cover object-center"
              />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>{product.price}</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex flex-row gap-2 mb-5 items-center">
                <Button>-</Button>
                <span>{product.quantity}</span>
                <Button>+</Button>
              </div>
              <Button onClick={() => removeFromCart(product)}>
                Remove from cart
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button
          onClick={async () => {
            // si no esta autenticado envialo a login
            if (!session) {
              return router.push("/auth/login");
            }

            const result = await fetch("/api/checkout", {
              method: "POST",
              body: JSON.stringify(cart),
            });
            const data = await result.json();

            if (result.ok) {
              window.location.href = data.url;
            }
          }}
        >
          Pagar {cart.reduce((acc, p) => acc + p.price * p.quantity, 0)} $
        </Button>

        <PayPalButton />
      </div>
    </div>
  );
}
