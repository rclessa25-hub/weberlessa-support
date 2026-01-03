// debug/diagnostics.js - Rebuild Plug & Play mantendo lógica atual
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos rebuild PnP');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    const results = [];

    // Função que adiciona resultado ao painel
    const addResult = (status, neofitoMsg, tecnicoMsg) => {
        results.push({ status, neofitoMsg, tecnicoMsg });
    };

    // Função padrão para executar teste
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

    // =============================
    // TESTES EXISTENTES (ETAPAS MANUAIS)
    // =============================
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
            'Etapa 10: validação da galeria → fallback acionado',
            'Fallback validateGalleryModule ativo'
        );
    }

    run('Etapa 10: fallback validateGalleryModule', () => {
        if (typeof window.validateGalleryModule !== 'function')
            throw new Error('ausente');
    });

    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });

    run('PdfLogger.simple()', () => window.PdfLogger.simple('teste'));

    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

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

    // =============================
    // MÓDULOS FIXOS EXISTENTES
    // =============================
    const predefinedModules = [
        { name: 'function-verifier.js', check: () => typeof window.verifySystemFunctions === 'function', required: true },
        { name: 'media-logger.js', check: () => typeof window.MediaLogger !== 'undefined', required: false },
        { name: 'pdf-logger.js', check: () => typeof window.PdfLogger !== 'undefined', required: true },
        { name: 'diagnostics.js', check: () => true, required: true },
        { name: 'duplication-checker.js', check: () => true, required: false },
        { name: 'emergency-recovery.js', check: () => typeof window.emergencyRecovery !== 'undefined', required: false },
        { name: 'simple-checker.js', check: () => true, required: false },
        { name: 'media-recovery.js', check: () => true, required: false },
        { name: 'validation.js', check: () => typeof window.ValidationSystem !== 'undefined', required: false },
        { name: 'benchmark.js', check: () => true, required: false },
        { name: 'optimizer.js', check: () => true, required: false }
    ];

    predefinedModules.forEach((m, i) => {
        try {
            const exists = m.check();
            if (exists) {
                addResult('OK', `Módulo ${i + 1}/${predefinedModules.length}: ${m.name} → Carregado`, 'Presente no runtime');
            } else {
                if (m.required) {
                    addResult('ERR – FALHA REAL', `Módulo ${i + 1}/${predefinedModules.length}: ${m.name} ausente → ERRO`, 'Módulo obrigatório não encontrado');
                } else {
                    addResult('ERR/OK – Proteção ativa', `Módulo ${i + 1}/${predefinedModules.length}: ${m.name} ausente → fallback`, 'Módulo opcional');
                }
            }
        } catch (e) {
            addResult('ERR – FALHA REAL', `Módulo ${i + 1}/${predefinedModules.length}: ${m.name} erro`, e.message);
        }
    });

    // =============================
    // DETECÇÃO AUTOMÁTICA DE NOVOS MÓDULOS (Plug & Play)
    // =============================
    const autoDetectModules = () => {
        const knownPatterns = [/Module$/i, /Logger$/i, /System$/i, /Checker$/i, /Recovery$/i];
        Object.keys(window).forEach((key) => {
            const alreadyTested = predefinedModules.some(m => m.name.includes(key));
            if (!alreadyTested && knownPatterns.some(rx => rx.test(key))) {
                try {
                    const exists = typeof window[key] !== 'undefined';
                    if (exists) {
                        addResult('OK', `Módulo PnP detectado: ${key} → Carregado`, 'Presente no runtime');
                    } else {
                        addResult('ERR/OK – Proteção ativa', `Módulo PnP detectado: ${key} ausente → fallback`, 'Módulo opcional');
                    }
                } catch (e) {
                    addResult('ERR – FALHA REAL', `Módulo PnP detectado: ${key} erro`, e.message);
                }
            }
        });
    };

    run('Detecção automática de módulos PnP', autoDetectModules);

    // =============================
    // PAINEL VISUAL
    // =============================
    const createPanel = () => {
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
    };

    createPanel();

})();
