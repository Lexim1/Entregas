package lp2.proyectoindividual.repositorio;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import lp2.proyectoindividual.modelo.Servicio;

public interface ServicioRepositorio extends JpaRepository<Servicio, Integer> {
    List<Servicio> findByEstadoIgnoreCaseOrderByNombreAsc(String estado);

    boolean existsByNombreIgnoreCase(String nombre);
}
