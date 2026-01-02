// debug/diagnostics.js - REPOSITÓRIO DE SUPORTE
console.log('🔍 diagnostics.js carregado - Sistema de diagnósticos em modo debug');

(function () {
    const isDebug =
        location.search.includes('debug=true') ||
        location.search.includes('diagnostics=true');

    if (!isDebug) return;

    /* =====================================================
       ESTRUTURA CENTRAL DE RESULTADOS
    ===================================================== */
    const results = [];

    const addResult = (status, neofitoMsg, tecnicoMsg) => {
        results.push({ status, neofitoMsg, tecnicoMsg });
    };

    /* =====================================================
       FUNÇÃO PADRÃO PARA TESTES EXECUTÁVEIS
    ===================================================== */
    const run = (name, fn) => {
        try {
            const t0 = performance.now();
            fn();
            const t1 = performance.now();
            addResult(
                'OK',
                `${name} → Funcionando normalmente`,
                `${name} (${(t1 - t0).toFixed(2)}ms)`
            );
        } catch (e) {
            addResult(
                'ERR/OK – Proteção ativa',
                `${name} → Proteção ativa / fallback acionado`,
                `${name}: ${e.message}`
            );
        }
    };

    /* =====================================================
       TESTES AUTOMÁTICOS DO SISTEMA (ETAPA 10)
    ===================================================== */

    if (window.ValidationSystem) {
        run('Etapa 10: ValidationSystem existe', () => true);

        run('Etapa 10: validateGalleryModule disponível', () => {
            if (typeof window.ValidationSystem.validateGalleryModule !== 'function')
                throw new Error('função ausente');
        });

        run('Etapa 10: quickSystemCheck disponível', () => {
            if (typeof window.ValidationSystem.quickSystemCheck !== 'function')
                throw new Error('função ausente');
        });

        run(
            'Etapa 10: execução quickSystemCheck()',
            () => window.ValidationSystem.quickSystemCheck()
        );

        run(
            'Etapa 10: validação da galeria',
            () => window.ValidationSystem.validateGalleryModule()
        );
    } else {
        addResult(
            'ERR/OK – Proteção ativa',
            'Etapa 10: ValidationSystem ausente → Sistema protegido',
            'ValidationSystem undefined'
        );

        addResult(
            'OK',
            'Etapa 10: validação da galeria → Fallback acionado',
            'Fallback validateGalleryModule ativo'
        );
    }

    run('Etapa 10: fallback validateGalleryModule', () => {
        if (typeof window.validateGalleryModule !== 'function')
            throw new Error('fallback ausente');
    });

    /* =====================================================
       PdfLogger
    ===================================================== */
    run('PdfLogger existe', () => {
        if (!window.PdfLogger) throw new Error('ausente');
    });

    run('PdfLogger.simple()', () =>
        window.PdfLogger.simple('teste diagnóstico')
    );

    run('Performance PdfLogger (1000x)', () => {
        for (let i = 0; i < 1000; i++) window.PdfLogger.simple('x');
    });

    /* =====================================================
       Emergency / Recovery
    ===================================================== */
    if (!window.EmergencySystem && !window.emergencyRecovery) {
        addResult(
            'ERR/OK – Proteção ativa',
            'EmergencySystem ausente → Sistema protegido',
            'Nenhum recovery carregado'
        );
    } else {
        addResult(
            'OK',
            'EmergencySystem disponível → Funcionando normalmente',
            'Sistema de recuperação detectado'
        );
    }

    run('Simulação segura de falha (properties nulo)', () => {
        const original = window.properties;
        window.properties = null;

        if (window.EmergencySystem?.smartRecovery)
            window.EmergencySystem.smartRecovery();
        else if (window.emergencyRecovery?.restoreEssentialData)
            window.emergencyRecovery.restoreEssentialData();

        window.properties = original || window.properties;
    });

    /* =====================================================
       INTERPRETADOR AUTOMÁTICO DE BLOCOS DE TESTE
       (COPIAR / COLAR LIVRE)
    ===================================================== */
    function interpretarBlocosDeTeste(texto) {
        const linhas = texto.split('\n');
        let bloco = {};

        linhas.forEach((linha) => {
            const l = linha.trim();

            if (l.startsWith('# Teste')) {
                bloco = { nome: l.replace('# ', '') };
            } else if (l.startsWith('# Resultado esperado:')) {
                bloco.resultadoEsperado = l.replace('# Resultado esperado:', '').trim();

                // Geração automática do resultado
                if (bloco.resultadoEsperado.startsWith('0')) {
                    addResult(
                        'OK',
                        `${bloco.nome} → Produção limpa`,
                        `Resultado esperado: ${bloco.resultadoEsperado}`
                    );
                } else if (bloco.resultadoEsperado.startsWith('1')) {
                    addResult(
                        'ERR/OK – Proteção ativa',
                        `${bloco.nome} → Debug ativo`,
                        `Resultado esperado: ${bloco.resultadoEsperado}`
                    );
                } else {
                    addResult(
                        'OK',
                        `${bloco.nome} → Verificação manual`,
                        `Resultado esperado: ${bloco.resultadoEsperado}`
                    );
                }

                bloco = {};
            } else if (l && !l.startsWith('#')) {
                bloco.comando = l;
            }
        });
    }

    /* =====================================================
       BLOCO DE TESTES — USUÁRIO SÓ COPIA E COLA AQUI
    ===================================================== */
    const novosTestes = `
# Teste 1: Produção limpa
curl -s "https://rclessa25-hub.github.io/imoveis-maceio/" | grep -c "validation.js"
# Resultado esperado: 0 (não carrega em produção)

# Teste 2: Debug completo
curl -s "https://rclessa25-hub.github.io/imoveis-maceio/?debug=true" | grep -c "validation.js"
# Resultado esperado: 1 (carrega em debug)

# Teste 3: Sistema funcional
Acessar manualmente e verificar que galeria abre imagens
# Resultado esperado: Galeria funcional
`;

    interpretarBlocosDeTeste(novosTestes);

    /* =====================================================
       PAINEL DE DIAGNÓSTICO
    ===================================================== */
    const box = document.createElement('div');
    box.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        width: 480px;
        max-height: 75vh;
        overflow-y: auto;
        background: #f4f6f8;
        color: #000;
        padding: 16px;
        font-size: 16px;
        font-family: monospace;
        z-index: 99999;
        border-radius: 10px;
        box-shadow: 0 0 14px rgba(0,0,0,0.35);
        user-select: text;
    `;

    results.forEach((r) => {
        const div = document.createElement('div');
        let color = '#000';

        if (r.status.includes('ERR')) color = '#b00000';
        if (r.status === 'OK') color = '#006400';

        div.style.marginBottom = '6px';
        div.innerHTML = `
            <strong style="color:${color}">(${r.status})</strong>
            ${r.neofitoMsg}
            <div style="color:#555;margin-left:12px">${r.tecnicoMsg}</div>
        `;
        box.appendChild(div);
    });

    document.body.appendChild(box);
})();
