package lp2.proyectoindividual.controlador;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lp2.proyectoindividual.modelo.Cliente;
import lp2.proyectoindividual.repositorio.ClienteRepositorio;

@RestController
@RequestMapping("/api/clientes")
@CrossOrigin(origins = { "http://localhost", "http://127.0.0.1", "http://localhost:80" })
public class ClienteApiControlador {

    private final ClienteRepositorio clienteRepositorio;

    public ClienteApiControlador(ClienteRepositorio clienteRepositorio) {
        this.clienteRepositorio = clienteRepositorio;
    }

    @GetMapping
    public List<Cliente> listar() {
        return clienteRepositorio.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> obtener(@PathVariable Integer id) {
        return clienteRepositorio.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Cliente crear(@RequestBody Cliente cliente) {
        if (cliente.getEstado() == null || cliente.getEstado().isBlank()) {
            cliente.setEstado("ACTIVO");
        }
        return clienteRepositorio.save(cliente);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(@PathVariable Integer id, @RequestBody Cliente datos) {
        return clienteRepositorio.findById(id).map(cliente -> {
            cliente.setNombres(datos.getNombres());
            cliente.setApellidos(datos.getApellidos());
            cliente.setTelefono(datos.getTelefono());
            cliente.setEmail(datos.getEmail());
            cliente.setDireccion(datos.getDireccion());
            if (datos.getPassword() != null && !datos.getPassword().isBlank()) {
                cliente.setPassword(datos.getPassword());
            }
            cliente.setEstado(datos.getEstado());
            return ResponseEntity.ok(clienteRepositorio.save(cliente));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!clienteRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        clienteRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
