
USE dolang;

INSERT INTO users (user_id, email, google_id, created_at, is_deleted)
VALUES
    (2, 'user2@example.com', 'google2', NOW(), 0),
    (3, 'user3@example.com', 'google3', NOW(), 0),
    (4, 'user4@example.com', 'google4', NOW(), 0),
    (5, 'user5@example.com', 'google5', NOW(), 0),
    (6, 'user6@example.com', 'google6', NOW(), 0);


INSERT INTO languages (
    language_id
) VALUES
      ('ko'),
      ('en');

INSERT INTO language_levels (
    language_level_id
) VALUES
      ('A1'),
      ('A2'),
      ('B1'),
      ('B2'),
      ('C1'),
      ('C2');

INSERT INTO dates (
    date_id
) VALUES
      ('2025-02-08 00:00:00'),
      ('2025-02-09 00:00:00'),
      ('2025-02-10 00:00:00'),
      ('2025-02-11 00:00:00'),
      ('2025-02-12 00:00:00'),
      ('2025-02-13 00:00:00'),
      ('2025-02-14 00:00:00'),
      ('2025-02-15 00:00:00'),
      ('2025-02-16 00:00:00'),
      ('2025-02-17 00:00:00'),
      ('2025-02-18 00:00:00'),
      ('2025-02-19 00:00:00'),
      ('2025-02-20 00:00:00'),
      ('2025-02-21 00:00:00');

