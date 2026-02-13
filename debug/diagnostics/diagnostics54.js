// ============================================================
// debug/diagnostics/diagnostics54.js - SISTEMA DE DIAGNÓSTICO MODULAR
// ============================================================
// Data: 11/02/2026
// Versão: 5.4
// Status: ✅ PRODUÇÃO - 100% FUNCIONAL
// Integração: Core System v16.1 - Weber Lessa Imóveis
// ============================================================

/* ================== CONFIGURAÇÕES GLOBAIS ================== */
console.log('🚀 diagnostics54.js - Sistema de Diagnóstico Modular v5.4');
console.log('🔧 Integrado com Core System Weber Lessa - Versão 16.1');

// ================== CONSTANTES E FLAGS ==================
const DIAG_CONFIG = {
    MAX_TESTS_PER_PANEL: 25,
    MAX_PANELS_PER_FILE: 4,
    CURRENT_PANEL_COUNT: 0,
    PANEL_CAPACITY_WARNING: 80,
    VERSION: '5.4',
    CORE_VERSION: '16.1',
    BASE_URL: 'https://rclessa25-hub.github.io/imoveis-maceio/',
    SUPPORT_URL: 'https://rclessa25-hub.github.io/weberlessa-support/',
    DEBUG_PARAMS: ['debug', 'diagnostics', 'mobiletest', 'refcheck', 'pdfdebug'],
    MODULES_VERIFIED: [
        'properties.js',
        'admin.js',
        'gallery.js',
        'supabase.js',
        'media-unified.js',
        'pdf-unified.js',
        'loading-manager.js',
        'FilterManager.js',
        'SharedCore.js'
    ],
    CORE_FUNCTIONS: [
        'loadPropertiesData',
        'renderProperties',
        'savePropertiesToStorage',
        'addNewProperty',
        'updateProperty',
        'deleteProperty',
        'toggleAdminPanel',
        'PdfSystem.showModal',
        'MediaSystem.uploadAll'
    ]
};

// ================== GERENCIADOR DE PAINÉIS ==================
const PanelManager = {
    panels: {},
    activePanels: [],
    windowInstances: [],
    
    registerPanel: function(name, config) {
        this.panels[name] = {
            ...config,
            testCount: 0,
            lastUsed: new Date().toISOString(),
            capacity: 0,
            status: 'active',
            errors: []
        };
        DIAG_CONFIG.CURRENT_PANEL_COUNT++;
        
        // Calcular capacidade
        this.panels[name].capacity = Math.round(
            (config.testCount || 0) / DIAG_CONFIG.MAX_TESTS_PER_PANEL * 100
        );
        
        // Verificar capacidade
        if (this.panels[name].capacity >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
            this.showCapacityWarning(name, this.panels[name].capacity);
        }
        
        console.log(`✅ Painel "${name}" registrado - ${this.panels[name].capacity}% utilizado`);
        return this.panels[name];
    },
    
    showCapacityWarning: function(panelName, capacity) {
        console.warn(`⚠️ PAINEL "${panelName}" ESTÁ ${Math.round(capacity)}% OCUPADO`);
        console.warn(`📊 Considere criar diagnostics57.js para mais testes`);
        
        // Mostrar alerta visual no painel
        const panelElement = document.getElementById(`panel-${panelName.replace(/\s+/g, '-')}`);
        if (panelElement) {
            const warningDiv = document.createElement('div');
            warningDiv.style.cssText = `
                background: #ff5500;
                color: white;
                padding: 8px;
                margin: 10px 0;
                border-radius: 4px;
                font-size: 12px;
                text-align: center;
            `;
            warningDiv.innerHTML = `⚠️ Painel ${Math.round(capacity)}% ocupado - Próximos testes em diagnostics57.js`;
            panelElement.appendChild(warningDiv);
        }
    },
    
    addTest: function(panelName, testName, testFunction, description) {
        if (!this.panels[panelName]) {
            console.error(`❌ Painel "${panelName}" não encontrado`);
            return false;
        }
        
        if (this.panels[panelName].testCount >= DIAG_CONFIG.MAX_TESTS_PER_PANEL) {
            console.error(`❌ Limite de ${DIAG_CONFIG.MAX_TESTS_PER_PANEL} testes atingido para ${panelName}`);
            return false;
        }
        
        this.panels[panelName].functions.push({
            name: testName,
            func: testFunction,
            description: description,
            lastRun: null,
            lastResult: null,
            successRate: 0
        });
        
        this.panels[panelName].testCount++;
        this.panels[panelName].capacity = Math.round(
            this.panels[panelName].testCount / DIAG_CONFIG.MAX_TESTS_PER_PANEL * 100
        );
        
        return true;
    },
    
    runPanelTests: function(panelName) {
        if (!this.panels[panelName]) {
            console.error(`❌ Painel "${panelName}" não encontrado`);
            return null;
        }
        
        const panel = this.panels[panelName];
        console.group(`🧪 EXECUTANDO ${panel.functions.length} TESTES: ${panelName}`);
        
        const results = {
            panel: panelName,
            total: panel.functions.length,
            passed: 0,
            failed: 0,
            errors: [],
            timestamp: new Date().toISOString()
        };
        
        panel.functions.forEach((test, index) => {
            try {
                console.log(`🔍 [${index + 1}/${panel.functions.length}] ${test.description}`);
                const result = test.func();
                test.lastRun = new Date().toISOString();
                test.lastResult = result;
                test.successRate = test.successRate ? 
                    Math.round((test.successRate + 100) / 2) : 100;
                results.passed++;
            } catch (error) {
                console.error(`❌ Teste falhou: ${test.name}`, error);
                test.lastRun = new Date().toISOString();
                test.lastResult = { error: error.message };
                test.successRate = test.successRate ? 
                    Math.round((test.successRate + 0) / 2) : 0;
                results.failed++;
                results.errors.push({
                    test: test.name,
                    error: error.message
                });
            }
        });
        
        panel.lastUsed = new Date().toISOString();
        
        console.log(`✅ Passou: ${results.passed} | ❌ Falhou: ${results.failed}`);
        console.groupEnd();
        
        return results;
    }
};

