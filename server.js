const crypto = require("crypto");
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "frontend")));

const tipos = [
  { id: 1, descripcion: "Agua", uuid: "f3262c24-473d-437d-a5cf-e87673637954" },
  { id: 2, descripcion: "Fuego", uuid: "b2222222-2222-2222-2222-222222222222" },
  { id: 3, descripcion: "Planta", uuid: "c3333333-3333-3333-3333-333333333333" },
];

const entrenadores = [
  { id: 1, nombre: "Ash", apellido: "Ketchum", email: "ash@mail.com", uuid: "d4444444-4444-4444-4444-444444444444" },
  { id: 2, nombre: "Misty", apellido: "Williams", email: "misty@mail.com", uuid: "e5555555-5555-5555-5555-555555555555" },
  { id: 3, nombre: "Brock", apellido: "Harrison", email: "brock@mail.com", uuid: "f6666666-6666-6666-6666-666666666666" },
];

let nextPokemonId = 8;
const pokemons = [
  { id: 1, nombre: "Bulbasaur", descripcion: "Planta", tipo_pokemon: 3, fecha_descubrimiento: "2023-01-01", generacion: "1", uuid: "12345678-1234-1234-1234-123456789012" },
  { id: 2, nombre: "Squirtle", descripcion: "Agua", tipo_pokemon: 1, fecha_descubrimiento: "2023-01-15", generacion: "1", uuid: "23456789-2345-2345-2345-234567890123" },
  { id: 3, nombre: "Charmander", descripcion: "Fuego", tipo_pokemon: 2, fecha_descubrimiento: "2023-02-01", generacion: "1", uuid: "34567890-3456-3456-3456-345678901234" },
  { id: 4, nombre: "Psyduck", descripcion: "Agua", tipo_pokemon: 1, fecha_descubrimiento: "2023-02-10", generacion: "1", uuid: "45678901-4567-4567-4567-456789012345" },
  { id: 5, nombre: "Vulpix", descripcion: "Fuego", tipo_pokemon: 2, fecha_descubrimiento: "2023-02-20", generacion: "1", uuid: "56789012-5678-5678-5678-567890123456" },
  { id: 6, nombre: "Bellsprout", descripcion: "Planta", tipo_pokemon: 3, fecha_descubrimiento: "2023-03-01", generacion: "1", uuid: "67890123-6789-6789-6789-678901234567" },
  { id: 7, nombre: "Magikarp", descripcion: "Agua", tipo_pokemon: 1, fecha_descubrimiento: "2023-03-15", generacion: "1", uuid: "78901234-7890-7890-7890-789012345678" },
];

const capturas = [];

function getTipo(id) {
  return tipos.find((t) => t.id === id);
}

function formatFecha(fecha) {
  if (!fecha) return "";
  const [y, m, d] = fecha.split("-");
  return `${y}/${m}/${d}`;
}

function formatPokemon(p) {
  const tipo = getTipo(p.tipo_pokemon);
  return {
    id: String(p.id),
    nombre: p.nombre,
    descripcion: p.descripcion || "",
    fecha_descubrimiento: formatFecha(p.fecha_descubrimiento),
    generacion: p.generacion || "",
    uuid: p.uuid,
    tipo_pokemon: {
      id: String(tipo.id),
      descripcion: tipo.descripcion,
      uuid: tipo.uuid,
    },
  };
}

app.post("/entrenador/login", (req, res) => {
  const { email } = req.body || {};
  if (!email) {
    return res.status(400).json({ error: "true", message: "email es requerido" });
  }
  const entrenador = entrenadores.find((e) => e.email === email);
  if (!entrenador) {
    return res.status(404).json({ error: "true", message: "entrenador no encontrado" });
  }
  return res.json({ uuid: entrenador.uuid });
});

app.get("/pokemons/:tipo", (req, res) => {
  const list = pokemons
    .filter((p) => {
      const tipo = getTipo(p.tipo_pokemon);
      return tipo && tipo.uuid === req.params.tipo;
    })
    .map(formatPokemon);
  return res.json(list);
});

app.post("/pokemons", (req, res) => {
  const data = req.body || {};
  if (!data.nombre) {
    return res.status(400).json({ error: "true", message: "nombre es requerido" });
  }

  const tipoInfo = data.tipo_pokemon || {};
  let tipoId = tipoInfo.id ? Number(tipoInfo.id) : null;
  if (!tipoId && tipoInfo.uuid) {
    const tipo = tipos.find((t) => t.uuid === tipoInfo.uuid);
    tipoId = tipo ? tipo.id : null;
  }
  if (!tipoId) {
    return res.status(400).json({ error: "true", message: "tipo_pokemon es requerido" });
  }

  const fecha = (data.fecha_descubrimiento || "").replace(/\//g, "-") || null;
  const pokemon = {
    id: nextPokemonId++,
    nombre: data.nombre,
    descripcion: data.descripcion || "",
    tipo_pokemon: tipoId,
    fecha_descubrimiento: fecha,
    generacion: data.generacion || "",
    uuid: crypto.randomUUID(),
  };
  pokemons.push(pokemon);
  return res.status(201).json(formatPokemon(pokemon));
});

app.get("/entrenador/:uuid/pokemons", (req, res) => {
  const entrenador = entrenadores.find((e) => e.uuid === req.params.uuid);
  if (!entrenador) {
    return res.json([]);
  }
  const ids = capturas.filter((c) => c.entrenador_id === entrenador.id).map((c) => c.pokemon_id);
  const list = pokemons.filter((p) => ids.includes(p.id)).map(formatPokemon);
  return res.json(list);
});

app.post("/entrenador/:entrenadorUuid/pokemons/:pokemonUuid", (req, res) => {
  const entrenador = entrenadores.find((e) => e.uuid === req.params.entrenadorUuid);
  if (!entrenador) {
    return res.status(404).json({ error: "true", message: "Entrenador no encontrado" });
  }

  const pokemon = pokemons.find((p) => p.uuid === req.params.pokemonUuid);
  if (!pokemon) {
    return res.status(404).json({ error: "true", message: "Pokemon no encontrado" });
  }

  const yaCapturado = capturas.some((c) => c.pokemon_id === pokemon.id);
  if (yaCapturado) {
    return res.status(409).json({
      error: "true",
      message: "pokemon ya esta registrado al entrenador",
    });
  }

  capturas.push({ pokemon_id: pokemon.id, entrenador_id: entrenador.id });

  const ids = capturas.filter((c) => c.entrenador_id === entrenador.id).map((c) => c.pokemon_id);
  const list = pokemons.filter((p) => ids.includes(p.id)).map(formatPokemon);
  return res.json(list);
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor en http://localhost:${PORT}`);
});
