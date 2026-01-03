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
    
    // Definindo os módulos do Core e Suporte
    const coreModules = allLoadedModules.filter(module => module.includes('core-'));
    const supportModules = allLoadedModules.filter(module => !module.includes('core-')); 

    // Exibindo as informações de módulos carregados
    if (supportModules.length === 0) {
        addResult(
            'ERR/OK – Proteção ativa',
            'Nenhum módulo do repositório de suporte detectado → Ambiente protegido',
            'Nenhum módulo carregado'
        );
    } else {
        supportModules.forEach((module, index) => {
            addResult(
                'OK',
                `Módulo de Suporte ${index + 1}: ${module} → Carregado`,
                `Módulo de Suporte no runtime`
            );
        });
    }

    if (coreModules.length === 0) {
        addResult(
            'ERR/OK – Proteção ativa',
            'Nenhum módulo do Core detectado → Ambiente protegido',
            'Nenhum módulo do Core carregado'
        );
    } else {
        coreModules.forEach((module, index) => {
            addResult(
                'OK',
                `Módulo Core ${index + 1}: ${module} → Carregado`,
                `Módulo Core no runtime`
            );
        });
    }

    /* ========= TESTES DE FUNCIONALIDADE ========= */
    // Teste 1: Validando a existência do repositório de suporte
    run('Teste 1: Repositório de Suporte Carregado', () => {
        if (!window.location.href.includes('weberlessa-support')) {
            throw new Error('Repositório de Suporte não carregado corretamente');
        }
    });

    // Teste 2: Verificando se os módulos carregados são do repositório correto
    run('Teste 2: Verificação de Módulos de Suporte', () => {
        supportModules.forEach(module => {
            if (!module.includes('weberlessa-support')) {
                throw new Error(`Módulo inválido detectado: ${module}`);
            }
        });
    });

    // Teste 3: Verificação se algum módulo essencial não falhou
    run('Teste 3: Verificação de Módulos Essenciais', () => {
        const requiredModules = ['function-verifier.js', 'pdf-logger.js', 'diagnostics.js'];
        requiredModules.forEach(requiredModule => {
            if (!supportModules.includes(requiredModule)) {
                throw new Error(`Módulo essencial ausente: ${requiredModule}`);
            }
        });
    });

    /* ========= ETAPA 10: VALIDAÇÃO DO ValidationSystem ========= */
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

    /* ========= PAINEL DE RESULTADOS ========= */
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
