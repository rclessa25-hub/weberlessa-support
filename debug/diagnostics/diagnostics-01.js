// ========== ADICIONE ESTE CÓDIGO NO DIAGNOSTICS.JS ==========
// Procure por onde os outros testes estão definidos e adicione junto

// VERIFICAÇÃO DO PERFORMANCE-SYSTEM - DIAGNÓSTICO DE CARREGAMENTO
const PerformanceSystemDiagnostic = {
    id: 'performance-system-diagnostic',
    title: '🚀 PERFORMANCE-SYSTEM',
    description: 'Verifica se o sistema de performance está carregado e funcionando',
    type: 'diagnostic',
    icon: '🚀',
    category: 'performance',
    critical: true,
    
    execute: async function() {
        console.group('🚀 DIAGNÓSTICO DO PERFORMANCE-SYSTEM');
        
        const results = {
            status: 'pending',
            checks: [],
            fixesApplied: [],
            recommendations: [],
            performanceData: {}
        };
        
        // 1. VERIFICAR SE O MÓDULO ESTÁ CARREGADO
        console.log('1. 🔍 VERIFICANDO CARREGAMENTO...');
        
        const isLoaded = typeof window.PerformanceSystem !== 'undefined';
        const url = 'https://rclessa25-hub.github.io/weberlessa-support/performance/performance-system.js';
        
        console.log(`📦 PerformanceSystem carregado? ${isLoaded ? '✅ SIM' : '❌ NÃO'}`);
        
        if (isLoaded) {
            results.checks.push({
                item: 'Módulo carregado',
                status: 'success',
                message: 'PerformanceSystem disponível globalmente'
            });
            
            // Analisar o objeto
            console.log('📌 ANALISANDO PerformanceSystem:');
            const psKeys = Object.keys(window.PerformanceSystem || {});
            console.log(`- Propriedades: ${psKeys.length}`);
            console.log(`- Métodos principais:`, psKeys.filter(k => typeof window.PerformanceSystem[k] === 'function'));
            
            results.performanceData.properties = psKeys;
            
        } else {
            results.checks.push({
                item: 'Módulo carregado',
                status: 'error',
                message: 'PerformanceSystem NÃO disponível'
            });
        }
        
        // 2. TESTAR URL DO ARQUIVO
        console.log('\n2. 🌐 TESTANDO URL DO ARQUIVO...');
        
        try {
            const response = await fetch(url, { method: 'HEAD' });
            const fileExists = response.ok;
            
            console.log(`📄 Arquivo existe? ${fileExists ? '✅ SIM' : '❌ NÃO'}`);
            console.log(`- Status: ${response.status} ${response.statusText}`);
            
            if (fileExists) {
                // Pegar tamanho do arquivo
                const size = response.headers.get('content-length');
                console.log(`- Tamanho: ${size ? Math.round(size/1024) + ' KB' : 'desconhecido'}`);
                
                results.checks.push({
                    item: 'URL do arquivo',
                    status: 'success',
                    message: `Disponível (${response.status})`
                });
                
                results.performanceData.fileSize = size;
                
            } else {
                results.checks.push({
                    item: 'URL do arquivo',
                    status: 'error',
                    message: `Erro ${response.status}: ${response.statusText}`
                });
                
                results.recommendations.push(`Verificar URL: ${url}`);
            }
            
        } catch (error) {
            console.error(`❌ ERRO ao testar URL: ${error.message}`);
            
            results.checks.push({
                item: 'URL do arquivo',
                status: 'error',
                message: `Erro: ${error.message}`
            });
            
            results.recommendations.push(`Problema de rede/CORS com: ${url}`);
        }
        
        // 3. VERIFICAR SCRIPTS CARREGADOS NA PÁGINA
        console.log('\n3. 📜 VERIFICANDO SCRIPTS NA PÁGINA...');
        
        const allScripts = Array.from(document.querySelectorAll('script[src]'));
        const performanceScripts = allScripts.filter(script => 
            script.src.includes('performance') || 
            script.src.includes('performance-system')
        );
        
        console.log(`📊 Total de scripts: ${allScripts.length}`);
        console.log(`🔍 Scripts de performance: ${performanceScripts.length}`);
        
        performanceScripts.forEach((script, i) => {
            console.log(`  ${i+1}. ${script.src}`);
        });
        
        results.checks.push({
            item: 'Scripts de performance',
            status: performanceScripts.length > 0 ? 'success' : 'warning',
            message: `${performanceScripts.length} script(s) encontrado(s)`
        });
        
        results.performanceData.scriptCount = performanceScripts.length;
        results.performanceData.scriptUrls = performanceScripts.map(s => s.src);
        
        // 4. TESTAR CARREGAMENTO MANUAL (se necessário)
        console.log('\n4. 🔧 TESTANDO CARREGAMENTO MANUAL...');
        
        if (!isLoaded) {
            console.log('🔄 Tentando carregar performance-system.js manualmente...');
            
            try {
                // Criar promessa para carregamento
                const loadPromise = new Promise((resolve, reject) => {
                    const script = document.createElement('script');
                    script.src = url;
                    script.id = 'performance-system-diagnostic-load';
                    
                    script.onload = () => {
                        console.log('✅ Script carregado manualmente');
                        resolve(true);
                    };
                    
                    script.onerror = (error) => {
                        console.error('❌ Erro ao carregar script:', error);
                        reject(error);
                    };
                    
                    document.head.appendChild(script);
                });
                
                // Esperar carregamento
                await Promise.race([loadPromise, new Promise(r => setTimeout(r, 5000))]);
                
                // Verificar se carregou
                const nowLoaded = typeof window.PerformanceSystem !== 'undefined';
                
                if (nowLoaded) {
                    console.log('🎉 PERFORMANCE-SYSTEM CARREGADO COM SUCESSO!');
                    
                    results.checks.push({
                        item: 'Carregamento manual',
                        status: 'success',
                        message: 'Módulo carregado com sucesso'
                    });
                    
                    results.fixesApplied.push('PerformanceSystem carregado manualmente');
                    
                } else {
                    console.log('⏳ Timeout - o script pode estar carregando ainda');
                    
                    results.checks.push({
                        item: 'Carregamento manual',
                        status: 'warning',
                        message: 'Timeout - verifique console do navegador'
                    });
                }
                
            } catch (error) {
                console.error('❌ Falha no carregamento manual:', error);
                
                results.checks.push({
                    item: 'Carregamento manual',
                    status: 'error',
                    message: `Falha: ${error.message}`
                });
            }
            
            // Limpar script de diagnóstico
            const diagScript = document.getElementById('performance-system-diagnostic-load');
            if (diagScript) diagScript.remove();
        }
        
        // 5. TESTAR FUNCIONALIDADES (se carregado)
        console.log('\n5. 🧪 TESTANDO FUNCIONALIDADES...');
        
        if (typeof window.PerformanceSystem !== 'undefined') {
            const ps = window.PerformanceSystem;
            
            // Testar métodos disponíveis
            const requiredMethods = ['init', 'quickTest', 'optimize'];
            const availableMethods = requiredMethods.filter(method => 
                typeof ps[method] === 'function'
            );
            
            console.log(`🛠️ Métodos disponíveis: ${availableMethods.length}/${requiredMethods.length}`);
            availableMethods.forEach(method => {
                console.log(`  ✅ ${method}()`);
            });
            
            results.checks.push({
                item: 'Funcionalidades',
                status: availableMethods.length >= 2 ? 'success' : 'warning',
                message: `${availableMethods.length} de ${requiredMethods.length} métodos disponíveis`
            });
            
            // Testar init() se disponível
            if (typeof ps.init === 'function') {
                try {
                    console.log('🚀 Executando PerformanceSystem.init()...');
                    ps.init();
                    console.log('✅ init() executado com sucesso');
                    
                    results.checks.push({
                        item: 'Inicialização',
                        status: 'success',
                        message: 'PerformanceSystem.init() executado'
                    });
                    
                } catch (error) {
                    console.error(`❌ Erro em init(): ${error.message}`);
                    
                    results.checks.push({
                        item: 'Inicialização',
                        status: 'error',
                        message: `Erro: ${error.message}`
                    });
                }
            }
            
            // Testar quickTest() se disponível
            if (typeof ps.quickTest === 'function') {
                try {
                    console.log('⚡ Executando quickTest()...');
                    const testResult = ps.quickTest();
                    console.log('✅ quickTest() resultado:', testResult);
                    
                    results.performanceData.quickTest = testResult;
                    results.checks.push({
                        item: 'Teste rápido',
                        status: 'success',
                        message: `Resultado: ${JSON.stringify(testResult).substring(0, 100)}...`
                    });
                    
                } catch (error) {
                    console.error(`❌ Erro em quickTest(): ${error.message}`);
                }
            }
            
            // Verificar reporter
            if (ps.reporter && typeof ps.reporter.printReportToConsole === 'function') {
                console.log('📊 Reporter disponível');
                results.checks.push({
                    item: 'Reporter',
                    status: 'success',
                    message: 'Sistema de relatórios disponível'
                });
            }
            
        } else {
            console.log('⚠️ Não é possível testar funcionalidades - módulo não carregado');
            
            results.checks.push({
                item: 'Funcionalidades',
                status: 'error',
                message: 'Módulo não disponível para teste'
            });
        }
        
        // 6. VERIFICAR MENSAGENS NO CONSOLE
        console.log('\n6. 📋 VERIFICANDO LOGS DE INICIALIZAÇÃO...');
        
        // Esta verificação é informativa - não podemos acessar logs antigos
        console.log('ℹ️ Verifique manualmente se houve mensagens de carregamento como:');
        console.log('   "⭐⭐⭐ performance-system.js CARREGADO! ⭐⭐⭐"');
        console.log('   "📊 performance-system.js - Sistema Consolidado"');
        
        results.checks.push({
            item: 'Logs de inicialização',
            status: 'info',
            message: 'Verifique console para mensagens de carregamento'
        });
        
        // 7. RESUMO E RECOMENDAÇÕES
        console.log('\n7. 📊 RESUMO DO DIAGNÓSTICO:');
        
        const errorCount = results.checks.filter(c => c.status === 'error').length;
        const warningCount = results.checks.filter(c => c.status === 'warning').length;
        const successCount = results.checks.filter(c => c.status === 'success').length;
        
        console.log(`✅ Sucessos: ${successCount}`);
        console.log(`⚠️  Avisos: ${warningCount}`);
        console.log(`❌ Erros: ${errorCount}`);
        
        // Determinar status geral
        if (errorCount > 0) {
            results.status = 'error';
            console.log('🔴 PROBLEMAS ENCONTRADOS - performance-system NÃO está funcionando');
            
            // Recomendações específicas
            if (!isLoaded) {
                console.log('\n💡 RECOMENDAÇÕES:');
                console.log('1. Verifique se a URL está correta:');
                console.log(`   ${url}`);
                console.log('2. Adicione manualmente no HTML:');
                console.log(`   <script src="${url}"></script>`);
                console.log('3. Verifique erros no console do navegador');
            }
            
        } else if (warningCount > 0) {
            results.status = 'warning';
            console.log('🟡 AVISOS - Verifique recomendações');
            
        } else {
            results.status = 'success';
            console.log('🟢 TUDO OK! performance-system está funcionando');
            
            if (window.PerformanceSystem) {
                console.log('🚀 PerformanceSystem pronto para uso!');
            }
        }
        
        // Adicionar função de correção automática
        if (!isLoaded && errorCount > 0) {
            console.log('\n🔧 FUNÇÃO DE CORREÇÃO DISPONÍVEL:');
            console.log('Execute: window.fixPerformanceSystem() para carregar manualmente');
            
            if (!window.fixPerformanceSystem) {
                window.fixPerformanceSystem = function() {
                    console.group('🔧 CORREÇÃO DO PERFORMANCE-SYSTEM');
                    console.log('Carregando performance-system.js...');
                    
                    const script = document.createElement('script');
                    script.src = url;
                    script.onload = function() {
                        console.log('✅ performance-system.js carregado!');
                        console.log('📍 PerformanceSystem:', window.PerformanceSystem ? '✅ DISPONÍVEL' : '❌ NÃO');
                        
                        if (window.PerformanceSystem && window.PerformanceSystem.init) {
                            window.PerformanceSystem.init();
                            console.log('🚀 PerformanceSystem inicializado');
                        }
                        
                        alert('✅ PerformanceSystem carregado com sucesso!\n\nRecarregue a página para integração completa.');
                    };
                    
                    script.onerror = function() {
                        console.error('❌ Falha ao carregar performance-system.js');
                        alert('❌ Falha ao carregar performance-system.js\n\nVerifique a URL e conexão.');
                    };
                    
                    document.head.appendChild(script);
                    console.groupEnd();
                };
            }
        }
        
        console.groupEnd();
        
        return results;
    },
    
    // Função de reparo
    fix: function() {
        return window.fixPerformanceSystem ? window.fixPerformanceSystem() : 
            { status: 'no_fix', message: 'Função fixPerformanceSystem não disponível' };
    }
};

