
import { authOptions } from "@/libs/authOptions";
import { getServerSession } from "next-auth";
import { Stripe } from "stripe";
import { ButtonUnsubscribe } from "./ButtonUnsubscribe";
import { ButtonSubscribe } from "./ButtonSubscribe";
import prisma from "@/libs/prisma";

export const dynamic = "force-dynamic";

// instancio a stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


async function ProfilePage() {

  // traigo la session activa si no hay returna null
  const session = await getServerSession(authOptions);
  if (!session) {
    return null;
  }

  console.log('session desde page profile', session)

  // encuentro al usuario que iniico sesion 
  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  // console.log(session);
  // creo una variable let 
  let subscription = null;


  // llamo a la suscripcion de la session
  if (user!.subscriptionId) {
    subscription = await stripe.subscriptions.retrieve(
      user?.subscriptionId!
    );
  }
  // console.log(subscription);

  return (
    <div className="text-center py-10 text-2xl text-white">
      <div>
        <h1 className="text-2xl text-white font-bold">{user?.name}</h1>
        <h2 className="text-2xl text-white font-bold">{user?.email}</h2>
        {/* si tiene una suscripcion */}
        {user!.subscriptionId ? (
          <>
            <h1>Current Plan: {subscription!.plan!.amount! / 100}$</h1>
            <div className="flex justify-center">
              <ButtonUnsubscribe />
            </div>
          </>
        ) : (
          <div>
            <h1>You have canceled your subscription</h1>
            <ButtonSubscribe />
          </div>
        )}
      </div>
    </div>
  );
}

// import { authOptions } from "@/libs/authOptions";
// import { getServerSession } from "next-auth";
// import Stripe from "stripe";
// import prisma from "@/libs/prisma";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// async function ProfilePage() {
//   obten la suscripcion del usuario en sesion

//   const session = await getServerSession(authOptions);
//   if (!session) {
//     return null;
//   }

//   const user = await prisma.user.findUnique({
//     where: {
//       id: session.user.id,
//     },
//   });
//   console.log(session);

//   let subscription;
//   if (user?.subscriptionId) {
//     subscription = await stripe.subscriptions.retrieve(
//       session?.user?.subscriptionId as string
//     );
//     console.log("subscription->", { subscription });
//   }
//   console.log(session)
//   return (
//     <div className="text-center py-10">
//       <h1 className="text-2xl text-white font-bold">{session?.user.name}</h1>
//       <h1 className="text-2xl text-white font-bold">{session?.user.email}</h1>

//       {user!.subscriptionId ?? (
//           <>
//             <h1>Current Plan: {subscription?.plan.amount / 100}$</h1>
//             <div className="flex justify-center">
//               {/* <ButtonUnsubscribe /> */}
//             </div>
//           </>
//         ) }
//     </div>
//   );
// }

export default ProfilePage;
