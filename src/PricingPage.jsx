import { useState } from 'react'

const css = `
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--paper:#faf7f2;--paper2:#f3ede4;--paper3:#ede5d8;--ink:#1e1a16;--ink2:#5a5248;--ink3:#9a9088;--gold:#8a6830;--gold2:#b08840;--gold3:#d4a85a;--border:rgba(138,104,48,0.14);--border2:rgba(138,104,48,0.28);--serif:'Shippori Mincho',serif;--sans:'DM Sans',sans-serif;--green2:#4e8f62}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-weight:300;-webkit-font-smoothing:antialiased}
.wrap{max-width:760px;margin:0 auto;padding:48px 24px 80px}
.back-btn{display:inline-flex;align-items:center;gap:8px;background:none;border:none;color:var(--ink3);font-family:var(--sans);font-size:12px;letter-spacing:0.1em;cursor:pointer;margin-bottom:40px;padding:0;transition:color .2s}
.back-btn:hover{color:var(--gold)}
.page-title{font-family:var(--serif);font-size:26px;font-weight:500;letter-spacing:0.2em;text-align:center;margin-bottom:10px}
.page-sub{font-size:13px;color:var(--ink3);text-align:center;letter-spacing:0.1em;margin-bottom:48px}
.ornament{display:flex;align-items:center;justify-content:center;gap:14px;color:var(--gold3);margin-bottom:48px}
.ornament span{width:48px;height:1px;background:var(--gold3);opacity:.5}
.toggle-row{display:flex;align-items:center;justify-content:center;gap:14px;margin-bottom:40px}
.toggle-label{font-size:13px;color:var(--ink3);letter-spacing:0.06em}
.toggle-label.active{color:var(--ink);font-weight:500}
.toggle-track{width:44px;height:24px;border-radius:12px;background:var(--paper3);border:1px solid var(--border2);position:relative;cursor:pointer;transition:background .25s}
.toggle-track.on{background:var(--gold2)}
.toggle-knob{width:18px;height:18px;border-radius:50%;background:white;position:absolute;top:2px;left:3px;transition:transform .25s;box-shadow:0 1px 4px rgba(0,0,0,0.15)}
.toggle-track.on .toggle-knob{transform:translateX(20px)}
.save-badge{font-size:10px;letter-spacing:0.1em;color:var(--green2);border:1px solid rgba(78,143,98,0.3);padding:3px 10px;border-radius:100px;background:rgba(78,143,98,0.07)}
.plans{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:40px}
.plan-card{background:white;border:1px solid var(--border);border-radius:3px;padding:32px 28px;position:relative;transition:box-shadow .25s}
.plan-card::after{content:'';position:absolute;top:0;left:20px;right:20px;height:1px;background:linear-gradient(90deg,transparent,var(--gold3),transparent);opacity:.4}
.plan-card.featured{border-color:var(--gold2);box-shadow:0 4px 32px rgba(138,104,48,0.1)}
.plan-card.featured::after{opacity:.9}
.popular-badge{position:absolute;top:-11px;left:50%;transform:translateX(-50%);background:var(--gold2);color:white;font-size:10px;font-weight:500;letter-spacing:0.16em;padding:4px 14px;border-radius:100px;white-space:nowrap;font-family:var(--sans)}
.plan-name{font-family:var(--serif);font-size:18px;font-weight:500;letter-spacing:0.12em;margin-bottom:6px}
.plan-desc{font-size:12px;color:var(--ink3);letter-spacing:0.05em;margin-bottom:24px;line-height:1.6}
.plan-price{margin-bottom:28px}
.price-num{font-family:var(--serif);font-size:38px;font-weight:600;color:var(--ink);letter-spacing:-0.02em}
.price-unit{font-size:13px;color:var(--ink3);margin-left:4px}
.price-annual{font-size:11px;color:var(--green2);margin-top:6px;letter-spacing:0.06em;min-height:18px}
.features{list-style:none;margin-bottom:28px}
.features li{font-size:13px;color:var(--ink2);line-height:1.6;padding:8px 0;border-bottom:1px solid rgba(30,26,22,0.05);display:flex;align-items:flex-start;gap:10px;letter-spacing:0.03em}
.features li:last-child{border-bottom:none}
.check{color:var(--gold2);font-size:13px;flex-shrink:0;margin-top:1px}
.check.grey{color:var(--ink3)}
.plan-btn{width:100%;padding:13px;border:1px solid var(--border2);background:none;color:var(--gold);font-family:var(--sans);font-size:12px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;transition:all .25s;border-radius:2px}
.plan-btn:hover{background:rgba(138,104,48,0.07);border-color:var(--gold)}
.plan-btn.primary{background:var(--gold2);border-color:var(--gold2);color:white}
.plan-btn.primary:hover{background:var(--gold3);border-color:var(--gold3)}
.trust-row{display:flex;gap:0;margin:40px 0 0;border:1px solid var(--border);border-radius:2px;overflow:hidden}
.trust-item{flex:1;padding:20px 16px;text-align:center;border-right:1px solid var(--border)}
.trust-item:last-child{border-right:none}
.trust-icon{font-size:18px;margin-bottom:8px;opacity:.6}
.trust-label{font-size:11px;font-weight:500;letter-spacing:0.1em;color:var(--ink2);margin-bottom:4px}
.trust-desc{font-size:11px;color:var(--ink3);letter-spacing:0.04em;line-height:1.6}
.faq-title{font-family:var(--serif);font-size:17px;font-weight:500;letter-spacing:0.1em;text-align:center;margin-bottom:24px;color:var(--ink2)}
.faq-item{border-top:1px solid var(--border)}
.faq-item:last-child{border-bottom:1px solid var(--border)}
.faq-q{width:100%;background:none;border:none;text-align:left;padding:16px 0;font-family:var(--sans);font-size:13px;color:var(--ink);cursor:pointer;display:flex;justify-content:space-between;align-items:center;letter-spacing:0.04em;font-weight:400}
.faq-q:hover{color:var(--gold)}
.faq-icon{color:var(--gold3);font-size:16px;transition:transform .25s;flex-shrink:0;margin-left:12px}
.faq-icon.open{transform:rotate(45deg)}
.faq-a{font-size:13px;color:var(--ink3);line-height:1.85;letter-spacing:0.04em;padding-bottom:0;max-height:0;overflow:hidden;transition:max-height .3s ease,padding-bottom .3s ease}
.faq-a.open{max-height:200px;padding-bottom:16px}
@media(max-width:580px){.plans{grid-template-columns:1fr}.trust-row{flex-direction:column}.trust-item{border-right:none;border-bottom:1px solid var(--border)}.trust-item:last-child{border-bottom:none}.wrap{padding:32px 16px 60px}}
`

