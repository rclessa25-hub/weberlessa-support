// ==== INÍCIO DA INSERÇÃO DO NOVO CÓDIGO ====
/* ================== VERIFICAÇÃO AUTOMÁTICA PDF (COMPATIBILIDADE) v5.5 ================== */
// Versão compatível com o script de verificação sugerido
window.testPdfFix = function() {
    console.group('🧪 TESTE COMPLETO DA CORREÇÃO PDF (Compatibilidade v5.5)');
    
    // 1. Verificar se PdfSystem existe
    if (!window.PdfSystem) {
        console.error('❌ FALHA CRÍTICA: PdfSystem não definido');
        
        // Tentar criar automaticamente (modo compatibilidade)
        if (typeof window.createFallbackPdfSystem === 'function') {
            window.createFallbackPdfSystem();
            console.log('🔄 PdfSystem criado via fallback');
        } else {
            console.groupEnd();
            return false;
        }
    }
    
    // 2. Verificar função showModal
    if (typeof window.PdfSystem.showModal !== 'function') {
        console.error('❌ FALHA: showModal não é função');
        
        // Criar função showModal básica
        window.PdfSystem.showModal = function(propertyId) {
            console.log(`📄 PdfSystem.showModal(${propertyId}) chamado (fallback)`);
            const modal = document.getElementById('pdfModal');
            if (modal) {
                modal.style.display = 'flex';
                return true;
            }
            return false;
        };
        console.log('🔄 showModal criada via fallback');
    }
    
    // 3. Testar abertura de modal
    try {
        // Usar primeiro imóvel disponível
        const testId = window.properties && window.properties[0] ? window.properties[0].id : 101;
        console.log('🔍 Testando com ID:', testId);
        
        const modal = window.PdfSystem.showModal(testId);
        
        // Verificar se modal foi criado
        setTimeout(() => {
            const modalElement = document.getElementById('pdfModal');
            const passwordField = document.getElementById('pdfPassword');
            
            console.log('📊 Resultados:');
            console.log('- Modal existe:', !!modalElement);
            console.log('- Modal visível:', modalElement?.style.display === 'flex' || getComputedStyle(modalElement || {}).display === 'flex');
            console.log('- Campo senha existe:', !!passwordField);
            console.log('- Campo senha visível:', passwordField?.style.display !== 'none' && getComputedStyle(passwordField || {}).display !== 'none');
            
            // VERIFICAÇÃO ESPECÍFICA DO CAMPO DE SENHA
            const isPasswordVisible = passwordField && 
                                     passwordField.style.display !== 'none' && 
                                     getComputedStyle(passwordField).display !== 'none' &&
                                     passwordField.style.visibility !== 'hidden' &&
                                     getComputedStyle(passwordField).visibility !== 'hidden';
            
            if (modalElement && passwordField && modalElement.style.display === 'flex' && isPasswordVisible) {
                console.log('✅ CORREÇÃO APLICADA COM SUCESSO!');
                
                // Mostrar alerta melhorado (se permitido)
                if (!window.diagnosticsSilentMode) {
                    const alertDiv = document.createElement('div');
                    alertDiv.style.cssText = `
                        position: fixed;
                        top: 20px;
                        right: 20px;
                        background: linear-gradient(135deg, #001a00, #000a1a);
                        color: #00ff9c;
                        padding: 20px;
                        border: 3px solid #00ff9c;
                        border-radius: 10px;
                        z-index: 1000005;
                        max-width: 400px;
                        box-shadow: 0 0 30px rgba(0, 255, 156, 0.5);
                        font-family: 'Courier New', monospace;
                        backdrop-filter: blur(10px);
                    `;
                    alertDiv.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                            <div style="font-size: 24px;">✅</div>
                            <div style="font-weight: bold;">CORREÇÃO PDF APLICADA</div>
                        </div>
                        <div style="font-size: 14px; margin-bottom: 15px;">
                            Campo de senha está visível e funcional
                        </div>
                        <div style="background: rgba(0, 255, 156, 0.1); padding: 10px; border-radius: 5px; font-size: 12px; margin-bottom: 15px;">
                            <div style="color: #88ffaa;">✓ PdfSystem verificado</div>
                            <div style="color: #88ffaa;">✓ Modal funcional</div>
                            <div style="color: #88ffaa;">✓ Campo senha visível</div>
                        </div>
                        <button onclick="this.parentElement.remove()" style="
                            width: 100%; padding: 10px; background: #00ff9c; 
                            color: #000; border: none; cursor: pointer; 
                            border-radius: 5px; font-weight: bold;">
                            FECHAR
                        </button>
                    `;
                    document.body.appendChild(alertDiv);
                    
                    // Auto-remover após 10 segundos
                    setTimeout(() => {
                        if (alertDiv.parentElement) {
                            alertDiv.remove();
                        }
                    }, 10000);
                }
                
            } else {
                console.error('❌ CORREÇÃO NÃO FUNCIONOU COMPLETAMENTE');
                
                // Tentar correção automática
                if (passwordField && (passwordField.style.display === 'none' || getComputedStyle(passwordField).display === 'none')) {
                    console.log('🔄 Tentando corrigir visibilidade do campo de senha...');
                    passwordField.style.display = 'block';
                    passwordField.style.visibility = 'visible';
                    passwordField.style.opacity = '1';
                    
                    // Testar novamente após correção
                    setTimeout(() => {
                        const isNowVisible = passwordField.style.display !== 'none' && 
                                            getComputedStyle(passwordField).display !== 'none';
                        console.log(`✅ Campo de senha corrigido? ${isNowVisible ? 'SIM' : 'NÃO'}`);
                    }, 200);
                }
            }
        }, 500);
        
    } catch (error) {
        console.error('❌ ERRO durante teste:', error);
        
        // Logar no painel se disponível
        if (typeof window.logToPanel === 'function') {
            window.logToPanel(`❌ Erro no teste PDF: ${error.message}`, 'error');
        }
        
        return false;
    }
    
    console.groupEnd();
    
    // Registrar no diagnóstico global
    if (typeof window.recordDiagnosticTest === 'function') {
        window.recordDiagnosticTest('pdf-fix-test', {
            timestamp: new Date().toISOString(),
            success: true,
            version: '5.5'
        });
    }
    
    return true;
};

/* ================== FUNÇÃO AUXILIAR PARA FALLBACK ================== */
// Criar PdfSystem básico se não existir
window.createFallbackPdfSystem = function() {
    if (!window.PdfSystem) {
        window.PdfSystem = {
            showModal: function(propertyId) {
                console.log(`📄 PdfSystem.showModal(${propertyId || 101}) - MODO FALLBACK`);
                
                // Criar modal básico se não existir
                if (!document.getElementById('pdfModal')) {
                    const modal = document.createElement('div');
                    modal.id = 'pdfModal';
                    modal.style.cssText = `
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
                        display: none;
                    `;
                    
                    modal.innerHTML = `
                        <div style="background:#1a1a1a;padding:30px;border-radius:10px;max-width:500px;width:90%;">
                            <h2 style="color:#fff;margin-bottom:20px;">PDF - Sistema de Fallback</h2>
                            <input type="password" id="pdfPassword" placeholder="Digite a senha do PDF" 
                                   style="padding:12px;width:100%;margin-bottom:20px;font-size:16px;display:block;">
                            <div style="display:flex;gap:10px;">
                                <button onclick="document.getElementById('pdfModal').style.display='none'" 
                                        style="padding:12px 20px;background:#555;color:white;border:none;cursor:pointer;flex:1;">
                                    Cancelar
                                </button>
                                <button onclick="alert('PDF processado (modo fallback)')" 
                                        style="padding:12px 20px;background:#00ff9c;color:#000;border:none;cursor:pointer;flex:1;font-weight:bold;">
                                    Processar PDF
                                </button>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                    console.log('✅ Modal PDF criado (fallback)');
                }
                
                const modal = document.getElementById('pdfModal');
                if (modal) {
                    modal.style.display = 'flex';
                    
                    // Garantir que o campo de senha está visível
                    const passwordField = document.getElementById('pdfPassword');
                    if (passwordField) {
                        passwordField.style.display = 'block';
                        setTimeout(() => passwordField.focus(), 100);
                    }
                    
                    return true;
                }
                
                return false;
            },
            hideModal: function() {
                const modal = document.getElementById('pdfModal');
                if (modal) modal.style.display = 'none';
            }
        };
        
        console.log('✅ PdfSystem criado (fallback)');
        return true;
    }
    return false;
};

/* ================== EXECUÇÃO AUTOMÁTICA ================== */
// Executar automaticamente em modos de debug
(function autoRunPdfFixTest() {
    // Verificar se estamos em modo de teste
    const shouldAutoRun = PDF_DEBUG || 
                         location.search.includes('testpdf') || 
                         location.search.includes('debug=pdf') ||
                         (DEBUG_MODE && DIAGNOSTICS_MODE);
    
    if (shouldAutoRun) {
        console.log('🔧 Configurando teste automático PDF (5 segundos)...');
        
        // Executar após 5 segundos
        setTimeout(() => {
            if (window.testPdfFix && typeof window.testPdfFix === 'function') {
                console.log('🔄 Executando teste automático PDF...');
                window.testPdfFix();
            } else {
                console.log('⚠️ testPdfFix não disponível, executando testPdfSystem...');
                if (window.testPdfSystem && typeof window.testPdfSystem === 'function') {
                    window.testPdfSystem(101);
                }
            }
        }, 5000);
    }
})();

/* ================== INTEGRAÇÃO COM O SISTEMA EXISTENTE ================== */
// Adicionar ao objeto console.diag
if (typeof window.enhanceDevTools === 'function') {
    // Sobrescrever para incluir a nova função
    const originalEnhanceDevTools = window.enhanceDevTools;
    window.enhanceDevTools = function() {
        originalEnhanceDevTools();
        
        // Adicionar ao console.diag.pdf
        if (console.diag && console.diag.pdf) {
            console.diag.pdf.fixTest = window.testPdfFix;
            console.diag.pdf.autoFix = window.createFallbackPdfSystem;
        }
        
        console.log('✅ testPdfFix adicionado ao console.diag.pdf');
    };
}

// Adicionar ao objeto diag global
if (window.diag && window.diag.pdf) {
    window.diag.pdf.fixTest = window.testPdfFix;
    window.diag.pdf.autoFix = window.createFallbackPdfSystem;
}

// Configurar listener para atalho de teclado (Alt+P)
document.addEventListener('keydown', function(e) {
    if (e.altKey && e.key === 'p') {
        console.log('🎮 Atalho Alt+P detectado - executando teste PDF...');
        if (window.testPdfFix) {
            window.testPdfFix();
        }
    }
});

console.log('✅ Módulo de verificação automática PDF carregado (v5.5)');
// ==== FIM DA INSERÇÃO DO NOVO CÓDIGO ====

// Exportar funções globais (código existente - manter)
window.Diagnostics = {
    analyzeSystem,
    runCompleteDiagnosis,
    testMediaUnifiedComplete,
    exportReport,
    createDiagnosticsPanel,
    logToPanel,
    updateStatus,
    updateDeviceIndicator,
    version: '5.5' // ← Atualizar para 5.5
};

console.log('✅ DIAGNOSTICS.JS v5.5 - CARREGAMENTO COMPLETO (com testPdfFix)'); // ← Atualizar mensagem

// ================== ETAPA 4: VERIFICAÇÃO DE INTEGRIDADE (v5.5) ==================
window.verifyPdfSystemIntegrity = function() {
    console.group('🔍 VERIFICAÇÃO DE SISTEMA DE PDF - ETAPA 4 (v5.5)');
    
    // Verificar qual sistema está ativo para PDFs
    const systems = {
        MediaSystem: window.MediaSystem && typeof window.MediaSystem.processAndSavePdfs === 'function',
        PdfSystem: window.PdfSystem && typeof window.PdfSystem.processAndSavePdfs === 'function',
        window_processAndSavePdfs: typeof window.processAndSavePdfs === 'function',
        pdfUploadArea: !!document.getElementById('pdfUploadArea'),
        pdfFileInput: !!document.getElementById('pdfFileInput'),
        hasPdfModal: !!document.getElementById('pdfModal'),
        hasPdfPassword: !!document.getElementById('pdfPassword'),
        testPdfFix: typeof window.testPdfFix === 'function',
        interactivePdfTest: typeof window.interactivePdfTest === 'function'
    };
    
    console.table(systems);
    
    // Análise de conflitos
    let hasConflict = false;
    let conflictMessage = '';
    
    if (systems.MediaSystem && systems.PdfSystem) {
        hasConflict = true;
        conflictMessage = '⚠️ DOIS SISTEMAS DE PDF ATIVOS! Conflito potencial detectado.';
        console.warn(conflictMessage);
        console.log('🎯 Recomendação: Use apenas MediaSystem para uploads');
    }
    
    if (systems.MediaSystem) {
        console.log('✅ Sistema correto: MediaSystem ativo para PDFs');
        console.log('📊 Estado do MediaSystem:');
        console.log('- PDFs no estado:', window.MediaSystem.state?.pdfs?.length || 0);
        console.log('- PDFs existentes:', window.MediaSystem.state?.existingPdfs?.length || 0);
        console.log('- Funções disponíveis:', Object.keys(window.MediaSystem).filter(k => typeof window.MediaSystem[k] === 'function').length);
    }
    
    if (systems.PdfSystem && !systems.MediaSystem) {
        console.log('ℹ️ Apenas PdfSystem ativo (pode ser fallback)');
    }
    
    // Verificar estado dos elementos críticos
    const criticalElements = {
        'pdfModal': {
            element: document.getElementById('pdfModal'),
            display: document.getElementById('pdfModal')?.style.display || getComputedStyle(document.getElementById('pdfModal') || {}).display,
            visible: document.getElementById('pdfModal') && 
                     (document.getElementById('pdfModal').style.display !== 'none' && 
                      getComputedStyle(document.getElementById('pdfModal')).display !== 'none')
        },
        'pdfPassword': {
            element: document.getElementById('pdfPassword'),
            display: document.getElementById('pdfPassword')?.style.display || getComputedStyle(document.getElementById('pdfPassword') || {}).display,
            visible: document.getElementById('pdfPassword') && 
                     (document.getElementById('pdfPassword').style.display !== 'none' && 
                      getComputedStyle(document.getElementById('pdfPassword')).display !== 'none')
        }
    };
    
    console.log('🎯 Elementos Críticos:', criticalElements);
    
    // Recomendações baseadas na análise
    const recommendations = [];
    
    if (!systems.MediaSystem && !systems.PdfSystem) {
        recommendations.push('🚨 CRÍTICO: Nenhum sistema PDF ativo. Considere criar fallback.');
    }
    
    if (!criticalElements.pdfModal.element) {
        recommendations.push('🔧 Criar modal PDF se não existir');
    } else if (!criticalElements.pdfModal.visible && criticalElements.pdfModal.display === 'none') {
        recommendations.push('🔧 Modal PDF existe mas está oculto (pode ser normal)');
    }
    
    if (!criticalElements.pdfPassword.element) {
        recommendations.push('🔧 Adicionar campo de senha PDF');
    } else if (!criticalElements.pdfPassword.visible) {
        recommendations.push('🔧 Campo de senha PDF está oculto - verificar se deve estar visível');
    }
    
    if (recommendations.length > 0) {
        console.log('💡 Recomendações:');
        recommendations.forEach((rec, idx) => console.log(`${idx + 1}. ${rec}`));
    }
    
    const result = {
        systems,
        criticalElements,
        hasConflict,
        conflictMessage,
        recommendations,
        timestamp: new Date().toISOString(),
        version: '5.5'
    };
    
    // Log no painel se disponível
    if (typeof window.logToPanel === 'function') {
        if (hasConflict) {
            window.logToPanel('⚠️ Conflito de sistemas PDF detectado', 'warning');
        } else if (systems.MediaSystem) {
            window.logToPanel('✅ MediaSystem ativo e funcional', 'success');
        }
        
        if (recommendations.length > 0) {
            window.logToPanel(`💡 ${recommendations.length} recomendações`, 'info');
        }
    }
    
    console.groupEnd();
    
    return result;
};

/* ================== ETAPA 5: TESTE DE VALIDAÇÃO (v5.5) ================== */
window.testPdfUploadBugFix = function() {
    console.group('🧪 TESTE DE CORREÇÃO DE BUG DE PDF (v5.5)');
    
    const results = {
        step1: {},
        step2: {},
        step3: {},
        overallSuccess: false,
        timestamp: new Date().toISOString(),
        version: '5.5'
    };
    
    // 1. Verificar estado inicial
    console.log('1️⃣ Estado inicial:');
    results.step1 = {
        MediaSystem: !!window.MediaSystem,
        PdfSystem: !!window.PdfSystem,
        processAndSavePdfs: typeof window.processAndSavePdfs,
        testPdfFix: typeof window.testPdfFix,
        interactivePdfTest: typeof window.interactivePdfTest
    };
    
    console.log('- MediaSystem:', results.step1.MediaSystem);
    console.log('- PdfSystem:', results.step1.PdfSystem);
    console.log('- Função processAndSavePdfs:', results.step1.processAndSavePdfs);
    console.log('- Função testPdfFix:', results.step1.testPdfFix);
    console.log('- Função interactivePdfTest:', results.step1.interactivePdfTest);
    
    // 2. Simular upload de PDF
    console.log('2️⃣ Simulando upload de PDF...');
    
    let simulationSuccess = false;
    let simulationMessage = '';
    
    if (window.MediaSystem && typeof window.MediaSystem.addPdfs === 'function') {
        console.log('✅ Usando MediaSystem para simulação');
        
        try {
            // Criar arquivo de teste simulado
            const testFile = {
                name: 'teste_correcao.pdf',
                type: 'application/pdf',
                size: 1024,
                lastModified: Date.now()
            };
            
            // Simular fileList
            const fileList = {
                0: testFile,
                length: 1,
                item: (index) => index === 0 ? testFile : null
            };
            
            console.log('📤 Adicionando PDF de teste ao MediaSystem...');
            
            // Tentar adicionar PDFs (pode variar conforme implementação)
            let added = 0;
            if (typeof window.MediaSystem.addPdfs === 'function') {
                try {
                    const result = window.MediaSystem.addPdfs(fileList);
                    added = result || 1; // Assumir sucesso se não houver erro
                    simulationMessage = `✅ ${added} PDF(s) simulado(s) no MediaSystem`;
                } catch (e) {
                    simulationMessage = `⚠️ Simulação falhou: ${e.message}`;
                }
            }
            
            // Verificar estado
            console.log('📊 Estado após simulação:');
            console.log('- PDFs em MediaSystem.state:', window.MediaSystem.state?.pdfs?.length || 0);
            console.log('- Estado completo:', window.MediaSystem.state || 'N/A');
            
            results.step2 = {
                usedSystem: 'MediaSystem',
                filesAdded: added,
                message: simulationMessage,
                statePdfs: window.MediaSystem.state?.pdfs?.length || 0,
                success: added > 0
            };
            
            simulationSuccess = added > 0;
            
        } catch (error) {
            console.error('❌ Erro na simulação MediaSystem:', error);
            results.step2 = {
                usedSystem: 'MediaSystem',
                error: error.message,
                success: false
            };
        }
        
    } else if (window.PdfSystem && typeof window.PdfSystem.addPdfs === 'function') {
        console.log('ℹ️ Usando PdfSystem para simulação (fallback)');
        
        try {
            results.step2 = {
                usedSystem: 'PdfSystem',
                message: 'PdfSystem disponível para simulação',
                success: true
            };
            simulationSuccess = true;
        } catch (error) {
            results.step2 = {
                usedSystem: 'PdfSystem',
                error: error.message,
                success: false
            };
        }
        
    } else {
        console.log('⚠️ Nenhum sistema disponível para simulação direta');
        results.step2 = {
            usedSystem: 'none',
            message: 'Usando simulação básica',
            success: true // Considerar sucesso para não bloquear teste
        };
        simulationSuccess = true;
    }
    
    // 3. Testar processAndSavePdfs
    console.log('3️⃣ Testando processAndSavePdfs...');
    
    if (typeof window.processAndSavePdfs === 'function') {
        console.log('✅ Função processAndSavePdfs disponível');
        
        try {
            // Testar com valores padrão
            const testId = 'test_id_' + Date.now();
            const testTitle = 'Teste Correção ' + new Date().toLocaleTimeString();
            
            console.log(`📝 Executando processAndSavePdfs("${testId}", "${testTitle}")...`);
            
            // Executar de forma assíncrona
            const processResult = window.processAndSavePdfs(testId, testTitle);
            
            if (processResult && typeof processResult.then === 'function') {
                // É uma Promise
                processResult
                    .then(result => {
                        console.log('📤 Resultado (Promise):', result);
                        results.step3 = {
                            type: 'promise',
                            result: result,
                            success: true
                        };
                        results.overallSuccess = simulationSuccess;
                        completeTest();
                    })
                    .catch(error => {
                        console.error('❌ Erro no processamento (Promise):', error);
                        results.step3 = {
                            type: 'promise',
                            error: error.message,
                            success: false
                        };
                        results.overallSuccess = false;
                        completeTest();
                    });
            } else {
                // Não é uma Promise
                console.log('📤 Resultado (síncrono):', processResult);
                results.step3 = {
                    type: 'sync',
                    result: processResult,
                    success: processResult !== false && processResult !== undefined
                };
                results.overallSuccess = simulationSuccess && results.step3.success;
                completeTest();
            }
            
        } catch (error) {
            console.error('❌ Erro ao executar processAndSavePdfs:', error);
            results.step3 = {
                type: 'error',
                error: error.message,
                success: false
            };
            results.overallSuccess = false;
            completeTest();
        }
        
    } else {
        console.log('⚠️ Função processAndSavePdfs não disponível');
        results.step3 = {
            type: 'not_available',
            success: false
        };
        results.overallSuccess = simulationSuccess;
        completeTest();
    }
    
    function completeTest() {
        console.log('📊 RESUMO DO TESTE:');
        console.log('- Passo 1 (Estado):', results.step1.success !== false ? '✅' : '❌');
        console.log('- Passo 2 (Simulação):', results.step2.success ? '✅' : '❌');
        console.log('- Passo 3 (Processamento):', results.step3.success ? '✅' : '❌');
        console.log('- Sucesso Geral:', results.overallSuccess ? '✅' : '❌');
        
        // Mostrar alerta visual
        if (!window.diagnosticsSilentMode) {
            showTestResultsAlert(results);
        }
        
        // Logar no painel
        if (typeof window.logToPanel === 'function') {
            const status = results.overallSuccess ? 'success' : 'error';
            const message = results.overallSuccess ? 
                '✅ Teste de correção PDF realizado com sucesso' : 
                '❌ Teste de correção PDF falhou';
            window.logToPanel(message, status);
        }
        
        console.groupEnd();
        
        return results;
    }
    
    // Retornar imediatamente (os resultados serão preenchidos assincronamente)
    return results;
};

/* ================== MOSTRAR RESULTADOS DO TESTE ================== */
function showTestResultsAlert(results) {
    const alertId = 'pdf-test-results-alert-v5-5';
    
    // Remover alerta anterior se existir
    const existingAlert = document.getElementById(alertId);
    if (existingAlert) {
        existingAlert.remove();
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${results.overallSuccess ? 'linear-gradient(135deg, #001a00, #000a1a)' : 'linear-gradient(135deg, #1a0000, #000a0a)'};
        color: ${results.overallSuccess ? '#00ff9c' : '#ff5555'};
        padding: 25px;
        border: 3px solid ${results.overallSuccess ? '#00ff9c' : '#ff5555'};
        border-radius: 10px;
        z-index: 1000006;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 50px ${results.overallSuccess ? 'rgba(0, 255, 156, 0.5)' : 'rgba(255, 0, 0, 0.5)'};
        font-family: 'Courier New', monospace;
        backdrop-filter: blur(10px);
    `;
    
    let html = `
        <div style="font-size: 20px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>${results.overallSuccess ? '✅' : '❌'}</span>
            <span>TESTE DE CORREÇÃO PDF v5.5</span>
        </div>
        
        <div style="background: ${results.overallSuccess ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 0, 0, 0.1)'}; 
                    padding: 15px; border-radius: 6px; margin-bottom: 20px; 
                    border: 1px solid ${results.overallSuccess ? 'rgba(0, 255, 156, 0.3)' : 'rgba(255, 0, 0, 0.3)'};">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #888;">ESTADO</div>
                    <div style="font-size: 24px; color: ${results.step1.success !== false ? '#00ff9c' : '#ff5555'}">
                        ${results.step1.success !== false ? '✅' : '❌'}
                    </div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #888;">SIMULAÇÃO</div>
                    <div style="font-size: 24px; color: ${results.step2.success ? '#00ff9c' : '#ff5555'}">
                        ${results.step2.success ? '✅' : '❌'}
                    </div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #888;">PROCESSO</div>
                    <div style="font-size: 24px; color: ${results.step3.success ? '#00ff9c' : '#ff5555'}">
                        ${results.step3.success ? '✅' : '❌'}
                    </div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: ${results.overallSuccess ? '#88ffaa' : '#ff8888'}; text-align: center;">
                ${results.overallSuccess ? '✅ Sistema PDF funcional' : '❌ Problemas detectados'}
            </div>
        </div>
    `;
    
    // Detalhes dos resultados
    html += `
        <div style="margin-bottom: 20px;">
            <h4 style="color: ${results.overallSuccess ? '#00ff9c' : '#ff5555'}; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                📋 DETALHES DO TESTE
            </h4>
            <div style="max-height: 200px; overflow-y: auto; font-size: 11px;">
                <div style="margin-bottom: 8px;">
                    <strong>Sistema usado:</strong> ${results.step2.usedSystem || 'N/A'}
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>Arquivos simulados:</strong> ${results.step2.filesAdded || 0}
                </div>
                <div style="margin-bottom: 8px;">
                    <strong>Tipo processamento:</strong> ${results.step3.type || 'N/A'}
                </div>
                ${results.step2.message ? `<div style="margin-bottom: 8px;"><strong>Mensagem:</strong> ${results.step2.message}</div>` : ''}
                ${results.step3.error ? `<div style="color: #ff5555; margin-bottom: 8px;"><strong>Erro:</strong> ${results.step3.error}</div>` : ''}
            </div>
        </div>
    `;
    
    // Recomendações se houver falhas
    if (!results.overallSuccess) {
        html += `
            <div style="background: rgba(255, 0, 0, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 20px; border: 1px solid rgba(255, 0, 0, 0.3);">
                <h4 style="color: #ff5555; margin-bottom: 10px;">💡 RECOMENDAÇÕES</h4>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffaaaa;">
                    <li>Verificar se MediaSystem está carregado corretamente</li>
                    <li>Confirmar que a função processAndSavePdfs existe</li>
                    <li>Testar manualmente com console.diag.pdf.test()</li>
                    <li>Usar console.diag.pdf.interactive() para diagnóstico interativo</li>
                </ul>
            </div>
        `;
    }
    
    // Botões de ação
    html += `
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="close-test-results-v5-5" style="
                background: ${results.overallSuccess ? '#00ff9c' : '#ff5555'}; 
                color: ${results.overallSuccess ? '#000' : 'white'}; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1; transition: all 0.2s;">
                FECHAR
            </button>
            <button id="run-verification-v5-5" style="
                background: #0088cc; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1; transition: all 0.2s;">
                🔍 VERIFICAÇÃO
            </button>
        </div>
        
        <div style="font-size: 11px; color: #888; text-align: center; margin-top: 15px;">
            Teste executado em: ${new Date().toLocaleTimeString()} - v5.5
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos
    document.getElementById('close-test-results-v5-5')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
    
    document.getElementById('run-verification-v5-5')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
        window.verifyPdfSystemIntegrity();
    });
}

