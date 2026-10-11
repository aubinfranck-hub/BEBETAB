# Audit BébéTab — 11 octobre 2026

> **Mise à jour du 11 octobre 2026 : les corrections sont faites sur la branche `claude/baby-table-program-audit-175nhr`.**
> Le §0 dit ce qui est corrigé, avec le niveau de preuve. Les §1 à §10 décrivent l'état **au moment de l'audit** et sont conservés comme historique.

**Périmètre** : application Android native Kotlin/Compose (`android/`, c'est ce que construit la CI), serveur et web React (`server.ts`, `src/`), workflows GitHub Actions, planche de référence `android/app/src/main/res/drawable-nodpi/reference_board.jpg`.

**Méthode** : lecture de l'ensemble du code Android, lecture complète de `server.ts`, échantillonnage de `src/`, analyse des logs CI (commit `98d0e2a`), test d'agrandissement IA de la planche.

**Limites** : rien n'a été exécuté sur un appareil ou un émulateur (pas de SDK Android dans l'environnement d'audit). Les points marqués *à confirmer* sont déduits de la lecture du code. Voir le §10.

---

## 0. Suivi des corrections (11 octobre 2026)

Légende : ✅ **vérifié** par un test automatique, une exécution réelle ou la CI · 🟡 **corrigé**, compile, mais non exécuté sur une tablette (à confirmer) · ⛔ **non traité** (décision à prendre ou hors périmètre).

### Build, tests, CI
| Sujet | État | Preuve |
|---|---|---|
| Compilation Android (2 erreurs) | ✅ | Gradle 8.10 local reproduit les erreurs de la CI puis passe ; les 3 workflows GitHub sont **verts** sur la branche (c'était rouge depuis le 8 oct.) |
| Signature de l'APK de release | ✅ | Même clé de test : avant correctif → `app-release-unsigned.apk` ; après → `app-release.apk`, `apksigner verify` : *Verifies*. Sans clé ou clé absente : build OK, non signé |
| Gradle wrapper manquant | ✅ | `android/gradlew` (8.10), testé |
| Tests automatiques | ✅ | **Android 25 tests** (étoiles quotidiennes, code parent, notes, contenu des 45 questions, URL de mise à jour) · **Web 32 tests** (dont un test d'intégration qui démarre le vrai serveur). Des mutations volontaires (code cassé exprès) ont été détectées à chaque fois |
| CI : tests dans les workflows | ✅ | `build-kotlin.yml` lance les tests Android ; nouveau `test-web.yml` (types, build, tests) |
| Release idempotente | 🟡 | `gh release upload --clobber` si le tag existe ; à valider au premier vrai release |
| Protection de `main` / pull requests | ⛔ | Réglage GitHub à faire par le propriétaire du dépôt |
| Deux workflows identiques | ⛔ | `build-apk.yml` et `build-kotlin.yml` laissés tels quels |

### Android : bugs
| # | État | Ce qui a été fait |
|---|---|---|
| B1 Plantage de Live World | 🟡 | Chaque filtre porte sa clé (plus de liste parallèle) ; puce active surlignée ; écran titré LIVE WORLD |
| B2 / B3 Compteur d'étoiles, niveau, médailles | 🟡 | Départ à **0** (au lieu de 2450 affiché / 0 compté). Un nouvel enfant est niveau 1 sans médaille |
| B4 Étoiles « farmables » | ✅ règle · 🟡 écrans | `claimDaily` : une récompense par clé et par jour (règle pure, 5 tests) : cadeau, découverte d'un pays, chaque question de quiz, paires et bonus du Memory |
| B5 Clavier musical | ✅ fréquences · 🟡 son | Vraies notes Do4→Do5 (synthèse), test de la fréquence de chaque note et de l'absence de « clic » |
| B6 Musique en arrière-plan | 🟡 | Pause quand l'app n'est plus visible ; interrupteur « Musique de fond » dans les réglages parents |
| B7 Verrou du temps d'écran | 🟡 | L'écran consomme les touches et le bouton retour ; le compteur ne tourne qu'au premier plan ; textes FR/EN |
| B8 « Essaie encore » sans réessai | 🟡 | Le choix faux se grise, l'enfant réessaie ; +2 étoiles du premier coup, +1 ensuite |
| B9 Contenu des quiz | ✅ | 3 questions par matière et par jeu (le fichier existait mais n'était jamais affiché), **traduites en anglais**, choix mélangés ; test : toute réponse est dans ses choix, toutes les activités affichées ont du contenu |
| B10 Boutons sans effet | 🟡 partiel | Les puces *Live / Jeux / Quiz / Musique* des pays naviguent ; « Retour » d'un pays revient à la liste. **Restent** : puces d'Histoires, catégories du Monde, continents cliquables ⛔ (contenu à définir) |
| B11 Dessin | 🟡 partiel | Traits sans copie de liste, gomme qui n'efface plus le guide, guides de tracé **A→Z et 0→9**, « Créer musique » ouvre le clavier. **Restent** : pot de peinture du coloriage, sauvegarde ⛔ |
| B12 Histoires | 🟡 | Vraies illustrations ; détection d'une voix de lecture absente |
| B13 Sous-titre des pays | 🟡 | Sous-titre propre à chaque pays |
| B14 Bascule FR/EN en double | ✅ | Retirée de l'accueil |
| B15 Mode immersif | 🟡 | `WindowInsetsControllerCompat`, réappliqué au retour du clavier |
| B16 Orientation | 🟡 | `sensorLandscape` |

### Android : sécurité
| # | État | Ce qui a été fait |
|---|---|---|
| S1 Code parent | ✅ logique · 🟡 écrans | Un seul composant pour les 3 usages ; stocké en **PBKDF2 + sel** ; 5 erreurs → blocage 1, 2, 4, 8 puis 15 min (conservé après redémarrage) ; le parent choisit son code dans les réglages, avec avertissement tant que le code initial `2580` est actif ; `2580` n'existe plus qu'à **un seul** endroit |
| S2 Mise à jour | ✅ URL · 🟡 reste | Seules les URL `https` GitHub sont acceptées (testé) ; bouton « Plus tard » ; textes anglais. **Restent** : téléchargement hors Wi‑Fi uniquement, `update.json` encore à la v2 (il se met à jour au premier release signé) ⛔ |
| S3 `allowBackup` | ⛔ | Décision à prendre (progression sauvegardée chez Google, ou non) |
| S4 Petits textes, accessibilité | ⛔ | Fait partie de la refonte visuelle |
| S5 Liens externes | ✅ | Le dialogue prévient que le site externe peut afficher suggestions et commentaires |
| Icône de l'application | ✅ | Icône adaptative avec Fanti (détouré sur la planche HD) ; l'APK déclare `ic_launcher` (vérifié avec `aapt2`) |

### Web
| # | État | Ce qui a été fait / preuve |
|---|---|---|
| Le web **ne compilait pas** | ✅ | Commentaire JSX non fermé dans `App.tsx`, `@types/react` absents, un type trop étroit : `tsc` passe, `vite build` réussit |
| W1 Pubs diffusables par n'importe qui | ✅ | Jeton `ADMIN_TOKEN` obligatoire (503 s'il n'est pas défini) ; URL `https` publiques uniquement ; arrêt automatique ; tests d'intégration + parcours navigateur |
| W2 API IA ouvertes et sans limite | ✅ | Limites de débit par IP et globale, corps JSON limité à 32 ko, plafonds sur le WebSocket (origine, sessions, durée, débit de messages) |
| W3 Injection de consigne | ✅ | Entrées nettoyées, consignes figées, règles de sécurité enfant, `safetySettings` Gemini, réponses du modèle validées. *Réponse réelle du modèle non testée (pas de clé API ici)* |
| W4 Voix de l'enfant sans consentement | ✅ | Écran de consentement parental avant le premier appel (navigateur) |
| W5 Port en dur | ✅ | `PORT` de l'environnement |
| W6 Modèles `preview` | 🟡 | Noms configurables par variables d'environnement (les noms eux-mêmes ne sont pas vérifiés) |
| W7 Deux applications dans un dépôt | ⛔ | Décision : laquelle est le produit ? |
| W8 État des pubs en mémoire | ⛔ | Perdu au redémarrage ; sans importance tant qu'il y a une seule instance |

### Défauts supplémentaires découverts pendant les corrections
Tous prouvés dans un vrai navigateur, **avant** (ancien code) et **après** (code corrigé) :

| Défaut | Avant | Après |
|---|---|---|
| **Overlay de pub** | Compte à rebours figé à « 5s », la pub ne se termine jamais, **598 connexions SSE en 12 s** | Compte à rebours 4→0, bouton « Continuer », 1 seule connexion, 1 seule vue |
| **Écran bloqué après la pub** | Il fallait que l'admin arrête la pub à la main | L'enfant peut toujours continuer ; l'annonce s'arrête seule |
| **Bouton « couper le micro »** | 9 paquets audio envoyés alors qu'il est coupé | 0 paquet envoyé ; micro libéré au raccrochage |
| **Portail parents web** | Affichait « La réponse est 15 » ; le code `1234` marchait aussi | Question aléatoire, aucune réponse révélée, blocage 30 s après 3 erreurs |

### Reste à décider ou à faire
1. **Habillage fidèle à la planche** (§3.4, option A ou B) : non traité, c'est une décision de conception. Les écrans HD (x4) et l'icône sont prêts.
2. Quelle application est **le produit** : native Kotlin ou web (W7) ?
3. Protéger `main` et passer par des pull requests (réglage GitHub).
4. Configurer la clé de signature et les 4 secrets pour activer la mise à jour automatique (`android/AUTO_UPDATE_SETUP.md`).
5. Vérifier les corrections « 🟡 » sur une vraie tablette (aucun appareil ni émulateur n'était disponible).

---

## 1. Verdict

| Domaine | État | En une phrase |
|---|---|---|
| Build / CI | **Critique** | `main` ne compile plus depuis le 8 octobre (2 erreurs), 3 commits rouges d'affilée. |
| Fidélité à la planche | **Majeur** | L'écran qui affiche ta vraie image n'est branché nulle part ; tout est redessiné à la main en emojis et formes. |
| Fonctionnement Android | **Majeur** | 1 plantage probable, compteur d'étoiles faux, récompenses sans valeur, « clavier musical » qui joue des tonalités de téléphone. |
| Sécurité / enfants (Android) | **Moyen** | Code parent unique en dur, sans limite d'essais. Le reste est plutôt sain. |
| Web / serveur | **Critique si exposé** | Diffusion de pubs sans authentification, API IA ouvertes à tous. |
| Qualité / tests | **Moyen** | Aucun test, pas de `gradlew`, push direct sur `main`. |

**Les deux raisons pour lesquelles l'APK ne respecte pas ce que tu veux :**
1. Le build est cassé : tes derniers changements ne sont dans aucun APK.
2. Même le dernier APK qui compile n'utilise pas ton image (§3).

---

## 2. Bloquant : le build est cassé (P0)

Les 3 workflows échouent sur `e760713`, `0b59bf4` et `98d0e2a`. Le dernier build réussi est `e05e4e9` (8 oct., 12:05). Erreurs relevées dans le log du run `37780146612` :

| Fichier | Erreur du compilateur | Correctif |
|---|---|---|
| `HomeScreen.kt:52-53` | `Conflicting declarations: local val childName` (déclaré deux fois) | Supprimer la ligne 53. |
| `MainActivity.kt:87` | `Argument type mismatch: actual type is 'NavHostController', but 'Context' was expected` | `finishApp(context)` au lieu de `finishApp(nav)` (`context` existe déjà ligne 44). Retrouver l'`Activity` en remontant les `ContextWrapper`, car `as? Activity` peut échouer sur un contexte enveloppé. |

Le commit « Fix screen-time close action » (`0b59bf4`) prétendait corriger la seconde erreur sans y parvenir.

Cause de fond : tout est poussé directement sur `main`, sans pull request et sans que la CI bloque quoi que ce soit.

---

## 3. Pourquoi l'APK ne ressemble pas à la planche (P1)

### 3.1 Cause

`ReferenceBoard.kt` sait afficher chaque écran de la planche (recadrage exact + zones tactiles). **Aucun écran ne l'appelle.** Il a été ajouté par `215d86a` (7 oct., sous le message trompeur « localize animal memory game ») et n'a jamais été référencé (`git log -S'ReferenceBoardScreen'` sur `MainActivity.kt` est vide). Pendant ce temps, de nombreux commits (« match … reference », « native illustrations ») ont redessiné la planche en Canvas et en emojis. L'image de 673 Ko est embarquée dans l'APK pour rien.

### 3.2 Écart écran par écran

| Écran | Planche | APK actuel |
|---|---|---|
| Accueil | Logo 3D, scène de savane, globe 3D avec monuments, photo de girafe, tuiles à icônes 3D | Texte jaune plat, dégradé + 5 cercles blancs, cercle bleu + 4 emojis (`HomeScreen.kt:174-177`), emoji 🦒 (`:215`), icônes Material (deux tuiles partagent la même icône) |
| Explorer le monde | Carte illustrée, 5 lieux avec photos (Paris, New York, Nairobi, Tokyo, Le Caire), 11 catégories | Polygones colorés, continents écrits avec des espaces et non cliquables, lieux = France, Côte d'Ivoire, Kenya, Japon, Égypte |
| France | 6 cartes illustrées + 6 puces d'action | Emojis ; les 6 puces affichent seulement un texte « seront disponibles ici » (`ReferenceScreens.kt:161-170`) |
| Live World | 6 vignettes photo (Paris, New York, Tokyo, Nairobi, Savane, Barrière de corail) | Écran intitulé « CAMÉRAS ANIMAUX », vignettes géométriques, et plantage probable (voir B1) |
| Apprendre / Jouer / Dessiner | Icônes 3D sur tuiles colorées, décors | Pictogrammes géométriques (`ActivityIllustrations.kt`), fond uni |
| Histoires | 3 illustrations + 6 puces avec icônes | Puces sans aucune action (`ActivityScreens.kt:238-240`) |
| Musique, Récompenses | **Absents de la planche** | Pas de référence visuelle à suivre |

La mascotte Fanti est une quinzaine d'ovales, identique sur tous les écrans, alors que la planche la montre qui salue, lit, peint ou pointe. Elle existe en deux versions différentes (`HomeScreen.kt` `FantiHero` et `FantiMascot.kt`), et l'oreille est dessinée deux fois (`FantiMascot.kt:29` et `:31`).

### 3.3 Résolution : test d'agrandissement

La planche fait 1536×1024, donc chaque écran n'a que 444 à 767 px de large. Affiché plein écran sur une tablette, il serait flou. Test réalisé en local (Real-ESRGAN, CPU, gratuit) :

| Méthode | Résultat |
|---|---|
| Agrandissement classique (Lanczos ×4) | Flou |
| Real-ESRGAN `anime_6B` | Très net, mais contours blancs parasites et rendu 3D aplati : **écarté** |
| **Real-ESRGAN `x4plus`** | Net, rendu 3D conservé, aucune jointure visible : **retenu** |

Résultat : planche en **6144×4096** en 7 min 36 s sur 4 cœurs. Écrans découpés (recadrages de `ReferenceBoard.kt` ×4) et compressés en WebP qualité 90 :

| Écran | Original | HD | WebP | RAM décodé |
|---|---|---|---|---|
| home | 767×416 | 3068×1664 | 626 Ko | 20,4 Mo |
| world | 760×416 | 3040×1664 | 738 Ko | 20,2 Mo |
| france | 536×299 | 2144×1196 | 391 Ko | 10,3 Mo |
| live | 483×299 | 1932×1196 | 387 Ko | 9,2 Mo |
| learn | 498×299 | 1992×1196 | 275 Ko | 9,5 Mo |
| play | 536×260 | 2144×1040 | 291 Ko | 8,9 Mo |
| stories | 539×260 | 2156×1040 | 310 Ko | 9,0 Mo |
| draw | 444×260 | 1776×1040 | 209 Ko | 7,4 Mo |

**Limites de l'IA, à connaître avant de décider :**
- Les très petits textes (« Découvre les pays… », « Niveau 3 Explorateur ») sont déformés : ils étaient déjà illisibles à l'origine.
- Les détails minuscules (petits personnages, animaux de la carte) sont inventés, pas restitués.
- Ces fichiers ne sont **pas** commités (décision d'intégration en attente). Ne jamais charger la planche entière en 6144×4096 : ≈ 100 Mo de RAM décodée, risque de plantage mémoire.

### 3.4 Recommandation

**Option B (recommandée)** : décors et illustrations en HD, textes et boutons en vrai Compose par-dessus. Cela rend dynamiques le nom de l'enfant, les étoiles, le niveau et FR/EN, et évite les petits textes déformés. Il faut découper Fanti (une pose par écran), le globe, les cartes, les photos et les icônes de tuiles. L'idéal est de récupérer les **fichiers d'origine séparés** de la planche ; sinon, découpage avec détourage automatique.

**Option A (rapide)** : afficher les 8 écrans HD tels quels. Ressemblance maximale, mais tout est figé (nom, étoiles, langue) et les petits textes restent déformés.

---

## 4. Bugs fonctionnels Android

| # | Gravité | Où | Problème | Correctif |
|---|---|---|---|---|
| B1 | **Critique** (plantage probable) | `ReferenceScreens.kt:204-205` | 7 filtres (« Tous », « Villes »…) mais 6 clés : à l'index 6, `listOf(...)[index]` lève `IndexOutOfBoundsException` dès l'ouverture de Live World. Les clés sont aussi décalées d'un cran. | Liste de paires `(clé, libellé)`. |
| B2 | **Majeur** | `ProgressStore.kt:17` et `:20` | L'affichage part de 2450 étoiles par défaut mais `addStars` part de 0 : au premier gain, le compteur retombe à quelques étoiles. | Même valeur de départ des deux côtés, et valeur de départ = 0 pour un vrai enfant. |
| B3 | **Majeur** | `ProgressStore.kt:17`, `HomeScreen.kt` | Conséquence de B2 : au premier lancement l'enfant est « Niveau 50 » avec les 4 médailles (10, 50, 100, 250) déjà débloquées. La planche montre « Niveau 3 ». | Départ à 0, formule de niveau alignée sur la planche. |
| B4 | **Majeur** | `BebeTabFrame.kt:92` | Le bouton cadeau donne **+5 étoiles à chaque tap, sans limite**. Les quiz bouclent sans fin (+2 par bonne réponse) et « J'ai découvert ! » se réarme à chaque entrée dans un pays : les récompenses sont triviales à farmer. | Un cadeau par jour ; quiz à tentative unique par jour. |
| B5 | **Majeur** | `StoryAndMusic.kt:100-103` | Le « clavier musical » utilise `TONE_DTMF_1…8`, soit les tonalités du clavier téléphonique, pas des notes. « Do » joue un bip de téléphone. | Synthèse de sinusoïdes aux fréquences C4 à C5 (le moteur `BebeAudioEngine` le fait déjà pour la musique de fond). |
| B6 | Moyen | `MainActivity.kt:53` | La musique de fond démarre dans la composition. Aucun `onPause`/`onStop`/Lifecycle dans le module : elle continue quand l'app passe en arrière-plan. Aucun bouton pour la couper. | Observer le cycle de vie ; ajouter un réglage « musique » côté parent. |
| B7 | Moyen (*à confirmer sur appareil*) | `MainActivity.kt:101-103` | L'écran « Temps terminé » est un `Box` avec `background`. Dans Compose, cela ne bloque pas les touches : en dehors de la carte, les taps peuvent traverser vers l'écran du dessous. Le compteur (`:59`) continue aussi tant que le processus vit. | `Modifier.pointerInput(Unit){}` sur le `Box` ; mettre le compteur en pause en arrière-plan. |
| B8 | Moyen | `ActivityScreens.kt:107`, `QuizGames.kt:37-47` | Après une mauvaise réponse : « Essaie encore ! » mais les boutons sont désactivés, aucun réessai possible. | Réactiver les choix après une erreur. |
| B9 | Moyen | `ActivityScreens.kt:43-57`, `MiniGames.kt:93` | Chaque matière/jeu n'a **qu'une question**. Le fichier `MiniGames.kt` contient 13 activités × 3 questions mais `MiniGameScreen` n'est appelé nulle part. En mode EN, les quiz restent en français (`MiniGames.kt:111` `translateQuestions` renvoie l'entrée telle quelle ; `QuizGames.kt` idem). | Brancher `MiniGames.kt`, supprimer le doublon, traduire. |
| B10 | Moyen | `ReferenceScreens.kt:296`, `ActivityScreens.kt:238-240`, `ReferenceScreens.kt:161-170` | Boutons sans effet : 6 puces de France, 6 puces d'Histoires, catégories du Monde (changent seulement le texte de la bulle), continents non cliquables. `SmallWhiteChip` accepte `onClick = {}` par défaut. | Soit une vraie destination, soit retirer. |
| B11 | Moyen | `DrawGame.kt:63-71`, `ActivityScreens.kt:277`, `DrawGame.kt:58` | Même guide de tracé pour toute lettre et tout chiffre. « Coloriage » : toile vide sans pot de peinture. « Créer musique » ouvre… une toile de dessin. Copie des listes à chaque événement de glissement (coût quadratique, lent sur un grand dessin). La gomme efface aussi le guide. Aucune sauvegarde. | Vraies formes A–Z/0–9, remplissage, tampon musique, structure de tracés persistante. |
| B12 | Mineur | `StoryAndMusic.kt:77` | Le lecteur d'histoires n'affiche que 3 emojis, pas les illustrations (`StoryIllustration` existe). Le résultat de `engine.language=` (langue absente) n'est pas testé. | Utiliser les illustrations ; gérer `LANG_MISSING_DATA`. |
| B13 | Mineur | `BebeTabFrame.kt` (branche `else` du sous-titre) | Les pays autres que la France affichent « Tes découvertes et récompenses » comme sous-titre. | Sous-titre par pays. |
| B14 | Mineur | `HomeScreen.kt:84-91` | Bascule `FR • EN` en doublon avec les pastilles FR/EN de la barre. | En garder une. |
| B15 | Mineur | `MainActivity.kt:30` | Mode immersif via `systemUiVisibility` (obsolète, cible SDK 35 = bord à bord imposé), non réappliqué après l'apparition du clavier (saisie du code parent). | `WindowInsetsControllerCompat`. |
| B16 | Mineur | `AndroidManifest.xml:15` | `screenOrientation="landscape"` fixe : une tablette retournée sur son support reste à l'envers. | `sensorLandscape`. |

---

## 5. Sécurité, enfants et vie privée (Android)

**S1. Code parent unique, en dur, sans limite d'essais (Majeur).**
`"2580"` est écrit à trois endroits (`MainActivity.kt:124`, `SettingsScreen.kt:37`, `ReferenceScreens.kt:236`). Il n'est pas modifiable, il a 10 000 combinaisons sans verrouillage, et il est lisible dans le code. Le mécanisme de mise à jour lit `update.json` anonymement sur `raw.githubusercontent.com`, ce qui suppose un dépôt **public** : tout le monde peut donc le lire. *Correctif* : code choisi au premier lancement, stocké haché (sel + hash), verrouillage après 5 essais, un seul composant partagé pour les trois écrans.

**S2. Mise à jour automatique : saine mais inerte et à clarifier (Moyen).**
- Bien : HTTPS, SHA-256 vérifié avant installation, `FileProvider` limité au cache `updates/`, installation par l'installateur système.
- Limite : le SHA-256 et l'APK viennent du même dépôt. L'authenticité repose donc entièrement sur la **signature Android**.
- **Défaut de configuration (Majeur)** : `build.gradle.kts:12-21` crée un `signingConfig` « release » mais le build type `release` (`:34-39`) ne l'utilise jamais (aucun `signingConfig = ...`). Même avec les 4 secrets GitHub configurés, l'APK de release sort **non signé** : `app-release.apk` n'existe jamais, le workflow prend toujours la branche « unsigned », ne publie aucune release et ne met jamais `update.json` à jour. La chaîne « APK signé → release → mise à jour automatique » décrite dans `AUTO_UPDATE_SETUP.md` ne peut donc pas fonctionner telle quelle. *Correctif* : `signingConfig = signingConfigs.getByName("release")` dans `release { }`, conditionné à la présence des variables d'environnement.
- `update.json` est en `versionCode 2` avec une `apkUrl` vide, alors que l'app est en `versionCode 3` : le mécanisme ne peut rien livrer aujourd'hui.
- Le téléchargement est automatique, sans test Wi‑Fi, et la fenêtre n'a pas de « Plus tard ». Les textes sont uniquement en français. Le champ `mandatory` est lu mais jamais utilisé. `apkUrl` n'est pas validée (https, hôte attendu).
- `REQUEST_INSTALL_PACKAGES` (`AndroidManifest.xml:4`) : sensible pour une app enfant, et incompatible avec une publication sur Google Play (auto-mise à jour hors Play). Le README annonce « sans permissions dangereuses » alors que le manifeste déclare aussi `INTERNET` et cet accès spécial.
- Le workflow release échoue si le tag existe déjà (`gh release create`).

**S3. Sauvegarde cloud (Mineur).** `allowBackup="true"` (`AndroidManifest.xml:5`) : prénom de l'enfant, étoiles et réglages parentaux sont sauvegardés chez Google. À décider consciemment.

**S4. Accessibilité et enfants non lecteurs (Moyen).** Au moins 9 textes à 8-9 sp, plusieurs icônes sans description (TalkBack), et aucune aide vocale pour les 2-6 ans alors que la navigation repose sur des libellés écrits.

**S5. Liens externes (Mineur).** Les caméras en direct sont derrière le code parent (bien), mais ouvrent YouTube (suggestions, commentaires). À signaler au parent dans le message de confirmation.

---

## 6. Web et serveur (`server.ts`, `src/`)

> Ce code n'est **pas** celui de l'APK construit par la CI. Il ne doit pas être exposé à des enfants en l'état.

| # | Gravité | Où | Problème |
|---|---|---|---|
| W1 | **Critique** | `server.ts:200`, `:230`, `:160` | `/api/ads/broadcast` et `/api/ads/stop` n'ont **aucune authentification** : n'importe qui peut pousser une image, une vidéo ou une URL arbitraire sur tous les écrans connectés (flux SSE). `url` n'est pas validée. Le tableau de bord admin est atteint depuis le portail parents (`ParentsPortal.tsx:227-244`) ; je n'ai pas vérifié s'il est protégé par un code. |
| W2 | **Majeur** | `server.ts:34`, `:249`, `:304`, `:381`, `:468`, `:15` | `/api/fanti/*` et le WebSocket `/live` sont ouverts à tous, sans limite de débit, avec un corps JSON jusqu'à 10 Mo, et une session Gemini Live par connexion : épuisement du quota et de la facture. |
| W3 | **Majeur** | `server.ts:268-270`, `:334-338`, `:420-422` | `ageGroup`, `currentWorld`, `hero`, `animal`, `setting`, `theme`, `subject` sont injectés tels quels dans les consignes du modèle (injection de prompt). Aucun réglage de sécurité Gemini explicite ; contenu généré pour enfants non filtré. |
| W4 | **Majeur** | `server.ts:34-128`, `metadata.json` | La voix de l'enfant (micro) part vers le serveur puis vers Google, sans consentement parental. Contradiction avec le README Android (« sans compte, sans publicité ») : le web a une régie publicitaire et un profil en `localStorage` (`bebe_tab_user`). |
| W5 | Moyen | `server.ts:13` | `PORT = 3000` en dur : échoue sur les hébergeurs qui imposent `$PORT` (Render, Cloud Run). |
| W6 | Moyen | `server.ts:58`, `:478` | Modèles `*-preview` (Live, TTS) : risque de retrait. Noms non vérifiés. |
| W7 | Moyen | `capacitor.config.ts`, `package.json` | `webDir: dist` sans `server.url` : dans un APK Capacitor, les appels `/api/...` n'atteignent aucun serveur. Le script `android:build` appelle `./gradlew` (absent) et `cap sync android` entrerait en conflit avec le module natif de `android/`. Deux applications (`com.bebetab` native et `com.bebetab.world` web) vivent dans un seul dépôt : **il faut décider laquelle est le produit.** |
| W8 | Mineur | `server.ts:144-146` | État des pubs en mémoire (perdu au redémarrage, incohérent sur plusieurs instances). `GamesModule.tsx` fait 2112 lignes. |

Non audité en détail : le rendu et la logique des composants React.

---

## 7. Qualité, tests, CI

- **Aucun test** (ni unitaire, ni UI), pas de lint (detekt/ktlint).
- **Pas de `gradlew` ni de wrapper** : build non reproductible. La CI impose Gradle 8.10, le README dit simplement `gradle`.
- **CI** : trois workflows déclenchés à chaque push sur `android/**`, dont deux identiques (`build-apk.yml` et `build-kotlin.yml`). Push direct sur `main`, aucune pull request dans l'historique.
- **Historique** : commit « Improve home navigation and child identity » en double (le second casse le build), au moins 4 commits successifs « resolve native illustration compile errors » (compiler en local avant de pousser), message trompeur de `215d86a`.
- **i18n** : toutes les chaînes sont inline (`if(language=="en")`) ; `strings.xml` ne contient que 2 chaînes.
- **Dépendances** de décembre 2024 (Compose BOM 2024.12.01, Navigation 2.8.5, DataStore 1.1.1). `isMinifyEnabled = false`.
- **Code mort** : `ReferenceBoard.kt`, `MiniGames.kt`, `ProgressHeader.kt`, `SimpleScreen.kt` (placeholder « Étape suivante : interface fidèle à la planche »).
- **Icône d'application absente** : aucun `android:icon`, aucun dossier `mipmap`. Le lanceur affiche l'icône Android par défaut.

---

## 8. Points forts

- **Aucun secret dans le dépôt** : `.env*` ignoré (seul `.env.example` avec un faux placeholder), mots de passe de signature via GitHub Secrets, clé de release hors dépôt.
- **L'app native ne collecte aucune donnée** : pas de compte, TTS local, DataStore local, réseau limité à la mise à jour et aux liens externes.
- **Garde-fous parentaux présents** : code avant les liens externes, limite de temps quotidienne, réinitialisation confirmée.
- **Mise à jour bien pensée** : HTTPS, SHA-256, `FileProvider` restreint, documentation claire (`android/AUTO_UPDATE_SETUP.md`).
- **Architecture lisible** : contenus séparés (`ContentData`), type `Bilingual`, composants simples.
- **Contenu pédagogique adapté** (histoires courtes, quiz, mémoire des animaux).

---

## 9. Plan d'action recommandé

| Priorité | Travail | Effort estimé |
|---|---|---|
| **P0** | Corriger les 2 erreurs de compilation (§2) et vérifier la CI verte | 30 min |
| **P0** | Corriger le plantage Live World (B1) et le compteur d'étoiles (B2, B3) | 1 h |
| **P1** | Décider option A ou B pour l'habillage (§3.4), intégrer les écrans HD, brancher les écrans de la planche | 1 à 3 jours |
| **P1** | Icône d'application (Fanti), bouton muet / pause en arrière-plan (B6), verrou de temps robuste (B7) | 0,5 jour |
| **P2** | Code parent haché + verrouillage (S1), cadeau quotidien et anti-farm (B4), vrai clavier musical (B5), brancher `MiniGames.kt` (B9) | 1 à 2 jours |
| **P2** | Brancher la signature sur le build type `release` (§5 S2), puis créer la clé et les 4 secrets pour activer la mise à jour automatique | 1 h + configuration |
| **P2** | `gradlew`, tests de base, protection de `main` + pull requests, supprimer le workflow en double | 0,5 jour |
| **P3** | Web : authentification des routes pub et IA, limites de débit, validation des entrées, consentement parental ; ou retirer le web du dépôt | selon décision |

---

## 10. Limites de cet audit

- **Rien n'a été exécuté sur appareil ou émulateur.** Les points B1 (plantage) et B7 (touches qui traversent l'overlay) sont déduits de la lecture du code ; ils sont très probables mais *à confirmer*.
- Le build a été analysé via les logs CI du commit `98d0e2a`. Le compilateur s'arrête à certaines erreurs : d'autres peuvent apparaître une fois celles-ci corrigées.
- `server.ts` a été lu en entier ; les composants React de `src/` seulement échantillonnés.
- Les noms de modèles Gemini n'ont pas été vérifiés.
- Les images HD produites (§3.3) sont hors dépôt ; elles se régénèrent avec Real-ESRGAN `x4plus` sur la planche d'origine.

---

## 11. Web : guide détaillé

### 11.1 Ce que c'est
Une application React (Vite) servie par un serveur Express (`server.ts`) qui fait aussi office d'API : conversation avec Fanti (texte et voix), génération d'histoires et de quiz par Gemini, synthèse vocale, et une **régie publicitaire en direct** qui diffuse une annonce sur tous les appareils connectés. Ce n'est **pas** l'APK construit par la CI (celui-là est le module natif Kotlin de `android/`).

### 11.2 Routes du serveur

| Route | Qui peut l'appeler | Protections |
|---|---|---|
| `GET /api/health` | tout le monde | — |
| `GET /api/ads/stream` (SSE) | tous les appareils | 10 connexions par IP, 1000 au total |
| `GET /api/ads/current` | tout le monde | — |
| `POST /api/ads/view` | tout le monde | 30/min par IP ; accepté seulement pour l'annonce en cours ; **une vue par appareil et par annonce** |
| `POST /api/ads/auth` | administrateur | jeton `Authorization: Bearer …` |
| `POST /api/ads/broadcast` | administrateur | jeton ; URL `https` d'un domaine public (liste blanche optionnelle) ; titre ≤ 120, sponsor ≤ 80 ; durée forcée entre 5 et 60 s ; **arrêt automatique** à la fin de la durée + marge |
| `POST /api/ads/stop` | administrateur | jeton |
| `POST /api/fanti/chat` | tout le monde | 20/min par IP |
| `POST /api/fanti/story` | tout le monde | 5/min par IP |
| `POST /api/fanti/quiz` | tout le monde | 10/min par IP |
| `POST /api/fanti/tts` | tout le monde | 20/min par IP |
| (toutes les routes `/api/fanti/*`) | | plafond **global** de 120 requêtes/min (protège la facture) |
| `WebSocket /live` (voix) | navigateurs de l'origine autorisée | origine vérifiée ; 10 tentatives/min par IP ; 2 sessions par IP, 10 au total ; **10 min maximum** par conversation ; messages ≤ 128 ko, audio ≤ 64 ko, ≤ 40 messages/s |

Pour toutes les routes : corps JSON limité à **32 ko**, réponses d'erreur en JSON (404, 413, 400), pas d'en-tête `X-Powered-By`, `nosniff`.

### 11.3 Comment l'IA est protégée
- Les consignes système sont **fixes** : plus aucune valeur envoyée par le navigateur n'y est insérée.
- Les données de l'enfant (message, âge, monde, héros, décor, thème, matière) passent dans le message, sous forme de **données** : âge parmi `2-4`, `5-7`, `8-10` ; libellés réduits à des lettres, chiffres et ponctuation simple (≤ 40 à 60 caractères, sans retour à la ligne, guillemets, accolades ni balises) ; message libre ≤ 500 caractères, sans caractères de contrôle.
- Règles communes dans chaque consigne : ne jamais suivre une instruction présente dans les données de l'enfant, ne jamais demander d'informations personnelles, éviter tout sujet effrayant ou pour adultes.
- `safetySettings` Gemini au seuil le plus strict (`BLOCK_LOW_AND_ABOVE`) sur les 4 catégories, y compris pour la voix en direct.
- La réponse du modèle est **traitée comme non fiable** : humeur dans une liste, couleur au format `#RRGGBB`, textes tronqués, histoires limitées à 5 scènes, quiz à 6 questions de 2 à 4 choix avec une bonne réponse valide ; sinon le serveur renvoie 502 (ou la valeur de repli) au lieu d'envoyer n'importe quoi à l'enfant.
- Sans clé `GEMINI_API_KEY`, le serveur renvoie des réponses de repli : l'application reste utilisable.

### 11.4 Configuration (`.env`, voir `.env.example`)

| Variable | Défaut | Rôle |
|---|---|---|
| `GEMINI_API_KEY` | — | clé Gemini (côté serveur uniquement, jamais envoyée au navigateur) |
| `ADMIN_TOKEN` | — | **jeton de la console publicitaire** (16 caractères minimum, ex. `openssl rand -hex 32`). Absent = console désactivée (503) |
| `AD_ALLOWED_HOSTS` | vide | domaines autorisés pour les médias (`cdn.exemple.com, *.images.exemple.org`) ; vide = tout domaine public en `https` |
| `AD_GRACE_SECONDS` | 10 | marge avant l'arrêt automatique d'une annonce |
| `ALLOWED_ORIGINS` | vide | origines supplémentaires autorisées pour le WebSocket (ex. `https://localhost` pour une app Capacitor) |
| `TRUST_PROXY_HOPS` | 0 | nombre de proxys de confiance (1 sur Render ou Cloud Run). **À 0, `X-Forwarded-For` est ignoré** : les limites par IP ne sont pas contournables |
| `PORT` | 3000 | port d'écoute (les hébergeurs qui l'imposent le définissent eux-mêmes) |
| `LIVE_MAX_SECONDS`, `LIVE_MAX_PER_IP`, `LIVE_MAX_TOTAL` | 600, 2, 10 | limites de la voix en direct |
| `GEMINI_GLOBAL_RPM` | 120 | plafond global de requêtes IA par minute |
| `GEMINI_TEXT_MODEL`, `GEMINI_LIVE_MODEL`, `GEMINI_TTS_MODEL` | valeurs du code | noms des modèles (les versions `preview` peuvent être retirées) |

### 11.5 Utiliser la console publicitaire
1. Définir `ADMIN_TOKEN` sur le serveur et le redémarrer.
2. Dans l'application : Espace parents (résoudre la question) → « Ouvrir le Dashboard Régie Pub ».
3. Saisir le jeton (il n'est gardé que dans l'onglet). Un mauvais jeton est refusé ; 60 essais maximum par 15 minutes et par IP.
4. Choisir une annonce, régler la durée, **Diffuser**. Elle s'affiche chez tous les enfants connectés et s'arrête seule. Le « verrouillage » est désactivé par défaut ; activé, il ne dure que le temps de l'annonce, puis l'enfant a toujours un bouton **Continuer**.

### 11.6 Lancer les vérifications
```
npm install
npm run lint     # vérification de types (tsc)
npm test         # 32 tests : unitaires + intégration (démarre le vrai serveur sur un port libre)
npx vite build   # compilation du front
```
Le workflow `.github/workflows/test-web.yml` fait la même chose à chaque modification du web.

### 11.7 Ce qui n'est PAS résolu (risques résiduels)
- **Publicité à destination d'enfants** : la régie diffuse des annonces à des enfants. C'est un sujet réglementaire (règles de Google Play pour les apps familiales, RGPD pour les mineurs, COPPA aux États-Unis) à valider avant toute mise en production ; ce n'est pas un défaut de code.
- **Voix et vie privée** : la voix de l'enfant part vers Google (Gemini Live). Le consentement parental est demandé et mémorisé dans le navigateur, mais une politique de confidentialité et une information claire restent à rédiger.
- **Pas de comptes** : les limites reposent sur l'IP (et l'origine pour le WebSocket). Quelqu'un qui change d'adresse IP contourne les limites par IP ; le plafond **global** protège la facture dans ce cas.
- **Limiteurs en mémoire** : ils sont propres à chaque instance du serveur (utiliser un stockage partagé si plusieurs instances).
- **Portail parents web** : la question aléatoire est une barrière de confort côté navigateur, pas une authentification ; la vraie protection de la console est le jeton serveur.
- **Pas de CSP** : non ajoutée, car l'application est affichée dans un cadre (AI Studio) ; à étudier au déploiement.
- **Comportement réel de Gemini non testé** (pas de clé ici) : la validation des réponses est testée avec des réponses simulées.
- **Application Capacitor** (W7) : l'APK web n'a pas de serveur derrière lui (les appels `/api/...` n'aboutissent pas) ; décision à prendre avec « quelle application est le produit ».
