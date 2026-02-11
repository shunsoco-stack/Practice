import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/base/Button';

export default function AgeGate() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (!agreed) {
      setError('18歳以上であることを確認してください');
      return;
    }
    
    // API call: POST /api/v1/onboarding/age-gate
    navigate('/terms');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 flex items-center justify-center bg-amber-100 rounded-full mx-auto mb-4">
              <i className="ri-error-warning-line text-3xl text-amber-600"></i>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">年齢確認</h1>
            <p className="text-sm text-gray-600">
              このサービスは18歳以上の方のみ<br />ご利用いただけます
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h3 className="font-semibold text-amber-900 text-sm mb-2">
                <i className="ri-information-line mr-1"></i>
                重要なお知らせ
              </h3>
              <ul className="text-xs text-amber-800 space-y-1.5 ml-4 list-disc">
                <li>18歳未満の方は利用できません</li>
                <li>虚偽の申告は利用規約違反となります</li>
                <li>後ほど本人確認（KYC）が必要です</li>
              </ul>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => {
                  setAgreed(e.target.checked);
                  setError('');
                }}
                className="mt-0.5 w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-2 focus:ring-teal-200 cursor-pointer"
              />
              <span className="text-sm text-gray-700 group-hover:text-gray-900">
                私は18歳以上であり、成人向けコンテンツを含むサービスの利用に同意します
              </span>
            </label>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-800">
                  <i className="ri-error-warning-line mr-1"></i>
                  {error}
                </p>
              </div>
            )}

            <div className="space-y-3">
              <Button fullWidth size="lg" onClick={handleConfirm}>
                確認して次へ
              </Button>
              <Button 
                fullWidth 
                variant="secondary" 
                onClick={() => navigate('/')}
              >
                戻る
              </Button>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500">
                18歳未満の方は<br />
                <a href="/" className="text-teal-600 hover:underline cursor-pointer">トップページに戻る</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}