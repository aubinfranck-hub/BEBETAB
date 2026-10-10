# BEBETAB : écrans et navigation

L’interface web est construite en composants interactifs. Ses textes, commandes et icônes vectorielles sont rendus à la résolution du navigateur. Les neuf illustrations sont en 1672 × 941 ; elles ne sont pas des images 4K natives. Les captures dans `design/uhd` sont en 3840 × 2160.

| Écran | Route web | Action disponible |
| --- | --- | --- |
| Accueil | #/home | 8 rubriques et raccourcis |
| Monde | #/world | Continents et 7 pays |
| Pays | #/country?country=france | Sujets, bibliothèque et activités |
| Apprendre | #/apprendre | Lettres, nombres, sciences, animaux |
| Jouer | #/jouer | Sélection et lancement des jeux |
| Histoires | #/histoires | 3 histoires locales complètes, création via API |
| Dessiner | #/dessiner | Dessin, guides de lettres/nombres/formes, export |
| Musique | #/musique | Piano, xylophone, percussions, comptines |
| Récompenses | #/recompenses | Achat de tenues avec étoiles et équipement |
| Quiz | #/quiz | Sujets, questions via API et secours local |
| Défis | #/defis | Validation après activité récompensée |
| Mondes | #/mondes | Choix et sauvegarde de l’univers |
| Vidéos | #/videos | Catalogue et liens vidéo existants |
| Live World | #/live | Liens vers caméras Explore et EarthCam |

Les activités ont des liens directs `?activity=…`, un retour à leur menu et un fil d’Ariane vers l’accueil. Profil, étoiles, tenues et progression sont sauvegardés localement ; les défis utilisent une clé par jour. Le contrôle parental et l’écran de pause utilisent le profil local.

Android natif : les routes quiz, challenges, worlds, videos et assistant complètent les menus existants. Les actions des fiches pays ouvrent les rubriques correspondantes. La vidéothèque native ouvre une recherche YouTube externe et Fanti natif propose un guide local.

## Vérification

`npm ci`, `npm run lint`, `npm run build`. Le script `scripts/verify-navigation.cjs` utilise Playwright avec un serveur de production sur le port 3000. Il vérifie une histoire avec récompense, les liens des pays, les guides de dessin et 14 routes à 390, 1024 et 3840 pixels de largeur. Les captures produites font 3840 × 2160. Le script `scripts/capture-overlays.cjs` ajoute cinq captures : accès parental, tableau de bord parents, Fanti, Premium et pause.

## Services à terminer avant publication

Les écrans ne constituent pas une validation de production : l’IA nécessite une clé Gemini et un modèle accessible, les flux vidéo externes dépendent de leurs fournisseurs, Premium est une simulation sans paiement, et le stockage local n’est pas une synchronisation de compte. L’APK Android debug compile avec succès ; il reste à vérifier la version release par CI et le fonctionnement sur tablette réelle avant diffusion.

Validation exécutée : TypeScript, bundle de production, parcours Playwright et compilation `:app:assembleDebug` réussis. Les 19 captures ont une résolution de 3840 × 2160.
