// ================== debug/diagnostics/diagnostics60.js ==================
// SISTEMA DE DIAGNÓSTICO VISUAL - PAINEL PRINCIPAL
// Versão: 6.0 - Painel de Integridade Unificado
// Data: 13/02/2026
// Descrição: Fornece um painel visual para executar testes de integridade,
//            validar o Core System e monitorar a saúde de todos os módulos.
//            Atua como o orquestrador principal para os módulos diagnostics5x.js.
// =========================================================================

console.log('🔍 diagnostics60.js (v6.0) - PAINEL DE INTEGRIDADE UNIFICADO');

// Namespace global para o módulo de diagnóstico de integridade
const SystemIntegrityModule = (function() {
    // ================== CONFIGURAÇÃO ==================
    const MODULE_VERSION = '6.0';
    const MODULE_NAME = 'Integridade Unificada';
    
    // Referência ao painel DOM
    let integrityPanel = null;

    // ================== TESTES DE INTEGRIDADE DO SISTEMA ==================
    const integrityTests = {
        /**
         * TESTE FINAL DE INTEGRIDADE DO SISTEMA (ORQUESTRADOR)
         * Executa uma bateria completa de testes, verificando módulos críticos
         * e funcionalidades essenciais. Este teste é o ponto central do painel.
         */
        systemIntegrityCheck: {
            id: 'system-integrity-final-v6',
            title: '🔍 VERIFICAÇÃO COMPLETA DO SISTEMA (v6.0)',
            description: 'Executa todos os testes de integridade nos módulos do Core System e Support System.',
            type: 'validation',
            icon: '🔍',
            category: 'integrity',
            critical: true,
            version: MODULE_VERSION,
            
            /**
             * Executa a verificação completa.
             * @returns {Object} Resultado estruturado da verificação.
             */
            execute: function() {
                console.group('🔍 TESTE DE INTEGRIDADE - SISTEMA OTIMIZADO v' + MODULE_VERSION);
                
                // --- Lista de Testes (Orquestrados) ---
                const tests = [
                    // MÓDULOS DO CORE SYSTEM (CRÍTICOS)
                    { 
                        name: 'Core: window.properties', 
                        test: () => Array.isArray(window.properties) && window.properties.length >= 0,
                        importance: 'critical'
                    },
                    { 
                        name: 'Core: Supabase Client', 
                        test: () => !!window.supabaseClient || !!window.SUPABASE_CONFIG,
                        importance: 'high'
                    },
                    { 
                        name: 'Core: Supabase Constants', 
                        test: () => !!(window.SUPABASE_CONSTANTS?.URL && window.SUPABASE_CONSTANTS?.KEY),
                        importance: 'critical'
                    },
                    
                    // MÓDULOS ESPECÍFICOS (CRÍTICOS)
                    { 
                        name: 'Module: PdfSystem', 
                        test: () => !!(window.PdfSystem && typeof window.PdfSystem.showModal === 'function'),
                        importance: 'critical'
                    },
                    { 
                        name: 'Module: MediaSystem', 
                        test: () => !!(window.MediaSystem && typeof window.MediaSystem.addFiles === 'function' && typeof window.MediaSystem.addPdfs === 'function'),
                        importance: 'critical'
                    },
                    
                    // FUNÇÕES PRINCIPAIS (ALTAS/MÉDIAS)
                    { 
                        name: 'Function: toggleAdminPanel', 
                        test: () => typeof window.toggleAdminPanel === 'function',
                        importance: 'high'
                    },
                    { 
                        name: 'Function: editProperty', 
                        test: () => typeof window.editProperty === 'function',
                        importance: 'high'
                    },
                    { 
                        name: 'Function: loadPropertiesData', 
                        test: () => typeof window.loadPropertiesData === 'function',
                        importance: 'high'
                    },
                    { 
                        name: 'Function: renderProperties', 
                        test: () => typeof window.renderProperties === 'function',
                        importance: 'high'
                    },
                    { 
                        name: 'Feature: Video Flag', 
                        test: () => typeof window.SharedCore?.ensureBooleanVideo === 'function',
                        importance: 'medium'
                    },
                    { 
                        name: 'Feature: Feature Parser', 
                        test: () => typeof window.SharedCore?.parseFeaturesForStorage === 'function',
                        importance: 'medium'
                    },
                    
                    // MÓDULOS DE UTILITÁRIOS (MÉDIOS/BAIXOS)
                    { 
                        name: 'Utility: LoadingManager', 
                        test: () => !!(window.LoadingManager && typeof window.LoadingManager.show === 'function'),
                        importance: 'medium'
                    },
                    { 
                        name: 'Utility: FilterManager', 
                        test: () => !!(window.FilterManager && typeof window.FilterManager.init === 'function'),
                        importance: 'medium'
                    },
                    { 
                        name: 'Gallery: openGallery', 
                        test: () => typeof window.openGallery === 'function',
                        importance: 'medium'
                    },
                    
                    // SISTEMA DE DIAGNÓSTICO (SUPORTE)
                    { 
                        name: 'Support: Diagnostics Chain', 
                        test: () => {
                            // Verifica se pelo menos um dos módulos de suporte foi carregado (em modo debug)
                            return window.location.search.includes('debug=true') 
                                ? (typeof window.runSupportChecks === 'function' || typeof window.checkModuleDuplications === 'function')
                                : true; // Em produção, este teste não é crítico
                        },
                        importance: 'low'
                    }
                ];
                
                let passed = 0;
                const total = tests.length;
                const results = [];
                
                console.log(`🧪 Executando ${total} testes de integridade...`);
                
                tests.forEach((test, index) => {
                    let result = false;
                    let errorMsg = null;
                    
                    try {
                        result = test.test();
                        if (result) passed++;
                    } catch (error) {
                        errorMsg = error.message;
                        console.warn(`⚠️ Erro no teste ${index + 1} (${test.name}):`, errorMsg);
                    }
                    
                    console.log(`${result ? '✅' : '❌'} ${index + 1}. ${test.name}: ${result ? 'OK' : errorMsg ? 'ERRO' : 'FALHOU'}`);
                    
                    results.push({
                        name: test.name,
                        passed: result,
                        importance: test.importance,
                        error: errorMsg
                    });
                });
                
                const score = Math.round((passed / total) * 100);
                const criticalTests = results.filter(t => t.importance === 'critical');
                const criticalPassed = criticalTests.filter(t => t.passed).length;
                
                console.log(`\n📊 RESULTADO FINAL: ${passed}/${total} testes passaram`);
                console.log(`🎯 SCORE: ${score}%`);
                console.log(`🔥 CRÍTICOS: ${criticalPassed}/${criticalTests.length}`);
                
                let status = 'success';
                let message = '';
                
                if (criticalPassed === criticalTests.length && passed === total) {
                    console.log('\n🎉 SISTEMA 100% ÍNTEGRO E OTIMIZADO!');
                    message = '✅ SISTEMA 100% ÍNTEGRO!';
                } else if (criticalPassed === criticalTests.length) {
                    console.log('\n⚠️ SISTEMA ESTÁVEL - Testes não críticos falharam');
                    status = 'warning';
                    message = `⚠️ SISTEMA ESTÁVEL (${score}%)`;
                } else {
                    console.log('\n❌ PROBLEMAS CRÍTICOS - Sistema com falhas graves');
                    status = 'error';
                    message = `❌ SISTEMA COM FALHAS (${score}%)`;
                }
                
                console.groupEnd();
                
                return {
                    status: status,
                    message: message,
                    details: {
                        totalTests: total,
                        passed: passed,
                        criticalTests: criticalTests.length,
                        criticalPassed: criticalPassed,
                        score: score,
                        results: results
                    }
                };
            }
        }
    };

    // ================== FUNÇÕES DE CRIAÇÃO DO PAINEL ==================

    /**
     * Cria e retorna o painel visual de integridade.
     * Se o sistema de diagnóstico avançado (SpecializedPanels) existir, ele o utiliza.
     * Caso contrário, cria um painel independente.
     * @returns {HTMLElement} O elemento do painel.
     */
    function createIntegrityPanel() {
        // Se já existe, apenas mostrar
        if (integrityPanel && document.body.contains(integrityPanel)) {
            integrityPanel.style.display = 'flex';
            return integrityPanel;
        }
        
        console.log('🖥️ Criando painel de integridade...');

        // --- TENTATIVA 1: Usar o sistema de diagnóstico avançado (SpecializedPanels) ---
        if (typeof PanelManager !== 'undefined' && typeof SpecializedPanels !== 'undefined') {
            return createAdvancedPanel();
        }
        
        // --- TENTATIVA 2: Criar painel independente ---
        return createStandalonePanel();
    }

    /**
     * Cria um painel utilizando o sistema SpecializedPanels (mais completo).
     * @returns {HTMLElement} O painel criado.
     */
    function createAdvancedPanel() {
        console.log('🔧 Utilizando sistema SpecializedPanels para o painel...');
        
        const panelConfig = {
            title: '🔍 INTEGRIDADE DO SISTEMA v' + MODULE_VERSION,
            category: 'integrity',
            maxTests: 20,
            position: { top: '120px', left: '500px' },
            size: { width: '580px', height: '720px' }
        };
        
        integrityPanel = PanelManager.createPanel(panelConfig);
        
        if (integrityPanel && SpecializedPanels.renderPanel) {
            integrityPanel.element = SpecializedPanels.renderPanel(integrityPanel);
            
            // Adicionar o teste principal ao painel
            const mainTest = integrityTests.systemIntegrityCheck;
            integrityPanel.tests = integrityPanel.tests || [];
            integrityPanel.tests.push(mainTest.id);
            SpecializedPanels.addTestToPanel(integrityPanel, mainTest);
            
            // Adicionar botão de execução rápida
            const testsContainer = integrityPanel.element.querySelector('.tests-container');
            if (testsContainer) {
                const quickRunHTML = `
                    <div style="background: linear-gradient(135deg, rgba(0, 200, 255, 0.15), rgba(0, 255, 150, 0.15));
                                padding: 15px;
                                border-radius: 8px;
                                border: 2px solid rgba(0, 200, 255, 0.3);
                                margin: 20px 0;
                                text-align: center;">
                        <button id="advanced-run-integrity" 
                                style="background: linear-gradient(135deg, #00aaff, #00cc88);
                                       color: white;
                                       border: none;
                                       padding: 12px 24px;
                                       border-radius: 6px;
                                       font-weight: bold;
                                       cursor: pointer;
                                       width: 100%;
                                       font-size: 15px;
                                       transition: all 0.2s ease;
                                       box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);">
                            🚀 EXECUTAR VERIFICAÇÃO COMPLETA (v${MODULE_VERSION})
                        </button>
                        <div style="font-size: 11px; color: #88aaff; margin-top: 8px;">
                            Testa ${integrityTests.systemIntegrityCheck.details?.totalTests || 16} módulos críticos e funções do sistema
                        </div>
                    </div>
                `;
                testsContainer.insertAdjacentHTML('afterbegin', quickRunHTML);
                
                // Adicionar evento ao botão
                document.getElementById('advanced-run-integrity')?.addEventListener('click', async (e) => {
                    const button = e.target;
                    button.disabled = true;
                    button.textContent = 'EXECUTANDO...';
                    
                    if (integrityPanel.addLog) {
                        integrityPanel.addLog('🚀 Iniciando verificação completa de integridade...', 'info');
                    }
                    
                    const result = await integrityTests.systemIntegrityCheck.execute();
                    
                    button.disabled = false;
                    button.textContent = '🚀 EXECUTAR VERIFICAÇÃO COMPLETA';
                    
                    if (integrityPanel.addLog) {
                        integrityPanel.addLog(`✅ Verificação concluída: ${result.message}`, result.status);
                        integrityPanel.addLog(`📊 Score: ${result.details.score}% (${result.details.passed}/${result.details.totalTests})`, 
                                            result.status === 'success' ? 'success' : 'warning');
                    }
                });
            }
            
            // Inicializar logs
            if (SpecializedPanels.initializePanelLogs) {
                SpecializedPanels.initializePanelLogs(integrityPanel);
                integrityPanel.addLog?.(`🔍 Painel de Integridade v${MODULE_VERSION} inicializado.`, 'info');
            }
            
            // Tornar arrastável
            if (SpecializedPanels.makePanelDraggable) {
                SpecializedPanels.makePanelDraggable(integrityPanel);
            }
            
            console.log('✅ Painel de Integridade (Avançado) criado.');
            return integrityPanel.element;
        }
        
        // Se algo falhar, cair para o painel independente
        console.warn('⚠️ Falha ao criar painel avançado, usando independente.');
        return createStandalonePanel();
    }

    /**
     * Cria um painel de diagnóstico independente (fallback).
     * @returns {HTMLElement} O painel criado.
     */
    function createStandalonePanel() {
        console.log('🛠️ Criando painel de integridade independente (fallback)...');
        
        const panelId = 'integrity-panel-' + Date.now();
        const panel = document.createElement('div');
        
        panel.id = panelId;
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            left: 100px;
            width: 550px;
            height: 680px;
            background: linear-gradient(145deg, #0a1428, #0b1a2a);
            border: 2px solid #00ccff;
            border-radius: 16px;
            z-index: 100000;
            box-shadow: 0 0 40px rgba(0, 200, 255, 0.5);
            font-family: 'Segoe UI', 'Monaco', 'Courier New', monospace;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            resize: both;
            color: #e0f0ff;
        `;
        
        panel.innerHTML = `
            <!-- Cabeçalho Arrastável -->
            <div class="panel-header" style="background: linear-gradient(90deg, #0a2a3a, #0a1a2a);
                        padding: 15px 20px;
                        border-bottom: 2px solid #00ccff;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        cursor: move;
                        user-select: none;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="color: #00ccff; font-weight: bold; font-size: 16px;">🔍 INTEGRIDADE DO SISTEMA</span>
                    <span style="background: #00ccff; color: #0a1428; padding: 4px 10px; border-radius: 12px; font-size: 11px; font-weight: bold;">v${MODULE_VERSION}</span>
                </div>
                <div>
                    <button class="minimize-btn" style="background: #3a5a6a; color: white; border: none; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; margin-right: 5px;">−</button>
                    <button class="close-btn" style="background: #c03a2a; color: white; border: none; width: 28px; height: 28px; border-radius: 6px; cursor: pointer;">×</button>
                </div>
            </div>
            
            <!-- Corpo do Painel (Scrollável) -->
            <div style="flex: 1; padding: 20px; overflow-y: auto; display: flex; flex-direction: column; gap: 15px;">
                
                <!-- Descrição -->
                <div style="background: rgba(0, 204, 255, 0.1); padding: 12px; border-radius: 8px; border-left: 4px solid #00ccff;">
                    <div style="font-weight: bold; color: #88ddff; margin-bottom: 5px;">🎯 VERIFICAÇÃO FINAL DE INTEGRIDADE</div>
                    <div style="font-size: 12px; color: #aaccee;">Executa testes em todos os módulos críticos e funções do sistema após otimização completa.</div>
                </div>
                
                <!-- Botão de Execução -->
                <div style="text-align: center; margin: 10px 0;">
                    <button id="standalone-run-integrity" 
                            style="background: linear-gradient(135deg, #00aaff, #00cc88);
                                   color: white;
                                   border: none;
                                   padding: 14px 20px;
                                   border-radius: 10px;
                                   font-weight: bold;
                                   cursor: pointer;
                                   font-size: 16px;
                                   width: 100%;
                                   transition: 0.2s;
                                   box-shadow: 0 4px 15px rgba(0, 170, 255, 0.4);">
                        🚀 EXECUTAR VERIFICAÇÃO COMPLETA
                    </button>
                    <div style="font-size: 11px; color: #88aaff; margin-top: 8px;">
                        Clique para testar todos os módulos do sistema
                    </div>
                </div>
                
                <!-- Área de Resultados -->
                <div>
                    <div style="color: #88ddff; font-weight: bold; margin-bottom: 8px; font-size: 13px;">📊 RESULTADOS:</div>
                    <div id="standalone-results" style="min-height: 200px; background: rgba(0, 20, 30, 0.6); border-radius: 8px; padding: 15px; border: 1px solid #2a4a5a;">
                        <div style="color: #88aaff; text-align: center; padding: 20px;">⏳ Aguardando execução...</div>
                    </div>
                </div>
                
                <!-- Área de Logs -->
                <div>
                    <div style="color: #88ddff; font-weight: bold; margin-bottom: 8px; font-size: 13px;">📝 LOGS:</div>
                    <div id="standalone-logs" 
                         style="height: 130px;
                                overflow-y: auto;
                                background: #0a1a2a;
                                border-radius: 6px;
                                padding: 8px;
                                border: 1px solid #2a5a7a;
                                font-size: 11px;
                                font-family: monospace;
                                color: #b0d0ff;">
                        <div>[${new Date().toLocaleTimeString()}] Painel de integridade inicializado</div>
                    </div>
                </div>
            </div>
            
            <!-- Rodapé -->
            <div style="background: #0a1f2a; padding: 10px 15px; border-top: 1px solid #2a5a7a; display: flex; justify-content: space-between; font-size: 10px; color: #88aaff;">
                <span>Sistema Weber Lessa - Módulo de Diagnóstico</span>
                <span>Status: <span id="standalone-status">Pronto</span></span>
            </div>
        `;
        
        document.body.appendChild(panel);
        integrityPanel = panel; // Guardar referência
        
        // --- Configurar Eventos do Painel Independente ---
        const logsContainer = panel.querySelector('#standalone-logs');
        const resultsContainer = panel.querySelector('#standalone-results');
        const statusSpan = panel.querySelector('#standalone-status');
        const runButton = panel.querySelector('#standalone-run-integrity');
        
        // Função para adicionar logs
        function addLog(message, type = 'info') {
            const colors = { info: '#88aaff', success: '#88dd88', warning: '#ffaa55', error: '#ff6b6b' };
            const logEntry = document.createElement('div');
            logEntry.style.color = colors[type] || colors.info;
            logEntry.style.marginBottom = '3px';
            logEntry.style.borderBottom = '1px dotted #2a4a6a';
            logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
            logsContainer.appendChild(logEntry);
            logsContainer.scrollTop = logsContainer.scrollHeight;
        }
        
        // Evento do botão de execução
        runButton.addEventListener('click', async function() {
            this.disabled = true;
            this.textContent = 'EXECUTANDO...';
            this.style.opacity = '0.7';
            
            statusSpan.textContent = 'Testando...';
            statusSpan.style.color = '#ffaa55';
            
            addLog('🚀 Iniciando verificação completa...', 'info');
            
            try {
                const result = await integrityTests.systemIntegrityCheck.execute();
                
                // Atualizar resultados
                resultsContainer.innerHTML = '';
                
                const scoreColor = result.status === 'success' ? '#88dd88' : (result.status === 'warning' ? '#ffaa55' : '#ff6b6b');
                const scoreHTML = `
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-size: 36px; color: ${scoreColor}; font-weight: bold;">
                            ${result.details.score}%
                        </div>
                        <div style="color: #aaccee; font-size: 12px;">
                            ${result.details.passed}/${result.details.totalTests} testes passaram
                        </div>
                        <div style="color: #88aaff; font-size: 11px; margin-top: 5px;">
                            ${result.details.criticalPassed}/${result.details.criticalTests} críticos OK
                        </div>
                    </div>
                `;
                
                resultsContainer.innerHTML = scoreHTML;
                
                // Adicionar detalhes dos testes
                result.details.results.forEach(test => {
                    const testDiv = document.createElement('div');
                    testDiv.style.cssText = `
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                        padding: 6px 8px;
                        margin: 5px 0;
                        background: rgba(0, 30, 50, 0.4);
                        border-radius: 4px;
                        border-left: 3px solid ${test.passed ? '#88dd88' : '#ff6b6b'};
                        font-size: 11px;
                    `;
                    
                    testDiv.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 6px; max-width: 70%;">
                            <span style="color: ${test.passed ? '#88dd88' : '#ff6b6b'}">${test.passed ? '✅' : '❌'}</span>
                            <span style="color: #d0e0ff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${test.name}">${test.name}</span>
                        </div>
                        <div style="font-size: 9px; color: #88aaff; text-transform: uppercase;">${test.importance}</div>
                    `;
                    
                    resultsContainer.appendChild(testDiv);
                });
                
                // Atualizar status
                statusSpan.textContent = result.status === 'success' ? '✅ Íntegro' : (result.status === 'warning' ? '⚠️ Estável' : '❌ Falhas');
                statusSpan.style.color = scoreColor;
                
                addLog(`✅ Verificação concluída: ${result.message}`, result.status);
                addLog(`📊 Score: ${result.details.score}% | Críticos: ${result.details.criticalPassed}/${result.details.criticalTests}`, result.status);
                
            } catch (error) {
                addLog(`❌ Erro na verificação: ${error.message}`, 'error');
                statusSpan.textContent = '❌ Erro';
                statusSpan.style.color = '#ff6b6b';
            } finally {
                this.disabled = false;
                this.textContent = '🚀 EXECUTAR VERIFICAÇÃO COMPLETA';
                this.style.opacity = '1';
            }
        });
        
        // Fechar painel
        panel.querySelector('.close-btn').addEventListener('click', () => {
            panel.remove();
            integrityPanel = null;
        });
        
        // Minimizar
        panel.querySelector('.minimize-btn').addEventListener('click', function() {
            const contentDiv = panel.children[1]; // O corpo do painel
            const isHidden = contentDiv.style.display === 'none';
            contentDiv.style.display = isHidden ? 'block' : 'none';
            this.textContent = isHidden ? '−' : '+';
        });
        
        // Arrastar
        const header = panel.querySelector('.panel-header');
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', function(e) {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });
        
        addLog('✅ Painel independente de integridade criado.', 'success');
        console.log('✅ Painel independente de integridade criado');
        
        return panel;
    }

    // ================== API PÚBLICA DO MÓDULO ==================
    
    return {
        version: MODULE_VERSION,
        
        // Testes disponíveis
        tests: integrityTests,
        
        // Registrar testes no TestManager (se existir)
        registerTests: function() {
            if (typeof TestManager !== 'undefined' && TestManager.registerTest) {
                Object.values(integrityTests).forEach(testConfig => {
                    if (!TestManager.getTest?.(testConfig.id)) {
                        TestManager.registerTest(testConfig);
                    }
                });
                console.log('✅ Testes de integridade registrados no TestManager');
            }
        },
        
        // Criar o painel visual
        createPanel: createIntegrityPanel,
        
        // Executar a verificação principal e retornar o resultado
        runFullCheck: function() {
            return integrityTests.systemIntegrityCheck.execute();
        },
        
        // Adicionar uma aba de atalho a um painel existente
        addTabToPanel: function(panelId) {
            const panel = document.getElementById(panelId);
            if (!panel) return false;
            
            const tabsContainer = panel.querySelector('.panel-tabs, .panel-header');
            if (tabsContainer) {
                const tabButton = document.createElement('button');
                tabButton.textContent = `🔍 Integridade v${MODULE_VERSION}`;
                tabButton.style.cssText = `
                    background: rgba(0, 200, 255, 0.15);
                    color: #88ddff;
                    border: 1px solid #00aaff;
                    border-radius: 4px;
                    padding: 4px 10px;
                    margin-left: 5px;
                    cursor: pointer;
                    font-size: 11px;
                `;
                tabButton.onclick = () => this.createPanel();
                tabsContainer.appendChild(tabButton);
                return true;
            }
            return false;
        }
    };
})();

