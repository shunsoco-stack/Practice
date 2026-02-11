"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { category: string; detail: string }) => Promise<void> | void;
  targetUserName?: string;
}

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  targetUserName,
}: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [details, setDetails] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const reasons = [
    { id: "harassment", label: "ハラスメント・嫌がらせ" },
    { id: "impersonation", label: "なりすまし・虚偽プロフィール" },
    { id: "scam", label: "スパム・勧誘行為" },
    { id: "illegal", label: "違法行為の示唆" },
    { id: "other", label: "その他" },
  ];

  const handleSubmit = async () => {
    if (!selectedReason) {
      return;
    }
    setLoading(true);
    await onSubmit({ category: selectedReason, detail: details });
    setLoading(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedReason("");
      setDetails("");
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setSelectedReason("");
    setDetails("");
    setSubmitted(false);
    setLoading(false);
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="sm">
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <i className="ri-check-line text-3xl text-green-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">通報を受け付けました</h3>
          <p className="text-sm text-gray-600">
            内容を確認し、適切に対応いたします。
            <br />
            ご協力ありがとうございました。
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="ユーザーを通報" size="md">
      <div className="space-y-5">
        {targetUserName && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm text-amber-800">
              <strong>{targetUserName}</strong> さんを通報します
            </p>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            通報理由を選択してください <span className="text-red-600">*</span>
          </label>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <label
                key={reason.id}
                className="flex cursor-pointer items-center gap-3 rounded-lg border-2 p-3 transition-colors hover:bg-gray-50"
                style={{
                  borderColor: selectedReason === reason.id ? "#0d9488" : "#e5e7eb",
                }}
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={(event) => setSelectedReason(event.target.value)}
                  className="h-4 w-4 cursor-pointer text-teal-600"
                />
                <span className="text-sm text-gray-900">{reason.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-900">
            詳細情報（任意）
          </label>
          <textarea
            value={details}
            onChange={(event) => setDetails(event.target.value)}
            placeholder="具体的な状況や経緯を記入してください"
            rows={4}
            maxLength={500}
            className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
          />
          <p className="mt-1 text-xs text-gray-500">{details.length}/500文字</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-xs text-gray-600">
            <i className="ri-information-line mr-1" />
            通報内容は運営チームが確認し、利用規約に基づき対応します。虚偽の通報は禁止です。
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={handleClose} disabled={loading}>
            キャンセル
          </Button>
          <Button
            variant="danger"
            fullWidth
            onClick={() => void handleSubmit()}
            disabled={!selectedReason || loading}
          >
            {loading ? "送信中..." : "通報する"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
