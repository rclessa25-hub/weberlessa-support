// weberlessa-support/debug/migration-cleanup.js
// SCRIPT PARA REMOVER CÓDIGO DE PERFORMANCE DO CORE SYSTEM
console.log('🧹 migration-cleanup.js - Limpeza de código migrado');

(function() {
    'use strict';
    
    if (!window.location.search.includes('debug=true')) {
        console.log('🔒 Script de migração só roda em modo debug');
        return;
    }
    
    console.group('🧹 LIMPEZA DE CÓDIGO MIGRADO PARA SUPPORT SYSTEM');
    
    // Lista de funções/variáveis que devem ser removidas do Core
    const migrations = [
        {
            type: 'function',
            name: 'runBenchmarkTests',
            module: 'benchmark.js',
            status: 'migrated',
            action: 'delete'
        },
        {
            type: 'function', 
            name: 'measurePageLoad',
            module: 'benchmark.js',
            status: 'migrated',
            action: 'delete'
        },
        {
            type: 'object',
            name: 'PerformanceCache',
            module: 'optimizer.js',
            status: 'migrated',
            action: 'replace_with_stub'
        },
        {
            type: 'object',
            name: 'SmartCache',
            module: 'optimizer.js',
            status: 'migrated',
            action: 'replace_with_stub'
        },
        {
            type: 'object',
            name: 'PerformanceMonitor',
            module: 'optimizer.js',
            status: 'migrated',
            action: 'replace_with_stub'
        },
        {
            type: 'function',
            name: 'analyzeCoreSystem',
            module: 'core-optimizer.js',
            status: 'migrated',
            action: 'delete'
        },
        {
            type: 'function',
            name: 'optimizeCriticalFunctions',
            module: 'core-optimizer.js',
            status: 'migrated',
            action: 'keep_minimal'
        }
    ];
    
    // Verificar o que está atualmente no Core
    const currentState = migrations.map(migration => {
        const exists = migration.type === 'function' ? 
            typeof window[migration.name] === 'function' :
            window[migration.name] !== undefined;
        
        return {
            ...migration,
            currentlyExists: exists,
            safeToRemove: exists && migration.status === 'migrated'
        };
    });
    
    console.log('📋 Estado atual:', currentState);
    
    // Gerar relatório
    const report = {
        timestamp: new Date().toISOString(),
        totalMigrations: migrations.length,
        currentlyInCore: currentState.filter(item => item.currentlyExists).length,
        safeToRemove: currentState.filter(item => item.safeToRemove).length,
        items: currentState
    };
    
    console.table(report.items.map(item => ({
        Nome: item.name,
        Módulo: item.module,
        Existe: item.currentlyExists ? '✅' : '❌',
        Migrado: item.status === 'migrated' ? '✅' : '❌',
        'Remover?': item.safeToRemove ? '✅' : '⚠️'
    })));
    
    console.log('💡 RECOMENDAÇÕES:');
    
    // Recomendações específicas
    currentState.forEach(item => {
        if (item.safeToRemove) {
            console.log(`🔧 Remover ${item.type} "${item.name}" de ${item.module}`);
        } else if (item.currentlyExists && item.status !== 'migrated') {
            console.log(`⚠️ "${item.name}" ainda não migrado - NÃO REMOVER`);
        }
    });
    
    console.log('');
    console.log('📝 AÇÕES MANUAIS NECESSÁRIAS:');
    console.log('1. Remover arquivos do Core System:');
    console.log('   - benchmark.js (não existe atualmente)');
    console.log('   - core-optimizer.js (remover após confirmação)');
    console.log('   - optimizer.js (manter stub mínimo)');
    console.log('');
    console.log('2. No index.html:');
    console.log('   - Remover referências aos scripts migrados');
    console.log('   - Manter apenas carregamento condicional do Support System');
    console.log('');
    console.log('3. Verificar compatibilidade:');
    console.log('   - Testar todas as funcionalidades após remoção');
    console.log('   - Validar que PerformanceSystem funciona corretamente');
    
    console.groupEnd();
    
    // Salvar relatório
    try {
        localStorage.setItem('migration_cleanup_report', JSON.stringify(report, null, 2));
        console.log('📄 Relatório salvo no localStorage');
    } catch (e) {
        console.warn('⚠️ Não foi possível salvar relatório');
    }
})();
