"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ConsentToggle from "@/components/ui/ConsentToggle";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { api } from "@/lib/client/api";

type ConsentValue = "allow" | "deny" | "discuss";

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

interface ConsentItem {
  code: string;
  value: ConsentValue;
}

const codeMap: Record<string, [keyof ConsentSettings, string]> = {
  chat_style_direct: ["communication", "textFrequency"],
  voice_call_allowed: ["communication", "voiceCall"],
  photo_exchange: ["communication", "photoExchange"],
  first_meeting_public_place: ["meeting", "publicPlace"],
  meeting_time_preference: ["meeting", "timePreference"],
  alcohol_consumption: ["meeting", "alcoholConsumption"],
  personal_info_exchange: ["privacy", "personalInfoExchange"],
  sns_exchange: ["privacy", "snsExchange"],
  photo_visibility: ["privacy", "photoVisibility"],
};

const reverseCodeMap: Record<string, string> = {
  "communication.textFrequency": "chat_style_direct",
  "communication.voiceCall": "voice_call_allowed",
  "communication.photoExchange": "photo_exchange",
  "meeting.publicPlace": "first_meeting_public_place",
  "meeting.timePreference": "meeting_time_preference",
  "meeting.alcoholConsumption": "alcohol_consumption",
  "privacy.personalInfoExchange": "personal_info_exchange",
  "privacy.snsExchange": "sns_exchange",
  "privacy.photoVisibility": "photo_visibility",
};

const defaultSettings: ConsentSettings = {
  communication: {
    textFrequency: "discuss",
    voiceCall: "discuss",
    photoExchange: "discuss",
  },
  meeting: {
    publicPlace: "allow",
    timePreference: "discuss",
    alcoholConsumption: "discuss",
  },
  privacy: {
    personalInfoExchange: "deny",
    snsExchange: "discuss",
    photoVisibility: "discuss",
  },
};

export default function ConsentsPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consents, setConsents] = useState<ConsentSettings>(defaultSettings);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const response = await api.get<{ items: ConsentItem[] }>("/api/v1/me/consents");
      if (!active) {
        return;
      }
      if (response.ok) {
        const next: ConsentSettings = structuredClone(defaultSettings);
        for (const item of response.data.items) {
          const mapping = codeMap[item.code];
          if (!mapping) {
            continue;
          }
          const [category, key] = mapping;
          (
            next[category] as Record<string, ConsentValue>
          )[key] = item.value;
        }
        setConsents(next);
      } else {
        setError(response.error.message);
      }
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const updateConsent = (
    category: keyof ConsentSettings,
    key: string,
    value: ConsentValue,
  ) => {
    setConsents((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const toApiItems = (state: ConsentSettings): ConsentItem[] => {
    const items: ConsentItem[] = [];
    for (const [category, map] of Object.entries(state)) {
      for (const [key, value] of Object.entries(map as Record<string, ConsentValue>)) {
        const code = reverseCodeMap[`${category}.${key}`];
        if (code) {
          items.push({ code, value });
        }
      }
    }
    return items;
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const response = await api.put<{ items: ConsentItem[] }>("/api/v1/me/consents", {
      items: toApiItems(consents),
    });
    setSaving(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    router.push("/boundaries");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">同意設定</h1>
          <p className="text-sm text-gray-600">
            あなたの境界線を設定してください。設定はいつでも変更・撤回できます。
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-lg border border-teal-200 bg-teal-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
              <i className="ri-information-line text-teal-600" />
            </div>
            <div className="text-sm text-teal-800">
              <p className="mb-1 font-medium">同意設定について</p>
              <ul className="space-y-1 text-xs">
                <li>
                  <strong>許可:</strong> この行為に同意しています
                </li>
                <li>
                  <strong>要相談:</strong> 状況に応じて相談したいです
                </li>
                <li>
                  <strong>拒否:</strong> この行為は望みません
                </li>
              </ul>
              <p className="mt-2 text-xs">設定はいつでも変更・撤回できます。</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              <i className="ri-chat-3-line mr-2" />
              コミュニケーション
            </h2>
            <div className="space-y-5">
              <ConsentToggle
                label="メッセージの頻度"
                description="頻繁なメッセージのやり取り"
                value={consents.communication.textFrequency}
                onChange={(value) => updateConsent("communication", "textFrequency", value)}
              />
              <ConsentToggle
                label="音声通話"
                description="電話やビデオ通話での会話"
                value={consents.communication.voiceCall}
                onChange={(value) => updateConsent("communication", "voiceCall", value)}
              />
              <ConsentToggle
                label="写真の交換"
                description="プライベートな写真の送受信"
                value={consents.communication.photoExchange}
                onChange={(value) => updateConsent("communication", "photoExchange", value)}
              />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              <i className="ri-map-pin-line mr-2" />
              会う条件
            </h2>
            <div className="space-y-5">
              <ConsentToggle
                label="初回は公共の場所"
                description="初めて会う時は人目のある場所で"
                value={consents.meeting.publicPlace}
                onChange={(value) => updateConsent("meeting", "publicPlace", value)}
              />
              <ConsentToggle
                label="時間帯の希望"
                description="昼間や夕方など、時間帯の指定"
                value={consents.meeting.timePreference}
                onChange={(value) => updateConsent("meeting", "timePreference", value)}
              />
              <ConsentToggle
                label="飲酒を伴う場所"
                description="お酒を飲む場所での待ち合わせ"
                value={consents.meeting.alcoholConsumption}
                onChange={(value) => updateConsent("meeting", "alcoholConsumption", value)}
              />
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              <i className="ri-lock-line mr-2" />
              プライバシー
            </h2>
            <div className="space-y-5">
              <ConsentToggle
                label="個人情報の交換"
                description="本名、住所、勤務先などの共有"
                value={consents.privacy.personalInfoExchange}
                onChange={(value) => updateConsent("privacy", "personalInfoExchange", value)}
              />
              <ConsentToggle
                label="SNSアカウントの交換"
                description="SNS上の連絡先交換"
                value={consents.privacy.snsExchange}
                onChange={(value) => updateConsent("privacy", "snsExchange", value)}
              />
              <ConsentToggle
                label="顔写真の公開範囲"
                description="プロフィールでの顔写真の表示"
                value={consents.privacy.photoVisibility}
                onChange={(value) => updateConsent("privacy", "photoVisibility", value)}
              />
            </div>
          </Card>

          <Card className="bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <i className="ri-lightbulb-line text-amber-600" />
              </div>
              <div className="text-sm text-gray-700">
                <p className="mb-1 font-medium">マッチングのヒント</p>
                <p className="text-xs">
                  同意設定が似ているユーザーが優先的に表示されます。正直に設定することで、
                  より相性の良い相手と出会えます。
                </p>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.back()}>
              戻る
            </Button>
            <Button fullWidth onClick={() => void handleSave()} disabled={saving || loading}>
              {saving ? "保存中..." : "保存して次へ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
