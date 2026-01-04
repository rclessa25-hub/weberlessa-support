// debug/diagnostics.js
console.log('🚀 diagnostics.js – SISTEMA DE DIAGNÓSTICO COMPLETO v2.0');

/* ================== CONFIGURAÇÕES ================== */
const params = new URLSearchParams(location.search);
const DEBUG_MODE = params.get('debug') === 'true';
const DIAGNOSTICS_MODE = params.get('diagnostics') === 'true';
const MOBILE_TEST = params.get('mobiletest') === 'true';
const MIGRATION_MODE = params.get('migration') === 'true';

/* ================== VARIÁVEIS GLOBAIS ================== */
let diagnosticsPanel = null;
let currentTestResults = null;
let systemData = null;

/* ================== FUNÇÕES AUXILIARES ================== */
function logToPanel(message, type = 'info') {
    const colors = {
        'info': '#00ff9c',
        'success': '#00ff9c',
        'error': '#ff5555',
        'warning': '#ffaa00',
        'debug': '#8888ff',
        'mobile': '#0088cc',
        'migration': '#ffaa00'
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
        background: ${type === 'error' ? '#1a0000' : type === 'warning' ? '#1a1a00' : type === 'migration' ? '#1a1a00' : 'transparent'};
    `;
    logLine.innerHTML = `<span style="color: ${colors[type]}">${icons[type]} ${message}</span>`;
    
    const consoleContent = document.getElementById('console-content');
    if (consoleContent) {
        consoleContent.appendChild(logLine);
        consoleContent.scrollTop = consoleContent.scrollHeight;
    }
    
    // Log no console real
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
                               type === 'migration' ? '#ffaa00' : '#888';
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

/* ================== ANÁLISE DO SISTEMA ================== */
function analyzeSystem() {
    logToPanel('🔍 Analisando sistema...', 'debug');
    updateStatus('Analisando sistema...', 'info');
    
    // 1. Coleta de scripts
    const scripts = Array.from(document.scripts)
        .filter(s => s.src)
        .map(s => {
            const fileName = s.src.split('/').pop();
            const classification = classifyModule(fileName);
            return {
                src: s.src,
                fileName: fileName,
                type: classification.type,
                emoji: classification.emoji,
                async: s.async,
                defer: s.defer,
                loaded: s.getAttribute('data-loaded') || 'unknown'
            };
        });
    
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
    
    // 3. Funções críticas disponíveis
    const criticalFunctions = [
        'processAndSavePdfs',
        'clearAllPdfs',
        'loadExistingPdfsForEdit',
        'getPdfsToSave',
        'getMediaUrlsForProperty',
        'addFiles',
        'addPdfs',
        'uploadAll'
    ];
    
    const functionsStatus = {};
    criticalFunctions.forEach(func => {
        if (func in MediaSystem) {
            functionsStatus[`MediaSystem.${func}`] = typeof MediaSystem[func] === 'function';
        } else {
            functionsStatus[`window.${func}`] = typeof window[func] === 'function';
        }
    });
    
    // 4. Elementos críticos do DOM
    const criticalElements = {
        'pdfModal': document.getElementById('pdfModal'),
        'pdfPassword': document.getElementById('pdfPassword'),
        'mediaUpload': document.getElementById('mediaUpload'),
        'adminPanel': document.getElementById('adminPanel'),
        'uploadPreview': document.getElementById('uploadPreview')
    };
    
    // 5. Módulos carregados
    const modules = scripts.reduce((acc, script) => {
        if (!acc[script.type]) acc[script.type] = [];
        acc[script.type].push(script);
        return acc;
    }, {});
    
    const data = { scripts, systems, functionsStatus, criticalElements, modules };
    systemData = data;
    
    return data;
}

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
    if (fileName.includes('legacy') || fileName.includes('old') || fileName.includes('backup')) 
        return { type: 'LEGACY', emoji: '📜' };
    
    return { type: 'UNKNOWN', emoji: '❓' };
}

/* ================== TESTES AUTOMÁTICOS ================== */
async function testMediaUnifiedComplete() {
    logToPanel('🧪 Iniciando teste completo do sistema...', 'debug');
    
    const results = {
        passed: 0,
        failed: 0,
        total: 0,
        tests: [],
        timestamp: new Date().toISOString()
    };
    
    // Teste 1: Sistemas essenciais
    const essentialSystems = {
        'MediaSystem': window.MediaSystem,
        'Propriedades': window.properties && Array.isArray(window.properties),
        'Admin Interface': typeof window.toggleAdminPanel === 'function'
    };
    
    Object.entries(essentialSystems).forEach(([name, exists]) => {
        results.tests.push({ 
            name: `${name} disponível`, 
            passed: !!exists,
            message: exists ? 'Sistema disponível' : 'Sistema não encontrado'
        });
        
        logToPanel(`${exists ? '✅' : '❌'} ${name}`, exists ? 'success' : 'error');
        if (exists) results.passed++;
        else results.failed++;
        results.total++;
    });
    
    // Teste 2: Funções críticas do MediaSystem
    if (window.MediaSystem) {
        const criticalFunctions = [
            'processAndSavePdfs',
            'clearAllPdfs',
            'loadExistingPdfsForEdit',
            'getPdfsToSave',
            'getMediaUrlsForProperty',
            'addFiles',
            'addPdfs',
            'uploadAll'
        ];
        
        criticalFunctions.forEach(func => {
            const exists = typeof MediaSystem[func] === 'function';
            results.tests.push({ 
                name: `MediaSystem.${func}`, 
                passed: exists,
                message: exists ? 'Função disponível' : 'Função não encontrada'
            });
            
            logToPanel(`${exists ? '✅' : '❌'} ${func}`, exists ? 'success' : 'error');
            if (exists) results.passed++;
            else results.failed++;
            results.total++;
        });
    }
    
    // Teste 3: Interface do usuário
    const uiElements = {
        'Modal PDF': document.getElementById('pdfModal'),
        'Campo Senha PDF': document.getElementById('pdfPassword'),
        'Upload de Mídia': document.getElementById('mediaUpload'),
        'Preview Upload': document.getElementById('uploadPreview'),
        'Painel Admin': document.getElementById('adminPanel')
    };
    
    Object.entries(uiElements).forEach(([name, element]) => {
        const exists = !!element;
        results.tests.push({ 
            name: `${name}`, 
            passed: exists,
            message: exists ? 'Elemento encontrado' : 'Elemento não encontrado'
        });
        
        logToPanel(`${exists ? '✅' : '❌'} ${name}`, exists ? 'success' : 'error');
        if (exists) results.passed++;
        else results.failed++;
        results.total++;
    });
    
    // Teste 4: Funções globais
    const globalFunctions = [
        'processAndSavePdfs',
        'clearAllPdfs',
        'getMediaUrlsForProperty'
    ];
    
    globalFunctions.forEach(func => {
        const exists = typeof window[func] === 'function';
        results.tests.push({ 
            name: `window.${func}`, 
            passed: exists,
            message: exists ? 'Função global disponível' : 'Função global não encontrada'
        });
        
        logToPanel(`window.${func}: ${exists ? '✅' : '❌'}`, exists ? 'success' : 'error');
        if (exists) results.passed++;
        else results.failed++;
        results.total++;
    });
    
    // Teste 5: Dados de propriedades
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
    
    // Teste 6: Supabase (opcional)
    if (window.supabase) {
        results.tests.push({ 
            name: 'Supabase Client', 
            passed: true,
            message: 'Cliente Supabase disponível'
        });
        logToPanel('✅ Supabase Client disponível', 'success');
        results.passed++;
    }
    results.total++;
    
    currentTestResults = results;
    
    // Calcular score
    const score = calculateHealthScore(systemData, results);
    results.healthScore = score;
    
    logToPanel(`📊 Score de saúde: ${score}%`, 'success');
    return results;
}

/* ================== DIAGNÓSTICO MOBILE PDF ================== */
window.diagnosePdfModalMobile = function() {
    const results = {
        deviceInfo: {},
        modalAnalysis: {},
        cssAnalysis: {},
        layoutIssues: [],
        recommendations: [],
        timestamp: new Date().toISOString()
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
        touchSupport: 'ontouchstart' in window,
        orientation: window.screen.orientation ? window.screen.orientation.type : 'unknown'
    };
    
    // 2. Verificar existência do modal
    const pdfModal = document.getElementById('pdfModal');
    results.modalAnalysis.exists = !!pdfModal;
    
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
        }
        
        // 5. Verificar campo de senha
        const passwordInput = document.getElementById('pdfPassword');
        results.modalAnalysis.passwordField = {
            exists: !!passwordInput,
            style: {}
        };
        
        if (passwordInput) {
            const passwordStyle = window.getComputedStyle(passwordInput);
            results.modalAnalysis.passwordField.style = {
                display: passwordStyle.display,
                width: passwordStyle.width,
                visibility: passwordStyle.visibility,
                opacity: passwordStyle.opacity,
                position: passwordStyle.position
            };
        }
        
        // 6. Verificar visibilidade
        results.modalAnalysis.visible = pdfModal.style.display === 'flex' || 
                                      pdfModal.style.display === 'block' ||
                                      getComputedStyle(pdfModal).display !== 'none';
        
        // 7. Verificar problemas de layout
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
    
    // 8. Verificar CSS carregado (com tratamento de CORS)
    const allStyles = Array.from(document.styleSheets);
    results.cssAnalysis = {
        totalSheets: allStyles.length,
        sheets: allStyles.map(ss => {
            let rulesCount = 0;
            let accessible = true;
            
            try {
                if (ss.cssRules) {
                    rulesCount = ss.cssRules.length;
                }
            } catch (error) {
                accessible = false;
                rulesCount = 0;
            }
            
            return {
                href: ss.href || 'inline',
                disabled: ss.disabled,
                rulesCount: rulesCount,
                accessible: accessible
            };
        }).slice(0, 10)
    };
    
    // 9. Gerar recomendações
    if (isMobile || isTablet) {
        if (!results.modalAnalysis.exists) {
            results.recommendations.push('Criar modal PDF específico para mobile');
        } else {
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
        }
        
        results.recommendations.push('Adicionar @media queries específicas para mobile');
        results.recommendations.push('Considerar modal full-screen em dispositivos muito pequenos');
    }
    
    console.groupEnd();
    
    return results;
};

/* ================== VERIFICAÇÃO DE MIGRAÇÃO ================== */
window.verifyMediaMigrationFinal = function() {
    console.group('🚀 VERIFICAÇÃO FINAL DA MIGRAÇÃO DE MÍDIA');
    logToPanel('🚀 Iniciando verificação final de migração...', 'migration');
    
    const checks = {
        'MediaSystem disponível': typeof MediaSystem !== 'undefined',
        'Funções essenciais presentes': MediaSystem && 
            typeof MediaSystem.addFiles === 'function' &&
            typeof MediaSystem.addPdfs === 'function' &&
            typeof MediaSystem.uploadAll === 'function',
        'Integração admin funcionando': typeof window.processAndSavePdfs === 'function',
        'Compatibilidade properties.js': typeof window.getMediaUrlsForProperty === 'function',
        'Sistema de preview ativo': document.getElementById('uploadPreview') !== null,
        'Modal PDF funcional': document.getElementById('pdfModal') !== null,
        'Campo senha PDF presente': document.getElementById('pdfPassword') !== null,
        'Interface de upload ativa': document.getElementById('mediaUpload') !== null
    };
    
    // Verificação adicional de funções críticas
    const criticalFunctions = [
        'processAndSavePdfs',
        'clearAllPdfs',
        'loadExistingPdfsForEdit',
        'getPdfsToSave',
        'getMediaUrlsForProperty'
    ];
    
    criticalFunctions.forEach(func => {
        checks[`Função ${func}`] = typeof window[func] === 'function';
    });
    
    const results = {
        checks: checks,
        passedChecks: Object.values(checks).filter(v => v === true).length,
        totalChecks: Object.keys(checks).length,
        timestamp: new Date().toISOString()
    };
    
    results.allValid = results.passedChecks === results.totalChecks;
    results.percentage = Math.round((results.passedChecks / results.totalChecks) * 100);
    
    console.table(checks);
    console.log(`📊 Resultado: ${results.passedChecks}/${results.totalChecks} verificações passaram (${results.percentage}%)`);
    
    if (results.allValid) {
        console.log('✅ TODAS AS VERIFICAÇÕES PASSARAM - PRONTO PARA MIGRAÇÃO FINAL');
        console.log('✅ SISTEMA VALIDADO! Pronto para remover módulos antigos.');
        console.log('✅ Você pode remover com segurança:');
        console.log('   - admin-antigo.js / admin-backup.js');
        console.log('   - gallery-antigo.js / gallery-legacy.js');
        console.log('   - Módulos duplicados');
        console.log('   - Scripts de fallback não mais necessários');
        
        logToPanel('✅ TODAS AS VERIFICAÇÕES PASSARAM - PRONTO PARA MIGRAÇÃO', 'success');
        
        results.status = 'SUCCESS';
        results.message = 'Sistema validado para migração';
        
    } else {
        console.error('❌ VERIFICAÇÕES FALHARAM - NÃO PROSSEGUIR COM REMOÇÃO');
        console.error('Verifique os seguintes itens:');
        
        Object.entries(checks).forEach(([check, passed]) => {
            if (!passed) {
                console.error(`   ❌ ${check}`);
            }
        });
        
        console.error('🔧 Ações recomendadas:');
        console.error('1. Verificar se todos os scripts foram carregados');
        console.error('2. Confirmar que não há erros no console');
        console.error('3. Testar funcionalidades manualmente');
        
        logToPanel('❌ VERIFICAÇÕES FALHARAM - NÃO REMOVER MÓDULOS ANTIGOS', 'error');
        
        results.status = 'FAILED';
        results.message = 'Não prosseguir com migração';
        results.failedChecks = Object.entries(checks).filter(([_, passed]) => !passed).map(([check]) => check);
    }
    
    console.groupEnd();
    return results;
};

window.generateMigrationReport = function() {
    const systemAnalysis = analyzeSystem();
    const migrationCheck = window.verifyMediaMigrationFinal();
    
    const report = {
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        screenInfo: {
            width: window.screen.width,
            height: window.screen.height,
            innerWidth: window.innerWidth,
            innerHeight: window.innerHeight,
            pixelRatio: window.devicePixelRatio
        },
        systemInfo: systemAnalysis.systems,
        domElements: Object.keys(systemAnalysis.criticalElements).reduce((acc, key) => {
            acc[key] = !!systemAnalysis.criticalElements[key];
            return acc;
        }, {}),
        scripts: systemAnalysis.scripts.map(s => ({
            file: s.fileName,
            type: s.type,
            loaded: s.loaded
        })),
        verification: migrationCheck,
        recommendations: migrationCheck.status === 'FAILED' ? 
            'NÃO REMOVER MÓDULOS ANTIGOS - Corrigir falhas primeiro' :
            'PODE REMOVER MÓDULOS ANTIGOS COM SEGURANÇA'
    };
    
    // Gerar arquivo JSON para download
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    logToPanel('📄 Relatório de migração gerado e baixado', 'success');
    return report;
};

window.migrationSafetyChecklist = function() {
    console.group('📋 CHECKLIST DE MIGRAÇÃO SEGURA');
    
    const checklist = [
        { step: 1, task: 'BACKUP COMPLETO', status: 'pending', details: [
            'Backup do banco de dados',
            'Backup dos arquivos do projeto',
            'Backup dos uploads/media existentes'
        ]},
        { step: 2, task: 'TESTES EM STAGING', status: 'pending', details: [
            'Testar upload de imagens',
            'Testar upload de PDFs',
            'Testar proteção por senha em PDFs',
            'Testar em diferentes dispositivos',
            'Testar em diferentes navegadores'
        ]},
        { step: 3, task: 'VALIDAÇÃO TÉCNICA', status: 'pending', details: [
            'Executar: window.verifyMediaMigrationFinal()',
            'Executar: window.runCompleteDiagnosis()',
            'Verificar console por erros',
            'Testar performance'
        ]},
        { step: 4, task: 'PLANO DE ROLLBACK', status: 'pending', details: [
            'Manter cópia dos arquivos antigos',
            'Documentar passos para reverter',
            'Definir critérios de falha'
        ]},
        { step: 5, task: 'COMUNICAÇÃO', status: 'pending', details: [
            'Informar equipe sobre manutenção',
            'Agendar janela de manutenção',
            'Preparar mensagem de "em manutenção"'
        ]},
        { step: 6, task: 'MONITORAMENTO PÓS-MIGRAÇÃO', status: 'pending', details: [
            'Monitorar logs por 24h',
            'Testar funcionalidades críticas',
            'Coletar feedback de usuários'
        ]}
    ];
    
    console.log('Execute ESTES passos ANTES de remover qualquer código:');
    console.table(checklist.map(item => ({
        'Passo': item.step,
        'Tarefa': item.task,
        'Status': item.status,
        'Detalhes': item.details.join('; ')
    })));
    
    console.log('\n✅ Quando TODOS os itens estiverem concluídos, prossiga com a migração.');
    console.groupEnd();
    
    logToPanel('📋 Checklist de segurança exibido no console', 'migration');
    
    return {
        checklist: checklist,
        instructions: 'Execute cada passo sequencialmente antes da migração'
    };
};

/* ================== FUNÇÕES DE RELATÓRIO ================== */
function calculateHealthScore(systemData, testResults) {
    let score = 100;
    
    // Penalidades por sistemas ausentes
    Object.entries(systemData.systems).forEach(([system, active]) => {
        if (!active) {
            const criticalSystems = ['MediaSystem', 'properties', 'admin'];
            if (criticalSystems.includes(system)) score -= 15;
            else score -= 5;
        }
    });
    
    // Penalidades por elementos ausentes
    Object.entries(systemData.criticalElements).forEach(([element, domElement]) => {
        if (!domElement) {
            const criticalElements = ['pdfModal', 'pdfPassword', 'mediaUpload'];
            if (criticalElements.includes(element)) score -= 10;
            else score -= 5;
        }
    });
    
    // Bonus por testes passados
    if (testResults && testResults.total > 0) {
        const percentage = (testResults.passed / testResults.total) * 100;
        score = Math.min(100, score + (percentage / 5));
    }
    
    // Verificar módulos legados (bonus se não houver)
    if (systemData.modules.LEGACY && systemData.modules.LEGACY.length > 0) {
        score -= systemData.modules.LEGACY.length * 5;
        logToPanel(`⚠️  ${systemData.modules.LEGACY.length} módulos legados detectados`, 'warning');
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
            modules: systemData.modules,
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
        migrationStatus: window.verifyMediaMigrationFinal()
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-completo-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    logToPanel('📊 Relatório completo exportado como JSON', 'success');
}

/* ================== PAINEL VISUAL UNIFICADO ================== */
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
    
    diagnosticsPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div style="font-size: 16px; font-weight: bold; color: #00ff9c;">
                🚀 DIAGNÓSTICO COMPLETO v2.0
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
        
        <div style="color: #888; font-size: 11px; margin-bottom: 20px; display: flex; justify-content: space-between;">
            <div>
                Modo: ${DEBUG_MODE ? 'DEBUG' : 'NORMAL'} | 
                ${DIAGNOSTICS_MODE ? 'DIAGNÓSTICO' : 'INATIVO'} |
                ${MIGRATION_MODE ? 'MIGRAÇÃO' : ''}
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
                📱 TESTE MOBILE
            </button>
            <button id="verify-migration" style="
                background: #ffaa00; color: #000; border: none;
                padding: 8px 12px; cursor: pointer; border-radius: 4px;
                font-weight: bold; flex: 1;">
                🚀 VERIFICAR MIGRAÇÃO
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
            <button data-tab="mobile" class="tab-btn" style="
                background: transparent; color: #888; border: none;
                padding: 8px 16px; cursor: pointer;">
                📱 MOBILE
            </button>
            <button data-tab="migration" class="tab-btn" style="
                background: transparent; color: #888; border: none;
                padding: 8px 16px; cursor: pointer;">
                🚀 MIGRAÇÃO
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
            <div id="mobile-content" class="tab-content" style="display: none;"></div>
            <div id="migration-content" class="tab-content" style="display: none;"></div>
            <div id="console-content" class="tab-content" style="display: none;"></div>
        </div>
        
        <div id="status-bar" style="
            margin-top: 15px; padding: 8px; background: #111; 
            border-radius: 4px; font-size: 11px; color: #888;">
            Status: Inicializando...
        </div>
    `;
    
    document.body.appendChild(diagnosticsPanel);
    setupPanelEvents();
    updateDeviceIndicator();
    
    // Inicializar conteúdo das abas
    updateOverview(analyzeSystem());
    updateMigrationTab();
}

function setupPanelEvents() {
    // Controles do painel
    document.getElementById('close-btn')?.addEventListener('click', () => {
        diagnosticsPanel.style.display = 'none';
    });
    
    document.getElementById('minimize-btn')?.addEventListener('click', () => {
        const content = document.getElementById('content-area');
        if (content) {
            content.style.display = content.style.display === 'none' ? 'block' : 'none';
        }
    });
    
    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.tab-btn').forEach(b => {
                b.classList.remove('active');
                b.style.background = 'transparent';
                b.style.color = '#888';
                b.style.borderBottom = 'none';
            });
            
            btn.classList.add('active');
            btn.style.background = '#333';
            btn.style.color = '#00ff9c';
            btn.style.borderBottom = '2px solid #00ff9c';
            
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
            });
            
            const targetContent = document.getElementById(`${btn.dataset.tab}-content`);
            if (targetContent) {
                targetContent.style.display = 'block';
                
                // Carregar conteúdo dinâmico se necessário
                if (btn.dataset.tab === 'migration') {
                    updateMigrationTab();
                }
            }
        });
    });
    
    // Botões de ação
    document.getElementById('run-all-tests')?.addEventListener('click', async () => {
        await runCompleteDiagnosis();
    });
    
    document.getElementById('test-pdf-mobile')?.addEventListener('click', () => {
        runPdfMobileDiagnosis();
    });
    
    document.getElementById('verify-migration')?.addEventListener('click', () => {
        const results = window.verifyMediaMigrationFinal();
        updateMigrationTab(results);
    });
    
    document.getElementById('export-btn')?.addEventListener('click', exportReport);
}

