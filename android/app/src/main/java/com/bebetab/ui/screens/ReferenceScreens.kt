package com.bebetab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.theme.*

@Composable
fun ReferenceScreen(route:String,onBack:()->Unit){
    when(route){
        "world" -> WorldScreen(onBack)
        "learn" -> CategoryScreen("APPRENDRE","8 matières",listOf("🔤 Lettres","🔢 Nombres","🔬 Sciences","🌍 Monde","🐾 Animaux","🚀 Espace","🎨 Art","🗣 Langues"),onBack)
        "play" -> CategoryScreen("JOUER","8 jeux",listOf("🧩 Puzzles","➕ Maths","🗺 Géographie","🐘 Animaux","🧠 Mémoire","💡 Logique","🇫🇷 Français","🇬🇧 English"),onBack)
        "stories" -> CategoryScreen("HISTOIRES","Histoires de Fanti",listOf("🌳 Fanti dans la forêt","🏜️ Le trésor du désert","🚀 Voyage dans l'espace"),onBack)
        "live" -> LiveScreen(onBack)
        "music" -> CategoryScreen("MUSIQUE","Crée ta musique",listOf("🎹 Do","🎹 Ré","🎹 Mi","🎹 Fa","🎹 Sol","🎹 La","🎹 Si","🎹 Do"),onBack)
        "draw" -> CategoryScreen("DESSINER","Choisis une activité",listOf("✏️ Dessin libre","🖍️ Coloriage","🔤 Tracer les lettres","🔢 Tracer les nombres","🔷 Formes","🎵 Créer de la musique"),onBack)
        "rewards" -> RewardsScreen(onBack)
        else -> SimpleScreen(route,onBack)
    }
}

@Composable
private fun WorldScreen(onBack:()->Unit){
    BebeTabFrame("EXPLORER LE MONDE",onBack){
        Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Card(Modifier.weight(1.35f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){
                Column(Modifier.fillMaxSize().padding(18.dp),horizontalAlignment=Alignment.CenterHorizontally){
                    Text("🌍",fontSize=150.sp)
                    Text("AFRIQUE     EUROPE     ASIE",fontWeight=FontWeight.Black,color=OutlineBlue)
                    Text("AMÉRIQUES     OCÉANIE",fontWeight=FontWeight.Black,color=OutlineBlue)
                    Spacer(Modifier.height(8.dp))
                    Text("Bonjour ! Où veux-tu voyager ?",fontWeight=FontWeight.Bold,fontSize=20.sp)
                }
            }
            Card(Modifier.weight(.75f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){
                Column(Modifier.fillMaxSize().padding(18.dp),verticalArrangement=Arrangement.spacedBy(10.dp)){
                    Text("Lieux populaires",fontSize=23.sp,fontWeight=FontWeight.Black,color=OutlineBlue)
                    listOf("🇫🇷 Paris","🇺🇸 New York","🇰🇪 Nairobi","🇯🇵 Tokyo","🇪🇬 Le Caire").forEach{place->
                        Button(onClick={},modifier=Modifier.fillMaxWidth().height(52.dp),shape=RoundedCornerShape(18.dp)){Text(place,fontWeight=FontWeight.Bold)}
                    }
                }
            }
        }
    }
}

@Composable
private fun CategoryScreen(title:String,subtitle:String,items:List<String>,onBack:()->Unit){
    BebeTabFrame(title,onBack){
        Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(16.dp)){
            Column(Modifier.weight(.27f).fillMaxHeight(),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
                Text("🐘",fontSize=125.sp)
                Text("Je suis Fanti !",fontWeight=FontWeight.Black,color=OutlineBlue,fontSize=20.sp)
            }
            Column(Modifier.weight(.73f).fillMaxHeight(),verticalArrangement=Arrangement.spacedBy(10.dp)){
                Text(subtitle,fontSize=22.sp,fontWeight=FontWeight.Black,color=OutlineBlue)
                items.chunked(4).forEach{row->
                    Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(10.dp)){
                        row.forEach{item->
                            Card(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(22.dp),colors=CardDefaults.cardColors(containerColor=Color.White)){
                                Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text(item,fontSize=16.sp,fontWeight=FontWeight.ExtraBold)}
                            }
                        }
                        repeat(4-row.size){Spacer(Modifier.weight(1f))}
                    }
                }
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
    BebeTabFrame("MES RÉCOMPENSES",onBack){
        Row(Modifier.fillMaxSize(),horizontalArrangement=Arrangement.spacedBy(18.dp),verticalAlignment=Alignment.CenterVertically){
            Card(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(28.dp)){
                Column(Modifier.fillMaxSize(),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
                    Text("⭐",fontSize=100.sp)
                    Text("2 450 étoiles",fontSize=28.sp,fontWeight=FontWeight.Black,color=OutlineBlue)
                    Text("Niveau 3 • Explorateur",fontSize=19.sp,fontWeight=FontWeight.Bold)
                }
            }
            Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(12.dp)){
                listOf("🏅 10 étoiles","🏅 50 étoiles","🏅 100 étoiles","🏆 250 étoiles").forEach{Text(it,fontSize=22.sp,fontWeight=FontWeight.ExtraBold)}
            }
        }
    }
}
