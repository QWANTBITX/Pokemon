from backend.database import fetch_one


def login_entrenador(email):
    query = """
        SELECT uuid
        FROM pokemon.entrenador
        WHERE email = %s
    """
    row = fetch_one(query, (email,))
    if not row:
        return None
    return {"uuid": row["uuid"]}
