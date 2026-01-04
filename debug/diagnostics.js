console.log('🔍 diagnostics.js – diagnóstico completo com testes integrados');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const DEBUG_MODE = params.get('debug') === 'true';
const DIAGNOSTICS_MODE = params.get('diagnostics') === 'true';

/* ================== PAINEL VISUAL COMPLETO ================== */
let diagnosticsPanel = null;

function createDiagnosticsPanel() {
    diagnosticsPanel = document.createElement('div');
    diagnosticsPanel.id = 'diagnostics-panel-complete';
    diagnosticsPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 800px;
        max-height: 90vh;
        overflow-y: auto;
        background: #0b0b0b;
        color: #00ff9c;
        font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
        font-size: 12px;
        padding: 15px;
        border: 2px solid #00ff9c;
        border-radius: 8px;
        z-index: 999999;
        box-shadow: 0 0 30px rgba(0, 255, 156, 0.4);
    `;
    
    // Cabeçalho com controles
    diagnosticsPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div style="font-size: 16px; font-weight: bold; color: #00ff9c;">
                🚀 DIAGNÓSTICO COMPLETO DO SISTEMA
            </div>
            <div style="display: flex; gap: 8px;">
                <button id="minimize-btn" style="
                    background: #555; color: white; border: none; 
                    padding: 4px 8px; cursor: pointer; border-radius: 3px;
                    font-size: 10px;">
                    ▁
                </button>
                <button id="close-btn" style="
                    background: #ff5555; color: white; border: none; 
                    padding: 4px 8px; cursor: pointer; border-radius: 3px;
                    font-size: 10px;">
                    ✕
                </button>
            </div>
        </div>
        <div style="color: #888; font-size: 11px; margin-bottom: 20px;">
            Modo: ${DEBUG_MODE ? 'DEBUG' : 'NORMAL'} | ${DIAGNOSTICS_MODE ? 'DIAGNÓSTICO ATIVO' : 'DIAGNÓSTICO INATIVO'}
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
            <button id="run-all-tests" style="
                background: #00ff9c; color: #000; border: none;
                padding: 8px 12px; cursor: pointer; border-radius: 4px;
                font-weight: bold; flex: 1;">
                🧪 EXECUTAR TODOS OS TESTES
            </button>
            <button id="export-btn" style="
                background: #0088cc; color: white; border: none;
                padding: 8px 12px; cursor: pointer; border-radius: 4px;
                font-weight: bold; flex: 1;">
                📊 EXPORTAR RELATÓRIO
            </button>
            <button id="clear-log" style="
                background: #555; color: white; border: none;
                padding: 8px 12px; cursor: pointer; border-radius: 4px;
                font-weight: bold; flex: 1;">
                🧹 LIMPAR LOG
            </button>
        </div>
        <div id="tabs" style="display: flex; border-bottom: 1px solid #333; margin-bottom: 15px;">
            <button data-tab="overview" class="tab-btn active" style="
                background: #333; color: #00ff9c; border: none; border-bottom: 2px solid #00ff9c;
                padding: 8px 16px; cursor: pointer;">
                📈 VISÃO GERAL
            </button>
            <button data-tab="modules" class="tab-btn" style="
                background: transparent; color: #888; border: none;
                padding: 8px 16px; cursor: pointer;">
                ⚙️ MÓDULOS
            </button>
            <button data-tab="tests" class="tab-btn" style="
                background: transparent; color: #888; border: none;
                padding: 8px 16px; cursor: pointer;">
                🧪 TESTES
            </button>
            <button data-tab="systems" class="tab-btn" style="
                background: transparent; color: #888; border: none;
                padding: 8px 16px; cursor: pointer;">
                🔧 SISTEMAS
            </button>
            <button data-tab="console" class="tab-btn" style="
                background: transparent; color: #888; border: none;
                padding: 8px 16px; cursor: pointer;">
                📝 CONSOLE
            </button>
        </div>
        <div id="content-area" style="min-height: 400px; max-height: 60vh; overflow-y: auto;">
            <div id="overview-content" class="tab-content" style="display: block;">
                <!-- Conteúdo será preenchido dinamicamente -->
            </div>
            <div id="modules-content" class="tab-content" style="display: none;"></div>
            <div id="tests-content" class="tab-content" style="display: none;"></div>
            <div id="systems-content" class="tab-content" style="display: none;"></div>
            <div id="console-content" class="tab-content" style="display: none;"></div>
        </div>
        <div id="status-bar" style="
            margin-top: 15px; padding: 8px; background: #111; 
            border-radius: 4px; font-size: 11px; color: #888;">
            Status: Aguardando análise...
        </div>
    `;
    
    document.body.appendChild(diagnosticsPanel);
    
    // Configurar eventos
    setupPanelEvents();
}

