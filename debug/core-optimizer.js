// weberlessa-support/debug/core-optimizer.js
// MÓDULO 13/11: Otimizações específicas do Core System

(function() {
    'use strict';
    
    console.log('⚡ [SUPORTE] core-optimizer.js carregado');
    
    const isDebugMode = 
        window.location.search.includes('debug=true') ||
        window.location.hostname.includes('localhost');
    
    // ========== ANÁLISE DO CORE SYSTEM ==========
    window.analyzeCoreSystem = function() {
        const analysis = {
            timestamp: new Date().toISOString(),
            modules: {},
            functions: {},
            variables: {},
            recommendations: []
        };
        
        // Analisar módulos carregados
        const scripts = Array.from(document.querySelectorAll('script[src]'));
        analysis.modules.loaded = scripts.length;
        analysis.modules.core = scripts.filter(s => s.src.includes('/js/modules/')).length;
        analysis.modules.external = scripts.filter(s => !s.src.includes('github.io')).length;
        
        // Analisar funções globais
        const globalFuncs = Object.keys(window).filter(key => 
            typeof window[key] === 'function' && 
            !key.startsWith('_') &&
            key !== 'analyzeCoreSystem'
        );
        
        analysis.functions.total = globalFuncs.length;
        analysis.functions.essential = globalFuncs.filter(f => 
            ['initializeProperties', 'renderProperties', 'addNewProperty', 
             'updateProperty', 'deleteProperty', 'openGallery', 'closeGallery',
             'toggleAdminPanel', 'showPdfModal'].includes(f)
        ).length;
        
        // Analisar variáveis globais
        const globalVars = Object.keys(window).filter(key => 
            typeof window[key] !== 'function' && 
            !key.startsWith('_') &&
            ['properties', 'supabaseClient', 'SUPABASE_URL', 'SUPABASE_KEY',
             'ADMIN_PASSWORD', 'PDF_PASSWORD'].includes(key)
        );
        
        analysis.variables.essential = globalVars.length;
        
        // Gerar recomendações
        if (analysis.functions.total > 50) {
            analysis.recommendations.push({
                priority: 'MEDIUM',
                message: 'Muitas funções globais (' + analysis.functions.total + '). Considere modularizar.',
                action: 'Mover funções de debug/validação para repositório de suporte'
            });
        }
        
        if (analysis.modules.core > 15) {
            analysis.recommendations.push({
                priority: 'LOW',
                message: 'Muitos módulos core (' + analysis.modules.core + ').',
                action: 'Avaliar fusão de módulos relacionados'
            });
        }
        
        return analysis;
    };
    
    // ========== OTIMIZAÇÃO DE FUNÇÕES CRÍTICAS ==========
    window.optimizeCriticalFunctions = function() {
        const optimizations = [];
        
        // Otimizar renderProperties se existir
        if (typeof window.renderProperties === 'function') {
            const originalRender = window.renderProperties;
            let lastRenderTime = 0;
            const RENDER_DEBOUNCE = 100; // 100ms
            
            window.renderProperties = function(filter = 'todos') {
                const now = Date.now();
                
                // Debouncing para evitar múltiplas renderizações
                if (now - lastRenderTime < RENDER_DEBOUNCE) {
                    if (isDebugMode) {
                        console.log('⚡ [OTIMIZAÇÃO] Debouncing renderProperties');
                    }
                    return;
                }
                
                lastRenderTime = now;
                
                if (isDebugMode) {
                    console.time('renderProperties');
                }
                
                const result = originalRender.apply(this, arguments);
                
                if (isDebugMode) {
                    console.timeEnd('renderProperties');
                }
                
                return result;
            };
            
            optimizations.push('renderProperties debounced (100ms)');
        }
        
        // Otimizar função de filtro
        if (typeof window.setupFilters === 'function') {
            const filters = document.querySelectorAll('.filter-btn');
            if (filters.length > 0) {
                // Usar event delegation
                document.addEventListener('click', function(e) {
                    if (e.target.classList.contains('filter-btn')) {
                        e.preventDefault();
                        e.stopPropagation();
                        
                        // Remover active de todos
                        filters.forEach(btn => btn.classList.remove('active'));
                        
                        // Adicionar ao clicado
                        e.target.classList.add('active');
                        
                        // Executar filtro
                        const filter = e.target.textContent.trim() === 'Todos' ? 'todos' : e.target.textContent.trim();
                        if (window.renderProperties) {
                            window.renderProperties(filter);
                        }
                    }
                }, { once: true });
                
                optimizations.push('filters optimized with event delegation');
            }
        }
        
        return optimizations;
    };
    
    // ========== MONITORAMENTO DE PERFORMANCE ==========
    window.setupPerformanceMonitor = function() {
        if (!isDebugMode) return;
        
        const metrics = {
            loadTimes: [],
            functionCalls: {},
            memoryUsage: [],
            errors: []
        };
        
        // Monitorar tempos de carregamento
        window.addEventListener('load', function() {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            metrics.loadTimes.push(loadTime);
            
            console.log('📈 Performance: Carregamento completo em ' + loadTime + 'ms');
            
            if (loadTime > 3000) {
                console.warn('⚠️  Tempo de carregamento alto: ' + loadTime + 'ms');
                console.log('💡 Sugestões:');
                console.log('  1. Otimizar imagens');
                console.log('  2. Minimizar JavaScript');
                console.log('  3. Usar cache mais agressivo');
            }
        });
        
        // Monitorar uso de memória (se disponível)
        if (performance.memory) {
            setInterval(() => {
                const usedMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
                metrics.memoryUsage.push(usedMB);
                
                if (usedMB > 100) {
                    console.warn('⚠️  Alto uso de memória: ' + usedMB + 'MB');
                }
            }, 30000); // A cada 30 segundos
        }
        
        return metrics;
    };
    
    // ========== EXECUÇÃO AUTOMÁTICA EM DEBUG ==========
    if (isDebugMode) {
        // Aguardar 2 segundos após carregamento
        setTimeout(() => {
            console.group('⚡ OTIMIZAÇÃO DO CORE SYSTEM');
            
            // 1. Análise
            const analysis = window.analyzeCoreSystem();
            console.log('📊 Análise do Core System:', analysis);
            
            // 2. Otimizações
            const optimizations = window.optimizeCriticalFunctions();
            console.log('🔧 Otimizações aplicadas:', optimizations);
            
            // 3. Monitoramento
            const monitor = window.setupPerformanceMonitor();
            console.log('📈 Monitoramento ativo');
            
            console.groupEnd();
            
            // Mostrar resumo
            setTimeout(() => {
                console.log('🎯 RESUMO DA OTIMIZAÇÃO:');
                console.log('- ' + analysis.functions.total + ' funções globais analisadas');
                console.log('- ' + optimizations.length + ' otimizações aplicadas');
                console.log('- Monitoramento de performance ativo');
            }, 1000);
        }, 2000);
    }
})();
