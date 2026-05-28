// ============================================
// El Juego del Mundial 2026 — App Principal
// ============================================

const STORAGE_KEY = 'mundial2026_state';

const PLACEHOLDER_NAMES = [
  'GastonSessa','LaureanoTombolini','HilarioNavarro','JuanCarlosOlave',
  'CristianTula','EduardoTuzzio','AdrianGonzalez','CarlosMatheu',
  'GastonAguirre','LucasLicht','ChristianCellay','JuanMercier',
  'NestorOrtigoza','FabianCubero','LeandroSomoza','VictorZapata',
  'JesusMendez','IsraelDamonte','NicolasOlmedo','RibairRodriguez',
  'EmilianoPapa','FrancoNiell','MatiasGimenez','PatricioToranzo',
  'SebastianPrediger','DavidRamirez','LucasBernardi','EstebanFuertes',
  'JoseSand','SantiagoSilva','MarianoPavone','JeronimoBarrales',
  'ClaudioBieler','RubenRamirez','CesarPereyra','FacundoParra',
  'JoaquinBoghossian','AndresSilvera','IsmaelBlanco','LucianoFigueroa',
  'SilvioRomero','JavierCampora','CarlosLuna','FedericoNieto',
  'DenisStracqualursi'
];

const GAME_URL = 'https://el-juego-del-mundial.vercel.app';

const TEAM_FLAGS = {
  'México':'🇲🇽','Sudáfrica':'🇿🇦','Corea del Sur':'🇰🇷','República Checa':'🇨🇿',
  'Canadá':'🇨🇦','Bosnia y Herzegovina':'🇧🇦','Catar':'🇶🇦','Suiza':'🇨🇭',
  'Brasil':'🇧🇷','Marruecos':'🇲🇦','Haití':'🇭🇹','Escocia':'🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  'Estados Unidos':'🇺🇸','Paraguay':'🇵🇾','Australia':'🇦🇺','Turquía':'🇹🇷',
  'Alemania':'🇩🇪','Curazao':'🇨🇼','Costa de Marfil':'🇨🇮','Ecuador':'🇪🇨',
  'Países Bajos':'🇳🇱','Japón':'🇯🇵','Suecia':'🇸🇪','Túnez':'🇹🇳',
  'Bélgica':'🇧🇪','Egipto':'🇪🇬','Irán':'🇮🇷','Nueva Zelanda':'🇳🇿',
  'España':'🇪🇸','Cabo Verde':'🇨🇻','Arabia Saudita':'🇸🇦','Uruguay':'🇺🇾',
  'Francia':'🇫🇷','Senegal':'🇸🇳','Irak':'🇮🇶','Noruega':'🇳🇴',
  'Argentina':'🇦🇷','Argelia':'🇩🇿','Austria':'🇦🇹','Jordania':'🇯🇴',
  'Portugal':'🇵🇹','RD Congo':'🇨🇩','Uzbekistán':'🇺🇿','Colombia':'🇨🇴',
  'Inglaterra':'🏴󠁧󠁢󠁥󠁮󠁧󠁿','Croacia':'🇭🇷','Ghana':'🇬🇭','Panamá':'🇵🇦',
};

const SHARE_STAGE_LABELS = {
  grupos:'Fase de grupos', dieciseisavos:'Dieciseisavos',
  octavos:'Octavos', cuartos:'Cuartos', tercero:'3° y 4°', final:'Final',
};

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      answers: state.answers,
      tags: state.tags,
      fantasyName: state.fantasyName,
      step: state.step,
      tournamentMeta: state.tournamentMeta
    }));
  } catch (e) { /* quota exceeded, ignore */ }
}

function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.answers) {
      state.answers = saved.answers;
      // Migración: goals: '' → '1' (v1→v2)
      if (state.answers.goleador && state.answers.goleador.goals === '') {
        state.answers.goleador.goals = '1';
      }
    }
    if (saved.tags) state.tags = saved.tags;
    if (saved.fantasyName) state.fantasyName = saved.fantasyName;
    if (saved.step !== undefined) state.step = saved.step;
    if (saved.tournamentMeta) state.tournamentMeta = saved.tournamentMeta;
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
    final: { team1: '', team2: '', score1: '0', score2: '0', champion: '' },
    goleador: { player: '', goals: '1' }
  },
  tags: [],
  fantasyName: '',
  tournamentMeta: {}
};

