import { getAccessToken } from "@/libs/paypal";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const token = await getAccessToken();
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await axios.get(
    `${process.env.PAYPAL_API_URL}/v1/billing/plans?page_size=10&page=1&total_required=true`,
    {
        headers: headers
    }
  )

  return NextResponse.json(response.data);
}