/* ================== FUNÇÕES DO PAINEL ================== */
function setupPanelEvents() {
    // Botões de controle
    document.getElementById('close-btn').addEventListener('click', () => {
        diagnosticsPanel.style.display = 'none';
    });
    
    document.getElementById('minimize-btn').addEventListener('click', () => {
        const content = document.getElementById('content-area');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
    });
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active de todas
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = '#888';
                b.style.borderBottom = 'none';
            });
            
            // Ativa atual
            btn.classList.add('active');
            btn.style.background = '#333';
            btn.style.color = '#00ff9c';
            btn.style.borderBottom = '2px solid #00ff9c';
            
            // Mostra conteúdo correto
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            document.getElementById(`${btn.dataset.tab}-content`).style.display = 'block';
        });
    });
    
    // Botão executar todos testes
    document.getElementById('run-all-tests').addEventListener('click', async () => {
        await runCompleteDiagnosis();
    });
    
    // Botão exportar
    document.getElementById('export-btn').addEventListener('click', exportReport);
    
    // Botão limpar log
    document.getElementById('clear-log').addEventListener('click', () => {
        document.getElementById('console-content').innerHTML = '';
        logToPanel('📝 Console limpo', 'info');
    });
}

function logToPanel(message, type = 'info') {
    const colors = {
        'info': '#00ff9c',
        'success': '#00ff9c',
        'error': '#ff5555',
        'warning': '#ffaa00',
        'debug': '#8888ff'
    };
    
    const icons = {
        'info': '📝',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'debug': '🔍'
    };
    
    const logLine = document.createElement('div');
    logLine.style.cssText = `
        margin: 2px 0;
        padding: 4px;
        border-left: 3px solid ${colors[type]};
        background: ${type === 'error' ? '#1a0000' : type === 'warning' ? '#1a1a00' : 'transparent'};
    `;
    logLine.innerHTML = `<span style="color: ${colors[type]}">${icons[type]} ${message}</span>`;
    
    const consoleContent = document.getElementById('console-content');
    consoleContent.appendChild(logLine);
    consoleContent.scrollTop = consoleContent.scrollHeight;
    
    // Também loga no console real
    const consoleFunc = type === 'error' ? console.error : 
                       type === 'warning' ? console.warn : console.log;
    consoleFunc(`[DIAG] ${message}`);
}

function updateStatus(message, type = 'info') {
    const statusBar = document.getElementById('status-bar');
    statusBar.innerHTML = `<strong>Status:</strong> ${message}`;
    statusBar.style.color = type === 'error' ? '#ff5555' : 
                           type === 'success' ? '#00ff9c' : '#888';
}

/* ================== ANÁLISE DO SISTEMA ================== */
function analyzeSystem() {
    logToPanel('Iniciando análise do sistema...', 'info');
    updateStatus('Analisando sistema...');
    
    // 1. Coleta de scripts
    const scripts = Array.from(document.scripts)
        .filter(s => s.src)
        .map(s => ({
            src: s.src,
            fileName: s.src.split('/').pop(),
            async: s.async,
            defer: s.defer,
            type: s.type
        }));
    
    // 2. Sistemas detectados
    const systems = {
        MediaSystem: 'MediaSystem' in window,
        PdfLogger: 'PdfLogger' in window,
        ValidationSystem: 'ValidationSystem' in window,
        EmergencySystem: 'EmergencySystem' in window,
        supabase: 'supabase' in window,
        properties: 'properties' in window,
        admin: 'toggleAdminPanel' in window,
        gallery: 'gallery' in window,
        optimizer: 'performanceOptimizer' in window
    };
    
    // 3. Funções críticas
    const criticalFunctions = {
        MediaSystem: ['processAndSavePdfs', 'clearAllPdfs', 'loadExistingPdfsForEdit', 'getPdfsToSave', 'getMediaUrlsForProperty'],
        Global: ['processAndSavePdfs', 'clearAllPdfs', 'getMediaUrlsForProperty']
    };
    
    // 4. Elementos críticos do DOM
    const criticalElements = {
        'pdfModal': document.getElementById('pdfModal'),
        'pdfPassword': document.getElementById('pdfPassword'),
        'mediaUpload': document.getElementById('mediaUpload'),
        'adminPanel': document.getElementById('adminPanel')
    };
    
    return { scripts, systems, criticalFunctions, criticalElements };
}

