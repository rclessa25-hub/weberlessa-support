// debug/diagnostics.js
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos');

console.log('🔍 diagnostics.js carregado – varredura funcional de runtime');

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
        position:fixed;top:10px;right:10px;width:480px;
        max-height:92vh;overflow:auto;
        background:#0b0b0b;color:#00ff9c;
        font:12px monospace;padding:10px;
        border:1px solid #00ff9c;z-index:99999;
    `;
    panel.innerHTML = `<b>🔍 RUNTIME DIAGNOSTICS</b><hr>`;
    document.body.appendChild(panel);
}

/* ================== SNAPSHOT GLOBAL ================== */
const GLOBAL_KEYS = Object.keys(window);

/* ================== DETECTORES ================== */
function scoreSymbol(name, value) {
    let score = {
        CORE: 0,
        PERFORMANCE: 0,
        SUPPORT: 0,
        UTIL: 0,
        EXTERNAL: 0
    };

    if (typeof value === 'function') {
        if (/init|load|render|mount|admin|gallery/i.test(name)) score.CORE += 3;
        if (/optimize|performance|analy/i.test(name)) score.PERFORMANCE += 3;
        if (/log|recover|emergency|diagnostic|check/i.test(name)) score.SUPPORT += 3;
        if (/format|parse|extract|map|filter/i.test(name)) score.UTIL += 2;
    }

    if (typeof value === 'object' && value !== null) {
        if (value === window.supabase) score.EXTERNAL += 5;
        if (name === 'properties' || name === 'ValidationSystem') score.CORE += 4;
        if (/logger|recovery/i.test(name)) score.SUPPORT += 3;
    }

    return score;
}

function resolveType(score) {
    return Object.entries(score).sort((a,b)=>b[1]-a[1])[0][0];
}

/* ================== VARREDURA ================== */
const moduleMap = {};

Object.keys(window).forEach(key => {
    if (GLOBAL_KEYS.includes(key)) return;

    const value = window[key];
    const score = scoreSymbol(key, value);
    const type = resolveType(score);

    moduleMap[type] = moduleMap[type] || [];
    moduleMap[type].push(key);
});

/* ================== RELATÓRIO ================== */
ui('📊 RESUMO POR NATUREZA');
Object.entries(moduleMap).forEach(([type, items]) => {
    ui(`${type}: ${items.length}`);
});

Object.entries(moduleMap).forEach(([type, items]) => {
    ui('');
    ui(`🧩 ${type}`);
    items.forEach((k, i) => ui(`(${i+1}) ${k}`));
});

/* ================== SAÚDE ================== */
let health = 100;
if (!moduleMap.CORE || moduleMap.CORE.length < 3) health -= 30;
if (!moduleMap.SUPPORT) health -= 10;

ui('');
ui(`🩺 HEALTH SCORE: ${health}/100`);

console.log('🔍 diagnostics runtime map:', moduleMap);
