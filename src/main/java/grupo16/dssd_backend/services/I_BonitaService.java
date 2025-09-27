package grupo16.dssd_backend.services;

import grupo16.dssd_backend.dtos.BonitaSession;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface I_BonitaService {

    BonitaSession loginAndReturnCookies(String username, String password);

    void logout(BonitaSession session);

    Optional<String> getEnabledProcessIdByName(String processName);

    Map<String, Object> instantiateProcess(String processId, Map<String, Object> contract);

    List<Map<String, Object>> findReadyTasksByCase(String caseId);

    void assignTask(String taskId, String userId);

    void executeUserTask(String taskId, Map<String, Object> contract);
}
