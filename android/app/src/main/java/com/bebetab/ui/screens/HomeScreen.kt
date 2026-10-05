package com.bebetab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.ui.theme.*
import com.bebetab.data.ProgressStore
import androidx.compose.ui.platform.LocalContext
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue

data class HomeTile(val route:String,val fr:String,val en:String,val color:Color,val emoji:String)

@Composable
fun HomeScreen(onNavigate:(String)->Unit){
    val context=LocalContext.current
    val progressStore=androidx.compose.runtime.remember { ProgressStore(context) }
    val stars by progressStore.stars.collectAsState(initial=0)
    val level=stars/50+1
    val remainder=stars%50
    val tiles=listOf(
        HomeTile("world","Monde","World",WorldGreen,"🌍"),
        HomeTile("learn","Apprendre","Learn",LearnOrange,"📖"),
        HomeTile("play","Jouer","Play",PlayRed,"🎮"),
        HomeTile("stories","Histoires","Stories",StoriesPurple,"📚"),
        HomeTile("live","Live World","Live",LiveBlue,"📷"),
        HomeTile("music","Musique","Music",MusicPink,"🎵"),
        HomeTile("draw","Dessiner","Draw",DrawYellow,"🎨"),
        HomeTile("rewards","Mes récompenses","Rewards",RewardsGreen,"⭐")
    )
    Box(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(SkyBlue,SkyLight,GroundGold)))){
        Row(Modifier.fillMaxSize().padding(18.dp),horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Column(Modifier.weight(.31f).fillMaxSize(),horizontalAlignment=Alignment.CenterHorizontally){
                Text("BÉBÉ TAB",color=Yellow,fontSize=42.sp,fontWeight=FontWeight.Black)
                Text("Jouer · Apprendre · Découvrir · Explorer",color=OutlineBlue,fontSize=12.sp,fontWeight=FontWeight.Bold)
                Text("⭐ $stars  •  Niveau $level",fontWeight=FontWeight.Black,color=OutlineBlue)
                LinearProgressIndicator(progress={remainder/50f},modifier=Modifier.fillMaxWidth().padding(horizontal=18.dp))
                Spacer(Modifier.height(10.dp))
                Text("🐘",fontSize=115.sp)
                Card(shape=RoundedCornerShape(22.dp),colors=CardDefaults.cardColors(containerColor=Color.White),elevation=CardDefaults.cardElevation(7.dp)){
                    Text("Bonjour ! Hello !\nPrêt pour une nouvelle aventure ?",Modifier.padding(14.dp),fontWeight=FontWeight.Bold,fontSize=16.sp)
                }
            }
            Column(Modifier.weight(.69f).fillMaxSize(),verticalArrangement=Arrangement.spacedBy(10.dp)){
                Row(Modifier.weight(.62f).fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(10.dp)){
                    Card(Modifier.weight(1f).fillMaxSize(),shape=RoundedCornerShape(28.dp),colors=CardDefaults.cardColors(containerColor=Color.White)){
                        Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text("🌍",fontSize=145.sp)}
                    }
                    Card(Modifier.weight(.52f).fillMaxSize(),shape=RoundedCornerShape(28.dp),colors=CardDefaults.cardColors(containerColor=Color.White)){
                        Column(Modifier.fillMaxSize().padding(14.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
                            Text("🔴 EN DIRECT",color=Color.Red,fontWeight=FontWeight.Black)
                            Text("🦒",fontSize=75.sp)
                            Text("LIVE WORLD",fontWeight=FontWeight.Black,color=OutlineBlue)
                            Button(onClick={onNavigate("live")}){Text("▶ Regarder")}
                        }
                    }
                }
                Card(Modifier.fillMaxWidth().weight(.38f),shape=RoundedCornerShape(24.dp),colors=CardDefaults.cardColors(containerColor=Color.White)){
                    Column(Modifier.fillMaxSize().padding(10.dp)){
                        Text("Aujourd'hui avec Fanti",fontWeight=FontWeight.Black,color=OutlineBlue)
                        Row(Modifier.fillMaxWidth().weight(1f),horizontalArrangement=Arrangement.spacedBy(7.dp)){
                            listOf("🎬 1 vidéo","🎮 2 jeux","📖 1 histoire","🎵 1 chanson").forEach{
                                Card(Modifier.weight(1f).fillMaxSize(),shape=RoundedCornerShape(16.dp)){
                                    Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text(it,fontWeight=FontWeight.Bold,fontSize=12.sp)}
                                }
                            }
                        }
                    }
                }
            }
        }
        Row(Modifier.align(Alignment.BottomCenter).fillMaxWidth().padding(18.dp),horizontalArrangement=Arrangement.spacedBy(7.dp)){
            tiles.forEach{tile->
                Button(onClick={onNavigate(tile.route)},Modifier.weight(1f).height(76.dp),shape=RoundedCornerShape(20.dp),colors=ButtonDefaults.buttonColors(containerColor=tile.color)){
                    Column(horizontalAlignment=Alignment.CenterHorizontally){
                        Text(tile.emoji,fontSize=24.sp)
                        Text(tile.fr,fontWeight=FontWeight.Black,fontSize=11.sp)
                        Text(tile.en,fontSize=8.sp)
                    }
                }
            }
        }
    }
}
