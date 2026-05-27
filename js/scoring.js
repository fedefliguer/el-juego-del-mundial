// ============================================
// El Juego del Mundial 2026 — Sistema de Puntajes
// ============================================
// EDITÁ este archivo para cambiar los puntos.
//
// Uso: scoring.calcular(answers, results)
// donde answers y results son objetos JSON con
// la misma estructura.

const PUNTOS = {
  // ----- FASE DE GRUPOS -----
  grupo_acierto_orden: 150,   // Acertó 1° y 2° en orden exacto
  grupo_acierto_desorden: 50, // Acertó los dos pero al revés (o alguno tercero)
  grupo_parcial: 0,           // Solo acertó 1 o ninguno

  // ----- CAMPEONES -----
  campeon_fase_grupos: 500,  // Acertó que se va en grupos
  campeon_otra_fase: 300,    // Acertó otra fase

  // ----- NO CAMPEONES (3 equipos) -----
  no_campeon_grupos: 100,
  no_campeon_dieciseisavos: 150,
  no_campeon_octavos: 300,
  no_campeon_cuartos: 400,
  no_campeon_tercero: 400,
  no_campeon_semis: 500,
  no_campeon_final: 500,

  // ----- CAMINO DE ARGENTINA -----
  argentina_por_acierto: 300, // Por cada rival acertado (solo si toda la cadena anterior es correcta)

  // ----- DOBLE CAMISETA -----
  doble_solo: 1000,
  doble_compartido: 400,

  // ----- FINAL -----
  final_equipo_finalista: 500,   // Por equipo que acertó que juega la final
  final_campeon: 2500,          // Acertó al campeón
  final_resultado: 300,         // Acertó el resultado exacto

  // ----- GOLEADOR -----
  goleador_jugador: 400,        // Acertó al jugador
  goleador_cantidad: 100,       // Acertó la cantidad de goles
  goleador_ambos: 1000,         // Acertó jugador + cantidad
};

// Devuelve el puntaje para una fase de no-campeón
function puntosNoCampeon(fase) {
  const mapa = {
    grupos: PUNTOS.no_campeon_grupos,
    'dieciseisavos': PUNTOS.no_campeon_dieciseisavos,
    'octavos': PUNTOS.no_campeon_octavos,
    cuartos: PUNTOS.no_campeon_cuartos,
    tercero: PUNTOS.no_campeon_tercero,
    semis: PUNTOS.no_campeon_semis, // no expuesto en UI (3° y 4° reemplaza), pero admin puede cargarlo
    final: PUNTOS.no_campeon_final,
  };
  return mapa[fase] || 0;
}

// Devuelve el puntaje para una fase de campeón
function puntosCampeon(fase) {
  if (fase === 'grupos') return PUNTOS.campeon_fase_grupos;
  return PUNTOS.campeon_otra_fase;
}

