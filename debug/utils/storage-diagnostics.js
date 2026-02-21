// debug/utils/storage-diagnostics.js
// Módulo de diagnóstico para localStorage, sincronização de dados, funções de teste, verificação, monitoramento e inicialização automática (MIGRADO DO CORE SYSTEM).
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

// ======================================================================
// VERIFICADOR DE MIGRAÇÃO - GARANTE QUE O CORE NÃO TEM FUNÇÕES DUPLICADAS
// ======================================================================
// Esta função verifica se as funções migradas foram removidas do Core System
// e só executa em modo debug, sem afetar a produção.

window.verificarMigracaoStorage = function() {
    // Só executa em modo debug - NUNCA em produção
    if (!window.location.search.includes('debug=true')) {
        return { executado: false, motivo: 'Modo produção' };
    }
    
    console.group('🔍 VERIFICAÇÃO DE MIGRAÇÃO - STORAGE DIAGNOSTICS');
    console.log('📋 Verificando se funções foram removidas do Core System...');
    
    const resultados = {
        funcoesNoCore: [],
        funcoesCorretas: [],
        status: 'OK'
    };
    
    // Lista de funções que DEVERIAM estar APENAS no Support System
    const funcoesMigradas = [
        'diagnosticoSincronizacao',
        'testFullUpdate',
        'forceFullGalleryUpdate',
        'checkPropertySystem',
        'autoSyncOnLoad'
    ];
    
    // Verificar cada função
    funcoesMigradas.forEach(nomeFuncao => {
        const existeNoCore = typeof window[nomeFuncao] === 'function';
        
        if (existeNoCore) {
            // A função ainda existe no escopo global - pode vir do Core ou Support
            // Precisamos verificar de onde ela veio
            
            // Tenta obter a stack da função (não é 100% confiável, mas ajuda)
            const funcaoString = window[nomeFuncao].toString();
            const veioDoSupport = funcaoString.includes('storage-diagnostics.js') || 
                                 funcaoString.includes('SUPORTE') ||
                                 funcaoString.includes('via Support System');
            
            if (!veioDoSupport) {
                // A função parece vir do Core (não tem marcação do Support)
                resultados.funcoesNoCore.push({
                    funcao: nomeFuncao,
                    origem: 'Core System (PROBLEMA)',
                    solucao: `Remover do arquivo properties.js`
                });
                resultados.status = 'ATENÇÃO';
            } else {
                resultados.funcoesCorretas.push({
                    funcao: nomeFuncao,
                    origem: 'Support System (CORRETO)'
                });
            }
        } else {
            // Função não existe - também é um problema, pois deveria existir no Support
            resultados.funcoesNoCore.push({
                funcao: nomeFuncao,
                origem: 'NÃO ENCONTRADA',
                solucao: `Verificar se storage-diagnostics.js foi carregado`
            });
            resultados.status = 'ERRO';
        }
    });
    
    // Exibir relatório
    console.log('📊 RELATÓRIO DE MIGRAÇÃO:');
    
    if (resultados.funcoesCorretas.length > 0) {
        console.log('✅ Funções corretamente no Support:');
        resultados.funcoesCorretas.forEach(item => {
            console.log(`  - ${item.funcao}: ${item.origem}`);
        });
    }
    
    if (resultados.funcoesNoCore.length > 0) {
        console.log('⚠️ PROBLEMAS ENCONTRADOS:');
        resultados.funcoesNoCore.forEach(item => {
            console.log(`  - ${item.funcao}: ${item.origem}`);
            console.log(`    Solução: ${item.solucao}`);
        });
    }
    
    if (resultados.status === 'OK') {
        console.log('🎉 SISTEMA 100% MIGRADO! Todas as funções estão no Support System.');
        console.log('📉 Core System limpo e enxuto.');
    } else {
        console.log(`🔧 Status: ${resultados.status} - Ações necessárias acima.`);
    }
    
    console.groupEnd();
    
    return resultados;
};

// ======================================================================
// VERIFICAÇÕES DETALHADAS DE ORIGEM DAS FUNÇÕES (APENAS MODO DEBUG)
// ======================================================================

setTimeout(() => {
    if (window.location.search.includes('debug=true')) {
        console.log('🔍 VERIFICAÇÃO DETALHADA DE ORIGEM DAS FUNÇÕES:');
        
        // Lista de funções para verificar
        const funcoesParaVerificar = [
            'diagnosticoSincronizacao',
            'checkPropertySystem',
            'testFullUpdate',
            'forceFullGalleryUpdate',
            'autoSyncOnLoad'
        ];
        
        funcoesParaVerificar.forEach(nomeFuncao => {
            if (typeof window[nomeFuncao] === 'function') {
                const funcaoString = window[nomeFuncao].toString();
                const primeirasLinhas = funcaoString.split('\n').slice(0, 3).join('\n').substring(0, 200);
                
                console.log(`\n📌 FUNÇÃO: ${nomeFuncao}`);
                console.log(`   Tipo: ${typeof window[nomeFuncao]}`);
                console.log(`   Origem: ${funcaoString.includes('storage-diagnostics.js') ? '✅ Support System' : '❌ Core System (ou outro)'}`);
                console.log(`   Primeiras linhas: ${primeirasLinhas}...`);
            } else {
                console.log(`\n❌ FUNÇÃO: ${nomeFuncao} - NÃO ENCONTRADA`);
            }
        });
    }
}, 1000);

