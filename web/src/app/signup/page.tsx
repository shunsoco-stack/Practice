"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { api } from "@/lib/client/api";

interface RegisterResponse {
  success: true;
  email: string;
  expiresAt: string;
  isNewAccount: boolean;
  delivery: {
    mode: "smtp" | "mock";
    accepted: boolean;
    messageId: string | null;
    previewUrl: string | null;
  };
}

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<RegisterResponse | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    const response = await api.post<RegisterResponse>("/api/v1/auth/register", {
      email,
    });
    setLoading(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    setResult(response.data);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl px-4 py-10">
        <Card padding="lg" className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">新規会員登録</h1>
            <p className="mt-2 text-sm text-gray-600">
              メールアドレスを入力すると、パスワード設定URLをメールで送信します。
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/")}>
              戻る
            </Button>
            <Button
              fullWidth
              onClick={() => void submit()}
              disabled={loading || email.trim().length === 0}
            >
              {loading ? "送信中..." : "メールを送信"}
            </Button>
          </div>

          {result && (
            <div className="space-y-3 rounded-lg border border-teal-200 bg-teal-50 p-4 text-sm text-teal-800">
              <p>
                <strong>{result.email}</strong> 宛に案内を送信しました。
              </p>
              <p>メール本文内のURLからパスワード設定へ進んでください。</p>
              <p className="text-xs text-teal-700">
                URL有効期限: {new Date(result.expiresAt).toLocaleString("ja-JP")}
              </p>
              {result.delivery.mode === "mock" && result.delivery.previewUrl && (
                <div className="rounded border border-teal-300 bg-white p-3 text-xs text-gray-700">
                  <p className="font-semibold text-teal-700">
                    開発モード（SMTP未設定）のためメール送信を模擬しています。
                  </p>
                  <p className="mt-2">下記URLをクリックしてパスワード設定を続けてください。</p>
                  <a
                    href={result.delivery.previewUrl}
                    className="mt-2 block break-all text-teal-700 underline"
                  >
                    {result.delivery.previewUrl}
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="text-sm text-gray-600">
            すでに登録済みの方は{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-medium text-teal-700 hover:underline"
            >
              ログイン
            </button>
            してください。
          </div>
        </Card>
      </div>
    </div>
  );
}
