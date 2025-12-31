// weberlessa-support/debug/simple-checker.js
console.log('✅ simple-checker.js - Verificação Básica do Sistema');

window.runSupportChecks = function() {
    console.group('✅ VERIFICAÇÃO BÁSICA DO SISTEMA');
    
    // Verificar módulos essenciais
    const essentials = {
        'Supabase Client': !!window.supabaseClient,
        'Properties Array': Array.isArray(window.properties),
        'Admin Functions': typeof window.toggleAdminPanel === 'function',
        'Media System': typeof window.handleNewMediaFiles === 'function',
        'PDF System': typeof window.showPdfModal === 'function',
        'Gallery System': typeof window.openGallery === 'function'
    };
    
    console.table(essentials);
    
    // Contar falhas
    const failures = Object.values(essentials).filter(v => !v).length;
    if (failures > 0) {
        console.warn(`⚠️ ${failures} módulo(s) essencial(is) não carregado(s)`);
    } else {
        console.log('🎉 Todos os módulos essenciais carregados!');
    }
    
    console.groupEnd();
    return essentials;
};

// Executar automaticamente
if (window.location.search.includes('debug=true')) {
    setTimeout(() => {
        window.runSupportChecks();
    }, 1500);
}
