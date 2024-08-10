import { EventCard } from "@/components/EventCard";
import { Title } from "@/components/Title";
import { EventModel } from "@/models";

async function getEvents(): Promise<EventModel[]> {
  // const response = await fetch("http://localhost:8080/events", {
  //   cache: "no-store",
  // });
  // return response.json();
  return [
    {
      id: "1",
      name: "React Summit",
      organization: "ReactJS",
      date: "2022-10-10",
      price: 100,
      rating: "5",
      imageUrl: "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2",
      location: "Online",
    },
  ];
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
