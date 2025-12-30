// weberlessa-support/debug/function-verifier.js
console.log('🔍 function-verifier.js carregado do repositório de suporte');

window.verifySystemFunctions = function() {
    console.group('🔍 VERIFICAÇÃO DE FUNÇÕES DO SISTEMA - REPOSITÓRIO DE SUPORTE');
    
    // Verificação básica do site principal
    const checks = {
        '📦 Sistema Core': {
            'initializeProperties': typeof window.initializeProperties,
            'renderProperties': typeof window.renderProperties,
            'properties carregados': window.properties ? window.properties.length + ' imóveis' : 'NÃO'
        },
        '🔧 Sistema Admin': {
            'toggleAdminPanel': typeof window.toggleAdminPanel,
            'setupForm': typeof window.setupForm,
            'editingPropertyId': window.editingPropertyId || 'Nenhum'
        },
        '🌐 Supabase': {
            'supabaseClient': !!window.supabaseClient,
            'SUPABASE_URL': window.SUPABASE_URL ? '✅ Configurado' : '❌ Faltando'
        },
        '🖼️ Sistema de Mídia': {
            'handleNewMediaFiles': typeof window.handleNewMediaFiles,
            'updateMediaPreview': typeof window.updateMediaPreview,
            'selectedMediaFiles': window.selectedMediaFiles ? window.selectedMediaFiles.length + ' arquivos' : 'Nenhum'
        }
    };
    
    Object.entries(checks).forEach(([category, functions]) => {
        console.log(`\n${category}:`);
        Object.entries(functions).forEach(([func, status]) => {
            const icon = (typeof status === 'function' || 
                         status === true || 
                         (typeof status === 'string' && status.includes('✅'))) ? '✅' : '⚠️';
            console.log(`   ${icon} ${func}: ${status}`);
        });
    });
    
    console.groupEnd();
    return checks;
};

// Auto-executar se estiver em modo debug
if (window.location.search.includes('debug=true') || 
    window.location.href.includes('localhost')) {
    setTimeout(() => {
        console.log('🔍 Executando verificação automática do sistema...');
        window.verifySystemFunctions();
        console.log('💡 Dica: Use window.verifySystemFunctions() a qualquer momento');
    }, 2000);
}

console.log('✅ function-verifier.js pronto');
