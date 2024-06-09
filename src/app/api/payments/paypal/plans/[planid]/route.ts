import { getAccessToken } from "@/libs/paypal";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

interface Props {
  params: {
    planid: string;
  };
}
export async function GET(request: NextRequest, { params }: Props) {
  // la destructuracion y el llamar a los params asi no funciona si  NO pongo el requesst primero DEBO PONER REQUEST NEXTREQUESST Y ahi funciona raro
  const { planid } = params;
  try {
    const token = await getAccessToken();
    console.log(token);

    console.log("entro a planes id");

    console.log("planid ->", planid);

    console.log(token);

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
    
    const response = await axios.get(
      `${process.env.PAYPAL_API_URL}/v1/billing/plans/${planid}`,
      {
        headers: headers,
      }
    );

    console.log(response.data);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error);
    return NextResponse.json("error", {
      status: 400,
    });
  }
}
