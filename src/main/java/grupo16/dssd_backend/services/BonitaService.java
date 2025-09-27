package grupo16.dssd_backend.services;

import grupo16.dssd_backend.dtos.BonitaSession;
import grupo16.dssd_backend.helpers.BonitaSessionHolder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

import java.net.HttpCookie;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;

@Service
class BonitaService implements I_BonitaService{

    private final RestClient client;
    private final BonitaSessionHolder sessionHolder;

    private final AtomicReference<String> jsessionId = new AtomicReference<>();
    private final AtomicReference<String> xBonitaToken = new AtomicReference<>();

    public BonitaService(@Value("${bonita.base-url:http://localhost:8080/bonita}") String baseUrl, BonitaSessionHolder sessionHolder) {
        this.client = RestClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
                .build();

        this.sessionHolder = sessionHolder;
    }

    @Override
    public BonitaSession loginAndReturnCookies(String username, String password) {
        MultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        form.add("username", username);
        form.add("password", password);
        form.add("redirect", "false");

        return client.post()
            .uri("/loginservice")
            .contentType(MediaType.APPLICATION_FORM_URLENCODED)
            .body(form)
            .exchange((req, resp) -> {
                // Tomamos Set-Cookie
                List<String> setCookies = resp.getHeaders().get(HttpHeaders.SET_COOKIE);
                if (setCookies == null || setCookies.isEmpty()) {
                    String body = resp.bodyTo(String.class);
                    throw new IllegalStateException("Login Bonita falló: sin Set-Cookie. Body: " + body);
                }

                Map<String, String> cookies = parseSetCookieHeaders(setCookies);
                String js = cookies.get("JSESSIONID");
                String xt = cookies.get("X-Bonita-API-Token");

                if (js == null || xt == null) {
                    throw new IllegalStateException(
                            "Login Bonita: faltan cookies JSESSIONID/X-Bonita-API-Token.");
                }

                // También podés seguir guardándolos en el service si querés
                jsessionId.set(js);
                xBonitaToken.set(xt);

                return new BonitaSession(username, js, xt, System.currentTimeMillis());
            });
    }

    @Override
    public void logout(BonitaSession session) {

    }

    @Override
    public Optional<String> getEnabledProcessIdByName(String processName) {
        List<Map<String, Object>> procs = client.get()
                .uri(uriBuilder -> uriBuilder
                        .path("/API/bpm/process")
                        .queryParam("p", "0")
                        .queryParam("c", "10")
                        .queryParam("f", "name=" + processName)
                        .queryParam("f", "activationState=ENABLED")
                        .build())
                .headers(this::withAuth)
                .retrieve()
                .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});

        if (procs == null || procs.isEmpty()) return Optional.empty();

        // si hay varias versiones, elegimos la mayor (podés cambiar a deploymentDate)
        return procs.stream()
            .max(Comparator.comparing(m -> String.valueOf(m.get("version"))))
            .map(m -> String.valueOf(m.get("id")));
    }

    @Override
    public Map<String, Object> instantiateProcess(String processId, Map<String, Object> contract) {
        return client.post()
            .uri("/API/bpm/process/{id}/instantiation", processId)
            .headers(this::withAuth)
            .contentType(MediaType.APPLICATION_JSON)
            .body(contract != null ? contract : Map.of())
            .retrieve()
            .body(new ParameterizedTypeReference<Map<String, Object>>() {});
    }

    @Override
    public List<Map<String, Object>> findReadyTasksByCase(String caseId) {
        return client.get()
            .uri(uriBuilder -> uriBuilder
                .path("/API/bpm/humanTask")
                .queryParam("p", "0")
                .queryParam("c", "50")
                .queryParam("f", "state=ready")
                .queryParam("f", "caseId=" + caseId)
                .build())
            .headers(this::withAuth)
            .retrieve()
            .body(new ParameterizedTypeReference<List<Map<String, Object>>>() {});
    }

    @Override
    public void assignTask(String taskId, String userId) {
        client.put()
            .uri("/API/bpm/humanTask/{id}", taskId)
            .headers(this::withAuth)
            .contentType(MediaType.APPLICATION_JSON)
            .body(Map.of("assigned_id", userId))
            .retrieve()
            .toBodilessEntity();
    }

    @Override
    public void executeUserTask(String taskId, Map<String, Object> contract) {
        client.post()
            .uri("/API/bpm/userTask/{id}/execution", taskId)
            .headers(this::withAuth)
            .contentType(MediaType.APPLICATION_JSON)
            .body(contract != null ? contract : Map.of())
            .retrieve()
            .toBodilessEntity();
    }

    private void withAuth(HttpHeaders headers) {
        String js = jsessionId.get();
        String xt = xBonitaToken.get();
        if (js == null || xt == null) {
            throw new IllegalStateException("No hay sesión Bonita. Llamá a login() primero.");
        }
        headers.add(HttpHeaders.COOKIE, "JSESSIONID=" + js + "; X-Bonita-API-Token=" + xt);
        // para POST/PUT/DELETE Bonita exige también el header X-Bonita-API-Token
        headers.add("X-Bonita-API-Token", xt);
    }

    private static Map<String, String> parseSetCookieHeaders(List<String> setCookies) {
        // convierte múltiples Set-Cookie en un mapa nombre->valor
        Map<String, String> out = new HashMap<>();
        for (String sc : setCookies) {
            // HttpCookie.parse maneja atributos; tomamos el primero (nombre=valor)
            List<HttpCookie> parsed = HttpCookie.parse(sc);
            for (HttpCookie ck : parsed) {
                out.put(ck.getName(), ck.getValue());
            }
        }
        return out;
    }
}
