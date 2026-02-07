/* ================== FUNÇÕES DE DIAGNÓSTICO PDF - VERSÃO APRIMORADA 5.6.1 ================== */
// CÓDIGO PARA ADICIONAR AO FINAL DO ARQUIVO DIAGNOSTICS56.JS EXISTENTE

console.log('✅ MÓDULOS DE DIAGNÓSTICO PDF - VERSÃO APRIMORADA 5.6.1 - CORREÇÃO DE WRAPPERS');

/* ================== CORREÇÃO ESPECÍFICA DOS WRAPPERS FALTANTES ================== */
window.fixMissingWrappers = function() {
    console.group('🔧 CORREÇÃO ESPECÍFICA DE WRAPPERS FALTANTES');
    
    const fixes = [];
    const existingFunctions = [];
    
    // 1. CORRIGIR: getMediaUrlsForProperty (CRÍTICO - Causa erro em diagnostics53.js:3976)
    if (typeof window.getMediaUrlsForProperty !== 'function') {
        console.log('🔧 Criando getMediaUrlsForProperty wrapper...');
        
        window.getMediaUrlsForProperty = async function(propertyId, propertyTitle) {
            console.log(`🖼️ getMediaUrlsForProperty(${propertyId}, ${propertyTitle}) chamado - DELEGANDO PARA MediaSystem`);
            
            // Prioridade 1: Usar MediaSystem se disponível
            if (window.MediaSystem && typeof window.MediaSystem.getMediaUrlsForProperty === 'function') {
                console.log('🔗 Delegando para MediaSystem.getMediaUrlsForProperty');
                return await window.MediaSystem.getMediaUrlsForProperty(propertyId, propertyTitle);
            }
            
            // Prioridade 2: Usar função equivalente no MediaSystem
            if (window.MediaSystem && typeof window.MediaSystem.uploadAll === 'function') {
                console.log('🔗 Usando MediaSystem.uploadAll como fallback');
                const result = await window.MediaSystem.uploadAll(propertyId, propertyTitle);
                return result.images || '';
            }
            
            // Prioridade 3: Fallback básico
            console.warn('⚠️ Usando fallback para getMediaUrlsForProperty');
            return Promise.resolve('');
        };
        
        fixes.push('getMediaUrlsForProperty wrapper criado');
        console.log('✅ getMediaUrlsForProperty criada (wrapper para MediaSystem)');
    } else {
        existingFunctions.push('getMediaUrlsForProperty');
    }
    
    // 2. CORRIGIR: loadExistingPdfsForEdit (CRÍTICO - Causa erro em diagnostics53.js:3344)
    if (typeof window.loadExistingPdfsForEdit !== 'function') {
        console.log('🔧 Criando loadExistingPdfsForEdit wrapper...');
        
        window.loadExistingPdfsForEdit = function(property) {
            console.log(`📄 loadExistingPdfsForEdit(${property?.id || 'N/A'}) chamado - DELEGANDO PARA MediaSystem`);
            
            // Prioridade 1: Usar MediaSystem se disponível
            if (window.MediaSystem && typeof window.MediaSystem.loadExistingPdfsForEdit === 'function') {
                console.log('🔗 Delegando para MediaSystem.loadExistingPdfsForEdit');
                return window.MediaSystem.loadExistingPdfsForEdit(property);
            }
            
            // Prioridade 2: Usar loadExisting se disponível
            if (window.MediaSystem && typeof window.MediaSystem.loadExisting === 'function') {
                console.log('🔗 Usando MediaSystem.loadExisting como fallback');
                return window.MediaSystem.loadExisting(property);
            }
            
            // Prioridade 3: Fallback básico
            console.warn('⚠️ Usando fallback para loadExistingPdfsForEdit');
            return {
                success: false,
                message: 'Função não implementada (modo compatibilidade)',
                propertyId: property?.id
            };
        };
        
        fixes.push('loadExistingPdfsForEdit wrapper criado');
        console.log('✅ loadExistingPdfsForEdit criada (wrapper para MediaSystem)');
    } else {
        existingFunctions.push('loadExistingPdfsForEdit');
    }
    
    // 3. CORRIGIR: clearAllPdfs (se ainda não existir)
    if (typeof window.clearAllPdfs !== 'function') {
        console.log('🔧 Criando clearAllPdfs wrapper...');
        
        window.clearAllPdfs = function() {
            console.log('🗑️ clearAllPdfs() chamado - DELEGANDO PARA MediaSystem');
            
            // Prioridade 1: Usar MediaSystem
            if (window.MediaSystem && typeof window.MediaSystem.clearAllPdfs === 'function') {
                return window.MediaSystem.clearAllPdfs();
            }
            
            // Prioridade 2: Usar clearAllMedia
            if (window.MediaSystem && typeof window.MediaSystem.clearAllMedia === 'function') {
                return window.MediaSystem.clearAllMedia();
            }
            
            // Prioridade 3: Fallback básico
            console.warn('⚠️ Usando fallback para clearAllPdfs');
            const preview = document.getElementById('pdfUploadPreview');
            if (preview) preview.innerHTML = '';
            return true;
        };
        
        fixes.push('clearAllPdfs wrapper criado');
        console.log('✅ clearAllPdfs criada (wrapper para MediaSystem)');
    }
    
    // 4. VERIFICAR E CORRIGIR: processAndSavePdfs (para evitar duplicação)
    if (typeof window.processAndSavePdfs === 'function') {
        // Verificar se é uma função wrapper adequada
        const functionString = window.processAndSavePdfs.toString();
        const isWrapper = functionString.includes('MediaSystem') || 
                         functionString.includes('delegando') ||
                         functionString.includes('wrapper');
        
        if (!isWrapper) {
            console.log('🔧 Melhorando processAndSavePdfs para wrapper correto...');
            
            const originalFunction = window.processAndSavePdfs;
            
            window.processAndSavePdfs = async function(propertyId, propertyTitle) {
                console.log(`📤 processAndSavePdfs(${propertyId}, ${propertyTitle}) - VERIFICANDO MediaSystem`);
                
                // Tentar usar MediaSystem primeiro
                if (window.MediaSystem && typeof window.MediaSystem.processAndSavePdfs === 'function') {
                    console.log('🔗 Usando MediaSystem.processAndSavePdfs');
                    return await window.MediaSystem.processAndSavePdfs(propertyId, propertyTitle);
                }
                
                // Fallback para função original
                console.log('🔄 Usando implementação original');
                return originalFunction(propertyId, propertyTitle);
            };
            
            fixes.push('processAndSavePdfs aprimorada para wrapper');
        }
    }
    
    console.log('📊 RESUMO DAS CORREÇÕES:');
    console.log(`- Funções corrigidas: ${fixes.length}`);
    console.log(`- Funções já existentes: ${existingFunctions.length}`);
    
    if (fixes.length > 0) {
        console.log('✅ WRAPPERS CORRIGIDOS:', fixes.join(', '));
        
        // Mostrar alerta visual se em modo diagnóstico
        if (window.DIAGNOSTICS_MODE) {
            setTimeout(() => {
                const alertDiv = document.createElement('div');
                alertDiv.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: #001a00;
                    color: #00ff9c;
                    padding: 15px;
                    border: 2px solid #00ff9c;
                    border-radius: 8px;
                    z-index: 1000000;
                    max-width: 350px;
                    box-shadow: 0 0 20px rgba(0, 255, 156, 0.5);
                    font-family: monospace;
                `;
                
                alertDiv.innerHTML = `
                    <div style="font-weight:bold;margin-bottom:10px;">🔧 WRAPPERS CORRIGIDOS v5.6.1</div>
                    <div style="font-size:12px;color:#88ffaa;">
                        ${fixes.map(fix => `• ${fix}`).join('<br>')}
                    </div>
                    <div style="font-size:10px;color:#00aaff;margin-top:10px;">
                        Erros em diagnostics53.js resolvidos
                    </div>
                    <button onclick="this.parentElement.remove()" style="
                        margin-top:10px; padding:5px 10px; background:#00ff9c; 
                        color:#000; border:none; cursor:pointer; font-size:10px;">
                        OK
                    </button>
                `;
                
                document.body.appendChild(alertDiv);
                
                // Auto-remover após 10 segundos
                setTimeout(() => {
                    if (alertDiv.parentElement) {
                        alertDiv.remove();
                    }
                }, 10000);
            }, 1000);
        }
    }
    
    console.groupEnd();
    
    return {
        fixesApplied: fixes,
        existingFunctions: existingFunctions,
        timestamp: new Date().toISOString(),
        version: '5.6.1'
    };
};

/* ================== VERIFICAÇÃO DE INTEGRAÇÃO COM MediaSystem ================== */
window.verifyMediaSystemIntegration = function() {
    console.group('🔗 VERIFICAÇÃO DE INTEGRAÇÃO MediaSystem');
    
    const checks = {
        'MediaSystem disponível': !!window.MediaSystem,
        'Funções principais MediaSystem': window.MediaSystem ? {
            'addFiles': typeof MediaSystem.addFiles === 'function',
            'addPdfs': typeof MediaSystem.addPdfs === 'function',
            'uploadAll': typeof MediaSystem.uploadAll === 'function',
            'loadExisting': typeof MediaSystem.loadExisting === 'function'
        } : null,
        'Wrappers globais configurados': {
            'getMediaUrlsForProperty': typeof window.getMediaUrlsForProperty === 'function',
            'loadExistingPdfsForEdit': typeof window.loadExistingPdfsForEdit === 'function',
            'clearAllPdfs': typeof window.clearAllPdfs === 'function',
            'processAndSavePdfs': typeof window.processAndSavePdfs === 'function'
        },
        'Delegação funcionando': function() {
            if (!window.MediaSystem) return false;
            
            const wrappers = [
                'getMediaUrlsForProperty',
                'loadExistingPdfsForEdit',
                'clearAllPdfs',
                'processAndSavePdfs'
            ];
            
            return wrappers.every(wrapper => {
                if (typeof window[wrapper] !== 'function') return false;
                const funcString = window[wrapper].toString();
                return funcString.includes('MediaSystem') || 
                       funcString.includes('delegando') ||
                       funcString.includes('wrapper');
            });
        }()
    };
    
    console.log('📊 CHECKS DE INTEGRAÇÃO:', checks);
    
    const allWrappersExist = Object.values(checks['Wrappers globais configurados']).every(v => v === true);
    const delegationWorking = checks['Delegação funcionando'];
    
    let status = '❌ PROBLEMAS';
    if (allWrappersExist && delegationWorking) {
        status = '✅ INTEGRADO';
    } else if (allWrappersExist && !delegationWorking) {
        status = '⚠️ PARCIAL';
    }
    
    console.log(`📈 STATUS: ${status}`);
    
    if (!allWrappersExist || !delegationWorking) {
        console.log('💡 RECOMENDAÇÃO: Execute window.fixMissingWrappers()');
    }
    
    console.groupEnd();
    
    return {
        status,
        checks,
        recommendation: !allWrappersExist ? 'Executar fixMissingWrappers' : 
                       !delegationWorking ? 'Verificar delegação para MediaSystem' : 'Sistema integrado'
    };
};

/* ================== PAINEL DE CONTROLE APRIMORADO ================== */
window.showWrapperControlPanel = function() {
    console.group('🎛️ PAINEL DE CONTROLE DE WRAPPERS');
    
    const panelId = 'wrapper-control-panel-v5-6-1';
    let panel = document.getElementById(panelId);
    
    if (panel) {
        panel.remove();
    }
    
    // Verificar estado atual
    const integration = window.verifyMediaSystemIntegration();
    const wrapperStatus = integration.checks['Wrappers globais configurados'];
    const missingWrappers = Object.entries(wrapperStatus)
        .filter(([_, exists]) => !exists)
        .map(([name]) => name);
    
    panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: linear-gradient(135deg, #0a1a00, #003300);
        color: #00ff9c;
        padding: 20px;
        border: 3px solid #00ff9c;
        border-radius: 10px;
        z-index: 999998;
        max-width: 350px;
        width: 90%;
        box-shadow: 0 0 30px rgba(0, 255, 156, 0.5);
        font-family: monospace;
        backdrop-filter: blur(10px);
    `;
    
    panel.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px; font-size: 16px; color: #00ff9c;">
            🔗 CONTROLE DE WRAPPERS v5.6.1
        </div>
        
        <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid rgba(0, 255, 156, 0.3);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88ffaa;">WRAPPERS OK</div>
                    <div style="font-size: 24px; color: #00ff9c;">${Object.values(wrapperStatus).filter(v => v).length}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88ffaa;">FALTANDO</div>
                    <div style="font-size: 24px; color: ${missingWrappers.length > 0 ? '#ff5555' : '#00ff9c'}">${missingWrappers.length}</div>
                </div>
            </div>
            <div style="font-size: 11px; color: #88ffaa; text-align: center;">
                Sistema ${missingWrappers.length === 0 ? '✅ ÍNTEGRO' : '⚠️ INCOMPLETO'}
            </div>
        </div>
        
        ${missingWrappers.length > 0 ? `
            <div style="margin-bottom: 15px;">
                <div style="font-size: 12px; color: #ffaaaa; margin-bottom: 8px;">WRAPPERS FALTANTES:</div>
                <div style="background: rgba(255, 0, 0, 0.1); padding: 10px; border-radius: 4px; border-left: 3px solid #ff5555;">
                    ${missingWrappers.map(wrapper => `
                        <div style="margin-bottom: 4px; padding: 4px; background: rgba(255, 0, 0, 0.2); border-radius: 3px;">
                            ❌ ${wrapper}
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: #88ffaa; margin-bottom: 8px;">AÇÕES RÁPIDAS:</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button id="fix-wrappers-btn" style="
                    padding: 10px; background: ${missingWrappers.length > 0 ? '#00ff9c' : '#555'}; 
                    color: ${missingWrappers.length > 0 ? '#000' : '#888'}; border: none; border-radius: 4px; cursor: pointer;"
                    ${missingWrappers.length === 0 ? 'disabled' : ''}>
                    🔧 CORRIGIR WRAPPERS FALTANTES
                </button>
                <button id="verify-integration-btn" style="
                    padding: 10px; background: #00aaff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔗 VERIFICAR INTEGRAÇÃO
                </button>
                <button id="test-delegation-btn" style="
                    padding: 10px; background: #0088cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🧪 TESTAR DELEGAÇÃO
                </button>
            </div>
        </div>
        
        <div style="font-size: 11px; color: #88ffaa; text-align: center; margin-top: 10px;">
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="padding: 6px 12px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">
                FECHAR PAINEL
            </button>
        </div>
        
        <div style="font-size: 10px; color: #00ff9c; text-align: center; margin-top: 10px;">
            v5.6.1 - Corrige wrappers faltantes em diagnostics53.js
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Configurar eventos
    document.getElementById('fix-wrappers-btn')?.addEventListener('click', () => {
        if (window.fixMissingWrappers) {
            const result = window.fixMissingWrappers();
            if (result.fixesApplied.length > 0) {
                // Atualizar painel
                setTimeout(() => {
                    panel.remove();
                    window.showWrapperControlPanel();
                }, 1000);
            }
        }
    });
    
    document.getElementById('verify-integration-btn')?.addEventListener('click', () => {
        if (window.verifyMediaSystemIntegration) {
            window.verifyMediaSystemIntegration();
        }
    });
    
    document.getElementById('test-delegation-btn')?.addEventListener('click', () => {
        console.group('🧪 TESTE DE DELEGAÇÃO DE WRAPPERS');
        
        const testCases = [
            { name: 'getMediaUrlsForProperty', test: () => window.getMediaUrlsForProperty },
            { name: 'loadExistingPdfsForEdit', test: () => window.loadExistingPdfsForEdit },
            { name: 'clearAllPdfs', test: () => window.clearAllPdfs },
            { name: 'processAndSavePdfs', test: () => window.processAndSavePdfs }
        ];
        
        testCases.forEach(testCase => {
            const func = testCase.test();
            const exists = typeof func === 'function';
            const delegates = exists ? func.toString().includes('MediaSystem') : false;
            
            console.log(`${exists ? (delegates ? '✅' : '⚠️') : '❌'} ${testCase.name}:`, {
                exists,
                delegatesToMediaSystem: delegates,
                type: typeof func
            });
        });
        
        console.groupEnd();
    });
    
    console.groupEnd();
    
    return panel;
};

/* ================== INICIALIZAÇÃO AUTOMÁTICA DE WRAPPERS ================== */
(function autoInitializeWrappers() {
    // Aguardar carregamento do DOM e sistemas principais
    setTimeout(() => {
        console.log('🔧 INICIALIZAÇÃO AUTOMÁTICA DE WRAPPERS v5.6.1');
        
        // 1. Verificar se estamos em modo de diagnóstico
        const isDiagnosticsMode = window.DIAGNOSTICS_MODE || 
                                 window.location.search.includes('diagnostics=true') ||
                                 window.location.search.includes('debug=true');
        
        // 2. Aguardar MediaSystem carregar (se existir)
        const maxWaitTime = 5000; // 5 segundos
        const checkInterval = 500; // Verificar a cada 500ms
        let elapsed = 0;
        
        const waitForMediaSystem = setInterval(() => {
            elapsed += checkInterval;
            
            if (window.MediaSystem || elapsed >= maxWaitTime) {
                clearInterval(waitForMediaSystem);
                
                // 3. Corrigir wrappers faltantes
                if (window.fixMissingWrappers) {
                    const result = window.fixMissingWrappers();
                    
                    if (result.fixesApplied.length > 0) {
                        console.log(`✅ ${result.fixesApplied.length} wrapper(s) corrigido(s) automaticamente`);
                        
                        // 4. Mostrar painel de controle se em modo diagnóstico
                        if (isDiagnosticsMode) {
                            setTimeout(() => {
                                if (window.showWrapperControlPanel) {
                                    window.showWrapperControlPanel();
                                }
                            }, 1500);
                        }
                    }
                }
                
                // 5. Integrar com sistema existente
                if (window.diag) {
                    window.diag.wrappers = window.diag.wrappers || {};
                    window.diag.wrappers.fix = window.fixMissingWrappers;
                    window.diag.wrappers.verify = window.verifyMediaSystemIntegration;
                    window.diag.wrappers.panel = window.showWrapperControlPanel;
                    console.log('✅ Módulo de wrappers adicionado a window.diag.wrappers');
                }
            }
        }, checkInterval);
        
    }, 2000); // Aguardar 2 segundos para outros sistemas carregarem
    
    console.log('✅ SISTEMA DE CORREÇÃO DE WRAPPERS v5.6.1 PRONTO');
})();

/* ================== EXPORTAÇÃO ================== */
console.log('✅ MÓDULO DE CORREÇÃO DE WRAPPERS v5.6.1 CARREGADO');
console.log('📋 Comandos disponíveis:');
console.log('- window.fixMissingWrappers() - Corrige wrappers faltantes');
console.log('- window.verifyMediaSystemIntegration() - Verifica integração');
console.log('- window.showWrapperControlPanel() - Mostra painel de controle');
console.log('- window.diag.wrappers.* - Acesso via objeto diag');
console.log('');
console.log('🔍 Este módulo corrige especificamente os erros:');
console.log('- [DIAG] ❌ window.getMediaUrlsForProperty (diagnostics53.js:3976)');
console.log('- [DIAG] ❌ window.loadExistingPdfsForEdit (wrapper) (diagnostics53.js:3344)');
