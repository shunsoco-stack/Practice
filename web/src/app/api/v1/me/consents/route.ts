import { NextRequest } from "next/server";
import {
  getActor,
  jsonOk,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import { consentUpdateSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

export async function GET(request: NextRequest) {
  const actor = getActor(request);
  try {
    const items = store.getConsents(actor.userId);
    return jsonOk({ items });
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function PUT(request: NextRequest) {
  const actor = getActor(request);
  const parsed = await parseJsonBody(request, consentUpdateSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  try {
    const items = store.replaceConsents(actor.userId, parsed.data.items);
    return jsonOk({ items });
  } catch (error) {
    return mapDomainError(error);
  }
}
