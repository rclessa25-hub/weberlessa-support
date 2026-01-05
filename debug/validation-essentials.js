// weberlessa-support/debug/validation-essentials.js
// MÓDULO DE VALIDAÇÕES ESSENCIAIS - VERSÃO ATUALIZADA COM PDF
// Arquivo consolidado: Inclui validações de galeria, sistema completo E migração PDF
// Não foi necessário criar novo arquivo - funcionalidades foram integradas aqui

(function() {
    'use strict';
    
    console.log('🔧 [SUPORTE] validation-essentials.js carregado (versão consolidada com PDF)');
    
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
    
    // ========== VALIDAÇÃO DO SISTEMA PDF ==========
    window.validatePdfMigration = function() {
        if (isDebugMode) {
            console.group('🧪 VALIDAÇÃO PDF UNIFICADO');
        }
        
        const tests = [
            {
                name: 'PdfSystem disponível',
                test: () => typeof window.PdfSystem !== 'undefined',
                critical: true
            },
            {
                name: 'Função showModal',
                test: () => typeof window.PdfSystem?.showModal === 'function',
                critical: true
            },
            {
                name: 'Função processAndSavePdfs',
                test: () => typeof window.PdfSystem?.processAndSavePdfs === 'function',
                critical: true
            },
            {
                name: 'Admin.js integrado',
                test: () => typeof window.processAndSavePdfs === 'function',
                critical: true
            },
            {
                name: 'Modal no DOM',
                test: () => !!document.getElementById('pdfModal'),
                critical: false
            },
            {
                name: 'Campo senha',
                test: () => !!document.getElementById('pdfPassword'),
                critical: false
            },
            {
                name: 'Botão admin funciona',
                test: () => {
                    const btn = document.querySelector('.admin-toggle');
                    return btn && typeof btn.onclick !== 'undefined';
                },
                critical: true
            },
            {
                name: 'PDF handlers configurados',
                test: () => typeof window.showPdfModal === 'function',
                critical: true
            }
        ];
        
        let passed = 0;
        let criticalPassed = 0;
        let totalCritical = 0;
        
        tests.forEach(({ name, test, critical }) => {
            if (critical) totalCritical++;
            
            try {
                const result = test();
                if (isDebugMode) {
                    console.log(`${result ? '✅' : '❌'} ${name}: ${result}`);
                }
                
                if (result) {
                    passed++;
                    if (critical) criticalPassed++;
                }
            } catch (e) {
                if (isDebugMode) {
                    console.log(`❌ ${name}: ERRO - ${e.message}`);
                }
            }
        });
        
        const total = tests.length;
        const score = Math.round((passed / total) * 100);
        const criticalScore = totalCritical > 0 ? 
            Math.round((criticalPassed / totalCritical) * 100) : 100;
        
        const result = {
            score,
            criticalScore,
            passed,
            total,
            criticalPassed,
            totalCritical,
            allCriticalPassed: criticalScore === 100,
            timestamp: new Date().toISOString()
        };
        
        if (isDebugMode) {
            console.log(`📊 Resultado: ${passed}/${total} (${score}%)`);
            console.log(`📊 Críticos: ${criticalPassed}/${totalCritical} (${criticalScore}%)`);
            
            if (criticalScore === 100) {
                console.log('🎉 Migração PDF CRÍTICA bem-sucedida!');
            } else if (criticalScore >= 80) {
                console.log('⚠️  Migração PDF com problemas menores');
            } else {
                console.error('❌ Migração PDF COM PROBLEMAS CRÍTICOS');
            }
            
            console.groupEnd();
        }
        
        // Exportar resultado para debug
        window.pdfMigrationResult = result;
        
        return result;
    };
    
    // ========== SISTEMA DE VALIDAÇÃO COMPLETO ==========
    window.ValidationSystem = {
        // Validação rápida do sistema (INCLUINDO PDF)
        quickSystemCheck: function() {
            return {
                properties: !!window.properties,
                propertiesCount: window.properties ? window.properties.length : 0,
                supabaseReady: !!window.supabaseClient,
                adminReady: typeof window.toggleAdminPanel === 'function',
                galleryReady: typeof window.openGallery === 'function',
                pdfSystemReady: typeof window.PdfSystem !== 'undefined',
                pdfModalReady: typeof window.showPdfModal === 'function',
                pdfProcessingReady: typeof window.processAndSavePdfs === 'function',
                timestamp: new Date().toISOString()
            };
        },
        
        // Validação completa do sistema
        fullSystemCheck: async function() {
            const results = {
                basic: this.quickSystemCheck(),
                gallery: window.validateGalleryModule ? window.validateGalleryModule() : null,
                pdf: window.validatePdfMigration ? window.validatePdfMigration() : null,
                storage: await this.checkLocalStorage(),
                performance: this.measurePerformance(),
                errors: this.collectErrors()
            };
            
            // Status consolidado
            results.overallStatus = this.calculateOverallStatus(results);
            
            return results;
        },
        
        // Calcular status geral
        calculateOverallStatus: function(results) {
            const criticalTests = [
                results.basic.properties,
                results.basic.supabaseReady,
                results.basic.adminReady,
                results.pdf ? results.pdf.allCriticalPassed : true,
                results.gallery ? results.gallery.success : true
            ];
            
            const allCriticalPassed = criticalTests.every(test => test === true);
            const passedCount = criticalTests.filter(test => test === true).length;
            
            return {
                allCriticalPassed,
                criticalScore: Math.round((passedCount / criticalTests.length) * 100),
                timestamp: new Date().toISOString()
            };
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
                        pdf_data: !!localStorage.getItem('pdf_data'),
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
                unhandledErrors: window.unhandledErrors || [],
                pdfErrors: window.pdfErrors || []
            };
        },
        
        // Validação específica de PDF (método rápido)
        validatePdfSystemQuick: function() {
            const checks = {
                'PdfSystem object': typeof window.PdfSystem !== 'undefined',
                'showModal function': typeof window.showPdfModal === 'function',
                'process function': typeof window.processAndSavePdfs === 'function',
                'Modal in DOM': !!document.getElementById('pdfModal'),
                'Password field': !!document.getElementById('pdfPassword')
            };
            
            if (isDebugMode) {
                console.table(checks);
            }
            
            return {
                success: Object.values(checks).every(v => v === true),
                checks: checks,
                timestamp: new Date().toISOString()
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
            
            if (typeof window.validatePdfMigration === 'undefined') {
                window.validatePdfMigration = function() {
                    return {
                        allCriticalPassed: typeof window.PdfSystem !== 'undefined',
                        score: typeof window.PdfSystem !== 'undefined' ? 100 : 0,
                        timestamp: new Date().toISOString()
                    };
                };
            }
            
            if (typeof window.ValidationSystem === 'undefined') {
                window.ValidationSystem = {
                    quickSystemCheck: function() {
                        return {
                            properties: !!window.properties,
                            propertiesCount: window.properties ? window.properties.length : 0,
                            pdfSystemReady: typeof window.PdfSystem !== 'undefined',
                            timestamp: new Date().toISOString()
                        };
                    }
                };
            }
        }
    };
    
    // Executar validações automáticas em debug mode
    if (isDebugMode) {
        setTimeout(() => {
            console.log('🚀 [SUPORTE] Executando validações automáticas...');
            
            // Executar validação rápida
            const quickCheck = window.ValidationSystem.quickSystemCheck();
            console.log('📋 Quick System Check:', quickCheck);
            
            // Executar validação PDF específica
            if (window.validatePdfMigration) {
                const pdfResult = window.validatePdfMigration();
                console.log('📄 PDF Migration Result:', pdfResult);
            }
            
            console.log('✅ validation-essentials.js: Todas validações disponíveis');
            console.log('📌 Funções disponíveis:');
            console.log('  - validateGalleryModule() - Validação completa da galeria');
            console.log('  - validatePdfMigration() - Validação unificada do sistema PDF');
            console.log('  - ValidationSystem.quickSystemCheck() - Verificação rápida');
            console.log('  - ValidationSystem.fullSystemCheck() - Verificação completa');
            console.log('  - ValidationSystem.validatePdfSystemQuick() - Verificação rápida PDF');
            console.log('  - Fallbacks silenciosos para produção');
            
        }, 2000);
    }
    
    // Executar fallbacks após 3 segundos
    setTimeout(setupFallbacks, 3000);
})();
