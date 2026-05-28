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
    desc: 'Elegí primero y segundo de los 12 grupos.',
    scoring: 'En cada grupo, sumás 150 puntos si acertás al primero y segundo en orden. Sumás 50 si no los acertás en orden, pero ambos pasan de ronda. Sumás 0 si alguno no pasa de ronda.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Italia primero, Chile segundo<br><span class="example-result">Si sale</span> Italia primero y Chile segundo, <span class="example-pts">sumás 150</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Italia primero, Chile segundo<br><span class="example-result">Si sale</span> Chile primero e Italia segundo, <span class="example-pts">sumás 50</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Nigeria primero, Camerún segundo<br><span class="example-result">Si sale</span> Nigeria primero, pero Camerún no pasa de ronda, <span class="example-pts">sumás 0</span></div>',
    type: 'groups',
    groups: ['A','B','C','D','E','F','G','H','I','J','K','L']
  },
  {
    id: 'champions',
    title: 'Los 7 países que saben cuánto pesa',
    desc: 'Elegí en qué ronda se vuelve cada uno de los 7 campeones mundiales.',
    scoring: 'Sumás 300 puntos por cada campeón que aciertes. Si acertás que se vuelve en fase de grupos, sumás 500.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Italia en octavos de final<br><span class="example-result">Si sale</span> Italia se vuelve en octavos, <span class="example-pts">sumás 300</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Italia en octavos de final<br><span class="example-result">Si sale</span> Italia se vuelve en fase de grupos, <span class="example-pts">sumás 500</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Italia en octavos de final<br><span class="example-result">Si sale</span> Italia llega más lejos que octavos, <span class="example-pts">sumás 0</span></div>',
    type: 'champions'
  },
  {
    id: 'non_champions',
    title: 'Los 41 restantes',
    desc: 'Elegí 3 países no campeones y acertá en qué ronda se vuelven.',
    scoring: 'Sumás 100 puntos si acertás que se vuelve en grupos, 150 en dieciseisavos, 300 en octavos, 400 en cuartos, 450 en tercer y cuarto puesto, 500 en la final.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Camerún en octavos de final<br><span class="example-result">Si sale</span> Camerún se vuelve en octavos, <span class="example-pts">sumás 300</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Nigeria en grupos<br><span class="example-result">Si sale</span> Nigeria se vuelve en grupos, <span class="example-pts">sumás 100</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Chile en cuartos de final<br><span class="example-result">Si sale</span> Chile se vuelve antes de cuartos, <span class="example-pts">sumás 0</span></div>',
    type: 'non_champions'
  },
  {
    id: 'argentina',
    title: 'El camino de Argentina',
    desc: 'Elegí en qué puesto del grupo queda Argentina y contra quién juega en cada ronda.',
    scoring: 'Sumás 300 puntos por cada acierto (puesto en el grupo más cada rival de ronda). Si te equivocás en una ronda, todo lo siguiente da 0. Podés plantarte para asegurar lo acumulado.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Argentina primera en el grupo<br><span class="example-result">Si sale</span> Argentina primera en el grupo, <span class="example-pts">sumás 300</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Argentina gana contra Nigeria en dieciseisavos<br><span class="example-result">Si sale</span> Argentina gana contra Nigeria en dieciseisavos, <span class="example-pts">sumás 300</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Argentina gana contra Camerún en octavos<br><span class="example-result">Si sale</span> Argentina pierde contra Camerún en octavos, octavos en adelante <span class="example-pts">dan 0</span></div>',
    type: 'argentina'
  },
  {
    id: 'primera_vez',
    title: 'La primera vez',
    desc: 'Elegí el debutante que llega más lejos.',
    scoring: 'Sumás 400 puntos si acertás que llega más lejos junto a otro debutante (compartido). Sumás 1000 si es el único debutante que llega hasta esa ronda (único). Si todos se van en grupos: los que pusieron compartido suman 400, los que pusieron único suman 0.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Chile, compartido<br><span class="example-result">Si sale</span> Chile llega más lejos junto a otro debutante, <span class="example-pts">sumás 400</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Chile, único<br><span class="example-result">Si sale</span> Chile es el único debutante que llega a esa ronda, <span class="example-pts">sumás 1000</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Chile, único<br><span class="example-result">Si sale</span> todos los debutantes se van en grupos, <span class="example-pts">sumás 0</span></div>',
    type: 'primera_vez'
  },
  {
    id: 'final',
    title: 'Final y campeón',
    desc: "Elegí los dos finalistas, el resultado (sin contar penales) y el campeón.",
    scoring: 'Sumás 500 puntos por cada finalista acertado. Sumás 300 si acertás el resultado exacto (incluye alargue). Sumás 2500 si acertás el campeón.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Italia vs Nigeria, 2 a 1, campeón Italia<br><span class="example-result">Si sale</span> Italia y Nigeria en la final, <span class="example-pts">sumás 500 cada uno (1000)</span></div><div class="example"><span class="example-result">Si sale</span> 2 a 1 el resultado, <span class="example-pts">sumás 300</span></div><div class="example"><span class="example-result">Si sale</span> Italia campeón, <span class="example-pts">sumás 2500</span></div><div class="example"><span class="example-pts">Total si acertás todo: 3800</span></div>',
    type: 'final'
  },
  {
    id: 'goleador',
    title: 'Goleador',
    desc: 'Elegí al jugador que hace más goles y cuántos.',
    scoring: 'Sumás 400 puntos si acertás el jugador (o "Otro"). Sumás 100 si acertás la cantidad de goles. Si acertás ambos, sumás 1000 en total. Si hay empate, suman todos.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> jugador de Nigeria, 5 goles<br><span class="example-result">Si sale</span> ese jugador es el goleador, <span class="example-pts">sumás 400</span></div><div class="example"><span class="example-result">Si sale</span> hace exactamente 5 goles, <span class="example-pts">sumás 100 más</span></div><div class="example"><span class="example-result">Si sale</span> acertás ambas, <span class="example-pts">sumás 1000 en total</span></div>',
    type: 'goleador'
  }
];
