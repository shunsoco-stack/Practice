import type { ZodSchema } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { store } from "@/lib/domain/store";

export interface Actor {
  userId: string;
  role: "user" | "admin";
}

export function getActor(request: NextRequest): Actor {
  const fromHeader = request.headers.get("x-user-id")?.trim();
  const fromQuery = request.nextUrl.searchParams.get("userId")?.trim();
  const userId = fromHeader || fromQuery || "u1";
  const roleHeader = request.headers.get("x-user-role");
  const roleFromStore = store.getRole(userId);
  const role: "user" | "admin" =
    roleHeader === "admin" || roleFromStore === "admin" ? "admin" : "user";
  return { userId, role };
}

export function jsonOk<T>(data: T, status = 200): NextResponse {
  return NextResponse.json({ ok: true, data }, { status });
}

export function jsonError(
  code: string,
  message: string,
  status = 400,
): NextResponse {
  return NextResponse.json(
    { ok: false, error: { code, message } },
    { status },
  );
}

export async function parseJsonBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<{ success: true; data: T } | { success: false; response: NextResponse }> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return {
      success: false,
      response: jsonError("invalid_json", "Request body must be valid JSON.", 400),
    };
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return {
      success: false,
      response: jsonError(
        "validation_error",
        parsed.error.issues.map((issue) => issue.message).join("; "),
        422,
      ),
    };
  }

  return { success: true, data: parsed.data };
}

export function mapDomainError(error: unknown): NextResponse {
  const message = error instanceof Error ? error.message : "unknown_error";
  switch (message) {
    case "user_not_found":
      return jsonError("user_not_found", "User not found.", 404);
    case "terms_version_not_found":
      return jsonError("terms_version_not_found", "Terms version was not found.", 404);
    case "terms_not_accepted":
      return jsonError(
        "terms_not_accepted",
        "Accept all active terms before starting eKYC.",
        409,
      );
    case "underage_not_allowed":
      return jsonError(
        "underage_not_allowed",
        "Only users aged 18+ can complete onboarding.",
        403,
      );
    case "kyc_already_verified":
      return jsonError("kyc_already_verified", "KYC is already verified.", 409);
    case "kyc_session_not_found":
      return jsonError("kyc_session_not_found", "KYC session not found.", 404);
    case "invalid_kyc_session_state":
      return jsonError(
        "invalid_kyc_session_state",
        "KYC session is not in a valid state for this operation.",
        409,
      );
    case "invalid_target":
      return jsonError("invalid_target", "Invalid target user.", 400);
    case "blocked_relationship":
      return jsonError("blocked_relationship", "You cannot interact with this user.", 403);
    case "conversation_not_found":
      return jsonError("conversation_not_found", "Conversation not found.", 404);
    case "forbidden":
      return jsonError("forbidden", "You do not have permission.", 403);
    case "invalid_message_length":
      return jsonError(
        "invalid_message_length",
        "Message body length must be 1 to 3000 characters.",
        422,
      );
    case "report_detail_too_short":
      return jsonError(
        "report_detail_too_short",
        "Report detail must be at least 10 characters.",
        422,
      );
    default:
      return jsonError("internal_error", "Unexpected server error.", 500);
  }
}
