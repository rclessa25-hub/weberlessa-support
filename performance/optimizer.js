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

// ========== CACHE INTELIGENTE ==========
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
    }
};

// ========== MONITOR DE PERFORMANCE ==========
window.PerformanceMonitor = {
    metrics: {
        pageLoad: null,
        functionCalls: new Map()
    },

    _navigationStart: performance.now(),
    _domContentLoadedTime: null,

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
        const now = performance.now();
        this.metrics.pageLoad = {
            domContentLoaded: this._domContentLoadedTime,
            pageLoaded: now - this._navigationStart
        };
        console.log('📊 Métricas de carregamento:', this.metrics.pageLoad);
    }
};

// ========== MONITORAMENTO DE OPERAÇÕES ==========
window.OperationMonitor = {
    operations: new Map(),

    startOperation(name, metadata = {}) {
        const operation = {
            id: `${name}_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            name,
            metadata,
            startTime: performance.now(),
            endTime: null,
            duration: null,
            success: null
        };
        this.operations.set(operation.id, operation);
        return operation.id;
    },

    endOperationSuccess(operationId) {
        const operation = this.operations.get(operationId);
        if (!operation) return;
        operation.endTime = performance.now();
        operation.duration = operation.endTime - operation.startTime;
        operation.success = true;

        if (!PerformanceMonitor.metrics.functionCalls.has(operation.name)) {
            PerformanceMonitor.metrics.functionCalls.set(operation.name, []);
        }
        PerformanceMonitor.metrics.functionCalls.get(operation.name).push(operation.duration);
    },

    endOperationError(operationId) {
        const operation = this.operations.get(operationId);
        if (!operation) return;
        operation.endTime = performance.now();
        operation.duration = operation.endTime - operation.startTime;
        operation.success = false;
    },

    getOperationStats() {
        const stats = {};
        this.operations.forEach(op => {
            if (!stats[op.name]) {
                stats[op.name] = { count: 0, successes: 0, failures: 0, total: 0 };
            }
            if (op.duration !== null) {
                stats[op.name].count++;
                stats[op.name].total += op.duration;
                op.success ? stats[op.name].successes++ : stats[op.name].failures++;
            }
        });
        Object.keys(stats).forEach(name => {
            stats[name].average = (stats[name].total / stats[name].count).toFixed(2);
            stats[name].total = stats[name].total.toFixed(2);
        });
        return stats;
    },

    wrapFunction(name, fn) {
        return async (...args) => {
            const id = this.startOperation(name);
            try {
                const result = await fn(...args);
                this.endOperationSuccess(id);
                return result;
            } catch (e) {
                this.endOperationError(id);
                throw e;
            }
        };
    }
};

// ========== WRAP DE FUNÇÕES CRÍTICAS ==========
window.wrapCriticalFunctions = function () {
    const functionsToWrap = [
        'initializeProperties',
        'renderProperties',
        'savePropertiesToStorage',
        'supabaseLoadProperties'
    ];
    functionsToWrap.forEach(fn => {
        if (typeof window[fn] === 'function' && !window[`_wrapped_${fn}`]) {
            window[`_wrapped_${fn}`] = true;
            window[fn] = OperationMonitor.wrapFunction(fn, window[fn]);
        }
    });
};

// ========== RELATÓRIO ==========
window.PerformanceReport = {
    generateReport() {
        console.group('📊 RELATÓRIO DE PERFORMANCE COMPLETO');
        if (PerformanceMonitor.metrics.pageLoad) {
            console.log(`⏱️ DOM Content Loaded: ${PerformanceMonitor.metrics.pageLoad.domContentLoaded}ms`);
            console.log(`⏱️ Page Loaded: ${PerformanceMonitor.metrics.pageLoad.pageLoaded}ms`);
        }
        const ops = OperationMonitor.getOperationStats();
        console.log('🚀 OPERAÇÕES MONITORADAS:', ops);
        console.groupEnd();
        return ops;
    }
};

// ========== INICIALIZAÇÃO ==========
(function initPerformanceSystem() {
    document.addEventListener('DOMContentLoaded', () => {
        PerformanceMonitor._domContentLoadedTime =
            performance.now() - PerformanceMonitor._navigationStart;
    });

    window.addEventListener('load', () => {
        PerformanceMonitor.recordPageLoad();
    });

    if (window.wrapCriticalFunctions) {
        wrapCriticalFunctions();
    }

    console.log('✅ Sistema de performance inicializado');
})();

console.log('⚡ Sistema de otimização de performance carregado');
