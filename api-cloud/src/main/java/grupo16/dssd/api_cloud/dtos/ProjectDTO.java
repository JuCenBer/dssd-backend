package grupo16.dssd.api_cloud.dtos;

import grupo16.dssd.api_cloud.models.PedidoColaboracion;
import jakarta.persistence.CascadeType;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@RequiredArgsConstructor
@NoArgsConstructor
public class ProjectDTO {

    private String name;

    private Long caseId;

    private String description;

    private String ubicacion;

    private List<CollaborationRequestDTO> pedidosColaboracion;
}
