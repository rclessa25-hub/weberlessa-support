// ============================================================
// DIAGNOSTICS.JS - VERSÃO ESTRUTURADA 6.0
// ============================================================
// Sistema organizado em painéis modulares com limites operacionais
// Suporte para múltiplos arquivos diagnostics.js
// ============================================================

console.log('🚀 diagnostics.js – ESTRUTURA ORGANIZADA v6.0');

/* ================== CONFIGURAÇÕES GLOBAIS ================== */
const DIAGNOSTICS_CONFIG = {
    VERSION: '6.0',
    MAX_TESTS_PER_PANEL: 10,        // Limite de testes por painel
    MAX_LINES_PER_FILE: 1500,       // Limite de linhas por arquivo
    CURRENT_FILE_OCCUPANCY: 0,      // Será calculado
    ENABLE_AUTO_SCROLL: true,
    ENABLE_MULTI_WINDOW: true,
    MAX_WINDOWS: 5,
    PANEL_TYPES: {
        OVERVIEW: 'overview',
        PERFORMANCE: 'performance',
        COMPATIBILITY: 'compatibility',
        MIGRATION: 'migration',
        SECURITY: 'security',
        PDF: 'pdf',
        MOBILE: 'mobile',
        REFERENCES: 'references',
        PLACEHOLDERS: 'placeholders'
    }
};

/* ================== FLAGS E PARÂMETROS ================== */
const params = new URLSearchParams(location.search);
const FLAGS = {
    DEBUG_MODE: params.get('debug') === 'true' || params.get('debug') === 'pdf',
    DIAGNOSTICS_MODE: params.get('diagnostics') === 'true',
    MOBILE_TEST: params.get('mobiletest') === 'true',
    REFERENCE_CHECK: params.get('refcheck') === 'true',
    PDF_DEBUG: params.get('debug') === 'pdf',
    PERFORMANCE_CHECK: params.get('performance') === 'true',
    SECURITY_CHECK: params.get('security') === 'true',
    ALL_CHECKS: params.get('all') === 'true'
};

/* ================== SISTEMA DE ARMAZENAMENTO ================== */
window.DIAGNOSTICS_STORAGE = {
    activeWindows: [],
    testResults: {},
    panelConfigs: {},
    currentPanel: null,
    
    addWindow: function(windowId) {
        if (this.activeWindows.length < DIAGNOSTICS_CONFIG.MAX_WINDOWS) {
            this.activeWindows.push({
                id: windowId,
                timestamp: new Date().toISOString(),
                minimized: false
            });
            return true;
        }
        return false;
    },
    
    removeWindow: function(windowId) {
        this.activeWindows = this.activeWindows.filter(w => w.id !== windowId);
    },
    
    minimizeWindow: function(windowId) {
        const window = this.activeWindows.find(w => w.id === windowId);
        if (window) window.minimized = true;
    },
    
    restoreWindow: function(windowId) {
        const window = this.activeWindows.find(w => w.id === windowId);
        if (window) window.minimized = false;
    }
};

/* ================== PAINEL BASE (FACTORY) ================== */
class DiagnosticsPanel {
    constructor(config) {
        this.id = config.id || `diagnostics-panel-${Date.now()}`;
        this.title = config.title || 'Diagnóstico';
        this.type = config.type || DIAGNOSTICS_CONFIG.PANEL_TYPES.OVERVIEW;
        this.maxTests = config.maxTests || DIAGNOSTICS_CONFIG.MAX_TESTS_PER_PANEL;
        this.position = config.position || { top: '10px', right: '10px' };
        this.size = config.size || { width: '900px', height: '600px' };
        this.tests = [];
        this.element = null;
        this.isMinimized = false;
        
        DIAGNOSTICS_STORAGE.addWindow(this.id);
    }
    
    create() {
        const panel = document.createElement('div');
        panel.id = this.id;
        panel.className = 'diagnostics-panel';
        panel.style.cssText = `
            position: fixed;
            top: ${this.position.top};
            right: ${this.position.right};
            width: ${this.size.width};
            height: ${this.size.height};
            max-height: 90vh;
            overflow-y: auto;
            background: #0b0b0b;
            color: #00ff9c;
            font-family: 'Consolas', 'Monaco', monospace;
            font-size: 12px;
            padding: 15px;
            border: 2px solid #00ff9c;
            border-radius: 8px;
            z-index: 999999;
            box-shadow: 0 0 30px rgba(0, 255, 156, 0.4);
            resize: both;
            overflow: auto;
        `;
        
        panel.innerHTML = this.generateHTML();
        document.body.appendChild(panel);
        this.element = panel;
        
        this.setupEvents();
        this.updateOccupancyWarning();
        
        return panel;
    }
    
    generateHTML() {
        return `
            <div class="panel-header">
                <div class="panel-title">
                    🚀 ${this.title} - v${DIAGNOSTICS_CONFIG.VERSION}
                </div>
                <div class="panel-controls">
                    <button class="minimize-btn" title="Minimizar">▁</button>
                    <button class="close-btn" title="Fechar">✕</button>
                </div>
            </div>
            
            <div class="panel-status">
                <span class="test-count">Testes: 0/${this.maxTests}</span>
                <span class="occupancy-warning" style="display:none;">⚠️ 85% OCUPADO</span>
            </div>
            
            <div class="panel-tabs">
                ${this.generateTabs()}
            </div>
            
            <div class="panel-content">
                ${this.generateContent()}
            </div>
            
            <div class="panel-footer">
                <div class="status-bar">Status: Inicializando...</div>
                <div class="version">v${DIAGNOSTICS_CONFIG.VERSION}</div>
            </div>
        `;
    }
    
