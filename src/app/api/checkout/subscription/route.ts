"use server";

import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";

const secretStripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = new Stripe(secretStripeKey!);

export async function POST(request: Request) {




  // OBTENER ID DE USUARIO

  const session = await getServerSession(authOptions)
  const body = await request.json()
  console.log('session --->',{session});

  // necesita estar autenticado para realizar la operacion
  if(!session){
    return NextResponse.json({
      error: 'Necesitas estar autenticado'
    }, {
      status: 401
    })
  }
  
  // GENERAR ORDEN DE COMPRA
  // para comenzar creamos una sesion de cero, comenzando proceso de compra
  // esta funcion llama al darle a comprar
 const result = await stripe.checkout.sessions.create({
    // medio de pagoPF
    payment_method_types: ["card"],
    line_items: [
      {
        // este id me dio al crear el producto recurrente
        // pero ahora puedo tomar del body el id del prodcgto recurrecnte sleeccionado
        price: body.priceId,
        // price_data: {
        //   currency: "usd",
        //   product_data: {
        //     name: "Digital Suscription",
        //   },

        //   // 1000 centavos son 10 dolare
        //   unit_amount: 1000,
        // },
        quantity: 1,
      },
    ],
    // estos parametros som para saber donde tiene que volver los arreglos en aso de exito o de cancelar
    success_url: 'http://localhost:3000/success',
    cancel_url: 'http://localhost:3000/products',
    mode: 'subscription',
    // metadata es valores personalizable como id de usuario autenticado etc
    metadata: {
      "hello": "world",
      "test": 123,

      // arriba puse la condicion de que exista
      "userId": session?.user.id
    }
  });

  // al ver el result el campo url es el que nos importa de la devolucion 
  console.log('result', {result});
  
  return NextResponse.json({ url: result.url });
}
