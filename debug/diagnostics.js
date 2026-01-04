// debug/diagnostics.js
console.log('🔍 diagnostics.js – diagnóstico completo corrigido');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const DEBUG_MODE = params.get('debug') === 'true';
const DIAGNOSTICS_MODE = params.get('diagnostics') === 'true';
const MOBILE_TEST = params.get('mobiletest') === 'true';

/* ================== VARIÁVEIS GLOBAIS ================== */
let diagnosticsPanel = null;
let currentTestResults = null;

/* ================== FUNÇÕES AUXILIARES ================== */
function logToPanel(message, type = 'info') {
    const colors = {
        'info': '#00ff9c',
        'success': '#00ff9c',
        'error': '#ff5555',
        'warning': '#ffaa00',
        'debug': '#8888ff',
        'mobile': '#0088cc',
        'migration': '#ff00ff'
    };
    
    const icons = {
        'info': '📝',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'debug': '🔍',
        'mobile': '📱',
        'migration': '🚀'
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
    if (consoleContent) {
        consoleContent.appendChild(logLine);
        consoleContent.scrollTop = consoleContent.scrollHeight;
    }
    
    // Também loga no console real
    const consoleFunc = type === 'error' ? console.error : 
                       type === 'warning' ? console.warn : console.log;
    consoleFunc(`[DIAG] ${message}`);
}

function updateStatus(message, type = 'info') {
    const statusBar = document.getElementById('status-bar');
    if (statusBar) {
        statusBar.innerHTML = `<strong>Status:</strong> ${message}`;
        statusBar.style.color = type === 'error' ? '#ff5555' : 
                               type === 'success' ? '#00ff9c' : 
                               type === 'mobile' ? '#0088cc' : 
                               type === 'migration' ? '#ff00ff' : '#888';
    }
}

function updateDeviceIndicator() {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Tablet|Kindle|Samsung Tablet/i.test(navigator.userAgent);
    
    let deviceType = 'DESKTOP';
    let emoji = '💻';
    
    if (isMobile) {
        deviceType = isTablet ? 'TABLET' : 'MOBILE';
        emoji = isTablet ? '📱' : '📱';
    }
    
    const indicator = document.getElementById('device-indicator');
    if (indicator) {
        indicator.innerHTML = `${emoji} ${deviceType} (${window.innerWidth}×${window.innerHeight})`;
        indicator.style.background = isMobile ? '#0088cc' : '#555';
    }
}

/* ================== VERIFICAÇÃO DE MIGRAÇÃO DE MÍDIA ================== */
window.verifyMediaMigration = function() {
    logToPanel('🔍 VERIFICAÇÃO FINAL DA MIGRAÇÃO DE MÍDIA', 'migration');
    
    const checks = {
        'MediaSystem disponível': typeof MediaSystem !== 'undefined',
        'Funções essenciais presentes': MediaSystem && 
            typeof MediaSystem.addFiles === 'function' &&
            typeof MediaSystem.addPdfs === 'function' &&
            typeof MediaSystem.uploadAll === 'function',
        'Integração admin funcionando': typeof window.processAndSavePdfs === 'function',
        'Compatibilidade properties.js': typeof window.getMediaUrlsForProperty === 'function',
        'Sistema de preview ativo': document.getElementById('uploadPreview') !== null
    };
    
    console.table(checks);
    
    // Log detalhado
    Object.entries(checks).forEach(([check, result]) => {
        logToPanel(`${result ? '✅' : '❌'} ${check}`, result ? 'success' : 'error');
    });
    
    const allValid = Object.values(checks).every(v => v === true);
    
    if (allValid) {
        logToPanel('✅ TODAS AS VERIFICAÇÕES PASSARAM - PRONTO PARA MIGRAÇÃO FINAL', 'success');
        
        // Criar relatório detalhado
        const report = {
            timestamp: new Date().toISOString(),
            checks: checks,
            status: 'VALIDADO',
            recommendations: [
                'Remover módulos antigos (media-*.js, pdf-*.js)',
                'Manter apenas MediaSystem unificado',
                'Atualizar imports em admin.js',
                'Testar uploads de mídia e PDFs',
                'Verificar compatibilidade com propriedades existentes'
            ]
        };
        
        // Exibir alerta visual
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #001a00;
            color: #00ff9c;
            padding: 30px;
            border: 3px solid #00ff9c;
            border-radius: 10px;
            z-index: 1000000;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 50px rgba(0, 255, 156, 0.5);
        `;
        alertDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px;">✅ SISTEMA VALIDADO!</div>
            <div style="margin-bottom: 20px;">Pronto para remover módulos antigos.</div>
            <div style="background: #003300; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: left;">
                <strong>Ações recomendadas:</strong>
                <ol style="margin: 10px 0 0 20px; font-size: 12px;">
                    <li>Remover módulos antigos de mídia e PDF</li>
                    <li>Manter apenas MediaSystem unificado</li>
                    <li>Testar todas as funcionalidades</li>
                    <li>Backup antes de qualquer remoção</li>
                </ol>
            </div>
            <button id="close-validation-alert" style="
                background: #00ff9c; color: #000; border: none;
                padding: 10px 20px; border-radius: 5px; cursor: pointer;
                font-weight: bold;">
                ENTENDIDO
            </button>
            <button id="export-migration-report" style="
                background: #555; color: white; border: none;
                padding: 10px 20px; border-radius: 5px; cursor: pointer;
                font-weight: bold; margin-left: 10px;">
                📊 EXPORTAR RELATÓRIO
            </button>
        `;
        document.body.appendChild(alertDiv);
        
        // Configurar eventos dos botões
        document.getElementById('close-validation-alert').addEventListener('click', () => {
            document.body.removeChild(alertDiv);
        });
        
        document.getElementById('export-migration-report').addEventListener('click', () => {
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `migration-validation-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            logToPanel('📊 Relatório de migração exportado', 'migration');
        });
        
        return { valid: true, checks, report };
    } else {
        logToPanel('❌ VERIFICAÇÕES FALHARAM - NÃO PROSSEGUIR', 'error');
        
        // Criar relatório de falhas
        const failedChecks = Object.entries(checks).filter(([_, result]) => !result).map(([check]) => check);
        
        const alertDiv = document.createElement('div');
        alertDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #1a0000;
            color: #ff5555;
            padding: 30px;
            border: 3px solid #ff5555;
            border-radius: 10px;
            z-index: 1000000;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 0 50px rgba(255, 0, 0, 0.5);
        `;
        alertDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px;">⚠️ VERIFICAÇÕES FALHARAM</div>
            <div style="margin-bottom: 20px;">Não remover módulos antigos.</div>
            <div style="background: #330000; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: left;">
                <strong>Problemas encontrados:</strong>
                <ul style="margin: 10px 0 0 20px; font-size: 12px;">
                    ${failedChecks.map(check => `<li>${check}</li>`).join('')}
                </ul>
            </div>
            <button id="close-failure-alert" style="
                background: #ff5555; color: white; border: none;
                padding: 10px 20px; border-radius: 5px; cursor: pointer;
                font-weight: bold;">
                ENTENDIDO
            </button>
        `;
        document.body.appendChild(alertDiv);
        
        document.getElementById('close-failure-alert').addEventListener('click', () => {
            document.body.removeChild(alertDiv);
        });
        
        return { 
            valid: false, 
            checks, 
            failedChecks,
            message: 'Sistema não está pronto para migração'
        };
    }
};

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
    
    // 3. Elementos críticos do DOM
    const criticalElements = {
        'pdfModal': document.getElementById('pdfModal'),
        'pdfPassword': document.getElementById('pdfPassword'),
        'mediaUpload': document.getElementById('mediaUpload'),
        'adminPanel': document.getElementById('adminPanel'),
        'uploadPreview': document.getElementById('uploadPreview')
    };
    
    return { scripts, systems, criticalElements };
}

/* ================== TESTES AUTOMÁTICOS ================== */
async function testMediaUnifiedComplete() {
    logToPanel('🧪 Iniciando teste completo do sistema unificado...', 'debug');
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0,
        tests: []
    };
    
    // Teste 1: MediaSystem disponível
    if (!window.MediaSystem) {
        results.tests.push({ name: 'MediaSystem disponível', passed: false, message: 'MediaSystem não encontrado' });
        logToPanel('❌ MediaSystem não disponível', 'error');
        results.failed++;
    } else {
        results.tests.push({ name: 'MediaSystem disponível', passed: true });
        logToPanel('✅ MediaSystem disponível', 'success');
        results.passed++;
    }
    results.total++;
    
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
            results.total++;
        });
    }
    
    // Teste 3: Funções essenciais de migração
    logToPanel('🔍 Verificando funções essenciais de migração...', 'migration');
    
    const migrationChecks = [
        { name: 'MediaSystem.addFiles', check: () => typeof MediaSystem.addFiles === 'function' },
        { name: 'MediaSystem.addPdfs', check: () => typeof MediaSystem.addPdfs === 'function' },
        { name: 'MediaSystem.uploadAll', check: () => typeof MediaSystem.uploadAll === 'function' },
        { name: 'window.processAndSavePdfs', check: () => typeof window.processAndSavePdfs === 'function' },
        { name: 'window.getMediaUrlsForProperty', check: () => typeof window.getMediaUrlsForProperty === 'function' }
    ];
    
    migrationChecks.forEach(check => {
        const passed = check.check();
        results.tests.push({ 
            name: check.name, 
            passed,
            message: passed ? 'Função disponível para migração' : 'Função necessária para migração'
        });
        
        logToPanel(`${passed ? '✅' : '❌'} ${check.name}`, passed ? 'success' : 'error');
        if (passed) results.passed++;
        else results.failed++;
        results.total++;
    });
    
    // Teste 4: Modal de PDF
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
    results.total++;
    
    if (passwordExists) results.passed++;
    else results.failed++;
    results.total++;
    
    // Teste 5: Sistema de preview de upload
    const uploadPreview = document.getElementById('uploadPreview');
    results.tests.push({
        name: 'Sistema de preview ativo',
        passed: !!uploadPreview,
        message: uploadPreview ? 'Preview disponível para migração' : 'Preview necessário para migração'
    });
    logToPanel(`Upload Preview: ${uploadPreview ? '✅ Existe' : '❌ Não existe'}`, uploadPreview ? 'success' : 'error');
    if (uploadPreview) results.passed++;
    else results.failed++;
    results.total++;
    
    // Teste 6: Sistema de propriedades
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
    results.total++;
    
    // Teste 7: Supabase
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
        // Não conta como falha porque pode ser fallback
    }
    results.total++;
    
    currentTestResults = results;
    return results;
}

/* ================== DIAGNÓSTICO MOBILE PDF ================== */
window.diagnosePdfModalMobile = function() {
    const results = {
        deviceInfo: {},
        modalAnalysis: {},
        cssAnalysis: {},
        layoutIssues: [],
        recommendations: []
    };
    
    console.group('🔍 DIAGNÓSTICO DO MODAL PDF EM MOBILE');
    
    // 1. Detectar dispositivo
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isTablet = /iPad|Tablet|Kindle|Samsung Tablet/i.test(navigator.userAgent);
    
    results.deviceInfo = {
        type: isMobile ? (isTablet ? 'TABLET' : 'MOBILE') : 'DESKTOP',
        userAgent: navigator.userAgent.substring(0, 80) + '...',
        viewport: { 
            width: window.innerWidth, 
            height: window.innerHeight,
            pixelRatio: window.devicePixelRatio
        },
        touchSupport: 'ontouchstart' in window
    };
    
    console.log('📱 Dispositivo:', results.deviceInfo.type);
    console.log('📏 Viewport:', window.innerWidth, 'x', window.innerHeight);
    console.log('👆 Touch:', results.deviceInfo.touchSupport);
    
    // 2. Verificar existência do modal
    const pdfModal = document.getElementById('pdfModal');
    results.modalAnalysis.exists = !!pdfModal;
    
    console.log('✅ Modal PDF existe?', results.modalAnalysis.exists);
    
    if (pdfModal) {
        // 3. Analisar estilo atual
        const computedStyle = window.getComputedStyle(pdfModal);
        results.modalAnalysis.style = {
            display: computedStyle.display,
            position: computedStyle.position,
            width: computedStyle.width,
            height: computedStyle.height,
            maxWidth: computedStyle.maxWidth,
            maxHeight: computedStyle.maxHeight,
            padding: computedStyle.padding,
            margin: computedStyle.margin,
            zIndex: computedStyle.zIndex,
            overflow: computedStyle.overflow
        };
        
        console.log('🎨 Estilo do modal:');
        Object.entries(results.modalAnalysis.style).forEach(([key, value]) => {
            console.log(`- ${key}:`, value);
        });
        
        // 4. Analisar conteúdo interno
        const modalContent = pdfModal.querySelector('.pdf-modal-content');
        results.modalAnalysis.content = {
            hasContentDiv: !!modalContent,
            contentStyle: {}
        };
        
        if (modalContent) {
            const contentStyle = window.getComputedStyle(modalContent);
            results.modalAnalysis.content.contentStyle = {
                width: contentStyle.width,
                maxWidth: contentStyle.maxWidth,
                padding: contentStyle.padding,
                margin: contentStyle.margin,
                backgroundColor: contentStyle.backgroundColor,
                borderRadius: contentStyle.borderRadius
            };
            
            console.log('📦 Estilo do conteúdo:');
            Object.entries(results.modalAnalysis.content.contentStyle).forEach(([key, value]) => {
                console.log(`- ${key}:`, value);
            });
        }
        
        // 5. Verificar elementos específicos do problema
        const passwordInput = document.getElementById('pdfPassword');
        results.modalAnalysis.passwordField = {
            exists: !!passwordInput,
            style: {}
        };
        
        console.log('🔐 Campo de senha:', passwordInput ? 'EXISTE' : 'NÃO EXISTE');
        if (passwordInput) {
            const passwordStyle = window.getComputedStyle(passwordInput);
            results.modalAnalysis.passwordField.style = {
                display: passwordStyle.display,
                width: passwordStyle.width,
                visibility: passwordStyle.visibility,
                opacity: passwordStyle.opacity,
                position: passwordStyle.position
            };
            
            Object.entries(results.modalAnalysis.passwordField.style).forEach(([key, value]) => {
                console.log(`- ${key}:`, value);
            });
        }
        
        // 6. Verificar visibilidade
        results.modalAnalysis.visible = pdfModal.style.display === 'flex' || 
                                      pdfModal.style.display === 'block' ||
                                      getComputedStyle(pdfModal).display !== 'none';
        
        console.log('👁️ Modal visível?', results.modalAnalysis.visible);
        
        // 7. Verificar se há problemas de layout
        if (results.modalAnalysis.visible) {
            const rect = pdfModal.getBoundingClientRect();
            results.modalAnalysis.boundingBox = {
                top: rect.top,
                right: rect.right,
                bottom: rect.bottom,
                left: rect.left,
                width: rect.width,
                height: rect.height
            };
            
            console.log('📐 Bounding Box:', rect);
            
            // Verificar problemas comuns em mobile
            if (rect.width > window.innerWidth) {
                results.layoutIssues.push('Modal mais largo que a viewport');
            }
            if (rect.height > window.innerHeight) {
                results.layoutIssues.push('Modal mais alto que a viewport');
            }
            if (rect.left < 0 || rect.right > window.innerWidth) {
                results.layoutIssues.push('Modal fora da viewport horizontalmente');
            }
            if (rect.top < 0 || rect.bottom > window.innerHeight) {
                results.layoutIssues.push('Modal fora da viewport verticalmente');
            }
        }
    }
    
    // 8. Verificar CSS carregado
    const allStyles = Array.from(document.styleSheets);
    results.cssAnalysis = {
        totalSheets: allStyles.length,
        sheets: allStyles.map(ss => ({
            href: ss.href || 'inline',
            disabled: ss.disabled,
            rulesCount: 0 // Não acessível devido a restrições de CORS
        })).slice(0, 10),
        galleryCss: !!allStyles.find(ss => ss.href && ss.href.includes('gallery.css')),
        adminCss: !!allStyles.find(ss => ss.href && ss.href.includes('admin.css')),
        pdfCss: !!allStyles.find(ss => ss.href && ss.href.includes('pdf') && ss.href.includes('.css'))
    };
    
    console.log('🎨 CSS Carregado:');
    console.log('- Total sheets:', results.cssAnalysis.totalSheets);
    console.log('- gallery.css:', results.cssAnalysis.galleryCss);
    console.log('- admin.css:', results.cssAnalysis.adminCss);
    console.log('- pdf*.css:', results.cssAnalysis.pdfCss);
    
    // 9. Gerar recomendações
    if (isMobile || isTablet) {
        if (!results.modalAnalysis.exists) {
            results.recommendations.push('Criar modal PDF específico para mobile');
        } else {
            // Verificar se o modal é mobile-friendly
            const modalWidth = parseInt(results.modalAnalysis.style.width) || 0;
            const viewportWidth = window.innerWidth;
            
            if (modalWidth > viewportWidth * 0.95) {
                results.recommendations.push('Reduzir largura do modal para 95% da viewport');
            }
            
            if (!results.modalAnalysis.style.maxWidth || results.modalAnalysis.style.maxWidth === 'none') {
                results.recommendations.push('Definir max-width no modal (ex: 95vw)');
            }
            
            if (results.modalAnalysis.passwordField.exists && 
                results.modalAnalysis.passwordField.style.width === '100%') {
                results.recommendations.push('Reduzir largura do campo de senha para 90% em mobile');
            }
            
            if (!results.modalAnalysis.content.hasContentDiv) {
                results.recommendations.push('Adicionar div .pdf-modal-content para melhor controle de layout');
            }
        }
        
        results.recommendations.push('Adicionar @media queries específicas para mobile');
        results.recommendations.push('Considerar modal full-screen em dispositivos muito pequenos');
    }
    
    console.groupEnd();
    
    return results;
};

/* ================== RELATÓRIOS ================== */
function updateOverview(data) {
    const overviewContent = document.getElementById('overview-content');
    if (!overviewContent) return;
    
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
            <div style="text-align: center; margin: 20px 0;">
                <button id="verify-migration-btn" style="
                    background: linear-gradient(45deg, #ff00ff, #0088cc); 
                    color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px;">
                    🚀 VERIFICAR MIGRAÇÃO DE MÍDIA
                </button>
                <div style="font-size: 11px; color: #888; margin-top: 5px;">
                    Valida se o sistema está pronto para remover módulos antigos
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
    
    // Configurar botão de verificação de migração
    document.getElementById('verify-migration-btn')?.addEventListener('click', () => {
        window.verifyMediaMigration();
    });
}

function updateTestsTab(testResults) {
    const testsContent = document.getElementById('tests-content');
    if (!testsContent) return;
    
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
    const total = testResults.total;
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
        
        <div style="text-align: center; margin-top: 20px;">
            <button id="run-migration-test" style="
                background: linear-gradient(45deg, #ff00ff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold;">
                🚀 TESTAR PRONTIDÃO PARA MIGRAÇÃO
            </button>
        </div>
    `;
    
    testsContent.innerHTML = html;
    
    // Configurar botão de teste de migração
    document.getElementById('run-migration-test')?.addEventListener('click', () => {
        window.verifyMediaMigration();
    });
}

function updatePdfMobileTab(results) {
    const pdfMobileContent = document.getElementById('pdf-mobile-content');
    if (!pdfMobileContent) return;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 15px;">📱 DIAGNÓSTICO MOBILE PDF</h3>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: #00ff9c; margin-bottom: 10px;">📱 INFORMAÇÕES DO DISPOSITIVO</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px;">
                    <div>
                        <div style="color: #888; font-size: 11px;">TIPO</div>
                        <div style="font-size: 18px; color: ${results.deviceInfo.type === 'DESKTOP' ? '#00ff9c' : '#0088cc'}">
                            ${results.deviceInfo.type === 'DESKTOP' ? '💻' : '📱'} ${results.deviceInfo.type}
                        </div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 11px;">VIEWPORT</div>
                        <div style="font-size: 18px; color: #00ff9c;">
                            ${results.deviceInfo.viewport.width} × ${results.deviceInfo.viewport.height}
                        </div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 11px;">TOUCH</div>
                        <div style="font-size: 18px; color: ${results.deviceInfo.touchSupport ? '#00ff9c' : '#ff5555'}">
                            ${results.deviceInfo.touchSupport ? '✅ SUPORTADO' : '❌ NÃO SUPORTADO'}
                        </div>
                    </div>
                    <div>
                        <div style="color: #888; font-size: 11px;">PIXEL RATIO</div>
                        <div style="font-size: 18px; color: #00ff9c;">
                            ${results.deviceInfo.viewport.pixelRatio}
                        </div>
                    </div>
                </div>
            </div>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: #00ff9c; margin-bottom: 10px;">🎯 ANÁLISE DO MODAL PDF</h4>
    `;
    
    // Seção do modal
    if (results.modalAnalysis.exists) {
        html += `
            <div style="margin-bottom: 15px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span>Status do Modal</span>
                    <span style="color: #00ff9c; background: #003300; padding: 4px 8px; border-radius: 3px;">
                        ✅ PRESENTE
                    </span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="color: #888; font-size: 11px; margin-bottom: 5px;">VISIBILIDADE</div>
                    <div style="color: ${results.modalAnalysis.visible ? '#00ff9c' : '#ffaa00'};">
                        ${results.modalAnalysis.visible ? '👁️ VISÍVEL' : '👁️‍🗨️ OCULTO'}
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="color: #888; font-size: 11px; margin-bottom: 5px;">CAMPO DE SENHA</div>
                    <div style="color: ${results.modalAnalysis.passwordField.exists ? '#00ff9c' : '#ff5555'};">
                        ${results.modalAnalysis.passwordField.exists ? '✅ PRESENTE' : '❌ AUSENTE'}
                    </div>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <h5 style="color: #888; margin-bottom: 5px;">📐 ESTILO DO MODAL</h5>
                    <div style="background: #0a0a0a; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 11px;">
        `;
        
        Object.entries(results.modalAnalysis.style || {}).forEach(([key, value]) => {
            html += `<div style="margin-bottom: 2px;">${key}: <span style="color: #00ff9c;">${value}</span></div>`;
        });
        
        html += `
                    </div>
                </div>
        `;
        
        // Bounding box se disponível
        if (results.modalAnalysis.boundingBox) {
            html += `
                <div style="margin-bottom: 15px;">
                    <h5 style="color: #888; margin-bottom: 5px;">📏 BOUNDING BOX</h5>
                    <div style="background: #0a0a0a; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 11px;">
                        <div style="margin-bottom: 2px;">width: <span style="color: #00ff9c;">${results.modalAnalysis.boundingBox.width}px</span></div>
                        <div style="margin-bottom: 2px;">height: <span style="color: #00ff9c;">${results.modalAnalysis.boundingBox.height}px</span></div>
                        <div style="margin-bottom: 2px;">top: <span style="color: #00ff9c;">${results.modalAnalysis.boundingBox.top}px</span></div>
                        <div style="margin-bottom: 2px;">left: <span style="color: #00ff9c;">${results.modalAnalysis.boundingBox.left}px</span></div>
                    </div>
                </div>
            `;
        }
        
    } else {
        html += `
            <div style="text-align: center; padding: 30px; color: #ff5555;">
                <div style="font-size: 48px; margin-bottom: 10px;">❌</div>
                <div style="font-size: 16px;">MODAL PDF NÃO ENCONTRADO</div>
                <div style="font-size: 12px; color: #888; margin-top: 10px;">
                    O elemento #pdfModal não existe no DOM
                </div>
            </div>
        `;
    }
    
    html += `
            </div>
    `;
    
    // Seção de problemas e recomendações
    if (results.layoutIssues.length > 0 || results.recommendations.length > 0) {
        html += `
            <div style="background: ${results.layoutIssues.length > 0 ? '#1a0000' : '#001a00'}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        `;
        
        if (results.layoutIssues.length > 0) {
            html += `
                <h4 style="color: #ff5555; margin-bottom: 10px;">⚠️ PROBLEMAS DETECTADOS</h4>
                <div style="margin-left: 15px;">
            `;
            
            results.layoutIssues.forEach(issue => {
                html += `
                    <div style="margin-bottom: 8px; padding: 8px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border-left: 3px solid #ff5555;">
                        <span style="color: #ff5555;">•</span> ${issue}
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        if (results.recommendations.length > 0) {
            html += `
                <h4 style="color: #00ff9c; margin-top: ${results.layoutIssues.length > 0 ? '20px' : '0'}; margin-bottom: 10px;">💡 RECOMENDAÇÕES</h4>
                <div style="margin-left: 15px;">
            `;
            
            results.recommendations.forEach(rec => {
                html += `
                    <div style="margin-bottom: 8px; padding: 8px; background: rgba(0, 255, 156, 0.1); border-radius: 4px; border-left: 3px solid #00ff9c;">
                        <span style="color: #00ff9c;">•</span> ${rec}
                    </div>
                `;
            });
            
            html += `</div>`;
        }
        
        html += `</div>`;
    }
    
    // Botão de ação
    html += `
        <div style="text-align: center;">
            <button id="fix-mobile-pdf" style="
                background: #0088cc; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 4px;
                font-weight: bold; font-size: 14px;">
                🛠️ APLICAR CORREÇÕES SUGERIDAS
            </button>
            <div style="font-size: 11px; color: #888; margin-top: 10px;">
                Cria estilos otimizados para mobile
            </div>
        </div>
    `;
    
    pdfMobileContent.innerHTML = html;
    
    // Configurar botão de correções
    document.getElementById('fix-mobile-pdf')?.addEventListener('click', () => {
        applyMobilePdfFixes(results);
    });
}

function applyMobilePdfFixes(results) {
    logToPanel('🛠️ Aplicando correções para mobile PDF...', 'mobile');
    
    // Criar estilo otimizado para mobile
    const styleId = 'diagnostics-mobile-pdf-fixes';
    let styleTag = document.getElementById(styleId);
    
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    
    const css = `
        /* Correções mobile PDF - Gerado por diagnostics.js */
        
        @media (max-width: 768px) {
            #pdfModal {
                max-width: 95vw !important;
                max-height: 90vh !important;
                padding: 10px !important;
            }
            
            .pdf-modal-content {
                max-width: 100% !important;
                padding: 15px !important;
                margin: 0 !important;
            }
            
            #pdfPassword {
                width: 90% !important;
                max-width: 300px !important;
                font-size: 16px !important; /* Evita zoom em iOS */
            }
            
            /* Tornar mais touch-friendly */
            .pdf-modal-buttons button {
                padding: 12px 20px !important;
                min-height: 44px !important; /* Tamanho mínimo para toque */
                margin: 5px !important;
            }
        }
        
        @media (max-width: 480px) {
            #pdfModal {
                border-radius: 0 !important;
                max-height: 100vh !important;
                max-width: 100vw !important;
            }
            
            .pdf-modal-content {
                padding: 10px !important;
            }
        }
    `;
    
    styleTag.textContent = css;
    
    logToPanel('✅ Estilos mobile PDF aplicados', 'success');
    logToPanel('💡 Recarregue a página para ver as mudanças', 'info');
    
    // Forçar recálculo
    const pdfModal = document.getElementById('pdfModal');
    if (pdfModal) {
        pdfModal.style.display = 'none';
        setTimeout(() => {
            pdfModal.style.display = 'flex';
            logToPanel('🔄 Modal recarregado com estilos mobile', 'mobile');
        }, 100);
    }
}

/* ================== FUNÇÕES PRINCIPAIS ================== */
async function runCompleteDiagnosis() {
    try {
        logToPanel('🚀 Iniciando diagnóstico completo...', 'debug');
        updateStatus('Diagnóstico em andamento...', 'info');
        
        // 1. Análise do sistema
        logToPanel('🔍 Analisando sistema...', 'debug');
        const systemData = analyzeSystem();
        
        // 2. Atualiza visualizações
        updateOverview(systemData);
        
        // 3. Executa testes
        logToPanel('🧪 Executando testes...', 'debug');
        const testResults = await testMediaUnifiedComplete();
        
        // 4. Atualiza aba de testes
        updateTestsTab(testResults);
        
        // 5. Calcula health score
        const healthScore = calculateHealthScore(systemData, testResults);
        const healthScoreElement = document.getElementById('health-score');
        if (healthScoreElement) {
            healthScoreElement.textContent = `${healthScore}%`;
        }
        
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
            const criticalElements = ['pdfModal', 'pdfPassword', 'uploadPreview'];
            if (criticalElements.includes(element)) score -= 10;
            else score -= 5;
        }
    });
    
    // Bonus por testes passados
    if (testResults && testResults.total > 0) {
        const percentage = (testResults.passed / testResults.total) * 100;
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
            healthScore: calculateHealthScore(systemData, currentTestResults)
        },
        userAgent: navigator.userAgent,
        screen: {
            width: window.screen.width,
            height: window.screen.height,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight
        },
        testResults: currentTestResults,
        migrationStatus: window.verifyMediaMigration ? 'Função disponível' : 'Função não disponível'
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

function runPdfMobileDiagnosis() {
    logToPanel('📱 Iniciando diagnóstico mobile PDF...', 'mobile');
    updateStatus('Analisando layout mobile PDF...', 'mobile');
    
    try {
        const results = window.diagnosePdfModalMobile();
        
        // Atualizar aba de diagnóstico mobile
        updatePdfMobileTab(results);
        
        // Logar resultados
        logToPanel(`📱 Dispositivo: ${results.deviceInfo.type}`, 'mobile');
        logToPanel(`📏 Viewport: ${results.deviceInfo.viewport.width}×${results.deviceInfo.viewport.height}`, 'mobile');
        logToPanel(`✅ Modal PDF: ${results.modalAnalysis.exists ? 'PRESENTE' : 'AUSENTE'}`, 
                   results.modalAnalysis.exists ? 'success' : 'error');
        
        if (results.modalAnalysis.exists) {
            logToPanel(`👁️ Modal visível: ${results.modalAnalysis.visible ? 'SIM' : 'NÃO'}`, 
                       results.modalAnalysis.visible ? 'success' : 'warning');
            logToPanel(`🔐 Campo senha: ${results.modalAnalysis.passwordField.exists ? 'PRESENTE' : 'AUSENTE'}`,
                       results.modalAnalysis.passwordField.exists ? 'success' : 'warning');
            
            if (results.layoutIssues.length > 0) {
                logToPanel('⚠️ Problemas de layout detectados:', 'warning');
                results.layoutIssues.forEach(issue => {
                    logToPanel(`   • ${issue}`, 'warning');
                });
            }
            
            if (results.recommendations.length > 0) {
                logToPanel('💡 Recomendações:', 'info');
                results.recommendations.forEach(rec => {
                    logToPanel(`   • ${rec}`, 'info');
                });
            }
        }
        
        logToPanel('✅ Diagnóstico mobile PDF concluído', 'success');
        updateStatus('Diagnóstico mobile completo', 'success');
        
        // Mudar para aba mobile
        const mobileTabBtn = document.querySelector('[data-tab="pdf-mobile"]');
        if (mobileTabBtn) {
            mobileTabBtn.click();
        }
        
    } catch (error) {
        logToPanel(`❌ Erro no diagnóstico mobile: ${error.message}`, 'error');
        updateStatus('Erro no diagnóstico mobile', 'error');
    }
}

/* ================== PAINEL VISUAL ================== */
function createDiagnosticsPanel() {
    diagnosticsPanel = document.createElement('div');
    diagnosticsPanel.id = 'diagnostics-panel-complete';
    diagnosticsPanel.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        width: 900px;
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
                <button id="verify-migration-main" style="
                    background: linear-gradient(45deg, #ff00ff, #0088cc); 
                    color: white; border: none; 
                    padding: 4px 8px; cursor: pointer; border-radius: 3px;
                    font-size: 10px; font-weight: bold;">
                    🚀 MIGRAÇÃO
                </button>
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
        <div style="color: #888; font-size: 11px; margin-bottom: 20px; display: flex; justify-content: space-between;">
            <div>
                Modo: ${DEBUG_MODE ? 'DEBUG' : 'NORMAL'} | 
                ${DIAGNOSTICS_MODE ? 'DIAGNÓSTICO ATIVO' : 'DIAGNÓSTICO INATIVO'}
            </div>
            <div id="device-indicator" style="background: #333; padding: 2px 8px; border-radius: 3px;">
                📱 Detectando dispositivo...
            </div>
        </div>
        <div style="display: flex; gap: 10px; margin-bottom: 15px; flex-wrap: wrap;">
            <button id="run-all-tests" style="
                background: #00ff9c; color: #000; border: none;
                padding: 8px 12px; cursor: pointer; border-radius: 4px;
                font-weight: bold; flex: 1;">
                🧪 TESTE COMPLETO
            </button>
            <button id="test-pdf-mobile" style="
                background: #0088cc; color: white; border: none;
                padding: 8px 12px; cursor: pointer; border-radius: 4px;
                font-weight: bold; flex: 1;">
                📱 TESTE MOBILE PDF
            </button>
            <button id="export-btn" style="
                background: #555; color: white; border: none;
                padding: 8px 12px; cursor: pointer; border-radius: 4px;
                font-weight: bold; flex: 1;">
                📊 EXPORTAR
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
            <button data-tab="pdf-mobile" class="tab-btn" style="
                background: transparent; color: #888; border: none;
                padding: 8px 16px; cursor: pointer;">
                📱 PDF MOBILE
            </button>
            <button data-tab="console" class="tab-btn" style="
                background: transparent; color: #888; border: none;
                padding: 8px 16px; cursor: pointer;">
                📝 CONSOLE
            </button>
        </div>
        <div id="content-area" style="min-height: 400px; max-height: 60vh; overflow-y: auto;">
            <div id="overview-content" class="tab-content" style="display: block;"></div>
            <div id="modules-content" class="tab-content" style="display: none;"></div>
            <div id="tests-content" class="tab-content" style="display: none;"></div>
            <div id="pdf-mobile-content" class="tab-content" style="display: none;"></div>
            <div id="console-content" class="tab-content" style="display: none;"></div>
        </div>
        <div id="status-bar" style="
            margin-top: 15px; padding: 8px; background: #111; 
            border-radius: 4px; font-size: 11px; color: #888;">
            Status: Inicializando...
        </div>
    `;
    
    document.body.appendChild(diagnosticsPanel);
    
    // Configurar eventos
    setupPanelEvents();
    
    // Atualizar indicador de dispositivo
    updateDeviceIndicator();
}

function setupPanelEvents() {
    // Botões de controle
    const closeBtn = document.getElementById('close-btn');
    const minimizeBtn = document.getElementById('minimize-btn');
    const verifyMigrationBtn = document.getElementById('verify-migration-main');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            diagnosticsPanel.style.display = 'none';
        });
    }
    
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            const content = document.getElementById('content-area');
            if (content) {
                content.style.display = content.style.display === 'none' ? 'block' : 'none';
            }
        });
    }
    
    if (verifyMigrationBtn) {
        verifyMigrationBtn.addEventListener('click', () => {
            window.verifyMediaMigration();
        });
    }
    
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
            const targetContent = document.getElementById(`${btn.dataset.tab}-content`);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
    
    // Botão executar todos testes
    const runAllTestsBtn = document.getElementById('run-all-tests');
    if (runAllTestsBtn) {
        runAllTestsBtn.addEventListener('click', async () => {
            await runCompleteDiagnosis();
        });
    }
    
    // Botão teste mobile PDF
    const testPdfMobileBtn = document.getElementById('test-pdf-mobile');
    if (testPdfMobileBtn) {
        testPdfMobileBtn.addEventListener('click', () => {
            runPdfMobileDiagnosis();
        });
    }
    
    // Botão exportar
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
    }
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
                
                // Se flag mobile test ativa, executa diagnóstico mobile
                if (MOBILE_TEST) {
                    setTimeout(() => runPdfMobileDiagnosis(), 3000);
                }
            }, 1000);
        });
    } else {
        setTimeout(() => {
            createDiagnosticsPanel();
            setTimeout(() => runCompleteDiagnosis(), 2000);
            
            if (MOBILE_TEST) {
                setTimeout(() => runPdfMobileDiagnosis(), 3000);
            }
        }, 1000);
    }
}

// Exportar função globalmente para acesso direto via console
window.runDiagnostics = runCompleteDiagnosis;
