// weberlessa-support/debug/media-recovery.js - VERSÃO ATUALIZADA
console.log('🧩 media-recovery.js carregado (SUPORTE ATUALIZADO)');

const MediaRecovery = {
    version: '2.0',
    date: '2024',
    system: 'media-unified'
};

// Logger seguro
const MediaLog = {
    info: (msg) => console.log(`🔧 [MediaRecovery] ${msg}`),
    warn: (msg) => console.warn(`⚠️ [MediaRecovery] ${msg}`),
    error: (msg) => console.error(`❌ [MediaRecovery] ${msg}`)
};

// ============================================
// DIAGNÓSTICO DO SISTEMA DE MÍDIA UNIFICADO
// ============================================
if (typeof window.debugMediaSystem === 'undefined') {
    window.debugMediaSystem = function() {
        console.group('🔍 [MediaRecovery] Diagnóstico do Sistema Unificado');
        
        // 1. Verificar MediaSystem (novo)
        console.log('📌 MediaSystem (unificado):', {
            disponivel: typeof MediaSystem !== 'undefined',
            version: MediaSystem ? 'unified' : 'N/A',
            estado: MediaSystem ? MediaSystem.state : 'N/A'
        });
        
        // 2. Verificar elementos DOM
        console.log('🎯 Elementos DOM:', {
            uploadArea: !!document.getElementById('uploadArea'),
            uploadPreview: !!document.getElementById('uploadPreview'),
            pdfUploadArea: !!document.getElementById('pdfUploadArea')
        });
        
        // 3. Verificar funções de compatibilidade
        console.log('🔗 Funções de compatibilidade:', {
            handleNewMediaFiles: typeof window.handleNewMediaFiles,
            handleNewPdfFiles: typeof window.handleNewPdfFiles,
            clearMediaSystem: typeof window.clearMediaSystem
        });
        
        console.groupEnd();
        return typeof MediaSystem !== 'undefined';
    };
}

// ============================================
// RECUPERAÇÃO PARA SISTEMA UNIFICADO
// ============================================
if (typeof window.forceMediaSystemInit === 'undefined') {
    window.forceMediaSystemInit = function() {
        MediaLog.info('Forçando verificação do MediaSystem unificado...');
        
        // PRIMEIRO: Tentar usar o novo sistema unificado
        if (typeof MediaSystem !== 'undefined') {
            MediaLog.info('✅ MediaSystem unificado encontrado!');
            
            // Verificar se está inicializado
            if (!MediaSystem.config || !MediaSystem.config.currentSystem) {
                MediaLog.info('🔄 Inicializando MediaSystem...');
                MediaSystem.init('vendas');
            }
            
            // Verificar event listeners
            const uploadArea = document.getElementById('uploadArea');
            if (uploadArea && !uploadArea.onclick) {
                MediaLog.info('🔧 Configurando event listeners...');
                if (typeof MediaSystem.setupEventListeners === 'function') {
                    MediaSystem.setupEventListeners();
                }
            }
            
            MediaLog.info('✅ Sistema unificado verificado e pronto');
            return true;
        }
        
        // SEGUNDO: Fallback para sistema antigo (apenas se ainda existir)
        MediaLog.warn('⚠️  MediaSystem unificado não encontrado');
        
        if (typeof window.initMediaUI === 'function') {
            MediaLog.info('🔄 Usando sistema antigo (fallback)...');
            return window.initMediaUI();
        }
        
        // TERCEIRO: Nenhum sistema disponível
        MediaLog.error('❌ NENHUM sistema de mídia disponível!');
        console.error('Soluções possíveis:');
        console.error('1. Verifique se media-unified.js está carregado');
        console.error('2. Verifique console por erros de carregamento');
        console.error('3. Recarregue a página com ?debug=true');
        
        return false;
    };
}

// ============================================
// VERIFICAÇÃO AUTOMÁTICA EM MODO DEBUG
// ============================================
if (window.location.search.includes('debug=true')) {
    setTimeout(() => {
        console.log('🔍 [MediaRecovery] Verificação automática iniciada...');
        
        // Verificar se o novo sistema está funcionando
        if (typeof MediaSystem === 'undefined') {
            console.warn('⚠️  MediaSystem unificado não carregado!');
            
            // Tentar recuperação automática
            if (typeof window.forceMediaSystemInit === 'function') {
                console.log('🔄 Tentando recuperação automática...');
                window.forceMediaSystemInit();
            }
        } else {
            console.log('✅ MediaSystem unificado carregado corretamente');
            console.log('📊 Estado:', {
                sistema: MediaSystem.config.currentSystem,
                arquivos: MediaSystem.state.files.length,
                pdfs: MediaSystem.state.pdfs.length
            });
        }
    }, 2000);
}

console.log('✅ media-recovery.js (v2.0) pronto - Suporte ao sistema unificado');
