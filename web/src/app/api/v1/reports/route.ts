import { NextRequest } from "next/server";
import {
  getActor,
  jsonOk,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import { reportSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

export async function POST(request: NextRequest) {
  const actor = getActor(request);
  const parsed = await parseJsonBody(request, reportSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  try {
    const report = store.createReport({
      reporterUserId: actor.userId,
      targetUserId: parsed.data.targetUserId,
      category: parsed.data.category,
      detail: parsed.data.detail,
      severity: parsed.data.severity,
      conversationId: parsed.data.conversationId,
      messageId: parsed.data.messageId,
    });
    return jsonOk({ report });
  } catch (error) {
    return mapDomainError(error);
  }
}
