import { NextRequest } from "next/server";
import { z } from "zod";
import { getActor, jsonError, jsonOk, mapDomainError } from "@/lib/api/http";
import { store } from "@/lib/domain/store";

interface Params {
  targetUserId: string;
}

const optionalBlockSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<Params> },
) {
  const actor = getActor(request);
  const { targetUserId } = await context.params;
  let reason: string | undefined;

  const raw = await request.text();
  if (raw.trim().length > 0) {
    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return jsonError("invalid_json", "Request body must be valid JSON.", 400);
    }
    const parsed = optionalBlockSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(
        "validation_error",
        parsed.error.issues.map((issue) => issue.message).join("; "),
        422,
      );
    }
    reason = parsed.data.reason;
  }

  try {
    store.blockUser(actor.userId, targetUserId, reason);
    return jsonOk({ success: true });
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
    store.unblockUser(actor.userId, targetUserId);
    return jsonOk({ success: true });
  } catch (error) {
    return mapDomainError(error);
  }
}
