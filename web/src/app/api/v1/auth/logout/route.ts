import { NextRequest, NextResponse } from "next/server";
import { AUTH_SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { store } from "@/lib/domain/store";

export async function POST(request: NextRequest) {
  const token = request.cookies.get(AUTH_SESSION_COOKIE_NAME)?.value;
  if (token) {
    store.logoutSession(token);
  }
  const response = NextResponse.json({
    ok: true,
    data: {
      success: true,
    },
  });
  response.cookies.set({
    name: AUTH_SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/",
  });
  return response;
}
