// ============================================================
// debug/diagnostics/diagnostics54.js - ESTRUTURA MODULAR E ORGANIZADA
// ============================================================
// Sistema organizado em painéis temáticos com limites de testes
// Versão: 5.4.5 - Sistema de Camadas para Múltiplas Janelas
// ============================================================

/* ================== CONFIGURAÇÕES GLOBAIS ================== */
console.log('🚀 diagnostics54.js v5.4.5 - Sistema modular organizado (Sistema de Camadas)');

// ================== CONSTANTES E FLAGS ==================
const DIAG_CONFIG = {
    MAX_TESTS_PER_PANEL: 25,
    MAX_PANELS_PER_FILE: 4,
    CURRENT_PANEL_COUNT: 0,
    PANEL_CAPACITY_WARNING: 80, // % de ocupação para alerta
    VERSION: '5.4.5',
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

/* ================== PAINEL A: DIAGNÓSTICO PDF ================== */
const PdfDiagnosticsPanel = {
    name: 'PDF Diagnostics',
    description: 'Testes e diagnósticos do sistema PDF',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('📄 Inicializando Painel de Diagnóstico PDF');
        
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
        this.addTest('testPdfSystem', window.testPdfSystem, 'Teste completo do sistema PDF');
        
        // Função 2: Teste interativo PDF
        this.addTest('interactivePdfTest', window.interactivePdfTest, 'Teste interativo do sistema PDF');
        
        // Função 3: Diagnóstico do ícone PDF
        this.addTest('diagnosePdfIconProblem', window.diagnosePdfIconProblem, 'Diagnóstico do problema do ícone PDF');
        
        // Função 4: Verificação de compatibilidade PDF
        this.addTest('runPdfCompatibilityCheck', window.runPdfCompatibilityCheck, 'Verificação de compatibilidade PDF');
        
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
                const result = test.func ? test.func() : 'Função não disponível';
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
        
        // Mostrar resultados resumidos
        console.log(`📊 Resultados: ${results.passed} passaram, ${results.failed} falharam`);
        
        return results;
    }
};

