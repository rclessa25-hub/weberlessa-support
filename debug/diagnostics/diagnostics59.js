// ================== debug/diagnostics/diagnostics59.js ==================
// DIAGNÓSTICO DO SISTEMA - MÓDULO DE VALIDAÇÃO DE INTEGRIDADE (v5.9.1)
// CADEIA DE DIAGNÓSTICO: 53 (Base) -> 54 -> 55 -> 56 -> 57 -> 58 -> 59 (Atual) -> 60 -> 61
// Finalidade: Validar a integridade dos dados, funções e estado do sistema Core.
// Carregado via: https://rclessa25-hub.github.io/imoveis-maceio/?debug=true&diagnostics=true
// Modificação: Garantida a coexistência pacífica com outros painéis da cadeia.
console.log(`🔬 [DIAGNOSTICS59] Carregando... (v5.9.1)`);

(function() {
    'use strict';

    // --- Configuração do Módulo ---
    const MODULE_ID = 'diagnostics59';
    const MODULE_NAME = 'Validação de Integridade (v5.9.1)';
    const PANEL_ID = 'diagnostics59-panel';
    const CONTROL_BTN_ID = 'diag59-control-btn';
    let isPanelVisible = false;
    let panelElement = null;

    // --- Verificação de Ambiente e Prevenção de Dupla Inicialização ---
    if (window[`__${MODULE_ID}_LOADED`]) {
        console.log(`🔬 [DIAGNOSTICS59] Módulo já carregado. Ignorando.`);
        return;
    }
    window[`__${MODULE_ID}_LOADED`] = true;

    // --- Utilitários Internos (Evitam poluir o escopo global) ---
    const Utils = {
        log: function(level, ...args) {
            const prefix = `%c[DIAGNOSTICS59]`;
            const styles = {
                info: 'color: #3498db; font-weight: bold;',
                success: 'color: #2ecc71; font-weight: bold;',
                warn: 'color: #f39c12; font-weight: bold;',
                error: 'color: #e74c3c; font-weight: bold;',
                test: 'color: #9b59b6; font-weight: bold;'
            };
            console[level === 'test' ? 'log' : level](`${prefix}`, styles[level] || styles.info, ...args);
        },
        createDraggable: function(element, handle) {
            let isDragging = false;
            let offsetX, offsetY;

            handle.style.cursor = 'grab';
            handle.addEventListener('mousedown', (e) => {
                if (e.target.tagName === 'BUTTON') return;
                isDragging = true;
                offsetX = e.clientX - element.getBoundingClientRect().left;
                offsetY = e.clientY - element.getBoundingClientRect().top;
                handle.style.cursor = 'grabbing';

                const onMouseMove = (e) => {
                    if (!isDragging) return;
                    const x = e.clientX - offsetX;
                    const y = e.clientY - offsetY;
                    element.style.left = `${Math.max(10, Math.min(x, window.innerWidth - element.offsetWidth - 10))}px`;
                    element.style.top = `${Math.max(10, Math.min(y, window.innerHeight - element.offsetHeight - 10))}px`;
                };

                const onMouseUp = () => {
                    isDragging = false;
                    handle.style.cursor = 'grab';
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
                e.preventDefault();
            });
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
                const fnPath = fnName.split('.'); // Para objetos aninhados como PdfSystem.showModal
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

        // Teste 3: Validar Estado da UI (Filtros, Container de Propriedades)
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

         // Teste 4: Verificar Sistema de Mídia e PDF
        checkMediaPdfSystems: function() {
            Utils.log('test', '🧪 Executando: Verificação dos Sistemas de Mídia e PDF...');
            const issues = [];
            let status = 'success';

            // MediaSystem
            if (!window.MediaSystem) {
                issues.push('❌ MediaSystem não disponível.');
                status = 'error';
            } else {
                Utils.log('info', `✅ MediaSystem disponível.`);
                if (typeof window.MediaSystem.state !== 'object') {
                    issues.push('⚠️ MediaSystem.state não é um objeto.');
                }
            }

            // PdfSystem
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

            // SharedCore (funções de formatação)
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

    // --- Criação do Painel Flutuante (com posicionamento único) ---
    function createPanel() {
        // Se o painel já existe, apenas o mostra e traz para frente
        if (panelElement) {
            panelElement.style.display = 'flex';
            panelElement.style.zIndex = '10000'; // Garantir que fique acima
            isPanelVisible = true;
            Utils.log('info', 'Painel existente reexibido.');
            return panelElement;
        }

        Utils.log('info', 'Criando novo painel...');

        // Calcular posição única para este painel (canto inferior esquerdo)
        const posLeft = 20;
        const posTop = window.innerHeight - 500 - 20; // 500px de altura + margem

        panelElement = document.createElement('div');
        panelElement.id = PANEL_ID;
        panelElement.innerHTML = `
            <div style="
                position: fixed;
                top: ${posTop}px;
                left: ${posLeft}px;
                width: 480px;
                height: 500px;
                background: linear-gradient(145deg, #0a1929, #0f2744);
                border: 2px solid #64b5f6;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(100, 181, 246, 0.3);
                z-index: 9999;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                font-family: 'Consolas', 'Monaco', monospace;
                font-size: 12px;
                color: #e0e0e0;
                resize: both;
                user-select: text;
                opacity: 0.98;
            ">
                <!-- Cabeçalho Arrastável -->
                <div id="${PANEL_ID}-header" style="
                    background: #1e3a5f;
                    padding: 10px 15px;
                    border-bottom: 1px solid #64b5f6;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: grab;
                ">
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span style="color: #64b5f6; font-weight: bold;">🔬 DIAGNÓSTICO v5.9.1</span>
                        <span style="background: #2e3b4e; color: #b0bec5; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${MODULE_NAME}</span>
                    </div>
                    <div>
                        <button id="${PANEL_ID}-minimize" style="background: #37474f; border: none; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; margin-right: 5px;">−</button>
                        <button id="${PANEL_ID}-close" style="background: #d32f2f; border: none; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer;">×</button>
                    </div>
                </div>

                <!-- Corpo do Painel com Resultados -->
                <div id="${PANEL_ID}-content" style="
                    flex: 1;
                    padding: 15px;
                    overflow-y: auto;
                    background: #0f2744;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                ">
                    <div style="color: #90caf9; border-bottom: 1px solid #1e3a5f; padding-bottom: 5px;">📋 RESULTADOS DA VALIDAÇÃO DE INTEGRIDADE</div>
                    <div id="${PANEL_ID}-results"></div>
                    <div style="margin-top: auto; padding-top: 10px;">
                        <button id="${PANEL_ID}-rerun" style="
                            background: #2e7d32;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            border-radius: 4px;
                            cursor: pointer;
                            width: 100%;
                            font-weight: bold;
                            transition: all 0.3s;
                        ">🔄 RE-EXECUTAR TESTES</button>
                    </div>
                </div>

                <!-- Rodapé -->
                <div style="
                    background: #1e3a5f;
                    padding: 6px 15px;
                    border-top: 1px solid #64b5f6;
                    font-size: 10px;
                    color: #90caf9;
                    display: flex;
                    justify-content: space-between;
                ">
                    <span>Clique no cabeçalho para arrastar</span>
                    <span id="${PANEL_ID}-timestamp">${new Date().toLocaleTimeString()}</span>
                </div>
            </div>
        `;

        document.body.appendChild(panelElement);

        // Tornar arrastável
        const header = document.getElementById(`${PANEL_ID}-header`);
        if (header) {
            Utils.createDraggable(panelElement.querySelector('div'), header); // O elemento raiz é o primeiro div
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
        Utils.log('success', 'Painel criado e posicionado no canto inferior esquerdo.');
        return panelElement;
    }

    // --- Função para executar todos os testes e exibir no painel ---
    function runAllTestsAndDisplay() {
        Utils.log('info', 'Executando todos os testes de integridade...');
        const resultsContainer = document.getElementById(`${PANEL_ID}-results`);
        if (!resultsContainer) return;

        resultsContainer.innerHTML = '<div style="text-align: center; color: #bbb;">Executando testes, aguarde...</div>';

        // Usar setTimeout para não travar a UI
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
                    <div style="background: #1e3a5f; border-radius: 6px; padding: 10px; margin-bottom: 10px; border-left: 4px solid ${statusColor};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: bold; color: #bbb;">${statusIcon} ${test.name}</span>
                            <span style="color: ${statusColor}; font-size: 11px;">${test.result.status.toUpperCase()}</span>
                        </div>
                        ${test.result.issues && test.result.issues.length > 0 ? 
                            `<div style="font-size: 11px; color: #ffcdd2; background: #2a2a2a; padding: 6px; border-radius: 4px; max-height: 100px; overflow-y: auto;">
                                ${test.result.issues.map(issue => `• ${issue}`).join('<br>')}
                            </div>` : 
                            `<div style="font-size: 11px; color: #a5d6a7;">✅ Nenhum problema detectado.</div>`
                        }
                    </div>
                `;
            });

            html += `
                <div style="margin-top: 15px; padding: 10px; background: #1a1a2e; border-radius: 6px; text-align: center; border: 1px solid ${allPassed ? '#2ecc71' : '#e74c3c'};">
                    <span style="font-weight: bold; color: ${allPassed ? '#2ecc71' : '#e74c3c'};">
                        ${allPassed ? '✅ SISTEMA ÍNTEGRO' : '⚠️ PROBLEMAS DETECTADOS'}
                    </span>
                </div>
            `;

            resultsContainer.innerHTML = html;
            document.getElementById(`${PANEL_ID}-timestamp`).textContent = new Date().toLocaleTimeString();
            Utils.log('success', 'Testes concluídos e exibidos no painel.');
        }, 100);
    }

    // --- Botão de Controle Flutuante (para reabrir o painel) ---
    function createControlButton() {
        if (document.getElementById(CONTROL_BTN_ID)) return;

        const btn = document.createElement('div');
        btn.id = CONTROL_BTN_ID;
        btn.innerHTML = `
            <button style="
                position: fixed;
                bottom: 20px;
                left: 20px;
                background: linear-gradient(135deg, #64b5f6, #1e3a5f);
                color: white;
                border: none;
                border-radius: 50%;
                width: 55px;
                height: 55px;
                font-size: 24px;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(100, 181, 246, 0.5);
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s;
            " title="Diagnóstico v5.9.1">🔬</button>
        `;
        document.body.appendChild(btn);

        btn.querySelector('button').addEventListener('click', () => {
            if (!isPanelVisible || !panelElement) {
                createPanel();
                runAllTestsAndDisplay();
            } else {
                panelElement.style.display = 'flex';
                panelElement.style.zIndex = '10000';
                isPanelVisible = true;
            }
        });

        Utils.log('info', 'Botão de controle (🔬) criado no canto inferior esquerdo.');
    }

    // --- Inicialização ---
    function init() {
        Utils.log('info', 'Inicializando módulo...');

        // Registrar no sistema de diagnóstico global, se existir
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

        // Criar botão de controle imediatamente
        createControlButton();

        // Se a URL contiver 'diagnostics=true', abrir o painel automaticamente
        if (window.location.search.includes('diagnostics=true')) {
            setTimeout(() => {
                createPanel();
                runAllTestsAndDisplay();
            }, 1500); // Pequeno delay para garantir que o Core esteja carregado
        }

        // Executar testes no console também
        Utils.log('test', 'Testes disponíveis no objeto window.Tests59 para execução manual.');
        window.Tests59 = Tests; // Expor para console, se necessário
    }

    // Iniciar quando o DOM estiver pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

console.log(`🔬 [DIAGNOSTICS59] Carregamento concluído. Use o botão 🔬 no canto inferior esquerdo.`);
