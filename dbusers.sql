DROP TABLE IF EXISTS users;

CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    first VARCHAR(35) NOT NULL CHECK (first <> ''),
    last VARCHAR(35) NOT NULL CHECK (last <> ''),
    email VARCHAR(60) NOT NULL UNIQUE CHECK (email <> ''),
    password VARCHAR(100) NOT NULL CHECK (password <> ''),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS petition;

CREATE TABLE petition (
    id SERIAL PRIMARY KEY,
    signature TEXT NOT NULL CHECK (signature <> ''),
    user_id INTEGER NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS profiles;
CREATE TABLE profiles(
    id SERIAL PRIMARY KEY,
    age SMALLINT CHECK (age > 0),
    city VARCHAR(35),
    url VARCHAR(60),
    user_id INT NOT NULL UNIQUE
);
