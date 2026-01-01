// debug/diagnostics.js - REPOSITÓRIO DE SUPORTE
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    const results = [];
    const run = (name, fn) => {
        try {
            const t = performance.now();
            const r = fn();
            results.push(`✅ ${name} (${(performance.now() - t).toFixed(2)}ms)`);
            return r;
        } catch (e) {
            results.push(`❌ ${name}: ${e.message}`);
        }
    };

    /* ========= TESTES ========= */

    // PdfLogger
    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });

    run('PdfLogger.simple()', () => {
        window.PdfLogger.simple('teste diagnóstico');
    });

    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

    // EmergencySystem / emergencyRecovery
    run('EmergencySystem disponível', () => {
        if (!window.EmergencySystem && !window.emergencyRecovery)
            throw new Error('nenhum sistema de recuperação encontrado');
    });

    run('Simulação segura de falha (properties nulo)', () => {
        const original = window.properties;
        window.properties = null;

        if (window.EmergencySystem?.smartRecovery) {
            window.EmergencySystem.smartRecovery();
        } else if (window.emergencyRecovery?.restoreEssentialData) {
            window.emergencyRecovery.restoreEssentialData();
        }

        window.properties = original || window.properties;
    });

    /* ========= UI ========= */

    const box = document.createElement('div');
    box.style.cssText =
        'position:fixed;bottom:10px;right:10px;' +
        'background:#111;color:#0f0;padding:8px;' +
        'font:12px monospace;z-index:99999;' +
        'border-radius:6px;max-width:320px';

    box.innerHTML =
        `<b>🧪 Diagnóstico do Sistema</b><br>` +
        results.join('<br>');

    document.body.appendChild(box);
})();
