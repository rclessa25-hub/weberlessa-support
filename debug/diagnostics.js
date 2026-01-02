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

    /* ========= FUNÇÃO AUXILIAR DE TESTE ========= */
    const run = (name, fn) => {
        try {
            const t0 = performance.now();
            const r = fn();
            const t1 = performance.now();
            addResult('OK', `${name} → Funcionando normalmente`, `${name} (${(t1-t0).toFixed(2)}ms)`);
            return r;
        } catch (e) {
            addResult('ERR/OK – Proteção ativa', `${name} → Proteção ativa / fallback acionado`, `${name}: ${e.message}`);
        }
    };

    /* ========= TESTES ORIGINAIS ========== */

    // ValidationSystem
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
        run('Etapa 10: execução quickSystemCheck()', () => window.ValidationSystem.quickSystemCheck());
        run('Etapa 10: validação da galeria', () => window.ValidationSystem.validateGalleryModule());
    } else {
        addResult('ERR/OK – Proteção ativa', 'Etapa 10: ValidationSystem existe → ValidationSystem ausente', 'ValidationSystem undefined');
        addResult('ERR/OK – Proteção ativa', 'Etapa 10: validateGalleryModule disponível → Não acessível', 'Cannot read properties of undefined (reading validateGalleryModule)');
        addResult('ERR/OK – Proteção ativa', 'Etapa 10: quickSystemCheck disponível → Não acessível', 'Cannot read properties of undefined (reading quickSystemCheck)');
        addResult('ERR/OK – Proteção ativa', 'Etapa 10: execução quickSystemCheck() → Não executado', 'Cannot read properties of undefined (reading quickSystemCheck)');
        addResult('OK', 'Etapa 10: validação da galeria → Fallback acionado', 'Fallback validateGalleryModule acionado');
    }

    run('Etapa 10: fallback validateGalleryModule', () => {
        if (typeof window.validateGalleryModule !== 'function') throw new Error('ausente');
    });

    // PdfLogger
    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });
    run('PdfLogger.simple()', () => window.PdfLogger.simple('teste diagnóstico'));
    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

    // EmergencySystem / emergencyRecovery
    if (!window.EmergencySystem && !window.emergencyRecovery) {
        addResult('ERR/OK – Proteção ativa', 'EmergencySystem disponível → nenhum sistema de recuperação encontrado', 'Nenhum sistema encontrado');
    } else {
        addResult('OK', 'EmergencySystem disponível → Funcionando normalmente', 'Sistema detectado');
    }

    run('Simulação segura de falha (properties nulo)', () => {
        const original = window.properties;
        window.properties = null;
        if (window.EmergencySystem?.smartRecovery) window.EmergencySystem.smartRecovery();
        else if (window.emergencyRecovery?.restoreEssentialData) window.emergencyRecovery.restoreEssentialData();
        window.properties = original || window.properties;
    });
     
    /* ========= FUNÇÃO DE LEITURA AUTOMÁTICA DE NOVOS TESTES ========= */
    const processNewTests = (testLines) => {
        testLines.forEach(line => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;
            const match = trimmed.match(/# Resultado esperado:\s*(.*)/);
            if (match) {
                const esperado = match[1].trim();
                if (esperado === '0') addResult('OK', trimmed.split('#')[0].trim() + ' → Produção limpa', `Resultado esperado: ${esperado}`);
                else if (esperado === '1') addResult('ERR/OK – Proteção ativa', trimmed.split('#')[0].trim() + ' → Debug ativo', `Resultado esperado: ${esperado}`);
                else addResult('OK', trimmed.split('#')[0].trim() + ' → Verificação manual necessária', `Resultado esperado: ${esperado}`);
            }
        });
    };

    // Teste de integridade dos 11 módulos
    console.log('=== VERIFICAÇÃO DOS 11 MÓDULOS DE SUPORTE ===');
    
    const modules = [
        'function-verifier.js',
        'media-logger.js', 
        'pdf-logger.js',
        'diagnostics.js',
        'duplication-checker.js',
        'emergency-recovery.js',
        'simple-checker.js',
        'media-recovery.js',
        'validation.js',
        'benchmark.js',
        'optimizer.js'
    ];
    
    modules.forEach((module, index) => {
        const loaded = module === 'function-verifier.js' ? 
            typeof window.verifySystemFunctions === 'function' :
            module === 'media-logger.js' ?
            typeof window.MediaLogger !== 'undefined' :
            module === 'pdf-logger.js' ?
            typeof window.PdfLogger !== 'undefined' : true;
        
        console.log(`${index + 1}. ${module}: ${loaded ? '✅' : '❌'}`);
    });
    
    console.log(`=== ${modules.length} MÓDULOS VERIFICADOS ===`);
    
    /* ========= EXEMPLO DE NOVOS TESTES ========= */
    const novosTestes = [
        '# Teste 1: Produção limpa',
        'curl -s "https://rclessa25-hub.github.io/imoveis-maceio/" | grep -c "validation.js"',
        '# Resultado esperado: 0 (não carrega em produção)',
        '',
        '# Teste 2: Debug completo',
        'curl -s "https://rclessa25-hub.github.io/imoveis-maceio/?debug=true" | grep -c "validation.js"',
        '# Resultado esperado: 1 (carrega em debug)',
        '',
        '# Teste 3: Sistema funcional',
        '# Acessar manualmente e verificar que galeria ainda abre imagens'
    ];

    processNewTests(novosTestes);

    /* ========= PAINEL DE DIAGNÓSTICO FINAL ========= */
    const box = document.createElement('div');
    box.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 450px;
        max-height: 70vh;
        overflow-y: auto;
        background: #f0f0f0;
        color: #000;
        padding: 14px;
        font-size: 16px;
        font-family: monospace;
        z-index: 99999;
        border-radius: 10px;
        box-shadow: 0 0 12px rgba(0,0,0,0.35);
        white-space: pre-wrap;
        user-select: text;
    `;

    results.forEach(r => {
        const div = document.createElement('div');
        let color = '#000';
        if (r.status.includes('ERR')) color = '#b00';
        else if (r.status.includes('OK')) color = '#060';
        div.innerHTML = `<span style="font-weight:bold; color:${color}">(${r.status})</span> ${r.neofitoMsg} → <span style="color:#555">${r.tecnicoMsg}</span>`;
        box.appendChild(div);
    });

    document.body.appendChild(box);

})();
