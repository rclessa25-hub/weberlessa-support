// weberlessa-support/debug/benchmark.js
// SISTEMA DE BENCHMARK E MÉTRICAS DE PERFORMANCE
console.log('📊 benchmark.js carregado - Sistema de Métricas');

(function setupBenchmarkSystem() {
    if (window.BenchmarkSystem) return;
    
    window.BenchmarkSystem = {
        metrics: {
            loadTime: {},
            functionPerformance: {},
            memoryUsage: {}
        },
        
        startMeasurement: function(name) {
            this.metrics.loadTime[name] = {
                start: performance.now(),
                startMemory: performance.memory ? performance.memory.usedJSHeapSize : null
            };
        },
        
        endMeasurement: function(name) {
            if (!this.metrics.loadTime[name]) return;
            
            const measurement = this.metrics.loadTime[name];
            measurement.end = performance.now();
            measurement.duration = measurement.end - measurement.start;
            
            if (performance.memory) {
                measurement.endMemory = performance.memory.usedJSHeapSize;
                measurement.memoryDiff = measurement.endMemory - measurement.startMemory;
            }
            
            console.log(`⏱️ ${name}: ${measurement.duration.toFixed(2)}ms`);
            return measurement;
        },
        
        measureFunction: function(fnName, fn) {
            return function(...args) {
                const start = performance.now();
                const result = fn.apply(this, args);
                const duration = performance.now() - start;
                
                if (!this.metrics.functionPerformance[fnName]) {
                    this.metrics.functionPerformance[fnName] = [];
                }
                
                this.metrics.functionPerformance[fnName].push(duration);
                
                // Apenas logar se > 50ms (potencial problema)
                if (duration > 50) {
                    console.warn(`⚠️ ${fnName} demorou ${duration.toFixed(2)}ms`);
                }
                
                return result;
            }.bind(this);
        },
        
        generateReport: function() {
            console.group('📊 RELATÓRIO DE PERFORMANCE');
            
            // Tempos de carregamento
            console.log('⏱️ TEMPOS DE CARREGAMENTO:');
            Object.entries(this.metrics.loadTime).forEach(([name, data]) => {
                console.log(`  ${name}: ${data.duration ? data.duration.toFixed(2) + 'ms' : 'em andamento'}`);
            });
            
            // Performance de funções
            console.log('⚡ PERFORMANCE DE FUNÇÕES:');
            Object.entries(this.metrics.functionPerformance).forEach(([fnName, times]) => {
                const avg = times.reduce((a, b) => a + b, 0) / times.length;
                const max = Math.max(...times);
                console.log(`  ${fnName}: avg ${avg.toFixed(2)}ms, max ${max.toFixed(2)}ms (${times.length} chamadas)`);
            });
            
            // Uso de memória
            if (performance.memory) {
                console.log('💾 USO DE MEMÓRIA:');
                console.log(`  Heap usado: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`);
                console.log(`  Heap limite: ${(performance.memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)}MB`);
            }
            
            console.groupEnd();
            return this.metrics;
        }
    };
    
    // Iniciar medição do carregamento
    window.BenchmarkSystem.startMeasurement('pageLoad');
    
    console.log('✅ BenchmarkSystem pronto');
})();

// Medir quando a página carregar completamente
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.BenchmarkSystem) {
            window.BenchmarkSystem.endMeasurement('pageLoad');
        }
    });
} else {
    if (window.BenchmarkSystem) {
        window.BenchmarkSystem.endMeasurement('pageLoad');
    }
}
