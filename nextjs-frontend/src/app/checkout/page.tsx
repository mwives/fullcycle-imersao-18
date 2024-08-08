import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { CheckoutForm } from "@/app/checkout/CheckoutForm";
import { Title } from "@/components/Title";
import { EventModel } from "@/models";

export async function getEvent(eventId: string): Promise<EventModel> {
  return {
    id: "1",
    name: "Show de Rock",
    imageUrl: "/images/rock-in-rio.jpg",
    location: "Centro de Eventos",
    date: "2024-05-11T20:00:00",
    organization: "Rock in Rio",
    rating: "Livre",
    price: 100,
  };
}

export default async function CheckoutPage() {
  const cookiesStore = cookies();

  const eventId = cookiesStore.get("eventId")?.value;
  if (!eventId) {
    return redirect("/");
  }
  const event = await getEvent(eventId);

  const selectedSpots: string[] = JSON.parse(
    cookiesStore.get("spots")?.value || "[]",
  );
  const ticketKind = cookiesStore.get("ticketKind")?.value;

  const totalPrice =
    selectedSpots.length *
    (ticketKind === "full" ? event.price : event.price / 2);
  const formattedTotalPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalPrice);

  return (
    <main className="mt-10 flex flex-wrap justify-center md:justify-between">
      <div className="mb-4 flex max-h-[250px] w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary p-4">
        <Title>Resumo da compra</Title>
        <div className="font-semibold">
          <div>{event.name}</div>
          <div>{event.location}</div>
          {new Date(event.date).toLocaleDateString("pt-BR", {
            weekday: "long",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        <p className="font-semibold text-white">{formattedTotalPrice}</p>
      </div>

      <div className="w-full max-w-[650px] rounded-2xl bg-secondary p-4">
        <Title>Informações de pagamento</Title>
        <CheckoutForm className="mt-6 flex flex-col gap-y-3">
          <div className="flex flex-col">
            <label htmlFor="titular">E-mail</label>
            <input
              type="email"
              name="email"
              className="mt-2 h-10 rounded border-solid bg-input p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="titular">Nome no cartão</label>
            <input
              type="text"
              name="card_name"
              className="mt-2 h-10 rounded border-solid bg-input p-2"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="cc">Numero do cartão</label>
            <input
              type="card_number"
              name="cc"
              className="mt-2 h-10 rounded border-solid bg-input p-2"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="flex flex-grow flex-col">
              <label htmlFor="expire">Vencimento</label>
              <input
                type="text"
                name="expire_date"
                className="mt-2 h-10 rounded border-solid bg-input p-2"
              />
            </div>
            <div className="flex flex-grow flex-col">
              <label htmlFor="cvv">CVV</label>
              <input
                type="text"
                name="cvv"
                className="mt-2 h-10 rounded border-solid bg-input p-2"
              />
            </div>
          </div>

          <button className="mt-2 rounded-lg bg-btn-primary px-4 py-4 text-sm font-semibold uppercase text-btn-primary hover:bg-btn-primary/75">
            Finalizar pagamento
          </button>
        </CheckoutForm>
      </div>
    </main>
  );
}
