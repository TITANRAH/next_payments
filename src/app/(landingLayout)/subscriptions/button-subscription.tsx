"use client";
import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";


interface Props {
  price: any
}

export function ButtonSubcription(props: Props) {

  const {price} = props;

  console.log({price})
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        try {
          const result = await fetch("/api/checkout/subscription", {
            method: "POST",
            body: JSON.stringify({ priceId: price.id }),
            cache: 'no-store'
          });

          console.log('result desde buttonsuscribe', result)
          const data = await result.json();

          console.log(result.status);
          if (result.status === 401) {
            return router.push("/auth/login");
          }

          window.location.href = data.url;
        } catch (error) {
          console.log(error);
        }
      }}
    >
      Pagar Subscripción {price.unit_amount / 100}$
    </Button>
  );
}
