package grupo16.dssd.api_cloud.services.proyect;

import grupo16.dssd.api_cloud.dtos.ProjectDTO;
import grupo16.dssd.api_cloud.models.PedidoColaboracion;
import grupo16.dssd.api_cloud.models.Proyecto;
import grupo16.dssd.api_cloud.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ProyectService {

    private final ProjectRepository projectRepository;

    @Transactional
    public Proyecto createProject(ProjectDTO projectDTO){
        Proyecto proyecto = Proyecto.builder()
                .caseId(projectDTO.getCaseId())
                .name(projectDTO.getName())
                .description(projectDTO.getDescription())
                .ubicacion(projectDTO.getUbicacion())
                .build();
        return this.projectRepository.save(proyecto);
    }
}
