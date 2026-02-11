import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/base/Button';
import Input from '../../../components/base/Input';
import Card from '../../../components/base/Card';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    displayName: '',
    age: '',
    gender: '',
    location: '',
    bio: '',
    interests: [] as string[],
    profileVisibility: 'public' as 'public' | 'private',
    showAge: true,
    showLocation: true
  });

  const interestOptions = [
    '音楽', '映画', '読書', 'スポーツ', '旅行', 
    'グルメ', 'アート', 'ゲーム', 'アウトドア', 'カフェ巡り'
  ];

  const handleInterestToggle = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // API call: PATCH /api/v1/me/profile
    setTimeout(() => {
      setSaving(false);
      navigate('/consents');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">プロフィール設定</h1>
          <p className="text-sm text-gray-600">
            あなたの情報を入力してください。公開範囲は個別に設定できます。
          </p>
        </div>

        <div className="space-y-6">
          {/* Basic Info */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">基本情報</h2>
            <div className="space-y-4">
              <Input
                label="表示名"
                placeholder="ニックネームを入力"
                value={profile.displayName}
                onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                helperText="他のユーザーに表示される名前です"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    年齢
                  </label>
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    性別
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none cursor-pointer"
                  >
                    <option value="">選択してください</option>
                    <option value="male">男性</option>
                    <option value="female">女性</option>
                    <option value="other">その他</option>
                    <option value="not_specified">回答しない</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  地域
                </label>
                <select
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none cursor-pointer"
                >
                  <option value="">選択してください</option>
                  <option value="tokyo">東京都</option>
                  <option value="osaka">大阪府</option>
                  <option value="kanagawa">神奈川県</option>
                  <option value="aichi">愛知県</option>
                  <option value="fukuoka">福岡県</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  自己紹介
                </label>
                <textarea
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="あなたについて教えてください"
                  rows={4}
                  maxLength={500}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">{profile.bio.length}/500文字</p>
              </div>
            </div>
          </Card>

          {/* Interests */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">興味・趣味</h2>
            <p className="text-sm text-gray-600 mb-4">
              あなたの興味があることを選択してください（複数選択可）
            </p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-4 py-2 text-sm font-medium rounded-full border-2 transition-all cursor-pointer whitespace-nowrap
                    ${profile.interests.includes(interest)
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </Card>

          {/* Privacy Settings */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="ri-lock-line mr-2"></i>
              プライバシー設定
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">プロフィールの公開</p>
                  <p className="text-xs text-gray-500">他のユーザーがあなたを見つけられるようにする</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.profileVisibility === 'public'}
                    onChange={(e) => setProfile({ 
                      ...profile, 
                      profileVisibility: e.target.checked ? 'public' : 'private' 
                    })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-gray-200">
                <div>
                  <p className="text-sm font-medium text-gray-900">年齢を表示</p>
                  <p className="text-xs text-gray-500">プロフィールに年齢を表示する</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.showAge}
                    onChange={(e) => setProfile({ ...profile, showAge: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">地域を表示</p>
                  <p className="text-xs text-gray-500">プロフィールに地域を表示する</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={profile.showLocation}
                    onChange={(e) => setProfile({ ...profile, showLocation: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              戻る
            </Button>
            <Button fullWidth onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存して次へ'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}