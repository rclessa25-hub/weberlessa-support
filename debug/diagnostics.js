// debug/diagnostics.js
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos');

/* ================== URL FLAGS ================== */
const params = new URLSearchParams(window.location.search);
const DEBUG_MODE = params.get('debug') === 'true';
const DIAGNOSTICS_MODE = params.get('diagnostics') === 'true';

/* ================== PAINEL VISUAL ================== */
let panel = null;

if (DEBUG_MODE && DIAGNOSTICS_MODE) {
    panel = document.createElement('div');
    panel.id = 'diagnostics-panel';
    panel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 460px;
        max-height: 92vh;
        overflow-y: auto;
        background: #0b0b0b;
        color: #00ff9c;
        font-family: monospace;
        font-size: 12px;
        padding: 10px;
        border: 1px solid #00ff9c;
        z-index: 99999;
        box-shadow: 0 0 25px rgba(0,255,156,.45);
    `;
    panel.innerHTML = `
        <div style="font-weight:bold;font-size:13px">🔍 SUPPORT DIAGNOSTICS</div>
        <div style="opacity:.7">Painel automático ativo</div>
        <hr>
    `;
    document.body.appendChild(panel);
}

/* ================== LOG UNIFICADO ================== */
function logUI(msg) {
    console.log(msg);
    if (panel) {
        const line = document.createElement('div');
        line.textContent = msg;
        panel.appendChild(line);
    }
}

/* ================== CLASSIFICAÇÃO REAL ================== */
function classifyModule(src) {
    const name = src.split('/').pop().toLowerCase();

    const SUPPORT_KEYWORDS = [
        'diagnostics',
        'logger',
        'recovery',
        'checker',
        'utils'
    ];

    const EXTERNAL_KEYWORDS = [
        'supabase',
        'cdn',
        'unpkg'
    ];

    if (EXTERNAL_KEYWORDS.some(k => name.includes(k))) return 'EXTERNAL';
    if (SUPPORT_KEYWORDS.some(k => name.includes(k))) return 'SUPPORT';
    return 'CORE';
}

/* ================== COLETA DE SCRIPTS ================== */
const scripts = Array.from(document.scripts)
    .map(s => s.src || s.dataset.module || '')
    .filter(Boolean);

const classified = scripts.map(src => ({
    src,
    name: src.split('/').pop(),
    type: classifyModule(src)
}));

const coreModules = classified.filter(m => m.type === 'CORE');
const supportModules = classified.filter(m => m.type === 'SUPPORT');
const externalModules = classified.filter(m => m.type === 'EXTERNAL');

/* ================== HEALTH ================== */
const results = [];
let healthScore = 100;
let etapa10Counter = 0;

function addResult(status, message, detail = '') {
    results.push({ status, message, detail });
    if (status.includes('ERR')) healthScore -= 20;
    logUI(`${status} → ${message} ${detail}`);
}

/* ================== RESUMO ================== */
logUI('📊 RESUMO DO SISTEMA');
logUI(`⚙️ CORE: ${coreModules.length}`);
logUI(`🧩 SUPORTE: ${supportModules.length}`);
logUI(`📦 EXTERNOS: ${externalModules.length}`);
logUI(`🩺 HEALTH SCORE INICIAL: ${healthScore}/100`);
logUI('');

/* ================== LISTAGEM ================== */
logUI('⚙️ MÓDULOS CORE');
coreModules.forEach((m, i) =>
    logUI(`(OK) (${i + 1}) [CORE ${i + 1}] ${m.name}`)
);

logUI('');
logUI('🧩 MÓDULOS SUPORTE');
supportModules.forEach((m, i) =>
    logUI(`(OK) (${i + 1}) [SUPORTE ${i + 1}] ${m.name}`)
);

if (externalModules.length) {
    logUI('');
    logUI('📦 MÓDULOS EXTERNOS');
    externalModules.forEach((m, i) =>
        logUI(`(OK) (${i + 1}) [EXTERNO ${i + 1}] ${m.name}`)
    );
}

/* ================== RUN SEGURO ================== */
function run(testName, fn) {
    try {
        fn();
        logUI(`(OK) ${testName}`);
    } catch (e) {
        addResult('ERR/OK', testName, e.message);
    }
}

/* ================== TESTES – ETAPA 10 ================== */
logUI('');
logUI('🧪 TESTES E DIAGNÓSTICOS – ETAPA 10');

if (window.ValidationSystem) {
    const vs = window.ValidationSystem;

    [
        ['ValidationSystem existe', () => true],
        ['validateGalleryModule disponível', () => {
            if (typeof vs.validateGalleryModule !== 'function') throw new Error('ausente');
        }],
        ['quickSystemCheck disponível', () => {
            if (typeof vs.quickSystemCheck !== 'function') throw new Error('ausente');
        }],
        ['Execução quickSystemCheck()', () => vs.quickSystemCheck()],
        ['Validação da galeria', () => vs.validateGalleryModule()]
    ].forEach(([name, fn]) => {
        run(`Etapa 10: ${name}`, fn);
        etapa10Counter++;
    });
} else {
    addResult('ERR/OK', 'ValidationSystem ausente', 'fallback ativo');
}

/* ---------- Fallback ---------- */
run('Etapa 10: fallback validateGalleryModule', () => {
    if (typeof window.validateGalleryModule !== 'function') {
        throw new Error('fallback ausente');
    }
});
etapa10Counter++;

/* ---------- PdfLogger ---------- */
run('PdfLogger existe', () => {
    if (!window.PdfLogger) throw new Error('ausente');
});
run('PdfLogger.simple()', () => window.PdfLogger.simple('teste'));
run('Performance PdfLogger (1000x)', () => {
    for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
});

/* ---------- Emergency ---------- */
if (!window.EmergencySystem && !window.emergencyRecovery) {
    addResult('ERR/OK', 'EmergencySystem ausente', 'sistema protegido');
} else {
    logUI('(OK) EmergencySystem disponível');
}

/* ---------- Simulação segura ---------- */
run('Simulação segura de falha', () => {
    const original = window.properties;
    window.properties = null;
    window.EmergencySystem?.smartRecovery?.();
    window.emergencyRecovery?.restoreEssentialData?.();
    window.properties = original;
});

/* ================== FINAL ================== */
logUI('');
logUI(`🔍 Etapas 10 executadas: ${etapa10Counter}`);
logUI('📊 RESUMO FINAL');
results.forEach(r =>
    logUI(`${r.status} → ${r.message} ${r.detail}`)
);
logUI(`🩺 HEALTH SCORE FINAL: ${healthScore}/100`);
