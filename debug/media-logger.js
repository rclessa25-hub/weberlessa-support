// debug/media-logger.js - Sistema de Logs para Mídia
// Carregado apenas em modo debug (?debug=true)

console.log('📊 media-logger.js carregado do repositório de suporte');

// Verificar se já existe (evitar duplicação)
if (typeof window.MediaLogger === 'undefined') {
    
    // Sistema de logging estruturado
    window.MediaLogger = {
        // Log básico
        info: (module, message) => {
            console.log(`📊 [${module}] ${message}`);
        },
        
        // Log de erro
        error: (module, message) => {
            console.error(`❌ [${module}] ${message}`);
        },
        
        // Sistema de upload
        upload: {
            start: (count) => {
                console.log(`🚀 Upload iniciado: ${count} arquivo(s)`);
            },
            
            file: (index, total, fileName, fileSize) => {
                console.log(`📤 ${index}/${total}: ${fileName} (${fileSize})`);
            },
            
            success: (fileName, url = '') => {
                console.log(`✅ ${fileName} enviado com sucesso`);
                if (url) {
                    console.log(`🔗 URL: ${url.substring(0, 80)}${url.length > 80 ? '...' : ''}`);
                }
            },
            
            error: (fileName, error) => {
                console.error(`❌ Falha no upload de ${fileName}:`, error);
            }
        },
        
        // Sistema geral
        system: {
            init: (systemName) => {
                console.log(`🔧 Sistema de mídia inicializado: ${systemName}`);
            },
            
            config: (config) => {
                console.log('⚙️ Configuração do sistema:', config);
            }
        },
        
        // Preview/UI
        preview: {
            update: (itemCount) => {
                console.log(`🎨 Preview atualizado: ${itemCount} item(ns)`);
            },
            
            clear: () => {
                console.log('🧹 Preview limpo');
            }
        }
    };
    
    console.log('✅ MediaLogger carregado do repositório de suporte');
    
} else {
    console.log('⚠️ MediaLogger já estava carregado (ignorando duplicação)');
}

// Exportar para outros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.MediaLogger;
}