const $ = id => document.getElementById(id);
const screens = {};
function initScreens() {
  ['landing','form','final','done','results','admin'].forEach(id => {
    const el = $(`s-${id}`);
    if (el) screens[id] = el;
  });
}
initScreens();
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
let nameAvailable = null;
function showToast(msg) {
  clearTimeout(toastTimer);
  toast.textContent = msg;
  toast.classList.add('show');
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
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
  if (type === 'argentina') {
    const a = state.answers.argentina;
    if (!a.grupo) return false;
    const g = parseInt(a.grupo);
    if (g >= 3) return true;
    if (a.plantarse) return true;
    return ['dieciseisavos','octavos','cuartos','semis','final'].every(s => a.rivales?.[s]);
  }
  if (type === 'primera_vez') return !!(state.answers.dobleCamiseta.team && state.answers.dobleCamiseta.mode);
  if (type === 'final') {
    const f = state.answers.final;
    if (!(f.team1 && f.team2 && f.team1 !== f.team2)) return false;
    if (f.score1 === '' || f.score2 === '') return false;
    return !!f.champion;
  }
  if (type === 'goleador') return !!(state.answers.goleador.player && state.answers.goleador.goals !== '');
  return false;
}

function isStepPartial(idx) {
  const step = STEPS[idx];
  const type = step.type || 'groups';

  if (type === 'groups') {
    const allGroups = ['A','B','C','D','E','F','G','H','I','J','K','L'];
    return allGroups.some(g => {
      const s = state.answers.groups[g];
      return s && (s.first || s.second);
    });
  }
  if (type === 'champions') return CHAMPIONS.some(c => state.answers.champions[c]);
  if (type === 'non_champions') return state.answers.nonChamps.some(n => n.team);
  if (type === 'argentina') {
    const a = state.answers.argentina;
    return !!(a.grupo || a.plantarse || Object.values(a.rivales || {}).some(v => v));
  }
  if (type === 'primera_vez') return !!(state.answers.dobleCamiseta.team || state.answers.dobleCamiseta.mode);
  if (type === 'final') {
    const f = state.answers.final;
    return !!(f.team1 || f.team2 || f.score1 !== '0' || f.score2 !== '0' || f.champion);
  }
  if (type === 'goleador') return !!state.answers.goleador.player;
  return false;
}

function allStepsComplete() {
  return STEPS.every((_, i) => isStepComplete(i));
}

