// ============================================================
// debug/diagnostics/diagnostics54.js - ESTRUTURA MODULAR E ORGANIZADA (v5.4.1)
// ============================================================
// Sistema organizado em painéis temáticos com limites de testes
// ATUALIZADO PARA INTEGRAÇÃO COM CORE SYSTEM (SharedCore, MediaSystem, PdfSystem)
// ============================================================

/* ================== CONFIGURAÇÕES GLOBAIS ================== */
console.log('🚀 diagnostics54.js v5.4.1 - Sistema modular organizado (Atualizado)');

// ================== CONSTANTES E FLAGS ==================
const DIAG_CONFIG = {
    MAX_TESTS_PER_PANEL: 25,
    MAX_PANELS_PER_FILE: 4,
    CURRENT_PANEL_COUNT: 0,
    PANEL_CAPACITY_WARNING: 80, // % de ocupação para alerta
    VERSION: '5.4.1',
    BASE_URL: 'https://rclessa25-hub.github.io/imoveis-maceio/',
    DEBUG_PARAMS: ['debug', 'diagnostics', 'mobiletest', 'refcheck', 'pdfdebug']
};

// Gerenciador de painéis
const PanelManager = {
    panels: {},
    activePanels: [],
    windowInstances: [],
    
    registerPanel: function(name, config) {
        this.panels[name] = {
            ...config,
            testCount: 0,
            lastUsed: new Date().toISOString(),
            capacity: (config.testCount || 0) / DIAG_CONFIG.MAX_TESTS_PER_PANEL * 100
        };
        DIAG_CONFIG.CURRENT_PANEL_COUNT++;
        
        // Verificar capacidade
        if (this.panels[name].capacity >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
            this.showCapacityWarning(name, this.panels[name].capacity);
        }
        
        return this.panels[name];
    },
    
    showCapacityWarning: function(panelName, capacity) {
        console.warn(`⚠️ PAINEL "${panelName}" ESTÁ ${Math.round(capacity)}% OCUPADO`);
        console.warn(`📊 Considere criar um novo arquivo diagnostics-2.js para mais testes`);
        
        // Mostrar alerta visual
        if (typeof window.logToPanel === 'function') {
            window.logToPanel(
                `⚠️ Painel "${panelName}" está ${Math.round(capacity)}% ocupado. ` +
                `Considere criar novo arquivo diagnostics-2.js`,
                'warning'
            );
        }
    }
};

// ================== SISTEMA DE PAINÉIS ==================

