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

import lp2.proyectoindividual.modelo.Servicio;
import lp2.proyectoindividual.repositorio.ServicioRepositorio;

@RestController
@RequestMapping("/api/servicios")
@CrossOrigin(origins = { "http://localhost", "http://127.0.0.1", "http://localhost:80" })
public class ServicioApiControlador {

    private final ServicioRepositorio servicioRepositorio;

    public ServicioApiControlador(ServicioRepositorio servicioRepositorio) {
        this.servicioRepositorio = servicioRepositorio;
    }

    @GetMapping
    public List<Servicio> listar() {
        return servicioRepositorio.findByEstadoIgnoreCaseOrderByNombreAsc("ACTIVO");
    }

    @GetMapping("/admin")
    public List<Servicio> listarAdmin() {
        return servicioRepositorio.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Servicio> obtener(@PathVariable Integer id) {
        return servicioRepositorio.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Servicio crear(@RequestBody Servicio servicio) {
        normalizar(servicio);
        return servicioRepositorio.save(servicio);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Servicio> actualizar(@PathVariable Integer id, @RequestBody Servicio datos) {
        return servicioRepositorio.findById(id).map(servicio -> {
            servicio.setNombre(datos.getNombre());
            servicio.setPlataforma(datos.getPlataforma());
            servicio.setCategoria(datos.getCategoria());
            servicio.setDescripcion(datos.getDescripcion());
            servicio.setPrecio(datos.getPrecio());
            servicio.setCalidad(datos.getCalidad());
            servicio.setDuracionDias(datos.getDuracionDias());
            servicio.setImagen(datos.getImagen());
            servicio.setDestacado(datos.getDestacado());
            servicio.setEstado(datos.getEstado());
            normalizar(servicio);
            return ResponseEntity.ok(servicioRepositorio.save(servicio));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        if (!servicioRepositorio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        servicioRepositorio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private void normalizar(Servicio servicio) {
        if (servicio.getEstado() == null || servicio.getEstado().isBlank()) {
            servicio.setEstado("ACTIVO");
        }
        if (servicio.getDuracionDias() == null) {
            servicio.setDuracionDias(30);
        }
        if (servicio.getDestacado() == null) {
            servicio.setDestacado(false);
        }
    }
}
