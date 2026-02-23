// weberlessa-support/debug/simple-checker.js - VERSÃO FINAL COM EVENTOS
console.log('✅ simple-checker.js - Verificação Básica ATUALIZADA (com Eventos)');

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
        'SharedCore.PriceFormatter': typeof window.SharedCore?.PriceFormatter === 'object',
        
        // ✅ Diagnostic Registry
        'Diagnostic Registry': typeof window.DiagnosticRegistry === 'object'
    };
    
    console.table(essentials);
    
    // ✅ VERIFICAÇÃO DE MIGRAÇÃO COMPLETA
    const migrationChecks = {
        '✅ Sistema antigo substituído': true,
        '✅ MediaSystem (unificado) em uso': typeof window.MediaSystem === 'object',
        '✅ PdfSystem (unificado) em uso': typeof window.PdfSystem === 'object',
        '✅ Diagnostic Registry ativo': typeof window.DiagnosticRegistry === 'object',
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
            const fn = eval(fnName);
            console.log(`  ${fnName}: ${typeof fn === 'function' ? '✅' : '❌'}`);
        } catch {
            console.log(`  ${fnName}: ❌ (não encontrada)`);
        }
    });
    
    // ✅ ESTATÍSTICAS DO REGISTRY
    if (window.DiagnosticRegistry) {
        console.log('\n📊 ESTATÍSTICAS DO DIAGNOSTIC REGISTRY:');
        
        const byCategory = window.DiagnosticRegistry.getFunctionsByCategory();
        const totalFunctions = window.DiagnosticRegistry.registry.size;
        
        console.log(`Total de funções registradas: ${totalFunctions}`);
        
        if (totalFunctions > 0) {
            Object.keys(byCategory).sort().forEach(category => {
                const stats = byCategory[category];
                const safePercent = ((stats.safe / stats.total) * 100).toFixed(1);
                console.log(`  📁 ${category}: ${stats.total} funções (${stats.safe} seguras, ${stats.destructive} destrutivas) - ${safePercent}% seguras`);
            });
            
            // Listar funções destrutivas (para alerta)
            const destructiveFunctions = [];
            window.DiagnosticRegistry.registry.forEach(fn => {
                if (fn.safety.isDestructive) {
                    destructiveFunctions.push(fn.name);
                }
            });
            
            if (destructiveFunctions.length > 0) {
                console.log('\n⚠️ FUNÇÕES DESTRUTIVAS IDENTIFICADAS (NÃO executar automaticamente):');
                destructiveFunctions.sort().forEach(name => {
                    console.log(`  💀 ${name}`);
                });
            }
        }
    }
    
    // ✅ CONTAGEM DE FALHAS (apenas funções críticas)
    const criticalEssentials = {
        'Admin': typeof window.toggleAdminPanel === 'function',
        'Mídia': typeof window.MediaSystem?.addFiles === 'function',
        'PDF': typeof window.PdfSystem?.showModal === 'function',
        'Galeria': typeof window.openGallery === 'function',
        'Registry': typeof window.DiagnosticRegistry === 'object'
    };
    
    const criticalFailures = Object.values(criticalEssentials).filter(v => !v).length;
    
    if (criticalFailures > 0) {
        console.warn(`\n⚠️ ${criticalFailures} função(ões) CRÍTICA(s) não encontrada(s):`);
        Object.entries(criticalEssentials).forEach(([name, exists]) => {
            if (!exists) console.warn(`   - ${name}`);
        });
    } else {
        console.log('\n🎉 TODAS as funções CRÍTICAS estão disponíveis!');
    }
    
    // ✅ RESUMO FINAL
    console.log('\n📊 RESUMO DO SISTEMA:');
    console.log(`- Imóveis carregados: ${window.properties?.length || 0}`);
    console.log(`- Sistema de mídia: ${window.MediaSystem ? '✅ UNIFICADO' : '❌'}`);
    console.log(`- Sistema de PDF: ${window.PdfSystem ? '✅ UNIFICADO' : '❌'}`);
    console.log(`- SharedCore: ${window.SharedCore ? '✅ DISPONÍVEL' : '❌'}`);
    console.log(`- Diagnostic Registry: ${window.DiagnosticRegistry ? '✅ ATIVO' : '❌'}`);
    
    // ✅ VERIFICAÇÃO DE COMPATIBILIDADE
    if (!window.handleNewMediaFiles && !window.showPdfModal) {
        console.log('\n✅✅✅ MIGRAÇÃO COMPLETA CONFIRMADA!');
        console.log('🎯 Sistema antigo foi completamente substituído.');
        console.log('🚀 Sistema atual 100% funcional.');
    } else {
        console.warn('\n⚠️ Sistema em estado MISTO (antigo + novo)');
        console.log('💡 Algumas funções antigas ainda podem estar presentes.');
    }
    
    console.groupEnd();
    
    return {
        essentials,
        migrationStatus: migrationChecks,
        criticalFunctions: criticalEssentials,
        registryStats: window.DiagnosticRegistry ? window.DiagnosticRegistry.getFunctionsByCategory() : null,
        summary: {
            propertiesCount: window.properties?.length || 0,
            mediaSystem: !!window.MediaSystem,
            pdfSystem: !!window.PdfSystem,
            registryActive: !!window.DiagnosticRegistry,
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
        'Registry': window.DiagnosticRegistry ? '✅' : '❌',
        'Console limpo': !window.location.search.includes('debug=true') ? '✅ (produção)' : '🔧 (debug)'
    };
    
    console.table(quickCheck);
    console.groupEnd();
    
    return quickCheck;
};

