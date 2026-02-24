// weberlessa-support/debug/filters/filter-fallbacks.js
console.log('🔧 [SUPPORT] filter-fallbacks.js carregado');

(function() {
    'use strict';
    
    /**
     * Configura fallback manual para os filtros
     * Útil quando o FilterManager principal falha
     */
    window.setupManualFilterFallback = function() {
        console.warn('⚠️ [SUPPORT] Usando fallback manual de filtros...');
        
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        if (!filterButtons || filterButtons.length === 0) {
            console.error('❌ [SUPPORT] Botões de filtro não encontrados!');
            return false;
        }
        
        filterButtons.forEach(button => {
            // Clonar para remover listeners antigos
            const newBtn = button.cloneNode(true);
            button.parentNode.replaceChild(newBtn, button);
            
            newBtn.addEventListener('click', function() {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                const filterText = this.textContent.trim();
                const filterValue = filterText === 'Todos' ? 'todos' : filterText;
                
                window.currentFilter = filterValue;
                if (window.renderProperties) window.renderProperties(filterValue);
            });
        });
        
        const todosBtn = Array.from(filterButtons).find(btn => 
            btn.textContent.trim() === 'Todos'
        );
        
        if (todosBtn) todosBtn.classList.add('active');
        
        console.log('✅ [SUPPORT] Fallback de filtros configurado');
        return true;
    };
    
    // Registrar no DiagnosticRegistry
    setTimeout(() => {
        if (window.DiagnosticRegistry && typeof window.setupManualFilterFallback === 'function') {
            window.DiagnosticRegistry.register('setupManualFilterFallback', window.setupManualFilterFallback, 'essential', {
                description: 'Fallback manual para filtros (quando FilterManager falha)',
                isDestructive: false,
                isSafe: true
            });
        }
    }, 1000);
    
    console.log('✅ filter-fallbacks.js carregado - função setupManualFilterFallback disponível');
})();
