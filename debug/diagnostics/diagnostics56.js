// ============================================================
// ARQUIVO: debug/diagnostics/diagnostics56.js
// VERSÃO: 6.0 FINAL - CORREÇÃO DE INICIALIZAÇÃO E PAINEL
// PROPÓSITO: Versão definitiva do sistema de diagnóstico e compatibilidade.
//            Corrige a inicialização para garantir a exibição do painel
//            quando os parâmetros ?debug=true&diagnostics=true estão ativos.
//            Remove placeholders temporários e implementa correções diretas.
// ============================================================
console.log('✅ [DIAGNOSTICS56] Módulo v6.0 FINAL carregado. Modo: DIAGNÓSTICO ATIVO.');

// ============================================================
// BLOCO 1: INICIALIZAÇÃO CRÍTICA (EXECUTA IMEDIATAMENTE)
// ============================================================
(function initializeDiagnosticsPanel() {
    // --- 1.1 Verificar se os parâmetros de URL exigem o painel ---
    const urlParams = new URLSearchParams(window.location.search);
    const shouldShowPanel = urlParams.has('debug') && urlParams.has('diagnostics');
    
    if (shouldShowPanel) {
        console.log('🟢 [DIAGNOSTICS56] Parâmetros detectados. Painel será exibido automaticamente.');
        // Agendar a exibição do painel após o carregamento completo
        if (document.readyState === 'complete') {
            setTimeout(showCompatibilityControlPanel, 500);
        } else {
            window.addEventListener('load', () => setTimeout(showCompatibilityControlPanel, 500));
        }
    } else {
        console.log('⚪ [DIAGNOSTICS56] Modo silencioso. Adicione ?debug=true&diagnostics=true para ativar o painel.');
    }

    // --- 1.2 Remover todos os placeholders e funções obsoletas ---
    const obsoleteFunctions = [
        'ValidationSystem', 'EmergencySystem', 'PdfLogger',
        'verifyMediaMigration', 'testModuleCompatibility', 'autoValidateMigration',
        'analyzePlaceholders', 'analyzeBrokenReferences', 'testPdfUploadBugFix',
        'verifyPdfSystemIntegrity', 'monitorPdfPostCorrection', 'verifyRollbackCompatibility',
        'finalPdfSystemValidation'
    ];
    
    obsoleteFunctions.forEach(funcName => {
        if (window[funcName] !== undefined) {
            console.log(`🧹 [DIAGNOSTICS56] Removendo placeholder obsoleto: ${funcName}`);
            try { delete window[funcName]; } catch(e) { window[funcName] = undefined; }
        }
    });
})();

