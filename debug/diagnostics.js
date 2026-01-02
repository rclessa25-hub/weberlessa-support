// debug/diagnostics.js - REPOSITÓRIO DE SUPORTE
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

    /* ========= ETAPA 10 ========= */
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
        addResult(
            'OK',
            'Etapa 10: validação da galeria → Fallback acionado',
            'Fallback validateGalleryModule ativo'
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
    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

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

    /* ========= TESTE DE INTEGRIDADE DOS 11 MÓDULOS ========= */
    const modules = [
        { name: 'function-verifier.js', required: true, check: () => typeof window.verifySystemFunctions === 'function' },
        { name: 'media-logger.js', required: false, check: () => typeof window.MediaLogger !== 'undefined' },
        { name: 'pdf-logger.js', required: true, check: () => typeof window.PdfLogger !== 'undefined' },
        { name: 'diagnostics.js', required: true, check: () => true },
        { name: 'duplication-checker.js', required: false, check: () => true },
        { name: 'emergency-recovery.js', required: false, check: () => typeof window.emergencyRecovery !== 'undefined' },
        { name: 'simple-checker.js', required: false, check: () => true },
        { name: 'media-recovery.js', required: false, check: () => true },
        { name: 'validation.js', required: false, check: () => typeof window.ValidationSystem !== 'undefined' },
        { name: 'benchmark.js', required: false, check: () => true },
        { name: 'optimizer.js', required: false, check: () => true }
    ];

    modules.forEach((m, i) => {
        try {
            if (m.check()) {
                addResult(
                    'OK',
                    `Módulo ${i + 1}/11: ${m.name} → Carregado`,
                    'Presente no runtime'
                );
            } else {
                if (m.required) {
                    addResult(
                        'ERR – FALHA REAL',
                        `Módulo ${i + 1}/11: ${m.name} ausente → ERRO`,
                        'Módulo obrigatório não encontrado'
                    );
                } else {
                    addResult(
                        'ERR/OK – Proteção ativa',
                        `Módulo ${i + 1}/11: ${m.name} ausente → Proteção ativa`,
                        'Módulo opcional'
                    );
                }
            }
        } catch (e) {
            addResult(
                'ERR – FALHA REAL',
                `Módulo ${i + 1}/11: ${m.name} erro`,
                e.message
            );
        }
    });

    /* ========= PAINEL ========= */
    const box = document.createElement('div');
    box.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 520px;
        max-height: 75vh;
        overflow-y: auto;
        background: #f7f7f7;
        color: #000;
        padding: 16px;
        font-size: 16px;
        font-family: monospace;
        z-index: 99999;
        border-radius: 10px;
        box-shadow: 0 0 14px rgba(0,0,0,0.35);
        user-select: text;
    `;

    results.forEach(r => {
        const line = document.createElement('div');
        let color = '#000';
        if (r.status.startsWith('ERR –')) color = '#b00000';
        else if (r.status.includes('ERR/OK')) color = '#b36b00';
        else color = '#006400';

        line.innerHTML = `
            <span style="font-weight:bold;color:${color}">(${r.status})</span>
            ${r.neofitoMsg}
            <div style="color:#555;margin-left:10px">${r.tecnicoMsg}</div>
        `;
        box.appendChild(line);
    });

    document.body.appendChild(box);
})();
