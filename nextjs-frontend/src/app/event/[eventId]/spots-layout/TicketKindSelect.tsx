"use client";

import { selectTicketKindAction } from "@/actions";

export type TicketKindSelectProps = {
  defaultValue: "FULL" | "HALF";
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
          await selectTicketKindAction(e.target.value as "FULL" | "HALF");
        }}
      >
        <option value="FULL">Inteira - {formattedFullPrice}</option>
        <option value="HALF">Meia-entrada - {formattedHalfPrice}</option>
      </select>
    </>
  );
}
