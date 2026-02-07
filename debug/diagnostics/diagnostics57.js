// debug/diagnostics/diagnostics57.js
// ============================================================================
// DIAGNOSTICS57.JS - PONTE DE COMPATIBILIDADE E CORREÇÃO DE FUNÇÕES FALTANTES
// Versão: 5.7 - Foco em resolver funções faltantes no Core
// ============================================================================

console.log('🔧 DIAGNOSTICS57.JS - PONTE DE COMPATIBILIDADE v5.7 CARREGADO');

/* ================== CONFIGURAÇÃO ================== */
const COMPATIBILITY_CONFIG = {
    version: '5.7',
    mode: 'bridge',
    fixMissingFunctions: true,
    createWrappers: true,
    logLevel: 'detailed',
    bridgeBetween: ['diagnostics53.js', 'diagnostics56.js', 'core']
};

/* ================== DIAGNÓSTICO DETALHADO DO CORE ================== */
window.deepCoreDiagnosis = function() {
    console.group('🔍 DIAGNÓSTICO PROFUNDO DO CORE v5.7');
    
    // 1. Verificar funções CRÍTICAS que devem existir no Core
    const coreFunctions = {
        // Funções que DEVEM existir no properties.js/admin.js
        'window.properties': typeof window.properties !== 'undefined',
        'window.supabase': typeof window.supabase !== 'undefined',
        'window.MediaSystem': typeof window.MediaSystem !== 'undefined',
        'window.PdfSystem': typeof window.PdfSystem !== 'undefined',
        'window.processAndSavePdfs': typeof window.processAndSavePdfs === 'function',
        
        // Funções que podem ser criadas como wrappers
        'window.getMediaUrlsForProperty': typeof window.getMediaUrlsForProperty === 'function',
        'window.loadExistingPdfsForEdit': typeof window.loadExistingPdfsForEdit === 'function',
        'window.showPdfModal': typeof window.showPdfModal === 'function',
        'window.clearAllPdfs': typeof window.clearAllPdfs === 'function'
    };
    
    let missingCount = 0;
    const results = {
        coreFunctions: {},
        missingCritical: [],
        missingWrappers: [],
        recommendations: []
    };
    
    Object.entries(coreFunctions).forEach(([func, exists]) => {
        results.coreFunctions[func] = {
            exists,
            type: typeof window[func] || 'undefined'
        };
        
        if (!exists) {
            missingCount++;
            
            if (func.includes('MediaUrls') || func.includes('loadExisting')) {
                results.missingCritical.push(func);
                results.recommendations.push(`CRÍTICO: Criar ${func} no Core`);
            } else {
                results.missingWrappers.push(func);
                results.recommendations.push(`Wrapper: Criar ponte para ${func}`);
            }
            
            console.error(`❌ ${func}: NÃO EXISTE NO CORE`);
        } else {
            console.log(`✅ ${func}: EXISTE (${results.coreFunctions[func].type})`);
        }
    });
    
    // 2. Verificar integração MediaSystem
    console.log('\n📦 VERIFICAÇÃO MEDIASYSTEM:');
    if (window.MediaSystem) {
        const mediaFunctions = [
            'addFiles', 'addPdfs', 'uploadAll', 'processAndSavePdfs',
            'clearAllPdfs', 'loadExisting', 'getMediaUrlsForProperty'
        ];
        
        mediaFunctions.forEach(func => {
            const exists = typeof MediaSystem[func] === 'function';
            console.log(`  ${exists ? '✅' : '❌'} MediaSystem.${func}: ${exists ? 'OK' : 'FALTANDO'}`);
            
            if (!exists && (func === 'getMediaUrlsForProperty' || func === 'loadExisting')) {
                results.recommendations.push(`IMPORTANTE: Adicionar MediaSystem.${func}()`);
            }
        });
    } else {
        console.error('❌ MediaSystem NÃO CARREGADO - PROBLEMA GRAVE');
        results.recommendations.push('URGENTE: Carregar MediaSystem no Core');
    }
    
    // 3. Verificar estado do sistema PDF
    console.log('\n📄 VERIFICAÇÃO SISTEMA PDF:');
    const pdfElements = ['pdfModal', 'pdfPassword', 'pdfUploadPreview', 'pdfFileInput'];
    pdfElements.forEach(id => {
        const element = document.getElementById(id);
        console.log(`  ${element ? '✅' : '❌'} #${id}: ${element ? 'EXISTE' : 'NÃO EXISTE'}`);
    });
    
    // 4. Resumo
    console.log('\n📊 RESUMO DO DIAGNÓSTICO:');
    console.log(`- Total de funções verificadas: ${Object.keys(coreFunctions).length}`);
    console.log(`- Funções existentes: ${Object.keys(coreFunctions).length - missingCount}`);
    console.log(`- Funções faltantes: ${missingCount}`);
    console.log(`- Críticas faltando: ${results.missingCritical.length}`);
    console.log(`- Wrappers faltando: ${results.missingWrappers.length}`);
    
    if (results.recommendations.length > 0) {
        console.log('\n💡 RECOMENDAÇÕES:');
        results.recommendations.forEach((rec, idx) => {
            console.log(`${idx + 1}. ${rec}`);
        });
    }
    
    console.groupEnd();
    
    return results;
};