    generateTabs() {
        return Object.values(DIAGNOSTICS_CONFIG.PANEL_TYPES)
            .map(type => 
                `<button class="tab-btn" data-tab="${type}">${this.getTabIcon(type)} ${type.toUpperCase()}</button>`
            ).join('');
    }
    
    getTabIcon(type) {
        const icons = {
            overview: '📈',
            performance: '🚀',
            compatibility: '🔍',
            migration: '🚀',
            security: '🔒',
            pdf: '📄',
            mobile: '📱',
            references: '🔗',
            placeholders: '🗑️'
        };
        return icons[type] || '📊';
    }
    
    generateContent() {
        return Object.values(DIAGNOSTICS_CONFIG.PANEL_TYPES)
            .map(type => 
                `<div id="${type}-content" class="tab-content" style="display: ${type === 'overview' ? 'block' : 'none'}"></div>`
            ).join('');
    }
    
    setupEvents() {
        // Botões de controle
        this.element.querySelector('.minimize-btn').addEventListener('click', () => this.toggleMinimize());
        this.element.querySelector('.close-btn').addEventListener('click', () => this.close());
        
        // Tabs
        this.element.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });
        
        // Drag (simples)
        this.makeDraggable();
    }
    
    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const content = this.element.querySelector('.panel-content');
        const tabs = this.element.querySelector('.panel-tabs');
        
        if (this.isMinimized) {
            content.style.display = 'none';
            tabs.style.display = 'none';
            this.element.style.height = '60px';
            DIAGNOSTICS_STORAGE.minimizeWindow(this.id);
        } else {
            content.style.display = 'block';
            tabs.style.display = 'flex';
            this.element.style.height = this.size.height;
            DIAGNOSTICS_STORAGE.restoreWindow(this.id);
        }
    }
    
    close() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            DIAGNOSTICS_STORAGE.removeWindow(this.id);
        }
    }
    
    switchTab(tabName) {
        // Atualizar botões ativos
        this.element.querySelectorAll('.tab-btn').forEach(btn => {
            btn.style.background = btn.dataset.tab === tabName ? '#333' : 'transparent';
            btn.style.color = btn.dataset.tab === tabName ? '#00ff9c' : '#888';
        });
        
        // Atualizar conteúdo
        this.element.querySelectorAll('.tab-content').forEach(content => {
            content.style.display = content.id === `${tabName}-content` ? 'block' : 'none';
        });
        
        // Carregar conteúdo da tab se necessário
        this.loadTabContent(tabName);
    }
    
    loadTabContent(tabName) {
        const contentDiv = this.element.querySelector(`#${tabName}-content`);
        if (contentDiv && contentDiv.innerHTML === '') {
            switch(tabName) {
                case 'overview':
                    this.loadOverviewContent(contentDiv);
                    break;
                case 'performance':
                    this.loadPerformanceContent(contentDiv);
                    break;
                case 'compatibility':
                    this.loadCompatibilityContent(contentDiv);
                    break;
                case 'pdf':
                    this.loadPdfContent(contentDiv);
                    break;
                // ... outros cases
            }
        }
    }
    
    loadOverviewContent(container) {
        const html = `
            <h3>📊 VISÃO GERAL DO SISTEMA</h3>
            <div class="stats-grid">
                <div class="stat-box">
                    <div class="stat-label">Painéis Ativos</div>
                    <div class="stat-value">${DIAGNOSTICS_STORAGE.activeWindows.length}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Testes Totais</div>
                    <div class="stat-value">${this.tests.length}</div>
                </div>
                <div class="stat-box">
                    <div class="stat-label">Ocupação</div>
                    <div class="stat-value" id="occupancy-percentage">0%</div>
                </div>
            </div>
            
            <div class="quick-actions">
                <h4>⚡ AÇÕES RÁPIDAS</h4>
                <div class="actions-grid">
                    <button class="action-btn" data-action="run-all-tests">🧪 Teste Completo</button>
                    <button class="action-btn" data-action="check-performance">🚀 Performance</button>
                    <button class="action-btn" data-action="check-pdf">📄 Sistema PDF</button>
                    <button class="action-btn" data-action="check-mobile">📱 Mobile</button>
                    <button class="action-btn" data-action="check-references">🔗 Referências</button>
                    <button class="action-btn" data-action="create-new-window">➕ Nova Janela</button>
                </div>
            </div>
        `;
        container.innerHTML = html;
        
        // Adicionar eventos
        container.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action));
        });
    }
    
    handleQuickAction(action) {
        switch(action) {
            case 'run-all-tests':
                this.runAllTests();
                break;
            case 'check-performance':
                this.runPerformanceCheck();
                break;
            case 'check-pdf':
                this.runPdfCheck();
                break;
            case 'create-new-window':
                this.createNewWindow();
                break;
        }
    }
    
    addTest(test) {
        if (this.tests.length >= this.maxTests) {
            console.warn(`⚠️ Limite de ${this.maxTests} testes atingido para o painel ${this.title}`);
            this.showOccupancyWarning();
            return false;
        }
        
        this.tests.push(test);
        this.updateTestCount();
        return true;
    }
    
    updateTestCount() {
        const countElement = this.element.querySelector('.test-count');
        if (countElement) {
            countElement.textContent = `Testes: ${this.tests.length}/${this.maxTests}`;
            
            // Atualizar porcentagem de ocupação
            const occupancy = (this.tests.length / this.maxTests) * 100;
            const occupancyElement = this.element.querySelector('#occupancy-percentage');
            if (occupancyElement) {
                occupancyElement.textContent = `${Math.round(occupancy)}%`;
                occupancyElement.style.color = occupancy > 80 ? '#ff5555' : 
                                              occupancy > 60 ? '#ffaa00' : '#00ff9c';
            }
        }
    }
    
    updateOccupancyWarning() {
        const occupancy = (this.tests.length / this.maxTests) * 100;
        const warningElement = this.element.querySelector('.occupancy-warning');
        
        if (occupancy > 85) {
            warningElement.style.display = 'inline';
            warningElement.style.color = '#ff5555';
            warningElement.textContent = `⚠️ ${Math.round(occupancy)}% OCUPADO - CRIE NOVO ARQUIVO`;
        } else if (occupancy > 70) {
            warningElement.style.display = 'inline';
            warningElement.style.color = '#ffaa00';
            warningElement.textContent = `⚠️ ${Math.round(occupancy)}% OCUPADO`;
        }
    }
    
    showOccupancyWarning() {
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a0000;
            color: #ff5555;
            padding: 20px;
            border: 3px solid #ff5555;
            border-radius: 10px;
            z-index: 1000000;
            text-align: center;
            max-width: 500px;
            box-shadow: 0 0 30px rgba(255, 0, 0, 0.5);
        `;
        
        alertDiv.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 10px;">⚠️ LIMITE DE TESTES ATINGIDO</div>
            <p>O painel <strong>${this.title}</strong> atingiu o limite de ${this.maxTests} testes.</p>
            <div style="margin: 15px 0;">
                <div style="background: #330000; padding: 10px; border-radius: 5px;">
                    Testes atuais: ${this.tests.length}/${this.maxTests}<br>
                    Ocupação: ${Math.round((this.tests.length / this.maxTests) * 100)}%
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button onclick="createNewDiagnosticsWindow('performance')" 
                        style="background: #ff5555; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                    ➕ Criar Novo Painel
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #555; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
                    Fechar
                </button>
            </div>
            <div style="font-size: 11px; color: #ff8888; margin-top: 10px;">
                Recomendação: Crie um novo arquivo diagnostics2.js para novos testes
            </div>
        `;
        
        document.body.appendChild(alertDiv);
    }
    
    makeDraggable() {
        const header = this.element.querySelector('.panel-header');
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.classList.contains('minimize-btn') || 
                e.target.classList.contains('close-btn')) {
                return;
            }
            
            isDragging = true;
            offsetX = e.clientX - this.element.getBoundingClientRect().left;
            offsetY = e.clientY - this.element.getBoundingClientRect().top;
            this.element.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            this.element.style.left = (e.clientX - offsetX) + 'px';
            this.element.style.top = (e.clientY - offsetY) + 'px';
            this.element.style.right = 'auto';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            this.element.style.cursor = 'default';
        });
    }
    
    // Métodos específicos de teste (serão implementados nos painéis especializados)
    runAllTests() { /* Implementação específica do painel */ }
    runPerformanceCheck() { /* Implementação específica do painel */ }
    runPdfCheck() { /* Implementação específica do painel */ }
    createNewWindow() { /* Criar nova janela de diagnóstico */ }
}

