// weberlessa-support/debug/media-recovery.js

window.debugMediaSystem = function () {
    console.group('🔍 DIAGNÓSTICO DO SISTEMA DE MÍDIA');

    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');

    console.log('📌 Elementos encontrados:', {
        uploadArea: !!uploadArea,
        fileInput: !!fileInput
    });

    if (uploadArea) {
        console.log('🎯 uploadArea event listeners:');
        console.log('- onclick:', uploadArea.onclick ? 'SIM' : 'NÃO');
        console.log('- ondragover:', uploadArea.ondragover ? 'SIM' : 'NÃO');
        console.log('- ondrop:', uploadArea.ondrop ? 'SIM' : 'NÃO');
    }

    console.log('🔧 Funções globais:', {
        handleNewMediaFiles: typeof window.handleNewMediaFiles,
        clearMediaSystem: typeof window.clearMediaSystem,
        selectedMediaFiles: window.selectedMediaFiles
            ? window.selectedMediaFiles.length
            : 'N/A'
    });

    console.groupEnd();
};

window.forceMediaSystemInit = function () {
    console.log('🚀 Forçando inicialização do sistema de mídia...');

    if (typeof window.initMediaUI !== 'function') {
        console.error('❌ media-ui.js não carregado!');
        return false;
    }

    const uiSuccess = window.initMediaUI();
    console.log('✅ UI inicializada:', uiSuccess);

    if (typeof window.handleNewMediaFiles !== 'function') {
        console.error('❌ media-core.js não conectado!');

        if (typeof window.initMediaSystem === 'function') {
            window.initMediaSystem('vendas');
            console.log('🔧 Sistema core reinicializado');
        }
    }

    return true;
};
