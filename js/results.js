// ============================================
// El Juego del Mundial 2026 — Resultados / Ranking
// ============================================

const PAGE_SIZE = 50;
let rankingData = null;
let rankingPage = 0;
let resultsLive = false;

async function loadRanking() {
  const container = $('results-body');
  container.innerHTML = '<p class="help-text" style="text-align:center;padding:40px;">Cargando predicciones...</p>';

  try {
    const config = await supabase.getConfig();
    resultsLive = config.results_live === true;

    const predictions = await supabase.getAllPredictions();
    if (!predictions || predictions.length === 0) {
      container.innerHTML = '<p class="help-text" style="text-align:center;padding:40px;">Todavía no hay predicciones registradas.</p>';
      return;
    }

    // Load tournaments for filter
    allTournaments = await supabase.getTournaments();

    let realResults = null;
    if (resultsLive) {
      realResults = await supabase.getResults();
      if (!realResults && typeof SIMULATED_RESULTS !== 'undefined') {
        realResults = SIMULATED_RESULTS;
      }
    }

    rankingData = predictions.map(p => {
      const score = realResults ? computeScore(p.answers || {}, realResults) : { total: 0, breakdown: { grupos:0, champions:0, nonChamps:0, argentina:0, dobleCamiseta:0, final:0, goleador:0 } };
      return {
        fantasyName: p.fantasy_name,
        tags: p.tags || [],
        total: score.total,
        breakdown: score.breakdown,
        answers: p.answers
      };
    });

    rankingData.sort((a, b) => resultsLive ? b.total - a.total : a.fantasyName.localeCompare(b.fantasyName));

    renderGeneralRanking(rankingData);
  } catch (err) {
    container.innerHTML = '<p class="help-text" style="text-align:center;padding:40px;">Error al cargar datos.</p>';
    console.error(err);
  }
}

let currentRankingView = 'general';