/* ================== CLASSIFICAÇÃO DE MÓDULOS ================== */
function classifyModule(fileName) {
    const coreModules = [
        'admin.js', 'properties.js', 'gallery.js', 
        'properties-core.js', 'media-core.js', 'pdf-core.js'
    ];
    
    const performanceModules = [
        'optimizer.js', 'core-optimizer.js'
    ];
    
    const supportModules = [
        'diagnostics.js', 'function-verifier.js', 'media-logger.js',
        'media-recovery.js', 'pdf-logger.js', 'duplication-checker.js',
        'emergency-recovery.js', 'simple-checker.js', 'validation.js',
        'validation-essentials.js'
    ];
    
    const uiModules = [
        'media-ui.js', 'media-integration.js', 'pdf-ui.js', 'pdf-integration.js'
    ];
    
    const utilModules = [
        'utils.js', 'media-utils.js', 'pdf-utils.js'
    ];
    
    if (coreModules.includes(fileName)) return { type: 'CORE', emoji: '⚙️' };
    if (performanceModules.includes(fileName)) return { type: 'PERFORMANCE', emoji: '⚡' };
    if (supportModules.includes(fileName)) return { type: 'SUPPORT', emoji: '🔧' };
    if (uiModules.includes(fileName)) return { type: 'UI', emoji: '🎨' };
    if (utilModules.includes(fileName)) return { type: 'UTIL', emoji: '🧰' };
    if (fileName.includes('supabase')) return { type: 'EXTERNAL', emoji: '📦' };
    
    return { type: 'UNKNOWN', emoji: '❓' };
}

/* ================== TESTES AUTOMÁTICOS ================== */
async function testMediaUnifiedComplete() {
    logToPanel('🧪 Iniciando teste completo do sistema unificado...', 'debug');
    
    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };
    
    // Teste 1: MediaSystem disponível
    if (!window.MediaSystem) {
        results.tests.push({ name: 'MediaSystem disponível', passed: false, message: 'MediaSystem não encontrado' });
        logToPanel('❌ MediaSystem não disponível', 'error');
    } else {
        results.tests.push({ name: 'MediaSystem disponível', passed: true });
        logToPanel('✅ MediaSystem disponível', 'success');
        results.passed++;
    }
    
    // Teste 2: Funções críticas do MediaSystem
    if (window.MediaSystem) {
        const criticalFunctions = [
            'processAndSavePdfs',
            'clearAllPdfs',
            'loadExistingPdfsForEdit',
            'getPdfsToSave',
            'getMediaUrlsForProperty'
        ];
        
        criticalFunctions.forEach(func => {
            const exists = typeof MediaSystem[func] === 'function';
            results.tests.push({ 
                name: `MediaSystem.${func}`, 
                passed: exists 
            });
            
            logToPanel(`${exists ? '✅' : '❌'} ${func}`, exists ? 'success' : 'error');
            if (exists) results.passed++;
            else results.failed++;
        });
    }
    
    // Teste 3: Modal de PDF
    logToPanel('🔍 Testando modal de PDF...', 'debug');
    const pdfModal = document.getElementById('pdfModal');
    const pdfPassword = document.getElementById('pdfPassword');
    
    const modalExists = !!pdfModal;
    const passwordExists = !!pdfPassword;
    
    results.tests.push({ 
        name: 'PDF Modal existe', 
        passed: modalExists,
        message: modalExists ? 'Modal encontrado' : 'Modal não encontrado'
    });
    
    results.tests.push({ 
        name: 'PDF Password field existe', 
        passed: passwordExists,
        message: passwordExists ? 'Campo encontrado' : 'Campo não encontrado'
    });
    
    logToPanel(`PDF Modal: ${modalExists ? '✅ Existe' : '❌ Não existe'}`, modalExists ? 'success' : 'error');
    logToPanel(`Password Field: ${passwordExists ? '✅ Existe' : '❌ Não existe'}`, passwordExists ? 'success' : 'error');
    
    if (pdfPassword) {
        logToPanel(`Estilo display: ${pdfPassword.style.display}`, 'info');
        logToPanel(`Estilo visibility: ${pdfPassword.style.visibility}`, 'info');
    }
    
    if (modalExists) results.passed++;
    else results.failed++;
    
    if (passwordExists) results.passed++;
    else results.failed++;
    
    // Teste 4: Funções globais do admin
    logToPanel('🔍 Verificando funções globais do admin...', 'debug');
    
    const adminFunctions = [
        'processAndSavePdfs',
        'clearAllPdfs',
        'getMediaUrlsForProperty'
    ];
    
    adminFunctions.forEach(func => {
        const exists = typeof window[func] === 'function';
        results.tests.push({ 
            name: `window.${func}`, 
            passed: exists,
            message: exists ? 'Função disponível' : 'Função não disponível'
        });
        
        logToPanel(`window.${func}: ${exists ? '✅' : '❌'}`, exists ? 'success' : 'error');
        if (exists) results.passed++;
        else results.failed++;
    });
    
    // Teste 5: Sistema de propriedades
    if (window.properties && Array.isArray(window.properties)) {
        results.tests.push({ 
            name: 'Propriedades carregadas', 
            passed: true,
            message: `${window.properties.length} propriedades carregadas`
        });
        logToPanel(`✅ ${window.properties.length} propriedades carregadas`, 'success');
        results.passed++;
    } else {
        results.tests.push({ 
            name: 'Propriedades carregadas', 
            passed: false,
            message: 'Propriedades não carregadas'
        });
        logToPanel('❌ Propriedades não carregadas', 'error');
        results.failed++;
    }
    
    // Teste 6: Supabase
    if (window.supabase) {
        results.tests.push({ 
            name: 'Supabase Client', 
            passed: true,
            message: 'Cliente Supabase disponível'
        });
        logToPanel('✅ Supabase Client disponível', 'success');
        results.passed++;
    } else {
        results.tests.push({ 
            name: 'Supabase Client', 
            passed: false,
            message: 'Cliente Supabase não disponível'
        });
        logToPanel('⚠️  Supabase Client não disponível (pode ser normal em fallback)', 'warning');
    }
    
    return results;
}

