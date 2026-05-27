# El Juego del Mundial 2026 — Contexto

## Stack

- **Frontend:** HTML/CSS/JS puro (sin frameworks). SPA con event delegation.
- **Hosting:** Vercel (static). Deploy con `npx vercel --prod`.
- **Backend:** Supabase (PostgreSQL + REST API).

## Estado actual

Deployado en https://el-juego-del-mundial.vercel.app

### Funcionalidades implementadas

- 7 pasos de formulario con navegación
- XSS sanitized (escapeHtml en todos los inserts)
- localStorage persistence (progreso no se pierde al cerrar el tab)
- Resumen colapsable antes del submit
- TOCTOU fix: usa constraint UNIQUE de la DB
- Paginación en ranking (50 por página)
- Preview mode (`results_live = false`): todo en 0, modal "disponible cuando comience"
- Live mode (`results_live = true`): puntajes reales, modal con detalle completo
- Step 3: filtra equipos ya seleccionados para evitar duplicados (3 distintos)
- Goleador: input numérico editable (min 1), reemplaza stepper de solo span
- Modal "faltan pasos": muestra "Paso X de 7 — Título"
- Modal privado: botones horizontales, mismo color (btn--primary)
- Logs server-side: tabla `logs` + RPC `log_error()` para errores de submit
- Admin manual en `ADMIN.md`
- SQL migrations en `sql/migrations.sql`

### No implementado / pendiente

- Sin tests automatizados
- Sin admin panel (cargar resultados es vía SQL directo)
- El paso de grupos en mobile es muy largo (12 grupos en una columna)
- Sin contador regresivo al Mundial
- Links de navegación (`?tag=`) sin uso

## Errores conocidos (ya resueltos)

| Error | Causa | Fix |
|---|---|---|
| RLS 401 al enviar sin tags | `array_length(tags,1)` devuelve NULL para array vacío, y `NULL <= 5` no es TRUE | Usar `(array_length(tags,1) IS NULL OR array_length(tags,1) <= 5)` en la policy |

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
| `index.html` | SPA entry point. Screens y modales |
| `js/app.js` | Navegación, formulario, eventos, submit |
| `js/data.js` | Equipos, grupos, jugadores, definición de pasos |
| `js/results.js` | Ranking, paginación, modal de detalle |
| `js/scoring.js` | `computeScore()` — determinista, recibe answers + results |
| `js/supabase.js` | Capa DB: config, results, predictions, tags, logError |
| `js/simulated-results.js` | Resultados ficticios para dev |
| `css/styles.css` | Todos los estilos |
| `sql/schema.sql` | Schema inicial de Supabase |
| `sql/migrations.sql` | Migraciones (config, RLS, constraints, logs) |
| `ADMIN.md` | Manual de administración |
| `vercel.json` | SPA rewrites para Vercel |

## Workflow

**Siempre preguntar antes de commitear/deployar.** No hacerlo automático.

Cuando se deploya:
```bash
git add -A && git commit -m "mensaje" && git push
npx vercel --prod
```

## Comandos útiles

```bash
npx vercel --prod          # Deploy a producción
npx vercel                 # Deploy preview
```

## Query rápida para logs

```sql
SELECT * FROM logs ORDER BY created_at DESC;
```

Recordar: NO tocar `SUPABASE_ANON_KEY` ni `SUPABASE_URL` a menos que se migre de proyecto.
