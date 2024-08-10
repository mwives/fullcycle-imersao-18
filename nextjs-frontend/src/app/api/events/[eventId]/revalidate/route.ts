import { revalidateTag } from "next/cache";
import { NextRequest } from "next/server";

export function POST(
  _request: NextRequest,
  { params: { eventId } }: { params: { eventId: string } },
) {
  revalidateTag("events");
  revalidateTag(`events/${eventId}`);
  return new Response(null, { status: 204 });
}
