// debug/utils/gallery-diagnostics.js
// Módulo de diagnóstico e suporte para o sistema de galeria
console.log('🔧 [SUPPORT] gallery-diagnostics.js carregado');

(function() {
    // =========================================================================
    // 1. INICIALIZAÇÃO MANUAL DA GALERIA (MIGRADO DO GALLERY.JS)
    // =========================================================================
    /**
     * Inicializa o módulo da galeria manualmente
     * Útil para testes e depuração
     */
    window.initializeGalleryModule = function() {
        console.log('🚀 [SUPORTE] Inicializando módulo da galeria manualmente...');
        
        if (typeof window.setupGalleryEvents === 'function') {
            window.setupGalleryEvents();
            console.log('✅ Galeria inicializada com sucesso');
            return true;
        } else {
            console.error('❌ setupGalleryEvents não disponível');
            return false;
        }
    };

    // =========================================================================
    // 2. VERIFICAÇÃO DO SISTEMA DE GALERIA
    // =========================================================================
    /**
     * Verifica se o sistema de galeria está funcionando corretamente
     */
    window.checkGallerySystem = function() {
        console.group('🔍 [SUPORTE] VERIFICAÇÃO DO SISTEMA DE GALERIA');
        
        const results = {
            'CSS carregado': !!document.querySelector('link[href*="gallery.css"]'),
            'Funções essenciais': {
                'createPropertyGallery': typeof window.createPropertyGallery === 'function' ? '✅' : '❌',
                'openGallery': typeof window.openGallery === 'function' ? '✅' : '❌',
                'closeGallery': typeof window.closeGallery === 'function' ? '✅' : '❌',
                'nextGalleryImage': typeof window.nextGalleryImage === 'function' ? '✅' : '❌',
                'prevGalleryImage': typeof window.prevGalleryImage === 'function' ? '✅' : '❌',
                'setupGalleryEvents': typeof window.setupGalleryEvents === 'function' ? '✅' : '❌'
            },
            'Variáveis de estado': {
                'currentGalleryImages': Array.isArray(window.currentGalleryImages),
                'currentGalleryIndex': typeof window.currentGalleryIndex === 'number',
                'touchStartX': typeof window.touchStartX === 'number',
                'touchEndX': typeof window.touchEndX === 'number'
            },
            'Elementos DOM': {
                'galleryModal': !!document.getElementById('propertyGalleryModal')
            }
        };
        
        console.log('📊 RESULTADOS:');
        console.log(`- CSS da galeria: ${results['CSS carregado'] ? '✅' : '❌'}`);
        
        console.log('\n📋 FUNÇÕES:');
        Object.entries(results['Funções essenciais']).forEach(([nome, status]) => {
            console.log(`  - ${nome}: ${status}`);
        });
        
        console.log('\n🔧 VARIÁVEIS:');
        Object.entries(results['Variáveis de estado']).forEach(([nome, status]) => {
            console.log(`  - ${nome}: ${status ? '✅' : '❌'}`);
        });
        
        console.log('\n🖼️ MODAL:');
        console.log(`  - Modal existe: ${results['Elementos DOM']['galleryModal'] ? '✅' : '❌'}`);
        
        if (window.properties && window.properties.length > 0) {
            const firstProperty = window.properties[0];
            const hasImages = firstProperty.images && 
                             firstProperty.images !== 'EMPTY' && 
                             firstProperty.images.split(',').filter(u => u.trim()).length > 0;
            
            console.log(`\n🏠 TESTE COM PRIMEIRO IMÓVEL:`);
            console.log(`  - ID: ${firstProperty.id}`);
            console.log(`  - Título: ${firstProperty.title}`);
            console.log(`  - Tem imagens: ${hasImages ? '✅' : '❌'}`);
            
            if (hasImages) {
                const imageCount = firstProperty.images.split(',').filter(u => u.trim()).length;
                console.log(`  - Quantidade de imagens: ${imageCount}`);
                console.log(`  - Para testar: openGallery(${firstProperty.id})`);
            }
        }
        
        const allFunctionsOk = Object.values(results['Funções essenciais'])
            .every(v => v === '✅');
        
        if (allFunctionsOk) {
            console.log('\n✅✅✅ SISTEMA DE GALERIA OPERACIONAL!');
        } else {
            console.log('\n⚠️⚠️⚠️ SISTEMA DE GALERIA COM PROBLEMAS!');
        }
        
        console.groupEnd();
        
        return results;
    };

    // =========================================================================
    // 3. TESTE DE NAVEGAÇÃO DA GALERIA
    // =========================================================================
    /**
     * Testa a navegação da galeria com um imóvel de exemplo
     */
    window.testGalleryNavigation = function(propertyId = null) {
        console.group('🧪 [SUPORTE] TESTE DE NAVEGAÇÃO DA GALERIA');
        
        // Se não forneceu ID, pegar o primeiro imóvel com imagens
        if (!propertyId && window.properties) {
            const propertyWithImages = window.properties.find(p => 
                p.images && p.images !== 'EMPTY' && 
                p.images.split(',').filter(u => u.trim()).length > 0
            );
            
            if (propertyWithImages) {
                propertyId = propertyWithImages.id;
                console.log(`📌 Usando imóvel: "${propertyWithImages.title}" (ID: ${propertyId})`);
            }
        }
        
        if (!propertyId) {
            console.error('❌ Nenhum imóvel com imagens encontrado para teste');
            console.groupEnd();
            return false;
        }
        
        console.log('🎬 Executando sequência de testes:');
        
        // Abrir galeria
        console.log('1. Abrindo galeria...');
        window.openGallery(propertyId);
        
        setTimeout(() => {
            // Testar navegação
            console.log('2. Testando nextGalleryImage()...');
            window.nextGalleryImage();
            
            setTimeout(() => {
                console.log('3. Testando prevGalleryImage()...');
                window.prevGalleryImage();
                
                setTimeout(() => {
                    console.log('4. Fechando galeria...');
                    window.closeGallery();
                    console.log('✅ Teste de navegação concluído!');
                    console.groupEnd();
                }, 500);
            }, 500);
        }, 500);
        
        return true;
    };

    // =========================================================================
    // 4. DIAGNÓSTICO DE TOUCH EVENTS
    // =========================================================================
    /**
     * Verifica se os eventos de touch estão configurados
     */
    window.diagnoseGalleryTouch = function() {
        console.group('👆 [SUPORTE] DIAGNÓSTICO DE TOUCH EVENTS');
        
        const touchEvents = {
            'touchstart handler': typeof window.handleTouchStart === 'function',
            'touchend handler': typeof window.handleTouchEnd === 'function',
            'SWIPE_THRESHOLD': window.SWIPE_THRESHOLD === 50,
            'listeners ativos': false
        };
        
        // Verificar listeners no documento
        const docListeners = getEventListeners ? 
            Object.keys(getEventListeners(document) || {}) : 
            'não disponível';
        
        if (docListeners !== 'não disponível') {
            touchEvents['listeners ativos'] = docListeners.includes('touchstart') && 
                                              docListeners.includes('touchend');
        }
        
        console.log('📊 STATUS DOS TOUCH EVENTS:');
        Object.entries(touchEvents).forEach(([evento, status]) => {
            console.log(`  - ${evento}: ${status ? '✅' : '❌'}`);
        });
        
        if (touchEvents['touchstart handler'] && touchEvents['touchend handler']) {
            console.log('\n✅ SISTEMA DE TOUCH OPERACIONAL');
            console.log('💡 Threshold de swipe: 50px');
        } else {
            console.log('\n⚠️ SISTEMA DE TOUCH COM PROBLEMAS');
        }
        
        console.groupEnd();
    };

    // =========================================================================
    // 5. AGUARDAR CARREGAMENTO DE IMAGENS DOS IMÓVEIS
    // =========================================================================
    /**
     * Aguarda todas as imagens dos imóveis carregarem
     * Útil para testes de performance e diagnóstico visual
     */
    window.waitForAllPropertyImages = async function() {
        console.log('🖼️ [SUPPORT] Aguardando carregamento completo de todas as imagens...');
        
        const propertyImages = document.querySelectorAll('.property-image img, .property-gallery-image');
        
        if (propertyImages.length === 0) {
            console.log('ℹ️ [SUPPORT] Nenhuma imagem de imóvel encontrada');
            return 0;
        }
        
        console.log(`📸 [SUPPORT] ${propertyImages.length} imagem(ns) de imóveis para carregar`);
        
        return new Promise((resolve) => {
            let loadedCount = 0;
            const totalImages = propertyImages.length;
            
            propertyImages.forEach(img => {
                if (img.complete && img.naturalWidth > 0) {
                    loadedCount++;
                } else {
                    img.onload = () => {
                        loadedCount++;
                        if (loadedCount >= totalImages) resolve(loadedCount);
                    };
                    
                    img.onerror = () => {
                        loadedCount++;
                        if (loadedCount >= totalImages) resolve(loadedCount);
                    };
                }
            });
            
            const safetyTimeout = setTimeout(() => {
                console.log(`⏰ [SUPPORT] Timeout: ${loadedCount}/${totalImages} imagens carregadas`);
                resolve(loadedCount);
            }, 10000);
            
            if (loadedCount >= totalImages) {
                clearTimeout(safetyTimeout);
                resolve(loadedCount);
            }
        });
    };

    // =========================================================================
    // 6. INICIALIZAÇÃO AUTOMÁTICA EM MODO DEBUG
    // =========================================================================
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => {
            console.log('🔄 [SUPORTE] Executando verificação automática da galeria...');
            
            // Registrar no DiagnosticRegistry (se disponível)
            setTimeout(() => {
                if (window.DiagnosticRegistry && typeof window.waitForAllPropertyImages === 'function') {
                    window.DiagnosticRegistry.register('waitForAllPropertyImages', window.waitForAllPropertyImages, 'gallery', {
                        description: 'Aguarda carregamento de todas as imagens dos imóveis'
                    });
                }
            }, 1000);
            
            // Verificar sistema após 3 segundos
            setTimeout(() => {
                if (typeof window.checkGallerySystem === 'function') {
                    window.checkGallerySystem();
                }
            }, 3000);
            
            // Configurar atalho no console
            console.log('📌 Comandos disponíveis:');
            console.log('  - checkGallerySystem() - Verificar sistema');
            console.log('  - testGalleryNavigation() - Testar navegação');
            console.log('  - diagnoseGalleryTouch() - Diagnosticar touch');
            console.log('  - initializeGalleryModule() - Reinicializar manualmente');
            console.log('  - waitForAllPropertyImages() - Aguardar carregamento de imagens');
            
        }, 1000);
    }

})();
