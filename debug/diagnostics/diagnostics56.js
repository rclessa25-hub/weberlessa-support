// ============================================================================
// DIAGNOSTICS56.JS - VERSÃO 5.6 CORRIGIDA (COMPATÍVEL COM v5.7)
// ============================================================================

console.log('✅ MÓDULOS DE DIAGNÓSTICO PDF - VERSÃO COMPATÍVEL v5.6 (CORRIGIDA)');

/* ================== CONFIGURAÇÃO DE COMPATIBILIDADE ================== */
const DIAGNOSTICS56_CONFIG = {
    version: '5.6-corrected',
    compatibilityMode: true,
    waitForBridge: true, // AGUARDAR diagnostics57.js
    bridgeTimeout: 5000,
    allowBridgeOverrides: true,
    logPrefix: '[DIAG56]'
};

/* ================== VERIFICAÇÃO DO SISTEMA DE PONTE ================== */
function checkBridgeSystem() {
    console.group(`${DIAGNOSTICS56_CONFIG.logPrefix} VERIFICANDO SISTEMA DE PONTE`);
    
    const bridgeStatus = {
        // Verificar se o diagnostics57.js está carregado
        diagnostics57: typeof window.deepCoreDiagnosis === 'function',
        bridgeIntegration: typeof window.integrateDiagnosticsSystems === 'function',
        bridgeFunctions: typeof window.createCompatibilityBridge === 'function',
        
        // Verificar se as funções críticas já foram criadas pela ponte
        criticalFunctions: {
            loadExistingPdfsForEdit: typeof window.loadExistingPdfsForEdit === 'function',
            getMediaUrlsForProperty: typeof window.getMediaUrlsForProperty === 'function',
            showPdfModal: typeof window.showPdfModal === 'function',
            clearAllPdfs: typeof window.clearAllPdfs === 'function',
            testPdfSystem: typeof window.testPdfSystem === 'function'
        }
    };
    
    console.log('📊 Status da ponte:', bridgeStatus);
    
    if (bridgeStatus.diagnostics57) {
        console.log('🌉 Diagnostics57.js detectado - Modo de compatibilidade ativo');
        console.log('✅ Deferindo criação de funções para a ponte');
    } else {
        console.warn('⚠️ Diagnostics57.js não detectado - Modo autônomo');
    }
    
    console.groupEnd();
    
    return bridgeStatus;
}

