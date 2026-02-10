"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type HttpMethod = "GET" | "POST" | "PATCH" | "PUT" | "DELETE";

async function requestApi(
  method: HttpMethod,
  path: string,
  userId: string,
  body?: unknown,
) {
  const response = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      "x-user-id": userId,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  let parsed: unknown = text;
  try {
    parsed = JSON.parse(text);
  } catch {
    // noop
  }
  return {
    status: response.status,
    body: parsed,
  };
}

const pretty = (value: unknown) => JSON.stringify(value, null, 2);

export default function PlaygroundPage() {
  const [userId, setUserId] = useState("u1");
  const [targetId, setTargetId] = useState("u2");
  const [message, setMessage] = useState("はじめまして。よろしくお願いします。");
  const [detail, setDetail] = useState("不適切な表現がありました。");
  const [result, setResult] = useState<string>("{}");
  const [loading, setLoading] = useState(false);

  const actions = useMemo(
    () => [
      {
        label: "Onboarding status",
        run: () => requestApi("GET", "/api/v1/onboarding/status", userId),
      },
      {
        label: "Discovery",
        run: () => requestApi("GET", "/api/v1/discovery", userId),
      },
      {
        label: "Like target user",
        run: () => requestApi("POST", `/api/v1/likes/${targetId}`, userId),
      },
      {
        label: "Get matches",
        run: () => requestApi("GET", "/api/v1/matches", userId),
      },
      {
        label: "Get conversations",
        run: () => requestApi("GET", "/api/v1/conversations", userId),
      },
      {
        label: "Report target user",
        run: () =>
          requestApi("POST", "/api/v1/reports", userId, {
            targetUserId: targetId,
            category: "harassment",
            detail,
          }),
      },
      {
        label: "Create terms consent (tos)",
        run: () =>
          requestApi("POST", "/api/v1/terms/consent", userId, {
            termsVersionId: "terms-tos-v1",
          }),
      },
      {
        label: "Update profile visibility hidden",
        run: () =>
          requestApi("PATCH", "/api/v1/me/profile", userId, {
            visibility: "hidden",
          }),
      },
    ],
    [detail, targetId, userId],
  );

  const run = async (index: number) => {
    setLoading(true);
    try {
      const response = await actions[index].run();
      setResult(pretty(response));
    } catch (error) {
      setResult(pretty({ error: String(error) }));
    } finally {
      setLoading(false);
    }
  };

  const sendMessageDemo = async () => {
    setLoading(true);
    try {
      const convRes = await requestApi("GET", "/api/v1/conversations", userId);
      const convId = (convRes.body as { data?: { conversations?: Array<{ id: string }> } })
        ?.data?.conversations?.[0]?.id;
      if (!convId) {
        setResult(pretty({ error: "conversation_not_found_for_user" }));
        return;
      }
      const response = await requestApi(
        "POST",
        `/api/v1/conversations/${convId}/messages`,
        userId,
        { body: message },
      );
      setResult(pretty(response));
    } catch (error) {
      setResult(pretty({ error: String(error) }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10">
      <main className="container space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">API Playground</h1>
          <Link
            href="/"
            className="rounded-md border border-slate-300 px-3 py-2 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-900"
          >
            Back to home
          </Link>
        </div>

        <section className="card grid gap-4 p-5 md:grid-cols-2">
          <label className="text-sm">
            User ID
            <input
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={userId}
              onChange={(event) => setUserId(event.target.value)}
            />
          </label>
          <label className="text-sm">
            Target User ID
            <input
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={targetId}
              onChange={(event) => setTargetId(event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Message body (send message demo)
            <input
              className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
          <label className="text-sm md:col-span-2">
            Report detail
            <textarea
              className="mt-1 h-24 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              value={detail}
              onChange={(event) => setDetail(event.target.value)}
            />
          </label>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">Actions</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {actions.map((action, index) => (
              <button
                key={action.label}
                type="button"
                onClick={() => void run(index)}
                disabled={loading}
                className="rounded-md border border-slate-300 px-3 py-2 text-left text-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-900"
              >
                {action.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => void sendMessageDemo()}
              disabled={loading}
              className="rounded-md border border-indigo-300 bg-indigo-50 px-3 py-2 text-left text-sm hover:bg-indigo-100 disabled:opacity-50 dark:border-indigo-700 dark:bg-indigo-950 dark:hover:bg-indigo-900"
            >
              Send message to first conversation
            </button>
          </div>
        </section>

        <section className="card p-5">
          <h2 className="text-lg font-semibold">Result</h2>
          <pre className="mt-3 overflow-auto rounded bg-slate-900 p-3 text-xs text-slate-100">
            {result}
          </pre>
        </section>
      </main>
    </div>
  );
}
