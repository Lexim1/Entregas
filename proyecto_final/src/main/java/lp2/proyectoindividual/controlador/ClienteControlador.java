package lp2.proyectoindividual.controlador;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lp2.proyectoindividual.modelo.Cliente;
import lp2.proyectoindividual.repositorio.ClienteRepositorio;

@Controller
public class ClienteControlador {

    private final ClienteRepositorio clienteRepositorio;

    public ClienteControlador(ClienteRepositorio clienteRepositorio) {
        this.clienteRepositorio = clienteRepositorio;
    }

    @GetMapping("/clientes")
    public String listar(Model model) {
        model.addAttribute("lista", clienteRepositorio.findAll());
        model.addAttribute("cliente", new Cliente());
        return "clientes/index";
    }

    @PostMapping("/clientes/guardar")
    public String guardar(@ModelAttribute Cliente cliente) {
        clienteRepositorio.save(cliente);
        return "redirect:/clientes";
    }

    @GetMapping("/clientes/editar")
    public String editar(@RequestParam Integer id, Model model) {
        model.addAttribute("cliente", clienteRepositorio.findById(id).orElse(new Cliente()));
        model.addAttribute("lista", clienteRepositorio.findAll());
        return "clientes/index";
    }

    @GetMapping("/clientes/eliminar")
    public String eliminar(@RequestParam Integer id) {
        clienteRepositorio.deleteById(id);
        return "redirect:/clientes";
    }
}
