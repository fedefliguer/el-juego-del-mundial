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


function escapeHtml(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.innerHTML;
}

let allTournaments = [];

// ---------- NOMBRES CORTOS PARA PASOS ----------
const STEP_NAMES = [
  'Fase de Grupos', 'Los 7 países que saben cuánto pesa', 'Los 41 restantes', 'El camino de Argentina',
  'La primera vez', 'Final y campeón', 'Goleador'
];

// ---------- DEFINICIÓN DE PASOS DEL FORMULARIO ----------
const STEPS = [
  {
    id: 'groups',
    title: 'Fase de Grupos',
    desc: 'Elegí 1° y 2° de los 12 grupos.',
    scoring: 'Por grupo: 150 pts si acertás 1° y 2° en orden. 50 pts si pasan ambos pero al revés.',
    examples: 'Italia 1°, Chile 2° → 150 pts. Italia 2°, Chile 1° → 50 pts. Nigeria pasa, Camerún no → 0 pts.',
    type: 'groups',
    groups: ['A','B','C','D','E','F','G','H','I','J','K','L']
  },
  {
    id: 'champions',
    title: 'Los 7 países que saben cuánto pesa',
    desc: 'Elegí en qué ronda se vuelve cada uno de los 7 campeones mundiales.',
    scoring: '300 pts por acierto. Si acertás que se vuelve en Fase de Grupos: 500 pts.',
    examples: 'Italia en Octavos → 300 pts. Italia en Grupos → 500 pts. Italia llega más lejos de lo que pusiste → 0 pts.',
    type: 'champions'
  },
  {
    id: 'non_champions',
    title: 'Los 41 restantes',
    desc: 'Elegí 3 países no campeones y acertá cuándo se vuelven.',
    scoring: 'Grupos: 100 pts. Dieciseisavos: 150 pts. Octavos: 300 pts. Cuartos: 400 pts. 3° y 4°: 450 pts. Final: 500 pts.',
    examples: 'Camerún en Octavos → 300 pts. Nigeria en Grupos → 100 pts. Chile llega más lejos de lo que pusiste → 0 pts.',
    type: 'non_champions'
  },
  {
    id: 'argentina',
    title: 'El camino de Argentina',
    desc: 'Elegí en qué puesto del grupo queda Argentina y contra quién juega en cada ronda.',
    scoring: '300 pts por cada acierto. Si te equivocás en una ronda, todo lo siguiente da 0. Podés plantarte para asegurar lo acumulado.',
    examples: 'Argentina 1° del grupo → 300 pts. Gana contra Nigeria en Dieciseisavos → 300 pts. Si te equivocás ahí, octavos, cuartos y el resto dan 0.',
    type: 'argentina'
  },
  {
    id: 'primera_vez',
    title: 'La primera vez',
    desc: 'Elegí el debutante que llega más lejos.',
    scoring: 'Compartido (empata con otro debutante): 400 pts. Único (llega solo hasta esa ronda): 1000 pts. Si todos se van en grupos: 400 pts a compartido, 0 a único.',
    examples: 'Chile llega más lejos junto a otro debutante → 400 pts. Chile llega solo hasta esa ronda → 1000 pts.',
    type: 'primera_vez'
  },
  {
    id: 'final',
    title: 'Final y campeón',
    desc: "Elegí los dos finalistas, el resultado (90' + alargue) y el campeón.",
    scoring: 'Finalista acertado: 500 pts c/u. Resultado exacto: 300 pts. Campeón: 2500 pts.',
    examples: 'Italia vs Nigeria, 2-1, campeón Italia → Italia finalista: 500 pts. Nigeria finalista: 500 pts. 2-1: 300 pts. Italia campeón: 2500 pts.',
    type: 'final'
  },
  {
    id: 'goleador',
    title: 'Goleador',
    desc: 'Elegí al jugador que hace más goles y cuántos.',
    scoring: 'Acertás el jugador (u "Otro"): 400 pts. Acertás los goles: 100 pts. Acertás ambos: 1000 pts en total. Si hay empate, suman todos.',
    examples: 'Jugador de Nigeria, 5 goles → goleador acertado: 400 pts. 5 goles acertados: 100 pts más. Ambos: 1000 pts.',
    type: 'goleador'
  }
];
