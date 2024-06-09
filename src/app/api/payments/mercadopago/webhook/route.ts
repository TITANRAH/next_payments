"use server";

import { client } from "@/libs/mercadopago";
import { Payment } from "mercadopago";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";

// le digo al webhook que a esta ruta neceisto que llegue la info cuando se compre algo en mi plataforma
// extraigo el body cuando se genere un pago
// extraigo el id del pago desde el body

// instancio a Payment opara saber el estado del pago

export async function POST(request: NextRequest) {
  console.log("entro al webhook");

  // tambien puedo llamar a los headers asi
  console.log(request.headers.get("x-request-id"));

  const body = await request.json();
  console.log(body);
  const ListHeaders = headers();
  //   de los headers tomo esta propiedad x-request-id
  const xRequestId = ListHeaders.get("x-request-id");
  console.log(xRequestId);
  //   y esta propiedad
  const xSignature = ListHeaders.get("x-signature") as string;
  console.log(xSignature);

  //   valida datos de forma segura
  //   tambien tomo los parametros de la url
  const { searchParams } = new URL(request.url);
  console.log(searchParams);
  //   y de los parametros extraigo este parametro
  const id = searchParams.get("data.id");
  console.log(id);

  //   luego de los headers tome xSignature y lo corte por la coma extrayendo ts y signature
  let [ts, signature] = xSignature.split(",");
  //   luego corte ambos por el signo igual y tome solo el valor
  ts = ts.split("=")[1];
  signature = signature.split("=")[1];
  console.log(ts);
  console.log(signature);

  //   cree el template que necesita para la convinacion que compara el secreto que me entrego la app en mercado pago
  const signatureTemplate = `id:${id};request-id:${xRequestId};ts:${ts};`;

  console.log(signatureTemplate);

  console.log(process.env.MERCADOPAGO_WEBHOOK_SECRET_KEY!);
  //   creo la variable que sera comparada finalmente con el signature extraido de los parametros de la url
  const cyphedSignature = crypto
    .createHmac("sha256", process.env.MERCADOPAGO_WEBHOOK_SECRET_KEY!)
    .update(signatureTemplate)
    .digest("hex");

  console.log(
    "comparacion signature cyphedSignature",
    signature,
    cyphedSignature
  );

  //   si no son iguales entra al if y se detiene el proceso y falla la seguridad
  if (cyphedSignature !== signature) {
    console.log("no son iguales");

    return NextResponse.json({ status: "Not Authorized" }, { status: 401 });
  } else {
    console.log("son iguales");
  }

  //   consulta de forma segura si pasa la seguridad
  const paymentId = body.data.id;

  const payment = await new Payment(client).get({
    id: paymentId,
  });
  console.log(payment);

  switch (payment.status_detail) {
    case "cc_rejected_insufficient_amount":
      console.log("entro al error de saldo insufciente");
      NextResponse.json({
        message: "Algún dato de la tarjeta es inválido",
        status: 401,
      });
      break;

    case "cc_rejected_bad_filled_other":
      console.log("entro al error cualquiera");
      NextResponse.json({
        message: "Ocurrió un error inesperado",
        status: 401,
      });
      break;

    case "cc_rejected_bad_filled_security_code":
      console.log("entro al error de código de seguridad");
      NextResponse.json({
        message: "Código de seguridad erroneo",
        status: 401,
      });
      break;

    case "cc_rejected_bad_filled_date":
      console.log("entro al error de fecha de vencimiento");
      NextResponse.json({
        message: "Fecha de vencimiento erronea",
        status: 401,
      });
      break;

    case "cc_rejected_bad_filled_card_number":
      console.log("entro al error de numero de tarjeta");
      NextResponse.json({
        message: "Número de tarjeta erroneo",
        status: 401,
      });
      break;
  }

  if (payment.status === "in_process") {
    const userFound = await prisma.user.findUnique({
      where: {
        id: payment.metadata.user_id,
      },
    });

    if (!userFound) {
      return NextResponse.json("User not found", { status: 401 });
    }

    console.log(userFound);

    console.log(payment.id, payment.status,payment.transaction_amount);
    
    const newPaymentRecordPending = await prisma.payments.create({
      data: {
        total: payment.transaction_amount!,
        userId: userFound!.id,
        paymentId: payment.id,
        provider: "mercadopago",
        status_payment: payment.status,
      },
    });

    console.log(newPaymentRecordPending);

    return;
  }

  //   actualizar el usuario en la bd y actualziar el esstado del pedido

  //   aqui para pagar hay que tomar el tunel la url y auteticarse}

  const userFound = await prisma.user.findUnique({
    where: {
      id: payment.metadata.user_id,
    },
  });

  console.log(userFound);

  if (!userFound) {
    return NextResponse.json("User not found", { status: 401 });
  }

  const newPaymentRecord = await prisma.payments.create({
    data: {
      total: payment.transaction_amount!,
      userId: userFound.id,
      paymentId: payment.id,
      provider: "mercadopago",
      status_payment: payment.status,
    },
  });

  console.log(newPaymentRecord);

  return NextResponse.json({ status: "ok" });
}
