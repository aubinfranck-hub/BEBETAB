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
import kotlinx.coroutines.launch

data class QuizQuestion(val prompt:String,val choices:List<String>,val answer:String)

private val letterQuestions=listOf(
    QuizQuestion("Quelle lettre commence le mot 🦁 Lion ?",listOf("L","M","P"),"L"),
    QuizQuestion("Quelle lettre commence le mot 🐘 Éléphant ?",listOf("E","A","O"),"E"),
    QuizQuestion("Quelle lettre commence le mot 🐟 Poisson ?",listOf("B","P","T"),"P")
)

private val numberQuestions=listOf(
    QuizQuestion("Combien y a-t-il de 🍎 ?\n🍎🍎🍎",listOf("2","3","4"),"3"),
    QuizQuestion("Combien y a-t-il de ⭐ ?\n⭐⭐⭐⭐⭐",listOf("4","5","6"),"5"),
    QuizQuestion("Combien y a-t-il de 🐠 ?\n🐠🐠🐠🐠🐠🐠",listOf("5","6","7"),"6")
)

@Composable
fun QuizGame(title:String,questions:List<QuizQuestion>,onStars:(Int)->Unit){
    var index by remember { mutableIntStateOf(0) }
    var feedback by remember { mutableStateOf<String?>(null) }
    var locked by remember { mutableStateOf(false) }
    val q=questions[index]
    Column(Modifier.fillMaxSize().padding(24.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.spacedBy(18.dp)){
        Text(title,fontSize=30.sp,fontWeight=FontWeight.Black)
        Text(q.prompt,fontSize=25.sp,fontWeight=FontWeight.Bold)
        Row(horizontalArrangement=Arrangement.spacedBy(14.dp)){
            q.choices.forEach{choice->
                Button(
                    enabled=!locked,
                    onClick={
                        locked=true
                        if(choice==q.answer){feedback="Bravo ! ⭐";onStars(2)}
                        else feedback="Essaie encore !"
                    },
                    modifier=Modifier.sizeIn(minWidth=110.dp,minHeight=64.dp),
                    shape=RoundedCornerShape(20.dp)
                ){Text(choice,fontSize=24.sp,fontWeight=FontWeight.Black)}
            }
        }
        feedback?.let{Text(it,fontSize=22.sp,fontWeight=FontWeight.ExtraBold)}
        if(locked){
            Button(onClick={
                index=(index+1)%questions.size
                locked=false
                feedback=null
            }){Text("Question suivante")}
        }
    }
}

@Composable fun QuizLettres(onStars:(Int)->Unit){QuizGame("Quiz des lettres",letterQuestions,onStars)}
@Composable fun QuizNombres(onStars:(Int)->Unit){QuizGame("Quiz des nombres",numberQuestions,onStars)}
