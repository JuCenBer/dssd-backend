package grupo16.dssd.api_cloud.models;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "app_user")
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter @Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;

    @Column(name = "nombre_ong")
    private String nombreOng;

    @Column(name = "api_key")
    private String apiKey;

    @OneToMany(mappedBy = "userPedido")
    private List<PedidoColaboracion> pedidosColaboracion;

    @OneToMany(mappedBy = "userCompromiso")
    private List<CompromisoColaboracion> compromisosColaboracion;


}
