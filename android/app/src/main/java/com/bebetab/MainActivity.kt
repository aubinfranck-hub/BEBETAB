package com.bebetab

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.foundation.layout.fillMaxSize
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.bebetab.ui.screens.HomeScreen
import com.bebetab.ui.screens.ReferenceScreen
import com.bebetab.ui.screens.LearnActivityScreen
import com.bebetab.ui.screens.PlayActivityScreen
import com.bebetab.ui.screens.StoryActivityScreen
import com.bebetab.ui.screens.MusicActivityScreen
import com.bebetab.ui.screens.DrawActivityScreen
import com.bebetab.ui.theme.BebeTabTheme

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
    NavHost(navController = navController, startDestination = "home", modifier = Modifier.fillMaxSize()) {
        composable("home") { HomeScreen { navController.navigate(it) } }
        listOf("world","learn","play","stories","live","music","draw","rewards").forEach { route ->
            composable(route) { when(route) {
                "learn" -> LearnActivityScreen { navController.popBackStack() }
                "play" -> PlayActivityScreen { navController.popBackStack() }
                "stories" -> StoryActivityScreen { navController.popBackStack() }
                "music" -> MusicActivityScreen { navController.popBackStack() }
                "draw" -> DrawActivityScreen { navController.popBackStack() }
                else -> ReferenceScreen(route) { navController.popBackStack() }
            } }
        }
    }
}