// ========== REGISTRAR O TESTE ==========
// Adicione este código onde outros testes são registrados

(function registerPerformanceTest() {
    // Aguardar TestManager estar disponível
    const checkInterval = setInterval(() => {
        if (typeof TestManager !== 'undefined' && TestManager.registerTest) {
            clearInterval(checkInterval);
            
            // Verificar se já existe
            const existingTest = TestManager.getTest ? 
                TestManager.getTest('performance-system-diagnostic') : null;
            
            if (!existingTest) {
                TestManager.registerTest(PerformanceSystemDiagnostic);
                console.log('✅ Teste de diagnóstico do PerformanceSystem registrado');
            }
        }
    }, 500);
    
    // Timeout após 10 segundos
    setTimeout(() => clearInterval(checkInterval), 10000);
})();

// ========== FUNÇÃO DE TESTE RÁPIDO GLOBAL ==========
// Adicionar função global para teste rápido

if (!window.testPerformanceSystem) {
    window.testPerformanceSystem = function() {
        console.group('🧪 TESTE RÁPIDO PERFORMANCE-SYSTEM');
        
        console.log('1. Verificando carregamento...');
        const isLoaded = typeof window.PerformanceSystem !== 'undefined';
        console.log(`   PerformanceSystem: ${isLoaded ? '✅ CARREGADO' : '❌ NÃO CARREGADO'}`);
        
        if (isLoaded) {
            console.log('2. Testando funcionalidades...');
            const ps = window.PerformanceSystem;
            
            // Listar métodos
            const methods = Object.keys(ps).filter(k => typeof ps[k] === 'function');
            console.log(`   Métodos disponíveis: ${methods.length}`);
            
            // Testar quickTest se disponível
            if (typeof ps.quickTest === 'function') {
                try {
                    const result = ps.quickTest();
                    console.log('   ✅ quickTest():', result);
                } catch (e) {
                    console.error('   ❌ quickTest() erro:', e.message);
                }
            }
            
            console.log('3. 🎉 PerformanceSystem está funcionando!');
            
        } else {
            console.log('2. 🔧 Tentando carregar...');
            
            // Carregar manualmente
            const url = 'https://rclessa25-hub.github.io/weberlessa-support/performance/performance-system.js';
            const script = document.createElement('script');
            script.src = url;
            
            script.onload = function() {
                console.log('   ✅ Carregado com sucesso!');
                console.log('   PerformanceSystem agora:', typeof window.PerformanceSystem !== 'undefined');
            };
            
            script.onerror = function() {
                console.error('   ❌ Falha ao carregar');
            };
            
            document.head.appendChild(script);
        }
        
        console.groupEnd();
        
        // Executar diagnóstico completo também
        if (typeof PerformanceSystemDiagnostic.execute === 'function') {
            setTimeout(() => PerformanceSystemDiagnostic.execute(), 1000);
        }
    };
}

