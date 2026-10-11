# BébéTab — mise à jour automatique

Le moteur de mise à jour est intégré dans l'application.

## Fonctionnement

1. BébéTab consulte `update.json` au démarrage.
2. Une nouvelle version est détectée lorsque `versionCode` est supérieur à celui installé.
3. L'APK signé est téléchargé automatiquement.
4. Le SHA-256 indiqué dans `update.json` est vérifié.
5. Android ouvre l'installateur système.
6. L'application existante est remplacée si la signature est identique.
7. Les données DataStore (étoiles, niveau, langue, préférences) restent dans l'application.

La vérification est répétée toutes les 6 heures pendant que l'application est ouverte.

## Signature obligatoire

Android n'autorise pas une mise à jour APK par-dessus une installation existante si la nouvelle APK n'est pas signée avec **la même clé**.

La clé privée NE DOIT PAS être commitée dans le dépôt.

Créer une clé une seule fois sur une machine sécurisée :

```bash
keytool -genkeypair -v \
  -keystore bebetab-release.jks \
  -alias bebetab \
  -keyalg RSA \
  -keysize 4096 \
  -validity 10000
```

Encoder la clé :

```bash
base64 -w 0 bebetab-release.jks > bebetab-release.base64.txt
```

Dans GitHub, ajouter ces secrets Actions :

- `BEBETAB_KEYSTORE_BASE64` : contenu de `bebetab-release.base64.txt`
- `BEBETAB_KEYSTORE_PASSWORD`
- `BEBETAB_KEY_ALIAS`
- `BEBETAB_KEY_PASSWORD`

> Le build `release` n'est signé que si les 4 secrets sont définis **et** que le fichier de clé existe
> (voir `app/build.gradle.kts`). Sans eux, il produit `app-release-unsigned.apk` et aucune release n'est publiée.

Après cette configuration, le workflow :

`Kotlin/Compose -> APK signé -> GitHub Release -> SHA-256 -> update.json`

est automatique.

## Important

Ne jamais perdre `bebetab-release.jks` ni ses mots de passe. Une nouvelle clé rendrait les anciennes installations incapables d'accepter les mises à jour.

## URL de manifeste

L'application utilise :

`https://raw.githubusercontent.com/aubinfranck-hub/BEBETAB/main/update.json`

Le manifeste contient la version, l'URL de l'APK, le SHA-256 et les notes de version.

## Sécurité

- téléchargement HTTPS
- vérification SHA-256 avant installation
- installation via Android Package Installer
- pas de remplacement silencieux du système Android
- la clé de signature reste hors du dépôt
