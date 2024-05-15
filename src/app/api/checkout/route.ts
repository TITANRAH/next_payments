// import { NextResponse } from "next/server";
// import Stripe from "stripe";
// import prisma from "@/libs/prisma";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/libs/authOptions";

// import { NextResponse } from "next/server";

// // en directorio api crear checkout page ,realizar funcion

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// export async function POST(request: Request) {
//   const data = await request.json();
//   const productsIds = data.map((product: any) => product.id);
//   const session = await getServerSession(authOptions);
// z
//   const products = await prisma.product.findMany({
//     where: {
//       id: {
//         in: productsIds,
//       },
//     },
//   });

//   const result = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     metadata: {
//       userId: session?.user.id,
//       productsIds: productsIds.join(","), // "1,2,3"
//     },
//     line_items: [
//       ...products.map((product) => ({
//         price_data: {
//           currency: "usd",
//           product_data: {
//             name: product.name,
//             // images: [product.image],
//           },
//           unit_amount: product.price * 100,
//         },
//         quantity: 1,
//       })),
//     ],
//     success_url: "http://localhost:3000/success",
//     cancel_url: "http://localhost:3000/cart",
//     // pago por suscripción
//     mode: "payment",
//   });

//   console.log(result);

//   return NextResponse.json({ url: result.url });
// }

"use server";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";

const secretStripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secretStripeKey!);

export async function POST() {
  const session = await getServerSession(authOptions);

  // para comenzar creamos una sesion de cero, comenzando proceso de compra
  // esta funcion llama al darle a comprar
 const result = await stripe.checkout.sessions.create({
    // medio de pago
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "T-shirt",
          },

          // 2000 centavos son 20 dolare
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    // estos parametros som para saber donde tiene que volver los arreglos en aso de exito o de cancelar
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/products',
    mode: 'payment',
    metadata: {
      "userId": session?.user.id!
    }
  });

  // al ver el result el campo url es el que nos importa de la devolucion 
  console.log('result', {result});
  
  return NextResponse.json({ url: result.url });
}
