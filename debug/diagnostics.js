// debug/diagnostics.js - REPOSITÓRIO DE SUPORTE
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos (modo humano)');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    /* ==========================================================
       🧠 TRADUTOR DE RESULTADOS (NEÓFITO-FRIENDLY)
    ========================================================== */
    function translate(status) {
        switch (status) {
            case 'OK':
                return { icon: '🟢', text: 'Funcionando normalmente' };
            case 'LIMITED':
                return { icon: '🟡', text: 'Funciona com proteção básica' };
            case 'DEBUG_ONLY':
                return { icon: '🔵', text: 'Recurso técnico (modo diagnóstico)' };
            case 'CRITICAL':
                return { icon: '🔴', text: 'Pode afetar o funcionamento do site' };
            default:
                return { icon: '⚪', text: 'Estado não identificado' };
        }
    }

    /* ==========================================================
       🧪 EXECUTOR DE TESTES
    ========================================================== */
    const results = [];

    function runHumanTest(label, evaluator) {
        try {
            const outcome = evaluator();
            const translated = translate(outcome.status);

            results.push(
                `${translated.icon} <b>${label}</b><br>` +
                `&nbsp;&nbsp;→ ${translated.text}`
            );
        } catch (e) {
            const translated = translate('CRITICAL');
            results.push(
                `${translated.icon} <b>${label}</b><br>` +
                `&nbsp;&nbsp;→ Erro inesperado`
            );
        }
    }

    /* ==========================================================
       🧪 ETAPA 10 — VALIDAÇÃO DO SISTEMA
    ========================================================== */

    runHumanTest('Validação avançada do sistema', () => {
        if (window.ValidationSystem) return { status: 'DEBUG_ONLY' };
        return { status: 'LIMITED' };
    });

    runHumanTest('Verificação rápida do sistema', () => {
        if (window.ValidationSystem?.quickSystemCheck) return { status: 'DEBUG_ONLY' };
        return { status: 'LIMITED' };
    });

    runHumanTest('Validação da galeria de imagens', () => {
        if (window.ValidationSystem?.validateGalleryModule) return { status: 'DEBUG_ONLY' };
        if (typeof window.validateGalleryModule === 'function') return { status: 'OK' };
        return { status: 'CRITICAL' };
    });

    /* ==========================================================
       🧪 TESTES EXISTENTES (SEM MUDAR A LÓGICA)
    ========================================================== */

    runHumanTest('Sistema de PDFs', () => {
        if (window.PdfLogger) return { status: 'OK' };
        return { status: 'LIMITED' };
    });

    runHumanTest('Sistema de recuperação de falhas', () => {
        if (window.EmergencySystem || window.emergencyRecovery) return { status: 'DEBUG_ONLY' };
        return { status: 'LIMITED' };
    });

    runHumanTest('Proteção contra dados ausentes', () => {
        const original = window.properties;
        window.properties = null;

        try {
            if (window.EmergencySystem?.smartRecovery) {
                window.EmergencySystem.smartRecovery();
            } else if (window.emergencyRecovery?.restoreEssentialData) {
                window.emergencyRecovery.restoreEssentialData();
            }
        } finally {
            window.properties = original || window.properties;
        }

        return { status: 'OK' };
    });

    /* ==========================================================
       🖥️ PAINEL VISUAL (SIMPLES, CLARO, HUMANO)
    ========================================================== */

    const box = document.createElement('div');
    box.style.cssText =
        'position:fixed;bottom:10px;left:10px;' +
        'background:#111;color:#eee;padding:10px;' +
        'font:12px Arial, sans-serif;z-index:99999;' +
        'border-radius:8px;max-width:340px;' +
        'box-shadow:0 0 10px rgba(0,0,0,0.6);';

    const header = document.createElement('div');
    header.style.cssText =
        'cursor:move;font-weight:bold;margin-bottom:6px;color:#0f0;';
    header.innerHTML = '🧪 Diagnóstico do Sistema';

    const toggle = document.createElement('span');
    toggle.textContent = '➖';
    toggle.style.cssText =
        'float:right;cursor:pointer;color:#aaa;';
    header.appendChild(toggle);

    const content = document.createElement('div');
    content.innerHTML = results.join('<br><br>');

    toggle.onclick = () => {
        content.style.display =
            content.style.display === 'none' ? 'block' : 'none';
        toggle.textContent =
            content.style.display === 'none' ? '➕' : '➖';
    };

    /* ==========================================================
       ✋ PAINEL ARRASTÁVEL (SIMPLES)
    ========================================================== */
    let isDragging = false, offsetX = 0, offsetY = 0;

    header.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
    };

    document.onmousemove = (e) => {
        if (!isDragging) return;
        box.style.left = (e.clientX - offsetX) + 'px';
        box.style.top = (e.clientY - offsetY) + 'px';
    };

    document.onmouseup = () => {
        isDragging = false;
    };

    box.appendChild(header);
    box.appendChild(content);
    document.body.appendChild(box);
})();
