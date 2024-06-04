import { getAccessToken } from "@/libs/paypal";
import axios from "axios";
import { NextResponse } from "next/server";

const PAYPAL_API_URL = "https://api.sandbox.paypal.com";

export async function POST() {
  try {
    console.log("product");

    //   llamo a la funcion que me entrega el token y lo mando por los headers
    const token = await getAccessToken();

    console.log({token})
    const headers = {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`,
    };

    const response = await axios.post(
      `${PAYPAL_API_URL}/v1/catalogs/products`,
      {
        name: "Video Streaming Service",
        type: "SERVICE",
        category: "SOFTWARE",
        image_url: "https://example.com/streaming.jpg",
        home_url: "https://example.com/home",
      },
      {
        headers: headers,
      }
    );

    console.log(response.data);
    return NextResponse.json(response.data);
  } catch (error) {
    console.log(error);

    return NextResponse.json("error", {
      status: 500,
    });
  }
}
