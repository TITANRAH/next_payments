"use client";

import { Button } from "@/components/ui";
import { useRouter } from "next/navigation";

export function ButtonSubscribe() {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {

        // console.log('hola')
        // const result = await fetch("/api/checkout/subscription", {
        //   method: "POST",
        // });
        // console.log('result', result)
        // const data = await result.json();

        // window.location.href = data.url;

        router.push('/subscriptions')
      }}
    >
      Subscribe
    </Button>
  );
}
