package com.bebetab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.*
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.components.FantiMascot
import com.bebetab.ui.theme.*
import kotlinx.coroutines.launch

@Composable
private fun language(): String {
    val c = LocalContext.current
    return remember { ParentSettingsStore(c) }.language.collectAsState(initial = "fr").value
}

@Composable
fun ReferenceScreen(route:String,onBack:()->Unit,onSettings:()->Unit={}) {
    when(route) {
        "world" -> WorldScreen(onBack,onSettings)
        "france" -> {
            val lang=language()
            CountryScreen(ContentData.countries.first{it.id=="france"},lang,onBack,onSettings)
        }
        "live" -> LiveScreen(onBack,onSettings)
        "rewards" -> RewardsScreen(onBack,onSettings)
        else -> SimpleScreen(route,onBack)
    }
}

@Composable
private fun SkyBackdrop(content:@Composable ColumnScope.()->Unit) {
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(SkyBlue,Color(0xFFBEEBFF),Color(0xFFE9F7FF))),content=content))
}

@Composable
private fun WorldScreen(onBack:()->Unit,onSettings:()->Unit) {
    var selected by remember{mutableStateOf<String?>(null)}
    var selectedCategory by remember{mutableStateOf<String?>(null)}
    val lang=language()
    val country=ContentData.countries.firstOrNull{it.id==selected}
    if(country!=null){CountryScreen(country,lang,onBack,onSettings);return}

    val categories=if(lang=="en")
        listOf("Cities","Animals","Cultures","Monuments","Nature","Oceans","Space","Jobs","Cuisine","Languages","History")
    else
        listOf("Villes","Animaux","Cultures","Monuments","Nature","Océans","Espace","Métiers","Cuisine","Langues","Histoire")

    BebeTabFrame(if(lang=="en")"EXPLORE THE WORLD" else "EXPLORER LE MONDE",onBack,onSettings){
        Row(Modifier.fillMaxSize().padding(8.dp),horizontalArrangement=Arrangement.spacedBy(12.dp)){
            Surface(Modifier.weight(1f).fillMaxHeight().shadow(3.dp,RoundedCornerShape(22.dp)),shape=RoundedCornerShape(22.dp),color=Color.Transparent){
                SkyBackdrop{
                    Box(Modifier.fillMaxSize()){
                        Text("🌎",fontSize=190.sp,modifier=Modifier.align(Alignment.Center))
                        Column(Modifier.align(Alignment.TopCenter).padding(top=12.dp),horizontalAlignment=Alignment.CenterHorizontally){
                            Text("🎈  ☁️  🏰  ✈️  🎈",fontSize=26.sp)
                            Text(if(lang=="en")"AMERICA     EUROPE     ASIA" else "AMÉRIQUE     EUROPE     ASIE",color=Color(0xFF168A4A),fontWeight=FontWeight.Black,fontSize=15.sp)
                            Text(if(lang=="en")"AFRICA          OCEANIA" else "AFRIQUE          OCÉANIE",color=Color(0xFFEC461E),fontWeight=FontWeight.Black,fontSize=15.sp)
                            Text(if(lang=="en")"OCEANS        ANTARCTICA" else "OCÉANS        ANTARCTIQUE",color=OutlineBlue,fontWeight=FontWeight.Black,fontSize=13.sp)
                        }
                        FantiMascot(Modifier.align(Alignment.BottomStart).padding(10.dp).size(115.dp))
                        Surface(Modifier.align(Alignment.BottomStart).padding(start=100.dp,bottom=36.dp),shape=RoundedCornerShape(18.dp),color=Color.White,shadowElevation=3.dp){
                            Text(if(selectedCategory==null)
                                if(lang=="en")"Where do you want to go today?" else "Où veux-tu aller aujourd’hui ?"
                                else (if(lang=="en")"Discover "+selectedCategory+" !" else "Découvre : "+selectedCategory+" !"),
                                Modifier.padding(12.dp),fontWeight=FontWeight.ExtraBold,fontSize=13.sp,textAlign=TextAlign.Center)
                        }
                        Row(Modifier.align(Alignment.BottomCenter).fillMaxWidth().padding(horizontal=8.dp,bottom=8.dp),horizontalArrangement=Arrangement.spacedBy(5.dp)){
                            categories.take(6).forEach{cat->SmallWhiteChip(cat,Modifier.weight(1f),{selectedCategory=cat})}
                        }
                    }
                }
            }
            Surface(Modifier.width(270.dp).fillMaxHeight().shadow(3.dp,RoundedCornerShape(22.dp)),shape=RoundedCornerShape(22.dp),color=Color.White){
                Column(Modifier.fillMaxSize().padding(10.dp),verticalArrangement=Arrangement.spacedBy(6.dp)){
                    Text(if(lang=="en")"POPULAR PLACES" else "LIEUX POPULAIRES",fontSize=18.sp,fontWeight=FontWeight.Black,color=OutlineBlue)
                    ContentData.countries.forEach{c->
                        OutlinedButton(onClick={selected=c.id},modifier=Modifier.fillMaxWidth().height(55.dp),shape=RoundedCornerShape(15.dp)){
                            Row(Modifier.fillMaxWidth(),verticalAlignment=Alignment.CenterVertically){
                                Text(c.flag,fontSize=24.sp);Spacer(Modifier.width(8.dp))
                                Column(Modifier.weight(1f)){Text(c.name.text(lang),fontWeight=FontWeight.ExtraBold,fontSize=13.sp);Text(c.continent.text(lang),fontSize=9.sp)}
                                Text("›",fontSize=24.sp,color=OutlineBlue)
                            }
                        }
                    }
                    Spacer(Modifier.height(2.dp))
                    Text(if(lang=="en")"EXPLORE" else "EXPLORER",fontSize=14.sp,fontWeight=FontWeight.Black,color=OutlineBlue)
                    categories.drop(6).chunked(2).forEach{pair->
                        Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(5.dp)){
                            pair.forEach{cat->SmallWhiteChip(cat,Modifier.weight(1f),{selectedCategory=cat})}
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CountryScreen(country:CountryContent,lang:String,onBack:()->Unit,onSettings:()->Unit){
    val context=LocalContext.current
    val scope=rememberCoroutineScope()
    val store=remember{ProgressStore(context)}
    var awarded by remember(country.id){mutableStateOf(false)}
    BebeTabFrame(country.name.text(lang).uppercase(),onBack,onSettings){
        Column(Modifier.fillMaxSize().padding(horizontal=8.dp, vertical=4.dp), verticalArrangement=Arrangement.spacedBy(5.dp)){
            Text(
                if(lang=="en") "World > "+country.continent.text(lang)+" > "+country.name.text(lang)
                else "Monde > "+country.continent.text(lang)+" > "+country.name.text(lang),
                color=OutlineBlue,
                fontSize=11.sp,
                fontWeight=FontWeight.Bold
            )
            Row(Modifier.fillMaxWidth().weight(1f),horizontalArrangement=Arrangement.spacedBy(12.dp)){
            Surface(Modifier.weight(1f).fillMaxHeight().shadow(3.dp,RoundedCornerShape(22.dp)),shape=RoundedCornerShape(22.dp),color=Color.Transparent){
                SkyBackdrop{
                    Box(Modifier.fillMaxSize()){
                        Text(country.flag,fontSize=72.sp,modifier=Modifier.align(Alignment.TopCenter).padding(top=4.dp))
                        Text(if(country.id=="france")"🗼" else "🌍",fontSize=185.sp,modifier=Modifier.align(Alignment.Center))
                        Text("🏙️   🌳   ☁️   🎈",fontSize=34.sp,modifier=Modifier.align(Alignment.BottomCenter).padding(bottom=24.dp))
                        Text("🐘",fontSize=78.sp,modifier=Modifier.align(Alignment.BottomStart).padding(15.dp))
                        Surface(Modifier.align(Alignment.BottomStart).padding(start=98.dp,bottom=30.dp),shape=RoundedCornerShape(18.dp),color=Color.White,shadowElevation=3.dp){
                            Text(if(lang=="en")"Discover "+country.name.text(lang)+"!" else "Découvre "+country.name.text(lang)+" !",Modifier.padding(11.dp),fontWeight=FontWeight.ExtraBold)
                        }
                    }
                }
            }
            Column(Modifier.width(340.dp).fillMaxHeight(),verticalArrangement=Arrangement.spacedBy(7.dp)){
                Text(if(lang=="en")"DISCOVER "+country.name.text(lang).uppercase() else "DÉCOUVRIR "+country.name.text(lang).uppercase(),color=OutlineBlue,fontSize=18.sp,fontWeight=FontWeight.Black)
                Row(Modifier.weight(1f),horizontalArrangement=Arrangement.spacedBy(7.dp)){
                    Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(7.dp)){country.cards.take(3).forEachIndexed{i,c->CountryCard(c.text(lang),listOf("🗼","🎭","🦁")[i])}}
                    Column(Modifier.weight(1f),verticalArrangement=Arrangement.spacedBy(7.dp)){country.cards.drop(3).take(3).forEachIndexed{i,c->CountryCard(c.text(lang),listOf("🍴","🏙️","🏛️")[i])}}
                }
                Surface(shape=RoundedCornerShape(16.dp),color=Color.White,shadowElevation=2.dp){Text(country.fact.text(lang),Modifier.padding(9.dp),fontSize=10.sp,fontWeight=FontWeight.Bold)}
                Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(5.dp)){
                    listOf(if(lang=="en")"Videos" else "Vidéos",if(lang=="en")"Live" else "Live",if(lang=="en")"Games" else "Jeux",if(lang=="en")"Quiz" else "Quiz",if(lang=="en")"Images" else "Images",if(lang=="en")"Music" else "Musique").forEach{SmallWhiteChip(it,Modifier.weight(1f))}
                }
                if(!awarded)Button(onClick={awarded=true;scope.launch{store.addStars(1)}},modifier=Modifier.fillMaxWidth().height(40.dp),shape=RoundedCornerShape(18.dp)){Text(if(lang=="en")"I discovered it! +1 ⭐" else "J’ai découvert ! +1 ⭐")}
            }
            }
        }
    }
    }
}

@Composable private fun CountryCard(text:String,emoji:String){
    Surface(Modifier.fillMaxWidth().height(92.dp).shadow(2.dp,RoundedCornerShape(15.dp)),shape=RoundedCornerShape(15.dp),color=Color.White){
        Column(Modifier.fillMaxSize(),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){Text(emoji,fontSize=27.sp);Text(text,fontWeight=FontWeight.ExtraBold,fontSize=10.sp,textAlign=TextAlign.Center)}
    }
}

@Composable
private fun LiveScreen(onBack:()->Unit,onSettings:()->Unit){
    val lang=language()
    val uriHandler=LocalUriHandler.current
    var pendingUrl by remember{mutableStateOf<String?>(null)}
    var code by remember{mutableStateOf("")}
    BebeTabFrame(if(lang=="en")"ANIMAL LIVE" else "CAMÉRAS ANIMAUX",onBack,onSettings){
        Column(Modifier.fillMaxSize().padding(8.dp),verticalArrangement=Arrangement.spacedBy(8.dp)){
            Text(if(lang=="en")"Real animals • child-safe external live cameras" else "De vrais animaux • accès externe protégé pour les enfants",color=OutlineBlue,fontWeight=FontWeight.ExtraBold)
            Row(Modifier.fillMaxWidth().weight(1f),horizontalArrangement=Arrangement.spacedBy(8.dp)){
                AnimalLiveData.cams.take(4).forEach{cam->LiveAnimalCard(cam,lang,Modifier.weight(1f)){pendingUrl=cam.youtubeUrl?:cam.officialUrl;code=""}}
            }
            Row(Modifier.fillMaxWidth().weight(1f),horizontalArrangement=Arrangement.spacedBy(8.dp)){
                AnimalLiveData.cams.drop(4).forEach{cam->LiveAnimalCard(cam,lang,Modifier.weight(1f)){pendingUrl=cam.youtubeUrl?:cam.officialUrl;code=""}}
            }
        }
    }
    if(pendingUrl!=null){
        AlertDialog(
            onDismissRequest={pendingUrl=null},
            title={Text(if(lang=="en")"Parent approval" else "Autorisation parentale")},
            text={
                Column(verticalArrangement=Arrangement.spacedBy(8.dp)){
                    Text(if(lang=="en")"This link leaves BébéTab. Enter the parent code to continue." else "Ce lien ouvre un contenu externe. Un parent doit entrer le code pour continuer.")
                    OutlinedTextField(value=code,onValueChange={code=it.filter(Char::isDigit).take(4)},label={Text(if(lang=="en")"Parent code" else "Code parent")})
                }
            },
            confirmButton={
                Button(onClick={if(code=="2580"){val url=pendingUrl!!;pendingUrl=null;uriHandler.openUri(url)}}){Text(if(lang=="en")"Open" else "Ouvrir")}
            },
            dismissButton={TextButton(onClick={pendingUrl=null}){Text(if(lang=="en")"Cancel" else "Annuler")}}
        )
    }
}

@Composable
private fun LiveAnimalCard(cam:AnimalLiveCam,lang:String,modifier:Modifier,onClick:()->Unit){
    Surface(onClick=onClick,modifier=modifier.fillMaxHeight(),shape=RoundedCornerShape(18.dp),color=Color.White,shadowElevation=4.dp){
        Column(Modifier.fillMaxSize()){
            Box(Modifier.fillMaxWidth().weight(1f).background(Brush.verticalGradient(listOf(Color(0xFF8BD8FF),Color(0xFFE8F9FF)))),contentAlignment=Alignment.Center){
                Text(cam.emoji,fontSize=56.sp)
                Text("LIVE",color=Color.Red,fontSize=10.sp,fontWeight=FontWeight.Black,modifier=Modifier.align(Alignment.TopEnd).padding(8.dp))
            }
            Column(Modifier.fillMaxWidth().padding(8.dp)){
                Text(if(lang=="en")cam.nameEn else cam.nameFr,fontWeight=FontWeight.Black,color=OutlineBlue,fontSize=13.sp)
                Text(if(lang=="en")cam.animalEn else cam.animalFr,fontSize=9.sp,fontWeight=FontWeight.Bold)
                Text(cam.location,fontSize=8.sp)
                Text(if(lang=="en")"WATCH" else "REGARDER",color=Color.Red,fontSize=9.sp,fontWeight=FontWeight.Black)
            }
        }
    }
}

@Composable
private fun RewardsScreen(onBack:()->Unit,onSettings:()->Unit){
    val context=LocalContext.current
    val store=remember{ProgressStore(context)}
    val stars by store.stars.collectAsState(0)
    val lang=language()
    val level=stars/50+1
    val progress=(stars%50)/50f
    BebeTabFrame(if(lang=="en")"MY REWARDS" else "MES RÉCOMPENSES",onBack,onSettings){
        Row(Modifier.fillMaxSize().padding(8.dp),horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Surface(Modifier.weight(1f).fillMaxHeight().shadow(3.dp,RoundedCornerShape(22.dp)),shape=RoundedCornerShape(22.dp),color=Color.White){
                Column(Modifier.fillMaxSize().padding(20.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
                    Text("⭐",fontSize=88.sp);Text("$stars",fontSize=38.sp,color=OutlineBlue,fontWeight=FontWeight.Black)
                    Text(if(lang=="en")"stars earned" else "étoiles gagnées",fontSize=18.sp,fontWeight=FontWeight.Bold)
                    Text((if(lang=="en")"Level " else "Niveau ")+level+" • "+(if(lang=="en")"Explorer" else "Explorateur"),color=OutlineBlue,fontWeight=FontWeight.ExtraBold)
                    LinearProgressIndicator(progress={progress},modifier=Modifier.fillMaxWidth().height(10.dp).padding(top=6.dp))
                }
            }
            Column(Modifier.weight(1f).fillMaxHeight(),verticalArrangement=Arrangement.spacedBy(10.dp)){
                for((threshold,icon) in listOf(10 to "🥉",50 to "🥈",100 to "🥇",250 to "🏆")){
                    Surface(Modifier.fillMaxWidth().weight(1f).shadow(2.dp,RoundedCornerShape(18.dp)),shape=RoundedCornerShape(18.dp),color=Color.White){
                        Row(Modifier.fillMaxSize().padding(14.dp),verticalAlignment=Alignment.CenterVertically){
                            Text(icon,fontSize=38.sp);Spacer(Modifier.width(10.dp))
                            Text("$threshold ⭐  "+if(stars>=threshold)(if(lang=="en")"Unlocked!" else "Débloqué !") else (if(lang=="en")"Keep going!" else "Continue !"),fontWeight=FontWeight.ExtraBold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SmallWhiteChip(text:String,modifier:Modifier=Modifier,onClick:(()->Unit)?=null){
    Surface(
        onClick=onClick?:{},
        modifier=modifier.height(44.dp),
        shape=RoundedCornerShape(14.dp),color=Color.White,shadowElevation=2.dp
    ){
        Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text(text,fontSize=10.sp,fontWeight=FontWeight.ExtraBold,textAlign=TextAlign.Center)}
    }
}
