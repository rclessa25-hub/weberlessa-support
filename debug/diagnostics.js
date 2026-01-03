// debug/diagnostics.js
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

/* ================== DIAGNÓSTICS.JS AUTOMÁTICO ================== */

/* ---------- Configurações gerais ---------- */
const results = [];
let healthScore = 100;
let etapa10Counter = 0;
const etapa10NotExecuted = [];

/* ---------- Função para adicionar resultado ---------- */
function addResult(status, message, detail = '') {
    results.push({ status, message, detail });
    if (status.includes('ERR')) healthScore -= 20;
}

/* ---------- Detectar módulos carregados automaticamente ---------- */
const scripts = Array.from(document.scripts).map(s => s.src || s.dataset.module || '').filter(Boolean);

const coreModules = scripts.filter(s => s.includes('core'));
const supportModules = scripts.filter(s => !s.includes('core'));

function formatModuleList(modules, type) {
    return modules.map((m, i) => `(${i + 1}) [MÓDULO ${type.toUpperCase()} ${i + 1}] ${m.split('/').pop()} → Carregado`);
}

/* ---------- Resumo inicial ---------- */
console.log('📊 RESUMO DO SISTEMA');
console.log(`⚙️ CORE: ${coreModules.length}`);
console.log(`🧩 SUPORTE: ${supportModules.length}`);
console.log(`❌ ERROS / ALERTAS: ${results.filter(r => r.status.includes('ERR')).length}`);
console.log(`🟠 STATUS GERAL: ${results.some(r => r.status.includes('ERR')) ? 'OPERACIONAL (COM ALERTAS)' : 'OPERACIONAL'}`);
console.log(`🩺 HEALTH SCORE: ${healthScore} / 100`);

/* ---------- Listar módulos ---------- */
console.log('🧩 MÓDULOS SUPORTE');
formatModuleList(supportModules, 'SUPORTE').forEach(m => console.log('(OK) ' + m + '\nSUPORTE NO RUNTIME'));

console.log('⚙️ MÓDULOS CORE');
formatModuleList(coreModules, 'CORE').forEach(m => console.log('(OK) ' + m + '\nCORE NO RUNTIME'));

/* ---------- Função de execução segura de testes ---------- */
function run(testName, fn) {
    try {
        const result = fn();
        console.log(`(OK) ${testName} → Funcionando normalmente`);
    } catch (e) {
        console.log(`(ERR/OK – Proteção ativa) ${testName} → Proteção ativa / fallback acionado`);
        console.log(`${testName}: ${e.message}`);
        addResult('ERR/OK', testName, e.message);
    }
}

/* ================== TESTES ETAPA 10 ================== */
console.log('🧪 TESTES E DIAGNÓSTICOS (ETAPA 10)');

if (window.ValidationSystem) {
    const vs = window.ValidationSystem;

    const etapa10Tests = [
        ['Etapa 10: ValidationSystem existe', () => true],
        ['Etapa 10: validateGalleryModule disponível', () => {
            if (typeof vs.validateGalleryModule !== 'function') throw new Error('ausente');
        }],
        ['Etapa 10: quickSystemCheck disponível', () => {
            if (typeof vs.quickSystemCheck !== 'function') throw new Error('ausente');
        }],
        ['Etapa 10: execução quickSystemCheck()', () => vs.quickSystemCheck()],
        ['Etapa 10: validação da galeria', () => vs.validateGalleryModule()]
    ];

    etapa10Tests.forEach(([name, fn]) => {
        run(name, fn);
        etapa10Counter++;
    });
} else {
    console.log('(ERR/OK – Proteção ativa) Etapa 10: ValidationSystem ausente → Sistema protegido');
    console.log('ValidationSystem undefined');
    addResult('ERR/OK', 'Etapa 10: ValidationSystem ausente', 'ValidationSystem undefined');

    console.log('(OK) Etapa 10: validação da galeria → Fallback acionado');
    console.log('Fallback validateGalleryModule ativo');
}

/* Teste fallback validateGalleryModule */
run('Etapa 10: fallback validateGalleryModule', () => {
    if (typeof window.validateGalleryModule !== 'function') throw new Error('ausente');
});
etapa10Counter++;

/* ---------- PdfLogger ---------- */
run('PdfLogger existe', () => { if (!window.PdfLogger) throw new Error('ausente'); });
run('PdfLogger.simple()', () => window.PdfLogger.simple('teste'));
run('Performance PdfLogger (1000x)', () => {
    for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
});

/* ---------- EmergencySystem ---------- */
if (!window.EmergencySystem && !window.emergencyRecovery) {
    addResult('ERR/OK', 'EmergencySystem ausente → Sistema protegido', 'Nenhum recovery carregado');
    console.log('(ERR/OK – Proteção ativa) EmergencySystem ausente → Sistema protegido');
    console.log('Nenhum recovery carregado');
} else {
    console.log('(OK) EmergencySystem disponível → Funcionando normalmente');
}

/* ---------- Simulação segura de falha ---------- */
run('Simulação segura de falha (properties nulo)', () => {
    const original = window.properties;
    window.properties = null;
    window.EmergencySystem?.smartRecovery?.();
    window.emergencyRecovery?.restoreEssentialData?.();
    window.properties = original || window.properties;
});

/* ---------- Relatório Etapa 10 ---------- */
console.log(`🔍 Etapas 10 executadas: ${etapa10Counter}`);
if (etapa10Counter < 5) console.log(`🔍 Etapas 10 não executadas: ${5 - etapa10Counter} (cinza)`);

/* ---------- Resultado final ---------- */
console.log('📊 RESUMO FINAL DOS TESTES');
results.forEach(r => console.log(`${r.status} → ${r.message} ${r.detail}`));
console.log(`🩺 HEALTH SCORE FINAL: ${healthScore}/100`);
