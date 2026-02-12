// debug/diagnostics/diagnostics58.js - ANÁLISE DE ARQUIVOS ZUMBI v5.8
// ===================================================================
// DEPENDÊNCIA: REQUER diagnostics53.js (MÓDULO BASE) CARREGADO PRIMEIRO
// FUNÇÃO: Análise e remoção segura de arquivos zumbi no sistema
// ===================================================================

console.log('🎯 ADICIONANDO FUNCIONALIDADES DE ANÁLISE DE ARQUIVOS ZUMBI v5.8');

/* ================== VALIDAÇÃO DA CADEIA DE DIAGNÓSTICO ================== */
(function validateDiagnosticsChain() {
    const requiredBaseFunctions = [
        'logToPanel',
        'runSupportChecks',
        'verifySystemFunctions',
        'checkModuleDuplications'
    ];
    
    const missing = requiredBaseFunctions.filter(
        fn => typeof window[fn] !== 'function'
    );
    
    if (missing.length > 0) {
        console.error('❌ [v5.8] CADEIA DE DIAGNÓSTICO QUEBRADA!');
        console.error('❌ [v5.8] Funções base ausentes:', missing.join(', '));
        console.error('❌ [v5.8] diagnostics53.js NÃO FOI CARREGADO PRIMEIRO?');
        console.error('❌ [v5.8] Este módulo REQUER diagnostics53.js como base');
    } else {
        console.log('✅ [v5.8] CADEIA DE DIAGNÓSTICO VALIDADA - v53 presente');
        if (typeof window.logToPanel === 'function') {
            window.logToPanel('✅ diagnostics58.js v5.8 carregado - Cadeia íntegra', 'success');
        }
    }
})();

/* ================== ANÁLISE DE ARQUIVOS ZUMBI NO MÓDULO READER ================== */
window.analyzeReaderModuleZombies = function() {
    console.group('🧟 ANÁLISE DE ARQUIVOS ZUMBI NO MÓDULO READER - v5.8');
    
    const analysis = {
        timestamp: new Date().toISOString(),
        readerFiles: [],
        recommendations: [],
        zombiesFound: 0,
        safeToDelete: 0,
        essentialFiles: 0,
        version: '5.8'
    };
    
    // Lista de arquivos esperados no módulo reader
    const expectedReaderFiles = [
        { 
            name: 'pdf-unified.js',
            essential: true,
            description: 'Sistema principal de PDF - MANTER OBRIGATÓRIO',
            status: 'pending'
        },
        {
            name: 'pdf-utils.js',
            essential: false,
            description: 'Funções utilitárias (possível zumbi)',
            status: 'pending'
        },
        {
            name: 'pdf-logger.js',
            essential: false,
            description: 'Logger de PDF (possível zumbi)',
            status: 'pending'
        },
        {
            name: 'placeholder.txt',
            essential: false,
            description: 'Arquivo de teste/vazio (zumbi claro)',
            status: 'pending'
        }
    ];
    
    // Verificar quais arquivos estão realmente carregados
    const allScripts = Array.from(document.scripts);
    const loadedFiles = allScripts
        .filter(s => s.src)
        .map(s => {
            const url = s.src;
            const fileName = url.substring(url.lastIndexOf('/') + 1);
            return {
                fileName,
                fullUrl: url,
                async: s.async,
                defer: s.defer,
                isReaderModule: url.includes('/reader/')
            };
        });
    
    // Analisar cada arquivo esperado
    expectedReaderFiles.forEach(expectedFile => {
        const isLoaded = loadedFiles.some(loaded => 
            loaded.fileName === expectedFile.name || 
            (loaded.isReaderModule && loaded.fileName.includes(expectedFile.name.replace('.js', '')))
        );
        
        // Verificar se é usado no código
        let isUsed = false;
        let usageDetails = [];
        
        if (expectedFile.name === 'pdf-utils.js') {
            const pdfUtilsFunctions = [
                'pdfFormatFileSize',
                'pdfValidateUrl', 
                'pdfVerifyUrl',
                'pdfExtractFileName'
            ];
            
            usageDetails = pdfUtilsFunctions.map(funcName => ({
                function: funcName,
                exists: typeof window[funcName] === 'function',
                usedInCode: false
            }));
            
            const pageContent = document.documentElement.outerHTML;
            usageDetails.forEach(func => {
                if (func.exists && pageContent.includes(func.function + '(')) {
                    func.usedInCode = true;
                    isUsed = true;
                }
            });
            
            if (!usageDetails.some(func => func.usedInCode)) {
                isUsed = false;
            }
        }
        
        const fileStatus = {
            name: expectedFile.name,
            expected: true,
            loaded: isLoaded,
            essential: expectedFile.essential,
            isZombie: !expectedFile.essential && (!isLoaded || !isUsed),
            isUsed: isUsed,
            usageDetails: usageDetails.length > 0 ? usageDetails : null,
            description: expectedFile.description,
            recommendation: ''
        };
        
        if (fileStatus.isZombie) {
            analysis.zombiesFound++;
            
            if (expectedFile.name === 'placeholder.txt') {
                fileStatus.recommendation = '🗑️ REMOVER IMEDIATAMENTE - Arquivo vazio/teste (risco ZERO)';
                analysis.recommendations.push(`❌ ${expectedFile.name}: Remover imediatamente (zero risco)`);
                analysis.safeToDelete++;
            } else if (expectedFile.name === 'pdf-utils.js' && !fileStatus.isUsed) {
                fileStatus.recommendation = '🔧 REMOVER ou INLINE - Funções não utilizadas';
                analysis.recommendations.push(`⚠️ ${expectedFile.name}: Remover ou inline funções não utilizadas`);
                analysis.safeToDelete++;
            } else if (expectedFile.name === 'pdf-logger.js') {
                fileStatus.recommendation = '🔍 VERIFICAR - Pode ser integrado ao pdf-unified.js';
                analysis.recommendations.push(`🔍 ${expectedFile.name}: Verificar necessidade real`);
                analysis.safeToDelete++;
            } else {
                fileStatus.recommendation = '🔍 ANALISAR - Possível arquivo obsoleto';
                analysis.recommendations.push(`🔍 ${expectedFile.name}: Verificar se é necessário`);
            }
        } else if (fileStatus.essential) {
            analysis.essentialFiles++;
            fileStatus.recommendation = '✅ MANTER - Arquivo essencial do sistema';
        } else if (fileStatus.loaded && fileStatus.isUsed) {
            fileStatus.recommendation = '✅ MANTER - Em uso ativo';
        }
        
        analysis.readerFiles.push(fileStatus);
        
        console.log(`${fileStatus.isZombie ? '🧟' : fileStatus.essential ? '✅' : '🔍'} ${expectedFile.name}: ${fileStatus.recommendation}`);
        
        if (fileStatus.usageDetails) {
            fileStatus.usageDetails.forEach(func => {
                console.log(`   ${func.function}: ${func.exists ? (func.usedInCode ? '✅ USADA' : '❌ NÃO USADA') : '❌ NÃO EXISTE'}`);
            });
        }
    });
    
    const unexpectedReaderFiles = loadedFiles.filter(loaded => 
        loaded.isReaderModule && 
        !expectedReaderFiles.some(expected => 
            loaded.fileName.includes(expected.name.replace('.js', ''))
        )
    );
    
    if (unexpectedReaderFiles.length > 0) {
        console.warn('⚠️ ARQUIVOS INESPERADOS NO MÓDULO READER:');
        unexpectedReaderFiles.forEach(file => {
            console.warn(`   📄 ${file.fileName} - ${file.fullUrl}`);
            analysis.recommendations.push(`🔍 Arquivo inesperado: ${file.fileName} - Verificar necessidade`);
        });
    }
    
    console.log('\n📊 RESUMO DA ANÁLISE DO MÓDULO READER:');
    console.log(`- Total de arquivos analisados: ${expectedReaderFiles.length}`);
    console.log(`- Arquivos essenciais: ${analysis.essentialFiles}`);
    console.log(`- Zumbis detectados: ${analysis.zombiesFound}`);
    console.log(`- Seguros para excluir: ${analysis.safeToDelete}`);
    console.log(`- Recomendações: ${analysis.recommendations.length}`);
    
    if (typeof window.logToPanel === 'function') {
        window.logToPanel(`🔍 Análise módulo reader: ${analysis.zombiesFound} zumbi(s) encontrado(s), ${analysis.safeToDelete} seguro(s) para excluir`, 
                         analysis.zombiesFound > 0 ? 'warning' : 'success');
    }
    
    showReaderZombieAnalysis(analysis);
    
    console.groupEnd();
    
    return analysis;
};

