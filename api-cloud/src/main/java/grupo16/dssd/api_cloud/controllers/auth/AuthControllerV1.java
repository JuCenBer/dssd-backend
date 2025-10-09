package grupo16.dssd.api_cloud.controllers.auth;

import grupo16.dssd.api_cloud.dtos.AuthResponse;
import grupo16.dssd.api_cloud.dtos.LoginRequest;
import grupo16.dssd.api_cloud.dtos.RegisterRequest;
import grupo16.dssd.api_cloud.services.auth.AuthService;
import grupo16.dssd.api_cloud.services.users.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin("*")
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthControllerV1 implements I_AuthController {

    private final UserService userService;
    private final AuthService authService;

    @Override
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = this.authService.authenticate(request.username(), request.apiKey());
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @Override
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {

        try {
            this.userService.register(
                    request.username(),
                    request.nombreOng(),
                    request.apiKey()
            );
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Algo se rompió :c "+ e.getMessage());
        }

        return ResponseEntity.ok("User registered successfully");
    }
}
