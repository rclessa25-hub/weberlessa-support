// debug/utils/storage-diagnostics.js
// Módulo de diagnóstico para localStorage e sincronização de dados (MIGRADO DO CORE SYSTEM).
console.log('🔧 [SUPORTE] storage-diagnostics.js carregado');

(function() {
    // Guarda a função original se ela já existir (improvável, mas seguro)
    const originalDiag = window.diagnosticoSincronizacao;

    window.diagnosticoSincronizacao = function() {
        console.group('🔍 DIAGNÓSTICO DE SINCRONIZAÇÃO (via Support System)');
        
        console.log('📊 ESTADO ATUAL:');
        console.log('- window.properties:', window.properties?.length || 0, 'imóveis');
        console.log('- É array?', Array.isArray(window.properties));
        
        if (window.properties && window.properties.length > 0) {
            console.log('- Primeiros 3 IDs:', window.properties.slice(0, 3).map(p => p.id));
        }
        
        console.log('💾 LOCALSTORAGE (CHAVE UNIFICADA):');
        const chaves = Object.keys(localStorage);
        const chavesProp = chaves.filter(k => k.includes('prop') || k.includes('weber'));
        
        chavesProp.forEach(chave => {
            try {
                const valor = localStorage.getItem(chave);
                const parsed = JSON.parse(valor || '[]');
                console.log(`- "${chave}": ${parsed.length} imóveis`);
            } catch (e) {
                console.log(`- "${chave}": ERRO ao parsear`);
            }
        });
        
        console.log('⚙️ FUNÇÕES CRÍTICAS:');
        ['savePropertiesToStorage', 'addNewProperty', 'loadPropertiesData'].forEach(fn => {
            console.log(`- ${fn}:`, typeof window[fn] === 'function' ? '✅' : '❌');
        });
        
        console.groupEnd();
    };

    console.log('✅ [SUPORTE] Função diagnosticoSincronizacao migrada e disponível.');
})();
