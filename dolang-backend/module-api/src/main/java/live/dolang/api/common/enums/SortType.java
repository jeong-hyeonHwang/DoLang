package live.dolang.api.common.enums;

import live.dolang.api.common.exception.InvalidSortTypeException;

import java.util.Arrays;

public enum SortType {
    LIKE, LATEST;

    /**
     * 주어진 문자열이 Enum에 존재하는 값인지 확인
     */
    public static boolean isValid(String sort) {
        return Arrays.stream(SortType.values())
                .anyMatch(s -> s.name().equalsIgnoreCase(sort));
    }

    /**
     * 문자열을 Enum으로 변환 (없으면 예외 발생)
     */
    public static SortType fromString(String sort) {
        return Arrays.stream(SortType.values())
                .filter(s -> s.name().equalsIgnoreCase(sort))
                .findFirst()
                .orElseThrow(() -> new InvalidSortTypeException(sort));
    }

    @Override
    public String toString() {
        return name().toLowerCase();
    }
}
