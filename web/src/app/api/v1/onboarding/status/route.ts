import { NextRequest } from "next/server";
import { getActor, jsonOk, mapDomainError } from "@/lib/api/http";
import { store } from "@/lib/domain/store";

export async function GET(request: NextRequest) {
  const actor = getActor(request);
  try {
    const status = store.getOnboardingStatus(actor.userId);
    return jsonOk(status);
  } catch (error) {
    return mapDomainError(error);
  }
}
