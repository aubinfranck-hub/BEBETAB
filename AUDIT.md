# Audit BébéTab — 11 octobre 2026

**Périmètre** : application Android native Kotlin/Compose (`android/`, c'est ce que construit la CI), serveur et web React (`server.ts`, `src/`), workflows GitHub Actions, planche de référence `android/app/src/main/res/drawable-nodpi/reference_board.jpg`.

**Méthode** : lecture de l'ensemble du code Android, lecture complète de `server.ts`, échantillonnage de `src/`, analyse des logs CI (commit `98d0e2a`), test d'agrandissement IA de la planche.

**Limites** : rien n'a été exécuté sur un appareil ou un émulateur (pas de SDK Android dans l'environnement d'audit). Les points marqués *à confirmer* sont déduits de la lecture du code. Voir le §10.

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
