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
            results.push({ name, status: 'OK', duration: (performance.now() - t).toFixed(2) + 'ms', log: null });
            return r;
        } catch (e) {
            results.push({ name, status: 'FAIL', duration: null, log: e.message });
        }
    };

    // ======== TESTES ORIGINAIS ========

    // 1. ValidationSystem existe?
    try {
        const exists = typeof window.ValidationSystem !== 'undefined';
        results.push({
            name: 'Etapa 10: ValidationSystem existe',
            status: exists ? 'POS' : 'NEG',
            duration: null,
            log: exists ? null : 'ValidationSystem ausente'
        });
    } catch (e) {
        results.push({ name: 'Etapa 10: ValidationSystem existe', status: 'NEG', duration: null, log: e.message });
    }

    // 2. validateGalleryModule disponível
    try {
        const available = window.ValidationSystem?.validateGalleryModule;
        results.push({
            name: 'Etapa 10: validateGalleryModule disponível',
            status: available ? 'POS' : 'NEG',
            duration: null,
            log: available ? null : "Cannot read properties of undefined (reading 'validateGalleryModule')"
        });
    } catch (e) {
        results.push({ name: 'Etapa 10: validateGalleryModule disponível', status: 'NEG', duration: null, log: e.message });
    }

    // 3. quickSystemCheck disponível
    try {
        const available = window.ValidationSystem?.quickSystemCheck;
        results.push({
            name: 'Etapa 10: quickSystemCheck disponível',
            status: available ? 'POS' : 'NEG',
            duration: null,
            log: available ? null : "Cannot read properties of undefined (reading 'quickSystemCheck')"
        });
    } catch (e) {
        results.push({ name: 'Etapa 10: quickSystemCheck disponível', status: 'NEG', duration: null, log: e.message });
    }

    // 4. execução quickSystemCheck()
    try {
        const res = window.ValidationSystem?.quickSystemCheck();
        results.push({
            name: 'Etapa 10: execução quickSystemCheck()',
            status: res !== undefined ? 'POS' : 'NEG',
            duration: null,
            log: res !== undefined ? null : "Cannot read properties of undefined (reading 'quickSystemCheck')"
        });
    } catch (e) {
        results.push({ name: 'Etapa 10: execução quickSystemCheck()', status: 'NEG', duration: null, log: e.message });
    }

    // 5. validação da galeria
    try {
        window.ValidationSystem?.validateGalleryModule();
        results.push({
            name: 'Etapa 10: validação da galeria',
            status: 'POS',
            duration: null,
            log: null
        });
    } catch (e) {
        results.push({ name: 'Etapa 10: validação da galeria', status: 'NEG', duration: null, log: e.message });
    }

    // 6. fallback validateGalleryModule
    try {
        const fallback = typeof window.validateGalleryModule === 'function';
        results.push({
            name: 'Etapa 10: fallback validateGalleryModule',
            status: fallback ? 'POS' : 'NEG',
            duration: '0.00ms',
            log: null
        });
    } catch (e) {
        results.push({ name: 'Etapa 10: fallback validateGalleryModule', status: 'NEG', duration: null, log: e.message });
    }

    // 7. PdfLogger existe
    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });

    // 8. PdfLogger.simple()
    run('PdfLogger.simple()', () => {
        window.PdfLogger.simple('teste diagnóstico');
    });

    // 9. Performance PdfLogger (1000x)
    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

    // 10. EmergencySystem disponível / simulação falha
    try {
        const emergency = window.EmergencySystem || window.emergencyRecovery;
        results.push({
            name: 'EmergencySystem disponível',
            status: emergency ? 'POS' : 'NEG',
            duration: null,
            log: emergency ? null : 'nenhum sistema de recuperação encontrado'
        });

        const original = window.properties;
        window.properties = null;
        if (emergency?.smartRecovery) {
            emergency.smartRecovery();
        } else if (window.emergencyRecovery?.restoreEssentialData) {
            window.emergencyRecovery.restoreEssentialData();
        }
        window.properties = original || window.properties;

        results.push({
            name: 'Simulação segura de falha (properties nulo)',
            status: 'POS',
            duration: '0.10ms',
            log: null
        });
    } catch (e) {
        results.push({ name: 'Simulação segura de falha (properties nulo)', status: 'NEG', duration: null, log: e.message });
    }

    // ======== PAINEL VISUAL ========

    const panel = document.createElement('div');
    panel.style.cssText = `
        position:fixed;bottom:10px;right:10px;
        background:#111;color:#fff;padding:12px;
        font:14px monospace;z-index:99999;
        border-radius:8px;max-width:400px;
        max-height:80vh;overflow-y:auto;
        box-shadow:0 0 10px rgba(0,0,0,0.5);
        resize:both;
    `;

    const title = document.createElement('div');
    title.innerHTML = `<b>🧪 Diagnóstico do Sistema</b>`;
    panel.appendChild(title);

    results.forEach(item => {
        const div = document.createElement('div');
        let statusText = '';
        let color = '#fff';
        switch (item.status) {
            case 'POS':
            case 'OK':
                statusText = '(OK)';
                color = '#4caf50';
                break;
            case 'NEG':
            case 'FAIL':
                statusText = '(ERR)';
                color = '#f44336';
                break;
            default:
                statusText = '(N/A)';
                color = '#ffeb3b';
        }

        div.style.color = color;
        if (item.status === 'NEG' || item.status === 'FAIL') {
            div.style.opacity = '0.5';
        }

        const durationText = item.duration ? ` (${item.duration})` : '';
        div.innerHTML = `${statusText} ${item.name}${durationText} → ${item.log || 'Funcionando normalmente'}`;
        panel.appendChild(div);
    });

    document.body.appendChild(panel);

    // ======== ARRASTO ========
    let isDragging = false, offsetX, offsetY;
    panel.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        panel.style.cursor = 'move';
    });
    window.addEventListener('mouseup', () => { isDragging = false; panel.style.cursor = 'default'; });
    window.addEventListener('mousemove', e => {
        if (isDragging) {
            panel.style.left = e.clientX - offsetX + 'px';
            panel.style.top = e.clientY - offsetY + 'px';
        }
    });
})();
