import Link from "next/link";
import { toUserProfileDto } from "@/lib/domain/serializers";
import { store } from "@/lib/domain/store";

export default function Home() {
  const status = store.getOnboardingStatus("u1");
  const discovery = store.discovery("u1").map(toUserProfileDto);
  const matches = store.getMatches("u1");

  return (
    <div className="min-h-screen py-10">
      <main className="container space-y-8">
        <header className="space-y-3">
          <p className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold uppercase tracking-wider dark:border-slate-700">
            Browser MVP
          </p>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Consent-First Matching MVP
          </h1>
          <p className="max-w-3xl text-sm text-slate-700 dark:text-slate-300">
            安全設計を優先したWeb向けのプロトタイプです。年齢チェック、規約同意、
            同意・境界条件、マッチング、通報APIを実装済みです。
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="card p-4">
            <h2 className="text-sm font-semibold">Onboarding (u1)</h2>
            <p className="mt-2 text-sm">
              成人判定: <b>{status.isAdult ? "OK" : "NG"}</b>
            </p>
            <p className="text-sm">
              KYC: <b>{status.kycStatus}</b>
            </p>
            <p className="text-sm">
              規約同意: <b>{status.hasAcceptedTerms ? "完了" : "未完了"}</b>
            </p>
          </article>
          <article className="card p-4">
            <h2 className="text-sm font-semibold">Discovery candidates</h2>
            <p className="mt-2 text-2xl font-bold">{discovery.length}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              verified + visible + not blocked users
            </p>
          </article>
          <article className="card p-4">
            <h2 className="text-sm font-semibold">Active matches</h2>
            <p className="mt-2 text-2xl font-bold">{matches.length}</p>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              mutual likes create a match automatically
            </p>
          </article>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">実装済みメニュー</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link className="rounded-md border border-slate-300 p-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900" href="/playground">
              API Playground
            </Link>
            <Link className="rounded-md border border-slate-300 p-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900" href="/docs/architecture">
              Architecture
            </Link>
            <Link className="rounded-md border border-slate-300 p-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900" href="/docs/runbook">
              Safety runbook
            </Link>
            <Link className="rounded-md border border-slate-300 p-3 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900" href="/docs/api">
              API index
            </Link>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">Quick start</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>
              <code>cd web && npm install && npm run dev</code>
            </li>
            <li>
              <code>GET /api/v1/onboarding/status</code> で初期状態を確認
            </li>
            <li>
              <code>POST /api/v1/likes/u2</code> を実行すると、seedデータとの相互いいねでマッチ生成
            </li>
            <li>
              <code>POST /api/v1/reports</code> で通報フローを検証
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
