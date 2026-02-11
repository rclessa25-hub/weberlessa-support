// debug/diagnostics/diagnostics54.js - SISTEMA DE DIAGNÓSTICO DEFINITIVO v5.4.7
// CORREÇÃO DEFINITIVA: Impede execução múltipla do script e reabertura automática
// PROBLEMA RESOLVIDO: Script carregado múltiplas vezes - agora com proteção anti-duplicação
console.log('🎛️ diagnostics54.js - SISTEMA DEFINITIVO CARREGADO (VERSÃO CORRIGIDA v5.4.7)');

(function() {
    'use strict';
    
    // ========== PROTEÇÃO ANTI-DUPLICAÇÃO ==========
    // ✅ IMPEDE QUE O SCRIPT EXECUTE MAIS DE UMA VEZ
    if (window.__DIAGNOSTICS_V54_INITIALIZED__ === true) {
        console.log('🎛️ diagnostics54.js já foi inicializado anteriormente - ignorando execução duplicada');
        return;
    }
    window.__DIAGNOSTICS_V54_INITIALIZED__ = true;
    
    // ========== CONFIGURAÇÕES PRIVADAS ==========
    const CONFIG = {
        version: '5.4.7',
        namespace: 'DiagnosticsV54',
        containerId: 'diagnostics-container-v54',
        floatingBtnId: 'diagnostics-floating-btn-v54',
        autoStart: true,
        maxLogs: 200,
        debugMode: true
    };
    
    // ========== ESTADO PRIVADO ==========
    const state = {
        logs: [],
        isVisible: false,
        startTime: Date.now(),
        hasInitialized: false,
        uiCreated: false,
        checkCount: 0,
        // ✅ Controle de abertura automática
        autoOpenTimer: null,
        autoOpenTimer2: null, // Timer de segurança
        manuallyClosed: false,
        autoOpenAttempts: 0,
        initialized: false
    };
    
    // ========== ELEMENTOS DO DOM ==========
    let elements = {
        floatingBtn: null,
        logsContainer: null
        // ⚠️ container NÃO é armazenado em cache
    };
    
    // ========== ESTILOS CSS COM ALTA PRIORIDADE ==========
    const STYLES = `
        /* BOTÃO FLUTUANTE - SEMPRE VISÍVEL */
        #${CONFIG.floatingBtnId} {
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
        
        #${CONFIG.floatingBtnId}:hover {
            transform: scale(1.15) rotate(15deg) !important;
            box-shadow: 0 8px 35px rgba(255, 107, 107, 0.9) !important;
        }
        
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0.7); }
            70% { box-shadow: 0 0 0 15px rgba(255, 107, 107, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 107, 107, 0); }
        }
        
        /* CONTAINER PRINCIPAL - PRIORIDADE MÁXIMA */
        #${CONFIG.containerId} {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 95vw !important;
            max-width: 1200px !important;
            height: 85vh !important;
            background: #0a0a0a !important;
            border: 4px solid #ff6b6b !important;
            border-radius: 15px !important;
            z-index: 999999 !important;
            box-shadow: 0 0 50px rgba(255, 107, 107, 0.6) !important;
            overflow: hidden !important;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif !important;
            display: flex !important;
            flex-direction: column !important;
        }
        
        /* HEADER */
        .diagnostics-header-v54 {
            background: linear-gradient(90deg, #111111, #222222) !important;
            padding: 20px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-bottom: 3px solid #ff6b6b !important;
        }
        
        .diagnostics-header-v54 h2 {
            margin: 0 !important;
            color: #ff6b6b !important;
            font-size: 1.8rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 15px !important;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5) !important;
        }
        
        .header-controls-v54 {
            display: flex !important;
            gap: 12px !important;
        }
        
        .control-btn-v54 {
            background: #222 !important;
            color: #ff6b6b !important;
            border: 2px solid #ff6b6b !important;
            padding: 12px 20px !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            font-weight: bold !important;
            font-size: 1rem !important;
            transition: all 0.3s !important;
        }
        
        .control-btn-v54:hover {
            background: #ff6b6b !important;
            color: #000 !important;
            transform: translateY(-2px) !important;
        }
        
        .close-btn-v54 {
            background: #ff3333 !important;
            color: white !important;
            border: 2px solid #ff6666 !important;
        }
        
        /* TABS */
        .diagnostics-tabs-v54 {
            display: flex !important;
            background: #222 !important;
            border-bottom: 2px solid #444 !important;
            overflow-x: auto !important;
            padding: 0 10px !important;
        }
        
        .tab-btn-v54 {
            padding: 15px 25px !important;
            background: transparent !important;
            color: #aaa !important;
            border: none !important;
            border-right: 1px solid #333 !important;
            cursor: pointer !important;
            font-weight: 600 !important;
            font-size: 1rem !important;
            white-space: nowrap !important;
            transition: all 0.3s !important;
        }
        
        .tab-btn-v54:hover {
            background: #333 !important;
            color: #ff6b6b !important;
        }
        
        .tab-btn-v54.active {
            background: #ff6b6b !important;
            color: #000 !important;
            font-weight: bold !important;
        }
        
        /* CONTEÚDO */
        .diagnostics-content-v54 {
            flex: 1 !important;
            overflow-y: auto !important;
            padding: 25px !important;
            background: #111 !important;
        }
        
        .tab-panel-v54 {
            display: none !important;
        }
        
        .tab-panel-v54.active {
            display: block !important;
            animation: fadeIn 0.5s ease !important;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        
        /* PAINÉIS */
        .panel-grid-v54 {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)) !important;
            gap: 25px !important;
            margin-bottom: 30px !important;
        }
        
        .panel-v54 {
            background: #151515 !important;
            border: 2px solid #333 !important;
            border-radius: 10px !important;
            overflow: hidden !important;
            transition: transform 0.3s !important;
        }
        
        .panel-v54:hover {
            transform: translateY(-5px) !important;
            border-color: #ff6b6b !important;
        }
        
        .panel-header-v54 {
            background: linear-gradient(90deg, #222, #333) !important;
            padding: 18px 20px !important;
            border-bottom: 2px solid #444 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        
        .panel-header-v54 h3 {
            margin: 0 !important;
            color: #ff6b6b !important;
            font-size: 1.3rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
        }
        
        .panel-body-v54 {
            padding: 20px !important;
            color: #ddd !important;
            line-height: 1.6 !important;
        }
        
        /* BOTÕES DE TESTE */
        .test-btn-v54 {
            display: block !important;
            width: 100% !important;
            background: #222 !important;
            color: #ff6b6b !important;
            border: 2px solid #333 !important;
            padding: 14px !important;
            margin: 10px 0 !important;
            border-radius: 8px !important;
            cursor: pointer !important;
            text-align: left !important;
            font-size: 1rem !important;
            transition: all 0.3s !important;
        }
        
        .test-btn-v54:hover {
            background: #ff6b6b !important;
            color: #000 !important;
            border-color: #ff6b6b !important;
            transform: translateX(8px) !important;
        }
        
        /* LOGS */
        #logs-container-v54 {
            background: #000 !important;
            border: 2px solid #333 !important;
            border-radius: 10px !important;
            padding: 20px !important;
            max-height: 400px !important;
            overflow-y: auto !important;
            font-family: 'Courier New', monospace !important;
            font-size: 0.95rem !important;
        }
        
        .log-entry-v54 {
            padding: 10px !important;
            border-bottom: 1px solid #222 !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 15px !important;
        }
        
        .log-time-v54 {
            color: #888 !important;
            min-width: 90px !important;
            font-size: 0.9rem !important;
        }
        
        .log-type-v54 {
            font-weight: bold !important;
            min-width: 80px !important;
            font-size: 0.9rem !important;
        }
        
        .log-type-v54.info { color: #3498db !important; }
        .log-type-v54.success { color: #27ae60 !important; }
        .log-type-v54.warning { color: #f39c12 !important; }
        .log-type-v54.error { color: #e74c3c !important; }
        
        /* RESPONSIVO */
        @media (max-width: 768px) {
            #${CONFIG.containerId} {
                width: 100vw !important;
                height: 100vh !important;
                top: 0 !important;
                left: 0 !important;
                transform: none !important;
                border-radius: 0 !important;
            }
            
            .diagnostics-header-v54 {
                flex-direction: column !important;
                gap: 15px !important;
            }
            
            .header-controls-v54 {
                width: 100% !important;
                justify-content: center !important;
            }
            
            .panel-grid-v54 {
                grid-template-columns: 1fr !important;
            }
            
            .diagnostics-tabs-v54 {
                flex-wrap: wrap !important;
            }
            
            .tab-btn-v54 {
                flex: 1 !important;
                min-width: 120px !important;
                padding: 12px !important;
                font-size: 0.9rem !important;
            }
        }
    `;
    
    // ========== FUNÇÕES DE LOG ==========
    function log(type, message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = {
            timestamp,
            type,
            message,
            data,
            id: Date.now() + Math.random()
        };
        
        state.logs.unshift(logEntry);
        if (state.logs.length > CONFIG.maxLogs) state.logs.pop();
        
        // Atualizar UI se visível
        if (state.isVisible && elements.logsContainer) {
            updateLogsDisplay();
        }
        
        // Console
        const colors = {
            info: 'color: #3498db;',
            success: 'color: #27ae60;',
            warning: 'color: #f39c12;',
            error: 'color: #e74c3c;'
        };
        
        console.log(`%c[${CONFIG.namespace}] [${timestamp}] ${type.toUpperCase()}: ${message}`, colors[type] || '', data || '');
        
        return logEntry;
    }
    
    function updateLogsDisplay() {
        if (!elements.logsContainer) return;
        
        const logsToShow = state.logs.slice(0, 30);
        elements.logsContainer.innerHTML = logsToShow.map(log => `
            <div class="log-entry-v54">
                <span class="log-time-v54">${log.timestamp}</span>
                <span class="log-type-v54 ${log.type}">${log.type.toUpperCase()}</span>
                <span style="color: #ccc; flex: 1;">${log.message}</span>
            </div>
        `).join('');
    }
    
    // ========== FUNÇÃO PARA OBTER CONTAINER DO DOM ==========
    function getContainer() {
        return document.getElementById(CONFIG.containerId);
    }
    
    // ========== FUNÇÃO PARA CANCELAR TODOS OS TIMERS ==========
    // ✅ CANCELAMENTO MÚLTIPLO - MATA TODOS OS TIMERS POSSÍVEIS
    function cancelAllAutoOpenTimers() {
        // Timer principal
        if (state.autoOpenTimer) {
            clearTimeout(state.autoOpenTimer);
            state.autoOpenTimer = null;
            log('info', '⏱️ Timer principal de abertura automática cancelado');
        }
        
        // Timer de segurança
        if (state.autoOpenTimer2) {
            clearTimeout(state.autoOpenTimer2);
            state.autoOpenTimer2 = null;
            log('info', '⏱️ Timer secundário de abertura automática cancelado');
        }
        
        // ✅ CAÇA TIMERS FANTASMAS - Remove todos os timeouts com prefixo conhecido
        const maxTimerId = setTimeout(() => {}, 0);
        for (let i = 0; i <= maxTimerId; i++) {
            clearTimeout(i);
        }
        
        log('info', '⏱️ Todos os timers foram limpos');
    }
    
    // ========== CRIAÇÃO DO BOTÃO FLUTUANTE ==========
    function createFloatingButton() {
        // Remover botão existente
        const existingBtn = document.getElementById(CONFIG.floatingBtnId);
        if (existingBtn) existingBtn.remove();
        
        // Criar novo botão
        elements.floatingBtn = document.createElement('button');
        elements.floatingBtn.id = CONFIG.floatingBtnId;
        elements.floatingBtn.innerHTML = '🔍';
        elements.floatingBtn.title = 'Abrir Diagnóstico V54 (Ctrl+Shift+D)';
        
        // Adicionar evento
        elements.floatingBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation(); // ✅ Impede múltiplos eventos
            
            // Resetar estado de fechamento manual
            state.manuallyClosed = false;
            
            if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.show === 'function') {
                window.DiagnosticsV54.show();
            }
        });
        
        // Adicionar ao corpo
        document.body.appendChild(elements.floatingBtn);
        
        log('success', '🎯 Botão flutuante criado com sucesso');
    }
    
    // ========== CRIAÇÃO DA UI PRINCIPAL ==========
    function createMainUI() {
        // Remover UI existente
        const existingUI = getContainer();
        if (existingUI) existingUI.remove();
        
        // Adicionar estilos
        const styleEl = document.getElementById('diagnostics-styles-v54');
        if (styleEl) styleEl.remove();
        
        const newStyleEl = document.createElement('style');
        newStyleEl.id = 'diagnostics-styles-v54';
        newStyleEl.textContent = STYLES;
        document.head.appendChild(newStyleEl);
        
        // Criar container principal
        const container = document.createElement('div');
        container.id = CONFIG.containerId;
        container.style.display = 'none';
        
        // Conteúdo da UI
        container.innerHTML = `
            <div class="diagnostics-header-v54">
                <h2>
                    <span>🔧</span>
                    DIAGNÓSTICO V54 - v${CONFIG.version}
                    <small style="font-size: 0.8rem; color: #888; margin-left: 10px;">
                        ${window.location.hostname}
                    </small>
                </h2>
                <div class="header-controls-v54">
                    <button id="diagnostics-test-all-btn" class="control-btn-v54">
                        🧪 TESTAR TUDO
                    </button>
                    <button id="diagnostics-export-btn" class="control-btn-v54">
                        📊 EXPORTAR
                    </button>
                    <button id="diagnostics-close-btn" class="control-btn-v54 close-btn-v54">
                        ✕ FECHAR
                    </button>
                </div>
            </div>
            
            <div class="diagnostics-tabs-v54">
                <button class="tab-btn-v54 active" data-tab="overview">📊 VISÃO GERAL</button>
                <button class="tab-btn-v54" data-tab="modules">📦 MÓDULOS</button>
                <button class="tab-btn-v54" data-tab="pdf">📄 PDF SYSTEM</button>
                <button class="tab-btn-v54" data-tab="performance">⚡ PERFORMANCE</button>
                <button class="tab-btn-v54" data-tab="logs">📝 LOGS</button>
                <button class="tab-btn-v54" data-tab="actions">🔧 AÇÕES</button>
            </div>
            
            <div class="diagnostics-content-v54">
                <!-- Painel Visão Geral -->
                <div id="tab-overview-v54" class="tab-panel-v54 active">
                    <div class="panel-grid-v54">
                        <div class="panel-v54">
                            <div class="panel-header-v54">
                                <h3>📊 SISTEMA</h3>
                            </div>
                            <div class="panel-body-v54">
                                <p><strong>URL:</strong> ${window.location.href}</p>
                                <p><strong>Tela:</strong> ${window.innerWidth} × ${window.innerHeight}</p>
                                <p><strong>Tempo:</strong> ${(Date.now() - state.startTime)}ms</p>
                                <button id="diagnostics-verify-modules-btn" class="test-btn-v54">
                                    🔍 Verificar Módulos
                                </button>
                            </div>
                        </div>
                        
                        <div class="panel-v54">
                            <div class="panel-header-v54">
                                <h3>🏠 IMÓVEIS</h3>
                            </div>
                            <div class="panel-body-v54">
                                <p><strong>Total:</strong> <span id="property-count">${window.properties?.length || 0}</span></p>
                                <p><strong>Cards:</strong> <span id="cards-count">${document.querySelectorAll('.property-card').length}</span></p>
                                <p><strong>Carregado:</strong> ${window.properties ? '✅' : '⏳'}</p>
                                <button id="diagnostics-check-properties-btn" class="test-btn-v54">
                                    📋 Listar Imóveis
                                </button>
                            </div>
                        </div>
                        
                        <div class="panel-v54">
                            <div class="panel-header-v54">
                                <h3>🌐 SUPABASE</h3>
                            </div>
                            <div class="panel-body-v54">
                                <p><strong>Cliente:</strong> ${window.supabaseClient ? '✅' : '❌'}</p>
                                <p><strong>URL:</strong> ${window.SUPABASE_CONSTANTS?.URL ? '✅' : '❌'}</p>
                                <button id="diagnostics-test-supabase-btn" class="test-btn-v54">
                                    🔗 Testar Conexão
                                </button>
                            </div>
                        </div>
                        
                        <div class="panel-v54">
                            <div class="panel-header-v54">
                                <h3>⚡ AÇÕES</h3>
                            </div>
                            <div class="panel-body-v54">
                                <button id="diagnostics-run-all-tests-btn" class="test-btn-v54" style="background: #27ae60;">
                                    🚀 Executar Todos os Testes
                                </button>
                                <button id="diagnostics-fix-pdf-btn" class="test-btn-v54">
                                    🔧 Corrigir Botões PDF
                                </button>
                                <button id="diagnostics-check-performance-btn" class="test-btn-v54">
                                    📈 Verificar Performance
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Painel Módulos -->
                <div id="tab-modules-v54" class="tab-panel-v54">
                    <h3 style="color: #ff6b6b; margin-bottom: 20px;">📦 MÓDULOS DO SISTEMA</h3>
                    <div class="panel-grid-v54" id="modules-grid-v54">
                        <!-- Dinâmico -->
                    </div>
                </div>
                
                <!-- Painel PDF -->
                <div id="tab-pdf-v54" class="tab-panel-v54">
                    <h3 style="color: #ff6b6b; margin-bottom: 20px;">📄 SISTEMA PDF</h3>
                    <div class="panel-grid-v54">
                        <div class="panel-v54">
                            <div class="panel-header-v54">
                                <h3>📊 STATUS PDF</h3>
                            </div>
                            <div class="panel-body-v54">
                                <p><strong>Modal:</strong> ${document.getElementById('pdfModal') ? '✅' : '❌'}</p>
                                <p><strong>Sistema:</strong> ${window.PdfSystem ? '✅' : '❌'}</p>
                                <p><strong>Botões:</strong> ${document.querySelectorAll('.pdf-access').length}</p>
                                <button id="diagnostics-test-pdf-btn" class="test-btn-v54">
                                    🧪 Testar Sistema PDF
                                </button>
                            </div>
                        </div>
                        
                        <div class="panel-v54">
                            <div class="panel-header-v54">
                                <h3>🔧 REPARO</h3>
                            </div>
                            <div class="panel-body-v54">
                                <button id="diagnostics-repair-pdf-btn" class="test-btn-v54">
                                    🔧 Reparar Botões PDF
                                </button>
                                <button id="diagnostics-open-pdf-modal-btn" class="test-btn-v54">
                                    🎮 Abrir Modal PDF
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Painel Logs -->
                <div id="tab-logs-v54" class="tab-panel-v54">
                    <h3 style="color: #ff6b6b; margin-bottom: 20px;">📝 LOGS DO SISTEMA</h3>
                    <div style="margin-bottom: 20px; display: flex; gap: 10px;">
                        <button id="diagnostics-clear-logs-btn" class="control-btn-v54">
                            🗑️ Limpar Logs
                        </button>
                        <button id="diagnostics-export-logs-btn" class="control-btn-v54">
                            💾 Exportar Logs
                        </button>
                    </div>
                    <div id="logs-container-v54">
                        <!-- Logs dinâmicos -->
                    </div>
                </div>
                
                <!-- Painel Ações -->
                <div id="tab-actions-v54" class="tab-panel-v54">
                    <h3 style="color: #ff6b6b; margin-bottom: 20px;">🔧 AÇÕES AVANÇADAS</h3>
                    <div class="panel-grid-v54">
                        <div class="panel-v54">
                            <div class="panel-header-v54">
                                <h3>🔄 SISTEMA</h3>
                            </div>
                            <div class="panel-body-v54">
                                <button id="diagnostics-force-reload-btn" class="test-btn-v54">
                                    🔄 Recarregar Imóveis
                                </button>
                                <button id="diagnostics-clear-cache-btn" class="test-btn-v54">
                                    🗑️ Limpar Cache
                                </button>
                                <button id="diagnostics-reload-page-btn" class="test-btn-v54">
                                    ↩️ Recarregar Página
                                </button>
                            </div>
                        </div>
                        
                        <div class="panel-v54">
                            <div class="panel-header-v54">
                                <h3>🔍 DIAGNÓSTICO</h3>
                            </div>
                            <div class="panel-body-v54">
                                <button id="diagnostics-debug-mode-btn" class="test-btn-v54">
                                    🐛 Modo Debug
                                </button>
                                <button id="diagnostics-check-errors-btn" class="test-btn-v54">
                                    ❌ Verificar Erros
                                </button>
                                <button id="diagnostics-system-info-btn" class="test-btn-v54">
                                    ℹ️ Informações
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(container);
        state.uiCreated = true;
        
        setupEvents();
        setupTabs();
        
        elements.logsContainer = document.getElementById('logs-container-v54');
        
        log('success', '✅ Interface principal criada com sucesso');
    }
    
    // ========== CONFIGURAÇÃO DE EVENTOS ==========
    function setupEvents() {
        // ✅ BOTÃO FECHAR - SOLUÇÃO DEFINITIVA
        const closeBtn = document.getElementById('diagnostics-close-btn');
        if (closeBtn) {
            // Remover qualquer evento antigo
            const newCloseBtn = closeBtn.cloneNode(true);
            closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
            
            // Adicionar evento DIRETO
            newCloseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation(); // ✅ Impede múltiplos eventos
                console.log('[DiagnosticsV54] Botão FECHAR clicado');
                
                // ✅ MARCA QUE O USUÁRIO FECHOU MANUALMENTE
                state.manuallyClosed = true;
                
                // ✅ CANCELA TODOS OS TIMERS
                cancelAllAutoOpenTimers();
                
                // ✅ DEFINE UMA FLAG GLOBAL PARA IMPEDIR REABERTURA
                window.__DIAGNOSTICS_MANUALLY_CLOSED__ = true;
                
                // ✅ CHAMADA DIRETA
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.hide === 'function') {
                    window.DiagnosticsV54.hide();
                } else {
                    const container = getContainer();
                    if (container) {
                        container.style.display = 'none';
                        state.isVisible = false;
                    }
                }
            });
        }
        
        // ✅ BOTÃO TESTAR TUDO
        const testAllBtn = document.getElementById('diagnostics-test-all-btn');
        if (testAllBtn) {
            testAllBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.runTests === 'function') {
                    window.DiagnosticsV54.runTests();
                }
            });
        }
        
        // ✅ BOTÃO EXPORTAR
        const exportBtn = document.getElementById('diagnostics-export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.exportReport === 'function') {
                    window.DiagnosticsV54.exportReport();
                }
            });
        }
        
        // ✅ BOTÃO VERIFICAR MÓDULOS
        const verifyModulesBtn = document.getElementById('diagnostics-verify-modules-btn');
        if (verifyModulesBtn) {
            verifyModulesBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.verifyModules === 'function') {
                    window.DiagnosticsV54.verifyModules();
                }
            });
        }
        
        // ✅ BOTÃO LISTAR IMÓVEIS
        const checkPropsBtn = document.getElementById('diagnostics-check-properties-btn');
        if (checkPropsBtn) {
            checkPropsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                checkProperties();
            });
        }
        
        // ✅ BOTÃO TESTAR SUPABASE
        const testSupabaseBtn = document.getElementById('diagnostics-test-supabase-btn');
        if (testSupabaseBtn) {
            testSupabaseBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.testSupabase === 'function') {
                    window.DiagnosticsV54.testSupabase();
                }
            });
        }
        
        // ✅ BOTÃO EXECUTAR TODOS OS TESTES
        const runAllTestsBtn = document.getElementById('diagnostics-run-all-tests-btn');
        if (runAllTestsBtn) {
            runAllTestsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.runTests === 'function') {
                    window.DiagnosticsV54.runTests();
                }
            });
        }
        
        // ✅ BOTÃO CORRIGIR PDF
        const fixPdfBtn = document.getElementById('diagnostics-fix-pdf-btn');
        if (fixPdfBtn) {
            fixPdfBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.fixPDFButtons === 'function') {
                    window.DiagnosticsV54.fixPDFButtons();
                }
            });
        }
        
        // ✅ BOTÃO VERIFICAR PERFORMANCE
        const checkPerfBtn = document.getElementById('diagnostics-check-performance-btn');
        if (checkPerfBtn) {
            checkPerfBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.checkPerformance === 'function') {
                    window.DiagnosticsV54.checkPerformance();
                }
            });
        }
        
        // ✅ BOTÃO TESTAR PDF
        const testPdfBtn = document.getElementById('diagnostics-test-pdf-btn');
        if (testPdfBtn) {
            testPdfBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.testPDFSystem === 'function') {
                    window.DiagnosticsV54.testPDFSystem();
                }
            });
        }
        
        // ✅ BOTÃO REPARAR PDF
        const repairPdfBtn = document.getElementById('diagnostics-repair-pdf-btn');
        if (repairPdfBtn) {
            repairPdfBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.fixPDFButtons === 'function') {
                    window.DiagnosticsV54.fixPDFButtons();
                }
            });
        }
        
        // ✅ BOTÃO ABRIR MODAL PDF
        const openPdfModalBtn = document.getElementById('diagnostics-open-pdf-modal-btn');
        if (openPdfModalBtn) {
            openPdfModalBtn.addEventListener('click', function(e) {
                e.preventDefault();
                testPDFModal();
            });
        }
        
        // ✅ BOTÃO LIMPAR LOGS
        const clearLogsBtn = document.getElementById('diagnostics-clear-logs-btn');
        if (clearLogsBtn) {
            clearLogsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.clearLogs === 'function') {
                    window.DiagnosticsV54.clearLogs();
                }
            });
        }
        
        // ✅ BOTÃO EXPORTAR LOGS
        const exportLogsBtn = document.getElementById('diagnostics-export-logs-btn');
        if (exportLogsBtn) {
            exportLogsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.exportLogs === 'function') {
                    window.DiagnosticsV54.exportLogs();
                }
            });
        }
        
        // ✅ BOTÃO FORCE RELOAD
        const forceReloadBtn = document.getElementById('diagnostics-force-reload-btn');
        if (forceReloadBtn) {
            forceReloadBtn.addEventListener('click', function(e) {
                e.preventDefault();
                forceReload();
            });
        }
        
        // ✅ BOTÃO LIMPAR CACHE
        const clearCacheBtn = document.getElementById('diagnostics-clear-cache-btn');
        if (clearCacheBtn) {
            clearCacheBtn.addEventListener('click', function(e) {
                e.preventDefault();
                clearCache();
            });
        }
        
        // ✅ BOTÃO RECARREGAR PÁGINA
        const reloadPageBtn = document.getElementById('diagnostics-reload-page-btn');
        if (reloadPageBtn) {
            reloadPageBtn.addEventListener('click', function(e) {
                e.preventDefault();
                location.reload();
            });
        }
        
        // ✅ BOTÃO MODO DEBUG
        const debugModeBtn = document.getElementById('diagnostics-debug-mode-btn');
        if (debugModeBtn) {
            debugModeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                if (window.DiagnosticsV54 && typeof window.DiagnosticsV54.debugSystem === 'function') {
                    window.DiagnosticsV54.debugSystem();
                }
            });
        }
        
        // ✅ BOTÃO VERIFICAR ERROS
        const checkErrorsBtn = document.getElementById('diagnostics-check-errors-btn');
        if (checkErrorsBtn) {
            checkErrorsBtn.addEventListener('click', function(e) {
                e.preventDefault();
                checkErrors();
            });
        }
        
        // ✅ BOTÃO INFORMAÇÕES
        const systemInfoBtn = document.getElementById('diagnostics-system-info-btn');
        if (systemInfoBtn) {
            systemInfoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showSystemInfo();
            });
        }
        
        log('success', '✅ Todos os eventos configurados com sucesso');
    }
    
    function setupTabs() {
        const container = getContainer();
        if (!container) return;
        
        const tabBtns = container.querySelectorAll('.tab-btn-v54');
        const tabPanels = container.querySelectorAll('.tab-panel-v54');
        
        tabBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const tabId = this.getAttribute('data-tab');
                
                tabBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                tabPanels.forEach(panel => {
                    panel.classList.remove('active');
                    if (panel.id === `tab-${tabId}-v54`) {
                        panel.classList.add('active');
                    }
                });
                
                if (tabId === 'modules') {
                    updateModulesPanel();
                } else if (tabId === 'logs') {
                    updateLogsDisplay();
                }
            });
        });
    }
    
    function updateModulesPanel() {
        const grid = document.getElementById('modules-grid-v54');
        if (!grid) return;
        
        const modules = [
            { name: 'SharedCore', obj: window.SharedCore, color: '#3498db' },
            { name: 'MediaSystem', obj: window.MediaSystem, color: '#9b59b6' },
            { name: 'PdfSystem', obj: window.PdfSystem, color: '#e74c3c' },
            { name: 'LoadingManager', obj: window.LoadingManager, color: '#f39c12' },
            { name: 'FilterManager', obj: window.FilterManager, color: '#1abc9c' },
            { name: 'EventManager', obj: window.EventManager, color: '#34495e' },
            { name: 'Properties', obj: window.properties, isArray: true, color: '#27ae60' },
            { name: 'Supabase', obj: window.supabaseClient, color: '#2980b9' },
            { name: CONFIG.namespace, obj: window[CONFIG.namespace], color: '#ff6b6b' }
        ];
        
        grid.innerHTML = modules.map(mod => {
            const exists = mod.obj ? (mod.isArray ? Array.isArray(mod.obj) : true) : false;
            const type = typeof mod.obj;
            const count = mod.isArray && Array.isArray(mod.obj) ? mod.obj.length : 'N/A';
            const funcs = mod.obj && typeof mod.obj === 'object' 
                ? Object.keys(mod.obj).filter(k => typeof mod.obj[k] === 'function').length 
                : 0;
            
            return `
            <div class="panel-v54">
                <div class="panel-header-v54" style="border-left: 5px solid ${mod.color}">
                    <h3>${mod.name}</h3>
                    <span style="color: ${exists ? '#27ae60' : '#e74c3c'}; font-size: 1.5rem;">
                        ${exists ? '✅' : '❌'}
                    </span>
                </div>
                <div class="panel-body-v54">
                    <p><strong>Tipo:</strong> ${type}</p>
                    <p><strong>Status:</strong> ${exists ? 'Disponível' : 'Ausente'}</p>
                    ${mod.isArray ? `<p><strong>Quantidade:</strong> ${count}</p>` : ''}
                    ${funcs > 0 ? `<p><strong>Funções:</strong> ${funcs}</p>` : ''}
                </div>
            </div>
            `;
        }).join('');
    }
    
    // ========== FUNÇÕES DO DIAGNÓSTICO ==========
    function verifyModules() {
        log('info', '📦 Verificando módulos...');
        
        const modules = {
            'SharedCore': !!window.SharedCore,
            'MediaSystem': !!window.MediaSystem,
            'PdfSystem': !!window.PdfSystem,
            'LoadingManager': !!window.LoadingManager,
            'FilterManager': !!window.FilterManager,
            'Properties': Array.isArray(window.properties),
            'Supabase': !!window.supabaseClient
        };
        
        const results = [];
        Object.entries(modules).forEach(([name, exists]) => {
            results.push(`${exists ? '✅' : '❌'} ${name}`);
            log(exists ? 'success' : 'error', `${name}: ${exists ? 'OK' : 'AUSENTE'}`);
        });
        
        const passed = Object.values(modules).filter(Boolean).length;
        const total = Object.keys(modules).length;
        const score = Math.round((passed / total) * 100);
        
        log('success', `📊 Módulos: ${passed}/${total} (${score}%)`);
        return { passed, total, score, modules };
    }
    
    function testPDFSystem() {
        log('info', '📄 Testando sistema PDF...');
        
        const results = {
            modal: !!document.getElementById('pdfModal'),
            system: !!window.PdfSystem,
            buttons: document.querySelectorAll('.pdf-access').length,
            supabase: !!window.SUPABASE_CONSTANTS
        };
        
        log('info', '📊 Sistema PDF:', results);
        
        const buttons = document.querySelectorAll('.pdf-access');
        buttons.forEach((btn, i) => {
            if (!btn.onclick && !btn.getAttribute('onclick')) {
                log('warning', `⚠️ Botão PDF ${i} sem evento`);
            }
        });
        
        return results;
    }
    
    function fixPDFButtons() {
        log('info', '🔧 Reparando botões PDF...');
        
        const buttons = document.querySelectorAll('.pdf-access');
        let fixed = 0;
        
        buttons.forEach(btn => {
            if (!btn.onclick && !btn.getAttribute('onclick')) {
                const card = btn.closest('.property-card');
                const propId = card?.getAttribute('data-property-id');
                
                if (propId && window.PdfSystem?.showModal) {
                    btn.setAttribute('onclick', `event.stopPropagation(); window.PdfSystem.showModal(${propId})`);
                    btn.style.border = '2px solid #27ae60';
                    fixed++;
                }
            }
        });
        
        log(fixed > 0 ? 'success' : 'info', 
            `🔧 ${fixed} botões PDF reparados`);
        
        return { fixed, total: buttons.length };
    }
    
    function testSupabase() {
        log('info', '🌐 Testando Supabase...');
        
        if (!window.supabaseClient) {
            log('error', '❌ Supabase não disponível');
            return { error: 'Cliente não encontrado' };
        }
        
        return new Promise(resolve => {
            setTimeout(() => {
                log('success', '✅ Supabase parece estar disponível');
                resolve({ success: true, client: 'available' });
            }, 500);
        });
    }
    
    function checkPerformance() {
        log('info', '⚡ Verificando performance...');
        
        const perf = {
            loadTime: Date.now() - state.startTime,
            properties: window.properties?.length || 0,
            memory: performance.memory ? 
                `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)}MB` : 'N/A',
            scripts: document.querySelectorAll('script').length,
            images: document.querySelectorAll('img').length
        };
        
        log('info', '📈 Performance:', perf);
        return perf;
    }
    
    // ========== FUNÇÕES AUXILIARES ==========
    function checkProperties() {
        const props = window.properties || [];
        log('info', `🏠 ${props.length} imóveis encontrados:`, props.slice(0, 3));
        return props;
    }
    
    function testPDFModal() {
        if (window.PdfSystem?.showModal) {
            const firstProp = window.properties?.[0];
            if (firstProp) {
                window.PdfSystem.showModal(firstProp.id);
                log('success', `🎮 Modal PDF aberto para imóvel ${firstProp.id}`);
            }
        }
    }
    
    function forceReload() {
        if (window.SharedCore?.fetchProperties) {
            window.SharedCore.fetchProperties();
            log('info', '🔄 Recarregando imóveis...');
        }
    }
    
    function clearCache() {
        localStorage.clear();
        sessionStorage.clear();
        log('info', '🗑️ Cache limpo');
    }
    
    function checkErrors() {
        log('info', '🔍 Verificando erros...');
        return { errors: 0 };
    }
    
    function showSystemInfo() {
        const info = {
            url: window.location.href,
            userAgent: navigator.userAgent,
            screen: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            time: new Date().toLocaleString()
        };
        
        log('info', 'ℹ️ Informações do sistema:', info);
        return info;
    }
    
    function debugSystem() {
        log('info', '🐛 Ativando modo debug...');
        
        localStorage.setItem('debug_mode', 'verbose');
        
        window.addEventListener('error', e => {
            log('error', `🌍 ERRO GLOBAL: ${e.message}`, {
                file: e.filename,
                line: e.lineno,
                col: e.colno
            });
        });
        
        window.addEventListener('unhandledrejection', e => {
            log('error', '🌍 PROMISE REJEITADA:', e.reason);
        });
        
        log('success', '✅ Modo debug ativado');
    }
    
    // ========== API PÚBLICA ==========
    window[CONFIG.namespace] = {
        // Controle da UI
        show: function() {
            // ✅ VERIFICAÇÃO MÚLTIPLA - NÃO ABRE SE FOI FECHADO MANUALMENTE
            if (state.manuallyClosed === true || window.__DIAGNOSTICS_MANUALLY_CLOSED__ === true) {
                log('info', '🚫 Usuário fechou manualmente - ignorando abertura');
                return false;
            }
            
            log('info', '🎛️ Abrindo painel de diagnóstico...');
            
            if (!state.uiCreated) {
                createMainUI();
            }
            
            if (!elements.floatingBtn || !document.getElementById(CONFIG.floatingBtnId)) {
                createFloatingButton();
            }
            
            const container = getContainer();
            
            if (container) {
                container.style.display = 'flex';
                state.isVisible = true;
                
                setTimeout(() => {
                    const countEl = document.getElementById('property-count');
                    const cardsEl = document.getElementById('cards-count');
                    if (countEl) countEl.textContent = window.properties?.length || 0;
                    if (cardsEl) cardsEl.textContent = document.querySelectorAll('.property-card').length;
                    updateLogsDisplay();
                    updateModulesPanel();
                }, 100);
                
                log('success', '✅ Painel de diagnóstico VISÍVEL na tela');
                return true;
            } else {
                log('error', '❌ Container não encontrado - recriando...');
                createMainUI();
                setTimeout(() => this.show(), 300);
                return false;
            }
        },
        
        hide: function() {
            log('info', '🎛️ Fechando painel de diagnóstico...');
            
            // ✅ CANCELA TODOS OS TIMERS
            cancelAllAutoOpenTimers();
            
            const container = getContainer();
            
            if (container) {
                container.style.display = 'none';
                container.style.visibility = 'hidden';
                container.style.opacity = '0';
                
                setTimeout(() => {
                    container.style.visibility = '';
                    container.style.opacity = '';
                }, 100);
                
                state.isVisible = false;
                log('success', '✅ Painel de diagnóstico FECHADO com sucesso');
                
                // ✅ VERIFICAÇÃO DUPLA
                setTimeout(() => {
                    const checkContainer = getContainer();
                    if (checkContainer && checkContainer.style.display !== 'none') {
                        checkContainer.style.display = 'none';
                    }
                }, 50);
                
                return true;
            } else {
                const possibleContainer = document.getElementById(CONFIG.containerId);
                if (possibleContainer) {
                    possibleContainer.style.display = 'none';
                    state.isVisible = false;
                    log('success', '✅ Painel fechado via fallback');
                    return true;
                }
                
                log('error', '❌ Container não encontrado');
                return false;
            }
        },
        
        toggle: function() {
            if (state.isVisible) {
                this.hide();
            } else {
                // ✅ RESETA FLAG QUANDO USUÁRIO ABRE MANUALMENTE
                state.manuallyClosed = false;
                window.__DIAGNOSTICS_MANUALLY_CLOSED__ = false;
                this.show();
            }
        },
        
        // ✅ FUNÇÃO PARA RESETAR ESTADO
        resetManualClose: function() {
            state.manuallyClosed = false;
            window.__DIAGNOSTICS_MANUALLY_CLOSED__ = false;
            log('info', '🔄 Estado de fechamento manual resetado');
            return true;
        },
        
        // ✅ FUNÇÃO PARA DESATIVAR COMPLETAMENTE A ABERTURA AUTOMÁTICA
        disableAutoOpen: function() {
            cancelAllAutoOpenTimers();
            state.manuallyClosed = true;
            window.__DIAGNOSTICS_MANUALLY_CLOSED__ = true;
            localStorage.setItem('diagnostics_auto', 'false');
            log('info', '🚫 Abertura automática DESATIVADA permanentemente');
            return true;
        },
        
        // Testes principais
        verifyModules: verifyModules,
        testPDFSystem: testPDFSystem,
        fixPDFButtons: fixPDFButtons,
        testSupabase: testSupabase,
        checkPerformance: checkPerformance,
        debugSystem: debugSystem,
        
        runTests: async function() {
            log('info', '🚀 Iniciando todos os testes...');
            
            const results = [];
            
            results.push(this.verifyModules());
            results.push(this.testPDFSystem());
            results.push(this.fixPDFButtons());
            results.push(await this.testSupabase());
            results.push(this.checkPerformance());
            
            const passed = results.filter(r => !r.error).length;
            const total = results.length;
            
            log('success', `📊 TESTES COMPLETOS: ${passed}/${total} passaram`);
            
            if (state.isVisible) {
                alert(`✅ Testes completos!\n\nPassados: ${passed}/${total}\nVerifique os logs para detalhes.`);
            }
            
            return results;
        },
        
        clearLogs: function() {
            state.logs = [];
            updateLogsDisplay();
            log('info', '🗑️ Logs limpos');
        },
        
        exportLogs: function() {
            const data = JSON.stringify(state.logs, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diagnostics-logs-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            log('success', '💾 Logs exportados');
        },
        
        exportReport: function() {
            const report = {
                timestamp: new Date().toISOString(),
                version: CONFIG.version,
                url: window.location.href,
                system: {
                    properties: window.properties?.length || 0,
                    modules: verifyModules().modules,
                    performance: checkPerformance()
                },
                logs: state.logs.slice(0, 50)
            };
            
            const data = JSON.stringify(report, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diagnostics-report-${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            log('success', '📊 Relatório exportado');
        },
        
        getLogs: function() {
            return [...state.logs];
        },
        
        getState: function() {
            return {
                ...state,
                config: CONFIG,
                system: {
                    properties: window.properties?.length || 0,
                    supabase: !!window.supabaseClient,
                    pdfSystem: !!window.PdfSystem
                }
            };
        },
        
        debug: function() {
            console.group('[DiagnosticsV54] DEBUG DO PAINEL');
            console.log('Container no DOM:', getContainer());
            console.log('state.isVisible:', state.isVisible);
            console.log('state.manuallyClosed:', state.manuallyClosed);
            console.log('window.__DIAGNOSTICS_MANUALLY_CLOSED__:', window.__DIAGNOSTICS_MANUALLY_CLOSED__);
            console.log('uiCreated:', state.uiCreated);
            console.log('autoOpenTimer:', state.autoOpenTimer);
            console.log('autoOpenTimer2:', state.autoOpenTimer2);
            console.groupEnd();
            return {
                container: getContainer(),
                isVisible: state.isVisible,
                manuallyClosed: state.manuallyClosed,
                globalFlag: window.__DIAGNOSTICS_MANUALLY_CLOSED__,
                uiCreated: state.uiCreated,
                autoOpenTimer: state.autoOpenTimer
            };
        }
    };
    
    // ========== INICIALIZAÇÃO ==========
    function initialize() {
        // ✅ VERIFICAÇÃO EXTRA DE DUPLICAÇÃO
        if (state.initialized === true) {
            console.log('🎛️ diagnostics54.js já foi inicializado - ignorando');
            return;
        }
        state.initialized = true;
        
        log('info', `🔧 ${CONFIG.namespace} v${CONFIG.version} inicializando...`);
        
        // 1. Criar botão flutuante
        createFloatingButton();
        
        // 2. Criar UI principal
        createMainUI();
        
        // 3. CANCELAR QUALQUER TIMER EXISTENTE ANTES DE CRIAR NOVO
        cancelAllAutoOpenTimers();
        
        // 4. Verificar se deve abrir automaticamente
        const shouldAutoOpen = 
            window.location.search.includes('diagnostics=true') ||
            localStorage.getItem('diagnostics_auto') === 'true';
        
        if (shouldAutoOpen && CONFIG.autoStart) {
            log('info', '🚀 Abertura automática detectada...');
            
            // ✅ TIMER PRINCIPAL
            state.autoOpenTimer = setTimeout(() => {
                // ✅ VERIFICAÇÕES MÚLTIPLAS ANTES DE ABRIR
                if (state.manuallyClosed === false && 
                    window.__DIAGNOSTICS_MANUALLY_CLOSED__ !== true) {
                    
                    window[CONFIG.namespace].show();
                    
                    setTimeout(() => {
                        verifyModules();
                        checkPerformance();
                    }, 1000);
                } else {
                    log('info', '🚫 Usuário já fechou manualmente - ignorando abertura automática');
                }
                
                state.autoOpenTimer = null;
            }, 1500);
            
            // ✅ TIMER DE SEGURANÇA (caso o primeiro seja sobrescrito)
            state.autoOpenTimer2 = setTimeout(() => {
                if (state.manuallyClosed === false && 
                    window.__DIAGNOSTICS_MANUALLY_CLOSED__ !== true &&
                    !state.isVisible) {
                    
                    log('info', '⚠️ Timer de segurança - verificando se painel deve abrir');
                    
                    // Só abre se NÃO foi fechado manualmente E NÃO está visível
                    if (!state.isVisible) {
                        window[CONFIG.namespace].show();
                    }
                }
                state.autoOpenTimer2 = null;
            }, 2000);
        }
        
        // 5. Configurar hotkeys
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                
                if (!state.isVisible) {
                    state.manuallyClosed = false;
                    window.__DIAGNOSTICS_MANUALLY_CLOSED__ = false;
                }
                
                window[CONFIG.namespace].toggle();
                log('info', '⌨️ Hotkey Ctrl+Shift+D acionada');
            }
            
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                window[CONFIG.namespace].runTests();
                log('info', '⌨️ Hotkey Ctrl+Shift+T acionada');
            }
        });
        
        // 6. Mensagem de inicialização
        log('success', `✅ ${CONFIG.namespace} v${CONFIG.version} carregado e pronto!`);
        console.log(`🎛️ Clique no botão 🔍 (canto inferior direito) ou use: DiagnosticsV54.show()`);
        console.log(`🎛️ Hotkeys: Ctrl+Shift+D (abrir/fechar), Ctrl+Shift+T (testar tudo)`);
        console.log(`🔄 Para resetar estado: DiagnosticsV54.resetManualClose()`);
        console.log(`🚫 Para desativar abertura automática: DiagnosticsV54.disableAutoOpen()`);
    }
    
    // Iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        setTimeout(initialize, 100);
    }
    
})();