/* ================== FÁBRICA DE PAINÉIS ESPECIALIZADOS ================== */
class PanelFactory {
    static createPanel(type, config = {}) {
        const baseConfig = {
            id: `${type}-panel-${Date.now()}`,
            title: this.getPanelTitle(type),
            type: type,
            maxTests: this.getMaxTestsForType(type),
            position: this.getPositionForType(type),
            size: this.getSizeForType(type)
        };
        
        const finalConfig = { ...baseConfig, ...config };
        
        switch(type) {
            case 'performance':
                return new PerformancePanel(finalConfig);
            case 'pdf':
                return new PdfDiagnosticPanel(finalConfig);
            case 'compatibility':
                return new CompatibilityPanel(finalConfig);
            case 'migration':
                return new MigrationPanel(finalConfig);
            case 'security':
                return new SecurityPanel(finalConfig);
            default:
                return new DiagnosticsPanel(finalConfig);
        }
    }
    
    static getPanelTitle(type) {
        const titles = {
            performance: 'ANÁLISE DE PERFORMANCE',
            pdf: 'DIAGNÓSTICO PDF',
            compatibility: 'COMPATIBILIDADE',
            migration: 'MIGRAÇÃO DE SISTEMA',
            security: 'SEGURANÇA',
            mobile: 'TESTES MOBILE',
            references: 'REFERÊNCIAS E 404s',
            placeholders: 'PLACEHOLDERS'
        };
        return titles[type] || 'DIAGNÓSTICO';
    }
    
    static getMaxTestsForType(type) {
        const limits = {
            performance: 8,
            pdf: 6,
            compatibility: 10,
            migration: 7,
            security: 5,
            mobile: 4,
            references: 8,
            placeholders: 6,
            overview: 10
        };
        return limits[type] || DIAGNOSTICS_CONFIG.MAX_TESTS_PER_PANEL;
    }
    
    static getPositionForType(type) {
        // Posicionar painéis em diferentes áreas da tela
        const positions = {
            performance: { top: '10px', right: '10px' },
            pdf: { top: '120px', right: '10px' },
            compatibility: { top: '230px', right: '10px' },
            migration: { top: '10px', right: '920px' },
            security: { top: '120px', right: '920px' }
        };
        return positions[type] || { top: '10px', right: '10px' };
    }
    
    static getSizeForType(type) {
        const sizes = {
            performance: { width: '900px', height: '500px' },
            pdf: { width: '600px', height: '400px' },
            compatibility: { width: '700px', height: '450px' },
            migration: { width: '800px', height: '550px' }
        };
        return sizes[type] || { width: '900px', height: '600px' };
    }
}

/* ================== PAINEL DE PERFORMANCE (EXEMPLO ESPECIALIZADO) ================== */
class PerformancePanel extends DiagnosticsPanel {
    constructor(config) {
        super(config);
        this.performanceTests = [];
        this.metrics = {};
    }
    