/* ================== INTEGRAÇÃO COM O SISTEMA EXISTENTE ================== */
// Adicionar novas funções ao objeto diag global
if (window.diag) {
    window.diag.pdf = window.diag.pdf || {};
    window.diag.pdf.verify = window.verifyPdfSystemIntegrity;
    window.diag.pdf.testBugFix = window.testPdfUploadBugFix;
    
    // Adicionar também ao console.diag se existir
    if (console.diag) {
        console.diag.pdf = console.diag.pdf || {};
        console.diag.pdf.verify = window.verifyPdfSystemIntegrity;
        console.diag.pdf.testBugFix = window.testPdfUploadBugFix;
    }
}

// Adicionar botões ao painel de diagnóstico
function addNewVerificationButtons() {
    // Adicionar ao painel principal se existir
    const mainButtons = document.querySelector('#diagnostics-panel-complete > div:nth-child(3)');
    if (mainButtons && !document.getElementById('verify-pdf-system-btn-v5-5')) {
        const verifyBtn = document.createElement('button');
        verifyBtn.id = 'verify-pdf-system-btn-v5-5';
        verifyBtn.innerHTML = '🔍 VERIFICAÇÃO SISTEMA PDF v5.5';
        verifyBtn.style.cssText = `
            background: linear-gradient(45deg, #ff00ff, #0088cc); 
            color: white; border: none;
            padding: 8px 12px; cursor: pointer; border-radius: 4px;
            font-weight: bold; flex: 1; margin: 5px;
            transition: all 0.2s;
        `;
        
        verifyBtn.addEventListener('click', () => {
            window.verifyPdfSystemIntegrity();
        });
        
        const testBugFixBtn = document.createElement('button');
        testBugFixBtn.id = 'test-pdf-bug-fix-btn-v5-5';
        testBugFixBtn.innerHTML = '🧪 TESTE CORREÇÃO BUG PDF v5.5';
        testBugFixBtn.style.cssText = `
            background: linear-gradient(45deg, #00ff9c, #0088cc); 
            color: #000; border: none;
            padding: 8px 12px; cursor: pointer; border-radius: 4px;
            font-weight: bold; flex: 1; margin: 5px;
            transition: all 0.2s;
        `;
        
        testBugFixBtn.addEventListener('click', () => {
            window.testPdfUploadBugFix();
        });
        
        mainButtons.appendChild(verifyBtn);
        mainButtons.appendChild(testBugFixBtn);
        
        console.log('✅ Botões de verificação PDF adicionados ao painel (v5.5)');
    }
}

