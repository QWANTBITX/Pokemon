from flask import Blueprint, jsonify, request

from backend.services import entrenador_service, pokemon_service

entrenador_bp = Blueprint("entrenador", __name__)


@entrenador_bp.route("/entrenador/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    email = data.get("email")
    if not email:
        return jsonify({"error": "true", "message": "email es requerido"}), 400

    result = entrenador_service.login_entrenador(email)
    if not result:
        return jsonify({"error": "true", "message": "entrenador no encontrado"}), 404

    return jsonify(result), 200


@entrenador_bp.route("/entrenador/<uuid>/pokemons", methods=["GET"])
def listar_pokemons(uuid):
    pokemons = pokemon_service.listar_pokemons_entrenador(uuid)
    return jsonify(pokemons), 200


@entrenador_bp.route("/entrenador/<entrenador_uuid>/pokemons/<pokemon_uuid>", methods=["POST"])
def agregar_pokemon(entrenador_uuid, pokemon_uuid):
    result = pokemon_service.agregar_pokemon_a_entrenador(entrenador_uuid, pokemon_uuid)

    if isinstance(result, dict) and result.get("error") == "true":
        return jsonify(result), 409

    return jsonify(result), 200
