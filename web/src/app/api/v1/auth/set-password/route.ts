import { NextRequest, NextResponse } from "next/server";
import {
  jsonError,
  mapDomainError,
  parseJsonBody,
} from "@/lib/api/http";
import {
  AUTH_SESSION_COOKIE_NAME,
  AUTH_SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/session";
import { setPasswordSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, setPasswordSchema);
  if (!parsed.success) {
    return parsed.response;
  }
  try {
    const result = store.completePasswordSetup(
      parsed.data.token,
      parsed.data.password,
    );
    const session = store.loginWithEmailPassword(result.email, parsed.data.password);
    const response = NextResponse.json({
      ok: true,
      data: {
        success: true,
        userId: session.userId,
        role: session.role,
        email: session.email,
      },
    });
    response.cookies.set({
      name: AUTH_SESSION_COOKIE_NAME,
      value: session.token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: AUTH_SESSION_MAX_AGE_SECONDS,
      path: "/",
    });
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return mapDomainError(error);
    }
    return jsonError("internal_error", "Unexpected server error.", 500);
  }
}
