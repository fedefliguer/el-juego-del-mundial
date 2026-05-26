// ============================================
// El Juego del Mundial 2026 — App Principal
// ============================================

function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

const STORAGE_KEY = 'mundial2026_state';

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers: state.answers,
      tags: state.tags,
      fantasyName: state.fantasyName,
      step: state.step
    }));
  } catch (e) { /* quota exceeded, ignore */ }
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.answers) state.answers = saved.answers;
    if (saved.tags) state.tags = saved.tags;
    if (saved.fantasyName) state.fantasyName = saved.fantasyName;
    if (saved.step !== undefined) state.step = saved.step;
  } catch (e) { /* corrupt data, ignore */ }
}

const state = {
  screen: 'landing',
  step: 0,
  answers: {
    groups: {},
    champions: {},
    nonChamps: [{ team: '', stage: '' }, { team: '', stage: '' }, { team: '', stage: '' }],
    argentina: { grupo: '', rivales: {}, plantarse: null },
    dobleCamiseta: { team: '', mode: '' },
    final: { team1: '', team2: '', score1: '', score2: '', champion: '' },
    goleador: { player: '', goals: '' }
  },
  tags: [],
  fantasyName: '',
  captcha: null
};

const $ = id => document.getElementById(id);
const screens = {
  landing: $('s-landing'), form: $('s-form'),
  final: $('s-final'), done: $('s-done'),
  results: $('s-results')
};
const stepBody = $('step-body');
const stepCounter = $('step-counter');
const stepDots = $('step-dots');
const progressFill = $('progress-fill');
const btnBack = $('btn-back');
const btnNext = $('btn-next');
const toast = $('toast');

function showScreen(name) {
  Object.keys(screens).forEach(k => screens[k].classList.toggle('active', k === name));
  state.screen = name;
}

let toastTimer;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

function generateCaptcha() {
  const a = Math.floor(Math.random() * 10) + 1;
  const b = Math.floor(Math.random() * 10) + 1;
  return { question: `¿Cuánto es ${a} + ${b}?`, answer: a + b };
}

function isStepComplete(idx) {
  const step = STEPS[idx];
  const type = step.type || 'groups';

  if (type === 'groups') {
    const allGroups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    return allGroups.every(g => {
      const s = state.answers.groups[g];
      return s && s.first && s.second && s.first !== s.second;
    });
  }
  if (type === 'champions') return CHAMPIONS.every(c => state.answers.champions[c]);
  if (type === 'non_champions') return state.answers.nonChamps.every(n => n.team && n.stage);
  if (type === 'argentina') return !!state.answers.argentina.grupo;
  if (type === 'doble_camiseta') return !!(state.answers.dobleCamiseta.team && state.answers.dobleCamiseta.mode);
  if (type === 'final') {
    const f = state.answers.final;
    if (!(f.team1 && f.team2 && f.team1 !== f.team2)) return false;
    if (f.score1 === '' || f.score2 === '') return false;
    return !!f.champion;
  }
  if (type === 'goleador') return !!(state.answers.goleador.player && state.answers.goleador.goals !== '');
  return false;
}

function allStepsComplete() {
  return STEPS.every((_, i) => isStepComplete(i));
}

/* ---------- RENDER STEP DOTS ---------- */
function renderStepDots() {
  stepDots.innerHTML = STEPS.map((s, i) => {
    const done = isStepComplete(i);
    const active = i === state.step;
    const cls = `step-dot${active ? ' active' : ''}${done ? ' done' : ''}`;
    return `<button class="${cls}" data-step="${i}" title="${STEP_NAMES[i]}">${i + 1}</button>`;
  }).join('');
}

/* ---------- CLEAR STEP ---------- */
function clearStep() {
  const t = STEPS[state.step].type || 'groups';
  if (t === 'groups') state.answers.groups = {};
  else if (t === 'champions') state.answers.champions = {};
  else if (t === 'non_champions') state.answers.nonChamps = [{ team: '', stage: '' }, { team: '', stage: '' }, { team: '', stage: '' }];
  else if (t === 'argentina') state.answers.argentina = { grupo: '', rivales: {}, plantarse: null };
  else if (t === 'doble_camiseta') state.answers.dobleCamiseta = { team: '', mode: '' };
  else if (t === 'final') state.answers.final = { team1: '', team2: '', score1: '', score2: '', champion: '' };
  else if (t === 'goleador') state.answers.goleador = { player: '', goals: '' };
  saveState();
  renderCurrentStep();
}