// ============================================================
// BLOCO 2: DIAGNÓSTICO DE FUNÇÕES DO CORE
// ============================================================
window.diagnoseExistingFunctions = function() {
    console.group('🔍 [DIAGNOSTICS56] Verificação de Funções Críticas');
    
    const coreModules = [
        // Sistemas Principais
        { name: 'properties', type: 'array' },
        { name: 'MediaSystem', type: 'object' },
        { name: 'PdfSystem', type: 'object' },
        { name: 'SharedCore', type: 'object' },
        { name: 'LoadingManager', type: 'object' },
        { name: 'FilterManager', type: 'object' },
        
        // Funções de Manipulação de Imóveis
        'loadPropertiesData', 'renderProperties', 'filterProperties',
        'savePropertiesToStorage', 'addNewProperty', 'updateProperty',
        'updateLocalProperty', 'deleteProperty', 'updatePropertyCard',
        
        // Funções de Admin e UI
        'toggleAdminPanel', 'setupForm', 'editProperty', 'cancelEdit',
        'resetAdminFormCompletely', 'loadPropertyList',
        
        // Funções de Mídia
        'MediaSystem.addFiles', 'MediaSystem.addPdfs', 'MediaSystem.uploadAll',
        'MediaSystem.loadExisting', 'MediaSystem.resetState',
        
        // Funções de PDF
        'PdfSystem.showModal', 'PdfSystem.init',
        
        // Funções de Galeria
        'openGallery', 'closeGallery', 'createPropertyGallery',
        
        // Utilitários de Suporte (Diagnóstico)
        'diagnoseExistingFunctions', 'autoFixMissingFunctions',
        'detectAndRemoveBrokenReferences', 'showCompatibilityControlPanel'
    ];

    const results = { ok: [], missing: [], warnings: [] };

    coreModules.forEach(item => {
        let funcName = item;
        let expectedType = 'function';
        
        if (typeof item === 'object') {
            funcName = item.name;
            expectedType = item.type;
        }

        let exists = false;
        let actualType = 'undefined';
        
        try {
            if (funcName.includes('.')) {
                const parts = funcName.split('.');
                let current = window;
                for (const part of parts) {
                    current = current?.[part];
                    if (current === undefined) break;
                }
                exists = current !== undefined;
                actualType = typeof current;
            } else {
                exists = funcName in window;
                actualType = typeof window[funcName];
            }

            const status = exists ? '✅' : '❌';
            const typeMatch = (expectedType === 'any' || actualType === expectedType) ? '✓' : '⚠️';
            
            if (exists) {
                if (actualType === expectedType || expectedType === 'any' || expectedType === 'array' && Array.isArray(window[funcName])) {
                    results.ok.push(funcName);
                    console.log(`${status} ${funcName} (${actualType})`);
                } else {
                    results.warnings.push(`${funcName} (tipo: ${actualType}, esperado: ${expectedType})`);
                    console.warn(`⚠️ ${funcName} existe mas tipo incorreto: ${actualType} (esperado: ${expectedType})`);
                }
            } else {
                results.missing.push(funcName);
                console.warn(`❌ ${funcName} - NÃO ENCONTRADO`);
            }
        } catch (e) {
            results.warnings.push(`${funcName} (erro: ${e.message})`);
            console.error(`⚠️ Erro ao verificar ${funcName}:`, e.message);
        }
    });

    console.log(`📊 [RESUMO] OK: ${results.ok.length} | Ausentes: ${results.missing.length} | Avisos: ${results.warnings.length}`);
    console.groupEnd();
    return results;
};

// ============================================================
// BLOCO 3: CORREÇÃO AUTOMÁTICA DE FUNÇÕES FALTANTES
// ============================================================
window.autoFixMissingFunctions = function() {
    console.group('🛠️ [DIAGNOSTICS56] Aplicando Correções Automáticas');
    const fixes = [];

    // --- 3.1 Delegar funções PDF para o PdfSystem ---
    if (typeof window.showPdfModal !== 'function' && window.PdfSystem?.showModal) {
        window.showPdfModal = (id) => window.PdfSystem.showModal(id);
        fixes.push('showPdfModal → PdfSystem.showModal');
        console.log('✅ showPdfModal delegado para PdfSystem.showModal');
    }

    if (typeof window.testPdfSystem !== 'function') {
        window.testPdfSystem = (id = 101) => {
            console.log(`🧪 testPdfSystem chamado para ID: ${id}`);
            return window.PdfSystem?.showModal ? window.PdfSystem.showModal(id) : false;
        };
        fixes.push('testPdfSystem');
    }

    // --- 3.2 Delegar funções de mídia para o MediaSystem ---
    if (typeof window.processAndSavePdfs !== 'function' && window.MediaSystem?.processAndSavePdfs) {
        window.processAndSavePdfs = (id, title) => window.MediaSystem.processAndSavePdfs(id, title);
        fixes.push('processAndSavePdfs → MediaSystem.processAndSavePdfs');
        console.log('✅ processAndSavePdfs delegado para MediaSystem');
    }

    if (typeof window.clearAllPdfs !== 'function' && window.MediaSystem?.clearAllPdfs) {
        window.clearAllPdfs = () => window.MediaSystem.clearAllPdfs();
        fixes.push('clearAllPdfs → MediaSystem.clearAllPdfs');
    }

    if (typeof window.loadExistingPdfsForEdit !== 'function' && window.MediaSystem?.loadExistingPdfsForEdit) {
        window.loadExistingPdfsForEdit = (prop) => window.MediaSystem.loadExistingPdfsForEdit(prop);
        fixes.push('loadExistingPdfsForEdit → MediaSystem.loadExistingPdfsForEdit');
    }

    // --- 3.3 Funções utilitárias de fallback (segurança) ---
    if (typeof window.formatPriceForInput !== 'function' && window.SharedCore?.PriceFormatter?.formatForInput) {
        window.formatPriceForInput = (v) => window.SharedCore.PriceFormatter.formatForInput(v);
        fixes.push('formatPriceForInput');
    }

    if (typeof window.ensureBooleanVideo !== 'function' && window.SharedCore?.ensureBooleanVideo) {
        window.ensureBooleanVideo = (v) => window.SharedCore.ensureBooleanVideo(v);
        fixes.push('ensureBooleanVideo');
    }

    console.log(`✅ ${fixes.length} correção(ões) aplicada(s):`, fixes);
    console.groupEnd();
    return { fixesApplied: fixes, timestamp: new Date().toISOString(), version: '6.0' };
};

