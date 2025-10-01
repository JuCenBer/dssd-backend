package grupo16.dssd_backend.dtos;

public record BonitaSession(String username, String jsessionId, String xBonitaToken, long createdAtEpochMs) {}
