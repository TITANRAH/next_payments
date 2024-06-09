import { client } from "@/libs/mercadopago";
import { PreApprovalPlan } from "mercadopago";
import { NextResponse } from "next/server";
PreApprovalPlan;

export async function POST(request: Request) {
  try {
    const plan = await new PreApprovalPlan(client).create({
    
      body: {
        
        reason: "Pago de subscripcion mensual de gimnacio",
        auto_recurring: {
          frequency: 1,
          
          frequency_type: "months",
          repetitions: 12,
          billing_day: 10,
          billing_day_proportional: true,
          free_trial: {
            frequency: 1,
            frequency_type: "months",
          },
          transaction_amount: 10000,
          currency_id: "CLP",
          
        },
        payment_methods_allowed: {
          payment_types: [],
          payment_methods: [],
        },
        back_url: "http://localhost:3000/cart",
      },
    });

    return NextResponse.json(plan);
  } catch (error) {
    console.log(error);

    return NextResponse.json("ERROR", { status: 400 });
  }
}
