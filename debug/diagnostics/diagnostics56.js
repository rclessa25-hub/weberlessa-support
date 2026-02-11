// ================== debug/diagnostics/diagnostics56.js ==================
// VERSÃO FINAL CORRIGIDA - EXECUÇÃO ÚNICA, PAINEL ÚNICO, SEM DUPLICAÇÃO
// Responsabilidade: Diagnosticar e corrigir funções ausentes/quebradas no Core
// 100% compatível com Support System (weberlessa-support)
console.log('✅ diagnostics56.js - MÓDULO DE COMPATIBILIDADE OTIMIZADO (v5.6.1)');

// ========== BLOQUEIO DE EXECUÇÃO MÚLTIPLA ==========
if (window.__DIAGNOSTICS56_LOADED__) {
    console.log('⏭️ diagnostics56.js já carregado. Ignorando execução duplicada.');
} else {
    window.__DIAGNOSTICS56_LOADED__ = true;

// ========== 1. DIAGNÓSTICO DE FUNÇÕES EXISTENTES ==========
window.diagnoseExistingFunctions = function(quiet = false) {
    if (!quiet) console.group('🔍 [DIAG56] VERIFICAÇÃO DE FUNÇÕES NO CORE');
    
    // Lista de funções CRÍTICAS que DEVEM existir (foco em PDF e Media)
    const criticalFunctions = [
        'showPdfModal', 'testPdfSystem', 'processAndSavePdfs', 
        'clearAllPdfs', 'loadExistingPdfsForEdit', 'interactivePdfTest',
        'MediaSystem', 'PdfSystem'
    ];
    
    // Lista de referências obsoletas que causam erros no console
    const brokenReferences = [
        'ValidationSystem', 'EmergencySystem', 'monitorPdfPostCorrection',
        'verifyRollbackCompatibility', 'finalPdfSystemValidation'
    ];
    
    const results = {
        exists: [],
        missing: [],
        placeholdersCreated: [],
        brokenRefs: brokenReferences.filter(ref => ref in window)
    };

    // Verificar funções críticas
    criticalFunctions.forEach(funcName => {
        let exists = false;
        let target = window;
        
        if (funcName.includes('.')) {
            const parts = funcName.split('.');
            target = parts.reduce((obj, key) => obj?.[key], window);
            exists = target !== undefined && target !== null;
        } else {
            exists = typeof window[funcName] === 'function';
        }

        if (exists) {
            results.exists.push(funcName);
            if (!quiet) console.log(`   ✅ ${funcName}`);
        } else {
            results.missing.push(funcName);
            if (!quiet) console.warn(`   ❌ ${funcName} (ausente)`);
        }
    });

    // Verificar duplicação problemática
    const hasGlobalProcess = typeof window.processAndSavePdfs === 'function';
    const hasMediaProcess = window.MediaSystem?.processAndSavePdfs;
    if (hasGlobalProcess && hasMediaProcess && window.processAndSavePdfs !== window.MediaSystem.processAndSavePdfs) {
        results.duplicateDetected = 'processAndSavePdfs duplicada (global vs MediaSystem)';
        if (!quiet) console.warn('   ⚠️ Duplicação: processAndSavePdfs');
    }

    if (!quiet) {
        console.log(`   📊 Resumo: ${results.exists.length} ok, ${results.missing.length} ausentes`);
        console.groupEnd();
    }
    
    return results;
};

// ========== 2. CORREÇÃO AUTOMÁTICA (SEM DUPLICAR LÓGICA EXISTENTE) ==========
window.autoFixMissingFunctions = function() {
    console.group('🛠️ [DIAG56] CORREÇÃO AUTOMÁTICA DE COMPATIBILIDADE');
    
    const diagnosis = window.diagnoseExistingFunctions(true);
    const fixes = [];
    
    // --- REGRA 1: Se não existe, DELEGAR para o PdfSystem/MediaSystem (NUNCA criar lógica nova) ---
    if (diagnosis.missing.includes('showPdfModal')) {
        window.showPdfModal = function(propertyId) {
            console.log(`📄 [COMPAT] showPdfModal → delegando para PdfSystem.showModal(${propertyId})`);
            if (window.PdfSystem?.showModal) {
                return window.PdfSystem.showModal(propertyId);
            }
            // Fallback: exibir modal existente
            const modal = document.getElementById('pdfModal');
            if (modal) { modal.style.display = 'flex'; return true; }
            return false;
        };
        fixes.push('showPdfModal (delegada para PdfSystem)');
    }

    if (diagnosis.missing.includes('testPdfSystem')) {
        window.testPdfSystem = function(id = 101) {
            console.log(`🧪 [COMPAT] testPdfSystem → chamando showPdfModal(${id})`);
            return window.showPdfModal?.(id) || false;
        };
        fixes.push('testPdfSystem (wrapper)');
    }

    if (diagnosis.missing.includes('interactivePdfTest')) {
        // Função leve que apenas chama o diagnóstico, sem criar novo painel pesado
        window.interactivePdfTest = function() {
            console.log('🎮 [COMPAT] interactivePdfTest → executando diagnóstico');
            window.diagnoseExistingFunctions();
            if (window.showCompatibilityControlPanel) {
                window.showCompatibilityControlPanel();
            }
        };
        fixes.push('interactivePdfTest (diagnóstico)');
    }

    // --- REGRA 2: Remover referências obsoletas do escopo global (para limpar o console) ---
    const obsoleteRefs = ['ValidationSystem', 'EmergencySystem', 'monitorPdfPostCorrection', 
                          'verifyRollbackCompatibility', 'finalPdfSystemValidation'];
    
    obsoleteRefs.forEach(ref => {
        if (ref in window && typeof window[ref] === 'undefined') {
            // Se existe como propriedade undefined, deletar
            delete window[ref];
            fixes.push(`🗑️ ${ref} removido`);
        } else if (!(ref in window)) {
            // Se não existe, não faz nada (já está limpo)
        }
    });

    console.log(`   ✅ Correções aplicadas: ${fixes.length}`, fixes);
    console.groupEnd();
    
    return { fixesApplied: fixes, timestamp: new Date().toISOString() };
};

// ========== 3. DETECÇÃO DE REFERÊNCIAS QUEBRADAS ==========
window.detectAndRemoveBrokenReferences = function() {
    console.group('🔗 [DIAG56] DETECÇÃO DE REFERÊNCIAS QUEBRADAS');
    
    const potentialRefs = [
        'ValidationSystem', 'EmergencySystem', 'PdfLogger',
        'monitorPdfPostCorrection', 'verifyRollbackCompatibility',
        'finalPdfSystemValidation'
    ];
    
    const broken = [];
    const working = [];
    
    potentialRefs.forEach(ref => {
        const exists = ref in window;
        const isFunction = exists && typeof window[ref] === 'function';
        
        if (exists && !isFunction) {
            // É uma propriedade, mas não é função (provavelmente lixo)
            delete window[ref];
            broken.push(`${ref} (removido)`);
            console.warn(`   🗑️ ${ref} removido (não é função)`);
        } else if (exists) {
            working.push(ref);
            console.log(`   ✅ ${ref} (função válida)`);
        } else {
            // Não existe, silenciosamente ignorado
        }
    });
    
    console.log(`   📊 Removidas: ${broken.length} referências obsoletas`);
    console.groupEnd();
    
    return { brokenRefsRemoved: broken, workingRefs: working };
};

// ========== 4. PAINEL DE CONTROLE ÚNICO ==========
window.showCompatibilityControlPanel = function() {
    // Se já existe um painel, remove-o antes de criar novo
    const existingPanel = document.getElementById('compat-panel-v56');
    if (existingPanel) {
        existingPanel.remove();
    }

    console.log('🎛️ [DIAG56] Criando painel de controle único');
    
    const panel = document.createElement('div');
    panel.id = 'compat-panel-v56';
    panel.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(145deg, #0a1a2a, #001a33);
        color: #aaddff;
        padding: 18px;
        border: 2px solid #00aaff;
        border-radius: 12px;
        z-index: 999997;
        max-width: 360px;
        width: 90%;
        box-shadow: 0 0 25px rgba(0, 170, 255, 0.4);
        font-family: 'Segoe UI', monospace;
        backdrop-filter: blur(8px);
    `;

    const diagnosis = window.diagnoseExistingFunctions(true);
    const missingCount = diagnosis.missing.length;
    const brokenCount = diagnosis.brokenRefs?.length || 0;

    panel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <span style="color: #88ddff; font-weight: bold; font-size: 1.1rem;">
                🔧 COMPAT v5.6.1
            </span>
            <span style="background: ${missingCount === 0 ? '#1a4d1a' : '#4d1a1a'}; 
                         color: ${missingCount === 0 ? '#aaffaa' : '#ffaaaa'}; 
                         padding: 4px 10px; border-radius: 20px; font-size: 0.75rem;">
                ${missingCount === 0 ? 'ÍNTEGRO' : `${missingCount} pendente`}
            </span>
        </div>
        
        <div style="background: rgba(0,170,255,0.1); padding: 12px; border-radius: 8px; margin-bottom: 15px;
                    border-left: 4px solid ${missingCount === 0 ? '#00cc88' : '#ffaa00'};">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; text-align: center;">
                <div>
                    <div style="font-size: 0.7rem; color: #99ccff;">FUNÇÕES OK</div>
                    <div style="font-size: 1.6rem; font-weight: bold; color: #00ff9c;">${diagnosis.exists.length}</div>
                </div>
                <div>
                    <div style="font-size: 0.7rem; color: #99ccff;">AUSENTES</div>
                    <div style="font-size: 1.6rem; font-weight: bold; color: ${missingCount > 0 ? '#ff8888' : '#00ff9c'};">${missingCount}</div>
                </div>
            </div>
        </div>
        
        <div style="display: flex; flex-direction: column; gap: 8px;">
            <button id="diag-btn-fix" style="background: #006699; color: white; border: none; 
                    padding: 10px; border-radius: 6px; font-weight: bold; cursor: pointer;
                    border-bottom: 3px solid #004466;">
                🛠️ CORRIGIR AUTOMATICAMENTE
            </button>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                <button id="diag-btn-scan" style="background: #2a4055; color: white; border: none; 
                        padding: 8px; border-radius: 5px; cursor: pointer; font-size: 0.85rem;">
                    🔍 DIAGNOSTICAR
                </button>
                <button id="diag-btn-clean" style="background: #553333; color: #ffbb99; border: none; 
                        padding: 8px; border-radius: 5px; cursor: pointer; font-size: 0.85rem;">
                    🗑️ LIMPAR REFS
                </button>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px;">
            <span style="font-size: 0.65rem; color: #88aaff;">
                Core: ${diagnosis.exists.length}/${diagnosis.exists.length + missingCount}
            </span>
            <button id="diag-btn-close" style="background: #444; color: white; border: none; 
                    padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">
                FECHAR
            </button>
        </div>
    `;

    document.body.appendChild(panel);

    // Event Listeners
    document.getElementById('diag-btn-fix')?.addEventListener('click', () => {
        window.autoFixMissingFunctions();
        panel.remove();
        window.showCompatibilityControlPanel(); // Recria com novo estado
    });

    document.getElementById('diag-btn-scan')?.addEventListener('click', () => {
        window.diagnoseExistingFunctions();
    });

    document.getElementById('diag-btn-clean')?.addEventListener('click', () => {
        window.detectAndRemoveBrokenReferences();
        setTimeout(() => {
            panel.remove();
            window.showCompatibilityControlPanel();
        }, 300);
    });

    document.getElementById('diag-btn-close')?.addEventListener('click', () => {
        panel.remove();
    });

    return panel;
};

// ========== 5. INICIALIZAÇÃO SEGURA (EXECUÇÃO ÚNICA) ==========
window.safeInitDiagnostics = function() {
    // Impedir execução se já foi iniciado
    if (window.__DIAG56_INIT__) {
        console.log('⏭️ [DIAG56] Inicialização já realizada. Ignorando.');
        return;
    }
    window.__DIAG56_INIT__ = true;

    console.group('🚀 [DIAG56] INICIALIZAÇÃO SEGURA');
    
    // 1. Remover referências obsoletas primeiro (limpa o console)
    window.detectAndRemoveBrokenReferences();
    
    // 2. Diagnosticar funções
    const diagnosis = window.diagnoseExistingFunctions(true);
    
    // 3. Corrigir automaticamente se necessário
    if (diagnosis.missing.length > 0) {
        console.log(`⚠️ ${diagnosis.missing.length} função(ões) ausentes. Aplicando correções...`);
        window.autoFixMissingFunctions();
    } else {
        console.log('✅ Nenhuma correção necessária.');
    }
    
    // 4. Mostrar painel APENAS se estiver em modo debug explícito
    if (window.location.search.includes('diagnostics=true') || 
        window.location.search.includes('debug=true')) {
        setTimeout(() => {
            window.showCompatibilityControlPanel();
        }, 800);
    }
    
    console.log('✅ [DIAG56] Inicialização concluída.');
    console.groupEnd();
};

// ========== 6. GATILHO DE INICIALIZAÇÃO CONTROLADO ==========
// Executar APENAS uma vez, quando o DOM estiver pronto e em modo debug
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.safeInitDiagnostics, 1200);
    });
} else {
    setTimeout(window.safeInitDiagnostics, 1200);
}

// ========== 7. EXPOSIÇÃO CONTROLADA DE APIS ==========
// Integrar com window.diag se existir, sem sobrescrever
if (!window.diag) window.diag = {};
window.diag.compat = {
    diagnose: window.diagnoseExistingFunctions,
    fix: window.autoFixMissingFunctions,
    clean: window.detectAndRemoveBrokenReferences,
    panel: window.showCompatibilityControlPanel,
    version: '5.6.1'
};

console.log('📋 [DIAG56] Comandos disponíveis:');
console.log('   diagnoseExistingFunctions()  - Verificar funções');
console.log('   autoFixMissingFunctions()    - Corrigir ausentes');
console.log('   detectAndRemoveBrokenReferences() - Limpar referências');
console.log('   showCompatibilityControlPanel() - Abrir painel');
console.log('   safeInitDiagnostics()        - Reinicialização manual');

} // Fim do bloqueio de execução múltipla
