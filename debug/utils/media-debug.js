// debug/utils/media-debug.js - Utilitários de Debug para o Sistema de Mídia
console.log('📸 [SUPPORT] media-debug.js carregado.');

(function() {
    'use strict';

    // ==============================================================
    // DIAGNÓSTICO DO ESTADO DO MEDIA SYSTEM
    // Extraído de media-unified.js (Core System)
    // ==============================================================
    window.debugMediaSystem = function() {
        if (!window.MediaSystem) {
            console.error('❌ MediaSystem não disponível');
            return;
        }
        
        console.group('🐛 DEBUG - ESTADO DO MEDIA SYSTEM');
        console.log('📊 Estado atual:');
        console.log('- Arquivos novos:', MediaSystem.state?.files?.length || 0);
        console.log('- Arquivos existentes:', MediaSystem.state?.existing?.length || 0);
        console.log('- PDFs novos:', MediaSystem.state?.pdfs?.length || 0);
        console.log('- PDFs existentes:', MediaSystem.state?.existingPdfs?.length || 0);
        console.log('- Upload em andamento:', MediaSystem.state?.isUploading || false);
        console.log('- Property ID atual:', MediaSystem.state?.currentPropertyId || null);
        
        console.log('📁 Arquivos novos:');
        (MediaSystem.state?.files || []).forEach((item, i) => {
            console.log(`  ${i+1}. "${item.name}"`, {
                isNew: item.isNew,
                uploaded: item.uploaded,
                hasFile: !!item.file
            });
        });
        
        console.groupEnd();
    };

    // ==============================================================
    // TESTE DE UPLOAD
    // Extraído de media-unified.js (Core System)
    // ==============================================================
    window.testMediaUpload = async function() {
        console.group('🧪 TESTE DE UPLOAD RÁPIDO');
        
        if (!window.MediaSystem) {
            console.error('❌ MediaSystem não disponível');
            alert('❌ MediaSystem não disponível');
            console.groupEnd();
            return;
        }
        
        try {
            // Criar arquivo de teste
            const testBlob = new Blob(['test content'], { type: 'image/jpeg' });
            const testFile = new File([testBlob], 'test_image.jpg', { type: 'image/jpeg' });
            
            console.log('📁 Arquivo de teste criado');
            
            // Adicionar ao sistema
            MediaSystem.addFiles([testFile]);
            
            // Aguardar um pouco
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Testar upload
            const testId = 'test_' + Date.now();
            const result = await MediaSystem.uploadAll(testId, 'Teste de Upload');
            
            if (result.success) {
                console.log('✅ TESTE DE UPLOAD BEM-SUCEDIDO!');
                console.log('📊 URLs geradas:', result.images);
                alert('✅ Upload funcionou! Verifique console para detalhes.');
            } else {
                console.error('❌ TESTE DE UPLOAD FALHOU!');
                alert('❌ Upload falhou. Verifique console.');
            }
        } catch (error) {
            console.error('❌ Erro no teste:', error);
            alert(`❌ Erro: ${error.message}`);
        }
        
        console.groupEnd();
    };

    // ==============================================================
    // FUNÇÃO AUXILIAR: Forçar atualização do preview
    // ==============================================================
    window.forceMediaPreviewUpdate = function() {
        if (!window.MediaSystem) {
            console.error('❌ MediaSystem não disponível');
            return;
        }
        
        console.log('🔄 Forçando atualização do preview de mídia...');
        MediaSystem.updateUI();
        console.log('✅ Preview atualizado');
    };

    // ==============================================================
    // VALIDAÇÃO AUTOMÁTICA CONTROLADA (opcional)
    // ==============================================================
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('autotest')) {
        console.log('🤖 [AUTOTEST] Executando validações automáticas...');
        
        setTimeout(() => {
            console.log('🔍 Verificando disponibilidade das funções:');
            console.log('   debugMediaSystem:', typeof window.debugMediaSystem === 'function' ? '✅' : '❌');
            console.log('   testMediaUpload:', typeof window.testMediaUpload === 'function' ? '✅' : '❌');
            console.log('   forceMediaPreviewUpdate:', typeof window.forceMediaPreviewUpdate === 'function' ? '✅' : '❌');
        }, 500);
        
        setTimeout(() => {
            console.log('🔍 Verificando MediaSystem:', window.MediaSystem ? '✅' : '❌');
        }, 1000);
    }

    console.log('✅ media-debug.js pronto. Funções disponíveis:');
    console.log('   - debugMediaSystem()');
    console.log('   - testMediaUpload()');
    console.log('   - forceMediaPreviewUpdate()');
})();
