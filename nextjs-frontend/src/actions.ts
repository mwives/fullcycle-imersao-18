"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function selectSpotAction(eventId: string, spotName: string) {
  const cookieStore = cookies();

  const spots: string[] = JSON.parse(cookieStore.get("spots")?.value || "[]");
  spots.push(spotName);
  const uniqueSpots = Array.from(new Set(spots));

  cookieStore.set("spots", JSON.stringify(uniqueSpots));
  cookieStore.set("eventId", eventId);
}

export async function unselectSpotAction(spotName: string) {
  const cookieStore = cookies();
  const spots: string[] = JSON.parse(cookieStore.get("spots")?.value || "[]");
  const newSpots = spots.filter((spot) => spot !== spotName);
  cookieStore.set("spots", JSON.stringify(newSpots));
}

export async function clearSpotsAction() {
  const cookieStore = cookies();
  cookieStore.set("spots", "[]");
  cookieStore.set("eventId", "");
}

export async function selectTicketKindAction(ticketKind: "FULL" | "HALF") {
  const cookieStore = cookies();
  cookieStore.set("ticketKind", ticketKind);
}

export async function checkoutAction(
  _prevState: unknown,
  {
    cardHash,
    email,
  }: {
    cardHash: string;
    email: string;
  },
) {
  const cookieStore = cookies();
  const eventId = cookieStore.get("eventId")?.value;
  const spots: string[] = JSON.parse(cookieStore.get("spots")?.value || "[]");
  const ticketKind = cookieStore.get("ticketKind")?.value || "FULL";

  const response = await fetch(`${process.env.GOLANG_API_URL}/checkout`, {
    method: "POST",
    body: JSON.stringify({
      event_id: eventId,
      card_hash: cardHash,
      ticket_kind: ticketKind,
      spots,
      email,
    }),
    headers: {
      "api-key": process.env.GOLANG_API_TOKEN as string,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return { error: "Erro ao realizar a compra" };
  }

  revalidateTag(`events/${eventId}`);
  redirect(`checkout/${eventId}/success`);
}
