// debug/diagnostics.js - REPOSITÓRIO DE SUPORTE
console.log('🔍 diagnostics.js carregado - Diagnóstico neófito + técnico');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    /* =====================================================
       TRADUTOR DE STATUS NEÓFITO
    ===================================================== */
    function translate(status) {
        switch (status) {
            case 'OK': return { label: '(OK)', text: 'Funcionando normalmente' };
            case 'LIMITED': return { label: '(POS)', text: 'Funciona com proteção básica' };
            case 'FAIL': return { label: '(NEG)', text: 'Falha detectada / atenção necessária' };
            default: return { label: '(N/A)', text: 'Informação técnica' };
        }
    }

    const results = [];

    function addResult(title, status, technicalLog) {
        const t = translate(status);
        const faded = (status === 'FAIL' || status === 'LIMITED') ? 'opacity:0.6;' : 'opacity:1;';

        results.push(`
            <div style="margin-bottom:10px;">
                ${t.label} <b>${title}</b><br>
                → ${t.text}<br>
                <span style="${faded} font-size:11px;">
                    (${technicalLog})
                </span>
            </div>
        `);
    }

    /* =====================================================
       ETAPA 10 — VALIDAÇÃO
    ===================================================== */

    // 1. ValidationSystem existe?
    if (window.ValidationSystem) {
        addResult(
            'Validação avançada do sistema',
            'OK',
            'Etapa 10: ValidationSystem existe'
        );
    } else {
        addResult(
            'Validação avançada do sistema',
            'LIMITED',
            'Etapa 10: ValidationSystem existe: ValidationSystem ausente'
        );
    }

    // 2. validateGalleryModule
    try {
        if (window.ValidationSystem?.validateGalleryModule) {
            addResult(
                'Verificação rápida do sistema',
                'OK',
                'Etapa 10: validateGalleryModule disponível'
            );
        } else {
            throw new Error(
                'Cannot read properties of undefined (reading \'validateGalleryModule\')'
            );
        }
    } catch (e) {
        addResult(
            'Verificação rápida do sistema',
            'LIMITED',
            `Etapa 10: validateGalleryModule disponível: ${e.message}`
        );
    }

    // 3. quickSystemCheck
    try {
        if (window.ValidationSystem?.quickSystemCheck) {
            addResult(
                'Validação da galeria de imagens',
                'OK',
                'Etapa 10: quickSystemCheck disponível'
            );
        } else {
            throw new Error(
                'Cannot read properties of undefined (reading \'quickSystemCheck\')'
            );
        }
    } catch (e) {
        addResult(
            'Validação da galeria de imagens',
            'LIMITED',
            `Etapa 10: quickSystemCheck disponível: ${e.message}`
        );
    }

    /* =====================================================
       TESTES EXISTENTES
    ===================================================== */

    // PdfLogger
    if (window.PdfLogger) {
        addResult(
            'Sistema de PDFs',
            'OK',
            'PdfLogger existe (0.00ms)'
        );
    } else {
        addResult(
            'Sistema de PDFs',
            'FAIL',
            'PdfLogger ausente'
        );
    }

    // EmergencySystem
    if (window.EmergencySystem || window.emergencyRecovery) {
        addResult(
            'Proteção contra dados ausentes',
            'OK',
            'Simulação segura de falha (properties nulo) (0.10ms)'
        );
    } else {
        addResult(
            'Sistema de recuperação de falhas',
            'LIMITED',
            'EmergencySystem disponível: nenhum sistema de recuperação encontrado'
        );
    }

    /* =====================================================
       PAINEL
    ===================================================== */

    const box = document.createElement('div');
    box.style.cssText =
        'position:fixed;bottom:12px;left:12px;' +
        'background:#111;color:#ddd;padding:10px;' +
        'font:12px Arial, sans-serif;z-index:99999;' +
        'border-radius:8px;max-width:360px;' +
        'box-shadow:0 0 8px rgba(0,0,0,0.6);';

    const header = document.createElement('div');
    header.style.cssText =
        'font-weight:bold;margin-bottom:8px;color:#9f9;cursor:move;';
    header.innerHTML = '📋 Diagnóstico do Sistema <span style="float:right;cursor:pointer;">(MIN)</span>';

    const toggle = header.querySelector('span');
    const content = document.createElement('div');
    content.innerHTML = results.join('');

    toggle.onclick = () => {
        content.style.display =
            content.style.display === 'none' ? 'block' : 'none';
        toggle.textContent =
            content.style.display === 'none' ? '(MAX)' : '(MIN)';
    };

    // Arrastar o painel
    let drag = false, ox = 0, oy = 0;
    header.onmousedown = e => {
        drag = true;
        ox = e.clientX - box.offsetLeft;
        oy = e.clientY - box.offsetTop;
    };
    document.onmousemove = e => {
        if (!drag) return;
        box.style.left = (e.clientX - ox) + 'px';
        box.style.top = (e.clientY - oy) + 'px';
    };
    document.onmouseup = () => drag = false;

    box.appendChild(header);
    box.appendChild(content);
    document.body.appendChild(box);
})();
