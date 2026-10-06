package com.bebetab.ui.games

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.theme.OutlineBlue
import kotlinx.coroutines.launch
import com.bebetab.data.ProgressStore

data class MiniActivity(val titleFr:String,val titleEn:String,val questions:List<QuizQuestion>)

private val activities = mapOf(
    "science" to MiniActivity("Mini-jeu Sciences","Science mini-game", listOf(
        QuizQuestion("Le soleil est une… ☀️", listOf("étoile","planète","lune"), "étoile"),
        QuizQuestion("Quel animal vit sous l’eau ? 🐟", listOf("Dauphin","Lion","Girafe"), "Dauphin"),
        QuizQuestion("L’eau peut devenir… ❄️", listOf("glace","bois","sable"), "glace")
    )),
    "animals" to MiniActivity("Quiz Animaux","Animal quiz", listOf(
        QuizQuestion("Quel animal a une trompe ? 🐘", listOf("Éléphant","Lion","Zèbre"), "Éléphant"),
        QuizQuestion("Quel animal donne du lait ? 🐄", listOf("Vache","Girafe","Tigre"), "Vache"),
        QuizQuestion("Quel animal rugit ? 🦁", listOf("Lion","Lapin","Poisson"), "Lion")
    )),
    "space" to MiniActivity("Mini-jeu Espace","Space mini-game", listOf(
        QuizQuestion("Nous vivons sur… 🌍", listOf("la Terre","Mars","Jupiter"), "la Terre"),
        QuizQuestion("Quelle planète est rouge ? 🔴", listOf("Mars","Vénus","Neptune"), "Mars"),
        QuizQuestion("Le Soleil est au centre du… ☀️", listOf("système solaire","océan","continent"), "système solaire")
    )),
    "art" to MiniActivity("Mini-jeu Art","Art mini-game", listOf(
        QuizQuestion("Quel outil sert à peindre ? 🎨", listOf("Pinceau","Fourchette","Chaussure"), "Pinceau"),
        QuizQuestion("Quelle couleur obtient-on avec rouge + jaune ?", listOf("Orange","Vert","Bleu"), "Orange"),
        QuizQuestion("Un cercle est une…", listOf("forme","animal","pays"), "forme")
    )),
    "languages" to MiniActivity("Mots FR / EN","French / English words", listOf(
        QuizQuestion("Comment dit-on « chat » en anglais ? 🐱", listOf("Cat","Dog","Bird"), "Cat"),
        QuizQuestion("Comment dit-on « soleil » en anglais ? ☀️", listOf("Sun","Moon","Star"), "Sun"),
        QuizQuestion("Comment dit-on « merci » en anglais ?", listOf("Thank you","Hello","Please"), "Thank you")
    )),
    "puzzle" to MiniActivity("Puzzles","Puzzles", listOf(
        QuizQuestion("Quelle pièce complète la suite ? 🧩 1 2 _", listOf("3","5","8"), "3"),
        QuizQuestion("Quel objet va avec une serrure ?", listOf("Clé","Ballon","Livre"), "Clé"),
        QuizQuestion("Quel élément est différent ? 🍎 🍎 🍌", listOf("Banane","Pomme","Pomme"), "Banane")
    )),
    "math" to MiniActivity("Maths","Math", listOf(
        QuizQuestion("1 + 2 = ?", listOf("2","3","4"), "3"),
        QuizQuestion("5 - 2 = ?", listOf("2","3","4"), "3"),
        QuizQuestion("2 + 2 = ?", listOf("3","4","5"), "4")
    )),
    "geography" to MiniActivity("Géographie","Geography", listOf(
        QuizQuestion("La France est en… 🇫🇷", listOf("Europe","Asie","Océanie"), "Europe"),
        QuizQuestion("La Côte d’Ivoire est en… 🇨🇮", listOf("Afrique","Europe","Amérique"), "Afrique"),
        QuizQuestion("Tokyo est la capitale de… 🇯🇵", listOf("Japon","Kenya","Égypte"), "Japon")
    )),
    "logic" to MiniActivity("Logique","Logic", listOf(
        QuizQuestion("2, 4, 6, _", listOf("7","8","9"), "8"),
        QuizQuestion("🔴 🔵 🔴 🔵 _", listOf("Rouge","Vert","Jaune"), "Rouge"),
        QuizQuestion("Petit → moyen → _", listOf("grand","petit","haut"), "grand")
    )),
    "french" to MiniActivity("Français","French", listOf(
        QuizQuestion("Quel mot commence par B ? 🐘", listOf("Banane","Éléphant","Lion"), "Banane"),
        QuizQuestion("Quel mot est un animal ?", listOf("Chien","Table","Maison"), "Chien"),
        QuizQuestion("Quel mot complète : « Je ___ un livre »", listOf("lis","bleu","chat"), "lis")
    )),
    "english" to MiniActivity("English","English", listOf(
        QuizQuestion("Choose the animal 🦁", listOf("Lion","Book","House"), "Lion"),
        QuizQuestion("2 + 1 = ?", listOf("2","3","4"), "3"),
        QuizQuestion("Opposite of big is…", listOf("small","blue","fast"), "small")
    )),
    "coloring" to MiniActivity("Couleurs","Coloring", listOf(
        QuizQuestion("Quelle couleur est le ciel ? ☁️", listOf("Bleu","Vert","Rose"), "Bleu"),
        QuizQuestion("Quelle couleur est souvent associée à l’herbe ? 🌿", listOf("Vert","Noir","Violet"), "Vert"),
        QuizQuestion("Quelle couleur a une fraise ? 🍓", listOf("Rouge","Bleu","Jaune"), "Rouge")
    )),
    "trace_letters" to MiniActivity("Tracer les lettres","Trace letters", listOf(
        QuizQuestion("Quelle lettre vient après A ?", listOf("B","D","Z"), "B"),
        QuizQuestion("Quelle lettre commence « Fanti » ?", listOf("F","T","P"), "F"),
        QuizQuestion("Quelle lettre est une voyelle ?", listOf("A","B","C"), "A")
    )),
    "shapes" to MiniActivity("Formes","Shapes", listOf(
        QuizQuestion("Quelle forme a 3 côtés ?", listOf("Triangle","Cercle","Carré"), "Triangle"),
        QuizQuestion("Quelle forme est ronde ?", listOf("Cercle","Triangle","Rectangle"), "Cercle"),
        QuizQuestion("Un carré a…", listOf("4 côtés","2 côtés","6 côtés"), "4 côtés")
    ))
)

@Composable
fun MiniGameScreen(type:String,onBack:()->Unit,onSettings:()->Unit={}){
    val activity=activities[type] ?: activities.getValue("science")
    val context=androidx.compose.ui.platform.LocalContext.current
    val store=remember{ProgressStore(context)}
    val scope=rememberCoroutineScope()
    val lang=remember{com.bebetab.data.ParentSettingsStore(context)}.language.collectAsState(initial="fr").value
    BebeTabFrame(if(lang=="en") activity.titleEn else activity.titleFr,onBack,onSettings){
        Column(Modifier.fillMaxSize().padding(16.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.spacedBy(12.dp)){
            Text(if(lang=="en")"Bravo ! 2 ⭐ for each correct answer." else "Bravo ! 2 ⭐ à chaque bonne réponse.",color=OutlineBlue,fontWeight=FontWeight.Bold,fontSize=15.sp)
            QuizGame(
                title=if(lang=="en") activity.titleEn else activity.titleFr,
                questions=if(lang=="en") translateQuestions(activity.questions) else activity.questions,
                onStars={stars->scope.launch{store.addStars(stars)}}
            )
        }
    }
}

private fun translateQuestions(q:List<QuizQuestion>)=q // Content is short and the UI switches the surrounding labels.
