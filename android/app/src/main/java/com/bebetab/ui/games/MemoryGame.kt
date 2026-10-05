package com.bebetab.ui.games

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight

@Composable
fun MemoryGame(onStars:(Int)->Unit){
    val animals=listOf("🐘","🦁","🐒","🦒","🐼","🦓")
    val cards=remember{(animals+animals).shuffled()}
    var opened by remember{mutableStateOf(emptyList<Int>())}
    var matched by remember{mutableStateOf(emptySet<Int>())}
    var pairs by remember{mutableIntStateOf(0)}
    Column(Modifier.fillMaxSize().padding(18.dp),horizontalAlignment=Alignment.CenterHorizontally){
        Text("Mémoire des animaux",fontSize=28.sp,fontWeight=FontWeight.Black)
        Spacer(Modifier.height(10.dp))
        Column(verticalArrangement=Arrangement.spacedBy(8.dp)){
            cards.chunked(4).forEachIndexed{rowIndex,row->
                Row(horizontalArrangement=Arrangement.spacedBy(8.dp)){
                    row.forEachIndexed{col,value->
                        val index=rowIndex*4+col
                        val visible=index in opened || index in matched
                        Button(
                            onClick={
                                if(index !in matched && index !in opened && opened.size<2){
                                    val next=opened+index
                                    if(next.size==2 && cards[next[0]]==cards[next[1]]){
                                        matched=matched+next
                                        pairs++
                                        onStars(1)
                                        opened=emptyList()
                                    } else {
                                        opened=next
                                    }
                                }
                            },
                            modifier=Modifier.size(105.dp),
                            enabled=index !in matched
                        ){Text(if(visible) value else "?",fontSize=30.sp)}
                    }
                }
            }
        }
        Spacer(Modifier.height(8.dp))
        Text("Paires : $pairs / 6",fontWeight=FontWeight.Bold)
        if(matched.size==12) Text("Bravo ! ⭐ +5 étoiles",fontSize=20.sp,fontWeight=FontWeight.Black)
    }
}
