-- ============================================
-- El Juego del Mundial 2026 — Migraciones
-- ============================================
-- Ejecutar en orden sobre el schema existente.

-- 1. Límite de tamaño en JSONB answers (evita payloads gigantes)
ALTER TABLE predictions ADD CONSTRAINT check_answers_size
  CHECK (octet_length(answers::text) <= 10240);

-- 2. Rate limiting simple por IP (usa la extensión pg_net si no está)
-- Requiere: CREATE EXTENSION IF NOT EXISTS pg_net;
-- Esta política rechaza inserts si la misma IP insertó > 5 filas en los últimos 60 segundos
CREATE OR REPLACE FUNCTION check_insert_rate()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  IF (SELECT count(*) FROM predictions
      WHERE created_at > now() - interval '60 seconds'
      AND (SELECT current_setting('request.headers')::jsonb ->> 'x-forwarded-for') IS NOT NULL
     ) >= 5 THEN
    RAISE EXCEPTION 'Rate limit: demasiadas inserciones';
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_check_insert_rate
  BEFORE INSERT ON predictions
  FOR EACH ROW EXECUTE FUNCTION check_insert_rate();

-- 3. RLS más restrictiva: validar longitud de fantasy_name y tags
DROP POLICY IF EXISTS anon_insert_predictions ON predictions;
CREATE POLICY anon_insert_predictions ON predictions
  FOR INSERT TO anon WITH CHECK (
    octet_length(answers::text) <= 10240
    AND length(fantasy_name) BETWEEN 3 AND 30
    AND array_length(tags, 1) <= 5
  );

-- 4. Tabla de configuración (resultados live, etc.)
CREATE TABLE IF NOT EXISTS config (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

INSERT INTO config (key, value) VALUES ('results_live', 'false')
  ON CONFLICT (key) DO NOTHING;

ALTER TABLE config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_config" ON config
  FOR SELECT TO anon USING (true);

-- 5. RLS para results (SELECT público)
DROP POLICY IF EXISTS anon_select_results ON results;
CREATE POLICY anon_select_results ON results
  FOR SELECT TO anon USING (true);
