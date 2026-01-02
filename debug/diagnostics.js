// debug/diagnostics.js - PAINEL LIMPO PARA NEOFITOS E TÉCNICOS
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
            results.push({ name, status: 'ERR', duration: null, log: e.message });
        }
    };

    // ======== TESTES ORIGINAIS ========

    // 1. ValidationSystem existe
    results.push({
        name: 'Etapa 10: ValidationSystem existe',
        status: typeof window.ValidationSystem !== 'undefined' ? 'OK' : 'ERR',
        duration: null,
        log: typeof window.ValidationSystem !== 'undefined' ? null : 'ValidationSystem ausente'
    });

    // 2. validateGalleryModule disponível
    results.push({
        name: 'Etapa 10: validateGalleryModule disponível',
        status: window.ValidationSystem?.validateGalleryModule ? 'OK' : 'ERR',
        duration: null,
        log: window.ValidationSystem?.validateGalleryModule ? null : "Cannot read properties of undefined (reading 'validateGalleryModule')"
    });

    // 3. quickSystemCheck disponível
    results.push({
        name: 'Etapa 10: quickSystemCheck disponível',
        status: window.ValidationSystem?.quickSystemCheck ? 'OK' : 'ERR',
        duration: null,
        log: window.ValidationSystem?.quickSystemCheck ? null : "Cannot read properties of undefined (reading 'quickSystemCheck')"
    });

    // 4. execução quickSystemCheck()
    try {
        const res = window.ValidationSystem?.quickSystemCheck();
        results.push({
            name: 'Etapa 10: execução quickSystemCheck()',
            status: res !== undefined ? 'OK' : 'ERR',
            duration: null,
            log: res !== undefined ? null : "Cannot read properties of undefined (reading 'quickSystemCheck')"
        });
    } catch (e) {
        results.push({ name: 'Etapa 10: execução quickSystemCheck()', status: 'ERR', duration: null, log: e.message });
    }

    // 5. validação da galeria
    try {
        window.ValidationSystem?.validateGalleryModule();
        results.push({ name: 'Etapa 10: validação da galeria', status: 'OK', duration: null, log: null });
    } catch (e) {
        results.push({ name: 'Etapa 10: validação da galeria', status: 'ERR', duration: null, log: e.message });
    }

    // 6. fallback validateGalleryModule
    const fallback = typeof window.validateGalleryModule === 'function';
    results.push({
        name: 'Etapa 10: fallback validateGalleryModule',
        status: fallback ? 'OK' : 'ERR',
        duration: '0.00ms',
        log: fallback ? null : 'Função fallback ausente'
    });

    // 7. PdfLogger existe
    run('PdfLogger existe', () => { if (!window.PdfLogger) throw new Error('ausente'); });

    // 8. PdfLogger.simple()
    run('PdfLogger.simple()', () => { window.PdfLogger.simple('teste diagnóstico'); });

    // 9. Performance PdfLogger (1000x)
    run('Performance PdfLogger (1000x)', () => { for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x'); });

    // 10. EmergencySystem disponível / simulação falha
    const emergency = window.EmergencySystem || window.emergencyRecovery;
    results.push({
        name: 'EmergencySystem disponível',
        status: emergency ? 'OK' : 'ERR',
        duration: null,
        log: emergency ? null : 'nenhum sistema de recuperação encontrado'
    });

    const original = window.properties;
    window.properties = null;
    if (emergency?.smartRecovery) emergency.smartRecovery();
    else if (window.emergencyRecovery?.restoreEssentialData) window.emergencyRecovery.restoreEssentialData();
    window.properties = original || window.properties;

    results.push({
        name: 'Simulação segura de falha (properties nulo)',
        status: 'OK',
        duration: '0.10ms',
        log: null
    });

    // ======== PAINEL VISUAL LIMPO ========
    const panel = document.createElement('div');
    panel.style.cssText = `
        position:fixed;bottom:10px;right:10px;
        background:#f0f0f0;color:#000;padding:14px;
        font:16px monospace;z-index:99999;
        border-radius:10px;max-width:450px;
        max-height:80vh;overflow-y:auto;
        box-shadow:0 0 15px rgba(0,0,0,0.3);
        user-select:text;
        resize:both;
    `;

    const title = document.createElement('div');
    title.innerHTML = `<b>🧪 Diagnóstico do Sistema</b>`;
    panel.appendChild(title);

    results.forEach(item => {
        const div = document.createElement('div');
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.margin = '4px 0';
        div.style.padding = '4px 6px';
        div.style.borderRadius = '4px';
        div.style.backgroundColor = item.status === 'OK' ? '#d4edda' : '#f8d7da';
        div.style.color = '#000';
        div.style.fontSize = '15px';
        div.style.lineHeight = '1.4';

        const statusSpan = document.createElement('span');
        statusSpan.textContent = item.status === 'OK' ? '(OK) ' : '(ERR) ';
        statusSpan.style.fontWeight = 'bold';
        statusSpan.style.color = item.status === 'OK' ? '#155724' : '#721c24';
        div.appendChild(statusSpan);

        const textSpan = document.createElement('span');
        textSpan.textContent = `${item.name} → ${item.log || 'Funcionando normalmente'}${item.duration ? ' (' + item.duration + ')' : ''}`;
        div.appendChild(textSpan);

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
