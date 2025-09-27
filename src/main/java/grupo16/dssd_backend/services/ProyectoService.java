package grupo16.dssd_backend.services;

import grupo16.dssd_backend.dtos.ProyectoDTO;
import grupo16.dssd_backend.models.Proyecto;
import grupo16.dssd_backend.repositories.ProyectoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProyectoService implements I_ProyectoService{

    @Autowired
    private ProyectoRepository proyectoRepository;

    @Autowired
    private I_BonitaService bonitaService;

    @Override
    public void createProject(ProyectoDTO proyectoDTO) {
        Proyecto newProyecto = new Proyecto(proyectoDTO);
        this.proyectoRepository.save(newProyecto);
    }
}
