import { useState } from 'react';
import Modal from '../base/Modal';
import Button from '../base/Button';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetUserName?: string;
}

export default function ReportModal({ isOpen, onClose, targetUserName }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const reasons = [
    { id: 'harassment', label: 'ハラスメント・嫌がらせ' },
    { id: 'inappropriate', label: '不適切な内容の送信' },
    { id: 'spam', label: 'スパム・勧誘行為' },
    { id: 'fake', label: '虚偽のプロフィール' },
    { id: 'underage', label: '未成年の疑い' },
    { id: 'consent', label: '同意なしの行為' },
    { id: 'other', label: 'その他' }
  ];

  const handleSubmit = () => {
    if (!selectedReason) return;
    
    // API call would go here
    console.log('Report submitted:', { reason: selectedReason, details });
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedReason('');
      setDetails('');
      onClose();
    }, 2000);
  };

  const handleClose = () => {
    setSelectedReason('');
    setDetails('');
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} size="sm">
        <div className="text-center py-6">
          <div className="w-16 h-16 flex items-center justify-center bg-green-100 rounded-full mx-auto mb-4">
            <i className="ri-check-line text-3xl text-green-600"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">通報を受け付けました</h3>
          <p className="text-sm text-gray-600">
            内容を確認し、適切に対応いたします。<br />
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
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-sm text-amber-800">
              <strong>{targetUserName}</strong> さんを通報します
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            通報理由を選択してください <span className="text-red-600">*</span>
          </label>
          <div className="space-y-2">
            {reasons.map((reason) => (
              <label
                key={reason.id}
                className="flex items-center gap-3 p-3 border-2 rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                style={{
                  borderColor: selectedReason === reason.id ? '#0d9488' : '#e5e7eb'
                }}
              >
                <input
                  type="radio"
                  name="reason"
                  value={reason.id}
                  checked={selectedReason === reason.id}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 text-teal-600 cursor-pointer"
                />
                <span className="text-sm text-gray-900">{reason.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            詳細情報（任意）
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="具体的な状況や経緯を記入してください"
            rows={4}
            maxLength={500}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">{details.length}/500文字</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600">
            <i className="ri-information-line mr-1"></i>
            通報内容は運営チームが確認し、利用規約に基づき適切に対応いたします。虚偽の通報は禁止されています。
          </p>
        </div>

        <div className="flex gap-3 pt-2">
          <Button variant="secondary" fullWidth onClick={handleClose}>
            キャンセル
          </Button>
          <Button 
            variant="danger" 
            fullWidth 
            onClick={handleSubmit}
            disabled={!selectedReason}
          >
            通報する
          </Button>
        </div>
      </div>
    </Modal>
  );
}