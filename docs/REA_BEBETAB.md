# Analyser l’APK BEBETAB avec REA

REA (Reverse Engineer Anything) connecte Codex à des outils d’analyse d’applications. Pour BEBETAB, il sert à examiner un APK existant et à guider la reconstruction ou la correction dans le code source. Il s’utilise pendant le développement : **il ne doit pas être ajouté à l’APK destiné aux enfants**.

## Préparer REA sur le poste de développement

1. Installer une version de Node.js prise en charge par REA (voir la documentation officielle).
2. Depuis un terminal de confiance, hors du dossier de l’application, lancer :

   ```bash
   npx rea-agents@latest setup --client codex
   ```

3. Lire le plan proposé par REA et valider la configuration Codex. Redémarrer Codex ensuite.
4. Pour l’analyse Android, installer Java/JDK 17 ou plus récent et le moteur headless JADX requis par la version de REA. Définir `REA_JADX_MCP_JAR` vers le fichier JAR. REA fournit le diagnostic de configuration avec :

   ```bash
   rea doctor --provider jadx --json
   ```

Consulter le [guide Android officiel de REA](https://github.com/morluto/rea/blob/main/docs/android-analysis.md) pour les versions, le téléchargement et la vérification du moteur JADX. Ajouter Apktool si le décodage des ressources Android est nécessaire.

## Analyser l’APK

Le dépôt contient déjà le code source BEBETAB. Construire son APK de développement depuis la racine du dépôt :

```bash
npm run android:build
```

Puis lancer l’analyse statique de l’APK généré :

```bash
npm run android:rea:inspect -- android/app/build/outputs/apk/debug/app-debug.apk
```

Pour analyser un autre APK, remplacer le chemin par celui du fichier à examiner. Sous PowerShell, utiliser par exemple :

```powershell
npm run android:rea:inspect -- "C:\\chemin\\vers\\BEBETAB.apk"
```

REA peut identifier le package, le manifeste, les classes et les méthodes décompilées. Dans Codex, demander ensuite une analyse ciblée : préciser les écrans ou fonctions à comprendre, demander les éléments de preuve et les limites, puis faire reconstruire ou corriger ces fonctions dans le projet BEBETAB. Recompiler l’application et vérifier le résultat sur un appareil ou un émulateur Android.

## Limites

REA inspecte statiquement l’APK : l’application cible n’est pas lancée par l’analyse. Les noms obfusqués, le code natif, le chargement dynamique et les services distants peuvent empêcher une récupération complète. Un APK ne contient pas nécessairement le serveur, les données ni le code source original ; le résultat doit être comparé à l’application en fonctionnement.

N’analyser que les APK appartenant à BEBETAB ou pour lesquels vous avez l’autorisation.

Projet REA officiel : https://github.com/morluto/rea
