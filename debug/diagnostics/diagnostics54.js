// debug/diagnostics/diagnostics54.js - SISTEMA DE DIAGNÓSTICO DEFINITIVO E ISOLADO
console.log('🎛️ diagnostics54.js - SISTEMA DEFINITIVO CARREGADO (VERSÃO ISOLADA)');

(function() {
    'use strict';
    
    // ========== CONFIGURAÇÕES PRIVADAS ==========
    const CONFIG = {
        version: '5.4.1',
        namespace: 'DiagnosticsV54', // Namespace único para evitar conflitos
        autoStart: true,
        maxLogs: 100,
        refreshInterval: 5000,
        containerId: 'diagnostics-container-v54' // ID único
    };
    
    // ========== ESTADO PRIVADO ==========
    const state = {
        logs: [],
        tests: {},
        panels: {},
        isVisible: false,
        startTime: Date.now(),
        hasInitialized: false
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
        /* CONTAINER PRINCIPAL ÚNICO */
        #${CONFIG.containerId} {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 1200px;
            height: 80vh;
            background: #0a0a0a;
            border: 3px solid #ff6b6b;
            border-radius: 12px;
            z-index: 999999;
            box-shadow: 0 0 40px rgba(255, 107, 107, 0.4);
            display: none;
            overflow: hidden;
            font-family: 'Segoe UI', 'Courier New', monospace;
        }
        
        /* HEADER DISTINTIVO */
        .diagnostics-header-v54 {
            background: linear-gradient(90deg, #111, #222);
            padding: 15px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #ff6b6b;
        }
        
        .diagnostics-header-v54 h2 {
            margin: 0;
            color: #ff6b6b;
            font-size: 1.4rem;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .header-controls-v54 {
            display: flex;
            gap: 10px;
        }
        
        .control-btn-v54 {
            background: #333;
            color: #ff6b6b;
            border: 1px solid #ff6b6b;
            padding: 8px 15px;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            transition: all 0.3s;
        }
        
        .control-btn-v54:hover {
            background: #ff6b6b;
            color: #000;
        }
        
        .close-btn-v54 {
            background: #ff3333;
            color: white;
            border: 1px solid #ff6666;
        }
        
        .close-btn-v54:hover {
            background: #ff6666;
        }
        
        /* TABS ÚNICOS */
        .diagnostics-tabs-v54 {
            display: flex;
            background: #222;
            border-bottom: 1px solid #444;
            overflow-x: auto;
        }
        
        .tab-btn-v54 {
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
        
        .tab-btn-v54:hover {
            background: #333;
            color: #ff6b6b;
        }
        
        .tab-btn-v54.active {
            background: #ff6b6b;
            color: #000;
        }
        
        /* CONTEÚDO */
        .diagnostics-content-v54 {
            height: calc(100% - 120px);
            overflow-y: auto;
            padding: 20px;
        }
        
        .tab-panel-v54 {
            display: none;
        }
        
        .tab-panel-v54.active {
            display: block;
        }
        
        /* PAINÉIS ÚNICOS */
        .panel-grid-v54 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .panel-v54 {
            background: #111;
            border: 1px solid #333;
            border-radius: 8px;
            overflow: hidden;
        }
        
        .panel-header-v54 {
            background: #222;
            padding: 12px 15px;
            border-bottom: 1px solid #333;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .panel-header-v54 h3 {
            margin: 0;
            color: #ff6b6b;
            font-size: 1.1rem;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .panel-body-v54 {
            padding: 15px;
        }
        
        .status-indicator-v54 {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
            margin-right: 8px;
        }
        
        .status-success-v54 { background: #27ae60; }
        .status-warning-v54 { background: #f39c12; }
        .status-error-v54 { background: #e74c3c; }
        .status-info-v54 { background: #3498db; }
        
        /* BOTÕES ÚNICOS */
        .test-btn-v54 {
            display: block;
            width: 100%;
            background: #222;
            color: #ff6b6b;
            border: 1px solid #333;
            padding: 10px;
            margin: 5px 0;
            border-radius: 5px;
            cursor: pointer;
            text-align: left;
            transition: all 0.3s;
        }
        
        .test-btn-v54:hover {
            background: #ff6b6b;
            color: #000;
            transform: translateX(5px);
        }
        
        .run-all-btn-v54 {
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
        
        /* LOGS ÚNICOS */
        #logs-container-v54 {
            background: #000;
            border: 1px solid #333;
            border-radius: 5px;
            padding: 15px;
            max-height: 300px;
            overflow-y: auto;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
        }
        
        .log-entry-v54 {
            padding: 5px;
            border-bottom: 1px solid #222;
            display: flex;
            align-items: flex-start;
            gap: 10px;
        }
        
        .log-time-v54 {
            color: #888;
            min-width: 80px;
        }
        
        .log-type-v54 {
            font-weight: bold;
            min-width: 60px;
        }
        
        .log-type-v54.info { color: #3498db; }
        .log-type-v54.success { color: #27ae60; }
        .log-type-v54.warning { color: #f39c12; }
        .log-type-v54.error { color: #e74c3c; }
        
        /* RESPONSIVO */
        @media (max-width: 768px) {
            #${CONFIG.containerId} {
                width: 95%;
                height: 90vh;
            }
            
            .panel-grid-v54 {
                grid-template-columns: 1fr;
            }
            
            .diagnostics-tabs-v54 {
                flex-wrap: wrap;
            }
            
            .tab-btn-v54 {
                flex: 1;
                min-width: 120px;
                padding: 10px;
                font-size: 0.9rem;
            }
        }
    `;
    
    // ========== FUNÇÕES DE LOG ÚNICAS ==========
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
    async function testSupabaseConnection() {
        log('info', '🌐 Testando conexão com Supabase...');
        
        if (!window.supabaseClient) {
            log('error', '❌ Cliente Supabase não disponível');
            return { connected: false, error: 'Cliente não disponível' };
        }
        
        try {
            // Teste simples de timeout
            const timeoutPromise = new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Timeout após 5 segundos')), 5000)
            );
            
            const queryPromise = window.supabaseClient
                .from('properties')
                .select('id')
                .limit(1);
            
            const { data, error } = await Promise.race([queryPromise, timeoutPromise]);
            
            if (error) {
                log('error', '❌ Erro na conexão Supabase:', error.message);
                return { connected: false, error: error.message };
            } else {
                log('success', `✅ Conexão Supabase OK! ${data?.length || 0} registros encontrados`);
                return { 
                    connected: true, 
                    count: data?.length || 0,
                    sampleId: data?.[0]?.id 
                };
            }
        } catch (err) {
            log('error', '❌ Erro fatal Supabase:', err.message);
            return { connected: false, error: err.message };
        }
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
        // Remover UI existente COM NOSSO ID
        const existing = document.getElementById(CONFIG.containerId);
        if (existing) existing.remove();
        
        // Verificar se há outros containers de diagnóstico e desabilitá-los
        document.querySelectorAll('[id*="diagnostics"]').forEach(el => {
            if (el.id !== CONFIG.containerId && el.style.display === 'block') {
                el.style.display = 'none';
                console.log(`%c[${CONFIG.namespace}] ⚠️ Outro painel de diagnóstico foi ocultado: ${el.id}`, 'color: #f39c12');
            }
        });
        
        // Adicionar estilos COM CLASSES ÚNICAS
        const styleEl = document.createElement('style');
        styleEl.id = 'diagnostics-styles-v54';
        styleEl.textContent = STYLES;
        document.head.appendChild(styleEl);
        
        // Criar container principal COM ID ÚNICO
        elements.container = document.createElement('div');
        elements.container.id = CONFIG.containerId;
        elements.container.innerHTML = `
            <div class="diagnostics-header-v54">
                <h2>
                    <span>🔍</span>
                    DIAGNÓSTICO V54 - v${CONFIG.version} - ${CONFIG.namespace}
                </h2>
                <div class="header-controls-v54">
                    <button class="control-btn-v54" onclick="window.${CONFIG.namespace}.runAllTests()">
                        🧪 EXECUTAR TODOS
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
                <button class="tab-btn-v54" data-tab="media">🖼️ MÍDIA</button>
                <button class="tab-btn-v54" data-tab="performance">⚡ PERFORMANCE</button>
                <button class="tab-btn-v54" data-tab="logs">📝 LOGS</button>
                <button class="tab-btn-v54" data-tab="actions">🔧 AÇÕES</button>
            </div>
            
            <div class="diagnostics-content-v54" id="diagnostics-content-v54">
                <!-- Conteúdo será preenchido dinamicamente -->
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
                // Remover active de todos
                elements.tabs.querySelectorAll('.tab-btn-v54').forEach(b => b.classList.remove('active'));
                elements.content.querySelectorAll('.tab-panel-v54').forEach(p => p.classList.remove('active'));
                
                // Adicionar ao selecionado
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                const panel = elements.content.querySelector(`#tab-${tabId}-v54`);
                if (panel) panel.classList.add('active');
                
                // Atualizar conteúdo específico do tab
                if (tabId === 'modules') {
                    updateModulesPanel();
                }
            });
        });
        
        // Carregar painel inicial
        showTab('overview');
        
        log('success', '✅ Interface de diagnóstico criada com namespace único');
    }
    
    function initializePanels() {
        // Painel de visão geral
        elements.panels.overview = `
            <div id="tab-overview-v54" class="tab-panel-v54 active">
                <div class="panel-grid-v54">
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-info-v54"></span> SISTEMA V54</h3>
                        </div>
                        <div class="panel-body-v54">
                            <p><strong>Namespace:</strong> ${CONFIG.namespace}</p>
                            <p><strong>URL:</strong> ${window.location.href}</p>
                            <p><strong>Tela:</strong> ${window.innerWidth} × ${window.innerHeight}</p>
                            <p><strong>Carregado em:</strong> ${(Date.now() - state.startTime)}ms</p>
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
                            <p><strong>Filtro Ativo:</strong> <span id="current-filter-v54">${window.currentFilter || 'todos'}</span></p>
                            <p><strong>Cards na Página:</strong> <span id="cards-count-v54">${document.querySelectorAll('.property-card').length}</span></p>
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('testGallery')">
                                🖼️ Testar Galeria
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
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('validateAdminForm')">
                                📝 Validar Formulário
                            </button>
                            <button class="test-btn-v54" onclick="window.${CONFIG.namespace}.testModule('analyzePerformance')">
                                ⚡ Analisar Performance
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
                            <button class="test-btn-v54" onclick="testPdfButtonsManual()">
                                🔍 Testar Botões PDF
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
                    <button class="control-btn-v54" onclick="window.${CONFIG.namespace}.testModule('analyzePerformance')">
                        ⚡ ATUALIZAR
                    </button>
                </div>
                <div id="logs-container-v54">
                    <!-- Logs serão mostrados aqui -->
                </div>
            </div>
        `;
        
        // Painel de ações
        elements.panels.actions = `
            <div id="tab-actions-v54" class="tab-panel-v54">
                <h3 style="color: #ff6b6b; margin-bottom: 20px;">🔧 AÇÕES DE EMERGÊNCIA</h3>
                <div class="panel-grid-v54">
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-warning-v54"></span> SISTEMA</h3>
                        </div>
                        <div class="panel-body-v54">
                            <button class="test-btn-v54" onclick="forceReloadProperties()">
                                🔄 Recarregar Imóveis
                            </button>
                            <button class="test-btn-v54" onclick="clearLocalStorage()">
                                🗑️ Limpar LocalStorage
                            </button>
                            <button class="test-btn-v54" onclick="reloadPage()">
                                ↩️ Recarregar Página
                            </button>
                            <button class="test-btn-v54" onclick="showSystemInfo()">
                                ℹ️ Informações do Sistema
                            </button>
                        </div>
                    </div>
                    
                    <div class="panel-v54">
                        <div class="panel-header-v54">
                            <h3><span class="status-indicator-v54 status-error-v54"></span> DEBUG</h3>
                        </div>
                        <div class="panel-body-v54">
                            <button class="test-btn-v54" onclick="enableVerboseLogging()">
                                🔊 Ativar Logs Detalhados
                            </button>
                            <button class="test-btn-v54" onclick="disableOtherDiagnostics()">
                                ⚡ Desativar Outros Diagnósticos
                            </button>
                            <button class="test-btn-v54" onclick="testAllButtons()">
                                🔘 Testar Todos os Botões
                            </button>
                            <button class="test-btn-v54" onclick="checkConflicts()">
                🔍 Verificar Conflitos
            </button>
        </div>
    </div>
</div>
</div>
`;
        
        // Adicionar todos ao content
        elements.content.innerHTML = Object.values(elements.panels).join('');
        elements.logsContainer = document.getElementById('logs-container-v54');
    }
    
    function showTab(tabId) {
        // Atualizar tabs
        elements.tabs.querySelectorAll('.tab-btn-v54').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
        });
        
        // Mostrar painel
        elements.content.querySelectorAll('.tab-panel-v54').forEach(panel => {
            panel.classList.toggle('active', panel.id === `tab-${tabId}-v54`);
        });
        
        // Atualizar conteúdo específico do tab
        if (tabId === 'modules') {
            updateModulesPanel();
        }
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
                    ${mod.name === 'properties (array)' && itemCount > 0 ? 
                        `<button class="test-btn-v54" onclick="sampleFirstProperty()">
                            👁️ Ver Primeiro Item
                        </button>` : ''}
                </div>
            </div>
            `;
        }).join('');
    }
    
    // ========== FUNÇÕES AUXILIARES DE AÇÕES ==========
    function testPdfModal() {
        if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
            const firstProperty = window.properties?.[0];
            if (firstProperty) {
                window.PdfSystem.showModal(firstProperty.id);
                log('success', `🎮 Modal PDF aberto para imóvel ${firstProperty.id}`);
            } else {
                log('warning', '⚠️ Nenhum imóvel encontrado para testar o modal');
            }
        } else {
            log('error', '❌ PdfSystem ou showModal não disponível');
        }
    }
    
    function testPdfButtonsManual() {
        const buttons = document.querySelectorAll('.pdf-access');
        log('info', `🔍 Testando ${buttons.length} botões PDF manualmente...`);
        
        let fixedCount = 0;
        let issues = [];
        
        buttons.forEach((btn, index) => {
            const hasOnclick = btn.getAttribute('onclick');
            const hasEvent = btn.onclick;
            
            if (!hasOnclick && !hasEvent) {
                issues.push(index);
                
                // Tentar encontrar property ID
                const card = btn.closest('.property-card');
                const propertyId = card?.getAttribute('data-property-id');
                
                if (propertyId) {
                    btn.setAttribute('onclick', `event.stopPropagation(); window.PdfSystem.showModal(${propertyId})`);
                    btn.style.border = '2px solid #27ae60';
                    fixedCount++;
                }
            }
        });
        
        if (issues.length > 0) {
            log(fixedCount > 0 ? 'success' : 'warning',
                `🔧 ${fixedCount}/${issues.length} botões PDF corrigidos`);
        } else {
            log('success', '✅ Todos os botões PDF estão funcionais');
        }
        
        return { issues, fixedCount };
    }
    
    function forceReloadProperties() {
        log('info', '🔄 Forçando recarregamento de imóveis...');
        
        if (window.SharedCore && window.SharedCore.fetchProperties) {
            window.SharedCore.fetchProperties()
                .then(() => log('success', '✅ Imóveis recarregados com sucesso'))
                .catch(err => log('error', '❌ Erro ao recarregar imóveis:', err));
        } else {
            log('error', '❌ SharedCore.fetchProperties não disponível');
        }
    }
    
    function clearLocalStorage() {
        const confirm = window.confirm('⚠️ TEM CERTEZA? Isso limpará todos os dados locais (filtros, preferências, etc).');
        if (confirm) {
            const backup = {};
            Object.keys(localStorage).forEach(key => {
                backup[key] = localStorage.getItem(key);
            });
            
            localStorage.clear();
            log('warning', '🗑️ LocalStorage limpo. Backup no console.');
            console.log('💾 Backup do LocalStorage:', backup);
            
            // Recarregar a página
            setTimeout(() => location.reload(), 1000);
        }
    }
    
    function reloadPage() {
        location.reload();
    }
    
    function showSystemInfo() {
        const info = {
            navigator: {
                userAgent: navigator.userAgent,
                platform: navigator.platform,
                language: navigator.language
            },
            screen: {
                width: window.screen.width,
                height: window.screen.height,
                innerWidth: window.innerWidth,
                innerHeight: window.innerHeight
            },
            performance: performance.timing ? {
                loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
            } : 'N/A',
            memory: performance.memory ? {
                used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB',
                limit: Math.round(performance.memory.jsHeapSizeLimit / 1024 / 1024) + 'MB'
            } : 'N/A',
            diagnostics: {
                namespace: CONFIG.namespace,
                version: CONFIG.version,
                logsCount: state.logs.length,
                startTime: new Date(state.startTime).toLocaleString()
            }
        };
        
        log('info', 'ℹ️ Informações completas do sistema:', info);
        
        // Mostrar em alerta também
        const summary = `
💻 SISTEMA:
• User Agent: ${info.navigator.userAgent.substring(0, 80)}...
• Tela: ${info.screen.width}x${info.screen.height}
• Idioma: ${info.navigator.language}

📊 PERFORMANCE:
• Memória usada: ${info.memory.used || 'N/A'}
• Tempo de carga: ${info.performance.loadTime || 'N/A'}ms

🔧 DIAGNÓSTICO:
• Namespace: ${CONFIG.namespace}
• Versão: ${CONFIG.version}
• Logs: ${state.logs.length} entradas
        `.trim();
        
        alert(summary);
        
        return info;
    }
    
    function enableVerboseLogging() {
        localStorage.setItem('debug_mode', 'verbose');
        localStorage.setItem('log_level', 'debug');
        
        // Adicionar listener global para erros
        window.addEventListener('error', function(e) {
            log('error', `🌍 Erro global: ${e.message}`, {
                filename: e.filename,
                lineno: e.lineno,
                colno: e.colno
            });
        });
        
        // Adicionar listener para promises não tratadas
        window.addEventListener('unhandledrejection', function(e) {
            log('error', '🌍 Promise rejeitada não tratada:', e.reason);
        });
        
        log('success', '🔊 Logs detalhados ativados. Erros globais serão capturados.');
    }
    
    function disableOtherDiagnostics() {
        // Encontrar e desativar outros painéis de diagnóstico
        const otherPanels = document.querySelectorAll('[id*="diagnostics"]:not(#' + CONFIG.containerId + ')');
        let disabledCount = 0;
        
        otherPanels.forEach(panel => {
            if (panel.style.display !== 'none') {
                panel.style.display = 'none';
                disabledCount++;
                console.log(`%c[${CONFIG.namespace}] ⚡ Painel desativado: ${panel.id}`, 'color: #e74c3c');
            }
        });
        
        // Limpar event listeners de outros sistemas
        const oldDiagnostics = window.Diagnostics;
        if (oldDiagnostics && oldDiagnostics !== window[CONFIG.namespace]) {
            console.log(`%c[${CONFIG.namespace}] ⚡ Sistema Diagnostics anterior encontrado e isolado`, 'color: #e74c3c');
        }
        
        log('info', `⚡ ${disabledCount} outros painéis de diagnóstico foram desativados`);
        return disabledCount;
    }
    
    function testAllButtons() {
        log('info', '🔘 Testando todos os botões da página...');
        
        const buttons = document.querySelectorAll('button, [onclick], .btn, .button');
        const results = {
            total: buttons.length,
            withOnclick: 0,
            withListener: 0,
            broken: []
        };
        
        buttons.forEach((btn, index) => {
            const hasOnclick = btn.getAttribute('onclick');
            const hasEvent = btn.onclick;
            const isVisible = btn.offsetParent !== null;
            
            if (hasOnclick) results.withOnclick++;
            if (hasEvent) results.withListener++;
            
            if (!hasOnclick && !hasEvent && isVisible && btn.textContent.includes('PDF')) {
                results.broken.push({
                    index,
                    text: btn.textContent.substring(0, 30),
                    type: btn.className
                });
            }
        });
        
        log('info', '📊 Resultado do teste de botões:', results);
        
        const functional = results.withOnclick + results.withListener;
        const score = Math.round((functional / results.total) * 100);
        
        log(score > 90 ? 'success' : 'warning',
            `🔘 Botões: ${functional}/${results.total} funcionais (${score}%)`);
        
        return results;
    }
    
    function checkConflicts() {
        log('info', '🔍 Verificando conflitos no sistema...');
        
        const conflicts = [];
        
        // Verificar múltiplos diagnósticos
        if (window.Diagnostics && window.Diagnostics !== window[CONFIG.namespace]) {
            conflicts.push({
                type: 'namespace',
                message: 'Múltiplos sistemas Diagnostics encontrados',
                details: {
                    current: CONFIG.namespace,
                    other: 'window.Diagnostics'
                }
            });
        }
        
        // Verificar funções duplicadas
        const functions = ['show', 'hide', 'runAllTests'];
        functions.forEach(funcName => {
            const ourFunc = window[CONFIG.namespace][funcName];
            const globalFunc = window[funcName];
            
            if (globalFunc && globalFunc !== ourFunc) {
                conflicts.push({
                    type: 'function',
                    message: `Função ${funcName} duplicada no escopo global`,
                    details: { source: 'window.' + funcName }
                });
            }
        });
        
        // Verificar event listeners duplicados
        if (window._diagnosticsEventListeners && window._diagnosticsEventListeners.length > 1) {
            conflicts.push({
                type: 'listeners',
                message: 'Múltiplos event listeners de diagnóstico',
                details: { count: window._diagnosticsEventListeners.length }
            });
        }
        
        // Verificar estilos CSS duplicados
        const styleSheets = document.querySelectorAll('style[id*="diagnostics"]');
        if (styleSheets.length > 1) {
            conflicts.push({
                type: 'styles',
                message: 'Múltiplas folhas de estilo de diagnóstico',
                details: { count: styleSheets.length }
            });
        }
        
        if (conflicts.length > 0) {
            log('warning', `⚠️ ${conflicts.length} conflitos encontrados:`, conflicts);
            
            // Oferecer correção automática
            const fix = window.confirm(
                `Encontrados ${conflicts.length} conflitos.\n` +
                `Deseja corrigir automaticamente?`
            );
            
            if (fix) {
                disableOtherDiagnostics();
                log('success', '✅ Conflitos resolvidos automaticamente');
            }
        } else {
            log('success', '✅ Nenhum conflito encontrado. Sistema limpo.');
        }
        
        return conflicts;
    }
    
    function sampleFirstProperty() {
        const firstProp = window.properties?.[0];
        if (firstProp) {
            console.log('📋 Primeiro imóvel:', firstProp);
            log('info', '📋 Primeiro imóvel (veja console)', {
                id: firstProp.id,
                title: firstProp.title,
                price: firstProp.price,
                hasPDF: !!firstProp.pdf_url
            });
        } else {
            log('warning', '⚠️ Nenhum imóvel encontrado no array properties');
        }
        return firstProp;
    }
    
    // ========== API PÚBLICA ÚNICA ==========
    window[CONFIG.namespace] = {
        // Controle da UI
        show: function() {
            if (!elements.container) {
                createUI();
            }
            elements.container.style.display = 'block';
            state.isVisible = true;
            log('info', '🎛️ Painel de diagnóstico V54 aberto');
            
            // Atualizar dados em tempo real
            setTimeout(() => {
                const countEl = document.getElementById('property-count-v54');
                const cardsEl = document.getElementById('cards-count-v54');
                if (countEl) countEl.textContent = window.properties?.length || 0;
                if (cardsEl) cardsEl.textContent = document.querySelectorAll('.property-card').length;
            }, 100);
        },
        
        hide: function() {
            if (elements.container) {
                elements.container.style.display = 'none';
                state.isVisible = false;
                log('info', '🎛️ Painel de diagnóstico V54 fechado');
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
                    
                    // Atualizar UI se necessário
                    if (state.isVisible && elements.container) {
                        showTab('logs');
                    }
                    
                    return result;
                } catch (error) {
                    log('error', `❌ Erro no teste ${moduleName}:`, error.message);
                    return { error: error.message, stack: error.stack };
                }
            } else {
                log('error', `❌ Teste desconhecido: ${moduleName}`);
                return { error: 'Teste não encontrado' };
            }
        },
        
        runAllTests: async function() {
            log('info', '🚀 INICIANDO TODOS OS TESTES V54...');
            
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
                system: CONFIG.namespace,
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
                    
                    const testResult = {
                        name: testName,
                        result: result,
                        status: result?.error ? 'failed' : 'passed',
                        timestamp: new Date().toISOString()
                    };
                    
                    results.tests.push(testResult);
                    
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
                `📊 RESULTADO FINAL V54: ${results.summary.passed}/${results.summary.total} testes passados (${score}%)`);
            
            // Mostrar resumo na UI
            if (state.isVisible) {
                alert(`✅ Testes V54 concluídos!\n\n` +
                      `Passados: ${results.summary.passed}/${results.summary.total}\n` +
                      `Score: ${score}%\n` +
                      `Sistema: ${CONFIG.namespace}`);
            }
            
            state.tests = results;
            return results;
        },
        
        // Logs
        clearLogs: function() {
            state.logs = [];
            updateLogsDisplay();
            log('info', '🗑️ Logs V54 limpos');
        },
        
        exportLogs: function() {
            const dataStr = JSON.stringify(state.logs, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `diagnostics-v54-logs-${Date.now()}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            log('success', '💾 Logs V54 exportados');
        },
        
        exportReport: function() {
            const report = {
                timestamp: new Date().toISOString(),
                namespace: CONFIG.namespace,
                version: CONFIG.version,
                url: window.location.href,
                systemInfo: {
                    userAgent: navigator.userAgent,
                    screen: `${window.innerWidth}x${window.innerHeight}`,
                    propertiesCount: window.properties?.length || 0,
                    loadTime: Date.now() - state.startTime
                },
                logs: state.logs,
                tests: state.tests,
                modules: verifyModules().results
            };
            
            const dataStr = JSON.stringify(report, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
            const exportFileDefaultName = `diagnostics-v54-report-${Date.now()}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            log('success', '📊 Relatório V54 exportado');
        },
        
        // Informações
        getLogs: function() {
            return [...state.logs];
        },
        
        getState: function() {
            return { 
                ...state, 
                config: CONFIG,
                elements: {
                    container: !!elements.container,
                    tabs: !!elements.tabs,
                    content: !!elements.content,
                    logsContainer: !!elements.logsContainer
                }
            };
        },
        
        // Funções auxiliares diretas
        forceReloadProperties: forceReloadProperties,
        showSystemInfo: showSystemInfo,
        checkConflicts: checkConflicts,
        testAllButtons: testAllButtons,
        disableOtherDiagnostics: disableOtherDiagnostics
    };
    
    // ========== INICIALIZAÇÃO AUTOMÁTICA ÚNICA ==========
    if (CONFIG.autoStart) {
        document.addEventListener('DOMContentLoaded', function() {
            // Verificar se deve iniciar automaticamente
            const shouldStart = window.location.search.includes('diagnostics=true') ||
                              localStorage.getItem('diagnostics_auto') === 'true';
            
            if (shouldStart) {
                setTimeout(() => {
                    log('info', `🚀 Sistema de diagnóstico ${CONFIG.namespace} v${CONFIG.version} inicializado`);
                    
                    // Aguardar um pouco mais para garantir que tudo carregou
                    setTimeout(() => {
                        // Criar e mostrar UI
                        window[CONFIG.namespace].show();
                        
                        // Executar verificação inicial
                        setTimeout(() => {
                            verifyModules();
                            analyzePerformance();
                            checkConflicts();
                        }, 1500);
                    }, 1000);
                }, 2000);
            } else {
                log('info', `🔧 Sistema ${CONFIG.namespace} v${CONFIG.version} carregado (modo standby)`);
            }
        });
    }
    
    // ========== HOTKEY PARA ABRIR ==========
    document.addEventListener('keydown', function(e) {
        // Ctrl+Shift+D para abrir diagnóstico
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            e.preventDefault();
            window[CONFIG.namespace].toggle();
            log('info', '⌨️ Hotkey Ctrl+Shift+D acionada');
        }
        
        // Ctrl+Shift+T para executar todos os testes
        if (e.ctrlKey && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            window[CONFIG.namespace].runAllTests();
            log('info', '⌨️ Hotkey Ctrl+Shift+T acionada');
        }
    });
    
    // ========== INICIALIZAÇÃO FINAL ==========
    log('info', `🔧 ${CONFIG.namespace} v${CONFIG.version} carregado`);
    console.log(`🎛️ ${CONFIG.namespace}: Use "${CONFIG.namespace}.show()" para abrir o painel`);
    console.log(`🎛️ ${CONFIG.namespace}: Use "${CONFIG.namespace}.runAllTests()" para executar todos os testes`);
    console.log(`🎛️ ${CONFIG.namespace}: Hotkeys: Ctrl+Shift+D (abrir), Ctrl+Shift+T (testar)`);
    
})();            
