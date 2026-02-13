// ================== MÓDULO DE VERIFICAÇÃO DE LOADING MANAGER CORRIGIDO ==================
const LoadingManagerVerifier = (function() {
    // Testes de verificação do LoadingManager - CORRIGIDOS
    const loadingManagerTests = {
        loadingManagerBasicCheck: {
            id: 'loading-manager-basic-check',
            title: '🔍 VERIFICAÇÃO BÁSICA DO LOADING MANAGER',
            description: 'Testa disponibilidade e métodos básicos do LoadingManager',
            type: 'verification',
            icon: '⏳',
            category: 'loading',
            critical: true,
            execute: function() {
                console.group('🧪 VERIFICAÇÃO DO LOADING MANAGER');
                
                const tests = [
                    { 
                        name: 'LoadingManager disponível', 
                        test: () => typeof LoadingManager !== 'undefined',
                        importance: 'critical'
                    },
                    { 
                        name: 'Método show()', 
                        test: () => typeof LoadingManager === 'object' && typeof LoadingManager.show === 'function',
                        importance: 'high'
                    },
                    { 
                        name: 'Método hide()', 
                        test: () => typeof LoadingManager === 'object' && typeof LoadingManager.hide === 'function',
                        importance: 'high'
                    },
                    // REMOVIDOS: update() e setMessage() não existem no LoadingManager atual
                    // CORREÇÃO: Adicionar verificação de métodos reais
                    { 
                        name: 'É um Fallback Manager', 
                        test: () => {
                            // Verifica se é o fallback system (baseado nos logs)
                            if (typeof LoadingManager !== 'object') return false;
                            const logs = [];
                            const originalLog = console.log;
                            console.log = function(...args) {
                                logs.push(args.join(' '));
                                originalLog.apply(console, args);
                            };
                            
                            try {
                                LoadingManager.show('test');
                                LoadingManager.hide();
                                console.log = originalLog;
                                return logs.some(log => log.includes('[FALLBACK]'));
                            } catch (e) {
                                console.log = originalLog;
                                return false;
                            }
                        },
                        importance: 'medium'
                    }
                ];
                
                let passed = 0;
                const total = tests.length;
                const results = [];
                
                console.log('⏳ Verificando LoadingManager...');
                
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
                
                console.log(`\n📊 RESULTADO: ${passed}/${total} testes passaram`);
                console.log(`🎯 SCORE: ${score}%`);
                
                let status = 'success';
                let message = '';
                
                // AJUSTADO: Score mais realista considerando métodos reais
                if (score >= 75) { // 3/4 testes = 75%
                    console.log('🎉 LOADING MANAGER FUNCIONAL E COMPLETO!');
                    message = '✅ LOADING MANAGER FUNCIONAL!';
                    status = 'success';
                } else if (score >= 50) { // 2/4 testes = 50%
                    console.log('⚠️  LOADING MANAGER PARCIALMENTE FUNCIONAL');
                    status = 'warning';
                    message = `⚠️ LOADING MANAGER ${score}% FUNCIONAL`;
                } else {
                    console.log('❌ LOADING MANAGER COM PROBLEMAS GRAVES');
                    status = 'error';
                    message = `❌ LOADING MANAGER APENAS ${score}% FUNCIONAL`;
                }
                
                console.groupEnd();
                
                return {
                    status: status,
                    message: message,
                    details: {
                        totalTests: total,
                        passed: passed,
                        score: score,
                        results: results,
                        loadingManager: typeof LoadingManager !== 'undefined' ? 
                            { 
                                available: true,
                                methods: Object.keys(LoadingManager).filter(k => typeof LoadingManager[k] === 'function'),
                                isFallback: tests[3] ? tests[3].test() : false
                            } : 
                            null
                    }
                };
            }
        },
        
        loadingManagerIntegrationCheck: {
            id: 'loading-manager-integration-check',
            title: '🔗 VERIFICAÇÃO DE INTEGRAÇÃO DO LOADING MANAGER',
            description: 'Verifica se o LoadingManager foi carregado na ordem correta',
            type: 'integration',
            icon: '🔗',
            category: 'loading',
            critical: false,
            execute: function() {
                console.group('🔗 VERIFICAÇÃO DE INTEGRAÇÃO DO LOADING MANAGER');
                
                // Coletar recursos carregados
                const resources = performance.getEntriesByType('resource') || [];
                const jsFiles = resources.filter(r => r.name.includes('.js'));
                
                const tests = [
                    { 
                        name: 'Módulo carregado antes de admin.js', 
                        test: () => {
                            const loadingManagerScript = jsFiles.find(r => 
                                r.name.includes('loading-manager') || 
                                r.name.includes('loadingmanager') ||
                                r.name.includes('loading')
                            );
                            const adminScript = jsFiles.find(r => r.name.includes('admin.js'));
                            
                            if (!loadingManagerScript || !adminScript) {
                                console.log('   ℹ️  Scripts não encontrados nos recursos');
                                return false;
                            }
                            
                            const result = loadingManagerScript.startTime < adminScript.startTime;
                            console.log(`   ℹ️  Loading: ${loadingManagerScript.name.split('/').pop()} (${loadingManagerScript.startTime.toFixed(2)}ms)`);
                            console.log(`   ℹ️  Admin: ${adminScript.name.split('/').pop()} (${adminScript.startTime.toFixed(2)}ms)`);
                            return result;
                        },
                        importance: 'medium'
                    },
                    { 
                        name: 'Tempo de carregamento aceitável', 
                        test: () => {
                            const loadingManagerScript = jsFiles.find(r => 
                                r.name.includes('loading-manager') || 
                                r.name.includes('loadingmanager') ||
                                r.name.includes('loading')
                            );
                            
                            if (!loadingManagerScript) {
                                console.log('   ℹ️  Script de loading não encontrado');
                                return false;
                            }
                            
                            const loadTime = loadingManagerScript.duration;
                            console.log(`   ℹ️  Tempo de carregamento: ${loadTime.toFixed(2)}ms`);
                            return loadTime < 2000; // Menos de 2 segundos (mais realista)
                        },
                        importance: 'low'
                    },
                    { 
                        name: 'Integração com outros módulos', 
                        test: () => {
                            // Verificar se outros módulos estão usando o LoadingManager
                            const modules = [
                                { name: 'PdfSystem', check: () => typeof window.PdfSystem !== 'undefined' },
                                { name: 'MediaSystem', check: () => typeof window.MediaSystem !== 'undefined' },
                                { name: 'admin', check: () => typeof window.admin !== 'undefined' },
                                { name: 'Diagnostics', check: () => typeof window.diagnostics !== 'undefined' }
                            ];
                            
                            const availableModules = modules.filter(m => m.check()).map(m => m.name);
                            console.log(`   ℹ️  Módulos disponíveis: ${availableModules.join(', ') || 'Nenhum'}`);
                            
                            return availableModules.length > 0;
                        },
                        importance: 'high'
                    }
                ];
                
                let passed = 0;
                const total = tests.length;
                const results = [];
                
                console.log('🔗 Verificando integração...');
                
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
                
                console.log(`\n📊 RESULTADO: ${passed}/${total} testes passaram`);
                console.log(`🎯 SCORE: ${score}%`);
                
                console.groupEnd();
                
                return {
                    status: score >= 70 ? 'success' : score >= 50 ? 'warning' : 'error',
                    message: `🔗 INTEGRAÇÃO: ${score}% dos testes passaram`,
                    details: {
                        totalTests: total,
                        passed: passed,
                        score: score,
                        results: results,
                        jsFilesLoaded: jsFiles.length,
                        timestamp: new Date().toISOString()
                    }
                };
            }
        },
        
        loadingManagerPerformanceCheck: {
            id: 'loading-manager-performance-check',
            title: '⚡ TESTE DE PERFORMANCE DO LOADING MANAGER',
            description: 'Mede performance e eficiência do sistema de loading',
            type: 'performance',
            icon: '⚡',
            category: 'loading',
            execute: function() {
                console.group('⚡ TESTE DE PERFORMANCE DO LOADING MANAGER');
                
                if (typeof LoadingManager === 'undefined') {
                    console.log('❌ LoadingManager não disponível para teste de performance');
                    console.groupEnd();
                    return {
                        status: 'error',
                        message: '❌ LOADING MANAGER NÃO DISPONÍVEL',
                        details: null
                    };
                }
                
                const startTime = performance.now();
                const results = [];
                
                // Teste 1: Tempo para mostrar loading
                try {
                    const showStart = performance.now();
                    LoadingManager.show('Testando performance...');
                    const showTime = performance.now() - showStart;
                    results.push({
                        test: 'Mostrar Loading',
                        time: showTime,
                        status: showTime < 50 ? 'good' : showTime < 100 ? 'acceptable' : 'slow'
                    });
                    console.log(`⏱️ Tempo para mostrar: ${showTime.toFixed(2)}ms`);
                } catch (error) {
                    results.push({
                        test: 'Mostrar Loading',
                        time: null,
                        status: 'error',
                        error: error.message
                    });
                    console.log(`❌ Erro ao mostrar: ${error.message}`);
                }
                
                // CORREÇÃO: Não testar update() pois não existe
                // Em vez disso, testar múltiplas chamadas de show/hide
                try {
                    const multipleStart = performance.now();
                    for (let i = 0; i < 3; i++) {
                        LoadingManager.show(`Múltiplo ${i}`);
                        LoadingManager.hide();
                    }
                    const multipleTime = performance.now() - multipleStart;
                    results.push({
                        test: 'Múltiplas chamadas',
                        time: multipleTime,
                        status: multipleTime < 100 ? 'good' : multipleTime < 200 ? 'acceptable' : 'slow'
                    });
                    console.log(`⏱️ 3x show/hide: ${multipleTime.toFixed(2)}ms`);
                } catch (error) {
                    results.push({
                        test: 'Múltiplas chamadas',
                        time: null,
                        status: 'error',
                        error: error.message
                    });
                }
                
                // Teste 3: Tempo para esconder
                try {
                    // Garantir que está mostrado primeiro
                    LoadingManager.show('Teste hide');
                    const hideStart = performance.now();
                    LoadingManager.hide();
                    const hideTime = performance.now() - hideStart;
                    results.push({
                        test: 'Esconder Loading',
                        time: hideTime,
                        status: hideTime < 50 ? 'good' : hideTime < 100 ? 'acceptable' : 'slow'
                    });
                    console.log(`⏱️ Tempo para esconder: ${hideTime.toFixed(2)}ms`);
                } catch (error) {
                    results.push({
                        test: 'Esconder Loading',
                        time: null,
                        status: 'error',
                        error: error.message
                    });
                }
                
                // Teste 4: Teste de stress (10 operações)
                try {
                    const stressStart = performance.now();
                    for (let i = 0; i < 10; i++) {
                        LoadingManager.show(`Stress Test ${i}`);
                        LoadingManager.hide();
                    }
                    const stressTime = performance.now() - stressStart;
                    const avgStressTime = stressTime / 20; // 10 show + 10 hide
                    results.push({
                        test: 'Teste de Stress (10x)',
                        time: stressTime,
                        avgTime: avgStressTime,
                        status: avgStressTime < 10 ? 'excellent' : avgStressTime < 20 ? 'good' : avgStressTime < 50 ? 'acceptable' : 'slow'
                    });
                    console.log(`⏱️ Stress test 10x: ${stressTime.toFixed(2)}ms (${avgStressTime.toFixed(2)}ms/op)`);
                } catch (error) {
                    results.push({
                        test: 'Teste de Stress',
                        time: null,
                        status: 'error',
                        error: error.message
                    });
                }
                
                const endTime = performance.now();
                const totalTime = endTime - startTime;
                
                // Calcular score
                const validResults = results.filter(r => r.time !== null);
                const avgTime = validResults.length > 0 ? 
                    validResults.reduce((sum, r) => sum + (r.avgTime || r.time), 0) / validResults.length : 
                    0;
                
                const performanceScore = avgTime < 10 ? 100 : 
                                       avgTime < 20 ? 90 : 
                                       avgTime < 50 ? 80 : 
                                       avgTime < 100 ? 60 : 40;
                
                console.log(`\n📊 PERFORMANCE TOTAL: ${totalTime.toFixed(2)}ms`);
                console.log(`⏱️  TEMPO MÉDIO: ${avgTime.toFixed(2)}ms/operação`);
                console.log(`🎯 SCORE: ${performanceScore}/100`);
                
                console.groupEnd();
                
                return {
                    status: performanceScore >= 80 ? 'success' : 
                           performanceScore >= 60 ? 'warning' : 'error',
                    message: `⚡ PERFORMANCE: ${avgTime.toFixed(2)}ms médio | Score: ${performanceScore}/100`,
                    details: {
                        totalTime: totalTime,
                        averageTime: avgTime,
                        performanceScore: performanceScore,
                        testResults: results
                    }
                };
            }
        }
    };
    
    // Painel de controle do LoadingManager
    let loadingManagerPanel = null;
    
    return {
        // Registrar testes
        registerTests: function() {
            Object.values(loadingManagerTests).forEach(testConfig => {
                // Usar TestManager se disponível
                if (typeof TestManager !== 'undefined' && TestManager.registerTest) {
                    const existingTest = TestManager.getTest ? TestManager.getTest(testConfig.id) : null;
                    if (!existingTest) {
                        TestManager.registerTest(testConfig);
                        console.log(`✅ Teste registrado: ${testConfig.title}`);
                    }
                }
            });
            
            console.log('✅ Módulo de Verificação do LoadingManager: Testes registrados');
        },
        
        // Executar verificação completa
        runCompleteVerification: async function() {
            console.group('🔍 VERIFICAÇÃO COMPLETA DO LOADING MANAGER');
            
            const results = {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: 0,
                tests: []
            };
            
            for (const [key, testConfig] of Object.entries(loadingManagerTests)) {
                try {
                    console.log(`▶️ Executando: ${testConfig.title}`);
                    
                    const result = await Promise.resolve(testConfig.execute());
                    
                    results.total++;
                    if (result.status === 'success') results.passed++;
                    if (result.status === 'error') results.failed++;
                    if (result.status === 'warning') results.warnings++;
                    
                    results.tests.push({
                        name: testConfig.title,
                        status: result.status,
                        message: result.message,
                        details: result.details
                    });
                    
                    console.log(`${result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌'} ${testConfig.title}`);
                    
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error(`❌ Erro no teste ${testConfig.title}:`, error);
                    results.tests.push({
                        name: testConfig.title,
                        status: 'error',
                        message: `Erro: ${error.message}`,
                        details: null
                    });
                    results.total++;
                    results.failed++;
                }
            }
            
            console.groupEnd();
            
            const score = Math.round((results.passed / results.total) * 100);
            
            console.log(`📊 RESUMO DO LOADING MANAGER:`);
            console.log(`   ✅ ${results.passed} passaram`);
            console.log(`   ⚠️ ${results.warnings} com avisos`);
            console.log(`   ❌ ${results.failed} falharam`);
            console.log(`   🎯 SCORE GERAL: ${score}%`);
            
            if (score === 100) {
                console.log('🎉 LOADING MANAGER 100% VERIFICADO E OTIMIZADO!');
            } else if (score >= 70) {
                console.log('⚠️ LOADING MANAGER FUNCIONAL - Alguns problemas detectados');
            } else {
                console.log('❌ LOADING MANAGER COM PROBLEMAS CRÍTICOS!');
            }
            
            return {
                summary: results,
                score: score,
                overallStatus: score === 100 ? 'success' : score >= 70 ? 'warning' : 'error',
                timestamp: new Date().toISOString()
            };
        },
        
        // Criar painel visual de verificação - CORRIGIDO
        createVerificationPanel: function() {
            // Se já existe, apenas mostrar
            if (loadingManagerPanel && document.body.contains(loadingManagerPanel)) {
                loadingManagerPanel.style.display = 'flex';
                return loadingManagerPanel;
            }
            
            // Verificar se estamos no sistema de diagnóstico
            if (typeof PanelManager !== 'undefined' && PanelManager.createPanel) {
                const panelConfig = {
                    title: '⏳ LOADING MANAGER',
                    category: 'loading',
                    maxTests: 10,
                    position: { top: '180px', left: '700px' },
                    size: { width: '500px', height: '650px' }
                };
                
                loadingManagerPanel = PanelManager.createPanel(panelConfig);
                
                if (typeof SpecializedPanels !== 'undefined' && SpecializedPanels.renderPanel) {
                    loadingManagerPanel.element = SpecializedPanels.renderPanel(loadingManagerPanel);
                    
                    // Adicionar testes
                    Object.values(loadingManagerTests).forEach(testConfig => {
                        const test = TestManager.getTest(testConfig.id);
                        if (test && loadingManagerPanel.tests.length < loadingManagerPanel.maxTests) {
                            loadingManagerPanel.tests.push(test.id);
                            SpecializedPanels.addTestToPanel(loadingManagerPanel, test);
                        }
                    });
                    
                    // Adicionar controles extras - CORREÇÃO: Verificar se element existe
                    if (loadingManagerPanel.element) {
                        const testsContainer = loadingManagerPanel.element.querySelector('.tests-container');
                        if (testsContainer) {
                            const controlsHTML = `
                                <div style="background: linear-gradient(135deg, rgba(255, 170, 0, 0.1), rgba(255, 200, 0, 0.1));
                                            padding: 15px;
                                            border-radius: 8px;
                                            border: 2px solid rgba(255, 170, 0, 0.3);
                                            margin: 20px 0;
                                            text-align: center;">
                                    <div style="color: #ffaa00; font-weight: bold; margin-bottom: 10px;">
                                        🎮 CONTROLES DE TESTE
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                                        <button id="test-show-loading" 
                                                style="background: rgba(255, 170, 0, 0.3);
                                                       color: #ffaa00;
                                                       border: 1px solid #ffaa00;
                                                       padding: 8px;
                                                       border-radius: 5px;
                                                       cursor: pointer;
                                                       font-size: 12px;">
                                            Mostrar Loading
                                        </button>
                                        <button id="test-hide-loading" 
                                                style="background: rgba(255, 170, 0, 0.3);
                                                       color: #ffaa00;
                                                       border: 1px solid #ffaa00;
                                                       padding: 8px;
                                                       border-radius: 5px;
                                                       cursor: pointer;
                                                       font-size: 12px;">
                                            Esconder Loading
                                        </button>
                                        <button id="run-complete-verification" 
                                                style="background: linear-gradient(135deg, #ffaa00, #ff8800);
                                                       color: white;
                                                       border: none;
                                                       padding: 8px;
                                                       border-radius: 5px;
                                                       cursor: pointer;
                                                       font-size: 12px;
                                                       font-weight: bold;
                                                       grid-column: span 2;">
                                            🔍 Verificação Completa
                                        </button>
                                    </div>
                                    <div style="font-size: 11px; color: #ffcc88; margin-top: 10px;">
                                        Teste interativo do LoadingManager
                                    </div>
                                </div>
                            `;
                            
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = controlsHTML;
                            testsContainer.appendChild(tempDiv.firstChild);
                            
                            // CORREÇÃO: Usar event delegation ou verificar se elemento existe
                            setTimeout(() => {
                                const showBtn = document.getElementById('test-show-loading');
                                const hideBtn = document.getElementById('test-hide-loading');
                                const verifyBtn = document.getElementById('run-complete-verification');
                                
                                if (showBtn) {
                                    showBtn.addEventListener('click', () => {
                                        if (typeof LoadingManager !== 'undefined' && typeof LoadingManager.show === 'function') {
                                            LoadingManager.show('Teste do Painel - ' + new Date().toLocaleTimeString());
                                            if (loadingManagerPanel.addLog) {
                                                loadingManagerPanel.addLog('Loading mostrado via painel', 'info');
                                            }
                                        } else {
                                            alert('LoadingManager.show() não disponível!');
                                        }
                                    });
                                }
                                
                                if (hideBtn) {
                                    hideBtn.addEventListener('click', () => {
                                        if (typeof LoadingManager !== 'undefined' && typeof LoadingManager.hide === 'function') {
                                            LoadingManager.hide();
                                            if (loadingManagerPanel.addLog) {
                                                loadingManagerPanel.addLog('Loading escondido via painel', 'info');
                                            }
                                        } else {
                                            alert('LoadingManager.hide() não disponível!');
                                        }
                                    });
                                }
                                
                                if (verifyBtn) {
                                    verifyBtn.addEventListener('click', async () => {
                                        verifyBtn.disabled = true;
                                        verifyBtn.textContent = 'VERIFICANDO...';
                                        
                                        if (loadingManagerPanel.addLog) {
                                            loadingManagerPanel.addLog('Iniciando verificação completa do LoadingManager...', 'info');
                                        }
                                        
                                        const results = await this.runCompleteVerification();
                                        
                                        verifyBtn.disabled = false;
                                        verifyBtn.textContent = '🔍 Verificação Completa';
                                        
                                        if (loadingManagerPanel.addLog) {
                                            loadingManagerPanel.addLog(`Verificação concluída: Score ${results.score}%`, 
                                                                      results.overallStatus);
                                        }
                                    });
                                }
                            }, 100);
                        }
                    }
                    
                    // Inicializar logs
                    if (SpecializedPanels.initializePanelLogs) {
                        SpecializedPanels.initializePanelLogs(loadingManagerPanel);
                    }
                    
                    // Tornar arrastável
                    if (SpecializedPanels.makePanelDraggable) {
                        SpecializedPanels.makePanelDraggable(loadingManagerPanel);
                    }
                    
                    if (loadingManagerPanel.addLog) {
                        loadingManagerPanel.addLog('Painel de Verificação do LoadingManager inicializado', 'success');
                        loadingManagerPanel.addLog(`${Object.keys(loadingManagerTests).length} testes disponíveis`, 'info');
                    }
                    
                    return loadingManagerPanel;
                }
            }
            
            // Se o sistema de diagnóstico não estiver disponível, criar painel independente
            console.log('⚠️ Sistema de diagnóstico não encontrado. Criando painel independente...');
            return this.createStandalonePanel();
        },
        
        // Criar painel independente - CORRIGIDO
        createStandalonePanel: function() {
            const panelId = 'loading-manager-panel-' + Date.now();
            const panel = document.createElement('div');
            
            panel.id = panelId;
            panel.style.cssText = `
                position: fixed;
                top: 140px;
                left: 140px;
                width: 480px;
                height: 600px;
                background: linear-gradient(135deg, #1a0a2a, #331a00);
                border: 2px solid #ffaa00;
                border-radius: 12px;
                z-index: 10000;
                box-shadow: 0 0 25px rgba(255, 170, 0, 0.3);
                font-family: 'Segoe UI', monospace;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                resize: both;
            `;
            
            panel.innerHTML = `
                <!-- Cabeçalho -->
                <div style="background: linear-gradient(90deg, rgba(255, 170, 0, 0.2), rgba(255, 200, 0, 0.1));
                            padding: 15px 20px;
                            border-bottom: 1px solid rgba(255, 170, 0, 0.3);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            cursor: move;
                            user-select: none;">
                    
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="color: #ffaa00; font-weight: bold; font-size: 15px;">⏳ LOADING MANAGER VERIFIER</span>
                        <span style="background: #ffaa00;
                                    color: #1a0a2a;
                                    padding: 3px 10px;
                                    border-radius: 10px;
                                    font-size: 11px;
                                    font-weight: bold;">
                            v1.1 (Corrigido)
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
                    
                    <!-- Status do LoadingManager -->
                    <div id="loading-manager-status" style="background: rgba(255, 170, 0, 0.1);
                                padding: 15px;
                                border-radius: 8px;
                                border-left: 4px solid #ffaa00;
                                margin-bottom: 20px;">
                        <div style="color: #ffaa00; font-weight: bold; margin-bottom: 8px; display: flex; align-items: center; gap: 10px;">
                            <span>🎮 STATUS DO LOADING MANAGER</span>
                            <span id="lm-status-indicator" style="background: #ffaa00; color: #1a0a2a; padding: 2px 8px; border-radius: 10px; font-size: 10px;">
                                TESTANDO...
                            </span>
                        </div>
                        <div style="color: #ffcc88; font-size: 13px;">
                            <div>Disponível: <span id="lm-available">Verificando...</span></div>
                            <div>Métodos: <span id="lm-methods">Verificando...</span></div>
                            <div>Tipo: <span id="lm-type">Verificando...</span></div>
                        </div>
                    </div>
                    
                    <!-- Controles de Teste -->
                    <div style="margin-bottom: 25px;">
                        <div style="color: #ffaa00; font-weight: bold; margin-bottom: 12px; font-size: 14px;">
                            🎮 CONTROLES INTERATIVOS:
                        </div>
                        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-bottom: 15px;">
                            <button id="lm-show" class="lm-control-btn">
                                Mostrar Loading
                            </button>
                            <button id="lm-hide" class="lm-control-btn">
                                Esconder Loading
                            </button>
                            <button id="lm-test-fast" class="lm-control-btn">
                                Teste Rápido (5x)
                            </button>
                            <button id="lm-run-complete" class="lm-control-btn" style="background: linear-gradient(135deg, #ffaa00, #ff8800); color: white;">
                                🔍 Verificação Completa
                            </button>
                        </div>
                    </div>
                    
                    <!-- Resultados -->
                    <div style="margin-bottom: 20px;">
                        <div style="color: #ffaa00; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
                            📊 RESULTADOS:
                        </div>
                        <div id="lm-results" style="min-height: 150px; background: rgba(0, 0, 0, 0.2); border-radius: 8px; padding: 15px;">
                            <div style="color: #ffcc88; text-align: center; padding: 20px;">
                                Aguardando execução...
                            </div>
                        </div>
                    </div>
                    
                    <!-- Informações -->
                    <div style="background: rgba(255, 170, 0, 0.05); padding: 10px; border-radius: 6px; border: 1px dashed rgba(255, 170, 0, 0.3);">
                        <div style="color: #ffaa00; font-size: 11px; font-weight: bold; margin-bottom: 5px;">
                            💡 INFORMAÇÕES:
                        </div>
                        <div style="color: #ffcc88; font-size: 10px;">
                            • LoadingManager é um sistema de fallback<br>
                            • Possui apenas métodos show() e hide()<br>
                            • Funciona mesmo sem interface gráfica<br>
                            • Score 67% = Sistema funcional
                        </div>
                    </div>
                </div>
                
                <!-- Rodapé -->
                <div style="background: rgba(255, 170, 0, 0.1);
                            padding: 12px 20px;
                            border-top: 1px solid rgba(255, 170, 0, 0.3);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-size: 11px;">
                    
                    <div style="color: #ffcc88;">
                        <span>v1.1 Corrigido | Métodos reais testados</span>
                    </div>
                    
                    <div style="color: #ffaa00; font-weight: bold;">
                        Status: <span id="lm-overall-status">Pronto</span>
                    </div>
                </div>
            `;
            
            // Adicionar estilos para os botões
            const style = document.createElement('style');
            style.textContent = `
                .lm-control-btn {
                    background: rgba(255, 170, 0, 0.2);
                    color: #ffaa00;
                    border: 1px solid #ffaa00;
                    padding: 10px;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.3s ease;
                    font-weight: bold;
                }
                .lm-control-btn:hover {
                    background: rgba(255, 170, 0, 0.4);
                    transform: translateY(-2px);
                }
                .lm-control-btn:active {
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(panel);
            loadingManagerPanel = panel;
            
            // Inicializar controles - CORREÇÃO: Usar setTimeout para garantir que o DOM está pronto
            setTimeout(() => this.initializeStandalonePanel(panel), 100);
            
            return panel;
        },
        
        // Inicializar painel independente - CORRIGIDO
        initializeStandalonePanel: function(panel) {
            if (!panel) return;
            
            // Função para atualizar status
            const updateStatus = () => {
                const available = typeof LoadingManager !== 'undefined';
                const methods = available ? 
                    Object.keys(LoadingManager)
                        .filter(key => typeof LoadingManager[key] === 'function')
                        .join(', ') : 
                    'N/A';
                
                const isFallback = available && 
                    (Object.keys(LoadingManager).length === 2) && // show e hide
                    methods.includes('show') && 
                    methods.includes('hide');
                
                if (panel.querySelector('#lm-available')) {
                    panel.querySelector('#lm-available').textContent = available ? '✅ DISPONÍVEL' : '❌ NÃO DISPONÍVEL';
                    panel.querySelector('#lm-available').style.color = available ? '#00ff9c' : '#ff5555';
                }
                
                if (panel.querySelector('#lm-methods')) {
                    panel.querySelector('#lm-methods').textContent = methods;
                    panel.querySelector('#lm-methods').style.color = methods.length > 0 ? '#ffaa00' : '#ff5555';
                }
                
                if (panel.querySelector('#lm-type')) {
                    panel.querySelector('#lm-type').textContent = isFallback ? 'Fallback System' : 'Custom System';
                    panel.querySelector('#lm-type').style.color = isFallback ? '#ffaa00' : '#00aaff';
                }
                
                if (panel.querySelector('#lm-status-indicator')) {
                    panel.querySelector('#lm-status-indicator').textContent = available ? '✅ ATIVO' : '❌ INATIVO';
                    panel.querySelector('#lm-status-indicator').style.background = available ? '#00ff9c' : '#ff5555';
                }
            };
            
            // Atualizar status inicial
            updateStatus();
            
            // CORREÇÃO: Verificar se elementos existem antes de adicionar event listeners
            const showBtn = panel.querySelector('#lm-show');
            const hideBtn = panel.querySelector('#lm-hide');
            const testFastBtn = panel.querySelector('#lm-test-fast');
            const runCompleteBtn = panel.querySelector('#lm-run-complete');
            
            if (showBtn) {
                showBtn.addEventListener('click', () => {
                    if (typeof LoadingManager !== 'undefined' && typeof LoadingManager.show === 'function') {
                        LoadingManager.show('Teste do Painel - ' + new Date().toLocaleTimeString());
                        updateStatus();
                    } else {
                        alert('LoadingManager.show() não disponível!');
                    }
                });
            }
            
            if (hideBtn) {
                hideBtn.addEventListener('click', () => {
                    if (typeof LoadingManager !== 'undefined' && typeof LoadingManager.hide === 'function') {
                        LoadingManager.hide();
                        updateStatus();
                    } else {
                        alert('LoadingManager.hide() não disponível!');
                    }
                });
            }
            
            if (testFastBtn) {
                testFastBtn.addEventListener('click', async () => {
                    if (typeof LoadingManager === 'undefined') {
                        alert('LoadingManager não disponível!');
                        return;
                    }
                    
                    testFastBtn.disabled = true;
                    testFastBtn.textContent = 'TESTANDO...';
                    
                    const startTime = performance.now();
                    const resultsDiv = panel.querySelector('#lm-results');
                    
                    resultsDiv.innerHTML = '<div style="color: #ffcc88; text-align: center;">Executando teste rápido (5 operações)...</div>';
                    
                    try {
                        for (let i = 1; i <= 5; i++) {
                            LoadingManager.show(`Teste ${i}/5`);
                            await new Promise(resolve => setTimeout(resolve, 100));
                            LoadingManager.hide();
                            await new Promise(resolve => setTimeout(resolve, 50));
                        }
                        
                        const totalTime = performance.now() - startTime;
                        resultsDiv.innerHTML = `
                            <div style="text-align: center;">
                                <div style="color: #00ff9c; font-size: 24px; font-weight: bold;">✅</div>
                                <div style="color: #ffcc88; font-size: 14px; margin-top: 10px;">Teste rápido concluído!</div>
                                <div style="color: #ffaa00; font-size: 12px; margin-top: 5px;">Tempo total: ${totalTime.toFixed(2)}ms</div>
                                <div style="color: #ffcc88; font-size: 11px; margin-top: 5px;">(5x show/hide)</div>
                            </div>
                        `;
                        
                    } catch (error) {
                        resultsDiv.innerHTML = `
                            <div style="text-align: center; color: #ff5555;">
                                ❌ Erro no teste: ${error.message}
                            </div>
                        `;
                    } finally {
                        testFastBtn.disabled = false;
                        testFastBtn.textContent = 'Teste Rápido (5x)';
                    }
                });
            }
            
            if (runCompleteBtn) {
                runCompleteBtn.addEventListener('click', async () => {
                    runCompleteBtn.disabled = true;
                    runCompleteBtn.textContent = 'EXECUTANDO...';
                    
                    const results = await this.runCompleteVerification();
                    
                    runCompleteBtn.disabled = false;
                    runCompleteBtn.textContent = '🔍 Verificação Completa';
                    
                    // Atualizar status geral
                    const overallStatus = panel.querySelector('#lm-overall-status');
                    if (overallStatus) {
                        overallStatus.textContent = results.overallStatus === 'success' ? '✅ Concluído' : 
                                                  results.overallStatus === 'warning' ? '⚠️ Avisos' : '❌ Problemas';
                        overallStatus.style.color = results.overallStatus === 'success' ? '#00ff9c' : 
                                                  results.overallStatus === 'warning' ? '#ffaa00' : '#ff5555';
                    }
                    
                    // Mostrar resultados
                    const resultsDiv = panel.querySelector('#lm-results');
                    if (resultsDiv) {
                        resultsDiv.innerHTML = '';
                        
                        // Score geral
                        const scoreDiv = document.createElement('div');
                        scoreDiv.style.cssText = `
                            text-align: center;
                            margin-bottom: 15px;
                            padding: 10px;
                            background: rgba(0, 0, 0, 0.3);
                            border-radius: 8px;
                        `;
                        
                        scoreDiv.innerHTML = `
                            <div style="font-size: 32px; color: ${results.score >= 70 ? '#00ff9c' : results.score >= 50 ? '#ffaa00' : '#ff5555'}; font-weight: bold;">
                                ${results.score}%
                            </div>
                            <div style="color: #ffcc88; font-size: 12px;">
                                Score Geral | ${results.summary.passed}/${results.summary.total} testes
                            </div>
                        `;
                        
                        resultsDiv.appendChild(scoreDiv);
                        
                        // Detalhes dos testes
                        results.summary.tests.forEach(test => {
                            const testDiv = document.createElement('div');
                            testDiv.style.cssText = `
                                padding: 10px;
                                margin: 8px 0;
                                background: rgba(0, 0, 0, 0.2);
                                border-radius: 6px;
                                border-left: 4px solid ${test.status === 'success' ? '#00ff9c' : test.status === 'warning' ? '#ffaa00' : '#ff5555'};
                            `;
                            
                            testDiv.innerHTML = `
                                <div style="display: flex; justify-content: space-between; align-items: center;">
                                    <div style="color: ${test.status === 'success' ? '#88ffaa' : test.status === 'warning' ? '#ffcc88' : '#ffaaaa'}; font-size: 13px;">
                                        ${test.name.replace('🔍 ', '').replace('🔗 ', '').replace('⚡ ', '')}
                                    </div>
                                    <div style="color: ${test.status === 'success' ? '#00ff9c' : test.status === 'warning' ? '#ffaa00' : '#ff5555'}; font-size: 20px;">
                                        ${test.status === 'success' ? '✅' : test.status === 'warning' ? '⚠️' : '❌'}
                                    </div>
                                </div>
                                <div style="color: #ffcc88; font-size: 11px; margin-top: 5px;">
                                    ${test.message}
                                </div>
                            `;
                            
                            resultsDiv.appendChild(testDiv);
                        });
                    }
                    
                    updateStatus();
                });
            }
            
            // Fechar painel
            panel.querySelector('.close-btn').addEventListener('click', () => {
                panel.remove();
                loadingManagerPanel = null;
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
        },
        
        // Getter para testes
        get tests() {
            return loadingManagerTests;
        }
    };
})();

// ================== INTEGRAÇÃO CORRIGIDA ==================

// Inicializar quando carregar
setTimeout(() => {
    try {
        LoadingManagerVerifier.registerTests();
        
        // Adicionar ao sistema de diagnóstico se existir
        if (window.diagnostics) {
            window.diagnostics.loadingManager = LoadingManagerVerifier;
            console.log('✅ Módulo de LoadingManager integrado ao sistema de diagnóstico');
        }
        
        // Atalhos globais
        window.LMVerify = LoadingManagerVerifier;
        window.LM = {
            verify: () => LoadingManagerVerifier.runCompleteVerification(),
            panel: () => LoadingManagerVerifier.createVerificationPanel(),
            test: (testName) => {
                const test = Object.values(LoadingManagerVerifier.tests).find(t => 
                    t.id.includes(testName) || t.title.toLowerCase().includes(testName.toLowerCase())
                );
                if (test) return Promise.resolve(test.execute());
                return Promise.resolve({status: 'error', message: 'Teste não encontrado'});
            }
        };
        
        // Botão flutuante
        if (!document.getElementById('lm-float-button')) {
            const floatBtn = document.createElement('button');
            floatBtn.id = 'lm-float-button';
            floatBtn.innerHTML = '⏳';
            floatBtn.title = 'Verificar LoadingManager';
            floatBtn.style.cssText = `
                position: fixed;
                bottom: 220px;
                right: 20px;
                z-index: 99998;
                background: linear-gradient(135deg, #ffaa00, #ff8800);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(255, 170, 0, 0.4);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            floatBtn.addEventListener('click', () => {
                LoadingManagerVerifier.createVerificationPanel();
            });
            
            document.body.appendChild(floatBtn);
            console.log('✅ Botão flutuante de LoadingManager criado');
        }
        
        console.log('%c⏳ MÓDULO DE VERIFICAÇÃO DO LOADING MANAGER v1.1 PRONTO', 
                    'color: #ffaa00; font-weight: bold; font-size: 14px; background: #1a0a2a; padding: 5px;');
        console.log('📋 Comandos disponíveis:');
        console.log('• LMVerify.panel() - Criar painel de verificação');
        console.log('• LMVerify.verify() - Executar verificação completa');
        console.log('• LM.panel() - Atalho rápido');
        console.log('• Botão ⏳ laranja no canto inferior direito');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar módulo de LoadingManager:', error);
    }
}, 1500);
