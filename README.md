# make-upp-app

# Construir y sincronizar cambios
npm run build
npx cap sync android

# Abrir Android Studio
npx cap open android

# Construir APK desde línea de comandos (requiere Android SDK)
npx cap run android

cd android && ./gradlew assembleDebug