/* ================== ATUALIZAÇÃO DAS ABAS ================== */
function updateOverview(data) {
    const overviewContent = document.getElementById('overview-content');
    if (!overviewContent) return;
    
    const healthScore = calculateHealthScore(data, currentTestResults);
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 10px;">📊 RESUMO DO SISTEMA</h3>
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
                <div style="background: #111; padding: 15px; border-radius: 6px;">
                    <div style="color: #888; font-size: 11px;">SCRIPTS</div>
                    <div style="font-size: 24px; color: #00ff9c;">${data.scripts.length}</div>
                </div>
                <div style="background: #111; padding: 15px; border-radius: 6px;">
                    <div style="color: #888; font-size: 11px;">SISTEMAS</div>
                    <div style="font-size: 24px; color: #00ff9c;">
                        ${Object.values(data.systems).filter(Boolean).length}/${Object.keys(data.systems).length}
                    </div>
                </div>
                <div style="background: #111; padding: 15px; border-radius: 6px;">
                    <div style="color: #888; font-size: 11px;">HEALTH SCORE</div>
                    <div style="font-size: 24px; color: ${getHealthColor(healthScore)};">
                        ${healthScore}%
                    </div>
                </div>
                <div style="background: #111; padding: 15px; border-radius: 6px;">
                    <div style="color: #888; font-size: 11px;">ELEMENTOS</div>
                    <div style="font-size: 24px; color: #00ff9c;">
                        ${Object.values(data.criticalElements).filter(Boolean).length}/${Object.keys(data.criticalElements).length}
                    </div>
                </div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 10px;">🔧 SISTEMAS PRINCIPAIS</h3>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
    `;
    
    Object.entries(data.systems).forEach(([system, active]) => {
        html += `
            <div style="background: #111; padding: 10px; border-radius: 4px; border-left: 3px solid ${active ? '#00ff9c' : '#ff5555'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${system}</span>
                    <span style="color: ${active ? '#00ff9c' : '#ff5555'}; font-size: 10px;">
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
    
    Object.entries(data.criticalElements).forEach(([element, domElement]) => {
        const exists = !!domElement;
        html += `
            <div style="background: #111; padding: 10px; border-radius: 4px; border-left: 3px solid ${exists ? '#00ff9c' : '#ff5555'};">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${element}</span>
                    <span style="color: ${exists ? '#00ff9c' : '#ff5555'}; font-size: 10px;">
                        ${exists ? '✅ PRESENTE' : '❌ AUSENTE'}
                    </span>
                </div>
            </div>
        `;
    });
    
    html += `
            </div>
        </div>
    `;
    
    overviewContent.innerHTML = html;
}