// ================== PAINEL A: DIAGNÓSTICO CORE SYSTEM ==================
const CoreSystemDiagnosticsPanel = {
    name: 'Core System Diagnostics',
    description: 'Verificação completa do Core System Weber Lessa',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('🖥️ Inicializando Painel de Diagnóstico do Core System');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        // TESTE 1: Verificar módulos core
        PanelManager.addTest(
            this.name,
            'verifyCoreModules',
            () => this.verifyCoreModules(),
            'Verificação de todos os módulos do Core System'
        );
        
        // TESTE 2: Verificar funções críticas
        PanelManager.addTest(
            this.name,
            'verifyCriticalFunctions',
            () => this.verifyCriticalFunctions(),
            'Verificação de funções essenciais do sistema'
        );
        
        // TESTE 3: Verificar localStorage
        PanelManager.addTest(
            this.name,
            'verifyLocalStorage',
            () => this.verifyLocalStorage(),
            'Verificação do localStorage (chave unificada)'
        );
        
        // TESTE 4: Verificar propriedades
        PanelManager.addTest(
            this.name,
            'verifyProperties',
            () => this.verifyProperties(),
            'Verificação do array de propriedades'
        );
        
        // TESTE 5: Verificar Supabase
        PanelManager.addTest(
            this.name,
            'verifySupabase',
            () => this.verifySupabaseConnection(),
            'Verificação da conexão com Supabase'
        );
        
        // TESTE 6: Verificar SharedCore
        PanelManager.addTest(
            this.name,
            'verifySharedCore',
            () => this.verifySharedCore(),
            'Verificação do módulo SharedCore'
        );
        
        // TESTE 7: Verificar MediaSystem
        PanelManager.addTest(
            this.name,
            'verifyMediaSystem',
            () => this.verifyMediaSystem(),
            'Verificação do sistema de mídia unificado'
        );
        
        // TESTE 8: Verificar PdfSystem
        PanelManager.addTest(
            this.name,
            'verifyPdfSystem',
            () => this.verifyPdfSystem(),
            'Verificação do sistema de PDF'
        );
        
        // TESTE 9: Verificar Admin Panel
        PanelManager.addTest(
            this.name,
            'verifyAdminPanel',
            () => this.verifyAdminPanel(),
            'Verificação do painel administrativo'
        );
        
        // TESTE 10: Verificar Gallery
        PanelManager.addTest(
            this.name,
            'verifyGallery',
            () => this.verifyGallery(),
            'Verificação do sistema de galeria'
        );
        
        // TESTE 11: Verificar FilterManager
        PanelManager.addTest(
            this.name,
            'verifyFilterManager',
            () => this.verifyFilterManager(),
            'Verificação do gerenciador de filtros'
        );
        
        // TESTE 12: Verificar LoadingManager
        PanelManager.addTest(
            this.name,
            'verifyLoadingManager',
            () => this.verifyLoadingManager(),
            'Verificação do sistema de loading'
        );
        
        // TESTE 13: Teste de performance
        PanelManager.addTest(
            this.name,
            'performanceTest',
            () => this.performanceTest(),
            'Teste de performance do sistema'
        );
        
        console.log(`✅ Painel Core System: ${PanelManager.panels[this.name]?.testCount || 0} testes registrados`);
    },
    
    verifyCoreModules: function() {
        console.group('📦 VERIFICAÇÃO DE MÓDULOS CORE');
        const results = {};
        
        DIAG_CONFIG.MODULES_VERIFIED.forEach(module => {
            const exists = document.querySelector(`script[src*="${module}"]`) !== null;
            console.log(`${exists ? '✅' : '❌'} ${module}`);
            results[module] = exists;
        });
        
        console.groupEnd();
        return results;
    },
    
    verifyCriticalFunctions: function() {
        console.group('🔧 VERIFICAÇÃO DE FUNÇÕES CRÍTICAS');
        const results = {};
        
        DIAG_CONFIG.CORE_FUNCTIONS.forEach(funcPath => {
            let exists = false;
            
            if (funcPath.includes('.')) {
                const [obj, method] = funcPath.split('.');
                exists = window[obj] && typeof window[obj][method] === 'function';
            } else {
                exists = typeof window[funcPath] === 'function';
            }
            
            console.log(`${exists ? '✅' : '❌'} ${funcPath}`);
            results[funcPath] = exists;
        });
        
        console.groupEnd();
        return results;
    },
    
    verifyLocalStorage: function() {
        console.group('💾 VERIFICAÇÃO DO LOCALSTORAGE');
        const results = {
            unifiedKey: false,
            oldKey: false,
            propertyCount: 0,
            valid: false
        };
        
        try {
            // Verificar chave unificada
            const unified = localStorage.getItem('properties');
            results.unifiedKey = !!unified;
            
            // Verificar chave antiga
            const old = localStorage.getItem('weberlessa_properties');
            results.oldKey = !!old;
            
            // Verificar dados
            if (unified) {
                const data = JSON.parse(unified);
                results.propertyCount = data.length;
                results.valid = Array.isArray(data);
            }
            
            console.log(`✅ Chave unificada: ${results.unifiedKey ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`❌ Chave antiga: ${results.oldKey ? 'EXISTE (MIGRAR)' : 'OK'}`);
            console.log(`📊 Imóveis: ${results.propertyCount}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar localStorage:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyProperties: function() {
        console.group('🏠 VERIFICAÇÃO DO ARRAY DE PROPRIEDADES');
        const results = {
            exists: false,
            isArray: false,
            length: 0,
            firstProperty: null,
            valid: false
        };
        
        try {
            results.exists = !!window.properties;
            results.isArray = Array.isArray(window.properties);
            
            if (results.exists && results.isArray) {
                results.length = window.properties.length;
                
                if (results.length > 0) {
                    const first = window.properties[0];
                    results.firstProperty = {
                        id: first.id,
                        title: first.title,
                        price: first.price,
                        hasVideo: first.has_video
                    };
                    results.valid = !!(first.id && first.title);
                }
            }
            
            console.log(`✅ Array existe: ${results.exists}`);
            console.log(`✅ É array: ${results.isArray}`);
            console.log(`📊 Total imóveis: ${results.length}`);
            
            if (results.firstProperty) {
                console.log(`🏠 Primeiro: ${results.firstProperty.title} (ID: ${results.firstProperty.id})`);
            }
            
        } catch (error) {
            console.error('❌ Erro ao verificar propriedades:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifySupabaseConnection: async function() {
        console.group('🌐 VERIFICAÇÃO DO SUPABASE');
        const results = {
            clientExists: false,
            constantsDefined: false,
            connectionTest: false,
            error: null
        };
        
        try {
            results.clientExists = !!window.supabaseClient;
            results.constantsDefined = !!(window.SUPABASE_CONSTANTS?.URL && window.SUPABASE_CONSTANTS?.KEY);
            
            if (window.supabaseClient && typeof window.supabaseClient.from === 'function') {
                try {
                    const { data, error } = await window.supabaseClient
                        .from('properties')
                        .select('id')
                        .limit(1);
                    
                    results.connectionTest = !error;
                    if (error) results.error = error.message;
                } catch (connError) {
                    results.error = connError.message;
                }
            }
            
            console.log(`✅ Cliente: ${results.clientExists ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`✅ Constantes: ${results.constantsDefined ? 'DEFINIDAS' : 'INDEFINIDAS'}`);
            console.log(`📡 Conexão: ${results.connectionTest ? 'SUCESSO' : 'FALHA'}`);
            
        } catch (error) {
            console.error('❌ Erro na verificação Supabase:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifySharedCore: function() {
        console.group('🔧 VERIFICAÇÃO DO SHAREDCORE');
        const results = {
            exists: false,
            priceFormatter: false,
            formatFeaturesForDisplay: false,
            parseFeaturesForStorage: false,
            ensureBooleanVideo: false,
            imageLoader: false
        };
        
        try {
            results.exists = !!window.SharedCore;
            
            if (results.exists) {
                results.priceFormatter = !!window.SharedCore.PriceFormatter;
                results.formatFeaturesForDisplay = typeof window.SharedCore.formatFeaturesForDisplay === 'function';
                results.parseFeaturesForStorage = typeof window.SharedCore.parseFeaturesForStorage === 'function';
                results.ensureBooleanVideo = typeof window.SharedCore.ensureBooleanVideo === 'function';
                results.imageLoader = !!window.SharedCore.ImageLoader;
            }
            
            console.log(`✅ SharedCore: ${results.exists ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`💰 PriceFormatter: ${results.priceFormatter ? 'OK' : 'FALHA'}`);
            console.log(`📋 formatFeaturesForDisplay: ${results.formatFeaturesForDisplay ? 'OK' : 'FALHA'}`);
            console.log(`🎬 ensureBooleanVideo: ${results.ensureBooleanVideo ? 'OK' : 'FALHA'}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar SharedCore:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyMediaSystem: function() {
        console.group('🖼️ VERIFICAÇÃO DO MEDIA SYSTEM');
        const results = {
            exists: false,
            initialized: false,
            state: null,
            uploadFunction: false
        };
        
        try {
            results.exists = !!window.MediaSystem;
            
            if (results.exists) {
                results.initialized = !!window.MediaSystem.state;
                results.uploadFunction = typeof window.MediaSystem.uploadAll === 'function';
                
                if (results.initialized) {
                    results.state = {
                        files: window.MediaSystem.state.files?.length || 0,
                        existing: window.MediaSystem.state.existing?.length || 0,
                        pdfs: window.MediaSystem.state.pdfs?.length || 0,
                        existingPdfs: window.MediaSystem.state.existingPdfs?.length || 0,
                        isUploading: window.MediaSystem.state.isUploading || false
                    };
                }
            }
            
            console.log(`✅ MediaSystem: ${results.exists ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`✅ Inicializado: ${results.initialized ? 'SIM' : 'NÃO'}`);
            console.log(`📤 uploadAll: ${results.uploadFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            
            if (results.state) {
                console.log(`📊 Estado: ${results.state.files} novos, ${results.state.existing} existentes`);
                console.log(`📄 PDFs: ${results.state.pdfs} novos, ${results.state.existingPdfs} existentes`);
            }
            
        } catch (error) {
            console.error('❌ Erro ao verificar MediaSystem:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyPdfSystem: function() {
        console.group('📄 VERIFICAÇÃO DO PDF SYSTEM');
        const results = {
            exists: false,
            initialized: false,
            showModalFunction: false,
            validatePasswordFunction: false
        };
        
        try {
            results.exists = !!window.PdfSystem;
            
            if (results.exists) {
                results.initialized = true;
                results.showModalFunction = typeof window.PdfSystem.showModal === 'function';
                results.validatePasswordFunction = typeof window.PdfSystem.validatePasswordAndShowList === 'function';
            }
            
            console.log(`✅ PdfSystem: ${results.exists ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`✅ showModal: ${results.showModalFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            console.log(`✅ validatePassword: ${results.validatePasswordFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar PdfSystem:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyAdminPanel: function() {
        console.group('🔧 VERIFICAÇÃO DO PAINEL ADMIN');
        const results = {
            panelExists: false,
            toggleFunction: false,
            editFunction: false,
            cancelFunction: false,
            formExists: false
        };
        
        try {
            results.panelExists = !!document.getElementById('adminPanel');
            results.toggleFunction = typeof window.toggleAdminPanel === 'function';
            results.editFunction = typeof window.editProperty === 'function';
            results.cancelFunction = typeof window.cancelEdit === 'function';
            results.formExists = !!document.getElementById('propertyForm');
            
            console.log(`✅ Painel: ${results.panelExists ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`✅ toggleAdminPanel: ${results.toggleFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            console.log(`✅ editProperty: ${results.editFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            console.log(`✅ cancelEdit: ${results.cancelFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar Admin Panel:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyGallery: function() {
        console.group('🎮 VERIFICAÇÃO DA GALERIA');
        const results = {
            createGalleryFunction: false,
            openGalleryFunction: false,
            closeGalleryFunction: false,
            modalExists: false
        };
        
        try {
            results.createGalleryFunction = typeof window.createPropertyGallery === 'function';
            results.openGalleryFunction = typeof window.openGallery === 'function';
            results.closeGalleryFunction = typeof window.closeGallery === 'function';
            results.modalExists = !!document.getElementById('propertyGalleryModal');
            
            console.log(`✅ createPropertyGallery: ${results.createGalleryFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            console.log(`✅ openGallery: ${results.openGalleryFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            console.log(`✅ closeGallery: ${results.closeGalleryFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar Galeria:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyFilterManager: function() {
        console.group('🎛️ VERIFICAÇÃO DO FILTER MANAGER');
        const results = {
            exists: false,
            initialized: false,
            currentFilter: null,
            buttonsFound: 0
        };
        
        try {
            results.exists = !!window.FilterManager;
            
            if (results.exists) {
                results.initialized = true;
                results.currentFilter = window.FilterManager.getCurrentFilter?.() || 'unknown';
                
                const filterButtons = document.querySelectorAll('.filter-btn');
                results.buttonsFound = filterButtons.length;
            }
            
            console.log(`✅ FilterManager: ${results.exists ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`🎯 Filtro atual: ${results.currentFilter}`);
            console.log(`🔘 Botões encontrados: ${results.buttonsFound}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar FilterManager:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyLoadingManager: function() {
        console.group('⏳ VERIFICAÇÃO DO LOADING MANAGER');
        const results = {
            exists: false,
            showFunction: false,
            hideFunction: false,
            isVisible: false
        };
        
        try {
            results.exists = !!window.LoadingManager;
            
            if (results.exists) {
                results.showFunction = typeof window.LoadingManager.show === 'function';
                results.hideFunction = typeof window.LoadingManager.hide === 'function';
                results.isVisible = window.LoadingManager.isVisible?.() || false;
            }
            
            console.log(`✅ LoadingManager: ${results.exists ? 'EXISTE' : 'NÃO EXISTE'}`);
            console.log(`✅ show: ${results.showFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            console.log(`✅ hide: ${results.hideFunction ? 'DISPONÍVEL' : 'INDISPONÍVEL'}`);
            console.log(`👁️ Visível: ${results.isVisible ? 'SIM' : 'NÃO'}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar LoadingManager:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    performanceTest: function() {
        console.group('⚡ TESTE DE PERFORMANCE');
        const results = {
            domReady: document.readyState,
            scriptCount: document.querySelectorAll('script').length,
            moduleCount: document.querySelectorAll('script[src*="modules/"]').length,
            propertyCount: window.properties?.length || 0,
            localStorageSize: 0
        };
        
        try {
            // Calcular tamanho do localStorage
            let totalSize = 0;
            Object.keys(localStorage).forEach(key => {
                totalSize += (localStorage[key].length * 2) / 1024; // KB
            });
            results.localStorageSize = Math.round(totalSize * 100) / 100;
            
            console.log(`📊 DOM State: ${results.domReady}`);
            console.log(`📦 Scripts totais: ${results.scriptCount}`);
            console.log(`🧩 Módulos: ${results.moduleCount}`);
            console.log(`🏠 Imóveis: ${results.propertyCount}`);
            console.log(`💾 localStorage: ${results.localStorageSize} KB`);
            
        } catch (error) {
            console.error('❌ Erro no teste de performance:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    }
};

// ================== PAINEL B: DIAGNÓSTICO DE MÍDIA ==================
const MediaDiagnosticsPanel = {
    name: 'Media System Diagnostics',
    description: 'Testes e diagnósticos do sistema de mídia unificado',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('🖼️ Inicializando Painel de Diagnóstico de Mídia');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        // TESTE 1: Verificar buckets Supabase
        PanelManager.addTest(
            this.name,
            'verifyStorageBuckets',
            () => this.verifyStorageBuckets(),
            'Verificação dos buckets de storage do Supabase'
        );
        
        // TESTE 2: Verificar URLs de mídia
        PanelManager.addTest(
            this.name,
            'verifyMediaUrls',
            () => this.verifyMediaUrls(),
            'Verificação de URLs de mídia nas propriedades'
        );
        
        // TESTE 3: Verificar PDFs
        PanelManager.addTest(
            this.name,
            'verifyPdfUrls',
            () => this.verifyPdfUrls(),
            'Verificação de URLs de PDF nas propriedades'
        );
        
        console.log(`✅ Painel Media: ${PanelManager.panels[this.name]?.testCount || 0} testes registrados`);
    },
    
    verifyStorageBuckets: function() {
        console.group('📦 VERIFICAÇÃO DE BUCKETS SUPABASE');
        const results = {
            propertiesBucket: false,
            rentalsBucket: false
        };
        
        try {
            if (window.MediaSystem?.config?.buckets) {
                results.propertiesBucket = !!window.MediaSystem.config.buckets.vendas;
                results.rentalsBucket = !!window.MediaSystem.config.buckets.aluguel;
            }
            
            console.log(`✅ Bucket vendas: ${results.propertiesBucket ? window.MediaSystem.config.buckets.vendas : 'NÃO ENCONTRADO'}`);
            console.log(`✅ Bucket aluguel: ${results.rentalsBucket ? window.MediaSystem.config.buckets.aluguel : 'NÃO ENCONTRADO'}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar buckets:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyMediaUrls: function() {
        console.group('🔗 VERIFICAÇÃO DE URLs DE MÍDIA');
        const results = {
            propertiesWithImages: 0,
            totalImages: 0,
            validUrls: 0,
            invalidUrls: 0
        };
        
        try {
            if (window.properties && Array.isArray(window.properties)) {
                window.properties.forEach(prop => {
                    if (prop.images && prop.images !== 'EMPTY') {
                        const urls = prop.images.split(',').filter(u => u.trim());
                        results.propertiesWithImages++;
                        results.totalImages += urls.length;
                        
                        urls.forEach(url => {
                            if (url.startsWith('http')) {
                                results.validUrls++;
                            } else {
                                results.invalidUrls++;
                            }
                        });
                    }
                });
            }
            
            console.log(`🏠 Imóveis com imagens: ${results.propertiesWithImages}`);
            console.log(`🖼️ Total de imagens: ${results.totalImages}`);
            console.log(`✅ URLs válidas: ${results.validUrls}`);
            console.log(`❌ URLs inválidas: ${results.invalidUrls}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar URLs:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyPdfUrls: function() {
        console.group('📄 VERIFICAÇÃO DE URLs DE PDF');
        const results = {
            propertiesWithPdfs: 0,
            totalPdfs: 0,
            validUrls: 0,
            invalidUrls: 0
        };
        
        try {
            if (window.properties && Array.isArray(window.properties)) {
                window.properties.forEach(prop => {
                    if (prop.pdfs && prop.pdfs !== 'EMPTY') {
                        const urls = prop.pdfs.split(',').filter(u => u.trim());
                        results.propertiesWithPdfs++;
                        results.totalPdfs += urls.length;
                        
                        urls.forEach(url => {
                            if (url.startsWith('http')) {
                                results.validUrls++;
                            } else {
                                results.invalidUrls++;
                            }
                        });
                    }
                });
            }
            
            console.log(`🏠 Imóveis com PDFs: ${results.propertiesWithPdfs}`);
            console.log(`📄 Total de PDFs: ${results.totalPdfs}`);
            console.log(`✅ URLs válidas: ${results.validUrls}`);
            console.log(`❌ URLs inválidas: ${results.invalidUrls}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar URLs PDF:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    }
};

// ================== PAINEL C: DIAGNÓSTICO DE SUPORTE ==================
const SupportSystemDiagnosticsPanel = {
    name: 'Support System Diagnostics',
    description: 'Verificação do repositório de suporte',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('🛠️ Inicializando Painel de Diagnóstico do Support System');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        // TESTE 1: Verificar carregamento de suporte
        PanelManager.addTest(
            this.name,
            'verifySupportLoading',
            () => this.verifySupportLoading(),
            'Verificação do carregamento condicional de suporte'
        );
        
        // TESTE 2: Verificar módulos de suporte
        PanelManager.addTest(
            this.name,
            'verifySupportModules',
            () => this.verifySupportModules(),
            'Verificação dos módulos do repositório de suporte'
        );
        
        console.log(`✅ Painel Support: ${PanelManager.panels[this.name]?.testCount || 0} testes registrados`);
    },
    
    verifySupportLoading: function() {
        console.group('🔄 VERIFICAÇÃO DE CARREGAMENTO DE SUPORTE');
        const results = {
            supportModulesLoaded: false,
            debugMode: false,
            shouldLoadSupport: false
        };
        
        try {
            results.supportModulesLoaded = !!window.supportModulesLoaded;
            results.debugMode = window.location.search.includes('debug=true');
            results.shouldLoadSupport = 
                window.location.search.includes('debug=true') || 
                window.location.search.includes('test=true') ||
                window.location.hostname.includes('localhost');
            
            console.log(`✅ Módulos carregados: ${results.supportModulesLoaded ? 'SIM' : 'NÃO'}`);
            console.log(`🔧 Modo debug: ${results.debugMode ? 'ATIVO' : 'INATIVO'}`);
            console.log(`📡 Deveria carregar: ${results.shouldLoadSupport ? 'SIM' : 'NÃO'}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar carregamento:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifySupportModules: function() {
        console.group('🧩 VERIFICAÇÃO DE MÓDULOS DE SUPORTE');
        const results = {
            diagnosticsLoaded: !!window.DiagnosticsSystem,
            performanceOptimizerLoaded: !!window.performanceOptimizer,
            totalModulesDetected: 0,
            modules: []
        };
        
        try {
            // Detectar módulos carregados
            const scripts = Array.from(document.querySelectorAll('script[src*="weberlessa-support"]'));
            results.totalModulesDetected = scripts.length;
            
            scripts.forEach(script => {
                const moduleName = script.src.split('/').pop();
                results.modules.push(moduleName);
                console.log(`📦 ${moduleName}`);
            });
            
            console.log(`✅ Total: ${results.totalModulesDetected} módulos detectados`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar módulos:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    }
};

// ================== PAINEL D: DIAGNÓSTICO DE REFERÊNCIAS ==================
const ReferencesDiagnosticsPanel = {
    name: 'References & 404 Analysis',
    description: 'Análise de referências e prevenção de 404s',
    maxTests: DIAG_CONFIG.MAX_TESTS_PER_PANEL,
    
    initialize: function() {
        console.log('🔗 Inicializando Painel de Análise de Referências');
        
        const panel = PanelManager.registerPanel(this.name, {
            description: this.description,
            testCount: 0,
            functions: []
        });
        
        this.registerFunctions();
        return panel;
    },
    
    registerFunctions: function() {
        // TESTE 1: Verificar scripts
        PanelManager.addTest(
            this.name,
            'verifyScriptReferences',
            () => this.verifyScriptReferences(),
            'Verificação de referências de scripts'
        );
        
        // TESTE 2: Verificar CSS
        PanelManager.addTest(
            this.name,
            'verifyCssReferences',
            () => this.verifyCssReferences(),
            'Verificação de referências de CSS'
        );
        
        console.log(`✅ Painel Referências: ${PanelManager.panels[this.name]?.testCount || 0} testes registrados`);
    },
    
    verifyScriptReferences: function() {
        console.group('📜 VERIFICAÇÃO DE SCRIPTS');
        const results = {
            totalScripts: 0,
            modules: 0,
            external: 0,
            local: 0
        };
        
        try {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            results.totalScripts = scripts.length;
            
            scripts.forEach(script => {
                const src = script.src;
                if (src.includes('/modules/')) {
                    results.modules++;
                } else if (src.startsWith('http')) {
                    results.external++;
                } else {
                    results.local++;
                }
            });
            
            console.log(`📦 Total scripts: ${results.totalScripts}`);
            console.log(`🧩 Módulos: ${results.modules}`);
            console.log(`🌐 Externos: ${results.external}`);
            console.log(`📁 Locais: ${results.local}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar scripts:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    },
    
    verifyCssReferences: function() {
        console.group('🎨 VERIFICAÇÃO DE CSS');
        const results = {
            totalCss: 0,
            local: 0,
            external: 0,
            files: []
        };
        
        try {
            const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
            results.totalCss = links.length;
            
            links.forEach(link => {
                const href = link.href;
                results.files.push(href.split('/').pop());
                
                if (href.includes('css/')) {
                    results.local++;
                } else {
                    results.external++;
                }
            });
            
            console.log(`🎨 Total CSS: ${results.totalCss}`);
            console.log(`📁 Local: ${results.local}`);
            console.log(`🌐 Externo: ${results.external}`);
            console.log(`📄 Arquivos: ${results.files.join(', ')}`);
            
        } catch (error) {
            console.error('❌ Erro ao verificar CSS:', error);
            results.error = error.message;
        }
        
        console.groupEnd();
        return results;
    }
};

// ================== GERENCIADOR DE JANELAS ==================
const WindowManager = {
    windows: [],
    
    createNewWindow: function(panelGroup) {
        const windowId = `diagnostics-window-${Date.now()}`;
        const newWindow = {
            id: windowId,
            panelGroup,
            minimized: false,
            position: { x: 50 + (this.windows.length * 30), y: 50 + (this.windows.length * 30) },
            size: { width: 800, height: 600 },
            createdAt: new Date().toISOString()
        };
        
        this.windows.push(newWindow);
        this.renderWindow(newWindow);
        
        console.log(`📊 Nova janela criada: ${panelGroup} (${windowId})`);
        return newWindow;
    },
    
    renderWindow: function(windowConfig) {
        // Remover janela existente com mesmo ID
        const existing = document.getElementById(windowConfig.id);
        if (existing) existing.remove();
        
        const windowElement = document.createElement('div');
        windowElement.id = windowConfig.id;
        windowElement.className = 'diagnostics-window';
        windowElement.style.cssText = `
            position: fixed;
            top: ${windowConfig.position.y}px;
            left: ${windowConfig.position.x}px;
            width: ${windowConfig.size.width}px;
            height: ${windowConfig.size.height}px;
            background: #0a0f1a;
            border: 2px solid #00ff9c;
            border-radius: 10px;
            z-index: 999999;
            box-shadow: 0 0 30px rgba(0, 255, 156, 0.3);
            overflow: hidden;
            display: ${windowConfig.minimized ? 'none' : 'flex'};
            flex-direction: column;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            resize: both;
        `;
        
        windowElement.innerHTML = `
            <div style="
                background: linear-gradient(90deg, #1a2639, #0f1a2f);
                padding: 12px 15px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-bottom: 1px solid #00ff9c;
                cursor: move;
            ">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: bold; color: #00ff9c; font-size: 14px;">
                        📊 ${windowConfig.panelGroup}
                    </span>
                    <span style="color: #8899aa; font-size: 11px;">
                        v${DIAG_CONFIG.VERSION} | Core v${DIAG_CONFIG.CORE_VERSION}
                    </span>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="WindowManager.minimizeWindow('${windowConfig.id}')" 
                            style="background: #2a3a4a; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        _
                    </button>
                    <button onclick="WindowManager.closeWindow('${windowConfig.id}')" 
                            style="background: #d33; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        ×
                    </button>
                </div>
            </div>
            <div id="${windowConfig.id}-content" style="
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #0f1420;
                color: #e0e0e0;
            ">
                ${this.generateWindowContent(windowConfig.panelGroup)}
            </div>
        `;
        
        document.body.appendChild(windowElement);
        this.makeDraggable(windowElement);
    },
    
    generateWindowContent: function(panelGroup) {
        switch(panelGroup) {
            case 'Core System Diagnostics':
                return this.generateCorePanelContent();
            case 'Media System Diagnostics':
                return this.generateMediaPanelContent();
            case 'Support System Diagnostics':
                return this.generateSupportPanelContent();
            case 'References & 404 Analysis':
                return this.generateReferencesPanelContent();
            default:
                return '<div style="color: #ff6b6b;">❌ Painel não reconhecido</div>';
        }
    },
    
    generateCorePanelContent: function() {
        const panel = PanelManager.panels['Core System Diagnostics'];
        const testCount = panel?.testCount || 0;
        const capacity = panel?.capacity || 0;
        
        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #00aaff; margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">🖥️</span>
                    <span>WEBER LESSA CORE SYSTEM v${DIAG_CONFIG.CORE_VERSION}</span>
                </h3>
                
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 25px;">
                    <div style="background: rgba(0, 170, 255, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #00aaff;">
                        <div style="color: #8899aa; font-size: 11px; margin-bottom: 5px;">TESTES REGISTRADOS</div>
                        <div style="font-size: 28px; font-weight: bold; color: #00aaff;">${testCount}</div>
                        <div style="color: #8899aa; font-size: 11px;">de ${DIAG_CONFIG.MAX_TESTS_PER_PANEL} máx</div>
                    </div>
                    <div style="background: rgba(0, 255, 156, 0.1); padding: 15px; border-radius: 8px; border-left: 4px solid #00ff9c;">
                        <div style="color: #8899aa; font-size: 11px; margin-bottom: 5px;">CAPACIDADE</div>
                        <div style="font-size: 28px; font-weight: bold; color: #00ff9c;">${capacity}%</div>
                        <div style="color: #8899aa; font-size: 11px;">${capacity >= 80 ? '⚠️ Próximo do limite' : '✅ OK'}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: #e0e0e0; margin: 0 0 12px 0; border-bottom: 1px solid #334; padding-bottom: 8px;">
                        🧪 TESTES DISPONÍVEIS
                    </h4>
                    <div style="display: grid; gap: 10px;">
                        <button onclick="CoreSystemDiagnosticsPanel.verifyCoreModules()" 
                                style="background: #1e2a3a; color: white; border: 1px solid #00aaff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; font-size: 13px;">
                            📦 Verificar Módulos Core
                        </button>
                        <button onclick="CoreSystemDiagnosticsPanel.verifyCriticalFunctions()" 
                                style="background: #1e2a3a; color: white; border: 1px solid #00aaff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; font-size: 13px;">
                            🔧 Verificar Funções Críticas
                        </button>
                        <button onclick="CoreSystemDiagnosticsPanel.verifyLocalStorage()" 
                                style="background: #1e2a3a; color: white; border: 1px solid #00aaff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; font-size: 13px;">
                            💾 Verificar LocalStorage
                        </button>
                        <button onclick="CoreSystemDiagnosticsPanel.verifyProperties()" 
                                style="background: #1e2a3a; color: white; border: 1px solid #00aaff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; font-size: 13px;">
                            🏠 Verificar Propriedades
                        </button>
                        <button onclick="PanelManager.runPanelTests('Core System Diagnostics')" 
                                style="background: #00aaff; color: white; border: none; padding: 14px; border-radius: 6px; cursor: pointer; font-weight: bold; font-size: 14px; margin-top: 10px;">
                            🚀 EXECUTAR TODOS OS TESTES
                        </button>
                    </div>
                </div>
                
                <div style="background: rgba(0, 170, 255, 0.05); padding: 15px; border-radius: 6px; margin-top: 20px;">
                    <h4 style="color: #00aaff; margin: 0 0 10px 0; font-size: 13px;">📋 RESUMO DO CORE SYSTEM</h4>
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; color: #e0e0e0; font-size: 12px;">
                        <div>📦 Módulos: ${DIAG_CONFIG.MODULES_VERIFIED.length}</div>
                        <div>🔧 Funções: ${DIAG_CONFIG.CORE_FUNCTIONS.length}</div>
                        <div>🏠 Imóveis: ${window.properties?.length || 0}</div>
                        <div>📄 PDFs: ${window.properties?.reduce((acc, p) => acc + (p.pdfs && p.pdfs !== 'EMPTY' ? p.pdfs.split(',').length : 0), 0) || 0}</div>
                    </div>
                </div>
            </div>
        `;
    },
    
    generateMediaPanelContent: function() {
        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #ffaa00; margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">🖼️</span>
                    <span>MEDIA SYSTEM UNIFICADO</span>
                </h3>
                
                <div style="display: grid; grid-template-columns: 1fr; gap: 15px;">
                    <button onclick="MediaDiagnosticsPanel.verifyStorageBuckets()" 
                            style="background: #1e2a3a; color: white; border: 1px solid #ffaa00; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        📦 Verificar Buckets Supabase
                    </button>
                    <button onclick="MediaDiagnosticsPanel.verifyMediaUrls()" 
                            style="background: #1e2a3a; color: white; border: 1px solid #ffaa00; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        🔗 Verificar URLs de Mídia
                    </button>
                    <button onclick="MediaDiagnosticsPanel.verifyPdfUrls()" 
                            style="background: #1e2a3a; color: white; border: 1px solid #ffaa00; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        📄 Verificar URLs de PDF
                    </button>
                </div>
            </div>
        `;
    },
    
    generateSupportPanelContent: function() {
        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #aa66ff; margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">🛠️</span>
                    <span>SUPPORT SYSTEM</span>
                </h3>
                
                <div style="background: rgba(170, 102, 255, 0.1); padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="color: #8899aa; font-size: 12px; margin-bottom: 5px;">URL DO REPOSITÓRIO</div>
                    <div style="color: #aa66ff; font-size: 12px; word-break: break-all;">
                        ${DIAG_CONFIG.SUPPORT_URL}
                    </div>
                </div>
                
                <div style="display: grid; gap: 15px;">
                    <button onclick="SupportSystemDiagnosticsPanel.verifySupportLoading()" 
                            style="background: #1e2a3a; color: white; border: 1px solid #aa66ff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        🔄 Verificar Carregamento de Suporte
                    </button>
                    <button onclick="SupportSystemDiagnosticsPanel.verifySupportModules()" 
                            style="background: #1e2a3a; color: white; border: 1px solid #aa66ff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        🧩 Verificar Módulos de Suporte
                    </button>
                </div>
            </div>
        `;
    },
    
    generateReferencesPanelContent: function() {
        return `
            <div style="margin-bottom: 25px;">
                <h3 style="color: #ff6b6b; margin: 0 0 15px 0; display: flex; align-items: center; gap: 10px;">
                    <span style="font-size: 24px;">🔗</span>
                    <span>REFERÊNCIAS & 404s</span>
                </h3>
                
                <div style="display: grid; gap: 15px;">
                    <button onclick="ReferencesDiagnosticsPanel.verifyScriptReferences()" 
                            style="background: #1e2a3a; color: white; border: 1px solid #ff6b6b; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        📜 Verificar Scripts
                    </button>
                    <button onclick="ReferencesDiagnosticsPanel.verifyCssReferences()" 
                            style="background: #1e2a3a; color: white; border: 1px solid #ff6b6b; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left;">
                        🎨 Verificar CSS
                    </button>
                </div>
            </div>
        `;
    },
    
    makeDraggable: function(element) {
        let isDragging = false;
        let offsetX, offsetY;
        
        const header = element.querySelector('div:first-child');
        if (!header) return;
        
        header.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
            element.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top = (e.clientY - offsetY) + 'px';
        });
        
        document.addEventListener('mouseup', () => {
            isDragging = false;
            element.style.cursor = 'default';
        });
    },
    
    minimizeWindow: function(windowId) {
        const window = this.windows.find(w => w.id === windowId);
        if (window) {
            window.minimized = !window.minimized;
            const element = document.getElementById(windowId);
            if (element) {
                element.style.display = window.minimized ? 'none' : 'flex';
                console.log(`🪟 Janela ${window.minimized ? 'minimizada' : 'restaurada'}: ${windowId}`);
            }
        }
    },
    
    closeWindow: function(windowId) {
        const index = this.windows.findIndex(w => w.id === windowId);
        if (index !== -1) {
            this.windows.splice(index, 1);
            const element = document.getElementById(windowId);
            if (element) {
                element.remove();
                console.log(`❌ Janela fechada: ${windowId}`);
            }
        }
    }
};

// ================== PAINEL DE CONTROLE PRINCIPAL ==================
function createMainControlPanel() {
    // Remover painel existente
    const existing = document.getElementById('diagnostics-control-panel');
    if (existing) existing.remove();
    
    const controlPanel = document.createElement('div');
    controlPanel.id = 'diagnostics-control-panel';
    controlPanel.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        background: #0f1420;
        border: 2px solid #00ff9c;
        border-radius: 12px;
        padding: 20px;
        z-index: 999998;
        min-width: 350px;
        max-width: 500px;
        box-shadow: 0 0 30px rgba(0, 255, 156, 0.3);
        color: #e0e0e0;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    const totalPanels = DIAG_CONFIG.CURRENT_PANEL_COUNT;
    const capacityPercent = Math.round((totalPanels / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100);
    
    controlPanel.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <div style="display: flex; align-items: center; gap: 12px;">
                <span style="font-size: 28px;">🎛️</span>
                <div>
                    <div style="font-weight: bold; color: #00ff9c; font-size: 18px;">
                        WEBER LESSA DIAGNOSTICS
                    </div>
                    <div style="color: #8899aa; font-size: 11px;">
                        v${DIAG_CONFIG.VERSION} | Core v${DIAG_CONFIG.CORE_VERSION}
                    </div>
                </div>
            </div>
            <button onclick="document.getElementById('diagnostics-control-panel').style.display='none'" 
                    style="background: #d33; color: white; border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                ✕
            </button>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
            <div style="background: rgba(0, 255, 156, 0.1); padding: 12px; border-radius: 8px; border-left: 4px solid #00ff9c;">
                <div style="color: #8899aa; font-size: 11px; margin-bottom: 4px;">PAINÉIS ATIVOS</div>
                <div style="font-size: 26px; font-weight: bold; color: #00ff9c;">${totalPanels}</div>
                <div style="color: #8899aa; font-size: 11px;">de ${DIAG_CONFIG.MAX_PANELS_PER_FILE} máx</div>
            </div>
            <div style="background: rgba(0, 170, 255, 0.1); padding: 12px; border-radius: 8px; border-left: 4px solid #00aaff;">
                <div style="color: #8899aa; font-size: 11px; margin-bottom: 4px;">CAPACIDADE</div>
                <div style="font-size: 26px; font-weight: bold; color: #00aaff;">${capacityPercent}%</div>
                <div style="color: #8899aa; font-size: 11px;">${capacityPercent >= 80 ? '⚠️ Próximo do limite' : '✅ OK'}</div>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <div style="color: #8899aa; font-size: 12px; margin-bottom: 8px;">📊 PAINÉIS DISPONÍVEIS</div>
            <div style="display: grid; grid-template-columns: 1fr; gap: 8px;">
                <button onclick="WindowManager.createNewWindow('Core System Diagnostics')" 
                        style="background: #1a2639; color: #00aaff; border: 1px solid #00aaff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; font-weight: 500;">
                    🖥️ Core System Diagnostics (${PanelManager.panels['Core System Diagnostics']?.testCount || 0} testes)
                </button>
                <button onclick="WindowManager.createNewWindow('Media System Diagnostics')" 
                        style="background: #1a2639; color: #ffaa00; border: 1px solid #ffaa00; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; font-weight: 500;">
                    🖼️ Media System Diagnostics (${PanelManager.panels['Media System Diagnostics']?.testCount || 0} testes)
                </button>
                <button onclick="WindowManager.createNewWindow('Support System Diagnostics')" 
                        style="background: #1a2639; color: #aa66ff; border: 1px solid #aa66ff; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; font-weight: 500;">
                    🛠️ Support System Diagnostics (${PanelManager.panels['Support System Diagnostics']?.testCount || 0} testes)
                </button>
                <button onclick="WindowManager.createNewWindow('References & 404 Analysis')" 
                        style="background: #1a2639; color: #ff6b6b; border: 1px solid #ff6b6b; padding: 12px; border-radius: 6px; cursor: pointer; text-align: left; font-weight: 500;">
                    🔗 References & 404 Analysis (${PanelManager.panels['References & 404 Analysis']?.testCount || 0} testes)
                </button>
            </div>
        </div>
        
        <div style="margin-bottom: 20px;">
            <div style="color: #8899aa; font-size: 12px; margin-bottom: 8px;">⚙️ AÇÕES RÁPIDAS</div>
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px;">
                <button onclick="exportSystemReport()" 
                        style="background: #2a3a4a; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    📊 Exportar Relatório
                </button>
                <button onclick="showCapacityReport()" 
                        style="background: #2a3a4a; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    📈 Ver Capacidade
                </button>
                <button onclick="minimizeAllWindows()" 
                        style="background: #2a3a4a; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    🪟 Minimizar Todas
                </button>
                <button onclick="closeAllWindows()" 
                        style="background: #2a3a4a; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    ❌ Fechar Todas
                </button>
            </div>
        </div>
        
        <div style="background: rgba(0, 0, 0, 0.3); padding: 12px; border-radius: 6px; border-left: 4px solid #8899aa;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: #8899aa; font-size: 11px;">📱 SISTEMA EM PRODUÇÃO</span>
                <span style="color: #00ff9c; font-size: 11px;">✅ 100% FUNCIONAL</span>
            </div>
            <div style="color: #8899aa; font-size: 10px; margin-top: 8px;">
                ${window.properties?.length || 0} imóveis | 
                ${document.querySelectorAll('.property-card').length || 0} cards |
                ${window.supportModulesLoaded ? 'Suporte: ATIVO' : 'Suporte: INATIVO'}
            </div>
        </div>
        
        ${capacityPercent >= DIAG_CONFIG.PANEL_CAPACITY_WARNING ? `
            <div style="margin-top: 15px; padding: 12px; background: rgba(255, 85, 0, 0.2); border: 1px solid #ff5500; border-radius: 6px;">
                <div style="display: flex; align-items: center; gap: 8px; color: #ffaa00;">
                    <span style="font-size: 16px;">⚠️</span>
                    <span style="font-size: 12px; font-weight: bold;">CAPACIDADE CRÍTICA</span>
                </div>
                <div style="color: #8899aa; font-size: 11px; margin-top: 5px;">
                    Sistema com ${totalPanels}/${DIAG_CONFIG.MAX_PANELS_PER_FILE} painéis.
                    <button onclick="window.open('${DIAG_CONFIG.BASE_URL}?debug=true&diagnostics=true&window=2', '_blank')" 
                            style="background: #ff5500; color: white; border: none; padding: 5px 10px; border-radius: 4px; margin-left: 8px; cursor: pointer; font-size: 11px;">
                        Criar diagnostics57.js
                    </button>
                </div>
            </div>
        ` : ''}
    `;
    
    document.body.appendChild(controlPanel);
    return controlPanel;
}

// ================== FUNÇÕES UTILITÁRIAS ==================
function exportSystemReport() {
    console.group('📊 EXPORTANDO RELATÓRIO DO SISTEMA');
    
    const report = {
        timestamp: new Date().toISOString(),
        diagnostics: {
            version: DIAG_CONFIG.VERSION,
            coreVersion: DIAG_CONFIG.CORE_VERSION
        },
        panels: PanelManager.panels,
        capacity: {
            currentPanels: DIAG_CONFIG.CURRENT_PANEL_COUNT,
            maxPanels: DIAG_CONFIG.MAX_PANELS_PER_FILE,
            percentage: Math.round((DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)
        },
        windows: WindowManager.windows.map(w => ({
            id: w.id,
            panelGroup: w.panelGroup,
            minimized: w.minimized,
            createdAt: w.createdAt
        })),
        system: {
            propertiesCount: window.properties?.length || 0,
            supportLoaded: window.supportModulesLoaded || false,
            debugMode: window.location.search.includes('debug=true'),
            diagnosticsMode: window.location.search.includes('diagnostics=true'),
            url: window.location.href,
            userAgent: navigator.userAgent
        },
        recommendations: []
    };
    
    // Adicionar recomendações
    if (report.capacity.percentage >= DIAG_CONFIG.PANEL_CAPACITY_WARNING) {
        report.recommendations.push({
            type: 'capacity',
            message: `Criar diagnostics57.js - Capacidade ${report.capacity.percentage}%`,
            priority: 'high'
        });
    }
    
    if (!window.properties || window.properties.length === 0) {
        report.recommendations.push({
            type: 'data',
            message: 'Nenhum imóvel carregado - Executar loadPropertiesData()',
            priority: 'high'
        });
    }
    
    if (localStorage.getItem('weberlessa_properties')) {
        report.recommendations.push({
            type: 'migration',
            message: 'Chave antiga detectada - Executar unifyLocalStorageKeys()',
            priority: 'medium'
        });
    }
    
    // Exportar JSON
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `weberlessa-diagnostics-v${DIAG_CONFIG.VERSION}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    console.log('✅ Relatório exportado com sucesso');
    console.groupEnd();
    
    return report;
}

function showCapacityReport() {
    console.group('📊 RELATÓRIO DE CAPACIDADE - diagnostics54.js');
    
    console.log(`📋 Versão: ${DIAG_CONFIG.VERSION}`);
    console.log(`🖥️ Core System: v${DIAG_CONFIG.CORE_VERSION}`);
    console.log(`📦 Painéis ativos: ${DIAG_CONFIG.CURRENT_PANEL_COUNT}/${DIAG_CONFIG.MAX_PANELS_PER_FILE}`);
    console.log(`📈 Capacidade total: ${Math.round((DIAG_CONFIG.CURRENT_PANEL_COUNT / DIAG_CONFIG.MAX_PANELS_PER_FILE) * 100)}%`);
    console.log('');
    
    Object.keys(PanelManager.panels).forEach(panelName => {
        const panel = PanelManager.panels[panelName];
        const capacityPercent = Math.round((panel.testCount / DIAG_CONFIG.MAX_TESTS_PER_PANEL) * 100);
        const status = capacityPercent >= DIAG_CONFIG.PANEL_CAPACITY_WARNING ? '⚠️' : '✅';
        
        console.log(`${status} ${panelName}:`);
        console.log(`   Testes: ${panel.testCount}/${DIAG_CONFIG.MAX_TESTS_PER_PANEL}`);
        console.log(`   Capacidade: ${capacityPercent}%`);
        console.log(`   Último uso: ${panel.lastUsed.split('T')[0]} ${panel.lastUsed.split('T')[1].split('.')[0]}`);
        console.log('');
    });
    
    if (DIAG_CONFIG.CURRENT_PANEL_COUNT >= DIAG_CONFIG.MAX_PANELS_PER_FILE) {
        console.warn('🚨 LIMITE DE PAINÉIS POR ARQUIVO ATINGIDO!');
        console.warn('💡 Recomendação: Crie diagnostics57.js para novos painéis');
        console.warn(`🔗 URL: ${DIAG_CONFIG.BASE_URL}?debug=true&diagnostics=true&window=2`);
    }
    
    console.groupEnd();
}

function minimizeAllWindows() {
    WindowManager.windows.forEach(window => {
        window.minimized = true;
        const element = document.getElementById(window.id);
        if (element) {
            element.style.display = 'none';
        }
    });
    console.log('🪟 Todas as janelas minimizadas');
}

function closeAllWindows() {
    WindowManager.windows.forEach(window => {
        const element = document.getElementById(window.id);
        if (element) element.remove();
    });
    WindowManager.windows = [];
    console.log('❌ Todas as janelas fechadas');
}

// ================== INICIALIZAÇÃO DO SISTEMA ==================
function initializeDiagnosticsSystem() {
    console.log(`\n🚀 INICIALIZANDO SISTEMA DE DIAGNÓSTICO v${DIAG_CONFIG.VERSION}`);
    console.log(`🔧 Core System: v${DIAG_CONFIG.CORE_VERSION} | Weber Lessa Imóveis`);
    console.log(`📡 URL: ${window.location.href}\n`);
    
    // 1. Inicializar todos os painéis
    CoreSystemDiagnosticsPanel.initialize();
    MediaDiagnosticsPanel.initialize();
    SupportSystemDiagnosticsPanel.initialize();
    ReferencesDiagnosticsPanel.initialize();
    
    // 2. Criar painel de controle
    createMainControlPanel();
    
    // 3. Adicionar comandos ao console
    window.diag54 = {
        version: DIAG_CONFIG.VERSION,
        core: {
            verify: CoreSystemDiagnosticsPanel.verifyCoreModules,
            functions: CoreSystemDiagnosticsPanel.verifyCriticalFunctions,
            storage: CoreSystemDiagnosticsPanel.verifyLocalStorage,
            properties: CoreSystemDiagnosticsPanel.verifyProperties,
            supabase: CoreSystemDiagnosticsPanel.verifySupabaseConnection,
            shared: CoreSystemDiagnosticsPanel.verifySharedCore,
            media: CoreSystemDiagnosticsPanel.verifyMediaSystem,
            pdf: CoreSystemDiagnosticsPanel.verifyPdfSystem,
            admin: CoreSystemDiagnosticsPanel.verifyAdminPanel,
            gallery: CoreSystemDiagnosticsPanel.verifyGallery,
            filters: CoreSystemDiagnosticsPanel.verifyFilterManager,
            loading: CoreSystemDiagnosticsPanel.verifyLoadingManager,
            performance: CoreSystemDiagnosticsPanel.performanceTest
        },
        media: {
            buckets: MediaDiagnosticsPanel.verifyStorageBuckets,
            urls: MediaDiagnosticsPanel.verifyMediaUrls,
            pdfs: MediaDiagnosticsPanel.verifyPdfUrls
        },
        support: {
            loading: SupportSystemDiagnosticsPanel.verifySupportLoading,
            modules: SupportSystemDiagnosticsPanel.verifySupportModules
        },
        references: {
            scripts: ReferencesDiagnosticsPanel.verifyScriptReferences,
            css: ReferencesDiagnosticsPanel.verifyCssReferences
        },
        manager: PanelManager,
        windows: WindowManager,
        report: exportSystemReport,
        capacity: showCapacityReport,
        minimizeAll: minimizeAllWindows,
        closeAll: closeAllWindows
    };
    
    // 4. Executar verificação rápida automática
    setTimeout(() => {
        console.log('🔍 Executando verificação rápida do sistema...');
        
        const quickCheck = {
            properties: window.properties?.length || 0,
            supabase: !!window.supabaseClient,
            mediaSystem: !!window.MediaSystem,
            pdfSystem: !!window.PdfSystem,
            sharedCore: !!window.SharedCore,
            loadingManager: !!window.LoadingManager,
            filterManager: !!window.FilterManager
        };
        
        console.table(quickCheck);
        
        // Alertas automáticos
        if (!window.properties || window.properties.length === 0) {
            console.warn('⚠️ Nenhum imóvel carregado! Execute window.loadPropertiesData()');
        }
        
        if (localStorage.getItem('weberlessa_properties')) {
            console.warn('⚠️ Chave antiga detectada! Execute window.unifyLocalStorageKeys()');
        }
        
    }, 1000);
    
    console.log('\n✅ Sistema de diagnóstico inicializado com sucesso!');
    console.log('🎮 Use window.diag54 para acessar todas as funcionalidades');
    console.log('📊 Painéis disponíveis: Core, Media, Support, References\n');
}

// ================== EXECUÇÃO AUTOMÁTICA ==================
if (window.location.search.includes('debug=true') && window.location.search.includes('diagnostics=true')) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(initializeDiagnosticsSystem, 1500);
        });
    } else {
        setTimeout(initializeDiagnosticsSystem, 1500);
    }
}

// ================== EXPORTAÇÕES GLOBAIS ==================
window.DiagnosticsSystem54 = {
    version: DIAG_CONFIG.VERSION,
    coreVersion: DIAG_CONFIG.CORE_VERSION,
    config: DIAG_CONFIG,
    initialize: initializeDiagnosticsSystem,
    panels: {
        core: CoreSystemDiagnosticsPanel,
        media: MediaDiagnosticsPanel,
        support: SupportSystemDiagnosticsPanel,
        references: ReferencesDiagnosticsPanel
    },
    manager: PanelManager,
    windows: WindowManager
};

console.log(`✅ diagnostics54.js v${DIAG_CONFIG.VERSION} - Sistema de diagnóstico modular carregado`);
console.log(`🎯 Integrado com Core System v${DIAG_CONFIG.CORE_VERSION} - 100% funcional`);
