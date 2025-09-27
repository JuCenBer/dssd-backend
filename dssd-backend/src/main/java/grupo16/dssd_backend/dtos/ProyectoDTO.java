package grupo16.dssd_backend.dtos;

import java.time.LocalDate;
import java.util.List;

public record ProyectoDTO(
        String nombre,
        String descripcion,
        String ubicacion,
        Long caseId,
        List<ActividadDTO> actividades
) {

    public boolean validate(){
        if (nombre == null || nombre.isBlank()) {
            return false;
        }
        if (descripcion == null || descripcion.isBlank()) {
            return false;
        }
        if (ubicacion == null || ubicacion.isBlank()) {
            return false;
        }
        if (actividades == null || actividades.isEmpty()) {
            return false;
        }
        return true;
    }
}