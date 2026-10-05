package com.bebetab.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.text.font.FontWeight
import com.bebetab.ui.theme.OutlineBlue

@Composable
fun ProgressHeader(stars:Int){
    val level=stars/50+1
    val remainder=stars%50
    Column(Modifier.width(150.dp)){
        Row(horizontalArrangement=Arrangement.spacedBy(5.dp)){
            Text("⭐ $stars",fontWeight=FontWeight.Black,fontSize=12.sp)
            Text("Niveau $level",fontWeight=FontWeight.Bold,fontSize=12.sp)
        }
        LinearProgressIndicator(
            progress={remainder/50f},
            modifier=Modifier.fillMaxWidth().height(7.dp),
            color=OutlineBlue
        )
    }
}
