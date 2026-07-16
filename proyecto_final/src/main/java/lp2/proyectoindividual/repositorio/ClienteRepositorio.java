package lp2.proyectoindividual.repositorio;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import lp2.proyectoindividual.modelo.Cliente;

public interface ClienteRepositorio extends JpaRepository<Cliente, Integer> {
    Optional<Cliente> findByEmailIgnoreCase(String email);

    Optional<Cliente> findByTelefono(String telefono);
}