// ---------- CÁLCULO COMPLETO DE PUNTAJE ----------
function computeScore(answers, realResults) {
  let total = 0;
  const breakdown = { grupos:0, champions:0, nonChamps:0, argentina:0, dobleCamiseta:0, final:0, goleador:0 };
  const r = realResults;

  // Grupos
  for (const g of Object.keys(r.groups || {})) {
    const pred = answers.groups?.[g];
    const real = r.groups[g];
    if (!pred || !real) continue;
    const p1 = pred.first, p2 = pred.second;
    const r1 = real.first, r2 = real.second;
    if (p1 === r1 && p2 === r2) {
      breakdown.grupos += PUNTOS.grupo_acierto_orden;
      total += PUNTOS.grupo_acierto_orden;
    } else if ((p1 === r1 || p1 === r2) && (p2 === r1 || p2 === r2) && p1 !== p2) {
      breakdown.grupos += PUNTOS.grupo_acierto_desorden;
      total += PUNTOS.grupo_acierto_desorden;
    }
  }

  // Campeones
  for (const c of Object.keys(r.champions || {})) {
    const pred = answers.champions?.[c];
    const real = r.champions[c];
    if (!pred || !real) continue;
    const pts = pred === real ? (pred === 'grupos' ? PUNTOS.campeon_fase_grupos : PUNTOS.campeon_otra_fase) : 0;
    breakdown.champions += pts;
    total += pts;
  }

  // No campeones
  for (const nc of (r.nonChamps || [])) {
    const match = (answers.nonChamps || []).find(n => n.team === nc.team);
    if (match && match.stage === nc.stage) {
      const pts = puntosNoCampeon(nc.stage);
      breakdown.nonChamps += pts;
      total += pts;
    }
  }

  // Argentina
  if (r.argentina && answers.argentina) {
    const real = r.argentina;
    const pred = answers.argentina;
    let pts = 0;
    const stages = ['dieciseisavos','octavos','cuartos','semis','final'];

    if (pred.grupo && pred.grupo === real.grupo) {
      pts += PUNTOS.argentina_por_acierto;
    }

    if (pts > 0) {
      for (const s of stages) {
        const realHasRival = !!real.rivales?.[s];
        const predHasRival = !!pred.rivales?.[s];
        const predPlantHere = pred.plantarse === s;

        if (realHasRival) {
          if (predPlantHere) {
            break;
          } else if (predHasRival && pred.rivales[s] === real.rivales[s]) {
            pts += PUNTOS.argentina_por_acierto;
          } else if (predHasRival && pred.rivales[s] !== real.rivales[s]) {
            break;
          } else {
            break;
          }
        } else {
          if (predPlantHere) {
            break;
          } else if (predHasRival) {
            pts = 0;
            break;
          } else {
            break;
          }
        }
      }
    }

    breakdown.argentina += pts;
    total += pts;
  }

  // Doble Camiseta
  if (r.dobleCamiseta && answers.dobleCamiseta?.team) {
    if (answers.dobleCamiseta.team === r.dobleCamiseta.team && answers.dobleCamiseta.mode === r.dobleCamiseta.mode) {
      const pts = answers.dobleCamiseta.mode === 'solo' ? PUNTOS.doble_solo : PUNTOS.doble_compartido;
      breakdown.dobleCamiseta += pts;
      total += pts;
    }
  }

  // Final
  if (r.final && answers.final?.team1 && answers.final?.team2) {
    const af = answers.final, rf = r.final;
    const teamsOk = (af.team1 === rf.team1 && af.team2 === rf.team2) || (af.team1 === rf.team2 && af.team2 === rf.team1);
    if (teamsOk) {
      breakdown.final += PUNTOS.final_equipo_finalista;
      total += PUNTOS.final_equipo_finalista;
    }
    const champTeam = af.champion === '1' ? af.team1 : af.team2;
    const realChampTeam = rf.champion === '1' ? rf.team1 : rf.team2;
    if (champTeam === realChampTeam) {
      breakdown.final += PUNTOS.final_campeon;
      total += PUNTOS.final_campeon;
    }
    if (teamsOk && String(af.score1) === String(rf.score1) && String(af.score2) === String(rf.score2)) {
      breakdown.final += PUNTOS.final_resultado;
      total += PUNTOS.final_resultado;
    }
  }

  // Goleador
  if (r.goleador && answers.goleador?.player) {
    const ag = answers.goleador;
    if (ag.player === r.goleador.player && String(ag.goals) === String(r.goleador.goals)) {
      breakdown.goleador += PUNTOS.goleador_ambos;
      total += PUNTOS.goleador_ambos;
    } else if (ag.player === r.goleador.player) {
      breakdown.goleador += PUNTOS.goleador_jugador;
      total += PUNTOS.goleador_jugador;
    } else if (String(ag.goals) === String(r.goleador.goals)) {
      breakdown.goleador += PUNTOS.goleador_cantidad;
      total += PUNTOS.goleador_cantidad;
    }
  }

  return { total, breakdown };
}

if (typeof module !== 'undefined') module.exports = { computeScore, PUNTOS, puntosNoCampeon, puntosCampeon };
