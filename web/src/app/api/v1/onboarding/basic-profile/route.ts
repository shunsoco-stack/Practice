import { NextRequest } from "next/server";
import {
  getActor,
  jsonOk,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import { basicProfileSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

export async function GET(request: NextRequest) {
  const actor = getActor(request);
  try {
    const profile = store.getBasicProfile(actor.userId);
    return jsonOk(profile);
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function POST(request: NextRequest) {
  const actor = getActor(request);
  const parsed = await parseJsonBody(request, basicProfileSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  try {
    const profile = store.completeBasicProfile(actor.userId, parsed.data);
    return jsonOk(profile);
  } catch (error) {
    return mapDomainError(error);
  }
}
