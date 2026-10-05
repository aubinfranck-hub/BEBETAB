package com.bebetab.ui.games

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import kotlin.random.Random

@Composable
fun MemoryGame(onStars:(Int)->Unit){
    val animals=listOf("🐘","🦁","🐒","🦒","🐼","🦓")
    val cards=remember{(animals+animals).shuffled(Random(7))}
    var opened by remember{mutableStateOf(emptyList<Int>())}
    var matched by remember{mutableStateOf(emptySet<Int>())}
    var pairs by remember{mutableIntStateOf(0)}
    Column(Modifier.fillMaxSize().padding(18.dp),horizontalAlignment=Alignment.CenterHorizontally){
        Text("Mémoire des animaux",fontSize=28.sp,fontWeight=FontWeight.Black)
        Spacer(Modifier.height(10.dp))
        Column(verticalArrangement=Arrangement.spacedBy(8.dp)){
            cards.chunked(4).forEach{row->
                Row(horizontalArrangement=Arrangement.spacedBy(8.dp)){
                    row.forEachIndexed{local,value->
                        val i=cards.indexOfFirst{it==value && cards.indexOf(it)>=local}
                        val realIndex=(cards.indexOf(value)+local).coerceAtMost(cards.lastIndex)
                        val visible=realIndex in opened || realIndex in matched
                        Button(
                            onClick={
                                if(!visible && opened.size<2){
                                    val next=opened+realIndex
                                    if(next.size==2){
                                        if(cards[next[0]]==cards[next[1]]){
                                            matched=matched+next
                                            pairs++
                                            onStars(1)
                                            opened=emptyList()
                                        }else opened=next
                                    }else opened=next
                                }
                            },
                            modifier=Modifier.size(105.dp),
                            enabled=realIndex !in matched
                        ){Text(if(visible) cards[realIndex] else "?",fontSize=30.sp)}
                    }
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Text("Paires : $pairs / 6",fontWeight=FontWeight.Bold)
        if(matched.size==12) Text("Bravo ! ⭐ +5 étoiles",fontSize=20.sp,fontWeight=FontWeight.Black)
    }
}
