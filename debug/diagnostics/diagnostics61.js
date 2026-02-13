// debug/diagnostics/diagnostics61.js
// =====================================================================
// DIAGNÓSTICO AVANÇADO DO SISTEMA - VERSÃO 6.1
// =====================================================================
// Data: 13/02/2026
// Status: ATIVO (Elo 6 da cadeia progressiva de diagnóstico)
//
// INTEGRAÇÃO NA CADEIA:
// diagnostics53.js (Base) ← diagnostics54.js ← diagnostics55.js ←
// diagnostics56.js ← diagnostics57.js ← diagnostics58.js ←
// diagnostics59.js ← diagnostics60.js ← diagnostics61.js (ATUAL)
//
// FUNÇÕES ADICIONADAS NESTA VERSÃO:
// 1. Análise de integridade de módulos do Core System (properties, admin, gallery)
// 2. Verificação de consistência de dados (localStorage vs memória)
// 3. Testes de performance de renderização da galeria
// 4. Sistema de logs consolidado não conflitante
// 5. Posicionamento inteligente do painel para evitar sobreposição
// =====================================================================

console.log(`🔍 [DIAGNOSTICS61] Carregado - Versão 6.1 (Elo ${window.__diagnostics_chain_length || 6} da cadeia)`);

// Incrementar contador da cadeia de diagnóstico
window.__diagnostics_chain_length = (window.__diagnostics_chain_length || 5) + 1;

