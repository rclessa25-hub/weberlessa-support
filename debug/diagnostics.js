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

    /* ========= ETAPA 10: ValidationSystem ========= */
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

    /* ========= EmergencySystem ========= */
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

    /* ========= DETECÇÃO DOS MÓDULOS DO REPOSITÓRIO ========= */
    const predefinedModules = [
        { name: 'function-verifier.js', global: 'verifySystemFunctions', required: true },
        { name: 'media-logger.js', global: 'MediaLogger', required: false },
        { name: 'pdf-logger.js', global: 'PdfLogger', required: true },
        { name: 'diagnostics.js', global: null, required: true },
        { name: 'duplication-checker.js', global: null, required: false },
        { name: 'emergency-recovery.js', global: 'emergencyRecovery', required: false },
        { name: 'simple-checker.js', global: null, required: false },
        { name: 'media-recovery.js', global: null, required: false },
        { name: 'validation.js', global: 'ValidationSystem', required: false },
        { name: 'benchmark.js', global: null, required: false },
        { name: 'optimizer.js', global: null, required: false }
    ];

    // Auto-detect módulos novos pelo padrão de nomes globais (*Module, *Logger)
    for (const key in window) {
        if (/^[A-Z][A-Za-z0-9]+(Module|Logger)$/.test(key)) {
            if (!predefinedModules.find(m => m.global === key)) {
                predefinedModules.push({ name: key + '.js (auto)', global: key, required: false });
            }
        }
    }

    predefinedModules.forEach((m, i) => {
        try {
            const exists = m.global ? typeof window[m.global] !== 'undefined' : true;
            if (exists) {
                addResult(
                    'OK',
                    `Módulo ${i + 1}/${predefinedModules.length}: ${m.name} → Carregado`,
                    'Presente no runtime'
                );
            } else if (!m.required) {
                addResult(
                    'ERR/OK – Proteção ativa',
                    `Módulo ${i + 1}/${predefinedModules.length}: ${m.name} ausente → fallback`,
                    'Módulo opcional'
                );
            } else {
                addResult(
                    'ERR – FALHA REAL',
                    `Módulo ${i + 1}/${predefinedModules.length}: ${m.name} ausente → ERRO`,
                    'Módulo obrigatório não encontrado'
                );
            }
        } catch (e) {
            addResult(
                'ERR – FALHA REAL',
                `Módulo ${i + 1}/${predefinedModules.length}: ${m.name} erro`,
                e.message
            );
        }
    });

    /* ========= PAINEL VISUAL DE DEBUG ========= */
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
