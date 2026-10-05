package com.bebetab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.navigation.NavHostController
import androidx.navigation.compose.*
import com.bebetab.data.ParentSettingsStore
import com.bebetab.ui.screens.*
import com.bebetab.ui.theme.BebeTabTheme
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent { BebeTabTheme { BebeTabNavigation() } }
    }
}

@Composable
private fun BebeTabNavigation() {
    val navController = rememberNavController()
    val context = androidx.compose.ui.platform.LocalContext.current
    val settings = remember { ParentSettingsStore(context) }
    val timerEnabled by settings.timerEnabled.collectAsState(initial = true)
    val dailyMinutes by settings.dailyMinutes.collectAsState(initial = 60)
    val usedSeconds by settings.usedSeconds.collectAsState(initial = 0)
    val scope = rememberCoroutineScope()
    var locked by remember { mutableStateOf(false) }

    LaunchedEffect(timerEnabled, dailyMinutes) {
        while (timerEnabled && !locked) {
            delay(15000)
            scope.launch { settings.addUsageSeconds(15) }
        }
    }
    LaunchedEffect(usedSeconds, timerEnabled, dailyMinutes) {
        if (timerEnabled && usedSeconds >= dailyMinutes * 60) locked = true
    }

    Box(Modifier.fillMaxSize()) {
        NavHost(navController = navController, startDestination = "home", modifier = Modifier.fillMaxSize()) {
            composable("home") { HomeScreen { navController.navigate(it) } }
            composable("learn") { LearnActivityScreen({ navController.popBackStack() }, { navController.navigate("settings") }) }
            composable("play") { PlayActivityScreen({ navController.popBackStack() }, { navController.navigate("settings") }) }
            composable("stories") { StoryActivityScreen({ navController.popBackStack() }, { navController.navigate("settings") }) }
            composable("music") { MusicActivityScreen({ navController.popBackStack() }, { navController.navigate("settings") }) }
            composable("draw") { DrawActivityScreen({ navController.popBackStack() }, { navController.navigate("settings") }) }
            composable("settings") { SettingsScreen { navController.popBackStack() } }
            listOf("world","live","rewards").forEach { route ->
                composable(route) { ReferenceScreen(route, { navController.popBackStack() }, { navController.navigate("settings") }) }
            }
        }
        if (locked) {
            ScreenTimeLock(
                minutes = dailyMinutes,
                onParentUnlock = { scope.launch { settings.resetUsage(); locked = false } },
                onClose = { finishApp(navController) }
            )
        }
    }
}

@Composable
private fun ScreenTimeLock(minutes: Int, onParentUnlock: () -> Unit, onClose: () -> Unit) {
    var code by remember { mutableStateOf("") }
    Box(Modifier.fillMaxSize().background(Color.White),contentAlignment=Alignment.Center) {
        Card(Modifier.fillMaxWidth(.7f).padding(24.dp)) {
            Column(Modifier.padding(30.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.spacedBy(14.dp)) {
                Text("⏰",style=MaterialTheme.typography.displaySmall)
                Text("Temps terminé",style=MaterialTheme.typography.headlineMedium)
                Text("La limite quotidienne de $minutes minutes est atteinte.",style=MaterialTheme.typography.bodyLarge)
                Text("Un parent peut déverrouiller la tablette pour continuer.")
                OutlinedTextField(value=code,onValueChange={code=it.filter(Char::isDigit).take(4)},label={Text("Code parent")})
                Row(horizontalArrangement=Arrangement.spacedBy(12.dp)) {
                    Button(onClick={if(code=="2580") onParentUnlock()}) { Text("Continuer") }
                    OutlinedButton(onClick=onClose) { Text("Fermer") }
                }
            }
        }
    }
}

private fun finishApp(navController: NavHostController) {
    navController.navigate("home") { popUpTo("home") { inclusive = true } }
}
