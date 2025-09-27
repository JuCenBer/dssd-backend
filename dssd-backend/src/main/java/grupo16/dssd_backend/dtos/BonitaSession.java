package grupo16.dssd_backend.dtos;

public record BonitaSession(String userId, String jsessionId, String xBonitaToken, long createdAtEpochMs) {}
