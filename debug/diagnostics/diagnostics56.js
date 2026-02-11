// ================== debug/diagnostics/diagnostics56.js ==================
// SISTEMA DE DIAGNÓSTICO E COMPATIBILIDADE - VERSÃO 5.6.5 (CORREÇÃO PDFLOGGER)
// CORREÇÃO: Criar métodos PdfLogger.logPdfAccess, .logPdfError, .logPdfSuccess
// =========================================================================

(function() {
    'use strict';
    
    // ========== CONSTANTES DE SEGURANÇA ==========
    const SAFETY = {
        LEGITIMATE_FUNCTIONS: [
            'PdfLogger',
            'PdfLogger.logPdfAccess',
            'PdfLogger.logPdfError',
            'PdfLogger.logPdfSuccess',
            'PdfLogger.logPdfWarning',
            'PdfLogger.getStats',
            'verifyMediaMigration',
            'testModuleCompatibility',
            'autoValidateMigration',
            'analyzePlaceholders',
            'analyzeBrokenReferences',
            'testPdfUploadBugFix',
            'verifyPdfSystemIntegrity',
            'diagnosePdfIconProblem',
            'runPdfCompatibilityCheck',
            'interactivePdfTest',
            'MediaSystem',
            'PdfSystem',
            'SharedCore',
            'FilterManager',
            'LoadingManager',
            'properties',
            'supabaseClient'
        ],
        
        PLACEHOLDERS_TO_REMOVE: [
            'ValidationSystem',
            'EmergencySystem',
            'monitorPdfPostCorrection',
            'verifyRollbackCompatibility',
            'finalPdfSystemValidation'
        ],
        
        VERSION: '5.6.5',
        MODULE_NAME: 'DIAG56-FIX'
    };

    // ========== UTILITÁRIOS DE LOG ==========
    const log = {
        info: (msg) => console.log(`✅ ${SAFETY.MODULE_NAME} - ${msg}`),
        warn: (msg) => console.warn(`⚠️ ${SAFETY.MODULE_NAME} - ${msg}`),
        error: (msg) => console.error(`❌ ${SAFETY.MODULE_NAME} - ${msg}`),
        critical: (msg) => console.error(`🚨 ${SAFETY.MODULE_NAME} - ${msg}`),
        group: (msg) => console.group(`🔍 ${SAFETY.MODULE_NAME} - ${msg}`),
        groupEnd: () => console.groupEnd()
    };

    // ========== REPARO COMPLETO DO PDFLOGGER ==========
    function repairPdfLogger() {
        log.group('REPARANDO PDFLOGGER');
        
        const fixes = [];
        
        // 1. GARANTIR que PdfLogger existe
        if (!('PdfLogger' in window)) {
            console.log('   🔧 Criando PdfLogger...');
            window.PdfLogger = {
                _logs: [],
                _errors: 0,
                _success: 0,
                _access: 0
            };
            fixes.push('PdfLogger (criado)');
        }
        
        // 2. CRIAR método logPdfAccess
        if (typeof window.PdfLogger.logPdfAccess !== 'function') {
            console.log('   🔧 Criando PdfLogger.logPdfAccess...');
            window.PdfLogger.logPdfAccess = function(propertyId, action = 'view') {
                const timestamp = new Date().toISOString();
                const logEntry = {
                    type: 'access',
                    propertyId,
                    action,
                    timestamp
                };
                
                if (!window.PdfLogger._logs) window.PdfLogger._logs = [];
                window.PdfLogger._logs.push(logEntry);
                window.PdfLogger._access = (window.PdfLogger._access || 0) + 1;
                
                console.log(`📄 [PDF LOGGER] Acesso ao PDF - Imóvel: ${propertyId}, Ação: ${action}`);
                return logEntry;
            };
            fixes.push('PdfLogger.logPdfAccess');
        }
        
        // 3. CRIAR método logPdfError
        if (typeof window.PdfLogger.logPdfError !== 'function') {
            console.log('   🔧 Criando PdfLogger.logPdfError...');
            window.PdfLogger.logPdfError = function(propertyId, error, context = '') {
                const timestamp = new Date().toISOString();
                const logEntry = {
                    type: 'error',
                    propertyId,
                    error: error?.message || String(error),
                    context,
                    timestamp
                };
                
                if (!window.PdfLogger._logs) window.PdfLogger._logs = [];
                window.PdfLogger._logs.push(logEntry);
                window.PdfLogger._errors = (window.PdfLogger._errors || 0) + 1;
                
                console.error(`❌ [PDF LOGGER] Erro PDF - Imóvel: ${propertyId}, Erro: ${logEntry.error}`);
                return logEntry;
            };
            fixes.push('PdfLogger.logPdfError');
        }
        
        // 4. CRIAR método logPdfSuccess
        if (typeof window.PdfLogger.logPdfSuccess !== 'function') {
            console.log('   🔧 Criando PdfLogger.logPdfSuccess...');
            window.PdfLogger.logPdfSuccess = function(propertyId, action = 'download') {
                const timestamp = new Date().toISOString();
                const logEntry = {
                    type: 'success',
                    propertyId,
                    action,
                    timestamp
                };
                
                if (!window.PdfLogger._logs) window.PdfLogger._logs = [];
                window.PdfLogger._logs.push(logEntry);
                window.PdfLogger._success = (window.PdfLogger._success || 0) + 1;
                
                console.log(`✅ [PDF LOGGER] Sucesso PDF - Imóvel: ${propertyId}, Ação: ${action}`);
                return logEntry;
            };
            fixes.push('PdfLogger.logPdfSuccess');
        }
        
        // 5. CRIAR método logPdfWarning
        if (typeof window.PdfLogger.logPdfWarning !== 'function') {
            console.log('   🔧 Criando PdfLogger.logPdfWarning...');
            window.PdfLogger.logPdfWarning = function(propertyId, warning, context = '') {
                const timestamp = new Date().toISOString();
                const logEntry = {
                    type: 'warning',
                    propertyId,
                    warning: String(warning),
                    context,
                    timestamp
                };
                
                if (!window.PdfLogger._logs) window.PdfLogger._logs = [];
                window.PdfLogger._logs.push(logEntry);
                
                console.warn(`⚠️ [PDF LOGGER] Aviso PDF - Imóvel: ${propertyId}, Aviso: ${warning}`);
                return logEntry;
            };
            fixes.push('PdfLogger.logPdfWarning');
        }
        
        // 6. CRIAR método getStats
        if (typeof window.PdfLogger.getStats !== 'function') {
            console.log('   🔧 Criando PdfLogger.getStats...');
            window.PdfLogger.getStats = function() {
                const stats = {
                    access: window.PdfLogger._access || 0,
                    errors: window.PdfLogger._errors || 0,
                    success: window.PdfLogger._success || 0,
                    totalLogs: window.PdfLogger._logs?.length || 0,
                    timestamp: new Date().toISOString()
                };
                
                console.log('📊 [PDF LOGGER] Estatísticas:', stats);
                return stats;
            };
            fixes.push('PdfLogger.getStats');
        }
        
        // 7. CRIAR método clearLogs
        if (typeof window.PdfLogger.clearLogs !== 'function') {
            window.PdfLogger.clearLogs = function() {
                window.PdfLogger._logs = [];
                window.PdfLogger._access = 0;
                window.PdfLogger._errors = 0;
                window.PdfLogger._success = 0;
                console.log('🧹 [PDF LOGGER] Logs limpos');
                return true;
            };
            fixes.push('PdfLogger.clearLogs');
        }
        
        console.log(`\n📊 REPAROS APLICADOS: ${fixes.length}`);
        if (fixes.length > 0) {
            console.log('   Detalhes:', fixes.join(', '));
        }
        
        log.groupEnd();
        return fixes;
    }

    // ========== CRIAÇÃO DE FUNÇÕES LEGÍTIMAS ==========
    function createMissingLegitimateFunctions() {
        log.group('CRIANDO FUNÇÕES LEGÍTIMAS AUSENTES');
        
        const created = [];
        
        // 1. REPARAR PDFLOGGER PRIMEIRO
        const pdfLoggerFixes = repairPdfLogger();
        created.push(...pdfLoggerFixes);
        
        // 2. CRIAR interactivePdfTest
        if (typeof window.interactivePdfTest !== 'function') {
            console.log('   🔧 Criando interactivePdfTest...');
            window.interactivePdfTest = function() {
                console.group('🎮 interactivePdfTest - TESTE INTERATIVO DE PDF');
                
                // Testar PdfLogger
                if (window.PdfLogger) {
                    console.log('✅ PdfLogger disponível');
                    if (typeof window.PdfLogger.logPdfAccess === 'function') {
                        window.PdfLogger.logPdfAccess(101, 'test_interactive');
                    }
                    if (typeof window.PdfLogger.getStats === 'function') {
                        const stats = window.PdfLogger.getStats();
                        console.log('📊 Estatísticas:', stats);
                    }
                }
                
                // Testar PdfSystem
                if (window.PdfSystem) {
                    console.log('✅ PdfSystem disponível');
                    if (typeof window.PdfSystem.testButtons === 'function') {
                        window.PdfSystem.testButtons();
                    }
                    
                    if (window.properties && window.properties.length > 0) {
                        const propertyWithPdf = window.properties.find(p => p.pdfs && p.pdfs !== 'EMPTY');
                        if (propertyWithPdf && typeof window.PdfSystem.showModal === 'function') {
                            window.PdfSystem.showModal(propertyWithPdf.id);
                        }
                    }
                }
                
                console.groupEnd();
                return { success: true, timestamp: new Date().toISOString() };
            };
            created.push('interactivePdfTest');
        }
        
        // 3. CRIAR diagnosePdfIconProblem
        if (typeof window.diagnosePdfIconProblem !== 'function') {
            window.diagnosePdfIconProblem = function() {
                console.group('🔍 diagnosePdfIconProblem');
                
                const pdfIcons = document.querySelectorAll('.pdf-access, .fa-file-pdf');
                console.log(`📊 Encontrados ${pdfIcons.length} ícones PDF`);
                
                pdfIcons.forEach((icon, i) => {
                    const parent = icon.closest('.property-card');
                    const title = parent?.getAttribute('data-property-title') || 'Desconhecido';
                    const propertyId = parent?.getAttribute('data-property-id');
                    console.log(`   ${i+1}. Ícone em: ${title} (ID: ${propertyId})`);
                    
                    // Log no PdfLogger
                    if (window.PdfLogger?.logPdfAccess) {
                        window.PdfLogger.logPdfAccess(propertyId || 'unknown', 'icon_display');
                    }
                });
                
                console.groupEnd();
                return { count: pdfIcons.length };
            };
            created.push('diagnosePdfIconProblem');
        }
        
        // 4. CRIAR runPdfCompatibilityCheck
        if (typeof window.runPdfCompatibilityCheck !== 'function') {
            window.runPdfCompatibilityCheck = function() {
                console.group('🔄 runPdfCompatibilityCheck');
                
                const checks = {
                    pdfLogger: !!window.PdfLogger,
                    pdfLoggerLogAccess: typeof window.PdfLogger?.logPdfAccess === 'function',
                    pdfLoggerLogError: typeof window.PdfLogger?.logPdfError === 'function',
                    pdfLoggerLogSuccess: typeof window.PdfLogger?.logPdfSuccess === 'function',
                    pdfSystem: !!window.PdfSystem,
                    pdfModal: !!document.getElementById('pdfModal'),
                    pdfPasswordField: !!document.getElementById('pdfPassword'),
                    mediaSystem: !!window.MediaSystem,
                    propertiesWithPdf: window.properties?.filter(p => p.pdfs && p.pdfs !== 'EMPTY').length || 0
                };
                
                console.log('📊 Verificação de compatibilidade PDF:');
                Object.entries(checks).forEach(([key, value]) => {
                    console.log(`   ${value ? '✅' : '❌'} ${key}: ${value}`);
                });
                
                console.groupEnd();
                return checks;
            };
            created.push('runPdfCompatibilityCheck');
        }
        
        console.log(`\n📊 FUNÇÕES CRIADAS/REPARADAS: ${created.length}`);
        log.groupEnd();
        return created;
    }

    // ========== DIAGNÓSTICO COMPLETO ==========
    window.diagnoseExistingFunctions = function() {
        log.group('VERIFICAÇÃO COMPLETA DE FUNÇÕES');
        
        const results = {
            legitimate_present: [],
            legitimate_missing: [],
            placeholders_found: [],
            functions_created: [],
            warnings: [],
            timestamp: new Date().toISOString(),
            version: SAFETY.VERSION
        };

        // 1. VERIFICAR FUNÇÕES LEGÍTIMAS
        console.log('\n📌 FUNÇÕES LEGÍTIMAS:');
        SAFETY.LEGITIMATE_FUNCTIONS.forEach(funcName => {
            try {
                let exists = false;
                if (funcName.includes('.')) {
                    const parts = funcName.split('.');
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
                    exists = funcName in window;
                }
                
                if (exists) {
                    results.legitimate_present.push(funcName);
                    console.log(`   ✅ ${funcName} - PRESENTE`);
                } else {
                    results.legitimate_missing.push(funcName);
                    log.warn(`❌ ${funcName} - AUSENTE`);
                }
            } catch (error) {
                results.warnings.push(`${funcName}: ${error.message}`);
            }
        });

        // 2. CRIAR FUNÇÕES AUSENTES
        const created = createMissingLegitimateFunctions();
        results.functions_created = created;

        // 3. VERIFICAR PLACEHOLDERS
        console.log('\n📌 PLACEHOLDERS:');
        SAFETY.PLACEHOLDERS_TO_REMOVE.forEach(funcName => {
            try {
                const exists = funcName in window;
                if (exists) {
                    results.placeholders_found.push(funcName);
                    console.log(`   ⚠️ ${funcName} - ENCONTRADO`);
                } else {
                    console.log(`   ✅ ${funcName} - já removido`);
                }
            } catch (error) {
                results.warnings.push(`${funcName}: ${error.message}`);
            }
        });

        console.log('\n📊 RESUMO:');
        console.log(`   ✅ Funções presentes: ${results.legitimate_present.length}/${SAFETY.LEGITIMATE_FUNCTIONS.length}`);
        console.log(`   🔧 Funções criadas/reparadas: ${results.functions_created.length}`);
        console.log(`   🗑️ Placeholders encontrados: ${results.placeholders_found.length}`);
        
        log.groupEnd();
        return results;
    };

    // ========== CORREÇÃO AUTOMÁTICA ==========
    window.autoFixMissingFunctions = function() {
        log.group('CORREÇÃO AUTOMÁTICA');
        
        const fixes = [];
        
        // 1. REPARAR PDFLOGGER
        const pdfLoggerFixes = repairPdfLogger();
        fixes.push(...pdfLoggerFixes);
        
        // 2. CRIAR DEMAIS FUNÇÕES
        const newFunctions = createMissingLegitimateFunctions();
        fixes.push(...newFunctions);
        
        // 3. REMOVER PLACEHOLDERS
        console.log('\n🗑️ REMOVENDO PLACEHOLDERS:');
        SAFETY.PLACEHOLDERS_TO_REMOVE.forEach(funcName => {
            if (funcName in window) {
                delete window[funcName];
                fixes.push(`Removido: ${funcName}`);
                console.log(`   ✅ Removido: ${funcName}`);
            }
        });

        console.log(`\n📊 TOTAL DE CORREÇÕES: ${fixes.length}`);
        log.groupEnd();
        
        return { 
            fixes, 
            timestamp: new Date().toISOString(), 
            version: SAFETY.VERSION 
        };
    };

    // ========== DETECÇÃO DE REFERÊNCIAS ==========
    window.detectAndRemoveBrokenReferences = function() {
        log.group('DETECÇÃO DE REFERÊNCIAS');
        
        const removed = [];
        
        SAFETY.PLACEHOLDERS_TO_REMOVE.forEach(ref => {
            if (ref in window) {
                delete window[ref];
                removed.push(ref);
                console.log(`   🗑️ Removido: ${ref}`);
            }
        });

        console.log(`\n📊 REMOVIDOS: ${removed.length}`);
        log.groupEnd();
        
        return { removed, version: SAFETY.VERSION };
    };

    // ========== PAINEL DE CONTROLE ==========
    window.showCompatibilityControlPanel = function() {
        log.group('CRIANDO PAINEL DE CONTROLE');
        
        const panelId = 'compatibility-panel-v5-6-5';
        let panel = document.getElementById(panelId);
        if (panel) panel.remove();

        // Verificar status do PdfLogger
        const pdfLoggerMethods = {
            logPdfAccess: typeof window.PdfLogger?.logPdfAccess === 'function',
            logPdfError: typeof window.PdfLogger?.logPdfError === 'function',
            logPdfSuccess: typeof window.PdfLogger?.logPdfSuccess === 'function',
            getStats: typeof window.PdfLogger?.getStats === 'function'
        };
        
        const pdfLoggerStatus = Object.values(pdfLoggerMethods).every(Boolean) ? '✅ COMPLETO' : '⚠️ PARCIAL';
        const pdfLoggerColor = Object.values(pdfLoggerMethods).every(Boolean) ? '#00ff9c' : '#ffaa00';

        panel = document.createElement('div');
        panel.id = panelId;
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 440px;
            background: linear-gradient(135deg, #1a2a3a, #0a1a2a);
            color: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7);
            border: 2px solid #00aaff;
            z-index: 999999;
            font-family: 'Segoe UI', monospace;
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #00aaff; font-size: 16px;">
                    🔧 DIAGNÓSTICO v5.6.5
                </h3>
                <span style="background: #005500; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                    PDFLOGGER REPARADO
                </span>
            </div>
            
            <div style="background: #2a3a4a; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid ${pdfLoggerColor};">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #aaddff; font-weight: bold;">📄 PdfLogger:</span>
                    <span style="color: ${pdfLoggerColor}; font-weight: bold;">${pdfLoggerStatus}</span>
                </div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 5px; font-size: 11px;">
                    <span style="color: ${pdfLoggerMethods.logPdfAccess ? '#00ff9c' : '#ff5555'}">logPdfAccess: ${pdfLoggerMethods.logPdfAccess ? '✅' : '❌'}</span>
                    <span style="color: ${pdfLoggerMethods.logPdfError ? '#00ff9c' : '#ff5555'}">logPdfError: ${pdfLoggerMethods.logPdfError ? '✅' : '❌'}</span>
                    <span style="color: ${pdfLoggerMethods.logPdfSuccess ? '#00ff9c' : '#ff5555'}">logPdfSuccess: ${pdfLoggerMethods.logPdfSuccess ? '✅' : '❌'}</span>
                    <span style="color: ${pdfLoggerMethods.getStats ? '#00ff9c' : '#ff5555'}">getStats: ${pdfLoggerMethods.getStats ? '✅' : '❌'}</span>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <button id="btn-diagnose" style="padding: 12px; background: #00aaff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    🔍 DIAGNOSTICAR
                </button>
                <button id="btn-fix" style="padding: 12px; background: #ffaa00; color: black; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    🛠️ REPARAR PDFLOGGER
                </button>
                <button id="btn-test-pdf" style="padding: 12px; background: #9933cc; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    📄 TESTAR PDF
                </button>
                <button id="btn-stats" style="padding: 12px; background: #2a5a2a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    📊 ESTATÍSTICAS
                </button>
            </div>

            <div style="font-size: 11px; color: #88aaff; border-top: 1px solid #2a3a4a; padding-top: 15px;">
                <button onclick="this.parentElement.parentElement.remove()" style="
                    width: 100%;
                    margin-top: 10px;
                    padding: 8px;
                    background: #4a5a6a;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                ">
                    FECHAR PAINEL
                </button>
            </div>
        `;

        document.body.appendChild(panel);

        document.getElementById('btn-diagnose')?.addEventListener('click', () => window.diagnoseExistingFunctions?.());
        document.getElementById('btn-fix')?.addEventListener('click', () => {
            const result = window.autoFixMissingFunctions?.();
            setTimeout(() => {
                panel.remove();
                window.showCompatibilityControlPanel();
            }, 1500);
        });
        document.getElementById('btn-test-pdf')?.addEventListener('click', () => window.interactivePdfTest?.());
        document.getElementById('btn-stats')?.addEventListener('click', () => window.PdfLogger?.getStats?.());

        log.groupEnd();
        return panel;
    };

    // ========== INICIALIZAÇÃO SEGURA ==========
    window.safeInitDiagnostics = function() {
        log.group('INICIALIZAÇÃO SEGURA v5.6.5');
        
        try {
            // 1. REPARAR PDFLOGGER IMEDIATAMENTE
            const pdfLoggerFixes = repairPdfLogger();
            
            // 2. CRIAR DEMAIS FUNÇÕES
            const created = createMissingLegitimateFunctions();
            
            // 3. REMOVER PLACEHOLDERS
            SAFETY.PLACEHOLDERS_TO_REMOVE.forEach(funcName => {
                if (funcName in window) delete window[funcName];
            });
            
            // 4. DIAGNÓSTICO
            const diagnosis = window.diagnoseExistingFunctions?.();
            
            // 5. MOSTRAR PAINEL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('debug') === 'true') {
                setTimeout(() => window.showCompatibilityControlPanel?.(), 1000);
            }
            
            console.log(`\n✅ INICIALIZAÇÃO CONCLUÍDA - Reparos: ${pdfLoggerFixes.length}, Novas funções: ${created.length}`);
            
        } catch (error) {
            log.error('Erro na inicialização: ' + error.message);
        }
        
        log.groupEnd();
        return { success: true, version: SAFETY.VERSION };
    };

    // ========== INICIALIZAÇÃO AUTOMÁTICA ==========
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ ${SAFETY.MODULE_NAME} - VERSÃO ${SAFETY.VERSION}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📋 COMANDOS DISPONÍVEIS:`);
    console.log(`   🔍 window.diagnoseExistingFunctions()`);
    console.log(`   🛠️ window.autoFixMissingFunctions()`);
    console.log(`   🔗 window.detectAndRemoveBrokenReferences()`);
    console.log(`   🎛️ window.showCompatibilityControlPanel()`);
    console.log(`   🚀 window.safeInitDiagnostics()`);
    console.log(`   📄 window.PdfLogger.getStats()`);
    console.log(`${'='.repeat(60)}`);

    // Auto-inicialização
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
        setTimeout(window.safeInitDiagnostics, 500);
    }

})();
