package com.bebetab

import android.app.Activity
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsCompat
import androidx.core.view.WindowInsetsControllerCompat
import androidx.navigation.compose.*
import com.bebetab.audio.BebeAudioEngine
import com.bebetab.data.ParentSettingsStore
import com.bebetab.ui.components.ParentCodeEntry
import com.bebetab.ui.screens.*
import com.bebetab.ui.theme.BebeTabTheme
import com.bebetab.update.AutoUpdateOverlay
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    // Vrai quand l'application est visible : la musique et le compteur de temps d'écran s'arrêtent sinon.
    private val inForeground = mutableStateOf(true)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enterImmersiveMode()
        setContent { BebeTabTheme { BebeTabNavigation(inForeground.value) } }
    }

    override fun onStart() {
        super.onStart()
        inForeground.value = true
    }

    override fun onStop() {
        super.onStop()
        inForeground.value = false
    }

    // Le clavier (saisie du code parent) fait réapparaître les barres système : on les recache au retour.
    override fun onWindowFocusChanged(hasFocus: Boolean) {
        super.onWindowFocusChanged(hasFocus)
        if (hasFocus) enterImmersiveMode()
    }

    private fun enterImmersiveMode() {
        WindowCompat.setDecorFitsSystemWindows(window, false)
        WindowInsetsControllerCompat(window, window.decorView).apply {
            systemBarsBehavior = WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
            hide(WindowInsetsCompat.Type.systemBars())
        }
    }
}

@Composable
private fun BebeTabNavigation(inForeground: Boolean) {
    val nav = rememberNavController()
    val context = LocalContext.current
    val settings = remember { ParentSettingsStore(context) }
    val enabled by settings.timerEnabled.collectAsState(true)
    val minutes by settings.dailyMinutes.collectAsState(60)
    val used by settings.usedSeconds.collectAsState(0)
    val musicEnabled by settings.musicEnabled.collectAsState(true)
    val language by settings.language.collectAsState("fr")
    val scope = rememberCoroutineScope()
    var locked by remember { mutableStateOf(false) }

    DisposableEffect(Unit) {
        onDispose { BebeAudioEngine.release() }
    }

    // La musique ne joue que si le parent ne l'a pas coupée, que l'application est visible
    // et que l'écran n'est pas verrouillé (avant, elle continuait en arrière-plan).
    LaunchedEffect(musicEnabled, inForeground, locked) {
        if (musicEnabled && inForeground && !locked) BebeAudioEngine.startMusic() else BebeAudioEngine.pauseMusic()
    }

    // Le temps d'écran ne compte que lorsque l'application est visible.
    LaunchedEffect(enabled, minutes, locked, inForeground) {
        while (enabled && !locked && inForeground) {
            delay(15000)
            settings.addUsageSeconds(15)
        }
    }

    LaunchedEffect(used, enabled, minutes) {
        if (enabled && used >= minutes * 60) locked = true
    }

    Box(Modifier.fillMaxSize()) {
        NavHost(nav, startDestination = "home", modifier = Modifier.fillMaxSize()) {
            composable("home") { HomeScreen { nav.navigate(it) } }
            composable("world") { ReferenceScreen("world", { nav.popBackStack() }, { nav.navigate("settings") }, { nav.navigate(it) }) }
            composable("france") { ReferenceScreen("france", { nav.popBackStack() }, { nav.navigate("settings") }, { nav.navigate(it) }) }
            composable("live") { ReferenceScreen("live", { nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("learn") { LearnActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("play") { PlayActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("stories") { StoryActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("draw") { DrawActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }, { nav.navigate(it) }) }
            composable("rewards") { ReferenceScreen("rewards", { nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("settings") { SettingsScreen { nav.popBackStack() } }
            composable("music") { MusicActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
        }
        if (!locked) AutoUpdateOverlay()
        if (locked) {
            ScreenTimeLock(
                minutes = minutes,
                language = language,
                onUnlock = { scope.launch { settings.resetUsage(); locked = false } },
                onClose = { finishApp(context) }
            )
        }
    }
}

@Composable
private fun ScreenTimeLock(
    minutes: Int,
    language: String,
    onUnlock: () -> Unit,
    onClose: () -> Unit
) {
    val en = language == "en"
    // Le bouton retour ne doit pas permettre de sortir de l'écran de verrouillage.
    BackHandler(enabled = true) {}

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
            // Sans ce gestionnaire, un Box ne bloque pas les touches : les taps traversaient
            // l'écran blanc et l'enfant pouvait continuer à jouer « à l'aveugle » en dessous.
            .pointerInput(Unit) { detectTapGestures { } },
        contentAlignment = Alignment.Center
    ) {
        Card(Modifier.fillMaxWidth(0.7f).padding(24.dp)) {
            Column(
                modifier = Modifier.padding(30.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text("⏰", style = MaterialTheme.typography.displaySmall)
                Text(if (en) "Time is up" else "Temps terminé", style = MaterialTheme.typography.headlineMedium)
                Text(
                    if (en) "The daily limit of $minutes minutes has been reached."
                    else "La limite quotidienne de $minutes minutes est atteinte.",
                    style = MaterialTheme.typography.bodyLarge
                )
                Text(
                    if (en) "A parent can unlock the tablet to continue."
                    else "Un parent peut déverrouiller la tablette pour continuer."
                )
                ParentCodeEntry(language, if (en) "Continue" else "Continuer", onUnlock)
                OutlinedButton(onClick = onClose) { Text(if (en) "Close" else "Fermer") }
            }
        }
    }
}

private fun finishApp(context: android.content.Context) {
    // LocalContext peut être enveloppé (ContextWrapper) : on remonte jusqu'à l'Activity.
    var current: android.content.Context? = context
    while (current is android.content.ContextWrapper) {
        if (current is Activity) {
            current.finish()
            return
        }
        current = current.baseContext
    }
}
