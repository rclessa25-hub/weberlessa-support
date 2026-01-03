// debug/diagnostics.js
console.log('🔍 diagnostics.js – análise por efeitos colaterais');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const ACTIVE = params.get('debug') === 'true' && params.get('diagnostics') === 'true';

/* ================== PAINEL ================== */
let panel;
function ui(msg) {
    console.log(msg);
    if (!panel) return;
    const d = document.createElement('div');
    d.textContent = msg;
    panel.appendChild(d);
}

if (ACTIVE) {
    panel = document.createElement('div');
    panel.style.cssText = `
        position:fixed;top:10px;right:10px;width:520px;
        max-height:92vh;overflow:auto;
        background:#0b0b0b;color:#00ff9c;
        font:12px monospace;padding:10px;
        border:1px solid #00ff9c;z-index:99999;
    `;
    panel.innerHTML = `<b>🔍 RUNTIME DIAGNOSTICS</b><hr>`;
    document.body.appendChild(panel);
}

/* ================== REGISTRO ================== */
const activity = {
    CORE: new Set(),
    PERFORMANCE: new Set(),
    SUPPORT: new Set(),
    UTIL: new Set()
};

/* ================== INTERCEPTORES ================== */

// DOM
const origCreate = document.createElement;
document.createElement = function(tag) {
    activity.CORE.add('DOM:' + tag);
    return origCreate.apply(this, arguments);
};

// Listeners
const origAddListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type) {
    activity.CORE.add('EVENT:' + type);
    return origAddListener.apply(this, arguments);
};

// Timers
['setTimeout', 'setInterval'].forEach(fn => {
    const orig = window[fn];
    window[fn] = function() {
        activity.PERFORMANCE.add(fn);
        return orig.apply(this, arguments);
    };
});

// Console (diagnóstico / suporte)
const origLog = console.log;
console.log = function(...args) {
    if (typeof args[0] === 'string') {
        if (/diagnostic|check|verifica|fallback/i.test(args[0])) {
            activity.SUPPORT.add('LOG:' + args[0]);
        }
    }
    return origLog.apply(console, args);
};

/* ================== RELATÓRIO FINAL ================== */
window.addEventListener('load', () => {

    ui('📊 RESUMO POR NATUREZA');

    Object.entries(activity).forEach(([type, set]) => {
        ui(`${type}: ${set.size}`);
    });

    Object.entries(activity).forEach(([type, set]) => {
        ui('');
        ui(`🧩 ${type}`);
        [...set].forEach((v, i) => ui(`(${i + 1}) ${v}`));
    });

    let health = 100;
    if (activity.CORE.size === 0) health -= 40;
    if (activity.SUPPORT.size === 0) health -= 10;

    ui('');
    ui(`🩺 HEALTH SCORE: ${health}/100`);

    console.log('🔍 runtime activity map:', activity);
});