/* ================== PAINEL B: MIGRAÇÃO E COMPATIBILIDADE ================== */
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
        // Função 1: Verificação de migração de mídia
        this.addTest('verifyMediaMigration', window.verifyMediaMigration || function() { 
            console.log('⚠️ verifyMediaMigration não disponível');
            return 'Função não implementada';
        }, 'Verificação da migração de mídia');
        
        // Função 2: Teste de compatibilidade de módulos
        this.addTest('testModuleCompatibility', window.testModuleCompatibility || function() {
            console.log('⚠️ testModuleCompatibility não disponível');
            return 'Função não implementada';
        }, 'Teste de compatibilidade de módulos');
        
        // Função 3: Análise de placeholders
        this.addTest('analyzePlaceholders', window.analyzePlaceholders || function() {
            console.log('⚠️ analyzePlaceholders não disponível');
            return 'Função não implementada';
        }, 'Análise de arquivos placeholder');
        
        // Função 4: Validação automática de migração
        this.addTest('autoValidateMigration', window.autoValidateMigration || function() {
            console.log('⚠️ autoValidateMigration não disponível');
            return 'Função não implementada';
        }, 'Validação automática de migração');
        
        console.log(`✅ Painel Migração: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: function(name, func, description) {
        if (this.getTestCount() >= this.maxTests) {
            console.error(`❌ Limite de ${this.maxTests} testes atingido para o painel Migração`);
            return false;
        }
        
        if (!PanelManager.panels[this.name]) {
            PanelManager.panels[this.name] = { functions: [], testCount: 0 };
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
        console.group(`🚀 EXECUTANDO TODOS OS TESTES DE MIGRAÇÃO (${tests.length} testes)`);
        
        const results = {
            passed: 0,
            failed: 0,
            details: []
        };
        
        tests.forEach((test, index) => {
            try {
                console.log(`🔍 Executando teste ${index + 1}: ${test.description}`);
                const result = test.func ? test.func() : 'Função não disponível';
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
        console.log(`📊 Resultados Migração: ${results.passed} passaram, ${results.failed} falharam`);
        
        return results;
    }
};

/* ================== PAINEL C: REFERÊNCIAS E 404s ================== */
const ReferencesAnalysisPanel = {
    name: 'References & 404 Analysis',
    description: 'Análise de referências e prevenção de 404s',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('🔗 Inicializando Painel de Análise de Referências');
        
        // Registrar painel ANTES de adicionar funções
        if (!PanelManager.panels[this.name]) {
            PanelManager.registerPanel(this.name, {
                description: this.description,
                testCount: 0,
                functions: []
            });
        }
        
        this.registerFunctions();
        return PanelManager.panels[this.name];
    },
    
    registerFunctions: function() {
        console.log('🔧 Registrando funções do painel de Referências...');
        
        // Garantir que o array de funções existe
        if (!PanelManager.panels[this.name]) {
            PanelManager.panels[this.name] = { functions: [], testCount: 0 };
        }
        
        // Limpar funções existentes para evitar duplicação
        PanelManager.panels[this.name].functions = [];
        PanelManager.panels[this.name].testCount = 0;
        
        // Função 1: Análise de referências quebradas
        const func1 = function() {
            console.log('🔍 Executando análise de referências quebradas...');
            
            if (window.analyzeBrokenReferences && typeof window.analyzeBrokenReferences === 'function') {
                return window.analyzeBrokenReferences();
            }
            
            // Fallback se a função não existir globalmente
            console.warn('⚠️ analyzeBrokenReferences não disponível globalmente');
            console.log('📊 Executando análise básica de referências...');
            
            const results = {
                totalScripts: document.scripts.length,
                totalLinks: document.links.length,
                brokenLinks: [],
                timestamp: new Date().toISOString()
            };
            
            // Verificação básica de links
            Array.from(document.links).forEach(link => {
                const href = link.href;
                if (href && href.startsWith('http')) {
                    // Marcar para verificação futura
                    console.log(`🔗 Link encontrado: ${href.substring(0, 50)}...`);
                }
            });
            
            return results;
        };
        
        this.addTest(
            'analyzeBrokenReferences', 
            func1,
            'Análise de referências quebradas'
        );
        
        // Função 2: Análise profunda de referências
        const func2 = function() {
            console.log('🔍 Executando análise profunda de referências...');
            
            if (window.runDeepReferenceAnalysis && typeof window.runDeepReferenceAnalysis === 'function') {
                return window.runDeepReferenceAnalysis();
            }
            
            // Fallback
            console.warn('⚠️ runDeepReferenceAnalysis não disponível globalmente');
            
            const deepResults = {
                scripts: Array.from(document.scripts).map(s => ({
                    src: s.src.split('/').pop() || 'inline',
                    type: s.type || 'text/javascript'
                })),
                styles: Array.from(document.styleSheets).map(ss => {
                    try {
                        return { href: ss.href?.split('/').pop() || 'inline', rules: ss.cssRules?.length || 0 };
                    } catch (e) {
                        return { href: 'cross-origin', error: 'Acesso negado' };
                    }
                }),
                images: Array.from(document.images).map(img => ({
                    src: img.src.split('/').pop() || 'sem src',
                    complete: img.complete,
                    naturalDimensions: img.naturalWidth > 0
                })),
                timestamp: new Date().toISOString()
            };
            
            console.log('📊 Análise profunda concluída:', deepResults);
            return deepResults;
        };
        
        this.addTest(
            'runDeepReferenceAnalysis', 
            func2,
            'Análise profunda de referências'
        );
        
        console.log(`✅ Painel Referências: ${this.getTestCount()} testes registrados`);
        console.log('📋 Funções registradas:', PanelManager.panels[this.name].functions.map(f => f.name));
    },
    
    addTest: function(name, func, description) {
        if (this.getTestCount() >= this.maxTests) {
            console.error(`❌ Limite de ${this.maxTests} testes atingido para o painel Referências`);
            return false;
        }
        
        if (!PanelManager.panels[this.name]) {
            PanelManager.panels[this.name] = { functions: [], testCount: 0 };
        }
        
        // Garantir que a função seja armazenada corretamente
        const testFunction = typeof func === 'function' ? func : function() { 
            console.warn(`⚠️ Função ${name} não é uma função válida`);
            return null;
        };
        
        PanelManager.panels[this.name].functions.push({
            name: name,
            func: testFunction,
            description: description,
            lastRun: null,
            successRate: 0
        });
        
        PanelManager.panels[this.name].testCount++;
        console.log(`  ✅ Teste ${this.getTestCount()}: ${name} - ${description}`);
        
        return true;
    },
    
    getTestCount: function() {
        return PanelManager.panels[this.name]?.testCount || 0;
    },
    
    runAllTests: function() {
        console.log(`🔗 Acessando painel: ${this.name}`);
        
        // Garantir que estamos acessando o painel correto
        const panel = PanelManager.panels[this.name];
        
        if (!panel) {
            console.error(`❌ Painel ${this.name} não encontrado no PanelManager`);
            return { passed: 0, failed: 0, error: 'Painel não encontrado' };
        }
        
        const tests = panel.functions || [];
        console.log(`🧪 EXECUTANDO TODOS OS TESTES DE REFERÊNCIAS (${tests.length} testes)`);
        
        if (tests.length === 0) {
            console.warn('⚠️ Nenhum teste registrado no painel');
            console.log('📋 Estado do painel:', panel);
            return { passed: 0, failed: 0, warning: 'Nenhum teste' };
        }
        
        const results = {
            passed: 0,
            failed: 0,
            details: []
        };
        
        tests.forEach((test, index) => {
            try {
                console.log(`\n🔍 Executando teste ${index + 1}: ${test.description}`);
                console.log(`   Função: ${test.name}`);
                
                if (!test.func || typeof test.func !== 'function') {
                    throw new Error(`Função ${test.name} não é válida`);
                }
                
                const result = test.func();
                
                results.details.push({
                    test: test.name,
                    description: test.description,
                    result: result,
                    status: 'success',
                    timestamp: new Date().toISOString()
                });
                results.passed++;
                
                console.log(`   ✅ Teste ${index + 1} concluído com sucesso`);
                
            } catch (error) {
                console.error(`   ❌ Erro no teste ${index + 1}:`, error.message);
                
                results.details.push({
                    test: test.name,
                    description: test.description,
                    error: error.message,
                    stack: error.stack,
                    status: 'error',
                    timestamp: new Date().toISOString()
                });
                results.failed++;
            }
        });
        
        console.log('\n📊 RESULTADOS FINAIS - REFERÊNCIAS:');
        console.log(`   ✅ Passaram: ${results.passed}`);
        console.log(`   ❌ Falharam: ${results.failed}`);
        console.log(`   📋 Total: ${tests.length}`);
        
        if (results.details.length > 0) {
            console.log('📋 Detalhes:', results.details.map(d => ({
                teste: d.test,
                status: d.status,
                descricao: d.description
            })));
        }
        
        return results;
    }
};

/* ================== PAINEL D: SISTEMA E PERFORMANCE ================== */
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
        // Função 1: Análise do sistema
        this.addTest('analyzeSystem', window.analyzeSystem || function() {
            console.log('⚠️ analyzeSystem não disponível');
            return 'Função não implementada';
        }, 'Análise completa do sistema');
        
        // Função 2: Diagnóstico mobile PDF
        this.addTest('diagnosePdfModalMobile', window.diagnosePdfModalMobile || function() {
            console.log('⚠️ diagnosePdfModalMobile não disponível');
            return 'Função não implementada';
        }, 'Diagnóstico mobile do modal PDF');
        
        console.log(`✅ Painel Sistema: ${this.getTestCount()} testes registrados`);
    },
    
    addTest: function(name, func, description) {
        if (this.getTestCount() >= this.maxTests) {
            console.error(`❌ Limite de ${this.maxTests} testes atingido para o painel Sistema`);
            return false;
        }
        if (!PanelManager.panels[this.name]) {
            PanelManager.panels[this.name] = { functions: [], testCount: 0 };
        }
        PanelManager.panels[this.name].functions.push({ name, func, description, lastRun: null, successRate: 0 });
        PanelManager.panels[this.name].testCount++;
        return true;
    },
    
    getTestCount: function() {
        return PanelManager.panels[this.name]?.testCount || 0;
    },
    
    runAllTests: function() {
        const tests = PanelManager.panels[this.name]?.functions || [];
        console.group(`⚙️ EXECUTANDO TODOS OS TESTES DO SISTEMA (${tests.length} testes)`);
        
        const results = {
            passed: 0,
            failed: 0,
            details: []
        };
        
        tests.forEach((test, index) => {
            try {
                console.log(`🔍 Executando teste ${index + 1}: ${test.description}`);
                const result = test.func ? test.func() : 'Função não disponível';
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
        console.log(`📊 Resultados Sistema: ${results.passed} passaram, ${results.failed} falharam`);
        
        return results;
    }
};

// ================== SISTEMA DE JANELAS MÚLTIPLAS COM CAMADAS ==================
const WindowManager = {
    windows: [],
    windowCounter: 0,
    
    createNewWindow: function(panelGroup, parentWindowId = null) {
        this.windowCounter++;
        const windowId = `diagnostics-window-${Date.now()}-${this.windowCounter}`;
        
        // Calcular posição em cascata baseada no pai
        let position = { x: 100, y: 100 };
        let layer = 1; // Camada padrão
        
        if (parentWindowId) {
            const parentWindow = this.windows.find(w => w.id === parentWindowId);
            if (parentWindow) {
                // Filho: posição ligeiramente deslocada do pai
                position = {
                    x: parentWindow.position.x + 30,
                    y: parentWindow.position.y + 30
                };
                layer = parentWindow.layer + 1; // Herda camada +1
                console.log(`👪 Criando janela filha para "${parentWindow.panelGroup}" (camada ${parentWindow.layer} -> ${layer})`);
            }
        } else {
            // Janela principal: posição baseada em quantas janelas existem
            position = { 
                x: 100 + (this.windows.length * 30), 
                y: 100 + (this.windows.length * 30) 
            };
        }
        
        const newWindow = {
            id: windowId,
            panelGroup,
            parentId: parentWindowId,
            layer: layer,
            minimized: false,
            position: position,
            size: { width: 800, height: 600 },
            children: []
        };
        
        // Registrar como filho se tiver pai
        if (parentWindowId) {
            const parent = this.windows.find(w => w.id === parentWindowId);
            if (parent) {
                parent.children.push(windowId);
                console.log(`📌 Janela "${parent.panelGroup}" agora tem ${parent.children.length} filho(s)`);
            }
        }
        
        this.windows.push(newWindow);
        this.renderWindow(newWindow);
        
        return newWindow;
    },
    
    renderWindow: function(windowConfig) {
        const versionNumber = parseInt(DIAG_CONFIG.VERSION.replace(/\./g, ''));
        
        // Cálculo do z-index baseado na camada (layer)
        // Layer 1: 1,000,000 + versão (ex: 1,000,545)
        // Layer 2: 2,000,000 + versão (ex: 2,000,545)
        // Layer 3: 3,000,000 + versão (ex: 3,000,545)
        const baseZIndex = windowConfig.layer * 1000000;
        const windowZIndex = baseZIndex + versionNumber + this.windows.length;
        
        console.log(`📐 diagnostics54.js: Criando janela "${windowConfig.panelGroup}" na camada ${windowConfig.layer} com z-index: ${windowZIndex}`);
        
        const windowElement = document.createElement('div');
        windowElement.id = windowConfig.id;
        windowElement.className = 'diagnostics-window';
        windowElement.setAttribute('data-layer', windowConfig.layer);
        windowElement.setAttribute('data-panel', windowConfig.panelGroup);
        windowElement.style.cssText = `
            position: fixed;
            top: ${windowConfig.position.y}px;
            left: ${windowConfig.position.x}px;
            width: ${windowConfig.size.width}px;
            height: ${windowConfig.size.height}px;
            background: #0a0a0a;
            border: 2px solid ${this.getBorderColor(windowConfig.layer)};
            border-radius: 8px;
            z-index: ${windowZIndex};
            box-shadow: 0 0 30px rgba(0, 170, 255, 0.3);
            overflow: hidden;
            display: ${windowConfig.minimized ? 'none' : 'block'};
        `;
        
        // Criar header com informações da camada
        const layerIndicator = windowConfig.layer > 1 ? ` [Nível ${windowConfig.layer}]` : '';
        
        windowElement.innerHTML = `
            <div style="background: #111; padding: 10px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid ${this.getBorderColor(windowConfig.layer)};">
                <div style="font-weight: bold; color: ${this.getBorderColor(windowConfig.layer)};">
                    📊 ${windowConfig.panelGroup}${layerIndicator}
                </div>
                <div>
                    <button onclick="WindowManager.minimizeWindow('${windowConfig.id}')" 
                            style="background: #555; color: white; border: none; padding: 2px 8px; margin: 0 2px; cursor: pointer; border-radius: 3px;">_</button>
                    <button onclick="WindowManager.closeWindow('${windowConfig.id}')" 
                            style="background: #f55; color: white; border: none; padding: 2px 8px; margin: 0 2px; cursor: pointer; border-radius: 3px;">×</button>
                </div>
            </div>
            <div style="padding: 15px; height: calc(100% - 50px); overflow-y: auto;">
                <div id="${windowConfig.id}-content">
                    Carregando painéis para ${windowConfig.panelGroup}...
                </div>
            </div>
        `;
        
        document.body.appendChild(windowElement);
        
        this.loadWindowContent(windowConfig.id, windowConfig.panelGroup);
    },
    
    getBorderColor: function(layer) {
        const colors = {
            1: '#00aaff', // Azul - painel principal
            2: '#ff00ff', // Rosa - segundo nível
            3: '#ffaa00', // Laranja - terceiro nível
            4: '#00ff9c', // Verde - quarto nível
            5: '#ff5500'  // Vermelho - quinto nível
        };
        return colors[layer] || '#00aaff';
    },
    
    minimizeWindow: function(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (window) {
            window.minimized = !window.minimized;
            const element = document.getElementById(windowId);
            if (element) {
                element.style.display = window.minimized ? 'none' : 'block';
                console.log(`🪟 Janela "${window.panelGroup}" ${window.minimized ? 'minimizada' : 'restaurada'}`);
            }
        }
    },
    
    closeWindow: function(windowId) {
        const windowIndex = this.windows.findIndex(w => w.id === windowId);
        if (windowIndex !== -1) {
            const window = this.windows[windowIndex];
            
            // Fechar também todas as janelas filhas
            if (window.children && window.children.length > 0) {
                console.log(`🧹 Fechando ${window.children.length} janela(s) filha(s) de "${window.panelGroup}"`);
                window.children.forEach(childId => {
                    this.closeWindow(childId);
                });
            }
            
            this.windows.splice(windowIndex, 1);
            const element = document.getElementById(windowId);
            if (element) {
                element.remove();
            }
            
            console.log(`🗑️ Janela "${window.panelGroup}" (nível ${window.layer}) fechada`);
        }
    },
    
    loadWindowContent: function(windowId, panelGroup) {
        const contentDiv = document.getElementById(`${windowId}-content`);
        if (!contentDiv) return;
        
        // Determinar se esta janela tem pai (para saber se deve criar botões que abrem filhos)
        const windowConfig = this.windows.find(w => w.id === windowId);
        const hasParent = windowConfig && windowConfig.parentId !== null;
        
        let contentHTML = '';
        
        switch(panelGroup) {
            case 'PDF Diagnostics':
                contentHTML = this.generatePdfPanelContent(windowId, hasParent);
                break;
            case 'Migration & Compatibility':
                contentHTML = this.generateMigrationPanelContent(windowId, hasParent);
                break;
            case 'References & 404 Analysis':
                contentHTML = this.generateReferencesPanelContent(windowId, hasParent);
                break;
            case 'System & Performance':
                contentHTML = this.generateSystemPanelContent(windowId, hasParent);
                break;
            default:
                contentHTML = '<div>Grupo de painéis não reconhecido</div>';
        }
        
        contentDiv.innerHTML = contentHTML;
    },
    
    generateReferencesPanelContent: function(windowId, hasParent) {
        const deepAnalysisButton = !hasParent ? `
            <div style="margin-bottom: 15px; padding: 10px; background: rgba(255, 170, 0, 0.2); border-radius: 6px; border: 1px solid #ffaa00;">
                <button onclick="WindowManager.createNewWindow('Análise Profunda de Referências', '${windowId}')" 
                        style="background: #ffaa00; color: black; padding: 12px; border: none; border-radius: 4px; cursor: pointer; width: 100%; font-weight: bold;">
                    🔍 ABRIR ANÁLISE PROFUNDA DE REFERÊNCIAS (NÍVEL 3)
                </button>
                <div style="color: #ffaa00; font-size: 11px; margin-top: 5px; text-align: center;">
                    ⚡ Abre uma nova janela com análise detalhada (camada superior)
                </div>
            </div>
        ` : '';
        
        return `
            <h3 style="color: #ff8800; margin-bottom: 15px;">🔗 REFERÊNCIAS & 404s</h3>
            
            ${deepAnalysisButton}
            
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <button onclick="ReferencesAnalysisPanel.runAllTests()" 
                        style="background: #ff8800; color: black; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 Executar Todos os Testes
                </button>
                <button onclick="if(window.analyzeBrokenReferences) window.analyzeBrokenReferences(); else console.warn('analyzeBrokenReferences não disponível')" 
                        style="background: #cc6600; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔍 Analisar Referências
                </button>
            </div>
            
            <div style="background: rgba(255, 136, 0, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #ff8800;">📊 Estatísticas do Painel</h4>
                <div>Testes registrados: ${ReferencesAnalysisPanel.getTestCount()}/${ReferencesAnalysisPanel.maxTests}</div>
                <div>Capacidade: ${Math.round((ReferencesAnalysisPanel.getTestCount() / ReferencesAnalysisPanel.maxTests) * 100)}%</div>
                <div style="color: #888; font-size: 11px; margin-top: 10px;">
                    Camada atual: ${this.windows.find(w => w.id === windowId)?.layer || 1}
                </div>
            </div>
        `;
    },
    
    generatePdfPanelContent: function(windowId, hasParent) {
        return `
            <h3 style="color: #00aaff; margin-bottom: 15px;">📄 DIAGNÓSTICO DO SISTEMA PDF</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <button onclick="PdfDiagnosticsPanel.runAllTests()" style="background: #00aaff; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 Executar Todos os Testes
                </button>
                <button onclick="if(window.testPdfSystem) window.testPdfSystem(); else console.warn('testPdfSystem não disponível')" style="background: #0088cc; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔍 Teste Básico PDF
                </button>
                <button onclick="if(window.interactivePdfTest) window.interactivePdfTest(); else console.warn('interactivePdfTest não disponível')" style="background: #0066aa; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🎮 Teste Interativo
                </button>
                <button onclick="if(window.diagnosePdfIconProblem) window.diagnosePdfIconProblem(); else console.warn('diagnosePdfIconProblem não disponível')" style="background: #ff5500; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔧 Diagnóstico Ícone
                </button>
            </div>
            <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #00aaff;">📊 Estatísticas do Painel</h4>
                <div>Testes registrados: ${PdfDiagnosticsPanel.getTestCount()}/${PdfDiagnosticsPanel.maxTests}</div>
                <div>Capacidade: ${Math.round((PdfDiagnosticsPanel.getTestCount() / PdfDiagnosticsPanel.maxTests) * 100)}%</div>
                <div style="color: #888; font-size: 11px; margin-top: 10px;">
                    Camada atual: ${this.windows.find(w => w.id === windowId)?.layer || 1}
                </div>
            </div>
        `;
    },
    
    generateMigrationPanelContent: function(windowId, hasParent) {
        return `
            <h3 style="color: #ff00ff; margin-bottom: 15px;">🚀 MIGRAÇÃO & COMPATIBILIDADE</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <button onclick="MigrationCompatibilityPanel.runAllTests()" style="background: #ff00ff; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 Executar Todos os Testes
                </button>
                <button onclick="if(window.verifyMediaMigration) window.verifyMediaMigration(); else console.warn('verifyMediaMigration não disponível')" style="background: #cc00cc; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔍 Verificar Migração Mídia
                </button>
                <button onclick="if(window.testModuleCompatibility) window.testModuleCompatibility(); else console.warn('testModuleCompatibility não disponível')" style="background: #990099; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🎮 Testar Compatibilidade
                </button>
            </div>
            <div style="background: rgba(255, 0, 255, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #ff00ff;">📊 Estatísticas do Painel</h4>
                <div>Testes registrados: ${MigrationCompatibilityPanel.getTestCount()}/${MigrationCompatibilityPanel.maxTests}</div>
                <div>Capacidade: ${Math.round((MigrationCompatibilityPanel.getTestCount() / MigrationCompatibilityPanel.maxTests) * 100)}%</div>
                <div style="color: #888; font-size: 11px; margin-top: 10px;">
                    Camada atual: ${this.windows.find(w => w.id === windowId)?.layer || 1}
                </div>
            </div>
        `;
    },
    
    generateSystemPanelContent: function(windowId, hasParent) {
        return `
            <h3 style="color: #00ff9c; margin-bottom: 15px;">⚙️ SISTEMA & PERFORMANCE</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px;">
                <button onclick="SystemPerformancePanel.runAllTests()" style="background: #00ff9c; color: black; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 Executar Todos os Testes
                </button>
                <button onclick="if(window.diagnosePdfModalMobile) window.diagnosePdfModalMobile(); else console.warn('diagnosePdfModalMobile não disponível')" style="background: #00cc7a; color: black; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    📱 Diagnóstico Mobile PDF
                </button>
            </div>
            <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #00ff9c;">📊 Estatísticas do Painel</h4>
                <div>Testes registrados: ${SystemPerformancePanel.getTestCount()}/${SystemPerformancePanel.maxTests}</div>
                <div>Capacidade: ${Math.round((SystemPerformancePanel.getTestCount() / SystemPerformancePanel.maxTests) * 100)}%</div>
                <div style="color: #888; font-size: 11px; margin-top: 10px;">
                    Camada atual: ${this.windows.find(w => w.id === windowId)?.layer || 1}
                </div>
            </div>
        `;
    }
};

// ================== INTERFACE DE CONTROLE PRINCIPAL ==================
function createMainControlPanel() {
    const existingPanels = document.querySelectorAll('[id^="diagnostics-control-panel"]').length;
    const baseLeft = 10 + (existingPanels * 320);
    
    const versionNumber = parseInt(DIAG_CONFIG.VERSION.replace(/\./g, ''));
    const baseZIndex = 999990;
    const calculatedZIndex = baseZIndex + versionNumber;
    
    console.log(`📐 diagnostics54.js: Posicionando painel em left: ${baseLeft}px, z-index: ${calculatedZIndex}`);
    
    const controlPanel = document.createElement('div');
    controlPanel.id = `diagnostics-control-panel-v${DIAG_CONFIG.VERSION.replace('.', '-')}`;
    controlPanel.style.cssText = `
        position: fixed;
        top: 10px;
        left: ${baseLeft}px;
        background: #0a0a0a;
        border: 2px solid #00aaff;
        border-radius: 8px;
        padding: 15px;
        z-index: ${calculatedZIndex};
        min-width: 300px;
        box-shadow: 0 0 20px rgba(0, 170, 255, 0.3);
    `;
    
    controlPanel.innerHTML = `
        <div style="font-weight: bold; color: #00aaff; margin-bottom: 15px; display: flex; justify-content: space-between; align-items: center;">
            <span>🎛️ DIAGNÓSTICOS v${DIAG_CONFIG.VERSION} (Sistema de Camadas)</span>
            <button onclick="this.parentElement.parentElement.style.display='none'" 
                    style="background: #555; color: white; border: none; padding: 2px 8px; cursor: pointer;">×</button>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="color: #888; font-size: 11px; margin-bottom: 5px;">STATUS DO SISTEMA</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
                <div style="text-align: center; background: #111; padding: 8px; border-radius: 4px;">
                    <div style="color: #888; font-size: 10px;">PAINÉIS</div>
                    <div style="color: #00aaff; font-size: 18px;">${DIAG_CONFIG.CURRENT_PANEL_COUNT}/${DIAG_CONFIG.MAX_PANELS_PER_FILE}</div>
                </div>
                <div style="text-align: center; background: #111; padding: 8px; border-radius: 4px;">
                    <div style="color: #888; font-size: 10px;">CAPACIDADE</div>
                    <div style="color: #00aaff; font-size: 18px;">${Math.round((DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)}%</div>
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
                        style="background: #ff8800; color: black; padding: 10px; border: none; border-radius: 4px; cursor: pointer; text-align: left;">
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
        panels: Object.fromEntries(
            Object.entries(PanelManager.panels).map(([key, val]) => [key, { ...val, functions: val.functions.map(f => f.name) }])
        ),
        capacity: {
            currentPanels: DIAG_CONFIG.CURRENT_PANEL_COUNT,
            maxPanels: DIAG_CONFIG.MAX_PANELS_PER_FILE,
            percentage: Math.round((DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)
        },
        windows: WindowManager.windows.map(w => ({
            id: w.id,
            panelGroup: w.panelGroup,
            layer: w.layer,
            parentId: w.parentId,
            children: w.children,
            minimized: w.minimized
        })),
        recommendations: []
    };
    
    if (report.capacity.percentage >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
        report.recommendations.push({
            type: 'capacity',
            message: `Criar novo arquivo diagnostics-2.js para ${Object.keys(PanelManager.panels).length} painéis adicionais`,
            priority: 'high'
        });
    }
    
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
    
    PdfDiagnosticsPanel.initialize();
    MigrationCompatibilityPanel.initialize();
    ReferencesAnalysisPanel.initialize();
    SystemPerformancePanel.initialize();
    
    createMainControlPanel();
    
    window.diag = window.diag || {};
    window.diag.v54 = {
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
        createNewWindow: (type, parentId) => WindowManager.createNewWindow(type, parentId)
    };
    
    const totalCapacity = (DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100;
    if (totalCapacity >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
        console.warn(`⚠️ SISTEMA DE DIAGNÓSTICOS v${DIAG_CONFIG.VERSION} ESTÁ ${Math.round(totalCapacity)}% OCUPADO`);
        console.warn('📝 Considere criar novos arquivos para grupos adicionais de testes');
        
        if (!document.getElementById('new-file-btn-v54')) {
            const newFileBtn = document.createElement('button');
            newFileBtn.id = 'new-file-btn-v54';
            newFileBtn.innerHTML = '📁 CRIAR DIAGNOSTICS-2.JS';
            newFileBtn.style.cssText = `
                position: fixed;
                bottom: 80px;
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
    
    console.log(`✅ Sistema de diagnósticos v${DIAG_CONFIG.VERSION} inicializado com sucesso!`);
    console.log('🎮 Use window.diag.v54 para acessar as funcionalidades desta versão.');
}

// ================== EXECUÇÃO AUTOMÁTICA ==================
if (location.search.includes('debug=true') && location.search.includes('diagnostics=true')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeDiagnosticsSystem, 2000);
        });
    } else {
        setTimeout(initializeDiagnosticsSystem, 2000);
    }
}

// ================== EXPORTAÇÕES GLOBAIS ==================
window.DiagnosticsSystemV54 = {
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
console.log(`✅ diagnostics54.js v${DIAG_CONFIG.VERSION} - Sistema modular carregado (Sistema de Camadas)`);
