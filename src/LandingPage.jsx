import { useEffect, useRef, useState } from 'react'
const css = `@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600;700;800&family=Noto+Serif+JP:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}:root{--paper:#faf7f2;--paper2:#f3ede4;--paper3:#ede5d8;--ink:#1e1a16;--ink2:#5a5248;--ink3:#9a9088;--ink4:#c5bdb5;--gold:#8a6830;--gold2:#b08840;--gold3:#d4a85a;--gold4:#f0c878;--border:rgba(138,104,48,0.15);--border2:rgba(138,104,48,0.3);--serif:'Shippori Mincho',serif;--serif2:'Noto Serif JP',serif;--sans:'DM Sans',sans-serif;}html{scroll-behavior:smooth}body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-weight:300;overflow-x:hidden;-webkit-font-smoothing:antialiased}.lp-hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:80px 24px 60px;text-align:center;position:relative;overflow:hidden;}.lp-hero::before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 0%,rgba(212,168,90,0.08) 0%,transparent 70%);pointer-events:none;}.lp-mon{width:64px;height:64px;margin:0 auto 32px;opacity:0;transform:scale(0.8);transition:all 0.8s ease}.lp-mon.visible{opacity:1;transform:scale(1)}.lp-eyebrow{font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);margin-bottom:28px;opacity:0;transform:translateY(12px);transition:all 0.7s ease 0.2s;}.lp-eyebrow.visible{opacity:1;transform:translateY(0)}.lp-headline{font-family:var(--serif);font-size:clamp(28px,5vw,52px);font-weight:700;letter-spacing:0.12em;line-height:1.6;color:var(--ink);margin-bottom:32px;opacity:0;transform:translateY(20px);transition:all 0.8s ease 0.3s;}.lp-headline.visible{opacity:1;transform:translateY(0)}.lp-headline em{color:var(--gold2);font-style:normal;position:relative}.lp-headline em::after{content:'';position:absolute;bottom:-4px;left:0;right:0;height:2px;background:linear-gradient(90deg,var(--gold3),var(--gold4));}.lp-sub{font-family:var(--serif2);font-size:clamp(14px,2vw,18px);font-weight:300;color:var(--ink2);line-height:2;max-width:560px;margin:0 auto 48px;opacity:0;transform:translateY(12px);transition:all 0.7s ease 0.5s;}.lp-sub.visible{opacity:1;transform:translateY(0)}.lp-cta-wrap{display:flex;gap:16px;justify-content:center;flex-wrap:wrap;opacity:0;transform:translateY(12px);transition:all 0.7s ease 0.6s;}.lp-cta-wrap.visible{opacity:1;transform:translateY(0)}.lp-btn-primary{padding:16px 40px;background:var(--gold2);color:white;border:none;font-family:var(--sans);font-size:13px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.3s;box-shadow:0 4px 24px rgba(138,104,48,0.3);}.lp-btn-primary:hover{background:var(--gold);transform:translateY(-2px)}.lp-btn-ghost{padding:16px 32px;background:none;color:var(--gold);border:1px solid var(--border2);font-family:var(--sans);font-size:13px;font-weight:400;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.3s;}.lp-btn-ghost:hover{background:rgba(138,104,48,0.06)}.lp-scroll-hint{position:absolute;bottom:32px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:8px;font-size:10px;letter-spacing:0.2em;color:var(--ink4);text-transform:uppercase;animation:bounce 2s infinite;}@keyframes bounce{0%,100%{transform:translateX(-50%) translateY(0)}50%{transform:translateX(-50%) translateY(6px)}}.lp-scroll-line{width:1px;height:40px;background:linear-gradient(180deg,var(--gold3),transparent)}.lp-story{padding:100px 24px;max-width:720px;margin:0 auto;border-top:1px solid var(--border);}.lp-story-label{font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);margin-bottom:48px;display:flex;align-items:center;gap:14px;}.lp-story-label::before{content:'';width:24px;height:1px;background:var(--gold3)}.lp-story-text{font-family:var(--serif2);font-size:clamp(16px,2.5vw,20px);font-weight:300;line-height:2.2;color:var(--ink2);letter-spacing:0.04em;}.lp-story-text p{margin-bottom:2em}.lp-story-text strong{color:var(--ink);font-weight:500}.lp-story-text em{color:var(--gold);font-style:normal;font-weight:500}.lp-story-quote{margin:56px 0;padding:36px 44px;background:linear-gradient(135deg,var(--paper2),var(--paper3));border-left:3px solid var(--gold2);font-family:var(--serif);font-size:clamp(18px,3vw,24px);font-weight:600;letter-spacing:0.12em;line-height:1.8;color:var(--ink);}.lp-story-quote span{display:block;font-size:11px;font-family:var(--sans);font-weight:300;letter-spacing:0.14em;color:var(--ink3);margin-top:16px}.lp-features{padding:100px 24px;background:var(--paper2);border-top:1px solid var(--border)}.lp-features-inner{max-width:960px;margin:0 auto}.lp-section-title{font-family:var(--serif);font-size:clamp(22px,3.5vw,34px);font-weight:600;letter-spacing:0.16em;text-align:center;margin-bottom:14px;}.lp-section-sub{font-size:13px;color:var(--ink3);text-align:center;letter-spacing:0.06em;margin-bottom:64px;line-height:1.8}.lp-features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:2px}.lp-feature{background:white;padding:36px 28px;position:relative;overflow:hidden;transition:transform 0.3s;}.lp-feature::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,transparent,var(--gold3),transparent);opacity:0;transition:opacity 0.3s;}.lp-feature:hover{transform:translateY(-4px)}.lp-feature:hover::before{opacity:1}.lp-feature-icon{font-size:28px;margin-bottom:18px;display:block}.lp-feature-title{font-family:var(--serif);font-size:17px;font-weight:600;letter-spacing:0.1em;margin-bottom:10px;color:var(--ink)}.lp-feature-desc{font-size:12px;color:var(--ink3);line-height:1.9;letter-spacing:0.04em}.lp-feature-tag{display:inline-block;margin-top:14px;font-size:10px;letter-spacing:0.14em;color:var(--gold);border:1px solid var(--border2);padding:3px 10px;border-radius:100px;background:rgba(212,168,90,0.05);}.lp-mosimo{padding:100px 24px;max-width:800px;margin:0 auto;border-top:1px solid var(--border);}.lp-mosimo-hero{background:linear-gradient(135deg,#1e1a16 0%,#2d2318 100%);padding:56px 48px;border-radius:3px;position:relative;overflow:hidden;}.lp-mosimo-tag{font-size:10px;letter-spacing:0.24em;text-transform:uppercase;color:var(--gold3);margin-bottom:18px;display:block;}.lp-mosimo-title{font-family:var(--serif);font-size:clamp(22px,3vw,30px);font-weight:700;letter-spacing:0.14em;color:white;margin-bottom:18px;line-height:1.6;}.lp-mosimo-desc{font-size:13px;color:rgba(255,255,255,0.5);line-height:1.9;letter-spacing:0.04em;max-width:480px}.lp-mosimo-items{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}.lp-mosimo-item{font-size:11px;letter-spacing:0.1em;color:rgba(212,168,90,0.8);border:1px solid rgba(212,168,90,0.2);padding:4px 12px;border-radius:100px;}.lp-steps{padding:100px 24px;border-top:1px solid var(--border)}.lp-steps-inner{max-width:680px;margin:0 auto}.lp-steps-list{margin-top:56px}.lp-step{display:flex;gap:28px;padding:36px 0;border-bottom:1px solid var(--border);align-items:flex-start}.lp-step:last-child{border-bottom:none}.lp-step-num{font-family:var(--serif);font-size:44px;font-weight:800;color:var(--gold4);line-height:1;flex-shrink:0;min-width:52px;}.lp-step-title{font-family:var(--serif);font-size:19px;font-weight:600;letter-spacing:0.1em;margin-bottom:8px}.lp-step-desc{font-size:13px;color:var(--ink3);line-height:1.9;letter-spacing:0.04em}.lp-final{padding:140px 24px;text-align:center;background:linear-gradient(180deg,var(--paper) 0%,var(--paper2) 100%);border-top:1px solid var(--border);}.lp-final-title{font-family:var(--serif);font-size:clamp(26px,4vw,42px);font-weight:700;letter-spacing:0.14em;line-height:1.6;margin-bottom:24px;}.lp-final-sub{font-family:var(--serif2);font-size:15px;color:var(--ink3);line-height:2;margin-bottom:48px;letter-spacing:0.06em}.lp-free-badge{display:inline-block;font-size:11px;letter-spacing:0.2em;color:var(--gold2);border:1px solid var(--border2);padding:6px 20px;border-radius:100px;margin-bottom:28px;background:rgba(176,136,64,0.06);}.lp-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:18px 36px;display:flex;align-items:center;justify-content:space-between;background:rgba(250,247,242,0);backdrop-filter:blur(0px);border-bottom:1px solid transparent;transition:all 0.4s;}.lp-nav.scrolled{background:rgba(250,247,242,0.92);backdrop-filter:blur(16px);border-bottom-color:var(--border);}.lp-nav-logo{font-family:var(--serif);font-size:16px;letter-spacing:0.2em;color:var(--ink)}.lp-nav-btn{padding:9px 22px;background:var(--gold2);color:white;border:none;font-family:var(--sans);font-size:11px;font-weight:500;letter-spacing:0.14em;text-transform:uppercase;cursor:pointer;border-radius:2px;transition:all 0.25s;}.lp-nav-btn:hover{background:var(--gold)}.lp-ornament{display:flex;align-items:center;justify-content:center;gap:16px;color:var(--gold3);margin:56px 0}.lp-ornament span{width:60px;height:1px;background:var(--gold3);opacity:.4}.fade-up{opacity:0;transform:translateY(24px);transition:all 0.8s ease}.fade-up.visible{opacity:1;transform:translateY(0)}@media(max-width:600px){.lp-mosimo-hero{padding:36px 24px}.lp-step{flex-direction:column;gap:8px}.lp-nav{padding:14px 18px}.lp-story-quote{padding:24px 20px}}`
export default function LandingPage({ onEnterApp }) {
  const [scrolled, setScrolled] = useState(false)
  const heroRef = useRef(null)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.fade-up,.lp-mon,.lp-eyebrow,.lp-headline,.lp-sub,.lp-cta-wrap').forEach(el => observer.observe(el))
    return () => { window.removeEventListener('scroll', onScroll); observer.disconnect() }
  }, [])
  const features = [
    { icon:'⛩', title:'お墓の場所を永久保存', desc:'住所・地図・写真・アクセスメモ。家族の誰もが迷わず辿り着けるように記録します。', tag:'迷子ゼロ' },
    { icon:'📓', title:'もしもノート', desc:'葛儀の希望・財産・保険・緊急連絡先・デジタル資産・家族へのメッセージ。万が一に備える6つのセクション。', tag:'最重要機能' },
    { icon:'◯', title:'法事スケジュール自動計算', desc:'命日を入力するだけで、初七日から三十三回忌まで全ての日程を自動表示。', tag:'うっかり防止' },
    { icon:'📷', title:'思い出アルバム', desc:'故人の写真とエピソードを記録して家族で共有。風化させたくない記憶を残し続けます。', tag:'家族の宝' },
    { icon:'◇', title:'AI相談（24時間対応）', desc:'葛儀の費用、戒名の相場、墓じまいの手順——知りたい時に専門家レベルの回答がすぐ得られます。', tag:'いつでも相談' },
    { icon:'↗', title:'次世代への引き継ぎ', desc:'すべての情報を印刷・保存して家族に渡せます。エンディングノートとしても使えます。', tag:'家族への贈り物' },
  ]
  const steps = [
    { num:'01', title:'アプリを開く', desc:'インストール不要。ブラウザで開くだけ。スマホでもPCでも使えます。' },
    { num:'02', title:'お墓の情報を登録', desc:'名前・住所・写真を入れるだけで完了。5分もかかりません。' },
    { num:'03', title:'もしもノートを書く', desc:'6つのセクションを少しずつ埋めていきます。書けるところから始めてください。' },
  ]
  return (
    <>
      <style>{css}</style>
      <nav className={`lp-nav ${scrolled?'scrolled':''}`}>
        <div className="lp-nav-logo">家のお墓帳</div>
        <button className="lp-nav-btn" onClick={onEnterApp}>無料で始める</button>
      </nav>
      <section className="lp-hero" ref={heroRef}>
        <svg className="lp-mon" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="#b08840" strokeWidth="0.8"/>
          <circle cx="32" cy="32" r="21" stroke="#b08840" strokeWidth="0.5" strokeDasharray="2 4"/>
          <circle cx="32" cy="32" r="4" fill="#b08840" opacity="0.4"/>
          {[0,45,90,135,180,225,270,315].map(a => {
            const rad = a*Math.PI/180
            return <line key={a} x1={32+24*Math.cos(rad)} y1={32+24*Math.sin(rad)} x2={32+29*Math.cos(rad)} y2={32+29*Math.sin(rad)} stroke="#b08840" strokeWidth="0.7"/>
          })}
        </svg>
        <div className="lp-eyebrow">Ancestral Records &amp; Memorial Guide</div>
        <h1 className="lp-headline">
          「お父さん、うちのお墓<br/><em>どこだっけ？</em>」<br/>
          そう聞く前に、今日登録しておく。
        </h1>
        <p className="lp-sub">お墓の場所・写真・法事の日程・もしもの時の準備——<br/>大切な情報を家族で守るアプリ</p>
        <div className="lp-cta-wrap">
          <button className="lp-btn-primary" onClick={onEnterApp}>無料で始める</button>
          <button className="lp-btn-ghost" onClick={()=>document.getElementById('features')?.scrollIntoView({behavior:'smooth'})}>機能を見る</button>
        </div>
        <div className="lp-scroll-hint"><div className="lp-scroll-line"/><span>scroll</span></div>
      </section>
      <section className="lp-story">
        <div className="lp-story-label">制作の背景</div>
        <div className="lp-story-text fade-up">
          <p>父と一緒にお墓参りに行った日のことを、今でも鮮明に覚えています。墓地の近くにいるのに、<strong>高齢の父がお墓の場所を思い出せなかった。</strong></p>
          <p>仕方なく近くのお店をいくつかまわって聞いて、やっと辿り着いた。その時、ふと思ったんです。</p>
        </div>
        <div className="lp-story-quote fade-up">
          もし父が一人で来ていたら。<br/>
          もし父が突然いなくなったら、<br/>私たちはお墓の場所すら知らない。
          <span>— 小橋賢児 / 開発者</span>
        </div>
        <div className="lp-story-text fade-up">
          <p>葛儀の手順、お寺の連絡先、保険の情報、銀行口座——<em>「もしもの時」に必要なものは山ほどある。</em>でも、多くの家族がそれを何も準備していない。</p>
          <p>だから作りました。家族の記録を、次の世代へ確実につなぐためのアプリを。</p>
        </div>
      </section>
      <div className="lp-ornament"><span/>✦<span/></div>
      <section className="lp-features" id="features">
        <div className="lp-features-inner">
          <h2 className="lp-section-title fade-up">家族のための、全機能</h2>
          <p className="lp-section-sub fade-up">お墓管理から終活まで。必要なものがすべて一箇所に。</p>
          <div className="lp-features-grid">
            {features.map((f,i) => (
              <div className="lp-feature fade-up" key={i} style={{transitionDelay:i*0.07+'s'}}>
                <span className="lp-feature-icon">{f.icon}</span>
                <div className="lp-feature-title">{f.title}</div>
                <div className="lp-feature-desc">{f.desc}</div>
                <span className="lp-feature-tag">{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="lp-mosimo">
        <div className="lp-mosimo-hero fade-up">
          <span className="lp-mosimo-tag">最重要機能</span>
          <div className="lp-mosimo-title">もしもノートは、<br/>家族への最大の贈り物</div>
          <div className="lp-mosimo-desc">今日30分で書いておくことが、家族が途方に暮れる数日間を救います。</div>
          <div className="lp-mosimo-items">
            {['葛儀の希望','財産・保険','緊急連絡先','デジタル資産','遺言メモ','ペット・家の引き継ぎ'].map(t => (
              <span className="lp-mosimo-item" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </section>
      <section className="lp-steps">
        <div className="lp-steps-inner">
          <h2 className="lp-section-title fade-up">始め方は、3ステップ</h2>
          <p className="lp-section-sub fade-up">登録不要。今すぐ無料で使えます。</p>
          <div className="lp-steps-list">
            {steps.map((s,i) => (
              <div className="lp-step fade-up" key={i} style={{transitionDelay:i*0.1+'s'}}>
                <div className="lp-step-num">{s.num}</div>
                <div><div className="lp-step-title">{s.title}</div><div className="lp-step-desc">{s.desc}</div></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="lp-final">
        <div className="lp-free-badge fade-up">✦ 無料プラン — 登録不要</div>
        <h2 className="lp-final-title fade-up">今日、家族のために<br/>一つだけ始めてください。</h2>
        <p className="lp-final-sub fade-up">お墓の場所を登録するだけでもいい。<br/>それだけで、家族の誰かが救われる日が来るかもしれない。</p>
        <div className="fade-up"><button className="lp-btn-primary" style={{fontSize:14,padding:'18px 52px'}} onClick={onEnterApp}>無料で家のお墓帳を始める</button></div>
      </section>
      <footer style={{padding:'36px 24px',textAlign:'center',borderTop:'1px solid var(--border)',background:'var(--paper2)'}}>
        <div style={{fontFamily:'var(--serif)',fontSize:15,letterSpacing:'0.2em',color:'var(--ink)',marginBottom:10}}>家のお墓帳</div>
        <div style={{fontSize:11,color:'var(--ink4)',letterSpacing:'0.1em'}}>Ancestral Records &amp; Memorial Guide</div>
      </footer>
    </>
  )
}
