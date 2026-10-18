/* =========================================================
   Guía Interactiva: API Fetch & PokéAPI
   Autor: pgaitan284-cpu
   ========================================================= */

const API_BASE = 'https://pokeapi.co/api/v2/pokemon/';

// Lista de 10 Pokémon sugeridos (máximo 10 nombres)
const POKEMON_SUGERIDOS = [
  'pikachu',
  'charizard',
  'bulbasaur',
  'squirtle',
  'gengar',
  'lucario',
  'garchomp',
  'eevee',
  'snorlax',
  'mewtwo'
];

const inputPokemon    = document.getElementById('inputPokemon');
const btnBuscar       = document.getElementById('btnBuscar');
const btnAleatorio    = document.getElementById('btnAleatorio');
const btnAsync        = document.getElementById('btnAsync');
const btnPromesa      = document.getElementById('btnPromesa');
const chipsPokemon    = document.getElementById('chipsPokemon');
const contenedor      = document.getElementById('contenedorCartas');
const mStatus         = document.getElementById('mStatus');
const mLatencia       = document.getElementById('mLatencia');
const mTipo           = document.getElementById('mTipo');
const panelJSON       = document.getElementById('panelJSON');
const codigoEjecutado = document.getElementById('codigoEjecutado');

function nombreActual() {
  return (inputPokemon.value || 'pikachu').trim().toLowerCase();
}

/* 2. MEDICIÓN DE RENDIMIENTO */
function actualizarMetricas(respuesta, inicio) {
  const latencia = Math.round(performance.now() - inicio);

  mStatus.textContent   = `${respuesta.status} ${respuesta.statusText}`;
  mLatencia.textContent = `${latencia} ms`;
  mTipo.textContent     = respuesta.headers.get('content-type') || 'desconocido';

  mStatus.classList.toggle('ok', respuesta.ok);
  mStatus.classList.toggle('error', !respuesta.ok);
}

function mostrarJSON(data) {
  panelJSON.innerHTML = `<code>${JSON.stringify(data, null, 2)}</code>`;
}

function mostrarCodigo(texto) {
  codigoEjecutado.textContent = texto;
}

/* 4. RENDERIZADO DINÁMICO */
function crearCarta(pokemon) {
  const tipos = pokemon.types.map(t => t.type.name).join(' · ');

  const stats = {};
  pokemon.stats.forEach(s => { stats[s.stat.name] = s.base_stat; });

  const sprite =
    pokemon.sprites.other?.['official-artwork']?.front_default ||
    pokemon.sprites.other?.home?.front_default ||
    pokemon.sprites.front_default;

  const carta = document.createElement('article');
  carta.className = 'carta-pokemon';
  carta.innerHTML = `
    <img src="${sprite}" alt="${pokemon.name}" loading="lazy">
    <h3>${pokemon.name}</h3>
    <p class="tipos">${tipos}</p>
    <ul class="stats">
      <li><span>HP</span><strong>${stats['hp'] ?? '—'}</strong></li>
      <li><span>Ataque</span><strong>${stats['attack'] ?? '—'}</strong></li>
      <li><span>Defensa</span><strong>${stats['defense'] ?? '—'}</strong></li>
      <li><span>Velocidad</span><strong>${stats['speed'] ?? '—'}</strong></li>
    </ul>
    <p class="meta">#${String(pokemon.id).padStart(3, '0')} · ${pokemon.height / 10} m · ${pokemon.weight / 10} kg</p>
  `;

  contenedor.prepend(carta);

  while (contenedor.querySelectorAll('.carta-pokemon').length > 6) {
    contenedor.lastElementChild.remove();
  }
}

/* 3a. IMPLEMENTACIÓN CON async / await */
async function obtenerPokemonAsync(nombre) {
  const url = `${API_BASE}${nombre}`;
  const inicio = performance.now();

  mostrarCodigo(`async function obtenerPokemonAsync(nombre) {
  const url = '${url}';
  const inicio = performance.now();

  try {
    const respuesta = await fetch(url);
    actualizarMetricas(respuesta, inicio);

    if (!respuesta.ok) {
      throw new Error(\`Error HTTP: \${respuesta.status}\`);
    }

    const data = await respuesta.json();
    mostrarJSON(data);
    crearCarta(data);
    return data;
  } catch (error) {
    console.error('Error con async/await:', error.message);
    alert('No se encontró el Pokémon: ' + nombre);
  }
}`);

  try {
    const respuesta = await fetch(url);
    actualizarMetricas(respuesta, inicio);

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const data = await respuesta.json();
    mostrarJSON(data);
    crearCarta(data);
    return data;
  } catch (error) {
    console.error('Error con async/await:', error.message);
    alert('No se encontró el Pokémon: ' + nombre);
  }
}

/* 3b. IMPLEMENTACIÓN CON PROMESAS (.then / .catch) */
function obtenerPokemonPromesas(nombre) {
  const url = `${API_BASE}${nombre}`;
  const inicio = performance.now();

  mostrarCodigo(`function obtenerPokemonPromesas(nombre) {
  const url = '${url}';
  const inicio = performance.now();

  fetch(url)
    .then(respuesta => {
      actualizarMetricas(respuesta, inicio);
      if (!respuesta.ok) {
        throw new Error(\`Error HTTP: \${respuesta.status}\`);
      }
      return respuesta.json();
    })
    .then(data => {
      mostrarJSON(data);
      crearCarta(data);
    })
    .catch(error => {
      console.error('Error con promesas:', error.message);
      alert('No se encontró el Pokémon: ' + nombre);
    });
}`);

  fetch(url)
    .then(respuesta => {
      actualizarMetricas(respuesta, inicio);
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then(data => {
      mostrarJSON(data);
      crearCarta(data);
    })
    .catch(error => {
      console.error('Error con promesas:', error.message);
      alert('No se encontró el Pokémon: ' + nombre);
    });
}

/* 1. LABORATORIO: chips de los 10 Pokémon */
function pintarChips() {
  POKEMON_SUGERIDOS.forEach(nombre => {
    const chip = document.createElement('button');
    chip.className = 'chip';
    chip.textContent = nombre;
    chip.addEventListener('click', () => {
      inputPokemon.value = nombre;
      obtenerPokemonAsync(nombre);
    });
    chipsPokemon.appendChild(chip);
  });
}

/* Pestañas del visor */
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.tab === 'json' ? 'panelJSON' : 'panelCodigo')
      .classList.add('active');
  });
});

/* Eventos */
btnBuscar.addEventListener('click', () => obtenerPokemonAsync(nombreActual()));

btnAleatorio.addEventListener('click', () => {
  const aleatorio = POKEMON_SUGERIDOS[Math.floor(Math.random() * POKEMON_SUGERIDOS.length)];
  inputPokemon.value = aleatorio;
  obtenerPokemonAsync(aleatorio);
});

btnAsync.addEventListener('click', () => obtenerPokemonAsync(nombreActual()));
btnPromesa.addEventListener('click', () => obtenerPokemonPromesas(nombreActual()));

inputPokemon.addEventListener('keydown', e => {
  if (e.key === 'Enter') obtenerPokemonAsync(nombreActual());
});

/* Carga inicial */
pintarChips();
obtenerPokemonAsync('pikachu');
