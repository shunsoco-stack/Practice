import Link from "next/link";

const endpoints = [
  ["POST", "/api/v1/onboarding/age-gate"],
  ["GET", "/api/v1/onboarding/status"],
  ["GET", "/api/v1/terms/active"],
  ["POST", "/api/v1/terms/consent"],
  ["GET/PATCH", "/api/v1/me/profile"],
  ["GET/PUT", "/api/v1/me/consents"],
  ["GET/PUT", "/api/v1/me/boundaries"],
  ["GET", "/api/v1/discovery"],
  ["POST/DELETE", "/api/v1/likes/{targetUserId}"],
  ["GET", "/api/v1/matches"],
  ["GET", "/api/v1/conversations"],
  ["GET/POST", "/api/v1/conversations/{conversationId}/messages"],
  ["POST/DELETE", "/api/v1/blocks/{targetUserId}"],
  ["POST", "/api/v1/reports"],
  ["GET", "/api/v1/admin/reports"],
];

export default function ApiDocPage() {
  return (
    <div className="min-h-screen py-10">
      <main className="container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">API Index</h1>
          <Link
            href="/"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            Back to home
          </Link>
        </div>

        <section className="card p-5">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            全体仕様は <code>/openapi/openapi.yaml</code> にあります。ここでは実装済み
            エンドポイントを一覧で確認できます。
          </p>
          <div className="mt-4 overflow-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-left dark:border-slate-700">
                  <th className="py-2 pr-4 font-semibold">Method</th>
                  <th className="py-2 font-semibold">Path</th>
                </tr>
              </thead>
              <tbody>
                {endpoints.map(([method, path]) => (
                  <tr
                    key={`${method}-${path}`}
                    className="border-b border-slate-200 align-top dark:border-slate-800"
                  >
                    <td className="py-2 pr-4 font-mono text-xs">{method}</td>
                    <td className="py-2 font-mono text-xs">{path}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">テスト用ヘッダー</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>
              <code>x-user-id: u1</code> (通常ユーザー)
            </li>
            <li>
              <code>x-user-id: u_admin</code> (管理者ユーザー)
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
