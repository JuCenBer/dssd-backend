package grupo16.dssd.api_cloud.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter @Builder
public class CompromisoColaboracion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private User userCompromiso;

    private String descripcion;

    @ManyToOne
    @JoinColumn(name = "pedido_id", nullable = false)
    private PedidoColaboracion pedidoColaboracion;

}