/* ---------- RANDOM FILL ---------- */
function fillStepRandom() {
  const step = STEPS[state.step];
  const type = step.type || 'groups';

  if (type === 'groups') {
    step.groups.forEach(g => {
      const teams = [...GROUPS[g]].sort(() => Math.random() - 0.5);
      state.answers.groups[g] = { first: teams[0], second: teams[1] };
    });
  } else if (type === 'champions') {
    const fase = ['grupos','dieciseisavos','octavos','cuartos','tercero','final'];
    CHAMPIONS.forEach(c => state.answers.champions[c] = fase[Math.floor(Math.random() * fase.length)]);
  } else if (type === 'non_champions') {
    const nt = TEAMS.filter(t => !CHAMPIONS.includes(t));
    const fase = ['grupos','dieciseisavos','octavos','cuartos','tercero','final'];
    for (let i = 0; i < 3; i++) state.answers.nonChamps[i] = { team: nt[Math.floor(Math.random() * nt.length)], stage: fase[Math.floor(Math.random() * fase.length)] };
  } else if (type === 'argentina') {
    state.answers.argentina = { grupo: String(Math.floor(Math.random() * 4) + 1), rivales: {}, plantarse: null };
    const na = TEAMS.filter(t => t !== 'Argentina');
    ['dieciseisavos','octavos','cuartos','semis','final'].forEach(s => state.answers.argentina.rivales[s] = na[Math.floor(Math.random() * na.length)]);
  } else if (type === 'doble_camiseta') {
    state.answers.dobleCamiseta = { team: DEBUTANTS[Math.floor(Math.random() * DEBUTANTS.length)], mode: Math.random() > 0.5 ? 'solo' : 'compartido' };
  } else if (type === 'final') {
    const t = [...TEAMS].sort(() => Math.random() - 0.5);
    state.answers.final = { team1: t[0], team2: t[1], score1: String(Math.floor(Math.random() * 5)), score2: String(Math.floor(Math.random() * 5)), champion: String(Math.floor(Math.random() * 2) + 1) };
  } else if (type === 'goleador') {
    state.answers.goleador = { player: PLAYERS[Math.floor(Math.random() * PLAYERS.length)], goals: String(Math.floor(Math.random() * 15) + 1) };
  }

  saveState();
  renderCurrentStep();
}

/* ---------- RENDER STEPS ---------- */
function renderCurrentStep() {
  const step = STEPS[state.step];
  const total = STEPS.length;
  const comp = STEPS.filter((_, i) => isStepComplete(i)).length;

  stepCounter.textContent = `Paso ${state.step + 1} de ${total} — ${STEP_NAMES[state.step]}  ·  ${comp}/${total}`;
  progressFill.style.width = `${(comp / total) * 100}%`;
  renderStepDots();

  const type = step.type || 'groups';
  let header = `<h2 class="step-title">${step.title}</h2><p class="step-desc">${step.desc}</p>`;
  let body = '';

  if (type === 'groups') body = renderGroups();
  else if (type === 'champions') body = renderChampions();
  else if (type === 'non_champions') body = renderNonChampions();
  else if (type === 'argentina') body = renderArgentina();
  else if (type === 'doble_camiseta') body = renderDobleCamiseta();
  else if (type === 'final') body = renderFinal();
  else if (type === 'goleador') body = renderGoleador();

  stepBody.innerHTML = `
    <div class="step-scroll">
      ${header}${body}
      <div class="step-actions">
        <button class="btn btn--ghost btn--action" id="btn-clear">🗑️ Borrar todo</button>
        <button class="btn btn--ghost btn--action" id="btn-random">🎲 Aleatorio</button>
      </div>
    </div>`;

  $('btn-clear').addEventListener('click', clearStep);
  $('btn-random').addEventListener('click', fillStepRandom);

  btnBack.style.visibility = state.step === 0 ? 'hidden' : 'visible';
  const done = allStepsComplete();
  btnNext.textContent = state.step < STEPS.length - 1 ? 'Siguiente →' : (done ? 'Finalizar ✦' : 'Faltan pasos ⚠️');
  btnNext.disabled = !isStepComplete(state.step);
}