/* ================== RELATÓRIOS ================== */
function updateOverview(data) {
    const overviewContent = document.getElementById('overview-content');
    
    const { scripts, systems, criticalElements } = data;
    
    // Agrupa scripts por tipo
    const modulesByType = {};
    scripts.forEach(script => {
        const classification = classifyModule(script.fileName);
        modulesByType[classification.type] = modulesByType[classification.type] || [];
        modulesByType[classification.type].push(script);
    });
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 10px;">📊 RESUMO DO SISTEMA</h3>
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                <div style="background: #111; padding: 15px; border-radius: 6px;">
                    <div style="color: #888; font-size: 11px;">SCRIPTS</div>
                    <div style="font-size: 24px; color: #00ff9c;">${scripts.length}</div>
                </div>
                <div style="background: #111; padding: 15px; border-radius: 6px;">
                    <div style="color: #888; font-size: 11px;">SISTEMAS ATIVOS</div>
                    <div style="font-size: 24px; color: #00ff9c;">
                        ${Object.values(systems).filter(Boolean).length}/${Object.keys(systems).length}
                    </div>
                </div>
                <div style="background: #111; padding: 15px; border-radius: 6px;">
                    <div style="color: #888; font-size: 11px;">HEALTH SCORE</div>
                    <div style="font-size: 24px; color: #00ff9c;" id="health-score">--</div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 10px;">🔧 SISTEMAS PRINCIPAIS</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
    `;
    
    Object.entries(systems).forEach(([system, active]) => {
        html += `
            <div style="background: #111; padding: 10px; border-radius: 4px; border-left: 3px solid ${active ? '#00ff9c' : '#ff5555'};">
                <div style="display: flex; justify-content: space-between;">
                    <span>${system}</span>
                    <span style="color: ${active ? '#00ff9c' : '#ff5555'}">
                        ${active ? '✅ ATIVO' : '❌ AUSENTE'}
                    </span>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
        
        <div>
            <h3 style="color: #00ff9c; margin-bottom: 10px;">🎯 ELEMENTOS CRÍTICOS</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
    `;
    
    Object.entries(criticalElements).forEach(([element, domElement]) => {
        const exists = !!domElement;
        html += `
            <div style="background: #111; padding: 10px; border-radius: 4px; border-left: 3px solid ${exists ? '#00ff9c' : '#ff5555'};">
                <div style="display: flex; justify-content: space-between;">
                    <span>${element}</span>
                    <span style="color: ${exists ? '#00ff9c' : '#ff5555'}">
                        ${exists ? '✅ PRESENTE' : '❌ AUSENTE'}
                    </span>
                </div>
                ${exists ? `<div style="font-size: 10px; color: #888; margin-top: 5px;">${domElement.tagName}</div>` : ''}
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    overviewContent.innerHTML = html;
}

