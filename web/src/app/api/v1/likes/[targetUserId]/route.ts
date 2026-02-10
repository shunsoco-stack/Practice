import { NextRequest } from "next/server";
import { getActor, jsonOk, mapDomainError } from "@/lib/api/http";
import { store } from "@/lib/domain/store";

interface Params {
  targetUserId: string;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> },
) {
  const actor = getActor(request);
  const { targetUserId } = await context.params;
  try {
    const result = store.likeUser(actor.userId, targetUserId);
    return jsonOk(result);
  } catch (error) {
    return mapDomainError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<Params> },
) {
  const actor = getActor(request);
  const { targetUserId } = await context.params;
  try {
    store.unlikeUser(actor.userId, targetUserId);
    return jsonOk({ success: true });
  } catch (error) {
    return mapDomainError(error);
  }
}
