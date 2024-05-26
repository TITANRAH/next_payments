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
  const request = new paypal.orders.OrdersCreateRequest();
  const cart = await req.json();

//   console.log(cart);
    
  // quiero los ids de los productos en el cart
  const productsIds = cart.map((product: any) => product.id);

//   console.log(productsIds);

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productsIds,
      },
    },
  });

//   console.log({products});
  

  // const total = products.reduce((acc, p) => acc + p.price, 0)

  // por cada producto de la bd lo busco en el carrito y si coincide le coloco su cantidad
  // tomo los productos consultados de bd y les agrego la cantidad para el uso en front 
//   del backend no me trae la cantidad yo tome los productos de backend y aqui les agregue el campo cantidad
// luego los sumo primero multiplico 2 x20 40 lueego el otro producto 3 x 10 30 luego los usmo 40 mas 30 paga 70
  const productsWhitQuantity = products.map((product) => {
    const productInCart = cart.find((p: any) => p.id === product.id);

    return {
      ...product,
      quantity: productInCart.quantity,
    };
  });

//   console.log({productsWhitQuantity})

  const total = productsWhitQuantity.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

//   console.log({total});
  

  request.requestBody({
    // capture es pago unico
    intent: "CAPTURE",
    // este es como el line-items de stripe es un arrego de productos
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          // paypal si acepta decimales stripe acepta solo enteros
          value: total.toString(),
        },
      },
    ],
  });

  const response = await client.execute(request);
  console.log(response.result);

  // aqui deberiamos retornar en el id de la orden
  return NextResponse.json({
    id: response.result.id,
    status: response.result.status,
  });
}


// 1. recibo el Carrito 
// 2. luego sacamos del carrito los productsIds
// 3. buscamos en base de datos los productos 
// 4. asigno la cantidad a cada 1 
// 5. recorro los productos y multiplico la canitdad por el precio y voy sumandolas
// 6. se lo damos a paypal para que cobre por mi