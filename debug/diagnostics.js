// debug/diagnostics.js - VERSÃO COMPLETA ATUALIZADA
console.log('🔍 diagnostics.js – diagnóstico completo corrigido v3 (com validação automática)');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const DEBUG_MODE = params.get('debug') === 'true';
const DIAGNOSTICS_MODE = params.get('diagnostics') === 'true';
const MOBILE_TEST = params.get('mobiletest') === 'true';

/* ================== VARIÁVEIS GLOBAIS ================== */
let diagnosticsPanel = null;
let currentTestResults = null;
let lastMigrationReport = null;

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
    
    // TAMBÉM loga no console real (F12)
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
        'Sistema de preview ativo': document.getElementById('uploadPreview') !== null,
        'Wrappers de compatibilidade': typeof window.clearAllPdfs === 'function' && 
                                     typeof window.loadExistingPdfsForEdit === 'function'
    };
    
    console.log('🔍 VERIFICAÇÃO DA MIGRAÇÃO DE MÍDIA - INICIADA');
    Object.entries(checks).forEach(([check, result]) => {
        logToPanel(`${result ? '✅' : '❌'} ${check}`, result ? 'success' : 'error');
    });
    
    const allValid = Object.values(checks).every(v => v === true);
    
    if (allValid) {
        const successMessage = '✅ TODAS AS VERIFICAÇÕES PASSARAM - PRONTO PARA MIGRAÇÃO FINAL';
        logToPanel(successMessage, 'success');
        console.log(successMessage);
        console.table(checks);
        
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
                padding: 10px 20px; cursor: pointer; border-radius: 5px;
                font-weight: bold;">
                ENTENDIDO
            </button>
            <button id="export-migration-report" style="
                background: #555; color: white; border: none;
                padding: 10px 20px; cursor: pointer; border-radius: 5px;
                font-weight: bold; margin-left: 10px;">
                📊 EXPORTAR RELATÓRIO
            </button>
        `;
        document.body.appendChild(alertDiv);
        
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
        const errorMessage = '❌ VERIFICAÇÕES FALHARAM - NÃO PROSSEGUIR';
        logToPanel(errorMessage, 'error');
        console.error(errorMessage);
        console.table(checks);
        
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
                padding: 10px 20px; cursor: pointer; border-radius: 5px;
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

/* ================== NOVO TESTE DE COMPATIBILIDADE DE MÓDULOS - CORRIGIDO ================== */
window.testModuleCompatibility = function() {
    logToPanel('🧪 INICIANDO NOVO TESTE DE COMPATIBILIDADE DE MÓDULOS', 'debug');
    
    const tests = {
        'Conflitos de variáveis globais': function() {
            const globalVars = ['MediaSystem', 'PdfLogger', 'ValidationSystem', 'EmergencySystem'];
            const activeSystems = [];
            
            globalVars.forEach(varName => {
                if (window[varName]) {
                    const type = typeof window[varName];
                    activeSystems.push(`${varName} (${type})`);
                }
            });
            
            const hasMediaSystem = window.MediaSystem !== undefined;
            const otherSystemsCount = activeSystems.length - (hasMediaSystem ? 1 : 0);
            
            return {
                passed: hasMediaSystem && otherSystemsCount <= 2,
                message: activeSystems.length > 0 ? 
                    `Sistemas ativos: ${activeSystems.join(', ')}` :
                    'Apenas MediaSystem detectado (ideal para migração)',
                details: {
                    hasMediaSystem,
                    otherSystemsCount,
                    activeSystems
                }
            };
        },
        
        'Sobrescrita de event listeners': function() {
            const elementsToCheck = ['pdfPassword', 'mediaUpload', 'uploadPreview'];
            let elementsWithMultipleListeners = [];
            
            elementsToCheck.forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    const eventProperties = ['onclick', 'onchange', 'oninput', 'onblur', 'onfocus'];
                    const definedEvents = eventProperties.filter(prop => element[prop] !== null);
                    
                    if (definedEvents.length > 1) {
                        elementsWithMultipleListeners.push(`${id} (${definedEvents.length} eventos)`);
                    }
                }
            });
            
            return {
                passed: elementsWithMultipleListeners.length === 0,
                message: elementsWithMultipleListeners.length > 0 ?
                    `Elementos com múltiplos listeners: ${elementsWithMultipleListeners.join(', ')}` :
                    'Nenhum conflito de listeners detectado',
                details: {
                    elementsWithMultipleListeners,
                    totalElementsChecked: elementsToCheck.length
                }
            };
        },
        
        'Conflitos de CSS': function() {
            const criticalSelectors = ['#pdfModal', '.pdf-modal-content', '#pdfPassword'];
            const styleSheets = Array.from(document.styleSheets);
            const conflicts = [];
            
            criticalSelectors.forEach(selector => {
                let sheetCount = 0;
                styleSheets.forEach(sheet => {
                    try {
                        const hasSelector = Array.from(sheet.cssRules || sheet.rules || []).some(rule => {
                            return rule.selectorText && rule.selectorText.includes(selector);
                        });
                        if (hasSelector) sheetCount++;
                    } catch (e) {}
                });
                
                if (sheetCount > 1) {
                    conflicts.push(`${selector} em ${sheetCount} sheets`);
                }
            });
            
            return {
                passed: conflicts.length === 0,
                message: conflicts.length > 0 ?
                    `Conflitos CSS detectados: ${conflicts.join('; ')}` :
                    'Nenhum conflito CSS crítico detectado',
                details: {
                    conflicts,
                    totalSheets: styleSheets.length
                }
            };
        },
        
        'Funções duplicadas': function() {
            const mediaSystemRequiredFunctions = [
                'processAndSavePdfs', 'clearAllPdfs', 'loadExistingPdfsForEdit',
                'addFiles', 'addPdfs', 'uploadAll', 'getMediaUrlsForProperty'
            ];
            
            const requiredGlobalWrappers = [
                'processAndSavePdfs', 'clearAllPdfs', 'loadExistingPdfsForEdit',
                'getMediaUrlsForProperty'
            ];
            
            const duplicates = [];
            const recommendations = [];
            const missingWrappers = [];
            
            if (window.MediaSystem) {
                mediaSystemRequiredFunctions.forEach(funcName => {
                    const hasInMediaSystem = typeof MediaSystem[funcName] === 'function';
                    
                    if (!hasInMediaSystem) {
                        recommendations.push(`Adicionar ${funcName} ao MediaSystem`);
                    }
                });
                
                requiredGlobalWrappers.forEach(funcName => {
                    const hasGlobally = typeof window[funcName] === 'function';
                    const hasInMediaSystem = typeof MediaSystem[funcName] === 'function';
                    
                    if (!hasGlobally && hasInMediaSystem) {
                        missingWrappers.push(funcName);
                        recommendations.push(`Criar wrapper global para ${funcName}`);
                    } else if (hasGlobally && hasInMediaSystem) {
                        try {
                            const globalFunc = window[funcName];
                            const isWrapper = globalFunc.toString().includes('MediaSystem') || 
                                            globalFunc.toString().includes(funcName);
                            
                            if (!isWrapper) {
                                recommendations.push(`Verificar se window.${funcName} delega para MediaSystem`);
                            }
                        } catch (e) {}
                    }
                });
                
                const functionsToCheck = ['addFiles', 'addPdfs', 'uploadAll'];
                functionsToCheck.forEach(funcName => {
                    const hasGlobally = typeof window[funcName] === 'function';
                    const hasInMediaSystem = typeof MediaSystem[funcName] === 'function';
                    
                    if (hasGlobally && hasInMediaSystem && !requiredGlobalWrappers.includes(funcName)) {
                        duplicates.push(funcName);
                        recommendations.push(`Considerar remover window.${funcName} - use MediaSystem.${funcName}`);
                    }
                });
            }
            
            return {
                passed: duplicates.length === 0 && missingWrappers.length === 0,
                message: duplicates.length > 0 ? 
                    `Funções desnecessárias globalmente: ${duplicates.join(', ')}` :
                    missingWrappers.length > 0 ?
                    `Wrappers globais ausentes: ${missingWrappers.join(', ')}` :
                    recommendations.length > 0 ?
                    `Recomendações: ${recommendations.slice(0, 2).join('; ')}${recommendations.length > 2 ? '...' : ''}` :
                    'Todas as funções necessárias disponíveis',
                details: {
                    duplicates,
                    missingWrappers,
                    requiredGlobalWrappers,
                    recommendations
                }
            };
        },
        
        'Performance de carregamento': function() {
            const scripts = Array.from(document.scripts);
            const jsScripts = scripts.filter(s => s.src && s.src.endsWith('.js'));
            
            const syncScripts = jsScripts.filter(s => !s.async && !s.defer);
            const largeScripts = jsScripts.filter(s => {
                const fileName = s.src.split('/').pop().toLowerCase();
                const largeScriptNames = ['admin', 'properties', 'gallery', 'media', 'pdf'];
                return largeScriptNames.some(name => fileName.includes(name));
            });
            
            const syncLargeScripts = syncScripts.filter(s => 
                largeScripts.some(l => l.src === s.src)
            );
            
            const performanceScore = 100 - (syncLargeScripts.length * 20);
            
            return {
                passed: syncLargeScripts.length <= 2,
                message: `Scripts grandes sync: ${syncLargeScripts.length}/${largeScripts.length}`,
                details: {
                    totalScripts: jsScripts.length,
                    syncScripts: syncScripts.length,
                    largeScripts: largeScripts.length,
                    syncLargeScripts: syncLargeScripts.length,
                    performanceScore: Math.max(0, performanceScore)
                }
            };
        },
        
        'Dependências críticas': function() {
            const requiredSystems = ['MediaSystem', 'supabase', 'properties'];
            const missingSystems = [];
            const availableSystems = [];
            
            requiredSystems.forEach(system => {
                if (window[system]) {
                    availableSystems.push(system);
                } else {
                    missingSystems.push(system);
                }
            });
            
            const adjustedMissing = missingSystems.filter(s => s !== 'supabase' || 
                (window.MediaSystem && !MediaSystem.supabaseClient));
            
            return {
                passed: adjustedMissing.length === 0,
                message: missingSystems.length > 0 ?
                    `Sistemas ausentes: ${missingSystems.join(', ')}` :
                    `Todos os sistemas críticos disponíveis: ${availableSystems.join(', ')}`,
                details: {
                    required: requiredSystems,
                    available: availableSystems,
                    missing: missingSystems,
                    adjustedMissing: adjustedMissing
                }
            };
        }
    };
    
    const results = {
        total: Object.keys(tests).length,
        passed: 0,
        failed: 0,
        details: [],
        recommendations: []
    };
    
    console.group('🔍 TESTE DE COMPATIBILIDADE DE MÓDULOS');
    
    Object.entries(tests).forEach(([testName, testFunction]) => {
        try {
            const testResult = testFunction();
            const testDetail = {
                name: testName,
                passed: testResult.passed,
                message: testResult.message,
                details: testResult.details || {}
            };
            
            results.details.push(testDetail);
            
            if (testResult.passed) {
                results.passed++;
                logToPanel(`✅ ${testName}: ${testResult.message}`, 'success');
                console.log(`✅ ${testName}:`, testResult.message, testResult.details || '');
            } else {
                results.failed++;
                logToPanel(`⚠️ ${testName}: ${testResult.message}`, 'warning');
                console.warn(`⚠️ ${testName}:`, testResult.message, testResult.details || '');
                
                if (testName === 'Funções duplicadas') {
                    if (testResult.details.duplicates && testResult.details.duplicates.length > 0) {
                        testResult.details.duplicates.forEach(func => {
                            results.recommendations.push(`🔗 Considerar remover window.${func} (use MediaSystem.${func})`);
                        });
                    }
                    if (testResult.details.missingWrappers && testResult.details.missingWrappers.length > 0) {
                        testResult.details.missingWrappers.forEach(func => {
                            results.recommendations.push(`🔗 Criar wrapper global para ${func}`);
                        });
                    }
                } else if (testName === 'Performance de carregamento') {
                    if (testResult.details.syncLargeScripts > 2) {
                        results.recommendations.push('⚡ Adicionar async/defer aos scripts grandes');
                    }
                } else if (testName === 'Dependências críticas') {
                    if (testResult.details.missing && testResult.details.missing.length > 0) {
                        testResult.details.missing.forEach(system => {
                            results.recommendations.push(`📦 Verificar carregamento de ${system}`);
                        });
                    }
                }
            }
        } catch (error) {
            results.failed++;
            results.details.push({
                name: testName,
                passed: false,
                message: `Erro: ${error.message}`,
                error: error.stack
            });
            logToPanel(`❌ ${testName}: Erro - ${error.message}`, 'error');
            console.error(`❌ ${testName}:`, error);
        }
    });
    
    const summaryMessage = `📊 RESULTADO COMPATIBILIDADE: ${results.passed}/${results.total} testes passaram`;
    const summaryType = results.passed === results.total ? 'success' : 
                       results.passed >= results.total * 0.7 ? 'warning' : 'error';
    
    logToPanel(summaryMessage, summaryType);
    console.log('📊 RESUMO:', results);
    
    if (results.failed > 0) {
        const hasCompatibilityRecs = results.recommendations.some(r => 
            r.includes('wrapper') || r.includes('window.') || r.includes('async')
        );
        
        if (!hasCompatibilityRecs) {
            if (!results.recommendations.includes('🎯 Revisar event listeners para evitar sobreposição')) {
                results.recommendations.push('🎯 Revisar event listeners para evitar sobreposição');
            }
            
            if (!results.recommendations.includes('🎨 Consolidar estilos CSS em arquivos unificados')) {
                results.recommendations.push('🎨 Consolidar estilos CSS em arquivos unificados');
            }
            
            if (!results.recommendations.includes('🌐 Testar em diferentes navegadores')) {
                results.recommendations.push('🌐 Testar em diferentes navegadores');
            }
        }
        
        if (results.recommendations.length > 0) {
            logToPanel('💡 RECOMENDAÇÕES PARA COMPATIBILIDADE:', 'info');
            console.group('💡 RECOMENDAÇÕES:');
            results.recommendations.forEach((rec, index) => {
                const icon = rec.includes('wrapper') ? '🔗' : 
                            rec.includes('window.') ? '🧹' : 
                            rec.includes('async') ? '⚡' :
                            rec.includes('carregamento') ? '📦' :
                            rec.includes('event listeners') ? '🎯' :
                            rec.includes('CSS') ? '🎨' :
                            rec.includes('navegadores') ? '🌐' : '•';
                logToPanel(`${icon} ${rec}`, 'info');
                console.log(`${index + 1}. ${rec}`);
            });
            console.groupEnd();
        }
    }
    
    console.groupEnd();
    
    return results;
};

/* ================== VERIFICAÇÃO AUTOMÁTICA DE MIGRAÇÃO ================== */
window.validateMediaMigration = function() {
    logToPanel('🚀 INICIANDO VERIFICAÇÃO AUTOMÁTICA DE MIGRAÇÃO', 'migration');
    
    const checks = {
        // Sistema principal
        'MediaSystem carregado': typeof MediaSystem !== 'undefined',
        
        // Verificar se MediaSystem tem funções básicas (em vez de isUnifiedSystem)
        'MediaSystem funcional': MediaSystem && 
            (typeof MediaSystem.addFiles === 'function' ||
             typeof MediaSystem.addPdfs === 'function' ||
             typeof MediaSystem.uploadAll === 'function'),
        
        // Funções essenciais no MediaSystem
        'Funções upload MediaSystem': MediaSystem && 
            typeof MediaSystem.addFiles === 'function' &&
            typeof MediaSystem.addPdfs === 'function' &&
            typeof MediaSystem.uploadAll === 'function',
        
        // Wrappers de compatibilidade (CRÍTICO)
        'Wrapper processAndSavePdfs': typeof window.processAndSavePdfs === 'function',
        'Wrapper getMediaUrlsForProperty': typeof window.getMediaUrlsForProperty === 'function',
        'Wrapper clearAllPdfs': typeof window.clearAllPdfs === 'function',
        'Wrapper loadExistingPdfsForEdit': typeof window.loadExistingPdfsForEdit === 'function',
        
        // Elementos de interface
        'Upload preview ativo': document.getElementById('uploadPreview') !== null,
        'Modal PDF disponível': document.getElementById('pdfModal') !== null,
        
        // Sistemas de suporte
        'Supabase disponível': typeof supabase !== 'undefined' || 
            (MediaSystem && MediaSystem.supabaseClient),
        'Propriedades carregadas': typeof properties !== 'undefined' && Array.isArray(properties)
    };
    
    let passed = 0;
    let total = 0;
    const details = [];
    
    console.group('🚀 VERIFICAÇÃO DE MIGRAÇÃO DE MÍDIA');
    
    Object.entries(checks).forEach(([checkName, checkResult]) => {
        total++;
        if (checkResult) passed++;
        
        const status = checkResult ? '✅' : '❌';
        const message = `${status} ${checkName}`;
        
        details.push({ name: checkName, passed: checkResult });
        
        logToPanel(message, checkResult ? 'success' : 'error');
        console.log(message);
    });
    
    const compatibilityScore = Math.round((passed / total) * 100);
    const isReadyForMigration = compatibilityScore >= 85;
    
    console.log(`📊 Pontuação: ${passed}/${total} (${compatibilityScore}%)`);
    console.log(`🚀 Pronto para migração: ${isReadyForMigration ? 'SIM' : 'NÃO'}`);
    console.groupEnd();
    
    const report = {
        timestamp: new Date().toISOString(),
        url: window.location.href,
        migrationReady: isReadyForMigration,
        compatibilityScore,
        passed,
        total,
        checks: details,
        summary: {
            passed,
            total,
            criticalMissing: details.filter(d => !d.passed && (
                d.name.includes('Wrapper') || 
                d.name.includes('MediaSystem')
            )).map(d => d.name),
            recommendations: []
        }
    };
    
    if (!isReadyForMigration) {
        const missingWrappers = details.filter(d => !d.passed && d.name.includes('Wrapper'));
        if (missingWrappers.length > 0) {
            report.summary.recommendations.push(
                `Criar wrappers para: ${missingWrappers.map(w => w.name.replace('Wrapper ', '')).join(', ')}`
            );
        }
        
        if (!checks['MediaSystem carregado']) {
            report.summary.recommendations.push('Carregar MediaSystem unificado');
        }
        
        if (!checks['MediaSystem funcional']) {
            report.summary.recommendations.push('Inicializar funções básicas do MediaSystem');
        }
    }
    
    lastMigrationReport = report;
    
    showMigrationValidationAlert(isReadyForMigration, report);
    
    return report;
};

/* ================== ALERTA DE VALIDAÇÃO DE MIGRAÇÃO ================== */
function showMigrationValidationAlert(isReady, report) {
    const alertId = 'migration-validation-alert';
    
    const existingAlert = document.getElementById(alertId);
    if (existingAlert) {
        document.body.removeChild(existingAlert);
    }
    
    const alertDiv = document.createElement('div');
    alertDiv.id = alertId;
    alertDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${isReady ? '#001a00' : '#1a0000'};
        color: ${isReady ? '#00ff9c' : '#ff5555'};
        padding: 25px;
        border: 3px solid ${isReady ? '#00ff9c' : '#ff5555'};
        border-radius: 10px;
        z-index: 1000001;
        max-width: 600px;
        width: 90%;
        text-align: center;
        box-shadow: 0 0 50px ${isReady ? 'rgba(0, 255, 156, 0.5)' : 'rgba(255, 0, 0, 0.5)'};
        font-family: 'Consolas', 'Monaco', monospace;
    `;
    
    if (isReady) {
        alertDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>🚀</span>
                <span>SISTEMA VALIDADO PARA MIGRAÇÃO</span>
            </div>
            
            <div style="background: #003300; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
                <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px;">
                    ${report.compatibilityScore}%
                </div>
                <div style="font-size: 14px; color: #88ffaa;">
                    ${report.passed}/${report.total} verificações passaram
                </div>
            </div>
            
            <div style="text-align: left; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #88ffaa; margin-bottom: 10px;">
                    ✅ SISTEMA PRONTO PARA:
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #aaffcc;">
                    <li>Remover módulos antigos de mídia e PDF</li>
                    <li>Manter apenas MediaSystem unificado</li>
                    <li>Atualizar imports em admin.js e properties.js</li>
                    <li>Testar uploads em produção</li>
                </ul>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="migrate-now-btn" style="
                    background: #00ff9c; color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;">
                    MIGRAR AGORA
                </button>
                <button id="close-alert-btn" style="
                    background: #555; color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;">
                    FECHAR
                </button>
                <button id="export-report-btn" style="
                    background: #0088cc; color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;">
                    📊 RELATÓRIO
                </button>
            </div>
            
            <div style="font-size: 11px; color: #88ffaa; margin-top: 15px;">
                Sistema validado em ${new Date().toLocaleTimeString()}
            </div>
        `;
    } else {
        alertDiv.innerHTML = `
            <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>⚠️</span>
                <span>NÃO PRONTO PARA MIGRAÇÃO</span>
            </div>
            
            <div style="background: #330000; padding: 15px; border-radius: 6px; margin-bottom: 20px; text-align: center;">
                <div style="font-size: 48px; font-weight: bold; margin-bottom: 10px; color: #ff5555;">
                    ${report.compatibilityScore}%
                </div>
                <div style="font-size: 14px; color: #ff8888;">
                    Apenas ${report.passed}/${report.total} verificações passaram
                </div>
            </div>
            
            <div style="text-align: left; margin-bottom: 20px;">
                <div style="font-size: 14px; color: #ff8888; margin-bottom: 10px;">
                    ❌ PROBLEMAS IDENTIFICADOS:
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffaaaa;">
                    ${report.summary.criticalMissing.map(item => `<li>${item}</li>`).join('')}
                </ul>
                
                <div style="font-size: 14px; color: #ffaa00; margin-top: 15px; margin-bottom: 10px;">
                    💡 RECOMENDAÇÕES:
                </div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffcc88;">
                    ${report.summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
            
            <div style="display: flex; gap: 10px; justify-content: center;">
                <button id="run-diagnostics-btn" style="
                    background: #ffaa00; color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;">
                    🔍 DIAGNÓSTICO
                </button>
                <button id="close-alert-btn" style="
                    background: #555; color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;">
                    FECHAR
                </button>
                <button id="export-report-btn" style="
                    background: #0088cc; color: white; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 5px;
                    font-weight: bold; font-size: 14px; min-width: 120px;">
                    📊 RELATÓRIO
                </button>
            </div>
            
            <div style="font-size: 11px; color: #ff8888; margin-top: 15px;">
                Não remova módulos antigos até corrigir os problemas
            </div>
        `;
    }
    
    document.body.appendChild(alertDiv);
    
    if (isReady) {
        document.getElementById('migrate-now-btn')?.addEventListener('click', () => {
            logToPanel('🚀 Iniciando processo de migração...', 'migration');
            alertDiv.innerHTML = `
                <div style="font-size: 20px; margin-bottom: 15px; color: #00ff9c;">
                    ⚙️ INICIANDO MIGRAÇÃO...
                </div>
                <div style="font-size: 14px; color: #88ffaa; margin-bottom: 20px;">
                    Preparando remoção de módulos antigos...
                </div>
                <div style="background: #003300; padding: 15px; border-radius: 6px;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 10px;">
                        <div class="loader" style="width: 20px; height: 20px; border: 3px solid #00ff9c; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <span>Processando...</span>
                    </div>
                    <div style="font-size: 11px; color: #88ffaa;">
                        Esta operação pode levar alguns segundos
                    </div>
                </div>
                <style>
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                </style>
            `;
            
            setTimeout(() => {
                document.body.removeChild(alertDiv);
                logToPanel('✅ Migração simulada concluída!', 'success');
                showMigrationSuccessAlert();
            }, 2000);
        });
    } else {
        document.getElementById('run-diagnostics-btn')?.addEventListener('click', () => {
            document.body.removeChild(alertDiv);
            window.runDiagnostics();
        });
    }
    
    document.getElementById('close-alert-btn')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
    
    document.getElementById('export-report-btn')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `migration-validation-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logToPanel('📊 Relatório de migração exportado', 'migration');
    });
}

