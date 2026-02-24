// weberlessa-support/debug/utils/admin-diagnostics.js
// Módulo de diagnóstico e suporte para o painel administrativo
console.log('🔧 [SUPPORT] admin-diagnostics.js carregado (versão estendida)');

(function() {
    'use strict';
    
    // ======================================================================
    // 1. HELPERS DE NOTIFICAÇÃO (MIGRADO DO ADMIN.JS)
    // ======================================================================
    
    /**
     * Sistema de notificações visuais para o admin
     * @param {string} message - Mensagem a ser exibida
     * @param {string} type - Tipo: 'success', 'error', 'info', 'warning'
     * @param {number} duration - Duração em ms (padrão: 3000)
     */
    window.showAdminNotification = function(message, type = 'info', duration = 3000) {
        console.log(`🔔 [ADMIN] ${type.toUpperCase()}: ${message}`);
        
        // Verificar se já existe um container de notificações
        let container = document.getElementById('admin-notification-container');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'admin-notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
                max-width: 350px;
            `;
            document.body.appendChild(container);
        }
        
        // Criar notificação
        const notification = document.createElement('div');
        notification.className = `admin-notification admin-notification-${type}`;
        
        // Cores baseadas no tipo
        const colors = {
            success: { bg: '#d4edda', text: '#155724', border: '#c3e6cb', icon: '✅' },
            error: { bg: '#f8d7da', text: '#721c24', border: '#f5c6cb', icon: '❌' },
            info: { bg: '#d1ecf1', text: '#0c5460', border: '#bee5eb', icon: 'ℹ️' },
            warning: { bg: '#fff3cd', text: '#856404', border: '#ffeeba', icon: '⚠️' }
        };
        
        const color = colors[type] || colors.info;
        
        notification.style.cssText = `
            background: ${color.bg};
            color: ${color.text};
            border: 1px solid ${color.border};
            border-radius: 5px;
            padding: 12px 15px;
            margin: 0;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            display: flex;
            align-items: center;
            gap: 10px;
            animation: slideIn 0.3s ease;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
        
        notification.innerHTML = `
            <span style="font-size: 1.2rem;">${color.icon}</span>
            <span style="flex: 1;">${message}</span>
            <span style="font-size: 0.8rem; opacity: 0.7;">✕</span>
        `;
        
        // Adicionar ao container
        container.appendChild(notification);
        
        // Remover após duration
        const timeout = setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                    // Remover container se vazio
                    if (container.children.length === 0) {
                        container.remove();
                    }
                }, 300);
            }
        }, duration);
        
        // Clicar para fechar
        notification.addEventListener('click', () => {
            clearTimeout(timeout);
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
                if (container.children.length === 0) {
                    container.remove();
                }
            }, 300);
        });
        
        return notification;
    };
    
    // Adicionar estilos de animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
    // ======================================================================
    // 2. CONFIGURADOR DE UPLOAD (MIGRADO DO ADMIN.JS)
    // ======================================================================
    
    /**
     * Configura área de upload com drag & drop
     * @param {string} inputId - ID do input file
     * @param {string} areaId - ID da área de upload
     * @param {Function} onFilesSelected - Callback quando arquivos são selecionados
     */
    window.setupUploadArea = function(inputId, areaId, onFilesSelected) {
        console.log(`📁 [ADMIN] Configurando área de upload: ${areaId}`);
        
        const fileInput = document.getElementById(inputId);
        const uploadArea = document.getElementById(areaId);
        
        if (!fileInput || !uploadArea) {
            console.warn(`⚠️ [ADMIN] Elementos não encontrados: ${inputId}, ${areaId}`);
            return false;
        }
        
        // Clique na área abre o seletor de arquivos
        uploadArea.addEventListener('click', () => fileInput.click());
        
        // Drag & drop
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#3498db';
            uploadArea.style.background = '#e8f4fc';
        });
        
        uploadArea.addEventListener('dragleave', () => {
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '#fafafa';
        });
        
        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.style.borderColor = '#ddd';
            uploadArea.style.background = '#fafafa';
            
            if (e.dataTransfer.files.length > 0 && onFilesSelected) {
                onFilesSelected(e.dataTransfer.files);
            }
        });
        
        // Mudança no input
        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0 && onFilesSelected) {
                onFilesSelected(e.target.files);
                e.target.value = ''; // Resetar input
            }
        });
        
        console.log(`✅ [ADMIN] Área de upload configurada: ${areaId}`);
        return true;
    };
    
    // ======================================================================
    // 3. FALLBACK LOCAL PARA SALVAMENTO (MIGRADO DO ADMIN.JS)
    // ======================================================================
    
    /**
     * Salva imóvel localmente como fallback quando Supabase está offline
     * @param {Object} propertyData - Dados do imóvel
     * @returns {Promise<Object>} Resultado da operação
     */
    window.savePropertyLocalFallback = async function(propertyData) {
        console.log('💾 [ADMIN] Salvando localmente como fallback...');
        
        try {
            if (!window.properties) {
                window.properties = [];
            }
            
            if (!propertyData.id) {
                const maxId = window.properties.length > 0 ? 
                    Math.max(...window.properties.map(p => parseInt(p.id) || 0)) : 0;
                propertyData.id = maxId + 1;
            }
            
            window.properties.push(propertyData);
            console.log(`✅ [ADMIN] Adicionado localmente: ID ${propertyData.id}, total: ${window.properties.length}`);
            
            try {
                localStorage.setItem('properties', JSON.stringify(window.properties));
                console.log('✅ [ADMIN] Salvo no localStorage (chave unificada)');
            } catch (storageError) {
                console.error('❌ [ADMIN] Erro no localStorage:', storageError);
            }
            
            setTimeout(() => {
                if (typeof window.loadPropertyList === 'function') {
                    window.loadPropertyList();
                }
            }, 300);
            
            return {
                success: true,
                id: propertyData.id,
                localProperties: window.properties.length
            };
            
        } catch (error) {
            console.error('❌ [ADMIN] Erro no salvamento local:', error);
            return {
                success: false,
                error: error.message
            };
        }
    };
    
    // ======================================================================
    // 4. DIAGNÓSTICO DO ADMIN
    // ======================================================================
    
    /**
     * Diagnóstico completo do sistema admin
     */
    window.diagnoseAdminSystem = function() {
        console.group('🔍 [ADMIN] DIAGNÓSTICO DO SISTEMA ADMIN');
        
        const results = {
            'Elementos DOM': {
                'adminPanel': !!document.getElementById('adminPanel'),
                'propertyForm': !!document.getElementById('propertyForm'),
                'adminToggle': !!document.querySelector('.admin-toggle'),
                'cancelEditBtn': !!document.getElementById('cancelEditBtn'),
                'uploadArea': !!document.getElementById('uploadArea'),
                'pdfUploadArea': !!document.getElementById('pdfUploadArea')
            },
            'Funções essenciais': {
                'toggleAdminPanel': typeof window.toggleAdminPanel === 'function',
                'editProperty': typeof window.editProperty === 'function',
                'saveProperty': typeof window.saveProperty === 'function',
                'cancelEdit': typeof window.cancelEdit === 'function',
                'resetAdminFormCompletely': typeof window.resetAdminFormCompletely === 'function',
                'loadPropertyList': typeof window.loadPropertyList === 'function'
            },
            'Funções migradas (Support)': {
                'showAdminNotification': typeof window.showAdminNotification === 'function',
                'setupUploadArea': typeof window.setupUploadArea === 'function',
                'savePropertyLocalFallback': typeof window.savePropertyLocalFallback === 'function'
            },
            'Estado': {
                'editingPropertyId': window.editingPropertyId,
                'properties length': window.properties?.length || 0
            }
        };
        
        console.log('📊 RESULTADOS:');
        console.log('📍 Elementos DOM:', results['Elementos DOM']);
        console.log('⚙️ Funções essenciais:', results['Funções essenciais']);
        console.log('📦 Funções migradas:', results['Funções migradas (Support)']);
        
        const allEssentialOk = Object.values(results['Funções essenciais']).every(v => v === true);
        const allElementsOk = Object.values(results['Elementos DOM']).every(v => v === true);
        
        if (allEssentialOk && allElementsOk) {
            console.log('\n✅✅✅ SISTEMA ADMIN OPERACIONAL!');
            
            if (!allElementsOk) {
                console.log('⚠️ Alguns elementos DOM estão faltando');
            }
        } else {
            console.log('\n⚠️⚠️⚠️ SISTEMA ADMIN COM PROBLEMAS!');
            
            if (!allEssentialOk) {
                console.log('❌ Funções essenciais faltando');
            }
            if (!allElementsOk) {
                console.log('❌ Elementos DOM faltando');
            }
        }
        
        console.groupEnd();
        return results;
    };
    
    // ======================================================================
    // 5. TESTE DO FORMULÁRIO ADMIN
    // ======================================================================
    
    /**
     * Testa o formulário admin preenchendo com dados de exemplo
     */
    window.testAdminForm = function() {
        console.log('🧪 [ADMIN] Testando formulário admin...');
        
        const fields = {
            'propTitle': 'Imóvel de Teste',
            'propPrice': 'R$ 450.000',
            'propLocation': 'Ponta Verde, Maceió',
            'propDescription': 'Este é um imóvel de teste gerado automaticamente',
            'propFeatures': '3 Quartos, 2 Banheiros, Vaga, Piscina',
            'propType': 'residencial',
            'propBadge': 'Destaque'
        };
        
        Object.entries(fields).forEach(([id, value]) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
                console.log(`✅ Preenchido: ${id} = ${value}`);
            } else {
                console.warn(`⚠️ Campo não encontrado: ${id}`);
            }
        });
        
        const videoCheckbox = document.getElementById('propHasVideo');
        if (videoCheckbox) {
            videoCheckbox.checked = true;
            console.log('✅ Checkbox de vídeo marcado');
        }
        
        console.log('🎯 Formulário preenchido! Agora você pode editar ou salvar.');
        
        return true;
    };
    
    // ======================================================================
    // 6. BOTÃO DE EMERGÊNCIA
    // ======================================================================
    
    /**
     * Cria botão de emergência no admin panel
     */
    window.createEmergencyAdminButton = function() {
        const panel = document.getElementById('adminPanel');
        if (!panel) return null;
        
        // Verificar se já existe
        if (document.getElementById('emergency-admin-btn')) {
            return document.getElementById('emergency-admin-btn');
        }
        
        const button = document.createElement('button');
        button.id = 'emergency-admin-btn';
        button.innerHTML = '<i class="fas fa-ambulance"></i> Diagnóstico de Emergência';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            background: #e74c3c;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 5px;
            cursor: pointer;
            z-index: 10001;
            font-weight: bold;
            box-shadow: 0 4px 12px rgba(231, 76, 60, 0.4);
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
        });
        
        button.addEventListener('click', () => {
            window.diagnoseAdminSystem();
            window.showAdminNotification('Diagnóstico concluído! Verifique o console.', 'info', 5000);
        });
        
        document.body.appendChild(button);
        console.log('🚨 [ADMIN] Botão de emergência criado');
        
        return button;
    };
    
    // ======================================================================
    // 7. INICIALIZAÇÃO AUTOMÁTICA EM MODO DEBUG
    // ======================================================================
    
    if (window.location.search.includes('debug=true')) {
        setTimeout(() => {
            console.log('🔄 [ADMIN] Executando verificação automática do sistema admin...');
            
            setTimeout(() => {
                if (typeof window.diagnoseAdminSystem === 'function') {
                    window.diagnoseAdminSystem();
                }
            }, 3000);
            
            // Criar botão de emergência após 5 segundos
            setTimeout(() => {
                window.createEmergencyAdminButton();
            }, 5000);
            
            console.log('📌 Comandos admin disponíveis:');
            console.log('  - showAdminNotification("mensagem", "tipo") - Exibir notificação');
            console.log('  - setupUploadArea(inputId, areaId, callback) - Configurar upload');
            console.log('  - savePropertyLocalFallback(propertyData) - Fallback local');
            console.log('  - diagnoseAdminSystem() - Diagnosticar sistema admin');
            console.log('  - testAdminForm() - Preencher formulário de teste');
            console.log('  - createEmergencyAdminButton() - Criar botão de emergência');
            
        }, 1000);
    }
    
    console.log('✅ admin-diagnostics.js carregado - Funções admin helpers disponíveis');
})();
