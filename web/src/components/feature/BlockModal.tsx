"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  targetUserName?: string;
}

export default function BlockModal({
  isOpen,
  onClose,
  onConfirm,
  targetUserName,
}: BlockModalProps) {
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 1500);
  };

  if (confirmed) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <i className="ri-forbid-line text-3xl text-gray-600" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">ブロックしました</h3>
          <p className="text-sm text-gray-600">
            今後このユーザーとのやり取りは
            <br />
            表示されなくなります
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ユーザーをブロック" size="sm">
      <div className="space-y-5">
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="mb-2 text-sm font-medium text-red-800">
            {targetUserName
              ? `${targetUserName} さんをブロックしますか？`
              : "このユーザーをブロックしますか？"}
          </p>
          <ul className="ml-4 list-disc space-y-1 text-xs text-red-700">
            <li>お互いのプロフィールが表示されなくなります</li>
            <li>メッセージの送受信ができなくなります</li>
            <li>マッチングが解除されます</li>
            <li>ブロックは後から解除できます</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose} disabled={loading}>
            キャンセル
          </Button>
          <Button variant="danger" fullWidth onClick={() => void handleConfirm()} disabled={loading}>
            {loading ? "処理中..." : "ブロックする"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
