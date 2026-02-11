import { NextRequest } from "next/server";
import { jsonError, jsonOk } from "@/lib/api/http";
import { store } from "@/lib/domain/store";

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email")?.trim();
  if (!email) {
    return jsonError("missing_email", "email query parameter is required.", 400);
  }
  const mail = store.getLatestSentEmail(email);
  if (!mail) {
    return jsonError("mail_not_found", "No mail found for this address.", 404);
  }
  return jsonOk({
    email: mail.to,
    subject: mail.subject,
    textBody: mail.textBody,
    htmlBody: mail.htmlBody,
    createdAt: mail.createdAt,
  });
}
