# Manual de administración — El Juego del Mundial 2026

## Deploy

```bash
npx vercel --prod
```

Proyecto: https://el-juego-del-mundial.vercel.app

Static HTML/CSS/JS, no requiere build step.

## Base de datos (Supabase)

Migraciones en `sql/schema.sql` (schema inicial) y `sql/migrations.sql` (parches).

Para aplicar migraciones nuevas, copiar el bloque correspondiente al SQL Editor de Supabase y ejecutar.

### Tabla `config`

| key | value | Descripción |
|---|---|---|
| `results_live` | `false` | `true` = ranking muestra puntajes reales. `false` = todo en 0 (preview) |

Para activar:
```sql
UPDATE config SET value = 'true' WHERE key = 'results_live';
```

### Tabla `results` — Resultados del torneo

Se cargan a medida que avanza el Mundial. Un row por categoría.

```sql
-- Fase de grupos
INSERT INTO results (category, result) VALUES ('groups', '{
  "A": {"first": "México", "second": "Sudáfrica"},
  "B": {"first": "Suiza", "second": "Canadá"}
}'::jsonb);

-- Campeones
INSERT INTO results (category, result) VALUES ('champions', '{
  "Argentina": "final", "Brasil": "cuartos"
}'::jsonb);

-- No campeones
INSERT INTO results (category, result) VALUES ('nonChamps', '[
  {"team": "Países Bajos", "stage": "semis"}
]'::jsonb);

-- Camino de Argentina
INSERT INTO results (category, result) VALUES ('argentina', '{
  "grupo": "1",
  "rivales": {"dieciseisavos": "Senegal", "octavos": "Uruguay"},
  "plantarse": null
}'::jsonb);

-- Doble camiseta
INSERT INTO results (category, result) VALUES ('dobleCamiseta', '{
  "team": "Curazao", "mode": "solo"
}'::jsonb);

-- Final
INSERT INTO results (category, result) VALUES ('final', '{
  "team1": "Argentina", "team2": "Inglaterra",
  "score1": "3", "score2": "1", "champion": "1"
}'::jsonb);

-- Goleador
INSERT INTO results (category, result) VALUES ('goleador', '{
  "player": "Lionel Messi (Argentina)", "goals": "8"
}'::jsonb);
```

Se pueden cargar parcialmente (ej: solo groups ni bien termina la fase).

### Tabla `predictions`

Predicciones de los usuarios. No tocar directamente. Tiene UNIQUE en `fantasy_name`.

### Tabla `tournaments`

Torneos públicos y privados. Se crean solos desde la app. No tocar directamente.

### Tabla `logs` — Errores del servidor

Los errores al guardar predicciones se registran automáticamente acá.

```sql
-- Ver todos los errores (más recientes primero)
SELECT * FROM logs ORDER BY created_at DESC;

-- Ver errores de hoy
SELECT * FROM logs WHERE created_at > now() - interval '1 day' ORDER BY created_at DESC;
```

## Scoring

Los puntajes se definen en `js/scoring.js` (constante `PUNTOS`). Mejor no tocarlos después de que arranque el Mundial porque cambian puntajes retroactivamente.

## Simulaciones

`js/simulated-results.js` contiene datos ficticios para desarrollo. Se usan solo si no hay datos reales en Supabase y `results_live = false`.

## Troubleshooting

### "Error al guardar: Supabase error 401/403"

Causas posibles:

| Causa | Síntoma | Solución |
|---|---|---|
| RLS `array_length` con array vacío | 401 al enviar sin tags | `array_length(tags,1)` devuelve NULL para arrays vacíos. La policy debe usar `(array_length(tags,1) IS NULL OR array_length(tags,1) <= 5)` |
| Answers demasiado grandes (>10KB) | 401 | Revisar que `octet_length(answers::text) <= 10240` en la policy |
| Rate limit (>5 inserts/60s) | Error 429 | Esperar 60 segundos y reintentar |
| Nombre de fantasía duplicado | 409 | Se muestra como "Ese nombre ya fue tomado" |

Para diagnosticar:
1. Revisar `console.error` en el browser (F12 > Console)
2. Consultar `SELECT * FROM logs ORDER BY created_at DESC` en Supabase SQL Editor

### Datos corruptos en localStorage

Si la app falla al cargar, limpiar localStorage desde las DevTools (Application > Local Storage > Clear All) o abrir en una ventana de incógnito.

## Seguridad

- **Rate limiting:** Trigger que limita a 5 inserts por IP cada 60 segundos en `predictions`.
- **RLS:** Las políticas de Row Level Security son la barrera real. La `SUPABASE_ANON_KEY` en el código es publishable.
- **Input sanitization:** `escapeHtml()` en todos los inserts de datos de usuario.
