package com.bebetab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.*
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.components.Claim
import com.bebetab.ui.components.FantiMascot
import com.bebetab.ui.components.rememberClaim
import com.bebetab.ui.games.*
import com.bebetab.ui.theme.*
import kotlinx.coroutines.launch

@Composable
private fun currentLanguage(): String {
    val context = LocalContext.current
    return remember { ParentSettingsStore(context) }.language.collectAsState(initial = "fr").value
}

private val learnColors = listOf(
    Color(0xFFFF6D3D), Color(0xFF9C27B0), Color(0xFF26A9E0), Color(0xFF21B573),
    Color(0xFF55B83E), Color(0xFF6350D9), Color(0xFFFFA726), Color(0xFFE91E63)
)
private val gameColors = listOf(
    Color(0xFF64C94C), Color(0xFF5866E8), Color(0xFF28A9D8), Color(0xFFFFA326),
    Color(0xFFB833D8), Color(0xFF17A8B8), Color(0xFFF39A17), Color(0xFF27A96B)
)

@Composable
private fun FantiPane(message: String) {
    Column(
        Modifier.fillMaxHeight().width(238.dp).padding(start = 2.dp, end = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(Modifier.fillMaxWidth().weight(1f), contentAlignment = Alignment.BottomCenter) {
            FantiMascot(Modifier.fillMaxWidth().fillMaxHeight(.78f).padding(horizontal = 8.dp))
        }
        Surface(
            Modifier.fillMaxWidth().padding(horizontal = 4.dp, vertical = 6.dp).shadow(3.dp, RoundedCornerShape(18.dp)),
            shape = RoundedCornerShape(18.dp), color = Color.White
        ) {
            Text(message, Modifier.padding(horizontal = 12.dp, vertical = 11.dp), textAlign = TextAlign.Center,
                fontWeight = FontWeight.ExtraBold, color = Color(0xFF19324A), fontSize = 13.sp)
        }
    }
}

@Composable
private fun ActivityTile(title:String, subtitle:String, emoji:String, color:Color, onClick:()->Unit) {
    Button(
        onClick=onClick,
        modifier=Modifier.fillMaxSize().shadow(4.dp,RoundedCornerShape(18.dp)),
        shape=RoundedCornerShape(18.dp), colors=ButtonDefaults.buttonColors(containerColor=color),
        contentPadding=PaddingValues(horizontal = 8.dp, vertical = 6.dp)
    ) {
        Column(Modifier.fillMaxSize(),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
            Box(Modifier.fillMaxWidth().weight(1f).padding(horizontal = 8.dp, vertical = 4.dp), contentAlignment = Alignment.Center) {
                ActivityCardIllustration(Modifier.fillMaxSize(), emoji)
            }
            Text(title,fontWeight=FontWeight.Black,fontSize=15.sp,color=Color.White,textAlign=TextAlign.Center,maxLines=1)
            Text(subtitle,fontWeight=FontWeight.Bold,fontSize=9.sp,color=Color.White.copy(.92f),textAlign=TextAlign.Center,maxLines=1)
        }
    }
}

@Composable
private fun ActivityDetail(id:String, language:String, onBack:()->Unit, claim:Claim) {
    when(id){
        "letters" -> QuizLettres(language,claim,onBack)
        "numbers" -> QuizNombres(language,claim,onBack)
        "art" -> DrawGame(language,"art")
        else -> MiniQuiz(id,language,claim,onBack)
    }
}

@Composable
fun LearnActivityScreen(onBack:()->Unit,onSettings:()->Unit={}) {
    val language=currentLanguage()
    val claim=rememberClaim()
    var selected by remember{mutableStateOf<String?>(null)}
    BebeTabFrame(if(language=="en")"LEARN" else "APPRENDRE",onBack,onSettings){
        if(selected!=null){
            Column(Modifier.fillMaxSize().padding(10.dp)){
                OutlinedButton(onClick={selected=null}){Text(if(language=="en")"← All subjects" else "← Toutes les matières")}
                Spacer(Modifier.height(8.dp))
                Box(Modifier.fillMaxSize().weight(1f)){
                    ActivityDetail(selected!!,language,{selected=null},claim)
                }
            }
        }else{
            Row(Modifier.fillMaxSize().padding(8.dp),horizontalArrangement=Arrangement.spacedBy(16.dp)){
                FantiPane(if(language=="en")"Learn, discover and have fun!" else "Apprendre, découvrir et s’amuser !")
                Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(12.dp)){
                    listOf(ContentData.subjects.take(4),ContentData.subjects.drop(4)).forEachIndexed{row,items->
                        Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(12.dp)){
                            items.forEachIndexed{index,item->
                                Box(Modifier.weight(1f).fillMaxHeight()){
                                    ActivityTile(item.title.text(language),item.description.text(language).take(30),item.emoji,learnColors[row*4+index]){selected=item.id}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun PlayActivityScreen(onBack:()->Unit,onSettings:()->Unit={}) {
    val language=currentLanguage()
    val claim=rememberClaim()
    var selected by remember{mutableStateOf<String?>(null)}
    BebeTabFrame(if(language=="en")"PLAY" else "JOUER",onBack,onSettings){
        if(selected!=null){
            Column(Modifier.fillMaxSize().padding(10.dp)){
                OutlinedButton(onClick={selected=null}){Text(if(language=="en")"← All games" else "← Tous les jeux")}
                Spacer(Modifier.height(8.dp))
                Box(Modifier.fillMaxSize().weight(1f)){
                    val detailId=selected!!
                    if(detailId=="memory") MemoryGame(claim,language)
                    else MiniQuiz(detailId,language,claim,{selected=null})
                }
            }
        }else{
            Row(Modifier.fillMaxSize().padding(8.dp),horizontalArrangement=Arrangement.spacedBy(16.dp)){
                FantiPane(if(language=="en")"Let's learn while playing!" else "Des jeux éducatifs pour apprendre en s’amusant !")
                Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(12.dp)){
                    listOf(ContentData.games.take(4),ContentData.games.drop(4)).forEachIndexed{row,items->
                        Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(12.dp)){
                            items.forEachIndexed{index,item->
                                Box(Modifier.weight(1f).fillMaxHeight()){
                                    ActivityTile(item.title.text(language),item.description.text(language).take(30),item.emoji,gameColors[row*4+index]){selected=item.id}
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StoryActivityScreen(onBack:()->Unit,onSettings:()->Unit={}) {
    val language=currentLanguage()
    var storyIndex by remember{mutableIntStateOf(0)}
    var openReader by remember{mutableStateOf(false)}
    BebeTabFrame(if(language=="en")"STORIES" else "HISTOIRES",onBack,onSettings){
        if(openReader){
            Column(Modifier.fillMaxSize().padding(10.dp)){
                OutlinedButton(onClick={openReader=false}){Text(if(language=="en")"← Stories" else "← Histoires")}
                Spacer(Modifier.height(6.dp))
                StoryReader(language,storyIndex)
            }
        }else{
            Row(Modifier.fillMaxSize().padding(8.dp),horizontalArrangement=Arrangement.spacedBy(16.dp)){
                FantiPane(if(language=="en")"Listen, read and live amazing stories with Fanti!" else "Écoute, lis et vis des histoires incroyables avec Fanti !")
                Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(14.dp)){
                    Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(14.dp)){
                        ContentData.stories.forEachIndexed{index,story->
                            Surface(onClick={storyIndex=index;openReader=true},modifier=Modifier.weight(1f).fillMaxHeight().shadow(3.dp,RoundedCornerShape(20.dp)),shape=RoundedCornerShape(20.dp),color=Color.White){
                                Column(Modifier.fillMaxSize(),horizontalAlignment=Alignment.CenterHorizontally){
                                    Box(Modifier.fillMaxWidth().weight(1f).clip(RoundedCornerShape(topStart=20.dp,topEnd=20.dp)),contentAlignment=Alignment.Center){StoryIllustration(Modifier.fillMaxSize(),index)}
                                    Text(story.text(language),Modifier.padding(12.dp),fontWeight=FontWeight.ExtraBold,textAlign=TextAlign.Center,fontSize=14.sp)
                                }
                            }
                        }
                    }
                    Row(Modifier.fillMaxWidth().height(58.dp),horizontalArrangement=Arrangement.spacedBy(8.dp)){
                        listOf(if(language=="en")"Adventure" else "Aventure",if(language=="en")"Animals" else "Animaux",if(language=="en")"Magic" else "Magie",if(language=="en")"World" else "Monde",if(language=="en")"Friendship" else "Amitié",if(language=="en")"Listen" else "Écouter").forEach{label->
                            Surface(Modifier.weight(1f).fillMaxHeight(),shape=RoundedCornerShape(16.dp),color=Color.White,shadowElevation=2.dp){Box(contentAlignment=Alignment.Center){Text(label,fontSize=10.sp,fontWeight=FontWeight.Bold,textAlign=TextAlign.Center)}}
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun MusicActivityScreen(onBack:()->Unit,onSettings:()->Unit={}) {
    val language=currentLanguage()
    BebeTabFrame(if(language=="en")"MUSIC" else "MUSIQUE",onBack,onSettings){MusicKeyboard(language)}
}

@Composable
fun DrawActivityScreen(onBack:()->Unit,onSettings:()->Unit={},onNavigate:(String)->Unit={}) {
    val language=currentLanguage()
    val en=language=="en"
    var mode by remember{mutableStateOf<String?>(null)}
    BebeTabFrame(if(en)"DRAW" else "DESSINER",onBack,onSettings){
        if(mode!=null){
            Column(Modifier.fillMaxSize().padding(10.dp)){
                OutlinedButton(onClick={mode=null}){Text(if(en)"← All modes" else "← Tous les modes")}
                Spacer(Modifier.height(5.dp))
                DrawGame(language,mode!!)
            }
        }else{
            Row(Modifier.fillMaxSize().padding(8.dp),horizontalArrangement=Arrangement.spacedBy(16.dp)){
                FantiPane(if(en)"Create with Fanti!" else "Crée avec Fanti !")
                Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(12.dp)){
                    Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(12.dp)){
                        DrawMode(Modifier.weight(1f),"free",if(en)"Free drawing" else "Dessin libre",DrawYellow){mode="free"}
                        DrawMode(Modifier.weight(1f),"color",if(en)"Coloring" else "Coloriage",Color(0xFFFFB22E)){mode="color"}
                        DrawMode(Modifier.weight(1f),"letters",if(en)"Trace letters" else "Tracer lettres",Color(0xFF3DA6EF)){mode="letters"}
                    }
                    Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(12.dp)){
                        DrawMode(Modifier.weight(1f),"numbers",if(en)"Trace numbers" else "Tracer chiffres",Color(0xFFAA6CF2)){mode="numbers"}
                        DrawMode(Modifier.weight(1f),"shapes",if(en)"Shapes" else "Formes",Color(0xFF7CCB38)){mode="shapes"}
                        // « Créer musique » ouvre le clavier musical (et non une toile de dessin).
                        DrawMode(Modifier.weight(1f),"music",if(en)"Create music" else "Créer musique",MusicPink){onNavigate("music")}
                    }
                }
            }
        }
    }
}

@Composable
private fun DrawMode(modifier:Modifier,icon:String,label:String,color:Color,onClick:()->Unit){
    Button(onClick=onClick,modifier=modifier.fillMaxHeight().shadow(4.dp,RoundedCornerShape(20.dp)),shape=RoundedCornerShape(20.dp),colors=ButtonDefaults.buttonColors(containerColor=color),contentPadding=PaddingValues(8.dp)){
        Column(Modifier.fillMaxSize(),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
            Box(Modifier.fillMaxWidth().weight(1f),contentAlignment=Alignment.Center){DrawModeIllustration(Modifier.fillMaxSize(),icon)}
            Text(label,color=Color.White,fontSize=14.sp,fontWeight=FontWeight.Black,textAlign=TextAlign.Center)
        }
    }
}
