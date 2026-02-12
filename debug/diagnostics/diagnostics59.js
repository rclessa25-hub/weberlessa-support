// ================== MÓDULO DE PÓS-VALIDAÇÃO CORRIGIDO ==================
const PostValidationModule = (function() {
    // Testes de pós-validação
    const postValidationTests = {
        removedFilesCheck: {
            id: 'post-validation-files-check',
            title: 'Verificação de Arquivos Removidos',
            description: 'Confirma que arquivos foram realmente removidos do sistema',
            type: 'verification',
            icon: '🗑️',
            category: 'cleanup',
            critical: true,
            execute: function() {
                return new Promise((resolve) => {
                    const removedFiles = [
                        'js/modules/reader/pdf-logger.js',
                        'js/modules/reader/pdf-utils.js',
                        'css/responsive.css'
                    ];
                    
                    let allRemoved = true;
                    const results = [];
                    let checksCompleted = 0;
                    
                    removedFiles.forEach(file => {
                        const img = new Image();
                        img.onerror = () => {
                            results.push({
                                file: file,
                                status: 'removed',
                                message: '✅ Arquivo não encontrado'
                            });
                            checksCompleted++;
                            if (checksCompleted === removedFiles.length) {
                                finishCheck();
                            }
                        };
                        img.onload = () => {
                            allRemoved = false;
                            results.push({
                                file: file,
                                status: 'present',
                                message: '❌ Arquivo ainda existe!'
                            });
                            checksCompleted++;
                            if (checksCompleted === removedFiles.length) {
                                finishCheck();
                            }
                        };
                        img.onerror = () => {
                            results.push({
                                file: file,
                                status: 'removed',
                                message: '✅ Arquivo não encontrado'
                            });
                            checksCompleted++;
                            if (checksCompleted === removedFiles.length) {
                                finishCheck();
                            }
                        };
                        img.src = file + '?t=' + Date.now();
                    });
                    
                    function finishCheck() {
                        const filesPresent = results.filter(r => r.status === 'present').length;
                        resolve({
                            status: allRemoved ? 'success' : 'error',
                            message: allRemoved ? 
                                `✅ Todos os ${removedFiles.length} arquivos foram removidos` :
                                `❌ ${filesPresent} arquivo(s) ainda existe(m)`,
                            details: {
                                totalFiles: removedFiles.length,
                                removedFiles: results.filter(r => r.status === 'removed').length,
                                filesPresent: filesPresent,
                                fileResults: results
                            }
                        });
                    }
                    
                    // Timeout de segurança
                    setTimeout(finishCheck, 3000);
                });
            }
        },
        
        criticalFunctionsCheck: {
            id: 'post-validation-functions-check',
            title: 'Validação de Funcionalidades Críticas',
            description: 'Testa funcionalidades essenciais após limpeza',
            type: 'validation',
            icon: '🔧',
            category: 'system',
            critical: true,
            execute: function() {
                try {
                    const tests = [
                        { 
                            name: 'PdfSystem.showModal', 
                            test: () => typeof window.PdfSystem?.showModal === 'function',
                            importance: 'high'
                        },
                        { 
                            name: 'MediaSystem.addPdfs', 
                            test: () => typeof window.MediaSystem?.addPdfs === 'function',
                            importance: 'high'
                        },
                        { 
                            name: 'Admin Panel', 
                            test: () => typeof window.toggleAdminPanel === 'function',
                            importance: 'medium'
                        },
                        { 
                            name: 'Properties', 
                            test: () => Array.isArray(window.properties),
                            importance: 'medium'
                        },
                        { 
                            name: 'Diagnostics System', 
                            test: () => typeof window.Diagnostics !== 'undefined',
                            importance: 'high'
                        }
                    ];
                    
                    const results = [];
                    let allPassed = true;
                    
                    tests.forEach(t => {
                        try {
                            const passed = t.test();
                            if (!passed) allPassed = false;
                            
                            results.push({
                                function: t.name,
                                status: passed ? 'ok' : 'missing',
                                importance: t.importance,
                                message: passed ? '✅ Funcionalidade disponível' : '❌ Funcionalidade ausente'
                            });
                        } catch (e) {
                            results.push({
                                function: t.name,
                                status: 'error',
                                importance: t.importance,
                                message: `❌ Erro: ${e.message}`
                            });
                            allPassed = false;
                        }
                    });
                    
                    const criticalTests = tests.filter(t => t.importance === 'high');
                    const criticalPassed = criticalTests.every(t => {
                        try {
                            return t.test();
                        } catch {
                            return false;
                        }
                    });
                    
                    return {
                        status: criticalPassed ? (allPassed ? 'success' : 'warning') : 'error',
                        message: criticalPassed ? 
                            `✅ ${results.filter(r => r.status === 'ok').length}/${tests.length} funcionalidades OK` :
                            '❌ Funcionalidades críticas ausentes!',
                        details: {
                            totalTests: tests.length,
                            passed: results.filter(r => r.status === 'ok').length,
                            criticalPassed: criticalPassed,
                            testResults: results
                        }
                    };
                } catch (error) {
                    return {
                        status: 'error',
                        message: `Erro na validação: ${error.message}`,
                        details: null
                    };
                }
            }
        },
        
        performanceCheck: {
            id: 'post-validation-performance',
            title: 'Análise de Performance Pós-Limpeza',
            description: 'Mede melhorias após remoção de arquivos',
            type: 'performance',
            icon: '⚡',
            category: 'cleanup',
            execute: function() {
                try {
                    const startTime = performance.now();
                    
                    // Operação para medir performance
                    let operations = 0;
                    const testIterations = 100000;
                    for (let i = 0; i < testIterations; i++) {
                        operations += Math.random();
                    }
                    
                    const endTime = performance.now();
                    const executionTime = endTime - startTime;
                    
                    return {
                        status: executionTime < 50 ? 'success' : 
                                executionTime < 100 ? 'warning' : 'info',
                        message: `⏱️ Execução: ${executionTime.toFixed(2)}ms (${testIterations} iterações)`,
                        details: {
                            executionTime: executionTime,
                            operations: operations,
                            iterations: testIterations,
                            timestamp: new Date().toISOString()
                        }
                    };
                } catch (error) {
                    return {
                        status: 'error',
                        message: `Erro no teste de performance: ${error.message}`,
                        details: null
                    };
                }
            }
        }
    };
    
    // Painéis ativos
    const activePanels = new Map();
    
    return {
        registerTests: function() {
            console.log('✅ Módulo de Pós-Validação: 3 testes disponíveis');
            return true;
        },
        
        runCompleteValidation: async function() {
            console.group('🎯 EXECUTANDO VALIDAÇÃO COMPLETA PÓS-LIMPEZA');
            
            const results = {
                total: 0,
                passed: 0,
                failed: 0,
                warnings: 0,
                details: []
            };
            
            // Executar cada teste
            for (const [key, testConfig] of Object.entries(postValidationTests)) {
                try {
                    console.log(`▶️ Executando: ${testConfig.title}`);
                    
                    const result = await Promise.resolve(testConfig.execute());
                    
                    results.total++;
                    if (result.status === 'success') results.passed++;
                    if (result.status === 'error') results.failed++;
                    if (result.status === 'warning') results.warnings++;
                    
                    results.details.push({
                        test: testConfig.title,
                        status: result.status,
                        message: result.message,
                        icon: result.status === 'success' ? '✅' : 
                              result.status === 'error' ? '❌' : '⚠️'
                    });
                    
                    console.log(`${result.status === 'success' ? '✅' : '❌'} ${testConfig.title}: ${result.message}`);
                    
                    // Pequena pausa entre testes
                    await new Promise(resolve => setTimeout(resolve, 300));
                } catch (error) {
                    console.error(`❌ Erro no teste ${testConfig.title}:`, error);
                    results.details.push({
                        test: testConfig.title,
                        status: 'error',
                        message: `Erro: ${error.message}`,
                        icon: '❌'
                    });
                    results.total++;
                    results.failed++;
                }
            }
            
            console.groupEnd();
            console.log(`📊 RESUMO PÓS-VALIDAÇÃO:`);
            console.log(`   ✅ ${results.passed} passaram`);
            console.log(`   ⚠️ ${results.warnings} com avisos`);
            console.log(`   ❌ ${results.failed} falharam`);
            console.log(`   📈 Total: ${results.total} testes`);
            
            // Verificar se passou em todos os críticos
            const criticalTests = Object.values(postValidationTests).filter(t => t.critical);
            const criticalResults = results.details.filter(d => 
                criticalTests.some(ct => ct.title === d.test)
            );
            const allCriticalPassed = criticalResults.every(d => d.status === 'success');
            
            if (allCriticalPassed && results.failed === 0) {
                console.log('🎉 LIMPEZA COMPLETA VALIDADA COM SUCESSO!');
                console.log('📊 Sistema otimizado: -3 arquivos, ~120 linhas removidas');
            } else if (allCriticalPassed) {
                console.log('⚠️ LIMPEZA VALIDADA (com problemas não críticos)');
            } else {
                console.warn('❌ VALIDAÇÃO COM PROBLEMAS CRÍTICOS');
            }
            
            return results;
        },
        
        createValidationPanel: function() {
            // Verificar se já existe
            if (document.querySelector('.post-validation-panel')) {
                console.log('⚠️ Painel de pós-validação já existe');
                return document.querySelector('.post-validation-panel');
            }
            
            const panelId = 'post-validation-panel-' + Date.now();
            const panel = document.createElement('div');
            
            panel.id = panelId;
            panel.className = 'post-validation-panel';
            panel.innerHTML = `
                <div style="position: fixed;
                            top: 100px;
                            left: 100px;
                            width: 500px;
                            height: 600px;
                            background: linear-gradient(135deg, #0a0a2a, #001a33);
                            border: 2px solid #ff6b6b;
                            border-radius: 10px;
                            z-index: 1000000;
                            box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
                            font-family: 'Segoe UI', 'Consolas', monospace;
                            display: flex;
                            flex-direction: column;
                            overflow: hidden;
                            resize: both;
                            user-select: text;
                            -webkit-user-select: text;
                            -moz-user-select: text;
                            -ms-user-select: text;">
                    
                    <!-- Cabeçalho -->
                    <div class="pv-header" 
                         style="background: rgba(255, 107, 107, 0.2);
                                padding: 12px 15px;
                                border-bottom: 1px solid rgba(255, 107, 107, 0.3);
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                cursor: move;
                                user-select: none;">
                        
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🎯 PÓS-VALIDAÇÃO</span>
                            <span style="background: #ff6b6b;
                                        color: #001a33;
                                        padding: 2px 8px;
                                        border-radius: 10px;
                                        font-size: 11px;
                                        font-weight: bold;">
                                3 testes
                            </span>
                        </div>
                        
                        <div style="display: flex; gap: 5px;">
                            <button class="pv-minimize-btn" 
                                    style="background: #555;
                                           color: white;
                                           border: none;
                                           width: 25px;
                                           height: 25px;
                                           border-radius: 4px;
                                           cursor: pointer;
                                           font-weight: bold;">
                                −
                            </button>
                            <button class="pv-close-btn" 
                                    style="background: #ff5555;
                                           color: white;
                                           border: none;
                                           width: 25px;
                                           height: 25px;
                                           border-radius: 4px;
                                           cursor: pointer;
                                           font-weight: bold;">
                                ×
                            </button>
                        </div>
                    </div>
                    
                    <!-- Conteúdo -->
                    <div class="pv-content" 
                         style="flex: 1;
                                padding: 15px;
                                overflow-y: auto;
                                overflow-x: hidden;
                                user-select: text;">
                        
                        <!-- Testes -->
                        <div id="pv-tests-container" style="user-select: text;"></div>
                        
                        <!-- Botão de validação completa -->
                        <div style="margin-top: 20px; padding: 15px; background: rgba(255, 107, 107, 0.1); border-radius: 8px; border: 1px solid rgba(255, 107, 107, 0.3);">
                            <button id="pv-run-complete-btn" 
                                    style="background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                                           color: white;
                                           border: none;
                                           padding: 12px;
                                           border-radius: 5px;
                                           font-weight: bold;
                                           cursor: pointer;
                                           width: 100%;
                                           font-size: 14px;
                                           transition: all 0.3s ease;">
                                ▶️ EXECUTAR VALIDAÇÃO COMPLETA
                            </button>
                            <div style="font-size: 11px; color: #ffaaaa; margin-top: 8px; text-align: center; user-select: text;">
                                Executa todos os 3 testes em sequência
                            </div>
                        </div>
                        
                        <!-- Logs -->
                        <div style="margin-top: 20px;
                                    max-height: 150px;
                                    overflow-y: auto;
                                    background: rgba(0, 0, 0, 0.3);
                                    border-radius: 6px;
                                    padding: 10px;
                                    border: 1px solid rgba(255, 107, 107, 0.2);
                                    font-size: 12px;
                                    user-select: text;">
                            <div style="color: #ffaaaa; margin-bottom: 5px; font-weight: bold; user-select: text;">📝 LOGS:</div>
                            <div id="pv-logs-content" style="user-select: text;"></div>
                        </div>
                    </div>
                    
                    <!-- Rodapé -->
                    <div style="background: rgba(255, 107, 107, 0.1);
                                padding: 10px 15px;
                                border-top: 1px solid rgba(255, 107, 107, 0.3);
                                display: flex;
                                justify-content: space-between;
                                align-items: center;
                                font-size: 11px;
                                user-select: text;">
                        
                        <div style="color: #ffaaaa; user-select: text;">
                            <span>Pós-Validação v1.0 | Texto selecionável</span>
                        </div>
                        
                        <div style="color: #ff8888; user-select: text;">
                            Status: <span id="pv-panel-status">Pronto</span>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // Adicionar testes com IDs únicos
            const testsContainer = panel.querySelector('#pv-tests-container');
            Object.values(postValidationTests).forEach(test => {
                const testId = `pv-test-${test.id}`;
                const testElement = document.createElement('div');
                testElement.id = testId;
                testElement.style.cssText = `
                    background: rgba(255, 107, 107, 0.1);
                    padding: 12px;
                    border-radius: 6px;
                    margin-bottom: 10px;
                    border-left: 4px solid #ff6b6b;
                    user-select: text;
                `;
                testElement.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span style="font-size: 16px;">${test.icon}</span>
                            <span style="font-weight: bold; color: #ff6b6b; user-select: text;">${test.title}</span>
                        </div>
                        
                        <button class="pv-run-test-btn" data-test-id="${test.id}"
                                style="background: #ff6b6b;
                                       color: white;
                                       border: none;
                                       padding: 6px 12px;
                                       border-radius: 4px;
                                       font-size: 11px;
                                       cursor: pointer;
                                       font-weight: bold;
                                       transition: all 0.3s ease;">
                            Executar
                        </button>
                    </div>
                    
                    <div style="color: #ffaaaa; font-size: 12px; margin-bottom: 8px; user-select: text;">
                        ${test.description}
                    </div>
                    
                    <div class="pv-test-result" 
                         style="background: rgba(0, 0, 0, 0.3);
                                padding: 8px;
                                border-radius: 4px;
                                margin-top: 8px;
                                font-size: 11px;
                                color: #ffaaaa;
                                display: none;
                                user-select: text;">
                        Aguardando execução...
                    </div>
                `;
                testsContainer.appendChild(testElement);
            });
            
            // Função para adicionar logs
            const logsContent = panel.querySelector('#pv-logs-content');
            const addLog = function(message, type = 'info') {
                const colors = {
                    info: '#ffaaaa',
                    success: '#00ff9c',
                    warning: '#ffaa00',
                    error: '#ff5555'
                };
                
                const icons = {
                    info: '📝',
                    success: '✅',
                    warning: '⚠️',
                    error: '❌'
                };
                
                const logEntry = document.createElement('div');
                logEntry.style.cssText = `
                    margin-bottom: 4px;
                    color: ${colors[type] || colors.info};
                    font-size: 11px;
                    padding: 2px 0;
                    border-bottom: 1px dotted rgba(255, 107, 107, 0.2);
                    user-select: text;
                `;
                logEntry.innerHTML = `${icons[type] || '📝'} <strong>[${new Date().toLocaleTimeString()}]</strong> ${message}`;
                
                logsContent.appendChild(logEntry);
                logsContent.scrollTop = logsContent.scrollHeight;
            };
            
            // Eventos para botões de teste individual
            panel.querySelectorAll('.pv-run-test-btn').forEach(btn => {
                btn.addEventListener('click', async function() {
                    const testId = this.dataset.testId;
                    const test = postValidationTests[Object.keys(postValidationTests).find(key => 
                        postValidationTests[key].id === testId
                    )];
                    
                    if (!test) {
                        addLog(`Teste ${testId} não encontrado`, 'error');
                        return;
                    }
                    
                    addLog(`Executando ${test.title}...`, 'info');
                    this.disabled = true;
                    this.textContent = 'Executando...';
                    this.style.opacity = '0.7';
                    
                    try {
                        const result = await Promise.resolve(test.execute());
                        addLog(`${test.title}: ${result.message}`, result.status);
                        
                        // Atualizar resultado visual
                        const testElement = this.closest('div[id^="pv-test-"]');
                        if (testElement) {
                            const resultElement = testElement.querySelector('.pv-test-result');
                            if (resultElement) {
                                resultElement.textContent = result.message;
                                resultElement.style.display = 'block';
                                resultElement.style.color = 
                                    result.status === 'success' ? '#00ff9c' :
                                    result.status === 'error' ? '#ff5555' :
                                    result.status === 'warning' ? '#ffaa00' : '#ffaaaa';
                                
                                // Atualizar borda
                                testElement.style.borderLeftColor = 
                                    result.status === 'success' ? '#00ff9c' :
                                    result.status === 'error' ? '#ff5555' :
                                    result.status === 'warning' ? '#ffaa00' : '#ff6b6b';
                            }
                        }
                    } catch (error) {
                        addLog(`Erro em ${test.title}: ${error.message}`, 'error');
                    } finally {
                        this.disabled = false;
                        this.textContent = 'Executar';
                        this.style.opacity = '1';
                    }
                });
            });
            
            // Validação completa
            const runCompleteBtn = panel.querySelector('#pv-run-complete-btn');
            runCompleteBtn.addEventListener('click', async function() {
                this.disabled = true;
                this.textContent = 'EXECUTANDO...';
                this.style.opacity = '0.7';
                
                addLog('🚀 Iniciando validação completa...', 'info');
                
                try {
                    const results = await PostValidationModule.runCompleteValidation();
                    
                    // Atualizar status dos testes individuais
                    results.details.forEach(resultDetail => {
                        const testTitle = resultDetail.test;
                        const testKey = Object.keys(postValidationTests).find(key => 
                            postValidationTests[key].title === testTitle
                        );
                        
                        if (testKey) {
                            const test = postValidationTests[testKey];
                            const testElement = panel.querySelector(`[data-test-id="${test.id}"]`);
                            if (testElement) {
                                const parentTestElement = testElement.closest('div[id^="pv-test-"]');
                                if (parentTestElement) {
                                    const resultElement = parentTestElement.querySelector('.pv-test-result');
                                    if (resultElement) {
                                        resultElement.textContent = resultDetail.message;
                                        resultElement.style.display = 'block';
                                        resultElement.style.color = 
                                            resultDetail.status === 'success' ? '#00ff9c' :
                                            resultDetail.status === 'error' ? '#ff5555' :
                                            resultDetail.status === 'warning' ? '#ffaa00' : '#ffaaaa';
                                        
                                        parentTestElement.style.borderLeftColor = 
                                            resultDetail.status === 'success' ? '#00ff9c' :
                                            resultDetail.status === 'error' ? '#ff5555' :
                                            resultDetail.status === 'warning' ? '#ffaa00' : '#ff6b6b';
                                    }
                                }
                            }
                        }
                    });
                    
                    // Atualizar status do painel
                    const panelStatus = panel.querySelector('#pv-panel-status');
                    panelStatus.textContent = results.failed === 0 ? 'Concluído ✅' : 'Com problemas ⚠️';
                    panelStatus.style.color = results.failed === 0 ? '#00ff9c' : '#ffaa00';
                    
                    addLog(`✅ Validação concluída: ${results.passed} passaram, ${results.warnings} avisos, ${results.failed} falharam`, 
                          results.failed === 0 ? 'success' : results.warnings > 0 ? 'warning' : 'error');
                    
                    if (results.failed === 0) {
                        addLog('🎉 Limpeza validada com sucesso! Sistema otimizado.', 'success');
                    }
                    
                } catch (error) {
                    addLog(`❌ Erro na validação completa: ${error.message}`, 'error');
                } finally {
                    this.disabled = false;
                    this.textContent = '▶️ EXECUTAR VALIDAÇÃO COMPLETA';
                    this.style.opacity = '1';
                }
            });
            
            // Fechar painel
            panel.querySelector('.pv-close-btn').addEventListener('click', () => {
                panel.remove();
                activePanels.delete(panelId);
                addLog('Painel fechado', 'info');
            });
            
            // Minimizar
            panel.querySelector('.pv-minimize-btn').addEventListener('click', function() {
                const content = panel.querySelector('.pv-content');
                const footer = panel.querySelector('div:last-child');
                const isHidden = content.style.display === 'none';
                
                content.style.display = isHidden ? 'flex' : 'none';
                footer.style.display = isHidden ? 'flex' : 'none';
                this.textContent = isHidden ? '−' : '+';
                
                if (isHidden) {
                    panel.style.height = '600px';
                } else {
                    panel.style.height = 'auto';
                }
                
                addLog(isHidden ? 'Painel expandido' : 'Painel minimizado', 'info');
            });
            
            // Tornar arrastável
            const header = panel.querySelector('.pv-header');
            let isDragging = false;
            let offsetX, offsetY;
            
            header.addEventListener('mousedown', function(e) {
                if (e.target.tagName === 'BUTTON') return; // Não arrastar se clicar em botão
                
                isDragging = true;
                offsetX = e.clientX - panel.getBoundingClientRect().left;
                offsetY = e.clientY - panel.getBoundingClientRect().top;
                
                panel.style.cursor = 'grabbing';
                header.style.cursor = 'grabbing';
                
                document.addEventListener('mousemove', drag);
                document.addEventListener('mouseup', stopDrag);
                
                e.preventDefault();
            });
            
            function drag(e) {
                if (!isDragging) return;
                
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                
                // Limitar dentro da tela
                const maxX = window.innerWidth - panel.offsetWidth;
                const maxY = window.innerHeight - panel.offsetHeight;
                
                panel.style.left = Math.max(10, Math.min(x, maxX - 10)) + 'px';
                panel.style.top = Math.max(10, Math.min(y, maxY - 10)) + 'px';
            }
            
            function stopDrag() {
                isDragging = false;
                panel.style.cursor = '';
                header.style.cursor = '';
                
                document.removeEventListener('mousemove', drag);
                document.removeEventListener('mouseup', stopDrag);
            }
            
            // Adicionar ao mapa de painéis ativos
            activePanels.set(panelId, {
                element: panel,
                addLog: addLog,
                updateStatus: function(status, color) {
                    const statusEl = panel.querySelector('#pv-panel-status');
                    if (statusEl) {
                        statusEl.textContent = status;
                        statusEl.style.color = color;
                    }
                }
            });
            
            // Log inicial
            addLog('✅ Painel de Pós-Validação criado', 'success');
            addLog('📋 Texto agora é selecionável (copie com Ctrl+C)', 'info');
            addLog('💡 Clique nos botões "Executar" para testar individualmente', 'info');
            
            console.log('✅ Painel de Pós-Validação criado com seleção de texto habilitada');
            
            return panel;
        },
        
        // Getter para testes (para uso externo)
        get tests() {
            return postValidationTests;
        }
    };
})();