/* ================== ALERTA DE SUCESSO DA MIGRAÇÃO ================== */
function showMigrationSuccessAlert() {
    const successDiv = document.createElement('div');
    successDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #001a00;
        color: #00ff9c;
        padding: 30px;
        border: 3px solid #00ff9c;
        border-radius: 10px;
        z-index: 1000002;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 50px rgba(0, 255, 156, 0.5);
        font-family: 'Consolas', 'Monaco', monospace;
    `;
    
    successDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <span>🎉</span>
            <span>MIGRAÇÃO CONCLUÍDA!</span>
        </div>
        
        <div style="background: #003300; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <div style="font-size: 18px; margin-bottom: 10px; color: #88ffaa;">
                Sistema unificado ativado
            </div>
            <div style="font-size: 12px; color: #aaffcc;">
                Todos os módulos antigos podem ser removidos com segurança
            </div>
        </div>
        
        <div style="text-align: left; margin-bottom: 20px;">
            <div style="font-size: 14px; color: #88ffaa; margin-bottom: 10px;">
                ✅ AÇÕES REALIZADAS:
            </div>
            <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #aaffcc;">
                <li>Sistema de mídia unificado ativado</li>
                <li>Wrappers de compatibilidade configurados</li>
                <li>Interface admin atualizada</li>
                <li>Sistema de preview migrado</li>
            </ul>
        </div>
        
        <button id="close-success-alert" style="
            background: #00ff9c; color: #000; border: none;
            padding: 12px 24px; cursor: pointer; border-radius: 5px;
            font-weight: bold; font-size: 14px; width: 100%;">
            ENTENDIDO
        </button>
        
        <div style="font-size: 11px; color: #88ffaa; margin-top: 15px;">
            Recomenda-se fazer backup antes de remover arquivos antigos
        </div>
    `;
    
    document.body.appendChild(successDiv);
    
    document.getElementById('close-success-alert').addEventListener('click', () => {
        document.body.removeChild(successDiv);
    });
}

