// ============================================================
// debug/diagnostics/diagnostics54js. - ESTRUTURA MODULAR E ORGANIZADA
// ============================================================
// Sistema organizado em painéis temáticos com limites de testes
// ============================================================

/* ================== CONFIGURAÇÕES GLOBAIS ================== */
console.log('🚀 diagnostics.js - Sistema modular organizado');

// ================== CONSTANTES E FLAGS ==================
const DIAG_CONFIG = {
    MAX_TESTS_PER_PANEL: 25,
    MAX_PANELS_PER_FILE: 4,
    CURRENT_PANEL_COUNT: 0,
    PANEL_CAPACITY_WARNING: 80, // % de ocupação para alerta
    VERSION: '5.4',
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
        
        // Adicionar mais testes conforme necessário (até 25)
        // ... outros testes específicos de PDF
        
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
        this.addTest('verifyMediaMigration', window.verifyMediaMigration, 'Verificação da migração de mídia');
        
        // Função 2: Teste de compatibilidade de módulos
        this.addTest('testModuleCompatibility', window.testModuleCompatibility, 'Teste de compatibilidade de módulos');
        
        // Função 3: Análise de placeholders
        this.addTest('analyzePlaceholders', window.analyzePlaceholders, 'Análise de arquivos placeholder');
        
        // Função 4: Validação automática de migração
        this.addTest('autoValidateMigration', window.autoValidateMigration, 'Validação automática de migração');
        
        // ... outros testes de migração (até 25)
        
        console.log(`✅ Painel Migração: ${this.getTestCount()} testes registrados`);
    },
    
    // ... métodos similares ao painel anterior
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
        this.addTest('analyzeBrokenReferences', window.analyzeBrokenReferences, 'Análise de referências quebradas');
        
        // Função 2: Análise profunda de referências
        this.addTest('runDeepReferenceAnalysis', runDeepReferenceAnalysis, 'Análise profunda de referências');
        
        // ... outros testes de referências (até 25)
        
        console.log(`✅ Painel Referências: ${this.getTestCount()} testes registrados`);
    },
    
    // ... métodos similares
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
        this.addTest('analyzeSystem', analyzeSystem, 'Análise completa do sistema');
        
        // Função 2: Diagnóstico mobile PDF
        this.addTest('diagnosePdfModalMobile', window.diagnosePdfModalMobile, 'Diagnóstico mobile do modal PDF');
        
        // ... outros testes de sistema (até 25)
        
        console.log(`✅ Painel Sistema: ${this.getTestCount()} testes registrados`);
    },
    
    // ... métodos similares
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
            position: { x: 100, y: 100 },
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
                <button onclick="window.testPdfSystem()" style="background: #0088cc; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔍 Teste Básico PDF
                </button>
                <button onclick="window.interactivePdfTest()" style="background: #0066aa; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🎮 Teste Interativo
                </button>
                <button onclick="window.diagnosePdfIconProblem()" style="background: #ff5500; color: white; padding: 10px; border: none; border-radius: 4px; cursor: pointer;">
                    🔧 Diagnóstico Ícone
                </button>
            </div>
            <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 6px;">
                <h4 style="color: #00aaff;">📊 Estatísticas do Painel</h4>
                <div>Testes registrados: ${PdfDiagnosticsPanel.getTestCount()}/${PdfDiagnosticsPanel.maxTests}</div>
                <div>Capacidade: ${Math.round((PdfDiagnosticsPanel.getTestCount() / PdfDiagnosticsPanel.maxTests) * 100)}%</div>
            </div>
        `;
    },
    
    // ... métodos similares para outros painéis
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
            <button onclick="document.getElementById('diagnostics-control-panel').style.display='none'" 
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
    
    // Inicializar todos os painéis
    PdfDiagnosticsPanel.initialize();
    MigrationCompatibilityPanel.initialize();
    ReferencesAnalysisPanel.initialize();
    SystemPerformancePanel.initialize();
    
    // Criar painel de controle principal
    createMainControlPanel();
    
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
        
        // Criar botão para novo arquivo
        const newFileBtn = document.createElement('button');
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
    
    console.log('✅ Sistema de diagnósticos inicializado com sucesso!');
    console.log('🎮 Use window.diag para acessar todas as funcionalidades');
}

// ================== EXECUÇÃO AUTOMÁTICA ==================
if (location.search.includes('debug=true') && location.search.includes('diagnostics=true')) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeDiagnosticsSystem, 1500);
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

console.log(`✅ diagnostics.js v${DIAG_CONFIG.VERSION} - Sistema modular carregado`);
