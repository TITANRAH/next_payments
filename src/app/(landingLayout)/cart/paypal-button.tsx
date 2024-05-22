import React from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

function PayPalButton() {
  // console.log(process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID)
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
          });
          console.log(data, actions);
          const resp = response.json();

          console.log(resp);

          return "";
        }}
        // onApprove={(data, actions) =>  {}}
        onCancel={(data, actions) => {}}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;
