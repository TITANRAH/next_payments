import { authOptions } from "@/libs/authOptions";
import { getAccessToken } from "@/libs/paypal";
import prisma from "@/libs/prisma";
import axios, { AxiosError } from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest
  // {
  //   params: { subscriptionId },
  // }: {
  //   params: {
  //     subscriptionId: string;
  //   };
  // }
) {
  try {
    const userId = request.nextUrl.searchParams.get("user_id");
    const session = await getServerSession(authOptions);
    console.log('user id', userId);
    

    if (userId! !== session?.user!.id!.toString()) {
      return NextResponse.json("error ids distintos usuario y sesion", {
        status: 500,
      });
    };

    const userFound = await prisma.user.findFirst({
      where: {
        id: +userId,
      },
    });

    if (!userFound) {
      return NextResponse.json("no se encuenrta el usuario", {
        status: 500,
      });
    }

    const token = await getAccessToken();
    console.log(token);

    console.log(userFound.subscriptionId);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const res = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${userFound.subscriptionId}/cancel`,
      {
        method: "POST",
      },
      {
        headers: headers,
      }
    );

    console.log(res);

    return NextResponse.json(res.data);
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
    }

    NextResponse.json("Error", {
      status: 500,
    });
  }
}
