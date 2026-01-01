// weberlessa-support/performance/optimizer.js
console.log('⚡ optimizer.js - Sistema de Otimização de Performance');

// ========== SISTEMA DE CACHE ==========
window.PerformanceCache = {
    dom: new Map(),
    data: new Map(),
    images: new Map(),

    get(key, type = 'data') {
        const cache = this[type];
        if (cache.has(key)) {
            console.log(`⚡ Cache HIT: ${key} (${type})`);
            return cache.get(key);
        }
        console.log(`⚡ Cache MISS: ${key} (${type})`);
        return null;
    },

    set(key, value, type = 'data', ttl = 300000) {
        const cache = this[type];
        cache.set(key, value);
        setTimeout(() => {
            if (cache.has(key)) {
                cache.delete(key);
                console.log(`🧹 Cache expirado: ${key} (${type})`);
            }
        }, ttl);
        console.log(`💾 Cache SET: ${key} (${type}, TTL: ${ttl}ms)`);
        return true;
    },

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

// ========== CACHE INTELLIGENTE ==========
window.SmartCache = {
    invalidate(key, type = 'data') {
        if (PerformanceCache[type] && PerformanceCache[type].has(key)) {
            PerformanceCache[type].delete(key);
            console.log(`🗑️ Cache invalidado: ${key} (${type})`);
            return true;
        }
        return false;
    },

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

    invalidatePropertiesCache() {
        const invalidated = [
            this.invalidate('properties_data', 'data'),
            this.invalidatePattern('property_', 'data'),
            this.invalidatePattern('prop_', 'dom')
        ].filter(Boolean).length;
        console.log(`🏠 Cache de propriedades invalidado (${invalidated} itens)`);
        return invalidated;
    },

    setWithAutoInvalidation(key, value, type = 'data', ttl = 300000) {
        PerformanceCache.set(key, value, type, ttl);
        this.setupAutoInvalidation(key, type);
        return true;
    },

    setupAutoInvalidation(key, type) {
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

    start(name) {
        return { name, start: performance.now(), end: null, duration: null };
    },

    end(metric) {
        if (metric && metric.start) {
            metric.end = performance.now();
            metric.duration = metric.end - metric.start;
            if (!this.metrics.functionCalls.has(metric.name)) {
                this.metrics.functionCalls.set(metric.name, []);
            }
            this.metrics.functionCalls.get(metric.name).push(metric.duration);
            console.log(`⏱️ ${metric.name}: ${metric.duration.toFixed(2)}ms`);
            return metric;
        }
        return null;
    },

    recordPageLoad() {
        this.metrics.pageLoad = {
            domContentLoaded: performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart,
            pageLoaded: performance.timing.loadEventEnd - performance.timing.navigationStart
        };
        console.log('📊 Métricas de carregamento:', this.metrics.pageLoad);
    },

    getStats() {
        const stats = {};
        this.metrics.functionCalls.forEach((durations, name) => {
            if (durations.length > 0) {
                const avg = durations.reduce((a, b) => a + b, 0) / durations.length;
                stats[name] = {
                    calls: durations.length,
                    average: avg.toFixed(2),
                    max: Math.max(...durations).toFixed(2),
                    min: Math.min(...durations).toFixed(2)
                };
            }
        });
        return stats;
    }
};

// ========== MONITORAMENTO DE OPERAÇÕES ==========
window.OperationMonitor = {
    operations: new Map(),

    startOperation(name, metadata = {}) {
        const operation = {
            id: `${name}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            name, metadata,
            startTime: performance.now(),
            endTime: null,
            duration: null,
            success: null,
            error: null
        };
        this.operations.set(operation.id, operation);
        console.log(`🚀 Operação iniciada: ${name} (${operation.id})`);
        return operation.id;
    },

    endOperationSuccess(operationId, result = null) {
        const operation = this.operations.get(operationId);
        if (!operation) return null;
        operation.endTime = performance.now();
        operation.duration = operation.endTime - operation.startTime;
        operation.success = true;
        operation.result = result;
        console.log(`✅ Operação concluída: ${operation.name} (${operation.duration.toFixed(2)}ms)`);

        if (window.PerformanceMonitor) {
            PerformanceMonitor.metrics.functionCalls.set(
                operation.name,
                (PerformanceMonitor.metrics.functionCalls.get(operation.name) || []).concat(operation.duration)
            );
        }
        return operation;
    },

    endOperationError(operationId, error) {
        const operation = this.operations.get(operationId);
        if (!operation) return null;
        operation.endTime = performance.now();
        operation.duration = operation.endTime - operation.startTime;
        operation.success = false;
        operation.error = error.message || error;
        console.error(`❌ Operação falhou: ${operation.name} (${operation.duration.toFixed(2)}ms)`, error);
        return operation;
    },

    getOperationStats() {
        const stats = {};
        const operationsArray = Array.from(this.operations.values());
        const grouped = operationsArray.reduce((acc, op) => {
            if (!acc[op.name]) acc[op.name] = [];
            if (op.duration) acc[op.name].push(op.duration);
            return acc;
        }, {});
        Object.entries(grouped).forEach(([name, durations]) => {
            if (durations.length > 0) {
                const total = durations.reduce((a, b) => a + b, 0);
                const avg = total / durations.length;
                const ops = operationsArray.filter(op => op.name === name);
                const successes = ops.filter(op => op.success === true).length;
                const failures = ops.filter(op => op.success === false).length;

                stats[name] = {
                    count: durations.length,
                    successes,
                    failures,
                    successRate: successes / ops.length * 100,
                    average: avg.toFixed(2),
                    max: Math.max(...durations).toFixed(2),
                    min: Math.min(...durations).toFixed(2),
                    total: total.toFixed(2)
                };
            }
        });
        return stats;
    },

    wrapFunction(name, fn) {
        return async (...args) => {
            const opId = this.startOperation(name, { args: args.length });
            try {
                const result = await fn(...args);
                this.endOperationSuccess(opId, result);
                return result;
            } catch (error) {
                this.endOperationError(opId, error);
                throw error;
            }
        };
    }
};

// ========== WRAPPER PARA FUNÇÕES CRÍTICAS ==========
window.wrapCriticalFunctions = function() {
    console.log('🔧 Envolvendo funções críticas com monitoramento...');
    const functionsToWrap = [
        'initializeProperties',
        'renderProperties', 
        'addNewProperty',
        'updateProperty',
        'deleteProperty',
        'savePropertiesToStorage',
        'supabaseLoadProperties',
        'handleNewMediaFiles',
        'processAndSavePdfs'
    ];
    let wrappedCount = 0;
    functionsToWrap.forEach(funcName => {
        if (typeof window[funcName] === 'function' && !window[`_original_${funcName}`]) {
            window[`_original_${funcName}`] = window[funcName];
            window[funcName] = OperationMonitor.wrapFunction(funcName, window[funcName]);
            wrappedCount++;
            console.log(`✅ ${funcName} envolvida com monitoramento`);
        }
    });
    console.log(`🔧 ${wrappedCount} função(ões) envolvida(s) com monitoramento`);
    return wrappedCount;
};

// ========== PERFORMANCE REPORT ==========
window.PerformanceReport = {
    generateReport() {
        console.group('📊 RELATÓRIO DE PERFORMANCE COMPLETO');
        const pageLoad = PerformanceMonitor.metrics.pageLoad;
        if (pageLoad) {
            console.log(`⏱️ DOM Content Loaded: ${pageLoad.domContentLoaded}ms`);
            console.log(`⏱️ Page Loaded: ${pageLoad.pageLoaded}ms`);
        }

        let cacheHits = 0, cacheMisses = 0;
        if (window.performanceCacheLogs) {
            window.performanceCacheLogs.forEach(log => {
                if (log.type === 'hit') cacheHits++;
                if (log.type === 'miss') cacheMisses++;
            });
            const total = cacheHits + cacheMisses;
            const hitRate = total > 0 ? (cacheHits / total * 100).toFixed(1) : 0;
            console.log(`✅ Cache Hits: ${cacheHits}`);
            console.log(`❌ Cache Misses: ${cacheMisses}`);
            console.log(`📊 Hit Rate: ${hitRate}%`);
        }

        if (window.OperationMonitor) {
            console.log('\n🚀 OPERAÇÕES MONITORADAS:');
            const opsStats = OperationMonitor.getOperationStats();
            Object.entries(opsStats).forEach(([name, stats]) => {
                console.log(`📋 ${name}:`);
                console.log(`   🔢 Execuções: ${stats.count}`);
                console.log(`   ✅ Sucessos: ${stats.successes} (${stats.successRate.toFixed(1)}%)`);
                console.log(`   ❌ Falhas: ${stats.failures}`);
                console.log(`   ⏱️ Tempo médio: ${stats.average}ms`);
                console.log(`   📈 Tempo total: ${stats.total}ms`);
            });
        }

        console.groupEnd();
        return {
            pageLoad,
            cacheStats: { hits: cacheHits, misses: cacheMisses },
            operations: window.OperationMonitor ? OperationMonitor.getOperationStats() : {}
        };
    },

    startPeriodicReporting(interval = 30000) {
        if (!window.location.search.includes('debug=true')) return;
        console.log(`📈 Relatório de performance agendado a cada ${interval/1000}s`);
        setInterval(() => { this.generateReport(); }, interval);
        setTimeout(() => this.generateReport(), 5000);
    }
};

// Logs de cache
window.performanceCacheLogs = [];
const originalCacheGet = PerformanceCache.get;
const originalCacheSet = PerformanceCache.set;

PerformanceCache.get = function(key, type = 'data') {
    const result = originalCacheGet.call(this, key, type);
    window.performanceCacheLogs.push({
        timestamp: Date.now(),
        type: result !== null ? 'hit' : 'miss',
        key,
        cacheType: type
    });
    if (window.performanceCacheLogs.length > 100) {
        window.performanceCacheLogs = window.performanceCacheLogs.slice(-100);
    }
    return result;
};

PerformanceCache.set = function(key, value, type = 'data', ttl = 300000) {
    window.performanceCacheLogs.push({
        timestamp: Date.now(),
        type: 'set',
        key,
        cacheType: type,
        ttl
    });
    return originalCacheSet.call(this, key, value, type, ttl);
};

// ========== INICIALIZAÇÃO AVANÇADA ==========
(function initAdvancedPerformance() {
    console.log('🔧 Inicializando sistema avançado de performance...');
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => {
            PerformanceReport.startPeriodicReporting(60000);
        }, 3000);
    }
    if (window.OperationMonitor && window.wrapCriticalFunctions) {
        window.wrapCriticalFunctions();
    }
    console.log('✅ Sistema avançado de performance inicializado');
})();

// ========== INICIALIZAÇÃO AUTOMÁTICA ==========
(function initPerformanceSystem() {
    console.log('🔧 Inicializando sistema de performance...');
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            PerformanceMonitor.recordPageLoad();
        });
    } else {
        setTimeout(() => PerformanceMonitor.recordPageLoad(), 100);
    }
    setTimeout(() => {
        if (typeof window.PerformanceHelpers?.lazyLoadImages === 'function') {
            PerformanceHelpers.lazyLoadImages();
        }
    }, 1000);
    console.log('✅ Sistema de performance inicializado');
})();

// ========== TESTE E DEBUG ==========
if (window.location.search.includes('debug=true')) {
    window.testPerformance = function() {
        console.group('🧪 TESTE DE PERFORMANCE');
        PerformanceCache.set('test_key', 'test_value', 'data', 5000);
        const cached = PerformanceCache.get('test_key', 'data');
        console.log('Cache test:', cached === 'test_value' ? '✅' : '❌');
        const metric = PerformanceMonitor.start('test_function');
        setTimeout(() => {
            PerformanceMonitor.end(metric);
            const stats = PerformanceMonitor.getStats();
            console.log('📊 Estatísticas:', stats);
            console.groupEnd();
        }, 100);
    };
    setTimeout(() => { window.testPerformance(); }, 3000);
}

console.log('⚡ Sistema de otimização de performance carregado');
console.log('🔧 Módulos disponíveis: PerformanceCache, PerformanceMonitor, PerformanceHelpers, OperationMonitor, PerformanceReport, wrapCriticalFunctions');
