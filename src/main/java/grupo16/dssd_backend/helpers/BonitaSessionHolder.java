package grupo16.dssd_backend.helpers;

import grupo16.dssd_backend.dtos.BonitaSession;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
public class BonitaSessionHolder {

    public static BonitaSession requireCurrent() {
        var attrs = (ServletRequestAttributes) RequestContextHolder.currentRequestAttributes();
        var session = attrs.getRequest().getSession(false);
        if (session == null) throw new IllegalStateException("Sin sesión");
        var bs = (BonitaSession) session.getAttribute("bonitaSession");
        return bs;
    }
}
