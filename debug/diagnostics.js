// debug/diagnostics.js
console.log('🔍 diagnostics.js – mapeamento arquivo ↔ comportamento');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const ACTIVE = params.get('debug') === 'true' && params.get('diagnostics') === 'true';

/* ================== PAINEL ================== */
let panel;
function ui(msg) {
    console.log(msg);
    if (!panel) return;
    const d = document.createElement('div');
    d.textContent = msg;
    panel.appendChild(d);
}

if (ACTIVE) {
    panel = document.createElement('div');
    panel.style.cssText = `
        position:fixed;top:10px;right:10px;width:620px;
        max-height:92vh;overflow:auto;
        background:#0b0b0b;color:#00ff9c;
        font:12px monospace;padding:10px;
        border:1px solid #00ff9c;z-index:99999;
    `;
    panel.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center">
            <b>🔍 RUNTIME DIAGNOSTICS</b>
            <button onclick="this.parentNode.parentNode.style.display='none'" 
                    style="background:#ff5555;color:white;border:none;padding:2px 6px;cursor:pointer">
                X
            </button>
        </div>
        <hr>`;
    document.body.appendChild(panel);
}

/* ================== ARMAZENAMENTO POR ARQUIVO ================== */
const fileMap = new Map(); // nome_arquivo -> { CORE: [...], SUPPORT: [...], etc }

function getCallerFile() {
    try {
        const stack = new Error().stack.split('\n');
        // Pula as linhas de erro e da própria função getCallerFile
        for (let i = 2; i < stack.length; i++) {
            const line = stack[i].trim();
            // Extrai nome do arquivo de URLs ou caminhos locais
            const match = line.match(/(https?:\/\/[^\/]+\/)?([^\/:]+\.js)/);
            if (match) {
                const fileName = match[2];
                // Filtra arquivos internos do navegador e diagnostics.js
                if (!fileName.includes('diagnostics.js') && 
                    !fileName.startsWith('native') &&
                    fileName.includes('.js')) {
                    return fileName;
                }
            }
        }
        return 'unknown';
    } catch {
        return 'unknown';
    }
}

function recordActivity(type, action, details = '') {
    const fileName = getCallerFile();
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
    const entry = `${action}${details ? ` (${details})` : ''}`;
    fileData[type].push(entry);
}

/* ================== INTERCEPTORES COM CAPTURA DE ORIGEM ================== */

// DOM Creation
const origCreate = document.createElement;
document.createElement = function(tag) {
    recordActivity('CORE', 'createElement', tag);
    return origCreate.apply(this, arguments);
};

// Event Listeners
const origAddListener = EventTarget.prototype.addEventListener;
EventTarget.prototype.addEventListener = function(type, handler) {
    recordActivity('CORE', 'addEventListener', type);
    return origAddListener.apply(this, arguments);
};

// Timers
const origSetTimeout = window.setTimeout;
window.setTimeout = function(fn, delay) {
    recordActivity('PERFORMANCE', 'setTimeout', `${delay}ms`);
    return origSetTimeout.apply(this, arguments);
};

const origSetInterval = window.setInterval;
window.setInterval = function(fn, interval) {
    recordActivity('PERFORMANCE', 'setInterval', `${interval}ms`);
    return origSetInterval.apply(this, arguments);
};

// Console logs (classifica por tipo)
const origLog = console.log;
console.log = function(...args) {
    const firstArg = args[0];
    let type = 'SUPPORT';
    
    if (typeof firstArg === 'string') {
        if (firstArg.includes('✅') || firstArg.includes('🎉')) {
            type = 'SUPPORT';
        } else if (firstArg.includes('⚡') || firstArg.includes('📈')) {
            type = 'PERFORMANCE';
        } else if (firstArg.includes('🔧') || firstArg.includes('🛠️')) {
            type = 'CORE';
        } else if (firstArg.includes('❌') || firstArg.includes('⚠️')) {
            type = 'SUPPORT';
        }
    }
    
    recordActivity(type, 'console.log', args[0]?.toString().slice(0, 50));
    return origLog.apply(console, args);
};

// Fetch/XHR (para detectar integração)
const origFetch = window.fetch;
window.fetch = function(...args) {
    recordActivity('CORE', 'fetch', args[0]?.toString().slice(0, 30));
    return origFetch.apply(this, arguments);
};

// Supabase client (detecção específica)
const originalSupabase = window.supabase;
Object.defineProperty(window, 'supabase', {
    set(value) {
        recordActivity('EXTERNAL', 'supabase', 'SDK loaded');
        Object.defineProperty(window, 'supabase', { value, writable: true });
    },
    configurable: true
});

/* ================== RELATÓRIO DETALHADO POR ARQUIVO ================== */
function generateReport() {
    ui('📊 MAPEAMENTO ARQUIVO → COMPORTAMENTO');
    
    // Agrupa por tipo principal de cada arquivo
    const classification = new Map();
    
    fileMap.forEach((behaviors, fileName) => {
        // Determina tipo principal pelo comportamento mais frequente
        let maxType = 'CORE';
        let maxCount = 0;
        
        for (const [type, actions] of Object.entries(behaviors)) {
            if (actions.length > maxCount) {
                maxCount = actions.length;
                maxType = type;
            }
        }
        
        classification.set(fileName, {
            type: maxType,
            behaviors: behaviors
        });
    });
    
    // Mostra por tipo
    const grouped = {
        CORE: [],
        PERFORMANCE: [],
        SUPPORT: [],
        UTIL: [],
        EXTERNAL: []
    };
    
    classification.forEach((data, fileName) => {
        grouped[data.type].push({ fileName, behaviors: data.behaviors });
    });
    
    // Resumo
    ui('\n📈 RESUMO DE CLASSIFICAÇÃO:');
    Object.entries(grouped).forEach(([type, files]) => {
        ui(`${type}: ${files.length} arquivos`);
    });
    
    // Detalhamento
    Object.entries(grouped).forEach(([type, files]) => {
        if (files.length > 0) {
            ui(`\n🧩 ${type} (${files.length})`);
            files.forEach(({ fileName, behaviors }) => {
                ui(`  📄 ${fileName}`);
                
                // Mostra comportamentos mais relevantes
                Object.entries(behaviors).forEach(([behaviorType, actions]) => {
                    if (actions.length > 0) {
                        const uniqueActions = [...new Set(actions.slice(0, 3))];
                        ui(`    └─ ${behaviorType}: ${uniqueActions.join(', ')}${actions.length > 3 ? `... (+${actions.length - 3})` : ''}`);
                    }
                });
            });
        }
    });
    
    // Health Score baseado na distribuição
    let health = 100;
    const coreFiles = grouped.CORE.length;
    const supportFiles = grouped.SUPPORT.length;
    
    if (coreFiles < 3) health -= 30;
    if (supportFiles === 0) health -= 20;
    if (grouped.EXTERNAL.length === 0 && window.supabase) health -= 10;
    
    ui(`\n🩺 HEALTH SCORE: ${health}/100`);
    ui(`🎯 CORE: ${coreFiles} | 🧩 SUPORTE: ${supportFiles} | ⚡ PERFORMANCE: ${grouped.PERFORMANCE.length}`);
}

/* ================== EXECUÇÃO ================== */
// Aguarda carregamento completo
setTimeout(() => {
    if (ACTIVE) {
        generateReport();
        console.log('🔍 File behavior map:', Object.fromEntries(fileMap));
    }
}, 2000);

// Botão para forçar atualização
if (ACTIVE) {
    const refreshBtn = document.createElement('button');
    refreshBtn.textContent = '🔄 Atualizar Diagnóstico';
    refreshBtn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #00ff9c; color: #000; border: none;
        padding: 8px 12px; font-family: monospace;
        cursor: pointer; z-index: 99999;
        border-radius: 4px;
    `;
    refreshBtn.onclick = generateReport;
    document.body.appendChild(refreshBtn);
}
