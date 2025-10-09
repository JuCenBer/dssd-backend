package grupo16.dssd.api_cloud.services.users;

import grupo16.dssd.api_cloud.models.User;
import grupo16.dssd.api_cloud.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(String username, String nombreOng, String password) throws Exception {

        if (userRepository.existsByUsername(username)) {
            throw new Exception("Username is already registered");
        }

        User user = User
                .builder()
                .nombreOng(nombreOng)
                .username(username)
                .apiKey(passwordEncoder.encode(password))
                .build();

        try {
            user = userRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new Exception("Username is already registered");
        }

        return user;
    }
}
