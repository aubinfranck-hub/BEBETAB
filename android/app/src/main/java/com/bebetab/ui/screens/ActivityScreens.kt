package com.bebetab.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import com.bebetab.data.*
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.games.*
import kotlinx.coroutines.launch

@Composable private fun currentLanguage():String{
 val context=LocalContext.current
 return remember{ParentSettingsStore(context)}.language.collectAsState(initial="fr").value
}

@Composable
fun LearnActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
 val language=currentLanguage()
 val context=LocalContext.current
 val scope=rememberCoroutineScope()
 val store=remember{ProgressStore(context)}
 BebeTabFrame(if(language=="en")"LEARN" else "APPRENDRE",onBack,onSettings){
  Row(Modifier.fillMaxSize().padding(4.dp),horizontalArrangement=Arrangement.spacedBy(10.dp)){
   ContentData.subjects.chunked(4).forEach{row->
    Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(10.dp)){
     row.forEach{item->
      Card(Modifier.weight(1f).fillMaxWidth(),shape=RoundedCornerShape(22.dp)){
       Column(Modifier.fillMaxSize().padding(10.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
        Text(item.emoji,fontSize=30.sp)
        Text(item.title.text(language),fontSize=18.sp,fontWeight=FontWeight.Black)
        Text(item.description.text(language),fontSize=10.sp)
        if(item.id=="letters") Button(onClick={scope.launch{store.addStars(2)}}){Text(if(language=="en")"+2 ⭐" else "+2 ⭐")}
        if(item.id=="numbers") Button(onClick={scope.launch{store.addStars(2)}}){Text(if(language=="en")"+2 ⭐" else "+2 ⭐")}
       }
      }
     }
    }
   }
  }
 }
}

@Composable
fun PlayActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
 val language=currentLanguage()
 val context=LocalContext.current
 val scope=rememberCoroutineScope()
 val store=remember{ProgressStore(context)}
 BebeTabFrame(if(language=="en")"PLAY" else "JOUER",onBack,onSettings){
  Row(Modifier.fillMaxSize().padding(4.dp),horizontalArrangement=Arrangement.spacedBy(10.dp)){
   Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(10.dp)){
    ContentData.games.take(4).forEach{GameCard(it,language)}
   }
   Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(10.dp)){
    ContentData.games.drop(4).forEach{item->
     if(item.id=="memory") MemoryGame{n->scope.launch{store.addStars(n)}}
     else GameCard(item,language)
    }
   }
  }
 }
}

@Composable private fun GameCard(item:ActivityContent,language:String){
 Card(Modifier.fillMaxWidth().weight(1f),shape=RoundedCornerShape(22.dp)){
  Row(Modifier.fillMaxSize().padding(12.dp),verticalAlignment=Alignment.CenterVertically){
   Text(item.emoji,fontSize=30.sp)
   Spacer(Modifier.width(10.dp))
   Column{Text(item.title.text(language),fontSize=19.sp,fontWeight=FontWeight.Black);Text(item.description.text(language),fontSize=11.sp)}
  }
 }
}

@Composable fun StoryActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
 val language=currentLanguage()
 BebeTabFrame(if(language=="en")"STORIES" else "HISTOIRES",onBack,onSettings){StoryReader(language)}
}
@Composable fun MusicActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
 val language=currentLanguage()
 BebeTabFrame(if(language=="en")"MUSIC" else "MUSIQUE",onBack,onSettings){MusicKeyboard(language)}
}
@Composable fun DrawActivityScreen(onBack:()->Unit,onSettings:()->Unit={}){
 val language=currentLanguage()
 BebeTabFrame(if(language=="en")"DRAW" else "DESSINER",onBack,onSettings){DrawGame(language)}
}