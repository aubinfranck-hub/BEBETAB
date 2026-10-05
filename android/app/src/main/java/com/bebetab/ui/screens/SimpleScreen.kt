package com.bebetab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.ui.theme.*

private val labels=mapOf(
    "world" to "EXPLORER LE MONDE",
    "learn" to "APPRENDRE",
    "play" to "JOUER",
    "stories" to "HISTOIRES",
    "live" to "LIVE WORLD",
    "music" to "MUSIQUE",
    "draw" to "DESSINER",
    "rewards" to "MES RÉCOMPENSES"
)

@Composable
fun SimpleScreen(route:String,onBack:()->Unit){
    val title=labels[route] ?: route.uppercase()
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(SkyBlue,SkyLight)))){
        Row(Modifier.padding(14.dp),verticalAlignment=Alignment.CenterVertically){
            IconButton(onClick=onBack){Icon(Icons.Default.ArrowBack,"Retour")}
            Text(title,fontSize=25.sp)
        }
        Column(Modifier.fillMaxSize(),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
            Text("Écran $title",fontSize=30.sp)
            Text("Étape suivante : interface fidèle à la planche",fontSize=16.sp)
        }
    }
}
