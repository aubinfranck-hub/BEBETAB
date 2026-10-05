package com.bebetab.ui.games
import android.media.*;import android.os.Bundle;import android.speech.tts.TextToSpeech
import androidx.compose.foundation.layout.*;import androidx.compose.material3.*;import androidx.compose.runtime.*;import androidx.compose.ui.Alignment;import androidx.compose.ui.Modifier;import androidx.compose.ui.text.font.FontWeight;import androidx.compose.ui.unit.*;import java.util.Locale
@Composable fun StoryReader(language:String="fr"){
 val c=androidx.compose.ui.platform.LocalContext.current;var tts by remember{mutableStateOf<TextToSpeech?>(null)}
 DisposableEffect(language){lateinit var e:TextToSpeech;e=TextToSpeech(c){if(it==TextToSpeech.SUCCESS)e.language=if(language=="en")Locale.US else Locale.FRANCE};tts=e;onDispose{e.stop();e.shutdown()}}
 val a=if(language=="en")listOf("Fanti in the forest. Fanti walks gently among the tall trees.","He discovers animals and learns to respect nature.","Fanti returns happy: every discovery is a new adventure.") else listOf("Fanti dans la forêt. Fanti avance doucement entre les grands arbres.","Il découvre des animaux et apprend à respecter la nature.","Fanti rentre heureux : chaque découverte est une nouvelle aventure.")
 var page by remember{mutableIntStateOf(0)}
 Column(Modifier.fillMaxSize().padding(24.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.spacedBy(16.dp)){Text(if(language=="en")"Fanti in the Forest" else "Fanti dans la forêt",fontSize=30.sp,fontWeight=FontWeight.Black);Text("🌳 🐘 🦁",fontSize=70.sp);Text(a[page],fontSize=22.sp);Row(horizontalArrangement=Arrangement.spacedBy(12.dp)){Button(enabled=page>0,onClick={page--}){Text("◀")};Button(onClick={tts?.speak(a[page],TextToSpeech.QUEUE_FLUSH,Bundle(),"page")}){Text("🔊 "+if(language=="en")"Read" else "Lire")};Button(enabled=page<a.lastIndex,onClick={page++}){Text("▶")}}}
}
@Composable fun MusicKeyboard(language:String="fr"){
 val k=if(language=="en")listOf("C","D","E","F","G","A","B","C") else listOf("Do","Ré","Mi","Fa","Sol","La","Si","Do")
 val t=listOf(ToneGenerator.TONE_DTMF_1,ToneGenerator.TONE_DTMF_2,ToneGenerator.TONE_DTMF_3,ToneGenerator.TONE_DTMF_4,ToneGenerator.TONE_DTMF_5,ToneGenerator.TONE_DTMF_6,ToneGenerator.TONE_DTMF_7,ToneGenerator.TONE_DTMF_8)
 val tone=remember{ToneGenerator(AudioManager.STREAM_MUSIC,85)};DisposableEffect(Unit){onDispose{tone.release()}}
 Column(Modifier.fillMaxSize().padding(20.dp),horizontalAlignment=Alignment.CenterHorizontally){Text(if(language=="en")"My music keyboard" else "Mon clavier musical",fontSize=28.sp,fontWeight=FontWeight.Black);Spacer(Modifier.height(16.dp));Row(Modifier.fillMaxWidth().height(180.dp),horizontalArrangement=Arrangement.spacedBy(4.dp)){k.forEachIndexed{i,x->Button(onClick={tone.startTone(t[i],180)},modifier=Modifier.weight(1f).fillMaxHeight()){Text(x,fontSize=17.sp,fontWeight=FontWeight.Black)}}};Text(k.joinToString(" • "),Modifier.padding(top=12.dp))}
}