// debug/diagnostics.js
console.log('🔍 diagnostics.js – mapeamento arquivo ↔ comportamento');

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
        position: fixed; top: 10px; right: 10px; width: 650px;
        max-height: 92vh; overflow-y: auto;
        background: #0b0b0b; color: #00ff9c; border: 2px solid #00ff9c;
        font-family: 'Consolas', 'Monaco', monospace; font-size: 12px;
        padding: 15px; z-index: 99999; border-radius: 8px;
        box-shadow: 0 0 25px rgba(0, 255, 156, 0.3);
    `;
    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <div style="font-weight: bold; font-size: 14px; color: #00ff9c;">🔍 RUNTIME DIAGNOSTICS</div>
            <button onclick="this.parentNode.parentNode.style.display='none'" 
                    style="background: #ff5555; color: white; border: none; 
                           padding: 2px 8px; cursor: pointer; border-radius: 3px;">
                X
            </button>
        </div>
        <div style="color: #888; font-size: 11px; margin-bottom: 15px;">
            Mapeamento automático por comportamento real em runtime
        </div>
        <hr style="border-color: #00ff9c; opacity: 0.3;">`;
    document.body.appendChild(panel);
}

/* ================== ARMAZENAMENTO POR ARQUIVO ================== */
const fileMap = new Map();
const scriptOrigins = new Map(); // Mapeia scripts carregados

/* ================== DETECTA SCRIPTS CARREGADOS ================== */
// Captura todos os scripts já carregados
Array.from(document.scripts).forEach(script => {
    if (script.src) {
        const fileName = script.src.split('/').pop();
        scriptOrigins.set(fileName, script.src);
    }
});

/* ================== FUNÇÃO SIMPLIFICADA DE DETECÇÃO ================== */
function recordActivity(type, action, details = '') {
    try {
        // Tenta obter o caller da forma mais simples
        const error = new Error();
        const stack = error.stack || '';
        const lines = stack.split('\n');
        
        let fileName = 'unknown';
        for (let i = 2; i < Math.min(lines.length, 6); i++) {
            const line = lines[i];
            // Procura por .js na stack
            const jsMatch = line.match(/\/([^\/:]+\.js)(?::|$)/);
            if (jsMatch && !jsMatch[1].includes('diagnostics')) {
                fileName = jsMatch[1];
                break;
            }
        }
        
        if (!fileMap.has(fileName)) {
            fileMap.set(fileName, {
                CORE: [],
                PERFORMANCE: [],
                SUPPORT: [],
                UTIL: [],
                EXTERNAL: []
            });
        }
        
        const fileData = fileMap.get(fileName);
        const entry = `${action}${details ? `: ${details}` : ''}`;
        fileData[type].push(entry);
        
    } catch (e) {
        // Silencioso em caso de erro
    }
}

/* ================== INTERCEPTORES SIMPLIFICADOS ================== */

// 1. Intercepta criação de elementos DOM importantes
const origCreateElement = document.createElement;
document.createElement = function(tagName, options) {
    if (['div', 'button', 'input', 'form', 'iframe'].includes(tagName.toLowerCase())) {
        recordActivity('CORE', 'createElement', tagName);
    }
    return origCreateElement.call(this, tagName, options);
};

// 2. Intercepta event listeners importantes
const origAddEventListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, listener, options) {
    const importantEvents = ['click', 'submit', 'change', 'load', 'error', 'message'];
    if (importantEvents.includes(type)) {
        recordActivity('CORE', 'addEventListener', type);
    }
    return origAddEventListener.call(this, type, listener, options);
};

// 3. Intercepta fetch requests
if (window.fetch) {
    const origFetch = window.fetch;
    window.fetch = function(...args) {
        const url = typeof args[0] === 'string' ? args[0] : args[0]?.url || 'unknown';
        if (url.includes('supabase') || url.includes('api')) {
            recordActivity('CORE', 'fetch', url.split('/').pop().substring(0, 30));
        }
        return origFetch.apply(this, args);
    };
}

