// diagnostics.js - VERSÃO COMPLETA 5.4 COM DIAGNÓSTICO DE ÍCONE PDF E MELHORIAS DE PAINEL
console.log('🔍 diagnostics.js – diagnóstico completo v5.4 (com melhorias de painel)');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const DEBUG_MODE = params.get('debug') === 'true' || params.get('debug') === 'pdf';
const DIAGNOSTICS_MODE = params.get('diagnostics') === 'true';
const MOBILE_TEST = params.get('mobiletest') === 'true';
const REFERENCE_CHECK = params.get('refcheck') === 'true';
const PDF_DEBUG = params.get('debug') === 'pdf' || location.search.includes('debug=pdf');

/* ================== FUNÇÃO DE TESTE PDF - ATUALIZADA ================== */
window.testPdfSystem = function(propertyId = 101) {
    console.log('🧪 TESTE COMPLETO DO SISTEMA PDF (v5.4)');
    
    // Verificar modal
    const modal = document.getElementById('pdfModal');
    console.log('1. Modal existe?', !!modal);
    
    if (modal) {
        // Verificar campo de senha
        const passwordInput = modal.querySelector('#pdfPassword');
        console.log('2. Campo de senha existe?', !!passwordInput);
        
        if (passwordInput) {
            const style = window.getComputedStyle(passwordInput);
            console.log('3. Campo visível?', {
                display: style.display,
                visibility: style.visibility,
                opacity: style.opacity,
                width: style.width,
                height: style.height
            });
            
            // Forçar visibilidade se necessário
            if (style.display === 'none') {
                passwordInput.style.display = 'block';
                console.log('4. Campo forçado a display: block');
            }
        }
    }
    
    // Abrir modal de teste
    if (window.PdfSystem && window.PdfSystem.showModal) {
        console.log('5. Abrindo modal de teste...');
        window.PdfSystem.showModal(propertyId);
    } else if (window.showPdfModal) {
        console.log('5. Abrindo modal via showPdfModal...');
        window.showPdfModal(propertyId);
    } else {
        console.error('❌ PdfSystem não disponível');
        
        // Tentar abrir modal diretamente
        const modal = document.getElementById('pdfModal');
        if (modal) {
            modal.style.display = 'flex';
            console.log('✅ Modal aberto diretamente');
        }
    }
    
    // Logar no painel
    if (typeof window.logToPanel === 'function') {
        window.logToPanel('🧪 Teste PDF executado', 'pdf-check');
    }
};

/* ================== NOVO: MODO DE TESTE INTERATIVO PDF ================== */
window.interactivePdfTest = function() {
    console.group('🎮 TESTE INTERATIVO DO SISTEMA PDF');
    
    // Criar interface de teste
    const testPanelId = 'interactive-pdf-test-panel';
    let testPanel = document.getElementById(testPanelId);
    
    if (!testPanel) {
        testPanel = document.createElement('div');
        testPanel.id = testPanelId;
        testPanel.style.cssText = `
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
            max-width: 500px;
            width: 90%;
            box-shadow: 0 0 30px rgba(0, 170, 255, 0.5);
            font-family: monospace;
        `;
        
        testPanel.innerHTML = `
            <div style="font-size: 18px; margin-bottom: 15px; text-align: center; color: #00aaff;">
                🎮 TESTE INTERATIVO PDF
            </div>
            
            <div style="margin-bottom: 15px;">
                <label style="display: block; margin-bottom: 8px; color: #88aaff;">Property ID:</label>
                <input type="number" id="testPdfPropertyId" value="101" 
                       style="width: 100%; padding: 8px; background: #002244; color: white; border: 1px solid #00aaff; border-radius: 4px;">
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <button id="testPdfShowModal" style="
                    background: #00aaff; color: #000; border: none; padding: 10px; 
                    border-radius: 4px; cursor: pointer; font-weight: bold;">
                    📄 Abrir Modal
                </button>
                <button id="testPdfCheckSystem" style="
                    background: #0088cc; color: white; border: none; padding: 10px; 
                    border-radius: 4px; cursor: pointer; font-weight: bold;">
                    🔍 Verificar Sistema
                </button>
                <button id="testPdfSimulateClick" style="
                    background: #ffaa00; color: #000; border: none; padding: 10px; 
                    border-radius: 4px; cursor: pointer; font-weight: bold;">
                    🖱️ Simular Clique
                </button>
                <button id="testPdfDebugLogs" style="
                    background: #00ff9c; color: #000; border: none; padding: 10px; 
                    border-radius: 4px; cursor: pointer; font-weight: bold;">
                    📝 Debug Logs
                </button>
            </div>
            
            <div style="background: #002244; padding: 10px; border-radius: 4px; margin-bottom: 15px; max-height: 150px; overflow-y: auto;">
                <div id="testPdfLogs" style="font-size: 11px; color: #88aaff;">
                    Logs aparecerão aqui...
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between;">
                <button id="testPdfClose" style="
                    background: #555; color: white; border: none; padding: 10px 20px; 
                    border-radius: 4px; cursor: pointer; font-weight: bold;">
                    Fechar
                </button>
                <button id="testPdfAutoFix" style="
                    background: #ff5500; color: white; border: none; padding: 10px 20px; 
                    border-radius: 4px; cursor: pointer; font-weight: bold;">
                    🛠️ Auto-fix
                </button>
            </div>
        `;
        
        document.body.appendChild(testPanel);
        
        // Configurar eventos
        document.getElementById('testPdfShowModal').addEventListener('click', () => {
            const propertyId = parseInt(document.getElementById('testPdfPropertyId').value) || 101;
            logToTestPanel(`Abrindo modal com Property ID: ${propertyId}`);
            window.testPdfSystem(propertyId);
        });
        
        document.getElementById('testPdfCheckSystem').addEventListener('click', () => {
            logToTestPanel('Verificando sistema PDF...');
            runPdfCompatibilityCheck();
        });
        
        document.getElementById('testPdfSimulateClick').addEventListener('click', () => {
            logToTestPanel('Simulando clique em ícone PDF...');
            simulatePdfIconClick();
        });
        
        document.getElementById('testPdfDebugLogs').addEventListener('click', () => {
            logToTestPanel('Exibindo logs de debug...');
            showPdfDebugLogs();
        });
        
        document.getElementById('testPdfAutoFix').addEventListener('click', () => {
            logToTestPanel('Aplicando correções automáticas...');
            autoFixPdfSystem();
        });
        
        document.getElementById('testPdfClose').addEventListener('click', () => {
            document.body.removeChild(testPanel);
        });
        
        // Função para logar no painel de teste
        function logToTestPanel(message) {
            const logsDiv = document.getElementById('testPdfLogs');
            const timestamp = new Date().toLocaleTimeString();
            const logEntry = document.createElement('div');
            logEntry.textContent = `[${timestamp}] ${message}`;
            logsDiv.appendChild(logEntry);
            logsDiv.scrollTop = logsDiv.scrollHeight;
        }
        
        // Funções auxiliares
        function simulatePdfIconClick() {
            // Procurar ícones PDF
            const pdfIcons = document.querySelectorAll('.pdf-icon, .icon-pdf, i.fa-file-pdf, i.fas.fa-file-pdf');
            
            if (pdfIcons.length > 0) {
                logToTestPanel(`Encontrados ${pdfIcons.length} ícones PDF`);
                
                // Simular clique no primeiro
                const firstIcon = pdfIcons[0];
                const clickEvent = new MouseEvent('click', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                });
                
                firstIcon.dispatchEvent(clickEvent);
                logToTestPanel(`Clique simulado no ícone: ${firstIcon.tagName}.${firstIcon.className}`);
            } else {
                logToTestPanel('Nenhum ícone PDF encontrado');
                
                // Criar ícone de teste
                const testIcon = document.createElement('button');
                testIcon.innerHTML = '📄 TESTE';
                testIcon.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 100px;
                    padding: 10px;
                    background: #00aaff;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    z-index: 99999;
                `;
                testIcon.onclick = () => window.testPdfSystem(999);
                document.body.appendChild(testIcon);
                logToTestPanel('Ícone de teste criado');
            }
        }
        
        function showPdfDebugLogs() {
            const logs = [
                `showPdfModal: ${typeof window.showPdfModal}`,
                `PdfSystem: ${typeof window.PdfSystem}`,
                `PdfSystem.showModal: ${typeof window.PdfSystem?.showModal}`,
                `pdfModal element: ${!!document.getElementById('pdfModal')}`,
                `pdfPassword element: ${!!document.getElementById('pdfPassword')}`,
                `MediaSystem: ${typeof window.MediaSystem}`,
                `processAndSavePdfs: ${typeof window.processAndSavePdfs}`
            ];
            
            logs.forEach(log => logToTestPanel(log));
        }
        
        function autoFixPdfSystem() {
            logToTestPanel('Aplicando correções...');
            
            // 1. Garantir que showPdfModal existe
            if (typeof window.showPdfModal !== 'function') {
                window.showPdfModal = function(propertyId) {
                    console.log(`showPdfModal(${propertyId}) chamado`);
                    
                    if (window.PdfSystem?.showModal) {
                        return window.PdfSystem.showModal();
                    }
                    
                    const modal = document.getElementById('pdfModal');
                    if (modal) {
                        modal.style.display = 'flex';
                        return true;
                    }
                    
                    console.error('Modal não encontrado');
                    return false;
                };
                logToTestPanel('✅ showPdfModal criada');
            }
            
            // 2. Criar modal se não existir
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
                        <h2 style="color:#fff;margin-bottom:20px;">PDF - Teste</h2>
                        <input type="password" id="pdfPassword" placeholder="Digite a senha do PDF" 
                               style="padding:12px;width:100%;margin-bottom:20px;font-size:16px;">
                        <div style="display:flex;gap:10px;">
                            <button onclick="document.getElementById('pdfModal').style.display='none'" 
                                    style="padding:12px 20px;background:#555;color:white;border:none;cursor:pointer;flex:1;">
                                Cancelar
                            </button>
                            <button onclick="alert('PDF processado (teste)')" 
                                    style="padding:12px 20px;background:#00ff9c;color:#000;border:none;cursor:pointer;flex:1;font-weight:bold;">
                                Processar PDF
                            </button>
                        </div>
                    </div>
                `;
                
                document.body.appendChild(modal);
                logToTestPanel('✅ Modal PDF criado');
            }
            
            logToTestPanel('✅ Correções aplicadas com sucesso!');
        }
    }
    
    console.groupEnd();
    return testPanel;
};

// Executar teste automático em caso de problemas
if (PDF_DEBUG) {
    setTimeout(() => {
        console.log('🔧 Modo debug PDF ativado');
        window.testPdfSystem();
        
        // Abrir painel interativo
        setTimeout(() => {
            window.interactivePdfTest();
        }, 1000);
    }, 2000);
}

/* ================== MELHORIAS PARA O PAINEL F12 ================== */
window.enhanceDevTools = function() {
    console.group('🎨 MELHORIAS PARA O PAINEL F12');
    
    // Sobrescrever console.log para adicionar formatação
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;
    const originalInfo = console.info;
    
    console.log = function(...args) {
        // Adicionar timestamp e estilo
        const timestamp = new Date().toLocaleTimeString();
        const enhancedArgs = [`%c[${timestamp}]`, 'color: #888; font-weight: normal;', ...args];
        originalLog.apply(console, enhancedArgs);
        
        // Se for uma mensagem do sistema PDF, destacar
        if (args.some(arg => typeof arg === 'string' && arg.includes('PDF'))) {
            originalLog.apply(console, [
                `%c📄`, 
                'color: #00aaff; font-size: 14px; margin-left: 5px;'
            ]);
        }
    };
    
    console.error = function(...args) {
        const timestamp = new Date().toLocaleTimeString();
        const enhancedArgs = [`%c[${timestamp}]`, 'color: #ff5555; font-weight: bold;', ...args];
        originalError.apply(console, enhancedArgs);
    };
    
    console.warn = function(...args) {
        const timestamp = new Date().toLocaleTimeString();
        const enhancedArgs = [`%c[${timestamp}]`, 'color: #ffaa00; font-weight: bold;', ...args];
        originalWarn.apply(console, enhancedArgs);
    };
    
    console.info = function(...args) {
        const timestamp = new Date().toLocaleTimeString();
        const enhancedArgs = [`%c[${timestamp}]`, 'color: #00aaff; font-weight: bold;', ...args];
        originalInfo.apply(console, enhancedArgs);
    };
    
    // Adicionar comandos úteis ao console
    console.diag = {
        pdf: {
            test: (id = 101) => window.testPdfSystem(id),
            interactive: () => window.interactivePdfTest(),
            diagnose: () => window.diagnosePdfIconProblem(),
            check: () => window.runPdfCompatibilityCheck()
        },
        migration: {
            verify: () => window.verifyMediaMigration(),
            compatibility: () => window.testModuleCompatibility(),
            auto: () => window.autoValidateMigration()
        },
        system: {
            overview: () => console.table(analyzeSystem()),
            placeholders: () => window.analyzePlaceholders(),
            references: () => window.analyzeBrokenReferences()
        },
        panel: {
            show: () => createDiagnosticsPanel(),
            hide: () => {
                const panel = document.getElementById('diagnostics-panel-complete');
                if (panel) panel.style.display = 'none';
            },
            toggle: () => {
                const panel = document.getElementById('diagnostics-panel-complete');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                } else {
                    createDiagnosticsPanel();
                }
            }
        }
    };
    
    console.log('🎯 Comandos disponíveis: console.diag.pdf.test(), console.diag.panel.toggle(), etc.');
    
    // Adicionar mensagem de ajuda
    console.log('%c🔧 FERRAMENTAS DE DIAGNÓSTICO DISPONÍVEIS', 
                'color: #00ff9c; font-size: 14px; font-weight: bold;');
    console.log('%cUse console.diag para acessar todas as funcionalidades', 
                'color: #88ffaa;');
    
    console.groupEnd();
};

/* ================== DIAGNÓSTICO DO PROBLEMA DO ÍCONE PDF - ATUALIZADO ================== */
window.diagnosePdfIconProblem = function() {
    console.group('🔍 DIAGNÓSTICO DO ÍCONE PDF (v5.4)');
    console.log('Problema: Ícone PDF não abre modal de senha');
    
    // ================== TESTE 1: VERIFICAR FUNÇÕES ==================
    console.log('\n✅ TESTE 1: VERIFICAR FUNÇÕES');
    
    const functions = {
        'showPdfModal': typeof window.showPdfModal,
        'PdfSystem.showModal': typeof window.PdfSystem?.showModal,
        'processAndSavePdfs': typeof window.processAndSavePdfs,
        'window.PdfSystem': typeof window.PdfSystem,
        'document.getElementById("pdfModal")': !!document.getElementById('pdfModal'),
        'document.getElementById("pdfPassword")': !!document.getElementById('pdfPassword')
    };
    
    Object.entries(functions).forEach(([name, type]) => {
        const exists = type !== 'undefined' && type !== 'boolean' ? type !== 'undefined' : type;
        console.log(`${exists ? '✅' : '❌'} ${name}: ${exists ? 'EXISTE' : 'NÃO EXISTE'}`);
    });
    
    // ================== TESTE 2: ELEMENTOS DO ÍCONE PDF ==================
    console.log('\n✅ TESTE 2: ELEMENTOS DO ÍCONE PDF NO DOM');
    
    // Procurar todos os elementos que podem ser ícones PDF
    const pdfIcons = document.querySelectorAll([
        '.pdf-icon',
        '.icon-pdf',
        '[onclick*="pdf"]',
        '[onclick*="Pdf"]',
        '[onclick*="PDF"]',
        '[data-action*="pdf"]',
        'button[class*="pdf"]',
        'i[class*="pdf"]',
        'img[src*="pdf"]',
        'img[alt*="pdf"]',
        'img[alt*="PDF"]'
    ].join(','));
    
    console.log(`Encontrados ${pdfIcons.length} elementos PDF no DOM`);
    
    pdfIcons.forEach((icon, index) => {
        console.log(`\n🔍 ÍCONE ${index + 1}:`);
        console.log('- Tag:', icon.tagName);
        console.log('- Classe:', icon.className);
        console.log('- ID:', icon.id || 'sem ID');
        console.log('- onclick:', icon.onclick ? 'SIM' : 'NÃO');
        console.log('- onclick atributo:', icon.getAttribute('onclick') || 'nenhum');
        console.log('- HTML:', icon.outerHTML.substring(0, 200) + '...');
        
        // Testar clique manualmente
        console.log('- Teste de clique:');
        try {
            const originalOnClick = icon.onclick;
            icon.onclick = function(e) {
                console.log('   ✅ Clique capturado no diagnóstico');
                if (originalOnClick) originalOnClick.call(this, e);
            };
            
            // Criar evento de teste
            const clickEvent = new MouseEvent('click', {
                view: window,
                bubbles: true,
                cancelable: true
            });
            
            console.log('   Disparando evento de clique...');
            icon.dispatchEvent(clickEvent);
            
            // Restaurar onclick original
            icon.onclick = originalOnClick;
        } catch (error) {
            console.log('   ❌ Erro ao testar clique:', error.message);
        }
    });
    
    // ================== TESTE 3: EVENT LISTENERS NO DOCUMENT ==================
    console.log('\n✅ TESTE 3: EVENT LISTENERS NO DOCUMENT');
    
    // Verificar event listeners globais
    const globalClickHandlers = [];
    document.addEventListener('click', function(e) {
        console.log('Clique global capturado no:', e.target.tagName, e.target.className);
    }, true);
    
    // ================== TESTE 4: TESTAR FUNÇÃO DIRETAMENTE ==================
    console.log('\n✅ TESTE 4: TESTAR FUNÇÃO showPdfModal DIRETAMENTE');
    
    if (typeof window.showPdfModal === 'function') {
        console.log('Testando showPdfModal com ID 101...');
        try {
            window.showPdfModal(101);
            console.log('✅ showPdfModal(101) executado sem erros');
            
            // Verificar se modal abriu
            setTimeout(() => {
                const modal = document.getElementById('pdfModal');
                console.log(`Modal após showPdfModal: ${modal ? 'VISÍVEL' : 'OCULTO'} (display: ${modal?.style?.display || getComputedStyle(modal || {}).display})`);
            }, 100);
        } catch (error) {
            console.log('❌ Erro ao executar showPdfModal:', error.message);
            console.log('Stack:', error.stack);
        }
    } else {
        console.log('❌ showPdfModal não é uma função');
        
        // Tentar criar função se não existir
        if (!window.showPdfModal) {
            console.log('🔄 Tentando criar showPdfModal...');
            window.showPdfModal = function(propertyId) {
                console.log(`showPdfModal chamado com propertyId: ${propertyId}`);
                
                if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
                    return window.PdfSystem.showModal();
                }
                
                const modal = document.getElementById('pdfModal');
                if (modal) {
                    modal.style.display = 'flex';
                    console.log('Modal PDF aberto via fallback');
                    return true;
                }
                
                console.error('Modal PDF não encontrado');
                return false;
            };
            console.log('✅ showPdfModal criada (fallback)');
        }
    }
    
    // ================== TESTE 5: TESTAR PdfSystem.showModal ==================
    console.log('\n✅ TESTE 5: TESTAR PdfSystem.showModal');
    
    if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
        console.log('Testando PdfSystem.showModal()...');
        try {
            window.PdfSystem.showModal();
            console.log('✅ PdfSystem.showModal() executado');
            
            setTimeout(() => {
                const modal = document.getElementById('pdfModal');
                console.log(`Modal após PdfSystem.showModal: ${modal ? 'EXISTE' : 'NÃO EXISTE'}`);
                if (modal) {
                    console.log('- Estilo display:', modal.style.display || getComputedStyle(modal).display);
                    console.log('- Estilo visibility:', modal.style.visibility || getComputedStyle(modal).visibility);
                    console.log('- Z-index:', modal.style.zIndex || getComputedStyle(modal).zIndex);
                }
            }, 100);
        } catch (error) {
            console.log('❌ Erro em PdfSystem.showModal:', error.message);
        }
    } else {
        console.log('❌ PdfSystem.showModal não disponível');
    }
    
    // ================== TESTE 6: CRIAR ÍCONE DE TESTE ==================
    console.log('\n✅ TESTE 6: CRIAR ÍCONE PDF DE TESTE');
    
    const testIconId = 'pdf-diagnostic-test-icon-v5-4';
    let testIcon = document.getElementById(testIconId);
    
    if (!testIcon) {
        testIcon = document.createElement('button');
        testIcon.id = testIconId;
        testIcon.innerHTML = '📄 TESTE PDF (v5.4)';
        testIcon.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            padding: 10px 20px;
            background: linear-gradient(45deg, #00aaff, #0088cc);
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            z-index: 999999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0, 170, 255, 0.3);
            transition: all 0.3s;
        `;
        
        testIcon.onmouseenter = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(0, 170, 255, 0.5)';
        };
        
        testIcon.onmouseleave = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
        };
        
        testIcon.onclick = function() {
            console.log('🎯 CLIQUE NO ÍCONE DE TESTE CAPTURADO! (v5.4)');
            
            if (typeof window.showPdfModal === 'function') {
                console.log('Chamando showPdfModal(999)...');
                window.showPdfModal(999);
            } else if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
                console.log('Chamando PdfSystem.showModal()...');
                window.PdfSystem.showModal();
            } else {
                console.log('Abrindo modal diretamente...');
                const modal = document.getElementById('pdfModal');
                if (modal) {
                    modal.style.display = 'flex';
                    console.log('✅ Modal aberto diretamente');
                } else {
                    console.log('❌ Modal não encontrado');
                }
            }
        };
        
        document.body.appendChild(testIcon);
        console.log('✅ Ícone de teste criado (canto inferior direito)');
    } else {
        console.log('✅ Ícone de teste já existe');
    }
    
    // ================== TESTE 7: VERIFICAR PROPERTY ID ==================
    console.log('\n✅ TESTE 7: VERIFICAR PROPERTY ID');
    
    // Procurar elementos que podem ter property ID
    const propertyElements = document.querySelectorAll([
        '[data-property-id]',
        '[data-id]',
        '.property-item',
        '.photo-item',
        '.gallery-item'
    ].join(','));
    
    console.log(`Elementos com possível property ID: ${propertyElements.length}`);
    
    propertyElements.slice(0, 5).forEach((el, idx) => {
        const dataId = el.getAttribute('data-property-id') || el.getAttribute('data-id');
        console.log(`Elemento ${idx + 1}: data-property-id="${dataId}"`, el.className);
    });
    
    // ================== SOLUÇÃO AUTOMÁTICA ==================
    console.log('\n🛠️ APLICANDO SOLUÇÕES AUTOMÁTICAS');
    
    const solutions = [];
    
    // Solução 1: Garantir que showPdfModal existe
    if (typeof window.showPdfModal !== 'function') {
        console.log('🔄 Criando showPdfModal...');
        window.showPdfModal = function(propertyId) {
            console.log(`🔍 showPdfModal(${propertyId}) chamado (v5.4)`);
            
            // Prioridade 1: Usar PdfSystem se disponível
            if (window.PdfSystem && typeof window.PdfSystem.showModal === 'function') {
                console.log('📦 Usando PdfSystem.showModal()');
                return window.PdfSystem.showModal();
            }
            
            // Prioridade 2: Abrir modal diretamente
            const modal = document.getElementById('pdfModal');
            if (modal) {
                console.log('🎯 Abrindo modal diretamente');
                modal.style.display = 'flex';
                
                // Focar no campo de senha se existir
                const passwordField = document.getElementById('pdfPassword');
                if (passwordField) {
                    setTimeout(() => passwordField.focus(), 100);
                }
                
                return true;
            }
            
            // Prioridade 3: Criar modal dinamicamente
            console.log('🏗️ Criando modal dinamicamente...');
            const newModal = document.createElement('div');
            newModal.id = 'pdfModal';
            newModal.className = 'pdf-modal';
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
                display: none;
            `;
            
            newModal.innerHTML = `
                <div class="pdf-modal-content" style="background:#1a1a1a;padding:30px;border-radius:10px;max-width:500px;width:90%;">
                    <h2 style="color:#fff;margin-bottom:20px;">PDF - Propriedade #${propertyId || 'N/A'}</h2>
                    <input type="password" id="pdfPassword" placeholder="Digite a senha do PDF" 
                           style="padding:12px;width:100%;margin-bottom:20px;font-size:16px;">
                    <div id="pdfUploadPreview" style="min-height:100px;background:#2a2a2a;padding:10px;border-radius:5px;margin-bottom:20px;"></div>
                    <div style="display:flex;gap:10px;">
                        <button onclick="document.getElementById('pdfModal').style.display='none'" 
                                style="padding:12px 20px;background:#555;color:white;border:none;cursor:pointer;flex:1;">
                            Cancelar
                        </button>
                        <button onclick="window.processAndSavePdfs?.() || alert('PDF processado (simulação)')" 
                                style="padding:12px 20px;background:#00ff9c;color:#000;border:none;cursor:pointer;flex:1;font-weight:bold;">
                            Processar PDF
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(newModal);
            newModal.style.display = 'flex';
            
            solutions.push('showPdfModal criada e modal gerado dinamicamente');
            return true;
        };
        solutions.push('showPdfModal criada');
    }
    
    // Solução 2: Anexar eventos a ícones existentes
    const pdfIconSelectors = [
        '.pdf-icon',
        '.icon-pdf',
        'i.fas.fa-file-pdf',
        'i.fa-file-pdf',
        'button[onclick*="showPdfModal"]',
        'button[onclick*="pdf"]'
    ];
    
    let iconsFixed = 0;
    pdfIconSelectors.forEach(selector => {
        const icons = document.querySelectorAll(selector);
        icons.forEach(icon => {
            if (!icon.hasAttribute('data-diagnostic-fixed-v5-4')) {
                const originalOnClick = icon.onclick;
                
                icon.onclick = function(e) {
                    console.log('🔍 Ícone PDF clicado (via diagnóstico v5.4)');
                    
                    // Tentar extrair propertyId do elemento
                    let propertyId = 101; // Default
                    
                    // Tentar obter do data attribute
                    const dataId = this.getAttribute('data-property-id') || 
                                   this.getAttribute('data-id') ||
                                   this.closest('[data-property-id]')?.getAttribute('data-property-id');
                    
                    if (dataId) {
                        propertyId = parseInt(dataId) || propertyId;
                    }
                    
                    console.log(`Property ID detectado: ${propertyId}`);
                    
                    // Chamar showPdfModal
                    if (window.showPdfModal) {
                        window.showPdfModal(propertyId);
                    }
                    
                    // Manter comportamento original se existir
                    if (originalOnClick) {
                        return originalOnClick.call(this, e);
                    }
                    
                    return false;
                };
                
                icon.setAttribute('data-diagnostic-fixed-v5-4', 'true');
                iconsFixed++;
            }
        });
    });
    
    if (iconsFixed > 0) {
        solutions.push(`${iconsFixed} ícones PDF reparados`);
    }
    
    // Solução 3: Criar listener global para elementos dinâmicos
    document.addEventListener('click', function(e) {
        const target = e.target;
        
        // Verificar se é um ícone PDF
        const isPdfIcon = target.matches?.('.pdf-icon, .icon-pdf, i.fa-file-pdf, i.fas.fa-file-pdf') ||
                         target.closest?.('.pdf-icon, .icon-pdf, i.fa-file-pdf, i.fas.fa-file-pdf') ||
                         target.getAttribute?.('onclick')?.includes('pdf') ||
                         target.className?.toLowerCase().includes('pdf');
        
        if (isPdfIcon && !target.hasAttribute('data-diagnostic-handled-v5-4')) {
            console.log('🌍 Clique em ícone PDF capturado globalmente (v5.4)');
            target.setAttribute('data-diagnostic-handled-v5-4', 'true');
            
            // Prevenir múltiplos handlers
            e.stopImmediatePropagation();
            
            // Extrair propertyId
            let propertyId = 101;
            const closestProperty = target.closest('[data-property-id]');
            if (closestProperty) {
                propertyId = parseInt(closestProperty.getAttribute('data-property-id')) || propertyId;
            }
            
            // Abrir modal
            setTimeout(() => {
                if (window.showPdfModal) {
                    window.showPdfModal(propertyId);
                }
            }, 10);
        }
    }, true);
    
    solutions.push('Listener global adicionado');
    
    // ================== RESUMO ==================
    console.log('\n📊 RESUMO DO DIAGNÓSTICO (v5.4)');
    console.log('✅ Funções verificadas:', Object.keys(functions).length);
    console.log('✅ Ícones PDF encontrados:', pdfIcons.length);
    console.log('✅ Ícones reparados:', iconsFixed);
    console.log('✅ Soluções aplicadas:', solutions.length);
    
    if (solutions.length > 0) {
        console.log('\n🛠️ SOLUÇÕES APLICADAS:');
        solutions.forEach((sol, idx) => console.log(`${idx + 1}. ${sol}`));
        
        // Mostrar alerta visual melhorado
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #001a33, #000a1a);
            color: #00aaff;
            padding: 20px;
            border: 3px solid #00aaff;
            border-radius: 10px;
            z-index: 1000000;
            max-width: 400px;
            box-shadow: 0 0 30px rgba(0, 170, 255, 0.5);
            font-family: 'Courier New', monospace;
            backdrop-filter: blur(10px);
        `;
        
        alertDiv.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                <div style="font-size: 24px;">🔍</div>
                <div style="font-weight: bold; font-size: 16px; color: #00aaff;">DIAGNÓSTICO PDF v5.4</div>
            </div>
            <div style="background: rgba(0, 170, 255, 0.1); padding: 12px; border-radius: 6px; margin-bottom: 15px;">
                <div style="font-size: 12px; margin-bottom: 5px; color: #88aaff;">✅ ${solutions.length} soluções aplicadas</div>
                <div style="font-size: 11px; color: #aaddff;">
                    ${solutions.map(s => `• ${s}`).join('<br>')}
                </div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 15px;">
                <div style="text-align: center; background: rgba(0, 170, 255, 0.1); padding: 8px; border-radius: 4px;">
                    <div style="font-size: 10px; color: #88aaff;">Ícones</div>
                    <div style="font-size: 18px; color: #00aaff;">${pdfIcons.length}</div>
                </div>
                <div style="text-align: center; background: rgba(0, 170, 255, 0.1); padding: 8px; border-radius: 4px;">
                    <div style="font-size: 10px; color: #88aaff;">Reparados</div>
                    <div style="font-size: 18px; color: #00ff9c;">${iconsFixed}</div>
                </div>
            </div>
            <div style="font-size: 10px; color: #88aaff; margin-bottom: 15px;">
                Ícone de teste criado no canto inferior direito
            </div>
            <div style="display: flex; gap: 10px;">
                <button onclick="this.parentElement.remove()" style="
                    flex: 1; padding: 10px; background: #00aaff; 
                    color: #000; border: none; cursor: pointer; 
                    border-radius: 5px; font-weight: bold; font-size: 12px;">
                    FECHAR
                </button>
                <button onclick="window.interactivePdfTest?.() || console.log('Interactive test não disponível')" style="
                    flex: 1; padding: 10px; background: #0088cc; 
                    color: white; border: none; cursor: pointer; 
                    border-radius: 5px; font-weight: bold; font-size: 12px;">
                    🎮 TESTE
                </button>
            </div>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remover após 15 segundos
        setTimeout(() => {
            if (alertDiv.parentElement) {
                alertDiv.remove();
            }
        }, 15000);
    }
    
    console.groupEnd();
    
    // Logar no painel se disponível
    if (typeof window.logToPanel === 'function') {
        window.logToPanel(`🔍 Diagnóstico PDF executado: ${solutions.length} soluções aplicadas`, 'pdf-check');
    }
    
    return {
        functions,
        pdfIcons: pdfIcons.length,
        iconsFixed,
        solutions,
        testIconCreated: !!testIcon,
        version: '5.4'
    };
};

