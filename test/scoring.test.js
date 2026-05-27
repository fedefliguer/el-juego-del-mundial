const { computeScore, PUNTOS } = require('../js/scoring.js');

// ============================================
// Helper para crear results/answers parciales
// ============================================

function mockResults(overrides = {}) {
  return {
    groups: { A: { first: 'México', second: 'Sudáfrica' } },
    champions: { Argentina: 'final', Brasil: 'cuartos' },
    nonChamps: [
      { team: 'Países Bajos', stage: 'semis' },
      { team: 'Portugal', stage: 'cuartos' },
    ],
    argentina: {
      grupo: '1',
      rivales: { dieciseisavos: 'Senegal', octavos: 'Uruguay', cuartos: 'Países Bajos', semis: 'Inglaterra', final: 'Francia' },
      plantarse: null,
    },
    dobleCamiseta: { team: 'Curazao', mode: 'solo' },
    final: { team1: 'Argentina', team2: 'Inglaterra', score1: '3', score2: '1', champion: '1' },
    goleador: { player: 'Lionel Messi (Argentina)', goals: '8' },
    ...overrides,
  };
}

function mockAnswers(overrides = {}) {
  return {
    groups: { A: { first: 'México', second: 'Sudáfrica' } },
    champions: { Argentina: 'final', Brasil: 'cuartos' },
    nonChamps: [
      { team: 'Países Bajos', stage: 'semis' },
      { team: 'Portugal', stage: 'cuartos' },
    ],
    argentina: {
      grupo: '1',
      rivales: { dieciseisavos: 'Senegal', octavos: 'Uruguay', cuartos: 'Países Bajos', semis: 'Inglaterra', final: 'Francia' },
      plantarse: null,
    },
    dobleCamiseta: { team: 'Curazao', mode: 'solo' },
    final: { team1: 'Argentina', team2: 'Inglaterra', score1: '3', score2: '1', champion: '1' },
    goleador: { player: 'Lionel Messi (Argentina)', goals: '8' },
    ...overrides,
  };
}

describe('Fase de Grupos', () => {

  test('acierto exacto (1° y 2° en orden)', () => {
    const s = computeScore(
      { groups: { A: { first: 'México', second: 'Sudáfrica' } } },
      { groups: { A: { first: 'México', second: 'Sudáfrica' } } }
    );
    expect(s.breakdown.grupos).toBe(PUNTOS.grupo_acierto_orden);
    expect(s.total).toBe(PUNTOS.grupo_acierto_orden);
  });

  test('acierto invertido (1° y 2° al revés)', () => {
    const s = computeScore(
      { groups: { A: { first: 'Sudáfrica', second: 'México' } } },
      { groups: { A: { first: 'México', second: 'Sudáfrica' } } }
    );
    expect(s.breakdown.grupos).toBe(PUNTOS.grupo_acierto_desorden);
  });

  test('un solo acierto = 0 puntos', () => {
    const s = computeScore(
      { groups: { A: { first: 'México', second: 'Canadá' } } },
      { groups: { A: { first: 'México', second: 'Sudáfrica' } } }
    );
    expect(s.breakdown.grupos).toBe(0);
  });

  test('ningún acierto', () => {
    const s = computeScore(
      { groups: { A: { first: 'Canadá', second: 'Suiza' } } },
      { groups: { A: { first: 'México', second: 'Sudáfrica' } } }
    );
    expect(s.breakdown.grupos).toBe(0);
  });

  test('grupo sin predicción = 0', () => {
    const s = computeScore(
      { groups: {} },
      { groups: { A: { first: 'México', second: 'Sudáfrica' } } }
    );
    expect(s.breakdown.grupos).toBe(0);
  });

  test('múltiples grupos suman', () => {
    const r = {
      groups: {
        A: { first: 'México', second: 'Sudáfrica' },
        B: { first: 'Suiza', second: 'Canadá' },
      }
    };
    const a = {
      groups: {
        A: { first: 'México', second: 'Sudáfrica' },
        B: { first: 'Canadá', second: 'Suiza' },
      }
    };
    const s = computeScore(a, r);
    expect(s.breakdown.grupos).toBe(PUNTOS.grupo_acierto_orden + PUNTOS.grupo_acierto_desorden);
  });

  test('mismo equipo en ambas posiciones no suma', () => {
    const s = computeScore(
      { groups: { A: { first: 'México', second: 'México' } } },
      { groups: { A: { first: 'México', second: 'Sudáfrica' } } }
    );
    expect(s.breakdown.grupos).toBe(0);
  });
});

