package com.bebetab.ui.screens

import androidx.compose.foundation.background
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
import com.bebetab.data.ProgressStore
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun ReferenceScreen(route:String,onBack:()->Unit){
    when(route){
        "world" -> WorldScreen(onBack)
        "live" -> LiveScreen(onBack)
        "rewards" -> RewardsScreen(onBack)
        else -> SimpleScreen(route,onBack)
    }
}

@Composable
private fun WorldScreen(onBack:()->Unit){
    var france by remember{mutableStateOf(false)}
    if(france){ CountryFranceScreen{france=false}; return }
    BebeTabFrame("EXPLORER LE MONDE",onBack){
        Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Card(Modifier.weight(1.35f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){
                Column(Modifier.fillMaxSize().padding(18.dp),horizontalAlignment=Alignment.CenterHorizontally){
                    Text("🌍",fontSize=145.sp)
                    Text("AFRIQUE     EUROPE     ASIE",fontWeight=FontWeight.Black,color=OutlineBlue)
                    Text("AMÉRIQUES     OCÉANIE",fontWeight=FontWeight.Black,color=OutlineBlue)
                    Spacer(Modifier.height(12.dp))
                    Text("Bonjour ! Où veux-tu voyager ?",fontWeight=FontWeight.Bold,fontSize=20.sp)
                    Spacer(Modifier.height(10.dp))
                    Button(onClick={france=true},modifier=Modifier.height(54.dp),shape=RoundedCornerShape(20.dp),colors=ButtonDefaults.buttonColors(containerColor=LearnOrange)){
                        Text("🇫🇷 Découvrir la France",fontWeight=FontWeight.Black)
                    }
                }
            }
            Card(Modifier.weight(.75f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){
                Column(Modifier.fillMaxSize().padding(18.dp),verticalArrangement=Arrangement.spacedBy(10.dp)){
                    Text("Lieux populaires",fontSize=23.sp,fontWeight=FontWeight.Black,color=OutlineBlue)
                    listOf("🇫🇷 Paris","🇺🇸 New York","🇰🇪 Nairobi","🇯🇵 Tokyo","🇪🇬 Le Caire").forEach{place->
                        Button(onClick={if(place.contains("Paris")) france=true},modifier=Modifier.fillMaxWidth().height(52.dp),shape=RoundedCornerShape(18.dp)){Text(place,fontWeight=FontWeight.Bold)}
                    }
                }
            }
        }
    }
}

@Composable
private fun CountryFranceScreen(onBack:()->Unit){
    BebeTabFrame("FRANCE 🇫🇷",onBack){
        Column(Modifier.fillMaxSize(),verticalArrangement=Arrangement.spacedBy(12.dp)){
            Row(Modifier.fillMaxWidth(),verticalAlignment=Alignment.CenterVertically){
                Text("🇫🇷",fontSize=60.sp)
                Spacer(Modifier.width(14.dp))
                Column{Text("Découvre la France",fontSize=28.sp,fontWeight=FontWeight.Black,color=OutlineBlue);Text("Europe • Paris • Tour Eiffel",fontWeight=FontWeight.Bold)}
            }
            Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(10.dp)){
                listOf("🗼 Tour Eiffel","🥐 Gastronomie","🎨 Art","⚽ Sports","🏰 Monuments","🗺️ Régions").forEach{item->
                    Card(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(20.dp),colors=CardDefaults.cardColors(containerColor=Color.White)){
                        Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text(item,fontSize=16.sp,fontWeight=FontWeight.ExtraBold)}
                    }
                }
            }
            Card(Modifier.fillMaxWidth(),shape=RoundedCornerShape(20.dp)){
                Text("La France est un pays d'Europe. Sa capitale est Paris. ⭐ +1",modifier=Modifier.padding(18.dp),fontWeight=FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun LiveScreen(onBack:()->Unit){
    BebeTabFrame("LIVE WORLD",onBack){
        Column(Modifier.fillMaxSize(),verticalArrangement=Arrangement.spacedBy(12.dp)){
            Text("🔴 EN DIRECT  •  Découvre le monde",fontSize=22.sp,fontWeight=FontWeight.Black,color=Color.Red)
            val places=listOf("🇫🇷 Paris","🇺🇸 New York","🇯🇵 Tokyo","🇰🇪 Nairobi","🦁 Savane","🐠 Récif corallien")
            places.chunked(3).forEach{row->
                Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(12.dp)){
                    row.forEach{p->Card(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(24.dp)){Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text(p,fontSize=21.sp,fontWeight=FontWeight.Black)}}}
                }
            }
        }
    }
}

@Composable
private fun RewardsScreen(onBack:()->Unit){
    val context=LocalContext.current
    val store=remember{ProgressStore(context)}
    val stars by store.stars.collectAsState(initial=0)
    val level=stars/50+1
    val progress=(stars%50)/50f
    BebeTabFrame("MES RÉCOMPENSES",onBack){
        Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(18.dp),verticalAlignment=Alignment.CenterVertically){
            Card(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){
                Column(Modifier.fillMaxSize().padding(18.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
                    Text("⭐",fontSize=90.sp)
                    Text("$stars étoiles",fontSize=28.sp,fontWeight=FontWeight.Black,color=OutlineBlue)
                    Text("Niveau $level • Explorateur",fontSize=19.sp,fontWeight=FontWeight.Bold)
                    LinearProgressIndicator(progress={progress},modifier=Modifier.fillMaxWidth().padding(top=12.dp))
                }
            }
            Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(12.dp)){
                listOf(10,50,100,250).forEach{threshold->
                    val unlocked=stars>=threshold
                    Text(if(unlocked)"🏅 $threshold étoiles • Débloqué" else "🔒 $threshold étoiles",fontSize=20.sp,fontWeight=FontWeight.ExtraBold)
                }
            }
        }
    }
}
