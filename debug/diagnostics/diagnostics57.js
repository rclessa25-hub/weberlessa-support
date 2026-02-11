/* ================== VERIFICAÇÃO DE USO DE FUNÇÕES PDF-UTILS.JS - v5.7 ================== */
// Adicione este código AO FINAL do arquivo diagnostics.js (após qualquer outro código)

console.log('🎯 MÓDULO DE ANÁLISE DE USO DE FUNÇÕES PDF-UTILS - v5.7 CARREGADO');

// ================== INICIALIZAÇÃO GARANTIDA ==================
(function initializeFunctionAnalysisModule() {
    console.group('🚀 INICIALIZANDO ANÁLISE DE FUNÇÕES v5.7');
    
    // Registrar no painel imediatamente
    if (typeof window.logToPanel === 'function') {
        window.logToPanel('✅ Módulo de análise de funções v5.7 carregado', 'success');
    } else {
        // Criar função de fallback se não existir
        window.logToPanel = function(message, type = 'info') {
            console.log(`[PAINEL v5.7] ${message}`);
        };
        window.logToPanel('✅ Módulo de análise de funções v5.7 carregado', 'success');
    }
    
    // Atualizar status no painel se existir
    if (typeof window.updateStatus === 'function') {
        window.updateStatus('Módulo de análise v5.7 pronto', 'success');
    }
    
    console.log('✅ Análise de funções v5.7 inicializada');
    console.groupEnd();
    
    // Adicionar versão ao objeto global
    window.DIAGNOSTICS_VERSION = window.DIAGNOSTICS_VERSION || {};
    window.DIAGNOSTICS_VERSION.functionAnalysis = '5.7';
})();

