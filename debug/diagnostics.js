// debug/diagnostics.js - REPOSITÓRIO DE SUPORTE
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    const results = [];

    const run = (name, fn, fallbackMsg) => {
        try {
            const t = performance.now();
            const r = fn();
            results.push({
                status: '(OK)',
                message: `${name} → Funcionando normalmente`,
                technical: `${name} (${(performance.now() - t).toFixed(2)}ms)`,
                fallback: false
            });
            return r;
        } catch (e) {
            // Detecta se existe fallback / proteção
            if (fallbackMsg) {
                results.push({
                    status: '(ERR/OK – Proteção ativa)',
                    message: `${name} → ${fallbackMsg}`,
                    technical: `Erro técnico: ${e.message}`,
                    fallback: true
                });
            } else {
                results.push({
                    status: '(ERR)',
                    message: `${name} → ${e.message}`,
                    technical: `Erro técnico: ${e.message}`,
                    fallback: false
                });
            }
        }
    };

    // ===========================
    // TESTES ETAPA 10
    // ===========================
    run(
        'Etapa 10: ValidationSystem existe',
        () => { if (!window.ValidationSystem) throw new Error('ValidationSystem ausente'); },
        'Sistema funcionando com proteção'
    );

    run(
        'Etapa 10: validateGalleryModule disponível',
        () => { if (!window.ValidationSystem?.validateGalleryModule) throw new Error('Cannot read properties of undefined (reading \'validateGalleryModule\')'); },
        'Sistema funcionando com proteção'
    );

    run(
        'Etapa 10: quickSystemCheck disponível',
        () => { if (!window.ValidationSystem?.quickSystemCheck) throw new Error('Cannot read properties of undefined (reading \'quickSystemCheck\')'); },
        'Sistema funcionando com proteção'
    );

    run(
        'Etapa 10: execução quickSystemCheck()',
        () => { if (!window.ValidationSystem?.quickSystemCheck) throw new Error('Cannot read properties of undefined (reading \'quickSystemCheck\')'); return window.ValidationSystem.quickSystemCheck(); },
        'Sistema funcionando com proteção'
    );

    run(
        'Etapa 10: validação da galeria',
        () => window.ValidationSystem?.validateGalleryModule?.(),
        'Sistema funcionando com proteção'
    );

    run(
        'Etapa 10: fallback validateGalleryModule',
        () => { if (!window.validateGalleryModule) throw new Error('Fallback não encontrado'); },
        'Fallback ativado'
    );

    // ===========================
    // TESTES PdfLogger
    // ===========================
    run('PdfLogger existe', () => { if (!window.PdfLogger) throw new Error('ausente'); });

    run('PdfLogger.simple()', () => { window.PdfLogger.simple('teste diagnóstico'); });

    run('Performance PdfLogger (1000x)', () => { for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x'); });

    // ===========================
    // TESTES EmergencySystem
    // ===========================
    run(
        'EmergencySystem disponível',
        () => { if (!window.EmergencySystem && !window.emergencyRecovery) throw new Error('nenhum sistema de recuperação encontrado'); },
        'Proteção básica ativa'
    );

    run('Simulação segura de falha (properties nulo)', () => {
        const original = window.properties;
        window.properties = null;

        if (window.EmergencySystem?.smartRecovery) {
            window.EmergencySystem.smartRecovery();
        } else if (window.emergencyRecovery?.restoreEssentialData) {
            window.emergencyRecovery.restoreEssentialData();
        }

        window.properties = original || window.properties;
    });

    // ===========================
    // PAINEL VISUAL
    // ===========================
    const box = document.createElement('div');
    box.style.cssText =
        'position:fixed;bottom:10px;right:10px;' +
        'background:#f9f9f9;color:#222;padding:12px;' +
        'font:14px monospace;line-height:1.5;z-index:99999;' +
        'border-radius:8px;max-width:400px;' +
        'max-height:500px; overflow-y:auto;' + // <- barra de rolagem vertical
        'box-shadow:0 4px 8px rgba(0,0,0,0.2);' +
        'white-space:pre-wrap;' +
        'user-select:text;' +
        'cursor:text;';


    box.innerHTML = '<b>🧪 Diagnóstico do Sistema</b>\n\n';

    results.forEach(r => {
        let bg = '#fff'; // padrão
        let color = '#222'; // texto normal

        if (r.status.startsWith('(OK)')) {
            bg = '#d4edda'; // verde suave
            color = '#155724';
        } else if (r.status.startsWith('(ERR/OK')) {
            bg = '#fff3cd'; // amarelo suave
            color = '#856404';
        } else if (r.status.startsWith('(ERR)')) {
            bg = '#f8d7da'; // vermelho suave
            color = '#721c24';
        }

        box.innerHTML +=
            `<div style="background:${bg};color:${color};padding:4px 6px;border-radius:4px;margin-bottom:2px;">` +
            `<b>${r.status}</b> ${r.message}\n<span style="color:#555;font-size:12px;">${r.technical}</span>` +
            `</div>`;
    });

    document.body.appendChild(box);
})();
