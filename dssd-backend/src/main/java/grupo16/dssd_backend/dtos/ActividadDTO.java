package grupo16.dssd_backend.dtos;

import java.time.LocalDate;

public record ActividadDTO(
        String nombre,
        LocalDate fechaInicio,
        LocalDate fechaFin,
        String recurso,
        boolean requiereColaboracion
) {}
