package grupo16.dssd_backend.models;

import grupo16.dssd_backend.dtos.ActividadDTO;
import org.springframework.cglib.core.Local;

import java.time.LocalDate;
import java.util.Date;

public class Actividad {

    private String nombre;
    private LocalDate fechaInicio;
    private LocalDate fechaFin;
    private Enum<Recurso> recurso;
    private Boolean requiereColaboracion;

    public Actividad(){

    }

    public Actividad(ActividadDTO actividadDTO){
        this.nombre = actividadDTO.nombre();
        this.fechaInicio = actividadDTO.fechaInicio();
        this.fechaFin = actividadDTO.fechaFin();
        this.recurso = Recurso.valueOf(actividadDTO.recurso());
        this.requiereColaboracion = actividadDTO.requiereColaboracion();
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public LocalDate getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDate fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDate getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDate fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Enum<Recurso> getRecurso() {
        return recurso;
    }

    public void setRecurso(Enum<Recurso> recurso) {
        this.recurso = recurso;
    }

    public Boolean getRequiereColaboracion() {
        return requiereColaboracion;
    }

    public void setRequiereColaboracion(Boolean requiereColaboracion) {
        this.requiereColaboracion = requiereColaboracion;
    }
}