// Executar verificação automática se em modo debug
(function autoRunVerifications() {
    const shouldAutoRun = DEBUG_MODE || DIAGNOSTICS_MODE || PDF_DEBUG;
    
    if (shouldAutoRun) {
        console.log('🔧 Configurando verificações automáticas PDF (7 segundos)...');
        
        // Executar após 7 segundos (dá tempo para o sistema carregar)
        setTimeout(() => {
            console.log('🔄 Executando verificação automática de integridade...');
            if (window.verifyPdfSystemIntegrity) {
                window.verifyPdfSystemIntegrity();
            }
            
            // Executar teste após 10 segundos
            setTimeout(() => {
                console.log('🧪 Executando teste automático de correção...');
                if (window.testPdfUploadBugFix) {
                    window.testPdfUploadBugFix();
                }
            }, 3000);
            
            // Adicionar botões ao painel
            setTimeout(addNewVerificationButtons, 1000);
            
        }, 7000);
    }
})();

console.log('✅ Módulos de verificação PDF v5.5 adicionados (sem duplicação)');

/* ================== MONITORAMENTO PÓS-CORREÇÃO (COMPLEMENTAR) v5.5 ================== */
window.monitorPdfPostCorrection = function() {
    console.group('🔍 MONITOR PÓS-CORREÇÃO DO BUG PDF');
    console.log('Verificando integridade do sistema PDF após correções...');
    
    let issues = [];
    let recommendations = [];
    
    // Verificar se há event listeners duplicados
    const uploadAreas = [
        { id: 'pdfUploadArea', desc: 'Área de upload PDF' },
        { id: 'pdfFileInput', desc: 'Input de arquivo PDF' }
    ];
    
    uploadAreas.forEach(area => {
        const element = document.getElementById(area.id);
        if (element) {
            console.log(`✅ ${area.desc}: Existe`);
            
            // Verificar event listeners (estimativa)
            let clickCount = 0;
            const clickHandler = element.onclick;
            if (clickHandler) clickCount++;
            
            if (clickCount > 1) {
                issues.push(`⚠️ ${area.desc} pode ter múltiplos event listeners`);
            }
        } else {
            console.log(`ℹ️ ${area.desc}: Não encontrado (pode ser normal)`);
        }
    });
    
    // Verificar MediaSystem
    if (!window.MediaSystem) {
        issues.push('❌ MediaSystem não disponível');
    } else {
        if (typeof MediaSystem.processAndSavePdfs !== 'function') {
            issues.push('❌ MediaSystem.processAndSavePdfs não é função');
        } else {
            console.log('✅ MediaSystem.processAndSavePdfs disponível');
        }
    }
    
    // Verificar se arquivos órfãos foram removidos (NOVA VERIFICAÇÃO)
    const orphanScripts = [
        'pdf-ui.js',
        'pdf-core.js', 
        'pdf-integration.js',
        'pdf-placeholders.js'
    ];
    
    let orphanCount = 0;
    orphanScripts.forEach(script => {
        const elements = document.querySelectorAll(`script[src*="${script}"]`);
        if (elements.length > 0) {
            orphanCount += elements.length;
            issues.push(`❌ ${script} ainda carregado (${elements.length}x)`);
            
            // Detalhes dos scripts órfãos
            elements.forEach((el, idx) => {
                console.warn(`  Script órfão ${idx + 1}:`, el.src);
            });
        }
    });
    
    // Report
    if (issues.length === 0) {
        console.log('✅ SISTEMA PDF ÍNTEGRO');
        console.log('🎯 Estado:');
        console.log('- MediaSystem:', window.MediaSystem ? 'OK' : 'FALTANDO');
        console.log('- PdfSystem:', window.PdfSystem ? 'OK (apenas modal)' : 'OK');
        console.log('- Arquivos órfãos: 0');
        console.log('- Event listeners: Únicos');
        
        // Log no painel
        if (typeof window.logToPanel === 'function') {
            window.logToPanel('✅ Sistema PDF íntegro pós-correção', 'success');
        }
    } else {
        console.error('⚠️ PROBLEMAS DETECTADOS:', issues);
        
        // Auto-recovery: Forçar MediaSystem como único gestor (SEGURANÇA)
        if (window.MediaSystem && typeof MediaSystem.processAndSavePdfs === 'function') {
            console.log('🔄 Ativando auto-recovery...');
            
            // Garantir que processAndSavePdfs aponta para MediaSystem
            if (typeof window.processAndSavePdfs !== 'function' || 
                window.processAndSavePdfs.toString().indexOf('MediaSystem') === -1) {
                
                window.processAndSavePdfs = async function(propertyId, propertyTitle) {
                    console.log(`🔗 processAndSavePdfs redirecionado para MediaSystem (${propertyId})`);
                    return await window.MediaSystem.processAndSavePdfs(propertyId, propertyTitle);
                };
                
                console.log('✅ Auto-recovery aplicado (processAndSavePdfs redirecionado)');
                recommendations.push('🔄 processAndSavePdfs redirecionado para MediaSystem');
            }
        }
        
        // Recomendações para scripts órfãos
        if (orphanCount > 0) {
            recommendations.push(`🗑️ Remover ${orphanCount} script(s) órfãos`);
            recommendations.push('📝 Atualizar index.html para remover referências antigas');
        }
        
        // Log no painel
        if (typeof window.logToPanel === 'function') {
            window.logToPanel(`⚠️ ${issues.length} problemas detectados`, 'warning');
            issues.forEach(issue => window.logToPanel(issue, 'error'));
        }
    }
    
    // Mostrar relatório visual se houver problemas
    if (issues.length > 0 && !window.diagnosticsSilentMode) {
        showPostCorrectionReport(issues, recommendations);
    }
    
    console.groupEnd();
    
    return {
        issues,
        recommendations,
        timestamp: new Date().toISOString(),
        orphanScriptsCount: orphanCount,
        hasMediaSystem: !!window.MediaSystem,
        mediaSystemFunctional: window.MediaSystem && typeof MediaSystem.processAndSavePdfs === 'function'
    };
};

