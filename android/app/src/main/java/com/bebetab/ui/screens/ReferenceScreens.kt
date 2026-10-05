package com.bebetab.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.*
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.theme.*
import kotlinx.coroutines.launch

@Composable private fun language():String{val c=LocalContext.current;return remember{ParentSettingsStore(c)}.language.collectAsState(initial="fr").value}

@Composable fun ReferenceScreen(route:String,onBack:()->Unit,onSettings:()->Unit={}){
 when(route){
  "world"->WorldScreen(onBack,onSettings)
  "live"->LiveScreen(onBack,onSettings)
  "rewards"->RewardsScreen(onBack,onSettings)
  else->SimpleScreen(route,onBack)
 }
}
@Composable private fun WorldScreen(onBack:()->Unit,onSettings:()->Unit){
 var selected by remember{mutableStateOf<String?>(null)}
 val lang=language()
 val country=ContentData.countries.firstOrNull{it.id==selected}
 if(country!=null){CountryScreen(country,lang,onBack,onSettings);return}
 BebeTabFrame(if(lang=="en")"EXPLORE THE WORLD" else "EXPLORER LE MONDE",onBack,onSettings){
  Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(12.dp)){
   Card(Modifier.weight(1.25f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){
    Column(Modifier.fillMaxSize().padding(18.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
     Text("🌍",fontSize=125.sp);Text("AFRIQUE • EUROPE • ASIE",fontWeight=FontWeight.Black,color=OutlineBlue);Text("AMÉRIQUES • OCÉANIE",fontWeight=FontWeight.Black,color=OutlineBlue)
     Text(if(lang=="en")"Where do you want to travel?" else "Où veux-tu voyager ?",fontSize=20.sp,fontWeight=FontWeight.Bold)
    }
   }
   Card(Modifier.weight(.9f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){
    Column(Modifier.fillMaxSize().padding(14.dp),verticalArrangement=Arrangement.spacedBy(7.dp)){
     Text(if(lang=="en")"Popular places" else "Lieux populaires",fontSize=22.sp,fontWeight=FontWeight.Black,color=OutlineBlue)
     ContentData.countries.forEach{c->Button(onClick={selected=c.id},modifier=Modifier.fillMaxWidth().height(50.dp),shape=RoundedCornerShape(16.dp)){Text(c.flag+" "+c.name.text(lang),fontWeight=FontWeight.Bold)}}
    }
   }
  }
 }
}
@Composable private fun CountryScreen(country:CountryContent,lang:String,onBack:()->Unit,onSettings:()->Unit){
 val context=LocalContext.current;val scope=rememberCoroutineScope();val store=remember{ProgressStore(context)}
 var awarded by remember(country.id){mutableStateOf(false)}
 BebeTabFrame(country.flag+" "+country.name.text(lang),onBack,onSettings){
  Column(Modifier.fillMaxSize(),verticalArrangement=Arrangement.spacedBy(10.dp)){
   Row(verticalAlignment=Alignment.CenterVertically){Text(country.flag,fontSize=55.sp);Spacer(Modifier.width(12.dp));Column{Text(if(lang=="en")"Discover" else "Découvre",fontSize=27.sp,fontWeight=FontWeight.Black,color=OutlineBlue);Text(country.continent.text(lang),fontWeight=FontWeight.Bold)}}
   Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(8.dp)){country.cards.forEach{card->Card(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(20.dp)){Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text(card.text(lang),fontSize=15.sp,fontWeight=FontWeight.ExtraBold)}}}}
   Card(Modifier.fillMaxWidth(),shape=RoundedCornerShape(18.dp)){Text(country.fact.text(lang)+"  ⭐ +1",Modifier.padding(15.dp),fontWeight=FontWeight.Bold)}
   if(!awarded){Button(onClick={awarded=true;scope.launch{store.addStars(1)}},modifier=Modifier.fillMaxWidth().height(52.dp)){Text(if(lang=="en")"I discovered it! +1 ⭐" else "J’ai découvert ! +1 ⭐")}}
  }
 }
}
@Composable private fun LiveScreen(onBack:()->Unit,onSettings:()->Unit){
 val lang=language()
 BebeTabFrame("LIVE WORLD",onBack,onSettings){
  Column(Modifier.fillMaxSize(),verticalArrangement=Arrangement.spacedBy(10.dp)){
   Text("🔴 "+if(lang=="en")"LIVE • Discover the world" else "EN DIRECT • Découvre le monde",fontSize=22.sp,fontWeight=FontWeight.Black,color=Color.Red)
   listOf("🇫🇷 Paris","🇺🇸 New York","🇯🇵 Tokyo","🇰🇪 Nairobi","🦁 Savane","🐠 Récif corallien").chunked(3).forEach{row->Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(10.dp)){row.forEach{p->Card(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(22.dp)){Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text(p,fontSize=20.sp,fontWeight=FontWeight.Black)}}}}}
  }
 }
}
@Composable private fun RewardsScreen(onBack:()->Unit,onSettings:()->Unit){
 val context=LocalContext.current;val store=remember{ProgressStore(context)};val stars by store.stars.collectAsState(initial=0);val lang=language();val level=stars/50+1;val progress=(stars%50)/50f
 BebeTabFrame(if(lang=="en")"MY REWARDS" else "MES RÉCOMPENSES",onBack,onSettings){
  Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(18.dp),verticalAlignment=Alignment.CenterVertically){
   Card(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){Column(Modifier.fillMaxSize().padding(18.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){Text("⭐",fontSize=80.sp);Text("$stars "+if(lang=="en")"stars" else "étoiles",fontSize=28.sp,fontWeight=FontWeight.Black,color=OutlineBlue);Text((if(lang=="en")"Level $level • Explorer" else "Niveau $level • Explorateur"),fontSize=19.sp,fontWeight=FontWeight.Bold);LinearProgressIndicator(progress={progress},modifier=Modifier.fillMaxWidth().padding(top=12.dp))}}
   Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(12.dp)){listOf(10,50,100,250).forEach{t->Text(if(stars>=t)"🏅 $t "+if(lang=="en")"stars • Unlocked" else "étoiles • Débloqué" else "🔒 $t "+if(lang=="en")"stars" else "étoiles",fontSize=19.sp,fontWeight=FontWeight.ExtraBold)}}
  }
 }
}