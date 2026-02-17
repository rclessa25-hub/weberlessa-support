// weberlessa-support/performance/performance-system.js
// SISTEMA CONSOLIDADO DE PERFORMANCE, OTIMIZAÇÃO E BENCHMARK
console.log('📊 performance-system.js - Sistema Consolidado (benchmark + core-optimizer + optimizer)');

(function() {
    'use strict';
    
    // ========== CONFIGURAÇÃO ==========
    const CONFIG = {
        isDebugMode: window.location.search.includes('debug=true') || 
                    window.location.search.includes('test=true') ||
                    window.location.hostname.includes('localhost'),
        cacheTTL: 300000, // 5 minutos
        debounceTime: 100, // 100ms
        memoryAlertThreshold: 100 // MB
    };
    
    // ========== SISTEMA DE CACHE INTELIGENTE (ESSENCIAL SIMPLIFICADO) ==========
    const SmartCache = {
        cache: new Map(),
        timestamps: new Map(),
        
        set(key, value, ttl = CONFIG.cacheTTL) {
            this.cache.set(key, value);
            this.timestamps.set(key, Date.now() + ttl);
            
            // Auto-limpeza
            this._cleanup();
            return true;
        },
        
        get(key) {
            this._cleanup();
            if (!this.cache.has(key)) return null;
            
            const expiry = this.timestamps.get(key);
            if (Date.now() > expiry) {
                this.cache.delete(key);
                this.timestamps.delete(key);
                return null;
            }
            
            return this.cache.get(key);
        },
        
        invalidate(key) {
            this.cache.delete(key);
            this.timestamps.delete(key);
            return true;
        },
        
        invalidatePattern(pattern) {
            let count = 0;
            for (const key of this.cache.keys()) {
                if (key.includes(pattern)) {
                    this.cache.delete(key);
                    this.timestamps.delete(key);
                    count++;
                }
            }
            return count;
        },
        
        _cleanup() {
            const now = Date.now();
            for (const [key, expiry] of this.timestamps.entries()) {
                if (now > expiry) {
                    this.cache.delete(key);
                    this.timestamps.delete(key);
                }
            }
        },
        
        clear() {
            this.cache.clear();
            this.timestamps.clear();
        }
    };
    
    // ========== SISTEMA DE BENCHMARK ==========
    const BenchmarkSystem = {
        metrics: {
            pageLoad: null,
            moduleLoadTimes: {},
            functionPerformance: {},
            memorySnapshots: []
        },
        
        startMeasurement(name) {
            this.metrics.moduleLoadTimes[name] = {
                start: performance.now(),
                startTime: new Date().toISOString()
            };
        },
        
        endMeasurement(name) {
            if (!this.metrics.moduleLoadTimes[name]) return null;
            
            const measurement = this.metrics.moduleLoadTimes[name];
            measurement.end = performance.now();
            measurement.duration = measurement.end - measurement.start;
            
            // Registrar memória se disponível
            if (performance.memory) {
                measurement.memoryUsed = performance.memory.usedJSHeapSize;
                measurement.memoryTotal = performance.memory.totalJSHeapSize;
            }
            
            if (CONFIG.isDebugMode) {
                console.log(`⏱️ ${name}: ${measurement.duration.toFixed(2)}ms`);
            }
            
            return measurement;
        },
        
        measureFunction(fnName, fn) {
            return function(...args) {
                const start = performance.now();
                const result = fn.apply(this, args);
                const duration = performance.now() - start;
                
                // Registrar apenas em debug ou se for lento
                if (CONFIG.isDebugMode || duration > 50) {
                    if (!this.metrics.functionPerformance[fnName]) {
                        this.metrics.functionPerformance[fnName] = [];
                    }
                    this.metrics.functionPerformance[fnName].push(duration);
                    
                    if (duration > 100) {
                        console.warn(`⚠️ ${fnName} demorou ${duration.toFixed(2)}ms`);
                    }
                }
                
                return result;
            };
        },
        
        takeMemorySnapshot() {
            if (!performance.memory) return null;
            
            const snapshot = {
                timestamp: new Date().toISOString(),
                usedJSHeapSize: performance.memory.usedJSHeapSize,
                totalJSHeapSize: performance.memory.totalJSHeapSize,
                jsHeapSizeLimit: performance.memory.jsHeapSizeLimit
            };
            
            this.metrics.memorySnapshots.push(snapshot);
            
            // Alertar se uso de memória alto
            const usedMB = snapshot.usedJSHeapSize / 1024 / 1024;
            if (usedMB > CONFIG.memoryAlertThreshold) {
                console.warn(`⚠️ Alto uso de memória: ${usedMB.toFixed(2)}MB`);
            }
            
            return snapshot;
        },
        
        generateReport() {
            const report = {
                timestamp: new Date().toISOString(),
                url: window.location.href,
                userAgent: navigator.userAgent,
                metrics: JSON.parse(JSON.stringify(this.metrics))
            };
            
            // Calcular médias
            Object.keys(report.metrics.functionPerformance).forEach(fnName => {
                const times = report.metrics.functionPerformance[fnName];
                if (times && times.length > 0) {
                    const avg = times.reduce((a, b) => a + b, 0) / times.length;
                    const max = Math.max(...times);
                    const min = Math.min(...times);
                    
                    report.metrics.functionPerformance[fnName] = {
                        callCount: times.length,
                        average: parseFloat(avg.toFixed(2)),
                        max: parseFloat(max.toFixed(2)),
                        min: parseFloat(min.toFixed(2)),
                        rawTimes: times
                    };
                }
            });
            
            return report;
        }
    };
    
    // ========== ANALISADOR DO CORE SYSTEM ==========
    const CoreAnalyzer = {
        analyze() {
            const analysis = {
                timestamp: new Date().toISOString(),
                modules: {
                    loaded: 0,
                    core: 0,
                    support: 0,
                    external: 0
                },
                functions: {
                    total: 0,
                    essential: 0,
                    debug: 0
                },
                variables: {
                    essential: 0,
                    windowSize: 0
                },
                recommendations: []
            };
            
            // Analisar scripts
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            analysis.modules.loaded = scripts.length;
            analysis.modules.core = scripts.filter(s => s.src.includes('/js/modules/')).length;
            analysis.modules.support = scripts.filter(s => s.src.includes('weberlessa-support')).length;
            analysis.modules.external = scripts.filter(s => !s.src.includes('github.io')).length;
            
            // Analisar funções globais
            const functionBlacklist = ['webkit', 'webkitURL', 'webkitRTCPeerConnection', '_', '$'];
            const globalFuncs = Object.keys(window).filter(key => 
                typeof window[key] === 'function' && 
                !key.startsWith('_') &&
                !functionBlacklist.some(prefix => key.startsWith(prefix)) &&
                key.length > 2
            );
            
            analysis.functions.total = globalFuncs.length;
            
            const essentialFuncs = [
                'initializeProperties', 'renderProperties', 'addNewProperty',
                'updateProperty', 'deleteProperty', 'openGallery', 'closeGallery',
                'toggleAdminPanel', 'savePropertiesToStorage', 'loadPropertiesData',
                'setupFilters', 'contactAgent', 'cancelEdit', 'editProperty'
            ];
            
            analysis.functions.essential = globalFuncs.filter(f => 
                essentialFuncs.includes(f)
            ).length;
            
            analysis.functions.debug = globalFuncs.filter(f => 
                f.includes('debug') || f.includes('test') || f.includes('diagnose')
            ).length;
            
            // Analisar variáveis
            const essentialVars = [
                'properties', 'supabaseClient', 'SUPABASE_URL', 'SUPABASE_KEY',
                'SUPABASE_CONSTANTS', 'ADMIN_PASSWORD', 'PDF_PASSWORD',
                'currentFilter', 'editingPropertyId'
            ];
            
            analysis.variables.essential = essentialVars.filter(v => 
                window[v] !== undefined
            ).length;
            
            analysis.variables.windowSize = Object.keys(window).length;
            
            // Gerar recomendações
            if (analysis.functions.debug > 5) {
                analysis.recommendations.push({
                    priority: 'HIGH',
                    message: `${analysis.functions.debug} funções de debug encontradas no Core`,
                    action: 'Migrar funções de debug para Support System'
                });
            }
            
            if (analysis.modules.support > 0 && !CONFIG.isDebugMode) {
                analysis.recommendations.push({
                    priority: 'HIGH',
                    message: 'Módulos do Support System carregados em produção',
                    action: 'Verificar carregamento condicional no index.html'
                });
            }
            
            if (analysis.functions.total > 60) {
                analysis.recommendations.push({
                    priority: 'MEDIUM',
                    message: `Muitas funções globais (${analysis.functions.total})`,
                    action: 'Consolidar funções auxiliares em módulos'
                });
            }
            
            if (analysis.variables.windowSize > 200) {
                analysis.recommendations.push({
                    priority: 'LOW',
                    message: `Window object grande (${analysis.variables.windowSize} propriedades)`,
                    action: 'Limpar variáveis temporárias e globais não usadas'
                });
            }
            
            return analysis;
        },
        
        optimizeCriticalFunctions() {
            const optimizations = [];
            
            // 1. Otimizar renderProperties com debounce
            if (typeof window.renderProperties === 'function') {
                const originalRender = window.renderProperties;
                let renderTimeout = null;
                let lastRenderTime = 0;
                
                window.renderProperties = function(filter = 'todos') {
                    // Debouncing
                    if (renderTimeout) {
                        clearTimeout(renderTimeout);
                    }
                    
                    return new Promise((resolve) => {
                        renderTimeout = setTimeout(() => {
                            const startTime = performance.now();
                            const result = originalRender.call(this, filter);
                            const duration = performance.now() - startTime;
                            
                            if (CONFIG.isDebugMode && duration > 50) {
                                console.log(`⚡ renderProperties: ${duration.toFixed(2)}ms (filtro: ${filter})`);
                            }
                            
                            resolve(result);
                        }, CONFIG.debounceTime);
                    });
                };
                
                optimizations.push('renderProperties com debounce de 100ms');
            }
            
            // 2. Cache para propriedades
            if (typeof window.loadPropertiesData === 'function') {
                const originalLoad = window.loadPropertiesData;
                
                window.loadPropertiesData = async function() {
                    const cacheKey = 'properties_data_cache';
                    const cached = SmartCache.get(cacheKey);
                    
                    if (cached && !CONFIG.isDebugMode) {
                        console.log('⚡ Usando cache para propriedades');
                        window.properties = cached.data;
                        
                        if (typeof window.renderProperties === 'function') {
                            window.renderProperties('todos');
                        }
                        
                        return cached.data;
                    }
                    
                    const startTime = performance.now();
                    const result = await originalLoad.call(this);
                    const duration = performance.now() - startTime;
                    
                    // Cache por 2 minutos
                    SmartCache.set(cacheKey, {
                        data: window.properties,
                        timestamp: new Date().toISOString(),
                        loadTime: duration
                    }, 120000);
                    
                    if (CONFIG.isDebugMode) {
                        console.log(`📦 Propriedades carregadas: ${duration.toFixed(2)}ms`);
                    }
                    
                    return result;
                };
                
                optimizations.push('cache para loadPropertiesData (2 minutos)');
            }
            
            return optimizations;
        }
    };
    
    // ========== MONITOR DE PERFORMANCE ==========
    const PerformanceMonitor = {
        metrics: {
            pageLoad: null,
            domReady: null,
            resourceTiming: []
        },
        
        init() {
            // DOM Ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    this.metrics.domReady = performance.now();
                });
            } else {
                this.metrics.domReady = performance.now();
            }
            
            // Page Load
            window.addEventListener('load', () => {
                this.metrics.pageLoad = performance.now();
                this._logPageLoadMetrics();
            });
            
            // Resource timing
            if (performance.getEntriesByType) {
                setTimeout(() => {
                    this.metrics.resourceTiming = performance.getEntriesByType('resource');
                }, 2000);
            }
            
            // Memory monitoring (se disponível)
            if (performance.memory) {
                setInterval(() => {
                    BenchmarkSystem.takeMemorySnapshot();
                }, 30000); // A cada 30 segundos
            }
        },
        
        _logPageLoadMetrics() {
            if (!CONFIG.isDebugMode) return;
            
            const loadTime = this.metrics.pageLoad;
            const domTime = this.metrics.domReady;
            
            console.group('📈 Métricas de Carregamento');
            console.log(`DOM Ready: ${domTime ? domTime.toFixed(2) + 'ms' : 'N/A'}`);
            console.log(`Page Load: ${loadTime ? loadTime.toFixed(2) + 'ms' : 'N/A'}`);
            
            if (loadTime && domTime) {
                console.log(`Content Load: ${(loadTime - domTime).toFixed(2)}ms`);
            }
            
            // Análise de recursos
            if (this.metrics.resourceTiming.length > 0) {
                const scripts = this.metrics.resourceTiming.filter(r => 
                    r.initiatorType === 'script'
                );
                const images = this.metrics.resourceTiming.filter(r => 
                    r.initiatorType === 'img'
                );
                
                console.log(`Scripts: ${scripts.length} (${this._formatTotalSize(scripts)} KB)`);
                console.log(`Imagens: ${images.length} (${this._formatTotalSize(images)} KB)`);
            }
            
            console.groupEnd();
        },
        
        _formatTotalSize(resources) {
            const total = resources.reduce((sum, r) => sum + (r.transferSize || 0), 0);
            return (total / 1024).toFixed(2);
        }
    };
    
    // ========== RELATÓRIO FINAL ==========
    const PerformanceReporter = {
        generateComprehensiveReport() {
            const report = {
                system: 'Weber Lessa Performance System',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                environment: CONFIG.isDebugMode ? 'debug' : 'production',
                
                benchmark: BenchmarkSystem.generateReport(),
                analysis: CoreAnalyzer.analyze(),
                cache: {
                    size: SmartCache.cache.size,
                    keys: Array.from(SmartCache.cache.keys())
                },
                performance: PerformanceMonitor.metrics,
                
                recommendations: []
            };
            
            // Adicionar recomendações da análise
            if (report.analysis.recommendations) {
                report.recommendations.push(...report.analysis.recommendations);
            }
            
            // Adicionar recomendações de performance
            if (report.performance.pageLoad && report.performance.pageLoad > 3000) {
                report.recommendations.push({
                    priority: 'MEDIUM',
                    message: `Tempo de carregamento alto: ${report.performance.pageLoad.toFixed(2)}ms`,
                    action: 'Otimizar recursos críticos e implementar lazy loading'
                });
            }
            
            if (report.benchmark.metrics?.memorySnapshots?.length > 0) {
                const lastSnapshot = report.benchmark.metrics.memorySnapshots.slice(-1)[0];
                const usedMB = lastSnapshot.usedJSHeapSize / 1024 / 1024;
                
                if (usedMB > CONFIG.memoryAlertThreshold) {
                    report.recommendations.push({
                        priority: 'HIGH',
                        message: `Alto uso de memória: ${usedMB.toFixed(2)}MB`,
                        action: 'Verificar memory leaks e limpar referências não usadas'
                    });
                }
            }
            
            return report;
        },
        
        printReportToConsole() {
            const report = this.generateComprehensiveReport();
            
            console.log('📊 GERANDO RELATÓRIO DE PERFORMANCE...');
            console.group('📊 RELATÓRIO COMPREENSIVO DE PERFORMANCE');
            console.log('🕐 Hora:', report.timestamp);
            console.log('🌍 Ambiente:', report.environment);
            console.log('📦 Sistema:', report.system, 'v' + report.version);
            
            console.group('📈 MÉTRICAS PRINCIPAIS');
            console.log('⏱️ Tempo de carregamento:', 
                report.performance.pageLoad ? report.performance.pageLoad.toFixed(2) + 'ms' : 'N/A');
            
            if (report.benchmark.metrics?.memorySnapshots?.length > 0) {
                const lastSnapshot = report.benchmark.metrics.memorySnapshots.slice(-1)[0];
                console.log('🧠 Uso de memória:', (lastSnapshot.usedJSHeapSize / 1024 / 1024).toFixed(2) + 'MB');
            } else {
                console.log('🧠 Uso de memória: N/A (API memory não disponível)');
            }
            
            console.log('💾 Cache:', report.cache.size + ' itens');
            console.groupEnd();
            
            console.group('🔍 ANÁLISE DO CORE SYSTEM');
            console.log('📦 Módulos carregados:', report.analysis.modules.loaded);
            console.log('⚡ Funções essenciais:', report.analysis.functions.essential + '/' + report.analysis.functions.total);
            console.log('🐛 Funções de debug:', report.analysis.functions.debug);
            console.groupEnd();
            
            // Benchmark de funções
            const functionMetrics = report.benchmark.metrics.functionPerformance;
            if (Object.keys(functionMetrics).length > 0) {
                console.group('⚡ PERFORMANCE DE FUNÇÕES');
                Object.entries(functionMetrics).forEach(([fnName, data]) => {
                    console.log(`  ${fnName}: média ${data.average}ms (${data.callCount} chamadas)`);
                });
                console.groupEnd();
            }
            
            if (report.recommendations.length > 0) {
                console.group('💡 RECOMENDAÇÕES');
                report.recommendations.forEach((rec, i) => {
                    console.log(`${i+1}. [${rec.priority}] ${rec.message}`);
                    console.log(`   → ${rec.action}`);
                });
                console.groupEnd();
            }
            
            console.groupEnd();
            
            // Salvar no localStorage para referência futura
            try {
                localStorage.setItem('last_performance_report', JSON.stringify(report, null, 2));
                localStorage.setItem('last_performance_report_time', new Date().toISOString());
                console.log('✅ Relatório salvo no localStorage (last_performance_report)');
            } catch (e) {
                console.warn('⚠️ Não foi possível salvar relatório no localStorage');
            }
            
            return report;
        }
    };
    
    // ========== VERIFICAÇÃO PÓS-EXCLUSÃO ==========
    function verifyPostExclusion() {
        console.log('\n' + '='.repeat(60));
        console.log('🔍 VERIFICAÇÃO DO PERFORMANCE SYSTEM PÓS-EXCLUSÃO');
        console.log('='.repeat(60));
        
        // 1. Verificar se os módulos antigos NÃO existem mais
        const oldModules = {
            'benchmark.js': typeof window.BenchmarkSystem !== 'undefined',
            'core-optimizer.js': typeof window.analyzeCoreSystem === 'function',
            'optimizer.js': typeof window.PerformanceCache !== 'undefined'
        };
        
        console.log('\n📦 MÓDULOS ANTIGOS (devem ser FALSE):');
        Object.entries(oldModules).forEach(([module, exists]) => {
            console.log(`   ${module}: ${exists ? '❌ TRUE (AINDA EXISTE!)' : '✅ FALSE (removido)'}`);
        });
        
        // 2. Verificar se o novo módulo existe
        const newModule = {
            'PerformanceSystem': typeof window.PerformanceSystem === 'object',
            'PerformanceSystem.cache': typeof window.PerformanceSystem?.cache === 'object',
            'PerformanceSystem.benchmark': typeof window.PerformanceSystem?.benchmark === 'object',
            'PerformanceSystem.analyzer': typeof window.PerformanceSystem?.analyzer === 'object',
            'PerformanceSystem.reporter': typeof window.PerformanceSystem?.reporter === 'object'
        };
        
        console.log('\n🎯 MÓDULO NOVO (devem ser TRUE):');
        Object.entries(newModule).forEach(([module, exists]) => {
            console.log(`   ${module}: ${exists ? '✅ TRUE' : '❌ FALSE'}`);
        });
        
        // 3. Teste rápido
        console.log('\n⚡ TESTE RÁPIDO:');
        if (window.PerformanceSystem) {
            const test = window.PerformanceSystem.quickTest();
            
            if (test.cache && test.benchmark && test.analyzer && test.reporter) {
                console.log('   ✅ SISTEMA 100% FUNCIONAL');
                console.log('   📊 Todos os componentes estão operacionais');
            } else {
                console.warn('   ⚠️ Sistema com problemas:');
                Object.entries(test).forEach(([component, working]) => {
                    console.log(`      ${component}: ${working ? '✅' : '❌'}`);
                });
            }
        } else {
            console.error('   ❌ PerformanceSystem não encontrado!');
        }
        
        // 4. Resumo final
        console.log('\n📋 RESUMO FINAL:');
        const allOldRemoved = Object.values(oldModules).every(v => v === false);
        const allNewPresent = Object.values(newModule).every(v => v === true);
        
        if (allOldRemoved && allNewPresent) {
            console.log('   ✅ TODAS AS VERIFICAÇÕES PASSARAM!');
            console.log('   🎯 O sistema está pronto para produção');
        } else {
            console.log('   ⚠️ VERIFICAÇÕES COM PROBLEMAS:');
            if (!allOldRemoved) {
                console.log('      - Módulos antigos ainda presentes');
            }
            if (!allNewPresent) {
                console.log('      - Módulo novo incompleto');
            }
        }
        
        console.log('='.repeat(60) + '\n');
    }
    
    // ========== FUNÇÃO DE INICIALIZAÇÃO CORRIGIDA ==========
    function initializeWhenReady() {
        console.log('⏰ Iniciando contador de 1 segundo para inicialização...');
        setTimeout(() => {
            console.log('🚀 Chamando PerformanceSystem.init()...');
            window.PerformanceSystem.init();
            
            // Agendar verificação pós-exclusão após o init
            setTimeout(() => {
                verifyPostExclusion();
            }, 2000);
            
        }, 1000);
    }
    
    // ========== DIAGNÓSTICO INICIAL ==========
    console.log('📊 Performance System pronto!');
    console.log('⏳ Aguarde 3 segundos para o relatório automático...');
    
    // Mostrar diagnóstico do ambiente
    console.log('\n🔧 DIAGNÓSTICO DO AMBIENTE:');
    console.log(`   readyState: ${document.readyState}`);
    console.log(`   isDebugMode: ${CONFIG.isDebugMode}`);
    console.log(`   URL: ${window.location.href}`);
    console.log(`   hostname: ${window.location.hostname}`);
    console.log(`   debug param: ${window.location.search.includes('debug=true')}`);
    
    // ========== INICIALIZAÇÃO AUTOMÁTICA CORRIGIDA ==========
    if (CONFIG.isDebugMode) {
        console.log('🔧 Modo debug detectado, preparando inicialização...');
        
        if (document.readyState === 'loading') {
            console.log('📄 DOM ainda carregando, aguardando DOMContentLoaded...');
            document.addEventListener('DOMContentLoaded', initializeWhenReady);
        } else {
            console.log(`✅ DOM já carregado (${document.readyState}), inicializando agora...`);
            initializeWhenReady();
        }
    } else {
        // Em produção, inicializar com baixa prioridade
        console.log('🌍 Modo produção detectado, inicialização com baixa prioridade...');
        
        const initProduction = () => {
            if ('requestIdleCallback' in window) {
                requestIdleCallback(() => window.PerformanceSystem.init());
            } else {
                setTimeout(() => window.PerformanceSystem.init(), 5000);
            }
        };
        
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initProduction);
        } else {
            initProduction();
        }
    }
    
    // ========== API PÚBLICA ==========
    window.PerformanceSystem = {
        // Cache
        cache: SmartCache,
        
        // Benchmark
        benchmark: BenchmarkSystem,
        
        // Análise
        analyzer: CoreAnalyzer,
        
        // Monitor
        monitor: PerformanceMonitor,
        
        // Relatórios
        reporter: PerformanceReporter,
        
        // Utilitários
        config: CONFIG,
        
        // Inicialização manual
        init() {
            console.log('🚀 Inicializando Performance System...');
            
            // Iniciar medições
            BenchmarkSystem.startMeasurement('performance_system_init');
            
            // Inicializar monitor
            PerformanceMonitor.init();
            
            // Otimizar funções críticas
            const optimizations = CoreAnalyzer.optimizeCriticalFunctions();
            
            // Finalizar medição
            const initTime = BenchmarkSystem.endMeasurement('performance_system_init');
            
            if (initTime) {
                console.log(`⏱️ performance_system_init: ${initTime.duration.toFixed(2)}ms`);
            }
            
            // Gerar relatório automático após 2 segundos
            setTimeout(() => {
                console.log('\n' + '📊 GERANDO RELATÓRIO AUTOMÁTICO...');
                PerformanceReporter.printReportToConsole();
            }, 2000);
            
            console.log(`✅ Performance System inicializado com ${optimizations.length} otimizações`);
            return optimizations;
        },
        
        // Função para testes rápidos
        quickTest() {
            const testResult = {
                cache: false,
                benchmark: false,
                analyzer: false,
                reporter: false
            };
            
            // Teste de cache
            try {
                SmartCache.set('test_key', 'test_value', 1000);
                testResult.cache = SmartCache.get('test_key') === 'test_value';
            } catch (e) {
                console.error('Erro no teste de cache:', e);
            }
            
            // Teste de benchmark
            try {
                testResult.benchmark = !!BenchmarkSystem.metrics && 
                                       typeof BenchmarkSystem.startMeasurement === 'function';
            } catch (e) {
                console.error('Erro no teste de benchmark:', e);
            }
            
            // Teste de analyzer
            try {
                const analysis = CoreAnalyzer.analyze();
                testResult.analyzer = analysis && typeof analysis === 'object' && 
                                     analysis.modules !== undefined;
            } catch (e) {
                console.error('Erro no teste de analyzer:', e);
            }
            
            // Teste de reporter
            try {
                testResult.reporter = typeof PerformanceReporter.printReportToConsole === 'function';
            } catch (e) {
                console.error('Erro no teste de reporter:', e);
            }
            
            return testResult;
        },
        
        // Função para forçar verificação manual
        runVerification() {
            verifyPostExclusion();
        }
    };
})();
