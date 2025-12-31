// weberlessa-support/performance/optimizer.js
console.log('⚡ optimizer.js - Sistema de Otimização de Performance');

// ========== SISTEMA DE CACHE ==========
window.PerformanceCache = {
    // Cache de elementos DOM
    dom: new Map(),
    
    // Cache de dados
    data: new Map(),
    
    // Cache de imagens
    images: new Map(),
    
    // Obter do cache
    get(key, type = 'data') {
        const cache = this[type];
        if (cache.has(key)) {
            console.log(`⚡ Cache HIT: ${key} (${type})`);
            return cache.get(key);
        }
        console.log(`⚡ Cache MISS: ${key} (${type})`);
        return null;
    },
    
    // Salvar no cache
    set(key, value, type = 'data', ttl = 300000) { // 5 minutos padrão
        const cache = this[type];
        cache.set(key, value);
        
        // Limpar após TTL
        setTimeout(() => {
            if (cache.has(key)) {
                cache.delete(key);
                console.log(`🧹 Cache expirado: ${key} (${type})`);
            }
        }, ttl);
        
        console.log(`💾 Cache SET: ${key} (${type}, TTL: ${ttl}ms)`);
        return true;
    },
    
    // Limpar cache
    clear(type = null) {
        if (type && this[type]) {
            this[type].clear();
            console.log(`🧹 Cache limpo: ${type}`);
        } else {
            Object.values(this).forEach(cache => {
                if (cache instanceof Map) cache.clear();
            });
            console.log('🧹 Todos os caches limpos');
        }
    }
};

// ========== CACHE INTELLIGENTE (INVALIDATION AUTOMÁTICA) ==========
window.SmartCache = {
    // Invalidar cache específico
    invalidate(key, type = 'data') {
        if (PerformanceCache[type] && PerformanceCache[type].has(key)) {
            PerformanceCache[type].delete(key);
            console.log(`🗑️ Cache invalidado: ${key} (${type})`);
            return true;
        }
        return false;
    },
    
    // Invalidar múltiplos caches
    invalidatePattern(pattern, type = 'data') {
        if (!PerformanceCache[type]) return 0;
        
        let count = 0;
        for (const key of PerformanceCache[type].keys()) {
            if (key.includes(pattern)) {
                PerformanceCache[type].delete(key);
                count++;
            }
        }
        
        if (count > 0) {
            console.log(`🗑️ ${count} cache(s) invalidado(s) com padrão: "${pattern}"`);
        }
        
        return count;
    },
    
    // Invalidar cache de propriedades (CRUD operations)
    invalidatePropertiesCache() {
        const invalidated = [
            this.invalidate('properties_data', 'data'),
            this.invalidatePattern('property_', 'data'),
            this.invalidatePattern('prop_', 'dom')
        ].filter(Boolean).length;
        
        console.log(`🏠 Cache de propriedades invalidado (${invalidated} itens)`);
        return invalidated;
    },
    
    // Cache com auto-invalidation por eventos
    setWithAutoInvalidation(key, value, type = 'data', ttl = 300000) {
        PerformanceCache.set(key, value, type, ttl);
        
        // Configurar invalidação por eventos
        this.setupAutoInvalidation(key, type);
        
        return true;
    },
    
    // Configurar invalidação automática
    setupAutoInvalidation(key, type) {
        // Invalidar quando houver mudanças no DOM (simplificado)
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' || mutation.type === 'attributes') {
                    if (PerformanceCache[type] && PerformanceCache[type].has(key)) {
                        PerformanceCache[type].delete(key);
                        console.log(`🔄 Cache auto-invalidado: ${key} (${type}) por mudança DOM`);
                        observer.disconnect();
                    }
                }
            });
        });
        
        // Observar mudanças no container de propriedades
        const container = document.getElementById('properties-container');
        if (container) {
            observer.observe(container, {
                childList: true,
                subtree: true,
                attributes: false
            });
        }
    }
};

