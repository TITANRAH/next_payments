import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// secreto key de cuenta stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// poner revelar firma en la cuenta de strapi al crear el webhook
const endpointSecret = "whsec_XNyHdwe9mI9CnFCq67ZXGA9ZI5Fs4PAd";

export async function POST(req: Request) {
  console.log("entro solito al webhook por config en stripe.com");
  //   const sig = req.headers["stripe-signature"];
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json(
      { "Webhook Error": "No Signature" },
      { status: 400 }
    );
  }
  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err: any) {
    console.log("error------>", err);
    return NextResponse.json({ "Webhook Error": err.message }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed

      console.log(
        "info de switch check completed ->",
        checkoutSessionCompleted
      );

      // encuentra al usuario y actualiza su rol ya que pago ahora su rol es suscriptor no user 
      const userFound = await prisma.user.update({
        where: {
          id: +checkoutSessionCompleted.metadata!.userId,
        },
        data: {
          role: "suscriber",
        },
      });

      console.log('userFound desde webhook',{userFound})

      break;
    // aca puedo poner los eventos que necesite
    default:
      console.log(`Unhandled event type ${event.type}`);
    //   }
  }
  return NextResponse.json({ received: true });
}
