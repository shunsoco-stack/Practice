import Link from "next/link";

const incidents = [
  {
    trigger: "未成年疑いの通報",
    action:
      "対象アカウントを即時凍結。本人確認結果とログを照合し、再審査まで接触機能を停止。",
  },
  {
    trigger: "同意違反・ハラスメント通報",
    action:
      "通報対象ユーザーのメッセージ送信を一時停止。証跡を保存し、重大度に応じて凍結またはBAN。",
  },
  {
    trigger: "漏えい/不正アクセス疑い",
    action:
      "インシデント手順を起動。影響範囲調査、トークン無効化、監査ログ保全、法務連携を実施。",
  },
];

export default function RunbookPage() {
  return (
    <div className="min-h-screen py-10">
      <main className="container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Safety Runbook</h1>
          <Link
            href="/"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            Back to home
          </Link>
        </div>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">運用原則</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>安全性に関わる判断はユーザー体験より優先する。</li>
            <li>重大通報は5分以内に一次対応（凍結可否判断）する。</li>
            <li>監査ログは追記専用で保全し、改ざんを禁止する。</li>
          </ul>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">インシデント別手順</h2>
          <div className="mt-4 space-y-3">
            {incidents.map((item) => (
              <article
                key={item.trigger}
                className="rounded-md border border-slate-300 p-4 dark:border-slate-700"
              >
                <h3 className="font-semibold">{item.trigger}</h3>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {item.action}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            実運用では、法務・CS・開発が共同でSLAと連絡網を定義し、四半期ごとに
            訓練（机上演習）を実施してください。
          </p>
        </section>
      </main>
    </div>
  );
}
