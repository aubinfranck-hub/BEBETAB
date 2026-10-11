package com.bebetab.ui.games

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import com.bebetab.ui.components.Claim
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun MemoryGame(claim:Claim, language:String="fr"){
    val en=language=="en"
    val scope=rememberCoroutineScope()
    val animals=listOf("🐘","🦁","🐒","🦒","🐼","🦓")
    val cards=remember{(animals+animals).shuffled()}
    var opened by remember{mutableStateOf(emptyList<Int>())}
    var matched by remember{mutableStateOf(emptySet<Int>())}
    var pairs by remember{mutableIntStateOf(0)}
    // null = pas encore terminé ; true = bonus donné ; false = bonus déjà gagné aujourd'hui
    var bonus by remember{mutableStateOf<Boolean?>(null)}

    LaunchedEffect(opened){
        if(opened.size==2 && cards[opened[0]]!=cards[opened[1]]){
            delay(650)
            opened=emptyList()
        }
    }
    LaunchedEffect(matched.size){
        if(matched.size==cards.size && bonus==null){
            bonus=claim("memory:complete",5)
        }
    }
    Column(
        Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(18.dp),
        horizontalAlignment=Alignment.CenterHorizontally
    ){
        Text(if(en)"Animal memory" else "Mémoire des animaux",fontSize=28.sp,fontWeight=FontWeight.Black)
        Spacer(Modifier.height(10.dp))
        Column(verticalArrangement=Arrangement.spacedBy(8.dp)){
            cards.chunked(4).forEachIndexed{rowIndex,row->
                Row(horizontalArrangement=Arrangement.spacedBy(8.dp)){
                    row.forEachIndexed{col,value->
                        val index=rowIndex*4+col
                        val visible=index in opened || index in matched
                        Button(onClick={
                            if(index !in matched && index !in opened && opened.size<2){
                                val next=opened+index
                                if(next.size==2 && cards[next[0]]==cards[next[1]]){
                                    matched=matched+next; pairs++; opened=emptyList()
                                    val pairKey="memory:pair:${cards[next[0]]}"
                                    scope.launch{claim(pairKey,1)}
                                } else opened=next
                            }
                        },modifier=Modifier.size(96.dp),enabled=index !in matched && opened.size<2){
                            Text(if(visible)value else "?",fontSize=30.sp)
                        }
                    }
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Text(if(en)"Pairs: $pairs / 6" else "Paires : $pairs / 6",fontWeight=FontWeight.Bold)
        if(matched.size==cards.size){
            Text(
                when(bonus){
                    true->if(en)"Great job! ⭐ +5 stars" else "Bravo ! ⭐ +5 étoiles"
                    false->if(en)"Great job! Come back tomorrow for more stars." else "Bravo ! Reviens demain pour de nouvelles étoiles."
                    null->""
                },
                fontSize=20.sp,fontWeight=FontWeight.Black
            )
        }
    }
}