describe('Campeones', () => {

  test('acierto en fase de grupos = 500', () => {
    const s = computeScore(
      { champions: { Argentina: 'grupos' } },
      { champions: { Argentina: 'grupos' } }
    );
    expect(s.breakdown.champions).toBe(PUNTOS.campeon_fase_grupos);
  });

  test('acierto en otra fase = 300', () => {
    const s = computeScore(
      { champions: { Argentina: 'final' } },
      { champions: { Argentina: 'final' } }
    );
    expect(s.breakdown.champions).toBe(PUNTOS.campeon_otra_fase);
  });

  test('fase incorrecta = 0', () => {
    const s = computeScore(
      { champions: { Argentina: 'grupos' } },
      { champions: { Argentina: 'final' } }
    );
    expect(s.breakdown.champions).toBe(0);
  });

  test('múltiples campeones suman', () => {
    const s = computeScore(
      { champions: { Argentina: 'final', Brasil: 'cuartos' } },
      { champions: { Argentina: 'final', Brasil: 'cuartos' } }
    );
    expect(s.breakdown.champions).toBe(2 * PUNTOS.campeon_otra_fase);
  });
});

describe('No campeones', () => {

  const R = { nonChamps: [{ team: 'Países Bajos', stage: 'semis' }, { team: 'Portugal', stage: 'cuartos' }] };

  test('acierto completo suma puntos por fase', () => {
    const s = computeScore(
      { nonChamps: [{ team: 'Países Bajos', stage: 'semis' }] },
      R
    );
    expect(s.breakdown.nonChamps).toBe(PUNTOS.no_campeon_semis);
  });

  test('múltiples aciertos suman', () => {
    const s = computeScore(
      { nonChamps: [{ team: 'Países Bajos', stage: 'semis' }, { team: 'Portugal', stage: 'cuartos' }] },
      R
    );
    expect(s.breakdown.nonChamps).toBe(PUNTOS.no_campeon_semis + PUNTOS.no_campeon_cuartos);
  });

  test('equipo correcto pero fase incorrecta = 0', () => {
    const s = computeScore(
      { nonChamps: [{ team: 'Países Bajos', stage: 'grupos' }] },
      R
    );
    expect(s.breakdown.nonChamps).toBe(0);
  });

  test('equipo incorrecto = 0', () => {
    const s = computeScore(
      { nonChamps: [{ team: 'Bélgica', stage: 'semis' }] },
      R
    );
    expect(s.breakdown.nonChamps).toBe(0);
  });
});

describe('Camino de Argentina', () => {

  const R = {
    argentina: {
      grupo: '1',
      rivales: { dieciseisavos: 'Senegal', octavos: 'Uruguay', cuartos: 'Países Bajos', semis: 'Inglaterra', final: 'Francia' },
      plantarse: null,
    }
  };

  test('cadena completa = 6 × 300 (grupo + 5 rivales)', () => {
    const a = {
      argentina: {
        grupo: '1',
        rivales: { dieciseisavos: 'Senegal', octavos: 'Uruguay', cuartos: 'Países Bajos', semis: 'Inglaterra', final: 'Francia' },
        plantarse: null,
      }
    };
    const s = computeScore(a, R);
    expect(s.breakdown.argentina).toBe(6 * PUNTOS.argentina_por_acierto);
  });

  test('cadena se corta al primer error', () => {
    const a = {
      argentina: {
        grupo: '1',
        rivales: { dieciseisavos: 'Senegal', octavos: 'Brasil', cuartos: 'Países Bajos', semis: 'Inglaterra', final: 'Francia' },
        plantarse: null,
      }
    };
    const s = computeScore(a, R);
    expect(s.breakdown.argentina).toBe(2 * PUNTOS.argentina_por_acierto); // grupo + primer rival
  });

  test('solo grupo acertado (sin rivales ni plantarse) = 300', () => {
    const s = computeScore(
      { argentina: { grupo: '1', rivales: {}, plantarse: null } },
      R
    );
    expect(s.breakdown.argentina).toBe(PUNTOS.argentina_por_acierto);
  });

  test('Argentina sale 4to y se pronosticó 4to = 300', () => {
    const r = { argentina: { grupo: '4', rivales: {}, plantarse: null } };
    const s = computeScore(
      { argentina: { grupo: '4', rivales: {}, plantarse: null } },
      r
    );
    expect(s.breakdown.argentina).toBe(PUNTOS.argentina_por_acierto);
  });

  test('Argentina sale 3ro y se pronosticó 3ro = 300', () => {
    const r = { argentina: { grupo: '3', rivales: {}, plantarse: null } };
    const s = computeScore(
      { argentina: { grupo: '3', rivales: {}, plantarse: null } },
      r
    );
    expect(s.breakdown.argentina).toBe(PUNTOS.argentina_por_acierto);
  });

  test('Argentina sale 4to pero se pronosticó 3ro = 0', () => {
    const r = { argentina: { grupo: '4', rivales: {}, plantarse: null } };
    const s = computeScore(
      { argentina: { grupo: '3', rivales: {}, plantarse: null } },
      r
    );
    expect(s.breakdown.argentina).toBe(0);
  });

  test('Argentina sale 4to pero se pronosticó 1ro (con rivales) = 0', () => {
    const r = { argentina: { grupo: '4', rivales: {}, plantarse: null } };
    const s = computeScore(
      { argentina: { grupo: '1', rivales: { dieciseisavos: 'Senegal' }, plantarse: null } },
      r
    );
    expect(s.breakdown.argentina).toBe(0);
  });
});

