import Link from "next/link";

const layers = [
  {
    title: "Presentation",
    body: "Next.js App Router pages + API Playground for browser-only operation.",
  },
  {
    title: "Application API",
    body: "Route handlers under /api/v1 with zod validation and unified error mapping.",
  },
  {
    title: "Domain",
    body: "In-memory store for MVP behavior and later replacement with Supabase tables.",
  },
  {
    title: "Data",
    body: "Production-oriented schema in infra/supabase/schema.sql with RLS defaults.",
  },
];

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen py-10">
      <main className="container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Architecture</h1>
          <Link
            href="/"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            Back to home
          </Link>
        </div>

        <section className="card p-5">
          <p className="text-sm text-slate-700 dark:text-slate-300">
            このMVPは「安全要件を先に固める」方針で設計しています。まずAPI契約と
            DBスキーマを固定し、UIは検証しやすいPlayground中心にしています。
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {layers.map((layer) => (
              <article
                key={layer.title}
                className="rounded-md border border-slate-300 p-4 dark:border-slate-700"
              >
                <h2 className="font-semibold">{layer.title}</h2>
                <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">
                  {layer.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">重要ファイル</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
            <li>
              <code>infra/supabase/schema.sql</code>
            </li>
            <li>
              <code>openapi/openapi.yaml</code>
            </li>
            <li>
              <code>src/lib/domain/store.ts</code>
            </li>
            <li>
              <code>src/app/api/v1/**/route.ts</code>
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}
