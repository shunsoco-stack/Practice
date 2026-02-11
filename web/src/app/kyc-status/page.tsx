"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { api } from "@/lib/client/api";

type DisplayKycStatus =
  | "not_started"
  | "in_progress"
  | "under_review"
  | "verified"
  | "rejected";

interface OnboardingStatus {
  hasAcceptedTerms: boolean;
  isAdult: boolean;
  kycStatus: "pending" | "verified" | "rejected";
  kycFlowStatus: DisplayKycStatus;
}

function toDisplayStatus(status: OnboardingStatus): DisplayKycStatus {
  if (!status.hasAcceptedTerms) {
    return "not_started";
  }
  return status.kycFlowStatus;
}

export default function KycStatusPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<DisplayKycStatus>("not_started");
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const returnedStatus = searchParams.get("kyc");
      const response = await api.get<OnboardingStatus>("/api/v1/onboarding/status");
      if (!active) {
        return;
      }
      if (response.ok) {
        setStatus(toDisplayStatus(response.data));
      } else {
        setError(response.error.message);
      }
      if (returnedStatus === "verified") {
        setInfo("本人確認が承認されました。");
      } else if (returnedStatus === "rejected") {
        setInfo("本人確認が否認されました。再申請してください。");
      } else {
        setInfo(null);
      }
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, [searchParams]);

  const startKyc = useCallback(async () => {
    setProcessing(true);
    setError(null);
    const response = await api.post<{
      sessionId: string;
      status: "in_progress" | "under_review" | "verified" | "rejected";
      provider: "mock" | "external";
      redirectUrl: string;
    }>("/api/v1/onboarding/kyc/session", {
      returnPath: "/kyc-status",
    });
    setProcessing(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    window.location.assign(response.data.redirectUrl);
  }, []);

  const statusConfig = useMemo(
    () => ({
      not_started: {
        badge: { variant: "neutral" as const, label: "未開始" },
        icon: "ri-file-list-line",
        iconBg: "bg-gray-100",
        iconColor: "text-gray-600",
        title: "本人確認が必要です",
        description:
          "安全なマッチング環境のため、本人確認（KYC）を完了してください。外部サービスを利用した簡単な手続きです。",
        action: { label: "本人確認を開始", onClick: () => void startKyc() },
      },
      in_progress: {
        badge: { variant: "info" as const, label: "申請中" },
        icon: "ri-time-line",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        title: "本人確認を申請中",
        description:
          "外部eKYCサービスでの手続きを完了してください。手続き完了後に審査が開始されます。",
        action: { label: "手続きを続ける", onClick: () => void startKyc() },
      },
      under_review: {
        badge: { variant: "warning" as const, label: "審査中" },
        icon: "ri-search-eye-line",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        title: "審査中です",
        description:
          "提出された書類を確認しています。通常1〜3営業日で完了します。審査結果はメールでお知らせします。",
        action: null,
      },
      verified: {
        badge: { variant: "success" as const, label: "承認済み" },
        icon: "ri-checkbox-circle-line",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
        title: "本人確認が完了しました",
        description:
          "本人確認が承認されました。プロフィールを設定して、マッチングを開始しましょう。",
        action: { label: "プロフィール設定へ", onClick: () => router.push("/profile/edit") },
      },
      rejected: {
        badge: { variant: "danger" as const, label: "否認" },
        icon: "ri-close-circle-line",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        title: "本人確認が否認されました",
        description: "提出された書類に問題がありました。詳細をご確認の上、再度申請してください。",
        action: { label: "再申請する", onClick: () => void startKyc() },
      },
    }),
    [router, startKyc],
  );

  const config = statusConfig[status];

  const steps = [
    { id: 1, label: "年齢確認", completed: true },
    { id: 2, label: "規約同意", completed: true },
    { id: 3, label: "本人確認", completed: status === "verified" },
    { id: 4, label: "プロフィール設定", completed: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-sm font-semibold text-gray-900">登録の進捗</h2>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors
                    ${
                      step.completed
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {step.completed ? (
                      <i className="ri-check-line text-lg" />
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span className="mt-2 text-center text-xs text-gray-600">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`mx-2 h-0.5 flex-1 ${step.completed ? "bg-teal-600" : "bg-gray-300"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="p-6">
            {error && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {info && (
              <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-700">
                {info}
              </div>
            )}

            <div className="mb-6 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${config.iconBg}`}>
                  <i className={`${config.icon} text-2xl ${config.iconColor}`} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
                  <div className="mt-1">
                    <Badge variant={config.badge.variant}>{config.badge.label}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <p className="mb-6 text-sm leading-relaxed text-gray-600">{config.description}</p>

            {status === "rejected" && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
                <h3 className="mb-2 text-sm font-semibold text-red-900">
                  <i className="ri-error-warning-line mr-1" />
                  否認理由
                </h3>
                <ul className="ml-4 list-disc space-y-1 text-xs text-red-800">
                  <li>提出された書類の有効期限が切れています</li>
                  <li>書類の画像が不鮮明です</li>
                </ul>
              </div>
            )}

            <div className="mb-6 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-semibold text-gray-900">
                <i className="ri-information-line mr-1" />
                本人確認について
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <i className="ri-check-line mt-0.5 text-teal-600" />
                  <span>外部eKYCサービスを利用した安全な手続き</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-check-line mt-0.5 text-teal-600" />
                  <span>運転免許証、マイナンバーカード等が利用可能</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-check-line mt-0.5 text-teal-600" />
                  <span>審査は通常1〜3営業日で完了</span>
                </li>
              </ul>
            </div>

            {config.action && (
              <Button
                fullWidth
                size="lg"
                onClick={config.action.onClick}
                disabled={loading || processing}
              >
                {processing ? "遷移中..." : loading ? "確認中..." : config.action.label}
              </Button>
            )}

            {status === "under_review" && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">審査完了までお待ちください</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 text-center">
          <button type="button" className="cursor-pointer text-sm text-teal-600 hover:underline">
            <i className="ri-question-line mr-1" />
            本人確認についてのヘルプ
          </button>
        </div>
      </div>
    </div>
  );
}
