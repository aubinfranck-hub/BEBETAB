export interface VideoComprehensionQuestion {
  id: number;
  question: string;
  options: { text: string; emoji: string }[];
  correctIndex: number;
  explanation: string;
  audioHint: string;
}

export const VIDEO_QUIZ_DATABASE: Record<string, VideoComprehensionQuestion[]> = {
  // Mondes des Titounis - Ah les Crocodiles
  v1: [
    {
      id: 1,
      question: "Où s'en vont les crocodiles dans la célèbre chanson ?",
      options: [
        { text: "Au bord du grand Nil", emoji: "🌊" },
        { text: "Sur la planète Mars", emoji: "🚀" },
        { text: "Au supermarché", emoji: "🛒" },
      ],
      correctIndex: 0,
      explanation: "Bravo ! Les crocodiles s'en allaient en guerre au bord du Nil en Afrique !",
      audioHint: "C'est au bord d'un très grand fleuve en Afrique !",
    },
    {
      id: 2,
      question: "De quelle couleur est généralement la peau d'un crocodile ?",
      options: [
        { text: "Verte et écailleuse", emoji: "🐊" },
        { text: "Bleu ciel avec des paillettes", emoji: "✨" },
        { text: "Rose bonbon", emoji: "🍬" },
      ],
      correctIndex: 0,
      explanation: "Super ! Les crocodiles ont une peau verte et marron qui leur permet de se camoufler !",
      audioHint: "C'est la même couleur que l'herbe des marais !",
    },
    {
      id: 3,
      question: "Comment font les crocodiles dans le refrain des Titounis ?",
      options: [
        { text: "Ah les cro-cro-cro, les crocodiles !", emoji: "🎵" },
        { text: "Cot-cot-cot les poulettes !", emoji: "🐔" },
        { text: "Coin-coin les canetons !", emoji: "🦆" },
      ],
      correctIndex: 0,
      explanation: "Trop fort ! Ah les cro-cro-cro, les cro-cro-cro, les crocodiles !",
      audioHint: "Ça commence par le bruit 'cro-cro-cro' !",
    },
  ],

  // Une Souris Verte
  v2: [
    {
      id: 1,
      question: "De quelle couleur est la petite souris qui courait dans l'herbe ?",
      options: [
        { text: "Verte", emoji: "🟢" },
        { text: "Rouge vif", emoji: "🔴" },
        { text: "Violette", emoji: "🟣" },
      ],
      correctIndex: 0,
      explanation: "Exact ! C'est 'Une souris verte qui courait dans l'herbe' !",
      audioHint: "C'est la couleur de la salade et des grenouilles !",
    },
    {
      id: 2,
      question: "Par quoi attrape-t-on la souris dans la chanson ?",
      options: [
        { text: "Par la queue", emoji: "🐭" },
        { text: "Par le chapeau", emoji: "🎩" },
        { text: "Par les lunettes", emoji: "👓" },
      ],
      correctIndex: 0,
      explanation: "Gagné ! 'Je l'attrape par la queue, je la montre à ces messieurs !'",
      audioHint: "C'est la petite partie toute fine derrière son dos !",
    },
    {
      id: 3,
      question: "Dans quoi trempe-t-on la souris pour en faire un escargot tout chaud ?",
      options: [
        { text: "Dans l'huile et dans l'eau", emoji: "🥣" },
        { text: "Dans de la limonade gazeuse", emoji: "🥤" },
        { text: "Dans de la peinture blanche", emoji: "🎨" },
      ],
      correctIndex: 0,
      explanation: "Trop drôle ! 'Trempez-la dans l'huile, trempez-la dans l'eau, ça fera un escargot tout chaud !'",
      audioHint: "C'est avec deux liquides qu'on trouve dans la cuisine !",
    },
  ],

  // L'Alphabet ABC
  v3: [
    {
      id: 1,
      question: "Quelle est la toute première lettre de l'alphabet ?",
      options: [
        { text: "La lettre A", emoji: "🅰️" },
        { text: "La lettre Z", emoji: "💤" },
        { text: "La lettre M", emoji: "Ⓜ️" },
      ],
      correctIndex: 0,
      explanation: "Fantastique ! L'alphabet commence par la lettre A comme Abeille, Avion et Ananas !",
      audioHint: "C'est la première lettre qu'on chante dans l'ABC !",
    },
    {
      id: 2,
      question: "Quelle lettre vient juste après la lettre A ?",
      options: [
        { text: "La lettre B", emoji: "🅱️" },
        { text: "La lettre P", emoji: "🅿️" },
        { text: "La lettre X", emoji: "❌" },
      ],
      correctIndex: 0,
      explanation: "Bien joué ! A... puis B comme Bateau, Banane ou Bébé !",
      audioHint: "A, puis... ?",
    },
    {
      id: 3,
      question: "Combien y a-t-il de lettres au total dans l'alphabet ?",
      options: [
        { text: "26 lettres", emoji: "📚" },
        { text: "5 lettres", emoji: "🖐️" },
        { text: "100 lettres", emoji: "💯" },
      ],
      correctIndex: 0,
      explanation: "Impressionnant ! Notre alphabet compte 26 jolies lettres de A jusqu'à Z !",
      audioHint: "C'est un nombre entre 20 et 30 !",
    },
  ],

  // Apprendre à Compter de 1 à 20
  v4: [
    {
      id: 1,
      question: "Quel chiffre vient juste après le chiffre 4 ?",
      options: [
        { text: "Le chiffre 5", emoji: "5️⃣" },
        { text: "Le chiffre 2", emoji: "2️⃣" },
        { text: "Le chiffre 9", emoji: "9️⃣" },
      ],
      correctIndex: 0,
      explanation: "Superbe ! 1, 2, 3, 4 et 5 ! Comme les 5 doigts d'une main !",
      audioHint: "Compte sur une main : 1, 2, 3, 4 et... ?",
    },
    {
      id: 2,
      question: "Combien as-tu de doigts au total sur tes deux mains ?",
      options: [
        { text: "10 doigts", emoji: "👐" },
        { text: "3 doigts", emoji: "✌️" },
        { text: "14 doigts", emoji: "🖐️" },
      ],
      correctIndex: 0,
      explanation: "Exactement ! 5 doigts à gauche + 5 doigts à droite = 10 doigts magiques !",
      audioHint: "5 plus 5 égale dix !",
    },
    {
      id: 3,
      question: "Combien de roues a un vélo ordinaire ?",
      options: [
        { text: "2 roues", emoji: "🚲" },
        { text: "4 roues", emoji: "🚗" },
        { text: "8 roues", emoji: "🚜" },
      ],
      correctIndex: 0,
      explanation: "Bravo ! Une bicyclette a 2 roues, une devant et une derrière !",
      audioHint: "Le mot bicyclette a 'bi' qui veut dire deux !",
    },
  ],

  // Voyage dans l'Espace
  v5: [
    {
      id: 1,
      question: "Quelle est notre magnifique planète bleue sur laquelle nous vivons ?",
      options: [
        { text: "La Terre", emoji: "🌍" },
        { text: "Mars la rouge", emoji: "🔴" },
        { text: "Jupiter la géante", emoji: "🪐" },
      ],
      correctIndex: 0,
      explanation: "Oui ! C'est la Terre, recouverte d'océans et de verdure !",
      audioHint: "Elle s'appelle la planète bleue ou la Terre !",
    },
    {
      id: 2,
      question: "Quelle immense étoile éclaire et réchauffe toute la Terre ?",
      options: [
        { text: "Le Soleil", emoji: "☀️" },
        { text: "La Lune", emoji: "🌙" },
        { text: "Un satellite en métal", emoji: "🛰️" },
      ],
      correctIndex: 0,
      explanation: "Parfait ! Le Soleil est une immense boule de feu et de lumière au centre du système !",
      audioHint: "Il brille fort dans le ciel pendant la journée !",
    },
    {
      id: 3,
      question: "Quel engin extraordinaire permet aux astronautes de voyager dans l'espace ?",
      options: [
        { text: "Une fusée spatiale", emoji: "🚀" },
        { text: "Une bicyclette", emoji: "🚲" },
        { text: "Un sous-marin", emoji: "🤿" },
      ],
      correctIndex: 0,
      explanation: "3, 2, 1... Décollage ! Les astronautes montent dans une puissante fusée !",
      audioHint: "Ça décolle tout droit vers les étoiles avec un grand bruit de moteur !",
    },
  ],

  // Le Monde des Dinosaures
  v6: [
    {
      id: 1,
      question: "Quel dinosaure très célèbre marchait sur deux pattes et avait de grandes dents tranchantes ?",
      options: [
        { text: "Le Tyrannosaure (T-Rex)", emoji: "🦖" },
        { text: "Le Diplodocus au long cou", emoji: "🦕" },
        { text: "Le petit canari jaune", emoji: "🐤" },
      ],
      correctIndex: 0,
      explanation: "Roaaar ! C'est le T-Rex, le redoutable roi des carnivores !",
      audioHint: "Son nom raccourci est T-Rex !",
    },
    {
      id: 2,
      question: "Que mangeait le Diplodocus avec son cou géant ?",
      options: [
        { text: "Des feuilles et des plantes", emoji: "🌿" },
        { text: "Des gâteaux au chocolat", emoji: "🍫" },
        { text: "D'autres dinosaures", emoji: "🥩" },
      ],
      correctIndex: 0,
      explanation: "Super ! Le Diplodocus était herbivore, il mangeait la cime des grands arbres !",
      audioHint: "Il mangeait de la bonne verdure dans la forêt !",
    },
    {
      id: 3,
      question: "Combien de cornes avait le Tricératops sur sa tête protectrice ?",
      options: [
        { text: "3 cornes", emoji: "🦏" },
        { text: "1 corne comme la licorne", emoji: "🦄" },
        { text: "10 cornes", emoji: "🔟" },
      ],
      correctIndex: 0,
      explanation: "Génial ! 'Tri' signifie 3, le Tricératops avait 3 belles cornes !",
      audioHint: "Pense au début du mot : 'Tri' comme trois !",
    },
  ],

  // Les Animaux de la Savane
  v7: [
    {
      id: 1,
      question: "Quel animal est surnommé le « Roi des Animaux » dans la savane ?",
      options: [
        { text: "Le Lion", emoji: "🦁" },
        { text: "Le Zèbre", emoji: "🦓" },
        { text: "Le Suricate", emoji: "🦡" },
      ],
      correctIndex: 0,
      explanation: "Bravo ! Le Lion avec sa crinière flamboyante règne sur la savane !",
      audioHint: "Il a une grande crinière dorée et pousse de puissants rugissements !",
    },
    {
      id: 2,
      question: "Quel est l'animal le plus grand du monde avec son très long cou ?",
      options: [
        { text: "La Girafe", emoji: "🦒" },
        { text: "L'Hippopotame", emoji: "🦛" },
        { text: "Le Lièvre", emoji: "🐇" },
      ],
      correctIndex: 0,
      explanation: "Oui ! La girafe peut mesurer jusqu'à 5 mètres de hauteur !",
      audioHint: "Elle a un cou tellement grand qu'elle touche les nuages !",
    },
    {
      id: 3,
      question: "À quoi sert la longue trompe de Fanti l'éléphant ?",
      options: [
        { text: "À boire, manger et arroser", emoji: "🐘" },
        { text: "À jouer aux cartes", emoji: "🃏" },
        { text: "À regarder la télévision", emoji: "📺" },
      ],
      correctIndex: 0,
      explanation: "Trop fort ! La trompe est le super-outil de l'éléphant pour boire, manger et se doucher !",
      audioHint: "Fanti s'en sert pour aspirer de l'eau et faire de gros bisous !",
    },
  ],

  // Découverte de l'Océan
  v8: [
    {
      id: 1,
      question: "Le dauphin est-il un poisson ou un mammifère qui vient respirer à la surface ?",
      options: [
        { text: "Un mammifère intelligent", emoji: "🐬" },
        { text: "Un oiseau qui vole sous l'eau", emoji: "🐧" },
        { text: "Une pieuvre à huit bras", emoji: "🐙" },
      ],
      correctIndex: 0,
      explanation: "Exact ! Le dauphin est un mammifère marin qui respire par son évent au-dessus de l'eau !",
      audioHint: "Il vient sauter hors de l'eau pour respirer de l'air frais !",
    },
    {
      id: 2,
      question: "De quelles couleurs est le petit poisson-clown comme Nemo ?",
      options: [
        { text: "Orange vif et bandes blanches", emoji: "🐠" },
        { text: "Vert fluo et noir", emoji: "🐸" },
        { text: "Violet et jaune", emoji: "🎨" },
      ],
      correctIndex: 0,
      explanation: "Super ! Le poisson-clown a de belles rayures orange et blanches !",
      audioHint: "Comme dans le dessin animé de Nemo !",
    },
    {
      id: 3,
      question: "Quelle créature lente transporte sa propre maison coquille sur son dos ?",
      options: [
        { text: "La Tortue de mer", emoji: "🐢" },
        { text: "Le Requin marteau", emoji: "🦈" },
        { text: "L'Étoile de mer", emoji: "⭐" },
      ],
      correctIndex: 0,
      explanation: "Bravo ! La tortue marine a une carapace solide qui la protège !",
      audioHint: "Elle nage paisiblement avec une carapace sur le dos !",
    },
  ],

  // L'Âne Trotro
  v9: [
    {
      id: 1,
      question: "Quel animal tout mignon est le personnage Trotro ?",
      options: [
        { text: "Un petit âne gris", emoji: "🫏" },
        { text: "Un chiot dalmatien", emoji: "🐶" },
        { text: "Un bébé dragon", emoji: "🐲" },
      ],
      correctIndex: 0,
      explanation: "Trop facile ! 'Trotro l'âne rigolo, Trotro l'ami des petits !'",
      audioHint: "C'est un petit âne avec de grandes oreilles !",
    },
    {
      id: 2,
      question: "De quelle couleur est la crinière de Trotro ?",
      options: [
        { text: "Blanche toute douce", emoji: "🤍" },
        { text: "Verte pomme", emoji: "🍏" },
        { text: "Bleu marine", emoji: "💙" },
      ],
      correctIndex: 0,
      explanation: "Bien vu ! Trotro a une jolie crinière blanche sur la tête !",
      audioHint: "Elle est blanche comme la neige ou le lait !",
    },
    {
      id: 3,
      question: "Quel légume croquant les petits ânes aiment-ils grignoter ?",
      options: [
        { text: "Une bonne carotte orange", emoji: "🥕" },
        { text: "Un piment très fort", emoji: "🌶️" },
        { text: "Une sucette à la fraise", emoji: "🍭" },
      ],
      correctIndex: 0,
      explanation: "Miam ! Les ânes raffolent des bonnes carottes fraîches et du foin !",
      audioHint: "C'est un légume orange que les lapins aiment aussi !",
    },
  ],

  // Petit Ours Brun
  v10: [
    {
      id: 1,
      question: "Quel petit animal est le héros de cette histoire ?",
      options: [
        { text: "Un ourson brun", emoji: "🐻" },
        { text: "Un ouistiti rieur", emoji: "🐵" },
        { text: "Un kangourou sauteur", emoji: "🦘" },
      ],
      correctIndex: 0,
      explanation: "Oui ! C'est Petit Ours Brun, l'ourson curieux qui découvre le monde !",
      audioHint: "C'est un ourson tout brun et doux !",
    },
    {
      id: 2,
      question: "Qu'adore faire Petit Ours Brun quand il pleut dehors ?",
      options: [
        { text: "Sauter dans les flaques avec ses bottes", emoji: "👢" },
        { text: "Rester fâché dans son lit", emoji: "🛌" },
        { text: "Manger des feuilles d'arbre", emoji: "🍂" },
      ],
      correctIndex: 0,
      explanation: "Plouf plouf ! C'est tellement amusant de sauter dans les flaques d'eau !",
      audioHint: "Ça fait 'splash' avec des bottes en caoutchouc !",
    },
    {
      id: 3,
      question: "Qui aide Petit Ours Brun avec beaucoup de tendresse tous les jours ?",
      options: [
        { text: "Papa Ours et Maman Ourse", emoji: "👨‍👩‍👧" },
        { text: "Un méchant loup des bois", emoji: "🐺" },
        { text: "Un robot de fer", emoji: "🤖" },
      ],
      correctIndex: 0,
      explanation: "Bravo ! Ses parents l'aiment et lui apprennent à être grand et autonome !",
      audioHint: "C'est sa maman et son papa !",
    },
  ],

  // Dessiner des Animaux
  v11: [
    {
      id: 1,
      question: "Par quelle forme toute ronde commence-t-on souvent la tête d'un animal ?",
      options: [
        { text: "Un rond / un cercle", emoji: "⭕" },
        { text: "Une étoile à 10 pointes", emoji: "⭐" },
        { text: "Un trait en zigzag", emoji: "⚡" },
      ],
      correctIndex: 0,
      explanation: "Excellent ! Un cercle régulier sert de base à la tête du lion, du chat ou de l'éléphant !",
      audioHint: "C'est la forme d'un ballon ou d'une pièce de monnaie !",
    },
    {
      id: 2,
      question: "Pour dessiner les oreilles pointues d'un chat, quelle forme trace-t-on ?",
      options: [
        { text: "Deux triangles", emoji: "📐" },
        { text: "Deux carrés géants", emoji: "⬛" },
        { text: "Une spirale d'escargot", emoji: "🌀" },
      ],
      correctIndex: 0,
      explanation: "Parfait ! Les oreilles de chat sont de jolis triangles pointés vers le haut !",
      audioHint: "C'est une forme à 3 côtés !",
    },
    {
      id: 3,
      question: "Quelle belle couleur choisit-on pour faire briller un grand soleil dans son dessin ?",
      options: [
        { text: "Le jaune étincelant", emoji: "☀️" },
        { text: "Le noir sombre", emoji: "⬛" },
        { text: "Le gris brouillard", emoji: "🌫️" },
      ],
      correctIndex: 0,
      explanation: "Superbe ! Le jaune illumine le ciel et réchauffe toute la prairie !",
      audioHint: "C'est la couleur de la lumière et des bananes !",
    },
  ],

  // Comptines d'Afrique
  v12: [
    {
      id: 1,
      question: "Quel instrument de musique traditionnel percutant rythme les danses africaines ?",
      options: [
        { text: "Le Djembé (tambour)", emoji: "🪘" },
        { text: "Le violon électrique", emoji: "🎻" },
        { text: "Le sifflet à roulettes", emoji: "🪈" },
      ],
      correctIndex: 0,
      explanation: "Rythme dans la peau ! Le djembé résonne chaleureusement pour faire danser petits et grands !",
      audioHint: "C'est un tambour en bois sur lequel on tape avec les mains !",
    },
    {
      id: 2,
      question: "Que font les enfants quand le rythme joyeux commence ?",
      options: [
        { text: "Ils chantent et dansent en riant", emoji: "💃" },
        { text: "Ils se bouchent les oreilles", emoji: "🙉" },
        { text: "Ils s'endorment par terre", emoji: "😴" },
      ],
      correctIndex: 0,
      explanation: "Oui ! La musique donne de l'énergie et une immense joie de vivre !",
      audioHint: "Ils bougent en rythme avec des sourires !",
    },
    {
      id: 3,
      question: "Quel très grand animal de la savane avec de grandes oreilles est l'ami de Fanti ?",
      options: [
        { text: "L'Éléphant majestueux", emoji: "🐘" },
        { text: "Le Pingouin des glaces", emoji: "🐧" },
        { text: "Le Panda géant", emoji: "🐼" },
      ],
      correctIndex: 0,
      explanation: "Merveilleux ! Fanti et sa famille d'éléphants protègent la savane !",
      audioHint: "C'est la mascotte même de ton application : Fanti !",
    },
  ],
};

