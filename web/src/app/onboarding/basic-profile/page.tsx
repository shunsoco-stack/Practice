"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import { api } from "@/lib/client/api";

type Gender = "male" | "female" | "other" | "not_specified";

interface BasicProfileResponse {
  nickname: string;
  gender: Gender | null;
  birthDate: string;
  isGenderLocked: boolean;
  isBirthDateLocked: boolean;
  isCompleted: boolean;
}

const genderOptions: Array<{ value: Gender; label: string }> = [
  { value: "male", label: "男性" },
  { value: "female", label: "女性" },
  { value: "other", label: "その他" },
  { value: "not_specified", label: "回答しない" },
];

function parseBirthDate(birthDate: string): { year: number; month: number; day: number } {
  const date = new Date(birthDate);
  if (Number.isNaN(date.getTime())) {
    return { year: 2000, month: 1, day: 1 };
  }
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  };
}

export default function BasicProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isGenderLocked, setIsGenderLocked] = useState(false);
  const [isBirthDateLocked, setIsBirthDateLocked] = useState(false);
  const [nickname, setNickname] = useState("");
  const [gender, setGender] = useState<Gender>("not_specified");
  const [year, setYear] = useState(2000);
  const [month, setMonth] = useState(1);
  const [day, setDay] = useState(1);

  const years = useMemo(() => {
    const current = new Date().getUTCFullYear();
    const max = current - 18;
    const min = current - 80;
    const list: number[] = [];
    for (let value = max; value >= min; value -= 1) {
      list.push(value);
    }
    return list;
  }, []);

  const monthOptions = useMemo(() => Array.from({ length: 12 }, (_, idx) => idx + 1), []);

  const dayOptions = useMemo(() => {
    const maxDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return Array.from({ length: maxDay }, (_, idx) => idx + 1);
  }, [year, month]);

  useEffect(() => {
    if (!dayOptions.includes(day)) {
      setDay(dayOptions[dayOptions.length - 1] ?? 1);
    }
  }, [day, dayOptions]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      const response = await api.get<BasicProfileResponse>(
        "/api/v1/onboarding/basic-profile",
      );
      if (!active) {
        return;
      }
      if (!response.ok) {
        setError(response.error.message);
        setLoading(false);
        return;
      }
      const birth = parseBirthDate(response.data.birthDate);
      setNickname(response.data.nickname);
      setGender(response.data.gender ?? "not_specified");
      setYear(birth.year);
      setMonth(birth.month);
      setDay(birth.day);
      setIsGenderLocked(response.data.isGenderLocked);
      setIsBirthDateLocked(response.data.isBirthDateLocked);
      if (response.data.isCompleted) {
        setInfo("性別と生年月日は設定済みです。変更できません。");
      }
      setLoading(false);
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async () => {
    setSaving(true);
    setError(null);
    setInfo(null);
    const birthDate = `${year.toString().padStart(4, "0")}-${month
      .toString()
      .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
    const response = await api.post<BasicProfileResponse>(
      "/api/v1/onboarding/basic-profile",
      {
        nickname,
        gender,
        birthDate,
      },
    );
    setSaving(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    setIsGenderLocked(response.data.isGenderLocked);
    setIsBirthDateLocked(response.data.isBirthDateLocked);
    router.push("/kyc-status");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Card padding="lg" className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">基本情報の設定</h1>
            <p className="mt-2 text-sm text-gray-600">
              利用規約への同意後、KYCに進む前に基本情報を設定してください。
            </p>
          </div>

          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <p className="font-semibold">重要</p>
            <p className="mt-1">
              性別と生年月日は登録後に一切変更できません。入力内容をよく確認してください。
            </p>
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {info && (
            <div className="rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-700">
              {info}
            </div>
          )}

          <Input
            label="名前（表示名）"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="表示名を入力してください"
          />

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">性別</label>
            <select
              value={gender}
              onChange={(event) => setGender(event.target.value as Gender)}
              disabled={isGenderLocked}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-gray-100"
            >
              {genderOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {isGenderLocked && (
              <p className="text-xs text-gray-500">性別は設定済みのため変更できません。</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">生年月日</label>
            <div className="grid grid-cols-3 gap-2">
              <select
                value={year}
                onChange={(event) => setYear(Number(event.target.value))}
                disabled={isBirthDateLocked}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {years.map((value) => (
                  <option key={value} value={value}>
                    {value}年
                  </option>
                ))}
              </select>
              <select
                value={month}
                onChange={(event) => setMonth(Number(event.target.value))}
                disabled={isBirthDateLocked}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {monthOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}月
                  </option>
                ))}
              </select>
              <select
                value={day}
                onChange={(event) => setDay(Number(event.target.value))}
                disabled={isBirthDateLocked}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:cursor-not-allowed disabled:bg-gray-100"
              >
                {dayOptions.map((value) => (
                  <option key={value} value={value}>
                    {value}日
                  </option>
                ))}
              </select>
            </div>
            {isBirthDateLocked && (
              <p className="text-xs text-gray-500">生年月日は設定済みのため変更できません。</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.push("/terms")}>
              戻る
            </Button>
            <Button
              fullWidth
              onClick={() => void handleSubmit()}
              disabled={loading || saving}
            >
              {saving ? "保存中..." : "保存してeKYCへ進む"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
