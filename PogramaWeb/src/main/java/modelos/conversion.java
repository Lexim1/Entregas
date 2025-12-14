
package modelos;

/**
 *
 * @author frien
 */
public class conversion {
    private final double valorEntrada;
    private final double valorSalida;
    private final String unidadEntrada;
    private final String unidadSalida;

    public conversion(double valorEntrada, double valorSalida, 
                     String unidadEntrada, String unidadSalida) {
        this.valorEntrada = valorEntrada;
        this.valorSalida = valorSalida;
        this.unidadEntrada = unidadEntrada;
        this.unidadSalida = unidadSalida;
        }

        public double getValorEntrada() {
            return valorEntrada;
            }

        public double getValorSalida() {
            return valorSalida;
            }

        public String getUnidadEntrada() {
            return unidadEntrada;
            }

        public String getUnidadSalida() {
            return unidadSalida;
            }
    
    @Override
    public String toString() {
        return String.format("%.2f %s = %.2f %s", 
                           valorEntrada, unidadEntrada, 
                           valorSalida, unidadSalida);
    }
}