/* ================== MÓDULO DE ANÁLISE DE FUNÇÕES (DIAGNOSTICS57) ================== */
// Versão: 5.7.1 - ATUALIZADO: 11/02/2026
// ✅ Compatível com a arquitetura de dois repositórios.
// ✅ Removeu-se análise do obsoleto 'pdf-utils.js'.
// ✅ Corrigida a injeção do botão de diagnóstico na tela.
// ✅ Mantém painel visual, logs no console e comando global.

console.log('🎯 MÓDULO DE ANÁLISE v5.7.1 (DIAGNOSTICS57) CARREGADO');

// ================== INICIALIZAÇÃO GARANTIDA ==================
(function initializeFunctionAnalysisModule() {
    console.group('🚀 INICIALIZANDO ANÁLISE DE FUNÇÕES v5.7.1');

    // Registrar no painel (fallback seguro)
    if (typeof window.logToPanel === 'function') {
        window.logToPanel('✅ Módulo de análise v5.7.1 carregado', 'success');
    } else {
        window.logToPanel = function(message, type = 'info') {
            console.log(`[PAINEL] ${message}`);
        };
        window.logToPanel('✅ Módulo de análise v5.7.1 carregado', 'success');
    }

    if (typeof window.updateStatus === 'function') {
        window.updateStatus('Módulo de análise v5.7.1 pronto', 'success');
    }

    console.log('✅ Análise de funções v5.7.1 inicializada');
    console.groupEnd();

    // Registrar versão
    window.DIAGNOSTICS_VERSION = window.DIAGNOSTICS_VERSION || {};
    window.DIAGNOSTICS_VERSION.functionAnalysis = '5.7.1';
})();

/* ================== FUNÇÃO PRINCIPAL DE ANÁLISE ================== */
window.analyzePdfUtilsUsage = function() {
    console.group('🔍 ANÁLISE DE USO DE FUNÇÕES (v5.7.1 - SISTEMA ATUAL)');

    if (window.logToPanel) {
        window.logToPanel('🔍 Iniciando análise de funções do sistema...', 'info');
    }

    // --- ATUALIZAÇÃO CRÍTICA: Módulo 'pdf-utils.js' NÃO EXISTE MAIS ---
    const coreModules = [
        'PdfSystem',
        'MediaSystem',
        'LoadingManager',
        'FilterManager',
        'SharedCore',
        'propertyTemplates'
    ];

    const pdfUnifiedMethods = [
        'PdfSystem.init',
        'PdfSystem.showModal',
        'PdfSystem.validatePasswordAndShowList',
        'PdfSystem.closeModal'
    ];

    const results = {
        modules: {},
        usageSummary: {
            totalModules: coreModules.length,
            availableModules: 0,
            unavailableModules: 0
        },
        recommendations: [],
        timestamp: new Date().toISOString(),
        version: '5.7.1'
    };

    console.log('📋 Analisando módulos do Core System...');

    // 1. Verificar disponibilidade dos módulos principais
    coreModules.forEach(moduleName => {
        const isAvailable = typeof window[moduleName] !== 'undefined';
        results.modules[moduleName] = {
            exists: isAvailable,
            type: isAvailable ? typeof window[moduleName] : 'ausente'
        };

        if (isAvailable) {
            results.usageSummary.availableModules++;
            console.log(`✅ ${moduleName}: DISPONÍVEL (${typeof window[moduleName]})`);
        } else {
            results.usageSummary.unavailableModules++;
            console.warn(`⚠️ ${moduleName}: NÃO DISPONÍVEL`);
            results.recommendations.push(`Verificar carregamento de ${moduleName}`);
        }
    });

    // 2. Verificar métodos específicos do PdfSystem
    if (window.PdfSystem) {
        pdfUnifiedMethods.forEach(methodPath => {
            const [obj, method] = methodPath.split('.');
            const isAvailable = window[obj] && typeof window[obj][method] === 'function';
            console.log(`${isAvailable ? '✅' : '❌'} ${methodPath}: ${isAvailable ? 'disponível' : 'ausente'}`);
        });
    }

    // --- RECOMENDAÇÃO AUTOMÁTICA (LEGADO REMOVIDO) ---
    if (results.usageSummary.availableModules === coreModules.length) {
        results.recommendations.push('✅ Core System completo e funcional');
    } else {
        results.recommendations.push('⚠️ Módulos ausentes: verifique carregamento condicional (?debug=true)');
    }

    // LOG NO PAINEL
    if (window.logToPanel) {
        const successRate = Math.round((results.usageSummary.availableModules / results.usageSummary.totalModules) * 100);
        window.logToPanel(`📊 Análise concluída: ${results.usageSummary.availableModules}/${results.usageSummary.totalModules} módulos disponíveis (${successRate}%)`,
                         successRate > 80 ? 'success' : 'warning');
    }

    // EXIBIR PAINEL VISUAL
    setTimeout(() => {
        showFunctionUsageReport(results);
    }, 300);

    console.groupEnd();
    return results;
};

