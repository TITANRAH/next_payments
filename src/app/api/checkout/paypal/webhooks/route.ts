import prisma from "@/libs/prisma";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

// aca recibo todas las acciones de los botones y puedo decidir que hacer 

export async function POST(request: NextRequest) {
  const event = await request.json();
  console.log(event);

  switch (event.event_type) {
    case "BILLING.SUBSCRIPTION.CREATED":
      console.log("subscription actived", event);
      break;
    case "BILLING.SUBSCRIPTION.ACTIVATED":
      console.log("subscription actived", event);
      break;
    case "BILLING.SUBSCRIPTION.CANCELLED":
      console.log("subscription cancel", event);
      // busco al usuario segun si el evento id es igual al evento en bd

      const userSubscribed = await prisma.user.findFirst({
        where: {
          subscriptionId: event.resource.id,
        },
      });

      console.log('userSubscribed',userSubscribed)

      // si no encuentro usuario chao
      if (!userSubscribed) {
        NextResponse.json("User not found", {
          status: 404,
        });
      }

      // si encuentro usuario actualiza el dato de sstatus
      await prisma.user.update({
        where: {
          id: userSubscribed!.id,
        },
        data: {
          status: event.resource.status,
          //   subscriptionId: null,
        },
      });

      if(new Date(event.start_time) > new Date()) {
        //cancelar suscripcion

        console.log('suscripcion cancelada');
        
      }

      console.log('aun puedes usar la suscripcion');
      
      break;

    case "BILLING.SUBSCRIPTION.FAILED":
      console.log("fallo el pago");
      break;
    default:
      break;
  }
  return NextResponse.json("ok");
}