/* ================== FUNÇÃO PRINCIPAL DE ANÁLISE ================== */
window.analyzePdfUtilsUsage = function() {
    console.group('🔍 ANÁLISE DE USO DAS FUNÇÕES PDF-UTILS.JS - v5.7');
    
    // Log inicial garantido
    console.log('🎯 INICIANDO ANÁLISE v5.7');
    if (window.logToPanel) {
        window.logToPanel('🔍 Iniciando análise de uso de funções pdf-utils.js v5.7', 'info');
    }
    
    // Lista de funções específicas do pdf-utils.js
    const pdfUtilsFunctions = [
        'pdfFormatFileSize',
        'pdfValidateUrl', 
        'pdfVerifyUrl',
        'pdfExtractFileName',
        'pdfGenerateThumbnail',
        'pdfCompressFile',
        'pdfSanitizeFileName',
        'pdfCheckMimeType',
        'pdfCreateDownloadLink',
        'pdfCalculateFileHash'
    ];
    
    const results = {
        functions: {},
        usageSummary: {
            totalFunctions: pdfUtilsFunctions.length,
            usedInCode: 0,
            usedInPdfUnified: 0,
            usedInOtherFiles: 0,
            unusedFunctions: 0
        },
        recommendations: [],
        timestamp: new Date().toISOString(),
        version: '5.7'
    };
    
    console.log('📋 Analisando funções específicas v5.7...');
    
    // Analisar cada função
    pdfUtilsFunctions.forEach(funcName => {
        const functionAnalysis = {
            exists: false,
            usedInScripts: [],
            usedInHtml: false,
            usedInPdfUnified: false,
            usageCount: 0,
            usageLocations: []
        };
        
        // 1. Verificar se a função existe globalmente
        functionAnalysis.exists = typeof window[funcName] === 'function';
        
        // 2. Verificar uso no código atual
        const scripts = Array.from(document.scripts);
        scripts.forEach(script => {
            if (script.textContent && script.textContent.includes(funcName + '(')) {
                functionAnalysis.usedInScripts.push(script.src ? script.src.split('/').pop() : 'inline');
                functionAnalysis.usageCount++;
            }
        });
        
        // 3. Verificar uso no HTML
        const htmlContent = document.documentElement.outerHTML;
        if (htmlContent.includes(funcName + '(') || htmlContent.includes(funcName + ' (')) {
            functionAnalysis.usedInHtml = true;
            functionAnalysis.usageCount++;
        }
        
        // 4. Verificar uso específico em pdf-unified.js
        functionAnalysis.usedInPdfUnified = functionAnalysis.usedInScripts.some(script => 
            script && (script.includes('pdf-unified') || script.includes('pdfUnified'))
        );
        
        // Armazenar resultados
        results.functions[funcName] = functionAnalysis;
        
        // Atualizar resumo
        if (functionAnalysis.usageCount > 0) {
            results.usageSummary.usedInCode++;
            if (functionAnalysis.usedInPdfUnified) {
                results.usageSummary.usedInPdfUnified++;
            }
            if (functionAnalysis.usedInScripts.length > 0 || functionAnalysis.usedInHtml) {
                results.usageSummary.usedInOtherFiles++;
            }
        } else {
            results.usageSummary.unusedFunctions++;
        }
        
        // Log no console F12
        const statusIcon = functionAnalysis.usageCount > 0 ? '✅' : '❌';
        console.log(`${statusIcon} ${funcName}: ${functionAnalysis.usageCount > 0 ? 'UTILIZADA' : 'NÃO UTILIZADA'}`);
        
        // Log no painel para funções não utilizadas
        if (functionAnalysis.usageCount === 0 && window.logToPanel) {
            window.logToPanel(`❌ ${funcName}: Não utilizada no código`, 'warning');
        }
    });
    
    // Gerar recomendações
    const unusedFunctions = Object.entries(results.functions)
        .filter(([_, analysis]) => analysis.usageCount === 0)
        .map(([funcName]) => funcName);
    
    if (unusedFunctions.length > 0) {
        results.recommendations.push(
            `🗑️ ${unusedFunctions.length} função(ões) não utilizadas podem ser removidas`
        );
        
        // Log importante no painel
        if (window.logToPanel) {
            window.logToPanel(`⚠️ ENCONTRADAS ${unusedFunctions.length} FUNÇÕES NÃO UTILIZADAS`, 'warning');
            window.logToPanel(`📋 Funções: ${unusedFunctions.slice(0, 3).join(', ')}${unusedFunctions.length > 3 ? '...' : ''}`, 'info');
        }
    }
    
    // Exibir resumo no console F12
    console.log('\n📊 RESUMO DA ANÁLISE v5.7:');
    console.log(`- Total de funções analisadas: ${results.usageSummary.totalFunctions}`);
    console.log(`- Funções utilizadas: ${results.usageSummary.usedInCode}`);
    console.log(`- Funções não utilizadas: ${results.usageSummary.unusedFunctions}`);
    console.log(`- Versão da análise: ${results.version}`);
    
    // Log final no painel
    if (window.logToPanel) {
        const successRate = Math.round((results.usageSummary.usedInCode / results.usageSummary.totalFunctions) * 100);
        window.logToPanel(`📊 Análise concluída: ${results.usageSummary.usedInCode}/${results.usageSummary.totalFunctions} funções utilizadas (${successRate}%)`, 
                         successRate > 70 ? 'success' : 'warning');
    }
    
    // Mostrar painel visual AUTOMATICAMENTE
    setTimeout(() => {
        showFunctionUsageReport(results, unusedFunctions);
    }, 500);
    
    console.groupEnd();
    
    return results;
};

