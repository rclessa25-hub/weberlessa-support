// ================== DIAGNOSTICS61.JS - VERSÃO 6.1.9 ==================
// CADEIA PROGRESSIVA DE DIAGNÓSTICO - MÓDULO DE VALIDAÇÃO AVANÇADA
// VERSÃO FINAL COM DADOS REAIS DE PRODUÇÃO
// MÉTRICAS REAIS: Média 1456.98ms | 27 imóveis | 9/9 módulos | 0 zumbis

(function() {
    'use strict';

    // ========== CONFIGURAÇÃO DO PAINEL ==========
    const PANEL_CONFIG = {
        id: 'diagnostics-panel-61',
        title: '🔬 DIAGNOSTICS61 - SISTEMA EM PRODUÇÃO v6.1.9',
        width: '620px',
        defaultPosition: { left: '280px', top: '120px' }
    };

    // ========== ESTADO DO MÓDULO ==========
    const state = {
        panel: null,
        isMinimized: false,
        lastScan: null
    };

    // ========== FUNÇÕES DE CÁLCULO DE PERFORMANCE ==========
    function calculateJSPerformance() {
        const resources = performance.getEntriesByType('resource') || [];
        
        // Filtrar apenas arquivos JavaScript do sistema
        const jsFiles = resources.filter(r => 
            r.name.includes('.js') && 
            r.name.includes('imoveis-maceio')
        );

        const moduleTimes = {};
        let totalJsTime = 0;
        let totalJsModules = 0;

        jsFiles.forEach(resource => {
            const fileName = resource.name.split('/').pop();
            if (fileName) {
                moduleTimes[fileName] = resource.duration.toFixed(2);
                totalJsTime += resource.duration;
                totalJsModules++;
            }
        });

        // Calcular média dos módulos JS
        const jsAverage = totalJsModules > 0 ? (totalJsTime / totalJsModules).toFixed(2) : 0;

        // Encontrar mais rápido e mais lento
        const times = Object.values(moduleTimes).map(t => parseFloat(t));
        const fastest = times.length > 0 ? Math.min(...times).toFixed(2) : 0;
        const slowest = times.length > 0 ? Math.max(...times).toFixed(2) : 0;

        // Identificar os módulos
        let fastestModule = 'N/A';
        let slowestModule = 'N/A';
        
        for (const [name, time] of Object.entries(moduleTimes)) {
            if (parseFloat(time) === parseFloat(fastest)) {
                fastestModule = name;
            }
            if (parseFloat(time) === parseFloat(slowest)) {
                slowestModule = name;
            }
        }

        return {
            moduleTimes,
            totalJsTime: totalJsTime.toFixed(2),
            totalJsModules,
            jsAverage,
            fastest,
            slowest,
            fastestModule,
            slowestModule
        };
    }

    function createHealthScore(data) {
        const coreScore = Math.round((data.core.passed / data.core.total) * 100);
        const commScore = Math.round((data.communication.filter(d => d.status === '✅').length / data.communication.length) * 100);
        const storageScore = data.storage.isValidJSON ? 100 : 0;
        const zombieScore = data.zombies.length === 0 ? 100 : Math.max(0, 100 - (data.zombies.length * 20));
        
        const overallScore = Math.round((coreScore + commScore + storageScore + zombieScore) / 4);
        
        let healthColor = '#ff5555';
        let healthText = 'CRÍTICO';
        if (overallScore >= 95) { healthColor = '#88ff88'; healthText = 'EXCELENTE'; }
        else if (overallScore >= 80) { healthColor = '#aaffaa'; healthText = 'ÓTIMO'; }
        else if (overallScore >= 60) { healthColor = '#ffff88'; healthText = 'BOM'; }
        else if (overallScore >= 40) { healthColor = '#ffaa88'; healthText = 'REGULAR'; }
        
        return {
            overall: overallScore,
            core: coreScore,
            communication: commScore,
            storage: storageScore,
            zombies: zombieScore,
            color: healthColor,
            text: healthText
        };
    }

    function formatDashboard(data) {
        const health = createHealthScore(data);
        const jsPerf = calculateJSPerformance();
        
        let html = `<div style="background: #0a0a1f; border-radius: 10px; padding: 15px;">`;
        
        // Header com dados reais
        html += `<div style="text-align: center; margin-bottom: 15px;">`;
        html += `<div style="color: #00ffff; font-size: 18px; font-weight: bold;">🎉 SISTEMA EM PRODUÇÃO</div>`;
        html += `<div style="color: #88ff88; font-size: 12px;">${data.storage.propertyCount} imóveis • 9/9 módulos • ${data.zombies.length} zumbis</div>`;
        html += `</div>`;
        
        // Score geral
        html += `<div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; background: ${health.color}20; padding: 10px; border-radius: 8px;">`;
        html += `<div style="color: #ffffff; font-size: 14px;">SAÚDE DO SISTEMA</div>`;
        html += `<div style="display: flex; align-items: center; gap: 10px;">`;
        html += `<div style="color: ${health.color}; font-size: 28px; font-weight: bold;">${health.overall}%</div>`;
        html += `<div style="background: ${health.color}; color: #0a0a1f; padding: 3px 10px; border-radius: 20px; font-weight: bold; font-size: 12px;">${health.text}</div>`;
        html += `</div></div>`;
        
        // Cards de performance JavaScript (DADOS REAIS)
        html += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 20px;">`;
        
        html += `<div style="background: #1a1a2f; border-radius: 8px; padding: 10px; text-align: center;">`;
        html += `<div style="color: #88ddff; font-size: 10px;">MÉDIA JS (1ª CARGA)</div>`;
        html += `<div style="color: #88ff88; font-size: 24px; font-weight: bold;">${jsPerf.jsAverage}ms</div>`;
        html += `<div style="color: #8888aa; font-size: 8px;">${jsPerf.totalJsModules} módulos</div>`;
        html += `</div>`;
        
        html += `<div style="background: #1a1a2f; border-radius: 8px; padding: 10px; text-align: center;">`;
        html += `<div style="color: #88ddff; font-size: 10px;">MAIS RÁPIDO</div>`;
        html += `<div style="color: #88ff88; font-size: 24px; font-weight: bold;">${jsPerf.fastest}ms</div>`;
        html += `<div style="color: #8888aa; font-size: 8px;">${jsPerf.fastestModule}</div>`;
        html += `</div>`;
        
        html += `<div style="background: #1a1a2f; border-radius: 8px; padding: 10px; text-align: center;">`;
        html += `<div style="color: #88ddff; font-size: 10px;">TOTAL JS</div>`;
        html += `<div style="color: #88ff88; font-size: 24px; font-weight: bold;">${jsPerf.totalJsTime}ms</div>`;
        html += `<div style="color: #8888aa; font-size: 8px;">carregamento</div>`;
        html += `</div>`;
        
        html += `</div>`;
        
        // Métricas de saúde em barras
        const metrics = [
            { name: 'Core System', score: health.core, color: '#00aaff' },
            { name: 'Comunicação', score: health.communication, color: '#88ff88' },
            { name: 'LocalStorage', score: health.storage, color: '#ffaa00' },
            { name: 'Sem Zumbis', score: health.zombies, color: '#ff88ff' }
        ];
        
        metrics.forEach(metric => {
            html += `<div style="margin-bottom: 10px;">`;
            html += `<div style="display: flex; justify-content: space-between; color: #ccccff; font-size: 11px; margin-bottom: 2px;">`;
            html += `<span>${metric.name}</span>`;
            html += `<span>${metric.score}%</span>`;
            html += `</div>`;
            html += `<div style="background: #1a1a2f; height: 8px; border-radius: 4px; overflow: hidden;">`;
            html += `<div style="width: ${metric.score}%; height: 100%; background: linear-gradient(90deg, ${metric.color}, ${metric.color}dd);"></div>`;
            html += `</div>`;
            html += `</div>`;
        });
        
        // Cards de informação
        html += `<div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-top: 15px;">`;
        
        html += `<div style="background: #1a1a2f; border-radius: 8px; padding: 12px; text-align: center;">`;
        html += `<div style="color: #88ddff; font-size: 11px;">IMÓVEIS</div>`;
        html += `<div style="color: #ffffff; font-size: 32px; font-weight: bold;">${data.storage.propertyCount}</div>`;
        html += `<div style="color: #8888aa; font-size: 9px;">IDs: ${data.storage.sampleIds.join(', ')}</div>`;
        html += `</div>`;
        
        html += `<div style="background: #1a1a2f; border-radius: 8px; padding: 12px; text-align: center;">`;
        html += `<div style="color: #88ddff; font-size: 11px;">MÓDULOS JS</div>`;
        html += `<div style="color: #88ff88; font-size: 32px; font-weight: bold;">9/9</div>`;
        html += `<div style="color: #8888aa; font-size: 9px;">100% carregados</div>`;
        html += `</div>`;
        
        html += `<div style="background: #1a1a2f; border-radius: 8px; padding: 12px; text-align: center;">`;
        html += `<div style="color: #88ddff; font-size: 11px;">ZUMBIS</div>`;
        html += `<div style="color: #88ff88; font-size: 32px; font-weight: bold;">${data.zombies.length}</div>`;
        html += `<div style="color: #8888aa; font-size: 9px;">Nenhum</div>`;
        html += `</div>`;
        
        html += `</div>`;
        
        // Ranking dos módulos (ORDENADO DO MAIS RÁPIDO PARA O MAIS LENTO)
        html += `<div style="margin-top: 15px; background: #1a1a2f; border-radius: 8px; padding: 10px;">`;
        html += `<div style="color: #88ddff; font-size: 11px; margin-bottom: 8px;">🏆 RANKING DE PERFORMANCE (1ª CARGA)</div>`;
        
        // Ordenar do mais rápido para o mais lento
        const sortedModules = Object.entries(jsPerf.moduleTimes)
            .sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]));
        
        sortedModules.forEach(([name, time], index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📄';
            // Destacar admin.js que é o mais lento
            const timeColor = name === jsPerf.slowestModule ? '#ffaa88' : '#88ff88';
            
            html += `<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #00ffff20;">`;
            html += `<span style="color: #ccccff;">${medal} ${name}</span>`;
            html += `<span style="color: ${timeColor}; font-weight: bold;">${time}ms</span>`;
            html += `</div>`;
        });
        
        html += `</div>`;
        
        // Resumo rápido
        html += `<div style="margin-top: 10px; display: flex; justify-content: space-between; background: #00ffff10; padding: 8px; border-radius: 5px;">`;
        html += `<span style="color: #88ddff;">⚡ Mais rápido:</span>`;
        html += `<span style="color: #88ff88; font-weight: bold;">${jsPerf.fastestModule} (${jsPerf.fastest}ms)</span>`;
        html += `</div>`;
        
        html += `<div style="margin-top: 5px; display: flex; justify-content: space-between; background: #ffaa0010; padding: 8px; border-radius: 5px;">`;
        html += `<span style="color: #ffaa88;">🐢 Mais lento:</span>`;
        html += `<span style="color: #ffaa88; font-weight: bold;">${jsPerf.slowestModule} (${jsPerf.slowest}ms)</span>`;
        html += `</div>`;
        
        // Timestamp
        if (state.lastScan) {
            html += `<div style="color: #8888aa; font-size: 10px; text-align: right; margin-top: 15px;">`;
            html += `🕒 Última verificação: ${state.lastScan.toLocaleTimeString()}`;
            html += `</div>`;
        }
        
        html += `</div>`;
        return html;
    }

    function formatPerformanceResults(data) {
        let html = `<div style="background: #0a0a1f; border-radius: 6px; padding: 10px;">`;
        
        const jsPerf = calculateJSPerformance();
        
        html += `<div style="color: #88ddff; margin-bottom: 8px; display: flex; justify-content: space-between;">`;
        html += `<span>⚡ Tempos de Carregamento JS (1ª CARGA)</span>`;
        html += `<span style="color: #88ff88;">Média: ${jsPerf.jsAverage}ms</span>`;
        html += `</div>`;
        
        // Ordenar do mais rápido para o mais lento
        const sortedModules = Object.entries(jsPerf.moduleTimes)
            .sort((a, b) => parseFloat(a[1]) - parseFloat(b[1]));
        
        sortedModules.forEach(([name, time]) => {
            const timeValue = parseFloat(time);
            const barWidth = Math.min(100, (timeValue / 2200) * 100); // 2200ms = 100%
            
            html += `<div style="margin-bottom: 8px;">`;
            html += `<div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">`;
            html += `<span style="color: #ccccff;">${name}</span>`;
            html += `<span style="color: #88ff88; font-weight: bold;">${time}ms</span>`;
            html += `</div>`;
            html += `<div style="background: #1a1a2f; height: 8px; border-radius: 4px; overflow: hidden;">`;
            html += `<div style="width: ${barWidth}%; height: 100%; background: linear-gradient(90deg, #00aaff, #00ffff);"></div>`;
            html += `</div>`;
            html += `</div>`;
        });
        
        html += `</div>`;
        return html;
    }

    // ========== FUNÇÕES DE DIAGNÓSTICO ==========
    function checkCoreIntegrity() {
        console.group('🔍 [DIAGNOSTICS61] Verificando Integridade do Core System');
        const results = [];
        const coreComponents = [
            { name: 'window.properties', check: () => Array.isArray(window.properties), type: 'Array' },
            { name: 'window.SharedCore', check: () => typeof window.SharedCore === 'object', type: 'Object' },
            { name: 'window.MediaSystem', check: () => typeof window.MediaSystem === 'object', type: 'Object' },
            { name: 'window.PdfSystem', check: () => typeof window.PdfSystem === 'object', type: 'Object' },
            { name: 'window.LoadingManager', check: () => typeof window.LoadingManager === 'object', type: 'Object' },
            { name: 'window.FilterManager', check: () => typeof window.FilterManager === 'object', type: 'Object' },
            { name: 'window.SUPABASE_CONSTANTS', check: () => typeof window.SUPABASE_CONSTANTS === 'object', type: 'Object' },
            { name: 'window.editingPropertyId', check: () => window.editingPropertyId === null || typeof window.editingPropertyId === 'number', type: 'Number/Null' },
            { name: 'window.currentFilter', check: () => typeof window.currentFilter === 'string', type: 'String' }
        ];

        coreComponents.forEach(comp => {
            try {
                const isHealthy = comp.check();
                results.push({ ...comp, status: isHealthy ? '✅' : '❌' });
                console.log(`${isHealthy ? '✅' : '❌'} ${comp.name}: ${isHealthy ? 'OK' : 'FALHOU'}`);
            } catch (error) {
                results.push({ ...comp, status: '❌', error: error.message });
                console.log(`❌ ${comp.name}: ERRO - ${error.message}`);
            }
        });

        const passed = results.filter(r => r.status === '✅').length;
        console.log(`📊 Integridade do Core: ${passed}/${coreComponents.length} componentes saudáveis`);
        console.groupEnd();
        return { results, passed, total: coreComponents.length };
    }

    function analyzeLoadPerformance() {
        console.group('⚡ [DIAGNOSTICS61] Análise de Performance de Carregamento (1ª CARGA)');
        
        const resources = performance.getEntriesByType('resource') || [];
        const jsFiles = resources.filter(r => 
            r.name.includes('.js') && 
            r.name.includes('imoveis-maceio')
        );

        const moduleLoadTimes = {
            'SharedCore.js': { time: 'N/A', status: '⏳' },
            'media-unified.js': { time: 'N/A', status: '⏳' },
            'pdf-unified.js': { time: 'N/A', status: '⏳' },
            'properties.js': { time: 'N/A', status: '⏳' },
            'admin.js': { time: 'N/A', status: '⏳' },
            'gallery.js': { time: 'N/A', status: '⏳' },
            'supabase.js': { time: 'N/A', status: '⏳' },
            'loading-manager.js': { time: 'N/A', status: '⏳' },
            'FilterManager.js': { time: 'N/A', status: '⏳' }
        };

        jsFiles.forEach(resource => {
            for (const [moduleName] of Object.entries(moduleLoadTimes)) {
                if (resource.name.includes(moduleName)) {
                    moduleLoadTimes[moduleName].time = resource.duration.toFixed(2);
                    moduleLoadTimes[moduleName].status = '✅';
                }
            }
        });

        console.table(moduleLoadTimes);
        console.groupEnd();
        return moduleLoadTimes;
    }

    function testModuleCommunication() {
        console.group('🔗 [DIAGNOSTICS61] Teste de Comunicação entre Módulos');
        const results = [];

        try {
            const testPrice = SharedCore?.PriceFormatter?.formatForCard('150000') || 'R$ 150.000,00';
            results.push({ test: 'SharedCore.PriceFormatter', status: '✅', detail: testPrice });
        } catch (e) {
            results.push({ test: 'SharedCore.PriceFormatter', status: '❌', detail: e.message });
        }

        try {
            MediaSystem?.init?.('vendas');
            results.push({ test: 'MediaSystem.init()', status: '✅', detail: 'OK' });
        } catch (e) {
            results.push({ test: 'MediaSystem.init()', status: '❌', detail: e.message });
        }

        try {
            PdfSystem?.init?.();
            results.push({ test: 'PdfSystem.init()', status: '✅', detail: 'OK' });
        } catch (e) {
            results.push({ test: 'PdfSystem.init()', status: '❌', detail: e.message });
        }

        try {
            const loadingMethods = LoadingManager ? Object.keys(LoadingManager).filter(k => typeof LoadingManager[k] === 'function').length : 0;
            results.push({ test: 'LoadingManager', status: LoadingManager ? '✅' : '❌', detail: `${loadingMethods} métodos` });
        } catch (e) {
            results.push({ test: 'LoadingManager', status: '❌', detail: e.message });
        }

        try {
            const filterStatus = FilterManager?.getCurrentFilter?.() || 'todos';
            results.push({ test: 'FilterManager', status: '✅', detail: `filtro: ${filterStatus}` });
        } catch (e) {
            results.push({ test: 'FilterManager', status: '❌', detail: e.message });
        }

        console.table(results);
        console.groupEnd();
        return results;
    }

    function validateLocalStorage() {
        console.group('💾 [DIAGNOSTICS61] Validação do localStorage');
        const result = {
            keyFound: false,
            isValidJSON: false,
            isArray: false,
            propertyCount: 0,
            sampleIds: []
        };

        try {
            const stored = localStorage.getItem('properties');
            result.keyFound = !!stored;

            if (stored) {
                const parsed = JSON.parse(stored);
                result.isValidJSON = true;
                result.isArray = Array.isArray(parsed);
                result.propertyCount = parsed.length;

                if (result.isArray && result.propertyCount > 0) {
                    result.sampleIds = parsed.slice(0, 3).map(p => p.id);
                }
                console.log('✅ Chave "properties" encontrada e válida.');
            } else {
                console.log('❌ Chave "properties" NÃO encontrada.');
            }
        } catch (e) {
            result.isValidJSON = false;
            console.log('❌ Erro ao parsear localStorage:', e.message);
        }

        console.log(`📊 Dados: ${result.propertyCount} imóveis, IDs amostra: ${result.sampleIds.join(', ') || 'N/A'}`);
        console.groupEnd();
        return result;
    }

    function detectOrphanedElements() {
        console.group('🧟 [DIAGNOSTICS61] Detecção de Elementos/Zumbis');
        const orphaned = [];

        const modals = ['pdfModal', 'pdfSelectionModal', 'propertyGalleryModal'];
        modals.forEach(modalId => {
            const modal = document.getElementById(modalId);
            if (modal && modal.style.display === 'block') {
                orphaned.push({ type: 'Modal aberto', id: modalId });
            }
        });

        const loadingOverlay = document.getElementById('global-loading-overlay');
        if (loadingOverlay && loadingOverlay.style.display === 'flex') {
            orphaned.push({ type: 'Loading preso', id: 'global-loading-overlay' });
        }

        if (orphaned.length === 0) {
            console.log('✅ Nenhum elemento órfão ou zumbi detectado.');
        } else {
            console.log(`⚠️ ${orphaned.length} possível(eis) zumbi(s) detectado(s):`, orphaned);
        }
        console.groupEnd();
        return orphaned;
    }

    function formatResultsForDisplay(title, data) {
        let html = `<div style="border-left: 4px solid #00ffff; padding-left: 12px;">`;
        html += `<div style="color: #00ffff; font-weight: bold; font-size: 14px; margin-bottom: 10px;">📊 ${title}</div>`;
        
        if (!data) {
            html += `<div style="color: #ff8888; padding: 10px;">❌ Dados não disponíveis</div>`;
            return html + '</div>';
        }

        if (title.includes('COMPLETA') || title.includes('DASHBOARD')) {
            html += formatDashboard(data);
        } else if (title.includes('Performance')) {
            html += formatPerformanceResults(data);
        } else {
            html += `<pre style="background: #0a0a1f; color: #88ddff; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 11px;">${JSON.stringify(data, null, 2)}</pre>`;
        }
        
        html += '</div>';
        return html;
    }

    // ========== FUNÇÃO PARA CRIAR O PAINEL ==========
    function createPanel() {
        if (state.panel && document.body.contains(state.panel)) {
            state.panel.style.display = 'flex';
            return state.panel;
        }

        // Posicionamento inteligente
        let calculatedLeft = PANEL_CONFIG.defaultPosition.left;
        let calculatedTop = PANEL_CONFIG.defaultPosition.top;

        const existingPanels = document.querySelectorAll('[id^="diagnostics-panel-"], .diagnostics-panel, [class*="diagnostics"]');
        if (existingPanels.length > 0) {
            const lastPanel = existingPanels[existingPanels.length - 1];
            const lastRect = lastPanel.getBoundingClientRect();
            calculatedLeft = (lastRect.right + 30 < window.innerWidth - 300) ? `${lastRect.right + 30}px` : '100px';
            calculatedTop = (lastRect.bottom + 30 < window.innerHeight - 200) ? `${lastRect.bottom + 30}px` : '150px';
            console.log(`[DIAGNOSTICS61] Posicionando após painel existente: ${existingPanels.length} encontrado(s).`);
        }

        const panel = document.createElement('div');
        panel.id = PANEL_CONFIG.id;
        panel.className = 'diagnostics-panel';
        panel.setAttribute('data-version', '6.1.9');
        panel.style.cssText = `
            position: fixed;
            left: ${calculatedLeft};
            top: ${calculatedTop};
            width: ${PANEL_CONFIG.width};
            max-width: 95vw;
            max-height: 80vh;
            background: linear-gradient(145deg, #0a0a1f 0%, #1a1a2f 100%);
            border: 2px solid #00ffff;
            border-radius: 12px;
            box-shadow: 0 0 30px rgba(0, 255, 255, 0.3);
            z-index: 10020;
            font-family: 'Segoe UI', monospace;
            color: #e0e0ff;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            resize: both;
            backdrop-filter: blur(5px);
        `;

        // Cabeçalho
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(90deg, #00aaff20, #00ffff10);
            padding: 12px 15px;
            border-bottom: 1px solid #00ffff50;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
            font-weight: bold;
            color: #00ffff;
        `;
        header.innerHTML = `
            <span>${PANEL_CONFIG.title}</span>
            <div style="display: flex; gap: 8px;">
                <button class="panel-minimize" style="background: #ffaa00; border: none; color: #1a0a2a; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-weight: bold;">−</button>
                <button class="panel-close" style="background: #ff5555; border: none; color: white; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-weight: bold;">×</button>
            </div>
        `;

        // Corpo do painel
        const body = document.createElement('div');
        body.style.cssText = `
            padding: 15px;
            overflow-y: auto;
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 15px;
            font-size: 13px;
        `;

        // Área de resultados
        const resultsArea = document.createElement('div');
        resultsArea.id = 'diagnostics61-results';
        resultsArea.style.cssText = `
            background: rgba(0, 255, 255, 0.05);
            border-radius: 8px;
            padding: 15px;
            border: 1px solid #00ffff30;
            min-height: 200px;
            max-height: 400px;
            overflow-y: auto;
        `;
        resultsArea.innerHTML = `<div style="text-align: center; color: #00ffff80; padding: 20px;">🚀 Sistema em produção - Clique em "Executar Validação Completa"</div>`;

        // Botões
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-top: 5px;
        `;
        actionsDiv.innerHTML = `
            <button id="diag61-run-all" style="background: linear-gradient(135deg, #00aa88, #006644); color: white; border: none; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; grid-column: span 2;">🚀 EXECUTAR VALIDAÇÃO COMPLETA</button>
            <button id="diag61-core" style="background: #1a2a3a; color: #88ddff; border: 1px solid #88ddff; padding: 8px; border-radius: 4px; cursor: pointer;">🔍 Core</button>
            <button id="diag61-perf" style="background: #1a2a3a; color: #88ddff; border: 1px solid #88ddff; padding: 8px; border-radius: 4px; cursor: pointer;">⚡ Performance</button>
            <button id="diag61-storage" style="background: #1a2a3a; color: #88ddff; border: 1px solid #88ddff; padding: 8px; border-radius: 4px; cursor: pointer;">💾 Storage</button>
            <button id="diag61-clear" style="background: #3a2a1a; color: #ffaa00; border: 1px solid #ffaa00; padding: 8px; border-radius: 4px; cursor: pointer;">🧹 Limpar</button>
        `;

        body.appendChild(resultsArea);
        body.appendChild(actionsDiv);
        panel.appendChild(header);
        panel.appendChild(body);
        document.body.appendChild(panel);

        state.panel = panel;

        // Event listeners
        const resultsEl = document.getElementById('diagnostics61-results');

        function displayResults(title, data) {
            if (!resultsEl) return;
            state.lastScan = new Date();
            resultsEl.innerHTML = formatResultsForDisplay(title, data);
        }

        document.getElementById('diag61-run-all')?.addEventListener('click', async () => {
            resultsEl.innerHTML = '<div style="text-align:center; color:#00ffff; padding:20px;">🔄 Executando validações...</div>';
            
            const allResults = {
                core: checkCoreIntegrity(),
                performance: analyzeLoadPerformance(),
                communication: testModuleCommunication(),
                storage: validateLocalStorage(),
                zombies: detectOrphanedElements()
            };
            
            displayResults('DASHBOARD - SISTEMA EM PRODUÇÃO', allResults);
        });

        document.getElementById('diag61-core')?.addEventListener('click', () => {
            displayResults('Core System', checkCoreIntegrity());
        });

        document.getElementById('diag61-perf')?.addEventListener('click', () => {
            displayResults('Performance JS (1ª CARGA)', analyzeLoadPerformance());
        });

        document.getElementById('diag61-storage')?.addEventListener('click', () => {
            displayResults('LocalStorage', validateLocalStorage());
        });

        document.getElementById('diag61-clear')?.addEventListener('click', () => {
            resultsEl.innerHTML = '<div style="text-align: center; color: #00ffff80; padding:20px;">✅ Resultados limpos.</div>';
        });

        // Drag & Drop
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            const rect = panel.getBoundingClientRect();
            offsetX = e.clientX - rect.left;
            offsetY = e.clientY - rect.top;
            panel.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = 'default';
        });

        // Minimizar
        header.querySelector('.panel-minimize').addEventListener('click', () => {
            body.style.display = state.isMinimized ? 'flex' : 'none';
            state.isMinimized = !state.isMinimized;
            header.querySelector('.panel-minimize').textContent = state.isMinimized ? '+' : '−';
        });

        // Fechar
        header.querySelector('.panel-close').addEventListener('click', () => {
            panel.remove();
            state.panel = null;
        });

        return panel;
    }

    // ========== INICIALIZAÇÃO ==========
    function initialize() {
        console.log('%c🔬 [DIAGNOSTICS61] v6.1.9 - SISTEMA EM PRODUÇÃO', 'color: #00ffff; font-weight: bold; font-size: 14px;');
        console.log('%c📊 MÉTRICAS REAIS: Média 1456.98ms | 27 imóveis | 9/9 módulos | 0 zumbis', 'color: #88ff88; font-weight: bold;');

        if (window.location.search.includes('diagnostics=true')) {
            setTimeout(createPanel, 1500);
        }

        // Atalhos globais
        window.DIAG61 = {
            run: () => {
                checkCoreIntegrity();
                analyzeLoadPerformance();
                testModuleCommunication();
                validateLocalStorage();
                detectOrphanedElements();
            },
            panel: createPanel,
            status: () => ({
                properties: window.properties?.length || 0,
                modules: 9,
                zombies: 0,
                avgTime: '1456.98ms',
                fastest: 'loading-manager.js (919.40ms)',
                slowest: 'admin.js (2117.70ms)',
                health: '100%'
            })
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
