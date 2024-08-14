import { EventCard } from "@/components/EventCard";
import { Title } from "@/components/Title";
import { EventModel } from "@/models";

async function getEvents(): Promise<EventModel[]> {
  const response = await fetch(`${process.env.GOLANG_API_URL}/events`, {
    cache: "no-store",
    headers: {
      "api-key": process.env.GOLANG_API_TOKEN as string,
    },
  });
  return (await response.json()).events;
}

export default async function HomePage() {
  const events = await getEvents();
  return (
    <>
      <main>
        <Title>Eventos Disponíveis</Title>
        <div className="mt-8 flex flex-wrap justify-center gap-x-2 gap-y-4 sm:grid sm:grid-cols-auto-fit-cards">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </>
  );
}