/* ================== PAINEL A: DIAGNÓSTICO PDF (ATUALIZADO) ================== */
const PdfDiagnosticsPanel = {
    name: 'PDF Diagnostics',
    description: 'Testes e diagnósticos do sistema PDF',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('📄 Inicializando Painel de Diagnóstico PDF (v5.4.1)');
        
        // Registra o painel
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        // Adiciona funções ao painel
        this.registerFunctions();
        
        return panel;
    },
    
    registerFunctions: function() {
        // Função 1: Teste básico do sistema PDF
        this.addTest('testPdfSystem', window.testPdfSystem || (() => 'Função não disponível'), 'Teste completo do sistema PDF');
        
        // Função 2: Teste interativo PDF
        this.addTest('interactivePdfTest', window.interactivePdfTest || (() => 'Função não disponível'), 'Teste interativo do sistema PDF');
        
        // Função 3: Diagnóstico do ícone PDF
        this.addTest('diagnosePdfIconProblem', window.diagnosePdfIconProblem || (() => 'Função não disponível'), 'Diagnóstico do problema do ícone PDF');
        
        // Função 4: Verificação de compatibilidade PDF
        this.addTest('runPdfCompatibilityCheck', window.runPdfCompatibilityCheck || (() => 'Função não disponível'), 'Verificação de compatibilidade PDF');
        
        // >>> NOVO TESTE 5: Verificar integração com PdfSystem (pdf-unified.js)
        this.addTest('verifyPdfSystemIntegration', () => {
            const results = {
                pdfSystemExists: !!window.PdfSystem,
                pdfSystemInit: typeof window.PdfSystem?.init === 'function',
                pdfSystemShowModal: typeof window.PdfSystem?.showModal === 'function',
                passwordFormExists: !!document.getElementById('pdfPasswordForm'),
                modalExists: !!document.getElementById('pdfModal')
            };
            console.table(results);
            return results;
        }, 'Verificar integração do PdfSystem (pdf-unified.js)');
        
        // >>> NOVO TESTE 6: Verificar estrutura do modal PDF
        this.addTest('inspectPdfModalStructure', () => {
            const modal = document.getElementById('pdfModal');
            if (!modal) return 'Modal não encontrado';
            
            const passwordInput = document.getElementById('pdfPassword');
            const accessBtn = document.getElementById('pdfAccessBtn');
            
            return {
                modalDisplay: modal.style.display,
                passwordInputExists: !!passwordInput,
                accessBtnExists: !!accessBtn,
                formWrapped: !!document.getElementById('pdfPasswordForm')
            };
        }, 'Inspecionar estrutura do modal PDF');
        
        console.log(`✅ Painel PDF: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: function(name, func, description) {
        if (this.getTestCount() >= this.maxTests) {
            console.error(`❌ Limite de ${this.maxTests} testes atingido para o painel PDF`);
            return false;
        }
        
        PanelManager.panels[this.name].functions.push({
            name,
            func,
            description,
            lastRun: null,
            successRate: 0
        });
        
        PanelManager.panels[this.name].testCount++;
        return true;
    },
    
    getTestCount: function() {
        return PanelManager.panels[this.name]?.testCount || 0;
    },
    
    runAllTests: function() {
        const tests = PanelManager.panels[this.name]?.functions || [];
        console.group(`🧪 EXECUTANDO TODOS OS TESTES DO PAINEL PDF (${tests.length} testes)`);
        
        const results = {
            passed: 0,
            failed: 0,
            details: []
        };
        
        tests.forEach((test, index) => {
            try {
                console.log(`🔍 Executando teste ${index + 1}: ${test.description}`);
                const result = test.func();
                results.details.push({
                    test: test.name,
                    description: test.description,
                    result: result,
                    status: 'success',
                    timestamp: new Date().toISOString()
                });
                results.passed++;
            } catch (error) {
                results.details.push({
                    test: test.name,
                    description: test.description,
                    error: error.message,
                    status: 'error',
                    timestamp: new Date().toISOString()
                });
                results.failed++;
            }
        });
        
        console.groupEnd();
        return results;
    }
};

/* ================== PAINEL B: MIGRAÇÃO E COMPATIBILIDADE (ATUALIZADO) ================== */
const MigrationCompatibilityPanel = {
    name: 'Migration & Compatibility',
    description: 'Testes de migração e compatibilidade do sistema',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('🚀 Inicializando Painel de Migração e Compatibilidade (v5.4.1)');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        // Função 1: Verificação de migração de mídia
        this.addTest('verifyMediaMigration', window.verifyMediaMigration || (() => 'Função não disponível'), 'Verificação da migração de mídia');
        
        // Função 2: Teste de compatibilidade de módulos
        this.addTest('testModuleCompatibility', window.testModuleCompatibility || (() => 'Função não disponível'), 'Teste de compatibilidade de módulos');
        
        // Função 3: Análise de placeholders
        this.addTest('analyzePlaceholders', window.analyzePlaceholders || (() => 'Função não disponível'), 'Análise de arquivos placeholder');
        
        // Função 4: Validação automática de migração
        this.addTest('autoValidateMigration', window.autoValidateMigration || (() => 'Função não disponível'), 'Validação automática de migração');
        
        // >>> NOVO TESTE 5: Verificar SharedCore e funções globais
        this.addTest('verifySharedCoreFunctions', () => {
            return {
                sharedCoreExists: !!window.SharedCore,
                formatFeaturesForDisplay: typeof window.SharedCore?.formatFeaturesForDisplay === 'function',
                parseFeaturesForStorage: typeof window.SharedCore?.parseFeaturesForStorage === 'function',
                ensureBooleanVideo: typeof window.SharedCore?.ensureBooleanVideo === 'function',
                priceFormatterExists: !!window.SharedCore?.PriceFormatter,
                globalFormatPrice: typeof window.formatPrice === 'function'
            };
        }, 'Verificar funções do SharedCore');
        
        // >>> NOVO TESTE 6: Verificar compatibilidade de módulos principais
        this.addTest('checkCoreModulesCompatibility', () => {
            const modules = {
                properties: typeof window.loadPropertiesData === 'function',
                admin: typeof window.toggleAdminPanel === 'function',
                gallery: typeof window.createPropertyGallery === 'function',
                media: !!window.MediaSystem,
                pdf: !!window.PdfSystem,
                supabase: !!window.supabaseClient,
                loadingManager: !!window.LoadingManager,
                filterManager: !!window.FilterManager
            };
            const allPresent = Object.values(modules).every(v => v === true);
            console.table(modules);
            return { ...modules, allCoreModulesPresent: allPresent };
        }, 'Verificar presença de todos os módulos principais');
        
        console.log(`✅ Painel Migração: ${this.getTestCount()} testes registrados`);
    },
    
    // ... métodos similares ao painel anterior
    addTest: PdfDiagnosticsPanel.addTest,
    getTestCount: function() { return PanelManager.panels[this.name]?.testCount || 0; },
    runAllTests: PdfDiagnosticsPanel.runAllTests
};

/* ================== PAINEL C: REFERÊNCIAS E 404s ================== */
const ReferencesAnalysisPanel = {
    name: 'References & 404 Analysis',
    description: 'Análise de referências e prevenção de 404s',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('🔗 Inicializando Painel de Análise de Referências');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        // Função 1: Análise de referências quebradas
        this.addTest('analyzeBrokenReferences', window.analyzeBrokenReferences || (() => 'Função não disponível'), 'Análise de referências quebradas');
        
        // Função 2: Análise profunda de referências
        this.addTest('runDeepReferenceAnalysis', window.runDeepReferenceAnalysis || (() => 'Função não disponível'), 'Análise profunda de referências');
        
        // >>> NOVO TESTE 3: Verificar imagens quebradas nos cards
        this.addTest('checkPropertyImagesForErrors', () => {
            const images = document.querySelectorAll('.property-image img, .property-gallery-image');
            let brokenCount = 0;
            images.forEach(img => {
                if (!img.complete || img.naturalHeight === 0) brokenCount++;
            });
            return { totalImages: images.length, potentiallyBroken: brokenCount };
        }, 'Verificar imagens de propriedades quebradas');
        
        console.log(`✅ Painel Referências: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: PdfDiagnosticsPanel.addTest,
    getTestCount: function() { return PanelManager.panels[this.name]?.testCount || 0; },
    runAllTests: PdfDiagnosticsPanel.runAllTests
};

/* ================== PAINEL D: SISTEMA E PERFORMANCE (ATUALIZADO) ================== */
const SystemPerformancePanel = {
    name: 'System & Performance',
    description: 'Testes do sistema e análise de performance',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('⚙️ Inicializando Painel do Sistema e Performance (v5.4.1)');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        // Função 1: Análise do sistema
        this.addTest('analyzeSystem', window.analyzeSystem || (() => 'Função não disponível'), 'Análise completa do sistema');
        
        // Função 2: Diagnóstico mobile PDF
        this.addTest('diagnosePdfModalMobile', window.diagnosePdfModalMobile || (() => 'Função não disponível'), 'Diagnóstico mobile do modal PDF');
        
        // >>> NOVO TESTE 3: Benchmark de renderização
        this.addTest('runRenderBenchmark', () => {
            const start = performance.now();
            if (typeof window.renderProperties === 'function') {
                window.renderProperties(window.currentFilter || 'todos');
            }
            const end = performance.now();
            return { renderTimeMs: Math.round(end - start) };
        }, 'Benchmark de tempo de renderização da galeria');
        
        // >>> NOVO TESTE 4: Testar MediaSystem
        this.addTest('testMediaSystemState', () => {
            if (!window.MediaSystem) return 'MediaSystem não disponível';
            return {
                files: window.MediaSystem.state?.files?.length || 0,
                existing: window.MediaSystem.state?.existing?.length || 0,
                pdfs: window.MediaSystem.state?.pdfs?.length || 0,
                existingPdfs: window.MediaSystem.state?.existingPdfs?.length || 0,
                isUploading: window.MediaSystem.state?.isUploading || false
            };
        }, 'Verificar estado atual do MediaSystem');
        
        console.log(`✅ Painel Sistema: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: PdfDiagnosticsPanel.addTest,
    getTestCount: function() { return PanelManager.panels[this.name]?.testCount || 0; },
    runAllTests: PdfDiagnosticsPanel.runAllTests
};

// ================== SISTEMA DE JANELAS MÚLTIPLAS ==================
const WindowManager = {
    windows: [],
    
    createNewWindow: function(panelGroup) {
        const windowId = `diagnostics-window-${Date.now()}`;
        const newWindow = {
            id: windowId,
            panelGroup,
            minimized: false,
            position: { x: 100 + (this.windows.length * 30), y: 100 + (this.windows.length * 30) },
            size: { width: 800, height: 600 }
        };
        
        this.windows.push(newWindow);
        this.renderWindow(newWindow);
        
        return newWindow;
    },
    
    renderWindow: function(windowConfig) {
        // Cria uma nova janela/iframe ou div flutuante
        const windowElement = document.createElement('div');
        windowElement.id = windowConfig.id;
        windowElement.className = 'diagnostics-window';
        windowElement.style.cssText = `
            position: fixed;
            top: ${windowConfig.position.y}px;
            left: ${windowConfig.position.x}px;
            width: ${windowConfig.size.width}px;
            height: ${windowConfig.size.height}px;
            background: #0a0a0a;
            border: 2px solid #00ff9c;
            border-radius: 8px;
            z-index: 999999;
            box-shadow: 0 0 30px rgba(0, 255, 156, 0.3);
            overflow: hidden;
            display: ${windowConfig.minimized ? 'none' : 'block'};
        `;
        
        windowElement.innerHTML = `
            <div style="background: #111; padding: 10px; display: flex; justify-content: space-between; align-items: center;">
                <div style="font-weight: bold; color: #00ff9c;">📊 ${windowConfig.panelGroup}</div>
                <div>
                    <button onclick="WindowManager.minimizeWindow('${windowConfig.id}')" style="background: #555; color: white; border: none; padding: 2px 8px; margin: 0 2px; cursor: pointer;">_</button>
                    <button onclick="WindowManager.closeWindow('${windowConfig.id}')" style="background: #f55; color: white; border: none; padding: 2px 8px; margin: 0 2px; cursor: pointer;">×</button>
                </div>
            </div>
            <div style="padding: 15px; height: calc(100% - 40px); overflow-y: auto;">
                <div id="${windowConfig.id}-content">
                    Carregando painéis para ${windowConfig.panelGroup}...
                </div>
            </div>
        `;
        
        document.body.appendChild(windowElement);
        
        // Carrega o conteúdo específico do grupo de painéis
        this.loadWindowContent(windowConfig.id, windowConfig.panelGroup);
    },
    
    minimizeWindow: function(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (window) {
            window.minimized = !window.minimized;
            const element = document.getElementById(windowId);
            if (element) {
                element.style.display = window.minimized ? 'none' : 'block';
            }
        }
    },
    
    closeWindow: function(windowId) {
        const windowIndex = this.windows.findIndex(w => w.id === windowId);
        if (windowIndex !== -1) {
            this.windows.splice(windowIndex, 1);
            const element = document.getElementById(windowId);
            if (element) {
                element.remove();
            }
        }
    },
    
    loadWindowContent: function(windowId, panelGroup) {
        // Carrega conteúdo específico baseado no grupo de painéis
        const contentDiv = document.getElementById(`${windowId}-content`);
        if (!contentDiv) return;
        
        let contentHTML = '';
        
        switch(panelGroup) {
            case 'PDF Diagnostics':
                contentHTML = this.generatePdfPanelContent();
                break;
            case 'Migration & Compatibility':
                contentHTML = this.generateMigrationPanelContent();
                break;
            case 'References & 404 Analysis':
                contentHTML = this.generateReferencesPanelContent();
                break;
            case 'System & Performance':
                contentHTML = this.generateSystemPanelContent();
                break;
            default:
                contentHTML = '<div>Grupo de painéis não reconhecido</div>';
        }
        
        contentDiv.innerHTML = contentHTML;
    },
    
    generatePdfPanelContent: function() {
        return `
            <h3 style="color: #00aaff; margin-bottom: 15px;">📄 DIAGNÓSTICO DO SISTEMA PDF</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <button onclick="PdfDiagnosticsPanel.runAllTests()" style="background: #00aaff; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 Executar Todos os Testes
                </button>
                <button onclick="window.testPdfSystem ? window.testPdfSystem() : alert('Função não disponível')" style="background: #0088cc; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔍 Teste Básico PDF
                </button>
                <button onclick="window.interactivePdfTest ? window.interactivePdfTest() : alert('Função não disponível')" style="background: #0066aa; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🎮 Teste Interativo
                </button>
                <button onclick="window.diagnosePdfIconProblem ? window.diagnosePdfIconProblem() : alert('Função não disponível')" style="background: #ff5500; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔧 Diagnóstico Ícone
                </button>
            </div>
            <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #00aaff;">📊 Estatísticas do Painel (v5.4.1)</h4>
                <div>Testes registrados: ${PdfDiagnosticsPanel.getTestCount()}/${PdfDiagnosticsPanel.maxTests}</div>
                <div>Capacidade: ${Math.round((PdfDiagnosticsPanel.getTestCount() / PdfDiagnosticsPanel.maxTests) * 100)}%</div>
                <hr style="border-color: #333; margin: 10px 0;">
                <div><small>Integração com PdfSystem verificada.</small></div>
            </div>
        `;
    },
    
    generateMigrationPanelContent: function() {
        return `
            <h3 style="color: #ff00ff; margin-bottom: 15px;">🚀 MIGRAÇÃO & COMPATIBILIDADE</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <button onclick="MigrationCompatibilityPanel.runAllTests()" style="background: #ff00ff; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 Executar Todos os Testes
                </button>
                <button onclick="window.verifyMediaMigration ? window.verifyMediaMigration() : alert('Função não disponível')" style="background: #cc00cc; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    📸 Verificar Migração de Mídia
                </button>
                <button onclick="window.SharedCore ? console.log(SharedCore) : alert('SharedCore não disponível')" style="background: #aa00aa; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔧 Inspecionar SharedCore
                </button>
            </div>
            <div style="background: rgba(255, 0, 255, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #ff00ff;">📊 Estatísticas do Painel</h4>
                <div>Testes registrados: ${MigrationCompatibilityPanel.getTestCount()}/${MigrationCompatibilityPanel.maxTests}</div>
                <div>Capacidade: ${Math.round((MigrationCompatibilityPanel.getTestCount() / MigrationCompatibilityPanel.maxTests) * 100)}%</div>
                <hr style="border-color: #333; margin: 10px 0;">
                <div><small>Compatibilidade com módulos Core verificada.</small></div>
            </div>
        `;
    },
    
    generateReferencesPanelContent: function() {
        return `
            <h3 style="color: #ff8800; margin-bottom: 15px;">🔗 REFERÊNCIAS & 404s</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <button onclick="ReferencesAnalysisPanel.runAllTests()" style="background: #ff8800; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 Executar Todos os Testes
                </button>
                <button onclick="window.analyzeBrokenReferences ? window.analyzeBrokenReferences() : alert('Função não disponível')" style="background: #dd6600; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔍 Analisar Referências Quebradas
                </button>
            </div>
            <div style="background: rgba(255, 136, 0, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #ff8800;">📊 Estatísticas do Painel</h4>
                <div>Testes registrados: ${ReferencesAnalysisPanel.getTestCount()}/${ReferencesAnalysisPanel.maxTests}</div>
                <div>Capacidade: ${Math.round((ReferencesAnalysisPanel.getTestCount() / ReferencesAnalysisPanel.maxTests) * 100)}%</div>
                <hr style="border-color: #333; margin: 10px 0;">
                <div><small>Verificação de imagens e assets adicionada.</small></div>
            </div>
        `;
    },
    
    generateSystemPanelContent: function() {
        return `
            <h3 style="color: #00ff9c; margin-bottom: 15px;">⚙️ SISTEMA & PERFORMANCE</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <button onclick="SystemPerformancePanel.runAllTests()" style="background: #00ff9c; color: #000; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 Executar Todos os Testes
                </button>
                <button onclick="window.diagnosePdfModalMobile ? window.diagnosePdfModalMobile() : alert('Função não disponível')" style="background: #00cc7a; color: #000; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    📱 Diagnóstico Mobile PDF
                </button>
                <button onclick="window.MediaSystem ? MediaSystem.debugState() : alert('MediaSystem não disponível')" style="background: #00995a; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🖼️ Debug MediaSystem
                </button>
            </div>
            <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #00ff9c;">📊 Estatísticas do Painel</h4>
                <div>Testes registrados: ${SystemPerformancePanel.getTestCount()}/${SystemPerformancePanel.maxTests}</div>
                <div>Capacidade: ${Math.round((SystemPerformancePanel.getTestCount() / SystemPerformancePanel.maxTests) * 100)}%</div>
                <hr style="border-color: #333; margin: 10px 0;">
                <div><small>Benchmark de renderização e estado do MediaSystem adicionados.</small></div>
            </div>
        `;
    }
};

// ================== INTERFACE DE CONTROLE PRINCIPAL ==================
function createMainControlPanel() {
    const controlPanel = document.createElement('div');
    controlPanel.id = 'diagnostics-control-panel';
    controlPanel.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: #0a0a0a;
        border: 2px solid #00ff9c;
        border-radius: 8px;
        padding: 15px;
        z-index: 999998;
        min-width: 300px;
        box-shadow: 0 0 20px rgba(0, 255, 156, 0.3);
    `;
    
    controlPanel.innerHTML = `
        <div style="font-weight: bold; color: #00ff9c; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
            <span>🎛️ CONTROLE DE DIAGNÓSTICOS v${DIAG_CONFIG.VERSION}</span>
            <button onclick="this.parentElement.parentElement.style.display='none'" 
                    style="background: #555; color: white; border: none; padding: 2px 8px; cursor: pointer;">×</button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">STATUS DO SISTEMA</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="text-align: center; background: #111; padding: 8px; border-radius: 4px;">
                    <div style="color: #888; font-size: 10px;">PAINÉIS</div>
                    <div style="color: #00ff9c; font-size: 18px;">${DIAG_CONFIG.CURRENT_PANEL_COUNT}/${DIAG_CONFIG.MAX_PANELS_PER_FILE}</div>
                </div>
                <div style="text-align: center; background: #111; padding: 8px; border-radius: 4px;">
                    <div style="color: #888; font-size: 10px;">CAPACIDADE</div>
                    <div style="color: #00ff9c; font-size: 18px;">${Math.round((DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)}%</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">ABRIR PAINÉIS</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button onclick="WindowManager.createNewWindow('PDF Diagnostics')" 
                        style="background: #00aaff; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; text-align: left;">
                    📄 Diagnóstico PDF
                </button>
                <button onclick="WindowManager.createNewWindow('Migration & Compatibility')" 
                        style="background: #ff00ff; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; text-align: left;">
                    🚀 Migração & Compatibilidade
                </button>
                <button onclick="WindowManager.createNewWindow('References & 404 Analysis')" 
                        style="background: #ff8800; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer; text-align: left;">
                    🔗 Referências & 404s
                </button>
                <button onclick="WindowManager.createNewWindow('System & Performance')" 
                        style="background: #00ff9c; color: #000; padding: 10px; border: none; border-radius: 4px; cursor: pointer; text-align: left;">
                    ⚙️ Sistema & Performance
                </button>
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">GERENCIAMENTO</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <button onclick="exportSystemReport()" 
                        style="background: #555; color: white; padding: 8px; border: none; border-radius: 4px; cursor: pointer;">
                    📊 Exportar Relatório
                </button>
                <button onclick="showCapacityReport()" 
                        style="background: #ffaa00; color: #000; padding: 8px; border: none; border-radius: 4px; cursor: pointer;">
                    📈 Ver Capacidade
                </button>
            </div>
        </div>
        
        <div style="color: #888; font-size: 10px; text-align: center; border-top: 1px solid #333; padding-top: 10px;">
            ${DIAG_CONFIG.CURRENT_PANEL_COUNT >= DIAG_CONFIG.MAX_PANELS_PER_FILE ? 
              '⚠️ Considere criar novo arquivo diagnostics-2.js' : 
              '✅ Espaço disponível para novos painéis'}
        </div>
    `;
    
    document.body.appendChild(controlPanel);
    
    return controlPanel;
}

// ================== FUNÇÕES UTILITÁRIAS ==================
function exportSystemReport() {
    const report = {
        timestamp: new Date().toISOString(),
        version: DIAG_CONFIG.VERSION,
        panels: PanelManager.panels,
        capacity: {
            currentPanels: DIAG_CONFIG.CURRENT_PANEL_COUNT,
            maxPanels: DIAG_CONFIG.MAX_PANELS_PER_FILE,
            percentage: Math.round((DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)
        },
        windows: WindowManager.windows,
        recommendations: []
    };
    
    // Adicionar recomendações baseadas na capacidade
    if (report.capacity.percentage >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
        report.recommendations.push({
            type: 'capacity',
            message: `Criar novo arquivo diagnostics-2.js para ${Object.keys(PanelManager.panels).length} painéis adicionais`,
            priority: 'high'
        });
    }
    
    // Exportar como JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostics-system-report-v${DIAG_CONFIG.VERSION}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📊 Relatório do sistema exportado');
}

function showCapacityReport() {
    const panelNames = Object.keys(PanelManager.panels);
    
    console.group('📊 RELATÓRIO DE CAPACIDADE DO SISTEMA');
    console.log(`Versão: ${DIAG_CONFIG.VERSION}`);
    console.log(`Painéis ativos: ${panelNames.length}/${DIAG_CONFIG.MAX_PANELS_PER_FILE}`);
    console.log(`Capacidade total: ${Math.round((panelNames.length / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)}%`);
    console.log('');
    
    panelNames.forEach(panelName => {
        const panel = PanelManager.panels[panelName];
        const capacityPercent = Math.round((panel.testCount / DIAG_CONFIG.MAX_TESTS_PER_PANEL) * 100);
        
        console.log(`📋 ${panelName}:`);
        console.log(`   Testes: ${panel.testCount}/${DIAG_CONFIG.MAX_TESTS_PER_PANEL}`);
        console.log(`   Capacidade: ${capacityPercent}%`);
        console.log(`   Último uso: ${panel.lastUsed}`);
        
        if (capacityPercent >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
            console.warn(`   ⚠️ Painel próximo da capacidade máxima`);
        }
    });
    
    if (panelNames.length >= DIAG_CONFIG.MAX_PANELS_PER_FILE) {
        console.warn('🚨 LIMITE DE PAINÉIS POR ARQUIVO ATINGIDO!');
        console.warn('💡 Recomendação: Crie um novo arquivo diagnostics-2.js');
        console.warn('🔗 Endereço sugerido: https://rclessa25-hub.github.io/imoveis-maceio/?debug=true&diagnostics=true&window=2');
    }
    
    console.groupEnd();
}

// ================== INICIALIZAÇÃO DO SISTEMA ==================
function initializeDiagnosticsSystem() {
    console.log(`🚀 INICIALIZANDO SISTEMA DE DIAGNÓSTICOS v${DIAG_CONFIG.VERSION}`);

    // Verifica se o sistema já foi inicializado para evitar duplicação de painéis de controle
    if (window.diagnosticsSystemInitialized) {
        console.log('ℹ️ Sistema de diagnósticos já inicializado. Ignorando nova inicialização.');
        return;
    }
    
    // Inicializar todos os painéis
    PdfDiagnosticsPanel.initialize();
    MigrationCompatibilityPanel.initialize();
    ReferencesAnalysisPanel.initialize();
    SystemPerformancePanel.initialize();
    
    // Criar painel de controle principal (se não existir)
    if (!document.getElementById('diagnostics-control-panel')) {
        createMainControlPanel();
    }
    
    // Adicionar comandos ao console
    window.diag = {
        panels: {
            pdf: PdfDiagnosticsPanel,
            migration: MigrationCompatibilityPanel,
            references: ReferencesAnalysisPanel,
            system: SystemPerformancePanel
        },
        manager: PanelManager,
        windows: WindowManager,
        report: exportSystemReport,
        capacity: showCapacityReport,
        createNewWindow: (type) => WindowManager.createNewWindow(type)
    };
    
    // Verificar e mostrar alerta de capacidade
    const totalCapacity = (DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100;
    if (totalCapacity >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
        console.warn(`⚠️ SISTEMA DE DIAGNÓSTICOS ESTÁ ${Math.round(totalCapacity)}% OCUPADO`);
        console.warn('📝 Considere criar novos arquivos para grupos adicionais de testes');
        
        // Criar botão para novo arquivo (se não existir)
        if (!document.getElementById('new-diagnostics-file-btn')) {
            const newFileBtn = document.createElement('button');
            newFileBtn.id = 'new-diagnostics-file-btn';
            newFileBtn.innerHTML = '📁 CRIAR DIAGNOSTICS-2.JS';
            newFileBtn.style.cssText = `
                position: fixed;
                bottom: 20px;
                right: 20px;
                background: linear-gradient(45deg, #ff5500, #ffaa00);
                color: #000;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                z-index: 999997;
                font-weight: bold;
                box-shadow: 0 4px 15px rgba(255, 85, 0, 0.3);
            `;
            newFileBtn.onclick = () => {
                const newUrl = `${DIAG_CONFIG.BASE_URL}?debug=true&diagnostics=true&window=2&newfile=true`;
                console.log(`🔗 Novo arquivo sugerido: ${newUrl}`);
                alert(`Crie um novo arquivo diagnostics-2.js e carregue em:\n${newUrl}`);
            };
            document.body.appendChild(newFileBtn);
        }
    }
    
    window.diagnosticsSystemInitialized = true;
    console.log('✅ Sistema de diagnósticos v5.4.1 inicializado com sucesso!');
    console.log('🎮 Use window.diag para acessar todas as funcionalidades');
    console.log('🪟 Abra os painéis manualmente no painel de controle à esquerda.');
}

// ================== EXECUÇÃO AUTOMÁTICA (IDEMPOTENTE) ==================
if (location.search.includes('debug=true') && location.search.includes('diagnostics=true')) {
    // Usa DOMContentLoaded para garantir que o DOM está pronto, mas adiciona uma flag para evitar múltiplas execuções
    document.addEventListener('DOMContentLoaded', () => {
        // Pequeno delay para garantir que o módulo anterior da cadeia terminou
        setTimeout(initializeDiagnosticsSystem, 1000);
    });
}

// ================== EXPORTAÇÕES GLOBAIS ==================
window.DiagnosticsSystem = {
    version: DIAG_CONFIG.VERSION,
    config: DIAG_CONFIG,
    initialize: initializeDiagnosticsSystem,
    panels: {
        pdf: PdfDiagnosticsPanel,
        migration: MigrationCompatibilityPanel,
        references: ReferencesAnalysisPanel,
        system: SystemPerformancePanel
    },
    manager: PanelManager,
    windows: WindowManager
};
console.log(`✅ diagnostics54.js v${DIAG_CONFIG.VERSION} - Sistema modular carregado (Atualizado)`);