/* --- GROUPS (clickable buttons) --- */
function renderGroups() {
  let html = '<div class="groups-grid">';
  ['A','B','C','D','E','F','G','H','I','J','K','L'].forEach(g => {
    const teams = GROUPS[g];
    const saved = state.answers.groups[g] || {};
    html += `<div class="group-card"><h4>Grupo ${g}</h4><div class="group-teams">`;
    teams.forEach(t => {
      const is1 = saved.first === t;
      const is2 = saved.second === t;
      html += `<div class="team-row${is1 ? ' first' : ''}${is2 ? ' second' : ''}">
        <span class="team-name">${t}</span>
        <button class="pos-btn${is1 ? ' active-1' : ''}" data-action="group-pick" data-group="${g}" data-team="${t}" data-pos="first">1°</button>
        <button class="pos-btn${is2 ? ' active-2' : ''}" data-action="group-pick" data-group="${g}" data-team="${t}" data-pos="second">2°</button>
      </div>`;
    });
    html += '</div></div>';
  });
  return html + '</div>';
}

/* --- CHAMPIONS (show prediction text when selected) --- */
function renderChampions() {
  const saved = state.answers.champions;
  let html = '<div class="champ-list">';
  CHAMPIONS.forEach(c => {
    if (saved[c]) {
      const label = STAGES.find(s => s.value === saved[c])?.label || saved[c];
      html += `<div class="champ-row done"><span class="team-name">${c}</span><span class="pred-text">→ ${label}</span><button class="btn-change" data-action="champ-unset" data-team="${c}">✎</button></div>`;
    } else {
      html += `<div class="champ-row"><span class="team-name">${c}</span><select data-field="champions.${c}"><option value="">— Elegí —</option>${STAGES.map(s => `<option value="${s.value}">${s.label}</option>`).join('')}</select></div>`;
    }
  });
  return html + '</div>';
}

/* --- NON-CHAMPIONS --- */
function renderNonChampions() {
  const nt = TEAMS.filter(t => !CHAMPIONS.includes(t));
  const saved = state.answers.nonChamps;
  let html = '<div class="champ-list">';
  for (let i = 0; i < 3; i++) {
    const s = saved[i] || { team: '', stage: '' };
    if (s.team && s.stage) {
      const stageLabel = STAGES.find(x => x.value === s.stage)?.label || s.stage;
      html += `<div class="champ-row done"><span class="team-name">${s.team}</span><span class="pred-text">→ ${stageLabel}</span><button class="btn-change" data-action="nc-unset" data-idx="${i}">✎</button></div>`;
    } else if (s.team && !s.stage) {
      html += `<div class="champ-row">
        <span class="team-name">${s.team}</span>
        <select data-field="nonChamps.${i}.stage"><option value="">— Techo —</option>${STAGES.map(sg => `<option value="${sg.value}">${sg.label}</option>`).join('')}</select>
      </div>`;
    } else {
      html += `<div class="champ-row">
        <select data-field="nonChamps.${i}.team"><option value="">Equipo #${i+1}</option>${nt.map(t => `<option value="${t}" ${s.team === t ? 'selected' : ''}>${t}</option>`).join('')}</select>
      </div>`;
    }
  }
  return html + '</div><p class="help-text">Se puede apostar más de una vez al mismo equipo.</p>';
}

/* --- ARGENTINA PATH --- */
function renderArgentina() {
  const na = TEAMS.filter(t => t !== 'Argentina');
  const a = state.answers.argentina;
  const labels = { dieciseisavos: 'Dieciseisavos', octavos: 'Octavos', cuartos: 'Cuartos', semis: 'Semifinal', final: 'Final' };
  const order = ['dieciseisavos', 'octavos', 'cuartos', 'semis', 'final'];

  let html = `<div class="arg-step${a.grupo ? ' done' : ''}">
    <h4>Posición en fase de grupos</h4>
    <select data-field="argentina.grupo">
      <option value="">— Elegí —</option>
      ${[1,2,3,4].map(n => `<option value="${n}" ${a.grupo === String(n) ? 'selected' : ''}>${n}°</option>`).join('')}
    </select>
  </div>`;

  order.forEach((s, i) => {
    const planted = a.plantarse === s;
    const afterPlant = a.plantarse && order.indexOf(a.plantarse) < i;
    if (afterPlant) {
      html += `<div class="arg-step muted"><h4>${labels[s]}</h4><span class="muted-text">—</span></div>`;
    } else if (planted) {
      html += `<div class="arg-step done"><h4>${labels[s]}</h4><span class="planted-badge">✅ Te plantaste acá</span><button class="btn-change" data-action="unplantar" data-stage="${s}">✎</button></div>`;
    } else {
      const filled = a.rivales[s];
      html += `<div class="arg-step${filled ? ' done' : ''}">
        <h4>${labels[s]}</h4>
        <select data-field="argentina.rivales.${s}">
          <option value="">Rival</option>
          ${na.map(t => `<option value="${t}" ${a.rivales[s] === t ? 'selected' : ''}>${t}</option>`).join('')}
        </select>
        <button class="btn btn--ghost plant-btn" data-action="plantar" data-stage="${s}">🛑 Plantarme acá</button>
      </div>`;
    }
  });

  return html;
}