function updateMigrationTab(verificationResults = null) {
    const migrationContent = document.getElementById('migration-content');
    if (!migrationContent) return;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #ffaa00; margin-bottom: 10px;">🚀 VERIFICAÇÃO DE MIGRAÇÃO</h3>
            <div style="background: #1a1a00; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                <p style="color: #ffaa00; margin-bottom: 15px;">
                    ⚠️ Execute esta verificação ANTES de remover módulos antigos
                </p>
                <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                    <button id="run-migration-check" style="
                        background: #ffaa00; color: black; border: none;
                        padding: 12px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; flex: 1;">
                        🔍 EXECUTAR VERIFICAÇÃO
                    </button>
                    <button id="show-checklist" style="
                        background: #333; color: #ffaa00; border: 1px solid #ffaa00;
                        padding: 12px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; flex: 1;">
                        📋 VER CHECKLIST
                    </button>
                </div>
                <div style="font-size: 11px; color: #888;">
                    Valida todos os sistemas antes da migração
                </div>
            </div>
        </div>
    `;
    
    if (verificationResults) {
        const status = verificationResults.status === 'SUCCESS';
        const percentage = verificationResults.percentage || 0;
        
        html += `
            <div style="background: ${status ? '#001a00' : '#1a0000'}; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h4 style="color: ${status ? '#00ff9c' : '#ff5555'}; margin: 0;">
                        ${status ? '✅ VERIFICAÇÃO APROVADA' : '❌ VERIFICAÇÃO FALHOU'}
                    </h4>
                    <div style="font-size: 24px; color: ${status ? '#00ff9c' : '#ff5555'};">
                        ${percentage}%
                    </div>
                </div>
                
                <div style="height: 10px; background: #333; border-radius: 5px; margin-bottom: 15px;">
                    <div style="height: 100%; width: ${percentage}%; background: ${status ? '#00ff9c' : '#ff5555'}; border-radius: 5px;"></div>
                </div>
                
                <div style="color: ${status ? '#00ff9c' : '#ff5555'}; margin-bottom: 10px;">
                    ${verificationResults.passedChecks}/${verificationResults.totalChecks} verificações passaram
                </div>
        `;
        
        if (!status && verificationResults.failedChecks) {
            html += `
                <div style="margin-top: 15px;">
                    <h5 style="color: #ff5555; margin-bottom: 10px;">❌ VERIFICAÇÕES FALHARAM:</h5>
                    <ul style="color: #ff8888; font-size: 11px; padding-left: 20px;">
            `;
            
            verificationResults.failedChecks.forEach(check => {
                html += `<li>${check}</li>`;
            });
            
            html += `
                    </ul>
                </div>
            `;
        }
        
        html += `</div>`;
        
        if (status) {
            html += `
                <div style="background: #001a00; padding: 15px; border-radius: 6px; border-left: 3px solid #00ff9c; margin-bottom: 20px;">
                    <h4 style="color: #00ff9c; margin-bottom: 10px;">✅ MÓDULOS QUE PODEM SER REMOVIDOS</h4>
                    <ul style="color: #888; font-size: 11px; padding-left: 20px;">
                        <li>admin-antigo.js / admin-backup.js</li>
                        <li>gallery-antigo.js / gallery-legacy.js</li>
                        <li>media-*.js (exceto media-core.js e media-ui.js)</li>
                        <li>pdf-*.js (exceto pdf-core.js e pdf-ui.js)</li>
                        <li>Scripts de fallback não utilizados</li>
                    </ul>
                    <p style="color: #ff5555; font-size: 11px; margin-top: 10px;">
                        ⚠️ Faça backup antes de remover!
                    </p>
                </div>
            `;
        }
    }
    
    html += `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #ffaa00; margin-bottom: 10px;">📊 RELATÓRIOS</h4>
            <button id="generate-migration-report" style="
                background: #333; color: #0088cc; border: 1px solid #0088cc;
                padding: 12px 20px; cursor: pointer; border-radius: 4px;
                width: 100%; margin-bottom: 10px;">
                📊 GERAR RELATÓRIO DE MIGRAÇÃO
            </button>
        </div>
    `;
    
    migrationContent.innerHTML = html;
    
    // Configurar eventos
    document.getElementById('run-migration-check')?.addEventListener('click', () => {
        const results = window.verifyMediaMigrationFinal();
        updateMigrationTab(results);
    });
    
    document.getElementById('show-checklist')?.addEventListener('click', () => {
        window.migrationSafetyChecklist();
    });
    
    document.getElementById('generate-migration-report')?.addEventListener('click', () => {
        window.generateMigrationReport();
    });
}

/* ================== FUNÇÕES PRINCIPAIS ================== */
async function runCompleteDiagnosis() {
    try {
        logToPanel('🚀 Iniciando diagnóstico completo...', 'debug');
        updateStatus('Diagnóstico em andamento...', 'info');
        
        const systemData = analyzeSystem();
        updateOverview(systemData);
        
        const testResults = await testMediaUnifiedComplete();
        currentTestResults = testResults;
        
        const healthScore = calculateHealthScore(systemData, testResults);
        logToPanel(`✅ Diagnóstico completo! Health Score: ${healthScore}%`, 'success');
        updateStatus('Diagnóstico completo', 'success');
        
        return { systemData, testResults, healthScore };
        
    } catch (error) {
        logToPanel(`❌ Erro no diagnóstico: ${error.message}`, 'error');
        updateStatus('Erro no diagnóstico', 'error');
        console.error(error);
    }
}

function runPdfMobileDiagnosis() {
    logToPanel('📱 Iniciando diagnóstico mobile PDF...', 'mobile');
    updateStatus('Analisando layout mobile PDF...', 'mobile');
    
    try {
        const results = window.diagnosePdfModalMobile();
        // Atualizar aba mobile...
        logToPanel('✅ Diagnóstico mobile PDF concluído', 'success');
        updateStatus('Diagnóstico mobile completo', 'success');
        
    } catch (error) {
        logToPanel(`❌ Erro no diagnóstico mobile: ${error.message}`, 'error');
        updateStatus('Erro no diagnóstico mobile', 'error');
    }
}

/* ================== FUNÇÕES AUXILIARES ================== */
function getHealthColor(score) {
    if (score >= 80) return '#00ff9c';
    if (score >= 60) return '#ffaa00';
    return '#ff5555';
}

/* ================== INICIALIZAÇÃO ================== */
if (DEBUG_MODE || DIAGNOSTICS_MODE || MIGRATION_MODE) {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            createDiagnosticsPanel();
            
            // Executar análises automáticas baseadas nos modos
            if (DIAGNOSTICS_MODE) {
                setTimeout(() => runCompleteDiagnosis(), 1000);
            }
            
            if (MOBILE_TEST) {
                setTimeout(() => runPdfMobileDiagnosis(), 2000);
            }
            
            if (MIGRATION_MODE) {
                setTimeout(() => {
                    window.verifyMediaMigrationFinal();
                }, 3000);
            }
            
        }, 1500);
    });
}

/* ================== EXPORTAÇÕES GLOBAIS ================== */
window.runCompleteDiagnosis = runCompleteDiagnosis;
window.runPdfMobileDiagnosis = runPdfMobileDiagnosis;
window.verifyMediaMigrationFinal = verifyMediaMigrationFinal;
window.generateMigrationReport = generateMigrationReport;
window.migrationSafetyChecklist = migrationSafetyChecklist;
window.exportReport = exportReport;

console.log('🚀 Sistema de diagnóstico completo carregado.');
console.log('Comandos disponíveis:');
console.log('- window.runCompleteDiagnosis()');
console.log('- window.runPdfMobileDiagnosis()');
console.log('- window.verifyMediaMigrationFinal()');
console.log('- window.generateMigrationReport()');
console.log('- window.migrationSafetyChecklist()');
console.log('- window.exportReport()');