function updateModulesTab(scripts) {
    const modulesContent = document.getElementById('modules-content');
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 15px;">⚙️ CLASSIFICAÇÃO DE MÓDULOS</h3>
    `;
    
    const typeOrder = ['CORE', 'PERFORMANCE', 'UI', 'SUPPORT', 'UTIL', 'EXTERNAL', 'UNKNOWN'];
    const modulesByType = {};
    
    scripts.forEach(script => {
        const classification = classifyModule(script.fileName);
        modulesByType[classification.type] = modulesByType[classification.type] || [];
        modulesByType[classification.type].push({ ...script, classification });
    });
    
    typeOrder.forEach(type => {
        if (modulesByType[type] && modulesByType[type].length > 0) {
            const modules = modulesByType[type];
            const emoji = classifyModule('dummy').emoji; // Get emoji for this type
            
            html += `
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #00ff9c; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 5px;">
                        ${emoji} ${type} (${modules.length})
                    </h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px;">
            `;
            
            modules.forEach(module => {
                html += `
                    <div style="background: #111; padding: 12px; border-radius: 6px; border: 1px solid #222;">
                        <div style="font-weight: bold; color: #00ff9c; margin-bottom: 5px;">
                            ${module.classification.emoji} ${module.fileName}
                        </div>
                        <div style="font-size: 11px; color: #888; margin-bottom: 8px;">
                            ${module.src.substring(0, 50)}...
                        </div>
                        <div style="display: flex; gap: 10px; font-size: 10px;">
                            <span style="background: #333; padding: 2px 6px; border-radius: 3px;">
                                ${module.async ? 'ASYNC' : 'sync'}
                            </span>
                            <span style="background: #333; padding: 2px 6px; border-radius: 3px;">
                                ${module.defer ? 'DEFER' : 'normal'}
                            </span>
                        </div>
                    </div>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        }
    });
    
    modulesContent.innerHTML = html;
}

