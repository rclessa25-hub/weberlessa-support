// debug/diagnostics.js
/* ================== VERIFICAÇÃO FINAL DE MIGRAÇÃO (PARA TERCEIROS) ================== */
window.verifyMediaMigrationFinal = function() {
    console.group('🔍 VERIFICAÇÃO FINAL DA MIGRAÇÃO DE MÍDIA');
    console.log('Esta verificação deve ser executada ANTES de remover módulos antigos.');
    console.log('Execute no console: window.verifyMediaMigrationFinal()');
    console.log('---');
    
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
    
    console.table(checks);
    
    const passedChecks = Object.values(checks).filter(v => v === true).length;
    const totalChecks = Object.keys(checks).length;
    const allValid = Object.values(checks).every(v => v === true);
    
    console.log('---');
    console.log(`📊 Resultado: ${passedChecks}/${totalChecks} verificações passaram`);
    
    if (allValid) {
        console.log('✅ TODAS AS VERIFICAÇÕES PASSARAM - PRONTO PARA MIGRAÇÃO FINAL');
        console.log('✅ SISTEMA VALIDADO! Pronto para remover módulos antigos.');
        console.log('✅ Você pode remover com segurança:');
        console.log('   - admin-antigo.js');
        console.log('   - gallery-antigo.js');
        console.log('   - Módulos duplicados');
        console.log('   - Scripts de fallback não mais necessários');
        
        alert('✅ SISTEMA VALIDADO COM SUCESSO!\n\nPronto para remover módulos antigos.\n\nPode remover:\n- Módulos admin/gallery antigos\n- Scripts duplicados\n- Código de fallback desnecessário');
        
        return {
            status: 'SUCCESS',
            message: 'Sistema validado para migração',
            checks: checks,
            passed: passedChecks,
            total: totalChecks,
            percentage: 100
        };
    } else {
        console.error('❌ VERIFICAÇÕES FALHARAM - NÃO PROSSEGUIR COM REMOÇÃO');
        console.error('Verifique os seguintes itens:');
        
        Object.entries(checks).forEach(([check, passed]) => {
            if (!passed) {
                console.error(`   ❌ ${check}`);
            }
        });
        
        console.error('---');
        console.error('🔧 Ações recomendadas:');
        console.error('1. Verificar se todos os scripts foram carregados');
        console.error('2. Confirmar que não há erros no console');
        console.error('3. Testar funcionalidades manualmente');
        console.error('4. Executar diagnóstico completo: window.runCompleteDiagnosis()');
        
        alert('⚠️ VERIFICAÇÕES FALHARAM!\n\nNão remover módulos antigos ainda.\n\nExecute diagnóstico completo ou verifique:\n1. Console por erros\n2. Scripts carregados\n3. Funcionalidades principais');
        
        return {
            status: 'FAILED',
            message: 'Não prosseguir com migração',
            checks: checks,
            passed: passedChecks,
            total: totalChecks,
            percentage: Math.round((passedChecks / totalChecks) * 100),
            failedChecks: Object.entries(checks).filter(([_, passed]) => !passed).map(([check]) => check)
        };
    }
    
    console.groupEnd();
};

