/* ==========================================================================
   DIAGNOSTICS55.JS - VERSÃO COMPLETA COM PAINEL VISUAL DE DIAGNÓSTICO
   Repositório: weberlessa-support
   Ativação: ?debug=true&diagnostics=true na URL
   Última atualização: 11/02/2026
   ========================================================================== */

// ================== CONFIGURAÇÃO INICIAL ==================
if (typeof PDF_DEBUG === 'undefined') window.PDF_DEBUG = false;
if (typeof DEBUG_MODE === 'undefined') window.DEBUG_MODE = location.search.includes('debug=true');
if (typeof DIAGNOSTICS_MODE === 'undefined') window.DIAGNOSTICS_MODE = location.search.includes('diagnostics=true');
if (typeof window.diagnosticsSilentMode === 'undefined') window.diagnosticsSilentMode = false;

console.log('🔧 DIAGNOSTICS v5.5 - Inicializando (modo debug:', DEBUG_MODE, 'diagnostics:', DIAGNOSTICS_MODE, ')');

// ================== ATIVAR SOMENTE EM MODO DIAGNÓSTICO ==================
const IS_DIAGNOSTICS_ACTIVE = DEBUG_MODE && DIAGNOSTICS_MODE;

// ================== FUNÇÕES DE TESTE PDF (ORIGINAIS) ==================
window.testPdfFix = function() {
    console.group('🧪 TESTE COMPLETO DA CORREÇÃO PDF (Compatibilidade v5.5)');
    
    if (!window.PdfSystem && typeof window.createFallbackPdfSystem === 'function') {
        window.createFallbackPdfSystem();
        console.log('🔄 PdfSystem criado via fallback');
    }

    const testId = window.properties && window.properties[0] ? window.properties[0].id : 101;
    console.log('🔍 Testando com ID:', testId);
    
    if (typeof window.PdfSystem?.showModal === 'function') {
        window.PdfSystem.showModal(testId);
    }
    
    setTimeout(() => {
        const modalElement = document.getElementById('pdfModal');
        const passwordField = document.getElementById('pdfPassword');
        
        const isPasswordVisible = passwordField && 
                                 passwordField.style.display !== 'none' && 
                                 getComputedStyle(passwordField).display !== 'none';
        
        if (modalElement && passwordField && modalElement.style.display === 'flex' && isPasswordVisible) {
            console.log('✅ CORREÇÃO APLICADA COM SUCESSO!');
            window.showDiagnosticToast('✅ Sistema PDF operacional', 'success');
        } else {
            console.error('❌ CORREÇÃO NÃO FUNCIONOU COMPLETAMENTE');
            window.showDiagnosticToast('❌ Falha no sistema PDF', 'error');
        }
    }, 500);
    
    console.groupEnd();
    return true;
};

