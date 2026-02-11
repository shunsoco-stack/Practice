"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { api } from "@/lib/client/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    setError(null);
    const response = await api.post<{
      success: true;
      userId: string;
      role: "user" | "admin";
      email: string;
    }>("/api/v1/auth/login", {
      email,
      password,
    });
    setLoading(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    router.push("/discovery");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl px-4 py-10">
        <Card padding="lg" className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ログイン</h1>
            <p className="mt-2 text-sm text-gray-600">
              会員登録済みのメールアドレスとパスワードでログインしてください。
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

          <Input
            label="パスワード"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="パスワードを入力"
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/")}>
              戻る
            </Button>
            <Button
              fullWidth
              onClick={() => void login()}
              disabled={loading || email.trim().length === 0 || password.length === 0}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </div>

          <div className="text-sm text-gray-600">
            新規登録がまだの場合は{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-medium text-teal-700 hover:underline"
            >
              こちら
            </button>
            からメール登録してください。
          </div>
        </Card>
      </div>
    </div>
  );
}
