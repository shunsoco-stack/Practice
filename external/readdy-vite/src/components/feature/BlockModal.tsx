import { useState } from 'react';
import Modal from '../base/Modal';
import Button from '../base/Button';

interface BlockModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  targetUserName?: string;
}

export default function BlockModal({ 
  isOpen, 
  onClose, 
  onConfirm,
  targetUserName 
}: BlockModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 1500);
  };

  if (confirmed) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <div className="text-center py-6">
          <div className="w-16 h-16 flex items-center justify-center bg-gray-100 rounded-full mx-auto mb-4">
            <i className="ri-forbid-line text-3xl text-gray-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">ブロックしました</h3>
          <p className="text-sm text-gray-600">
            今後このユーザーとのやり取りは<br />表示されなくなります
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="ユーザーをブロック" size="sm">
      <div className="space-y-5">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm text-red-800 font-medium mb-2">
            {targetUserName ? `${targetUserName} さんをブロックしますか？` : 'このユーザーをブロックしますか？'}
          </p>
          <ul className="text-xs text-red-700 space-y-1 ml-4 list-disc">
            <li>お互いのプロフィールが表示されなくなります</li>
            <li>メッセージの送受信ができなくなります</li>
            <li>マッチングが解除されます</li>
            <li>ブロックは後から解除できます</li>
          </ul>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" fullWidth onClick={onClose}>
            キャンセル
          </Button>
          <Button variant="danger" fullWidth onClick={handleConfirm}>
            ブロックする
          </Button>
        </div>
      </div>
    </Modal>
  );
}