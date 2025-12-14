
package servicios;

import modelos.conversion;

/**
 *
 * @author frien
 */
public class ConversorVolumen {
    private static final double GALONES_A_LITROS = 3.78541;
    

    public static class GalonesALitros implements IConversor {
        private static final String NOMBRE = "Galones a Litros";
        private static final String CATEGORIA = "Volumen";
        
        @Override
        public conversion convertir(double galones) {
            double litros = galones * GALONES_A_LITROS;
            return new conversion(galones, litros, "gal", "L");
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
    
    public static class LitrosAGalones implements IConversor {
        private static final String NOMBRE = "Litros a Galones";
        private static final String CATEGORIA = "Volumen";
        
        @Override
        public conversion convertir(double litros) {
            double galones = litros / GALONES_A_LITROS;
            return new conversion(litros, galones, "L", "gal");
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
    
    // Factory methods
    public static IConversor crearGalonesALitros() {
        return new GalonesALitros();
    }
    
    public static IConversor crearLitrosAGalones() {
        return new LitrosAGalones();
    }
}