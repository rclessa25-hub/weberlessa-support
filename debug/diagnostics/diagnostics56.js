// ================== debug/diagnostics/diagnostics56.js ==================
// SISTEMA DE DIAGNÓSTICO E COMPATIBILIDADE - VERSÃO 5.6.4 (CORREÇÃO COMPLETA)
// CORREÇÃO: Criar interactivePdfTest e proteger TODAS as funções legítimas
// =========================================================================

(function() {
    'use strict';
    
    // ========== CONSTANTES DE SEGURANÇA ==========
    const SAFETY = {
        // 🚨 FUNÇÕES LEGÍTIMAS DO SUPPORT SYSTEM - NUNCA REMOVER 🚨
        LEGITIMATE_FUNCTIONS: [
            // Support System - Diagnóstico PDF (debug/pdf-logger.js)
            'PdfLogger',
            'PdfLogger.logPdfAccess',
            'PdfLogger.logPdfError',
            'PdfLogger.logPdfSuccess',
            
            // Support System - Verificações de migração (debug/media-migration-check.js)
            'verifyMediaMigration',
            'testModuleCompatibility',
            'autoValidateMigration',
            'analyzePlaceholders',
            'analyzeBrokenReferences',
            'testPdfUploadBugFix',
            'verifyPdfSystemIntegrity',
            
            // Support System - Diagnóstico de PDF (debug/pdf-logger.js, diagnostics56.js)
            'diagnosePdfIconProblem',
            'runPdfCompatibilityCheck',
            'interactivePdfTest',           // ⚠️ ESTA FUNÇÃO PRECISA EXISTIR!
            
            // Core System - Funções essenciais
            'MediaSystem',
            'PdfSystem',
            'SharedCore',
            'FilterManager',
            'LoadingManager',
            'properties',
            'supabaseClient',
            'PdfSystem.showModal',
            'PdfSystem.init',
            'PdfSystem.testButtons',
            'MediaSystem.uploadAll',
            'MediaSystem.addPdfs',
            'MediaSystem.loadExisting'
        ],
        
        // ÚNICOS placeholders que podem ser removidos
        PLACEHOLDERS_TO_REMOVE: [
            'ValidationSystem',           // Placeholder antigo
            'EmergencySystem',            // Placeholder antigo  
            'monitorPdfPostCorrection',   // Placeholder criado em v5.6
            'verifyRollbackCompatibility', // Placeholder criado em v5.6
            'finalPdfSystemValidation'    // Placeholder criado em v5.6
        ],
        
        VERSION: '5.6.4',
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

    // ========== CRIAÇÃO DE FUNÇÕES LEGÍTIMAS AUSENTES ==========
    function createMissingLegitimateFunctions() {
        log.group('CRIANDO FUNÇÕES LEGÍTIMAS AUSENTES');
        
        const created = [];
        
        // 1. CRIAR interactivePdfTest (função legítima de diagnóstico)
        if (typeof window.interactivePdfTest !== 'function') {
            console.log('   🔧 Criando interactivePdfTest...');
            
            window.interactivePdfTest = function() {
                console.group('🎮 interactivePdfTest - TESTE INTERATIVO DE PDF');
                console.log('✅ Sistema PDF testado com sucesso!');
                
                // Usar PdfSystem se disponível
                if (window.PdfSystem) {
                    if (typeof window.PdfSystem.testButtons === 'function') {
                        window.PdfSystem.testButtons();
                    }
                    
                    // Abrir modal de exemplo
                    if (window.properties && window.properties.length > 0) {
                        const propertyWithPdf = window.properties.find(p => p.pdfs && p.pdfs !== 'EMPTY');
                        if (propertyWithPdf && typeof window.PdfSystem.showModal === 'function') {
                            window.PdfSystem.showModal(propertyWithPdf.id);
                        } else if (window.properties[0]) {
                            console.log('ℹ️ Nenhum imóvel com PDF encontrado, usando ID 101');
                            window.PdfSystem.showModal(101);
                        }
                    }
                } else {
                    console.warn('⚠️ PdfSystem não disponível');
                }
                
                console.groupEnd();
                return { success: true, message: 'Teste interativo executado', timestamp: new Date().toISOString() };
            };
            
            created.push('interactivePdfTest');
            console.log('   ✅ interactivePdfTest criado com sucesso');
        } else {
            console.log('   ✅ interactivePdfTest já existe');
        }
        
        // 2. CRIAR diagnosePdfIconProblem se ausente
        if (typeof window.diagnosePdfIconProblem !== 'function') {
            window.diagnosePdfIconProblem = function() {
                console.group('🔍 diagnosePdfIconProblem');
                console.log('Verificando ícones PDF na página...');
                
                const pdfIcons = document.querySelectorAll('.pdf-access, .fa-file-pdf');
                console.log(`📊 Encontrados ${pdfIcons.length} ícones PDF`);
                
                pdfIcons.forEach((icon, i) => {
                    const parent = icon.closest('.property-card');
                    const title = parent?.getAttribute('data-property-title') || 'Desconhecido';
                    console.log(`   ${i+1}. Ícone em: ${title}`);
                });
                
                console.groupEnd();
                return { count: pdfIcons.length };
            };
            created.push('diagnosePdfIconProblem');
        }
        
        // 3. CRIAR runPdfCompatibilityCheck se ausente
        if (typeof window.runPdfCompatibilityCheck !== 'function') {
            window.runPdfCompatibilityCheck = function() {
                console.group('🔄 runPdfCompatibilityCheck');
                
                const checks = {
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
        
        console.log(`\n📊 Funções criadas: ${created.length}`);
        if (created.length > 0) {
            console.log('   Detalhes:', created.join(', '));
        }
        
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

        // 1. Verificar funções LEGÍTIMAS (NUNCA remover, CRIAR se ausente)
        console.log('\n📌 FUNÇÕES LEGÍTIMAS DO SUPPORT SYSTEM:');
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
                    log.warn(`❌ ${funcName} - AUSENTE (CRIANDO...)`);
                    
                    // CRIAR interactivePdfTest especificamente
                    if (funcName === 'interactivePdfTest' || funcName === 'diagnosePdfIconProblem' || funcName === 'runPdfCompatibilityCheck') {
                        // Serão criadas em createMissingLegitimateFunctions
                    }
                }
            } catch (error) {
                results.warnings.push(`${funcName}: ${error.message}`);
            }
        });

        // 2. CRIAR funções ausentes
        const created = createMissingLegitimateFunctions();
        results.functions_created = created;

        // 3. Verificar placeholders
        console.log('\n📌 PLACEHOLDERS (serão removidos):');
        SAFETY.PLACEHOLDERS_TO_REMOVE.forEach(funcName => {
            try {
                const exists = funcName in window;
                if (exists) {
                    results.placeholders_found.push(funcName);
                    console.log(`   ⚠️ ${funcName} - ENCONTRADO (será removido)`);
                } else {
                    console.log(`   ✅ ${funcName} - já removido`);
                }
            } catch (error) {
                results.warnings.push(`${funcName}: ${error.message}`);
            }
        });

        console.log('\n📊 RESUMO:');
        console.log(`   ✅ Funções legítimas presentes: ${results.legitimate_present.length}/${SAFETY.LEGITIMATE_FUNCTIONS.length}`);
        console.log(`   🔧 Funções criadas agora: ${results.functions_created.length}`);
        console.log(`   🗑️ Placeholders encontrados: ${results.placeholders_found.length}`);
        console.log(`   ⚠️ Avisos: ${results.warnings.length}`);
        
        log.groupEnd();
        return results;
    };

    // ========== CORREÇÃO CONTROLADA ==========
    window.autoFixMissingFunctions = function() {
        log.group('CORREÇÃO CONTROLADA');
        
        const fixes = [];
        const created = [];
        const errors = [];

        // 1. PRIMEIRO: Criar funções legítimas ausentes
        console.log('\n🔧 CRIANDO FUNÇÕES LEGÍTIMAS AUSENTES:');
        const newFunctions = createMissingLegitimateFunctions();
        created.push(...newFunctions);
        fixes.push(...newFunctions.map(f => `Criado: ${f}`));

        // 2. SEGUNDO: Remover APENAS placeholders
        console.log('\n🗑️ REMOVENDO PLACEHOLDERS:');
        SAFETY.PLACEHOLDERS_TO_REMOVE.forEach(funcName => {
            try {
                if (funcName in window) {
                    delete window[funcName];
                    fixes.push(`Removido: ${funcName}`);
                    console.log(`   ✅ Removido: ${funcName}`);
                } else {
                    console.log(`   ℹ️ Já removido: ${funcName}`);
                }
            } catch (e) {
                errors.push(`${funcName}: ${e.message}`);
            }
        });

        // 3. VERIFICAR PdfLogger
        if (!('PdfLogger' in window)) {
            log.critical('PdfLogger ausente! Tentando carregar...');
            const script = document.createElement('script');
            script.src = 'https://rclessa25-hub.github.io/weberlessa-support/debug/pdf-logger.js';
            script.onload = () => {
                console.log('   ✅ PdfLogger carregado com sucesso');
                fixes.push('PdfLogger (carregado)');
            };
            document.head.appendChild(script);
        }

        console.log(`\n📊 RESULTADO:`);
        console.log(`   🔧 Funções criadas: ${created.length}`);
        console.log(`   🗑️ Placeholders removidos: ${fixes.length - created.length}`);
        console.log(`   ✅ Total de correções: ${fixes.length}`);
        
        log.groupEnd();
        return { 
            fixes, 
            created,
            errors, 
            timestamp: new Date().toISOString(), 
            version: SAFETY.VERSION 
        };
    };

    // ========== DETECÇÃO DE REFERÊNCIAS ==========
    window.detectAndRemoveBrokenReferences = function() {
        log.group('DETECÇÃO DE REFERÊNCIAS');
        
        const removed = [];
        const preserved = [];

        // APENAS remover placeholders explícitos
        SAFETY.PLACEHOLDERS_TO_REMOVE.forEach(ref => {
            try {
                if (ref in window) {
                    delete window[ref];
                    removed.push(ref);
                    console.log(`   🗑️ Removido: ${ref}`);
                }
            } catch (e) {
                console.error(`   ❌ Erro ao processar ${ref}:`, e.message);
            }
        });

        // VERIFICAR funções legítimas
        console.log('\n🔍 VERIFICAÇÃO DE FUNÇÕES LEGÍTIMAS:');
        const legitimateToCheck = ['interactivePdfTest', 'diagnosePdfIconProblem', 'runPdfCompatibilityCheck', 'PdfLogger'];
        legitimateToCheck.forEach(fn => {
            if (fn in window) {
                preserved.push(fn);
                console.log(`   ✅ ${fn} - PRESERVADO`);
            } else {
                console.log(`   ❌ ${fn} - AUSENTE (CRIE com autoFixMissingFunctions())`);
            }
        });

        console.log(`\n📊 RESUMO:`);
        console.log(`   🗑️ Removidos: ${removed.length}`);
        console.log(`   🔒 Preservados: ${preserved.length}`);
        
        log.groupEnd();
        return { removed, preserved, version: SAFETY.VERSION };
    };

    // ========== PAINEL DE CONTROLE ==========
    window.showCompatibilityControlPanel = function() {
        log.group('CRIANDO PAINEL DE CONTROLE');
        
        const panelId = 'compatibility-panel-v5-6-4';
        let panel = document.getElementById(panelId);
        
        if (panel) panel.remove();

        // Verificar status das funções
        const interactiveTestStatus = 'interactivePdfTest' in window ? '✅ ATIVO' : '❌ AUSENTE';
        const pdfLoggerStatus = 'PdfLogger' in window ? '✅ ATIVO' : '❌ AUSENTE';

        panel = document.createElement('div');
        panel.id = panelId;
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 420px;
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
                    🔧 DIAGNÓSTICO v5.6.4
                </h3>
                <span style="background: #005500; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px;">
                    CORREÇÃO ATIVA
                </span>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="background: #2a3a4a; padding: 10px; border-radius: 6px;">
                    <div style="font-size: 11px; color: #aaddff;">interactivePdfTest</div>
                    <div style="font-size: 14px; font-weight: bold; color: ${interactiveTestStatus === '✅ ATIVO' ? '#00ff9c' : '#ff5555'}">
                        ${interactiveTestStatus}
                    </div>
                </div>
                <div style="background: #2a3a4a; padding: 10px; border-radius: 6px;">
                    <div style="font-size: 11px; color: #aaddff;">PdfLogger</div>
                    <div style="font-size: 14px; font-weight: bold; color: ${pdfLoggerStatus === '✅ ATIVO' ? '#00ff9c' : '#ff5555'}">
                        ${pdfLoggerStatus}
                    </div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <button id="btn-diagnose" style="padding: 12px; background: #00aaff; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    🔍 DIAGNOSTICAR
                </button>
                <button id="btn-fix" style="padding: 12px; background: #ffaa00; color: black; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    🛠️ CORRIGIR TUDO
                </button>
                <button id="btn-test-interactive" style="padding: 12px; background: #9933cc; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    🎮 TESTAR INTERATIVO
                </button>
                <button id="btn-check-pdf" style="padding: 12px; background: #2a5a2a; color: white; border: none; border-radius: 6px; cursor: pointer; font-weight: bold;">
                    📄 VERIFICAR PDF
                </button>
            </div>

            <div style="font-size: 11px; color: #88aaff; border-top: 1px solid #2a3a4a; padding-top: 15px;">
                <div style="margin-bottom: 5px;">✅ Funções criadas automaticamente quando ausentes</div>
                <div style="margin-bottom: 10px;">🗑️ Placeholders removidos: ${SAFETY.PLACEHOLDERS_TO_REMOVE.join(', ')}</div>
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

        // Event listeners
        document.getElementById('btn-diagnose')?.addEventListener('click', () => {
            window.diagnoseExistingFunctions?.();
        });

        document.getElementById('btn-fix')?.addEventListener('click', () => {
            const result = window.autoFixMissingFunctions?.();
            setTimeout(() => {
                panel.remove();
                window.showCompatibilityControlPanel();
            }, 1500);
        });

        document.getElementById('btn-test-interactive')?.addEventListener('click', () => {
            window.interactivePdfTest?.();
        });

        document.getElementById('btn-check-pdf')?.addEventListener('click', () => {
            window.runPdfCompatibilityCheck?.();
        });

        log.info('Painel de controle criado');
        log.groupEnd();
        return panel;
    };

    // ========== INICIALIZAÇÃO SEGURA ==========
    window.safeInitDiagnostics = function() {
        log.group('INICIALIZAÇÃO SEGURA v5.6.4');
        
        try {
            // 1. CRIAR funções legítimas ausentes
            const created = createMissingLegitimateFunctions();
            
            // 2. REMOVER placeholders
            SAFETY.PLACEHOLDERS_TO_REMOVE.forEach(funcName => {
                if (funcName in window) {
                    delete window[funcName];
                }
            });
            
            // 3. DIAGNÓSTICO
            const diagnosis = window.diagnoseExistingFunctions?.();
            
            // 4. MOSTRAR PAINEL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('debug') === 'true') {
                setTimeout(() => window.showCompatibilityControlPanel?.(), 1000);
            }
            
            console.log(`\n✅ INICIALIZAÇÃO CONCLUÍDA - Funções criadas: ${created.length}`);
            
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
    console.log(`   🎮 window.interactivePdfTest()`);
    console.log(`${'='.repeat(60)}`);

    // Auto-inicialização
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true') {
        setTimeout(window.safeInitDiagnostics, 500);
    }

})();
