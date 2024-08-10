"use client";

import { selectTicketKindAction } from "@/actions";

export type TicketKindSelectProps = {
  defaultValue: "full" | "half";
  price: number;
};

const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export function TicketKindSelect({
  defaultValue,
  price,
}: TicketKindSelectProps) {
  const formattedFullPrice = formatter.format(price);
  const formattedHalfPrice = formatter.format(price / 2);

  return (
    <>
      <label htmlFor="ticket-type">Escolha o tipo de ingresso</label>
      <select
        name="ticket-type"
        id="ticket-type"
        className="mt-2 rounded-lg bg-input px-4 py-[14px]"
        defaultValue={defaultValue}
        onChange={async (e) => {
          await selectTicketKindAction(e.target.value as "full" | "half");
        }}
      >
        <option value="full">Inteira - {formattedFullPrice}</option>
        <option value="half">Meia-entrada - {formattedHalfPrice}</option>
      </select>
    </>
  );
}
