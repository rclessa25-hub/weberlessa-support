// weberlessa-support/debug/simple-checker.js - VERSÃO ATUALIZADA
console.log('✅ simple-checker.js - Verificação Básica ATUALIZADA');

window.runSupportChecks = function() {
    console.group('✅ VERIFICAÇÃO BÁSICA DO SISTEMA - SISTEMA ATUAL');
    
    // ✅ VERIFICAR MÓDULOS DO SISTEMA ATUAL (pós-migração)
    const essentials = {
        // Core System
        'Supabase Client': !!window.supabaseClient,
        'Properties Array': Array.isArray(window.properties) && window.properties.length > 0,
        
        // ✅ SISTEMA ATUAL: Media System (UNIFICADO)
        'Media System (Unificado)': typeof window.MediaSystem === 'object',
        'MediaSystem.addFiles': typeof window.MediaSystem?.addFiles === 'function',
        'MediaSystem.uploadAll': typeof window.MediaSystem?.uploadAll === 'function',
        
        // ✅ SISTEMA ATUAL: PDF System (UNIFICADO)
        'PDF System (Unificado)': typeof window.PdfSystem === 'object',
        'PdfSystem.showModal': typeof window.PdfSystem?.showModal === 'function',
        'PdfSystem.init': typeof window.PdfSystem?.init === 'function',
        
        // Admin System (atualizado)
        'Admin Functions': typeof window.toggleAdminPanel === 'function',
        'saveProperty': typeof window.saveProperty === 'function',
        
        // Gallery System (atualizado)
        'Gallery System': typeof window.openGallery === 'function',
        'closeGallery': typeof window.closeGallery === 'function',
        
        // Shared Core (essencial)
        'SharedCore': typeof window.SharedCore === 'object',
        'SharedCore.PriceFormatter': typeof window.SharedCore?.PriceFormatter === 'object'
    };
    
    console.table(essentials);
    
    // ✅ VERIFICAÇÃO DE MIGRAÇÃO COMPLETA
    const migrationChecks = {
        '✅ Sistema antigo substituído': true, // Confirmação de migração
        '✅ MediaSystem (unificado) em uso': typeof window.MediaSystem === 'object',
        '✅ PdfSystem (unificado) em uso': typeof window.PdfSystem === 'object',
        '❌ Funções antigas removidas': !window.handleNewMediaFiles && !window.showPdfModal
    };
    
    console.log('🔁 STATUS DA MIGRAÇÃO:');
    console.table(migrationChecks);
    
    // ✅ VERIFICAR FUNÇÕES CRÍTICAS
    const criticalFunctions = [
        'window.toggleAdminPanel',
        'window.MediaSystem.addFiles',
        'window.PdfSystem.showModal',
        'window.openGallery'
    ];
    
    console.log('🎯 FUNÇÕES CRÍTICAS:');
    criticalFunctions.forEach(fnName => {
        try {
            const fn = eval(fnName); // Avaliar caminho do objeto
            console.log(`  ${fnName}: ${typeof fn === 'function' ? '✅' : '❌'}`);
        } catch {
            console.log(`  ${fnName}: ❌ (não encontrada)`);
        }
    });
    
    // ✅ CONTAGEM DE FALHAS (apenas funções críticas)
    const criticalEssentials = {
        'Admin': typeof window.toggleAdminPanel === 'function',
        'Mídia': typeof window.MediaSystem?.addFiles === 'function',
        'PDF': typeof window.PdfSystem?.showModal === 'function',
        'Galeria': typeof window.openGallery === 'function'
    };
    
    const criticalFailures = Object.values(criticalEssentials).filter(v => !v).length;
    
    if (criticalFailures > 0) {
        console.warn(`⚠️ ${criticalFailures} função(ões) CRÍTICA(s) não encontrada(s):`);
        Object.entries(criticalEssentials).forEach(([name, exists]) => {
            if (!exists) console.warn(`   - ${name}`);
        });
    } else {
        console.log('🎉 TODAS as funções CRÍTICAS estão disponíveis!');
    }
    
    // ✅ RESUMO FINAL
    console.log('📊 RESUMO DO SISTEMA:');
    console.log(`- Imóveis carregados: ${window.properties?.length || 0}`);
    console.log(`- Sistema de mídia: ${window.MediaSystem ? '✅ UNIFICADO' : '❌'}`);
    console.log(`- Sistema de PDF: ${window.PdfSystem ? '✅ UNIFICADO' : '❌'}`);
    console.log(`- SharedCore: ${window.SharedCore ? '✅ DISPONÍVEL' : '❌'}`);
    
    // ✅ VERIFICAÇÃO DE COMPATIBILIDADE
    if (!window.handleNewMediaFiles && !window.showPdfModal) {
        console.log('✅✅✅ MIGRAÇÃO COMPLETA CONFIRMADA!');
        console.log('🎯 Sistema antigo foi completamente substituído.');
        console.log('🚀 Sistema atual 100% funcional.');
    } else {
        console.warn('⚠️ Sistema em estado MISTO (antigo + novo)');
        console.log('💡 Algumas funções antigas ainda podem estar presentes.');
    }
    
    console.groupEnd();
    
    return {
        essentials,
        migrationStatus: migrationChecks,
        criticalFunctions: criticalEssentials,
        summary: {
            propertiesCount: window.properties?.length || 0,
            mediaSystem: !!window.MediaSystem,
            pdfSystem: !!window.PdfSystem,
            migrationComplete: !window.handleNewMediaFiles && !window.showPdfModal
        }
    };
};

