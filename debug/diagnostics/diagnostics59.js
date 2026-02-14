// ================== debug/diagnostics/diagnostics59.js ==================
// DIAGNÓSTICO DO SISTEMA - MÓDULO DE VALIDAÇÃO DE INTEGRIDADE (v5.9.3)
// CORREÇÃO: Funções críticas agora usam a mesma lógica da v5.9.1 que funcionava
console.log(`🔬 [DIAGNOSTICS59] Carregando... (v5.9.3)`);

(function() {
    'use strict';

    // --- Configuração do Módulo ---
    const MODULE_ID = 'diagnostics59';
    const MODULE_NAME = 'Validação de Integridade (v5.9.3)';
    const PANEL_ID = 'diagnostics59-panel';
    const CONTROL_BTN_ID = 'diag59-control-btn';
    const Z_INDEX_BASE = 100000;
    let isPanelVisible = false;
    let panelElement = null;

    // --- Verificação de Ambiente ---
    if (window[`__${MODULE_ID}_LOADED`]) {
        console.log(`🔬 [DIAGNOSTICS59] Módulo já carregado. Ignorando.`);
        return;
    }
    window[`__${MODULE_ID}_LOADED`] = true;

    // --- Utilitários Internos ---
    const Utils = {
        log: function(level, ...args) {
            const prefix = '[DIAGNOSTICS59]';
            const styles = {
                info: 'color: #3498db; font-weight: bold;',
                success: 'color: #2ecc71; font-weight: bold;',
                warn: 'color: #f39c12; font-weight: bold;',
                error: 'color: #e74c3c; font-weight: bold;',
                test: 'color: #9b59b6; font-weight: bold;'
            };
            
            if (level === 'test') {
                console.log(`%c${prefix}`, styles[level] || styles.info, ...args);
            } else {
                const method = console[level] || console.log;
                method(`%c${prefix}`, styles[level] || styles.info, ...args);
            }
        },
        
        // Função para verificar disponibilidade de funções (baseada na v5.9.1)
        checkFunction: function(obj, path) {
            try {
                if (typeof path === 'string') {
                    // Se for string simples, verificar no window
                    if (!path.includes('.')) {
                        return typeof window[path] === 'function';
                    }
                    // Se tiver ponto, navegar no objeto
                    const parts = path.split('.');
                    let current = window;
                    for (const part of parts) {
                        if (!current || typeof current[part] === 'undefined') {
                            return false;
                        }
                        current = current[part];
                    }
                    return typeof current === 'function';
                }
                return false;
            } catch (e) {
                return false;
            }
        },
        
        createDraggable: function(element, handle) {
            let isDragging = false;
            let offsetX, offsetY;

            handle.style.cursor = 'grab';
            
            const onMouseDown = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                
                e.preventDefault();
                
                const rect = element.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                
                isDragging = true;
                handle.style.cursor = 'grabbing';
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;
                
                e.preventDefault();
                
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                
                const maxX = window.innerWidth - element.offsetWidth;
                const maxY = window.innerHeight - element.offsetHeight;
                
                element.style.left = `${Math.max(5, Math.min(x, maxX - 5))}px`;
                element.style.top = `${Math.max(5, Math.min(y, maxY - 5))}px`;
            };

            const onMouseUp = () => {
                isDragging = false;
                handle.style.cursor = 'grab';
                
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            handle.addEventListener('mousedown', onMouseDown);
        }
    };

    // --- Funções de Teste (CORRIGIDAS baseado na v5.9.1) ---
    const Tests = {
        // Teste 1: Verificar Core APIs (baseado na v5.9.1)
        checkCoreAPIs: function() {
            Utils.log('test', '🧪 Executando: Verificação de Core APIs...');
            const issues = [];
            let status = 'success';
            
            // Lista de funções que existem no sistema (baseado no LOG)
            const coreFunctions = [
                'loadPropertiesData',
                'renderProperties',
                'setupFilters',
                'savePropertiesToStorage',
                'addNewProperty',
                'updateProperty',
                'toggleAdminPanel'
            ];

            coreFunctions.forEach(fnName => {
                if (!Utils.checkFunction(window, fnName)) {
                    issues.push(`❌ Função ausente: ${fnName}`);
                    status = 'error';
                } else {
                    Utils.log('info', `✅ ${fnName} disponível.`);
                }
            });

            return { status, issues, name: 'Core APIs' };
        },

        // Teste 2: Verificar Módulos Específicos (Media, PDF, SharedCore)
        checkModules: function() {
            Utils.log('test', '🧪 Executando: Verificação de Módulos Específicos...');
            const issues = [];
            let status = 'success';
            
            // Verificar MediaSystem (pode estar em diferentes locais)
            const mediaTests = [
                { path: 'MediaSystem', desc: 'MediaSystem objeto' },
                { path: 'MediaSystem.addFiles', desc: 'MediaSystem.addFiles' },
                { path: 'window.MediaSystem', desc: 'window.MediaSystem' }
            ];
            
            let mediaFound = false;
            mediaTests.forEach(test => {
                if (Utils.checkFunction(window, test.path) || 
                    (test.path === 'MediaSystem' && window.MediaSystem)) {
                    mediaFound = true;
                }
            });
            
            if (!mediaFound && !window.MediaSystem) {
                issues.push('❌ MediaSystem não disponível');
                status = 'error';
            } else {
                Utils.log('info', `✅ MediaSystem disponível.`);
            }
            
            // Verificar PdfSystem
            const pdfTests = [
                { path: 'PdfSystem', desc: 'PdfSystem objeto' },
                { path: 'PdfSystem.showModal', desc: 'PdfSystem.showModal' },
                { path: 'window.PdfSystem', desc: 'window.PdfSystem' }
            ];
            
            let pdfFound = false;
            pdfTests.forEach(test => {
                if (Utils.checkFunction(window, test.path) ||
                    (test.path === 'PdfSystem' && window.PdfSystem)) {
                    pdfFound = true;
                }
            });
            
            if (!pdfFound && !window.PdfSystem) {
                issues.push('❌ PdfSystem não disponível');
                status = 'error';
            } else {
                Utils.log('info', `✅ PdfSystem disponível.`);
            }
            
            // Verificar SharedCore
            if (!window.SharedCore) {
                issues.push('❌ SharedCore não disponível');
                status = 'error';
            } else {
                Utils.log('info', `✅ SharedCore disponível.`);
            }
            
            // Verificar LoadingManager
            if (!window.LoadingManager) {
                issues.push('❌ LoadingManager não disponível');
                status = 'error';
            } else {
                Utils.log('info', `✅ LoadingManager disponível.`);
            }
            
            // Verificar FilterManager
            if (!window.FilterManager) {
                issues.push('❌ FilterManager não disponível');
                status = 'error';
            } else {
                Utils.log('info', `✅ FilterManager disponível.`);
            }

            return { status, issues, name: 'Módulos Específicos' };
        },

        // Teste 3: Verificar Integridade das Propriedades
        checkPropertiesIntegrity: function() {
            Utils.log('test', '🧪 Executando: Verificação de Integridade das Propriedades...');
            const issues = [];
            let status = 'success';

            if (!window.properties) {
                issues.push('❌ window.properties não existe.');
                status = 'error';
            } else if (!Array.isArray(window.properties)) {
                issues.push(`❌ window.properties não é um array.`);
                status = 'error';
            } else {
                Utils.log('info', `📊 Total de imóveis: ${window.properties.length}`);
                
                if (window.properties.length === 0) {
                    issues.push('⚠️ Nenhum imóvel carregado.');
                    status = 'warning';
                }
                
                // Validar estrutura básica
                window.properties.slice(0, 5).forEach((prop, index) => {
                    if (!prop.id) issues.push(`⚠️ Imóvel ${index} sem ID.`);
                    if (!prop.title) issues.push(`⚠️ Imóvel ${prop.id || index} sem título.`);
                });
            }

            // Verificar localStorage
            try {
                const stored = localStorage.getItem('properties');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    Utils.log('info', `💾 localStorage: ${parsed.length} imóveis`);
                }
            } catch (e) {
                issues.push(`❌ Erro no localStorage: ${e.message}`);
            }

            return { status, issues, name: 'Propriedades' };
        },

        // Teste 4: Verificar Estado da UI
        checkUIState: function() {
            Utils.log('test', '🧪 Executando: Verificação da UI...');
            const issues = [];
            let status = 'success';

            const container = document.getElementById('properties-container');
            if (!container) {
                issues.push('❌ Container #properties-container não encontrado.');
                status = 'error';
            }

            const filterButtons = document.querySelectorAll('.filter-btn');
            Utils.log('info', `🔘 ${filterButtons.length} botões de filtro`);

            const adminBtn = document.querySelector('.admin-toggle');
            if (!adminBtn) {
                issues.push('⚠️ Botão admin não encontrado.');
            }

            return { status, issues, name: 'Interface' };
        },

        // Teste 5: Verificar Galeria
        checkGallery: function() {
            Utils.log('test', '🧪 Executando: Verificação da Galeria...');
            const issues = [];
            let status = 'success';

            if (typeof window.openGallery !== 'function') {
                issues.push('❌ openGallery não é função');
                status = 'error';
            }
            
            if (typeof window.createPropertyGallery !== 'function') {
                issues.push('❌ createPropertyGallery não é função');
                status = 'error';
            }

            return { status, issues, name: 'Galeria' };
        }
    };

    // --- Criação do Painel ---
    function createPanel() {
        if (panelElement) {
            panelElement.style.display = 'flex';
            panelElement.style.zIndex = Z_INDEX_BASE;
            return panelElement;
        }

        Utils.log('info', 'Criando novo painel...');

        panelElement = document.createElement('div');
        panelElement.id = PANEL_ID;
        
        const panelStyle = {
            position: 'fixed',
            top: '80px',
            left: '30px',
            width: '550px',
            height: '600px',
            background: 'linear-gradient(145deg, #0a1929, #0f2744)',
            border: '3px solid #ff6b6b',
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(255, 107, 107, 0.5)',
            zIndex: Z_INDEX_BASE,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Consolas', 'Monaco', monospace",
            fontSize: '12px',
            color: '#e0e0e0',
            resize: 'both',
            userSelect: 'text'
        };

        Object.assign(panelElement.style, panelStyle);

        panelElement.innerHTML = `
            <div id="${PANEL_ID}-header" style="
                background: #1e3a5f;
                padding: 12px 15px;
                border-bottom: 2px solid #ff6b6b;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: grab;
            ">
                <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🔬 DIAGNÓSTICO v5.9.3</span>
                    <span style="background: #2e3b4e; color: #ffaaaa; padding: 2px 6px; border-radius: 4px;">${MODULE_NAME}</span>
                </div>
                <div>
                    <button id="${PANEL_ID}-minimize" style="background: #37474f; border: none; color: white; width: 26px; height: 26px; border-radius: 4px; cursor: pointer; margin-right: 5px;">−</button>
                    <button id="${PANEL_ID}-close" style="background: #d32f2f; border: none; color: white; width: 26px; height: 26px; border-radius: 4px; cursor: pointer;">×</button>
                </div>
            </div>

            <div id="${PANEL_ID}-content" style="
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #0f2744;
            ">
                <div style="color: #ffaaaa; border-bottom: 1px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 15px; font-weight: bold;">
                    📋 RESULTADOS DA VALIDAÇÃO
                </div>
                <div id="${PANEL_ID}-results"></div>
                <div style="margin-top: 15px;">
                    <button id="${PANEL_ID}-rerun" style="
                        background: #2e7d32;
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        width: 100%;
                        font-weight: bold;
                    ">🔄 RE-EXECUTAR TESTES</button>
                </div>
            </div>

            <div style="
                background: #1e3a5f;
                padding: 8px 15px;
                border-top: 2px solid #ff6b6b;
                font-size: 11px;
                color: #ffaaaa;
                display: flex;
                justify-content: space-between;
            ">
                <span>Z-Index: ${Z_INDEX_BASE} | Arraste o cabeçalho</span>
                <span id="${PANEL_ID}-timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
        `;

        document.body.appendChild(panelElement);

        const header = document.getElementById(`${PANEL_ID}-header`);
        if (header) Utils.createDraggable(panelElement, header);

        // Event Listeners
        document.getElementById(`${PANEL_ID}-close`).onclick = () => {
            panelElement.style.display = 'none';
            isPanelVisible = false;
        };

        document.getElementById(`${PANEL_ID}-minimize`).onclick = () => {
            const content = document.getElementById(`${PANEL_ID}-content`);
            content.style.display = content.style.display === 'none' ? 'flex' : 'none';
        };

        document.getElementById(`${PANEL_ID}-rerun`).onclick = runAllTestsAndDisplay;

        isPanelVisible = true;
        return panelElement;
    }

    // --- Executar todos os testes ---
    function runAllTestsAndDisplay() {
        const resultsContainer = document.getElementById(`${PANEL_ID}-results`);
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '<div style="text-align: center; color: #bbb; padding: 20px;">Executando testes...</div>';

        setTimeout(() => {
            // Executar todos os testes
            const testResults = [
                Tests.checkCoreAPIs(),
                Tests.checkModules(),
                Tests.checkPropertiesIntegrity(),
                Tests.checkUIState(),
                Tests.checkGallery()
            ];

            let html = '';
            let allPassed = true;

            testResults.forEach(test => {
                const statusIcon = test.status === 'success' ? '✅' : (test.status === 'warning' ? '⚠️' : '❌');
                const statusColor = test.status === 'success' ? '#2ecc71' : (test.status === 'warning' ? '#f39c12' : '#e74c3c');
                if (test.status !== 'success') allPassed = false;

                html += `
                    <div style="background: #1e3a5f; border-radius: 6px; padding: 12px; margin-bottom: 12px; border-left: 4px solid ${statusColor};">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #bbb;">${statusIcon} ${test.name}</span>
                            <span style="color: ${statusColor};">${test.status.toUpperCase()}</span>
                        </div>
                        ${test.issues && test.issues.length > 0 ? 
                            `<div style="font-size: 11px; color: #ffcdd2; background: #2a2a2a; padding: 8px; border-radius: 4px;">
                                ${test.issues.map(issue => `• ${issue}`).join('<br>')}
                            </div>` : 
                            `<div style="color: #a5d6a7;">✅ Nenhum problema detectado.</div>`
                        }
                    </div>
                `;
            });

            html += `
                <div style="margin-top: 15px; padding: 12px; background: #1a1a2e; border-radius: 6px; text-align: center; border: 2px solid ${allPassed ? '#2ecc71' : '#e74c3c'};">
                    <span style="font-weight: bold; color: ${allPassed ? '#2ecc71' : '#e74c3c'};">
                        ${allPassed ? '✅ SISTEMA COMPLETO - TUDO FUNCIONAL' : '⚠️ PROBLEMAS DETECTADOS'}
                    </span>
                </div>
            `;

            resultsContainer.innerHTML = html;
            document.getElementById(`${PANEL_ID}-timestamp`).textContent = new Date().toLocaleTimeString();
        }, 100);
    }

    // --- Botão de Controle ---
    function createControlButton() {
        if (document.getElementById(CONTROL_BTN_ID)) return;

        const btn = document.createElement('div');
        btn.id = CONTROL_BTN_ID;
        btn.innerHTML = `
            <button style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(135deg, #ff6b6b, #d32f2f);
                color: white;
                border: none;
                border-radius: 50%;
                width: 60px;
                height: 60px;
                font-size: 26px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.6);
                z-index: ${Z_INDEX_BASE - 1};
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
            " title="Diagnóstico v5.9.3">🔬</button>
        `;
        document.body.appendChild(btn);

        btn.querySelector('button').onclick = () => {
            if (!isPanelVisible || !panelElement) {
                createPanel();
                runAllTestsAndDisplay();
            } else {
                panelElement.style.display = 'flex';
                panelElement.style.zIndex = Z_INDEX_BASE;
            }
        };
    }

    // --- Forçar painel na frente ---
    function forcePanelToFront() {
        if (panelElement) {
            panelElement.style.zIndex = Z_INDEX_BASE;
            panelElement.style.display = 'flex';
            Utils.log('success', 'Painel trazido para frente!');
        }
    }

    // --- Inicialização ---
    function init() {
        Utils.log('info', 'Inicializando módulo...');
        
        createControlButton();
        
        // Registrar função de emergência
        window.bringDiagnostics59ToFront = forcePanelToFront;
        
        // Se URL tem diagnostics=true, abrir automaticamente
        if (window.location.search.includes('diagnostics=true')) {
            setTimeout(() => {
                createPanel();
                runAllTestsAndDisplay();
                setTimeout(forcePanelToFront, 500);
            }, 2000);
        }
        
        Utils.log('info', 'Para trazer painel para frente: window.bringDiagnostics59ToFront()');
    }

    // Iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

console.log(`🔬 [DIAGNOSTICS59] Carregamento concluído. Use botão 🔬 no canto inferior esquerdo.`);
console.log(`🔬 [DIAGNOSTICS59] Se precisar: window.bringDiagnostics59ToFront()`);
