package grupo16.dssd.api_cloud.repositories;

import grupo16.dssd.api_cloud.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<Long, User> {

    Optional<User> findByUsername(String username);
}
