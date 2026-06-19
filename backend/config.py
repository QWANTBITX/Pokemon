import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "5432")
    DB_NAME = os.getenv("DB_NAME", "pokemon_db")
    DB_USER = os.getenv("DB_USER", "postgres")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "postgres")
    FLASK_PORT = int(os.getenv("FLASK_PORT", "5000"))

    @property
    def database_url(self):
        return (
            f"host={self.DB_HOST} port={self.DB_PORT} dbname={self.DB_NAME} "
            f"user={self.DB_USER} password={self.DB_PASSWORD}"
        )


config = Config()
