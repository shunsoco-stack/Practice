import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/base/Button';
import Card from '../../components/base/Card';
import ConsentToggle from '../../components/base/ConsentToggle';

type ConsentValue = 'allow' | 'deny' | 'discuss';

interface ConsentSettings {
  communication: {
    textFrequency: ConsentValue;
    voiceCall: ConsentValue;
    photoExchange: ConsentValue;
  };
  meeting: {
    publicPlace: ConsentValue;
    timePreference: ConsentValue;
    alcoholConsumption: ConsentValue;
  };
  privacy: {
    personalInfoExchange: ConsentValue;
    snsExchange: ConsentValue;
    photoVisibility: ConsentValue;
  };
}

export default function Consents() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  
  const [consents, setConsents] = useState<ConsentSettings>({
    communication: {
      textFrequency: 'discuss',
      voiceCall: 'discuss',
      photoExchange: 'discuss'
    },
    meeting: {
      publicPlace: 'allow',
      timePreference: 'discuss',
      alcoholConsumption: 'discuss'
    },
    privacy: {
      personalInfoExchange: 'deny',
      snsExchange: 'discuss',
      photoVisibility: 'discuss'
    }
  });

  const updateConsent = (category: keyof ConsentSettings, key: string, value: ConsentValue) => {
    setConsents(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    // API call: PUT /api/v1/me/consents
    setTimeout(() => {
      setSaving(false);
      navigate('/boundaries');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">同意設定</h1>
          <p className="text-sm text-gray-600">
            あなたの境界線を設定してください。これらの設定は相手に表示され、マッチングの参考になります。
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
              <i className="ri-information-line text-teal-600"></i>
            </div>
            <div className="text-sm text-teal-800">
              <p className="font-medium mb-1">同意設定について</p>
              <ul className="space-y-1 text-xs">
                <li><strong>許可:</strong> この行為に同意しています</li>
                <li><strong>要相談:</strong> 状況に応じて相談したいです</li>
                <li><strong>拒否:</strong> この行為は望みません</li>
              </ul>
              <p className="mt-2 text-xs">設定はいつでも変更・撤回できます。</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Communication */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="ri-chat-3-line mr-2"></i>
              コミュニケーション
            </h2>
            <div className="space-y-5">
              <ConsentToggle
                label="メッセージの頻度"
                description="頻繁なメッセージのやり取り"
                value={consents.communication.textFrequency}
                onChange={(value) => updateConsent('communication', 'textFrequency', value)}
              />
              <ConsentToggle
                label="音声通話"
                description="電話やビデオ通話での会話"
                value={consents.communication.voiceCall}
                onChange={(value) => updateConsent('communication', 'voiceCall', value)}
              />
              <ConsentToggle
                label="写真の交換"
                description="プライベートな写真の送受信"
                value={consents.communication.photoExchange}
                onChange={(value) => updateConsent('communication', 'photoExchange', value)}
              />
            </div>
          </Card>

          {/* Meeting Conditions */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="ri-map-pin-line mr-2"></i>
              会う条件
            </h2>
            <div className="space-y-5">
              <ConsentToggle
                label="初回は公共の場所"
                description="初めて会う時は人目のある場所で"
                value={consents.meeting.publicPlace}
                onChange={(value) => updateConsent('meeting', 'publicPlace', value)}
              />
              <ConsentToggle
                label="時間帯の希望"
                description="昼間や夕方など、時間帯の指定"
                value={consents.meeting.timePreference}
                onChange={(value) => updateConsent('meeting', 'timePreference', value)}
              />
              <ConsentToggle
                label="飲酒を伴う場所"
                description="お酒を飲む場所での待ち合わせ"
                value={consents.meeting.alcoholConsumption}
                onChange={(value) => updateConsent('meeting', 'alcoholConsumption', value)}
              />
            </div>
          </Card>

          {/* Privacy */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              <i className="ri-lock-line mr-2"></i>
              プライバシー
            </h2>
            <div className="space-y-5">
              <ConsentToggle
                label="個人情報の交換"
                description="本名、住所、勤務先などの共有"
                value={consents.privacy.personalInfoExchange}
                onChange={(value) => updateConsent('privacy', 'personalInfoExchange', value)}
              />
              <ConsentToggle
                label="SNSアカウントの交換"
                description="Instagram、Twitterなどの連絡先"
                value={consents.privacy.snsExchange}
                onChange={(value) => updateConsent('privacy', 'snsExchange', value)}
              />
              <ConsentToggle
                label="顔写真の公開範囲"
                description="プロフィールでの顔写真の表示"
                value={consents.privacy.photoVisibility}
                onChange={(value) => updateConsent('privacy', 'photoVisibility', value)}
              />
            </div>
          </Card>

          {/* Summary */}
          <Card className="bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="ri-lightbulb-line text-amber-600"></i>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-medium mb-1">マッチングのヒント</p>
                <p className="text-xs">
                  同意設定が似ているユーザーが優先的に表示されます。正直に設定することで、より相性の良い相手と出会えます。
                </p>
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