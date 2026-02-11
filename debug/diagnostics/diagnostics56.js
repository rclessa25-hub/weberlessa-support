// ================== debug/diagnostics/diagnostics56.js ==================
// SISTEMA DE DIAGNÓSTICO E COMPATIBILIDADE - VERSÃO 5.7
// Integração com Core System (imoveis-maceio) e Support System
// Data: 10/02/2026 - Refatoração para eliminar duplicações e referências obsoletas
// =========================================================================
console.log('✅ MÓDULOS DE DIAGNÓSTICO PDF - VERSÃO OTIMIZADA v5.7');

/* ================== VERIFICAÇÃO DE FUNÇÕES EXISTENTES ================== */
window.diagnoseExistingFunctions = function() {
    console.group('🔍 VERIFICAÇÃO DE FUNÇÕES EXISTENTES NO CORE (v5.7)');
    
    // --- LISTA ATUALIZADA: Removidas funções obsoletas e duplicadas ---
    const criticalFunctions = [
        // PDF System (APENAS via PdfSystem)
        'PdfSystem',
        'PdfSystem.showModal',
        'PdfSystem.init',
        
        // Media System (Fonte Única para PDFs/Imagens)
        'MediaSystem',
        'MediaSystem.uploadAll',
        'MediaSystem.addPdfs',
        'MediaSystem.loadExisting',
        
        // Funções de diagnóstico (mantidas no Support)
        'interactivePdfTest',
        'diagnosePdfIconProblem',
        'runPdfCompatibilityCheck',
        'diagnoseExistingFunctions',   // Ela mesma
        'autoFixMissingFunctions',
        'showCompatibilityControlPanel',
        
        // Sistemas base
        'supabaseClient',
        'properties'
    ];
    
    const results = {
        exists: [],
        missing: [],
        warnings: [],
        deprecated: [],  // NOVO: Lista de funções que devem ser removidas
        timestamp: new Date().toISOString(),
        version: '5.7'
    };

    // --- Verificar funções que DEVEM ser removidas (duplicadas/obsoletas) ---
    const deprecatedFunctions = [
        'showPdfModal',               // Substituído por PdfSystem.showModal
        'processAndSavePdfs',         // Duplicado (global vs MediaSystem)
        'clearAllPdfs',              // Substituído por MediaSystem.resetState
        'loadExistingPdfsForEdit',   // Substituído por MediaSystem.loadExisting
        'testPdfSystem',            // Substituído por PdfSystem.testButtons
        'ValidationSystem',          // Placeholder, deve ser removido
        'EmergencySystem',          // Placeholder, deve ser removido
        'monitorPdfPostCorrection', // Placeholder, nunca implementado
        'verifyRollbackCompatibility', // Placeholder, nunca implementado
        'finalPdfSystemValidation'  // Placeholder, nunca implementado
    ];
    
    deprecatedFunctions.forEach(funcName => {
        let exists = false;
        try {
            if (funcName.includes('.')) {
                const parts = funcName.split('.');
                let current = window;
                for (const part of parts) {
                    if (current && typeof current === 'object' && part in current) current = current[part];
                    else current = undefined;
                }
                exists = current !== undefined;
            } else {
                exists = funcName in window;
            }
            
            if (exists) {
                results.deprecated.push(funcName);
                console.warn(`⚠️ DEPRECATED: ${funcName} - Deve ser removida/consolidada`);
            }
        } catch (error) {
            // Ignorar erros na verificação
        }
    });

    // --- Verificar funções críticas atuais ---
    criticalFunctions.forEach(funcName => {
        try {
            let exists = false;
            let value = undefined;
            
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
                value = current;
            } else {
                exists = funcName in window;
                value = window[funcName];
            }
            
            if (exists) {
                const type = typeof value;
                results.exists.push({ name: funcName, type: type, isFunction: type === 'function' });
                console.log(`✅ ${funcName}: ${type} ${type === 'function' ? '✓' : ''}`);
            } else {
                results.missing.push(funcName);
                console.warn(`❌ ${funcName}: NÃO EXISTE`);
            }
        } catch (error) {
            results.warnings.push(`${funcName}: ERRO - ${error.message}`);
            console.error(`⚠️ ${funcName}: ERRO - ${error.message}`);
        }
    });

    // --- Verificar duplicação específica (AGORA RESOLVIDA) ---
    const globalProcess = typeof window.processAndSavePdfs === 'function';
    const mediaProcess = window.MediaSystem && typeof window.MediaSystem.processAndSavePdfs === 'function';
    
    if (globalProcess && mediaProcess) {
        if (window.processAndSavePdfs !== window.MediaSystem.processAndSavePdfs) {
            console.warn('⚠️ [DUPLICAÇÃO RESOLVÍVEL] processAndSavePdfs duplicada. Recomenda-se manter APENAS MediaSystem.processAndSavePdfs');
            results.warnings.push('Duplicação: processAndSavePdfs (global vs MediaSystem)');
        }
    }

    console.log('📊 RESUMO FINAL v5.7:');
    console.log(`- Funções essenciais OK: ${results.exists.length}`);
    console.log(`- Funções essenciais faltando: ${results.missing.length}`);
    console.log(`- Funções obsoletas detectadas: ${results.deprecated.length}`);
    console.log(`- Avisos: ${results.warnings.length}`);
    
    if (results.deprecated.length > 0) {
        console.log('⚠️ AÇÕES RECOMENDADAS:');
        results.deprecated.forEach(f => console.log(`   - Remover referência a "${f}"`));
        console.log('   - Substituir chamadas de "showPdfModal" por "PdfSystem.showModal"');
        console.log('   - Substituir "processAndSavePdfs" por "MediaSystem.uploadAll"');
    }
    
    console.groupEnd();
    return results;
};

