package com.bebetab.ui.games

import android.media.AudioManager
import android.media.ToneGenerator
import android.speech.tts.TextToSpeech
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import java.util.Locale

@Composable
fun StoryReader(){
    val context=androidx.compose.ui.platform.LocalContext.current
    var tts by remember{mutableStateOf<TextToSpeech?>(null)}
    DisposableEffect(Unit){
        lateinit var engine: TextToSpeech
        engine=TextToSpeech(context){ if(it==TextToSpeech.SUCCESS) engine.language=Locale.FRANCE }
        tts=engine
        onDispose{engine.stop();engine.shutdown()}
    }
    var page by remember{mutableIntStateOf(0)}
    val pages=listOf(
        "Fanti dans la forêt. Fanti avance doucement entre les grands arbres.",
        "Il découvre des animaux et apprend à respecter la nature.",
        "Fanti rentre heureux : chaque découverte est une nouvelle aventure."
    )
    Column(Modifier.fillMaxSize().padding(30.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.spacedBy(22.dp)){
        Text("Fanti dans la forêt",fontSize=30.sp,fontWeight=FontWeight.Black)
        Text("🌳 🐘 🦁",fontSize=70.sp)
        Text(pages[page],fontSize=23.sp)
        Row(horizontalArrangement=Arrangement.spacedBy(12.dp)){
            Button(enabled=page>0,onClick={page--}){Text("◀")}
            Button(onClick={tts?.speak(pages[page],TextToSpeech.QUEUE_FLUSH,null,"page",null) ?: Unit}){Text("🔊 Lire")}
            Button(enabled=page<pages.lastIndex,onClick={page++}){Text("▶")}
        }
    }
}

@Composable
fun MusicKeyboard(){
    val keys=listOf("Do","Ré","Mi","Fa","Sol","La","Si","Do")
    val toneGenerator=remember{ToneGenerator(AudioManager.STREAM_MUSIC,85)}
    DisposableEffect(Unit){ onDispose{toneGenerator.release()} }
    Column(Modifier.fillMaxSize().padding(20.dp),horizontalAlignment=Alignment.CenterHorizontally){
        Text("Mon clavier musical",fontSize=28.sp,fontWeight=FontWeight.Black)
        Spacer(Modifier.height(16.dp))
        Row(Modifier.fillMaxWidth().height(180.dp),horizontalArrangement=Arrangement.spacedBy(4.dp)){
            keys.forEachIndexed{index,key->
                Button(onClick={ toneGenerator.startTone(ToneGenerator.TONE_PROP_BEEP,180) },modifier=Modifier.weight(1f).fillMaxHeight()){
                    Text(key,fontSize=17.sp,fontWeight=FontWeight.Black)
                }
            }
        }
        Text("Do • Ré • Mi • Fa • Sol • La • Si • Do",modifier=Modifier.padding(top=12.dp))
    }
}
