"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { api } from "@/lib/client/api";

type Gender = "male" | "female" | "other" | "not_specified" | null;

interface ProfileResponse {
  profile: {
    id: string;
    nickname: string;
    age: number;
    birthDate: string;
    gender: Gender;
    isGenderLocked: boolean;
    isBirthDateLocked: boolean;
    region: string;
    bio: string;
    topPhotoUrl: string | null;
    subPhotoUrls: string[];
    kycStatus: "pending" | "verified" | "rejected";
    visibility: "visible" | "hidden";
  };
}

function calculateAgeFromBirthDate(birthDate: string): number {
  const dob = new Date(birthDate);
  const today = new Date();
  let age = today.getUTCFullYear() - dob.getUTCFullYear();
  const monthDiff = today.getUTCMonth() - dob.getUTCMonth();
  const dayDiff = today.getUTCDate() - dob.getUTCDate();
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age -= 1;
  }
  return Math.max(0, age);
}

function genderLabel(gender: Gender): string {
  switch (gender) {
    case "male":
      return "男性";
    case "female":
      return "女性";
    case "other":
      return "その他";
    case "not_specified":
      return "回答しない";
    default:
      return "未設定";
  }
}

async function toDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("invalid_file_data"));
      }
    };
    reader.onerror = () => reject(new Error("file_read_failed"));
    reader.readAsDataURL(file);
  });
}

export default function ProfileEditPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState({
    displayName: "",
    birthDate: "",
    gender: null as Gender,
    isGenderLocked: false,
    isBirthDateLocked: false,
    location: "",
    bio: "",
    topPhotoUrl: null as string | null,
    subPhotoUrls: [null, null, null] as Array<string | null>,
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
        const subPhotos = [null, null, null] as Array<string | null>;
        response.data.profile.subPhotoUrls.slice(0, 3).forEach((value, index) => {
          subPhotos[index] = value;
        });
        setProfile((prev) => ({
          ...prev,
          displayName: response.data.profile.nickname,
          birthDate: response.data.profile.birthDate,
          gender: response.data.profile.gender,
          isGenderLocked: response.data.profile.isGenderLocked,
          isBirthDateLocked: response.data.profile.isBirthDateLocked,
          location: response.data.profile.region,
          bio: response.data.profile.bio,
          topPhotoUrl: response.data.profile.topPhotoUrl,
          subPhotoUrls: subPhotos,
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

  const handleTopPhotoSelect = async (file?: File) => {
    if (!file) {
      return;
    }
    try {
      const dataUrl = await toDataUrl(file);
      setProfile((prev) => ({ ...prev, topPhotoUrl: dataUrl }));
    } catch {
      setError("画像ファイルの読み込みに失敗しました。");
    }
  };

  const handleSubPhotoSelect = async (index: number, file?: File) => {
    if (!file) {
      return;
    }
    try {
      const dataUrl = await toDataUrl(file);
      setProfile((prev) => {
        const next = [...prev.subPhotoUrls];
        next[index] = dataUrl;
        return { ...prev, subPhotoUrls: next };
      });
    } catch {
      setError("画像ファイルの読み込みに失敗しました。");
    }
  };

  const removeTopPhoto = () => {
    setProfile((prev) => ({ ...prev, topPhotoUrl: null }));
  };

  const removeSubPhoto = (index: number) => {
    setProfile((prev) => {
      const next = [...prev.subPhotoUrls];
      next[index] = null;
      return { ...prev, subPhotoUrls: next };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const response = await api.patch<ProfileResponse>("/api/v1/me/profile", {
      nickname: profile.displayName,
      region: profile.location,
      bio: profile.bio,
      topPhotoUrl: profile.topPhotoUrl,
      subPhotoUrls: profile.subPhotoUrls.filter(
        (url): url is string => typeof url === "string" && url.length > 0,
      ),
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
            基本プロフィールと写真を設定してください。公開範囲は個別に設定できます。
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

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
                <p className="font-semibold">性別・年齢は変更不可</p>
                <p className="mt-1">
                  性別と生年月日は初回登録時に確定し、以降は変更できません。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">年齢</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {profile.birthDate
                      ? `${calculateAgeFromBirthDate(profile.birthDate)}歳`
                      : "未設定"}
                  </p>
                </div>

                <div className="rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <p className="text-xs text-gray-500">性別</p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {genderLabel(profile.gender)}
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">地域</label>
                <select
                  value={profile.location}
                  onChange={(event) =>
                    setProfile({ ...profile, location: event.target.value })
                  }
                  className="w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
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
                  className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
                />
                <p className="mt-1 text-xs text-gray-500">{profile.bio.length}/500文字</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">プロフィール写真</h2>
            <p className="mb-4 text-sm text-gray-600">
              トップ写真を1枚、サブ写真を最大3枚まで設定できます。
            </p>

            <div className="space-y-5">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">トップ写真（1枚）</p>
                <div
                  className="relative h-56 w-full rounded-xl border border-gray-200 bg-gray-100 bg-cover bg-center"
                  style={{
                    backgroundImage: profile.topPhotoUrl
                      ? `url(${profile.topPhotoUrl})`
                      : "none",
                  }}
                >
                  {!profile.topPhotoUrl && (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      画像未設定
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <label className="cursor-pointer rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700">
                    画像を選択
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        void handleTopPhotoSelect(event.target.files?.[0])
                      }
                    />
                  </label>
                  {profile.topPhotoUrl && (
                    <Button variant="secondary" onClick={removeTopPhoto}>
                      削除
                    </Button>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900">サブ写真（最大3枚）</p>
                <div className="grid grid-cols-3 gap-3">
                  {profile.subPhotoUrls.map((url, index) => (
                    <div key={`sub-photo-${index}`} className="space-y-2">
                      <div
                        className="relative h-28 rounded-lg border border-gray-200 bg-gray-100 bg-cover bg-center"
                        style={{ backgroundImage: url ? `url(${url})` : "none" }}
                      >
                        {!url && (
                          <div className="flex h-full items-center justify-center text-xs text-gray-500">
                            未設定
                          </div>
                        )}
                      </div>
                      <label className="block cursor-pointer rounded-md bg-teal-600 px-2 py-1 text-center text-xs font-medium text-white hover:bg-teal-700">
                        選択
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(event) =>
                            void handleSubPhotoSelect(index, event.target.files?.[0])
                          }
                        />
                      </label>
                      {url && (
                        <button
                          type="button"
                          onClick={() => removeSubPhoto(index)}
                          className="w-full rounded-md border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          削除
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
