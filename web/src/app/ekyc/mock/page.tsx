"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { api } from "@/lib/client/api";

type SessionStatus = "in_progress" | "under_review" | "verified" | "rejected";

interface SessionResponse {
  sessionId: string;
  status: SessionStatus;
  provider: "mock" | "external";
  redirectUrl: string;
  returnPath: string;
}

export default function MockEkycPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId");
  const requestedReturnPath = searchParams.get("returnPath");

  const [session, setSession] = useState<SessionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const effectiveReturnPath = useMemo(
    () => requestedReturnPath ?? session?.returnPath ?? "/kyc-status",
    [requestedReturnPath, session?.returnPath],
  );

  const fetchSession = async (): Promise<
    { ok: true; session: SessionResponse } | { ok: false; error: string }
  > => {
    if (!sessionId) {
      return { ok: false, error: "sessionId が指定されていません。" };
    }
    const response = await api.get<SessionResponse>(
      `/api/v1/onboarding/kyc/session/${sessionId}`,
    );
    if (!response.ok) {
      return { ok: false, error: response.error.message };
    }
    return { ok: true, session: response.data };
  };

  const loadSession = async () => {
    const result = await fetchSession();
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setSession(result.session);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const run = async () => {
      const result = await fetchSession();
      if (!active) {
        return;
      }
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      setSession(result.session);
      setLoading(false);
    };
    void run();
    return () => {
      active = false;
    };
  }, [sessionId]);

  const submitDocuments = async () => {
    if (!sessionId) {
      return;
    }
    setProcessing(true);
    setError(null);
    const response = await api.post<{ sessionId: string; status: SessionStatus }>(
      `/api/v1/onboarding/kyc/session/${sessionId}/submit`,
    );
    setProcessing(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    await loadSession();
  };

  const finalize = async (status: "verified" | "rejected") => {
    if (!sessionId) {
      return;
    }
    setProcessing(true);
    setError(null);
    const response = await api.post<{
      sessionId: string;
      status: SessionStatus;
      userId: string;
    }>("/api/v1/webhooks/kyc", {
      sessionId,
      status,
    });
    setProcessing(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    router.push(`${effectiveReturnPath}?kyc=${status}`);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-xl">
          <p className="text-sm text-gray-700">eKYCセッションを読み込み中です...</p>
        </Card>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-xl space-y-3">
          <h1 className="text-lg font-semibold text-gray-900">eKYCページを表示できません</h1>
          <p className="text-sm text-red-700">{error ?? "セッションが見つかりません。"}</p>
          <Button onClick={() => router.push("/kyc-status")}>KYC画面へ戻る</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-4">
      <div className="mx-auto max-w-2xl py-8">
        <Card padding="lg" className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Mock eKYC Service</h1>
            <p className="mt-1 text-sm text-gray-600">
              本番連携前の検証用画面です。提出・審査・結果反映の流れを確認できます。
            </p>
          </div>

          <div className="grid gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
            <p>
              <span className="font-semibold text-gray-700">Session ID:</span> {session.sessionId}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Status:</span> {session.status}
            </p>
            <p>
              <span className="font-semibold text-gray-700">Return:</span> {effectiveReturnPath}
            </p>
          </div>

          {session.status === "in_progress" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                書類提出ステップです。提出後に審査中へ遷移します。
              </p>
              <Button
                fullWidth
                size="lg"
                onClick={() => void submitDocuments()}
                disabled={processing}
              >
                {processing ? "提出中..." : "書類を提出して審査へ進む"}
              </Button>
            </div>
          )}

          {session.status === "under_review" && (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                審査中です。検証では承認/否認を手動で選択できます。
              </p>
              <div className="flex gap-3">
                <Button
                  fullWidth
                  onClick={() => void finalize("verified")}
                  disabled={processing}
                >
                  {processing ? "処理中..." : "審査承認"}
                </Button>
                <Button
                  fullWidth
                  variant="danger"
                  onClick={() => void finalize("rejected")}
                  disabled={processing}
                >
                  {processing ? "処理中..." : "審査否認"}
                </Button>
              </div>
            </div>
          )}

          {(session.status === "verified" || session.status === "rejected") && (
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                審査結果が反映されています。KYCステータス画面に戻って確認してください。
              </p>
              <Button onClick={() => router.push(`${effectiveReturnPath}?kyc=${session.status}`)}>
                KYC画面へ戻る
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
