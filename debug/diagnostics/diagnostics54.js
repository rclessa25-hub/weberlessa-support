// debug/diagnostics/diagnostics54.js - SISTEMA DE DIAGNÓSTICO COMPLETO E FUNCIONAL
console.log('🎛️ diagnostics54.js - SISTEMA COMPLETO CARREGADO');

(function() {
    'use strict';
    
    // ========== CONFIGURAÇÕES ==========
    const CONFIG = {
        version: '5.4.0',
        autoStart: true,
        maxLogs: 100,
        refreshInterval: 5000
    };
    
    // ========== ESTADO DO SISTEMA ==========
    const state = {
        logs: [],
        tests: {},
        panels: {},
        isVisible: false,
        startTime: Date.now()
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
    
    // ========== ESTILOS CSS ==========
    const STYLES = `
        /* CONTAINER PRINCIPAL */
        #diagnostics-container {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 1200px;
            height: 80vh;
            background: #0a0a0a;
            border: 3px solid #00ff9c;
            border-radius: 12px;
            z-index: 999999;
            box-shadow: 0 0 40px rgba(0, 255, 156, 0.4);
            display: none;
            overflow: hidden;
            font-family: 'Segoe UI', 'Courier New', monospace;
        }
        
        /* HEADER */
        .diagnostics-header {
            background: linear-gradient(90deg, #111, #222);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #00ff9c;
        }
        
        .diagnostics-header h2 {
            margin: 0;
            color: #00ff9c;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .header-controls {
            display: flex;
            gap: 10px;
        }
        
        .control-btn {
            background: #333;
            color: #00ff9c;
            border: 1px solid #00ff9c;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .control-btn:hover {
            background: #00ff9c;
            color: #000;
        }
        
        .close-btn {
            background: #ff3333;
            color: white;
            border: 1px solid #ff6666;
        }
        
        .close-btn:hover {
            background: #ff6666;
        }
        
        /* TABS */
        .diagnostics-tabs {
            display: flex;
            background: #222;
            border-bottom: 1px solid #444;
            overflow-x: auto;
        }
        
        .tab-btn {
            padding: 12px 20px;
            background: transparent;
            color: #888;
            border: none;
            border-right: 1px solid #333;
            cursor: pointer;
            font-weight: 600;
            white-space: nowrap;
            transition: all 0.3s;
        }
        
        .tab-btn:hover {
            background: #333;
            color: #00ff9c;
        }
        
        .tab-btn.active {
            background: #00ff9c;
            color: #000;
        }
        
        /* CONTEÚDO */
        .diagnostics-content {
            height: calc(100% - 120px);
            overflow-y: auto;
            padding: 20px;
        }
        
        .tab-panel {
            display: none;
        }
        
        .tab-panel.active {
            display: block;
        }
        
        /* PAINÉIS */
        .panel-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .panel {
            background: #111;
            border: 1px solid #333;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .panel-header {
            background: #222;
            padding: 12px 15px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .panel-header h3 {
            margin: 0;
            color: #00ff9c;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .panel-body {
            padding: 15px;
        }
        
        .status-indicator {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }
        
        .status-success { background: #27ae60; }
        .status-warning { background: #f39c12; }
        .status-error { background: #e74c3c; }
        .status-info { background: #3498db; }
        
        /* BOTÕES */
        .test-btn {
            display: block;
            width: 100%;
            background: #222;
            color: #00ff9c;
            border: 1px solid #333;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
            text-align: left;
            transition: all 0.3s;
        }
        
        .test-btn:hover {
            background: #00ff9c;
            color: #000;
            transform: translateX(5px);
        }
        
        .run-all-btn {
            background: #2980b9;
            color: white;
            border: none;
            padding: 12px;
            margin: 10px 0;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
            width: 100%;
        }
        
        /* LOGS */
        #logs-container {
            background: #000;
            border: 1px solid #333;
            border-radius: 5px;
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        
        .log-entry {
            padding: 5px;
            border-bottom: 1px solid #222;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        
        .log-time {
            color: #888;
            min-width: 80px;
        }
        
        .log-type {
            font-weight: bold;
            min-width: 60px;
        }
        
        .log-type.info { color: #3498db; }
        .log-type.success { color: #27ae60; }
        .log-type.warning { color: #f39c12; }
        .log-type.error { color: #e74c3c; }
        
        /* RESPONSIVO */
        @media (max-width: 768px) {
            #diagnostics-container {
                width: 95%;
                height: 90vh;
            }
            
            .panel-grid {
                grid-template-columns: 1fr;
            }
            
            .diagnostics-tabs {
                flex-wrap: wrap;
            }
            
            .tab-btn {
                flex: 1;
                min-width: 120px;
                padding: 10px;
                font-size: 0.9rem;
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
        if (state.isVisible) {
            updateLogsDisplay();
        }
        
        console.log(`[${timestamp}] ${type.toUpperCase()}: ${message}`, data || '');
        
        return logEntry;
    }
    
    function updateLogsDisplay() {
        if (!elements.logsContainer) return;
        
        const logsToShow = state.logs.slice(0, 20);
        elements.logsContainer.innerHTML = logsToShow.map(log => `
            <div class="log-entry">
                <span class="log-time">${log.timestamp}</span>
                <span class="log-type ${log.type}">${log.type.toUpperCase()}</span>
                <span style="color: #ccc; flex: 1;">${log.message}</span>
            </div>
        `).join('');
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
        
        // Mostrar resumo
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
            
            // Tentar corrigir automaticamente
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
        
        // Estatísticas
        const total = Object.keys(results).length;
        const passed = Object.values(results).filter(r => r === '✅').length;
        const score = Math.round((passed / total) * 100);
        
        log(score >= 80 ? 'success' : 'warning',
            `📊 Módulos: ${passed}/${total} disponíveis (${score}%)`);
        
        return { results, total, passed, score };
    }
    
    // 4. ANÁLISE DE PERFORMANCE
    function analyzePerformance() {
        log('info', '⚡ Analisando performance do sistema...');
        
        const perf = {
            loadTime: Date.now() - state.startTime,
            memory: performance.memory ? Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) : 'N/A',
            propertyCount: window.properties?.length || 0,
            scriptsLoaded: document.querySelectorAll('script[src]').length,
            localStorageSize: JSON.stringify(localStorage).length
        };
        
        // Verificar imagens carregadas
        const images = document.querySelectorAll('img');
        const loadedImages = Array.from(images).filter(img => img.complete).length;
        perf.imagesLoaded = `${loadedImages}/${images.length}`;
        
        // Verificar event listeners (estimativa)
        perf.estimatedListeners = document.querySelectorAll('*').length * 0.5;
        
        log('info', '📊 Métricas de performance:', perf);
        
        // Recomendações
        const recommendations = [];
        if (perf.propertyCount > 50) recommendations.push('Considere paginação para muitos imóveis');
        if (perf.estimatedListeners > 1000) recommendations.push('Verifique vazamento de event listeners');
        if (perf.localStorageSize > 5000000) recommendations.push('LocalStorage pode estar muito grande');
        
        if (recommendations.length > 0) {
            log('warning', '💡 Recomendações de performance:', recommendations);
        }
        
        return { perf, recommendations };
    }
    
    // 5. TESTE DE SUPABASE
    function testSupabaseConnection() {
        log('info', '🌐 Testando conexão com Supabase...');
        
        return new Promise((resolve) => {
            if (!window.supabaseClient) {
                log('error', '❌ Cliente Supabase não disponível');
                resolve({ connected: false, error: 'Cliente não disponível' });
                return;
            }
            
            // Teste simples de timeout
            const timeout = setTimeout(() => {
                log('warning', '⏰ Timeout na conexão Supabase');
                resolve({ connected: false, error: 'Timeout' });
            }, 5000);
            
            try {
                window.supabaseClient
                    .from('properties')
                    .select('id')
                    .limit(1)
                    .then(({ data, error }) => {
                        clearTimeout(timeout);
                        
                        if (error) {
                            log('error', '❌ Erro na conexão Supabase:', error.message);
                            resolve({ connected: false, error: error.message });
                        } else {
                            log('success', `✅ Conexão Supabase OK! ${data?.length || 0} registros encontrados`);
                            resolve({ 
                                connected: true, 
                                count: data?.length || 0,
                                sampleId: data?.[0]?.id 
                            });
                        }
                    })
                    .catch(err => {
                        clearTimeout(timeout);
                        log('error', '❌ Erro fatal Supabase:', err.message);
                        resolve({ connected: false, error: err.message });
                    });
                    
            } catch (err) {
                clearTimeout(timeout);
                log('error', '❌ Exceção Supabase:', err.message);
                resolve({ connected: false, error: err.message });
            }
        });
    }
    
    // 6. VALIDAÇÃO DE FORMULÁRIO ADMIN
    function validateAdminForm() {
        log('info', '📝 Validando formulário admin...');
        
        const form = document.getElementById('propertyForm');
        if (!form) {
            log('error', '❌ Formulário admin não encontrado!');
            return { exists: false };
        }
        
        const fields = [
            'propTitle', 'propPrice', 'propLocation', 
            'propDescription', 'propFeatures', 'propType',
            'propBadge', 'propHasVideo', 'fileInput', 'pdfFileInput'
        ];
        
        const results = {};
        fields.forEach(fieldId => {
            const element = document.getElementById(fieldId);
            results[fieldId] = {
                exists: !!element,
                type: element?.type || element?.tagName,
                value: element?.value || element?.checked
            };
        });
        
        // Verificar botões
        results.submitButton = !!form.querySelector('button[type="submit"]');
        results.cancelButton = !!document.getElementById('cancelEditBtn');
        
        log('info', '📊 Campos do formulário:', results);
        
        const existingFields = Object.values(results).filter(r => r.exists).length;
        const totalFields = Object.keys(results).length;
        const score = Math.round((existingFields / totalFields) * 100);
        
        log(score >= 80 ? 'success' : 'warning',
            `📝 Formulário: ${existingFields}/${totalFields} campos OK (${score}%)`);
        
        return { results, existingFields, totalFields, score };
    }
    
    // 7. TESTE DE GALERIA
    function testGallery() {
        log('info', '🖼️ Testando sistema de galeria...');
        
        const results = {
            galleryModal: document.getElementById('propertyGalleryModal'),
            galleryImages: document.querySelectorAll('.property-gallery-image').length,
            galleryFunctions: {
                openGallery: typeof window.openGallery,
                closeGallery: typeof window.closeGallery,
                nextGalleryImage: typeof window.nextGalleryImage,
                prevGalleryImage: typeof window.prevGalleryImage
            },
            videoIndicators: document.querySelectorAll('.video-indicator').length
        };
        
        log('info', '📊 Resultados galeria:', results);
        
        // Verificar funcionalidades
        const functionsExist = Object.values(results.galleryFunctions).filter(f => f === 'function').length;
        const totalFunctions = Object.keys(results.galleryFunctions).length;
        
        log(functionsExist === totalFunctions ? 'success' : 'warning',
            `🎨 Galeria: ${functionsExist}/${totalFunctions} funções disponíveis`);
        
        return results;
    }
    
    // ========== INTERFACE DO USUÁRIO ==========
    function createUI() {
        // Remover UI existente
        const existing = document.getElementById('diagnostics-container');
        if (existing) existing.remove();
        
        // Adicionar estilos
        const styleEl = document.createElement('style');
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);
        
        // Criar container principal
        elements.container = document.createElement('div');
        elements.container.id = 'diagnostics-container';
        elements.container.innerHTML = `
            <div class="diagnostics-header">
                <h2>
                    <span>🔍</span>
                    DIAGNÓSTICO DO SISTEMA - v${CONFIG.version}
                </h2>
                <div class="header-controls">
                    <button class="control-btn" onclick="Diagnostics.runAllTests()">
                        🧪 EXECUTAR TODOS
                    </button>
                    <button class="control-btn" onclick="Diagnostics.exportReport()">
                        📊 EXPORTAR
                    </button>
                    <button class="control-btn close-btn" onclick="Diagnostics.hide()">
                        ✕ FECHAR
                    </button>
                </div>
            </div>
            
            <div class="diagnostics-tabs" id="diagnostics-tabs">
                <button class="tab-btn active" data-tab="overview">📊 VISÃO GERAL</button>
                <button class="tab-btn" data-tab="modules">📦 MÓDULOS</button>
                <button class="tab-btn" data-tab="pdf">📄 PDF SYSTEM</button>
                <button class="tab-btn" data-tab="media">🖼️ MÍDIA</button>
                <button class="tab-btn" data-tab="performance">⚡ PERFORMANCE</button>
                <button class="tab-btn" data-tab="logs">📝 LOGS</button>
            </div>
            
            <div class="diagnostics-content" id="diagnostics-content">
                <!-- Conteúdo será preenchido dinamicamente -->
            </div>
        `;
        
        document.body.appendChild(elements.container);
        
        // Configurar tabs
        elements.tabs = elements.container.querySelector('#diagnostics-tabs');
        elements.content = elements.container.querySelector('#diagnostics-content');
        
        // Inicializar painéis
        initializePanels();
        
        // Configurar eventos dos tabs
        elements.tabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remover active de todos
                elements.tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                elements.content.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                
                // Adicionar ao selecionado
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const panel = elements.content.querySelector(`#tab-${tabId}`);
                if (panel) panel.classList.add('active');
            });
        });
        
        // Carregar painel inicial
        showTab('overview');
        
        log('success', '✅ Interface de diagnóstico criada');
    }
    
    function initializePanels() {
        // Painel de visão geral
        elements.panels.overview = `
            <div id="tab-overview" class="tab-panel active">
                <div class="panel-grid">
                    <div class="panel">
                        <div class="panel-header">
                            <h3><span class="status-indicator status-info"></span> SISTEMA</h3>
                        </div>
                        <div class="panel-body">
                            <p><strong>URL:</strong> ${window.location.href}</p>
                            <p><strong>User Agent:</strong> ${navigator.userAgent.substring(0, 50)}...</p>
                            <p><strong>Tela:</strong> ${window.innerWidth} × ${window.innerHeight}</p>
                            <button class="test-btn" onclick="Diagnostics.testModule('verifyModules')">
                                📦 Verificar Módulos
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <div class="panel-header">
                            <h3><span class="status-indicator status-info"></span> IMÓVEIS</h3>
                        </div>
                        <div class="panel-body">
                            <p><strong>Total:</strong> <span id="property-count">${window.properties?.length || 0}</span></p>
                            <p><strong>Filtro Ativo:</strong> <span id="current-filter">${window.currentFilter || 'todos'}</span></p>
                            <p><strong>Cards na Página:</strong> <span id="cards-count">${document.querySelectorAll('.property-card').length}</span></p>
                            <button class="test-btn" onclick="Diagnostics.testModule('testGallery')">
                                🖼️ Testar Galeria
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <div class="panel-header">
                            <h3><span class="status-indicator status-info"></span> SUPABASE</h3>
                        </div>
                        <div class="panel-body">
                            <p><strong>Cliente:</strong> <span id="supabase-status">${typeof window.supabaseClient === 'object' ? '✅' : '❌'}</span></p>
                            <p><strong>URL:</strong> ${window.SUPABASE_CONSTANTS?.URL ? '✅ Configurada' : '❌ Ausente'}</p>
                            <button class="test-btn" onclick="Diagnostics.testModule('testSupabaseConnection')">
                                🌐 Testar Conexão
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <div class="panel-header">
                            <h3><span class="status-indicator status-info"></span> AÇÕES RÁPIDAS</h3>
                        </div>
                        <div class="panel-body">
                            <button class="test-btn" onclick="Diagnostics.runAllTests()" style="background: #27ae60; color: white;">
                                🚀 EXECUTAR TODOS OS TESTES
                            </button>
                            <button class="test-btn" onclick="Diagnostics.testModule('diagnosePdfIconProblem')">
                                🔧 Corrigir Ícones PDF
                            </button>
                            <button class="test-btn" onclick="Diagnostics.testModule('validateAdminForm')">
                                📝 Validar Formulário
                            </button>
                            <button class="test-btn" onclick="Diagnostics.testModule('analyzePerformance')">
                                ⚡ Analisar Performance
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Painel de módulos
        elements.panels.modules = `
            <div id="tab-modules" class="tab-panel">
                <h3 style="color: #00ff9c; margin-bottom: 20px;">📦 MÓDULOS DO SISTEMA</h3>
                <div class="panel-grid" id="modules-grid">
                    <!-- Preenchido dinamicamente -->
                </div>
                <button class="run-all-btn" onclick="Diagnostics.testModule('verifyModules')">
                    🔍 VERIFICAR TODOS OS MÓDULOS
                </button>
            </div>
        `;
        
        // Painel de PDF
        elements.panels.pdf = `
            <div id="tab-pdf" class="tab-panel">
                <h3 style="color: #00ff9c; margin-bottom: 20px;">📄 SISTEMA DE DOCUMENTOS PDF</h3>
                <div class="panel-grid">
                    <div class="panel">
                        <div class="panel-header">
                            <h3><span class="status-indicator status-info"></span> COMPONENTES PDF</h3>
                        </div>
                        <div class="panel-body">
                            <p><strong>Modal Principal:</strong> <span id="pdf-modal-status">${document.getElementById('pdfModal') ? '✅' : '❌'}</span></p>
                            <p><strong>Sistema PDF:</strong> <span id="pdf-system-status">${typeof window.PdfSystem === 'object' ? '✅' : '❌'}</span></p>
                            <p><strong>Botões PDF:</strong> <span id="pdf-buttons-count">${document.querySelectorAll('.pdf-access').length}</span></p>
                            <button class="test-btn" onclick="Diagnostics.testModule('testPdfSystem')">
                                🧪 Teste Completo PDF
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel">
                        <div class="panel-header">
                            <h3><span class="status-indicator status-info"></span> DIAGNÓSTICO</h3>
                        </div>
                        <div class="panel-body">
                            <button class="test-btn" onclick="Diagnostics.testModule('diagnosePdfIconProblem')">
                                🔧 Diagnosticar Ícones PDF
                            </button>
                            <button class="test-btn" onclick="window.PdfSystem?.showModal?.(window.properties?.[0]?.id)">
                                🎮 Testar Modal PDF
                            </button>
                            <button class="test-btn" onclick="testPdfButtons()">
                                🔍 Testar Botões PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Painel de logs
        elements.panels.logs = `
            <div id="tab-logs" class="tab-panel">
                <h3 style="color: #00ff9c; margin-bottom: 20px;">📝 LOGS DO SISTEMA</h3>
                <div style="margin-bottom: 20px;">
                    <button class="control-btn" onclick="Diagnostics.clearLogs()" style="margin-right: 10px;">
                        🗑️ LIMPAR LOGS
                    </button>
                    <button class="control-btn" onclick="Diagnostics.exportLogs()">
                        💾 EXPORTAR LOGS
                    </button>
                </div>
                <div id="logs-container">
                    <!-- Logs serão mostrados aqui -->
                </div>
            </div>
        `;
        
        // Adicionar todos ao content
        elements.content.innerHTML = Object.values(elements.panels).join('');
        elements.logsContainer = document.getElementById('logs-container');
    }
    
    function showTab(tabId) {
        // Atualizar tabs
        elements.tabs.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        
        // Mostrar painel
        elements.content.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab-${tabId}`);
        });
        
        // Atualizar conteúdo específico do tab
        if (tabId === 'modules') {
            updateModulesPanel();
        }
    }
    
    function updateModulesPanel() {
        const grid = document.getElementById('modules-grid');
        if (!grid) return;
        
        const modules = [
            { name: 'SharedCore', obj: window.SharedCore, color: '#3498db' },
            { name: 'MediaSystem', obj: window.MediaSystem, color: '#9b59b6' },
            { name: 'PdfSystem', obj: window.PdfSystem, color: '#e74c3c' },
            { name: 'LoadingManager', obj: window.LoadingManager, color: '#f39c12' },
            { name: 'FilterManager', obj: window.FilterManager, color: '#1abc9c' },
            { name: 'EventManager', obj: window.EventManager, color: '#34495e' },
            { name: 'properties (array)', obj: window.properties, isArray: true, color: '#27ae60' },
            { name: 'supabaseClient', obj: window.supabaseClient, color: '#2980b9' }
        ];
        
        grid.innerHTML = modules.map(mod => `
            <div class="panel">
                <div class="panel-header" style="border-left: 4px solid ${mod.color}">
                    <h3>${mod.name}</h3>
                    <span style="color: ${mod.exists ? '#27ae60' : '#e74c3c'}">
                        ${mod.exists ? '✅' : '❌'}
                    </span>
                </div>
                <div class="panel-body">
                    <p><strong>Tipo:</strong> ${typeof mod.obj}</p>
                    <p><strong>Disponível:</strong> ${mod.obj ? 'Sim' : 'Não'}</p>
                    ${mod.isArray ? `<p><strong>Itens:</strong> ${Array.isArray(mod.obj) ? mod.obj.length : 'N/A'}</p>` : ''}
                    ${mod.obj && typeof mod.obj === 'object' ? 
                        `<p><strong>Funções:</strong> ${Object.keys(mod.obj).filter(k => typeof mod.obj[k] === 'function').length}</p>` : 
                        ''}
                </div>
            </div>
        `).join('');
    }
    
    // ========== API PÚBLICA ==========
    window.Diagnostics = {
        // Controle da UI
        show: function() {
            if (!elements.container) {
                createUI();
            }
            elements.container.style.display = 'block';
            state.isVisible = true;
            log('info', '🎛️ Painel de diagnóstico aberto');
        },
        
        hide: function() {
            if (elements.container) {
                elements.container.style.display = 'none';
                state.isVisible = false;
                log('info', '🎛️ Painel de diagnóstico fechado');
            }
        },
        
        toggle: function() {
            if (state.isVisible) {
                this.hide();
            } else {
                this.show();
            }
        },
        
        // Execução de testes
        testModule: async function(moduleName) {
            log('info', `🧪 Executando teste: ${moduleName}`);
            
            const testFunctions = {
                'testPdfSystem': testPdfSystem,
                'diagnosePdfIconProblem': diagnosePdfIconProblem,
                'verifyModules': verifyModules,
                'testSupabaseConnection': testSupabaseConnection,
                'validateAdminForm': validateAdminForm,
                'testGallery': testGallery,
                'analyzePerformance': analyzePerformance
            };
            
            if (testFunctions[moduleName]) {
                try {
                    const result = await testFunctions[moduleName]();
                    log('success', `✅ Teste ${moduleName} concluído`);
                    return result;
                } catch (error) {
                    log('error', `❌ Erro no teste ${moduleName}:`, error.message);
                    return { error: error.message };
                }
            } else {
                log('error', `❌ Teste desconhecido: ${moduleName}`);
                return { error: 'Teste não encontrado' };
            }
        },
        
        runAllTests: async function() {
            log('info', '🚀 INICIANDO TODOS OS TESTES...');
            
            const tests = [
                'verifyModules',
                'testPdfSystem',
                'diagnosePdfIconProblem',
                'testSupabaseConnection',
                'validateAdminForm',
                'testGallery',
                'analyzePerformance'
            ];
            
            const results = {
                startTime: new Date().toISOString(),
                tests: [],
                summary: {
                    passed: 0,
                    failed: 0,
                    total: tests.length
                }
            };
            
            for (const testName of tests) {
                try {
                    log('info', `▶️ Executando: ${testName}`);
                    const result = await this.testModule(testName);
                    
                    results.tests.push({
                        name: testName,
                        result: result,
                        status: result?.error ? 'failed' : 'passed',
                        timestamp: new Date().toISOString()
                    });
                    
                    if (result?.error) {
                        results.summary.failed++;
                    } else {
                        results.summary.passed++;
                    }
                    
                } catch (error) {
                    results.tests.push({
                        name: testName,
                        error: error.message,
                        status: 'error',
                        timestamp: new Date().toISOString()
                    });
                    results.summary.failed++;
                }
            }
            
            const score = Math.round((results.summary.passed / results.summary.total) * 100);
            log(score >= 80 ? 'success' : 'warning',
                `📊 RESULTADO FINAL: ${results.summary.passed}/${results.summary.total} testes passados (${score}%)`);
            
            // Mostrar resumo na UI
            if (state.isVisible) {
                alert(`✅ Testes concluídos!\n\nPassados: ${results.summary.passed}/${results.summary.total}\nScore: ${score}%`);
            }
            
            return results;
        },
        
        // Logs
        clearLogs: function() {
            state.logs = [];
            updateLogsDisplay();
            log('info', '🗑️ Logs limpos');
        },
        
        exportLogs: function() {
            const dataStr = JSON.stringify(state.logs, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `diagnostics-logs-${Date.now()}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            log('success', '💾 Logs exportados');
        },
        
        exportReport: function() {
            const report = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                diagnosticsVersion: CONFIG.version,
                systemInfo: {
                    userAgent: navigator.userAgent,
                    screen: `${window.innerWidth}x${window.innerHeight}`,
                    propertiesCount: window.properties?.length || 0
                },
                logs: state.logs,
                tests: state.tests
            };
            
            const dataStr = JSON.stringify(report, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `diagnostics-report-${Date.now()}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            log('success', '📊 Relatório exportado');
        },
        
        // Informações
        getLogs: function() {
            return state.logs;
        },
        
        getState: function() {
            return { ...state, config: CONFIG };
        }
    };
    
    // ========== INICIALIZAÇÃO AUTOMÁTICA ==========
    if (CONFIG.autoStart && window.location.search.includes('diagnostics=true')) {
        document.addEventListener('DOMContentLoaded', function() {
            setTimeout(() => {
                log('info', `🚀 Sistema de diagnóstico v${CONFIG.version} inicializado`);
                Diagnostics.show();
                
                // Executar verificação inicial
                setTimeout(() => {
                    verifyModules();
                    analyzePerformance();
                }, 1000);
            }, 2000);
        });
    }
    
    // ========== FUNÇÕES AUXILIARES ==========
    function testPdfButtons() {
        const buttons = document.querySelectorAll('.pdf-access');
        log('info', `🔍 Testando ${buttons.length} botões PDF...`);
        
        buttons.forEach((btn, index) => {
            const hasOnclick = btn.getAttribute('onclick');
            const hasEvent = btn.onclick;
            
            if (!hasOnclick && !hasEvent) {
                log('warning', `⚠️ Botão PDF ${index + 1} sem evento`);
                
                // Tentar encontrar property ID
                const card = btn.closest('.property-card');
                const propertyId = card?.getAttribute('data-property-id');
                
                if (propertyId) {
                    btn.setAttribute('onclick', `event.stopPropagation(); window.PdfSystem.showModal(${propertyId})`);
                    log('success', `✅ Botão ${index + 1} corrigido para property ${propertyId}`);
                }
            }
        });
    }
    
    // ========== INICIALIZAÇÃO FINAL ==========
    log('info', `🔧 Diagnostics v${CONFIG.version} carregado`);
    console.log('🎛️ Use "Diagnostics.show()" para abrir o painel de diagnóstico');
    console.log('🎛️ Use "Diagnostics.runAllTests()" para executar todos os testes');
    
})();
