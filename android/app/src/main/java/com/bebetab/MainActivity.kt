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
import com.bebetab.ui.screens.SimpleScreen
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
            composable(route) { SimpleScreen(route) { navController.popBackStack() } }
        }
    }
}
