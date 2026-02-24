// weberlessa-support/debug/core/diagnostic-registry.js
console.log('📋 [SUPORTE] Diagnostic Registry carregado - Versão Final com Eventos');

(function() {
    window.DiagnosticRegistry = {
        // Registro central de todas as funções de diagnóstico
        registry: new Map(),
        
        // Categorias de diagnóstico
        categories: {
            ESSENTIAL: 'essential',
            ADMIN: 'admin',
            GALLERY: 'gallery',
            MEDIA: 'media',
            PDF: 'pdf',
            PERFORMANCE: 'performance',
            VALIDATION: 'validation',
            RECOVERY: 'recovery',
            MIGRATION: 'migration'
        },

        // Flag para evitar múltiplos eventos
        _eventDispatched: false,
        _eventTimer: null,

        /**
         * Determina categoria baseada no nome da função
         */
        determineCategory(name) {
            if (name.includes('Admin') || name.includes('admin')) return this.categories.ADMIN;
            if (name.includes('Gallery') || name.includes('gallery')) return this.categories.GALLERY;
            if (name.includes('Media') || name.includes('media')) return this.categories.MEDIA;
            if (name.includes('Pdf') || name.includes('PDF') || name.includes('pdf')) return this.categories.PDF;
            if (name.includes('Performance') || name.includes('performance')) return this.categories.PERFORMANCE;
            if (name.includes('Validate') || name.includes('validate') || name.includes('Validation')) return this.categories.VALIDATION;
            if (name.includes('Recovery') || name.includes('recovery') || name.includes('Emergency')) return this.categories.RECOVERY;
            if (name.includes('Migration') || name.includes('migration') || name.includes('Cleanup')) return this.categories.MIGRATION;
            
            return this.categories.ESSENTIAL;
        },

        /**
         * Determina flags de segurança baseadas no nome da função
         */
        determineSafety(name) {
            const lowerName = name.toLowerCase();
            
            return {
                // Funções seguras para execução automática (apenas leitura/verificação)
                isSafe: !lowerName.includes('test') && 
                       !lowerName.includes('force') && 
                       !lowerName.includes('update') &&
                       !lowerName.includes('delete') &&
                       !lowerName.includes('cleanup') &&
                       !lowerName.includes('remove') &&
                       !lowerName.includes('destroy') &&
                       !lowerName.includes('reset'),
                
                // Funções interativas (exigem ação do usuário)
                isInteractive: lowerName.includes('test') || 
                               lowerName.includes('demo') ||
                               lowerName.includes('prompt') ||
                               lowerName.includes('confirm'),
                
                // Funções destrutivas (modificam dados)
                isDestructive: lowerName.includes('delete') || 
                               lowerName.includes('cleanup') ||
                               lowerName.includes('remove') ||
                               lowerName.includes('destroy') ||
                               lowerName.includes('reset') ||
                               lowerName.includes('force'),
                
                // Funções que exigem confirmação do usuário
                requiresUserAction: lowerName.includes('prompt') || 
                                    lowerName.includes('confirm') ||
                                    lowerName.includes('ask')
            };
        },

        /**
         * Registra uma função de diagnóstico
         */
        register(name, fn, category = null, metadata = {}) {
            if (typeof fn !== 'function') {
                console.warn(`⚠️ [REGISTRY] Tentativa de registrar não-função: ${name}`);
                return false;
            }

            // Evitar duplicação
            if (this.registry.has(name)) {
                console.log(`ℹ️ [REGISTRY] Função ${name} já registrada, ignorando duplicação`);
                return true;
            }

            const determinedCategory = category || this.determineCategory(name);
            const safetyFlags = this.determineSafety(name);

            this.registry.set(name, {
                name,
                fn,
                category: determinedCategory,
                safety: safetyFlags,
                metadata: {
                    registeredAt: new Date().toISOString(),
                    ...metadata
                },
                lastRun: null,
                lastResult: null,
                executionCount: 0
            });

            console.log(`✅ [REGISTRY] Registrado: ${name} (${determinedCategory}) [Seguro: ${safetyFlags.isSafe}]`);
            
            // Disparar evento quando todas as funções forem registradas (após um pequeno delay)
            if (!this._eventDispatched) {
                clearTimeout(this._eventTimer);
                this._eventTimer = setTimeout(() => {
                    this.dispatchReadyEvent();
                }, 500);
            }
            
            return true;
        },

        /**
         * Dispara evento personalizado quando o registry está pronto
         */
        dispatchReadyEvent() {
            if (this._eventDispatched) return;
            
            const event = new CustomEvent('diagnostic-registry-ready', {
                detail: {
                    count: this.registry.size,
                    categories: this.getFunctionsByCategory(),
                    timestamp: new Date().toISOString()
                },
                bubbles: true,
                cancelable: false
            });
            
            window.dispatchEvent(event);
            this._eventDispatched = true;
            
            console.log(`🎯 [REGISTRY] Evento disparado: diagnostic-registry-ready (${this.registry.size} funções)`);
        },

        /**
         * Registra automaticamente TODAS as funções de diagnóstico no escopo window
         * ✅ CORREÇÃO: Ignora objetos como EventManager que não são funções
         */
        autoRegisterFromWindow() {
            console.group('🔍 Auto-registro de funções de diagnóstico');
            
            const diagnosticPatterns = [
                /^diagnose[A-Z]/,      // diagnoseSystem, diagnoseStorage
                /^check[A-Z]/,          // checkGallery, checkPdf
                /^test[A-Z]/,           // testUpload, testNavigation
                /^verify[A-Z]/,         // verifySystem, verifyFunctions
                /^validate[A-Z]/,       // validateProperty, validateMedia
                /^run[A-Z]Check/,       // runSupportChecks
                /^quick[A-Z]/,          // quickDiagnostic
                /^emergency[A-Z]/,      // emergencyRecovery
                /^debug[A-Z]/,          // debugMediaSystem
                /^monitor[A-Z]/,        // monitorPerformance
                /^audit[A-Z]/,          // auditSystem
                /^force[A-Z]/,          // forceUpdate, forceSync (destrutivas!)
                /^delete[A-Z]/,         // deleteProperty (destrutivas!)
                /^cleanup[A-Z]/         // cleanupStorage (destrutivas!)
            ];

            let registeredCount = 0;
            let skippedCount = 0;
            
            Object.keys(window).forEach(key => {
                try {
                    const value = window[key];
                    
                    // ✅ CORREÇÃO: Verificar se é função E ignorar objetos conhecidos
                    // Ignora objetos como EventManager, FilterManager, etc.
                    if (typeof value === 'function' && 
                        !key.includes('Manager') && 
                        !key.includes('System') &&
                        !key.includes('Helper') &&
                        !key.includes('Config')) {
                        
                        const matchesPattern = diagnosticPatterns.some(pattern => 
                            pattern.test(key)
                        );

                        if (matchesPattern) {
                            // Verificar se já está registrada
                            if (!this.registry.has(key)) {
                                this.register(key, value);
                                registeredCount++;
                            } else {
                                skippedCount++;
                            }
                        }
                    }
                } catch (e) {
                    // Ignorar propriedades problemáticas
                }
            });

            console.log(`✅ Auto-registro concluído: ${registeredCount} novas funções (${skippedCount} já existentes)`);
            console.groupEnd();
            return registeredCount;
        },

        /**
         * Lista todas as funções registradas, com opção de filtro por categoria
         */
        list(options = {}) {
            const { category, safety, detailed = false } = options;
            
            console.group('📋 FUNÇÕES DE DIAGNÓSTICO REGISTRADAS');
            
            let filteredFunctions = Array.from(this.registry.values());
            
            if (category) {
                filteredFunctions = filteredFunctions.filter(f => f.category === category);
                console.log(`🎯 Filtrando por categoria: ${category}`);
            }
            
            if (safety !== undefined) {
                filteredFunctions = filteredFunctions.filter(f => f.safety.isSafe === safety);
                console.log(`🎯 Filtrando por segurança: ${safety ? 'Seguras' : 'Não seguras'}`);
            }
            
            // Agrupar por categoria
            const byCategory = {};
            
            filteredFunctions.forEach(fn => {
                if (!byCategory[fn.category]) {
                    byCategory[fn.category] = [];
                }
                byCategory[fn.category].push({
                    name: fn.name,
                    safe: fn.safety.isSafe ? '✅' : '⚠️',
                    destructive: fn.safety.isDestructive ? '💀' : '🔒',
                    runs: fn.executionCount
                });
            });

            Object.keys(byCategory).sort().forEach(category => {
                console.log(`\n📁 ${category.toUpperCase()}:`);
                byCategory[category].sort((a, b) => a.name.localeCompare(b.name)).forEach(item => {
                    console.log(`  ${item.safe} ${item.destructive} ${item.name} (${item.runs}x)`);
                });
            });

            console.log(`\n✅ Total: ${filteredFunctions.length}/${this.registry.size} funções`);
            
            if (detailed) {
                console.log('\n🔍 DETALHES DE SEGURANÇA:');
                console.log('  ✅ = Segura para execução automática');
                console.log('  ⚠️ = Requer cuidado (pode ser interativa)');
                console.log('  💀 = Destrutiva (NÃO executar automaticamente)');
                console.log('  🔒 = Não destrutiva');
            }
            
            console.groupEnd();
            
            return filteredFunctions;
        },

        /**
         * Executa apenas funções SEGURAS (não destrutivas)
         */
        async runSafeDiagnostics() {
            console.group('🛡️ EXECUTANDO DIAGNÓSTICOS SEGUROS');
            
            const safeFunctions = Array.from(this.registry.values())
                .filter(f => f.safety.isSafe && !f.safety.isDestructive);
            
            console.log(`📊 ${safeFunctions.length} funções seguras encontradas`);
            
            const results = {
                total: safeFunctions.length,
                executed: 0,
                succeeded: 0,
                failed: 0,
                details: []
            };

            for (const fn of safeFunctions) {
                try {
                    console.log(`⚙️ Executando: ${fn.name}`);
                    
                    const startTime = performance.now();
                    const result = await Promise.resolve(fn.fn());
                    const endTime = performance.now();

                    results.executed++;
                    results.succeeded++;
                    results.details.push({
                        name: fn.name,
                        success: true,
                        duration: endTime - startTime
                    });

                    fn.lastRun = new Date().toISOString();
                    fn.lastResult = result;
                    fn.executionCount++;

                    console.log(`✅ ${fn.name} concluído em ${(endTime - startTime).toFixed(2)}ms`);

                } catch (error) {
                    console.error(`❌ ${fn.name} falhou:`, error.message);
                    results.failed++;
                    results.details.push({
                        name: fn.name,
                        success: false,
                        error: error.message
                    });
                }
            }

            console.log(`\n📊 RESULTADOS: ${results.succeeded}/${results.total} sucessos`);
            console.groupEnd();
            
            return results;
        },

        /**
         * Retorna lista de funções por categoria (para uso no simple-checker.js)
         */
        getFunctionsByCategory() {
            const result = {};
            
            this.registry.forEach(fn => {
                if (!result[fn.category]) {
                    result[fn.category] = {
                        total: 0,
                        safe: 0,
                        destructive: 0,
                        names: []
                    };
                }
                
                result[fn.category].total++;
                if (fn.safety.isSafe) result[fn.category].safe++;
                if (fn.safety.isDestructive) result[fn.category].destructive++;
                result[fn.category].names.push(fn.name);
            });
            
            return result;
        },

        /**
         * Aguarda o registry estar pronto (Promise)
         */
        waitForReady(timeout = 5000) {
            return new Promise((resolve, reject) => {
                if (this._eventDispatched) {
                    resolve(this.getFunctionsByCategory());
                    return;
                }
                
                const timeoutId = setTimeout(() => {
                    window.removeEventListener('diagnostic-registry-ready', handler);
                    reject(new Error(`Timeout aguardando registry (${timeout}ms)`));
                }, timeout);
                
                const handler = (event) => {
                    clearTimeout(timeoutId);
                    window.removeEventListener('diagnostic-registry-ready', handler);
                    resolve(event.detail);
                };
                
                window.addEventListener('diagnostic-registry-ready', handler);
            });
        },

        /**
         * Limpa o registro (útil para testes)
         */
        clear() {
            this.registry.clear();
            this._eventDispatched = false;
            if (this._eventTimer) {
                clearTimeout(this._eventTimer);
                this._eventTimer = null;
            }
            console.log('🧹 Registro de diagnóstico limpo');
        }
    };

    // ✅ Auto-registro em modo debug (timer reduzido para resposta rápida)
    if (window.location.search.includes('debug=true') || 
        window.location.search.includes('test=true') ||
        window.location.hostname.includes('localhost')) {
        
        setTimeout(() => {
            window.DiagnosticRegistry.autoRegisterFromWindow();
        }, 500); // Timer reduzido para 500ms
    }

    console.log('✅ DiagnosticRegistry inicializado - Versão Final com Eventos');
})();
