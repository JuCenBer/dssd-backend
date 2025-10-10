package grupo16.dssd.api_cloud.dtos;

import grupo16.dssd.api_cloud.models.Proyecto;
import grupo16.dssd.api_cloud.models.Recurso;
import grupo16.dssd.api_cloud.models.User;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class CollaborationRequestDTO {

    private User userPedido;
    private Proyecto proyectoPedido;
    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Recurso recurso;
}
