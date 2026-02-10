import { NextRequest } from "next/server";
import {
  getActor,
  jsonOk,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import { profilePatchSchema } from "@/lib/api/schemas";
import { toUserProfileDto } from "@/lib/domain/serializers";
import { store } from "@/lib/domain/store";

export async function GET(request: NextRequest) {
  const actor = getActor(request);
  try {
    const profile = store.getProfile(actor.userId);
    return jsonOk({ profile: toUserProfileDto(profile) });
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function PATCH(request: NextRequest) {
  const actor = getActor(request);
  const parsed = await parseJsonBody(request, profilePatchSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  try {
    const profile = store.updateProfile(actor.userId, parsed.data);
    return jsonOk({ profile: toUserProfileDto(profile) });
  } catch (error) {
    return mapDomainError(error);
  }
}