const FREE_FEATURES = [
  { text: 'お墓情報の登録（1件まで）', ok: true },
  { text: '地図表示・Google Maps連携', ok: true },
  { text: '葬儀チェックリスト', ok: true },
  { text: '写真の登録（3枚まで）', ok: true },
  { text: 'AIへの相談（月5回まで）', ok: false },
  { text: 'お墓の複数登録（無制限）', ok: false },
  { text: '法事スケジュール自動計算', ok: false },
  { text: '次世代への引き継ぎ機能', ok: false },
]

const PRO_FEATURES = [
  { text: 'お墓情報の登録（無制限）', ok: true },
  { text: '地図表示・Google Maps連携', ok: true },
  { text: '葬儀チェックリスト', ok: true },
  { text: '写真の登録（無制限）', ok: true },
  { text: 'AIへの相談（無制限）', ok: true },
  { text: '法事スケジュール自動計算', ok: true },
  { text: '次世代への引き継ぎ機能', ok: true },
  { text: '優先サポート', ok: true },
]

const FAQS = [
  { q: 'いつでも解約できますか？', a: 'はい、いつでも解約できます。解約後もその月の終わりまでは引き続きご利用いただけます。' },
  { q: '支払い情報は安全ですか？', a: 'カード情報はStripeが管理します。世界中の大企業が使う最高水準のセキュリティで、私たちのサーバーにはカード番号が残りません。' },
  { q: '無料プランからいつでも変更できますか？', a: 'はい。無料プランで使ってみて、必要と感じたらいつでもアップグレードできます。登録したデータはそのまま引き継がれます。' },
  { q: '家族と一緒に使えますか？', a: '現在は個人プランのみです。家族共有プランは今後リリース予定です。' },
]

