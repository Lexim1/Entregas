package lp2.proyectoindividual.controlador;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import lp2.proyectoindividual.modelo.Servicio;
import lp2.proyectoindividual.repositorio.ServicioRepositorio;

@Controller
public class ServicioControlador {

    private final ServicioRepositorio servicioRepositorio;

    public ServicioControlador(ServicioRepositorio servicioRepositorio) {
        this.servicioRepositorio = servicioRepositorio;
    }

    @GetMapping("/servicios")
    public String listar(Model model) {
        model.addAttribute("lista", servicioRepositorio.findAll());
        model.addAttribute("servicio", new Servicio());
        return "servicios/index";
    }

    @PostMapping("/servicios/guardar")
    public String guardar(@ModelAttribute Servicio servicio) {
        if (servicio.getEstado() == null || servicio.getEstado().isBlank()) {
            servicio.setEstado("ACTIVO");
        }
        if (servicio.getDestacado() == null) {
            servicio.setDestacado(false);
        }
        servicioRepositorio.save(servicio);
        return "redirect:/servicios";
    }

    @GetMapping("/servicios/editar")
    public String editar(@RequestParam Integer id, Model model) {
        model.addAttribute("servicio", servicioRepositorio.findById(id).orElse(new Servicio()));
        model.addAttribute("lista", servicioRepositorio.findAll());
        return "servicios/index";
    }

    @GetMapping("/servicios/eliminar")
    public String eliminar(@RequestParam Integer id) {
        servicioRepositorio.deleteById(id);
        return "redirect:/servicios";
    }
}
