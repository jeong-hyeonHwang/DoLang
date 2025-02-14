package live.dolang.api.common.util;

import java.time.*;
import java.time.format.DateTimeFormatter;

public class UTCTimeUtil {

    // 새 포맷: "yyyy-MM-dd HH:mm:ss" (UTC 기준)
    private static final DateTimeFormatter CUSTOM_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss").withZone(ZoneOffset.UTC);

    /**
     * 주어진 밀리초(ms) 타임스탬프를 UTC 00:00:00 기준으로 변환 후, Instant 반환
     */
    public static Instant getUtcMidnightInstant(long timestampMillis) {
        // 1. 밀리초(ms) → Instant 변환
        Instant instant = Instant.ofEpochMilli(timestampMillis);

        // 2. 해당 Instant의 UTC 기준 00:00:00 Instant 변환
        return instant.atZone(ZoneOffset.UTC)
                .toLocalDate()
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();
    }

    /**
     * 현재 시간을 UTC 00:00:00 기준으로 변환 후, Instant 반환
     */
    public static Instant getTodayUTCInstant() {
        return getUtcMidnightInstant(Instant.now().toEpochMilli());
    }

    /**
     * 주어진 Instant가 속한 'UTC 날짜'의 시작(00:00:00) Instant 반환
     */
    public static Instant getStartOfDayUTC(Instant instant) {
        return instant.atZone(ZoneOffset.UTC)
                .toLocalDate()
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();
    }

    /**
     * 주어진 Instant가 속한 'UTC 날짜'의 다음날 자정 Instant 반환
     * - 예: 2025-02-12의 자정부터 2025-02-13 자정 직전까지
     */
    public static Instant getEndOfDayUTC(Instant instant) {
        return instant.atZone(ZoneOffset.UTC)
                .toLocalDate()
                .plusDays(1)
                .atStartOfDay(ZoneOffset.UTC)
                .toInstant();
    }

    /**
     * 주어진 Instant를 "yyyy-MM-dd HH:mm:ss" 포맷의 문자열로 변환
     * 예시: 2025-01-01 00:00:24
     */
    public static String formatInstant(Instant instant) {
        if (instant == null) {
            return null;
        }
        return CUSTOM_FORMATTER.format(instant);
    }
}
