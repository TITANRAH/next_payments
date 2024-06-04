import { authOptions } from "@/libs/authOptions";
import { getAccessToken } from "@/libs/paypal";
import prisma from "@/libs/prisma";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const token = await getAccessToken();
    const session = await getServerSession(authOptions)

    console.log({ token });
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    // deberia venir d base de datos ya que es el id de una subscripcion del usuario
    const userFound = await prisma.user.findFirst({
      where: {
        id: session?.user.id
      },
     
    });

    const response = await axios.get(
      `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${userFound!.subscriptionId}`,
      {
        headers: headers,
      }
    );

    console.log(response.data);
// esta respuesta dara entre otros links
// este 

// href: 'https://www.sandbox.paypal.com/webapps/billing/subscriptions?ba_token=BA-0YX949240X197225C',
// rel: 'approve',
// method: 'GET'

// y ese usamos para pagar finalmente y para que el campo de aproved pending pase a ser aprovado
    return NextResponse.json(response.data) ;
  } catch (error) {
    console.log(error);
    NextResponse.json(error, {
      status: 400,
    });
  }
}
