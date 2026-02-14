// ================== debug/diagnostics/diagnostics59.js ==================
// DIAGNÓSTICO DO SISTEMA - MÓDULO DE VALIDAÇÃO DE INTEGRIDADE (v5.9.4)
// CORREÇÃO: Força painel na frente CONSTANTEMENTE + botão dedicado
console.log(`🔬 [DIAGNOSTICS59] Carregando... (v5.9.4)`);

(function() {
    'use strict';

    // --- Configuração do Módulo ---
    const MODULE_ID = 'diagnostics59';
    const MODULE_NAME = 'Validação de Integridade (v5.9.4)';
    const PANEL_ID = 'diagnostics59-panel';
    const CONTROL_BTN_ID = 'diag59-control-btn';
    const Z_INDEX_BASE = 200000; // AINDA MAIS ALTO (200k)
    let isPanelVisible = false;
    let panelElement = null;
    let forceFrontInterval = null;

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
        
        checkFunction: function(obj, path) {
            try {
                if (typeof path === 'string') {
                    if (!path.includes('.')) {
                        return typeof window[path] === 'function';
                    }
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

    // --- Funções de Teste (iguais à v5.9.3 que funcionaram) ---
    const Tests = {
        checkCoreAPIs: function() {
            Utils.log('test', '🧪 Executando: Verificação de Core APIs...');
            const issues = [];
            let status = 'success';
            
            const coreFunctions = [
                'loadPropertiesData', 'renderProperties', 'setupFilters',
                'savePropertiesToStorage', 'addNewProperty', 'updateProperty',
                'toggleAdminPanel'
            ];

            coreFunctions.forEach(fnName => {
                if (!Utils.checkFunction(window, fnName)) {
                    issues.push(`❌ Função ausente: ${fnName}`);
                    status = 'error';
                }
            });

            return { status, issues, name: 'Core APIs' };
        },

        checkModules: function() {
            Utils.log('test', '🧪 Executando: Verificação de Módulos Específicos...');
            const issues = [];
            let status = 'success';
            
            if (!window.MediaSystem) {
                issues.push('❌ MediaSystem não disponível');
                status = 'error';
            }
            
            if (!window.PdfSystem) {
                issues.push('❌ PdfSystem não disponível');
                status = 'error';
            }
            
            if (!window.SharedCore) {
                issues.push('❌ SharedCore não disponível');
                status = 'error';
            }
            
            if (!window.LoadingManager) {
                issues.push('❌ LoadingManager não disponível');
                status = 'error';
            }
            
            if (!window.FilterManager) {
                issues.push('❌ FilterManager não disponível');
                status = 'error';
            }

            return { status, issues, name: 'Módulos Específicos' };
        },

        checkPropertiesIntegrity: function() {
            Utils.log('test', '🧪 Executando: Verificação de Integridade das Propriedades...');
            const issues = [];
            let status = 'success';

            if (!window.properties || !Array.isArray(window.properties)) {
                issues.push('❌ window.properties inválido');
                status = 'error';
            } else {
                if (window.properties.length === 0) {
                    issues.push('⚠️ Nenhum imóvel carregado.');
                    status = 'warning';
                }
            }

            return { status, issues, name: 'Propriedades' };
        },

        checkUIState: function() {
            Utils.log('test', '🧪 Executando: Verificação da UI...');
            const issues = [];
            let status = 'success';

            if (!document.getElementById('properties-container')) {
                issues.push('❌ Container não encontrado');
                status = 'error';
            }

            return { status, issues, name: 'Interface' };
        },

        checkGallery: function() {
            Utils.log('test', '🧪 Executando: Verificação da Galeria...');
            const issues = [];
            let status = 'success';

            if (typeof window.openGallery !== 'function') {
                issues.push('❌ openGallery não é função');
                status = 'error';
            }

            return { status, issues, name: 'Galeria' };
        }
    };

    // --- FUNÇÃO CRÍTICA: Forçar painel na frente ---
    function forceThisPanelToFront(permanent = false) {
        if (!panelElement) return;
        
        // 1. Colocar este painel com z-index altíssimo
        panelElement.style.zIndex = Z_INDEX_BASE;
        panelElement.style.display = 'flex';
        
        // 2. Encontrar TODOS os outros painéis e colocar atrás
        const allPossiblePanels = document.querySelectorAll(
            '[id^="diagnostics"], [class*="diagnostics"], ' +
            '[id*="diagnostic"], [class*="diagnostic"], ' +
            '.diagnostics-panel, [id*="panel"], [class*="panel"]'
        );
        
        allPossiblePanels.forEach(panel => {
            if (panel.id !== PANEL_ID && panel !== panelElement) {
                panel.style.zIndex = (Z_INDEX_BASE - 100).toString();
            }
        });
        
        // 3. Adicionar borda piscante para destacar
        panelElement.style.border = '4px solid #ff0000';
        panelElement.style.boxShadow = '0 0 30px rgba(255, 0, 0, 0.8)';
        
        setTimeout(() => {
            if (panelElement) {
                panelElement.style.border = '3px solid #ff6b6b';
                panelElement.style.boxShadow = '0 20px 60px rgba(255, 107, 107, 0.5)';
            }
        }, 500);
        
        Utils.log('success', `🚀 Painel FORÇADO para frente (z-index: ${Z_INDEX_BASE})`);
        
        // 4. Se for permanente, configurar intervalo para manter na frente
        if (permanent && !forceFrontInterval) {
            forceFrontInterval = setInterval(() => {
                if (panelElement && panelElement.style.display !== 'none') {
                    panelElement.style.zIndex = Z_INDEX_BASE;
                }
            }, 500); // Verificar a cada 500ms
            Utils.log('info', '🔄 Monitoramento permanente ativado');
        }
    }

    // --- Criar painel (modificado para já forçar frente) ---
    function createPanel() {
        if (panelElement) {
            panelElement.style.display = 'flex';
            forceThisPanelToFront(true);
            return panelElement;
        }

        Utils.log('info', 'Criando novo painel...');

        panelElement = document.createElement('div');
        panelElement.id = PANEL_ID;
        
        const panelStyle = {
            position: 'fixed',
            top: '80px',
            left: '30px',
            width: '600px',
            height: '650px',
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
                    <span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🔬 DIAGNÓSTICO v5.9.4</span>
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
                <div style="color: #ffaaaa; border-bottom: 1px solid #1e3a5f; padding-bottom: 8px; margin-bottom: 15px; font-weight: bold; display: flex; justify-content: space-between;">
                    <span>📋 RESULTADOS DA VALIDAÇÃO</span>
                    <span style="color: #ffaa00; background: #332200; padding: 2px 8px; border-radius: 12px;">Z: ${Z_INDEX_BASE}</span>
                </div>
                <div id="${PANEL_ID}-results"></div>
                <div style="margin-top: 15px; display: flex; gap: 10px;">
                    <button id="${PANEL_ID}-rerun" style="
                        background: #2e7d32;
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        flex: 2;
                        font-weight: bold;
                    ">🔄 RE-EXECUTAR</button>
                    <button id="${PANEL_ID}-bringToFront" style="
                        background: #ff6b6b;
                        color: white;
                        border: none;
                        padding: 10px;
                        border-radius: 4px;
                        cursor: pointer;
                        flex: 1;
                        font-weight: bold;
                    ">🔝 TRAZER P/ FRENTE</button>
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
                <span>🚀 SEMPRE NO TOPO | Clique p/ arrastar</span>
                <span id="${PANEL_ID}-timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
        `;

        document.body.appendChild(panelElement);

        // Tornar arrastável
        const header = document.getElementById(`${PANEL_ID}-header`);
        if (header) Utils.createDraggable(panelElement, header);

        // Event Listeners
        document.getElementById(`${PANEL_ID}-close`).onclick = () => {
            panelElement.style.display = 'none';
            isPanelVisible = false;
            // Parar monitoramento se existir
            if (forceFrontInterval) {
                clearInterval(forceFrontInterval);
                forceFrontInterval = null;
            }
        };

        document.getElementById(`${PANEL_ID}-minimize`).onclick = () => {
            const content = document.getElementById(`${PANEL_ID}-content`);
            content.style.display = content.style.display === 'none' ? 'flex' : 'none';
        };

        document.getElementById(`${PANEL_ID}-rerun`).onclick = runAllTestsAndDisplay;
        
        // NOVO BOTÃO: Trazer para frente manualmente
        document.getElementById(`${PANEL_ID}-bringToFront`).onclick = () => {
            forceThisPanelToFront(true);
        };

        isPanelVisible = true;
        
        // Forçar para frente imediatamente
        forceThisPanelToFront(true);
        
        return panelElement;
    }

    // --- Executar todos os testes ---
    function runAllTestsAndDisplay() {
        const resultsContainer = document.getElementById(`${PANEL_ID}-results`);
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '<div style="text-align: center; color: #bbb; padding: 20px;">Executando testes...</div>';

        setTimeout(() => {
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
            
            // Após atualizar, garantir que continua na frente
            forceThisPanelToFront(true);
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
                width: 65px;
                height: 65px;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 4px 20px rgba(255, 107, 107, 0.8);
                z-index: ${Z_INDEX_BASE - 1};
                display: flex;
                align-items: center;
                justify-content: center;
                border: 2px solid white;
                transition: all 0.3s;
            " title="Diagnóstico v5.9.4 (Sempre no Topo)">🔬</button>
        `;
        document.body.appendChild(btn);

        btn.querySelector('button').onclick = () => {
            if (!isPanelVisible || !panelElement) {
                createPanel();
                runAllTestsAndDisplay();
            } else {
                panelElement.style.display = 'flex';
                forceThisPanelToFront(true);
            }
        };
    }

    // --- Inicialização ---
    function init() {
        Utils.log('info', 'Inicializando módulo...');
        
        createControlButton();
        
        // Registrar funções de emergência
        window.bringDiagnostics59ToFront = () => forceThisPanelToFront(true);
        window.diagnostics59KillOthers = () => {
            // Função EXTREMA: remove outros painéis
            const panelsToRemove = document.querySelectorAll('[id^="diagnostics"]:not(#' + PANEL_ID + ')');
            panelsToRemove.forEach(panel => {
                if (panel.id !== PANEL_ID) {
                    panel.style.display = 'none';
                    Utils.log('warn', `🗑️ Painel ${panel.id} ocultado`);
                }
            });
            forceThisPanelToFront(true);
        };
        
        // Se URL tem diagnostics=true, abrir automaticamente
        if (window.location.search.includes('diagnostics=true')) {
            setTimeout(() => {
                createPanel();
                runAllTestsAndDisplay();
            }, 2000);
        }
        
        Utils.log('info', 'Comandos disponíveis:');
        Utils.log('info', '  • bringDiagnostics59ToFront() - Trazer p/ frente');
        Utils.log('info', '  • diagnostics59KillOthers() - Ocultar outros painéis');
    }

    // Iniciar
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

console.log(`🔬 [DIAGNOSTICS59] Carregamento concluído. Painel SEMPRE NO TOPO!`);
console.log(`🔬 [DIAGNOSTICS59] Comandos: bringDiagnostics59ToFront() | diagnostics59KillOthers()`);