/* ================== CORREÇÃO AUTOMÁTICA DE FUNÇÕES FALTANTES ================== */
window.autoFixMissingFunctions = function() {
    console.group('🛠️ CORREÇÃO AUTOMÁTICA DE FUNÇÕES FALTANTES v5.7');
    
    const fixes = [];
    const errors = [];

    // --- 1. APENAS criar funções essenciais que ainda não existem DELEGANDO para o Core ---
    
    // showPdfModal: Delegar para PdfSystem.showModal
    if (typeof window.showPdfModal !== 'function') {
        console.log('🔧 Criando showPdfModal (delegação para PdfSystem)...');
        window.showPdfModal = function(propertyId) {
            if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
                return window.PdfSystem.showModal(propertyId);
            }
            console.warn('⚠️ PdfSystem.showModal não disponível');
            return false;
        };
        fixes.push('showPdfModal (delegação)');
    }

    // testPdfSystem: Usar PdfSystem.testButtons
    if (typeof window.testPdfSystem !== 'function') {
        console.log('🔧 Criando testPdfSystem (delegação)...');
        window.testPdfSystem = function(propertyId = 101) {
            if (window.PdfSystem && typeof window.PdfSystem.testButtons === 'function') {
                return window.PdfSystem.testButtons();
            }
            console.warn('⚠️ PdfSystem.testButtons não disponível');
            return false;
        };
        fixes.push('testPdfSystem (delegação)');
    }

    // interactivePdfTest: Versão simplificada que usa o sistema atual
    if (typeof window.interactivePdfTest !== 'function') {
        console.log('🔧 Criando interactivePdfTest (versão 5.7)...');
        window.interactivePdfTest = function() {
            console.log('🎮 interactivePdfTest v5.7 - Usando PdfSystem atual');
            if (window.PdfSystem && window.properties && window.properties.length > 0) {
                const firstPropertyWithPdf = window.properties.find(p => p.pdfs && p.pdfs !== 'EMPTY');
                if (firstPropertyWithPdf) {
                    window.PdfSystem.showModal(firstPropertyWithPdf.id);
                } else {
                    console.warn('⚠️ Nenhum imóvel com PDF para teste');
                    if (window.PdfSystem.showModal) window.PdfSystem.showModal(101); // Fallback ID fixo
                }
            }
            return true;
        };
        fixes.push('interactivePdfTest');
    }

    // --- 2. REMOVER placeholders de sistemas obsoletos (se existirem) ---
    const obsoleteSystems = ['ValidationSystem', 'EmergencySystem', 'monitorPdfPostCorrection', 'verifyRollbackCompatibility', 'finalPdfSystemValidation'];
    obsoleteSystems.forEach(sys => {
        if (sys in window) {
            try {
                delete window[sys];
                console.log(`🗑️ Removido placeholder obsoleto: ${sys}`);
                fixes.push(`Removido ${sys}`);
            } catch (e) {
                console.warn(`⚠️ Não foi possível remover ${sys}: ${e.message}`);
            }
        }
    });

    console.log(`📊 CORREÇÕES APLICADAS: ${fixes.length}`);
    console.log(`✅ Detalhes: ${fixes.join(', ') || 'Nenhuma necessária'}`);
    console.groupEnd();
    
    return { fixesApplied: fixes, errors: errors, timestamp: new Date().toISOString(), version: '5.7' };
};