/**
 * Fallback generator for custom videos or dynamically added videos
 */
export function getQuizForVideo(
  video: { id: string; title: string; category?: string },
  ageGroup: string = "5-7"
): VideoComprehensionQuestion[] {
  // If specific quiz exists, return it
  if (VIDEO_QUIZ_DATABASE[video.id]) {
    return VIDEO_QUIZ_DATABASE[video.id];
  }

  const titleLower = video.title.toLowerCase();
  const category = (video.category || "").toLowerCase();

  // Smart heuristic based on keywords
  if (titleLower.includes("anim") || category.includes("anim")) {
    return [
      {
        id: 1,
        question: `Dans la vidéo "${video.title}", de quoi parlait l'histoire ?`,
        options: [
          { text: "Des animaux et de la nature", emoji: "🦁" },
          { text: "D'un lave-vaisselle automatique", emoji: "🧼" },
          { text: "D'une trottinette cassée", emoji: "🛴" },
        ],
        correctIndex: 0,
        explanation: "Bravo ! Tu as bien été attentif aux animaux de la vidéo !",
        audioHint: "La vidéo montrait de gentils animaux !",
      },
      {
        id: 2,
        question: "Pourquoi les animaux sont-ils importants dans la nature ?",
        options: [
          { text: "Ils maintiennent l'équilibre de la Terre", emoji: "🌍" },
          { text: "Ils fabriquent des téléphones", emoji: "📱" },
          { text: "Ils font les devoirs d'école", emoji: "🎒" },
        ],
        correctIndex: 0,
        explanation: "Exactement ! Chaque être vivant protège la biodiversité !",
        audioHint: "La nature a besoin de tous les animaux !",
      },
      {
        id: 3,
        question: "Quel sentiment as-tu ressenti en regardant cette vidéo ?",
        options: [
          { text: "De la joie et de la curiosité", emoji: "🌟" },
          { text: "De l'ennui", emoji: "🥱" },
          { text: "De la colère", emoji: "😠" },
        ],
        correctIndex: 0,
        explanation: "Super ! Apprendre de nouvelles choses sur le monde est passionnant !",
        audioHint: "C'était chouette et plein de découvertes !",
      },
    ];
  }

  if (titleLower.includes("chanson") || titleLower.includes("comptine") || category.includes("comptine")) {
    return [
      {
        id: 1,
        question: `De quoi parlait cette jolie chanson : "${video.title}" ?`,
        options: [
          { text: "D'une histoire musicale joyeuse", emoji: "🎵" },
          { text: "D'un train sans roues", emoji: "🚂" },
          { text: "D'un dictionnaire sérieux", emoji: "📖" },
        ],
        correctIndex: 0,
        explanation: "Bien joué ! C'était une douce chanson pour apprendre et s'amuser !",
        audioHint: "C'est de la belle musique !",
      },
      {
        id: 2,
        question: "Que fait-on pour accompagner le rythme d'une chanson ?",
        options: [
          { text: "On tape des mains en mesure", emoji: "👏" },
          { text: "On jette ses jouets", emoji: "🪀" },
          { text: "On ferme les yeux sans écouter", emoji: "🙈" },
        ],
        correctIndex: 0,
        explanation: "Parfait ! Taper dans les mains permet de suivre le bon tempo !",
        audioHint: "On frappe doucement dans les mains !",
      },
      {
        id: 3,
        question: "Qu'est-ce qui rend cette chanson si amusante à répéter ?",
        options: [
          { text: "Les rimes et le refrain entraînant", emoji: "🎤" },
          { text: "Elle dure 4 jours d'affilée", emoji: "⏳" },
          { text: "Elle ne dit aucun mot", emoji: "🤐" },
        ],
        correctIndex: 0,
        explanation: "Formidable ! Les rimes permettent de mémoriser facilement les paroles !",
        audioHint: "C'est la mélodie et les jolies rimes !",
      },
    ];
  }

  // Default universal comprehension quiz for any educational video
  return [
    {
      id: 1,
      question: `Quel était le sujet principal de la vidéo "${video.title}" ?`,
      options: [
        { text: "Découvrir et apprendre de nouvelles choses", emoji: "🧠" },
        { text: "Dormir sans rien regarder", emoji: "😴" },
        { text: "Faire des bêtises", emoji: "💥" },
      ],
      correctIndex: 0,
      explanation: "Bravo ! Tu as été très concentré pendant toute la vidéo !",
      audioHint: "C'était pour enrichir tes connaissances et t'émerveiller !",
    },
    {
      id: 2,
      question: "Pourquoi est-il bon de regarder des vidéos éducatives ?",
      options: [
        { text: "Pour grandir et devenir plus fort d'esprit", emoji: "💡" },
        { text: "Pour oublier comment parler", emoji: "😶" },
        { text: "Pour ne jamais faire de sport", emoji: "🛋️" },
      ],
      correctIndex: 0,
      explanation: "Exact ! Le cerveau se développe quand on apprend avec curiosité !",
      audioHint: "Pour apprendre plein de choses formidables !",
    },
    {
      id: 3,
      question: "Quelle leçon peux-tu partager avec tes amis ou ta famille ?",
      options: [
        { text: "Tout ce que tu as découvert avec Fanti aujourd'hui !", emoji: "🐘" },
        { text: "Rien du tout", emoji: "❌" },
        { text: "Qu'il faut se disputer", emoji: "😠" },
      ],
      correctIndex: 0,
      explanation: "Extraordinaire ! Partager ses connaissances est le secret des grands héros !",
      audioHint: "Raconte à tes parents ce que tu as vu !",
    },
  ];
}
