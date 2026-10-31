# BébéTab : cahier des charges pour GPT

## 1. Mission

Tu es développeur Android senior. Construis l'application **BébéTab** (« Le monde dans tes mains ») : une application éducative pour enfants de 2 à 10 ans, en français (FR) avec bascule anglais (EN), destinée aux tablettes et téléphones Android en **mode paysage**.

Les références visuelles obligatoires sont les maquettes à jour listées à la section 15. Elles remplacent les anciennes planches, y compris toute version montrant Fanti comme caméléon. Reproduis la nouvelle identité de Fanti l’éléphant, les écrans épurés et leurs grands boutons tactiles.

Règle de travail : ne pose pas de questions. Quand une information manque, choisis une solution raisonnable, implémente-la et indique ton choix en une ligne.

## 2. Stack technique

- Langage : Kotlin, Jetpack Compose (Material 3), un seul module `app`.
- Navigation : Navigation Compose, une route par écran.
- Stockage local : DataStore (étoiles, niveau, langue, médailles).
- Audio : `TextToSpeech` Android (lecture des histoires), `ToneGenerator` ou `SoundPool` (clavier musical).
- Dessin : composable `Canvas` avec gestes tactiles (`pointerInput`).
- Hors ligne d'abord : aucun compte, aucune publicité, aucune collecte de données.
- Version minimale : Android 8.0 (API 26). Orientation verrouillée en paysage.
- Livrable : projet Android Studio complet, qui compile, avec `README` et instructions de build.

Alternative acceptée si tu la justifies : Flutter. Ne propose pas de CLI complexe : le projet doit pouvoir être ouvert tel quel dans Android Studio.

## 3. Identité visuelle

