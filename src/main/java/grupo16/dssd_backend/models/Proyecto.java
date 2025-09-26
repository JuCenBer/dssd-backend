package grupo16.dssd_backend.models;

import java.util.List;

public class Proyecto {

    private String nombre;
    private String descripcion;
    private String lugar;
    private List<Actividad> actividades;

    public String getNombre() {
        return nombre;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public String getLugar() {
        return lugar;
    }

    public List<Actividad> getActividades() {
        return actividades;
    }
}
