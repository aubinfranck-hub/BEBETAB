package com.bebetab.ui.games

import android.media.*
import android.os.Bundle
import android.speech.tts.TextToSpeech
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.*
import java.util.Locale

private data class Story(val titleFr:String,val titleEn:String,val pagesFr:List<String>,val pagesEn:List<String>)

private val stories=listOf(
    Story("Fanti dans la forêt","Fanti in the Forest",
        listOf(
            "Fanti marche doucement entre les grands arbres de la forêt.",
            "Il rencontre des animaux et apprend à respecter la nature.",
            "Fanti rentre heureux : chaque découverte est une nouvelle aventure."
        ),
        listOf(
            "Fanti walks gently among the tall trees in the forest.",
            "He meets animals and learns to respect nature.",
            "Fanti returns happy: every discovery is a new adventure."
        )),
    Story("Le trésor du désert","The Desert Treasure",
        listOf(
            "Fanti traverse le désert avec sa carte et une grande gourde d’eau.",
            "Il suit les étoiles et découvre un ancien trésor de connaissances.",
            "Le vrai trésor est ce qu’il a appris pendant son voyage."
        ),
        listOf(
            "Fanti crosses the desert with his map and a big bottle of water.",
            "He follows the stars and discovers an old treasure of knowledge.",
            "The real treasure is what he learned during his journey."
        )),
    Story("Le voyage dans l’espace","The Space Voyage",
        listOf(
            "Fanti monte dans une fusée pour explorer les planètes.",
            "Il observe les étoiles, la Lune et les couleurs de l’espace.",
            "Fanti revient avec une idée : le monde est immense et plein de merveilles."
        ),
        listOf(
            "Fanti boards a rocket to explore the planets.",
            "He observes the stars, the Moon and the colors of space.",
            "Fanti returns with an idea: the world is huge and full of wonders."
        ))
)

@Composable
fun StoryReader(language:String="fr", storyIndex:Int=0){
    val context=androidx.compose.ui.platform.LocalContext.current
    var tts by remember{mutableStateOf<TextToSpeech?>(null)}
    val story=stories[storyIndex.coerceIn(stories.indices)]
    DisposableEffect(language){
        lateinit var engine:TextToSpeech
        engine=TextToSpeech(context){status->
            if(status==TextToSpeech.SUCCESS){
                engine.language=if(language=="en") Locale.US else Locale.FRANCE
            }
        }
        tts=engine
        onDispose{engine.stop();engine.shutdown()}
    }
    var page by remember(storyIndex){mutableIntStateOf(0)}
    val pages=if(language=="en") story.pagesEn else story.pagesFr
    Column(
        Modifier.fillMaxSize().padding(18.dp),
        horizontalAlignment=Alignment.CenterHorizontally,
        verticalArrangement=Arrangement.spacedBy(12.dp)
    ){
        Text(if(language=="en")story.titleEn else story.titleFr,fontSize=28.sp,fontWeight=FontWeight.Black)
        Text(when(storyIndex){0->"🌳 🐘 🦁";1->"🏜️ 🐘 🏺";else->"🚀 🐘 🪐"},fontSize=62.sp)
        Surface(
            Modifier.fillMaxWidth().weight(1f),
            shape=RoundedCornerShape(22.dp),
            color=MaterialTheme.colorScheme.surface
        ){
            Box(Modifier.fillMaxSize().padding(20.dp),contentAlignment=Alignment.Center){
                Text(pages[page],fontSize=21.sp,fontWeight=FontWeight.Bold)
            }
        }
        Row(horizontalArrangement=Arrangement.spacedBy(10.dp),verticalAlignment=Alignment.CenterVertically){
            Button(enabled=page>0,onClick={page--}){Text("◀")}
            Button(onClick={tts?.speak(pages[page],TextToSpeech.QUEUE_FLUSH,Bundle(),"page-" + page)}){Text("🔊 "+if(language=="en")"Read" else "Lire")}
            Button(enabled=page<pages.lastIndex,onClick={page++}){Text("▶")}
            Text((page+1).toString()+"/"+pages.size,fontWeight=FontWeight.ExtraBold)
        }
    }
}

@Composable
fun MusicKeyboard(language:String="fr"){
    val keys=if(language=="en")listOf("C","D","E","F","G","A","B","C") else listOf("Do","Ré","Mi","Fa","Sol","La","Si","Do")
    val tones=listOf(
        ToneGenerator.TONE_DTMF_1,ToneGenerator.TONE_DTMF_2,ToneGenerator.TONE_DTMF_3,ToneGenerator.TONE_DTMF_4,
        ToneGenerator.TONE_DTMF_5,ToneGenerator.TONE_DTMF_6,ToneGenerator.TONE_DTMF_7,ToneGenerator.TONE_DTMF_8
    )
    val tone=remember{ToneGenerator(AudioManager.STREAM_MUSIC,85)}
    DisposableEffect(Unit){onDispose{tone.release()}}
    Column(Modifier.fillMaxSize().padding(20.dp),horizontalAlignment=Alignment.CenterHorizontally){
        Text(if(language=="en")"My music keyboard" else "Mon clavier musical",fontSize=28.sp,fontWeight=FontWeight.Black)
        Spacer(Modifier.height(14.dp))
        Row(Modifier.fillMaxWidth().height(190.dp),horizontalArrangement=Arrangement.spacedBy(4.dp)){
            keys.forEachIndexed{i,key->
                Button(onClick={tone.startTone(tones[i],180)},modifier=Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(12.dp)){
                    Text(key,fontSize=17.sp,fontWeight=FontWeight.Black)
                }
            }
        }
        Text(keys.joinToString(" • "),Modifier.padding(top=12.dp),fontWeight=FontWeight.Bold)
    }
}
