// debug/diagnostics.js
(function () {
    if (!location.search.includes('diagnostics=true')) return;

    const out = [];
    const run = (name, fn) => {
        try {
            const t = performance.now();
            fn();
            out.push(`✅ ${name} (${(performance.now()-t).toFixed(2)}ms)`);
        } catch (e) {
            out.push(`❌ ${name}: ${e.message}`);
        }
    };

    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });

    run('PdfLogger.simple()', () => {
        window.PdfLogger.simple('teste');
    });

    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

    const box = document.createElement('div');
    box.style.cssText =
        'position:fixed;bottom:10px;right:10px;background:#111;color:#0f0;' +
        'padding:8px;font:12px monospace;z-index:99999;border-radius:6px';
    box.innerHTML = `<b>🧪 Diagnóstico</b><br>${out.join('<br>')}`;
    document.body.appendChild(box);
})();
