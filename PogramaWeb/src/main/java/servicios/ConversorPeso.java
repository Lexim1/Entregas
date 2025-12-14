
package servicios;

import modelos.conversion;

/**
 *
 * @author frien
 */
public class ConversorPeso {
    private static final double KG_A_LIBRAS = 2.20462;
    
    //kg a lb
    public static class KilogramosALibras implements IConversor {
        private static final String NOMBRE = "Kilogramos a Libras";
        private static final String CATEGORIA = "Peso";
        
        @Override
        public conversion convertir(double kilogramos) {
            double libras = kilogramos * KG_A_LIBRAS;
            return new conversion(kilogramos, libras, "kg", "lb");
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
    
    //Lbs a KGs
    public static class LibrasAKilogramos implements IConversor {
        private static final String NOMBRE = "Libras a Kilogramos";
        private static final String CATEGORIA = "Peso";
        
        @Override
        public conversion convertir(double libras) {
            double kilogramos = libras / KG_A_LIBRAS;
            return new conversion(libras, kilogramos, "lb", "kg");
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
    public static IConversor crearKilogramosALibras() {
        return new KilogramosALibras();
    }
    
    public static IConversor crearLibrasAKilogramos() {
        return new LibrasAKilogramos();
    }
}