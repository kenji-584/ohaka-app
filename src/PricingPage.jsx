export default function PricingPage({ onBack }) {
  const css = `
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:#faf7f2;color:#1e1a16;font-family:'DM Sans',sans-serif;font-weight:300}
    @import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
    :root{--paper:#faf7f2;--paper2:#f3ede4;--ink:#1e1a16;--ink2:#5a5248;--ink3:#9a9088;--gold:#8a6830;--gold2:#b08840;--gold3:#d4a85a;--border:rgba(138,104,48,0.15);--border2:rgba(138,104,48,0.3);--serif:'Shippori Mincho',serif;--sans:'DM Sans',sans-serif}
    .pg{min-height:100vh;background:var(--paper);padding:0 0 80px}
    .back{padding:24px 32px;font-size:12px;letter-spacing:0.14em;color:var(--gold);cursor:pointer;border:none;background:none;font-family:var(--sans);display:flex;align-items:center;gap:8px}
    .back:hover{opacity:.7}
    .hd{text-align:center;padding:40px 24px 56px;border-bottom:1px solid var(--border)}
    .hd-label{font-size:10px;letter-spacing:0.28em;text-transform:uppercase;color:var(--gold);margin-bottom:16px}
    .hd-title{font-family:var(--serif);font-size:clamp(26px,4vw,38px);font-weight:700;letter-spacing:0.14em;line-height:1.5;margin-bottom:14px}
    .hd-sub{font-size:14px;color:var(--ink3);letter-spacing:0.06em;line-height:1.8}
    .plans{display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:2px;max-width:900px;margin:56px auto 0;padding:0 24px}
    .plan{background:white;padding:40px 36px;position:relative}
    .plan.featured{background:var(--ink)}
    .plan-label{font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold3);margin-bottom:8px}
    .plan.featured .plan-label{color:var(--gold3)}
    .plan-name{font-family:var(--serif);font-size:22px;font-weight:700;letter-spacing:0.12em;margin-bottom:6px;color:var(--ink)}
    .plan.featured .plan-name{color:white}
    .plan-desc{font-size:12px;color:var(--ink3);letter-spacing:0.05em;margin-bottom:28px;line-height:1.7}
    .plan.featured .plan-desc{color:rgba(255,255,255,0.5)}
    .plan-price{font-family:var(--serif);font-size:42px;font-weight:700;color:var(--ink);line-height:1;margin-bottom:6px}
    .plan.featured .plan-price{color:white}
    .plan-period{font-size:12px;color:var(--ink3);letter-spacing:0.08em;margin-bottom:32px}
    .plan.featured .plan-period{color:rgba(255,255,255,0.45)}
    .feat-section{margin-bottom:10px}
    .feat-section-title{font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold3);margin-bottom:10px;margin-top:20px;font-weight:400}
    .plan.featured .feat-section-title{color:rgba(212,168,90,0.7)}
    .feat{display:flex;align-items:flex-start;gap:10px;padding:7px 0;border-bottom:1px solid rgba(138,104,48,0.08);font-size:13px;color:var(--ink2);letter-spacing:0.03em;line-height:1.5}
    .feat:last-child{border-bottom:none}
    .plan.featured .feat{color:rgba(255,255,255,0.75);border-bottom-color:rgba(255,255,255,0.06)}
    .feat-icon{flex-shrink:0;width:16px;color:var(--gold2);font-size:12px;margin-top:2px}
    .feat-icon.off{color:var(--ink3)}
    .plan.featured .feat-icon.off{color:rgba(255,255,255,0.25)}
    .feat-soon{font-size:10px;letter-spacing:0.1em;color:var(--gold3);background:rgba(212,168,90,0.12);padding:2px 7px;border-radius:100px;margin-left:4px;vertical-align:middle}
    .plan.featured .feat-soon{background:rgba(212,168,90,0.18);color:var(--gold3)}
    .plan-btn{width:100%;padding:14px;border:1px solid var(--border2);background:none;color:var(--gold);font-family:var(--sans);font-size:12px;font-weight:500;letter-spacing:0.16em;text-transform:uppercase;cursor:pointer;transition:all .25s;border-radius:2px;margin-top:32px}
    .plan-btn:hover{background:rgba(138,104,48,0.07)}
    .plan-btn.primary{background:var(--gold2);border-color:var(--gold2);color:white}
    .plan-btn.primary:hover{background:var(--gold3);border-color:var(--gold3)}
    .coming-box{max-width:900px;margin:48px auto 0;padding:0 24px}
    .coming-inner{background:var(--paper2);border:1px solid var(--border);border-radius:2px;padding:32px 36px}
    .coming-title{font-family:var(--serif);font-size:16px;font-weight:600;letter-spacing:0.12em;margin-bottom:20px;color:var(--ink)}
    .coming-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
    .coming-item{display:flex;align-items:flex-start;gap:10px;font-size:12px;color:var(--ink3);line-height:1.6;letter-spacing:0.04em}
    .coming-dot{flex-shrink:0;width:6px;height:6px;border-radius:50%;background:var(--gold3);margin-top:5px;opacity:.6}
    .faq-wrap{max-width:680px;margin:56px auto 0;padding:0 24px}
    .faq-title{font-family:var(--serif);font-size:20px;font-weight:600;letter-spacing:0.14em;text-align:center;margin-bottom:32px}
    .faq{border-bottom:1px solid var(--border);padding:20px 0}
    .faq:first-of-type{border-top:1px solid var(--border)}
    .faq-q{font-size:14px;font-weight:400;letter-spacing:0.04em;color:var(--ink);margin-bottom:8px}
    .faq-a{font-size:13px;color:var(--ink3);line-height:1.8;letter-spacing:0.04em}
    @media(max-width:600px){.plans{grid-template-columns:1fr}.plan{padding:32px 24px}.coming-inner{padding:24px 20px}}
  `;

  const FREE = [
    { section: 'お墓管理', items: [
      { text: 'お墓情報の登録（1件まで）', ok: true },
      { text: '地図表示・Google Maps連携', ok: true },
      { text: '写真の登録（3枚まで）', ok: true },
    ]},
    { section: '終活・もしも', items: [
      { text: 'もしもノート（全セクション）', ok: true },
      { text: '葬儀チェックリスト', ok: true },
    ]},
    { section: 'その他', items: [
      { text: 'AI相談（月3回まで）', ok: true },
      { text: '法事スケジュール表示', ok: true },
    ]},
  ];

  const PRO = [
    { section: 'お墓管理', items: [
      { text: 'お墓情報の登録（無制限）', ok: true },
      { text: '地図表示・Google Maps連携', ok: true },
      { text: '写真の登録（無制限）', ok: true },
    ]},
    { section: '終活・もしも', items: [
      { text: 'もしもノート（全セクション）', ok: true },
      { text: '葬儀チェックリスト', ok: true },
      { text: '引き継ぎ・エクスポート', ok: true },
    ]},
    { section: 'その他', items: [
      { text: 'AI相談（無制限）', ok: true },
      { text: '法事スケジュール自動計算', ok: true },
    ]},
  ];

  const COMING = [
    '家族アカウント共有（複数名で同じお墓を管理）',
    '法事リマインダーメール通知',
    'もしもノートPDF出力・印刷',
    'お墓の写真変化の年次比較',
    '葬儀社・石材店へのAI送客',
    '相続・遺言書の専門家紹介',
  ];

  const FAQS = [
    { q: 'いつでも解約できますか？', a: 'はい、いつでも解約できます。解約後もその月末まで引き続きご利用いただけます。' },
    { q: '支払い情報は安全ですか？', a: 'カード情報はStripe（世界中の大企業が使う決済基盤）が管理します。私たちのサーバーにカード番号は一切残りません。' },
    { q: '無料プランからいつでも変更できますか？', a: 'はい。無料で使ってみて、必要と感じたらいつでもアップグレードできます。登録したデータはそのまま引き継がれます。' },
    { q: 'データはどこに保存されますか？', a: '現在はご使用のブラウザ（ローカルストレージ）に保存されます。将来のアップデートでクラウド同期機能を追加予定です。' },
  ];

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@500;600;700&family=DM+Sans:wght@300;400;500&display=swap');${css}`}</style>
      <div className="pg">
        <button className="back" onClick={onBack}>← アプリに戻る</button>
        <div className="hd">
          <div className="hd-label">ご利用プラン</div>
          <div className="hd-title">大切な記録を、ずっと残せるように</div>
          <div className="hd-sub">まずは無料でお試しください。いつでもアップグレードできます。</div>
        </div>

        <div className="plans">
          {/* 無料プラン */}
          <div className="plan">
            <div className="plan-label">無料プラン</div>
            <div className="plan-name">フリー</div>
            <div className="plan-desc">まずは試してみたい方へ</div>
            <div className="plan-price">¥0</div>
            <div className="plan-period">ずっと無料</div>
            {FREE.map(sec => (
              <div key={sec.section} className="feat-section">
                <div className="feat-section-title">{sec.section}</div>
                {sec.items.map(f => (
                  <div key={f.text} className="feat">
                    <span className="feat-icon">{f.ok ? '✓' : '—'}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            ))}
            <button className="plan-btn" onClick={onBack}>無料で始める</button>
          </div>

          {/* プロプラン */}
          <div className="plan featured">
            <div className="plan-label">おすすめ</div>
            <div className="plan-name">ファミリープラン</div>
            <div className="plan-desc">すべての機能を制限なく使いたい方へ</div>
            <div className="plan-price">¥1,980</div>
            <div className="plan-period">/ 月（税込）</div>
            {PRO.map(sec => (
              <div key={sec.section} className="feat-section">
                <div className="feat-section-title">{sec.section}</div>
                {sec.items.map(f => (
                  <div key={f.text} className="feat">
                    <span className="feat-icon">{f.ok ? '✓' : '—'}</span>
                    <span>{f.text}</span>
                  </div>
                ))}
              </div>
            ))}
            <button className="plan-btn primary" onClick={() => window.open('https://buy.stripe.com/test_28E3cvc0N5016LY28oa3u00', '_blank')}>プランを始める</button>
          </div>
        </div>

        {/* 近日公開 */}
        <div className="coming-box">
          <div className="coming-inner">
            <div className="coming-title">近日公開予定の機能</div>
            <div className="coming-grid">
              {COMING.map(item => (
                <div key={item} className="coming-item">
                  <div className="coming-dot"/>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="faq-wrap">
          <div className="faq-title">よくある質問</div>
          {FAQS.map(f => (
            <div key={f.q} className="faq">
              <div className="faq-q">{f.q}</div>
              <div className="faq-a">{f.a}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
