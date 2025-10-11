package grupo16.dssd.api_cloud.controllers.proyect;

import grupo16.dssd.api_cloud.dtos.ProjectDTO;
import grupo16.dssd.api_cloud.services.proyect.ProyectService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/proyect")
@RequiredArgsConstructor
public class ProyectControllerImpl implements I_ProyectController{

    private final ProyectService proyectService;

    @Override
    @PostMapping("/create")
    public ResponseEntity<?> createProject(@RequestBody ProjectDTO projectDTO ){
        this.proyectService.createProject(projectDTO);
        return ResponseEntity.ok("Proyecto creado.");
    }
}