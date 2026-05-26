-- ============================================
-- El Juego del Mundial 2026 — Schema Supabase
-- ============================================
-- Ejecutar esto en el SQL Editor de Supabase

-- 1. PREDICCIONES de los usuarios
CREATE TABLE predictions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  fantasy_name TEXT UNIQUE NOT NULL,
  tags TEXT[] DEFAULT '{}',
  answers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_predictions_fantasy_name ON predictions (fantasy_name);

-- 2. RESULTADOS reales del torneo (los carga el admin post-torneo)
CREATE TABLE results (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  result JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security — permitir INSERT y SELECT anónimo
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon_insert_predictions" ON predictions
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon_select_predictions" ON predictions
  FOR SELECT TO anon USING (true);

CREATE POLICY "anon_select_results" ON results
  FOR SELECT TO anon USING (true);

-- 4. Función para obtener todos los tags existentes (para autocompletado)
CREATE OR REPLACE FUNCTION get_all_tags()
RETURNS TABLE(tag TEXT) LANGUAGE SQL STABLE AS $$
  SELECT DISTINCT t.tag
  FROM predictions p, LATERAL unnest(p.tags) AS t(tag)
  ORDER BY t.tag;
$$;

GRANT EXECUTE ON FUNCTION get_all_tags TO anon;
