# ⚡ Guía Interactiva: API Fetch en JavaScript & PokéAPI

Este proyecto es una **Guía Didáctica e Interactiva** desarrollada para la asignatura **Diseño de Sistemas de Internet (Semana 11)**. Explica de manera práctica cómo consumir servicios web asíncronos en JavaScript usando la API nativa `fetch()` y la PokéAPI pública (`https://pokeapi.co/api/v2/pokemon/pikachu`).

**Autor:** pgaitan284-cpu

---

## 🚀 Estructura del Proyecto

```text
pokemon-api-fetch-guia/
├── index.html      # Página principal con la interfaz interactiva y guía teórica
├── css/
│   └── styles.css  # Sistema de diseño en modo oscuro (Dark Glassmorphism)
├── js/
│   └── app.js      # Lógica de consumo de PokéAPI, métricas y renderizado
└── README.md       # Documentación del proyecto y guía de credenciales GitHub
```

---

## 💻 Características del Prototipo Web

1. **Laboratorio de Peticiones en Vivo:** Permite consultar los datos de cualquier Pokémon (`pikachu`, `charizard`, etc.) desde la PokéAPI, con acceso rápido a 10 Pokémon sugeridos.
2. **Medición de Rendimiento:** Muestra el código de estado HTTP (`200 OK`), la latencia en milisegundos y el tipo de contenido.
3. **Doble Implementación:** Demuestra cómo consumir servicios usando `async/await` y Promesas (`.then` / `.catch`).
4. **Renderizado Dinámico:** Genera tarjetas visuales con sprites de alta resolución, estadísticas de combate (HP, Ataque, Defensa, Velocidad) y atributos.
5. **Visor de Código & JSON:** Pestañas dedicadas para inspeccionar la respuesta JSON bruta y el código JavaScript ejecutado.

---

## 📘 Resumen Técnico: ¿Cómo funciona `fetch()`?

### 1. Con `async` / `await` (Sintaxis Moderna)

```javascript
async function obtenerPokemon() {
  const url = 'https://pokeapi.co/api/v2/pokemon/pikachu';

  try {
    // 1. Iniciar la petición HTTP GET
    const respuesta = await fetch(url);

    // 2. Verificar el estado de la respuesta (200 OK)
    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    // 3. Parsear el cuerpo de la respuesta a JSON
    const pokemon = await respuesta.json();

    console.log('Nombre:', pokemon.name);
    console.log('Habilidades:', pokemon.abilities);
  } catch (error) {
    console.error('Error al realizar fetch:', error.message);
  }
}
```

### 2. Con Promesas Tradicionales (`.then()` / `.catch()`)

```javascript
function obtenerPokemonConPromesas() {
  fetch('https://pokeapi.co/api/v2/pokemon/pikachu')
    .then(respuesta => {
      if (!respuesta.ok) {
        throw new Error(`Error HTTP: ${respuesta.status}`);
      }
      return respuesta.json();
    })
    .then(pokemon => {
      console.log('Nombre:', pokemon.name);
    })
    .catch(error => {
      console.error('Error:', error.message);
    });
}
```

© 2026 — Diseño de Sistemas de Internet | Universidad Nacional de Ingeniería
