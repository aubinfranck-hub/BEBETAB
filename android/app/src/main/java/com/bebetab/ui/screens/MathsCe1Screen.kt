package com.bebetab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.Bilingual

private data class MathsQuestion(
    val prompt: Bilingual,
    val choices: List<Bilingual>,
    val answer: Int,
    val hint: Bilingual
)

private data class MathsTopic(
    val title: Bilingual,
    val emoji: String,
    val questions: List<MathsQuestion>
)

private fun mq(fr: String, en: String, choicesFr: List<String>, choicesEn: List<String>, answer: Int, hintFr: String, hintEn: String) =
    MathsQuestion(Bilingual(fr,en), choicesFr.zip(choicesEn).map { Bilingual(it.first,it.second) }, answer, Bilingual(hintFr,hintEn))

private val mathsTopics = listOf(
    MathsTopic(Bilingual("Numération","Numbers"),"🔢", listOf(
        mq("Quel nombre vient après 39 ?","Which number comes after 39?",listOf("38","40","49"),listOf("38","40","49"),1,"Après 39, on ajoute 1.","After 39, add 1."),
        mq("Combien font 5 dizaines et 3 unités ?","How much is 5 tens and 3 ones?",listOf("35","53","8"),listOf("35","53","8"),1,"5 dizaines valent 50.","5 tens are worth 50."),
        mq("Quel est le plus grand nombre ?","Which is the greatest number?",listOf("62","26","60"),listOf("62","26","60"),0,"Compare d’abord les dizaines.","Compare the tens first."),
        mq("Complète : 70, 71, __ ?","Complete: 70, 71, __?",listOf("69","72","80"),listOf("69","72","80"),1,"Compte de un en un.","Count forward by ones.")
    )),
    MathsTopic(Bilingual("Additions","Addition"),"➕", listOf(
        mq("24 + 13 = ?","24 + 13 = ?",listOf("37","27","41"),listOf("37","27","41"),0,"Additionne les unités, puis les dizaines.","Add the ones, then the tens."),
        mq("35 + 20 = ?","35 + 20 = ?",listOf("37","55","45"),listOf("37","55","45"),1,"Ajoute 2 dizaines à 35.","Add 2 tens to 35."),
        mq("18 + 7 = ?","18 + 7 = ?",listOf("24","25","26"),listOf("24","25","26"),1,"Pense à 18 + 2 + 5.","Think of 18 + 2 + 5."),
        mq("12 + 16 = ?","12 + 16 = ?",listOf("28","26","18"),listOf("28","26","18"),0,"12 + 10, puis encore 6.","12 + 10, then 6 more.")
    )),
    MathsTopic(Bilingual("Soustractions","Subtraction"),"➖", listOf(
        mq("36 − 12 = ?","36 − 12 = ?",listOf("24","22","26"),listOf("24","22","26"),0,"Retire 10, puis 2.","Take away 10, then 2."),
        mq("50 − 20 = ?","50 − 20 = ?",listOf("70","30","40"),listOf("70","30","40"),1,"Retire 2 dizaines.","Take away 2 tens."),
        mq("27 − 5 = ?","27 − 5 = ?",listOf("23","22","32"),listOf("23","22","32"),1,"Enlève 5 unités à 27.","Take away 5 ones from 27."),
        mq("15 − 8 = ?","15 − 8 = ?",listOf("7","8","9"),listOf("7","8","9"),0,"Compte 8 pas en arrière depuis 15.","Count back 8 from 15.")
    )),
    MathsTopic(Bilingual("Multiplications","Multiplication"),"✖️", listOf(
        mq("3 groupes de 2 pommes, cela fait…","3 groups of 2 apples make…",listOf("5","6","8"),listOf("5","6","8"),1,"Compte 2 + 2 + 2.","Count 2 + 2 + 2."),
        mq("2 × 5 = ?","2 × 5 = ?",listOf("7","10","12"),listOf("7","10","12"),1,"Ajoute 5 deux fois.","Add 5 twice."),
        mq("4 + 4 + 4 = ?","4 + 4 + 4 = ?",listOf("8","12","16"),listOf("8","12","16"),1,"C’est 3 groupes de 4.","That is 3 groups of 4."),
        mq("5 × 3 = ?","5 × 3 = ?",listOf("8","15","20"),listOf("8","15","20"),1,"Compte 5, 10, puis 15.","Count 5, 10, then 15.")
    )),
    MathsTopic(Bilingual("Petits problèmes","Word problems"),"🧠", listOf(
        mq("Awa a 12 billes et en gagne 5. Combien en a-t-elle ?","Awa has 12 marbles and wins 5. How many now?",listOf("7","17","18"),listOf("7","17","18"),1,"Elle en gagne : il faut ajouter.","She wins some: add them."),
        mq("Il y a 20 mangues. On en mange 6. Il en reste…","There are 20 mangoes. 6 are eaten. How many remain?",listOf("14","16","26"),listOf("14","16","26"),0,"On en mange : il faut retirer.","Some are eaten: subtract them."),
        mq("3 paniers ont 2 oranges chacun. Combien d’oranges ?","3 baskets have 2 oranges each. How many oranges?",listOf("5","6","8"),listOf("5","6","8"),1,"Fais 2 + 2 + 2.","Work out 2 + 2 + 2."),
        mq("Kofi lit 8 pages lundi et 7 mardi. Total ?","Kofi reads 8 pages Monday and 7 Tuesday. Total?",listOf("13","15","16"),listOf("13","15","16"),1,"Réunis les pages des deux jours.","Put the two days together.")
    )),
    MathsTopic(Bilingual("Mesures & formes","Measures & shapes"),"📏", listOf(
        mq("Combien de côtés a un triangle ?","How many sides does a triangle have?",listOf("3","4","5"),listOf("3","4","5"),0,"Le préfixe « tri » signifie trois.","The prefix “tri” means three."),
        mq("Quelle unité mesure la longueur d’un crayon ?","Which unit measures a pencil’s length?",listOf("litre","centimètre","kilogramme"),listOf("litre","centimeter","kilogram"),1,"Un crayon se mesure avec une petite unité de longueur.","A pencil is measured in a small unit of length."),
        mq("Combien de jours y a-t-il dans une semaine ?","How many days are in a week?",listOf("5","7","10"),listOf("5","7","10"),1,"La semaine comprend lundi à dimanche.","A week runs from Monday to Sunday."),
        mq("Un carré a…","A square has…",listOf("4 côtés égaux","3 côtés","2 côtés égaux"),listOf("4 equal sides","3 sides","2 equal sides"),0,"Ses quatre côtés ont la même longueur.","All four sides have the same length.")
    ))
)

