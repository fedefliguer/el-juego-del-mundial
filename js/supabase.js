// ============================================
// El Juego del Mundial 2026 — Supabase
// ============================================
// EDITAR: reemplazar URL y KEY con los datos
// de tu proyecto en https://supabase.com

const SUPABASE_URL = 'https://frnqrkbkwtgnurcywnkx.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_vdvfusSPX7NPUIvZKm0ALg_Xh3p51CD';

const supabase = {
  async request(method, path, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Prefer': 'return=minimal'
      },
      body: body ? JSON.stringify(body) : undefined
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Supabase error ${res.status}: ${text}`);
    }
    return res;
  },

  async getConfig() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/config?select=key,value`,
        { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (!res.ok) return {};
      const rows = await res.json();
      const cfg = {};
      rows.forEach(r => { cfg[r.key] = r.value; });
      return cfg;
    } catch { return {}; }
  },

  // Trae todos los resultados reales y los arma en un objeto
  async getResults() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/results?select=category,result`,
        { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (!res.ok) return null;
      const rows = await res.json();
      if (!rows || rows.length === 0) return null;
      const merged = {};
      rows.forEach(r => { merged[r.category] = r.result; });
      return merged;
    } catch { return null; }
  },

  async getPredictionByName(name) {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/predictions?fantasy_name=eq.${encodeURIComponent(name)}&select=fantasy_name,tags,answers`,
        { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (!res.ok) return null;
      const rows = await res.json();
      return rows[0] || null;
    } catch { return null; }
  },

  // Obtiene todas las predicciones para el ranking
  async getAllPredictions() {
    try {
      const res = await fetch(
        `${SUPABASE_URL}/rest/v1/predictions?select=fantasy_name,tags,answers`,
        { headers: { 'apikey': SUPABASE_ANON_KEY, 'Authorization': `Bearer ${SUPABASE_ANON_KEY}` } }
      );
      if (!res.ok) return [];
      return await res.json();
    } catch { return []; }
  },

  // Verifica si un nombre de fantasía ya existe
  async nameExists(name) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/predictions?fantasy_name=eq.${encodeURIComponent(name)}&select=fantasy_name`,
      {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      }
    );
    const data = await res.json();
    return data.length > 0;
  },

  // Guarda una predicción
  async submit({ fantasyName, tags, answers }) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/predictions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({
        fantasy_name: fantasyName,
        tags,
        answers
      })
    });
    if (!res.ok) {
      const text = await res.text();
      if (res.status === 409 || text.includes('duplicate') || text.includes('unique')) {
        throw new Error('duplicate_name');
      }
      throw new Error(`Supabase error ${res.status}: ${text}`);
    }
    return res;
  },

  // Obtiene todos los tags existentes (para autocompletado)
  async getTags() {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_all_tags`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (!res.ok) return [];
      const data = await res.json();
      return data.map(d => d.tag);
    } catch {
      return [];
    }
  }
};
