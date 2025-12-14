/**
 * @author Alexia Pérez Saldaña
 * @version 2.0
 */


const CONFIG = {
    conversiones: {
        temperatura: {
            emoji: '🌡️',
            opciones: [
                { value: 'celsiusToFahrenheit', text: 'Celsius → Fahrenheit' },
                { value: 'fahrenheitToCelsius', text: 'Fahrenheit → Celsius' }
            ],
            info: 'La temperatura mide el grado de calor o frío. Fórmula: °C = (°F - 32) × 5/9'
        },
        volumen: {
            emoji: '🧪',
            opciones: [
                { value: 'galonesALitros', text: 'Galones → Litros' },
                { value: 'litrosAGalones', text: 'Litros → Galones' }
            ],
            info: 'El volumen mide el espacio ocupado por un líquido. Factor: 1 galón = 3.78541 litros'
        },
        longitud: {
            emoji: '📏',
            opciones: [
                { value: 'metrosAPies', text: 'Metros → Pies' },
                { value: 'piesAMetros', text: 'Pies → Metros' }
            ],
            info: 'La longitud mide la distancia entre dos puntos. Factor: 1 metro = 3.28084 pies'
        },
        peso: {
            emoji: '⚖️',
            opciones: [
                { value: 'kilogramosALibras', text: 'Kilogramos → Libras' },
                { value: 'librasAKilogramos', text: 'Libras → Kilogramos' }
            ],
            info: 'El peso mide la masa de un objeto. Factor: 1 kilogramo = 2.20462 libras'
        },
        distancia: {
            emoji: '🚗',
            opciones: [
                { value: 'kilometrosAMillas', text: 'Kilómetros → Millas' },
                { value: 'millasAKilometros', text: 'Millas → Kilómetros' }
            ],
            info: 'La distancia mide el espacio entre ubicaciones. Factor: 1 km = 0.621371 millas'
        },
        area: {
            emoji: '📐',
            opciones: [
                { value: 'metrosAPies2', text: 'Metros² → Pies²' },
                { value: 'piesAMetros2', text: 'Pies² → Metros²' }
            ],
            info: 'El área mide la superficie de una región. Factor: 1 m² = 10.7639 pies²'
        }
    },
    
    factoresConversion: {
        GALONES_A_LITROS: 3.78541,
        METROS_A_PIES: 3.28084,
        KG_A_LIBRAS: 2.20462,
        KM_A_MILLAS: 0.621371,
        M2_A_PIES2: 10.7639
    }
};

// ========================================
// MÓDULO DE CONVERSIÓN (Strategy Pattern)
// ========================================
const Conversor = {
    // Conversiones de Temperatura
    celsiusToFahrenheit: (valor) => ({
        resultado: (valor * 9/5) + 32,
        texto: `${valor.toFixed(2)}°C = ${((valor * 9/5) + 32).toFixed(2)}°F`
    }),
    
    fahrenheitToCelsius: (valor) => ({
        resultado: (valor - 32) * 5/9,
        texto: `${valor.toFixed(2)}°F = ${((valor - 32) * 5/9).toFixed(2)}°C`
    }),
    
    // Conversiones de Volumen
    galonesALitros: (valor) => ({
        resultado: valor * CONFIG.factoresConversion.GALONES_A_LITROS,
        texto: `${valor.toFixed(2)} gal = ${(valor * CONFIG.factoresConversion.GALONES_A_LITROS).toFixed(2)} L`
    }),
    
    litrosAGalones: (valor) => ({
        resultado: valor / CONFIG.factoresConversion.GALONES_A_LITROS,
        texto: `${valor.toFixed(2)} L = ${(valor / CONFIG.factoresConversion.GALONES_A_LITROS).toFixed(2)} gal`
    }),
    
    // Conversiones de Longitud
    metrosAPies: (valor) => ({
        resultado: valor * CONFIG.factoresConversion.METROS_A_PIES,
        texto: `${valor.toFixed(2)} m = ${(valor * CONFIG.factoresConversion.METROS_A_PIES).toFixed(2)} ft`
    }),
    
    piesAMetros: (valor) => ({
        resultado: valor / CONFIG.factoresConversion.METROS_A_PIES,
        texto: `${valor.toFixed(2)} ft = ${(valor / CONFIG.factoresConversion.METROS_A_PIES).toFixed(2)} m`
    }),
    
    // Conversiones de Peso
    kilogramosALibras: (valor) => ({
        resultado: valor * CONFIG.factoresConversion.KG_A_LIBRAS,
        texto: `${valor.toFixed(2)} kg = ${(valor * CONFIG.factoresConversion.KG_A_LIBRAS).toFixed(2)} lb`
    }),
    
    librasAKilogramos: (valor) => ({
        resultado: valor / CONFIG.factoresConversion.KG_A_LIBRAS,
        texto: `${valor.toFixed(2)} lb = ${(valor / CONFIG.factoresConversion.KG_A_LIBRAS).toFixed(2)} kg`
    }),
    
    // Conversiones de Distancia
    kilometrosAMillas: (valor) => ({
        resultado: valor * CONFIG.factoresConversion.KM_A_MILLAS,
        texto: `${valor.toFixed(2)} km = ${(valor * CONFIG.factoresConversion.KM_A_MILLAS).toFixed(2)} mi`
    }),
    
    millasAKilometros: (valor) => ({
        resultado: valor / CONFIG.factoresConversion.KM_A_MILLAS,
        texto: `${valor.toFixed(2)} mi = ${(valor / CONFIG.factoresConversion.KM_A_MILLAS).toFixed(2)} km`
    }),
    
    // Conversiones de Área
    metrosAPies2: (valor) => ({
        resultado: valor * CONFIG.factoresConversion.M2_A_PIES2,
        texto: `${valor.toFixed(2)} m² = ${(valor * CONFIG.factoresConversion.M2_A_PIES2).toFixed(2)} ft²`
    }),
    
    piesAMetros2: (valor) => ({
        resultado: valor / CONFIG.factoresConversion.M2_A_PIES2,
        texto: `${valor.toFixed(2)} ft² = ${(valor / CONFIG.factoresConversion.M2_A_PIES2).toFixed(2)} m²`
    })
};


