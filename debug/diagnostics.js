// debug/diagnostics.js
console.log('🔍 diagnostics.js – análise estática segura');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const ACTIVE = params.get('debug') === 'true' && params.get('diagnostics') === 'true';

/* ================== PAINEL ================== */
let panel;
function ui(msg, isError = false) {
    // USAR APENAS console.log DIRETO para evitar recursão
    if (isError) {
        console.error('[DIAG-ERROR]', msg);
    } else {
        console.log('[DIAG]', msg);
    }
    
    if (!panel) return;
    const d = document.createElement('div');
    d.textContent = msg;
    d.style.color = isError ? '#ff5555' : '#00ff9c';
    panel.appendChild(d);
}

if (ACTIVE) {
    panel = document.createElement('div');
    panel.style.cssText = `
        position: fixed; top: 10px; right: 10px; width: 700px;
        max-height: 92vh; overflow-y: auto;
        background: #0b0b0b; color: #00ff9c; border: 2px solid #00ff9c;
        font-family: 'Consolas', 'Monaco', monospace; font-size: 12px;
        padding: 15px; z-index: 99999; border-radius: 8px;
        box-shadow: 0 0 25px rgba(0, 255, 156, 0.3);
    `;
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-weight: bold; font-size: 14px; color: #00ff9c;">
                🔍 DIAGNÓSTICO ESTÁTICO SEGURO
            </div>
            <button onclick="this.parentNode.parentNode.style.display='none'" 
                    style="background: #ff5555; color: white; border: none; 
                           padding: 2px 8px; cursor: pointer; border-radius: 3px;">
                X
            </button>
        </div>
        <div style="color: #888; font-size: 11px; margin-bottom: 15px;">
            Análise segura sem interceptação de console.log
        </div>
        <hr style="border-color: #00ff9c; opacity: 0.3;">`;
    document.body.appendChild(panel);
}

/* ================== ANÁLISE SEGURA (SEM INTERCEPTAÇÃO) ================== */

// 1. COLETA SEGURA DE DADOS
function collectSafeData() {
    console.log('[DIAG] Coletando dados de forma segura...');
    
    // Scripts carregados
    const allScripts = Array.from(document.scripts)
        .filter(script => script.src)
        .map(script => ({
            url: script.src,
            fileName: script.src.split('/').pop(),
            isModule: script.type === 'module',
            isDefer: script.defer,
            isAsync: script.async
        }));
    
    // Funções globais (limitado para performance)
    const globalFunctions = {};
    const windowKeys = Object.keys(window);
    // Limita a 100 para performance
    for (let i = 0; i < Math.min(windowKeys.length, 100); i++) {
        const key = windowKeys[i];
        try {
            const value = window[key];
            if (typeof value === 'function') {
                globalFunctions[key] = { type: 'function', from: 'window' };
            }
        } catch (e) {
            // Ignora propriedades não acessíveis
        }
    }
    
    // Sistemas detectados (check seguro)
    const detectedSystems = {
        supabase: 'supabase' in window,
        properties: 'properties' in window,
        admin: 'toggleAdminPanel' in window,
        media: ('MediaSystem' in window) || ('handleNewMediaFiles' in window),
        pdf: ('PdfLogger' in window) || ('pdfValidateUrl' in window),
        gallery: 'gallery' in window,
        validation: 'ValidationSystem' in window,
        performance: 'performanceOptimizer' in window,
        emergency: ('EmergencySystem' in window) || ('emergencyRecovery' in window),
        diagnostics: 'diagnostics' in window
    };
    
    return { allScripts, globalFunctions, detectedSystems };
}

// 2. CLASSIFICAÇÃO SEGURA
function classifyModuleSafe(fileName) {
    const name = fileName.toLowerCase();
    
    // Mapa de classificação explícita (evita heurística complexa)
    const classificationMap = {
        // CORE BUSINESS
        'admin.js': 'CORE',
        'properties.js': 'CORE',
        'properties-core.js': 'CORE',
        'gallery.js': 'CORE',
        'media-core.js': 'CORE',
        'pdf-core.js': 'CORE',
        
        // PERFORMANCE
        'optimizer.js': 'PERFORMANCE',
        'core-optimizer.js': 'PERFORMANCE',
        
        // SUPPORT
        'diagnostics.js': 'SUPPORT',
        'function-verifier.js': 'SUPPORT',
        'media-logger.js': 'SUPPORT',
        'media-recovery.js': 'SUPPORT',
        'pdf-logger.js': 'SUPPORT',
        'duplication-checker.js': 'SUPPORT',
        'emergency-recovery.js': 'SUPPORT',
        'simple-checker.js': 'SUPPORT',
        'validation.js': 'SUPPORT',
        'validation-essentials.js': 'SUPPORT',
        
        // UI
        'media-ui.js': 'UI',
        'media-integration.js': 'UI',
        'pdf-ui.js': 'UI',
        'pdf-integration.js': 'UI',
        
        // UTILITIES
        'utils.js': 'UTIL',
        'media-utils.js': 'UTIL',
        'pdf-utils.js': 'UTIL',
        
        // EXTERNAL
        'supabase.js': 'EXTERNAL',
        'supabase-js@2': 'EXTERNAL'
    };
    
    // Tenta mapa primeiro, depois heurística simples
    if (classificationMap[fileName]) {
        return classificationMap[fileName];
    }
    
    // Heurística de fallback (segura)
    if (name.includes('supabase') || name.includes('cdn')) return 'EXTERNAL';
    if (name.includes('utils')) return 'UTIL';
    if (name.includes('ui.js') || name.includes('-ui.js')) return 'UI';
    if (name.includes('checker') || name.includes('logger') || name.includes('diagnostic')) return 'SUPPORT';
    if (name.includes('optimizer') || name.includes('performance')) return 'PERFORMANCE';
    
    // Default para CORE
    return 'CORE';
}

// 3. GERA RELATÓRIO SEGURO
function generateSafeReport() {
    if (!panel) return;
    
    // Limpa painel
    while (panel.children.length > 3) {
        panel.removeChild(panel.lastChild);
    }
    
    try {
        console.log('[DIAG] Gerando relatório seguro...');
        const data = collectSafeData();
        
        ui('\n📊 ANÁLISE ESTÁTICA DO SISTEMA\n');
        
        // Resumo
        ui('🎯 RESUMO GERAL:');
        ui(`📦 Scripts carregados: ${data.allScripts.length}`);
        ui(`⚡ Funções globais: ${Object.keys(data.globalFunctions).length}`);
        ui(`🔧 Sistemas ativos: ${Object.values(data.detectedSystems).filter(Boolean).length}/10`);
        
        // Sistemas
        ui('\n🔧 SISTEMAS DETECTADOS:');
        Object.entries(data.detectedSystems).forEach(([system, active]) => {
            ui(`${active ? '✅' : '❌'} ${system}: ${active ? 'PRESENTE' : 'AUSENTE'}`);
        });
        
        // Classificação
        ui('\n📈 CLASSIFICAÇÃO DE MÓDULOS:');
        const modulesByType = {};
        data.allScripts.forEach(script => {
            const type = classifyModuleSafe(script.fileName);
            modulesByType[type] = modulesByType[type] || [];
            modulesByType[type].push(script.fileName);
        });
        
        // Ordem preferencial de exibição
        const displayOrder = ['CORE', 'PERFORMANCE', 'UI', 'SUPPORT', 'UTIL', 'EXTERNAL'];
        displayOrder.forEach(type => {
            if (modulesByType[type]) {
                ui(`\n${getTypeEmoji(type)} ${type} (${modulesByType[type].length}):`);
                // Agrupa em colunas para melhor visualização
                const chunks = chunkArray(modulesByType[type], 3);
                chunks.forEach(chunk => {
                    ui(`  ${chunk.map(m => m.padEnd(25)).join(' ')}`);
                });
            }
        });
        
        // Health Score
        ui('\n🩺 DIAGNÓSTICO DE SAÚDE:');
        let healthScore = 100;
        const issues = [];
        
        if (!data.detectedSystems.properties) {
            healthScore -= 30;
            issues.push('❌ Sistema de propriedades ausente (CRÍTICO)');
        }
        
        if (modulesByType.CORE && modulesByType.CORE.length < 4) {
            healthScore -= 20;
            issues.push('⚠️  Poucos módulos CORE detectados');
        }
        
        if (modulesByType.SUPPORT && modulesByType.SUPPORT.length > 15) {
            healthScore -= 10;
            issues.push('⚠️  Muitos módulos de suporte (possível sobrecarga)');
        }
        
        if (issues.length > 0) {
            ui('\n🚨 ALERTAS:');
            issues.forEach(issue => ui(issue));
        } else {
            ui('✅ Sistema estruturalmente saudável');
        }
        
        ui(`\n💯 HEALTH SCORE: ${Math.max(0, healthScore)}/100`);
        
        // Botões de ação
        addActionButtons(data);
        
    } catch (error) {
        ui(`\n🚨 ERRO NA ANÁLISE: ${error.message}`, true);
        ui('Detalhes do erro:', true);
        ui(error.stack, true);
    }
}

// 4. FUNÇÕES AUXILIARES
function getTypeEmoji(type) {
    const emojis = {
        'CORE': '⚙️',
        'PERFORMANCE': '⚡',
        'UI': '🎨',
        'SUPPORT': '🔧',
        'UTIL': '🧰',
        'EXTERNAL': '📦'
    };
    return emojis[type] || '📄';
}

function chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
}

function addActionButtons(data) {
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;';
    
    // Botão 1: Exportar dados
    const exportBtn = document.createElement('button');
    exportBtn.textContent = '💾 Exportar JSON';
    exportBtn.style.cssText = `
        padding: 8px 12px;
        background: #00ff9c; color: #000; border: none;
        border-radius: 4px; cursor: pointer;
        font-family: monospace; font-weight: bold;
        flex: 1;
    `;
    exportBtn.onclick = () => {
        const exportData = {
            timestamp: new Date().toISOString(),
            url: window.location.href,
            scripts: data.allScripts,
            systems: data.detectedSystems,
            summary: {
                totalScripts: data.allScripts.length,
                totalGlobals: Object.keys(data.globalFunctions).length,
                activeSystems: Object.values(data.detectedSystems).filter(Boolean).length
            }
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagnostics-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    
    // Botão 2: Recarregar
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 Recarregar';
    refreshBtn.style.cssText = `
        padding: 8px 12px;
        background: #555; color: white; border: none;
        border-radius: 4px; cursor: pointer;
        font-family: monospace; font-weight: bold;
        flex: 1;
    `;
    refreshBtn.onclick = generateSafeReport;
    
    // Botão 3: Ver detalhes técnicos
    const detailsBtn = document.createElement('button');
    detailsBtn.textContent = '🔍 Detalhes Técnicos';
    detailsBtn.style.cssText = `
        padding: 8px 12px;
        background: #ffaa00; color: #000; border: none;
        border-radius: 4px; cursor: pointer;
        font-family: monospace; font-weight: bold;
        flex: 1;
    `;
    detailsBtn.onclick = () => {
        ui('\n🔍 DETALHES TÉCNICOS:');
        ui(`Timestamp: ${new Date().toISOString()}`);
        ui(`User Agent: ${navigator.userAgent.substring(0, 60)}...`);
        ui(`URL: ${window.location.href}`);
        
        // Lista de scripts com URLs completas
        ui('\n📜 URLs COMPLETAS DOS SCRIPTS:');
        data.allScripts.forEach((script, i) => {
            const type = classifyModuleSafe(script.fileName);
            ui(`${i + 1}. ${getTypeEmoji(type)} ${script.fileName} (${type})`);
            ui(`   ${script.url}`);
        });
    };
    
    buttonContainer.appendChild(exportBtn);
    buttonContainer.appendChild(refreshBtn);
    buttonContainer.appendChild(detailsBtn);
    panel.appendChild(buttonContainer);
}

/* ================== INICIALIZAÇÃO SEGURA ================== */
if (ACTIVE) {
    console.log('[DIAG] Diagnóstico seguro iniciado');
    
    // Pequeno delay para garantir carregamento
    setTimeout(() => {
        ui('\n⏳ Iniciando análise estática segura...');
        generateSafeReport();
    }, 1000);
    
    // Monitora apenas novos scripts (sem interceptar console)
    const observer = new MutationObserver((mutations) => {
        let hasNewScript = false;
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.tagName === 'SCRIPT' && node.src) {
                    hasNewScript = true;
                }
            });
        });
        
        if (hasNewScript) {
            setTimeout(() => {
                ui('\n📦 Novo script detectado, atualizando análise...');
                generateSafeReport();
            }, 500);
        }
    });
    
    observer.observe(document.head, { childList: true });
}

// Exporta função global para recarregar
window.refreshDiagnostics = generateSafeReport;

console.log('[DIAG] Diagnóstico seguro carregado e pronto');
