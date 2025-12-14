
package servicios;

import modelos.conversion;

/**
 *
 * @author frien
 */
public interface IConversor {

    conversion convertir(double valor);
    

    String getNombre();

    String getCategoria();
}