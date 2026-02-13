// ============================================================
// debug/diagnostics/diagnostics54.js - ESTRUTURA MODULAR E ORGANIZADA
// ============================================================
// Versão: 5.4.1 - ATUALIZADO PARA TRABALHAR EM CADEIA COM VERSÕES MAIS RECENTES
// Data: 13/02/2026
// Modificação: Desativa interface visual se diagnostics60+ estiver presente
// ============================================================

/* ================== CONFIGURAÇÕES GLOBAIS ================== */
console.log('🚀 diagnostics54.js - Sistema modular organizado v5.4.1');

// ================== CONSTANTES E FLAGS ==================
const DIAG_CONFIG = {
    MAX_TESTS_PER_PANEL: 25,
    MAX_PANELS_PER_FILE: 4,
    CURRENT_PANEL_COUNT: 0,
    PANEL_CAPACITY_WARNING: 80,
    VERSION: '5.4.1',
    BASE_URL: 'https://rclessa25-hub.github.io/imoveis-maceio/',
    DEBUG_PARAMS: ['debug', 'diagnostics', 'mobiletest', 'refcheck', 'pdfdebug']
};

// ================== DETECÇÃO DE VERSÕES MAIS RECENTES ==================
function hasNewerDiagnostics() {
    // Verifica se existe diagnostics60 ou superior
    const hasV60 = typeof window.DiagnosticsSystem60 !== 'undefined' || 
                   typeof window.DiagnosticsV60 !== 'undefined' ||
                   document.querySelector('script[src*="diagnostics60.js"]') !== null;
    
    const hasV61 = typeof window.DiagnosticsSystem61 !== 'undefined' || 
                   typeof window.DiagnosticsV61 !== 'undefined' ||
                   document.querySelector('script[src*="diagnostics61.js"]') !== null;
    
    const hasV62 = typeof window.DiagnosticsSystem62 !== 'undefined' || 
                   typeof window.DiagnosticsV62 !== 'undefined' ||
                   document.querySelector('script[src*="diagnostics62.js"]') !== null;
    
    return hasV60 || hasV61 || hasV62;
}

// Flag global para controle de interface
const NEWER_DIAGNOSTICS_EXISTS = hasNewerDiagnostics();

if (NEWER_DIAGNOSTICS_EXISTS) {
    console.log('🔧 diagnostics54.js: Detectada versão mais recente - Modo SERVIÇO ativado');
    console.log('📊 Fornecendo APIs apenas, interface visual desativada');
}

// ================== GERENCIADOR DE PAINÉIS ==================
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
        // Apenas log, sem alerta visual se houver versão mais recente
        if (!NEWER_DIAGNOSTICS_EXISTS) {
            console.warn(`⚠️ PAINEL "${panelName}" ESTÁ ${Math.round(capacity)}% OCUPADO`);
            console.warn(`📊 Considere criar um novo arquivo diagnostics55.js para mais testes`);
        }
    }
};

