import { NextResponse } from "next/server";
import paypal from "@paypal/checkout-server-sdk";
import prisma from "@/libs/prisma";


const clientId = process.env.PAYPAL_CLIENT_ID;
const secret = process.env.PAYPAL_CLIENT_SECRET;

// con esto le decimos cual es la app
const environment = new paypal.core.SandboxEnvironment(clientId!, secret!);

// a que entorno recibira peticiones
const client = new paypal.core.PayPalHttpClient(environment);

export async function POST(req: Request) {
  
    const request = new paypal.orders.OrdersCreateRequest()
    const data = await req.json();

    console.log(data)

    const products = await prisma.product.findMany({
        where: {
            id: {
                in: data.productsId
            }
        }
    })

    const total = products.reduce((acc, p) => acc + p.price, 0)

    request.requestBody({
        // capture es pago unico
        intent: 'CAPTURE',
        // este es como el line-items de stripe es un arrego de productos
        purchase_units: [
            {
                amount: {
                    currency_code: 'USD',
                    // paypal si acepta decimales stripe acepta solo enteros
                    value: total.toString()
                }
            }
        ]
    })

    const response = await client.execute(request)
    console.log(response.result)

    // aqui deberiamos retornar en el id de la orden
  return NextResponse.json({ 
    id: response.result.id,
    status: response.result.status
});
}
