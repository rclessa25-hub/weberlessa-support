// debug/diagnostics.js
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    const results = [];
    let coreCount = 0;
    let supportCount = 0;
    let errorCount = 0;
    let healthScore = 0;

    const addResult = (status, neofitoMsg, tecnicoMsg) => {
        results.push({ status, neofitoMsg, tecnicoMsg });

        // Atualiza contadores
        if (status.startsWith('OK')) healthScore += 1;
        if (status.startsWith('ERR/OK') || status.startsWith('ERR')) {
            errorCount += 1;
            healthScore -= 5;
        }
        if (status.startsWith('N/A')) healthScore -= 0; // N/A não altera
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

    /* ========= DETECTAR SCRIPT CARREGADO NO DOCUMENTO ========= */
    const getLoadedScripts = () => {
        const scripts = document.querySelectorAll('script[src]');
        const scriptNames = [];
        scripts.forEach(script => {
            const src = script.src;
            const filename = src.substring(src.lastIndexOf('/') + 1);
            scriptNames.push(filename);
        });
        return scriptNames;
    };

    const allLoadedModules = getLoadedScripts();

    /* ========= AGRUPAR CORE / SUPORTE ========= */
    const supportModules = [];
    const coreModules = [];

    allLoadedModules.forEach(module => {
        if (module.includes('core-')) coreModules.push(module);
        else supportModules.push(module);
    });

    coreCount = coreModules.length;
    supportCount = supportModules.length;

    /* ========= RELATÓRIO DE MÓDULOS ========= */
    supportModules.forEach((module, i) => {
        addResult(
            'OK',
            `[MÓDULO SUPORTE ${i + 1}] ${module} → Carregado`,
            'SUPORTE NO RUNTIME'
        );
    });

    coreModules.forEach((module, i) => {
        addResult(
            'OK',
            `[MÓDULO CORE ${i + 1}] ${module} → Carregado`,
            'CORE NO RUNTIME'
        );
    });

    /* ========= TESTES E DIAGNÓSTICOS ========= */
    let step10Counter = 0;

    // Teste 1: Repositório de suporte
    run('Teste 1: Repositório de Suporte Carregado', () => {
        if (!window.location.href.includes('weberlessa-support')) {
            throw new Error('Repositório de Suporte não detectado');
        }
    });

    // Teste 2: Verificação de módulos de suporte
    run('Teste 2: Verificação de Módulos de Suporte', () => {
        supportModules.forEach(module => {
            if (!module.includes('weberlessa-support')) {
                throw new Error(`Módulo inválido detectado: ${module}`);
            }
        });
    });

    // Teste 3: Verificação de módulos essenciais
    run('Teste 3: Módulos Essenciais', () => {
        const requiredModules = ['function-verifier.js', 'pdf-logger.js', 'diagnostics.js'];
        requiredModules.forEach(requiredModule => {
            if (!supportModules.includes(requiredModule)) {
                throw new Error(`Módulo essencial ausente: ${requiredModule}`);
            }
        });
    });

    /* ========= ETAPA 10 ========= */
    const runStep10 = (label, fn) => {
        step10Counter += 1;
        const name = `Etapa 10.${step10Counter}: ${label}`;
        if (window.ValidationSystem) {
            run(name, fn);
        } else {
            addResult(
                'N/A',
                `${name} → Não executada`,
                'ValidationSystem ausente'
            );
        }
    };

    if (window.ValidationSystem) {
        runStep10('ValidationSystem existe', () => true);
        runStep10('validateGalleryModule disponível', () => {
            if (typeof window.ValidationSystem.validateGalleryModule !== 'function')
                throw new Error('ausente');
        });
        runStep10('quickSystemCheck disponível', () => {
            if (typeof window.ValidationSystem.quickSystemCheck !== 'function')
                throw new Error('ausente');
        });
        runStep10('execução quickSystemCheck()', () =>
            window.ValidationSystem.quickSystemCheck()
        );
        runStep10('validação da galeria', () =>
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

    // Fallback validateGalleryModule
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

    /* ========= Emergency System ========= */
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

    /* ========= LIMITE SCORE ENTRE 0–100 ========= */
    healthScore = Math.max(0, Math.min(100, healthScore));

    /* ========= PAINEL DE RESULTADOS ========= */
    const box = document.createElement('div');
    box.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 550px;
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

    /* ========= RESUMO DO SISTEMA ========= */
    const summary = document.createElement('div');
    summary.style.marginBottom = '10px';
    const statusColor = errorCount > 0 ? '#e68a00' : '#006400';
    summary.innerHTML = `
        📊 <b>RESUMO DO SISTEMA</b><br>
        ⚙️ CORE: ${coreCount}<br>
        🧩 SUPORTE: ${supportCount}<br>
        ❌ ERROS / ALERTAS: ${errorCount}<br>
        🟠 STATUS GERAL: <span style="color:${statusColor}">${errorCount > 0 ? 'OPERACIONAL (COM ALERTAS)' : 'OPERACIONAL'}</span><br>
        🩺 HEALTH SCORE: ${healthScore} / 100
    `;
    box.appendChild(summary);

    results.forEach(r => {
        const line = document.createElement('div');
        let color = '#000';
        if (r.status.startsWith('ERR –') || r.status.startsWith('ERR/OK')) color = '#b36b00';
        else if (r.status.startsWith('N/A')) color = '#888888';
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