/* --- DOBLE CAMISETA --- */
function renderDobleCamiseta() {
  const dc = state.answers.dobleCamiseta;
  return `
    <div class="form-group"><label>Equipo debutante que llegará más lejos</label>
      <select data-field="dobleCamiseta.team"><option value="">— Elegí —</option>${DEBUTANTS.map(t => `<option value="${t}" ${dc.team === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
    <div class="form-group"><label>Modalidad</label>
      <select data-field="dobleCamiseta.mode"><option value="">— Elegí —</option>
        <option value="solo" ${dc.mode === 'solo' ? 'selected' : ''}>Único debutante en esa fase</option>
        <option value="compartido" ${dc.mode === 'compartido' ? 'selected' : ''}>Comparte con otro(s)</option></select></div>`;
}

/* --- FINAL --- */
function renderFinal() {
  const f = state.answers.final;
  const both = f.team1 && f.team2 && f.team1 !== f.team2;
  return `<div style="display:grid;grid-template-columns:1fr auto 1fr;gap:12px;align-items:end;">
    <div class="form-group"><label>Finalista A</label><select data-field="final.team1"><option value="">— Elegí —</option>${TEAMS.map(t => `<option value="${t}" ${f.team1 === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div>
    <div style="text-align:center;padding-bottom:12px;font-weight:700;color:var(--text-muted);font-size:1.2rem;">vs</div>
    <div class="form-group"><label>Finalista B</label><select data-field="final.team2"><option value="">— Elegí —</option>${TEAMS.map(t => `<option value="${t}" ${f.team2 === t ? 'selected' : ''}>${t}</option>`).join('')}</select></div></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
      <div class="form-group"><label>Goles ${f.team1 || 'A'}</label><input type="number" data-field="final.score1" min="0" max="15" placeholder="0" value="${f.score1}"></div>
      <div class="form-group"><label>Goles ${f.team2 || 'B'}</label><input type="number" data-field="final.score2" min="0" max="15" placeholder="0" value="${f.score2}"></div></div>
    <div class="form-group" style="border-top:2px solid var(--border);padding-top:16px;margin-top:8px;">
      <label>🏆 Campeón</label>
      ${both ? `<select data-field="final.champion"><option value="">— Elegí —</option><option value="1" ${f.champion === '1' ? 'selected' : ''}>${f.team1}</option><option value="2" ${f.champion === '2' ? 'selected' : ''}>${f.team2}</option></select>`
      : `<p class="help-text">Primero elegí los dos finalistas.</p>`}
    </div>`;
}

/* --- GOLEADOR --- */
function renderGoleador() {
  const g = state.answers.goleador;
  return `<div class="form-group"><label>Jugador</label>
    <select data-field="goleador.player"><option value="">— Elegí —</option>${PLAYERS.map(p => `<option value="${p}" ${g.player === p ? 'selected' : ''}>${p}</option>`).join('')}</select></div>
    <div class="form-group"><label>Goles</label><input type="number" data-field="goleador.goals" min="0" max="30" placeholder="Ej: 8" value="${g.goals}"></div>
    <p class="help-text">"Otro" comparte puntos si hay empate de goleada.</p>`;
}

/* ---------- TAGS ---------- */
function addTag() {
  const inp = $('ff-tag-input');
  const v = inp.value.trim().replace(/^#/, '');
  if (v && !state.tags.includes(v) && state.tags.length < 5) {
    state.tags.push(v); inp.value = ''; renderTagsDOM(); validateFinal(); updateSubmitButton();
    hideSuggestions(); saveState();
  }
}
function renderTagsDOM() {
  const c = $('ff-tags-container');
  if (!c) return;
  c.innerHTML = state.tags.length === 0 ? '' : state.tags.map(t => `<span class="tag">${escapeHtml(t)} <span class="tag-remove" data-tag="${escapeHtml(t)}">×</span></span>`).join('');
}
function removeTag(name) {
  state.tags = state.tags.filter(t => t !== name); renderTagsDOM(); validateFinal(); updateSubmitButton();
  saveState();
}

/* ---------- SUMMARY ---------- */
function renderSummary() {
  const labels = { dieciseisavos: 'Dieciseisavos', octavos: 'Octavos', cuartos: 'Cuartos', semis: 'Semifinal', final: 'Final' };
  const order = ['dieciseisavos', 'octavos', 'cuartos', 'semis', 'final'];
  let html = '<div class="summary-section" id="summary-section"><h3>📋 Resumen de tus predicciones</h3>';

  html += '<div class="summary-block"><h4>Fase de Grupos</h4>';
  Object.keys(state.answers.groups).sort().forEach(g => {
    const s = state.answers.groups[g];
    if (s && s.first && s.second) {
      html += `<span class="summary-item">Grupo ${g}: 1° ${escapeHtml(s.first)}, 2° ${escapeHtml(s.second)}</span>`;
    }
  });
  html += '</div>';

  html += '<div class="summary-block"><h4>Campeones</h4>';
  CHAMPIONS.forEach(c => {
    if (state.answers.champions[c]) {
      const label = STAGES.find(s => s.value === state.answers.champions[c])?.label || state.answers.champions[c];
      html += `<span class="summary-item">${escapeHtml(c)} → ${label}</span>`;
    }
  });
  html += '</div>';

  html += '<div class="summary-block"><h4>Otros equipos</h4>';
  state.answers.nonChamps.forEach(n => {
    if (n.team && n.stage) {
      const label = STAGES.find(s => s.value === n.stage)?.label || n.stage;
      html += `<span class="summary-item">${escapeHtml(n.team)} → ${label}</span>`;
    }
  });
  html += '</div>';

  html += '<div class="summary-block"><h4>🇦🇷 Camino de Argentina</h4>';
  if (state.answers.argentina.grupo) {
    html += `<span class="summary-item">Grupo: ${state.answers.argentina.grupo}°</span>`;
    order.forEach(s => {
      if (state.answers.argentina.rivales[s]) {
        html += `<span class="summary-item">${labels[s]}: ${escapeHtml(state.answers.argentina.rivales[s])}</span>`;
      } else if (state.answers.argentina.plantarse === s) {
        html += `<span class="summary-item">${labels[s]}: ✅ Te plantaste acá</span>`;
      }
    });
  }
  html += '</div>';

  if (state.answers.dobleCamiseta.team) {
    html += '<div class="summary-block"><h4>Doble Camiseta</h4>';
    html += `<span class="summary-item">${escapeHtml(state.answers.dobleCamiseta.team)} — ${state.answers.dobleCamiseta.mode === 'solo' ? 'Único debutante' : 'Compartido'}</span></div>`;
  }

  const f = state.answers.final;
  if (f.team1 && f.team2) {
    html += '<div class="summary-block"><h4>La Final</h4>';
    html += `<span class="summary-item">${escapeHtml(f.team1)} ${f.score1}-${f.score2} ${escapeHtml(f.team2)}`;
    if (f.champion) html += ` — Campeón: ${f.champion === '1' ? escapeHtml(f.team1) : escapeHtml(f.team2)}`;
    html += '</span></div>';
  }

  if (state.answers.goleador.player) {
    html += '<div class="summary-block"><h4>Goleador</h4>';
    html += `<span class="summary-item">${escapeHtml(state.answers.goleador.player)} — ${state.answers.goleador.goals} goles</span></div>`;
  }

  html += '</div>';
  return html;
}

/* ---------- FINAL SCREEN ---------- */
let allExistingTags = [];
let tagAutocompleteTimer = null;

function renderFinalScreen() {
  const captcha = generateCaptcha();
  state.captcha = captcha;
  const body = $('final-body');

  body.innerHTML = `<h2>Revisá y confirmá</h2>
    <div class="final-section">
      <details open class="summary-details">
        <summary>Ver tus predicciones</summary>
        ${renderSummary()}
      </details>
    </div>
    <div class="final-section"><h3>Nombre de fantasía</h3>
      <input type="text" id="ff-name" placeholder="Ej: MessiFan2014" maxlength="30" value="${escapeHtml(state.fantasyName)}">
      <div id="ff-name-status" class="help-text">Debe ser único. Se valida al enviar.</div></div>
    <div class="final-section"><h3>Tags (máx. 5)</h3>
      <p class="help-text">Los tags te permiten ver el ranking por torneo. Escribí y elegí uno existente o creá uno nuevo.</p>
      <div id="ff-tag-wrapper" class="tag-input-wrapper" style="position:relative;">
        <input type="text" id="ff-tag-input" placeholder="Ej: amigos" maxlength="20" autocomplete="off">
        <button class="btn btn--primary" id="ff-tag-add">+</button>
        <div id="ff-tag-suggestions" class="tag-suggestions"></div>
      </div>
      <div id="ff-tags-container" class="tags-container"></div></div>
    <div class="final-section"><h3>Verificación</h3>
      <div class="captcha-box"><div class="question" id="captcha-q">${captcha.question}</div>
      <input type="number" id="captcha-a" placeholder="Tu respuesta" min="0">
      <p class="captcha-note">Respondé para confirmar que sos humano.</p></div></div>`;

  renderTagsDOM();
  const nameInput = $('ff-name');
  const tagInput = $('ff-tag-input');
  const tagAdd = $('ff-tag-add');
  const captchaInput = $('captcha-a');

  let nameCheckTimer = null;
  nameInput.addEventListener('input', () => {
    state.fantasyName = nameInput.value.trim();
    saveState();
    const status = $('ff-name-status');
    if (state.fantasyName.length < 3) {
      status.textContent = 'Mínimo 3 caracteres';
      status.style.color = 'var(--text-muted)';
    } else {
      status.textContent = 'Verificando disponibilidad...';
      status.style.color = 'var(--text-muted)';
      clearTimeout(nameCheckTimer);
      nameCheckTimer = setTimeout(async () => {
        const exists = await supabase.nameExists(state.fantasyName);
        if (exists) {
          status.textContent = '❌ Ese nombre ya existe. Elegí otro.';
          status.style.color = 'var(--danger)';
        } else {
          status.textContent = '✅ Disponible';
          status.style.color = 'var(--success)';
        }
        validateFinal();
        updateSubmitButton();
      }, 400);
    }
    validateFinal();
    updateSubmitButton();
  });
  tagInput.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); hideSuggestions(); } });
  tagAdd.addEventListener('click', () => { addTag(); hideSuggestions(); });
  captchaInput.addEventListener('input', () => { validateFinal(); updateSubmitButton(); });

  // Load existing tags for autocomplete
  supabase.getTags().then(tags => { allExistingTags = tags; });

  // Autocomplete on input
  tagInput.addEventListener('input', () => {
    clearTimeout(tagAutocompleteTimer);
    tagAutocompleteTimer = setTimeout(() => showTagSuggestions(tagInput.value.trim()), 200);
  });

  tagInput.addEventListener('blur', () => setTimeout(hideSuggestions, 200));
  tagInput.addEventListener('focus', () => {
    if (tagInput.value.trim()) showTagSuggestions(tagInput.value.trim());
  });

  validateFinal();
  updateSubmitButton();
}