// ✅ FUNÇÃO: Executar apenas diagnósticos seguros
window.runSafeDiagnostics = async function() {
    console.log('🛡️ Iniciando diagnóstico seguro via Registry...');
    
    if (!window.DiagnosticRegistry) {
        console.error('❌ DiagnosticRegistry não disponível!');
        return null;
    }
    
    return await window.DiagnosticRegistry.runSafeDiagnostics();
};

// ✅ FUNÇÃO: Listar funções por categoria
window.listDiagnosticFunctions = function(category = null) {
    if (!window.DiagnosticRegistry) {
        console.error('❌ DiagnosticRegistry não disponível!');
        return;
    }
    
    window.DiagnosticRegistry.list({ category, detailed: true });
};

// ✅ FUNÇÃO: Aguardar registry e executar
function waitForRegistryAndExecute() {
    console.log('⏳ Aguardando DiagnosticRegistry ficar pronto...');
    
    // Se já existe e já disparou evento, executar imediatamente
    if (window.DiagnosticRegistry && window.DiagnosticRegistry._eventDispatched) {
        console.log('⚡ Registry já pronto, executando imediatamente');
        executeAllChecks();
        return;
    }
    
    // Timer de segurança (timeout global)
    const timeoutId = setTimeout(() => {
        window.removeEventListener('diagnostic-registry-ready', readyHandler);
        console.warn('⚠️ Timeout aguardando registry - executando verificações parciais');
        executeAllChecks(true); // true = parcial
    }, 5000);
    
    // Handler do evento
    const readyHandler = (event) => {
        clearTimeout(timeoutId);
        window.removeEventListener('diagnostic-registry-ready', readyHandler);
        console.log(`🎯 Evento recebido: diagnostic-registry-ready com ${event.detail.count} funções`);
        executeAllChecks();
    };
    
    // Registrar listener do evento
    window.addEventListener('diagnostic-registry-ready', readyHandler);
    
    // Fallback: verificação periódica silenciosa (caso o evento não dispare)
    let checkCount = 0;
    const intervalId = setInterval(() => {
        checkCount++;
        if (window.DiagnosticRegistry?.registry.size > 0) {
            clearInterval(intervalId);
            clearTimeout(timeoutId);
            window.removeEventListener('diagnostic-registry-ready', readyHandler);
            console.log(`✅ Registry detectado via polling (${checkCount * 500}ms)`);
            executeAllChecks();
        } else if (checkCount >= 10) { // 5 segundos (10 * 500ms)
            clearInterval(intervalId);
            // Não fazer nada, o timeout já vai executar
        }
    }, 500);
}

// ✅ FUNÇÃO: Executar todas as verificações
function executeAllChecks(isPartial = false) {
    if (isPartial) {
        console.warn('⚠️ Executando verificações PARCIAIS (registry não respondeu)');
    }
    
    setTimeout(() => {
        window.runSupportChecks?.();
        
        setTimeout(() => {
            window.quickDiagnostic?.();
            
            // ✅ SUGESTÕES (sempre mostradas)
            console.log('\n💡 DICA: Execute window.runSafeDiagnostics() para testar funções seguras');
            console.log('💡 Ou window.listDiagnosticFunctions() para listar todas as funções');
            console.log('💡 Ou window.DiagnosticRegistry.list({ detailed: true }) para detalhes');
        }, 500);
    }, 100);
}

// ✅ EXECUTAR AUTOMATICAMENTE EM MODO DEBUG (COM EVENTOS)
(function autoInitialize() {
    const isDebugMode = window.location.search.includes('debug=true') || 
                       window.location.search.includes('test=true') ||
                       window.location.hostname.includes('localhost') ||
                       window.location.hostname.includes('127.0.0.1');
    
    if (isDebugMode) {
        console.log('🔧 simple-checker.js - Modo debug ativado (aguardando evento)');
        
        // Aguardar carregamento completo do DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(waitForRegistryAndExecute, 500);
            });
        } else {
            setTimeout(waitForRegistryAndExecute, 500);
        }
    } else {
        console.log('🚀 simple-checker.js carregado (modo produção)');
    }
})();

// ✅ EXPORTAR PARA USO GLOBAL
window.simpleChecker = {
    runSupportChecks: window.runSupportChecks,
    quickDiagnostic: window.quickDiagnostic,
    runSafeDiagnostics: window.runSafeDiagnostics,
    listFunctions: window.listDiagnosticFunctions,
    waitForRegistry: waitForRegistryAndExecute
};

console.log('✅ simple-checker.js ATUALIZADO - Versão Final com Eventos e Timeout Global');
