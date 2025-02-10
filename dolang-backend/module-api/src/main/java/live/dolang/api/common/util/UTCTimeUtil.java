package live.dolang.api.common.util;

import java.time.*;
import java.time.format.DateTimeFormatter;

public class UTCTimeUtil {

    private static final DateTimeFormatter ISO_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss'Z'");

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
     * 주어진 밀리초(ms) 타임스탬프를 UTC 00:00:00 기준으로 변환 후, ISO 8601 포맷 문자열 반환
     */
    public static String getUtcMidnightISO(long timestampMillis) {
        // UTC 00:00:00 Instant 생성
        Instant utcMidnight = getUtcMidnightInstant(timestampMillis);

        // ISO 8601 포맷으로 변환 후 반환
        return ISO_FORMATTER.format(utcMidnight.atOffset(ZoneOffset.UTC));
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
