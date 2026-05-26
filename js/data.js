// ============================================
// El Juego del Mundial 2026 — Datos
// ============================================
// EDITÁ ESTE ARCHIVO para configurar equipos,
// grupos, preguntas y opciones.

// ---------- EQUIPOS ----------
const TEAMS = [
  'México', 'Sudáfrica', 'Corea del Sur', 'República Checa',
  'Canadá', 'Bosnia y Herzegovina', 'Catar', 'Suiza',
  'Brasil', 'Marruecos', 'Haití', 'Escocia',
  'Estados Unidos', 'Paraguay', 'Australia', 'Turquía',
  'Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador',
  'Países Bajos', 'Japón', 'Suecia', 'Túnez',
  'Bélgica', 'Egipto', 'Irán', 'Nueva Zelanda',
  'España', 'Cabo Verde', 'Arabia Saudita', 'Uruguay',
  'Francia', 'Senegal', 'Irak', 'Noruega',
  'Argentina', 'Argelia', 'Austria', 'Jordania',
  'Portugal', 'RD Congo', 'Uzbekistán', 'Colombia',
  'Inglaterra', 'Croacia', 'Ghana', 'Panamá'
];

// ---------- CAMPEONES MUNDIALES (8) ----------
const CHAMPIONS = [
  'Argentina', 'Brasil', 'Alemania', 'Francia',
  'España', 'Inglaterra', 'Uruguay'
];

// ---------- DEBUTANTES 2026 (first-time WC) ----------
// Completar cuando se definan los clasificados
const DEBUTANTS = [
  'Cabo Verde', 'Curazao', 'Jordania', 'Uzbekistán'
];

// ---------- GRUPOS (12 grupos × 4 equipos) ----------
// EDITAR cuando se realice el sorteo oficial
const GROUPS = {
  A: ['México', 'Sudáfrica', 'Corea del Sur', 'República Checa'],
  B: ['Canadá', 'Bosnia y Herzegovina', 'Catar', 'Suiza'],
  C: ['Brasil', 'Marruecos', 'Haití', 'Escocia'],
  D: ['Estados Unidos', 'Paraguay', 'Australia', 'Turquía'],
  E: ['Alemania', 'Curazao', 'Costa de Marfil', 'Ecuador'],
  F: ['Países Bajos', 'Japón', 'Suecia', 'Túnez'],
  G: ['Bélgica', 'Egipto', 'Irán', 'Nueva Zelanda'],
  H: ['España', 'Cabo Verde', 'Arabia Saudita', 'Uruguay'],
  I: ['Francia', 'Senegal', 'Irak', 'Noruega'],
  J: ['Argentina', 'Argelia', 'Austria', 'Jordania'],
  K: ['Portugal', 'RD Congo', 'Uzbekistán', 'Colombia'],
  L: ['Inglaterra', 'Croacia', 'Ghana', 'Panamá']
};

// ---------- FASES DE ELIMINACIÓN ----------
const STAGES = [
  { value: 'grupos',     label: 'Fase de grupos' },
  { value: 'dieciseisavos',     label: 'Dieciseisavos de final' },
  { value: 'octavos',     label: 'Octavos de final' },
  { value: 'cuartos',    label: 'Cuartos de final' },
  { value: 'tercero',    label: 'Tercer y cuarto puesto' },
  { value: 'final',      label: 'Final' }
];

// ---------- JUGADORES (Goleador) ----------
const PLAYERS = [
  'Álvaro Morata (España)',
  'Antoine Griezmann (Francia)',
  'Bukayo Saka (Inglaterra)',
  'Cody Gakpo (Países Bajos)',
  'Cristiano Ronaldo (Portugal)',
  'Darwin Núñez (Uruguay)',
  'Erling Haaland (Noruega)',
  'Giorgian de Arrascaeta (Uruguay)',
  'Gonçalo Ramos (Portugal)',
  'Harry Kane (Inglaterra)',
  'Jamal Musiala (Alemania)',
  'Jonathan David (Canadá)',
  'Jude Bellingham (Inglaterra)',
  'Julián Álvarez (Argentina)',
  'Kaoru Mitoma (Japón)',
  'Kevin De Bruyne (Bélgica)',
  'Kylian Mbappé (Francia)',
  'Lamine Yamal (España)',
  'Lautaro Martínez (Argentina)',
  'Lionel Messi (Argentina)',
  'Luis Díaz (Colombia)',
  'Mehdi Taremi (Irán)',
  'Memphis Depay (Países Bajos)',
  'Mikel Oyarzabal (España)',
  'Mohamed Salah (Egipto)',
  'Niclas Füllkrug (Alemania)',
  'Phil Foden (Inglaterra)',
  'Rafael Leão (Portugal)',
  'Rodrygo (Brasil)',
  'Romelu Lukaku (Bélgica)',
  'Sadio Mané (Senegal)',
  'Santiago Giménez (México)',
  'Son Heung-min (Corea del Sur)',
  'Takumi Minamino (Japón)',
  'Victor Osimhen (Nigeria)',
  'Vinicius Jr (Brasil)',
  'Otro'
];

// ---------- ORDEN DE PASE DE FASE (Argentina) ----------
const ARG_STAGES = [
  { key: 'grupos',  label: 'Fase de grupos' },
  { key: 'dieciseisavos',  label: 'Dieciseisavos' },
  { key: 'octavos',  label: 'Octavos de final' },
  { key: 'cuartos',  label: 'Cuartos de final' },
  { key: 'tercero',  label: 'Tercer y cuarto puesto' },
  { key: 'semis',   label: 'Semifinal' },
  { key: 'final',   label: 'Final' },
  { key: 'gana',    label: 'Campeón' }
];

// ---------- NOMBRES CORTOS PARA PASOS ----------
const STEP_NAMES = [
  'Grupos', 'Campeones', 'Otros', 'Argentina',
  'Doble C.', 'Final', 'Goleador'
];

// ---------- DEFINICIÓN DE PASOS DEL FORMULARIO ----------
const STEPS = [
  {
    id: 'groups',
    title: 'Fase de Grupos',
    desc: 'Elegí 1° y 2° de cada grupo',
    type: 'groups',
    groups: ['A','B','C','D','E','F','G','H','I','J','K','L']
  },
  {
    id: 'champions',
    title: 'Campeones del Mundo',
    desc: '¿Hasta dónde llega cada campeón histórico?',
    type: 'champions'
  },
  {
    id: 'non_champions',
    title: 'Otros equipos',
    desc: 'Elegí 3 equipos no campeones y pronosticá su techo',
    type: 'non_champions'
  },
  {
    id: 'argentina',
    title: '🇦🇷 El Camino de Argentina',
    desc: 'Pronosticá cada paso de Argentina en el torneo',
    type: 'argentina'
  },
  {
    id: 'doble_camiseta',
    title: 'Doble Camiseta',
    desc: 'Elegí el debutante que llegará más lejos',
    type: 'doble_camiseta'
  },
  {
    id: 'final',
    title: 'La Final del Mundial',
    desc: '¿Quiénes la juegan, el resultado y el campeón?',
    type: 'final'
  },
  {
    id: 'goleador',
    title: 'Goleador del Torneo',
    desc: 'Elegí al máximo goleador y sus goles',
    type: 'goleador'
  }
];
