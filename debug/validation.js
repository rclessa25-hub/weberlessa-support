// weberlessa-support/debug/validation.js
// SISTEMA DE VALIDAÇÃO SIMPLIFICADO - VERSÃO MÍNIMA
console.log('✅ validation.js carregado - Validações específicas');

(function setupValidationSystem() {
    // Verificar se já existe para evitar duplicação
    if (window.ValidationSystem) {
        console.log('ℹ️ ValidationSystem já carregado');
        return;
    }
    
    window.ValidationSystem = {
        // ========== VALIDAÇÃO DA GALERIA (do gallery.js) ==========
        validateGalleryModule: function() {
            console.log('🔍 [SUPORTE] Validando módulo da galeria...');
            
            const checks = {
                'currentGalleryImages (array)': Array.isArray(window.currentGalleryImages),
                'currentGalleryIndex (number)': typeof window.currentGalleryIndex === 'number',
                'SWIPE_THRESHOLD (50)': window.SWIPE_THRESHOLD === 50,
                'createPropertyGallery (function)': typeof window.createPropertyGallery === 'function',
                'openGallery (function)': typeof window.openGallery === 'function',
                'closeGallery (function)': typeof window.closeGallery === 'function',
                'nextGalleryImage (function)': typeof window.nextGalleryImage === 'function',
                'prevGalleryImage (function)': typeof window.prevGalleryImage === 'function'
            };
            
            console.table(checks);
            
            const allPassed = Object.values(checks).every(check => check === true);
            console.log(allPassed ? '✅ Galeria validada' : '⚠️ Problemas na galeria');
            
            return allPassed;
        },
        
        // ========== VERIFICAÇÃO DE CARREGAMENTO (do admin.js) ==========
        debugPropertiesLoad: function() {
            console.log('🔍 [SUPORTE] Verificando carregamento de propriedades...');
            
            const checks = {
                'window.properties existe': !!window.properties,
                'É array': Array.isArray(window.properties),
                'Quantidade': window.properties ? window.properties.length : 0,
                'localStorage tem dados': !!localStorage.getItem('weberlessa_properties'),
                'SUPABASE_URL configurado': !!window.SUPABASE_URL,
                'SUPABASE_KEY configurado': !!window.SUPABASE_KEY
            };
            
            console.table(checks);
            return checks;
        },
        
        // ========== DIAGNÓSTICO BÁSICO (do admin.js) ==========
        diagnoseUpdateError: function() {
            console.log('🔍 [SUPORTE] Diagnóstico de update...');
            
            const info = {
                'editingPropertyId': window.editingPropertyId,
                'properties length': window.properties ? window.properties.length : 0,
                'IDs disponíveis': window.properties ? window.properties.map(p => p.id).join(', ') : 'nenhum',
                'Formulário visível': !!document.getElementById('propertyForm'),
                'PDFs selecionados': window.selectedPdfFiles ? window.selectedPdfFiles.length : 0
            };
            
            console.table(info);
            return info;
        },
        
        // ========== VALIDAÇÃO RÁPIDA DO SISTEMA ==========
        quickSystemCheck: function() {
            console.log('⚡ [SUPORTE] Verificação rápida do sistema...');
            
            return {
                timestamp: new Date().toISOString(),
                properties: !!window.properties,
                propertiesCount: window.properties ? window.properties.length : 0,
                supabase: !!(window.SUPABASE_URL && window.SUPABASE_KEY),
                gallery: typeof window.openGallery === 'function',
                admin: typeof window.toggleAdminPanel === 'function',
                media: typeof window.handleNewMediaFiles === 'function',
                pdf: typeof window.showPropertyPdf === 'function'
            };
        }
    };
    
    console.log('✅ ValidationSystem simplificado pronto (4 funções)');
})();
