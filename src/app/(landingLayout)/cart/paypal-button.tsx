'use client'

import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useCartStore } from "@/store/cartStore";

function PayPalButton() {
  // console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)

// llamo al carrito 
  const cart = useCartStore((state) => state.cart)
  return (
    <PayPalScriptProvider
      options={{ clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID}` }}
    >
      {/* si le pongo vertical puedo ver pago por paypal o por tarjeta de credito en este caso se dejara horizontal */}
      <PayPalButtons
        style={{ layout: "horizontal", color: "blue" }}
        createOrder={async (data, actions) => {
          const response = await fetch("/api/checkout/paypal", {
            method: "POST",
            body: JSON.stringify({
              productsIds: cart.map((product) => product.id)
            })
          });
          console.log(data, actions);
          // le enviamos la peticion al back el back devuelve un id 
          const { id , status} = await response.json();

          console.log(id);
          console.log(status);

          // cuando responda el backend respondera un id
          return id;
        }}
        onApprove={async(data, actions) => {
          
          console.log({ data, actions });

          // con esto realiza la transaccion y guarda en el dashboard de paypal
          await actions.order?.capture()
          
        }}
        onCancel={(data, actions) => {
          console.log({ data, actions });
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;
