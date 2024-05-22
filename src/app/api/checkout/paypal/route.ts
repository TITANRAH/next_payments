import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";

const clientId = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;

// con esto le decimos cual es la app
const environment = new paypal.core.SandboxEnvironment(clientId!, secret!);

const client = new paypal.core.PayPalHttpClient(environment);

export async function POST() {
  
    const request = new paypal.orders.OrdersCreateRequest()

    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    value: '100.00'
                }
            }
        ]
    })

    const response = await client.execute(request)
    console.log(response.result)
  return NextResponse.json({ success: true });
}
