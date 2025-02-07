package live.dolang.matching;

import javax.security.auth.Subject;
import java.security.Principal;

public class MatchingPrincipal implements Principal {
    @Override
    public String getName() {
        return "";
    }

    @Override
    public boolean implies(Subject subject) {
        return Principal.super.implies(subject);
    }
}