/* ================== GERADOR DE RELATÓRIO DE MIGRAÇÃO ================== */
window.generateMigrationReport = function() {
    const report = {
        timestamp: new Date().toISOString(),
        pageUrl: window.location.href,
        userAgent: navigator.userAgent,
        systemInfo: {
            MediaSystem: typeof MediaSystem !== 'undefined',
            PdfLogger: typeof PdfLogger !== 'undefined',
            ValidationSystem: typeof ValidationSystem !== 'undefined',
            supabase: typeof supabase !== 'undefined',
            properties: typeof properties !== 'undefined'
        },
        domElements: {
            pdfModal: !!document.getElementById('pdfModal'),
            pdfPassword: !!document.getElementById('pdfPassword'),
            mediaUpload: !!document.getElementById('mediaUpload'),
            uploadPreview: !!document.getElementById('uploadPreview'),
            adminPanel: !!document.getElementById('adminPanel')
        },
        functions: {
            processAndSavePdfs: typeof window.processAndSavePdfs === 'function',
            clearAllPdfs: typeof window.clearAllPdfs === 'function',
            getMediaUrlsForProperty: typeof window.getMediaUrlsForProperty === 'function'
        }
    };
    
    // Executar verificação e incluir resultados
    const verification = window.verifyMediaMigrationFinal();
    report.verification = verification;
    
    // Gerar relatório JSON
    const reportJson = JSON.stringify(report, null, 2);
    
    // Criar elemento para download
    const blob = new Blob([reportJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `migration-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('📄 Relatório de migração gerado e baixado');
    
    return report;
};

/* ================== CHECKLIST DE MIGRAÇÃO SEGURA ================== */
window.migrationSafetyChecklist = function() {
    console.group('📋 CHECKLIST DE MIGRAÇÃO SEGURA');
    console.log('Execute ESTES passos ANTES de remover qualquer código:');
    console.log('');
    console.log('1. ✅ BACKUP COMPLETO');
    console.log('   - Backup do banco de dados');
    console.log('   - Backup dos arquivos do projeto');
    console.log('   - Backup dos uploads/media existentes');
    console.log('');
    console.log('2. ✅ TESTES EM AMBIENTE DE STAGING');
    console.log('   - Testar upload de imagens');
    console.log('   - Testar upload de PDFs');
    console.log('   - Testar proteção por senha em PDFs');
    console.log('   - Testar em diferentes dispositivos');
    console.log('   - Testar em diferentes navegadores');
    console.log('');
    console.log('3. ✅ VALIDAÇÃO TÉCNICA');
    console.log('   - Executar: window.verifyMediaMigrationFinal()');
    console.log('   - Executar: window.runCompleteDiagnosis()');
    console.log('   - Verificar console por erros');
    console.log('   - Testar performance');
    console.log('');
    console.log('4. ✅ PLANO DE ROLLBACK');
    console.log('   - Manter cópia dos arquivos antigos');
    console.log('   - Documentar passos para reverter');
    console.log('   - Definir critérios de falha');
    console.log('');
    console.log('5. ✅ COMUNICAÇÃO');
    console.log('   - Informar equipe sobre manutenção');
    console.log('   - Agendar janela de manutenção');
    console.log('   - Preparar mensagem de "em manutenção"');
    console.log('');
    console.log('6. ✅ MONITORAMENTO PÓS-MIGRAÇÃO');
    console.log('   - Monitorar logs por 24h');
    console.log('   - Testar funcionalidades críticas');
    console.log('   - Coletar feedback de usuários');
    console.log('');
    console.log('✅ Quando TODOS os itens estiverem marcados, prossiga.');
    console.groupEnd();
    
    return {
        checklist: [
            'Backup completo realizado',
            'Testes em staging realizados',
            'Validação técnica concluída',
            'Plano de rollback preparado',
            'Comunicação realizada',
            'Monitoramento configurado'
        ],
        instructions: 'Execute cada passo sequencialmente e marque quando concluído'
    };
};

/* ================== INSTRUÇÕES PARA TERCEIROS ================== */
window.showMigrationInstructions = function() {
    const instructions = `
    🚀 INSTRUÇÕES PARA MIGRAÇÃO DE MÍDIA - PARA TERCEIROS
    
    ========== ANTES DE INICIAR ==========
    1. Execute no console: window.migrationSafetyChecklist()
    2. Siga TODOS os passos do checklist
    3. NÃO pule nenhuma etapa
    
    ========== VALIDAÇÃO OBRIGATÓRIA ==========
    1. window.verifyMediaMigrationFinal() - DEVE retornar SUCCESS
    2. window.runCompleteDiagnosis() - Health score deve ser > 90%
    3. Teste manual: Upload de imagem e PDF
    
    ========== SE TUDO VALIDAR ==========
    Você pode remover com segurança:
    • Arquivos admin-*.js antigos (exceto admin.js atual)
    • Arquivos gallery-*.js antigos
    • Módulos duplicados (media-*.js antigos)
    • Scripts de fallback não mais necessários
    
    ========== EM CASO DE ERROS ==========
    1. NÃO remova nada
    2. Execute: window.runPdfMobileDiagnosis()
    3. Verifique console do navegador
    4. Consulte logs de erro
    
    ========== CONTATO/SUPORTE ==========
    • Console: Execute funções de diagnóstico
    • Relatórios: window.generateMigrationReport()
    • Verificação: window.verifyMediaMigrationFinal()
    
    ⚠️ NUNCA REMOVA MÓDULOS ANTIGOS SEM VALIDAÇÃO COMPLETA
    `;
    
    console.log(instructions);
    
    // Criar popup visual
    const popup = document.createElement('div');
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 600px;
        max-height: 80vh;
        background: #0b0b0b;
        color: #00ff9c;
        border: 3px solid #00ff9c;
        padding: 20px;
        border-radius: 10px;
        z-index: 1000000;
        font-family: monospace;
        font-size: 12px;
        overflow-y: auto;
        box-shadow: 0 0 50px rgba(0, 255, 156, 0.5);
        white-space: pre-line;
        line-height: 1.5;
    `;
    
    popup.innerHTML = `
        <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
            <h2 style="margin: 0; color: #00ff9c;">🚀 INSTRUÇÕES DE MIGRAÇÃO</h2>
            <button onclick="this.parentElement.parentElement.remove()" style="
                background: #ff5555; color: white; border: none;
                padding: 5px 10px; cursor: pointer; border-radius: 3px;">
                FECHAR
            </button>
        </div>
        <div style="color: #888; margin-bottom: 15px;">
            Instruções para remover módulos antigos com segurança
        </div>
        <div style="margin-bottom: 20px;">
            ${instructions.replace(/\n/g, '<br>')}
        </div>
        <div style="display: flex; gap: 10px; justify-content: center;">
            <button onclick="window.verifyMediaMigrationFinal()" style="
                background: #00ff9c; color: black; border: none;
                padding: 10px 20px; cursor: pointer; border-radius: 4px;
                font-weight: bold;">
                🔍 VALIDAR SISTEMA
            </button>
            <button onclick="window.generateMigrationReport()" style="
                background: #0088cc; color: white; border: none;
                padding: 10px 20px; cursor: pointer; border-radius: 4px;
                font-weight: bold;">
                📊 GERAR RELATÓRIO
            </button>
            <button onclick="window.migrationSafetyChecklist()" style="
                background: #ffaa00; color: black; border: none;
                padding: 10px 20px; cursor: pointer; border-radius: 4px;
                font-weight: bold;">
                📋 VER CHECKLIST
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    return instructions;
};

/* ================== ADICIONAR AO PAINEL DE DIAGNÓSTICO ================== */
function addMigrationTabToDiagnostics() {
    // Esta função adiciona uma aba de migração ao painel de diagnóstico existente
    const tabsContainer = document.getElementById('tabs');
    if (!tabsContainer) return;
    
    // Adicionar nova aba
    const migrationTab = document.createElement('button');
    migrationTab.className = 'tab-btn';
    migrationTab.dataset.tab = 'migration';
    migrationTab.innerHTML = '🚀 MIGRAÇÃO';
    migrationTab.style.cssText = `
        background: transparent;
        color: #888;
        border: none;
        padding: 8px 16px;
        cursor: pointer;
    `;
    
    tabsContainer.appendChild(migrationTab);
    
    // Adicionar conteúdo da aba
    const contentArea = document.getElementById('content-area');
    if (contentArea) {
        const migrationContent = document.createElement('div');
        migrationContent.id = 'migration-content';
        migrationContent.className = 'tab-content';
        migrationContent.style.display = 'none';
        
        migrationContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <h3 style="color: #ffaa00; margin-bottom: 10px;">🚀 VERIFICAÇÃO DE MIGRAÇÃO</h3>
                <div style="background: #1a1a00; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                    <p style="color: #ffaa00; margin-bottom: 15px;">
                        ⚠️ Execute esta verificação ANTES de remover módulos antigos
                    </p>
                    <button id="run-migration-check" style="
                        background: #ffaa00; color: black; border: none;
                        padding: 12px 24px; cursor: pointer; border-radius: 4px;
                        font-weight: bold; width: 100%; margin-bottom: 10px;">
                        🔍 EXECUTAR VERIFICAÇÃO FINAL
                    </button>
                    <div style="font-size: 11px; color: #888;">
                        Valida todos os sistemas antes da migração
                    </div>
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="color: #ffaa00; margin-bottom: 10px;">📋 CHECKLIST DE SEGURANÇA</h4>
                <button id="show-checklist" style="
                    background: #333; color: #ffaa00; border: 1px solid #ffaa00;
                    padding: 10px 20px; cursor: pointer; border-radius: 4px;
                    width: 100%; margin-bottom: 15px;">
                    📋 VER CHECKLIST COMPLETO
                </button>
                
                <h4 style="color: #ffaa00; margin-bottom: 10px;">📊 RELATÓRIOS</h4>
                <button id="generate-report" style="
                    background: #333; color: #0088cc; border: 1px solid #0088cc;
                    padding: 10px 20px; cursor: pointer; border-radius: 4px;
                    width: 100%; margin-bottom: 15px;">
                    📊 GERAR RELATÓRIO DE MIGRAÇÃO
                </button>
            </div>
            
            <div style="background: #001a00; padding: 15px; border-radius: 6px; border-left: 3px solid #00ff9c;">
                <h4 style="color: #00ff9c; margin-bottom: 10px;">✅ MÓDULOS QUE PODEM SER REMOVIDOS</h4>
                <ul style="color: #888; font-size: 11px; padding-left: 20px;">
                    <li>admin-antigo.js / admin-backup.js</li>
                    <li>gallery-antigo.js / gallery-legacy.js</li>
                    <li>media-*.js (exceto media-core.js e media-ui.js)</li>
                    <li>pdf-*.js (exceto pdf-core.js e pdf-ui.js)</li>
                    <li>Scripts de fallback não utilizados</li>
                </ul>
                <p style="color: #ff5555; font-size: 11px; margin-top: 10px;">
                    ⚠️ Apenas remova após validação completa!
                </p>
            </div>
        `;
        
        contentArea.appendChild(migrationContent);
        
        // Configurar eventos
        document.getElementById('run-migration-check')?.addEventListener('click', () => {
            window.verifyMediaMigrationFinal();
        });
        
        document.getElementById('show-checklist')?.addEventListener('click', () => {
            window.migrationSafetyChecklist();
        });
        
        document.getElementById('generate-report')?.addEventListener('click', () => {
            window.generateMigrationReport();
        });
    }
}

// Adicionar a aba de migração quando o painel for criado
if (DEBUG_MODE && DIAGNOSTICS_MODE) {
    // Aguardar criação do painel e então adicionar a aba
    setTimeout(() => {
        addMigrationTabToDiagnostics();
    }, 2000);
}

// Adicionar ao final do arquivo, antes das exportações
console.log('🚀 Módulo de verificação de migração carregado.');
console.log('Comandos disponíveis:');
console.log('• window.verifyMediaMigrationFinal() - Validação final');
console.log('• window.generateMigrationReport() - Relatório completo');
console.log('• window.migrationSafetyChecklist() - Checklist de segurança');
console.log('• window.showMigrationInstructions() - Instruções detalhadas');
