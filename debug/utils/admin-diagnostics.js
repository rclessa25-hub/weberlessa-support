// debug/utils/admin-diagnostics.js
// Módulo de diagnóstico e suporte para o painel administrativo
console.log('🔧 [SUPPORT] admin-diagnostics.js carregado');

(function() {
    // =========================================================================
    // 1. HELPERS DE UI NÃO CRÍTICOS (MIGRADO DO ADMIN.JS)
    // =========================================================================
    window.AdminHelpers = {
        /**
         * Mostra notificação toast na tela
         */
        showNotification: function(message, type = 'success', duration = 3000) {
            // Remover notificações existentes
            const existing = document.querySelectorAll('.admin-notification');
            existing.forEach(n => n.remove());
            
            const notification = document.createElement('div');
            notification.className = `admin-notification ${type}`;
            notification.innerHTML = `
                <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'}"></i>
                <span>${message}</span>
            `;
            
            notification.style.cssText = `
                position: fixed; top: 20px; right: 20px;
                background: ${type === 'error' ? '#e74c3c' : '#27ae60'};
                color: white; padding: 12px 18px; border-radius: 8px;
                z-index: 10000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex; align-items: center; gap: 10px;
                animation: slideInRight 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            setTimeout(() => notification.remove(), duration);
        },

        /**
         * Fecha modal de propriedade
         */
        closeModal: function() {
            const modal = document.getElementById('propertyModal');
            if (modal) {
                modal.style.display = 'none';
                modal.classList.remove('show');
                document.body.classList.remove('modal-open');
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) backdrop.remove();
            }
        },

        /**
         * Helper para configuração de uploads
         */
        setupUpload: function(inputId, areaId, callback) {
            const input = document.getElementById(inputId);
            const area = document.getElementById(areaId);
            if (!input || !area) return false;
            
            const cleanInput = input.cloneNode(true);
            const cleanArea = area.cloneNode(true);
            input.parentNode.replaceChild(cleanInput, input);
            area.parentNode.replaceChild(cleanArea, area);
            
            const freshInput = document.getElementById(inputId);
            const freshArea = document.getElementById(areaId);
            
            freshArea.addEventListener('click', (e) => {
                e.preventDefault();
                freshInput.click();
            });
            
            freshInput.addEventListener('change', (e) => {
                if (e.target.files.length) {
                    callback(e.target.files);
                    e.target.value = '';
                }
            });
            
            return true;
        }
    };

    // =========================================================================
    // 2. BOTÃO DE EMERGÊNCIA (MIGRADO DO ADMIN.JS)
    // =========================================================================
    window.createEmergencyButton = function() {
        // Só criar se não existir e estiver em modo debug
        if (!window.location.search.includes('debug=true')) return null;
        
        if (document.getElementById('emergency-admin-btn')) {
            return document.getElementById('emergency-admin-btn');
        }
        
        const emergencyBtn = document.createElement('button');
        emergencyBtn.id = 'emergency-admin-btn';
        emergencyBtn.innerHTML = '🔧 ADMIN (EMERGÊNCIA)';
        emergencyBtn.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 99999;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.3);
            transition: all 0.3s ease;
        `;
        
        emergencyBtn.onmouseover = function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 6px 16px rgba(231, 76, 60, 0.4)';
        };
        
        emergencyBtn.onmouseout = function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 12px rgba(231, 76, 60, 0.3)';
        };
        
        emergencyBtn.onclick = function() {
            const password = prompt("🔒 Acesso de Emergência\n\nDigite a senha:");
            if (password === "wl654") {
                const panel = document.getElementById('adminPanel');
                if (panel) {
                    panel.style.display = 'block';
                    panel.scrollIntoView({ behavior: 'smooth' });
                    if (typeof window.loadPropertyList === 'function') {
                        window.loadPropertyList();
                    }
                    AdminHelpers.showNotification('✅ Painel admin aberto', 'success', 2000);
                }
            } else if (password !== null) {
                AdminHelpers.showNotification('❌ Senha incorreta!', 'error', 2000);
            }
        };
        
        document.body.appendChild(emergencyBtn);
        console.log('🆘 [SUPORTE] Botão de emergência criado');
        return emergencyBtn;
    };

    // =========================================================================
    // 3. DIAGNÓSTICO DO LOCALSTORAGE PARA ADMIN
    // =========================================================================
    window.diagnoseAdminStorage = function() {
        console.group('🔍 [SUPORTE] DIAGNÓSTICO DO ADMIN STORAGE');
        
        try {
            const stored = JSON.parse(localStorage.getItem('properties') || '[]');
            const inMemory = window.properties || [];
            
            console.log('📊 localStorage (properties):', stored.length, 'imóveis');
            console.log('📊 window.properties:', inMemory.length, 'imóveis');
            
            if (stored.length !== inMemory.length) {
                console.warn('⚠️ INCONSISTÊNCIA DETECTADA!');
                console.log('Diferença:', Math.abs(stored.length - inMemory.length), 'imóveis');
                
                if (stored.length > inMemory.length) {
                    console.log('💡 Solução: execute window.properties = JSON.parse(localStorage.getItem("properties"))');
                } else {
                    console.log('💡 Solução: execute localStorage.setItem("properties", JSON.stringify(window.properties))');
                }
            } else {
                console.log('✅ Sistema sincronizado!');
            }
            
            // Verificar chaves antigas
            const oldKeys = Object.keys(localStorage).filter(k => 
                k.includes('weberlessa') || k.includes('backup')
            );
            
            if (oldKeys.length > 0) {
                console.log('🗑️ Chaves antigas encontradas:', oldKeys);
                console.log('💡 Para limpar: oldKeys.forEach(k => localStorage.removeItem(k))');
            }
            
        } catch (error) {
            console.error('❌ Erro no diagnóstico:', error);
        }
        
        console.groupEnd();
    };

    // =========================================================================
    // 4. TESTE DO FORMULÁRIO ADMIN
    // =========================================================================
    window.testAdminForm = function() {
        console.group('🧪 [SUPORTE] TESTE DO FORMULÁRIO ADMIN');
        
        const form = document.getElementById('propertyForm');
        const fields = {
            'propTitle': document.getElementById('propTitle'),
            'propPrice': document.getElementById('propPrice'),
            'propLocation': document.getElementById('propLocation'),
            'propDescription': document.getElementById('propDescription'),
            'propFeatures': document.getElementById('propFeatures'),
            'propType': document.getElementById('propType'),
            'propBadge': document.getElementById('propBadge'),
            'propHasVideo': document.getElementById('propHasVideo')
        };
        
        console.log('📋 CAMPOS DO FORMULÁRIO:');
        Object.entries(fields).forEach(([nome, campo]) => {
            const status = campo ? '✅' : '❌';
            console.log(`  - ${nome}: ${status}`);
            if (campo) {
                console.log(`      Tipo: ${campo.type}, Valor: ${campo.type === 'checkbox' ? campo.checked : campo.value}`);
            }
        });
        
        const submitBtn = form?.querySelector('button[type="submit"]');
        console.log(`\n🔘 Botão submit: ${submitBtn ? '✅' : '❌'}`);
        
        const cancelBtn = document.getElementById('cancelEditBtn');
        console.log(`🔘 Botão cancelar: ${cancelBtn ? '✅' : '❌'}`);
        
        const allFieldsOk = Object.values(fields).every(f => f !== null);
        
        if (allFieldsOk && submitBtn && cancelBtn) {
            console.log('\n✅✅✅ FORMULÁRIO ADMIN OPERACIONAL!');
        } else {
            console.log('\n⚠️⚠️⚠️ FORMULÁRIO ADMIN COM PROBLEMAS!');
        }
        
        console.groupEnd();
        
        return { fields, formOk: allFieldsOk && submitBtn && cancelBtn };
    };

    // =========================================================================
    // 5. MONITORAMENTO DE AÇÕES DO ADMIN
    // =========================================================================
    if (window.location.search.includes('debug=true')) {
        // Interceptar cliques no botão admin
        setTimeout(() => {
            const adminBtn = document.querySelector('.admin-toggle');
            if (adminBtn) {
                const originalOnClick = adminBtn.onclick;
                adminBtn.addEventListener('click', function() {
                    console.log('🖱️ [SUPORTE] Botão admin clicado');
                    console.log('📊 Estado do formulário:', 
                        document.getElementById('editingPropertyId')?.value || 'nenhum');
                });
            }
        }, 2000);
        
        // Monitorar salvamentos
        const originalSave = window.saveProperty;
        if (originalSave) {
            window.saveProperty = async function() {
                console.log('💾 [SUPORTE] Salvando imóvel...');
                console.time('⏱️ Tempo de salvamento');
                try {
                    const result = await originalSave.apply(this, arguments);
                    console.timeEnd('⏱️ Tempo de salvamento');
                    console.log('✅ Salvamento concluído:', result);
                    return result;
                } catch (error) {
                    console.timeEnd('⏱️ Tempo de salvamento');
                    console.error('❌ Erro no salvamento:', error);
                    throw error;
                }
            };
        }
    }

    // =========================================================================
    // 6. INICIALIZAÇÃO AUTOMÁTICA E COMANDOS DE VERIFICAÇÃO PÓS-MIGRAÇÃO
    // =========================================================================
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => {
            console.log('🔄 [SUPORTE] Inicializando diagnósticos do admin...');
            
            // Criar botão de emergência
            window.createEmergencyButton();
            
            // Verificar storage após 3 segundos
            setTimeout(() => {
                if (typeof window.diagnoseAdminStorage === 'function') {
                    window.diagnoseAdminStorage();
                }
            }, 3000);
            
            // Comandos disponíveis para teste no console
            console.log('\n📌 COMANDOS DE VERIFICAÇÃO PÓS-MIGRAÇÃO:');
            console.log('  ✅ Já disponíveis globalmente:');
            console.log('  - AdminHelpers.showNotification(\'Teste\', \'success\')');
            console.log('  - AdminHelpers.closeModal()');
            console.log('  - diagnoseAdminStorage()');
            console.log('  - testAdminForm()');
            console.log('  - createEmergencyButton()');
            
            console.log('\n🔧 TESTE RÁPIDO - Copie e cole no console (F12):');
            console.log('  // Testar helpers');
            console.log('  AdminHelpers.showNotification(\'Teste\', \'success\');');
            console.log('  AdminHelpers.closeModal();');
            console.log('  ');
            console.log('  // Diagnóstico');
            console.log('  diagnoseAdminStorage();');
            console.log('  testAdminForm();');
            console.log('  ');
            console.log('  // Botão de emergência');
            console.log('  createEmergencyButton();');
            
            console.log('\n⚠️ Se algum comando não funcionar, recarregue a página com ?debug=true');
            
        }, 1000);
    }

})();
