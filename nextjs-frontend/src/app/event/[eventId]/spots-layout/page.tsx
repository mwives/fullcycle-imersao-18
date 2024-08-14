import { cookies } from "next/headers";
import Link from "next/link";

import { EventImage } from "@/components/EventImage";
import { SpotSeat } from "@/components/SpotSeat";
import { Title } from "@/components/Title";
import { EventModel, SpotModel } from "@/models";
import { TicketKindSelect } from "./TicketKindSelect";

async function getSpots(eventId: string): Promise<{
  event: EventModel;
  spots: SpotModel[];
}> {
  const response = await fetch(
    `${process.env.GOLANG_API_URL}/events/${eventId}/spots`,
    {
      headers: {
        "api-key": process.env.GOLANG_API_TOKEN as string,
      },
      cache: "no-store",
      next: {
        tags: [`events/${eventId}`],
      },
    },
  );
  return response.json();
}

export default async function SpotsLayoutPage({
  params: { eventId },
}: {
  params: { eventId: string };
}) {
  const { event, spots } = await getSpots(eventId);
  const rows = Array.from(new Set(spots.map((spot) => spot.name[0]))).sort();
  const spotSGroupedByRow = rows.map((row) => ({
    row,
    spots: spots
      .filter((spot) => spot.name[0] === row)
      .sort((a, b) => {
        const aNumber = parseInt(a.name.slice(1));
        const bNumber = parseInt(b.name.slice(1));
        if (aNumber < bNumber) return -1;
        if (aNumber > bNumber) return 1;
        return 0;
      }),
  }));

  const cookieStore = cookies();
  const selectedSpots: string[] = JSON.parse(
    cookieStore.get("spots")?.value || "[]",
  );
  const ticketKind: string = cookieStore.get("ticketKind")?.value || "FULL";
  const totalPrice =
    selectedSpots.length *
    (ticketKind === "HALF" ? event.price / 2 : event.price);
  const formattedTotalPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(totalPrice);

  return (
    <main className="mt-10">
      <div className="flex w-[1176px] max-w-full flex-row flex-wrap justify-center gap-x-8 rounded-2xl bg-secondary p-4 md:justify-normal">
        <EventImage src={event.image_url} alt={event.name} />
        <div className="flex max-w-full flex-col gap-y-6">
          <div className="flex flex-col gap-y-2">
            <p className="text-sm font-semibold uppercase text-subtitle">
              {/* SÁBADO, 11/05/2024 */}
              {new Date(event.date).toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </p>
            <p className="text-2xl font-semibold">{event.name}</p>
            <p className="font-normal">{event.location}</p>
          </div>
          <div className="flex h-[128px] flex-wrap justify-between gap-x-3 gap-y-5">
            <div className="flex flex-col gap-y-2">
              <p className="font-semibold">Organizador</p>
              <p className="text-sm font-normal">{event.organization}</p>
            </div>
            <div className="flex flex-col gap-y-2">
              <p className="font-semibold">Classificação</p>
              <p className="text-sm font-normal">{event.rating}</p>
            </div>
          </div>
        </div>
      </div>

      <Title className="mt-10">Escolha seu lugar</Title>
      <div className="mt-6 flex flex-wrap justify-between">
        <div className="mb-4 flex w-full max-w-[650px] flex-col gap-y-8 rounded-2xl bg-secondary p-6">
          <div className="rounded-2xl bg-bar py-4 text-center text-[20px] font-bold uppercase text-white">
            Palco
          </div>
          <div className="md:w-full md:justify-normal">
            {spotSGroupedByRow.map(({ row, spots }) => {
              return (
                <div
                  key={row}
                  className="mb-3 flex flex-row items-center gap-3"
                >
                  <div className="w-4">{row}</div>
                  <div className="ml-2 flex flex-row">
                    {spots.map(({ name, status }) => {
                      return (
                        <SpotSeat
                          key={name}
                          spotId={name}
                          spotLabel={name.slice(1)}
                          eventId={event.id}
                          selected={selectedSpots.includes(name)}
                          disabled={status === "sold"}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex w-full flex-row justify-around">
            <div className="flex flex-row items-center">
              <span className="mr-1 block h-4 w-4 rounded-full bg-[#00A96E]" />
              Disponível
            </div>
            <div className="flex flex-row items-center">
              <span className="mr-1 block h-4 w-4 rounded-full bg-[#A6ADBB]" />
              Ocupado
            </div>
            <div className="flex flex-row items-center">
              <span className="mr-1 block h-4 w-4 rounded-full bg-[#7480FF]" />
              Selecionado
            </div>
          </div>
        </div>

        <div className="flex w-full max-w-[478px] flex-col gap-y-6 rounded-2xl bg-secondary px-4 py-6">
          <h1 className="text-[20px] font-semibold">
            Confira os valores do evento
          </h1>
          <p>
            Inteira: {event.price} <br />
            Meia-entrada: {event.price / 2}
          </p>
          <div className="flex flex-col">
            <TicketKindSelect
              defaultValue={ticketKind as any}
              price={event.price}
            />
          </div>
          <div>Total: {formattedTotalPrice}</div>
          <Link
            href="/checkout"
            className="rounded-lg bg-btn-primary py-4 text-center text-sm font-semibold uppercase text-btn-primary hover:bg-btn-primary/75"
          >
            Ir para pagamento
          </Link>
        </div>
      </div>
    </main>
  );
}
