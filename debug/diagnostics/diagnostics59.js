// ================== debug/diagnostics/diagnostics59.js ==================
// DIAGNÓSTICO DO SISTEMA - MÓDULO DE VALIDAÇÃO DE INTEGRIDADE (v5.9.2)
// CORREÇÃO: z-index MAIS ALTO (100000) e erro de console corrigido
console.log(`🔬 [DIAGNOSTICS59] Carregando... (v5.9.2)`);

(function() {
    'use strict';

    // --- Configuração do Módulo ---
    const MODULE_ID = 'diagnostics59';
    const MODULE_NAME = 'Validação de Integridade (v5.9.2)';
    const PANEL_ID = 'diagnostics59-panel';
    const CONTROL_BTN_ID = 'diag59-control-btn';
    const Z_INDEX_BASE = 100000; // MAIS ALTO que qualquer outro painel (outros usam 9999 ou 10000)
    let isPanelVisible = false;
    let panelElement = null;

    // --- Verificação de Ambiente e Prevenção de Dupla Inicialização ---
    if (window[`__${MODULE_ID}_LOADED`]) {
        console.log(`🔬 [DIAGNOSTICS59] Módulo já carregado. Ignorando.`);
        return;
    }
    window[`__${MODULE_ID}_LOADED`] = true;

    // --- Utilitários Internos (CORRIGIDO: erro no console.log) ---
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
            
            // CORREÇÃO: Usar o método correto do console com os argumentos na ordem certa
            if (level === 'test') {
                console.log(`%c${prefix}`, styles[level] || styles.info, ...args);
            } else {
                const method = console[level] || console.log;
                method(`%c${prefix}`, styles[level] || styles.info, ...args);
            }
        },
        createDraggable: function(element, handle) {
            let isDragging = false;
            let offsetX, offsetY;
            let startX, startY;

            handle.style.cursor = 'grab';
            
            const onMouseDown = (e) => {
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return;
                
                e.preventDefault();
                
                startX = e.clientX;
                startY = e.clientY;
                
                const rect = element.getBoundingClientRect();
                offsetX = startX - rect.left;
                offsetY = startY - rect.top;
                
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
                
                // Limitar dentro da tela com margem
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

    // --- Funções de Teste Específicas do diagnostics59.js ---
    const Tests = {
        // Teste 1: Verificar Integridade do window.properties
        checkPropertiesIntegrity: function() {
            Utils.log('test', '🧪 Executando: Verificação de Integridade das Propriedades...');
            const issues = [];
            let status = 'success';

            if (!window.properties) {
                issues.push('❌ window.properties não existe.');
                status = 'error';
            } else if (!Array.isArray(window.properties)) {
                issues.push(`❌ window.properties não é um array. Tipo: ${typeof window.properties}`);
                status = 'error';
            } else {
                Utils.log('info', `📊 Total de imóveis em memória: ${window.properties.length}`);
                if (window.properties.length === 0) {
                    issues.push('⚠️ Nenhum imóvel carregado.');
                    status = 'warning';
                }
                // Validar estrutura de cada imóvel
                window.properties.forEach((prop, index) => {
                    if (!prop.id) issues.push(`⚠️ Imóvel índice ${index} não tem ID.`);
                    if (!prop.title) issues.push(`⚠️ Imóvel ID ${prop.id || index} não tem título.`);
                    if (prop.has_video !== undefined && typeof prop.has_video !== 'boolean') {
                        issues.push(`⚠️ Imóvel ID ${prop.id} has_video não é booleano.`);
                    }
                });
            }

            // Verificar localStorage (chave unificada)
            try {
                const stored = localStorage.getItem('properties');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    Utils.log('info', `💾 Imóveis no localStorage: ${parsed.length}`);
                    if (window.properties && window.properties.length !== parsed.length) {
                        issues.push(`⚠️ Inconsistência: Memória (${window.properties.length}) vs Storage (${parsed.length})`);
                        status = 'warning';
                    }
                } else {
                    issues.push('⚠️ Chave "properties" não encontrada no localStorage.');
                }
            } catch (e) {
                issues.push(`❌ Erro ao ler localStorage: ${e.message}`);
                status = 'error';
            }

            return { status, issues };
        },

        // Teste 2: Verificar Disponibilidade de Funções Críticas
        checkCriticalFunctions: function() {
            Utils.log('test', '🧪 Executando: Verificação de Funções Críticas...');
            const issues = [];
            let status = 'success';
            const criticalFns = [
                'loadPropertiesData', 'renderProperties', 'setupFilters',
                'savePropertiesToStorage', 'addNewProperty', 'updateProperty',
                'PdfSystem', 'MediaSystem', 'SharedCore', 'LoadingManager', 'FilterManager'
            ];

            criticalFns.forEach(fnName => {
                const fnPath = fnName.split('.');
                let exists = false;
                try {
                    if (fnPath.length > 1) {
                        exists = window[fnPath[0]] && typeof window[fnPath[0]][fnPath[1]] === 'function';
                    } else {
                        exists = typeof window[fnName] === 'function';
                    }
                } catch (e) {
                    exists = false;
                }

                if (!exists) {
                    issues.push(`❌ Função/Objeto crítico ausente: ${fnName}`);
                    status = 'error';
                } else {
                    Utils.log('info', `✅ ${fnName} disponível.`);
                }
            });
            return { status, issues };
        },

        // Teste 3: Validar Estado da UI
        checkUIState: function() {
            Utils.log('test', '🧪 Executando: Verificação do Estado da UI...');
            const issues = [];
            let status = 'success';

            const container = document.getElementById('properties-container');
            if (!container) {
                issues.push('❌ Container #properties-container não encontrado.');
                status = 'error';
            } else {
                Utils.log('info', `✅ Container de propriedades encontrado.`);
            }

            const filterButtons = document.querySelectorAll('.filter-btn');
            if (filterButtons.length === 0) {
                issues.push('⚠️ Nenhum botão de filtro encontrado.');
                status = 'warning';
            } else {
                Utils.log('info', `✅ ${filterButtons.length} botões de filtro encontrados.`);
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter) {
                    Utils.log('info', `🎯 Filtro ativo: "${activeFilter.textContent.trim()}"`);
                } else {
                    issues.push('⚠️ Nenhum filtro ativo encontrado.');
                }
            }

            const adminBtn = document.querySelector('.admin-toggle');
            if (!adminBtn) {
                issues.push('⚠️ Botão de admin não encontrado.');
            } else {
                Utils.log('info', `✅ Botão admin encontrado.`);
            }

            return { status, issues };
        },

        // Teste 4: Verificar Sistemas de Mídia e PDF
        checkMediaPdfSystems: function() {
            Utils.log('test', '🧪 Executando: Verificação dos Sistemas de Mídia e PDF...');
            const issues = [];
            let status = 'success';

            if (!window.MediaSystem) {
                issues.push('❌ MediaSystem não disponível.');
                status = 'error';
            } else {
                Utils.log('info', `✅ MediaSystem disponível.`);
                if (typeof window.MediaSystem.state !== 'object') {
                    issues.push('⚠️ MediaSystem.state não é um objeto.');
                }
            }

            if (!window.PdfSystem) {
                issues.push('❌ PdfSystem não disponível.');
                status = 'error';
            } else {
                Utils.log('info', `✅ PdfSystem disponível.`);
                if (typeof window.PdfSystem.showModal !== 'function') {
                    issues.push('❌ PdfSystem.showModal não é uma função.');
                    status = 'error';
                }
            }

            if (!window.SharedCore) {
                issues.push('❌ SharedCore não disponível.');
                status = 'error';
            } else {
                Utils.log('info', `✅ SharedCore disponível.`);
                const formatFns = ['formatFeaturesForDisplay', 'ensureBooleanVideo', 'PriceFormatter'];
                formatFns.forEach(fn => {
                    if (!window.SharedCore[fn]) {
                        issues.push(`⚠️ SharedCore.${fn} não disponível.`);
                    }
                });
            }

            return { status, issues };
        }
    };

    // --- Criação do Painel Flutuante (com z-index MUITO ALTO) ---
    function createPanel() {
        if (panelElement) {
            panelElement.style.display = 'flex';
            panelElement.style.zIndex = Z_INDEX_BASE; // Garantir que fique no topo
            isPanelVisible = true;
            Utils.log('info', 'Painel existente reexibido.');
            return panelElement;
        }

        Utils.log('info', 'Criando novo painel...');

        const posLeft = 30;
        const posTop = 80;

        panelElement = document.createElement('div');
        panelElement.id = PANEL_ID;
        
        // Configurar estilos inline completos
        const panelStyle = {
            position: 'fixed',
            top: posTop + 'px',
            left: posLeft + 'px',
            width: '520px',
            height: '550px',
            background: 'linear-gradient(145deg, #0a1929, #0f2744)',
            border: '3px solid #ff6b6b', // Borda vermelha para destacar
            borderRadius: '12px',
            boxShadow: '0 20px 60px rgba(255, 107, 107, 0.5)',
            zIndex: Z_INDEX_BASE, // MAIS ALTO que qualquer outro
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            fontFamily: "'Consolas', 'Monaco', monospace",
            fontSize: '12px',
            color: '#e0e0e0',
            resize: 'both',
            userSelect: 'text',
            opacity: '1'
        };

        Object.assign(panelElement.style, panelStyle);

        panelElement.innerHTML = `
            <!-- Cabeçalho Arrastável -->
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
                    <span style="color: #ff6b6b; font-weight: bold; font-size: 14px;">🔬 DIAGNÓSTICO v5.9.2</span>
                    <span style="background: #2e3b4e; color: #ffaaaa; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${MODULE_NAME}</span>
                </div>
                <div>
                    <button id="${PANEL_ID}-minimize" style="background: #37474f; border: none; color: white; width: 26px; height: 26px; border-radius: 4px; cursor: pointer; margin-right: 5px; font-weight: bold;">−</button>
                    <button id="${PANEL_ID}-close" style="background: #d32f2f; border: none; color: white; width: 26px; height: 26px; border-radius: 4px; cursor: pointer; font-weight: bold;">×</button>
                </div>
            </div>

            <!-- Corpo do Painel -->
            <div id="${PANEL_ID}-content" style="
                flex: 1;
                padding: 15px;
                overflow-y: auto;
                background: #0f2744;
                display: flex;
                flex-direction: column;
                gap: 15px;
            ">
                <div style="color: #ffaaaa; border-bottom: 1px solid #1e3a5f; padding-bottom: 5px; font-weight: bold;">📋 RESULTADOS DA VALIDAÇÃO DE INTEGRIDADE</div>
                <div id="${PANEL_ID}-results"></div>
                <div style="margin-top: auto; padding-top: 10px;">
                    <button id="${PANEL_ID}-rerun" style="
                        background: #2e7d32;
                        color: white;
                        border: none;
                        padding: 10px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        width: 100%;
                        font-weight: bold;
                        transition: all 0.3s;
                        font-size: 13px;
                    ">🔄 RE-EXECUTAR TESTES</button>
                </div>
            </div>

            <!-- Rodapé -->
            <div style="
                background: #1e3a5f;
                padding: 8px 15px;
                border-top: 2px solid #ff6b6b;
                font-size: 11px;
                color: #ffaaaa;
                display: flex;
                justify-content: space-between;
            ">
                <span>Clique no cabeçalho para arrastar | Z-Index: ${Z_INDEX_BASE}</span>
                <span id="${PANEL_ID}-timestamp">${new Date().toLocaleTimeString()}</span>
            </div>
        `;

        document.body.appendChild(panelElement);

        // Tornar arrastável
        const header = document.getElementById(`${PANEL_ID}-header`);
        if (header) {
            Utils.createDraggable(panelElement, header);
        }

        // Event Listeners
        document.getElementById(`${PANEL_ID}-close`).addEventListener('click', () => {
            panelElement.style.display = 'none';
            isPanelVisible = false;
            Utils.log('info', 'Painel fechado.');
        });

        document.getElementById(`${PANEL_ID}-minimize`).addEventListener('click', () => {
            const content = document.getElementById(`${PANEL_ID}-content`);
            if (content) {
                content.style.display = content.style.display === 'none' ? 'flex' : 'none';
            }
        });

        document.getElementById(`${PANEL_ID}-rerun`).addEventListener('click', () => {
            runAllTestsAndDisplay();
        });

        isPanelVisible = true;
        Utils.log('success', '✅ Painel criado com z-index ' + Z_INDEX_BASE + ' (acima de todos)');
        return panelElement;
    }

    // --- Função para executar todos os testes e exibir no painel ---
    function runAllTestsAndDisplay() {
        Utils.log('info', 'Executando todos os testes de integridade...');
        const resultsContainer = document.getElementById(`${PANEL_ID}-results`);
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '<div style="text-align: center; color: #bbb; padding: 20px;">Executando testes, aguarde...</div>';

        setTimeout(() => {
            const testResults = [
                { name: 'Integridade das Propriedades', result: Tests.checkPropertiesIntegrity() },
                { name: 'Funções Críticas', result: Tests.checkCriticalFunctions() },
                { name: 'Estado da Interface', result: Tests.checkUIState() },
                { name: 'Sistemas de Mídia/PDF', result: Tests.checkMediaPdfSystems() }
            ];

            let html = '';
            let allPassed = true;

            testResults.forEach(test => {
                const statusIcon = test.result.status === 'success' ? '✅' : (test.result.status === 'warning' ? '⚠️' : '❌');
                const statusColor = test.result.status === 'success' ? '#2ecc71' : (test.result.status === 'warning' ? '#f39c12' : '#e74c3c');
                if (test.result.status !== 'success') allPassed = false;

                html += `
                    <div style="background: #1e3a5f; border-radius: 6px; padding: 12px; margin-bottom: 12px; border-left: 4px solid ${statusColor};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #bbb; font-size: 13px;">${statusIcon} ${test.name}</span>
                            <span style="color: ${statusColor}; font-size: 12px; font-weight: bold;">${test.result.status.toUpperCase()}</span>
                        </div>
                        ${test.result.issues && test.result.issues.length > 0 ? 
                            `<div style="font-size: 11px; color: #ffcdd2; background: #2a2a2a; padding: 8px; border-radius: 4px; max-height: 120px; overflow-y: auto; border: 1px solid ${statusColor};">
                                ${test.result.issues.map(issue => `• ${issue}`).join('<br>')}
                            </div>` : 
                            `<div style="font-size: 12px; color: #a5d6a7; padding: 5px 0;">✅ Nenhum problema detectado.</div>`
                        }
                    </div>
                `;
            });

            html += `
                <div style="margin-top: 15px; padding: 12px; background: #1a1a2e; border-radius: 6px; text-align: center; border: 2px solid ${allPassed ? '#2ecc71' : '#e74c3c'};">
                    <span style="font-weight: bold; font-size: 14px; color: ${allPassed ? '#2ecc71' : '#e74c3c'};">
                        ${allPassed ? '✅ SISTEMA ÍNTEGRO - NENHUM PROBLEMA CRÍTICO' : '⚠️ PROBLEMAS DETECTADOS - VERIFICAR ACIMA'}
                    </span>
                </div>
            `;

            resultsContainer.innerHTML = html;
            document.getElementById(`${PANEL_ID}-timestamp`).textContent = new Date().toLocaleTimeString();
            Utils.log('success', 'Testes concluídos e exibidos no painel.');
        }, 100);
    }

    // --- Botão de Controle Flutuante ---
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
                transition: all 0.3s;
                font-weight: bold;
                border: 2px solid white;
            " title="Diagnóstico v5.9.2 (Clique para abrir)">🔬</button>
        `;
        document.body.appendChild(btn);

        btn.querySelector('button').addEventListener('click', () => {
            if (!isPanelVisible || !panelElement) {
                const panel = createPanel();
                runAllTestsAndDisplay();
                // Garantir que o painel fique visível e no topo
                setTimeout(() => {
                    if (panel) {
                        panel.style.zIndex = Z_INDEX_BASE;
                        panel.style.display = 'flex';
                    }
                }, 50);
            } else {
                panelElement.style.display = 'flex';
                panelElement.style.zIndex = Z_INDEX_BASE;
                isPanelVisible = true;
            }
        });

        Utils.log('info', 'Botão de controle (🔬) criado no canto inferior esquerdo.');
    }

    // --- Forçar todos os outros painéis a ficarem atrás (se necessário) ---
    function forceThisPanelOnTop() {
        if (!panelElement) return;
        
        // Garantir que este painel tenha o maior z-index
        panelElement.style.zIndex = Z_INDEX_BASE;
        
        // Encontrar todos os outros painéis de diagnóstico e colocá-los atrás
        const allDiagnosticPanels = document.querySelectorAll('[id^="diagnostics"], [class*="diagnostics"], .diagnostics-panel, [id*="diagnostic"]');
        allDiagnosticPanels.forEach(panel => {
            if (panel.id !== PANEL_ID) {
                panel.style.zIndex = (Z_INDEX_BASE - 10).toString();
            }
        });
        
        Utils.log('info', `Painel forçado para frente. Z-index atual: ${panelElement.style.zIndex}`);
    }

    // --- Inicialização ---
    function init() {
        Utils.log('info', 'Inicializando módulo...');

        // Registrar no sistema de diagnóstico global
        if (window.Diagnostics && typeof window.Diagnostics.registerModule === 'function') {
            window.Diagnostics.registerModule(MODULE_ID, {
                name: MODULE_NAME,
                runTests: () => {
                    return {
                        propertiesIntegrity: Tests.checkPropertiesIntegrity(),
                        criticalFunctions: Tests.checkCriticalFunctions(),
                        uiState: Tests.checkUIState(),
                        mediaPdfSystems: Tests.checkMediaPdfSystems()
                    };
                }
            });
            Utils.log('success', 'Registrado no sistema Diagnostics global.');
        }

        // Criar botão de controle
        createControlButton();

        // Se a URL contiver 'diagnostics=true', abrir o painel automaticamente
        if (window.location.search.includes('diagnostics=true')) {
            setTimeout(() => {
                const panel = createPanel();
                runAllTestsAndDisplay();
                
                // Pequeno delay extra para garantir que o painel fique no topo
                setTimeout(() => {
                    forceThisPanelOnTop();
                }, 500);
            }, 2000);
        }

        // Expor testes para console
        window.Tests59 = Tests;
        
        // Adicionar função de emergência para trazer painel para frente
        window.bringDiagnostics59ToFront = function() {
            if (panelElement) {
                panelElement.style.zIndex = Z_INDEX_BASE;
                panelElement.style.display = 'flex';
                Utils.log('success', 'Painel trazido para frente!');
                forceThisPanelOnTop();
            } else {
                createPanel();
                runAllTestsAndDisplay();
            }
        };
        
        Utils.log('info', 'Para trazer este painel para frente: window.bringDiagnostics59ToFront()');
    }

    // Iniciar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

console.log(`🔬 [DIAGNOSTICS59] Carregamento concluído. Use o botão 🔬 no canto inferior esquerdo.`);
console.log(`🔬 [DIAGNOSTICS59] Se o painel ficar atrás, execute: window.bringDiagnostics59ToFront()`);
