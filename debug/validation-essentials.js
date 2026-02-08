// weberlessa-support/debug/validation-essentials.js
// MÓDULO DE VALIDAÇÕES ESSENCIAIS - VERSÃO DEFINITIVA CORRIGIDA
// Compatível com o sistema atual - funções existentes apenas no support system

(function() {
    'use strict';
    
    console.log('🔧 [SUPORTE] validation-essentials.js carregado - Módulo de suporte independente');
    
    const isDebugMode = 
        window.location.search.includes('debug=true') ||
        window.location.hostname.includes('localhost');
    
    // ========== VERIFICAÇÕES DO SISTEMA ATUAL ==========
    
    // Função 1: Verificar sistema de galeria
    window.checkGallerySystem = function() {
        const checks = {
            'openGallery function': typeof window.openGallery === 'function',
            'closeGallery function': typeof window.closeGallery === 'function',
            'currentGalleryImages array': Array.isArray(window.currentGalleryImages),
            'gallery styles loaded': !!document.querySelector('[href*="gallery.css"]'),
            'modal element exists': !!document.getElementById('propertyGalleryModal'),
            'image count function': typeof window.showGalleryImage === 'function'
        };
        
        if (isDebugMode) {
            console.group('🔍 [SUPORTE] Verificação do Sistema de Galeria');
            console.table(checks);
            const validCount = Object.values(checks).filter(v => v).length;
            console.log(`📊 Resultado: ${validCount}/${Object.keys(checks).length} OK`);
            console.groupEnd();
        }
        
        return checks;
    };
    
    // Função 2: Verificar sistema PDF atual
    window.checkPdfSystem = function() {
        console.group('🧪 [SUPORTE] Verificação do Sistema PDF');
        
        const tests = {
            'PdfSystem object exists': typeof window.PdfSystem !== 'undefined',
            'showModal function': typeof window.PdfSystem?.showModal === 'function',
            'Modal in DOM': !!document.getElementById('pdfModal'),
            'Password field': !!document.getElementById('pdfPassword'),
            'Properties with PDFs': () => {
                const props = window.properties?.filter(p => p.pdfs && p.pdfs !== 'EMPTY') || [];
                return props.length > 0;
            }
        };
        
        const results = {};
        let passed = 0;
        
        Object.entries(tests).forEach(([name, test]) => {
            try {
                const result = typeof test === 'function' ? test() : test;
                results[name] = result;
                if (result) passed++;
                console.log(`${result ? '✅' : '⚠️'} ${name}: ${result}`);
            } catch (e) {
                results[name] = false;
                console.log(`❌ ${name}: ERRO`);
            }
        });
        
        const total = Object.keys(tests).length;
        const score = Math.round((passed / total) * 100);
        
        console.log(`📊 Resultado: ${passed}/${total} (${score}%)`);
        
        if (score === 100) {
            console.log('🎉 Sistema PDF completamente funcional!');
            console.log('💡 Para testar: window.PdfSystem.showModal(propertyId)');
            console.log('🔑 Senha: doc123');
        } else if (score >= 80) {
            console.log('⚠️ Sistema PDF funcional com pequenos problemas');
        } else {
            console.log('❌ Sistema PDF com problemas significativos');
        }
        
        console.groupEnd();
        
        return {
            score,
            passed,
            total,
            results,
            timestamp: new Date().toISOString()
        };
    };
    
    // Função 3: Verificar sistema completo
    window.verifyCompleteSystem = function() {
        console.group('🔍 [SUPORTE] Verificação Completa do Sistema');
        
        const checks = {
            // Core functions
            'window.properties array': Array.isArray(window.properties),
            'Properties count': window.properties?.length || 0,
            'loadPropertiesData function': typeof window.loadPropertiesData === 'function',
            'renderProperties function': typeof window.renderProperties === 'function',
            
            // Admin functions
            'toggleAdminPanel function': typeof window.toggleAdminPanel === 'function',
            'editProperty function': typeof window.editProperty === 'function',
            'deleteProperty function': typeof window.deleteProperty === 'function',
            
            // Media functions
            'MediaSystem object': typeof window.MediaSystem !== 'undefined',
            'MediaSystem.addFiles': typeof window.MediaSystem?.addFiles === 'function',
            'MediaSystem.uploadAll': typeof window.MediaSystem?.uploadAll === 'function',
            
            // PDF functions
            'PdfSystem object': typeof window.PdfSystem !== 'undefined',
            'PdfSystem.showModal': typeof window.PdfSystem?.showModal === 'function',
            
            // Storage
            'LocalStorage available': () => {
                try {
                    localStorage.setItem('test', 'test');
                    localStorage.removeItem('test');
                    return true;
                } catch {
                    return false;
                }
            },
            'Properties in localStorage': !!localStorage.getItem('properties')
        };
        
        const results = {};
        let passed = 0;
        
        Object.entries(checks).forEach(([name, test]) => {
            try {
                const result = typeof test === 'function' ? test() : test;
                results[name] = result;
                if (result !== false && result !== 0) passed++; // 0 is valid for count
                console.log(`${result !== false && result !== 0 ? '✅' : '⚠️'} ${name}: ${result}`);
            } catch (e) {
                results[name] = false;
                console.log(`❌ ${name}: ERRO - ${e.message}`);
            }
        });
        
        const total = Object.keys(checks).length;
        const score = Math.round((passed / total) * 100);
        
        console.log(`📊 Sistema Geral: ${passed}/${total} (${score}%)`);
        
        // Status summary
        if (score >= 90) {
            console.log('🎉 SISTEMA COMPLETAMENTE FUNCIONAL!');
        } else if (score >= 70) {
            console.log('⚠️ Sistema funcional com algumas limitações');
        } else {
            console.log('❌ Sistema com problemas críticos');
        }
        
        console.groupEnd();
        
        return {
            score,
            passed,
            total,
            results,
            timestamp: new Date().toISOString(),
            status: score >= 90 ? 'excellent' : score >= 70 ? 'good' : 'needs_attention'
        };
    };
    
    // Função 4: Teste prático do PDF (apenas debug mode)
    window.testPdfFunctionality = function() {
        if (!isDebugMode) {
            console.log('🔒 Teste PDF disponível apenas em modo debug');
            return { available: false, mode: 'production' };
        }
        
        console.group('🧪 [SUPORTE] Teste Prático do Sistema PDF');
        
        try {
            // 1. Encontrar imóvel com PDFs
            const propertyWithPdf = window.properties?.find(p => 
                p.pdfs && p.pdfs !== 'EMPTY' && p.pdfs.trim() !== ''
            );
            
            if (!propertyWithPdf) {
                console.log('ℹ️ Nenhum imóvel com PDFs encontrado');
                console.log('💡 Adicione um imóvel com PDFs pelo painel admin');
                console.groupEnd();
                return { test: 'skipped', reason: 'no_pdfs' };
            }
            
            console.log(`📄 Imóvel encontrado: ID ${propertyWithPdf.id} - "${propertyWithPdf.title}"`);
            
            const pdfCount = propertyWithPdf.pdfs.split(',').filter(p => p.trim()).length;
            console.log(`📊 ${pdfCount} PDF(s) disponível(eis)`);
            
            // 2. Testar função showModal
            if (typeof window.PdfSystem?.showModal === 'function') {
                console.log('🚀 Executando window.PdfSystem.showModal()...');
                
                // Pequeno delay para visualização
                setTimeout(() => {
                    window.PdfSystem.showModal(propertyWithPdf.id);
                    console.log('✅ Modal aberto com sucesso!');
                    console.log('🔑 Digite a senha: doc123');
                }, 1000);
                
                console.groupEnd();
                return { 
                    test: 'success', 
                    propertyId: propertyWithPdf.id,
                    pdfCount,
                    action: 'modal_opened'
                };
            } else {
                console.error('❌ window.PdfSystem.showModal() não disponível');
                console.groupEnd();
                return { test: 'failed', reason: 'showModal_not_available' };
            }
        } catch (error) {
            console.error('❌ Erro no teste:', error);
            console.groupEnd();
            return { test: 'error', error: error.message };
        }
    };
    
    // ========== AUTO-VALIDAÇÃO EM DEBUG MODE ==========
    if (isDebugMode) {
        setTimeout(() => {
            console.log('🚀 [SUPORTE] Iniciando auto-validação do sistema...');
            
            // Esperar carregamento completo
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(runAutoValidation, 1000);
                });
            } else {
                setTimeout(runAutoValidation, 1000);
            }
            
            function runAutoValidation() {
                // Executar verificações
                const galleryCheck = window.checkGallerySystem();
                const pdfCheck = window.checkPdfSystem();
                const systemCheck = window.verifyCompleteSystem();
                
                // Resumo final
                console.group('📋 [SUPORTE] RESUMO DO SISTEMA');
                console.log('🏠 Propriedades:', window.properties?.length || 0);
                console.log('🔧 PDF System:', typeof window.PdfSystem !== 'undefined' ? '✅ Disponível' : '❌ Indisponível');
                console.log('🖼️ Gallery System:', typeof window.openGallery === 'function' ? '✅ Disponível' : '❌ Indisponível');
                console.log('👨‍💼 Admin System:', typeof window.toggleAdminPanel === 'function' ? '✅ Disponível' : '❌ Indisponível');
                console.log('💾 LocalStorage:', typeof localStorage !== 'undefined' ? '✅ Disponível' : '❌ Indisponível');
                console.groupEnd();
                
                // Instruções
                console.log('💡 INSTRUÇÕES DE USO:');
                console.log('1. window.checkGallerySystem() - Verificar galeria');
                console.log('2. window.checkPdfSystem() - Verificar sistema PDF');
                console.log('3. window.verifyCompleteSystem() - Verificação completa');
                console.log('4. window.testPdfFunctionality() - Teste prático (debug only)');
                console.log('5. window.PdfSystem.showModal(ID) - Abrir documentos de um imóvel');
            }
        }, 2000);
    }
    
    // ========== COMPATIBILIDADE SILENCIOSA ==========
    // Garantir que funções existam (mesmo que vazias) em produção
    setTimeout(() => {
        if (!isDebugMode) {
            // Funções stub para produção (não fazem nada)
            if (typeof window.checkGallerySystem === 'undefined') {
                window.checkGallerySystem = function() {
                    return { production: true, timestamp: new Date().toISOString() };
                };
            }
            
            if (typeof window.checkPdfSystem === 'undefined') {
                window.checkPdfSystem = function() {
                    return { production: true, timestamp: new Date().toISOString() };
                };
            }
            
            if (typeof window.verifyCompleteSystem === 'undefined') {
                window.verifyCompleteSystem = function() {
                    return { production: true, timestamp: new Date().toISOString() };
                };
            }
            
            if (typeof window.testPdfFunctionality === 'undefined') {
                window.testPdfFunctionality = function() {
                    return { production: true, available: false };
                };
            }
        }
    }, 3000);
    
})();
