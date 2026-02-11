/* ==========================================================================
   DIAGNOSTICS55.JS - VERSÃO SILENCIOSA COM PAINEL VISUAL
   Repositório: weberlessa-support
   Ativação: ?debug=true&diagnostics=true na URL
   CARACTERÍSTICA: ZERO poluição de console (apenas 1 linha total)
   Última atualização: 11/02/2026 - CORREÇÃO DE TRUNCAMENTO
   ========================================================================== */

// ================== CONFIGURAÇÃO INICIAL (SILENCIOSA) ==================
(function() {
    // ÚNICA linha de log em toda a execução
    const IS_ACTIVE = location.search.includes('debug=true') && location.search.includes('diagnostics=true');
    
    if (!IS_ACTIVE) return;

    // ================== ESTADO GLOBAL ==================
    window._diag55 = window._diag55 || {
        panel: null,
        initialized: false,
        lastUpdate: null
    };

    // ================== FUNÇÕES DE TESTE PDF (OTIMIZADAS, SEM CONSOLE.LOG) ==================
    window.testPdfFix = function() {
        const testId = window.properties?.[0]?.id || 101;
        
        if (window.PdfSystem?.showModal) {
            window.PdfSystem.showModal(testId);
        } else if (window.createFallbackPdfSystem) {
            window.createFallbackPdfSystem();
            setTimeout(() => window.PdfSystem?.showModal?.(testId), 100);
        }
        
        // Verificar após 500ms
        setTimeout(() => {
            const modal = document.getElementById('pdfModal');
            const password = document.getElementById('pdfPassword');
            const success = modal?.style.display === 'flex' && password && password.style.display !== 'none';
            
            window._updatePanelVisual?.('pdf_test', { success, timestamp: Date.now() });
        }, 500);
        
        return true;
    };

    window.createFallbackPdfSystem = function() {
        if (window.PdfSystem) return false;
        
        window.PdfSystem = {
            showModal: function(id) {
                const modal = document.getElementById('pdfModal');
                if (modal) {
                    modal.style.display = 'flex';
                    const pwd = document.getElementById('pdfPassword');
                    if (pwd) {
                        pwd.style.display = 'block';
                        pwd.focus?.();
                    }
                }
                return true;
            },
            hideModal: function() {
                document.getElementById('pdfModal')?.style?.display = 'none';
            }
        };
        
        window._updatePanelVisual?.('pdf_fallback', { created: true, timestamp: Date.now() });
        return true;
    };

    // ================== VERIFICAÇÃO DE INTEGRIDADE (SEM CONSOLE) ==================
    window.verifyPdfSystemIntegrity = function() {
        const result = {
            systems: {
                MediaSystem: !!window.MediaSystem,
                processAndSavePdfs: typeof window.processAndSavePdfs === 'function',
                pdfModal: !!document.getElementById('pdfModal'),
                pdfPassword: !!document.getElementById('pdfPassword')
            },
            mediaState: window.MediaSystem?.state ? {
                pdfs: window.MediaSystem.state.pdfs?.length || 0,
                existingPdfs: window.MediaSystem.state.existingPdfs?.length || 0
            } : null,
            timestamp: Date.now()
        };
        
        window._updatePanelVisual?.('pdf_integrity', result);
        return result;
    };

    // ================== TESTE DE UPLOAD PDF (SEM CONSOLE) ==================
    window.testPdfUploadBugFix = function() {
        const result = { success: false, step2: false, step3: false };
        
        if (window.MediaSystem?.addPdfs) {
            try {
                const testFile = new File(['test'], 'teste_diag.pdf', { type: 'application/pdf' });
                const added = window.MediaSystem.addPdfs([testFile]) || 1;
                result.step2 = true;
                result.filesAdded = added;
            } catch (e) {
                result.step2Error = e.message;
            }
        }
        
        if (typeof window.processAndSavePdfs === 'function') {
            try {
                const testId = 'test_' + Date.now();
                const promise = window.processAndSavePdfs(testId, 'Teste Diagnóstico');
                
                if (promise?.then) {
                    promise.then(url => {
                        result.step3 = true;
                        result.url = url;
                        result.success = result.step2 && true;
                        window._updatePanelVisual?.('pdf_upload_test', result);
                    }).catch(e => {
                        result.step3Error = e.message;
                        window._updatePanelVisual?.('pdf_upload_test', result);
                    });
                } else {
                    result.step3 = true;
                    result.success = result.step2 && true;
                }
            } catch (e) {
                result.step3Error = e.message;
            }
        }
        
        window._updatePanelVisual?.('pdf_upload_test', result);
        return result;
    };

    // ================== PAINEL VISUAL (ZERO CONSOLE) ==================
    window._createDiagnosticPanel = function() {
        if (window._diag55.panel) {
            window._diag55.panel.style.display = 'block';
            return window._diag55.panel;
        }
        
        const panel = document.createElement('div');
        panel.id = '_diag55_panel';
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 360px;
            max-width: 95vw;
            background: #0a0c12;
            color: #e0e4f0;
            border: 1px solid #2a4a6a;
            border-radius: 12px;
            box-shadow: 0 8px 30px rgba(0,160,255,0.2);
            z-index: 999999;
            font-family: 'Segoe UI', 'Courier New', monospace;
            font-size: 12px;
            backdrop-filter: blur(8px);
            overflow: hidden;
            transition: all 0.2s;
        `;
        
        // Cabeçalho
        const header = document.createElement('div');
        header.style.cssText = `
            background: #1a2a3a;
            padding: 10px 14px;
            border-bottom: 1px solid #3a5a7a;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;
        header.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;">
                <span style="background:#00aaff;width:10px;height:10px;border-radius:2px;"></span>
                <span style="font-weight:600;color:#aae0ff;">🔬 DIAGNÓSTICO v5.5</span>
            </div>
            <div style="display:flex;gap:6px;">
                <button id="_diag_refresh" style="background:#2a4a6a;border:none;color:white;padding:3px 10px;border-radius:4px;cursor:pointer;font-size:11px;">↻</button>
                <button id="_diag_minimize" style="background:#3a4a5a;border:none;color:white;padding:3px 10px;border-radius:4px;cursor:pointer;font-size:11px;">─</button>
                <button id="_diag_close" style="background:#5a3a3a;border:none;color:white;padding:3px 10px;border-radius:4px;cursor:pointer;font-size:11px;">✕</button>
            </div>
        `;
        
        // Abas
        const tabs = document.createElement('div');
        tabs.style.cssText = `
            display: flex;
            gap: 2px;
            padding: 10px 10px 0 10px;
            background: #0e1218;
            border-bottom: 1px solid #2a3a4a;
        `;
        tabs.innerHTML = `
            <button class="_diag_tab" data-tab="pdf" style="background:#1a3a5a;color:white;border:none;padding:6px 14px;border-radius:6px 6px 0 0;cursor:pointer;font-weight:bold;">📄 PDF</button>
            <button class="_diag_tab" data-tab="media" style="background:#152a3a;color:#c0d0e0;border:none;padding:6px 14px;border-radius:6px 6px 0 0;cursor:pointer;">🖼️ Mídia</button>
            <button class="_diag_tab" data-tab="core" style="background:#152a3a;color:#c0d0e0;border:none;padding:6px 14px;border-radius:6px 6px 0 0;cursor:pointer;">⚙️ Core</button>
            <button class="_diag_tab" data-tab="system" style="background:#152a3a;color:#c0d0e0;border:none;padding:6px 14px;border-radius:6px 6px 0 0;cursor:pointer;">🌐 Sistema</button>
        `;
        
        // Conteúdo
        const content = document.createElement('div');
        content.id = '_diag_content';
        content.style.cssText = `
            padding: 14px;
            min-height: 200px;
            max-height: 400px;
            overflow-y: auto;
            background: #0c1016;
        `;
        content.innerHTML = '<div style="color:#88aacc;text-align:center;padding:20px;">Carregando diagnóstico...</div>';
        
        panel.appendChild(header);
        panel.appendChild(tabs);
        panel.appendChild(content);
        document.body.appendChild(panel);
        
        window._diag55.panel = panel;
        window._diag55.currentTab = 'pdf';
        
        // Eventos
        document.querySelectorAll('._diag_tab').forEach(tab => {
            tab.addEventListener('click', function() {
                document.querySelectorAll('._diag_tab').forEach(t => {
                    t.style.background = '#152a3a';
                    t.style.color = '#c0d0e0';
                });
                this.style.background = '#1a3a5a';
                this.style.color = 'white';
                
                window._diag55.currentTab = this.dataset.tab;
                window._updatePanelVisual(this.dataset.tab);
            });
        });
        
        document.getElementById('_diag_refresh')?.addEventListener('click', () => {
            window._updatePanelVisual(window._diag55.currentTab || 'pdf');
            window.verifyPdfSystemIntegrity();
        });
        
        document.getElementById('_diag_close')?.addEventListener('click', () => {
            panel.style.display = 'none';
        });
        
        document.getElementById('_diag_minimize')?.addEventListener('click', function() {
            if (content.style.display === 'none') {
                content.style.display = 'block';
                this.innerHTML = '─';
            } else {
                content.style.display = 'none';
                this.innerHTML = '□';
            }
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
        
        return panel;
    };

    // ================== ATUALIZAÇÃO DO PAINEL (SEM CONSOLE) ==================
    window._updatePanelVisual = function(tabName, data = null) {
        if (!window._diag55.panel) return;
        
        const content = document.getElementById('_diag_content');
        if (!content) return;
        
        let html = '';
        
        switch(tabName) {
            case 'pdf':
            case 'pdf_integrity':
            case 'pdf_test':
            case 'pdf_upload_test':
                const integrity = window.verifyPdfSystemIntegrity();
                html = `
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                            <div style="background:#0e1a22;padding:12px;border-radius:8px;border-left:4px solid #00aaff;">
                                <div style="color:#aae0ff;font-size:11px;">MediaSystem</div>
                                <div style="font-size:20px;font-weight:bold;color:${integrity.systems.MediaSystem ? '#88ff88' : '#ff8888'}">
                                    ${integrity.systems.MediaSystem ? 'ATIVO' : 'INATIVO'}
                                </div>
                            </div>
                            <div style="background:#0e1a22;padding:12px;border-radius:8px;border-left:4px solid #88aaff;">
                                <div style="color:#aae0ff;font-size:11px;">PDFs Carregados</div>
                                <div style="font-size:20px;font-weight:bold;color:#aaddff;">
                                    ${integrity.mediaState?.pdfs || 0}
                                </div>
                            </div>
                        </div>
                        
                        <div style="background:#0a121c;padding:12px;border-radius:8px;">
                            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                                <span>📋 processAndSavePdfs</span>
                                <span style="color:${integrity.systems.processAndSavePdfs ? '#88ff88' : '#ff8888'}">
                                    ${integrity.systems.processAndSavePdfs ? '✓' : '✗'}
                                </span>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
                                <span>🔐 Modal PDF</span>
                                <span style="color:${integrity.systems.pdfModal ? '#88ff88' : '#ff8888'}">${integrity.systems.pdfModal ? '✓' : '✗'}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;">
                                <span>🔑 Campo Senha</span>
                                <span style="color:${integrity.systems.pdfPassword ? '#88ff88' : '#ff8888'}">${integrity.systems.pdfPassword ? '✓' : '✗'}</span>
                            </div>
                        </div>
                        
                        <div style="display:flex;gap:8px;margin-top:4px;">
                            <button onclick="window.testPdfFix()" style="flex:1;background:#2a4a7a;border:none;color:white;padding:8px;border-radius:6px;cursor:pointer;font-size:12px;">
                                🧪 Testar PDF
                            </button>
                            <button onclick="window.testPdfUploadBugFix()" style="flex:1;background:#2a6a4a;border:none;color:white;padding:8px;border-radius:6px;cursor:pointer;font-size:12px;">
                                📤 Testar Upload
                            </button>
                        </div>
                        <div style="font-size:10px;color:#88aacc;text-align:right;">
                            ${new Date().toLocaleTimeString()}
                        </div>
                    </div>
                `;
                break;
                
            case 'media':
                const media = window.MediaSystem?.state || {};
                html = `
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;">
                        <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                            <div style="color:#88ddff;">📸 Novas</div>
                            <div style="font-size:24px;font-weight:bold;">${media.files?.length || 0}</div>
                            <div style="color:#88aacc;font-size:10px;">imagens</div>
                        </div>
                        <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                            <div style="color:#88ddff;">🖼️ Existentes</div>
                            <div style="font-size:24px;font-weight:bold;">${media.existing?.length || 0}</div>
                            <div style="color:#88aacc;font-size:10px;">imagens</div>
                        </div>
                        <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                            <div style="color:#88ddff;">📄 PDFs Novos</div>
                            <div style="font-size:24px;font-weight:bold;">${media.pdfs?.length || 0}</div>
                        </div>
                        <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                            <div style="color:#88ddff;">📁 PDFs Exist.</div>
                            <div style="font-size:24px;font-weight:bold;">${media.existingPdfs?.length || 0}</div>
                        </div>
                    </div>
                `;
                break;
                
            case 'core':
                const props = window.properties?.length || 0;
                const stored = localStorage.getItem('properties');
                const storedCount = stored ? JSON.parse(stored).length : 0;
                
                html = `
                    <div style="display:flex;flex-direction:column;gap:12px;">
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                            <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                                <div style="color:#88ddff;">🏠 Imóveis</div>
                                <div style="font-size:28px;font-weight:bold;">${props}</div>
                            </div>
                            <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                                <div style="color:#88ddff;">💾 Storage</div>
                                <div style="font-size:28px;font-weight:bold;">${storedCount}</div>
                            </div>
                        </div>
                        <div style="background:#0a121c;padding:12px;border-radius:8px;">
                            <div style="display:flex;justify-content:space-between;">
                                <span>🔧 FilterManager</span>
                                <span style="color:${window.FilterManager ? '#88ff88' : '#ff8888'}">${window.FilterManager ? '✓' : '✗'}</span>
                            </div>
                            <div style="display:flex;justify-content:space-between;margin-top:6px;">
                                <span>⏳ LoadingManager</span>
                                <span style="color:${window.LoadingManager ? '#88ff88' : '#ff8888'}">${window.LoadingManager ? '✓' : '✗'}</span>
                            </div>
                        </div>
                    </div>
                `;
                break;
                
            case 'system':
                html = `
                    <div style="display:flex;flex-direction:column;gap:10px;">
                        <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                            <div style="color:#aae0ff;margin-bottom:6px;">🌐 URL</div>
                            <div style="font-size:11px;word-break:break-all;color:#cceeff;">${window.location.href}</div>
                        </div>
                        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                            <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                                <div style="color:#88ddff;">📱 Tela</div>
                                <div style="font-size:16px;font-weight:bold;">${window.innerWidth}x${window.innerHeight}</div>
                            </div>
                            <div style="background:#0e1a22;padding:12px;border-radius:8px;">
                                <div style="color:#88ddff;">🕒 Hora</div>
                                <div style="font-size:16px;font-weight:bold;">${new Date().toLocaleTimeString()}</div>
                            </div>
                        </div>
                        <div style="background:#1a2a3a;padding:10px;border-radius:8px;border:1px solid #3a6a9a;">
                            <div style="display:flex;align-items:center;gap:8px;">
                                <span>🔔 Suporte</span>
                                <span style="background:${window.supportModulesLoaded ? '#2a6a4a' : '#5a3a3a'};padding:2px 10px;border-radius:12px;color:white;">
                                    ${window.supportModulesLoaded ? 'CARREGADOS' : 'INATIVOS'}
                                </span>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        if (html) content.innerHTML = html;
    };

    // ================== INICIALIZAÇÃO (ZERO CONSOLE) ==================
    if (!window._diag55.initialized) {
        window._diag55.initialized = true;
        
        // Criar painel após 2 segundos
        setTimeout(() => {
            window._createDiagnosticPanel();
            setTimeout(() => {
                window._updatePanelVisual('pdf');
                window.verifyPdfSystemIntegrity();
            }, 100);
        }, 2000);
        
        // Atalho Alt+D
        document.addEventListener('keydown', function(e) {
            if (e.altKey && e.key.toLowerCase() === 'd') {
                const panel = document.getElementById('_diag55_panel');
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
                } else {
                    window._createDiagnosticPanel();
                }
                e.preventDefault();
            }
        });
    }
})();
