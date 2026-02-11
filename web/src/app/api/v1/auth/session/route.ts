import { NextRequest } from "next/server";
import { jsonOk } from "@/lib/api/http";
import { AUTH_SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { store } from "@/lib/domain/store";

export async function GET(request: NextRequest) {
  const token = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value;
  if (!token) {
    return jsonOk({
      authenticated: false,
    });
  }
  const session = store.getSessionByToken(token);
  if (!session) {
    return jsonOk({
      authenticated: false,
    });
  }
  return jsonOk({
    authenticated: true,
    user: {
      userId: session.userId,
      role: session.role,
      email: session.email,
      expiresAt: session.expiresAt,
    },
  });
}
