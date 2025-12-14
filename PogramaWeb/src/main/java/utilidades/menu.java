
package utilidades;
import java.util.List;
import servicios.IConversor;

/**
 *
 * @author frien
 */
public class menu {
    private static final String SEPARADOR = "═";
    private static final String BORDE_VERTICAL = "║";
    private static final int ANCHO_MENU = 45;
    
    /**
     * Muestra el encabezado principal del programa
     */
    public static void mostrarEncabezado() {
        limpiarPantalla();
        imprimirLinea('╔', '╗', SEPARADOR);
        imprimirTextocentrado("🔄 CONVERSOR DE UNIDADES 🔄");
        imprimirLinea('╚', '╝', SEPARADOR);
        System.out.println();
    }
    
    /**
     * Muestra las opciones de conversión disponibles
     * @param conversores Lista de conversores disponibles
     */
    public static void mostrarOpciones(List<IConversor> conversores) {
        String categoriaActual = "";
        int opcion = 1;
        
        for (IConversor conversor : conversores) {
            if (!conversor.getCategoria().equals(categoriaActual)) {
                categoriaActual = conversor.getCategoria();
                imprimirCategoria(categoriaActual);
            }
            imprimirOpcion(opcion++, conversor.getNombre());
        }
        
        imprimirLinea('├', '┤', "─");
        imprimirOpcion(opcion, "Salir");
        imprimirLinea('└', '┘', "─");
    }
    

    public static void mostrarResultado(String resultado) {
        System.out.println("\n✅ Resultado: " + resultado);
    }
    

    public static void mostrarError(String mensaje) {
        System.out.println("\n❌ Error: " + mensaje);
    }
    

    public static void mostrarDespedida() {
        System.out.println("\n╔════════════════════════════════════════╗");
        System.out.println("║  ¡Gracias por usar el conversor! <3  ║");
        System.out.println("╚════════════════════════════════════════╝\n");
    }
    
    /**
     * Pausa la ejecución esperando que el usuario presione Enter
     */
    public static void esperarEnter() {
        System.out.println("\nPresione Enter para continuar...");
    }

    private static void limpiarPantalla() {
        try {
            if (System.getProperty("os.name").contains("Windows")) {
                new ProcessBuilder("cmd", "/c", "cls").inheritIO().start().waitFor();
            } else {
                System.out.print("\033[H\033[2J");
                System.out.flush();
            }
        } catch (Exception e) {
            // Si falla, imprime líneas en blanco
            for (int i = 0; i < 50; i++) {
                System.out.println();
            }
        }
    }
    

    private static void imprimirLinea(char inicio, char fin, String relleno) {
        System.out.print(inicio);
        for (int i = 0; i < ANCHO_MENU - 2; i++) {
            System.out.print(relleno);
        }
        System.out.println(fin);
    }

    private static void imprimirTextocentrado(String texto) {
        int espacios = (ANCHO_MENU - texto.length() - 2) / 2;
        System.out.print(BORDE_VERTICAL);
        for (int i = 0; i < espacios; i++) System.out.print(" ");
        System.out.print(texto);
        for (int i = 0; i < espacios; i++) System.out.print(" ");
        if ((ANCHO_MENU - texto.length() - 2) % 2 != 0) System.out.print(" ");
        System.out.println(BORDE_VERTICAL);
    }

    private static void imprimirCategoria(String categoria) {
        System.out.println("┌─── " + categoria.toUpperCase() + " " + "─".repeat(Math.max(0, 35 - categoria.length())) + "┐");
    }

    private static void imprimirOpcion(int numero, String nombre) {
        System.out.printf("│ %-2d. %-38s │%n", numero, nombre);
    }
}
