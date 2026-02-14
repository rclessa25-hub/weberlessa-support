// debug/diagnostics/diagnostics61.js
// =====================================================================
// DIAGNÓSTICO AVANÇADO DO SISTEMA - VERSÃO 6.1.2 FINAL
// =====================================================================
// Data: 13/02/2026
// Status: ✅ FUNCIONAL E VISÍVEL
//
// CARACTERÍSTICAS:
// ✅ Posicionamento automático anti-colisão
// ✅ Visibilidade forçada (z-index 20000)
// ✅ Botão de emergência vermelho sempre visível
// ✅ Testes completos do Core System
// ✅ Interface completa e funcional
// =====================================================================

console.log(`🔍 [DIAGNOSTICS61] Carregado - Versão 6.1.2 (Elo ${window.__diagnostics_chain_length || 6} da cadeia)`);

// Incrementar contador da cadeia de diagnóstico
window.__diagnostics_chain_length = (window.__diagnostics_chain_length || 5) + 1;

// Namespace único para esta versão
window.DiagnosticsV61 = (function() {
    'use strict';
    
    // ==================== CONFIGURAÇÃO ====================
    const CONFIG = {
        version: '6.1.2',
        panelId: 'diagnostics-panel-v61',
        logContainerId: 'diagnostics-log-v61',
        panelZIndex: 20000,
        panelOffset: 20,
        panelWidth: 500,
        panelHeight: 650,
        defaultPosition: {
            top: 120,
            left: 820
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
        panelElement: null,
        lastRunTimestamp: null,
        positionAttempts: 0,
        emergencyButtonCreated: false
    };

    // ==================== FUNÇÕES DE UTILIDADE ====================
    
    /**
     * Garante que o painel esteja VISÍVEL
     */
    function ensurePanelVisibility() {
        if (!state.panelElement) return false;
        
        state.panelElement.style.zIndex = CONFIG.panelZIndex.toString();
        state.panelElement.style.display = 'flex';
        state.panelElement.style.visibility = 'visible';
        state.panelElement.style.opacity = '1';
        
        const rect = state.panelElement.getBoundingClientRect();
        console.warn(`🔴 [V61.2] PAINEL POSICIONADO EM: (${Math.round(rect.left)}px, ${Math.round(rect.top)}px)`);
        console.warn(`🔴 [V61.2] Dimensões: ${Math.round(rect.width)}x${Math.round(rect.height)}`);
        console.warn(`🔴 [V61.2] Visível no viewport? ${rect.top >= 0 && rect.left >= 0 && rect.bottom <= window.innerHeight && rect.right <= window.innerWidth ? 'SIM' : 'NÃO'}`);
        
        return true;
    }

    /**
     * Verifica colisão entre retângulos
     */
    function rectsCollide(rect1, rect2) {
        return !(rect2.left >= rect1.right ||
                 rect2.right <= rect1.left ||
                 rect2.top >= rect1.bottom ||
                 rect2.bottom <= rect1.top);
    }

    /**
     * Obtém painéis de diagnóstico visíveis
     */
    function getVisibleDiagnosticPanels() {
        return Array.from(document.querySelectorAll('[id^="diagnostics-panel-"]'))
            .filter(panel => panel.id !== CONFIG.panelId)
            .map(panel => {
                const rect = panel.getBoundingClientRect();
                return {
                    id: panel.id,
                    left: rect.left,
                    top: rect.top,
                    right: rect.right,
                    bottom: rect.bottom,
                    zIndex: parseInt(window.getComputedStyle(panel).zIndex) || 0
                };
            });
    }

    /**
     * Calcula área de sobreposição
     */
    function calculateOverlapArea(rect1, rect2) {
        const overlapLeft = Math.max(0, Math.min(rect1.right, rect2.right) - Math.max(rect1.left, rect2.left));
        const overlapTop = Math.max(0, Math.min(rect1.bottom, rect2.bottom) - Math.max(rect1.top, rect2.top));
        return overlapLeft * overlapTop;
    }

    /**
     * Ajusta posição do painel
     */
    function adjustPanelPosition() {
        if (!state.panelElement) return;
        
        state.positionAttempts++;
        
        const existingPanels = getVisibleDiagnosticPanels();
        
        if (existingPanels.length === 0) {
            state.panelElement.style.top = CONFIG.defaultPosition.top + 'px';
            state.panelElement.style.left = CONFIG.defaultPosition.left + 'px';
            ensurePanelVisibility();
            return;
        }
        
        // Posições candidatas
        const candidates = [
            { top: 20, left: 20 },
            { top: 20, left: window.innerWidth - CONFIG.panelWidth - 20 },
            { top: window.innerHeight - CONFIG.panelHeight - 20, left: 20 },
            { top: window.innerHeight - CONFIG.panelHeight - 20, left: window.innerWidth - CONFIG.panelWidth - 20 },
            { top: (window.innerHeight - CONFIG.panelHeight) / 2, left: (window.innerWidth - CONFIG.panelWidth) / 2 },
            { top: CONFIG.defaultPosition.top, left: CONFIG.defaultPosition.left },
            { top: 150, left: 150 }
        ];
        
        let bestPosition = null;
        let lowestOverlap = Infinity;
        
        for (const candidate of candidates) {
            candidate.top = Math.max(5, Math.min(window.innerHeight - CONFIG.panelHeight - 5, candidate.top));
            candidate.left = Math.max(5, Math.min(window.innerWidth - CONFIG.panelWidth - 5, candidate.left));
            
            const candidateRect = {
                left: candidate.left,
                top: candidate.top,
                right: candidate.left + CONFIG.panelWidth,
                bottom: candidate.top + CONFIG.panelHeight
            };
            
            let totalOverlap = 0;
            for (const panel of existingPanels) {
                if (rectsCollide(candidateRect, panel)) {
                    totalOverlap += calculateOverlapArea(candidateRect, panel);
                }
            }
            
            if (totalOverlap < lowestOverlap) {
                lowestOverlap = totalOverlap;
                bestPosition = candidate;
            }
        }
        
        if (bestPosition) {
            state.panelElement.style.top = bestPosition.top + 'px';
            state.panelElement.style.left = bestPosition.left + 'px';
        }
        
        ensurePanelVisibility();
    }

    /**
     * Cria botão de emergência
     */
    function createEmergencyButton() {
        if (state.emergencyButtonCreated) return;
        
        const btn = document.createElement('button');
        btn.id = 'v61-emergency-btn';
        btn.innerHTML = '🔴 V61';
        btn.title = 'Mostrar painel de diagnóstico V61';
        btn.style.cssText = `
            position: fixed;
            bottom: 280px;
            right: 20px;
            z-index: 21000;
            background: linear-gradient(135deg, #ff5500, #ff0000);
            color: white;
            border: 2px solid white;
            border-radius: 30px;
            width: 60px;
            height: 60px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(255, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            animation: v61-pulse 1.5s infinite;
        `;
        
        btn.onclick = function() {
            let panel = document.getElementById(CONFIG.panelId);
            if (!panel) {
                window.DiagnosticsV61.createPanel();
            } else {
                panel.style.display = 'flex';
                ensurePanelVisibility();
            }
            window.DiagnosticsV61.log('Painel reexibido via botão de emergência', 'success');
        };
        
        document.body.appendChild(btn);
        state.emergencyButtonCreated = true;
        console.log('🆘 [V61.2] Botão de emergência criado');
    }

    // ==================== FUNÇÕES DE VERIFICAÇÃO DE MÓDULOS ====================
    
    function checkAdminModule() {
        const functions = [
            'toggleAdminPanel', 'saveProperty', 'editProperty', 
            'cancelEdit', 'resetAdminFormCompletely', 'loadPropertyList'
        ];
        
        const available = functions.filter(fn => typeof window[fn] === 'function');
        
        return {
            functionCount: available.length,
            score: Math.round((available.length / functions.length) * 100),
            availableFunctions: available,
            status: available.length >= 4 ? 'ok' : available.length >= 2 ? 'partial' : 'critical'
        };
    }
    
    function checkGalleryModule() {
        const functions = [
            'openGallery', 'closeGallery', 'nextGalleryImage',
            'prevGalleryImage', 'createPropertyGallery', 'showGalleryImage'
        ];
        
        const available = functions.filter(fn => typeof window[fn] === 'function');
        
        return {
            functionCount: available.length,
            score: Math.round((available.length / functions.length) * 100),
            availableFunctions: available,
            status: available.length >= 4 ? 'ok' : available.length >= 2 ? 'partial' : 'critical'
        };
    }

    // ==================== TESTES ====================
    
    const tests = {
        coreIntegrity: {
            id: 'core-integrity-v61',
            name: '🧩 Integridade do Core',
            description: 'Verifica módulos principais do sistema',
            category: 'core',
            execute: async function() {
                const results = [];
                
                // Objetos diretos
                const objects = [
                    { name: 'properties', obj: window.properties, type: 'array' },
                    { name: 'PdfSystem', obj: window.PdfSystem, type: 'object' },
                    { name: 'MediaSystem', obj: window.MediaSystem, type: 'object' },
                    { name: 'LoadingManager', obj: window.LoadingManager, type: 'object' },
                    { name: 'SharedCore', obj: window.SharedCore, type: 'object' }
                ];
                
                objects.forEach(m => {
                    const ok = m.obj !== undefined && (m.type === 'array' ? Array.isArray(m.obj) : typeof m.obj === m.type);
                    results.push({ name: m.name, status: ok ? 'ok' : 'missing' });
                });
                
                // Módulos por função
                const admin = checkAdminModule();
                const gallery = checkGalleryModule();
                
                results.push({ name: 'admin', status: admin.status, score: admin.score });
                results.push({ name: 'gallery', status: gallery.status, score: gallery.score });
                
                const successCount = results.filter(r => r.status === 'ok' || r.score >= 80).length;
                const score = Math.round((successCount / results.length) * 100);
                
                return {
                    status: score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error',
                    message: `🧩 Core: ${score}% (${successCount}/${results.length})`,
                    details: { results, admin, gallery, score }
                };
            }
        },
        
        dataConsistency: {
            id: 'data-consistency-v61',
            name: '💾 Consistência de Dados',
            description: 'Verifica sincronia entre memória e localStorage',
            category: 'data',
            execute: async function() {
                const issues = [];
                
                const memProps = window.properties;
                const memValid = Array.isArray(memProps);
                const memCount = memValid ? memProps.length : 0;
                
                let storageCount = 0;
                try {
                    const stored = localStorage.getItem('properties');
                    if (stored) {
                        const parsed = JSON.parse(stored);
                        storageCount = Array.isArray(parsed) ? parsed.length : 0;
                    }
                } catch (e) {
                    issues.push('localStorage corrompido');
                }
                
                if (memValid && storageCount !== memCount) {
                    issues.push(`Inconsistência: memória ${memCount} ≠ storage ${storageCount}`);
                }
                
                if (localStorage.getItem('weberlessa_properties')) {
                    issues.push('Chave antiga ainda presente');
                }
                
                const score = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 30));
                
                return {
                    status: issues.length === 0 ? 'success' : issues.length <= 2 ? 'warning' : 'error',
                    message: `💾 Dados: ${memCount} imóveis | ${issues.length} pendência(s)`,
                    details: { memory: memCount, storage: storageCount, issues, score }
                };
            }
        },
        
        galleryPerformance: {
            id: 'gallery-performance-v61',
            name: '⚡ Performance da Galeria',
            description: 'Mede tempo de renderização',
            category: 'performance',
            execute: async function() {
                const start = performance.now();
                
                if (typeof window.renderProperties === 'function') {
                    window.renderProperties('todos');
                    await new Promise(r => setTimeout(r, 50));
                }
                
                const time = performance.now() - start;
                const cards = document.querySelectorAll('.property-card').length;
                const images = document.querySelectorAll('.property-image img').length;
                
                const score = time < 500 ? 100 : time < 1000 ? 80 : time < 2000 ? 60 : 40;
                
                return {
                    status: score >= 80 ? 'success' : score >= 60 ? 'warning' : 'error',
                    message: `⚡ Galeria: ${time.toFixed(0)}ms | ${cards} cards | ${images} imagens`,
                    details: { time, cards, images, score }
                };
            }
        },
        
        cssIntegrity: {
            id: 'css-integrity-v61',
            name: '🎨 CSS Carregado',
            description: 'Verifica arquivos CSS',
            category: 'ui',
            execute: async function() {
                const required = ['header.css', 'main.css', 'admin.css', 'gallery.css'];
                const loaded = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
                    .map(l => l.href.split('/').pop());
                
                const results = required.map(file => ({
                    file,
                    loaded: loaded.some(l => l.includes(file))
                }));
                
                const loadedCount = results.filter(r => r.loaded).length;
                const score = Math.round((loadedCount / required.length) * 100);
                
                return {
                    status: score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error',
                    message: `🎨 CSS: ${loadedCount}/${required.length} carregados`,
                    details: { results, score }
                };
            }
        },
        
        dependencies: {
            id: 'dependencies-v61',
            name: '🔗 Dependências',
            description: 'Verifica dependências entre módulos',
            category: 'architecture',
            execute: async function() {
                const deps = [
                    { from: 'properties', to: 'SharedCore' },
                    { from: 'admin', to: 'properties' },
                    { from: 'gallery', to: 'properties' },
                    { from: 'PdfSystem', to: 'properties' }
                ];
                
                const admin = checkAdminModule();
                const gallery = checkGalleryModule();
                
                const results = deps.map(d => {
                    const fromOk = d.from === 'admin' ? admin.functionCount > 0 :
                                   d.from === 'gallery' ? gallery.functionCount > 0 :
                                   window[d.from] !== undefined;
                    
                    const toOk = window[d.to] !== undefined;
                    
                    return {
                        from: d.from,
                        to: d.to,
                        ok: fromOk && toOk
                    };
                });
                
                const passed = results.filter(r => r.ok).length;
                const score = Math.round((passed / deps.length) * 100);
                
                return {
                    status: score >= 75 ? 'success' : score >= 50 ? 'warning' : 'error',
                    message: `🔗 Dependências: ${score}% (${passed}/${deps.length})`,
                    details: { results, score }
                };
            }
        }
    };

    // ==================== FUNÇÕES DO PAINEL ====================
    
    function createPanel() {
        if (state.panelElement && document.body.contains(state.panelElement)) {
            state.panelElement.style.display = 'flex';
            ensurePanelVisibility();
            return state.panelElement;
        }
        
        const oldPanel = document.getElementById(CONFIG.panelId);
        if (oldPanel) oldPanel.remove();
        
        const panel = document.createElement('div');
        panel.id = CONFIG.panelId;
        
        panel.style.cssText = `
            position: fixed;
            top: ${CONFIG.defaultPosition.top}px;
            left: ${CONFIG.defaultPosition.left}px;
            width: ${CONFIG.panelWidth}px;
            height: ${CONFIG.panelHeight}px;
            background: ${CONFIG.colors.background};
            border: 4px solid ${CONFIG.colors.border};
            border-radius: 12px;
            z-index: ${CONFIG.panelZIndex};
            box-shadow: 0 0 50px rgba(255, 170, 0, 0.5);
            font-family: 'Segoe UI', monospace;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            backdrop-filter: blur(5px);
            resize: both;
        `;
        
        // Cabeçalho
        const header = document.createElement('div');
        header.style.cssText = `
            background: linear-gradient(90deg, rgba(255, 170, 0, 0.3), rgba(0, 204, 255, 0.2));
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
                <span style="background: #ff0000; color: white; padding: 2px 8px; border-radius: 10px; font-size: 10px; animation: pulse 1s infinite;">VISÍVEL</span>
            </div>
            <div style="display: flex; gap: 5px;">
                <button class="v61-minimize" style="background: #555; color: white; border: none; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;">−</button>
                <button class="v61-close" style="background: #ff5555; color: white; border: none; width: 25px; height: 25px; border-radius: 5px; cursor: pointer;">×</button>
            </div>
        `;
        
        // Conteúdo
        const content = document.createElement('div');
        content.style.cssText = `
            flex: 1;
            padding: 15px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 15px;
        `;
        
        content.innerHTML = `
            <div style="background: rgba(255, 170, 0, 0.1); padding: 15px; border-radius: 8px;">
                <div style="color: ${CONFIG.colors.primary}; font-weight: bold; margin-bottom: 10px;">📊 STATUS</div>
                <div style="color: #ffcc88; font-size: 12px;">
                    <div>Módulos: <span id="v61-module-count">verificando...</span></div>
                    <div>Imóveis: <span id="v61-property-count">${window.properties?.length || 0}</span></div>
                    <div>Posição: <span id="v61-position">(0,0)</span></div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <button id="v61-run-all" class="v61-btn-primary">▶️ Todos</button>
                <button id="v61-run-core" class="v61-btn-secondary">🧩 Core</button>
                <button id="v61-run-data" class="v61-btn-secondary">💾 Dados</button>
                <button id="v61-run-perf" class="v61-btn-secondary">⚡ Perf</button>
                <button id="v61-clear-logs" class="v61-btn-warning">🗑️ Logs</button>
                <button id="v61-export" class="v61-btn-info">📤 Export</button>
            </div>
            
            <div id="v61-results" style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 12px; min-height: 200px;">
                <div style="color: ${CONFIG.colors.primary};">📋 Resultados</div>
                <div id="v61-results-content" style="color: #ffcc88; font-size: 12px; margin-top: 10px;">
                    Clique em "Todos" para executar os testes
                </div>
            </div>
            
            <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 12px;">
                <div style="color: ${CONFIG.colors.primary};">📝 Logs</div>
                <div id="v61-logs" style="color: #88ffaa; font-size: 11px; height: 100px; overflow-y: auto; margin-top: 5px;"></div>
            </div>
        `;
        
        // Rodapé
        const footer = document.createElement('div');
        footer.style.cssText = `
            background: rgba(0,0,0,0.4);
            padding: 5px 15px;
            font-size: 10px;
            color: ${CONFIG.colors.primary}80;
            display: flex;
            justify-content: space-between;
        `;
        footer.innerHTML = `<span>v${CONFIG.version}</span><span>${new Date().toLocaleDateString()}</span>`;
        
        panel.appendChild(header);
        panel.appendChild(content);
        panel.appendChild(footer);
        
        document.body.appendChild(panel);
        
        // Estilos
        if (!document.getElementById('v61-styles')) {
            const style = document.createElement('style');
            style.id = 'v61-styles';
            style.textContent = `
                @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }
                .v61-btn-primary { background: linear-gradient(135deg, #ffaa00, #ff8800); color: white; border: none; padding: 8px; border-radius: 5px; cursor: pointer; font-size: 11px; }
                .v61-btn-secondary { background: rgba(102,204,255,0.2); color: #00ccff; border: 1px solid #00ccff; padding: 8px; border-radius: 5px; cursor: pointer; font-size: 11px; }
                .v61-btn-warning { background: rgba(255,170,0,0.2); color: #ffaa00; border: 1px solid #ffaa00; padding: 8px; border-radius: 5px; cursor: pointer; font-size: 11px; }
                .v61-btn-info { background: rgba(0,255,156,0.2); color: #00ff9c; border: 1px solid #00ff9c; padding: 8px; border-radius: 5px; cursor: pointer; font-size: 11px; }
                .v61-btn-primary:hover, .v61-btn-secondary:hover, .v61-btn-warning:hover, .v61-btn-info:hover { transform: translateY(-2px); }
            `;
            document.head.appendChild(style);
        }
        
        state.panelElement = panel;
        
        // Configurar eventos
        setupPanelEvents(panel, header);
        
        // Posicionar e garantir visibilidade
        setTimeout(() => adjustPanelPosition(), 100);
        ensurePanelVisibility();
        
        // Atualizar posição no display
        const updatePosition = () => {
            const posDisplay = document.getElementById('v61-position');
            if (posDisplay && panel) {
                const rect = panel.getBoundingClientRect();
                posDisplay.textContent = `(${Math.round(rect.left)}px, ${Math.round(rect.top)}px)`;
            }
        };
        updatePosition();
        setInterval(updatePosition, 1000);
        
        // Atualizar contagem de módulos
        const updateModules = () => {
            const moduleDisplay = document.getElementById('v61-module-count');
            if (moduleDisplay) {
                const admin = checkAdminModule();
                const gallery = checkGalleryModule();
                const count = [
                    window.properties ? 1 : 0,
                    admin.functionCount > 0 ? 1 : 0,
                    gallery.functionCount > 0 ? 1 : 0,
                    window.PdfSystem ? 1 : 0,
                    window.MediaSystem ? 1 : 0,
                    window.LoadingManager ? 1 : 0,
                    window.SharedCore ? 1 : 0
                ].filter(Boolean).length;
                moduleDisplay.textContent = `${count}/7 ativos`;
            }
        };
        updateModules();
        
        addLog('Painel V61.2 criado com sucesso', 'success');
        
        return panel;
    }
    
    function setupPanelEvents(panel, header) {
        let isDragging = false;
        let offsetX, offsetY;
        
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
            panel.style.left = (e.clientX - offsetX) + 'px';
            panel.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            panel.style.cursor = '';
        });
        
        panel.querySelector('.v61-close').addEventListener('click', () => {
            panel.style.display = 'none';
            addLog('Painel ocultado', 'warning');
        });
        
        panel.querySelector('.v61-minimize').addEventListener('click', (e) => {
            const content = panel.children[1];
            content.style.display = content.style.display === 'none' ? 'flex' : 'none';
            e.target.textContent = content.style.display === 'none' ? '+' : '−';
        });
        
        // Botões de teste
        panel.querySelector('#v61-run-all').addEventListener('click', async () => {
            const btn = panel.querySelector('#v61-run-all');
            btn.disabled = true;
            await runAllTests();
            btn.disabled = false;
        });
        
        panel.querySelector('#v61-clear-logs').addEventListener('click', clearLogs);
        panel.querySelector('#v61-export').addEventListener('click', exportResults);
    }
    
    async function runTest(testId) {
        const test = tests[testId];
        if (!test) return null;
        
        addLog(`Executando: ${test.name}...`, 'info');
        
        try {
            const start = performance.now();
            const result = await test.execute();
            const time = performance.now() - start;
            
            addLog(`${test.name}: ${result.status} (${time.toFixed(0)}ms)`, result.status);
            
            return {
                ...result,
                testId,
                testName: test.name,
                executionTime: time
            };
        } catch (error) {
            addLog(`Erro em ${test.name}: ${error.message}`, 'error');
            return null;
        }
    }
    
    async function runAllTests() {
        const resultsDiv = document.getElementById('v61-results-content');
        resultsDiv.innerHTML = '<div style="text-align: center;">🔄 Executando testes...</div>';
        
        const results = [];
        let passed = 0, warnings = 0, errors = 0;
        
        for (const [id, test] of Object.entries(tests)) {
            const result = await runTest(id);
            if (result) {
                results.push(result);
                if (result.status === 'success') passed++;
                if (result.status === 'warning') warnings++;
                if (result.status === 'error') errors++;
            }
            await new Promise(r => setTimeout(r, 200));
        }
        
        state.lastRunTimestamp = new Date().toISOString();
        
        // Exibir resultados
        let html = `<div style="margin-bottom: 10px; padding: 8px; background: rgba(0,0,0,0.3);">
            <div style="display: flex; justify-content: space-between;">
                <span style="color: #00ff9c;">✅ ${passed}</span>
                <span style="color: #ffaa00;">⚠️ ${warnings}</span>
                <span style="color: #ff5555;">❌ ${errors}</span>
            </div>
        </div>`;
        
        results.forEach(r => {
            const color = r.status === 'success' ? '#00ff9c' : r.status === 'warning' ? '#ffaa00' : '#ff5555';
            html += `<div style="padding: 5px; margin: 5px 0; background: rgba(0,0,0,0.2); border-left: 3px solid ${color};">
                <div style="color: white; font-size: 11px;">${r.testName}</div>
                <div style="color: ${color}; font-size: 10px;">${r.message}</div>
            </div>`;
        });
        
        resultsDiv.innerHTML = html;
        
        return results;
    }
    
    function addLog(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        state.logs.push({ timestamp, message, type });
        
        const logsDiv = document.getElementById('v61-logs');
        if (logsDiv) {
            const color = type === 'error' ? '#ff5555' : type === 'warning' ? '#ffaa00' : type === 'success' ? '#00ff9c' : '#88ffaa';
            const entry = document.createElement('div');
            entry.style.cssText = 'padding: 2px 0; border-bottom: 1px solid rgba(255,255,255,0.1);';
            entry.innerHTML = `<span style="color: #888;">[${timestamp}]</span> <span style="color: ${color};">${message}</span>`;
            logsDiv.appendChild(entry);
            logsDiv.scrollTop = logsDiv.scrollHeight;
            
            while (logsDiv.children.length > 50) logsDiv.removeChild(logsDiv.firstChild);
        }
        
        console.log(`[V61.2] ${message}`);
    }
    
    function clearLogs() {
        state.logs = [];
        const logsDiv = document.getElementById('v61-logs');
        if (logsDiv) logsDiv.innerHTML = '';
        addLog('Logs limpos', 'info');
    }
    
    function exportResults() {
        const data = {
            version: CONFIG.version,
            timestamp: new Date().toISOString(),
            logs: state.logs,
            environment: {
                url: window.location.href,
                properties: window.properties?.length || 0,
                viewport: `${window.innerWidth}x${window.innerHeight}`
            }
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `diagnostics-v61-${new Date().toISOString().slice(0,10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        addLog('Resultados exportados', 'success');
    }
    
    // ==================== API PÚBLICA ====================
    
    return {
        version: CONFIG.version,
        
        init: function() {
            if (state.initialized) return this;
            
            console.log(`🔧 [V61.2] Inicializando módulo...`);
            
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('diagnostics') === 'true' || urlParams.get('debug') === 'true') {
                setTimeout(() => this.createPanel(), 1500);
            }
            
            setTimeout(createEmergencyButton, 2000);
            
            state.initialized = true;
            addLog('Módulo V61.2 inicializado', 'success');
            
            return this;
        },
        
        createPanel: function() {
            return createPanel();
        },
        
        ensureVisible: function() {
            return ensurePanelVisibility();
        },
        
        log: function(message, type = 'info') {
            addLog(message, type);
        },
        
        runTests: function() {
            return runAllTests();
        },
        
        utils: {
            checkAdmin: checkAdminModule,
            checkGallery: checkGalleryModule
        }
    };
})();

// ==================== INICIALIZAÇÃO ====================
setTimeout(() => {
    if (window.DiagnosticsV61) {
        window.DiagnosticsV61.init();
        window.diagnosticsV61 = window.DiagnosticsV61;
        
        console.log('%c🔍 DIAGNÓSTICO V61.2 PRONTO - VISÍVEL', 'color: #ffaa00; font-size: 14px;');
        console.log('📋 Botão vermelho "🔴 V61" no canto inferior direito');
        console.log('📋 window.DiagnosticsV61.createPanel()');
    }
}, 1000);
