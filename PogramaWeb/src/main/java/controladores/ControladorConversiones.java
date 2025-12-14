package controladores;

import java.util.ArrayList;
import java.util.InputMismatchException;
import java.util.List;
import java.util.Scanner;

import modelos.conversion;
import servicios.*;
import utilidades.menu;


public class ControladorConversiones {
    private final List<IConversor> conversores;
    private final Scanner scanner;
    

    public ControladorConversiones() {
        this.scanner = new Scanner(System.in);
        this.conversores = inicializarConversores();
    }
    
    public void iniciar() {
        boolean continuar = true;
        
        while (continuar) {
            menu.mostrarEncabezado();
            menu.mostrarOpciones(conversores);
            
            int opcion = solicitarOpcion();
            
            if (opcion == conversores.size() + 1) {
                continuar = false;
            } else if (opcion >= 1 && opcion <= conversores.size()) {
                procesarConversion(opcion - 1);
            } else {
                menu.mostrarError("Opción no válida");
                esperarYContinuar();
            }
        }
        
        menu.mostrarDespedida();
        scanner.close();
    }
    
    private List<IConversor> inicializarConversores() {
        List<IConversor> lista = new ArrayList<>();
        
        // Temperatura
        lista.add(ConversorTemperatura.crearCelsiusAFahrenheit());
        lista.add(ConversorTemperatura.crearFahrenheitACelsius());
        
        // Volumen
        lista.add(ConversorVolumen.crearGalonesALitros());
        lista.add(ConversorVolumen.crearLitrosAGalones());
        
        // Longitud
        lista.add(ConversorLongitud.crearMetrosAPies());
        lista.add(ConversorLongitud.crearPiesAMetros());
        
        // Peso
        lista.add(ConversorPeso.crearKilogramosALibras());
        lista.add(ConversorPeso.crearLibrasAKilogramos());
        
        // Distancia
        lista.add(ConversorDistancia.crearKilometrosAMillas());
        lista.add(ConversorDistancia.crearMillasAKilometros());
        
        // Área
        lista.add(ConversorArea.crearMetrosCuadradosAPiesCuadrados());
        lista.add(ConversorArea.crearPiesCuadradosAMetrosCuadrados());
        
        return lista;
    }
    

    private int solicitarOpcion() {
        System.out.print("\n➤ Seleccione una opción: ");
        try {
            return scanner.nextInt();
        } catch (InputMismatchException e) {
            scanner.nextLine(); // Limpiar buffer
            return -1;
        }
    }
    
    private double solicitarValor() {
        System.out.print("\n📝 Ingrese el valor: ");
        try {
            return scanner.nextDouble();
        } catch (InputMismatchException e) {
            scanner.nextLine(); // Limpiar buffer
            throw new IllegalArgumentException("Debe ingresar un número válido");
        }
    }
    
    private void procesarConversion(int indice) {
        try {
            IConversor conversor = conversores.get(indice);
            double valor = solicitarValor();
            
            conversion resultado = conversor.convertir(valor);
            menu.mostrarResultado(resultado.toString());
            
        } catch (IllegalArgumentException e) {
            menu.mostrarError(e.getMessage());
        } catch (Exception e) {
            menu.mostrarError("Ocurrió un error inesperado");
        }
        
        esperarYContinuar();
    }
    

    private void esperarYContinuar() {
        menu.esperarEnter();
        scanner.nextLine(); // Limpiar buffer
        scanner.nextLine(); // Esperar Enter
    }
}