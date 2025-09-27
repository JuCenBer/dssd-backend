package grupo16.dssd_backend.models;

import java.util.Date;

public class Actividad {

    private String nombre;
    private Date fechaInicio;
    private Date fechaFin;
    private Enum<Recurso> recurso;
    private Boolean requiereColaboracion;

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Date getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(Date fechaFin) {
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
