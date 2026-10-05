export interface EncartaArticle {
  id: string;
  titleFr: string;
  titleEn: string;
  category: "espace" | "animaux" | "histoire" | "corps" | "sciences" | "alphabet" | "chiffres";
  categoryLabelFr: string;
  categoryLabelEn: string;
  icon: string;
  headerColor: string;
  summaryFr: string;
  summaryEn: string;
  fantiExplanationFr: string;
  fantiExplanationEn: string;
  fullContentFr: string[];
  fullContentEn: string[];
  keyStats: { labelFr: string; labelEn: string; valueFr: string; valueEn: string }[];
  didYouKnowFr: string;
  didYouKnowEn: string;
  quizQuestion: {
    questionFr: string;
    questionEn: string;
    optionsFr: string[];
    optionsEn: string[];
    correctIndex: number;
    explanationFr: string;
    explanationEn: string;
  };
}

export const ENCARTA_CATEGORIES = [
  { id: "all", labelFr: "Tout explorer 🌟", labelEn: "Explore All 🌟", icon: "📚", color: "from-purple-500 to-indigo-600" },
  { id: "espace", labelFr: "Espace & Étoiles 🚀", labelEn: "Space & Stars 🚀", icon: "🪐", color: "from-blue-500 to-cyan-600" },
  { id: "animaux", labelFr: "Dinosaures & Océans 🦖", labelEn: "Dinosaurs & Oceans 🦖", icon: "🦈", color: "from-emerald-500 to-teal-600" },
  { id: "histoire", labelFr: "Histoire & Pyramides 🏰", labelEn: "History & Pyramids 🏰", icon: "🛕", color: "from-amber-500 to-orange-600" },
  { id: "corps", labelFr: "Corps & Cerveau 🧬", labelEn: "Body & Brain 🧬", icon: "❤️", color: "from-rose-500 to-pink-600" },
  { id: "sciences", labelFr: "Sciences & Invention 🔬", labelEn: "Science & Inventions 🔬", icon: "🎨", color: "from-violet-500 to-purple-600" },
  { id: "alphabet", labelFr: "Alphabet 🔤", labelEn: "Alphabet 🔤", icon: "🔤", color: "from-sky-500 to-blue-600" },
  { id: "chiffres", labelFr: "Chiffres 🔢", labelEn: "Numbers 🔢", icon: "🔢", color: "from-emerald-600 to-teal-700" },
];

