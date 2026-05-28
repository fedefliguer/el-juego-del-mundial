// ============================================
// El Juego del Mundial 2026 — Resultados simulados
// ============================================
// Estos son resultados ficticios para probar el
// ranking mientras llegan los reales.
// EDITAR cuando termine el torneo.

const SIMULATED_RESULTS = {
  groups: {
    A: { first: 'México', second: 'Sudáfrica' },
    B: { first: 'Suiza', second: 'Canadá' },
    C: { first: 'Brasil', second: 'Escocia' },
    D: { first: 'Estados Unidos', second: 'Turquía' },
    E: { first: 'Alemania', second: 'Curazao' },
    F: { first: 'Países Bajos', second: 'Japón' },
    G: { first: 'Bélgica', second: 'Egipto' },
    H: { first: 'Uruguay', second: 'España' },
    I: { first: 'Francia', second: 'Senegal' },
    J: { first: 'Argentina', second: 'Argelia' },
    K: { first: 'Portugal', second: 'Colombia' },
    L: { first: 'Inglaterra', second: 'Croacia' }
  },
  champions: {
    'Argentina': 'final',
    'Brasil': 'cuartos',
    'Alemania': 'octavos',
    'Francia': 'cuartos',
    'España': 'octavos',
    'Inglaterra': 'final',
    'Uruguay': 'cuartos'
  },
  nonChamps: [
    { team: 'Países Bajos', stage: 'semis' },
    { team: 'Portugal', stage: 'cuartos' },
    { team: 'Bélgica', stage: 'cuartos' }
  ],
  argentina: {
    grupo: '1',
    rivales: {
      dieciseisavos: 'Senegal',
      octavos: 'Uruguay',
      cuartos: 'Países Bajos',
      semis: 'Inglaterra',
      final: 'Francia'
    },
    plantarse: null
  },
  dobleCamiseta: {
    team: 'Curazao',
    mode: 'solo'
  },
  final: {
    team1: 'Argentina',
    team2: 'Inglaterra',
    score1: '3',
    score2: '1',
    champion: '1'
  },
  goleador: {
    player: 'Lionel Messi (Argentina)',
    goals: '8'
  }
};
