// weberlessa-support/debug/validation-essentials.js
// MÓDULO 12/11: Validações essenciais migradas do Core

(function() {
    'use strict';
    
    console.log('🔧 [SUPORTE] validation-essentials.js carregado');
    
    const isDebugMode = 
        window.location.search.includes('debug=true') ||
        window.location.hostname.includes('localhost');
    
    // ========== VALIDAÇÃO DE GALERIA COMPLETA ==========
    window.validateGalleryModule = function() {
        if (isDebugMode) {
            console.group('🔍 [SUPORTE] Validação Avançada da Galeria');
        }
        
        const checks = {
            'openGallery function': typeof window.openGallery === 'function',
            'closeGallery function': typeof window.closeGallery === 'function',
            'currentGalleryImages array': Array.isArray(window.currentGalleryImages),
            'gallery styles loaded': !!document.querySelector('[href*="gallery.css"]'),
            'touch handlers ready': typeof window.handleTouchStart === 'function',
            'keyboard support ready': typeof window.handleGalleryKeyboard === 'function',
            'modal element exists': !!document.getElementById('propertyGalleryModal'),
            'image count function': typeof window.showGalleryImage === 'function'
        };
        
        const allValid = Object.values(checks).every(check => check === true);
        const validCount = Object.values(checks).filter(v => v).length;
        
        if (isDebugMode) {
            console.table(checks);
            console.log(`📊 Resultado: ${validCount}/${Object.keys(checks).length} OK`);
            console.log(`✅ Sistema de Galeria: ${allValid ? 'FUNCIONAL' : 'COM PROBLEMAS'}`);
            console.groupEnd();
        }
        
        return {
            success: allValid,
            score: validCount / Object.keys(checks).length,
            checks: checks,
            timestamp: new Date().toISOString()
        };
    };
    
    // ========== SISTEMA DE VALIDAÇÃO COMPLETO ==========
    window.ValidationSystem = {
        // Validação rápida do sistema
        quickSystemCheck: function() {
            return {
                properties: !!window.properties,
                propertiesCount: window.properties ? window.properties.length : 0,
                supabaseReady: !!window.supabaseClient,
                adminReady: typeof window.toggleAdminPanel === 'function',
                galleryReady: typeof window.openGallery === 'function',
                pdfReady: typeof window.showPdfModal === 'function',
                timestamp: new Date().toISOString()
            };
        },
        
        // Validação completa do sistema
        fullSystemCheck: async function() {
            const results = {
                basic: this.quickSystemCheck(),
                gallery: window.validateGalleryModule ? window.validateGalleryModule() : null,
                storage: await this.checkLocalStorage(),
                performance: this.measurePerformance(),
                errors: this.collectErrors()
            };
            
            return results;
        },
        
        // Verificação de localStorage
        checkLocalStorage: async function() {
            return new Promise(resolve => {
                try {
                    const testKey = 'validation_test_' + Date.now();
                    localStorage.setItem(testKey, 'test');
                    const exists = localStorage.getItem(testKey) === 'test';
                    localStorage.removeItem(testKey);
                    
                    resolve({
                        available: exists,
                        weberlessa_properties: !!localStorage.getItem('weberlessa_properties'),
                        supportLoaded: !!localStorage.getItem('support_modules_loaded')
                    });
                } catch (e) {
                    resolve({ available: false, error: e.message });
                }
            });
        },
        
        // Medição de performance
        measurePerformance: function() {
            return {
                memory: performance.memory ? {
                    usedJSHeapSize: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                    totalJSHeapSize: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
                } : null,
                timing: performance.timing ? {
                    loadTime: performance.timing.loadEventEnd - performance.timing.navigationStart,
                    domReady: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart
                } : null,
                now: performance.now()
            };
        },
        
        // Coleta de erros
        collectErrors: function() {
            return {
                consoleErrors: window.consoleErrors || [],
                unhandledErrors: window.unhandledErrors || []
            };
        }
    };
    
    // ========== FALLBACKS ESSENCIAIS SILENCIOSOS ==========
    const setupFallbacks = function() {
        const isProduction = !isDebugMode && 
                           window.location.hostname.includes('github.io') &&
                           !window.location.search.includes('debug=true');
        
        if (isProduction) {
            // Fallbacks SILENCIOSOS para produção
            if (typeof window.validateGalleryModule === 'undefined') {
                window.validateGalleryModule = function() {
                    return typeof window.openGallery === 'function';
                };
            }
            
            if (typeof window.ValidationSystem === 'undefined') {
                window.ValidationSystem = {
                    quickSystemCheck: function() {
                        return {
                            properties: !!window.properties,
                            propertiesCount: window.properties ? window.properties.length : 0,
                            timestamp: new Date().toISOString()
                        };
                    }
                };
            }
        }
    };
    
    // Executar fallbacks após 3 segundos
    setTimeout(setupFallbacks, 3000);
    
    // ========== RELATÓRIO DE CARREGAMENTO ==========
    if (isDebugMode) {
        console.log('✅ validation-essentials.js: Todas validações essenciais disponíveis');
        console.log('📌 Funções disponíveis:');
        console.log('  - validateGalleryModule() - Validação completa da galeria');
        console.log('  - ValidationSystem.quickSystemCheck() - Verificação rápida');
        console.log('  - ValidationSystem.fullSystemCheck() - Verificação completa');
        console.log('  - Fallbacks silenciosos para produção');
    }
})();
