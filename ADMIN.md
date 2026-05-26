# Manual de administración — El Juego del Mundial 2026

## Deploy

```bash
npx vercel --prod
```

El proyecto se deploya a https://el-juego-del-mundial.vercel.app

No requiere build step. Es HTML/CSS/JS estático.

## Base de datos (Supabase)

Migraciones ya ejecutadas (`sql/schema.sql` + `sql/migrations.sql`).

### Tabla `config`

Almacena flags del sistema. Se crea con `migrations.sql`.

| key | value | Descripción |
|---|---|---|
| `results_live` | `false` | `true` = ranking muestra puntajes reales. `false` = muestra todo en 0 |

Para activar los resultados (cuando empiece el Mundial):

```sql
UPDATE config SET value = 'true' WHERE key = 'results_live';
```

### Tabla `results` — Cargar resultados reales

Los resultados los cargás vos a medida que avanza el torneo. Estructura:

| Columna | Tipo | Descripción |
|---|---|---|
| `id` | UUID | auto |
| `category` | TEXT | `groups`, `champions`, `nonChamps`, `argentina`, `dobleCamiseta`, `final`, `goleador` |
| `result` | JSONB | El resultado en el mismo formato que `SIMULATED_RESULTS` |
| `updated_at` | TIMESTAMPTZ | auto |

Ejemplo de INSERT para cada categoría:

**Fase de Grupos:**
```sql
INSERT INTO results (category, result) VALUES ('groups', '{
  "A": {"first": "México", "second": "Sudáfrica"},
  "B": {"first": "Suiza", "second": "Canadá"},
  ...
}'::jsonb);
```

**Campeones:**
```sql
INSERT INTO results (category, result) VALUES ('champions', '{
  "Argentina": "final",
  "Brasil": "cuartos",
  ...
}'::jsonb);
```

**No campeones:**
```sql
INSERT INTO results (category, result) VALUES ('nonChamps', '[
  {"team": "Países Bajos", "stage": "semis"},
  {"team": "Portugal", "stage": "cuartos"},
  {"team": "Bélgica", "stage": "cuartos"}
]'::jsonb);
```

**Camino de Argentina:**
```sql
INSERT INTO results (category, result) VALUES ('argentina', '{
  "grupo": "1",
  "rivales": {
    "dieciseisavos": "Senegal",
    "octavos": "Uruguay",
    "cuartos": "Países Bajos",
    "semis": "Inglaterra",
    "final": "Francia"
  },
  "plantarse": null
}'::jsonb);
```

**Doble Camiseta:**
```sql
INSERT INTO results (category, result) VALUES ('dobleCamiseta', '{
  "team": "Curazao",
  "mode": "solo"
}'::jsonb);
```

**Final:**
```sql
INSERT INTO results (category, result) VALUES ('final', '{
  "team1": "Argentina",
  "team2": "Inglaterra",
  "score1": "3",
  "score2": "1",
  "champion": "1"
}'::jsonb);
```

**Goleador:**
```sql
INSERT INTO results (category, result) VALUES ('goleador', '{
  "player": "Lionel Messi (Argentina)",
  "goals": "8"
}'::jsonb);
```

> Se pueden cargar resultados parciales. Por ejemplo, apenas termina la fase de grupos cargás `groups` y el ranking se actualiza solo con los puntos de esa categoría.

### Tabla `predictions`

Las predicciones de los usuarios. No tocar directamente.

## Scoring

Los puntajes se definen en `js/scoring.js` (constante `PUNTOS`). Editables antes del Mundial. Después no conviene tocarlos porque cambiarían los puntajes retroactivamente.

## Simulaciones

`js/simulated-results.js` contiene resultados ficticios para desarrollo. El ranking usa esto solo si:
1. `results_live` aún es `false`, O
2. No hay datos en la tabla `results` de Supabase

Cuando los resultados reales estén cargados en Supabase, `simulated-results.js` se ignora.

## Seguridad

- **Rate limiting:** Las migraciones SQL incluyen un trigger que limita a 5 inserts por IP cada 60 segundos. Ya activo.
- La `SUPABASE_ANON_KEY` está en el código fuente. Las RLS son la barrera real.
