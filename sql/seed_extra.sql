-- Datos adicionales: 1 entrenador y 4 pokémons
-- Ejecutar si la base de datos ya fue creada previamente:
-- psql -U postgres -d pokemon_db -f sql/seed_extra.sql

INSERT INTO pokemon.entrenador (nombre, apellido, email, fecha_nacimiento, fecha_vinculacion, pueblo_id, uuid) VALUES
    ('Brock', 'Harrison', 'brock@mail.com', '1996-11-08', '2010-01-15', 1, 'f6666666-6666-6666-6666-666666666666')
ON CONFLICT (uuid) DO NOTHING;

INSERT INTO pokemon.pokemon (nombre, descripcion, tipo_pokemon, fecha_descubrimiento, generacion, uuid) VALUES
    ('Psyduck', 'Agua', 1, '2023-02-10', '1', '45678901-4567-4567-4567-456789012345'),
    ('Vulpix', 'Fuego', 2, '2023-02-20', '1', '56789012-5678-5678-5678-567890123456'),
    ('Bellsprout', 'Planta', 3, '2023-03-01', '1', '67890123-6789-6789-6789-678901234567'),
    ('Magikarp', 'Agua', 1, '2023-03-15', '1', '78901234-7890-7890-7890-789012345678')
ON CONFLICT (uuid) DO NOTHING;