// ================== INICIALIZAÇÃO E INTEGRAÇÃO ==================

// Inicializar quando o DOM estiver pronto
function initializeModule() {
    // Registrar testes
    SystemIntegrityModule.registerTests();
    
    // Expor globalmente
    window.IntegrityModule = SystemIntegrityModule;
    
    // Atalhos rápidos no console
    window.IM = {
        run: () => SystemIntegrityModule.runFullCheck(),
        panel: () => SystemIntegrityModule.createPanel(),
        version: SystemIntegrityModule.version
    };
    
    console.log(`%c🔍 Módulo de Integridade v${SystemIntegrityModule.version} PRONTO`, 
                'color: #00ccff; font-weight: bold; font-size: 13px;');
    console.log('   Comandos: IM.run() | IM.panel()');
    
    // Auto-execução? Verificar se a URL contém o parâmetro para mostrar o painel automaticamente
    if (window.location.search.includes('diagnostics=true')) {
        setTimeout(() => {
            SystemIntegrityModule.createPanel();
        }, 1500);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModule);
} else {
    setTimeout(initializeModule, 500);
}

// ================== BOTÃO FLUTUANTE DE ACESSO RÁPIDO ==================
setTimeout(() => {
    // Só criar o botão se não existir e se estiver em modo debug
    if (window.location.search.includes('debug=true') && !document.getElementById('integrity-quick-button')) {
        const floatBtn = document.createElement('button');
        floatBtn.id = 'integrity-quick-button';
        floatBtn.innerHTML = '🔍';
        floatBtn.title = `Painel de Integridade v${SystemIntegrityModule.version}`;
        floatBtn.style.cssText = `
            position: fixed;
            bottom: 110px;
            right: 20px;
            z-index: 99999;
            background: linear-gradient(135deg, #00aaff, #00cc88);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 170, 255, 0.5);
            transition: 0.2s;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        floatBtn.onmouseenter = () => { floatBtn.style.transform = 'scale(1.1)'; };
        floatBtn.onmouseleave = () => { floatBtn.style.transform = 'scale(1)'; };
        floatBtn.onclick = () => SystemIntegrityModule.createPanel();
        
        document.body.appendChild(floatBtn);
        console.log('✅ Botão flutuante de integridade criado.');
    }
}, 3000);

console.log('✅ diagnostics60.js (v6.0) carregado e pronto.');
