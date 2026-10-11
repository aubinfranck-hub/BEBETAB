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
import com.bebetab.ui.components.ParentCodeEntry
import com.bebetab.ui.components.rememberClaim
import com.bebetab.ui.theme.*
import com.bebetab.ui.screens.WorldMapIllustration
import com.bebetab.ui.screens.FranceIllustration
import com.bebetab.ui.screens.LiveCityIllustration
import kotlinx.coroutines.launch

@Composable
private fun language(): String {
    val c = LocalContext.current
    return remember { ParentSettingsStore(c) }.language.collectAsState(initial = "fr").value
}

@Composable
fun ReferenceScreen(route:String,onBack:()->Unit,onSettings:()->Unit={},onNavigate:(String)->Unit={}) {
    when(route) {
        "world" -> WorldScreen(onBack,onSettings,onNavigate)
        "france" -> {
            val lang=language()
            CountryScreen(ContentData.countries.first{it.id=="france"},lang,onBack,onSettings,onNavigate)
        }
        "live" -> LiveScreen(onBack,onSettings)
        "rewards" -> RewardsScreen(onBack,onSettings)
        else -> SimpleScreen(route,onBack)
    }
}

@Composable
private fun SkyBackdrop(content:@Composable ColumnScope.()->Unit) {
    Column(Modifier.fillMaxSize().background(Brush.verticalGradient(listOf(SkyBlue,Color(0xFFBEEBFF),Color(0xFFE9F7FF))),), content=content)
}

