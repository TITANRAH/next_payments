// Step 1: Import the parts of the module you want to use
import { authOptions } from "@/libs/authOptions";
import { client } from "@/libs/mercadopago";
import { Preference } from "mercadopago";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("entro al post de mercado pago new");

  try {
    //   creo la orden de compra
    // const preferenceBody = {
    //   items: [
    //     // AQUI PUEDEN IR VARIOS PRODUCTOS A LA VEZ y deben venir desde bd
    //     {
    //       id: "item-ID-1234",
    //       title: "Mi producto",
    //       currency_id: "CLP",
    //       picture_url:
    //         "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
    //       description: "Descripción del Item",
    //       category_id: "art",
    //       quantity: 1,
    //       unit_price: 10000,
    //     },
    //   ],
    //   payer: {
    //     name: "Juan",
    //     surname: "Lopez",
    //     email: "user@email.com",
    //     phone: {
    //       area_code: "11",
    //       number: "4444-4444",
    //     },
    //     identification: {
    //       type: "DNI",
    //       number: "12345678",
    //     },
    //     address: {
    //       street_name: "Street",
    //       street_number: 123,
    //       zip_code: "5700",
    //     },
    //   },
    //   back_urls: {
    //     success: "https://www.success.com",
    //     failure: "https://www.failure.com",
    //     pending: "https://www.pending.com",
    //   },
    //   auto_return: "approved",
    //   payment_methods: {
    //     excluded_payment_methods: [
    //       {
    //         id: "master",
    //       },
    //     ],
    //     excluded_payment_types: [
    //       {
    //         id: "ticket",
    //       },
    //     ],
    //     installments: 12,
    //   },
    //   notification_url: "https://www.your-site.com/ipn",
    //   statement_descriptor: "MINEGOCIO",
    //   external_reference: "Reference_1234",
    //   expires: true,
    //   expiration_date_from: "2016-02-01T12:00:00.000-04:00",
    //   expiration_date_to: "2016-02-28T12:00:00.000-04:00",
    // };

    //   creo una nueva preferencia basado en el cliente conectado
    const preference = new Preference(client);
    const session = await getServerSession(authOptions);

    console.log('sesion que se va al checkout de mp', session!.user);
    

    if (!session) {
      console.log('entro al no session oooh');
      
      return NextResponse.json({ error: "Unauthorized" }, { status: 400 });
    }
    //   respuesta de esa orden de compra de la preferencia
    const cart = await request.json();
    console.log(cart);
    const items = cart.map((product: any) => ({
      id: product.id,
      title: product.name,
      quantity: product.quantity,
      unit_price: product.price,
      currency_id: "CLP",
    }));

    console.log(items);

    const response = await preference.create({
      body: {
        items,
        back_urls: {
          success: `${process.env.MERCADOPAGO_BACKEND_URL}/mercadopago/success`,
          failure: `${process.env.MERCADOPAGO_BACKEND_URL}/mercadopago/failure`,
          pending: `${process.env.MERCADOPAGO_BACKEND_URL}/mercadopago/pending`,
        },
        auto_return: "approved",
        metadata: {
          userId: session.user.id,
        },
      },
    });

    // de esta respuesta lo que necesito es el campo init_point
    console.log(response);

    return NextResponse.json(response);
  } catch (error: any) {
    console.log(error);

    NextResponse.json("error", {
      status: 400,
    });
  }
}

// Step 2: Initialize the client object
// INICIALIZAR MERCADO PAGO
// USAR CREDENCIALES DE PRODUCCION EN LA CUENTA DE PRUEBA
