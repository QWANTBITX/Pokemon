import os

from flask import Flask, send_from_directory

from backend.config import config
from backend.routes.entrenador_routes import entrenador_bp
from backend.routes.pokemon_routes import pokemon_bp


def create_app():
    app = Flask(__name__, static_folder="../frontend", static_url_path="")

    app.register_blueprint(entrenador_bp)
    app.register_blueprint(pokemon_bp)

    @app.route("/")
    def index():
        return send_from_directory(app.static_folder, "index.html")

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=config.FLASK_PORT, debug=True)
