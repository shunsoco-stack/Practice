"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { api, getCurrentUserId, setCurrentUserId } from "@/lib/client/api";

interface ProfileResponse {
  profile: {
    id: string;
    nickname: string;
  };
}

const demoUsers = [
  { id: "u1", label: "u1 (新規ユーザー想定)" },
  { id: "u2", label: "u2 (既存会員)" },
  { id: "u4", label: "u4 (既存会員)" },
  { id: "u_admin", label: "u_admin (管理者)" },
];

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(getCurrentUserId());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const loginWithUserId = async (targetUserId: string) => {
    setLoading(true);
    setError(null);
    const previous = getCurrentUserId();
    setCurrentUserId(targetUserId);
    const response = await api.get<ProfileResponse>("/api/v1/me/profile");
    setLoading(false);
    if (!response.ok) {
      setCurrentUserId(previous);
      setError("指定されたユーザーでログインできません。User IDを確認してください。");
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
              すでに会員登録済みのユーザーは、User IDでログインできます。
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <Input
            label="User ID"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="例: u2"
          />

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/")}>
              戻る
            </Button>
            <Button
              fullWidth
              onClick={() => void loginWithUserId(userId.trim())}
              disabled={loading || userId.trim().length === 0}
            >
              {loading ? "ログイン中..." : "ログイン"}
            </Button>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-500">デモユーザー</p>
            <div className="grid gap-2">
              {demoUsers.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => void loginWithUserId(item.id)}
                  className="cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  disabled={loading}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