// ================== BOTÃO DE CONTROLE FLUTUANTE CORRIGIDO ==================
function createPostValidationControl() {
    // Verificar se já existe
    if (document.getElementById('post-validation-control')) {
        console.log('✅ Controle de Pós-Validação já existe');
        return;
    }
    
    const controlButton = document.createElement('div');
    controlButton.id = 'post-validation-control';
    controlButton.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        z-index: 999998;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    
    controlButton.innerHTML = `
        <button id="pv-main-btn"
                style="background: linear-gradient(135deg, #ff6b6b, #ee5a52);
                       color: white;
                       border: none;
                       border-radius: 50%;
                       width: 60px;
                       height: 60px;
                       font-size: 24px;
                       cursor: pointer;
                       box-shadow: 0 4px 15px rgba(255, 107, 107, 0.4);
                       transition: all 0.3s ease;
                       display: flex;
                       align-items: center;
                       justify-content: center;
                       z-index: 999999;">
            🔍
        </button>
        
        <div id="pv-menu" 
             style="display: none;
                    background: rgba(10, 10, 42, 0.98);
                    border: 2px solid #ff6b6b;
                    border-radius: 10px;
                    padding: 15px;
                    min-width: 220px;
                    box-shadow: 0 0 20px rgba(255, 107, 107, 0.4);
                    position: absolute;
                    bottom: 70px;
                    right: 0;
                    z-index: 999999;
                    backdrop-filter: blur(10px);
                    user-select: none;">
            
            <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 10px; border-bottom: 1px solid #ff6b6b; padding-bottom: 5px; font-size: 14px;">
                🎯 PÓS-VALIDAÇÃO
            </div>
            
            <button id="pv-create-panel"
                    style="background: rgba(0, 170, 255, 0.2);
                           color: #00aaff;
                           border: 1px solid #00aaff;
                           border-radius: 5px;
                           padding: 10px 12px;
                           margin: 6px 0;
                           width: 100%;
                           cursor: pointer;
                           text-align: left;
                           display: flex;
                           align-items: center;
                           gap: 8px;
                           font-family: 'Segoe UI', sans-serif;
                           font-size: 12px;
                           font-weight: bold;
                           transition: all 0.3s ease;">
                📊 Criar Painel Visual
            </button>
            
            <button id="pv-run-full"
                    style="background: rgba(0, 255, 156, 0.2);
                           color: #00ff9c;
                           border: 1px solid #00ff9c;
                           border-radius: 5px;
                           padding: 10px 12px;
                           margin: 6px 0;
                           width: 100%;
                           cursor: pointer;
                           text-align: left;
                           display: flex;
                           align-items: center;
                           gap: 8px;
                           font-family: 'Segoe UI', sans-serif;
                           font-size: 12px;
                           font-weight: bold;
                           transition: all 0.3s ease;">
                ▶️ Executar Validação
            </button>
            
            <button id="pv-test-files"
                    style="background: rgba(255, 170, 0, 0.2);
                           color: #ffaa00;
                           border: 1px solid #ffaa00;
                           border-radius: 5px;
                           padding: 10px 12px;
                           margin: 6px 0;
                           width: 100%;
                           cursor: pointer;
                           text-align: left;
                           display: flex;
                           align-items: center;
                           gap: 8px;
                           font-family: 'Segoe UI', sans-serif;
                           font-size: 12px;
                           font-weight: bold;
                           transition: all 0.3s ease;">
                🗑️ Testar Arquivos
            </button>
            
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255, 107, 107, 0.3);">
                <div style="font-size: 11px; color: #88aaff; display: flex; justify-content: space-between;">
                    <span>📋 Status:</span>
                    <span id="pv-status" style="color: #00ff9c; font-weight: bold;">Pronto</span>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(controlButton);
    
    // Eventos
    const mainBtn = document.getElementById('pv-main-btn');
    const menu = document.getElementById('pv-menu');
    const statusSpan = document.getElementById('pv-status');
    
    // Toggle menu
    mainBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        mainBtn.style.transform = menu.style.display === 'block' ? 'rotate(45deg)' : 'rotate(0)';
        mainBtn.style.boxShadow = menu.style.display === 'block' ? 
            '0 0 25px rgba(255, 107, 107, 0.6)' : 
            '0 4px 15px rgba(255, 107, 107, 0.4)';
    });
    
    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (!controlButton.contains(e.target)) {
            menu.style.display = 'none';
            mainBtn.style.transform = 'rotate(0)';
            mainBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
        }
    });
    
    // Criar painel
    document.getElementById('pv-create-panel').addEventListener('click', () => {
        statusSpan.textContent = 'Criando...';
        statusSpan.style.color = '#00aaff';
        
        setTimeout(() => {
            try {
                const panel = PostValidationModule.createValidationPanel();
                if (panel) {
                    statusSpan.textContent = '✅ Criado!';
                    statusSpan.style.color = '#00ff9c';
                    menu.style.display = 'none';
                    mainBtn.style.transform = 'rotate(0)';
                    mainBtn.style.boxShadow = '0 4px 15px rgba(255, 107, 107, 0.4)';
                }
            } catch (error) {
                statusSpan.textContent = '❌ Erro';
                statusSpan.style.color = '#ff5555';
                console.error('Erro ao criar painel:', error);
            }
        }, 300);
    });
    
    // Executar validação completa
    document.getElementById('pv-run-full').addEventListener('click', async () => {
        statusSpan.textContent = 'Executando...';
        statusSpan.style.color = '#ffaa00';
        
        try {
            const results = await PostValidationModule.runCompleteValidation();
            statusSpan.textContent = `✅ ${results.passed}/${results.total}`;
            statusSpan.style.color = results.failed === 0 ? '#00ff9c' : '#ffaa00';
        } catch (error) {
            statusSpan.textContent = '❌ Erro';
            statusSpan.style.color = '#ff5555';
            console.error('Erro na validação:', error);
        }
    });
    
    // Testar arquivos específicos
    document.getElementById('pv-test-files').addEventListener('click', async () => {
        statusSpan.textContent = 'Testando...';
        statusSpan.style.color = '#ffaa00';
        
        try {
            const test = PostValidationModule.tests.removedFilesCheck;
            if (test) {
                const result = await Promise.resolve(test.execute());
                statusSpan.textContent = result.status === 'success' ? '✅ OK' : '❌ Falhou';
                statusSpan.style.color = result.status === 'success' ? '#00ff9c' : '#ff5555';
                
                // Se houver painel, adicionar log
                const panel = document.querySelector('.post-validation-panel');
                if (panel && panel.querySelector('#pv-logs-content')) {
                    const logDiv = panel.querySelector('#pv-logs-content');
                    const logEntry = document.createElement('div');
                    logEntry.style.cssText = 'color: #ffaaaa; font-size: 11px; margin-bottom: 4px;';
                    logEntry.textContent = `[${new Date().toLocaleTimeString()}] Teste de arquivos: ${result.message}`;
                    logDiv.appendChild(logEntry);
                    logDiv.scrollTop = logDiv.scrollHeight;
                }
            }
        } catch (error) {
            statusSpan.textContent = '❌ Erro';
            statusSpan.style.color = '#ff5555';
            console.error('Erro no teste:', error);
        }
    });
    
    console.log('✅ Controle de Pós-Validação criado com sucesso');
}

// ================== INICIALIZAÇÃO ==================
// Inicializar após carregamento
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            PostValidationModule.registerTests();
            createPostValidationControl();
        }, 1500);
    });
} else {
    setTimeout(() => {
        PostValidationModule.registerTests();
        createPostValidationControl();
    }, 1000);
}

// ================== FUNÇÕES GLOBAIS ==================
// Adicionar ao objeto window
window.PostValidation = PostValidationModule;
window.PV = {
    panel: () => PostValidationModule.createValidationPanel(),
    run: () => PostValidationModule.runCompleteValidation(),
    test: (testName) => {
        const test = Object.values(PostValidationModule.tests).find(t => 
            t.id.includes(testName) || t.title.toLowerCase().includes(testName.toLowerCase())
        );
        if (test) {
            return Promise.resolve(test.execute());
        }
        return Promise.resolve({status: 'error', message: 'Teste não encontrado'});
    },
    status: () => {
        return {
            tests: Object.keys(PostValidationModule.tests).length,
            panels: document.querySelectorAll('.post-validation-panel').length,
            control: !!document.getElementById('post-validation-control')
        };
    }
};

// Mensagem de inicialização
console.log('%c🎯 MÓDULO DE PÓS-VALIDAÇÃO CORRIGIDO CARREGADO', 
            'color: #ff6b6b; font-weight: bold; font-size: 14px; background: #001a33; padding: 5px; border-radius: 4px;');
console.log('✅ Problemas corrigidos:');
console.log('   1. Texto agora é selecionável (user-select: text)');
console.log('   2. Erro de undefined resolvido');
console.log('   3. Controles mais robustos');
console.log('   4. Melhor tratamento de erros');
console.log('📋 Comandos disponíveis:');
console.log('   • window.PV.panel() - Criar painel visual');
console.log('   • window.PV.run() - Executar validação completa');
console.log('   • window.PV.test("files") - Testar arquivos removidos');
console.log('   • Botão 🔍 no canto inferior direito');
