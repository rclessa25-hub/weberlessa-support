// ================== MÓDULO DE VERIFICAÇÃO DE INTEGRIDADE DO SISTEMA (VISUAL) ==================
const SystemIntegrityModule = (function() {
    // Testes de integridade do sistema
    const integrityTests = {
        systemIntegrityCheck: {
            id: 'system-integrity-final',
            title: '🔍 TESTE FINAL DE INTEGRIDADE DO SISTEMA',
            description: 'Verificação completa de todos os módulos e funcionalidades críticas após otimização',
            type: 'validation',
            icon: '🔍',
            category: 'integrity',
            critical: true,
            version: '16.0',
            execute: function() {
                console.group('🔍 TESTE FINAL DE INTEGRIDADE - SISTEMA OTIMIZADO v16.0');
                
                const tests = [
                    // MÓDULOS CRÍTICOS
                    { 
                        name: 'PdfSystem', 
                        test: () => window.PdfSystem && typeof window.PdfSystem.showModal === 'function',
                        importance: 'critical'
                    },
                    { 
                        name: 'MediaSystem', 
                        test: () => window.MediaSystem && typeof window.MediaSystem.addPdfs === 'function',
                        importance: 'critical'
                    },
                    { 
                        name: 'Supabase Client', 
                        test: () => window.supabaseClient || window.SUPABASE_CONFIG,
                        importance: 'high'
                    },
                    { 
                        name: 'Properties Array', 
                        test: () => Array.isArray(window.properties),
                        importance: 'high'
                    },
                    { 
                        name: 'Admin Functions', 
                        test: () => typeof window.toggleAdminPanel === 'function' && typeof window.editProperty === 'function',
                        importance: 'medium'
                    },
                    { 
                        name: 'Upload de PDFs', 
                        test: () => typeof window.handleNewPdfFiles === 'function' || (window.MediaSystem && typeof window.MediaSystem.addPdfs === 'function'),
                        importance: 'high'
                    },
                    { 
                        name: 'Modal de Galeria', 
                        test: () => typeof window.openGallery === 'function',
                        importance: 'medium'
                    },
                    { 
                        name: 'Filtros', 
                        test: () => typeof window.setupFilters === 'function',
                        importance: 'medium'
                    },
                    { 
                        name: 'Sincronização', 
                        test: () => typeof window.syncWithSupabase === 'function' || typeof window.forceSyncProperties === 'function',
                        importance: 'high'
                    },
                    { 
                        name: 'Modo Debug', 
                        test: () => window.location.search.includes('debug=true') ? typeof window.runSupportChecks === 'function' : true,
                        importance: 'low'
                    },
                    { 
                        name: 'Fallbacks', 
                        test: () => window.PdfLogger !== undefined && window.MediaLogger !== undefined,
                        importance: 'medium'
                    }
                ];
                
                let passed = 0;
                const total = tests.length;
                const results = [];
                
                console.log('🧪 Executando testes de integridade...');
                
                tests.forEach((test, index) => {
                    try {
                        const result = test.test();
                        console.log(`${result ? '✅' : '❌'} ${index + 1}. ${test.name}: ${result ? 'OK' : 'FALHOU'}`);
                        if (result) passed++;
                        results.push({
                            name: test.name,
                            passed: result,
                            importance: test.importance
                        });
                    } catch (error) {
                        console.log(`❌ ${index + 1}. ${test.name}: ERRO - ${error.message}`);
                        results.push({
                            name: test.name,
                            passed: false,
                            importance: test.importance,
                            error: error.message
                        });
                    }
                });
                
                const score = Math.round((passed / total) * 100);
                
                console.log(`\n📊 RESULTADO FINAL: ${passed}/${total} testes passaram`);
                console.log(`🎯 SCORE: ${score}%`);
                
                let status = 'success';
                let message = '';
                
                if (passed === total) {
                    console.log('\n🎉 SISTEMA 100% INTEGRO E OTIMIZADO!');
                    message = '✅ SISTEMA 100% INTEGRO E OTIMIZADO!';
                } else if (score >= 80) {
                    console.log('\n⚠️  SISTEMA ESTÁVEL - Alguns testes não críticos falharam');
                    status = 'warning';
                    message = `⚠️ SISTEMA ESTÁVEL (${score}%)`;
                } else {
                    console.log('\n❌ PROBLEMAS CRÍTICOS - Sistema com falhas graves');
                    status = 'error';
                    message = `❌ SISTEMA COM PROBLEMAS (${score}%)`;
                }
                
                console.groupEnd();
                
                return {
                    status: status,
                    message: message,
                    details: {
                        totalTests: total,
                        passed: passed,
                        score: score,
                        results: results
                    }
                };
            }
        }
    };
    
    // Variável para controlar se o painel já foi criado
    let integrityPanel = null;
    
    return {
        // Registrar testes
        registerTests: function() {
            Object.values(integrityTests).forEach(testConfig => {
                // Usar TestManager se disponível, senão registrar diretamente
                if (typeof TestManager !== 'undefined' && TestManager.registerTest) {
                    const existingTest = TestManager.getTest ? TestManager.getTest(testConfig.id) : null;
                    if (!existingTest) {
                        TestManager.registerTest(testConfig);
                    }
                }
            });
            
            console.log('✅ Módulo de Integridade: Testes registrados');
        },
        
        // Criar painel visual de integridade
        createIntegrityPanel: function() {
            // Se já existe, apenas mostrar
            if (integrityPanel && document.body.contains(integrityPanel)) {
                integrityPanel.style.display = 'flex';
                return integrityPanel;
            }
            
            // Verificar se estamos no sistema de diagnóstico v6.0
            if (typeof PanelManager !== 'undefined' && PanelManager.createPanel) {
                // Usar o sistema de painéis existente
                const panelConfig = {
                    title: '🔍 INTEGRIDADE DO SISTEMA',
                    category: 'integrity',
                    maxTests: 15,
                    position: { top: '150px', left: '600px' },
                    size: { width: '550px', height: '700px' }
                };
                
                integrityPanel = PanelManager.createPanel(panelConfig);
                
                // Verificar se SpecializedPanels existe
                if (typeof SpecializedPanels !== 'undefined') {
                    integrityPanel.element = SpecializedPanels.renderPanel(integrityPanel);
                    
                    // Adicionar testes
                    Object.values(integrityTests).forEach(testConfig => {
                        const test = TestManager.getTest(testConfig.id);
                        if (test) {
                            integrityPanel.tests.push(test.id);
                            SpecializedPanels.addTestToPanel(integrityPanel, test);
                        }
                    });
                    
                    // Adicionar botão especial
                    const testsContainer = integrityPanel.element.querySelector('.tests-container');
                    if (testsContainer) {
                        const buttonHTML = `
                            <div style="background: linear-gradient(135deg, rgba(0, 170, 255, 0.1), rgba(0, 255, 156, 0.1));
                                        padding: 15px;
                                        border-radius: 8px;
                                        border: 2px solid rgba(0, 170, 255, 0.3);
                                        margin: 20px 0;
                                        text-align: center;">
                                <button id="run-complete-integrity" 
                                        style="background: linear-gradient(135deg, #00aaff, #00ff9c);
                                               color: white;
                                               border: none;
                                               padding: 12px 24px;
                                               border-radius: 6px;
                                               font-weight: bold;
                                               cursor: pointer;
                                               width: 100%;
                                               font-size: 14px;
                                               transition: all 0.3s ease;">
                                    🔍 EXECUTAR VERIFICAÇÃO COMPLETA
                                </button>
                                <div style="font-size: 11px; color: #88aaff; margin-top: 8px;">
                                    Versão 16.0 | Score em tempo real
                                </div>
                            </div>
                        `;
                        
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = buttonHTML;
                        testsContainer.appendChild(tempDiv.firstChild);
                        
                        // Adicionar evento
                        document.getElementById('run-complete-integrity').addEventListener('click', async () => {
                            const button = document.getElementById('run-complete-integrity');
                            button.disabled = true;
                            button.textContent = 'EXECUTANDO...';
                            
                            if (integrityPanel.addLog) {
                                integrityPanel.addLog('Iniciando verificação de integridade...', 'info');
                            }
                            
                            const result = await integrityTests.systemIntegrityCheck.execute();
                            
                            button.disabled = false;
                            button.textContent = '🔍 EXECUTAR VERIFICAÇÃO COMPLETA';
                            
                            if (integrityPanel.addLog) {
                                integrityPanel.addLog(`Verificação concluída: ${result.message}`, result.status);
                                integrityPanel.addLog(`Score: ${result.details.score}% | ${result.details.passed}/${result.details.totalTests} testes`, 
                                                    result.status === 'success' ? 'success' : 'warning');
                            }
                        });
                    }
                    
                    // Inicializar logs
                    if (SpecializedPanels.initializePanelLogs) {
                        SpecializedPanels.initializePanelLogs(integrityPanel);
                    }
                    
                    // Tornar arrastável
                    if (SpecializedPanels.makePanelDraggable) {
                        SpecializedPanels.makePanelDraggable(integrityPanel);
                    }
                    
                    console.log('✅ Painel de Integridade criado no sistema de diagnóstico');
                    return integrityPanel;
                }
            }
            
            // Se o sistema de diagnóstico não estiver disponível, criar painel independente
            console.log('⚠️ Sistema de diagnóstico não encontrado. Criando painel independente...');
            return this.createStandalonePanel();
        },
        
        // Criar painel independente
        createStandalonePanel: function() {
            const panelId = 'integrity-panel-' + Date.now();
            const panel = document.createElement('div');
            
            panel.id = panelId;
            panel.style.cssText = `
                position: fixed;
                top: 120px;
                left: 120px;
                width: 520px;
                height: 650px;
                background: linear-gradient(135deg, #0a0a2a, #001a33);
                border: 2px solid #00ff9c;
                border-radius: 12px;
                z-index: 10000;
                box-shadow: 0 0 25px rgba(0, 255, 156, 0.3);
                font-family: 'Segoe UI', monospace;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                resize: both;
            `;
            
            panel.innerHTML = `
                <!-- Cabeçalho -->
                <div style="background: linear-gradient(90deg, rgba(0, 255, 156, 0.2), rgba(0, 170, 255, 0.2));
                            padding: 15px 20px;
                            border-bottom: 1px solid rgba(0, 255, 156, 0.3);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            cursor: move;
                            user-select: none;">
                    
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="color: #00ff9c; font-weight: bold; font-size: 15px;">🔍 INTEGRIDADE DO SISTEMA</span>
                        <span style="background: #00ff9c;
                                    color: #001a33;
                                    padding: 3px 10px;
                                    border-radius: 10px;
                                    font-size: 11px;
                                    font-weight: bold;">
                            v16.0
                        </span>
                    </div>
                    
                    <div style="display: flex; gap: 8px;">
                        <button class="minimize-btn" 
                                style="background: #555;
                                       color: white;
                                       border: none;
                                       width: 28px;
                                       height: 28px;
                                       border-radius: 5px;
                                       cursor: pointer;
                                       font-weight: bold;">
                            −
                        </button>
                        <button class="close-btn" 
                                style="background: #ff5555;
                                       color: white;
                                       border: none;
                                       width: 28px;
                                       height: 28px;
                                       border-radius: 5px;
                                       cursor: pointer;
                                       font-weight: bold;">
                            ×
                        </button>
                    </div>
                </div>
                
                <!-- Conteúdo -->
                <div style="flex: 1;
                            padding: 20px;
                            overflow-y: auto;
                            overflow-x: hidden;">
                    
                    <!-- Introdução -->
                    <div style="background: rgba(0, 255, 156, 0.1);
                                padding: 15px;
                                border-radius: 8px;
                                border-left: 4px solid #00ff9c;
                                margin-bottom: 20px;">
                        <div style="color: #00ff9c; font-weight: bold; margin-bottom: 8px;">
                            🎯 VERIFICAÇÃO FINAL DE INTEGRIDADE
                        </div>
                        <div style="color: #88ffaa; font-size: 13px;">
                            Testa 11 módulos e funcionalidades críticas do sistema após otimização completa.
                            Versão 16.0 do sistema otimizado.
                        </div>
                    </div>
                    
                    <!-- Botão de execução -->
                    <div style="text-align: center; margin-bottom: 25px;">
                        <button id="standalone-run-integrity" 
                                style="background: linear-gradient(135deg, #00ff9c, #00aaff);
                                       color: white;
                                       border: none;
                                       padding: 15px 30px;
                                       border-radius: 8px;
                                       font-weight: bold;
                                       cursor: pointer;
                                       font-size: 16px;
                                       width: 100%;
                                       transition: all 0.3s ease;
                                       box-shadow: 0 4px 15px rgba(0, 255, 156, 0.3);">
                            🚀 EXECUTAR VERIFICAÇÃO COMPLETA
                        </button>
                        <div style="font-size: 12px; color: #88aaff; margin-top: 10px;">
                            Clique para testar todos os 11 módulos do sistema
                        </div>
                    </div>
                    
                    <!-- Resultados -->
                    <div style="margin-bottom: 20px;">
                        <div style="color: #00ff9c; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
                            📊 RESULTADOS:
                        </div>
                        <div id="integrity-results" style="min-height: 200px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 15px;">
                            <div style="color: #88aaff; text-align: center; padding: 20px;">
                                Aguardando execução...
                            </div>
                        </div>
                    </div>
                    
                    <!-- Logs -->
                    <div style="margin-top: 20px;">
                        <div style="color: #00ff9c; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
                            📝 LOGS:
                        </div>
                        <div id="integrity-logs" 
                             style="height: 120px;
                                    overflow-y: auto;
                                    background: rgba(0, 0, 0, 0.3);
                                    border-radius: 6px;
                                    padding: 10px;
                                    border: 1px solid rgba(0, 255, 156, 0.2);
                                    font-size: 12px;
                                    font-family: monospace;">
                            <div style="color: #88aaff;">[Sistema pronto] Painel de integridade inicializado</div>
                        </div>
                    </div>
                </div>
                
                <!-- Rodapé -->
                <div style="background: rgba(0, 255, 156, 0.1);
                            padding: 12px 20px;
                            border-top: 1px solid rgba(0, 255, 156, 0.3);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-size: 11px;">
                    
                    <div style="color: #88ffaa;">
                        <span>Sistema Integrado v16.0 | Use Ctrl+C para copiar</span>
                    </div>
                    
                    <div style="color: #00ff9c; font-weight: bold;">
                        Status: <span id="integrity-status">Pronto</span>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            integrityPanel = panel;
            
            // Sistema de logs
            const logsContainer = panel.querySelector('#integrity-logs');
            function addLog(message, type = 'info') {
                const colors = {
                    info: '#88aaff',
                    success: '#00ff9c',
                    warning: '#ffaa00',
                    error: '#ff5555'
                };
                
                const logEntry = document.createElement('div');
                logEntry.style.cssText = `
                    margin-bottom: 4px;
                    color: ${colors[type] || colors.info};
                    font-size: 11px;
                    padding: 2px 0;
                    border-bottom: 1px dotted rgba(0, 255, 156, 0.2);
                `;
                logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
                
                logsContainer.appendChild(logEntry);
                logsContainer.scrollTop = logsContainer.scrollHeight;
            }
            
            // Função de execução
            const runButton = panel.querySelector('#standalone-run-integrity');
            const resultsContainer = panel.querySelector('#integrity-results');
            const statusSpan = panel.querySelector('#integrity-status');
            
            runButton.addEventListener('click', async function() {
                this.disabled = true;
                this.textContent = 'EXECUTANDO...';
                this.style.opacity = '0.7';
                
                statusSpan.textContent = 'Testando...';
                statusSpan.style.color = '#ffaa00';
                
                addLog('Iniciando verificação de integridade do sistema...', 'info');
                
                try {
                    const result = await integrityTests.systemIntegrityCheck.execute();
                    
                    // Atualizar resultados
                    resultsContainer.innerHTML = '';
                    
                    const scoreHTML = `
                        <div style="text-align: center; margin-bottom: 15px;">
                            <div style="font-size: 32px; color: ${result.status === 'success' ? '#00ff9c' : result.status === 'warning' ? '#ffaa00' : '#ff5555'}; font-weight: bold;">
                                ${result.details.score}%
                            </div>
                            <div style="color: #88aaff; font-size: 12px;">
                                ${result.details.passed}/${result.details.totalTests} testes passaram
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
                            padding: 8px;
                            margin: 5px 0;
                            background: rgba(0, 0, 0, 0.2);
                            border-radius: 4px;
                            border-left: 3px solid ${test.passed ? '#00ff9c' : '#ff5555'};
                        `;
                        
                        testDiv.innerHTML = `
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="color: ${test.passed ? '#00ff9c' : '#ff5555'}">
                                    ${test.passed ? '✅' : '❌'}
                                </span>
                                <span style="color: ${test.passed ? '#88ffaa' : '#ffaaaa'}; font-size: 12px;">
                                    ${test.name}
                                </span>
                            </div>
                            <div style="font-size: 10px; color: #88aaff;">
                                ${test.importance.toUpperCase()}
                            </div>
                        `;
                        
                        resultsContainer.appendChild(testDiv);
                    });
                    
                    // Atualizar status
                    statusSpan.textContent = result.status === 'success' ? '✅ Concluído' : 
                                           result.status === 'warning' ? '⚠️ Avisos' : '❌ Problemas';
                    statusSpan.style.color = result.status === 'success' ? '#00ff9c' : 
                                           result.status === 'warning' ? '#ffaa00' : '#ff5555';
                    
                    addLog(`Verificação concluída: ${result.message}`, result.status);
                    
                } catch (error) {
                    addLog(`Erro na verificação: ${error.message}`, 'error');
                    statusSpan.textContent = '❌ Erro';
                    statusSpan.style.color = '#ff5555';
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
                const content = panel.children[1];
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'flex' : 'none';
                this.textContent = isHidden ? '−' : '+';
            });
            
            // Arrastar
            const header = panel.children[0];
            let isDragging = false;
            let offsetX, offsetY;
            
            header.addEventListener('mousedown', function(e) {
                if (e.target.tagName === 'BUTTON') return;
                
                isDragging = true;
                offsetX = e.clientX - panel.getBoundingClientRect().left;
                offsetY = e.clientY - panel.getBoundingClientRect().top;
                
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', stopDrag);
                e.preventDefault();
            });
            
            function drag(e) {
                if (!isDragging) return;
                panel.style.left = (e.clientX - offsetX) + 'px';
                panel.style.top = (e.clientY - offsetY) + 'px';
            }
            
            function stopDrag() {
                isDragging = false;
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', stopDrag);
            }
            
            addLog('Painel de integridade criado com sucesso', 'success');
            console.log('✅ Painel independente de integridade criado');
            
            return panel;
        },
        
        // Método para adicionar ao painel existente (como aba/subpainel)
        addToExistingPanel: function(panelId) {
            const panel = document.getElementById(panelId);
            if (!panel) {
                console.error(`Painel ${panelId} não encontrado`);
                return false;
            }
            
            // Adicionar aba de integridade
            const tabsContainer = panel.querySelector('.panel-tabs') || panel.querySelector('.panel-header');
            if (tabsContainer) {
                const integrityTab = document.createElement('button');
                integrityTab.textContent = '🔍 Integridade';
                integrityTab.style.cssText = `
                    background: rgba(0, 255, 156, 0.2);
                    color: #00ff9c;
                    border: 1px solid rgba(0, 255, 156, 0.3);
                    padding: 5px 10px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 11px;
                    margin-left: 5px;
                `;
                
                integrityTab.addEventListener('click', () => {
                    this.createIntegrityPanel();
                });
                
                tabsContainer.appendChild(integrityTab);
                console.log('✅ Aba de integridade adicionada ao painel existente');
                return true;
            }
            
            return false;
        }
    };
})();

// ================== INTEGRAÇÃO AUTOMÁTICA COM O SISTEMA ==================

// Inicializar quando o documento carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeIntegrityModule);
} else {
    setTimeout(initializeIntegrityModule, 1000);
}

function initializeIntegrityModule() {
    // Registrar testes
    SystemIntegrityModule.registerTests();
    
    // Adicionar ao sistema de diagnóstico se existir
    if (window.diagnostics) {
        window.diagnostics.integrity = SystemIntegrityModule;
        console.log('✅ Módulo de integridade integrado ao sistema de diagnóstico');
    }
    
    // Criar atalhos globais
    window.IntegrityCheck = {
        run: () => SystemIntegrityModule.integrityTests.systemIntegrityCheck.execute(),
        panel: () => SystemIntegrityModule.createIntegrityPanel(),
        addToPanel: (panelId) => SystemIntegrityModule.addToExistingPanel(panelId)
    };
    
    // Atalho rápido
    window.SI = window.IntegrityCheck;
    
    // Log de sucesso
    console.log('%c🔍 MÓDULO DE INTEGRIDADE DO SISTEMA PRONTO', 
                'color: #00ff9c; font-weight: bold; font-size: 14px; background: #001a33; padding: 5px;');
    console.log('📋 Comandos disponíveis:');
    console.log('• IntegrityCheck.panel() - Criar painel de integridade');
    console.log('• IntegrityCheck.run() - Executar verificação');
    console.log('• SI.panel() - Atalho rápido');
    
    // Tentar adicionar automaticamente aos painéis existentes após 3 segundos
    setTimeout(() => {
        // Procurar painéis de diagnóstico
        const diagnosticPanels = document.querySelectorAll('[id*="diagnostics-panel"], [class*="diagnostics-panel"]');
        diagnosticPanels.forEach(panel => {
            SystemIntegrityModule.addToExistingPanel(panel.id);
        });
    }, 3000);
}

// ================== BOTÃO DE CONTROLE FLUTUANTE PARA INTEGRIDADE ==================

// Criar botão flutuante se não existir
setTimeout(() => {
    if (!document.getElementById('integrity-float-button')) {
        const floatButton = document.createElement('button');
        floatButton.id = 'integrity-float-button';
        floatButton.innerHTML = '🔍';
        floatButton.title = 'Verificação de Integridade';
        floatButton.style.cssText = `
            position: fixed;
            bottom: 160px;
            right: 20px;
            z-index: 99999;
            background: linear-gradient(135deg, #00ff9c, #00aaff);
            color: white;
            border: none;
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0, 255, 156, 0.4);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        floatButton.addEventListener('mouseenter', () => {
            floatButton.style.transform = 'scale(1.1)';
            floatButton.style.boxShadow = '0 6px 20px rgba(0, 255, 156, 0.6)';
        });
        
        floatButton.addEventListener('mouseleave', () => {
            floatButton.style.transform = 'scale(1)';
            floatButton.style.boxShadow = '0 4px 15px rgba(0, 255, 156, 0.4)';
        });
        
        floatButton.addEventListener('click', () => {
            SystemIntegrityModule.createIntegrityPanel();
        });
        
        document.body.appendChild(floatButton);
        console.log('✅ Botão flutuante de integridade criado');
    }
}, 2000);
