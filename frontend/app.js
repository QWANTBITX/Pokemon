let entrenadorUuid = null;

function showResult(elementId, data, isError = false) {
  const el = document.getElementById(elementId);
  el.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
  el.className = "result " + (isError ? "error" : "success");
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await response.json();
  if (!response.ok) {
    throw { status: response.status, data };
  }
  return data;
}

document.getElementById("login-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  try {
    const data = await api("/entrenador/login", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    entrenadorUuid = data.uuid;
    showResult("login-result", `Sesión iniciada. UUID: ${data.uuid}`);
    document.getElementById("btn-listar-entrenador").disabled = false;
    document.getElementById("btn-capturar").disabled = false;
  } catch (err) {
    showResult("login-result", err.data || "Error de login", true);
  }
});

document.getElementById("tipo-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const tipo = document.getElementById("tipo-uuid").value.trim();
  try {
    const data = await api(`/pokemons/${tipo}`);
    showResult("tipo-result", data);
  } catch (err) {
    showResult("tipo-result", err.data || "Error al listar", true);
  }
});

document.getElementById("pokemon-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const body = {
    nombre: document.getElementById("p-nombre").value.trim(),
    descripcion: document.getElementById("p-descripcion").value.trim(),
    fecha_descubrimiento: document.getElementById("p-fecha").value.trim(),
    generacion: document.getElementById("p-generacion").value.trim(),
    tipo_pokemon: {
      id: document.getElementById("p-tipo-id").value.trim(),
      descripcion: document.getElementById("p-tipo-desc").value.trim(),
      uuid: document.getElementById("p-tipo-uuid").value.trim(),
    },
  };
  try {
    const data = await api("/pokemons", {
      method: "POST",
      body: JSON.stringify(body),
    });
    showResult("pokemon-result", data);
    document.getElementById("captura-pokemon-uuid").value = data.uuid;
  } catch (err) {
    showResult("pokemon-result", err.data || "Error al registrar", true);
  }
});

document.getElementById("btn-listar-entrenador").addEventListener("click", async () => {
  if (!entrenadorUuid) return;
  try {
    const data = await api(`/entrenador/${entrenadorUuid}/pokemons`);
    showResult("entrenador-pokemons", data);
  } catch (err) {
    showResult("entrenador-pokemons", err.data || "Error al listar", true);
  }
});

document.getElementById("captura-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!entrenadorUuid) return;
  const pokemonUuid = document.getElementById("captura-pokemon-uuid").value.trim();
  try {
    const data = await api(
      `/entrenador/${entrenadorUuid}/pokemons/${pokemonUuid}`,
      { method: "POST" }
    );
    showResult("captura-result", data);
    showResult("entrenador-pokemons", data);
  } catch (err) {
    showResult("captura-result", err.data || "Error al capturar", true);
  }
});
