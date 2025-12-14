
package servicios;

import modelos.conversion;

/**
 *
 * @author frien
 */
public class ConversorDistancia {
    private static final double KM_A_MILLAS = 0.621371;
    
//km a millas
    public static class KilometrosAMillas implements IConversor {
        private static final String NOMBRE = "Kilómetros a Millas";
        private static final String CATEGORIA = "Distancia";
        
        @Override
        public conversion convertir(double kilometros) {
            double millas = kilometros * KM_A_MILLAS;
            return new conversion(kilometros, millas, "km", "mi");
        }
        
        @Override
        public String getNombre() {
            return NOMBRE;
        }
        
        @Override
        public String getCategoria() {
            return CATEGORIA;
        }
    }
    
//millas a km
    public static class MillasAKilometros implements IConversor {
        private static final String NOMBRE = "Millas a Kilómetros";
        private static final String CATEGORIA = "Distancia";
        
        @Override
        public conversion convertir(double millas) {
            double kilometros = millas / KM_A_MILLAS;
            return new conversion(millas, kilometros, "mi", "km");
        }
        
        @Override
        public String getNombre() {
            return NOMBRE;
        }
        
        @Override
        public String getCategoria() {
            return CATEGORIA;
        }
    }
    
    public static IConversor crearKilometrosAMillas() {
        return new KilometrosAMillas();
    }
    
    public static IConversor crearMillasAKilometros() {
        return new MillasAKilometros();
    }
}