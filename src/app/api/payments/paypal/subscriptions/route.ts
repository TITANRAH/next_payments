import { authOptions } from "@/libs/authOptions";
import { getAccessToken } from "@/libs/paypal";
import axios from "axios";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


// URL PARAMETROS SUBSCRIPTIONS
// http://localhost:3000/api/payments/paypal/subscriptions?id=I-PGVTSCHN505S&start_time=2024-01-01T00:00:00.000Z&end_time=2024-11-01T00:00:00.000Z
export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    const startTime = request.nextUrl.searchParams.get("start_time");
    const endTime = request.nextUrl.searchParams.get("end_time");

    // const session = await getServerSession(authOptions);

    const token = await getAccessToken();
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    console.log(id);

    // const suscriptionId = session?.user.subscriptionId;

    const response = await axios.get(
      `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions/${id}/transactions?start_time=${startTime}&end_time=${endTime}`,
      {
        headers: headers,
      }
    );

    console.log(response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error.response.data);

    return NextResponse.json("error", {
      status: 400,
    });
  }
}
