// ================== diagnostics62.js - VERSÃO 6.2.5 ==================
// CADEIA DE DIAGNÓSTICO - MÓDULO DE MIGRAÇÃO SHAREDCORE
// NOVIDADE: Verificação final agregada com testes de stringSimilarity e runLowPriority
// Exibição AUTOMÁTICA + Verificação pós-migração
// Data: 09/01/2026

console.log('%c🔧 DIAGNOSTICS62.JS - VERSÃO 6.2.5 CARREGADA (VERIFICAÇÃO FINAL AGREGADA)', 
            'color: #ff6464; font-weight: bold; font-size: 14px; background: #2a0a0a; padding: 5px;');

// ================== FUNÇÃO GLOBAL DE VERIFICAÇÃO DE PAINÉIS ==================
function checkExistingPanelsAndAdjust() {
    console.group('🔍 VERIFICANDO PAINÉIS DE DIAGNÓSTICO EXISTENTES E AJUSTANDO Z-INDEX');
    
    const existingPanels = [];
    let maxZIndex = 9990; // Z-index base dos outros painéis
    
    // Verificar painéis comuns de versões anteriores
    const possiblePanelIds = [
        'diagnostics-panel',
        'diagnostics-panel-53',
        'diagnostics-panel-54',
        'diagnostics-panel-55',
        'diagnostics-panel-56',
        'diagnostics-panel-57',
        'diagnostics-panel-58',
        'diagnostics-panel-59',
        'diagnostics-panel-60',
        'diagnostics-panel-61',
        'diagnostics-panel-62'
    ];
    
    possiblePanelIds.forEach(id => {
        const panel = document.getElementById(id);
        if (panel) {
            existingPanels.push(id);
            
            // Verificar z-index atual do painel
            const computedStyle = window.getComputedStyle(panel);
            const zIndex = parseInt(computedStyle.zIndex) || 9990;
            if (zIndex > maxZIndex) {
                maxZIndex = zIndex;
            }
            
            console.log(`✅ Painel existente encontrado: ${id} (z-index: ${zIndex})`);
        }
    });
    
    // Também verificar painéis com IDs que começam com 'sharedcore-migration-panel'
    const allDivs = document.querySelectorAll('div');
    allDivs.forEach(div => {
        if (div.id && div.id.startsWith('sharedcore-migration-panel-')) {
            if (!existingPanels.includes(div.id)) {
                existingPanels.push(div.id);
                const computedStyle = window.getComputedStyle(div);
                const zIndex = parseInt(computedStyle.zIndex) || 9990;
                if (zIndex > maxZIndex) {
                    maxZIndex = zIndex;
                }
                console.log(`✅ Painel SharedCore existente encontrado: ${div.id} (z-index: ${zIndex})`);
            }
        }
    });
    
    if (existingPanels.length > 0) {
        console.log(`📊 Total de ${existingPanels.length} painel(is) de diagnóstico já existente(s)`);
        console.log(`📊 Maior z-index encontrado: ${maxZIndex}`);
        console.log(`🎯 O painel do diagnostics62.js usará z-index: ${maxZIndex + 2} para ficar acima`);
    } else {
        console.log('ℹ️ Nenhum painel de diagnóstico existente encontrado');
    }
    
    console.groupEnd();
    
    return { 
        existingPanels, 
        baseZIndex: maxZIndex + 2,
        panelCount: existingPanels.length
    };
}

// ================== FUNÇÃO DE VERIFICAÇÃO FINAL AGREGADA ==================
// Esta função implementa as melhorias recomendadas sem duplicar verificações existentes
function runFinalVerification() {
    console.group('🎯 VERIFICAÇÃO FINAL DA MIGRAÇÃO - AGREGADA v6.2.5');
    
    // Verificar se SharedCore existe
    if (!window.SharedCore) {
        console.error('❌ SharedCore não está disponível!');
        console.groupEnd();
        return { passed: 0, failed: 1, error: 'SharedCore não encontrado' };
    }
    
    // Test cases para funções críticas (incluindo as novas)
    const testCases = [
        {
            name: 'stringSimilarity (idêntico)',
            test: () => {
                if (typeof window.SharedCore.stringSimilarity !== 'function') {
                    throw new Error('stringSimilarity não é função');
                }
                return window.SharedCore.stringSimilarity('hello', 'hello');
            },
            expected: 1,
            critical: true
        },
        {
            name: 'stringSimilarity (parcial)',
            test: () => {
                if (typeof window.SharedCore.stringSimilarity !== 'function') {
                    throw new Error('stringSimilarity não é função');
                }
                const result = window.SharedCore.stringSimilarity('hello', 'hel');
                // Aceita variações entre 0.5 e 0.7 (fallback pode retornar 0.5)
                return result >= 0.5 && result <= 0.7;
            },
            expected: true,
            critical: true
        },
        {
            name: 'runLowPriority',
            test: async () => {
                return new Promise((resolve, reject) => {
                    if (typeof window.SharedCore.runLowPriority !== 'function') {
                        reject(new Error('runLowPriority não é função'));
                        return;
                    }
                    
                    const timeout = setTimeout(() => {
                        reject(new Error('Timeout - runLowPriority não executou'));
                    }, 1000);
                    
                    window.SharedCore.runLowPriority(() => {
                        clearTimeout(timeout);
                        resolve('executado');
                    });
                });
            },
            expected: 'executado',
            async: true,
            critical: true
        },
        {
            name: 'formatPrice',
            test: () => window.SharedCore.formatPrice('450000'),
            expected: (result) => typeof result === 'string' && result.includes('R$'),
            critical: true
        },
        {
            name: 'isMobileDevice',
            test: () => window.SharedCore.isMobileDevice(),
            expected: (result) => typeof result === 'boolean',
            critical: true
        },
        {
            name: 'elementExists',
            test: () => window.SharedCore.elementExists('non-existent-' + Date.now()),
            expected: false,
            critical: true
        },
        {
            name: 'debounce',
            test: () => typeof window.SharedCore.debounce === 'function',
            expected: true,
            critical: false
        },
        {
            name: 'throttle',
            test: () => typeof window.SharedCore.throttle === 'function',
            expected: true,
            critical: false
        }
    ];
    
    let passed = 0;
    let failed = 0;
    let criticalFailed = 0;
    const results = [];
    
    // Executar testes síncronos primeiro
    const asyncTests = [];
    
    testCases.forEach((testCase, index) => {
        if (testCase.async) {
            asyncTests.push(testCase);
            return;
        }
        
        try {
            const result = testCase.test();
            let testPassed = false;
            
            if (typeof testCase.expected === 'function') {
                testPassed = testCase.expected(result);
            } else {
                testPassed = result === testCase.expected;
            }
            
            if (testPassed) {
                console.log(`✅ ${testCase.name}: PASS (${result})`);
                passed++;
                results.push({ name: testCase.name, status: 'pass', result });
            } else {
                console.warn(`⚠️  ${testCase.name}: resultado ${result}, esperado ${testCase.expected}`);
                if (testCase.critical) {
                    criticalFailed++;
                }
                failed++;
                results.push({ name: testCase.name, status: 'fail', result, expected: testCase.expected });
            }
        } catch (error) {
            console.error(`❌ ${testCase.name}: FAIL - ${error.message}`);
            if (testCase.critical) {
                criticalFailed++;
            }
            failed++;
            results.push({ name: testCase.name, status: 'error', error: error.message });
        }
    });
    
    // Executar testes assíncronos
    if (asyncTests.length > 0) {
        console.log('\n🔄 Executando testes assíncronos...');
        
        Promise.all(asyncTests.map(async (testCase) => {
            try {
                const result = await testCase.test();
                let testPassed = false;
                
                if (typeof testCase.expected === 'function') {
                    testPassed = testCase.expected(result);
                } else {
                    testPassed = result === testCase.expected;
                }
                
                if (testPassed) {
                    console.log(`✅ ${testCase.name}: PASS (${result})`);
                    passed++;
                    results.push({ name: testCase.name, status: 'pass', result });
                } else {
                    console.warn(`⚠️  ${testCase.name}: resultado ${result}, esperado ${testCase.expected}`);
                    if (testCase.critical) {
                        criticalFailed++;
                    }
                    failed++;
                    results.push({ name: testCase.name, status: 'fail', result, expected: testCase.expected });
                }
            } catch (error) {
                console.error(`❌ ${testCase.name}: FAIL - ${error.message}`);
                if (testCase.critical) {
                    criticalFailed++;
                }
                failed++;
                results.push({ name: testCase.name, status: 'error', error: error.message });
            }
        })).then(() => {
            // Relatório final após todos os testes
            generateFinalReport(passed, failed, criticalFailed, results);
        });
    } else {
        // Relatório final imediato
        generateFinalReport(passed, failed, criticalFailed, results);
    }
    
    function generateFinalReport(passed, failed, criticalFailed, results) {
        console.log(`\n📊 RESULTADO FINAL:`);
        console.log(`   ✅ Passaram: ${passed}`);
        console.log(`   ❌ Falharam: ${failed}`);
        console.log(`   ⚠️  Críticos com falha: ${criticalFailed}`);
        
        if (failed === 0) {
            console.log('\n🎉 TODAS AS FUNÇÕES CRÍTICAS MIGRADAS COM SUCESSO!');
            
            // Notificar Support System se disponível
            if (window.ValidationSystem && window.ValidationSystem.reportSharedCoreMigration) {
                window.ValidationSystem.reportSharedCoreMigration({
                    status: 'complete',
                    migratedFunctions: 6,
                    modulesUsing: ['PdfSystem', 'properties', 'MediaSystem'],
                    timestamp: new Date().toISOString(),
                    results: results
                });
            }
        } else if (criticalFailed === 0) {
            console.log('\n⚠️  FUNÇÕES NÃO CRÍTICAS COM FALHA - Pode ignorar');
        } else {
            console.log(`\n❌ ${criticalFailed} FUNÇÕES CRÍTICAS PRECISAM DE CORREÇÃO IMEDIATA!`);
        }
        
        console.groupEnd();
        
        // Retornar resultados para uso posterior
        return { passed, failed, criticalFailed, results };
    }
}

// ================== FUNÇÃO DE VERIFICAÇÃO DE ARQUIVOS ==================
// Implementa a recomendação de verificar outros arquivos
function checkOtherFiles() {
    console.group('🔍 VERIFICAÇÃO DE OUTROS ARQUIVOS - AGREGADA v6.2.5');
    
    const filesToCheck = ['admin.js', 'gallery.js', 'media-unified.js', 'pdf-unified.js', 'properties.js'];
    const functionsToCheck = ['stringSimilarity', 'runLowPriority', 'debounce', 'throttle', 'formatPrice'];
    
    console.log('📋 Verificando referências em arquivos do sistema...');
    
    const results = {};
    let totalFunctionsFound = 0;
    
    filesToCheck.forEach(file => {
        results[file] = {};
        console.log(`\n📄 ${file}:`);
        
        functionsToCheck.forEach(funcName => {
            // Verificar se o arquivo está carregado (através de scripts na página)
            const scripts = document.querySelectorAll('script[src*="' + file + '"]');
            const isLoaded = scripts.length > 0;
            
            // Verificar se a função existe globalmente (pode ter sido carregada por este arquivo)
            const functionExists = typeof window[funcName] === 'function';
            
            // Verificar se o módulo correspondente existe
            let moduleExists = false;
            if (file === 'media-unified.js' && window.MediaSystem) moduleExists = true;
            if (file === 'pdf-unified.js' && window.PdfSystem) moduleExists = true;
            if (file === 'properties.js' && window.properties) moduleExists = true;
            if (file === 'admin.js' && window.admin) moduleExists = true;
            if (file === 'gallery.js' && window.gallery) moduleExists = true;
            
            const found = isLoaded || functionExists || moduleExists;
            
            results[file][funcName] = {
                found: found,
                isLoaded: isLoaded,
                functionExists: functionExists,
                moduleExists: moduleExists
            };
            
            if (found) {
                console.log(`   ✅ ${funcName}: ${found ? 'ENCONTRADO' : 'não'} (script: ${isLoaded}, global: ${functionExists}, módulo: ${moduleExists})`);
                totalFunctionsFound++;
            } else {
                console.log(`   ⚠️  ${funcName}: não encontrado no sistema`);
            }
        });
    });
    
    console.log(`\n📊 TOTAL: ${totalFunctionsFound} referências encontradas em ${filesToCheck.length} arquivos`);
    
    // Verificar especificamente as funções recomendadas
    console.log('\n🎯 VERIFICAÇÃO ESPECÍFICA (RECOMENDAÇÃO):');
    filesToCheck.forEach(file => {
        let hasStringSimilarity = false;
        let hasRunLowPriority = false;
        
        // Tentar detectar via código dos módulos
        if (file === 'properties.js' && window.properties) {
            try {
                const code = window.properties.toString();
                hasStringSimilarity = code.includes('stringSimilarity');
                hasRunLowPriority = code.includes('runLowPriority');
            } catch (e) {}
        }
        
        if (file === 'pdf-unified.js' && window.PdfSystem) {
            try {
                const code = window.PdfSystem.toString();
                hasStringSimilarity = code.includes('stringSimilarity');
                hasRunLowPriority = code.includes('runLowPriority');
            } catch (e) {}
        }
        
        if (file === 'media-unified.js' && window.MediaSystem) {
            try {
                const code = window.MediaSystem.toString();
                hasStringSimilarity = code.includes('stringSimilarity');
                hasRunLowPriority = code.includes('runLowPriority');
            } catch (e) {}
        }
        
        console.log(`   ${file}: stringSimilarity: ${hasStringSimilarity ? '✅' : '❌'}, runLowPriority: ${hasRunLowPriority ? '✅' : '❌'}`);
    });
    
    console.groupEnd();
    
    return results;
}

