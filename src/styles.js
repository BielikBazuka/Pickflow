const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

:root {
  --asml-blue:#0080c9;
  --asml-blue-dark:#005fa3;
  --asml-blue-light:#e6f3fb;
  --asml-blue-mid:#3da5d9;
  --bg:#f4f6f9;
  --bg-white:#ffffff;
  --panel:#ffffff;
  --border:#d0dae6;
  --border-dark:#a8bdd0;
  --text:#1a2533;
  --text-mid:#4a6080;
  --text-dim:#7a95b0;
  --ok:#00875a;
  --ok-bg:#e3fcef;
  --warn:#de350b;
  --warn-bg:#ffebe6;
  --warn-mid:#ff8b00;
  --warn-mid-bg:#fffae6;
  --accent:#0080c9;
  --font:'Inter',sans-serif;
  --font-mono:'JetBrains Mono',monospace;
  --radius:6px;
  --shadow:0 1px 4px rgba(0,40,80,0.10),0 0 0 1px rgba(0,40,80,0.05);
  --shadow-lg:0 4px 16px rgba(0,40,80,0.12),0 0 0 1px rgba(0,40,80,0.06);
}

body{background:var(--bg);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.5;-webkit-font-smoothing:antialiased}

/* ── Layout ── */
.layout{display:flex;min-height:100vh}
.sidebar{width:240px;flex-shrink:0;background:var(--asml-blue-dark);display:flex;flex-direction:column;position:sticky;top:0;height:100vh;overflow-y:auto}
.main{flex:1;overflow:auto;min-width:0}

/* ── Sidebar ── */
.sidebar-logo{padding:24px 20px 20px;border-bottom:1px solid rgba(255,255,255,0.12)}
.sidebar-wordmark{font-size:20px;font-weight:700;letter-spacing:1px;color:#fff;line-height:1}
.sidebar-sub{font-size:10px;font-weight:500;letter-spacing:2px;color:rgba(255,255,255,0.5);margin-top:5px;text-transform:uppercase}
.sidebar-nav{padding:12px 0;flex:1}
.nav-section{padding:8px 20px 4px;font-size:9px;font-weight:600;letter-spacing:2px;color:rgba(255,255,255,0.35);text-transform:uppercase}
.nav-item{display:flex;align-items:center;gap:10px;padding:9px 20px;cursor:pointer;font-size:13px;font-weight:500;color:rgba(255,255,255,0.7);transition:all .15s;border-left:3px solid transparent;user-select:none}
.nav-item:hover{background:rgba(255,255,255,0.08);color:#fff}
.nav-item.active{background:rgba(255,255,255,0.12);color:#fff;border-left-color:#fff}
.nav-icon{font-size:15px;opacity:.8;width:18px;text-align:center}
.sidebar-footer{padding:16px 20px;border-top:1px solid rgba(255,255,255,0.12);font-size:10px;color:rgba(255,255,255,0.35);line-height:1.8}

/* ── Topbar ── */
.topbar{background:var(--bg-white);border-bottom:1px solid var(--border);padding:0 28px;height:56px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
.topbar-title{font-size:16px;font-weight:600;color:var(--text)}
.topbar-right{display:flex;align-items:center;gap:16px}
.status-pill{display:flex;align-items:center;gap:6px;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:500;background:var(--ok-bg);color:var(--ok)}
.status-dot{width:6px;height:6px;border-radius:50%;background:currentColor}
.topbar-time{font-family:var(--font-mono);font-size:12px;color:var(--text-dim)}

/* ── Content ── */
.content{padding:24px 28px 48px}

/* ── Cards ── */
.card{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.card-header{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px}
.card-title{font-size:12px;font-weight:600;letter-spacing:.5px;color:var(--text);text-transform:uppercase}
.card-title-sub{font-size:11px;color:var(--text-dim);font-weight:400;margin-top:1px}
.card-body{padding:20px}
.card-accent{border-top:2px solid var(--asml-blue)}

/* ── KPI strip ── */
.kpi-strip{display:grid;grid-template-columns:repeat(5,1fr);gap:12px;margin-bottom:20px}
.kpi{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);padding:16px 18px;border-top:3px solid var(--border);box-shadow:var(--shadow)}
.kpi-label{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-dim);margin-bottom:6px}
.kpi-value{font-size:26px;font-weight:700;line-height:1;color:var(--text)}
.kpi-sub{font-size:11px;color:var(--text-dim);margin-top:4px}

/* ── Sections ── */
.section{margin-bottom:20px}
.section-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}
.section-label{font-size:11px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-mid);display:flex;align-items:center;gap:8px}
.section-label::before{content:'';display:inline-block;width:3px;height:14px;background:var(--asml-blue);border-radius:2px}

/* ── Storage rows ── */
.storage-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.storage-row{display:flex;align-items:center;gap:10px;padding:8px 12px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);transition:border-color .15s}
.storage-row:focus-within{border-color:var(--asml-blue)}
.s-color{width:10px;height:10px;border-radius:2px;flex-shrink:0}
.s-name-input{flex:1;min-width:0;background:transparent;border:none;outline:none;font-family:var(--font);font-size:13px;font-weight:500;color:var(--text)}
.s-cap-input{width:72px;text-align:right;background:var(--bg-white);border:1px solid var(--border);border-radius:4px;padding:3px 6px;font-family:var(--font-mono);font-size:12px;color:var(--text);outline:none;transition:border-color .15s}
.s-cap-input:focus{border-color:var(--asml-blue)}
.s-unit{font-size:10px;color:var(--text-dim);white-space:nowrap}

