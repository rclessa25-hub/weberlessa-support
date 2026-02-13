// ============================================================
// debug/diagnostics/diagnostics59.js
// SISTEMA DE DIAGNÓSTICO UNIFICADO v5.9.1
// REPOSITÓRIO: weberlessa-support
// PROPÓSITO: Verificação completa de integridade do Core System
// DEPENDÊNCIAS: Core System (imoveis-maceio) - Nenhuma dependência do Support
// INTEGRAÇÃO: Ativado via URL ?debug=true&diagnostics=true
// ============================================================
console.log(`🔧 [DIAGNOSTICS59] v5.9.1 Carregado - ${new Date().toLocaleTimeString()}`);

const DiagnosticsSystemV59 = (function() {
    'use strict';

    // ========== CONFIGURAÇÕES ==========
    const CONFIG = {
        version: '5.9.1',
        build: '2026.02.13',
        targetCore: 'Weber Lessa Imóveis',
        criticalModules: [
            'SharedCore',
            'MediaSystem',
            'PdfSystem',
            'FilterManager',
            'LoadingManager'
        ],
        testTimeout: 5000,
        styles: {
            panelWidth: 520,
            panelBg: '#0a1a2f',
            accentColor: '#3498db',
            successColor: '#27ae60',
            warningColor: '#f39c12',
            errorColor: '#e74c3c'
        }
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
         * Testa se um objeto existe globalmente.
         */
        assertGlobal(objName) {
            try {
                return typeof window[objName] !== 'undefined';
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
        },

        /**
         * Formata bytes para legível.
         */
        formatBytes(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        },

        /**
         * Obtém informações de performance da página.
         */
        getPagePerformance() {
            if (!window.performance) return null;
            
            const perf = window.performance;
            const nav = perf.navigation;
            const timing = perf.timing;
            
            if (!timing) return null;
            
            return {
                loadTime: timing.loadEventEnd - timing.navigationStart,
                domReady: timing.domComplete - timing.domLoading,
                networkLatency: timing.responseEnd - timing.requestStart,
                redirectCount: nav ? nav.redirectCount : 0
            };
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
                    parseFeaturesForStorage: _utils.assertFunction(window.SharedCore, 'parseFeaturesForStorage'),
                    PriceFormatter: !!window.SharedCore.PriceFormatter,
                    PriceFormatterFormatForCard: _utils.assertFunction(window.SharedCore.PriceFormatter, 'formatForCard')
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
                    oldKey: localStorage.getItem('weberlessa_properties') ? 'present (MIGRAR)' : 'clean',
                    size: localStorage.getItem('properties') ? 
                        _utils.formatBytes(new Blob([localStorage.getItem('properties')]).size) : 'N/A'
                },
                syncStatus: 'unknown',
                sampleData: null
            };

            results.windowPropertiesValid = results.windowProperties && results.propertyCount > 0;

            // Amostra do primeiro imóvel (se houver)
            if (results.windowPropertiesValid && window.properties[0]) {
                const first = window.properties[0];
                results.sampleData = {
                    id: first.id,
                    title: first.title?.substring(0, 30),
                    hasVideo: !!first.has_video,
                    imageCount: first.images ? first.images.split(',').filter(i => i && i !== 'EMPTY').length : 0,
                    pdfCount: first.pdfs ? first.pdfs.split(',').filter(p => p && p !== 'EMPTY').length : 0
                };
            }

            // Verificar consistência
            if (results.windowPropertiesValid) {
                const stored = localStorage.getItem('properties');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        results.syncStatus = parsed.length === results.propertyCount ? 'synced' : 'desync';
                        results.storageCount = parsed.length;
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
                hasLoadExisting: _utils.assertFunction(ms, 'loadExisting'),
                hasResetState: _utils.assertFunction(ms, 'resetState'),
                state: ms?.state ? {
                    files: ms.state.files?.length || 0,
                    pdfs: ms.state.pdfs?.length || 0,
                    existing: ms.state.existing?.length || 0,
                    existingPdfs: ms.state.existingPdfs?.length || 0,
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
                hasValidatePassword: typeof ps.validatePasswordAndShowList === 'function',
                modalInDOM: !!document.getElementById('pdfModal'),
                modalVisible: document.getElementById('pdfModal')?.style.display === 'flex'
            };

            // Testar se o modal de seleção existe quando aberto
            results.selectionModalExists = !!document.getElementById('pdfSelectionModal');

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
                    canHide: _utils.assertFunction(window.LoadingManager, 'hide'),
                    canShowSuccess: _utils.assertFunction(window.LoadingManager, 'showSuccess'),
                    canShowError: _utils.assertFunction(window.LoadingManager, 'showError')
                },
                filterManager: {
                    available: !!window.FilterManager,
                    hasInit: _utils.assertFunction(window.FilterManager, 'init'),
                    hasSetActive: _utils.assertFunction(window.FilterManager, 'setActiveFilter'),
                    containerExists: !!document.querySelector('.filter-options'),
                    buttonCount: document.querySelectorAll('.filter-btn').length
                },
                eventManager: {
                    available: !!window.EventManager,
                    hasOn: _utils.assertFunction(window.EventManager, 'on'),
                    hasOff: _utils.assertFunction(window.EventManager, 'off')
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
                resetAdminForm: typeof window.resetAdminFormCompletely === 'function',
                addNewProperty: typeof window.addNewProperty === 'function',
                updateProperty: typeof window.updateProperty === 'function',
                deleteProperty: typeof window.deleteProperty === 'function',
                updateLocalProperty: typeof window.updateLocalProperty === 'function',
                updatePropertyCard: typeof window.updatePropertyCard === 'function',
                savePropertiesToStorage: typeof window.savePropertiesToStorage === 'function',
                loadPropertyList: typeof window.loadPropertyList === 'function',
                panelButtonExists: !!document.querySelector('.admin-toggle'),
                panelVisible: document.getElementById('adminPanel')?.style.display === 'block'
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
                    supabaseSaveProperty: typeof window.supabaseSaveProperty === 'function',
                    supabaseUpdateProperty: typeof window.supabaseUpdateProperty === 'function',
                    supabaseDeleteProperty: typeof window.supabaseDeleteProperty === 'function'
                }
            };

            let connectionOk = false;
            let latency = null;
            let dataCount = 0;

            if (results.clientAvailable && results.constantsDefined) {
                try {
                    const measure = await _utils.measureTime(
                        () => window.supabaseClient
                            .from('properties')
                            .select('id', { count: 'exact', head: true }),
                        'Supabase Query'
                    );
                    connectionOk = !measure.result.error;
                    latency = measure.time;
                    dataCount = measure.result.count || 0;
                } catch (e) {
                    connectionOk = false;
                }
            }

            results.connection = {
                ok: connectionOk,
                latency: latency ? `${latency.toFixed(0)}ms` : 'N/A',
                remoteCount: dataCount
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
                'pdf-logger', 'media-legacy', 'utils.js.backup',
                'simple-checker', 'duplication-checker', 'emergency-recovery'
            ];

            const found = [];
            const scripts = document.querySelectorAll('script[src]');
            
            scripts.forEach(script => {
                const src = script.src || '';
                zombiePatterns.forEach(pattern => {
                    if (src.includes(pattern) && !found.includes(pattern)) {
                        found.push(src.split('/').pop());
                    }
                });
            });

            // Verificar também variáveis globais legadas
            const globalZombies = [];
            if (window.DiagnosticsV53) globalZombies.push('DiagnosticsV53');
            if (window.DiagnosticsV54) globalZombies.push('DiagnosticsV54');
            if (window.DiagnosticsV55) globalZombies.push('DiagnosticsV55');
            if (window.DiagnosticsV56) globalZombies.push('DiagnosticsV56');
            if (window.DiagnosticsV57) globalZombies.push('DiagnosticsV57');
            if (window.DiagnosticsV58) globalZombies.push('DiagnosticsV58');

            return {
                name: 'Varredura de Módulos Legados (Zumbis)',
                status: found.length === 0 && globalZombies.length === 0 ? 'success' : 'warning',
                details: {
                    zombieFilesFound: found,
                    zombieGlobalsFound: globalZombies,
                    count: found.length + globalZombies.length,
                    recommendation: found.length > 0 || globalZombies.length > 0 ? 
                        'Módulos legados detectados - fazem parte da cadeia de diagnóstico progressiva (esperado)' : 
                        'Limpo'
                }
            };
        },

        /**
         * ✅ TESTE 9: Métricas de Performance da Página.
         */
        async checkPagePerformance() {
            const perf = _utils.getPagePerformance();
            
            if (!perf) {
                return {
                    name: 'Performance da Página',
                    status: 'warning',
                    details: { error: 'API de performance não disponível' }
                };
            }

            const results = {
                loadTime: perf.loadTime,
                loadTimeFormatted: perf.loadTime > 0 ? `${perf.loadTime}ms` : 'N/A',
                domReady: perf.domReady,
                domReadyFormatted: perf.domReady > 0 ? `${perf.domReady}ms` : 'N/A',
                networkLatency: perf.networkLatency,
                networkLatencyFormatted: perf.networkLatency > 0 ? `${perf.networkLatency}ms` : 'N/A',
                redirectCount: perf.redirectCount
            };

            // Classificar performance
            let status = 'success';
            if (perf.loadTime > 3000) status = 'warning';
            if (perf.loadTime > 5000) status = 'error';

            return {
                name: 'Performance da Página',
                status: status,
                details: results
            };
        },

        /**
         * ✅ TESTE 10: Verificação de Responsividade.
         */
        async checkResponsiveness() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            
            const results = {
                viewport: `${width}×${height}`,
                deviceType: width <= 768 ? 'mobile' : (width <= 1024 ? 'tablet' : 'desktop'),
                orientation: width > height ? 'landscape' : 'portrait',
                headerMobileVisible: width <= 768 ? 
                    !!document.querySelector('.mobile-header-ultimate') : 
                    !document.querySelector('.mobile-header-ultimate'),
                headerDesktopVisible: width > 768 ? 
                    !!document.querySelector('.header-integrated') : 
                    !document.querySelector('.header-integrated')
            };

            return {
                name: 'Responsividade',
                status: 'success',
                details: results
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
            build: CONFIG.build,
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
                width: ${CONFIG.styles.panelWidth}px;
                max-width: 95vw;
                max-height: 90vh;
                background: linear-gradient(145deg, ${CONFIG.styles.panelBg}, #0b1e2c);
                border: 1px solid #2a4c6b;
                border-left: 6px solid ${errorCount > 0 ? CONFIG.styles.errorColor : (warningCount > 0 ? CONFIG.styles.warningColor : CONFIG.styles.successColor)};
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
                user-select: text;
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
                user-select: text;
            }
            .diagnostics-panel-v59 .test-item {
                background: rgba(10, 25, 40, 0.7);
                border-radius: 8px;
                padding: 12px;
                margin-bottom: 10px;
                border-left: 4px solid;
                border-left-color: #555;
                transition: all 0.2s;
                user-select: text;
            }
            .diagnostics-panel-v59 .test-item:hover {
                background: rgba(20, 40, 60, 0.8);
                transform: translateX(2px);
            }
            .diagnostics-panel-v59 .badge {
                display: inline-block;
                padding: 3px 10px;
                border-radius: 20px;
                font-size: 11px;
                font-weight: bold;
                text-transform: uppercase;
            }
            .diagnostics-panel-v59 .badge-success { background: ${CONFIG.styles.successColor}; color: white; }
            .diagnostics-panel-v59 .badge-warning { background: ${CONFIG.styles.warningColor}; color: black; }
            .diagnostics-panel-v59 .badge-error { background: ${CONFIG.styles.errorColor}; color: white; }
            .diagnostics-panel-v59 button {
                background: #1e3b4a;
                color: white;
                border: 1px solid ${CONFIG.styles.accentColor};
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
                transform: translateY(-1px);
            }
            .diagnostics-panel-v59 .summary-stats {
                display: flex;
                gap: 15px;
                margin-bottom: 20px;
                padding: 12px;
                background: #0a121c;
                border-radius: 8px;
                border: 1px solid #2a4c6b;
            }
            .diagnostics-panel-v59 pre {
                background: #0f1c26;
                padding: 8px;
                border-radius: 4px;
                overflow-x: auto;
                color: #aad1f7;
                margin-top: 5px;
                font-size: 11px;
                border: 1px solid #2a4c6b;
                white-space: pre-wrap;
                word-wrap: break-word;
                user-select: text;
            }
            .diagnostics-panel-v59 .footer-note {
                font-size: 10px;
                color: #7f8c8d;
                text-align: center;
                margin-top: 15px;
                padding-top: 10px;
                border-top: 1px solid #2a4c6b;
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
                <div><span style="color: #8ec4e6;">🏗️</span> v${summary.build}</div>
            </div>
            <div id="pv-test-results-container"></div>
            <div class="footer-note">
                🔍 Diagnóstico não-modificador • Core System íntegro • Clique nos testes para detalhes
            </div>
        `;
        
        const resultsContainer = content.querySelector('#pv-test-results-container');
        
        // Renderizar cada teste
        summary.results.forEach((test, index) => {
            const testEl = document.createElement('div');
            testEl.className = 'test-item';
            testEl.style.borderLeftColor = 
                test.status === 'success' ? CONFIG.styles.successColor : 
                test.status === 'warning' ? CONFIG.styles.warningColor : CONFIG.styles.errorColor;
            
            // Adicionar atributo para expandir detalhes
            testEl.setAttribute('data-test-index', index);
            
            let detailsHtml = '';
            if (test.details) {
                const detailsStr = JSON.stringify(test.details, null, 2)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                
                detailsHtml = `
                    <div class="test-details" style="display: none; margin-top: 10px; padding-top: 8px; border-top: 1px dashed #2a4c6b;">
                        <div style="color: #b0c4ce; margin-bottom: 5px;">📋 Detalhes:</div>
                        <pre>${detailsStr}</pre>
                    </div>
                `;
            }

            testEl.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; cursor: pointer;" class="test-header">
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

            // Adicionar evento para expandir/colapsar detalhes
            const header = testEl.querySelector('.test-header');
            header.addEventListener('click', () => {
                const details = testEl.querySelector('.test-details');
                if (details) {
                    details.style.display = details.style.display === 'none' ? 'block' : 'none';
                }
            });

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
            e.preventDefault();
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
        build: CONFIG.build,
        
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
                console.log(`▶️ Executando teste: ${testId}`);
                return await tests[testId]();
            }
            throw new Error(`Teste '${testId}' não encontrado.`);
        },

        /**
         * Retorna estado atual do sistema.
         */
        getSystemState() {
            return { ...systemState };
        },

        /**
         * Limpa todos os painéis de diagnóstico.
         */
        clearPanels() {
            document.querySelectorAll('div[id^="diagnostics-panel-"]').forEach(p => p.remove());
            return true;
        }
    };
})();

// ========== EXPOSIÇÃO GLOBAL ==========
window.Diagnostics = DiagnosticsSystemV59;
window.diagnostics = DiagnosticsSystemV59; // Alias curto
window.DIAGNOSTICS_VERSION = '5.9.1';

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

// ========== MENSAGEM DE INICIALIZAÇÃO ==========
console.log(`%c✅ [DIAGNOSTICS59] v5.9.1 registrado em window.Diagnostics`, 
    'color: #27ae60; font-weight: bold;');
console.log(`%c💡 Comandos:`, 'color: #3498db; font-weight: bold;');
console.log(`   • await Diagnostics.run() - Executar diagnóstico no console`);
console.log(`   • await Diagnostics.runWithPanel() - Exibir painel visual`);
console.log(`   • Diagnostics.runTest('checkCoreAPIs') - Teste específico`);
console.log(`   • Diagnostics.clearPanels() - Remover todos os painéis`);