/* ================== DETECTAR E REMOVER REFERÊNCIAS QUEBRADAS ================== */
window.detectAndRemoveBrokenReferences = function() {
    console.group('🔍 DETECTANDO REFERÊNCIAS QUEBRADAS v5.7');
    
    const potentiallyBrokenRefs = [
        'ValidationSystem',
        'EmergencySystem',
        'monitorPdfPostCorrection',
        'verifyRollbackCompatibility',
        'finalPdfSystemValidation'
    ];
    
    const brokenRefs = [];
    const workingRefs = [];
    
    potentiallyBrokenRefs.forEach(ref => {
        let exists = false;
        try {
            if (ref.includes('.')) {
                const parts = ref.split('.');
                let current = window;
                for (const part of parts) {
                    if (current && typeof current === 'object' && part in current) current = current[part];
                    else current = undefined;
                }
                exists = current !== undefined;
            } else {
                exists = ref in window;
            }
            
            if (exists) {
                workingRefs.push(ref);
                console.log(`✅ ${ref}: EXISTE (marcado para remoção)`);
                // Remover automaticamente
                try {
                    delete window[ref];
                    console.log(`   ✅ Removido: ${ref}`);
                    brokenRefs.push(ref); // Contar como "corrigido"
                } catch (e) {
                    console.error(`   ❌ Falha ao remover: ${e.message}`);
                }
            } else {
                console.log(`ℹ️ ${ref}: JÁ NÃO EXISTE (limpo)`);
            }
        } catch (error) {
            console.error(`⚠️ ${ref}: ERRO NA VERIFICAÇÃO`);
        }
    });
    
    console.log('📊 LIMPEZA DE REFERÊNCIAS:');
    console.log(`- Referências removidas/corrigidas: ${brokenRefs.length}`);
    console.groupEnd();
    
    return { brokenRefs: brokenRefs, timestamp: new Date().toISOString(), version: '5.7' };
};

