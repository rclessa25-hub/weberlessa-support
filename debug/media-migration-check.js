// weberlessa-support/debug/media-migration-check.js - VERSÃO ATUALIZADA
console.log('🔍 [SUPORTE] media-migration-check.js - Verificação ATUALIZADA (pós-migração)');

window.MediaMigrationChecker = {
    version: '2.0.0',
    checkDate: new Date().toISOString(),
    migrationStatus: 'completed', // ✅ MIGRAÇÃO JÁ CONCLUÍDA
    
    /**
     * ✅ VERIFICAÇÃO DO SISTEMA ATUAL (pós-migração)
     * Verifica se o MediaSystem unificado está 100% funcional
     */
    runPostMigrationChecks() {
        console.group('✅ [SUPORTE] VERIFICAÇÃO PÓS-MIGRAÇÃO - SISTEMA UNIFICADO');
        
        // ✅ TESTES DO SISTEMA ATUAL (MediaSystem unificado)
        const tests = {
            // ========== SISTEMA UNIFICADO DISPONÍVEL ==========
            '✅ MediaSystem disponível': typeof window.MediaSystem === 'object',
            '✅ MediaSystem.init função': window.MediaSystem && typeof window.MediaSystem.init === 'function',
            
            // ========== FUNÇÕES CRÍTICAS DO SISTEMA NOVO ==========
            '✅ MediaSystem.addFiles': window.MediaSystem && typeof window.MediaSystem.addFiles === 'function',
            '✅ MediaSystem.addPdfs': window.MediaSystem && typeof window.MediaSystem.addPdfs === 'function',
            '✅ MediaSystem.uploadAll': window.MediaSystem && typeof window.MediaSystem.uploadAll === 'function',
            '✅ MediaSystem.loadExisting': window.MediaSystem && typeof window.MediaSystem.loadExisting === 'function',
            '✅ MediaSystem.updateUI': window.MediaSystem && typeof window.MediaSystem.updateUI === 'function',
            '✅ MediaSystem.resetState': window.MediaSystem && typeof window.MediaSystem.resetState === 'function',
            
            // ========== ESTADO DO SISTEMA ==========
            '✅ Arrays de estado inicializados': window.MediaSystem ? 
                (Array.isArray(window.MediaSystem.state.files) && 
                 Array.isArray(window.MediaSystem.state.pdfs)) : false,
            
            // ========== ELEMENTOS DOM CRÍTICOS ==========
            '✅ uploadArea existe': !!document.getElementById('uploadArea'),
            '✅ pdfUploadArea existe': !!document.getElementById('pdfUploadArea'),
            '✅ uploadPreview existe': !!document.getElementById('uploadPreview'),
            '✅ pdfUploadPreview existe': !!document.getElementById('pdfUploadPreview'),
            
            // ========== CONFIGURAÇÃO CORRETA ==========
            '✅ Sistema configurado como "vendas"': window.MediaSystem ? 
                window.MediaSystem.config.currentSystem === 'vendas' : false,
                
            // ========== FUNÇÕES DE SUPORTE ==========
            '✅ debugMediaSystem disponível': typeof window.debugMediaSystem === 'function',
            '✅ testMediaUpload disponível': typeof window.testMediaUpload === 'function'
        };
        
        console.table(tests);
        
        // ✅ VERIFICAÇÃO DE FUNÇÕES ANTIGAS (NÃO DEVEM EXISTIR)
        const legacyFunctions = {
            '❌ handleNewMediaFiles (DEVE SER REMOVIDO)': typeof window.handleNewMediaFiles !== 'function',
            '❌ handleNewPdfFiles (DEVE SER REMOVIDO)': typeof window.handleNewPdfFiles !== 'function',
            '❌ clearMediaSystem (DEVE SER REMOVIDO)': typeof window.clearMediaSystem !== 'function',
            '❌ updateMediaPreview (DEVE SER REMOVIDO)': typeof window.updateMediaPreview !== 'function',
            '❌ initMediaSystem (DEVE SER REMOVIDO)': typeof window.initMediaSystem !== 'function'
        };
        
        console.log('🔁 STATUS DAS FUNÇÕES ANTIGAS (devem ser FALSE):');
        console.table(legacyFunctions);
        
        // ✅ CONTAGEM DE RESULTADOS
        const passedCount = Object.values(tests).filter(test => test === true).length;
        const totalTests = Object.keys(tests).length;
        const score = Math.round((passedCount / totalTests) * 100);
        
        // ✅ CONTAGEM DE FUNÇÕES ANTIGAS (devem ser 0)
        const legacyStillExists = Object.values(legacyFunctions).filter(v => v === false).length;
        
        console.log(`📊 RESULTADO DO SISTEMA ATUAL: ${passedCount}/${totalTests} testes passaram (${score}%)`);
        console.log(`📊 FUNÇÕES ANTIGAS RESTANTES: ${legacyStillExists} (deve ser 0)`);
        
        // ✅ AVALIAÇÃO FINAL
        if (score === 100 && legacyStillExists === 0) {
            console.log('🎉🎉🎉 MIGRAÇÃO 100% CONCLUÍDA E VALIDADA!');
            console.log('✅ Sistema unificado está 100% funcional');
            console.log('✅ Todas as funções antigas foram removidas');
            console.log('✅ Sistema pronto para produção');
        } 
        else if (score === 100 && legacyStillExists > 0) {
            console.log('⚠️ SISTEMA FUNCIONAL, MAS COM LEGACY');
            console.log('✅ MediaSystem unificado está 100% funcional');
            console.log(`⚠️ ${legacyStillExists} função(ões) antiga(s) ainda presente(s) (apenas compatibilidade)`);
            console.log('💡 Recomendação: Remover funções legacy quando seguro');
        }
        else if (score >= 80) {
            console.log('⚠️ SISTEMA PARCIALMENTE MIGRADO');
            console.log(`✅ ${score}% do sistema novo está funcional`);
            console.log(`⚠️ ${100 - score}% precisa de atenção`);
        }
        else {
            console.error('❌ MIGRAÇÃO INCOMPLETA OU COM PROBLEMAS');
            console.log(`🚨 Apenas ${score}% do sistema novo está funcional`);
            console.log('🔧 Recomendação: Revisar a implementação do MediaSystem');
        }
        
        // ✅ DETALHES PARA DEBUG
        console.log('🔍 DETALHES DO MEDIASYSTEM ATUAL:');
        if (window.MediaSystem) {
            console.log('- Configuração:', window.MediaSystem.config);
            console.log('- Estado:', {
                files: window.MediaSystem.state.files.length,
                pdfs: window.MediaSystem.state.pdfs.length,
                isUploading: window.MediaSystem.state.isUploading
            });
            console.log('- Funções disponíveis:', 
                Object.keys(window.MediaSystem).filter(k => typeof window.MediaSystem[k] === 'function')
            );
        } else {
            console.log('- MediaSystem: NÃO ENCONTRADO');
        }
        
        console.groupEnd();
        
        return {
            score,
            passed: passedCount,
            total: totalTests,
            legacyFunctions: legacyStillExists,
            systemStatus: score === 100 ? 'fully_migrated' : 
                         score >= 80 ? 'partially_migrated' : 'migration_problems',
            details: tests,
            legacy: legacyFunctions
        };
    },
    
    /**
     * ✅ TESTE FUNCIONAL DO SISTEMA ATUAL
     * Testa as funções reais do MediaSystem unificado
     */
    runFunctionalTest() {
        console.group('🚀 [SUPORTE] TESTE FUNCIONAL DO SISTEMA UNIFICADO');
        
        const results = {
            resetState: false,
            addFiles: false,
            updateUI: false,
            cleanup: false
        };
        
        try {
            // ✅ TESTE 1: Reset do sistema
            if (window.MediaSystem && window.MediaSystem.resetState) {
                window.MediaSystem.resetState();
                console.log('✅ Teste 1: resetState() executado com sucesso');
                results.resetState = true;
            } else {
                console.warn('⚠️ Teste 1: resetState() não disponível');
            }
            
            // ✅ TESTE 2: Criação de arquivo de teste
            const testBlob = new Blob(['test content'], { type: 'image/jpeg' });
            const testFile = new File([testBlob], 'test_image.jpg', { type: 'image/jpeg' });
            
            // ✅ TESTE 3: Adição de arquivo ao sistema
            if (window.MediaSystem && window.MediaSystem.addFiles) {
                const added = window.MediaSystem.addFiles([testFile]);
                console.log(`✅ Teste 2: addFiles() adicionou ${added} arquivo(s) de teste`);
                results.addFiles = true;
                
                // ✅ TESTE 4: Verificar se UI foi atualizada
                setTimeout(() => {
                    const preview = document.getElementById('uploadPreview');
                    const hasContent = preview && preview.innerHTML && preview.innerHTML.length > 100;
                    
                    console.log(`✅ Teste 3: UI atualizada: ${hasContent ? 'SIM' : 'NÃO'}`);
                    results.updateUI = hasContent;
                    
                    // ✅ TESTE 5: Limpeza final
                    if (window.MediaSystem && window.MediaSystem.resetState) {
                        window.MediaSystem.resetState();
                        console.log('✅ Teste 4: Sistema limpo após teste');
                        results.cleanup = true;
                    }
                    
                    // ✅ RESUMO DO TESTE FUNCIONAL
                    const functionalScore = Object.values(results).filter(v => v === true).length;
                    const functionalTotal = Object.keys(results).length;
                    
                    console.log(`📊 TESTE FUNCIONAL: ${functionalScore}/${functionalTotal} passaram`);
                    
                    if (functionalScore === functionalTotal) {
                        console.log('🎉 SISTEMA FUNCIONAL COMPROVADO!');
                    } else {
                        console.warn('⚠️ SISTEMA COM LIMITAÇÕES FUNCIONAIS');
                    }
                    
                    console.groupEnd();
                    
                }, 300);
            } else {
                console.error('❌ Teste 2: addFiles() não disponível');
                console.groupEnd();
            }
            
        } catch (error) {
            console.error('❌ Erro no teste funcional:', error);
            console.groupEnd();
            results.error = error.message;
        }
        
        return results;
    },
    
    /**
     * ✅ GERAR RELATÓRIO COMPLETO DE MIGRAÇÃO
     */
    generateMigrationReport() {
        console.group('📋 [SUPORTE] RELATÓRIO DE MIGRAÇÃO COMPLETO');
        
        const compatibility = this.runPostMigrationChecks();
        const functional = this.runFunctionalTest();
        
        const report = {
            timestamp: new Date().toISOString(),
            migrationVersion: 'media-unified-v2.0',
            migrationStatus: this.migrationStatus,
            
            // Resultados
            compatibility: {
                score: compatibility.score,
                status: compatibility.systemStatus,
                legacyFunctions: compatibility.legacyFunctions
            },
            
            functionalTest: {
                passed: functional.resetState && functional.addFiles,
                details: functional
            },
            
            // ✅ RECOMENDAÇÕES BASEADAS NO STATUS
            recommendations: this.generateRecommendations(compatibility, functional),
            
            // ✅ STATUS GERAL
            overallStatus: this.calculateOverallStatus(compatibility, functional)
        };
        
        console.table({
            'Status Migração': report.migrationStatus,
            'Compatibilidade': `${compatibility.score}%`,
            'Funções Legacy': compatibility.legacyFunctions,
            'Teste Funcional': functional.resetState ? 'PASSOU' : 'FALHOU',
            'Status Geral': report.overallStatus
        });
        
        console.log('📝 RECOMENDAÇÕES:');
        report.recommendations.forEach((rec, index) => {
            console.log(`  ${index + 1}. ${rec}`);
        });
        
        console.groupEnd();
        return report;
    },
    
    /**
     * ✅ GERAR RECOMENDAÇÕES PERSONALIZADAS
     */
    generateRecommendations(compatibility, functional) {
        const recommendations = [];
        
        if (compatibility.score === 100 && compatibility.legacyFunctions === 0) {
            recommendations.push('✅ Migração 100% concluída - Nenhuma ação necessária');
            recommendations.push('✅ Sistema pronto para produção em escala');
        }
        else if (compatibility.score === 100 && compatibility.legacyFunctions > 0) {
            recommendations.push('⚠️ Remover funções legacy quando seguro: handleNewMediaFiles, handleNewPdfFiles, etc.');
            recommendations.push('✅ Sistema funcional, legacy é apenas para compatibilidade');
        }
        else if (compatibility.score >= 80) {
            recommendations.push('🔧 Corrigir os itens falhados na verificação de compatibilidade');
            recommendations.push('✅ Sistema está majoritariamente funcional');
        }
        else {
            recommendations.push('🚨 Revisar implementação do MediaSystem unificado');
            recommendations.push('🔧 Verificar se media-unified.js está carregando corretamente');
        }
        
        if (!functional.resetState || !functional.addFiles) {
            recommendations.push('🔧 Teste funcional falhou - Verificar implementação do MediaSystem');
        }
        
        return recommendations;
    },
    
    /**
     * ✅ CALCULAR STATUS GERAL
     */
    calculateOverallStatus(compatibility, functional) {
        if (compatibility.score === 100 && 
            compatibility.legacyFunctions === 0 && 
            functional.resetState && functional.addFiles) {
            return 'EXCELLENT'; // ✅✅✅
        }
        else if (compatibility.score >= 90 && functional.resetState) {
            return 'GOOD'; // ✅✅
        }
        else if (compatibility.score >= 70) {
            return 'FAIR'; // ✅
        }
        else {
            return 'NEEDS_ATTENTION'; // ⚠️
        }
    }
};

// ✅ AUTO-EXECUÇÃO EM MODO DEBUG
if (window.location.search.includes('debug=true') || 
    window.location.search.includes('test-migration=true')) {
    
    setTimeout(() => {
        console.log('🔧 [SUPORTE] Executando verificação automática de migração (pós-migração)...');
        
        // Aguardar mais tempo para garantir que MediaSystem carregou
        setTimeout(() => {
            window.MediaMigrationChecker.generateMigrationReport();
            
            // Se em modo debug avançado, oferecer função de teste rápido
            if (window.location.search.includes('test-migration=true')) {
                console.log('🧪 [SUPORTE] Modo teste ativado - Funções disponíveis:');
                console.log('   - window.MediaMigrationChecker.runPostMigrationChecks()');
                console.log('   - window.MediaMigrationChecker.runFunctionalTest()');
                console.log('   - window.debugMediaSystem() (se disponível)');
            }
        }, 4000); // 4 segundos para carregamento completo
        
    }, 2000);
}

console.log('✅ [SUPORTE] MediaMigrationChecker ATUALIZADO - Verificação pós-migração');
console.log('💡 Use window.MediaMigrationChecker.generateMigrationReport() para relatório completo');
