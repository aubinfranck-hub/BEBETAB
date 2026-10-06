package com.bebetab

import android.os.Bundle
import android.view.View
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.*
import com.bebetab.data.ParentSettingsStore
import com.bebetab.audio.BebeAudioEngine
import com.bebetab.ui.screens.*
import com.bebetab.ui.theme.BebeTabTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_FULLSCREEN or
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE
        setContent { BebeTabTheme { BebeTabNavigation() } }
    }
}

@Composable
private fun BebeTabNavigation() {
    val nav = rememberNavController()
    val context = LocalContext.current
    val settings = remember { ParentSettingsStore(context) }
    val enabled by settings.timerEnabled.collectAsState(true)
    val minutes by settings.dailyMinutes.collectAsState(60)
    val used by settings.usedSeconds.collectAsState(0)
    val scope = rememberCoroutineScope()
    var locked by remember { mutableStateOf(false) }

    DisposableEffect(Unit) {
        BebeAudioEngine.startMusic()
        onDispose { BebeAudioEngine.release() }
    }

    LaunchedEffect(enabled, minutes, locked) {
        while (enabled && !locked) {
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
            composable("world") { ReferenceScreen("world", { nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("france") { ReferenceScreen("france", { nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("live") { ReferenceScreen("live", { nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("learn") { LearnActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("play") { PlayActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("stories") { StoryActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("draw") { DrawActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("rewards") { ReferenceScreen("rewards", { nav.popBackStack() }, { nav.navigate("settings") }) }
            composable("settings") { SettingsScreen { nav.popBackStack() } }
            composable("music") { MusicActivityScreen({ nav.popBackStack() }, { nav.navigate("settings") }) }
        }
        if (locked) {
            ScreenTimeLock(
                minutes = minutes,
                onUnlock = { scope.launch { settings.resetUsage(); locked = false } },
                onClose = { finishApp(nav) }
            )
        }
    }
}

@Composable
private fun ScreenTimeLock(
    minutes: Int,
    onUnlock: () -> Unit,
    onClose: () -> Unit
) {
    var code by remember { mutableStateOf("") }

    Box(
        modifier = Modifier.fillMaxSize().background(Color.White),
        contentAlignment = Alignment.Center
    ) {
        Card(Modifier.fillMaxWidth(0.7f).padding(24.dp)) {
            Column(
                modifier = Modifier.padding(30.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(14.dp)
            ) {
                Text("⏰", style = MaterialTheme.typography.displaySmall)
                Text("Temps terminé", style = MaterialTheme.typography.headlineMedium)
                Text(
                    "La limite quotidienne de $minutes minutes est atteinte.",
                    style = MaterialTheme.typography.bodyLarge
                )
                Text("Un parent peut déverrouiller la tablette pour continuer.")
                OutlinedTextField(
                    value = code,
                    onValueChange = { code = it.filter(Char::isDigit).take(4) },
                    label = { Text("Code parent") }
                )
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(onClick = { if (code == "2580") onUnlock() }) { Text("Continuer") }
                    OutlinedButton(onClick = onClose) { Text("Fermer") }
                }
            }
        }
    }
}

private fun finishApp(nav: NavHostController) {
    nav.navigate("home") { popUpTo("home") { inclusive = true } }
}