| Élément | Valeur |
|---|---|
| Fond | Ciel bleu clair (#7FD3FF vers #D9F3FF), nuages, montgolfières, monuments illustrés |
| Mascotte | **Fanti, éléphanteau gris-bleu** : grandes oreilles, trompe visible, casquette jaune avec un B bleu, t-shirt jaune avec un globe, sac à dos bleu. Fanti est toujours un éléphant ; toute ancienne version caméléon est retirée. |
| Titre | « BÉBÉ TAB » en jaune (#FFD54F) avec contour bleu (#1E88E5) et ombre |
| Police | Baloo 2 (gras), ou une police arrondie équivalente |
| Boutons | Gros, très arrondis (20 dp), ombre pleine en dessous, effet d'appui (le bouton s'enfonce) |
| Cartes | Blanches, coins arrondis, ombre légère |
| Cible tactile | 48 dp minimum |

Couleurs des tuiles de l'accueil :

| Tuile | Couleur |
|---|---|
| Monde | Vert #43A047 |
| Apprendre | Orange #FB8C00 |
| Jouer | Rouge #E53935 |
| Histoires | Violet #8E24AA |
| Live World | Bleu #039BE5 |
| Musique | Rose #D81B60 |
| Dessiner | Jaune #FDD835 |
| Mes récompenses | Vert foncé #2E7D32 |

Bouton principal « EXPLORER LE MONDE » : orange (#FF8F00), icône lecture, texte blanc.

## 4. Barre supérieure (sur tous les écrans sauf l'accueil complet)

De gauche à droite : bouton retour (←) bleu rond, titre de l'écran avec son icône, avatar de l'enfant (**Kofi**), étoiles (⭐ 2 450), cadeau, « Niveau 3 Explorateur » avec barre de progression, bascule **FR / EN**, bouton réglages (⚙️).

## 5. Écrans

### 5.1 Accueil
- Logo BébéTab, sous-titre « Jouer · Apprendre · Découvrir · Explorer ».
- Fanti à gauche avec une bulle : « Bonjour ! Hello ! Prêt pour une nouvelle aventure ? ».
- Globe illustré avec monuments au centre.
- Carte « LIVE WORLD » (badge rouge « EN DIRECT », girafe, bouton lecture) en haut à droite.
- Bloc « Aujourd'hui avec Fanti » : 1 vidéo, 2 jeux, 1 histoire, 1 chanson.
- Bouton « EXPLORER LE MONDE ».
- Rangée de 8 tuiles : Monde, Apprendre, Jouer, Histoires, Live World, Musique, Dessiner, Mes récompenses (libellé FR en gras, EN en petit dessous).

### 5.2 Explorer le monde
- Carte du monde illustrée avec 5 continents cliquables : Amérique, Europe, Afrique, Asie, Océanie. Plus Océans et Antarctique.
- Panneau « Lieux populaires » : Paris (France), New York (États-Unis), Nairobi (Kenya), Tokyo (Japon), Le Caire (Égypte). Un tap sur un lieu ouvre sa fiche.
- Barre de catégories en bas : Villes, Animaux, Cultures, Monuments, Nature, Océans, Espace, Métiers, Cuisine, Langues, Histoire.
- Bulle de Fanti : « Où veux-tu aller aujourd'hui ? Touche un continent ! ».

### 5.3 Fiche pays (exemple : France)
- Image de fond du pays (Tour Eiffel), drapeau, fil d'Ariane « Europe > France ».
- Carte « Découvrir la France » : Monuments, Culture, Animaux, Gastronomie, Villes, Histoire.
- Barre du bas : Vidéos, Live de pays, Jeux, Quiz, Images, Musique.
- Bulle de Fanti : « Bienvenue en France ! Découvre sa culture, ses monuments et ses habitudes. »
- Le modèle doit être générique : tous les pays utilisent le même écran avec des données différentes.

### 5.4 Live World
- Titre « Regarde le monde en direct ! », badge « EN DIRECT ».
- Grille de 6 vignettes avec badge rouge LIVE : Paris, New York, Tokyo, Nairobi, La Savane, Barrière de corail.
- Barre de filtres : Villes, Nature, Animaux, Monuments, Plages, Montagnes.
- Phase 1 : vignettes + vidéos locales ou liens vidéo adaptés aux enfants (YouTube Kids ou fichiers intégrés). Aucun flux non modéré.

### 5.5 Apprendre
- Conserver les 8 matières : Lettres, Nombres, Sciences, Monde, Animaux, Espace, Art, Langues.
- Ajouter une entrée visible « Programme scolaire ivoirien » avec choix de classe CP1, CP2, CE1, CE2, CM1 ou CM2.
- Bulle de Fanti : « Apprendre, c'est découvrir le monde ! ».
- Chaque matière ouvre des activités ; le programme ivoirien ouvre les cours par classe et par discipline (voir section 5.10).

### 5.6 Jouer
- Grille de 8 jeux : Puzzles, Maths, Géographie, Animaux, Mémoire, Logique, Français, English.

### 5.7 Histoires
- Titre « Écoute, lis et vis des histoires incroyables avec Fanti ! ».
- 3 histoires : **Fanti dans la forêt**, **Le trésor du désert**, **Le voyage dans l'espace**.
- Filtres : Aventure, Animaux, Magie, Monde, Amitié, Écouter.
- Lecteur : texte par pages, bouton « Écouter » (synthèse vocale), illustration, page suivante / précédente.

### 5.8 Dessiner
- Titre « Laisse libre cours à ton imagination ! », Fanti devant un chevalet.
- 6 modes : Dessin libre, Coloriage, Tracer lettres, Tracer chiffres, Formes, Créer musique.

### 5.9 Mes récompenses
- Total d'étoiles, niveau, médailles à débloquer (10, 50, 100, 250 étoiles).

### 5.10 Programme scolaire ivoirien : CP1 à CM2
- Le contenu s’appuie sur les programmes éducatifs et guides d’exécution par classe publiés par la Direction de la Pédagogie et de la Formation Continue (DPFC).
- CP1 et CP2 : les guides de référence disponibles couvrent Français, Mathématiques, EDHC, EPS et AEC. La DPFC référence aussi une expérimentation de nouveaux programmes pour les classes pilotes CP1/CP2 en 2025-2026 ; vérifier l’édition et le statut de l’école cible avant de présenter ces contenus comme universels.
- CE1, CE2, CM1 et CM2 : Français, Mathématiques, EDHC, EPS, AEC, Histoire-Géographie et Sciences et Technologie.
- Chaque cours comprend une notion expliquée simplement, un exemple ancré dans le quotidien ivoirien et un exercice avec correction bienveillante.
- Progression graduelle du CP1 au CM2. Les leçons du curriculum sont en français ; les commandes de l’application restent disponibles en français et en anglais.
- La première livraison contient une leçon interactive par discipline et par classe ; les cours suivants sont ajoutés selon les thèmes et leçons officiels DPFC. Ne jamais présenter ce premier lot comme l’intégralité des manuels officiels.

## 6. Activités à implémenter (phase 1)

| Activité | Règle |
|---|---|
| Quiz Lettres | Une image (lion, banane…) est affichée. L'enfant choisit la bonne lettre initiale parmi 3. +2 étoiles par bonne réponse. |
| Quiz Nombres | N objets (1 à 9) sont affichés. L'enfant choisit combien il y en a parmi 3. +2 étoiles. |
| Mémoire | 12 cartes (6 paires d'animaux). +1 étoile par paire, +5 à la fin. |
| Dessin libre | Canvas tactile, 7 couleurs, gomme, 3 tailles de pinceau, bouton « Effacer tout ». |
| Histoires | Lecture à voix haute avec `TextToSpeech` en `fr-FR`. |
| Musique | 8 touches Do à Do aiguë, son à l'appui. |
| Monde | Fiche d'un continent ou pays avec 1 anecdote, +1 étoile à l'ouverture. |

Les autres matières (Sciences, Espace, Art, Langues, Puzzles, Logique, Français, English, Formes, Coloriage) : crée l'écran et un premier mini-jeu simple. Évite les écrans vides : chaque bouton doit mener à quelque chose.

## 7. Système de progression

- Étoiles (entier) stockées dans DataStore.
- Niveau = `étoiles / 50 + 1`. Barre de progression = reste de la division par 50.
- Médailles aux seuils 10 / 50 / 100 / 250.
- Retour sonore et visuel à chaque bonne réponse (« Bravo ! ⭐ »). Jamais de punition : une erreur affiche « Essaie encore ! ».

## 8. Contrôle parental et sécurité

- Pas de publicité, pas de achats intégrés, pas de lien externe sans « porte parentale » (ex. : maintenir un bouton 3 secondes, ou résoudre une opération simple).
- Réglages protégés par la porte parentale : langue, durée d'écran quotidienne, réinitialisation des étoiles.
- Minuteur d'écran : verrouille l'application au-delà de la durée choisie par le parent.
- Aucune donnée personnelle envoyée ; le prénom « Kofi » est modifiable et reste sur l'appareil.

## 9. Langues

- Toutes les chaînes dans `strings.xml` (FR par défaut, EN en seconde langue).
- La bascule FR / EN de la barre supérieure change la langue sans redémarrage.
- Libellés des tuiles bilingues comme sur l'image : FR en gras, EN en petit.

## 10. Structure de projet attendue

```
app/src/main/java/com/bebetab/
  MainActivity.kt
  ui/theme/ (couleurs, typographie, formes)
  ui/components/ (BarreSuperieure, TuileMenu, BulleFanti, BoutonPrincipal)
  ui/screens/ (Accueil, Monde, Pays, LiveWorld, Apprendre, Jouer, Histoires, Dessiner, Recompenses, Reglages)
  ui/games/ (QuizLettres, QuizNombres, Memoire, DessinLibre, Clavier)
  data/ (ProgressStore.kt, StoriesData.kt, CountriesData.kt)
res/drawable/ (fanti.png, fond_ciel.png, icônes)
res/values/strings.xml, res/values-en/strings.xml
```

## 11. Données d'exemple

**Continents :**
- Europe : Paris et la Tour Eiffel.
- Afrique : lion, éléphant et girafe de la savane.
- Asie : Tokyo, les pandas et l'Himalaya.
- Amérique : New York, l'Amazonie et les lamas.
- Océanie : kangourous et Grande Barrière de corail.
- Antarctique : manchots.
- Océans : baleines.

**Histoire « Fanti dans la forêt » :** Fanti l'éléphant se promène dans la forêt et rencontre un petit singe qui a perdu sa banane. Ils la cherchent ensemble et la trouvent dans un arbre. Fanti apprend qu'aider ses amis rend tout le monde heureux.

## 12. Critères d'acceptation

1. Le projet compile et se lance sur un émulateur Android 8+ en paysage.
2. Chaque écran de la planche existe et ressemble à l'image (couleurs, mascotte, disposition).
3. Tous les boutons de l'accueil naviguent vers un écran fonctionnel.
4. Les étoiles et le niveau persistent après fermeture de l'application.
5. FR / EN fonctionne partout.
6. Aucune permission dangereuse (pas de caméra, micro, localisation, contacts).

## 13. Ordre de livraison demandé

1. Squelette du projet, thème, navigation, accueil.
2. Écrans Monde, Apprendre, Jouer, Histoires, Dessiner, Live World, Récompenses.
3. Quiz Lettres, Quiz Nombres, Mémoire, Dessin libre, Histoires audio, Clavier.
4. Progression (DataStore), langues, porte parentale, minuteur.
5. README avec la procédure de build et la liste des choix faits.

Livre le code complet fichier par fichier, sans abréviation (« ... » interdit).

## 14. Version web de référence (déjà faite)

Un prototype web existe : https://claude.ai/artifact/BydM8beM1YofPVBjSMVxfX. Il reprend les écrans de la planche avec des zones tactiles. Sers-t'en pour le comportement de navigation et des activités, pas comme code à copier.

## 15. Mise à jour validée le 31 octobre 2026

### Identité de Fanti et illustrations de référence
Fanti est l’éléphanteau gris-bleu. La version caméléon est abandonnée et ne doit plus être réintroduite dans les écrans, les illustrations ou les supports.

Les nouvelles maquettes à reprendre pour la suite du projet sont :
- [Écran Sciences : Animaux, Plantes, Corps et Espace](https://drive.google.com/file/d/1yHq4R9jDYMh7Hr_1H_gMAhL4APf2kKUl/view)
- [Lecteur « Histoire du soir » avec sous-titres](https://drive.google.com/file/d/1v5iOr3uoOfivTsbzWokhwTYXcZFCaahi/view)
- [Espace parents : profil, durée et vidéos autorisées](https://drive.google.com/file/d/15kauvt8scmKCQhVE6SuphLD66dR1lx2s/view)

Les écrans restent en paysage, lisibles à distance, avec des cartes simples et des zones tactiles larges. Les nouvelles maquettes sont les références visuelles actuelles ; les écrans antérieurs restent utiles pour les parcours non remplacés.

### Programme scolaire ivoirien
Ajouter les classes **CP1, CP2, CE1, CE2, CM1 et CM2**, en s’appuyant sur les programmes et guides d’exécution officiels de la DPFC. Les catégories de matières doivent varier selon le niveau, comme dans les documents de chaque classe. Chaque leçon doit relier une notion, un exemple concret et un exercice, avec encouragements et suivi local des étoiles.

Les programmes officiels sont consultables dans le dossier DPFC des programmes du primaire. Le projet doit conserver ce lien de référence et réviser les contenus si la DPFC publie une nouvelle édition :
https://dpfc-ci.net/documents/programmes-educatifs-et-guides-dexecution/programmes-educatifs-et-guides-dexecution-du-primaire/
