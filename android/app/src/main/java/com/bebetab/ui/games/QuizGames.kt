package com.bebetab.ui.games

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.ui.components.Claim
import kotlinx.coroutines.launch

data class QuizQuestion(val prompt:String,val choices:List<String>,val answer:String)

/** Une question avec son texte français et son texte anglais. */
data class BilingualQuestion(val fr:QuizQuestion,val en:QuizQuestion){
    fun text(language:String)=if(language=="en") en else fr
}

/** Question dont les textes français et anglais sont différents. */
fun bq(fr:String,frChoices:List<String>,frAnswer:String,en:String,enChoices:List<String>,enAnswer:String)=
    BilingualQuestion(QuizQuestion(fr,frChoices,frAnswer),QuizQuestion(en,enChoices,enAnswer))

/** Question identique dans les deux langues (calculs, suites, exercices d'anglais). */
fun qn(prompt:String,choices:List<String>,answer:String):BilingualQuestion{
    val q=QuizQuestion(prompt,choices,answer)
    return BilingualQuestion(q,q)
}

internal val letterQuestions=listOf(
    bq("Quelle lettre commence le mot 🦁 Lion ?",listOf("L","M","P"),"L","Which letter does the word 🦁 Lion start with?",listOf("L","M","P"),"L"),
    bq("Quelle lettre commence le mot 🐘 Éléphant ?",listOf("E","A","O"),"E","Which letter does the word 🐘 Elephant start with?",listOf("E","A","O"),"E"),
    bq("Quelle lettre commence le mot 🐟 Poisson ?",listOf("B","P","T"),"P","Which letter does the word 🐟 Fish start with?",listOf("B","F","T"),"F")
)
internal val numberQuestions=listOf(
    bq("Combien y a-t-il de 🍎 ?\n🍎🍎🍎",listOf("2","3","4"),"3","How many 🍎 are there?\n🍎🍎🍎",listOf("2","3","4"),"3"),
    bq("Combien y a-t-il de ⭐ ?\n⭐⭐⭐⭐⭐",listOf("4","5","6"),"5","How many ⭐ are there?\n⭐⭐⭐⭐⭐",listOf("4","5","6"),"5"),
    bq("Combien y a-t-il de 🐠 ?\n🐠🐠🐠🐠🐠🐠",listOf("5","6","7"),"6","How many 🐠 are there?\n🐠🐠🐠🐠🐠🐠",listOf("5","6","7"),"6")
)

/**
 * Quiz à choix multiples.
 * - une mauvaise réponse se grise et l'enfant peut réessayer ;
 * - +2 étoiles à la première bonne réponse (+1 après une erreur), une seule fois par question et par jour ;
 * - [onFinished] est appelé après la dernière question ; sans lui, le quiz recommence.
 */
@Composable
fun QuizGame(
    title:String,
    questions:List<BilingualQuestion>,
    language:String,
    rewardPrefix:String,
    claim:Claim,
    onFinished:(()->Unit)?=null
){
    val en=language=="en"
    val scope=rememberCoroutineScope()
    var index by remember(rewardPrefix){mutableIntStateOf(0)}
    var attempts by remember(rewardPrefix){mutableIntStateOf(0)}
    var wrong by remember(rewardPrefix){mutableStateOf(emptySet<String>())}
    var solved by remember(rewardPrefix){mutableStateOf(false)}
    var feedback by remember(rewardPrefix){mutableStateOf<String?>(null)}

    val q=questions[index].text(language)
    // Les choix sont mélangés pour que la bonne réponse ne soit pas toujours au même endroit.
    val choices=remember(rewardPrefix,index,language){q.choices.shuffled()}
    val last=index==questions.lastIndex

    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(20.dp),
        horizontalAlignment=Alignment.CenterHorizontally,
        verticalArrangement=Arrangement.spacedBy(14.dp)
    ){
        Text(title,fontSize=28.sp,fontWeight=FontWeight.Black)
        Text("${if(en)"Question" else "Question"} ${index+1} / ${questions.size}",fontSize=14.sp,fontWeight=FontWeight.Bold)
        Text(q.prompt,fontSize=24.sp,fontWeight=FontWeight.Bold,textAlign=TextAlign.Center)
        Row(horizontalArrangement=Arrangement.spacedBy(14.dp)){
            choices.forEach{choice->
                Button(
                    enabled=!solved && choice !in wrong,
                    onClick={
                        if(choice==q.answer){
                            solved=true
                            val stars=if(attempts==0) 2 else 1
                            scope.launch{
                                val granted=claim("$rewardPrefix:$index",stars)
                                feedback=when{
                                    granted && en->"Great job! ⭐ +$stars"
                                    granted->"Bravo ! ⭐ +$stars"
                                    en->"Great job! You already earned these stars today."
                                    else->"Bravo ! Tu as déjà gagné ces étoiles aujourd'hui."
                                }
                            }
                        }else{
                            attempts+=1
                            wrong=wrong+choice
                            feedback=if(en)"Try again!" else "Essaie encore !"
                        }
                    },
                    modifier=Modifier.sizeIn(minWidth=110.dp,minHeight=64.dp),
                    shape=RoundedCornerShape(20.dp)
                ){
                    Text(choice,fontSize=22.sp,fontWeight=FontWeight.Black)
                }
            }
        }
        feedback?.let{Text(it,fontSize=20.sp,fontWeight=FontWeight.ExtraBold,textAlign=TextAlign.Center)}
        if(solved){
            Button(onClick={
                attempts=0;wrong=emptySet();solved=false;feedback=null
                when{
                    !last->index+=1
                    onFinished!=null->onFinished()
                    else->index=0
                }
            }){
                Text(
                    when{
                        !last->if(en)"Next question" else "Question suivante"
                        onFinished!=null->if(en)"Back to activities" else "Retour aux activités"
                        else->if(en)"Play again" else "Rejouer"
                    }
                )
            }
        }
    }
}

@Composable fun QuizLettres(language:String,claim:Claim,onFinished:(()->Unit)?=null){
    QuizGame(if(language=="en")"Letter quiz" else "Quiz des lettres",letterQuestions,language,"letters",claim,onFinished)
}
@Composable fun QuizNombres(language:String,claim:Claim,onFinished:(()->Unit)?=null){
    QuizGame(if(language=="en")"Number quiz" else "Quiz des nombres",numberQuestions,language,"numbers",claim,onFinished)
}
