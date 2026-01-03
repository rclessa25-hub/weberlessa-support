// debug/diagnostics.js
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    /* ========= STORAGE ========= */
    const coreResults = [];
    const supportResults = [];
    const generalResults = [];
    let errorCount = 0;

    /* ========= HELPERS ========= */
    const countIfError = status => {
        if (status.includes('ERR')) errorCount++;
    };

    const addSupport = (status, neofitoMsg, tecnicoMsg) => {
        countIfError(status);
        supportResults.push({ status, neofitoMsg, tecnicoMsg });
    };

    const addCore = (status, neofitoMsg, tecnicoMsg) => {
        countIfError(status);
        coreResults.push({ status, neofitoMsg, tecnicoMsg });
    };

    const addGeneral = (status, neofitoMsg, tecnicoMsg) => {
        countIfError(status);
        generalResults.push({ status, neofitoMsg, tecnicoMsg });
    };

    const run = (name, fn) => {
        try {
            const t0 = performance.now();
            fn();
            const t1 = performance.now();
            addGeneral(
                'OK',
                `${name} → Funcionando normalmente`,
                `${name} (${(t1 - t0).toFixed(2)}ms)`
            );
        } catch (e) {
            addGeneral(
                'ERR/OK – Proteção ativa',
                `${name} → Proteção ativa / fallback acionado`,
                `${name}: ${e.message}`
            );
        }
    };

    /* ========= STATUS GERAL ========= */
    const getOverallStatus = () => {
        if (errorCount === 0)
            return { text: 'OPERACIONAL', color: '#006400', level: 'ok' };

        if (errorCount <= 3)
            return { text: 'OPERACIONAL (COM ALERTAS)', color: '#b36b00', level: 'warn' };

        return {
            text: 'OPERACIONAL (COM PROTEÇÕES ATIVAS)',
            color: '#b00000',
            level: 'error'
        };
    };

    /* ========= DETECTAR SCRIPTS ========= */
    const scripts = [...document.querySelectorAll('script[src]')].map(s =>
        s.src.split('/').pop()
    );

    const coreModules = scripts.filter(s => s.startsWith('core-'));
    const supportModules = scripts.filter(s => !s.startsWith('core-'));

    /* ========= LISTAGEM DE MÓDULOS ========= */
    supportModules.forEach((m, i) =>
        addSupport('OK', `[MÓDULO SUPORTE ${i + 1}] ${m} → Carregado`, 'SUPORTE NO RUNTIME')
    );

    coreModules.forEach((m, i) =>
        addCore('OK', `[MÓDULO CORE ${i + 1}] ${m} → Carregado`, 'CORE NO RUNTIME')
    );

    /* ========= TESTES BÁSICOS ========= */
    run('Teste 1: Repositório de Suporte Carregado', () => {
        if (!location.href.includes('weberlessa-support'))
            throw new Error('Repositório de Suporte não detectado');
    });

    run('Teste 2: Verificação de Módulos de Suporte', () => {
        supportModules.forEach(m => {
            if (m.startsWith('core-')) throw new Error(`Inválido: ${m}`);
        });
    });

    run('Teste 3: Módulos Essenciais', () => {
        ['function-verifier.js', 'pdf-logger.js', 'diagnostics.js'].forEach(r => {
            if (!scripts.includes(r)) throw new Error(`Ausente: ${r}`);
        });
    });

    /* ========= ETAPA 10 — VALIDATIONSYSTEM (DETALHADA) ========= */
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
        addGeneral(
            'ERR/OK – Proteção ativa',
            'Etapa 10: ValidationSystem ausente → Sistema protegido',
            'ValidationSystem undefined'
        );

        addGeneral(
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
        addGeneral(
            'ERR/OK – Proteção ativa',
            'EmergencySystem ausente → Sistema protegido',
            'Nenhum recovery carregado'
        );
    } else {
        addGeneral(
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

    /* ========= PAINEL ========= */
    const box = document.createElement('div');
    box.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 580px;
        max-height: 75vh;
        overflow-y: auto;
        background: #f7f7f7;
        color: #000;
        padding: 14px;
        font-family: monospace;
        z-index: 99999;
        border-radius: 10px;
        box-shadow: 0 0 14px rgba(0,0,0,.35);
    `;

    const overall = getOverallStatus();

    if (overall.level === 'warn') {
        box.style.border = '3px solid #b36b00';
        box.style.background = '#fff8f0';
    }

    if (overall.level === 'error') {
        box.style.border = '3px solid #b00000';
        box.style.background = '#fff0f0';
        box.style.animation = 'diagnosticPulse 2s infinite';
    }

    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes diagnosticPulse {
            0% { box-shadow: 0 0 10px rgba(176,0,0,.4); }
            50% { box-shadow: 0 0 18px rgba(176,0,0,.8); }
            100% { box-shadow: 0 0 10px rgba(176,0,0,.4); }
        }
    `;
    document.head.appendChild(style);

    /* ========= RESUMO ========= */
    const summary = document.createElement('div');
    summary.style.cssText = `
        margin-bottom: 12px;
        padding: 10px;
        background: #fff;
        border-radius: 8px;
        border: 2px solid #ccc;
    `;
    summary.innerHTML = `
        <b>📊 RESUMO DO SISTEMA</b><br>
        ⚙️ CORE: <b>${coreResults.length}</b><br>
        🧩 SUPORTE: <b>${supportResults.length}</b><br>
        ❌ ERROS / ALERTAS: <b>${errorCount}</b><br>
        <b style="color:${overall.color}">
            ${overall.level === 'error' ? '🔴' : overall.level === 'warn' ? '🟠' : '🟢'}
            STATUS GERAL: ${overall.text}
        </b>
    `;
    box.appendChild(summary);

    /* ========= SEÇÕES ========= */
    const renderSection = (title, icon, list) => {
        if (!list.length) return;
        const h = document.createElement('div');
        h.style.cssText =
            'margin:10px 0 6px;font-weight:bold;border-bottom:2px solid #ccc';
        h.textContent = `${icon} ${title} (${list.length})`;
        box.appendChild(h);

        list.forEach(r => {
            const d = document.createElement('div');
            const color = r.status.includes('ERR')
                ? '#b00000'
                : r.status.includes('ERR/OK')
                ? '#b36b00'
                : '#006400';
            d.innerHTML = `
                <span style="color:${color};font-weight:bold">(${r.status})</span>
                ${r.neofitoMsg}
                <div style="margin-left:10px;color:#555">${r.tecnicoMsg}</div>
            `;
            box.appendChild(d);
        });
    };

    renderSection('MÓDULOS SUPORTE', '🧩', supportResults);
    renderSection('MÓDULOS CORE', '⚙️', coreResults);
    renderSection('TESTES E DIAGNÓSTICOS', '🧪', generalResults);

    document.body.appendChild(box);
})();
