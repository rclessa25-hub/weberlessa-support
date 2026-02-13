// ================== debug/diagnostics/diagnostics61.js - VERSÃO 6.1 ==================
// 🏷️ DIAGNOSTICS V61 - CADEIA DE DIAGNÓSTICO (BASE + NOVAS FUNÇÕES)
// Data: 13/02/2026
// Descrição: Versão consolidada da cadeia de diagnóstico (53-61), incluindo
//            verificações para LoadingManager, sistema de mídia unificado,
//            sistema PDF e novas funções do SharedCore.
// Ativação: Acesse o site com ?debug=true&diagnostics=true

(function() {
    // ========== CONFIGURAÇÃO ==========
    const CONFIG = {
        VERSION: '6.1',
        NAME: 'Diagnostics Module v61',
        DEBUG: window.location.search.includes('debug=true'),
        DIAGNOSTICS: window.location.search.includes('diagnostics=true'),
        CORE_SYSTEM: 'imoveis-maceio',
        SUPPORT_REPO: 'weberlessa-support',
        VERBOSE: false
    };

    // ========== ESTADO GLOBAL ==========
    let diagnosticsPanel = null;
    let testResults = {};
    let systemHealth = { status: 'unknown', score: 0 };

    // ========== LOGGING UTILITY ==========
    function log(level, message, data = null) {
        if (!CONFIG.DEBUG && level !== 'error') return;

        const prefix = `[${CONFIG.NAME}] [${level.toUpperCase()}]`;
        const timestamp = new Date().toLocaleTimeString();

        switch(level) {
            case 'info':
                console.log(`%c${prefix} ℹ️ ${message}`, 'color: #3498db; font-weight: bold;', data || '');
                break;
            case 'success':
                console.log(`%c${prefix} ✅ ${message}`, 'color: #27ae60; font-weight: bold;', data || '');
                break;
            case 'warn':
                console.warn(`%c${prefix} ⚠️ ${message}`, 'color: #f39c12; font-weight: bold;', data || '');
                break;
            case 'error':
                console.error(`%c${prefix} ❌ ${message}`, 'color: #e74c3c; font-weight: bold;', data || '');
                break;
            case 'critical':
                console.error(`%c${prefix} 🔴 CRÍTICO: ${message}`, 'color: #c0392b; font-size: 1.2em; font-weight: bold;', data || '');
                break;
            default:
                console.log(`${prefix} ${message}`, data || '');
        }
    }

    // ========== VERIFICAÇÃO DE MÓDULOS ESSENCIAIS ==========
    function checkCoreModules() {
        log('info', '🔍 Verificando módulos essenciais do Core System...');
        const modules = {
            'LoadingManager': { available: typeof window.LoadingManager !== 'undefined', critical: true },
            'SharedCore': { available: typeof window.SharedCore !== 'undefined', critical: true },
            'MediaSystem': { available: typeof window.MediaSystem !== 'undefined', critical: true },
            'PdfSystem': { available: typeof window.PdfSystem !== 'undefined', critical: true },
            'FilterManager': { available: typeof window.FilterManager !== 'undefined', critical: false },
            'supabaseClient': { available: typeof window.supabaseClient !== 'undefined', critical: false },
            'properties': { available: Array.isArray(window.properties), critical: true, count: window.properties?.length || 0 }
        };

        const results = {};
        let allCriticalAvailable = true;

        for (const [name, info] of Object.entries(modules)) {
            const status = info.available ? '✅' : (info.critical ? '❌' : '⚠️');
            results[name] = { ...info, status: info.available ? 'ok' : 'missing' };
            
            if (info.critical && !info.available) {
                allCriticalAvailable = false;
                log('critical', `Módulo crítico ausente: ${name}`);
            } else {
                log(info.available ? 'success' : 'warn', `${status} ${name} ${info.count ? '(' + info.count + ' imóveis)' : ''}`);
            }
        }

        systemHealth.modules = {
            status: allCriticalAvailable ? 'ok' : 'critical_missing',
            criticalMissing: !allCriticalAvailable,
            details: results
        };

        return results;
    }

    // ========== VERIFICAÇÃO DO LOADING MANAGER (BASEADO NO MÓDULO ANTERIOR) ==========
    function checkLoadingManager() {
        log('info', '⏳ Verificando LoadingManager (v6.1)...');
        const results = {
            basic: { passed: false, details: {} },
            integration: { passed: false, details: {} },
            performance: { passed: false, details: {} }
        };

        if (typeof window.LoadingManager === 'undefined') {
            log('error', 'LoadingManager não está disponível!');
            systemHealth.loadingManager = { status: 'missing', score: 0 };
            return results;
        }

        // 1. Verificação Básica
        try {
            const lm = window.LoadingManager;
            const methods = Object.keys(lm).filter(k => typeof lm[k] === 'function');
            const hasShow = typeof lm.show === 'function';
            const hasHide = typeof lm.hide === 'function';
            
            results.basic = {
                passed: hasShow && hasHide,
                details: {
                    available: true,
                    methods: methods,
                    hasShow,
                    hasHide,
                    hasUpdateMessage: typeof lm.updateMessage === 'function',
                    hasSetVariant: typeof lm.setVariant === 'function',
                    isFallback: methods.length <= 3 && hasShow && hasHide
                }
            };
            log(results.basic.passed ? 'success' : 'warn', 
                `LoadingManager básico: ${results.basic.passed ? 'OK' : 'Parcial'}`);
        } catch (e) {
            log('error', 'Erro na verificação básica do LoadingManager', e);
        }

        // 2. Verificação de Integração (ordem de carregamento)
        try {
            const resources = performance.getEntriesByType('resource') || [];
            const jsFiles = resources.filter(r => r.name.includes('.js'));
            
            const loadingScript = jsFiles.find(r => r.name.includes('loading-manager'));
            const adminScript = jsFiles.find(r => r.name.includes('admin.js'));
            
            const loadedInOrder = loadingScript && adminScript ? 
                loadingScript.startTime < adminScript.startTime : true; // Assume true se não achar
            
            results.integration = {
                passed: loadedInOrder,
                details: {
                    loadingManagerFound: !!loadingScript,
                    adminFound: !!adminScript,
                    loadedInOrder
                }
            };
            log('info', `Integração: ${loadedInOrder ? '✅ Correta' : '⚠️ Verificar ordem'}`);
        } catch (e) {
            log('warn', 'Não foi possível verificar ordem de carregamento');
        }

        // 3. Teste de Performance Rápido
        try {
            const start = performance.now();
            window.LoadingManager.show('Teste Diagnóstico');
            window.LoadingManager.hide();
            const duration = performance.now() - start;
            
            results.performance = {
                passed: duration < 50,
                details: {
                    showHideTime: duration.toFixed(2) + 'ms',
                    fast: duration < 50,
                    acceptable: duration < 100
                }
            };
            log('info', `Performance show/hide: ${duration.toFixed(2)}ms`);
        } catch (e) {
            log('error', 'Erro no teste de performance', e);
        }

        const score = [results.basic.passed, results.integration.passed, results.performance.passed]
            .filter(Boolean).length / 3 * 100;
        
        systemHealth.loadingManager = {
            status: score >= 80 ? 'excellent' : score >= 50 ? 'acceptable' : 'poor',
            score: Math.round(score),
            details: results
        };

        return results;
    }

    // ========== VERIFICAÇÃO DO SISTEMA DE MÍDIA ==========
    function checkMediaSystem() {
        log('info', '🖼️ Verificando MediaSystem...');
        const results = { initialized: false, upload: false, state: {} };

        if (typeof window.MediaSystem === 'undefined') {
            log('error', 'MediaSystem não disponível');
            return results;
        }

        try {
            const ms = window.MediaSystem;
            results.initialized = true;
            results.state = {
                files: ms.state?.files?.length || 0,
                pdfs: ms.state?.pdfs?.length || 0,
                existing: ms.state?.existing?.length || 0,
                isUploading: ms.state?.isUploading || false,
                currentPropertyId: ms.state?.currentPropertyId
            };

            results.upload = typeof ms.uploadAll === 'function' && typeof ms.addFiles === 'function';
            
            log('success', `MediaSystem OK | ${results.state.files} novos, ${results.state.existing} existentes`);
        } catch (e) {
            log('error', 'Erro ao verificar MediaSystem', e);
        }

        systemHealth.media = results;
        return results;
    }

    // ========== VERIFICAÇÃO DO SISTEMA PDF ==========
    function checkPdfSystem() {
        log('info', '📄 Verificando PdfSystem...');
        const results = { initialized: false, modal: false, methods: [] };

        if (typeof window.PdfSystem === 'undefined') {
            log('error', 'PdfSystem não disponível');
            return results;
        }

        try {
            const ps = window.PdfSystem;
            results.initialized = true;
            
            const methods = Object.keys(ps).filter(k => typeof ps[k] === 'function');
            results.methods = methods;
            
            results.modal = typeof ps.showModal === 'function' && 
                            typeof ps.validatePasswordAndShowList === 'function';
            
            log('success', `PdfSystem OK | ${methods.length} métodos disponíveis`);
        } catch (e) {
            log('error', 'Erro ao verificar PdfSystem', e);
        }

        systemHealth.pdf = results;
        return results;
    }

    // ========== VERIFICAÇÃO DO SHAREDCORE E FUNÇÕES UNIFICADAS ==========
    function checkSharedCore() {
        log('info', '🔧 Verificando SharedCore...');
        const results = { available: false, functions: {}, priceFormatter: false };

        if (typeof window.SharedCore === 'undefined') {
            log('error', 'SharedCore não disponível');
            return results;
        }

        try {
            const sc = window.SharedCore;
            results.available = true;

            // Verificar funções unificadas
            const essentialFunctions = [
                'formatFeaturesForDisplay',
                'parseFeaturesForStorage',
                'ensureBooleanVideo',
                'PriceFormatter'
            ];

            essentialFunctions.forEach(fn => {
                results.functions[fn] = typeof sc[fn] === 'function';
            });

            // Verificar PriceFormatter
            if (sc.PriceFormatter) {
                results.priceFormatter = {
                    available: true,
                    methods: Object.keys(sc.PriceFormatter).filter(k => typeof sc.PriceFormatter[k] === 'function')
                };
            }

            log('success', 'SharedCore OK | Funções unificadas disponíveis');
        } catch (e) {
            log('error', 'Erro ao verificar SharedCore', e);
        }

        systemHealth.sharedCore = results;
        return results;
    }

    // ========== VERIFICAÇÃO DO SUPABASE ==========
    async function checkSupabase() {
        log('info', '🌐 Verificando conexão Supabase...');
        const results = { clientAvailable: false, connected: false, tables: {} };

        if (typeof window.supabaseClient === 'undefined') {
            log('error', 'supabaseClient não disponível');
            return results;
        }

        try {
            results.clientAvailable = true;
            
            // Teste simples de consulta
            const { data, error } = await window.supabaseClient
                .from('properties')
                .select('count', { count: 'exact', head: true });

            results.connected = !error;
            results.error = error?.message;
            results.tableExists = !error;

            if (results.connected) {
                log('success', 'Conectado ao Supabase');
            } else {
                log('warn', 'Problema na conexão Supabase', error);
            }
        } catch (e) {
            log('error', 'Erro na verificação Supabase', e);
            results.error = e.message;
        }

        systemHealth.supabase = results;
        return results;
    }

    // ========== VERIFICAÇÃO DE PROPRIEDADES ==========
    function checkProperties() {
        log('info', '🏠 Verificando sistema de propriedades...');
        const results = { available: false, count: 0, localStorage: false, functions: {} };

        if (!Array.isArray(window.properties)) {
            log('error', 'window.properties não é um array');
            return results;
        }

        try {
            results.available = true;
            results.count = window.properties.length;

            // Verificar localStorage
            const stored = localStorage.getItem('properties');
            results.localStorage = !!stored;
            if (stored) {
                const parsed = JSON.parse(stored);
                results.localStorageCount = parsed.length;
                results.consistent = parsed.length === results.count;
            }

            // Funções essenciais
            const essentialFunctions = [
                'renderProperties', 'loadPropertiesData', 'savePropertiesToStorage',
                'addNewProperty', 'updateProperty', 'deleteProperty'
            ];
            
            essentialFunctions.forEach(fn => {
                results.functions[fn] = typeof window[fn] === 'function';
            });

            log('success', `Propriedades OK | ${results.count} imóveis, localStorage ${results.consistent ? '✅' : '⚠️'}`);
        } catch (e) {
            log('error', 'Erro ao verificar propriedades', e);
        }

        systemHealth.properties = results;
        return results;
    }

    // ========== EXECUTAR VERIFICAÇÃO COMPLETA ==========
    async function runFullDiagnostics() {
        log('info', '🚀 Iniciando diagnóstico completo v' + CONFIG.VERSION);
        console.group('📊 DIAGNÓSTICO DO SISTEMA');

        const results = {
            timestamp: new Date().toISOString(),
            version: CONFIG.VERSION,
            modules: checkCoreModules(),
            loadingManager: checkLoadingManager(),
            media: checkMediaSystem(),
            pdf: checkPdfSystem(),
            sharedCore: checkSharedCore(),
            properties: checkProperties(),
            supabase: await checkSupabase()
        };

        // Calcular score geral
        const scores = [];
        if (results.modules.status === 'ok') scores.push(100);
        if (results.loadingManager?.score) scores.push(results.loadingManager.score);
        if (results.media.initialized) scores.push(100);
        if (results.pdf.initialized) scores.push(100);
        if (results.sharedCore.available) scores.push(100);
        if (results.properties.available) scores.push(100);
        if (results.supabase.connected) scores.push(100);

        const avgScore = scores.length ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0;
        systemHealth.score = avgScore;
        systemHealth.status = avgScore >= 80 ? 'excellent' : avgScore >= 60 ? 'good' : 'needs_attention';

        log('success', `✅ DIAGNÓSTICO CONCLUÍDO - SCORE GERAL: ${avgScore}%`);
        console.groupEnd();

        return results;
    }

    // ========== CRIAR PAINEL VISUAL DE DIAGNÓSTICO ==========
    function createDiagnosticsPanel() {
        if (!CONFIG.DIAGNOSTICS) return;

        log('info', '🖥️ Criando painel de diagnóstico visual...');

        // Remover painel antigo se existir
        const oldPanel = document.getElementById('diagnostics-panel-v61');
        if (oldPanel) oldPanel.remove();

        const panel = document.createElement('div');
        panel.id = 'diagnostics-panel-v61';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            background: linear-gradient(135deg, #1a1a2e, #16213e);
            border: 2px solid #00fff9;
            border-radius: 15px;
            padding: 20px;
            z-index: 100000;
            box-shadow: 0 0 30px rgba(0, 255, 249, 0.3);
            font-family: 'Segoe UI', monospace;
            color: #fff;
            backdrop-filter: blur(5px);
        `;

        panel.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; border-bottom: 1px solid #00fff9; padding-bottom: 10px;">
                <h3 style="margin: 0; color: #00fff9; font-weight: bold;">🔍 DIAGNOSTICS v${CONFIG.VERSION}</h3>
                <button id="close-diagnostics-panel" style="background: #e74c3c; color: white; border: none; border-radius: 50%; width: 30px; height: 30px; cursor: pointer; font-size: 16px;">×</button>
            </div>
            <div id="diagnostics-content">
                <div style="text-align: center; padding: 20px;">
                    <div style="font-size: 18px; color: #00fff9;">Executando diagnóstico...</div>
                    <div style="width: 100%; height: 4px; background: rgba(0,255,249,0.2); margin-top: 15px; overflow: hidden;">
                        <div style="width: 100%; height: 100%; background: linear-gradient(90deg, #00fff9, #ff00aa); animation: loading 1.5s infinite;"></div>
                    </div>
                </div>
            </div>
            <style>
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                .diagnostic-item { background: rgba(0,255,249,0.1); margin: 10px 0; padding: 10px; border-radius: 8px; border-left: 4px solid; }
                .diagnostic-item.ok { border-left-color: #27ae60; }
                .diagnostic-item.warning { border-left-color: #f39c12; }
                .diagnostic-item.error { border-left-color: #e74c3c; }
            </style>
        `;

        document.body.appendChild(panel);

        document.getElementById('close-diagnostics-panel').addEventListener('click', () => {
            panel.remove();
        });

        diagnosticsPanel = panel;
    }

    // ========== ATUALIZAR PAINEL COM RESULTADOS ==========
    function updatePanelWithResults(results) {
        if (!diagnosticsPanel) return;

        const content = document.getElementById('diagnostics-content');
        if (!content) return;

        const statusColors = {
            ok: '#27ae60',
            warning: '#f39c12',
            error: '#e74c3c',
            critical: '#c0392b',
            missing: '#e74c3c',
            excellent: '#27ae60',
            acceptable: '#f39c12',
            poor: '#e74c3c'
        };

        const statusIcons = {
            ok: '✅',
            warning: '⚠️',
            error: '❌',
            critical: '🔴',
            missing: '❌',
            excellent: '🌟',
            acceptable: '🟡',
            poor: '🔻'
        };

        const formatValue = (value) => {
            if (value === true) return '✅';
            if (value === false) return '❌';
            return value;
        };

        let html = `
            <div style="margin-bottom: 20px; text-align: center; background: rgba(0,255,249,0.2); padding: 10px; border-radius: 8px;">
                <div style="font-size: 14px; color: #aaa;">Score Geral do Sistema</div>
                <div style="font-size: 32px; font-weight: bold; color: ${statusColors[systemHealth.status] || '#00fff9'}">
                    ${statusIcons[systemHealth.status] || '📊'} ${systemHealth.score}%
                </div>
                <div style="font-size: 12px; color: ${statusColors[systemHealth.status] || '#fff'}">
                    ${systemHealth.status?.toUpperCase() || 'DESCONHECIDO'}
                </div>
            </div>
        `;

        // Módulos
        if (results.modules) {
            html += `<div style="margin-top: 15px;"><strong>📦 MÓDULOS ESSENCIAIS</strong></div>`;
            for (const [name, info] of Object.entries(results.modules.details || {})) {
                const status = info.available ? 'ok' : (info.critical ? 'critical' : 'warning');
                html += `
                    <div class="diagnostic-item ${status}">
                        <div style="display: flex; justify-content: space-between;">
                            <span>${name}</span>
                            <span style="color: ${statusColors[status]}">${statusIcons[status]}</span>
                        </div>
                        ${info.count !== undefined ? `<div style="font-size: 11px; color: #aaa;">${info.count} imóveis</div>` : ''}
                    </div>
                `;
            }
        }

        // Loading Manager
        if (results.loadingManager) {
            const lmStatus = results.loadingManager.score >= 80 ? 'ok' : 
                            results.loadingManager.score >= 50 ? 'warning' : 'error';
            html += `
                <div style="margin-top: 15px;"><strong>⏳ LOADING MANAGER</strong></div>
                <div class="diagnostic-item ${lmStatus}">
                    <div>Score: ${results.loadingManager.score}%</div>
                    <div style="font-size: 11px; color: #aaa;">
                        Show: ${formatValue(results.loadingManager.details?.basic?.details?.hasShow)} |
                        Hide: ${formatValue(results.loadingManager.details?.basic?.details?.hasHide)} |
                        ${results.loadingManager.details?.basic?.details?.isFallback ? 'Fallback' : 'Custom'}
                    </div>
                </div>
            `;
        }

        // Mídia
        if (results.media) {
            html += `
                <div style="margin-top: 15px;"><strong>🖼️ MEDIA SYSTEM</strong></div>
                <div class="diagnostic-item ${results.media.initialized ? 'ok' : 'error'}">
                    <div>Status: ${results.media.initialized ? '✅ Ativo' : '❌ Inativo'}</div>
                    <div style="font-size: 11px; color: #aaa;">
                        Novos: ${results.media.state?.files || 0} | 
                        PDFs: ${results.media.state?.pdfs || 0} |
                        Existentes: ${results.media.state?.existing || 0}
                    </div>
                </div>
            `;
        }

        // PDF
        if (results.pdf) {
            html += `
                <div style="margin-top: 15px;"><strong>📄 PDF SYSTEM</strong></div>
                <div class="diagnostic-item ${results.pdf.initialized ? 'ok' : 'error'}">
                    <div>Status: ${results.pdf.initialized ? '✅ Ativo' : '❌ Inativo'}</div>
                    <div style="font-size: 11px; color: #aaa;">Métodos: ${results.pdf.methods?.length || 0}</div>
                </div>
            `;
        }

        // SharedCore
        if (results.sharedCore) {
            html += `
                <div style="margin-top: 15px;"><strong>🔧 SHAREDCORE</strong></div>
                <div class="diagnostic-item ${results.sharedCore.available ? 'ok' : 'error'}">
                    <div>Status: ${results.sharedCore.available ? '✅ Disponível' : '❌ Indisponível'}</div>
                    <div style="font-size: 11px; color: #aaa;">
                        Features: ${formatValue(results.sharedCore.functions?.formatFeaturesForDisplay)} |
                        Video: ${formatValue(results.sharedCore.functions?.ensureBooleanVideo)}
                    </div>
                </div>
            `;
        }

        // Propriedades
        if (results.properties) {
            html += `
                <div style="margin-top: 15px;"><strong>🏠 PROPRIEDADES</strong></div>
                <div class="diagnostic-item ${results.properties.available ? 'ok' : 'error'}">
                    <div>${results.properties.count || 0} imóveis</div>
                    <div style="font-size: 11px; color: #aaa;">
                        localStorage: ${formatValue(results.properties.localStorage)} |
                        Consistente: ${formatValue(results.properties.consistent)}
                    </div>
                </div>
            `;
        }

        // Supabase
        if (results.supabase) {
            html += `
                <div style="margin-top: 15px;"><strong>🌐 SUPABASE</strong></div>
                <div class="diagnostic-item ${results.supabase.connected ? 'ok' : results.supabase.clientAvailable ? 'warning' : 'error'}">
                    <div>${results.supabase.connected ? '✅ Conectado' : '❌ Desconectado'}</div>
                    ${results.supabase.error ? `<div style="font-size: 11px; color: #e74c3c;">${results.supabase.error}</div>` : ''}
                </div>
            `;
        }

        // Timestamp
        html += `
            <div style="margin-top: 20px; font-size: 10px; color: #666; text-align: center;">
                Diagnóstico executado em: ${new Date(results.timestamp).toLocaleString()}
            </div>
        `;

        content.innerHTML = html;
    }

    // ========== INICIALIZAÇÃO ==========
    async function init() {
        log('info', `🚀 Inicializando ${CONFIG.NAME}`);

        // Criar painel se necessário
        if (CONFIG.DIAGNOSTICS) {
            createDiagnosticsPanel();
        }

        // Executar diagnóstico completo
        try {
            const results = await runFullDiagnostics();
            
            if (CONFIG.DIAGNOSTICS && diagnosticsPanel) {
                updatePanelWithResults(results);
            }

            // Resumo no console
            console.log('%c📊 RESUMO DO DIAGNÓSTICO v' + CONFIG.VERSION, 'font-size: 16px; font-weight: bold; color: #00fff9;');
            console.table({
                'Módulos Críticos': results.modules?.status === 'ok' ? '✅ OK' : '❌ PROBLEMA',
                'LoadingManager': results.loadingManager?.score + '%',
                'MediaSystem': results.media?.initialized ? '✅ OK' : '❌',
                'PdfSystem': results.pdf?.initialized ? '✅ OK' : '❌',
                'SharedCore': results.sharedCore?.available ? '✅ OK' : '❌',
                'Propriedades': results.properties?.count || 0,
                'Supabase': results.supabase?.connected ? '✅' : '❌',
                'Score Geral': systemHealth.score + '%'
            });

            // Verificar se há problemas críticos
            if (systemHealth.score < 60) {
                log('warn', '⚠️ Score abaixo de 60% - Verificar problemas detectados');
            } else if (systemHealth.score >= 90) {
                log('success', '🎉 Sistema em excelente estado!');
            }

            // Expor resultados globalmente
            window.__diagnosticsResults = results;
            window.__diagnosticsVersion = CONFIG.VERSION;

        } catch (error) {
            log('error', 'Erro ao executar diagnóstico completo', error);
        }

        log('info', `✅ ${CONFIG.NAME} inicializado com sucesso`);
        log('info', '📋 Comandos disponíveis: window.__diagnosticsResults (resultados), window.__diagnosticsVersion');
    }

    // ========== EXECUTAR QUANDO DOM ESTIVER PRONTO ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    } else {
        setTimeout(init, 1000);
    }

    // Expor API pública
    window.DiagnosticsV61 = {
        run: runFullDiagnostics,
        getResults: () => systemHealth,
        getPanel: () => diagnosticsPanel,
        version: CONFIG.VERSION
    };

    log('info', `✅ ${CONFIG.NAME} carregado - API disponível em window.DiagnosticsV61`);

})();