/* ================== PAINEL DE CONTROLE DE COMPATIBILIDADE ================== */
window.showCompatibilityControlPanel = function() {
    console.group('🎛️ PAINEL DE CONTROLE DE COMPATIBILIDADE v5.7');
    
    const panelId = 'compatibility-control-panel-v5-7';
    let panel = document.getElementById(panelId);
    
    if (panel) panel.remove();
    
    panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #0a2a1a, #003322);
        color: #aaffaa;
        padding: 20px;
        border: 3px solid #00aa55;
        border-radius: 10px;
        z-index: 999998;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 0 30px rgba(0, 170, 85, 0.5);
        font-family: monospace;
        backdrop-filter: blur(10px);
    `;
    
    // Verificar estado atual de forma NÃO destrutiva
    const functions = window.diagnoseExistingFunctions ? 
        (() => { 
            console.groupCollapsed('🔍 Diagnóstico rápido para painel'); 
            const r = window.diagnoseExistingFunctions(); 
            console.groupEnd(); 
            return r; 
        })() : 
        { exists: [], missing: [], deprecated: [] };
    
    const missingCount = functions.missing ? functions.missing.length : 0;
    const deprecatedCount = functions.deprecated ? functions.deprecated.length : 0;
    const systemStatus = (missingCount === 0 && deprecatedCount === 0) ? '✅ ÍNTEGRO' : '⚠️ REQUER LIMPEZA';
    
    panel.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px; font-size: 18px; color: #aaffaa;">
            🔧 CONTROLE DE COMPATIBILIDADE v5.7
        </div>
        
        <div style="background: rgba(0, 170, 85, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid rgba(0, 170, 85, 0.3);">
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #aaffaa;">FUNÇÕES OK</div>
                    <div style="font-size: 24px; color: #00ff9c;">${functions.exists.length}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #ffaa88;">FALTANDO</div>
                    <div style="font-size: 24px; color: ${missingCount > 0 ? '#ff5555' : '#00ff9c'}">${missingCount}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #ffaa88;">OBSOLETAS</div>
                    <div style="font-size: 24px; color: ${deprecatedCount > 0 ? '#ffaa00' : '#00ff9c'}">${deprecatedCount}</div>
                </div>
            </div>
            <div style="font-size: 11px; color: #aaffaa; text-align: center;">
                Sistema ${systemStatus}
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: #aaffaa; margin-bottom: 8px;">AÇÕES DE MANUTENÇÃO:</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button id="diagnose-functions-btn" style="
                    padding: 10px; background: #00aa55; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔍 DIAGNOSTICAR SISTEMA
                </button>
                <button id="cleanup-deprecated-btn" style="
                    padding: 10px; background: ${deprecatedCount > 0 ? '#ffaa00' : '#555'}; 
                    color: ${deprecatedCount > 0 ? '#000' : '#888'}; border: none; border-radius: 4px; cursor: pointer;"
                    ${deprecatedCount === 0 ? 'disabled' : ''}>
                    🧹 REMOVER FUNÇÕES OBSOLETAS
                </button>
                <button id="detect-broken-btn" style="
                    padding: 10px; background: #ff5500; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔗 DETECTAR E REMOVER REFERÊNCIAS
                </button>
                <button id="test-pdf-system-btn" style="
                    padding: 10px; background: #0088cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    📄 TESTAR SISTEMA PDF (v5.7)
                </button>
            </div>
        </div>
        
        <div style="font-size: 11px; color: #aaffaa; text-align: center; margin-top: 10px;">
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="padding: 6px 12px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">
                FECHAR PAINEL
            </button>
        </div>
        
        <div style="font-size: 10px; color: #88ff88; text-align: center; margin-top: 10px;">
            v5.7 - Integrado com Core System. Duplicações removidas.
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Configurar eventos
    document.getElementById('diagnose-functions-btn').addEventListener('click', () => window.diagnoseExistingFunctions?.());
    document.getElementById('cleanup-deprecated-btn').addEventListener('click', () => {
        if (window.autoFixMissingFunctions) {
            const result = window.autoFixMissingFunctions();
            setTimeout(() => { panel.remove(); window.showCompatibilityControlPanel(); }, 1500);
        }
    });
    document.getElementById('detect-broken-btn').addEventListener('click', () => window.detectAndRemoveBrokenReferences?.());
    document.getElementById('test-pdf-system-btn').addEventListener('click', () => {
        if (window.PdfSystem?.testButtons) window.PdfSystem.testButtons();
        else if (window.interactivePdfTest) window.interactivePdfTest();
    });
    
    console.groupEnd();
    return panel;
};

/* ================== INICIALIZAÇÃO SEGURA (OTIMIZADA) ================== */
window.safeInitDiagnostics = function() {
    console.group('🚀 INICIALIZAÇÃO SEGURA DO DIAGNÓSTICO v5.7');
    
    try {
        // 1. Executar diagnóstico silencioso
        const diagnosis = window.diagnoseExistingFunctions ? window.diagnoseExistingFunctions() : null;
        
        // 2. APENAS mostrar painel, NÃO corrigir automaticamente (respeita decisão do usuário)
        if (window.showCompatibilityControlPanel) {
            setTimeout(() => window.showCompatibilityControlPanel(), 1200);
        }
        
        // 3. Registrar status final
        if (diagnosis) {
            console.log(`📊 Status: ${diagnosis.exists.length} funções OK, ${diagnosis.deprecated?.length || 0} obsoletas`);
        }
        
        console.log('✅ Inicialização segura concluída. Use o painel para ações de manutenção.');
        
    } catch (error) {
        console.error('❌ ERRO na inicialização segura:', error);
        // Fallback mínimo: garantir funções de diagnóstico
        if (typeof window.showCompatibilityControlPanel !== 'function') {
            window.showCompatibilityControlPanel = function() { console.warn('Painel indisponível'); };
        }
    }
    
    console.groupEnd();
    return { success: true, version: '5.7', timestamp: new Date().toISOString() };
};

/* ================== INTEGRAÇÃO COM O SISTEMA EXISTENTE ================== */
(function integrateCompatibilityModule() {
    console.log('🔗 INTEGRANDO MÓDULO DE COMPATIBILIDADE v5.7');
    
    // 1. Integrar com window.diag (se existir)
    if (window.diag) {
        window.diag.compat = window.diag.compat || {};
        window.diag.compat.v5_7 = {
            diagnose: window.diagnoseExistingFunctions,
            fix: window.autoFixMissingFunctions,
            detect: window.detectAndRemoveBrokenReferences,
            panel: window.showCompatibilityControlPanel,
            init: window.safeInitDiagnostics
        };
    }
    
    // 2. Integrar com console.diag (se existir)
    if (console.diag) {
        console.diag.compat = console.diag.compat || {};
        console.diag.compat.v5_7 = {
            diagnose: window.diagnoseExistingFunctions,
            fix: window.autoFixMissingFunctions,
            clean: window.detectAndRemoveBrokenReferences
        };
    }
    
    // 3. Auto-inicialização APENAS se debug=true explícito
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('debug') && urlParams.get('debug') === 'true' && urlParams.has('diagnostics')) {
        setTimeout(window.safeInitDiagnostics, 1500);
    } else {
        console.log('ℹ️ Diagnóstico automático desativado. Use ?debug=true&diagnostics=true para ativar.');
    }
    
    console.log('✅ Módulo de compatibilidade v5.7 integrado');
})();

/* ================== COMANDOS DISPONÍVEIS ================== */
console.log('✅ MÓDULO DE COMPATIBILIDADE v5.7 PRONTO');
console.log('📋 Comandos disponíveis:');
console.log('   🔍 window.diagnoseExistingFunctions() - Diagnosticar funções do Core');
console.log('   🛠️  window.autoFixMissingFunctions() - Corrigir e limpar funções obsoletas');
console.log('   🔗 window.detectAndRemoveBrokenReferences() - Detectar/remover referências quebradas');
console.log('   🎛️  window.showCompatibilityControlPanel() - Mostrar painel de controle');
console.log('   🚀 window.safeInitDiagnostics() - Inicialização silenciosa');
console.log('   📁 window.diag.compat.v5_7.* - Acesso via objeto diag');
console.log('ℹ️ Este módulo é parte do Support System e não afeta a operação do Core em produção.');
