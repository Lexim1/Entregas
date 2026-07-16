package lp2.proyectoindividual.config;

import java.math.BigDecimal;
import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import lp2.proyectoindividual.modelo.Servicio;
import lp2.proyectoindividual.repositorio.ServicioRepositorio;

@Configuration
public class DatosIniciales {

    @Bean
    CommandLineRunner cargarServiciosBase(ServicioRepositorio servicioRepositorio) {
        return args -> {
            List<Servicio> servicios = List.of(
                    servicio("NETFLIX", "Netflix", "series peliculas popular",
                            "Series virales, peliculas, documentales y estrenos frecuentes.", "13", "4K",
                            "img/Netflix.png", true),
                    servicio("HBO MAX", "HBO Max", "series peliculas max",
                            "HBO Originals, Warner, cine de superheroes y producciones premium.", "5", "4K",
                            "img/hbomax.png", true),
                    servicio("DISNEY+ CON ESPN", "Disney+", "familia deportes disney",
                            "Disney, Pixar, Marvel, Star Wars y ESPN para familia y deportes.", "8", "4K",
                            "img/disneyplus.png", true),
                    servicio("PRIME VIDEO", "Prime Video", "peliculas series prime",
                            "Peliculas, series originales, accion, comedia y contenido internacional.", "5", "4K",
                            "img/primevideo.png", false),
                    servicio("CRUNCHYROLL", "Crunchyroll", "anime series",
                            "Anime, simulcast, temporadas nuevas y catalogo especializado.", "4", "Full HD",
                            "img/crunchyroll.png", false),
                    servicio("SPOTIFY", "Spotify", "musica podcasts",
                            "Musica y podcasts sin anuncios, descargas y recomendaciones.", "9", "Premium",
                            "img/Spotify.png", false));

            servicioRepositorio.findAll().forEach(servicio -> {
                boolean actualizado = false;
                if (servicio.getEstado() == null || servicio.getEstado().isBlank()) {
                    servicio.setEstado("ACTIVO");
                    actualizado = true;
                }
                if (servicio.getDuracionDias() == null) {
                    servicio.setDuracionDias(30);
                    actualizado = true;
                }
                if (servicio.getDestacado() == null) {
                    servicio.setDestacado(false);
                    actualizado = true;
                }
                if (actualizado) {
                    servicioRepositorio.save(servicio);
                }
            });

            servicios.stream()
                    .filter(servicio -> !servicioRepositorio.existsByNombreIgnoreCase(servicio.getNombre()))
                    .forEach(servicioRepositorio::save);
        };
    }

    private Servicio servicio(String nombre, String plataforma, String categoria, String descripcion, String precio,
            String calidad, String imagen, boolean destacado) {
        Servicio servicio = new Servicio();
        servicio.setNombre(nombre);
        servicio.setPlataforma(plataforma);
        servicio.setCategoria(categoria);
        servicio.setDescripcion(descripcion);
        servicio.setPrecio(new BigDecimal(precio));
        servicio.setCalidad(calidad);
        servicio.setDuracionDias(30);
        servicio.setImagen(imagen);
        servicio.setDestacado(destacado);
        servicio.setEstado("ACTIVO");
        return servicio;
    }
}