    loadPerformanceContent(container) {
        const html = `
            <div class="performance-dashboard">
                <h3>🚀 DASHBOARD DE PERFORMANCE</h3>
                
                <div class="metrics-grid">
                    <div class="metric-card">
                        <div class="metric-label">Carregamento</div>
                        <div class="metric-value" id="load-metric">--</div>
                        <div class="metric-bar">
                            <div class="metric-fill" id="load-bar" style="width: 0%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-label">Scripts</div>
                        <div class="metric-value" id="scripts-metric">--</div>
                        <div class="metric-bar">
                            <div class="metric-fill" id="scripts-bar" style="width: 0%"></div>
                        </div>
                    </div>
                    
                    <div class="metric-card">
                        <div class="metric-label">Memória</div>
                        <div class="metric-value" id="memory-metric">--</div>
                        <div class="metric-bar">
                            <div class="metric-fill" id="memory-bar" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
                
                <div class="performance-tests">
                    <h4>🧪 TESTES DE PERFORMANCE</h4>
                    <div class="tests-list" id="performance-tests-list">
                        <!-- Testes serão adicionados aqui -->
                    </div>
                </div>
                
                <div class="performance-actions">
                    <button class="run-performance-test" data-test="full">🏃 Teste Completo</button>
                    <button class="run-performance-test" data-test="scripts">📜 Análise Scripts</button>
                    <button class="run-performance-test" data-test="memory">🧠 Uso Memória</button>
                    <button class="run-performance-test" data-test="render">🎨 Renderização</button>
                </div>
            </div>
        `;
        container.innerHTML = html;
        
        // Configurar eventos
        container.querySelectorAll('.run-performance-test').forEach(btn => {
            btn.addEventListener('click', (e) => this.runPerformanceTest(e.target.dataset.test));
        });
        
        // Executar análise inicial
        setTimeout(() => this.runInitialAnalysis(), 1000);
    }
    
    runInitialAnalysis() {
        this.addTest({
            id: 'initial-analysis',
            name: 'Análise Inicial de Performance',
            run: () => this.analyzeInitialPerformance()
        });
    }
    
    analyzeInitialPerformance() {
        const results = {
            scripts: document.scripts.length,
            stylesheets: document.styleSheets.length,
            images: document.images.length,
            domSize: document.getElementsByTagName('*').length,
            timestamp: new Date().toISOString()
        };
        
        this.updateMetrics(results);
        return results;
    }
    
    updateMetrics(data) {
        // Atualizar métricas visuais
        const scriptsElement = document.getElementById('scripts-metric');
        const scriptsBar = document.getElementById('scripts-bar');
        
        if (scriptsElement && scriptsBar) {
            const scriptScore = Math.min(100, data.scripts * 5);
            scriptsElement.textContent = data.scripts;
            scriptsBar.style.width = `${scriptScore}%`;
            scriptsBar.style.background = scriptScore > 70 ? '#ff5555' : 
                                         scriptScore > 40 ? '#ffaa00' : '#00ff9c';
        }
    }
    
    runPerformanceTest(testType) {
        const testId = `performance-test-${testType}-${Date.now()}`;
        
        if (!this.addTest({
            id: testId,
            name: `Teste de ${testType}`,
            type: 'performance',
            run: () => this.executePerformanceTest(testType)
        })) {
            return; // Limite atingido
        }
        
        // Executar teste
        const result = this.executePerformanceTest(testType);
        this.displayTestResult(testId, result);
    }
    
    executePerformanceTest(testType) {
        console.log(`🧪 Executando teste de performance: ${testType}`);
        
        switch(testType) {
            case 'full':
                return this.runFullPerformanceTest();
            case 'scripts':
                return this.analyzeScriptPerformance();
            case 'memory':
                return this.analyzeMemoryUsage();
            case 'render':
                return this.analyzeRenderingPerformance();
            default:
                return { error: 'Tipo de teste desconhecido' };
        }
    }
    
    runFullPerformanceTest() {
        const startTime = performance.now();
        
        const tests = [
            this.analyzeScriptPerformance(),
            this.analyzeMemoryUsage(),
            this.analyzeRenderingPerformance()
        ];
        
        const duration = performance.now() - startTime;
        
        return {
            duration,
            tests,
            score: this.calculatePerformanceScore(tests),
            timestamp: new Date().toISOString()
        };
    }
    
    analyzeScriptPerformance() {
        const scripts = Array.from(document.scripts);
        
        return {
            total: scripts.length,
            async: scripts.filter(s => s.async).length,
            defer: scripts.filter(s => s.defer).length,
            external: scripts.filter(s => s.src).length,
            inline: scripts.filter(s => !s.src).length,
            recommendations: this.generateScriptRecommendations(scripts)
        };
    }
    
    generateScriptRecommendations(scripts) {
        const recommendations = [];
        
        if (scripts.length > 20) {
            recommendations.push('Considerar combinar scripts menores');
        }
        
        const syncLargeScripts = scripts.filter(s => !s.async && !s.defer && s.src);
        if (syncLargeScripts.length > 5) {
            recommendations.push('Adicionar async/defer aos scripts grandes');
        }
        
        return recommendations;
    }
    
    displayTestResult(testId, result) {
        const testsList = this.element.querySelector('#performance-tests-list');
        if (!testsList) return;
        
        const testElement = document.createElement('div');
        testElement.className = 'test-result';
        testElement.innerHTML = `
            <div class="test-header">
                <span class="test-name">${testId}</span>
                <span class="test-status">✅</span>
            </div>
            <div class="test-details">
                <pre>${JSON.stringify(result, null, 2)}</pre>
            </div>
        `;
        
        testsList.appendChild(testElement);
    }
}

