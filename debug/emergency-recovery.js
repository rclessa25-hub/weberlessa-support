// weberlessa-support/debug/emergency-recovery.js - VERSÃO ATUALIZADA
console.log('🆘 emergency-recovery.js - Sistema de Recuperação ATUALIZADO (pós-migração)');

(function() {
    const isDebug = window.location.search.includes('debug=true') || 
                    window.location.search.includes('emergency=true') ||
                    window.location.search.includes('test=true');

    // ✅ NAMESPACE ÚNICO PARA RECUPERAÇÃO
    window.EmergencyRecovery = window.EmergencyRecovery || {
        version: '2.0',
        lastRecovery: null,
        recoveryCount: 0
    };

    // ========== DIAGNÓSTICO DO SISTEMA ATUAL ==========
    window.EmergencyRecovery.diagnoseSystem = function() {
        console.group('🔍 DIAGNÓSTICO DO SISTEMA ATUAL');
        
        const diagnosis = {
            // ✅ SISTEMA DE MÍDIA ATUAL (UNIFICADO)
            'MediaSystem (Atual)': typeof window.MediaSystem === 'object',
            'MediaSystem.addFiles': typeof window.MediaSystem?.addFiles === 'function',
            'MediaSystem.uploadAll': typeof window.MediaSystem?.uploadAll === 'function',
            'MediaSystem.loadExisting': typeof window.MediaSystem?.loadExisting === 'function',
            'MediaSystem.updateUI': typeof window.MediaSystem?.updateUI === 'function',
            'MediaSystem.init': typeof window.MediaSystem?.init === 'function',
            
            // ✅ SISTEMA ANTIGO (DEVE SER INEXISTENTE)
            'handleNewMediaFiles (Antigo)': typeof window.handleNewMediaFiles === 'function',
            'updateMediaPreview (Antigo)': typeof window.updateMediaPreview === 'function',
            'initMediaSystem (Antigo)': typeof window.initMediaSystem === 'function',
            
            // ✅ ESTADO DO SISTEMA
            'window.properties': Array.isArray(window.properties),
            'Properties count': window.properties?.length || 0,
            'Supabase Client': !!window.supabaseClient,
            'SharedCore': !!window.SharedCore,
            'DOM Ready': document.readyState === 'complete'
        };
        
        console.table(diagnosis);
        
        // ✅ DETERMINAR SE PRECISA DE RECUPERAÇÃO
        const criticalFunctions = [
            'MediaSystem.addFiles',
            'MediaSystem.uploadAll',
            'MediaSystem.init'
        ];
        
        const needsRecovery = criticalFunctions.some(funcPath => {
            const parts = funcPath.split('.');
            let obj = window;
            for (const part of parts) {
                if (!obj || typeof obj !== 'object') return true;
                obj = obj[part];
            }
            return typeof obj !== 'function';
        });
        
        console.log('📊 NECESSIDADE DE RECUPERAÇÃO:', needsRecovery ? '⚠️ SIM' : '✅ NÃO');
        
        if (diagnosis['handleNewMediaFiles (Antigo)'] || 
            diagnosis['updateMediaPreview (Antigo)'] || 
            diagnosis['initMediaSystem (Antigo)']) {
            console.warn('⚠️ SISTEMA EM ESTADO MISTO (antigo + novo)');
            console.log('💡 Algumas funções antigas ainda presentes, mas sistema atual está funcional.');
        }
        
        console.groupEnd();
        return { diagnosis, needsRecovery };
    };

    // ========== RECUPERAÇÃO DO MEDIASYSTEM ATUAL ==========
    window.EmergencyRecovery.recoverMediaSystem = function() {
        console.group('🚨 RECUPERAÇÃO DO MEDIASYSTEM (Sistema Atual)');
        
        try {
            // ✅ 1. VERIFICAR SE MEDIASYSTEM JÁ EXISTE
            if (window.MediaSystem && typeof window.MediaSystem === 'object') {
                console.log('✅ MediaSystem já existe, verificando integridade...');
                
                // Testar funções críticas
                const criticalFunctions = ['addFiles', 'uploadAll', 'init'];
                const missingFunctions = criticalFunctions.filter(
                    fn => typeof window.MediaSystem[fn] !== 'function'
                );
                
                if (missingFunctions.length === 0) {
                    console.log('✅ MediaSystem já está 100% funcional');
                    console.groupEnd();
                    return { 
                        success: true, 
                        action: 'no_recovery_needed',
                        system: 'MediaSystem (atual)'
                    };
                }
                
                console.warn(`⚠️ MediaSystem incompleto: funções faltando: ${missingFunctions.join(', ')}`);
            }
            
            // ✅ 2. RECRIAR MEDIASYSTEM SIMPLIFICADO (EMERGÊNCIA)
            console.log('🔄 Recriando MediaSystem simplificado para emergência...');
            
            window.MediaSystem = {
                // Informações básicas
                version: 'emergency_recovery_2.0',
                lastRecovery: new Date().toISOString(),
                
                // Configuração
                config: {
                    currentSystem: 'vendas',
                    buckets: { vendas: 'properties', aluguel: 'rentals' },
                    limits: {
                        maxFiles: 10,
                        maxSize: 5 * 1024 * 1024,
                        maxPdfs: 5,
                        maxPdfSize: 10 * 1024 * 1024
                    }
                },
                
                // Estado
                state: {
                    files: [],
                    existing: [],
                    pdfs: [],
                    existingPdfs: [],
                    isUploading: false,
                    currentPropertyId: null
                },
                
                // ✅ FUNÇÕES CRÍTICAS
                init: function(systemName = 'vendas') {
                    console.log(`🔧 MediaSystem de emergência inicializado: ${systemName}`);
                    this.config.currentSystem = systemName;
                    return this;
                },
                
                addFiles: function(fileList) {
                    if (!fileList || fileList.length === 0) return 0;
                    
                    const filesArray = Array.from(fileList);
                    console.log(`📁 Adicionando ${filesArray.length} arquivo(s) (emergência)`);
                    
                    filesArray.forEach(file => {
                        const blobUrl = URL.createObjectURL(file);
                        this.state.files.push({
                            file: file,
                            id: `emergency_${Date.now()}_${Math.random()}`,
                            name: file.name,
                            type: file.type,
                            preview: blobUrl,
                            isNew: true,
                            uploaded: false
                        });
                    });
                    
                    // Tentar atualizar UI
                    this.updateUI();
                    return filesArray.length;
                },
                
                updateUI: function() {
                    const container = document.getElementById('uploadPreview');
                    if (!container) {
                        console.warn('⚠️ Container #uploadPreview não encontrado');
                        return false;
                    }
                    
                    const fileCount = this.state.files.length;
                    container.innerHTML = `
                        <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            <i class="fas fa-images" style="font-size: 2rem; color: #3498db; margin-bottom: 0.5rem;"></i>
                            <p style="margin: 0; font-weight: 600; color: #2c3e50;">
                                ${fileCount} arquivo(s) carregado(s) (emergência)
                            </p>
                            <small style="color: #7f8c8d;">
                                Sistema de recuperação ativo
                            </small>
                        </div>
                    `;
                    
                    return true;
                },
                
                // ✅ FUNÇÕES SIMPLIFICADAS
                uploadAll: async function(propertyId, propertyTitle) {
                    console.log(`📤 Upload de emergência para ${propertyId} - "${propertyTitle}"`);
                    
                    if (this.state.isUploading) {
                        console.warn('⚠️ Upload já em andamento');
                        return { success: false, error: 'Upload em andamento' };
                    }
                    
                    this.state.isUploading = true;
                    
                    try {
                        // Simular upload bem-sucedido
                        await new Promise(resolve => setTimeout(resolve, 1000));
                        
                        const result = {
                            success: true,
                            images: 'EMPTY',
                            pdfs: 'EMPTY',
                            uploadedCount: 0,
                            emergencyMode: true,
                            message: 'Upload simulado (modo emergência)'
                        };
                        
                        console.log('✅ Upload simulado concluído');
                        return result;
                        
                    } catch (error) {
                        console.error('❌ Erro no upload de emergência:', error);
                        return { 
                            success: false, 
                            error: error.message,
                            emergencyMode: true 
                        };
                    } finally {
                        this.state.isUploading = false;
                    }
                },
                
                loadExisting: function(property) {
                    console.log(`📥 Carregando existente (emergência): ${property.id}`);
                    
                    if (!property) return this;
                    
                    this.state.currentPropertyId = property.id;
                    this.state.existing = [];
                    this.state.existingPdfs = [];
                    
                    return this;
                },
                
                resetState: function() {
                    console.log('🧹 Resetando estado de emergência');
                    this.state.files = [];
                    this.state.existing = [];
                    this.state.pdfs = [];
                    this.state.existingPdfs = [];
                    this.state.isUploading = false;
                    this.state.currentPropertyId = null;
                    return this;
                },
                
                // ✅ INFORMAÇÕES
                getStatus: function() {
                    return {
                        version: this.version,
                        filesCount: this.state.files.length,
                        existingCount: this.state.existing.length,
                        pdfsCount: this.state.pdfs.length,
                        isUploading: this.state.isUploading,
                        currentPropertyId: this.state.currentPropertyId,
                        emergencyMode: true
                    };
                }
            };
            
            // ✅ 3. INICIALIZAR O NOVO SISTEMA
            window.MediaSystem.init('vendas');
            
            // ✅ 4. ATUALIZAR MARCAS TEMPORAIS
            window.EmergencyRecovery.lastRecovery = new Date().toISOString();
            window.EmergencyRecovery.recoveryCount = (window.EmergencyRecovery.recoveryCount || 0) + 1;
            
            console.log('✅✅✅ MEDIASYSTEM DE EMERGÊNCIA CRIADO COM SUCESSO!');
            console.log('📊 Status:', window.MediaSystem.getStatus());
            
            console.groupEnd();
            return { 
                success: true, 
                action: 'created_emergency_system',
                system: window.MediaSystem.getStatus()
            };
            
        } catch (error) {
            console.error('❌ ERRO CRÍTICO na recuperação:', error);
            console.groupEnd();
            return { 
                success: false, 
                action: 'recovery_failed',
                error: error.message 
            };
        }
    };

    // ========== RECUPERAÇÃO DE SISTEMAS RELACIONADOS ==========
    window.EmergencyRecovery.recoverRelatedSystems = function() {
        console.group('🔄 RECUPERAÇÃO DE SISTEMAS RELACIONADOS');
        
        const results = {};
        
        // ✅ 1. RECUPERAR SISTEMA DE PROPRIEDADES
        if (!window.properties || !Array.isArray(window.properties)) {
            console.log('🔄 Recuperando sistema de propriedades...');
            window.properties = [];
            window.savePropertiesToStorage = function() {
                console.log('💾 Salvando propriedades (emergência)');
                try {
                    localStorage.setItem('properties_emergency', JSON.stringify(window.properties));
                    return true;
                } catch {
                    return false;
                }
            };
            results.properties = 'recovered';
        } else {
            results.properties = 'already_ok';
        }
        
        // ✅ 2. RECUPERAR SHAREDCORE (SIMPLIFICADO)
        if (!window.SharedCore) {
            console.log('🔄 Criando SharedCore simplificado...');
            window.SharedCore = {
                version: 'emergency_1.0',
                ensureBooleanVideo: function(value) {
                    return value === true || value === 'true' || value === 1 || value === '1';
                },
                formatFeaturesForDisplay: function(features) {
                    return features || '';
                },
                parseFeaturesForStorage: function(value) {
                    return value || '[]';
                },
                PriceFormatter: {
                    formatForCard: function(value) {
                        if (!value) return 'R$ 0,00';
                        if (typeof value === 'string' && value.includes('R$')) return value;
                        return `R$ ${value.toString().replace(/\D/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}`;
                    }
                }
            };
            results.sharedCore = 'created_emergency';
        } else {
            results.sharedCore = 'already_ok';
        }
        
        console.table(results);
        console.groupEnd();
        return results;
    };

    // ========== RECUPERAÇÃO COMPLETA DO SISTEMA ==========
    window.EmergencyRecovery.fullSystemRecovery = function() {
        console.group('🚨🚨🚨 RECUPERAÇÃO COMPLETA DO SISTEMA');
        
        const results = {
            diagnosis: window.EmergencyRecovery.diagnoseSystem(),
            media: window.EmergencyRecovery.recoverMediaSystem(),
            related: window.EmergencyRecovery.recoverRelatedSystems(),
            timestamp: new Date().toISOString()
        };
        
        console.log('📊 RESULTADOS DA RECUPERAÇÃO COMPLETA:');
        console.log('- Diagnóstico:', results.diagnosis.needsRecovery ? '⚠️ Necessitava' : '✅ OK');
        console.log('- MediaSystem:', results.media.success ? '✅ Recuperado' : '❌ Falhou');
        console.log('- Sistemas relacionados:', Object.keys(results.related).length, 'tratados');
        
        // ✅ NOTIFICAÇÃO PARA O USUÁRIO
        if (results.media.success || results.related.properties === 'recovered') {
            console.log('🎉 RECUPERAÇÃO PARCIALMENTE BEM-SUCEDIDA');
            console.log('💡 O sistema pode ter funcionalidades limitadas, mas está operacional.');
        } else {
            console.error('❌ RECUPERAÇÃO COM LIMITAÇÕES SIGNIFICATIVAS');
            console.log('🚨 Algumas funcionalidades podem não estar disponíveis.');
        }
        
        console.groupEnd();
        return results;
    };

    // ========== DETECÇÃO AUTOMÁTICA (APENAS DEBUG) ==========
    if (isDebug) {
        setTimeout(() => {
            console.log('🔍 DETECÇÃO AUTOMÁTICA DE PROBLEMAS (Debug Mode)');
            
            const diagnosis = window.EmergencyRecovery.diagnoseSystem();
            
            if (diagnosis.needsRecovery) {
                console.warn('⚠️ PROBLEMAS DETECTADOS - Iniciando recuperação automática...');
                
                // Executar apenas recuperação de MediaSystem se necessário
                if (!diagnosis.diagnosis['MediaSystem (Atual)'] || 
                    !diagnosis.diagnosis['MediaSystem.addFiles']) {
                    window.EmergencyRecovery.recoverMediaSystem();
                }
                
                // Se SharedCore faltar, recuperar também
                if (!diagnosis.diagnosis['SharedCore']) {
                    window.EmergencyRecovery.recoverRelatedSystems();
                }
                
                console.log('✅ Recuperação automática concluída.');
            } else {
                console.log('✅ Nenhum problema crítico detectado - Sistema estável.');
                
                // Apenas log se houver funções antigas ainda presentes
                if (diagnosis.diagnosis['handleNewMediaFiles (Antigo)'] || 
                    diagnosis.diagnosis['updateMediaPreview (Antigo)']) {
                    console.log('📝 Nota: Algumas funções antigas ainda presentes (compatibilidade).');
                }
            }
        }, 7000); // 7 segundos para dar tempo do sistema carregar
    }

    // ========== EXPORTAÇÃO E DOCUMENTAÇÃO ==========
    console.log('✅ emergency-recovery.js ATUALIZADO - Sistema de recuperação pós-migração');
    console.log('🧪 Funções disponíveis:');
    console.log('  - window.EmergencyRecovery.diagnoseSystem()');
    console.log('  - window.EmergencyRecovery.recoverMediaSystem()');
    console.log('  - window.EmergencyRecovery.fullSystemRecovery()');
    console.log('  - window.EmergencyRecovery.recoverRelatedSystems()');

})();
