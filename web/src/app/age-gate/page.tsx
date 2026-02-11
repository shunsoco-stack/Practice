"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/ui/Button";

export default function AgeGatePage() {
  const router = useRouter();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");

  const handleConfirm = () => {
    if (!agreed) {
      setError("18歳以上であることを確認してください");
      return;
    }
    router.push("/terms");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl bg-white p-8 shadow-lg">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
              <i className="ri-error-warning-line text-3xl text-amber-600" />
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">年齢確認</h1>
            <p className="text-sm text-gray-600">
              このサービスは18歳以上の方のみ
              <br />
              ご利用いただけます
            </p>
          </div>

          <div className="space-y-6">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <h3 className="mb-2 text-sm font-semibold text-amber-900">
                <i className="ri-information-line mr-1" />
                重要なお知らせ
              </h3>
              <ul className="ml-4 list-disc space-y-1.5 text-xs text-amber-800">
                <li>18歳未満の方は利用できません</li>
                <li>虚偽の申告は利用規約違反となります</li>
                <li>後ほど本人確認（KYC）が必要です</li>
              </ul>
            </div>

            <label className="group flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(event) => {
                  setAgreed(event.target.checked);
                  setError("");
                }}
                className="mt-0.5 h-5 w-5 cursor-pointer rounded border-gray-300 text-teal-600 focus:ring-2 focus:ring-teal-200"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                私は18歳以上であり、成人向けのコミュニケーションを含むサービス利用に同意します
              </span>
            </label>

            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                <p className="text-sm text-red-800">
                  <i className="ri-error-warning-line mr-1" />
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button fullWidth size="lg" onClick={handleConfirm}>
                確認して次へ
              </Button>
              <Button fullWidth variant="secondary" onClick={() => router.push("/")}>
                戻る
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                18歳未満の方は
                <br />
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="cursor-pointer text-teal-600 hover:underline"
                >
                  トップページに戻る
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
