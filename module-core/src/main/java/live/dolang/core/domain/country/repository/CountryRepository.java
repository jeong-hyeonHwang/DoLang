package live.dolang.core.domain.country.repository;

import live.dolang.core.domain.country.Country;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CountryRepository extends JpaRepository<Country, String> {
}
