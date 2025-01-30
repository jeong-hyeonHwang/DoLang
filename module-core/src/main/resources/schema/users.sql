CREATE TABLE users
(
    user_id   INT AUTO_INCREMENT                  NOT NULL,
    email     VARCHAR(100)                        NOT NULL,
    google_id VARCHAR(255)                        NOT NULL,
    create_at timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
    PRIMARY KEY (user_id),
    CONSTRAINT idx_users_email UNIQUE (email),
    CONSTRAINT idx_users_google_id UNIQUE (google_id)
);