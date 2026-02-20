// debug/utils/storage-diagnostics.js
// Módulo de diagnóstico para localStorage, sincronização de dados, funções de teste e verificação (MIGRADO DO CORE SYSTEM).
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

    // ======================================================================
    // FUNÇÕES DE TESTE MIGRADAS DO PROPERTIES.JS
    // ======================================================================

    window.testFullUpdate = function() {
        console.group('🧪 TESTE DE ATUALIZAÇÃO COMPLETA (via Support System)');
        
        if (!window.properties || window.properties.length === 0) {
            console.error('❌ Nenhum imóvel disponível para teste');
            alert('❌ Nenhum imóvel disponível para teste');
            console.groupEnd();
            return;
        }
        
        const testProperty = window.properties[0];
        const hasVideoBefore = testProperty.has_video;
        const titleBefore = testProperty.title;
        const priceBefore = testProperty.price;
        const locationBefore = testProperty.location;
        
        testProperty.has_video = !hasVideoBefore;
        testProperty.title = `${titleBefore} [TESTE ATUALIZADO]`;
        testProperty.price = `R$ ${Math.floor(Math.random() * 1000000).toLocaleString()}`;
        testProperty.location = `${locationBefore} [LOCAL ATUALIZADO]`;
        
        const index = window.properties.findIndex(p => p.id === testProperty.id);
        if (index !== -1) {
            window.properties[index] = testProperty;
            
            const saved = window.savePropertiesToStorage?.();
            
            if (saved) {
                if (typeof window.updatePropertyCard === 'function') {
                    window.updatePropertyCard(testProperty.id, {
                        title: testProperty.title,
                        price: testProperty.price,
                        location: testProperty.location,
                        has_video: testProperty.has_video
                    });
                }
                
                alert(`🧪 TESTE DE ATUALIZAÇÃO COMPLETA:\n\n` +
                      `Imóvel: ${testProperty.title}\n` +
                      `Preço: ${testProperty.price}\n` +
                      `Local: ${testProperty.location}\n` +
                      `Vídeo: ${testProperty.has_video ? 'SIM' : 'NÃO'}\n\n` +
                      `Todos os campos devem atualizar IMEDIATAMENTE na galeria.`);
                
                // Reverter após 10 segundos
                setTimeout(() => {
                    if (window.properties[index]) {
                        window.properties[index].title = titleBefore;
                        window.properties[index].price = priceBefore;
                        window.properties[index].location = locationBefore;
                        window.properties[index].has_video = hasVideoBefore;
                        
                        window.savePropertiesToStorage?.();
                        
                        if (typeof window.updatePropertyCard === 'function') {
                            window.updatePropertyCard(testProperty.id, {
                                title: titleBefore,
                                price: priceBefore,
                                location: locationBefore,
                                has_video: hasVideoBefore
                            });
                        }
                        
                        console.log('🔄 [SUPORTE] Teste revertido ao estado original');
                    }
                }, 10000);
            } else {
                alert('❌ Teste falhou! Não foi possível salvar no localStorage.');
            }
        }
        
        console.groupEnd();
    };

    window.forceFullGalleryUpdate = function() {
        console.log('🔄 [SUPORTE] Forçando atualização completa da galeria...');
        if (typeof window.renderProperties === 'function') {
            window.renderProperties(window.currentFilter || 'todos', true);
            alert('✅ Galeria atualizada com cache limpo!');
        } else {
            console.error('❌ Função renderProperties não disponível');
            alert('❌ Função renderProperties não disponível');
        }
    };

    // ======================================================================
    // FUNÇÃO DE VERIFICAÇÃO DO SISTEMA MIGRADA DO PROPERTIES.JS
    // ======================================================================

    window.checkPropertySystem = function(silent = true) {
        if (!silent) console.group('🔍 VERIFICAÇÃO DO SISTEMA (via Support System)');
        
        try {
            const stored = JSON.parse(localStorage.getItem('properties') || '[]');
            
            if (stored.length > 0) {
                if (!window.properties || window.properties.length === 0) {
                    window.properties = stored;
                    console.log(`✅ [AUTO] Carregados ${stored.length} imóveis do localStorage`);
                    return { action: 'loaded_from_storage', count: stored.length };
                }
                else if (Math.abs(stored.length - window.properties.length) > 2) {
                    if (stored.length > window.properties.length) {
                        window.properties = stored;
                        console.log(`✅ [AUTO] Sincronizado: storage tem +${stored.length - window.properties.length} imóveis`);
                        return { action: 'synced_from_storage', difference: stored.length - window.properties.length };
                    } else {
                        window.savePropertiesToStorage?.();
                        console.log(`✅ [AUTO] Sincronizado: memória tem +${window.properties.length - stored.length} imóveis`);
                        return { action: 'synced_to_storage', difference: window.properties.length - stored.length };
                    }
                }
            }
            
            if (!silent) {
                console.log('⚙️ FUNÇÕES ESSENCIAIS:');
                console.log('- toggleAdminPanel:', typeof window.toggleAdminPanel);
                console.log('- saveProperty:', typeof window.saveProperty);
                console.log('- addNewProperty:', typeof window.addNewProperty);
                console.log('- updateProperty:', typeof window.updateProperty);
            }
            
            return { action: 'no_sync_needed', status: 'ok' };
            
        } catch (error) {
            console.error('❌ Erro na verificação automática:', error);
            return { action: 'error', error: error.message };
        } finally {
            if (!silent) console.groupEnd();
        }
    };

    console.log('✅ [SUPORTE] Função diagnosticoSincronizacao migrada e disponível.');
    console.log('✅ [SUPORTE] Funções de teste testFullUpdate e forceFullGalleryUpdate migradas.');
    console.log('✅ [SUPORTE] Função de verificação checkPropertySystem migrada.');
})();