/* ================== VERIFICAÇÃO DE FUNÇÕES EXISTENTES (MODIFICADA) ================== */
window.diagnoseExistingFunctions = function() {
    console.group(`${DIAGNOSTICS56_CONFIG.logPrefix} VERIFICAÇÃO DE FUNÇÕES EXISTENTES`);
    
    // PRIMEIRO: Verificar se o sistema de ponte está disponível
    const bridgeStatus = checkBridgeSystem();
    
    // Lista de funções CRÍTICAS
    const criticalFunctions = [
        'showPdfModal',
        'testPdfSystem',
        'clearAllPdfs',
        'loadExistingPdfsForEdit',
        'getMediaUrlsForProperty',
        'interactivePdfTest'
    ];
    
    const results = {
        exists: [],
        missing: [],
        bridgeAvailable: bridgeStatus.diagnostics57,
        bridgeHandled: [],
        timestamp: new Date().toISOString(),
        version: DIAGNOSTICS56_CONFIG.version
    };
    
    criticalFunctions.forEach(funcName => {
        try {
            const exists = funcName in window;
            const type = exists ? typeof window[funcName] : 'undefined';
            
            // SE A PONTE ESTÁ DISPONÍVEL, NÃO CRIAR FUNÇÕES
            if (bridgeStatus.diagnostics57 && bridgeStatus.criticalFunctions[funcName]) {
                // Função será criada pela ponte (diagnostics57.js)
                results.bridgeHandled.push(funcName);
                console.log(`🔗 ${funcName}: Será criada pela ponte (v5.7)`);
                return;
            }
            
            if (exists) {
                results.exists.push({
                    name: funcName,
                    type: type,
                    isFunction: type === 'function'
                });
                console.log(`✅ ${funcName}: ${type} ${type === 'function' ? '✓' : ''}`);
            } else {
                // SE NÃO HÁ PONTE, criar função básica (APENAS EM ÚLTIMO CASO)
                if (!bridgeStatus.diagnostics57) {
                    results.missing.push(funcName);
                    console.warn(`⚠️ ${funcName}: NÃO EXISTE (sem ponte)`);
                } else {
                    console.log(`⏳ ${funcName}: Aguardando criação pela ponte...`);
                }
            }
        } catch (error) {
            console.error(`❌ ${funcName}: ERRO - ${error.message}`);
        }
    });
    
    // VERIFICAR SISTEMAS DUPLICADOS (MODIFICADO)
    const duplicateSystems = [];
    
    if (window.MediaSystem && window.PdfSystem) {
        const mediaHasPdf = typeof window.MediaSystem.processAndSavePdfs === 'function';
        const pdfHasPdf = typeof window.PdfSystem.processAndSavePdfs === 'function';
        
        if (mediaHasPdf && pdfHasPdf) {
            duplicateSystems.push('MediaSystem e PdfSystem ambos com processAndSavePdfs');
        }
    }
    
    if (duplicateSystems.length > 0) {
        console.warn('⚠️ SISTEMAS DUPLICADOS DETECTADOS:');
        duplicateSystems.forEach(sys => console.warn(`  - ${sys}`));
        results.duplicateSystems = duplicateSystems;
    }
    
    console.log('📊 RESUMO:');
    console.log(`- Funções existentes: ${results.exists.length}`);
    console.log(`- Funções faltando: ${results.missing.length}`);
    console.log(`- Ponte disponível: ${results.bridgeAvailable ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`- Funções delegadas à ponte: ${results.bridgeHandled.length}`);
    
    if (results.bridgeAvailable && results.bridgeHandled.length > 0) {
        console.log('🔗 Funções que serão criadas pela ponte:', results.bridgeHandled.join(', '));
    }
    
    console.groupEnd();
    
    return results;
};

/* ================== CORREÇÃO AUTOMÁTICA (MODIFICADA) ================== */
window.autoFixMissingFunctions = function() {
    console.group(`${DIAGNOSTICS56_CONFIG.logPrefix} CORREÇÃO AUTOMÁTICA`);
    
    const fixes = [];
    const skipped = [];
    const bridgeStatus = checkBridgeSystem();
    
    // SE A PONTE ESTÁ DISPONÍVEL, NÃO CRIAR FUNÇÕES
    if (bridgeStatus.diagnostics57) {
        console.log('🌉 Ponte v5.7 detectada - delegando criação de funções...');
        console.log('⏳ Aguardando o sistema de ponte criar as funções necessárias');
        
        // Aguardar um pouco para a ponte criar as funções
        setTimeout(() => {
            const functionsToCheck = [
                'showPdfModal', 'testPdfSystem', 'clearAllPdfs',
                'loadExistingPdfsForEdit', 'getMediaUrlsForProperty'
            ];
            
            functionsToCheck.forEach(funcName => {
                if (typeof window[funcName] !== 'function') {
                    console.warn(`⚠️ Ponte não criou ${funcName} - criando fallback básico`);
                    
                    // Fallback muito básico apenas para evitar erros
                    if (funcName === 'showPdfModal') {
                        window.showPdfModal = function() {
                            console.warn('⚠️ showPdfModal - Modo fallback (ponte não funcionou)');
                            const modal = document.getElementById('pdfModal');
                            if (modal) modal.style.display = 'flex';
                            return false;
                        };
                        fixes.push(`${funcName} (fallback)`);
                    }
                } else {
                    console.log(`✅ ${funcName} criado pela ponte`);
                }
            });
        }, 1000);
        
        console.groupEnd();
        return {
            fixesApplied: fixes,
            skipped: functionsToCheck.map(f => `${f} (delegado à ponte)`),
            bridgeUsed: true,
            timestamp: new Date().toISOString()
        };
    }
    
    // SE NÃO HÁ PONTE, criar funções básicas (MANTIDO PARA COMPATIBILIDADE)
    console.warn('⚠️ Ponte v5.7 não detectada - criando funções básicas...');
    
    // ... (manter o código original de criação de funções, MAS com flag indicando que é fallback)
    
    console.log(`📊 RESUMO: ${fixes.length} função(ões) criada(s) como fallback`);
    
    console.groupEnd();
    
    return {
        fixesApplied: fixes,
        skipped,
        bridgeUsed: false,
        fallbackMode: true,
        timestamp: new Date().toISOString()
    };
};

/* ================== DETECTAR E REMOVER REFERÊNCIAS QUEBRADAS (MODIFICADO) ================== */
window.detectAndRemoveBrokenReferences = function() {
    console.group(`${DIAGNOSTICS56_CONFIG.logPrefix} DETECTANDO REFERÊNCIAS QUEBRADAS`);
    
    const potentiallyBrokenRefs = [
        'ValidationSystem',
        'EmergencySystem',
        'PdfLogger',
        'verifyMediaMigration',
        'testModuleCompatibility',
        'autoValidateMigration',
        'analyzePlaceholders',
        'analyzeBrokenReferences',
        'testPdfUploadBugFix',
        'verifyPdfSystemIntegrity',
        'monitorPdfPostCorrection',
        'verifyRollbackCompatibility',
        'finalPdfSystemValidation'
    ];
    
    const bridgeStatus = checkBridgeSystem();
    const brokenRefs = [];
    const workingRefs = [];
    const bridgeManagedRefs = [];
    
    potentiallyBrokenRefs.forEach(ref => {
        try {
            let exists = false;
            
            if (ref.includes('.')) {
                const parts = ref.split('.');
                let current = window;
                
                for (const part of parts) {
                    if (current && typeof current === 'object' && part in current) {
                        current = current[part];
                    } else {
                        current = undefined;
                        break;
                    }
                }
                
                exists = current !== undefined;
            } else {
                exists = ref in window;
            }
            
            if (exists) {
                workingRefs.push(ref);
                console.log(`✅ ${ref}: EXISTE`);
            } else {
                // VERIFICAR SE É UMA REFERÊNCIA QUE SERÁ CRIADA PELA PONTE
                const isBridgeFunction = [
                    'verifyRollbackCompatibility',
                    'finalPdfSystemValidation',
                    'monitorPdfPostCorrection'
                ].includes(ref);
                
                if (isBridgeFunction && bridgeStatus.diagnostics57) {
                    bridgeManagedRefs.push(ref);
                    console.log(`🔗 ${ref}: Será gerenciado pela ponte`);
                } else {
                    brokenRefs.push(ref);
                    console.warn(`❌ ${ref}: NÃO EXISTE`);
                }
            }
        } catch (error) {
            console.error(`⚠️ ${ref}: ERRO NA VERIFICAÇÃO - ${error.message}`);
        }
    });
    
    // NÃO CRIAR PLACEHOLDERS SE A PONTE ESTÁ DISPONÍVEL
    if (bridgeStatus.diagnostics57 && bridgeManagedRefs.length > 0) {
        console.log('🌉 Referências delegadas à ponte:', bridgeManagedRefs.join(', '));
    } else if (brokenRefs.length > 0) {
        console.warn(`⚠️ ${brokenRefs.length} REFERÊNCIA(S) QUEBRADA(S):`, brokenRefs);
    }
    
    console.log('📊 RESUMO:');
    console.log(`- Referências funcionando: ${workingRefs.length}`);
    console.log(`- Referências quebradas: ${brokenRefs.length}`);
    console.log(`- Gerenciadas pela ponte: ${bridgeManagedRefs.length}`);
    
    console.groupEnd();
    
    return {
        workingRefs,
        brokenRefs,
        bridgeManagedRefs,
        bridgeAvailable: bridgeStatus.diagnostics57,
        timestamp: new Date().toISOString()
    };
};

/* ================== INTEGRAÇÃO COM O SISTEMA DE PONTE ================== */
(function integrateWithBridgeSystem() {
    console.log(`${DIAGNOSTICS56_CONFIG.logPrefix} INTEGRANDO COM SISTEMA DE PONTE`);
    
    // Aguardar um pouco para verificar se o diagnostics57.js carregou
    setTimeout(() => {
        const bridgeStatus = checkBridgeSystem();
        
        if (bridgeStatus.diagnostics57) {
            console.log('✅ Integração com ponte v5.7 estabelecida');
            
            // Registrar no sistema de ponte
            window.diag = window.diag || {};
            window.diag.v56 = {
                version: DIAGNOSTICS56_CONFIG.version,
                functions: {
                    diagnoseExistingFunctions: window.diagnoseExistingFunctions,
                    autoFixMissingFunctions: window.autoFixMissingFunctions,
                    detectAndRemoveBrokenReferences: window.detectAndRemoveBrokenReferences
                },
                bridgeIntegrated: true,
                integratedAt: new Date().toISOString()
            };
            
            console.log('📋 Diagnostics56.js registrado no sistema de ponte');
        } else {
            console.warn('⚠️ Sistema de ponte não detectado - operando em modo autônomo');
            
            // Executar em modo autônomo (compatibilidade)
            setTimeout(() => {
                if (window.diagnoseExistingFunctions) {
                    window.diagnoseExistingFunctions();
                }
                
                // Criar apenas funções críticas se necessário
                setTimeout(() => {
                    const criticalFunctions = ['showPdfModal', 'clearAllPdfs'];
                    let needsFallback = false;
                    
                    criticalFunctions.forEach(funcName => {
                        if (typeof window[funcName] !== 'function') {
                            console.warn(`⚠️ ${funcName} não existe - criando fallback`);
                            needsFallback = true;
                        }
                    });
                    
                    if (needsFallback && window.autoFixMissingFunctions) {
                        window.autoFixMissingFunctions();
                    }
                }, 2000);
            }, 1000);
        }
    }, 3000); // Aguardar mais tempo para o diagnostics57.js carregar
})();

/* ================== PAINEL DE CONTROLE (MODIFICADO) ================== */
window.showCompatibilityControlPanel = function() {
    console.group(`${DIAGNOSTICS56_CONFIG.logPrefix} PAINEL DE CONTROLE`);
    
    const bridgeStatus = checkBridgeSystem();
    
    // SE A PONTE ESTÁ DISPONÍVEL, DELEGAR PARA ELA
    if (bridgeStatus.diagnostics57 && typeof window.showIntegrationControlPanel === 'function') {
        console.log('🌉 Delegando controle para ponte v5.7...');
        return window.showIntegrationControlPanel();
    }
    
    // SE NÃO HÁ PONTE, mostrar painel básico
    console.warn('⚠️ Mostrando painel básico (sem ponte)');
    
    // ... (código original do painel)
    
    console.groupEnd();
};

/* ================== EXECUÇÃO AUTOMÁTICA (MODIFICADA) ================== */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            // Verificar primeiro se a ponte está disponível
            const bridgeStatus = checkBridgeSystem();
            
            if (bridgeStatus.diagnostics57) {
                console.log('⏳ Aguardando ponte v5.7 inicializar...');
                
                // Aguardar mais tempo para a ponte criar funções
                setTimeout(() => {
                    // Verificar se as funções foram criadas
                    const criticalFunctions = [
                        'showPdfModal', 'clearAllPdfs',
                        'loadExistingPdfsForEdit', 'getMediaUrlsForProperty'
                    ];
                    
                    let allCreated = true;
                    criticalFunctions.forEach(funcName => {
                        if (typeof window[funcName] !== 'function') {
                            console.warn(`⚠️ Ponte não criou ${funcName}`);
                            allCreated = false;
                        }
                    });
                    
                    if (!allCreated) {
                        console.warn('⚠️ Ponte incompleta - executando diagnóstico básico');
                        if (window.diagnoseExistingFunctions) {
                            window.diagnoseExistingFunctions();
                        }
                    } else {
                        console.log('✅ Ponte v5.7 funcionando corretamente');
                    }
                }, 4000);
            } else {
                console.warn('⚠️ Sem ponte - executando em modo autônomo');
                setTimeout(() => {
                    if (window.safeInitDiagnostics) {
                        window.safeInitDiagnostics();
                    }
                }, 2000);
            }
        }, 1000);
    });
} else {
    setTimeout(() => {
        const bridgeStatus = checkBridgeSystem();
        
        if (!bridgeStatus.diagnostics57) {
            console.warn('⚠️ Sem ponte - inicializando modo autônomo');
            if (window.safeInitDiagnostics) {
                window.safeInitDiagnostics();
            }
        }
    }, 1000);
}

console.log(`✅ ${DIAGNOSTICS56_CONFIG.logPrefix} MÓDULO CARREGADO (v${DIAGNOSTICS56_CONFIG.version})`);
console.log('🔗 Modo: ' + (checkBridgeSystem().diagnostics57 ? 'INTEGRADO COM PONTE' : 'AUTÔNOMO'));
