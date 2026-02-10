import Link from "next/link";

export default function TosV1Page() {
  return (
    <div className="min-h-screen py-10">
      <main className="container space-y-4">
        <h1 className="text-2xl font-bold">Terms of Service v1.0.0</h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          MVP placeholder. Replace with legal reviewed terms before public release.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Only users aged 18+ can use the service.</li>
          <li>Harassment, coercion, and illegal activity are prohibited.</li>
          <li>Violation may result in suspension or permanent ban.</li>
        </ul>
        <Link
          href="/"
          className="inline-block rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
        >
          Back
        </Link>
      </main>
    </div>
  );
}
