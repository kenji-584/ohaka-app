const compressImage = (dataUrl, maxW = 800) =>
  new Promise(resolve => {
    const img = new Image()
    img.onload = () => {
      const s = Math.min(1, maxW / Math.max(img.width, img.height || 1))
      const c = document.createElement('canvas')
      c.width = Math.round(img.width * s)
      c.height = Math.round(img.height * s)
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height)
      resolve(c.toDataURL('image/jpeg', 0.7))
    }
    img.onerror = () => resolve(dataUrl)
    img.src = dataUrl
  })

import { useState, useRef, useEffect } from 'react'

const SK = 'ohaka_v5'
const INIT = { graves: [], memories: [], events: [], family: [], checklist: {}, mosimo: {}, notes: '' }
const migrate = () => { for (const ok of ['ohaka_v4','ohaka_v3']) { const o = localStorage.getItem(ok); if (o) { try { const d = JSON.parse(o); if (d && d.graves) { localStorage.setItem(SK, JSON.stringify({...INIT,...d})); localStorage.removeItem(ok); return } } catch {} } } }
migrate()
const load = () => { try { const d = JSON.parse(localStorage.getItem(SK)); return d ? {...INIT,...d} : {...INIT} } catch { return {...INIT} } }
const persist = d => { try { localStorage.setItem(SK, JSON.stringify(d)) } catch(e) { if (e.name === 'QuotaExceededError' || e.code === 22) { alert('保存容量が上限。写真を減らしてください') } } }

const HOJI = [
  { key: 's7',   label: 'åä¸æ¥',      days: 7 },
  { key: 's49',  label: 'ååä¹æ¥',    days: 49,  note: 'ç´éª¨ã¯ãã®æ¥ãå¤ã' },
  { key: 's100', label: 'ç¾ãæ¥',      days: 100 },
  { key: 'y1',   label: 'ä¸å¨å¿',      years: 1,  note: 'æº1å¹´ãè¦ªæãæãã¦' },
  { key: 'y3',   label: 'ä¸åå¿',      years: 2 },
  { key: 'y7',   label: 'ä¸åå¿',      years: 6 },
  { key: 'y13',  label: 'åä¸åå¿',    years: 12 },
  { key: 'y17',  label: 'åä¸åå¿',    years: 16 },
  { key: 'y23',  label: 'äºåä¸åå¿',  years: 22 },
  { key: 'y33',  label: 'ä¸åä¸åå¿',  years: 32, note: 'å¼ãä¸ã' },
]

const CHECKS = {
  'è¬åå': ['æ­»äº¡è¨ºæ­æ¸ã®åãåã','æ­»äº¡å±ã®æåºï¼7æ¥ä»¥åï¼','è¬åç¤¾ã¸ã®é£çµ¡','è©æå¯ºã¸ã®é£çµ¡','éºå½±åçã®é¸å®','åªä¸»ã®æ±ºå®','æ£ºã»ç¥­å£ãã©ã³ã®æ±ºå®','è¦ªæã»åäººã¸ã®è¨å ±é£çµ¡'],
  'è¬åå½æ¥': ['éå¤ã®æºå','åå¥å¼','ç«è¬è¨±å¯è¨¼ã®ç¢ºèª','ç«è¬ã»åéª¨','åä¸æ¥æ³è¦','é¦å¸è¿ãã®æé'],
  'è¬åå¾': ['ååä¹æ¥æ³è¦ã®äºç´','ç´éª¨ã®æé','ç¸ç¶ã»éºç£æç¶ã','å¹´éã»ä¿éºã®æç¶ã','éºåæ´ç','ãå¢ã®ç®¡çèç»é²'],
}

const SYS = 'ããªãã¯æ¥æ¬ã®ãå¢ã»è¬åã»æ³äºã®å°éã¢ããã¤ã¶ã¼ã§ããæ¸©ããä¸å¯§ãªæ¥æ¬èªã§ãå·ä½çã«ãç­ããã ãããç»é²æ¸ã¿ã®ãå¢æå ±ãåèã«ãã¦ãã ãããå°éå®¶ï¼å¼è­·å£«ã»ç¨çå£«ã»ä½è·ï¼ãå¿è¦ãªå ´é¢ã§ã¯ãã®æ¨ããä¼ããã ããã'