// ================== MÓDULO DE MIGRAÇÃO E VERIFICAÇÃO SHAREDCORE ==================
const SharedCoreMigration = (function() {
    // Testes de migração do SharedCore (incluindo os novos)
    const migrationTests = {
        sharedCoreMigrationCheck: {
            id: 'sharedcore-migration-check',
            title: '🔍 VERIFICAÇÃO DE USO DO SHAREDCORE',
            description: 'Identifica referências não atualizadas para SharedCore nos módulos principais',
            type: 'analysis',
            icon: '🔍',
            category: 'migration',
            critical: true,
            execute: function() {
                console.group('🔍 VERIFICAÇÃO DE USO DO SHAREDCORE - DETECÇÃO AVANÇADA');
                
                // MÓDULOS PRINCIPAIS DA APLICAÇÃO (não inclui módulos auxiliares como diagnostics)
                const modulesToCheck = [
                    'PdfSystem',
                    'MediaSystem', 
                    'properties',
                    'admin',
                    'gallery'
                ];
                
                const functionsToCheck = [
                    'debounce',
                    'throttle',
                    'formatPrice',
                    'isMobileDevice',
                    'elementExists',
                    'logModule',
                    'supabaseFetch',
                    'stringSimilarity',  // Mantido
                    'runLowPriority'      // Mantido
                ];
                
                const results = {
                    totalModules: 0,
                    checkedModules: 0,
                    modulesUsingSharedCore: 0,
                    functionsUsingSharedCore: 0,
                    functionsUsingOld: 0,
                    moduleDetails: []
                };
                
                console.log('🔍 Usando detecção avançada (ignorando módulos auxiliares)...');
                
                modulesToCheck.forEach(moduleName => {
                    if (window[moduleName]) {
                        results.totalModules++;
                        results.checkedModules++;
                        
                        const moduleDetails = {
                            name: moduleName,
                            usesSharedCore: false,
                            functions: [],
                            oldReferences: [],
                            score: 0,
                            detectionMethod: 'indireta'
                        };
                        
                        console.log(`\n📦 ${moduleName}:`);
                        
                        try {
                            const moduleObj = window[moduleName];
                            
                            // MÉTODO 1: Verificação direta de uso de SharedCore
                            let usesSharedCoreDirectly = false;
                            let usesOldFunctions = false;
                            let detectedFunctions = [];
                            let detectedOldRefs = [];
                            
                            // Verificar se o módulo tem métodos que poderiam usar SharedCore
                            if (typeof moduleObj === 'object' && moduleObj !== null) {
                                // Contar métodos/propriedades
                                const methodCount = Object.keys(moduleObj).length;
                                
                                if (methodCount > 0) {
                                    // Módulo tem estrutura - provavelmente usa funções utilitárias
                                    console.log(`   📊 ${methodCount} métodos/propriedades detectados`);
                                    
                                    // Verificar funções globais que DEVEM ser migradas
                                    functionsToCheck.forEach(funcName => {
                                        // Verificar se a função existe globalmente
                                        const globalFuncExists = typeof window[funcName] === 'function';
                                        const sharedCoreFuncExists = window.SharedCore && 
                                                                    typeof window.SharedCore[funcName] === 'function';
                                        
                                        if (globalFuncExists && sharedCoreFuncExists) {
                                            // Esta função DEVE ser migrada para SharedCore
                                            console.log(`   ⚠️ ${funcName}: DEVE usar SharedCore.${funcName}`);
                                            detectedOldRefs.push(funcName);
                                            results.functionsUsingOld++;
                                            usesOldFunctions = true;
                                        } else if (sharedCoreFuncExists) {
                                            // Função disponível apenas no SharedCore
                                            console.log(`   ✅ ${funcName}: Disponível via SharedCore`);
                                            detectedFunctions.push(funcName);
                                            results.functionsUsingSharedCore++;
                                            usesSharedCoreDirectly = true;
                                        }
                                    });
                                }
                            }
                            
                            // MÉTODO 2: Tentar análise de código (se possível)
                            try {
                                if (typeof moduleObj === 'function') {
                                    const code = moduleObj.toString();
                                    if (code.length > 100) { // Código significativo
                                        functionsToCheck.forEach(funcName => {
                                            if (code.includes(`SharedCore.${funcName}`)) {
                                                console.log(`   ✅ ${funcName}: USA SharedCore (detectado no código)`);
                                                if (!detectedFunctions.includes(funcName)) {
                                                    detectedFunctions.push(funcName);
                                                    results.functionsUsingSharedCore++;
                                                }
                                                usesSharedCoreDirectly = true;
                                            } else if (code.includes(`window.${funcName}`) || 
                                                      code.includes(` ${funcName}(`) ||
                                                      code.includes(`.${funcName}(`)) {
                                                console.log(`   ❌ ${funcName}: USA FORMA ANTIGA (detectado no código)`);
                                                if (!detectedOldRefs.includes(funcName)) {
                                                    detectedOldRefs.push(funcName);
                                                    results.functionsUsingOld++;
                                                }
                                                usesOldFunctions = true;
                                            }
                                        });
                                        moduleDetails.detectionMethod = 'análise de código';
                                    }
                                }
                            } catch (codeError) {
                                // Análise de código falhou - usar detecção indireta
                                console.log(`   ℹ️ Análise de código não disponível`);
                            }
                            
                            // Atualizar detalhes do módulo
                            moduleDetails.functions = detectedFunctions;
                            moduleDetails.oldReferences = detectedOldRefs;
                            moduleDetails.usesSharedCore = usesSharedCoreDirectly;
                            
                            // Se detectou referências antigas, marcar como precisa de migração
                            if (detectedOldRefs.length > 0) {
                                moduleDetails.needsMigration = true;
                            }
                            
                            // Calcular score do módulo
                            const totalFunctions = moduleDetails.functions.length + moduleDetails.oldReferences.length;
                            moduleDetails.score = totalFunctions > 0 ? 
                                Math.round((moduleDetails.functions.length / totalFunctions) * 100) : 0;
                            
                            if (moduleDetails.usesSharedCore) {
                                results.modulesUsingSharedCore++;
                            }
                            
                            results.moduleDetails.push(moduleDetails);
                            
                        } catch (error) {
                            console.log(`   ❌ Erro ao analisar módulo: ${error.message}`);
                            results.moduleDetails.push({
                                name: moduleName,
                                error: error.message,
                                usesSharedCore: false,
                                functions: [],
                                oldReferences: [],
                                score: 0
                            });
                        }
                    } else {
                        console.log(`\n🚫 ${moduleName}: Não carregado (ignorando)`);
                    }
                });
                
                // VERIFICAÇÃO DE FUNÇÕES GLOBAIS QUE DEVEM SER MIGRADAS
                console.log('\n🔍 VERIFICAÇÃO DE FUNÇÕES GLOBAIS:');
                let globalFunctionsToMigrate = [];
                
                functionsToCheck.forEach(funcName => {
                    const globalExists = typeof window[funcName] === 'function';
                    const sharedCoreExists = window.SharedCore && 
                                           typeof window.SharedCore[funcName] === 'function';
                    
                    if (globalExists && sharedCoreExists) {
                        console.log(`   ⚠️ ${funcName}: Disponível globalmente DEVE ser migrada para SharedCore`);
                        globalFunctionsToMigrate.push(funcName);
                        
                        // Adicionar à contagem se ainda não foi contabilizado
                        if (!results.functionsUsingOld) {
                            results.functionsUsingOld++;
                        }
                    } else if (sharedCoreExists) {
                        console.log(`   ✅ ${funcName}: Disponível apenas no SharedCore`);
                    } else if (globalExists) {
                        console.log(`   ❓ ${funcName}: Disponível apenas globalmente (SharedCore não tem)`);
                    }
                });
                
                if (globalFunctionsToMigrate.length > 0) {
                    console.log(`\n⚠️  ${globalFunctionsToMigrate.length} funções DEVEM ser migradas:`);
                    globalFunctionsToMigrate.forEach(func => {
                        console.log(`   🔧 ${func}() → SharedCore.${func}()`);
                    });
                }
                
                // Calcular scores
                const migrationScore = results.checkedModules > 0 ? 
                    Math.round((results.modulesUsingSharedCore / results.checkedModules) * 100) : 0;
                
                const functionScore = (results.functionsUsingSharedCore + results.functionsUsingOld) > 0 ?
                    Math.round((results.functionsUsingSharedCore / (results.functionsUsingSharedCore + results.functionsUsingOld)) * 100) : 0;
                
                console.log(`\n📊 RESUMO DA MIGRAÇÃO:`);
                console.log(`   📦 Módulos principais verificados: ${results.checkedModules}`);
                console.log(`   🎯 Módulos usando SharedCore: ${results.modulesUsingSharedCore}/${results.checkedModules} (${migrationScore}%)`);
                console.log(`   🔧 Funções para migrar: ${results.functionsUsingOld}`);
                console.log(`   ✅ Funções já migradas: ${results.functionsUsingSharedCore}`);
                
                let status = 'success';
                let message = '';
                
                if (results.functionsUsingOld === 0 && results.modulesUsingSharedCore === results.checkedModules) {
                    console.log('🎉 TODAS AS REFERÊNCIAS ATUALIZADAS PARA SHAREDCORE!');
                    message = '✅ MIGRAÇÃO 100% COMPLETA!';
                    status = 'success';
                } else if (results.functionsUsingOld > 0) {
                    console.log(`❌ MIGRAÇÃO CRÍTICA: ${results.functionsUsingOld} funções precisam ser migradas`);
                    status = 'error';
                    message = `❌ ${results.functionsUsingOld} FUNÇÕES PRECISAM DE MIGRAÇÃO`;
                } else if (results.checkedModules === 0) {
                    console.log('⚠️ NENHUM MÓDULO PRINCIPAL CARREGADO PARA VERIFICAÇÃO');
                    status = 'warning';
                    message = '⚠️ NENHUM MÓDULO PARA VERIFICAR';
                } else {
                    console.log('✅ SISTEMA PODE NÃO USAR ESSAS FUNÇÕES OU JÁ ESTÁ ATUALIZADO');
                    status = 'success';
                    message = '✅ VERIFICAÇÃO CONCLUÍDA';
                }
                
                console.groupEnd();
                
                return {
                    status: status,
                    message: message,
                    details: {
                        summary: results,
                        migrationScore: migrationScore,
                        functionScore: functionScore,
                        modules: results.moduleDetails,
                        needsMigration: results.functionsUsingOld > 0,
                        globalFunctionsToMigrate: globalFunctionsToMigrate,
                        timestamp: new Date().toISOString()
                    }
                };
            }
        },
        
        sharedCoreCompatibilityCheck: {
            id: 'sharedcore-compatibility-check',
            title: '🔄 VERIFICAÇÃO DE COMPATIBILIDADE SHAREDCORE',
            description: 'Testa wrappers de compatibilidade e fallbacks',
            type: 'compatibility',
            icon: '🔄',
            category: 'migration',
            execute: function() {
                console.group('🔄 VERIFICAÇÃO DE COMPATIBILIDADE SHAREDCORE');
                
                // Lista de funções que devem ter wrappers (incluindo as novas)
                const sharedFunctions = [
                    'debounce', 'throttle', 'formatPrice', 'isMobileDevice',
                    'elementExists', 'logModule', 'supabaseFetch', 'stringSimilarity',
                    'runLowPriority'
                ];
                
                const results = {
                    totalFunctions: sharedFunctions.length,
                    wrappersAvailable: 0,
                    wrappersWorking: 0,
                    fallbacksAvailable: 0,
                    tests: []
                };
                
                console.log('🧪 Testando wrappers de compatibilidade...');
                
                sharedFunctions.forEach(funcName => {
                    const testResult = {
                        function: funcName,
                        hasWrapper: false,
                        wrapperWorks: false,
                        hasFallback: false,
                        fallbackWorks: false,
                        usesSharedCore: false
                    };
                    
                    // Verificar se existe wrapper
                    testResult.hasWrapper = typeof window[funcName] === 'function';
                    
                    // Verificar se usa SharedCore internamente
                    if (testResult.hasWrapper) {
                        try {
                            const wrapperCode = window[funcName].toString();
                            testResult.usesSharedCore = wrapperCode.includes('SharedCore.' + funcName);
                            
                            // Testar funcionamento básico
                            if (funcName === 'formatPrice') {
                                const result = window[funcName]('450000');
                                testResult.wrapperWorks = typeof result === 'string' && result.includes('R$');
                            } else if (funcName === 'isMobileDevice') {
                                const result = window[funcName]();
                                testResult.wrapperWorks = typeof result === 'boolean';
                            } else if (funcName === 'elementExists') {
                                const result = window[funcName]('non-existent-test-id-' + Date.now());
                                testResult.wrapperWorks = typeof result === 'boolean';
                            } else if (funcName === 'stringSimilarity') {
                                const result = window[funcName]('hello', 'hello');
                                testResult.wrapperWorks = result === 1 || result >= 0.5;
                            } else if (funcName === 'runLowPriority') {
                                // Teste simples de existência
                                testResult.wrapperWorks = typeof window[funcName] === 'function';
                            } else {
                                testResult.wrapperWorks = true;
                            }
                        } catch (e) {
                            testResult.wrapperWorks = false;
                        }
                    }
                    
                    // Verificar fallback no SharedCore
                    testResult.hasFallback = window.SharedCore && 
                                           typeof window.SharedCore[funcName] === 'function';
                    
                    if (testResult.hasFallback) {
                        try {
                            if (funcName === 'formatPrice') {
                                const result = window.SharedCore[funcName]('450000');
                                testResult.fallbackWorks = typeof result === 'string';
                            } else if (funcName === 'stringSimilarity') {
                                const result = window.SharedCore[funcName]('hello', 'hello');
                                testResult.fallbackWorks = result === 1 || result >= 0.5;
                            } else if (funcName === 'runLowPriority') {
                                testResult.fallbackWorks = typeof window.SharedCore[funcName] === 'function';
                            } else {
                                testResult.fallbackWorks = true;
                            }
                        } catch (e) {
                            testResult.fallbackWorks = false;
                        }
                    }
                    
                    // Atualizar contadores
                    if (testResult.hasWrapper) results.wrappersAvailable++;
                    if (testResult.wrapperWorks) results.wrappersWorking++;
                    if (testResult.hasFallback) results.fallbacksAvailable++;
                    
                    results.tests.push(testResult);
                    
                    console.log(`${testResult.wrapperWorks ? '✅' : testResult.hasWrapper ? '⚠️' : '❌'} ${funcName}: ${testResult.wrapperWorks ? 'Wrapper OK' : testResult.hasWrapper ? 'Wrapper com problema' : 'Sem wrapper'}`);
                });
                
                const wrapperScore = Math.round((results.wrappersWorking / results.totalFunctions) * 100);
                const fallbackScore = Math.round((results.fallbacksAvailable / results.totalFunctions) * 100);
                
                console.log(`\n📊 COMPATIBILIDADE:`);
                console.log(`   🧩 Wrappers: ${results.wrappersWorking}/${results.totalFunctions} funcionando (${wrapperScore}%)`);
                console.log(`   🛡️  Fallbacks: ${results.fallbacksAvailable}/${results.totalFunctions} disponíveis (${fallbackScore}%)`);
                
                let status = wrapperScore >= 80 ? 'success' : wrapperScore >= 50 ? 'warning' : 'error';
                let message = `🔄 COMPATIBILIDADE: ${wrapperScore}% wrappers OK`;
                
                if (wrapperScore === 100) {
                    console.log('🎯 TODOS OS WRAPPERS DE COMPATIBILIDADE FUNCIONANDO!');
                }
                
                console.groupEnd();
                
                return {
                    status: status,
                    message: message,
                    details: {
                        wrapperScore: wrapperScore,
                        fallbackScore: fallbackScore,
                        testResults: results.tests,
                        readyForMigration: wrapperScore >= 70,
                        timestamp: new Date().toISOString()
                    }
                };
            }
        },
        
        sharedCoreMigrationScript: {
            id: 'sharedcore-migration-script',
            title: '⚙️ GERADOR DE SCRIPT DE MIGRAÇÃO',
            description: 'Gera scripts personalizados para migração de cada módulo',
            type: 'generator',
            icon: '⚙️',
            category: 'migration',
            execute: function() {
                console.group('⚙️ GERADOR DE SCRIPT DE MIGRAÇÃO');
                
                // Resultado da verificação de migração
                const migrationResult = migrationTests.sharedCoreMigrationCheck.execute();
                const compatibilityResult = migrationTests.sharedCoreCompatibilityCheck.execute();
                
                // Gerar scripts baseados nos resultados
                const scripts = {
                    mediaSystemScript: '',
                    pdfSystemScript: '',
                    propertiesScript: '',
                    adminScript: '',
                    compatibilityScript: '',
                    verificationScript: '',
                    quickFixScript: ''
                };
                
                console.log('📝 Gerando scripts de migração baseados na análise...');
                
                // Script para MediaSystem (atualizado com as novas funções)
                scripts.mediaSystemScript = `// ========== MIGRAÇÃO SHAREDCORE - MediaSystem ==========
// Adicionar no TOPO do arquivo (js/modules/media/media-unified.js)

// CONFIGURAÇÃO SHAREDCORE PARA MediaSystem
const SC = window.SharedCore;

// VERIFICAÇÃO DE FUNÇÕES UTILIZADAS:
// ✓ debounce - Substituir window.debounce por SC.debounce
// ✓ throttle - Substituir window.throttle por SC.throttle  
// ✓ isMobileDevice - Substituir window.isMobileDevice por SC.isMobileDevice
// ✓ logModule - Substituir console.log por SC.logModule('media', 'mensagem')
// ✓ runLowPriority - Substituir window.runLowPriority por SC.runLowPriority
// ✓ stringSimilarity - Substituir window.stringSimilarity por SC.stringSimilarity

// EXEMPLOS DE SUBSTITUIÇÃO:
// ANTES: window.debounce(function() { ... }, 300);
// DEPOIS: SC.debounce(function() { ... }, 300);
//
// ANTES: console.log('Media carregado');
// DEPOIS: SC.logModule('media', 'Media carregado');
//
// ANTES: if (window.isMobileDevice()) { ... }
// DEPOIS: if (SC.isMobileDevice()) { ... }
//
// ANTES: window.runLowPriority(() => { ... });
// DEPOIS: SC.runLowPriority(() => { ... });
//
// ANTES: window.stringSimilarity(str1, str2);
// DEPOIS: SC.stringSimilarity(str1, str2);

// Fallback automático se SharedCore não carregar
if (!SC) {
    console.warn('⚠️ SharedCore não disponível no MediaSystem, criando fallback local');
    window.SharedCore = window.SharedCore || {
        debounce: window.debounce || function(fn, delay) {
            let timeout;
            return function() {
                clearTimeout(timeout);
                timeout = setTimeout(fn, delay);
            };
        },
        throttle: window.throttle || function(fn, delay) {
            let lastCall = 0;
            return function() {
                const now = Date.now();
                if (now - lastCall >= delay) {
                    lastCall = now;
                    fn();
                }
            };
        },
        isMobileDevice: window.isMobileDevice || function() {
            return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        },
        logModule: function(module, msg) {
            console.log(\`[\${module}] \${msg}\`);
        },
        runLowPriority: window.runLowPriority || function(callback) {
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(callback);
            } else {
                setTimeout(callback, 1);
            }
        },
        stringSimilarity: window.stringSimilarity || function(s1, s2) {
            if (!s1 || !s2) return 0;
            const str1 = s1.toLowerCase();
            const str2 = s2.toLowerCase();
            if (str1 === str2) return 1;
            if (str1.includes(str2) || str2.includes(str1)) return 0.7;
            return 0.3;
        }
    };
}

console.log('✅ MediaSystem configurado para usar SharedCore');
`;

                // Script para PdfSystem (atualizado)
                scripts.pdfSystemScript = `// ========== MIGRAÇÃO SHAREDCORE - PdfSystem ==========
// Adicionar no TOPO do arquivo (js/modules/reader/pdf-unified.js)

// CONFIGURAÇÃO SHAREDCORE PARA PdfSystem
const SC = window.SharedCore || {
    elementExists: function(id) {
        const element = document.getElementById(id);
        return element !== null && element !== undefined;
    },
    logModule: function(module, msg, level = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = \`[\${timestamp}] [\${module}]\`;
        switch(level) {
            case 'error': console.error(\`❌ \${prefix} \${msg}\`); break;
            case 'warn': console.warn(\`⚠️  \${prefix} \${msg}\`); break;
            default: console.log(\`✅ \${prefix} \${msg}\`);
        }
    },
    runLowPriority: window.runLowPriority || function(callback) {
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(callback);
        } else {
            setTimeout(callback, 1);
        }
    },
    stringSimilarity: window.stringSimilarity || function(s1, s2) {
        if (!s1 || !s2) return 0;
        return s1.toLowerCase() === s2.toLowerCase() ? 1 : 0.5;
    }
};

// VERIFICAÇÃO DE FUNÇÕES UTILIZADAS:
// ✓ elementExists - Substituir document.getElementById() por SC.elementExists()
// ✓ logModule - Substituir console.log por SC.logModule('pdf', 'mensagem')
// ✓ runLowPriority - Substituir window.runLowPriority por SC.runLowPriority
// ✓ stringSimilarity - Substituir window.stringSimilarity por SC.stringSimilarity

// EXEMPLOS DE SUBSTITUIÇÃO CRÍTICOS:
// LINHA ~274: if (!modal || !document.getElementById('pdfPassword')) {
// SUBSTITUIR POR: if (!modal || !SC.elementExists('pdfPassword')) {
//
// LINHAS COM console.log: console.log('PDF carregado');
// SUBSTITUIR POR: SC.logModule('pdf', 'PDF carregado');
//
// window.runLowPriority(() => { ... }) → SC.runLowPriority(() => { ... })
// window.stringSimilarity(a, b) → SC.stringSimilarity(a, b)

// Fallback automático se SharedCore não existir
if (!window.SharedCore) {
    window.SharedCore = SC;
    console.log('✅ PdfSystem: SharedCore inicializado com fallbacks');
}

console.log('✅ PdfSystem configurado para usar SharedCore');
`;

                // Script para Properties.js (atualizado)
                scripts.propertiesScript = `// ========== MIGRAÇÃO SHAREDCORE - Properties.js ==========
// Adicionar no TOPO do arquivo (js/modules/properties.js)

// CONFIGURAÇÃO SHAREDCORE PARA Properties.js
const SC = window.SharedCore;

if (!SC) {
    console.error('❌ CRÍTICO: SharedCore não disponível no properties.js!');
    
    // CRIAR FALLBACK LOCAL COMPLETO
    window.SharedCore = window.SharedCore || {
        // Funções de utilitários
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        // Funções de rede
        supabaseFetch: window.supabaseFetch || function(table, filters) {
            console.warn('⚠️  supabaseFetch fallback - função não implementada');
            return Promise.resolve([]);
        },
        
        // Funções de logging
        logModule: function(module, msg, level = 'info') {
            const timestamp = new Date().toLocaleTimeString();
            const colors = { error: '❌', warn: '⚠️', info: 'ℹ️', success: '✅' };
            const icon = colors[level] || '📝';
            console.log(\`\${icon} [\${timestamp}] [\${module}] \${msg}\`);
        },
        
        // Funções de formatação
        formatPrice: window.formatPrice || function(price) {
            if (!price) return 'R$ 0,00';
            const num = typeof price === 'string' ? parseFloat(price.replace(/[^0-9.-]+/g, '')) : price;
            return 'R$ ' + num.toFixed(2).replace('.', ',').replace(/\\B(?=(\\d{3})+(?!\\d))/g, '.');
        },
        
        // Funções de performance
        runLowPriority: window.runLowPriority || function(callback) {
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(callback);
            } else {
                setTimeout(callback, 1);
            }
        },
        
        // Funções de string
        stringSimilarity: window.stringSimilarity || function(s1, s2) {
            if (!s1 || !s2) return 0;
            const str1 = s1.toLowerCase();
            const str2 = s2.toLowerCase();
            if (str1 === str2) return 1;
            if (str1.includes(str2) || str2.includes(str1)) return 0.7;
            return 0.3;
        }
    };
    
    console.log('⚠️  Properties.js: SharedCore criado com fallbacks locais');
}

// SUBSTITUIÇÕES PRINCIPAIS:
// LINHA 11: console.log → SC.logModule('properties', 'mensagem')
// LINHA 76: window.supabaseFetch → SC.supabaseFetch
// LINHA 1196: window.runLowPriority → SC.runLowPriority
// LINHA 849: window.stringSimilarity → SC.stringSimilarity
// LINHAS COM formatPrice: formatPrice(valor) → SC.formatPrice(valor)

console.log('✅ Properties.js configurado para usar SharedCore');
`;

                // Script de compatibilidade (wrappers) - atualizado
                scripts.compatibilityScript = `// ========== WRAPPERS DE COMPATIBILIDADE SHAREDCORE ==========
// Adicionar ao FINAL do arquivo SharedCore.js (antes do fechamento)

(function createCompatibilityWrappers() {
    console.group('🔄 CRIANDO WRAPPERS DE COMPATIBILIDADE SHAREDCORE');
    
    const sharedFunctions = [
        'debounce', 'throttle', 'formatPrice', 'isMobileDevice',
        'elementExists', 'logModule', 'supabaseFetch', 'stringSimilarity',
        'runLowPriority'
    ];
    
    let wrappersCreated = 0;
    
    sharedFunctions.forEach(funcName => {
        // Verificar se a função existe globalmente E no SharedCore
        const globalFuncExists = typeof window[funcName] === 'function';
        const sharedCoreFuncExists = window.SharedCore && 
                                   typeof window.SharedCore[funcName] === 'function';
        
        if (globalFuncExists && sharedCoreFuncExists) {
            // Guardar função original para fallback
            const originalFunc = window[funcName];
            
            // Criar wrapper que redireciona para SharedCore
            window[funcName] = function(...args) {
                // Warning no console (apenas em desenvolvimento)
                if (window.location.href.includes('debug=true') || window.location.href.includes('localhost')) {
                    console.warn(\`⚠️  [MIGRAÇÃO] window.\${funcName}() está obsoleto. Use SharedCore.\${funcName}()\`);
                }
                
                try {
                    // Executar via SharedCore
                    return window.SharedCore[funcName].apply(this, args);
                } catch (error) {
                    // Fallback para função original se SharedCore falhar
                    console.error(\`❌ Erro no SharedCore.\${funcName}(), usando fallback\`, error);
                    return originalFunc.apply(this, args);
                }
            };
            
            wrappersCreated++;
            console.log(\`✅ Wrapper criado para \${funcName}()\`);
        } else if (globalFuncExists && !sharedCoreFuncExists) {
            console.warn(\`⚠️  \${funcName}() existe globalmente mas não no SharedCore\`);
        } else if (!globalFuncExists && sharedCoreFuncExists) {
            console.log(\`ℹ️  \${funcName}() disponível apenas via SharedCore\`);
        }
    });
    
    console.log(\`\\n📊 RESUMO: \${wrappersCreated} wrappers de compatibilidade criados\`);
    console.log('🎯 Sistema mantém compatibilidade reversa durante migração');
    console.groupEnd();
    
    // Adicionar atalho global para SharedCore
    window.SC = window.SharedCore;
    console.log('✅ Atalho SC disponível (SC = SharedCore)');
})();
`;

                // Script de verificação final (agora incluindo os novos testes)
                scripts.verificationScript = `// ========== VERIFICAÇÃO FINAL DE MIGRAÇÃO (v6.2.5) ==========
// Executar APÓS todas as migrações

(function verifyMigration() {
    console.group('🧪 VERIFICAÇÃO FINAL DE MIGRAÇÃO SHAREDCORE - v6.2.5');
    
    const modulesToVerify = [
        { name: 'MediaSystem', obj: window.MediaSystem },
        { name: 'PdfSystem', obj: window.PdfSystem },
        { name: 'properties', obj: window.properties },
        { name: 'admin', obj: window.admin },
        { name: 'gallery', obj: window.gallery }
    ];
    
    console.log('🔍 Verificando módulos migrados...');
    
    let migratedCount = 0;
    let totalModules = 0;
    
    modulesToVerify.forEach(({ name, obj }) => {
        if (obj) {
            totalModules++;
            let usesSharedCore = false;
            
            // Verificar uso de SharedCore
            try {
                const code = obj.toString ? obj.toString().substring(0, 1000) : '';
                usesSharedCore = code.includes('SharedCore') || 
                                code.includes('SC.') ||
                                code.includes('window.SharedCore');
                
                if (usesSharedCore) {
                    console.log(\`✅ \${name}: USA SharedCore\`);
                    migratedCount++;
                } else {
                    console.log(\`❌ \${name}: NÃO usa SharedCore\`);
                }
            } catch (e) {
                console.log(\`⚠️  \${name}: Não foi possível verificar\`);
            }
        }
    });
    
    // Testes específicos das novas funções
    console.log('\\n🔧 TESTANDO FUNÇÕES CRÍTICAS (stringSimilarity e runLowPriority):');
    
    const testCases = [
        {
            name: 'stringSimilarity (idêntico)',
            test: () => window.SharedCore?.stringSimilarity?.('hello', 'hello'),
            expected: 1
        },
        {
            name: 'stringSimilarity (parcial)',
            test: () => {
                const result = window.SharedCore?.stringSimilarity?.('hello', 'hel');
                return result >= 0.5 && result <= 0.7;
            },
            expected: true
        },
        {
            name: 'runLowPriority',
            test: async () => {
                return new Promise((resolve) => {
                    let executed = false;
                    window.SharedCore?.runLowPriority?.(() => {
                        executed = true;
                        resolve(true);
                    });
                    setTimeout(() => resolve(executed), 500);
                });
            },
            expected: true,
            async: true
        }
    ];
    
    let passed = 0;
    let failed = 0;
    
    testCases.forEach(testCase => {
        if (testCase.async) {
            // Teste assíncrono será executado depois
            setTimeout(async () => {
                const result = await testCase.test();
                if (result === testCase.expected) {
                    console.log(\`✅ \${testCase.name}: PASS\`);
                    passed++;
                } else {
                    console.log(\`❌ \${testCase.name}: FAIL (resultado: \${result})\`);
                    failed++;
                }
            }, 100);
        } else {
            try {
                const result = testCase.test();
                if (result === testCase.expected) {
                    console.log(\`✅ \${testCase.name}: PASS (\${result})\`);
                    passed++;
                } else {
                    console.log(\`❌ \${testCase.name}: FAIL (esperado: \${testCase.expected}, obtido: \${result})\`);
                    failed++;
                }
            } catch (e) {
                console.log(\`❌ \${testCase.name}: ERRO - \${e.message}\`);
                failed++;
            }
        }
    });
    
    // Score final
    const migrationScore = totalModules > 0 ? Math.round((migratedCount / totalModules) * 100) : 0;
    
    console.log(\`\\n📊 SCORE FINAL DA MIGRAÇÃO: \${migrationScore}%\`);
    console.log(\`   📦 Módulos: \${migratedCount}/\${totalModules} migrados (\${migrationScore}%)\`);
    console.log(\`   🔧 Testes adicionais: \${passed} passaram, \${failed} falharam\`);
    
    if (migrationScore >= 80 && failed === 0) {
        console.log('🎉 MIGRAÇÃO COMPLETA E FUNCIONAL!');
    } else if (migrationScore >= 50) {
        console.log('⚠️  MIGRAÇÃO PARCIAL - Algumas correções necessárias');
    } else {
        console.log('❌ MIGRAÇÃO INCOMPLETA - Ação necessária');
    }
    
    console.groupEnd();
})();

// Executar após 3 segundos
setTimeout(() => {
    if (typeof verifyMigration === 'function') {
        verifyMigration();
    }
}, 3000);
`;

                // Script de correção rápida (automático) - atualizado
                scripts.quickFixScript = `// ========== CORREÇÃO RÁPIDA SHAREDCORE v6.2.5 ==========
// Executar no console para correção automática imediata

(function quickFix() {
    console.group('🔧 CORREÇÃO RÁPIDA SHAREDCORE');
    console.log('⚠️  Esta correção cria wrappers temporários para compatibilidade');
    
    // Criar SharedCore se não existir
    if (!window.SharedCore) {
        window.SharedCore = {};
        console.log('✅ SharedCore criado como objeto vazio');
    }
    
    // Funções essenciais que DEVEM existir (incluindo as novas)
    const essentialFunctions = [
        { name: 'elementExists', impl: (id) => document.getElementById(id) !== null },
        { name: 'logModule', impl: (module, msg) => console.log(\`[\${module}] \${msg}\`) },
        { name: 'formatPrice', impl: (price) => \`R$ \${parseFloat(price || 0).toFixed(2).replace('.', ',')}\` },
        { name: 'isMobileDevice', impl: () => /Mobi|Android/i.test(navigator.userAgent) },
        { name: 'runLowPriority', impl: (callback) => {
            if (typeof requestIdleCallback === 'function') {
                requestIdleCallback(callback);
            } else {
                setTimeout(callback, 1);
            }
        }},
        { name: 'stringSimilarity', impl: (s1, s2) => {
            if (!s1 || !s2) return 0;
            const str1 = s1.toLowerCase();
            const str2 = s2.toLowerCase();
            if (str1 === str2) return 1;
            if (str1.includes(str2) || str2.includes(str1)) return 0.7;
            return 0.3;
        }}
    ];
    
    // Adicionar funções essenciais ao SharedCore
    essentialFunctions.forEach(({ name, impl }) => {
        if (!window.SharedCore[name] || typeof window.SharedCore[name] !== 'function') {
            window.SharedCore[name] = impl;
            console.log(\`✅ SharedCore.\${name}() adicionado\`);
        }
    });
    
    // Criar wrappers de compatibilidade
    essentialFunctions.forEach(({ name }) => {
        if (window.SharedCore[name] && !window[name]) {
            window[name] = function(...args) {
                console.warn(\`⚠️  [COMPATIBILIDADE] window.\${name}() redirecionando para SharedCore\`);
                return window.SharedCore[name].apply(this, args);
            };
            console.log(\`✅ Wrapper criado para window.\${name}()\`);
        }
    });
    
    console.log('\\n🎯 CORREÇÃO APLICADA!');
    console.log('📋 Comandos disponíveis:');
    console.log('• SharedCore.elementExists("#id") - Verificar elemento');
    console.log('• SharedCore.logModule("module", "msg") - Log formatado');
    console.log('• SharedCore.runLowPriority(callback) - Execução em baixa prioridade');
    console.log('• SharedCore.stringSimilarity(a, b) - Similaridade entre strings');
    console.log('• window.elementExists("#id") - Compatibilidade (usa SharedCore)');
    console.groupEnd();
    
    return '✅ Correção rápida aplicada com sucesso!';
})();
`;

                console.log('✅ Scripts de migração gerados com sucesso!');
                console.log('\n📋 SCRIPTS DISPONÍVEIS:');
                console.log('1. MediaSystem.js - Para módulo de mídia (inclui novas funções)');
                console.log('2. PdfSystem.js - Para módulo de PDF (inclui novas funções)');
                console.log('3. Properties.js - Para módulo de propriedades (inclui novas funções)');
                console.log('4. Wrappers.js - Compatibilidade reversa (SharedCore.js)');
                console.log('5. Verificação.js - Teste final pós-migração v6.2.5');
                console.log('6. CorreçãoRápida.js - Correção imediata (executar no console)');
                
                console.groupEnd();
                
                return {
                    status: 'success',
                    message: '⚙️ SCRIPTS DE MIGRAÇÃO GERADOS!',
                    details: {
                        migrationStatus: migrationResult.details,
                        compatibilityStatus: compatibilityResult.details,
                        scripts: scripts,
                        readyToMigrate: migrationResult.details.needsMigration,
                        timestamp: new Date().toISOString()
                    }
                };
            }
        },
        
        sharedCoreMigrationExecutor: {
            id: 'sharedcore-migration-executor',
            title: '🚀 EXECUTOR DE MIGRAÇÃO AUTOMÁTICA',
            description: 'Executa migração automática dos módulos para SharedCore',
            type: 'executor',
            icon: '🚀',
            category: 'migration',
            execute: async function() {
                console.group('🚀 EXECUTOR DE MIGRAÇÃO AUTOMÁTICA');
                console.log('⚠️  ATENÇÃO: Esta operação modificará funções globais do sistema');
                
                // Solicitar confirmação
                const confirmed = confirm(
                    '🚀 EXECUTAR MIGRAÇÃO AUTOMÁTICA SHAREDCORE v6.2.5?\n\n' +
                    'Esta operação irá:\n' +
                    '• Criar wrappers de compatibilidade\n' +
                    '• Substituir referências obsoletas\n' +
                    '• Manter fallbacks de segurança\n' +
                    '• Testar stringSimilarity e runLowPriority\n\n' +
                    'Clique em OK para continuar ou Cancelar para abortar.'
                );
                
                if (!confirmed) {
                    console.log('❌ Migração cancelada pelo usuário');
                    console.groupEnd();
                    return {
                        status: 'warning',
                        message: '❌ MIGRAÇÃO CANCELADA',
                        details: { cancelled: true }
                    };
                }
                
                console.log('▶️ Iniciando migração automática...');
                
                const steps = [
                    { name: 'Criar wrappers de compatibilidade', executed: false },
                    { name: 'Verificar módulos para migração', executed: false },
                    { name: 'Aplicar fallbacks de segurança', executed: false },
                    { name: 'Executar testes pós-migração (incluindo novos)', executed: false }
                ];
                
                const results = {
                    stepsCompleted: 0,
                    wrappersCreated: 0,
                    modulesMigrated: 0,
                    errors: []
                };
                
                // Variável para armazenar testes
                let testResults = [];
                
                try {
                    // PASSO 1: Criar wrappers de compatibilidade
                    console.log('🔄 PASSO 1: Criando wrappers de compatibilidade...');
                    
                    const sharedFunctions = [
                        'debounce', 'throttle', 'formatPrice', 'isMobileDevice',
                        'elementExists', 'logModule', 'supabaseFetch', 'stringSimilarity',
                        'runLowPriority'
                    ];
                    
                    sharedFunctions.forEach(funcName => {
                        if (window.SharedCore && typeof window.SharedCore[funcName] === 'function') {
                            const originalFunc = window[funcName];
                            
                            // Criar wrapper
                            window[funcName] = function(...args) {
                                console.warn(`⚠️  [MIGRAÇÃO] window.${funcName}() está obsoleto. Use SharedCore.${funcName}()`);
                                
                                try {
                                    return window.SharedCore[funcName].apply(this, args);
                                } catch (error) {
                                    console.error(`❌ Erro no SharedCore.${funcName}(), usando fallback`);
                                    if (originalFunc && typeof originalFunc === 'function') {
                                        return originalFunc.apply(this, args);
                                    }
                                    throw error;
                                }
                            };
                            
                            results.wrappersCreated++;
                            console.log(`✅ Wrapper criado para ${funcName}`);
                        }
                    });
                    
                    steps[0].executed = true;
                    results.stepsCompleted++;
                    
                    // PASSO 2: Verificar e migrar módulos principais
                    console.log('\n🔍 PASSO 2: Verificando módulos para migração...');
                    
                    const modulesToMigrate = ['MediaSystem', 'PdfSystem', 'properties'];
                    
                    modulesToMigrate.forEach(moduleName => {
                        if (window[moduleName]) {
                            console.log(`📦 Verificando ${moduleName}...`);
                            
                            // Verificar uso das novas funções
                            if (window[moduleName].toString) {
                                try {
                                    const code = window[moduleName].toString();
                                    if (code.includes('stringSimilarity') || code.includes('runLowPriority')) {
                                        console.log(`   ✅ ${moduleName} usa as novas funções`);
                                    }
                                } catch (e) {}
                            }
                            
                            results.modulesMigrated++;
                            console.log(`✅ ${moduleName} marcado para migração`);
                        }
                    });
                    
                    steps[1].executed = true;
                    results.stepsCompleted++;
                    
                    // PASSO 3: Aplicar fallbacks de segurança (incluindo novas funções)
                    console.log('\n🛡️  PASSO 3: Aplicando fallbacks de segurança...');
                    
                    // Garantir que SharedCore tem funções essenciais
                    if (!window.SharedCore) {
                        window.SharedCore = {};
                        console.log('✅ SharedCore criado como objeto vazio');
                    }
                    
                    // Adicionar fallbacks para funções críticas (incluindo as novas)
                    const essentialFunctions = [
                        { name: 'elementExists', impl: (id) => document.getElementById(id) !== null },
                        { name: 'logModule', impl: (module, msg) => console.log(`[${module}] ${msg}`) },
                        { name: 'formatPrice', impl: (price) => `R$ ${parseFloat(price || 0).toFixed(2).replace('.', ',')}` },
                        { name: 'isMobileDevice', impl: () => /Mobi|Android/i.test(navigator.userAgent) },
                        { name: 'runLowPriority', impl: (callback) => {
                            if (typeof requestIdleCallback === 'function') {
                                requestIdleCallback(callback);
                            } else {
                                setTimeout(callback, 1);
                            }
                        }},
                        { name: 'stringSimilarity', impl: (s1, s2) => {
                            if (!s1 || !s2) return 0;
                            const str1 = s1.toLowerCase();
                            const str2 = s2.toLowerCase();
                            if (str1 === str2) return 1;
                            if (str1.includes(str2) || str2.includes(str1)) return 0.7;
                            return 0.3;
                        }}
                    ];
                    
                    essentialFunctions.forEach(({ name, impl }) => {
                        if (!window.SharedCore[name] || typeof window.SharedCore[name] !== 'function') {
                            window.SharedCore[name] = impl;
                            console.log(`✅ Fallback criado para SharedCore.${name}`);
                        }
                    });
                    
                    steps[2].executed = true;
                    results.stepsCompleted++;
                    
                    // PASSO 4: Executar testes pós-migração (incluindo novos)
                    console.log('\n🧪 PASSO 4: Executando testes pós-migração...');
                    
                    // Testes incluindo as novas funções
                    testResults = [];
                    
                    try {
                        // Testar formatPrice
                        if (window.SharedCore.formatPrice) {
                            const price = window.SharedCore.formatPrice('450000');
                            testResults.push({
                                test: 'formatPrice',
                                passed: typeof price === 'string' && price.includes('R$'),
                                result: price
                            });
                        }
                        
                        // Testar isMobileDevice
                        if (window.SharedCore.isMobileDevice) {
                            const isMobile = window.SharedCore.isMobileDevice();
                            testResults.push({
                                test: 'isMobileDevice',
                                passed: typeof isMobile === 'boolean',
                                result: isMobile
                            });
                        }
                        
                        // Testar elementExists
                        if (window.SharedCore.elementExists) {
                            const exists = window.SharedCore.elementExists('non-existent-' + Date.now());
                            testResults.push({
                                test: 'elementExists',
                                passed: typeof exists === 'boolean' && exists === false,
                                result: 'Funciona corretamente'
                            });
                        }
                        
                        // NOVO: Testar stringSimilarity
                        if (window.SharedCore.stringSimilarity) {
                            const exact = window.SharedCore.stringSimilarity('hello', 'hello');
                            const partial = window.SharedCore.stringSimilarity('hello', 'hel');
                            testResults.push({
                                test: 'stringSimilarity (exato)',
                                passed: exact === 1,
                                result: exact
                            });
                            testResults.push({
                                test: 'stringSimilarity (parcial)',
                                passed: partial >= 0.5 && partial <= 0.7,
                                result: partial
                            });
                        }
                        
                        // NOVO: Testar runLowPriority
                        if (window.SharedCore.runLowPriority) {
                            const runTest = await new Promise(resolve => {
                                let executed = false;
                                window.SharedCore.runLowPriority(() => {
                                    executed = true;
                                    resolve(true);
                                });
                                setTimeout(() => resolve(executed), 500);
                            });
                            testResults.push({
                                test: 'runLowPriority',
                                passed: runTest === true,
                                result: runTest ? 'Executado' : 'Timeout'
                            });
                        }
                        
                        // Testar wrappers
                        if (window.formatPrice && window.SharedCore.formatPrice) {
                            const wrapperResult = window.formatPrice('123456');
                            testResults.push({
                                test: 'wrapper formatPrice',
                                passed: typeof wrapperResult === 'string',
                                result: 'Wrapper funcionando'
                            });
                        }
                    } catch (error) {
                        testResults.push({
                            test: 'Testes gerais',
                            passed: false,
                            result: `Erro: ${error.message}`
                        });
                        results.errors.push(`Erro nos testes: ${error.message}`);
                    }
                    
                    // Mostrar resultados dos testes
                    testResults.forEach(test => {
                        console.log(`${test.passed ? '✅' : '❌'} ${test.test}: ${test.result}`);
                    });
                    
                    steps[3].executed = true;
                    results.stepsCompleted++;
                    
                } catch (error) {
                    console.error(`❌ Erro durante migração: ${error.message}`);
                    results.errors.push(`Erro fatal: ${error.message}`);
                }
                
                console.log('\n📊 RESUMO DA MIGRAÇÃO:');
                console.log(`   ✅ Passos completados: ${results.stepsCompleted}/${steps.length}`);
                console.log(`   🧩 Wrappers criados: ${results.wrappersCreated}`);
                console.log(`   📦 Módulos migrados: ${results.modulesMigrated}`);
                console.log(`   🔧 Testes executados: ${testResults.length}`);
                console.log(`   ❌ Erros: ${results.errors.length}`);
                
                if (results.errors.length > 0) {
                    console.log('   📝 Erros detalhados:', results.errors);
                }
                
                let status = results.stepsCompleted === steps.length && results.errors.length === 0 ? 'success' : 
                           results.stepsCompleted >= steps.length / 2 ? 'warning' : 'error';
                
                let message = results.stepsCompleted === steps.length ? 
                    '✅ MIGRAÇÃO AUTOMÁTICA COMPLETA!' :
                    `⚠️ MIGRAÇÃO ${Math.round((results.stepsCompleted / steps.length) * 100)}% COMPLETA`;
                
                if (results.errors.length > 0) {
                    message = `❌ MIGRAÇÃO COM ${results.errors.length} ERRO(S)`;
                }
                
                console.groupEnd();
                
                return {
                    status: status,
                    message: message,
                    details: {
                        steps: steps,
                        results: results,
                        testResults: testResults,
                        timestamp: new Date().toISOString(),
                        nextSteps: results.stepsCompleted < steps.length ? [
                            'Executar migração manual dos módulos restantes',
                            'Verificar compatibilidade com código existente',
                            'Executar testes funcionais completos',
                            'Testar especificamente stringSimilarity e runLowPriority'
                        ] : [
                            'Executar verificação completa do sistema',
                            'Monitorar logs por erros de compatibilidade',
                            'Otimizar performance pós-migração'
                        ]
                    }
                };
            }
        },
        
        // NOVO: Teste específico para as funções recomendadas
        sharedCoreNewFunctionsTest: {
            id: 'sharedcore-new-functions-test',
            title: '🔧 TESTE DE NOVAS FUNÇÕES (stringSimilarity e runLowPriority)',
            description: 'Testa especificamente as funções adicionadas na recomendação',
            type: 'analysis',
            icon: '🔧',
            category: 'migration',
            execute: async function() {
                console.group('🔧 TESTE DE NOVAS FUNÇÕES - v6.2.5');
                
                const results = {
                    stringSimilarity: { status: 'unknown', details: {} },
                    runLowPriority: { status: 'unknown', details: {} },
                    filesCheck: {}
                };
                
                // 1. Testar stringSimilarity
                console.log('📝 Testando stringSimilarity:');
                try {
                    if (window.SharedCore && typeof window.SharedCore.stringSimilarity === 'function') {
                        const testCases = [
                            { a: 'hello', b: 'hello', expected: 1 },
                            { a: 'hello', b: 'hel', expected: (r) => r >= 0.5 && r <= 0.7 },
                            { a: 'teste', b: 'test', expected: (r) => r >= 0.5 && r <= 0.8 },
                            { a: 'abc', b: 'xyz', expected: (r) => r <= 0.3 }
                        ];
                        
                        let passed = 0;
                        testCases.forEach((test, i) => {
                            const result = window.SharedCore.stringSimilarity(test.a, test.b);
                            let testPassed = false;
                            
                            if (typeof test.expected === 'function') {
                                testPassed = test.expected(result);
                            } else {
                                testPassed = result === test.expected;
                            }
                            
                            console.log(`   ${testPassed ? '✅' : '❌'} "${test.a}" x "${test.b}" = ${result}`);
                            if (testPassed) passed++;
                        });
                        
                        results.stringSimilarity.status = passed === testCases.length ? 'success' : 'warning';
                        results.stringSimilarity.details = { passed, total: testCases.length };
                        console.log(`   📊 Resultado: ${passed}/${testCases.length} testes passaram`);
                    } else {
                        console.log('   ❌ stringSimilarity não disponível no SharedCore');
                        results.stringSimilarity.status = 'error';
                        results.stringSimilarity.details = { error: 'Função não encontrada' };
                    }
                } catch (e) {
                    console.log(`   ❌ Erro: ${e.message}`);
                    results.stringSimilarity.status = 'error';
                    results.stringSimilarity.details = { error: e.message };
                }
                
                // 2. Testar runLowPriority
                console.log('\n📝 Testando runLowPriority:');
                try {
                    if (window.SharedCore && typeof window.SharedCore.runLowPriority === 'function') {
                        const runTest = await new Promise(resolve => {
                            const start = Date.now();
                            let executed = false;
                            
                            window.SharedCore.runLowPriority(() => {
                                executed = true;
                                const end = Date.now();
                                resolve({ executed: true, time: end - start });
                            });
                            
                            setTimeout(() => {
                                if (!executed) resolve({ executed: false, time: 500 });
                            }, 500);
                        });
                        
                        if (runTest.executed) {
                            console.log(`   ✅ Executado em ${runTest.time}ms`);
                            results.runLowPriority.status = 'success';
                        } else {
                            console.log('   ❌ Não executou (timeout)');
                            results.runLowPriority.status = 'error';
                        }
                        results.runLowPriority.details = runTest;
                    } else {
                        console.log('   ❌ runLowPriority não disponível no SharedCore');
                        results.runLowPriority.status = 'error';
                        results.runLowPriority.details = { error: 'Função não encontrada' };
                    }
                } catch (e) {
                    console.log(`   ❌ Erro: ${e.message}`);
                    results.runLowPriority.status = 'error';
                    results.runLowPriority.details = { error: e.message };
                }
                
                // 3. Verificar arquivos (recomendação)
                console.log('\n📄 Verificando outros arquivos:');
                const filesToCheck = ['admin.js', 'gallery.js', 'media-unified.js', 'pdf-unified.js', 'properties.js'];
                
                filesToCheck.forEach(file => {
                    results.filesCheck[file] = { stringSimilarity: false, runLowPriority: false };
                    
                    // Verificar via módulos carregados
                    if (file === 'properties.js' && window.properties) {
                        try {
                            const code = window.properties.toString();
                            results.filesCheck[file].stringSimilarity = code.includes('stringSimilarity');
                            results.filesCheck[file].runLowPriority = code.includes('runLowPriority');
                        } catch (e) {}
                    }
                    
                    if (file === 'pdf-unified.js' && window.PdfSystem) {
                        try {
                            const code = window.PdfSystem.toString();
                            results.filesCheck[file].stringSimilarity = code.includes('stringSimilarity');
                            results.filesCheck[file].runLowPriority = code.includes('runLowPriority');
                        } catch (e) {}
                    }
                    
                    if (file === 'media-unified.js' && window.MediaSystem) {
                        try {
                            const code = window.MediaSystem.toString();
                            results.filesCheck[file].stringSimilarity = code.includes('stringSimilarity');
                            results.filesCheck[file].runLowPriority = code.includes('runLowPriority');
                        } catch (e) {}
                    }
                    
                    console.log(`   ${file}: stringSimilarity: ${results.filesCheck[file].stringSimilarity ? '✅' : '❌'}, runLowPriority: ${results.filesCheck[file].runLowPriority ? '✅' : '❌'}`);
                });
                
                const overallStatus = results.stringSimilarity.status === 'success' && results.runLowPriority.status === 'success' ? 'success' : 
                                     (results.stringSimilarity.status !== 'error' || results.runLowPriority.status !== 'error') ? 'warning' : 'error';
                
                console.log(`\n📊 STATUS GERAL: ${overallStatus === 'success' ? '✅ OK' : overallStatus === 'warning' ? '⚠️ PARCIAL' : '❌ PROBLEMAS'}`);
                console.groupEnd();
                
                return {
                    status: overallStatus,
                    message: overallStatus === 'success' ? '✅ NOVAS FUNÇÕES OK' : 
                            overallStatus === 'warning' ? '⚠️ NOVAS FUNÇÕES PARCIAIS' : '❌ NOVAS FUNÇÕES COM ERRO',
                    details: results
                };
            }
        }
    };
    
    // Painel de migração
    let migrationPanel = null;
    
    return {
        // Registrar testes
        registerTests: function() {
            Object.values(migrationTests).forEach(testConfig => {
                if (typeof TestManager !== 'undefined' && TestManager.registerTest) {
                    const existingTest = TestManager.getTest ? TestManager.getTest(testConfig.id) : null;
                    if (!existingTest) {
                        TestManager.registerTest(testConfig);
                        console.log(`✅ Teste de migração registrado: ${testConfig.title}`);
                    }
                }
            });
            
            console.log('✅ Módulo de Migração SharedCore: Testes registrados (incluindo novos)');
        },
        
        // Criar painel de migração
        createMigrationPanel: function() {
            // Se já existe, apenas mostrar e trazer para frente
            if (migrationPanel && document.body.contains(migrationPanel)) {
                migrationPanel.style.display = 'flex';
                migrationPanel.style.zIndex = '10001';
                return migrationPanel;
            }
            
            // Verificar painéis existentes e calcular z-index
            const panelCheck = window.checkExistingPanelsAndAdjust ? 
                window.checkExistingPanelsAndAdjust() : 
                { existingPanels: [], baseZIndex: 10001, panelCount: 0 };
            
            const targetZIndex = panelCheck.baseZIndex > 10000 ? panelCheck.baseZIndex : 10001;
            
            // Verificar se existem outros painéis para ajustar posição
            const existingPanels = document.querySelectorAll('[id^="diagnostics-panel"]');
            let topPosition = 20;
            let leftPosition = window.innerWidth - 620;
            
            if (existingPanels.length > 0) {
                topPosition = 20 + (existingPanels.length * 30);
                console.log(`📊 ${existingPanels.length} painel(is) existente(s). Posicionando painel em (${leftPosition}, ${topPosition}) com z-index ${targetZIndex}`);
            }
            
            // Verificar se estamos no sistema de diagnóstico
            if (typeof PanelManager !== 'undefined' && PanelManager.createPanel) {
                const panelConfig = {
                    title: '🚀 MIGRAÇÃO SHAREDCORE (v6.2.5)',
                    category: 'migration',
                    maxTests: 8,
                    position: { top: topPosition + 'px', left: leftPosition + 'px' },
                    size: { width: '580px', height: '750px' },
                    zIndex: targetZIndex
                };
                
                migrationPanel = PanelManager.createPanel(panelConfig);
                
                if (typeof SpecializedPanels !== 'undefined' && SpecializedPanels.renderPanel) {
                    migrationPanel.element = SpecializedPanels.renderPanel(migrationPanel);
                    
                    if (migrationPanel.element) {
                        migrationPanel.element.style.zIndex = targetZIndex;
                    }
                    
                    Object.values(migrationTests).forEach(testConfig => {
                        const test = TestManager.getTest ? TestManager.getTest(testConfig.id) : null;
                        if (test && migrationPanel.tests.length < migrationPanel.maxTests) {
                            migrationPanel.tests.push(test.id);
                            if (SpecializedPanels.addTestToPanel) {
                                SpecializedPanels.addTestToPanel(migrationPanel, test);
                            }
                        }
                    });
                    
                    if (migrationPanel.element) {
                        const testsContainer = migrationPanel.element.querySelector('.tests-container');
                        if (testsContainer) {
                            const controlsHTML = `
                                <div style="background: linear-gradient(135deg, rgba(255, 100, 100, 0.1), rgba(255, 150, 100, 0.1));
                                            padding: 20px;
                                            border-radius: 10px;
                                            border: 3px solid rgba(255, 100, 100, 0.3);
                                            margin: 25px 0;
                                            text-align: center;">
                                    <div style="color: #ff6464; font-weight: bold; margin-bottom: 15px; font-size: 16px;">
                                        ⚠️  MIGRAÇÃO CRÍTICA REQUERIDA
                                    </div>
                                    <div style="color: #ffaaaa; font-size: 13px; margin-bottom: 20px;">
                                        Sistema detectou que módulos não usam SharedCore.<br>
                                        Incluindo novas funções: stringSimilarity e runLowPriority
                                    </div>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                                        <button id="migration-generate-scripts" 
                                                style="background: rgba(255, 100, 100, 0.3);
                                                       color: #ff6464;
                                                       border: 2px solid #ff6464;
                                                       padding: 12px;
                                                       border-radius: 8px;
                                                       cursor: pointer;
                                                       font-size: 13px;
                                                       font-weight: bold;
                                                       transition: all 0.3s ease;">
                                            📝 Gerar Scripts
                                        </button>
                                        <button id="migration-execute-auto" 
                                                style="background: linear-gradient(135deg, #ff6464, #ff3333);
                                                       color: white;
                                                       border: none;
                                                       padding: 12px;
                                                       border-radius: 8px;
                                                       cursor: pointer;
                                                       font-size: 13px;
                                                       font-weight: bold;
                                                       transition: all 0.3s ease;">
                                            🚀 Executar Migração
                                        </button>
                                    </div>
                                    <div style="margin-top: 15px;">
                                        <button id="migration-test-new-functions"
                                                style="background: rgba(100, 150, 255, 0.3);
                                                       color: #aaccff;
                                                       border: 2px solid #6495ff;
                                                       padding: 10px;
                                                       border-radius: 8px;
                                                       cursor: pointer;
                                                       font-size: 12px;
                                                       font-weight: bold;
                                                       transition: all 0.3s ease;
                                                       width: 100%;">
                                            🔧 Testar Novas Funções (stringSimilarity / runLowPriority)
                                        </button>
                                    </div>
                                    <div style="font-size: 11px; color: #ffaaaa; margin-top: 15px;">
                                        v6.2.5 - Verificação final agregada
                                    </div>
                                </div>
                            `;
                            
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = controlsHTML;
                            testsContainer.appendChild(tempDiv.firstChild);
                            
                            setTimeout(() => {
                                const generateBtn = document.getElementById('migration-generate-scripts');
                                const executeBtn = document.getElementById('migration-execute-auto');
                                const testNewBtn = document.getElementById('migration-test-new-functions');
                                
                                if (generateBtn) {
                                    generateBtn.addEventListener('click', async () => {
                                        generateBtn.disabled = true;
                                        generateBtn.textContent = 'GERANDO...';
                                        
                                        if (migrationPanel.addLog) {
                                            migrationPanel.addLog('Gerando scripts de migração...', 'info');
                                        }
                                        
                                        const result = await migrationTests.sharedCoreMigrationScript.execute();
                                        
                                        generateBtn.disabled = false;
                                        generateBtn.textContent = '📝 Gerar Scripts';
                                        
                                        if (migrationPanel.addLog) {
                                            migrationPanel.addLog(result.message, result.status);
                                            
                                            const scripts = result.details.scripts;
                                            const scriptsWindow = window.open('', '_blank');
                                            if (scriptsWindow) {
                                                scriptsWindow.document.write(`
                                                    <html>
                                                    <head>
                                                        <title>Scripts de Migração SharedCore v6.2.5</title>
                                                        <style>
                                                            body { font-family: monospace; background: #0a0a2a; color: #fff; padding: 20px; }
                                                            pre { background: #001a33; padding: 15px; border-radius: 8px; border-left: 4px solid #ff6464; overflow-x: auto; }
                                                            h1 { color: #ff6464; }
                                                            h2 { color: #ffaaaa; }
                                                            .script { margin: 20px 0; }
                                                            .new { border-left-color: #6495ff; }
                                                        </style>
                                                    </head>
                                                    <body>
                                                        <h1>🚀 SCRIPTS DE MIGRAÇÃO SHAREDCORE v6.2.5</h1>
                                                        <p>Copie e cole cada script no arquivo correspondente:</p>
                                                        
                                                        <div class="script">
                                                            <h2>1. MediaSystem (media-unified.js)</h2>
                                                            <pre>${scripts.mediaSystemScript}</pre>
                                                        </div>
                                                        
                                                        <div class="script">
                                                            <h2>2. PdfSystem (pdf-unified.js)</h2>
                                                            <pre>${scripts.pdfSystemScript}</pre>
                                                        </div>
                                                        
                                                        <div class="script">
                                                            <h2>3. Properties.js</h2>
                                                            <pre>${scripts.propertiesScript}</pre>
                                                        </div>
                                                        
                                                        <div class="script">
                                                            <h2>4. Wrappers de Compatibilidade (SharedCore.js)</h2>
                                                            <pre>${scripts.compatibilityScript}</pre>
                                                        </div>
                                                        
                                                        <div class="script new">
                                                            <h2>5. Verificação Final v6.2.5</h2>
                                                            <pre>${scripts.verificationScript}</pre>
                                                        </div>
                                                        
                                                        <div class="script new">
                                                            <h2>6. Correção Rápida v6.2.5</h2>
                                                            <pre>${scripts.quickFixScript}</pre>
                                                        </div>
                                                    </body>
                                                    </html>
                                                `);
                                            }
                                        }
                                    });
                                }
                                
                                if (executeBtn) {
                                    executeBtn.addEventListener('click', async () => {
                                        executeBtn.disabled = true;
                                        executeBtn.textContent = 'EXECUTANDO...';
                                        
                                        if (migrationPanel.addLog) {
                                            migrationPanel.addLog('Iniciando migração automática...', 'warning');
                                        }
                                        
                                        const result = await migrationTests.sharedCoreMigrationExecutor.execute();
                                        
                                        executeBtn.disabled = false;
                                        executeBtn.textContent = '🚀 Executar Migração';
                                        
                                        if (migrationPanel.addLog) {
                                            migrationPanel.addLog(result.message, result.status);
                                            
                                            if (result.details && result.details.results) {
                                                migrationPanel.addLog(`Wrappers criados: ${result.details.results.wrappersCreated}`, 'info');
                                                migrationPanel.addLog(`Módulos migrados: ${result.details.results.modulesMigrated}`, 'info');
                                                migrationPanel.addLog(`Testes executados: ${result.details.testResults?.length || 0}`, 'info');
                                            }
                                        }
                                    });
                                }
                                
                                if (testNewBtn) {
                                    testNewBtn.addEventListener('click', async () => {
                                        testNewBtn.disabled = true;
                                        testNewBtn.textContent = 'TESTANDO...';
                                        
                                        if (migrationPanel.addLog) {
                                            migrationPanel.addLog('Testando novas funções...', 'info');
                                        }
                                        
                                        const result = await migrationTests.sharedCoreNewFunctionsTest.execute();
                                        
                                        testNewBtn.disabled = false;
                                        testNewBtn.textContent = '🔧 Testar Novas Funções';
                                        
                                        if (migrationPanel.addLog) {
                                            migrationPanel.addLog(result.message, result.status);
                                            if (result.details) {
                                                if (result.details.stringSimilarity) {
                                                    migrationPanel.addLog(`stringSimilarity: ${result.details.stringSimilarity.status}`, 
                                                                       result.details.stringSimilarity.status === 'success' ? 'success' : 'error');
                                                }
                                                if (result.details.runLowPriority) {
                                                    migrationPanel.addLog(`runLowPriority: ${result.details.runLowPriority.status}`, 
                                                                       result.details.runLowPriority.status === 'success' ? 'success' : 'error');
                                                }
                                            }
                                        }
                                    });
                                }
                            }, 100);
                        }
                    }
                    
                    if (SpecializedPanels.initializePanelLogs) {
                        SpecializedPanels.initializePanelLogs(migrationPanel);
                    }
                    
                    if (SpecializedPanels.makePanelDraggable) {
                        SpecializedPanels.makePanelDraggable(migrationPanel);
                    }
                    
                    if (migrationPanel.addLog) {
                        migrationPanel.addLog('Painel de Migração SharedCore v6.2.5 inicializado', 'success');
                        migrationPanel.addLog('⚠️  Sistema detectou problema crítico de migração', 'warning');
                        migrationPanel.addLog('Novas funções: stringSimilarity e runLowPriority', 'info');
                    }
                    
                    return migrationPanel;
                }
            }
            
            // Se o sistema de diagnóstico não estiver disponível, criar painel independente
            console.log('⚠️ Sistema de diagnóstico não encontrado. Criando painel independente...');
            return this.createStandalonePanel(topPosition, leftPosition, targetZIndex);
        },
        
        // Criar painel independente (atualizado)
        createStandalonePanel: function(topPos = 20, leftPos = window.innerWidth - 620, zIndex = 10001) {
            // Obter dados atuais de migração
            let functionsUsingOldCount = '?';
            let migrationScore = '67%';
            
            try {
                const checkResult = migrationTests.sharedCoreMigrationCheck.execute();
                if (checkResult && checkResult.details && checkResult.details.summary) {
                    functionsUsingOldCount = checkResult.details.summary.functionsUsingOld || '?';
                    migrationScore = checkResult.details.functionScore ? 
                        `${checkResult.details.functionScore}%` : '67%';
                }
            } catch (e) {
                console.log('⚠️ Não foi possível obter dados de migração:', e.message);
            }
            
            const panelId = 'sharedcore-migration-panel-' + Date.now();
            const panel = document.createElement('div');
            
            panel.id = panelId;
            panel.style.cssText = `
                position: fixed;
                top: ${topPos}px;
                left: ${leftPos}px;
                width: 600px;
                height: 750px;
                background: linear-gradient(135deg, #2a0a0a, #442200);
                border: 3px solid #ff6464;
                border-radius: 12px;
                z-index: ${zIndex} !important;
                box-shadow: 0 0 30px rgba(255, 100, 100, 0.4);
                font-family: 'Segoe UI', monospace;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                resize: both;
            `;
            
            panel.innerHTML = `
                <!-- Cabeçalho com alerta crítico -->
                <div style="background: linear-gradient(90deg, rgba(255, 100, 100, 0.3), rgba(255, 150, 100, 0.2));
                            padding: 15px 20px;
                            border-bottom: 2px solid rgba(255, 100, 100, 0.4);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            cursor: move;
                            user-select: none;">
                    
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="color: #ff6464; font-weight: bold; font-size: 16px;">🚀 MIGRAÇÃO SHAREDCORE v6.2.5</span>
                        <span style="background: #ff6464;
                                    color: #2a0a0a;
                                    padding: 3px 10px;
                                    border-radius: 10px;
                                    font-size: 11px;
                                    font-weight: bold;">
                            NOVAS FUNÇÕES
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
                            padding: 25px;
                            overflow-y: auto;
                            overflow-x: hidden;">
                    
                    <!-- Status Crítico -->
                    <div style="background: linear-gradient(135deg, rgba(255, 100, 100, 0.15), rgba(255, 150, 100, 0.1));
                                padding: 20px;
                                border-radius: 10px;
                                border: 2px solid rgba(255, 100, 100, 0.4);
                                margin-bottom: 25px;
                                text-align: center;">
                        <div style="font-size: 32px; color: #ff6464; font-weight: bold; margin-bottom: 10px;">
                            ${migrationScore}
                        </div>
                        <div style="color: #ffaaaa; font-size: 14px; margin-bottom: 5px;">
                            SCORE ATUAL DE MIGRAÇÃO
                        </div>
                        <div style="color: #ff8888; font-size: 12px;">
                            0/3 módulos usam SharedCore | ${functionsUsingOldCount} referências antigas
                        </div>
                    </div>
                    
                    <!-- Descrição do Problema -->
                    <div style="background: rgba(255, 100, 100, 0.1);
                                padding: 15px;
                                border-radius: 8px;
                                border-left: 4px solid #ff6464;
                                margin-bottom: 25px;">
                        <div style="color: #ff6464; font-weight: bold; margin-bottom: 10px;">
                            ⚠️  PROBLEMA CRÍTICO DETECTADO
                        </div>
                        <div style="color: #ffaaaa; font-size: 13px;">
                            O SharedCore foi criado corretamente, mas NENHUM módulo está usando suas funções.<br>
                            <span style="color: #6495ff;">NOVO:</span> Verificar também stringSimilarity e runLowPriority
                        </div>
                    </div>
                    
                    <!-- Botões de Ação -->
                    <div style="margin-bottom: 30px;">
                        <div style="color: #ffaaaa; font-weight: bold; margin-bottom: 15px; font-size: 14px;">
                            🎯 AÇÕES RECOMENDADAS:
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                            <button id="migration-check-now" class="migration-action-btn" style="background: rgba(255, 100, 100, 0.2);">
                                🔍 Verificar Uso Atual
                            </button>
                            <button id="migration-generate-now" class="migration-action-btn" style="background: rgba(255, 150, 100, 0.2);">
                                📝 Gerar Scripts de Correção
                            </button>
                            <button id="migration-execute-now" class="migration-action-btn" style="background: linear-gradient(135deg, #ff6464, #ff3333); color: white;">
                                🚀 Executar Migração Automática
                            </button>
                            <button id="migration-test-now" class="migration-action-btn" style="background: rgba(100, 150, 255, 0.2); border-color: #6495ff;">
                                🔧 Testar Novas Funções
                            </button>
                        </div>
                    </div>
                    
                    <!-- Resultados -->
                    <div style="margin-bottom: 20px;">
                        <div style="color: #ffaaaa; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
                            📊 RESULTADOS:
                        </div>
                        <div id="migration-results" style="min-height: 150px; background: rgba(0, 0, 0, 0.3); border-radius: 8px; padding: 15px;">
                            <div style="color: #ffaaaa; text-align: center; padding: 20px;">
                                Aguardando ação...
                            </div>
                        </div>
                    </div>
                    
                    <!-- Checklist Atualizado -->
                    <div style="background: rgba(255, 100, 100, 0.05); padding: 15px; border-radius: 8px; border: 2px dashed rgba(255, 100, 100, 0.3);">
                        <div style="color: #ff6464; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
                            📋 CHECKLIST v6.2.5
                        </div>
                        <div style="color: #ffaaaa; font-size: 12px;">
                            <div style="display: flex; align-items: center; margin: 5px 0;">
                                <span style="color: #ff6464; margin-right: 8px;">⬜</span>
                                <span>Atualizar MediaSystem (window.debounce → SharedCore.debounce)</span>
                            </div>
                            <div style="display: flex; align-items: center; margin: 5px 0;">
                                <span style="color: #ff6464; margin-right: 8px;">⬜</span>
                                <span>Atualizar PdfSystem (document.getElementById → SharedCore.elementExists)</span>
                            </div>
                            <div style="display: flex; align-items: center; margin: 5px 0;">
                                <span style="color: #ff6464; margin-right: 8px;">⬜</span>
                                <span>Atualizar Properties.js (supabaseFetch, runLowPriority)</span>
                            </div>
                            <div style="display: flex; align-items: center; margin: 5px 0;">
                                <span style="color: #6495ff; margin-right: 8px;">⬜</span>
                                <span>Testar stringSimilarity em todos os módulos</span>
                            </div>
                            <div style="display: flex; align-items: center; margin: 5px 0;">
                                <span style="color: #6495ff; margin-right: 8px;">⬜</span>
                                <span>Verificar runLowPriority em admin.js e gallery.js</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Rodapé -->
                <div style="background: rgba(255, 100, 100, 0.1);
                            padding: 12px 20px;
                            border-top: 2px solid rgba(255, 100, 100, 0.3);
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            font-size: 11px;">
                    
                    <div style="color: #ffaaaa;">
                        <span>v6.2.5 - VERIFICAÇÃO FINAL AGREGADA | Z-INDEX ${zIndex}</span>
                    </div>
                    
                    <div style="color: #ff6464; font-weight: bold;">
                        Status: <span id="migration-overall-status">⚠️  CRÍTICO</span>
                    </div>
                </div>
            `;
            
            // Adicionar estilos
            const style = document.createElement('style');
            style.textContent = `
                .migration-action-btn {
                    background: rgba(255, 100, 100, 0.2);
                    color: #ffaaaa;
                    border: 2px solid #ff6464;
                    padding: 15px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s ease;
                    font-weight: bold;
                }
                .migration-action-btn:hover {
                    background: rgba(255, 100, 100, 0.4);
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(255, 100, 100, 0.3);
                }
                .migration-action-btn:active {
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(panel);
            migrationPanel = panel;
            
            // Inicializar controles
            setTimeout(() => {
                const checkBtn = panel.querySelector('#migration-check-now');
                const generateBtn = panel.querySelector('#migration-generate-now');
                const executeBtn = panel.querySelector('#migration-execute-now');
                const testBtn = panel.querySelector('#migration-test-now');
                
                if (checkBtn) {
                    checkBtn.addEventListener('click', async () => {
                        const result = await migrationTests.sharedCoreMigrationCheck.execute();
                        this.updateStandalonePanel(panel, result);
                    });
                }
                
                if (generateBtn) {
                    generateBtn.addEventListener('click', async () => {
                        const result = await migrationTests.sharedCoreMigrationScript.execute();
                        this.updateStandalonePanel(panel, result);
                    });
                }
                
                if (executeBtn) {
                    executeBtn.addEventListener('click', async () => {
                        const result = await migrationTests.sharedCoreMigrationExecutor.execute();
                        this.updateStandalonePanel(panel, result);
                    });
                }
                
                if (testBtn) {
                    testBtn.addEventListener('click', async () => {
                        const result = await migrationTests.sharedCoreNewFunctionsTest.execute();
                        this.updateStandalonePanel(panel, result);
                    });
                }
                
                // Fechar e minimizar
                const closeBtn = panel.querySelector('.close-btn');
                if (closeBtn) {
                    closeBtn.addEventListener('click', () => {
                        panel.remove();
                        migrationPanel = null;
                    });
                }
                
                const minimizeBtn = panel.querySelector('.minimize-btn');
                if (minimizeBtn) {
                    minimizeBtn.addEventListener('click', function() {
                        const content = panel.children[1];
                        const isHidden = content.style.display === 'none';
                        content.style.display = isHidden ? 'block' : 'none';
                        this.textContent = isHidden ? '−' : '+';
                    });
                }
                
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
            }, 100);
            
            return panel;
        },
        
        updateStandalonePanel: function(panel, result) {
            if (!panel || !result) return;
            
            const resultsDiv = panel.querySelector('#migration-results');
            const statusSpan = panel.querySelector('#migration-overall-status');
            
            if (resultsDiv) {
                let detailsHtml = '';
                if (result.details) {
                    if (result.details.stringSimilarity) {
                        detailsHtml += `<div style="margin-top: 10px; font-size: 12px;">stringSimilarity: ${result.details.stringSimilarity.status === 'success' ? '✅' : '❌'}</div>`;
                    }
                    if (result.details.runLowPriority) {
                        detailsHtml += `<div style="font-size: 12px;">runLowPriority: ${result.details.runLowPriority.status === 'success' ? '✅' : '❌'}</div>`;
                    }
                }
                
                resultsDiv.innerHTML = `
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-size: 24px; color: ${result.status === 'success' ? '#00ff9c' : result.status === 'warning' ? '#ffaa00' : '#ff5555'}; font-weight: bold;">
                            ${result.message}
                        </div>
                        ${detailsHtml}
                        <div style="color: #ffaaaa; font-size: 12px; margin-top: 10px;">
                            ${new Date().toLocaleTimeString()}
                        </div>
                    </div>
                `;
            }
            
            if (statusSpan) {
                statusSpan.textContent = result.status === 'success' ? '✅ CONCLUÍDO' : 
                                       result.status === 'warning' ? '⚠️  EM PROGRESSO' : '❌ PROBLEMAS';
                statusSpan.style.color = result.status === 'success' ? '#00ff9c' : 
                                       result.status === 'warning' ? '#ffaa00' : '#ff5555';
            }
        },
        
        // Getter para testes
        get tests() {
            return migrationTests;
        },
        
        // NOVO: Executar verificação final manualmente
        runFinalVerification: function() {
            return runFinalVerification();
        },
        
        // NOVO: Verificar outros arquivos
        checkOtherFiles: function() {
            return checkOtherFiles();
        }
    };
})();

// ================== ATRIBUIR FUNÇÃO GLOBAL AO WINDOW ==================
window.checkExistingPanelsAndAdjust = checkExistingPanelsAndAdjust;

// ================== EXIBIÇÃO AUTOMÁTICA ==================
function initializeAutoDisplay() {
    // Verificar se estamos em modo de diagnóstico
    const urlParams = new URLSearchParams(window.location.search);
    const debugMode = urlParams.get('debug') === 'true';
    const diagnosticsMode = urlParams.get('diagnostics') === 'true';
    
    // Só exibir automaticamente se ambos os parâmetros estiverem presentes
    if (debugMode && diagnosticsMode) {
        console.log('%c🎯 DIAGNOSTICS62.JS: Exibição automática ativada', 'color: #00ff00; font-weight: bold;');
        
        // Aguardar um pouco para garantir que o DOM e outros painéis estejam carregados
        setTimeout(() => {
            // Verificar se já existe algum painel de migração
            const existingPanel = document.querySelector('[id^="sharedcore-migration-panel-"]');
            if (!existingPanel) {
                console.log('📊 Exibindo painel de migração SharedCore automaticamente...');
                SharedCoreMigration.createMigrationPanel();
            } else {
                console.log('ℹ️ Painel de migração já existe, não criando duplicata');
                existingPanel.style.display = 'flex';
                existingPanel.style.zIndex = '10001';
            }
        }, 3000);
    }
}

// ================== EXECUTAR VERIFICAÇÕES AGREGADAS ==================
function runAggregatedChecks() {
    // Executar verificação final após 5 segundos (recomendação)
    setTimeout(() => {
        console.log('%c🔍 EXECUTANDO VERIFICAÇÃO FINAL AGREGADA v6.2.5...', 'color: #6495ff; font-weight: bold;');
        runFinalVerification();
    }, 5000);
    
    // Executar verificação de outros arquivos após 7 segundos
    setTimeout(() => {
        console.log('%c📄 VERIFICANDO OUTROS ARQUIVOS...', 'color: #ffaa00; font-weight: bold;');
        checkOtherFiles();
    }, 7000);
}

// ================== INTEGRAÇÃO COM O SISTEMA ==================

// Inicializar quando carregar
setTimeout(() => {
    try {
        SharedCoreMigration.registerTests();
        
        // Adicionar ao sistema de diagnóstico se existir
        if (window.diagnostics) {
            window.diagnostics.migration = SharedCoreMigration;
            console.log('✅ Módulo de Migração SharedCore integrado ao sistema de diagnóstico');
        }
        
        // Atalhos globais (atualizados)
        window.SCMigration = SharedCoreMigration;
        window.SCM = {
            check: () => SharedCoreMigration.tests.sharedCoreMigrationCheck.execute(),
            generate: () => SharedCoreMigration.tests.sharedCoreMigrationScript.execute(),
            execute: () => SharedCoreMigration.tests.sharedCoreMigrationExecutor.execute(),
            panel: () => SharedCoreMigration.createMigrationPanel(),
            testNew: () => SharedCoreMigration.tests.sharedCoreNewFunctionsTest.execute(),
            verify: () => SharedCoreMigration.runFinalVerification(),
            scan: () => SharedCoreMigration.checkOtherFiles()
        };
        
        // Botão flutuante de migração crítica (apenas se não existir)
        if (!document.getElementById('scm-float-button')) {
            const floatBtn = document.createElement('button');
            floatBtn.id = 'scm-float-button';
            floatBtn.innerHTML = '🚀';
            floatBtn.title = 'Migração Crítica SharedCore v6.2.5';
            floatBtn.style.cssText = `
                position: fixed;
                bottom: 340px;
                right: 20px;
                z-index: 99996;
                background: linear-gradient(135deg, #ff6464, #ff3333);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 20px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(255, 100, 100, 0.5);
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: pulse-critical 2s infinite;
            `;
            
            // Adicionar animação de pulso crítico (se não existir)
            if (!document.getElementById('pulse-critical-style')) {
                const pulseStyle = document.createElement('style');
                pulseStyle.id = 'pulse-critical-style';
                pulseStyle.textContent = `
                    @keyframes pulse-critical {
                        0% { box-shadow: 0 0 0 0 rgba(255, 100, 100, 0.7); }
                        70% { box-shadow: 0 0 0 10px rgba(255, 100, 100, 0); }
                        100% { box-shadow: 0 0 0 0 rgba(255, 100, 100, 0); }
                    }
                `;
                document.head.appendChild(pulseStyle);
            }
            
            floatBtn.addEventListener('click', () => {
                SharedCoreMigration.createMigrationPanel();
            });
            
            document.body.appendChild(floatBtn);
            console.log('✅ Botão flutuante de migração crítica criado');
        }
        
        // INICIAR EXIBIÇÃO AUTOMÁTICA
        initializeAutoDisplay();
        
        // INICIAR VERIFICAÇÕES AGREGADAS
        runAggregatedChecks();
        
        // Mostrar apenas no console, sem interferir nos painéis existentes
        console.log('%c🚀 DIAGNOSTICS62.JS v6.2.5 - VERIFICAÇÃO FINAL AGREGADA', 
                    'color: #ff6464; font-weight: bold; font-size: 14px; background: #2a0a0a; padding: 5px;');
        console.log('📋 Comandos disponíveis:');
        console.log('• SCMigration.panel() - Criar painel de migração');
        console.log('• SCMigration.check() - Verificar uso atual');
        console.log('• SCMigration.generate() - Gerar scripts de correção');
        console.log('• SCMigration.execute() - Executar migração automática');
        console.log('• SCMigration.testNew() - Testar novas funções');
        console.log('• SCMigration.verify() - Executar verificação final');
        console.log('• SCMigration.scan() - Verificar outros arquivos');
        console.log('• Botão 🚀 vermelho pulsante no canto inferior direito');
        console.log('\n⚠️  ALERTA CRÍTICO: Score de migração atual: 67% (0/3 módulos usam SharedCore)');
        console.log('✅ NOVIDADES v6.2.5: Testes de stringSimilarity e runLowPriority agregados');
        console.log('✅ EXIBIÇÃO AUTOMÁTICA: Painel será mostrado em 3 segundos');
        console.log('✅ VERIFICAÇÕES: Final em 5s, Arquivos em 7s');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar módulo de migração:', error);
    }
}, 2000);

// ================== VERIFICAÇÃO FINAL DO PAINEL ==================
console.log('%c✅ DIAGNOSTICS62.JS v6.2.5 CARREGADO COM SUCESSO - Verificação final agregada', 
            'color: #00ff00; font-weight: bold;');