/* ================== PAINEL DE RELATÓRIO VISUAL ================== */
function showFunctionUsageReport(results) {
    const reportId = 'function-usage-report-v5-7-1';

    // Remover relatório anterior se existir
    const existingReport = document.getElementById(reportId);
    if (existingReport) existingReport.remove();

    const missingModules = Object.entries(results.modules)
        .filter(([_, data]) => !data.exists)
        .map(([name]) => name);

    // Criar novo painel
    const reportDiv = document.createElement('div');
    reportDiv.id = reportId;
    reportDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #0a0a2a, #001a33);
        color: #00aaff;
        padding: 25px;
        border: 3px solid ${missingModules.length > 0 ? '#ffaa00' : '#00ff9c'};
        border-radius: 10px;
        z-index: 1000010;
        max-width: 800px;
        width: 95%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 40px rgba(0, 170, 255, 0.5);
        font-family: monospace;
        backdrop-filter: blur(10px);
    `;

    // Conteúdo do painel
    reportDiv.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 24px; color: #00aaff; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>🔍</span>
                <span>DIAGNÓSTICO DO CORE SYSTEM</span>
            </div>
            <div style="font-size: 16px; color: #88aaff; margin-top: 5px;">
                Módulos Essenciais - v5.7.1
            </div>
            <div style="font-size: 12px; color: #4488ff; margin-top: 5px;">
                ${new Date().toLocaleTimeString()}
            </div>
            <div style="font-size: 11px; color: #ffaa88; margin-top: 8px; background: rgba(255,170,0,0.2); padding: 4px; border-radius: 4px;">
                ⚠️ pdf-utils.js foi removido (substituído por pdf-unified.js)
            </div>
        </div>

        <div style="background: rgba(0, 170, 255, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; 
                    border: 1px solid rgba(0, 170, 255, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">TOTAL MÓDULOS</div>
                    <div style="font-size: 32px; color: #00aaff;">${results.usageSummary.totalModules}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">DISPONÍVEIS</div>
                    <div style="font-size: 32px; color: #00ff9c;">${results.usageSummary.availableModules}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">AUSENTES</div>
                    <div style="font-size: 32px; color: ${missingModules.length > 0 ? '#ffaa00' : '#00ff9c'}">${missingModules.length}</div>
                </div>
            </div>
        </div>

        ${missingModules.length > 0 ? `
        <div style="margin-bottom: 20px;">
            <div style="color: #ffaa00; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span>⚠️</span>
                <span>MÓDULOS NÃO CARREGADOS</span>
            </div>
            <div style="background: rgba(255, 170, 0, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(255, 170, 0, 0.3);">
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    ${missingModules.map(mod => `
                        <div style="padding: 8px; background: rgba(255, 170, 0, 0.2); border-radius: 4px; 
                                    border-left: 3px solid #ffaa00; display: flex; align-items: center; gap: 8px;">
                            <span style="color: #ffaa00;">⚠️</span>
                            <span style="color: #ffcc88;">${mod}</span>
                        </div>
                    `).join('')}
                </div>
                <div style="color: #ffcc88; font-size: 13px; margin-top: 12px; padding-top: 10px; border-top: 1px dashed rgba(255,170,0,0.5);">
                    ✅ Verifique se a URL contém <strong>?debug=true</strong> para carregar módulos de suporte.
                </div>
            </div>
        </div>
        ` : `
        <div style="margin-bottom: 20px; background: rgba(0,255,156,0.1); padding: 15px; border-radius: 6px; border: 1px solid #00ff9c; text-align: center;">
            <span style="color: #00ff9c; font-size: 18px;">✅ TODOS OS MÓDULOS ESSENCIAIS ESTÃO CARREGADOS</span>
        </div>
        `}

        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
            <button id="run-analysis-again" style="
                background: linear-gradient(45deg, #00aaff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;
                transition: transform 0.2s, box-shadow 0.2s;">
                🔄 ANALISAR NOVAMENTE
            </button>
            <button id="close-report" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;
                transition: transform 0.2s, box-shadow 0.2s;">
                FECHAR
            </button>
        </div>
        <div style="font-size: 11px; color: #88aaff; text-align: center; margin-top: 15px;">
            📌 pdf-utils.js foi descontinuado. Utilize PdfSystem (pdf-unified.js) e MediaSystem.
        </div>
    `;

    document.body.appendChild(reportDiv);

    // Eventos dos botões
    const btnAgain = document.getElementById('run-analysis-again');
    const btnClose = document.getElementById('close-report');

    if (btnAgain) {
        btnAgain.onmouseenter = () => { btnAgain.style.transform = 'translateY(-2px)'; btnAgain.style.boxShadow = '0 4px 12px rgba(0,170,255,0.4)'; };
        btnAgain.onmouseleave = () => { btnAgain.style.transform = 'translateY(0)'; btnAgain.style.boxShadow = 'none'; };
        btnAgain.addEventListener('click', () => {
            reportDiv.remove();
            if (window.analyzePdfUtilsUsage) window.analyzePdfUtilsUsage();
        });
    }

    if (btnClose) {
        btnClose.onmouseenter = () => { btnClose.style.transform = 'translateY(-2px)'; btnClose.style.boxShadow = '0 4px 12px rgba(100,100,100,0.4)'; };
        btnClose.onmouseleave = () => { btnClose.style.transform = 'translateY(0)'; btnClose.style.boxShadow = 'none'; };
        btnClose.addEventListener('click', () => reportDiv.remove());
    }

    console.log('✅ Painel de diagnóstico v5.7.1 exibido na tela');
}

