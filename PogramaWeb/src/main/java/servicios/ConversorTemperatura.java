
package servicios;

import modelos.conversion;

/**
 *
 * @author frien
 */
public class ConversorTemperatura {

        public static class CelsiusAFahrenheit implements IConversor {
        private static final String NOMBRE = "Celsius a Fahrenheit";
        private static final String CATEGORIA = "Temperatura";
        
            @Override
            public conversion convertir(double celsius) {
                double fahrenheit = (celsius * 9.0 / 5.0) + 32;
                return new conversion(celsius, fahrenheit, "°C", "°F");
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

         //Clase interna para conversión de Fahrenheit a Celsius

        public static class FahrenheitACelsius implements IConversor {
            private static final String NOMBRE = "Fahrenheit a Celsius";
            private static final String CATEGORIA = "Temperatura";

            @Override
            public conversion convertir(double fahrenheit) {
                double celsius = (fahrenheit - 32) * 5.0 / 9.0;
                return new conversion(fahrenheit, celsius, "°F", "°C");
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

        public static IConversor crearCelsiusAFahrenheit() {
            return new CelsiusAFahrenheit();
        }

        public static IConversor crearFahrenheitACelsius() {
            return new FahrenheitACelsius();
        }
    }