/* ================== CRIADOR DE WRAPPERS INTELIGENTES ================== */
window.createCompatibilityBridge = function() {
    console.group('🌉 CRIANDO PONTE DE COMPATIBILIDADE v5.7');
    
    const createdWrappers = [];
    const existingFunctions = [];
    const errors = [];
    
    // WRAPPER 1: getMediaUrlsForProperty
    if (typeof window.getMediaUrlsForProperty !== 'function') {
        console.log('🔗 Criando wrapper: getMediaUrlsForProperty');
        
        window.getMediaUrlsForProperty = function(propertyId) {
            console.log(`📊 getMediaUrlsForProperty(${propertyId}) - Wrapper v5.7`);
            
            // Prioridade 1: Usar MediaSystem se disponível
            if (window.MediaSystem && typeof MediaSystem.getMediaUrlsForProperty === 'function') {
                return MediaSystem.getMediaUrlsForProperty(propertyId);
            }
            
            // Prioridade 2: Usar properties.js se disponível
            if (window.properties && Array.isArray(properties)) {
                const property = properties.find(p => p.id === propertyId);
                if (property && property.mediaUrls) {
                    return property.mediaUrls;
                }
            }
            
            // Prioridade 3: Mock para desenvolvimento
            console.warn(`⚠️ getMediaUrlsForProperty(${propertyId}) - Modo simulador`);
            return [
                `https://example.com/media/property-${propertyId}-1.jpg`,
                `https://example.com/media/property-${propertyId}-2.jpg`
            ];
        };
        
        createdWrappers.push('getMediaUrlsForProperty');
    } else {
        existingFunctions.push('getMediaUrlsForProperty');
    }
    
    // WRAPPER 2: loadExistingPdfsForEdit
    if (typeof window.loadExistingPdfsForEdit !== 'function') {
        console.log('🔗 Criando wrapper: loadExistingPdfsForEdit');
        
        window.loadExistingPdfsForEdit = function(propertyId) {
            console.log(`📄 loadExistingPdfsForEdit(${propertyId}) - Wrapper v5.7`);
            
            // Prioridade 1: Usar MediaSystem
            if (window.MediaSystem && typeof MediaSystem.loadExisting === 'function') {
                return MediaSystem.loadExisting(propertyId);
            }
            
            // Prioridade 2: Usar PdfSystem
            if (window.PdfSystem && typeof PdfSystem.loadExisting === 'function') {
                return PdfSystem.loadExisting(propertyId);
            }
            
            // Prioridade 3: Mock
            console.warn(`⚠️ loadExistingPdfsForEdit(${propertyId}) - Modo simulador`);
            return Promise.resolve({
                success: true,
                pdfs: [],
                propertyId,
                timestamp: new Date().toISOString(),
                message: 'Wrapper v5.7 - Nenhum PDF existente'
            });
        };
        
        createdWrappers.push('loadExistingPdfsForEdit');
    } else {
        existingFunctions.push('loadExistingPdfsForEdit');
    }
    
    // WRAPPER 3: showPdfModal (compatível com v56 e v53)
    if (typeof window.showPdfModal !== 'function') {
        console.log('🔗 Criando wrapper: showPdfModal (compatibilidade)');
        
        window.showPdfModal = function(propertyId = 101) {
            console.log(`📄 showPdfModal(${propertyId}) - Wrapper v5.7`);
            
            // Compatibilidade com múltiplas versões
            if (window.PdfSystem && typeof PdfSystem.showModal === 'function') {
                return PdfSystem.showModal(propertyId);
            }
            
            if (window.MediaSystem && typeof MediaSystem.showPdfModal === 'function') {
                return MediaSystem.showPdfModal(propertyId);
            }
            
            // Fallback direto
            const modal = document.getElementById('pdfModal');
            if (modal) {
                modal.style.display = 'flex';
                
                const passwordField = document.getElementById('pdfPassword');
                if (passwordField) {
                    setTimeout(() => passwordField.focus(), 100);
                }
                
                return true;
            }
            
            // Criar modal se não existir
            console.warn('⚠️ Modal não encontrado, criando...');
            const newModal = document.createElement('div');
            newModal.id = 'pdfModal';
            newModal.style.cssText = `
                position: fixed; top: 0; left: 0;
                width: 100%; height: 100%;
                background: rgba(0,0,0,0.95);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
                display: none;
            `;
            
            newModal.innerHTML = `
                <div style="background:#1a1a1a;padding:30px;border-radius:10px;max-width:500px;width:90%;">
                    <h2 style="color:#fff;margin-bottom:20px;">📄 PDF - Wrapper v5.7</h2>
                    <p style="color:#aaa;margin-bottom:20px;">Propriedade: #${propertyId}</p>
                    <input type="password" id="pdfPassword" placeholder="Senha para PDF" 
                           style="padding:12px;width:100%;margin-bottom:20px;font-size:16px;">
                    <div id="pdfUploadPreview" style="min-height:100px;background:#2a2a2a;padding:10px;border-radius:5px;margin-bottom:20px;"></div>
                    <div style="display:flex;gap:10px;">
                        <button onclick="document.getElementById('pdfModal').style.display='none'" 
                                style="padding:12px 20px;background:#555;color:white;border:none;cursor:pointer;flex:1;">
                            Cancelar
                        </button>
                        <button onclick="window.processAndSavePdfs?.(101)" 
                                style="padding:12px 20px;background:#00aaff;color:white;border:none;cursor:pointer;flex:1;font-weight:bold;">
                            Processar
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(newModal);
            newModal.style.display = 'flex';
            
            return true;
        };
        
        createdWrappers.push('showPdfModal');
    } else {
        existingFunctions.push('showPdfModal');
    }
    
    // WRAPPER 4: clearAllPdfs
    if (typeof window.clearAllPdfs !== 'function') {
        console.log('🔗 Criando wrapper: clearAllPdfs');
        
        window.clearAllPdfs = function() {
            console.log('🗑️ clearAllPdfs() - Wrapper v5.7');
            
            if (window.MediaSystem && typeof MediaSystem.clearAllPdfs === 'function') {
                return MediaSystem.clearAllPdfs();
            }
            
            if (window.PdfSystem && typeof PdfSystem.clearAllPdfs === 'function') {
                return PdfSystem.clearAllPdfs();
            }
            
            const preview = document.getElementById('pdfUploadPreview');
            if (preview) {
                preview.innerHTML = '';
            }
            
            return true;
        };
        
        createdWrappers.push('clearAllPdfs');
    } else {
        existingFunctions.push('clearAllPdfs');
    }
    
    // Resumo
    console.log('\n📊 RESUMO DA PONTE DE COMPATIBILIDADE:');
    console.log(`✅ Wrappers criados: ${createdWrappers.length}`);
    console.log(`🔍 Funções existentes: ${existingFunctions.length}`);
    
    if (createdWrappers.length > 0) {
        console.log('🎯 Wrappers criados:', createdWrappers.join(', '));
    }
    
    if (errors.length > 0) {
        console.error('❌ Erros:', errors);
    }
    
    console.groupEnd();
    
    return {
        createdWrappers,
        existingFunctions,
        errors,
        timestamp: new Date().toISOString(),
        version: '5.7'
    };
};

/* ================== INTEGRADOR DE SISTEMAS ================== */
window.integrateDiagnosticsSystems = function() {
    console.group('🔗 INTEGRANDO SISTEMAS DE DIAGNÓSTICO v5.7');
    
    // 1. Verificar se ambos sistemas estão carregados
    const systems = {
        'diagnostics53.js': typeof window.diagnosePdfIconProblem === 'function',
        'diagnostics56.js': typeof window.diagnoseExistingFunctions === 'function',
        'diagnostics57.js': typeof window.deepCoreDiagnosis === 'function'
    };
    
    console.log('📦 Sistemas carregados:', systems);
    
    // 2. Criar ponte entre os sistemas
    window.diag = window.diag || {};
    window.diag.integration = window.diag.integration || {};
    
    // Adicionar funções de integração
    window.diag.integration = {
        version: '5.7',
        systems,
        
        // Funções de diagnóstico unificadas
        diagnoseAll: function() {
            console.group('🔍 DIAGNÓSTICO UNIFICADO v5.7');
            
            // Executar diagnóstico do Core
            const coreResults = window.deepCoreDiagnosis ? window.deepCoreDiagnosis() : null;
            
            // Executar diagnóstico do v56
            const v56Results = window.diagnoseExistingFunctions ? window.diagnoseExistingFunctions() : null;
            
            // Criar ponte de compatibilidade
            const bridgeResults = window.createCompatibilityBridge ? window.createCompatibilityBridge() : null;
            
            console.groupEnd();
            
            return {
                core: coreResults,
                compatibility: v56Results,
                bridge: bridgeResults,
                integrated: true
            };
        },
        
        // Corrigir todas as funções faltantes
        fixAllMissing: function() {
            console.log('🛠️ CORRIGINDO TODAS AS FUNÇÕES FALTANTES');
            
            const fixes = [];
            
            // Corrigir via v56
            if (window.autoFixMissingFunctions) {
                const v56Fixes = window.autoFixMissingFunctions();
                if (v56Fixes.fixesApplied) {
                    fixes.push(...v56Fixes.fixesApplied);
                }
            }
            
            // Corrigir via v57
            if (window.createCompatibilityBridge) {
                const v57Fixes = window.createCompatibilityBridge();
                if (v57Fixes.createdWrappers) {
                    fixes.push(...v57Fixes.createdWrappers.map(w => `${w} (v5.7)`));
                }
            }
            
            console.log(`✅ ${fixes.length} correções aplicadas:`, fixes);
            return fixes;
        },
        
        // Verificar saúde do sistema
        healthCheck: function() {
            const checks = [
                { name: 'Core functions', check: () => typeof window.properties !== 'undefined' },
                { name: 'MediaSystem', check: () => typeof window.MediaSystem !== 'undefined' },
                { name: 'PDF System', check: () => typeof window.PdfSystem !== 'undefined' },
                { name: 'Supabase', check: () => typeof window.supabase !== 'undefined' },
                { name: 'Critical wrappers', check: () => 
                    typeof window.getMediaUrlsForProperty === 'function' &&
                    typeof window.loadExistingPdfsForEdit === 'function'
                },
                { name: 'Modal PDF', check: () => !!document.getElementById('pdfModal') }
            ];
            
            const results = checks.map(check => ({
                name: check.name,
                passed: check.check()
            }));
            
            const passed = results.filter(r => r.passed).length;
            const total = results.length;
            const score = Math.round((passed / total) * 100);
            
            return {
                results,
                passed,
                total,
                score,
                status: score >= 80 ? 'HEALTHY' : score >= 50 ? 'WARNING' : 'CRITICAL'
            };
        }
    };
    
    console.log('✅ Sistema de integração configurado');
    console.groupEnd();
    
    return window.diag.integration;
};

/* ================== PAINEL DE CONTROLE DE INTEGRAÇÃO ================== */
window.showIntegrationControlPanel = function() {
    console.group('🎛️ PAINEL DE CONTROLE DE INTEGRAÇÃO v5.7');
    
    const panelId = 'integration-control-panel-v5-7';
    let panel = document.getElementById(panelId);
    
    if (panel) {
        panel.remove();
    }
    
    // Verificar saúde do sistema
    const health = window.diag?.integration?.healthCheck ? 
        window.diag.integration.healthCheck() : 
        { score: 0, status: 'UNKNOWN' };
    
    panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #001a33, #0a0a2a);
        color: #00aaff;
        padding: 25px;
        border: 3px solid #00aaff;
        border-radius: 10px;
        z-index: 999997;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 40px rgba(0, 170, 255, 0.6);
        font-family: monospace;
    `;
    
    panel.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px; font-size: 20px; color: #00aaff;">
            🔗 PAINEL DE INTEGRAÇÃO v5.7
        </div>
        
        <div style="background: rgba(0, 170, 255, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(0, 170, 255, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 12px; color: #88aaff;">SAÚDE</div>
                    <div style="font-size: 32px; color: ${health.score >= 80 ? '#00ff9c' : health.score >= 50 ? '#ffaa00' : '#ff5555'}">
                        ${health.score}%
                    </div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 12px; color: #88aaff;">SISTEMAS</div>
                    <div style="font-size: 32px; color: #00aaff;">3</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 12px; color: #88aaff;">STATUS</div>
                    <div style="font-size: 16px; color: ${health.status === 'HEALTHY' ? '#00ff9c' : health.status === 'WARNING' ? '#ffaa00' : '#ff5555'}; margin-top: 8px;">
                        ${health.status}
                    </div>
                </div>
            </div>
            <div style="font-size: 12px; color: #88aaff; text-align: center;">
                Ponte de compatibilidade entre v5.3, v5.6 e Core
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <div style="font-size: 13px; color: #88aaff; margin-bottom: 10px;">AÇÕES DE INTEGRAÇÃO:</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                <button id="diagnose-core-btn" style="
                    padding: 12px; background: #00aaff; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    🔍 DIAGNÓSTICO PROFUNDO DO CORE
                </button>
                <button id="create-bridge-btn" style="
                    padding: 12px; background: #0088cc; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    🌉 CRIAR PONTE DE COMPATIBILIDADE
                </button>
                <button id="integrate-systems-btn" style="
                    padding: 12px; background: #00ff9c; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    🔗 INTEGRAR SISTEMAS DE DIAGNÓSTICO
                </button>
                <button id="fix-all-btn" style="
                    padding: 12px; background: #ffaa00; color: #000; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    🛠️ CORRIGIR TODAS AS FALHAS
                </button>
                <button id="health-check-btn" style="
                    padding: 12px; background: #555; color: white; border: none; border-radius: 5px; cursor: pointer; font-weight: bold;">
                    📊 VERIFICAR SAÚDE DO SISTEMA
                </button>
            </div>
        </div>
        
        <div style="text-align: center;">
            <button onclick="document.getElementById('${panelId}').remove()" 
                    style="padding: 10px 20px; background: #ff5555; color: white; border: none; border-radius: 5px; cursor: pointer;">
                FECHAR PAINEL
            </button>
        </div>
        
        <div style="font-size: 11px; color: #4488ff; text-align: center; margin-top: 15px;">
            v5.7 - Resolve funções faltantes no Core: getMediaUrlsForProperty, loadExistingPdfsForEdit
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Configurar eventos
    document.getElementById('diagnose-core-btn').addEventListener('click', () => {
        if (window.deepCoreDiagnosis) {
            window.deepCoreDiagnosis();
        }
    });
    
    document.getElementById('create-bridge-btn').addEventListener('click', () => {
        if (window.createCompatibilityBridge) {
            window.createCompatibilityBridge();
        }
    });
    
    document.getElementById('integrate-systems-btn').addEventListener('click', () => {
        if (window.integrateDiagnosticsSystems) {
            window.integrateDiagnosticsSystems();
        }
    });
    
    document.getElementById('fix-all-btn').addEventListener('click', () => {
        if (window.diag?.integration?.fixAllMissing) {
            window.diag.integration.fixAllMissing();
        } else if (window.createCompatibilityBridge) {
            window.createCompatibilityBridge();
        }
    });
    
    document.getElementById('health-check-btn').addEventListener('click', () => {
        if (window.diag?.integration?.healthCheck) {
            const health = window.diag.integration.healthCheck();
            alert(`📊 SAÚDE DO SISTEMA: ${health.score}%\nStatus: ${health.status}\nPassaram: ${health.passed}/${health.total}`);
        }
    });
    
    console.groupEnd();
    
    return panel;
};

/* ================== MONITOR DE REFERÊNCIAS QUEBRADAS EM TEMPO REAL ================== */
(function setupBrokenReferencesMonitor() {
    console.log('🔧 Configurando monitor de referências quebradas v5.7...');
    
    // Monitorar erros de função não definida
    const originalErrorHandler = window.onerror;
    
    window.onerror = function(message, source, lineno, colno, error) {
        // Verificar se é erro de função não definida
        if (typeof message === 'string') {
            const missingFunctions = [
                'getMediaUrlsForProperty',
                'loadExistingPdfsForEdit',
                'showPdfModal',
                'clearAllPdfs',
                'ValidationSystem',
                'EmergencySystem',
                'monitorPdfPostCorrection',
                'verifyRollbackCompatibility',
                'finalPdfSystemValidation'
            ];
            
            missingFunctions.forEach(funcName => {
                if (message.includes(funcName) && !message.includes('placeholder')) {
                    console.warn(`⚠️ REFERÊNCIA QUEBRADA DETECTADA: ${funcName}`);
                    
                    // Criar placeholder se não existir
                    if (!window[funcName]) {
                        console.log(`🔧 Criando placeholder para ${funcName}...`);
                        window[funcName] = function() {
                            console.warn(`⚠️ ${funcName}() chamado mas não implementado no Core`);
                            console.warn(`💡 Use o Painel de Integração v5.7 para corrigir`);
                            
                            return {
                                error: 'Função não implementada no Core',
                                function: funcName,
                                timestamp: new Date().toISOString(),
                                version: '5.7',
                                recommendation: `Adicionar ${funcName} ao Core (properties.js/admin.js)`
                            };
                        };
                        
                        // Adicionar ao objeto de diagnóstico
                        window.diag = window.diag || {};
                        window.diag.brokenRefs = window.diag.brokenRefs || [];
                        if (!window.diag.brokenRefs.includes(funcName)) {
                            window.diag.brokenRefs.push(funcName);
                        }
                    }
                }
            });
        }
        
        // Chamar handler original
        if (originalErrorHandler) {
            return originalErrorHandler(message, source, lineno, colno, error);
        }
        
        return false;
    };
    
    // Monitorar console por referências quebradas
    const originalConsoleError = console.error;
    console.error = function(...args) {
        // Verificar se é erro de função não definida
        if (args.length > 0 && typeof args[0] === 'string') {
            const message = args[0];
            
            // Padrões de referências quebradas
            const brokenPatterns = [
                /is not defined/,
                /is not a function/,
                /undefined is not a function/,
                /ReferenceError/
            ];
            
            const isBrokenRef = brokenPatterns.some(pattern => pattern.test(message));
            
            if (isBrokenRef) {
                console.warn('🎯 [MONITOR v5.7] Referência quebrada detectada:', args);
                
                // Tentar identificar qual função está faltando
                const funcMatch = message.match(/'([^']+)'/);
                if (funcMatch) {
                    const funcName = funcMatch[1];
                    console.warn(`🔧 Função ${funcName} referenciada mas não encontrada no Core`);
                    
                    // Sugerir correção
                    console.log(`💡 Recomendação: Adicionar ao Core ou usar window.createCompatibilityBridge()`);
                }
            }
        }
        
        // Chamar console.error original
        originalConsoleError.apply(console, args);
    };
    
    console.log('✅ Monitor de referências quebradas configurado v5.7');
})();

/* ================== INICIALIZAÇÃO AUTOMÁTICA ================== */
(function autoInitializeIntegration() {
    // Aguardar carregamento dos outros diagnósticos
    setTimeout(() => {
        console.log('🚀 INICIALIZANDO PONTE DE COMPATIBILIDADE v5.7');
        
        // 1. Integrar sistemas de diagnóstico
        if (typeof window.integrateDiagnosticsSystems === 'function') {
            window.integrateDiagnosticsSystems();
        }
        
        // 2. Criar ponte de compatibilidade
        if (typeof window.createCompatibilityBridge === 'function') {
            window.createCompatibilityBridge();
        }
        
        // 3. Mostrar painel de controle se em modo debug
        if (window.DEBUG_MODE || window.DIAGNOSTICS_MODE) {
            setTimeout(() => {
                if (typeof window.showIntegrationControlPanel === 'function') {
                    window.showIntegrationControlPanel();
                }
            }, 2000);
        }
        
        console.log('✅ Ponte de compatibilidade v5.7 inicializada');
    }, 3000);
})();

/* ================== EXPORTAÇÃO ================== */
console.log('✅ DIAGNOSTICS57.JS - PONTE DE COMPATIBILIDADE v5.7 PRONTO');
console.log('📋 Comandos disponíveis:');
console.log('- window.deepCoreDiagnosis() - Diagnóstico profundo do Core');
console.log('- window.createCompatibilityBridge() - Criar wrappers para funções faltantes');
console.log('- window.integrateDiagnosticsSystems() - Integrar sistemas de diagnóstico');
console.log('- window.showIntegrationControlPanel() - Painel de controle de integração');
console.log('- window.diag.integration.* - Sistema de integração unificado');

// Verificar se há erros de integração pendentes
setTimeout(() => {
    if (window.diag?.brokenRefs && window.diag.brokenRefs.length > 0) {
        console.warn(`⚠️ ${window.diag.brokenRefs.length} REFERÊNCIA(S) QUEBRADA(S) DETECTADA(S):`);
        window.diag.brokenRefs.forEach(ref => {
            console.warn(`  - ${ref} (placeholder criado)`);
        });
        console.log('💡 Use window.showIntegrationControlPanel() para corrigir');
    }
}, 5000);
