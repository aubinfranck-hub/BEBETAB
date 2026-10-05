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
Quiz : +2 étoiles. Memory : +1 par paire et +5 à la fin. Niveau : étoiles / 50 + 1. Médailles : 10, 50, 100 et 250 étoiles. Les données sont persistées localement.

## Contrôle parental
Langue FR/EN, nom de l'enfant, limite quotidienne configurable, verrouillage du temps d'écran et réinitialisation confirmée des étoiles.

## Build
Ouvrir le dossier android dans Android Studio puis synchroniser Gradle.

Commande :
```
cd android
gradle assembleDebug
```

APK debug :
`android/app/build/outputs/apk/debug/app-debug.apk`

## Référence
La planche fournie dans le cahier des charges est la référence visuelle. Le prototype Claude sert de référence pour la navigation et le comportement ; son code n'est pas copié.

Le workflow .github/workflows/build-kotlin.yml compile automatiquement le module natif après modification de android/.
