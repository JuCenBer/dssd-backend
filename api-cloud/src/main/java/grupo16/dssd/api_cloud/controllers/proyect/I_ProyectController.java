package grupo16.dssd.api_cloud.controllers.proyect;

import grupo16.dssd.api_cloud.dtos.ProjectDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

public interface I_ProyectController {

    public ResponseEntity<?> createProject(@RequestBody ProjectDTO projectDTO);
}