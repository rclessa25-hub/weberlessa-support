// ================== debug/diagnostics/diagnostics56.js ==================
// SISTEMA DE DIAGNÓSTICO E COMPATIBILIDADE - VERSÃO 5.6.3 (CORREÇÃO DE REGRESSÃO)
// CORREÇÃO CRÍTICA: PdfLogger NUNCA pode ser removido - é função legítima do Support System
// =========================================================================

(function() {
    'use strict';
    
    // ========== CONSTANTES DE SEGURANÇA ==========
    const SAFETY = {
        // 🚨🚨🚨 LISTA DE FUNÇÕES LEGÍTIMAS QUE NUNCA PODEM SER REMOVIDAS 🚨🚨🚨
        // PdfLogger é uma função REAL do Support System (debug/pdf-logger.js)
        // verifyMediaMigration, testModuleCompatibility, etc são funções REAIS de diagnóstico
        PROTECTED_FUNCTIONS: [
            // Support System - Funções legítimas de diagnóstico (NUNCA remover)
            'PdfLogger',
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
            
            // Core System - Funções essenciais (NUNCA remover)
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
        
        // ÚNICAS funções que podem ser removidas (placeholders CRIADOS por versões antigas)
        ALLOWED_REMOVAL: [
            'ValidationSystem',           // Placeholder antigo, nunca foi função real
            'EmergencySystem',            // Placeholder antigo, nunca foi função real
            'monitorPdfPostCorrection',   // Placeholder criado em versão 5.6, remover
            'verifyRollbackCompatibility', // Placeholder criado em versão 5.6, remover
            'finalPdfSystemValidation'    // Placeholder criado em versão 5.6, remover
        ],
        
        VERSION: '5.6.3',
        MODULE_NAME: 'DIAG56-CRITICAL-FIX'
    };

    // ========== UTILITÁRIOS DE LOG ==========
    const log = {
        info: (msg) => console.log(`✅ ${SAFETY.MODULE_NAME} - ${msg}`),
        warn: (msg) => console.warn(`⚠️ ${SAFETY.MODULE_NAME} - ${msg}`),
        error: (msg) => console.error(`❌ ${SAFETY.MODULE_NAME} - ${msg}`),
        critical: (msg) => console.error(`🚨🚨🚨 ${SAFETY.MODULE_NAME} - ${msg} 🚨🚨🚨`),
        group: (msg) => console.group(`🔍 ${SAFETY.MODULE_NAME} - ${msg}`),
        groupEnd: () => console.groupEnd()
    };

    // ========== DIAGNÓSTICO COMPLETO (MODO SEGURO) ==========
    window.diagnoseExistingFunctions = function() {
        log.group('VERIFICAÇÃO COMPLETA DE FUNÇÕES');
        
        const results = {
            protected_found: [],
            protected_missing: [],
            placeholders_found: [],
            warnings: [],
            timestamp: new Date().toISOString(),
            version: SAFETY.VERSION
        };

        // 1. Verificar funções PROTEGIDAS (NUNCA remover)
        console.log('\n📌 FUNÇÕES PROTEGIDAS (NUNCA REMOVER):');
        SAFETY.PROTECTED_FUNCTIONS.forEach(funcName => {
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
                    results.protected_found.push(funcName);
                    console.log(`   ✅ ${funcName} - PRESENTE (protegido)`);
                } else {
                    results.protected_missing.push(funcName);
                    log.warn(`❌ ${funcName} - AUSENTE (deveria existir!)`);
                }
            } catch (error) {
                results.warnings.push(`${funcName}: ${error.message}`);
            }
        });

        // 2. Verificar placeholders (podem ser removidos)
        console.log('\n📌 PLACEHOLDERS (podem ser removidos):');
        SAFETY.ALLOWED_REMOVAL.forEach(funcName => {
            try {
                const exists = funcName in window;
                if (exists) {
                    results.placeholders_found.push(funcName);
                    console.log(`   ⚠️ ${funcName} - ENCONTRADO (pode remover)`);
                } else {
                    console.log(`   ✅ ${funcName} - já removido`);
                }
            } catch (error) {
                results.warnings.push(`${funcName}: ${error.message}`);
            }
        });

        // 3. Verificação ESPECÍFICA do PdfLogger (CRÍTICO)
        console.log('\n🚨 VERIFICAÇÃO CRÍTICA - PdfLogger:');
        if ('PdfLogger' in window) {
            console.log(`   ✅ PdfLogger - PRESENTE E PROTEGIDO`);
            console.log(`      Tipo: ${typeof window.PdfLogger}`);
            console.log(`      Funções disponíveis:`, 
                Object.getOwnPropertyNames(window.PdfLogger).filter(p => typeof window.PdfLogger[p] === 'function'));
        } else {
            log.critical('PdfLogger NÃO ENCONTRADO! Verifique debug/pdf-logger.js');
        }

        console.log('\n📊 RESUMO:');
        console.log(`   ✅ Funções protegidas presentes: ${results.protected_found.length}/${SAFETY.PROTECTED_FUNCTIONS.length}`);
        console.log(`   ⚠️ Funções protegidas ausentes: ${results.protected_missing.length}`);
        console.log(`   🗑️ Placeholders encontrados: ${results.placeholders_found.length}`);
        console.log(`   ⚠️ Avisos: ${results.warnings.length}`);
        
        log.groupEnd();
        return results;
    };

    // ========== CORREÇÃO CONTROLADA (APENAS PLACEHOLDERS REAIS) ==========
    window.autoFixMissingFunctions = function() {
        log.group('CORREÇÃO CONTROLADA - APENAS PLACEHOLDERS');
        
        const fixes = [];
        const protectedSkipped = [];
        const errors = [];

        // 🚨 PASSO 1: NUNCA REMOVER FUNÇÕES PROTEGIDAS
        console.log('\n🔒 VERIFICANDO FUNÇÕES PROTEGIDAS (NENHUMA SERÁ REMOVIDA):');
        SAFETY.PROTECTED_FUNCTIONS.forEach(funcName => {
            const simpleName = funcName.split('.')[0];
            if (simpleName in window) {
                protectedSkipped.push(funcName);
                console.log(`   🔒 PROTEGIDO: ${funcName} - NÃO REMOVIDO`);
            }
        });

        // 🗑️ PASSO 2: REMOVER APENAS PLACEHOLDERS PERMITIDOS
        console.log('\n🗑️ REMOVENDO PLACEHOLDERS:');
        SAFETY.ALLOWED_REMOVAL.forEach(funcName => {
            try {
                if (funcName in window) {
                    // DUPLA VERIFICAÇÃO: NÃO é função protegida
                    const isProtected = SAFETY.PROTECTED_FUNCTIONS.some(p => 
                        p === funcName || p.split('.')[0] === funcName
                    );
                    
                    if (!isProtected) {
                        delete window[funcName];
                        fixes.push(funcName);
                        console.log(`   ✅ Removido: ${funcName}`);
                    } else {
                        console.log(`   🔒 PROTEGIDO (não removido): ${funcName}`);
                    }
                } else {
                    console.log(`   ℹ️ Já removido: ${funcName}`);
                }
            } catch (e) {
                errors.push(`${funcName}: ${e.message}`);
            }
        });

        // ✅ PASSO 3: VERIFICAR SE PdfLogger AINDA EXISTE
        console.log('\n🔍 VERIFICAÇÃO PÓS-REMOÇÃO:');
        if ('PdfLogger' in window) {
            console.log(`   ✅ PdfLogger - PRESERVADO com sucesso`);
        } else {
            log.critical('PdfLogger FOI REMOVIDO! Tentando restaurar...');
            // Tentar recarregar o módulo PdfLogger
            const script = document.createElement('script');
            script.src = 'https://rclessa25-hub.github.io/weberlessa-support/debug/pdf-logger.js';
            script.onload = () => console.log('   ✅ PdfLogger restaurado com sucesso');
            document.head.appendChild(script);
            fixes.push('PdfLogger (restaurado)');
        }

        console.log(`\n📊 RESULTADO:`);
        console.log(`   ✅ Placeholders removidos: ${fixes.length}`);
        console.log(`   🔒 Funções protegidas mantidas: ${protectedSkipped.length}`);
        console.log(`   ❌ Erros: ${errors.length}`);
        
        log.groupEnd();
        return { 
            fixes, 
            protected: protectedSkipped, 
            errors, 
            timestamp: new Date().toISOString(), 
            version: SAFETY.VERSION 
        };
    };

    // ========== DETECÇÃO PRECISA (SEM DANOS COLATERAIS) ==========
    window.detectAndRemoveBrokenReferences = function() {
        log.group('DETECÇÃO PRECISA DE REFERÊNCIAS');
        
        const removed = [];
        const protectedPreserved = [];
        const notFound = [];

        // APENAS processar a lista EXPLÍCITA de placeholders
        SAFETY.ALLOWED_REMOVAL.forEach(ref => {
            try {
                if (ref in window) {
                    // VERIFICAÇÃO RÍGIDA: não é função protegida
                    const isProtected = SAFETY.PROTECTED_FUNCTIONS.some(p => 
                        p === ref || p.split('.')[0] === ref
                    );
                    
                    if (!isProtected) {
                        delete window[ref];
                        removed.push(ref);
                        console.log(`   🗑️ Removido: ${ref}`);
                    } else {
                        protectedPreserved.push(ref);
                        console.log(`   🔒 PRESERVADO (protegido): ${ref}`);
                    }
                } else {
                    notFound.push(ref);
                    console.log(`   ℹ️ Não encontrado: ${ref}`);
                }
            } catch (e) {
                console.error(`   ❌ Erro ao processar ${ref}:`, e.message);
            }
        });

        // VERIFICAÇÃO FINAL DE SEGURANÇA
        console.log('\n🔍 VERIFICAÇÃO DE SEGURANÇA:');
        const pdfLoggerStillExists = 'PdfLogger' in window;
        console.log(`   ${pdfLoggerStillExists ? '✅' : '❌'} PdfLogger: ${pdfLoggerStillExists ? 'PRESERVADO' : 'REMOVIDO - CRÍTICO!'}`);
        
        const verifyMediaStillExists = 'verifyMediaMigration' in window;
        console.log(`   ${verifyMediaStillExists ? '✅' : '❌'} verifyMediaMigration: ${verifyMediaStillExists ? 'PRESERVADO' : 'REMOVIDO - CRÍTICO!'}`);

        console.log(`\n📊 RESUMO:`);
        console.log(`   🗑️ Removidos: ${removed.length}`);
        console.log(`   🔒 Preservados: ${protectedPreserved.length}`);
        console.log(`   ℹ️ Não encontrados: ${notFound.length}`);
        
        log.groupEnd();
        return { 
            removed, 
            preserved: protectedPreserved, 
            notFound,
            version: SAFETY.VERSION 
        };
    };

    // ========== PAINEL DE CONTROLE COM ALERTA VISUAL ==========
    window.showCompatibilityControlPanel = function() {
        log.group('CRIANDO PAINEL DE CONTROLE v5.6.3');
        
        const panelId = 'compatibility-panel-v5-6-3';
        let panel = document.getElementById(panelId);
        
        if (panel) panel.remove();

        // Verificar status do PdfLogger (CRÍTICO)
        const pdfLoggerStatus = 'PdfLogger' in window ? '✅ ATIVO' : '❌ AUSENTE (CRÍTICO)';
        const pdfLoggerColor = 'PdfLogger' in window ? '#00ff9c' : '#ff5555';

        panel = document.createElement('div');
        panel.id = panelId;
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 400px;
            background: linear-gradient(135deg, #1a1a2a, #0a0a1a);
            color: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.7);
            border: 2px solid #00aaff;
            z-index: 999999;
            font-family: 'Segoe UI', monospace;
            backdrop-filter: blur(5px);
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #00aaff; font-size: 16px;">
                    🔧 DIAGNÓSTICO v5.6.3
                </h3>
                <span style="background: #ff0000; color: white; padding: 4px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">
                    CORREÇÃO CRÍTICA
                </span>
            </div>
            
            <div style="background: #2a2a3a; border-radius: 8px; padding: 15px; margin-bottom: 15px; border-left: 4px solid ${pdfLoggerColor};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: #aaddff; font-weight: bold;">📄 PdfLogger:</span>
                    <span style="color: ${pdfLoggerColor}; font-weight: bold;">${pdfLoggerStatus}</span>
                </div>
                <div style="font-size: 12px; color: #ffaa00; background: #332200; padding: 8px; border-radius: 4px;">
                    ⚠️ PdfLogger é uma função LEGÍTIMA do Support System e NUNCA será removida
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <button id="btn-diagnose" style="
                    padding: 12px;
                    background: #00aaff;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    🔍 DIAGNOSTICAR
                </button>
                <button id="btn-clean" style="
                    padding: 12px;
                    background: #ffaa00;
                    color: black;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    🧹 REMOVER PLACEHOLDERS
                </button>
                <button id="btn-verify-pdf" style="
                    padding: 12px;
                    background: #9933cc;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    📄 TESTAR PdfLogger
                </button>
                <button id="btn-protected" style="
                    padding: 12px;
                    background: #2a5a2a;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                ">
                    🔒 LISTA PROTEGIDOS
                </button>
            </div>

            <div style="font-size: 11px; color: #88aaff; border-top: 1px solid #2a3a4a; padding-top: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span>✅ Funções protegidas:</span>
                    <span style="color: #00ff9c;">${SAFETY.PROTECTED_FUNCTIONS.length}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span>🗑️ Placeholders removíveis:</span>
                    <span style="color: #ffaa00;">${SAFETY.ALLOWED_REMOVAL.length}</span>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    width: 100%;
                    margin-top: 10px;
                    padding: 8px;
                    background: #4a5a6a;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 11px;
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

        document.getElementById('btn-clean')?.addEventListener('click', () => {
            const result = window.autoFixMissingFunctions?.();
            if (result?.fixes?.length > 0) {
                setTimeout(() => {
                    panel.remove();
                    window.showCompatibilityControlPanel();
                }, 1500);
            }
        });

        document.getElementById('btn-verify-pdf')?.addEventListener('click', () => {
            if (window.PdfLogger) {
                console.group('📄 TESTE DO PdfLogger');
                console.log('✅ PdfLogger está disponível!');
                console.log('📋 Funções disponíveis:', Object.keys(window.PdfLogger));
                if (typeof window.PdfLogger.logPdfAccess === 'function') {
                    window.PdfLogger.logPdfAccess('teste', 'função funcionando');
                }
                console.groupEnd();
                alert('✅ PdfLogger está funcionando corretamente! Verifique o console.');
            } else {
                alert('❌ PdfLogger NÃO está disponível! Recarregue a página.');
            }
        });

        document.getElementById('btn-protected')?.addEventListener('click', () => {
            console.group('🔒 FUNÇÕES PROTEGIDAS (NUNCA REMOVER)');
            SAFETY.PROTECTED_FUNCTIONS.forEach(f => console.log(`   ✅ ${f}`));
            console.groupEnd();
        });

        log.info('Painel de controle criado com proteções');
        log.groupEnd();
        return panel;
    };

    // ========== INICIALIZAÇÃO SEGURA (SEM DANOS) ==========
    window.safeInitDiagnostics = function() {
        log.group('INICIALIZAÇÃO SEGURA v5.6.3');
        
        try {
            // PASSO 1: VERIFICAR INTEGRIDADE DO PdfLogger
            if (!('PdfLogger' in window)) {
                log.critical('PdfLogger não encontrado! Tentando carregar...');
                const script = document.createElement('script');
                script.src = 'https://rclessa25-hub.github.io/weberlessa-support/debug/pdf-logger.js';
                document.head.appendChild(script);
            }

            // PASSO 2: DIAGNÓSTICO APENAS LEITURA
            const diagnosis = window.diagnoseExistingFunctions?.();
            
            // PASSO 3: MOSTRAR PAINEL SE EM MODO DEBUG
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('debug') === 'true') {
                setTimeout(() => window.showCompatibilityControlPanel?.(), 1000);
            }
            
            // PASSO 4: ALERTA CRÍTICO SE PdfLogger AINDA AUSENTE
            setTimeout(() => {
                if (!('PdfLogger' in window)) {
                    log.critical('PdfLogger permanece ausente! Verifique a conexão com Support System.');
                }
            }, 2000);
            
        } catch (error) {
            log.error('Erro na inicialização: ' + error.message);
        }
        
        log.groupEnd();
        return { success: true, version: SAFETY.VERSION };
    };

    // ========== INICIALIZAÇÃO AUTOMÁTICA CONTROLADA ==========
    const urlParams = new URLSearchParams(window.location.search);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ ${SAFETY.MODULE_NAME} - VERSÃO ${SAFETY.VERSION}`);
    console.log(`${'='.repeat(60)}`);
    console.log(`📋 COMANDOS DISPONÍVEIS:`);
    console.log(`   🔍 window.diagnoseExistingFunctions()`);
    console.log(`   🧹 window.autoFixMissingFunctions()`);
    console.log(`   🔗 window.detectAndRemoveBrokenReferences()`);
    console.log(`   🎛️ window.showCompatibilityControlPanel()`);
    console.log(`   🚀 window.safeInitDiagnostics()`);
    console.log(`${'='.repeat(60)}`);
    console.log(`🔒 FUNÇÕES PROTEGIDAS (NUNCA REMOVER): ${SAFETY.PROTECTED_FUNCTIONS.length}`);
    console.log(`   - PdfLogger, verifyMediaMigration, testModuleCompatibility...`);
    console.log(`🗑️ PLACEHOLDERS REMOVÍVEIS: ${SAFETY.ALLOWED_REMOVAL.length}`);
    console.log(`   - ValidationSystem, EmergencySystem, monitorPdfPostCorrection...`);
    console.log(`${'='.repeat(60)}\n`);

    // Auto-inicialização APENAS em modo debug explícito
    if (urlParams.get('debug') === 'true' && urlParams.get('diagnostics') === 'true') {
        setTimeout(window.safeInitDiagnostics, 800);
    }

})();
