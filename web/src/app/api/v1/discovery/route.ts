import { NextRequest } from "next/server";
import { getActor, jsonOk, mapDomainError } from "@/lib/api/http";
import { toUserProfileDto } from "@/lib/domain/serializers";
import { store } from "@/lib/domain/store";

export async function GET(request: NextRequest) {
  const actor = getActor(request);
  try {
    const users = store.discovery(actor.userId).map(toUserProfileDto);
    return jsonOk({ users });
  } catch (error) {
    return mapDomainError(error);
  }
}
