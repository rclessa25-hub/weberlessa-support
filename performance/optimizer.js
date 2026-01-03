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
        } else {
            Object.values(this).forEach(c => c instanceof Map && c.clear());
        }
    }
};

// ========== CACHE INTELIGENTE ==========
window.SmartCache = {
    invalidate(key, type = 'data') {
        if (PerformanceCache[type]?.has(key)) {
            PerformanceCache[type].delete(key);
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
        return count;
    },

    invalidatePropertiesCache() {
        return [
            this.invalidate('properties_data', 'data'),
            this.invalidatePattern('property_', 'data'),
            this.invalidatePattern('prop_', 'dom')
        ].filter(Boolean).length;
    },

    setWithAutoInvalidation(key, value, type = 'data', ttl = 300000) {
        PerformanceCache.set(key, value, type, ttl);

        if (type === 'dom') {
            const container = document.getElementById('properties-container');
            if (!container) return true;

            const observer = new MutationObserver(() => {
                if (PerformanceCache[type]?.has(key)) {
                    PerformanceCache[type].delete(key);
                    observer.disconnect();
                    console.log(`🔄 Cache auto-invalidado: ${key} (${type})`);
                }
            });

            observer.observe(container, { childList: true, subtree: true });
        }

        return true;
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
        return { name, start: performance.now() };
    },

    end(metric) {
        const duration = performance.now() - metric.start;
        if (!this.metrics.functionCalls.has(metric.name)) {
            this.metrics.functionCalls.set(metric.name, []);
        }
        this.metrics.functionCalls.get(metric.name).push(duration);
        return duration;
    },

    recordPageLoad() {
        const now = performance.now();
        this.metrics.pageLoad = {
            domContentLoaded: this._domContentLoadedTime,
            pageLoaded: now - this._navigationStart
        };
    }
};

// ========== MONITORAMENTO DE OPERAÇÕES ==========
window.OperationMonitor = {
    operations: new Map(),

    startOperation(name) {
        const id = `${name}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        this.operations.set(id, {
            name,
            start: performance.now(),
            success: null,
            duration: null
        });
        return id;
    },

    endOperationSuccess(id) {
        const op = this.operations.get(id);
        if (!op) return;
        op.duration = performance.now() - op.start;
        op.success = true;
    },

    endOperationError(id) {
        const op = this.operations.get(id);
        if (!op) return;
        op.duration = performance.now() - op.start;
        op.success = false;
    },

    wrapFunction(name, fn) {
        return async (...args) => {
            const id = this.startOperation(name);
            try {
                const res = await fn(...args);
                this.endOperationSuccess(id);
                return res;
            } catch (e) {
                this.endOperationError(id);
                throw e;
            }
        };
    },

    getOperationStats() {
        const stats = {};
        this.operations.forEach(op => {
            if (!stats[op.name]) {
                stats[op.name] = { count: 0, successes: 0, failures: 0, total: 0 };
            }
            stats[op.name].count++;
            stats[op.name].total += op.duration || 0;
            op.success ? stats[op.name].successes++ : stats[op.name].failures++;
        });
        Object.keys(stats).forEach(name => {
            stats[name].average = (stats[name].total / stats[name].count).toFixed(2);
            stats[name].total = stats[name].total.toFixed(2);
        });
        return stats;
    }
};

// ========== WRAP DE FUNÇÕES CRÍTICAS ==========
window.wrapCriticalFunctions = function () {
    [
        'initializeProperties',
        'renderProperties',
        'savePropertiesToStorage',
        'supabaseLoadProperties'
    ].forEach(fn => {
        if (typeof window[fn] === 'function' && !window[`_wrapped_${fn}`]) {
            window[`_wrapped_${fn}`] = true;
            window[fn] = OperationMonitor.wrapFunction(fn, window[fn]);
        }
    });
};

// ========== RELATÓRIO ==========
window.PerformanceReport = {
    generateReport() {
        console.group('📊 RELATÓRIO DE PERFORMANCE');
        if (PerformanceMonitor.metrics.pageLoad) {
            console.log('DOM Loaded:', PerformanceMonitor.metrics.pageLoad.domContentLoaded, 'ms');
            console.log('Page Loaded:', PerformanceMonitor.metrics.pageLoad.pageLoaded, 'ms');
        }
        console.log('Operações:', OperationMonitor.getOperationStats());
        console.groupEnd();
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

    wrapCriticalFunctions();
    console.log('✅ Sistema de performance inicializado');
})();

console.log('⚡ optimizer.js carregado com sucesso');
