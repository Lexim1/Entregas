package lp2.proyectoindividual.controlador;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lp2.proyectoindividual.modelo.Cliente;
import lp2.proyectoindividual.repositorio.ClienteRepositorio;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost", "http://127.0.0.1", "http://localhost:80" })
public class AuthApiControlador {

    private final ClienteRepositorio clienteRepositorio;

    public AuthApiControlador(ClienteRepositorio clienteRepositorio) {
        this.clienteRepositorio = clienteRepositorio;
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> registrar(@RequestBody Map<String, String> datos) {
        String nombre = limpiar(datos.get("nombre"));
        String correo = limpiar(datos.get("correo"));
        String telefono = limpiar(datos.get("telefono"));
        String password = limpiar(datos.get("password"));

        if (nombre.isBlank() || correo.isBlank() || telefono.isBlank() || password.isBlank()) {
            return error("Completa todos los campos.", HttpStatus.BAD_REQUEST);
        }
        if (clienteRepositorio.findByEmailIgnoreCase(correo).isPresent()) {
            return error("Ya existe una cuenta registrada con ese correo.", HttpStatus.CONFLICT);
        }
        if (clienteRepositorio.findByTelefono(telefono).isPresent()) {
            return error("Ya existe una cuenta registrada con ese telefono.", HttpStatus.CONFLICT);
        }

        Cliente cliente = new Cliente();
        String[] partes = nombre.split("\\s+", 2);
        cliente.setNombres(partes[0]);
        cliente.setApellidos(partes.length > 1 ? partes[1] : "");
        cliente.setEmail(correo);
        cliente.setTelefono(telefono);
        cliente.setPassword(password);
        cliente.setEstado("ACTIVO");

        Cliente guardado = clienteRepositorio.save(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(ok(guardado));
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> datos) {
        String identifier = limpiar(datos.get("identifier"));
        String password = limpiar(datos.get("password"));

        if (identifier.isBlank() || password.isBlank()) {
            return error("Completa correo/telefono y contrasena.", HttpStatus.BAD_REQUEST);
        }

        Optional<Cliente> porCorreo = clienteRepositorio.findByEmailIgnoreCase(identifier);
        Optional<Cliente> porTelefono = clienteRepositorio.findByTelefono(identifier);
        Optional<Cliente> encontrado = porCorreo.isPresent() ? porCorreo : porTelefono;

        if (encontrado.isEmpty()) {
            return error("No encontramos una cuenta con ese correo o telefono.", HttpStatus.NOT_FOUND);
        }

        Cliente cliente = encontrado.get();
        if (cliente.getPassword() == null || !cliente.getPassword().equals(password)) {
            return error("Contrasena incorrecta.", HttpStatus.UNAUTHORIZED);
        }

        return ResponseEntity.ok(ok(cliente));
    }

    private String limpiar(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private ResponseEntity<Map<String, Object>> error(String mensaje, HttpStatus estado) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("ok", false);
        body.put("error", mensaje);
        return ResponseEntity.status(estado).body(body);
    }

    private Map<String, Object> ok(Cliente cliente) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("ok", true);
        body.put("user", clienteSeguro(cliente));
        return body;
    }

    private Map<String, Object> clienteSeguro(Cliente cliente) {
        Map<String, Object> user = new LinkedHashMap<>();
        user.put("idcliente", cliente.getIdcliente());
        user.put("nombre", (cliente.getNombres() + " " + cliente.getApellidos()).trim());
        user.put("nombres", cliente.getNombres());
        user.put("apellidos", cliente.getApellidos());
        user.put("correo", cliente.getEmail());
        user.put("email", cliente.getEmail());
        user.put("telefono", cliente.getTelefono());
        user.put("estado", cliente.getEstado());
        return user;
    }
}
