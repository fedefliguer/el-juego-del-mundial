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
    desc: 'Elegí 1° y 2° de los 12 grupos. Sumás 150 por grupo si acertás en orden. Sumás 50 si ambos pasan los grupos pero no en ese orden.',
    type: 'groups',
    groups: ['A','B','C','D','E','F','G','H','I','J','K','L']
  },
  {
    id: 'champions',
    title: 'Los 7 países que saben cuánto pesa',
    desc: 'Elegí cuándo se vuelven. Sumás 300 por cada acierto, salvo que aciertes que se vuelve en grupos que sumás 500.',
    type: 'champions'
  },
  {
    id: 'non_champions',
    title: 'Los 41 restantes',
    desc: 'Elegí 3 países y acertá cuándo se vuelven. Acertar grupos da 100, dieciseisavos 150, octavos 300, cuartos 400, tercer y cuarto puesto 450, final 500.',
    type: 'non_champions'
  },
  {
    id: 'argentina',
    title: 'El camino de Argentina',
    desc: 'Elegí en qué puesto del grupo quedamos y contra quién vamos en cada ronda. Por cada acierto sumás 300. Si te equivocás perdés todo. Podés plantarte y sumar 300 por cada acierto previo.',
    type: 'argentina'
  },
  {
    id: 'primera_vez',
    title: 'La primera vez',
    desc: 'Elegí el debutante que llega más lejos. Si acertás compartido son 400. Si acertás que es el único de los 4 que llega tan lejo sumás 1000. Si todos se vuelven en grupos, suman 400 todos los que pusieron compartido y 0 todos los que pusieron único.',
    type: 'primera_vez'
  },
  {
    id: 'final',
    title: 'Final y campeón',
    desc: 'Elegí los dos equipos que la juegan, el resultado y el campeón. Por cada finalista que acertás sumás 500. Si acertás el resultado del partido (más eventual alargue) sumás 300. Si acertás el campeón sumás 2500.',
    type: 'final'
  },
  {
    id: 'goleador',
    title: 'Goleador',
    desc: 'Elegí al que más goles hace y cuántos. Si acertás el jugador (u "otros") sumás 400. Si acertás el número de goles sumás 100. Si acertás ambos sumás 1000 en total. Si hay más de un goleador suman todos, incluso "otros" llegado el caso.',
    type: 'goleador'
  }
];
