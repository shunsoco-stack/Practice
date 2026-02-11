import { NextRequest } from "next/server";
import {
  jsonError,
  jsonOk,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import { kycWebhookSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, kycWebhookSchema);
  if (!parsed.success) {
    return parsed.response;
  }

  const configuredToken = process.env.KYC_WEBHOOK_TOKEN;
  if (configuredToken) {
    const token = request.headers.get("x-kyc-webhook-token");
    if (!token || token !== configuredToken) {
      return jsonError("invalid_webhook_token", "Invalid webhook token.", 401);
    }
  }

  try {
    const session = store.applyKycWebhook({
      sessionId: parsed.data.sessionId,
      status: parsed.data.status,
    });
    return jsonOk({
      sessionId: session.id,
      status: session.status,
      userId: session.userId,
    });
  } catch (error) {
    return mapDomainError(error);
  }
}
