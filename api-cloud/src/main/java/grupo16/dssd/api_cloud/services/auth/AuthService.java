package grupo16.dssd.api_cloud.services.auth;

import grupo16.dssd.api_cloud.models.CustomUserDetails;
import grupo16.dssd.api_cloud.utils.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.HashMap;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtil;

    public String authenticate(String username, String apiKey) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, apiKey)
        );

        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        return jwtUtil.generateToken(user.getUsername(), new HashMap<>());
    }
}
