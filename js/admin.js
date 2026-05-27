// ============================================
// El Juego del Mundial 2026 — Admin Panel
// ============================================

let adminSecret = '';

// Templates de ejemplo para cada categoría
const ADMIN_TEMPLATES = {
  groups: '{\n  "A": {"first": "México", "second": "Sudáfrica"},\n  "B": {"first": "Suiza", "second": "Canadá"}\n}',
  champions: '{\n  "Argentina": "final",\n  "Brasil": "cuartos"\n}',
  nonChamps: '[\n  {"team": "Países Bajos", "stage": "semis"},\n  {"team": "Portugal", "stage": "cuartos"}\n]',
  argentina: '{\n  "grupo": "1",\n  "rivales": {\n    "dieciseisavos": "Senegal",\n    "octavos": "Uruguay",\n    "cuartos": "Países Bajos",\n    "semis": "Inglaterra",\n    "final": "Francia"\n  },\n  "plantarse": null\n}',
  dobleCamiseta: '{\n  "team": "Curazao",\n  "mode": "solo"\n}',
  final: '{\n  "team1": "Argentina",\n  "team2": "Inglaterra",\n  "score1": "3",\n  "score2": "1",\n  "champion": "1"\n}',
  goleador: '{\n  "player": "Lionel Messi (Argentina)",\n  "goals": "8"\n}'
};

const ADMIN_CATEGORIES = [
  { id: 'groups', label: 'Fase de Grupos' },
  { id: 'champions', label: 'Campeones' },
  { id: 'nonChamps', label: 'No campeones' },
  { id: 'argentina', label: 'Camino de Argentina' },
  { id: 'dobleCamiseta', label: 'Doble camiseta' },
  { id: 'final', label: 'Final' },
  { id: 'goleador', label: 'Goleador' },
];

function showAdminScreen() {
  showScreen('admin');
  renderAdminLogin();
}

function renderAdminLogin() {
  const body = $('admin-body');
  body.innerHTML = `
    <div class="admin-login">
      <h2>Admin</h2>
      <input type="password" id="admin-pass" placeholder="Contraseña" style="max-width:300px;margin:12px 0;">
      <button class="btn btn--primary" id="admin-login-btn">Ingresar</button>
      <p id="admin-error" style="color:var(--danger);display:none;margin-top:8px;">Contraseña incorrecta</p>
    </div>`;
  $('admin-login-btn').addEventListener('click', () => {
    adminSecret = $('admin-pass').value.trim();
    // Verify by trying to get current live status
    supabase.adminToggleLive(adminSecret).then(res => {
      // If it worked, toggle it back and show dashboard
      supabase.adminToggleLive(adminSecret).then(() => renderAdminDashboard());
    }).catch(() => {
      $('admin-error').style.display = 'block';
    });
  });
  $('admin-pass').addEventListener('keydown', e => {
    if (e.key === 'Enter') $('admin-login-btn').click();
  });
  setTimeout(() => $('admin-pass').focus(), 100);
}

async function renderAdminDashboard() {
  const body = $('admin-body');
  const config = await supabase.getConfig();
  const live = config.results_live === true;

  body.innerHTML = `
    <div class="admin-dashboard">
      <div class="admin-header">
        <h2>Admin</h2>
        <button class="btn btn--ghost" id="admin-logout">Salir</button>
      </div>

      <div class="admin-section">
        <h3>Modo live</h3>
        <p class="help-text">Actual: <strong>${live ? 'Activado' : 'Desactivado'}</strong></p>
        <button class="btn ${live ? 'btn--ghost' : 'btn--primary'}" id="admin-toggle-live">
          ${live ? 'Desactivar' : 'Activar'} resultados en vivo
        </button>
      </div>

      <div class="admin-section">
        <h3>Cargar resultados</h3>
        <label>Categoría</label>
        <select id="admin-category" style="margin-bottom:8px;">
          ${ADMIN_CATEGORIES.map(c => `<option value="${c.id}">${c.label}</option>`).join('')}
        </select>
        <textarea id="admin-json" rows="8" style="font-family:monospace;font-size:0.85rem;">${ADMIN_TEMPLATES.groups}</textarea>
        <button class="btn btn--primary" id="admin-submit-result" style="margin-top:8px;">Cargar</button>
        <p id="admin-result-status" style="margin-top:6px;"></p>
      </div>

      <div class="admin-section">
        <h3>Logs de errores</h3>
        <div id="admin-logs-container"><p class="help-text">Cargando...</p></div>
      </div>
    </div>`;

  // Toggle live
  $('admin-toggle-live').addEventListener('click', async () => {
    const newVal = await supabase.adminToggleLive(adminSecret);
    showToast(newVal ? '✅ Resultados activados' : '⏸️ Resultados desactivados');
    renderAdminDashboard();
  });

  // Category selector → template
  $('admin-category').addEventListener('change', () => {
    const cat = $('admin-category').value;
    $('admin-json').value = ADMIN_TEMPLATES[cat] || '';
  });

  // Submit result
  $('admin-submit-result').addEventListener('click', async () => {
    const cat = $('admin-category').value;
    const json = $('admin-json').value.trim();
    const status = $('admin-result-status');
    if (!json) { status.textContent = 'Escribí el JSON'; return; }
    try { JSON.parse(json); } catch (e) { status.textContent = 'JSON inválido'; return; }
    status.textContent = 'Cargando...';
    try {
      await supabase.adminSetResult(cat, json, adminSecret);
      status.innerHTML = '✅ Cargado';
      supabase.logError(`Admin loaded ${cat}`, { category: cat });
    } catch (err) {
      status.innerHTML = `❌ Error: ${err.message}`;
    }
  });

  // Logout
  $('admin-logout').addEventListener('click', () => {
    adminSecret = '';
    renderAdminLogin();
  });

  loadAdminLogs();
}

async function loadAdminLogs() {
  const container = $('admin-logs-container');
  if (!container) return;
  try {
    const logs = await supabase.adminGetLogs(adminSecret);
    if (!logs || logs.length === 0) {
      container.innerHTML = '<p class="help-text">Sin errores registrados.</p>';
      return;
    }
    container.innerHTML = `<div style="font-size:0.8rem;max-height:300px;overflow-y:auto;">
      ${logs.map(l => `<div style="padding:6px 0;border-bottom:1px solid var(--border);">
        <span style="color:var(--text-muted);font-size:0.75rem;">${escapeHtml(new Date(l.created_at).toLocaleString())}</span>
        <br>${escapeHtml(l.message)}
      </div>`).join('')}
    </div>`;
  } catch {
    container.innerHTML = '<p class="help-text">Error al cargar logs.</p>';
  }
}