// ============================================================
// BLOCO 4: DETECÇÃO DE REFERÊNCIAS QUEBRADAS
// ============================================================
window.detectAndRemoveBrokenReferences = function() {
    console.group('🔗 [DIAGNOSTICS56] Verificando Referências Quebradas');
    
    const brokenRefs = [];
    const recommendations = [];

    // Verificar integridade dos sistemas principais
    if (!window.properties || !Array.isArray(window.properties)) {
        brokenRefs.push('window.properties (não é array)');
        recommendations.push('Recarregar dados com window.loadPropertiesData()');
    }

    if (!window.MediaSystem || typeof window.MediaSystem.uploadAll !== 'function') {
        brokenRefs.push('MediaSystem.uploadAll');
        recommendations.push('Verificar carregamento de media-unified.js');
    }

    if (!window.PdfSystem || typeof window.PdfSystem.showModal !== 'function') {
        brokenRefs.push('PdfSystem.showModal');
        recommendations.push('Verificar carregamento de pdf-unified.js');
    }

    // Verificar listeners de botão admin
    const adminBtn = document.querySelector('.admin-toggle');
    if (adminBtn && !adminBtn.hasAttribute('data-diag-checked')) {
        if (adminBtn.onclick === null && !adminBtn.getAttribute('onclick')) {
            console.warn('⚠️ Botão admin sem evento de clique. Reaplicando...');
            adminBtn.onclick = (e) => {
                e.preventDefault();
                window.toggleAdminPanel?.();
            };
            adminBtn.setAttribute('data-diag-checked', 'true');
            brokenRefs.push('admin-toggle.onclick (reparado)');
            recommendations.push('Evento do botão admin restaurado.');
        }
    }

    if (brokenRefs.length > 0) {
        console.warn('❌ Referências quebradas detectadas:', brokenRefs);
    } else {
        console.log('✅ Nenhuma referência quebrada crítica encontrada.');
    }

    console.groupEnd();
    return { brokenRefs, recommendations, timestamp: new Date().toISOString() };
};