/* ================== PAINEL DE DIAGNÓSTICO PDF ================== */
class PdfDiagnosticPanel extends DiagnosticsPanel {
    constructor(config) {
        super(config);
        this.pdfTests = [];
    }
    
    loadPdfContent(container) {
        const html = `
            <div class="pdf-diagnostic-dashboard">
                <h3>📄 DIAGNÓSTICO DO SISTEMA PDF</h3>
                
                <div class="pdf-quick-stats">
                    <div class="pdf-stat">
                        <div class="stat-label">Modal PDF</div>
                        <div class="stat-value" id="pdf-modal-stat">❓</div>
                    </div>
                    <div class="pdf-stat">
                        <div class="stat-label">Ícones PDF</div>
                        <div class="stat-value" id="pdf-icons-stat">0</div>
                    </div>
                    <div class="pdf-stat">
                        <div class="stat-label">Funções</div>
                        <div class="stat-value" id="pdf-functions-stat">0</div>
                    </div>
                </div>
                
                <div class="pdf-tests-section">
                    <h4>🔍 TESTES PDF DISPONÍVEIS</h4>
                    <div class="pdf-tests-list">
                        <button class="pdf-test-btn" data-test="compatibility">📊 Compatibilidade</button>
                        <button class="pdf-test-btn" data-test="icon-diagnosis">🔍 Ícone PDF</button>
                        <button class="pdf-test-btn" data-test="modal-test">🎯 Teste Modal</button>
                        <button class="pdf-test-btn" data-test="interactive">🎮 Teste Interativo</button>
                        <button class="pdf-test-btn" data-test="mobile">📱 Mobile PDF</button>
                    </div>
                </div>
                
                <div class="pdf-results" id="pdf-test-results">
                    <!-- Resultados dos testes aparecerão aqui -->
                </div>
            </div>
        `;
        container.innerHTML = html;
        
        // Configurar eventos
        container.querySelectorAll('.pdf-test-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.runPdfTest(e.target.dataset.test));
        });
        
        // Executar verificação inicial
        setTimeout(() => this.runInitialPdfCheck(), 500);
    }
    
    runInitialPdfCheck() {
        this.addTest({
            id: 'initial-pdf-check',
            name: 'Verificação Inicial PDF',
            run: () => this.checkPdfSystemBasics()
        });
    }
    
    checkPdfSystemBasics() {
        const results = {
            hasModal: !!document.getElementById('pdfModal'),
            hasPasswordField: !!document.getElementById('pdfPassword'),
            hasShowPdfModal: typeof window.showPdfModal === 'function',
            hasPdfSystem: typeof window.PdfSystem !== 'undefined',
            pdfIcons: document.querySelectorAll('.pdf-icon, .icon-pdf').length,
            timestamp: new Date().toISOString()
        };
        
        // Atualizar estatísticas visuais
        this.updatePdfStats(results);
        
        return results;
    }
    
    updatePdfStats(results) {
        const modalStat = this.element.querySelector('#pdf-modal-stat');
        const iconsStat = this.element.querySelector('#pdf-icons-stat');
        const functionsStat = this.element.querySelector('#pdf-functions-stat');
        
        if (modalStat) {
            modalStat.textContent = results.hasModal ? '✅' : '❌';
            modalStat.style.color = results.hasModal ? '#00ff9c' : '#ff5555';
        }
        
        if (iconsStat) {
            iconsStat.textContent = results.pdfIcons;
            iconsStat.style.color = results.pdfIcons > 0 ? '#00ff9c' : '#ffaa00';
        }
        
        if (functionsStat) {
            const functionCount = [results.hasShowPdfModal, results.hasPdfSystem].filter(Boolean).length;
            functionsStat.textContent = `${functionCount}/2`;
            functionsStat.style.color = functionCount === 2 ? '#00ff9c' : '#ffaa00';
        }
    }
    
    runPdfTest(testType) {
        const testId = `pdf-test-${testType}-${Date.now()}`;
        
        if (!this.addTest({
            id: testId,
            name: `Teste PDF: ${testType}`,
            type: 'pdf',
            run: () => this.executePdfTest(testType)
        })) {
            return; // Limite atingido
        }
        
        const result = this.executePdfTest(testType);
        this.displayPdfTestResult(testId, result);
    }
    
    executePdfTest(testType) {
        switch(testType) {
            case 'compatibility':
                return this.testPdfCompatibility();
            case 'icon-diagnosis':
                return this.diagnosePdfIcon();
            case 'modal-test':
                return this.testPdfModal();
            case 'interactive':
                return this.runInteractivePdfTest();
            case 'mobile':
                return this.testPdfMobile();
            default:
                return { error: 'Tipo de teste PDF desconhecido' };
        }
    }
    
    testPdfCompatibility() {
        const tests = {
            'PdfSystem disponível': typeof window.PdfSystem !== 'undefined',
            'showModal função': typeof window.PdfSystem?.showModal === 'function',
            'Modal no DOM': !!document.getElementById('pdfModal'),
            'Campo senha': !!document.getElementById('pdfPassword'),
            'Função testPdfSystem': typeof window.testPdfSystem === 'function',
            'Função interactivePdfTest': typeof window.interactivePdfTest === 'function'
        };
        
        const passed = Object.values(tests).filter(Boolean).length;
        const total = Object.keys(tests).length;
        const score = Math.round((passed / total) * 100);
        
        return {
            tests,
            passed,
            total,
            score,
            status: score >= 80 ? 'OK' : 'PROBLEMAS',
            timestamp: new Date().toISOString()
        };
    }
    
    displayPdfTestResult(testId, result) {
        const resultsContainer = this.element.querySelector('#pdf-test-results');
        if (!resultsContainer) return;
        
        const resultElement = document.createElement('div');
        resultElement.className = 'pdf-test-result';
        resultElement.innerHTML = `
            <div class="test-header">
                <strong>${testId}</strong>
                <span class="score" style="color: ${result.score >= 80 ? '#00ff9c' : '#ff5555'}">
                    ${result.score || '--'}%
                </span>
            </div>
            <div class="test-details">
                <pre style="font-size: 10px;">${JSON.stringify(result, null, 2)}</pre>
            </div>
        `;
        
        resultsContainer.insertBefore(resultElement, resultsContainer.firstChild);
        
        // Limitar a 5 resultados visíveis
        if (resultsContainer.children.length > 5) {
            resultsContainer.removeChild(resultsContainer.lastChild);
        }
    }
}

