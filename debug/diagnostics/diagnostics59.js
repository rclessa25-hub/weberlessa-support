// ============================================================
// debug/diagnostics/diagnostics59.js
// SISTEMA DE DIAGNÓSTICO UNIFICADO v5.9.0
// REPOSITÓRIO: weberlessa-support
// PROPÓSITO: Verificação completa de integridade do Core System
// DEPENDÊNCIAS: Core System (imoveis-maceio) - Nenhuma dependência do Support
// INTEGRAÇÃO: Ativado via URL ?debug=true&diagnostics=true
// ============================================================
console.log(`🔧 [DIAGNOSTICS59] v5.9.0 Carregado - ${new Date().toLocaleTimeString()}`);

const DiagnosticsSystemV59 = (function() {
    'use strict';

    // ========== CONFIGURAÇÕES ==========
    const CONFIG = {
        version: '5.9.0',
        build: '2026.02.13',
        targetCore: 'Weber Lessa Imóveis',
        criticalModules: [
            'SharedCore',
            'MediaSystem',
            'PdfSystem',
            'FilterManager',
            'LoadingManager'
        ],
        testTimeout: 5000
    };

    // ========== ESTADO DO SISTEMA ==========
    const systemState = {
        coreReady: false,
        modules: {},
        propertiesLoaded: false,
        localStorageHealthy: false,
        supabaseStatus: 'unknown'
    };

    // ========== UTILITÁRIOS PRIVADOS ==========
    const _utils = {
        /**
         * Mede tempo de execução de uma função.
         * @param {Function} fn - Função síncrona ou assíncrona.
         * @param {string} label - Nome para log.
         */
        async measureTime(fn, label = 'Operação') {
            const start = performance.now();
            try {
                const result = await fn();
                const time = performance.now() - start;
                console.log(`⚡ [PERF] ${label}: ${time.toFixed(2)}ms`);
                return { result, time };
            } catch (error) {
                const time = performance.now() - start;
                console.error(`❌ [PERF] ${label} falhou após ${time.toFixed(2)}ms:`, error);
                throw error;
            }
        },

        /**
         * Testa se uma função existe e é do tipo esperado.
         */
        assertFunction(obj, fnName) {
            try {
                return typeof obj[fnName] === 'function';
            } catch {
                return false;
            }
        },

        /**
         * Sanitiza texto para exibição segura no painel.
         */
        sanitizeForDisplay(text) {
            if (!text) return '';
            return String(text)
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .substring(0, 500);
        }
    };

    // ========== TESTES DE INTEGRIDADE (MÓDULOS CRÍTICOS) ==========
    const tests = {
        /**
         * ✅ TESTE 1: Verifica disponibilidade das APIs do Core.
         */
        async checkCoreAPIs() {
            const results = {};
            let allPassed = true;

            CONFIG.criticalModules.forEach(moduleName => {
                const isAvailable = !!window[moduleName];
                const hasPublicAPI = isAvailable && typeof window[moduleName] === 'object';
                results[moduleName] = {
                    available: isAvailable,
                    hasAPI: hasPublicAPI,
                    status: isAvailable && hasPublicAPI ? 'ok' : 'missing'
                };
                if (!isAvailable || !hasPublicAPI) allPassed = false;
            });

            // Verificar funções específicas do SharedCore
            if (window.SharedCore) {
                results.SharedCore.methods = {
                    formatFeaturesForDisplay: _utils.assertFunction(window.SharedCore, 'formatFeaturesForDisplay'),
                    ensureBooleanVideo: _utils.assertFunction(window.SharedCore, 'ensureBooleanVideo'),
                    PriceFormatter: !!window.SharedCore.PriceFormatter
                };
            }

            return {
                name: 'Módulos Críticos do Core',
                status: allPassed ? 'success' : 'warning',
                details: results
            };
        },

        /**
         * ✅ TESTE 2: Verifica integridade do array de propriedades e localStorage.
         */
        async checkPropertiesSystem() {
            const results = {
                windowProperties: Array.isArray(window.properties),
                propertyCount: window.properties?.length || 0,
                localStorage: {
                    unifiedKey: localStorage.getItem('properties') ? 'present' : 'missing',
                    oldKey: localStorage.getItem('weberlessa_properties') ? 'present (MIGRAR)' : 'clean'
                },
                syncStatus: 'unknown'
            };

            results.windowPropertiesValid = results.windowProperties && results.propertyCount > 0;

            // Verificar consistência
            if (results.windowPropertiesValid) {
                const stored = localStorage.getItem('properties');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        results.syncStatus = parsed.length === results.propertyCount ? 'synced' : 'desync';
                    } catch {
                        results.syncStatus = 'corrupted';
                    }
                } else {
                    results.syncStatus = 'memory_only';
                }
            }

            return {
                name: 'Sistema de Propriedades',
                status: results.windowPropertiesValid && results.syncStatus !== 'corrupted' ? 'success' : 'error',
                details: results
            };
        },

        /**
         * ✅ TESTE 3: Verifica sistema de Mídia Unificado.
         */
        async checkMediaSystem() {
            const ms = window.MediaSystem;
            const results = {
                available: !!ms,
                hasInit: _utils.assertFunction(ms, 'init'),
                hasUpload: _utils.assertFunction(ms, 'uploadAll'),
                hasAddFiles: _utils.assertFunction(ms, 'addFiles'),
                hasAddPdfs: _utils.assertFunction(ms, 'addPdfs'),
                state: ms?.state ? {
                    files: ms.state.files?.length || 0,
                    pdfs: ms.state.pdfs?.length || 0,
                    isUploading: ms.state.isUploading || false
                } : null
            };

            const isOperational = results.available && results.hasInit && results.hasUpload;
            return {
                name: 'Sistema de Mídia (media-unified.js)',
                status: isOperational ? 'success' : 'error',
                details: results
            };
        },

        /**
         * ✅ TESTE 4: Verifica sistema de PDF.
         */
        async checkPdfSystem() {
            const ps = window.PdfSystem;
            const results = {
                available: !!ps,
                hasShowModal: _utils.assertFunction(ps, 'showModal'),
                hasInit: _utils.assertFunction(ps, 'init'),
                modalInDOM: !!document.getElementById('pdfModal')
            };

            return {
                name: 'Sistema de PDF (pdf-unified.js)',
                status: results.available && results.hasShowModal ? 'success' : 'error',
                details: results
            };
        },

        /**
         * ✅ TESTE 5: Verifica sistema de Loading e Filtros.
         */
        async checkUIUtilities() {
            const results = {
                loadingManager: {
                    available: !!window.LoadingManager,
                    canShow: _utils.assertFunction(window.LoadingManager, 'show'),
                    canHide: _utils.assertFunction(window.LoadingManager, 'hide')
                },
                filterManager: {
                    available: !!window.FilterManager,
                    hasInit: _utils.assertFunction(window.FilterManager, 'init'),
                    containerExists: !!document.querySelector('.filter-options')
                }
            };

            const uiOk = results.loadingManager.available || results.filterManager.available;
            return {
                name: 'Utilitários de UI',
                status: uiOk ? 'success' : 'warning',
                details: results
            };
        },

        /**
         * ✅ TESTE 6: Verifica funções de Admin e CRUD.
         */
        async checkAdminFunctions() {
            const results = {
                toggleAdminPanel: typeof window.toggleAdminPanel === 'function',
                addNewProperty: typeof window.addNewProperty === 'function',
                updateProperty: typeof window.updateProperty === 'function',
                deleteProperty: typeof window.deleteProperty === 'function',
                savePropertiesToStorage: typeof window.savePropertiesToStorage === 'function',
                panelButtonExists: !!document.querySelector('.admin-toggle')
            };

            const criticalFns = results.addNewProperty && results.savePropertiesToStorage;
            return {
                name: 'Funções Administrativas',
                status: criticalFns ? 'success' : 'error',
                details: results
            };
        },

        /**
         * ✅ TESTE 7: Verifica conectividade com Supabase.
         */
        async checkSupabaseConnection() {
            const results = {
                clientAvailable: !!window.supabaseClient,
                constantsDefined: !!(window.SUPABASE_CONSTANTS?.URL && window.SUPABASE_CONSTANTS?.KEY),
                fetchFunctions: {
                    supabaseLoadProperties: typeof window.supabaseLoadProperties === 'function',
                    supabaseSaveProperty: typeof window.supabaseSaveProperty === 'function'
                }
            };

            let connectionOk = false;
            let latency = null;

            if (results.clientAvailable && results.constantsDefined) {
                try {
                    const measure = await _utils.measureTime(
                        () => window.supabaseClient.from('properties').select('id').limit(1),
                        'Supabase Query'
                    );
                    connectionOk = !measure.result.error;
                    latency = measure.time;
                } catch (e) {
                    connectionOk = false;
                }
            }

            results.connection = {
                ok: connectionOk,
                latency: latency ? `${latency.toFixed(0)}ms` : 'N/A'
            };

            return {
                name: 'Integração Supabase',
                status: connectionOk ? 'success' : (results.constantsDefined ? 'warning' : 'error'),
                details: results
            };
        },

        /**
         * ✅ TESTE 8: Varredura de "código zumbi" (arquivos/módulos legados).
         */
        async scanForZombieCode() {
            const zombiePatterns = [
                'diagnostics53', 'diagnostics54', 'diagnostics55',
                'diagnostics56', 'diagnostics57', 'diagnostics58',
                'pdf-logger', 'media-legacy', 'utils.js.backup'
            ];

            const found = [];
            const scripts = document.querySelectorAll('script[src]');
            
            scripts.forEach(script => {
                const src = script.src || '';
                zombiePatterns.forEach(pattern => {
                    if (src.includes(pattern)) {
                        found.push(src.split('/').pop());
                    }
                });
            });

            return {
                name: 'Varredura de Módulos Legados (Zumbis)',
                status: found.length === 0 ? 'success' : 'warning',
                details: {
                    zombieFilesFound: found,
                    count: found.length,
                    recommendation: found.length > 0 ? 'Remova referências a estes arquivos do index.html' : 'Limpo'
                }
            };
        }
    };

    // ========== EXECUTOR DE TESTES ==========
    async function runAllTests() {
        console.group(`🔍 [DIAGNOSTICS v${CONFIG.version}] Iniciando bateria de testes...`);
        const startTime = performance.now();
        const results = [];

        for (const [key, testFn] of Object.entries(tests)) {
            try {
                console.log(`⏳ Executando: ${testFn().name || key}...`);
                const result = await Promise.race([
                    testFn(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), CONFIG.testTimeout)
                    )
                ]);
                results.push(result);
                
                if (result.status === 'success') {
                    console.log(`✅ ${result.name}: OK`);
                } else if (result.status === 'warning') {
                    console.warn(`⚠️ ${result.name}: Funcional, com ressalvas`);
                } else {
                    console.error(`❌ ${result.name}: FALHA`);
                }
            } catch (error) {
                console.error(`❌ Erro no teste ${key}:`, error);
                results.push({
                    name: key,
                    status: 'error',
                    error: error.message
                });
            }
        }

        const totalTime = performance.now() - startTime;
        console.log(`⏱️ Diagnóstico completo em ${totalTime.toFixed(0)}ms`);
        console.groupEnd();

        return {
            timestamp: new Date().toISOString(),
            version: CONFIG.version,
            executionTimeMs: totalTime,
            results
        };
    }

    // ========== PAINEL VISUAL APRIMORADO ==========
    function createDiagnosticsPanel(summary) {
        const panelId = `diagnostics-panel-${Date.now()}`;
        let panel = document.getElementById(panelId);

        if (panel) {
            panel.remove();
        }

        panel = document.createElement('div');
        panel.id = panelId;
        panel.className = 'diagnostics-panel-v59';
        
        const successCount = summary.results.filter(r => r.status === 'success').length;
        const warningCount = summary.results.filter(r => r.status === 'warning').length;
        const errorCount = summary.results.filter(r => r.status === 'error').length;

        // CSS embutido para garantir isolamento
        const style = document.createElement('style');
        style.textContent = `
            .diagnostics-panel-v59 {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 480px;
                max-width: 95vw;
                max-height: 90vh;
                background: linear-gradient(145deg, #0a1a2f, #0b1e2c);
                border: 1px solid #2a4c6b;
                border-left: 6px solid ${errorCount > 0 ? '#e74c3c' : (warningCount > 0 ? '#f39c12' : '#27ae60')};
                border-radius: 12px;
                box-shadow: 0 15px 35px rgba(0,0,0,0.6);
                z-index: 2147483647;
                color: #e0e0e0;
                font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
                font-size: 13px;
                line-height: 1.5;
                overflow: hidden;
                resize: both;
                backdrop-filter: blur(4px);
            }
            .diagnostics-panel-v59 .pv-header {
                background: rgba(0,0,0,0.4);
                padding: 12px 16px;
                border-bottom: 1px solid #2a4c6b;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
            }
            .diagnostics-panel-v59 .pv-content {
                padding: 16px;
                overflow-y: auto;
                max-height: 70vh;
            }
            .diagnostics-panel-v59 .test-item {
                background: rgba(10, 25, 40, 0.7);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 10px;
                border-left: 4px solid;
                border-left-color: #555;
            }
            .diagnostics-panel-v59 .badge {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .diagnostics-panel-v59 .badge-success { background: #27ae60; color: white; }
            .diagnostics-panel-v59 .badge-warning { background: #f39c12; color: black; }
            .diagnostics-panel-v59 .badge-error { background: #e74c3c; color: white; }
            .diagnostics-panel-v59 button {
                background: #1e3b4a;
                color: white;
                border: 1px solid #3498db;
                border-radius: 6px;
                padding: 8px 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 12px;
            }
            .diagnostics-panel-v59 button:hover {
                background: #2c5a6e;
                border-color: #5dade2;
            }
            .diagnostics-panel-v59 .summary-stats {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                padding: 12px;
                background: #0a121c;
                border-radius: 8px;
            }
        `;
        panel.appendChild(style);

        // Header (arrastável)
        const header = document.createElement('div');
        header.className = 'pv-header';
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 18px;">🔬</span>
                <span style="font-weight: 700; color: #8ec4e6;">DIAGNÓSTICO v${summary.version}</span>
                <span class="badge ${errorCount > 0 ? 'badge-error' : (warningCount > 0 ? 'badge-warning' : 'badge-success')}">
                    ${errorCount}E ${warningCount}W ${successCount}OK
                </span>
            </div>
            <div style="display: flex; gap: 6px;">
                <button class="pv-refresh-btn" title="Executar novamente">↻</button>
                <button class="pv-close-btn" title="Fechar">✕</button>
            </div>
        `;
        panel.appendChild(header);

        // Corpo
        const content = document.createElement('div');
        content.className = 'pv-content';
        
        // Sumário
        content.innerHTML = `
            <div class="summary-stats">
                <div><span style="color: #8ec4e6;">⏱️</span> ${summary.executionTimeMs.toFixed(0)}ms</div>
                <div><span style="color: #8ec4e6;">🧩</span> ${summary.results.length} testes</div>
                <div><span style="color: #8ec4e6;">📅</span> ${new Date(summary.timestamp).toLocaleTimeString()}</div>
            </div>
            <div id="pv-test-results-container"></div>
        `;
        
        const resultsContainer = content.querySelector('#pv-test-results-container');
        
        // Renderizar cada teste
        summary.results.forEach(test => {
            const testEl = document.createElement('div');
            testEl.className = 'test-item';
            testEl.style.borderLeftColor = 
                test.status === 'success' ? '#27ae60' : 
                test.status === 'warning' ? '#f39c12' : '#e74c3c';
            
            let detailsHtml = '';
            if (test.details) {
                detailsHtml = '<div style="margin-top: 10px; padding-top: 8px; border-top: 1px dashed #2a4c6b; font-size: 11px;">';
                detailsHtml += '<span style="color: #b0c4ce;">📋 Detalhes:</span><br>';
                detailsHtml += `<pre style="background: #0f1c26; padding: 8px; border-radius: 4px; overflow-x: auto; color: #aad1f7; margin-top: 5px;">${_utils.sanitizeForDisplay(JSON.stringify(test.details, null, 2))}</pre>`;
                detailsHtml += '</div>';
            }

            testEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                    <strong style="color: #e6e6e6;">${_utils.sanitizeForDisplay(test.name)}</strong>
                    <span class="badge badge-${test.status === 'success' ? 'success' : (test.status === 'warning' ? 'warning' : 'error')}">
                        ${test.status}
                    </span>
                </div>
                <div style="color: #b0c4ce; word-break: break-word;">
                    ${test.message || (test.status === 'success' ? 'Operacional' : 'Requer atenção')}
                </div>
                ${detailsHtml}
            `;
            resultsContainer.appendChild(testEl);
        });

        panel.appendChild(content);
        document.body.appendChild(panel);

        // === Event Listeners ===
        // Fechar
        panel.querySelector('.pv-close-btn').addEventListener('click', () => panel.remove());
        
        // Atualizar
        panel.querySelector('.pv-refresh-btn').addEventListener('click', async () => {
            panel.remove();
            const newSummary = await runAllTests();
            createDiagnosticsPanel(newSummary);
        });

        // Arrastar
        let isDragging = false, offsetX, offsetY;
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            panel.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const x = e.clientX - offsetX;
            const y = e.clientY - offsetY;
            panel.style.left = `${Math.max(0, Math.min(x, window.innerWidth - panel.offsetWidth))}px`;
            panel.style.top = `${Math.max(0, Math.min(y, window.innerHeight - panel.offsetHeight))}px`;
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = '';
        });

        console.log(`✅ Painel de Diagnóstico v${CONFIG.version} criado.`);
        return panel;
    }

    // ========== API PÚBLICA ==========
    return {
        version: CONFIG.version,
        
        /**
         * Executa diagnóstico completo e retorna sumário.
         */
        async run() {
            const summary = await runAllTests();
            
            // Log resumido no console
            console.log(`%c📊 DIAGNÓSTICO v${summary.version} FINALIZADO`, 
                'font-size:14px; font-weight:bold; background:#0a1a2f; color:#8ec4e6; padding:4px;');
            
            return summary;
        },

        /**
         * Executa diagnóstico e exibe painel visual.
         */
        async runWithPanel() {
            const summary = await this.run();
            
            // Remover painéis antigos
            document.querySelectorAll('div[id^="diagnostics-panel-"]').forEach(p => p.remove());
            
            return createDiagnosticsPanel(summary);
        },

        /**
         * Retorna lista de todos os testes disponíveis.
         */
        getTests() {
            return Object.keys(tests).map(key => ({
                id: key,
                name: tests[key]().name || key
            }));
        },

        /**
         * Executa um teste específico pelo ID.
         */
        async runTest(testId) {
            if (tests[testId]) {
                return await tests[testId]();
            }
            throw new Error(`Teste '${testId}' não encontrado.`);
        }
    };
})();

// ========== EXPOSIÇÃO GLOBAL ==========
window.Diagnostics = DiagnosticsSystemV59;
window.diagnostics = DiagnosticsSystemV59; // Alias curto

// ========== AUTO-EXECUÇÃO CONDICIONAL ==========
(function autoInit() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.get('debug') === 'true' && urlParams.get('diagnostics') === 'true') {
        console.log(`%c🔬 [v${DiagnosticsSystemV59.version}] Modo diagnóstico forçado por URL.`, 
            'color: #f39c12; font-weight: bold;');
        
        // Pequeno delay para garantir carregamento total do DOM
        setTimeout(() => {
            DiagnosticsSystemV59.runWithPanel()
                .then(() => console.log('✅ Painel de diagnóstico exibido.'))
                .catch(err => console.error('❌ Falha ao exibir painel:', err));
        }, 800);
    }
})();

console.log(`✅ [DIAGNOSTICS59] v5.9.0 registrado em window.Diagnostics`);
console.log(`💡 Comandos: await Diagnostics.run() | await Diagnostics.runWithPanel()`);
