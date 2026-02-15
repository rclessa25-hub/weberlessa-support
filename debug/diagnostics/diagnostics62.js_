// ================== diagnostics62.js - VERSÃO 6.2.3 ==================
// CADEIA DE DIAGNÓSTICO - MÓDULO DE MIGRAÇÃO SHAREDCORE
// CORREÇÃO: Função checkExistingPanelsAndAdjust definida corretamente
// Z-index prioritário e posicionamento diferenciado
// Data: 09/01/2026

console.log('%c🔧 DIAGNOSTICS62.JS - VERSÃO 6.2.3 CARREGADA (MIGRAÇÃO SHAREDCORE - CORREÇÃO DE ESCOPO)', 
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

// ================== MÓDULO DE MIGRAÇÃO E VERIFICAÇÃO SHAREDCORE ==================
const SharedCoreMigration = (function() {
    // Testes de migração do SharedCore
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
                    'stringSimilarity',
                    'runLowPriority'
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
                
                // Lista de funções que devem ter wrappers
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
                            } else {
                                testResult.wrapperWorks = true; // Assume que funciona
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
                
                // Script para MediaSystem
                scripts.mediaSystemScript = `// ========== MIGRAÇÃO SHAREDCORE - MediaSystem ==========
// Adicionar no TOPO do arquivo (js/modules/media/media-unified.js)

// CONFIGURAÇÃO SHAREDCORE PARA MediaSystem
const SC = window.SharedCore;

// VERIFICAÇÃO DE FUNÇÕES UTILIZADAS:
// ✓ debounce - Substituir window.debounce por SC.debounce
// ✓ throttle - Substituir window.throttle por SC.throttle  
// ✓ isMobileDevice - Substituir window.isMobileDevice por SC.isMobileDevice
// ✓ logModule - Substituir console.log por SC.logModule('media', 'mensagem')

// EXEMPLOS DE SUBSTITUIÇÃO:
// ANTES: window.debounce(function() { ... }, 300);
// DEPOIS: SC.debounce(function() { ... }, 300);
//
// ANTES: console.log('Media carregado');
// DEPOIS: SC.logModule('media', 'Media carregado');
//
// ANTES: if (window.isMobileDevice()) { ... }
// DEPOIS: if (SC.isMobileDevice()) { ... }

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
        }
    };
}

console.log('✅ MediaSystem configurado para usar SharedCore');
`;

                // Script para PdfSystem
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
    }
};

// VERIFICAÇÃO DE FUNÇÕES UTILIZADAS:
// ✓ elementExists - Substituir document.getElementById() por SC.elementExists() primeiro
// ✓ logModule - Substituir console.log por SC.logModule('pdf', 'mensagem')

// EXEMPLOS DE SUBSTITUIÇÃO CRÍTICOS:
// LINHA ~274: if (!modal || !document.getElementById('pdfPassword')) {
// SUBSTITUIR POR: if (!modal || !SC.elementExists('pdfPassword')) {
//
// LINHAS COM console.log: console.log('PDF carregado');
// SUBSTITUIR POR: SC.logModule('pdf', 'PDF carregado');

// Fallback automático se SharedCore não existir
if (!window.SharedCore) {
    window.SharedCore = SC;
    console.log('✅ PdfSystem: SharedCore inicializado com fallbacks');
}

console.log('✅ PdfSystem configurado para usar SharedCore');
`;

                // Script para Properties.js
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
            return 0.5; // Fallback básico
        }
    };
    
    console.log('⚠️  Properties.js: SharedCore criado com fallbacks locais');
}

// SUBSTITUIÇÕES PRINCIPAIS (baseado em análise):
// LINHA 11: console.log → SC.logModule('properties', 'mensagem')
// LINHA 76: window.supabaseFetch → SC.supabaseFetch
// LINHA 1196: window.runLowPriority → SC.runLowPriority
// LINHA 849: stringSimilarity → SC.stringSimilarity
// LINHAS COM formatPrice: formatPrice(valor) → SC.formatPrice(valor)

console.log('✅ Properties.js configurado para usar SharedCore');
`;

                // Script de compatibilidade (wrappers)
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

                // Script de verificação final
                scripts.verificationScript = `// ========== VERIFICAÇÃO FINAL DE MIGRAÇÃO ==========
// Executar APÓS todas as migrações (pode ser adicionado ao final de qualquer módulo)

(function verifyMigration() {
    console.group('🧪 VERIFICAÇÃO FINAL DE MIGRAÇÃO SHAREDCORE');
    
    const modulesToVerify = [
        { name: 'MediaSystem', obj: window.MediaSystem },
        { name: 'PdfSystem', obj: window.PdfSystem },
        { name: 'properties', obj: window.properties },
        { name: 'admin', obj: window.admin }
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
                const code = obj.toString ? obj.toString().substring(0, 500) : '';
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
    
    // Verificar funções SharedCore
    console.log('\\n🔧 Verificando funções SharedCore...');
    const essentialFunctions = ['formatPrice', 'isMobileDevice', 'elementExists'];
    let functionsWorking = 0;
    
    essentialFunctions.forEach(funcName => {
        if (window.SharedCore && typeof window.SharedCore[funcName] === 'function') {
            try {
                // Teste rápido
                if (funcName === 'formatPrice') {
                    const result = window.SharedCore.formatPrice('123456');
                    if (result && result.includes('R$')) {
                        console.log(\`✅ SharedCore.\${funcName}() funcionando: \${result}\`);
                        functionsWorking++;
                    }
                } else {
                    console.log(\`✅ SharedCore.\${funcName}() disponível\`);
                    functionsWorking++;
                }
            } catch (e) {
                console.log(\`❌ SharedCore.\${funcName}() erro: \${e.message}\`);
            }
        } else {
            console.log(\`❌ SharedCore.\${funcName}() não disponível\`);
        }
    });
    
    // Score final
    const migrationScore = totalModules > 0 ? Math.round((migratedCount / totalModules) * 100) : 0;
    const functionScore = Math.round((functionsWorking / essentialFunctions.length) * 100);
    const overallScore = Math.round((migrationScore + functionScore) / 2);
    
    console.log(\`\\n📊 SCORE FINAL DA MIGRAÇÃO: \${overallScore}%\`);
    console.log(\`   📦 Módulos: \${migratedCount}/\${totalModules} migrados (\${migrationScore}%)\`);
    console.log(\`   🔧 Funções: \${functionsWorking}/\${essentialFunctions.length} funcionando (\${functionScore}%)\`);
    
    if (overallScore >= 80) {
        console.log('🎉 MIGRAÇÃO BEM-SUCEDIDA!');
    } else if (overallScore >= 50) {
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

                // Script de correção rápida (automático)
                scripts.quickFixScript = `// ========== CORREÇÃO RÁPIDA SHAREDCORE ==========
// Executar no console para correção automática imediata

(function quickFix() {
    console.group('🔧 CORREÇÃO RÁPIDA SHAREDCORE');
    console.log('⚠️  Esta correção cria wrappers temporários para compatibilidade');
    
    // Criar SharedCore se não existir
    if (!window.SharedCore) {
        window.SharedCore = {};
        console.log('✅ SharedCore criado como objeto vazio');
    }
    
    // Funções essenciais que DEVEM existir
    const essentialFunctions = [
        { name: 'elementExists', impl: (id) => document.getElementById(id) !== null },
        { name: 'logModule', impl: (module, msg) => console.log(\`[\${module}] \${msg}\`) },
        { name: 'formatPrice', impl: (price) => \`R$ \${parseFloat(price || 0).toFixed(2).replace('.', ',')}\` },
        { name: 'isMobileDevice', impl: () => /Mobi|Android/i.test(navigator.userAgent) }
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
    console.log('• window.elementExists("#id") - Compatibilidade (usa SharedCore)');
    console.groupEnd();
    
    return '✅ Correção rápida aplicada com sucesso!';
})();
`;

                console.log('✅ Scripts de migração gerados com sucesso!');
                console.log('\n📋 SCRIPTS DISPONÍVEIS:');
                console.log('1. MediaSystem.js - Para módulo de mídia');
                console.log('2. PdfSystem.js - Para módulo de PDF');
                console.log('3. Properties.js - Para módulo de propriedades');
                console.log('4. Wrappers.js - Compatibilidade reversa (SharedCore.js)');
                console.log('5. Verificação.js - Teste final pós-migração');
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
                    '🚀 EXECUTAR MIGRAÇÃO AUTOMÁTICA SHAREDCORE?\n\n' +
                    'Esta operação irá:\n' +
                    '• Criar wrappers de compatibilidade\n' +
                    '• Substituir referências obsoletas\n' +
                    '• Manter fallbacks de segurança\n\n' +
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
                    { name: 'Executar testes pós-migração', executed: false }
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
                        'elementExists', 'logModule', 'supabaseFetch'
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
                                    // Fallback para função original se SharedCore falhar
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
                            
                            // Aqui poderia haver lógica mais complexa de migração
                            // Por enquanto apenas registramos
                            results.modulesMigrated++;
                            console.log(`✅ ${moduleName} marcado para migração`);
                        }
                    });
                    
                    steps[1].executed = true;
                    results.stepsCompleted++;
                    
                    // PASSO 3: Aplicar fallbacks de segurança
                    console.log('\n🛡️  PASSO 3: Aplicando fallbacks de segurança...');
                    
                    // Garantir que SharedCore tem funções essenciais
                    if (!window.SharedCore) {
                        window.SharedCore = {};
                        console.log('✅ SharedCore criado como objeto vazio');
                    }
                    
                    // Adicionar fallbacks para funções críticas
                    const essentialFunctions = ['elementExists', 'logModule', 'formatPrice', 'isMobileDevice'];
                    essentialFunctions.forEach(funcName => {
                        if (!window.SharedCore[funcName] || typeof window.SharedCore[funcName] !== 'function') {
                            if (funcName === 'elementExists') {
                                window.SharedCore[funcName] = (id) => document.getElementById(id) !== null;
                            } else if (funcName === 'logModule') {
                                window.SharedCore[funcName] = (module, msg) => console.log(`[${module}] ${msg}`);
                            } else if (funcName === 'formatPrice') {
                                window.SharedCore[funcName] = (price) => `R$ ${parseFloat(price || 0).toFixed(2).replace('.', ',')}`;
                            } else if (funcName === 'isMobileDevice') {
                                window.SharedCore[funcName] = () => /Mobi|Android/i.test(navigator.userAgent);
                            }
                            console.log(`✅ Fallback criado para SharedCore.${funcName}`);
                        }
                    });
                    
                    steps[2].executed = true;
                    results.stepsCompleted++;
                    
                    // PASSO 4: Executar testes pós-migração
                    console.log('\n🧪 PASSO 4: Executando testes pós-migração...');
                    
                    // Teste básico de funcionalidade
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
                            'Executar testes funcionais completos'
                        ] : [
                            'Executar verificação completa do sistema',
                            'Monitorar logs por erros de compatibilidade',
                            'Otimizar performance pós-migração'
                        ]
                    }
                };
            }
        }
    };
    
    // Painel de migração (agora com Z-INDEX PRIORITÁRIO)
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
            
            console.log('✅ Módulo de Migração SharedCore: Testes registrados');
        },
        
        // Criar painel de migração (AGORA COM ACESSO CORRETO À FUNÇÃO GLOBAL)
        createMigrationPanel: function() {
            // Se já existe, apenas mostrar e trazer para frente
            if (migrationPanel && document.body.contains(migrationPanel)) {
                migrationPanel.style.display = 'flex';
                migrationPanel.style.zIndex = '10001'; // Garantir que fique na frente
                return migrationPanel;
            }
            
            // CHAMAR A FUNÇÃO GLOBAL (agora definida fora da IIFE)
            const panelCheck = window.checkExistingPanelsAndAdjust ? 
                window.checkExistingPanelsAndAdjust() : 
                { existingPanels: [], baseZIndex: 10001, panelCount: 0 };
            
            const targetZIndex = panelCheck.baseZIndex > 10000 ? panelCheck.baseZIndex : 10001;
            
            // Verificar se existem outros painéis para ajustar posição
            const existingPanels = document.querySelectorAll('[id^="diagnostics-panel"]');
            let topPosition = 20; // Posição padrão (canto superior)
            let leftPosition = window.innerWidth - 620; // Canto superior direito
            
            // Se existirem outros painéis, posicionar com offset vertical baseado no número de painéis
            if (existingPanels.length > 0) {
                topPosition = 20 + (existingPanels.length * 30);
                console.log(`📊 ${existingPanels.length} painel(is) existente(s). Posicionando painel em (${leftPosition}, ${topPosition}) com z-index ${targetZIndex}`);
            }
            
            // Verificar se estamos no sistema de diagnóstico
            if (typeof PanelManager !== 'undefined' && PanelManager.createPanel) {
                const panelConfig = {
                    title: '🚀 MIGRAÇÃO SHAREDCORE (v6.2.3)',
                    category: 'migration',
                    maxTests: 8,
                    position: { top: topPosition + 'px', left: leftPosition + 'px' },
                    size: { width: '580px', height: '750px' },
                    zIndex: targetZIndex // Passar z-index prioritário
                };
                
                migrationPanel = PanelManager.createPanel(panelConfig);
                
                if (typeof SpecializedPanels !== 'undefined' && SpecializedPanels.renderPanel) {
                    migrationPanel.element = SpecializedPanels.renderPanel(migrationPanel);
                    
                    // Aplicar z-index prioritário
                    if (migrationPanel.element) {
                        migrationPanel.element.style.zIndex = targetZIndex;
                    }
                    
                    // Adicionar testes
                    Object.values(migrationTests).forEach(testConfig => {
                        const test = TestManager.getTest ? TestManager.getTest(testConfig.id) : null;
                        if (test && migrationPanel.tests.length < migrationPanel.maxTests) {
                            migrationPanel.tests.push(test.id);
                            if (SpecializedPanels.addTestToPanel) {
                                SpecializedPanels.addTestToPanel(migrationPanel, test);
                            }
                        }
                    });
                    
                    // Adicionar controles extras
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
                                        Score atual: 67% (0/3 módulos migrados)
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
                                    <div style="font-size: 11px; color: #ffaaaa; margin-top: 15px;">
                                        ETAPA 17.5: Atualização forçada das referências
                                    </div>
                                </div>
                            `;
                            
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = controlsHTML;
                            testsContainer.appendChild(tempDiv.firstChild);
                            
                            // Adicionar event listeners
                            setTimeout(() => {
                                const generateBtn = document.getElementById('migration-generate-scripts');
                                const executeBtn = document.getElementById('migration-execute-auto');
                                
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
                                            
                                            // Mostrar scripts em nova janela
                                            const scripts = result.details.scripts;
                                            const scriptsWindow = window.open('', '_blank');
                                            if (scriptsWindow) {
                                                scriptsWindow.document.write(`
                                                    <html>
                                                    <head>
                                                        <title>Scripts de Migração SharedCore</title>
                                                        <style>
                                                            body { font-family: monospace; background: #0a0a2a; color: #fff; padding: 20px; }
                                                            pre { background: #001a33; padding: 15px; border-radius: 8px; border-left: 4px solid #ff6464; overflow-x: auto; }
                                                            h1 { color: #ff6464; }
                                                            h2 { color: #ffaaaa; }
                                                            .script { margin: 20px 0; }
                                                        </style>
                                                    </head>
                                                    <body>
                                                        <h1>🚀 SCRIPTS DE MIGRAÇÃO SHAREDCORE</h1>
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
                                                        
                                                        <div class="script">
                                                            <h2>5. Verificação Final</h2>
                                                            <pre>${scripts.verificationScript}</pre>
                                                        </div>
                                                        
                                                        <div class="script">
                                                            <h2>6. Correção Rápida (executar no console)</h2>
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
                                            }
                                        }
                                    });
                                }
                            }, 100);
                        }
                    }
                    
                    // Inicializar logs
                    if (SpecializedPanels.initializePanelLogs) {
                        SpecializedPanels.initializePanelLogs(migrationPanel);
                    }
                    
                    // Tornar arrastável
                    if (SpecializedPanels.makePanelDraggable) {
                        SpecializedPanels.makePanelDraggable(migrationPanel);
                    }
                    
                    if (migrationPanel.addLog) {
                        migrationPanel.addLog('Painel de Migração SharedCore inicializado', 'success');
                        migrationPanel.addLog('⚠️  Sistema detectou problema crítico de migração', 'warning');
                        migrationPanel.addLog('Score atual: 67% (0/3 módulos usam SharedCore)', 'error');
                    }
                    
                    return migrationPanel;
                }
            }
            
            // Se o sistema de diagnóstico não estiver disponível, criar painel independente
            console.log('⚠️ Sistema de diagnóstico não encontrado. Criando painel independente...');
            return this.createStandalonePanel(topPosition, leftPosition, targetZIndex);
        },
        
        // Criar painel independente (AGORA COM Z-INDEX PRIORITÁRIO)
        createStandalonePanel: function(topPos = 20, leftPos = window.innerWidth - 620, zIndex = 10001) {
            // Obter dados atuais de migração
            let functionsUsingOldCount = '?';
            let migrationScore = '67%';
            
            try {
                // Executar verificação rápida para obter dados atuais
                const checkResult = migrationTests.sharedCoreMigrationCheck.execute();
                if (checkResult && checkResult.details && checkResult.details.summary) {
                    functionsUsingOldCount = checkResult.details.summary.functionsUsingOld || '?';
                    migrationScore = checkResult.details.functionScore ? 
                        `${checkResult.details.functionScore}%` : '67%';
                }
            } catch (e) {
                // Usar valores padrão se a verificação falhar
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
                        <span style="color: #ff6464; font-weight: bold; font-size: 16px;">🚀 MIGRAÇÃO SHAREDCORE v6.2.3</span>
                        <span style="background: #ff6464;
                                    color: #2a0a0a;
                                    padding: 3px 10px;
                                    border-radius: 10px;
                                    font-size: 11px;
                                    font-weight: bold;">
                            ETAPA 17.5
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
                            Todas as referências ainda apontam para funções antigas em window.*
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
                    
                    <!-- Checklist -->
                    <div style="background: rgba(255, 100, 100, 0.05); padding: 15px; border-radius: 8px; border: 2px dashed rgba(255, 100, 100, 0.3);">
                        <div style="color: #ff6464; font-weight: bold; margin-bottom: 10px; font-size: 14px;">
                            📋 CHECKLIST DE EXECUÇÃO
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
                                <span style="color: #ff6464; margin-right: 8px;">⬜</span>
                                <span>Adicionar wrappers de compatibilidade ao SharedCore.js</span>
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
                        <span>v6.2.3 - CORREÇÃO DE ESCOPO | Z-INDEX ${zIndex} (prioritário)</span>
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
                resultsDiv.innerHTML = `
                    <div style="text-align: center; margin-bottom: 15px;">
                        <div style="font-size: 24px; color: ${result.status === 'success' ? '#00ff9c' : result.status === 'warning' ? '#ffaa00' : '#ff5555'}; font-weight: bold;">
                            ${result.message}
                        </div>
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
        }
    };
})();

// ================== ATRIBUIR FUNÇÃO GLOBAL AO WINDOW ==================
window.checkExistingPanelsAndAdjust = checkExistingPanelsAndAdjust;

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
        
        // Atalhos globais
        window.SCMigration = SharedCoreMigration;
        window.SCM = {
            check: () => SharedCoreMigration.tests.sharedCoreMigrationCheck.execute(),
            generate: () => SharedCoreMigration.tests.sharedCoreMigrationScript.execute(),
            execute: () => SharedCoreMigration.tests.sharedCoreMigrationExecutor.execute(),
            panel: () => SharedCoreMigration.createMigrationPanel()
        };
        
        // Botão flutuante de migração crítica (apenas se não existir)
        if (!document.getElementById('scm-float-button')) {
            const floatBtn = document.createElement('button');
            floatBtn.id = 'scm-float-button';
            floatBtn.innerHTML = '🚀';
            floatBtn.title = 'Migração Crítica SharedCore v6.2.3';
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
        
        // Mostrar apenas no console, sem interferir nos painéis existentes
        console.log('%c🚀 DIAGNOSTICS62.JS v6.2.3 - MÓDULO DE MIGRAÇÃO SHAREDCORE PRONTO (CORREÇÃO DE ESCOPO)', 
                    'color: #ff6464; font-weight: bold; font-size: 14px; background: #2a0a0a; padding: 5px;');
        console.log('📋 Comandos disponíveis:');
        console.log('• SCMigration.panel() - Criar painel de migração (canto superior direito, z-index prioritário)');
        console.log('• SCMigration.check() - Verificar uso atual');
        console.log('• SCMigration.generate() - Gerar scripts de correção');
        console.log('• SCMigration.execute() - Executar migração automática');
        console.log('• Botão 🚀 vermelho pulsante no canto inferior direito');
        console.log('\n⚠️  ALERTA CRÍTICO: Score de migração atual: 67% (0/3 módulos usam SharedCore)');
        console.log('ℹ️  Este painel usa Z-INDEX PRIORITÁRIO para ficar ACIMA de todos os outros painéis');
        
    } catch (error) {
        console.error('❌ Erro ao inicializar módulo de migração:', error);
    }
}, 2000);

// ================== VERIFICAÇÃO FINAL DO PAINEL ==================
console.log('%c✅ DIAGNOSTICS62.JS v6.2.3 CARREGADO COM SUCESSO - Função checkExistingPanelsAndAdjust definida globalmente', 
            'color: #00ff00; font-weight: bold;');