/* ================== SISTEMA DE CRIAÇÃO DE NOVAS JANELAS ================== */
function createNewDiagnosticsWindow(panelType = 'overview', config = {}) {
    if (DIAGNOSTICS_STORAGE.activeWindows.length >= DIAGNOSTICS_CONFIG.MAX_WINDOWS) {
        alert(`⚠️ Limite de ${DIAGNOSTICS_CONFIG.MAX_WINDOWS} janelas atingido. Feche algumas janelas primeiro.`);
        return null;
    }
    
    const panel = PanelFactory.createPanel(panelType, config);
    const panelElement = panel.create();
    
    console.log(`✅ Nova janela criada: ${panelType} (ID: ${panel.id})`);
    console.log(`📊 Janelas ativas: ${DIAGNOSTICS_STORAGE.activeWindows.length}/${DIAGNOSTICS_CONFIG.MAX_WINDOWS}`);
    
    return panel;
}

/* ================== VERIFICAÇÃO DE OCUPAÇÃO DO ARQUIVO ================== */
function checkFileOccupancy() {
    // Estimar ocupação do arquivo atual
    const scriptElement = document.currentScript || document.querySelector('script[src*="diagnostics.js"]');
    let lineCount = 0;
    
    if (scriptElement && scriptElement.textContent) {
        lineCount = scriptElement.textContent.split('\n').length;
    }
    
    DIAGNOSTICS_CONFIG.CURRENT_FILE_OCCUPANCY = (lineCount / DIAGNOSTICS_CONFIG.MAX_LINES_PER_FILE) * 100;
    
    if (DIAGNOSTICS_CONFIG.CURRENT_FILE_OCCUPANCY > 90) {
        console.warn(`⚠️ diagnostics.js está ${Math.round(DIAGNOSTICS_CONFIG.CURRENT_FILE_OCCUPANCY)}% ocupado!`);
        console.warn('📋 Considere criar diagnostics2.js para novos testes.');
        showFileOccupancyWarning();
    }
    
    return DIAGNOSTICS_CONFIG.CURRENT_FILE_OCCUPANCY;
}

