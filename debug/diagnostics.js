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
        // Buscar todos os scripts carregados no documento
        const scripts = document.querySelectorAll('script[src]');
        const scriptNames = [];

        scripts.forEach(script => {
            const src = script.src;
            const filename = src.substring(src.lastIndexOf('/') + 1);
            scriptNames.push(filename);
        });

        return scriptNames;
    };

    /* ========= FILTRAR MÓDULOS DO REPOSITÓRIO DE SUPORTE ========= */
    const allLoadedModules = getLoadedScripts();
    const supportModules = allLoadedModules.filter(module => 
        !module.includes('core-') && module.includes('weberlessa-support')
    );

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
                `Módulo ${index + 1}: ${module} → Carregado`,
                `Presente no runtime`
            );
        });
    }

    /* ========= TESTES DE FUNCIONALIDADE (FUNÇÕES ESSENCIAIS) ========= */

    // Teste 1: Verificando se o repositório de suporte foi carregado corretamente
    run('Teste 1: Repositório de Suporte Carregado', () => {
        if (!supportModules.length) {
            throw new Error('Repositório de Suporte não carregado corretamente');
        }
    });

    // Teste 2: Verificando se as funções essenciais estão presentes
    run('Teste 2: Verificação de Funções Essenciais', () => {
        if (typeof window.ValidationSystem === 'undefined') {
            throw new Error('ValidationSystem não está carregado');
        }
        if (typeof window.ValidationSystem.validateGalleryModule === 'undefined') {
            throw new Error('Função validateGalleryModule não está presente');
        }
        if (typeof window.ValidationSystem.quickSystemCheck === 'undefined') {
            throw new Error('Função quickSystemCheck não está presente');
        }
        if (typeof window.ValidationSystem.fullSystemCheck === 'undefined') {
            throw new Error('Função fullSystemCheck não está presente');
        }
        if (typeof window.EmergencySystem === 'undefined') {
            throw new Error('EmergencySystem não está presente');
        }
        if (typeof PdfLogger === 'undefined') {
            throw new Error('PdfLogger não está presente');
        }
        if (typeof PdfLogger.simple !== 'function') {
            throw new Error('PdfLogger.simple não está presente');
        }
    });

    // Teste 3: Verificação de Módulos Essenciais
    run('Teste 3: Verificação de Módulos Essenciais', () => {
        const essentialModules = [
            'function-verifier.js', 'media-logger.js', 'media-recovery.js', 'pdf-logger.js',
            'diagnostics.js', 'duplication-checker.js', 'emergency-recovery.js', 'simple-checker.js',
            'validation.js', 'validation-essentials.js'
        ];

        essentialModules.forEach(module => {
            if (!supportModules.includes(module)) {
                throw new Error(`Módulo essencial ausente: ${module}`);
            }
        });
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
