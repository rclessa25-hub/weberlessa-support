// debug/diagnostics.js
console.log('🔍 diagnostics.js – interceptação real de runtime ativa');

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

/* ================== CLASSIFICAÇÃO FUNCIONAL ================== */
function classify(symbols) {
    const score = { CORE:0, PERFORMANCE:0, SUPPORT:0, UTIL:0, EXTERNAL:0 };

    symbols.forEach(({ name, value }) => {
        if (typeof value === 'function') {
            if (/init|load|render|mount|admin|gallery/i.test(name)) score.CORE += 3;
            if (/optimi|perform|cache|profil/i.test(name)) score.PERFORMANCE += 3;
            if (/log|recover|emergency|diagnostic|check/i.test(name)) score.SUPPORT += 3;
            if (/format|parse|extract|map|filter/i.test(name)) score.UTIL += 2;
        }

        if (typeof value === 'object' && value !== null) {
            if (name === 'properties' || name === 'ValidationSystem') score.CORE += 4;
            if (/logger|recovery/i.test(name)) score.SUPPORT += 3;
            if (value === window.supabase) score.EXTERNAL += 5;
        }
    });

    return Object.entries(score).sort((a,b)=>b[1]-a[1])[0][0];
}

/* ================== INTERCEPTAÇÃO appendChild ================== */
const originalAppendChild = Node.prototype.appendChild;
const registry = [];

Node.prototype.appendChild = function(node) {
    if (node.tagName === 'SCRIPT' && node.src) {
        const before = new Set(Object.keys(window));
        const srcName = node.src.split('/').pop();

        node.addEventListener('load', () => {
            const after = Object.keys(window);
            const diff = after.filter(k => !before.has(k));

            if (!diff.length) return;

            const symbols = diff.map(k => ({
                name: k,
                value: window[k]
            }));

            registry.push({
                src: srcName,
                type: classify(symbols),
                symbols: diff
            });
        }, { once: true });
    }

    return originalAppendChild.call(this, node);
};

/* ================== RELATÓRIO FINAL ================== */
window.addEventListener('load', () => {

    // congelar interceptação
    Node.prototype.appendChild = originalAppendChild;

    const grouped = {};
    registry.forEach(m => {
        grouped[m.type] = grouped[m.type] || [];
        grouped[m.type].push(m);
    });

    ui('📊 RESUMO POR NATUREZA');
    Object.entries(grouped).forEach(([type, mods]) =>
        ui(`${type}: ${mods.length}`)
    );

    Object.entries(grouped).forEach(([type, mods]) => {
        ui('');
        ui(`🧩 ${type}`);
        mods.forEach((m, i) =>
            ui(`(${i+1}) ${m.src} → ${m.symbols.join(', ')}`)
        );
    });

    let health = 100;
    if (!grouped.CORE || grouped.CORE.length < 3) health -= 30;
    if (!grouped.SUPPORT) health -= 10;

    ui('');
    ui(`🩺 HEALTH SCORE: ${health}/100`);

    console.log('🔍 runtime registry:', registry);
});