function updateTestsTab(testResults) {
    const testsContent = document.getElementById('tests-content');
    
    if (!testResults) {
        testsContent.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #888;">
                <div style="font-size: 48px; margin-bottom: 20px;">🧪</div>
                <div>Execute os testes para ver os resultados</div>
                <button id="run-tests-btn" style="
                    margin-top: 20px; background: #00ff9c; color: #000;
                    border: none; padding: 10px 20px; border-radius: 4px;
                    cursor: pointer; font-weight: bold;">
                    EXECUTAR TESTES
                </button>
            </div>
        `;
        
        document.getElementById('run-tests-btn')?.addEventListener('click', async () => {
            await runCompleteDiagnosis();
        });
        
        return;
    }
    
    const passed = testResults.passed;
    const failed = testResults.failed;
    const total = passed + failed;
    const percentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 15px;">🧪 RESULTADO DOS TESTES</h3>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <div style="font-size: 11px; color: #888;">STATUS GERAL</div>
                        <div style="font-size: 24px; color: ${percentage >= 80 ? '#00ff9c' : percentage >= 50 ? '#ffaa00' : '#ff5555'}">
                            ${percentage}%
                        </div>
                    </div>
                    <div style="display: flex; gap: 20px;">
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: #888;">PASSARAM</div>
                            <div style="font-size: 24px; color: #00ff9c;">${passed}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 11px; color: #888;">FALHARAM</div>
                            <div style="font-size: 24px; color: #ff5555;">${failed}</div>
                        </div>
                    </div>
                </div>
                
                <div style="height: 10px; background: #333; border-radius: 5px; overflow: hidden;">
                    <div style="height: 100%; width: ${percentage}%; background: ${percentage >= 80 ? '#00ff9c' : percentage >= 50 ? '#ffaa00' : '#ff5555'};"></div>
                </div>
            </div>
            
            <div>
                <h4 style="color: #00ff9c; margin-bottom: 10px;">📋 DETALHES DOS TESTES</h4>
                <div style="max-height: 300px; overflow-y: auto;">
    `;
    
    testResults.tests.forEach((test, index) => {
        html += `
            <div style="
                background: ${test.passed ? '#001a00' : '#1a0000'};
                padding: 12px; margin-bottom: 8px; border-radius: 4px;
                border-left: 3px solid ${test.passed ? '#00ff9c' : '#ff5555'};
                display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; color: ${test.passed ? '#00ff9c' : '#ff5555'};">
                        ${test.passed ? '✅' : '❌'} ${test.name}
                    </div>
                    ${test.message ? `<div style="font-size: 11px; color: #888; margin-top: 4px;">${test.message}</div>` : ''}
                </div>
                <span style="font-size: 10px; color: #888;">#${index + 1}</span>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
        </div>
    `;
    
    testsContent.innerHTML = html;
}

/* ================== DIAGNÓSTICO COMPLETO ================== */
async function runCompleteDiagnosis() {
    try {
        logToPanel('🚀 Iniciando diagnóstico completo...', 'debug');
        updateStatus('Diagnóstico em andamento...', 'info');
        
        // 1. Análise do sistema
        logToPanel('🔍 Analisando sistema...', 'debug');
        const systemData = analyzeSystem();
        
        // 2. Atualiza visualizações
        updateOverview(systemData);
        updateModulesTab(systemData.scripts);
        
        // 3. Executa testes
        logToPanel('🧪 Executando testes...', 'debug');
        const testResults = await testMediaUnifiedComplete();
        
        // 4. Atualiza aba de testes
        updateTestsTab(testResults);
        
        // 5. Calcula health score
        const healthScore = calculateHealthScore(systemData, testResults);
        document.getElementById('health-score').textContent = `${healthScore}%`;
        
        // 6. Atualiza status
        logToPanel(`✅ Diagnóstico completo! Health Score: ${healthScore}%`, 'success');
        updateStatus('Diagnóstico completo', 'success');
        
        return { systemData, testResults, healthScore };
        
    } catch (error) {
        logToPanel(`❌ Erro no diagnóstico: ${error.message}`, 'error');
        updateStatus('Erro no diagnóstico', 'error');
        console.error(error);
    }
}

function calculateHealthScore(systemData, testResults) {
    let score = 100;
    
    // Penalidades por sistemas ausentes
    Object.entries(systemData.systems).forEach(([system, active]) => {
        if (!active) {
            const criticalSystems = ['MediaSystem', 'properties', 'supabase'];
            if (criticalSystems.includes(system)) score -= 10;
            else score -= 5;
        }
    });
    
    // Penalidades por elementos ausentes
    Object.entries(systemData.criticalElements).forEach(([element, domElement]) => {
        if (!domElement) {
            const criticalElements = ['pdfModal', 'pdfPassword'];
            if (criticalElements.includes(element)) score -= 10;
            else score -= 5;
        }
    });
    
    // Bonus por testes passados
    if (testResults) {
        const percentage = testResults.total > 0 ? 
            (testResults.passed / (testResults.passed + testResults.failed)) * 100 : 0;
        score = Math.min(100, score + (percentage / 10));
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
}

function exportReport() {
    const systemData = analyzeSystem();
    const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        system: {
            scripts: systemData.scripts,
            systems: systemData.systems,
            criticalElements: Object.keys(systemData.criticalElements).reduce((acc, key) => {
                acc[key] = !!systemData.criticalElements[key];
                return acc;
            }, {}),
            healthScore: calculateHealthScore(systemData, null)
        },
        userAgent: navigator.userAgent,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-sistema-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    logToPanel('📊 Relatório exportado como JSON', 'success');
}

/* ================== INICIALIZAÇÃO ================== */
if (DEBUG_MODE && DIAGNOSTICS_MODE) {
    // Aguarda DOM estar pronto
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                createDiagnosticsPanel();
                // Inicia análise automática após 2 segundos
                setTimeout(() => runCompleteDiagnosis(), 2000);
            }, 1000);
        });
    } else {
        setTimeout(() => {
            createDiagnosticsPanel();
            setTimeout(() => runCompleteDiagnosis(), 2000);
        }, 1000);
    }
}

// Exporta funções globais para teste manual
window.runCompleteDiagnosis = runCompleteDiagnosis;
window.exportReport = exportReport;
window.testMediaUnifiedComplete = testMediaUnifiedComplete;

console.log('🚀 Diagnóstico completo carregado. Use window.runCompleteDiagnosis() para executar.');
