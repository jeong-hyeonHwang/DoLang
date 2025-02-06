package live.dolang.core.domain.date.repository;

import live.dolang.core.domain.date.Date;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface DateRepository extends JpaRepository<Date, LocalDateTime> {
}
