package grupo16.dssd.api_cloud.services.requests;

import grupo16.dssd.api_cloud.dtos.CollaborationRequestDTO;
import grupo16.dssd.api_cloud.models.PedidoColaboracion;
import grupo16.dssd.api_cloud.models.Proyecto;
import grupo16.dssd.api_cloud.repositories.CollaborationRequestRepository;
import grupo16.dssd.api_cloud.repositories.ProjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CollaborationRequestService {

    private final CollaborationRequestRepository collaborationRequestRepository;
    private final ProjectRepository projectRepository;

    @Transactional
    public PedidoColaboracion createCollaborationRequest(CollaborationRequestDTO collaborationRequest){
        Proyecto proyecto = this.projectRepository.getReferenceById(collaborationRequest.getProyectoId());
        PedidoColaboracion pedidoColaboracion = PedidoColaboracion.builder()
                .userPedido(collaborationRequest.getUserPedido())
                .proyectoPedido(proyecto)
                .nombre(collaborationRequest.getNombre())
                .fechaInicio(collaborationRequest.getFechaInicio())
                .fechaFin(collaborationRequest.getFechaFin())
                .recurso(collaborationRequest.getRecurso())
                .build();
        proyecto.getPedidosColaboracion().add(pedidoColaboracion);
        return this.collaborationRequestRepository.save(pedidoColaboracion);
    }
}
