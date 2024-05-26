"use client";

import { useCartStore } from "@/store/cartStore";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";


function PayPalButton() {
  // console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)

  // llamo al carrito
  const cart = useCartStore((state) => state.cart);
  const router = useRouter();
  const {data: session} = useSession()
  return (
    <PayPalScriptProvider
      options={{ clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}` }}
    >
      {/* si le pongo vertical puedo ver pago por paypal o por tarjeta de credito en este caso se dejara horizontal */}
      <PayPalButtons
        style={{ layout: "horizontal", color: "blue" }}
        createOrder={async (data, actions) => {

          if(!session) {
            router.push('/auth/login')
          }

          const response = await fetch("/api/checkout/paypal", {
            method: "POST",
            body: JSON.stringify(cart),
          });
          console.log(data, actions);
          // le enviamos la peticion al back el back devuelve un id
          const { id, status } = await response.json();

          console.log(id);
          console.log(status);

          // cuando responda el backend respondera un id
          return id;
        }}
        onApprove={async (data, actions) => {
          console.log({ data, actions });

          // con esto realiza la transaccion y guarda en el dashboard de paypal
          await actions.order?.capture();

          // aqui ya essta realizado el pago
        }}
        onCancel={(data, actions) => {
          console.log({ data, actions });
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;