// ======================================================================
// VERIFICAÇÃO PÓS-REMOÇÃO (APENAS MODO DEBUG)
// ======================================================================

setTimeout(() => {
    if (window.location.search.includes('debug=true')) {
        console.log('\n🔍 VERIFICAÇÃO PÓS-REMOÇÃO:');
        
        const funcoesVerificar = [
            'diagnosticoSincronizacao',
            'checkPropertySystem',
            'testFullUpdate',
            'forceFullGalleryUpdate',
            'autoSyncOnLoad'
        ];
        
        funcoesVerificar.forEach(nomeFuncao => {
            const existe = typeof window[nomeFuncao] === 'function';
            
            if (existe) {
                const funcaoString = window[nomeFuncao].toString();
                const noSupport = funcaoString.includes('storage-diagnostics.js') || 
                                 funcaoString.includes('SUPORTE') ||
                                 funcaoString.includes('via Support System');
                
                console.log(`- ${nomeFuncao}: ${noSupport ? '✅ Support System' : '❌ AINDA NO CORE'}`);
                
                // Se estiver no Core, mostra trecho para debug
                if (!noSupport) {
                    console.log(`  Primeiras 100 caracteres: ${funcaoString.substring(0, 100)}...`);
                }
            } else {
                console.log(`- ${nomeFuncao}: ❓ NÃO ENCONTRADA`);
            }
        });
    }
}, 3000);

// Executar verificador automático em modo debug após carregamento
if (window.location.search.includes('debug=true')) {
    // Pequeno delay para garantir que tudo carregou
    setTimeout(() => {
        if (typeof window.verificarMigracaoStorage === 'function') {
            window.verificarMigracaoStorage();
        }
    }, 2000);
}

// ======================================================================
// MONITORAMENTO SILENCIOSO CONTÍNUO (APÓS A IIFE)
// ======================================================================
// Este monitoramento só atua em modo debug e verifica periodicamente
// a consistência entre localStorage e memória.

setTimeout(() => {
    if (window.location.search.includes('debug=true')) {
        console.log('📊 [SUPORTE] Iniciando monitoramento contínuo de dados (a cada 30s)...');
        
        setInterval(() => {
            // Só executa se ainda estiver em modo debug
            if (!window.location.search.includes('debug=true')) return;
            
            const stored = JSON.parse(localStorage.getItem('properties') || '[]');
            const inMemory = window.properties?.length || 0;
            
            if (Math.abs(stored.length - inMemory) > 0) {
                console.log(`📊 [MONITOR] Storage: ${stored.length} | Memória: ${inMemory}`);
                
                // Se a diferença for pequena (até 3), tenta sincronizar automaticamente
                if (Math.abs(stored.length - inMemory) <= 3) {
                    if (typeof window.checkPropertySystem === 'function') {
                        window.checkPropertySystem(true);
                    }
                }
            }
        }, 30000); // 30 segundos
    }
}, 5000); // Pequeno delay para garantir que o sistema principal já carregou

// ======================================================================
// SISTEMA DE VERIFICAÇÃO AUTOMÁTICA INICIAL (MIGRADO DO PROPERTIES.JS)
// ======================================================================

// Definir a função autoSyncOnLoad (se ainda não existir globalmente)
if (typeof window.autoSyncOnLoad !== 'function') {
    window.autoSyncOnLoad = function() {
        // Pequeno atraso para garantir que tudo carregou
        setTimeout(() => {
            try {
                console.log('🔄 [SUPORTE] Executando verificação automática inicial...');
                const syncResult = window.checkPropertySystem ? window.checkPropertySystem(true) : null;
                
                if (window.location.search.includes('debug=true')) {
                    console.log('🔄 [SUPORTE] Sincronização automática:', syncResult);
                }
                
                if (syncResult && syncResult.action !== 'no_sync_needed') {
                    setTimeout(() => {
                        if (typeof window.renderProperties === 'function' && syncResult.count > 0) {
                            window.renderProperties('todos');
                        }
                    }, 500);
                }
            } catch (e) {
                console.warn('⚠️ [SUPORTE] Sincronização automática falhou (não crítico):', e.message);
            }
        }, 3000); // Mesmo delay de 3 segundos do original
    };
}

// Executar automaticamente quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', window.autoSyncOnLoad);
} else {
    setTimeout(window.autoSyncOnLoad, 1000);
}

console.log('✅ [SUPORTE] Sistema de verificação automática inicial (autoSyncOnLoad) migrado.');
console.log('✅ [SUPORTE] Monitoramento contínuo configurado. Verificará a cada 30s em modo debug.');
console.log('✅ [SUPORTE] Verificador de migração disponível (window.verificarMigracaoStorage)');
console.log('✅ [SUPORTE] Verificações detalhadas de origem configuradas (executam em modo debug)');
