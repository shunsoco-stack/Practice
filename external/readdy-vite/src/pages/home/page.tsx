import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/base/Button';

export default function Home() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-warm-50 to-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-primary-100/50">
        <div className="w-full px-4 md:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary-400 to-accent-coral rounded-full shadow-lg shadow-primary-200">
              <i className="ri-heart-pulse-line text-white text-xl"></i>
            </div>
            <h1 className="font-display text-xl font-bold bg-gradient-to-r from-primary-600 to-accent-coral bg-clip-text text-transparent">
              Consent Match
            </h1>
          </div>
          
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-primary-50 rounded-full cursor-pointer transition-colors"
          >
            <i className={`ri-${isMenuOpen ? 'close' : 'menu'}-line text-xl`}></i>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">特徴</a>
            <a href="#safety" className="text-sm text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">安心・安全</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">使い方</a>
            <button 
              onClick={() => navigate('/age-gate')}
              className="px-6 py-2.5 bg-gradient-to-r from-primary-500 to-accent-coral text-white text-sm font-medium rounded-full shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-300 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
            >
              無料ではじめる 💕
            </button>
          </nav>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-primary-100 bg-white/95 backdrop-blur-md">
            <nav className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-sm text-gray-600 cursor-pointer">特徴</a>
              <a href="#safety" className="block py-2 text-sm text-gray-600 cursor-pointer">安心・安全</a>
              <a href="#how-it-works" className="block py-2 text-sm text-gray-600 cursor-pointer">使い方</a>
              <button 
                onClick={() => navigate('/age-gate')}
                className="w-full px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-coral text-white text-sm font-medium rounded-full shadow-lg cursor-pointer whitespace-nowrap"
              >
                無料ではじめる 💕
              </button>
            </nav>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 px-4 overflow-hidden">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-accent-peach/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-accent-lavender/20 rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating hearts */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-32 left-[15%] text-primary-300 text-2xl animate-bounce" style={{ animationDelay: '0s', animationDuration: '3s' }}>💗</div>
          <div className="absolute top-48 right-[20%] text-accent-peach text-xl animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '2.5s' }}>✨</div>
          <div className="absolute top-64 left-[25%] text-accent-rose text-lg animate-bounce" style={{ animationDelay: '1s', animationDuration: '3.5s' }}>💕</div>
          <div className="absolute bottom-40 right-[15%] text-primary-400 text-2xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '2.8s' }}>💖</div>
          <div className="absolute bottom-60 left-[10%] text-accent-lavender text-xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '3.2s' }}>🌸</div>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-primary-200 mb-6 shadow-sm">
                <span className="text-lg">🔞</span>
                <span className="text-sm font-medium text-primary-700">18歳以上限定・性癖マッチング</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-6 leading-tight">
                <span className="bg-gradient-to-r from-primary-600 via-accent-coral to-primary-500 bg-clip-text text-transparent">
                  あなたの性癖に
                </span>
                <br />
                正直になれる場所
              </h2>
              
              <p className="text-base md:text-lg text-gray-600 mb-8 leading-relaxed">
                隠さなくていい、恥ずかしくない。<br />
                <span className="text-primary-600 font-medium">性的嗜好の一致</span>から始まる、<br className="md:hidden" />
                本当に相性の良い相手との出会い 🔥
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <button 
                  onClick={() => navigate('/age-gate')}
                  className="px-8 py-4 bg-gradient-to-r from-primary-500 to-accent-coral text-white text-base font-semibold rounded-full shadow-xl shadow-primary-200/50 hover:shadow-2xl hover:shadow-primary-300/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer whitespace-nowrap"
                >
                  性癖診断を始める 🔥
                </button>
                <button 
                  onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                  className="px-8 py-4 bg-white text-gray-700 text-base font-medium rounded-full border-2 border-primary-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-300 cursor-pointer whitespace-nowrap"
                >
                  使い方を見る
                </button>
              </div>

              <div className="mt-10 flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>匿名OK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>本人確認済み</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">✓</span>
                  <span>完全同意制</span>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                {/* Main image container */}
                <div className="absolute inset-4 bg-gradient-to-br from-primary-100 to-accent-peach/30 rounded-3xl overflow-hidden shadow-2xl shadow-primary-200/30">
                  <img 
                    src="https://readdy.ai/api/search-image?query=A%20warm%20and%20romantic%20illustration%20of%20two%20people%20having%20a%20pleasant%20conversation%20at%20a%20cozy%20cafe%2C%20soft%20pastel%20colors%2C%20pink%20and%20peach%20tones%2C%20gentle%20lighting%2C%20modern%20minimalist%20style%2C%20happy%20atmosphere%2C%20clean%20background%20with%20subtle%20heart%20shapes%2C%20illustration%20art%20style&width=600&height=600&seq=hero1&orientation=squarish"
                    alt="素敵な出会いのイメージ"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                
                {/* Floating cards */}
                <div className="absolute -top-2 -right-2 bg-white rounded-2xl p-4 shadow-xl shadow-primary-100/50 animate-pulse" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">💕</span>
                    <span className="text-sm font-medium text-gray-700">性癖一致率98%!</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-2 -left-2 bg-white rounded-2xl p-4 shadow-xl shadow-primary-100/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-coral rounded-full flex items-center justify-center">
                      <i className="ri-shield-check-line text-white"></i>
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

      {/* Stats Section */}
      <section className="py-12 px-4 bg-gradient-to-r from-primary-50 to-warm-100">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary-600">10万+</p>
              <p className="text-sm text-gray-600 mt-1">登録ユーザー</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-accent-coral">5,000+</p>
              <p className="text-sm text-gray-600 mt-1">性癖マッチング成立</p>
            </div>
            <div className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary-600">98%</p>
              <p className="text-sm text-gray-600 mt-1">満足度</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-600 text-sm font-medium rounded-full mb-4">Features</span>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              性癖マッチングで<span className="text-primary-500">本当の相性</span>を見つける ✨
            </h3>
            <p className="text-gray-600">隠さず、恥ずかしくない、あなたらしく</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-gradient-to-br from-primary-50 to-white rounded-3xl p-8 border border-primary-100 hover:shadow-xl hover:shadow-primary-100/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-primary-400 to-accent-coral rounded-2xl mb-6 shadow-lg shadow-primary-200/50 group-hover:scale-110 transition-transform">
                <i className="ri-heart-add-line text-white text-2xl"></i>
              </div>
              <h4 className="font-display text-xl font-bold text-gray-800 mb-3">詳細な性癖診断</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                50項目以上の性的嗜好を細かく設定。<span className="text-primary-600 font-medium">お互いの性癖が一致</span>する相手だけとマッチングします 🔥
              </p>
            </div>

            <div className="group bg-gradient-to-br from-warm-100 to-white rounded-3xl p-8 border border-warm-200 hover:shadow-xl hover:shadow-warm-200/50 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-accent-peach to-accent-coral rounded-2xl mb-6 shadow-lg shadow-warm-200/50 group-hover:scale-110 transition-transform">
                <i className="ri-user-heart-line text-white text-2xl"></i>
              </div>
              <h4 className="font-display text-xl font-bold text-gray-800 mb-3">完全匿名で安心</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                本名不要、顎写真も任意。<span className="text-accent-coral font-medium">匿名のまま</span>性癖を共有し、信頼できる相手とだけ本人情報を交換 🛡️
              </p>
            </div>

            <div className="group bg-gradient-to-br from-accent-lavender/20 to-white rounded-3xl p-8 border border-accent-lavender/30 hover:shadow-xl hover:shadow-accent-lavender/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-16 h-16 flex items-center justify-center bg-gradient-to-br from-accent-rose to-accent-lavender rounded-2xl mb-6 shadow-lg shadow-accent-lavender/30 group-hover:scale-110 transition-transform">
                <i className="ri-shield-star-line text-white text-2xl"></i>
              </div>
              <h4 className="font-display text-xl font-bold text-gray-800 mb-3">境界線を明確に</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                OK/NG/要相談を事前に設定。<span className="text-accent-rose font-medium">同意のない行為は絶対NG</span>。安全に楽しめます 🌟
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Safety Section */}
      <section id="safety" className="py-20 px-4 bg-gradient-to-b from-warm-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-600 text-sm font-medium rounded-full mb-4">Safety First</span>
              <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                あなたの<span className="text-primary-500">安全</span>を<br />
                いちばん大切に 🛡️
              </h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                安心して出会いを楽しめるよう、<br />
                多層的な安全対策を整えています。
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-primary-100 shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary-100 rounded-xl flex-shrink-0">
                    <i className="ri-lock-heart-line text-primary-600 text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">プライバシー保護</h5>
                    <p className="text-sm text-gray-600">公開・非公開情報を明確に分離。同意なしに個人情報は共有されません</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-warm-200 shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center bg-warm-100 rounded-xl flex-shrink-0">
                    <i className="ri-user-unfollow-line text-accent-coral text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">ブロック機能</h5>
                    <p className="text-sm text-gray-600">不快なユーザーを即座にブロック。お互いに見えなくなります</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-accent-lavender/30 shadow-sm">
                  <div className="w-12 h-12 flex items-center justify-center bg-accent-lavender/20 rounded-xl flex-shrink-0">
                    <i className="ri-customer-service-2-line text-accent-lavender text-xl"></i>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-1">24時間サポート</h5>
                    <p className="text-sm text-gray-600">困ったときはいつでも相談OK。専門チームが対応します</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative hidden md:block">
              <div className="relative w-full aspect-square max-w-md mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary-200/50 to-accent-peach/30 rounded-3xl"></div>
                <img 
                  src="https://readdy.ai/api/search-image?query=A%20warm%20and%20friendly%20illustration%20showing%20safety%20and%20protection%20concept%2C%20a%20shield%20with%20heart%20symbol%2C%20soft%20pastel%20pink%20and%20peach%20colors%2C%20gentle%20and%20reassuring%20atmosphere%2C%20modern%20flat%20illustration%20style%2C%20clean%20minimal%20background%2C%20trust%20and%20security%20theme&width=500&height=500&seq=safety1&orientation=squarish"
                  alt="安全・安心のイメージ"
                  className="relative w-full h-full object-cover object-top rounded-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary-100 text-primary-600 text-sm font-medium rounded-full mb-4">How it works</span>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              かんたん<span className="text-primary-500">5ステップ</span> 🚀
            </h3>
            <p className="text-gray-600">すぐに始められます</p>
          </div>

          <div className="space-y-6">
            {[
              { icon: 'ri-user-smile-line', title: 'アカウント登録', desc: '年齢確認と利用規約に同意するだけ', color: 'from-primary-400 to-primary-500', bg: 'bg-primary-50' },
              { icon: 'ri-shield-check-line', title: '本人確認', desc: 'eKYCで安全に本人確認を完了', color: 'from-accent-peach to-accent-coral', bg: 'bg-warm-50' },
              { icon: 'ri-settings-4-line', title: '同意設定', desc: 'あなたの境界線を設定しよう', color: 'from-accent-rose to-primary-400', bg: 'bg-primary-50' },
              { icon: 'ri-search-heart-line', title: 'マッチング', desc: '同意が一致する相手を探そう', color: 'from-primary-500 to-accent-coral', bg: 'bg-warm-50' },
              { icon: 'ri-chat-heart-line', title: '会話スタート', desc: '安心してコミュニケーションを楽しもう', color: 'from-accent-coral to-accent-rose', bg: 'bg-primary-50' }
            ].map((step, index) => (
              <div key={index} className={`flex items-center gap-6 p-6 ${step.bg} rounded-2xl border border-primary-100/50`}>
                <div className="relative">
                  <div className={`w-14 h-14 flex items-center justify-center bg-gradient-to-br ${step.color} text-white rounded-2xl shadow-lg`}>
                    <i className={`${step.icon} text-2xl`}></i>
                  </div>
                  <span className="absolute -top-2 -left-2 w-6 h-6 bg-white rounded-full flex items-center justify-center text-xs font-bold text-primary-600 border-2 border-primary-200">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="font-display font-bold text-gray-800 mb-1">{step.title}</h5>
                  <p className="text-sm text-gray-600">{step.desc}</p>
                </div>
                {index < 4 && (
                  <div className="hidden md:block text-primary-300">
                    <i className="ri-arrow-right-line text-xl"></i>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button 
              onClick={() => navigate('/age-gate')}
              className="px-10 py-4 bg-gradient-to-r from-primary-500 to-accent-coral text-white text-base font-semibold rounded-full shadow-xl shadow-primary-200/50 hover:shadow-2xl hover:shadow-primary-300/50 transition-all duration-300 hover:-translate-y-1 cursor-pointer whitespace-nowrap"
            >
              今すぐはじめる 💕
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gradient-to-b from-warm-50 to-primary-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 bg-white text-primary-600 text-sm font-medium rounded-full mb-4 shadow-sm">Voice</span>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              みんなの<span className="text-primary-500">声</span> 💬
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-primary-100/30 border border-primary-100/50">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                「同意設定があるから、<span className="text-primary-600 font-medium">自分のペースで</span>関係を進められるのが嬉しい。安心して使えています💕」
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-300 to-accent-peach rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <p className="font-medium text-gray-800">Mika さん</p>
                  <p className="text-sm text-gray-500">28歳・東京</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg shadow-primary-100/30 border border-primary-100/50">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-gray-700 mb-6 leading-relaxed">
                「本人確認があるので<span className="text-primary-600 font-medium">信頼できる人</span>と出会えました。境界線を尊重してくれる人と繋がれて嬉しいです🌸」
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-accent-coral to-accent-rose rounded-full flex items-center justify-center text-white font-bold">
                  Y
                </div>
                <div>
                  <p className="font-medium text-gray-800">Yuki さん</p>
                  <p className="text-sm text-gray-500">32歳・大阪</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-primary-400 via-accent-coral to-primary-500 relative overflow-hidden">
        {/* Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 text-white/20 text-4xl">💕</div>
          <div className="absolute top-20 right-20 text-white/20 text-3xl">✨</div>
          <div className="absolute bottom-10 left-1/4 text-white/20 text-4xl">💖</div>
          <div className="absolute bottom-20 right-10 text-white/20 text-3xl">🌸</div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center text-white">
          <h3 className="font-display text-3xl md:text-4xl font-bold mb-4">
            素敵な出会いを、今すぐ 💝
          </h3>
          <p className="text-white/90 mb-8 text-lg">
            同意を大切にする、新しいマッチングを体験しよう
          </p>
          <button 
            onClick={() => navigate('/age-gate')}
            className="px-10 py-4 bg-white text-primary-600 text-base font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer whitespace-nowrap"
          >
            無料ではじめる →
          </button>
          <p className="mt-6 text-sm text-white/70">※18歳以上の方のみご利用いただけます</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-50 to-warm-50 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-primary-400 to-accent-coral rounded-full">
                  <i className="ri-heart-pulse-line text-white"></i>
                </div>
                <span className="font-display font-bold text-gray-800">Consent Match</span>
              </div>
              <p className="text-sm text-gray-600">
                同意を大切にする<br />マッチングサービス 💕
              </p>
            </div>

            <div>
              <h6 className="font-semibold text-gray-800 mb-3 text-sm">サービス</h6>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">特徴</a></li>
                <li><a href="#safety" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">安心・安全</a></li>
                <li><a href="#how-it-works" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">使い方</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-gray-800 mb-3 text-sm">サポート</h6>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">ヘルプセンター</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">お問い合わせ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">通報について</a></li>
              </ul>
            </div>

            <div>
              <h6 className="font-semibold text-gray-800 mb-3 text-sm">法的情報</h6>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">利用規約</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">プライバシーポリシー</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 cursor-pointer transition-colors">特定商取引法</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-primary-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-gray-500">
              © 2024 Consent Match. All rights reserved.
            </p>
            <a 
              href="https://readdy.ai/?ref=logo" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-primary-600 cursor-pointer transition-colors"
            >
              Powered by Readdy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
