"use client";

import { checkoutAction } from "@/actions";
import { ErrorMessage } from "@/components/ErrorMessage";
import { PropsWithChildren } from "react";
import { useFormState } from "react-dom";

type GetCardHashParams = {
  cardName: string;
  cardNumber: string;
  expireDate: string;
  cvv: string;
};

export async function getCardHash(params: GetCardHashParams) {
  return Math.random().toString(36).substring(7);
}

export type CheckoutFormProps = {
  className?: string;
};

export function CheckoutForm({
  children,
  className,
}: PropsWithChildren<CheckoutFormProps>) {
  const [state, formAction] = useFormState(checkoutAction, {
    error: null as string | null,
  });

  return (
    <form
      action={async (formData: FormData) => {
        const card_hash = await getCardHash({
          cardName: formData.get("card_name") as string,
          cardNumber: formData.get("cc") as string,
          expireDate: formData.get("expire_date") as string,
          cvv: formData.get("cvv") as string,
        });
        formAction({
          cardHash: card_hash,
          email: formData.get("email") as string,
        });
      }}
      className={className}
    >
      {state?.error && <ErrorMessage error={state.error} />}
      <input type="hidden" name="card_hash" />
      {children}
    </form>
  );
}
