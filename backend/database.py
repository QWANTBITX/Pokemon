import psycopg2
from psycopg2.extras import RealDictCursor

from backend.config import config


def get_connection():
    return psycopg2.connect(config.database_url, cursor_factory=RealDictCursor)


def fetch_all(query, params=None):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params or ())
            return cur.fetchall()


def fetch_one(query, params=None):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params or ())
            return cur.fetchone()


def execute(query, params=None):
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query, params or ())
            conn.commit()
            if cur.description:
                return cur.fetchone()
            return None
