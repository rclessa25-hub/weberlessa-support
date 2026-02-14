// ================== MÓDULO DE DIAGNÓSTICO PRINCIPAL v6.1 (CADEIA PROGRESSIVA) ==================
// Diagnostics61.js - Versão final da cadeia progressiva (acumula funcionalidades de 53 a 60)
// Data: 13/02/2026
// Escopo: Análise completa do sistema, verificações de integridade, detecção de "zumbis",
//         e painel visual dedicado e exclusivo.

const Diagnostics61 = (function() {
    // ========== CONFIGURAÇÃO ==========
    const CONFIG = {
        version: '6.1',
        panelId: 'diagnostics61-panel', // ID único para o painel
        panelZIndex: 2147483646, // Z-index muito alto, logo abaixo do painel de emergência (caso exista)
        checkInterval: 30000, // 30 segundos
        criticalModules: [
            'SharedCore', 'properties', 'LoadingManager', 'MediaSystem', 
            'PdfSystem', 'FilterManager', 'admin'
        ]
    };

    // ========== ESTADO ==========
    let state = {
        panel: null,
        isPanelVisible: false,
        lastCheck: null,
        checkIntervalId: null,
        healthScore: 100,
        issues: []
    };

    // ========== FUNÇÕES DE DIAGNÓSTICO ==========

    /**
     * Verificação Base (Diagnostics53)
     * Funções fundamentais de verificação do sistema.
     */
    function runBaseChecks() {
        console.group('🔍 [DIAGNOSTICS61 - BASE] Verificações Fundamentais');
        const results = {};

        // 1. Verificação de Módulos Críticos
        results.modules = {};
        CONFIG.criticalModules.forEach(moduleName => {
            const available = typeof window[moduleName] !== 'undefined';
            results.modules[moduleName] = available;
            console.log(`${available ? '✅' : '❌'} Módulo: ${moduleName}`);
        });

        // 2. Verificação de Elementos DOM Essenciais
        const essentialElements = [
            'properties-container', 'adminPanel', 'pdfModal', 
            'uploadArea', 'pdfUploadArea'
        ];
        results.dom = {};
        essentialElements.forEach(elId => {
            const exists = !!document.getElementById(elId);
            results.dom[elId] = exists;
            console.log(`${exists ? '✅' : '❌'} Elemento DOM: #${elId}`);
        });

        // 3. Verificação de localStorage (Chave Unificada)
        try {
            const storedProps = localStorage.getItem('properties');
            if (storedProps) {
                const parsed = JSON.parse(storedProps);
                results.localStorage = {
                    exists: true,
                    isValid: Array.isArray(parsed),
                    count: Array.isArray(parsed) ? parsed.length : 0
                };
                console.log(`✅ localStorage: Chave 'properties' encontrada com ${results.localStorage.count} imóveis.`);
            } else {
                results.localStorage = { exists: false };
                console.log('❌ localStorage: Chave unificada "properties" não encontrada.');
            }
        } catch (e) {
            results.localStorage = { exists: false, error: e.message };
            console.error('❌ localStorage: Erro ao acessar/parsear.', e.message);
        }

        console.groupEnd();
        return results;
    }

    /**
     * Análise de Integridade (Diagnostics54-57)
     * Verifica a saúde e consistência dos dados.
     */
    function runIntegrityChecks(baseResults) {
        console.group('🧪 [DIAGNOSTICS61 - INTEGRIDADE] Verificando Consistência');
        const results = {};

        // 1. Consistência window.properties vs localStorage
        const memoryProps = window.properties || [];
        const storageProps = baseResults.localStorage?.exists 
            ? (JSON.parse(localStorage.getItem('properties') || '[]')) 
            : [];

        results.memoryVsStorage = {
            memoryCount: memoryProps.length,
            storageCount: storageProps.length,
            isConsistent: memoryProps.length === storageProps.length
        };
        console.log(`${results.memoryVsStorage.isConsistent ? '✅' : '⚠️'} Memória (${memoryProps.length}) vs Storage (${storageProps.length})`);

        // 2. Verificação de IDs Duplicados
        if (memoryProps.length > 0) {
            const ids = memoryProps.map(p => p.id);
            const uniqueIds = new Set(ids);
            results.duplicateIds = ids.length !== uniqueIds.size;
            console.log(`${results.duplicateIds ? '❌' : '✅'} IDs duplicados: ${results.duplicateIds ? 'SIM' : 'NÃO'}`);
        } else {
            results.duplicateIds = false;
        }

        // 3. Verificação de Campos Obrigatórios em Propriedades
        if (memoryProps.length > 0) {
            let missingFields = 0;
            memoryProps.forEach(prop => {
                if (!prop.title || !prop.price || !prop.location) missingFields++;
            });
            results.missingRequiredFields = missingFields;
            console.log(`${missingFields === 0 ? '✅' : '⚠️'} Campos obrigatórios faltando: ${missingFields}`);
        } else {
            results.missingRequiredFields = 0;
        }

        // 4. Verificação de URLs de Imagem (básica)
        if (memoryProps.length > 0) {
            let invalidImageUrls = 0;
            memoryProps.forEach(prop => {
                if (prop.images && prop.images !== 'EMPTY') {
                    const urls = prop.images.split(',').filter(u => u.trim());
                    urls.forEach(url => {
                        if (!url.startsWith('http') && !url.startsWith('blob:')) {
                            invalidImageUrls++;
                        }
                    });
                }
            });
            results.invalidImageUrls = invalidImageUrls;
            console.log(`${invalidImageUrls === 0 ? '✅' : '⚠️'} URLs de imagem potencialmente inválidas: ${invalidImageUrls}`);
        } else {
            results.invalidImageUrls = 0;
        }

        console.groupEnd();
        return results;
    }

    /**
     * Detecção de "Zumbis" (Diagnostics58)
     * Identifica variáveis globais, listeners e intervalos órfãos.
     */
    function runZombieDetection() {
        console.group('🧟 [DIAGNOSTICS61 - ZUMBIS] Detectando Elementos Órfãos');
        const zombies = {};

        // 1. Variáveis Globais Suspeitas (que não deveriam estar no escopo global)
        const suspiciousGlobals = [];
        const knownGlobals = new Set([
            'window', 'document', 'console', 'localStorage', 'sessionStorage',
            'fetch', 'XMLHttpRequest', 'Image', 'setTimeout', 'setInterval',
            'requestAnimationFrame', 'Promise', 'supabase', ...CONFIG.criticalModules
        ]);
        
        for (let key in window) {
            // Filtrar itens comuns do navegador e do nosso sistema
            if (!knownGlobals.has(key) && 
                !key.startsWith('on') && 
                typeof window[key] !== 'undefined' &&
                !key.includes('webkit') &&
                !key.includes('moz') &&
                !key.includes('ms') &&
                window.hasOwnProperty(key) // Verifica se é propriedade própria
            ) {
                suspiciousGlobals.push(key);
            }
        }
        zombies.suspiciousGlobals = suspiciousGlobals.slice(0, 20); // Limitar a 20
        console.log(`👻 Variáveis globais suspeitas: ${zombies.suspiciousGlobals.length > 0 ? zombies.suspiciousGlobals.join(', ') : 'Nenhuma'}`);

        // 2. Intervalos Ativos (setInterval)
        // Esta é uma heurística. Contar intervalos é complexo.
        // Vamos verificar se existe algum intervalo definido por nós que possa ter vazado.
        // Como não temos referência direta, vamos apenas sinalizar que esta verificação existe.
        console.log('⏱️ Verificação de intervalos: Necessário inspeção manual no código para 'setInterval' não limpos.');
        zombies.intervals = 'Inspeção manual recomendada';

        // 3. Listeners de Evento no document e window (potencialmente excessivos)
        // Também é complexo contar de forma confiável.
        console.log('👂 Verificação de listeners: Necessário inspeção manual.');
        zombies.eventListeners = 'Inspeção manual recomendada';

        console.groupEnd();
        return zombies;
    }

    /**
     * Testes de Performance (Diagnostics59-60)
     * Avalia o tempo de resposta de funções críticas.
     */
    async function runPerformanceTests() {
        console.group('⚡ [DIAGNOSTICS61 - PERFORMANCE] Medindo Tempos de Resposta');
        const results = {};

        // 1. Tempo de renderização da galeria
        if (typeof window.renderProperties === 'function') {
            const start = performance.now();
            try {
                // Renderizar sem alterar o filtro atual, apenas para medir
                window.renderProperties(window.currentFilter || 'todos');
                const duration = performance.now() - start;
                results.renderGallery = { success: true, duration: Math.round(duration) };
                console.log(`🖼️ Renderização da galeria: ${results.renderGallery.duration}ms`);
            } catch (e) {
                results.renderGallery = { success: false, error: e.message };
                console.error('❌ Erro ao medir renderização:', e.message);
            }
        } else {
            results.renderGallery = { success: false, error: 'Função não disponível' };
        }

        // 2. Tempo de acesso ao localStorage
        try {
            const start = performance.now();
            localStorage.getItem('properties');
            const duration = performance.now() - start;
            results.localStorageAccess = { success: true, duration: Math.round(duration) };
            console.log(`💾 Acesso ao localStorage: ${results.localStorageAccess.duration}ms`);
        } catch (e) {
            results.localStorageAccess = { success: false, error: e.message };
        }

        // 3. Tempo de parse de JSON (simulado com dados atuais)
        if (window.properties) {
            const start = performance.now();
            try {
                JSON.stringify(window.properties);
                const duration = performance.now() - start;
                results.jsonStringify = { success: true, duration: Math.round(duration) };
                console.log(`🔧 JSON.stringify (${window.properties.length} props): ${results.jsonStringify.duration}ms`);
            } catch (e) {
                results.jsonStringify = { success: false, error: e.message };
            }
        } else {
            results.jsonStringify = { success: false, error: 'window.properties vazio' };
        }

        console.groupEnd();
        return results;
    }

    /**
     * Cálculo da Pontuação de Saúde (Health Score)
     */
    function calculateHealthScore(base, integrity, zombies, performance) {
        let score = 100;
        const issues = [];

        // Penalidades por módulos faltando
        const missingModules = Object.entries(base.modules || {}).filter(([_, avail]) => !avail).map(([name]) => name);
        if (missingModules.length > 0) {
            score -= missingModules.length * 10;
            issues.push(`❌ Módulos críticos ausentes: ${missingModules.join(', ')}`);
        }

        // Penalidades por elementos DOM faltando
        const missingDom = Object.entries(base.dom || {}).filter(([_, exists]) => !exists).map(([id]) => `#${id}`);
        if (missingDom.length > 0) {
            score -= missingDom.length * 2;
            issues.push(`⚠️ Elementos DOM essenciais ausentes: ${missingDom.join(', ')}`);
        }

        // Penalidades por inconsistência de dados
        if (!integrity.memoryVsStorage?.isConsistent) {
            score -= 10;
            issues.push(`⚠️ Inconsistência: Memória (${integrity.memoryVsStorage?.memoryCount}) vs Storage (${integrity.memoryVsStorage?.storageCount})`);
        }
        if (integrity.duplicateIds) {
            score -= 15;
            issues.push('❌ IDs duplicados detectados!');
        }
        if (integrity.missingRequiredFields > 0) {
            score -= 5 * integrity.missingRequiredFields;
            issues.push(`⚠️ ${integrity.missingRequiredFields} imóvel(is) com campos obrigatórios faltando.`);
        }
        if (integrity.invalidImageUrls > 0) {
            score -= 2 * integrity.invalidImageUrls;
            issues.push(`⚠️ ${integrity.invalidImageUrls} URL(s) de imagem potencialmente inválida(s).`);
        }

        // Penalidades por zumbis
        if (zombies.suspiciousGlobals && zombies.suspiciousGlobals.length > 0) {
            score -= Math.min(zombies.suspiciousGlobals.length * 0.5, 5); // Máx 5 pontos
            issues.push(`👻 ${zombies.suspiciousGlobals.length} variável(is) global(is) suspeita(s).`);
        }

        // Penalidades por performance ruim
        if (performance.renderGallery?.duration > 500) {
            score -= 5;
            issues.push(`🐢 Renderização da galeria lenta (${performance.renderGallery.duration}ms > 500ms)`);
        }
        if (performance.jsonStringify?.duration > 200) {
            score -= 5;
            issues.push(`🐢 JSON.stringify lento (${performance.jsonStringify.duration}ms > 200ms)`);
        }

        return { score: Math.max(0, score), issues };
    }

    // ========== PAINEL VISUAL DEDICADO ==========
    function createVisualPanel() {
        // Se já existe, apenas mostrar e atualizar
        let panel = document.getElementById(CONFIG.panelId);
        if (panel) {
            panel.style.display = 'flex';
            updatePanelContent(panel);
            return panel;
        }

        // Criar o painel
        panel = document.createElement('div');
        panel.id = CONFIG.panelId;
        panel.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            width: 480px;
            max-height: 80vh;
            background: linear-gradient(145deg, #1a1a2e, #16213e);
            border: 2px solid #0f3460;
            border-radius: 16px;
            box-shadow: 0 15px 40px rgba(0, 255, 255, 0.2);
            z-index: ${CONFIG.panelZIndex};
            color: #e0e0e0;
            font-family: 'Segoe UI', 'Courier New', monospace;
            font-size: 13px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            backdrop-filter: blur(5px);
            border-left: 5px solid #00adb5;
            transition: all 0.3s ease;
            resize: both;
            overflow: auto;
        `;

        // Cabeçalho
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 15px 20px;
            background: rgba(0, 0, 0, 0.4);
            border-bottom: 1px solid #0f3460;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
            user-select: none;
        `;
        header.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 1.4rem;">🩺</span>
                <span style="font-weight: bold; color: #00adb5; letter-spacing: 1px;">DIAGNOSTICS61 v${CONFIG.version}</span>
            </div>
            <div style="display: flex; gap: 8px;">
                <button id="${CONFIG.panelId}-minimize" style="background: #0f3460; border: none; color: white; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-weight: bold;">−</button>
                <button id="${CONFIG.panelId}-close" style="background: #913e3e; border: none; color: white; width: 28px; height: 28px; border-radius: 6px; cursor: pointer; font-weight: bold;">×</button>
            </div>
        `;

        // Corpo
        const body = document.createElement('div');
        body.id = `${CONFIG.panelId}-body`;
        body.style.cssText = `
            padding: 20px;
            overflow-y: auto;
            flex: 1;
            background: rgba(0, 0, 0, 0.2);
        `;
        body.innerHTML = '<div style="text-align: center; padding: 30px;">🔍 Executando diagnóstico...</div>';

        // Montar painel
        panel.appendChild(header);
        panel.appendChild(body);
        document.body.appendChild(panel);

        // Tornar arrastável
        makeDraggable(panel, header);

        // Event listeners dos botões
        document.getElementById(`${CONFIG.panelId}-close`).addEventListener('click', () => {
            panel.style.display = 'none';
            state.isPanelVisible = false;
        });
        document.getElementById(`${CONFIG.panelId}-minimize`).addEventListener('click', () => {
            body.style.display = body.style.display === 'none' ? 'block' : 'none';
        });

        // Preencher conteúdo
        updatePanelContent(panel);

        state.panel = panel;
        state.isPanelVisible = true;
        return panel;
    }

    function makeDraggable(element, handle) {
        let isDragging = false;
        let offsetX, offsetY;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.tagName === 'BUTTON') return;
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            element.style.cursor = 'grabbing';
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
            element.style.right = 'auto';
            element.style.bottom = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'default';
        });
    }

    async function updatePanelContent(panel) {
        const body = panel.querySelector(`#${CONFIG.panelId}-body`);
        if (!body) return;

        body.innerHTML = '<div style="text-align: center; padding: 20px;">⏳ Executando diagnóstico completo...</div>';

        // Executar todas as verificações
        const base = runBaseChecks();
        const integrity = runIntegrityChecks(base);
        const zombies = runZombieDetection();
        const performance = await runPerformanceTests();
        const health = calculateHealthScore(base, integrity, zombies, performance);

        // Gerar HTML do relatório
        let html = `
            <div style="margin-bottom: 15px; background: rgba(0, 173, 181, 0.15); padding: 12px; border-radius: 10px; border-left: 4px solid #00adb5;">
                <div style="font-size: 1.1rem; font-weight: bold; display: flex; align-items: center; gap: 8px;">
                    <span>🩺</span> SAÚDE DO SISTEMA
                </div>
                <div style="font-size: 2rem; font-weight: bold; color: ${health.score > 80 ? '#00ff9c' : (health.score > 50 ? '#ffaa00' : '#ff5555')};">${health.score}%</div>
                ${health.issues.length > 0 ? `<div style="color: #ffaa00; font-size: 0.85rem; margin-top: 5px;">⚠️ ${health.issues.length} issue(s)</div>` : '<div style="color: #00ff9c; margin-top: 5px;">✅ Nenhum problema crítico</div>'}
            </div>

            <div style="margin-bottom: 10px; font-weight: bold; color: #aaa;">📋 RESUMO DAS VERIFICAÇÕES</div>
        `;

        // Módulos
        const moduleList = Object.entries(base.modules || {}).map(([name, ok]) => 
            `<span style="background: ${ok ? '#1e4a4a' : '#4a1e1e'}; padding: 2px 6px; border-radius: 12px; margin: 0 2px 4px 0; display: inline-block; font-size: 11px;">${ok ? '✅' : '❌'} ${name}</span>`
        ).join('');
        html += `<div style="margin-bottom: 15px;"><div style="color: #00adb5;">Módulos Críticos:</div><div style="margin-top: 5px;">${moduleList}</div></div>`;

        // Dados
        html += `<div style="margin-bottom: 15px;"><div style="color: #00adb5;">Dados:</div>`;
        html += `<div>🏠 Memória: <strong>${integrity.memoryVsStorage?.memoryCount}</strong> | Storage: <strong>${integrity.memoryVsStorage?.storageCount}</strong> ${integrity.memoryVsStorage?.isConsistent ? '✅' : '⚠️'}</div>`;
        html += `<div>🆔 IDs duplicados: ${integrity.duplicateIds ? '❌ SIM' : '✅ NÃO'}</div>`;
        html += `<div>📸 URLs inválidas: ${integrity.invalidImageUrls > 0 ? integrity.invalidImageUrls : '✅ Nenhuma'}</div>`;
        html += `</div>`;

        // Zumbis
        html += `<div style="margin-bottom: 15px;"><div style="color: #00adb5;">Zumbis:</div>`;
        if (zombies.suspiciousGlobals?.length > 0) {
            html += `<div>👻 Globais suspeitas: ${zombies.suspiciousGlobals.slice(0, 5).join(', ')}${zombies.suspiciousGlobals.length > 5 ? '...' : ''}</div>`;
        } else {
            html += `<div>✅ Nenhuma global suspeita detectada.</div>`;
        }
        html += `</div>`;

        // Performance
        html += `<div style="margin-bottom: 15px;"><div style="color: #00adb5;">Performance:</div>`;
        html += `<div>🖼️ Render Galeria: ${performance.renderGallery?.duration || 'N/A'}ms ${performance.renderGallery?.duration > 500 ? '🐢' : '⚡'}</div>`;
        html += `<div>💾 Acesso Storage: ${performance.localStorageAccess?.duration || 'N/A'}ms</div>`;
        html += `<div>🔧 JSON.stringify: ${performance.jsonStringify?.duration || 'N/A'}ms</div>`;
        html += `</div>`;

        // Botão de ação
        html += `
            <div style="text-align: center; margin-top: 20px;">
                <button id="${CONFIG.panelId}-refresh" style="background: #00adb5; border: none; color: #1a1a2e; padding: 10px 20px; border-radius: 25px; font-weight: bold; cursor: pointer; width: 100%;">
                    🔄 ATUALIZAR DIAGNÓSTICO
                </button>
            </div>
        `;

        body.innerHTML = html;

        // Adicionar listener ao botão de refresh
        document.getElementById(`${CONFIG.panelId}-refresh`)?.addEventListener('click', () => {
            updatePanelContent(panel);
        });
    }

    // ========== API PÚBLICA ==========
    return {
        version: CONFIG.version,
        
        // Executar diagnóstico completo
        runFullDiagnostic: async function() {
            console.log(`🔬 [DIAGNOSTICS61] Executando diagnóstico completo v${CONFIG.version}...`);
            const base = runBaseChecks();
            const integrity = runIntegrityChecks(base);
            const zombies = runZombieDetection();
            const performance = await runPerformanceTests();
            const health = calculateHealthScore(base, integrity, zombies, performance);

            console.log(`🏥 Health Score: ${health.score}%`);
            if (health.issues.length > 0) {
                console.warn('⚠️ Issues encontradas:', health.issues);
            } else {
                console.log('✅ Nenhuma issue crítica encontrada.');
            }

            return {
                timestamp: new Date().toISOString(),
                version: CONFIG.version,
                healthScore: health.score,
                issues: health.issues,
                details: { base, integrity, zombies, performance }
            };
        },

        // Mostrar painel visual
        showPanel: function() {
            createVisualPanel();
        },

        // Esconder painel visual
        hidePanel: function() {
            const panel = document.getElementById(CONFIG.panelId);
            if (panel) {
                panel.style.display = 'none';
                state.isPanelVisible = false;
            }
        },

        // Iniciar monitoramento periódico
        startMonitoring: function(interval = CONFIG.checkInterval) {
            if (state.checkIntervalId) {
                clearInterval(state.checkIntervalId);
            }
            state.checkIntervalId = setInterval(() => {
                this.runFullDiagnostic().then(result => {
                    state.lastCheck = result;
                    // Se o painel estiver visível, atualiza seu conteúdo
                    const panel = document.getElementById(CONFIG.panelId);
                    if (panel && panel.style.display !== 'none') {
                        updatePanelContent(panel);
                    }
                });
            }, interval);
            console.log(`🕒 Monitoramento iniciado (intervalo: ${interval}ms)`);
        },

        // Parar monitoramento
        stopMonitoring: function() {
            if (state.checkIntervalId) {
                clearInterval(state.checkIntervalId);
                state.checkIntervalId = null;
                console.log('🛑 Monitoramento parado.');
            }
        },

        // Obter estado
        getState: () => ({ ...state }),

        // Inicialização automática
        init: function() {
            console.log(`🔧 Diagnostics61 v${CONFIG.version} inicializado.`);
            // Executa um diagnóstico rápido na inicialização
            setTimeout(() => {
                this.runFullDiagnostic();
            }, 2000);

            // Se a URL contiver ?panel=true, mostrar o painel automaticamente
            if (window.location.search.includes('panel=true')) {
                setTimeout(() => this.showPanel(), 1000);
            }
        }
    };
})();

// ========== EXPORTAÇÃO GLOBAL ==========
window.Diagnostics61 = Diagnostics61;

// ========== INICIALIZAÇÃO AUTOMÁTICA SE CARREGADO COM ?debug=true&diagnostics=true ==========
if (window.location.search.includes('debug=true') && window.location.search.includes('diagnostics=true')) {
    // Pequeno delay para garantir que o DOM e outros módulos carregaram
    setTimeout(() => {
        Diagnostics61.init();
        // Mostrar o painel automaticamente em modo diagnóstico completo
        Diagnostics61.showPanel();
        console.log('%c🩺 DIAGNOSTICS61 v6.1 ATIVADO - Painel visual exibido', 'color: #00adb5; font-weight: bold; font-size: 14px;');
    }, 1500);
}

// Atalho no console
console.log('%c🩺 Diagnostics61 v6.1 carregado. Use window.Diagnostics61.showPanel() para o painel visual.', 'color: #00adb5;');