describe('Doble camiseta', () => {

  test('solo = 1000', () => {
    const r = { dobleCamiseta: { team: 'Curazao', mode: 'solo' } };
    const a = { dobleCamiseta: { team: 'Curazao', mode: 'solo' } };
    const s = computeScore(a, r);
    expect(s.breakdown.dobleCamiseta).toBe(PUNTOS.doble_solo);
  });

  test('compartido = 400', () => {
    const r = { dobleCamiseta: { team: 'Curazao', mode: 'compartido' } };
    const a = { dobleCamiseta: { team: 'Curazao', mode: 'compartido' } };
    const s = computeScore(a, r);
    expect(s.breakdown.dobleCamiseta).toBe(PUNTOS.doble_compartido);
  });

  test('equipo correcto pero modo incorrecto = 0', () => {
    const r = { dobleCamiseta: { team: 'Curazao', mode: 'solo' } };
    const a = { dobleCamiseta: { team: 'Curazao', mode: 'compartido' } };
    const s = computeScore(a, r);
    expect(s.breakdown.dobleCamiseta).toBe(0);
  });

  test('equipo incorrecto = 0', () => {
    const r = { dobleCamiseta: { team: 'Curazao', mode: 'solo' } };
    const a = { dobleCamiseta: { team: 'Uzbekistán', mode: 'solo' } };
    const s = computeScore(a, r);
    expect(s.breakdown.dobleCamiseta).toBe(0);
  });
});

describe('Final', () => {

  const R = { final: { team1: 'Argentina', team2: 'Inglaterra', score1: '3', score2: '1', champion: '1' } };

  test('todo acertado = 500 + 2500 + 300', () => {
    const a = { final: { team1: 'Argentina', team2: 'Inglaterra', score1: '3', score2: '1', champion: '1' } };
    const s = computeScore(a, R);
    expect(s.breakdown.final).toBe(PUNTOS.final_equipo_finalista + PUNTOS.final_campeon + PUNTOS.final_resultado);
  });

  test('finalistas invertidos suman equipo + campeón pero NO resultado', () => {
    const a = { final: { team1: 'Inglaterra', team2: 'Argentina', score1: '1', score2: '3', champion: '2' } };
    const s = computeScore(a, R);
    expect(s.breakdown.final).toBe(PUNTOS.final_equipo_finalista + PUNTOS.final_campeon);
  });

  test('finalistas bien pero champion mal = equipos + resultado', () => {
    const a = { final: { team1: 'Argentina', team2: 'Inglaterra', score1: '3', score2: '1', champion: '2' } };
    const s = computeScore(a, R);
    expect(s.breakdown.final).toBe(PUNTOS.final_equipo_finalista + PUNTOS.final_resultado);
  });

  test('finalistas bien pero score mal = equipos + champion', () => {
    const a = { final: { team1: 'Argentina', team2: 'Inglaterra', score1: '2', score2: '0', champion: '1' } };
    const s = computeScore(a, R);
    expect(s.breakdown.final).toBe(PUNTOS.final_equipo_finalista + PUNTOS.final_campeon);
  });

  test('solo champion correcto = 2500 (campeón es independiente de finalistas)', () => {
    const a = { final: { team1: 'Argentina', team2: 'Brasil', score1: '3', score2: '1', champion: '1' } };
    const s = computeScore(a, R);
    expect(s.breakdown.final).toBe(PUNTOS.final_campeon);
  });
});

