import { NextRequest } from "next/server";
import { getActor, jsonOk, mapDomainError } from "@/lib/api/http";
import { store } from "@/lib/domain/store";

interface Params {
  sessionId: string;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> },
) {
  const actor = getActor(request);
  const { sessionId } = await context.params;
  try {
    const session = store.markKycSessionUnderReview(actor.userId, sessionId);
    return jsonOk({
      sessionId: session.id,
      status: session.status,
    });
  } catch (error) {
    return mapDomainError(error);
  }
}
