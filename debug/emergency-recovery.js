// weberlessa-support/debug/emergency-recovery.js
console.log('🆘 emergency-recovery.js - Sistema de Recuperação Avançada');

// ========== RECUPERAÇÃO COMPLETA DO SISTEMA DE MÍDIA ==========
window.recoverMediaSystem = function() {
    console.log('🔄 INICIANDO RECUPERAÇÃO COMPLETA DO SISTEMA DE MÍDIA');
    
    // 1. Garantir que variáveis existam
    if (typeof window.selectedMediaFiles === 'undefined') {
        window.selectedMediaFiles = [];
        console.log('✅ window.selectedMediaFiles criado');
    }
    
    if (typeof window.existingMediaFiles === 'undefined') {
        window.existingMediaFiles = [];
        console.log('✅ window.existingMediaFiles criado');
    }
    
    if (typeof window.isUploadingMedia === 'undefined') {
        window.isUploadingMedia = false;
        console.log('✅ window.isUploadingMedia criado');
    }
    
    // 2. Garantir que MEDIA_CONFIG existe
    if (typeof window.MEDIA_CONFIG === 'undefined') {
        window.MEDIA_CONFIG = {
            supabaseBucket: 'properties',
            maxFiles: 10,
            maxSize: 5 * 1024 * 1024,
            allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
            allowedVideoTypes: ['video/mp4', 'video/quicktime'],
            pathPrefix: 'property_media'
        };
        console.log('✅ window.MEDIA_CONFIG criado');
    }
    
    // 3. Criar função handleNewMediaFiles se não existir
    if (typeof window.handleNewMediaFiles !== 'function') {
        console.log('⚠️ handleNewMediaFiles não existe. Criando versão de emergência...');
        
        window.handleNewMediaFiles = function(files) {
            console.log('🆘 [EMERGÊNCIA] handleNewMediaFiles chamada com', files.length, 'arquivo(s)');
            
            if (!window.selectedMediaFiles) window.selectedMediaFiles = [];
            
            Array.from(files).forEach(file => {
                window.selectedMediaFiles.push({
                    file: file,
                    id: Date.now() + Math.random(),
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    preview: URL.createObjectURL(file),
                    isNew: true,
                    isImage: file.type.includes('image'),
                    isVideo: file.type.includes('video')
                });
                console.log(`✅ "${file.name}" adicionado`);
            });
            
            // Atualizar preview
            if (typeof window.updateMediaPreview === 'function') {
                window.updateMediaPreview();
            }
            
            return files.length;
        };
        
        console.log('✅ handleNewMediaFiles criada (versão emergência)');
    }
    
    // 4. Recriar clearMediaSystem se não existir
    if (typeof window.clearMediaSystem !== 'function') {
        window.clearMediaSystem = function() {
            console.log('🧹 clearMediaSystem (emergência)');
            if (window.selectedMediaFiles) window.selectedMediaFiles.length = 0;
            if (window.existingMediaFiles) window.existingMediaFiles.length = 0;
            
            const preview = document.getElementById('uploadPreview');
            if (preview) preview.innerHTML = 'Sistema recuperado - tente novamente';
            
            return true;
        };
    }
    
    console.log('✅ Sistema de mídia recuperado');
    alert('🔄 SISTEMA DE MÍDIA RECUPERADO!\n\nTente adicionar fotos novamente.');
    
    return true;
};

// ========== RECARREGAMENTO DE EMERGÊNCIA ==========
window.reloadMediaModules = function() {
    console.log('🔄 RECARREGANDO MÓDULOS DE MÍDIA...');
    
    // 1. Remover módulos antigos
    delete window.handleNewMediaFiles;
    delete window.updateMediaPreview;
    delete window.initMediaUI;
    
    // 2. Recarregar scripts dinamicamente
    const scriptsToReload = [
        'js/modules/media/media-core.js',
        'js/modules/media/media-ui.js',
        'js/modules/media/media-integration.js'
    ];
    
    scriptsToReload.forEach(url => {
        // Remover script antigo se existir
        const oldScript = document.querySelector(`script[src="${url}"]`);
        if (oldScript) oldScript.remove();
        
        // Adicionar novo
        const newScript = document.createElement('script');
        newScript.src = url + '?reload=' + Date.now(); // Cache bust
        newScript.defer = true;
        document.body.appendChild(newScript);
        console.log(`📦 Recarregado: ${url}`);
    });
    
    // 3. Reinicializar após 2 segundos
    setTimeout(() => {
        console.log('🔧 Reinicializando sistema...');
        
        if (typeof window.initMediaSystem === 'function') {
            window.initMediaSystem('vendas');
        }
        
        if (typeof window.initMediaUI === 'function') {
            window.initMediaUI();
        }
        
        if (typeof window.setupMediaIntegration === 'function') {
            window.setupMediaIntegration();
        }
        
        alert('🔄 Módulos de mídia recarregados!\n\nTente novamente.');
    }, 2000);
};

// ========== SISTEMA DE DETECÇÃO AUTOMÁTICA ==========
(function setupEmergencyDetection() {
    console.log('🔍 Configurando detecção de emergência...');
    
    // Verificar após 5 segundos se módulos essenciais carregaram
    setTimeout(() => {
        const essentialFunctions = [
            'handleNewMediaFiles',
            'updateMediaPreview',
            'initMediaSystem'
        ];
        
        const missingFunctions = essentialFunctions.filter(func => 
            typeof window[func] !== 'function'
        );
        
        if (missingFunctions.length > 0) {
            console.warn('⚠️ Funções essenciais não carregaram:', missingFunctions);
            
            // Apenas log em debug mode
            if (window.location.search.includes('debug=true')) {
                console.log('🔄 Tentando recuperação automática...');
                if (typeof window.recoverMediaSystem === 'function') {
                    window.recoverMediaSystem();
                }
            }
        } else {
            console.log('✅ Todas funções essenciais carregadas');
        }
    }, 5000);
})();

// ========== EXPORT ==========
console.log('✅ Sistema de recuperação de emergência carregado');
console.log('🔧 Funções disponíveis: recoverMediaSystem(), reloadMediaModules()');