function showTagSuggestions(query) {
  const wrap = $('ff-tag-suggestions');
  if (!wrap || !query) { wrap.innerHTML = ''; wrap.classList.remove('visible'); return; }

  const lower = query.toLowerCase();
  const matches = allExistingTags.filter(t => t.toLowerCase().includes(lower)).slice(0, 8);
  const exactMatch = matches.some(t => t.toLowerCase() === lower);
  let html = '';

  matches.forEach(t => {
    const idx = t.toLowerCase().indexOf(lower);
    const before = escapeHtml(t.slice(0, idx));
    const match = escapeHtml(t.slice(idx, idx + query.length));
    const after = escapeHtml(t.slice(idx + query.length));
    html += `<div class="tag-suggestion" data-tag="${escapeHtml(t)}">${before}<strong>${match}</strong>${after}</div>`;
  });

  if (matches.length === 0) {
    html += `<div class="tag-suggestion tag-suggestion--new" data-tag="${escapeHtml(query)}">🏁 Crear torneo <strong>${escapeHtml(query)}</strong></div>`;
  } else if (!exactMatch) {
    html += `<div class="tag-suggestion tag-suggestion--new" data-tag="${escapeHtml(query)}">🏁 Crear torneo <strong>${escapeHtml(query)}</strong></div>`;
  }

  wrap.innerHTML = html;
  wrap.classList.add('visible');
}