INSERT INTO dolang.user_profiles
(user_id, gender, profile_image_url, nickname, created_at, updated_at, country_id, native_language_id, interest_language_id)
VALUES
    (1, 'F', 'http://example.com/images/1.jpg', 'User1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'KR', 'ko', 'en'),
    (2, 'F', 'http://example.com/images/2.jpg', 'User2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'KR', 'ko', 'en'),
    (3, 'M', 'http://example.com/images/3.jpg', 'User3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'JP', 'en', 'ko'),
    (4, 'F', 'http://example.com/images/4.jpg', 'User4', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'FR', 'ko', 'en'),
    (5, 'M', 'http://example.com/images/5.jpg', 'User5', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'DE', 'en', 'ko'),
    (6, 'F', 'http://example.com/images/6.jpg', 'User6', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'ES', 'ko', 'en');


USE dolang;
INSERT INTO date_sentences (sentence_id, sentence, date_id, level, language_id)
VALUES
    (1, 'EN-SENTENCE-A1', '2025-02-15 00:00:00', 'A1', 'en'),
    (2, 'EN-SENTENCE-A2', '2025-02-15 00:00:00', 'A2', 'en'),
    (3, 'EN-SENTENCE-B1', '2025-02-15 00:00:00', 'B1', 'en'),
    (4, 'EN-SENTENCE-B2', '2025-02-15 00:00:00', 'B2', 'en'),
    (5, 'EN-SENTENCE-C1', '2025-02-15 00:00:00', 'C1', 'en'),
    (6, 'EN-SENTENCE-C2', '2025-02-15 00:00:00', 'C2', 'en'),
    (7, 'KO-문장-A1', '2025-02-15 00:00:00', 'A1', 'ko'),
    (8, 'KO-문장-A2', '2025-02-15 00:00:00', 'A2', 'ko'),
    (9, 'KO-문장-B1', '2025-02-15 00:00:00', 'B1', 'ko'),
    (10, 'KO-문장-B2', '2025-02-15 00:00:00', 'B2', 'ko'),
    (11, 'KO-문장-C1', '2025-02-15 00:00:00', 'C1', 'ko'),
    (12, 'KO-문장-C2', '2025-02-15 00:00:00', 'C2', 'ko');

-- 3) user_date_sentences 테이블 더미 데이터
INSERT INTO user_date_sentences (
    user_id, date_sentence_id, user_date_sentences_url, created_at
) VALUES
            -- en
      -- Feed 1 (date_sentence_id = 1): 사용자 2, 3, 4
      (2, 1, 'http://example.com/sentence1_user2', NOW()),
      (3, 1, 'http://example.com/sentence1_user3', NOW()),
      (4, 1, 'http://example.com/sentence1_user4', NOW()),

      -- Feed 2 (date_sentence_id = 2): 사용자 3, 4, 5
      (3, 2, 'http://example.com/sentence2_user3', NOW()),
      (4, 2, 'http://example.com/sentence2_user4', NOW()),
      (5, 2, 'http://example.com/sentence2_user5', NOW()),

      -- Feed 3 (date_sentence_id = 3): 사용자 4, 5, 6
      (4, 3, 'http://example.com/sentence3_user4', NOW()),
      (5, 3, 'http://example.com/sentence3_user5', NOW()),
      (6, 3, 'http://example.com/sentence3_user6', NOW()),

      -- Feed 4 (date_sentence_id = 4): 사용자 2, 5, 6
      (2, 4, 'http://example.com/sentence4_user2', NOW()),
      (5, 4, 'http://example.com/sentence4_user5', NOW()),
      (6, 4, 'http://example.com/sentence4_user6', NOW()),

      -- Feed 5 (date_sentence_id = 5): 사용자 2, 3, 6
      (2, 5, 'http://example.com/sentence5_user2', NOW()),
      (3, 5, 'http://example.com/sentence5_user3', NOW()),
      (6, 5, 'http://example.com/sentence5_user6', NOW()),
      
      -- Feed 6 (date_sentence_id = 6): 사용자 2, 4, 6
      (2, 6, 'http://example.com/sentence5_user2', NOW()),
      (4, 6, 'http://example.com/sentence5_user4', NOW()),
      (5, 6, 'http://example.com/sentence5_user5', NOW()),
      
      -- kr
      -- Feed 1 (date_sentence_id = 7): 사용자 2, 3, 4
      (2, 7, 'http://example.com/sentence1_user2', NOW()),
      (3, 7, 'http://example.com/sentence1_user3', NOW()),
      (4, 7, 'http://example.com/sentence1_user4', NOW()),

      -- Feed 2 (date_sentence_id = 8): 사용자 3, 4, 5
      (3, 8, 'http://example.com/sentence2_user3', NOW()),
      (4, 8, 'http://example.com/sentence2_user4', NOW()),
      (5, 8, 'http://example.com/sentence2_user5', NOW()),

      -- Feed 3 (date_sentence_id = 9): 사용자 4, 5, 6
      (4, 9, 'http://example.com/sentence3_user4', NOW()),
      (5, 9, 'http://example.com/sentence3_user5', NOW()),
      (6, 9, 'http://example.com/sentence3_user6', NOW()),

      -- Feed 4 (date_sentence_id = 10): 사용자 2, 5, 6
      (2, 10, 'http://example.com/sentence4_user2', NOW()),
      (5, 10, 'http://example.com/sentence4_user5', NOW()),
      (6, 10, 'http://example.com/sentence4_user6', NOW()),

      -- Feed 5 (date_sentence_id = 11): 사용자 2, 3, 6
      (2, 11, 'http://example.com/sentence5_user2', NOW()),
      (3, 11, 'http://example.com/sentence5_user3', NOW()),
      (6, 11, 'http://example.com/sentence5_user6', NOW()),
      
      -- Feed 6 (date_sentence_id = 6): 사용자 2, 4, 6
      (2, 12, 'http://example.com/sentence5_user2', NOW()),
      (4, 12, 'http://example.com/sentence5_user4', NOW()),
      (5, 12, 'http://example.com/sentence5_user5', NOW());

-- ======================================================
-- 1. date_sentences 테이블 (2025‑02‑16 ~ 2025‑02‑22)
-- ======================================================

/*
  날짜별 sentence_id 매핑
  2025-02-15: 이미 삽입이 되어있다고 가정
  2025-02-16: 13  ~ 24
  2025-02-17: 25  ~ 36
  2025-02-18: 37  ~ 48
  2025-02-19: 49  ~ 60
  2025-02-20: 61  ~ 72
  2025-02-21: 73  ~ 84
  2025-02-22: 85  ~ 96
*/

-- 2025-02-16 (sentence_id 13 ~ 24)
INSERT INTO date_sentences (sentence_id, sentence, date_id, level, language_id)
VALUES
    (13, '0216-EN-SENTENCE-A1', '2025-02-16 00:00:00', 'A1', 'en'),
    (14, '0216-EN-SENTENCE-A2', '2025-02-16 00:00:00', 'A2', 'en'),
    (15, '0216-EN-SENTENCE-B1', '2025-02-16 00:00:00', 'B1', 'en'),
    (16, '0216-EN-SENTENCE-B2', '2025-02-16 00:00:00', 'B2', 'en'),
    (17, '0216-EN-SENTENCE-C1', '2025-02-16 00:00:00', 'C1', 'en'),
    (18, '0216-EN-SENTENCE-C2', '2025-02-16 00:00:00', 'C2', 'en'),
    (19, '0216-KO-문장-A1',      '2025-02-16 00:00:00', 'A1', 'ko'),
    (20, '0216-KO-문장-A2',      '2025-02-16 00:00:00', 'A2', 'ko'),
    (21, '0216-KO-문장-B1',      '2025-02-16 00:00:00', 'B1', 'ko'),
    (22, '0216-KO-문장-B2',      '2025-02-16 00:00:00', 'B2', 'ko'),
    (23, '0216-KO-문장-C1',      '2025-02-16 00:00:00', 'C1', 'ko'),
    (24, '0216-KO-문장-C2',      '2025-02-16 00:00:00', 'C2', 'ko');

-- 2025-02-17 (sentence_id 25 ~ 36)
INSERT INTO date_sentences (sentence_id, sentence, date_id, level, language_id)
VALUES
    (25, '0217-EN-SENTENCE-A1', '2025-02-17 00:00:00', 'A1', 'en'),
    (26, '0217-EN-SENTENCE-A2', '2025-02-17 00:00:00', 'A2', 'en'),
    (27, '0217-EN-SENTENCE-B1', '2025-02-17 00:00:00', 'B1', 'en'),
    (28, '0217-EN-SENTENCE-B2', '2025-02-17 00:00:00', 'B2', 'en'),
    (29, '0217-EN-SENTENCE-C1', '2025-02-17 00:00:00', 'C1', 'en'),
    (30, '0217-EN-SENTENCE-C2', '2025-02-17 00:00:00', 'C2', 'en'),
    (31, '0217-KO-문장-A1',      '2025-02-17 00:00:00', 'A1', 'ko'),
    (32, '0217-KO-문장-A2',      '2025-02-17 00:00:00', 'A2', 'ko'),
    (33, '0217-KO-문장-B1',      '2025-02-17 00:00:00', 'B1', 'ko'),
    (34, '0217-KO-문장-B2',      '2025-02-17 00:00:00', 'B2', 'ko'),
    (35, '0217-KO-문장-C1',      '2025-02-17 00:00:00', 'C1', 'ko'),
    (36, '0217-KO-문장-C2',      '2025-02-17 00:00:00', 'C2', 'ko');

-- 2025-02-18 (sentence_id 37 ~ 48)
INSERT INTO date_sentences (sentence_id, sentence, date_id, level, language_id)
VALUES
    (37, '0218-EN-SENTENCE-A1', '2025-02-18 00:00:00', 'A1', 'en'),
    (38, '0218-EN-SENTENCE-A2', '2025-02-18 00:00:00', 'A2', 'en'),
    (39, '0218-EN-SENTENCE-B1', '2025-02-18 00:00:00', 'B1', 'en'),
    (40, '0218-EN-SENTENCE-B2', '2025-02-18 00:00:00', 'B2', 'en'),
    (41, '0218-EN-SENTENCE-C1', '2025-02-18 00:00:00', 'C1', 'en'),
    (42, '0218-EN-SENTENCE-C2', '2025-02-18 00:00:00', 'C2', 'en'),
    (43, '0218-KO-문장-A1',      '2025-02-18 00:00:00', 'A1', 'ko'),
    (44, '0218-KO-문장-A2',      '2025-02-18 00:00:00', 'A2', 'ko'),
    (45, '0218-KO-문장-B1',      '2025-02-18 00:00:00', 'B1', 'ko'),
    (46, '0218-KO-문장-B2',      '2025-02-18 00:00:00', 'B2', 'ko'),
    (47, '0218-KO-문장-C1',      '2025-02-18 00:00:00', 'C1', 'ko'),
    (48, '0218-KO-문장-C2',      '2025-02-18 00:00:00', 'C2', 'ko');

-- 2025-02-19 (sentence_id 49 ~ 60)
INSERT INTO date_sentences (sentence_id, sentence, date_id, level, language_id)
VALUES
    (49, '0219-EN-SENTENCE-A1', '2025-02-19 00:00:00', 'A1', 'en'),
    (50, '0219-EN-SENTENCE-A2', '2025-02-19 00:00:00', 'A2', 'en'),
    (51, '0219-EN-SENTENCE-B1', '2025-02-19 00:00:00', 'B1', 'en'),
    (52, '0219-EN-SENTENCE-B2', '2025-02-19 00:00:00', 'B2', 'en'),
    (53, '0219-EN-SENTENCE-C1', '2025-02-19 00:00:00', 'C1', 'en'),
    (54, '0219-EN-SENTENCE-C2', '2025-02-19 00:00:00', 'C2', 'en'),
    (55, '0219-KO-문장-A1',      '2025-02-19 00:00:00', 'A1', 'ko'),
    (56, '0219-KO-문장-A2',      '2025-02-19 00:00:00', 'A2', 'ko'),
    (57, '0219-KO-문장-B1',      '2025-02-19 00:00:00', 'B1', 'ko'),
    (58, '0219-KO-문장-B2',      '2025-02-19 00:00:00', 'B2', 'ko'),
    (59, '0219-KO-문장-C1',      '2025-02-19 00:00:00', 'C1', 'ko'),
    (60, '0219-KO-문장-C2',      '2025-02-19 00:00:00', 'C2', 'ko');

-- 2025-02-20 (sentence_id 61 ~ 72)
INSERT INTO date_sentences (sentence_id, sentence, date_id, level, language_id)
VALUES
    (61, '0220-EN-SENTENCE-A1', '2025-02-20 00:00:00', 'A1', 'en'),
    (62, '0220-EN-SENTENCE-A2', '2025-02-20 00:00:00', 'A2', 'en'),
    (63, '0220-EN-SENTENCE-B1', '2025-02-20 00:00:00', 'B1', 'en'),
    (64, '0220-EN-SENTENCE-B2', '2025-02-20 00:00:00', 'B2', 'en'),
    (65, '0220-EN-SENTENCE-C1', '2025-02-20 00:00:00', 'C1', 'en'),
    (66, '0220-EN-SENTENCE-C2', '2025-02-20 00:00:00', 'C2', 'en'),
    (67, '0220-KO-문장-A1',      '2025-02-20 00:00:00', 'A1', 'ko'),
    (68, '0220-KO-문장-A2',      '2025-02-20 00:00:00', 'A2', 'ko'),
    (69, '0220-KO-문장-B1',      '2025-02-20 00:00:00', 'B1', 'ko'),
    (70, '0220-KO-문장-B2',      '2025-02-20 00:00:00', 'B2', 'ko'),
    (71, '0220-KO-문장-C1',      '2025-02-20 00:00:00', 'C1', 'ko'),
    (72, '0220-KO-문장-C2',      '2025-02-20 00:00:00', 'C2', 'ko');

-- 2025-02-21 (sentence_id 73 ~ 84)
INSERT INTO date_sentences (sentence_id, sentence, date_id, level, language_id)
VALUES
    (73, '0221-EN-SENTENCE-A1', '2025-02-21 00:00:00', 'A1', 'en'),
    (74, '0221-EN-SENTENCE-A2', '2025-02-21 00:00:00', 'A2', 'en'),
    (75, '0221-EN-SENTENCE-B1', '2025-02-21 00:00:00', 'B1', 'en'),
    (76, '0221-EN-SENTENCE-B2', '2025-02-21 00:00:00', 'B2', 'en'),
    (77, '0221-EN-SENTENCE-C1', '2025-02-21 00:00:00', 'C1', 'en'),
    (78, '0221-EN-SENTENCE-C2', '2025-02-21 00:00:00', 'C2', 'en'),
    (79, '0221-KO-문장-A1',      '2025-02-21 00:00:00', 'A1', 'ko'),
    (80, '0221-KO-문장-A2',      '2025-02-21 00:00:00', 'A2', 'ko'),
    (81, '0221-KO-문장-B1',      '2025-02-21 00:00:00', 'B1', 'ko'),
    (82, '0221-KO-문장-B2',      '2025-02-21 00:00:00', 'B2', 'ko'),
    (83, '0221-KO-문장-C1',      '2025-02-21 00:00:00', 'C1', 'ko'),
    (84, '0221-KO-문장-C2',      '2025-02-21 00:00:00', 'C2', 'ko');

-- 2025-02-22 (sentence_id 85 ~ 96)
INSERT INTO date_sentences (sentence_id, sentence, date_id, level, language_id)
VALUES
    (85, '0222-EN-SENTENCE-A1', '2025-02-22 00:00:00', 'A1', 'en'),
    (86, '0222-EN-SENTENCE-A2', '2025-02-22 00:00:00', 'A2', 'en'),
    (87, '0222-EN-SENTENCE-B1', '2025-02-22 00:00:00', 'B1', 'en'),
    (88, '0222-EN-SENTENCE-B2', '2025-02-22 00:00:00', 'B2', 'en'),
    (89, '0222-EN-SENTENCE-C1', '2025-02-22 00:00:00', 'C1', 'en'),
    (90, '0222-EN-SENTENCE-C2', '2025-02-22 00:00:00', 'C2', 'en'),
    (91, '0222-KO-문장-A1',      '2025-02-22 00:00:00', 'A1', 'ko'),
    (92, '0222-KO-문장-A2',      '2025-02-22 00:00:00', 'A2', 'ko'),
    (93, '0222-KO-문장-B1',      '2025-02-22 00:00:00', 'B1', 'ko'),
    (94, '0222-KO-문장-B2',      '2025-02-22 00:00:00', 'B2', 'ko'),
    (95, '0222-KO-문장-C1',      '2025-02-22 00:00:00', 'C1', 'ko'),
    (96, '0222-KO-문장-C2',      '2025-02-22 00:00:00', 'C2', 'ko');


-- ======================================================
-- 2. user_date_sentences 테이블 (2025‑02‑15 ~ 2025‑02‑22)
-- ======================================================

/*
  피드 패턴 (영어/한국어 동일):
  - Feed 1 (A1): 사용자 2, 3, 4
  - Feed 2 (A2): 사용자 3, 4, 5
  - Feed 3 (B1): 사용자 4, 5, 6
  - Feed 4 (B2): 사용자 2, 5, 6
  - Feed 5 (C1): 사용자 2, 3, 6
  - Feed 6 (C2): 사용자 2, 4, 6
*/

-- --------------------------------------
-- 2025-02-16 (sentence_id 13 ~ 24)
-- --------------------------------------
INSERT INTO user_date_sentences (user_id, date_sentence_id, user_date_sentences_url, created_at)
VALUES
    -- 영어 (13~18)
    (2, 13, 'http://example.com/2025-02-16/sentence1_user2', NOW()),
    (3, 13, 'http://example.com/2025-02-16/sentence1_user3', NOW()),
    (4, 13, 'http://example.com/2025-02-16/sentence1_user4', NOW()),

    (3, 14, 'http://example.com/2025-02-16/sentence2_user3', NOW()),
    (4, 14, 'http://example.com/2025-02-16/sentence2_user4', NOW()),
    (5, 14, 'http://example.com/2025-02-16/sentence2_user5', NOW()),

    (4, 15, 'http://example.com/2025-02-16/sentence3_user4', NOW()),
    (5, 15, 'http://example.com/2025-02-16/sentence3_user5', NOW()),
    (6, 15, 'http://example.com/2025-02-16/sentence3_user6', NOW()),

    (2, 16, 'http://example.com/2025-02-16/sentence4_user2', NOW()),
    (5, 16, 'http://example.com/2025-02-16/sentence4_user5', NOW()),
    (6, 16, 'http://example.com/2025-02-16/sentence4_user6', NOW()),

    (2, 17, 'http://example.com/2025-02-16/sentence5_user2', NOW()),
    (3, 17, 'http://example.com/2025-02-16/sentence5_user3', NOW()),
    (6, 17, 'http://example.com/2025-02-16/sentence5_user6', NOW()),

    (2, 18, 'http://example.com/2025-02-16/sentence6_user2', NOW()),
    (4, 18, 'http://example.com/2025-02-16/sentence6_user4', NOW()),
    (6, 18, 'http://example.com/2025-02-16/sentence6_user6', NOW()),

    -- 한국어 (19~24)
    (2, 19, 'http://example.com/2025-02-16/sentence1_user2', NOW()),
    (3, 19, 'http://example.com/2025-02-16/sentence1_user3', NOW()),
    (4, 19, 'http://example.com/2025-02-16/sentence1_user4', NOW()),

    (3, 20, 'http://example.com/2025-02-16/sentence2_user3', NOW()),
    (4, 20, 'http://example.com/2025-02-16/sentence2_user4', NOW()),
    (5, 20, 'http://example.com/2025-02-16/sentence2_user5', NOW()),

    (4, 21, 'http://example.com/2025-02-16/sentence3_user4', NOW()),
    (5, 21, 'http://example.com/2025-02-16/sentence3_user5', NOW()),
    (6, 21, 'http://example.com/2025-02-16/sentence3_user6', NOW()),

    (2, 22, 'http://example.com/2025-02-16/sentence4_user2', NOW()),
    (5, 22, 'http://example.com/2025-02-16/sentence4_user5', NOW()),
    (6, 22, 'http://example.com/2025-02-16/sentence4_user6', NOW()),

    (2, 23, 'http://example.com/2025-02-16/sentence5_user2', NOW()),
    (3, 23, 'http://example.com/2025-02-16/sentence5_user3', NOW()),
    (6, 23, 'http://example.com/2025-02-16/sentence5_user6', NOW()),

    (2, 24, 'http://example.com/2025-02-16/sentence6_user2', NOW()),
    (4, 24, 'http://example.com/2025-02-16/sentence6_user4', NOW()),
    (6, 24, 'http://example.com/2025-02-16/sentence6_user6', NOW());

-- --------------------------------------
-- 2025-02-17 (sentence_id 25 ~ 36)
-- --------------------------------------
INSERT INTO user_date_sentences (user_id, date_sentence_id, user_date_sentences_url, created_at)
VALUES
    -- 영어 (25~30)
    (2, 25, 'http://example.com/2025-02-17/sentence1_user2', NOW()),
    (3, 25, 'http://example.com/2025-02-17/sentence1_user3', NOW()),
    (4, 25, 'http://example.com/2025-02-17/sentence1_user4', NOW()),

    (3, 26, 'http://example.com/2025-02-17/sentence2_user3', NOW()),
    (4, 26, 'http://example.com/2025-02-17/sentence2_user4', NOW()),
    (5, 26, 'http://example.com/2025-02-17/sentence2_user5', NOW()),

    (4, 27, 'http://example.com/2025-02-17/sentence3_user4', NOW()),
    (5, 27, 'http://example.com/2025-02-17/sentence3_user5', NOW()),
    (6, 27, 'http://example.com/2025-02-17/sentence3_user6', NOW()),

    (2, 28, 'http://example.com/2025-02-17/sentence4_user2', NOW()),
    (5, 28, 'http://example.com/2025-02-17/sentence4_user5', NOW()),
    (6, 28, 'http://example.com/2025-02-17/sentence4_user6', NOW()),

    (2, 29, 'http://example.com/2025-02-17/sentence5_user2', NOW()),
    (3, 29, 'http://example.com/2025-02-17/sentence5_user3', NOW()),
    (6, 29, 'http://example.com/2025-02-17/sentence5_user6', NOW()),

    (2, 30, 'http://example.com/2025-02-17/sentence6_user2', NOW()),
    (4, 30, 'http://example.com/2025-02-17/sentence6_user4', NOW()),
    (6, 30, 'http://example.com/2025-02-17/sentence6_user6', NOW()),

    -- 한국어 (31~36)
    (2, 31, 'http://example.com/2025-02-17/sentence1_user2', NOW()),
    (3, 31, 'http://example.com/2025-02-17/sentence1_user3', NOW()),
    (4, 31, 'http://example.com/2025-02-17/sentence1_user4', NOW()),

    (3, 32, 'http://example.com/2025-02-17/sentence2_user3', NOW()),
    (4, 32, 'http://example.com/2025-02-17/sentence2_user4', NOW()),
    (5, 32, 'http://example.com/2025-02-17/sentence2_user5', NOW()),

    (4, 33, 'http://example.com/2025-02-17/sentence3_user4', NOW()),
    (5, 33, 'http://example.com/2025-02-17/sentence3_user5', NOW()),
    (6, 33, 'http://example.com/2025-02-17/sentence3_user6', NOW()),

    (2, 34, 'http://example.com/2025-02-17/sentence4_user2', NOW()),
    (5, 34, 'http://example.com/2025-02-17/sentence4_user5', NOW()),
    (6, 34, 'http://example.com/2025-02-17/sentence4_user6', NOW()),

    (2, 35, 'http://example.com/2025-02-17/sentence5_user2', NOW()),
    (3, 35, 'http://example.com/2025-02-17/sentence5_user3', NOW()),
    (6, 35, 'http://example.com/2025-02-17/sentence5_user6', NOW()),

    (2, 36, 'http://example.com/2025-02-17/sentence6_user2', NOW()),
    (4, 36, 'http://example.com/2025-02-17/sentence6_user4', NOW()),
    (6, 36, 'http://example.com/2025-02-17/sentence6_user6', NOW());

-- --------------------------------------
-- 2025-02-18 (sentence_id 37 ~ 48)
-- --------------------------------------
INSERT INTO user_date_sentences (user_id, date_sentence_id, user_date_sentences_url, created_at)
VALUES
    -- 영어 (37~42)
    (2, 37, 'http://example.com/2025-02-18/sentence1_user2', NOW()),
    (3, 37, 'http://example.com/2025-02-18/sentence1_user3', NOW()),
    (4, 37, 'http://example.com/2025-02-18/sentence1_user4', NOW()),
    
    (3, 38, 'http://example.com/2025-02-18/sentence2_user3', NOW()),
    (4, 38, 'http://example.com/2025-02-18/sentence2_user4', NOW()),
    (5, 38, 'http://example.com/2025-02-18/sentence2_user5', NOW()),
    
    (4, 39, 'http://example.com/2025-02-18/sentence3_user4', NOW()),
    (5, 39, 'http://example.com/2025-02-18/sentence3_user5', NOW()),
    (6, 39, 'http://example.com/2025-02-18/sentence3_user6', NOW()),
    
    (2, 40, 'http://example.com/2025-02-18/sentence4_user2', NOW()),
    (5, 40, 'http://example.com/2025-02-18/sentence4_user5', NOW()),
    (6, 40, 'http://example.com/2025-02-18/sentence4_user6', NOW()),
    
    (2, 41, 'http://example.com/2025-02-18/sentence5_user2', NOW()),
    (3, 41, 'http://example.com/2025-02-18/sentence5_user3', NOW()),
    (6, 41, 'http://example.com/2025-02-18/sentence5_user6', NOW()),
    
    (2, 42, 'http://example.com/2025-02-18/sentence6_user2', NOW()),
    (4, 42, 'http://example.com/2025-02-18/sentence6_user4', NOW()),
    (6, 42, 'http://example.com/2025-02-18/sentence6_user6', NOW()),
    
    -- 한국어 (43~48)
    (2, 43, 'http://example.com/2025-02-18/sentence1_user2', NOW()),
    (3, 43, 'http://example.com/2025-02-18/sentence1_user3', NOW()),
    (4, 43, 'http://example.com/2025-02-18/sentence1_user4', NOW()),
    
    (3, 44, 'http://example.com/2025-02-18/sentence2_user3', NOW()),
    (4, 44, 'http://example.com/2025-02-18/sentence2_user4', NOW()),
    (5, 44, 'http://example.com/2025-02-18/sentence2_user5', NOW()),
    
    (4, 45, 'http://example.com/2025-02-18/sentence3_user4', NOW()),
    (5, 45, 'http://example.com/2025-02-18/sentence3_user5', NOW()),
    (6, 45, 'http://example.com/2025-02-18/sentence3_user6', NOW()),
    
    (2, 46, 'http://example.com/2025-02-18/sentence4_user2', NOW()),
    (5, 46, 'http://example.com/2025-02-18/sentence4_user5', NOW()),
    (6, 46, 'http://example.com/2025-02-18/sentence4_user6', NOW()),
    
    (2, 47, 'http://example.com/2025-02-18/sentence5_user2', NOW()),
    (3, 47, 'http://example.com/2025-02-18/sentence5_user3', NOW()),
    (6, 47, 'http://example.com/2025-02-18/sentence5_user6', NOW()),
    
    (2, 48, 'http://example.com/2025-02-18/sentence6_user2', NOW()),
    (4, 48, 'http://example.com/2025-02-18/sentence6_user4', NOW()),
    (6, 48, 'http://example.com/2025-02-18/sentence6_user6', NOW());

-- --------------------------------------
-- 2025-02-19 (sentence_id 49 ~ 60)
-- --------------------------------------
INSERT INTO user_date_sentences (user_id, date_sentence_id, user_date_sentences_url, created_at)
VALUES
    -- 영어 (49~54)
    (2, 49, 'http://example.com/2025-02-19/sentence1_user2', NOW()),
    (3, 49, 'http://example.com/2025-02-19/sentence1_user3', NOW()),
    (4, 49, 'http://example.com/2025-02-19/sentence1_user4', NOW()),
    
    (3, 50, 'http://example.com/2025-02-19/sentence2_user3', NOW()),
    (4, 50, 'http://example.com/2025-02-19/sentence2_user4', NOW()),
    (5, 50, 'http://example.com/2025-02-19/sentence2_user5', NOW()),
    
    (4, 51, 'http://example.com/2025-02-19/sentence3_user4', NOW()),
    (5, 51, 'http://example.com/2025-02-19/sentence3_user5', NOW()),
    (6, 51, 'http://example.com/2025-02-19/sentence3_user6', NOW()),
    
    (2, 52, 'http://example.com/2025-02-19/sentence4_user2', NOW()),
    (5, 52, 'http://example.com/2025-02-19/sentence4_user5', NOW()),
    (6, 52, 'http://example.com/2025-02-19/sentence4_user6', NOW()),
    
    (2, 53, 'http://example.com/2025-02-19/sentence5_user2', NOW()),
    (3, 53, 'http://example.com/2025-02-19/sentence5_user3', NOW()),
    (6, 53, 'http://example.com/2025-02-19/sentence5_user6', NOW()),
    
    (2, 54, 'http://example.com/2025-02-19/sentence6_user2', NOW()),
    (4, 54, 'http://example.com/2025-02-19/sentence6_user4', NOW()),
    (6, 54, 'http://example.com/2025-02-19/sentence6_user6', NOW()),
    
    -- 한국어 (55~60)
    (2, 55, 'http://example.com/2025-02-19/sentence1_user2', NOW()),
    (3, 55, 'http://example.com/2025-02-19/sentence1_user3', NOW()),
    (4, 55, 'http://example.com/2025-02-19/sentence1_user4', NOW()),
    
    (3, 56, 'http://example.com/2025-02-19/sentence2_user3', NOW()),
    (4, 56, 'http://example.com/2025-02-19/sentence2_user4', NOW()),
    (5, 56, 'http://example.com/2025-02-19/sentence2_user5', NOW()),
    
    (4, 57, 'http://example.com/2025-02-19/sentence3_user4', NOW()),
    (5, 57, 'http://example.com/2025-02-19/sentence3_user5', NOW()),
    (6, 57, 'http://example.com/2025-02-19/sentence3_user6', NOW()),
    
    (2, 58, 'http://example.com/2025-02-19/sentence4_user2', NOW()),
    (5, 58, 'http://example.com/2025-02-19/sentence4_user5', NOW()),
    (6, 58, 'http://example.com/2025-02-19/sentence4_user6', NOW()),
    
    (2, 59, 'http://example.com/2025-02-19/sentence5_user2', NOW()),
    (3, 59, 'http://example.com/2025-02-19/sentence5_user3', NOW()),
    (6, 59, 'http://example.com/2025-02-19/sentence5_user6', NOW()),
    
    (2, 60, 'http://example.com/2025-02-19/sentence6_user2', NOW()),
    (4, 60, 'http://example.com/2025-02-19/sentence6_user4', NOW()),
    (6, 60, 'http://example.com/2025-02-19/sentence6_user6', NOW());

-- --------------------------------------
-- 2025-02-20 (sentence_id 61 ~ 72)
-- --------------------------------------
INSERT INTO user_date_sentences (user_id, date_sentence_id, user_date_sentences_url, created_at)
VALUES
    -- 영어 (61~66)
    (2, 61, 'http://example.com/2025-02-20/sentence1_user2', NOW()),
    (3, 61, 'http://example.com/2025-02-20/sentence1_user3', NOW()),
    (4, 61, 'http://example.com/2025-02-20/sentence1_user4', NOW()),
    
    (3, 62, 'http://example.com/2025-02-20/sentence2_user3', NOW()),
    (4, 62, 'http://example.com/2025-02-20/sentence2_user4', NOW()),
    (5, 62, 'http://example.com/2025-02-20/sentence2_user5', NOW()),
    
    (4, 63, 'http://example.com/2025-02-20/sentence3_user4', NOW()),
    (5, 63, 'http://example.com/2025-02-20/sentence3_user5', NOW()),
    (6, 63, 'http://example.com/2025-02-20/sentence3_user6', NOW()),
    
    (2, 64, 'http://example.com/2025-02-20/sentence4_user2', NOW()),
    (5, 64, 'http://example.com/2025-02-20/sentence4_user5', NOW()),
    (6, 64, 'http://example.com/2025-02-20/sentence4_user6', NOW()),
    
    (2, 65, 'http://example.com/2025-02-20/sentence5_user2', NOW()),
    (3, 65, 'http://example.com/2025-02-20/sentence5_user3', NOW()),
    (6, 65, 'http://example.com/2025-02-20/sentence5_user6', NOW()),
    
    (2, 66, 'http://example.com/2025-02-20/sentence6_user2', NOW()),
    (4, 66, 'http://example.com/2025-02-20/sentence6_user4', NOW()),
    (6, 66, 'http://example.com/2025-02-20/sentence6_user6', NOW()),
    
    -- 한국어 (67~72)
    (2, 67, 'http://example.com/2025-02-20/sentence1_user2', NOW()),
    (3, 67, 'http://example.com/2025-02-20/sentence1_user3', NOW()),
    (4, 67, 'http://example.com/2025-02-20/sentence1_user4', NOW()),
    
    (3, 68, 'http://example.com/2025-02-20/sentence2_user3', NOW()),
    (4, 68, 'http://example.com/2025-02-20/sentence2_user4', NOW()),
    (5, 68, 'http://example.com/2025-02-20/sentence2_user5', NOW()),
    
    (4, 69, 'http://example.com/2025-02-20/sentence3_user4', NOW()),
    (5, 69, 'http://example.com/2025-02-20/sentence3_user5', NOW()),
    (6, 69, 'http://example.com/2025-02-20/sentence3_user6', NOW()),
    
    (2, 70, 'http://example.com/2025-02-20/sentence4_user2', NOW()),
    (5, 70, 'http://example.com/2025-02-20/sentence4_user5', NOW()),
    (6, 70, 'http://example.com/2025-02-20/sentence4_user6', NOW()),
    
    (2, 71, 'http://example.com/2025-02-20/sentence5_user2', NOW()),
    (3, 71, 'http://example.com/2025-02-20/sentence5_user3', NOW()),
    (6, 71, 'http://example.com/2025-02-20/sentence5_user6', NOW()),
    
    (2, 72, 'http://example.com/2025-02-20/sentence6_user2', NOW()),
    (4, 72, 'http://example.com/2025-02-20/sentence6_user4', NOW()),
    (6, 72, 'http://example.com/2025-02-20/sentence6_user6', NOW());

-- --------------------------------------
-- 2025-02-21 (sentence_id 73 ~ 84)
-- --------------------------------------
INSERT INTO user_date_sentences (user_id, date_sentence_id, user_date_sentences_url, created_at)
VALUES
    -- 영어 (73~78)
    (2, 73, 'http://example.com/2025-02-21/sentence1_user2', NOW()),
    (3, 73, 'http://example.com/2025-02-21/sentence1_user3', NOW()),
    (4, 73, 'http://example.com/2025-02-21/sentence1_user4', NOW()),
    
    (3, 74, 'http://example.com/2025-02-21/sentence2_user3', NOW()),
    (4, 74, 'http://example.com/2025-02-21/sentence2_user4', NOW()),
    (5, 74, 'http://example.com/2025-02-21/sentence2_user5', NOW()),
    
    (4, 75, 'http://example.com/2025-02-21/sentence3_user4', NOW()),
    (5, 75, 'http://example.com/2025-02-21/sentence3_user5', NOW()),
    (6, 75, 'http://example.com/2025-02-21/sentence3_user6', NOW()),
    
    (2, 76, 'http://example.com/2025-02-21/sentence4_user2', NOW()),
    (5, 76, 'http://example.com/2025-02-21/sentence4_user5', NOW()),
    (6, 76, 'http://example.com/2025-02-21/sentence4_user6', NOW()),
    
    (2, 77, 'http://example.com/2025-02-21/sentence5_user2', NOW()),
    (3, 77, 'http://example.com/2025-02-21/sentence5_user3', NOW()),
    (6, 77, 'http://example.com/2025-02-21/sentence5_user6', NOW()),
    
    (2, 78, 'http://example.com/2025-02-21/sentence6_user2', NOW()),
    (4, 78, 'http://example.com/2025-02-21/sentence6_user4', NOW()),
    (6, 78, 'http://example.com/2025-02-21/sentence6_user6', NOW()),
    
    -- 한국어 (79~84)
    (2, 79, 'http://example.com/2025-02-21/sentence1_user2', NOW()),
    (3, 79, 'http://example.com/2025-02-21/sentence1_user3', NOW()),
    (4, 79, 'http://example.com/2025-02-21/sentence1_user4', NOW()),
    
    (3, 80, 'http://example.com/2025-02-21/sentence2_user3', NOW()),
    (4, 80, 'http://example.com/2025-02-21/sentence2_user4', NOW()),
    (5, 80, 'http://example.com/2025-02-21/sentence2_user5', NOW()),
    
    (4, 81, 'http://example.com/2025-02-21/sentence3_user4', NOW()),
    (5, 81, 'http://example.com/2025-02-21/sentence3_user5', NOW()),
    (6, 81, 'http://example.com/2025-02-21/sentence3_user6', NOW()),
    
    (2, 82, 'http://example.com/2025-02-21/sentence4_user2', NOW()),
    (5, 82, 'http://example.com/2025-02-21/sentence4_user5', NOW()),
    (6, 82, 'http://example.com/2025-02-21/sentence4_user6', NOW()),
    
    (2, 83, 'http://example.com/2025-02-21/sentence5_user2', NOW()),
    (3, 83, 'http://example.com/2025-02-21/sentence5_user3', NOW()),
    (6, 83, 'http://example.com/2025-02-21/sentence5_user6', NOW()),
    
    (2, 84, 'http://example.com/2025-02-21/sentence6_user2', NOW()),
    (4, 84, 'http://example.com/2025-02-21/sentence6_user4', NOW()),
    (6, 84, 'http://example.com/2025-02-21/sentence6_user6', NOW());

-- --------------------------------------
-- 2025-02-22 (sentence_id 85 ~ 96)
-- --------------------------------------
INSERT INTO user_date_sentences (user_id, date_sentence_id, user_date_sentences_url, created_at)
VALUES
    -- 영어 (85~90)
    (2, 85, 'http://example.com/2025-02-22/sentence1_user2', NOW()),
    (3, 85, 'http://example.com/2025-02-22/sentence1_user3', NOW()),
    (4, 85, 'http://example.com/2025-02-22/sentence1_user4', NOW()),
    
    (3, 86, 'http://example.com/2025-02-22/sentence2_user3', NOW()),
    (4, 86, 'http://example.com/2025-02-22/sentence2_user4', NOW()),
    (5, 86, 'http://example.com/2025-02-22/sentence2_user5', NOW()),
    
    (4, 87, 'http://example.com/2025-02-22/sentence3_user4', NOW()),
    (5, 87, 'http://example.com/2025-02-22/sentence3_user5', NOW()),
    (6, 87, 'http://example.com/2025-02-22/sentence3_user6', NOW()),
    
    (2, 88, 'http://example.com/2025-02-22/sentence4_user2', NOW()),
    (5, 88, 'http://example.com/2025-02-22/sentence4_user5', NOW()),
    (6, 88, 'http://example.com/2025-02-22/sentence4_user6', NOW()),
    
    (2, 89, 'http://example.com/2025-02-22/sentence5_user2', NOW()),
    (3, 89, 'http://example.com/2025-02-22/sentence5_user3', NOW()),
    (6, 89, 'http://example.com/2025-02-22/sentence5_user6', NOW()),
    
    (2, 90, 'http://example.com/2025-02-22/sentence6_user2', NOW()),
    (4, 90, 'http://example.com/2025-02-22/sentence6_user4', NOW()),
    (6, 90, 'http://example.com/2025-02-22/sentence6_user6', NOW()),
    
    -- 한국어 (91~96)
    (2, 91, 'http://example.com/2025-02-22/sentence1_user2', NOW()),
    (3, 91, 'http://example.com/2025-02-22/sentence1_user3', NOW()),
    (4, 91, 'http://example.com/2025-02-22/sentence1_user4', NOW()),
    
    (3, 92, 'http://example.com/2025-02-22/sentence2_user3', NOW()),
    (4, 92, 'http://example.com/2025-02-22/sentence2_user4', NOW()),
    (5, 92, 'http://example.com/2025-02-22/sentence2_user5', NOW()),
    
    (4, 93, 'http://example.com/2025-02-22/sentence3_user4', NOW()),
    (5, 93, 'http://example.com/2025-02-22/sentence3_user5', NOW()),
    (6, 93, 'http://example.com/2025-02-22/sentence3_user6', NOW()),
    
    (2, 94, 'http://example.com/2025-02-22/sentence4_user2', NOW()),
    (5, 94, 'http://example.com/2025-02-22/sentence4_user5', NOW()),
    (6, 94, 'http://example.com/2025-02-22/sentence4_user6', NOW()),
    
    (2, 95, 'http://example.com/2025-02-22/sentence5_user2', NOW()),
    (3, 95, 'http://example.com/2025-02-22/sentence5_user3', NOW()),
    (6, 95, 'http://example.com/2025-02-22/sentence5_user6', NOW()),
    
    (2, 96, 'http://example.com/2025-02-22/sentence6_user2', NOW()),
    (4, 96, 'http://example.com/2025-02-22/sentence6_user4', NOW()),
    (6, 96, 'http://example.com/2025-02-22/sentence6_user6', NOW());