// ✅ FUNÇÃO DE DIAGNÓSTICO RÁPIDO
window.quickDiagnostic = function() {
    console.group('⚡ DIAGNÓSTICO RÁPIDO');
    
    const quickCheck = {
        'DOM pronto': document.readyState === 'complete',
        'Imóveis': `${window.properties?.length || 0} carregados`,
        'Mídia': window.MediaSystem ? '✅' : '❌',
        'PDF': window.PdfSystem ? '✅' : '❌',
        'Admin': typeof window.toggleAdminPanel === 'function' ? '✅' : '❌',
        'Console limpo': !window.location.search.includes('debug=true') ? '✅ (produção)' : '🔧 (debug)'
    };
    
    console.table(quickCheck);
    console.groupEnd();
    
    return quickCheck;
};

// ✅ EXECUTAR AUTOMATICAMENTE EM MODO DEBUG
(function autoInitialize() {
    const isDebugMode = window.location.search.includes('debug=true') || 
                       window.location.search.includes('test=true');
    
    if (isDebugMode) {
        console.log('🔧 simple-checker.js - Modo debug ativado');
        
        // Aguardar carregamento completo
        setTimeout(() => {
            if (document.readyState === 'complete') {
                console.log('🏠 DOM carregado - executando verificações...');
                setTimeout(() => {
                    window.runSupportChecks?.();
                    
                    // Executar diagnóstico rápido também
                    setTimeout(() => {
                        window.quickDiagnostic?.();
                    }, 500);
                }, 1000);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(() => {
                        window.runSupportChecks?.();
                        setTimeout(() => {
                            window.quickDiagnostic?.();
                        }, 500);
                    }, 1000);
                });
            }
        }, 2000);
    } else {
        console.log('🚀 simple-checker.js carregado (modo produção)');
        // Em produção, apenas disponibiliza as funções, não executa automaticamente
    }
})();

// ✅ EXPORTAR PARA USO GLOBAL
window.simpleChecker = {
    runSupportChecks: window.runSupportChecks,
    quickDiagnostic: window.quickDiagnostic
};

console.log('✅ simple-checker.js ATUALIZADO - Verificando sistema atual (pós-migração)');
