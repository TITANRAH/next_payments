import { client } from "@/libs/mercadopago";
import { Payment } from "mercadopago";
import { redirect } from "next/navigation";
import React from "react";

interface Props {
  searchParams: {
    payment_id: string;
  };
}

async function checkPayment(paymentId: string) {
  try {
    console.log("entro a checkPayment");

    const payment = await new Payment(client).get({
      id: paymentId,
    });
    console.log(paymentId);

    // informacion del pago al tomar el query params id payment
    // eta url se la puse al ralizar el pago y aqui llegara con el dato

    console.log(payment);

    if (payment.status !== "approved") {
      return <div>Hubo un error en la transaccion</div>;
    }
  } catch (error) {
    console.log(error);

    redirect("/cart");
  }
}

async function MercadoPagoSuccessPage(props: Props) {
  const { searchParams } = props;

  if (!searchParams.payment_id) {
    return <div>Hubo un error en la transaccion</div>;
  }

  await checkPayment(searchParams.payment_id);

  return <div>Gracias por su compra</div>;
}

export default MercadoPagoSuccessPage;
