from flask import Blueprint, jsonify, request

from backend.services import pokemon_service

pokemon_bp = Blueprint("pokemon", __name__)


@pokemon_bp.route("/pokemons/<tipo>", methods=["GET"])
def listar_por_tipo(tipo):
    pokemons = pokemon_service.listar_por_tipo(tipo)
    return jsonify(pokemons), 200


@pokemon_bp.route("/pokemons", methods=["POST"])
def registrar():
    data = request.get_json(silent=True) or {}
    if not data.get("nombre"):
        return jsonify({"error": "true", "message": "nombre es requerido"}), 400

    try:
        pokemon = pokemon_service.registrar_pokemon(data)
    except ValueError as exc:
        return jsonify({"error": "true", "message": str(exc)}), 400

    return jsonify(pokemon), 201
