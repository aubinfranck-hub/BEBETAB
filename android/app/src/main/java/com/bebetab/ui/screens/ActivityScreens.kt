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
fun LearnActivityScreen(onBack:()->Unit){
    val context=LocalContext.current
    val scope=rememberCoroutineScope()
    val store=remember { ProgressStore(context) }
    val award:(Int)->Unit={ n -> scope.launch { store.addStars(n) } }
    BebeTabFrame("APPRENDRE",onBack){
        Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(12.dp)){
            Card(Modifier.weight(1f).fillMaxHeight()){ QuizLettres(award) }
            Card(Modifier.weight(1f).fillMaxHeight()){ QuizNombres(award) }
        }
    }
}

@Composable
fun PlayActivityScreen(onBack:()->Unit){
    val context=LocalContext.current
    val scope=rememberCoroutineScope()
    val store=remember { ProgressStore(context) }
    val award:(Int)->Unit={ n -> scope.launch { store.addStars(n) } }
    BebeTabFrame("JOUER",onBack){ MemoryGame(award) }
}

@Composable
fun StoryActivityScreen(onBack:()->Unit){
    BebeTabFrame("HISTOIRES",onBack){ StoryReader() }
}

@Composable
fun MusicActivityScreen(onBack:()->Unit){
    BebeTabFrame("MUSIQUE",onBack){ MusicKeyboard() }
}

@Composable
fun DrawActivityScreen(onBack:()->Unit){
    BebeTabFrame("DESSINER",onBack){ DrawGame() }
}
