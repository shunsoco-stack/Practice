import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/base/Button';
import Badge from '../../components/base/Badge';

type KYCStatus = 'not_started' | 'in_progress' | 'under_review' | 'verified' | 'rejected';

export default function KYCStatus() {
  const navigate = useNavigate();
  const [status] = useState<KYCStatus>('not_started');

  const statusConfig = {
    not_started: {
      badge: { variant: 'neutral' as const, label: '未開始' },
      icon: 'ri-file-list-line',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600',
      title: '本人確認が必要です',
      description: '安全なマッチング環境のため、本人確認（KYC）を完了してください。外部サービスを利用した簡単な手続きです。',
      action: { label: '本人確認を開始', onClick: () => handleStartKYC() }
    },
    in_progress: {
      badge: { variant: 'info' as const, label: '申請中' },
      icon: 'ri-time-line',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      title: '本人確認を申請中',
      description: '外部eKYCサービスでの手続きを完了してください。手続きが完了すると、審査が開始されます。',
      action: { label: '手続きを続ける', onClick: () => handleContinueKYC() }
    },
    under_review: {
      badge: { variant: 'warning' as const, label: '審査中' },
      icon: 'ri-search-eye-line',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      title: '審査中です',
      description: '提出された書類を確認しています。通常1〜3営業日で完了します。審査結果はメールでお知らせします。',
      action: null
    },
    verified: {
      badge: { variant: 'success' as const, label: '承認済み' },
      icon: 'ri-checkbox-circle-line',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
      title: '本人確認が完了しました',
      description: 'おめでとうございます！本人確認が承認されました。プロフィールを設定して、マッチングを開始しましょう。',
      action: { label: 'プロフィール設定へ', onClick: () => navigate('/profile/edit') }
    },
    rejected: {
      badge: { variant: 'danger' as const, label: '否認' },
      icon: 'ri-close-circle-line',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      title: '本人確認が否認されました',
      description: '提出された書類に問題がありました。詳細をご確認の上、再度申請してください。',
      action: { label: '再申請する', onClick: () => handleStartKYC() }
    }
  };

  const config = statusConfig[status];

  const handleStartKYC = () => {
    // External eKYC service integration
    window.open('https://example-ekyc-service.com', '_blank');
  };

  const handleContinueKYC = () => {
    window.open('https://example-ekyc-service.com', '_blank');
  };

  const steps = [
    { id: 1, label: '年齢確認', completed: true },
    { id: 2, label: '規約同意', completed: true },
    { id: 3, label: '本人確認', completed: status === 'verified' },
    { id: 4, label: 'プロフィール設定', completed: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">登録の進捗</h2>
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition-colors
                    ${step.completed 
                      ? 'bg-teal-600 border-teal-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-400'
                    }`}
                  >
                    {step.completed ? (
                      <i className="ri-check-line text-lg"></i>
                    ) : (
                      <span className="text-sm font-semibold">{step.id}</span>
                    )}
                  </div>
                  <span className="text-xs text-gray-600 mt-2 text-center">{step.label}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`h-0.5 flex-1 mx-2 ${step.completed ? 'bg-teal-600' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* KYC Status Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 flex items-center justify-center ${config.iconBg} rounded-xl`}>
                  <i className={`${config.icon} text-2xl ${config.iconColor}`}></i>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{config.title}</h1>
                  <div className="mt-1">
                    <Badge variant={config.badge.variant}>{config.badge.label}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-6 leading-relaxed">
              {config.description}
            </p>

            {status === 'rejected' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-red-900 mb-2">
                  <i className="ri-error-warning-line mr-1"></i>
                  否認理由
                </h3>
                <ul className="text-xs text-red-800 space-y-1 ml-4 list-disc">
                  <li>提出された書類の有効期限が切れています</li>
                  <li>書類の画像が不鮮明です</li>
                </ul>
              </div>
            )}

            {/* Info Box */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">
                <i className="ri-information-line mr-1"></i>
                本人確認について
              </h3>
              <ul className="text-xs text-gray-700 space-y-2">
                <li className="flex items-start gap-2">
                  <i className="ri-check-line text-teal-600 mt-0.5"></i>
                  <span>外部eKYCサービスを利用した安全な手続き</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-check-line text-teal-600 mt-0.5"></i>
                  <span>運転免許証、マイナンバーカード等が利用可能</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-check-line text-teal-600 mt-0.5"></i>
                  <span>審査は通常1〜3営業日で完了</span>
                </li>
                <li className="flex items-start gap-2">
                  <i className="ri-check-line text-teal-600 mt-0.5"></i>
                  <span>個人情報は厳重に管理されます</span>
                </li>
              </ul>
            </div>

            {config.action && (
              <Button fullWidth size="lg" onClick={config.action.onClick}>
                {config.action.label}
              </Button>
            )}

            {status === 'under_review' && (
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">
                  審査完了までお待ちください
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Help Link */}
        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-teal-600 hover:underline cursor-pointer">
            <i className="ri-question-line mr-1"></i>
            本人確認についてのヘルプ
          </a>
        </div>
      </div>
    </div>
  );
}