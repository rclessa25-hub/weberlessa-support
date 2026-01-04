// debug/diagnostics.js
console.log('🔍 diagnostics.js – mapeamento completo do sistema');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const ACTIVE = params.get('debug') === 'true' && params.get('diagnostics') === 'true';

/* ================== PAINEL ================== */
let panel;
function ui(msg) {
    console.log('[DIAG]', msg);
    if (!panel) return;
    const d = document.createElement('div');
    d.textContent = msg;
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
                🔍 DIAGNÓSTICO COMPLETO DO SISTEMA
            </div>
            <button onclick="this.parentNode.parentNode.style.display='none'" 
                    style="background: #ff5555; color: white; border: none; 
                           padding: 2px 8px; cursor: pointer; border-radius: 3px;">
                X
            </button>
        </div>
        <div style="color: #888; font-size: 11px; margin-bottom: 15px;">
            Análise combinada: Scripts + Comportamento + Funções Globais
        </div>
        <hr style="border-color: #00ff9c; opacity: 0.3;">`;
    document.body.appendChild(panel);
}

/* ================== COLETA DE DADOS COMPLETA ================== */

// 1. CAPTURA TODOS OS SCRIPTS CARREGADOS
const allScripts = Array.from(document.scripts)
    .filter(script => script.src)
    .map(script => ({
        url: script.src,
        fileName: script.src.split('/').pop(),
        isModule: script.type === 'module',
        isDefer: script.defer,
        isAsync: script.async
    }));

// 2. CAPTURA FUNÇÕES GLOBAIS (do seu log: 194 funções globais analisadas)
const globalFunctions = {};
Object.keys(window).forEach(key => {
    if (typeof window[key] === 'function') {
        globalFunctions[key] = 'function';
    } else if (typeof window[key] === 'object' && window[key] !== null) {
        globalFunctions[key] = 'object';
    }
});

// 3. SISTEMAS DETECTADOS (do log F12)
const detectedSystems = {
    supabase: !!window.supabase,
    properties: !!window.properties,
    admin: !!window.toggleAdminPanel,
    media: !!window.MediaSystem || !!window.handleNewMediaFiles,
    pdf: !!window.PdfLogger || !!window.pdfValidateUrl,
    gallery: !!window.gallery,
    validation: !!window.ValidationSystem,
    performance: !!window.performanceOptimizer,
    emergency: !!window.EmergencySystem || !!window.emergencyRecovery
};

// 4. CLASSIFICAÇÃO POR NOME E COMPORTAMENTO
function classifyModule(fileName, globalKeys = []) {
    const name = fileName.toLowerCase();
    
    // CORE BUSINESS LOGIC
    if (name.includes('admin.js') || 
        name.includes('properties.js') || 
        name.includes('gallery.js') ||
        name.includes('media-core.js') ||
        name.includes('pdf-core.js') ||
        fileName === 'admin.js' ||
        fileName === 'properties.js' ||
        fileName === 'gallery.js') {
        return 'CORE';
    }
    
    // PERFORMANCE & OPTIMIZATION
    if (name.includes('optimizer') || 
        name.includes('performance') ||
        name.includes('cache') ||
        fileName === 'core-optimizer.js' ||
        fileName === 'optimizer.js') {
        return 'PERFORMANCE';
    }
    
    // SUPPORT & DIAGNOSTICS
    if (name.includes('diagnostic') ||
        name.includes('checker') ||
        name.includes('verifier') ||
        name.includes('logger') ||
        name.includes('recovery') ||
        name.includes('validation') ||
        name.includes('simple-') ||
        name.includes('emergency-') ||
        name.includes('duplication-')) {
        return 'SUPPORT';
    }
    
    // UTILITIES
    if (name.includes('utils') ||
        name.includes('helper') ||
        name.includes('format') ||
        name.includes('extract')) {
        return 'UTIL';
    }
    
    // EXTERNAL LIBS
    if (name.includes('supabase') ||
        name.includes('cdn') ||
        name.includes('unpkg')) {
        return 'EXTERNAL';
    }
    
    // UI MODULES
    if (name.includes('ui.js') ||
        name.includes('-ui.js') ||
        name.includes('integration.js')) {
        return 'UI';
    }
    
    // DEFAULT TO CORE
    return 'CORE';
}

// 5. MAPEAMENTO DETALHADO DE CADA SCRIPT
const moduleAnalysis = allScripts.map(script => {
    const type = classifyModule(script.fileName);
    
    // Detecta funcionalidades baseadas no comportamento
    const behaviors = [];
    
    // Verifica se o script adicionou funções globais específicas
    const scriptNameSimple = script.fileName.replace('.js', '');
    const addedGlobals = Object.keys(globalFunctions).filter(key => 
        key.toLowerCase().includes(scriptNameSimple.toLowerCase()) ||
        key.toLowerCase().includes(script.fileName.replace('.js', '').toLowerCase())
    );
    
    if (addedGlobals.length > 0) {
        behaviors.push(`exporta: ${addedGlobals.slice(0, 3).join(', ')}${addedGlobals.length > 3 ? '...' : ''}`);
    }
    
    return {
        fileName: script.fileName,
        url: script.url,
        type,
        behaviors,
        addedGlobals: addedGlobals.length
    };
});

// 6. DETECTA MÓDULOS DO SEU REPOSITÓRIO DE SUPORTE
const supportRepoModules = allScripts.filter(script => 
    script.url.includes('rclessa25-hub.github.io/weberlessa-support/')
).map(script => script.fileName);

// 7. DETECTA MÓDULOS LOCAIS/CORE
const coreModules = allScripts.filter(script => 
    !script.url.includes('rclessa25-hub.github.io/weberlessa-support/') &&
    !script.url.includes('supabase') &&
    !script.url.includes('cdn')
).map(script => script.fileName);

/* ================== RELATÓRIO COMPLETO ================== */
function generateCompleteReport() {
    if (!panel) return;
    
    // Limpa conteúdo anterior
    while (panel.children.length > 3) {
        panel.removeChild(panel.lastChild);
    }
    
    ui('\n📊 ANÁLISE COMPLETA DO SISTEMA\n');
    
    // 1. RESUMO GERAL
    ui('🎯 RESUMO GERAL:');
    ui(`📦 Scripts totais: ${allScripts.length}`);
    ui(`⚡ Funções globais: ${Object.keys(globalFunctions).length}`);
    ui(`🔧 Sistemas detectados: ${Object.values(detectedSystems).filter(Boolean).length}/9`);
    
    // 2. SISTEMAS DETECTADOS
    ui('\n🔧 SISTEMAS ATIVOS:');
    Object.entries(detectedSystems).forEach(([system, active]) => {
        ui(`${active ? '✅' : '❌'} ${system}: ${active ? 'ATIVO' : 'AUSENTE'}`);
    });
    
    // 3. DISTRIBUIÇÃO POR TIPO
    const typeCount = {};
    moduleAnalysis.forEach(module => {
        typeCount[module.type] = (typeCount[module.type] || 0) + 1;
    });
    
    ui('\n📈 DISTRIBUIÇÃO POR TIPO:');
    Object.entries(typeCount).forEach(([type, count]) => {
        ui(`${type}: ${count} módulo${count !== 1 ? 's' : ''}`);
    });
    
    // 4. MÓDULOS DO REPOSITÓRIO DE SUPORTE
    ui('\n🧩 REPOSITÓRIO DE SUPORTE:');
    if (supportRepoModules.length > 0) {
        supportRepoModules.forEach((module, i) => {
            const analysis = moduleAnalysis.find(m => m.fileName === module);
            const typeSymbol = analysis ? 
                (analysis.type === 'CORE' ? '⚙️' : 
                 analysis.type === 'PERFORMANCE' ? '⚡' : 
                 analysis.type === 'SUPPORT' ? '🔧' : '📦') : '📄';
            ui(`${typeSymbol} ${module}${analysis ? ` (${analysis.type})` : ''}`);
        });
    } else {
        ui('Nenhum módulo do repositório detectado');
    }
    
    // 5. MÓDULOS CORE/PRINCIPAIS
    ui('\n⚙️ MÓDULOS PRINCIPAIS:');
    const mainModules = moduleAnalysis.filter(m => 
        m.type === 'CORE' || 
        m.type === 'UI' ||
        m.addedGlobals > 0
    ).slice(0, 15); // Limita a 15 para não poluir
    
    if (mainModules.length > 0) {
        mainModules.forEach(module => {
            const typeSymbol = 
                module.type === 'CORE' ? '⚙️' :
                module.type === 'UI' ? '🎨' :
                module.type === 'PERFORMANCE' ? '⚡' :
                module.type === 'SUPPORT' ? '🔧' : '📦';
            
            ui(`\n${typeSymbol} ${module.fileName}`);
            ui(`  Tipo: ${module.type}`);
            if (module.addedGlobals > 0) {
                ui(`  Funções: ${module.addedGlobals} global${module.addedGlobals !== 1 ? 's' : ''}`);
            }
            if (module.behaviors.length > 0) {
                ui(`  Comportamento: ${module.behaviors.join('; ')}`);
            }
        });
    }
    
    // 6. SAÚDE DO SISTEMA
    ui('\n🩺 DIAGNÓSTICO DE SAÚDE:');
    
    let healthScore = 100;
    const issues = [];
    
    // Verifica sistemas essenciais
    if (!detectedSystems.properties) {
        healthScore -= 30;
        issues.push('❌ Sistema de propriedades ausente');
    }
    
    if (!detectedSystems.supabase) {
        healthScore -= 10;
        issues.push('⚠️  Supabase não detectado (pode ser normal em fallback)');
    }
    
    if (typeCount.CORE < 3) {
        healthScore -= 20;
        issues.push('⚠️  Poucos módulos CORE detectados');
    }
    
    if (Object.keys(globalFunctions).length < 50) {
        healthScore -= 10;
        issues.push('⚠️  Baixo número de funções globais');
    }
    
    // Exibe issues
    if (issues.length > 0) {
        ui('\n🚨 POSSÍVEIS PROBLEMAS:');
        issues.forEach(issue => ui(issue));
    } else {
        ui('✅ Sistema aparentemente saudável');
    }
    
    ui(`\n💯 HEALTH SCORE: ${Math.max(0, healthScore)}/100`);
    
    // 7. BOTÃO PARA DETALHES TÉCNICOS
    const detailsBtn = document.createElement('button');
    detailsBtn.textContent = '📊 Ver Detalhes Técnicos';
    detailsBtn.style.cssText = `
        margin-top: 15px; padding: 8px 12px;
        background: #00ff9c; color: #000; border: none;
        border-radius: 4px; cursor: pointer;
        font-family: monospace; font-weight: bold;
        display: block; width: 100%;
    `;
    detailsBtn.onclick = showTechnicalDetails;
    panel.appendChild(detailsBtn);
}

/* ================== DETALHES TÉCNICOS (expandido) ================== */
function showTechnicalDetails() {
    // Remove botão anterior
    const lastChild = panel.lastChild;
    if (lastChild && lastChild.tagName === 'BUTTON') {
        panel.removeChild(lastChild);
    }
    
    ui('\n🔍 DETALHES TÉCNICOS:');
    
    // Lista completa de scripts
    ui('\n📜 TODOS OS SCRIPTS CARREGADOS:');
    allScripts.forEach((script, i) => {
        const analysis = moduleAnalysis.find(m => m.fileName === script.fileName);
        ui(`${i + 1}. ${script.fileName} (${analysis ? analysis.type : '?'})`);
        ui(`   ${script.url}`);
    });
    
    // Funções globais mais importantes
    ui('\n⚡ FUNÇÕES GLOBAIS PRINCIPAIS:');
    const importantFunctions = Object.keys(globalFunctions)
        .filter(name => 
            !name.startsWith('_') && 
            !name.includes('webkit') &&
            !name.includes('moz') &&
            name.length > 3
        )
        .slice(0, 20);
    
    importantFunctions.forEach(func => {
        ui(`   ${func}: ${globalFunctions[func]}`);
    });
    
    if (Object.keys(globalFunctions).length > 20) {
        ui(`   ...e mais ${Object.keys(globalFunctions).length - 20} funções`);
    }
    
    // Módulos por origem
    ui('\n🌐 ORIGEM DOS MÓDULOS:');
    const origins = {};
    allScripts.forEach(script => {
        const origin = script.url.split('/').slice(0, 3).join('/');
        origins[origin] = (origins[origin] || 0) + 1;
    });
    
    Object.entries(origins).forEach(([origin, count]) => {
        ui(`   ${origin}: ${count} módulo${count !== 1 ? 's' : ''}`);
    });
    
    // Botão para voltar
    const backBtn = document.createElement('button');
    backBtn.textContent = '⬅️ Voltar ao Resumo';
    backBtn.style.cssText = `
        margin-top: 15px; padding: 8px 12px;
        background: #555; color: white; border: none;
        border-radius: 4px; cursor: pointer;
        font-family: monospace; font-weight: bold;
        display: block; width: 100%;
    `;
    backBtn.onclick = () => {
        // Remove detalhes técnicos
        while (panel.children.length > 3) {
            panel.removeChild(panel.lastChild);
        }
        generateCompleteReport();
    };
    panel.appendChild(backBtn);
}

/* ================== INICIALIZAÇÃO ================== */
// Aguarda o carregamento completo
if (ACTIVE) {
    // Pequeno delay para capturar tudo
    setTimeout(() => {
        ui('\n⏳ Coletando dados do sistema...');
        setTimeout(generateCompleteReport, 1000);
    }, 500);
    
    // Também escuta por mudanças (scripts dinâmicos)
    const observer = new MutationObserver(() => {
        setTimeout(generateCompleteReport, 500);
    });
    
    observer.observe(document.head, { childList: true });
    observer.observe(document.body, { childList: true, subtree: true });
}

// Exporta função para recarregar diagnóstico
window.refreshDiagnostics = generateCompleteReport;

console.log('🔍 Diagnóstico completo inicializado');
console.log(`📦 Scripts detectados: ${allScripts.length}`);
console.log(`⚡ Funções globais: ${Object.keys(globalFunctions).length}`);
