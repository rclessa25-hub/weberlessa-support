// weberlessa-support/debug/events/event-manager.js
console.log('🔧 [SUPPORT] event-manager.js carregado');

(function() {
    'use strict';
    
    /**
     * Gerenciador de eventos com debounce e rastreamento
     * Útil para debugging e otimização
     */
    window.EventManager = {
        listeners: new Map(),
        
        /**
         * Registra um listener com debounce automático
         */
        on(element, event, handler, options = {}) {
            const key = `${event}_${Math.random().toString(36).substr(2, 9)}`;
            
            // Aplicar debounce se especificado
            let finalHandler = handler;
            if (options.debounce && options.debounce > 0) {
                finalHandler = this.debounce(handler, options.debounce);
            }
            
            // Registrar listener
            element.addEventListener(event, finalHandler, options);
            
            // Armazenar para possível remoção
            this.listeners.set(key, { element, event, handler: finalHandler });
            
            if (window.location.search.includes('debug=true')) {
                console.log(`📋 [EventManager] Listener registrado: ${event} (${key})`);
            }
            
            return key;
        },
        
        /**
         * Remove um listener específico
         */
        off(key) {
            const listener = this.listeners.get(key);
            if (listener) {
                listener.element.removeEventListener(
                    listener.event, 
                    listener.handler
                );
                this.listeners.delete(key);
                
                if (window.location.search.includes('debug=true')) {
                    console.log(`🗑️ [EventManager] Listener removido: ${key}`);
                }
            }
        },
        
        /**
         * Função de debounce para otimização
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },
        
        /**
         * Remove todos os listeners
         */
        cleanup() {
            const count = this.listeners.size;
            this.listeners.forEach((listener, key) => {
                this.off(key);
            });
            this.listeners.clear();
            
            if (window.location.search.includes('debug=true')) {
                console.log(`🧹 [EventManager] ${count} listeners removidos`);
            }
        },
        
        /**
         * Lista todos os listeners ativos
         */
        list() {
            console.group('📋 [EventManager] Listeners ativos');
            this.listeners.forEach((listener, key) => {
                console.log(`  - ${key}: ${listener.event} em`, listener.element);
            });
            console.log(`  Total: ${this.listeners.size} listeners`);
            console.groupEnd();
            
            return Array.from(this.listeners.entries());
        }
    };
    
    // Registrar no DiagnosticRegistry
    setTimeout(() => {
        if (window.DiagnosticRegistry && window.EventManager) {
            window.DiagnosticRegistry.register('EventManager', window.EventManager, 'essential', {
                description: 'Gerenciador de eventos com debounce',
                isObject: true
            });
        }
    }, 1000);
    
    console.log('✅ event-manager.js carregado - EventManager disponível');
})();
