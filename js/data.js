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
  'Achraf Hakimi (Marruecos)',
  'Ahmed Hegazi (Egipto)',
  'Ahmed Musa (Nigeria)',
  'Aïssa Laidouni (Túnez)',
  'Ajdin Hrustić (Australia)',
  'Akram Afif (Qatar)',
  'Alejandro Balde (España)',
  'Alejandro Garnacho (Argentina)', // REVISAR - probablemente no
  'Alexander Isak (Suecia)',
  'Ali Adnan (Irak)',
  'Ali Al-Bulayhi (Arabia Saudita)',
  'Ali Mabkhout (Emiratos Árabes)',
  'Alireza Jahanbakhsh (Irán)',
  'Almoez Ali (Qatar)',
  'Alphonso Davies (Canadá)',
  'Álvaro Morata (España)',
  'Amin Al-Dabbas (Jordania)',
  'Amjed Rezzek (Irak)',
  'André Onana (Camerún)',
  'Antoine Griezmann (Francia)',
  'Antonee Robinson (EE.UU.)',
  'Antonio Rüdiger (Alemania)',
  'Antony (Brasil)',
  'Arda Güler (Turquía)',
  'Aurélien Tchouaméni (Francia)',
  'Axel Witsel (Bélgica)',
  'Ayo Akinola (Canadá)',
  'Bernardo Silva (Portugal)',
  'Breel Embolo (Suiza)',
  'Bruno Fernandes (Portugal)',
  'Bukayo Saka (Inglaterra)',
  'Carlos Vela (México)',
  'Chadli Leggett (Curazao)',
  'Cheikhou Kouyaté (Senegal)',
  'Chris Wood (Nueva Zelanda)',
  'Christian Eriksen (Dinamarca)',
  'Christian Pulisic (EE.UU.)',
  'Christoph Baumgartner (Austria)',
  'Cody Gakpo (Países Bajos)',
  'Craig Goodwin (Australia)',
  'Cristiano Ronaldo (Portugal)',
  'Cyle Larin (Canadá)',
  'Daler Kuzyaev (Uzbekistán)',
  'Darwin Núñez (Uruguay)',
  'David Alaba (Austria)',
  'Dayot Upamecano (Francia)',
  'Declan Rice (Inglaterra)',
  'Dedryck Boyata (Bélgica)',
  'Dejan Kulusevski (Suecia)',
  'Denzel Dumfries (Países Bajos)',
  'Diogo Dalot (Portugal)',
  'Douglas Luiz (Brasil)',
  'Duván Zapata (Colombia)',
  'Eden Hazard (Bélgica)', // REVISAR - puede estar retirado
  'Edson Álvarez (México)',
  'Eduardo Camavinga (Francia)',
  'Emil Forsberg (Suecia)',
  'Endrick (Brasil)',
  'Enner Valencia (Ecuador)',
  'Erling Haaland (Noruega)',
  'Federico Valverde (Uruguay)',
  'Ferran Torres (España)',
  'Florian Wirtz (Alemania)',
  'Fodé Balogun (Senegal)',
  'Frenkie de Jong (Países Bajos)',
  'Gabriel Martinelli (Brasil)',
  'Garry Guerrier (Haití)',
  'Gavi (España)',
  'Gio Reyna (EE.UU.)',
  'Giorgian de Arrascaeta (Uruguay)',
  'Giovani Lo Celso (Argentina)',
  'Gonçalo Ramos (Portugal)',
  'Gonzalo Montiel (Argentina)',
  'Granit Xhaka (Suiza)',
  'Gustavo Gómez (Paraguay)',
  'Hakim Ziyech (Marruecos)',
  'Harib Al-Maafkali (Emiratos Árabes)',
  'Harry Kane (Inglaterra)',
  'Harry Souttar (Australia)',
  'Hiroki Ito (Japón)',
  'Hirving Lozano (México)',
  'Hwang In-beom (Corea del Sur)',
  'Íñigo Martínez (España)',
  'Ismaïla Sarr (Senegal)',
  'Jack Grealish (Inglaterra)',
  'Jamal Musiala (Alemania)',
  'James Maddison (Inglaterra)',
  'James Rodríguez (Colombia)',
  'Jarrod Bowen (Inglaterra)',
  'Jesús Angulo (México)',
  'Jhon Duran (Haití)',
  'João Félix (Portugal)',
  'Joe Scally (EE.UU.)',
  'Joelinton (Brasil)',
  'Jonathan David (Canadá)',
  'Joshua Kimmich (Alemania)',
  'Juan Fernando Quintero (Colombia)',
  'Juan Guillermo Cuadrado (Colombia)',
  'Jude Bellingham (Inglaterra)',
  'Jules Koundé (Francia)',
  'Julián Álvarez (Argentina)',
  'Juninho Bacuna (Curazao)',
  'Jurriën Timber (Países Bajos)',
  'Kai Havertz (Alemania)',
  'Kaoru Mitoma (Japón)',
  'Kasper Schmeichel (Dinamarca)',
  'Kellyn Acosta (EE.UU.)',
  'Kerem Aktürkoğlu (Turquía)',
  'Kevin De Bruyne (Bélgica)',
  'Kim Min-jae (Corea del Sur)',
  'Kylian Mbappé (Francia)',
  'Lamine Yamal (España)',
  'Lautaro Martínez (Argentina)',
  'Lee Kang-in (Corea del Sur)',
  'Leroy Sané (Alemania)',
  'Lionel Messi (Argentina)',
  'Lisandro Martínez (Países Bajos)', // Espera, juega para Argentina
  'Lucas Paquetá (Brasil)',
  'Luis Díaz (Colombia)',
  'Lukáš Masopust (República Checa)',
  'Manuel Neuer (Alemania)',
  'Marcel Sabitzer (Austria)',
  'Martin Ødegaard (Noruega)',
  'Mason Mount (Inglaterra)',
  'Matías Viña (Uruguay)',
  'Mehdi Taremi (Irán)',
  'Memphis Depay (Países Bajos)',
  'Merih Demiral (Turquía)',
  'Mike Petrasso (Canadá)',
  'Mikel Oyarzabal (España)',
  'Mitch Duke (Australia)',
  'Mohamed Elneny (Egipto)',
  'Mohamed Salah (Egipto)',
  'Moisés Caicedo (Ecuador)',
  'N\'Golo Kanté (Francia)',
  'Néstor Giménez (Paraguay)',
  'Neymar (Brasil)',
  'Nico González (Argentina)',
  'Nicolas Pépé (Costa de Marfil)',
  'Nicolás Tagliafico (Argentina)',
  'Noussair Mazraoui (Marruecos)',
  'Orbelín Pineda (México)',
  'Óscar Romero (Paraguay)',
  'Oston Urunov (Uzbekistán)',
  'Otro',
  'Ousmane Dembélé (Francia)',
  'Pacho Hincapié (Ecuador)',
  'Paulo Dybala (Argentina)',
  'Pedri (España)',
  'Phil Foden (Inglaterra)',
  'Piero Hincapié (Ecuador)',
  'Rafael Leão (Portugal)',
  'Rafael Santos Borré (Colombia)',
  'Raheem Sterling (Inglaterra)',
  'Rasmus Højlund (Dinamarca)',
  'Raúl Jiménez (México)',
  'Reo Hatate (Japón)',
  'Richarlison (Brasil)',
  'Rodri (España)',
  'Rodrigo Bentancur (Uruguay)',
  'Rodrygo (Brasil)',
  'Romeesh Ivey (Cabo Verde)',
  'Romelu Lukaku (Bélgica)',
  'Rory Fallon (Nueva Zelanda)',
  'Sadio Mané (Senegal)',
  'Salem Al-Dawsari (Arabia Saudita)',
  'Saman Ghoddos (Irán)',
  'Samuel Chukwueze (Nigeria)',
  'Santiago Giménez (México)',
  'Sebastián Coates (Uruguay)',
  'Seif Eddine Khaoui (Túnez)',
  'Serdar Aziz (Turquía)',
  'Serge Gnabry (Alemania)',
  'Sergiño Dest (EE.UU.)',
  'Sofyan Amrabat (Marruecos)',
  'Son Heung-min (Corea del Sur)',
  'Steven Bergwijn (Países Bajos)',
  'Takumi Minamino (Japón)',
  'Theo Hernández (Francia)',
  'Thibaut Courtois (Bélgica)',
  'Thomas Müller (Alemania)',
  'Tomáš Souček (República Checa)',
  'Victor Osimhen (Nigeria)',
  'Viktor Gyökeres (Suecia)',
  'Vincent Aboubakar (Camerún)',
  'Vinicius Jr (Brasil)',
  'Vinícius Júnior (Brasil)',
  'Vitinha (Portugal)',
  'Vladimír Darida (República Checa)',
  'Wilfred Ndidi (Nigeria)',
  'Wilfried Zaha (Costa de Marfil)',
  'Xavi Simons (Países Bajos)',
  'Xherdan Shaqiri (Suiza)',
  'Yan Couto (Cabo Verde)',
  'Yann Sommer (Suiza)',
  'Yannick Bolasie (Camerún)',
  'Yannick Carrasco (Bélgica)',
  'Yazan Al-Naimat (Jordania)',
  'Youssef En-Nesyri (Marruecos)',
  'Youssef Msakni (Túnez)',
  'Yunus Musah (EE.UU.)'
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
    desc: 'Elegí el último partido que juega cada uno de los 7 campeones mundiales.',
    scoring: 'Por cada país sumás 500 puntos si acertás que el último partido es fase de grupos. Sumás 300 puntos si acertás que el último partido es Dieciseisavos, Octavos, Cuartos, 3ª y 4ª puesto o Final. Sumás 0 si te equivocas.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Italia en octavos de final<br><span class="example-result">Si sale</span> Italia se vuelve en octavos, <span class="example-pts">sumás 300</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Italia en fase de grupos<br><span class="example-result">Si sale</span> Italia se vuelve en fase de grupos, <span class="example-pts">sumás 500</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Italia en octavos de final<br><span class="example-result">Si sale</span> Italia llega más lejos que octavos, <span class="example-pts">sumás 0</span></div>',
    type: 'champions'
  },
  {
    id: 'non_champions',
    title: 'Los 41 restantes',
    desc: 'Elegí 3 países no campeones y acertá en qué ronda se vuelven.',
    scoring: 'Por cada país sumás 100 puntos si acertás que el último partido es fase en grupos, 200 si acertás dieciseisavos, 300 si acertás octavos, 400 si acertás cuartos, 500 si acertás tercer y cuarto puesto, 600 si acertás la final.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Camerún en octavos de final<br><span class="example-result">Si</span> Camerún se vuelve en octavos, <span class="example-pts">sumás 300</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Nigeria en grupos<br><span class="example-result">Si</span> Nigeria se vuelve en grupos, <span class="example-pts">sumás 100</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Chile en cuartos de final<br><span class="example-result">Si</span> Chile llega a la final, <span class="example-pts">sumás 0</span></div>',
    type: 'non_champions'
  },
  {
    id: 'argentina',
    title: 'El camino de Argentina',
    desc: 'Elegí en qué puesto del grupo queda Argentina y contra quién juega en cada ronda.',
    scoring: 'Sumás 300 puntos si acertás el puesto exacto en el que termina en el grupo, y 300 puntos más por cada rival que acertás. Solo sumás puntos si acertás exactamente todo el camino, o si te plantás y acertaste todos los rivales hasta plantarte. Si te equivocás en el puesto o en cualquier ronda, sumás 0.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Argentina primera en el grupo, me planto<br><span class="example-result">Si sale</span> Argentina primera en el grupo, pase lo que pase luego, <span class="example-pts">sumás 300</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Argentina segunda en el grupo, Chile en dieciseisavos, Nigeria en octavos, me planto.<br><span class="example-result">Si sale</span> Argentina segunda en el grupo, Chile en dieciseisavos, Nigeria en octavos, ... <span class="example-pts">sumás 900</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Argentina segunda en el grupo, Chile en dieciseisavos, Nigeria en octavos, me planto.<br><span class="example-result">Si sale</span> Argentina primera en el grupo, pase lo que pase luego, <span class="example-pts">sumás 0</span></div>',
    type: 'argentina'
  },
  {
    id: 'primera_vez',
    title: 'La primera vez',
    desc: 'Elegí el debutante que llega más lejos. Elegí si es el único que llega tan lejos o puede compartir con otro debutante.',
    scoring: 'Si elegís único, sumás 1000 puntos si es el único de los 4 que llega tan lejos, sea cual sea la ronda. Si elegís Compartido (o único), sumás 400 puntos si no hay ninguno otro de los debutantes que llegue más lejos.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Chile, compartido<br><span class="example-result">Si</span> Chile se va en octavos y todo el resto en grupos, <span class="example-pts">sumás 400</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Chile, único<br><span class="example-result">Si</span> Chile se va en octavos y todo el resto en grupos, <span class="example-pts">sumás 1000</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Chile, único<br><span class="example-result">Si sale</span> todos los debutantes se van en grupos, <span class="example-pts">sumás 0</span></div><div class="example"><span class="example-pred">Vos pusiste:</span> Chile, compartido<br><span class="example-result">Si sale</span> todos los debutantes se van en grupos, <span class="example-pts">sumás 400</span></div>',
    type: 'primera_vez'
  },
  {
    id: 'final',
    title: 'Final y campeón',
    desc: "Elegí los dos finalistas, el resultado y el campeón.",
    scoring: 'Sumás 500 puntos por cada finalista acertado. Sumás 500 si acertás el resultado (contando alargue). Sumás 2500 si acertás el campeón. Es indistinto poner 2 a 0 o 0 a 2.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Italia vs Nigeria, 2 a 1, campeón Italia<br><span class="example-result">Si sale</span> Italia y Nigeria en la final, <span class="example-pts">sumás 500 cada uno (1000)</span></div><div class="example"><span class="example-result">Si sale</span> 2 a 1 el resultado, <span class="example-pts">sumás 500</span></div><div class="example"><span class="example-result">Si sale</span> Italia campeón, <span class="example-pts">sumás 2500</span></div>',
    type: 'final'
  },
  {
    id: 'goleador',
    title: 'Goleador',
    desc: 'Elegí al jugador que hace más goles y cuántos.',
    scoring: 'Sumás 400 puntos si acertás el jugador (o "Otro"). Sumás 100 si acertás la cantidad de goles. Si acertás ambos, sumás 1000 en total. Si hay empate, suman todos.',
    examples: '<div class="example"><span class="example-pred">Vos pusiste:</span> Jay Jay Okocha, 12 goles</div><div class="example"><span class="example-result">Si sale</span> Okocha goleador con exactamente 12 goles <span class="example-pts">sumás 1000</span></div><div class="example"><span class="example-result">Si sale</span> otro goleador con 12 goles <span class="example-pts">sumás 100</span></div><div class="example"><span class="example-result">Si sale</span> Okocha goleador con más (o menos) de 12 goles <span class="example-pts">sumás 400</span></div><div class="example"><span class="example-result">Si sale</span> cualquier otro caso <span class="example-pts">sumás 0</span></div>',
    type: 'goleador'
  }
];