const css = `
@import url('https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=DM+Sans:wght@300;400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --paper:#faf7f2;--paper2:#f3ede4;--paper3:#ede5d8;
  --ink:#1e1a16;--ink2:#5a5248;--ink3:#9a9088;
  --gold:#8a6830;--gold2:#b08840;--gold3:#d4a85a;
  --border:rgba(138,104,48,0.14);--border2:rgba(138,104,48,0.28);
  --serif:'Shippori Mincho',serif;--sans:'DM Sans',sans-serif;
}
body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-weight:300;min-height:100vh;-webkit-font-smoothing:antialiased}
body::before{content:'';position:fixed;inset:0;z-index:0;pointer-events:none;background-image:radial-gradient(ellipse 80% 60% at 20% 10%,rgba(212,168,90,0.04) 0%,transparent 60%),radial-gradient(ellipse 60% 80% at 80% 90%,rgba(138,104,48,0.03) 0%,transparent 60%)}
.app{position:relative;z-index:1;max-width:820px;margin:0 auto;padding:0 28px 120px}
.hdr{padding:52px 0 40px;text-align:center}
.hdr-mon{width:52px;height:52px;margin:0 auto 22px}
.hdr h1{font-family:var(--serif);font-size:28px;font-weight:500;letter-spacing:0.32em;color:var(--ink);margin-bottom:10px}
.hdr-sub{font-size:11px;letter-spacing:0.22em;color:var(--ink3);text-transform:uppercase;margin-bottom:28px}
.hdr-ornament{display:flex;align-items:center;justify-content:center;gap:14px;color:var(--gold)}
.hdr-ornament span{width:40px;height:1px;background:var(--gold3);opacity:.5}
.nav-wrap{position:sticky;top:0;z-index:50;background:rgba(250,247,242,0.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);margin:0 -28px 40px;padding:0 28px}
.nav{display:flex;max-width:820px;margin:0 auto;justify-content:center}
.nav button{flex:1;padding:15px 6px;background:none;border:none;color:var(--ink3);font-family:var(--sans);font-size:11px;font-weight:400;letter-spacing:0.12em;text-transform:uppercase;cursor:pointer;transition:color .25s;position:relative}
.nav button::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:1px;background:var(--gold);transition:width .3s}
.nav button:hover{color:var(--ink2)}
.nav button.active{color:var(--gold)}
.nav button.active::after{width:80%}
.pro-btn{background:var(--gold2) !important;color:white !important;border-radius:100px;padding:6px 14px !important;font-size:10px !important;letter-spacing:0.14em !important;height:auto !important;align-self:center;flex:unset !important;white-space:nowrap}
.pro-btn::after{display:none !important}
.sec-label{display:flex;align-items:center;gap:14px;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);margin-bottom:24px}
.sec-label::before{content:'';width:20px;height:1px;background:var(--gold3)}
.sec-label::after{content:'';flex:1;height:1px;background:var(--border)}
.card{background:white;border:1px solid var(--border);border-radius:3px;padding:36px;box-shadow:0 2px 20px rgba(30,26,22,0.06);margin-bottom:16px;position:relative}
.card::after{content:'';position:absolute;top:0;left:24px;right:24px;height:1px;background:linear-gradient(90deg,transparent,var(--gold3),transparent);opacity:.5}
.fg{margin-bottom:22px}
.fg label{display:block;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);margin-bottom:9px}
.fg input,.fg textarea{width:100%;background:var(--paper);border:1px solid var(--border);border-radius:2px;padding:12px 15px;font-family:var(--sans);font-size:14px;font-weight:300;color:var(--ink);outline:none;transition:border-color .25s,background .25s}
.fg input:focus,.fg textarea:focus{border-color:var(--gold2);background:white}
.fg input::placeholder,.fg textarea::placeholder{color:var(--ink3)}
.fg textarea{resize:vertical;min-height:88px;line-height:1.8}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.btn{padding:11px 26px;border:1px solid var(--border2);background:none;color:var(--gold);font-family:var(--sans);font-size:11px;font-weight:400;letter-spacing:0.18em;text-transform:uppercase;cursor:pointer;transition:all .25s;border-radius:2px}
.btn:hover{background:rgba(138,104,48,0.06);border-color:var(--gold)}
.btn-solid{background:var(--gold);border-color:var(--gold);color:white;font-weight:500}
.btn-solid:hover{background:var(--gold2);border-color:var(--gold2)}
.btn-ghost{border-color:var(--border);color:var(--ink3)}
.btn-ghost:hover{border-color:var(--border2);color:var(--ink2);background:none}
.btn-danger{border-color:rgba(160,60,60,0.25);color:#a03c3c}
.btn-danger:hover{background:rgba(160,60,60,0.06);border-color:rgba(160,60,60,0.4)}
.btns{display:flex;gap:10px;justify-content:flex-end;margin-top:32px}
.grave-row{display:flex;gap:20px;align-items:flex-start;padding:24px 0;border-bottom:1px solid var(--border);cursor:pointer;transition:opacity .2s}
.grave-row:first-child{padding-top:0}
.grave-row:last-child{border-bottom:none;padding-bottom:0}
.grave-row:hover{opacity:.65}
.grave-thumb{width:76px;height:76px;border-radius:2px;overflow:hidden;background:var(--paper2);flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid var(--border)}
.grave-thumb img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.grave-row:hover .grave-thumb img{transform:scale(1.05)}
.grave-icon{font-size:28px;opacity:.25}
.grave-body{flex:1;min-width:0}
.grave-name{font-family:var(--serif);font-size:19px;font-weight:500;letter-spacing:0.1em;margin-bottom:7px;color:var(--ink)}
.grave-meta{font-size:12px;color:var(--ink3);line-height:1.9;letter-spacing:0.03em}
.tags{display:flex;gap:7px;margin-top:10px;flex-wrap:wrap}
.tag{font-size:10px;letter-spacing:0.1em;color:var(--gold);border:1px solid var(--border2);padding:3px 10px;border-radius:1px;background:rgba(212,168,90,0.05)}
.grave-chevron{align-self:center;color:var(--ink3);opacity:.35;font-size:18px}
.map-wrap{margin-top:20px}
.map-frame{width:100%;height:256px;border:1px solid var(--border);display:block;border-radius:2px;filter:sepia(15%) brightness(1.02)}
.photo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:10px}
.photo-slot{aspect-ratio:1;overflow:hidden;border-radius:2px;position:relative;cursor:pointer;border:1px solid var(--border);background:var(--paper2)}
.photo-slot img{width:100%;height:100%;object-fit:cover;display:block;transition:transform .4s}
.photo-slot:hover img{transform:scale(1.05)}
.photo-del{position:absolute;top:5px;right:5px;background:rgba(250,247,242,0.88);color:var(--ink2);border:none;cursor:pointer;width:22px;height:22px;font-size:10px;border-radius:50%;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s}
.photo-slot:hover .photo-del{opacity:1}
.photo-add{aspect-ratio:1;background:var(--paper2);border:1px dashed var(--border2);border-radius:2px;display:flex;flex-direction:column;align-items:center;justify-content:center;cursor:pointer;color:var(--ink3);font-size:11px;letter-spacing:0.1em;gap:8px;transition:all .25s}
.photo-add:hover{border-color:var(--gold2);color:var(--gold);background:rgba(212,168,90,0.04)}
.lightbox{position:fixed;inset:0;z-index:200;background:rgba(30,26,22,0.88);display:flex;align-items:center;justify-content:center}
.lightbox img{max-width:90vw;max-height:86vh;border-radius:2px}
.lightbox-close{position:absolute;top:24px;right:28px;background:none;border:1px solid rgba(255,255,255,0.2);color:rgba(255,255,255,0.7);font-size:12px;letter-spacing:0.14em;padding:8px 14px;cursor:pointer;font-family:var(--sans)}
.next-card{background:linear-gradient(135deg,var(--paper2),var(--paper3));border:1px solid var(--border2);border-left:3px solid var(--gold3);padding:22px 26px;margin-bottom:32px;display:flex;align-items:center;justify-content:space-between;border-radius:2px}
.next-label-sm{font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);margin-bottom:6px}
.next-name-lg{font-family:var(--serif);font-size:21px;letter-spacing:0.1em;color:var(--ink)}
.next-date-sm{font-size:12px;color:var(--ink3);margin-top:4px;letter-spacing:0.04em}
.next-count{font-family:var(--serif);font-size:36px;color:var(--gold);line-height:1}
.next-days-unit{font-size:10px;letter-spacing:0.16em;color:var(--ink3);text-transform:uppercase;margin-top:4px}
.hoji-item{display:flex;gap:20px;padding:18px 0;border-bottom:1px solid var(--border);transition:opacity .2s}
.hoji-item.done{opacity:.35}
.hoji-item:last-child{border-bottom:none}
.h-dot-col{padding-top:6px;display:flex;flex-direction:column;align-items:center}
.h-dot{width:9px;height:9px;border-radius:50%;flex-shrink:0;border:1.5px solid var(--ink3);background:transparent}
.hoji-item.done .h-dot{background:var(--ink3);border-color:var(--ink3)}
.hoji-item.is-next .h-dot{background:var(--gold);border-color:var(--gold);box-shadow:0 0 0 4px rgba(212,168,90,0.18)}
.hoji-item.upcoming .h-dot{border-color:var(--gold2)}
.h-body{flex:1}
.h-name{font-family:var(--serif);font-size:16px;letter-spacing:0.1em;color:var(--ink);margin-bottom:3px}
.h-date{font-size:12px;color:var(--ink3);letter-spacing:0.04em}
.h-countdown{font-size:12px;color:var(--gold2);margin-top:3px}
.h-note{font-size:11px;color:var(--gold);margin-top:3px;letter-spacing:0.06em}
.progress-info{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
.progress-title{font-size:10px;letter-spacing:0.16em;text-transform:uppercase;color:var(--ink3)}
.progress-count{font-family:var(--serif);font-size:15px;color:var(--gold)}
.prog-bar{height:2px;background:var(--border);margin-bottom:36px;border-radius:1px;overflow:hidden}
.prog-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--gold3));transition:width .5s ease;border-radius:1px}
.check-group{margin-bottom:32px}
.check-group-title{font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--ink3);padding-bottom:12px;border-bottom:1px solid var(--border);margin-bottom:4px}
.c-item{display:flex;align-items:center;gap:14px;padding:12px 0;border-bottom:1px solid rgba(30,26,22,0.04);cursor:pointer}
.c-box{width:16px;height:16px;flex-shrink:0;border:1px solid var(--ink3);border-radius:1px;display:flex;align-items:center;justify-content:center;transition:all .2s}
.c-box.done{background:var(--gold);border-color:var(--gold)}
.c-box.done::after{content:'â';font-size:10px;color:white}
.c-text{font-size:13px;color:var(--ink2);letter-spacing:0.03em;line-height:1.5;transition:color .2s}
.c-item.done .c-text{text-decoration:line-through;color:var(--ink3)}
.chat-wrap{display:flex;flex-direction:column;height:calc(100vh - 340px);min-height:360px}
.chat-msgs{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:18px;padding:4px 0}
.msg{display:flex;gap:12px;animation:mfade .3s ease}
@keyframes mfade{from{opacity:0;transform:translateY(5px)}to{opacity:1}}
.msg.user{flex-direction:row-reverse}
.msg-av{width:30px;height:30px;border-radius:50%;border:1px solid var(--border);flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:13px;margin-top:2px;background:var(--paper2)}
.msg.user .msg-av{background:var(--gold);border-color:var(--gold);color:white;font-size:11px}
.msg-bub{max-width:74%;font-size:14px;line-height:1.85;letter-spacing:0.02em;padding:13px 17px;white-space:pre-wrap;border-radius:2px}
.msg.ai .msg-bub{background:var(--paper2);border:1px solid var(--border);color:var(--ink)}
.msg.user .msg-bub{background:white;border:1px solid var(--border2);color:var(--ink)}
.quick-qs{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.qq{padding:7px 14px;background:white;border:1px solid var(--border);color:var(--ink3);font-family:var(--sans);font-size:11px;letter-spacing:0.07em;cursor:pointer;transition:all .2s;border-radius:100px}
.qq:hover{border-color:var(--gold2);color:var(--gold);background:rgba(212,168,90,0.05)}
.chat-in{display:flex;gap:10px;margin-top:14px;padding-top:14px;border-top:1px solid var(--border)}
.chat-in input{flex:1;background:var(--paper);border:1px solid var(--border);padding:12px 15px;border-radius:2px;font-family:var(--sans);font-size:14px;font-weight:300;color:var(--ink);outline:none;transition:border-color .2s}
.chat-in input:focus{border-color:var(--gold2);background:white}
.chat-in input::placeholder{color:var(--ink3)}
.send-btn{width:44px;height:44px;background:var(--gold);border:none;cursor:pointer;color:white;border-radius:2px;display:flex;align-items:center;justify-content:center;font-size:16px;transition:background .2s;flex-shrink:0}
.send-btn:hover{background:var(--gold2)}
.send-btn:disabled{background:var(--paper3);color:var(--ink3);cursor:not-allowed}
.typing{display:flex;gap:4px;padding:4px 0}
.typing span{width:5px;height:5px;background:var(--ink3);border-radius:50%;animation:tp 1.2s infinite}
.typing span:nth-child(2){animation-delay:.2s}
.typing span:nth-child(3){animation-delay:.4s}
@keyframes tp{0%,60%,100%{transform:translateY(0)}30%{transform:translateY(-5px)}}
.share-entry{padding:22px 0;border-bottom:1px solid var(--border);font-size:13px;color:var(--ink2);line-height:2;letter-spacing:0.03em}
.share-entry:last-child{border-bottom:none}
.share-name{font-family:var(--serif);font-size:18px;letter-spacing:0.1em;color:var(--ink);margin-bottom:8px}
.hint-box{margin-top:28px;padding:20px 22px;background:var(--paper2);border:1px solid var(--border);border-radius:2px;font-size:12px;color:var(--ink3);line-height:1.9;letter-spacing:0.03em}
.hint-box strong{display:block;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);margin-bottom:8px;font-weight:400}
.empty-state{text-align:center;padding:56px 20px}
.empty-icon{font-size:30px;opacity:.18;margin-bottom:16px}
.empty-text{font-size:13px;color:var(--ink3);line-height:2.2;letter-spacing:0.06em}
@media(max-width:580px){.row2{grid-template-columns:1fr}.card{padding:24px 18px}.nav button{font-size:10px;padding:13px 3px}.photo-grid{grid-template-columns:repeat(2,1fr)}.next-card{flex-direction:column;gap:10px}.app{padding:0 16px 100px}}
`

