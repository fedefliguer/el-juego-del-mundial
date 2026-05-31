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
  // ARGENTINA
  'Lionel Messi (Argentina)',
  'Lautaro Martínez (Argentina)',
  'Julián Álvarez (Argentina)',
  'Nico González (Argentina)',
  'Nicolás Tagliafico (Argentina)',
  'Giovani Lo Celso (Argentina)',
  'Gonzalo Montiel (Argentina)',
  'Alejandro Garnacho (Argentina)', // REVISAR - probablemente no
  'Paulo Dybala (Argentina)',

  // BRASIL
  'Vinicius Jr (Brasil)',
  'Rodrygo (Brasil)',
  'Endrick (Brasil)',
  'Neymar (Brasil)',
  'Lucas Paquetá (Brasil)',
  'Richarlison (Brasil)',
  'Gabriel Martinelli (Brasil)',
  'Antony (Brasil)',
  'Vinícius Júnior (Brasil)',
  'Joelinton (Brasil)',
  'Douglas Luiz (Brasil)',

  // FRANCIA
  'Kylian Mbappé (Francia)',
  'Antoine Griezmann (Francia)',
  'Ousmane Dembélé (Francia)',
  'Aurélien Tchouaméni (Francia)',
  'Eduardo Camavinga (Francia)',
  'Dayot Upamecano (Francia)',
  'Jules Koundé (Francia)',
  'N\'Golo Kanté (Francia)',
  'Theo Hernández (Francia)',

  // ALEMANIA
  'Jamal Musiala (Alemania)',
  'Florian Wirtz (Alemania)',
  'Leroy Sané (Alemania)',
  'Kai Havertz (Alemania)',
  'Serge Gnabry (Alemania)',
  'Thomas Müller (Alemania)',
  'Manuel Neuer (Alemania)',
  'Antonio Rüdiger (Alemania)',
  'Joshua Kimmich (Alemania)',

  // ESPAÑA
  'Álvaro Morata (España)',
  'Lamine Yamal (España)',
  'Mikel Oyarzabal (España)',
  'Pedri (España)',
  'Gavi (España)',
  'Ferran Torres (España)',
  'Alejandro Balde (España)',
  'Rodri (España)',
  'Íñigo Martínez (España)',

  // INGLATERRA
  'Harry Kane (Inglaterra)',
  'Phil Foden (Inglaterra)',
  'Bukayo Saka (Inglaterra)',
  'Jude Bellingham (Inglaterra)',
  'Declan Rice (Inglaterra)',
  'Mason Mount (Inglaterra)',
  'Raheem Sterling (Inglaterra)',
  'Jack Grealish (Inglaterra)',
  'Jarrod Bowen (Inglaterra)',
  'James Maddison (Inglaterra)',

  // PORTUGAL
  'Cristiano Ronaldo (Portugal)',
  'Gonçalo Ramos (Portugal)',
  'Rafael Leão (Portugal)',
  'João Félix (Portugal)',
  'Bernardo Silva (Portugal)',
  'Bruno Fernandes (Portugal)',
  'Diogo Dalot (Portugal)',
  'Vitinha (Portugal)',

  // BÉLGICA
  'Kevin De Bruyne (Bélgica)',
  'Romelu Lukaku (Bélgica)',
  'Eden Hazard (Bélgica)', // REVISAR - puede estar retirado
  'Axel Witsel (Bélgica)',
  'Thibaut Courtois (Bélgica)',
  'Yannick Carrasco (Bélgica)',
  'Dedryck Boyata (Bélgica)',

  // PAÍSES BAJOS
  'Cody Gakpo (Países Bajos)',
  'Memphis Depay (Países Bajos)',
  'Steven Bergwijn (Países Bajos)',
  'Jurriën Timber (Países Bajos)',
  'Frenkie de Jong (Países Bajos)',
  'Denzel Dumfries (Países Bajos)',
  'Lisandro Martínez (Países Bajos)', // Espera, juega para Argentina
  'Xavi Simons (Países Bajos)',

  // URUGUAY
  'Darwin Núñez (Uruguay)',
  'Giorgian de Arrascaeta (Uruguay)',
  'Federico Valverde (Uruguay)',
  'Rodrigo Bentancur (Uruguay)',
  'Sebastián Coates (Uruguay)',
  'Matías Viña (Uruguay)',

  // MÉXICO
  'Santiago Giménez (México)',
  'Hirving Lozano (México)',
  'Carlos Vela (México)',
  'Orbelín Pineda (México)',
  'Raúl Jiménez (México)',
  'Jesús Angulo (México)',
  'Edson Álvarez (México)',

  // COLOMBIA
  'Luis Díaz (Colombia)',
  'Juan Fernando Quintero (Colombia)',
  'James Rodríguez (Colombia)',
  'Duván Zapata (Colombia)',
  'Juan Guillermo Cuadrado (Colombia)',
  'Rafael Santos Borré (Colombia)',

  // ECUADOR
  'Moisés Caicedo (Ecuador)',
  'Piero Hincapié (Ecuador)',
  'Enner Valencia (Ecuador)',
  'Pacho Hincapié (Ecuador)',

  // PARAGUAY
  'Óscar Romero (Paraguay)',
  'Gustavo Gómez (Paraguay)',
  'Néstor Giménez (Paraguay)',

  // ESTADOS UNIDOS
  'Christian Pulisic (EE.UU.)',
  'Sergiño Dest (EE.UU.)',
  'Gio Reyna (EE.UU.)',
  'Joe Scally (EE.UU.)',
  'Antonee Robinson (EE.UU.)',
  'Yunus Musah (EE.UU.)',
  'Kellyn Acosta (EE.UU.)',

  // CANADÁ
  'Jonathan David (Canadá)',
  'Alphonso Davies (Canadá)',
  'Mike Petrasso (Canadá)',
  'Cyle Larin (Canadá)',
  'Ayo Akinola (Canadá)',

  // SUECIA
  'Alexander Isak (Suecia)',
  'Viktor Gyökeres (Suecia)',
  'Emil Forsberg (Suecia)',
  'Dejan Kulusevski (Suecia)',

  // NORUEGA
  'Erling Haaland (Noruega)',
  'Martin Ødegaard (Noruega)',

  // DINAMARCA
  'Christian Eriksen (Dinamarca)',
  'Rasmus Højlund (Dinamarca)',
  'Kasper Schmeichel (Dinamarca)',

  // REPÚBLICA CHECA
  'Tomáš Souček (República Checa)',
  'Vladimír Darida (República Checa)',
  'Lukáš Masopust (República Checa)',

  // SUIZA
  'Xherdan Shaqiri (Suiza)',
  'Granit Xhaka (Suiza)',
  'Yann Sommer (Suiza)',
  'Breel Embolo (Suiza)',

  // AUSTRIA
  'David Alaba (Austria)',
  'Christoph Baumgartner (Austria)',
  'Marcel Sabitzer (Austria)',

  // JAPÓN
  'Kaoru Mitoma (Japón)',
  'Takumi Minamino (Japón)',
  'Hiroki Ito (Japón)',
  'Reo Hatate (Japón)',

  // COREA DEL SUR
  'Son Heung-min (Corea del Sur)',
  'Lee Kang-in (Corea del Sur)',
  'Kim Min-jae (Corea del Sur)',
  'Hwang In-beom (Corea del Sur)',

  // AUSTRALIA
  'Harry Souttar (Australia)',
  'Mitch Duke (Australia)',
  'Craig Goodwin (Australia)',
  'Ajdin Hrustić (Australia)',

  // SENEGAL
  'Sadio Mané (Senegal)',
  'Ismaïla Sarr (Senegal)',
  'Cheikhou Kouyaté (Senegal)',
  'Fodé Balogun (Senegal)',

  // MARRUECOS
  'Sofyan Amrabat (Marruecos)',
  'Noussair Mazraoui (Marruecos)',
  'Hakim Ziyech (Marruecos)',
  'Youssef En-Nesyri (Marruecos)',
  'Achraf Hakimi (Marruecos)',

  // TÚNEZ
  'Youssef Msakni (Túnez)',
  'Aïssa Laidouni (Túnez)',
  'Seif Eddine Khaoui (Túnez)',

  // NIGERIA
  'Victor Osimhen (Nigeria)',
  'Ahmed Musa (Nigeria)',
  'Wilfred Ndidi (Nigeria)',
  'Samuel Chukwueze (Nigeria)',

  // CAMERÚN
  'Vincent Aboubakar (Camerún)',
  'André Onana (Camerún)',
  'Yannick Bolasie (Camerún)',

  // IRÁN
  'Mehdi Taremi (Irán)',
  'Alireza Jahanbakhsh (Irán)',
  'Saman Ghoddos (Irán)',

  // EGIPTO
  'Mohamed Salah (Egipto)',
  'Mohamed Elneny (Egipto)',
  'Ahmed Hegazi (Egipto)',

  // COSTA DE MARFIL
  'Nicolas Pépé (Costa de Marfil)',
  'Wilfried Zaha (Costa de Marfil)',

  // TURQUÍA
  'Arda Güler (Turquía)',
  'Kerem Aktürkoğlu (Turquía)',
  'Merih Demiral (Turquía)',
  'Serdar Aziz (Turquía)',

  // UZBEKISTÁN
  'Daler Kuzyaev (Uzbekistán)',
  'Oston Urunov (Uzbekistán)',

  // IRAK
  'Amjed Rezzek (Irak)',
  'Ali Adnan (Irak)',

  // JORDANIA
  'Yazan Al-Naimat (Jordania)',
  'Amin Al-Dabbas (Jordania)',

  // ARABIA SAUDITA
  'Salem Al-Dawsari (Arabia Saudita)',
  'Ali Al-Bulayhi (Arabia Saudita)',

  // EMIRATOS ÁRABES
  'Ali Mabkhout (Emiratos Árabes)',
  'Harib Al-Maafkali (Emiratos Árabes)',

  // QATAR
  'Almoez Ali (Qatar)',
  'Akram Afif (Qatar)',

  // NUEVA ZELANDA
  'Chris Wood (Nueva Zelanda)',
  'Rory Fallon (Nueva Zelanda)',

  // CURAZAO
  'Juninho Bacuna (Curazao)',
  'Chadli Leggett (Curazao)',

  // CABO VERDE
  'Yan Couto (Cabo Verde)',
  'Romeesh Ivey (Cabo Verde)',

  // HAITÍ
  'Jhon Duran (Haití)',
  'Garry Guerrier (Haití)',
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
    scoring: 'Sumás 500 puntos por cada finalista acertado. Sumás 500 si acertás el resultado. Sumás 2500 si acertás el campeón. Es indistinto poner 2 a 0 o 0 a 2.',
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
