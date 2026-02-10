import { NextRequest } from "next/server";
import {
  getActor,
  jsonOk,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import { sendMessageSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

interface Params {
  conversationId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<Params> },
) {
  const actor = getActor(request);
  const { conversationId } = await context.params;
  try {
    const messages = store.getMessages(actor.userId, conversationId);
    return jsonOk({ messages });
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> },
) {
  const actor = getActor(request);
  const { conversationId } = await context.params;
  const parsed = await parseJsonBody(request, sendMessageSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  try {
    const message = store.sendMessage(actor.userId, conversationId, parsed.data.body);
    return jsonOk({ message });
  } catch (error) {
    return mapDomainError(error);
  }
}