@Composable
private fun WorldScreen(onBack:()->Unit,onSettings:()->Unit,onNavigate:(String)->Unit) {
    var selected by remember{mutableStateOf<String?>(null)}
    var selectedCategory by remember{mutableStateOf<String?>(null)}
    val lang=language()
    val country=ContentData.countries.firstOrNull{it.id==selected}
    if(country!=null){CountryScreen(country,lang,{selected=null},onSettings,onNavigate);return}

    val categories=if(lang=="en")
        listOf("Cities","Animals","Cultures","Monuments","Nature","Oceans","Space","Jobs","Cuisine","Languages","History")
    else
        listOf("Villes","Animaux","Cultures","Monuments","Nature","Océans","Espace","Métiers","Cuisine","Langues","Histoire")

    BebeTabFrame(if(lang=="en")"EXPLORE THE WORLD" else "EXPLORER LE MONDE",onBack,onSettings){
        Row(Modifier.fillMaxSize().padding(8.dp),horizontalArrangement=Arrangement.spacedBy(12.dp)){
            Surface(Modifier.weight(1f).fillMaxHeight().shadow(3.dp,RoundedCornerShape(22.dp)),shape=RoundedCornerShape(22.dp),color=Color.Transparent){
                SkyBackdrop{
                    Box(Modifier.fillMaxSize()){
                        WorldMapIllustration(Modifier.fillMaxSize().padding(10.dp))
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
                        Row(Modifier.align(Alignment.BottomCenter).fillMaxWidth().padding(start=8.dp,end=8.dp,bottom=8.dp),horizontalArrangement=Arrangement.spacedBy(5.dp)){
                            categories.take(6).forEach{cat->SmallWhiteChip(cat,Modifier.weight(1f),onClick={selectedCategory=cat})}
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
                            pair.forEach{cat->SmallWhiteChip(cat,Modifier.weight(1f),onClick={selectedCategory=cat})}
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun CountryScreen(country:CountryContent,lang:String,onBack:()->Unit,onSettings:()->Unit,onNavigate:(String)->Unit){
    val scope=rememberCoroutineScope()
    val claim=rememberClaim()
    // null = pas encore réclamé ; true = étoile donnée ; false = déjà gagnée aujourd'hui
    var discovered by remember(country.id){mutableStateOf<Boolean?>(null)}
    var action by remember{mutableStateOf<String?>(null)}
    BebeTabFrame(country.name.text(lang).uppercase(),onBack,onSettings,subtitle=country.continent.text(lang)+" > "+country.name.text(lang)){
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
                        if(country.id=="france") FranceIllustration(Modifier.fillMaxSize().padding(10.dp)) else WorldMapIllustration(Modifier.fillMaxSize().padding(10.dp))
                        Text("🏙️   🌳   ☁️   🎈",fontSize=34.sp,modifier=Modifier.align(Alignment.BottomCenter).padding(bottom=24.dp))
                        FantiMascot(Modifier.align(Alignment.BottomStart).padding(10.dp).size(115.dp))
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
                    // (libellé, écran vers lequel mener l'enfant ; null = contenu pas encore disponible)
                    listOf(
                        (if(lang=="en")"Videos" else "Vidéos") to null,
                        "Live" to "live",
                        (if(lang=="en")"Games" else "Jeux") to "play",
                        "Quiz" to "learn",
                        "Images" to null,
                        (if(lang=="en")"Music" else "Musique") to "music"
                    ).forEach{(label,route)->SmallWhiteChip(label,Modifier.weight(1f)){if(route!=null) onNavigate(route) else action=label}}
                }
                if(action!=null){
                    Surface(Modifier.fillMaxWidth(),shape=RoundedCornerShape(14.dp),color=Color(0xFFEAF7FF),shadowElevation=1.dp){
                        Text(
                            if(lang=="en") action+" • More content for "+country.name.text(lang)+" will open here."
                            else action+" • Plus de contenus sur "+country.name.text(lang)+" seront disponibles ici.",
                            Modifier.padding(8.dp),fontSize=9.sp,fontWeight=FontWeight.Bold,textAlign=TextAlign.Center
                        )
                    }
                }
                when(discovered){
                    null->Button(onClick={scope.launch{discovered=claim("country:${country.id}",1)}},modifier=Modifier.fillMaxWidth().height(40.dp),shape=RoundedCornerShape(18.dp)){Text(if(lang=="en")"I discovered it! +1 ⭐" else "J’ai découvert ! +1 ⭐")}
                    true->Text(if(lang=="en")"Great job! ⭐ +1" else "Bravo ! ⭐ +1",fontWeight=FontWeight.ExtraBold,color=OutlineBlue)
                    false->Text(if(lang=="en")"You already discovered this today!" else "Tu as déjà découvert ce pays aujourd’hui !",fontWeight=FontWeight.Bold,color=OutlineBlue,fontSize=11.sp)
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
    var filter by remember{mutableStateOf("all")}
    // Chaque filtre porte sa propre clé : plus de liste de clés parallèle qui peut se désynchroniser.
    val filters=if(lang=="en") listOf("all" to "All","cities" to "Cities","nature" to "Nature","animals" to "Animals","monuments" to "Monuments","beaches" to "Beaches","mountains" to "Mountains")
                 else listOf("all" to "Tous","cities" to "Villes","nature" to "Nature","animals" to "Animaux","monuments" to "Monuments","beaches" to "Plages","mountains" to "Montagnes")
    val filtered=if(filter=="all") AnimalLiveData.cams else AnimalLiveData.cams.filter{it.categories.contains(filter)}
    BebeTabFrame("LIVE WORLD",onBack,onSettings){
        Column(Modifier.fillMaxSize().padding(8.dp),verticalArrangement=Arrangement.spacedBy(8.dp)){
            Text(if(lang=="en")"Real animals • child-safe external live cameras" else "De vrais animaux • accès externe protégé pour les enfants",color=OutlineBlue,fontWeight=FontWeight.ExtraBold)
            Row(Modifier.fillMaxWidth(),horizontalArrangement=Arrangement.spacedBy(6.dp)){
                filters.forEach{(key,label)->
                    SmallWhiteChip(label,Modifier.weight(1f),selected=filter==key){filter=key}
                }
            }
            if(filtered.isEmpty()){
                Box(Modifier.fillMaxSize().weight(1f),contentAlignment=Alignment.Center){
                    Text(if(lang=="en")"No camera is available in this category yet." else "Aucune caméra disponible dans cette catégorie pour le moment.",fontWeight=FontWeight.Bold)
                }
            }else{
                Column(Modifier.fillMaxWidth().weight(1f),verticalArrangement=Arrangement.spacedBy(8.dp)){
                    filtered.chunked(3).forEach{row->
                        Row(Modifier.fillMaxWidth().weight(1f),horizontalArrangement=Arrangement.spacedBy(8.dp)){
                            row.forEach{cam->LiveAnimalCard(cam,lang,Modifier.weight(1f)){pendingUrl=cam.youtubeUrl?:cam.officialUrl}}
                            repeat(3-row.size){Spacer(Modifier.weight(1f))}
                        }
                    }
                }
            }
        }
    }
    if(pendingUrl!=null){
        AlertDialog(
            onDismissRequest={pendingUrl=null},
            title={Text(if(lang=="en")"Parent approval" else "Autorisation parentale")},
            text={
                Column(verticalArrangement=Arrangement.spacedBy(8.dp)){
                    Text(
                        if(lang=="en")"This link leaves BébéTab and opens an external website (for example YouTube) that may show suggestions or comments. A parent must enter the code to continue."
                        else "Ce lien quitte BébéTab et ouvre un site externe (par exemple YouTube) qui peut afficher des suggestions ou des commentaires. Un parent doit entrer le code pour continuer."
                    )
                    ParentCodeEntry(lang,if(lang=="en")"Open" else "Ouvrir"){
                        val url=pendingUrl
                        pendingUrl=null
                        if(url!=null) uriHandler.openUri(url)
                    }
                }
            },
            confirmButton={},
            dismissButton={TextButton(onClick={pendingUrl=null}){Text(if(lang=="en")"Cancel" else "Annuler")}}
        )
    }
}

@Composable
private fun LiveAnimalCard(cam:AnimalLiveCam,lang:String,modifier:Modifier,onClick:()->Unit){
    Surface(onClick=onClick,modifier=modifier.fillMaxHeight(),shape=RoundedCornerShape(18.dp),color=Color.White,shadowElevation=4.dp){
        Column(Modifier.fillMaxSize()){
            Box(Modifier.fillMaxWidth().weight(1f).background(Brush.verticalGradient(listOf(Color(0xFF8BD8FF),Color(0xFFE8F9FF)))),contentAlignment=Alignment.Center){
                LiveCityIllustration(Modifier.fillMaxSize(),kotlin.math.abs(cam.id.hashCode())%4)
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
private fun SmallWhiteChip(text:String,modifier:Modifier=Modifier,selected:Boolean=false,onClick:(()->Unit)?=null){
    Surface(
        onClick=onClick?:{},
        modifier=modifier.height(44.dp),
        shape=RoundedCornerShape(14.dp),color=if(selected)Yellow else Color.White,shadowElevation=2.dp
    ){
        Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){Text(text,fontSize=10.sp,fontWeight=FontWeight.ExtraBold,textAlign=TextAlign.Center)}
    }
}
