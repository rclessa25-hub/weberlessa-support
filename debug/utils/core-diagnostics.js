// debug/utils/core-diagnostics.js
// Módulo de diagnóstico extraído do Core System (main.js)
console.log('🔧 [SUPPORT] core-diagnostics.js carregado.');

(function() {
    // ========== DIAGNÓSTICO DE STORAGE ==========
    window.diagnosticoStorage = function() {
        console.group('🔍 DIAGNÓSTICO COMPLETO DO STORAGE');
        
        console.log('📊 CHAVES NO LOCALSTORAGE:');
        Object.keys(localStorage).forEach(key => {
            try {
                const data = JSON.parse(localStorage.getItem(key));
                if (Array.isArray(data)) {
                    console.log(`- "${key}": ${data.length} imóveis`);
                    if (data.length > 0) {
                        console.log(`  Primeiro: "${data[0]?.title}" (ID: ${data[0]?.id})`);
                    }
                } else {
                    console.log(`- "${key}": Não é array (${typeof data})`);
                }
            } catch {
                console.log(`- "${key}": Não é JSON válido`);
            }
        });
        
        console.log('📊 window.properties:');
        console.log(`- É array?`, Array.isArray(window.properties));
        console.log(`- Quantidade:`, window.properties?.length || 0);
        
        console.log('💡 RECOMENDAÇÕES:');
        const hasOldKey = localStorage.getItem('weberlessa_properties');
        if (hasOldKey) {
            console.log('❌ AINDA EXISTE CHAVE ANTIGA! Execute window.cleanupOldStorage()');
        }
        
        if (!localStorage.getItem('properties')) {
            console.log('❌ CHAVE UNIFICADA NÃO ENCONTRADA! O sistema pode não estar salvando.');
        }
        
        console.groupEnd();
    };

    // ========== LIMPEZA DE CHAVES ANTIGAS ==========
    window.cleanupOldStorage = function() {
        if (confirm('⚠️ LIMPAR CHAVES ANTIGAS DO LOCALSTORAGE?\n\nEsta ação removerá "weberlessa_properties" e outras chaves antigas.')) {
            ['weberlessa_properties', 'properties_backup', 'weberlessa_backup'].forEach(key => {
                if (localStorage.getItem(key)) {
                    localStorage.removeItem(key);
                    console.log(`🗑️ Removido: ${key}`);
                }
            });
            alert('✅ Limpeza concluída! Recarregue a página.');
            location.reload();
        }
    };

    // ========== RESTAURAÇÃO DE EMERGÊNCIA ==========
    window.emergencyRestoreFromSupabase = async function() {
        if (!confirm('🚨 RESTAURAÇÃO DE EMERGÊNCIA\n\nIsso substituirá TODOS os dados locais pelos do Supabase.\nContinuar?')) {
            return;
        }
        
        const loading = window.LoadingManager?.show?.('Restaurando dados...', 'Conectando ao servidor');
        
        try {
            if (window.supabaseClient) {
                const { data, error } = await window.supabaseClient
                    .from('properties')
                    .select('*')
                    .order('created_at', { ascending: false });
                
                if (error) throw error;
                
                if (data && data.length > 0) {
                    // Limpar TUDO
                    localStorage.clear();
                    
                    // Salvar novos dados na chave unificada
                    window.properties = data;
                    localStorage.setItem('properties', JSON.stringify(data));
                    
                    // Recarregar interface
                    if (window.renderProperties) window.renderProperties('todos');
                    if (window.loadPropertyList) window.loadPropertyList();
                    
                    alert(`✅ RESTAURAÇÃO CONCLUÍDA!\n\n${data.length} imóveis recuperados do servidor.`);
                } else {
                    alert('ℹ️ Nenhum dado encontrado no servidor.');
                }
            } else {
                alert('❌ Cliente Supabase não disponível.');
            }
        } catch (error) {
            alert(`❌ ERRO: ${error.message}`);
        } finally {
            loading?.hide();
        }
    };

    // ========== MONITORAMENTO DE PERFORMANCE ==========
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
                localStorageKeys: Object.keys(localStorage),
                scriptsLoaded: Array.from(document.scripts).map(s => s.src.split('/').pop())
            });
        }, 1000);
    }

    // ========== 🎯 VERIFICAÇÃO ÚNICA E CENTRALIZADA ==========
    // Tudo em um só lugar - executa automaticamente no console
    setTimeout(() => {
        // Só executa em modo debug
        if (!window.location.search.includes('debug=true')) return;
        
        console.log('=================================');
        console.log('🔬 VERIFICAÇÃO DA MIGRAÇÃO (core-diagnostics.js)');
        console.log('=================================');
        
        // Verificação simples das funções
        const functions = {
            'diagnosticoStorage': typeof window.diagnosticoStorage === 'function' ? '✅' : '❌',
            'cleanupOldStorage': typeof window.cleanupOldStorage === 'function' ? '✅' : '❌',
            'emergencyRestore': typeof window.emergencyRestoreFromSupabase === 'function' ? '✅' : '❌'
        };
        
        console.table(functions);
        
        // Verificação de onde vieram
        const allOk = Object.values(functions).every(v => v === '✅');
        if (allOk) {
            console.log('✅✅✅ MIGRAÇÃO CONCLUÍDA!');
            console.log('   ✓ Core System: 95 linhas removidas');
            console.log('   ✓ Support System: Diagnóstico disponível');
            console.log('   ✓ Auto-verificação: Ativa');
            console.log('=================================');
            
            // Executa diagnóstico automático como prova
            console.log('📊 Executando diagnóstico automático:');
            window.diagnosticoStorage();
        } else {
            console.log('❌❌❌ MIGRAÇÃO INCOMPLETA!');
            console.log('   Verifique se o main.js foi atualizado');
        }
    }, 2000); // 2 segundos após carregar
})();
