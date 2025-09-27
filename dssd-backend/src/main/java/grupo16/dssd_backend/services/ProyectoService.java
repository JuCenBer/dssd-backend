package grupo16.dssd_backend.services;

import grupo16.dssd_backend.dtos.ProyectoDTO;
import grupo16.dssd_backend.helpers.NombresProcesos;
import grupo16.dssd_backend.models.Proyecto;
import grupo16.dssd_backend.repositories.ProyectoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProyectoService implements I_ProyectoService{

    private final ProyectoRepository proyectoRepository;
    private final I_BonitaService bonitaService;

    public ProyectoService(ProyectoRepository proyectoRepository, I_BonitaService bonitaService) {
        this.proyectoRepository = proyectoRepository;
        this.bonitaService = bonitaService;
    }

    @Override
    @Transactional
    public void createProject(ProyectoDTO proyectoDTO) {

        // AGREGAR VALLIDACIÓN DE DATOS
        Proyecto newProyecto = new Proyecto(proyectoDTO);

        Long caseId = this.bonitaService.iniciarProcesoCreacionProyecto();

        newProyecto.setCaseId(caseId);

        this.proyectoRepository.save(newProyecto);

    }
}
