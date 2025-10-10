package grupo16.dssd.api_cloud.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    private Long caseId;

    private String description;

    private String ubicacion;

    @OneToMany(mappedBy = "proyectoPedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PedidoColaboracion> pedidosColaboracion;
}
