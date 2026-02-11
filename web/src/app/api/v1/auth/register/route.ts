import { NextRequest } from "next/server";
import { jsonOk, mapDomainError, parseJsonBody } from "@/lib/api/http";
import { registerSchema } from "@/lib/api/schemas";
import { store } from "@/lib/domain/store";
import {
  buildPasswordSetupMailBodies,
  sendPasswordSetupMail,
} from "@/lib/server/mailer";

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, registerSchema);
  if (!parsed.success) {
    return parsed.response;
  }

  try {
    const registration = store.registerWithEmail(parsed.data.email);
    const setupUrl = `${request.nextUrl.origin}/auth/set-password?token=${registration.token}`;
    const mailBodies = buildPasswordSetupMailBodies(setupUrl);
    store.saveSentEmail({
      to: registration.email,
      subject: mailBodies.subject,
      textBody: mailBodies.textBody,
      htmlBody: mailBodies.htmlBody,
    });
    const delivery = await sendPasswordSetupMail({
      to: registration.email,
      setupUrl,
    });

    return jsonOk({
      success: true,
      email: registration.email,
      expiresAt: registration.expiresAt,
      isNewAccount: registration.isNewAccount,
      delivery,
    });
  } catch (error) {
    return mapDomainError(error);
  }
}
