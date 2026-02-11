import { NextRequest } from "next/server";
import {
  getActor,
  jsonOk,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import { createKycSessionSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

export async function POST(request: NextRequest) {
  const actor = getActor(request);
  const parsed = await parseJsonBody(request, createKycSessionSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  try {
    const session = store.createKycSession(actor.userId, {
      returnPath: parsed.data.returnPath,
    });
    return jsonOk(session);
  } catch (error) {
    return mapDomainError(error);
  }
}