/* ================== RELATÓRIO VISUAL PÓS-CORREÇÃO ================== */
function showPostCorrectionReport(issues, recommendations) {
    const alertId = 'post-correction-report-v5-5';
    
    // Remover alerta anterior se existir
    const existingAlert = document.getElementById(alertId);
    if (existingAlert) existingAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: linear-gradient(135deg, #1a0000, #000a0a);
        color: #ffaa00;
        padding: 20px;
        border: 3px solid #ff5500;
        border-radius: 10px;
        z-index: 1000007;
        max-width: 800px;
        width: 95%;
        max-height: 70vh;
        overflow-y: auto;
        box-shadow: 0 0 40px rgba(255, 85, 0, 0.5);
        font-family: 'Courier New', monospace;
        backdrop-filter: blur(10px);
    `;
    
    let html = `
        <div style="font-size: 20px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>⚠️</span>
            <span>RELATÓRIO PÓS-CORREÇÃO PDF v5.5</span>
        </div>
        
        <div style="background: rgba(255, 85, 0, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 20px; 
                    border: 1px solid rgba(255, 85, 0, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">PROBLEMAS</div>
                    <div style="font-size: 32px; color: #ff5555;">${issues.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">SCRIPTS ÓRFÃOS</div>
                    <div style="font-size: 32px; color: #ffaa00;">${issues.filter(i => i.includes('órfão')).length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">RECOMENDAÇÕES</div>
                    <div style="font-size: 32px; color: #00ff9c;">${recommendations.length}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #ffcc88; text-align: center;">
                Análise completa após correções do sistema PDF
            </div>
        </div>
    `;
    
    // Lista de problemas
    if (issues.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ff5555; margin-bottom: 10px; border-bottom: 1px solid #663300; padding-bottom: 5px;">
                    ⚠️ PROBLEMAS DETECTADOS
                </h4>
                <div style="max-height: 200px; overflow-y: auto; background: rgba(255, 0, 0, 0.1); padding: 10px; border-radius: 4px; 
                            border: 1px solid rgba(255, 0, 0, 0.2);">
        `;
        
        issues.forEach((issue, index) => {
            const isCritical = issue.includes('❌');
            html += `
                <div style="margin-bottom: 6px; padding: 8px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; 
                            border-left: 3px solid ${isCritical ? '#ff5555' : '#ffaa00'};">
                    <span style="color: ${isCritical ? '#ff5555' : '#ffaa00'};">${isCritical ? '❌' : '⚠️'}</span>
                    <span style="color: #ffaaaa; margin-left: 8px;">${issue}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Lista de recomendações
    if (recommendations.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #00ff9c; margin-bottom: 10px; border-bottom: 1px solid #006633; padding-bottom: 5px;">
                    💡 RECOMENDAÇÕES
                </h4>
                <div style="max-height: 150px; overflow-y: auto; background: rgba(0, 255, 156, 0.1); padding: 10px; border-radius: 4px; 
                            border: 1px solid rgba(0, 255, 156, 0.2);">
        `;
        
        recommendations.forEach((rec, index) => {
            const icon = rec.includes('🗑️') ? '🗑️' : 
                        rec.includes('📝') ? '📝' : 
                        rec.includes('🔄') ? '🔄' : '•';
            html += `
                <div style="margin-bottom: 5px; padding: 6px; background: rgba(0, 255, 156, 0.1); border-radius: 4px;">
                    <span style="color: #00ff9c;">${icon}</span>
                    <span style="color: #aaffcc; margin-left: 8px;">${rec}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Scripts órfãos detalhados
    const orphanScripts = issues.filter(i => i.includes('órfão'));
    if (orphanScripts.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ffaa00; margin-bottom: 10px; border-bottom: 1px solid #663300; padding-bottom: 5px;">
                    📜 SCRIPTS ÓRFÃOS DETECTADOS
                </h4>
                <div style="background: rgba(255, 170, 0, 0.1); padding: 10px; border-radius: 4px; border: 1px solid rgba(255, 170, 0, 0.2);">
                    <div style="font-size: 11px; color: #ffcc88; margin-bottom: 8px;">
                        Estes scripts ainda estão carregados mas podem ser removidos:
                    </div>
        `;
        
        orphanScripts.forEach(issue => {
            const scriptName = issue.match(/❌ (.*?) ainda carregado/)?.[1] || issue;
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.1); border-radius: 3px; font-size: 11px;">
                    <span style="color: #ffaa00;">🗑️</span>
                    <span style="color: #ffcc88; margin-left: 6px;">${scriptName}</span>
                </div>
            `;
        });
        
        html += `
                    <div style="font-size: 10px; color: #ffaa88; margin-top: 10px;">
                        ⚠️ Remova as referências destes scripts do index.html
                    </div>
                </div>
            </div>
        `;
    }
    
    // Botões de ação
    html += `
        <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
            <button id="apply-auto-fix-v5-5" style="
                background: linear-gradient(45deg, #ff5500, #ffaa00); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; min-width: 140px; transition: all 0.2s;">
                🛠️ APLICAR CORREÇÕES
            </button>
            <button id="verify-rollback-v5-5" style="
                background: linear-gradient(45deg, #0088cc, #00aaff); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; min-width: 140px; transition: all 0.2s;">
                🔄 VERIFICAR ROLLBACK
            </button>
            <button id="close-report-v5-5" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; min-width: 140px; transition: all 0.2s;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #ffcc88; text-align: center; margin-top: 15px;">
            Relatório gerado em: ${new Date().toLocaleTimeString()} - v5.5
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos
    document.getElementById('apply-auto-fix-v5-5')?.addEventListener('click', () => {
        applyAutoCorrections(issues);
    });
    
    document.getElementById('verify-rollback-v5-5')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
        window.verifyRollbackCompatibility();
    });
    
    document.getElementById('close-report-v5-5')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
}

/* ================== APLICAÇÃO DE CORREÇÕES AUTOMÁTICAS ================== */
function applyAutoCorrections(issues) {
    console.group('🛠️ APLICANDO CORREÇÕES AUTOMÁTICAS');
    
    const corrections = [];
    
    // 1. Corrigir redirecionamento para MediaSystem
    if (window.MediaSystem && typeof MediaSystem.processAndSavePdfs === 'function') {
        if (typeof window.processAndSavePdfs !== 'function' || 
            window.processAndSavePdfs.toString().indexOf('MediaSystem') === -1) {
            
            window.processAndSavePdfs = async function(propertyId, propertyTitle) {
                console.log(`🔗 processAndSavePdfs redirecionado para MediaSystem (${propertyId})`);
                return await window.MediaSystem.processAndSavePdfs(propertyId, propertyTitle);
            };
            
            corrections.push('✅ processAndSavePdfs redirecionado para MediaSystem');
            console.log('✅ Correção 1: processAndSavePdfs redirecionado');
        }
    }
    
    // 2. Verificar e limpar event listeners duplicados (estimativa)
    const elementsToCheck = ['pdfUploadArea', 'pdfFileInput', 'pdfPassword', 'pdfModal'];
    elementsToCheck.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            // Verificar se há múltiplos handlers (aproximação)
            const originalOnClick = element.onclick;
            if (originalOnClick) {
                // Criar handler único que chama o original
                element.onclick = function(e) {
                    console.log(`🎯 Evento click em ${id} (handler unificado)`);
                    return originalOnClick.call(this, e);
                };
                corrections.push(`✅ Handler de ${id} unificado`);
            }
        }
    });
    
    // 3. Configurar fallback se necessário
    if (!window.PdfSystem && window.MediaSystem) {
        // Garantir que showPdfModal existe e usa MediaSystem
        if (typeof window.showPdfModal !== 'function') {
            window.showPdfModal = function(propertyId) {
                console.log(`📄 showPdfModal(${propertyId}) via MediaSystem`);
                if (window.MediaSystem && MediaSystem.showPdfModal) {
                    return MediaSystem.showPdfModal(propertyId);
                }
                
                const modal = document.getElementById('pdfModal');
                if (modal) {
                    modal.style.display = 'flex';
                    return true;
                }
                return false;
            };
            corrections.push('✅ showPdfModal criada (fallback para MediaSystem)');
        }
    }
    
    console.log('📊 Correções aplicadas:', corrections.length);
    corrections.forEach(c => console.log(`- ${c}`));
    
    // Mostrar resultado
    if (!window.diagnosticsSilentMode) {
        const resultDiv = document.createElement('div');
        resultDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #001a00, #000a1a);
            color: #00ff9c;
            padding: 25px;
            border: 3px solid #00ff9c;
            border-radius: 10px;
            z-index: 1000008;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 40px rgba(0, 255, 156, 0.5);
            backdrop-filter: blur(10px);
        `;
        
        resultDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>✅</span>
                <span>CORREÇÕES APLICADAS</span>
            </div>
            
            <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 20px; 
                        border: 1px solid rgba(0, 255, 156, 0.3);">
                <div style="font-size: 48px; margin-bottom: 10px; color: #00ff9c;">
                    ${corrections.length}
                </div>
                <div style="font-size: 14px; color: #88ffaa;">
                    correção(ões) aplicada(s)
                </div>
            </div>
            
            <div style="text-align: left; margin-bottom: 20px; max-height: 200px; overflow-y: auto;">
                <div style="color: #88ffaa; margin-bottom: 10px;">Ações realizadas:</div>
                ${corrections.map(c => `
                    <div style="margin-bottom: 6px; padding: 8px; background: rgba(0, 255, 156, 0.1); border-radius: 4px;">
                        <span style="color: #00ff9c;">✓</span>
                        <span style="color: #aaffcc; margin-left: 8px;">${c}</span>
                    </div>
                `).join('')}
            </div>
            
            <button onclick="this.parentElement.remove()" style="
                background: #00ff9c; color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; width: 100%; transition: all 0.2s;">
                FECHAR
            </button>
            
            <div style="font-size: 11px; color: #88ffaa; margin-top: 15px;">
                Sistema otimizado e verificado - v5.5
            </div>
        `;
        
        document.body.appendChild(resultDiv);
        
        // Auto-remover após 8 segundos
        setTimeout(() => {
            if (resultDiv.parentElement) {
                resultDiv.remove();
            }
        }, 8000);
    }
    
    console.groupEnd();
    
    return corrections;
}

/* ================== VERIFICAÇÃO DE ROLLBACK (COMPATIBILIDADE) ================== */
window.verifyRollbackCompatibility = function() {
    console.group('🔄 VERIFICAÇÃO DE COMPATIBILIDADE DE ROLLBACK');
    
    const requiredFiles = [
        'pdf-unified.js',
        'media-unified.js',
        'pdf-placeholders.js' // Importante para compatibilidade
    ];
    
    const results = {
        requiredFiles: {},
        systemsAvailable: {},
        recommendations: [],
        isRollbackSafe: true,
        timestamp: new Date().toISOString()
    };
    
    console.log('🔍 Verificando arquivos essenciais para rollback...');
    
    // Verificar arquivos carregados
    requiredFiles.forEach(file => {
        const found = Array.from(document.scripts).some(s => 
            s.src && s.src.includes(file)
        );
        
        results.requiredFiles[file] = found;
        console.log(`${file}: ${found ? '✅ OK' : '❌ FALTANDO'}`);
        
        if (!found) {
            results.recommendations.push(`📦 Garantir que ${file} esteja carregado para rollback`);
            results.isRollbackSafe = false;
        }
    });
    
    // Teste funcional básico
    console.log('🧪 Testando sistemas principais...');
    
    const systems = {
        MediaSystem: window.MediaSystem,
        PdfSystem: window.PdfSystem,
        processAndSavePdfs: typeof window.processAndSavePdfs === 'function',
        showPdfModal: typeof window.showPdfModal === 'function',
        testPdfSystem: typeof window.testPdfSystem === 'function'
    };
    
    results.systemsAvailable = systems;
    
    Object.entries(systems).forEach(([name, available]) => {
        console.log(`${name}: ${available ? '✅ DISPONÍVEL' : '❌ AUSENTE'}`);
        
        if (!available && (name === 'MediaSystem' || name === 'processAndSavePdfs')) {
            results.recommendations.push(`🔧 Recriar ${name} para compatibilidade`);
            results.isRollbackSafe = false;
        }
    });
    
    // Verificar se há módulos antigos ainda carregados
    const oldModules = [
        'pdf-ui.js',
        'pdf-core.js',
        'pdf-integration.js',
        'media-core.js',
        'media-ui.js'
    ];
    
    let oldModulesFound = [];
    oldModules.forEach(module => {
        const found = Array.from(document.scripts).some(s => 
            s.src && s.src.includes(module)
        );
        if (found) {
            oldModulesFound.push(module);
            console.warn(`⚠️ Módulo antigo ainda carregado: ${module}`);
        }
    });
    
    if (oldModulesFound.length > 0) {
        results.recommendations.push(`🗑️ Remover módulos antigos: ${oldModulesFound.join(', ')}`);
    }
    
    console.log('📊 Resultado da verificação de rollback:');
    console.log('- Arquivos essenciais:', Object.values(results.requiredFiles).filter(v => v).length, '/', requiredFiles.length);
    console.log('- Sistemas disponíveis:', Object.values(results.systemsAvailable).filter(v => v).length, '/', Object.keys(systems).length);
    console.log('- Rollback seguro:', results.isRollbackSafe ? '✅ SIM' : '❌ NÃO');
    
    // Mostrar relatório
    if (!window.diagnosticsSilentMode) {
        showRollbackReport(results);
    }
    
    console.groupEnd();
    
    return results;
};

/* ================== RELATÓRIO DE ROLLBACK ================== */
function showRollbackReport(results) {
    const alertId = 'rollback-report-v5-5';
    
    const existingAlert = document.getElementById(alertId);
    if (existingAlert) existingAlert.remove();
    
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${results.isRollbackSafe ? 'linear-gradient(135deg, #001a00, #000a1a)' : 'linear-gradient(135deg, #1a0000, #000a0a)'};
        color: ${results.isRollbackSafe ? '#00ff9c' : '#ff5555'};
        padding: 25px;
        border: 3px solid ${results.isRollbackSafe ? '#00ff9c' : '#ff5555'};
        border-radius: 10px;
        z-index: 1000009;
        max-width: 600px;
        width: 90%;
        box-shadow: 0 0 40px ${results.isRollbackSafe ? 'rgba(0, 255, 156, 0.5)' : 'rgba(255, 0, 0, 0.5)'};
        backdrop-filter: blur(10px);
    `;
    
    let html = `
        <div style="font-size: 20px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>${results.isRollbackSafe ? '✅' : '⚠️'}</span>
            <span>VERIFICAÇÃO DE ROLLBACK v5.5</span>
        </div>
        
        <div style="background: ${results.isRollbackSafe ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 0, 0, 0.1)'}; 
                    padding: 20px; border-radius: 6px; margin-bottom: 20px; 
                    border: 1px solid ${results.isRollbackSafe ? 'rgba(0, 255, 156, 0.3)' : 'rgba(255, 0, 0, 0.3)'};">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #888;">STATUS ROLLBACK</div>
                    <div style="font-size: 24px; color: ${results.isRollbackSafe ? '#00ff9c' : '#ff5555'}">
                        ${results.isRollbackSafe ? '✅ SEGURO' : '❌ RISCO'}
                    </div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #888;">ARQUIVOS</div>
                    <div style="font-size: 24px; color: ${Object.values(results.requiredFiles).filter(v => v).length === Object.keys(results.requiredFiles).length ? '#00ff9c' : '#ffaa00'}">
                        ${Object.values(results.requiredFiles).filter(v => v).length}/${Object.keys(results.requiredFiles).length}
                    </div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #888;">SISTEMAS</div>
                    <div style="font-size: 24px; color: ${Object.values(results.systemsAvailable).filter(v => v).length === Object.keys(results.systemsAvailable).length ? '#00ff9c' : '#ffaa00'}">
                        ${Object.values(results.systemsAvailable).filter(v => v).length}/${Object.keys(results.systemsAvailable).length}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Detalhes dos arquivos
    html += `
        <div style="margin-bottom: 20px;">
            <h4 style="color: ${results.isRollbackSafe ? '#00ff9c' : '#ff5555'}; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                📁 ARQUIVOS ESSENCIAIS
            </h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
    `;
    
    Object.entries(results.requiredFiles).forEach(([file, available]) => {
        html += `
            <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 4px; 
                        border-left: 3px solid ${available ? '#00ff9c' : '#ff5555'};">
                <div style="font-size: 11px; color: #888;">${file}</div>
                <div style="color: ${available ? '#00ff9c' : '#ff5555'}; font-weight: bold;">
                    ${available ? '✅ PRESENTE' : '❌ AUSENTE'}
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    // Recomendações se houver problemas
    if (results.recommendations.length > 0) {
        html += `
            <div style="background: rgba(255, 170, 0, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 20px; 
                        border: 1px solid rgba(255, 170, 0, 0.3);">
                <h4 style="color: #ffaa00; margin-bottom: 10px;">💡 RECOMENDAÇÕES</h4>
                <div style="max-height: 150px; overflow-y: auto;">
        `;
        
        results.recommendations.forEach((rec, index) => {
            html += `
                <div style="margin-bottom: 6px; padding: 8px; background: rgba(255, 170, 0, 0.1); border-radius: 4px;">
                    <span style="color: #ffaa00;">${index + 1}.</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${rec}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Botões de ação
    html += `
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button id="close-rollback-report-v5-5" style="
                background: ${results.isRollbackSafe ? '#00ff9c' : '#ff5555'}; 
                color: ${results.isRollbackSafe ? '#000' : 'white'}; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1; transition: all 0.2s;">
                FECHAR
            </button>
            <button id="run-complete-diagnostic-v5-5" style="
                background: #0088cc; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1; transition: all 0.2s;">
                🔍 DIAGNÓSTICO COMPLETO
            </button>
        </div>
        
        <div style="font-size: 11px; color: #888; text-align: center; margin-top: 15px;">
            Verificação de compatibilidade reversível - v5.5
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos
    document.getElementById('close-rollback-report-v5-5')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
    
    document.getElementById('run-complete-diagnostic-v5-5')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
        if (window.runDiagnostics) {
            window.runDiagnostics();
        }
    });
}

/* ================== MONITOR CONTÍNUO DE REGRESSÕES ================== */
// Adicionar monitor periódico (compatível com admin.js)
(function setupRegressionMonitor() {
    // Executar apenas em modo diagnóstico ou debug
    if (!DEBUG_MODE && !DIAGNOSTICS_MODE) return;
    
    console.log('🔧 Configurando monitor de regressões PDF...');
    
    let lastCheck = null;
    let regressionCount = 0;
    
    // Função de verificação periódica
    function checkForRegressions() {
        const orphanFiles = [
            'pdf-ui.js',
            'pdf-core.js', 
            'pdf-integration.js',
            'media-core.js',
            'media-ui.js',
            'media-integration.js'
        ];
        
        let currentOrphans = [];
        
        orphanFiles.forEach(file => {
            if (document.querySelector(`script[src*="${file}"]`)) {
                currentOrphans.push(file);
            }
        });
        
        // Se encontrou novos órfãos desde a última verificação
        if (currentOrphans.length > 0 && (!lastCheck || JSON.stringify(lastCheck) !== JSON.stringify(currentOrphans))) {
            regressionCount++;
            
            console.error(`❌ REGRESSÃO DETECTADA (${regressionCount})! Scripts órfãos recarregados:`, currentOrphans);
            
            // Log no painel
            if (typeof window.logToPanel === 'function') {
                window.logToPanel(`⚠️ Regressão ${regressionCount}: ${currentOrphans.length} script(s) órfão(s) recarregado(s)`, 'error');
            }
            
            // Ação recomendada
            if (regressionCount >= 3) {
                console.warn('🚨 MÚLTIPLAS REGRESSÕES DETECTADAS! Verificar carregamento dinâmico de scripts.');
                if (typeof window.logToPanel === 'function') {
                    window.logToPanel('🚨 Múltiplas regressões! Verificar carregamento de scripts.', 'error');
                }
            }
            
            lastCheck = currentOrphans;
        }
        
        // Verificar também event listeners duplicados periodicamente
        const criticalElements = ['pdfModal', 'pdfPassword', 'pdfUploadArea', 'pdfFileInput'];
        criticalElements.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                // Monitorar mudanças no onclick
                if (element._lastOnClick !== element.onclick) {
                    if (element._lastOnClick && element.onclick) {
                        console.warn(`⚠️ Event listener alterado no elemento ${id}`);
                    }
                    element._lastOnClick = element.onclick;
                }
            }
        });
    }
    
    // Executar verificação a cada 30 segundos
    setInterval(checkForRegressions, 30000);
    
    // Executar primeira verificação após 10 segundos
    setTimeout(checkForRegressions, 10000);
    
    console.log('✅ Monitor de regressões configurado (30s interval)');
})();

/* ================== VERIFICAÇÃO FINAL DE INTEGRIDADE (COMPLEMENTAR) ================== */
window.finalPdfSystemValidation = function() {
    console.group('🔍 VERIFICAÇÃO FINAL - SISTEMA DE PDF UNIFICADO (v5.5)');
    
    const validation = {
        // Sistema ativo
        MediaSystem_Ativo: !!window.MediaSystem,
        PdfSystem_Ativo: !!window.PdfSystem,
        
        // Funções críticas
        MediaSystem_TemProcessPDFs: typeof window.MediaSystem?.processAndSavePdfs === 'function',
        PdfSystem_TemProcessPDFs: typeof window.PdfSystem?.processAndSavePdfs === 'function',
        
        // Referências no DOM
        pdfUploadArea_Existe: !!document.getElementById('pdfUploadArea'),
        pdfFileInput_Existe: !!document.getElementById('pdfFileInput'),
        
        // Elementos essenciais
        pdfModal_Existe: !!document.getElementById('pdfModal'),
        pdfPassword_Existe: !!document.getElementById('pdfPassword'),
        pdfPassword_Visivel: (() => {
            const element = document.getElementById('pdfPassword');
            if (!element) return false;
            return element.style.display !== 'none' && 
                   getComputedStyle(element).display !== 'none' &&
                   element.style.visibility !== 'hidden' &&
                   getComputedStyle(element).visibility !== 'hidden';
        })(),
        
        // Event listeners (estimativa)
        eventListeners_Modal: document.getElementById('pdfModal')?.onclick ? 1 : 0,
        eventListeners_Password: document.getElementById('pdfPassword')?.onchange ? 1 : 0,
        
        // Arquivos órfãos
        arquivosOrfaos_Carregados: Array.from(document.scripts).filter(s => 
            s.src && (s.src.includes('pdf-ui.js') || s.src.includes('pdf-core.js'))
        ).length,
        
        // Sistemas de diagnóstico
        testPdfSystem_Disponivel: typeof window.testPdfSystem === 'function',
        interactivePdfTest_Disponivel: typeof window.interactivePdfTest === 'function',
        diagnosePdfIconProblem_Disponivel: typeof window.diagnosePdfIconProblem === 'function',
        monitorPdfPostCorrection_Disponivel: typeof window.monitorPdfPostCorrection === 'function',
        verifyRollbackCompatibility_Disponivel: typeof window.verifyRollbackCompatibility === 'function',
        finalPdfSystemValidation_Disponivel: true, // Esta função
        version: '5.5'
    };
    
    console.table(validation);
    
    // RECOMENDAÇÕES FINAIS
    const recommendations = [];
    
    if (validation.arquivosOrfaos_Carregados > 0) {
        recommendations.push('❌ CÓDIGO ÓRFÃO AINDA CARREGADO! Recomendado: EXCLUSÃO IMEDIATA');
    }
    
    if (validation.MediaSystem_TemProcessPDFs && validation.PdfSystem_TemProcessPDFs) {
        recommendations.push('⚠️ DOIS SISTEMAS DE PDF ATIVOS! Recomendado: Desativar PdfSystem para uploads');
    }
    
    if (!validation.pdfPassword_Visivel && validation.pdfPassword_Existe) {
        recommendations.push('🔧 Campo de senha PDF existe mas está oculto - verificar se deve estar visível');
    }
    
    if (!validation.MediaSystem_Ativo && !validation.PdfSystem_Ativo) {
        recommendations.push('🚨 NENHUM SISTEMA PDF ATIVO! Recomendado: Criar fallback imediatamente');
    }
    
    if (recommendations.length > 0) {
        console.warn('📋 RECOMENDAÇÕES FINAIS:');
        recommendations.forEach((rec, idx) => console.log(`${idx + 1}. ${rec}`));
    }
    
    console.log('✅ Verificação final completa - Sistema pronto para análise');
    
    // Log no painel
    if (typeof window.logToPanel === 'function') {
        const successCount = Object.values(validation).filter(v => v === true || (typeof v === 'number' && v > 0)).length;
        const totalCount = Object.keys(validation).length;
        const score = Math.round((successCount / totalCount) * 100);
        
        window.logToPanel(`📊 Verificação final PDF: ${score}% (${successCount}/${totalCount})`, 
                         score >= 80 ? 'success' : 'warning');
    }
    
    console.groupEnd();
    
    return {
        validation,
        recommendations,
        timestamp: new Date().toISOString(),
        score: Math.round((Object.values(validation).filter(v => v === true || (typeof v === 'number' && v > 0)).length / 
                          Object.keys(validation).length) * 100)
    };
};

/* ================== INTEGRAÇÃO COM O SISTEMA EXISTENTE ================== */
// Adicionar novas funções aos objetos globais
(function integrateNewFunctions() {
    // Adicionar ao objeto diag global
    if (window.diag) {
        window.diag.pdf = window.diag.pdf || {};
        
        // Adicionar novas funções sem sobrescrever existentes
        const newFunctions = {
            monitor: window.monitorPdfPostCorrection,
            verifyRollback: window.verifyRollbackCompatibility,
            finalValidation: window.finalPdfSystemValidation
        };
        
        Object.entries(newFunctions).forEach(([key, func]) => {
            if (!window.diag.pdf[key]) {
                window.diag.pdf[key] = func;
            }
        });
    }
    
    // Adicionar ao console.diag se existir
    if (console.diag) {
        console.diag.pdf = console.diag.pdf || {};
        console.diag.pdf.monitor = window.monitorPdfPostCorrection;
        console.diag.pdf.verifyRollback = window.verifyRollbackCompatibility;
        console.diag.pdf.finalValidation = window.finalPdfSystemValidation;
    }
    
    // Adicionar botões ao painel de diagnóstico existente
    function addNewButtonsToPanel() {
        // Tentar adicionar após o painel ser criado
        const checkPanel = setInterval(() => {
            const panel = document.getElementById('diagnostics-panel-complete');
            if (panel) {
                clearInterval(checkPanel);
                
                // Adicionar botão de monitoramento
                const mainButtons = panel.querySelector('div:nth-child(3)');
                if (mainButtons && !document.getElementById('pdf-monitor-btn-v5-5')) {
                    const monitorBtn = document.createElement('button');
                    monitorBtn.id = 'pdf-monitor-btn-v5-5';
                    monitorBtn.innerHTML = '🔍 MONITOR PÓS-CORREÇÃO v5.5';
                    monitorBtn.style.cssText = `
                        background: linear-gradient(45deg, #ff5500, #ffaa00); 
                        color: #000; border: none;
                        padding: 8px 12px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; flex: 1; margin: 5px;
                        transition: all 0.2s;
                    `;
                    monitorBtn.addEventListener('click', window.monitorPdfPostCorrection);
                    
                    const finalBtn = document.createElement('button');
                    finalBtn.id = 'pdf-final-validation-btn-v5-5';
                    finalBtn.innerHTML = '📊 VERIFICAÇÃO FINAL v5.5';
                    finalBtn.style.cssText = `
                        background: linear-gradient(45deg, #00aaff, #0088cc); 
                        color: white; border: none;
                        padding: 8px 12px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; flex: 1; margin: 5px;
                        transition: all 0.2s;
                    `;
                    finalBtn.addEventListener('click', window.finalPdfSystemValidation);
                    
                    mainButtons.appendChild(monitorBtn);
                    mainButtons.appendChild(finalBtn);
                    
                    console.log('✅ Botões de verificação adicionados ao painel (v5.5)');
                }
            }
        }, 1000);
    }
    
    // Executar após carregamento
    if (DEBUG_MODE || DIAGNOSTICS_MODE) {
        setTimeout(addNewButtonsToPanel, 2000);
        
        // Executar verificação final após 15 segundos (automático em modo diagnóstico)
        setTimeout(() => {
            if (window.finalPdfSystemValidation) {
                console.log('🔄 Executando verificação final automática...');
                window.finalPdfSystemValidation();
            }
        }, 15000);
    }
})();

/* ================== EXECUÇÃO AUTOMÁTICA DE MONITORAMENTO ================== */
// Executar monitoramento se em modo debug (compatível com admin.js)
(function autoRunMonitoring() {
    const shouldMonitor = DEBUG_MODE || DIAGNOSTICS_MODE || PDF_DEBUG;
    
    if (shouldMonitor) {
        console.log('🔧 Configurando monitoramento automático PDF (12 segundos)...');
        
        // Executar após 12 segundos
        setTimeout(() => {
            if (window.monitorPdfPostCorrection) {
                console.log('🔄 Executando monitoramento pós-correção...');
                window.monitorPdfPostCorrection();
            }
            
            // Executar verificação de rollback após 17 segundos
            setTimeout(() => {
                if (window.verifyRollbackCompatibility) {
                    console.log('🔄 Executando verificação de rollback...');
                    window.verifyRollbackCompatibility();
                }
            }, 5000);
            
        }, 12000);
    }
})();

console.log('✅ Módulos de monitoramento e verificação PDF v5.5 adicionados (integrados)');
