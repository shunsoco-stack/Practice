import { NextRequest } from "next/server";
import { getActor, jsonOk, mapDomainError } from "@/lib/api/http";
import { store } from "@/lib/domain/store";

interface Params {
  sessionId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> },
) {
  const actor = getActor(request);
  const { sessionId } = await context.params;
  try {
    const session = store.getKycSessionForUser(actor.userId, sessionId);
    return jsonOk({
      sessionId: session.id,
      status: session.status,
      provider: session.provider,
      redirectUrl: session.redirectUrl,
      returnPath: session.returnPath,
    });
  } catch (error) {
    return mapDomainError(error);
  }
}