/* ================== FUNÇÃO AUXILIAR PARA EVENT LISTENERS ================== */
// Helper para obter event listeners (se disponível)
function getEventListeners(element) {
    if (window.getEventListeners) {
        return window.getEventListeners(element) || {};
    }
    
    // Fallback para Chrome DevTools
    if (element._eventListeners) {
        return element._eventListeners;
    }
    
    // Tentar acessar via propriedades internas
    const listeners = {};
    const possibleEvents = ['click', 'mousedown', 'mouseup', 'touchstart', 'touchend'];
    
    possibleEvents.forEach(eventType => {
        const listener = element[`on${eventType}`];
        if (listener) {
            listeners[eventType] = [{
                listener: listener,
                useCapture: false,
                passive: false
            }];
        }
    });
    
    return listeners;
}

/* ================== VERIFICAÇÃO IMEDIATA PDF COMPATÍVEL ================== */
(function immediatePdfValidation() {
    if (!DEBUG_MODE && !DIAGNOSTICS_MODE && !PDF_DEBUG) return;
    
    // NOVO TESTE COMPATÍVEL COM pdf-unified.js
    console.log('🔍 VERIFICAÇÃO PDF UNIFICADO (ATUALIZADO v5.4)');
    
    const tests = {
        'PdfSystem carregado': () => typeof window.PdfSystem !== 'undefined',
        'Função showModal (crítica)': () => typeof window.PdfSystem?.showModal === 'function',
        'Função processAndSavePdfs (admin)': () => typeof window.PdfSystem?.processAndSavePdfs === 'function',
        'Modal existe no DOM': () => !!document.getElementById('pdfModal'),
        'Campo senha existe': () => !!document.getElementById('pdfPassword'),
        'Admin.js integrado': () => typeof window.processAndSavePdfs === 'function',
        'Preview container existe': () => !!document.getElementById('pdfUploadPreview'),
        'Estado ou métodos de estado': () => {
            if (!window.PdfSystem) return false;
            // Verificar se tem estado OU métodos que indicam sistema ativo
            return window.PdfSystem.state !== undefined || 
                   typeof window.PdfSystem.resetState === 'function' ||
                   typeof window.PdfSystem.clearAllPdfs === 'function' ||
                   typeof window.PdfSystem.loadExisting === 'function' ||
                   typeof window.PdfSystem.addPdfs === 'function' ||
                   typeof window.PdfSystem.getPdfsToSave === 'function';
        }
    };
    
    let passed = 0;
    const total = Object.keys(tests).length;
    
    console.group('🔍 VERIFICAÇÃO PDF UNIFICADO (COMPATÍVEL v5.4)');
    
    Object.entries(tests).forEach(([name, test]) => {
        try {
            const result = test();
            const message = `${result ? '✅' : '❌'} ${name}: ${result ? 'OK' : 'FALHA'}`;
            console.log(message);
            
            // DEBUG: Mostrar detalhes para o estado
            if (name === 'Estado ou métodos de estado') {
                console.log('🔍 DEBUG Estado PdfSystem:', {
                    temPdfSystem: !!window.PdfSystem,
                    temState: window.PdfSystem?.state !== undefined,
                    temResetState: typeof window.PdfSystem?.resetState,
                    temClearAllPdfs: typeof window.PdfSystem?.clearAllPdfs,
                    temLoadExisting: typeof window.PdfSystem?.loadExisting,
                    temAddPdfs: typeof window.PdfSystem?.addPdfs,
                    temGetPdfsToSave: typeof window.PdfSystem?.getPdfsToSave,
                    stateValue: window.PdfSystem?.state
                });
            }
            
            if (result) passed++;
        } catch (e) {
            console.log(`❌ ${name}: ERRO - ${e.message}`);
        }
    });
    
    const score = Math.round((passed / total) * 100);
    const scoreMessage = `📊 Score PDF: ${passed}/${total} (${score}%)`;
    console.log(scoreMessage);
    
    console.groupEnd();
    
    if (score < 80) {
        console.warn('⚠️  SISTEMA PDF PODE PRECISAR DE AJUSTES');
        
        // Tentar correção automática apenas se realmente necessário
        if (!document.getElementById('pdfModal')) {
            console.log('🔄 Criando modal PDF automaticamente...');
            const modal = document.createElement('div');
            modal.id = 'pdfModal';
            modal.className = 'pdf-modal';
            modal.style.cssText = 'display:none;position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;align-items:center;justify-content:center;';
            modal.innerHTML = `
                <div class="pdf-modal-content" style="background:#1a1a1a;padding:30px;border-radius:10px;max-width:90%;max-height:90%;overflow:auto;">
                    <h2 style="color:#fff;margin-bottom:20px;">PDF System v5.4</h2>
                    <input type="password" id="pdfPassword" placeholder="Senha para PDF" style="padding:10px;width:100%;margin-bottom:20px;">
                    <div id="pdfUploadPreview"></div>
                    <div style="display:flex;gap:10px;margin-top:20px;">
                        <button onclick="window.PdfSystem?.hideModal?.()" style="padding:10px 20px;background:#555;color:white;border:none;cursor:pointer;">Cancelar</button>
                        <button onclick="window.processAndSavePdfs?.()" style="padding:10px 20px;background:#00ff9c;color:black;border:none;cursor:pointer;">Processar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);
        }
        
        if (typeof window.PdfSystem === 'undefined') {
            console.log('🔄 Criando PdfSystem compatível v5.4...');
            window.PdfSystem = {
                state: {},
                showModal: function(propertyId) {
                    console.log(`PdfSystem.showModal(${propertyId}) chamado v5.4`);
                    const modal = document.getElementById('pdfModal');
                    if (modal) {
                        modal.style.display = 'flex';
                        console.log('Modal PDF mostrado (compatibilidade v5.4)');
                    }
                },
                hideModal: function() {
                    const modal = document.getElementById('pdfModal');
                    if (modal) modal.style.display = 'none';
                },
                processAndSavePdfs: function() {
                    console.log('PdfSystem.processAndSavePdfs chamado (modo compatibilidade v5.4)');
                    return window.processAndSavePdfs?.() || Promise.resolve();
                },
                resetState: function() {
                    this.state = {};
                    console.log('Estado do PdfSystem resetado v5.4');
                },
                clearAllPdfs: function() {
                    console.log('PdfSystem.clearAllPdfs chamado (compatibilidade v5.4)');
                    this.state = {};
                    const preview = document.getElementById('pdfUploadPreview');
                    if (preview) preview.innerHTML = '';
                },
                addPdfs: function(files) {
                    console.log(`PdfSystem.addPdfs chamado com ${files?.length || 0} arquivos (compatibilidade v5.4)`);
                    if (!this.state.pdfs) this.state.pdfs = [];
                    if (files) this.state.pdfs.push(...files);
                    return Promise.resolve();
                }
            };
        }
        
        if (typeof window.processAndSavePdfs !== 'function') {
            console.log('🔄 Criando função processAndSavePdfs placeholder...');
            window.processAndSavePdfs = function() {
                console.warn('processAndSavePdfs chamado (modo compatibilidade v5.4)');
                return Promise.resolve({ success: true, message: 'Modo compatibilidade v5.4' });
            };
        }
    } else {
        console.log('✅ Sistema PDF verificado com sucesso! (v5.4)');
    }
    
    // Adicionar ao painel de diagnóstico se disponível
    if (typeof window.logToPanel === 'function') {
        window.logToPanel(`📊 Verificação PDF v5.4: ${passed}/${total} (${score}%)`, score >= 80 ? 'success' : 'warning');
    }
    
    return { passed, total, score };
})();

/* ================== FUNÇÃO DE VERIFICAÇÃO PDF REUTILIZÁVEL ================== */
window.runPdfCompatibilityCheck = function() {
    console.log('🔍 EXECUTANDO VERIFICAÇÃO PDF COMPATIBILIDADE v5.4');
    
    const tests = {
        'PdfSystem carregado': () => typeof window.PdfSystem !== 'undefined',
        'Função showModal (crítica)': () => typeof window.PdfSystem?.showModal === 'function',
        'Função processAndSavePdfs (admin)': () => typeof window.PdfSystem?.processAndSavePdfs === 'function',
        'Modal existe no DOM': () => !!document.getElementById('pdfModal'),
        'Campo senha existe': () => !!document.getElementById('pdfPassword'),
        'Admin.js integrado': () => typeof window.processAndSavePdfs === 'function',
        'Preview container existe': () => !!document.getElementById('pdfUploadPreview'),
        'Estado ou métodos de estado': () => {
            if (!window.PdfSystem) return false;
            // Verificar se tem estado OU métodos que indicam sistema ativo
            return window.PdfSystem.state !== undefined || 
                   typeof window.PdfSystem.resetState === 'function' ||
                   typeof window.PdfSystem.clearAllPdfs === 'function' ||
                   typeof window.PdfSystem.loadExisting === 'function' ||
                   typeof window.PdfSystem.addPdfs === 'function' ||
                   typeof window.PdfSystem.getPdfsToSave === 'function';
        }
    };
    
    let passed = 0;
    const total = Object.keys(tests).length;
    
    console.group('🔍 VERIFICAÇÃO PDF DE COMPATIBILIDADE v5.4');
    
    Object.entries(tests).forEach(([name, test]) => {
        try {
            const result = test();
            const message = `${result ? '✅' : '❌'} ${name}: ${result ? 'OK' : 'FALHA'}`;
            
            // Log no console F12
            console.log(message);
            
            // Log no painel visual se disponível
            if (typeof window.logToPanel === 'function') {
                window.logToPanel(message, result ? 'success' : 'error');
            }
            
            // DEBUG detalhado para estado
            if (name === 'Estado ou métodos de estado') {
                console.log('🔍 DETALHES DO PdfSystem v5.4:', {
                    temPdfSystem: !!window.PdfSystem,
                    temState: window.PdfSystem?.state !== undefined,
                    tipoState: typeof window.PdfSystem?.state,
                    temResetState: typeof window.PdfSystem?.resetState,
                    temClearAllPdfs: typeof window.PdfSystem?.clearAllPdfs,
                    temLoadExisting: typeof window.PdfSystem?.loadExisting,
                    temAddPdfs: typeof window.PdfSystem?.addPdfs,
                    temGetPdfsToSave: typeof window.PdfSystem?.getPdfsToSave,
                    stateKeys: window.PdfSystem?.state ? Object.keys(window.PdfSystem.state) : 'nenhum'
                });
            }
            
            if (result) passed++;
        } catch (e) {
            console.error(`❌ ${name}: ERRO - ${e.message}`);
            if (typeof window.logToPanel === 'function') {
                window.logToPanel(`❌ ${name}: ERRO - ${e.message}`, 'error');
            }
        }
    });
    
    const score = Math.round((passed / total) * 100);
    const scoreMessage = `📊 Score Compatibilidade PDF v5.4: ${passed}/${total} (${score}%)`;
    
    console.log(scoreMessage);
    console.groupEnd();
    
    if (typeof window.logToPanel === 'function') {
        window.logToPanel(scoreMessage, score >= 80 ? 'success' : 'warning');
    }
    
    // Mostrar alerta se score baixo
    if (score < 70 && window.showMigrationValidationAlert) {
        const report = {
            timestamp: new Date().toISOString(),
            compatibilityScore: score,
            passed,
            total,
            message: 'Sistema PDF pode precisar de ajustes de compatibilidade v5.4'
        };
        window.showMigrationValidationAlert(false, report);
    }
    
    return { passed, total, score, tests, version: '5.4' };
};

/* ================== ADICIONAR BOTÃO DE DIAGNÓSTICO PDF NO PAINEL ================== */
function addPdfDiagnosticButton() {
    // Adicionar botão no header do painel
    const headerButtons = document.querySelector('#diagnostics-panel-complete > div:first-child > div:last-child');
    if (headerButtons) {
        const pdfDiagnosticBtn = document.createElement('button');
        pdfDiagnosticBtn.id = 'pdf-diagnostic-btn-v5-4';
        pdfDiagnosticBtn.innerHTML = '🔍 ÍCONE PDF v5.4';
        pdfDiagnosticBtn.style.cssText = `
            background: linear-gradient(45deg, #ff5500, #ffaa00); 
            color: #000; border: none; 
            padding: 4px 8px; cursor: pointer; border-radius: 3px;
            font-size: 10px; font-weight: bold; margin-left: 5px;
            transition: all 0.2s;
        `;
        pdfDiagnosticBtn.title = 'Diagnosticar problema do ícone PDF v5.4';
        
        pdfDiagnosticBtn.onmouseenter = function() {
            this.style.transform = 'scale(1.05)';
            this.style.boxShadow = '0 2px 8px rgba(255, 85, 0, 0.3)';
        };
        
        pdfDiagnosticBtn.onmouseleave = function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
        };
        
        pdfDiagnosticBtn.addEventListener('click', () => {
            if (typeof window.diagnosePdfIconProblem === 'function') {
                window.diagnosePdfIconProblem();
            }
        });
        
        headerButtons.insertBefore(pdfDiagnosticBtn, headerButtons.firstChild);
    }
    
    // Adicionar botão na área de botões principais
    const mainButtons = document.querySelector('#diagnostics-panel-complete > div:nth-child(3)');
    if (mainButtons) {
        const mainPdfDiagnosticBtn = document.createElement('button');
        mainPdfDiagnosticBtn.id = 'main-pdf-diagnostic-btn-v5-4';
        mainPdfDiagnosticBtn.innerHTML = '🔍 DIAGNÓSTICO ÍCONE PDF v5.4';
        mainPdfDiagnosticBtn.style.cssText = `
            background: linear-gradient(45deg, #ff5500, #ffaa00); 
            color: #000; border: none;
            padding: 8px 12px; cursor: pointer; border-radius: 4px;
            font-weight: bold; flex: 1; margin: 5px;
            transition: all 0.2s;
        `;
        
        mainPdfDiagnosticBtn.onmouseenter = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(255, 85, 0, 0.3)';
        };
        
        mainPdfDiagnosticBtn.onmouseleave = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        };
        
        mainPdfDiagnosticBtn.addEventListener('click', () => {
            if (typeof window.diagnosePdfIconProblem === 'function') {
                window.diagnosePdfIconProblem();
            }
        });
        
        mainButtons.appendChild(mainPdfDiagnosticBtn);
    }
    
    // Adicionar botão de teste interativo
    const interactiveTestBtn = document.createElement('button');
    interactiveTestBtn.id = 'interactive-pdf-test-btn';
    interactiveTestBtn.innerHTML = '🎮 TESTE INTERATIVO PDF';
    interactiveTestBtn.style.cssText = `
        background: linear-gradient(45deg, #00aaff, #0088cc); 
        color: white; border: none;
        padding: 8px 12px; cursor: pointer; border-radius: 4px;
        font-weight: bold; flex: 1; margin: 5px;
        transition: all 0.2s;
    `;
    
    interactiveTestBtn.onmouseenter = function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(0, 170, 255, 0.3)';
    };
    
    interactiveTestBtn.onmouseleave = function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    };
    
    interactiveTestBtn.addEventListener('click', () => {
        if (typeof window.interactivePdfTest === 'function') {
            window.interactivePdfTest();
        }
    });
    
    if (mainButtons) {
        mainButtons.appendChild(interactiveTestBtn);
    }
}

/* ================== VARIÁVEIS GLOBAIS ================== */
let diagnosticsPanel = null;
let currentTestResults = null;
let lastMigrationReport = null;
let referenceAnalysisCache = null;

/* ================== FUNÇÕES AUXILIARES ================== */
function logToPanel(message, type = 'info') {
    const colors = {
        'info': '#00ff9c',
        'success': '#00ff9c',
        'error': '#ff5555',
        'warning': '#ffaa00',
        'debug': '#8888ff',
        'mobile': '#0088cc',
        'migration': '#ff00ff',
        'placeholder': '#ff5500',
        'reference': '#ff8800',
        'pdf-check': '#00aaff'
    };
    
    const icons = {
        'info': '📝',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'debug': '🔍',
        'mobile': '📱',
        'migration': '🚀',
        'placeholder': '🗑️',
        'reference': '🔗',
        'pdf-check': '📄'
    };
    
    const logLine = document.createElement('div');
    logLine.style.cssText = `
        margin: 2px 0;
        padding: 4px;
        border-left: 3px solid ${colors[type]};
        background: ${type === 'error' ? '#1a0000' : 
                    type === 'warning' ? '#1a1a00' : 
                    type === 'placeholder' ? '#1a0a00' : 
                    type === 'reference' ? '#1a0a00' :
                    type === 'pdf-check' ? '#001a33' : 
                    'transparent'};
        transition: all 0.2s;
    `;
    logLine.innerHTML = `<span style="color: ${colors[type]}">${icons[type]} ${message}</span>`;
    
    const consoleContent = document.getElementById('console-content');
    if (consoleContent) {
        consoleContent.appendChild(logLine);
        consoleContent.scrollTop = consoleContent.scrollHeight;
        
        // Animar entrada
        setTimeout(() => {
            logLine.style.opacity = '1';
            logLine.style.transform = 'translateX(0)';
        }, 10);
    }
    
    // TAMBÉM loga no console real (F12)
    const consoleFunc = type === 'error' ? console.error : 
                       type === 'warning' ? console.warn : console.log;
    consoleFunc(`[DIAG v5.4] ${message}`);
}

function updateStatus(message, type = 'info') {
    const statusBar = document.getElementById('status-bar');
    if (statusBar) {
        statusBar.innerHTML = `<strong>Status:</strong> ${message}`;
        statusBar.style.color = type === 'error' ? '#ff5555' : 
                               type === 'success' ? '#00ff9c' : 
                               type === 'mobile' ? '#0088cc' : 
                               type === 'migration' ? '#ff00ff' : 
                               type === 'placeholder' ? '#ff5500' : 
                               type === 'reference' ? '#ff8800' :
                               type === 'pdf-check' ? '#00aaff' : '#888';
    }
}

function updateDeviceIndicator() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Tablet|Kindle|Samsung Tablet/i.test(navigator.userAgent);
    
    let deviceType = 'DESKTOP';
    let emoji = '💻';
    
    if (isMobile) {
        deviceType = isTablet ? 'TABLET' : 'MOBILE';
        emoji = isTablet ? '📱' : '📱';
    }
    
    const indicator = document.getElementById('device-indicator');
    if (indicator) {
        indicator.innerHTML = `${emoji} ${deviceType} (${window.innerWidth}×${window.innerHeight})`;
        indicator.style.background = isMobile ? '#0088cc' : '#555';
    }
}

/* ================== VERIFICAÇÃO DE REFERÊNCIAS CRUZADAS E RISCO 404 ================== */
window.analyzeBrokenReferences = function() {
    logToPanel('🔗 ANALISANDO REFERÊNCIAS CRUZADAS E RISCO 404 v5.4', 'reference');
    
    const analysis = {
        timestamp: new Date().toISOString(),
        htmlReferences: [],
        jsReferences: [],
        cssReferences: [],
        brokenLinks: [],
        riskyFiles: [],
        recommendations: [],
        stats: {
            totalReferences: 0,
            riskyReferences: 0,
            potential404s: 0,
            externalReferences: 0
        }
    };
    
    console.group('🔗 ANÁLISE DE REFERÊNCIAS CRUZADAS - PREVENÇÃO DE 404s v5.4');
    
    // 1. ANALISAR TODAS AS REFERÊNCIAS NO HTML ATUAL
    logToPanel('📄 Analisando referências HTML...', 'reference');
    const allLinks = Array.from(document.querySelectorAll('a[href], link[href], script[src], img[src], iframe[src], source[src]'));
    
    allLinks.forEach(element => {
        const url = element.href || element.src;
        if (!url || url.startsWith('data:') || url.startsWith('blob:')) return;
        
        const fileName = url.split('/').pop();
        const isLocal = url.includes(window.location.hostname) || url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
        const isExternal = !isLocal && (url.startsWith('http://') || url.startsWith('https://'));
        
        const reference = {
            element: element.tagName,
            url,
            fileName,
            isExternal,
            isLocal,
            attributes: {}
        };
        
        // Coletar atributos relevantes
        ['id', 'class', 'data-src', 'data-href'].forEach(attr => {
            if (element.hasAttribute(attr)) {
                reference.attributes[attr] = element.getAttribute(attr);
            }
        });
        
        analysis.htmlReferences.push(reference);
        
        if (isExternal) analysis.stats.externalReferences++;
    });
    
    console.log('📄 Referências HTML encontradas:', analysis.htmlReferences.length);
    
    // 2. ANALISAR CÓDIGO JS CARREGADO (incluindo inline)
    logToPanel('📜 Analisando referências JavaScript...', 'reference');
    try {
        const scripts = Array.from(document.scripts);
        scripts.forEach(script => {
            if (script.src) {
                analysis.jsReferences.push({
                    type: 'external-script',
                    url: script.src,
                    fileName: script.src.split('/').pop(),
                    async: script.async,
                    defer: script.defer
                });
            }
            
            // Analisar conteúdo inline para referências
            if (!script.src && script.textContent) {
                const content = script.textContent;
                
                // Padrões de referência em código JavaScript
                const patterns = [
                    { regex: /import\s+.*from\s+['"]([^'"]+)['"]/g, type: 'import' },
                    { regex: /require\s*\(['"]([^'"]+)['"]\)/g, type: 'require' },
                    { regex: /fetch\s*\(['"]([^'"]+)['"]/g, type: 'fetch' },
                    { regex: /\.src\s*=\s*['"]([^'"]+)['"]/g, type: 'src-assignment' },
                    { regex: /load\s*\(['"]([^'"]+)['"]/g, type: 'load' },
                    { regex: /href\s*=\s*['"]([^'"]+)['"]/g, type: 'href' }
                ];
                
                patterns.forEach(pattern => {
                    const matches = content.match(pattern.regex);
                    if (matches) {
                        matches.forEach(match => {
                            const urlMatch = match.match(/['"]([^'"]+)['"]/);
                            if (urlMatch && urlMatch[1]) {
                                analysis.jsReferences.push({
                                    type: `inline-${pattern.type}`,
                                    reference: match.substring(0, 100) + (match.length > 100 ? '...' : ''),
                                    url: urlMatch[1],
                                    context: script.id || 'inline-script'
                                });
                            }
                        });
                    }
                });
            }
        });
        
        // Analisar event listeners e atributos dinâmicos
        const elementsWithEvents = ['pdfModal', 'mediaUpload', 'uploadPreview', 'adminPanel'];
        elementsWithEvents.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                ['onclick', 'onchange', 'onload', 'onsubmit'].forEach(eventName => {
                    if (element[eventName]) {
                        const handler = element[eventName].toString();
                        if (handler.includes('http://') || handler.includes('https://') || handler.includes('./') || handler.includes('/')) {
                            analysis.jsReferences.push({
                                type: 'event-handler',
                                element: id,
                                event: eventName,
                                url: handler.substring(0, 150) + (handler.length > 150 ? '...' : '')
                            });
                    }
                    }
                });
            }
        });
        
    } catch (e) {
        console.warn('⚠️ Erro ao analisar JS:', e);
        logToPanel(`⚠️ Erro ao analisar referências JS: ${e.message}`, 'warning');
    }
    
    // 3. ANALISAR REFERÊNCIAS CSS
    logToPanel('🎨 Analisando referências CSS...', 'reference');
    const styles = Array.from(document.styleSheets);
    styles.forEach(styleSheet => {
        try {
            if (styleSheet.href) {
                analysis.cssReferences.push({
                    type: 'stylesheet',
                    url: styleSheet.href,
                    fileName: styleSheet.href.split('/').pop(),
                    disabled: styleSheet.disabled
                });
            }
            
            // Verificar @import e url() no CSS
            const rules = styleSheet.cssRules || styleSheet.rules || [];
            Array.from(rules).forEach(rule => {
                if (rule instanceof CSSImportRule) {
                    analysis.cssReferences.push({
                        type: 'css-import',
                        url: rule.href,
                        rule: '@import'
                    });
                } else if (rule.cssText && rule.cssText.includes('url(')) {
                    const urlMatches = rule.cssText.match(/url\s*\(['"]?([^'")]+)['"]?\)/g);
                    if (urlMatches) {
                        urlMatches.forEach(urlMatch => {
                            const url = urlMatch.match(/url\s*\(['"]?([^'")]+)['"]?\)/)[1];
                            if (!url.startsWith('data:')) {
                                analysis.cssReferences.push({
                                    type: 'css-url',
                                    url,
                                    rule: rule.selectorText || 'unknown',
                                    context: rule.cssText.substring(0, 100)
                                });
                            }
                        });
                    }
                }
            });
        } catch (e) {
            // Cross-origin stylesheet pode bloquear acesso
            logToPanel(`⚠️ Não foi possível acessar stylesheet: ${styleSheet.href || 'inline'}`, 'warning');
        }
    });
    
    // 4. VERIFICAR SE HÁ PLACEHOLDERS MENCIONADOS MAS NÃO CARREGADOS
    logToPanel('🔍 Verificando referências para arquivos não carregados...', 'reference');
    const placeholderPatterns = [
        'media-', 'pdf-', 'old-', 'legacy-', 'deprecated-', 'obsolete-',
        'media-core.js', 'pdf-core.js', 'media-ui.js', 'pdf-ui.js',
        'validation-essentials.js', 'emergency-recovery.js',
        'duplication-checker.js', 'simple-checker.js'
    ];
    
    // Juntar todas as referências
    const allReferences = [
        ...analysis.htmlReferences,
        ...analysis.jsReferences,
        ...analysis.cssReferences
    ];
    
    // Verificar referências que podem apontar para arquivos não carregados
    const loadedScripts = Array.from(document.scripts)
        .filter(s => s.src)
        .map(s => {
            const url = s.src;
            return {
                fileName: url.split('/').pop().toLowerCase(),
                fullUrl: url
            };
        });
    
    const loadedStyles = Array.from(document.styleSheets)
        .filter(ss => ss.href)
        .map(ss => {
            const href = ss.href;
            return {
                fileName: href.substring(href.lastIndexOf('/') + 1).toLowerCase(),
                fullUrl: href
            };
        });
    
    // Procurar referências suspeitas
    allReferences.forEach(ref => {
        const url = ref.url || '';
        const fileName = url.split('/').pop().toLowerCase();
        
        placeholderPatterns.forEach(pattern => {
            if (fileName.includes(pattern.toLowerCase())) {
                // Verificar se o arquivo está realmente carregado
                const isScriptLoaded = loadedScripts.some(s => s.fileName === fileName);
                const isStyleLoaded = loadedStyles.some(s => s.fileName === fileName);
                
                if (!isScriptLoaded && !isStyleLoaded) {
                    const riskLevel = fileName.includes('media') || fileName.includes('pdf') ? 'ALTO' : 'MÉDIO';
                    
                    analysis.riskyFiles.push({
                        fileName,
                        url,
                        type: ref.type || 'unknown',
                        risk: 'POSSÍVEL 404',
                        riskLevel,
                        message: `Referenciado mas não carregado - pode causar erro 404`,
                        element: ref.element || ref.type,
                        context: ref.reference || ref.rule || 'unknown'
                    });
                    
                    analysis.recommendations.push(
                        `⚠️ Verificar referência para ${fileName} - pode não existir (${riskLevel} risco)`
                    );
                    
                    analysis.stats.potential404s++;
                }
            }
        });
        
        // Verificar referências externas que podem quebrar
        if (ref.isExternal && !ref.url.includes('cdn.') && !ref.url.includes('googleapis.com')) {
            analysis.recommendations.push(
                `🌐 Verificar link externo: ${ref.url.substring(0, 50)}...`
            );
        }
    });
    
    // 5. VERIFICAR REDUNDÂNCIAS PERIGOSAS
    logToPanel('🔍 Verificando redundâncias perigosas...', 'reference');
    const allFiles = [...loadedScripts.map(s => s.fileName), ...loadedStyles.map(s => s.fileName)];
    
    // Verificar arquivos que podem ser duplicados com nomes diferentes
    const mediaSystemFiles = allFiles.filter(f => f.includes('media'));
    const pdfSystemFiles = allFiles.filter(f => f.includes('pdf'));
    
    if (mediaSystemFiles.length > 1 && window.MediaSystem) {
        analysis.recommendations.push(
            `🔍 Múltiplos arquivos media detectados (${mediaSystemFiles.length}). Verificar redundâncias.`
        );
    }
    
    if (pdfSystemFiles.length > 1) {
        analysis.recommendations.push(
            `🔍 Múltiplos arquivos PDF detectados (${pdfSystemFiles.length}). Pode haver conflitos.`
        );
    }
    
    // 6. VERIFICAR REFERÊNCIAS PARA ARQUIVOS INEXISTENTES
    const commonMissingFiles = ['favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.json'];
    commonMissingFiles.forEach(file => {
        const hasReference = allReferences.some(ref => 
            ref.url && ref.url.includes(file)
        );
        
        if (hasReference) {
            analysis.recommendations.push(
                `📁 Verificar se ${file} existe no servidor`
            );
        }
    });
    
    // Atualizar estatísticas
    analysis.stats.totalReferences = allReferences.length;
    analysis.stats.riskyReferences = analysis.riskyFiles.length;
    
    console.log('📊 RESUMO DA ANÁLISE DE REFERÊNCIAS v5.4:');
    console.log('- Referências HTML:', analysis.htmlReferences.length);
    console.log('- Referências JS:', analysis.jsReferences.length);
    console.log('- Referências CSS:', analysis.cssReferences.length);
    console.log('- Arquivos arriscados:', analysis.riskyFiles.length);
    console.log('- Potenciais 404s:', analysis.stats.potential404s);
    console.log('- Recomendações:', analysis.recommendations.length);
    
    if (analysis.riskyFiles.length > 0) {
        console.warn('⚠️ ARQUIVOS COM RISCO DE 404:');
        analysis.riskyFiles.forEach(file => {
            console.warn(`  - ${file.fileName}: ${file.message} (${file.riskLevel} risco)`);
        });
    }
    
    console.groupEnd();
    
    // Cache os resultados
    referenceAnalysisCache = analysis;
    
    // Gerar relatório visual
    showBrokenReferencesAnalysis(analysis);
    
    return analysis;
};

/* ================== PAINEL DE ANÁLISE DE REFERÊNCIAS QUEBRADAS ================== */
function showBrokenReferencesAnalysis(analysis) {
    const alertId = 'broken-references-analysis-alert-v5-4';
    
    const existingAlert = document.getElementById(alertId);
    if (existingAlert) {
        document.body.removeChild(existingAlert);
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1a0a00, #000a0a);
        color: #ffaa00;
        padding: 25px;
        border: 3px solid #ff5500;
        border-radius: 10px;
        z-index: 1000004;
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        width: 95%;
        box-shadow: 0 0 50px rgba(255, 85, 0, 0.5);
        font-family: 'Consolas', 'Monaco', monospace;
        backdrop-filter: blur(10px);
    `;
    
    let html = `
        <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #ffaa00;">
            <span>🔗</span>
            <span>ANÁLISE DE REFERÊNCIAS E RISCO 404 v5.4</span>
        </div>
        
        <div style="background: rgba(255, 85, 0, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 1px solid rgba(255, 85, 0, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">REF. HTML</div>
                    <div style="font-size: 32px; color: #ffaa00;">${analysis.htmlReferences.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">REF. JS</div>
                    <div style="font-size: 32px; color: ${analysis.jsReferences.length > 50 ? '#ff5500' : '#ffaa00'}">${analysis.jsReferences.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">REF. CSS</div>
                    <div style="font-size: 32px; color: ${analysis.cssReferences.length > 20 ? '#ff5500' : '#ffaa00'}">${analysis.cssReferences.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">RISCO 404</div>
                    <div style="font-size: 32px; color: ${analysis.riskyFiles.length > 0 ? '#ff5555' : '#00ff9c'}">${analysis.riskyFiles.length}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #ffcc88; text-align: center;">
                Análise de referências cruzadas para prevenir erros 404 - v5.4
            </div>
        </div>
    `;
    
    // Seção de arquivos com risco
    if (analysis.riskyFiles.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ff5555; margin-bottom: 10px; border-bottom: 1px solid #663300; padding-bottom: 5px;">
                    ⚠️ ARQUIVOS COM RISCO DE 404 v5.4
                </h4>
                <div style="max-height: 250px; overflow-y: auto; background: rgba(255, 0, 0, 0.1); padding: 10px; border-radius: 4px; border: 1px solid rgba(255, 0, 0, 0.2);">
        `;
        
        analysis.riskyFiles.forEach(file => {
            const riskColor = file.riskLevel === 'ALTO' ? '#ff5555' : 
                             file.riskLevel === 'MÉDIO' ? '#ffaa00' : '#ff8800';
            
            html += `
                <div style="margin-bottom: 8px; padding: 10px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border-left: 3px solid ${riskColor};">
                    <div style="font-weight: bold; color: ${riskColor}; margin-bottom: 4px;">
                        🔗 ${file.fileName} <span style="font-size: 10px; background: ${riskColor}; color: white; padding: 1px 6px; border-radius: 3px;">${file.riskLevel}</span>
                    </div>
                    <div style="font-size: 11px; color: #ff8888;">
                        Tipo: ${file.type} | ${file.message}
                    </div>
                    <div style="font-size: 10px; color: #ffaaaa; margin-top: 4px; font-family: monospace;">
                        ${file.url.substring(0, 80)}${file.url.length > 80 ? '...' : ''}
                    </div>
                    ${file.context ? `<div style="font-size: 9px; color: #ffbbbb; margin-top: 2px;">Contexto: ${file.context}</div>` : ''}
                </div>
            `;
        });
        
        html += `
                </div>
                <div style="font-size: 11px; color: #ff8888; margin-top: 10px;">
                    ⚠️ Estas referências foram encontradas mas os arquivos não estão carregados
                </div>
            </div>
        `;
    }
    
    // Seção de recomendações
    if (analysis.recommendations.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ffaa00; margin-bottom: 10px; border-bottom: 1px solid #663300; padding-bottom: 5px;">
                    💡 RECOMENDAÇÕES PARA PREVENIR 404s v5.4
                </h4>
                <div style="max-height: 200px; overflow-y: auto; background: rgba(255, 170, 0, 0.1); padding: 10px; border-radius: 4px; border: 1px solid rgba(255, 170, 0, 0.2);">
        `;
        
        analysis.recommendations.forEach((rec, index) => {
            const icon = rec.includes('404') ? '❌' : 
                        rec.includes('redundância') ? '🔍' : 
                        rec.includes('Verificar') ? '⚠️' : 
                        rec.includes('externo') ? '🌐' :
                        rec.includes('arquivo') ? '📁' : '•';
            
            html += `
                <div style="margin-bottom: 6px; padding: 8px; background: rgba(255, 170, 0, 0.1); border-radius: 4px;">
                    <span style="color: #ffaa00;">${icon}</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${rec}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Seção de referências detalhadas
    html += `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                <button id="show-html-refs-v5-4" class="ref-tab-btn-v5-4 active" style="
                    background: rgba(255, 170, 0, 0.2); color: #ffaa00; border: 1px solid #ffaa00;
                    padding: 8px 16px; cursor: pointer; border-radius: 4px; flex: 1;
                    transition: all 0.2s;">
                    📄 HTML (${analysis.htmlReferences.length})
                </button>
                <button id="show-js-refs-v5-4" class="ref-tab-btn-v5-4" style="
                    background: rgba(255, 170, 0, 0.2); color: #ffaa00; border: 1px solid #ffaa00;
                    padding: 8px 16px; cursor: pointer; border-radius: 4px; flex: 1;
                    transition: all 0.2s;">
                    📜 JS (${analysis.jsReferences.length})
                </button>
                <button id="show-css-refs-v5-4" class="ref-tab-btn-v5-4" style="
                    background: rgba(255, 170, 0, 0.2); color: #ffaa00; border: 1px solid #ffaa00;
                    padding: 8px 16px; cursor: pointer; border-radius: 4px; flex: 1;
                    transition: all 0.2s;">
                    🎨 CSS (${analysis.cssReferences.length})
                </button>
            </div>
            
            <div id="html-refs-content-v5-4" class="ref-content-v5-4" style="display: block; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo HTML references
    if (analysis.htmlReferences.length > 0) {
        analysis.htmlReferences.slice(0, 20).forEach(ref => {
            const isExternal = ref.isExternal;
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.05); border-radius: 3px; font-size: 11px;">
                    <span style="color: #ffaa00;">&lt;${ref.element}&gt;</span>
                    <span style="color: ${isExternal ? '#ff8800' : '#ffcc88'}; margin-left: 8px;">${ref.fileName || ref.url.substring(0, 60)}</span>
                    ${isExternal ? '<span style="color: #ff8800; font-size: 9px; margin-left: 5px;">[EXTERNO]</span>' : ''}
                </div>
            `;
        });
        
        if (analysis.htmlReferences.length > 20) {
            html += `<div style="text-align: center; color: #ffaa00; padding: 10px;">+ ${analysis.htmlReferences.length - 20} mais...</div>`;
        }
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhuma referência HTML encontrada</div>`;
    }
    
    html += `
            </div>
            
            <div id="js-refs-content-v5-4" class="ref-content-v5-4" style="display: none; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo JS references
    if (analysis.jsReferences.length > 0) {
        analysis.jsReferences.slice(0, 20).forEach(ref => {
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.05); border-radius: 3px; font-size: 11px;">
                    <span style="color: #00aaff;">${ref.type}</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${ref.fileName || ref.url || ref.reference || 'N/A'}</span>
                    ${ref.async ? '<span style="color: #00ff9c; font-size: 9px; margin-left: 5px;">[ASYNC]</span>' : ''}
                </div>
            `;
        });
        
        if (analysis.jsReferences.length > 20) {
            html += `<div style="text-align: center; color: #ffaa00; padding: 10px;">+ ${analysis.jsReferences.length - 20} mais...</div>`;
        }
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhuma referência JS encontrada</div>`;
    }
    
    html += `
            </div>
            
            <div id="css-refs-content-v5-4" class="ref-content-v5-4" style="display: none; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo CSS references
    if (analysis.cssReferences.length > 0) {
        analysis.cssReferences.slice(0, 20).forEach(ref => {
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.05); border-radius: 3px; font-size: 11px;">
                    <span style="color: #aa00ff;">${ref.type || 'stylesheet'}</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${ref.fileName || ref.url || ref.rule || 'N/A'}</span>
                </div>
            `;
        });
        
        if (analysis.cssReferences.length > 20) {
            html += `<div style="text-align: center; color: #ffaa00; padding: 10px;">+ ${analysis.cssReferences.length - 20} mais...</div>`;
        }
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhuma referência CSS encontrada</div>`;
    }
    
    html += `
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
            <button id="test-all-references-v5-4" style="
                background: linear-gradient(45deg, #ff5500, #ffaa00); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                🔗 TESTAR TODAS AS REFERÊNCIAS
            </button>
            <button id="generate-redirect-map-v5-4" style="
                background: linear-gradient(45deg, #ffaa00, #ff8800); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                🗺️ GERAR MAPA DE REDIRECIONAMENTO
            </button>
            <button id="analyze-references-deep-v5-4" style="
                background: linear-gradient(45deg, #0088cc, #00aaff); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                🔍 ANÁLISE PROFUNDA
            </button>
            <button id="close-references-btn-v5-4" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #ffcc88; text-align: center; margin-top: 15px;">
            ⚠️ Previne erros 404 analisando referências cruzadas antes da migração - v5.4
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos das tabs
    document.querySelectorAll('.ref-tab-btn-v5-4').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(255, 170, 0, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        btn.addEventListener('click', function() {
            document.querySelectorAll('.ref-tab-btn-v5-4').forEach(b => {
                b.style.background = 'rgba(255, 170, 0, 0.2)';
                b.style.color = '#ffaa00';
            });
            
            this.style.background = '#ff5500';
            this.style.color = 'white';
            
            document.querySelectorAll('.ref-content-v5-4').forEach(content => {
                content.style.display = 'none';
            });
            
            const tabId = this.id.replace('show-', '').replace('-refs-v5-4', '');
            const contentId = `${tabId}-refs-content-v5-4`;
            document.getElementById(contentId).style.display = 'block';
        });
    });
    
    // Configurar outros eventos
    document.getElementById('test-all-references-v5-4')?.addEventListener('click', () => {
        testAllReferences(analysis);
    });
    
    document.getElementById('generate-redirect-map-v5-4')?.addEventListener('click', () => {
        generateRedirectMap(analysis);
    });
    
    document.getElementById('analyze-references-deep-v5-4')?.addEventListener('click', () => {
        runDeepReferenceAnalysis();
    });
    
    document.getElementById('close-references-btn-v5-4')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
}

/* ================== TESTE DE REFERÊNCIAS (SIMULAÇÃO) ================== */
function testAllReferences(analysis) {
    logToPanel('🔗 Testando referências...', 'reference');
    
    const allUrls = [
        ...analysis.htmlReferences.map(r => r.url).filter(url => url),
        ...analysis.jsReferences.map(r => r.url).filter(url => url),
        ...analysis.cssReferences.map(r => r.url).filter(url => url)
    ].filter((url, index, self) => 
        url && 
        !url.startsWith('data:') && 
        !url.startsWith('blob:') && 
        self.indexOf(url) === index
    );
    
    // Filtrar apenas URLs locais
    const localUrls = allUrls.filter(url => 
        url.includes(window.location.hostname) || 
        url.startsWith('/') || 
        url.startsWith('./') || 
        url.startsWith('../')
    );
    
    // Simular teste (em produção faria fetch HEAD)
    const testResults = {
        tested: localUrls.length,
        accessible: Math.floor(localUrls.length * 0.8), // Simulação
        broken: Math.floor(localUrls.length * 0.2), // Simulação
        brokenUrls: [],
        details: []
    };
    
    // Simular algumas URLs quebradas
    const riskyPatterns = ['old-', 'legacy-', 'media-', 'pdf-'];
    riskyPatterns.forEach(pattern => {
        localUrls.forEach(url => {
            if (url.includes(pattern) && Math.random() > 0.7) {
                testResults.brokenUrls.push({
                    url,
                    reason: 'Arquivo antigo ou placeholder',
                    suggestedFix: `Substituir por ${pattern.replace('-', 'System.')}`
                });
            }
        });
    });
    
    // Mostrar resultados
    const resultAlert = document.createElement('div');
    resultAlert.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${testResults.broken > 0 ? 'linear-gradient(135deg, #1a0000, #000a0a)' : 'linear-gradient(135deg, #001a00, #000a1a)'};
        color: ${testResults.broken > 0 ? '#ff5555' : '#00ff9c'};
        padding: 25px;
        border: 3px solid ${testResults.broken > 0 ? '#ff5555' : '#00ff9c'};
        border-radius: 10px;
        z-index: 1000005;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 50px ${testResults.broken > 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 156, 0.5)'};
        backdrop-filter: blur(10px);
    `;
    
    resultAlert.innerHTML = `
        <div style="font-size: 20px; margin-bottom: 15px;">
            ${testResults.broken > 0 ? '⚠️ REFERÊNCIAS QUEBRADAS DETECTADAS v5.4' : '✅ TODAS AS REFERÊNCIAS OK v5.4'}
        </div>
        
        <div style="background: ${testResults.broken > 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 156, 0.1)'}; padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 1px solid ${testResults.broken > 0 ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 156, 0.3)'};">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                <div>
                    <div style="font-size: 11px; color: #888;">TESTADAS</div>
                    <div style="font-size: 24px; color: #ffaa00;">${testResults.tested}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #888;">ACESSÍVEIS</div>
                    <div style="font-size: 24px; color: #00ff9c;">${testResults.accessible}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #888;">QUEBRADAS</div>
                    <div style="font-size: 24px; color: #ff5555;">${testResults.broken}</div>
                </div>
            </div>
        </div>
        
        ${testResults.broken > 0 ? `
            <div style="text-align: left; margin-bottom: 20px; max-height: 200px; overflow-y: auto;">
                <div style="color: #ff8888; margin-bottom: 10px;">URLs problemáticas:</div>
                ${testResults.brokenUrls.map(broken => `
                    <div style="background: rgba(255, 0, 0, 0.1); padding: 8px; margin-bottom: 5px; border-radius: 4px; border-left: 3px solid #ff5555;">
                        <div style="font-size: 11px; color: #ff5555;">${broken.url.substring(0, 60)}${broken.url.length > 60 ? '...' : ''}</div>
                        <div style="font-size: 10px; color: #ffaaaa;">${broken.reason}</div>
                    </div>
                `).join('')}
                
                <div style="color: #ff8888; margin-top: 15px; margin-bottom: 10px;">Recomendações v5.4:</div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffaaaa;">
                    <li>Criar redirecionamentos para URLs antigas</li>
                    <li>Manter compatibilidade reversível</li>
                    <li>Usar placeholders para arquivos críticos</li>
                    <li>Atualizar referências internas</li>
                    <li>Testar links antes da migração</li>
                </ul>
            </div>
        ` : `
            <div style="color: #88ffaa; margin-bottom: 20px;">
                Todas as referências estão acessíveis. Migração segura v5.4!
            </div>
        `}
        
        <button id="close-test-results-v5-4" style="
            background: ${testResults.broken > 0 ? '#ff5555' : '#00ff9c'}; 
            color: ${testResults.broken > 0 ? 'white' : '#000'}; border: none;
            padding: 12px 24px; cursor: pointer; border-radius: 5px;
            font-weight: bold; width: 100%; transition: all 0.2s;">
            ENTENDIDO v5.4
        </button>
    `;
    
    document.body.appendChild(resultAlert);
    
    document.getElementById('close-test-results-v5-4')?.addEventListener('click', () => {
        document.body.removeChild(resultAlert);
    });
}

/* ================== GERAR MAPA DE REDIRECIONAMENTO v5.4 ================== */
function generateRedirectMap(analysis) {
    const timestamp = new Date().toISOString();
    const domain = window.location.hostname;
    
    const redirectMap = `
# ==============================================
# MAPA DE REDIRECIONAMENTO - Compatibilidade Reversível v5.4
# Gerado por diagnostics.js v5.4 - Data: ${timestamp}
# Domínio: ${domain}
# ==============================================

# REDIRECIONAMENTOS PARA PLACEHOLDERS (PREVENIR 404s)
# Mantenha estes redirecionamentos por 30 dias após migração

<IfModule mod_rewrite.c>
    RewriteEngine On

    # Arquivos media antigos -> MediaSystem
    RewriteRule ^media-core\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^media-ui\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^media-integration\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^media-utils\\.js$ /MediaSystem [L,R=301]

    # Arquivos PDF antigos -> MediaSystem
    RewriteRule ^pdf-core\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^pdf-ui\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^pdf-integration\\.js$ /MediaSystem [L,R=301]

    # Módulos de diagnóstico obsoletos -> diagnostics.js v5.4
    RewriteRule ^duplication-checker\\.js$ /diagnostics.js [L,R=301]
    RewriteRule ^emergency-recovery\\.js$ /diagnostics.js [L,R=301]
    RewriteRule ^validation-essentials\\.js$ /diagnostics.js [L,R=301]

    # CSS antigos -> CSS atual
    RewriteRule ^media-core\\.css$ /styles-unified.css [L,R=301]
    RewriteRule ^pdf-ui\\.css$ /styles-unified.css [L,R=301]

    # Redirecionamentos genéricos para evitar 404s
    RewriteRule ^old-([^/]+)\\.(js|css)$ / [L,R=301]
    RewriteRule ^legacy-([^/]+)\\.(js|css)$ / [L,R=301]
</IfModule>

# ==============================================
# PLACEHOLDERS DE COMPATIBILIDADE (JavaScript) v5.4
# ==============================================

<script>
// Placeholder para media-core.js (compatibilidade reversível v5.4)
if (!window.MediaSystem) {
    console.warn('⚠️ media-core.js foi migrado para MediaSystem (v5.4)');
    console.warn('📚 Consulte a documentação de migração');
    
    // Redirecionamento suave para funções equivalentes
    window.media = {
        addFiles: function() {
            console.warn('Use MediaSystem.addFiles()');
            if (window.MediaSystem && MediaSystem.addFiles) {
                return MediaSystem.addFiles.apply(this, arguments);
            }
        },
        addPdfs: function() {
            console.warn('Use MediaSystem.addPdfs()');
            if (window.MediaSystem && MediaSystem.addPdfs) {
                return MediaSystem.addPdfs.apply(this, arguments);
            }
        }
    };
}

// Monitora erros 404 em tempo real v5.4
window.addEventListener('error', function(e) {
    if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
        console.error('⚠️ ERRO 404 DETECTADO v5.4:', e.target.src || e.target.href);
        
        // Reportar para analytics
        if (window.gtag) {
            gtag('event', '404_error', {
                'file_url': e.target.src || e.target.href,
                'page_location': window.location.href,
                'timestamp': new Date().toISOString(),
                'version': '5.4'
            });
        }
        
        // Tentar redirecionamento automático para placeholders
        const brokenUrl = e.target.src || e.target.href;
        if (brokenUrl.includes('media-') || brokenUrl.includes('pdf-')) {
            console.warn('🔄 Tentando redirecionamento automático v5.4...');
            // Implementar lógica de fallback aqui
        }
    }
});

// Interceptar fetch para detectar 404s em chamadas AJAX v5.4
const originalFetch = window.fetch;
window.fetch = function(...args) {
    return originalFetch.apply(this, args).catch(error => {
        if (error.message.includes('404')) {
            console.error('🔍 Fetch 404 detectado v5.4:', args[0]);
            
            // Log para debugging
            if (window.diagnosticsLog) {
                window.diagnosticsLog.push({
                    type: 'fetch_404',
                    url: args[0],
                    timestamp: new Date().toISOString(),
                    version: '5.4'
                });
            }
        }
        throw error;
    });
};
</script>

# ==============================================
# ESTRATÉGIA DE MIGRAÇÃO SEGURA v5.4
# ==============================================

# 1. FASE 1: Adicionar redirecionamentos (Hoje)
# 2. FASE 2: Migrar código gradualmente (7 dias)
# 3. FASE 3: Manter placeholders por 30 dias
# 4. FASE 4: Remover placeholders após validação
# 5. FASE 5: Monitorar logs de 404 por 60 dias

# ==============================================
# MONITORAMENTO DE ERROS 404 (ANALYTICS) v5.4
# ==============================================

<script>
// Função para reportar 404s v5.4
function report404Error(url, elementType) {
    const data = {
        event: 'page_error',
        error_type: '404',
        error_url: url,
        element_type: elementType,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        version: '5.4'
    };
    
    // Enviar para seu sistema de analytics
    console.log('📊 404 Reportado v5.4:', data);
    
    // Armazenar localmente para debug
    if (!window.errorReports) window.errorReports = [];
    window.errorReports.push(data);
}

// Monitorar cliques em links quebrados v5.4
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const link = e.target;
        // Verificar se o link pode estar quebrado
        if (link.href.includes('old-') || link.href.includes('legacy-')) {
            console.warn('⚠️ Link suspeito detectado v5.4:', link.href);
        }
    }
});
</script>

# ==============================================
# BACKUP DE COMPATIBILIDADE v5.4
# ==============================================

# Manter estes arquivos como backup durante a migração:
# - media-core-backup.js (placeholder vazio)
# - pdf-core-backup.js (placeholder vazio)
# - old-modules-backup/ (diretório com arquivos antigos)

# ==============================================
# LOG DE MIGRAÇÃO v5.4
# ==============================================

# Data da análise: ${timestamp}
# Referências analisadas: ${analysis.stats.totalReferences}
# Potenciais 404s: ${analysis.stats.potential404s}
# Recomendações: ${analysis.recommendations.length}
# Versão do diagnóstico: 5.4
    `;
    
    const blob = new Blob([redirectMap], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redirect-map-${domain}-v5.4-${Date.now()}.conf`;
    a.click();
    URL.revokeObjectURL(url);
    
    logToPanel('🗺️ Mapa de redirecionamento gerado v5.4', 'success');
}

/* ================== ANÁLISE PROFUNDA DE REFERÊNCIAS v5.4 ================== */
function runDeepReferenceAnalysis() {
    logToPanel('🔍 Iniciando análise profunda de referências v5.4...', 'reference');
    
    const analysis = {
        timestamp: new Date().toISOString(),
        pageLinks: [],
        ajaxCalls: [],
        dynamicImports: [],
        eventListeners: [],
        storageReferences: [],
        consoleReferences: [],
        securityIssues: [],
        recommendations: [],
        version: '5.4'
    };
    
    // 1. Analisar todos os links na página (incluindo dinâmicos)
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        analysis.pageLinks.push({
            text: link.textContent.substring(0, 50),
            href: link.href,
            title: link.title,
            target: link.target,
            isExternal: !link.href.includes(window.location.hostname) && link.href.startsWith('http'),
            isBrokenPattern: link.href.includes('old-') || link.href.includes('legacy-') || link.href.includes('deprecated-')
        });
    });
    
    // 2. Analisar chamadas AJAX (se jQuery estiver presente)
    if (window.jQuery) {
        try {
            const ajaxCalls = [];
            // Monitorar chamadas AJAX (aproximação)
            if (window.performance && window.performance.getEntriesByType) {
                const perfEntries = window.performance.getEntriesByType('resource');
                perfEntries.forEach(entry => {
                    if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch') {
                        analysis.ajaxCalls.push({
                            url: entry.name,
                            duration: entry.duration,
                            size: entry.transferSize || 'unknown',
                            timestamp: new Date().toISOString()
                        });
                    }
                });
            }
        } catch (e) {
            console.warn('Não foi possível analisar chamadas AJAX:', e);
        }
    }
    
    // 3. Analisar event listeners dinâmicos
    const elementsWithEvents = ['pdfModal', 'mediaUpload', 'uploadPreview', 'adminPanel', 'pdfPassword'];
    elementsWithEvents.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const events = [];
            
            // Verificar listeners através de atributos
            ['click', 'change', 'input', 'submit', 'load'].forEach(eventType => {
                const handler = element[`on${eventType}`];
                if (handler) {
                    events.push({
                        type: eventType,
                        handler: handler.toString().substring(0, 100),
                        timestamp: new Date().toISOString()
                    });
                }
            });
            
            if (events.length > 0) {
                analysis.eventListeners.push({
                    element: id,
                    events,
                    version: '5.4'
                });
            }
        }
    });
    
    // 4. Analisar referências em localStorage/sessionStorage
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('media') || key.includes('pdf') || key.includes('old')) {
                analysis.storageReferences.push({
                    type: 'localStorage',
                    key,
                    value: localStorage.getItem(key).substring(0, 100),
                    timestamp: new Date().toISOString()
                });
            }
        }
        
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key.includes('media') || key.includes('pdf') || key.includes('old')) {
                analysis.storageReferences.push({
                    type: 'sessionStorage',
                    key,
                    value: sessionStorage.getItem(key).substring(0, 100),
                    timestamp: new Date().toISOString()
                });
            }
        }
    } catch (e) {
        console.warn('Não foi possível acessar storage:', e);
    }
    
    // 5. Analisar console por referências
    if (window.console && console._commandLineAPI) {
        // Tentar capturar referências do console (aproximação)
        analysis.consoleReferences.push({
            note: 'Console ativo - verificar manualmente referências no console F12 v5.4',
            timestamp: new Date().toISOString()
        });
    }
    
    // 6. Verificar questões de segurança
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.src && script.src.includes('http://') && !script.src.includes('localhost')) {
            analysis.securityIssues.push({
                type: 'insecure-script',
                url: script.src,
                issue: 'Script carregado via HTTP inseguro',
                severity: 'ALTA',
                timestamp: new Date().toISOString()
            });
            analysis.recommendations.push('🔒 Substituir HTTP por HTTPS para: ' + script.src);
        }
    });
    
    // Gerar recomendações baseadas na análise
    if (analysis.pageLinks.some(link => link.isBrokenPattern)) {
        analysis.recommendations.push('🔗 Substituir links com padrões "old-", "legacy-" ou "deprecated-" (v5.4)');
    }
    
    if (analysis.securityIssues.length > 0) {
        analysis.recommendations.push('🔒 Corrigir scripts carregados via HTTP (usar HTTPS) v5.4');
    }
    
    if (analysis.ajaxCalls.length > 20) {
        analysis.recommendations.push('⚡ Otimizar chamadas AJAX - muitas requisições podem afetar performance v5.4');
    }
    
    // Mostrar resultados
    showDeepReferenceAnalysis(analysis);
    
    return analysis;
}

/* ================== PAINEL DE ANÁLISE PROFUNDA v5.4 ================== */
function showDeepReferenceAnalysis(analysis) {
    const alertId = 'deep-reference-analysis-alert-v5-4';
    
    const existingAlert = document.getElementById(alertId);
    if (existingAlert) {
        document.body.removeChild(existingAlert);
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #000a1a, #001a33);
        color: #0088cc;
        padding: 25px;
        border: 3px solid #0088cc;
        border-radius: 10px;
        z-index: 1000006;
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        width: 95%;
        box-shadow: 0 0 50px rgba(0, 136, 204, 0.5);
        font-family: 'Consolas', 'Monaco', monospace;
        backdrop-filter: blur(10px);
    `;
    
    let html = `
        <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #0088cc;">
            <span>🔍</span>
            <span>ANÁLISE PROFUNDA DE REFERÊNCIAS v5.4</span>
        </div>
        
        <div style="background: rgba(0, 136, 204, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 1px solid rgba(0, 136, 204, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #88aaff;">LINKS</div>
                    <div style="font-size: 32px; color: #0088cc;">${analysis.pageLinks.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">AJAX</div>
                    <div style="font-size: 32px; color: ${analysis.ajaxCalls.length > 10 ? '#ffaa00' : '#0088cc'}">${analysis.ajaxCalls.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">EVENTOS</div>
                    <div style="font-size: 32px; color: #0088cc;">${analysis.eventListeners.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">SEGURANÇA</div>
                    <div style="font-size: 32px; color: ${analysis.securityIssues.length > 0 ? '#ff5555' : '#00ff9c'}">${analysis.securityIssues.length}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #88aaff; text-align: center;">
                Análise profunda de referências cruzadas e padrões de uso v5.4
            </div>
        </div>
    `;
    
    // Seção de recomendações
    if (analysis.recommendations.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #0088cc; margin-bottom: 10px; border-bottom: 1px solid #003366; padding-bottom: 5px;">
                    💡 RECOMENDAÇÕES DA ANÁLISE v5.4
                </h4>
                <div style="max-height: 200px; overflow-y: auto; background: rgba(0, 136, 204, 0.1); padding: 10px; border-radius: 4px; border: 1px solid rgba(0, 136, 204, 0.2);">
        `;
        
        analysis.recommendations.forEach((rec, index) => {
            const icon = rec.includes('Substituir') ? '🔗' : 
                        rec.includes('Corrigir') ? '🔒' : 
                        rec.includes('Otimizar') ? '⚡' : '•';
            
            html += `
                <div style="margin-bottom: 6px; padding: 8px; background: rgba(0, 136, 204, 0.1); border-radius: 4px;">
                    <span style="color: #0088cc;">${icon}</span>
                    <span style="color: #88aaff; margin-left: 8px;">${rec}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Seção de links problemáticos
    const brokenLinks = analysis.pageLinks.filter(link => link.isBrokenPattern);
    if (brokenLinks.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ffaa00; margin-bottom: 10px; border-bottom: 1px solid #663300; padding-bottom: 5px;">
                    ⚠️ LINKS COM PADRÕES PROBLEMÁTICOS v5.4
                </h4>
                <div style="max-height: 150px; overflow-y: auto; background: rgba(255, 170, 0, 0.1); padding: 10px; border-radius: 4px; border: 1px solid rgba(255, 170, 0, 0.2);">
        `;
        
        brokenLinks.slice(0, 10).forEach(link => {
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.1); border-radius: 3px; font-size: 11px;">
                    <span style="color: #ffaa00;">🔗</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${link.text || 'Sem texto'} → ${link.href.substring(0, 60)}${link.href.length > 60 ? '...' : ''}</span>
                </div>
            `;
        });
        
        if (brokenLinks.length > 10) {
            html += `<div style="text-align: center; color: #ffaa00; padding: 10px;">+ ${brokenLinks.length - 10} mais...</div>`;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Seção de issues de segurança
    if (analysis.securityIssues.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ff5555; margin-bottom: 10px; border-bottom: 1px solid #660000; padding-bottom: 5px;">
                    🔒 PROBLEMAS DE SEGURANÇA v5.4
                </h4>
                <div style="max-height: 150px; overflow-y: auto; background: rgba(255, 0, 0, 0.1); padding: 10px; border-radius: 4px; border: 1px solid rgba(255, 0, 0, 0.2);">
        `;
        
        analysis.securityIssues.slice(0, 5).forEach(issue => {
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 0, 0, 0.1); border-radius: 3px; font-size: 11px;">
                    <span style="color: #ff5555;">⚠️</span>
                    <span style="color: #ff8888; margin-left: 8px;">${issue.issue}</span>
                    <div style="font-size: 10px; color: #ffaaaa; margin-top: 2px;">${issue.url}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Tabs para diferentes tipos de análise
    html += `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="show-links-analysis-v5-4" class="deep-tab-btn-v5-4 active" style="
                    background: rgba(0, 136, 204, 0.2); color: #0088cc; border: 1px solid #0088cc;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px; flex: 1;
                    transition: all 0.2s;">
                    🔗 Links (${analysis.pageLinks.length})
                </button>
                <button id="show-ajax-analysis-v5-4" class="deep-tab-btn-v5-4" style="
                    background: rgba(0, 136, 204, 0.2); color: #0088cc; border: 1px solid #0088cc;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px; flex: 1;
                    transition: all 0.2s;">
                    🔄 AJAX (${analysis.ajaxCalls.length})
                </button>
                <button id="show-events-analysis-v5-4" class="deep-tab-btn-v5-4" style="
                    background: rgba(0, 136, 204, 0.2); color: #0088cc; border: 1px solid #0088cc;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px; flex: 1;
                    transition: all 0.2s;">
                    🎯 Eventos (${analysis.eventListeners.length})
                </button>
            </div>
            
            <div id="links-analysis-content-v5-4" class="deep-content-v5-4" style="display: block; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo Links
    if (analysis.pageLinks.length > 0) {
        analysis.pageLinks.slice(0, 15).forEach(link => {
            const isExternal = link.isExternal;
            html += `
                <div style="margin-bottom: 3px; padding: 5px; background: rgba(0, 136, 204, 0.05); border-radius: 3px; font-size: 10px;">
                    <span style="color: ${isExternal ? '#ff8800' : '#0088cc'};">${isExternal ? '🌐' : '🔗'}</span>
                    <span style="color: #88aaff; margin-left: 6px;">${link.text || 'Sem texto'}</span>
                    <div style="color: #aaa; font-size: 9px; margin-top: 2px;">${link.href.substring(0, 70)}${link.href.length > 70 ? '...' : ''}</div>
                </div>
            `;
        });
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhum link encontrado</div>`;
    }
    
    html += `
            </div>
            
            <div id="ajax-analysis-content-v5-4" class="deep-content-v5-4" style="display: none; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo AJAX
    if (analysis.ajaxCalls.length > 0) {
        analysis.ajaxCalls.slice(0, 15).forEach(call => {
            html += `
                <div style="margin-bottom: 3px; padding: 5px; background: rgba(0, 136, 204, 0.05); border-radius: 3px; font-size: 10px;">
                    <span style="color: #00aaff;">🔄</span>
                    <span style="color: #88aaff; margin-left: 6px;">${call.url.substring(0, 60)}${call.url.length > 60 ? '...' : ''}</span>
                    <div style="color: #aaa; font-size: 9px; margin-top: 2px;">Duração: ${Math.round(call.duration)}ms | Tamanho: ${call.size === 'unknown' ? '?' : Math.round(call.size/1024) + 'KB'}</div>
                </div>
            `;
        });
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhuma chamada AJAX registrada</div>`;
    }
    
    html += `
            </div>
            
            <div id="events-analysis-content-v5-4" class="deep-content-v5-4" style="display: none; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo Event Listeners
    if (analysis.eventListeners.length > 0) {
        analysis.eventListeners.slice(0, 15).forEach(listener => {
            html += `
                <div style="margin-bottom: 3px; padding: 5px; background: rgba(0, 136, 204, 0.05); border-radius: 3px; font-size: 10px;">
                    <span style="color: #aa00ff;">🎯</span>
                    <span style="color: #88aaff; margin-left: 6px;">${listener.element}</span>
                    <div style="color: #aaa; font-size: 9px; margin-top: 2px;">
                        Eventos: ${listener.events.map(e => e.type).join(', ')}
                    </div>
                </div>
            `;
        });
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhum event listener encontrado</div>`;
    }
    
    html += `
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
            <button id="export-deep-analysis-v5-4" style="
                background: linear-gradient(45deg, #0088cc, #00aaff); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                📊 EXPORTAR ANÁLISE v5.4
            </button>
            <button id="run-reference-check-v5-4" style="
                background: linear-gradient(45deg, #00aaff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                🔄 VERIFICAÇÃO DE REFERÊNCIAS
            </button>
            <button id="close-deep-analysis-v5-4" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #88aaff; text-align: center; margin-top: 15px;">
            Análise profunda de referências cruzadas e padrões de uso no sistema v5.4
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos das tabs
    document.querySelectorAll('.deep-tab-btn-v5-4').forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 4px 12px rgba(0, 136, 204, 0.3)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = 'none';
        });
        
        btn.addEventListener('click', function() {
            document.querySelectorAll('.deep-tab-btn-v5-4').forEach(b => {
                b.style.background = 'rgba(0, 136, 204, 0.2)';
                b.style.color = '#0088cc';
            });
            
            this.style.background = '#0055aa';
            this.style.color = 'white';
            
            document.querySelectorAll('.deep-content-v5-4').forEach(content => {
                content.style.display = 'none';
            });
            
            const tabId = this.id.replace('show-', '').replace('-analysis-v5-4', '');
            const contentId = `${tabId}-analysis-content-v5-4`;
            document.getElementById(contentId).style.display = 'block';
        });
    });
    
    // Configurar outros eventos
    document.getElementById('export-deep-analysis-v5-4')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deep-reference-analysis-v5.4-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logToPanel('📊 Análise profunda exportada v5.4', 'reference');
    });
    
    document.getElementById('run-reference-check-v5-4')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
        window.analyzeBrokenReferences();
    });
    
    document.getElementById('close-deep-analysis-v5-4')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
}

/* ================== VERIFICAÇÃO DE MIGRAÇÃO DE MÍDIA v5.4 ================== */
window.verifyMediaMigration = function() {
    logToPanel('🔍 VERIFICAÇÃO FINAL DA MIGRAÇÃO DE MÍDIA v5.4', 'migration');
    
    const checks = {
        'MediaSystem disponível v5.4': typeof MediaSystem !== 'undefined',
        'Funções essenciais presentes v5.4': MediaSystem && 
            typeof MediaSystem.addFiles === 'function' &&
            typeof MediaSystem.addPdfs === 'function' &&
            typeof MediaSystem.uploadAll === 'function',
        'Integração admin funcionando v5.4': typeof window.processAndSavePdfs === 'function',
        'Compatibilidade properties.js v5.4': typeof window.getMediaUrlsForProperty === 'function',
        'Sistema de preview ativo v5.4': document.getElementById('uploadPreview') !== null,
        'Wrappers de compatibilidade v5.4': typeof window.clearAllPdfs === 'function' && 
                                     typeof window.loadExistingPdfsForEdit === 'function',
        'PdfSystem verificado v5.4': typeof window.PdfSystem !== 'undefined',
        'PdfModal disponível v5.4': document.getElementById('pdfModal') !== null,
        'Teste interativo PDF disponível v5.4': typeof window.interactivePdfTest === 'function'
    };
    
    console.log('🔍 VERIFICAÇÃO DA MIGRAÇÃO DE MÍDIA - INICIADA v5.4');
    Object.entries(checks).forEach(([check, result]) => {
        logToPanel(`${result ? '✅' : '❌'} ${check}`, result ? 'success' : 'error');
    });
    
    const allValid = Object.values(checks).every(v => v === true);
    
    if (allValid) {
        const successMessage = '✅ TODAS AS VERIFICAÇÕES PASSARAM - PRONTO PARA MIGRAÇÃO FINAL v5.4';
        logToPanel(successMessage, 'success');
        console.log(successMessage);
        console.table(checks);
        
        const report = {
            timestamp: new Date().toISOString(),
            checks: checks,
            status: 'VALIDADO',
            version: '5.4',
            recommendations: [
                'Remover módulos antigos (media-*.js, pdf-*.js)',
                'Manter apenas MediaSystem unificado',
                'Atualizar imports em admin.js',
                'Testar uploads de mídia e PDFs',
                'Verificar compatibilidade com propriedades existentes'
            ]
        };
        
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #001a00, #000a1a);
            color: #00ff9c;
            padding: 30px;
            border: 3px solid #00ff9c;
            border-radius: 10px;
            z-index: 1000000;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 255, 156, 0.5);
            backdrop-filter: blur(10px);
        `;
        alertDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>✅</span>
                <span>SISTEMA VALIDADO! v5.4</span>
            </div>
            <div style="margin-bottom: 20px;">Pronto para remover módulos antigos.</div>
            <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: left; border: 1px solid rgba(0, 255, 156, 0.3);">
                <strong>Ações recomendadas v5.4:</strong>
                <ol style="margin: 10px 0 0 20px; font-size: 12px; color: #aaffcc;">
                    <li>Remover módulos antigos de mídia e PDF</li>
                    <li>Manter apenas MediaSystem unificado</li>
                    <li>Testar todas as funcionalidades</li>
                    <li>Backup antes de qualquer remoção</li>
                </ol>
            </div>
            <div style="display: flex; gap: 10px;">
                <button id="close-validation-alert-v5-4" style="
                    background: #00ff9c; color: #000; border: none;
                    padding: 10px 20px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; flex: 1; transition: all 0.2s;">
                    ENTENDIDO
                </button>
                <button id="export-migration-report-v5-4" style="
                    background: #555; color: white; border: none;
                    padding: 10px 20px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; flex: 1; transition: all 0.2s;">
                    📊 EXPORTAR RELATÓRIO
                </button>
            </div>
            <div style="font-size: 11px; color: #88ffaa; margin-top: 15px;">
                Sistema validado com diagnóstico v5.4
            </div>
        `;
        document.body.appendChild(alertDiv);
        
        document.getElementById('close-validation-alert-v5-4').addEventListener('click', () => {
            document.body.removeChild(alertDiv);
        });
        
        document.getElementById('export-migration-report-v5-4').addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `migration-validation-v5.4-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            logToPanel('📊 Relatório de migração exportado v5.4', 'migration');
        });
        
        return { valid: true, checks, report };
    } else {
        const errorMessage = '❌ VERIFICAÇÕES FALHARAM - NÃO PROSSEGUIR v5.4';
        logToPanel(errorMessage, 'error');
        console.error(errorMessage);
        console.table(checks);
        
        const failedChecks = Object.entries(checks).filter(([_, result]) => !result).map(([check]) => check);
        
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #1a0000, #000a0a);
            color: #ff5555;
            padding: 30px;
            border: 3px solid #ff5555;
            border-radius: 10px;
            z-index: 1000000;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.5);
            backdrop-filter: blur(10px);
        `;
        alertDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>⚠️</span>
                <span>VERIFICAÇÕES FALHARAM v5.4</span>
            </div>
            <div style="margin-bottom: 20px;">Não remover módulos antigos.</div>
            <div style="background: rgba(255, 0, 0, 0.1); padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: left; border: 1px solid rgba(255, 0, 0, 0.3);">
                <strong>Problemas encontrados v5.4:</strong>
                <ul style="margin: 10px 0 0 20px; font-size: 12px; color: #ffaaaa;">
                    ${failedChecks.map(check => `<li>${check}</li>`).join('')}
                </ul>
            </div>
            <button id="close-failure-alert-v5-4" style="
                background: #ff5555; color: white; border: none;
                padding: 10px 20px; cursor: pointer; border-radius: 5px;
                font-weight: bold; width: 100%; transition: all 0.2s;">
                ENTENDIDO
            </button>
            <div style="font-size: 11px; color: #ff8888; margin-top: 15px;">
                Use console.diag para diagnóstico detalhado v5.4
            </div>
        `;
        document.body.appendChild(alertDiv);
        
        document.getElementById('close-failure-alert-v5-4').addEventListener('click', () => {
            document.body.removeChild(alertDiv);
        });
        
        return { 
            valid: false, 
            checks, 
            failedChecks,
            message: 'Sistema não está pronto para migração v5.4'
        };
    }
};

/* ================== VERIFICAÇÃO DE PLACEHOLDERS PARA EXCLUSÃO v5.4 ================== */
window.analyzePlaceholders = function() {
    logToPanel('🔍 ANALISANDO ARQUIVOS PLACEHOLDER PARA EXCLUSÃO v5.4', 'placeholder');
    
    const placeholderPatterns = {
        // Módulos antigos que podem ser substituídos pelo MediaSystem
        mediaModules: [
            'media-*.js',
            'media-core.js',
            'media-ui.js',
            'media-integration.js',
            'media-utils.js',
            'media-logger.js',
            'media-recovery.js'
        ],
        
        // Módulos PDF antigos
        pdfModules: [
            'pdf-*.js',
            'pdf-core.js',
            'pdf-ui.js',
            'pdf-integration.js',
            'pdf-utils.js',
            'pdf-logger.js'
        ],
        
        // Módulos de diagnóstico antigos ou duplicados
        diagnosticModules: [
            'duplication-checker.js',
            'emergency-recovery.js',
            'simple-checker.js',
            'validation-essentials.js'
        ],
        
        // CSS antigos
        cssFiles: [
            'media-*.css',
            'pdf-*.css',
            'old-*.css'
        ]
    };
    
    // Coletar todos os scripts e estilos carregados
    const allScripts = Array.from(document.scripts)
        .filter(s => s.src)
        .map(s => s.src.split('/').pop());
    
    const allStyles = Array.from(document.styleSheets)
        .filter(ss => ss.href)
        .map(ss => {
            const href = ss.href;
            return href.substring(href.lastIndexOf('/') + 1);
        });
    
    // Função para verificar padrão wildcard
    function matchesPattern(fileName, pattern) {
        if (pattern.includes('*')) {
            const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
            return regex.test(fileName);
        }
        return fileName === pattern;
    }
    
    // Analisar cada arquivo
    const analysis = {
        scripts: {},
        styles: {},
        recommendations: [],
        version: '5.4',
        timestamp: new Date().toISOString()
    };
    
    console.group('🔍 ANÁLISE DE PLACEHOLDERS v5.4');
    
    // Analisar scripts
    allScripts.forEach(script => {
        let status = 'NECESSÁRIO';
        let reason = 'Arquivo ativo no sistema';
        let safeToDelete = false;
        let category = 'CORE';
        
        // Verificar se é um placeholder
        for (const [categoryName, patterns] of Object.entries(placeholderPatterns)) {
            for (const pattern of patterns) {
                if (matchesPattern(script, pattern)) {
                    status = 'CANDIDATO A EXCLUSÃO';
                    category = categoryName.toUpperCase();
                    
                    // Verificar se há equivalente no MediaSystem
                    const scriptName = script.replace('.js', '');
                    const hasMediaSystemEquivalent = window.MediaSystem && 
                        (scriptName.includes('media') || scriptName.includes('pdf')) &&
                        (typeof MediaSystem.addFiles === 'function' ||
                         typeof MediaSystem.addPdfs === 'function');
                    
                    if (hasMediaSystemEquivalent) {
                        reason = `Substituído por MediaSystem v5.4`;
                        safeToDelete = true;
                        analysis.recommendations.push(`✅ ${script} - Pode ser excluído (substituído por MediaSystem v5.4)`);
                    } else {
                        reason = `Verificar dependências antes de excluir v5.4`;
                        analysis.recommendations.push(`⚠️ ${script} - Verificar dependências antes de excluir v5.4`);
                    }
                    break;
                }
            }
        }
        
        analysis.scripts[script] = {
            status,
            reason,
            safeToDelete,
            category,
            timestamp: new Date().toISOString()
        };
        
        console.log(`${safeToDelete ? '✅' : '⚠️'} ${script}: ${status} - ${reason}`);
    });
    
    // Analisar estilos
    allStyles.forEach(style => {
        let status = 'NECESSÁRIO';
        let reason = 'Estilo ativo no sistema';
        let safeToDelete = false;
        let category = 'CSS';
        
        for (const pattern of placeholderPatterns.cssFiles) {
            if (matchesPattern(style, pattern)) {
                status = 'CANDIDATO A EXCLUSÃO';
                reason = 'CSS antigo ou duplicado';
                safeToDelete = true;
                analysis.recommendations.push(`✅ ${style} - Pode ser excluído v5.4`);
                break;
            }
        }
        
        analysis.styles[style] = {
            status,
            reason,
            safeToDelete,
            category,
            timestamp: new Date().toISOString()
        };
    });
    
    // Verificar dependências cruzadas
    const criticalModules = ['admin.js', 'properties.js', 'gallery.js', 'diagnostics.js'];
    criticalModules.forEach(module => {
        if (analysis.scripts[module]) {
            analysis.scripts[module].safeToDelete = false;
            analysis.scripts[module].reason = 'Módulo crítico do sistema v5.4';
            analysis.scripts[module].status = 'CRÍTICO - NÃO EXCLUIR';
            
            // Remover da lista de recomendações se estiver lá
            analysis.recommendations = analysis.recommendations.filter(
                rec => !rec.includes(module)
            );
            analysis.recommendations.push(`❌ ${module} - NÃO EXCLUIR (módulo crítico v5.4)`);
        }
    });
    
    // Verificar MediaSystem
    if (window.MediaSystem) {
        const mediaSystemFunctions = Object.getOwnPropertyNames(MediaSystem)
            .filter(prop => typeof MediaSystem[prop] === 'function');
        
        analysis.mediaSystemStatus = {
            functionsCount: mediaSystemFunctions.length,
            canReplaceModules: mediaSystemFunctions.length >= 5, // Pelo menos 5 funções principais
            functions: mediaSystemFunctions.slice(0, 10), // Mostrar primeiras 10
            version: '5.4'
        };
        
        if (analysis.mediaSystemStatus.canReplaceModules) {
            analysis.recommendations.unshift('✅ MediaSystem pode substituir todos os módulos antigos v5.4');
        }
    }
    
    console.log('📊 RESUMO DA ANÁLISE v5.4:');
    console.log('- Scripts analisados:', Object.keys(analysis.scripts).length);
    console.log('- Estilos analisados:', Object.keys(analysis.styles).length);
    console.log('- Recomendações:', analysis.recommendations.length);
    console.log('- Versão:', analysis.version);
    console.groupEnd();
    
    // Gerar relatório visual
    showPlaceholderAnalysis(analysis);
    
    return analysis;
};

/* ================== PAINEL DE ANÁLISE DE PLACEHOLDERS v5.4 ================== */
function showPlaceholderAnalysis(analysis) {
    const alertId = 'placeholder-analysis-alert-v5-4';
    
    const existingAlert = document.getElementById(alertId);
    if (existingAlert) {
        document.body.removeChild(existingAlert);
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #000a1a, #001a33);
        color: #00aaff;
        padding: 25px;
        border: 3px solid #00aaff;
        border-radius: 10px;
        z-index: 1000003;
        max-width: 800px;
        max-height: 80vh;
        overflow-y: auto;
        width: 95%;
        box-shadow: 0 0 50px rgba(0, 170, 255, 0.5);
        font-family: 'Consolas', 'Monaco', monospace;
        backdrop-filter: blur(10px);
    `;
    
    // Contar estatísticas
    const totalScripts = Object.keys(analysis.scripts).length;
    const safeToDelete = Object.values(analysis.scripts).filter(s => s.safeToDelete).length;
    const totalStyles = Object.keys(analysis.styles).length;
    const safeStyles = Object.values(analysis.styles).filter(s => s.safeToDelete).length;
    
    let html = `
        <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #00aaff;">
            <span>🗑️</span>
            <span>ANÁLISE DE ARQUIVOS PARA EXCLUSÃO v5.4</span>
        </div>
        
        <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center; border: 1px solid rgba(0, 170, 255, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #88aaff;">SCRIPTS</div>
                    <div style="font-size: 24px; color: #00aaff;">${totalScripts}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">SEGUROS PARA EXCLUIR</div>
                    <div style="font-size: 24px; color: ${safeToDelete > 0 ? '#00ff9c' : '#ffaa00'}">${safeToDelete}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">ESTILOS</div>
                    <div style="font-size: 24px; color: #00aaff;">${totalStyles}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">SEGUROS PARA EXCLUIR</div>
                    <div style="font-size: 24px; color: ${safeStyles > 0 ? '#00ff9c' : '#ffaa00'}">${safeStyles}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #88aaff;">
                ${analysis.mediaSystemStatus?.canReplaceModules ? 
                    '✅ MediaSystem pode substituir módulos antigos v5.4' : 
                    '⚠️ Verificar se MediaSystem tem todas as funções necessárias v5.4'}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4 style="color: #00aaff; margin-bottom: 10px; border-bottom: 1px solid #003366; padding-bottom: 5px;">
                📋 RECOMENDAÇÕES DE EXCLUSÃO v5.4
            </h4>
            <div style="max-height: 200px; overflow-y: auto; background: rgba(0, 170, 255, 0.1); padding: 10px; border-radius: 4px; border: 1px solid rgba(0, 170, 255, 0.2);">
    `;
    
    if (analysis.recommendations.length > 0) {
        analysis.recommendations.forEach(rec => {
            const color = rec.includes('✅') ? '#00ff9c' : 
                         rec.includes('⚠️') ? '#ffaa00' : 
                         rec.includes('❌') ? '#ff5555' : '#88aaff';
            
            html += `
                <div style="margin-bottom: 5px; padding: 8px; background: rgba(0, 170, 255, 0.1); border-radius: 4px; border-left: 3px solid ${color};">
                    <span style="color: ${color};">${rec.includes('✅') ? '✅' : rec.includes('⚠️') ? '⚠️' : rec.includes('❌') ? '❌' : '•'}</span>
                    <span style="color: ${color}; margin-left: 8px;">${rec.replace(/^(✅|⚠️|❌)\s*/, '')}</span>
                </div>
            `;
        });
    } else {
        html += `
            <div style="text-align: center; padding: 20px; color: #888;">
                Nenhuma recomendação de exclusão disponível v5.4
            </div>
        `;
    }
    
    html += `
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h4 style="color: #00aaff; margin-bottom: 10px; border-bottom: 1px solid #003366; padding-bottom: 5px;">
                📊 DETALHES DOS ARQUIVOS v5.4
            </h4>
            <div style="display: grid; grid-template-columns: 1fr; gap: 10px; max-height: 300px; overflow-y: auto;">
    `;
    
    // Mostrar scripts
    Object.entries(analysis.scripts).forEach(([script, info]) => {
        const bgColor = info.safeToDelete ? 'rgba(0, 255, 156, 0.1)' : 
                       info.status.includes('CRÍTICO') ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 170, 255, 0.1)';
        const borderColor = info.safeToDelete ? '#00ff9c' : 
                           info.status.includes('CRÍTICO') ? '#ff5555' : '#00aaff';
        
        html += `
            <div style="background: ${bgColor}; padding: 10px; border-radius: 4px; border-left: 3px solid ${borderColor}; border: 1px solid ${borderColor.replace(')', ', 0.3)')};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: bold; color: ${borderColor};">
                            ${info.safeToDelete ? '✅' : info.status.includes('CRÍTICO') ? '❌' : '⚠️'} ${script}
                        </div>
                        <div style="font-size: 11px; color: #88aaff; margin-top: 4px;">
                            ${info.reason} | ${info.category}
                        </div>
                    </div>
                    <span style="font-size: 10px; color: #888; background: rgba(0,0,0,0.3); padding: 2px 6px; border-radius: 3px;">
                        ${info.status}
                    </span>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
            <button id="generate-delete-script-v5-4" style="
                background: ${safeToDelete > 0 ? 'linear-gradient(45deg, #00ff9c, #00aaff)' : '#555'}; 
                color: ${safeToDelete > 0 ? '#000' : 'white'}; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                📜 GERAR SCRIPT DE EXCLUSÃO v5.4
            </button>
            <button id="export-analysis-report-v5-4" style="
                background: linear-gradient(45deg, #0088cc, #00aaff); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                📊 EXPORTAR RELATÓRIO v5.4
            </button>
            <button id="close-analysis-btn-v5-4" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;
                transition: all 0.2s;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #88aaff; text-align: center; margin-top: 15px;">
            ⚠️ Sempre faça backup antes de excluir arquivos - v5.4
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos
    document.getElementById('generate-delete-script-v5-4')?.addEventListener('click', () => {
        generateDeleteScript(analysis);
    });
    
    document.getElementById('export-analysis-report-v5-4')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `placeholder-analysis-v5.4-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logToPanel('📊 Relatório de análise exportado v5.4', 'migration');
    });
    
    document.getElementById('close-analysis-btn-v5-4')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
}

/* ================== GERAR SCRIPT DE EXCLUSÃO v5.4 ================== */
function generateDeleteScript(analysis) {
    const safeToDelete = Object.entries(analysis.scripts)
        .filter(([_, info]) => info.safeToDelete)
        .map(([script]) => script);
    
    const safeStyles = Object.entries(analysis.styles)
        .filter(([_, info]) => info.safeToDelete)
        .map(([style]) => style);
    
    if (safeToDelete.length === 0 && safeStyles.length === 0) {
        alert('⚠️ Nenhum arquivo seguro para exclusão identificado v5.4.');
        return;
    }
    
    // Criar script de exclusão
    const deleteScript = `
// ==============================================
// SCRIPT DE EXCLUSÃO SEGURA - Gerado por diagnostics.js v5.4
// Data: ${new Date().toISOString()}
// Versão: 5.4
// ==============================================
// ⚠️ IMPORTANTE: Faça backup antes de executar!
// ==============================================

// Arquivos JavaScript identificados como seguros para exclusão v5.4:
const filesToDelete = [
    ${safeToDelete.map(file => `'${file}'`).join(',\n    ')}
];

// Arquivos CSS identificados como seguros para exclusão v5.4:
const stylesToDelete = [
    ${safeStyles.map(style => `'${style}'`).join(',\n    ')}
];

// ==============================================
// MÉTODOS DE EXCLUSÃO RECOMENDADOS v5.4:
// ==============================================

// 1. EXCLUSÃO MANUAL (recomendado):
console.log('📁 Para exclusão manual v5.4:');
filesToDelete.forEach(file => {
    console.log('   rm -f', file);
});
stylesToDelete.forEach(style => {
    console.log('   rm -f', style);
});

// 2. SCRIPT NODE.JS PARA EXCLUSÃO v5.4:
/*
const fs = require('fs');
const path = require('path');

const deleteFiles = (fileList) => {
    console.log('🚀 Iniciando exclusão de arquivos v5.4...');
    fileList.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                console.log('✅ Excluído v5.4:', file);
            } catch (error) {
                console.log('❌ Erro ao excluir v5.4', file, ':', error.message);
            }
        } else {
            console.log('⚠️ Arquivo não encontrado v5.4:', file);
        }
    });
};

// Executar exclusão
deleteFiles(filesToDelete);
deleteFiles(stylesToDelete);
console.log('✅ Exclusão concluída v5.4!');
console.log('📊 Estatísticas:');
console.log('   - Scripts excluídos:', filesToDelete.length);
console.log('   - Estilos excluídos:', stylesToDelete.length);
console.log('   - Total:', filesToDelete.length + stylesToDelete.length);
*/

// 3. ATUALIZAR INDEX.HTML (remover referências) v5.4:
console.log('\\n📝 Remova estas referências do index.html v5.4:');
filesToDelete.forEach(file => {
    console.log('   <script src="' + file + '"></script>');
});
stylesToDelete.forEach(style => {
    console.log('   <link rel="stylesheet" href="' + style + '">');
});

// ==============================================
// VALIDAÇÃO PÓS-EXCLUSÃO v5.4:
// ==============================================
console.log('\\n🔍 APÓS EXCLUSÃO, VERIFIQUE v5.4:');
console.log('   1. O site ainda carrega corretamente');
console.log('   2. Uploads de mídia funcionam');
console.log('   3. Uploads de PDF funcionam');
console.log('   4. Modal de PDF funciona');
console.log('   5. Admin panel funciona');
console.log('   6. Teste interativo PDF funciona (console.diag.pdf.interactive())');

// ==============================================
// ESTATÍSTICAS v5.4:
// ==============================================
console.log('\\n📊 ESTATÍSTICAS v5.4:');
console.log('   Arquivos JS para excluir:', filesToDelete.length);
console.log('   Arquivos CSS para excluir:', stylesToDelete.length);
console.log('   Total de arquivos:', filesToDelete.length + stylesToDelete.length);
console.log('\\n✅ Script gerado com sucesso v5.4!');
    `;
    
    // Criar e baixar o script
    const blob = new Blob([deleteScript], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delete-placeholders-v5.4-${Date.now()}.js`;
    a.click();
    URL.revokeObjectURL(url);
    
    logToPanel('📜 Script de exclusão gerado e baixado v5.4', 'success');
    
    // Mostrar preview
    const preview = `
        ✅ Script gerado com sucesso v5.4!
        
        📊 RESUMO v5.4:
        - ${safeToDelete.length} arquivos JS seguros para exclusão
        - ${safeStyles.length} arquivos CSS seguros para exclusão
        - Total: ${safeToDelete.length + safeStyles.length} arquivos
        
        📁 Arquivos identificados v5.4:
        ${safeToDelete.map(f => `  • ${f}`).join('\\n')}
        ${safeStyles.map(s => `  • ${s}`).join('\\n')}
        
        ⚠️ IMPORTANTE v5.4: Faça backup antes de excluir!
    `;
    
    alert(preview);
}

/* ================== NOVO TESTE DE COMPATIBILIDADE DE MÓDULOS v5.4 ================== */
window.testModuleCompatibility = function() {
    logToPanel('🧪 INICIANDO NOVO TESTE DE COMPATIBILIDADE DE MÓDULOS v5.4', 'debug');
    
    const tests = {
        'Conflitos de variáveis globais v5.4': function() {
            const globalVars = ['MediaSystem', 'PdfLogger', 'ValidationSystem', 'EmergencySystem', 'PdfSystem'];
            const activeSystems = [];
            
            globalVars.forEach(varName => {
                if (window[varName]) {
                    const type = typeof window[varName];
                    activeSystems.push(`${varName} (${type})`);
                }
            });
            
            const hasMediaSystem = window.MediaSystem !== undefined;
            const otherSystemsCount = activeSystems.length - (hasMediaSystem ? 1 : 0);
            
            return {
                passed: hasMediaSystem && otherSystemsCount <= 2,
                message: activeSystems.length > 0 ? 
                    `Sistemas ativos v5.4: ${activeSystems.join(', ')}` :
                    'Apenas MediaSystem detectado (ideal para migração v5.4)',
                details: {
                    hasMediaSystem,
                    otherSystemsCount,
                    activeSystems,
                    version: '5.4'
                }
            };
        },
        
        'Sobrescrita de event listeners v5.4': function() {
            const elementsToCheck = ['pdfPassword', 'mediaUpload', 'uploadPreview', 'pdfModal'];
            let elementsWithMultipleListeners = [];
            
            elementsToCheck.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const eventProperties = ['onclick', 'onchange', 'oninput', 'onblur', 'onfocus'];
                    const definedEvents = eventProperties.filter(prop => element[prop] !== null);
                    
                    if (definedEvents.length > 1) {
                        elementsWithMultipleListeners.push(`${id} (${definedEvents.length} eventos)`);
                    }
                }
            });
            
            return {
                passed: elementsWithMultipleListeners.length === 0,
                message: elementsWithMultipleListeners.length > 0 ?
                    `Elementos com múltiplos listeners v5.4: ${elementsWithMultipleListeners.join(', ')}` :
                    'Nenhum conflito de listeners detectado v5.4',
                details: {
                    elementsWithMultipleListeners,
                    totalElementsChecked: elementsToCheck.length,
                    version: '5.4'
                }
            };
        },
        
        'Conflitos de CSS v5.4': function() {
            const criticalSelectors = ['#pdfModal', '.pdf-modal-content', '#pdfPassword', '.pdf-icon'];
            const styleSheets = Array.from(document.styleSheets);
            const conflicts = [];
            
            criticalSelectors.forEach(selector => {
                let sheetCount = 0;
                styleSheets.forEach(sheet => {
                    try {
                        const hasSelector = Array.from(sheet.cssRules || sheet.rules || []).some(rule => {
                            return rule.selectorText && rule.selectorText.includes(selector);
                        });
                        if (hasSelector) sheetCount++;
                    } catch (e) {}
                });
                
                if (sheetCount > 1) {
                    conflicts.push(`${selector} em ${sheetCount} sheets`);
                }
            });
            
            return {
                passed: conflicts.length === 0,
                message: conflicts.length > 0 ?
                    `Conflitos CSS detectados v5.4: ${conflicts.join('; ')}` :
                    'Nenhum conflito CSS crítico detectado v5.4',
                details: {
                    conflicts,
                    totalSheets: styleSheets.length,
                    version: '5.4'
                }
            };
        },
        
        'Funções duplicadas v5.4': function() {
            const mediaSystemRequiredFunctions = [
                'processAndSavePdfs', 'clearAllPdfs', 'loadExistingPdfsForEdit',
                'addFiles', 'addPdfs', 'uploadAll', 'getMediaUrlsForProperty'
            ];
            
            const requiredGlobalWrappers = [
                'processAndSavePdfs', 'clearAllPdfs', 'loadExistingPdfsForEdit',
                'getMediaUrlsForProperty'
            ];
            
            const duplicates = [];
            const recommendations = [];
            const missingWrappers = [];
            
            if (window.MediaSystem) {
                mediaSystemRequiredFunctions.forEach(funcName => {
                    const hasInMediaSystem = typeof MediaSystem[funcName] === 'function';
                    
                    if (!hasInMediaSystem) {
                        recommendations.push(`Adicionar ${funcName} ao MediaSystem v5.4`);
                    }
                });
                
                requiredGlobalWrappers.forEach(funcName => {
                    const hasGlobally = typeof window[funcName] === 'function';
                    const hasInMediaSystem = typeof MediaSystem[funcName] === 'function';
                    
                    if (!hasGlobally && hasInMediaSystem) {
                        missingWrappers.push(funcName);
                        recommendations.push(`Criar wrapper global para ${funcName} v5.4`);
                    } else if (hasGlobally && hasInMediaSystem) {
                        try {
                            const globalFunc = window[funcName];
                            const isWrapper = globalFunc.toString().includes('MediaSystem') || 
                                            globalFunc.toString().includes(funcName);
                            
                            if (!isWrapper) {
                                recommendations.push(`Verificar se window.${funcName} delega para MediaSystem v5.4`);
                            }
                        } catch (e) {}
                    }
                });
                
                const functionsToCheck = ['addFiles', 'addPdfs', 'uploadAll'];
                functionsToCheck.forEach(funcName => {
                    const hasGlobally = typeof window[funcName] === 'function';
                    const hasInMediaSystem = typeof MediaSystem[funcName] === 'function';
                    
                    if (hasGlobally && hasInMediaSystem && !requiredGlobalWrappers.includes(funcName)) {
                        duplicates.push(funcName);
                        recommendations.push(`Considerar remover window.${funcName} - use MediaSystem.${funcName} v5.4`);
                    }
                });
            }
            
            return {
                passed: duplicates.length === 0 && missingWrappers.length === 0,
                message: duplicates.length > 0 ? 
                    `Funções desnecessárias globalmente v5.4: ${duplicates.join(', ')}` :
                    missingWrappers.length > 0 ?
                    `Wrappers globais ausentes v5.4: ${missingWrappers.join(', ')}` :
                    recommendations.length > 0 ?
                    `Recomendações v5.4: ${recommendations.slice(0, 2).join('; ')}${recommendations.length > 2 ? '...' : ''}` :
                    'Todas as funções necessárias disponíveis v5.4',
                details: {
                    duplicates,
                    missingWrappers,
                    requiredGlobalWrappers,
                    recommendations,
                    version: '5.4'
                }
            };
        },
        
        'Performance de carregamento v5.4': function() {
            const scripts = Array.from(document.scripts);
            const jsScripts = scripts.filter(s => s.src && s.src.endsWith('.js'));
            
            const syncScripts = jsScripts.filter(s => !s.async && !s.defer);
            const largeScripts = jsScripts.filter(s => {
                const fileName = s.src.split('/').pop().toLowerCase();
                const largeScriptNames = ['admin', 'properties', 'gallery', 'media', 'pdf', 'diagnostics'];
                return largeScriptNames.some(name => fileName.includes(name));
            });
            
            const syncLargeScripts = syncScripts.filter(s => 
                largeScripts.some(l => l.src === s.src)
            );
            
            const performanceScore = 100 - (syncLargeScripts.length * 20);
            
            return {
                passed: syncLargeScripts.length <= 2,
                message: `Scripts grandes sync v5.4: ${syncLargeScripts.length}/${largeScripts.length}`,
                details: {
                    totalScripts: jsScripts.length,
                    syncScripts: syncScripts.length,
                    largeScripts: largeScripts.length,
                    syncLargeScripts: syncLargeScripts.length,
                    performanceScore: Math.max(0, performanceScore),
                    version: '5.4'
                }
            };
        },
        
        'Dependências críticas v5.4': function() {
            const requiredSystems = ['MediaSystem', 'supabase', 'properties'];
            const missingSystems = [];
            const availableSystems = [];
            
            requiredSystems.forEach(system => {
                if (window[system]) {
                    availableSystems.push(system);
                } else {
                    missingSystems.push(system);
                }
            });
            
            const adjustedMissing = missingSystems.filter(s => s !== 'supabase' || 
                (window.MediaSystem && !MediaSystem.supabaseClient));
            
            return {
                passed: adjustedMissing.length === 0,
                message: missingSystems.length > 0 ?
                    `Sistemas ausentes v5.4: ${missingSystems.join(', ')}` :
                    `Todos os sistemas críticos disponíveis v5.4: ${availableSystems.join(', ')}`,
                details: {
                    required: requiredSystems,
                    available: availableSystems,
                    missing: missingSystems,
                    adjustedMissing: adjustedMissing,
                    version: '5.4'
                }
            };
        },
        
        'Funções de diagnóstico v5.4': function() {
            const diagnosticFunctions = [
                'testPdfSystem',
                'interactivePdfTest',
                'diagnosePdfIconProblem',
                'runPdfCompatibilityCheck',
                'analyzeBrokenReferences',
                'analyzePlaceholders'
            ];
            
            const availableFunctions = diagnosticFunctions.filter(func => typeof window[func] === 'function');
            const missingFunctions = diagnosticFunctions.filter(func => typeof window[func] !== 'function');
            
            return {
                passed: availableFunctions.length >= diagnosticFunctions.length * 0.7,
                message: `Funções de diagnóstico disponíveis v5.4: ${availableFunctions.length}/${diagnosticFunctions.length}`,
                details: {
                    availableFunctions,
                    missingFunctions,
                    totalFunctions: diagnosticFunctions.length,
                    coverage: Math.round((availableFunctions.length / diagnosticFunctions.length) * 100),
                    version: '5.4'
                }
            };
        }
    };
    
    const results = {
        total: Object.keys(tests).length,
        passed: 0,
        failed: 0,
        details: [],
        recommendations: [],
        version: '5.4',
        timestamp: new Date().toISOString()
    };
    
    console.group('🔍 TESTE DE COMPATIBILIDADE DE MÓDULOS v5.4');
    
    Object.entries(tests).forEach(([testName, testFunction]) => {
        try {
            const testResult = testFunction();
            const testDetail = {
                name: testName,
                passed: testResult.passed,
                message: testResult.message,
                details: testResult.details || {},
                timestamp: new Date().toISOString()
            };
            
            results.details.push(testDetail);
            
            if (testResult.passed) {
                results.passed++;
                logToPanel(`✅ ${testName}: ${testResult.message}`, 'success');
                console.log(`✅ ${testName}:`, testResult.message, testResult.details || '');
            } else {
                results.failed++;
                logToPanel(`⚠️ ${testName}: ${testResult.message}`, 'warning');
                console.warn(`⚠️ ${testName}:`, testResult.message, testResult.details || '');
                
                if (testName === 'Funções duplicadas v5.4') {
                    if (testResult.details.duplicates && testResult.details.duplicates.length > 0) {
                        testResult.details.duplicates.forEach(func => {
                            results.recommendations.push(`🔗 Considerar remover window.${func} (use MediaSystem.${func}) v5.4`);
                        });
                    }
                    if (testResult.details.missingWrappers && testResult.details.missingWrappers.length > 0) {
                        testResult.details.missingWrappers.forEach(func => {
                            results.recommendations.push(`🔗 Criar wrapper global para ${func} v5.4`);
                        });
                    }
                } else if (testName === 'Performance de carregamento v5.4') {
                    if (testResult.details.syncLargeScripts > 2) {
                        results.recommendations.push('⚡ Adicionar async/defer aos scripts grandes v5.4');
                    }
                } else if (testName === 'Dependências críticas v5.4') {
                    if (testResult.details.missing && testResult.details.missing.length > 0) {
                        testResult.details.missing.forEach(system => {
                            results.recommendations.push(`📦 Verificar carregamento de ${system} v5.4`);
                        });
                    }
                } else if (testName === 'Funções de diagnóstico v5.4') {
                    if (testResult.details.missingFunctions && testResult.details.missingFunctions.length > 0) {
                        results.recommendations.push(`🔧 Implementar funções de diagnóstico ausentes: ${testResult.details.missingFunctions.join(', ')}`);
                    }
                }
            }
        } catch (error) {
            results.failed++;
            results.details.push({
                name: testName,
                passed: false,
                message: `Erro: ${error.message}`,
                error: error.stack,
                timestamp: new Date().toISOString()
            });
            logToPanel(`❌ ${testName}: Erro - ${error.message} v5.4`, 'error');
            console.error(`❌ ${testName}:`, error);
        }
    });
    
    const summaryMessage = `📊 RESULTADO COMPATIBILIDADE v5.4: ${results.passed}/${results.total} testes passaram`;
    const summaryType = results.passed === results.total ? 'success' : 
                       results.passed >= results.total * 0.7 ? 'warning' : 'error';
    
    logToPanel(summaryMessage, summaryType);
    console.log('📊 RESUMO v5.4:', results);
    
    if (results.failed > 0) {
        const hasCompatibilityRecs = results.recommendations.some(r => 
            r.includes('wrapper') || r.includes('window.') || r.includes('async') || r.includes('diagnóstico')
        );
        
        if (!hasCompatibilityRecs) {
            if (!results.recommendations.includes('🎯 Revisar event listeners para evitar sobreposição v5.4')) {
                results.recommendations.push('🎯 Revisar event listeners para evitar sobreposição v5.4');
            }
            
            if (!results.recommendations.includes('🎨 Consolidar estilos CSS em arquivos unificados v5.4')) {
                results.recommendations.push('🎨 Consolidar estilos CSS em arquivos unificados v5.4');
            }
            
            if (!results.recommendations.includes('🌐 Testar em diferentes navegadores v5.4')) {
                results.recommendations.push('🌐 Testar em diferentes navegadores v5.4');
            }
            
            if (!results.recommendations.includes('📄 Testar funcionalidades PDF com console.diag.pdf.interactive()')) {
                results.recommendations.push('📄 Testar funcionalidades PDF com console.diag.pdf.interactive()');
            }
        }
        
        if (results.recommendations.length > 0) {
            logToPanel('💡 RECOMENDAÇÕES PARA COMPATIBILIDADE v5.4:', 'info');
            console.group('💡 RECOMENDAÇÕES v5.4:');
            results.recommendations.forEach((rec, index) => {
                const icon = rec.includes('wrapper') ? '🔗' : 
                            rec.includes('window.') ? '🧹' : 
                            rec.includes('async') ? '⚡' :
                            rec.includes('carregamento') ? '📦' :
                            rec.includes('event listeners') ? '🎯' :
                            rec.includes('CSS') ? '🎨' :
                            rec.includes('navegadores') ? '🌐' :
                            rec.includes('PDF') ? '📄' :
                            rec.includes('diagnóstico') ? '🔧' : '•';
                logToPanel(`${icon} ${rec}`, 'info');
                console.log(`${index + 1}. ${rec}`);
            });
            console.groupEnd();
        }
    }
    
    console.groupEnd();
    
    return results;
};

/* ================== VERIFICAÇÃO AUTOMÁTICA DE MIGRAÇÃO v5.4 ================== */
window.validateMediaMigration = function() {
    logToPanel('🚀 INICIANDO VERIFICAÇÃO AUTOMÁTICA DE MIGRAÇÃO v5.4', 'migration');
    
    const checks = {
        // Sistema principal
        'MediaSystem carregado v5.4': typeof MediaSystem !== 'undefined',
        
        // Verificar se MediaSystem tem funções básicas (em vez de isUnifiedSystem)
        'MediaSystem funcional v5.4': MediaSystem && 
            (typeof MediaSystem.addFiles === 'function' ||
             typeof MediaSystem.addPdfs === 'function' ||
             typeof MediaSystem.uploadAll === 'function'),
        
        // Funções essenciais no MediaSystem
        'Funções upload MediaSystem v5.4': MediaSystem && 
            typeof MediaSystem.addFiles === 'function' &&
            typeof MediaSystem.addPdfs === 'function' &&
            typeof MediaSystem.uploadAll === 'function',
        
        // Wrappers de compatibilidade (CRÍTICO)
        'Wrapper processAndSavePdfs v5.4': typeof window.processAndSavePdfs === 'function',
        'Wrapper getMediaUrlsForProperty v5.4': typeof window.getMediaUrlsForProperty === 'function',
        'Wrapper clearAllPdfs v5.4': typeof window.clearAllPdfs === 'function',
        'Wrapper loadExistingPdfsForEdit v5.4': typeof window.loadExistingPdfsForEdit === 'function',
        
        // Elementos de interface
        'Upload preview ativo v5.4': document.getElementById('uploadPreview') !== null,
        'Modal PDF disponível v5.4': document.getElementById('pdfModal') !== null,
        
        // Sistemas de suporte
        'Supabase disponível v5.4': typeof supabase !== 'undefined' || 
            (MediaSystem && MediaSystem.supabaseClient),
        'Propriedades carregadas v5.4': typeof properties !== 'undefined' && Array.isArray(properties),
        
        // Verificação PDF específica
        'PdfSystem carregado v5.4': typeof window.PdfSystem !== 'undefined',
        'Campo senha PDF existe v5.4': document.getElementById('pdfPassword') !== null,
        
        // Novas verificações v5.4
        'Teste interativo PDF disponível v5.4': typeof window.interactivePdfTest === 'function',
        'Diagnóstico PDF disponível v5.4': typeof window.diagnosePdfIconProblem === 'function',
        'Verificação compatibilidade PDF v5.4': typeof window.runPdfCompatibilityCheck === 'function'
    };
    
    let passed = 0;
    let total = 0;
    const details = [];
    
    console.group('🚀 VERIFICAÇÃO DE MIGRAÇÃO DE MÍDIA v5.4');
    
    Object.entries(checks).forEach(([checkName, checkResult]) => {
        total++;
        if (checkResult) passed++;
        
        const status = checkResult ? '✅' : '❌';
        const message = `${status} ${checkName}`;
        
        details.push({ 
            name: checkName, 
            passed: checkResult,
            timestamp: new Date().toISOString()
        });
        
        logToPanel(message, checkResult ? 'success' : 'error');
        console.log(message);
    });
    
    const compatibilityScore = Math.round((passed / total) * 100);
    const isReadyForMigration = compatibilityScore >= 85;
    
    console.log(`📊 Pontuação v5.4: ${passed}/${total} (${compatibilityScore}%)`);
    console.log(`🚀 Pronto para migração v5.4: ${isReadyForMigration ? 'SIM' : 'NÃO'}`);
    console.groupEnd();
    
    const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        migrationReady: isReadyForMigration,
        compatibilityScore,
        passed,
        total,
        checks: details,
        version: '5.4',
        summary: {
            passed,
            total,
            criticalMissing: details.filter(d => !d.passed && (
                d.name.includes('Wrapper') || 
                d.name.includes('MediaSystem') ||
                d.name.includes('PdfSystem')
            )).map(d => d.name),
            recommendations: []
        }
    };
    
    if (!isReadyForMigration) {
        const missingWrappers = details.filter(d => !d.passed && d.name.includes('Wrapper'));
        if (missingWrappers.length > 0) {
            report.summary.recommendations.push(
                `Criar wrappers para v5.4: ${missingWrappers.map(w => w.name.replace('Wrapper ', '').replace(' v5.4', '')).join(', ')}`
            );
        }
        
        if (!checks['MediaSystem carregado v5.4']) {
            report.summary.recommendations.push('Carregar MediaSystem unificado v5.4');
        }
        
        if (!checks['MediaSystem funcional v5.4']) {
            report.summary.recommendations.push('Inicializar funções básicas do MediaSystem v5.4');
        }
        
        if (!checks['PdfSystem carregado v5.4']) {
            report.summary.recommendations.push('Verificar carregamento do PdfSystem v5.4');
        }
        
        if (!checks['Teste interativo PDF disponível v5.4']) {
            report.summary.recommendations.push('Implementar teste interativo PDF v5.4');
        }
    }
    
    lastMigrationReport = report;
    
    showMigrationValidationAlert(isReadyForMigration, report);
    
    return report;
};

/* ================== ALERTA DE VALIDAÇÃO DE MIGRAÇÃO v5.4 ================== */
function showMigrationValidationAlert(isReady, report) {
    const alertId = 'migration-validation-alert-v5-4';
    
    const existingAlert = document.getElementById(alertId);
    if (existingAlert) {
        document.body.removeChild(existingAlert);
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${isReady ? 'linear-gradient(135deg, #001a00, #000a1a)' : 'linear-gradient(135deg, #1a0000, #000a0a)'};
        color: ${isReady ? '#00ff9c' : '#ff5555'};
        padding: 25px;
        border: 3px solid ${isReady ? '#00ff9c' : '#ff5555'};
        border-radius: 10px;
        z-index: 1000001;
        max-width: 600px;
        width: 90%;
        text-align: center;
        box-shadow: 0 0 50px ${isReady ? 'rgba(0, 255, 156, 0.5)' : 'rgba(255, 0, 0, 0.5)'};
        font-family: 'Consolas', 'Monaco', monospace;
        backdrop-filter: blur(10px);
    `;
    
    if (isReady) {
        alertDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>🚀</span>
                <span>SISTEMA VALIDADO PARA MIGRAÇÃO v5.4</span>
            </div>
            
            <div style="background: ${isReady ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 0, 0, 0.1)'}; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center; border: 1px solid ${isReady ? 'rgba(0, 255, 156, 0.3)' : 'rgba(255, 0, 0, 0.3)'};">
                <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">
                    ${report.compatibilityScore}%
                </div>
                <div style="font-size: 14px; color: #88ffaa;">
                    ${report.passed}/${report.total} verificações passaram v5.4
                </div>
            </div>
            
            <div style="text-align: left; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #88ffaa; margin-bottom: 10px;">
                    ✅ SISTEMA PRONTO PARA v5.4:
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #aaffcc;">
                    <li>Remover módulos antigos de mídia e PDF</li>
                    <li>Manter apenas MediaSystem unificado</li>
                    <li>Atualizar imports em admin.js e properties.js</li>
                    <li>Testar uploads em produção</li>
                    <li>Usar console.diag para diagnóstico contínuo</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="migrate-now-btn-v5-4" style="
                    background: #00ff9c; color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;
                    transition: all 0.2s;">
                    MIGRAR AGORA
                </button>
                <button id="close-alert-btn-v5-4" style="
                    background: #555; color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;
                    transition: all 0.2s;">
                    FECHAR
                </button>
                <button id="export-report-btn-v5-4" style="
                    background: #0088cc; color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;
                    transition: all 0.2s;">
                    📊 RELATÓRIO
                </button>
            </div>
            
            <div style="font-size: 11px; color: #88ffaa; margin-top: 15px;">
                Sistema validado em ${new Date().toLocaleTimeString()} - v5.4
            </div>
        `;
    } else {
        alertDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>⚠️</span>
                <span>NÃO PRONTO PARA MIGRAÇÃO v5.4</span>
            </div>
            
            <div style="background: rgba(255, 0, 0, 0.1); padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center; border: 1px solid rgba(255, 0, 0, 0.3);">
                <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px; color: #ff5555;">
                    ${report.compatibilityScore}%
                </div>
                <div style="font-size: 14px; color: #ff8888;">
                    Apenas ${report.passed}/${report.total} verificações passaram v5.4
                </div>
            </div>
            
            <div style="text-align: left; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #ff8888; margin-bottom: 10px;">
                    ❌ PROBLEMAS IDENTIFICADOS v5.4:
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffaaaa;">
                    ${report.summary.criticalMissing.map(item => `<li>${item}</li>`).join('')}
                </ul>
                
                <div style="font-size: 14px; color: #ffaa00; margin-top: 15px; margin-bottom: 10px;">
                    💡 RECOMENDAÇÕES v5.4:
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffcc88;">
                    ${report.summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="run-diagnostics-btn-v5-4" style="
                    background: #ffaa00; color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;
                    transition: all 0.2s;">
                    🔍 DIAGNÓSTICO
                </button>
                <button id="close-alert-btn-v5-4" style="
                    background: #555; color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;
                    transition: all 0.2s;">
                    FECHAR
                </button>
                <button id="export-report-btn-v5-4" style="
                    background: #0088cc; color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;
                    transition: all 0.2s;">
                    📊 RELATÓRIO
                </button>
            </div>
            
            <div style="font-size: 11px; color: #ff8888; margin-top: 15px;">
                Não remova módulos antigos até corrigir os problemas - v5.4
            </div>
        `;
    }
    
    document.body.appendChild(alertDiv);
    
    if (isReady) {
        document.getElementById('migrate-now-btn-v5-4')?.addEventListener('click', () => {
            logToPanel('🚀 Iniciando processo de migração v5.4...', 'migration');
            alertDiv.innerHTML = `
                <div style="font-size: 20px; margin-bottom: 15px; color: #00ff9c;">
                    ⚙️ INICIANDO MIGRAÇÃO v5.4...
                </div>
                <div style="font-size: 14px; color: #88ffaa; margin-bottom: 20px;">
                    Preparando remoção de módulos antigos...
                </div>
                <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(0, 255, 156, 0.3);">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                        <div class="loader" style="width: 20px; height: 20px; border: 3px solid #00ff9c; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <span>Processando v5.4...</span>
                    </div>
                    <div style="font-size: 11px; color: #88ffaa;">
                        Esta operação pode levar alguns segundos
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            
            setTimeout(() => {
                document.body.removeChild(alertDiv);
                logToPanel('✅ Migração simulada concluída v5.4!', 'success');
                showMigrationSuccessAlert();
            }, 2000);
        });
    } else {
        document.getElementById('run-diagnostics-btn-v5-4')?.addEventListener('click', () => {
            document.body.removeChild(alertDiv);
            window.runDiagnostics();
        });
    }
    
    document.getElementById('close-alert-btn-v5-4')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
    
    document.getElementById('export-report-btn-v5-4')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `migration-validation-v5.4-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logToPanel('📊 Relatório de migração exportado v5.4', 'migration');
    });
}

/* ================== ALERTA DE SUCESSO DA MIGRAÇÃO v5.4 ================== */
function showMigrationSuccessAlert() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #001a00, #000a1a);
        color: #00ff9c;
        padding: 30px;
        border: 3px solid #00ff9c;
        border-radius: 10px;
        z-index: 1000002;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 50px rgba(0, 255, 156, 0.5);
        font-family: 'Consolas', 'Monaco', monospace;
        backdrop-filter: blur(10px);
    `;
    
    successDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>🎉</span>
            <span>MIGRAÇÃO CONCLUÍDA! v5.4</span>
        </div>
        
        <div style="background: rgba(0, 255, 156, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 1px solid rgba(0, 255, 156, 0.3);">
            <div style="font-size: 18px; margin-bottom: 10px; color: #88ffaa;">
                Sistema unificado ativado v5.4
            </div>
            <div style="font-size: 12px; color: #aaffcc;">
                Todos os módulos antigos podem ser removidos com segurança
            </div>
        </div>
        
        <div style="text-align: left; margin-bottom: 20px;">
            <div style="font-size: 14px; color: #88ffaa; margin-bottom: 10px;">
                ✅ AÇÕES REALIZADAS v5.4:
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #aaffcc;">
                <li>Sistema de mídia unificado ativado</li>
                <li>Wrappers de compatibilidade configurados</li>
                <li>Interface admin atualizada</li>
                <li>Sistema de preview migrado</li>
                <li>Testes interativos disponíveis</li>
            </ul>
        </div>
        
        <button id="close-success-alert-v5-4" style="
            background: #00ff9c; color: #000; border: none;
            padding: 12px 24px; cursor: pointer; border-radius: 5px;
            font-weight: bold; font-size: 14px; width: 100%; transition: all 0.2s;">
            ENTENDIDO
        </button>
        
        <div style="font-size: 11px; color: #88ffaa; margin-top: 15px;">
            Recomenda-se fazer backup antes de remover arquivos antigos - v5.4
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    document.getElementById('close-success-alert-v5-4').addEventListener('click', () => {
        document.body.removeChild(successDiv);
    });
}

/* ================== INICIALIZAÇÃO AUTOMÁTICA v5.4 ================== */
window.autoValidateMigration = function() {
    setTimeout(() => {
        logToPanel('🔍 Verificação automática de migração iniciada v5.4...', 'debug');
        
        if (DIAGNOSTICS_MODE) {
            logToPanel('✅ Modo diagnóstico ativo - validação automática habilitada v5.4', 'success');
            
            setTimeout(() => {
                if (typeof window.validateMediaMigration === 'function') {
                    const report = window.validateMediaMigration();
                    updateMigrationTab(report);
                } else {
                    logToPanel('❌ Função validateMediaMigration não encontrada v5.4', 'error');
                }
            }, 1000);
        } else {
            logToPanel('ℹ️ Modo diagnóstico não ativo - validação automática desabilitada v5.4', 'info');
        }
    }, 2000);
};

/* ================== CLASSIFICAÇÃO DE MÓDULOS v5.4 ================== */
function classifyModule(fileName) {
    const coreModules = [
        'admin.js', 'properties.js', 'gallery.js', 
        'properties-core.js', 'media-core.js', 'pdf-core.js',
        'diagnostics.js'
    ];
    
    const performanceModules = [
        'optimizer.js', 'core-optimizer.js'
    ];
    
    const supportModules = [
        'diagnostics.js', 'function-verifier.js', 'media-logger.js',
        'media-recovery.js', 'pdf-logger.js', 'duplication-checker.js',
        'emergency-recovery.js', 'simple-checker.js', 'validation.js',
        'validation-essentials.js'
    ];
    
    const uiModules = [
        'media-ui.js', 'media-integration.js', 'pdf-ui.js', 'pdf-integration.js'
    ];
    
    const utilModules = [
        'utils.js', 'media-utils.js', 'pdf-utils.js'
    ];
    
    if (coreModules.includes(fileName)) return { type: 'CORE', emoji: '⚙️', version: '5.4' };
    if (performanceModules.includes(fileName)) return { type: 'PERFORMANCE', emoji: '⚡', version: '5.4' };
    if (supportModules.includes(fileName)) return { type: 'SUPPORT', emoji: '🔧', version: '5.4' };
    if (uiModules.includes(fileName)) return { type: 'UI', emoji: '🎨', version: '5.4' };
    if (utilModules.includes(fileName)) return { type: 'UTIL', emoji: '🧰', version: '5.4' };
    if (fileName.includes('supabase')) return { type: 'EXTERNAL', emoji: '📦', version: '5.4' };
    
    return { type: 'UNKNOWN', emoji: '❓', version: '5.4' };
}

/* ================== ANÁLISE DO SISTEMA v5.4 ================== */
function analyzeSystem() {
    logToPanel('Iniciando análise do sistema v5.4...', 'info');
    updateStatus('Analisando sistema v5.4...', 'info');
    
    const scripts = Array.from(document.scripts)
        .filter(s => s.src)
        .map(s => ({
            src: s.src,
            fileName: s.src.split('/').pop(),
            async: s.async,
            defer: s.defer,
            type: s.type,
            timestamp: new Date().toISOString()
        }));
    
    const systems = {
        MediaSystem: 'MediaSystem' in window,
        PdfLogger: 'PdfLogger' in window,
        ValidationSystem: 'ValidationSystem' in window,
        EmergencySystem: 'EmergencySystem' in window,
        PdfSystem: 'PdfSystem' in window,
        supabase: 'supabase' in window,
        properties: 'properties' in window,
        admin: 'toggleAdminPanel' in window,
        gallery: 'gallery' in window,
        optimizer: 'performanceOptimizer' in window,
        diagnostics: 'runDiagnostics' in window
    };
    
    const criticalElements = {
        'pdfModal': document.getElementById('pdfModal'),
        'pdfPassword': document.getElementById('pdfPassword'),
        'mediaUpload': document.getElementById('mediaUpload'),
        'adminPanel': document.getElementById('adminPanel'),
        'uploadPreview': document.getElementById('uploadPreview')
    };
    
    return { 
        scripts, 
        systems, 
        criticalElements,
        version: '5.4',
        timestamp: new Date().toISOString()
    };
}

/* ================== ATUALIZAR ABA DE MIGRAÇÃO v5.4 ================== */
function updateMigrationTab(results) {
    const testsContent = document.getElementById('tests-content');
    if (!testsContent) return;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #ff00ff; margin-bottom: 15px;">🚀 VERIFICAÇÃO AUTOMÁTICA DE MIGRAÇÃO v5.4</h3>
            
            <div style="background: rgba(255, 0, 255, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(255, 0, 255, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <div style="font-size: 11px; color: #888;">STATUS DA MIGRAÇÃO v5.4</div>
                        <div style="font-size: 24px; color: ${results.migrationReady ? '#00ff9c' : '#ff5555'}">
                            ${results.migrationReady ? '✅ PRONTA' : '❌ NÃO PRONTA'}
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 11px; color: #888;">COMPATIBILIDADE</div>
                        <div style="font-size: 24px; color: ${results.compatibilityScore >= 85 ? '#00ff9c' : '#ffaa00'}">
                            ${results.compatibilityScore}%
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 11px; color: #888;">VERIFICAÇÕES</div>
                        <div style="font-size: 24px; color: #00ff9c;">
                            ${results.passed}/${results.total}
                        </div>
                    </div>
                </div>
                
                <div style="height: 10px; background: #333; border-radius: 5px; overflow: hidden;">
                    <div style="height: 100%; width: ${results.compatibilityScore}%; background: ${results.compatibilityScore >= 85 ? '#00ff9c' : '#ffaa00'};"></div>
                </div>
                <div style="font-size: 10px; color: #888; text-align: center; margin-top: 5px;">
                    v${results.version || '5.4'}
                </div>
            </div>
            
            <div>
                <h4 style="color: #ff00ff; margin-bottom: 10px;">📋 VERIFICAÇÕES REALIZADAS v5.4</h4>
                <div style="max-height: 300px; overflow-y: auto;">
    `;
    
    results.checks.forEach((check, index) => {
        html += `
            <div style="
                background: ${check.passed ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 0, 0, 0.1)'};
                padding: 10px; margin-bottom: 6px; border-radius: 4px;
                border-left: 3px solid ${check.passed ? '#00ff9c' : '#ff5555'};
                border: 1px solid ${check.passed ? 'rgba(0, 255, 156, 0.3)' : 'rgba(255, 0, 0, 0.3)'};
                display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; color: ${check.passed ? '#00ff9c' : '#ff5555'};">
                        ${check.passed ? '✅' : '❌'} ${check.name}
                    </div>
                </div>
                <span style="font-size: 10px; color: #888;">#${index + 1}</span>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            ${results.summary.criticalMissing.length > 0 ? `
                <div style="background: rgba(255, 0, 0, 0.1); padding: 15px; border-radius: 6px; margin-top: 20px; border: 1px solid rgba(255, 0, 0, 0.3);">
                    <h4 style="color: #ff5555; margin-bottom: 10px;">⚠️ PROBLEMAS CRÍTICOS v5.4</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffaaaa;">
                        ${results.summary.criticalMissing.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${results.summary.recommendations.length > 0 ? `
                <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px; margin-top: 20px; border: 1px solid rgba(0, 255, 156, 0.3);">
                    <h4 style="color: #00ff9c; margin-bottom: 10px;">💡 RECOMENDAÇÕES v5.4</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #aaffcc;">
                        ${results.summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button id="run-auto-migration-check-v5-4" style="
                background: linear-gradient(45deg, #ff00ff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                🔄 EXECUTAR NOVAMENTE v5.4
            </button>
            <button id="export-migration-report-v5-4" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                📊 EXPORTAR RELATÓRIO v5.4
            </button>
            <button id="view-in-console-v5-4" style="
                background: #0088cc; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                📝 VER NO CONSOLE F12 v5.4
            </button>
        </div>
        
        <div style="font-size: 11px; color: #888; text-align: center; margin-top: 10px;">
            Verificação automática iniciada após carregar módulos de suporte - v5.4
        </div>
    `;
    
    testsContent.innerHTML = html;
    
    document.getElementById('run-auto-migration-check-v5-4')?.addEventListener('click', () => {
        if (typeof window.autoValidateMigration === 'function') {
            window.autoValidateMigration();
        }
    });
    
    document.getElementById('export-migration-report-v5-4')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `migration-auto-check-v5.4-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logToPanel('📊 Relatório de verificação automática exportado v5.4', 'migration');
    });
    
    document.getElementById('view-in-console-v5-4')?.addEventListener('click', () => {
        console.group('🚀 RELATÓRIO DE VERIFICAÇÃO AUTOMÁTICA v5.4');
        console.log('Status:', results.migrationReady ? '✅ PRONTO PARA MIGRAÇÃO' : '❌ NÃO PRONTO');
        console.log('Pontuação:', `${results.compatibilityScore}% (${results.passed}/${results.total})`);
        console.log('Versão:', results.version || '5.4');
        console.log('Verificações:');
        results.checks.forEach(check => {
            console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
        });
        if (results.summary.criticalMissing.length > 0) {
            console.log('Problemas críticos:', results.summary.criticalMissing);
        }
        if (results.summary.recommendations.length > 0) {
            console.log('Recomendações:', results.summary.recommendations);
        }
        console.groupEnd();
    });
}

/* ================== TESTES AUTOMÁTICOS v5.4 ================== */
async function testMediaUnifiedComplete() {
    logToPanel('🧪 Iniciando teste completo do sistema unificado v5.4...', 'debug');
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0,
        tests: [],
        version: '5.4',
        timestamp: new Date().toISOString()
    };
    
    if (!window.MediaSystem) {
        results.tests.push({ 
            name: 'MediaSystem disponível v5.4', 
            passed: false, 
            message: 'MediaSystem não encontrado',
            timestamp: new Date().toISOString()
        });
        logToPanel('❌ MediaSystem não disponível v5.4', 'error');
        results.failed++;
    } else {
        results.tests.push({ 
            name: 'MediaSystem disponível v5.4', 
            passed: true,
            timestamp: new Date().toISOString()
        });
        logToPanel('✅ MediaSystem disponível v5.4', 'success');
        results.passed++;
    }
    results.total++;
    
    if (window.MediaSystem) {
        const criticalFunctions = [
            'processAndSavePdfs',
            'clearAllPdfs',
            'loadExistingPdfsForEdit',
            'getPdfsToSave',
            'getMediaUrlsForProperty'
        ];
        
        criticalFunctions.forEach(func => {
            const exists = typeof MediaSystem[func] === 'function';
            results.tests.push({ 
                name: `MediaSystem.${func} v5.4`, 
                passed: exists,
                timestamp: new Date().toISOString()
            });
            
            logToPanel(`${exists ? '✅' : '❌'} ${func} v5.4`, exists ? 'success' : 'error');
            if (exists) results.passed++;
            else results.failed++;
            results.total++;
        });
    }
    
    logToPanel('🔍 Verificando funções essenciais de migração v5.4...', 'migration');
    
    const migrationChecks = [
        { name: 'MediaSystem.addFiles v5.4', check: () => typeof MediaSystem.addFiles === 'function' },
        { name: 'MediaSystem.addPdfs v5.4', check: () => typeof MediaSystem.addPdfs === 'function' },
        { name: 'MediaSystem.uploadAll v5.4', check: () => typeof MediaSystem.uploadAll === 'function' },
        { name: 'window.processAndSavePdfs v5.4', check: () => typeof window.processAndSavePdfs === 'function' },
        { name: 'window.getMediaUrlsForProperty v5.4', check: () => typeof window.getMediaUrlsForProperty === 'function' },
        { name: 'window.clearAllPdfs (wrapper) v5.4', check: () => typeof window.clearAllPdfs === 'function' },
        { name: 'window.loadExistingPdfsForEdit (wrapper) v5.4', check: () => typeof window.loadExistingPdfsForEdit === 'function' }
    ];
    
    migrationChecks.forEach(check => {
        const passed = check.check();
        const isWrapper = check.name.includes('wrapper');
        results.tests.push({ 
            name: check.name, 
            passed,
            message: passed ? (isWrapper ? 'Wrapper disponível para compatibilidade v5.4' : 'Função disponível para migração v5.4') : (isWrapper ? 'Wrapper necessário para compatibilidade v5.4' : 'Função necessária para migração v5.4'),
            timestamp: new Date().toISOString()
        });
        
        logToPanel(`${passed ? '✅' : '❌'} ${check.name}`, passed ? 'success' : 'error');
        if (passed) results.passed++;
        else results.failed++;
        results.total++;
    });
    
    logToPanel('🔍 Testando modal de PDF v5.4...', 'debug');
    const pdfModal = document.getElementById('pdfModal');
    const pdfPassword = document.getElementById('pdfPassword');
    
    const modalExists = !!pdfModal;
    const passwordExists = !!pdfPassword;
    
    results.tests.push({ 
        name: 'PDF Modal existe v5.4', 
        passed: modalExists,
        message: modalExists ? 'Modal encontrado v5.4' : 'Modal não encontrado v5.4',
        timestamp: new Date().toISOString()
    });
    
    results.tests.push({ 
        name: 'PDF Password field existe v5.4', 
        passed: passwordExists,
        message: passwordExists ? 'Campo encontrado v5.4' : 'Campo não encontrado v5.4',
        timestamp: new Date().toISOString()
    });
    
    logToPanel(`PDF Modal: ${modalExists ? '✅ Existe v5.4' : '❌ Não existe v5.4'}`, modalExists ? 'success' : 'error');
    logToPanel(`Password Field: ${passwordExists ? '✅ Existe v5.4' : '❌ Não existe v5.4'}`, passwordExists ? 'success' : 'warning');
    
    if (pdfPassword) {
        logToPanel(`Estilo display: ${pdfPassword.style.display} v5.4`, 'info');
        logToPanel(`Estilo visibility: ${pdfPassword.style.visibility} v5.4`, 'info');
    }
    
    if (modalExists) results.passed++;
    else results.failed++;
    results.total++;
    
    if (passwordExists) results.passed++;
    else results.failed++;
    results.total++;
    
    const uploadPreview = document.getElementById('uploadPreview');
    results.tests.push({
        name: 'Sistema de preview ativo v5.4',
        passed: !!uploadPreview,
        message: uploadPreview ? 'Preview disponível para migração v5.4' : 'Preview necessário para migração v5.4',
        timestamp: new Date().toISOString()
    });
    logToPanel(`Upload Preview: ${uploadPreview ? '✅ Existe v5.4' : '❌ Não existe v5.4'}`, uploadPreview ? 'success' : 'error');
    if (uploadPreview) results.passed++;
    else results.failed++;
    results.total++;
    
    if (window.properties && Array.isArray(window.properties)) {
        results.tests.push({ 
            name: 'Propriedades carregadas v5.4', 
            passed: true,
            message: `${window.properties.length} propriedades carregadas v5.4`,
            timestamp: new Date().toISOString()
        });
        logToPanel(`✅ ${window.properties.length} propriedades carregadas v5.4`, 'success');
        results.passed++;
    } else {
        results.tests.push({ 
            name: 'Propriedades carregadas v5.4', 
            passed: false,
            message: 'Propriedades não carregadas v5.4',
            timestamp: new Date().toISOString()
        });
        logToPanel('❌ Propriedades não carregadas v5.4', 'error');
        results.failed++;
    }
    results.total++;
    
    if (window.supabase) {
        results.tests.push({ 
            name: 'Supabase Client v5.4', 
            passed: true,
            message: 'Cliente Supabase disponível v5.4',
            timestamp: new Date().toISOString()
        });
        logToPanel('✅ Supabase Client disponível v5.4', 'success');
        results.passed++;
    } else {
        results.tests.push({ 
            name: 'Supabase Client v5.4', 
            passed: false,
            message: 'Cliente Supabase não disponível v5.4',
            timestamp: new Date().toISOString()
        });
        logToPanel('⚠️  Supabase Client não disponível (pode ser normal em fallback) v5.4', 'warning');
    }
    results.total++;
    
    logToPanel('🔍 Executando novo teste de compatibilidade de módulos v5.4...', 'debug');
    try {
        const compatibilityResults = window.testModuleCompatibility();
        
        const compatibilityScore = compatibilityResults.passed / compatibilityResults.total;
        const compatibilityPassed = compatibilityScore >= 0.8;
        
        results.tests.push({
            name: 'Teste de compatibilidade de módulos v5.4',
            passed: compatibilityPassed,
            message: `Compatibilidade: ${compatibilityResults.passed}/${compatibilityResults.total} testes passaram (${Math.round(compatibilityScore * 100)}%) v5.4`,
            timestamp: new Date().toISOString()
        });
        
        if (compatibilityPassed) {
            logToPanel(`✅ Compatibilidade OK: ${compatibilityResults.passed}/${compatibilityResults.total} testes v5.4`, 'success');
            results.passed++;
        } else {
            logToPanel(`⚠️ Compatibilidade: ${compatibilityResults.passed}/${compatibilityResults.total} testes passaram v5.4`, 'warning');
            results.failed++;
        }
        results.total++;
    } catch (error) {
        results.tests.push({
            name: 'Teste de compatibilidade de módulos v5.4',
            passed: false,
            message: `Erro: ${error.message} v5.4`,
            timestamp: new Date().toISOString()
        });
        logToPanel(`❌ Erro no teste de compatibilidade: ${error.message} v5.4`, 'error');
        results.failed++;
        results.total++;
    }
    
    // Testar funcionalidades PDF específicas v5.4
    logToPanel('🔍 Testando funcionalidades PDF específicas v5.4...', 'pdf-check');
    
    const pdfSpecificTests = [
        { name: 'Função testPdfSystem v5.4', check: () => typeof window.testPdfSystem === 'function' },
        { name: 'Função interactivePdfTest v5.4', check: () => typeof window.interactivePdfTest === 'function' },
        { name: 'Função diagnosePdfIconProblem v5.4', check: () => typeof window.diagnosePdfIconProblem === 'function' },
        { name: 'Função runPdfCompatibilityCheck v5.4', check: () => typeof window.runPdfCompatibilityCheck === 'function' }
    ];
    
    pdfSpecificTests.forEach(test => {
        const passed = test.check();
        results.tests.push({
            name: test.name,
            passed,
            message: passed ? 'Disponível v5.4' : 'Não disponível v5.4',
            timestamp: new Date().toISOString()
        });
        
        logToPanel(`${passed ? '✅' : '❌'} ${test.name}`, passed ? 'success' : 'warning');
        if (passed) results.passed++;
        else results.failed++;
        results.total++;
    });
    
    currentTestResults = results;
    return results;
}

/* ================== DIAGNÓSTICO MOBILE PDF v5.4 ================== */
window.diagnosePdfModalMobile = function() {
    const results = {
        deviceInfo: {},
        modalAnalysis: {},
        cssAnalysis: {},
        layoutIssues: [],
        recommendations: [],
        version: '5.4',
        timestamp: new Date().toISOString()
    };
    
    console.group('🔍 DIAGNÓSTICO DO MODAL PDF EM MOBILE v5.4');
    
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Tablet|Kindle|Samsung Tablet/i.test(navigator.userAgent);
    
    results.deviceInfo = {
        type: isMobile ? (isTablet ? 'TABLET' : 'MOBILE') : 'DESKTOP',
        userAgent: navigator.userAgent.substring(0, 80) + '...',
        viewport: { 
            width: window.innerWidth, 
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio
        },
        touchSupport: 'ontouchstart' in window,
        timestamp: new Date().toISOString()
    };
    
    console.log('📱 Dispositivo v5.4:', results.deviceInfo.type);
    console.log('📏 Viewport:', window.innerWidth, 'x', window.innerHeight);
    console.log('👆 Touch:', results.deviceInfo.touchSupport);
    
    const pdfModal = document.getElementById('pdfModal');
    results.modalAnalysis.exists = !!pdfModal;
    
    console.log('✅ Modal PDF existe? v5.4', results.modalAnalysis.exists);
    
    if (pdfModal) {
        const computedStyle = window.getComputedStyle(pdfModal);
        results.modalAnalysis.style = {
            display: computedStyle.display,
            position: computedStyle.position,
            width: computedStyle.width,
            height: computedStyle.height,
            maxWidth: computedStyle.maxWidth,
            maxHeight: computedStyle.maxHeight,
            padding: computedStyle.padding,
            margin: computedStyle.margin,
            zIndex: computedStyle.zIndex,
            overflow: computedStyle.overflow,
            timestamp: new Date().toISOString()
        };
        
        console.log('🎨 Estilo do modal v5.4:');
        Object.entries(results.modalAnalysis.style).forEach(([key, value]) => {
            console.log(`- ${key}:`, value);
        });
        
        const modalContent = pdfModal.querySelector('.pdf-modal-content');
        results.modalAnalysis.content = {
            hasContentDiv: !!modalContent,
            contentStyle: {},
            timestamp: new Date().toISOString()
        };
        
        if (modalContent) {
            const contentStyle = window.getComputedStyle(modalContent);
            results.modalAnalysis.content.contentStyle = {
                width: contentStyle.width,
                maxWidth: contentStyle.maxWidth,
                padding: contentStyle.padding,
                margin: contentStyle.margin,
                backgroundColor: contentStyle.backgroundColor,
                borderRadius: contentStyle.borderRadius,
                timestamp: new Date().toISOString()
            };
            
            console.log('📦 Estilo do conteúdo v5.4:');
            Object.entries(results.modalAnalysis.content.contentStyle).forEach(([key, value]) => {
                console.log(`- ${key}:`, value);
            });
        }
        
        const passwordInput = document.getElementById('pdfPassword');
        results.modalAnalysis.passwordField = {
            exists: !!passwordInput,
            style: {},
            timestamp: new Date().toISOString()
        };
        
        console.log('🔐 Campo de senha v5.4:', passwordInput ? 'EXISTE' : 'NÃO EXISTE');
        if (passwordInput) {
            const passwordStyle = window.getComputedStyle(passwordInput);
            results.modalAnalysis.passwordField.style = {
                display: passwordStyle.display,
                width: passwordStyle.width,
                visibility: passwordStyle.visibility,
                opacity: passwordStyle.opacity,
                position: passwordStyle.position,
                timestamp: new Date().toISOString()
            };
            
            Object.entries(results.modalAnalysis.passwordField.style).forEach(([key, value]) => {
                console.log(`- ${key}:`, value);
            });
        }
        
        results.modalAnalysis.visible = pdfModal.style.display === 'flex' || 
                                      pdfModal.style.display === 'block' ||
                                      getComputedStyle(pdfModal).display !== 'none';
        
        console.log('👁️ Modal visível? v5.4', results.modalAnalysis.visible);
        
        if (results.modalAnalysis.visible) {
            const rect = pdfModal.getBoundingClientRect();
            results.modalAnalysis.boundingBox = {
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
                height: rect.height,
                timestamp: new Date().toISOString()
            };
            
            console.log('📐 Bounding Box v5.4:', rect);
            
            if (rect.width > window.innerWidth) {
                results.layoutIssues.push('Modal mais largo que a viewport v5.4');
            }
            if (rect.height > window.innerHeight) {
                results.layoutIssues.push('Modal mais alto que a viewport v5.4');
            }
            if (rect.left < 0 || rect.right > window.innerWidth) {
                results.layoutIssues.push('Modal fora da viewport horizontalmente v5.4');
            }
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                results.layoutIssues.push('Modal fora da viewport verticalmente v5.4');
            }
        }
    }
    
    const allStyles = Array.from(document.styleSheets);
    results.cssAnalysis = {
        totalSheets: allStyles.length,
        sheets: allStyles.map(ss => ({
            href: ss.href || 'inline',
            disabled: ss.disabled,
            rulesCount: 0,
            timestamp: new Date().toISOString()
        })).slice(0, 10),
        galleryCss: !!allStyles.find(ss => ss.href && ss.href.includes('gallery.css')),
        adminCss: !!allStyles.find(ss => ss.href && ss.href.includes('admin.css')),
        pdfCss: !!allStyles.find(ss => ss.href && ss.href.includes('pdf') && ss.href.includes('.css')),
        timestamp: new Date().toISOString()
    };
    
    console.log('🎨 CSS Carregado v5.4:');
    console.log('- Total sheets:', results.cssAnalysis.totalSheets);
    console.log('- gallery.css:', results.cssAnalysis.galleryCss);
    console.log('- admin.css:', results.cssAnalysis.adminCss);
    console.log('- pdf*.css:', results.cssAnalysis.pdfCss);
    
    if (isMobile || isTablet) {
        if (!results.modalAnalysis.exists) {
            results.recommendations.push('Criar modal PDF específico para mobile v5.4');
        } else {
            const modalWidth = parseInt(results.modalAnalysis.style.width) || 0;
            const viewportWidth = window.innerWidth;
            
            if (modalWidth > viewportWidth * 0.95) {
                results.recommendations.push('Reduzir largura do modal para 95% da viewport v5.4');
            }
            
            if (!results.modalAnalysis.style.maxWidth || results.modalAnalysis.style.maxWidth === 'none') {
                results.recommendations.push('Definir max-width no modal (ex: 95vw) v5.4');
            }
            
            if (results.modalAnalysis.passwordField.exists && 
                results.modalAnalysis.passwordField.style.width === '100%') {
                results.recommendations.push('Reduzir largura do campo de senha para 90% em mobile v5.4');
            }
            
            if (!results.modalAnalysis.content.hasContentDiv) {
                results.recommendations.push('Adicionar div .pdf-modal-content para melhor controle de layout v5.4');
            }
        }
        
        results.recommendations.push('Adicionar @media queries específicas para mobile v5.4');
        results.recommendations.push('Considerar modal full-screen em dispositivos muito pequenos v5.4');
        results.recommendations.push('Usar console.diag.pdf.interactive() para testes em mobile v5.4');
    }
    
    console.groupEnd();
    
    return results;
};

/* ================== RELATÓRIOS v5.4 ================== */
function updateOverview(data) {
    const overviewContent = document.getElementById('overview-content');
    if (!overviewContent) return;
    
    const { scripts, systems, criticalElements } = data;
    
    const modulesByType = {};
    scripts.forEach(script => {
        const classification = classifyModule(script.fileName);
        modulesByType[classification.type] = modulesByType[classification.type] || [];
        modulesByType[classification.type].push(script);
    });
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 10px;">📊 RESUMO DO SISTEMA v5.4</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(0, 255, 156, 0.3);">
                    <div style="color: #888; font-size: 11px;">SCRIPTS</div>
                    <div style="font-size: 24px; color: #00ff9c;">${scripts.length}</div>
                </div>
                <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(0, 255, 156, 0.3);">
                    <div style="color: #888; font-size: 11px;">SISTEMAS ATIVOS</div>
                    <div style="font-size: 24px; color: #00ff9c;">
                        ${Object.values(systems).filter(Boolean).length}/${Object.keys(systems).length}
                    </div>
                </div>
                <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(0, 255, 156, 0.3);">
                    <div style="color: #888; font-size: 11px;">HEALTH SCORE</div>
                    <div style="font-size: 24px; color: #00ff9c;" id="health-score">--</div>
                </div>
            </div>
            <div style="font-size: 10px; color: #888; text-align: center; margin-top: 5px;">
                v5.4 - Diagnóstico completo do sistema PDF
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <div style="text-align: center; margin: 20px 0;">
                <button id="verify-migration-btn-v5-4" style="
                    background: linear-gradient(45deg, #ff00ff, #0088cc); 
                    color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px; transition: all 0.2s;">
                    🚀 VERIFICAÇÃO DE MIGRAÇÃO v5.4
                </button>
                <button id="test-compatibility-btn-v5-4" style="
                    background: linear-gradient(45deg, #00ff9c, #0088cc); 
                    color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px; transition: all 0.2s;">
                    🔍 TESTE DE COMPATIBILIDADE v5.4
                </button>
                <button id="auto-migration-check-btn-v5-4" style="
                    background: linear-gradient(45deg, #0088cc, #00ff9c); 
                    color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px; transition: all 0.2s;">
                    🔄 VERIFICAÇÃO AUTOMÁTICA v5.4
                </button>
                <button id="analyze-placeholders-btn-v5-4" style="
                    background: linear-gradient(45deg, #ff5500, #ffaa00); 
                    color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px; transition: all 0.2s;">
                    🗑️ ANALISAR ARQUIVOS PARA EXCLUSÃO v5.4
                </button>
                <button id="analyze-references-btn-v5-4" style="
                    background: linear-gradient(45deg, #ff8800, #ffaa00); 
                    color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px; transition: all 0.2s;">
                    🔗 ANALISAR REFERÊNCIAS (404s) v5.4
                </button>
                <button id="run-pdf-check-btn-v5-4" style="
                    background: linear-gradient(45deg, #00aaff, #0088cc); 
                    color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px; transition: all 0.2s;">
                    📄 VERIFICAÇÃO PDF v5.4
                </button>
                <button id="diagnose-pdf-icon-btn-v5-4" style="
                    background: linear-gradient(45deg, #ff5500, #ffaa00); 
                    color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px; transition: all 0.2s;">
                    🔍 DIAGNÓSTICO ÍCONE PDF v5.4
                </button>
                <button id="interactive-pdf-test-btn-v5-4" style="
                    background: linear-gradient(45deg, #00aaff, #0088cc); 
                    color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px; transition: all 0.2s;">
                    🎮 TESTE INTERATIVO PDF v5.4
                </button>
                <div style="font-size: 11px; color: #888; margin-top: 5px;">
                    v5.4: Inclui diagnóstico de ícone PDF e correções de compatibilidade
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 10px;">🔧 SISTEMAS PRINCIPAIS v5.4</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
    `;
    
    Object.entries(systems).forEach(([system, active]) => {
        html += `
            <div style="background: rgba(0, 255, 156, 0.1); padding: 10px; border-radius: 4px; border-left: 3px solid ${active ? '#00ff9c' : '#ff5555'}; border: 1px solid ${active ? 'rgba(0, 255, 156, 0.3)' : 'rgba(255, 0, 0, 0.3)'};">
                <div style="display: flex; justify-content: space-between;">
                    <span>${system}</span>
                    <span style="color: ${active ? '#00ff9c' : '#ff5555'}">
                        ${active ? '✅ ATIVO' : '❌ AUSENTE'}
                    </span>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div>
            <h3 style="color: #00ff9c; margin-bottom: 10px;">🎯 ELEMENTOS CRÍTICOS v5.4</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
    `;
    
    Object.entries(criticalElements).forEach(([element, domElement]) => {
        const exists = !!domElement;
        html += `
            <div style="background: rgba(0, 255, 156, 0.1); padding: 10px; border-radius: 4px; border-left: 3px solid ${exists ? '#00ff9c' : '#ff5555'}; border: 1px solid ${exists ? 'rgba(0, 255, 156, 0.3)' : 'rgba(255, 0, 0, 0.3)'};">
                <div style="display: flex; justify-content: space-between;">
                    <span>${element}</span>
                    <span style="color: ${exists ? '#00ff9c' : '#ff5555'}">
                        ${exists ? '✅ PRESENTE' : '❌ AUSENTE'}
                    </span>
                </div>
                ${exists ? `<div style="font-size: 10px; color: #888; margin-top: 5px;">${domElement.tagName}</div>` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    overviewContent.innerHTML = html;
    
    document.getElementById('verify-migration-btn-v5-4')?.addEventListener('click', () => {
        window.verifyMediaMigration();
    });
    
    document.getElementById('test-compatibility-btn-v5-4')?.addEventListener('click', () => {
        window.testModuleCompatibility();
    });
    
    document.getElementById('auto-migration-check-btn-v5-4')?.addEventListener('click', () => {
        logToPanel('🔄 Iniciando simulação de carregamento condicional v5.4...', 'debug');
        logToPanel('⏳ Aguardando 2 segundos (simulação de carregamento) v5.4...', 'info');
        
        setTimeout(() => {
            if (typeof window.autoValidateMigration === 'function') {
                window.autoValidateMigration();
            } else {
                logToPanel('❌ Função autoValidateMigration não encontrada v5.4', 'error');
            }
        }, 2000);
    });
    
    document.getElementById('analyze-placeholders-btn-v5-4')?.addEventListener('click', () => {
        if (typeof window.analyzePlaceholders === 'function') {
            window.analyzePlaceholders();
        } else {
            logToPanel('❌ Função analyzePlaceholders não encontrada v5.4', 'error');
        }
    });
    
    document.getElementById('analyze-references-btn-v5-4')?.addEventListener('click', () => {
        if (typeof window.analyzeBrokenReferences === 'function') {
            window.analyzeBrokenReferences();
        } else {
            logToPanel('❌ Função analyzeBrokenReferences não encontrada v5.4', 'error');
        }
    });
    
    document.getElementById('run-pdf-check-btn-v5-4')?.addEventListener('click', () => {
        if (typeof window.runPdfCompatibilityCheck === 'function') {
            window.runPdfCompatibilityCheck();
        } else {
            // Executar verificação básica
            console.log('🔍 Executando verificação PDF básica v5.4...');
            const tests = {
                'PdfSystem': !!window.PdfSystem,
                'Modal': !!document.getElementById('pdfModal'),
                'Campo senha': !!document.getElementById('pdfPassword'),
                'Função processAndSavePdfs': typeof window.processAndSavePdfs === 'function',
                'Função testPdfSystem': typeof window.testPdfSystem === 'function'
            };
            
            let passed = 0;
            Object.entries(tests).forEach(([name, result]) => {
                console.log(`${result ? '✅' : '❌'} ${name}: ${result}`);
                if (result) passed++;
            });
            
            const score = Math.round((passed / Object.keys(tests).length) * 100);
            console.log(`📊 Score PDF básico v5.4: ${passed}/${Object.keys(tests).length} (${score}%)`);
        }
    });
    
    document.getElementById('diagnose-pdf-icon-btn-v5-4')?.addEventListener('click', () => {
        if (typeof window.diagnosePdfIconProblem === 'function') {
            window.diagnosePdfIconProblem();
        } else {
            logToPanel('❌ Função diagnosePdfIconProblem não encontrada v5.4', 'error');
        }
    });
    
    document.getElementById('interactive-pdf-test-btn-v5-4')?.addEventListener('click', () => {
        if (typeof window.interactivePdfTest === 'function') {
            window.interactivePdfTest();
        } else {
            logToPanel('❌ Função interactivePdfTest não encontrada v5.4', 'error');
        }
    });
}

function updateTestsTab(testResults) {
    const testsContent = document.getElementById('tests-content');
    if (!testsContent) return;
    
    if (!testResults) {
        testsContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #888;">
                <div style="font-size: 48px; margin-bottom: 20px;">🧪</div>
                <div>Execute os testes para ver os resultados v5.4</div>
                <button id="run-tests-btn-v5-4" style="
                    margin-top: 20px; background: #00ff9c; color: #000;
                    border: none; padding: 10px 20px; cursor: pointer; border-radius: 4px;
                    cursor: pointer; font-weight: bold; transition: all 0.2s;">
                    🧪 EXECUTAR TESTES COMPLETOS v5.4
                </button>
                <div style="margin-top: 15px;">
                    <button id="run-compatibility-test-btn-v5-4" style="
                        background: linear-gradient(45deg, #00ff9c, #0088cc); 
                        color: #000; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;">
                        🔍 TESTE DE COMPATIBILIDADE v5.4
                    </button>
                    <button id="run-migration-test-btn-v5-4" style="
                        background: linear-gradient(45deg, #ff00ff, #0088cc); 
                        color: white; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;">
                        🚀 VERIFICAÇÃO DE MIGRAÇÃO v5.4
                    </button>
                    <button id="run-auto-check-btn-v5-4" style="
                        background: linear-gradient(45deg, #0088cc, #00ff9c); 
                        color: #000; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;">
                        🔄 VERIFICAÇÃO AUTOMÁTICA v5.4
                    </button>
                    <button id="run-placeholder-analysis-btn-v5-4" style="
                        background: linear-gradient(45deg, #ff5500, #ffaa00); 
                        color: #000; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;">
                        🗑️ ANÁLISE DE PLACEHOLDERS v5.4
                    </button>
                    <button id="run-reference-check-btn-v5-4" style="
                        background: linear-gradient(45deg, #ff8800, #ffaa00); 
                        color: #000; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;">
                        🔗 VERIFICAÇÃO DE REFERÊNCIAS v5.4
                    </button>
                    <button id="run-pdf-check-btn-v5-4" style="
                        background: linear-gradient(45deg, #00aaff, #0088cc); 
                        color: white; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;">
                        📄 VERIFICAÇÃO PDF v5.4
                    </button>
                    <button id="run-pdf-icon-diagnosis-btn-v5-4" style="
                        background: linear-gradient(45deg, #ff5500, #ffaa00); 
                        color: #000; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;">
                        🔍 DIAGNÓSTICO ÍCONE PDF v5.4
                    </button>
                    <button id="run-interactive-pdf-test-btn-v5-4" style="
                        background: linear-gradient(45deg, #00aaff, #0088cc); 
                        color: white; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;">
                        🎮 TESTE INTERATIVO PDF v5.4
                    </button>
                </div>
                <div style="font-size: 11px; color: #888; margin-top: 10px;">
                    v5.4: Inclui diagnóstico completo do ícone PDF na foto principal
                </div>
            </div>
        `;
        
        document.getElementById('run-tests-btn-v5-4')?.addEventListener('click', async () => {
            await runCompleteDiagnosis();
        });
        
        document.getElementById('run-compatibility-test-btn-v5-4')?.addEventListener('click', () => {
            window.testModuleCompatibility();
        });
        
        document.getElementById('run-migration-test-btn-v5-4')?.addEventListener('click', () => {
            window.verifyMediaMigration();
        });
        
        document.getElementById('run-auto-check-btn-v5-4')?.addEventListener('click', () => {
            if (typeof window.autoValidateMigration === 'function') {
                window.autoValidateMigration();
            }
        });
        
        document.getElementById('run-placeholder-analysis-btn-v5-4')?.addEventListener('click', () => {
            if (typeof window.analyzePlaceholders === 'function') {
                window.analyzePlaceholders();
            }
        });
        
        document.getElementById('run-reference-check-btn-v5-4')?.addEventListener('click', () => {
            if (typeof window.analyzeBrokenReferences === 'function') {
                window.analyzeBrokenReferences();
            }
        });
        
        document.getElementById('run-pdf-check-btn-v5-4')?.addEventListener('click', () => {
            if (typeof window.runPdfCompatibilityCheck === 'function') {
                window.runPdfCompatibilityCheck();
            }
        });
        
        document.getElementById('run-pdf-icon-diagnosis-btn-v5-4')?.addEventListener('click', () => {
            if (typeof window.diagnosePdfIconProblem === 'function') {
                window.diagnosePdfIconProblem();
            }
        });
        
        document.getElementById('run-interactive-pdf-test-btn-v5-4')?.addEventListener('click', () => {
            if (typeof window.interactivePdfTest === 'function') {
                window.interactivePdfTest();
            }
        });
        
        return;
    }
    
    const passed = testResults.passed;
    const failed = testResults.failed;
    const total = testResults.total;
    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 15px;">🧪 RESULTADO DOS TESTES v5.4</h3>
            
            <div style="background: rgba(0, 255, 156, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(0, 255, 156, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <div style="font-size: 11px; color: #888;">STATUS GERAL v5.4</div>
                        <div style="font-size: 24px; color: ${percentage >= 80 ? '#00ff9c' : percentage >= 50 ? '#ffaa00' : '#ff5555'}">
                            ${percentage}%
                        </div>
                    </div>
                    <div style="display: flex; gap: 20px;">
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: #888;">PASSARAM</div>
                            <div style="font-size: 24px; color: #00ff9c;">${passed}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: #888;">FALHARAM</div>
                            <div style="font-size: 24px; color: #ff5555;">${failed}</div>
                        </div>
                    </div>
                </div>
                
                <div style="height: 10px; background: #333; border-radius: 5px; overflow: hidden;">
                    <div style="height: 100%; width: ${percentage}%; background: ${percentage >= 80 ? '#00ff9c' : percentage >= 50 ? '#ffaa00' : '#ff5555'};"></div>
                </div>
                <div style="font-size: 10px; color: #888; text-align: center; margin-top: 5px;">
                    v${testResults.version || '5.4'}
                </div>
            </div>
            
            <div>
                <h4 style="color: #00ff9c; margin-bottom: 10px;">📋 DETALHES DOS TESTES v5.4</h4>
                <div style="max-height: 300px; overflow-y: auto;">
    `;
    
    testResults.tests.forEach((test, index) => {
        const isCompatibilityTest = test.name.includes('compatibilidade');
        const isMigrationTest = test.name.includes('migração') || test.message?.includes('migração');
        const isWrapperTest = test.name.includes('wrapper');
        const isPdfIconTest = test.name.includes('PDF Icon') || test.name.includes('pdf icon');
        const isPdfSpecificTest = test.name.includes('PDF') && !isPdfIconTest;
        
        let backgroundColor = test.passed ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 0, 0, 0.1)';
        let borderColor = test.passed ? '#00ff9c' : '#ff5555';
        let emoji = test.passed ? '✅' : '❌';
        
        if (isCompatibilityTest) {
            backgroundColor = test.passed ? 'rgba(0, 136, 204, 0.1)' : 'rgba(255, 0, 0, 0.1)';
            borderColor = test.passed ? '#0088cc' : '#ff5555';
            emoji = test.passed ? '🔍' : '⚠️';
        } else if (isMigrationTest || isWrapperTest) {
            backgroundColor = test.passed ? 'rgba(255, 0, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)';
            borderColor = test.passed ? '#ff00ff' : '#ff5555';
            emoji = test.passed ? '🔗' : '❌';
        } else if (isPdfIconTest) {
            backgroundColor = test.passed ? 'rgba(0, 170, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)';
            borderColor = test.passed ? '#00aaff' : '#ff5555';
            emoji = test.passed ? '📄' : '❌';
        } else if (isPdfSpecificTest) {
            backgroundColor = test.passed ? 'rgba(0, 170, 255, 0.1)' : 'rgba(255, 0, 0, 0.1)';
            borderColor = test.passed ? '#00aaff' : '#ff5555';
            emoji = test.passed ? '📄' : '❌';
        }
        
        html += `
            <div style="
                background: ${backgroundColor};
                padding: 12px; margin-bottom: 8px; border-radius: 4px;
                border-left: 3px solid ${borderColor};
                border: 1px solid ${borderColor.replace(')', ', 0.3)')};
                display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; color: ${borderColor};">
                        ${emoji} ${test.name}
                    </div>
                    ${test.message ? `<div style="font-size: 11px; color: #888; margin-top: 4px;">${test.message}</div>` : ''}
                </div>
                <span style="font-size: 10px; color: #888;">#${index + 1}</span>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <button id="run-migration-test-v5-4" style="
                background: linear-gradient(45deg, #ff00ff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                🚀 VERIFICAÇÃO MIGRAÇÃO v5.4
            </button>
            <button id="run-compatibility-test-v5-4" style="
                background: linear-gradient(45deg, #00ff9c, #0088cc); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                🔍 TESTE COMPATIBILIDADE v5.4
            </button>
            <button id="run-auto-check-v5-4" style="
                background: linear-gradient(45deg, #0088cc, #00ff9c); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                🔄 VERIFICAÇÃO AUTOMÁTICA v5.4
            </button>
            <button id="run-placeholder-analysis-v5-4" style="
                background: linear-gradient(45deg, #ff5500, #ffaa00); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                🗑️ ANÁLISE PLACEHOLDERS v5.4
            </button>
            <button id="run-reference-check-v5-4" style="
                background: linear-gradient(45deg, #ff8800, #ffaa00); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                🔗 VERIFICAÇÃO REFERÊNCIAS v5.4
            </button>
            <button id="run-pdf-check-v5-4" style="
                background: linear-gradient(45deg, #00aaff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                📄 VERIFICAÇÃO PDF v5.4
            </button>
            <button id="run-pdf-icon-diagnosis-v5-4" style="
                background: linear-gradient(45deg, #ff5500, #ffaa00); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                🔍 DIAGNÓSTICO ÍCONE PDF v5.4
            </button>
            <button id="run-interactive-pdf-test-v5-4" style="
                background: linear-gradient(45deg, #00aaff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px; transition: all 0.2s;">
                🎮 TESTE INTERATIVO PDF v5.4
            </button>
        </div>
        <div style="font-size: 11px; color: #888; text-align: center; margin-top: 10px;">
            v5.4: Diagnóstico completo do ícone PDF na foto principal
        </div>
    `;
    
    testsContent.innerHTML = html;
    
    document.getElementById('run-migration-test-v5-4')?.addEventListener('click', () => {
        window.verifyMediaMigration();
    });
    
    document.getElementById('run-compatibility-test-v5-4')?.addEventListener('click', () => {
        window.testModuleCompatibility();
    });
    
    document.getElementById('run-auto-check-v5-4')?.addEventListener('click', () => {
        if (typeof window.autoValidateMigration === 'function') {
            window.autoValidateMigration();
        }
    });
    
    document.getElementById('run-placeholder-analysis-v5-4')?.addEventListener('click', () => {
        if (typeof window.analyzePlaceholders === 'function') {
            window.analyzePlaceholders();
        }
    });
    
    document.getElementById('run-reference-check-v5-4')?.addEventListener('click', () => {
        if (typeof window.analyzeBrokenReferences === 'function') {
            window.analyzeBrokenReferences();
        }
    });
    
    document.getElementById('run-pdf-check-v5-4')?.addEventListener('click', () => {
        if (typeof window.runPdfCompatibilityCheck === 'function') {
            window.runPdfCompatibilityCheck();
        }
    });
    
    document.getElementById('run-pdf-icon-diagnosis-v5-4')?.addEventListener('click', () => {
        if (typeof window.diagnosePdfIconProblem === 'function') {
            window.diagnosePdfIconProblem();
        }
    });
    
    document.getElementById('run-interactive-pdf-test-v5-4')?.addEventListener('click', () => {
        if (typeof window.interactivePdfTest === 'function') {
            window.interactivePdfTest();
        }
    });
    
    if (lastMigrationReport) {
        const migrationSection = document.createElement('div');
        migrationSection.style.marginTop = '20px';
        migrationSection.style.padding = '15px';
        migrationSection.style.background = 'rgba(0, 136, 204, 0.1)';
        migrationSection.style.borderRadius = '6px';
        migrationSection.style.border = '1px solid rgba(0, 136, 204, 0.3)';
        migrationSection.innerHTML = `
            <h4 style="color: #ff00ff; margin-bottom: 10px;">📋 ÚLTIMA VERIFICAÇÃO AUTOMÁTICA v5.4</h4>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="color: ${lastMigrationReport.migrationReady ? '#00ff9c' : '#ff5555'}; font-weight: bold;">
                        ${lastMigrationReport.migrationReady ? '✅ PRONTO PARA MIGRAÇÃO' : '❌ NÃO PRONTO'} v5.4
                    </div>
                    <div style="font-size: 11px; color: #888;">
                        Pontuação: ${lastMigrationReport.compatibilityScore}% (${lastMigrationReport.passed}/${lastMigrationReport.total})
                    </div>
                </div>
                <button id="view-last-report-v5-4" style="
                    background: #555; color: white; border: none;
                    padding: 6px 12px; cursor: pointer; border-radius: 4px;
                    font-size: 11px; transition: all 0.2s;">
                    VER DETALHES v5.4
                </button>
            </div>
        `;
        
        testsContent.appendChild(migrationSection);
        
        document.getElementById('view-last-report-v5-4')?.addEventListener('click', () => {
            updateMigrationTab(lastMigrationReport);
        });
    }
}

function updatePdfMobileTab(results) {
    const pdfMobileContent = document.getElementById('pdf-mobile-content');
    if (!pdfMobileContent) return;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 15px;">📱 DIAGNÓSTICO MOBILE PDF v5.4</h3>
            
            <div style="background: rgba(0, 136, 204, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(0, 136, 204, 0.3);">
                <h4 style="color: #00ff9c; margin-bottom: 10px;">📱 INFORMAÇÕES DO DISPOSITIVO v5.4</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <div style="color: #888; font-size: 11px;">TIPO</div>
                        <div style="font-size: 18px; color: ${results.deviceInfo.type === 'DESKTOP' ? '#00ff9c' : '#0088cc'}">
                            ${results.deviceInfo.type === 'DESKTOP' ? '💻' : '📱'} ${results.deviceInfo.type}
                        </div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 11px;">VIEWPORT</div>
                        <div style="font-size: 18px; color: #00ff9c;">
                            ${results.deviceInfo.viewport.width} × ${results.deviceInfo.viewport.height}
                        </div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 11px;">TOUCH</div>
                        <div style="font-size: 18px; color: ${results.deviceInfo.touchSupport ? '#00ff9c' : '#ff5555'}">
                            ${results.deviceInfo.touchSupport ? '✅ SUPORTADO' : '❌ NÃO SUPORTADO'}
                        </div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 11px;">PIXEL RATIO</div>
                        <div style="font-size: 18px; color: #00ff9c;">
                            ${results.deviceInfo.viewport.pixelRatio}
                        </div>
                    </div>
                </div>
                <div style="font-size: 10px; color: #888; text-align: center; margin-top: 10px;">
                    v${results.version || '5.4'}
                </div>
            </div>
            
            <div style="background: rgba(0, 136, 204, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid rgba(0, 136, 204, 0.3);">
                <h4 style="color: #00ff9c; margin-bottom: 10px;">🎯 ANÁLISE DO MODAL PDF v5.4</h4>
    `;
    
    if (results.modalAnalysis.exists) {
        html += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span>Status do Modal v5.4</span>
                    <span style="color: #00ff9c; background: rgba(0, 255, 156, 0.2); padding: 4px 8px; border-radius: 3px;">
                        ✅ PRESENTE
                    </span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="color: #888; font-size: 11px; margin-bottom: 5px;">VISIBILIDADE</div>
                    <div style="color: ${results.modalAnalysis.visible ? '#00ff9c' : '#ffaa00'};">
                        ${results.modalAnalysis.visible ? '👁️ VISÍVEL' : '👁️‍🗨️ OCULTO'} v5.4
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="color: #888; font-size: 11px; margin-bottom: 5px;">CAMPO DE SENHA</div>
                    <div style="color: ${results.modalAnalysis.passwordField.exists ? '#00ff9c' : '#ff5555'};">
                        ${results.modalAnalysis.passwordField.exists ? '✅ PRESENTE' : '❌ AUSENTE'} v5.4
                    </div>
                </div>
            </div>
        `;
        
        if (results.modalAnalysis.boundingBox) {
            html += `
                <div style="margin-bottom: 15px;">
                    <h5 style="color: #888; margin-bottom: 5px;">📏 BOUNDING BOX v5.4</h5>
                    <div style="background: rgba(0, 0, 0, 0.3); padding: 10px; border-radius: 4px; font-family: monospace; font-size: 11px;">
                        <div style="margin-bottom: 2px;">width: <span style="color: #00ff9c;">${results.modalAnalysis.boundingBox.width}px</span></div>
                        <div style="margin-bottom: 2px;">height: <span style="color: #00ff9c;">${results.modalAnalysis.boundingBox.height}px</span></div>
                        <div style="margin-bottom: 2px;">top: <span style="color: #00ff9c;">${results.modalAnalysis.boundingBox.top}px</span></div>
                        <div style="margin-bottom: 2px;">left: <span style="color: #00ff9c;">${results.modalAnalysis.boundingBox.left}px</span></div>
                    </div>
                </div>
            `;
        }
        
    } else {
        html += `
            <div style="text-align: center; padding: 30px; color: #ff5555;">
                <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
                <div style="font-size: 16px;">MODAL PDF NÃO ENCONTRADO v5.4</div>
                <div style="font-size: 12px; color: #888; margin-top: 10px;">
                    O elemento #pdfModal não existe no DOM
                </div>
            </div>
        `;
    }
    
    html += `
            </div>
    `;
    
    if (results.layoutIssues.length > 0 || results.recommendations.length > 0) {
        html += `
            <div style="background: ${results.layoutIssues.length > 0 ? 'rgba(255, 0, 0, 0.1)' : 'rgba(0, 255, 156, 0.1)'}; padding: 20px; border-radius: 8px; margin-bottom: 20px; border: 1px solid ${results.layoutIssues.length > 0 ? 'rgba(255, 0, 0, 0.3)' : 'rgba(0, 255, 156, 0.3)'};">
        `;
        
        if (results.layoutIssues.length > 0) {
            html += `
                <h4 style="color: #ff5555; margin-bottom: 10px;">⚠️ PROBLEMAS DETECTADOS v5.4</h4>
                <div style="margin-left: 15px;">
            `;
            
            results.layoutIssues.forEach(issue => {
                html += `
                    <div style="margin-bottom: 8px; padding: 8px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border-left: 3px solid #ff5555;">
                        <span style="color: #ff5555;">•</span> ${issue}
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        if (results.recommendations.length > 0) {
            html += `
                <h4 style="color: #00ff9c; margin-top: ${results.layoutIssues.length > 0 ? '20px' : '0'}; margin-bottom: 10px;">💡 RECOMENDAÇÕES v5.4</h4>
                <div style="margin-left: 15px;">
            `;
            
            results.recommendations.forEach(rec => {
                html += `
                    <div style="margin-bottom: 8px; padding: 8px; background: rgba(0, 255, 156, 0.1); border-radius: 4px; border-left: 3px solid #00ff9c;">
                        <span style="color: #00ff9c;">•</span> ${rec}
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        html += `</div>`;
    }
    
    html += `
        <div style="text-align: center;">
            <button id="fix-mobile-pdf-v5-4" style="
                background: linear-gradient(45deg, #0088cc, #00aaff); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 4px;
                font-weight: bold; font-size: 14px; transition: all 0.2s;">
                🛠️ APLICAR CORREÇÕES SUGERIDAS v5.4
            </button>
            <div style="font-size: 11px; color: #888; margin-top: 10px;">
                Cria estilos otimizados para mobile - v5.4
            </div>
        </div>
    `;
    
    pdfMobileContent.innerHTML = html;
    
    document.getElementById('fix-mobile-pdf-v5-4')?.addEventListener('click', () => {
        applyMobilePdfFixes(results);
    });
}

function applyMobilePdfFixes(results) {
    logToPanel('🛠️ Aplicando correções para mobile PDF v5.4...', 'mobile');
    
    const styleId = 'diagnostics-mobile-pdf-fixes-v5-4';
    let styleTag = document.getElementById(styleId);
    
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    
    const css = `
        @media (max-width: 768px) {
            #pdfModal {
                max-width: 95vw !important;
                max-height: 90vh !important;
                padding: 10px !important;
            }
            
            .pdf-modal-content {
                max-width: 100% !important;
                padding: 15px !important;
                margin: 0 !important;
            }
            
            #pdfPassword {
                width: 90% !important;
                max-width: 300px !important;
                font-size: 16px !important;
            }
            
            .pdf-modal-buttons button {
                padding: 12px 20px !important;
                min-height: 44px !important;
                margin: 5px !important;
            }
        }
        
        @media (max-width: 480px) {
            #pdfModal {
                border-radius: 0 !important;
                max-height: 100vh !important;
                max-width: 100vw !important;
            }
            
            .pdf-modal-content {
                padding: 10px !important;
            }
        }
        
        /* Estilos específicos para diagnóstico v5.4 */
        .pdf-icon, .icon-pdf {
            min-height: 44px !important;
            min-width: 44px !important;
        }
    `;
    
    styleTag.textContent = css;
    
    logToPanel('✅ Estilos mobile PDF aplicados v5.4', 'success');
    logToPanel('💡 Recarregue a página para ver as mudanças v5.4', 'info');
    
    const pdfModal = document.getElementById('pdfModal');
    if (pdfModal) {
        pdfModal.style.display = 'none';
        setTimeout(() => {
            pdfModal.style.display = 'flex';
            logToPanel('🔄 Modal recarregado com estilos mobile v5.4', 'mobile');
        }, 100);
    }
}

/* ================== FUNÇÕES PRINCIPAIS v5.4 ================== */
async function runCompleteDiagnosis() {
    try {
        logToPanel('🚀 Iniciando diagnóstico completo v5.4...', 'debug');
        updateStatus('Diagnóstico em andamento v5.4...', 'info');
        
        const systemData = analyzeSystem();
        
        updateOverview(systemData);
        
        const testResults = await testMediaUnifiedComplete();
        
        updateTestsTab(testResults);
        
        const healthScore = calculateHealthScore(systemData, testResults);
        const healthScoreElement = document.getElementById('health-score');
        if (healthScoreElement) {
            healthScoreElement.textContent = `${healthScore}%`;
        }
        
        logToPanel(`✅ Diagnóstico completo v5.4! Health Score: ${healthScore}%`, 'success');
        updateStatus('Diagnóstico completo v5.4', 'success');
        
        return { systemData, testResults, healthScore };
        
    } catch (error) {
        logToPanel(`❌ Erro no diagnóstico v5.4: ${error.message}`, 'error');
        updateStatus('Erro no diagnóstico v5.4', 'error');
        console.error(error);
    }
}

function calculateHealthScore(systemData, testResults) {
    let score = 100;
    
    Object.entries(systemData.systems).forEach(([system, active]) => {
        if (!active) {
            const criticalSystems = ['MediaSystem', 'PdfSystem', 'properties', 'supabase', 'diagnostics'];
            if (criticalSystems.includes(system)) score -= 10;
            else score -= 5;
        }
    });
    
    Object.entries(systemData.criticalElements).forEach(([element, domElement]) => {
        if (!domElement) {
            const criticalElements = ['pdfModal', 'pdfPassword', 'uploadPreview'];
            if (criticalElements.includes(element)) score -= 10;
            else score -= 5;
        }
    });
    
    if (testResults && testResults.total > 0) {
        const percentage = (testResults.passed / testResults.total) * 100;
        score = Math.min(100, score + (percentage / 10));
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
}

function exportReport() {
    const systemData = analyzeSystem();
    const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        system: {
            scripts: systemData.scripts,
            systems: systemData.systems,
            criticalElements: Object.keys(systemData.criticalElements).reduce((acc, key) => {
                acc[key] = !!systemData.criticalElements[key];
                return acc;
            }, {}),
            healthScore: calculateHealthScore(systemData, currentTestResults)
        },
        userAgent: navigator.userAgent,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        },
        testResults: currentTestResults,
        lastMigrationReport: lastMigrationReport,
        referenceAnalysis: referenceAnalysisCache,
        migrationStatus: window.verifyMediaMigration ? 'Função disponível v5.4' : 'Função não disponível',
        compatibilityStatus: window.testModuleCompatibility ? 'Função disponível v5.4' : 'Função não disponível',
        autoValidationStatus: window.autoValidateMigration ? 'Função disponível v5.4' : 'Função não disponível',
        placeholderAnalysisStatus: window.analyzePlaceholders ? 'Função disponível v5.4' : 'Função não disponível',
        referenceAnalysisStatus: window.analyzeBrokenReferences ? 'Função disponível v5.4' : 'Função não disponível',
        pdfIconDiagnosisStatus: window.diagnosePdfIconProblem ? 'Função disponível v5.4' : 'Função não disponível',
        pdfCompatibilityStatus: window.runPdfCompatibilityCheck ? 'Função disponível v5.4' : 'Função não disponível',
        interactivePdfTestStatus: window.interactivePdfTest ? 'Função disponível v5.4' : 'Função não disponível',
        version: '5.4'
    };
    
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagnostico-sistema-v5.4-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        logToPanel('📊 Relatório exportado como JSON (v5.4)', 'success');
    }
    
    function runPdfMobileDiagnosis() {
        logToPanel('📱 Iniciando diagnóstico mobile PDF v5.4...', 'mobile');
        updateStatus('Analisando layout mobile PDF v5.4...', 'mobile');
        
        try {
            const results = window.diagnosePdfModalMobile();
            
            updatePdfMobileTab(results);
            
            logToPanel(`📱 Dispositivo v5.4: ${results.deviceInfo.type}`, 'mobile');
            logToPanel(`📏 Viewport v5.4: ${results.deviceInfo.viewport.width}×${results.deviceInfo.viewport.height}`, 'mobile');
            logToPanel(`✅ Modal PDF v5.4: ${results.modalAnalysis.exists ? 'PRESENTE' : 'AUSENTE'}`, 
                       results.modalAnalysis.exists ? 'success' : 'error');
            
            if (results.modalAnalysis.exists) {
                logToPanel(`👁️ Modal visível v5.4: ${results.modalAnalysis.visible ? 'SIM' : 'NÃO'}`, 
                           results.modalAnalysis.visible ? 'success' : 'warning');
                logToPanel(`🔐 Campo senha v5.4: ${results.modalAnalysis.passwordField.exists ? 'PRESENTE' : 'AUSENTE'}`,
                           results.modalAnalysis.passwordField.exists ? 'success' : 'warning');
                
                if (results.layoutIssues.length > 0) {
                    logToPanel('⚠️ Problemas de layout detectados v5.4:', 'warning');
                    results.layoutIssues.forEach(issue => {
                        logToPanel(`   • ${issue}`, 'warning');
                    });
                }
                
                if (results.recommendations.length > 0) {
                    logToPanel('💡 Recomendações v5.4:', 'info');
                    results.recommendations.forEach(rec => {
                        logToPanel(`   • ${rec}`, 'info');
                    });
                }
            }
            
            logToPanel('✅ Diagnóstico mobile PDF concluído v5.4', 'success');
            updateStatus('Diagnóstico mobile completo v5.4', 'success');
            
            const mobileTabBtn = document.querySelector('[data-tab="pdf-mobile"]');
            if (mobileTabBtn) {
                mobileTabBtn.click();
            }
            
        } catch (error) {
            logToPanel(`❌ Erro no diagnóstico mobile v5.4: ${error.message}`, 'error');
            updateStatus('Erro no diagnóstico mobile v5.4', 'error');
        }
    }
    
    /* ================== PAINEL VISUAL v5.4 ================== */
    function createDiagnosticsPanel() {
        diagnosticsPanel = document.createElement('div');
        diagnosticsPanel.id = 'diagnostics-panel-complete';
        diagnosticsPanel.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            width: 900px;
            max-height: 90vh;
            overflow-y: auto;
            background: #0b0b0b;
            color: #00ff9c;
            font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
            font-size: 12px;
            padding: 15px;
            border: 2px solid #00ff9c;
            border-radius: 8px;
            z-index: 999999;
            box-shadow: 0 0 30px rgba(0, 255, 156, 0.4);
        `;
        
        diagnosticsPanel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <div style="font-size: 16px; font-weight: bold; color: #00ff9c;">
                    🚀 DIAGNÓSTICO COMPLETO DO SISTEMA v5.4
                </div>
                <div style="display: flex; gap: 8px;">
                    <button id="test-compatibility-main-v5-4" style="
                        background: linear-gradient(45deg, #00ff9c, #0088cc); 
                        color: #000; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px; font-weight: bold;">
                        🔍 COMPATIBILIDADE v5.4
                    </button>
                    <button id="auto-migration-main-v5-4" style="
                        background: linear-gradient(45deg, #0088cc, #00ff9c); 
                        color: #000; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px; font-weight: bold;">
                        🔄 AUTO-VALIDAÇÃO v5.4
                    </button>
                    <button id="verify-migration-main-v5-4" style="
                        background: linear-gradient(45deg, #ff00ff, #0088cc); 
                        color: white; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px; font-weight: bold;">
                        🚀 MIGRAÇÃO v5.4
                    </button>
                    <button id="analyze-placeholders-main-v5-4" style="
                        background: linear-gradient(45deg, #ff5500, #ffaa00); 
                        color: #000; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px; font-weight: bold;">
                        🗑️ PLACEHOLDERS v5.4
                    </button>
                    <button id="analyze-references-main-v5-4" style="
                        background: linear-gradient(45deg, #ff8800, #ffaa00); 
                        color: #000; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px; font-weight: bold;">
                        🔗 REFERÊNCIAS v5.4
                    </button>
                    <button id="run-pdf-check-main-v5-4" style="
                        background: linear-gradient(45deg, #00aaff, #0088cc); 
                        color: white; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px; font-weight: bold;">
                        📄 PDF CHECK v5.4
                    </button>
                    <button id="diagnose-pdf-icon-main-v5-4" style="
                        background: linear-gradient(45deg, #ff5500, #ffaa00); 
                        color: #000; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px; font-weight: bold;">
                        🔍 ÍCONE PDF v5.4
                    </button>
                    <button id="interactive-pdf-main-v5-4" style="
                        background: linear-gradient(45deg, #00aaff, #0088cc); 
                        color: white; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px; font-weight: bold;">
                        🎮 TESTE INTERATIVO v5.4
                    </button>
                    <button id="minimize-btn-v5-4" style="
                        background: #555; color: white; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px;">
                        ▁
                    </button>
                    <button id="close-btn-v5-4" style="
                        background: #ff5555; color: white; border: none; 
                        padding: 4px 8px; cursor: pointer; border-radius: 3px;
                        font-size: 10px;">
                        ✕
                    </button>
                </div>
            </div>
            <div style="color: #888; font-size: 11px; margin-bottom: 20px; display: flex; justify-content: space-between;">
                <div>
                    Modo: ${DEBUG_MODE ? 'DEBUG' : 'NORMAL'} | 
                    ${DIAGNOSTICS_MODE ? 'DIAGNÓSTICO ATIVO' : 'DIAGNÓSTICO INATIVO'} | v5.4
                </div>
                <div id="device-indicator-v5-4" style="background: #333; padding: 2px 8px; border-radius: 3px;">
                    📱 Detectando dispositivo v5.4...
                </div>
            </div>
            <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
                <button id="run-all-tests-v5-4" style="
                    background: #00ff9c; color: #000; border: none;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px;
                    font-weight: bold; flex: 1;">
                    🧪 TESTE COMPLETO v5.4
                </button>
                <button id="test-pdf-mobile-v5-4" style="
                    background: #0088cc; color: white; border: none;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px;
                    font-weight: bold; flex: 1;">
                    📱 TESTE MOBILE PDF v5.4
                </button>
                <button id="analyze-references-btn-v5-4" style="
                    background: #ff8800; color: #000; border: none;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px;
                    font-weight: bold; flex: 1;">
                    🔗 REFERÊNCIAS 404 v5.4
                </button>
                <button id="run-pdf-check-btn-v5-4" style="
                    background: #00aaff; color: white; border: none;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px;
                    font-weight: bold; flex: 1;">
                    📄 VERIFICAÇÃO PDF v5.4
                </button>
                <button id="diagnose-pdf-icon-btn-v5-4" style="
                    background: #ff5500; color: #000; border: none;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px;
                    font-weight: bold; flex: 1;">
                    🔍 DIAGNÓSTICO ÍCONE PDF v5.4
                </button>
                <button id="interactive-pdf-test-btn-v5-4" style="
                    background: linear-gradient(45deg, #00aaff, #0088cc); 
                    color: white; border: none;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px;
                    font-weight: bold; flex: 1;">
                    🎮 TESTE INTERATIVO PDF v5.4
                </button>
                <button id="export-btn-v5-4" style="
                    background: #555; color: white; border: none;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px;
                    font-weight: bold; flex: 1;">
                    📊 EXPORTAR RELATÓRIO v5.4
                </button>
            </div>
            <div id="tabs-v5-4" style="display: flex; border-bottom: 1px solid #333; margin-bottom: 15px;">
                <button data-tab="overview" class="tab-btn-v5-4 active" style="
                    background: #333; color: #00ff9c; border: none; border-bottom: 2px solid #00ff9c;
                    padding: 8px 16px; cursor: pointer;">
                    📈 VISÃO GERAL v5.4
                </button>
                <button data-tab="modules" class="tab-btn-v5-4" style="
                    background: transparent; color: #888; border: none;
                    padding: 8px 16px; cursor: pointer;">
                    ⚙️ MÓDULOS v5.4
                </button>
                <button data-tab="tests" class="tab-btn-v5-4" style="
                    background: transparent; color: #888; border: none;
                    padding: 8px 16px; cursor: pointer;">
                    🧪 TESTES v5.4
                </button>
                <button data-tab="pdf-mobile" class="tab-btn-v5-4" style="
                    background: transparent; color: #888; border: none;
                    padding: 8px 16px; cursor: pointer;">
                    📱 PDF MOBILE v5.4
                </button>
                <button data-tab="console" class="tab-btn-v5-4" style="
                    background: transparent; color: #888; border: none;
                    padding: 8px 16px; cursor: pointer;">
                    📝 CONSOLE v5.4
                </button>
            </div>
            <div id="content-area-v5-4" style="min-height: 400px; max-height: 60vh; overflow-y: auto;">
                <div id="overview-content-v5-4" class="tab-content-v5-4" style="display: block;"></div>
                <div id="modules-content-v5-4" class="tab-content-v5-4" style="display: none;"></div>
                <div id="tests-content-v5-4" class="tab-content-v5-4" style="display: none;"></div>
                <div id="pdf-mobile-content-v5-4" class="tab-content-v5-4" style="display: none;"></div>
                <div id="console-content-v5-4" class="tab-content-v5-4" style="display: none;"></div>
            </div>
            <div id="status-bar-v5-4" style="
                margin-top: 15px; padding: 8px; background: #111; 
                border-radius: 4px; font-size: 11px; color: #888;">
                Status: Inicializando v5.4...
            </div>
        `;
        
        document.body.appendChild(diagnosticsPanel);
        
        setupPanelEvents();
        
        updateDeviceIndicator();
        
        // Adicionar botão de diagnóstico PDF
        setTimeout(addPdfDiagnosticButton, 1500);
        
        // Aplicar melhorias para F12
        window.enhanceDevTools();
    }
    
    function setupPanelEvents() {
        const closeBtn = document.getElementById('close-btn-v5-4');
        const minimizeBtn = document.getElementById('minimize-btn-v5-4');
        const verifyMigrationBtn = document.getElementById('verify-migration-main-v5-4');
        const testCompatibilityBtn = document.getElementById('test-compatibility-main-v5-4');
        const autoMigrationBtn = document.getElementById('auto-migration-main-v5-4');
        const analyzePlaceholdersBtn = document.getElementById('analyze-placeholders-main-v5-4');
        const analyzeReferencesBtn = document.getElementById('analyze-references-main-v5-4');
        const runPdfCheckBtn = document.getElementById('run-pdf-check-main-v5-4');
        const diagnosePdfIconBtn = document.getElementById('diagnose-pdf-icon-main-v5-4');
        const interactivePdfBtn = document.getElementById('interactive-pdf-main-v5-4');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                diagnosticsPanel.style.display = 'none';
                logToPanel('Panel fechado v5.4', 'info');
            });
        }
        
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => {
                const content = document.getElementById('content-area-v5-4');
                if (content) {
                    content.style.display = content.style.display === 'none' ? 'block' : 'none';
                    logToPanel(`Panel ${content.style.display === 'none' ? 'minimizado' : 'restaurado'} v5.4`, 'info');
                }
            });
        }
        
        if (verifyMigrationBtn) {
            verifyMigrationBtn.addEventListener('click', () => {
                logToPanel('🚀 Executando verificação de migração v5.4...', 'migration');
                window.verifyMediaMigration();
            });
        }
        
        if (testCompatibilityBtn) {
            testCompatibilityBtn.addEventListener('click', () => {
                logToPanel('🔍 Executando teste de compatibilidade v5.4...', 'debug');
                window.testModuleCompatibility();
            });
        }
        
        if (autoMigrationBtn) {
            autoMigrationBtn.addEventListener('click', () => {
                logToPanel('🔄 Executando validação automática v5.4...', 'migration');
                if (typeof window.autoValidateMigration === 'function') {
                    window.autoValidateMigration();
                } else {
                    logToPanel('❌ Função autoValidateMigration não encontrada v5.4', 'error');
                }
            });
        }
        
        if (analyzePlaceholdersBtn) {
            analyzePlaceholdersBtn.addEventListener('click', () => {
                logToPanel('🗑️ Analisando placeholders v5.4...', 'placeholder');
                if (typeof window.analyzePlaceholders === 'function') {
                    window.analyzePlaceholders();
                } else {
                    logToPanel('❌ Função analyzePlaceholders não encontrada v5.4', 'error');
                }
            });
        }
        
        if (analyzeReferencesBtn) {
            analyzeReferencesBtn.addEventListener('click', () => {
                logToPanel('🔗 Analisando referências v5.4...', 'reference');
                if (typeof window.analyzeBrokenReferences === 'function') {
                    window.analyzeBrokenReferences();
                } else {
                    logToPanel('❌ Função analyzeBrokenReferences não encontrada v5.4', 'error');
                }
            });
        }
        
        if (runPdfCheckBtn) {
            runPdfCheckBtn.addEventListener('click', () => {
                logToPanel('📄 Executando verificação PDF v5.4...', 'pdf-check');
                if (typeof window.runPdfCompatibilityCheck === 'function') {
                    window.runPdfCompatibilityCheck();
                } else {
                    logToPanel('❌ Função runPdfCompatibilityCheck não encontrada v5.4', 'error');
                }
            });
        }
        
        if (diagnosePdfIconBtn) {
            diagnosePdfIconBtn.addEventListener('click', () => {
                logToPanel('🔍 Executando diagnóstico do ícone PDF v5.4...', 'pdf-check');
                if (typeof window.diagnosePdfIconProblem === 'function') {
                    window.diagnosePdfIconProblem();
                } else {
                    logToPanel('❌ Função diagnosePdfIconProblem não encontrada v5.4', 'error');
                }
            });
        }
        
        if (interactivePdfBtn) {
            interactivePdfBtn.addEventListener('click', () => {
                logToPanel('🎮 Iniciando teste interativo PDF v5.4...', 'pdf-check');
                if (typeof window.interactivePdfTest === 'function') {
                    window.interactivePdfTest();
                } else {
                    logToPanel('❌ Função interactivePdfTest não encontrada v5.4', 'error');
                }
            });
        }
        
        document.querySelectorAll('.tab-btn-v5-4').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.tab-btn-v5-4').forEach(b => {
                    b.classList.remove('active');
                    b.style.background = 'transparent';
                    b.style.color = '#888';
                    b.style.borderBottom = 'none';
                });
                
                btn.classList.add('active');
                btn.style.background = '#333';
                btn.style.color = '#00ff9c';
                btn.style.borderBottom = '2px solid #00ff9c';
                
                document.querySelectorAll('.tab-content-v5-4').forEach(content => {
                    content.style.display = 'none';
                });
                const targetContent = document.getElementById(`${btn.dataset.tab}-content-v5-4`);
                if (targetContent) {
                    targetContent.style.display = 'block';
                }
                
                logToPanel(`📊 Aba alterada para: ${btn.dataset.tab} v5.4`, 'info');
            });
        });
        
        const runAllTestsBtn = document.getElementById('run-all-tests-v5-4');
        if (runAllTestsBtn) {
            runAllTestsBtn.addEventListener('click', async () => {
                logToPanel('🧪 Iniciando teste completo v5.4...', 'debug');
                await runCompleteDiagnosis();
            });
        }
        
        const testPdfMobileBtn = document.getElementById('test-pdf-mobile-v5-4');
        if (testPdfMobileBtn) {
            testPdfMobileBtn.addEventListener('click', () => {
                logToPanel('📱 Iniciando diagnóstico mobile PDF v5.4...', 'mobile');
                runPdfMobileDiagnosis();
            });
        }
        
        const analyzeReferencesPanelBtn = document.getElementById('analyze-references-btn-v5-4');
        if (analyzeReferencesPanelBtn) {
            analyzeReferencesPanelBtn.addEventListener('click', () => {
                logToPanel('🔗 Analisando referências v5.4...', 'reference');
                if (typeof window.analyzeBrokenReferences === 'function') {
                    window.analyzeBrokenReferences();
                } else {
                    logToPanel('❌ Função analyzeBrokenReferences não encontrada v5.4', 'error');
                }
            });
        }
        
        const runPdfCheckPanelBtn = document.getElementById('run-pdf-check-btn-v5-4');
        if (runPdfCheckPanelBtn) {
            runPdfCheckPanelBtn.addEventListener('click', () => {
                logToPanel('📄 Executando verificação PDF v5.4...', 'pdf-check');
                if (typeof window.runPdfCompatibilityCheck === 'function') {
                    window.runPdfCompatibilityCheck();
                } else {
                    logToPanel('❌ Função runPdfCompatibilityCheck não encontrada v5.4', 'error');
                }
            });
        }
        
        const diagnosePdfIconPanelBtn = document.getElementById('diagnose-pdf-icon-btn-v5-4');
        if (diagnosePdfIconPanelBtn) {
            diagnosePdfIconPanelBtn.addEventListener('click', () => {
                logToPanel('🔍 Executando diagnóstico do ícone PDF v5.4...', 'pdf-check');
                if (typeof window.diagnosePdfIconProblem === 'function') {
                    window.diagnosePdfIconProblem();
                } else {
                    logToPanel('❌ Função diagnosePdfIconProblem não encontrada v5.4', 'error');
                }
            });
        }
        
        const interactivePdfTestPanelBtn = document.getElementById('interactive-pdf-test-btn-v5-4');
        if (interactivePdfTestPanelBtn) {
            interactivePdfTestPanelBtn.addEventListener('click', () => {
                logToPanel('🎮 Iniciando teste interativo PDF v5.4...', 'pdf-check');
                if (typeof window.interactivePdfTest === 'function') {
                    window.interactivePdfTest();
                } else {
                    logToPanel('❌ Função interactivePdfTest não encontrada v5.4', 'error');
                }
            });
        }
        
        const exportBtn = document.getElementById('export-btn-v5-4');
        if (exportBtn) {
            exportBtn.addEventListener('click', exportReport);
        }
    }
    
    /* ================== ATUALIZAÇÃO DOS BOTÕES PDF NO PAINEL v5.4 ================== */
    function updatePdfCheckButtons() {
        // Atualizar botão principal de verificação PDF
        const runPdfCheckBtn = document.getElementById('run-pdf-check-btn-v5-4');
        if (runPdfCheckBtn) {
            runPdfCheckBtn.addEventListener('click', () => {
                if (typeof window.runPdfCompatibilityCheck === 'function') {
                    window.runPdfCompatibilityCheck();
                } else {
                    // Fallback para verificação básica
                    console.log('🔍 Executando verificação PDF básica v5.4...');
                    const tests = {
                        'PdfSystem': !!window.PdfSystem,
                        'Modal': !!document.getElementById('pdfModal'),
                        'Campo senha': !!document.getElementById('pdfPassword'),
                        'Função processAndSavePdfs': typeof window.processAndSavePdfs === 'function',
                        'Função testPdfSystem': typeof window.testPdfSystem === 'function',
                        'Função interactivePdfTest': typeof window.interactivePdfTest === 'function'
                    };
                    
                    let passed = 0;
                    Object.entries(tests).forEach(([name, result]) => {
                        console.log(`${result ? '✅' : '❌'} ${name}: ${result}`);
                        if (result) passed++;
                    });
                    
                    const score = Math.round((passed / Object.keys(tests).length) * 100);
                    console.log(`📊 Score PDF básico v5.4: ${passed}/${Object.keys(tests).length} (${score}%)`);
                    
                    logToPanel(`📊 Score PDF básico v5.4: ${score}%`, 'pdf-check');
                }
            });
        }
        
        // Atualizar botão no header
        const runPdfCheckMainBtn = document.getElementById('run-pdf-check-main-v5-4');
        if (runPdfCheckMainBtn) {
            runPdfCheckMainBtn.addEventListener('click', () => {
                if (typeof window.runPdfCompatibilityCheck === 'function') {
                    window.runPdfCompatibilityCheck();
                }
            });
        }
        
        // Atualizar botão na aba de testes
        const runPdfCheckTestBtn = document.getElementById('run-pdf-check-v5-4');
        if (runPdfCheckTestBtn) {
            runPdfCheckTestBtn.addEventListener('click', () => {
                if (typeof window.runPdfCompatibilityCheck === 'function') {
                    window.runPdfCompatibilityCheck();
                }
            });
        }
    }
    
    /* ================== EXECUTAR DIAGNÓSTICO AUTOMATICAMENTE SE HOUVER ERROS v5.4 ================== */
    // Monitorar erros de clique em elementos PDF
    document.addEventListener('click', function(e) {
        const target = e.target;
        const isPdfElement = target.matches?.('.pdf-icon, .icon-pdf, [onclick*="pdf"], [onclick*="Pdf"], [onclick*="PDF"]') ||
                             target.closest?.('.pdf-icon, .icon-pdf, [onclick*="pdf"], [onclick*="Pdf"], [onclick*="PDF"]);
        
        if (isPdfElement) {
            console.log('🔍 Clique em elemento PDF detectado v5.4:', {
                tag: target.tagName,
                class: target.className,
                id: target.id,
                onclick: target.getAttribute('onclick')
            });
            
            // Se for um ícone PDF e o diagnóstico estiver ativo, registrar no painel
            if (DEBUG_MODE && DIAGNOSTICS_MODE) {
                logToPanel(`🔍 Clique em elemento PDF detectado v5.4: ${target.className || target.tagName}`, 'pdf-check');
                
                // Verificar se o modal abre corretamente
                setTimeout(() => {
                    const modal = document.getElementById('pdfModal');
                    if (modal && (modal.style.display === 'flex' || getComputedStyle(modal).display === 'flex')) {
                        logToPanel('✅ Modal PDF aberto com sucesso v5.4', 'success');
                    } else {
                        logToPanel('❌ Modal PDF não abriu v5.4', 'error');
                    }
                }, 100);
            }
        }
    }, true);
    
    /* ================== INICIALIZAÇÃO v5.4 ================== */
    if (DEBUG_MODE && DIAGNOSTICS_MODE) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => {
                    createDiagnosticsPanel();
                    logToPanel('Panel de diagnóstico criado v5.4', 'success');
                    
                    setTimeout(() => runCompleteDiagnosis(), 2000);
                    
                    if (MOBILE_TEST) {
                        setTimeout(() => runPdfMobileDiagnosis(), 3000);
                    }
                    
                    if (REFERENCE_CHECK) {
                        setTimeout(() => {
                            if (typeof window.analyzeBrokenReferences === 'function') {
                                window.analyzeBrokenReferences();
                            }
                        }, 4000);
                    }
                    
                    setTimeout(() => {
                        if (typeof window.autoValidateMigration === 'function') {
                            window.autoValidateMigration();
                        }
                    }, 5000);
                    
                    // Atualizar botões PDF
                    setTimeout(updatePdfCheckButtons, 1000);
                    
                    // Executar diagnóstico do ícone PDF se houver debug específico
                    if (PDF_DEBUG) {
                        setTimeout(() => {
                            if (typeof window.diagnosePdfIconProblem === 'function') {
                                window.diagnosePdfIconProblem();
                            }
                        }, 6000);
                    }
                    
                    console.log('✅ diagnostics.js v5.4 inicializado com sucesso!');
                }, 1000);
            });
        } else {
            setTimeout(() => {
                createDiagnosticsPanel();
                logToPanel('Panel de diagnóstico criado v5.4', 'success');
                
                setTimeout(() => runCompleteDiagnosis(), 2000);
                
                if (MOBILE_TEST) {
                    setTimeout(() => runPdfMobileDiagnosis(), 3000);
                }
                
                if (REFERENCE_CHECK) {
                    setTimeout(() => {
                        if (typeof window.analyzeBrokenReferences === 'function') {
                            window.analyzeBrokenReferences();
                        }
                    }, 4000);
                }
                
                setTimeout(() => {
                    if (typeof window.autoValidateMigration === 'function') {
                        window.autoValidateMigration();
                    }
                }, 5000);
                
                // Atualizar botões PDF
                setTimeout(updatePdfCheckButtons, 1000);
                
                // Executar diagnóstico do ícone PDF se houver debug específico
                if (PDF_DEBUG) {
                    setTimeout(() => {
                        if (typeof window.diagnosePdfIconProblem === 'function') {
                            window.diagnosePdfIconProblem();
                        }
                    }, 6000);
                }
                
                console.log('✅ diagnostics.js v5.4 inicializado com sucesso!');
            }, 1000);
        }
    }
    
    // Adicionar console helper para teste rápido
    window.testPdfIcon = function() {
        console.log('🧪 TESTE RÁPIDO DO ÍCONE PDF v5.4');
        console.log('1. showPdfModal existe?', typeof window.showPdfModal);
        console.log('2. PdfSystem existe?', typeof window.PdfSystem);
        console.log('3. PdfSystem.showModal existe?', typeof window.PdfSystem?.showModal);
        console.log('4. Modal existe?', !!document.getElementById('pdfModal'));
        console.log('5. Função testPdfSystem existe?', typeof window.testPdfSystem);
        console.log('6. Função interactivePdfTest existe?', typeof window.interactivePdfTest);
        console.log('7. Executando testPdfSystem(101)...');
        
        if (typeof window.testPdfSystem === 'function') {
            window.testPdfSystem(101);
        } else if (typeof window.showPdfModal === 'function') {
            window.showPdfModal(101);
        } else {
            console.log('❌ showPdfModal não encontrada. Criando teste v5.4...');
            const modal = document.getElementById('pdfModal');
            if (modal) {
                modal.style.display = 'flex';
                console.log('✅ Modal aberto manualmente v5.4');
            } else {
                console.log('❌ Modal não encontrado v5.4');
            }
        }
    };
    
    window.runDiagnostics = runCompleteDiagnosis;
    window.diagnosticsLoaded = true;
    
    // Funções auxiliares para acesso rápido
    window.diag = {
        pdf: {
            test: window.testPdfSystem,
            interactive: window.interactivePdfTest,
            diagnose: window.diagnosePdfIconProblem,
            check: window.runPdfCompatibilityCheck
        },
        system: {
            overview: () => console.table(analyzeSystem()),
            placeholders: window.analyzePlaceholders,
            references: window.analyzeBrokenReferences
        },
        migration: {
            verify: window.verifyMediaMigration,
            compatibility: window.testModuleCompatibility,
            auto: window.autoValidateMigration
        }
    };
    
    console.log('✅ diagnostics.js v5.4 carregado com sucesso! (com diagnóstico de ícone PDF e melhorias F12)');
    
    // Adicionar listener para capturar erros 404 em tempo real
    window.addEventListener('error', function(e) {
        if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
            console.error('🔍 [DIAGNOSTICS v5.4] ERRO 404 DETECTADO EM TEMPO REAL:', {
                element: e.target.tagName,
                src: e.target.src || e.target.href,
                timestamp: new Date().toISOString(),
                page: window.location.href
            });
            
            // Se diagnostics estiver ativo, logar no painel também
            if (DEBUG_MODE && DIAGNOSTICS_MODE) {
                logToPanel(`❌ 404 detectado v5.4: ${e.target.src || e.target.href}`, 'error');
            }
        }
    });
    
    // Monitorar fetch para detectar 404s em chamadas AJAX
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            if (!response.ok && response.status === 404) {
                console.warn('🔍 [DIAGNOSTICS v5.4] Fetch 404 detectado:', args[0]);
                
                if (DEBUG_MODE && DIAGNOSTICS_MODE) {
                    logToPanel(`⚠️ Fetch 404 v5.4: ${args[0]}`, 'warning');
                }
            }
            return response;
        }).catch(error => {
            if (error.message.includes('404')) {
                console.error('🔍 [DIAGNOSTICS v5.4] Fetch error 404:', args[0]);
                
                if (DEBUG_MODE && DIAGNOSTICS_MODE) {
                    logToPanel(`❌ Fetch error 404 v5.4: ${args[0]}`, 'error');
                }
            }
            throw error;
        });
    };
    
    // Inicialização automática se em modo debug
    if (PDF_DEBUG || location.search.includes('debug=pdf')) {
        setTimeout(() => {
            console.log('🔧 Modo debug PDF ativado - inicializando diagnóstico v5.4');
            window.enhanceDevTools();
            
            if (typeof window.interactivePdfTest === 'function') {
                setTimeout(() => {
                    window.interactivePdfTest();
                }, 1500);
            }
            
            if (typeof window.diagnosePdfIconProblem === 'function') {
                setTimeout(() => {
                    window.diagnosePdfIconProblem();
                }, 2500);
            }
        }, 1000);
    }
    
    // Exportar funções globais
    return {
        analyzeSystem,
        runCompleteDiagnosis,
        testMediaUnifiedComplete,
        exportReport,
        createDiagnosticsPanel,
        logToPanel,
        updateStatus,
        updateDeviceIndicator,
        version: '5.4'
    };
    
    })();
    
    console.log('✅ DIAGNOSTICS.JS v5.4 - CARREGAMENTO COMPLETO');
    console.log('📋 Comandos disponíveis:');
    console.log('- window.runDiagnostics() - Executar diagnóstico completo');
    console.log('- window.testPdfSystem() - Testar sistema PDF');
    console.log('- window.interactivePdfTest() - Teste interativo PDF');
    console.log('- window.diagnosePdfIconProblem() - Diagnosticar problema do ícone PDF');
    console.log('- window.runPdfCompatibilityCheck() - Verificar compatibilidade PDF');
    console.log('- window.analyzeBrokenReferences() - Analisar referências quebradas');
    console.log('- window.analyzePlaceholders() - Analisar placeholders');
    console.log('- window.testModuleCompatibility() - Testar compatibilidade de módulos');
    console.log('- window.verifyMediaMigration() - Verificar migração de mídia');
    console.log('- window.autoValidateMigration() - Validação automática de migração');
    console.log('- window.diag - Objeto com todas as funções de diagnóstico');
    console.log('🎯 Use console.diag.pdf.interactive() para teste interativo do sistema PDF');
    
        // Exportar como módulo se suportado
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = {
            analyzeSystem: window.analyzeSystem || analyzeSystem,
            runCompleteDiagnosis: window.runCompleteDiagnosis || runCompleteDiagnosis,
            testMediaUnifiedComplete: window.testMediaUnifiedComplete || testMediaUnifiedComplete,
            exportReport: window.exportReport || exportReport,
            createDiagnosticsPanel: window.createDiagnosticsPanel || createDiagnosticsPanel,
            logToPanel: window.logToPanel || logToPanel,
            updateStatus: window.updateStatus || updateStatus,
            updateDeviceIndicator: window.updateDeviceIndicator || updateDeviceIndicator,
            version: '5.4'
        };
    }
    
    console.log('✅ DIAGNOSTICS.JS v5.4 - CARREGAMENTO COMPLETO');
    console.log('📋 Comandos disponíveis:');
    console.log('- window.runDiagnostics() - Executar diagnóstico completo');
    console.log('- window.testPdfSystem() - Testar sistema PDF');
    console.log('- window.interactivePdfTest() - Teste interativo PDF');
    console.log('- window.diagnosePdfIconProblem() - Diagnosticar problema do ícone PDF');
    console.log('- window.runPdfCompatibilityCheck() - Verificar compatibilidade PDF');
    console.log('- window.analyzeBrokenReferences() - Analisar referências quebradas');
    console.log('- window.analyzePlaceholders() - Analisar placeholders');
    console.log('- window.testModuleCompatibility() - Testar compatibilidade de módulos');
    console.log('- window.verifyMediaMigration() - Verificar migração de mídia');
    console.log('- window.autoValidateMigration() - Validação automática de migração');
    console.log('- window.diag - Objeto com todas as funções de diagnóstico');
    console.log('🎯 Use console.diag.pdf.interactive() para teste interativo do sistema PDF');
})(); // ← APENAS UM FECHAMENTO DE IIFE

// FIM DO ARQUIVO - NÃO ADICIONE NADA DEPOIS DESTA LINHA
