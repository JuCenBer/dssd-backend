package grupo16.dssd_backend.controllers;

import grupo16.dssd_backend.dtos.LoginDTO;
import grupo16.dssd_backend.dtos.ProyectoDTO;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;

public interface I_API {

    ResponseEntity<?> login(LoginDTO req, HttpServletRequest httpReq);

    ResponseEntity<?> crearProyecto(ProyectoDTO proyectoDTO);

    ResponseEntity<?> logout(HttpServletRequest req);

}