function hideSuggestions() {
  const wrap = $('ff-tag-suggestions');
  if (wrap) { wrap.innerHTML = ''; wrap.classList.remove('visible'); }
}

/* ---------- VALIDATION ---------- */
function validateStep() { btnNext.disabled = !isStepComplete(state.step); }
function validateFinal() { return state.fantasyName.length >= 3 && parseInt(($('captcha-a')||{}).value||'') === state.captcha?.answer; }
function updateSubmitButton() { const b = $('btn-submit'); b && (b.disabled = !validateFinal()); }

/* ---------- HANDLERS ---------- */
function handleFieldChange(target) {
  saveState();
  const field = target.dataset.field;
  if (!field) return;
  const parts = field.split('.');
  let obj = state.answers;
  for (let i = 0; i < parts.length - 1; i++) { if (!obj[parts[i]]) obj[parts[i]] = {}; obj = obj[parts[i]]; }
  obj[parts[parts.length - 1]] = target.value;

  if (parts[0] === 'groups') {
    const g = parts[1], pos = parts[2], team = target.value;
    const other = pos === 'first' ? 'second' : 'first';
    if (team && state.answers.groups[g] && state.answers.groups[g][other] === team) {
      state.answers.groups[g][other] = ''; renderCurrentStep(); return;
    }
  }

  if (parts[0] === 'argentina' && parts[1] === 'grupo') {
    const v = target.value;
    if (v === '3' || v === '4') {
      ['dieciseisavos','octavos','cuartos','semis','final'].forEach(s => state.answers.argentina.rivales[s] = '');
      state.answers.argentina.plantarse = null;
    }
    renderCurrentStep(); return;
  }

  if (parts[0] === 'argentina' && parts[1] === 'rivales') {
    state.answers.argentina.plantarse = null;
    renderCurrentStep(); return;
  }

  if (parts[0] === 'final') {
    if (parts[1] === 'team1' || parts[1] === 'team2') state.answers.final.champion = '';
    renderCurrentStep(); return;
  }

  if (parts[0] === 'champions' || parts[0] === 'nonChamps') {
    renderCurrentStep(); return;
  }

  renderStepDots();
  validateStep();
}

