import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/base/Button';

export default function Terms() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAccept = async () => {
    if (!agreed) return;
    
    setLoading(true);
    // API call: POST /api/v1/terms/consent
    setTimeout(() => {
      navigate('/kyc-status');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-8 text-white">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-lg">
                <i className="ri-file-text-line text-xl"></i>
              </div>
              <h1 className="text-2xl font-bold">利用規約</h1>
            </div>
            <p className="text-teal-50 text-sm">
              サービスをご利用いただく前に、必ず利用規約をお読みください
            </p>
          </div>

          <div className="p-6">
            <div className="bg-gray-50 rounded-lg p-6 mb-6 max-h-96 overflow-y-auto border border-gray-200">
              <div className="prose prose-sm max-w-none">
                <h3 className="text-base font-bold text-gray-900 mb-3">第1条（適用範囲）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  本規約は、Consent-First Matching（以下「本サービス」）の利用に関する条件を定めるものです。ユーザーは本規約に同意の上、本サービスを利用するものとします。
                </p>

                <h3 className="text-base font-bold text-gray-900 mb-3">第2条（年齢制限）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  本サービスは18歳以上の方のみご利用いただけます。18歳未満の方の利用は固く禁じられています。
                </p>

                <h3 className="text-base font-bold text-gray-900 mb-3">第3条（本人確認）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  ユーザーは、本サービスの利用にあたり、外部eKYCサービスを通じた本人確認を完了する必要があります。虚偽の情報を提供した場合、アカウントは即座に停止されます。
                </p>

                <h3 className="text-base font-bold text-gray-900 mb-3">第4条（同意の原則）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  本サービスは相互同意を最優先とします。ユーザーは以下を遵守する必要があります：
                </p>
                <ul className="text-sm text-gray-700 mb-4 ml-5 list-disc space-y-1">
                  <li>相手の同意設定を尊重すること</li>
                  <li>同意なしに個人情報を要求しないこと</li>
                  <li>拒否された行為を強要しないこと</li>
                  <li>同意の撤回を尊重すること</li>
                </ul>

                <h3 className="text-base font-bold text-gray-900 mb-3">第5条（禁止事項）</h3>
                <p className="text-sm text-gray-700 mb-2">以下の行為を禁止します：</p>
                <ul className="text-sm text-gray-700 mb-4 ml-5 list-disc space-y-1">
                  <li>ハラスメント、脅迫、嫌がらせ行為</li>
                  <li>虚偽のプロフィール情報の登録</li>
                  <li>商業目的の勧誘、スパム行為</li>
                  <li>他者の個人情報の無断公開</li>
                  <li>同意なしの性的な内容の送信</li>
                  <li>未成年者との接触を試みる行為</li>
                  <li>違法行為の勧誘や実行</li>
                </ul>

                <h3 className="text-base font-bold text-gray-900 mb-3">第6条（プライバシー）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  ユーザーの個人情報は、プライバシーポリシーに基づき適切に管理されます。公開情報と非公開情報は明確に区別され、相互同意なしに個人情報が共有されることはありません。
                </p>

                <h3 className="text-base font-bold text-gray-900 mb-3">第7条（通報とブロック）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  ユーザーは、規約違反や不適切な行為を発見した場合、速やかに通報することができます。また、不快なユーザーをブロックする権利を有します。
                </p>

                <h3 className="text-base font-bold text-gray-900 mb-3">第8条（アカウント停止）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  運営は、規約違反が確認された場合、事前通知なくアカウントを停止または削除する権利を有します。
                </p>

                <h3 className="text-base font-bold text-gray-900 mb-3">第9条（免責事項）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  運営は、ユーザー間のトラブルについて一切の責任を負いません。ユーザーは自己責任において本サービスを利用するものとします。
                </p>

                <h3 className="text-base font-bold text-gray-900 mb-3">第10条（規約の変更）</h3>
                <p className="text-sm text-gray-700 mb-4">
                  運営は、必要に応じて本規約を変更することができます。変更後の規約は、本サービス上に掲載された時点で効力を生じます。
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-2 focus:ring-teal-200 cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">
                  上記の利用規約を読み、内容に同意します
                </span>
              </label>

              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  fullWidth 
                  onClick={() => navigate('/age-gate')}
                >
                  戻る
                </Button>
                <Button 
                  fullWidth 
                  onClick={handleAccept}
                  disabled={!agreed || loading}
                >
                  {loading ? '処理中...' : '同意して次へ'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}