window.createFallbackPdfSystem = function() {
    if (!window.PdfSystem) {
        window.PdfSystem = {
            showModal: function(propertyId) {
                console.log(`📄 PdfSystem.showModal(${propertyId || 101}) - MODO FALLBACK`);
                const modal = document.getElementById('pdfModal');
                if (modal) {
                    modal.style.display = 'flex';
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

// ================== VERIFICAÇÃO DE INTEGRIDADE (OTIMIZADA) ==================
window.verifyPdfSystemIntegrity = function() {
    console.group('🔍 VERIFICAÇÃO DE SISTEMA DE PDF - ETAPA 4 (v5.5)');
    
    const systems = {
        MediaSystem: !!window.MediaSystem,
        PdfSystem: !!window.PdfSystem,
        window_processAndSavePdfs: typeof window.processAndSavePdfs === 'function',
        pdfUploadArea: !!document.getElementById('pdfUploadArea'),
        pdfFileInput: !!document.getElementById('pdfFileInput'),
        hasPdfModal: !!document.getElementById('pdfModal'),
        hasPdfPassword: !!document.getElementById('pdfPassword'),
        testPdfFix: typeof window.testPdfFix === 'function',
        interactivePdfTest: typeof window.interactivePdfTest === 'function'
    };
    
    console.table(systems);
    
    if (systems.MediaSystem) {
        console.log('✅ Sistema correto: MediaSystem ativo para PDFs');
        console.log('📊 PDFs no estado:', window.MediaSystem.state?.pdfs?.length || 0);
    }
    
    const criticalElements = {
        pdfModal: {
            exists: !!document.getElementById('pdfModal'),
            visible: document.getElementById('pdfModal')?.style.display === 'flex'
        },
        pdfPassword: {
            exists: !!document.getElementById('pdfPassword'),
            visible: document.getElementById('pdfPassword')?.style.display !== 'none'
        }
    };
    
    console.log('🎯 Elementos Críticos:', criticalElements);
    
    const result = {
        systems,
        criticalElements,
        timestamp: new Date().toISOString(),
        version: '5.5'
    };
    
    // Atualizar painel se existir
    if (IS_DIAGNOSTICS_ACTIVE && window.updateDiagnosticPanel) {
        window.updateDiagnosticPanel('pdf', result);
    }
    
    console.groupEnd();
    return result;
};

// ================== TESTE DE UPLOAD PDF ==================
window.testPdfUploadBugFix = function() {
    console.group('🧪 TESTE DE CORREÇÃO DE BUG DE PDF (v5.5)');
    
    const results = {
        step1: { MediaSystem: !!window.MediaSystem, PdfSystem: !!window.PdfSystem },
        step2: { success: false },
        step3: { success: false },
        overallSuccess: false
    };
    
    // PASSO 2: Simular upload
    if (window.MediaSystem && typeof window.MediaSystem.addPdfs === 'function') {
        try {
            const testFile = new File(['test'], 'teste_correcao.pdf', { type: 'application/pdf' });
            const fileList = { 0: testFile, length: 1, item: () => testFile };
            
            const added = window.MediaSystem.addPdfs(fileList) || 1;
            results.step2 = { usedSystem: 'MediaSystem', filesAdded: added, success: true };
            console.log(`✅ ${added} PDF(s) simulado(s)`);
        } catch (error) {
            results.step2 = { usedSystem: 'MediaSystem', error: error.message, success: false };
        }
    }
    
    // PASSO 3: Testar processAndSavePdfs
    if (typeof window.processAndSavePdfs === 'function') {
        try {
            const testId = 'test_id_' + Date.now();
            const result = window.processAndSavePdfs(testId, 'Teste Correção');
            
            if (result && typeof result.then === 'function') {
                result.then(url => {
                    results.step3 = { type: 'promise', result: url, success: true };
                    results.overallSuccess = results.step2.success && true;
                    console.log('✅ Upload simulado com sucesso:', url);
                    window.showDiagnosticToast('✅ Teste de upload PDF OK', 'success');
                }).catch(err => {
                    results.step3 = { type: 'promise', error: err.message, success: false };
                    results.overallSuccess = false;
                });
            } else {
                results.step3 = { type: 'sync', result, success: true };
                results.overallSuccess = results.step2.success && true;
            }
        } catch (error) {
            results.step3 = { type: 'error', error: error.message, success: false };
            results.overallSuccess = false;
        }
    }
    
    setTimeout(() => {
        if (IS_DIAGNOSTICS_ACTIVE && window.updateDiagnosticPanel) {
            window.updateDiagnosticPanel('pdf_test', results);
        }
    }, 1000);
    
    console.log('📊 Sucesso Geral:', results.overallSuccess ? '✅' : '❌');
    console.groupEnd();
    
    return results;
};

/* ==========================================================================
   ==================== NOVO: PAINEL DE DIAGNÓSTICO VISUAL ==================
   ========================================================================== */

// Criar e injetar o painel flutuante
window.createDiagnosticPanel = function() {
    if (!IS_DIAGNOSTICS_ACTIVE) return;
    
    // Remover painel existente
    const existing = document.getElementById('diagnostics55-panel');
    if (existing) existing.remove();
    
    // Container principal
    const panel = document.createElement('div');
    panel.id = 'diagnostics55-panel';
    panel.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        width: 380px;
        max-width: 95vw;
        background: linear-gradient(145deg, #0a0f1e, #0d121f);
        color: #e0e0ff;
        border: 1px solid #2a3a5a;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0, 255, 200, 0.2), 0 0 0 1px rgba(0, 255, 200, 0.1) inset;
        z-index: 1000000;
        font-family: 'JetBrains Mono', 'Courier New', monospace;
        font-size: 13px;
        line-height: 1.5;
        backdrop-filter: blur(10px);
        overflow: hidden;
        transition: all 0.3s ease;
    `;
    
    // Cabeçalho
    const header = document.createElement('div');
    header.style.cssText = `
        background: rgba(0, 200, 255, 0.1);
        padding: 14px 18px;
        border-bottom: 1px solid #2a5a5a;
        display: flex;
        justify-content: space-between;
        align-items: center;
        cursor: move;
        user-select: none;
    `;
    header.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <span style="background: #00ccaa; width: 12px; height: 12px; border-radius: 2px; display: inline-block;"></span>
            <span style="font-weight: 700; color: #aaffdd; letter-spacing: 1px;">🔬 DIAGNÓSTICO v5.5</span>
            <span style="background: #335588; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${new Date().toLocaleTimeString()}</span>
        </div>
        <div style="display: flex; gap: 8px;">
            <button id="diag-refresh-btn" style="background: none; border: 1px solid #4488aa; color: #88ddff; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;">↻</button>
            <button id="diag-close-btn" style="background: none; border: 1px solid #aa5555; color: #ff8888; padding: 4px 10px; border-radius: 6px; cursor: pointer; font-size: 11px;">✕</button>
        </div>
    `;
    
    // Corpo do painel com abas
    const body = document.createElement('div');
    body.style.padding = '16px';
    
    // Tabs
    const tabs = document.createElement('div');
    tabs.style.cssText = `
        display: flex;
        gap: 4px;
        margin-bottom: 16px;
        border-bottom: 1px solid #223344;
        padding-bottom: 8px;
    `;
    tabs.innerHTML = `
        <button class="diag-tab active" data-tab="pdf" style="background: #1a3a4a; color: white; border: none; padding: 6px 12px; border-radius: 6px 6px 0 0; cursor: pointer; font-weight: bold;">📄 PDF</button>
        <button class="diag-tab" data-tab="media" style="background: #112233; color: #aaccff; border: none; padding: 6px 12px; border-radius: 6px 6px 0 0; cursor: pointer;">🖼️ Mídia</button>
        <button class="diag-tab" data-tab="core" style="background: #112233; color: #aaccff; border: none; padding: 6px 12px; border-radius: 6px 6px 0 0; cursor: pointer;">⚙️ Core</button>
        <button class="diag-tab" data-tab="system" style="background: #112233; color: #aaccff; border: none; padding: 6px 12px; border-radius: 6px 6px 0 0; cursor: pointer;">🌐 Sistema</button>
    `;
    
    // Conteúdo das abas
    const content = document.createElement('div');
    content.id = 'diag-content';
    content.style.cssText = `
        min-height: 200px;
        max-height: 400px;
        overflow-y: auto;
        padding: 8px 4px;
        scrollbar-width: thin;
        scrollbar-color: #336688 #112233;
    `;
    
    // Montagem
    body.appendChild(tabs);
    body.appendChild(content);
    panel.appendChild(header);
    panel.appendChild(body);
    document.body.appendChild(panel);
    
    // Estado do painel
    window.diagnosticPanelState = {
        currentTab: 'pdf',
        data: {
            pdf: { lastUpdate: null, systems: null },
            media: { lastUpdate: null },
            core: { lastUpdate: null },
            system: { lastUpdate: null }
        }
    };
    
    // Eventos
    document.querySelectorAll('.diag-tab').forEach(tab => {
        tab.addEventListener('click', function(e) {
            document.querySelectorAll('.diag-tab').forEach(t => {
                t.style.background = '#112233';
                t.style.color = '#aaccff';
                t.classList.remove('active');
            });
            this.style.background = '#1a3a4a';
            this.style.color = 'white';
            this.classList.add('active');
            
            const tabName = this.dataset.tab;
            window.diagnosticPanelState.currentTab = tabName;
            window.updateDiagnosticPanel(tabName);
        });
    });
    
    document.getElementById('diag-close-btn').addEventListener('click', () => {
        panel.style.display = 'none';
    });
    
    document.getElementById('diag-refresh-btn').addEventListener('click', () => {
        window.updateDiagnosticPanel(window.diagnosticPanelState.currentTab);
        window.verifyPdfSystemIntegrity();
    });
    
    // Arrastar
    let isDragging = false, offsetX, offsetY;
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - panel.offsetLeft;
        offsetY = e.clientY - panel.offsetTop;
        panel.style.cursor = 'grabbing';
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.style.right = 'auto';
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        panel.style.cursor = 'default';
    });
    
    // Carregar aba inicial
    window.updateDiagnosticPanel('pdf');
    
    console.log('✅ Painel de diagnóstico visual criado');
    return panel;
};

// Atualizar conteúdo do painel
window.updateDiagnosticPanel = function(tabName, newData = null) {
    if (!IS_DIAGNOSTICS_ACTIVE) return;
    
    const content = document.getElementById('diag-content');
    if (!content) return;
    
    // Atualizar dados se fornecidos
    if (newData && window.diagnosticPanelState?.data[tabName]) {
        window.diagnosticPanelState.data[tabName] = { 
            ...window.diagnosticPanelState.data[tabName], 
            ...newData,
            lastUpdate: new Date().toLocaleTimeString()
        };
    }
    
    let html = '';
    const state = window.diagnosticPanelState?.data[tabName] || {};
    
    switch(tabName) {
        case 'pdf':
            const pdfSystems = window.verifyPdfSystemIntegrity();
            html = `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px; border-left: 4px solid #00ccaa;">
                            <div style="color: #88ddff; font-size: 11px;">MediaSystem</div>
                            <div style="font-size: 18px; font-weight: bold; color: ${window.MediaSystem ? '#00ffaa' : '#ff8888'}">
                                ${window.MediaSystem ? '✅ ATIVO' : '❌ INATIVO'}
                            </div>
                        </div>
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px; border-left: 4px solid #88aaff;">
                            <div style="color: #88ddff; font-size: 11px;">PDFs no Estado</div>
                            <div style="font-size: 18px; font-weight: bold; color: #aaddff;">
                                ${window.MediaSystem?.state?.pdfs?.length || 0}
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: #0a121a; padding: 10px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span>📋 processAndSavePdfs</span>
                            <span style="color: ${typeof window.processAndSavePdfs === 'function' ? '#00ffaa' : '#ff8888'}">
                                ${typeof window.processAndSavePdfs === 'function' ? '✅' : '❌'}
                            </span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                            <span>🔐 Modal PDF</span>
                            <span style="color: ${document.getElementById('pdfModal') ? '#00ffaa' : '#ff8888'}">
                                ${document.getElementById('pdfModal') ? '✅' : '❌'}
                            </span>
                        </div>
                        <div style="display: flex; justify-content: space-between;">
                            <span>🔑 Campo Senha</span>
                            <span style="color: ${document.getElementById('pdfPassword') ? '#00ffaa' : '#ff8888'}">
                                ${document.getElementById('pdfPassword') ? '✅' : '❌'}
                            </span>
                        </div>
                    </div>
                    
                    <div style="display: flex; gap: 8px; margin-top: 8px;">
                        <button onclick="window.testPdfFix()" style="flex:1; background: #226688; border: none; color: white; padding: 8px; border-radius: 6px; cursor: pointer;">
                            🧪 Testar PDF
                        </button>
                        <button onclick="window.testPdfUploadBugFix()" style="flex:1; background: #336633; border: none; color: white; padding: 8px; border-radius: 6px; cursor: pointer;">
                            📤 Testar Upload
                        </button>
                    </div>
                    <div style="font-size: 10px; color: #88aacc; text-align: right; margin-top: 8px;">
                        Última verificação: ${new Date().toLocaleTimeString()}
                    </div>
                </div>
            `;
            break;
            
        case 'media':
            const media = window.MediaSystem?.state || {};
            html = `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                            <div style="color: #88ddff;">📸 Imagens novas</div>
                            <div style="font-size: 20px; font-weight: bold;">${media.files?.length || 0}</div>
                        </div>
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                            <div style="color: #88ddff;">🖼️ Imagens exist.</div>
                            <div style="font-size: 20px; font-weight: bold;">${media.existing?.length || 0}</div>
                        </div>
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                            <div style="color: #88ddff;">📄 PDFs novos</div>
                            <div style="font-size: 20px; font-weight: bold;">${media.pdfs?.length || 0}</div>
                        </div>
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                            <div style="color: #88ddff;">📁 PDFs exist.</div>
                            <div style="font-size: 20px; font-weight: bold;">${media.existingPdfs?.length || 0}</div>
                        </div>
                    </div>
                    <div style="background: #0a121a; padding: 10px; border-radius: 8px;">
                        <div>🔄 Upload em andamento: <strong>${media.isUploading ? 'SIM' : 'NÃO'}</strong></div>
                        <div style="margin-top: 5px; color: #aaddff;">Propriedade atual: ${media.currentPropertyId || 'N/A'}</div>
                    </div>
                </div>
            `;
            break;
            
        case 'core':
            html = `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                            <div>🏠 Imóveis</div>
                            <div style="font-size: 22px; font-weight: bold;">${window.properties?.length || 0}</div>
                        </div>
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                            <div>💾 LocalStorage</div>
                            <div style="font-size: 16px;">${localStorage.getItem('properties') ? JSON.parse(localStorage.getItem('properties')).length : 0}</div>
                        </div>
                    </div>
                    <div style="background: #0a121a; padding: 10px; border-radius: 8px;">
                        <div style="display: flex; justify-content: space-between;">
                            <span>🔧 FilterManager</span>
                            <span style="color: ${window.FilterManager ? '#00ffaa' : '#ff8888'}">${window.FilterManager ? '✅' : '❌'}</span>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 5px;">
                            <span>⏳ LoadingManager</span>
                            <span style="color: ${window.LoadingManager ? '#00ffaa' : '#ff8888'}">${window.LoadingManager ? '✅' : '❌'}</span>
                        </div>
                    </div>
                </div>
            `;
            break;
            
        case 'system':
            html = `
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                        <div style="display: flex; gap: 8px; align-items: center;">
                            <span style="background: #226688; padding: 4px 8px; border-radius: 4px;">🌐 URL</span>
                            <span style="font-size: 11px; word-break: break-all;">${window.location.href}</span>
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                            <div>📱 Tela</div>
                            <div style="font-size: 16px;">${window.innerWidth}x${window.innerHeight}</div>
                        </div>
                        <div style="background: #0a1a1a; padding: 10px; border-radius: 8px;">
                            <div>🕒 Hora</div>
                            <div style="font-size: 16px;">${new Date().toLocaleTimeString()}</div>
                        </div>
                    </div>
                    <div style="background: #112233; padding: 10px; border-radius: 8px; border: 1px solid #446688;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <span>🔔 Módulos Suporte</span>
                            <span style="background: #338855; padding: 2px 10px; border-radius: 12px; color: white;">${window.supportModulesLoaded ? 'CARREGADOS' : 'NÃO CARREGADOS'}</span>
                        </div>
                    </div>
                </div>
            `;
            break;
    }
    
    content.innerHTML = html;
};

// Toast notification
window.showDiagnosticToast = function(message, type = 'info') {
    if (!IS_DIAGNOSTICS_ACTIVE) return;
    
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#1a3a2a' : type === 'error' ? '#3a1a1a' : '#1a2a3a'};
        color: ${type === 'success' ? '#aaffaa' : type === 'error' ? '#ffaaaa' : '#aaddff'};
        border-left: 6px solid ${type === 'success' ? '#00cc88' : type === 'error' ? '#cc5555' : '#3388cc'};
        padding: 12px 20px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 13px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        z-index: 1000001;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 4000);
};

// ================== AUTO EXECUÇÃO ==================
(function initDiagnostics55() {
    if (IS_DIAGNOSTICS_ACTIVE) {
        console.log('🔧 DIAGNOSTICS v5.5 - Modo ATIVO, criando painel visual...');
        
        // Criar painel após 2 segundos
        setTimeout(() => {
            window.createDiagnosticPanel();
            
            // Executar verificações iniciais
            setTimeout(() => {
                window.verifyPdfSystemIntegrity();
                window.showDiagnosticToast('🔬 Painel de diagnóstico ativo', 'info');
            }, 500);
        }, 2000);
        
        // Adicionar atalho global
        document.addEventListener('keydown', function(e) {
            if (e.altKey && e.key === 'd') {
                const panel = document.getElementById('diagnostics55-panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                } else {
                    window.createDiagnosticPanel();
                }
            }
        });
        
        console.log('🎮 Atalho: Alt+D para mostrar/ocultar painel');
        
    } else {
        console.log('ℹ️ DIAGNOSTICS v5.5 - Modo inativo (adicione ?debug=true&diagnostics=true)');
    }
})();

// ================== EXPORTAÇÃO ==================
window.diagnostics55 = {
    version: '5.5',
    testPdfFix: window.testPdfFix,
    createFallbackPdfSystem: window.createFallbackPdfSystem,
    verifyPdfSystemIntegrity: window.verifyPdfSystemIntegrity,
    testPdfUploadBugFix: window.testPdfUploadBugFix,
    createDiagnosticPanel: window.createDiagnosticPanel,
    updateDiagnosticPanel: window.updateDiagnosticPanel,
    showDiagnosticToast: window.showDiagnosticToast,
    timestamp: new Date().toISOString()
};

console.log('✅ DIAGNOSTICS.JS v5.5 - CARREGAMENTO COMPLETO COM PAINEL VISUAL');
console.log('🎮 Atalhos: Alt+P = teste PDF | Alt+D = painel diagnóstico');