function allRankedTags() {
  const allNames = [...new Set(rankingData.flatMap(d => d.tags))];
  const meta = {};
  allTournaments.forEach(t => { meta[t.name] = t.visibility; });
  return allNames
    .filter(n => meta[n])
    .map(n => ({ name: n, visibility: meta[n] }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function renderGeneralRanking(data) {
  const container = $('results-body');
  const allTags = allRankedTags();
  const count = data.length;

  let html = `
    <div class="results-count">${count} participante${count !== 1 ? 's' : ''}</div>
    <div class="results-tabs">
      <button class="btn btn--tab ${currentRankingView === 'general' ? 'active' : ''}" data-view="general">Ranking General</button>
      <button class="btn btn--tab ${currentRankingView === 'tag' ? 'active' : ''}" data-view="tag">Por Torneo</button>
    </div>`;

  if (currentRankingView === 'general') {
    html += renderTable(data, allTags, 'general');
  } else {
    html += renderTable(data, allTags, 'tag');
  }

  container.innerHTML = html;
}

function renderTable(data, allTags, view) {
  const urlTag = new URLSearchParams(window.location.search).get('tag');
  const selectedTag = view === 'tag' ? (urlTag || allTags[0]?.name || '') : null;
  const filtered = selectedTag ? data.filter(d => d.tags.includes(selectedTag)) : data;
  const sorted = view === 'tag' ? [...filtered].sort((a, b) => resultsLive ? b.total - a.total : a.fantasyName.localeCompare(b.fantasyName)) : data;

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  if (rankingPage >= totalPages) rankingPage = totalPages - 1;
  if (rankingPage < 0) rankingPage = 0;
  const start = rankingPage * PAGE_SIZE;
  const page = sorted.slice(start, start + PAGE_SIZE);

  let html = `<div class="results-section">
    <h3>${resultsLive ? (view === 'general' ? 'Ranking General' : 'Ranking por Torneo') : (view === 'general' ? 'Participantes' : 'Participantes por Torneo')}</h3>`;

  if (view === 'tag') {
    html += `<div class="tag-filter">
      <select id="tag-filter-select" onchange="switchTag(this.value)">
        <option value="">— Todos —</option>
        ${allTags.map(t => {
          return `<option value="${escapeHtml(t.name)}" ${t.name === selectedTag ? 'selected' : ''}>${escapeHtml(t.name)}</option>`;
        }).join('')}
      </select></div>`;
  }

  html += `<div class="ranking-table-wrap">
      <table class="ranking-table">
        <thead><tr><th>#</th><th>Nombre</th><th>Puntos</th><th title="Grupos">G</th><th title="Campeones">C</th><th title="No campeones">NC</th><th title="Argentina">AR</th><th title="La primera vez">1ª</th><th title="Final">F</th><th title="Goleador">GL</th></tr></thead>
        <tbody>`;

  page.forEach((d, i) => {
    const rank = start + i;
    const medal = resultsLive && rank === 0 ? '🥇' : resultsLive && rank === 1 ? '🥈' : resultsLive && rank === 2 ? '🥉' : '';
    const rowClass = medal ? 'top-three' : '';
    html += `<tr class="${rowClass} clickable-row" data-name="${escapeHtml(d.fantasyName)}">
      <td>${medal || (rank + 1)}</td>
      <td class="name-cell">${escapeHtml(d.fantasyName)}</td>
      <td class="pts-cell">${resultsLive ? d.total.toLocaleString() : '0'}</td>
      <td>${resultsLive ? d.breakdown.grupos : 0}</td>
      <td>${resultsLive ? d.breakdown.champions : 0}</td>
      <td>${resultsLive ? d.breakdown.nonChamps : 0}</td>
      <td>${resultsLive ? d.breakdown.argentina : 0}</td>
      <td>${resultsLive ? d.breakdown.dobleCamiseta : 0}</td>
      <td>${resultsLive ? d.breakdown.final : 0}</td>
      <td>${resultsLive ? d.breakdown.goleador : 0}</td>
    </tr>`;
  });

  html += `</tbody></table></div>`;

  if (totalPages > 1) {
    html += `<div class="pagination">
      <button class="btn btn--ghost" data-page="prev" ${rankingPage <= 0 ? 'disabled' : ''}>← Anterior</button>
      <span class="page-info">Página ${rankingPage + 1} de ${totalPages} (${sorted.length} participante${sorted.length !== 1 ? 's' : ''})</span>
      <button class="btn btn--ghost" data-page="next" ${rankingPage >= totalPages - 1 ? 'disabled' : ''}>Siguiente →</button>
    </div>`;
  }

  html += `</div>`;
  return html;
}

function switchTag(tag) {
  currentRankingView = 'tag';
  const url = new URL(window.location);
  if (tag) url.searchParams.set('tag', tag);
  else url.searchParams.delete('tag');
  window.history.replaceState({}, '', url);
  renderGeneralRanking(rankingData || []);
}

/* ---------- MODAL DE DETALLE ---------- */
function hideDetailModal() {
  const modal = $('detail-modal');
  if (modal) modal.classList.remove('visible');
}

async function showDetailModal(name) {
  const modal = $('detail-modal');
  const body = $('detail-body');
  if (!modal || !body) return;

  body.innerHTML = '<p style="text-align:center;padding:20px;">Cargando...</p>';
  modal.classList.add('visible');

  if (!resultsLive) {
    body.innerHTML = `
      <div style="text-align:center;padding:30px 20px;">
        <div style="font-size:48px;margin-bottom:16px;">🏆</div>
        <h3 style="margin-bottom:12px;">${escapeHtml(name)}</h3>
        <p style="color:var(--text-muted);font-size:0.95rem;max-width:400px;margin:0 auto;">
          Las predicciones completas estarán disponibles cuando comience el Mundial.
        </p>
      </div>`;
    return;
  }

  try {
    const pred = await supabase.getPredictionByName(name);
    if (!pred || !pred.answers) {
      body.innerHTML = '<p style="text-align:center;padding:20px;">No se encontraron predicciones.</p>';
      return;
    }
    body.innerHTML = renderPredictionDetail(name, pred.tags || [], pred.answers);
  } catch (err) {
    body.innerHTML = '<p style="text-align:center;padding:20px;">Error al cargar.</p>';
    console.error(err);
  }
}

function renderPredictionDetail(name, tags, answers) {
  const a = answers;
  const stageLabel = s => STAGES.find(x => x.value === s)?.label || s;
  const argLabels = { dieciseisavos: 'Dieciseisavos', octavos: 'Octavos', cuartos: 'Cuartos', semis: 'Semifinal', final: 'Final' };
  const argOrder = ['dieciseisavos', 'octavos', 'cuartos', 'semis', 'final'];

  let html = `<h3 style="margin-bottom:4px;">${escapeHtml(name)}</h3>`;
  if (tags.length) html += `<p style="font-size:0.8rem;color:var(--text-muted);margin-bottom:16px;">🏆 ${tags.map(t => escapeHtml(t)).join(', ')}</p>`;

  html += '<div class="detail-grid">';

  html += '<div class="detail-block"><h4>Fase de Grupos</h4>';
  const groups = a.groups || {};
  Object.keys(groups).sort().forEach(g => {
    const s = groups[g];
    if (s && s.first && s.second) html += `<span class="detail-item">Grupo ${g}: 1° ${escapeHtml(s.first)}, 2° ${escapeHtml(s.second)}</span>`;
  });
  html += '</div>';

  html += '<div class="detail-block"><h4>Campeones</h4>';
  (a.champions ? Object.keys(a.champions) : []).forEach(c => {
    if (a.champions[c]) html += `<span class="detail-item">${escapeHtml(c)} → ${stageLabel(a.champions[c])}</span>`;
  });
  html += '</div>';

  html += '<div class="detail-block"><h4>El resto del mundo</h4>';
  (a.nonChamps || []).forEach(n => {
    if (n.team && n.stage) html += `<span class="detail-item">${escapeHtml(n.team)} → ${stageLabel(n.stage)}</span>`;
  });
  html += '</div>';

  html += '<div class="detail-block"><h4>Camino de Argentina</h4>';
  if (a.argentina) {
    if (a.argentina.grupo) html += `<span class="detail-item">Grupo: ${a.argentina.grupo}°</span>`;
    argOrder.forEach(s => {
      if (a.argentina.rivales?.[s]) html += `<span class="detail-item">${argLabels[s]}: ${escapeHtml(a.argentina.rivales[s])}</span>`;
      else if (a.argentina.plantarse === s) html += `<span class="detail-item">${argLabels[s]}: ✅ Te plantaste acá</span>`;
    });
  }
  html += '</div>';

  if (a.dobleCamiseta?.team) {
    html += '<div class="detail-block"><h4>La primera vez</h4>';
    html += `<span class="detail-item">${escapeHtml(a.dobleCamiseta.team)} — ${a.dobleCamiseta.mode === 'solo' ? 'Único debutante' : 'Compartido'}</span></div>`;
  }

  if (a.final?.team1 && a.final?.team2) {
    html += '<div class="detail-block"><h4>Final y campeón</h4>';
    const f = a.final;
    html += `<span class="detail-item">${escapeHtml(f.team1)} ${f.score1}-${f.score2} ${escapeHtml(f.team2)}`;
    if (f.champion) html += ` — Campeón: ${f.champion === '1' ? escapeHtml(f.team1) : escapeHtml(f.team2)}`;
    html += '</span></div>';
  }

  if (a.goleador?.player) {
    html += '<div class="detail-block"><h4>Goleador</h4>';
    html += `<span class="detail-item">${escapeHtml(a.goleador.player)} — ${a.goleador.goals} goles</span></div>`;
  }

  html += '</div>';
  return html;
}
