package grupo16.dssd.api_cloud.repositories;

import grupo16.dssd.api_cloud.models.PedidoColaboracion;
import grupo16.dssd.api_cloud.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CollaborationRequestRepository extends JpaRepository<PedidoColaboracion, Long> {
}
