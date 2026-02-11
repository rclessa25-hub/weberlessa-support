// ================== debug/diagnostics/diagnostics56.js ==================
// SISTEMA DE DIAGNÓSTICO E COMPATIBILIDADE - VERSÃO 5.6.2 (CORREÇÃO CRÍTICA)
// PROIBIDO: Remover funções do Core System (PdfLogger, verifyMediaMigration, etc)
// PROIBIDO: Modificar window.properties ou window.MediaSystem
// PROIBIDO: Criar funções duplicadas já existentes no Core
// =========================================================================

(function() {
    'use strict';
    
    // ========== CONSTANTES DE SEGURANÇA ==========
    const SAFETY = {
        // Lista de funções do CORE que NUNCA podem ser removidas ou sobrescritas
        CORE_PROTECTED: [
            'PdfLogger',
            'verifyMediaMigration',
            'testModuleCompatibility',
            'autoValidateMigration',
            'analyzePlaceholders',
            'analyzeBrokenReferences',
            'testPdfUploadBugFix',
            'verifyPdfSystemIntegrity',
            'MediaSystem',
            'PdfSystem',
            'SharedCore',
            'FilterManager',
            'LoadingManager',
            'properties',
            'supabaseClient'
        ],
        
        // ÚNICAS funções que este módulo pode remover (placeholders próprios)
        ALLOWED_REMOVAL: [
            'ValidationSystem',
            'EmergencySystem', 
            'monitorPdfPostCorrection',
            'verifyRollbackCompatibility',
            'finalPdfSystemValidation'
        ],
        
        VERSION: '5.6.2',
        MODULE_NAME: 'DIAG56'
    };

    // ========== UTILITÁRIOS DE LOG ==========
    const log = {
        info: (msg) => console.log(`✅ ${SAFETY.MODULE_NAME} - ${msg}`),
        warn: (msg) => console.warn(`⚠️ ${SAFETY.MODULE_NAME} - ${msg}`),
        error: (msg) => console.error(`❌ ${SAFETY.MODULE_NAME} - ${msg}`),
        group: (msg) => console.group(`🔍 ${SAFETY.MODULE_NAME} - ${msg}`),
        groupEnd: () => console.groupEnd()
    };

    // ========== DIAGNÓSTICO NÃO INVASIVO ==========
    window.diagnoseExistingFunctions = function() {
        log.group('VERIFICAÇÃO DE FUNÇÕES (MODO SEGURO)');
        
        const results = {
            core: { present: [], missing: [] },
            support: { present: [], missing: [] },
            warnings: [],
            timestamp: new Date().toISOString(),
            version: SAFETY.VERSION
        };

        // APENAS verificar, NUNCA modificar
        const checkFunction = (name) => {
            try {
                let exists = false;
                if (name.includes('.')) {
                    const parts = name.split('.');
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
                    exists = name in window;
                }

                const category = SAFETY.CORE_PROTECTED.includes(name) ? 'core' : 'support';
                
                if (exists) {
                    results[category].present.push(name);
                    console.log(`   ✅ ${name} (${category})`);
                } else {
                    results[category].missing.push(name);
                    if (category === 'core') {
                        log.warn(`❌ FUNÇÃO CORE AUSENTE: ${name}`);
                    } else {
                        console.log(`   ℹ️ ${name} não encontrada (support)`);
                    }
                }
            } catch (error) {
                results.warnings.push(`${name}: ${error.message}`);
            }
        };

        // Verificar funções CORE (devem existir SEMPRE)
        log.info('Verificando funções CORE protegidas:');
        SAFETY.CORE_PROTECTED.forEach(checkFunction);

        // Verificar funções de suporte (opcionais)
        log.info('Verificando funções de SUPORTE:');
        const supportFunctions = [
            'diagnoseExistingFunctions',
            'autoFixMissingFunctions',
            'detectAndRemoveBrokenReferences',
            'showCompatibilityControlPanel',
            'safeInitDiagnostics'
        ];
        supportFunctions.forEach(checkFunction);

        console.log('\n📊 RESUMO:');
        console.log(`   Core functions: ${results.core.present.length}/${SAFETY.CORE_PROTECTED.length} presente`);
        console.log(`   Support functions: ${results.support.present.length}/${supportFunctions.length} presente`);
        console.log(`   ⚠️  Warnings: ${results.warnings.length}`);
        
        log.groupEnd();
        return results;
    };

    // ========== CORREÇÃO APENAS DE PLACEHOLDERS ==========
    window.autoFixMissingFunctions = function() {
        log.group('CORREÇÃO AUTOMÁTICA (APENAS PLACEHOLDERS)');
        
        const fixes = [];
        const errors = [];

        // 1. REMOVER APENAS placeholders permitidos
        SAFETY.ALLOWED_REMOVAL.forEach(funcName => {
            try {
                if (funcName in window) {
                    const type = typeof window[funcName];
                    // Só remover se for função placeholder (não Core)
                    if (type === 'function' && !SAFETY.CORE_PROTECTED.includes(funcName)) {
                        delete window[funcName];
                        fixes.push(`Removido: ${funcName}`);
                        console.log(`   🗑️ Placeholder removido: ${funcName}`);
                    } else if (type !== 'function') {
                        delete window[funcName];
                        fixes.push(`Removido (não função): ${funcName}`);
                        console.log(`   🗑️ Propriedade não função removida: ${funcName}`);
                    }
                }
            } catch (e) {
                errors.push(`${funcName}: ${e.message}`);
            }
        });

        // 2. NUNCA criar funções que já existem no Core
        //    Apenas garantir que a delegação existe se a Core falhar
        if (typeof window.showPdfModal !== 'function' && 
            !('showPdfModal' in SAFETY.CORE_PROTECTED)) {
            
            window.showPdfModal = function(propertyId) {
                // DELEGAR para PdfSystem (NUNCA implementar lógica própria)
                if (window.PdfSystem?.showModal) {
                    return window.PdfSystem.showModal(propertyId);
                }
                log.warn('PdfSystem.showModal não disponível');
                return false;
            };
            fixes.push('showPdfModal (delegação)');
            console.log('   ✅ showPdfModal criada como delegação');
        }

        console.log(`\n📊 CORREÇÕES: ${fixes.length} aplicada(s)`);
        if (fixes.length > 0) {
            console.log('   Detalhes:', fixes.join(', '));
        }
        
        log.groupEnd();
        return { fixes, errors, timestamp: new Date().toISOString(), version: SAFETY.VERSION };
    };

    // ========== DETECÇÃO SEGURA (SEM REMOÇÃO DE CORE) ==========
    window.detectAndRemoveBrokenReferences = function() {
        log.group('DETECÇÃO DE REFERÊNCIAS QUEBRADAS (MODO SEGURO)');
        
        const removed = [];
        const protectedSkipped = [];

        // APENAS remover placeholders da ALLOWED_REMOVAL
        SAFETY.ALLOWED_REMOVAL.forEach(ref => {
            try {
                if (ref in window) {
                    // Verificar se NÃO é função Core protegida
                    if (!SAFETY.CORE_PROTECTED.includes(ref)) {
                        delete window[ref];
                        removed.push(ref);
                        console.log(`   🗑️ Removido: ${ref}`);
                    } else {
                        protectedSkipped.push(ref);
                        console.log(`   🔒 Protegido (CORE): ${ref} - NÃO removido`);
                    }
                }
            } catch (e) {
                console.error(`   ❌ Erro ao verificar ${ref}:`, e.message);
            }
        });

        console.log(`\n📊 RESULTADO:`);
        console.log(`   ✅ Removidos: ${removed.length}`);
        console.log(`   🔒 Protegidos (mantidos): ${protectedSkipped.length}`);
        
        log.groupEnd();
        return { removed, protected: protectedSkipped, version: SAFETY.VERSION };
    };

    // ========== PAINEL DE CONTROLE NÃO INVASIVO ==========
    window.showCompatibilityControlPanel = function() {
        log.group('CRIANDO PAINEL DE CONTROLE');
        
        const panelId = 'compatibility-panel-v5-6-2';
        let panel = document.getElementById(panelId);
        
        if (panel) {
            panel.remove();
        }

        panel = document.createElement('div');
        panel.id = panelId;
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 360px;
            background: linear-gradient(135deg, #1a2a3a, #0a1a2a);
            color: #fff;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 2px solid #00aaff;
            z-index: 999999;
            font-family: 'Segoe UI', monospace;
            backdrop-filter: blur(5px);
        `;

        // Coletar status sem modificar nada
        const corePresent = SAFETY.CORE_PROTECTED.filter(f => f in window).length;
        const coreTotal = SAFETY.CORE_PROTECTED.length;
        const coreStatus = corePresent === coreTotal ? '✅ ÍNTEGRO' : '⚠️ INCOMPLETO';
        const coreColor = corePresent === coreTotal ? '#00ff9c' : '#ffaa00';

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #00aaff; font-size: 16px;">
                    🔧 DIAGNÓSTICO v5.6.2
                </h3>
                <span style="background: #2a3a4a; padding: 4px 8px; border-radius: 4px; font-size: 11px; color: #aaddff;">
                    MODO SEGURO
                </span>
            </div>
            
            <div style="background: #2a3a4a; border-radius: 8px; padding: 15px; margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <span style="color: #aaddff;">Sistema Core:</span>
                    <span style="color: ${coreColor}; font-weight: bold;">${coreStatus}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 12px;">
                    <span style="color: #88aaff;">Funções Core:</span>
                    <span style="color: white;">${corePresent}/${coreTotal}</span>
                </div>
                <div style="margin-top: 10px; height: 4px; background: #1a2a3a; border-radius: 2px;">
                    <div style="width: ${(corePresent/coreTotal)*100}%; height: 100%; background: ${coreColor}; border-radius: 2px;"></div>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <button id="btn-diagnose" style="
                    padding: 10px;
                    background: #00aaff;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                ">
                    🔍 DIAGNOSTICAR
                </button>
                <button id="btn-clean" style="
                    padding: 10px;
                    background: #ffaa00;
                    color: black;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                ">
                    🧹 LIMPAR PLACEHOLDERS
                </button>
                <button id="btn-detect" style="
                    padding: 10px;
                    background: #ff5500;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                ">
                    🔗 REMOVER OBSOLETOS
                </button>
                <button id="btn-pdf" style="
                    padding: 10px;
                    background: #9933cc;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-weight: bold;
                    transition: all 0.3s;
                ">
                    📄 TESTAR PDF
                </button>
            </div>

            <div style="font-size: 11px; color: #88aaff; text-align: center; border-top: 1px solid #2a3a4a; padding-top: 15px;">
                ⚠️ NUNCA remove funções do Core System (PdfLogger, etc)
                <br>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    margin-top: 10px;
                    padding: 5px 15px;
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

        document.getElementById('btn-detect')?.addEventListener('click', () => {
            window.detectAndRemoveBrokenReferences?.();
        });

        document.getElementById('btn-pdf')?.addEventListener('click', () => {
            if (window.PdfSystem?.testButtons) {
                window.PdfSystem.testButtons();
            } else if (window.PdfSystem?.showModal && window.properties?.[0]) {
                window.PdfSystem.showModal(window.properties[0].id);
            }
        });

        log.info('Painel de controle criado');
        log.groupEnd();
        return panel;
    };

    // ========== INICIALIZAÇÃO NÃO INVASIVA ==========
    window.safeInitDiagnostics = function() {
        log.group('INICIALIZAÇÃO SEGURA');
        
        try {
            // 1. APENAS diagnosticar, NUNCA modificar
            const diagnosis = window.diagnoseExistingFunctions?.();
            
            // 2. Mostrar painel APENAS se debug=true explícito
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('debug') === 'true' && urlParams.get('diagnostics') === 'true') {
                setTimeout(() => window.showCompatibilityControlPanel?.(), 1000);
                log.info('Modo diagnóstico ativo - painel será exibido');
            } else {
                log.info('Diagnóstico inativo. Use ?debug=true&diagnostics=true para ativar');
            }
            
            log.info('Inicialização concluída (nenhuma modificação feita)');
            
        } catch (error) {
            log.error('Falha na inicialização segura: ' + error.message);
        }
        
        log.groupEnd();
        return { success: true, version: SAFETY.VERSION, mode: 'readonly' };
    };

    // ========== EXPORTAÇÃO CONTROLADA ==========
    // NUNCA sobrescrever funções do Core
    const exportedFunctions = {
        diagnoseExistingFunctions: true,
        autoFixMissingFunctions: true,
        detectAndRemoveBrokenReferences: true,
        showCompatibilityControlPanel: true,
        safeInitDiagnostics: true
    };

    // ========== EXECUÇÃO INICIAL ==========
    log.info('MÓDULO DE COMPATIBILIDADE OTIMIZADO (v5.6.2)');
    console.log('📋 [DIAG56] Comandos disponíveis:');
    console.log('   diagnoseExistingFunctions()  - Verificar funções (MODO LEITURA)');
    console.log('   autoFixMissingFunctions()    - Remover APENAS placeholders');
    console.log('   detectAndRemoveBrokenReferences() - Remover APENAS obsoletos permitidos');
    console.log('   showCompatibilityControlPanel() - Abrir painel não invasivo');
    console.log('   safeInitDiagnostics()        - Inicialização manual (NÃO modifica Core)');
    console.log('\n🔒 PROTEÇÕES ATIVAS:');
    console.log(`   - ${SAFETY.CORE_PROTECTED.length} funções do Core NUNCA serão removidas`);
    console.log(`   - Apenas ${SAFETY.ALLOWED_REMOVAL.length} placeholders podem ser limpos`);
    console.log('   - Nenhuma função do Core é sobrescrita ou delegada');
    
    // Auto-inicialização APENAS se for modo diagnóstico explícito
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('debug') === 'true' && urlParams.get('diagnostics') === 'true') {
        setTimeout(window.safeInitDiagnostics, 500);
    }

})();
