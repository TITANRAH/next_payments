import { authOptions } from "@/libs/authOptions";
import { getAccessToken } from "@/libs/paypal";
import prisma from "@/libs/prisma";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json("Unauthorized", {
      status: 401,
    });
  }
  // parametros que vienen en la url en la vista de success
  const subscriptionId = request.nextUrl.searchParams.get("subscription_id");
  // const baToken = request.nextUrl.searchParams.get("ba_token");
  // const token = request.nextUrl.searchParams.get("token");

  const accessToken = await getAccessToken();

  console.log({ accessToken });
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${accessToken}`,
  };

  // deberia venir d base de datos ya que es el id de una subscripcion del usuario
  const idDeSubscription = "I-RFKGGJ88XELG";

  const response = await axios.get(
    `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${subscriptionId}`,
    {
      headers: headers,
    }
  );

  if (response.data.status === "ACTIVE") {
    const updateUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        subscriptionId: response.data.id,
        status: response.data.status,
        subscriptionProvider: 'paypal',
        startedAt: response.data.start_time
        // planId: response.data.plan_id
      },
    });

    console.log(updateUser);
  }

  console.log(response.data);

  return NextResponse.json({ message: "success" });
}
