package grupo16.dssd_backend.dtos;

import java.time.LocalDate;
import java.util.List;

public record ProyectoDTO(
        String nombre,
        String descripcion,
        String ubicacion,
        List<ActividadDTO> actividades
) {}