// Namespace único para esta versão
window.DiagnosticsV61 = (function() {
    'use strict';
    
    // ==================== CONFIGURAÇÃO ====================
    const CONFIG = {
        version: '6.1',
        panelId: 'diagnostics-panel-v61',
        logContainerId: 'diagnostics-log-v61',
        panelZIndex: 10000,
        panelOffset: 20, // pixels de espaçamento entre painéis
        defaultPosition: {
            top: '120px',
            left: '820px'  // Posicionado à direita para não conflitar com outros painéis (ex: v57 em 20px, 20px)
        },
        colors: {
            primary: '#ffaa00',
            secondary: '#00ccff',
            success: '#00ff9c',
            warning: '#ffaa00',
            error: '#ff5555',
            info: '#66ccff',
            background: 'rgba(26, 10, 42, 0.98)',
            border: '#ffaa00'
        }
    };

    // ==================== ESTADO ====================
    const state = {
        initialized: false,
        panelVisible: false,
        logs: [],
        tests: {},
        activeTests: [],
        panelElement: null,
        logElement: null,
        lastRunTimestamp: null,
        positionAdjusted: false // Flag para ajuste de posição
    };

    // ==================== TESTES DEFINIDOS NESTA VERSÃO ====================
    const tests = {
        // Teste 1: Integridade dos Módulos do Core
        coreModulesIntegrity: {
            id: 'core-modules-integrity-v61',
            name: '🧩 Integridade dos Módulos do Core',
            description: 'Verifica se os módulos principais (properties, admin, gallery) estão íntegros',
            category: 'core',
            critical: true,
            execute: async function() {
                console.group('🧩 [V61] Verificando integridade dos módulos do Core...');
                
                const modulesToCheck = [
                    { name: 'properties', obj: window.properties, type: 'array', required: true },
                    { name: 'admin', obj: window.admin, type: 'object', required: false },
                    { name: 'gallery', obj: window.gallery, type: 'object', required: false },
                    { name: 'PdfSystem', obj: window.PdfSystem, type: 'object', required: false },
                    { name: 'MediaSystem', obj: window.MediaSystem, type: 'object', required: false },
                    { name: 'LoadingManager', obj: window.LoadingManager, type: 'object', required: false },
                    { name: 'SharedCore', obj: window.SharedCore, type: 'object', required: true }
                ];
                
                const results = [];
                let passed = 0;
                
                modulesToCheck.forEach(module => {
                    const exists = module.obj !== undefined && module.obj !== null;
                    const typeOk = module.type === 'array' ? Array.isArray(module.obj) : typeof module.obj === module.type;
                    const isOk = exists && typeOk;
                    
                    if (isOk) passed++;
                    
                    results.push({
                        name: module.name,
                        exists: exists,
                        typeOk: typeOk,
                        required: module.required,
                        status: isOk ? 'ok' : (module.required ? 'critical' : 'warning')
                    });
                    
                    console.log(`${isOk ? '✅' : (module.required ? '❌' : '⚠️')} ${module.name}: ${exists ? (typeOk ? 'OK' : 'Tipo inválido') : 'Não encontrado'}`);
                });
                
                const score = Math.round((passed / modulesToCheck.length) * 100);
                
                console.log(`📊 Score: ${score}% (${passed}/${modulesToCheck.length})`);
                console.groupEnd();
                
                return {
                    status: score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error',
                    message: `🧩 Módulos Core: ${score}% íntegros`,
                    details: {
                        total: modulesToCheck.length,
                        passed: passed,
                        score: score,
                        results: results
                    }
                };
            }
        },
        
        // Teste 2: Consistência de Dados (localStorage vs Memória)
        dataConsistency: {
            id: 'data-consistency-v61',
            name: '💾 Consistência de Dados',
            description: 'Verifica se os dados em memória (window.properties) estão sincronizados com localStorage',
            category: 'data',
            critical: true,
            execute: async function() {
                console.group('💾 [V61] Verificando consistência de dados...');
                
                const results = [];
                let issues = [];
                
                // 1. Verificar localStorage
                const storageKeys = ['properties', 'weberlessa_properties', 'properties_backup'];
                const storageData = {};
                
                storageKeys.forEach(key => {
                    try {
                        const value = localStorage.getItem(key);
                        if (value) {
                            const parsed = JSON.parse(value);
                            storageData[key] = {
                                exists: true,
                                length: Array.isArray(parsed) ? parsed.length : 'n/a',
                                valid: Array.isArray(parsed)
                            };
                        } else {
                            storageData[key] = { exists: false };
                        }
                    } catch (e) {
                        storageData[key] = { exists: true, error: e.message, valid: false };
                        issues.push(`Chave ${key} corrompida`);
                    }
                });
                
                console.log('📦 Dados no localStorage:', storageData);
                
                // 2. Verificar window.properties
                const memProperties = window.properties;
                const memValid = Array.isArray(memProperties);
                const memLength = memValid ? memProperties.length : 0;
                
                console.log(`🧠 Dados em memória: ${memValid ? `${memLength} imóveis` : 'Inválido'}`);
                
                // 3. Comparar com chave principal
                let syncStatus = 'unknown';
                if (memValid && storageData.properties.exists && storageData.properties.valid) {
                    const storageProps = JSON.parse(localStorage.getItem('properties'));
                    if (storageProps.length === memLength) {
                        syncStatus = 'synced';
                    } else if (storageProps.length > memLength) {
                        syncStatus = 'storage_ahead';
                        issues.push(`localStorage tem ${storageProps.length - memLength} imóveis a mais que memória`);
                    } else {
                        syncStatus = 'memory_ahead';
                        issues.push(`Memória tem ${memLength - storageProps.length} imóveis a mais que localStorage`);
                    }
                }
                
                // 4. Verificar chaves antigas
                const oldKeys = ['weberlessa_properties', 'properties_backup'];
                const hasOldKeys = oldKeys.some(key => storageData[key]?.exists && storageData[key]?.valid);
                
                if (hasOldKeys) {
                    issues.push('Chaves antigas de localStorage ainda presentes');
                }
                
                console.log(`🔄 Status de sincronia: ${syncStatus}`);
                
                const score = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 25));
                const hasCritical = issues.some(i => i.includes('corrompida'));
                
                console.groupEnd();
                
                return {
                    status: hasCritical ? 'error' : issues.length > 0 ? 'warning' : 'success',
                    message: `💾 Dados: ${score}% consistente${issues.length > 0 ? ` (${issues.length} pendência(s))` : ''}`,
                    details: {
                        memory: { valid: memValid, count: memLength },
                        storage: storageData,
                        syncStatus: syncStatus,
                        issues: issues,
                        score: score
                    }
                };
            }
        },
        
        // Teste 3: Performance de Renderização da Galeria
        galleryPerformance: {
            id: 'gallery-performance-v61',
            name: '⚡ Performance da Galeria',
            description: 'Mede o tempo de renderização dos cards de imóveis',
            category: 'performance',
            critical: false,
            execute: async function() {
                console.group('⚡ [V61] Testando performance da galeria...');
                
                const results = [];
                
                // Medir tempo de renderização
                const startTime = performance.now();
                let renderTime = 0;
                let cardsRendered = 0;
                
                try {
                    if (typeof window.renderProperties === 'function') {
                        // Renderizar com filtro 'todos'
                        const container = document.getElementById('properties-container');
                        if (container) {
                            const beforeCount = container.children.length;
                            
                            window.renderProperties('todos');
                            
                            // Pequeno delay para o DOM atualizar
                            await new Promise(resolve => setTimeout(resolve, 50));
                            
                            const afterCount = container.children.length;
                            cardsRendered = afterCount;
                            
                            results.push({
                                test: 'Renderização completa',
                                cardsBefore: beforeCount,
                                cardsAfter: afterCount,
                                rendered: afterCount
                            });
                        } else {
                            results.push({ test: 'Container não encontrado', error: true });
                        }
                    }
                    
                    renderTime = performance.now() - startTime;
                    
                    // Verificar qualidade das imagens
                    const images = document.querySelectorAll('.property-image img, .property-gallery-image');
                    const brokenImages = [];
                    
                    images.forEach((img, index) => {
                        if (!img.complete || img.naturalWidth === 0) {
                            const src = img.src || img.getAttribute('src') || 'unknown';
                            brokenImages.push({ index, src: src.substring(0, 50) });
                        }
                    });
                    
                    console.log(`⏱️ Tempo de renderização: ${renderTime.toFixed(2)}ms`);
                    console.log(`🖼️ Imagens carregadas: ${images.length - brokenImages.length}/${images.length}`);
                    
                    results.push({
                        test: 'Qualidade das imagens',
                        totalImages: images.length,
                        brokenImages: brokenImages.length,
                        brokenList: brokenImages
                    });
                    
                } catch (error) {
                    console.error('❌ Erro no teste de performance:', error);
                    results.push({ test: 'Erro na execução', error: error.message });
                }
                
                const brokenImagesCount = results.find(r => r.test === 'Qualidade das imagens')?.brokenImages || 0;
                const score = renderTime < 500 ? 100 : 
                             renderTime < 1000 ? 80 : 
                             renderTime < 2000 ? 60 : 40;
                
                const finalScore = Math.max(0, score - (brokenImagesCount * 10));
                
                console.groupEnd();
                
                return {
                    status: finalScore >= 80 ? 'success' : finalScore >= 50 ? 'warning' : 'error',
                    message: `⚡ Galeria: ${renderTime.toFixed(0)}ms | ${cardsRendered} cards | Score: ${finalScore}%`,
                    details: {
                        renderTime: renderTime,
                        cardsRendered: cardsRendered,
                        brokenImages: brokenImagesCount,
                        score: finalScore,
                        results: results
                    }
                };
            }
        },
        
        // Teste 4: Análise de Dependências (versão específica V61)
        dependencyAnalysis: {
            id: 'dependency-analysis-v61',
            name: '🔗 Análise de Dependências',
            description: 'Verifica dependências críticas entre módulos do Core',
            category: 'architecture',
            critical: true,
            execute: async function() {
                console.group('🔗 [V61] Analisando dependências...');
                
                const dependencies = [
                    { from: 'properties', to: 'SharedCore', required: true },
                    { from: 'admin', to: 'properties', required: true },
                    { from: 'admin', to: 'MediaSystem', required: false },
                    { from: 'admin', to: 'PdfSystem', required: false },
                    { from: 'gallery', to: 'properties', required: true },
                    { from: 'properties', to: 'LoadingManager', required: false },
                    { from: 'PdfSystem', to: 'properties', required: true }
                ];
                
                const results = [];
                let passed = 0;
                let criticalFails = 0;
                
                dependencies.forEach(dep => {
                    const fromExists = window[dep.from] !== undefined;
                    const toExists = window[dep.to] !== undefined;
                    const chainOk = fromExists && toExists;
                    
                    if (chainOk) passed++;
                    else if (dep.required) criticalFails++;
                    
                    results.push({
                        from: dep.from,
                        to: dep.to,
                        fromExists: fromExists,
                        toExists: toExists,
                        required: dep.required,
                        status: chainOk ? 'ok' : (dep.required ? 'critical' : 'warning')
                    });
                    
                    console.log(`${chainOk ? '✅' : (dep.required ? '❌' : '⚠️')} ${dep.from} → ${dep.to}: ${fromExists ? (toExists ? 'OK' : `${dep.to} não encontrado`) : `${dep.from} não encontrado`}`);
                });
                
                const score = Math.round((passed / dependencies.length) * 100);
                
                console.log(`📊 Score de dependências: ${score}%`);
                console.log(`🚨 Falhas críticas: ${criticalFails}`);
                
                console.groupEnd();
                
                return {
                    status: criticalFails === 0 ? (score >= 80 ? 'success' : 'warning') : 'error',
                    message: `🔗 Dependências: ${score}% ok | ${criticalFails} crítica(s)`,
                    details: {
                        total: dependencies.length,
                        passed: passed,
                        criticalFails: criticalFails,
                        score: score,
                        results: results
                    }
                };
            }
        },
        
        // Teste 5: Integridade do CSS (específico V61)
        cssIntegrity: {
            id: 'css-integrity-v61',
            name: '🎨 Integridade do CSS',
            description: 'Verifica se os principais arquivos CSS foram carregados',
            category: 'ui',
            critical: false,
            execute: async function() {
                console.group('🎨 [V61] Verificando CSS...');
                
                const cssFiles = [
                    'header.css',
                    'main.css',
                    'admin.css',
                    'gallery.css'
                ];
                
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                const loadedCss = Array.from(links).map(link => {
                    const href = link.href.split('/').pop() || '';
                    return href;
                });
                
                const results = cssFiles.map(file => {
                    const loaded = loadedCss.some(css => css.includes(file));
                    console.log(`${loaded ? '✅' : '❌'} ${file}`);
                    return { file: file, loaded: loaded };
                });
                
                const loadedCount = results.filter(r => r.loaded).length;
                const score = Math.round((loadedCount / cssFiles.length) * 100);
                
                console.log(`📊 CSS carregado: ${loadedCount}/${cssFiles.length} (${score}%)`);
                console.groupEnd();
                
                return {
                    status: score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error',
                    message: `🎨 CSS: ${loadedCount}/${cssFiles.length} carregados`,
                    details: {
                        total: cssFiles.length,
                        loaded: loadedCount,
                        score: score,
                        results: results,
                        allLoadedCss: loadedCss
                    }
                };
            }
        }
    };

    // ==================== FUNÇÕES DO PAINEL ====================
    
    /**
     * Ajusta a posição do painel para evitar sobreposição com outros painéis de diagnóstico
     */
    function adjustPanelPosition() {
        if (state.positionAdjusted) return;
        
        // Encontrar todos os painéis de diagnóstico existentes
        const existingPanels = document.querySelectorAll('[id^="diagnostics-panel-"]');
        let maxTop = 20;
        let maxLeft = 20;
        
        existingPanels.forEach(panel => {
            if (panel.id === CONFIG.panelId) return; // Ignorar a si mesmo
            
            const rect = panel.getBoundingClientRect();
            if (rect.width > 0 && rect.height > 0) {
                // Posicionar este painel abaixo ou à direita dos existentes
                maxTop = Math.max(maxTop, rect.bottom + CONFIG.panelOffset);
                maxLeft = Math.max(maxLeft, rect.right + CONFIG.panelOffset);
            }
        });
        
        // Limitar para não sair da tela
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        if (maxTop + 600 > viewportHeight) {
            // Se não couber embaixo, posicionar à direita
            maxTop = 20;
            maxLeft = maxLeft + 320; // Largura aproximada do painel
        }
        
        if (maxLeft + 500 > viewportWidth) {
            // Último recurso: posicionar no canto superior esquerdo com offset
            maxLeft = 20;
            maxTop = 20;
        }
        
        if (state.panelElement) {
            state.panelElement.style.top = maxTop + 'px';
            state.panelElement.style.left = maxLeft + 'px';
            console.log(`📐 [V61] Painel posicionado em (${maxLeft}px, ${maxTop}px)`);
        }
        
        state.positionAdjusted = true;
    }

    /**
     * Cria o painel de diagnóstico V61
     */
    function createPanel() {
        if (state.panelElement && document.body.contains(state.panelElement)) {
            state.panelElement.style.display = 'flex';
            return state.panelElement;
        }
        
        // Remover painel antigo se existir
        const oldPanel = document.getElementById(CONFIG.panelId);
        if (oldPanel) oldPanel.remove();
        
        const panel = document.createElement('div');
        panel.id = CONFIG.panelId;
        panel.setAttribute('data-version', CONFIG.version);
        
        // Estilo base do painel
        panel.style.cssText = `
            position: fixed;
            top: ${CONFIG.defaultPosition.top};
            left: ${CONFIG.defaultPosition.left};
            width: 500px;
            height: 650px;
            background: ${CONFIG.colors.background};
            border: 2px solid ${CONFIG.colors.border};
            border-radius: 12px;
            z-index: ${CONFIG.panelZIndex};
            box-shadow: 0 0 30px rgba(255, 170, 0, 0.3);
            font-family: 'Segoe UI', monospace;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            backdrop-filter: blur(5px);
            resize: both;
            transition: all 0.3s ease;
        `;
        
        // Cabeçalho
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(90deg, rgba(255, 170, 0, 0.2), rgba(0, 204, 255, 0.1));
            padding: 12px 15px;
            border-bottom: 1px solid ${CONFIG.colors.border};
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;
        
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="color: ${CONFIG.colors.primary}; font-weight: bold; font-size: 14px;">🔍 DIAGNÓSTICO V${CONFIG.version}</span>
                <span style="background: ${CONFIG.colors.secondary}; color: #1a0a2a; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold;">
                    ELÔ 6
                </span>
            </div>
            <div style="display: flex; gap: 5px;">
                <button class="v61-minimize" style="background: #555; color: white; border: none; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;">−</button>
                <button class="v61-close" style="background: #ff5555; color: white; border: none; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;">×</button>
            </div>
        `;
        
        // Conteúdo (rolável)
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            overflow-x: hidden;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;
        
        // Status geral
        const statusDiv = document.createElement('div');
        statusDiv.id = 'v61-status';
        statusDiv.style.cssText = `
            background: rgba(255, 170, 0, 0.1);
            border-radius: 8px;
            padding: 12px;
            border-left: 4px solid ${CONFIG.colors.primary};
        `;
        statusDiv.innerHTML = `
            <div style="color: ${CONFIG.colors.primary}; font-weight: bold; margin-bottom: 8px;">📊 STATUS DO SISTEMA</div>
            <div style="color: #ffcc88; font-size: 12px;">
                <div>Versão do Diagnóstico: <span style="color: white;">${CONFIG.version}</span></div>
                <div>Elo na Cadeia: <span style="color: white;">6</span></div>
                <div>Módulos Ativos: <span id="v61-active-modules">Verificando...</span></div>
                <div>Última Execução: <span id="v61-last-run">Nunca</span></div>
            </div>
        `;
        content.appendChild(statusDiv);
        
        // Controles
        const controlsDiv = document.createElement('div');
        controlsDiv.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 12px;
            border: 1px solid ${CONFIG.colors.border}40;
        `;
        controlsDiv.innerHTML = `
            <div style="color: ${CONFIG.colors.primary}; font-weight: bold; margin-bottom: 10px;">🎮 CONTROLES</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                <button id="v61-run-all" class="v61-btn-primary">▶️ Executar Todos</button>
                <button id="v61-run-core" class="v61-btn-secondary">🧩 Testes Core</button>
                <button id="v61-run-data" class="v61-btn-secondary">💾 Dados</button>
                <button id="v61-run-perf" class="v61-btn-secondary">⚡ Performance</button>
                <button id="v61-clear-logs" class="v61-btn-warning">🗑️ Limpar Logs</button>
                <button id="v61-export" class="v61-btn-info">📤 Exportar</button>
            </div>
        `;
        content.appendChild(controlsDiv);
        
        // Container de resultados
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'v61-results';
        resultsDiv.style.cssText = `
            background: rgba(0, 0, 0, 0.2);
            border-radius: 8px;
            padding: 12px;
            min-height: 150px;
        `;
        resultsDiv.innerHTML = `
            <div style="color: ${CONFIG.colors.primary}; font-weight: bold; margin-bottom: 10px;">📋 RESULTADOS</div>
            <div id="v61-results-content" style="color: #ffcc88; font-size: 12px;">
                Aguardando execução dos testes...
            </div>
        `;
        content.appendChild(resultsDiv);
        
        // Container de logs
        const logsDiv = document.createElement('div');
        logsDiv.id = 'v61-logs';
        logsDiv.style.cssText = `
            background: rgba(0, 0, 0, 0.3);
            border-radius: 8px;
            padding: 12px;
            max-height: 150px;
            overflow-y: auto;
        `;
        logsDiv.innerHTML = `
            <div style="color: ${CONFIG.colors.primary}; font-weight: bold; margin-bottom: 8px;">📝 LOGS</div>
            <div id="v61-logs-content" style="color: #88ffaa; font-size: 11px;"></div>
        `;
        content.appendChild(logsDiv);
        
        // Rodapé
        const footer = document.createElement('div');
        footer.style.cssText = `
            background: rgba(0, 0, 0, 0.4);
            padding: 8px 15px;
            border-top: 1px solid ${CONFIG.colors.border}40;
            font-size: 10px;
            color: ${CONFIG.colors.primary}80;
            display: flex;
            justify-content: space-between;
        `;
        footer.innerHTML = `
            <span>diagnostics61.js | v${CONFIG.version}</span>
            <span>${new Date().toLocaleDateString()}</span>
        `;
        
        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(footer);
        
        document.body.appendChild(panel);
        
        // Adicionar estilos para os botões
        const style = document.createElement('style');
        style.textContent = `
            .v61-btn-primary {
                background: linear-gradient(135deg, ${CONFIG.colors.primary}, #ff8800);
                color: white;
                border: none;
                padding: 8px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .v61-btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px ${CONFIG.colors.primary}80;
            }
            .v61-btn-secondary {
                background: rgba(102, 204, 255, 0.2);
                color: ${CONFIG.colors.secondary};
                border: 1px solid ${CONFIG.colors.secondary};
                padding: 8px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
                transition: all 0.3s ease;
            }
            .v61-btn-secondary:hover {
                background: rgba(102, 204, 255, 0.4);
            }
            .v61-btn-warning {
                background: rgba(255, 170, 0, 0.2);
                color: ${CONFIG.colors.warning};
                border: 1px solid ${CONFIG.colors.warning};
                padding: 8px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            }
            .v61-btn-info {
                background: rgba(0, 255, 156, 0.2);
                color: ${CONFIG.colors.success};
                border: 1px solid ${CONFIG.colors.success};
                padding: 8px;
                border-radius: 5px;
                cursor: pointer;
                font-size: 11px;
            }
        `;
        document.head.appendChild(style);
        
        state.panelElement = panel;
        state.panelVisible = true;
        
        // Ajustar posição para evitar conflitos
        adjustPanelPosition();
        
        // Configurar eventos
        setupPanelEvents(panel, header);
        
        // Inicializar logs
        addLog('Painel de diagnóstico V61 criado', 'info');
        addLog(`Posicionado em (${panel.style.left}, ${panel.style.top})`, 'info');
        
        return panel;
    }
    
    /**
     * Configura eventos do painel
     */
    function setupPanelEvents(panel, header) {
        // Arrastar
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            
            isDragging = true;
            offsetX = e.clientX - panel.getBoundingClientRect().left;
            offsetY = e.clientY - panel.getBoundingClientRect().top;
            
            panel.style.cursor = 'grabbing';
            
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            e.preventDefault();
        });
        
        function drag(e) {
            if (!isDragging) return;
            
            let newLeft = e.clientX - offsetX;
            let newTop = e.clientY - offsetY;
            
            // Limitar à viewport
            newLeft = Math.max(0, Math.min(window.innerWidth - panel.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - panel.offsetHeight, newTop));
            
            panel.style.left = newLeft + 'px';
            panel.style.top = newTop + 'px';
        }
        
        function stopDrag() {
            isDragging = false;
            panel.style.cursor = '';
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
        
        // Botões
        panel.querySelector('.v61-close').addEventListener('click', () => {
            panel.style.display = 'none';
            state.panelVisible = false;
        });
        
        panel.querySelector('.v61-minimize').addEventListener('click', (btn) => {
            const content = panel.children[1];
            const isHidden = content.style.display === 'none';
            content.style.display = isHidden ? 'flex' : 'none';
            btn.target.textContent = isHidden ? '−' : '+';
        });
        
        // Botões de ação
        panel.querySelector('#v61-run-all').addEventListener('click', async () => {
            addLog('Iniciando execução de todos os testes...', 'info');
            await runAllTests();
        });
        
        panel.querySelector('#v61-run-core').addEventListener('click', async () => {
            addLog('Executando testes de Core...', 'info');
            await runTestsByCategory('core');
        });
        
        panel.querySelector('#v61-run-data').addEventListener('click', async () => {
            addLog('Executando testes de Dados...', 'info');
            await runTestsByCategory('data');
        });
        
        panel.querySelector('#v61-run-perf').addEventListener('click', async () => {
            addLog('Executando testes de Performance...', 'info');
            await runTestsByCategory('performance');
        });
        
        panel.querySelector('#v61-clear-logs').addEventListener('click', () => {
            clearLogs();
        });
        
        panel.querySelector('#v61-export').addEventListener('click', () => {
            exportResults();
        });
    }
    
    /**
     * Adiciona um log ao painel
     */
    function addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        state.logs.push({ timestamp, message, type });
        
        const logsContent = document.getElementById('v61-logs-content');
        if (logsContent) {
            const logEntry = document.createElement('div');
            logEntry.style.cssText = `
                padding: 2px 0;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            `;
            
            let color = '#88ffaa';
            if (type === 'error') color = '#ff5555';
            if (type === 'warning') color = '#ffaa00';
            if (type === 'success') color = '#00ff9c';
            
            logEntry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> <span style="color: ${color};">${message}</span>`;
            logsContent.appendChild(logEntry);
            logsContent.scrollTop = logsContent.scrollHeight;
        }
        
        // Também logar no console com prefixo V61
        console.log(`[V61] ${message}`);
    }
    
    /**
     * Limpa os logs
     */
    function clearLogs() {
        state.logs = [];
        const logsContent = document.getElementById('v61-logs-content');
        if (logsContent) {
            logsContent.innerHTML = '';
        }
        addLog('Logs limpos', 'info');
    }
    
    /**
     * Executa um teste e atualiza a UI
     */
    async function runTest(testId) {
        const test = tests[testId];
        if (!test) {
            addLog(`Teste não encontrado: ${testId}`, 'error');
            return null;
        }
        
        addLog(`Executando: ${test.name}...`, 'info');
        
        try {
            const startTime = performance.now();
            const result = await test.execute();
            const endTime = performance.now();
            
            addLog(`${test.name}: ${result.status} (${(endTime - startTime).toFixed(0)}ms)`, result.status);
            
            return {
                ...result,
                testId: testId,
                testName: test.name,
                executionTime: endTime - startTime,
                timestamp: new Date().toISOString()
            };
        } catch (error) {
            addLog(`Erro em ${test.name}: ${error.message}`, 'error');
            console.error(`[V61] Erro no teste ${testId}:`, error);
            
            return {
                testId: testId,
                testName: test.name,
                status: 'error',
                message: `Erro: ${error.message}`,
                details: { error: error.toString() },
                executionTime: 0,
                timestamp: new Date().toISOString()
            };
        }
    }
    
    /**
     * Executa todos os testes
     */
    async function runAllTests() {
        const resultsDiv = document.getElementById('v61-results-content');
        if (resultsDiv) {
            resultsDiv.innerHTML = '<div style="text-align: center;">Executando testes...</div>';
        }
        
        const results = [];
        let passed = 0;
        let warnings = 0;
        let errors = 0;
        
        for (const [testId, test] of Object.entries(tests)) {
            const result = await runTest(testId);
            if (result) {
                results.push(result);
                if (result.status === 'success') passed++;
                if (result.status === 'warning') warnings++;
                if (result.status === 'error') errors++;
            }
            
            // Pequena pausa para não sobrecarregar
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        state.lastRunTimestamp = new Date().toISOString();
        
        // Atualizar status
        const lastRunSpan = document.getElementById('v61-last-run');
        if (lastRunSpan) {
            lastRunSpan.textContent = new Date().toLocaleTimeString();
        }
        
        // Exibir resultados
        displayResults(results, passed, warnings, errors);
        
        return results;
    }
    
    /**
     * Executa testes por categoria
     */
    async function runTestsByCategory(category) {
        const resultsDiv = document.getElementById('v61-results-content');
        if (resultsDiv) {
            resultsDiv.innerHTML = `<div style="text-align: center;">Executando testes de ${category}...</div>`;
        }
        
        const results = [];
        let passed = 0;
        let warnings = 0;
        let errors = 0;
        
        for (const [testId, test] of Object.entries(tests)) {
            if (test.category === category) {
                const result = await runTest(testId);
                if (result) {
                    results.push(result);
                    if (result.status === 'success') passed++;
                    if (result.status === 'warning') warnings++;
                    if (result.status === 'error') errors++;
                }
                
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        }
        
        displayResults(results, passed, warnings, errors);
        
        return results;
    }
    
    /**
     * Exibe resultados na UI
     */
    function displayResults(results, passed, warnings, errors) {
        const resultsDiv = document.getElementById('v61-results-content');
        if (!resultsDiv) return;
        
        const total = results.length;
        const score = total > 0 ? Math.round((passed / total) * 100) : 0;
        
        let html = `
            <div style="margin-bottom: 15px; padding: 10px; background: rgba(0,0,0,0.3); border-radius: 5px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <span style="color: #00ff9c; font-size: 16px; font-weight: bold;">${score}%</span>
                        <span style="color: #ffcc88; font-size: 11px; margin-left: 5px;">Score</span>
                    </div>
                    <div>
                        <span style="color: #00ff9c;">✅ ${passed}</span>
                        <span style="color: #ffaa00; margin-left: 5px;">⚠️ ${warnings}</span>
                        <span style="color: #ff5555; margin-left: 5px;">❌ ${errors}</span>
                    </div>
                </div>
            </div>
        `;
        
        results.forEach(result => {
            let color = '#00ff9c';
            let icon = '✅';
            if (result.status === 'warning') { color = '#ffaa00'; icon = '⚠️'; }
            if (result.status === 'error') { color = '#ff5555'; icon = '❌'; }
            
            html += `
                <div style="padding: 8px; margin: 5px 0; background: rgba(0,0,0,0.2); border-radius: 5px; border-left: 3px solid ${color};">
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: white; font-size: 12px;">${icon} ${result.testName}</span>
                        <span style="color: #888; font-size: 10px;">${result.executionTime.toFixed(0)}ms</span>
                    </div>
                    <div style="color: ${color}; font-size: 11px; margin-top: 3px;">${result.message}</div>
                </div>
            `;
        });
        
        resultsDiv.innerHTML = html;
    }
    
    /**
     * Exporta resultados em formato JSON
     */
    function exportResults() {
        const exportData = {
            version: CONFIG.version,
            timestamp: new Date().toISOString(),
            tests: Object.keys(tests).map(key => ({
                id: tests[key].id,
                name: tests[key].name,
                category: tests[key].category
            })),
            logs: state.logs,
            environment: {
                userAgent: navigator.userAgent,
                url: window.location.href,
                propertiesCount: window.properties?.length || 0,
                debug: window.location.search.includes('debug=true'),
                diagnostics: window.location.search.includes('diagnostics=true')
            }
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagnostics-v61-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        addLog('Resultados exportados com sucesso', 'success');
    }
    
    /**
     * Atualiza o status de módulos ativos
     */
    function updateActiveModules() {
        const modulesSpan = document.getElementById('v61-active-modules');
        if (!modulesSpan) return;
        
        const modules = [];
        if (window.properties) modules.push('properties');
        if (window.admin) modules.push('admin');
        if (window.gallery) modules.push('gallery');
        if (window.PdfSystem) modules.push('PdfSystem');
        if (window.MediaSystem) modules.push('MediaSystem');
        if (window.LoadingManager) modules.push('LoadingManager');
        if (window.SharedCore) modules.push('SharedCore');
        
        modulesSpan.textContent = modules.length > 0 ? modules.join(', ') : 'Nenhum';
        modulesSpan.style.color = modules.length > 3 ? '#00ff9c' : '#ffaa00';
    }
    
    // ==================== API PÚBLICA ====================
    return {
        version: CONFIG.version,
        
        /**
         * Inicializa o módulo de diagnóstico
         */
        init: function() {
            if (state.initialized) return this;
            
            console.log(`🔧 [V61] Inicializando módulo de diagnóstico...`);
            
            // Atualizar módulos ativos periodicamente
            updateActiveModules();
            setInterval(updateActiveModules, 2000);
            
            // Verificar parâmetros da URL
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('diagnostics') === 'true' || urlParams.get('debug') === 'true') {
                setTimeout(() => {
                    this.createPanel();
                }, 1500); // Delay para garantir que outros módulos carregaram
            }
            
            state.initialized = true;
            addLog('Módulo de diagnóstico V61 inicializado', 'success');
            
            return this;
        },
        
        /**
         * Cria o painel de diagnóstico
         */
        createPanel: function() {
            return createPanel();
        },
        
        /**
         * Executa todos os testes
         */
        runAllTests: async function() {
            return await runAllTests();
        },
        
        /**
         * Executa um teste específico
         */
        runTest: async function(testId) {
            return await runTest(testId);
        },
        
        /**
         * Obtém a lista de testes disponíveis
         */
        getTests: function() {
            return tests;
        },
        
        /**
         * Adiciona um log manualmente
         */
        log: function(message, type = 'info') {
            addLog(message, type);
        },
        
        /**
         * Obtém o estado atual
         */
        getState: function() {
            return { ...state };
        },
        
        /**
         * Força ajuste de posição do painel
         */
        adjustPosition: function() {
            adjustPanelPosition();
        }
    };
})();

// ==================== INICIALIZAÇÃO ====================
setTimeout(() => {
    if (window.DiagnosticsV61) {
        window.DiagnosticsV61.init();
        
        // Expor globalmente
        window.diagnosticsV61 = window.DiagnosticsV61;
        
        console.log('%c🔍 DIAGNÓSTICO V61 PRONTO', 'color: #ffaa00; font-weight: bold; font-size: 12px;');
        console.log('📋 Comandos: window.DiagnosticsV61.createPanel()');
        console.log('📋 Para ver painel: adicione ?debug=true&diagnostics=true à URL');
    }
}, 1000);

// ==================== FIM DO ARQUIVO diagnostics61.js ====================
