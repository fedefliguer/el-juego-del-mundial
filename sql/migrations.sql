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
-- NOTA: array_length devuelve NULL para arrays vacíos, por eso el OR
DROP POLICY IF EXISTS anon_insert_predictions ON predictions;
CREATE POLICY anon_insert_predictions ON predictions
  FOR INSERT TO anon WITH CHECK (
    octet_length(answers::text) <= 10240
    AND length(fantasy_name) BETWEEN 3 AND 30
    AND (array_length(tags, 1) IS NULL OR array_length(tags, 1) <= 5)
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

-- 6. Tabla de torneos (públicos / privados con código)
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private')),
  invite_code TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_select_tournaments" ON tournaments
  FOR SELECT TO anon USING (true);
CREATE POLICY "anon_insert_tournaments" ON tournaments
  FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "anon_update_tournaments" ON tournaments
  FOR UPDATE TO anon USING (true);

-- Seedear torneos existentes desde predictions como públicos
INSERT INTO tournaments (name, visibility)
SELECT DISTINCT t.tag, 'public'
FROM predictions p, LATERAL unnest(p.tags) AS t(tag)
ON CONFLICT (name) DO NOTHING;

-- Reemplazar get_all_tags con get_tournaments (incluye visibilidad)
DROP FUNCTION IF EXISTS get_all_tags;
CREATE OR REPLACE FUNCTION get_tournaments()
RETURNS TABLE(name TEXT, visibility TEXT) LANGUAGE SQL STABLE AS $$
  SELECT t.name, t.visibility FROM tournaments t ORDER BY t.name;
$$;
GRANT EXECUTE ON FUNCTION get_tournaments TO anon;

-- Función para verificar código de invitación
CREATE OR REPLACE FUNCTION verify_invite_code(tournament_name TEXT, code TEXT)
RETURNS BOOLEAN LANGUAGE SQL STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM tournaments
    WHERE name = tournament_name
    AND visibility = 'private'
    AND invite_code = code
  );
$$;
GRANT EXECUTE ON FUNCTION verify_invite_code TO anon;

-- 7. Logs table para errores del lado del servidor
CREATE TABLE IF NOT EXISTS logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  level TEXT NOT NULL DEFAULT 'error',
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anon_insert_logs" ON logs
  FOR INSERT TO anon WITH CHECK (true);

-- Función RPC para loguear errores desde el frontend
CREATE OR REPLACE FUNCTION log_error(p_message TEXT, p_details JSONB DEFAULT NULL)
RETURNS void LANGUAGE SQL AS $$
  INSERT INTO logs (level, message, details) VALUES ('error', p_message, p_details);
$$;
GRANT EXECUTE ON FUNCTION log_error TO anon;