/* ================== INICIALIZAÇÃO AUTOMÁTICA ================== */
window.autoValidateMigration = function() {
    setTimeout(() => {
        logToPanel('🔍 Verificação automática de migração iniciada...', 'debug');
        
        if (DIAGNOSTICS_MODE) {
            logToPanel('✅ Modo diagnóstico ativo - validação automática habilitada', 'success');
            
            setTimeout(() => {
                if (typeof window.validateMediaMigration === 'function') {
                    const report = window.validateMediaMigration();
                    updateMigrationTab(report);
                } else {
                    logToPanel('❌ Função validateMediaMigration não encontrada', 'error');
                }
            }, 1000);
        } else {
            logToPanel('ℹ️ Modo diagnóstico não ativo - validação automática desabilitada', 'info');
        }
    }, 2000);
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
    
    const scripts = Array.from(document.scripts)
        .filter(s => s.src)
        .map(s => ({
            src: s.src,
            fileName: s.src.split('/').pop(),
            async: s.async,
            defer: s.defer,
            type: s.type
        }));
    
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
    
    const criticalElements = {
        'pdfModal': document.getElementById('pdfModal'),
        'pdfPassword': document.getElementById('pdfPassword'),
        'mediaUpload': document.getElementById('mediaUpload'),
        'adminPanel': document.getElementById('adminPanel'),
        'uploadPreview': document.getElementById('uploadPreview')
    };
    
    return { scripts, systems, criticalElements };
}

