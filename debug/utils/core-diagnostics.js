// debug/utils/core-diagnostics.js
// Módulo de diagnóstico extraído do Core System (main.js)
console.log('🔧 [SUPPORT] core-diagnostics.js carregado.');

(function() {
    // ========== DIAGNÓSTICO DE STORAGE ==========
    window.diagnosticoStorage = function() {
        // ... (código idêntico ao original) ...
        console.group('🔍 DIAGNÓSTICO COMPLETO DO STORAGE');
        console.log('📊 CHAVES NO LOCALSTORAGE:');
        Object.keys(localStorage).forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (Array.isArray(data)) {
                    console.log(`- "${key}": ${data.length} imóveis`);
                    if (data.length > 0) console.log(`  Primeiro: "${data[0]?.title}" (ID: ${data[0]?.id})`);
                } else console.log(`- "${key}": Não é array (${typeof data})`);
            } catch { console.log(`- "${key}": Não é JSON válido`); }
        });
        console.log('📊 window.properties:', `É array? ${Array.isArray(window.properties)}`, `Quantidade: ${window.properties?.length || 0}`);
        console.log('💡 RECOMENDAÇÕES:', `Chave antiga: ${localStorage.getItem('weberlessa_properties') ? 'EXISTE' : 'NÃO'}`);
        console.groupEnd();
    };

    // ========== LIMPEZA DE CHAVES ANTIGAS ==========
    window.cleanupOldStorage = function() {
        if (confirm('⚠️ LIMPAR CHAVES ANTIGAS DO LOCALSTORAGE?\n\nEsta ação removerá "weberlessa_properties" e outras chaves antigas.')) {
            ['weberlessa_properties', 'properties_backup', 'weberlessa_backup'].forEach(key => {
                if (localStorage.getItem(key)) { localStorage.removeItem(key); console.log(`🗑️ Removido: ${key}`); }
            });
            alert('✅ Limpeza concluída! Recarregue a página.');
            location.reload();
        }
    };

    // ========== RESTAURAÇÃO DE EMERGÊNCIA ==========
    window.emergencyRestoreFromSupabase = async function() {
        // ... (código idêntico ao original) ...
        if (!confirm('🚨 RESTAURAÇÃO DE EMERGÊNCIA\n\nIsso substituirá TODOS os dados locais pelos do Supabase.\nContinuar?')) return;
        const loading = window.LoadingManager?.show?.('Restaurando dados...', 'Conectando ao servidor');
        try {
            if (window.supabaseClient) {
                const { data, error } = await window.supabaseClient.from('properties').select('*').order('created_at', { ascending: false });
                if (error) throw error;
                if (data?.length) {
                    localStorage.clear();
                    window.properties = data;
                    localStorage.setItem('properties', JSON.stringify(data));
                    window.renderProperties?.('todos');
                    window.loadPropertyList?.();
                    alert(`✅ RESTAURAÇÃO CONCLUÍDA!\n\n${data.length} imóveis recuperados do servidor.`);
                } else alert('ℹ️ Nenhum dado encontrado no servidor.');
            } else alert('❌ Cliente Supabase não disponível.');
        } catch (error) { alert(`❌ ERRO: ${error.message}`); }
        finally { loading?.hide(); }
    };

    // ========== MONITORAMENTO DE PERFORMANCE (Agora condicional) ==========
    // ✅ MELHORIA: Só executa se a flag 'debug=true' estiver presente.
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => {
            const perfData = {
                domReady: document.readyState,
                modulesLoaded: document.querySelectorAll('script[src*="modules/"]').length,
                loadingManagerAvailable: !!window.LoadingManager,
                propertiesAvailable: !!window.properties,
                screenSize: `${window.innerWidth}x${window.innerHeight}`,
                connection: navigator.connection ? navigator.connection.effectiveType : 'desconhecido'
            };
            console.log('📊 [SUPPORT] Dados de performance:', perfData);
            console.log('🔍 [SUPPORT] Diagnóstico avançado:', {
                windowProperties: Object.keys(window).filter(k => k.includes('prop') || k.includes('load') || k.includes('init')),
                localStorageKeys: Object.keys(localStorage)
            });
        }, 1000);
    }
})();
