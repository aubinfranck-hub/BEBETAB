# BébéTab — Android natif Kotlin

Application Android native Kotlin + Jetpack Compose Material 3 pour enfants de 2 à 10 ans.

## Architecture
- Module Android unique : app
- Navigation Compose
- DataStore : étoiles, langue, préférences parentales et temps d'écran
- TextToSpeech : histoires
- ToneGenerator : clavier musical
- Canvas + gestes tactiles : dessin
- Android 8 / API 26 minimum
- Mode paysage
- Sans compte, sans publicité, sans permissions dangereuses

## Écrans
Accueil, Explorer le monde, France, Live World, Apprendre, Jouer, Histoires, Musique, Dessiner, Récompenses et Espace parents.

## Progression
L'enfant commence à 0 étoile. Niveau : étoiles / 50 + 1. Médailles : 10, 50, 100 et 250 étoiles. Les données sont persistées localement.

Gains d'étoiles (chacun une seule fois par jour, pour éviter de les « farmer ») :
- Quiz : +2 étoiles à la première bonne réponse (+1 après une erreur), une fois par question et par jour ;
- Memory : +1 par paire d'animal et +5 à la fin de la partie ;
- Cadeau de Fanti (bouton rouge de la barre) : +5 étoiles ;
- « J'ai découvert ! » d'un pays : +1 étoile par pays.

## Contrôle parental
Langue FR/EN, nom de l'enfant, limite quotidienne configurable, verrouillage du temps d'écran et réinitialisation confirmée des étoiles.

## Build
Ouvrir le dossier android dans Android Studio puis synchroniser Gradle.

Commandes (le wrapper Gradle 8.10 est fourni, comme dans la CI) :
```
cd android
./gradlew testDebugUnitTest   # tests unitaires (règles d'étoiles, code parent, notes, contenu des quiz)
./gradlew assembleDebug       # APK debug
```

APK debug :
`android/app/build/outputs/apk/debug/app-debug.apk`

## Référence
La planche fournie dans le cahier des charges est la référence visuelle. Le prototype Claude sert de référence pour la navigation et le comportement ; son code n'est pas copié.

Le workflow .github/workflows/build-kotlin.yml compile automatiquement le module natif après modification de android/.
