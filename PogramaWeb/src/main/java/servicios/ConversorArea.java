package servicios;

import modelos.conversion;

/**
 *
 * @author frien
 */
public class ConversorArea {
    private static final double M2_A_PIES2 = 10.7639;
    
    //metros cuadrados a pies cuadrados
    public static class MetrosCuadradosAPiesCuadrados implements IConversor {
        private static final String NOMBRE = "Metros² a Pies²";
        private static final String CATEGORIA = "Área";
        
        @Override
        public conversion convertir(double metrosCuadrados) {
            double piesCuadrados = metrosCuadrados * M2_A_PIES2;
            return new conversion(metrosCuadrados, piesCuadrados, "m²", "ft²");
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
    
    //pies cuadrados a metros cuadrados
    
    public static class PiesCuadradosAMetrosCuadrados implements IConversor {
        private static final String NOMBRE = "Pies² a Metros²";
        private static final String CATEGORIA = "Área";
        
        @Override
        public conversion convertir(double piesCuadrados) {
            double metrosCuadrados = piesCuadrados / M2_A_PIES2;
            return new conversion(piesCuadrados, metrosCuadrados, "ft²", "m²");
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

    public static IConversor crearMetrosCuadradosAPiesCuadrados() {
        return new MetrosCuadradosAPiesCuadrados();
    }
    
    public static IConversor crearPiesCuadradosAMetrosCuadrados() {
        return new PiesCuadradosAMetrosCuadrados();
    }
}