"use client";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  subscriptionId: any;
}
function UpdateSession(props: Props) {
  const { subscriptionId } = props;
  const { update } = useSession();
  const router = useRouter();

  useEffect(() => {
    async function updateSession() {
      console.log(update);

      // podemos actualizar datos de la sesion con update
      await update({
        subscriptionId,
      }).then((r) => {
        console.log(r);

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      });
    }
    updateSession();
  }, []);

  return <div>Actualizando Subscripción...</div>;
}

export default UpdateSession;
