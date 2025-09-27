package grupo16.dssd_backend.models;

import grupo16.dssd_backend.dtos.ActividadDTO;
import grupo16.dssd_backend.dtos.ProyectoDTO;

import java.util.ArrayList;
import java.util.List;

public class Proyecto {

    private String nombre;
    private String caseId;
    private String descripcion;
    private String ubicacion;
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

    public String getCaseId() {
        return caseId;
    }

    public void setCaseId(String caseId) {
        this.caseId = caseId;
    }
}
