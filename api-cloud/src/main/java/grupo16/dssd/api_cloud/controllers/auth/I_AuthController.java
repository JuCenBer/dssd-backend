package grupo16.dssd.api_cloud.controllers.auth;

import grupo16.dssd.api_cloud.dtos.LoginRequest;
import org.springframework.http.ResponseEntity;

public interface I_AuthController {

    ResponseEntity<?> login(LoginRequest request);
}
