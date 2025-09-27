package grupo16.dssd_backend.models;

import grupo16.dssd_backend.dtos.ActividadDTO;
import grupo16.dssd_backend.dtos.ProyectoDTO;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
public class Proyecto {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String nombre;

    private Long caseId;

    private String descripcion;

    private String ubicacion;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "proyecto", orphanRemoval = true)
    private List<Actividad> actividades;

    public Proyecto(){
        this.actividades = new ArrayList<Actividad>();
    }

    public Proyecto(ProyectoDTO proyectoDTO){
        this.nombre = proyectoDTO.nombre();
        this.caseId = proyectoDTO.caseId();
        this.descripcion = proyectoDTO.descripcion();
        this.ubicacion = proyectoDTO.ubicacion();
        this.actividades = proyectoDTO.actividades().stream().map(Actividad::new).toList();
    }

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getUbicacion() {
        return ubicacion;
    }

    public void setUbicacion(String ubicacion) {
        this.ubicacion = ubicacion;
    }

    public List<Actividad> getActividades() {
        return actividades;
    }

    public Long getCaseId() {
        return caseId;
    }

    public void setCaseId(Long caseId) {
        this.caseId = caseId;
    }
}
