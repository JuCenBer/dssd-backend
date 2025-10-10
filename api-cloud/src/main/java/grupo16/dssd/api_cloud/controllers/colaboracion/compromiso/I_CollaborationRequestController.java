package grupo16.dssd.api_cloud.controllers.colaboracion.compromiso;

import grupo16.dssd.api_cloud.dtos.CollaborationRequestDTO;
import org.springframework.http.ResponseEntity;

public interface I_CollaborationRequestController {

    ResponseEntity<?> createRequest(CollaborationRequestDTO request);
}
