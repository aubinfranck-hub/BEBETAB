package com.bebetab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.ui.components.Artwork
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.data.ParentSettingsStore
import com.bebetab.data.ProgressStore
import com.bebetab.ui.games.QuizLettres
import com.bebetab.ui.games.QuizNombres
import kotlinx.coroutines.launch
import java.net.URLEncoder

@Composable
private fun DiscoveryLayout(art:String,content:@Composable ColumnScope.()->Unit){
    Row(Modifier.fillMaxSize().padding(12.dp),horizontalArrangement=Arrangement.spacedBy(16.dp)){
        Surface(Modifier.weight(.85f).fillMaxHeight(),shape=RoundedCornerShape(24.dp),color=Color(0xFFD5EEFF)){
            Artwork(art,Modifier.fillMaxSize())
        }
        Column(Modifier.weight(1.4f).fillMaxHeight().verticalScroll(rememberScrollState()),verticalArrangement=Arrangement.spacedBy(12.dp),content=content)
    }
}

@Composable
fun DiscoveryQuizScreen(onBack:()->Unit,onSettings:()->Unit){
    val context=LocalContext.current
    val lang by remember{ParentSettingsStore(context)}.language.collectAsState(initial="fr")
    val store=remember{ProgressStore(context)}
    val scope=rememberCoroutineScope()
    var selected by remember{mutableStateOf<String?>(null)}
    BebeTabFrame(if(lang=="en")"QUIZ" else "QUIZ",{if(selected!=null)selected=null else onBack()},onSettings){
        if(selected=="letters") QuizLettres({scope.launch{store.addStars(it)}},lang)
        else if(selected=="numbers") QuizNombres({scope.launch{store.addStars(it)}},lang)
        else DiscoveryLayout("quiz"){
            Text(if(lang=="en")"Choose your challenge" else "Choisis ton défi",fontSize=25.sp,fontWeight=FontWeight.Black)
            Button(onClick={selected="letters"},modifier=Modifier.fillMaxWidth().height(86.dp),shape=RoundedCornerShape(22.dp)){Text(if(lang=="en")"🔤 Letters" else "🔤 Lettres",fontSize=23.sp)}
            Button(onClick={selected="numbers"},modifier=Modifier.fillMaxWidth().height(86.dp),shape=RoundedCornerShape(22.dp)){Text(if(lang=="en")"🔢 Numbers" else "🔢 Nombres",fontSize=23.sp)}
            Text(if(lang=="en")"Each correct answer earns stars." else "Chaque bonne réponse rapporte des étoiles.",fontSize=16.sp)
        }
    }
}

@Composable
fun ChallengeScreen(onBack:()->Unit,onNavigate:(String)->Unit,onSettings:()->Unit){
    val context=LocalContext.current
    val scope=rememberCoroutineScope()
    val challenge=remember{com.bebetab.data.ChallengeStore(context)}
    val store=remember{ProgressStore(context)}
    val stars by store.stars.collectAsState(initial=0)
    val state by challenge.state.collectAsState(initial=com.bebetab.data.MissionState())
    BebeTabFrame("DÉFIS DU JOUR",onBack,onSettings){DiscoveryLayout("challenges"){
        Text("Tes missions du jour",fontSize=25.sp,fontWeight=FontWeight.Black)
        listOf("learn" to "📖 Apprendre et réussir un quiz", "play" to "🎮 Jouer et gagner des étoiles").forEach{(route,title)->
            val done=state.claimed.contains(route)
            val ready=state.pending==route && stars>state.baseline
            Surface(shape=RoundedCornerShape(20.dp),color=Color.White,shadowElevation=2.dp){Column(Modifier.fillMaxWidth().padding(16.dp)){
                Text(title,fontSize=18.sp,fontWeight=FontWeight.Bold)
                Text(if(done)"Mission accomplie !" else "Termine une activité pour gagner 5 étoiles.",fontSize=13.sp)
                Spacer(Modifier.height(8.dp))
                Button(enabled=!done,onClick={scope.launch{if(ready){if(challenge.claim(route))store.addStars(5)}else{challenge.begin(route,stars);onNavigate(route)}}}){
                    Text(if(done)"✓ Terminée" else if(ready)"Recevoir +5 étoiles" else "Commencer")
                }
            }}
        }
        OutlinedButton(onClick={onNavigate("rewards")}){Text("⭐ Voir mes récompenses")}
    }}
}

@Composable
fun WorldsHubScreen(onBack:()->Unit,onNavigate:(String)->Unit,onSettings:()->Unit){
    BebeTabFrame("MES MONDES",onBack,onSettings){DiscoveryLayout("worlds"){
        Text("Choisis ton univers",fontSize=25.sp,fontWeight=FontWeight.Black)
        listOf("🌴 Jungle" to "learn", "🌊 Océan" to "live", "🚀 Espace" to "learn", "🦖 Dinosaures" to "learn", "🐘 Savane" to "live", "🏰 Royaume magique" to "stories", "🏙️ Ville" to "world", "🐄 Ferme" to "play").chunked(2).forEach{pair->
            Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(8.dp)){
                pair.forEach{(label,route)->Button(onClick={onNavigate(route)},modifier=Modifier.weight(1f).height(74.dp),shape=RoundedCornerShape(18.dp)){Text(label,fontSize=17.sp)}}
            }
        }
    }}
}

@Composable
fun VideoLibraryScreen(onBack:()->Unit,onSettings:()->Unit){
    val uri=LocalUriHandler.current
    BebeTabFrame("VIDÉOS",onBack,onSettings){DiscoveryLayout("videos"){
        Text("Regarde et découvre",fontSize=25.sp,fontWeight=FontWeight.Black)
        Text("Choisis un thème pour rechercher une vidéo éducative. Une connexion Internet est nécessaire.",fontSize=15.sp)
        listOf("🎵 Comptines" to "comptines enfants français", "🔤 Alphabet" to "alphabet français enfants", "🦁 Animaux" to "animaux pour enfants documentaire", "🚀 Espace" to "système solaire enfants").forEach{(title,query)->
            OutlinedButton(onClick={uri.openUri("https://www.youtube.com/results?search_query="+URLEncoder.encode(query,"UTF-8"))},modifier=Modifier.fillMaxWidth().height(72.dp),shape=RoundedCornerShape(18.dp)){Text(title,fontSize=20.sp)}
        }
    }}
}

@Composable
fun FantiGuideScreen(onBack:()->Unit,onNavigate:(String)->Unit,onSettings:()->Unit){
    BebeTabFrame("AVEC FANTI",onBack,onSettings){DiscoveryLayout("assistant"){
        Text("Bonjour ! Que veux-tu découvrir ?",fontSize=25.sp,fontWeight=FontWeight.Black)
        Text("Je te guide vers les activités de ta tablette.",fontSize=16.sp)
        listOf("🌍 Découvrir un pays" to "world", "📖 Apprendre les lettres" to "learn", "🎮 Faire un jeu" to "play", "📚 Écouter une histoire" to "stories", "🎨 Faire un dessin" to "draw", "🎵 Jouer de la musique" to "music").forEach{(title,route)->
            Button(onClick={onNavigate(route)},modifier=Modifier.fillMaxWidth().height(56.dp),shape=RoundedCornerShape(16.dp)){Text(title,fontSize=17.sp)}
        }
    }}
}