// ========== VERIFICAÇÃO AUTOMÁTICA ==========
// Verificar automaticamente após carregamento

setTimeout(() => {
    // Verificar se performance-system deveria estar carregado
    const shouldHavePerformance = document.querySelector('script[src*="performance-system"]') !== null ||
                                 window.location.href.includes('debug=true') ||
                                 window.location.href.includes('performance=true');
    
    if (shouldHavePerformance && typeof window.PerformanceSystem === 'undefined') {
        console.warn('⚠️ PERFORMANCE-SYSTEM NÃO CARREGADO - mas deveria estar');
        console.log('💡 Execute: testPerformanceSystem() para diagnóstico');
        
        // Adicionar alerta visual se em modo debug
        if (window.location.href.includes('debug=true')) {
            const warningDiv = document.createElement('div');
            warningDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: #ff9900;
                color: black;
                padding: 10px;
                border-radius: 5px;
                z-index: 99999;
                font-family: monospace;
                font-size: 12px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                max-width: 300px;
            `;
            warningDiv.innerHTML = `
                ⚠️ <strong>PerformanceSystem não carregado</strong><br>
                <button onclick="testPerformanceSystem()" style="margin-top:5px; padding:3px 8px; background:#333; color:white; border:none; border-radius:3px; cursor:pointer;">
                    🔧 Diagnosticar
                </button>
            `;
            document.body.appendChild(warningDiv);
            
            // Auto-remover após 30 segundos
            setTimeout(() => {
                if (warningDiv.parentNode) {
                    warningDiv.remove();
                }
            }, 30000);
        }
    }
}, 5000);
