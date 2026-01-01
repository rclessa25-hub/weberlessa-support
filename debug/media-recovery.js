// weberlessa-support/debug/media-recovery.js
// Módulo de diagnóstico e recuperação do sistema de mídia
// Carregado apenas em modo debug/teste

console.log('🧩 media-recovery.js carregado (SUPORTE)');

// Logger seguro (usa MediaLogger se disponível)
const MediaLog = {
    info: (msg) =>
        window.MediaLogger
            ? window.MediaLogger.info('MediaRecovery', msg)
            : console.log(msg),

    error: (msg) =>
        window.MediaLogger
            ? window.MediaLogger.error('MediaRecovery', msg)
            : console.error(msg)
};

// ===============================
// DIAGNÓSTICO DO SISTEMA DE MÍDIA
// ===============================
if (typeof window.debugMediaSystem === 'undefined') {

    window.debugMediaSystem = function () {
        console.group('🔍 [SUPORTE] Diagnóstico do Sistema de Mídia');

        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');

        console.log('📌 Elementos encontrados:', {
            uploadArea: !!uploadArea,
            fileInput: !!fileInput
        });

        if (uploadArea) {
            console.log('🎯 uploadArea event listeners:', {
                onclick: !!uploadArea.onclick,
                ondragover: !!uploadArea.ondragover,
                ondrop: !!uploadArea.ondrop
            });
        }

        console.log('🔧 Funções globais:', {
            handleNewMediaFiles: typeof window.handleNewMediaFiles,
            clearMediaSystem: typeof window.clearMediaSystem,
            selectedMediaFiles: Array.isArray(window.selectedMediaFiles)
                ? window.selectedMediaFiles.length
                : 'N/A'
        });

        console.groupEnd();
    };

    MediaLog.info('debugMediaSystem registrado');
}

// ====================================
// RECUPERAÇÃO FORÇADA DO SISTEMA DE MÍDIA
// ====================================
if (typeof window.forceMediaSystemInit === 'undefined') {

    window.forceMediaSystemInit = function () {
        MediaLog.info('Forçando inicialização do sistema de mídia...');

        if (typeof window.initMediaUI !== 'function') {
            MediaLog.error('media-ui.js não carregado');
            return false;
        }

        const uiSuccess = window.initMediaUI();
        MediaLog.info(`UI inicializada: ${uiSuccess}`);

        if (typeof window.handleNewMediaFiles !== 'function') {
            MediaLog.error('media-core.js não conectado');

            if (typeof window.initMediaSystem === 'function') {
                window.initMediaSystem('vendas');
                MediaLog.info('Sistema core reinicializado');
            }
        }

        return true;
    };

    MediaLog.info('forceMediaSystemInit registrado');
}