// ========== MONITOR DE PERFORMANCE ==========
window.PerformanceMonitor = {
    metrics: {
        domLoad: null,
        pageLoad: null,
        functionCalls: new Map(),
        apiCalls: new Map(),
        renderTimes: []
    },
    
    // Marcar início
    start(name) {
        return {
            name,
            start: performance.now(),
            end: null,
            duration: null
        };
    },
    
    // Marcar fim
    end(metric) {
        if (metric && metric.start) {
            metric.end = performance.now();
            metric.duration = metric.end - metric.start;
            
            // Armazenar métrica
            if (!this.metrics.functionCalls.has(metric.name)) {
                this.metrics.functionCalls.set(metric.name, []);
            }
            this.metrics.functionCalls.get(metric.name).push(metric.duration);
            
            console.log(`⏱️ ${metric.name}: ${metric.duration.toFixed(2)}ms`);
            return metric;
        }
        return null;
    },
    
    // Registrar carregamento de página
    recordPageLoad() {
        this.metrics.pageLoad = {
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            pageLoaded: performance.timing.loadEventEnd - performance.timing.navigationStart
        };
        console.log('📊 Métricas de carregamento:', this.metrics.pageLoad);
    },
    
    // Obter estatísticas
    getStats() {
        const stats = {};
        
        // Estatísticas de funções
        this.metrics.functionCalls.forEach((durations, name) => {
            if (durations.length > 0) {
                const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
                const max = Math.max(...durations);
                const min = Math.min(...durations);
                
                stats[name] = {
                    calls: durations.length,
                    average: avg.toFixed(2),
                    max: max.toFixed(2),
                    min: min.toFixed(2)
                };
            }
        });
        
        return stats;
    }
};

// ========== OPTIMIZATION HELPERS ==========
window.PerformanceHelpers = {
    // Lazy loading para imagens
    lazyLoadImages(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                    console.log(`🖼️ Lazy loaded: ${img.src.substring(0, 50)}...`);
                }
            });
        });
        
        images.forEach(img => observer.observe(img));
        console.log(`👀 Lazy loading configurado para ${images.length} imagem(ns)`);
    },
    
    // Defer execution
    defer(callback, delay = 100) {
        return setTimeout(callback, delay);
    },
    
    // Batch DOM updates
    batchUpdate(callback) {
        requestAnimationFrame(() => {
            callback();
            console.log('🔄 Batch update executado');
        });
    },
    
    // Image optimization helper
    optimizeImageUrl(url, options = {}) {
        const defaultOptions = {
            width: 800,
            quality: 80,
            format: 'webp'
        };
        const opts = { ...defaultOptions, ...options };
        
        // Simulação - em produção usaria CDN ou service worker
        console.log(`🖼️ Otimizando imagem: ${url.substring(0, 50)}...`);
        return url;
    }
};

// ========== INICIALIZAÇÃO AUTOMÁTICA ==========
(function initPerformanceSystem() {
    console.log('🔧 Inicializando sistema de performance...');
    
    // Registrar carregamento da página
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            PerformanceMonitor.recordPageLoad();
        });
    } else {
        setTimeout(() => PerformanceMonitor.recordPageLoad(), 100);
    }
    
    // Configurar lazy loading após 1 segundo
    setTimeout(() => {
        if (typeof window.PerformanceHelpers.lazyLoadImages === 'function') {
            PerformanceHelpers.lazyLoadImages();
        }
    }, 1000);
    
    console.log('✅ Sistema de performance inicializado');
})();

// ========== TESTE E DEBUG ==========
if (window.location.search.includes('debug=true')) {
    // Adicionar funções de teste
    window.testPerformance = function() {
        console.group('🧪 TESTE DE PERFORMANCE');
        
        // Teste de cache
        PerformanceCache.set('test_key', 'test_value', 'data', 5000);
        const cached = PerformanceCache.get('test_key', 'data');
        console.log('Cache test:', cached === 'test_value' ? '✅' : '❌');
        
        // Teste de monitor
        const metric = PerformanceMonitor.start('test_function');
        setTimeout(() => {
            PerformanceMonitor.end(metric);
            
            // Mostrar estatísticas
            const stats = PerformanceMonitor.getStats();
            console.log('📊 Estatísticas:', stats);
            
            console.groupEnd();
        }, 100);
    };
    
    // Executar teste após 3 segundos
    setTimeout(() => {
        window.testPerformance();
    }, 3000);
}

console.log('⚡ Sistema de otimização de performance carregado');
console.log('🔧 Módulos disponíveis: PerformanceCache, PerformanceMonitor, PerformanceHelpers');
