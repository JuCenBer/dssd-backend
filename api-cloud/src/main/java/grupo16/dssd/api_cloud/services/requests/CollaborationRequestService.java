package grupo16.dssd.api_cloud.services.requests;

import grupo16.dssd.api_cloud.dtos.CollaborationRequestDTO;
import grupo16.dssd.api_cloud.models.PedidoColaboracion;
import grupo16.dssd.api_cloud.repositories.CollaborationRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CollaborationRequestService {

    private final CollaborationRequestRepository collaborationRequestRepository;

    @Transactional
    public PedidoColaboracion createCollaboration(CollaborationRequestDTO collaborationRequest){
        PedidoColaboracion pedidoColaboracion = PedidoColaboracion
                .builder()
                .userPedido(collaborationRequest.getUserPedido())
                .proyectoPedido(collaborationRequest.getProyectoPedido())
                .nombre(collaborationRequest.getNombre())
                .fechaInicio(collaborationRequest.getFechaInicio())
                .fechaFin(collaborationRequest.getFechaFin())
                .recurso(collaborationRequest.getRecurso());
        return this.collaborationRequestRepository.save(pedidoColaboracion);
    }
}
