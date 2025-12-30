// weberlessa-support/debug/duplication-checker.js
console.log('🔍 duplication-checker.js - Verificador de módulos duplicados');

window.checkModuleDuplications = function() {
    console.group('🔍 VERIFICAÇÃO DE MÓDULOS DUPLICADOS');
    
    // Módulos que podem estar duplicados
    const modulesToCheck = [
        'MEDIA_LOGGER_CONFIG',
        'MediaLogger',
        'mediaLog',
        'mediaLogHistory',
        'verifySystemFunctions',
        'mediaFormatFileSize',
        'mediaExtractFileName',
        'pdfFormatFileSize',
        'pdfValidateUrl'
    ];
    
    const duplicates = {};
    
    modulesToCheck.forEach(moduleName => {
        const value = window[moduleName];
        if (value !== undefined) {
            const type = typeof value;
            const source = value.toString().substring(0, 100);
            
            console.log(`📦 ${moduleName}:`);
            console.log(`   Tipo: ${type}`);
            console.log(`   Disponível: SIM`);
            
            // Verificar se é função duplicada
            if (type === 'function') {
                // Contar quantas vezes aparece no window
                const allKeys = Object.keys(window);
                const occurrences = allKeys.filter(k => 
                    k === moduleName || k.includes(moduleName)
                ).length;
                
                if (occurrences > 1) {
                    console.warn(`   ⚠️  DUPLICADO! Aparece ${occurrences} vezes`);
                    duplicates[moduleName] = occurrences;
                }
            }
        }
    });
    
    if (Object.keys(duplicates).length > 0) {
        console.warn('🚨 MÓDULOS DUPLICADOS ENCONTRADOS:');
        Object.entries(duplicates).forEach(([name, count]) => {
            console.warn(`   ${name}: ${count} vezes`);
        });
        
        console.log('\n💡 SOLUÇÃO:');
        console.log('1. Verifique se removeu o script antigo do index.html');
        console.log('2. Confira a ordem de carregamento dos scripts');
        console.log('3. Use "View Page Source" para ver todos os scripts carregados');
    } else {
        console.log('✅ Nenhuma duplicação encontrada!');
    }
    
    console.groupEnd();
    return duplicates;
};

// Executar automaticamente em modo debug
if (window.location.search.includes('debug=true')) {
    setTimeout(() => {
        window.checkModuleDuplications();
    }, 3000);
}
