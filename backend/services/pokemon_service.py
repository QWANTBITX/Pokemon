import uuid as uuid_lib

from backend.database import execute, fetch_all, fetch_one


def _format_pokemon(row):
    return {
        "id": str(row["id"]),
        "nombre": row["nombre"],
        "descripcion": row["descripcion"] or "",
        "fecha_descubrimiento": row["fecha_descubrimiento"].strftime("%Y/%m/%d")
        if row["fecha_descubrimiento"]
        else "",
        "generacion": row["generacion"] or "",
        "uuid": row["uuid"],
        "tipo_pokemon": {
            "id": str(row["tipo_id"]),
            "descripcion": row["tipo_descripcion"],
            "uuid": row["tipo_uuid"],
        },
    }


def _pokemon_base_query():
    return """
        SELECT
            p.id,
            p.nombre,
            p.descripcion,
            p.fecha_descubrimiento,
            p.generacion,
            p.uuid,
            tp.id AS tipo_id,
            tp.descripcion AS tipo_descripcion,
            tp.uuid AS tipo_uuid
        FROM pokemon.pokemon p
        INNER JOIN pokemon.tipo_pokemon tp ON p.tipo_pokemon = tp.id
    """


def listar_por_tipo(tipo_uuid):
    query = _pokemon_base_query() + " WHERE tp.uuid = %s ORDER BY p.id"
    rows = fetch_all(query, (tipo_uuid,))
    return [_format_pokemon(row) for row in rows]


def registrar_pokemon(data):
    tipo = data.get("tipo_pokemon") or {}
    tipo_id = tipo.get("id")

    if not tipo_id:
        tipo_row = fetch_one(
            "SELECT id FROM pokemon.tipo_pokemon WHERE uuid = %s",
            (tipo.get("uuid"),),
        )
        tipo_id = tipo_row["id"] if tipo_row else None

    if not tipo_id:
        raise ValueError("tipo_pokemon es requerido")

    nuevo_uuid = str(uuid_lib.uuid4())
    query = """
        INSERT INTO pokemon.pokemon (nombre, descripcion, tipo_pokemon, fecha_descubrimiento, generacion, uuid)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
    """
    fecha = data.get("fecha_descubrimiento", "").replace("/", "-")
    row = execute(
        query,
        (
            data.get("nombre"),
            data.get("descripcion"),
            int(tipo_id),
            fecha or None,
            data.get("generacion"),
            nuevo_uuid,
        ),
    )

    created = fetch_one(
        _pokemon_base_query() + " WHERE p.id = %s",
        (row["id"],),
    )
    return _format_pokemon(created)


def listar_pokemons_entrenador(entrenador_uuid):
    query = (
        _pokemon_base_query()
        + """
        INNER JOIN pokemon.captura c ON c.pokemon_id = p.id
        INNER JOIN pokemon.entrenador e ON e.id = c.entrenador_id
        WHERE e.uuid = %s
        ORDER BY p.id
    """
    )
    rows = fetch_all(query, (entrenador_uuid,))
    return [_format_pokemon(row) for row in rows]


def _pokemon_tiene_entrenador(pokemon_id):
    row = fetch_one(
        "SELECT 1 FROM pokemon.captura WHERE pokemon_id = %s LIMIT 1",
        (pokemon_id,),
    )
    return row is not None


def agregar_pokemon_a_entrenador(entrenador_uuid, pokemon_uuid):
    entrenador = fetch_one(
        "SELECT id FROM pokemon.entrenador WHERE uuid = %s",
        (entrenador_uuid,),
    )
    if not entrenador:
        raise ValueError("Entrenador no encontrado")

    pokemon = fetch_one(
        "SELECT id FROM pokemon.pokemon WHERE uuid = %s",
        (pokemon_uuid,),
    )
    if not pokemon:
        raise ValueError("Pokemon no encontrado")

    if _pokemon_tiene_entrenador(pokemon["id"]):
        return {
            "error": "true",
            "message": "pokemon ya esta registrado al entrenador",
        }

    existe_captura = fetch_one(
        """
        SELECT 1 FROM pokemon.captura
        WHERE pokemon_id = %s AND entrenador_id = %s
        """,
        (pokemon["id"], entrenador["id"]),
    )
    if existe_captura:
        return {
            "error": "true",
            "message": "pokemon ya esta registrado al entrenador",
        }

    execute(
        """
        INSERT INTO pokemon.captura (pokemon_id, entrenador_id)
        VALUES (%s, %s)
        """,
        (pokemon["id"], entrenador["id"]),
    )

    return listar_pokemons_entrenador(entrenador_uuid)