/* ---------- RENDER STEP DOTS ---------- */
function renderStepDots() {
  stepDots.innerHTML = STEPS.map((s, i) => {
    const done = isStepComplete(i);
    const partial = !done && isStepPartial(i);
    const active = i === state.step;
    const cls = `step-dot${active ? ' active' : ''}${done ? ' done' : ''}${partial ? ' partial' : ''}`;
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
  else if (t === 'primera_vez') state.answers.dobleCamiseta = { team: '', mode: '' };
  else if (t === 'final') state.answers.final = { team1: '', team2: '', score1: '0', score2: '0', champion: '' };
  else if (t === 'goleador') state.answers.goleador = { player: '', goals: '1' };
  saveState();
  renderCurrentStep();
}

function resetAll() {
  state.answers = {
    groups: {},
    champions: {},
    nonChamps: [{ team: '', stage: '' }, { team: '', stage: '' }, { team: '', stage: '' }],
    argentina: { grupo: '', rivales: {}, plantarse: null },
    dobleCamiseta: { team: '', mode: '' },
    final: { team1: '', team2: '', score1: '0', score2: '0', champion: '' },
    goleador: { player: '', goals: '1' }
  };
  state.tags = [];
  state.fantasyName = '';
  state.step = 0;
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  showScreen('landing');
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
  } else if (type === 'primera_vez') {
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
let stepScrollPos = 0;

function renderSelect(options, currentValue, field, placeholder) {
  const esc = v => escapeHtml(v);
  return `<select data-field="${esc(field)}">
    <option value="">${escapeHtml(placeholder || '— Elegí —')}</option>
    ${options.map(t => `<option value="${esc(t)}" ${currentValue === t ? 'selected' : ''}>${esc(t)}</option>`).join('')}
  </select>`;
}

function renderCurrentStep() {
  const scrollEl = stepBody.querySelector('.step-scroll');
  stepScrollPos = scrollEl ? scrollEl.scrollTop : 0;

  const step = STEPS[state.step];
  const total = STEPS.length;
  const comp = STEPS.filter((_, i) => isStepComplete(i)).length;

  stepCounter.textContent = `Paso ${state.step + 1} de 7 — ${STEP_NAMES[state.step]}`;
  progressFill.style.width = `${(comp / total) * 100}%`;
  renderStepDots();

  const type = step.type || 'groups';
  let header = `<h2 class="step-title">${step.title}</h2><p class="step-desc">${step.desc}</p>`;
  let body = '';

  if (type === 'groups') body = renderGroups();
  else if (type === 'champions') body = renderChampions();
  else if (type === 'non_champions') body = renderNonChampions();
  else if (type === 'argentina') body = renderArgentina();
  else if (type === 'primera_vez') body = renderDobleCamiseta();
  else if (type === 'final') body = renderFinal();
  else if (type === 'goleador') body = renderGoleador();

  stepBody.innerHTML = `
    <div class="step-scroll">
      ${header}${body}
      <div class="step-actions">
        <button class="btn btn--ghost btn--action" id="btn-clear">🗑️ Limpiar este paso</button>
        <button class="btn btn--ghost btn--action" id="btn-random">🎲 Aleatorio</button>
      </div>
      <div class="step-actions" style="margin-top:6px;">
        <button class="btn btn--ghost btn--action" id="btn-reset" style="color:var(--danger);border-color:var(--danger)!important;">🗑️ Eliminar todo y empezar de nuevo</button>
      </div>
    </div>`;

  requestAnimationFrame(() => {
    const newScroll = stepBody.querySelector('.step-scroll');
    if (newScroll) newScroll.scrollTop = stepScrollPos;
  });

  $('btn-clear').addEventListener('click', clearStep);
  $('btn-random').addEventListener('click', fillStepRandom);
  const resetBtn = $('btn-reset');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro? Se borrarán TODAS tus predicciones y se empezará de nuevo.')) resetAll();
  });

  btnBack.style.visibility = state.step === 0 ? 'hidden' : 'visible';
  updateNavButtons();
}

function updateNavButtons() {
  btnNext.textContent = state.step < STEPS.length - 1 ? 'Siguiente →' : 'Finalizar';
  btnNext.disabled = false;
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

/* --- CHAMPIONS --- */
const STAGE_PILLS = [
  { value: 'grupos',        label: 'Grupos'   },
  { value: 'dieciseisavos', label: '16avos'   },
  { value: 'octavos',       label: 'Octavos'  },
  { value: 'cuartos',       label: 'Cuartos'  },
  { value: 'tercero',       label: '3° y 4° Puesto'},
  { value: 'final',         label: 'Final'    },
];

function renderChampions() {
  const saved = state.answers.champions;
  let html = '<div class="champ-list">';
  CHAMPIONS.forEach(c => {
    const sel = saved[c] || '';
    html += `<div class="champ-row${sel ? ' done' : ''}">
      <span class="team-name">${c}</span>
      <div class="stage-pills">
        ${STAGE_PILLS.map(s => `<button class="stage-pill${sel === s.value ? ' active' : ''}" data-action="stage-pill" data-target="champions.${c}" data-value="${s.value}">${s.label}</button>`).join('')}
      </div>
    </div>`;
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
    if (s.team) {
      html += `<div class="champ-row${s.stage ? ' done' : ''}">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <span class="team-name">${s.team}</span>
          <button class="btn-change" data-action="nc-unset" data-idx="${i}">✎</button>
        </div>
        <div class="stage-pills">
          ${STAGE_PILLS.map(sg => `<button class="stage-pill${s.stage === sg.value ? ' active' : ''}" data-action="stage-pill" data-target="nonChamps.${i}.stage" data-value="${sg.value}">${sg.label}</button>`).join('')}
        </div>
      </div>`;
    } else {
      const selectedTeams = saved.filter((n, j) => j !== i && n.team).map(n => n.team);
      const available = nt.filter(t => !selectedTeams.includes(t));
      html += `<div class="champ-row">
        ${renderSelect(available, s.team, `nonChamps.${i}.team`, `Equipo #${i+1}`)}
      </div>`;
    }
  }
  return html + '</div>';
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
      const allPrevFilled = i === 0 || order.slice(0, i).every(p => a.rivales[p]);
      html += `<div class="arg-step${filled ? ' done' : ''}">
        <h4>${labels[s]}</h4>
        ${renderSelect(na, a.rivales[s] || '', `argentina.rivales.${s}`, 'Rival')}
        <button class="btn btn--ghost plant-btn" data-action="plantar" data-stage="${s}" ${allPrevFilled ? '' : 'disabled'}>🛑 Plantarme acá</button>
      </div>`;
    }
  });

  return html;
}

/* --- DOBLE CAMISETA --- */
function renderDobleCamiseta() {
  const dc = state.answers.dobleCamiseta;
  return `
    <div class="form-group">
      <label>Equipo debutante que llegará más lejos</label>
      <div class="choice-grid">
        ${DEBUTANTS.map(t => `<button class="choice-card${dc.team === t ? ' active' : ''}" data-action="dc-team" data-team="${t}">${t}</button>`).join('')}
      </div>
    </div>
    <div class="form-group">
      <label>¿Llegará solo o junto a otro debutante?</label>
      <div class="choice-grid choice-grid--2">
        <button class="choice-card choice-card--desc${dc.mode === 'solo' ? ' active' : ''}" data-action="dc-mode" data-mode="solo">
          <strong>Único</strong>
          <span>El único debutante en esa fase</span>
        </button>
        <button class="choice-card choice-card--desc${dc.mode === 'compartido' ? ' active' : ''}" data-action="dc-mode" data-mode="compartido">
          <strong>Compartido</strong>
          <span>Puede llegar como único debutante pero también compartiendo con otros</span>
        </button>
      </div>
    </div>`;
}

/* --- FINAL --- */
function renderFinal() {
  const f = state.answers.final;
  const both = f.team1 && f.team2 && f.team1 !== f.team2;
  const s1 = f.score1 !== '' ? parseInt(f.score1) : 0;
  const s2 = f.score2 !== '' ? parseInt(f.score2) : 0;
  return `
    <div class="finalists-row">
      <div class="form-group" style="margin:0;flex:1">
        <label>Finalista A</label>
        ${renderSelect(TEAMS, f.team1, 'final.team1')}
      </div>
      <div class="vs-badge">vs</div>
      <div class="form-group" style="margin:0;flex:1">
        <label>Finalista B</label>
        ${renderSelect(TEAMS, f.team2, 'final.team2')}
      </div>
    </div>

    <div class="score-row">
      <div class="score-label" style="grid-column:1/-1;margin-bottom:4px;">Resultado del partido (incluyendo el eventual alargue)</div>
      <div class="score-group">
        <div class="score-stepper">
          <button class="stepper-btn" data-action="score-step" data-field="score1" data-dir="dec">−</button>
          <span class="stepper-val">${s1}</span>
          <button class="stepper-btn" data-action="score-step" data-field="score1" data-dir="inc">+</button>
        </div>
      </div>
      <div class="score-divider">—</div>
      <div class="score-group">
        <div class="score-stepper">
          <button class="stepper-btn" data-action="score-step" data-field="score2" data-dir="dec">−</button>
          <span class="stepper-val">${s2}</span>
          <button class="stepper-btn" data-action="score-step" data-field="score2" data-dir="inc">+</button>
        </div>
      </div>
    </div>

    <div class="form-group" style="border-top:2px solid var(--border);padding-top:16px;margin-top:4px;">
      <label>Campeón</label>
      ${both
        ? `<div class="choice-grid choice-grid--2">
            <button class="choice-card${f.champion === '1' ? ' active' : ''}" data-action="set-champion" data-val="1">${f.team1}</button>
            <button class="choice-card${f.champion === '2' ? ' active' : ''}" data-action="set-champion" data-val="2">${f.team2}</button>
          </div>`
        : `<p class="help-text">Primero elegí dos finalistas distintos.</p>`}
    </div>`;
}

/* --- GOLEADOR --- */
function renderGoleador() {
  const g = state.answers.goleador;
  const goals = g.goals !== '' ? parseInt(g.goals) : 1;
  return `
    <div class="form-group">
      <label>Jugador</label>
      ${renderSelect(PLAYERS, g.player, 'goleador.player')}
      <p class="help-text" style="margin-top:6px;">"Otro" comparte puntos si hay empate de goleada.</p>
    </div>
    <div class="form-group">
      <label>Cantidad de goles</label>
      <div class="score-stepper" style="justify-content:flex-start;gap:16px;">
        <button class="stepper-btn" data-action="score-step" data-field="goals-player" data-dir="dec">−</button>
        <input type="number" class="stepper-val-input" data-field="goleador.goals" min="1" max="30" value="${goals}">
        <button class="stepper-btn" data-action="score-step" data-field="goals-player" data-dir="inc">+</button>
      </div>
    </div>`;
}

/* ---------- TAGS / TORNEOS ---------- */
function doAddTag(name) {
  state.tags.push(name); renderTagsDOM(); validateFinal(); updateSubmitButton();
  hideSuggestions(); saveState();
}

function addTag() {
  const inp = $('ff-tag-input');
  const v = inp.value.trim().replace(/^#/, '');
  if (!v || state.tags.includes(v) || state.tags.length >= 5) return;
  inp.value = '';

  const existing = allTournaments.find(t => t.name === v);
  if (existing) {
    if (existing.visibility === 'public') {
      doAddTag(v);
    } else {
      showPrivateTagCodePrompt(v);
    }
  } else {
    showNewTagPicker(v);
  }
}

function renderTagsDOM() {
  const c = $('ff-tags-container');
  if (!c) return;
  c.innerHTML = state.tags.length === 0 ? '' : state.tags.map(t => {
    const isPrivate = state.tournamentMeta[t]?.visibility === 'private';
    const icon = isPrivate ? '🔒 ' : '';
    return `<span class="tag">${icon}${escapeHtml(t)} <span class="tag-remove" data-tag="${escapeHtml(t)}">×</span></span>`;
  }).join('');
}

function removeTag(name) {
  state.tags = state.tags.filter(t => t !== name); renderTagsDOM(); validateFinal(); updateSubmitButton();
  saveState();
}

/* --- Create tournament modal --- */
function showNewTagPicker(name) {
  const body = $('create-tournament-body');
  body.innerHTML = `
    <p style="margin-bottom:14px;">Elegí cómo querés crear el torneo <strong>${escapeHtml(name)}</strong>:</p>
    <div class="vis-toggle">
      <button class="vis-opt active" data-vis="public">🌐 Público</button>
      <button class="vis-opt" data-vis="private">🔒 Privado</button>
    </div>
    <div id="modal-code-wrap" style="display:none;margin-top:10px;">
      <label style="display:block;font-size:0.85rem;font-weight:600;margin-bottom:4px;">Código de invitación</label>
      <input type="text" id="modal-invite-code" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="Ej: 1234" style="width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;font-size:1rem;text-align:center;letter-spacing:3px;">
    </div>
    <button class="btn btn--primary" style="width:100%;margin-top:14px;" id="modal-confirm-tag">Crear torneo</button>`;
  $('create-tournament-modal').classList.add('visible');

  // Toggle público/privado
  body.querySelectorAll('.vis-opt').forEach(b => {
    b.addEventListener('click', () => {
      body.querySelectorAll('.vis-opt').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      $('modal-code-wrap').style.display = b.dataset.vis === 'private' ? 'block' : 'none';
    });
  });

  // Confirm
  $('modal-confirm-tag').addEventListener('click', () => {
    const vis = body.querySelector('.vis-opt.active').dataset.vis;
    let code = '';
    if (vis === 'private') {
      code = $('modal-invite-code').value.trim();
      if (!code || code.length < 3) { showToast('El código debe tener al menos 3 dígitos.'); return; }
    }
    state.tournamentMeta[name] = { visibility: vis, inviteCode: code };
    hideCreateModal();
    doAddTag(name);
  });
}

function hideCreateModal() {
  $('create-tournament-modal').classList.remove('visible');
}

/* --- Private tag code prompt (join existing) --- */
function showPrivateTagCodePrompt(name) {
  const body = $('private-code-body');
  body.innerHTML = `
    <p style="margin-bottom:12px;">El torneo <strong>${escapeHtml(name)}</strong> es privado. Ingresá el código de invitación:</p>
    <input type="text" id="priv-code-input" inputmode="numeric" pattern="[0-9]*" maxlength="6" placeholder="Código numérico" style="display:block;width:100%;padding:10px;border:1px solid var(--border);border-radius:8px;margin-bottom:8px;">
    <div id="priv-code-error" style="color:var(--danger);font-size:0.85rem;margin-bottom:8px;display:none;">Código incorrecto</div>
    <div style="display:flex;gap:8px;">
      <button class="btn btn--primary" style="flex:1;" id="priv-code-confirm">Ingresar</button>
      <button class="btn btn--primary" style="flex:1;" onclick="hidePrivateModal()">Cancelar</button>
    </div>`;
  $('private-code-modal').classList.add('visible');

  $('priv-code-confirm').addEventListener('click', async () => {
    const code = $('priv-code-input').value.trim();
    if (!code) return;
    const ok = await supabase.verifyInviteCode(name, code);
    if (ok) {
      state.tournamentMeta[name] = { visibility: 'private', inviteCode: code };
      hidePrivateModal();
      doAddTag(name);
    } else {
      $('priv-code-error').style.display = 'block';
    }
  });
}

function hidePrivateModal() {
  $('private-code-modal').classList.remove('visible');
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

  html += '<div class="summary-block"><h4>El resto del mundo</h4>';
  state.answers.nonChamps.forEach(n => {
    if (n.team && n.stage) {
      const label = STAGES.find(s => s.value === n.stage)?.label || n.stage;
      html += `<span class="summary-item">${escapeHtml(n.team)} → ${label}</span>`;
    }
  });
  html += '</div>';

  html += '<div class="summary-block"><h4>Camino de Argentina</h4>';
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
    html += '<div class="summary-block"><h4>La primera vez</h4>';
    html += `<span class="summary-item">${escapeHtml(state.answers.dobleCamiseta.team)} — ${state.answers.dobleCamiseta.mode === 'solo' ? 'Único debutante' : 'Compartido'}</span></div>`;
  }

  const f = state.answers.final;
  if (f.team1 && f.team2) {
    html += '<div class="summary-block"><h4>Final y campeón</h4>';
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
let tagAutocompleteTimer = null;

function renderFinalScreen() {
  const body = $('final-body');

  body.innerHTML = `<h2>Revisá y confirmá</h2>
    <div class="final-section">
      <details class="summary-details">
        <summary>📋 Ver todas tus predicciones</summary>
        ${renderSummary()}
      </details>
    </div>
    <div class="final-section"><h3>🏷️ Nombre de fantasía</h3>
      <input type="text" id="ff-name" placeholder="Ej: ${PLACEHOLDER_NAMES[Math.floor(Math.random() * PLACEHOLDER_NAMES.length)]}" maxlength="30" value="${escapeHtml(state.fantasyName)}">
      <div id="ff-name-status" class="help-text">Debe ser único. Se valida al enviar.</div></div>
    <div class="final-section"><h3>🏆 Torneos (máx. 5)</h3>
      <p class="help-text">Los torneos te permiten agruparte con amigos. Escribí y elegí uno existente o creá uno nuevo.</p>
      <div id="ff-tag-wrapper" class="tag-input-wrapper" style="position:relative;">
        <input type="text" id="ff-tag-input" placeholder="Ej: argentina" maxlength="20" autocomplete="off">
        <button class="btn btn--primary" id="ff-tag-add">+</button>
        <div id="ff-tag-suggestions" class="tag-suggestions"></div>
      </div>
      <div id="ff-tags-container" class="tags-container"></div></div>`;

  renderTagsDOM();
  const nameInput = $('ff-name');
  const tagInput = $('ff-tag-input');
  const tagAdd = $('ff-tag-add');
  const suggestions = $('ff-tag-suggestions');

  let nameCheckTimer = null;
  nameInput.addEventListener('input', () => {
    state.fantasyName = nameInput.value.trim();
    nameAvailable = null;
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
        nameAvailable = !exists;
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
  // Load existing tournaments for autocomplete
  supabase.getTournaments().then(tournaments => { allTournaments = tournaments; });

  // Autocomplete on input
  tagInput.addEventListener('input', () => {
    clearTimeout(tagAutocompleteTimer);
    tagAutocompleteTimer = setTimeout(() => showTagSuggestions(tagInput.value.trim()), 200);
  });

  tagInput.addEventListener('blur', () => setTimeout(hideSuggestions, 200));
  tagInput.addEventListener('focus', () => {
    if (tagInput.value.trim()) showTagSuggestions(tagInput.value.trim());
  });

  if (state.fantasyName.length >= 3) {
    nameInput.dispatchEvent(new Event('input'));
  }

  validateFinal();
  updateSubmitButton();
}

function showTagSuggestions(query) {
  const wrap = $('ff-tag-suggestions');
  if (!wrap || !query) { wrap.innerHTML = ''; wrap.classList.remove('visible'); return; }

  const lower = query.toLowerCase();
  const matches = allTournaments.filter(t => t.name.toLowerCase().includes(lower)).slice(0, 8);
  const exactMatch = matches.some(t => t.name.toLowerCase() === lower);
  const alreadyAdded = state.tags.includes(query);
  let html = '';

  matches.forEach(t => {
    const idx = t.name.toLowerCase().indexOf(lower);
    const before = escapeHtml(t.name.slice(0, idx));
    const match = escapeHtml(t.name.slice(idx, idx + query.length));
    const after = escapeHtml(t.name.slice(idx + query.length));
    const lock = t.visibility === 'private' ? '🔒 ' : '';
    html += `<div class="tag-suggestion" data-tag="${escapeHtml(t.name)}">${lock}${before}<strong>${match}</strong>${after}</div>`;
  });

  if (!exactMatch && !alreadyAdded) {
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
function validateFinal() { return state.fantasyName.length >= 3 && nameAvailable !== false; }
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

  if (field === 'goleador.goals') {
    const v = parseInt(target.value);
    if (isNaN(v) || v < 1) { obj[parts[parts.length - 1]] = '1'; target.value = '1'; }
    else if (v > 30) { obj[parts[parts.length - 1]] = '30'; target.value = '30'; }
    else { obj[parts[parts.length - 1]] = String(v); target.value = String(v); }
  }

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
  updateNavButtons();
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

  if (act === 'stage-pill') {
    const parts = target.dataset.target.split('.');
    let obj = state.answers;
    for (let i = 0; i < parts.length - 1; i++) obj = isNaN(parts[i]) ? obj[parts[i]] : obj[parseInt(parts[i])];
    const key = parts[parts.length - 1];
    obj[key] = obj[key] === target.dataset.value ? '' : target.dataset.value;
    renderCurrentStep();
  }

  if (act === 'score-step') {
    const field = target.dataset.field;
    const dir = target.dataset.dir;
    if (field === 'goals-player') {
      const cur = parseInt(state.answers.goleador.goals || 1);
      state.answers.goleador.goals = String(Math.max(1, Math.min(30, cur + (dir === 'inc' ? 1 : -1))));
    } else {
      const cur = parseInt(state.answers.final[field] || 0);
      state.answers.final[field] = String(Math.max(0, Math.min(15, cur + (dir === 'inc' ? 1 : -1))));
    }
    renderCurrentStep();
  }

  if (act === 'dc-team') {
    const team = target.dataset.team;
    state.answers.dobleCamiseta.team = state.answers.dobleCamiseta.team === team ? '' : team;
    renderCurrentStep();
  }

  if (act === 'dc-mode') {
    const mode = target.dataset.mode;
    state.answers.dobleCamiseta.mode = state.answers.dobleCamiseta.mode === mode ? '' : mode;
    renderCurrentStep();
  }

  if (act === 'set-champion') {
    const val = target.dataset.val;
    state.answers.final.champion = state.answers.final.champion === val ? '' : val;
    renderCurrentStep();
  }
}

function missingSteps() {
  const details = [];
  STEPS.forEach((step, i) => {
    if (isStepComplete(i)) return;
    const t = step.type || 'groups';
    if (t === 'groups') {
      const miss = ['A','B','C','D','E','F','G','H','I','J','K','L'].filter(g => {
        const s = state.answers.groups[g];
        return !s || !s.first || !s.second || s.first === s.second;
      });
      details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta ${miss.join(', ')}`);
    } else if (t === 'champions') {
      const miss = CHAMPIONS.filter(c => !state.answers.champions[c]);
      details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta ${miss.join(', ')}`);
    } else if (t === 'non_champions') {
      const n = state.answers.nonChamps.filter(n => !n.team || !n.stage).length;
      details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: faltan ${n} equipo(s)`);
    } else if (t === 'argentina') {
      const a = state.answers.argentina;
      if (!a.grupo) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta posición en el grupo`);
      else if (parseInt(a.grupo) < 3 && !a.plantarse) {
        const miss = ['dieciseisavos','octavos','cuartos','semis','final'].filter(s => !a.rivales?.[s]);
        if (miss.length) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta rival en ${miss.join(', ')}`);
      }
    } else if (t === 'primera_vez') {
      if (!state.answers.dobleCamiseta.team) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta elegir debutante`);
      else if (!state.answers.dobleCamiseta.mode) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta elegir único o compartido`);
    } else if (t === 'final') {
      const f = state.answers.final;
      if (!f.team1) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta Finalista A`);
      else if (!f.team2) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta Finalista B`);
      else if (f.team1 === f.team2) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: los finalistas deben ser distintos`);
      else if (f.score1 === '' || f.score2 === '') details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta resultado`);
      else if (!f.champion) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta elegir campeón`);
    } else if (t === 'goleador') {
      if (!state.answers.goleador.player) details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta elegir jugador`);
      else if (state.answers.goleador.goals === '') details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>: falta cantidad de goles`);
    } else {
      details.push(`<strong>Paso ${i+1} de ${STEPS.length} — ${escapeHtml(step.title)}</strong>`);
    }
  });
  return details;
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
    showValidationModal();
    return;
  }
  showScreen('final');
  renderFinalScreen();
}

function showValidationModal() {
  const miss = missingSteps();
  const body = $('validation-body');
  body.innerHTML = miss.map(m => `<li>⚠️ ${m}</li>`).join('');
  $('validation-modal').classList.add('visible');
}

function hideValidationModal() {
  $('validation-modal').classList.remove('visible');
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
    await supabase.submit({ fantasyName: state.fantasyName, tags: state.tags, answers: state.answers, tournamentMeta: state.tournamentMeta });
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    showScreen('done');
    $('done-name').textContent = `Registrado como "${state.fantasyName}".`;
    renderDoneScreen();
  } catch (err) {
    if (err.message === 'duplicate_name') {
      showToast('❌ Ese nombre ya fue tomado. Elegí otro.');
    } else {
      showToast(`❌ Error al guardar: ${err.message}`);
      console.error(err);
      supabase.logError(`Submit failed: ${state.fantasyName}`, { error: err.message, tags: state.tags });
    }
    btn.disabled = false; btn.classList.remove('btn--loading');
  }
}

/* ---------- DONE SCREEN / SHARE ---------- */
function teamStr(name) {
  return `${TEAM_FLAGS[name] || '🏳'} ${name}`;
}

function buildShareMsg(long) {
  const f = state.answers.final;
  const champion = f.champion === '1' ? f.team1 : f.team2;
  let msg = `¡Completé mis predicciones del #Mundial2026! 🏆\n\nFinal: ${teamStr(f.team1)} vs ${teamStr(f.team2)}\nCampeón: ${teamStr(champion)}`;
  if (long) {
    msg += '\n\nEx campeones:\n';
    CHAMPIONS.forEach(c => {
      const stage = state.answers.champions[c];
      const label = c === champion ? '🥇 Campeón' : (SHARE_STAGE_LABELS[stage] || stage || '?');
      msg += `${teamStr(c)} → ${label}\n`;
    });
    const nc = state.answers.nonChamps.filter(n => n.team);
    if (nc.length) {
      msg += '\nSorpresas:\n';
      nc.forEach(n => { msg += `${teamStr(n.team)} → ${SHARE_STAGE_LABELS[n.stage] || n.stage || '?'}\n`; });
    }
  }
  msg += `\n\n👉 ${GAME_URL}`;
  return msg;
}

