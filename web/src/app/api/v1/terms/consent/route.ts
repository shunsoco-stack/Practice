import { NextRequest } from "next/server";
import {
  getActor,
  jsonOk,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import { termsConsentSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

export async function POST(request: NextRequest) {
  const actor = getActor(request);
  const parsed = await parseJsonBody(request, termsConsentSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  try {
    store.saveTermsConsent(actor.userId, parsed.data.termsVersionId);
    return jsonOk({ success: true });
  } catch (error) {
    return mapDomainError(error);
  }
}
