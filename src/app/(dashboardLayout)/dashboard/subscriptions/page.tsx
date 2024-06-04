"use client";

import { Button } from "@/components/ui/Button";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

function SubscriptionsPage() {
  const [link, SetLink] = useState();

  const router = useRouter();

  const { data: session } = useSession();
  async function createProduct() {
    const response = await fetch("/api/payments/paypal/create-product", {
      method: "POST",
    });

    const data = await response.json();
    console.log(data);
  }
  async function createPlan() {
    const response = await fetch("/api/payments/paypal/create-plan", {
      method: "POST",
    });

    const data = await response.json();
    console.log(data);
  }
  async function createSubscription() {
    const response = await fetch("/api/payments/paypal/create-subscription", {
      method: "POST",
    });

    const data = await response.json();
    console.log(data);
  }

  async function getSubscriptions() {
    const response = await fetch("/api/payments/paypal/get-subscription", {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);

    if (data.status === "APPROVAL_PENDING") {
      const routePay = data.links.find((link: any) => link.rel === "approve");
      console.log(routePay);
      window.location.href = routePay.href;
    }

    // APPROVAL_PENDING	The subscription is created but not yet approved by the buyer.
    // APPROVED	The buyer has approved the subscription.
    // ACTIVE	The subscription is active.
    // SUSPENDED	The subscription is suspended.
    // CANCELLED	The subscription is cancelled.
    // EXPIRED	The subscription is expired.

    // si hay data toma el link de pago el link de pago estara
    // en un arreglo de links y el que dice aprove en rel es el que es
    // if (data) {
    //   const routePay = data.links.find((link: any) => link.rel === "approve");
    //   SetLink(routePay.href);
    // }
    // una vex que pague se devolvera a donde yo le haya mandado en la url de retorno
    // como en este caso no mande nada me envia a aun apagina de ejemplo
    // traera un dato en la url y sera asi

    // https://example.com/return?subscription_id=I-SULPUCULP9H4&ba_token=BA-0YX949240X197225C&token=0U549077TS543451T
  }

  async function cancelSubscriptions() {

    console.log(session?.user.id);
    
    const response = await fetch(
      `/api/payments/paypal/cancel-subscription?user_id=${session?.user.id}`,
      {
        method: "POST",
      }
    );

    const data = await response.json();
    console.log(data);

    if (data.status === 200) {
      console.log("subscripion cancelled");
      await signOut();
      // router.push('/')
    }
  }

  return (
    <div className="flex flex-row gap-2 justify-center">
      <Button onClick={() => createProduct()}>Crear Product</Button>
      <Button onClick={() => createPlan()}>Crear Plan</Button>
      <Button onClick={() => createSubscription()}>Crear Subscription</Button>
      <Button onClick={() => getSubscriptions()}>Obtener Subscription</Button>
      <Button onClick={() => cancelSubscriptions()}>
        Cancelar Subscription
      </Button>

      {/* {link && (
        <Link href={link} className="text-white">
          PAGAR
        </Link>
      )} */}
    </div>
  );
}

export default SubscriptionsPage;