describe('Goleador', () => {

  const R = { goleador: { player: 'Lionel Messi (Argentina)', goals: '8' } };

  test('jugador + goles = 1000', () => {
    const s = computeScore(
      { goleador: { player: 'Lionel Messi (Argentina)', goals: '8' } },
      R
    );
    expect(s.breakdown.goleador).toBe(PUNTOS.goleador_ambos);
  });

  test('solo jugador = 400', () => {
    const s = computeScore(
      { goleador: { player: 'Lionel Messi (Argentina)', goals: '5' } },
      R
    );
    expect(s.breakdown.goleador).toBe(PUNTOS.goleador_jugador);
  });

  test('solo goles = 100', () => {
    const s = computeScore(
      { goleador: { player: 'Kylian Mbappé (Francia)', goals: '8' } },
      R
    );
    expect(s.breakdown.goleador).toBe(PUNTOS.goleador_cantidad);
  });

  test('ninguno = 0', () => {
    const s = computeScore(
      { goleador: { player: 'Kylian Mbappé (Francia)', goals: '5' } },
      R
    );
    expect(s.breakdown.goleador).toBe(0);
  });

  test('"Otro" funciona como cualquier jugador', () => {
    const r = { goleador: { player: 'Otro', goals: '6' } };
    const s = computeScore(
      { goleador: { player: 'Otro', goals: '6' } },
      r
    );
    expect(s.breakdown.goleador).toBe(PUNTOS.goleador_ambos);
  });

  test('solo goles correctos con goals como number en results = 100', () => {
    const r = { goleador: { player: 'Messi', goals: 8 } };
    const s = computeScore(
      { goleador: { player: 'Mbappé', goals: '8' } },
      r
    );
    expect(s.breakdown.goleador).toBe(PUNTOS.goleador_cantidad);
  });
});

describe('Integración — score total', () => {

  test('predicción perfecta suma todos los puntos máximos', () => {
    const r = mockResults();
    const a = mockAnswers();
    const s = computeScore(a, r);

    const expectedGroups = 1 * PUNTOS.grupo_acierto_orden; // 1 grupo en mock
    const expectedChampions = 2 * PUNTOS.campeon_otra_fase;
    const expectedNonChamps = PUNTOS.no_campeon_semis + PUNTOS.no_campeon_cuartos;
    const expectedArgentina = 6 * PUNTOS.argentina_por_acierto;
    const expectedDoble = PUNTOS.doble_solo;
    const expectedFinal = PUNTOS.final_equipo_finalista + PUNTOS.final_campeon + PUNTOS.final_resultado;
    const expectedGoleador = PUNTOS.goleador_ambos;

    const expectedTotal = expectedGroups + expectedChampions + expectedNonChamps
      + expectedArgentina + expectedDoble + expectedFinal + expectedGoleador;

    expect(s.total).toBe(expectedTotal);
    expect(s.breakdown.grupos).toBe(expectedGroups);
    expect(s.breakdown.champions).toBe(expectedChampions);
    expect(s.breakdown.nonChamps).toBe(expectedNonChamps);
    expect(s.breakdown.argentina).toBe(expectedArgentina);
    expect(s.breakdown.dobleCamiseta).toBe(expectedDoble);
    expect(s.breakdown.final).toBe(expectedFinal);
    expect(s.breakdown.goleador).toBe(expectedGoleador);
  });

  test('predicción vacía = 0 en todo', () => {
    const r = mockResults();
    const a = {
      groups: {}, champions: {}, nonChamps: [],
      argentina: {}, dobleCamiseta: {},
      final: {}, goleador: {},
    };
    const s = computeScore(a, r);
    expect(s.total).toBe(0);
    Object.values(s.breakdown).forEach(v => expect(v).toBe(0));
  });

  test('results vacíos = 0', () => {
    const r = {};
    const a = mockAnswers();
    const s = computeScore(a, r);
    expect(s.total).toBe(0);
  });
});
