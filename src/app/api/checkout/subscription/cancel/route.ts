// import { authOptions } from "@/libs/authOptions";
// import { getServerSession } from "next-auth";
// import Stripe from "stripe";
// import prisma from "@/libs/prisma";
// import { NextResponse } from "next/server";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// // cancel subscription
// export async function POST(request: Request) {
//   // session

//   try {
//     const session = await getServerSession(authOptions);

//     if (!session) {
//       return new Response(null, {
//         status: 401,
//       });
//     }

//     const user = await prisma.user.findUnique({
//       where: {
//         id: session.user.id,
//       },
//     });

//     if (!user?.subscriptionId) {
//       return new Response(null, {
//         status: 400,
//       });
//     }

//     await stripe.subscriptions.cancel(
//       user.subscriptionId as string
//     );

//     const userUpdated = await prisma.user.update({
//       where: {
//         id: session.user.id,
//       },
//       data: {
//         subscriptionId: null,
//       },
//     });

//     return NextResponse.json(userUpdated);
//   } catch (error) {
//     console.error(error);
//     return new Response(null, {
//       status: 500,
//     });
//   }
// }

import { authOptions } from "@/libs/authOptions";
import prisma from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

console.log(process.env.STRIPE_SECRET_KEY!);
export async function POST(request: Request) {


  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect("/login");
    }
    // traigo al usuario por la sesion
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });

    // pregunto si tiene suscripcion si no respondon null y 401
    if (!user?.subscriptionId) {
      return new Response(null, {
        status: 401,
      });
    }

    // si tiene suscripcion la cancelo  
     await stripe.subscriptions.cancel(
      user?.subscriptionId
    );
    // console.log("result de cancel suscription", result);

    // si cancela la suscripcion actualizo el dato pasando el suscription id a null
    const userUpdate = await prisma.user.update({
      where: {
        id: session!.user.id,
      },
      data: {
        subscriptionId: '',
      },
    });

    console.log('userUpdate desde cancel backend', userUpdate);

    return NextResponse.json(userUpdate);
  } catch (error) {
    console.log('error desde cancel backend ->', error);

    return new Response(null, {
      status: 400,
    });
  }
}
