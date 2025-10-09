package grupo16.dssd.api_cloud.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter @Setter @Builder
public class PedidoColaboracion {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private User userPedido;

    // Atributos de la Actividad:
    private String nombre;

    private LocalDate fechaInicio;

    private LocalDate fechaFin;

    @Enumerated(EnumType.STRING)
    private Recurso recurso;

    @OneToMany(mappedBy = "pedidoColaboracion", orphanRemoval = true)
    private List<CompromisoColaboracion> compromisosColaboracion;

    // Preguntar si haría falta info del proyecto





}
