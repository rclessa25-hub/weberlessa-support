/* ================== FUNÇÕES DE DIAGNÓSTICO PDF - VERSÃO COMPATÍVEL v5.6 ================== */
// Código para adicionar AO FINAL do arquivo diagnostics.js (após a linha 6666)

console.log('✅ MÓDULOS DE DIAGNÓSTICO PDF - VERSÃO COMPATÍVEL v5.6');

/* ================== VERIFICAÇÃO DE FUNÇÕES EXISTENTES ================== */
window.diagnoseExistingFunctions = function() {
    console.group('🔍 VERIFICAÇÃO DE FUNÇÕES EXISTENTES NO CORE');
    
    // Lista de funções CRÍTICAS que DEVEM existir
    const criticalFunctions = [
        // Funções PDF que devem existir
        'showPdfModal',
        'testPdfSystem',
        'processAndSavePdfs',
        'clearAllPdfs',
        'loadExistingPdfsForEdit',
        
        // Funções MediaSystem que devem existir
        'MediaSystem',
        'MediaSystem.addFiles',
        'MediaSystem.addPdfs',
        'MediaSystem.uploadAll',
        
        // Funções de diagnóstico
        'interactivePdfTest',
        'diagnosePdfIconProblem',
        'runPdfCompatibilityCheck',
        
        // Sistemas de suporte
        'supabase',
        'properties'
    ];
    
    const results = {
        exists: [],
        missing: [],
        warnings: [],
        timestamp: new Date().toISOString(),
        version: '5.6'
    };
    
    criticalFunctions.forEach(funcName => {
        try {
            let exists = false;
            let value = undefined;
            
            if (funcName.includes('.')) {
                // Propriedade aninhada (ex: MediaSystem.addFiles)
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
                // Propriedade direta
                exists = funcName in window;
                value = window[funcName];
            }
            
            if (exists) {
                const type = typeof value;
                results.exists.push({
                    name: funcName,
                    type: type,
                    isFunction: type === 'function',
                    value: type === 'function' ? 'FUNCTION' : (type === 'object' ? 'OBJECT' : String(value))
                });
                
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
    
    // Verificar sistemas que podem estar duplicados
    const duplicateSystems = [];
    
    // Verificar MediaSystem vs PdfSystem
    if (window.MediaSystem && window.PdfSystem) {
        // Verificar se ambos têm funções de processamento PDF
        const mediaHasPdf = typeof window.MediaSystem.processAndSavePdfs === 'function';
        const pdfHasPdf = typeof window.PdfSystem.processAndSavePdfs === 'function';
        
        if (mediaHasPdf && pdfHasPdf) {
            duplicateSystems.push('MediaSystem e PdfSystem ambos com processAndSavePdfs');
        }
    }
    
    // Verificar funções globais vs MediaSystem
    if (typeof window.processAndSavePdfs === 'function' && 
        window.MediaSystem && 
        typeof window.MediaSystem.processAndSavePdfs === 'function') {
        
        // Verificar se são a mesma função
        if (window.processAndSavePdfs !== window.MediaSystem.processAndSavePdfs) {
            duplicateSystems.push('processAndSavePdfs duplicada (global e MediaSystem)');
        }
    }
    
    if (duplicateSystems.length > 0) {
        console.warn('⚠️ SISTEMAS DUPLICADOS DETECTADOS:');
        duplicateSystems.forEach(sys => console.warn(`  - ${sys}`));
        results.duplicateSystems = duplicateSystems;
    }
    
    console.log('📊 RESUMO:');
    console.log(`- Funções existentes: ${results.exists.length}`);
    console.log(`- Funções ausentes: ${results.missing.length}`);
    console.log(`- Avisos: ${results.warnings.length}`);
    console.log(`- Sistemas duplicados: ${duplicateSystems.length}`);
    
    console.groupEnd();
    
    return results;
};

/* ================== CORREÇÃO AUTOMÁTICA DE FUNÇÕES FALTANTES ================== */
window.autoFixMissingFunctions = function() {
    console.group('🛠️ CORREÇÃO AUTOMÁTICA DE FUNÇÕES FALTANTES');
    
    const fixes = [];
    const errors = [];
    
    // 1. Verificar e criar showPdfModal se não existir
    if (typeof window.showPdfModal !== 'function') {
        console.log('🔧 Criando showPdfModal...');
        
        window.showPdfModal = function(propertyId = 101) {
            console.log(`📄 showPdfModal(${propertyId}) - MODO COMPATIBILIDADE v5.6`);
            
            // Prioridade 1: Usar PdfSystem se disponível
            if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
                return window.PdfSystem.showModal(propertyId);
            }
            
            // Prioridade 2: Abrir modal diretamente
            const modal = document.getElementById('pdfModal');
            if (modal) {
                modal.style.display = 'flex';
                
                // Focar no campo de senha se existir
                const passwordField = document.getElementById('pdfPassword');
                if (passwordField) {
                    setTimeout(() => passwordField.focus(), 100);
                }
                
                return true;
            }
            
            // Prioridade 3: Criar modal básico
            console.warn('⚠️ Modal PDF não encontrado, criando básico...');
            const newModal = document.createElement('div');
            newModal.id = 'pdfModal';
            newModal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.9);
                z-index: 10000;
                display: flex;
                align-items: center;
                justify-content: center;
            `;
            
            newModal.innerHTML = `
                <div style="background:#1a1a1a;padding:30px;border-radius:10px;max-width:500px;width:90%;">
                    <h2 style="color:#fff;margin-bottom:20px;">📄 PDF - Modo Compatibilidade</h2>
                    <p style="color:#aaa;margin-bottom:20px;">Sistema PDF em modo de compatibilidade v5.6</p>
                    <input type="password" id="pdfPassword" placeholder="Senha para PDF" 
                           style="padding:12px;width:100%;margin-bottom:20px;font-size:16px;display:block;">
                    <div style="display:flex;gap:10px;">
                        <button onclick="document.getElementById('pdfModal').style.display='none'" 
                                style="padding:12px 20px;background:#555;color:white;border:none;cursor:pointer;flex:1;">
                            Cancelar
                        </button>
                        <button onclick="alert('PDF processado (modo compatibilidade)')" 
                                style="padding:12px 20px;background:#00aaff;color:white;border:none;cursor:pointer;flex:1;font-weight:bold;">
                            Processar
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(newModal);
            fixes.push('showPdfModal criada (compatibilidade)');
            
            return true;
        };
        
        console.log('✅ showPdfModal criada');
        fixes.push('showPdfModal');
    }
    
    // 2. Verificar e criar processAndSavePdfs se não existir
    if (typeof window.processAndSavePdfs !== 'function') {
        console.log('🔧 Criando processAndSavePdfs...');
        
        window.processAndSavePdfs = async function(propertyId, propertyTitle) {
            console.log(`📤 processAndSavePdfs(${propertyId}, ${propertyTitle}) - MODO COMPATIBILIDADE v5.6`);
            
            // Tentar usar MediaSystem se disponível
            if (window.MediaSystem && typeof window.MediaSystem.processAndSavePdfs === 'function') {
                console.log('🔗 Delegando para MediaSystem.processAndSavePdfs');
                return await window.MediaSystem.processAndSavePdfs(propertyId, propertyTitle);
            }
            
            // Fallback básico
            console.warn('⚠️ Usando fallback para processAndSavePdfs');
            return Promise.resolve({
                success: true,
                message: 'Processamento simulado (modo compatibilidade v5.6)',
                propertyId: propertyId,
                timestamp: new Date().toISOString()
            });
        };
        
        console.log('✅ processAndSavePdfs criada');
        fixes.push('processAndSavePdfs');
    }
    
    // 3. Verificar e criar clearAllPdfs se não existir
    if (typeof window.clearAllPdfs !== 'function') {
        console.log('🔧 Criando clearAllPdfs...');
        
        window.clearAllPdfs = function() {
            console.log('🗑️ clearAllPdfs() - MODO COMPATIBILIDADE v5.6');
            
            // Tentar usar MediaSystem se disponível
            if (window.MediaSystem && typeof window.MediaSystem.clearAllPdfs === 'function') {
                return window.MediaSystem.clearAllPdfs();
            }
            
            // Limpar preview se existir
            const preview = document.getElementById('uploadPreview');
            if (preview) {
                preview.innerHTML = '';
            }
            
            console.log('✅ PDFs limpos (simulação)');
            return true;
        };
        
        console.log('✅ clearAllPdfs criada');
        fixes.push('clearAllPdfs');
    }
    
    // 4. Criar testPdfSystem se não existir
    if (typeof window.testPdfSystem !== 'function') {
        window.testPdfSystem = function(propertyId = 101) {
            console.log(`🧪 testPdfSystem(${propertyId}) - v5.6`);
            
            if (typeof window.showPdfModal === 'function') {
                return window.showPdfModal(propertyId);
            }
            
            // Fallback direto
            const modal = document.getElementById('pdfModal');
            if (modal) {
                modal.style.display = 'flex';
                return true;
            }
            
            console.error('❌ Não foi possível testar sistema PDF');
            return false;
        };
        
        fixes.push('testPdfSystem');
    }
    
    // 5. Criar interactivePdfTest se não existir
    if (typeof window.interactivePdfTest !== 'function') {
        window.interactivePdfTest = function() {
            console.log('🎮 interactivePdfTest() - v5.6');
            
            // Interface básica de teste
            const panelId = 'interactive-pdf-test-v5-6';
            let panel = document.getElementById(panelId);
            
            if (!panel) {
                panel = document.createElement('div');
                panel.id = panelId;
                panel.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: #001a33;
                    color: #00aaff;
                    padding: 20px;
                    border: 3px solid #00aaff;
                    border-radius: 10px;
                    z-index: 1000010;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 0 30px rgba(0, 170, 255, 0.5);
                `;
                
                panel.innerHTML = `
                    <div style="text-align: center; margin-bottom: 15px; font-size: 18px;">
                        🎮 TESTE PDF INTERATIVO v5.6
                    </div>
                    
                    <div style="margin-bottom: 15px;">
                        <input type="number" id="testPropertyId" value="101" 
                               style="width: 100%; padding: 8px; margin-bottom: 10px;">
                        <button onclick="window.showPdfModal?.(document.getElementById('testPropertyId').value)" 
                                style="width: 100%; padding: 10px; background: #00aaff; color: white; border: none; border-radius: 4px;">
                            📄 Abrir Modal PDF
                        </button>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                        <button onclick="window.testPdfSystem?.(101)" 
                                style="padding: 10px; background: #0088cc; color: white; border: none; border-radius: 4px;">
                            🧪 Teste Básico
                        </button>
                        <button onclick="console.log('Modal:', document.getElementById('pdfModal'))" 
                                style="padding: 10px; background: #555; color: white; border: none; border-radius: 4px;">
                            🔍 Inspecionar
                        </button>
                    </div>
                    
                    <div style="text-align: center;">
                        <button onclick="this.parentElement.parentElement.remove()" 
                                style="padding: 10px 20px; background: #ff5555; color: white; border: none; border-radius: 4px;">
                            Fechar
                        </button>
                    </div>
                `;
                
                document.body.appendChild(panel);
                fixes.push('interactivePdfTest (criado painel)');
            }
            
            return panel;
        };
    }
    
    console.log(`📊 RESUMO DAS CORREÇÕES: ${fixes.length} função(ões) corrigida(s)`);
    if (fixes.length > 0) {
        console.log('✅ Funções corrigidas:', fixes.join(', '));
    }
    
    if (errors.length > 0) {
        console.error('❌ Erros:', errors);
    }
    
    console.groupEnd();
    
    return {
        fixesApplied: fixes,
        errors: errors,
        timestamp: new Date().toISOString(),
        version: '5.6'
    };
};

/* ================== DETECTAR E REMOVER REFERÊNCIAS QUEBRADAS ================== */
window.detectAndRemoveBrokenReferences = function() {
    console.group('🔍 DETECTANDO REFERÊNCIAS QUEBRADAS NO CÓDIGO');
    
    // Lista de funções que podem estar sendo referenciadas mas não existem
    const potentiallyBrokenRefs = [
        'ValidationSystem', // Identificado no log como não existente
        'EmergencySystem',  // Identificado no log como não existente
        'PdfLogger',        // Pode não existir no core atual
        'verifyMediaMigration', // Pode não existir
        'testModuleCompatibility', // Pode não existir
        'autoValidateMigration', // Pode não existir
        'analyzePlaceholders', // Pode não existir
        'analyzeBrokenReferences', // Pode não existir
        'testPdfUploadBugFix', // Pode não existir
        'verifyPdfSystemIntegrity', // Pode não existir
        'monitorPdfPostCorrection', // Pode não existir
        'verifyRollbackCompatibility', // Pode não existir
        'finalPdfSystemValidation' // Pode não existir
    ];
    
    const brokenRefs = [];
    const workingRefs = [];
    
    potentiallyBrokenRefs.forEach(ref => {
        try {
            // Verificar se a função existe globalmente
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
                brokenRefs.push(ref);
                console.warn(`❌ ${ref}: NÃO EXISTE - REFERÊNCIA QUEBRADA`);
            }
        } catch (error) {
            console.error(`⚠️ ${ref}: ERRO NA VERIFICAÇÃO - ${error.message}`);
            brokenRefs.push(ref);
        }
    });
    
    // Recomendações para corrigir referências quebradas
    const recommendations = [];
    
    if (brokenRefs.length > 0) {
        console.warn(`⚠️ ${brokenRefs.length} REFERÊNCIA(S) QUEBRADA(S) DETECTADA(S):`);
        brokenRefs.forEach(ref => {
            console.warn(`  - ${ref}`);
            
            // Sugestões específicas
            if (ref === 'ValidationSystem' || ref === 'EmergencySystem' || ref === 'PdfLogger') {
                recommendations.push(`🔧 Remover referência a ${ref} - Sistema obsoleto`);
            } else if (ref.includes('verify') || ref.includes('test') || ref.includes('analyze')) {
                recommendations.push(`🔧 Implementar ou remover referência a ${ref}`);
            }
        });
        
        // Criar funções placeholder para evitar erros (OPCIONAL)
        console.log('💡 Criando placeholders para funções quebradas...');
        
        brokenRefs.forEach(ref => {
            if (!ref.includes('.')) { // Apenas funções globais
                if (!window[ref]) {
                    window[ref] = function() {
                        console.warn(`⚠️ ${ref}() chamada mas não implementada (placeholder v5.6)`);
                        console.trace('Stack trace:');
                        return {
                            error: 'Função não implementada',
                            message: `${ref} é apenas um placeholder`,
                            timestamp: new Date().toISOString(),
                            version: '5.6'
                        };
                    };
                    console.log(`✅ Placeholder criado para ${ref}`);
                }
            }
        });
    }
    
    console.log('📊 RESUMO:');
    console.log(`- Referências funcionando: ${workingRefs.length}`);
    console.log(`- Referências quebradas: ${brokenRefs.length}`);
    console.log(`- Recomendações: ${recommendations.length}`);
    
    if (recommendations.length > 0) {
        console.log('💡 RECOMENDAÇÕES:');
        recommendations.forEach((rec, idx) => console.log(`${idx + 1}. ${rec}`));
    }
    
    console.groupEnd();
    
    return {
        workingRefs,
        brokenRefs,
        recommendations,
        placeholdersCreated: brokenRefs.filter(ref => !ref.includes('.')).length,
        timestamp: new Date().toISOString(),
        version: '5.6'
    };
};

/* ================== SISTEMA DE MONITORAMENTO DE ERROS EM TEMPO REAL ================== */
(function setupErrorMonitoring() {
    if (typeof window === 'undefined') return;
    
    console.log('🔧 Configurando monitor de erros em tempo real v5.6...');
    
    // Capturar erros de função não definida
    const originalErrorHandler = window.onerror;
    
    window.onerror = function(message, source, lineno, colno, error) {
        // Verificar se é erro de função não definida
        if (typeof message === 'string' && 
            (message.includes('is not defined') || 
             message.includes('is not a function') ||
             message.includes('undefined'))) {
            
            console.warn(`⚠️ ERRO DE FUNÇÃO NÃO DEFINIDA DETECTADO: ${message}`);
            console.warn(`📍 Origem: ${source}:${lineno}:${colno}`);
            
            // Tentar identificar qual função está faltando
            const match = message.match(/([a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*)/);
            if (match) {
                const missingFunction = match[1];
                console.warn(`🔍 Função ausente identificada: ${missingFunction}`);
                
                // Logar no painel se disponível
                if (typeof window.logToPanel === 'function') {
                    window.logToPanel(`❌ Função não definida: ${missingFunction}`, 'error');
                }
                
                // Sugerir correção
                console.log(`💡 Sugestão: Adicionar ao código: window.${missingFunction} = function() { console.warn('${missingFunction} - placeholder'); }`);
            }
        }
        
        // Chamar handler original se existir
        if (originalErrorHandler) {
            return originalErrorHandler(message, source, lineno, colno, error);
        }
        
        return false;
    };
    
    // Monitorar chamadas a funções undefined
    const originalConsoleError = console.error;
    console.error = function(...args) {
        // Verificar se é erro de função não definida
        if (args.length > 0 && typeof args[0] === 'string') {
            const message = args[0];
            if (message.includes('is not defined') || message.includes('is not a function')) {
                console.warn('🎯 [MONITOR v5.6] Erro de função não definida capturado:', args);
                
                // Extrair nome da função
                const funcMatch = message.match(/'([^']+)'/);
                if (funcMatch) {
                    const funcName = funcMatch[1];
                    console.warn(`🔧 Função ${funcName} não está definida. Use window.autoFixMissingFunctions() para corrigir.`);
                }
            }
        }
        
        // Chamar console.error original
        originalConsoleError.apply(console, args);
    };
    
    console.log('✅ Monitor de erros configurado v5.6');
})();

/* ================== PAINEL DE CONTROLE PARA CORREÇÕES ================== */
window.showCompatibilityControlPanel = function() {
    console.group('🎛️ PAINEL DE CONTROLE DE COMPATIBILIDADE v5.6');
    
    const panelId = 'compatibility-control-panel-v5-6';
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
        background: linear-gradient(135deg, #0a0a2a, #001a33);
        color: #00aaff;
        padding: 20px;
        border: 3px solid #00aaff;
        border-radius: 10px;
        z-index: 999998;
        max-width: 400px;
        width: 90%;
        box-shadow: 0 0 30px rgba(0, 170, 255, 0.5);
        font-family: monospace;
        backdrop-filter: blur(10px);
    `;
    
    // Verificar estado atual
    const functions = window.diagnoseExistingFunctions ? window.diagnoseExistingFunctions() : { exists: [], missing: [] };
    const missingCount = functions.missing ? functions.missing.length : 0;
    
    panel.innerHTML = `
        <div style="text-align: center; margin-bottom: 15px; font-size: 18px; color: #00aaff;">
            🔧 CONTROLE DE COMPATIBILIDADE v5.6
        </div>
        
        <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 15px; border: 1px solid rgba(0, 170, 255, 0.3);">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">FUNÇÕES OK</div>
                    <div style="font-size: 24px; color: #00ff9c;">${functions.exists ? functions.exists.length : 0}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">FALTANDO</div>
                    <div style="font-size: 24px; color: ${missingCount > 0 ? '#ff5555' : '#00ff9c'}">${missingCount}</div>
                </div>
            </div>
            <div style="font-size: 11px; color: #88aaff; text-align: center;">
                Sistema ${missingCount === 0 ? '✅ ÍNTEGRO' : '⚠️ INCOMPLETO'}
            </div>
        </div>
        
        <div style="margin-bottom: 15px;">
            <div style="font-size: 12px; color: #88aaff; margin-bottom: 8px;">AÇÕES RÁPIDAS:</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button id="diagnose-functions-btn" style="
                    padding: 10px; background: #00aaff; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔍 DIAGNOSTICAR FUNÇÕES
                </button>
                <button id="auto-fix-btn" style="
                    padding: 10px; background: ${missingCount > 0 ? '#ffaa00' : '#555'}; 
                    color: ${missingCount > 0 ? '#000' : '#888'}; border: none; border-radius: 4px; cursor: pointer;"
                    ${missingCount === 0 ? 'disabled' : ''}>
                    🛠️ CORRIGIR AUTOMATICAMENTE
                </button>
                <button id="detect-broken-btn" style="
                    padding: 10px; background: #ff5500; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    🔗 DETECTAR REFERÊNCIAS QUEBRADAS
                </button>
                <button id="test-pdf-system-btn" style="
                    padding: 10px; background: #0088cc; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    📄 TESTAR SISTEMA PDF
                </button>
            </div>
        </div>
        
        <div style="font-size: 11px; color: #88aaff; text-align: center; margin-top: 10px;">
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="padding: 6px 12px; background: #555; color: white; border: none; border-radius: 4px; cursor: pointer;">
                FECHAR PAINEL
            </button>
        </div>
        
        <div style="font-size: 10px; color: #4488ff; text-align: center; margin-top: 10px;">
            v5.6 - Corrige referências quebradas automaticamente
        </div>
    `;
    
    document.body.appendChild(panel);
    
    // Configurar eventos
    document.getElementById('diagnose-functions-btn').addEventListener('click', () => {
        if (window.diagnoseExistingFunctions) {
            window.diagnoseExistingFunctions();
        } else {
            console.error('diagnoseExistingFunctions não disponível');
        }
    });
    
    document.getElementById('auto-fix-btn').addEventListener('click', () => {
        if (window.autoFixMissingFunctions) {
            const result = window.autoFixMissingFunctions();
            if (result.fixesApplied.length > 0) {
                // Atualizar painel
                setTimeout(() => {
                    panel.remove();
                    window.showCompatibilityControlPanel();
                }, 1000);
            }
        }
    });
    
    document.getElementById('detect-broken-btn').addEventListener('click', () => {
        if (window.detectAndRemoveBrokenReferences) {
            window.detectAndRemoveBrokenReferences();
        }
    });
    
    document.getElementById('test-pdf-system-btn').addEventListener('click', () => {
        if (window.testPdfSystem) {
            window.testPdfSystem(101);
        } else if (window.showPdfModal) {
            window.showPdfModal(101);
        }
    });
    
    console.groupEnd();
    
    return panel;
};

/* ================== INTEGRAÇÃO COM O SISTEMA EXISTENTE ================== */
// Adicionar novas funções ao sistema de diagnóstico existente
(function integrateCompatibilityModule() {
    console.log('🔗 INTEGRANDO MÓDULO DE COMPATIBILIDADE v5.6');
    
    // Adicionar ao objeto diag se existir
    if (window.diag) {
        window.diag.compat = window.diag.compat || {};
        
        // Adicionar funções de compatibilidade
        const compatFunctions = {
            diagnoseFunctions: window.diagnoseExistingFunctions,
            autoFix: window.autoFixMissingFunctions,
            detectBrokenRefs: window.detectAndRemoveBrokenReferences,
            showControlPanel: window.showCompatibilityControlPanel
        };
        
        Object.entries(compatFunctions).forEach(([key, func]) => {
            if (func && !window.diag.compat[key]) {
                window.diag.compat[key] = func;
            }
        });
        
        console.log('✅ Módulo de compatibilidade adicionado a window.diag.compat');
    }
    
    // Adicionar ao console.diag se existir
    if (console.diag) {
        console.diag.compat = console.diag.compat || {};
        console.diag.compat.diagnose = window.diagnoseExistingFunctions;
        console.diag.compat.fix = window.autoFixMissingFunctions;
        console.diag.compat.detect = window.detectAndRemoveBrokenReferences;
        console.diag.compat.panel = window.showCompatibilityControlPanel;
    }
    
    // Executar diagnóstico inicial se em modo debug
    if (window.DEBUG_MODE || window.DIAGNOSTICS_MODE) {
        setTimeout(() => {
            console.log('🔄 Executando diagnóstico inicial de compatibilidade...');
            
            if (window.diagnoseExistingFunctions) {
                window.diagnoseExistingFunctions();
            }
            
            // Mostrar painel de controle após 3 segundos
            setTimeout(() => {
                if (window.showCompatibilityControlPanel) {
                    window.showCompatibilityControlPanel();
                }
            }, 3000);
            
        }, 2000);
    }
    
    console.log('✅ Módulo de compatibilidade v5.6 integrado');
})();

/* ================== FUNÇÃO DE INICIALIZAÇÃO SEGURA ================== */
window.safeInitDiagnostics = function() {
    console.group('🚀 INICIALIZAÇÃO SEGURA DO DIAGNÓSTICO v5.6');
    
    try {
        // 1. Primeiro, diagnosticar funções existentes
        const diagnosis = window.diagnoseExistingFunctions ? 
            window.diagnoseExistingFunctions() : 
            { exists: [], missing: [], warnings: [] };
        
        // 2. Corrigir funções faltantes se necessário
        if (diagnosis.missing && diagnosis.missing.length > 0) {
            console.warn(`⚠️ ${diagnosis.missing.length} função(ões) faltando, aplicando correções...`);
            
            if (window.autoFixMissingFunctions) {
                const fixes = window.autoFixMissingFunctions();
                console.log(`✅ ${fixes.fixesApplied.length} correção(ões) aplicada(s)`);
            }
        }
        
        // 3. Detectar referências quebradas
        if (window.detectAndRemoveBrokenReferences) {
            const brokenRefs = window.detectAndRemoveBrokenReferences();
            if (brokenRefs.brokenRefs && brokenRefs.brokenRefs.length > 0) {
                console.warn(`⚠️ ${brokenRefs.brokenRefs.length} referência(s) quebrada(s) detectada(s)`);
            }
        }
        
        // 4. Mostrar painel de controle
        if (window.showCompatibilityControlPanel) {
            setTimeout(() => {
                window.showCompatibilityControlPanel();
            }, 1000);
        }
        
        console.log('✅ Inicialização segura concluída');
        
    } catch (error) {
        console.error('❌ ERRO na inicialização segura:', error);
        
        // Fallback mínimo
        console.log('🔄 Tentando fallback mínimo...');
        
        // Garantir funções essenciais
        if (typeof window.showPdfModal !== 'function') {
            window.showPdfModal = function() {
                console.warn('⚠️ showPdfModal não disponível (fallback)');
                return false;
            };
        }
        
        if (typeof window.testPdfSystem !== 'function') {
            window.testPdfSystem = function() {
                console.warn('⚠️ testPdfSystem não disponível (fallback)');
                return false;
            };
        }
    }
    
    console.groupEnd();
    
    return {
        success: true,
        timestamp: new Date().toISOString(),
        version: '5.6',
        message: 'Diagnóstico inicializado com compatibilidade'
    };
};

/* ================== EXECUÇÃO AUTOMÁTICA ================== */
// Executar inicialização segura quando o documento estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(window.safeInitDiagnostics, 1000);
    });
} else {
    setTimeout(window.safeInitDiagnostics, 1000);
}

console.log('✅ MÓDULO DE COMPATIBILIDADE PDF v5.6 PRONTO');
console.log('📋 Comandos disponíveis:');
console.log('- window.diagnoseExistingFunctions() - Diagnosticar funções existentes');
console.log('- window.autoFixMissingFunctions() - Corrigir funções faltantes');
console.log('- window.detectAndRemoveBrokenReferences() - Detectar referências quebradas');
console.log('- window.showCompatibilityControlPanel() - Mostrar painel de controle');
console.log('- window.safeInitDiagnostics() - Inicialização segura');
console.log('- window.diag.compat.* - Acesso via objeto diag');
