import axios from "axios";
import { NextResponse } from "next/server";


// con esta funcion accedo al token de paypal segun mis credenciales
export async function getAccessToken() {
  const url = `${process.env.PAYPAL_API_URL}/v1/oauth2/token`;

  console.log({url});
  

  try {
    const response = await axios.post(url, "grant_type=client_credentials", {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",

        // asi lo pide paypal
        Authorization: `Basic ${Buffer.from(
          `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
        ).toString("base64")}`,
      },
    });

    

    const { access_token } = await response.data;
    console.log(access_token)

    return access_token;
  } catch (error) {
    console.log(error);
    return NextResponse.json("error", {
      status: 500,
    });
  }
}