/* ── Matrix table ── */
.matrix-table{width:100%;border-collapse:collapse}
.matrix-table th{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-dim);text-align:left;padding:8px 10px;border-bottom:2px solid var(--border);white-space:nowrap;background:var(--bg)}
.matrix-table th.storage-th{text-align:right;border-bottom-color:var(--asml-blue)}
.matrix-table td{padding:6px 10px;border-bottom:1px solid var(--border);vertical-align:middle}
.matrix-table tr:last-child td{border-bottom:none}
.matrix-table tr:hover td{background:var(--asml-blue-light)}
.machine-cell{display:flex;align-items:center;gap:10px}
.m-icon{font-size:16px;width:22px;text-align:center}
.m-name-input{font-family:var(--font);font-size:13px;font-weight:600;background:transparent;border:none;border-bottom:1px solid transparent;outline:none;color:inherit;min-width:0;width:90px;transition:border-color .15s;cursor:text}
.m-name-input:focus{border-bottom-color:var(--asml-blue)}
.picks-input{width:90px;text-align:right;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text);outline:none;transition:border-color .15s,background .15s;display:block}
.picks-input:focus{border-color:var(--asml-blue);background:#fff}
.picks-input.has-val{background:#fff;border-color:var(--border-dark)}
.total-col{text-align:right}
.total-num{font-family:var(--font-mono);font-size:13px;font-weight:600;color:var(--asml-blue)}
.mini-bar{height:4px;background:var(--asml-blue);border-radius:2px;margin-top:4px;transition:width .3s}
.baseline-input{width:90px;text-align:right;background:var(--bg);border:1px solid var(--border);border-radius:4px;padding:4px 8px;font-family:var(--font-mono);font-size:12px;color:var(--text);outline:none;transition:border-color .15s;display:block}
.baseline-input:focus{border-color:var(--warn-mid);background:#fff}

/* ── Machine starts ── */
.starts-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.start-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.start-card-header{padding:9px 14px;display:flex;align-items:center;gap:8px;border-bottom:1px solid var(--border);border-left:3px solid transparent}
.start-card-label{font-size:12px;font-weight:600}
.month-row{display:grid;grid-template-columns:repeat(12,1fr);gap:3px;padding:10px 12px}
.m-cell{display:flex;flex-direction:column;align-items:center;gap:2px}
.m-label{font-size:8px;font-weight:500;letter-spacing:.5px;text-transform:uppercase;color:var(--text-dim)}
.m-input{width:100%;text-align:center;background:var(--bg-white);border:1px solid var(--border);border-radius:3px;padding:3px 1px;font-family:var(--font-mono);font-size:12px;color:var(--text);outline:none;transition:border-color .15s,box-shadow .15s}
.m-input:focus{border-color:var(--asml-blue);box-shadow:0 0 0 2px var(--asml-blue-light)}
.m-input.has-val{font-weight:600}

/* ── Distribution ── */
.dist-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.dist-card{background:var(--bg);border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.dist-card-header{padding:9px 14px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:8px;border-left:3px solid transparent}
.dist-row{display:flex;align-items:center;gap:8px;padding:5px 14px}
.dist-label{font-size:11px;color:var(--text-dim);width:64px;flex-shrink:0;font-family:var(--font-mono)}
.dist-track{flex:1;height:6px;background:var(--border);border-radius:3px;overflow:hidden}
.dist-fill{height:100%;border-radius:3px;transition:width .3s}
.dist-input{width:52px;text-align:center;background:var(--bg-white);border:1px solid var(--border);border-radius:3px;padding:3px 4px;font-family:var(--font-mono);font-size:11px;color:var(--text);outline:none}
.dist-input:focus{border-color:var(--asml-blue)}
.dist-sum{font-size:11px;font-weight:600;font-family:var(--font-mono)}

/* ── Buttons ── */
.btn{display:inline-flex;align-items:center;gap:6px;cursor:pointer;font-family:var(--font);font-weight:500;border-radius:4px;transition:all .15s;border:1px solid transparent;font-size:12px;padding:6px 14px}
.btn-primary{background:var(--asml-blue);color:#fff;border-color:var(--asml-blue)}
.btn-primary:hover{background:var(--asml-blue-dark)}
.btn-outline{background:transparent;color:var(--asml-blue);border-color:var(--asml-blue)}
.btn-outline:hover{background:var(--asml-blue-light)}
.btn-ghost{background:transparent;color:var(--text-dim);border-color:var(--border)}
.btn-ghost:hover{background:var(--bg);color:var(--text)}
.btn-danger{background:transparent;color:var(--warn);border-color:rgba(222,53,11,.3)}
.btn-danger:hover{background:var(--warn-bg)}
.btn-del{background:none;border:none;color:var(--text-dim);cursor:pointer;padding:2px 5px;border-radius:3px;font-size:13px;transition:color .15s}
.btn-del:hover{color:var(--warn)}
.run-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;max-width:320px;margin:28px auto;background:var(--asml-blue);color:#fff;font-family:var(--font);font-size:14px;font-weight:600;padding:13px 32px;border:none;border-radius:var(--radius);cursor:pointer;letter-spacing:.5px;box-shadow:0 2px 8px rgba(0,128,201,.3);transition:all .2s}
.run-btn:hover{background:var(--asml-blue-dark);box-shadow:0 4px 16px rgba(0,128,201,.4);transform:translateY(-1px)}

/* ── Simulation ── */
.timeline-card{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);margin-bottom:20px;overflow:hidden}
.tl-controls{padding:12px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;gap:14px;flex-wrap:wrap;background:var(--bg)}
.ctrl-group{display:flex;align-items:center;gap:6px}
.ctrl-label{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-dim)}
.view-btns{display:flex;border:1px solid var(--border);border-radius:4px;overflow:hidden}
.vbtn{font-size:11px;padding:4px 10px;border:none;background:transparent;cursor:pointer;color:var(--text-dim);transition:all .15s;font-weight:500}
.vbtn.active{background:var(--asml-blue);color:#fff}
.vbtn:hover:not(.active){background:var(--asml-blue-light);color:var(--asml-blue)}
.month-pills{display:flex;gap:3px;flex-wrap:wrap}
.mpill{font-size:10px;padding:3px 7px;border-radius:12px;border:1px solid var(--border);background:transparent;cursor:pointer;color:var(--text-dim);transition:all .15s;font-weight:500}
.mpill.active{background:var(--asml-blue);color:#fff;border-color:var(--asml-blue)}
.mpill:hover:not(.active){border-color:var(--asml-blue);color:var(--asml-blue)}
.day-slider{accent-color:var(--asml-blue);flex:1;min-width:140px}
.day-display{font-family:var(--font-mono);font-size:12px;color:var(--asml-blue);font-weight:500;min-width:90px}

/* ── Bar chart ── */
.chart-wrap{padding:16px 20px;overflow:auto}
.bar-area{display:flex;align-items:flex-end;gap:1px;height:200px;position:relative;cursor:crosshair}
.b-wrap{flex:1;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;height:100%;cursor:pointer;position:relative}
.b-wrap:hover .b-segment{filter:brightness(1.1)}
.b-wrap.sel .b-segment{filter:brightness(1.18)}
.b-wrap.sel::after{content:'';position:absolute;inset:0;border:1px solid rgba(0,128,201,.6);border-radius:1px;pointer-events:none}
.b-segment{width:100%;min-height:1px;border-radius:1px 1px 0 0}
.b-baseline{width:100%;min-height:1px;border-radius:1px 1px 0 0;background:repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(0,0,0,.15) 2px,rgba(0,0,0,.15) 4px)}
.b-carry{width:100%;min-height:1px;border-radius:1px 1px 0 0;background:repeating-linear-gradient(-45deg,transparent,transparent 2px,rgba(255,255,255,.25) 2px,rgba(255,255,255,.25) 4px)}
.cap-line{position:absolute;left:0;right:0;border-top:1.5px dashed #de350b;z-index:3;pointer-events:none}
.cap-label{position:absolute;right:0;top:-16px;font-size:9px;font-weight:600;color:#de350b;font-family:var(--font-mono)}
.grid-line{position:absolute;left:0;right:0;border-top:1px solid var(--border)}
.grid-label{position:absolute;left:0;top:-9px;font-size:9px;color:var(--text-dim);font-family:var(--font-mono)}

/* ── Heatmap ── */
.heatmap-wrap{overflow:auto;padding:12px 20px 16px}
.hm-grid{display:grid;grid-template-columns:80px repeat(53,13px);gap:2px;align-items:center}
.hm-cell{width:13px;height:13px;border-radius:2px;cursor:pointer;transition:transform .1s}
.hm-cell:hover{transform:scale(1.6);z-index:10;position:relative}
.hm-row-label{font-family:var(--font-mono);font-size:9px;color:var(--text-dim);text-align:right;padding-right:6px}
.hm-week-label{font-family:var(--font-mono);font-size:8px;color:var(--text-dim);text-align:center}

/* ── Legend ── */
.legend{display:flex;gap:12px;flex-wrap:wrap;padding:10px 20px;border-top:1px solid var(--border);background:var(--bg)}
.leg-item{display:flex;align-items:center;gap:5px;font-size:10px;color:var(--text-mid);font-weight:500}
.leg-dot{width:8px;height:8px;border-radius:2px;flex-shrink:0}
.leg-line{width:16px;height:2px;flex-shrink:0}
.leg-hat{width:14px;height:8px;background:repeating-linear-gradient(45deg,transparent,transparent 2px,rgba(0,0,0,.25) 2px,rgba(0,0,0,.25) 4px);border-radius:1px;flex-shrink:0}

/* ── Day detail ── */
.day-detail{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid var(--border)}
.detail-col{padding:16px 20px}
.detail-col+.detail-col{border-left:1px solid var(--border)}
.detail-title{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-dim);margin-bottom:12px}
.util-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.util-label{font-size:11px;font-weight:500;width:80px;flex-shrink:0;color:var(--text)}
.util-track{flex:1;height:10px;background:var(--border);border-radius:5px;overflow:hidden}
.util-fill{height:100%;border-radius:5px;transition:width .4s}
.util-pct{font-family:var(--font-mono);font-size:10px;width:36px;text-align:right;font-weight:600}
.util-abs{font-family:var(--font-mono);font-size:9px;color:var(--text-dim);width:100px;text-align:right}
.summary-row{display:flex;justify-content:space-between;align-items:center;padding:4px 0;border-bottom:1px solid var(--border)}
.summary-row:last-child{border-bottom:none}
.summary-key{font-size:12px;color:var(--text-mid)}
.summary-val{font-family:var(--font-mono);font-size:12px;font-weight:600;color:var(--text)}

/* ── Badges ── */
.badge{display:inline-flex;align-items:center;gap:4px;padding:2px 8px;border-radius:10px;font-size:10px;font-weight:600}
.badge-ok{background:var(--ok-bg);color:var(--ok)}
.badge-warn{background:var(--warn-bg);color:var(--warn)}
.badge-mid{background:var(--warn-mid-bg);color:var(--warn-mid)}

/* ── Monthly table ── */
.monthly-card{background:var(--panel);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden}
.m-table{width:100%;border-collapse:collapse}
.m-table th{font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:var(--text-dim);text-align:left;padding:8px 14px;border-bottom:2px solid var(--border);background:var(--bg);white-space:nowrap}
.m-table td{padding:8px 14px;border-bottom:1px solid var(--border);font-size:12px}
.m-table tr:last-child td{border-bottom:none}
.m-table tr:hover td{background:var(--asml-blue-light)}
.workload-bar-track{width:100%;height:6px;background:var(--border);border-radius:3px;overflow:hidden;min-width:80px}
.workload-bar-fill{height:100%;border-radius:3px;transition:width .4s}

/* ── Backlog chart ── */
.backlog-area{padding:12px 20px}
.backlog-bars{display:flex;align-items:flex-end;gap:1px;height:80px}
.bl-bar{flex:1;border-radius:1px 1px 0 0;min-height:0;cursor:pointer;transition:opacity .1s}

/* ── Tooltip ── */
.tooltip{position:fixed;background:#fff;border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px;font-size:11px;pointer-events:none;z-index:9999;box-shadow:var(--shadow-lg);min-width:180px}
.tt-title{font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--asml-blue);margin-bottom:5px;border-bottom:1px solid var(--border);padding-bottom:4px}
.tt-row{display:flex;justify-content:space-between;gap:16px;margin-top:3px}
.tt-key{color:var(--text-dim)}
.tt-val{font-family:var(--font-mono);font-weight:600;color:var(--text)}
.tt-val.warn{color:var(--warn)}
.tt-val.ok{color:var(--ok)}

::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border-dark);border-radius:3px}

@media(max-width:1100px){
  .sidebar{width:52px}
  .sidebar-wordmark,.sidebar-sub,.nav-item span,.sidebar-footer{display:none}
  .nav-item{justify-content:center;padding:10px 0}
  .kpi-strip{grid-template-columns:repeat(3,1fr)}
  .starts-grid,.dist-grid,.storage-grid{grid-template-columns:1fr}
}
`

export default css