function showFileOccupancyWarning() {
    const warningId = 'file-occupancy-warning';
    let warningDiv = document.getElementById(warningId);
    
    if (!warningDiv) {
        warningDiv = document.createElement('div');
        warningDiv.id = warningId;
        warningDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #1a0000;
            color: #ff5555;
            padding: 15px;
            border: 2px solid #ff5555;
            border-radius: 8px;
            z-index: 999998;
            max-width: 400px;
            box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
            font-family: monospace;
            font-size: 12px;
        `;
        
        warningDiv.innerHTML = `
            <div style="font-weight: bold; margin-bottom: 10px;">
                ⚠️ LIMITE DE ARQUIVO PRÓXIMO
            </div>
            <div style="margin-bottom: 10px;">
                diagnostics.js está ${Math.round(DIAGNOSTICS_CONFIG.CURRENT_FILE_OCCUPANCY)}% ocupado
                (${DIAGNOSTICS_CONFIG.MAX_LINES_PER_FILE} linhas máximo)
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="createNewDiagnosticsFile()" 
                        style="background: #ff5555; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                    📁 Criar diagnostics2.js
                </button>
                <button onclick="this.parentElement.parentElement.remove()" 
                        style="background: #555; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-size: 11px;">
                    Fechar
                </button>
            </div>
            <div style="font-size: 10px; color: #ff8888; margin-top: 10px;">
                Para novos testes, adicione em um novo arquivo para manter a organização.
            </div>
        `;
        
        document.body.appendChild(warningDiv);
    }
}

/* ================== FUNÇÃO PARA CRIAR NOVO ARQUIVO ================== */
function createNewDiagnosticsFile() {
    const newFileTemplate = `// ============================================================
// DIAGNOSTICS2.JS - NOVO ARQUIVO PARA NOVOS TESTES
// ============================================================
// Criado automaticamente quando diagnostics.js atingiu limite
// Data: ${new Date().toISOString()}
// ============================================================

console.log('🚀 diagnostics2.js - Novo arquivo de testes');

/* ================== CONFIGURAÇÕES ================== */
const DIAGNOSTICS2_CONFIG = {
    VERSION: '2.0',
    PARENT_FILE: 'diagnostics.js',
    CREATED_AT: '${new Date().toISOString()}',
    MAX_TESTS_PER_PANEL: 10
};

/* ================== INTEGRAÇÃO COM SISTEMA EXISTENTE ================== */
// Verificar se o sistema principal existe
if (typeof window.DIAGNOSTICS_STORAGE === 'undefined') {
    console.error('❌ Sistema diagnostics principal não encontrado!');
} else {
    console.log('✅ Integrado com sistema diagnostics principal');
}

/* ================== NOVOS TESTES ESPECIALIZADOS ================== */
// Adicione aqui novos testes que não cabem no arquivo principal

/* ================== TESTE DE EXEMPLO ================== */
window.testNewFeature = function() {
    console.group('🧪 NOVO TESTE - diagnostics2.js');
    console.log('Este é um novo teste no arquivo separado');
    console.log('Configuração:', DIAGNOSTICS2_CONFIG);
    console.groupEnd();
    
    return {
        file: 'diagnostics2.js',
        version: DIAGNOSTICS2_CONFIG.VERSION,
        timestamp: new Date().toISOString()
    };
};

/* ================== PAINEL PARA NOVOS TESTES ================== */
class NewTestsPanel extends DiagnosticsPanel {
    constructor(config) {
        super(config);
        this.newTests = [];
    }
    
    loadNewTestsContent(container) {
        container.innerHTML = \`
            <h3>🧪 NOVOS TESTES (diagnostics2.js)</h3>
            <div class="new-tests-list">
                <button onclick="testNewFeature()">Testar Nova Funcionalidade</button>
            </div>
        \`;
    }
}

// Exportar para sistema principal
if (typeof window.PanelFactory !== 'undefined') {
    // Registrar novo tipo de painel
    window.PanelFactory.prototype.createPanel = function(type, config) {
        if (type === 'new-tests') {
            return new NewTestsPanel(config);
        }
        return DiagnosticsPanel.prototype.createPanel.call(this, type, config);
    };
}

console.log('✅ diagnostics2.js carregado e pronto para novos testes!');`;

    // Criar blob e download
    const blob = new Blob([newFileTemplate], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'diagnostics2.js';
    a.click();
    URL.revokeObjectURL(url);
    
    alert('📁 diagnostics2.js criado e baixado!\n\nAdicione ao seu projeto e referencie no HTML:\n<script src="diagnostics2.js"></script>');
}

/* ================== GESTOR DE TESTES ================== */
class TestManager {
    constructor() {
        this.registeredTests = new Map();
        this.testResults = new Map();
        this.testCategories = new Set();
    }
    
    registerTest(test) {
        if (this.registeredTests.size >= 100) {
            console.warn('⚠️ Limite de 100 testes registrados atingido');
            return false;
        }
        
        this.registeredTests.set(test.id, test);
        if (test.category) {
            this.testCategories.add(test.category);
        }
        
        console.log(`✅ Teste registrado: ${test.id} (Categoria: ${test.category || 'none'})`);
        return true;
    }
    
    runTest(testId) {
        const test = this.registeredTests.get(testId);
        if (!test) {
            console.error(`❌ Teste não encontrado: ${testId}`);
            return null;
        }
        
        try {
            console.group(`🧪 Executando teste: ${testId}`);
            const result = test.execute();
            this.testResults.set(testId, {
                ...result,
                timestamp: new Date().toISOString(),
                testId
            });
            console.groupEnd();
            return result;
        } catch (error) {
            console.error(`❌ Erro no teste ${testId}:`, error);
            return {
                status: 'error',
                message: error.message,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    runCategory(category) {
        const tests = Array.from(this.registeredTests.values())
            .filter(test => test.category === category);
        
        console.group(`🚀 Executando categoria: ${category} (${tests.length} testes)`);
        const results = tests.map(test => this.runTest(test.id));
        console.groupEnd();
        
        return {
            category,
            tests: results.length,
            results,
            timestamp: new Date().toISOString()
        };
    }
    
    getReport() {
        return {
            totalTests: this.registeredTests.size,
            categories: Array.from(this.testCategories),
            results: Array.from(this.testResults.values()),
            timestamp: new Date().toISOString()
        };
    }
}

/* ================== INICIALIZAÇÃO DO SISTEMA ================== */
window.DiagnosticsSystem = {
    version: DIAGNOSTICS_CONFIG.VERSION,
    panels: [],
    testManager: null,
    
    init: function() {
        console.log(`🚀 Inicializando Diagnostics System v${this.version}`);
        
        // Verificar ocupação do arquivo
        checkFileOccupancy();
        
        // Inicializar gestor de testes
        this.testManager = new TestManager();
        
        // Criar painel principal se em modo diagnóstico
        if (FLAGS.DIAGNOSTICS_MODE || FLAGS.DEBUG_MODE) {
            this.createMainPanel();
        }
        
        // Registrar testes básicos
        this.registerBasicTests();
        
        // Expor funções globais
        this.exposeGlobalFunctions();
        
        console.log('✅ Diagnostics System inicializado');
        console.log(`📊 Configuração: ${Object.keys(FLAGS).filter(k => FLAGS[k]).join(', ')}`);
    },
    
    createMainPanel: function() {
        const mainPanel = PanelFactory.createPanel('overview', {
            title: 'DIAGNÓSTICO PRINCIPAL',
            position: { top: '10px', right: '10px' }
        });
        
        mainPanel.create();
        this.panels.push(mainPanel);
        
        // Adicionar testes iniciais ao painel
        this.addInitialTests(mainPanel);
    },
    
    registerBasicTests: function() {
        // Teste de Performance
        this.testManager.registerTest({
            id: 'performance-basic',
            name: 'Teste Básico de Performance',
            category: 'performance',
            execute: () => {
                const start = performance.now();
                const scripts = document.scripts.length;
                const end = performance.now();
                
                return {
                    duration: end - start,
                    scripts,
                    score: scripts < 20 ? 100 : Math.max(0, 100 - (scripts - 20) * 2),
                    status: scripts < 30 ? 'OK' : 'ALERTA'
                };
            }
        });
        
        // Teste de Sistema PDF
        this.testManager.registerTest({
            id: 'pdf-system-check',
            name: 'Verificação do Sistema PDF',
            category: 'pdf',
            execute: () => {
                return {
                    hasPdfSystem: typeof window.PdfSystem !== 'undefined',
                    hasModal: !!document.getElementById('pdfModal'),
                    hasPasswordField: !!document.getElementById('pdfPassword'),
                    pdfIcons: document.querySelectorAll('.pdf-icon, .icon-pdf').length,
                    status: 'COMPLETED'
                };
            }
        });
    },
    
    addInitialTests: function(panel) {
        // Adicionar alguns testes iniciais
        panel.addTest({
            id: 'system-overview',
            name: 'Visão Geral do Sistema',
            run: () => this.runSystemOverview()
        });
        
        panel.addTest({
            id: 'performance-quick',
            name: 'Teste Rápido de Performance',
            run: () => this.testManager.runTest('performance-basic')
        });
    },
    
    runSystemOverview: function() {
        return {
            url: window.location.href,
            userAgent: navigator.userAgent.substring(0, 100),
            screen: `${window.screen.width}x${window.screen.height}`,
            viewport: `${window.innerWidth}x${window.innerHeight}`,
            scripts: document.scripts.length,
            stylesheets: document.styleSheets.length,
            timestamp: new Date().toISOString()
        };
    },
    
    exposeGlobalFunctions: function() {
        window.createDiagnosticsPanel = (type, config) => createNewDiagnosticsWindow(type, config);
        window.runDiagnosticsTest = (testId) => this.testManager?.runTest(testId);
        window.getDiagnosticsReport = () => this.testManager?.getReport();
        window.checkFileOccupancy = checkFileOccupancy;
        window.createNewDiagnosticsFile = createNewDiagnosticsFile;
    }
};

/* ================== INICIALIZAÇÃO AUTOMÁTICA ================== */
if (FLAGS.DIAGNOSTICS_MODE || FLAGS.DEBUG_MODE) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            window.DiagnosticsSystem.init();
        }, 1000);
    });
    
    // Também inicializar se o DOM já estiver carregado
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        setTimeout(() => {
            window.DiagnosticsSystem.init();
        }, 500);
    }
}

/* ================== ESTILOS ADICIONAIS ================== */
const panelStyles = `
.diagnostics-panel .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 10px;
    border-bottom: 1px solid #333;
}

.diagnostics-panel .panel-title {
    font-size: 16px;
    font-weight: bold;
    color: #00ff9c;
}

.diagnostics-panel .panel-controls button {
    background: #333;
    color: white;
    border: none;
    padding: 4px 8px;
    cursor: pointer;
    border-radius: 3px;
    margin-left: 5px;
}

.diagnostics-panel .panel-controls button:hover {
    background: #555;
}

.diagnostics-panel .panel-status {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
    color: #888;
    margin-bottom: 15px;
}

.diagnostics-panel .panel-tabs {
    display: flex;
    gap: 5px;
    margin-bottom: 15px;
    flex-wrap: wrap;
}

.diagnostics-panel .tab-btn {
    background: #333;
    color: #888;
    border: none;
    padding: 8px 12px;
    cursor: pointer;
    border-radius: 4px;
    font-size: 11px;
}

.diagnostics-panel .tab-btn:hover {
    background: #444;
}

.diagnostics-panel .panel-footer {
    display: flex;
    justify-content: space-between;
    margin-top: 15px;
    padding-top: 10px;
    border-top: 1px solid #333;
    font-size: 11px;
    color: #888;
}

.metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
    margin: 20px 0;
}

.metric-card {
    background: #111;
    padding: 15px;
    border-radius: 6px;
    border: 1px solid #333;
}

.metric-label {
    font-size: 11px;
    color: #888;
    margin-bottom: 5px;
}

.metric-value {
    font-size: 24px;
    color: #00ff9c;
    font-weight: bold;
}

.metric-bar {
    height: 6px;
    background: #333;
    border-radius: 3px;
    margin-top: 10px;
    overflow: hidden;
}

.metric-fill {
    height: 100%;
    background: #00ff9c;
    transition: width 0.5s ease;
}

.test-result {
    background: #111;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    border-left: 3px solid #00ff9c;
}

.test-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 5px;
}

.test-details pre {
    margin: 0;
    font-size: 10px;
    max-height: 150px;
    overflow-y: auto;
    background: #000;
    padding: 8px;
    border-radius: 4px;
}
`;

// Adicionar estilos ao documento
const styleElement = document.createElement('style');
styleElement.textContent = panelStyles;
document.head.appendChild(styleElement);

/* ================== EXPORTAÇÕES GLOBAIS ================== */
window.DiagnosticsPanel = DiagnosticsPanel;
window.PanelFactory = PanelFactory;
window.PerformancePanel = PerformancePanel;
window.PdfDiagnosticPanel = PdfDiagnosticPanel;
window.TestManager = TestManager;
window.DIAGNOSTICS_CONFIG = DIAGNOSTICS_CONFIG;
window.FLAGS = FLAGS;

console.log(`✅ diagnostics.js v${DIAGNOSTICS_CONFIG.VERSION} - ESTRUTURA ORGANIZADA CARREGADA`);
console.log('📋 Comandos disponíveis:');
console.log('- window.DiagnosticsSystem.init() - Inicializar sistema');
console.log('- window.createDiagnosticsPanel(\'performance\') - Criar painel de performance');
console.log('- window.createDiagnosticsPanel(\'pdf\') - Criar painel PDF');
console.log('- window.checkFileOccupancy() - Verificar ocupação do arquivo');
console.log('- window.createNewDiagnosticsFile() - Criar novo arquivo para mais testes');

// Verificar se deve mostrar aviso de ocupação
setTimeout(checkFileOccupancy, 2000);
