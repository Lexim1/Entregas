/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package servicios;

import modelos.conversion;

/**
 *
 * @author frien
 */
public class ConversorLongitud {
    private static final double METROS_A_PIES = 3.28084;
    
     //Clase interna para conversión de Metros a Pies
    
    public static class MetrosAPies implements IConversor {
        private static final String NOMBRE = "Metros a Pies";
        private static final String CATEGORIA = "Longitud";
        
        @Override
        public conversion convertir(double metros) {
            double pies = metros * METROS_A_PIES;
            return new conversion(metros, pies, "m", "ft");
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
 
     //Clase interna para conversión de Pies a Metros

    public static class PiesAMetros implements IConversor {
        private static final String NOMBRE = "Pies a Metros";
        private static final String CATEGORIA = "Longitud";
        
        @Override
        public conversion convertir(double pies) {
            double metros = pies / METROS_A_PIES;
            return new conversion(pies, metros, "ft", "m");
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
    

    public static IConversor crearMetrosAPies() {
        return new MetrosAPies();
    }
    
    public static IConversor crearPiesAMetros() {
        return new PiesAMetros();
    }
}