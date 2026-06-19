-- Motor de base de datos: PostgreSQL
CREATE SCHEMA IF NOT EXISTS pokemon;

CREATE TABLE IF NOT EXISTS pokemon.pueblo (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    uuid VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pokemon.tipo_pokemon (
    id SERIAL PRIMARY KEY,
    descripcion VARCHAR(100) NOT NULL,
    uuid VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pokemon.entrenador (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    fecha_nacimiento DATE,
    fecha_vinculacion DATE,
    pueblo_id INTEGER REFERENCES pokemon.pueblo(id),
    uuid VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pokemon.pokemon (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_pokemon INTEGER NOT NULL REFERENCES pokemon.tipo_pokemon(id),
    fecha_descubrimiento DATE,
    generacion VARCHAR(10),
    uuid VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS pokemon.captura (
    pokemon_id INTEGER NOT NULL REFERENCES pokemon.pokemon(id),
    entrenador_id INTEGER NOT NULL REFERENCES pokemon.entrenador(id),
    PRIMARY KEY (pokemon_id, entrenador_id)
);

-- Datos iniciales
INSERT INTO pokemon.pueblo (nombre, uuid) VALUES
    ('Pueblo Paleta', 'a1111111-1111-1111-1111-111111111111')
ON CONFLICT (uuid) DO NOTHING;

INSERT INTO pokemon.tipo_pokemon (descripcion, uuid) VALUES
    ('Agua', 'f3262c24-473d-437d-a5cf-e87673637954'),
    ('Fuego', 'b2222222-2222-2222-2222-222222222222'),
    ('Planta', 'c3333333-3333-3333-3333-333333333333')
ON CONFLICT (uuid) DO NOTHING;

INSERT INTO pokemon.entrenador (nombre, apellido, email, fecha_nacimiento, fecha_vinculacion, pueblo_id, uuid) VALUES
    ('Ash', 'Ketchum', 'ash@mail.com', '1997-05-22', '2010-01-01', 1, 'd4444444-4444-4444-4444-444444444444'),
    ('Misty', 'Williams', 'misty@mail.com', '1998-03-15', '2010-02-01', 1, 'e5555555-5555-5555-5555-555555555555'),
    ('Brock', 'Harrison', 'brock@mail.com', '1996-11-08', '2010-01-15', 1, 'f6666666-6666-6666-6666-666666666666')
ON CONFLICT (uuid) DO NOTHING;

INSERT INTO pokemon.pokemon (nombre, descripcion, tipo_pokemon, fecha_descubrimiento, generacion, uuid) VALUES
    ('Bulbasaur', 'Planta', 3, '2023-01-01', '1', '12345678-1234-1234-1234-123456789012'),
    ('Squirtle', 'Agua', 1, '2023-01-15', '1', '23456789-2345-2345-2345-234567890123'),
    ('Charmander', 'Fuego', 2, '2023-02-01', '1', '34567890-3456-3456-3456-345678901234'),
    ('Psyduck', 'Agua', 1, '2023-02-10', '1', '45678901-4567-4567-4567-456789012345'),
    ('Vulpix', 'Fuego', 2, '2023-02-20', '1', '56789012-5678-5678-5678-567890123456'),
    ('Bellsprout', 'Planta', 3, '2023-03-01', '1', '67890123-6789-6789-6789-678901234567'),
    ('Magikarp', 'Agua', 1, '2023-03-15', '1', '78901234-7890-7890-7890-789012345678')
ON CONFLICT (uuid) DO NOTHING;