// ============================================================
// BLOCO 5: PAINEL DE CONTROLE (VERSÃO VISUAL CORRIGIDA)
// ============================================================
window.showCompatibilityControlPanel = function() {
    // --- 5.1 Remover painel anterior se existir ---
    const existingPanel = document.getElementById('compatibility-control-panel-v6');
    if (existingPanel) existingPanel.remove();

    // --- 5.2 Executar diagnósticos para alimentar o painel ---
    const diagnosis = (window.diagnoseExistingFunctions || function(){ return {ok:[], missing:[], warnings:[]}; })();
    const missingCount = diagnosis.missing?.length || 0;
    const okCount = diagnosis.ok?.length || 0;
    const warningCount = diagnosis.warnings?.length || 0;

    // --- 5.3 Criar estrutura do painel com CSS garantido ---
    const panel = document.createElement('div');
    panel.id = 'compatibility-control-panel-v6';
    panel.setAttribute('data-version', '6.0');
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 380px;
        max-width: 95vw;
        background: linear-gradient(145deg, #0a1a2f, #0e2a3a);
        color: #e0f0ff;
        border: 2px solid #00ccff;
        border-radius: 16px;
        padding: 20px;
        font-family: 'Segoe UI', 'Courier New', monospace;
        font-size: 13px;
        z-index: 2147483647;
        box-shadow: 0 10px 40px rgba(0,200,255,0.5);
        backdrop-filter: blur(8px);
        line-height: 1.5;
    `;

    // Status do sistema com cores
    const systemStatus = missingCount === 0 ? '✅ ÍNTEGRO' : '⚠️ INCOMPLETO';
    const statusColor = missingCount === 0 ? '#00ff9c' : '#ffaa00';

    panel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #3388ff; padding-bottom:10px;">
            <span style="font-size:16px; font-weight:bold; color:#88ddff;">🔧 DIAGNÓSTICO v6.0</span>
            <span style="background:${statusColor}; color:#000; padding:4px 10px; border-radius:20px; font-weight:bold; font-size:12px;">${systemStatus}</span>
        </div>
        
        <!-- CARD DE STATUS RESUMIDO -->
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:8px; margin-bottom:20px; background:#11223380; padding:12px; border-radius:12px;">
            <div style="text-align:center;">
                <div style="font-size:11px; color:#aaddff;">FUNÇÕES OK</div>
                <div style="font-size:28px; font-weight:bold; color:#00ff9c;">${okCount}</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:11px; color:#aaddff;">AUSENTES</div>
                <div style="font-size:28px; font-weight:bold; color:#ff8888;">${missingCount}</div>
            </div>
            <div style="text-align:center;">
                <div style="font-size:11px; color:#aaddff;">AVISOS</div>
                <div style="font-size:28px; font-weight:bold; color:#ffaa00;">${warningCount}</div>
            </div>
        </div>

        <!-- LISTA DE AÇÕES RÁPIDAS -->
        <div style="margin-bottom:15px;">
            <div style="font-size:12px; color:#aaddff; margin-bottom:8px;">⚡ AÇÕES RÁPIDAS</div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
                <button id="diag-btn-diagnose" style="background:#005588; color:white; border:none; padding:10px 5px; border-radius:8px; font-weight:bold; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:5px;">
                    🔍 DIAGNOSTICAR
                </button>
                <button id="diag-btn-fix" ${missingCount === 0 ? 'disabled' : ''} style="background:${missingCount === 0 ? '#555' : '#ff8800'}; color:white; border:none; padding:10px 5px; border-radius:8px; font-weight:bold; cursor:${missingCount === 0 ? 'not-allowed' : 'pointer'}; display:flex; align-items:center; justify-content:center; gap:5px; opacity:${missingCount === 0 ? '0.6' : '1'};">
                    🛠️ CORRIGIR (${missingCount})
                </button>
                <button id="diag-btn-refs" style="background:#445588; color:white; border:none; padding:10px 5px; border-radius:8px; font-weight:bold; cursor:pointer;">
                    🔗 VERIFICAR REFS
                </button>
                <button id="diag-btn-testpdf" style="background:#226688; color:white; border:none; padding:10px 5px; border-radius:8px; font-weight:bold; cursor:pointer;">
                    📄 TESTAR PDF
                </button>
            </div>
        </div>

        <!-- PAINEL DE LOG RÁPIDO -->
        <div style="background:#001524; border-radius:8px; padding:10px; margin-bottom:15px; max-height:120px; overflow-y:auto; font-family:monospace; font-size:11px; border:1px solid #336688;" id="diag-log-container">
            <div style="color:#88aaff;">📋 Clique em uma ação para ver o resultado.</div>
        </div>

        <!-- RODAPÉ E BOTÃO FECHAR -->
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:5px;">
            <span style="font-size:10px; color:#88aaff;">${new Date().toLocaleTimeString()} | URL: ?debug&diagnostics</span>
            <button id="diag-btn-close" style="background:#aa4455; color:white; border:none; padding:6px 14px; border-radius:20px; font-weight:bold; cursor:pointer; font-size:12px;">FECHAR</button>
        </div>
    `;

    document.body.appendChild(panel);

    // --- 5.4 Anexar eventos de forma segura ---
    const logContainer = document.getElementById('diag-log-container');

    function addLog(message, type = 'info') {
        if (!logContainer) return;
        const entry = document.createElement('div');
        entry.style.cssText = `margin-bottom:3px; color: ${type === 'error' ? '#ff8888' : type === 'success' ? '#88ff88' : '#aaddff'};`;
        entry.textContent = `> ${message}`;
        logContainer.appendChild(entry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    // Botão Diagnosticar
    document.getElementById('diag-btn-diagnose')?.addEventListener('click', () => {
        addLog('🔍 Executando diagnóstico completo...');
        const res = window.diagnoseExistingFunctions?.();
        if (res) addLog(`✅ OK: ${res.ok?.length} | ❌ Ausentes: ${res.missing?.length}`, res.missing?.length ? 'error' : 'success');
        else addLog('❌ Falha ao executar diagnose', 'error');
    });

    // Botão Corrigir
    document.getElementById('diag-btn-fix')?.addEventListener('click', () => {
        addLog('🛠️ Aplicando correções automáticas...');
        const res = window.autoFixMissingFunctions?.();
        if (res) {
            addLog(`✅ ${res.fixesApplied?.length || 0} correção(ões) aplicada(s)`, 'success');
            // Atualizar contador no painel
            setTimeout(() => { panel.remove(); window.showCompatibilityControlPanel(); }, 1500);
        } else {
            addLog('❌ Falha na correção automática', 'error');
        }
    });

    // Botão Verificar Referências
    document.getElementById('diag-btn-refs')?.addEventListener('click', () => {
        addLog('🔗 Verificando referências quebradas...');
        const res = window.detectAndRemoveBrokenReferences?.();
        if (res) {
            if (res.brokenRefs?.length) {
                addLog(`⚠️ ${res.brokenRefs.length} referência(s) quebrada(s)`, 'error');
                res.brokenRefs.slice(0,3).forEach(ref => addLog(`   - ${ref}`, 'error'));
            } else {
                addLog('✅ Nenhuma referência quebrada', 'success');
            }
        }
    });

    // Botão Testar PDF
    document.getElementById('diag-btn-testpdf')?.addEventListener('click', () => {
        addLog('📄 Testando sistema PDF (imóvel ID: 101)...');
        if (window.PdfSystem?.showModal) {
            window.PdfSystem.showModal(101);
            addLog('✅ Modal PDF acionado via PdfSystem.showModal(101)', 'success');
        } else if (window.showPdfModal) {
            window.showPdfModal(101);
            addLog('⚠️ PdfSystem não encontrado, usando showPdfModal fallback', 'warning');
        } else {
            addLog('❌ Nenhum sistema PDF disponível!', 'error');
        }
    });

    // Botão Fechar
    document.getElementById('diag-btn-close')?.addEventListener('click', () => {
        panel.style.opacity = '0';
        setTimeout(() => panel.remove(), 300);
    });

    console.log('🟢 [DIAGNOSTICS56] Painel de controle exibido com sucesso.');
    return panel;
};

// ============================================================
// BLOCO 6: INICIALIZAÇÃO AUTOMÁTICA FINAL
// ============================================================
(function finalAutoInit() {
    // Executar diagnóstico silencioso e aguardar carregamento total
    const runSilentChecks = () => {
        // Verificar sistemas principais e aplicar correções se necessário
        if (!window.PdfSystem?.showModal || !window.MediaSystem?.uploadAll) {
            console.warn('⚠️ [DIAGNOSTICS56] Sistemas principais incompletos. Aplicando correções...');
            window.autoFixMissingFunctions?.();
        }
        
        // Verificar referências quebradas uma vez
        window.detectAndRemoveBrokenReferences?.();
    };

    if (document.readyState === 'complete') {
        runSilentChecks();
    } else {
        window.addEventListener('load', runSilentChecks);
    }
})();

// ============================================================
// FIM DO ARQUIVO diagnostics56.js v6.0 FINAL
// ============================================================
console.log('✅ [DIAGNOSTICS56] Módulo v6.0 FINAL inicializado. Status: PRONTO.');