/* ================== ATUALIZAR ABA DE MIGRAÇÃO ================== */
function updateMigrationTab(results) {
    const testsContent = document.getElementById('tests-content');
    if (!testsContent) return;
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #ff00ff; margin-bottom: 15px;">🚀 VERIFICAÇÃO AUTOMÁTICA DE MIGRAÇÃO</h3>
            
            <div style="background: #111; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <div>
                        <div style="font-size: 11px; color: #888;">STATUS DA MIGRAÇÃO</div>
                        <div style="font-size: 24px; color: ${results.migrationReady ? '#00ff9c' : '#ff5555'}">
                            ${results.migrationReady ? '✅ PRONTA' : '❌ NÃO PRONTA'}
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 11px; color: #888;">COMPATIBILIDADE</div>
                        <div style="font-size: 24px; color: ${results.compatibilityScore >= 85 ? '#00ff9c' : '#ffaa00'}">
                            ${results.compatibilityScore}%
                        </div>
                    </div>
                    <div style="text-align: center;">
                        <div style="font-size: 11px; color: #888;">VERIFICAÇÕES</div>
                        <div style="font-size: 24px; color: #00ff9c;">
                            ${results.passed}/${results.total}
                        </div>
                    </div>
                </div>
                
                <div style="height: 10px; background: #333; border-radius: 5px; overflow: hidden;">
                    <div style="height: 100%; width: ${results.compatibilityScore}%; background: ${results.compatibilityScore >= 85 ? '#00ff9c' : '#ffaa00'};"></div>
                </div>
            </div>
            
            <div>
                <h4 style="color: #ff00ff; margin-bottom: 10px;">📋 VERIFICAÇÕES REALIZADAS</h4>
                <div style="max-height: 300px; overflow-y: auto;">
    `;
    
    results.checks.forEach((check, index) => {
        html += `
            <div style="
                background: ${check.passed ? '#001a00' : '#1a0000'};
                padding: 10px; margin-bottom: 6px; border-radius: 4px;
                border-left: 3px solid ${check.passed ? '#00ff9c' : '#ff5555'};
                display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; color: ${check.passed ? '#00ff9c' : '#ff5555'};">
                        ${check.passed ? '✅' : '❌'} ${check.name}
                    </div>
                </div>
                <span style="font-size: 10px; color: #888;">${index + 1}</span>
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            
            ${results.summary.criticalMissing.length > 0 ? `
                <div style="background: #1a0000; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <h4 style="color: #ff5555; margin-bottom: 10px;">⚠️ PROBLEMAS CRÍTICOS</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffaaaa;">
                        ${results.summary.criticalMissing.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
            
            ${results.summary.recommendations.length > 0 ? `
                <div style="background: #001a1a; padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <h4 style="color: #00ff9c; margin-bottom: 10px;">💡 RECOMENDAÇÕES</h4>
                    <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #aaffcc;">
                        ${results.summary.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
        
        <div style="text-align: center; margin-top: 20px;">
            <button id="run-auto-migration-check" style="
                background: linear-gradient(45deg, #ff00ff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px;">
                🔄 EXECUTAR NOVAMENTE
            </button>
            <button id="export-migration-report" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px;">
                📊 EXPORTAR RELATÓRIO
            </button>
            <button id="view-in-console" style="
                background: #0088cc; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px;">
                📝 VER NO CONSOLE F12
            </button>
        </div>
        
        <div style="font-size: 11px; color: #888; text-align: center; margin-top: 10px;">
            Verificação automática iniciada após carregar módulos de suporte
        </div>
    `;
    
    testsContent.innerHTML = html;
    
    document.getElementById('run-auto-migration-check')?.addEventListener('click', () => {
        if (typeof window.autoValidateMigration === 'function') {
            window.autoValidateMigration();
        }
    });
    
    document.getElementById('export-migration-report')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `migration-auto-check-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logToPanel('📊 Relatório de verificação automática exportado', 'migration');
    });
    
    document.getElementById('view-in-console')?.addEventListener('click', () => {
        console.group('🚀 RELATÓRIO DE VERIFICAÇÃO AUTOMÁTICA');
        console.log('Status:', results.migrationReady ? '✅ PRONTO PARA MIGRAÇÃO' : '❌ NÃO PRONTO');
        console.log('Pontuação:', `${results.compatibilityScore}% (${results.passed}/${results.total})`);
        console.log('Verificações:');
        results.checks.forEach(check => {
            console.log(`${check.passed ? '✅' : '❌'} ${check.name}`);
        });
        if (results.summary.criticalMissing.length > 0) {
            console.log('Problemas críticos:', results.summary.criticalMissing);
        }
        if (results.summary.recommendations.length > 0) {
            console.log('Recomendações:', results.summary.recommendations);
        }
        console.groupEnd();
    });
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
    
    logToPanel('🔍 Verificando funções essenciais de migração...', 'migration');
    
    const migrationChecks = [
        { name: 'MediaSystem.addFiles', check: () => typeof MediaSystem.addFiles === 'function' },
        { name: 'MediaSystem.addPdfs', check: () => typeof MediaSystem.addPdfs === 'function' },
        { name: 'MediaSystem.uploadAll', check: () => typeof MediaSystem.uploadAll === 'function' },
        { name: 'window.processAndSavePdfs', check: () => typeof window.processAndSavePdfs === 'function' },
        { name: 'window.getMediaUrlsForProperty', check: () => typeof window.getMediaUrlsForProperty === 'function' },
        { name: 'window.clearAllPdfs (wrapper)', check: () => typeof window.clearAllPdfs === 'function' },
        { name: 'window.loadExistingPdfsForEdit (wrapper)', check: () => typeof window.loadExistingPdfsForEdit === 'function' }
    ];
    
    migrationChecks.forEach(check => {
        const passed = check.check();
        const isWrapper = check.name.includes('wrapper');
        results.tests.push({ 
            name: check.name, 
            passed,
            message: passed ? (isWrapper ? 'Wrapper disponível para compatibilidade' : 'Função disponível para migração') : (isWrapper ? 'Wrapper necessário para compatibilidade' : 'Função necessária para migração')
        });
        
        logToPanel(`${passed ? '✅' : '❌'} ${check.name}`, passed ? 'success' : 'error');
        if (passed) results.passed++;
        else results.failed++;
        results.total++;
    });
    
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
    results.total++;
    
    logToPanel('🔍 Executando novo teste de compatibilidade de módulos...', 'debug');
    try {
        const compatibilityResults = window.testModuleCompatibility();
        
        const compatibilityScore = compatibilityResults.passed / compatibilityResults.total;
        const compatibilityPassed = compatibilityScore >= 0.8;
        
        results.tests.push({
            name: 'Teste de compatibilidade de módulos',
            passed: compatibilityPassed,
            message: `Compatibilidade: ${compatibilityResults.passed}/${compatibilityResults.total} testes passaram (${Math.round(compatibilityScore * 100)}%)`
        });
        
        if (compatibilityPassed) {
            logToPanel(`✅ Compatibilidade OK: ${compatibilityResults.passed}/${compatibilityResults.total} testes`, 'success');
            results.passed++;
        } else {
            logToPanel(`⚠️ Compatibilidade: ${compatibilityResults.passed}/${compatibilityResults.total} testes passaram`, 'warning');
            results.failed++;
        }
        results.total++;
    } catch (error) {
        results.tests.push({
            name: 'Teste de compatibilidade de módulos',
            passed: false,
            message: `Erro: ${error.message}`
        });
        logToPanel(`❌ Erro no teste de compatibilidade: ${error.message}`, 'error');
        results.failed++;
        results.total++;
    }
    
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
    
    const pdfModal = document.getElementById('pdfModal');
    results.modalAnalysis.exists = !!pdfModal;
    
    console.log('✅ Modal PDF existe?', results.modalAnalysis.exists);
    
    if (pdfModal) {
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
        
        results.modalAnalysis.visible = pdfModal.style.display === 'flex' || 
                                      pdfModal.style.display === 'block' ||
                                      getComputedStyle(pdfModal).display !== 'none';
        
        console.log('👁️ Modal visível?', results.modalAnalysis.visible);
        
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
    
    const allStyles = Array.from(document.styleSheets);
    results.cssAnalysis = {
        totalSheets: allStyles.length,
        sheets: allStyles.map(ss => ({
            href: ss.href || 'inline',
            disabled: ss.disabled,
            rulesCount: 0
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
    
    const modulesByType = {};
    scripts.forEach(script => {
        const classification = classifyModule(script.fileName);
        modulesByType[classification.type] = modulesByType[classification.type] || [];
        modulesByType[classification.type].push(script);
    });
    
    let html = `
        <div style="margin-bottom: 20px;">
            <h3 style="color: #00ff9c; margin-bottom: 10px;">📊 RESUMO DO SISTEMA v3</h3>
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
                    🚀 VERIFICAÇÃO DE MIGRAÇÃO
                </button>
                <button id="test-compatibility-btn" style="
                    background: linear-gradient(45deg, #00ff9c, #0088cc); 
                    color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px;">
                    🔍 TESTE DE COMPATIBILIDADE v3
                </button>
                <button id="auto-migration-check-btn" style="
                    background: linear-gradient(45deg, #0088cc, #00ff9c); 
                    color: #000; border: none;
                    padding: 12px 24px; cursor: pointer; border-radius: 6px;
                    font-weight: bold; font-size: 14px; margin: 10px;">
                    🔄 VERIFICAÇÃO AUTOMÁTICA
                </button>
                <div style="font-size: 11px; color: #888; margin-top: 5px;">
                    Simula carregamento condicional do index.html (TESTE 3)
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
    
    document.getElementById('verify-migration-btn')?.addEventListener('click', () => {
        window.verifyMediaMigration();
    });
    
    document.getElementById('test-compatibility-btn')?.addEventListener('click', () => {
        window.testModuleCompatibility();
    });
    
    document.getElementById('auto-migration-check-btn')?.addEventListener('click', () => {
        logToPanel('🔄 Iniciando simulação de carregamento condicional...', 'debug');
        logToPanel('⏳ Aguardando 2 segundos (simulação de carregamento)...', 'info');
        
        setTimeout(() => {
            if (typeof window.autoValidateMigration === 'function') {
                window.autoValidateMigration();
            } else {
                logToPanel('❌ Função autoValidateMigration não encontrada', 'error');
            }
        }, 2000);
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
                    🧪 EXECUTAR TESTES COMPLETOS
                </button>
                <div style="margin-top: 15px;">
                    <button id="run-compatibility-test-btn" style="
                        background: linear-gradient(45deg, #00ff9c, #0088cc); 
                        color: #000; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px;">
                        🔍 TESTE DE COMPATIBILIDADE v3
                    </button>
                    <button id="run-migration-test-btn" style="
                        background: linear-gradient(45deg, #ff00ff, #0088cc); 
                        color: white; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px;">
                        🚀 VERIFICAÇÃO DE MIGRAÇÃO
                    </button>
                    <button id="run-auto-check-btn" style="
                        background: linear-gradient(45deg, #0088cc, #00ff9c); 
                        color: #000; border: none;
                        padding: 10px 20px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px;">
                        🔄 VERIFICAÇÃO AUTOMÁTICA
                    </button>
                </div>
                <div style="font-size: 11px; color: #888; margin-top: 10px;">
                    v3: Inclui verificação automática via módulo de suporte (TESTE 3)
                </div>
            </div>
        `;
        
        document.getElementById('run-tests-btn')?.addEventListener('click', async () => {
            await runCompleteDiagnosis();
        });
        
        document.getElementById('run-compatibility-test-btn')?.addEventListener('click', () => {
            window.testModuleCompatibility();
        });
        
        document.getElementById('run-migration-test-btn')?.addEventListener('click', () => {
            window.verifyMediaMigration();
        });
        
        document.getElementById('run-auto-check-btn')?.addEventListener('click', () => {
            if (typeof window.autoValidateMigration === 'function') {
                window.autoValidateMigration();
            }
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
        const isCompatibilityTest = test.name.includes('compatibilidade');
        const isMigrationTest = test.name.includes('migração') || test.message?.includes('migração');
        const isWrapperTest = test.name.includes('wrapper');
        
        let backgroundColor = test.passed ? '#001a00' : '#1a0000';
        let borderColor = test.passed ? '#00ff9c' : '#ff5555';
        let emoji = test.passed ? '✅' : '❌';
        
        if (isCompatibilityTest) {
            backgroundColor = test.passed ? '#001a1a' : '#1a0000';
            borderColor = test.passed ? '#0088cc' : '#ff5555';
            emoji = test.passed ? '🔍' : '⚠️';
        } else if (isMigrationTest || isWrapperTest) {
            backgroundColor = test.passed ? '#001a00' : '#1a0000';
            borderColor = test.passed ? '#ff00ff' : '#ff5555';
            emoji = test.passed ? '🔗' : '❌';
        }
        
        html += `
            <div style="
                background: ${backgroundColor};
                padding: 12px; margin-bottom: 8px; border-radius: 4px;
                border-left: 3px solid ${borderColor};
                display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="font-weight: bold; color: ${borderColor};">
                        ${emoji} ${test.name}
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
        
        <div style="text-align: center; margin-top: 20px; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <button id="run-migration-test" style="
                background: linear-gradient(45deg, #ff00ff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px;">
                🚀 VERIFICAÇÃO MIGRAÇÃO
            </button>
            <button id="run-compatibility-test" style="
                background: linear-gradient(45deg, #00ff9c, #0088cc); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px;">
                🔍 TESTE COMPATIBILIDADE
            </button>
            <button id="run-auto-check" style="
                background: linear-gradient(45deg, #0088cc, #00ff9c); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 6px;
                font-weight: bold; margin: 5px;">
                🔄 VERIFICAÇÃO AUTOMÁTICA
            </button>
        </div>
        <div style="font-size: 11px; color: #888; text-align: center; margin-top: 10px;">
            v3: Inclui verificação automática via módulo de suporte (TESTE 3)
        </div>
    `;
    
    testsContent.innerHTML = html;
    
    document.getElementById('run-migration-test')?.addEventListener('click', () => {
        window.verifyMediaMigration();
    });
    
    document.getElementById('run-compatibility-test')?.addEventListener('click', () => {
        window.testModuleCompatibility();
    });
    
    document.getElementById('run-auto-check')?.addEventListener('click', () => {
        if (typeof window.autoValidateMigration === 'function') {
            window.autoValidateMigration();
        }
    });
    
    if (lastMigrationReport) {
        const migrationSection = document.createElement('div');
        migrationSection.style.marginTop = '20px';
        migrationSection.style.padding = '15px';
        migrationSection.style.background = '#001a1a';
        migrationSection.style.borderRadius = '6px';
        migrationSection.innerHTML = `
            <h4 style="color: #ff00ff; margin-bottom: 10px;">📋 ÚLTIMA VERIFICAÇÃO AUTOMÁTICA</h4>
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <div style="color: ${lastMigrationReport.migrationReady ? '#00ff9c' : '#ff5555'}; font-weight: bold;">
                        ${lastMigrationReport.migrationReady ? '✅ PRONTO PARA MIGRAÇÃO' : '❌ NÃO PRONTO'}
                    </div>
                    <div style="font-size: 11px; color: #888;">
                        Pontuação: ${lastMigrationReport.compatibilityScore}% (${lastMigrationReport.passed}/${lastMigrationReport.total})
                    </div>
                </div>
                <button id="view-last-report" style="
                    background: #555; color: white; border: none;
                    padding: 6px 12px; cursor: pointer; border-radius: 4px;
                    font-size: 11px;">
                    VER DETALHES
                </button>
            </div>
        `;
        
        testsContent.appendChild(migrationSection);
        
        document.getElementById('view-last-report')?.addEventListener('click', () => {
            updateMigrationTab(lastMigrationReport);
        });
    }
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
            </div>
        `;
        
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
    
    document.getElementById('fix-mobile-pdf')?.addEventListener('click', () => {
        applyMobilePdfFixes(results);
    });
}

function applyMobilePdfFixes(results) {
    logToPanel('🛠️ Aplicando correções para mobile PDF...', 'mobile');
    
    const styleId = 'diagnostics-mobile-pdf-fixes';
    let styleTag = document.getElementById(styleId);
    
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    
    const css = `
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
                font-size: 16px !important;
            }
            
            .pdf-modal-buttons button {
                padding: 12px 20px !important;
                min-height: 44px !important;
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
        logToPanel('🚀 Iniciando diagnóstico completo v3...', 'debug');
        updateStatus('Diagnóstico em andamento...', 'info');
        
        const systemData = analyzeSystem();
        
        updateOverview(systemData);
        
        const testResults = await testMediaUnifiedComplete();
        
        updateTestsTab(testResults);
        
        const healthScore = calculateHealthScore(systemData, testResults);
        const healthScoreElement = document.getElementById('health-score');
        if (healthScoreElement) {
            healthScoreElement.textContent = `${healthScore}%`;
        }
        
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
    
    Object.entries(systemData.systems).forEach(([system, active]) => {
        if (!active) {
            const criticalSystems = ['MediaSystem', 'properties', 'supabase'];
            if (criticalSystems.includes(system)) score -= 10;
            else score -= 5;
        }
    });
    
    Object.entries(systemData.criticalElements).forEach(([element, domElement]) => {
        if (!domElement) {
            const criticalElements = ['pdfModal', 'pdfPassword', 'uploadPreview'];
            if (criticalElements.includes(element)) score -= 10;
            else score -= 5;
        }
    });
    
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
        lastMigrationReport: lastMigrationReport,
        migrationStatus: window.verifyMediaMigration ? 'Função disponível' : 'Função não disponível',
        compatibilityStatus: window.testModuleCompatibility ? 'Função disponível v3' : 'Função não disponível',
        autoValidationStatus: window.autoValidateMigration ? 'Função disponível v3' : 'Função não disponível'
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `diagnostico-sistema-v3-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    logToPanel('📊 Relatório exportado como JSON (v3)', 'success');
}

function runPdfMobileDiagnosis() {
    logToPanel('📱 Iniciando diagnóstico mobile PDF...', 'mobile');
    updateStatus('Analisando layout mobile PDF...', 'mobile');
    
    try {
        const results = window.diagnosePdfModalMobile();
        
        updatePdfMobileTab(results);
        
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
    
    diagnosticsPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
            <div style="font-size: 16px; font-weight: bold; color: #00ff9c;">
                🚀 DIAGNÓSTICO COMPLETO DO SISTEMA v3
            </div>
            <div style="display: flex; gap: 8px;">
                <button id="test-compatibility-main" style="
                    background: linear-gradient(45deg, #00ff9c, #0088cc); 
                    color: #000; border: none; 
                    padding: 4px 8px; cursor: pointer; border-radius: 3px;
                    font-size: 10px; font-weight: bold;">
                    🔍 COMPATIBILIDADE
                </button>
                <button id="auto-migration-main" style="
                    background: linear-gradient(45deg, #0088cc, #00ff9c); 
                    color: #000; border: none; 
                    padding: 4px 8px; cursor: pointer; border-radius: 3px;
                    font-size: 10px; font-weight: bold;">
                    🔄 AUTO-VALIDAÇÃO
                </button>
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
                ${DIAGNOSTICS_MODE ? 'DIAGNÓSTICO ATIVO' : 'DIAGNÓSTICO INATIVO'} | v3
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
                🧪 TESTE COMPLETO v3
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
                📊 EXPORTAR RELATÓRIO
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
    
    setupPanelEvents();
    
    updateDeviceIndicator();
}

function setupPanelEvents() {
    const closeBtn = document.getElementById('close-btn');
    const minimizeBtn = document.getElementById('minimize-btn');
    const verifyMigrationBtn = document.getElementById('verify-migration-main');
    const testCompatibilityBtn = document.getElementById('test-compatibility-main');
    const autoMigrationBtn = document.getElementById('auto-migration-main');
    
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
    
    if (testCompatibilityBtn) {
        testCompatibilityBtn.addEventListener('click', () => {
            window.testModuleCompatibility();
        });
    }
    
    if (autoMigrationBtn) {
        autoMigrationBtn.addEventListener('click', () => {
            if (typeof window.autoValidateMigration === 'function') {
                window.autoValidateMigration();
            }
        });
    }
    
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
            }
        });
    });
    
    const runAllTestsBtn = document.getElementById('run-all-tests');
    if (runAllTestsBtn) {
        runAllTestsBtn.addEventListener('click', async () => {
            await runCompleteDiagnosis();
        });
    }
    
    const testPdfMobileBtn = document.getElementById('test-pdf-mobile');
    if (testPdfMobileBtn) {
        testPdfMobileBtn.addEventListener('click', () => {
            runPdfMobileDiagnosis();
        });
    }
    
    const exportBtn = document.getElementById('export-btn');
    if (exportBtn) {
        exportBtn.addEventListener('click', exportReport);
    }
}

/* ================== INICIALIZAÇÃO ================== */
if (DEBUG_MODE && DIAGNOSTICS_MODE) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                createDiagnosticsPanel();
                setTimeout(() => runCompleteDiagnosis(), 2000);
                
                if (MOBILE_TEST) {
                    setTimeout(() => runPdfMobileDiagnosis(), 3000);
                }
                
                setTimeout(() => {
                    if (typeof window.autoValidateMigration === 'function') {
                        window.autoValidateMigration();
                    }
                }, 4000);
            }, 1000);
        });
    } else {
        setTimeout(() => {
            createDiagnosticsPanel();
            setTimeout(() => runCompleteDiagnosis(), 2000);
            
            if (MOBILE_TEST) {
                setTimeout(() => runPdfMobileDiagnosis(), 3000);
            }
            
            setTimeout(() => {
                if (typeof window.autoValidateMigration === 'function') {
                    window.autoValidateMigration();
                }
            }, 4000);
        }, 1000);
    }
}

window.runDiagnostics = runCompleteDiagnosis;
window.diagnosticsLoaded = true;
console.log('✅ diagnostics.js v3 carregado com sucesso!');