export default function PricingPage({ onBack }) {
  const [yearly, setYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState(null)

  const monthly = 480
  const yearlyPrice = Math.floor(monthly * 12 * 0.8)
  const displayPrice = yearly ? Math.floor(yearlyPrice / 12) : monthly

  const STRIPE_URL = 'https://buy.stripe.com/test_28E3vc0N5016LY28oa3u00'

  return (
    <>
      <style>{css}</style>
      <div className="wrap">
        <button className="back-btn" onClick={onBack}>← アプリに戻る</button>
        <div className="page-title">ご利用プラン</div>
        <div className="page-sub">大切な記録を、ずっと残せるように</div>
        <div className="ornament"><span />✦<span /></div>
        <div className="toggle-row">
          <span className={`toggle-label ${!yearly?'active':''}`}>月払い</span>
          <div className={`toggle-track ${yearly?'on':''}`} onClick={()=>setYearly(v=>!v)}><div className="toggle-knob"/></div>
          <span className={`toggle-label ${yearly?'active':''}`}>年払い</span>
          <span className="save-badge">2ヶ月分お得</span>
        </div>
        <div className="plans">
          <div className="plan-card">
            <div className="plan-name">無料プラン</div>
            <div className="plan-desc">まずは試してみたい方へ</div>
            <div className="plan-price"><span className="price-num">¥0</span><span className="price-unit">/ 月</span><div className="price-annual">&nbsp;</div></div>
            <ul className="features">{FREE_FEATURES.map((f,i)=><li key={i}><span className={`check ${f.ok?'':'grey'}`}>{f.ok?'✓':'—'}</span><span style={{color:f.ok?'var(--ink2)':'var(--ink3)'}}>{f.text}</span></li>)}</ul>
            <button className="plan-btn" onClick={onBack}>無料で始める</button>
          </div>
          <div className="plan-card featured">
            <div className="popular-badge">おすすめ</div>
            <div className="plan-name">プロプラン</div>
            <div className="plan-desc">すべての機能を使いたい方へ</div>
            <div className="plan-price"><span className="price-num">¥{displayPrice.toLocaleString()}</span><span className="price-unit">/ 月</span><div className="price-annual">{yearly?`年間 ¥${yearlyPrice.toLocaleString()} でお支払い`:'年払いで 20% お得'}</div></div>
            <ul className="features">{PRO_FEATURES.map((f,i)=><li key={i}><span className="check">✓</span><span>{f.text}</span></li>)}</ul>
            <button className="plan-btn primary" onClick={()=>window.open(STRIPE_URL,'_blank')}>プロプランを始める</button>
          </div>
        </div>
        <div className="trust-row">
          {[{icon:'🔒',label:'安全な決済',desc:'Stripe の最高水準セキュリティ'},{icon:'↩',label:'いつでも解約',desc:'違約金・縛りは一切なし'},{icon:'💾',label:'データ保護',desc:'解約後もデータは保持'}].map((t,i)=>(
            <div className="trust-item" key={i}><div className="trust-icon">{t.icon}</div><div className="trust-label">{t.label}</div><div className="trust-desc">{t.desc}</div></div>
          ))}
        </div>
        <div style={{marginTop:56}}>
          <div className="faq-title">よくある質問</div>
          {FAQS.map((f,i)=>(
            <div className="faq-item" key={i}>
              <button className="faq-q" onClick={()=>setOpenFaq(openFaq===i?null:i)}>{f.q}<span className={`faq-icon ${openFaq===i?'open':''}`}>＋</span></button>
              <div className={`faq-a ${openFaq===i?'open':''}`}>{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
