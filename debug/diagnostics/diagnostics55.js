// ===== debug/diagnostics/diagnostics55.js =====
// MÓDULO DE DIAGNÓSTICO DO SISTEMA PDF - VERSÃO 5.5
// ARQUITETURA MODULAR: Totalmente refatorado para SRP e DIP.
// DEPENDÊNCIAS: Nenhuma. Opera exclusivamente sobre APIs do Core System (window.PdfSystem, window.MediaSystem, window.SUPABASE_CONSTANTS).
// COMPORTAMENTO: Ativado apenas via URL params (?debug=true&diagnostics=true). Silencioso em produção.
// INTEGRAÇÃO: Projetado para ser hospedado no repositório de suporte (weberlessa-support).
// AUTOR: Manutenção do Sistema Weber Lessa
// DATA DA ÚLTIMA ATUALIZAÇÃO: 2026-02-11

(function() {
    "use strict";

    // ========================================================================
    // 1. CONFIGURAÇÃO E ESTADO PRIVADO (ENCAPSULAMENTO)
    // ========================================================================
    const CONFIG = {
        DEBUG_MODE: window.location.search.includes('debug=true'),
        DIAGNOSTICS_MODE: window.location.search.includes('diagnostics=true'),
        VERSION: '5.5',
        MODULE_NAME: 'DiagnosticsPDF',
        SELECTORS: {
            pdfModal: '#pdfModal',
            pdfPassword: '#pdfPassword',
            pdfAccessBtn: '#pdfAccessBtn',
            pdfPasswordForm: '#pdfPasswordForm'
        }
    };

    // Estado interno do módulo (não polui o escopo global)
    const state = {
        isActive: CONFIG.DEBUG_MODE && CONFIG.DIAGNOSTICS_MODE,
        initialized: false,
        panelCreated: false
    };

    // ========================================================================
    // 2. UTILITÁRIOS PRIVADOS (FUNÇÕES PURAS)
    // ========================================================================
    const Utils = {
        /**
         * Aguarda um elemento DOM estar disponível.
         * @param {string} selector - Seletor CSS do elemento.
         * @returns {Promise<Element>}
         */
        waitForElement(selector) {
            return new Promise((resolve) => {
                if (document.querySelector(selector)) {
                    return resolve(document.querySelector(selector));
                }
                const observer = new MutationObserver(() => {
                    if (document.querySelector(selector)) {
                        observer.disconnect();
                        resolve(document.querySelector(selector));
                    }
                });
                observer.observe(document.body, { childList: true, subtree: true });
            });
        },

        /**
         * Cria um elemento com estilos inline e atributos.
         * @param {string} tag - Tag HTML.
         * @param {Object} attrs - Atributos e propriedades.
         * @param {Array} children - Nós filhos.
         * @returns {HTMLElement}
         */
        createElement(tag, attrs = {}, children = []) {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'style' && typeof value === 'object') {
                    Object.assign(el.style, value);
                } else if (key in el) {
                    el[key] = value;
                } else {
                    el.setAttribute(key, value);
                }
            });
            children.forEach(child => {
                if (typeof child === 'string') el.appendChild(document.createTextNode(child));
                else if (child instanceof Node) el.appendChild(child);
            });
            return el;
        },

        /**
         * Registra logs apenas se o módulo estiver ativo.
         * @param {string} level - 'log', 'warn', 'error', 'group', 'groupEnd'.
         * @param  {...any} args - Argumentos para o console.
         */
        log(level = 'log', ...args) {
            if (!state.isActive) return;
            const prefix = `🔧 [${CONFIG.MODULE_NAME} v${CONFIG.VERSION}]`;
            if (console[level]) {
                console[level](prefix, ...args);
            }
        },

        /**
         * Exibe uma notificação toast não intrusiva.
         * @param {string} message - Mensagem principal.
         * @param {string} type - 'success', 'error', 'info', 'warning'.
         * @param {number} duration - Duração em ms.
         */
        showToast(message, type = 'info', duration = 5000) {
            if (!state.isActive) return;
            const toast = Utils.createElement('div', {
                style: {
                    position: 'fixed',
                    bottom: '20px',
                    right: '20px',
                    background: type === 'success' ? '#00ff9c' : type === 'error' ? '#ff5555' : type === 'warning' ? '#ffaa00' : '#0088cc',
                    color: '#000',
                    padding: '12px 20px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 1000007,
                    fontFamily: 'monospace',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    border: '1px solid rgba(255,255,255,0.5)',
                    backdropFilter: 'blur(5px)'
                }
            }, [message]);
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), duration);
        }
    };

    // ========================================================================
    // 3. NÚCLEO DO DIAGNÓSTICO (RESPONSABILIDADE ÚNICA: VERIFICAR SISTEMA PDF)
    // ========================================================================
    const PdfDiagnostic = {
        /**
         * Verifica a integridade do sistema PDF (PdfSystem + DOM).
         * @returns {Object} Relatório detalhado.
         */
        verifyIntegrity() {
            Utils.log('group', '🔍 Verificação de Integridade do Sistema PDF');

            const report = {
                timestamp: new Date().toISOString(),
                version: CONFIG.VERSION,
                systems: {
                    pdfSystem: {
                        exists: !!window.PdfSystem,
                        type: typeof window.PdfSystem,
                        hasShowModal: typeof window.PdfSystem?.showModal === 'function',
                        hasInit: typeof window.PdfSystem?.init === 'function'
                    },
                    mediaSystem: {
                        exists: !!window.MediaSystem,
                        type: typeof window.MediaSystem,
                        hasAddPdfs: typeof window.MediaSystem?.addPdfs === 'function',
                        hasUploadAll: typeof window.MediaSystem?.uploadAll === 'function'
                    },
                    supabaseConstants: !!window.SUPABASE_CONSTANTS
                },
                dom: {
                    pdfModal: !!document.querySelector(CONFIG.SELECTORS.pdfModal),
                    pdfPassword: !!document.querySelector(CONFIG.SELECTORS.pdfPassword),
                    pdfPasswordForm: !!document.querySelector(CONFIG.SELECTORS.pdfPasswordForm),
                    pdfAccessBtn: !!document.querySelector(CONFIG.SELECTORS.pdfAccessBtn)
                },
                conflicts: [],
                recommendations: []
            };

            // Detecção de conflitos (ex: dois sistemas de PDF ativos)
            if (report.systems.pdfSystem.exists && report.systems.mediaSystem.exists) {
                if (typeof window.MediaSystem.addPdfs === 'function' && typeof window.PdfSystem.showModal === 'function') {
                    report.conflicts.push({
                        level: 'warning',
                        message: 'MediaSystem e PdfSystem coexistem. MediaSystem deve ser usado para uploads; PdfSystem apenas para visualização.'
                    });
                }
            }

            // Recomendações baseadas no DOM
            if (!report.dom.pdfModal) {
                report.recommendations.push('Modal PDF (#pdfModal) não encontrado no DOM.');
            } else {
                const modal = document.querySelector(CONFIG.SELECTORS.pdfModal);
                const isVisible = modal && (modal.style.display !== 'none' && window.getComputedStyle(modal).display !== 'none');
                if (!isVisible) {
                    report.recommendations.push('Modal PDF existe mas está oculto (normal em produção).');
                }
            }

            if (!report.dom.pdfPassword) {
                report.recommendations.push('Campo de senha PDF (#pdfPassword) não encontrado.');
            }

            if (!report.dom.pdfPasswordForm) {
                report.recommendations.push('Formulário de senha (#pdfPasswordForm) não encontrado. Isso pode causar avisos no console.');
            }

            Utils.log('log', 'Relatório de Integridade:', report);
            Utils.log('groupEnd');

            return report;
        },

        /**
         * Testa a funcionalidade de abertura do modal e visibilidade do campo de senha.
         * @param {number|string} propertyId - ID do imóvel para teste.
         * @returns {Promise<Object>} Resultado do teste.
         */
        async testModalVisibility(propertyId = null) {
            Utils.log('group', '🧪 Teste de Visibilidade do Modal PDF');

            // 1. Selecionar um ID de imóvel válido
            let testId = propertyId;
            if (!testId) {
                if (window.properties && window.properties.length > 0) {
                    testId = window.properties[0].id;
                } else {
                    testId = 101; // Fallback
                }
            }

            const result = {
                propertyId: testId,
                modalOpened: false,
                passwordFieldVisible: false,
                modalElement: null,
                passwordElement: null,
                errors: []
            };

            // 2. Verificar se PdfSystem existe
            if (!window.PdfSystem || typeof window.PdfSystem.showModal !== 'function') {
                result.errors.push('PdfSystem.showModal não está disponível.');
                Utils.log('error', '❌ PdfSystem.showModal não disponível');
                Utils.log('groupEnd');
                return result;
            }

            // 3. Tentar abrir o modal
            try {
                Utils.log('log', `📄 Tentando abrir modal para o imóvel ID: ${testId}`);
                window.PdfSystem.showModal(testId);
                result.modalOpened = true;
                Utils.log('log', '✅ showModal executado com sucesso');
            } catch (e) {
                result.errors.push(`Exceção ao chamar showModal: ${e.message}`);
                Utils.log('error', '❌ Exceção em showModal:', e);
                Utils.log('groupEnd');
                return result;
            }

            // 4. Aguardar o modal aparecer e verificar campo de senha
            await new Promise(resolve => setTimeout(resolve, 500));

            result.modalElement = document.querySelector(CONFIG.SELECTORS.pdfModal);
            result.passwordElement = document.querySelector(CONFIG.SELECTORS.pdfPassword);

            if (result.modalElement) {
                const modalDisplay = window.getComputedStyle(result.modalElement).display;
                result.modalOpened = modalDisplay !== 'none';
                Utils.log('log', `📱 Modal exibido: ${result.modalOpened ? 'SIM' : 'NÃO'} (display: ${modalDisplay})`);
            } else {
                result.errors.push('Modal (#pdfModal) não encontrado no DOM após showModal.');
            }

            if (result.passwordElement) {
                const passwordDisplay = window.getComputedStyle(result.passwordElement).display;
                const passwordVisibility = window.getComputedStyle(result.passwordElement).visibility;
                result.passwordFieldVisible = passwordDisplay !== 'none' && passwordVisibility !== 'hidden';
                Utils.log('log', `🔑 Campo de senha visível: ${result.passwordFieldVisible ? 'SIM' : 'NÃO'}`);
            } else {
                result.errors.push('Campo de senha (#pdfPassword) não encontrado.');
            }

            Utils.log('groupEnd');
            return result;
        },

        /**
         * Gera um relatório consolidado e o exibe no painel de diagnóstico.
         */
        async generateFullReport() {
            Utils.log('group', '📊 GERANDO RELATÓRIO COMPLETO DO SISTEMA PDF');

            const integrity = this.verifyIntegrity();
            const visibility = await this.testModalVisibility();

            const report = {
                ...integrity,
                visibilityTest: visibility,
                summary: {
                    status: integrity.systems.pdfSystem.hasShowModal && visibility.modalOpened && visibility.passwordFieldVisible ? 'OPERACIONAL' : 'COM FALHAS',
                    criticalIssues: integrity.conflicts.filter(c => c.level === 'error').length + visibility.errors.length,
                    warnings: integrity.conflicts.filter(c => c.level === 'warning').length,
                    timestamp: new Date().toLocaleString()
                }
            };

            Utils.log('log', '✅ Relatório Consolidado:', report);
            Utils.log('groupEnd');

            return report;
        }
    };

    // ========================================================================
    // 4. INTERFACE DE USUÁRIO (PAINEL DE DIAGNÓSTICO)
    // ========================================================================
    const UIManager = {
        /**
         * Cria ou atualiza o painel de diagnóstico flutuante.
         */
        async createDiagnosticPanel() {
            if (!state.isActive || state.panelCreated) return;

            const panelId = 'diagnostics-pdf-panel-v55';
            let panel = document.getElementById(panelId);
            if (panel) {
                panel.remove();
            }

            // Aguardar o relatório ser gerado
            const report = await PdfDiagnostic.generateFullReport();

            // Container principal
            panel = Utils.createElement('div', {
                id: panelId,
                style: {
                    position: 'fixed',
                    top: '20px',
                    left: '20px',
                    maxWidth: '400px',
                    width: 'calc(100% - 40px)',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    background: 'rgba(10, 10, 20, 0.95)',
                    backdropFilter: 'blur(10px)',
                    color: '#00ff9c',
                    fontFamily: '"Courier New", monospace',
                    fontSize: '12px',
                    padding: '20px',
                    borderRadius: '12px',
                    border: `2px solid ${report.summary.status === 'OPERACIONAL' ? '#00ff9c' : '#ff5555'}`,
                    boxShadow: '0 0 30px rgba(0, 255, 156, 0.2)',
                    zIndex: 1000000,
                    lineHeight: '1.5'
                }
            });

            // Cabeçalho
            panel.appendChild(Utils.createElement('div', {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '15px',
                    borderBottom: '1px solid #333',
                    paddingBottom: '10px'
                }
            }, [
                Utils.createElement('span', { style: { fontSize: '16px', fontWeight: 'bold' } }, [
                    `📋 DIAGNÓSTICO PDF v${CONFIG.VERSION}`
                ]),
                Utils.createElement('button', {
                    onclick: () => panel.remove(),
                    style: {
                        background: 'transparent',
                        border: '1px solid #ff5555',
                        color: '#ff5555',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        padding: '2px 8px',
                        fontSize: '14px'
                    }
                }, ['✕'])
            ]));

            // Status geral
            panel.appendChild(Utils.createElement('div', {
                style: {
                    background: report.summary.status === 'OPERACIONAL' ? 'rgba(0, 255, 156, 0.1)' : 'rgba(255, 85, 85, 0.1)',
                    padding: '10px',
                    borderRadius: '6px',
                    marginBottom: '15px',
                    border: `1px solid ${report.summary.status === 'OPERACIONAL' ? '#00ff9c' : '#ff5555'}`
                }
            }, [
                Utils.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, [
                    Utils.createElement('span', { style: { fontSize: '20px' } }, [report.summary.status === 'OPERACIONAL' ? '✅' : '⚠️']),
                    Utils.createElement('span', { style: { fontWeight: 'bold' } }, [`SISTEMA: ${report.summary.status}`])
                ]),
                Utils.createElement('div', { style: { marginTop: '5px', color: '#aaa', fontSize: '11px' } }, [
                    `Críticos: ${report.summary.criticalIssues} | Alertas: ${report.summary.warnings}`
                ])
            ]));

            // Seção: Sistemas
            panel.appendChild(Utils.createElement('div', { style: { marginBottom: '15px' } }, [
                Utils.createElement('div', { style: { fontWeight: 'bold', color: '#88ffaa', marginBottom: '5px' } }, ['🔧 SISTEMAS']),
                Utils.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', background: '#1a1a1a', padding: '8px', borderRadius: '4px' } }, [
                    Utils.createElement('span', {}, ['PdfSystem:']),
                    Utils.createElement('span', { style: { color: report.systems.pdfSystem.hasShowModal ? '#00ff9c' : '#ff5555' } }, [
                        report.systems.pdfSystem.hasShowModal ? '✅' : '❌'
                    ]),
                    Utils.createElement('span', {}, ['MediaSystem:']),
                    Utils.createElement('span', { style: { color: report.systems.mediaSystem.hasAddPdfs ? '#00ff9c' : '#ff5555' } }, [
                        report.systems.mediaSystem.hasAddPdfs ? '✅' : '❌'
                    ]),
                    Utils.createElement('span', {}, ['Supabase:']),
                    Utils.createElement('span', { style: { color: report.systems.supabaseConstants ? '#00ff9c' : '#ff5555' } }, [
                        report.systems.supabaseConstants ? '✅' : '❌'
                    ])
                ])
            ]));

            // Seção: DOM Crítico
            panel.appendChild(Utils.createElement('div', { style: { marginBottom: '15px' } }, [
                Utils.createElement('div', { style: { fontWeight: 'bold', color: '#88ffaa', marginBottom: '5px' } }, ['🖥️ DOM']),
                Utils.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', background: '#1a1a1a', padding: '8px', borderRadius: '4px' } }, [
                    Utils.createElement('span', {}, ['Modal (#pdfModal):']),
                    Utils.createElement('span', { style: { color: report.dom.pdfModal ? '#00ff9c' : '#ff5555' } }, [
                        report.dom.pdfModal ? '✅' : '❌'
                    ]),
                    Utils.createElement('span', {}, ['Campo Senha:']),
                    Utils.createElement('span', { style: { color: report.dom.pdfPassword ? '#00ff9c' : '#ff5555' } }, [
                        report.dom.pdfPassword ? '✅' : '❌'
                    ]),
                    Utils.createElement('span', {}, ['Form (form):']),
                    Utils.createElement('span', { style: { color: report.dom.pdfPasswordForm ? '#00ff9c' : '#ff5555' } }, [
                        report.dom.pdfPasswordForm ? '✅' : '❌'
                    ])
                ])
            ]));

            // Seção: Último Teste de Visibilidade
            if (report.visibilityTest) {
                panel.appendChild(Utils.createElement('div', { style: { marginBottom: '15px' } }, [
                    Utils.createElement('div', { style: { fontWeight: 'bold', color: '#88ffaa', marginBottom: '5px' } }, ['🧪 TESTE MODAL']),
                    Utils.createElement('div', { style: { background: '#1a1a1a', padding: '8px', borderRadius: '4px' } }, [
                        Utils.createElement('div', {}, [`ID Testado: ${report.visibilityTest.propertyId}`]),
                        Utils.createElement('div', {}, [`Aberto: ${report.visibilityTest.modalOpened ? '✅' : '❌'}`]),
                        Utils.createElement('div', {}, [`Senha Visível: ${report.visibilityTest.passwordFieldVisible ? '✅' : '❌'}`]),
                        report.visibilityTest.errors.length > 0 ? Utils.createElement('div', { style: { color: '#ff5555', marginTop: '5px' } }, [
                            `Erros: ${report.visibilityTest.errors.join('; ')}`
                        ]) : null
                    ])
                ]));
            }

            // Seção: Recomendações
            if (report.recommendations.length > 0) {
                panel.appendChild(Utils.createElement('div', { style: { marginBottom: '15px' } }, [
                    Utils.createElement('div', { style: { fontWeight: 'bold', color: '#ffaa00', marginBottom: '5px' } }, ['💡 RECOMENDAÇÕES']),
                    Utils.createElement('div', { style: { background: '#1a1a1a', padding: '8px', borderRadius: '4px', color: '#ffaa00' } },
                        report.recommendations.map(rec => Utils.createElement('div', { style: { marginBottom: '3px' } }, [`• ${rec}`]))
                    )
                ]));
            }

            // Seção: Botões de Ação
            panel.appendChild(Utils.createElement('div', {
                style: {
                    display: 'flex',
                    gap: '10px',
                    marginTop: '15px',
                    borderTop: '1px solid #333',
                    paddingTop: '15px'
                }
            }, [
                Utils.createElement('button', {
                    onclick: async () => {
                        const newReport = await PdfDiagnostic.generateFullReport();
                        Utils.showToast('Relatório atualizado!', 'success');
                        this.createDiagnosticPanel(); // Recria o painel
                    },
                    style: {
                        flex: 1,
                        background: '#0088cc',
                        border: 'none',
                        color: 'white',
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }
                }, ['🔄 ATUALIZAR']),
                Utils.createElement('button', {
                    onclick: () => {
                        Utils.showToast('Teste de modal acionado! Verifique o console.', 'info');
                        PdfDiagnostic.testModalVisibility();
                    },
                    style: {
                        flex: 1,
                        background: '#00ff9c',
                        border: 'none',
                        color: '#000',
                        padding: '8px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }
                }, ['🧪 TESTAR MODAL'])
            ]));

            document.body.appendChild(panel);
            state.panelCreated = true;
            Utils.log('log', '✅ Painel de diagnóstico criado.');
        },

        /**
         * Adiciona botões de ação ao painel de diagnóstico principal (se existir).
         */
        integrateWithMainDiagnosticsPanel() {
            if (!state.isActive) return;

            // Tentar encontrar o painel principal (#diagnostics-panel-complete)
            const mainPanel = document.getElementById('diagnostics-panel-complete');
            if (!mainPanel) return;

            const buttonContainer = mainPanel.querySelector('div:nth-child(3)');
            if (!buttonContainer) return;

            if (!document.getElementById('verify-pdf-system-btn-v5-5')) {
                const verifyBtn = Utils.createElement('button', {
                    id: 'verify-pdf-system-btn-v5-5',
                    onclick: () => PdfDiagnostic.verifyIntegrity(),
                    style: 'background: linear-gradient(45deg, #ff00ff, #0088cc); color: white; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; font-weight: bold; flex: 1; margin: 5px;'
                }, ['🔍 VERIFICAÇÃO PDF v5.5']);
                buttonContainer.appendChild(verifyBtn);
            }

            if (!document.getElementById('test-pdf-bug-fix-btn-v5-5')) {
                const testBtn = Utils.createElement('button', {
                    id: 'test-pdf-bug-fix-btn-v5-5',
                    onclick: () => PdfDiagnostic.testModalVisibility(),
                    style: 'background: linear-gradient(45deg, #00ff9c, #0088cc); color: #000; border: none; padding: 8px 12px; cursor: pointer; border-radius: 4px; font-weight: bold; flex: 1; margin: 5px;'
                }, ['🧪 TESTE MODAL PDF v5.5']);
                buttonContainer.appendChild(testBtn);
            }

            Utils.log('log', '✅ Botões integrados ao painel principal de diagnóstico.');
        }
    };

    // ========================================================================
    // 5. API PÚBLICA (EXPOSTA GLOBALMENTE)
    // ========================================================================
    window.DiagnosticsV55 = {
        version: CONFIG.VERSION,
        isActive: () => state.isActive,
        runIntegrityCheck: PdfDiagnostic.verifyIntegrity.bind(PdfDiagnostic),
        testModal: PdfDiagnostic.testModalVisibility.bind(PdfDiagnostic),
        generateReport: PdfDiagnostic.generateFullReport.bind(PdfDiagnostic),
        showPanel: UIManager.createDiagnosticPanel.bind(UIManager),

        /**
         * Atalho para teste rápido via console.
         * @param {number|string} [propertyId] - ID do imóvel.
         */
        quickTest(propertyId) {
            Utils.log('log', '🚀 Executando Quick Test...');
            PdfDiagnostic.testModalVisibility(propertyId).then(result => {
                console.table({
                    'Modal Aberto': result.modalOpened ? '✅' : '❌',
                    'Senha Visível': result.passwordFieldVisible ? '✅' : '❌',
                    'Erros': result.errors.length || 'Nenhum'
                });
                Utils.showToast(`Teste concluído. Modal: ${result.modalOpened ? 'OK' : 'FALHOU'}`, result.modalOpened ? 'success' : 'error');
            });
        }
    };

    // ========================================================================
    // 6. INICIALIZAÇÃO AUTOMÁTICA (SOMENTE SE ATIVADO)
    // ========================================================================
    async function initialize() {
        if (state.initialized) return;
        state.initialized = true;

        if (!state.isActive) {
            Utils.log('log', 'ℹ️ Modo silencioso. Ative com ?debug=true&diagnostics=true na URL.');
            return;
        }

        Utils.log('log', `🚀 Inicializando módulo de diagnóstico PDF v${CONFIG.VERSION}...`);

        // Aguardar o DOM e sistemas estarem prontos
        if (document.readyState === 'loading') {
            await new Promise(resolve => document.addEventListener('DOMContentLoaded', resolve));
        }

        // Pequeno delay para garantir que todos os módulos do core carregaram
        setTimeout(async () => {
            // 1. Executar verificação de integridade silenciosa
            const report = await PdfDiagnostic.generateFullReport();

            // 2. Criar painel flutuante
            await UIManager.createDiagnosticPanel();

            // 3. Integrar com painel principal (se existir)
            UIManager.integrateWithMainDiagnosticsPanel();

            // 4. Exibir notificação de boas-vindas
            Utils.showToast(
                `Diagnóstico PDF v${CONFIG.VERSION} ativo. Status: ${report.summary.status}`,
                report.summary.status === 'OPERACIONAL' ? 'success' : 'warning',
                7000
            );

            Utils.log('log', '✅ Módulo de diagnóstico inicializado. Use window.DiagnosticsV55 para acesso programático.');
        }, 2000);
    }

    // Iniciar
    initialize();

    // ========================================================================
    // 7. FALLBACK DE SEGURANÇA (NUNCA QUEBRA O CORE)
    // ========================================================================
    // Garantir que, mesmo em caso de erro catastrófico, o site principal não seja afetado.
    window.addEventListener('error', (e) => {
        if (e.filename && e.filename.includes('diagnostics55.js')) {
            console.warn('🔧 [Diagnostics55] Erro capturado no módulo de diagnóstico. O módulo será desativado para esta sessão para não afetar o sistema principal.', e.error);
            state.isActive = false;
            state.initialized = true; // Impede novas tentativas
            e.stopImmediatePropagation();
            return true;
        }
    }, true); // Captura na fase de captura

})();

// ===== FIM DO MÓDULO diagnostics55.js =====
console.log('✅ diagnostics55.js (v5.5) carregado e encapsulado. Ativo apenas com ?debug=true&diagnostics=true');
