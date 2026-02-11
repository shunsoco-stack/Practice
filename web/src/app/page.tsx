"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-white">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-primary-100/50 bg-white/80 transition-all duration-300 backdrop-blur-md">
        <div className="flex w-full items-center justify-between px-4 py-4 md:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-coral shadow-lg shadow-primary-200">
              <i className="ri-heart-pulse-line text-xl text-white" />
            </div>
            <h1 className="font-display bg-gradient-to-r from-primary-600 to-accent-coral bg-clip-text text-xl font-bold text-transparent">
              Consent Match
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-primary-50 md:hidden"
          >
            <i className={`ri-${isMenuOpen ? "close" : "menu"}-line text-xl`} />
          </button>

          <nav className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="cursor-pointer text-sm text-gray-600 transition-colors hover:text-primary-600"
            >
              特徴
            </a>
            <a
              href="#safety"
              className="cursor-pointer text-sm text-gray-600 transition-colors hover:text-primary-600"
            >
              安心・安全
            </a>
            <a
              href="#how-it-works"
              className="cursor-pointer text-sm text-gray-600 transition-colors hover:text-primary-600"
            >
              使い方
            </a>
            <button
              type="button"
              onClick={() => router.push("/age-gate")}
              className="whitespace-nowrap rounded-full bg-gradient-to-r from-primary-500 to-accent-coral px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-primary-200 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary-300"
            >
              はじめる
            </button>
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="whitespace-nowrap rounded-full border border-primary-200 bg-white px-6 py-2.5 text-sm font-medium text-primary-700 transition-colors hover:bg-primary-50"
            >
              ログイン
            </button>
          </nav>
        </div>

        {isMenuOpen && (
          <div className="border-t border-primary-100 bg-white/95 backdrop-blur-md md:hidden">
            <nav className="space-y-3 px-4 py-4">
              <a href="#features" className="block py-2 text-sm text-gray-600">
                特徴
              </a>
              <a href="#safety" className="block py-2 text-sm text-gray-600">
                安心・安全
              </a>
              <a href="#how-it-works" className="block py-2 text-sm text-gray-600">
                使い方
              </a>
              <button
                type="button"
                onClick={() => router.push("/age-gate")}
                className="w-full whitespace-nowrap rounded-full bg-gradient-to-r from-primary-500 to-accent-coral px-6 py-3 text-sm font-medium text-white shadow-lg"
              >
                はじめる
              </button>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full whitespace-nowrap rounded-full border border-primary-200 bg-white px-6 py-3 text-sm font-medium text-primary-700"
              >
                ログイン
              </button>
            </nav>
          </div>
        )}
      </header>

      <section className="relative overflow-hidden px-4 pb-20 pt-32 md:pb-32 md:pt-40">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-10 top-20 h-72 w-72 rounded-full bg-primary-200/30 blur-3xl" />
          <div className="absolute right-10 top-40 h-96 w-96 rounded-full bg-accent-peach/20 blur-3xl" />
          <div className="absolute bottom-20 left-1/3 h-64 w-64 rounded-full bg-accent-lavender/20 blur-3xl" />
        </div>

        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-[15%] top-32 animate-bounce text-2xl text-primary-300"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          >
            💗
          </div>
          <div
            className="absolute right-[20%] top-48 animate-bounce text-xl text-accent-peach"
            style={{ animationDelay: "0.5s", animationDuration: "2.5s" }}
          >
            ✨
          </div>
          <div
            className="absolute left-[25%] top-64 animate-bounce text-lg text-accent-rose"
            style={{ animationDelay: "1s", animationDuration: "3.5s" }}
          >
            💕
          </div>
          <div
            className="absolute bottom-40 right-[15%] animate-bounce text-2xl text-primary-400"
            style={{ animationDelay: "1.5s", animationDuration: "2.8s" }}
          >
            💖
          </div>
          <div
            className="absolute bottom-60 left-[10%] animate-bounce text-xl text-accent-lavender"
            style={{ animationDelay: "2s", animationDuration: "3.2s" }}
          >
            🌸
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div className="text-center md:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-200 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
                <span className="text-lg">🔞</span>
                <span className="text-sm font-medium text-primary-700">
                  18歳以上限定・同意重視マッチング
                </span>
              </div>

              <h2 className="font-display mb-6 text-4xl font-bold leading-tight text-gray-800 md:text-5xl lg:text-6xl">
                <span className="bg-gradient-to-r from-primary-600 via-accent-coral to-primary-500 bg-clip-text text-transparent">
                  自分らしさを
                </span>
                <br />
                大切にできる出会い
              </h2>

              <p className="mb-8 text-base leading-relaxed text-gray-600 md:text-lg">
                隠さなくていい、無理しなくていい。
                <br />
                <span className="font-medium text-primary-600">同意と境界線の一致</span>
                から始まる、安心できるマッチング体験。
              </p>

              <div className="flex flex-col justify-center gap-4 sm:flex-row md:justify-start">
                <button
                  type="button"
                  onClick={() => router.push("/age-gate")}
                  className="whitespace-nowrap rounded-full bg-gradient-to-r from-primary-500 to-accent-coral px-8 py-4 text-base font-semibold text-white shadow-xl shadow-primary-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-300/50"
                >
                  はじめる
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="whitespace-nowrap rounded-full border-2 border-primary-200 bg-white px-8 py-4 text-base font-medium text-primary-700 transition-all duration-300 hover:border-primary-300 hover:bg-primary-50"
                >
                  会員ログイン
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500 md:justify-start">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>匿名OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>本人確認必須</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>完全同意制</span>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <div className="absolute inset-4 overflow-hidden rounded-3xl bg-gradient-to-br from-primary-100 to-accent-peach/30 shadow-2xl shadow-primary-200/30">
                  <Image
                    src="https://readdy.ai/api/search-image?query=A%20warm%20and%20romantic%20illustration%20of%20two%20people%20having%20a%20pleasant%20conversation%20at%20a%20cozy%20cafe%2C%20soft%20pastel%20colors%2C%20pink%20and%20peach%20tones%2C%20gentle%20lighting%2C%20modern%20minimalist%20style%2C%20happy%20atmosphere%2C%20clean%20background%20with%20subtle%20heart%20shapes%2C%20illustration%20art%20style&width=600&height=600&seq=hero1&orientation=squarish"
                    alt="安心して会話できる出会いのイメージ"
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 100vw"
                    className="h-full w-full object-cover object-top"
                  />
                </div>

                <div
                  className="absolute -right-2 -top-2 rounded-2xl bg-white p-4 shadow-xl shadow-primary-100/50 animate-pulse"
                  style={{ animationDuration: "3s" }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💕</span>
                    <span className="text-sm font-medium text-gray-700">相性の高い候補を表示</span>
                  </div>
                </div>

                <div className="absolute -bottom-2 -left-2 rounded-2xl bg-white p-4 shadow-xl shadow-primary-100/50">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-coral">
                      <i className="ri-shield-check-line text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">完全匿名</p>
                      <p className="text-sm font-semibold text-primary-600">プライバシー保護</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-r from-primary-50 to-warm-100 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary-600 md:text-4xl">10万+</p>
              <p className="mt-1 text-sm text-gray-600">登録ユーザー</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-accent-coral md:text-4xl">5,000+</p>
              <p className="mt-1 text-sm text-gray-600">マッチング成立</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl font-bold text-primary-600 md:text-4xl">98%</p>
              <p className="mt-1 text-sm text-gray-600">満足度</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-600">
              Features
            </span>
            <h3 className="font-display mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              同意ファーストで<span className="text-primary-500">本当の相性</span>を見つける
            </h3>
            <p className="text-gray-600">隠さず、無理せず、安心してつながれる</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="group rounded-3xl border border-primary-100 bg-gradient-to-br from-primary-50 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-100/50">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-accent-coral shadow-lg shadow-primary-200/50 transition-transform group-hover:scale-110">
                <i className="ri-heart-add-line text-2xl text-white" />
              </div>
              <h4 className="font-display mb-3 text-xl font-bold text-gray-800">
                詳細な同意設定
              </h4>
              <p className="text-sm leading-relaxed text-gray-600">
                複数項目でOK/NG/要相談を設定。
                <span className="font-medium text-primary-600">価値観が合う相手</span>
                と出会いやすくなります。
              </p>
            </div>

            <div className="group rounded-3xl border border-warm-200 bg-gradient-to-br from-warm-100 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-warm-200/50">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-peach to-accent-coral shadow-lg shadow-warm-200/50 transition-transform group-hover:scale-110">
                <i className="ri-user-heart-line text-2xl text-white" />
              </div>
              <h4 className="font-display mb-3 text-xl font-bold text-gray-800">完全匿名で安心</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                本名不要。公開/非公開項目を分離して、
                <span className="font-medium text-accent-coral">安心できる関係</span>
                から始められます。
              </p>
            </div>

            <div className="group rounded-3xl border border-accent-lavender/30 bg-gradient-to-br from-accent-lavender/20 to-white p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-lavender/30">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-rose to-accent-lavender shadow-lg shadow-accent-lavender/30 transition-transform group-hover:scale-110">
                <i className="ri-shield-star-line text-2xl text-white" />
              </div>
              <h4 className="font-display mb-3 text-xl font-bold text-gray-800">境界線を明確に</h4>
              <p className="text-sm leading-relaxed text-gray-600">
                絶対NGを事前に共有。
                <span className="font-medium text-accent-rose">同意のない行為を防ぐ</span>
                安全設計です。
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="safety" className="bg-gradient-to-b from-warm-50 to-white px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-600">
                Safety First
              </span>
              <h3 className="font-display mb-6 text-3xl font-bold text-gray-800 md:text-4xl">
                あなたの<span className="text-primary-500">安全</span>を
                <br />
                いちばん大切に
              </h3>
              <p className="mb-8 leading-relaxed text-gray-600">
                安心して出会いを楽しめるよう、
                <br />
                多層的な安全対策を整えています。
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-primary-100 bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-primary-100">
                    <i className="ri-lock-heart-line text-xl text-primary-600" />
                  </div>
                  <div>
                    <h5 className="mb-1 font-semibold text-gray-800">プライバシー保護</h5>
                    <p className="text-sm text-gray-600">
                      公開・非公開情報を明確に分離し、同意なしで個人情報を共有しません。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-warm-200 bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-warm-100">
                    <i className="ri-user-unfollow-line text-xl text-accent-coral" />
                  </div>
                  <div>
                    <h5 className="mb-1 font-semibold text-gray-800">ブロック機能</h5>
                    <p className="text-sm text-gray-600">
                      不快なユーザーを即座にブロック。相互に表示されなくなります。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-2xl border border-accent-lavender/30 bg-white p-4 shadow-sm">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-accent-lavender/20">
                    <i className="ri-customer-service-2-line text-xl text-accent-lavender" />
                  </div>
                  <div>
                    <h5 className="mb-1 font-semibold text-gray-800">通報対応フロー</h5>
                    <p className="text-sm text-gray-600">
                      通報内容を管理画面で追跡し、重大度に応じて迅速対応します。
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative mx-auto aspect-square w-full max-w-md">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary-200/50 to-accent-peach/30" />
                <Image
                  src="https://readdy.ai/api/search-image?query=A%20warm%20and%20friendly%20illustration%20showing%20safety%20and%20protection%20concept%2C%20a%20shield%20with%20heart%20symbol%2C%20soft%20pastel%20pink%20and%20peach%20colors%2C%20gentle%20and%20reassuring%20atmosphere%2C%20modern%20flat%20illustration%20style%2C%20clean%20minimal%20background%2C%20trust%20and%20security%20theme&width=500&height=500&seq=safety1&orientation=squarish"
                  alt="安全・安心のイメージ"
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 420px, (min-width: 768px) 360px, 100vw"
                  className="relative h-full w-full rounded-3xl object-cover object-top"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="bg-white px-4 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-600">
              How it works
            </span>
            <h3 className="font-display mb-4 text-3xl font-bold text-gray-800 md:text-4xl">
              かんたん<span className="text-primary-500">5ステップ</span>
            </h3>
            <p className="text-gray-600">すぐに始められます</p>
          </div>

          <div className="space-y-6">
            {[
              {
                icon: "ri-user-smile-line",
                title: "アカウント登録",
                desc: "年齢確認と利用規約に同意するだけ",
                color: "from-primary-400 to-primary-500",
                bg: "bg-primary-50",
              },
              {
                icon: "ri-shield-check-line",
                title: "本人確認",
                desc: "eKYCで安全に本人確認を完了",
                color: "from-accent-peach to-accent-coral",
                bg: "bg-warm-50",
              },
              {
                icon: "ri-settings-4-line",
                title: "同意設定",
                desc: "あなたの境界線を設定",
                color: "from-accent-rose to-primary-400",
                bg: "bg-primary-50",
              },
              {
                icon: "ri-search-heart-line",
                title: "マッチング",
                desc: "同意が一致する相手を探す",
                color: "from-primary-500 to-accent-coral",
                bg: "bg-warm-50",
              },
              {
                icon: "ri-chat-heart-line",
                title: "会話スタート",
                desc: "安心してコミュニケーションを始める",
                color: "from-accent-coral to-accent-rose",
                bg: "bg-primary-50",
              },
            ].map((step, index) => (
              <div
                key={step.title}
                className={`flex items-center gap-6 rounded-2xl border border-primary-100/50 p-6 ${step.bg}`}
              >
                <div className="relative">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${step.color} text-white shadow-lg`}
                  >
                    <i className={`${step.icon} text-2xl`} />
                  </div>
                  <span className="absolute -left-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary-200 bg-white text-xs font-bold text-primary-600">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="font-display mb-1 font-bold text-gray-800">{step.title}</h5>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden text-primary-300 md:block">
                    <i className="ri-arrow-right-line text-xl" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              onClick={() => router.push("/age-gate")}
              className="whitespace-nowrap rounded-full bg-gradient-to-r from-primary-500 to-accent-coral px-10 py-4 text-base font-semibold text-white shadow-xl shadow-primary-200/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-primary-300/50"
            >
              今すぐはじめる
            </button>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-primary-400 via-accent-coral to-primary-500 px-4 py-20">
        <div className="mx-auto max-w-4xl text-center text-white">
          <h3 className="font-display mb-4 text-3xl font-bold md:text-4xl">
            素敵な出会いを、今すぐ
          </h3>
          <p className="mb-8 text-lg text-white/90">
            同意を大切にする、新しいマッチングを体験しよう
          </p>
          <button
            type="button"
            onClick={() => router.push("/age-gate")}
            className="rounded-full bg-white px-10 py-4 text-base font-semibold text-primary-600 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
          >
            無料ではじめる →
          </button>
          <p className="mt-6 text-sm text-white/70">※18歳以上の方のみご利用いただけます</p>
        </div>
      </section>

      <footer className="bg-gradient-to-b from-gray-50 to-warm-50 px-4 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary-400 to-accent-coral">
                  <i className="ri-heart-pulse-line text-white" />
                </div>
                <span className="font-display font-bold text-gray-800">Consent Match</span>
              </div>
              <p className="text-sm text-gray-600">
                同意を大切にする
                <br />
                マッチングサービス
              </p>
            </div>

            <div>
              <h6 className="mb-3 text-sm font-semibold text-gray-800">サービス</h6>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="#features"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    特徴
                  </a>
                </li>
                <li>
                  <a
                    href="#safety"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    安心・安全
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    使い方
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="mb-3 text-sm font-semibold text-gray-800">サポート</h6>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/docs/runbook"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    安全運用ガイド
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/api"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    API情報
                  </Link>
                </li>
                <li>
                  <Link
                    href="/playground"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    Playground
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h6 className="mb-3 text-sm font-semibold text-gray-800">法的情報</h6>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/docs/tos-v1"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    利用規約
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/privacy-v1"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    プライバシーポリシー
                  </Link>
                </li>
                <li>
                  <Link
                    href="/docs/community-guideline-v1"
                    className="cursor-pointer text-gray-600 transition-colors hover:text-primary-600"
                  >
                    コミュニティガイドライン
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-4 border-t border-primary-100 pt-8 text-sm md:flex-row">
            <p className="text-gray-500">© 2026 Consent Match. All rights reserved.</p>
            <a
              href="https://readdy.ai/?ref=logo"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer text-gray-500 transition-colors hover:text-primary-600"
            >
              Powered by Readdy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
