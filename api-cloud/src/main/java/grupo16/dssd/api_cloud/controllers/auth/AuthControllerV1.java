package grupo16.dssd.api_cloud.controllers.auth;

import grupo16.dssd.api_cloud.dtos.AuthResponse;
import grupo16.dssd.api_cloud.dtos.LoginRequest;
import grupo16.dssd.api_cloud.services.auth.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthControllerV1 implements I_AuthController {

//    private final UserService userService;
    private final AuthService authService;

    @Override
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = this.authService.authenticate(request.username(), request.apiKey());
        return ResponseEntity.ok(new AuthResponse(token));
    }
}
