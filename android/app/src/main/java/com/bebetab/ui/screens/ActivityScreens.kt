package com.bebetab.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.games.*
import com.bebetab.data.ProgressStore
import androidx.compose.ui.platform.LocalContext
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import kotlinx.coroutines.launch

@Composable
fun LearnActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
    val context=LocalContext.current
    val scope=rememberCoroutineScope()
    val store=remember { ProgressStore(context) }
    val award:(Int)->Unit={ n -> scope.launch { store.addStars(n) } }
    BebeTabFrame("APPRENDRE",onBack,onSettings){
        Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(12.dp)){
            Card(Modifier.weight(1f).fillMaxHeight()){ QuizLettres(award) }
            Card(Modifier.weight(1f).fillMaxHeight()){ QuizNombres(award) }
        }
    }
}

@Composable
fun PlayActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
    val context=LocalContext.current
    val scope=rememberCoroutineScope()
    val store=remember { ProgressStore(context) }
    val award:(Int)->Unit={ n -> scope.launch { store.addStars(n) } }
    BebeTabFrame("JOUER",onBack,onSettings){ MemoryGame(award) }
}

@Composable
fun StoryActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
    BebeTabFrame("HISTOIRES",onBack,onSettings){ StoryReader() }
}

@Composable
fun MusicActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
    BebeTabFrame("MUSIQUE",onBack,onSettings){ MusicKeyboard() }
}

@Composable
fun DrawActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
    BebeTabFrame("DESSINER",onBack,onSettings){ DrawGame() }
}
