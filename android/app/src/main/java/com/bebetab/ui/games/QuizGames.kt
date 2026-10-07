package com.bebetab.ui.games

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight

data class QuizQuestion(val prompt:String,val choices:List<String>,val answer:String)

private val letterQuestions=listOf(
    QuizQuestion("Quelle lettre commence le mot 🦁 Lion ?","L M P".split(" "),"L"),
    QuizQuestion("Quelle lettre commence le mot 🐘 Éléphant ?","E A O".split(" "),"E"),
    QuizQuestion("Quelle lettre commence le mot 🐟 Poisson ?","B P T".split(" "),"P")
)
private val numberQuestions=listOf(
    QuizQuestion("Combien y a-t-il de 🍎 ?\n🍎🍎🍎",listOf("2","3","4"),"3"),
    QuizQuestion("Combien y a-t-il de ⭐ ?\n⭐⭐⭐⭐⭐",listOf("4","5","6"),"5"),
    QuizQuestion("Combien y a-t-il de 🐠 ?\n🐠🐠🐠🐠🐠🐠",listOf("5","6","7"),"6")
)

@Composable
fun QuizGame(title:String,questions:List<QuizQuestion>,language:String="fr",onStars:(Int)->Unit){
    var index by remember{mutableIntStateOf(0)}
    var feedback by remember{mutableStateOf<String?>(null)}
    var locked by remember{mutableStateOf(false)}
    val q=questions[index]
    Column(Modifier.fillMaxSize().padding(24.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.spacedBy(18.dp)){
        Text(title,fontSize=30.sp,fontWeight=FontWeight.Black)
        Text(q.prompt,fontSize=25.sp,fontWeight=FontWeight.Bold,textAlign=androidx.compose.ui.text.style.TextAlign.Center)
        Row(horizontalArrangement=Arrangement.spacedBy(14.dp)){
            q.choices.forEach{choice->
                Button(enabled=!locked,onClick={
                    locked=true
                    if(choice==q.answer){feedback=if(language=="en")"Great job! ⭐ +2" else "Bravo ! ⭐ +2";onStars(2)}
                    else feedback=if(language=="en")"Try again!" else "Essaie encore !"
                },modifier=Modifier.sizeIn(minWidth=110.dp,minHeight=64.dp),shape=RoundedCornerShape(20.dp)){
                    Text(choice,fontSize=24.sp,fontWeight=FontWeight.Black)
                }
            }
        }
        feedback?.let{Text(it,fontSize=22.sp,fontWeight=FontWeight.ExtraBold)}
        if(locked)Button(onClick={index=(index+1)%questions.size;locked=false;feedback=null}){
            Text(if(language=="en")"Next question" else "Question suivante")
        }
    }
}

@Composable fun QuizLettres(onStars:(Int)->Unit,language:String="fr"){QuizGame(if(language=="en")"Letter quiz" else "Quiz des lettres",letterQuestions,language,onStars)}
@Composable fun QuizNombres(onStars:(Int)->Unit,language:String="fr"){QuizGame(if(language=="en")"Number quiz" else "Quiz des nombres",numberQuestions,language,onStars)}
