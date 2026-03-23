CREATE TABLE shows (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    year            INTEGER,
    season          CHAR,
    description     TEXT,
    artwork_url     TEXT
);

CREATE TABLE people (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL
);

CREATE TABLE numbers (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id     UUID REFERENCES shows(id) NOT NULL,
    title       TEXT NOT NULL,
    file_url    TEXT NOT NULL,
    duration    INTEGER,
    numbering   INTEGER NOT NULL
);

CREATE TABLE number_composer (
    number_id       UUID REFERENCES numbers(id),
    composer_id     UUID REFERENCES people(id),
    PRIMARY KEY(number_id, composer_id)
);

CREATE TABLE number_actor (
    number_id       UUID REFERENCES numbers(id),
    actor_id        UUID REFERENCES people(id),
    PRIMARY KEY(number_id, actor_id)
);

CREATE TABLE show_cast (
    show_id       UUID REFERENCES shows(id),
    actor_id      UUID REFERENCES people(id),
    PRIMARY KEY(show_id, actor_id)
);