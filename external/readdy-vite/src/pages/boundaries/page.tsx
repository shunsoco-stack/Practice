import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';

export default function Boundaries() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const [boundaries, setBoundaries] = useState<string[]>([]);
  const [customBoundary, setCustomBoundary] = useState('');

  const predefinedBoundaries = [
    '身体的接触の強要',
    '個人情報の無断共有',
    '深夜の連絡',
    '金銭の要求',
    '過度な束縛',
    '暴言・侮辱',
    '同意なしの撮影',
    'ストーカー行為',
    '第三者への情報漏洩',
    '違法行為の勧誘'
  ];

  const toggleBoundary = (boundary: string) => {
    setBoundaries(prev =>
      prev.includes(boundary)
        ? prev.filter(b => b !== boundary)
        : [...prev, boundary]
    );
  };

  const addCustomBoundary = () => {
    if (customBoundary.trim() && !boundaries.includes(customBoundary.trim())) {
      setBoundaries(prev => [...prev, customBoundary.trim()]);
      setCustomBoundary('');
    }
  };

  const removeBoundary = (boundary: string) => {
    setBoundaries(prev => prev.filter(b => b !== boundary));
  };

  const handleSave = async () => {
    setSaving(true);
    // API call: PUT /api/v1/me/boundaries
    setTimeout(() => {
      setSaving(false);
      navigate('/discovery');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">境界条件設定</h1>
          <p className="text-sm text-gray-600">
            絶対に受け入れられない行為を設定してください。これらは相手に明示され、違反時には即座に通報できます。
          </p>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-error-warning-line text-red-600"></i>
            </div>
            <div className="text-sm text-red-800">
              <p className="font-medium mb-1">重要な注意事項</p>
              <p className="text-xs">
                ここで設定した境界条件は、相手のプロフィールに表示されます。違反行為を発見した場合は、すぐに通報してください。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Predefined Boundaries */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="ri-forbid-line mr-2"></i>
              絶対NG項目
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              該当する項目を選択してください（複数選択可）
            </p>
            <div className="flex flex-wrap gap-2">
              {predefinedBoundaries.map((boundary) => (
                <button
                  key={boundary}
                  onClick={() => toggleBoundary(boundary)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg border-2 transition-all cursor-pointer whitespace-nowrap
                    ${boundaries.includes(boundary)
                      ? 'bg-red-600 text-white border-red-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                >
                  {boundary}
                </button>
              ))}
            </div>
          </Card>

          {/* Custom Boundaries */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="ri-add-circle-line mr-2"></i>
              カスタム項目を追加
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              上記以外で、あなたが受け入れられない行為を追加できます
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customBoundary}
                onChange={(e) => setCustomBoundary(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addCustomBoundary()}
                placeholder="例: 深夜2時以降の連絡"
                maxLength={50}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
              />
              <Button onClick={addCustomBoundary} disabled={!customBoundary.trim()}>
                追加
              </Button>
            </div>
          </Card>

          {/* Selected Boundaries */}
          {boundaries.length > 0 && (
            <Card>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                <i className="ri-shield-check-line mr-2"></i>
                設定済みの境界条件
              </h2>
              <div className="space-y-2">
                {boundaries.map((boundary) => (
                  <div
                    key={boundary}
                    className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                  >
                    <span className="text-sm text-red-900 font-medium">{boundary}</span>
                    <button
                      onClick={() => removeBoundary(boundary)}
                      className="w-6 h-6 flex items-center justify-center text-red-600 hover:bg-red-100 rounded cursor-pointer"
                    >
                      <i className="ri-close-line"></i>
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">
                  <i className="ri-information-line mr-1"></i>
                  これらの条件は相手のプロフィールに「この人のNG項目」として表示されます
                </p>
              </div>
            </Card>
          )}

          {/* Info */}
          <Card className="bg-teal-50 border-teal-200">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-lightbulb-line text-teal-600"></i>
              </div>
              <div className="text-sm text-teal-800">
                <p className="font-medium mb-1">境界条件の効果</p>
                <ul className="space-y-1 text-xs">
                  <li>• 相手があなたの境界条件を事前に確認できます</li>
                  <li>• 違反行為があった場合、通報時に自動的に記録されます</li>
                  <li>• 境界条件が一致するユーザーが優先的に表示されます</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              戻る
            </Button>
            <Button fullWidth onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存して完了'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}