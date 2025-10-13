# make-upp-app

## Configuración de Iconos

### Generar Iconos Personalizados

1. Coloca tu icono SVG (512x512px) en `android/resources/icon.svg`
2. Ejecuta: `npx capacitor-assets generate --iconBackgroundColor '#ffffff' --iconBackgroundColorDark '#000000' --splashBackgroundColor '#FFE3F3' --splashBackgroundColorDark '#000000'`

## Construir y Sincronizar Cambios

```bash
npm run build
npx cap sync android
```

## Abrir Android Studio

```bash
npx cap open android
```

## Generar APK

### APK de Debug (Para Pruebas)

```bash
cd android
./gradlew assembleDebug
```

El APK se genera en: `android/app/build/outputs/apk/debug/app-debug.apk`

### APK de Release (Para Producción)

```bash
cd android
./gradlew assembleRelease
```

El APK se genera en: `android/app/build/outputs/apk/release/app-release.apk`

## Instalar en Emulador

```bash
npx cap run android
```

cd android && ./gradlew assembleDebug
