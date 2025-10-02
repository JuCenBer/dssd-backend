package grupo16.dssd_backend.controllers;

import grupo16.dssd_backend.dtos.BonitaSession;
import grupo16.dssd_backend.dtos.LoginDTO;
import grupo16.dssd_backend.dtos.ProyectoDTO;
import grupo16.dssd_backend.helpers.BonitaSessionHolder;
import grupo16.dssd_backend.services.I_BonitaService;
import grupo16.dssd_backend.services.I_ProyectoService;
import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/")
class APIControllerV1 implements I_API {

    private final I_BonitaService bonitaService;
    private final I_ProyectoService proyectoService;

    public APIControllerV1(I_BonitaService bonitaService, I_ProyectoService proyectoService) {
        this.bonitaService = bonitaService;
        this.proyectoService = proyectoService;
    }

    @Override
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO req, HttpServletRequest httpReq) {
        var cookies = this.bonitaService.loginAndReturnCookies(req.username(), req.password());
        // guardar en sesión
        var session = httpReq.getSession(true);
        session.setAttribute("bonitaSession", new BonitaSession(
                req.username(), cookies.jsessionId(), cookies.xBonitaToken(), System.currentTimeMillis()));
        return ResponseEntity.ok().body(Map.of("message", "Sesion iniciada correctamente"));
    }

    @Override
    @PostMapping("/crear-proyecto")
    public ResponseEntity<?> crearProyecto(@RequestBody ProyectoDTO proyectoDTO) {

        //if (BonitaSessionHolder.getBonitaSession() == null) {
        //    return ResponseEntity.status(401).body("No autenticado");
 //       }
   //     if(!proyectoDTO.validate()){
     //       return ResponseEntity.status(500).body("Datos invalidos");
       // }

        //this.proyectoService.createProject(proyectoDTO);
        //return ResponseEntity.ok().build();
        if (BonitaSessionHolder.getBonitaSession() == null) {
            return ResponseEntity.status(401).body(Map.of("error", "No autenticado"));
        }
        if(!proyectoDTO.validate()){
            return ResponseEntity.status(400).body(Map.of("error", "Datos inválidos"));
        }

        this.proyectoService.createProject(proyectoDTO);
        return ResponseEntity.ok(Map.of("message", "Proyecto creado exitosamente"));
    }

    @Override
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // opcional: llamar a /bonita/logoutservice con las cookies actuales
            var bs = (BonitaSession) request.getSession(false).getAttribute("bonitaSession");
            if (bs != null) bonitaService.logout(bs);
        } finally {
            if (request.getSession(false) != null) request.getSession(false).invalidate();
        }
        return ResponseEntity.noContent().build();
    }
}

