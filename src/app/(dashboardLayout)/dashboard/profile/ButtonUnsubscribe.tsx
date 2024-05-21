"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";
import { useSession } from "next-auth/react";

export function ButtonUnsubscribe() {
  const router = useRouter();
  const { update } = useSession();

  return (
    <Button
      onClick={async () => {
        const result = await fetch("/api/checkout/subscription/cancel", {
          method: "POST",
        });
        console.log('result cancel desde button unsuscribe', result);
        // const data = await result.json();
          
        const resultUpdate = await update({
          subscriptionId: null,
        });
        
        router.refresh();
        console.log('result update', resultUpdate);
      }}
    >
      Cancel Subscription
    </Button>
  );
}
