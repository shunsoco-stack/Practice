import Link from "next/link";

export default function PrivacyV1Page() {
  return (
    <div className="min-h-screen py-10">
      <main className="container space-y-4">
        <h1 className="text-2xl font-bold">Privacy Policy v1.0.0</h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          MVP placeholder. Replace with legal reviewed policy and retention schedule.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Collect only minimum data required for safe matching.</li>
          <li>Use role-based access and encrypted storage in production.</li>
          <li>Provide account deletion and data access request channels.</li>
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
