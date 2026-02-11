"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { api } from "@/lib/client/api";

interface BoundaryItem {
  key: string;
  value: string;
}

const boundaryLabelMap: Record<string, string> = {
  first_meeting_public_place: "初回は公共の場所",
  photo_exchange: "写真交換は要相談",
};

export default function BoundariesPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boundaries, setBoundaries] = useState<string[]>([]);
  const [customBoundary, setCustomBoundary] = useState("");

  const predefinedBoundaries = useMemo(
    () => [
      "身体的接触の強要",
      "個人情報の無断共有",
      "深夜の連絡",
      "金銭の要求",
      "過度な束縛",
      "暴言・侮辱",
      "同意なしの撮影",
      "ストーカー行為",
      "第三者への情報漏洩",
      "違法行為の勧誘",
    ],
    [],
  );

  useEffect(() => {
    let active = true;
    const load = async () => {
      const response = await api.get<{ items: BoundaryItem[] }>("/api/v1/me/boundaries");
      if (!active) {
        return;
      }
      if (response.ok) {
        setBoundaries(
          response.data.items.map((item) => boundaryLabelMap[item.key] ?? item.key),
        );
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

  const toggleBoundary = (boundary: string) => {
    setBoundaries((prev) =>
      prev.includes(boundary)
        ? prev.filter((item) => item !== boundary)
        : [...prev, boundary],
    );
  };

  const addCustomBoundary = () => {
    const value = customBoundary.trim();
    if (value && !boundaries.includes(value)) {
      setBoundaries((prev) => [...prev, value]);
      setCustomBoundary("");
    }
  };

  const removeBoundary = (boundary: string) => {
    setBoundaries((prev) => prev.filter((item) => item !== boundary));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    const response = await api.put<{ items: BoundaryItem[] }>("/api/v1/me/boundaries", {
      items: boundaries.map((boundary) => ({
        key: boundary,
        value: "deny",
      })),
    });
    setSaving(false);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    router.push("/discovery");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">境界条件設定</h1>
          <p className="text-sm text-gray-600">
            絶対に受け入れられない行為を設定してください。違反時にはすぐ通報できます。
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
              <i className="ri-error-warning-line text-red-600" />
            </div>
            <div className="text-sm text-red-800">
              <p className="mb-1 font-medium">重要な注意事項</p>
              <p className="text-xs">
                ここで設定した境界条件は、相手に明示されます。違反行為を発見した場合は、
                すぐに通報してください。
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              <i className="ri-forbid-line mr-2" />
              絶対NG項目
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              該当する項目を選択してください（複数選択可）
            </p>
            <div className="flex flex-wrap gap-2">
              {predefinedBoundaries.map((boundary) => (
                <button
                  key={boundary}
                  type="button"
                  onClick={() => toggleBoundary(boundary)}
                  className={`cursor-pointer whitespace-nowrap rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all
                    ${
                      boundaries.includes(boundary)
                        ? "border-red-600 bg-red-600 text-white"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                >
                  {boundary}
                </button>
              ))}
            </div>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              <i className="ri-add-circle-line mr-2" />
              カスタム項目を追加
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              上記以外で、受け入れられない行為を追加できます
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={customBoundary}
                onChange={(event) => setCustomBoundary(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addCustomBoundary();
                  }
                }}
                placeholder="例: 深夜2時以降の連絡"
                maxLength={50}
                className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
              />
              <Button onClick={addCustomBoundary} disabled={!customBoundary.trim()}>
                追加
              </Button>
            </div>
          </Card>

          {boundaries.length > 0 && (
            <Card>
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                <i className="ri-shield-check-line mr-2" />
                設定済みの境界条件
              </h2>
              <div className="space-y-2">
                {boundaries.map((boundary) => (
                  <div
                    key={boundary}
                    className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3"
                  >
                    <span className="text-sm font-medium text-red-900">{boundary}</span>
                    <button
                      type="button"
                      onClick={() => removeBoundary(boundary)}
                      className="flex h-6 w-6 cursor-pointer items-center justify-center rounded text-red-600 hover:bg-red-100"
                    >
                      <i className="ri-close-line" />
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-600">
                  <i className="ri-information-line mr-1" />
                  これらの条件は相手のプロフィールに「この人のNG項目」として表示されます
                </p>
              </div>
            </Card>
          )}

          <Card className="border-teal-200 bg-teal-50">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                <i className="ri-lightbulb-line text-teal-600" />
              </div>
              <div className="text-sm text-teal-800">
                <p className="mb-1 font-medium">境界条件の効果</p>
                <ul className="space-y-1 text-xs">
                  <li>• 相手があなたの境界条件を事前に確認できます</li>
                  <li>• 違反行為があった場合、通報時に記録できます</li>
                  <li>• 境界条件が一致するユーザーが優先表示されます</li>
                </ul>
              </div>
            </div>
          </Card>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => router.back()}>
              戻る
            </Button>
            <Button fullWidth onClick={() => void handleSave()} disabled={saving || loading}>
              {saving ? "保存中..." : "保存して完了"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
