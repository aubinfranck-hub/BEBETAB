package com.bebetab.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private data class ScienceTopic(
    val title:String,
    val introduction:String,
    val prompt:String,
    val choices:List<String>,
    val answer:Int,
    val hint:String
)

private val scienceTopics=listOf(
    ScienceTopic("Animaux","Les animaux sont des êtres vivants. Ils se nourrissent, grandissent et ont un milieu de vie.","Quel animal possède une trompe ?",listOf("Lion","Éléphant","Poule"),1,"L’éléphant utilise sa trompe pour respirer, sentir et saisir."),
    ScienceTopic("Plantes","Une plante a besoin d’eau, de lumière et d’un milieu adapté pour grandir.","Que faut-il apporter à un jeune plant ?",listOf("De l’eau et de la lumière","Du plastique","De la fumée"),0,"L’eau et la lumière aident la plante à grandir."),
    ScienceTopic("Corps humain","Le corps comprend plusieurs parties qui travaillent ensemble. L’hygiène aide à préserver la santé.","Avec quoi se lave-t-on les mains ?",listOf("Eau et savon","Sable uniquement","Peinture"),0,"Le savon et l’eau aident à enlever les saletés."),
    ScienceTopic("Espace","La Terre est une planète. Elle tourne autour du Soleil avec d’autres planètes.","Quelle étoile éclaire la Terre ?",listOf("La Lune","Le Soleil","Mars"),1,"Le Soleil est l’étoile de notre système.")
)

@Composable
fun ScienceLearningScreen(language:String,onStars:(Int)->Unit){
    val english=language=="en"
    var chosen by remember{mutableIntStateOf(-1)}
    var answer by remember{mutableIntStateOf(-1)}
    Column(Modifier.fillMaxSize().padding(14.dp),verticalArrangement=Arrangement.spacedBy(10.dp)){
        Text(if(english)"SCIENCE DISCOVERY" else "DÉCOUVRIR LES SCIENCES",fontSize=23.sp,fontWeight=FontWeight.Bold,color=Color(0xFF274060))
        if(chosen<0){
            Text(if(english)"Choose a subject to explore." else "Choisis un thème à explorer.",color=Color(0xFF526477))
            listOf(scienceTopics.take(2),scienceTopics.drop(2)).forEach { row ->
                Row(Modifier.fillMaxWidth().weight(1f),horizontalArrangement=Arrangement.spacedBy(10.dp)){
                    row.forEach { topic ->
                        Card(onClick={chosen=scienceTopics.indexOf(topic);answer=-1},modifier=Modifier.weight(1f).fillMaxHeight(),colors=CardDefaults.cardColors(containerColor=Color(0xFFEAF5FF))){
                            Box(Modifier.fillMaxSize().padding(14.dp),contentAlignment=Alignment.Center){
                                Text(topic.title,fontSize=21.sp,fontWeight=FontWeight.Bold,color=Color(0xFF275B8F),textAlign=TextAlign.Center)
                            }
                        }
                    }
                }
            }
            Text(if(english)"Four short lessons, made to explore safely and offline." else "Quatre mini-leçons à découvrir, même hors ligne.",fontSize=13.sp,color=Color(0xFF526477))
        } else {
            val topic=scienceTopics[chosen]
            TextButton(onClick={chosen=-1;answer=-1}){Text(if(english)"← Topics" else "← Thèmes")}
            Card(colors=CardDefaults.cardColors(containerColor=Color(0xFFFFF7E6)),modifier=Modifier.fillMaxWidth().weight(.45f)){
                Column(Modifier.fillMaxSize().padding(18.dp),verticalArrangement=Arrangement.Center,horizontalAlignment=Alignment.CenterHorizontally){
                    Text(topic.title,fontSize=24.sp,fontWeight=FontWeight.Bold,color=Color(0xFF274060))
                    Spacer(Modifier.height(8.dp))
                    Text(topic.introduction,fontSize=18.sp,textAlign=TextAlign.Center,color=Color(0xFF384B5E))
                }
            }
            Text(topic.prompt,fontWeight=FontWeight.Bold,fontSize=18.sp)
            topic.choices.forEachIndexed { index, option ->
                Card(
                    onClick={if(answer<0){answer=index;if(index==topic.answer)onStars(2)}},
                    modifier=Modifier.fillMaxWidth(),
                    colors=CardDefaults.cardColors(containerColor=when{answer<0->Color(0xFFEAF5FF);index==topic.answer->Color(0xFFE3F5E8);index==answer->Color(0xFFFFE9E5);else->Color(0xFFF3F5F7)})
                ){Text(option,Modifier.fillMaxWidth().padding(12.dp),fontSize=17.sp,textAlign=TextAlign.Center)}
            }
            if(answer>=0){
                Text(if(answer==topic.answer)(if(english)"Correct! +2 stars ⭐" else "Bonne réponse ! +2 étoiles ⭐") else (if(english)"Hint: " else "Indice : ")+topic.hint,color=if(answer==topic.answer)Color(0xFF21864A)else Color(0xFF9B5A12),fontWeight=FontWeight.SemiBold)
            }
        }
    }
}