function handleGroupPick(target) {
  saveState();
  const g = target.dataset.group;
  const team = target.dataset.team;
  const pos = target.dataset.pos;
  if (!g || !team || !pos) return;
  if (!state.answers.groups[g]) state.answers.groups[g] = {};
  if (state.answers.groups[g][pos] === team) {
    delete state.answers.groups[g][pos];
    renderCurrentStep(); return;
  }
  const other = pos === 'first' ? 'second' : 'first';
  if (state.answers.groups[g][other] === team) state.answers.groups[g][other] = '';
  state.answers.groups[g][pos] = team;
  renderCurrentStep();
}

function handleAction(target) {
  saveState();
  const act = target.dataset.action;

  if (act === 'plantar') {
    const stage = target.dataset.stage;
    const order = ['dieciseisavos', 'octavos', 'cuartos', 'semis', 'final'];
    state.answers.argentina.plantarse = stage;
    state.answers.argentina.rivales[stage] = '';
    order.forEach((s, i) => { if (i > order.indexOf(stage)) state.answers.argentina.rivales[s] = ''; });
    renderCurrentStep();
  }

  if (act === 'champ-unset') {
    delete state.answers.champions[target.dataset.team];
    renderCurrentStep();
  }

  if (act === 'nc-unset') {
    const i = parseInt(target.dataset.idx);
    state.answers.nonChamps[i] = { team: '', stage: '' };
    renderCurrentStep();
  }

  if (act === 'unplantar') {
    state.answers.argentina.plantarse = null;
    renderCurrentStep();
  }
}

function missingSteps() {
  return STEPS.filter((_, i) => !isStepComplete(i)).map(s => s.title);
}

