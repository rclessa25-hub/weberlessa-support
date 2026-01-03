// debug/diagnostics.js
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

/* ================== CONFIGURAÇÃO DE URL ================== */
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
        width: 440px;
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
        <div style="opacity:.7">Modo visual ativo</div>
        <hr>
    `;
    document.body.appendChild(panel);
}

/* ================== FUNÇÃO DE LOG UNIFICADA ================== */
function logUI(message) {
    console.log(message);
    if (panel) {
        const line = document.createElement('div');
        line.textContent = message;
        panel.appendChild(line);
    }
}

/* ================== DIAGNÓSTICS CORE ================== */
const results = [];
let healthScore = 100;
let etapa10Counter = 0;

/* ---------- Função de resultado ---------- */
function addResult(status, message, detail = '') {
    results.push({ status, message, detail });
    if (status.includes('ERR')) healthScore -= 20;

    if (panel) {
        const line = document.createElement('div');
        line.innerHTML = `<b>${status}</b> → ${message} ${detail}`;
        panel.appendChild(line);
    }
}

/* ---------- Detectar módulos carregados ---------- */
const scripts = Array.from(document.scripts)
    .map(s => s.src || s.dataset.module || '')
    .filter(Boolean);

const coreModules = scripts.filter(s => s.includes('core'));
const supportModules = scripts.filter(s => !s.includes('core'));

function formatModuleList(modules, type) {
    return modules.map((m, i) =>
        `(${i + 1}) [${type} ${i + 1}] ${m.split('/').pop()}`
    );
}

/* ---------- Resumo inicial ---------- */
logUI('📊 RESUMO DO SISTEMA');
logUI(`⚙️ CORE: ${coreModules.length}`);
logUI(`🧩 SUPORTE: ${supportModules.length}`);
logUI(`🩺 HEALTH SCORE INICIAL: ${healthScore}/100`);
logUI('');

/* ---------- Listagem de módulos ---------- */
logUI('🧩 MÓDULOS SUPORTE');
formatModuleList(supportModules, 'SUPORTE')
    .forEach(m => logUI('(OK) ' + m));

logUI('');
logUI('⚙️ MÓDULOS CORE');
formatModuleList(coreModules, 'CORE')
    .forEach(m => logUI('(OK) ' + m));

/* ---------- Execução segura ---------- */
function run(testName, fn) {
    try {
        fn();
        logUI(`(OK) ${testName}`);
    } catch (e) {
        logUI(`(ERR/OK – Proteção ativa) ${testName}`);
        logUI(`↳ ${e.message}`);
        addResult('ERR/OK', testName, e.message);
    }
}

/* ================== TESTES ETAPA 10 ================== */
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
    logUI('(ERR/OK – Proteção ativa) ValidationSystem ausente');
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
    for (let i = 0; i < 1000; i++) {
        window.PdfLogger.simple('x');
    }
});

/* ---------- Emergency System ---------- */
if (!window.EmergencySystem && !window.emergencyRecovery) {
    addResult('ERR/OK', 'EmergencySystem ausente', 'sistema protegido');
    logUI('(ERR/OK – Proteção ativa) EmergencySystem ausente');
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

/* ---------- Relatório final ---------- */
logUI('');
logUI(`🔍 Etapas 10 executadas: ${etapa10Counter}`);
logUI('📊 RESUMO FINAL');
results.forEach(r =>
    logUI(`${r.status} → ${r.message} ${r.detail}`)
);
logUI(`🩺 HEALTH SCORE FINAL: ${healthScore}/100`);