/* ================== BOTÃO FLUTUANTE (CORREÇÃO) ================== */
function addFloatingDiagnosticButton() {
    // Evitar duplicação
    if (document.getElementById('diagnostics-float-btn-v5-7-1')) return;

    console.log('🔧 Adicionando botão flutuante de diagnóstico...');

    const btn = document.createElement('button');
    btn.id = 'diagnostics-float-btn-v5-7-1';
    btn.innerHTML = '🔍 DIAGNÓSTICO v5.7.1';
    btn.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: linear-gradient(145deg, #00aaff, #0066aa);
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 40px;
        font-weight: bold;
        font-size: 14px;
        box-shadow: 0 4px 15px rgba(0,170,255,0.5);
        cursor: pointer;
        z-index: 1000020;
        border: 2px solid white;
        transition: transform 0.2s, box-shadow 0.2s;
        display: flex;
        align-items: center;
        gap: 8px;
    `;

    btn.onmouseenter = () => { btn.style.transform = 'scale(1.05)'; btn.style.boxShadow = '0 6px 20px rgba(0,170,255,0.7)'; };
    btn.onmouseleave = () => { btn.style.transform = 'scale(1)'; btn.style.boxShadow = '0 4px 15px rgba(0,170,255,0.5)'; };
    btn.onclick = () => {
        if (window.analyzePdfUtilsUsage) window.analyzePdfUtilsUsage();
    };

    document.body.appendChild(btn);
    console.log('✅ Botão flutuante de diagnóstico adicionado.');

    // Log no painel
    if (window.logToPanel) {
        window.logToPanel('✅ Botão flutuante de diagnóstico v5.7.1 adicionado', 'success');
    }
}

/* ================== COMANDOS RÁPIDOS (CONSOLE) ================== */
console.log('%c🎯 COMANDOS DE DIAGNÓSTICO v5.7.1 DISPONÍVEIS:', 'color: #00aaff; font-weight: bold; font-size: 14px;');
console.log('%c• analyzeFunctions() - Analisa módulos do Core System', 'color: #88aaff;');
console.log('%c• showFunctionReport() - Exibe painel de diagnóstico', 'color: #88aaff;');
console.log('%c• addDiagnosticButton() - Adiciona botão flutuante', 'color: #88aaff;');
console.log('%c• window.PdfSystem - Sistema PDF unificado', 'color: #88aaff;');
console.log('%c• window.MediaSystem - Sistema de mídia unificado', 'color: #88aaff;');

// Aliases
window.analyzeFunctions = window.analyzePdfUtilsUsage;
window.showFunctionReport = function() {
    const mockResults = {
        modules: { SharedCore: { exists: true }, PdfSystem: { exists: true }, MediaSystem: { exists: true }, LoadingManager: { exists: true }, FilterManager: { exists: true }, propertyTemplates: { exists: true } },
        usageSummary: { totalModules: 6, availableModules: 6, unavailableModules: 0 },
        timestamp: new Date().toISOString(),
        version: '5.7.1'
    };
    showFunctionUsageReport(mockResults);
};
window.addDiagnosticButton = addFloatingDiagnosticButton;

/* ================== EXECUÇÃO AUTOMÁTICA ================== */
function autoInitialize() {
    console.log('📄 Inicializando diagnóstico v5.7.1...');

    // Adicionar botão flutuante (sempre em modo debug)
    if (window.location.search.includes('debug=true') || window.location.search.includes('diagnostics=true')) {
        setTimeout(addFloatingDiagnosticButton, 1500);

        // Executar análise automática após 2.5s
        setTimeout(() => {
            console.log('🔄 Executando análise automática do sistema...');
            if (window.analyzePdfUtilsUsage) {
                window.analyzePdfUtilsUsage();
            }
        }, 2500);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInitialize);
} else {
    autoInitialize();
}

// Log de confirmação visual no console
console.log('%c✅ DIAGNOSTICS57 v5.7.1 PRONTO - SISTEMA ATUALIZADO', 
            'color: #00ff9c; font-weight: bold; font-size: 14px; background: #001a33; padding: 5px; border-left: 5px solid #00aaff;');