export const ENCARTA_ARTICLES: EncartaArticle[] = [
  // --- ESPACE ---
  {
    id: "systme_solaire",
    titleFr: "Le Système Solaire",
    titleEn: "The Solar System",
    category: "espace",
    categoryLabelFr: "Espace & Astronomie",
    categoryLabelEn: "Space & Astronomy",
    icon: "🪐",
    headerColor: "from-indigo-600 via-blue-600 to-cyan-500",
    summaryFr: "Notre Système Solaire est composé du Soleil et de 8 planètes fascinantes qui tournent autour !",
    summaryEn: "Our Solar System consists of the Sun and 8 fascinating planets orbiting around it!",
    fantiExplanationFr: "Coucou ! C'est Fanti ! Imagine que le Soleil est un géant boulet de feu et que 8 balles de toutes les couleurs dansent autour de lui !",
    fantiExplanationEn: "Hi there! It's Fanti! Imagine the Sun is a giant fireball and 8 colorful balls are dancing around it!",
    fullContentFr: [
      "Au centre du Système Solaire se trouve le Soleil, une immense boule de feu et de gaz qui chauffe toute notre galaxie.",
      "Il y a 8 planètes : Mercure, Vénus, la Terre, Mars, Jupiter, Saturne, Uranus et Neptune.",
      "La Terre est la seule planète connue où poussent des plantes, coulent des océans et vivent des êtres vivants !"
    ],
    fullContentEn: [
      "At the center of the Solar System is the Sun, a huge ball of fire and gas that warms our galaxy.",
      "There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.",
      "Earth is the only known planet where plants grow, oceans flow, and living beings live!"
    ],
    keyStats: [
      { labelFr: "Nombre de planètes", labelEn: "Number of planets", valueFr: "8 planètes", valueEn: "8 planets" },
      { labelFr: "Étoile centrale", labelEn: "Central star", valueFr: "Le Soleil ☀️", valueEn: "The Sun ☀️" },
      { labelFr: "Âge estimé", labelEn: "Estimated age", valueFr: "4,6 milliards d'années", valueEn: "4.6 billion years" }
    ],
    didYouKnowFr: "Jupiter est tellement gigantesque que toutes les autres planètes réunies pourraient rentrer à l'intérieur !",
    didYouKnowEn: "Jupiter is so giant that all other planets combined could fit inside it!",
    quizQuestion: {
      questionFr: "Quelle est la planète sur laquelle nous vivons ?",
      questionEn: "Which planet do we live on?",
      optionsFr: ["Mars 🔴", "La Terre 🌍", "Jupiter 🪐", "Vénus ✨"],
      optionsEn: ["Mars 🔴", "Earth 🌍", "Jupiter 🪐", "Venus ✨"],
      correctIndex: 1,
      explanationFr: "Bravo ! Nous vivons sur la planète Terre, la magnifique planète bleue !",
      explanationEn: "Well done! We live on Planet Earth, the beautiful blue planet!"
    }
  },
  {
    id: "la_lune",
    titleFr: "La Lune & la Nuit",
    titleEn: "The Moon & Night",
    category: "espace",
    categoryLabelFr: "Espace & Astronomie",
    categoryLabelEn: "Space & Astronomy",
    icon: "🌕",
    headerColor: "from-slate-800 via-indigo-900 to-purple-800",
    summaryFr: "La Lune est le seul satellite naturel de la Terre. Elle éclaire nos nuits et fait bouger les marées !",
    summaryEn: "The Moon is Earth's only natural satellite. It lights up our nights and controls ocean tides!",
    fantiExplanationFr: "Regarde le ciel la nuit ! La Lune est la grande copine de la Terre. Elle met un grand manteau de lumière argentée sur nos nuits !",
    fantiExplanationEn: "Look at the night sky! The Moon is Earth's best friend. She puts a silver light blanket over our nights!",
    fullContentFr: [
      "La Lune ne produit pas sa propre lumière : elle reflète la lumière du Soleil comme un grand miroir dans le ciel.",
      "En 1969, l'astronaute Neil Armstrong a été le tout premier être humain à poser le pied sur la Lune !",
      "Comme il n'y a pas de vent sur la Lune, les empreintes de pas des astronautes y sont encore gravées !"
    ],
    fullContentEn: [
      "The Moon does not make its own light: it reflects light from the Sun like a giant mirror in the sky.",
      "In 1969, astronaut Neil Armstrong became the very first human to step on the Moon!",
      "Because there is no wind on the Moon, astronaut footprints are still preserved there today!"
    ],
    keyStats: [
      { labelFr: "Distance de la Terre", labelEn: "Distance from Earth", valueFr: "384 400 km", valueEn: "384,400 km" },
      { labelFr: "Premier homme", labelEn: "First man", valueFr: "Neil Armstrong (1969)", valueEn: "Neil Armstrong (1969)" },
      { labelFr: "Tour complet", labelEn: "Full orbit", valueFr: "27 jours", valueEn: "27 days" }
    ],
    didYouKnowFr: "Sur la Lune, le ciel est toujours noir, même en plein jour, car il n'y a pas d'atmosphère !",
    didYouKnowEn: "On the Moon, the sky is always black, even during daytime, because there is no atmosphere!",
    quizQuestion: {
      questionFr: "En quelle année l'Homme a-t-il marché sur la Lune pour la première fois ?",
      questionEn: "In what year did humans first walk on the Moon?",
      optionsFr: ["1920", "1969 🚀", "2000", "2020"],
      optionsEn: ["1920", "1969 🚀", "2000", "2020"],
      correctIndex: 1,
      explanationFr: "Exactement ! En 1969, lors de la mission Apollo 11 !",
      explanationEn: "Exactly! In 1969 during the Apollo 11 mission!"
    }
  },
  {
    id: "etoiles_galaxie",
    titleFr: "Les Étoiles & la Voie Lactée",
    titleEn: "Stars & The Milky Way",
    category: "espace",
    categoryLabelFr: "Espace & Cosmodrome",
    categoryLabelEn: "Space & Cosmos",
    icon: "🌌",
    headerColor: "from-purple-900 via-indigo-900 to-black",
    summaryFr: "Les étoiles sont d'immenses soleils très lointains regroupés dans notre galaxie géante !",
    summaryEn: "Stars are huge distant suns grouped together in our giant galaxy!",
    fantiExplanationFr: "Quand tu lèves les yeux vers les étoiles, tu contemples des milliards de soleils magiques qui étincellent !",
    fantiExplanationEn: "When you look up at the stars, you are gazing at billions of magical suns sparkling!",
    fullContentFr: [
      "La Voie Lactée est la galaxie dans laquelle nous vivons. Elle contient plus de 100 milliards d'étoiles !",
      "Les constellations sont des groupes d'étoiles qui forment des dessins dans le ciel, comme la Grande Ourse.",
      "L'étoile la plus proche de la Terre est notre Soleil !"
    ],
    fullContentEn: [
      "The Milky Way is the galaxy we live in. It contains over 100 billion stars!",
      "Constellations are star groups forming shapes in the sky, like the Big Dipper.",
      "The closest star to Earth is our Sun!"
    ],
    keyStats: [
      { labelFr: "Étoiles dans la galaxie", labelEn: "Stars in galaxy", valueFr: "+100 milliards ✨", valueEn: "+100 billion ✨" },
      { labelFr: "Galaxie voisine", labelEn: "Neighbor galaxy", valueFr: "Andromède 🌀", valueEn: "Andromeda 🌀" },
      { labelFr: "Étoile du Nord", labelEn: "North Star", valueFr: "L'Étoile Polaire ⭐️", valueEn: "Polaris ⭐️" }
    ],
    didYouKnowFr: "Une étoile filante n'est pas une vraie étoile mais un petit grain de poussière spatiale qui brûle très vite dans l'air !",
    didYouKnowEn: "A shooting star is actually a tiny speck of space dust burning super fast in the air!",
    quizQuestion: {
      questionFr: "Comment s'appelle notre galaxie géante ?",
      questionEn: "What is our giant galaxy called?",
      optionsFr: ["La Voie Lactée 🌌", "La Galaxie Rose", "Le Ciel Magique", "Le Soleil"],
      optionsEn: ["The Milky Way 🌌", "Pink Galaxy", "Magic Sky", "The Sun"],
      correctIndex: 0,
      explanationFr: "Bravo ! Notre galaxie s'appelle la Voie Lactée !",
      explanationEn: "Well done! Our galaxy is called the Milky Way!"
    }
  },

  // --- DINOSAURES & OCÉANS (ANIMAUX) ---
  {
    id: "tyrannosaure",
    titleFr: "Le T-Rex (Tyrannosaure)",
    titleEn: "The T-Rex (Tyrannosaurus)",
    category: "animaux",
    categoryLabelFr: "Dinosaures & Préhistoire",
    categoryLabelEn: "Dinosaurs & Prehistory",
    icon: "🦖",
    headerColor: "from-emerald-700 via-green-700 to-amber-800",
    summaryFr: "Le Tyrannosaurus Rex était l'un des plus redoutables dinosaures carnivores de la Terre !",
    summaryEn: "Tyrannosaurus Rex was one of the most formidable meat-eating dinosaurs on Earth!",
    fantiExplanationFr: "Grr ! Le T-Rex avait des dents longues comme des grosses bananes ! Mais ne t'inquiète pas, il vivait il y a très longtemps !",
    fantiExplanationEn: "Roar! T-Rex had teeth as long as big bananas! But don't worry, he lived a super long time ago!",
    fullContentFr: [
      "Le T-Rex vivait il y a environ 68 millions d'années pendant la période du Crétacé.",
      "Ses dents mesuraient plus de 20 centimètres, soit la taille d'une grande banane !",
      "Même si ses bras étaient tout petits, ses mâchoires étaient d'une puissance colossale !"
    ],
    fullContentEn: [
      "T-Rex lived about 68 million years ago during the Cretaceous period.",
      "Its teeth were over 20 centimeters long, as big as a large banana!",
      "Even though its arms were tiny, its jaw strength was colossal!"
    ],
    keyStats: [
      { labelFr: "Époque", labelEn: "Era", valueFr: "Il y a 68 millions d'années", valueEn: "68 million years ago" },
      { labelFr: "Taille des dents", labelEn: "Tooth size", valueFr: "20 cm (banane) 🍌", valueEn: "20 cm (banana) 🍌" },
      { labelFr: "Régime alimentaire", labelEn: "Diet", valueFr: "Carnivore (viande) 🥩", valueEn: "Carnivore (meat) 🥩" }
    ],
    didYouKnowFr: "Une seule morsure de T-Rex pouvait exercer une pression de plus de 3 tonnes !",
    didYouKnowEn: "A single T-Rex bite could deliver over 3 tons of pressure!",
    quizQuestion: {
      questionFr: "De quelle taille étaient les dents du redoutable T-Rex ?",
      questionEn: "How big were the teeth of the mighty T-Rex?",
      optionsFr: ["1 cm", "5 cm", "20 cm 🍌", "1 mètre"],
      optionsEn: ["1 cm", "5 cm", "20 cm 🍌", "1 meter"],
      correctIndex: 2,
      explanationFr: "Génial ! 20 cm, grandes comme de grosses bananes !",
      explanationEn: "Awesome! 20 cm, as big as large bananas!"
    }
  },
  {
    id: "triceratops",
    titleFr: "Le Tricératops à Cornes",
    titleEn: "The Three-Horned Triceratops",
    category: "animaux",
    categoryLabelFr: "Dinosaures & Herbivores",
    categoryLabelEn: "Dinosaurs & Herbivores",
    icon: "🦕",
    headerColor: "from-lime-700 via-emerald-800 to-amber-900",
    summaryFr: "Le Tricératops possédait 3 cornes impressionnantes et une grande collerette en os pour se protéger !",
    summaryEn: "Triceratops had 3 impressive horns and a big bony collar to defend itself!",
    fantiExplanationFr: "Le Tricératops est mon dinosaure préféré ! Il mangeait gentiment de l'herbe et des plantes avec son bec rigolo !",
    fantiExplanationEn: "Triceratops is my favorite dino! He gently munched on grass and plants with his funny beak!",
    fullContentFr: [
      "Tricératops signifie 'visage à trois cornes'. Ses cornes lui servaient à repousser les prédateurs comme le T-Rex.",
      "Même s'il pesait plus de 6 tonnes, c'était un herbivore pacifique qui se nourrissait de feuilles et de fougères.",
      "Sa collerette protectrice en os mesurait plus d'un mètre de large !"
    ],
    fullContentEn: [
      "Triceratops means 'three-horned face'. Its horns helped ward off predators like T-Rex.",
      "Even though it weighed over 6 tons, it was a peaceful herbivore eating leaves and ferns.",
      "Its protective bony frill was over a meter wide!"
    ],
    keyStats: [
      { labelFr: "Nombre de cornes", labelEn: "Number of horns", valueFr: "3 cornes 🛡️", valueEn: "3 horns 🛡️" },
      { labelFr: "Régime alimentaire", labelEn: "Diet", valueFr: "Herbivore (plantes) 🌿", valueEn: "Herbivore (plants) 🌿" },
      { labelFr: "Poids", labelEn: "Weight", valueFr: "6 tonnes", valueEn: "6 tons" }
    ],
    didYouKnowFr: "Le Tricératops avait jusqu'à 800 dents de rechange qui repoussaient continuellement !",
    didYouKnowEn: "Triceratops had up to 800 replacement teeth that grew back constantly!",
    quizQuestion: {
      questionFr: "Que mangeait le gentil Tricératops ?",
      questionEn: "What did the peaceful Triceratops eat?",
      optionsFr: ["De la viande", "Des plantes & feuilles 🌿", "Des poissons", "Des insectes"],
      optionsEn: ["Meat", "Plants & leaves 🌿", "Fish", "Insects"],
      correctIndex: 1,
      explanationFr: "Super ! C'était un herbivore qui adorait manger des feuilles !",
      explanationEn: "Super! He was a herbivore who loved munching leaves!"
    }
  },
  {
    id: "oceans_recif",
    titleFr: "Le Récif de Corail & l'Océan",
    titleEn: "Coral Reefs & The Ocean",
    category: "animaux",
    categoryLabelFr: "Océans & Vie Marine",
    categoryLabelEn: "Oceans & Marine Life",
    icon: "🪸",
    headerColor: "from-cyan-600 via-blue-600 to-teal-500",
    summaryFr: "Les récifs de corail sont de grands jardins multicolores sous la mer abritant des milliers de poissons !",
    summaryEn: "Coral reefs are colorful underwater gardens hosting thousands of sea creatures!",
    fantiExplanationFr: "Plonge avec moi sous l'eau ! Les coraux sont des cités magiques multicolores où vivent les poissons-clowns !",
    fantiExplanationEn: "Dive underwater with me! Coral reefs are magical colorful cities where clownfish live!",
    fullContentFr: [
      "Les coraux ne sont pas des pierres mais de petits animaux marins qui construisent d'immenses structures.",
      "La Grande Barrière de Corail en Australie est si grande qu'on peut la voir depuis l'Espace !",
      "Les récifs abritent 25% de toute la vie marine de notre planète."
    ],
    fullContentEn: [
      "Corals are not rocks but tiny sea animals building giant underwater structures.",
      "The Great Barrier Reef in Australia is so huge it can be seen from Space!",
      "Reefs host 25% of all marine life on our planet."
    ],
    keyStats: [
      { labelFr: "Habitants", labelEn: "Inhabitants", valueFr: "Poisson-clown, tortue, raie 🐠", valueEn: "Clownfish, turtle, ray 🐠" },
      { labelFr: "Plus grand récif", labelEn: "Largest reef", valueFr: "Grande Barrière 🇦🇺", valueEn: "Great Barrier 🇦🇺" },
      { labelFr: "Couleurs", labelEn: "Colors", valueFr: "Rose, bleu, jaune, vert 🎨", valueEn: "Pink, blue, yellow, green 🎨" }
    ],
    didYouKnowFr: "Le poisson-clown peut vivre en toute sécurité au milieu des tentacules piquants de l'anémone de mer !",
    didYouKnowEn: "Clownfish can safely live right inside stingy sea anemone tentacles!",
    quizQuestion: {
      questionFr: "Où vit le célèbre petit poisson-clown ?",
      questionEn: "Where does the famous clownfish live?",
      optionsFr: ["Dans la jungle", "Dans les coraux & anémones 🪸", "Dans un arbre", "Dans le désert"],
      optionsEn: ["In the jungle", "In corals & anemones 🪸", "In a tree", "In the desert"],
      correctIndex: 1,
      explanationFr: "Bravo ! Le poisson-clown vit dans les magnifiques coraux !",
      explanationEn: "Well done! The clownfish lives inside beautiful corals!"
    }
  },
  {
    id: "baleine_bleue",
    titleFr: "La Baleine Bleue",
    titleEn: "The Blue Whale",
    category: "animaux",
    categoryLabelFr: "Océans & Géants",
    categoryLabelEn: "Oceans & Giants",
    icon: "🐋",
    headerColor: "from-blue-600 via-cyan-600 to-teal-500",
    summaryFr: "La baleine bleue est le plus grand animal qui ait JAMAIS existé sur la planète Terre !",
    summaryEn: "The blue whale is the largest animal ever known to have lived on Planet Earth!",
    fantiExplanationFr: "Ouah ! La baleine bleue est plus grande que 3 grands bus alignés ! C'est le roi géant des océans !",
    fantiExplanationEn: "Wow! The blue whale is bigger than 3 big buses lined up! It's the giant king of the oceans!",
    fullContentFr: [
      "La baleine bleue est plus grande que tous les dinosaures réuni : elle peut mesurer 30 mètres de long !",
      "Son cœur est gros comme une petite voiture et sa langue pèse autant qu'un éléphant entier.",
      "Pourtant, elle se nourrit presque uniquement de minuscules crevettes appelées krill !"
    ],
    fullContentEn: [
      "The blue whale is larger than any dinosaur ever: reaching up to 30 meters long!",
      "Its heart is as big as a small car and its tongue weighs as much as an entire elephant.",
      "Yet it eats almost exclusively tiny shrimp-like creatures called krill!"
    ],
    keyStats: [
      { labelFr: "Longueur maximale", labelEn: "Max length", valueFr: "30 mètres 📏", valueEn: "30 meters 📏" },
      { labelFr: "Poids impressionnant", labelEn: "Heavy weight", valueFr: "180 tonnes ⚖️", valueEn: "180 tons ⚖️" },
      { labelFr: "Nourriture favorite", labelEn: "Favorite food", valueFr: "Le Krill 🦐", valueEn: "Krill 🦐" }
    ],
    didYouKnowFr: "Le chant d'une baleine bleue est si puissant qu'il peut s'entendre sous l'eau à plus de 800 kilomètres !",
    didYouKnowEn: "A blue whale's song is so loud it can be heard underwater over 800 kilometers away!",
    quizQuestion: {
      questionFr: "Combien mesure une grande baleine bleue environ ?",
      questionEn: "How long is a large blue whale approximately?",
      optionsFr: ["5 mètres", "15 mètres", "30 mètres 📏", "100 mètres"],
      optionsEn: ["5 meters", "15 meters", "30 meters 📏", "100 meters"],
      correctIndex: 2,
      explanationFr: "Magnifique ! 30 mètres, c'est aussi long que 3 grands bus alignés !",
      explanationEn: "Wonderful! 30 meters is as long as 3 big buses lined up!"
    }
  },
  {
    id: "cameleon",
    titleFr: "Le Caméléon Magique",
    titleEn: "The Magic Chameleon",
    category: "animaux",
    categoryLabelFr: "Reptiles & Nature",
    categoryLabelEn: "Reptiles & Nature",
    icon: "🦎",
    headerColor: "from-teal-600 via-emerald-600 to-lime-600",
    summaryFr: "Le caméléon est un reptile incroyable capable de changer de couleur et de bouger ses yeux séparément !",
    summaryEn: "The chameleon is an incredible reptile capable of changing color and moving its eyes separately!",
    fantiExplanationFr: "Regarde bien : hop ! Le caméléon devient vert, puis rose, puis jaune ! C'est le champion du camouflage !",
    fantiExplanationEn: "Look closely: pop! The chameleon turns green, then pink, then yellow! He's the camouflage champion!",
    fullContentFr: [
      "Les caméléons changent de couleur pour communiquer leurs émotions, réguler leur température ou se camoufler.",
      "Leur langue est catapultée super vite pour attraper des insectes à plus d'un mètre de distance !",
      "Chacun de leurs yeux peut regarder dans une direction différente en même temps !"
    ],
    fullContentEn: [
      "Chameleons change color to communicate emotions, regulate temperature, or camouflage.",
      "Their tongue shoots out super fast like a catapult to catch insects over a meter away!",
      "Each of their eyes can look in a different direction at the exact same time!"
    ],
    keyStats: [
      { labelFr: "Super Pouvoir", labelEn: "Super Power", valueFr: "Changement de couleur 🎨", valueEn: "Color changing 🎨" },
      { labelFr: "Portée de la langue", labelEn: "Tongue reach", valueFr: "2 fois sa longueur", valueEn: "2 times its body length" },
      { labelFr: "Vision", labelEn: "Vision", valueFr: "360 degrés 👁️", valueEn: "360 degrees 👁️" }
    ],
    didYouKnowFr: "La langue d'un caméléon se déploie en seulement un dixième de seconde, plus vite qu'un clignement d'œil !",
    didYouKnowEn: "A chameleon's tongue shoots out in just a tenth of a second, faster than a blink!",
    quizQuestion: {
      questionFr: "Que fait le caméléon avec ses yeux de façon extraordinaire ?",
      questionEn: "What extraordinary thing can a chameleon do with its eyes?",
      optionsFr: [
        "Ils brillent dans le noir",
        "Ils regardent dans deux directions différentes 👁️",
        "Ils changent de forme",
        "Ils se ferment tout seuls"
      ],
      optionsEn: [
        "They glow in the dark",
        "They look in two different directions 👁️",
        "They change shape",
        "They close automatically"
      ],
      correctIndex: 1,
      explanationFr: "Bravo ! Le caméléon surveille son environnement à 360° grâce à ses yeux indépendants !",
      explanationEn: "Well done! The chameleon scans 360° around thanks to its independent eyes!"
    }
  },

  // --- HISTOIRE ---
  {
    id: "egypte_pharaons",
    titleFr: "L'Égypte des Pharaons",
    titleEn: "Egypt of Pharoahs",
    category: "histoire",
    categoryLabelFr: "Histoire Ancienne",
    categoryLabelEn: "Ancient History",
    icon: "🛕",
    headerColor: "from-amber-600 via-yellow-600 to-orange-600",
    summaryFr: "Découvre les pyramides géantes, les momies mystérieuses et l'écriture sacrée des Hiéroglyphes !",
    summaryEn: "Discover giant pyramids, mysterious mummies, and the sacred writing of Hieroglyphs!",
    fantiExplanationFr: "Les pharaons construisaient des pyramides géantes en pierre dans le désert ! Et leurs mots étaient de jolis petits dessins !",
    fantiExplanationEn: "Pharaohs built giant stone pyramids in the desert! And their words were lovely little pictures!",
    fullContentFr: [
      "Il y a plus de 4 000 ans, les Pharaons étaient les rois et reines tout-puissants de l'Égypte Antique.",
      "Ils ont construit la Grande Pyramide de Khéops avec des blocs de pierre pesant chacun plus de 2 tonnes !",
      "Pour écrire, les Égyptiens utilisaient des dessins appelés hiéroglyphes."
    ],
    fullContentEn: [
      "Over 4,000 years ago, Pharaohs were the powerful kings and queens of Ancient Egypt.",
      "They built the Great Pyramid of Giza using giant stone blocks weighing over 2 tons each!",
      "To write, Egyptians used sacred picture symbols called hieroglyphs."
    ],
    keyStats: [
      { labelFr: "Lieu célèbre", labelEn: "Famous location", valueFr: "Pyramides de Gizeh 📐", valueEn: "Pyramids of Giza 📐" },
      { labelFr: "Fleuve sacré", labelEn: "Sacred river", valueFr: "Le Nil 🌊", valueEn: "The Nile 🌊" },
      { labelFr: "Écriture", labelEn: "Writing", valueFr: "Hiéroglyphes 𓀀", valueEn: "Hieroglyphs 𓀀" }
    ],
    didYouKnowFr: "Les Égyptiens vénéraient les chats qu'ils considéraient comme des animaux sacrés porte-bonheur !",
    didYouKnowEn: "Ancient Egyptians worshipped cats and considered them sacred, lucky animals!",
    quizQuestion: {
      questionFr: "Comment s'appelait l'écriture dessinée des anciens Égyptiens ?",
      questionEn: "What was the picture writing of ancient Egyptians called?",
      optionsFr: ["Les Alphabets", "Les Hiéroglyphes 𓀀", "Les Chiffres", "Les Calligraphies"],
      optionsEn: ["Alphabets", "Hieroglyphs 𓀀", "Numbers", "Calligraphy"],
      correctIndex: 1,
      explanationFr: "Exact ! Les hiéroglyphes sont de magnifiques symboles dessinés !",
      explanationEn: "Correct! Hieroglyphs are beautiful drawn symbols!"
    }
  },
  {
    id: "chevaliers_chateaux",
    titleFr: "Chevaliers & Châteaux Forts",
    titleEn: "Knights & Castles",
    category: "histoire",
    categoryLabelFr: "Moyen-Âge",
    categoryLabelEn: "Middle Ages",
    icon: "🏰",
    headerColor: "from-slate-700 via-zinc-800 to-amber-900",
    summaryFr: "Plonge au Moyen-Âge avec les vaillants chevaliers en armure et les grands châteaux à pont-levis !",
    summaryEn: "Dive into the Middle Ages with brave knights in armor and giant castles with drawbridges!",
    fantiExplanationFr: "Tring, tring ! Les chevaliers portaient des armures de fer toutes brillantes et gardaient le pont-levis du château !",
    fantiExplanationEn: "Clang, clang! Knights wore shiny iron armor and guarded the castle drawbridge!",
    fullContentFr: [
      "Au Moyen-Âge, les châteaux forts étaient construits en pierre avec de hauts remparts pour protéger le roi et les habitants.",
      "Pour entrer dans le château, il fallait traverser le pont-levis au-dessus des douves remplies d'eau.",
      "Les chevaliers portaient une lourde armure en fer et s'entraînaient lors de grands tournois de joute."
    ],
    fullContentEn: [
      "In the Middle Ages, castles were built of stone with high walls to protect the king and townspeople.",
      "To enter the castle, one had to cross the drawbridge over water-filled moats.",
      "Knights wore heavy iron armor and trained during grand jousting tournaments."
    ],
    keyStats: [
      { labelFr: "Époque", labelEn: "Period", valueFr: "Moyen-Âge (V-XVème siècle)", valueEn: "Middle Ages (5th-15th century)" },
      { labelFr: "Protection", labelEn: "Protection", valueFr: "Armure & Pont-levis 🛡️", valueEn: "Armor & Drawbridge 🛡️" },
      { labelFr: "Événement", labelEn: "Event", valueFr: "Tournois de joutes ⚔️", valueEn: "Jousting tournaments ⚔️" }
    ],
    didYouKnowFr: "Une armure complète de chevalier pouvait peser jusqu'à 25 kilos !",
    didYouKnowEn: "A complete knight's suit of armor could weigh up to 25 kilograms!",
    quizQuestion: {
      questionFr: "Comment s'appelle le pont mobile qui permettait d'entrer dans un château fort ?",
      questionEn: "What is the moveable bridge called that allowed entry into a castle?",
      optionsFr: ["Le pont suspendu", "Le pont-levis 🏰", "Le viaduc", "Le tunnel"],
      optionsEn: ["Suspension bridge", "Drawbridge 🏰", "Viaduct", "Tunnel"],
      correctIndex: 1,
      explanationFr: "Super ! Le pont-levis pouvait se relever avec de grosses chaînes pour fermer la porte !",
      explanationEn: "Super! The drawbridge could be raised with heavy chains to seal the entrance!"
    }
  },

  // --- CORPS HUMAIN ---
  {
    id: "le_coeur",
    titleFr: "Le Cœur & le Sang",
    titleEn: "The Heart & Blood",
    category: "corps",
    categoryLabelFr: "Anatomie Humaine",
    categoryLabelEn: "Human Anatomy",
    icon: "❤️",
    headerColor: "from-rose-600 via-red-600 to-pink-600",
    summaryFr: "Le cœur est un muscle infatigable qui bat plus de 100 000 fois par jour pour faire circuler le sang !",
    summaryEn: "The heart is a tireless muscle that beats over 100,000 times a day to pump blood throughout your body!",
    fantiExplanationFr: "Poum poum ! Écoute ton cœur : c'est un petit moteur magique dans ta poitrine qui bat toute la journée !",
    fantiExplanationEn: "Thump thump! Listen to your heart: it's a magical little engine inside your chest beating all day!",
    fullContentFr: [
      "Ton cœur est situé au centre de ta poitrine, légèrement sur la gauche, et a environ la taille de ton poing fermé.",
      "En pompant le sang dans tes artères et tes veines, il apporte de l'oxygène et de l'énergie à tout ton corps.",
      "Quand tu cours ou joues, ton cœur bat plus vite pour donner plus d'énergie à tes muscles !"
    ],
    fullContentEn: [
      "Your heart is located in the center of your chest, slightly to the left, and is about the size of your closed fist.",
      "By pumping blood through arteries and veins, it delivers oxygen and energy to your whole body.",
      "When you run or play, your heart beats faster to deliver extra energy to your muscles!"
    ],
    keyStats: [
      { labelFr: "Battements par jour", labelEn: "Beats per day", valueFr: "100 000 battements ❤️", valueEn: "100,000 beats ❤️" },
      { labelFr: "Taille moyenne", labelEn: "Average size", valueFr: "Comme ton poing ✊", valueEn: "Like your fist ✊" },
      { labelFr: "Rôle principal", labelEn: "Main role", valueFr: "Pomper l'oxygène 🩸", valueEn: "Pump oxygen 🩸" }
    ],
    didYouKnowFr: "Si on bout à bout toutes les artères et veines d'un corps humain, elles feraient 100 000 km, soit 2,5 fois le tour de la Terre !",
    didYouKnowEn: "Lined up end-to-end, all blood vessels in a human body would measure 100,000 km, wrapping 2.5 times around Earth!",
    quizQuestion: {
      questionFr: "De quelle taille est environ ton cœur ?",
      questionEn: "How big is your heart approximately?",
      optionsFr: ["Comme une pomme", "Comme ton poing fermé ✊", "Comme un ballon", "Comme une noisette"],
      optionsEn: ["Like an apple", "Like your closed fist ✊", "Like a ball", "Like a hazelnut"],
      correctIndex: 1,
      explanationFr: "Bravo ! Ferme ton poing : ton cœur a exactement cette taille là !",
      explanationEn: "Well done! Close your fist: your heart is right about that size!"
    }
  },
  {
    id: "le_cerveau",
    titleFr: "Le Cerveau & les 5 Sens",
    titleEn: "The Brain & 5 Senses",
    category: "corps",
    categoryLabelFr: "Anatomie & Pensée",
    categoryLabelEn: "Anatomy & Mind",
    icon: "🧠",
    headerColor: "from-purple-600 via-indigo-600 to-pink-500",
    summaryFr: "Le cerveau est le super-ordinateur de ton corps : il contrôle tes pensées, tes rêves et tes 5 sens !",
    summaryEn: "The brain is your body's supercomputer: controlling your thoughts, dreams, and 5 senses!",
    fantiExplanationFr: "Ton cerveau est une boîte à super-pouvoirs ! Il te permet de penser, d'inventer des histoires et de rêver la nuit !",
    fantiExplanationEn: "Your brain is a superpower box! It lets you think, invent stories, and dream at night!",
    fullContentFr: [
      "Grâce à tes 5 sens (la vue, l'ouïe, le toucher, le goût et l'odorat), ton cerveau reçoit plein d'informations sur le monde.",
      "Pendant que tu dors, ton cerveau travaille encore pour classer tes souvenirs et te faire rêver !",
      "Chaque fois que tu apprends quelque chose de nouveau, ton cerveau crée de nouvelles connexions magiques !"
    ],
    fullContentEn: [
      "Thanks to your 5 senses (sight, hearing, touch, taste, and smell), your brain receives information about the world.",
      "While you sleep, your brain is still active organizing memories and creating dreams!",
      "Every time you learn something new, your brain builds magical new connections!"
    ],
    keyStats: [
      { labelFr: "Nombre de neurones", labelEn: "Number of neurons", valueFr: "86 milliards ⚡", valueEn: "86 billion ⚡" },
      { labelFr: "Les 5 Sens", labelEn: "The 5 Senses", valueFr: "Vue, Ouïe, Toucher, Goût, Odorat", valueEn: "Sight, Hearing, Touch, Taste, Smell" },
      { labelFr: "Poids moyen", labelEn: "Average weight", valueFr: "1,4 kg ⚖️", valueEn: "1.4 kg ⚖️" }
    ],
    didYouKnowFr: "Ton cerveau produit assez d'électricité en une journée pour allumer une petite ampoule LED !",
    didYouKnowEn: "Your brain generates enough electrical power in a day to light a small LED bulb!",
    quizQuestion: {
      questionFr: "Combien de sens principaux possède le corps humain ?",
      questionEn: "How many main senses does the human body have?",
      optionsFr: ["3 sens", "5 sens 👁️👂🖐️👅👃", "10 sens", "20 sens"],
      optionsEn: ["3 senses", "5 senses 👁️👂🖐️👅👃", "10 senses", "20 senses"],
      correctIndex: 1,
      explanationFr: "Génial ! La Vue, l'Ouïe, le Toucher, le Goût et l'Odorat !",
      explanationEn: "Awesome! Sight, Hearing, Touch, Taste, and Smell!"
    }
  },

  // --- SCIENCES ---
  {
    id: "tour_eiffel",
    titleFr: "La Tour Eiffel",
    titleEn: "The Eiffel Tower",
    category: "sciences",
    categoryLabelFr: "Monuments & Architecture",
    categoryLabelEn: "Monuments & Architecture",
    icon: "🗼",
    headerColor: "from-indigo-600 via-sky-600 to-blue-500",
    summaryFr: "Construite en fer par Gustave Eiffel à Paris, la Tour Eiffel est le monument le plus célèbre de France !",
    summaryEn: "Built of iron by Gustave Eiffel in Paris, the Eiffel Tower is France's most famous landmark!",
    fantiExplanationFr: "La Tour Eiffel est une très grande dame de fer à Paris ! Elle brille comme des mille étoiles quand la nuit tombe !",
    fantiExplanationEn: "The Eiffel Tower is a tall iron lady in Paris! She sparkles like a thousand stars when night falls!",
    fullContentFr: [
      "La Tour Eiffel a été inaugurée en 1889 pour la grande Exposition Universelle de Paris.",
      "Elle mesure 330 mètres de haut et est composée de plus de 18 000 pièces en fer reliées par des rivets.",
      "La nuit, elle s'illumine de milliers d'étoiles scintillantes toutes les heures !"
    ],
    fullContentEn: [
      "The Eiffel Tower opened in 1889 for the Paris World Fair.",
      "It stands 330 meters tall and is made of over 18,000 iron pieces assembled with rivets.",
      "At night, thousands of sparkling lights illuminate it every hour!"
    ],
    keyStats: [
      { labelFr: "Hauteur", labelEn: "Height", valueFr: "330 mètres 📏", valueEn: "330 meters 📏" },
      { labelFr: "Créateur", labelEn: "Creator", valueFr: "Gustave Eiffel 👨‍🔬", valueEn: "Gustave Eiffel 👨‍🔬" },
      { labelFr: "Inauguration", labelEn: "Opening", valueFr: "31 mars 1889", valueEn: "March 31, 1889" }
    ],
    didYouKnowFr: "En été, sous la chaleur du soleil, le fer de la Tour Eiffel se dilate et elle grandit de presque 15 centimètres !",
    didYouKnowEn: "In summer heat, the iron expands making the Eiffel Tower grow nearly 15 centimeters taller!",
    quizQuestion: {
      questionFr: "En quel matériau est construite la Tour Eiffel ?",
      questionEn: "What material is the Eiffel Tower built from?",
      optionsFr: ["En bois", "En fer ⚙️", "En plastique", "En verre"],
      optionsEn: ["Wood", "Iron ⚙️", "Plastic", "Glass"],
      correctIndex: 1,
      explanationFr: "Magnifique ! Elle est faite d'un fer forgé spécial très résistant !",
      explanationEn: "Wonderful! It is made of a special durable wrought iron!"
    }
  }
];