// ================== PAINEL A: DIAGNÓSTICO PDF ==================
const PdfDiagnosticsPanel = {
    name: 'PDF Diagnostics',
    description: 'Testes e diagnósticos do sistema PDF',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('📄 Inicializando Painel de Diagnóstico PDF');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        this.addTest('testPdfSystem', window.testPdfSystem, 'Teste completo do sistema PDF');
        this.addTest('interactivePdfTest', window.interactivePdfTest, 'Teste interativo do sistema PDF');
        this.addTest('diagnosePdfIconProblem', window.diagnosePdfIconProblem, 'Diagnóstico do problema do ícone PDF');
        this.addTest('runPdfCompatibilityCheck', window.runPdfCompatibilityCheck, 'Verificação de compatibilidade PDF');
        
        console.log(`✅ Painel PDF: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: function(name, func, description) {
        if (this.getTestCount() >= this.maxTests) {
            console.error(`❌ Limite de ${this.maxTests} testes atingido para o painel PDF`);
            return false;
        }
        
        if (!PanelManager.panels[this.name]) {
            PanelManager.panels[this.name] = {
                functions: [],
                testCount: 0
            };
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
                const result = test.func ? test.func() : null;
                results.details.push({
                    test: test.name,
                    description: test.description,
                    result: result,
                    status: 'success',
                    timestamp: new Date().toISOString()
                });
                results.passed++;
            } catch (error) {
                console.error(`❌ Teste falhou: ${test.name}`, error);
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
        
        console.log(`✅ Passou: ${results.passed} | ❌ Falhou: ${results.failed}`);
        console.groupEnd();
        return results;
    },
    
    // NOVO: Método para obter estatísticas (para consumo por módulos mais recentes)
    getStatistics: function() {
        return {
            testCount: this.getTestCount(),
            maxTests: this.maxTests,
            capacity: Math.round((this.getTestCount() / this.maxTests) * 100),
            lastRun: PanelManager.panels[this.name]?.lastUsed || null
        };
    }
};

// ================== PAINEL B: MIGRAÇÃO E COMPATIBILIDADE ==================
const MigrationCompatibilityPanel = {
    name: 'Migration & Compatibility',
    description: 'Testes de migração e compatibilidade do sistema',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('🚀 Inicializando Painel de Migração e Compatibilidade');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        this.addTest('verifyMediaMigration', window.verifyMediaMigration, 'Verificação da migração de mídia');
        this.addTest('testModuleCompatibility', window.testModuleCompatibility, 'Teste de compatibilidade de módulos');
        this.addTest('analyzePlaceholders', window.analyzePlaceholders, 'Análise de arquivos placeholder');
        this.addTest('autoValidateMigration', window.autoValidateMigration, 'Validação automática de migração');
        
        console.log(`✅ Painel Migração: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: function(name, func, description) {
        if (this.getTestCount() >= this.maxTests) {
            console.error(`❌ Limite de ${this.maxTests} testes atingido para o painel Migração`);
            return false;
        }
        
        if (!PanelManager.panels[this.name]) {
            PanelManager.panels[this.name] = {
                functions: [],
                testCount: 0
            };
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
        console.group(`🧪 EXECUTANDO TODOS OS TESTES DO PAINEL MIGRAÇÃO (${tests.length} testes)`);
        
        const results = {
            passed: 0,
            failed: 0,
            details: []
        };
        
        tests.forEach((test, index) => {
            try {
                console.log(`🔍 Executando teste ${index + 1}: ${test.description}`);
                const result = test.func ? test.func() : null;
                results.details.push({
                    test: test.name,
                    description: test.description,
                    result: result,
                    status: 'success',
                    timestamp: new Date().toISOString()
                });
                results.passed++;
            } catch (error) {
                console.error(`❌ Teste falhou: ${test.name}`, error);
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
        
        console.log(`✅ Passou: ${results.passed} | ❌ Falhou: ${results.failed}`);
        console.groupEnd();
        return results;
    },
    
    // NOVO: Método para obter estatísticas
    getStatistics: function() {
        return {
            testCount: this.getTestCount(),
            maxTests: this.maxTests,
            capacity: Math.round((this.getTestCount() / this.maxTests) * 100),
            lastRun: PanelManager.panels[this.name]?.lastUsed || null
        };
    }
};

// ================== PAINEL C: REFERÊNCIAS E 404s ==================
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
        this.addTest('analyzeBrokenReferences', window.analyzeBrokenReferences, 'Análise de referências quebradas');
        this.addTest('runDeepReferenceAnalysis', this.runDeepReferenceAnalysis.bind(this), 'Análise profunda de referências');
        
        console.log(`✅ Painel Referências: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: function(name, func, description) {
        if (this.getTestCount() >= this.maxTests) {
            console.error(`❌ Limite de ${this.maxTests} testes atingido para o painel Referências`);
            return false;
        }
        
        if (!PanelManager.panels[this.name]) {
            PanelManager.panels[this.name] = {
                functions: [],
                testCount: 0
            };
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
    
    runDeepReferenceAnalysis: function() {
        console.group('🔍 ANÁLISE PROFUNDA DE REFERÊNCIAS');
        
        const results = {
            scripts: [],
            stylesheets: [],
            images: [],
            broken: []
        };
        
        const scripts = document.querySelectorAll('script[src]');
        scripts.forEach(script => {
            results.scripts.push({
                src: script.src,
                integrity: script.integrity ? '✓' : '✗',
                async: script.async,
                defer: script.defer
            });
        });
        
        const styles = document.querySelectorAll('link[rel="stylesheet"]');
        styles.forEach(style => {
            results.stylesheets.push({
                href: style.href,
                media: style.media || 'all'
            });
        });
        
        const images = document.querySelectorAll('.property-image img, .hero img');
        images.forEach(img => {
            results.images.push({
                src: img.src,
                alt: img.alt || 'sem alt',
                complete: img.complete
            });
        });
        
        console.log(`📦 Scripts: ${results.scripts.length}`);
        console.log(`🎨 CSS: ${results.stylesheets.length}`);
        console.log(`🖼️ Imagens: ${results.images.length}`);
        
        console.groupEnd();
        return results;
    },
    
    runAllTests: function() {
        const tests = PanelManager.panels[this.name]?.functions || [];
        console.group(`🧪 EXECUTANDO TODOS OS TESTES DO PAINEL REFERÊNCIAS (${tests.length} testes)`);
        
        const results = {
            passed: 0,
            failed: 0,
            details: []
        };
        
        tests.forEach((test, index) => {
            try {
                console.log(`🔍 Executando teste ${index + 1}: ${test.description}`);
                const result = typeof test.func === 'function' ? test.func() : null;
                results.details.push({
                    test: test.name,
                    description: test.description,
                    result: result,
                    status: 'success',
                    timestamp: new Date().toISOString()
                });
                results.passed++;
            } catch (error) {
                console.error(`❌ Teste falhou: ${test.name}`, error);
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
        
        console.log(`✅ Passou: ${results.passed} | ❌ Falhou: ${results.failed}`);
        console.groupEnd();
        return results;
    },
    
    // NOVO: Método para obter estatísticas
    getStatistics: function() {
        return {
            testCount: this.getTestCount(),
            maxTests: this.maxTests,
            capacity: Math.round((this.getTestCount() / this.maxTests) * 100),
            lastRun: PanelManager.panels[this.name]?.lastUsed || null
        };
    }
};

// ================== PAINEL D: SISTEMA E PERFORMANCE ==================
const SystemPerformancePanel = {
    name: 'System & Performance',
    description: 'Testes do sistema e análise de performance',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('⚙️ Inicializando Painel do Sistema e Performance');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        this.addTest('analyzeSystem', this.analyzeSystem.bind(this), 'Análise completa do sistema');
        this.addTest('diagnosePdfModalMobile', window.diagnosePdfModalMobile, 'Diagnóstico mobile do modal PDF');
        
        console.log(`✅ Painel Sistema: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: function(name, func, description) {
        if (this.getTestCount() >= this.maxTests) {
            console.error(`❌ Limite de ${this.maxTests} testes atingido para o painel Sistema`);
            return false;
        }
        
        if (!PanelManager.panels[this.name]) {
            PanelManager.panels[this.name] = {
                functions: [],
                testCount: 0
            };
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
    
    analyzeSystem: function() {
        console.group('🔧 ANÁLISE COMPLETA DO SISTEMA');
        
        const results = {
            properties: {
                exists: !!window.properties,
                count: window.properties?.length || 0,
                isArray: Array.isArray(window.properties)
            },
            supabase: {
                clientExists: !!window.supabaseClient,
                constantsDefined: !!(window.SUPABASE_CONSTANTS?.URL && window.SUPABASE_CONSTANTS?.KEY)
            },
            mediaSystem: {
                exists: !!window.MediaSystem,
                initialized: !!window.MediaSystem?.state
            },
            pdfSystem: {
                exists: !!window.PdfSystem,
                initialized: !!window.PdfSystem?.init
            },
            sharedCore: {
                exists: !!window.SharedCore,
                priceFormatter: !!window.SharedCore?.PriceFormatter
            },
            localStorage: {
                unifiedKey: !!localStorage.getItem('properties'),
                oldKey: !!localStorage.getItem('weberlessa_properties')
            }
        };
        
        console.table(results);
        console.groupEnd();
        return results;
    },
    
    runAllTests: function() {
        const tests = PanelManager.panels[this.name]?.functions || [];
        console.group(`🧪 EXECUTANDO TODOS OS TESTES DO PAINEL SISTEMA (${tests.length} testes)`);
        
        const results = {
            passed: 0,
            failed: 0,
            details: []
        };
        
        tests.forEach((test, index) => {
            try {
                console.log(`🔍 Executando teste ${index + 1}: ${test.description}`);
                const result = typeof test.func === 'function' ? test.func() : null;
                results.details.push({
                    test: test.name,
                    description: test.description,
                    result: result,
                    status: 'success',
                    timestamp: new Date().toISOString()
                });
                results.passed++;
            } catch (error) {
                console.error(`❌ Teste falhou: ${test.name}`, error);
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
        
        console.log(`✅ Passou: ${results.passed} | ❌ Falhou: ${results.failed}`);
        console.groupEnd();
        return results;
    },
    
    // NOVO: Método para obter estatísticas
    getStatistics: function() {
        return {
            testCount: this.getTestCount(),
            maxTests: this.maxTests,
            capacity: Math.round((this.getTestCount() / this.maxTests) * 100),
            lastRun: PanelManager.panels[this.name]?.lastUsed || null
        };
    }
};

// ================== SISTEMA DE JANELAS MÚLTIPLAS (APENAS SE FOR O MAIS RECENTE) ==================
const WindowManager = {
    windows: [],
    
    createNewWindow: function(panelGroup) {
        // Se houver versão mais recente, não cria janelas
        if (NEWER_DIAGNOSTICS_EXISTS) {
            console.log('ℹ️ diagnostics54.js: Interface desativada - Use diagnostics61.js para visualização');
            return null;
        }
        
        const windowId = `diagnostics-window-${Date.now()}`;
        const offset = this.windows.length * 30;
        
        const newWindow = {
            id: windowId,
            panelGroup,
            minimized: false,
            position: { x: 50 + offset, y: 50 + offset },
            size: { width: 800, height: 600 }
        };
        
        this.windows.push(newWindow);
        this.renderWindow(newWindow);
        
        return newWindow;
    },
    
    renderWindow: function(windowConfig) {
        // Não renderiza se houver versão mais recente
        if (NEWER_DIAGNOSTICS_EXISTS) return;
        
        const existing = document.getElementById(windowConfig.id);
        if (existing) existing.remove();
        
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
            display: ${windowConfig.minimized ? 'none' : 'flex'};
            flex-direction: column;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            resize: both;
        `;
        
        windowElement.innerHTML = `
            <div style="
                background: #111;
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #00ff9c;
                cursor: move;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: bold; color: #00ff9c; font-size: 14px;">
                        📊 ${windowConfig.panelGroup}
                    </span>
                    <span style="color: #888; font-size: 11px;">
                        v${DIAG_CONFIG.VERSION}
                    </span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="WindowManager.minimizeWindow('${windowConfig.id}')" 
                            style="background: #333; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        _
                    </button>
                    <button onclick="WindowManager.closeWindow('${windowConfig.id}')" 
                            style="background: #d33; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        ×
                    </button>
                </div>
            </div>
            <div id="${windowConfig.id}-content" style="
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #0f0f0f;
                color: #e0e0e0;
            ">
                ${this.generateWindowContent(windowConfig.panelGroup)}
            </div>
        `;
        
        document.body.appendChild(windowElement);
        this.makeDraggable(windowElement);
        this.loadWindowContent(windowConfig.id, windowConfig.panelGroup);
    },
    
    generateWindowContent: function(panelGroup) {
        switch(panelGroup) {
            case 'PDF Diagnostics':
                return this.generatePdfPanelContent();
            case 'Migration & Compatibility':
                return this.generateMigrationPanelContent();
            case 'References & 404 Analysis':
                return this.generateReferencesPanelContent();
            case 'System & Performance':
                return this.generateSystemPanelContent();
            default:
                return '<div style="color: #ff6b6b;">❌ Painel não reconhecido</div>';
        }
    },
    
    generatePdfPanelContent: function() {
        const panel = PanelManager.panels['PDF Diagnostics'];
        const testCount = panel?.testCount || 0;
        
        return `
            <h3 style="color: #00aaff; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">📄</span>
                <span>DIAGNÓSTICO DO SISTEMA PDF</span>
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 25px;">
                <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 6px;">
                    <div style="color: #8899aa; font-size: 11px;">TESTES REGISTRADOS</div>
                    <div style="font-size: 24px; font-weight: bold; color: #00aaff;">${testCount}</div>
                    <div style="color: #8899aa; font-size: 11px;">de ${DIAG_CONFIG.MAX_TESTS_PER_PANEL}</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 6px;">
                    <div style="color: #8899aa; font-size: 11px;">STATUS</div>
                    <div style="font-size: 16px; font-weight: bold; color: ${window.PdfSystem ? '#00ff9c' : '#ff6b6b'};">
                        ${window.PdfSystem ? '✅ ATIVO' : '❌ INDISPONÍVEL'}
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #e0e0e0; margin: 0 0 12px 0; border-bottom: 1px solid #334; padding-bottom: 8px;">
                    🧪 TESTES DISPONÍVEIS
                </h4>
                <div style="display: grid; gap: 10px;">
                    <button onclick="window.testPdfSystem ? window.testPdfSystem() : alert('Função não disponível')" 
                            style="background: #1a2639; color: white; border: 1px solid #00aaff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        🔍 Teste Básico do Sistema PDF
                    </button>
                    <button onclick="window.interactivePdfTest ? window.interactivePdfTest() : alert('Função não disponível')" 
                            style="background: #1a2639; color: white; border: 1px solid #00aaff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        🎮 Teste Interativo PDF
                    </button>
                    <button onclick="PdfDiagnosticsPanel.runAllTests()" 
                            style="background: #00aaff; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                        🚀 EXECUTAR TODOS OS TESTES
                    </button>
                </div>
            </div>
        `;
    },
    
    generateMigrationPanelContent: function() {
        const panel = PanelManager.panels['Migration & Compatibility'];
        const testCount = panel?.testCount || 0;
        
        return `
            <h3 style="color: #ff00ff; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🚀</span>
                <span>MIGRAÇÃO & COMPATIBILIDADE</span>
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 25px;">
                <div style="background: rgba(255, 0, 255, 0.1); padding: 15px; border-radius: 6px;">
                    <div style="color: #8899aa; font-size: 11px;">TESTES REGISTRADOS</div>
                    <div style="font-size: 24px; font-weight: bold; color: #ff00ff;">${testCount}</div>
                    <div style="color: #8899aa; font-size: 11px;">de ${DIAG_CONFIG.MAX_TESTS_PER_PANEL}</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 6px;">
                    <div style="color: #8899aa; font-size: 11px;">CHAVE UNIFICADA</div>
                    <div style="font-size: 16px; font-weight: bold; color: ${localStorage.getItem('properties') ? '#00ff9c' : '#ff6b6b'};">
                        ${localStorage.getItem('properties') ? '✅ ATIVA' : '❌ AUSENTE'}
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #e0e0e0; margin: 0 0 12px 0; border-bottom: 1px solid #334; padding-bottom: 8px;">
                    🧪 TESTES DISPONÍVEIS
                </h4>
                <div style="display: grid; gap: 10px;">
                    <button onclick="window.verifyMediaMigration ? window.verifyMediaMigration() : alert('Função não disponível')" 
                            style="background: #1a2639; color: white; border: 1px solid #ff00ff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        📸 Verificar Migração de Mídia
                    </button>
                    <button onclick="MigrationCompatibilityPanel.runAllTests()" 
                            style="background: #ff00ff; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                        🚀 EXECUTAR TODOS OS TESTES
                    </button>
                </div>
            </div>
        `;
    },
    
    generateReferencesPanelContent: function() {
        const panel = PanelManager.panels['References & 404 Analysis'];
        const testCount = panel?.testCount || 0;
        
        return `
            <h3 style="color: #ff8800; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">🔗</span>
                <span>REFERÊNCIAS & 404s</span>
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 25px;">
                <div style="background: rgba(255, 136, 0, 0.1); padding: 15px; border-radius: 6px;">
                    <div style="color: #8899aa; font-size: 11px;">TESTES REGISTRADOS</div>
                    <div style="font-size: 24px; font-weight: bold; color: #ff8800;">${testCount}</div>
                    <div style="color: #8899aa; font-size: 11px;">de ${DIAG_CONFIG.MAX_TESTS_PER_PANEL}</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 6px;">
                    <div style="color: #8899aa; font-size: 11px;">SCRIPTS</div>
                    <div style="font-size: 16px; font-weight: bold; color: #00ff9c;">
                        ${document.querySelectorAll('script[src]').length}
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #e0e0e0; margin: 0 0 12px 0; border-bottom: 1px solid #334; padding-bottom: 8px;">
                    🧪 TESTES DISPONÍVEIS
                </h4>
                <div style="display: grid; gap: 10px;">
                    <button onclick="ReferencesAnalysisPanel.runDeepReferenceAnalysis()" 
                            style="background: #1a2639; color: white; border: 1px solid #ff8800; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        📊 Análise Profunda de Referências
                    </button>
                    <button onclick="ReferencesAnalysisPanel.runAllTests()" 
                            style="background: #ff8800; color: black; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                        🚀 EXECUTAR TODOS OS TESTES
                    </button>
                </div>
            </div>
        `;
    },
    
    generateSystemPanelContent: function() {
        const panel = PanelManager.panels['System & Performance'];
        const testCount = panel?.testCount || 0;
        
        return `
            <h3 style="color: #00ff9c; margin: 0 0 20px 0; display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">⚙️</span>
                <span>SISTEMA & PERFORMANCE</span>
            </h3>
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 25px;">
                <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px;">
                    <div style="color: #8899aa; font-size: 11px;">TESTES REGISTRADOS</div>
                    <div style="font-size: 24px; font-weight: bold; color: #00ff9c;">${testCount}</div>
                    <div style="color: #8899aa; font-size: 11px;">de ${DIAG_CONFIG.MAX_TESTS_PER_PANEL}</div>
                </div>
                <div style="background: rgba(255, 255, 255, 0.05); padding: 15px; border-radius: 6px;">
                    <div style="color: #8899aa; font-size: 11px;">IMÓVEIS</div>
                    <div style="font-size: 16px; font-weight: bold; color: ${window.properties?.length > 0 ? '#00ff9c' : '#ff6b6b'};">
                        ${window.properties?.length || 0}
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #e0e0e0; margin: 0 0 12px 0; border-bottom: 1px solid #334; padding-bottom: 8px;">
                    🧪 TESTES DISPONÍVEIS
                </h4>
                <div style="display: grid; gap: 10px;">
                    <button onclick="SystemPerformancePanel.analyzeSystem()" 
                            style="background: #1a2639; color: white; border: 1px solid #00ff9c; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        🔧 Análise Completa do Sistema
                    </button>
                    <button onclick="SystemPerformancePanel.runAllTests()" 
                            style="background: #00ff9c; color: black; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                        🚀 EXECUTAR TODOS OS TESTES
                    </button>
                </div>
            </div>
        `;
    },
    
    makeDraggable: function(element) {
        let isDragging = false;
        let offsetX, offsetY;
        
        const header = element.querySelector('div:first-child');
        if (!header) return;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'default';
        });
    },
    
    minimizeWindow: function(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (window) {
            window.minimized = !window.minimized;
            const element = document.getElementById(windowId);
            if (element) {
                element.style.display = window.minimized ? 'none' : 'flex';
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
        const contentDiv = document.getElementById(`${windowId}-content`);
        if (!contentDiv) return;
        
        // O conteúdo já foi definido no renderWindow
    }
};

// ================== INTERFACE DE CONTROLE PRINCIPAL (APENAS SE FOR O MAIS RECENTE) ==================
function createMainControlPanel() {
    // Se houver versão mais recente, não cria painel de controle
    if (NEWER_DIAGNOSTICS_EXISTS) {
        console.log('ℹ️ diagnostics54.js: Painel de controle desativado - Use diagnostics61.js');
        return null;
    }
    
    const existing = document.getElementById('diagnostics-control-panel');
    if (existing) existing.remove();
    
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
        max-width: 400px;
        box-shadow: 0 0 20px rgba(0, 255, 156, 0.3);
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    const totalPanels = DIAG_CONFIG.CURRENT_PANEL_COUNT;
    const capacityPercent = Math.round((totalPanels / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100);
    
    controlPanel.innerHTML = `
        <div style="font-weight: bold; color: #00ff9c; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 20px;">🎛️</span>
                <span>CONTROLE DE DIAGNÓSTICOS v${DIAG_CONFIG.VERSION}</span>
            </div>
            <button onclick="this.closest('#diagnostics-control-panel').style.display='none'" 
                    style="background: #555; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer;">×</button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">STATUS DO SISTEMA</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="text-align: center; background: #111; padding: 8px; border-radius: 4px;">
                    <div style="color: #888; font-size: 10px;">PAINÉIS</div>
                    <div style="color: #00ff9c; font-size: 18px; font-weight: bold;">${DIAG_CONFIG.CURRENT_PANEL_COUNT}/${DIAG_CONFIG.MAX_PANELS_PER_FILE}</div>
                </div>
                <div style="text-align: center; background: #111; padding: 8px; border-radius: 4px;">
                    <div style="color: #888; font-size: 10px;">CAPACIDADE</div>
                    <div style="color: ${capacityPercent >= 80 ? '#ff8800' : '#00ff9c'}; font-size: 18px; font-weight: bold;">${capacityPercent}%</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">ABRIR PAINÉIS</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button onclick="WindowManager.createNewWindow('PDF Diagnostics')" 
                        style="background: #001a2a; color: #00aaff; border: 1px solid #00aaff; padding: 10px; border-radius: 4px; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">📄</span> Diagnóstico PDF
                </button>
                <button onclick="WindowManager.createNewWindow('Migration & Compatibility')" 
                        style="background: #1a002a; color: #ff00ff; border: 1px solid #ff00ff; padding: 10px; border-radius: 4px; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🚀</span> Migração & Compatibilidade
                </button>
                <button onclick="WindowManager.createNewWindow('References & 404 Analysis')" 
                        style="background: #1a1a00; color: #ff8800; border: 1px solid #ff8800; padding: 10px; border-radius: 4px; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">🔗</span> Referências & 404s
                </button>
                <button onclick="WindowManager.createNewWindow('System & Performance')" 
                        style="background: #001a1a; color: #00ff9c; border: 1px solid #00ff9c; padding: 10px; border-radius: 4px; cursor: pointer; text-align: left; display: flex; align-items: center; gap: 8px;">
                    <span style="font-size: 16px;">⚙️</span> Sistema & Performance
                </button>
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">GERENCIAMENTO</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <button onclick="exportSystemReport()" 
                        style="background: #333; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                    📊 Exportar Relatório
                </button>
                <button onclick="showCapacityReport()" 
                        style="background: #ff8800; color: black; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                    📈 Ver Capacidade
                </button>
                <button onclick="closeAllWindows()" 
                        style="background: #555; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                    ❌ Fechar Todas
                </button>
                <button onclick="minimizeAllWindows()" 
                        style="background: #555; color: white; border: none; padding: 8px; border-radius: 4px; cursor: pointer;">
                    🪟 Minimizar Todas
                </button>
            </div>
        </div>
        
        <div style="color: #888; font-size: 10px; text-align: center; border-top: 1px solid #333; padding-top: 10px;">
            ${DIAG_CONFIG.CURRENT_PANEL_COUNT >= DIAG_CONFIG.MAX_PANELS_PER_FILE ? 
              '⚠️ Limite de painéis atingido - Crie diagnostics55.js' : 
              `✅ Espaço disponível para ${DIAG_CONFIG.MAX_PANELS_PER_FILE - DIAG_CONFIG.CURRENT_PANEL_COUNT} painel(is)`}
        </div>
    `;
    
    document.body.appendChild(controlPanel);
    return controlPanel;
}

// ================== FUNÇÕES UTILITÁRIAS (SEMPRE ATIVAS) ==================
function exportSystemReport() {
    console.group('📊 EXPORTANDO RELATÓRIO DO SISTEMA');
    
    const report = {
        timestamp: new Date().toISOString(),
        version: DIAG_CONFIG.VERSION,
        panels: PanelManager.panels,
        capacity: {
            currentPanels: DIAG_CONFIG.CURRENT_PANEL_COUNT,
            maxPanels: DIAG_CONFIG.MAX_PANELS_PER_FILE,
            percentage: Math.round((DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)
        },
        windows: WindowManager.windows.map(w => ({
            id: w.id,
            panelGroup: w.panelGroup,
            minimized: w.minimized
        })),
        system: {
            properties: window.properties?.length || 0,
            pdfSystem: !!window.PdfSystem,
            mediaSystem: !!window.MediaSystem,
            sharedCore: !!window.SharedCore,
            supportLoaded: window.supportModulesLoaded || false,
            url: window.location.href
        },
        recommendations: []
    };
    
    if (report.capacity.percentage >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
        report.recommendations.push({
            type: 'capacity',
            message: `Criar diagnostics55.js - Capacidade ${report.capacity.percentage}%`,
            priority: 'high'
        });
    }
    
    if (localStorage.getItem('weberlessa_properties')) {
        report.recommendations.push({
            type: 'migration',
            message: 'Chave antiga detectada - Executar window.unifyLocalStorageKeys()',
            priority: 'medium'
        });
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostics-system-report-v${DIAG_CONFIG.VERSION}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ Relatório do sistema exportado');
    console.groupEnd();
    
    return report;
}

function showCapacityReport() {
    console.group('📊 RELATÓRIO DE CAPACIDADE DO SISTEMA');
    console.log(`Versão: ${DIAG_CONFIG.VERSION}`);
    console.log(`Painéis ativos: ${DIAG_CONFIG.CURRENT_PANEL_COUNT}/${DIAG_CONFIG.MAX_PANELS_PER_FILE}`);
    console.log(`Capacidade total: ${Math.round((DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)}%`);
    console.log('');
    
    Object.keys(PanelManager.panels).forEach(panelName => {
        const panel = PanelManager.panels[panelName];
        const capacityPercent = Math.round((panel.testCount / DIAG_CONFIG.MAX_TESTS_PER_PANEL) * 100);
        
        console.log(`📋 ${panelName}:`);
        console.log(`   Testes: ${panel.testCount}/${DIAG_CONFIG.MAX_TESTS_PER_PANEL}`);
        console.log(`   Capacidade: ${capacityPercent}%`);
        console.log(`   Último uso: ${panel.lastUsed.split('T')[0]} ${panel.lastUsed.split('T')[1].split('.')[0]}`);
        
        if (capacityPercent >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
            console.warn(`   ⚠️ Painel próximo da capacidade máxima`);
        }
    });
    
    if (DIAG_CONFIG.CURRENT_PANEL_COUNT >= DIAG_CONFIG.MAX_PANELS_PER_FILE) {
        console.warn('🚨 LIMITE DE PAINÉIS POR ARQUIVO ATINGIDO!');
        console.warn('💡 Recomendação: Crie um novo arquivo diagnostics55.js');
        console.warn(`🔗 URL: ${DIAG_CONFIG.BASE_URL}?debug=true&diagnostics=true&window=2`);
    }
    
    console.groupEnd();
}

function closeAllWindows() {
    WindowManager.windows.forEach(window => {
        const element = document.getElementById(window.id);
        if (element) element.remove();
    });
    WindowManager.windows = [];
    console.log('❌ Todas as janelas fechadas');
}

function minimizeAllWindows() {
    WindowManager.windows.forEach(window => {
        window.minimized = true;
        const element = document.getElementById(window.id);
        if (element) {
            element.style.display = 'none';
        }
    });
    console.log('🪟 Todas as janelas minimizadas');
}

// ================== INICIALIZAÇÃO DO SISTEMA ==================
function initializeDiagnosticsSystem() {
    console.log(`🚀 INICIALIZANDO SISTEMA DE DIAGNÓSTICOS v${DIAG_CONFIG.VERSION}`);
    console.log(`📡 URL: ${window.location.href}`);
    
    // Inicializar todos os painéis (sempre ativos)
    PdfDiagnosticsPanel.initialize();
    MigrationCompatibilityPanel.initialize();
    ReferencesAnalysisPanel.initialize();
    SystemPerformancePanel.initialize();
    
    // Criar painel de controle principal (apenas se for o mais recente)
    if (!NEWER_DIAGNOSTICS_EXISTS) {
        createMainControlPanel();
    }
    
    // NOVA API UNIFICADA PARA CONSUMO POR MÓDULOS MAIS RECENTES
    window.DiagnosticsV54 = {
        version: DIAG_CONFIG.VERSION,
        panels: {
            pdf: PdfDiagnosticsPanel,
            migration: MigrationCompatibilityPanel,
            references: ReferencesAnalysisPanel,
            system: SystemPerformancePanel
        },
        manager: PanelManager,
        utils: {
            exportReport: exportSystemReport,
            showCapacity: showCapacityReport
        },
        // Métodos para obter estatísticas consolidadas
        getSystemMetrics: function() {
            return {
                properties: window.properties?.length || 0,
                pdfSystem: !!window.PdfSystem,
                mediaSystem: !!window.MediaSystem,
                sharedCore: !!window.SharedCore,
                loadingManager: !!window.LoadingManager,
                filterManager: !!window.FilterManager
            };
        },
        getPanelStatistics: function() {
            return {
                pdf: PdfDiagnosticsPanel.getStatistics(),
                migration: MigrationCompatibilityPanel.getStatistics(),
                references: ReferencesAnalysisPanel.getStatistics(),
                system: SystemPerformancePanel.getStatistics()
            };
        },
        analyzeCoreSystem: function() {
            return SystemPerformancePanel.analyzeSystem();
        },
        analyzePdfSystem: function() {
            return PdfDiagnosticsPanel.runAllTests();
        }
    };
    
    // Manter compatibilidade com versões anteriores
    window.diag = window.diag || {};
    window.diag.v54 = window.DiagnosticsV54;
    
    // Verificar e mostrar alerta de capacidade (apenas se for o mais recente)
    if (!NEWER_DIAGNOSTICS_EXISTS) {
        const totalCapacity = (DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100;
        if (totalCapacity >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
            console.warn(`⚠️ SISTEMA DE DIAGNÓSTICOS ESTÁ ${Math.round(totalCapacity)}% OCUPADO`);
            console.warn('📝 Considere criar diagnostics55.js para novos testes');
        }
    }
    
    console.log('✅ diagnostics54.js inicializado com sucesso!');
    console.log(`📊 Modo: ${NEWER_DIAGNOSTICS_EXISTS ? 'SERVIÇO (API apenas)' : 'INTERFACE COMPLETA'}`);
    console.log('🎮 API disponível em: window.DiagnosticsV54');
}

// ================== EXECUÇÃO AUTOMÁTICA ==================
if (window.location.search.includes('debug=true') && window.location.search.includes('diagnostics=true')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeDiagnosticsSystem, 1500);
        });
    } else {
        setTimeout(initializeDiagnosticsSystem, 1500);
    }
}

// ================== EXPORTAÇÕES GLOBAIS ==================
window.DiagnosticsSystem54 = {
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
    windows: WindowManager,
    isServiceMode: NEWER_DIAGNOSTICS_EXISTS
};

console.log(`✅ diagnostics54.js v${DIAG_CONFIG.VERSION} - Sistema modular carregado`);
console.log(`🔧 Modo: ${NEWER_DIAGNOSTICS_EXISTS ? 'SERVIÇO' : 'COMPLETO'}`);
