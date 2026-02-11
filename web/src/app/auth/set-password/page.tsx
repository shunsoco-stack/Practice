"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { api } from "@/lib/client/api";

export default function SetPasswordPage() {
  const router = useRouter();
  const token = useMemo(
    () =>
      typeof window === "undefined"
        ? null
        : new URLSearchParams(window.location.search).get("token"),
    [],
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submit = async () => {
    if (!token) {
      setError("URLに有効なトークンが含まれていません。");
      return;
    }
    if (password !== confirmPassword) {
      setError("パスワード確認が一致しません。");
      return;
    }

    setLoading(true);
    setError(null);
    const response = await api.post<{
      success: true;
      userId: string;
      role: "user" | "admin";
      email: string;
    }>("/api/v1/auth/set-password", {
      token,
      password,
    });
    setLoading(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    setSuccess(true);
    setTimeout(() => {
      router.push("/age-gate");
    }, 700);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-xl px-4 py-10">
        <Card padding="lg" className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">パスワード設定</h1>
            <p className="mt-2 text-sm text-gray-600">
              メールで受信したURLのトークンを使って、ログイン用パスワードを設定します。
            </p>
          </div>

          {!token && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              URLトークンが見つかりません。受信したメール内のURLを開き直してください。
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-700">
              パスワードを設定しました。オンボーディングに進みます。
            </div>
          )}

          <Input
            label="パスワード"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8文字以上で入力"
          />

          <Input
            label="パスワード（確認）"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder="確認用パスワード"
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/signup")}>
              戻る
            </Button>
            <Button
              fullWidth
              onClick={() => void submit()}
              disabled={
                loading ||
                !token ||
                password.length < 8 ||
                confirmPassword.length < 8
              }
            >
              {loading ? "設定中..." : "パスワードを設定"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