// 4. Intercepta console.log por categoria
const origConsoleLog = console.log;
console.log = function(...args) {
    const firstArg = String(args[0] || '');
    
    // Classifica pelo conteúdo do log
    if (firstArg.includes('✅') || firstArg.includes('🎉') || firstArg.includes('✓')) {
        recordActivity('SUPPORT', 'log.success', firstArg.substring(0, 40));
    } else if (firstArg.includes('❌') || firstArg.includes('⚠️') || firstArg.includes('🚨')) {
        recordActivity('SUPPORT', 'log.error', firstArg.substring(0, 40));
    } else if (firstArg.includes('🔍') || firstArg.includes('📊') || firstArg.includes('🩺')) {
        recordActivity('SUPPORT', 'log.diagnostic', firstArg.substring(0, 40));
    } else if (firstArg.includes('⚡') || firstArg.includes('🚀') || firstArg.includes('📈')) {
        recordActivity('PERFORMANCE', 'log.performance', firstArg.substring(0, 40));
    } else if (firstArg.includes('🛠️') || firstArg.includes('🔧') || firstArg.includes('⚙️')) {
        recordActivity('CORE', 'log.core', firstArg.substring(0, 40));
    } else if (firstArg.includes('supabase') || firstArg.includes('Supabase')) {
        recordActivity('EXTERNAL', 'log.external', firstArg.substring(0, 40));
    }
    
    return origConsoleLog.apply(console, args);
};

// 5. Intercepta supabase se ainda não estiver carregado
if (!window.supabase) {
    Object.defineProperty(window, 'supabase', {
        set(value) {
            recordActivity('EXTERNAL', 'supabase.loaded', 'SDK initialized');
            // Define a propriedade normalmente
            Object.defineProperty(window, 'supabase', {
                value,
                writable: true,
                configurable: true
            });
        },
        configurable: true
    });
} else {
    recordActivity('EXTERNAL', 'supabase.present', 'Already loaded');
}

// 6. Intercepta timers de otimização
const origSetTimeout = window.setTimeout;
window.setTimeout = function(fn, delay) {
    if (delay > 100) { // Timers longos são geralmente otimizações
        recordActivity('PERFORMANCE', 'setTimeout', `${delay}ms`);
    }
    return origSetTimeout.apply(this, arguments);
};

/* ================== CLASSIFICAÇÃO DOS ARQUIVOS ================== */
function classifyFile(fileName, behaviors) {
    // Conta as atividades por tipo
    const scores = {
        CORE: behaviors.CORE.length * 3,
        PERFORMANCE: behaviors.PERFORMANCE.length * 2,
        SUPPORT: behaviors.SUPPORT.length * 1,
        EXTERNAL: behaviors.EXTERNAL.length * 5,
        UTIL: behaviors.UTIL.length * 1
    };
    
    // Heurísticas adicionais pelo nome do arquivo
    if (fileName.includes('core-')) scores.CORE += 5;
    if (fileName.includes('optimizer')) scores.PERFORMANCE += 5;
    if (fileName.includes('checker') || fileName.includes('diagnostic')) scores.SUPPORT += 5;
    if (fileName.includes('utils') || fileName.includes('helper')) scores.UTIL += 3;
    if (fileName.includes('supabase')) scores.EXTERNAL += 10;
    if (fileName.includes('admin')) scores.CORE += 10;
    if (fileName.includes('media-') || fileName.includes('pdf-')) scores.CORE += 3;
    
    // Retorna o tipo com maior pontuação
    return Object.entries(scores).reduce((max, [type, score]) => 
        score > max.score ? { type, score } : max, 
        { type: 'CORE', score: 0 }
    ).type;
}

