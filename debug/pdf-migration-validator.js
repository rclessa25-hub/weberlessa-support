// js/modules/debug/pdf-migration-validator.js
console.log('🔍 Validador de migração PDF - ETAPA 14');

(function validatePdfMigration() {
    const tests = {
        'PdfSystem disponível': () => typeof window.PdfSystem !== 'undefined',
        'Funções críticas presentes': () => 
            typeof window.PdfSystem?.processAndSavePdfs === 'function' &&
            typeof window.PdfSystem?.showModal === 'function',
        'Admin integrado': () => 
            typeof window.processAndSavePdfs === 'function' &&
            window.processAndSavePdfs.toString().includes('PdfSystem'),
        'Placeholders ativos': () => 
            typeof window.initPdfSystem === 'function' &&
            typeof window.updatePdfPreview === 'function',
        'Modal funciona': () => {
            const modal = document.getElementById('pdfModal');
            return modal && typeof modal.style !== 'undefined';
        },
        'Upload preview': () => {
            const preview = document.getElementById('pdfUploadPreview');
            return preview && preview.innerHTML.length > 0;
        }
    };
    
    console.group('🧪 VALIDAÇÃO PDF UNIFICADO');
    let passed = 0;
    let total = 0;
    
    Object.entries(tests).forEach(([name, test]) => {
        total++;
        try {
            const result = test();
            console.log(`${result ? '✅' : '❌'} ${name}: ${result}`);
            if (result) passed++;
        } catch (e) {
            console.log(`❌ ${name}: ERRO - ${e.message}`);
        }
    });
    
    const score = Math.round((passed / total) * 100);
    console.log(`📊 Resultado: ${passed}/${total} (${score}%)`);
    console.groupEnd();
    
    if (score >= 80) {
        console.log('🎉 Migração PDF bem-sucedida!');
    } else {
        console.warn('⚠️  Migração PDF com problemas - verificar console');
    }
    
    return score;
})();
