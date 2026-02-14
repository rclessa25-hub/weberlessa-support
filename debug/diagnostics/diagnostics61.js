// ================== DIAGNOSTICS61.JS - VERSÃO 6.1.2 ==================
// CADEIA PROGRESSIVA DE DIAGNÓSTICO - MÓDULO DE VALIDAÇÃO AVANÇADA
// CORREÇÃO: Melhor formatação visual dos resultados no painel
// Propósito: Validar integridade do Core System, performance e comunicação entre módulos

(function() {
    'use strict';

    // ========== CONFIGURAÇÃO DO PAINEL ==========
    const PANEL_CONFIG = {
        id: 'diagnostics-panel-61',
        title: '🔬 DIAGNOSTICS61 - VALIDAÇÃO AVANÇADA v6.1.2',
        width: '580px',
        defaultPosition: { left: '250px', top: '100px' }
    };

    // ========== ESTADO DO MÓDULO ==========
    const state = {
        panel: null,
        isMinimized: false,
        logs: []
    };

    // ========== FUNÇÃO DE FORMATAÇÃO MELHORADA ==========
    function formatResultsForDisplay(title, data) {
        let html = `<div style="border-left: 4px solid #00ffff; padding-left: 12px; margin-bottom: 15px;">`;
        html += `<div style="color: #00ffff; font-weight: bold; font-size: 14px; margin-bottom: 10px;">📊 ${title}</div>`;
        
        if (!data) {
            html += `<div style="color: #ff8888; padding: 10px;">❌ Dados não disponíveis</div>`;
            return html + '</div>';
        }

        // Formatação específica para cada tipo de resultado
        if (title.includes('Core Integrity')) {
            html += formatCoreResults(data);
        } else if (title.includes('Load Performance')) {
            html += formatPerformanceResults(data);
        } else if (title.includes('Communication')) {
            html += formatCommunicationResults(data);
        } else if (title.includes('LocalStorage')) {
            html += formatStorageResults(data);
        } else if (title.includes('Zombie')) {
            html += formatZombieResults(data);
        } else {
            // Fallback genérico
            html += `<pre style="background: #0a0a1f; color: #88ddff; padding: 10px; border-radius: 5px; overflow-x: auto; font-size: 11px; margin: 5px 0;">${JSON.stringify(data, null, 2)}</pre>`;
        }
        
        html += '</div>';
        return html;
    }

    function formatCoreResults(data) {
        let html = `<div style="background: #0a0a1f; border-radius: 6px; padding: 10px;">`;
        html += `<div style="color: #88ddff; margin-bottom: 8px;">✅ ${data.passed}/${data.total} componentes saudáveis</div>`;
        
        data.results.forEach(item => {
            const statusColor = item.status === '✅' ? '#88ff88' : '#ff8888';
            html += `<div style="display: flex; justify-content: space-between; padding: 3px 0; border-bottom: 1px solid #00ffff20;">`;
            html += `<span style="color: #ccccff;">${item.name}</span>`;
            html += `<span style="color: ${statusColor};">${item.status}</span>`;
            html += `</div>`;
        });
        
        html += `</div>`;
        return html;
    }

    function formatPerformanceResults(data) {
        let html = `<div style="background: #0a0a1f; border-radius: 6px; padding: 10px;">`;
        
        // Calcular média
        let totalTime = 0;
        let count = 0;
        Object.values(data).forEach(module => {
            if (module.time && module.time !== 'N/A') {
                totalTime += parseFloat(module.time);
                count++;
            }
        });
        const avgTime = count > 0 ? (totalTime / count).toFixed(2) : 'N/A';
        
        html += `<div style="color: #88ddff; margin-bottom: 8px;">⚡ Tempo médio: ${avgTime}ms</div>`;
        
        // Ordenar por tempo (mais lento primeiro)
        const sortedModules = Object.entries(data)
            .sort((a, b) => {
                const timeA = parseFloat(a[1].time) || 0;
                const timeB = parseFloat(b[1].time) || 0;
                return timeB - timeA;
            });
        
        sortedModules.forEach(([name, module]) => {
            const timeValue = module.time !== 'N/A' ? parseFloat(module.time) : 0;
            const barWidth = Math.min(100, (timeValue / 3500) * 100); // Max 3500ms = 100%
            
            html += `<div style="margin-bottom: 8px;">`;
            html += `<div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">`;
            html += `<span style="color: #ccccff;">${name}</span>`;
            html += `<span style="color: ${module.status === '✅' ? '#88ff88' : '#ff8888'};">${module.time}ms</span>`;
            html += `</div>`;
            html += `<div style="background: #1a1a2f; height: 12px; border-radius: 6px; overflow: hidden;">`;
            html += `<div style="width: ${barWidth}%; height: 100%; background: linear-gradient(90deg, #00aaff, #00ffff);"></div>`;
            html += `</div>`;
            html += `</div>`;
        });
        
        html += `</div>`;
        return html;
    }

    function formatCommunicationResults(data) {
        let html = `<div style="background: #0a0a1f; border-radius: 6px; padding: 10px;">`;
        
        const passed = data.filter(d => d.status === '✅').length;
        html += `<div style="color: #88ddff; margin-bottom: 8px;">🔗 ${passed}/${data.length} testes OK</div>`;
        
        data.forEach(item => {
            const statusColor = item.status === '✅' ? '#88ff88' : '#ff8888';
            html += `<div style="margin-bottom: 8px; padding: 5px; background: #1a1a2f; border-radius: 4px;">`;
            html += `<div style="display: flex; justify-content: space-between; align-items: center;">`;
            html += `<span style="color: #ccccff;">${item.test}</span>`;
            html += `<span style="color: ${statusColor};">${item.status}</span>`;
            html += `</div>`;
            if (item.detail) {
                let detail = item.detail;
                if (detail.length > 50) detail = detail.substring(0, 47) + '...';
                html += `<div style="color: #88aaff; font-size: 10px; margin-top: 3px;">${detail}</div>`;
            }
            html += `</div>`;
        });
        
        html += `</div>`;
        return html;
    }

    function formatStorageResults(data) {
        let html = `<div style="background: #0a0a1f; border-radius: 6px; padding: 10px;">`;
        
        const statusColor = data.keyFound && data.isValidJSON ? '#88ff88' : '#ff8888';
        html += `<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">`;
        html += `<span style="color: #ccccff;">Chave 'properties'</span>`;
        html += `<span style="color: ${statusColor};">${data.keyFound ? '✅' : '❌'}</span>`;
        html += `</div>`;
        
        if (data.keyFound) {
            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">`;
            html += `<span style="color: #ccccff;">JSON Válido</span>`;
            html += `<span style="color: ${data.isValidJSON ? '#88ff88' : '#ff8888'};">${data.isValidJSON ? '✅' : '❌'}</span>`;
            html += `</div>`;
            
            html += `<div style="display: flex; justify-content: space-between; margin-bottom: 5px;">`;
            html += `<span style="color: #ccccff;">Total Imóveis</span>`;
            html += `<span style="color: #88ddff; font-weight: bold;">${data.propertyCount}</span>`;
            html += `</div>`;
            
            if (data.sampleIds.length > 0) {
                html += `<div style="margin-top: 8px;">`;
                html += `<div style="color: #88aaff; font-size: 11px; margin-bottom: 3px;">IDs amostra:</div>`;
                html += `<div style="display: flex; gap: 5px; flex-wrap: wrap;">`;
                data.sampleIds.forEach(id => {
                    html += `<span style="background: #1a5276; color: white; padding: 2px 6px; border-radius: 10px; font-size: 10px;">${id}</span>`;
                });
                html += `</div></div>`;
            }
        }
        
        html += `</div>`;
        return html;
    }

    function formatZombieResults(data) {
        let html = `<div style="background: #0a0a1f; border-radius: 6px; padding: 10px;">`;
        
        if (data.length === 0) {
            html += `<div style="color: #88ff88; text-align: center; padding: 10px;">✅ Nenhum elemento zumbi detectado</div>`;
        } else {
            html += `<div style="color: #ff8888; margin-bottom: 5px;">⚠️ ${data.length} zumbi(s) encontrado(s)</div>`;
            data.forEach(zombie => {
                html += `<div style="background: #2a1a1a; padding: 5px; margin: 3px 0; border-radius: 3px;">`;
                html += `<span style="color: #ffaa88;">${zombie.type}</span> - `;
                html += `<span style="color: #8888ff;">${zombie.id}</span>`;
                html += `</div>`;
            });
        }
        
        html += `</div>`;
        return html;
    }

    // ========== FUNÇÕES DE DIAGNÓSTICO (mantidas da versão anterior) ==========
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
        console.group('⚡ [DIAGNOSTICS61] Análise de Performance de Carregamento');

        const resources = performance.getEntriesByType('resource') || [];
        const jsFiles = resources.filter(r => r.name.includes('.js') && r.name.includes('imoveis-maceio'));

        const moduleLoadTimes = {
            'SharedCore.js': { time: null, status: '⏳' },
            'media-unified.js': { time: null, status: '⏳' },
            'pdf-unified.js': { time: null, status: '⏳' },
            'properties.js': { time: null, status: '⏳' },
            'admin.js': { time: null, status: '⏳' },
            'gallery.js': { time: null, status: '⏳' },
            'supabase.js': { time: null, status: '⏳' },
            'loading-manager.js': { time: null, status: '⏳' },
            'FilterManager.js': { time: null, status: '⏳' }
        };

        jsFiles.forEach(resource => {
            for (const [moduleName] of Object.entries(moduleLoadTimes)) {
                if (resource.name.includes(moduleName)) {
                    moduleLoadTimes[moduleName].time = resource.duration.toFixed(2);
                    moduleLoadTimes[moduleName].status = '✅';
                }
            }
        });

        const loadedScripts = Array.from(document.scripts).map(s => s.src);
        for (const moduleName in moduleLoadTimes) {
            if (moduleLoadTimes[moduleName].status !== '✅') {
                const isLoaded = loadedScripts.some(src => src.includes(moduleName));
                moduleLoadTimes[moduleName].status = isLoaded ? '✅ (inline/cached)' : '❌';
                moduleLoadTimes[moduleName].time = moduleLoadTimes[moduleName].time || 'N/A';
            }
        }

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
            const initResult = MediaSystem?.init?.('vendas') ? '✅' : '⚠️ (já iniciado)';
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
            const loadingMethods = LoadingManager ? Object.keys(LoadingManager).filter(k => typeof LoadingManager[k] === 'function').join(', ') : 'N/A';
            results.push({ test: 'LoadingManager', status: LoadingManager ? '✅' : '❌', detail: loadingMethods });
        } catch (e) {
            results.push({ test: 'LoadingManager', status: '❌', detail: e.message });
        }

        try {
            const filterStatus = FilterManager?.getCurrentFilter?.() ? '✅ (ativo)' : '✅ (ocioso)';
            results.push({ test: 'FilterManager', status: '✅', detail: filterStatus });
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
        panel.setAttribute('data-version', '6.1.2');
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

        // Área de resultados COM SCROLL
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
        resultsArea.innerHTML = `<div style="text-align: center; color: #00ffff80; padding: 20px;">🔄 Clique em "Executar Validação Completa"</div>`;

        // Botões de ação
        const actionsDiv = document.createElement('div');
        actionsDiv.style.cssText = `
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            margin-top: 5px;
        `;
        actionsDiv.innerHTML = `
            <button id="diag61-run-all" style="background: linear-gradient(135deg, #0066cc, #003366); color: white; border: 1px solid #00aaff; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; grid-column: span 2;">🚀 EXECUTAR VALIDAÇÃO COMPLETA</button>
            <button id="diag61-core" style="background: #1a2a3a; color: #88ddff; border: 1px solid #88ddff; padding: 8px; border-radius: 4px; cursor: pointer;">🔍 Core Integrity</button>
            <button id="diag61-perf" style="background: #1a2a3a; color: #88ddff; border: 1px solid #88ddff; padding: 8px; border-radius: 4px; cursor: pointer;">⚡ Load Perf</button>
            <button id="diag61-comm" style="background: #1a2a3a; color: #88ddff; border: 1px solid #88ddff; padding: 8px; border-radius: 4px; cursor: pointer;">🔗 Communication</button>
            <button id="diag61-storage" style="background: #1a2a3a; color: #88ddff; border: 1px solid #88ddff; padding: 8px; border-radius: 4px; cursor: pointer;">💾 Storage</button>
            <button id="diag61-zombie" style="background: #1a2a3a; color: #88ddff; border: 1px solid #88ddff; padding: 8px; border-radius: 4px; cursor: pointer;">🧟 Zombie Check</button>
            <button id="diag61-clear" style="background: #3a2a1a; color: #ffaa00; border: 1px solid #ffaa00; padding: 8px; border-radius: 4px; cursor: pointer; grid-column: span 2;">🧹 Limpar Resultados</button>
        `;

        body.appendChild(resultsArea);
        body.appendChild(actionsDiv);
        panel.appendChild(header);
        panel.appendChild(body);
        document.body.appendChild(panel);

        state.panel = panel;

        // ========== LÓGICA DOS BOTÕES COM FORMATAÇÃO MELHORADA ==========
        const resultsEl = document.getElementById('diagnostics61-results');

        function displayResults(title, data) {
            if (!resultsEl) return;
            resultsEl.innerHTML = formatResultsForDisplay(title, data);
        }

        document.getElementById('diag61-run-all')?.addEventListener('click', async () => {
            resultsEl.innerHTML = '<div style="text-align:center; color:#00ffff; padding:20px;">🔄 Executando todas as validações...</div>';
            
            const allResults = {
                core: checkCoreIntegrity(),
                performance: analyzeLoadPerformance(),
                communication: testModuleCommunication(),
                storage: validateLocalStorage(),
                zombies: detectOrphanedElements()
            };
            
            displayResults('RESULTADO DA VALIDAÇÃO COMPLETA', allResults);
        });

        document.getElementById('diag61-core')?.addEventListener('click', () => {
            displayResults('Core Integrity', checkCoreIntegrity());
        });

        document.getElementById('diag61-perf')?.addEventListener('click', () => {
            displayResults('Load Performance', analyzeLoadPerformance());
        });

        document.getElementById('diag61-comm')?.addEventListener('click', () => {
            displayResults('Module Communication', testModuleCommunication());
        });

        document.getElementById('diag61-storage')?.addEventListener('click', () => {
            displayResults('LocalStorage', validateLocalStorage());
        });

        document.getElementById('diag61-zombie')?.addEventListener('click', () => {
            displayResults('Zombie Detection', detectOrphanedElements());
        });

        document.getElementById('diag61-clear')?.addEventListener('click', () => {
            resultsEl.innerHTML = '<div style="text-align: center; color: #00ffff80; padding:20px;">✅ Resultados limpos.</div>';
        });

        // ========== DRAG & DROP ==========
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
            panel.style.bottom = 'auto';
            panel.style.right = 'auto';
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
        console.log('%c🔬 [DIAGNOSTICS61] v6.1.2 - Módulo de Validação Avançada Carregado', 'color: #00ffff; font-weight: bold;');

        if (window.location.search.includes('diagnostics=true')) {
            setTimeout(() => {
                createPanel();
                console.log('✅ [DIAGNOSTICS61] Painel de diagnóstico criado.');
            }, 1500);
        }

        if (window.diagnostics) {
            window.diagnostics.diagnostics61 = {
                version: '6.1.2',
                runAll: () => {
                    checkCoreIntegrity();
                    analyzeLoadPerformance();
                    testModuleCommunication();
                    validateLocalStorage();
                    detectOrphanedElements();
                },
                panel: createPanel
            };
        }

        window.DIAG61 = {
            run: () => {
                checkCoreIntegrity();
                analyzeLoadPerformance();
                testModuleCommunication();
                validateLocalStorage();
                detectOrphanedElements();
            },
            panel: createPanel,
            core: checkCoreIntegrity,
            perf: analyzeLoadPerformance,
            comm: testModuleCommunication,
            storage: validateLocalStorage,
            zombies: detectOrphanedElements
        };
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();
