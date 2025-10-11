package grupo16.dssd.api_cloud.controllers.colaboracion;

import grupo16.dssd.api_cloud.dtos.CollaborationRequestDTO;
import grupo16.dssd.api_cloud.services.requests.CollaborationRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/collaboration_request")
@RequiredArgsConstructor
public class CollaborationRequestController implements I_CollaborationRequestController {

    private final CollaborationRequestService collaborationRequestService;


    @Override
    @PostMapping("/create")
    public ResponseEntity<?> createRequest(@RequestBody CollaborationRequestDTO request) {
        this.collaborationRequestService.createCollaborationRequest(request);
        return ResponseEntity.ok("Colaboracion creada.");
    }
}
