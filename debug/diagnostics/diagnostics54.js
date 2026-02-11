// debug/diagnostics/diagnostics54.js - SISTEMA DE DIAGNÓSTICO DEFINITIVO
console.log('🎛️ diagnostics54.js - SISTEMA DEFINITIVO CARREGADO (VERSÃO ISOLADA)');

(function() {
    'use strict';
    
    // ========== CONFIGURAÇÕES PRIVADAS ==========
    const CONFIG = {
        version: '5.4.2',
        namespace: 'DiagnosticsV54',
        autoStart: true,
        maxLogs: 100,
        containerId: 'diagnostics-container-v54',
        // Novas configurações para debugging
        debugMode: true,
        forceShow: true, // Forçar mostrar sempre que possível
        checkInterval: 1000 // Verificar a cada 1s se pode mostrar
    };
    
    // ========== ESTADO PRIVADO ==========
    const state = {
        logs: [],
        tests: {},
        panels: {},
        isVisible: false,
        startTime: Date.now(),
        hasInitialized: false,
        domReady: false,
        systemReady: false,
        attempts: 0
    };
    
    // ========== ELEMENTOS DO DOM ==========
    let elements = {
        container: null,
        header: null,
        content: null,
        tabs: null,
        panels: {},
        logsContainer: null
    };
    
    // ========== ESTILOS CSS ÚNICOS ==========
    const STYLES = `
        /* CONTAINER PRINCIPAL ÚNICO - ESTILOS FORTES */
        #${CONFIG.containerId} {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 90% !important;
            max-width: 1200px !important;
            height: 80vh !important;
            background: #0a0a0a !important;
            border: 3px solid #ff6b6b !important;
            border-radius: 12px !important;
            z-index: 999999 !important;
            box-shadow: 0 0 40px rgba(255, 107, 107, 0.4) !important;
            display: none !important;
            overflow: hidden !important;
            font-family: 'Segoe UI', 'Courier New', monospace !important;
        }
        
        /* HEADER DISTINTIVO */
        .diagnostics-header-v54 {
            background: linear-gradient(90deg, #111, #222) !important;
            padding: 15px 20px !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            border-bottom: 2px solid #ff6b6b !important;
        }
        
        .diagnostics-header-v54 h2 {
            margin: 0 !important;
            color: #ff6b6b !important;
            font-size: 1.4rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 10px !important;
        }
        
        .header-controls-v54 {
            display: flex !important;
            gap: 10px !important;
        }
        
        .control-btn-v54 {
            background: #333 !important;
            color: #ff6b6b !important;
            border: 1px solid #ff6b6b !important;
            padding: 8px 15px !important;
            border-radius: 6px !important;
            cursor: pointer !important;
            font-weight: bold !important;
            transition: all 0.3s !important;
        }
        
        .control-btn-v54:hover {
            background: #ff6b6b !important;
            color: #000 !important;
        }
        
        .close-btn-v54 {
            background: #ff3333 !important;
            color: white !important;
            border: 1px solid #ff6666 !important;
        }
        
        .close-btn-v54:hover {
            background: #ff6666 !important;
        }
        
        /* TABS ÚNICOS */
        .diagnostics-tabs-v54 {
            display: flex !important;
            background: #222 !important;
            border-bottom: 1px solid #444 !important;
            overflow-x: auto !important;
        }
        
        .tab-btn-v54 {
            padding: 12px 20px !important;
            background: transparent !important;
            color: #888 !important;
            border: none !important;
            border-right: 1px solid #333 !important;
            cursor: pointer !important;
            font-weight: 600 !important;
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
        }
        
        /* CONTEÚDO */
        .diagnostics-content-v54 {
            height: calc(100% - 120px) !important;
            overflow-y: auto !important;
            padding: 20px !important;
        }
        
        .tab-panel-v54 {
            display: none !important;
        }
        
        .tab-panel-v54.active {
            display: block !important;
        }
        
        /* PAINÉIS ÚNICOS */
        .panel-grid-v54 {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)) !important;
            gap: 20px !important;
            margin-bottom: 30px !important;
        }
        
        .panel-v54 {
            background: #111 !important;
            border: 1px solid #333 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
        }
        
        .panel-header-v54 {
            background: #222 !important;
            padding: 12px 15px !important;
            border-bottom: 1px solid #333 !important;
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
        }
        
        .panel-header-v54 h3 {
            margin: 0 !important;
            color: #ff6b6b !important;
            font-size: 1.1rem !important;
            display: flex !important;
            align-items: center !important;
            gap: 8px !important;
        }
        
        .panel-body-v54 {
            padding: 15px !important;
        }
        
        .status-indicator-v54 {
            width: 10px !important;
            height: 10px !important;
            border-radius: 50% !important;
            display: inline-block !important;
            margin-right: 8px !important;
        }
        
        .status-success-v54 { background: #27ae60 !important; }
        .status-warning-v54 { background: #f39c12 !important; }
        .status-error-v54 { background: #e74c3c !important; }
        .status-info-v54 { background: #3498db !important; }
        
        /* BOTÕES ÚNICOS */
        .test-btn-v54 {
            display: block !important;
            width: 100% !important;
            background: #222 !important;
            color: #ff6b6b !important;
            border: 1px solid #333 !important;
            padding: 10px !important;
            margin: 5px 0 !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            text-align: left !important;
            transition: all 0.3s !important;
        }
        
        .test-btn-v54:hover {
            background: #ff6b6b !important;
            color: #000 !important;
            transform: translateX(5px) !important;
        }
        
        .run-all-btn-v54 {
            background: #2980b9 !important;
            color: white !important;
            border: none !important;
            padding: 12px !important;
            margin: 10px 0 !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-weight: bold !important;
            width: 100% !important;
        }
        
        /* LOGS ÚNICOS */
        #logs-container-v54 {
            background: #000 !important;
            border: 1px solid #333 !important;
            border-radius: 5px !important;
            padding: 15px !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            font-family: 'Courier New', monospace !important;
            font-size: 0.9rem !important;
        }
        
        .log-entry-v54 {
            padding: 5px !important;
            border-bottom: 1px solid #222 !important;
            display: flex !important;
            align-items: flex-start !important;
            gap: 10px !important;
        }
        
        .log-time-v54 {
            color: #888 !important;
            min-width: 80px !important;
        }
        
        .log-type-v54 {
            font-weight: bold !important;
            min-width: 60px !important;
        }
        
        .log-type-v54.info { color: #3498db !important; }
        .log-type-v54.success { color: #27ae60 !important; }
        .log-type-v54.warning { color: #f39c12 !important; }
        .log-type-v54.error { color: #e74c3c !important; }
        
        /* BOTÃO FLUTUANTE DE ACESSO RÁPIDO */
        .diagnostics-floating-btn {
            position: fixed !important;
            bottom: 20px !important;
            right: 20px !important;
            background: #ff6b6b !important;
            color: white !important;
            border: none !important;
            border-radius: 50% !important;
            width: 60px !important;
            height: 60px !important;
            font-size: 24px !important;
            cursor: pointer !important;
            z-index: 999998 !important;
            box-shadow: 0 4px 20px rgba(255, 107, 107, 0.5) !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            transition: all 0.3s !important;
        }
        
        .diagnostics-floating-btn:hover {
            transform: scale(1.1) !important;
            box-shadow: 0 6px 30px rgba(255, 107, 107, 0.7) !important;
        }
        
        /* RESPONSIVO */
        @media (max-width: 768px) {
            #${CONFIG.containerId} {
                width: 95% !important;
                height: 90vh !important;
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
                padding: 10px !important;
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
        
        // Limitar logs
        if (state.logs.length > CONFIG.maxLogs) {
            state.logs.pop();
        }
        
        // Atualizar UI se visível
        if (state.isVisible && elements.logsContainer) {
            updateLogsDisplay();
        }
        
        // Console colorido
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
        
        const logsToShow = state.logs.slice(0, 20);
        elements.logsContainer.innerHTML = logsToShow.map(log => `
            <div class="log-entry-v54">
                <span class="log-time-v54">${log.timestamp}</span>
                <span class="log-type-v54 ${log.type}">${log.type.toUpperCase()}</span>
                <span style="color: #ccc; flex: 1;">${log.message}</span>
            </div>
        `).join('');
    }
    
    // ========== VERIFICAÇÃO DE SISTEMA ==========
    function isSystemReady() {
        // Verificar se elementos essenciais estão carregados
        const essentialElements = [
            document.body,
            document.querySelector('.properties-grid') || document.body
        ];
        
        const essentialsReady = essentialElements.every(el => el);
        
        // Verificar se módulos principais estão carregados
        const coreModules = [
            window.SharedCore,
            window.properties,
            window.supabaseClient
        ];
        
        const modulesReady = coreModules.some(module => module);
        
        log('info', `🔍 Verificação sistema: DOM=${essentialsReady}, Módulos=${modulesReady}, Tentativas=${state.attempts}`);
        
        return essentialsReady || state.attempts > 5;
    }
    
    // ========== FUNÇÕES DO SISTEMA ==========
    
    // 1. TESTE DO SISTEMA PDF
    function testPdfSystem() {
        log('info', '🧪 Iniciando teste do sistema PDF...');
        
        const results = {
            pdfModalExists: !!document.getElementById('pdfModal'),
            pdfSystemExists: typeof window.PdfSystem === 'object',
            pdfButtonsExist: document.querySelectorAll('.pdf-access').length > 0,
            supabaseConstants: !!window.SUPABASE_CONSTANTS,
            passwordField: document.getElementById('pdfPassword')
        };
        
        log('info', '📊 Resultados do teste PDF:', results);
        
        const passed = Object.values(results).filter(Boolean).length;
        const total = Object.keys(results).length;
        const score = Math.round((passed / total) * 100);
        
        log(score >= 80 ? 'success' : 'warning', 
            `📄 Sistema PDF: ${passed}/${total} testes passados (${score}%)`);
        
        return { passed, total, score, results };
    }
    
    // 2. DIAGNÓSTICO DO ÍCONE PDF
    function diagnosePdfIconProblem() {
        log('info', '🔍 Diagnosticando problema do ícone PDF...');
        
        const cards = document.querySelectorAll('.property-card');
        let issues = [];
        
        cards.forEach((card, index) => {
            const pdfButton = card.querySelector('.pdf-access');
            const propertyId = card.getAttribute('data-property-id');
            const propertyTitle = card.getAttribute('data-property-title');
            
            if (pdfButton) {
                const hasOnclick = pdfButton.getAttribute('onclick');
                const hasEventListener = pdfButton.onclick;
                
                if (!hasOnclick && !hasEventListener) {
                    issues.push({
                        cardIndex: index,
                        propertyId,
                        propertyTitle,
                        issue: 'Botão PDF sem evento onclick'
                    });
                }
            }
        });
        
        if (issues.length > 0) {
            log('error', `⚠️ Encontrados ${issues.length} botões PDF com problemas:`, issues);
            
            issues.forEach(issue => {
                const card = document.querySelectorAll('.property-card')[issue.cardIndex];
                const button = card?.querySelector('.pdf-access');
                const propertyId = issue.propertyId;
                
                if (button && propertyId) {
                    button.setAttribute('onclick', `event.stopPropagation(); window.PdfSystem.showModal(${propertyId})`);
                    log('success', `✅ Corrigido botão PDF do imóvel ${propertyId}`);
                }
            });
        } else {
            log('success', '✅ Todos os botões PDF estão funcionais!');
        }
        
        return { issuesFound: issues.length, issues };
    }
    
    // 3. VERIFICAÇÃO DE MÓDULOS
    function verifyModules() {
        log('info', '📦 Verificando módulos do sistema...');
        
        const modules = {
            'SharedCore': typeof window.SharedCore,
            'MediaSystem': typeof window.MediaSystem,
            'PdfSystem': typeof window.PdfSystem,
            'LoadingManager': typeof window.LoadingManager,
            'FilterManager': typeof window.FilterManager,
            'properties (array)': Array.isArray(window.properties),
            'supabaseClient': typeof window.supabaseClient
        };
        
        const results = {};
        Object.entries(modules).forEach(([name, type]) => {
            const exists = type !== 'undefined';
            results[name] = exists ? '✅' : '❌';
            
            log(exists ? 'success' : 'error', 
                `${exists ? '✅' : '❌'} ${name}: ${exists ? 'Disponível' : 'Ausente'}`);
        });
        
        const total = Object.keys(results).length;
        const passed = Object.values(results).filter(r => r === '✅').length;
        const score = Math.round((passed / total) * 100);
        
        log(score >= 80 ? 'success' : 'warning',
            `📊 Módulos: ${passed}/${total} disponíveis (${score}%)`);
        
        return { results, total, passed, score };
    }
    
    // ========== INTERFACE DO USUÁRIO ==========
    function createUI() {
        // Remover UI existente
        const existing = document.getElementById(CONFIG.containerId);
        if (existing) existing.remove();
        
        // Remover botão flutuante anterior
        const existingBtn = document.getElementById('diagnostics-floating-btn-v54');
        if (existingBtn) existingBtn.remove();
        
        // Adicionar estilos
        const styleEl = document.createElement('style');
        styleEl.id = 'diagnostics-styles-v54';
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);
        
        // Criar container principal
        elements.container = document.createElement('div');
        elements.container.id = CONFIG.containerId;
        elements.container.innerHTML = `
            <div class="diagnostics-header-v54">
                <h2>
                    <span>🔍</span>
                    DIAGNÓSTICO V54 - v${CONFIG.version}
                </h2>
                <div class="header-controls-v54">
                    <button class="control-btn-v54" onclick="window.${CONFIG.namespace}.runAllTests()">
                        🧪 TESTAR TUDO
                    </button>
                    <button class="control-btn-v54" onclick="window.${CONFIG.namespace}.exportReport()">
                        📊 EXPORTAR
                    </button>
                    <button class="control-btn-v54 close-btn-v54" onclick="window.${CONFIG.namespace}.hide()">
                        ✕ FECHAR
                    </button>
                </div>
            </div>
            
            <div class="diagnostics-tabs-v54" id="diagnostics-tabs-v54">
                <button class="tab-btn-v54 active" data-tab="overview">📊 VISÃO GERAL</button>
                <button class="tab-btn-v54" data-tab="modules">📦 MÓDULOS</button>
                <button class="tab-btn-v54" data-tab="pdf">📄 PDF SYSTEM</button>
                <button class="tab-btn-v54" data-tab="performance">⚡ PERFORMANCE</button>
                <button class="tab-btn-v54" data-tab="logs">📝 LOGS</button>
                <button class="tab-btn-v54" data-tab="actions">🔧 AÇÕES</button>
            </div>
            
            <div class="diagnostics-content-v54" id="diagnostics-content-v54">
                <!-- Conteúdo dinâmico -->
            </div>
        `;
        
        document.body.appendChild(elements.container);
        
        // Configurar tabs
        elements.tabs = elements.container.querySelector('#diagnostics-tabs-v54');
        elements.content = elements.container.querySelector('#diagnostics-content-v54');
        
        // Inicializar painéis
        initializePanels();
        
        // Configurar eventos dos tabs
        elements.tabs.querySelectorAll('.tab-btn-v54').forEach(btn => {
            btn.addEventListener('click', () => {
                elements.tabs.querySelectorAll('.tab-btn-v54').forEach(b => b.classList.remove('active'));
                elements.content.querySelectorAll('.tab-panel-v54').forEach(p => p.classList.remove('active'));
                
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const panel = elements.content.querySelector(`#tab-${tabId}-v54`);
                if (panel) panel.classList.add('active');
                
                if (tabId === 'modules') {
                    updateModulesPanel();
                }
            });
        });
        
        // Criar botão flutuante
        createFloatingButton();
        
        log('success', '✅ Interface de diagnóstico criada');
    }
    
    function createFloatingButton() {
        const floatingBtn = document.createElement('button');
        floatingBtn.id = 'diagnostics-floating-btn-v54';
        floatingBtn.className = 'diagnostics-floating-btn';
        floatingBtn.innerHTML = '🔍';
        floatingBtn.title = 'Abrir Diagnóstico V54';
        floatingBtn.onclick = () => window[CONFIG.namespace].toggle();
        
        document.body.appendChild(floatingBtn);
        log('info', '🎯 Botão flutuante criado');
    }
    
    function initializePanels() {
        // Painel de visão geral
        elements.panels.overview = `
            <div id="tab-overview-v54" class="tab-panel-v54 active">
                <div class="panel-grid-v54">
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-info-v54"></span> SISTEMA</h3>
                        </div>
                        <div class="panel-body-v54">
                            <p><strong>URL:</strong> ${window.location.href}</p>
                            <p><strong>User Agent:</strong> ${navigator.userAgent.substring(0, 50)}...</p>
                            <p><strong>Tela:</strong> ${window.innerWidth} × ${window.innerHeight}</p>
                            <p><strong>Tempo de carga:</strong> ${(Date.now() - state.startTime)}ms</p>
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('verifyModules')">
                                📦 Verificar Módulos
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-info-v54"></span> IMÓVEIS</h3>
                        </div>
                        <div class="panel-body-v54">
                            <p><strong>Total:</strong> <span id="property-count-v54">${window.properties?.length || 0}</span></p>
                            <p><strong>Cards na Página:</strong> <span id="cards-count-v54">${document.querySelectorAll('.property-card').length}</span></p>
                            <p><strong>Carregado:</strong> ${state.systemReady ? '✅' : '⏳'}</p>
                            <button class="test-btn-v54" onclick="checkProperties()">
                                🔍 Verificar Imóveis
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-info-v54"></span> SUPABASE</h3>
                        </div>
                        <div class="panel-body-v54">
                            <p><strong>Cliente:</strong> <span id="supabase-status-v54">${typeof window.supabaseClient === 'object' ? '✅' : '❌'}</span></p>
                            <p><strong>URL:</strong> ${window.SUPABASE_CONSTANTS?.URL ? '✅ Configurada' : '❌ Ausente'}</p>
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('testSupabaseConnection')">
                                🌐 Testar Conexão
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-info-v54"></span> AÇÕES RÁPIDAS</h3>
                        </div>
                        <div class="panel-body-v54">
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.runAllTests()" style="background: #27ae60; color: white;">
                                🚀 EXECUTAR TODOS OS TESTES
                            </button>
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('diagnosePdfIconProblem')">
                                🔧 Corrigir Ícones PDF
                            </button>
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('analyzePerformance')">
                                ⚡ Analisar Performance
                            </button>
                            <button class="test-btn-v54" onclick="forceShowDiagnostics()">
                                💥 FORÇAR VISUALIZAÇÃO
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Painel de módulos
        elements.panels.modules = `
            <div id="tab-modules-v54" class="tab-panel-v54">
                <h3 style="color: #ff6b6b; margin-bottom: 20px;">📦 MÓDULOS DO SISTEMA (V54)</h3>
                <div class="panel-grid-v54" id="modules-grid-v54">
                    <!-- Preenchido dinamicamente -->
                </div>
                <button class="run-all-btn-v54" onclick="window.${CONFIG.namespace}.testModule('verifyModules')">
                    🔍 VERIFICAR TODOS OS MÓDULOS
                </button>
            </div>
        `;
        
        // Painel de PDF
        elements.panels.pdf = `
            <div id="tab-pdf-v54" class="tab-panel-v54">
                <h3 style="color: #ff6b6b; margin-bottom: 20px;">📄 SISTEMA DE DOCUMENTOS PDF</h3>
                <div class="panel-grid-v54">
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-info-v54"></span> COMPONENTES PDF</h3>
                        </div>
                        <div class="panel-body-v54">
                            <p><strong>Modal Principal:</strong> <span id="pdf-modal-status-v54">${document.getElementById('pdfModal') ? '✅' : '❌'}</span></p>
                            <p><strong>Sistema PDF:</strong> <span id="pdf-system-status-v54">${typeof window.PdfSystem === 'object' ? '✅' : '❌'}</span></p>
                            <p><strong>Botões PDF:</strong> <span id="pdf-buttons-count-v54">${document.querySelectorAll('.pdf-access').length}</span></p>
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('testPdfSystem')">
                                🧪 Teste Completo PDF
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-info-v54"></span> DIAGNÓSTICO</h3>
                        </div>
                        <div class="panel-body-v54">
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('diagnosePdfIconProblem')">
                                🔧 Diagnosticar Ícones PDF
                            </button>
                            <button class="test-btn-v54" onclick="testPdfModal()">
                                🎮 Testar Modal PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Painel de logs
        elements.panels.logs = `
            <div id="tab-logs-v54" class="tab-panel-v54">
                <h3 style="color: #ff6b6b; margin-bottom: 20px;">📝 LOGS DO SISTEMA V54</h3>
                <div style="margin-bottom: 20px;">
                    <button class="control-btn-v54" onclick="window.${CONFIG.namespace}.clearLogs()" style="margin-right: 10px;">
                        🗑️ LIMPAR LOGS
                    </button>
                    <button class="control-btn-v54" onclick="window.${CONFIG.namespace}.exportLogs()">
                        💾 EXPORTAR LOGS
                    </button>
                </div>
                <div id="logs-container-v54">
                    <!-- Logs serão mostrados aqui -->
                </div>
            </div>
        `;
        
        // Adicionar todos ao content
        elements.content.innerHTML = Object.values(elements.panels).join('');
        elements.logsContainer = document.getElementById('logs-container-v54');
        
        // Atualizar logs imediatamente
        updateLogsDisplay();
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
            { name: 'properties (array)', obj: window.properties, isArray: true, color: '#27ae60' },
            { name: 'supabaseClient', obj: window.supabaseClient, color: '#2980b9' },
            { name: CONFIG.namespace, obj: window[CONFIG.namespace], color: '#ff6b6b', isThis: true }
        ];
        
        grid.innerHTML = modules.map(mod => {
            const exists = mod.isThis ? true : (mod.isArray ? Array.isArray(mod.obj) : !!mod.obj);
            const type = typeof mod.obj;
            const funcCount = mod.obj && typeof mod.obj === 'object' 
                ? Object.keys(mod.obj).filter(k => typeof mod.obj[k] === 'function').length 
                : 0;
            const itemCount = mod.isArray && Array.isArray(mod.obj) ? mod.obj.length : 'N/A';
            
            return `
            <div class="panel-v54">
                <div class="panel-header-v54" style="border-left: 4px solid ${mod.color}">
                    <h3>${mod.name}</h3>
                    <span style="color: ${exists ? '#27ae60' : '#e74c3c'}">
                        ${exists ? '✅' : '❌'}
                    </span>
                </div>
                <div class="panel-body-v54">
                    <p><strong>Tipo:</strong> ${type}</p>
                    <p><strong>Disponível:</strong> ${exists ? 'Sim' : 'Não'}</p>
                    ${mod.isArray ? `<p><strong>Itens:</strong> ${itemCount}</p>` : ''}
                    ${funcCount > 0 ? `<p><strong>Funções:</strong> ${funcCount}</p>` : ''}
                </div>
            </div>
            `;
        }).join('');
    }
    
    // ========== FUNÇÕES AUXILIARES ==========
    function checkProperties() {
        const props = window.properties || [];
        log('info', `🔍 Verificando ${props.length} imóveis:`, props.slice(0, 3));
        return props;
    }
    
    function testPdfModal() {
        if (window.PdfSystem && window.PdfSystem.showModal) {
            const firstProp = window.properties?.[0];
            if (firstProp) {
                window.PdfSystem.showModal(firstProp.id);
                log('success', `🎮 Modal PDF aberto para imóvel ${firstProp.id}`);
            } else {
                log('warning', '⚠️ Nenhum imóvel disponível para testar');
            }
        } else {
            log('error', '❌ PdfSystem.showModal não disponível');
        }
    }
    
    function forceShowDiagnostics() {
        log('info', '💥 Forçando visualização do diagnóstico...');
        
        // Criar UI se não existir
        if (!elements.container) {
            createUI();
        }
        
        // Mostrar forçadamente
        elements.container.style.display = 'block';
        elements.container.style.zIndex = '999999';
        elements.container.style.opacity = '1';
        state.isVisible = true;
        
        // Trazer para frente
        elements.container.style.transform = 'translate(-50%, -50%) scale(1)';
        
        log('success', '✅ Diagnóstico forçado para visualização');
    }
    
    function analyzePerformance() {
        log('info', '⚡ Analisando performance...');
        
        const perf = {
            loadTime: Date.now() - state.startTime,
            propertyCount: window.properties?.length || 0,
            scriptsLoaded: document.querySelectorAll('script[src]').length,
            imagesLoaded: document.querySelectorAll('img[src]').length
        };
        
        log('info', '📊 Performance:', perf);
        return perf;
    }
    
    async function testSupabaseConnection() {
        log('info', '🌐 Testando Supabase...');
        
        if (!window.supabaseClient) {
            return { error: 'Cliente não encontrado' };
        }
        
        try {
            const { data, error } = await window.supabaseClient
                .from('properties')
                .select('id')
                .limit(1);
            
            if (error) throw error;
            
            log('success', `✅ Supabase conectado: ${data?.length || 0} registros`);
            return { success: true, count: data?.length || 0 };
        } catch (err) {
            log('error', '❌ Erro Supabase:', err.message);
            return { error: err.message };
        }
    }
    
    // ========== SISTEMA DE TENTATIVAS AUTOMÁTICAS ==========
    function attemptAutoShow() {
        if (state.hasInitialized || !CONFIG.autoStart) return;
        
        state.attempts++;
        
        // Condições para mostrar automaticamente
        const shouldShow = 
            window.location.search.includes('diagnostics=true') ||
            localStorage.getItem('diagnostics_auto') === 'true' ||
            (state.attempts > 3 && isSystemReady());
        
        if (shouldShow && !state.isVisible) {
            log('info', `🚀 Tentativa ${state.attempts}: Iniciando diagnóstico automático...`);
            
            // Marcar como inicializado
            state.hasInitialized = true;
            state.systemReady = true;
            
            // Criar e mostrar UI
            createUI();
            
            // Aguardar um pouco e mostrar
            setTimeout(() => {
                if (elements.container) {
                    elements.container.style.display = 'block';
                    state.isVisible = true;
                    log('success', '✅ Diagnóstico V54 aberto automaticamente');
                    
                    // Executar verificações iniciais
                    setTimeout(() => {
                        verifyModules();
                        analyzePerformance();
                    }, 500);
                }
            }, 300);
            
            // Parar tentativas
            clearInterval(attemptInterval);
        } else if (state.attempts > 10) {
            log('warning', `⏱️ Máximo de tentativas atingido (${state.attempts}). Use DiagnosticsV54.show()`);
            clearInterval(attemptInterval);
        }
    }
    
    // ========== API PÚBLICA ==========
    window[CONFIG.namespace] = {
        show: function() {
            if (!elements.container) {
                createUI();
            }
            elements.container.style.display = 'block';
            state.isVisible = true;
            log('success', '🎛️ Diagnóstico V54 aberto manualmente');
            
            // Atualizar dados
            setTimeout(() => {
                if (document.getElementById('property-count-v54')) {
                    document.getElementById('property-count-v54').textContent = window.properties?.length || 0;
                }
                if (document.getElementById('cards-count-v54')) {
                    document.getElementById('cards-count-v54').textContent = document.querySelectorAll('.property-card').length;
                }
                updateLogsDisplay();
            }, 100);
            
            return true;
        },
        
        hide: function() {
            if (elements.container) {
                elements.container.style.display = 'none';
                state.isVisible = false;
                log('info', '🎛️ Diagnóstico V54 fechado');
            }
        },
        
        toggle: function() {
            if (state.isVisible) {
                this.hide();
            } else {
                this.show();
            }
        },
        
        testModule: async function(moduleName) {
            log('info', `🧪 Testando: ${moduleName}`);
            
            const tests = {
                'testPdfSystem': testPdfSystem,
                'diagnosePdfIconProblem': diagnosePdfIconProblem,
                'verifyModules': verifyModules,
                'testSupabaseConnection': testSupabaseConnection,
                'analyzePerformance': analyzePerformance
            };
            
            if (tests[moduleName]) {
                try {
                    const result = await tests[moduleName]();
                    log('success', `✅ ${moduleName} concluído`);
                    return result;
                } catch (err) {
                    log('error', `❌ Erro em ${moduleName}:`, err.message);
                    return { error: err.message };
                }
            }
            
            return { error: 'Teste não encontrado' };
        },
        
        runAllTests: async function() {
            log('info', '🚀 Executando todos os testes...');
            
            const testList = ['verifyModules', 'testPdfSystem', 'analyzePerformance'];
            const results = [];
            
            for (const test of testList) {
                results.push(await this.testModule(test));
            }
            
            const passed = results.filter(r => !r.error).length;
            const total = results.length;
            const score = Math.round((passed / total) * 100);
            
            log('success', `📊 Resultado: ${passed}/${total} passaram (${score}%)`);
            return { passed, total, score, results };
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
            a.download = `diagnostics-v54-logs-${Date.now()}.json`;
            a.click();
            log('success', '💾 Logs exportados');
        },
        
        exportReport: function() {
            const report = {
                timestamp: new Date().toISOString(),
                system: CONFIG.namespace,
                version: CONFIG.version,
                url: window.location.href,
                logs: state.logs,
                state: state
            };
            
            const data = JSON.stringify(report, null, 2);
            const blob = new Blob([data], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `diagnostics-v54-report-${Date.now()}.json`;
            a.click();
            log('success', '📊 Relatório exportado');
        },
        
        getLogs: function() { return [...state.logs]; },
        getState: function() { return { ...state, config: CONFIG }; },
        forceShow: forceShowDiagnostics
    };
    
    // ========== HOTKEYS ==========
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+D
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            window[CONFIG.namespace].toggle();
        }
        
        // Ctrl+Shift+T
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            window[CONFIG.namespace].runAllTests();
        }
    });
    
    // ========== INICIALIZAÇÃO ==========
    log('info', `🔧 ${CONFIG.namespace} v${CONFIG.version} inicializando...`);
    
    // Iniciar sistema de tentativas
    let attemptInterval;
    
    document.addEventListener('DOMContentLoaded', function() {
        log('info', '📄 DOM Content Loaded - Iniciando verificações...');
        state.domReady = true;
        
        // Começar tentativas
        attemptInterval = setInterval(attemptAutoShow, CONFIG.checkInterval);
        
        // Primeira tentativa imediata
        setTimeout(attemptAutoShow, 500);
    });
    
    // Fallback: Se DOMContentLoaded já passou, iniciar agora
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        log('info', '⚡ DOM já carregado - Iniciando agora...');
        state.domReady = true;
        attemptInterval = setInterval(attemptAutoShow, CONFIG.checkInterval);
        setTimeout(attemptAutoShow, 100);
    }
    
    // Mensagem final no console
    console.log(`🎛️ ${CONFIG.namespace} v${CONFIG.version} PRONTO!`);
    console.log(`🎛️ Use: ${CONFIG.namespace}.show()`);
    console.log(`🎛️ Ou clique no botão 🔍 no canto inferior direito`);
    console.log(`🎛️ Hotkeys: Ctrl+Shift+D (abrir), Ctrl+Shift+T (testar)`);
    
})();
