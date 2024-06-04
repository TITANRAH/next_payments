import { getAccessToken } from "@/libs/paypal";
import prisma from "@/libs/prisma";
import axios from "axios";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/authOptions";



export async function POST() {

  
  try {
    const session = await getServerSession(authOptions)
    console.log(`${process.env.PAYPAL_API_URL}/v1/billing/subscriptions`);

    //   llamo a la funcion que me entrega el token y lo mando por los headers
    const token = await getAccessToken();

    console.log({ token });
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    //   como necesita cobrar en el futuro
    //   tomo la fecha actual
    const startTime = new Date();

    //   le sumo una hora
    startTime.setHours(startTime.getHours() + 1);

    //   lo convieto a toisosting
    const formattedtOIsoString = startTime.toISOString();

    const response = await axios.post(
      `${process.env.PAYPAL_API_URL}/v1/billing/subscriptions`,
      {
        plan_id: "P-1C678812KM331372CMZOIUVY",
        start_time: formattedtOIsoString,
        shipping_amount: {
          currency_code: "USD",
          value: "10.00",
        },
        subscriber: {
          name: {
            given_name: "FooBuyer",
            surname: "Jones",
          },
          email_address: "foobuyer@example.com",
          shipping_address: {
            name: {
              full_name: "John Doe",
            },
            address: {
              address_line_1: "2211 N First Street",
              address_line_2: "Building 17",
              admin_area_2: "San Jose",
              admin_area_1: "CA",
              postal_code: "95131",
              country_code: "US",
            },
          },
        },
        application_context: {
          brand_name: "Example Inc",
          locale: "en-US",
          shipping_preference: "SET_PROVIDED_ADDRESS",
          user_action: "SUBSCRIBE_NOW",
          payment_method: {
            payer_selected: "PAYPAL",
            payee_preferred: "IMMEDIATE_PAYMENT_REQUIRED",
          },
          // "return_url": "https://example.com/return",
          // "cancel_url": "https://example.com/cancel"
          return_url: "http://localhost:3000/api/payments/paypal/success",
          cancel_url: "http://localhost:3000/dashboard/subscriptions",
        },
      },
      {
        headers: headers,
      }
    );

    console.log(response.data);
   
    const userUpdate = await prisma.user.update({
      where: {
        id: session?.user.id
      },
      data: {
        subscriptionId: response.data.id,
        status: response.data.status
      }
    })

    console.log(userUpdate);
    
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.log(error);

    return NextResponse.json("error", {
      status: 500,
    });
  }
}
