"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { api } from "@/lib/client/api";

interface ProfileResponse {
  profile: {
    id: string;
    nickname: string;
    age: number;
    region: string;
    bio: string;
    kycStatus: "pending" | "verified" | "rejected";
    visibility: "visible" | "hidden";
  };
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    displayName: "",
    age: "",
    gender: "",
    location: "",
    bio: "",
    interests: [] as string[],
    profileVisibility: "public" as "public" | "private",
    showAge: true,
    showLocation: true,
  });

  const interestOptions = [
    "音楽",
    "映画",
    "読書",
    "スポーツ",
    "旅行",
    "グルメ",
    "アート",
    "ゲーム",
    "アウトドア",
    "カフェ巡り",
  ];

  useEffect(() => {
    let active = true;
    const load = async () => {
      const response = await api.get<ProfileResponse>("/api/v1/me/profile");
      if (!active) {
        return;
      }
      if (response.ok) {
        setProfile((prev) => ({
          ...prev,
          displayName: response.data.profile.nickname,
          age: String(response.data.profile.age),
          location: response.data.profile.region,
          bio: response.data.profile.bio,
          profileVisibility:
            response.data.profile.visibility === "visible" ? "public" : "private",
        }));
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

  const handleInterestToggle = (interest: string) => {
    setProfile((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((item) => item !== interest)
        : [...prev.interests, interest],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const response = await api.patch<ProfileResponse>("/api/v1/me/profile", {
      nickname: profile.displayName,
      region: profile.location,
      bio: profile.bio,
      visibility: profile.profileVisibility === "public" ? "visible" : "hidden",
    });
    setSaving(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    router.push("/consents");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">プロフィール設定</h1>
          <p className="text-sm text-gray-600">
            あなたの情報を入力してください。公開範囲は個別に設定できます。
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">基本情報</h2>
            <div className="space-y-4">
              <Input
                label="表示名"
                placeholder="ニックネームを入力"
                value={profile.displayName}
                onChange={(event) =>
                  setProfile({ ...profile, displayName: event.target.value })
                }
                helperText="他のユーザーに表示される名前です"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">年齢</label>
                  <input
                    type="number"
                    min="18"
                    max="99"
                    value={profile.age}
                    onChange={(event) => setProfile({ ...profile, age: event.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">性別</label>
                  <select
                    value={profile.gender}
                    onChange={(event) =>
                      setProfile({ ...profile, gender: event.target.value })
                    }
                    className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
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
                <label className="mb-1.5 block text-sm font-medium text-gray-700">地域</label>
                <select
                  value={profile.location}
                  onChange={(event) =>
                    setProfile({ ...profile, location: event.target.value })
                  }
                  className="w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
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
                <label className="mb-1.5 block text-sm font-medium text-gray-700">自己紹介</label>
                <textarea
                  value={profile.bio}
                  onChange={(event) => setProfile({ ...profile, bio: event.target.value })}
                  placeholder="あなたについて教えてください"
                  rows={4}
                  maxLength={500}
                  className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                />
                <p className="mt-1 text-xs text-gray-500">{profile.bio.length}/500文字</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">興味・趣味</h2>
            <p className="mb-4 text-sm text-gray-600">
              あなたの興味があることを選択してください（複数選択可）
            </p>
            <div className="flex flex-wrap gap-2">
              {interestOptions.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`cursor-pointer whitespace-nowrap rounded-full border-2 px-4 py-2 text-sm font-medium transition-all
                    ${
                      profile.interests.includes(interest)
                        ? "border-teal-600 bg-teal-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              <i className="ri-lock-line mr-2" />
              プライバシー設定
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">プロフィールの公開</p>
                  <p className="text-xs text-gray-500">他のユーザーがあなたを見つけられるようにする</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={profile.profileVisibility === "public"}
                    onChange={(event) =>
                      setProfile({
                        ...profile,
                        profileVisibility: event.target.checked ? "public" : "private",
                      })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-200" />
                </label>
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">年齢を表示</p>
                  <p className="text-xs text-gray-500">プロフィールに年齢を表示する</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={profile.showAge}
                    onChange={(event) =>
                      setProfile({ ...profile, showAge: event.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-200" />
                </label>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-gray-900">地域を表示</p>
                  <p className="text-xs text-gray-500">プロフィールに地域を表示する</p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={profile.showLocation}
                    onChange={(event) =>
                      setProfile({ ...profile, showLocation: event.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="peer h-6 w-11 rounded-full bg-gray-300 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-teal-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-200" />
                </label>
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
