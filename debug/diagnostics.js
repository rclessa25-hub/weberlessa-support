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

    // ==================================================
    // 🧪 ETAPA 10 – VERIFICAÇÃO FINAL (PAINEL + CONSOLE)
    // ==================================================
    console.log('=== ETAPA 10 VERIFICATION ===');

    run('Etapa 10: ValidationSystem existe', () => {
        if (!window.ValidationSystem) {
            throw new Error('ValidationSystem ausente');
        }
    });

    run('Etapa 10: validateGalleryModule disponível', () => {
        if (typeof window.ValidationSystem.validateGalleryModule !== 'function') {
            throw new Error('validateGalleryModule ausente');
        }
    });

    run('Etapa 10: quickSystemCheck disponível', () => {
        if (typeof window.ValidationSystem.quickSystemCheck !== 'function') {
            throw new Error('quickSystemCheck ausente');
        }
    });

    run('Etapa 10: execução quickSystemCheck()', () => {
        const result = window.ValidationSystem.quickSystemCheck();
        console.log('quickSystemCheck:', result);
    });

    run('Etapa 10: validação da galeria', () => {
        window.ValidationSystem.validateGalleryModule();
    });

    run('Etapa 10: fallback validateGalleryModule', () => {
        if (typeof window.validateGalleryModule !== 'function') {
            throw new Error('Fallback ausente');
        }
    });

    console.log('=== ETAPA 10 COMPLETA ===');

    // ==================================================
    // 🔬 TESTES EXISTENTES
    // ==================================================
    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });

    run('PdfLogger.simple()', () => {
        window.PdfLogger.simple('teste diagnóstico');
    });

    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

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

    // ==================================================
    // 🖥️ UI – PAINEL DE DIAGNÓSTICO
    // ==================================================
    const box = document.createElement('div');
    box.style.cssText =
        'position:fixed;bottom:10px;left:10px;' +
        'background:#111;color:#0f0;padding:8px;' +
        'font:12px monospace;z-index:99999;' +
        'border-radius:6px;max-width:340px;' +
        'cursor:move';

    const header = document.createElement('div');
    header.style.cssText =
        'display:flex;justify-content:space-between;' +
        'align-items:center;margin-bottom:6px';

    const title = document.createElement('strong');
    title.textContent = '🧪 Diagnóstico do Sistema';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '–';
    toggleBtn.style.cssText =
        'background:#333;color:#0f0;border:none;' +
        'cursor:pointer;font-size:12px;padding:2px 6px';

    const content = document.createElement('div');
    content.innerHTML = results.join('<br>');

    toggleBtn.onclick = () => {
        const visible = content.style.display !== 'none';
        content.style.display = visible ? 'none' : 'block';
        toggleBtn.textContent = visible ? '+' : '–';
    };

    header.appendChild(title);
    header.appendChild(toggleBtn);
    box.appendChild(header);
    box.appendChild(content);
    document.body.appendChild(box);

    // ==================================================
    // 🖱️ DRAG & DROP
    // ==================================================
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
    });

    document.addEventListener('mousemove', e => {
        if (!isDragging) return;
        box.style.left = `${e.clientX - offsetX}px`;
        box.style.top = `${e.clientY - offsetY}px`;
        box.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
})();
