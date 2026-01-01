// weberlessa-support/debug/pdf-logger.js
// SISTEMA DE LOGGING DE PDFs – REPOSITÓRIO DE SUPORTE

console.log('📄 [SUPORTE] pdf-logger.js carregado - Sistema de Logs Otimizado');

// ========== CONFIGURAÇÃO ==========
const PDF_LOGGER_CONFIG = {
    enabled: true,
    level: 'debug', // debug, info, error
    showTimestamps: true,
    colors: true
};

// ========== FUNÇÕES DE LOG POR CATEGORIA ==========

// 1. SISTEMA DE UPLOAD
window.logPdfUpload = {
    init: () => console.log('📄 Inicializando sistema de upload de PDF...'),
    areaReady: () => console.log('✅ Área de upload de PDF pronta'),

    fileSelected: (count) => {
        console.log(`📄 ${count} PDF(s) selecionado(s) para upload`);
    },

    processing: (fileName, index, total) => {
        console.log(`🔄 Processando ${index + 1}/${total}: ${fileName}`);
    },

    success: (fileName, url) => {
        console.log(`✅ PDF enviado: ${fileName}`);
        console.log(`🔗 URL: ${url ? url.substring(0, 80) + '...' : 'N/A'}`);
    },

    error: (fileName, error) => {
        console.error(`❌ Erro no upload de ${fileName}:`, error);
    }
};

// 2. SISTEMA DE EXCLUSÃO
window.logPdfDelete = {
    attempt: (fileName) => {
        console.log(`🗑️ Tentando excluir PDF: ${fileName}`);
    },

    confirm: (fileName) => {
        console.log(`✅ Confirmação para excluir: "${fileName}"`);
    },

    removedFromList: (fileName, remaining) => {
        console.log(`✅ PDF removido da lista: ${fileName}`);
        console.log(`📊 PDFs restantes: ${remaining}`);
    },

    storageSuccess: (fileName) => {
        console.log(`✅ PDF excluído do storage: ${fileName}`);
    },

    storageError: (fileName, error) => {
        console.error(`❌ Erro ao excluir do storage: ${fileName}`, error);
    }
};

// 3. SISTEMA DE PREVIEW / INTERFACE
window.logPdfPreview = {
    loading: (propertyId) => {
        console.log(`📄 Carregando PDFs do imóvel ${propertyId}...`);
    },

    found: (count, propertyTitle) => {
        console.log(`📊 ${count} PDF(s) encontrado(s) para: ${propertyTitle}`);
    },

    rendering: (section, count) => {
        console.log(`🎨 Renderizando ${count} PDF(s) na seção: ${section}`);
    },

    empty: () => {
        console.log('📭 Nenhum PDF para exibir');
    }
};

// 4. SISTEMA DE EDIÇÃO
window.logPdfEdit = {
    start: (propertyId, propertyTitle) => {
        console.log(`✏️ Editando PDFs do imóvel ${propertyId}: "${propertyTitle}"`);
    },

    loadingExisting: (count) => {
        console.log(`📂 Carregando ${count} PDF(s) existente(s) para edição`);
    },

    stateCheck: (existing, selected) => {
        console.log('📊 Estado atual dos PDFs:');
        console.log(`- Existentes: ${existing}`);
        console.log(`- Selecionados: ${selected}`);
    },

    processing: (propertyId) => {
        console.log(`💾 Processando PDFs para imóvel ${propertyId}...`);
    },

    result: (kept, deleted, newOnes) => {
        console.log('📊 Resultado do processamento:');
        console.log(`- Mantidos: ${kept}`);
        console.log(`- Excluídos: ${deleted}`);
        console.log(`- Novos: ${newOnes}`);
    }
};

// 5. SISTEMA DE VISUALIZAÇÃO
window.logPdfViewer = {
    opening: (propertyId) => {
        console.log(`📄 Abrindo visualizador de PDFs para imóvel ${propertyId}`);
    },

    passwordRequest: () => {
        console.log('🔒 Solicitando senha para acesso aos PDFs');
    },

    passwordSuccess: () => {
        console.log('✅ Senha válida - Acesso concedido');
    },

    passwordError: () => {
        console.log('❌ Senha inválida - Acesso negado');
    },

    closing: () => {
        console.log('❌ Fechando visualizador de PDFs');
    }
};

// 6. FUNÇÕES DE DEBUG / ERRO
window.logPdfDebug = {
    config: (config) => {
        console.log('🔧 Configuração do sistema de PDFs:', config);
    },

    error: (context, error) => {
        console.error(`❌ ERRO em ${context}:`, error);
    },

    warning: (context, message) => {
        console.warn(`⚠️ AVISO em ${context}: ${message}`);
    },

    info: (message, data = null) => {
        console.log(`ℹ️ ${message}`, data || '');
    },

    performance: (operation, startTime) => {
        const duration = Date.now() - startTime;
        console.log(`⚡ ${operation} concluído em ${duration}ms`);
    }
};

// 7. FUNÇÕES DE INTEGRAÇÃO
window.logPdfIntegration = {
    supabaseConnection: (status) => {
        console.log(`🌐 Conexão Supabase: ${status ? '✅ OK' : '❌ FALHA'}`);
    },

    storageCheck: (bucket, accessible) => {
        console.log(`📦 Bucket "${bucket}": ${accessible ? '✅ Acessível' : '❌ Inacessível'}`);
    },

    sync: (action, result) => {
        console.log(`🔄 ${action}: ${result}`);
    }
};

// ========== FUNÇÕES UTILITÁRIAS ==========
window.logPdf = function(message, data = null) {
    if (!PDF_LOGGER_CONFIG.enabled) return;

    const timestamp = PDF_LOGGER_CONFIG.showTimestamps
        ? `[${new Date().toLocaleTimeString()}] `
        : '';

    console.log(`${timestamp}📄 ${message}`, data || '');
};

window.logPdfError = function(context, error) {
    console.error(`❌ PDF ERROR [${context}]:`, error);
};

window.logPdfStart = function(operation) {
    console.log(`🚀 INICIANDO: ${operation}`);
    return Date.now();
};

window.logPdfEnd = function(operation, startTime) {
    const duration = Date.now() - startTime;
    console.log(`✅ CONCLUÍDO: ${operation} (${duration}ms)`);
};

// ========== EXPORTAÇÃO GLOBAL ==========
window.PdfLogger = {
    upload: window.logPdfUpload,
    delete: window.logPdfDelete,
    preview: window.logPdfPreview,
    edit: window.logPdfEdit,
    viewer: window.logPdfViewer,
    debug: window.logPdfDebug,
    integration: window.logPdfIntegration,
    simple: window.logPdf,
    error: window.logPdfError,
    start: window.logPdfStart,
    end: window.logPdfEnd
};

// ========== FINAL ==========
console.log('✅ [SUPORTE] Sistema de logging de PDFs completamente carregado');
