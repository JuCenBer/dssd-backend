package grupo16.dssd.api_cloud.dtos;

import java.time.LocalDate;

public record RegisterRequest(
        String username,

        String nombreOng,

        String apiKey
) {
}