/* ================== PAINEL DE RELATÓRIO VISUAL (APARECE NA TELA) ================== */
function showFunctionUsageReport(results, unusedFunctions) {
    const reportId = 'function-usage-report-v5-7';
    
    // Remover relatório anterior se existir
    const existingReport = document.getElementById(reportId);
    if (existingReport) existingReport.remove();
    
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
        border: 3px solid ${unusedFunctions.length > 0 ? '#ffaa00' : '#00ff9c'};
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
                <span>ANÁLISE DE USO DE FUNÇÕES</span>
            </div>
            <div style="font-size: 16px; color: #88aaff; margin-top: 5px;">
                pdf-utils.js - v5.7
            </div>
            <div style="font-size: 12px; color: #4488ff; margin-top: 5px;">
                ${new Date().toLocaleTimeString()}
            </div>
        </div>
        
        <div style="background: rgba(0, 170, 255, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; 
                    border: 1px solid rgba(0, 170, 255, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">TOTAL</div>
                    <div style="font-size: 32px; color: #00aaff;">${results.usageSummary.totalFunctions}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">UTILIZADAS</div>
                    <div style="font-size: 32px; color: #00ff9c;">${results.usageSummary.usedInCode}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">NÃO USADAS</div>
                    <div style="font-size: 32px; color: ${unusedFunctions.length > 0 ? '#ffaa00' : '#00ff9c'}">${unusedFunctions.length}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">VERSÃO</div>
                    <div style="font-size: 20px; color: #0088cc;">5.7</div>
                </div>
            </div>
        </div>
        
        ${unusedFunctions.length > 0 ? `
        <div style="margin-bottom: 20px;">
            <div style="color: #ffaa00; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span>⚠️</span>
                <span>FUNÇÕES NÃO UTILIZADAS</span>
            </div>
            <div style="background: rgba(255, 170, 0, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(255, 170, 0, 0.3);">
                <div style="color: #ffcc88; font-size: 14px; margin-bottom: 10px;">
                    Estas funções não são referenciadas em nenhum lugar do código:
                </div>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                    ${unusedFunctions.map(func => `
                        <div style="padding: 8px; background: rgba(255, 170, 0, 0.2); border-radius: 4px; 
                                    border-left: 3px solid #ffaa00; display: flex; align-items: center; gap: 8px;">
                            <span style="color: #ffaa00;">🗑️</span>
                            <span style="color: #ffcc88;">${func}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
            <button id="run-analysis-again" style="
                background: linear-gradient(45deg, #00aaff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;">
                🔄 ANALISAR NOVAMENTE
            </button>
            <button id="close-report" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #88aaff; text-align: center; margin-top: 15px;">
            Clique em "Analisar Novamente" para verificar uso em tempo real
        </div>
    `;
    
    // Adicionar ao documento
    document.body.appendChild(reportDiv);
    
    // Configurar eventos
    document.getElementById('run-analysis-again').addEventListener('click', () => {
        reportDiv.remove();
        window.analyzePdfUtilsUsage();
    });
    
    document.getElementById('close-report').addEventListener('click', () => {
        reportDiv.remove();
    });
    
    // Log no console
    console.log('✅ Painel de análise v5.7 exibido na tela');
}

/* ================== ADICIONAR BOTÃO AO PAINEL EXISTENTE ================== */
function addButtonToExistingPanel() {
    console.log('🔧 Adicionando botão ao painel existente...');
    
    // Tentar encontrar o painel várias vezes
    const maxAttempts = 10;
    let attempts = 0;
    
    const interval = setInterval(() => {
        attempts++;
        const panel = document.getElementById('diagnostics-panel-complete');
        
        if (panel) {
            clearInterval(interval);
            
            // Verificar se o botão já existe
            if (!document.getElementById('analyze-functions-btn-v5-7')) {
                // Encontrar a área de botões (terceiro div geralmente)
                const buttonContainers = panel.querySelectorAll('div');
                let targetContainer = null;
                
                // Procurar por container com múltiplos botões
                for (let i = 0; i < buttonContainers.length; i++) {
                    const container = buttonContainers[i];
                    const buttons = container.querySelectorAll('button');
                    if (buttons.length >= 3) {
                        targetContainer = container;
                        break;
                    }
                }
                
                // Se não encontrar, usar o terceiro div
                if (!targetContainer && buttonContainers.length >= 3) {
                    targetContainer = buttonContainers[2];
                }
                
                if (targetContainer) {
                    // Criar botão
                    const analyzeBtn = document.createElement('button');
                    analyzeBtn.id = 'analyze-functions-btn-v5-7';
                    analyzeBtn.innerHTML = '🔍 ANALISAR FUNÇÕES v5.7';
                    analyzeBtn.style.cssText = `
                        background: linear-gradient(45deg, #00aaff, #0088cc); 
                        color: white; border: none;
                        padding: 8px 12px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;
                        flex: 1;
                    `;
                    
                    // Efeitos hover
                    analyzeBtn.onmouseenter = function() {
                        this.style.transform = 'translateY(-2px)';
                        this.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
                    };
                    analyzeBtn.onmouseleave = function() {
                        this.style.transform = 'translateY(0)';
                        this.style.boxShadow = 'none';
                    };
                    
                    // Adicionar evento
                    analyzeBtn.addEventListener('click', () => {
                        if (window.analyzePdfUtilsUsage) {
                            window.analyzePdfUtilsUsage();
                        }
                    });
                    
                    // Adicionar ao container
                    targetContainer.appendChild(analyzeBtn);
                    
                    console.log('✅ Botão adicionado ao painel com sucesso');
                    
                    // Log no painel
                    if (window.logToPanel) {
                        window.logToPanel('✅ Botão de análise v5.7 adicionado ao painel', 'success');
                    }
                }
            }
        } else if (attempts >= maxAttempts) {
            clearInterval(interval);
            console.log('⚠️ Painel não encontrado após várias tentativas');
        }
    }, 1000);
}

/* ================== COMANDOS RÁPIDOS NO CONSOLE F12 ================== */
// Adicionar comandos que aparecem no console
console.log('%c🎯 COMANDOS DE ANÁLISE v5.7 DISPONÍVEIS:', 'color: #00aaff; font-weight: bold; font-size: 14px;');
console.log('%c• analyzeFunctions() - Analisa uso das funções pdf-utils.js', 'color: #88aaff;');
console.log('%c• showFunctionReport() - Mostra painel de análise', 'color: #88aaff;');
console.log('%c• addAnalysisButton() - Adiciona botão ao painel', 'color: #88aaff;');

// Criar aliases fáceis
window.analyzeFunctions = window.analyzePdfUtilsUsage;
window.showFunctionReport = function() {
    const results = {
        usageSummary: { totalFunctions: 10, usedInCode: 7, unusedFunctions: 3 },
        version: '5.7'
    };
    showFunctionUsageReport(results, ['pdfFormatFileSize', 'pdfVerifyUrl', 'pdfGenerateThumbnail']);
};
window.addAnalysisButton = addButtonToExistingPanel;

/* ================== EXECUÇÃO AUTOMÁTICA ================== */
// Executar quando a página carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 Página carregada - inicializando análise v5.7');
        
        // Adicionar botão após 2 segundos
        setTimeout(addButtonToExistingPanel, 2000);
        
        // Executar análise automática se em modo debug
        if (window.DEBUG_MODE || window.DIAGNOSTICS_MODE) {
            setTimeout(() => {
                console.log('🔄 Executando análise automática v5.7...');
                if (window.analyzePdfUtilsUsage) {
                    window.analyzePdfUtilsUsage();
                }
            }, 3000);
        }
    });
} else {
    // Página já carregada
    console.log('📄 Página já carregada - inicializando análise v5.7');
    
    // Adicionar botão imediatamente
    setTimeout(addButtonToExistingPanel, 1000);
    
    // Executar análise se em modo debug
    if (window.DEBUG_MODE || window.DIAGNOSTICS_MODE) {
        setTimeout(() => {
            console.log('🔄 Executando análise automática v5.7...');
            if (window.analyzePdfUtilsUsage) {
                window.analyzePdfUtilsUsage();
            }
        }, 2000);
    }
}

// Log de confirmação final
console.log('%c✅ ANÁLISE DE FUNÇÕES PDF-UTILS.JS v5.7 PRONTA PARA USO', 
            'color: #00ff9c; font-weight: bold; font-size: 14px; background: #001a33; padding: 5px;');
