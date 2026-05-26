# El Juego del Mundial 2026 — Contexto Completo

## Stack

- **Frontend:** HTML/CSS/JS puro (sin frameworks). SPA con event delegation.
- **Hosting:** Vercel (static). Deploy con `npx vercel --prod`.
- **Backend:** Supabase (PostgreSQL + REST API).

## Estado actual (última sesión)

Todo deployado y funcionando en https://el-juego-del-mundial.vercel.app

### Lo implementado hasta ahora

- XSS sanitized (escapeHtml en todos los inserts de datos de usuario)
- localStorage persistence (progreso del formulario no se pierde si se cierra el tab)
- Resumen colapsable en pantalla final (antes del submit)
- Shareable link eliminado (lo pedido)
- TOCTOU fix en submit (usa constraint UNIQUE de la DB, sin header `Prefer: merge-duplicates`)
- Paginación en ranking (50 por página)
- Preview mode: cuando `results_live = false` todo en 0, nombres clickeables → modal "disponible cuando comience el Mundial"
- Live mode: cuando `results_live = true` muestra puntajes reales, click en nombre → modal con detalle completo de predicciones
- Admin manual en `ADMIN.md`
- SQL migrations en `sql/migrations.sql` (config, RLS, rate limiting)

- Server-side Turnstile captcha desactivado — no se usa captcha en submit

### Pendiente / próximos pasos

1. **Commit y push a GitHub** — cambios sin commitear: `css/styles.css`, `js/app.js`, `ADMIN.md`, `vercel.json`.
2. **Cambiar wording general** — revisar todo el texto de la app (pasos, labels, instrucciones) para que sea más claro y consistente.

### Durante el Mundial (cuando arranque)

1. **Cargar resultados reales** — insertar filas en `results` table de Supabase a medida que avanza el torneo (ver `ADMIN.md` para ejemplos de INSERT).
2. **Activar live** cuando quieras que se vean los puntajes → `UPDATE config SET value = 'true' WHERE key = 'results_live';`

### Issues conocidos no resueltos

- Sin tests automatizados
- Sin admin panel (cargar resultados es vía SQL directo)
- El paso de grupos en mobile es muy largo (12 grupos en una columna)
- Sin contador regresivo al Mundial
- Los links de navegación (`?tag=`) fueron pensados para share pero quedaron sin uso

## Convenciones del código

- `state` es el objeto global. No mutarlo fuera de los handlers.
- `$()` es alias de `document.getElementById`.
- Event delegation en `document.addEventListener('change')` y `document.addEventListener('click')`.
- `escapeHtml()` es la única función de sanitización. Usarla SIEMPRE para datos que vienen de la DB o del usuario.
- `saveState()` / `loadSavedState()` manejan localStorage bajo la key `mundial2026_state`.
- `render*()` functions generan HTML como string y lo asignan con `innerHTML`.
- `STEPS` en `data.js` define los pasos del formulario. Editarlos cambia el flujo completo.
- `SIMULATED_RESULTS` en `simulated-results.js` es para desarrollo. Se ignora si hay resultados en Supabase y `results_live = true`.

## Archivos clave

| Archivo | Propósito |
|---|---|
| `index.html` | SPA entry point. Contiene todas las screens y modales |
| `js/app.js` | App principal: navegación, formulario, eventos, submit |
| `js/data.js` | Equipos, grupos, jugadores, definición de pasos |
| `js/results.js` | Ranking, paginación, modal de detalle |
| `js/scoring.js` | `computeScore()` — determinista, recibe answers + results |
| `js/supabase.js` | Capa DB: config, results, predictions, tags |
| `js/simulated-results.js` | Resultados ficticios para dev |
| `css/styles.css` | Todos los estilos |
| `sql/schema.sql` | Schema inicial de Supabase |
| `sql/migrations.sql` | Migraciones (config, RLS, constraints) |
| `ADMIN.md` | Manual de administración |
| `vercel.json` | SPA rewrites para Vercel |

## Flujo de usuario

1. Landing → "Comenzar a jugar"
2. 7 pasos de formulario (Groups → Champions → Non-champs → Argentina → Doble Camiseta → Final → Goleador)
3. Revisar resumen → Nombre + Tags → Enviar
4. Done (confirmación, sin share link)
5. Resultados: ranking general o por torneo

## Comandos útiles

```bash
npx vercel --prod          # Deploy a producción
npx vercel                 # Deploy preview
```

Recordar: NO tocar `SUPABASE_ANON_KEY` ni `SUPABASE_URL` a menos que se migre de proyecto.
