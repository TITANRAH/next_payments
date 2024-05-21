import prisma from "@/libs/prisma";
import { NextResponse } from "next/server";
import Stripe from "stripe";

// secreto key de cuenta stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// poner revelar firma en la cuenta de strapi al crear el webhook
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;

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
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret!);
  } catch (err: any) {
    console.log("error------>", err);
    return NextResponse.json({ "Webhook Error": err.message }, { status: 400 });
  }
  console.log("event type --->", event.type);
  switch (event.type) {
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Then define and call a function to handle the event checkout.session.completed

      console.log(
        "info de switch check completed ->",
        checkoutSessionCompleted
      );

      if (checkoutSessionCompleted.mode === "payment") {

        if(checkoutSessionCompleted.payment_status === 'paid') {

          console.log('entro al payment')
          // que usuaruo esta pegando?
          // esta data se la envie en el pago en los campos de metadata al crear la compra 
          console.log(checkoutSessionCompleted.metadata!.userId);
          const userId = checkoutSessionCompleted.metadata!.userId;
  
          // ids de producto
          console.log(checkoutSessionCompleted.metadata!.productsIds);
  
          // saco los ids de la metadata del checkoyt y los separo por ,
          const productsIds = checkoutSessionCompleted
            .metadata!.productsIds.split(",")
            .map((id) => +id);
  
          // busco al usuario con el id que viene en la metadata
          const userFound = await prisma.user.findUnique({
            where: {
              id: +userId!,
            },
          });
  
          // si no hay usuario devuelve un error
          if (!userFound) {
            return NextResponse.json(
              { "WebHook Error": "User not found" },
              {
                status: 400,
              }
            );
          }

          await prisma.user.update({
            where: {
              id: userFound.id,
            },
            data: {
              id_last_session: checkoutSessionCompleted.id
            },
          });
  
          // primero buscamos los productos en la tabla productos con los ids que trae el checkout
  
          const products = await prisma.product.findMany({
            where: {
              id: {
                in: productsIds,
              },
            },
          });
  
          console.log({ products });
  
          // sumamos los precios de los productos que trae products encontrados con la metadata del checkout
          const total = products.reduce((acc, product) => acc + product.price, 0);
  
          // creo la nueva orden en la tabla orden
          const newOrder = await prisma.order.create({
            data: {
              userId: +userId!,
              total: total,
            },
          });
  
          // aca lo que hace es generar en bd las filas una por una de los productos a comprar
          await prisma.orderDetails.createMany({
            data: products.map((product) => ({
              orderId: newOrder.id,
              productId: product.id,
              price: product.price,
              quantity: 1,
            })),
          });
  
          console.log("nueva orden desde webookh", newOrder);
        }

       

        // await prisma.order.update({
        //   where: {

        //   }
        // })

        // si lo que se devuelve tiene modo payment registro la compra ç
        // const newOrder = await prisma.order.create({
        //   // data: {},
        // });
      }

      if (checkoutSessionCompleted.mode === "subscription") {

        console.log('entro al suscription', checkoutSessionCompleted?.subscription!.toString())

        // si el mode lelga como subscription cambio el rol
        // encuentra al usuario y actualiza su rol ya que pago ahora su rol es suscriptor no user
        // pero esto cambio y en vz d cmabiar el rol le agrego un nuevo id de suscripcion
        const userFound = await prisma.user.update({
          where: {
            id: +checkoutSessionCompleted.metadata!.userId,
          },
          data: {
            subscriptionId: checkoutSessionCompleted?.subscription!.toString(),
            id_last_session: checkoutSessionCompleted.id
          },
        });

        console.log("userFound desde webhook", { userFound });
      }

      break;
    // aca puedo poner los eventos que necesite
    default:
      console.log(`Unhandled event type ${event.type}`);
    //   }
  }
  return NextResponse.json({ received: true });
}
