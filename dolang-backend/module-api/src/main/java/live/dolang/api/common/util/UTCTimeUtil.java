package live.dolang.api.common.util;

import java.time.*;
import java.time.format.DateTimeFormatter;

public class UTCTimeUtil {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

    /**
     * 주어진 밀리초(ms) 타임스탬프를 UTC 00:00:00 기준으로 변환 후, Instant 반환
     */
    public static Instant getUtcMidnightInstant(long timestampMillis) {
        // 1. 밀리초(ms) → Instant 변환
        Instant instant = Instant.ofEpochMilli(timestampMillis);

        // 2. 해당 Instant의 UTC 기준 00:00:00 Instant 변환
        return instant.atZone(ZoneOffset.UTC).toLocalDate().atStartOfDay(ZoneOffset.UTC).toInstant();
    }

    /**
     * 현재 시간을 UTC 00:00:00 기준으로 변환 후, Instant 반환
     */
    public static Instant getCurrentMidnightInstant() {
        return getUtcMidnightInstant(Instant.now().toEpochMilli());
    }

    /**
     * 주어진 밀리초(ms) 타임스탬프를 UTC 00:00:00 기준으로 변환 후, ISO 8601 포맷 문자열 반환
     */
    public static String getUtcMidnightISO(long timestampMillis) {
        // UTC 00:00:00 Instant 생성
        Instant utcMidnight = getUtcMidnightInstant(timestampMillis);

        // ISO 8601 포맷으로 변환 후 반환
        return ISO_FORMATTER.format(utcMidnight.atOffset(ZoneOffset.UTC));
    }
}
