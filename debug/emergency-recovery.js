// weberlessa-support/debug/emergency-recovery.js
console.log('🆘 emergency-recovery.js - Sistema Avançado de Recuperação (Suporte)');

// FUTURO (não implementado):
//Avaliar criação de EmergencySystem como orquestrador
//caso o sistema de recuperação cresça ou se torne distribuído.

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('emergency=true');

    // Namespace único
    window.emergencyRecovery = window.emergencyRecovery || {};

    // ========= RECUPERAÇÃO DO SISTEMA DE MÍDIA =========
    window.emergencyRecovery.recoverMediaSystem = function () {
        console.log('🚨 Iniciando recuperação de emergência do sistema de mídia');

        try {
            if (!window.selectedMediaFiles) window.selectedMediaFiles = [];
            if (!window.existingMediaFiles) window.existingMediaFiles = [];
            if (typeof window.isUploadingMedia === 'undefined') window.isUploadingMedia = false;

            if (!window.MEDIA_CONFIG) {
                window.MEDIA_CONFIG = {
                    supabaseBucket: 'properties',
                    maxFiles: 10,
                    maxSize: 5 * 1024 * 1024,
                    allowedImageTypes: ['image/jpeg','image/png','image/gif','image/webp'],
                    allowedVideoTypes: ['video/mp4','video/quicktime'],
                    pathPrefix: 'property_media'
                };
            }

            if (typeof window.handleNewMediaFiles !== 'function') {
                window.handleNewMediaFiles = function (files) {
                    Array.from(files).forEach(file => {
                        window.selectedMediaFiles.push({
                            id: Date.now() + Math.random(),
                            file,
                            name: file.name,
                            size: file.size,
                            type: file.type,
                            preview: URL.createObjectURL(file),
                            isNew: true,
                            isImage: file.type.includes('image'),
                            isVideo: file.type.includes('video')
                        });
                    });

                    window.updateMediaPreview?.();
                    return files.length;
                };
            }

            if (typeof window.clearMediaSystem !== 'function') {
                window.clearMediaSystem = function () {
                    window.selectedMediaFiles.length = 0;
                    window.existingMediaFiles.length = 0;
                    document.getElementById('uploadPreview')?.replaceChildren('Sistema recuperado');
                    return true;
                };
            }

            console.log('✅ Sistema de mídia recuperado');
            return true;

        } catch (e) {
            console.error('❌ Falha na recuperação de mídia:', e);
            return false;
        }
    };

    // ========= RELOAD DE MÓDULOS =========
    window.emergencyRecovery.reloadMediaModules = function () {
        console.log('🔄 Recarregando módulos de mídia');

        const modules = [
            'js/modules/media/media-core.js',
            'js/modules/media/media-ui.js',
            'js/modules/media/media-integration.js'
        ];

        modules.forEach(src => {
            document.querySelector(`script[src="${src}"]`)?.remove();
            const s = document.createElement('script');
            s.src = `${src}?reload=${Date.now()}`;
            s.defer = true;
            document.body.appendChild(s);
        });

        return true;
    };

    // ========= DETECÇÃO AUTOMÁTICA (SOMENTE DEBUG) =========
    if (isDebug) {
        setTimeout(() => {
            const required = ['handleNewMediaFiles','updateMediaPreview','initMediaSystem'];
            const missing = required.filter(fn => typeof window[fn] !== 'function');

            if (missing.length) {
                console.warn('⚠️ Falhas detectadas:', missing);
                window.emergencyRecovery.recoverMediaSystem();
            } else {
                console.log('✅ Nenhuma falha crítica detectada');
            }
        }, 5000);
    }

    console.log('✅ emergency-recovery.js pronto');
    console.log('🧪 Uso: window.emergencyRecovery.recoverMediaSystem()');

})();
