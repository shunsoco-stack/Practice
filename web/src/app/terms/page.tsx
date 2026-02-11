"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { api } from "@/lib/client/api";

interface ActiveTerm {
  id: string;
  type: string;
  version: string;
  contentUrl: string;
}

export default function TermsPage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState<ActiveTerm[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchTerms = async () => {
      const response = await api.get<{ terms: ActiveTerm[] }>("/api/v1/terms/active");
      if (!active) {
        return;
      }
      if (response.ok) {
        setTerms(response.data.terms);
      } else {
        setError(response.error.message);
      }
    };
    void fetchTerms();
    return () => {
      active = false;
    };
  }, []);

  const handleAccept = async () => {
    if (!agreed) {
      return;
    }
    setLoading(true);
    setError(null);
    try {
      for (const term of terms) {
        const response = await api.post<{ success: true }>("/api/v1/terms/consent", {
          termsVersionId: term.id,
        });
        if (!response.ok) {
          setError(response.error.message);
          setLoading(false);
          return;
        }
      }
      router.push("/onboarding/basic-profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-8 text-white">
            <div className="mb-3 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                <i className="ri-file-text-line text-xl" />
              </div>
              <h1 className="text-2xl font-bold">利用規約</h1>
            </div>
            <p className="text-sm text-teal-50">
              サービスをご利用いただく前に、必ず利用規約をお読みください
            </p>
          </div>

          <div className="p-6">
            <div className="mb-6 max-h-96 overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-6">
              <div className="prose prose-sm max-w-none">
                <h3 className="mb-3 text-base font-bold text-gray-900">第1条（適用範囲）</h3>
                <p className="mb-4 text-sm text-gray-700">
                  本規約は、Consent-First Matching（以下「本サービス」）の利用に関する条件を定めるものです。
                  ユーザーは本規約に同意の上、本サービスを利用するものとします。
                </p>

                <h3 className="mb-3 text-base font-bold text-gray-900">第2条（年齢制限）</h3>
                <p className="mb-4 text-sm text-gray-700">
                  本サービスは18歳以上の方のみご利用いただけます。18歳未満の方の利用は固く禁じられています。
                </p>

                <h3 className="mb-3 text-base font-bold text-gray-900">第3条（本人確認）</h3>
                <p className="mb-4 text-sm text-gray-700">
                  ユーザーは、本サービスの利用にあたり、外部eKYCサービスを通じた本人確認を完了する必要があります。
                </p>

                <h3 className="mb-3 text-base font-bold text-gray-900">第4条（同意の原則）</h3>
                <p className="mb-2 text-sm text-gray-700">
                  本サービスは相互同意を最優先とします。ユーザーは以下を遵守する必要があります：
                </p>
                <ul className="mb-4 ml-5 list-disc space-y-1 text-sm text-gray-700">
                  <li>相手の同意設定を尊重すること</li>
                  <li>同意なしに個人情報を要求しないこと</li>
                  <li>拒否された行為を強要しないこと</li>
                  <li>同意の撤回を尊重すること</li>
                </ul>

                <h3 className="mb-3 text-base font-bold text-gray-900">第5条（禁止事項）</h3>
                <ul className="mb-4 ml-5 list-disc space-y-1 text-sm text-gray-700">
                  <li>ハラスメント、脅迫、嫌がらせ行為</li>
                  <li>虚偽のプロフィール情報の登録</li>
                  <li>商業目的の勧誘、スパム行為</li>
                  <li>同意なしの性的な内容の送信</li>
                  <li>未成年者との接触を試みる行為</li>
                  <li>違法行為の勧誘や実行</li>
                </ul>
              </div>
            </div>

            {terms.length > 0 && (
              <div className="mb-4 rounded-lg border border-gray-200 bg-gray-50 p-3">
                <p className="text-xs text-gray-600">
                  現在有効な規約:
                  {terms.map((term) => ` ${term.type} v${term.version}`).join(" / ")}
                </p>
              </div>
            )}

            <div className="space-y-5">
              <label className="group flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                  className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-200"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  上記の利用規約を読み、内容に同意します
                </span>
              </label>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="flex gap-3">
                <Button variant="secondary" fullWidth onClick={() => router.push("/age-gate")}>
                  戻る
                </Button>
                <Button fullWidth onClick={() => void handleAccept()} disabled={!agreed || loading}>
                  {loading ? "処理中..." : "同意して次へ"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
