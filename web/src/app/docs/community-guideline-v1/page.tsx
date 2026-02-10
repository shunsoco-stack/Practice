import Link from "next/link";

export default function CommunityGuidelineV1Page() {
  return (
    <div className="min-h-screen py-10">
      <main className="container space-y-4">
        <h1 className="text-2xl font-bold">Community Guideline v1.0.0</h1>
        <p className="text-sm text-slate-700 dark:text-slate-300">
          MVP placeholder. Replace with moderation-approved guideline before launch.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          <li>Respect explicit boundaries and consent settings.</li>
          <li>Do not request personal identity details or external coercive contact.</li>
          <li>Use report and block when behavior feels unsafe.</li>
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