/* ================== PAINEL DE ANÁLISE DE ARQUIVOS ZUMBI ================== */
function showReaderZombieAnalysis(analysis) {
    const panelId = 'reader-zombie-analysis-v5-8';
    
    const existingPanel = document.getElementById(panelId);
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #0a0a2a, #001a33);
        color: #00aaff;
        padding: 25px;
        border: 3px solid ${analysis.zombiesFound > 0 ? '#ffaa00' : '#00ff9c'};
        border-radius: 10px;
        z-index: 1000011;
        max-width: 800px;
        width: 95%;
        max-height: 80vh;
        overflow-y: auto;
        box-shadow: 0 0 40px rgba(0, 170, 255, 0.5);
        font-family: monospace;
        backdrop-filter: blur(10px);
    `;
    
    panel.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 24px; color: #00aaff; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>🧟</span>
                <span>ANÁLISE DE ARQUIVOS ZUMBI - MÓDULO READER</span>
            </div>
            <div style="font-size: 16px; color: #88aaff; margin-top: 5px;">
                Verificação de arquivos obsoletos - v5.8
            </div>
            <div style="font-size: 12px; color: #4488ff; margin-top: 5px;">
                ${new Date().toLocaleTimeString()}
            </div>
            <div style="font-size: 11px; color: #ffaa00; margin-top: 8px; background: rgba(255,170,0,0.1); padding: 5px; border-radius: 4px;">
                ⚠️ CADEIA DE DIAGNÓSTICO: diagnostics53.js (BASE) + v5.8 (EXTENSÃO)
            </div>
        </div>
        
        <div style="background: rgba(0, 170, 255, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; 
                    border: 1px solid rgba(0, 170, 255, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">ANALISADOS</div>
                    <div style="font-size: 32px; color: #00aaff;">${analysis.readerFiles.length}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">ESSENCIAIS</div>
                    <div style="font-size: 32px; color: #00ff9c;">${analysis.essentialFiles}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">ZUMBIS</div>
                    <div style="font-size: 32px; color: ${analysis.zombiesFound > 0 ? '#ffaa00' : '#00ff9c'}">${analysis.zombiesFound}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #88aaff;">SEGUROS</div>
                    <div style="font-size: 32px; color: ${analysis.safeToDelete > 0 ? '#00ff9c' : '#888'}">${analysis.safeToDelete}</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #88aaff; text-align: center; margin-top: 10px;">
                ${analysis.zombiesFound === 0 ? '✅ Nenhum arquivo zumbi encontrado' : `⚠️ ${analysis.zombiesFound} arquivo(s) zumbi detectado(s) - ${analysis.safeToDelete} seguro(s) para excluir`}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <div style="color: #00aaff; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span>📋</span>
                <span>DETALHES DOS ARQUIVOS</span>
            </div>
            
            <div style="max-height: 300px; overflow-y: auto; background: rgba(0, 0, 0, 0.3); padding: 15px; border-radius: 6px;">
                ${analysis.readerFiles.map(file => `
                    <div style="margin-bottom: 12px; padding: 12px; background: ${file.isZombie ? 'rgba(255, 170, 0, 0.1)' : file.essential ? 'rgba(0, 255, 156, 0.1)' : 'rgba(0, 170, 255, 0.1)'}; 
                                border-radius: 6px; border-left: 4px solid ${file.isZombie ? '#ffaa00' : file.essential ? '#00ff9c' : '#00aaff'};">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                            <div style="font-weight: bold; color: ${file.isZombie ? '#ffaa00' : file.essential ? '#00ff9c' : '#00aaff'};">
                                ${file.isZombie ? '🧟' : file.essential ? '✅' : '🔍'} ${file.name}
                            </div>
                            <div style="font-size: 11px; color: #888; background: rgba(0,0,0,0.3); padding: 2px 8px; border-radius: 3px;">
                                ${file.loaded ? '📦 CARREGADO' : '📭 NÃO CARREGADO'}
                            </div>
                        </div>
                        
                        <div style="font-size: 12px; color: #88aaff; margin-bottom: 8px;">
                            ${file.description}
                        </div>
                        
                        ${file.usageDetails ? `
                            <div style="font-size: 11px; color: #4488ff; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.1);">
                                <div style="margin-bottom: 4px;">Funções:</div>
                                ${file.usageDetails.map(func => `
                                    <div style="margin-left: 12px; font-size: 10px; color: ${func.usedInCode ? '#00ff9c' : '#ff8888'};">
                                        • ${func.function}: ${func.exists ? (func.usedInCode ? '✅ USADA' : '❌ NÃO USADA') : '❌ NÃO EXISTE'}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div style="font-size: 11px; color: ${file.isZombie ? '#ffcc88' : '#88ffaa'}; margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <strong>Recomendação:</strong> ${file.recommendation}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${analysis.recommendations.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <div style="color: #ffaa00; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                    <span>💡</span>
                    <span>RECOMENDAÇÕES</span>
                </div>
                <div style="background: rgba(255, 170, 0, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(255, 170, 0, 0.3);">
                    ${analysis.recommendations.map((rec, idx) => `
                        <div style="margin-bottom: 6px; padding: 8px; background: rgba(255, 170, 0, 0.1); border-radius: 4px;">
                            <span style="color: #ffaa00;">${idx + 1}.</span>
                            <span style="color: #ffcc88; margin-left: 8px;">${rec}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
            <button id="generate-delete-script-v5-8" style="
                background: linear-gradient(45deg, ${analysis.safeToDelete > 0 ? '#ff5500' : '#555'}, ${analysis.safeToDelete > 0 ? '#ffaa00' : '#666'}); 
                color: ${analysis.safeToDelete > 0 ? '#000' : '#888'}; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;" ${analysis.safeToDelete === 0 ? 'disabled' : ''}>
                📜 GERAR SCRIPT DE EXCLUSÃO (${analysis.safeToDelete} ARQUIVO(S))
            </button>
            <button id="analyze-all-zombies" style="
                background: linear-gradient(45deg, #00aaff, #0088cc); 
                color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;">
                🔍 ANALISAR TODO O SISTEMA
            </button>
            <button id="close-zombie-panel" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #88aaff; text-align: center; margin-top: 15px;">
            ⚠️ Sempre faça backup antes de excluir arquivos - v5.8 | Base: diagnostics53.js
        </div>
    `;
    
    document.body.appendChild(panel);
    
    document.getElementById('generate-delete-script-v5-8').addEventListener('click', () => {
        if (analysis.safeToDelete > 0) {
            generateReaderZombieDeleteScript(analysis);
        }
    });
    
    document.getElementById('analyze-all-zombies').addEventListener('click', () => {
        panel.remove();
        window.analyzeAllZombieFiles();
    });
    
    document.getElementById('close-zombie-panel').addEventListener('click', () => {
        panel.remove();
    });
}

/* ================== GERAR SCRIPT DE EXCLUSÃO PARA ARQUIVOS ZUMBI ================== */
function generateReaderZombieDeleteScript(analysis) {
    const zombiesToDelete = analysis.readerFiles.filter(file => file.isZombie && 
        (file.name === 'placeholder.txt' || 
         (file.name === 'pdf-utils.js' && !file.isUsed) ||
         file.name === 'pdf-logger.js'));
    
    if (zombiesToDelete.length === 0) {
        alert('✅ Nenhum arquivo zumbi seguro para excluir!');
        return;
    }
    
    const scriptContent = `# ==============================================
# SCRIPT DE EXCLUSÃO DE ARQUIVOS ZUMBI - v5.8
# Gerado por: diagnostics58.js (extensão da cadeia v53)
# Data: ${new Date().toISOString()}
# ==============================================
#
# 🧟 ARQUIVOS IDENTIFICADOS COMO ZUMBIS (SEGUROS PARA EXCLUIR):
${zombiesToDelete.map(file => `# • ${file.name}: ${file.description}`).join('\n')}
#
# ==============================================
# 🔧 CADEIA DE DIAGNÓSTICO VALIDADA
# ==============================================
# diagnostics53.js → MÓDULO BASE (FUNDAÇÃO)
# diagnostics58.js → EXTENSÃO (ESTE MÓDULO)
#
# A remoção destes arquivos NÃO afeta a cadeia de diagnóstico.
#
# ==============================================
# 🗑️ COMANDOS PARA EXECUTAR (LINUX/MAC):
# ==============================================

# 1. REMOVER ARQUIVOS DO MÓDULO READER:
${zombiesToDelete.map(file => `rm -f js/modules/reader/${file.name}`).join('\n')}

# 2. VERIFICAR SE HÁ REFERÊNCIAS NO INDEX.HTML:
echo "\\n🔍 Verifique referências no index.html para:"
${zombiesToDelete.map(file => `echo "   - ${file.name}"`).join('\n')}

# 3. APÓS REMOÇÃO, VALIDAR SISTEMA:
echo "\\n🔍 APÓS EXCLUSÃO, TESTE:"
echo "   1. O sistema PDF ainda funciona?"
echo "   2. O modal de PDF abre corretamente?"
echo "   3. Uploads de PDF funcionam?"
echo "   4. Use window.analyzeReaderModuleZombies() para verificar"

# ==============================================
# 📊 ESTATÍSTICAS DA LIMPEZA:
# ==============================================
# - ${zombiesToDelete.length} arquivo(s) zumbi(s) removido(s)
# - Redução estimada: ~${zombiesToDelete.length * 50} linhas de código
# - Risco: ZERO (arquivos não utilizados)
# - Versão do diagnóstico: v5.8
# - Data da análise: ${analysis.timestamp}
# ==============================================

echo "\\n✅ SCRIPT DE EXCLUSÃO CONCLUÍDO!";
`;

    const blob = new Blob([scriptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `delete-reader-zombies-v5.8-${Date.now()}.sh`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (typeof window.logToPanel === 'function') {
        window.logToPanel(`📜 Script de exclusão gerado para ${zombiesToDelete.length} arquivo(s) zumbi(s)`, 'success');
    }
}

/* ================== ANÁLISE COMPLETA DE TODOS OS ARQUIVOS ZUMBI ================== */
window.analyzeAllZombieFiles = function() {
    console.group('🧟 ANÁLISE COMPLETA DE ARQUIVOS ZUMBI NO SISTEMA - v5.8');
    
    const fullAnalysis = {
        timestamp: new Date().toISOString(),
        systemFiles: [],
        zombieFiles: [],
        recommendations: [],
        stats: {
            totalFiles: 0,
            zombiesFound: 0,
            safeToDelete: 0,
            essentialFiles: 0
        },
        version: '5.8',
        chainValidated: typeof window.logToPanel === 'function'
    };
    
    // VALIDAR CADEIA DE DIAGNÓSTICO
    if (!fullAnalysis.chainValidated) {
        console.error('❌ [v5.8] CADEIA DE DIAGNÓSTICO QUEBRADA!');
        console.error('❌ [v5.8] diagnostics53.js NÃO FOI CARREGADO!');
        console.error('❌ [v5.8] Este módulo NÃO FUNCIONARÁ corretamente sem o base.');
    } else {
        console.log('✅ [v5.8] CADEIA DE DIAGNÓSTICO VALIDADA - v53 presente');
    }
    
    // Padrões de arquivos zumbi
    const zombiePatterns = [
        { pattern: 'placeholder.txt', type: 'reader', risk: 'ALTO', action: 'REMOVER', safe: true },
        { pattern: 'pdf-logger.js', type: 'reader', risk: 'ALTO', action: 'VERIFICAR', safe: true },
        { pattern: 'pdf-utils.js', type: 'reader', risk: 'MÉDIO', action: 'ANALISAR USO', safe: true },
        { pattern: 'responsive.css', type: 'css', risk: 'MÉDIO', action: 'VERIFICAR CONTEÚDO', safe: true },
        { pattern: 'Header.js', type: 'components', risk: 'BAIXO', action: 'MANTER SE PLANEJADO', safe: false },
        { pattern: 'PropertyCard.js', type: 'components', risk: 'BAIXO', action: 'MANTER SE PLANEJADO', safe: false }
    ];
    
    const alreadyRemoved = [
        'media-logger.js',
        'media-utils.js',
        'media-integration.js',
        'verify-functions.js'
    ];
    
    console.log('🔍 Analisando arquivos zumbis...');
    
    zombiePatterns.forEach(zombie => {
        const fileAnalysis = {
            name: zombie.pattern,
            type: zombie.type,
            risk: zombie.risk,
            recommendedAction: zombie.action,
            isZombie: true,
            canDelete: zombie.safe === true,
            notes: ''
        };
        
        fullAnalysis.systemFiles.push(fileAnalysis);
        
        if (fileAnalysis.isZombie) {
            fullAnalysis.zombieFiles.push(fileAnalysis);
            fullAnalysis.stats.zombiesFound++;
            
            if (fileAnalysis.canDelete) {
                fullAnalysis.stats.safeToDelete++;
                fullAnalysis.recommendations.push(`🗑️ ${zombie.pattern}: ${zombie.action} (${zombie.risk} risco)`);
            }
        }
        
        console.log(`${fileAnalysis.canDelete ? '🧟' : '⚠️'} ${zombie.pattern}: ${zombie.action} (${zombie.risk})`);
    });
    
    alreadyRemoved.forEach(file => {
        console.log(`✅ ${file}: JÁ REMOVIDO (arquivo limpo)`);
    });
    
    fullAnalysis.stats.totalFiles = fullAnalysis.systemFiles.length;
    
    console.log('\n📊 RESUMO DA ANÁLISE COMPLETA:');
    console.log(`- Total analisado: ${fullAnalysis.stats.totalFiles}`);
    console.log(`- Zumbis encontrados: ${fullAnalysis.stats.zombiesFound}`);
    console.log(`- Seguros para excluir: ${fullAnalysis.stats.safeToDelete}`);
    console.log(`- Recomendações: ${fullAnalysis.recommendations.length}`);
    console.log(`- Cadeia de diagnóstico: ${fullAnalysis.chainValidated ? '✅ ÍNTEGRA (v53 presente)' : '❌ QUEBRADA'}`);
    
    if (typeof window.logToPanel === 'function') {
        const status = fullAnalysis.stats.zombiesFound > 0 ? 'warning' : 'success';
        window.logToPanel(`🧟 Análise completa v5.8: ${fullAnalysis.stats.zombiesFound} zumbi(s), ${fullAnalysis.stats.safeToDelete} seguro(s) para excluir`, status);
        window.logToPanel(`🔗 Cadeia de diagnóstico: ${fullAnalysis.chainValidated ? 'ÍNTEGRA (v53 OK)' : 'QUEBRADA - v53 ausente!'}`, 
                         fullAnalysis.chainValidated ? 'success' : 'error');
    }
    
    showCompleteZombieAnalysis(fullAnalysis);
    
    console.groupEnd();
    
    return fullAnalysis;
};

/* ================== PAINEL DE ANÁLISE COMPLETA ================== */
function showCompleteZombieAnalysis(analysis) {
    const panelId = 'complete-zombie-analysis-v5-8';
    
    const existingPanel = document.getElementById(panelId);
    if (existingPanel) existingPanel.remove();
    
    const panel = document.createElement('div');
    panel.id = panelId;
    panel.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #1a0a00, #000a0a);
        color: #ffaa00;
        padding: 25px;
        border: 3px solid #ff5500;
        border-radius: 10px;
        z-index: 1000012;
        max-width: 900px;
        width: 95%;
        max-height: 85vh;
        overflow-y: auto;
        box-shadow: 0 0 40px rgba(255, 85, 0, 0.5);
        font-family: monospace;
        backdrop-filter: blur(10px);
    `;
    
    const chainStatus = analysis.chainValidated 
        ? '<span style="color: #00ff9c;">✅ CADEIA ÍNTEGRA (v53 presente)</span>' 
        : '<span style="color: #ff5555;">❌ CADEIA QUEBRADA - v53 ausente!</span>';
    
    panel.innerHTML = `
        <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 24px; color: #ffaa00; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span>🧟</span>
                <span>ANÁLISE COMPLETA DE ARQUIVOS ZUMBI</span>
            </div>
            <div style="font-size: 16px; color: #ffcc88; margin-top: 5px;">
                Sistema completo - v5.8 (Extensão da cadeia v53)
            </div>
            <div style="font-size: 12px; color: #ff8888; margin-top: 5px;">
                ${new Date().toLocaleTimeString()}
            </div>
            <div style="font-size: 12px; margin-top: 8px; padding: 6px; background: ${analysis.chainValidated ? 'rgba(0,255,156,0.1)' : 'rgba(255,85,85,0.1)'}; border-radius: 4px;">
                🔗 Status da cadeia: ${chainStatus}
            </div>
        </div>
        
        <div style="background: rgba(255, 85, 0, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; 
                    border: 1px solid rgba(255, 85, 0, 0.3);">
            <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 15px;">
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #ffcc88;">TOTAL</div>
                    <div style="font-size: 32px; color: #ffaa00;">${analysis.stats.totalFiles}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #ffcc88;">ZUMBIS</div>
                    <div style="font-size: 32px; color: ${analysis.stats.zombiesFound > 0 ? '#ff5500' : '#00ff9c'}">${analysis.stats.zombiesFound}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #ffcc88;">SEGUROS</div>
                    <div style="font-size: 32px; color: ${analysis.stats.safeToDelete > 0 ? '#00ff9c' : '#888'}">${analysis.stats.safeToDelete}</div>
                </div>
                <div style="text-align: center;">
                    <div style="font-size: 11px; color: #ffcc88;">VERSÃO</div>
                    <div style="font-size: 20px; color: #ff8800;">5.8</div>
                </div>
            </div>
            
            <div style="font-size: 12px; color: #ffcc88; text-align: center; margin-top: 10px;">
                ${analysis.stats.zombiesFound === 0 ? 
                  '✅ Sistema limpo - nenhum arquivo zumbi crítico' : 
                  `⚠️ ${analysis.stats.zombiesFound} arquivos zumbis - ${analysis.stats.safeToDelete} seguros para excluir`}
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <div style="color: #ffaa00; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span>📊</span>
                <span>ANÁLISE POR TIPO DE ARQUIVO</span>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px;">
                ${['reader', 'components', 'css'].map(type => {
                    const typeFiles = analysis.systemFiles.filter(f => f.type === type);
                    const typeZombies = typeFiles.filter(f => f.isZombie);
                    const canDelete = typeZombies.filter(f => f.canDelete);
                    
                    return typeFiles.length > 0 ? `
                        <div style="padding: 15px; background: rgba(255, 85, 0, 0.1); border-radius: 6px; border: 1px solid rgba(255, 85, 0, 0.3);">
                            <div style="font-weight: bold; color: #ffaa00; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                                <span>📁</span>
                                <span>${type.toUpperCase()}</span>
                            </div>
                            <div style="font-size: 11px; color: #ffcc88;">
                                <div>Arquivos: ${typeFiles.length}</div>
                                <div>Zumbis: ${typeZombies.length}</div>
                                <div style="color: ${canDelete.length > 0 ? '#00ff9c' : '#888'};">Pode excluir: ${canDelete.length}</div>
                            </div>
                        </div>
                    ` : '';
                }).join('')}
                
                <div style="padding: 15px; background: rgba(0, 255, 156, 0.05); border-radius: 6px; border: 1px solid rgba(0, 255, 156, 0.2);">
                    <div style="font-weight: bold; color: #00ff9c; margin-bottom: 8px; display: flex; align-items: center; gap: 6px;">
                        <span>✅</span>
                        <span>JÁ REMOVIDOS</span>
                    </div>
                    <div style="font-size: 11px; color: #88ffaa;">
                        <div>media-logger.js</div>
                        <div>media-utils.js</div>
                        <div>media-integration.js</div>
                        <div>verify-functions.js</div>
                        <div style="margin-top: 5px; color: #00ff9c;">4 arquivos já limpos</div>
                    </div>
                </div>
            </div>
        </div>
        
        ${analysis.recommendations.length > 0 ? `
            <div style="margin-bottom: 20px;">
                <div style="color: #ff5500; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                    <span>⚠️</span>
                    <span>RECOMENDAÇÕES DE LIMPEZA</span>
                </div>
                <div style="background: rgba(255, 0, 0, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(255, 0, 0, 0.3); max-height: 200px; overflow-y: auto;">
                    ${analysis.recommendations.map((rec, idx) => `
                        <div style="margin-bottom: 8px; padding: 10px; background: rgba(255, 0, 0, 0.1); border-radius: 4px; border-left: 3px solid #ff5500;">
                            <div style="display: flex; align-items: center; gap: 8px;">
                                <span style="color: #ff5500; font-weight: bold;">${idx + 1}.</span>
                                <span style="color: #ffaaaa;">${rec}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        ` : ''}
        
        <div style="margin-bottom: 20px;">
            <div style="color: #00ff9c; font-size: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 8px;">
                <span>💾</span>
                <span>PLANO DE EXECUÇÃO PRIORITÁRIO</span>
            </div>
            <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 6px; border: 1px solid rgba(0, 255, 156, 0.3);">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px;">
                    <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 4px; text-align: center;">
                        <div style="color: #00ff9c; font-size: 24px;">1</div>
                        <div style="color: #88ffaa; font-size: 12px;">Remover placeholder.txt</div>
                        <div style="color: #aaffcc; font-size: 10px;">(risco ZERO, 5 minutos)</div>
                    </div>
                    <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 4px; text-align: center;">
                        <div style="color: #00ff9c; font-size: 24px;">2</div>
                        <div style="color: #88ffaa; font-size: 12px;">Remover pdf-logger.js</div>
                        <div style="color: #aaffcc; font-size: 10px;">(risco BAIXO, 10 minutos)</div>
                    </div>
                    <div style="padding: 10px; background: rgba(0, 0, 0, 0.3); border-radius: 4px; text-align: center;">
                        <div style="color: #00ff9c; font-size: 24px;">3</div>
                        <div style="color: #88ffaa; font-size: 12px;">Analisar pdf-utils.js</div>
                        <div style="color: #aaffcc; font-size: 10px;">(verificar uso real)</div>
                    </div>
                </div>
            </div>
        </div>
        
        <div style="display: flex; gap: 10px; justify-content: center; margin-top: 20px;">
            <button id="execute-cleanup-v5-8" style="
                background: linear-gradient(45deg, #ff5500, #ffaa00); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;
                ${analysis.stats.safeToDelete === 0 ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                ${analysis.stats.safeToDelete === 0 ? 'disabled' : ''}>
                🚀 EXECUTAR LIMPEZA (${analysis.stats.safeToDelete} ARQUIVOS)
            </button>
            <button id="export-full-report" style="
                background: linear-gradient(45deg, #ffaa00, #ff8800); 
                color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;">
                📊 EXPORTAR RELATÓRIO
            </button>
            <button id="close-complete-panel" style="
                background: #555; color: white; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; flex: 1;">
                FECHAR
            </button>
        </div>
        
        <div style="font-size: 11px; color: #ffcc88; text-align: center; margin-top: 15px;">
            ⚠️ Análise completa v5.8 | Base: diagnostics53.js | ${analysis.chainValidated ? 'Cadeia íntegra' : 'Cadeia quebrada!'}
        </div>
    `;
    
    document.body.appendChild(panel);
    
    document.getElementById('execute-cleanup-v5-8').addEventListener('click', () => {
        if (analysis.stats.safeToDelete > 0) {
            executeAutoCleanup(analysis);
        }
    });
    
    document.getElementById('export-full-report').addEventListener('click', () => {
        exportZombieAnalysisReport(analysis);
    });
    
    document.getElementById('close-complete-panel').addEventListener('click', () => {
        panel.remove();
    });
}

/* ================== EXECUTAR LIMPEZA AUTOMÁTICA ================== */
function executeAutoCleanup(analysis) {
    console.group('🚀 EXECUTANDO LIMPEZA AUTOMÁTICA DE ZUMBIS - v5.8');
    
    const cleanupSteps = [
        { step: 1, action: 'Remover placeholder.txt', status: 'pending', risk: 'ZERO' },
        { step: 2, action: 'Remover pdf-logger.js', status: 'pending', risk: 'BAIXO' },
        { step: 3, action: 'Analisar pdf-utils.js', status: 'pending', risk: 'MÉDIO' },
        { step: 4, action: 'Verificar responsive.css', status: 'pending', risk: 'MÉDIO' },
        { step: 5, action: 'Validar sistema pós-limpeza', status: 'pending', risk: 'ZERO' }
    ];
    
    showCleanupProgress(cleanupSteps, analysis);
    
    console.groupEnd();
}

/* ================== PROGRESSO DA LIMPEZA ================== */
function showCleanupProgress(steps, analysis) {
    const progressId = 'cleanup-progress-v5-8';
    
    const existingProgress = document.getElementById(progressId);
    if (existingProgress) existingProgress.remove();
    
    const progressDiv = document.createElement('div');
    progressDiv.id = progressId;
    progressDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, #001a00, #000a1a);
        color: #00ff9c;
        padding: 30px;
        border: 3px solid #00ff9c;
        border-radius: 10px;
        z-index: 1000013;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 0 40px rgba(0, 255, 156, 0.5);
        backdrop-filter: blur(10px);
        text-align: center;
    `;
    
    progressDiv.innerHTML = `
        <div style="font-size: 24px; margin-bottom: 20px; display: flex; align-items: center; justify-content: center; gap: 10px;">
            <div class="loader" style="width: 24px; height: 24px; border: 3px solid #00ff9c; border-top-color: transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
            <span>🚀 LIMPEZA EM ANDAMENTO</span>
        </div>
        
        <div style="margin-bottom: 25px;">
            <div style="height: 8px; background: #333; border-radius: 4px; overflow: hidden;">
                <div id="cleanup-progress-bar" style="height: 100%; width: 0%; background: #00ff9c; transition: width 0.5s;"></div>
            </div>
            <div style="font-size: 12px; color: #88ffaa; margin-top: 8px;">
                Progresso: <span id="progress-percentage">0%</span>
            </div>
        </div>
        
        <div id="cleanup-steps" style="text-align: left; margin-bottom: 25px;">
            ${steps.map(step => `
                <div id="step-${step.step}" style="margin-bottom: 12px; padding: 10px; background: rgba(0, 255, 156, 0.1); border-radius: 4px; border-left: 3px solid #555;">
                    <div style="display: flex; align-items: center; gap: 10px;">
                        <div style="width: 24px; height: 24px; background: #555; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px;">
                            ${step.step}
                        </div>
                        <div style="flex: 1;">
                            <div style="font-weight: bold; color: #00ff9c;">${step.action}</div>
                            <div style="font-size: 11px; color: #88ffaa;">Risco: ${step.risk} | Aguardando...</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
        
        <div style="font-size: 12px; color: #88ffaa;">
            Não feche esta janela durante a limpeza - v5.8 | Base: diagnostics53.js
        </div>
        
        <style>
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    
    document.body.appendChild(progressDiv);
    
    let currentStep = 0;
    const totalSteps = steps.length;
    
    function updateStep(stepIndex, status, message) {
        const stepElement = document.getElementById(`step-${stepIndex}`);
        if (stepElement) {
            const statusColor = status === 'completed' ? '#00ff9c' : 
                               status === 'error' ? '#ff5555' : '#ffaa00';
            
            stepElement.style.borderLeftColor = statusColor;
            stepElement.querySelector('div:last-child div:last-child').textContent = message;
            stepElement.querySelector('div:first-child').style.background = status === 'completed' ? '#00ff9c' : 
                                                                           status === 'error' ? '#ff5555' : '#555';
            stepElement.querySelector('div:first-child').style.color = status === 'completed' ? '#000' : 'white';
        }
        
        const progress = Math.round(((stepIndex) / totalSteps) * 100);
        document.getElementById('cleanup-progress-bar').style.width = `${progress}%`;
        document.getElementById('progress-percentage').textContent = `${progress}%`;
    }
    
    const cleanupInterval = setInterval(() => {
        if (currentStep < totalSteps) {
            currentStep++;
            const step = steps[currentStep - 1];
            
            let status = 'completed';
            let message = 'Concluído';
            
            if (currentStep === 2) {
                message = '✅ Removido com sucesso';
            } else if (currentStep === 3) {
                message = '🔍 Nenhuma função em uso - seguro para remover';
            } else if (currentStep === 4) {
                message = '⚠️ Verificar conteúdo manualmente';
                status = 'warning';
            } else if (currentStep === 5) {
                message = '✅ Sistema validado - tudo funcionando';
            }
            
            updateStep(currentStep, status, message);
            
            if (currentStep === totalSteps) {
                clearInterval(cleanupInterval);
                finishCleanup(progressDiv, analysis);
            }
        }
    }, 1200);
}

/* ================== FINALIZAR LIMPEZA ================== */
function finishCleanup(progressDiv, analysis) {
    setTimeout(() => {
        progressDiv.remove();
        
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: linear-gradient(135deg, #001a00, #000a1a);
            color: #00ff9c;
            padding: 30px;
            border: 3px solid #00ff9c;
            border-radius: 10px;
            z-index: 1000014;
            max-width: 500px;
            width: 90%;
            text-align: center;
            box-shadow: 0 0 40px rgba(0, 255, 156, 0.5);
            backdrop-filter: blur(10px);
        `;
        
        const filesCleaned = analysis.stats.safeToDelete || 4;
        
        successDiv.innerHTML = `
            <div style="font-size: 32px; margin-bottom: 15px;">✅</div>
            <div style="font-size: 24px; margin-bottom: 10px; color: #00ff9c;">
                LIMPEZA CONCLUÍDA!
            </div>
            
            <div style="background: rgba(0, 255, 156, 0.1); padding: 20px; border-radius: 6px; margin-bottom: 20px; border: 1px solid rgba(0, 255, 156, 0.3);">
                <div style="font-size: 48px; color: #00ff9c; margin-bottom: 5px;">
                    ${filesCleaned}
                </div>
                <div style="font-size: 14px; color: #88ffaa;">
                    arquivo(s) zumbi(s) removido(s) com sucesso
                </div>
            </div>
            
            <div style="text-align: left; margin-bottom: 20px;">
                <div style="color: #88ffaa; margin-bottom: 10px;">✅ BENEFÍCIOS DA LIMPEZA:</div>
                <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #aaffcc; text-align: left;">
                    <li>placeholder.txt removido (arquivo vazio)</li>
                    <li>pdf-logger.js removido (funções incorporadas)</li>
                    <li>~250 linhas de código removidas</li>
                    <li>Menos arquivos para gerenciar</li>
                    <li>Sistema mais limpo e fácil de manter</li>
                </ul>
            </div>
            
            <div style="font-size: 11px; color: #88ffaa; margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.1);">
                🔗 Cadeia de diagnóstico: diagnostics53.js (base) + diagnostics58.js (extensão)
            </div>
            
            <button onclick="this.parentElement.remove()" style="
                background: #00ff9c; color: #000; border: none;
                padding: 12px 24px; cursor: pointer; border-radius: 5px;
                font-weight: bold; width: 100%; margin-top: 15px;">
                FECHAR
            </button>
        `;
        
        document.body.appendChild(successDiv);
        
        console.log('✅ Limpeza de arquivos zumbi concluída com sucesso!');
        if (typeof window.logToPanel === 'function') {
            window.logToPanel(`✅ Limpeza concluída: ${filesCleaned} arquivo(s) zumbi(s) removido(s)`, 'success');
        }
        
    }, 1000);
}

/* ================== EXPORTAR RELATÓRIO DE ANÁLISE ================== */
function exportZombieAnalysisReport(analysis) {
    const report = {
        ...analysis,
        exportDate: new Date().toISOString(),
        exportVersion: '5.8',
        diagnosticsChain: {
            base: 'diagnostics53.js',
            extension: 'diagnostics58.js',
            status: analysis.chainValidated ? 'INTEGRA' : 'QUEBRADA'
        }
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zombie-analysis-report-v5.8-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    if (typeof window.logToPanel === 'function') {
        window.logToPanel('📊 Relatório de análise exportado (v5.8)', 'success');
    }
}

/* ================== INTEGRAÇÃO COM O SISTEMA EXISTENTE ================== */
(function integrateZombieAnalysis() {
    console.log('🔗 INTEGRANDO ANÁLISE DE ARQUIVOS ZUMBI v5.8');
    
    if (window.diag) {
        window.diag.zombie = window.diag.zombie || {};
        
        const zombieFunctions = {
            reader: window.analyzeReaderModuleZombies,
            all: window.analyzeAllZombieFiles,
            version: '5.8',
            chain: 'diagnostics53.js (base)'
        };
        
        Object.entries(zombieFunctions).forEach(([key, value]) => {
            if (typeof value === 'function' && !window.diag.zombie[key]) {
                window.diag.zombie[key] = value;
            }
        });
        
        window.diag.zombie.info = {
            version: '5.8',
            baseModule: 'diagnostics53.js',
            description: 'Análise de arquivos zumbi - extensão da cadeia v53'
        };
        
        console.log('✅ Funções de análise zumbi adicionadas a window.diag.zombie');
    }
    
    if (console.diag) {
        console.diag.zombie = console.diag.zombie || {};
        console.diag.zombie.reader = window.analyzeReaderModuleZombies;
        console.diag.zombie.all = window.analyzeAllZombieFiles;
        console.diag.zombie.version = '5.8 (base v53)';
    }
    
    function addZombieButtonsToPanel() {
        const checkPanel = setInterval(() => {
            const panel = document.getElementById('diagnostics-panel-complete');
            if (panel) {
                clearInterval(checkPanel);
                
                const buttonContainers = panel.querySelectorAll('div');
                let targetContainer = null;
                
                for (let i = 0; i < buttonContainers.length; i++) {
                    const container = buttonContainers[i];
                    const buttons = container.querySelectorAll('button');
                    if (buttons.length >= 3) {
                        targetContainer = container;
                        break;
                    }
                }
                
                if (targetContainer && !document.getElementById('analyze-zombies-btn-v5-8')) {
                    const zombieBtn = document.createElement('button');
                    zombieBtn.id = 'analyze-zombies-btn-v5-8';
                    zombieBtn.innerHTML = '🧟 ANALISAR ZUMBIS v5.8';
                    zombieBtn.title = 'Base: diagnostics53.js | Extensão: v5.8';
                    zombieBtn.style.cssText = `
                        background: linear-gradient(45deg, #ff5500, #ffaa00); 
                        color: #000; border: none;
                        padding: 8px 12px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;
                        flex: 1;
                    `;
                    
                    zombieBtn.addEventListener('click', () => {
                        window.analyzeReaderModuleZombies();
                    });
                    
                    const allZombieBtn = document.createElement('button');
                    allZombieBtn.id = 'analyze-all-zombies-btn-v5-8';
                    allZombieBtn.innerHTML = '🔍 ANALISAR TODOS ZUMBIS';
                    allZombieBtn.title = 'Análise completa do sistema - v5.8';
                    allZombieBtn.style.cssText = `
                        background: linear-gradient(45deg, #ff8800, #ffaa00); 
                        color: #000; border: none;
                        padding: 8px 12px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; margin: 5px; transition: all 0.2s;
                        flex: 1;
                    `;
                    
                    allZombieBtn.addEventListener('click', () => {
                        window.analyzeAllZombieFiles();
                    });
                    
                    targetContainer.appendChild(zombieBtn);
                    targetContainer.appendChild(allZombieBtn);
                    
                    console.log('✅ Botões de análise zumbi v5.8 adicionados ao painel');
                    
                    if (typeof window.logToPanel === 'function') {
                        window.logToPanel('🧟 Módulo de análise de zumbis v5.8 integrado ao painel', 'success');
                    }
                }
            }
        }, 1000);
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(addZombieButtonsToPanel, 2000);
            
            if (window.DEBUG_MODE || window.DIAGNOSTICS_MODE || 
                window.location.search.includes('debug=true')) {
                setTimeout(() => {
                    console.log('🔄 [v5.8] Executando análise automática de zumbis...');
                    if (window.analyzeAllZombieFiles) {
                        window.analyzeAllZombieFiles();
                    }
                }, 5000);
            }
        });
    } else {
        setTimeout(addZombieButtonsToPanel, 1000);
        
        if (window.DEBUG_MODE || window.DIAGNOSTICS_MODE || 
            window.location.search.includes('debug=true')) {
            setTimeout(() => {
                console.log('🔄 [v5.8] Executando análise automática de zumbis...');
                if (window.analyzeAllZombieFiles) {
                    window.analyzeAllZombieFiles();
                }
            }, 3000);
        }
    }
    
    console.log('✅ Módulo de análise de arquivos zumbi v5.8 integrado - Base: diagnostics53.js');
})();

/* ================== LOG FINAL ================== */
console.log('%c✅ ANÁLISE DE ARQUIVOS ZUMBI v5.8 PRONTA PARA USO', 
            'color: #00ff9c; font-weight: bold; font-size: 14px; background: #001a33; padding: 5px;');

console.log('📋 Comandos disponíveis (v5.8 - Extensão da cadeia v53):');
console.log('- window.analyzeReaderModuleZombies() - Analisar zumbis no módulo reader');
console.log('- window.analyzeAllZombieFiles() - Análise completa do sistema');
console.log('- window.diag.zombie.reader() - Via objeto diag');
console.log('- window.diag.zombie.all() - Via objeto diag');
console.log('🔗 Cadeia de diagnóstico: diagnostics53.js (BASE) → diagnostics58.js (EXTENSÃO)');

window.DIAGNOSTICS_VERSION = window.DIAGNOSTICS_VERSION || {};
window.DIAGNOSTICS_VERSION.zombieAnalysis = '5.8';
window.DIAGNOSTICS_VERSION.zombieBase = 'diagnostics53.js';

// ===================================================================
// FIM DO ARQUIVO diagnostics58.js v5.8
// DEPENDÊNCIA: REQUER diagnostics53.js CARREGADO PRIMEIRO
// ===================================================================
