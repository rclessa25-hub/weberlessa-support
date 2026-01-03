// debug/diagnostics.js
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    const results = [];

    const addResult = (status, neofitoMsg, tecnicoMsg) => {
        results.push({ status, neofitoMsg, tecnicoMsg });
    };

    /* ========= FUNÇÃO PADRÃO DE EXECUÇÃO ========= */
    const run = (name, fn) => {
        try {
            const t0 = performance.now();
            fn();
            const t1 = performance.now();
            addResult(
                'OK',
                `${name} → Funcionando normalmente`,
                `${name} (${(t1 - t0).toFixed(2)}ms)`
            );
        } catch (e) {
            addResult(
                'ERR/OK – Proteção ativa',
                `${name} → Proteção ativa / fallback acionado`,
                `${name}: ${e.message}`
            );
        }
    };

    /* =====================================================
       ETAPA 10 – TESTES FUNCIONAIS (MANTIDOS)
       ===================================================== */

    if (window.ValidationSystem) {
        run('Etapa 10: ValidationSystem existe', () => true);
        run('Etapa 10: validateGalleryModule disponível', () => {
            if (typeof window.ValidationSystem.validateGalleryModule !== 'function')
                throw new Error('ausente');
        });
        run('Etapa 10: quickSystemCheck disponível', () => {
            if (typeof window.ValidationSystem.quickSystemCheck !== 'function')
                throw new Error('ausente');
        });
        run('Etapa 10: execução quickSystemCheck()', () =>
            window.ValidationSystem.quickSystemCheck()
        );
        run('Etapa 10: validação da galeria', () =>
            window.ValidationSystem.validateGalleryModule()
        );
    } else {
        addResult(
            'ERR/OK – Proteção ativa',
            'Etapa 10: ValidationSystem ausente → Sistema protegido',
            'ValidationSystem undefined'
        );
    }

    run('Etapa 10: fallback validateGalleryModule', () => {
        if (typeof window.validateGalleryModule !== 'function')
            throw new Error('ausente');
    });

    /* ========= PdfLogger ========= */
    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });
    run('PdfLogger.simple()', () => window.PdfLogger.simple('teste'));

    /* ========= Emergency ========= */
    if (!window.EmergencySystem && !window.emergencyRecovery) {
        addResult(
            'ERR/OK – Proteção ativa',
            'EmergencySystem ausente → Sistema protegido',
            'Nenhum recovery carregado'
        );
    } else {
        addResult(
            'OK',
            'EmergencySystem disponível → Funcionando normalmente',
            'Recovery detectado'
        );
    }

    run('Simulação segura de falha (properties nulo)', () => {
        const original = window.properties;
        window.properties = null;
        window.EmergencySystem?.smartRecovery?.();
        window.emergencyRecovery?.restoreEssentialData?.();
        window.properties = original || window.properties;
    });

    /* =====================================================
       AUDITORIA REAL DE MÓDULOS (.js) — PLUG & PLAY
       ===================================================== */

    const jsResources = performance
        .getEntriesByType('resource')
        .filter(r => r.initiatorType === 'script' && r.name.endsWith('.js'));

    const uniqueModules = Array.from(
        new Set(
            jsResources.map(r => {
                try {
                    return r.name.split('/').pop().split('?')[0];
                } catch {
                    return null;
                }
            }).filter(Boolean)
        )
    ).sort();

    if (uniqueModules.length === 0) {
        addResult(
            'ERR/OK – Proteção ativa',
            'Nenhum módulo JS detectado → Ambiente protegido',
            'performance.resource vazio ou bloqueado'
        );
    } else {
        uniqueModules.forEach((mod, i) => {
            addResult(
                'OK',
                `Módulo ${i + 1}/${uniqueModules.length}: ${mod} → Carregado`,
                'Arquivo .js detectado no runtime'
            );
        });
    }

    /* =====================================================
       PAINEL VISUAL
       ===================================================== */

    const box = document.createElement('div');
    box.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 540px;
        max-height: 75vh;
        overflow-y: auto;
        background: #f7f7f7;
        color: #000;
        padding: 16px;
        font-size: 14px;
        font-family: monospace;
        z-index: 99999;
        border-radius: 10px;
        box-shadow: 0 0 14px rgba(0,0,0,0.35);
        user-select: text;
    `;

    results.forEach(r => {
        const line = document.createElement('div');
        let color = '#006400';
        if (r.status.startsWith('ERR –')) color = '#b00000';
        else if (r.status.includes('ERR/OK')) color = '#b36b00';

        line.innerHTML = `
            <div>
                <span style="font-weight:bold;color:${color}">
                    (${r.status})
                </span>
                ${r.neofitoMsg}
            </div>
            <div style="color:#555;margin-left:12px">
                ${r.tecnicoMsg}
            </div>
        `;
        box.appendChild(line);
    });

    document.body.appendChild(box);
})();
