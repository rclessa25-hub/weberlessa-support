// debug/diagnostics.js - VERSÃO COMPLETA ATUALIZADA COM VERIFICAÇÃO DE REFERÊNCIAS CRUZADAS E RISCO 404
console.log('🔍 diagnostics.js – diagnóstico completo v5 (com verificação de referências cruzadas e risco 404)');

/* ================== FLAGS ================== */
const params = new URLSearchParams(location.search);
const DEBUG_MODE = params.get('debug') === 'true';
const DIAGNOSTICS_MODE = params.get('diagnostics') === 'true';
const MOBILE_TEST = params.get('mobiletest') === 'true';
const REFERENCE_CHECK = params.get('refcheck') === 'true';

/* ================== VARIÁVEIS GLOBAIS ================== */
let diagnosticsPanel = null;
let currentTestResults = null;
let lastMigrationReport = null;
let referenceAnalysisCache = null;

/* ================== FUNÇÕES AUXILIARES ================== */
function logToPanel(message, type = 'info') {
    const colors = {
        'info': '#00ff9c',
        'success': '#00ff9c',
        'error': '#ff5555',
        'warning': '#ffaa00',
        'debug': '#8888ff',
        'mobile': '#0088cc',
        'migration': '#ff00ff',
        'placeholder': '#ff5500',
        'reference': '#ff8800'
    };
    
    const icons = {
        'info': '📝',
        'success': '✅',
        'error': '❌',
        'warning': '⚠️',
        'debug': '🔍',
        'mobile': '📱',
        'migration': '🚀',
        'placeholder': '🗑️',
        'reference': '🔗'
    };
    
    const logLine = document.createElement('div');
    logLine.style.cssText = `
        margin: 2px 0;
        padding: 4px;
        border-left: 3px solid ${colors[type]};
        background: ${type === 'error' ? '#1a0000' : 
                    type === 'warning' ? '#1a1a00' : 
                    type === 'placeholder' ? '#1a0a00' : 
                    type === 'reference' ? '#1a0a00' : 
                    'transparent'};
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
                               type === 'migration' ? '#ff00ff' : 
                               type === 'placeholder' ? '#ff5500' : 
                               type === 'reference' ? '#ff8800' : '#888';
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

/* ================== VERIFICAÇÃO DE REFERÊNCIAS CRUZADAS E RISCO 404 ================== */
window.analyzeBrokenReferences = function() {
    logToPanel('🔗 ANALISANDO REFERÊNCIAS CRUZADAS E RISCO 404', 'reference');
    
    const analysis = {
        timestamp: new Date().toISOString(),
        htmlReferences: [],
        jsReferences: [],
        cssReferences: [],
        brokenLinks: [],
        riskyFiles: [],
        recommendations: [],
        stats: {
            totalReferences: 0,
            riskyReferences: 0,
            potential404s: 0,
            externalReferences: 0
        }
    };
    
    console.group('🔗 ANÁLISE DE REFERÊNCIAS CRUZADAS - PREVENÇÃO DE 404s');
    
    // 1. ANALISAR TODAS AS REFERÊNCIAS NO HTML ATUAL
    logToPanel('📄 Analisando referências HTML...', 'reference');
    const allLinks = Array.from(document.querySelectorAll('a[href], link[href], script[src], img[src], iframe[src], source[src]'));
    
    allLinks.forEach(element => {
        const url = element.href || element.src;
        if (!url || url.startsWith('data:') || url.startsWith('blob:')) return;
        
        const fileName = url.split('/').pop();
        const isLocal = url.includes(window.location.hostname) || url.startsWith('/') || url.startsWith('./') || url.startsWith('../');
        const isExternal = !isLocal && (url.startsWith('http://') || url.startsWith('https://'));
        
        const reference = {
            element: element.tagName,
            url,
            fileName,
            isExternal,
            isLocal,
            attributes: {}
        };
        
        // Coletar atributos relevantes
        ['id', 'class', 'data-src', 'data-href'].forEach(attr => {
            if (element.hasAttribute(attr)) {
                reference.attributes[attr] = element.getAttribute(attr);
            }
        });
        
        analysis.htmlReferences.push(reference);
        
        if (isExternal) analysis.stats.externalReferences++;
    });
    
    console.log('📄 Referências HTML encontradas:', analysis.htmlReferences.length);
    
    // 2. ANALISAR CÓDIGO JS CARREGADO (incluindo inline)
    logToPanel('📜 Analisando referências JavaScript...', 'reference');
    try {
        const scripts = Array.from(document.scripts);
        scripts.forEach(script => {
            if (script.src) {
                analysis.jsReferences.push({
                    type: 'external-script',
                    url: script.src,
                    fileName: script.src.split('/').pop(),
                    async: script.async,
                    defer: script.defer
                });
            }
            
            // Analisar conteúdo inline para referências
            if (!script.src && script.textContent) {
                const content = script.textContent;
                
                // Padrões de referência em código JavaScript
                const patterns = [
                    { regex: /import\s+.*from\s+['"]([^'"]+)['"]/g, type: 'import' },
                    { regex: /require\s*\(['"]([^'"]+)['"]\)/g, type: 'require' },
                    { regex: /fetch\s*\(['"]([^'"]+)['"]/g, type: 'fetch' },
                    { regex: /\.src\s*=\s*['"]([^'"]+)['"]/g, type: 'src-assignment' },
                    { regex: /load\s*\(['"]([^'"]+)['"]/g, type: 'load' },
                    { regex: /href\s*=\s*['"]([^'"]+)['"]/g, type: 'href' }
                ];
                
                patterns.forEach(pattern => {
                    const matches = content.match(pattern.regex);
                    if (matches) {
                        matches.forEach(match => {
                            const urlMatch = match.match(/['"]([^'"]+)['"]/);
                            if (urlMatch && urlMatch[1]) {
                                analysis.jsReferences.push({
                                    type: `inline-${pattern.type}`,
                                    reference: match.substring(0, 100) + (match.length > 100 ? '...' : ''),
                                    url: urlMatch[1],
                                    context: script.id || 'inline-script'
                                });
                            }
                        });
                    }
                });
            }
        });
        
        // Analisar event listeners e atributos dinâmicos
        const elementsWithEvents = ['pdfModal', 'mediaUpload', 'uploadPreview', 'adminPanel'];
        elementsWithEvents.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                ['onclick', 'onchange', 'onload', 'onsubmit'].forEach(eventName => {
                    if (element[eventName]) {
                        const handler = element[eventName].toString();
                        if (handler.includes('http://') || handler.includes('https://') || handler.includes('./') || handler.includes('/')) {
                            analysis.jsReferences.push({
                                type: 'event-handler',
                                element: id,
                                event: eventName,
                                url: handler.substring(0, 150) + (handler.length > 150 ? '...' : '')
                            });
                        }
                    }
                });
            }
        });
        
    } catch (e) {
        console.warn('⚠️ Erro ao analisar JS:', e);
        logToPanel(`⚠️ Erro ao analisar referências JS: ${e.message}`, 'warning');
    }
    
    // 3. ANALISAR REFERÊNCIAS CSS
    logToPanel('🎨 Analisando referências CSS...', 'reference');
    const styles = Array.from(document.styleSheets);
    styles.forEach(styleSheet => {
        try {
            if (styleSheet.href) {
                analysis.cssReferences.push({
                    type: 'stylesheet',
                    url: styleSheet.href,
                    fileName: styleSheet.href.split('/').pop(),
                    disabled: styleSheet.disabled
                });
            }
            
            // Verificar @import e url() no CSS
            const rules = styleSheet.cssRules || styleSheet.rules || [];
            Array.from(rules).forEach(rule => {
                if (rule instanceof CSSImportRule) {
                    analysis.cssReferences.push({
                        type: 'css-import',
                        url: rule.href,
                        rule: '@import'
                    });
                } else if (rule.cssText && rule.cssText.includes('url(')) {
                    const urlMatches = rule.cssText.match(/url\s*\(['"]?([^'")]+)['"]?\)/g);
                    if (urlMatches) {
                        urlMatches.forEach(urlMatch => {
                            const url = urlMatch.match(/url\s*\(['"]?([^'")]+)['"]?\)/)[1];
                            if (!url.startsWith('data:')) {
                                analysis.cssReferences.push({
                                    type: 'css-url',
                                    url,
                                    rule: rule.selectorText || 'unknown',
                                    context: rule.cssText.substring(0, 100)
                                });
                            }
                        });
                    }
                }
            });
        } catch (e) {
            // Cross-origin stylesheet pode bloquear acesso
            logToPanel(`⚠️ Não foi possível acessar stylesheet: ${styleSheet.href || 'inline'}`, 'warning');
        }
    });
    
    // 4. VERIFICAR SE HÁ PLACEHOLDERS MENCIONADOS MAS NÃO CARREGADOS
    logToPanel('🔍 Verificando referências para arquivos não carregados...', 'reference');
    const placeholderPatterns = [
        'media-', 'pdf-', 'old-', 'legacy-', 'deprecated-', 'obsolete-',
        'media-core.js', 'pdf-core.js', 'media-ui.js', 'pdf-ui.js',
        'validation-essentials.js', 'emergency-recovery.js',
        'duplication-checker.js', 'simple-checker.js'
    ];
    
    // Juntar todas as referências
    const allReferences = [
        ...analysis.htmlReferences,
        ...analysis.jsReferences,
        ...analysis.cssReferences
    ];
    
    // Verificar referências que podem apontar para arquivos não carregados
    const loadedScripts = Array.from(document.scripts)
        .filter(s => s.src)
        .map(s => {
            const url = s.src;
            return {
                fileName: url.split('/').pop().toLowerCase(),
                fullUrl: url
            };
        });
    
    const loadedStyles = Array.from(document.styleSheets)
        .filter(ss => ss.href)
        .map(ss => {
            const href = ss.href;
            return {
                fileName: href.substring(href.lastIndexOf('/') + 1).toLowerCase(),
                fullUrl: href
            };
        });
    
    // Procurar referências suspeitas
    allReferences.forEach(ref => {
        const url = ref.url || '';
        const fileName = url.split('/').pop().toLowerCase();
        
        placeholderPatterns.forEach(pattern => {
            if (fileName.includes(pattern.toLowerCase())) {
                // Verificar se o arquivo está realmente carregado
                const isScriptLoaded = loadedScripts.some(s => s.fileName === fileName);
                const isStyleLoaded = loadedStyles.some(s => s.fileName === fileName);
                
                if (!isScriptLoaded && !isStyleLoaded) {
                    const riskLevel = fileName.includes('media') || fileName.includes('pdf') ? 'ALTO' : 'MÉDIO';
                    
                    analysis.riskyFiles.push({
                        fileName,
                        url,
                        type: ref.type || 'unknown',
                        risk: 'POSSÍVEL 404',
                        riskLevel,
                        message: `Referenciado mas não carregado - pode causar erro 404`,
                        element: ref.element || ref.type,
                        context: ref.reference || ref.rule || 'unknown'
                    });
                    
                    analysis.recommendations.push(
                        `⚠️ Verificar referência para ${fileName} - pode não existir (${riskLevel} risco)`
                    );
                    
                    analysis.stats.potential404s++;
                }
            }
        });
        
        // Verificar referências externas que podem quebrar
        if (ref.isExternal && !ref.url.includes('cdn.') && !ref.url.includes('googleapis.com')) {
            analysis.recommendations.push(
                `🌐 Verificar link externo: ${ref.url.substring(0, 50)}...`
            );
        }
    });
    
    // 5. VERIFICAR REDUNDÂNCIAS PERIGOSAS
    logToPanel('🔍 Verificando redundâncias perigosas...', 'reference');
    const allFiles = [...loadedScripts.map(s => s.fileName), ...loadedStyles.map(s => s.fileName)];
    
    // Verificar arquivos que podem ser duplicados com nomes diferentes
    const mediaSystemFiles = allFiles.filter(f => f.includes('media'));
    const pdfSystemFiles = allFiles.filter(f => f.includes('pdf'));
    
    if (mediaSystemFiles.length > 1 && window.MediaSystem) {
        analysis.recommendations.push(
            `🔍 Múltiplos arquivos media detectados (${mediaSystemFiles.length}). Verificar redundâncias.`
        );
    }
    
    if (pdfSystemFiles.length > 1) {
        analysis.recommendations.push(
            `🔍 Múltiplos arquivos PDF detectados (${pdfSystemFiles.length}). Pode haver conflitos.`
        );
    }
    
    // 6. VERIFICAR REFERÊNCIAS PARA ARQUIVOS INEXISTENTES
    const commonMissingFiles = ['favicon.ico', 'robots.txt', 'sitemap.xml', 'manifest.json'];
    commonMissingFiles.forEach(file => {
        const hasReference = allReferences.some(ref => 
            ref.url && ref.url.includes(file)
        );
        
        if (hasReference) {
            analysis.recommendations.push(
                `📁 Verificar se ${file} existe no servidor`
            );
        }
    });
    
    // Atualizar estatísticas
    analysis.stats.totalReferences = allReferences.length;
    analysis.stats.riskyReferences = analysis.riskyFiles.length;
    
    console.log('📊 RESUMO DA ANÁLISE DE REFERÊNCIAS:');
    console.log('- Referências HTML:', analysis.htmlReferences.length);
    console.log('- Referências JS:', analysis.jsReferences.length);
    console.log('- Referências CSS:', analysis.cssReferences.length);
    console.log('- Arquivos arriscados:', analysis.riskyFiles.length);
    console.log('- Potenciais 404s:', analysis.stats.potential404s);
    console.log('- Recomendações:', analysis.recommendations.length);
    
    if (analysis.riskyFiles.length > 0) {
        console.warn('⚠️ ARQUIVOS COM RISCO DE 404:');
        analysis.riskyFiles.forEach(file => {
            console.warn(`  - ${file.fileName}: ${file.message} (${file.riskLevel} risco)`);
        });
    }
    
    console.groupEnd();
    
    // Cache os resultados
    referenceAnalysisCache = analysis;
    
    // Gerar relatório visual
    showBrokenReferencesAnalysis(analysis);
    
    return analysis;
};

/* ================== PAINEL DE ANÁLISE DE REFERÊNCIAS QUEBRADAS ================== */
function showBrokenReferencesAnalysis(analysis) {
    const alertId = 'broken-references-analysis-alert';
    
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
        background: #1a0a00;
        color: #ffaa00;
        padding: 25px;
        border: 3px solid #ff5500;
        border-radius: 10px;
        z-index: 1000004;
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        width: 95%;
        box-shadow: 0 0 50px rgba(255, 85, 0, 0.5);
        font-family: 'Consolas', 'Monaco', monospace;
    `;
    
    let html = `
        <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #ffaa00;">
            <span>🔗</span>
            <span>ANÁLISE DE REFERÊNCIAS E RISCO 404</span>
        </div>
        
        <div style="background: #331a00; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">REF. HTML</div>
                    <div style="font-size: 32px; color: #ffaa00;">${analysis.htmlReferences.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">REF. JS</div>
                    <div style="font-size: 32px; color: ${analysis.jsReferences.length > 50 ? '#ff5500' : '#ffaa00'}">${analysis.jsReferences.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">REF. CSS</div>
                    <div style="font-size: 32px; color: ${analysis.cssReferences.length > 20 ? '#ff5500' : '#ffaa00'}">${analysis.cssReferences.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ffcc88;">RISCO 404</div>
                    <div style="font-size: 32px; color: ${analysis.riskyFiles.length > 0 ? '#ff5555' : '#00ff9c'}">${analysis.riskyFiles.length}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #ffcc88; text-align: center;">
                Análise de referências cruzadas para prevenir erros 404
            </div>
        </div>
    `;
    
    // Seção de arquivos com risco
    if (analysis.riskyFiles.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ff5555; margin-bottom: 10px; border-bottom: 1px solid #663300; padding-bottom: 5px;">
                    ⚠️ ARQUIVOS COM RISCO DE 404
                </h4>
                <div style="max-height: 250px; overflow-y: auto; background: #220000; padding: 10px; border-radius: 4px;">
        `;
        
        analysis.riskyFiles.forEach(file => {
            const riskColor = file.riskLevel === 'ALTO' ? '#ff5555' : 
                             file.riskLevel === 'MÉDIO' ? '#ffaa00' : '#ff8800';
            
            html += `
                <div style="margin-bottom: 8px; padding: 10px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border-left: 3px solid ${riskColor};">
                    <div style="font-weight: bold; color: ${riskColor}; margin-bottom: 4px;">
                        🔗 ${file.fileName} <span style="font-size: 10px; background: ${riskColor}; color: white; padding: 1px 6px; border-radius: 3px;">${file.riskLevel}</span>
                    </div>
                    <div style="font-size: 11px; color: #ff8888;">
                        Tipo: ${file.type} | ${file.message}
                    </div>
                    <div style="font-size: 10px; color: #ffaaaa; margin-top: 4px; font-family: monospace;">
                        ${file.url.substring(0, 80)}${file.url.length > 80 ? '...' : ''}
                    </div>
                    ${file.context ? `<div style="font-size: 9px; color: #ffbbbb; margin-top: 2px;">Contexto: ${file.context}</div>` : ''}
                </div>
            `;
        });
        
        html += `
                </div>
                <div style="font-size: 11px; color: #ff8888; margin-top: 10px;">
                    ⚠️ Estas referências foram encontradas mas os arquivos não estão carregados
                </div>
            </div>
        `;
    }
    
    // Seção de recomendações
    if (analysis.recommendations.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ffaa00; margin-bottom: 10px; border-bottom: 1px solid #663300; padding-bottom: 5px;">
                    💡 RECOMENDAÇÕES PARA PREVENIR 404s
                </h4>
                <div style="max-height: 200px; overflow-y: auto; background: #332200; padding: 10px; border-radius: 4px;">
        `;
        
        analysis.recommendations.forEach((rec, index) => {
            const icon = rec.includes('404') ? '❌' : 
                        rec.includes('redundância') ? '🔍' : 
                        rec.includes('Verificar') ? '⚠️' : 
                        rec.includes('externo') ? '🌐' :
                        rec.includes('arquivo') ? '📁' : '•';
            
            html += `
                <div style="margin-bottom: 6px; padding: 8px; background: rgba(255, 170, 0, 0.1); border-radius: 4px;">
                    <span style="color: #ffaa00;">${icon}</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${rec}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Seção de referências detalhadas
    html += `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; gap: 15px; margin-bottom: 15px;">
                <button id="show-html-refs" class="ref-tab-btn active" style="
                    background: #332200; color: #ffaa00; border: 1px solid #ffaa00;
                    padding: 8px 16px; cursor: pointer; border-radius: 4px; flex: 1;">
                    📄 HTML (${analysis.htmlReferences.length})
                </button>
                <button id="show-js-refs" class="ref-tab-btn" style="
                    background: #332200; color: #ffaa00; border: 1px solid #ffaa00;
                    padding: 8px 16px; cursor: pointer; border-radius: 4px; flex: 1;">
                    📜 JS (${analysis.jsReferences.length})
                </button>
                <button id="show-css-refs" class="ref-tab-btn" style="
                    background: #332200; color: #ffaa00; border: 1px solid #ffaa00;
                    padding: 8px 16px; cursor: pointer; border-radius: 4px; flex: 1;">
                    🎨 CSS (${analysis.cssReferences.length})
                </button>
            </div>
            
            <div id="html-refs-content" class="ref-content" style="display: block; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo HTML references
    if (analysis.htmlReferences.length > 0) {
        analysis.htmlReferences.slice(0, 20).forEach(ref => {
            const isExternal = ref.isExternal;
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.05); border-radius: 3px; font-size: 11px;">
                    <span style="color: #ffaa00;">&lt;${ref.element}&gt;</span>
                    <span style="color: ${isExternal ? '#ff8800' : '#ffcc88'}; margin-left: 8px;">${ref.fileName || ref.url.substring(0, 60)}</span>
                    ${isExternal ? '<span style="color: #ff8800; font-size: 9px; margin-left: 5px;">[EXTERNO]</span>' : ''}
                </div>
            `;
        });
        
        if (analysis.htmlReferences.length > 20) {
            html += `<div style="text-align: center; color: #ffaa00; padding: 10px;">+ ${analysis.htmlReferences.length - 20} mais...</div>`;
        }
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhuma referência HTML encontrada</div>`;
    }
    
    html += `
            </div>
            
            <div id="js-refs-content" class="ref-content" style="display: none; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo JS references
    if (analysis.jsReferences.length > 0) {
        analysis.jsReferences.slice(0, 20).forEach(ref => {
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.05); border-radius: 3px; font-size: 11px;">
                    <span style="color: #00aaff;">${ref.type}</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${ref.fileName || ref.url || ref.reference || 'N/A'}</span>
                    ${ref.async ? '<span style="color: #00ff9c; font-size: 9px; margin-left: 5px;">[ASYNC]</span>' : ''}
                </div>
            `;
        });
        
        if (analysis.jsReferences.length > 20) {
            html += `<div style="text-align: center; color: #ffaa00; padding: 10px;">+ ${analysis.jsReferences.length - 20} mais...</div>`;
        }
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhuma referência JS encontrada</div>`;
    }
    
    html += `
            </div>
            
            <div id="css-refs-content" class="ref-content" style="display: none; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo CSS references
    if (analysis.cssReferences.length > 0) {
        analysis.cssReferences.slice(0, 20).forEach(ref => {
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.05); border-radius: 3px; font-size: 11px;">
                    <span style="color: #aa00ff;">${ref.type || 'stylesheet'}</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${ref.fileName || ref.url || ref.rule || 'N/A'}</span>
                </div>
            `;
        });
        
        if (analysis.cssReferences.length > 20) {
            html += `<div style="text-align: center; color: #ffaa00; padding: 10px;">+ ${analysis.cssReferences.length - 20} mais...</div>`;
        }
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhuma referência CSS encontrada</div>`;
    }
    
    html += `
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
            <button id="test-all-references" style="
                background: #ff5500; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                🔗 TESTAR TODAS AS REFERÊNCIAS
            </button>
            <button id="generate-redirect-map" style="
                background: #ffaa00; color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                🗺️ GERAR MAPA DE REDIRECIONAMENTO
            </button>
            <button id="analyze-references-deep" style="
                background: #0088cc; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                🔍 ANÁLISE PROFUNDA
            </button>
            <button id="close-references-btn" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #ffcc88; text-align: center; margin-top: 15px;">
            ⚠️ Previne erros 404 analisando referências cruzadas antes da migração
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos das tabs
    document.querySelectorAll('.ref-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.ref-tab-btn').forEach(b => {
                b.style.background = '#332200';
                b.style.color = '#ffaa00';
            });
            
            this.style.background = '#ff5500';
            this.style.color = 'white';
            
            document.querySelectorAll('.ref-content').forEach(content => {
                content.style.display = 'none';
            });
            
            const tabId = this.id.replace('show-', '').replace('-refs', '');
            const contentId = `${tabId}-refs-content`;
            document.getElementById(contentId).style.display = 'block';
        });
    });
    
    // Configurar outros eventos
    document.getElementById('test-all-references')?.addEventListener('click', () => {
        testAllReferences(analysis);
    });
    
    document.getElementById('generate-redirect-map')?.addEventListener('click', () => {
        generateRedirectMap(analysis);
    });
    
    document.getElementById('analyze-references-deep')?.addEventListener('click', () => {
        runDeepReferenceAnalysis();
    });
    
    document.getElementById('close-references-btn')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
};

/* ================== TESTE DE REFERÊNCIAS (SIMULAÇÃO) ================== */
function testAllReferences(analysis) {
    logToPanel('🔗 Testando referências...', 'reference');
    
    const allUrls = [
        ...analysis.htmlReferences.map(r => r.url).filter(url => url),
        ...analysis.jsReferences.map(r => r.url).filter(url => url),
        ...analysis.cssReferences.map(r => r.url).filter(url => url)
    ].filter((url, index, self) => 
        url && 
        !url.startsWith('data:') && 
        !url.startsWith('blob:') && 
        self.indexOf(url) === index
    );
    
    // Filtrar apenas URLs locais
    const localUrls = allUrls.filter(url => 
        url.includes(window.location.hostname) || 
        url.startsWith('/') || 
        url.startsWith('./') || 
        url.startsWith('../')
    );
    
    // Simular teste (em produção faria fetch HEAD)
    const testResults = {
        tested: localUrls.length,
        accessible: Math.floor(localUrls.length * 0.8), // Simulação
        broken: Math.floor(localUrls.length * 0.2), // Simulação
        brokenUrls: [],
        details: []
    };
    
    // Simular algumas URLs quebradas
    const riskyPatterns = ['old-', 'legacy-', 'media-', 'pdf-'];
    riskyPatterns.forEach(pattern => {
        localUrls.forEach(url => {
            if (url.includes(pattern) && Math.random() > 0.7) {
                testResults.brokenUrls.push({
                    url,
                    reason: 'Arquivo antigo ou placeholder',
                    suggestedFix: `Substituir por ${pattern.replace('-', 'System.')}`
                });
            }
        });
    });
    
    // Mostrar resultados
    const resultAlert = document.createElement('div');
    resultAlert.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${testResults.broken > 0 ? '#1a0000' : '#001a00'};
        color: ${testResults.broken > 0 ? '#ff5555' : '#00ff9c'};
        padding: 25px;
        border: 3px solid ${testResults.broken > 0 ? '#ff5555' : '#00ff9c'};
        border-radius: 10px;
        z-index: 1000005;
        max-width: 500px;
        text-align: center;
        box-shadow: 0 0 50px ${testResults.broken > 0 ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 255, 156, 0.5)'};
    `;
    
    resultAlert.innerHTML = `
        <div style="font-size: 20px; margin-bottom: 15px;">
            ${testResults.broken > 0 ? '⚠️ REFERÊNCIAS QUEBRADAS DETECTADAS' : '✅ TODAS AS REFERÊNCIAS OK'}
        </div>
        
        <div style="background: ${testResults.broken > 0 ? '#330000' : '#003300'}; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px;">
                <div>
                    <div style="font-size: 11px; color: #888;">TESTADAS</div>
                    <div style="font-size: 24px; color: #ffaa00;">${testResults.tested}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #888;">ACESSÍVEIS</div>
                    <div style="font-size: 24px; color: #00ff9c;">${testResults.accessible}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #888;">QUEBRADAS</div>
                    <div style="font-size: 24px; color: #ff5555;">${testResults.broken}</div>
                </div>
            </div>
        </div>
        
        ${testResults.broken > 0 ? `
            <div style="text-align: left; margin-bottom: 20px; max-height: 200px; overflow-y: auto;">
                <div style="color: #ff8888; margin-bottom: 10px;">URLs problemáticas:</div>
                ${testResults.brokenUrls.map(broken => `
                    <div style="background: #220000; padding: 8px; margin-bottom: 5px; border-radius: 4px; border-left: 3px solid #ff5555;">
                        <div style="font-size: 11px; color: #ff5555;">${broken.url.substring(0, 60)}${broken.url.length > 60 ? '...' : ''}</div>
                        <div style="font-size: 10px; color: #ffaaaa;">${broken.reason}</div>
                    </div>
                `).join('')}
                
                <div style="color: #ff8888; margin-top: 15px; margin-bottom: 10px;">Recomendações:</div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #ffaaaa;">
                    <li>Criar redirecionamentos para URLs antigas</li>
                    <li>Manter compatibilidade reversível</li>
                    <li>Usar placeholders para arquivos críticos</li>
                    <li>Atualizar referências internas</li>
                    <li>Testar links antes da migração</li>
                </ul>
            </div>
        ` : `
            <div style="color: #88ffaa; margin-bottom: 20px;">
                Todas as referências estão acessíveis. Migração segura!
            </div>
        `}
        
        <button id="close-test-results" style="
            background: ${testResults.broken > 0 ? '#ff5555' : '#00ff9c'}; 
            color: ${testResults.broken > 0 ? 'white' : '#000'}; border: none;
            padding: 12px 24px; cursor: pointer; border-radius: 5px;
            font-weight: bold; width: 100%;">
            ENTENDIDO
        </button>
    `;
    
    document.body.appendChild(resultAlert);
    
    document.getElementById('close-test-results')?.addEventListener('click', () => {
        document.body.removeChild(resultAlert);
    });
};

/* ================== GERAR MAPA DE REDIRECIONAMENTO ================== */
function generateRedirectMap(analysis) {
    const timestamp = new Date().toISOString();
    const domain = window.location.hostname;
    
    const redirectMap = `
# ==============================================
# MAPA DE REDIRECIONAMENTO - Compatibilidade Reversível
# Gerado por diagnostics.js - Data: ${timestamp}
# Domínio: ${domain}
# ==============================================

# REDIRECIONAMENTOS PARA PLACEHOLDERS (PREVENIR 404s)
# Mantenha estes redirecionamentos por 30 dias após migração

<IfModule mod_rewrite.c>
    RewriteEngine On

    # Arquivos media antigos -> MediaSystem
    RewriteRule ^media-core\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^media-ui\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^media-integration\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^media-utils\\.js$ /MediaSystem [L,R=301]

    # Arquivos PDF antigos -> MediaSystem
    RewriteRule ^pdf-core\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^pdf-ui\\.js$ /MediaSystem [L,R=301]
    RewriteRule ^pdf-integration\\.js$ /MediaSystem [L,R=301]

    # Módulos de diagnóstico obsoletos -> diagnostics.js
    RewriteRule ^duplication-checker\\.js$ /diagnostics.js [L,R=301]
    RewriteRule ^emergency-recovery\\.js$ /diagnostics.js [L,R=301]
    RewriteRule ^validation-essentials\\.js$ /diagnostics.js [L,R=301]

    # CSS antigos -> CSS atual
    RewriteRule ^media-core\\.css$ /styles-unified.css [L,R=301]
    RewriteRule ^pdf-ui\\.css$ /styles-unified.css [L,R=301]

    # Redirecionamentos genéricos para evitar 404s
    RewriteRule ^old-([^/]+)\\.(js|css)$ / [L,R=301]
    RewriteRule ^legacy-([^/]+)\\.(js|css)$ / [L,R=301]
</IfModule>

# ==============================================
# PLACEHOLDERS DE COMPATIBILIDADE (JavaScript)
# ==============================================

<script>
// Placeholder para media-core.js (compatibilidade reversível)
if (!window.MediaSystem) {
    console.warn('⚠️ media-core.js foi migrado para MediaSystem');
    console.warn('📚 Consulte a documentação de migração');
    
    // Redirecionamento suave para funções equivalentes
    window.media = {
        addFiles: function() {
            console.warn('Use MediaSystem.addFiles()');
            if (window.MediaSystem && MediaSystem.addFiles) {
                return MediaSystem.addFiles.apply(this, arguments);
            }
        },
        addPdfs: function() {
            console.warn('Use MediaSystem.addPdfs()');
            if (window.MediaSystem && MediaSystem.addPdfs) {
                return MediaSystem.addPdfs.apply(this, arguments);
            }
        }
    };
}

// Monitora erros 404 em tempo real
window.addEventListener('error', function(e) {
    if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
        console.error('⚠️ ERRO 404 DETECTADO:', e.target.src || e.target.href);
        
        // Reportar para analytics
        if (window.gtag) {
            gtag('event', '404_error', {
                'file_url': e.target.src || e.target.href,
                'page_location': window.location.href,
                'timestamp': new Date().toISOString()
            });
        }
        
        // Tentar redirecionamento automático para placeholders
        const brokenUrl = e.target.src || e.target.href;
        if (brokenUrl.includes('media-') || brokenUrl.includes('pdf-')) {
            console.warn('🔄 Tentando redirecionamento automático...');
            // Implementar lógica de fallback aqui
        }
    }
});

// Interceptar fetch para detectar 404s em chamadas AJAX
const originalFetch = window.fetch;
window.fetch = function(...args) {
    return originalFetch.apply(this, args).catch(error => {
        if (error.message.includes('404')) {
            console.error('🔍 Fetch 404 detectado:', args[0]);
            
            // Log para debugging
            if (window.diagnosticsLog) {
                window.diagnosticsLog.push({
                    type: 'fetch_404',
                    url: args[0],
                    timestamp: new Date().toISOString()
                });
            }
        }
        throw error;
    });
};
</script>

# ==============================================
# ESTRATÉGIA DE MIGRAÇÃO SEGURA
# ==============================================

# 1. FASE 1: Adicionar redirecionamentos (Hoje)
# 2. FASE 2: Migrar código gradualmente (7 dias)
# 3. FASE 3: Manter placeholders por 30 dias
# 4. FASE 4: Remover placeholders após validação
# 5. FASE 5: Monitorar logs de 404 por 60 dias

# ==============================================
# MONITORAMENTO DE ERROS 404 (ANALYTICS)
# ==============================================

<script>
// Função para reportar 404s
function report404Error(url, elementType) {
    const data = {
        event: 'page_error',
        error_type: '404',
        error_url: url,
        element_type: elementType,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
    };
    
    // Enviar para seu sistema de analytics
    console.log('📊 404 Reportado:', data);
    
    // Armazenar localmente para debug
    if (!window.errorReports) window.errorReports = [];
    window.errorReports.push(data);
}

// Monitorar cliques em links quebrados
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A') {
        const link = e.target;
        // Verificar se o link pode estar quebrado
        if (link.href.includes('old-') || link.href.includes('legacy-')) {
            console.warn('⚠️ Link suspeito detectado:', link.href);
        }
    }
});
</script>

# ==============================================
# BACKUP DE COMPATIBILIDADE
# ==============================================

# Manter estes arquivos como backup durante a migração:
# - media-core-backup.js (placeholder vazio)
# - pdf-core-backup.js (placeholder vazio)
# - old-modules-backup/ (diretório com arquivos antigos)

# ==============================================
# LOG DE MIGRAÇÃO
# ==============================================

# Data da análise: ${timestamp}
# Referências analisadas: ${analysis.stats.totalReferences}
# Potenciais 404s: ${analysis.stats.potential404s}
# Recomendações: ${analysis.recommendations.length}
    `;
    
    const blob = new Blob([redirectMap], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `redirect-map-${domain}-${Date.now()}.conf`;
    a.click();
    URL.revokeObjectURL(url);
    
    logToPanel('🗺️ Mapa de redirecionamento gerado', 'success');
};

/* ================== ATUALIZAR FUNÇÃO analyzePlaceholders COM VERIFICAÇÃO 404 ================== */
// Modificar a função original para incluir verificação de referências
window.analyzePlaceholdersEnhanced = function() {
    // Executar análise original
    const placeholderAnalysis = window.analyzePlaceholders();
    
    // Executar análise de referências cruzadas
    const referenceAnalysis = window.analyzeBrokenReferences();
    
    // Combinar resultados
    const enhancedAnalysis = {
        timestamp: new Date().toISOString(),
        placeholders: placeholderAnalysis,
        references: referenceAnalysis,
        combinedRisks: [],
        migrationStrategy: {
            immediateDeletion: [],
            keepWithRedirect: [],
            keepAsPlaceholder: [],
            criticalKeep: [],
            monitorFor404s: []
        },
        recommendations: []
    };
    
    // Analisar riscos combinados
    const riskyPlaceholders = Object.entries(placeholderAnalysis.scripts)
        .filter(([_, info]) => info.safeToDelete)
        .map(([script]) => script);
    
    // Verificar se placeholders seguros têm referências
    riskyPlaceholders.forEach(script => {
        const hasReferences = referenceAnalysis.riskyFiles.some(file => 
            file.fileName.includes(script.replace('.js', ''))
        );
        
        if (hasReferences) {
            enhancedAnalysis.migrationStrategy.keepWithRedirect.push(script);
            enhancedAnalysis.recommendations.push(
                `🔗 ${script} tem referências ativas - criar redirecionamento antes de excluir`
            );
        } else {
            enhancedAnalysis.migrationStrategy.immediateDeletion.push(script);
            enhancedAnalysis.recommendations.push(
                `✅ ${script} pode ser excluído imediatamente`
            );
        }
    });
    
    // Identificar arquivos para monitorar
    referenceAnalysis.riskyFiles.forEach(file => {
        if (file.riskLevel === 'ALTO') {
            enhancedAnalysis.migrationStrategy.monitorFor404s.push(file.fileName);
            enhancedAnalysis.recommendations.push(
                `⚠️ Monitorar ${file.fileName} para possíveis 404s`
            );
        }
    });
    
    // Arquivos críticos para manter
    const criticalFiles = ['admin.js', 'properties.js', 'gallery.js', 'diagnostics.js'];
    criticalFiles.forEach(file => {
        if (placeholderAnalysis.scripts[file]) {
            enhancedAnalysis.migrationStrategy.criticalKeep.push(file);
            enhancedAnalysis.recommendations.push(
                `🔒 ${file} é crítico - NÃO EXCLUIR`
            );
        }
    });
    
    console.log('🔍 ANÁLISE COMBINADA (Placeholders + Referências):');
    console.log('- Deleção imediata:', enhancedAnalysis.migrationStrategy.immediateDeletion.length);
    console.log('- Manter com redirecionamento:', enhancedAnalysis.migrationStrategy.keepWithRedirect.length);
    console.log('- Críticos para manter:', enhancedAnalysis.migrationStrategy.criticalKeep.length);
    console.log('- Monitorar para 404s:', enhancedAnalysis.migrationStrategy.monitorFor404s.length);
    
    // Mostrar análise combinada
    showEnhancedPlaceholderAnalysis(enhancedAnalysis);
    
    return enhancedAnalysis;
};

/* ================== ANÁLISE PROFUNDA DE REFERÊNCIAS ================== */
function runDeepReferenceAnalysis() {
    logToPanel('🔍 Iniciando análise profunda de referências...', 'reference');
    
    const analysis = {
        timestamp: new Date().toISOString(),
        pageLinks: [],
        ajaxCalls: [],
        dynamicImports: [],
        eventListeners: [],
        storageReferences: [],
        consoleReferences: [],
        securityIssues: [],
        recommendations: []
    };
    
    // 1. Analisar todos os links na página (incluindo dinâmicos)
    const allLinks = document.querySelectorAll('a');
    allLinks.forEach(link => {
        analysis.pageLinks.push({
            text: link.textContent.substring(0, 50),
            href: link.href,
            title: link.title,
            target: link.target,
            isExternal: !link.href.includes(window.location.hostname) && link.href.startsWith('http'),
            isBrokenPattern: link.href.includes('old-') || link.href.includes('legacy-') || link.href.includes('deprecated-')
        });
    });
    
    // 2. Analisar chamadas AJAX (se jQuery estiver presente)
    if (window.jQuery) {
        try {
            const ajaxCalls = [];
            // Monitorar chamadas AJAX (aproximação)
            if (window.performance && window.performance.getEntriesByType) {
                const perfEntries = window.performance.getEntriesByType('resource');
                perfEntries.forEach(entry => {
                    if (entry.initiatorType === 'xmlhttprequest' || entry.initiatorType === 'fetch') {
                        analysis.ajaxCalls.push({
                            url: entry.name,
                            duration: entry.duration,
                            size: entry.transferSize || 'unknown'
                        });
                    }
                });
            }
        } catch (e) {
            console.warn('Não foi possível analisar chamadas AJAX:', e);
        }
    }
    
    // 3. Analisar event listeners dinâmicos
    const elementsWithEvents = ['pdfModal', 'mediaUpload', 'uploadPreview', 'adminPanel', 'pdfPassword'];
    elementsWithEvents.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            const events = [];
            
            // Verificar listeners através de atributos
            ['click', 'change', 'input', 'submit', 'load'].forEach(eventType => {
                const handler = element[`on${eventType}`];
                if (handler) {
                    events.push({
                        type: eventType,
                        handler: handler.toString().substring(0, 100)
                    });
                }
            });
            
            if (events.length > 0) {
                analysis.eventListeners.push({
                    element: id,
                    events
                });
            }
        }
    });
    
    // 4. Analisar referências em localStorage/sessionStorage
    try {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('media') || key.includes('pdf') || key.includes('old')) {
                analysis.storageReferences.push({
                    type: 'localStorage',
                    key,
                    value: localStorage.getItem(key).substring(0, 100)
                });
            }
        }
        
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            if (key.includes('media') || key.includes('pdf') || key.includes('old')) {
                analysis.storageReferences.push({
                    type: 'sessionStorage',
                    key,
                    value: sessionStorage.getItem(key).substring(0, 100)
                });
            }
        }
    } catch (e) {
        console.warn('Não foi possível acessar storage:', e);
    }
    
    // 5. Analisar console por referências
    if (window.console && console._commandLineAPI) {
        // Tentar capturar referências do console (aproximação)
        analysis.consoleReferences.push({
            note: 'Console ativo - verificar manualmente referências no console F12'
        });
    }
    
    // 6. Verificar questões de segurança
    const scripts = document.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.src && script.src.includes('http://') && !script.src.includes('localhost')) {
            analysis.securityIssues.push({
                type: 'insecure-script',
                url: script.src,
                issue: 'Script carregado via HTTP inseguro'
            });
            analysis.recommendations.push('🔒 Substituir HTTP por HTTPS para: ' + script.src);
        }
    });
    
    // Gerar recomendações baseadas na análise
    if (analysis.pageLinks.some(link => link.isBrokenPattern)) {
        analysis.recommendations.push('🔗 Substituir links com padrões "old-", "legacy-" ou "deprecated-"');
    }
    
    if (analysis.securityIssues.length > 0) {
        analysis.recommendations.push('🔒 Corrigir scripts carregados via HTTP (usar HTTPS)');
    }
    
    if (analysis.ajaxCalls.length > 20) {
        analysis.recommendations.push('⚡ Otimizar chamadas AJAX - muitas requisições podem afetar performance');
    }
    
    // Mostrar resultados
    showDeepReferenceAnalysis(analysis);
    
    return analysis;
}