/* ================== GERA RELATÓRIO ================== */
function generateReport() {
    if (!panel) return;
    
    // Limpa conteúdo anterior (exceto cabeçalho)
    while (panel.children.length > 3) {
        panel.removeChild(panel.lastChild);
    }
    
    ui('\n📊 MAPEAMENTO POR COMPORTAMENTO REAL\n');
    
    // Classifica cada arquivo
    const classifiedFiles = [];
    fileMap.forEach((behaviors, fileName) => {
        const type = classifyFile(fileName, behaviors);
        classifiedFiles.push({ fileName, type, behaviors });
    });
    
    // Agrupa por tipo
    const grouped = {};
    classifiedFiles.forEach(file => {
        grouped[file.type] = grouped[file.type] || [];
        grouped[file.type].push(file);
    });
    
    // Mostra resumo
    ui('📈 RESUMO DE CLASSIFICAÇÃO:');
    Object.entries(grouped).forEach(([type, files]) => {
        ui(`${type}: ${files.length} arquivo${files.length !== 1 ? 's' : ''}`);
    });
    
    // Mostra detalhes por tipo
    Object.entries(grouped).forEach(([type, files]) => {
        ui(`\n🧩 ${type.toUpperCase()} (${files.length})`);
        
        files.forEach(file => {
            // Conta atividades totais
            const totalActions = Object.values(file.behaviors)
                .reduce((sum, arr) => sum + arr.length, 0);
            
            ui(`\n  📄 ${file.fileName} (${totalActions} ações)`);
            
            // Mostra ações mais importantes (máximo 3 por tipo)
            Object.entries(file.behaviors).forEach(([actionType, actions]) => {
                if (actions.length > 0) {
                    const uniqueActions = [...new Set(actions)].slice(0, 2);
                    ui(`    └─ ${actionType}: ${uniqueActions.join(', ')}${actions.length > 2 ? `... (+${actions.length - 2})` : ''}`);
                }
            });
        });
    });
    
    // Health Score
    let health = 100;
    const coreCount = grouped.CORE?.length || 0;
    const supportCount = grouped.SUPPORT?.length || 0;
    
    if (coreCount < 4) health -= (4 - coreCount) * 10;
    if (supportCount < 2) health -= 10;
    if (!grouped.EXTERNAL && window.supabase) health += 5;
    
    ui(`\n🩺 HEALTH SCORE: ${Math.max(0, health)}/100`);
    ui(`🎯 Core: ${coreCount} | 🧩 Suporte: ${supportCount} | ⚡ Performance: ${grouped.PERFORMANCE?.length || 0}`);
    
    console.log('🔍 File behavior analysis:', Array.from(fileMap.entries()));
}

/* ================== EXECUÇÃO AUTOMÁTICA ================== */
// Aguarda um pouco para capturar atividades iniciais
setTimeout(() => {
    if (ACTIVE) {
        ui('\n⏳ Coletando dados de comportamento...');
        setTimeout(() => {
            generateReport();
            
            // Adiciona botão para atualizar
            const refreshBtn = document.createElement('button');
            refreshBtn.textContent = '🔄 Atualizar Análise';
            refreshBtn.style.cssText = `
                margin-top: 15px; padding: 8px 12px;
                background: #00ff9c; color: #000; border: none;
                border-radius: 4px; cursor: pointer;
                font-family: monospace; font-weight: bold;
            `;
            refreshBtn.onclick = generateReport;
            panel.appendChild(refreshBtn);
            
        }, 1500);
    }
}, 500);

/* ================== CAPTURA DE NOVOS SCRIPTS ================== */
// Monitora adição de novos scripts
const observer = new MutationObserver((mutations) => {
    mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
            if (node.tagName === 'SCRIPT' && node.src) {
                const fileName = node.src.split('/').pop();
                scriptOrigins.set(fileName, node.src);
                recordActivity('CORE', 'script.loaded', fileName);
            }
        });
    });
});

observer.observe(document.head, { childList: true });
