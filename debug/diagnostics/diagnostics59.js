// ============================================================
// diagnostics59.js - SISTEMA DE DIAGNÓSTICO DO CORE (v5.9.1)
// ============================================================
// Repositório: Support System (weberlessa-support)
// Dependência: Core System (imoveis-maceio)
// Princípios: SRP, DIP, LSP, OCP, ISP
// Ativação: https://.../?debug=true&diagnostics=true
// ============================================================
console.log('🔍 [Diagnostics v5.9.1] Carregado. Modo: Diagnóstico Avançado.');

const DiagnosticsV5 = (function() {
    'use strict';

    // ==================== CONFIGURAÇÕES ====================
    const CONFIG = {
        version: '5.9.1',
        panelId: 'diagnostics-panel-v5',
        storageKey: 'properties',
        criticalModules: [
            'SharedCore', 'MediaSystem', 'PdfSystem', 'FilterManager',
            'LoadingManager', 'supabaseClient', 'propertyTemplates'
        ],
        criticalFunctions: [
            'loadPropertiesData', 'renderProperties', 'savePropertiesToStorage',
            'addNewProperty', 'updateProperty', 'toggleAdminPanel'
        ],
        debugMode: window.location.search.includes('debug=true'),
        diagnosticsMode: window.location.search.includes('diagnostics=true')
    };

    // ==================== ESTADO INTERNO ====================
    const state = {
        results: {},
        systemStatus: 'idle',
        panelInstance: null,
        initialized: false
    };

    // ==================== UTILITÁRIOS PRIVADOS ====================
    const formatTime = (ms) => `${ms.toFixed(2)}ms`;
    const safeString = (obj) => obj ? obj.toString().substring(0, 50) : 'N/A';

    /**
     * Coletor de métricas com timeout de segurança.
     * @param {Function} fn - Função assíncrona a ser medida.
     * @param {string} name - Nome do teste.
     */
    async function measureAsync(fn, name) {
        const start = performance.now();
        let status = 'success', error = null, data = null;
        try {
            data = await Promise.race([
                fn(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);
        } catch (e) {
            status = 'error';
            error = e.message;
        }
        const duration = performance.now() - start;
        return { name, status, duration, error, data: data ?? null };
    }

    // ==================== TESTES DE INTEGRIDADE ====================
    const tests = {
        /**
         * ✅ VERIFICAÇÃO DA ARQUITETURA DE DOIS REPOSITÓRIOS
         * Confirma que o Core não depende do Support.
         */
        async repositoryArchitecture() {
            const coreScripts = Array.from(document.scripts).map(s => s.src);
            const supportBaseUrl = 'https://rclessa25-hub.github.io/weberlessa-support/';
            const hasDirectSupportDependency = coreScripts.some(src => src.includes(supportBaseUrl) && !src.includes('?debug=true'));
            
            return {
                status: !hasDirectSupportDependency ? 'success' : 'error',
                message: !hasDirectSupportDependency 
                    ? '✅ Arquitetura limpa: Core não depende diretamente do Support.' 
                    : '❌ Acoplamento detectado: Core carrega Support sem flag debug.',
                details: { coreScriptsCount: coreScripts.length }
            };
        },

        /**
         * ✅ VERIFICAÇÃO DOS PRINCÍPIOS SOLID
         * Avalia SRP, DIP e ISP dos módulos principais.
         */
        async solidPrinciples() {
            const modules = CONFIG.criticalModules.map(name => window[name]).filter(Boolean);
            const evaluations = {
                srp: modules.every(mod => mod && typeof mod === 'object' && !Array.isArray(mod)),
                dip: !window.location.search.includes('weberlessa-support') || CONFIG.diagnosticsMode,
                isp: modules.every(mod => Object.keys(mod).length < 20) // Heurística simples
            };
            const score = Object.values(evaluations).filter(Boolean).length;
            return {
                status: score === 3 ? 'success' : score >= 2 ? 'warning' : 'error',
                message: `📐 Princípios SOLID: ${score}/3 (SRP/DIP/ISP)`,
                details: evaluations
            };
        },

        /**
         * ✅ TESTE DO SISTEMA DE MÍDIA UNIFICADO
         * Valida MediaSystem e PdfSystem.
         */
        async unifiedMediaSystem() {
            const mediaSystem = window.MediaSystem;
            const pdfSystem = window.PdfSystem;
            if (!mediaSystem || !pdfSystem) {
                return { status: 'error', message: '❌ Sistemas de mídia não encontrados.' };
            }
            const mediaStatus = {
                initialized: !!mediaSystem.config,
                hasUploadAll: typeof mediaSystem.uploadAll === 'function',
                hasAddFiles: typeof mediaSystem.addFiles === 'function',
                hasAddPdfs: typeof mediaSystem.addPdfs === 'function'
            };
            const pdfStatus = {
                initialized: !!pdfSystem.init,
                hasShowModal: typeof pdfSystem.showModal === 'function',
                hasValidatePassword: typeof pdfSystem.validatePasswordAndShowList === 'function'
            };
            const mediaOk = Object.values(mediaStatus).filter(Boolean).length;
            const pdfOk = Object.values(pdfStatus).filter(Boolean).length;
            const status = (mediaOk >= 3 && pdfOk >= 2) ? 'success' : 'error';
            return {
                status,
                message: status === 'success' ? '🖼️ Mídia Unificada: OK' : '❌ Mídia Unificada: Falha parcial',
                details: { mediaSystem: mediaStatus, pdfSystem: pdfStatus }
            };
        },

        /**
         * ✅ VERIFICAÇÃO DO CORE DE IMÓVEIS
         * Valida properties.js e funções de CRUD.
         */
        async propertyCore() {
            const properties = window.properties;
            const coreFns = {
                loadPropertiesData: typeof window.loadPropertiesData === 'function',
                renderProperties: typeof window.renderProperties === 'function',
                savePropertiesToStorage: typeof window.savePropertiesToStorage === 'function',
                addNewProperty: typeof window.addNewProperty === 'function',
                updateProperty: typeof window.updateProperty === 'function'
            };
            const allFnsOk = Object.values(coreFns).every(Boolean);
            const storageData = localStorage.getItem(CONFIG.storageKey);
            let storageValid = false;
            try {
                storageValid = Array.isArray(JSON.parse(storageData));
            } catch (e) {}
            return {
                status: (allFnsOk && Array.isArray(properties) && storageValid) ? 'success' : 'error',
                message: `🏠 Core de Imóveis: ${properties?.length || 0} imóveis`,
                details: {
                    inMemoryCount: properties?.length || 0,
                    storageKey: CONFIG.storageKey,
                    storageValid,
                    functions: coreFns
                }
            };
        },

        /**
         * ✅ VERIFICAÇÃO DE PERFORMANCE E CACHE
         * Mede tempo de renderização e uso de cache.
         */
        async performanceBenchmark() {
            const container = document.getElementById('properties-container');
            if (!container) return { status: 'error', message: '❌ Container não encontrado.' };
            
            const start = performance.now();
            if (typeof window.renderProperties === 'function') {
                window.renderProperties(window.currentFilter || 'todos');
            }
            const renderTime = performance.now() - start;
            
            const templateCache = window.propertyTemplates?.cache;
            const cacheSize = templateCache?.size || 0;
            
            return {
                status: renderTime < 50 ? 'success' : renderTime < 150 ? 'warning' : 'error',
                message: `⚡ Render: ${formatTime(renderTime)} | Cache: ${cacheSize} itens`,
                details: { renderTime, cacheSize }
            };
        },

        /**
         * ✅ TESTE DE CONEXÃO SUPABASE (NÃO-BLOQUEANTE)
         */
        async supabaseConnection() {
            if (!window.supabaseClient) return { status: 'warning', message: '⚠️ Supabase não inicializado.' };
            try {
                const { error } = await window.supabaseClient.from('properties').select('id').limit(1);
                return {
                    status: error ? 'error' : 'success',
                    message: error ? '❌ Falha na conexão' : '🌐 Supabase conectado',
                    details: { error: error?.message }
                };
            } catch (e) {
                return { status: 'error', message: '❌ Erro de rede', details: { error: e.message } };
            }
        }
    };

    // ==================== GERADOR DE RELATÓRIO HTML ====================
    /**
     * Cria um painel de diagnóstico leve, semântico e acessível.
     */
    function createDiagnosticPanel() {
        if (document.getElementById(CONFIG.panelId)) {
            console.log('🔍 Painel já existe.');
            return document.getElementById(CONFIG.panelId);
        }

        const panel = document.createElement('div');
        panel.id = CONFIG.panelId;
        panel.setAttribute('role', 'diagnostics');
        panel.style.cssText = `
            all: initial;
            position: fixed;
            top: 20px;
            left: 20px;
            width: 520px;
            max-height: 85vh;
            overflow-y: auto;
            background: #0a1a2f;
            color: #e0e0e0;
            font-family: 'SF Mono', 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.5;
            border: 1px solid #2a4c7c;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,20,40,0.8);
            z-index: 2147483647;
            padding: 0;
            display: flex;
            flex-direction: column;
            backdrop-filter: blur(4px);
        `;

        panel.innerHTML = `
            <div style="padding: 16px 20px; background: #0e2a3a; border-bottom: 1px solid #2a5a7a; display: flex; justify-content: space-between; align-items: center; border-radius: 12px 12px 0 0;">
                <span style="color: #8ab4f8; font-weight: 700; font-size: 15px; letter-spacing: 0.5px;">
                    🧪 DIAGNÓSTICO DO SISTEMA v${CONFIG.version}
                </span>
                <span id="diagnostics-timestamp" style="color: #a0b8cc; font-size: 11px; background: #1e3a4a; padding: 4px 10px; border-radius: 20px;">
                    ${new Date().toLocaleTimeString('pt-BR')}
                </span>
            </div>
            <div id="diagnostics-content" style="padding: 16px 20px; flex: 1;">
                <!-- Conteúdo dinâmico carregado via JS -->
            </div>
            <div style="padding: 12px 20px; background: #0a1a2a; border-top: 1px solid #1a3a4a; display: flex; gap: 12px; justify-content: flex-end; border-radius: 0 0 12px 12px;">
                <button id="diagnostics-refresh" style="background: #1e3a5a; color: white; border: 1px solid #3a7a9a; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer;">↻ Atualizar</button>
                <button id="diagnostics-close" style="background: #2a3a4a; color: #ccc; border: 1px solid #5a6a7a; padding: 6px 14px; border-radius: 20px; font-size: 12px; cursor: pointer;">✕ Fechar</button>
            </div>
        `;

        document.body.appendChild(panel);
        state.panelInstance = panel;

        // Event Listeners (limpos, sem vazamento)
        panel.querySelector('#diagnostics-refresh').onclick = () => runAllTests(true);
        panel.querySelector('#diagnostics-close').onclick = () => panel.remove();

        return panel;
    }

    /**
     * Renderiza os resultados no painel.
     */
    async function renderResults() {
        if (!state.panelInstance) return;
        const contentEl = state.panelInstance.querySelector('#diagnostics-content');
        if (!contentEl) return;

        const resultsArray = Object.entries(state.results);
        const successCount = resultsArray.filter(([_, r]) => r?.status === 'success').length;
        const warningCount = resultsArray.filter(([_, r]) => r?.status === 'warning').length;
        const errorCount = resultsArray.filter(([_, r]) => r?.status === 'error').length;

        let html = `<div style="margin-bottom: 16px; display: flex; gap: 16px; align-items: center; padding-bottom: 12px; border-bottom: 1px dashed #2a4c6a;">
            <span style="background: #1e3a4a; padding: 4px 12px; border-radius: 20px;">✅ ${successCount}</span>
            <span style="background: #4a3a1a; padding: 4px 12px; border-radius: 20px;">⚠️ ${warningCount}</span>
            <span style="background: #4a1a1a; padding: 4px 12px; border-radius: 20px;">❌ ${errorCount}</span>
            <span style="margin-left: auto; color: #a0c0d0;">Total: ${resultsArray.length}</span>
        </div>`;

        for (const [key, result] of resultsArray) {
            if (!result) continue;
            const statusIcon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
            const statusColor = result.status === 'success' ? '#8bc34a' : result.status === 'warning' ? '#ffb86b' : '#ff6b6b';
            
            html += `<div style="background: #0a1a24; margin-bottom: 12px; padding: 14px; border-radius: 8px; border-left: 4px solid ${statusColor};">
                <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                    <span style="font-weight: 700; color: #d0e0ff;">${statusIcon} ${result.name || key}</span>
                    <span style="color: ${statusColor}; background: #1a2a34; padding: 2px 8px; border-radius: 12px; font-size: 11px;">${result.status.toUpperCase()}</span>
                </div>
                <div style="color: #c0d0e0; font-size: 12px; margin-bottom: 6px;">${result.message || 'Sem mensagem'}</div>
                ${result.duration ? `<div style="color: #a0b8cc; font-size: 11px;">⏱️ ${formatTime(result.duration)}</div>` : ''}
                ${result.details ? `<details style="margin-top: 8px;"><summary style="color: #8ab4f8; cursor: pointer; font-size: 11px;">🔍 Detalhes técnicos</summary>
                <pre style="background: #0a121c; padding: 8px; border-radius: 4px; font-size: 10px; color: #b0c8d0; margin-top: 6px; white-space: pre-wrap; word-break: break-all;">${JSON.stringify(result.details, null, 2)}</pre>
                </details>` : ''}
            </div>`;
        }
        contentEl.innerHTML = html;
    }

    // ==================== EXECUTOR PRINCIPAL ====================
    /**
     * Executa todos os testes em paralelo com controle de falha.
     */
    async function runAllTests(force = false) {
        if (state.systemStatus === 'running' && !force) {
            console.log('🔍 Diagnóstico já em execução.');
            return;
        }
        state.systemStatus = 'running';
        console.groupCollapsed(`🔍 [Diagnostics v${CONFIG.version}] Executando suíte de testes...`);

        const testEntries = Object.entries(tests);
        const promises = testEntries.map(async ([key, testFn]) => {
            const result = await measureAsync(() => testFn(), key);
            state.results[key] = { ...result, name: key };
            console.log(`${result.status === 'success' ? '✅' : '❌'} ${key}: ${result.message} ${result.duration ? `(${formatTime(result.duration)})` : ''}`);
            return result;
        });

        await Promise.allSettled(promises);
        console.groupEnd();
        state.systemStatus = 'idle';
        
        if (state.panelInstance) await renderResults();
        
        // Log consolidado no console
        console.table(Object.values(state.results).map(r => ({
            Teste: r.name,
            Status: r.status,
            Mensagem: r.message,
            Tempo: r.duration ? `${r.duration.toFixed(1)}ms` : '-'
        })));
    }

    // ==================== API PÚBLICA ====================
    return {
        version: CONFIG.version,
        
        /** Inicializa e, se em modo diagnostics, abre o painel */
        async init() {
            if (state.initialized) return;
            state.initialized = true;
            console.log(`🔧 Inicializando Diagnostics v${this.version}...`);
            
            // Auto-execução apenas se a flag diagnostics=true estiver presente
            if (CONFIG.diagnosticsMode) {
                // Pequeno delay para garantir que o DOM e outros módulos estejam prontos
                setTimeout(async () => {
                    createDiagnosticPanel();
                    await this.run();
                }, 800);
            }
        },

        /** Executa todos os testes e atualiza a UI */
        async run() {
            await runAllTests(true);
            return state.results;
        },

        /** Abre/fecha o painel manualmente */
        togglePanel() {
            if (!state.panelInstance) {
                createDiagnosticPanel();
                this.run();
            } else {
                state.panelInstance.remove();
                state.panelInstance = null;
            }
        },

        /** Retorna o último resultado de um teste específico */
        getResult(testName) {
            return state.results[testName];
        },

        /** Retorna um resumo do estado do sistema */
        getSystemSummary() {
            return {
                version: CONFIG.version,
                timestamp: new Date().toISOString(),
                propertiesCount: window.properties?.length || 0,
                modulesLoaded: CONFIG.criticalModules.filter(m => !!window[m]).length,
                diagnosticsMode: CONFIG.diagnosticsMode,
                debugMode: CONFIG.debugMode
            };
        }
    };
})();

// ==================== INICIALIZAÇÃO SOB DEMANDA ====================
// Registra no escopo global
window.Diagnostics = DiagnosticsV5;

// Inicia apenas se a flag estiver ativa
if (window.location.search.includes('diagnostics=true')) {
    // Aguarda o carregamento completo do DOM e de outros módulos críticos
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        window.Diagnostics.init();
    } else {
        document.addEventListener('DOMContentLoaded', () => window.Diagnostics.init());
    }
} else {
    // Silencioso, mas disponível via console
    console.log('🔍 Diagnostics v5.9.1 disponível. Use window.Diagnostics.togglePanel() para abrir.');
}

// ==================== FIM ====================