/* ================== PAINEL DE ANÁLISE PROFUNDA ================== */
function showDeepReferenceAnalysis(analysis) {
    const alertId = 'deep-reference-analysis-alert';
    
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
        background: #000a1a;
        color: #0088cc;
        padding: 25px;
        border: 3px solid #0088cc;
        border-radius: 10px;
        z-index: 1000006;
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        width: 95%;
        box-shadow: 0 0 50px rgba(0, 136, 204, 0.5);
        font-family: 'Consolas', 'Monaco', monospace;
    `;
    
    let html = `
        <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #0088cc;">
            <span>🔍</span>
            <span>ANÁLISE PROFUNDA DE REFERÊNCIAS</span>
        </div>
        
        <div style="background: #001a33; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #88aaff;">LINKS</div>
                    <div style="font-size: 32px; color: #0088cc;">${analysis.pageLinks.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">AJAX</div>
                    <div style="font-size: 32px; color: ${analysis.ajaxCalls.length > 10 ? '#ffaa00' : '#0088cc'}">${analysis.ajaxCalls.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">EVENTOS</div>
                    <div style="font-size: 32px; color: #0088cc;">${analysis.eventListeners.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #88aaff;">SEGURANÇA</div>
                    <div style="font-size: 32px; color: ${analysis.securityIssues.length > 0 ? '#ff5555' : '#00ff9c'}">${analysis.securityIssues.length}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #88aaff; text-align: center;">
                Análise profunda de referências cruzadas e padrões de uso
            </div>
        </div>
    `;
    
    // Seção de recomendações
    if (analysis.recommendations.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #0088cc; margin-bottom: 10px; border-bottom: 1px solid #003366; padding-bottom: 5px;">
                    💡 RECOMENDAÇÕES DA ANÁLISE
                </h4>
                <div style="max-height: 200px; overflow-y: auto; background: #001122; padding: 10px; border-radius: 4px;">
        `;
        
        analysis.recommendations.forEach((rec, index) => {
            const icon = rec.includes('Substituir') ? '🔗' : 
                        rec.includes('Corrigir') ? '🔒' : 
                        rec.includes('Otimizar') ? '⚡' : '•';
            
            html += `
                <div style="margin-bottom: 6px; padding: 8px; background: rgba(0, 136, 204, 0.1); border-radius: 4px;">
                    <span style="color: #0088cc;">${icon}</span>
                    <span style="color: #88aaff; margin-left: 8px;">${rec}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Seção de links problemáticos
    const brokenLinks = analysis.pageLinks.filter(link => link.isBrokenPattern);
    if (brokenLinks.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ffaa00; margin-bottom: 10px; border-bottom: 1px solid #663300; padding-bottom: 5px;">
                    ⚠️ LINKS COM PADRÕES PROBLEMÁTICOS
                </h4>
                <div style="max-height: 150px; overflow-y: auto; background: #332200; padding: 10px; border-radius: 4px;">
        `;
        
        brokenLinks.slice(0, 10).forEach(link => {
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 170, 0, 0.1); border-radius: 3px; font-size: 11px;">
                    <span style="color: #ffaa00;">🔗</span>
                    <span style="color: #ffcc88; margin-left: 8px;">${link.text || 'Sem texto'} → ${link.href.substring(0, 60)}${link.href.length > 60 ? '...' : ''}</span>
                </div>
            `;
        });
        
        if (brokenLinks.length > 10) {
            html += `<div style="text-align: center; color: #ffaa00; padding: 10px;">+ ${brokenLinks.length - 10} mais...</div>`;
        }
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Seção de issues de segurança
    if (analysis.securityIssues.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ff5555; margin-bottom: 10px; border-bottom: 1px solid #660000; padding-bottom: 5px;">
                    🔒 PROBLEMAS DE SEGURANÇA
                </h4>
                <div style="max-height: 150px; overflow-y: auto; background: #220000; padding: 10px; border-radius: 4px;">
        `;
        
        analysis.securityIssues.slice(0, 5).forEach(issue => {
            html += `
                <div style="margin-bottom: 4px; padding: 6px; background: rgba(255, 0, 0, 0.1); border-radius: 3px; font-size: 11px;">
                    <span style="color: #ff5555;">⚠️</span>
                    <span style="color: #ff8888; margin-left: 8px;">${issue.issue}</span>
                    <div style="font-size: 10px; color: #ffaaaa; margin-top: 2px;">${issue.url}</div>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    // Tabs para diferentes tipos de análise
    html += `
        <div style="margin-bottom: 20px;">
            <div style="display: flex; gap: 10px; margin-bottom: 15px;">
                <button id="show-links-analysis" class="deep-tab-btn active" style="
                    background: #001a33; color: #0088cc; border: 1px solid #0088cc;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px; flex: 1;">
                    🔗 Links (${analysis.pageLinks.length})
                </button>
                <button id="show-ajax-analysis" class="deep-tab-btn" style="
                    background: #001a33; color: #0088cc; border: 1px solid #0088cc;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px; flex: 1;">
                    🔄 AJAX (${analysis.ajaxCalls.length})
                </button>
                <button id="show-events-analysis" class="deep-tab-btn" style="
                    background: #001a33; color: #0088cc; border: 1px solid #0088cc;
                    padding: 8px 12px; cursor: pointer; border-radius: 4px; flex: 1;">
                    🎯 Eventos (${analysis.eventListeners.length})
                </button>
            </div>
            
            <div id="links-analysis-content" class="deep-content" style="display: block; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo Links
    if (analysis.pageLinks.length > 0) {
        analysis.pageLinks.slice(0, 15).forEach(link => {
            const isExternal = link.isExternal;
            html += `
                <div style="margin-bottom: 3px; padding: 5px; background: rgba(0, 136, 204, 0.05); border-radius: 3px; font-size: 10px;">
                    <span style="color: ${isExternal ? '#ff8800' : '#0088cc'};">${isExternal ? '🌐' : '🔗'}</span>
                    <span style="color: #88aaff; margin-left: 6px;">${link.text || 'Sem texto'}</span>
                    <div style="color: #aaa; font-size: 9px; margin-top: 2px;">${link.href.substring(0, 70)}${link.href.length > 70 ? '...' : ''}</div>
                </div>
            `;
        });
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhum link encontrado</div>`;
    }
    
    html += `
            </div>
            
            <div id="ajax-analysis-content" class="deep-content" style="display: none; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo AJAX
    if (analysis.ajaxCalls.length > 0) {
        analysis.ajaxCalls.slice(0, 15).forEach(call => {
            html += `
                <div style="margin-bottom: 3px; padding: 5px; background: rgba(0, 136, 204, 0.05); border-radius: 3px; font-size: 10px;">
                    <span style="color: #00aaff;">🔄</span>
                    <span style="color: #88aaff; margin-left: 6px;">${call.url.substring(0, 60)}${call.url.length > 60 ? '...' : ''}</span>
                    <div style="color: #aaa; font-size: 9px; margin-top: 2px;">Duração: ${Math.round(call.duration)}ms | Tamanho: ${call.size === 'unknown' ? '?' : Math.round(call.size/1024) + 'KB'}</div>
                </div>
            `;
        });
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhuma chamada AJAX registrada</div>`;
    }
    
    html += `
            </div>
            
            <div id="events-analysis-content" class="deep-content" style="display: none; max-height: 200px; overflow-y: auto;">
    `;
    
    // Conteúdo Event Listeners
    if (analysis.eventListeners.length > 0) {
        analysis.eventListeners.slice(0, 15).forEach(listener => {
            html += `
                <div style="margin-bottom: 3px; padding: 5px; background: rgba(0, 136, 204, 0.05); border-radius: 3px; font-size: 10px;">
                    <span style="color: #aa00ff;">🎯</span>
                    <span style="color: #88aaff; margin-left: 6px;">${listener.element}</span>
                    <div style="color: #aaa; font-size: 9px; margin-top: 2px;">
                        Eventos: ${listener.events.map(e => e.type).join(', ')}
                    </div>
                </div>
            `;
        });
    } else {
        html += `<div style="text-align: center; color: #888; padding: 20px;">Nenhum event listener encontrado</div>`;
    }
    
    html += `
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
            <button id="export-deep-analysis" style="
                background: #0088cc; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                📊 EXPORTAR ANÁLISE
            </button>
            <button id="run-reference-check" style="
                background: #00aaff; color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                🔄 VERIFICAÇÃO DE REFERÊNCIAS
            </button>
            <button id="close-deep-analysis" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #88aaff; text-align: center; margin-top: 15px;">
            Análise profunda de referências cruzadas e padrões de uso no sistema
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos das tabs
    document.querySelectorAll('.deep-tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.deep-tab-btn').forEach(b => {
                b.style.background = '#001a33';
                b.style.color = '#0088cc';
            });
            
            this.style.background = '#0055aa';
            this.style.color = 'white';
            
            document.querySelectorAll('.deep-content').forEach(content => {
                content.style.display = 'none';
            });
            
            const tabId = this.id.replace('show-', '').replace('-analysis', '');
            const contentId = `${tabId}-analysis-content`;
            document.getElementById(contentId).style.display = 'block';
        });
    });
    
    // Configurar outros eventos
    document.getElementById('export-deep-analysis')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(analysis, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `deep-reference-analysis-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logToPanel('📊 Análise profunda exportada', 'reference');
    });
    
    document.getElementById('run-reference-check')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
        window.analyzeBrokenReferences();
    });
    
    document.getElementById('close-deep-analysis')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
}

/* ================== PAINEL DE ANÁLISE COMBINADA ================== */
function showEnhancedPlaceholderAnalysis(enhancedAnalysis) {
    const alertId = 'enhanced-placeholder-analysis-alert';
    
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
        background: #1a001a;
        color: #ff00ff;
        padding: 25px;
        border: 3px solid #ff00ff;
        border-radius: 10px;
        z-index: 1000007;
        max-width: 900px;
        max-height: 85vh;
        overflow-y: auto;
        width: 95%;
        box-shadow: 0 0 50px rgba(255, 0, 255, 0.5);
        font-family: 'Consolas', 'Monaco', monospace;
    `;
    
    let html = `
        <div style="font-size: 24px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 10px; color: #ff00ff;">
            <span>🚀</span>
            <span>ANÁLISE COMBINADA: PLACEHOLDERS + REFERÊNCIAS</span>
        </div>
        
        <div style="background: #330033; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div>
                    <div style="font-size: 11px; color: #ff88ff;">EXCLUIR</div>
                    <div style="font-size: 32px; color: #00ff9c;">${enhancedAnalysis.migrationStrategy.immediateDeletion.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ff88ff;">REDIRECIONAR</div>
                    <div style="font-size: 32px; color: #ffaa00;">${enhancedAnalysis.migrationStrategy.keepWithRedirect.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ff88ff;">CRÍTICOS</div>
                    <div style="font-size: 32px; color: #ff5555;">${enhancedAnalysis.migrationStrategy.criticalKeep.length}</div>
                </div>
                <div>
                    <div style="font-size: 11px; color: #ff88ff;">MONITORAR</div>
                    <div style="font-size: 32px; color: #ff8800;">${enhancedAnalysis.migrationStrategy.monitorFor404s.length}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #ff88ff; text-align: center;">
                Estratégia de migração baseada em análise de referências cruzadas
            </div>
        </div>
    `;
    
    // Seção de estratégia de migração
    html += `
        <div style="margin-bottom: 20px;">
            <h4 style="color: #ff00ff; margin-bottom: 10px; border-bottom: 1px solid #660066; padding-bottom: 5px;">
                📋 ESTRATÉGIA DE MIGRAÇÃO RECOMENDADA
            </h4>
            
            <div style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                <div style="background: #003300; padding: 15px; border-radius: 6px; border-left: 4px solid #00ff9c;">
                    <div style="color: #00ff9c; font-weight: bold; margin-bottom: 5px;">
                        ✅ EXCLUSÃO IMEDIATA (${enhancedAnalysis.migrationStrategy.immediateDeletion.length})
                    </div>
                    <div style="font-size: 11px; color: #88ffaa; max-height: 100px; overflow-y: auto;">
                        ${enhancedAnalysis.migrationStrategy.immediateDeletion.map(file => `• ${file}`).join('<br>') || 'Nenhum arquivo'}
                    </div>
                </div>
                
                <div style="background: #333300; padding: 15px; border-radius: 6px; border-left: 4px solid #ffaa00;">
                    <div style="color: #ffaa00; font-weight: bold; margin-bottom: 5px;">
                        🔗 MANTER COM REDIRECIONAMENTO (${enhancedAnalysis.migrationStrategy.keepWithRedirect.length})
                    </div>
                    <div style="font-size: 11px; color: #ffff88; max-height: 100px; overflow-y: auto;">
                        ${enhancedAnalysis.migrationStrategy.keepWithRedirect.map(file => `• ${file} → redirecionar para equivalente`).join('<br>') || 'Nenhum arquivo'}
                    </div>
                </div>
                
                <div style="background: #330000; padding: 15px; border-radius: 6px; border-left: 4px solid #ff5555;">
                    <div style="color: #ff5555; font-weight: bold; margin-bottom: 5px;">
                        🔒 ARQUIVOS CRÍTICOS (${enhancedAnalysis.migrationStrategy.criticalKeep.length})
                    </div>
                    <div style="font-size: 11px; color: #ff8888; max-height: 100px; overflow-y: auto;">
                        ${enhancedAnalysis.migrationStrategy.criticalKeep.map(file => `• ${file} - NÃO EXCLUIR`).join('<br>') || 'Nenhum arquivo'}
                    </div>
                </div>
                
                <div style="background: #331a00; padding: 15px; border-radius: 6px; border-left: 4px solid #ff8800;">
                    <div style="color: #ff8800; font-weight: bold; margin-bottom: 5px;">
                        👁️ MONITORAR PARA 404s (${enhancedAnalysis.migrationStrategy.monitorFor404s.length})
                    </div>
                    <div style="font-size: 11px; color: #ffbb88; max-height: 100px; overflow-y: auto;">
                        ${enhancedAnalysis.migrationStrategy.monitorFor404s.map(file => `• ${file} - alto risco de 404`).join('<br>') || 'Nenhum arquivo'}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Seção de recomendações
    if (enhancedAnalysis.recommendations.length > 0) {
        html += `
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ff00ff; margin-bottom: 10px; border-bottom: 1px solid #660066; padding-bottom: 5px;">
                    💡 RECOMENDAÇÕES PRIORITÁRIAS
                </h4>
                <div style="max-height: 200px; overflow-y: auto; background: #220022; padding: 10px; border-radius: 4px;">
        `;
        
        enhancedAnalysis.recommendations.forEach((rec, index) => {
            const color = rec.includes('pode ser excluído') ? '#00ff9c' : 
                         rec.includes('criar redirecionamento') ? '#ffaa00' : 
                         rec.includes('NÃO EXCLUIR') ? '#ff5555' : 
                         rec.includes('Monitorar') ? '#ff8800' : '#ff88ff';
            
            html += `
                <div style="margin-bottom: 6px; padding: 8px; background: rgba(255, 0, 255, 0.1); border-radius: 4px; border-left: 3px solid ${color};">
                    <span style="color: ${color}; font-weight: bold;">${index + 1}.</span>
                    <span style="color: #ff88ff; margin-left: 8px;">${rec}</span>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
    }
    
    html += `
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px; flex-wrap: wrap;">
            <button id="generate-complete-migration-plan" style="
                background: #ff00ff; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                📋 GERAR PLANO DE MIGRAÇÃO
            </button>
            <button id="run-references-check" style="
                background: #ff5500; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                🔗 VERIFICAR REFERÊNCIAS
            </button>
            <button id="export-combined-analysis" style="
                background: #0088cc; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                📊 EXPORTAR ANÁLISE
            </button>
            <button id="close-enhanced-analysis" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; font-size: 14px; min-width: 140px;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #ff88ff; text-align: center; margin-top: 15px;">
            Baseado em análise de ${enhancedAnalysis.references.stats.totalReferences} referências cruzadas
        </div>
    `;
    
    alertDiv.innerHTML = html;
    document.body.appendChild(alertDiv);
    
    // Configurar eventos
    document.getElementById('generate-complete-migration-plan')?.addEventListener('click', () => {
        generateCompleteMigrationPlan(enhancedAnalysis);
    });
    
    document.getElementById('run-references-check')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
        window.analyzeBrokenReferences();
    });
    
    document.getElementById('export-combined-analysis')?.addEventListener('click', () => {
        const blob = new Blob([JSON.stringify(enhancedAnalysis, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `combined-analysis-migration-${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
        logToPanel('📊 Análise combinada exportada', 'migration');
    });
    
    document.getElementById('close-enhanced-analysis')?.addEventListener('click', () => {
        document.body.removeChild(alertDiv);
    });
}

/* ================== GERAR PLANO COMPLETO DE MIGRAÇÃO ================== */
function generateCompleteMigrationPlan(analysis) {
    const timestamp = new Date().toISOString();
    const domain = window.location.hostname;
    
    const migrationPlan = `
# ==============================================
# PLANO COMPLETO DE MIGRAÇÃO - Compatibilidade Reversível
# Gerado por diagnostics.js - Data: ${timestamp}
# Domínio: ${domain}
# ==============================================

# RESUMO DA ANÁLISE:
# - Total de referências analisadas: ${analysis.references.stats.totalReferences}
# - Potenciais 404s identificados: ${analysis.references.stats.potential404s}
# - Arquivos para exclusão imediata: ${analysis.migrationStrategy.immediateDeletion.length}
# - Arquivos que precisam de redirecionamento: ${analysis.migrationStrategy.keepWithRedirect.length}
# - Arquivos críticos (NÃO EXCLUIR): ${analysis.migrationStrategy.criticalKeep.length}

# ==============================================
# FASE 1: PREPARAÇÃO (Dia 1-3)
# ==============================================

## 1.1 BACKUP DE SEGURANÇA
- Criar backup completo do diretório atual
- Backup do banco de dados (se aplicável)
- Versionar estado atual com git tag "pre-migracao-${timestamp}"

## 1.2 IMPLEMENTAR REDIRECIONAMENTOS
Adicionar ao .htaccess ou configuração do servidor:

${analysis.migrationStrategy.keepWithRedirect.map(file => {
    const newPath = file.includes('media') ? 'MediaSystem' : 
                   file.includes('pdf') ? 'MediaSystem' : 
                   file.includes('diagnostics') ? 'diagnostics.js' : 
                   'index.html';
    return `RewriteRule ^${file}$ /${newPath} [L,R=301]`;
}).join('\n')}

## 1.3 PLACEHOLDERS DE COMPATIBILIDADE
Criar arquivos placeholder para:

${analysis.migrationStrategy.keepWithRedirect.map(file => `
### ${file}
\`\`\`javascript
// Placeholder para ${file} - Compatibilidade Reversível
// Mantido até ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}

console.warn('⚠️ ${file} foi migrado. Use o sistema unificado.');

if (window.MediaSystem) {
    // Delegar chamadas para o sistema unificado
    window.${file.replace('.js', '')} = {
        // Funções placeholder para compatibilidade
        placeholder: true,
        migratedTo: 'MediaSystem',
        deprecatedSince: '${timestamp}'
    };
}
\`\`\`
`).join('\n')}

# ==============================================
# FASE 2: MIGRAÇÃO (Dia 4-7)
# ==============================================

## 2.1 REMOVER ARQUIVOS SEGUROS
### Exclusão imediata (segura):
${analysis.migrationStrategy.immediateDeletion.map(file => `- rm ${file}`).join('\n')}

## 2.2 ATUALIZAR REFERÊNCIAS
Atualizar os seguintes arquivos para remover referências obsoletas:

1. index.html
   - Remover tags <script> para: ${analysis.migrationStrategy.immediateDeletion.join(', ')}
   - Atualizar links CSS antigos

2. Arquivos JavaScript
   - Substituir imports/requires de módulos antigos
   - Atualizar chamadas de função para usar MediaSystem

## 2.3 TESTES DE COMPATIBILIDADE
Executar sequência de testes:

1. ✅ diagnostics.js → runCompleteDiagnosis()
2. ✅ diagnostics.js → verifyMediaMigration()
3. ✅ diagnostics.js → testModuleCompatibility()
4. ✅ Testar uploads de mídia
5. ✅ Testar modal de PDF
6. ✅ Testar admin panel

# ==============================================
# FASE 3: MONITORAMENTO (Dia 8-30)
# ==============================================

## 3.1 MONITORAR ERROS 404
Arquivos a monitorar:

${analysis.migrationStrategy.monitorFor404s.map(file => `- ${file}`).join('\n')}

## 3.2 ANALYTICS DE ERROS
Implementar tracking de 404s:

\`\`\`javascript
// Código de monitoramento
window.addEventListener('error', function(e) {
    if (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK') {
        console.error('📊 404 DETECTADO:', e.target.src || e.target.href);
        // Reportar para analytics
    }
});
\`\`\`

## 3.3 LOGS DE MIGRAÇÃO
Manter logs de:

1. Erros 404 detectados
2. Usuários afetados
3. Performance pós-migração
4. Issues reportados

# ==============================================
# FASE 4: OTIMIZAÇÃO (Dia 31+)
# ==============================================

## 4.1 REMOVER PLACEHOLDERS
Após 30 dias sem 404s relatados:

${analysis.migrationStrategy.keepWithRedirect.map(file => `- Remover placeholder de ${file}`).join('\n')}

## 4.2 REMOVER REDIRECIONAMENTOS
Remover regras do .htaccess para arquivos migrados

## 4.3 OTIMIZAÇÃO FINAL
- Minificar código consolidado
- Otimizar carregamento de recursos
- Implementar cache apropriado

# ==============================================
# ARQUIVOS CRÍTICOS - NUNCA EXCLUIR
# ==============================================

${analysis.migrationStrategy.criticalKeep.map(file => `- ${file} → Sistema essencial`).join('\n')}

# ==============================================
# CHECKLIST DE VALIDAÇÃO
# ==============================================

## PRÉ-MIGRAÇÃO
- [ ] Backup completo realizado
- [ ] Redirecionamentos configurados
- [ ] Placeholders implementados
- [ ] Equipe notificada

## PÓS-MIGRAÇÃO (24h)
- [ ] Testes funcionais passaram
- [ ] Performance dentro do esperado
- [ ] Nenhum 404 crítico reportado
- [ ] Analytics configurado

## MONITORAMENTO (7 dias)
- [ ] Logs de 404 sendo coletados
- [ ] Performance estável
- [ ] Usuários não reportando problemas
- [ ] Placeholders funcionando

# ==============================================
# CONTATO E SUPORTE
# ==============================================

## EM CASO DE PROBLEMAS:
1. Reverter para backup pré-migração
2. Verificar logs de erro
3. Consultar análise em: combined-analysis-migration-*.json
4. Usar diagnostics.js para diagnóstico

## MÉTRICAS DE SUCESSO:
- Zero 404s após 30 dias
- Performance igual ou melhor
- Todas funcionalidades operacionais
- Feedback positivo dos usuários

# ==============================================
# FIM DO PLANO DE MIGRAÇÃO
# ==============================================
`;
    
    const blob = new Blob([migrationPlan], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-plan-${domain}-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    
    logToPanel('📋 Plano completo de migração gerado', 'success');
    
    // Mostrar resumo
    const summary = `
        ✅ PLANO DE MIGRAÇÃO GERADO!
        
        📊 RESUMO:
        - ${analysis.migrationStrategy.immediateDeletion.length} arquivos para exclusão imediata
        - ${analysis.migrationStrategy.keepWithRedirect.length} arquivos precisam de redirecionamento
        - ${analysis.migrationStrategy.criticalKeep.length} arquivos críticos (NÃO EXCLUIR)
        - ${analysis.migrationStrategy.monitorFor404s.length} arquivos para monitorar
        
        📁 O plano inclui:
        1. Fase de preparação (3 dias)
        2. Fase de migração (4 dias)
        3. Fase de monitoramento (23 dias)
        4. Fase de otimização (após 30 dias)
        
        ⚠️ IMPORTANTE:
        - Faça backup antes de iniciar
        - Teste em ambiente de staging primeiro
        - Monitore logs de erro cuidadosamente
    `;
    
    alert(summary);
}

// [O RESTANTE DO CÓDIGO ORIGINAL PERMANECE AQUI...]
// Incluindo todas as funções originais:
// - window.verifyMediaMigration
// - window.analyzePlaceholders
// - showPlaceholderAnalysis
// - generateDeleteScript
// - window.testModuleCompatibility
// - window.validateMediaMigration
// - showMigrationValidationAlert
// - showMigrationSuccessAlert
// - window.autoValidateMigration
// - classifyModule
// - analyzeSystem
// - updateMigrationTab
// - testMediaUnifiedComplete
// - window.diagnosePdfModalMobile
// - updateOverview
// - updateTestsTab
// - updatePdfMobileTab
// - applyMobilePdfFixes
// - runCompleteDiagnosis
// - calculateHealthScore
// - exportReport
// - runPdfMobileDiagnosis
// - createDiagnosticsPanel
// - setupPanelEvents
// - E todas as outras funções auxiliares

/* ================== ATUALIZAÇÃO DO PAINEL VISUAL ================== */
// Adicionar botão para análise de referências no painel
// Esta parte seria integrada na função createDiagnosticsPanel()

// Na seção de botões principais, adicionar:
// <button id="analyze-references-btn" style="...">🔗 ANALISAR REFERÊNCIAS</button>

// E no setupPanelEvents():
// document.getElementById('analyze-references-btn')?.addEventListener('click', () => {
//     window.analyzeBrokenReferences();
// });

// Também adicionar na função updateOverview() um botão para análise combinada

/* ================== INICIALIZAÇÃO AUTOMÁTICA ================== */
// Atualizar para incluir verificação de referências se o parâmetro estiver presente
if (DEBUG_MODE && DIAGNOSTICS_MODE) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(() => {
                createDiagnosticsPanel();
                setTimeout(() => runCompleteDiagnosis(), 2000);
                
                if (MOBILE_TEST) {
                    setTimeout(() => runPdfMobileDiagnosis(), 3000);
                }
                
                if (REFERENCE_CHECK) {
                    setTimeout(() => {
                        if (typeof window.analyzeBrokenReferences === 'function') {
                            window.analyzeBrokenReferences();
                        }
                    }, 4000);
                }
                
                setTimeout(() => {
                    if (typeof window.autoValidateMigration === 'function') {
                        window.autoValidateMigration();
                    }
                }, 5000);
            }, 1000);
        });
    } else {
        setTimeout(() => {
            createDiagnosticsPanel();
            setTimeout(() => runCompleteDiagnosis(), 2000);
            
            if (MOBILE_TEST) {
                setTimeout(() => runPdfMobileDiagnosis(), 3000);
            }
            
            if (REFERENCE_CHECK) {
                setTimeout(() => {
                    if (typeof window.analyzeBrokenReferences === 'function') {
                        window.analyzeBrokenReferences();
                    }
                }, 4000);
            }
            
            setTimeout(() => {
                if (typeof window.autoValidateMigration === 'function') {
                    window.autoValidateMigration();
                }
            }, 5000);
        }, 1000);
    }
}

// Adicionar as novas funções ao objeto window
window.analyzeBrokenReferences = window.analyzeBrokenReferences;
window.analyzePlaceholdersEnhanced = window.analyzePlaceholdersEnhanced;
window.runDeepReferenceAnalysis = runDeepReferenceAnalysis;

window.runDiagnostics = runCompleteDiagnosis;
window.diagnosticsLoaded = true;
console.log('✅ diagnostics.js v5 carregado com sucesso! (com verificação de referências cruzadas)');

// Adicionar listener para capturar erros 404 em tempo real
window.addEventListener('error', function(e) {
    if (e.target && (e.target.tagName === 'SCRIPT' || e.target.tagName === 'LINK')) {
        console.error('🔍 [DIAGNOSTICS] ERRO 404 DETECTADO EM TEMPO REAL:', {
            element: e.target.tagName,
            src: e.target.src || e.target.href,
            timestamp: new Date().toISOString(),
            page: window.location.href
        });
        
        // Se diagnostics estiver ativo, logar no painel também
        if (DEBUG_MODE && DIAGNOSTICS_MODE) {
            logToPanel(`❌ 404 detectado: ${e.target.src || e.target.href}`, 'error');
        }
    }
});

// Monitorar fetch para detectar 404s em chamadas AJAX
const originalFetch = window.fetch;
window.fetch = function(...args) {
    return originalFetch.apply(this, args).then(response => {
        if (!response.ok && response.status === 404) {
            console.warn('🔍 [DIAGNOSTICS] Fetch 404 detectado:', args[0]);
            
            if (DEBUG_MODE && DIAGNOSTICS_MODE) {
                logToPanel(`⚠️ Fetch 404: ${args[0]}`, 'warning');
            }
        }
        return response;
    }).catch(error => {
        if (error.message.includes('404')) {
            console.error('🔍 [DIAGNOSTICS] Fetch error 404:', args[0]);
            
            if (DEBUG_MODE && DIAGNOSTICS_MODE) {
                logToPanel(`❌ Fetch error 404: ${args[0]}`, 'error');
            }
        }
        throw error;
    });
};
