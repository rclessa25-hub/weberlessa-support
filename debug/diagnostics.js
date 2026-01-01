// debug/diagnostics.js - REPOSITÓRIO DE SUPORTE
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

(function () {
    // Só ativa em modo debug + diagnostics=true
    if (!location.search.includes('diagnostics=true')) return;

    const out = [];

    // Função de execução segura de testes
    const run = (name, fn) => {
        try {
            const t = performance.now();
            fn();
            out.push(`✅ ${name} (${(performance.now() - t).toFixed(2)}ms)`);
        } catch (e) {
            out.push(`❌ ${name}: ${e.message}`);
        }
    };

    // ===== TESTES PRINCIPAIS =====
    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });

    run('PdfLogger.simple()', () => {
        window.PdfLogger.simple('Teste de logging');
    });

    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

    // ===== PLACEHOLDERS PARA OUTRAS VERIFICAÇÕES =====
    // Aqui você pode adicionar funções extras sugeridas
    // Ex: run('Verificar storage', diagnostics.checkStorage);

    // ===== EXIBIÇÃO DO RESULTADO =====
    const box = document.createElement('div');
    box.style.cssText =
        'position:fixed;bottom:10px;right:10px;background:#111;color:#0f0;' +
        'padding:8px;font:12px monospace;z-index:99999;border-radius:6px;max-width:300px;overflow:auto;';
    box.innerHTML = `<b>🧪 Diagnóstico</b><br>${out.join('<br>')}`;
    document.body.appendChild(box);

    console.log('✅ diagnostics.js - Diagnósticos completos executados');
})();
