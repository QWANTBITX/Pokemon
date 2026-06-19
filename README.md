# Pokémon Backend & Web

API REST y página web para gestión de entrenadores, pokémons y capturas.

## Motor de base de datos

**PostgreSQL 16** — esquema `pokemon` con las tablas:

| Tabla | Descripción |
|-------|-------------|
| `pokemon.pueblo` | Pueblos del mundo |
| `pokemon.tipo_pokemon` | Tipos (Agua, Fuego, Planta, etc.) |
| `pokemon.entrenador` | Entrenadores registrados |
| `pokemon.pokemon` | Pokémons del sistema |
| `pokemon.captura` | Relación entrenador ↔ pokémon |

## Requisitos

- Python 3.10+
- PostgreSQL 16 (o Docker)

## Instalación

### 1. Base de datos con Docker (recomendado)

```bash
docker compose up -d
```

El script `sql/schema.sql` crea el esquema y datos de prueba automáticamente.

### 2. Base de datos manual

Cree la base de datos y ejecute:

```bash
psql -U postgres -d pokemon_db -f sql/schema.sql
```

### 3. Backend Python

```bash
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

pip install -r requirements.txt
copy .env.example .env       # Windows
# cp .env.example .env       # Linux/Mac
```

### 4. Ejecutar la aplicación

Desde la raíz del proyecto:

```bash
python -m backend.app
```

Abra en el navegador: **http://localhost:5000**

La página web se sirve desde el mismo servidor (sin CORS).

## Endpoints

### 01 — Login entrenador

```
POST /entrenador/login
```

**Request:**
```json
{ "email": "ash@mail.com" }
```

**Response:**
```json
{ "uuid": "d4444444-4444-4444-4444-444444444444" }
```

### 02 — Listar pokémons por tipo

```
GET /pokemons/{tipo_uuid}
```

`{tipo}` es el UUID del tipo de pokémon (ej. `f3262c24-473d-437d-a5cf-e87673637954` = Agua).

### 03 — Registrar pokémon

```
POST /pokemons
```

**Request:**
```json
{
  "nombre": "Programador",
  "descripcion": "Desarrollador Full",
  "fecha_descubrimiento": "2023/01/01",
  "generacion": "1",
  "tipo_pokemon": {
    "id": "1",
    "descripcion": "Agua",
    "uuid": "f3262c24-473d-437d-a5cf-e87673637954"
  }
}
```

### 04 — Pokémons de un entrenador

```
GET /entrenador/{uuid}/pokemons
```

### 05 — Agregar pokémon al entrenador

```
POST /entrenador/{entrenador_uuid}/pokemons/{pokemon_uuid}
```

Si el pokémon ya tiene entrenador:

```json
{
  "error": "true",
  "message": "pokemon ya esta registrado al entrenador"
}
```

Si se registra correctamente, retorna el listado de pokémons del entrenador.

## Datos de prueba

| Recurso | Valor |
|---------|-------|
| Email entrenador | `ash@mail.com` |
| UUID entrenador Ash | `d4444444-4444-4444-4444-444444444444` |
| UUID tipo Agua | `f3262c24-473d-437d-a5cf-e87673637954` |
| UUID Bulbasaur | `12345678-1234-1234-1234-123456789012` |
| UUID Squirtle | `23456789-2345-2345-2345-234567890123` |

## Estructura del proyecto

```
Pokemon/
├── backend/
│   ├── app.py                 # Punto de entrada Flask
│   ├── config.py              # Configuración BD
│   ├── database.py            # Conexión PostgreSQL
│   ├── routes/                # Endpoints HTTP
│   └── services/              # Lógica de negocio
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── sql/
│   └── schema.sql
├── docker-compose.yml
├── requirements.txt
└── README.md
```

## Notas

- No se implementa Swagger ni CORS (según especificación).
- La página web consume la API desde el mismo origen (`localhost:5000`).
- El campo `email` en entrenador se añadió para soportar el login del servicio 01.
