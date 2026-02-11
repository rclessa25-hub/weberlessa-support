// debug/diagnostics/diagnostics54.js - SISTEMA DE DIAGNÓSTICO FUNCIONAL v5.4.5
console.log('🎛️ diagnostics54.js - SISTEMA FUNCIONAL CARREGADO');

(function() {
    'use strict';
    
    // ========== CONFIGURAÇÃO SIMPLIFICADA ==========
    const CONFIG = {
        version: '5.4.5',
        namespace: 'DiagnosticsV54',
        autoStart: true
    };
    
    // ========== ESTADO ==========
    const state = {
        logs: [],
        isVisible: false,
        startTime: Date.now()
    };
    
    // ========== ELEMENTOS ==========
    const elements = {};
    
    // ========== ESTILOS ESSENCIAIS ==========
    const STYLES = `
        /* BOTÃO FLUTUANTE */
        #diagnostics-floating-btn {
            position: fixed !important;
            bottom: 30px !important;
            right: 30px !important;
            width: 70px !important;
            height: 70px !important;
            border-radius: 50% !important;
            background: linear-gradient(135deg, #ff6b6b, #ff3333) !important;
            color: white !important;
            border: 3px solid white !important;
            font-size: 28px !important;
            cursor: pointer !important;
            z-index: 999998 !important;
            box-shadow: 0 6px 25px rgba(255, 107, 107, 0.7) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s ease !important;
            animation: pulse 2s infinite !important;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(255, 107, 107, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
        }
        
        /* CONTAINER PRINCIPAL */
        #diagnostics-container {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90% !important;
            max-width: 1200px !important;
            height: 80vh !important;
            background: #0a0a0a !important;
            border: 4px solid #ff6b6b !important;
            border-radius: 12px !important;
            z-index: 999999 !important;
            box-shadow: 0 0 50px rgba(255, 107, 107, 0.5) !important;
            display: none !important;
            overflow: hidden !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
        }
        
        /* HEADER */
        .diagnostics-header {
            background: linear-gradient(90deg, #111, #222) !important;
            padding: 20px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-bottom: 3px solid #ff6b6b !important;
        }
        
        .diagnostics-header h2 {
            margin: 0 !important;
            color: #ff6b6b !important;
            font-size: 1.6rem !important;
        }
        
        .header-controls {
            display: flex !important;
            gap: 10px !important;
        }
        
        .control-btn {
            background: #222 !important;
            color: #ff6b6b !important;
            border: 2px solid #ff6b6b !important;
            padding: 10px 15px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-weight: bold !important;
            transition: all 0.3s !important;
        }
        
        .control-btn:hover {
            background: #ff6b6b !important;
            color: #000 !important;
        }
        
        .close-btn {
            background: #ff3333 !important;
            color: white !important;
            border-color: #ff6666 !important;
        }
        
        /* CONTEÚDO */
        .diagnostics-content {
            height: calc(100% - 80px) !important;
            overflow-y: auto !important;
            padding: 20px !important;
            background: #111 !important;
        }
        
        /* PAINÉIS BÁSICOS */
        .panel-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
            gap: 20px !important;
            margin-bottom: 20px !important;
        }
        
        .panel {
            background: #151515 !important;
            border: 2px solid #333 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
        }
        
        .panel-header {
            background: #222 !important;
            padding: 15px !important;
            border-bottom: 2px solid #444 !important;
        }
        
        .panel-header h3 {
            margin: 0 !important;
            color: #ff6b6b !important;
        }
        
        .panel-body {
            padding: 15px !important;
            color: #ddd !important;
        }
        
        /* BOTÕES */
        .test-btn {
            display: block !important;
            width: 100% !important;
            background: #222 !important;
            color: #ff6b6b !important;
            border: 2px solid #333 !important;
            padding: 12px !important;
            margin: 8px 0 !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            text-align: left !important;
            transition: all 0.3s !important;
        }
        
        .test-btn:hover {
            background: #ff6b6b !important;
            color: #000 !important;
        }
        
        /* LOGS */
        #logs-container {
            background: #000 !important;
            border: 2px solid #333 !important;
            border-radius: 8px !important;
            padding: 15px !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            font-family: 'Courier New', monospace !important;
        }
        
        .log-entry {
            padding: 8px !important;
            border-bottom: 1px solid #222 !important;
            display: flex !important;
            gap: 10px !important;
        }
        
        .log-time {
            color: #888 !important;
            min-width: 80px !important;
        }
        
        .log-type {
            font-weight: bold !important;
            min-width: 70px !important;
        }
        
        .log-type.info { color: #3498db !important; }
        .log-type.success { color: #27ae60 !important; }
        .log-type.warning { color: #f39c12 !important; }
        .log-type.error { color: #e74c3c !important; }
    `;
    
    // ========== FUNÇÕES DE LOG ==========
    function log(type, message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const entry = { timestamp, type, message, data };
        
        state.logs.unshift(entry);
        if (state.logs.length > 100) state.logs.pop();
        
        // Console
        const colors = {
            info: 'color: #3498db;',
            success: 'color: #27ae60;',
            warning: 'color: #f39c12;',
            error: 'color: #e74c3c;'
        };
        
        console.log(`%c[${CONFIG.namespace}] [${timestamp}] ${type.toUpperCase()}: ${message}`, colors[type] || '', data || '');
        
        // Atualizar UI
        if (state.isVisible && elements.logsContainer) {
            updateLogs();
        }
        
        return entry;
    }
    
    function updateLogs() {
        if (!elements.logsContainer) return;
        
        const html = state.logs.slice(0, 20).map(log => `
            <div class="log-entry">
                <span class="log-time">${log.timestamp}</span>
                <span class="log-type ${log.type}">${log.type.toUpperCase()}</span>
                <span style="color: #ccc;">${log.message}</span>
            </div>
        `).join('');
        
        elements.logsContainer.innerHTML = html;
    }
    
    // ========== CRIAÇÃO DA UI ==========
    function createUI() {
        // Remover existentes
        const oldContainer = document.getElementById('diagnostics-container');
        const oldBtn = document.getElementById('diagnostics-floating-btn');
        const oldStyle = document.getElementById('diagnostics-styles');
        
        if (oldContainer) oldContainer.remove();
        if (oldBtn) oldBtn.remove();
        if (oldStyle) oldStyle.remove();
        
        // Adicionar estilos
        const style = document.createElement('style');
        style.id = 'diagnostics-styles';
        style.textContent = STYLES;
        document.head.appendChild(style);
        
        // Criar botão flutuante
        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'diagnostics-floating-btn';
        floatingBtn.innerHTML = '🔍';
        floatingBtn.title = 'Abrir Diagnóstico (Ctrl+Shift+D)';
        floatingBtn.addEventListener('click', () => window[CONFIG.namespace].show());
        document.body.appendChild(floatingBtn);
        
        // Criar container principal
        const container = document.createElement('div');
        container.id = 'diagnostics-container';
        
        container.innerHTML = `
            <div class="diagnostics-header">
                <h2>
                    <span>🔧</span>
                    DIAGNÓSTICO V54 - v${CONFIG.version}
                </h2>
                <div class="header-controls">
                    <button class="control-btn" id="run-all-btn">
                        🧪 TESTAR TUDO
                    </button>
                    <button class="control-btn" id="export-btn">
                        📊 EXPORTAR
                    </button>
                    <button class="control-btn close-btn" id="close-btn">
                        ✕ FECHAR
                    </button>
                </div>
            </div>
            
            <div class="diagnostics-content">
                <div class="panel-grid">
                    <div class="panel">
                        <div class="panel-header">
                            <h3>📊 SISTEMA</h3>
                        </div>
                        <div class="panel-body">
                            <p><strong>URL:</strong> ${window.location.href}</p>
                            <p><strong>Tela:</strong> ${window.innerWidth} × ${window.innerHeight}</p>
                            <p><strong>Tempo:</strong> ${(Date.now() - state.startTime)}ms</p>
                            <button class="test-btn" id="check-modules-btn">
                                🔍 Verificar Módulos
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <div class="panel-header">
                            <h3>🏠 IMÓVEIS</h3>
                        </div>
                        <div class="panel-body">
                            <p><strong>Total:</strong> <span id="prop-count">${window.properties?.length || 0}</span></p>
                            <p><strong>Cards:</strong> <span id="card-count">${document.querySelectorAll('.property-card').length}</span></p>
                            <button class="test-btn" id="list-props-btn">
                                📋 Listar Imóveis
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <div class="panel-header">
                            <h3>📄 PDF SYSTEM</h3>
                        </div>
                        <div class="panel-body">
                            <p><strong>Modal:</strong> ${document.getElementById('pdfModal') ? '✅' : '❌'}</p>
                            <p><strong>Sistema:</strong> ${window.PdfSystem ? '✅' : '❌'}</p>
                            <p><strong>Botões:</strong> ${document.querySelectorAll('.pdf-access').length}</p>
                            <button class="test-btn" id="test-pdf-btn">
                                🧪 Testar PDF
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <div class="panel-header">
                            <h3>🌐 SUPABASE</h3>
                        </div>
                        <div class="panel-body">
                            <p><strong>Cliente:</strong> ${window.supabaseClient ? '✅' : '❌'}</p>
                            <p><strong>URL:</strong> ${window.SUPABASE_CONSTANTS?.URL ? '✅' : '❌'}</p>
                            <button class="test-btn" id="test-supabase-btn">
                                🔗 Testar Conexão
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="panel">
                    <div class="panel-header">
                        <h3>📝 LOGS DO SISTEMA</h3>
                    </div>
                    <div class="panel-body">
                        <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                            <button class="control-btn" id="clear-logs-btn">
                                🗑️ Limpar Logs
                            </button>
                            <button class="control-btn" id="export-logs-btn">
                                💾 Exportar Logs
                            </button>
                        </div>
                        <div id="logs-container">
                            <!-- Logs aqui -->
                        </div>
                    </div>
                </div>
                
                <div class="panel">
                    <div class="panel-header">
                        <h3>🔧 AÇÕES RÁPIDAS</h3>
                    </div>
                    <div class="panel-body">
                        <button class="test-btn" id="fix-pdf-btns-btn">
                            🔧 Corrigir Botões PDF
                        </button>
                        <button class="test-btn" id="check-perf-btn">
                            ⚡ Verificar Performance
                        </button>
                        <button class="test-btn" id="reload-props-btn">
                            🔄 Recarregar Imóveis
                        </button>
                        <button class="test-btn" id="debug-mode-btn">
                            🐛 Modo Debug
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        
        // Armazenar referências
        elements.container = container;
        elements.logsContainer = document.getElementById('logs-container');
        
        // Configurar eventos DOS BOTÕES
        setupEventListeners();
        
        log('success', '✅ Interface criada com sucesso');
    }
    
    function setupEventListeners() {
        // Botão FECHAR - FUNÇÃO DIRETA E GARANTIDA
        const closeBtn = document.getElementById('close-btn');
        if (closeBtn) {
            // Evento principal
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (elements.container) {
                    elements.container.style.display = 'none';
                    state.isVisible = false;
                    log('success', '✅ Painel fechado com sucesso');
                }
            });
            
            // Evento secundário como fallback
            closeBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (elements.container) {
                    elements.container.style.display = 'none';
                    state.isVisible = false;
                    log('success', '✅ Painel fechado (fallback)');
                }
            };
        }
        
        // Outros botões
        const setupBtn = (id, handler) => {
            const btn = document.getElementById(id);
            if (btn) btn.addEventListener('click', handler);
        };
        
        setupBtn('run-all-btn', () => window[CONFIG.namespace].runAllTests());
        setupBtn('export-btn', () => window[CONFIG.namespace].exportReport());
        setupBtn('check-modules-btn', () => verifyModules());
        setupBtn('list-props-btn', () => listProperties());
        setupBtn('test-pdf-btn', () => testPDFSystem());
        setupBtn('test-supabase-btn', () => testSupabase());
        setupBtn('clear-logs-btn', () => window[CONFIG.namespace].clearLogs());
        setupBtn('export-logs-btn', () => window[CONFIG.namespace].exportLogs());
        setupBtn('fix-pdf-btns-btn', () => fixPDFButtons());
        setupBtn('check-perf-btn', () => checkPerformance());
        setupBtn('reload-props-btn', () => reloadProperties());
        setupBtn('debug-mode-btn', () => enableDebugMode());
        
        // Tecla ESC para fechar
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && state.isVisible) {
                if (elements.container) {
                    elements.container.style.display = 'none';
                    state.isVisible = false;
                    log('info', '⌨️ Painel fechado com ESC');
                }
            }
        });
    }
    
    // ========== FUNÇÕES DO DIAGNÓSTICO ==========
    function verifyModules() {
        log('info', '📦 Verificando módulos...');
        
        const modules = [
            'SharedCore',
            'MediaSystem', 
            'PdfSystem',
            'LoadingManager',
            'FilterManager',
            'properties',
            'supabaseClient'
        ];
        
        modules.forEach(name => {
            const exists = name === 'properties' 
                ? Array.isArray(window[name])
                : !!window[name];
            
            log(exists ? 'success' : 'error', 
                `${exists ? '✅' : '❌'} ${name}: ${exists ? 'OK' : 'AUSENTE'}`);
        });
        
        return modules;
    }
    
    function listProperties() {
        const props = window.properties || [];
        log('info', `🏠 ${props.length} imóveis encontrados`);
        
        if (props.length > 0) {
            props.slice(0, 3).forEach((prop, i) => {
                log('info', `   ${i+1}. ${prop.title || 'Sem título'} (ID: ${prop.id})`);
            });
        }
        
        return props;
    }
    
    function testPDFSystem() {
        log('info', '📄 Testando sistema PDF...');
        
        const results = {
            modal: !!document.getElementById('pdfModal'),
            system: !!window.PdfSystem,
            buttons: document.querySelectorAll('.pdf-access').length,
            hasOnclick: 0
        };
        
        // Verificar botões
        document.querySelectorAll('.pdf-access').forEach(btn => {
            if (btn.onclick || btn.getAttribute('onclick')) {
                results.hasOnclick++;
            }
        });
        
        log('info', '📊 Resultados PDF:', results);
        
        if (results.buttons > 0 && results.hasOnclick < results.buttons) {
            log('warning', `⚠️ ${results.buttons - results.hasOnclick} botões PDF sem evento`);
        }
        
        return results;
    }
    
    function fixPDFButtons() {
        log('info', '🔧 Corrigindo botões PDF...');
        
        let fixed = 0;
        document.querySelectorAll('.pdf-access').forEach(btn => {
            if (!btn.onclick && !btn.getAttribute('onclick')) {
                const card = btn.closest('.property-card');
                const propId = card?.getAttribute('data-property-id');
                
                if (propId && window.PdfSystem?.showModal) {
                    btn.setAttribute('onclick', `event.stopPropagation(); window.PdfSystem.showModal(${propId})`);
                    fixed++;
                }
            }
        });
        
        log('success', `✅ ${fixed} botões PDF corrigidos`);
        return fixed;
    }
    
    function testSupabase() {
        log('info', '🌐 Testando Supabase...');
        
        if (!window.supabaseClient) {
            log('error', '❌ Supabase não disponível');
            return false;
        }
        
        log('success', '✅ Supabase disponível');
        return true;
    }
    
    function checkPerformance() {
        const perf = {
            loadTime: Date.now() - state.startTime,
            properties: window.properties?.length || 0,
            scripts: document.querySelectorAll('script').length,
            images: document.querySelectorAll('img').length
        };
        
        log('info', '⚡ Performance:', perf);
        return perf;
    }
    
    function reloadProperties() {
        if (window.SharedCore?.fetchProperties) {
            log('info', '🔄 Recarregando imóveis...');
            window.SharedCore.fetchProperties();
        }
    }
    
    function enableDebugMode() {
        localStorage.setItem('debug_mode', 'true');
        log('success', '🐛 Modo debug ativado');
    }
    
    // ========== API PÚBLICA ==========
    window[CONFIG.namespace] = {
        show: function() {
            // Criar UI se necessário
            if (!elements.container) {
                createUI();
            }
            
            // Mostrar container
            elements.container.style.display = 'block';
            state.isVisible = true;
            
            // Atualizar dados
            setTimeout(() => {
                const propCount = document.getElementById('prop-count');
                const cardCount = document.getElementById('card-count');
                
                if (propCount) propCount.textContent = window.properties?.length || 0;
                if (cardCount) cardCount.textContent = document.querySelectorAll('.property-card').length;
                
                updateLogs();
            }, 100);
            
            log('success', '🎛️ Painel de diagnóstico aberto');
            return true;
        },
        
        hide: function() {
            if (elements.container) {
                elements.container.style.display = 'none';
                state.isVisible = false;
                log('info', '🎛️ Painel fechado');
            }
        },
        
        toggle: function() {
            if (state.isVisible) {
                this.hide();
            } else {
                this.show();
            }
        },
        
        runAllTests: function() {
            log('info', '🚀 Executando todos os testes...');
            
            verifyModules();
            testPDFSystem();
            fixPDFButtons();
            testSupabase();
            checkPerformance();
            
            log('success', '✅ Todos os testes concluídos');
        },
        
        clearLogs: function() {
            state.logs = [];
            updateLogs();
            log('info', '🗑️ Logs limpos');
        },
        
        exportLogs: function() {
            const data = JSON.stringify(state.logs, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diagnostics-logs-${Date.now()}.json`;
            a.click();
            log('success', '💾 Logs exportados');
        },
        
        exportReport: function() {
            const report = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                properties: window.properties?.length || 0,
                logs: state.logs
            };
            
            const data = JSON.stringify(report, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diagnostics-report-${Date.now()}.json`;
            a.click();
            log('success', '📊 Relatório exportado');
        },
        
        getLogs: function() {
            return [...state.logs];
        }
    };
    
    // ========== INICIALIZAÇÃO ==========
    function init() {
        log('info', `🔧 ${CONFIG.namespace} v${CONFIG.version} inicializado`);
        
        // Criar botão flutuante imediatamente
        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'diagnostics-floating-btn';
        floatingBtn.innerHTML = '🔍';
        floatingBtn.title = 'Abrir Diagnóstico (Ctrl+Shift+D)';
        floatingBtn.addEventListener('click', () => window[CONFIG.namespace].show());
        document.body.appendChild(floatingBtn);
        
        // Verificar abertura automática
        if (CONFIG.autoStart && window.location.search.includes('diagnostics=true')) {
            setTimeout(() => {
                window[CONFIG.namespace].show();
                
                // Verificações iniciais
                setTimeout(() => {
                    verifyModules();
                    checkPerformance();
                }, 1000);
            }, 2000);
        }
        
        // Hotkeys
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                window[CONFIG.namespace].toggle();
            }
            
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                window[CONFIG.namespace].runAllTests();
            }
        });
        
        console.log(`🎛️ ${CONFIG.namespace}: Clique no botão 🔍 ou use Ctrl+Shift+D`);
    }
    
    // Iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
})();
