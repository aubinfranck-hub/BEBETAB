package com.bebetab.ui.games

import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import com.bebetab.ui.components.Claim

data class MiniActivity(val titleFr:String,val titleEn:String,val questions:List<BilingualQuestion>){
    fun title(language:String)=if(language=="en") titleEn else titleFr
}

private val activities = mapOf(
    "science" to MiniActivity("Mini-jeu Sciences","Science mini-game", listOf(
        bq("Le soleil est une… ☀️", listOf("étoile","planète","lune"), "étoile",
           "The Sun is a… ☀️", listOf("star","planet","moon"), "star"),
        bq("Quel animal vit sous l’eau ? 🐟", listOf("Dauphin","Lion","Girafe"), "Dauphin",
           "Which animal lives underwater? 🐟", listOf("Dolphin","Lion","Giraffe"), "Dolphin"),
        bq("L’eau peut devenir… ❄️", listOf("glace","bois","sable"), "glace",
           "Water can become… ❄️", listOf("ice","wood","sand"), "ice")
    )),
    "world" to MiniActivity("Mini-jeu Monde","World mini-game", listOf(
        bq("Sur quel continent se trouve la Côte d’Ivoire ?", listOf("Afrique","Europe","Asie"), "Afrique",
           "Which continent is Côte d’Ivoire in?", listOf("Africa","Europe","Asia"), "Africa"),
        bq("Quel océan sépare l’Afrique et l’Amérique ?", listOf("Atlantique","Pacifique","Arctique"), "Atlantique",
           "Which ocean lies between Africa and America?", listOf("Atlantic","Pacific","Arctic"), "Atlantic"),
        bq("Quelle est la capitale de la France ?", listOf("Paris","Lyon","Marseille"), "Paris",
           "What is the capital of France?", listOf("Paris","Lyon","Marseille"), "Paris")
    )),
    "animals" to MiniActivity("Quiz Animaux","Animal quiz", listOf(
        bq("Quel animal a une trompe ? 🐘", listOf("Éléphant","Lion","Zèbre"), "Éléphant",
           "Which animal has a trunk? 🐘", listOf("Elephant","Lion","Zebra"), "Elephant"),
        bq("Quel animal donne du lait ? 🐄", listOf("Vache","Girafe","Tigre"), "Vache",
           "Which animal gives milk? 🐄", listOf("Cow","Giraffe","Tiger"), "Cow"),
        bq("Quel animal rugit ? 🦁", listOf("Lion","Lapin","Poisson"), "Lion",
           "Which animal roars? 🦁", listOf("Lion","Rabbit","Fish"), "Lion")
    )),
    "space" to MiniActivity("Mini-jeu Espace","Space mini-game", listOf(
        bq("Nous vivons sur… 🌍", listOf("la Terre","Mars","Jupiter"), "la Terre",
           "We live on… 🌍", listOf("Earth","Mars","Jupiter"), "Earth"),
        bq("Quelle planète est rouge ? 🔴", listOf("Mars","Vénus","Neptune"), "Mars",
           "Which planet is red? 🔴", listOf("Mars","Venus","Neptune"), "Mars"),
        bq("Le Soleil est au centre du… ☀️", listOf("système solaire","océan","continent"), "système solaire",
           "The Sun is at the center of the… ☀️", listOf("solar system","ocean","continent"), "solar system")
    )),
    "art" to MiniActivity("Mini-jeu Art","Art mini-game", listOf(
        bq("Quel outil sert à peindre ? 🎨", listOf("Pinceau","Fourchette","Chaussure"), "Pinceau",
           "Which tool is used to paint? 🎨", listOf("Paintbrush","Fork","Shoe"), "Paintbrush"),
        bq("Quelle couleur obtient-on avec rouge + jaune ?", listOf("Orange","Vert","Bleu"), "Orange",
           "What color do red + yellow make?", listOf("Orange","Green","Blue"), "Orange"),
        bq("Un cercle est une…", listOf("forme","animal","pays"), "forme",
           "A circle is a…", listOf("shape","animal","country"), "shape")
    )),
    "languages" to MiniActivity("Mots FR / EN","French / English words", listOf(
        bq("Comment dit-on « chat » en anglais ? 🐱", listOf("Cat","Dog","Bird"), "Cat",
           "How do you say « cat » in French? 🐱", listOf("chat","chien","oiseau"), "chat"),
        bq("Comment dit-on « soleil » en anglais ? ☀️", listOf("Sun","Moon","Star"), "Sun",
           "How do you say « sun » in French? ☀️", listOf("soleil","lune","étoile"), "soleil"),
        bq("Comment dit-on « merci » en anglais ?", listOf("Thank you","Hello","Please"), "Thank you",
           "How do you say « thank you » in French?", listOf("merci","bonjour","s’il te plaît"), "merci")
    )),
    "puzzle" to MiniActivity("Puzzles","Puzzles", listOf(
        bq("Quelle pièce complète la suite ? 🧩 1 2 _", listOf("3","5","8"), "3",
           "Which piece completes the pattern? 🧩 1 2 _", listOf("3","5","8"), "3"),
        bq("Quel objet va avec une serrure ?", listOf("Clé","Ballon","Livre"), "Clé",
           "Which object goes with a lock?", listOf("Key","Ball","Book"), "Key"),
        bq("Quel élément est différent ? 🍎 🍎 🍌", listOf("Banane","Pomme","Cerise"), "Banane",
           "Which one is different? 🍎 🍎 🍌", listOf("Banana","Apple","Cherry"), "Banana")
    )),
    "math" to MiniActivity("Maths","Math", listOf(
        qn("1 + 2 = ?", listOf("2","3","4"), "3"),
        qn("5 - 2 = ?", listOf("2","3","4"), "3"),
        qn("2 + 2 = ?", listOf("3","4","5"), "4")
    )),
    "geography" to MiniActivity("Géographie","Geography", listOf(
        bq("La France est en… 🇫🇷", listOf("Europe","Asie","Océanie"), "Europe",
           "France is in… 🇫🇷", listOf("Europe","Asia","Oceania"), "Europe"),
        bq("La Côte d’Ivoire est en… 🇨🇮", listOf("Afrique","Europe","Amérique"), "Afrique",
           "Côte d’Ivoire is in… 🇨🇮", listOf("Africa","Europe","America"), "Africa"),
        bq("Tokyo est la capitale de… 🇯🇵", listOf("Japon","Kenya","Égypte"), "Japon",
           "Tokyo is the capital of… 🇯🇵", listOf("Japan","Kenya","Egypt"), "Japan")
    )),
    "logic" to MiniActivity("Logique","Logic", listOf(
        qn("2, 4, 6, _", listOf("7","8","9"), "8"),
        bq("🔴 🔵 🔴 🔵 _", listOf("Rouge","Vert","Jaune"), "Rouge",
           "🔴 🔵 🔴 🔵 _", listOf("Red","Green","Yellow"), "Red"),
        bq("Petit → moyen → _", listOf("grand","petit","haut"), "grand",
           "Small → medium → _", listOf("big","small","tall"), "big")
    )),
    "french" to MiniActivity("Français","French", listOf(
        bq("Quel mot commence par B ? 🍌", listOf("Banane","Éléphant","Lion"), "Banane",
           "Which word starts with B? 🍌", listOf("Banana","Elephant","Lion"), "Banana"),
        bq("Quel mot est un animal ?", listOf("Chien","Table","Maison"), "Chien",
           "Which word is an animal?", listOf("Dog","Table","House"), "Dog"),
        bq("Quel mot complète : « Je ___ un livre »", listOf("lis","bleu","chat"), "lis",
           "Which word completes: « I ___ a book »", listOf("read","blue","cat"), "read")
    )),
    // Exercices d'anglais : volontairement en anglais dans les deux langues.
    "english" to MiniActivity("English","English", listOf(
        qn("Choose the animal 🦁", listOf("Lion","Book","House"), "Lion"),
        qn("2 + 1 = ?", listOf("2","3","4"), "3"),
        qn("Opposite of big is…", listOf("small","blue","fast"), "small")
    )),
    "coloring" to MiniActivity("Couleurs","Colors", listOf(
        bq("Quelle couleur est le ciel ? ☁️", listOf("Bleu","Vert","Rose"), "Bleu",
           "What color is the sky? ☁️", listOf("Blue","Green","Pink"), "Blue"),
        bq("Quelle couleur est souvent associée à l’herbe ? 🌿", listOf("Vert","Noir","Violet"), "Vert",
           "Which color is usually grass? 🌿", listOf("Green","Black","Purple"), "Green"),
        bq("Quelle couleur a une fraise ? 🍓", listOf("Rouge","Bleu","Jaune"), "Rouge",
           "What color is a strawberry? 🍓", listOf("Red","Blue","Yellow"), "Red")
    )),
    "trace_letters" to MiniActivity("Les lettres","Letters", listOf(
        bq("Quelle lettre vient après A ?", listOf("B","D","Z"), "B",
           "Which letter comes after A?", listOf("B","D","Z"), "B"),
        bq("Quelle lettre commence « Fanti » ?", listOf("F","T","P"), "F",
           "Which letter does « Fanti » start with?", listOf("F","T","P"), "F"),
        bq("Quelle lettre est une voyelle ?", listOf("A","B","C"), "A",
           "Which letter is a vowel?", listOf("A","B","C"), "A")
    )),
    "shapes" to MiniActivity("Formes","Shapes", listOf(
        bq("Quelle forme a 3 côtés ?", listOf("Triangle","Cercle","Carré"), "Triangle",
           "Which shape has 3 sides?", listOf("Triangle","Circle","Square"), "Triangle"),
        bq("Quelle forme est ronde ?", listOf("Cercle","Triangle","Rectangle"), "Cercle",
           "Which shape is round?", listOf("Circle","Triangle","Rectangle"), "Circle"),
        bq("Un carré a…", listOf("4 côtés","2 côtés","6 côtés"), "4 côtés",
           "A square has…", listOf("4 sides","2 sides","6 sides"), "4 sides")
    ))
)

/** Activités disponibles (accès interne : utilisé par les tests de contenu). */
internal val allMiniActivities:Map<String,MiniActivity> get()=activities

/** Quiz d'une matière ou d'un jeu : 3 questions, réessai possible, étoiles limitées à une fois par jour. */
@Composable
fun MiniQuiz(id:String,language:String,claim:Claim,onFinished:()->Unit){
    val activity=activities[id]
    if(activity==null){
        LaunchedEffect(id){onFinished()}
        return
    }
    QuizGame(activity.title(language),activity.questions,language,"quiz:$id",claim,onFinished)
}