const UI = {
    elementos: {
        categoria: null,
        conversion: null,
        valor: null,
        resultado: null,
        infoText: null
    },
    
    /**
     * Inicializa las referencias a los elementos del DOM
     */
    inicializar() {
        this.elementos.categoria = document.getElementById('categoria');
        this.elementos.conversion = document.getElementById('conversion');
        this.elementos.valor = document.getElementById('valor');
        this.elementos.resultado = document.getElementById('resultado');
        this.elementos.infoText = document.getElementById('infoText');
    },
    
    /**
     * Actualiza las opciones de conversión según la categoría
     */
    actualizarOpciones(categoria) {
        const opciones = CONFIG.conversiones[categoria].opciones;
        const selectConversion = this.elementos.conversion;
        
        selectConversion.innerHTML = '';
        
        opciones.forEach(opcion => {
            const option = document.createElement('option');
            option.value = opcion.value;
            option.textContent = opcion.text;
            selectConversion.appendChild(option);
        });
        
        this.actualizarInformacion(categoria);
        this.limpiarResultado();
    },
    
    /**
     * Actualiza el texto informativo
     */
    actualizarInformacion(categoria) {
        this.elementos.infoText.textContent = CONFIG.conversiones[categoria].info;
    },
    
    /**
     * Muestra el resultado de la conversión
     */
    mostrarResultado(texto, esError = false) {
        const resultado = this.elementos.resultado;
        resultado.textContent = esError ? `⚠️ ${texto}` : `✅ ${texto}`;
        resultado.classList.remove('show');
        
        setTimeout(() => {
            resultado.classList.add('show');
        }, 10);
    },
    
    /**
     * Limpia el área de resultado
     */
    limpiarResultado() {
        this.elementos.resultado.classList.remove('show');
    },
    
    /**
     * Obtiene el valor ingresado por el usuario
     */
    obtenerValor() {
        return parseFloat(this.elementos.valor.value);
    },
    
    /**
     * Obtiene el tipo de conversión seleccionado
     */
    obtenerTipoConversion() {
        return this.elementos.conversion.value;
    }
};


const Validador = {
    /**
     * Valida que el valor ingresado sea un número válido
     */
    validarValor(valor) {
        if (isNaN(valor)) {
            return {
                valido: false,
                mensaje: 'Por favor, ingrese un valor numérico válido'
            };
        }
        
        if (!isFinite(valor)) {
            return {
                valido: false,
                mensaje: 'El valor debe ser un número finito'
            };
        }
        
        return {
            valido: true,
            mensaje: ''
        };
    }
};

const App = {
    /**
     * Inicializa la aplicación
     */
    iniciar() {
        UI.inicializar();
        this.configurarEventos();
        UI.actualizarOpciones('temperatura');
        
        console.log('✅ Aplicación iniciada correctamente');
    },
    
    /**
     * Configura los event listeners
     */
    configurarEventos() {
        // Cambio de categoría
        UI.elementos.categoria.addEventListener('change', (e) => {
            UI.actualizarOpciones(e.target.value);
        });
        
        // Enter en el campo de valor
        UI.elementos.valor.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.convertir();
            }
        });
    },
    
    /**
     * Realiza la conversión
     */
    convertir() {
        try {
            const valor = UI.obtenerValor();
            
            // Validar entrada
            const validacion = Validador.validarValor(valor);
            if (!validacion.valido) {
                UI.mostrarResultado(validacion.mensaje, true);
                return;
            }
            
            // Obtener tipo de conversión y realizar conversión
            const tipoConversion = UI.obtenerTipoConversion();
            
            if (!Conversor[tipoConversion]) {
                UI.mostrarResultado('Conversión no disponible', true);
                return;
            }
            
            const resultado = Conversor[tipoConversion](valor);
            UI.mostrarResultado(resultado.texto);
            
        } catch (error) {
            console.error('Error en conversión:', error);
            UI.mostrarResultado('Ocurrió un error inesperado', true);
        }
    }
};


document.addEventListener('DOMContentLoaded', () => {
    // Exponer la app globalmente para el onclick del HTML
    window.app = App;
    App.iniciar();
});