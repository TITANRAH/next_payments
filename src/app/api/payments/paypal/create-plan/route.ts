import { getAccessToken } from "@/libs/paypal";
import axios from "axios";
import { NextResponse } from "next/server";

export async function POST() {

    // const PAYPAL_API_URL = "https://api.sandbox.paypal.com";
    try {
      console.log(`${process.env.PAYPAL_API_URL}/v1/billing/plans`);
  
      //   llamo a la funcion que me entrega el token y lo mando por los headers
      const token = await getAccessToken();
  
      console.log({token})
      const headers = {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${token}`,
      };
  
      const response = await axios.post(
        `${process.env.PAYPAL_API_URL}/v1/billing/plans`,
        {

            // EL PLAN ESTA DIRECTAMENTE RELACIONADO CON EL PRODUCTO QUE HAYA CREADO CON CREATE PLAN
            "product_id": "PROD-06157844DG5037121",
            "name": "Fresh Clean Tees Plan",
            "description": "Each shirt they send out to subscribers is designed with lots of attention to detail",
            "status": "ACTIVE",
            "billing_cycles": [
                {
                    "frequency": {
                        "interval_unit": "MONTH",
                        "interval_count": 1
                    },
                    "tenure_type": "REGULAR",
                    "sequence": 1,
                    "total_cycles": 1,
                    "pricing_scheme": {
                        "fixed_price": {
                            "value": "1",
                            "currency_code": "USD"
                        }
                    }
                },

                // comento para solo generar un plan
                // {
                //     "frequency": {
                //         "interval_unit": "MONTH",
                //         "interval_count": 1
                //     },
                //     "tenure_type": "REGULAR",
                //     "sequence": 2,
                //     "total_cycles": 12,
                //     "pricing_scheme": {
                //         "fixed_price": {
                //             "value": "44",
                //             "currency_code": "USD"
                //         }
                //     }
                // }
            ],
            "payment_preferences": {
                "auto_bill_outstanding": true,
                "setup_fee": {
                    "value": "10",
                    "currency_code": "USD"
                },
                "setup_fee_failure_action": "CONTINUE",
                "payment_failure_threshold": 3
            },
            "taxes": {
                "percentage": "10",
                "inclusive": false
            }
        },
        {
          headers: headers,
        }
      );
  
      console.log(response.data);
      return NextResponse.json(response.data);
    } catch (error: any) {
      console.log(error.message);
  
      return NextResponse.json("error", {
        status: 500,
      });
    }
  }
  

  