function updateDoneMsg() {
  const preview = $('done-msg-preview');
  if (!preview) return;
  const isLong = document.querySelector('.done-toggle-btn.active')?.dataset.mode === 'long';
  preview.value = buildShareMsg(isLong);
}

function renderDoneScreen() {
  const share = $('done-share');
  if (!share) return;
  share.innerHTML = `
    <div class="done-share-section">
      <p class="help-text" style="text-align:center;margin:16px 0 10px;">Compartí tus predicciones</p>
      <div class="done-toggle">
        <button class="done-toggle-btn active" data-mode="short">Final + campeón</button>
        <button class="done-toggle-btn" data-mode="long">+ campeones históricos</button>
      </div>
      <textarea id="done-msg-preview" class="done-msg-preview" readonly></textarea>
      <div class="done-share-btns">
        <button class="btn btn--ghost" id="btn-share-wa">📱 WhatsApp</button>
        <button class="btn btn--ghost" id="btn-share-tw">𝕏 Twitter</button>
        <button class="btn btn--ghost" id="btn-copy-msg">📋 Copiar</button>
      </div>
    </div>`;
  updateDoneMsg();
  share.querySelectorAll('.done-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      share.querySelectorAll('.done-toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      updateDoneMsg();
    });
  });
  $('btn-share-wa').addEventListener('click', () => {
    window.open(`https://wa.me/?text=${encodeURIComponent($('done-msg-preview').value)}`, '_blank');
  });
  $('btn-share-tw').addEventListener('click', () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent($('done-msg-preview').value)}`, '_blank');
  });
  $('btn-copy-msg').addEventListener('click', () => {
    navigator.clipboard.writeText($('done-msg-preview').value).then(() => showToast('✅ Copiado al portapapeles'));
  });
}

/* ---------- EVENT DELEGATION ---------- */
document.addEventListener('change', e => { if (e.target.matches('[data-field]')) handleFieldChange(e.target); });

document.addEventListener('click', e => {
  const t = e.target;
  if (t.classList.contains('step-dot') && t.dataset.step !== undefined) goToStep(parseInt(t.dataset.step));
  const actionEl = t.dataset.action ? t : t.closest('[data-action]');
  if (actionEl) {
    if (actionEl.dataset.action === 'group-pick') handleGroupPick(actionEl);
    else handleAction(actionEl);
  }
  if (t.classList.contains('nav-brand') && typeof showAdminScreen === 'function') {
    t.dataset.clicks = (parseInt(t.dataset.clicks) || 0) + 1;
    if (parseInt(t.dataset.clicks) >= 5) { t.dataset.clicks = '0'; showAdminScreen(); }
    return;
  }
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
