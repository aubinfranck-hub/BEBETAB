package com.bebetab.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.ParentSettingsStore
import com.bebetab.data.ProgressStore
import com.bebetab.ui.theme.*
import kotlinx.coroutines.launch

@Composable
fun BebeTabFrame(
    title:String,
    onBack:()->Unit,
    onSettings:()->Unit={},
    subtitle:String?=null,
    content:@Composable ColumnScope.()->Unit
){
    val context=LocalContext.current
    val progress=remember{ProgressStore(context)}
    val settings=remember{ParentSettingsStore(context)}
    val stars by progress.stars.collectAsState(initial=0)
    val childName by settings.childName.collectAsState(initial="Kofi")
    val lang by settings.language.collectAsState(initial="fr")
    val scope=rememberCoroutineScope()
    val level=stars/50+1
    val progressValue=(stars%50)/50f
    val snackbar=remember{SnackbarHostState()}

    Scaffold(
        snackbarHost={SnackbarHost(snackbar)}
    ){insets->
        Column(Modifier.fillMaxSize().background(SkyLight).padding(insets)){
            Surface(
                Modifier.fillMaxWidth().padding(5.dp).shadow(5.dp,RoundedCornerShape(20.dp)),
                shape=RoundedCornerShape(22.dp),color=Color(0xFF1287EA)
            ){
                Row(Modifier.fillMaxWidth().height(58.dp).padding(horizontal=7.dp),verticalAlignment=Alignment.CenterVertically){
                    IconButton(onClick=onBack,modifier=Modifier.size(46.dp).background(Color.White,CircleShape)){
                        Icon(Icons.Default.ArrowBack,null,tint=OutlineBlue)
                    }
                    Spacer(Modifier.width(8.dp))
                    Text(when(title){
                        "EXPLORER LE MONDE","EXPLORE THE WORLD"->"🌍"
                        "FRANCE"->"🇫🇷"
                        "LIVE WORLD","ANIMAL LIVE","CAMÉRAS ANIMAUX"->"📷"
                        "APPRENDRE","LEARN"->"📖"
                        "JOUER","PLAY"->"🎮"
                        "HISTOIRES","STORIES"->"📚"
                        "DESSINER","DRAW"->"🎨"
                        "MES RÉCOMPENSES","MY REWARDS"->"⭐"
                        "MUSIQUE","MUSIC"->"🎵"
                        else->"✨"
                    },fontSize=24.sp)
                    Spacer(Modifier.width(6.dp))
                    Column(Modifier.weight(1f)){
                        Text(title,color=Color.White,fontSize=20.sp,fontWeight=FontWeight.Black,maxLines=1)
                        Text(
                            subtitle ?: when(title){
                                "EXPLORER LE MONDE","EXPLORE THE WORLD"->if(lang=="fr")"Découvre les pays, les cultures, les animaux !" else "Discover countries, cultures and animals!"
                                "FRANCE"->"Europe > France"
                                "LIVE WORLD","ANIMAL LIVE","CAMÉRAS ANIMAUX"->if(lang=="fr")"Regarde le monde en direct !" else "Watch the world live!"
                                "APPRENDRE","LEARN"->if(lang=="fr")"Choisis une matière et commence à apprendre !" else "Choose a subject and start learning!"
                                "JOUER","PLAY"->if(lang=="fr")"Des jeux éducatifs pour apprendre en s'amusant !" else "Educational games to learn while having fun!"
                                "HISTOIRES","STORIES"->if(lang=="fr")"Écoute, lis et vis des histoires avec Fanti !" else "Listen, read and live stories with Fanti!"
                                "DESSINER","DRAW"->if(lang=="fr")"Laisse libre cours à ton imagination !" else "Let your imagination fly!"
                                "MUSIQUE","MUSIC"->if(lang=="fr")"Joue avec les sons et les notes !" else "Play with sounds and notes!"
                                else->if(lang=="fr")"Tes découvertes et récompenses" else "Your discoveries and rewards"
                            },color=Color.White.copy(alpha=.95f),fontSize=9.sp,fontWeight=FontWeight.Bold)
                    }
                    Surface(Modifier.size(42.dp),shape=CircleShape,color=Color.White,shadowElevation=2.dp){FantiMascot(Modifier.fillMaxSize().padding(3.dp))}
                    Spacer(Modifier.width(4.dp))
                    HeaderChip("⭐ $stars")
                    Spacer(Modifier.width(4.dp))
                    IconButton(
                        // Un cadeau par jour : avant, chaque tap donnait +5 étoiles sans limite.
                        onClick={scope.launch{
                            val granted=progress.claimDaily("gift",5)
                            snackbar.showSnackbar(when{
                                granted&&lang=="fr"->"🎁 Cadeau Fanti : +5 étoiles !"
                                granted->"🎁 Fanti gift: +5 stars!"
                                lang=="fr"->"🎁 Reviens demain pour un nouveau cadeau !"
                                else->"🎁 Come back tomorrow for a new gift!"
                            })
                        }},
                        modifier=Modifier.size(38.dp).background(Color.White,CircleShape)
                    ){Icon(Icons.Default.CardGiftcard,null,tint=Color(0xFFFF1744))}
                    Spacer(Modifier.width(7.dp))
                    Column(Modifier.width(90.dp),horizontalAlignment=Alignment.End){
                        Text(if(lang=="fr")"Niveau $level" else "Level $level",color=Color.White,fontWeight=FontWeight.Black,fontSize=9.sp)
                        Text(if(lang=="fr")"Explorateur" else "Explorer",color=Color.White,fontWeight=FontWeight.Bold,fontSize=8.sp)
                        LinearProgressIndicator(progress={progressValue},modifier=Modifier.fillMaxWidth().height(6.dp),color=Yellow,trackColor=Color.White.copy(alpha=.30f))
                    }
                    Spacer(Modifier.width(6.dp))
                    LanguagePill("FR",lang=="fr"){scope.launch{settings.setLanguage("fr")}}
                    Spacer(Modifier.width(3.dp))
                    LanguagePill("EN",lang=="en"){scope.launch{settings.setLanguage("en")}}
                    Spacer(Modifier.width(4.dp))
                    IconButton(onClick=onSettings,modifier=Modifier.size(40.dp).background(Color.White,CircleShape)){
                        Icon(Icons.Default.Settings,null,tint=OutlineBlue)
                    }
                }
            }
            Column(Modifier.fillMaxSize().padding(horizontal=14.dp),content=content)
        }
    }
}

@Composable private fun HeaderChip(text:String){
    Surface(Modifier.height(36.dp),shape=RoundedCornerShape(18.dp),color=Color.White){
        Box(Modifier.padding(horizontal=9.dp),contentAlignment=Alignment.Center){Text(text,color=Color(0xFF17324D),fontSize=10.sp,fontWeight=FontWeight.Black)}
    }
}

@Composable private fun LanguagePill(text:String,selected:Boolean,onClick:()->Unit){
    Surface(onClick=onClick,modifier=Modifier.height(32.dp).border(1.dp,if(selected)Color.White else Color.White.copy(alpha=.7f),RoundedCornerShape(16.dp)),shape=RoundedCornerShape(16.dp),color=if(selected)Yellow else Color.White){
        Box(Modifier.padding(horizontal=9.dp),contentAlignment=Alignment.Center){Text(text,color=OutlineBlue,fontSize=10.sp,fontWeight=FontWeight.Black)}
    }
}
