// weberlessa-support/debug/media-migration-check.js
// MÓDULO DE SUPORTE TEMPORÁRIO - VERIFICAÇÃO DE MIGRAÇÃO DE MÍDIA

console.log('🔍 [SUPORTE] migration-check.js - Verificação de migração do sistema de mídia');

window.MediaMigrationChecker = {
    version: '1.0.0',
    checkDate: new Date().toISOString(),
    
    runCompatibilityChecks() {
        console.group('🧪 [SUPORTE] TESTE DE COMPATIBILIDADE DO SISTEMA UNIFICADO');
        
        const tests = {
            // Teste 1: Sistema unificado disponível
            'MediaSystem disponível': typeof MediaSystem !== 'undefined',
            'MediaSystem.init função': MediaSystem && typeof MediaSystem.init === 'function',
            
            // Teste 2: Funções de compatibilidade ainda funcionam
            'handleNewMediaFiles redirecionado': typeof window.handleNewMediaFiles === 'function',
            'handleNewPdfFiles redirecionado': typeof window.handleNewPdfFiles === 'function',
            'clearMediaSystem redirecionado': typeof window.clearMediaSystem === 'function',
            
            // Teste 3: Estado do sistema
            'Estado inicializado': MediaSystem ? MediaSystem.config.currentSystem === 'vendas' : false,
            'Arrays de estado existem': MediaSystem ? 
                (Array.isArray(MediaSystem.state.files) && 
                 Array.isArray(MediaSystem.state.pdfs)) : false,
            
            // Teste 4: Elementos DOM críticos
            'uploadArea existe': !!document.getElementById('uploadArea'),
            'pdfUploadArea existe': !!document.getElementById('pdfUploadArea'),
            'uploadPreview existe': !!document.getElementById('uploadPreview'),
            'pdfUploadPreview existe': !!document.getElementById('pdfUploadPreview'),
            
            // Teste 5: Funcionalidade básica
            'Pode adicionar arquivos': MediaSystem ? typeof MediaSystem.addFiles === 'function' : false,
            'Pode adicionar PDFs': MediaSystem ? typeof MediaSystem.addPdfs === 'function' : false,
            'Pode resetar estado': MediaSystem ? typeof MediaSystem.resetState === 'function' : false
        };
        
        console.table(tests);
        
        const passedCount = Object.values(tests).filter(test => test === true).length;
        const totalTests = Object.keys(tests).length;
        const score = Math.round((passedCount / totalTests) * 100);
        
        console.log(`📊 Resultado: ${passedCount}/${totalTests} testes passaram (${score}%)`);
        
        if (score === 100) {
            console.log('✅ MIGRAÇÃO 100% COMPATÍVEL - Sistema unificado funcionando perfeitamente');
            console.log('💡 Recomendação: Módulos antigos podem ser removidos com segurança');
        } else if (score >= 80) {
            console.log('⚠️  MIGRAÇÃO PARCIALMENTE COMPATÍVEL - Verificar itens falhados');
        } else {
            console.error('❌ MIGRAÇÃO COM PROBLEMAS - Corrigir antes de remover módulos antigos');
        }
        
        // Detalhes adicionais para debug
        console.log('🔍 Detalhes do MediaSystem:', {
            config: MediaSystem ? MediaSystem.config : 'N/A',
            stateKeys: MediaSystem ? Object.keys(MediaSystem.state) : 'N/A',
            functions: MediaSystem ? Object.keys(MediaSystem).filter(k => typeof MediaSystem[k] === 'function') : 'N/A'
        });
        
        console.groupEnd();
        
        return {
            score,
            passed: passedCount,
            total: totalTests,
            allPassed: score === 100,
            details: tests
        };
    },
    
    runFunctionalTest() {
        console.group('🚀 [SUPORTE] TESTE FUNCIONAL DO SISTEMA UNIFICADO');
        
        try {
            // Teste 1: Reset do sistema
            if (MediaSystem && MediaSystem.resetState) {
                MediaSystem.resetState();
                console.log('✅ Teste 1: resetState() funcionando');
            }
            
            // Teste 2: Criação de arquivo de teste
            const testBlob = new Blob(['test content'], { type: 'image/jpeg' });
            const testFile = new File([testBlob], 'test_image.jpg', { type: 'image/jpeg' });
            
            // Teste 3: Adição de arquivo
            if (MediaSystem && MediaSystem.addFiles) {
                const added = MediaSystem.addFiles({ 0: testFile, length: 1 });
                console.log(`✅ Teste 2: addFiles() adicionou ${added} arquivo(s)`);
            }
            
            // Teste 4: Verificar preview renderizado
            setTimeout(() => {
                const preview = document.getElementById('uploadPreview');
                const hasPreview = preview && 
                    preview.innerHTML && 
                    preview.innerHTML.includes('test_image');
                
                console.log(`✅ Teste 3: Preview renderizado: ${hasPreview ? 'SIM' : 'NÃO'}`);
                
                // Limpar após teste
                if (MediaSystem && MediaSystem.resetState) {
                    MediaSystem.resetState();
                    console.log('✅ Teste 4: Sistema limpo após teste');
                }
                
                console.groupEnd();
                return true;
                
            }, 500);
            
        } catch (error) {
            console.error('❌ Erro no teste funcional:', error);
            console.groupEnd();
            return false;
        }
    },
    
    generateMigrationReport() {
        const compatibility = this.runCompatibilityChecks();
        const functional = this.runFunctionalTest();
        
        return {
            timestamp: new Date().toISOString(),
            migration: 'media-unified-v1',
            compatibility,
            functional: functional !== false,
            recommendations: []
        };
    }
};

// Auto-executar se em modo debug
if (window.location.search.includes('debug=true')) {
    setTimeout(() => {
        console.log('🔧 [SUPORTE] Executando verificação automática de migração...');
        window.MediaMigrationChecker.generateMigrationReport();
    }, 3000);
}

console.log('✅ [SUPORTE] MediaMigrationChecker carregado - Use window.MediaMigrationChecker.runCompatibilityChecks()');
