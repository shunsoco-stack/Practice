import nodemailer from "nodemailer";

interface PasswordSetupMailInput {
  to: string;
  setupUrl: string;
}

interface MailResult {
  mode: "smtp" | "mock";
  accepted: boolean;
  messageId: string | null;
  previewUrl: string | null;
}

function hasSmtpConfig(): boolean {
  return Boolean(
    process.env.SMTP_HOST &&
      process.env.SMTP_PORT &&
      process.env.SMTP_USER &&
      process.env.SMTP_PASS &&
      process.env.SMTP_FROM,
  );
}

function createSmtpTransporter() {
  const port = Number(process.env.SMTP_PORT);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendPasswordSetupMail(
  input: PasswordSetupMailInput,
): Promise<MailResult> {
  const subject = "【Consent Match】パスワード設定のご案内";
  const textBody = `Consent Match へのご登録ありがとうございます。

以下のURLからパスワード設定を完了してください。
${input.setupUrl}

このURLの有効期限は1時間です。
ご自身で操作していない場合は、このメールを破棄してください。`;

  const htmlBody = `<p>Consent Match へのご登録ありがとうございます。</p>
<p>以下のURLからパスワード設定を完了してください。</p>
<p><a href="${input.setupUrl}">${input.setupUrl}</a></p>
<p>このURLの有効期限は1時間です。</p>
<p>ご自身で操作していない場合は、このメールを破棄してください。</p>`;

  if (!hasSmtpConfig()) {
    return {
      mode: "mock",
      accepted: false,
      messageId: null,
      previewUrl: input.setupUrl,
    };
  }

  try {
    const transporter = createSmtpTransporter();
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: input.to,
      subject,
      text: textBody,
      html: htmlBody,
    });
    return {
      mode: "smtp",
      accepted: true,
      messageId: info.messageId ?? null,
      previewUrl: null,
    };
  } catch {
    return {
      mode: "mock",
      accepted: false,
      messageId: null,
      previewUrl: input.setupUrl,
    };
  }
}

export function buildPasswordSetupMailBodies(setupUrl: string): {
  subject: string;
  textBody: string;
  htmlBody: string;
} {
  return {
    subject: "【Consent Match】パスワード設定のご案内",
    textBody: `Consent Match へのご登録ありがとうございます。

以下のURLからパスワード設定を完了してください。
${setupUrl}

このURLの有効期限は1時間です。`,
    htmlBody: `<p>Consent Match へのご登録ありがとうございます。</p>
<p>以下のURLからパスワード設定を完了してください。</p>
<p><a href="${setupUrl}">${setupUrl}</a></p>
<p>このURLの有効期限は1時間です。</p>`,
  };
}
