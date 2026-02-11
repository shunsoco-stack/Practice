"use client";

import { useEffect, useMemo, useState } from "react";
import BlockModal from "@/components/feature/BlockModal";
import ReportModal from "@/components/feature/ReportModal";
import SafetyBar from "@/components/feature/SafetyBar";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { api } from "@/lib/client/api";

interface DiscoveryUser {
  id: string;
  nickname: string;
  age: number;
  region: string;
  bio: string;
  kycStatus: "pending" | "verified" | "rejected";
  visibility: "visible" | "hidden";
}

interface MatchItem {
  id: string;
  peerUserId: string;
  peerNickname: string;
  score: number;
}

export default function DiscoveryPage() {
  const [users, setUsers] = useState<DiscoveryUser[]>([]);
  const [matches, setMatches] = useState<MatchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<DiscoveryUser | null>(null);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isBlockOpen, setIsBlockOpen] = useState(false);

  const selectedOrFirstUser = useMemo(
    () => selectedUser ?? users[0] ?? null,
    [selectedUser, users],
  );

  const fetchData = async () => {
    const [usersResponse, matchesResponse] = await Promise.all([
      api.get<{ users: DiscoveryUser[] }>("/api/v1/discovery"),
      api.get<{ matches: MatchItem[] }>("/api/v1/matches"),
    ]);

    if (!usersResponse.ok) {
      return { ok: false as const, error: usersResponse.error.message };
    }
    if (!matchesResponse.ok) {
      return { ok: false as const, error: matchesResponse.error.message };
    }

    return {
      ok: true as const,
      users: usersResponse.data.users,
      matches: matchesResponse.data.matches,
    };
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    const result = await fetchData();
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    setUsers(result.users);
    setMatches(result.matches);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    const initialLoad = async () => {
      const result = await fetchData();
      if (!active) {
        return;
      }
      if (!result.ok) {
        setError(result.error);
        setLoading(false);
        return;
      }
      setUsers(result.users);
      setMatches(result.matches);
      setLoading(false);
    };
    void initialLoad();
    return () => {
      active = false;
    };
  }, []);

  const handleLike = async (targetUserId: string) => {
    setInfo(null);
    const response = await api.post<{ matched: boolean; matchId: string | null }>(
      `/api/v1/likes/${targetUserId}`,
    );
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    if (response.data.matched) {
      setInfo("マッチが成立しました。メッセージを開始できます。");
    } else {
      setInfo("いいねを送信しました。");
    }
    await loadData();
  };

  const handleReportSubmit = async (payload: { category: string; detail: string }) => {
    if (!selectedOrFirstUser) {
      return;
    }
    const response = await api.post("/api/v1/reports", {
      targetUserId: selectedOrFirstUser.id,
      category: payload.category,
      detail: payload.detail.length > 0 ? payload.detail : "不適切な行為の可能性があります。",
    });
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    setInfo("通報を受け付けました。");
  };

  const handleBlockConfirm = async () => {
    if (!selectedOrFirstUser) {
      return;
    }
    const response = await api.post(`/api/v1/blocks/${selectedOrFirstUser.id}`);
    if (!response.ok) {
      setError(response.error.message);
      return;
    }
    setInfo("ユーザーをブロックしました。");
    await loadData();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-white pb-20">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <header className="mb-6 rounded-2xl border border-primary-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h1 className="font-display text-2xl font-bold text-gray-800">Discovery</h1>
              <p className="mt-1 text-sm text-gray-600">
                同意設定と境界条件に基づいて、相性の良いユーザーを表示しています。
              </p>
            </div>
            <Button variant="secondary" onClick={() => void loadData()} disabled={loading}>
              <i className="ri-refresh-line mr-1" />
              更新
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full bg-primary-100 px-3 py-1 text-primary-700">年齢範囲</span>
            <span className="rounded-full bg-warm-100 px-3 py-1 text-amber-700">地域</span>
            <span className="rounded-full bg-accent-lavender/30 px-3 py-1 text-purple-700">
              同意一致率
            </span>
          </div>
        </header>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-4 rounded-lg border border-teal-200 bg-teal-50 p-3 text-sm text-teal-700">
            {info}
          </div>
        )}

        <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">現在のマッチ</h2>
            <span className="text-xs text-gray-500">{matches.length} 件</span>
          </div>
          {matches.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">まだマッチはありません。</p>
          ) : (
            <div className="mt-3 flex flex-wrap gap-2">
              {matches.map((match) => (
                <span
                  key={match.id}
                  className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 text-xs text-primary-700"
                >
                  {match.peerNickname} ({match.score}%)
                </span>
              ))}
            </div>
          )}
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {loading && (
            <Card className="md:col-span-2 xl:col-span-3">
              <p className="text-sm text-gray-600">候補を読み込み中です...</p>
            </Card>
          )}

          {!loading && users.length === 0 && (
            <Card className="md:col-span-2 xl:col-span-3">
              <h3 className="font-semibold text-gray-900">候補が見つかりません</h3>
              <p className="mt-2 text-sm text-gray-600">
                同意設定や境界条件を変更すると、候補が表示される場合があります。
              </p>
            </Card>
          )}

          {!loading &&
            users.map((user) => (
              <Card key={user.id} className="rounded-2xl" padding="lg">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user.nickname}</h3>
                    <p className="text-sm text-gray-500">
                      {user.age}歳 / {user.region}
                    </p>
                  </div>
                  <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                    KYC: {user.kycStatus}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-700">{user.bio}</p>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  <Button size="sm" onClick={() => void handleLike(user.id)}>
                    いいね
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsReportOpen(true);
                    }}
                  >
                    通報
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => {
                      setSelectedUser(user);
                      setIsBlockOpen(true);
                    }}
                  >
                    ブロック
                  </Button>
                </div>
              </Card>
            ))}
        </section>
      </div>

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        onSubmit={handleReportSubmit}
        targetUserName={selectedOrFirstUser?.nickname}
      />
      <BlockModal
        isOpen={isBlockOpen}
        onClose={() => setIsBlockOpen(false)}
        onConfirm={handleBlockConfirm}
        targetUserName={selectedOrFirstUser?.nickname}
      />

      {selectedOrFirstUser && (
        <SafetyBar
          onReport={() => {
            setIsReportOpen(true);
          }}
          onBlock={() => {
            setIsBlockOpen(true);
          }}
        />
      )}
    </div>
  );
}