export default function OhakaApp({ onOpenPricing }) {
  const [tab, setTab] = useState('graves')
  const [data, setData] = useState(load)
  const [form, setForm] = useState(null)
  const [editId, setEditId] = useState(null)
  const [checks, setChecks] = useState({})
  const [msgs, setMsgs] = useState([{ role: 'ai', content: 'ããã«ã¡ã¯ã\nãå¢ã»è¬åã»æ³äºã«ã¤ãã¦ã®ãç¸è«ãæ¿ãã¾ãã\nã©ãããæ°è»½ã«ãç³ãä»ããã ããã' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [lightbox, setLightbox] = useState(null)
  const [deathDate, setDeathDate] = useState('')
  const [memForm, setMemForm] = useState(null)
  const [evForm, setEvForm] = useState(null)
  const [famName, setFamName] = useState('')
  const [famRole, setFamRole] = useState('')
  const msgEnd = useRef(null)
  const photoRef = useRef(null)
  const memPhotoRef = useRef(null)

  useEffect(() => { persist(data) }, [data])
  useEffect(() => { msgEnd.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, loading])

  const sf = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const openNew = () => { setForm({ name:'',temple:'',address:'',sect:'',plot:'',phone:'',access:'',notes:'',photos:[] }); setEditId(null) }
  const openEdit = g => { setForm({ ...g, photos: g.photos||[] }); setEditId(g.id) }
  const save = () => {
    if (!form?.name) return
    if (editId) setData(d => ({ ...d, graves: d.graves.map(g => g.id===editId ? { ...form, id:editId } : g) }))
    else setData(d => ({ ...d, graves: [...d.graves, { ...form, id: Date.now().toString() }] }))
    setForm(null)
  }
  const del = id => { setData(d => ({ ...d, graves: d.graves.filter(g => g.id!==id) })); setForm(null) }

  const addPhoto = e => {
    const f2 = e.target.files?.[0]; if (!f2) return
    const r = new FileReader()
    r.onload = async ev => { const compressed = await compressImage(ev.target.result); sf('photos', [...(form.photos||[]), compressed]) }
    r.readAsDataURL(f2); e.target.value = ''
  }
  const delPhoto = i => sf('photos', (form.photos||[]).filter((_,idx) => idx!==i))

  const mapUrl = a => a ? `https://maps.google.com/maps?q=${encodeURIComponent(a)}&output=embed&z=15` : null
  const openMap = a => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(a)}`, '_blank')

  const hojiDates = deathDate ? HOJI.map(h => {
    const d = new Date(deathDate)
    if (h.days) d.setDate(d.getDate()+h.days)
    else d.setFullYear(d.getFullYear()+h.years)
    return { ...h, date: d, past: d < new Date() }
  }) : []
  const nextHoji = hojiDates.find(h => !h.past)

  const allItems = Object.entries(CHECKS).flatMap(([s,items]) => items.map((item,i) => ({ key:`${s}_${i}`, item })))
  const doneCount = allItems.filter(x => checks[x.key]).length

  const sendMsg = async text => {
    const m = text || input.trim(); if (!m || loading) return
    setInput('')
    const ctx = data.graves.length ? '\nãç»é²æ¸ã¿ãå¢ã\n' + data.graves.map(g => `ã»${g.name}ï¼${g.temple}ã${g.address}ã${g.sect}ï¼`).join('\n') : ''
    const next = [...msgs, { role:'user', content:m }]
    setMsgs(next); setLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({
          model:'claude-sonnet-4-20250514', max_tokens:1000,
          system: SYS+ctx,
          messages: next.map(x => ({ role:x.role==='ai'?'assistant':'user', content:x.content }))
        })
      })
      const j = await res.json()
      setMsgs([...next, { role:'ai', content:j.content?.map(c=>c.text||'').join('')||'ã¨ã©ã¼ãçºçãã¾ããã' }])
    } catch { setMsgs([...next, { role:'ai', content:'éä¿¡ã¨ã©ã¼ãçºçãã¾ããã' }]) }
    setLoading(false)
  }

  const qqList = ['ååä¹æ¥ã®æºå','è¬åè²»ç¨ã®ç¸å ´','æåã®è²»ç¨','å¢ãã¾ãã¨ã¯','é¦å¸è¿ãã®ããã¼','éºç£ç¸ç¶ã®æµã']

  return (
    <>
      <style>{css}</style>
      {lightbox && (
        <div className="lightbox" onClick={() => setLightbox(null)}>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>â éãã</button>
          <img src={lightbox} alt="" onClick={e => e.stopPropagation()} />
        </div>
      )}
      <div className="app">
        <div className="hdr">
          <svg className="hdr-mon" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="24" stroke="#b08840" strokeWidth="0.8"/>
            <circle cx="26" cy="26" r="17" stroke="#b08840" strokeWidth="0.5" strokeDasharray="1.5 3.5"/>
            <circle cx="26" cy="26" r="3.5" fill="#b08840" opacity="0.5"/>
            {[0,45,90,135,180,225,270,315].map(a => {
              const r1=20,r2=24,rad=a*Math.PI/180
              return <line key={a} x1={26+r1*Math.cos(rad)} y1={26+r1*Math.sin(rad)} x2={26+r2*Math.cos(rad)} y2={26+r2*Math.sin(rad)} stroke="#b08840" strokeWidth="0.7"/>
            })}
          </svg>
          <h1>å®¶ã®ãå¢å¸³</h1>
          <div className="hdr-sub">Ancestral Records & Memorial Guide</div>
          <div className="hdr-ornament"><span />â¦<span /></div>
        </div>

        <div className="nav-wrap">
          <nav className="nav">
            {[['graves','â© ãå¢'],['memories','ð· æãåº'],['hoji','â¯ æ³äº'],['kanji','ð å¹¹äº'],['family','ð¨âð©âð§ å®¶æ'],['checklist','â¡ æ®µåã'],['chat','â ç¸è«'],['mosimo','ð ããã'],['share','â å¼ç¶ã']].map(([k,l]) => (
              <button key={k} className={tab===k?'active':''} onClick={() => setTab(k)}>{l}</button>
            ))}
            <button className="pro-btn" onClick={onOpenPricing}>â¦ Pro</button>
          </nav>
        </div>

        {/* ãå¢ãªã¹ã */}
        {tab==='graves' && !form && (<>
          <div className="sec-label">Grave Records â {data.graves.length} ä»¶</div>
          <div className="card">
            {data.graves.length===0 ? (
              <div className="empty-state"><div className="empty-icon">â©</div><div className="empty-text">ã¾ã ç»é²ãããã¾ãã<br/>ä¸ã®ãã¿ã³ããè¿½å ãã¦ãã ãã</div></div>
            ) : data.graves.map(g => (
              <div className="grave-row" key={g.id} onClick={() => openEdit(g)}>
                <div className="grave-thumb">{g.photos?.[0] ? <img src={g.photos[0]} alt=""/> : <span className="grave-icon">ðª¦</span>}</div>
                <div className="grave-body">
                  <div className="grave-name">{g.name}</div>
                  <div className="grave-meta">{g.temple && <div>{g.temple}</div>}{g.address && <div>{g.address}</div>}</div>
                  <div className="tags">{g.sect && <span className="tag">{g.sect}</span>}{g.plot && <span className="tag">åºç» {g.plot}</span>}{g.photos?.length>0 && <span className="tag">åç {g.photos.length}æ</span>}</div>
                </div>
                <div className="grave-chevron">âº</div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'right'}}><button className="btn btn-solid" onClick={openNew}>ï¼ æ°è¦ç»é²</button></div>
        </>)}

        {/* ãå¢ãã©ã¼ã  */}
        {tab==='graves' && form && (<>
          <div className="sec-label">{editId?'Edit Record':'New Record'}</div>
          <div className="card">
            <div className="fg"><label>ãå¢ã®åå</label><input value={form.name||''} onChange={e=>sf('name',e.target.value)} placeholder="å±±ç°å®¶ä¹å¢"/></div>
            <div className="row2">
              <div className="fg"><label>å¯ºã»éåå</label><input value={form.temple||''} onChange={e=>sf('temple',e.target.value)} placeholder="ââå¯º"/></div>
              <div className="fg"><label>å®æ´¾</label><input value={form.sect||''} onChange={e=>sf('sect',e.target.value)} placeholder="æµåå®"/></div>
            </div>
            <div className="fg"><label>ä½æï¼å°å³è¡¨ç¤ºã«ä½¿ç¨ï¼</label><input value={form.address||''} onChange={e=>sf('address',e.target.value)} placeholder="æ±äº¬é½ââåºââ1-2-3"/></div>
            {form.address && (
              <div className="map-wrap">
                <iframe className="map-frame" src={mapUrl(form.address)} title="map" loading="lazy" allowFullScreen/>
                <div style={{marginTop:10}}><button className="btn btn-ghost" style={{fontSize:11,padding:'8px 16px'}} onClick={() => openMap(form.address)}>Google Maps ã§éã â</button></div>
              </div>
            )}
            <div className="row2" style={{marginTop:22}}>
              <div className="fg"><label>åºç»ã»çªå·</label><input value={form.plot||''} onChange={e=>sf('plot',e.target.value)} placeholder="A-12"/></div>
              <div className="fg"><label>é»è©±çªå·</label><input value={form.phone||''} onChange={e=>sf('phone',e.target.value)} placeholder="03-XXXX-XXXX"/></div>
            </div>
            <div className="fg"><label>ã¢ã¯ã»ã¹ã¡ã¢</label><textarea value={form.access||''} onChange={e=>sf('access',e.target.value)} placeholder="ââé§ããå¾æ­©10åãæ­£éå¥ãå³å´â¦"/></div>
            <div className="fg"><label>ç®¡çè²»ã»åè</label><textarea value={form.notes||''} onChange={e=>sf('notes',e.target.value)} placeholder="ç®¡çè²» å¹´5,000åï¼æ¯å¹´3æï¼â¦"/></div>
            <div className="fg">
              <label>åç</label>
              <div className="photo-grid">
                {(form.photos||[]).map((p,i) => (
                  <div className="photo-slot" key={i}><img src={p} alt="" onClick={() => setLightbox(p)}/><button className="photo-del" onClick={e=>{e.stopPropagation();delPhoto(i)}}>â</button></div>
                ))}
                <div className="photo-add" onClick={() => photoRef.current?.click()}><span style={{fontSize:20,opacity:.4}}>ï¼</span><span>åçãè¿½å </span></div>
              </div>
              <input ref={photoRef} type="file" accept="image/*" style={{display:'none'}} onChange={addPhoto}/>
            </div>
            <div className="btns">
              {editId && <button className="btn btn-danger" onClick={() => del(editId)}>åé¤</button>}
              <button className="btn btn-ghost" onClick={() => setForm(null)}>ã­ã£ã³ã»ã«</button>
              <button className="btn btn-solid" onClick={save}>ä¿å­</button>
            </div>
          </div>
        </>)}

        {/* æ³äº */}
        {tab==='hoji' && (<>
          <div className="sec-label">Memorial Schedule</div>
          <div className="card">
            <div className="fg" style={{marginBottom:0}}><label>å½æ¥</label><input type="date" value={deathDate} onChange={e=>setDeathDate(e.target.value)}/></div>
          </div>
          {nextHoji && (
            <div className="next-card">
              <div>
                <div className="next-label-sm">æ¬¡ã®æ³äº</div>
                <div className="next-name-lg">{nextHoji.label}</div>
                <div className="next-date-sm">{nextHoji.date.toLocaleDateString('ja-JP',{year:'numeric',month:'long',day:'numeric'})}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <div className="next-count">{Math.ceil((nextHoji.date-new Date())/86400000)}</div>
                <div className="next-days-unit">days</div>
              </div>
            </div>
          )}
          <div className="card">
            {hojiDates.length===0 ? (
              <div className="empty-state"><div className="empty-icon" style={{fontSize:22}}>â¯</div><div className="empty-text">å½æ¥ãå¥åããã¨<br/>æ³äºã®æ¥ç¨ãèªåã§è¡¨ç¤ºããã¾ã</div></div>
            ) : hojiDates.map(h => {
              const days = Math.ceil((h.date-new Date())/86400000)
              const isNext = nextHoji?.key===h.key
              return (
                <div key={h.key} className={`hoji-item${h.past?' done':isNext?' is-next':' upcoming'}`}>
                  <div className="h-dot-col"><div className="h-dot"/></div>
                  <div className="h-body">
                    <div className="h-name">{h.label}{h.past&&' â'}</div>
                    <div className="h-date">{h.date.toLocaleDateString('ja-JP',{year:'numeric',month:'long',day:'numeric'})}</div>
                    {!h.past && days>0 && <div className="h-countdown">ãã¨ {days} æ¥</div>}
                    {h.note && <div className="h-note">{h.note}</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </>)}

   
        {/* æãåº */}
        {tab==='memories' && !memForm && (<>
          <div className="sec-label">Memory Album â {(data.memories||[]).length} ä»¶</div>
          <div className="card">
            {(data.memories||[]).length===0 ? (
              <div className="empty-state"><div className="empty-icon">ð·</div><div className="empty-text">æäººã®æãåºãåçã»ã¨ãã½ã¼ãã§è¨é²ã§ãã¾ãã<br/>å®¶æã¿ããªã§æ¯ãè¿ããå ´æã§ãã</div></div>
            ) : (data.memories||[]).map(m => (
              <div key={m.id} style={{padding:'20px 0',borderBottom:'1px solid var(--border)',cursor:'pointer'}} onClick={()=>setMemForm(m)}>
                {m.photo && <img src={m.photo} alt="" style={{width:'100%',height:160,objectFit:'cover',borderRadius:2,marginBottom:12}}/>}
                <div style={{fontFamily:'var(--serif)',fontSize:17,letterSpacing:'0.08em',color:'var(--ink)',marginBottom:6}}>{m.title}</div>
                {m.date && <div style={{fontSize:11,color:'var(--ink3)',marginBottom:6}}>{m.date}</div>}
                {m.desc && <div style={{fontSize:13,color:'var(--ink3)',lineHeight:1.8}}>{m.desc}</div>}
              </div>
            ))}
          </div>
          <div style={{textAlign:'right'}}><button className="btn btn-solid" onClick={()=>setMemForm({title:'',date:'',desc:'',photo:''})}>ï¼ æãåºãè¿½å </button></div>
        </>)}
        {tab==='memories' && memForm && (<>
          <div className="sec-label">{memForm.id?'Edit Memory':'New Memory'}</div>
          <div className="card">
            <div className="fg"><label>ã¿ã¤ãã«</label><input value={memForm.title||''} onChange={e=>setMemForm(f=>({...f,title:e.target.value}))} placeholder="ãç¶ããã®æãåº"/></div>
            <div className="fg"><label>æ¥ä»</label><input type="date" value={memForm.date||''} onChange={e=>setMemForm(f=>({...f,date:e.target.value}))}/></div>
            <div className="fg"><label>ã¨ãã½ã¼ã</label><textarea value={memForm.desc||''} onChange={e=>setMemForm(f=>({...f,desc:e.target.value}))} placeholder="æãåºãèªç±ã«æ¸ãã¦ãã ããâ¦"/></div>
            <div className="fg">
              <label>åç</label>
              {memForm.photo ? <img src={memForm.photo} alt="" style={{width:'100%',height:160,objectFit:'cover',borderRadius:2,marginBottom:8}}/> : null}
              <button className="btn btn-ghost" style={{fontSize:11,padding:'8px 16px'}} onClick={()=>memPhotoRef.current?.click()}>åçãé¸ã¶</button>
              <input ref={memPhotoRef} type="file" accept="image/*" style={{display:'none'}} onChange={e=>{const f2=e.target.files?.[0];if(!f2)return;const r=new FileReader();r.onload=ev=>setMemForm(f=>({...f,photo:ev.target.result}));r.readAsDataURL(f2);e.target.value=''}}/>
            </div>
            <div className="btns">
              {memForm.id && <button className="btn btn-danger" onClick={()=>{setData(d=>({...d,memories:d.memories.filter(m=>m.id!==memForm.id)}));setMemForm(null)}}>åé¤</button>}
              <button className="btn btn-ghost" onClick={()=>setMemForm(null)}>ã­ã£ã³ã»ã«</button>
              <button className="btn btn-solid" onClick={()=>{if(!memForm?.title)return;if(memForm.id)setData(d=>({...d,memories:d.memories.map(m=>m.id===memForm.id?memForm:m)}));else setData(d=>({...d,memories:[...(d.memories||[]),{...memForm,id:Date.now().toString()}]}));setMemForm(null)}}>ä¿å­</button>
            </div>
          </div>
        </>)}

        {/* å¸¹äº */}
        {tab==='kanji' && !evForm && (<>
          <div className="sec-label">æ³äºã®å¸¹äº â {(data.events||[]).length} ä»¶</div>
          <div className="card">
            {(data.events||[]).length===0 ? (
              <div className="empty-state"><div className="empty-icon">ð</div><div className="empty-text">æ³äºã®æ¡åã»åºæ¬ ç®¡çãã§ãã¾ãã<br/>åå èåãã¿ããããã¨åºæ¬ ãåãæ¿ããã¾ãï¼ï¼ââââï¼ã</div></div>
            ) : (data.events||[]).map(ev => {
              const yes=(ev.attendees||[]).filter(a=>a.status==='yes').length;
              const no=(ev.attendees||[]).filter(a=>a.status==='no').length;
              return (
                <div key={ev.id} style={{padding:'18px 0',borderBottom:'1px solid var(--border)'}}>
                  <div style={{fontFamily:'var(--serif)',fontSize:16,color:'var(--ink)',marginBottom:6,cursor:'pointer'}} onClick={()=>setEvForm(ev)}>{ev.name}</div>
                  <div style={{fontSize:12,color:'var(--ink3)',marginBottom:10}}>{ev.date&&<span>{ev.date}ã</span>}{ev.place&&<span>{ev.place}</span>}</div>
                  <div>
                    {(ev.attendees||[]).map(a=>(
                      <span key={a.name} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'4px 10px',border:'1px solid var(--border)',borderRadius:100,fontSize:11,cursor:'pointer',margin:'3px 3px 0 0',...(a.status==='yes'?{background:'rgba(138,104,48,0.08)',borderColor:'var(--gold2)',color:'var(--gold)'}:a.status==='no'?{background:'rgba(160,60,60,0.06)',borderColor:'rgba(160,60,60,0.3)',color:'#a03c3c'}:{})}} onClick={()=>setData(d=>({...d,events:d.events.map(e=>{if(e.id!==ev.id)return e;const cur=(e.attendees||[]).find(a2=>a2.name===a.name);const nxt=cur?(cur.status==='?'?'yes':cur.status==='yes'?'no':'?'):'?';return{...e,attendees:[...(e.attendees||[]).filter(a2=>a2.name!==a.name),{name:a.name,status:nxt}]};})}))}>{a.status==='yes'?'â':a.status==='no'?'â':'ï¼'} {a.name}</span>
                    ))}
                  </div>
                  <div style={{fontSize:11,color:'var(--ink3)',marginTop:8}}>åå  {yes}å / ä¸åå  {no}å / æªåç­ {(ev.attendees||[]).length-yes-no}å</div>
                  <input style={{marginTop:10,flex:1,padding:'8px 12px',border:'1px solid var(--border)',borderRadius:2,fontSize:13,fontFamily:'var(--sans)',background:'var(--paper)',outline:'none',width:'100%'}} placeholder="åå èãè¿½å  (Enterã­ã¼)" onKeyDown={e=>{if(e.key==='Enter'&&e.target.value.trim()){setData(d=>({...d,events:d.events.map(ev2=>ev2.id===ev.id?{...ev2,attendees:[...(ev2.attendees||[]),{name:e.target.value.trim(),status:'?'}]}:ev2)}));e.target.value=''}}}/>
                </div>
              );
            })}
          </div>
          <div style={{textAlign:'right'}}><button className="btn btn-solid" onClick={()=>setEvForm({name:'',date:'',place:'',notes:''})}>ï¼ æ³äºãè¿½å </button></div>
        </>)}
        {tab==='kanji' && evForm && (<>
          <div className="sec-label">{evForm.id?'Edit Event':'New Event'}</div>
          <div className="card">
            <div className="fg"><label>æ³äºå</label><input value={evForm.name||''} onChange={e=>setEvForm(f=>({...f,name:e.target.value}))} placeholder="ååä¹æ¥æ³è¦"/></div>
            <div className="row2">
              <div className="fg"><label>æ¥ä»</label><input type="date" value={evForm.date||''} onChange={e=>setEvForm(f=>({...f,date:e.target.value}))}/></div>
              <div className="fg"><label>å ´æ</label><input value={evForm.place||''} onChange={e=>setEvForm(f=>({...f,place:e.target.value}))} placeholder="ââå¯º"/></div>
            </div>
            <div className="fg"><label>ã¡ã¢</label><textarea value={evForm.notes||''} onChange={e=>setEvForm(f=>({...f,notes:e.target.value}))} placeholder="æã¡ç©ã»é£çµ¡äºé ãªã©â¦"/></div>
            <div className="btns">
              {evForm.id && <button className="btn btn-danger" onClick={()=>{setData(d=>({...d,events:d.events.filter(e=>e.id!==evForm.id)}));setEvForm(null)}}>åé¤</button>}
              <button className="btn btn-ghost" onClick={()=>setEvForm(null)}>ã­ã£ã³ã»ã«</button>
              <button className="btn btn-solid" onClick={()=>{if(!evForm?.name)return;if(evForm.id)setData(d=>({...d,events:d.events.map(e=>e.id===evForm.id?evForm:e)}));else setData(d=>({...d,events:[...(d.events||[]),{...evForm,id:Date.now().toString(),attendees:[]}]}));setEvForm(null)}}>ä¿å­</button>
            </div>
          </div>
        </>)}

        {/* å®¶æ */}
        {tab==='family' && (<>
          <div className="sec-label">Family Group â {(data.family||[]).length} äºº</div>
          <div className="card">
            <div style={{fontSize:13,color:'var(--ink3)',marginBottom:20,lineHeight:1.8}}>ð¨âð©âð§ å®¶æãç»é²ãã¦ããã¨ããå¢ã®å¼ãç¶ããæ³äºã®é£çµ¡ãã¹ã ã¼ãºã«ãªãã¾ãã</div>
            {(data.family||[]).map(f=>(
              <div key={f.id} style={{display:'flex',alignItems:'center',gap:14,padding:'14px 0',borderBottom:'1px solid var(--border)'}}>
                <div style={{width:40,height:40,borderRadius:'50%',background:'var(--paper2)',border:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0}}>ð¤</div>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'var(--serif)',fontSize:16,letterSpacing:'0.06em',color:'var(--ink)'}}>{f.name}</div>
                  {f.role && <div style={{fontSize:11,color:'var(--ink3)',marginTop:2}}>{f.role}</div>}
                </div>
                <button className="btn btn-ghost" style={{fontSize:11,padding:'6px 12px'}} onClick={()=>setData(d=>({...d,family:d.family.filter(f2=>f2.id!==f.id)}))}>åé¤</button>
              </div>
            ))}
            <div style={{marginTop:20,display:'flex',gap:10,flexWrap:'wrap'}}>
              <input style={{flex:2,minWidth:120,padding:'11px 15px',border:'1px solid var(--border)',borderRadius:2,fontSize:14,fontFamily:'var(--sans)',background:'var(--paper)',outline:'none'}} placeholder="åå" value={famName} onChange={e=>setFamName(e.target.value)}/>
              <input style={{flex:1,minWidth:80,padding:'11px 15px',border:'1px solid var(--border)',borderRadius:2,fontSize:14,fontFamily:'var(--sans)',background:'var(--paper)',outline:'none'}} placeholder="ç¶æ" value={famRole} onChange={e=>setFamRole(e.target.value)}/>
              <button className="btn btn-solid" onClick={()=>{if(!famName.trim())return;setData(d=>({...d,family:[...(d.family||[]),{id:Date.now().toString(),name:famName.trim(),role:famRole.trim()}]}));setFamName('');setFamRole('')}}>è¿½å </button>
            </div>
          </div>
        </>)}

             {/* ãã§ãã¯ãªã¹ã */}
        {tab==='checklist' && (<>
          <div className="sec-label">Funeral Checklist</div>
          <div className="progress-info"><span className="progress-title">é²æ</span><span className="progress-count">{doneCount} / {allItems.length}</span></div>
          <div className="prog-bar"><div className="prog-fill" style={{width:`${allItems.length?doneCount/allItems.length*100:0}%`}}/></div>
          <div className="card">
            {Object.entries(CHECKS).map(([section,items]) => (
              <div className="check-group" key={section}>
                <div className="check-group-title">{section}</div>
                {items.map((item,i) => {
                  const key=`${section}_${i}`
                  return (
                    <div key={key} className={`c-item${checks[key]?' done':''}`} onClick={() => setChecks(c=>({...c,[key]:!c[key]}))}>
                      <div className={`c-box${checks[key]?' done':''}`}/>
                      <span className="c-text">{item}</span>
                    </div>
                  )
                })}
              </div>
            ))}
            <div style={{textAlign:'right',marginTop:4}}><button className="btn btn-ghost" style={{fontSize:11,padding:'8px 16px'}} onClick={() => setChecks({})}>ãªã»ãã</button></div>
          </div>
        </>)}

        {/* AIãã£ãã */}
        {tab==='chat' && (<>
          <div className="sec-label">Consultation</div>
          <div className="card">
            <div className="quick-qs">{qqList.map(q => <button key={q} className="qq" onClick={() => sendMsg(q)}>{q}</button>)}</div>
            <div className="chat-wrap">
              <div className="chat-msgs">
                {msgs.map((m,i) => (
                  <div key={i} className={`msg ${m.role}`}>
                    <div className="msg-av">{m.role==='ai'?'â¦':'ç§'}</div>
                    <div className="msg-bub">{m.content}</div>
                  </div>
                ))}
                {loading && <div className="msg ai"><div className="msg-av">â¦</div><div className="msg-bub"><div className="typing"><span/><span/><span/></div></div></div>}
                <div ref={msgEnd}/>
              </div>
              <div className="chat-in">
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&sendMsg()} placeholder="ãè³ªåããå¥åãã ãã" disabled={loading}/>
                <button className="send-btn" onClick={() => sendMsg()} disabled={loading||!input.trim()}>âº</button>
              </div>
            </div>
          </div>
        </>)}

        {/* å¼ãç¶ã */}
        {/* ããããã¼ã */}
        {tab==='mosimo' && (<>
          <div style={{fontFamily:'var(--serif)',fontSize:22,fontWeight:500,letterSpacing:'0.15em',color:'var(--ink)',textAlign:'center',marginBottom:8}}>ããããã¼ã</div>
          <div style={{fontSize:12,color:'var(--ink3)',textAlign:'center',letterSpacing:'0.06em',marginBottom:32,lineHeight:1.8}}>ä¸ãä¸ã®æãå®¶æãè¿·ããªãããã«ã<br/>ä»æ¥æ¸ãã¦ãããã¨ããå®¶æã¸ã®æå¤§ã®è´ãç©ã§ãã</div>
          <div style={{background:'white',border:'1px solid var(--border)',borderRadius:3,padding:28,marginBottom:16,position:'relative'}}>
            <div style={{position:'absolute',top:0,left:24,right:24,height:1,background:'linear-gradient(90deg,transparent,var(--gold3),transparent)',opacity:.5}}/>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <span style={{fontFamily:'var(--serif)',fontSize:16,letterSpacing:'0.1em',color:'var(--ink)'}}>ç§ã«ã¤ãã¦</span>
            </div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>è¡æ¶²å</label><input value={(data.mosimo?.["about"]?.["bloodtype"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["about"]:{...(d.mosimo?.["about"]||{}),["bloodtype"]:e.target.value}}}))} placeholder={"Aå"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>ãããã¤ãå»</label><input value={(data.mosimo?.["about"]?.["doctor"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["about"]:{...(d.mosimo?.["about"]||{}),["doctor"]:e.target.value}}}))} placeholder={"ââã¯ãªããã¯"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>æç¨ä¸­ã®è¬</label><input value={(data.mosimo?.["about"]?.["medicine"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["about"]:{...(d.mosimo?.["about"]||{}),["medicine"]:e.target.value}}}))} placeholder={"ââè¬"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>ã¢ã¬ã«ã®ã¼</label><input value={(data.mosimo?.["about"]?.["allergy"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["about"]:{...(d.mosimo?.["about"]||{}),["allergy"]:e.target.value}}}))} placeholder={"ããã·ãªã³ç³»â¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
          </div>
          <div style={{background:'white',border:'1px solid var(--border)',borderRadius:3,padding:28,marginBottom:16,position:'relative'}}>
            <div style={{position:'absolute',top:0,left:24,right:24,height:1,background:'linear-gradient(90deg,transparent,var(--gold3),transparent)',opacity:.5}}/>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <span style={{fontFamily:'var(--serif)',fontSize:16,letterSpacing:'0.1em',color:'var(--ink)'}}>è¬åã®å¸æ</span>
            </div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>å½¢å¼</label><input value={(data.mosimo?.["funeral"]?.["style"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["funeral"]:{...(d.mosimo?.["funeral"]||{}),["style"]:e.target.value}}}))} placeholder={"å®¶æ´¼è¬ãç´è¬â¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>å¸æå ´æ</label><input value={(data.mosimo?.["funeral"]?.["place"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["funeral"]:{...(d.mosimo?.["funeral"]||{}),["place"]:e.target.value}}}))} placeholder={"ââå¯ºâ¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>å¼ãã§ã»ããäºº</label><input value={(data.mosimo?.["funeral"]?.["invite"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["funeral"]:{...(d.mosimo?.["funeral"]||{}),["invite"]:e.target.value}}}))} placeholder={"å®¶æã®ã¿â¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>ãã®ä»å¸æ</label><input value={(data.mosimo?.["funeral"]?.["wishes"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["funeral"]:{...(d.mosimo?.["funeral"]||{}),["wishes"]:e.target.value}}}))} placeholder={"æ´¾æãªãã¨ã¯ä¸è¦â¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
          </div>
          <div style={{background:'white',border:'1px solid var(--border)',borderRadius:3,padding:28,marginBottom:16,position:'relative'}}>
            <div style={{position:'absolute',top:0,left:24,right:24,height:1,background:'linear-gradient(90deg,transparent,var(--gold3),transparent)',opacity:.5}}/>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <span style={{fontFamily:'var(--serif)',fontSize:16,letterSpacing:'0.1em',color:'var(--ink)'}}>è²¡ç£ã»ä¿é©</span>
            </div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>éè¡å£åº§</label><input value={(data.mosimo?.["asset"]?.["bank"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["asset"]:{...(d.mosimo?.["asset"]||{}),["bank"]:e.target.value}}}))} placeholder={"ââéè¡ (çªå·ã¯æ¸ããªã)"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>çå½ä¿éº</label><input value={(data.mosimo?.["asset"]?.["insurance"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["asset"]:{...(d.mosimo?.["asset"]||{}),["insurance"]:e.target.value}}}))} placeholder={"ââçå½"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>å¹´éã»è²¡å½¢</label><input value={(data.mosimo?.["asset"]?.["pension"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["asset"]:{...(d.mosimo?.["asset"]||{}),["pension"]:e.target.value}}}))} placeholder={"åçå¹´éãiDeCoâ¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>ä¸åç£</label><input value={(data.mosimo?.["asset"]?.["realstate"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["asset"]:{...(d.mosimo?.["asset"]||{}),["realstate"]:e.target.value}}}))} placeholder={"èªå®ãåå°â¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
          </div>
          <div style={{background:'white',border:'1px solid var(--border)',borderRadius:3,padding:28,marginBottom:16,position:'relative'}}>
            <div style={{position:'absolute',top:0,left:24,right:24,height:1,background:'linear-gradient(90deg,transparent,var(--gold3),transparent)',opacity:.5}}/>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <span style={{fontFamily:'var(--serif)',fontSize:16,letterSpacing:'0.1em',color:'var(--ink)'}}>ç·æ¥é£çµ¡å</span>
            </div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>æåã«é£çµ¡ããäºº</label><input value={(data.mosimo?.["contacts"]?.["c1"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["contacts"]:{...(d.mosimo?.["contacts"]||{}),["c1"]:e.target.value}}}))} placeholder={"ååï¼ç¶æï¼090-XXXX"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>2çªç®ã«é£çµ¡ããäºº</label><input value={(data.mosimo?.["contacts"]?.["c2"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["contacts"]:{...(d.mosimo?.["contacts"]||{}),["c2"]:e.target.value}}}))} placeholder={"ååï¼ç¶æï¼090-XXXX"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>å¼è­·å£«ã»å²å£«</label><input value={(data.mosimo?.["contacts"]?.["lawyer"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["contacts"]:{...(d.mosimo?.["contacts"]||{}),["lawyer"]:e.target.value}}}))} placeholder={"ââæ³å¾äºåæ"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>è©æå¯º</label><input value={(data.mosimo?.["contacts"]?.["temple"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["contacts"]:{...(d.mosimo?.["contacts"]||{}),["temple"]:e.target.value}}}))} placeholder={"ââå¯º ä¹èª å±±â¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
          </div>
          <div style={{background:'white',border:'1px solid var(--border)',borderRadius:3,padding:28,marginBottom:16,position:'relative'}}>
            <div style={{position:'absolute',top:0,left:24,right:24,height:1,background:'linear-gradient(90deg,transparent,var(--gold3),transparent)',opacity:.5}}/>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <span style={{fontFamily:'var(--serif)',fontSize:16,letterSpacing:'0.1em',color:'var(--ink)'}}>ãã¸ã¿ã«è³ç£</span>
            </div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>ã¡ã¤ã³ã¡ã¼ã«</label><input value={(data.mosimo?.["digital"]?.["email"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["digital"]:{...(d.mosimo?.["digital"]||{}),["email"]:e.target.value}}}))} placeholder={"xxxx@gmail.com (ãã¹ã¯ã¼ãã¯æ¸ããªã)"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>SNSã¢ã«ã¦ã³ã</label><input value={(data.mosimo?.["digital"]?.["sns"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["digital"]:{...(d.mosimo?.["digital"]||{}),["sns"]:e.target.value}}}))} placeholder={"ã¡ã¢ãªã¢ã«åå¸æã®ã¢ã«ã¦ã³ã"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>ãµãã¹ã¯</label><input value={(data.mosimo?.["digital"]?.["sub"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["digital"]:{...(d.mosimo?.["digital"]||{}),["sub"]:e.target.value}}}))} placeholder={"Netflix, Amazon Primeâ¦ (è§£ç´ä¾é ¼)"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>æè³ã»ä»®æ³éè²¨</label><input value={(data.mosimo?.["digital"]?.["crypto"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["digital"]:{...(d.mosimo?.["digital"]||{}),["crypto"]:e.target.value}}}))} placeholder={"ââè¨¼å¸â¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
          </div>
          <div style={{background:'white',border:'1px solid var(--border)',borderRadius:3,padding:28,marginBottom:16,position:'relative'}}>
            <div style={{position:'absolute',top:0,left:24,right:24,height:1,background:'linear-gradient(90deg,transparent,var(--gold3),transparent)',opacity:.5}}/>
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}>
              <span style={{fontFamily:'var(--serif)',fontSize:16,letterSpacing:'0.1em',color:'var(--ink)'}}>å®¶æã¸ã®ã¡ãã»ã¼ã¸</span>
            </div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>å®¶æã¸</label><textarea value={(data.mosimo?.["message"]?.["letter"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["message"]:{...(d.mosimo?.["message"]||{}),["letter"]:e.target.value}}}))} placeholder={"ããã«è¨èãâ¦ãå®¶æã®å®ç©ã«ãªãã¾ãã"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none',resize:'vertical',minHeight:100,lineHeight:1.8}}/></div>
            <div style={{marginBottom:16}}><label style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8}}>ãããã»å®¶ã®å¼ãç¶ã</label><input value={(data.mosimo?.["message"]?.["pet"])||''} onChange={e=>setData(d=>({...d,mosimo:{...d.mosimo,["message"]:{...(d.mosimo?.["message"]||{}),["pet"]:e.target.value}}}))} placeholder={"ç¬ã®ååã¯â¦"} style={{width:'100%',background:'var(--paper)',border:'1px solid var(--border)',borderRadius:2,padding:'12px 15px',fontFamily:'var(--sans)',fontSize:14,fontWeight:300,color:'var(--ink)',outline:'none'}}/></div>
          </div>
          <div style={{background:'linear-gradient(135deg,var(--paper2),var(--paper3))',border:'1px solid var(--border2)',borderRadius:2,padding:'20px 24px',marginTop:8,fontSize:12,color:'var(--ink3)',lineHeight:1.9,letterSpacing:'0.04em'}}>
            <strong style={{display:'block',fontSize:10,letterSpacing:'0.18em',textTransform:'uppercase',color:'var(--gold)',marginBottom:8,fontWeight:400}}>ãã©ã¤ãã·ã¼ã«ã¤ãã¦</strong>
            ãã¹ã¯ã¼ããæè¨¼çªå·ã¯çµ¶å¯¾ã«æ¸ããªãã§ãã ããããã®ãã¼ãã¯å°å·ï¼Ctrl+Pï¼ãã¦ã¨ã³ãã£ã³ã°ãã¼ãã¨ä¸ç·ã«ä¿ç®¡ãããã¨ããå§ããã¾ãã
          </div>
          <div style={{textAlign:'right',marginTop:16}}><button className="btn btn-solid" onClick={()=>{persist(data);alert('ä¿å­ãã¾ãã')}}>ä¿å­ãã</button></div>
        </>)}

        {tab==='share' && (<>
          <div className="sec-label">Family Handover</div>
          <div className="card">
            <div className="fg"><label>ãå®¶æã¸ã®ã¡ãã»ã¼ã¸</label><textarea style={{minHeight:140}} value={data.notes||''} onChange={e=>setData({...data,notes:e.target.value})} placeholder={'ãã®ãå¢å¸³ããå¼ãç¶ãã«ãªãæ¹ã¸ã\nââå¯ºã®ãä½è·ã«ã¯æ¯å¹´âæã«ãæ¨æ¶ãã\nç®¡çè²»ã¯å£åº§å¼è½ã«ã¦æ¯å¹´3æã«å¦çããã¾ãã'}/></div>
            {data.graves.length>0 && (<>
              <div style={{borderTop:'1px solid var(--border)',margin:'8px 0 24px'}}/>
              {data.graves.map(g => (
                <div className="share-entry" key={g.id}>
                  <div className="share-name">{g.name}</div>
                  {g.temple && <div>å¯ºé¢ã{g.temple}</div>}
                  {g.sect && <div>å®æ´¾ã{g.sect}</div>}
                  {g.address && <div>æå¨ã{g.address}</div>}
                  {g.plot && <div>åºç»ã{g.plot}</div>}
                  {g.phone && <div>é£çµ¡åã{g.phone}</div>}
                  {g.access && <div style={{marginTop:8,color:'var(--ink3)'}}>{g.access}</div>}
                  {g.address && <div style={{marginTop:12}}><button className="btn btn-ghost" style={{fontSize:11,padding:'8px 16px'}} onClick={() => openMap(g.address)}>å°å³ãéã â</button></div>}
                </div>
              ))}
            </>)}
            <div className="hint-box"><strong>å°å·ã»ä¿å­ã«ã¤ãã¦</strong>ãã©ã¦ã¶ã®å°å·æ©è½ï¼Ctrl+Pï¼ã§PDFã¨ãã¦ä¿å­ããã¨ã³ãã£ã³ã°ãã¼ããéåº«ã«ä¿ç®¡ãããã¨ããå§ããã¾ãã</div>
            <div className="btns"><button className="btn btn-solid" onClick={() => { persist(data); alert('ä¿å­ãã¾ãã') }}>ä¿å­ãã</button></div>
          </div>
        </>)}
      </div>
    </>
  )
}
