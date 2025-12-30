// weberlessa-support/debug/media-logger.js - VERSÃO CONFLITO-SEGURA
console.log('📊 media-logger.js carregado do repositório de suporte');

// ⚡ VERIFICAR SE JÁ EXISTE PARA EVITAR DUPLICAÇÃO
if (typeof window.MEDIA_LOGGER_CONFIG !== 'undefined') {
    console.warn('⚠️ MEDIA_LOGGER_CONFIG já existe! Ignorando recriação.');
    console.log('ℹ️ Provavelmente o arquivo original ainda está sendo carregado.');
    console.log('💡 Solução: Remova js/modules/media/media-logger.js do index.html');
    return; // PARA EXECUÇÃO - não recria objetos existentes
}

/**
 * SISTEMA DE LOGGING OTIMIZADO PARA MÓDULO DE MÍDIA
 * Design: Singleton pattern com métodos estáticos
 */

// ⚡ CONFIGURAÇÃO OTIMIZADA (objeto imutável)
const MEDIA_LOGGER_CONFIG = Object.freeze({
    enabled: true,
    level: 'info', // debug, info, warn, error
    showTimestamps: true,
    maxHistory: 100,
    colors: {
        debug: '#95a5a6',
        info: '#3498db',
        success: '#27ae60',
        warn: '#f39c12',
        error: '#e74c3c'
    }
});

// ⚡ CACHE DE LOGS (array circular para performance)
if (!window.mediaLogHistory) {
    window.mediaLogHistory = [];
}

// ⚡ FUNÇÃO PRINCIPAL (única exportação para reduzir overhead)
window.mediaLog = function(level, module, message, data = null) {
    if (!MEDIA_LOGGER_CONFIG.enabled) return;
    
    // ⚡ Criação de timestamp otimizada
    const timestamp = MEDIA_LOGGER_CONFIG.showTimestamps ? 
        `[${new Date().toLocaleTimeString()}]` : '';
    
    // ⚡ Console log com cor específica
    const color = MEDIA_LOGGER_CONFIG.colors[level] || '#333';
    const prefix = `%c📦 [${module}]`;
    const style = `color: ${color}; font-weight: bold;`;
    
    console.log(`${timestamp} ${prefix}: ${message}`, style, data || '');
    
    // ⚡ Armazenamento em histórico (circular buffer)
    const logEntry = { timestamp: Date.now(), level, module, message, data };
    window.mediaLogHistory.push(logEntry);
    
    // ⚡ Mantém histórico limitado para performance
    if (window.mediaLogHistory.length > MEDIA_LOGGER_CONFIG.maxHistory) {
        window.mediaLogHistory.shift();
    }
};

// ⚡ MÉTODOS DE FACILIDADE (encapsulam a função principal)
window.MediaLogger = {
    debug: (module, message, data) => 
        window.mediaLog('debug', module, message, data),
    
    info: (module, message, data) => 
        window.mediaLog('info', module, message, data),
    
    success: (module, message, data) => 
        window.mediaLog('success', module, message, data),
    
    warn: (module, message, data) => 
        window.mediaLog('warn', module, message, data),
    
    error: (module, message, data) => 
        window.mediaLog('error', module, message, data),
    
    // ⚡ MÉTODOS ESPECÍFICOS PARA MÓDULO DE MÍDIA
    upload: {
        start: (count) => 
            window.mediaLog('info', 'UPLOAD', `Iniciando upload de ${count} arquivo(s)`),
        
        file: (index, total, fileName, size) => 
            window.mediaLog('debug', 'UPLOAD', `[${index}/${total}] ${fileName} (${size})`),
        
        success: (fileName, url) => 
            window.mediaLog('success', 'UPLOAD', `✅ ${fileName} enviado`),
        
        error: (fileName, error) => 
            window.mediaLog('error', 'UPLOAD', `❌ ${fileName}: ${error.message}`)
    },
    
    preview: {
        update: (count) => 
            window.mediaLog('debug', 'PREVIEW', `Atualizando preview: ${count} itens`),
        
        clear: () => 
            window.mediaLog('info', 'PREVIEW', 'Preview limpo')
    },
    
    system: {
        init: (systemName) => 
            window.mediaLog('info', 'SYSTEM', `Inicializado para: ${systemName}`),
        
        config: (config) => 
            window.mediaLog('debug', 'SYSTEM', `Config: ${JSON.stringify(config).substring(0, 100)}...`)
    },
    
    // ⚡ MÉTODO DE DIAGNÓSTICO (para debug)
    diagnose: () => {
        console.group('🔍 DIAGNÓSTICO DO MEDIA LOGGER');
        console.log('Config:', MEDIA_LOGGER_CONFIG);
        console.log('Histórico:', window.mediaLogHistory.length, 'entradas');
        console.log('Últimas 3:', window.mediaLogHistory.slice(-3));
        console.groupEnd();
    }
};

// ⚡ INICIALIZAÇÃO AUTOMÁTICA
setTimeout(() => {
    window.MediaLogger.system.init(window.currentMediaSystem || 'vendas');
    console.log('✅ MediaLogger pronto para uso');
}, 100);

console.log('📊 MediaLogger carregado. Use: window.MediaLogger.upload.start(5)');