@Composable
fun MathsCe1Screen(language: String, onStars: (Int) -> Unit) {
    val english = language == "en"
    var topicIndex by remember { mutableIntStateOf(-1) }
    var questionIndex by remember { mutableIntStateOf(0) }
    var answerIndex by remember { mutableIntStateOf(-1) }

    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(14.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(if(english) "CE1 Maths" else "Maths CE1", fontSize=25.sp, fontWeight=FontWeight.Bold, color=Color(0xFF274060))
        Text(if(english) "Choose a topic and earn stars as you learn!" else "Choisis un thème et gagne des étoiles en apprenant !", color=Color(0xFF526477))
        if(topicIndex < 0) {
            mathsTopics.forEachIndexed { index, topic ->
                Card(
                    onClick={ topicIndex=index; questionIndex=0; answerIndex=-1 },
                    colors=CardDefaults.cardColors(containerColor=Color(0xFFF1F7FF)),
                    modifier=Modifier.fillMaxWidth()
                ) {
                    Row(Modifier.padding(16.dp), verticalAlignment=Alignment.CenterVertically, horizontalArrangement=Arrangement.spacedBy(12.dp)) {
                        Text(topic.emoji,fontSize=27.sp)
                        Column(Modifier.weight(1f)) {
                            Text(topic.title.text(language),fontWeight=FontWeight.Bold,fontSize=18.sp)
                            Text(if(english) "${topic.questions.size} questions" else "${topic.questions.size} questions",fontSize=13.sp,color=Color(0xFF526477))
                        }
                        Text("›",fontSize=26.sp,color=Color(0xFF315F9B))
                    }
                }
            }
        } else {
            val topic=mathsTopics[topicIndex]
            if(questionIndex >= topic.questions.size) {
                Text("🎉",fontSize=48.sp)
                Text(if(english) "Great work!" else "Bravo !",fontSize=23.sp,fontWeight=FontWeight.Bold)
                Text(if(english) "You finished ${topic.title.text(language)}." else "Tu as terminé : ${topic.title.text(language)}.",color=Color(0xFF526477))
                Button(onClick={topicIndex=-1;questionIndex=0;answerIndex=-1}) { Text(if(english) "Choose another topic" else "Choisir un autre thème") }
            } else {
                val question=topic.questions[questionIndex]
                Row(Modifier.fillMaxWidth(), horizontalArrangement=Arrangement.SpaceBetween, verticalAlignment=Alignment.CenterVertically) {
                    TextButton(onClick={topicIndex=-1;questionIndex=0;answerIndex=-1}) { Text(if(english) "← Topics" else "← Thèmes") }
                    Text("${questionIndex+1}/${topic.questions.size}",fontWeight=FontWeight.SemiBold,color=Color(0xFF526477))
                }
                LinearProgressIndicator(progress={ (questionIndex+1).toFloat()/topic.questions.size }, modifier=Modifier.fillMaxWidth())
                Card(colors=CardDefaults.cardColors(containerColor=Color(0xFFFFF7E6)), modifier=Modifier.fillMaxWidth()) {
                    Text(question.prompt.text(language),Modifier.padding(20.dp),fontSize=21.sp,fontWeight=FontWeight.Bold,textAlign=TextAlign.Center)
                }
                question.choices.forEachIndexed { index, choice ->
                    val correct = index == question.answer
                    val picked = index == answerIndex
                    val color = when {
                        answerIndex < 0 -> Color(0xFFF1F7FF)
                        correct -> Color(0xFFE2F5E9)
                        picked -> Color(0xFFFFE9E5)
                        else -> Color(0xFFF6F7F9)
                    }
                    Card(
                        onClick={ if(answerIndex<0) { answerIndex=index; if(correct) onStars(2) } },
                        colors=CardDefaults.cardColors(containerColor=color),
                        modifier=Modifier.fillMaxWidth()
                    ) {
                        Text(choice.text(language),Modifier.fillMaxWidth().padding(16.dp),fontSize=18.sp,textAlign=TextAlign.Center,fontWeight=FontWeight.Medium)
                    }
                }
                if(answerIndex>=0) {
                    Text(
                        if(answerIndex==question.answer) (if(english) "Correct! +2 stars ⭐" else "Bonne réponse ! +2 étoiles ⭐")
                        else "${if(english) "Hint: " else "Indice : "}${question.hint.text(language)}",
                        color=if(answerIndex==question.answer) Color(0xFF21864A) else Color(0xFF9B5A12),
                        fontWeight=FontWeight.SemiBold
                    )
                    Button(onClick={questionIndex++;answerIndex=-1},modifier=Modifier.fillMaxWidth()) {
                        Text(if(english) "Next question" else "Question suivante")
                    }
                }
            }
        }
    }
}