/* ---------- NAVIGATION ---------- */
function goToStep(idx) {
  if (idx < 0 || idx >= STEPS.length) return;
  state.step = idx;
  renderCurrentStep();
}

function nextStep() {
  if (state.step < STEPS.length - 1) { goToStep(state.step + 1); return; }
  if (!allStepsComplete()) {
    const miss = missingSteps();
    showToast(`Falta: ${miss.join(', ')}`);
    return;
  }
  showScreen('final');
  renderFinalScreen();
}

function prevStep() {
  if (state.screen === 'final') { showScreen('form'); renderCurrentStep(); return; }
  if (state.step === 0) { showScreen('landing'); return; }
  goToStep(state.step - 1);
}

/* ---------- SUBMIT ---------- */
async function handleSubmit() {
  if (!validateFinal()) return;
  const btn = $('btn-submit');
  btn.disabled = true; btn.classList.add('btn--loading');
  try {
    await supabase.submit({ fantasyName: state.fantasyName, tags: state.tags, answers: state.answers });
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    showScreen('done');
    $('done-name').textContent = `Registrado como "${state.fantasyName}".`;
  } catch (err) {
    if (err.message === 'duplicate_name') {
      showToast('❌ Ese nombre ya fue tomado. Elegí otro.');
    } else {
      showToast('Error al guardar.');
      console.error(err);
    }
    btn.disabled = false; btn.classList.remove('btn--loading');
  }
}

/* ---------- EVENT DELEGATION ---------- */
document.addEventListener('change', e => { if (e.target.matches('[data-field]')) handleFieldChange(e.target); });

document.addEventListener('click', e => {
  const t = e.target;
  if (t.classList.contains('step-dot') && t.dataset.step !== undefined) goToStep(parseInt(t.dataset.step));
  if (t.dataset.action === 'group-pick') handleGroupPick(t);
  if (t.dataset.action === 'plantar' || t.dataset.action === 'champ-unset' || t.dataset.action === 'nc-unset' || t.dataset.action === 'unplantar') handleAction(t);
  if (t.id === 'btn-start') { showScreen('form'); if (!localStorage.getItem(STORAGE_KEY)) state.step = 0; renderCurrentStep(); }
  if (t.id === 'btn-next') nextStep();
  if (t.id === 'btn-back' || t.id === 'btn-final-back') prevStep();
  if (t.id === 'btn-submit') handleSubmit();
  if (t.classList.contains('tag-remove')) removeTag(t.dataset.tag);
  if (t.classList.contains('tag-suggestion')) {
    const inp = $('ff-tag-input');
    if (inp) inp.value = t.dataset.tag;
    addTag();
  }
  if (t.closest('.clickable-row')) {
    const name = t.closest('.clickable-row').dataset.name;
    if (name) showDetailModal(name);
    return;
  }
  if (t.classList.contains('nav-link')) {
    const screen = t.dataset.screen;
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l === t));
    if (screen === 'form') { showScreen('form'); state.step = state.step || 0; renderCurrentStep(); }
    else if (screen === 'results') { showScreen('results'); loadRanking(); }
    else { showScreen('landing'); }
  }
  if (t.dataset.page === 'prev' && !t.disabled) {
    rankingPage = Math.max(0, rankingPage - 1);
    renderGeneralRanking(rankingData || []);
  }
  if (t.dataset.page === 'next' && !t.disabled) {
    rankingPage = Math.min(rankingPage + 1, Math.ceil((rankingData||[]).length / PAGE_SIZE) - 1);
    renderGeneralRanking(rankingData || []);
  }
  if (t.classList.contains('btn--tab')) {
    currentRankingView = t.dataset.view;
    rankingPage = 0;
    renderGeneralRanking(rankingData || []);
  }
});

if (typeof supabase === 'undefined') console.warn('Supabase no configurado.');

loadSavedState();
if (localStorage.getItem(STORAGE_KEY)) {
  setTimeout(() => showToast('↩️ Se restauró tu progreso anterior.'), 600);
}

// Handle ?tag= query param — open results view
const urlTag = new URLSearchParams(window.location.search).get('tag');
if (urlTag) {
  setTimeout(() => {
    document.querySelectorAll('.nav-link').forEach(l => l.classList.toggle('active', l.dataset.screen === 'results'));
    showScreen('results');
    loadRanking();
  }, 100);
}
