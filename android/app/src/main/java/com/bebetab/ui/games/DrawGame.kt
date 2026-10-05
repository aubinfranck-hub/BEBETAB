package com.bebetab.ui.games

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp

@Composable
fun DrawGame(){
    var strokes by remember{mutableStateOf(listOf<Pair<Color,List<Offset>>>())}
    var currentColor by remember{mutableStateOf(Color.Black)}
    val colors=listOf(Color.Black,Color.Red,Color.Blue,Color.Green,Color.Yellow,Color.Magenta,Color.Cyan)
    Column(Modifier.fillMaxSize().padding(12.dp)){
        Row(horizontalArrangement=Arrangement.spacedBy(8.dp)){
            colors.forEach{c->Button(onClick={currentColor=c}){Text("●",color=c)}}
            OutlinedButton(onClick={strokes::clear}){Text("Effacer tout")}
        }
        Spacer(Modifier.height(8.dp))
        Canvas(Modifier.fillMaxSize().background(Color.White).pointerInput(currentColor){
            detectDragGestures(
                onDragStart={offset->strokes=strokes+(currentColor to listOf(offset))},
                onDrag={change,_->change.consume();val last=strokes.last();strokes=strokes.dropLast(1)+(last.first to last.second+change.position)}
            )
        }){
            strokes.forEach{(color,points)->
                if(points.size>1){
                    val path=Path().apply{moveTo(points.first().x,points.first().y);points.drop(1).forEach{lineTo(it.x,it.y)}}
                    drawPath(path,color=color,style=androidx.compose.ui.graphics.drawscope.Stroke(width=10f))
                }
            }
        }
    }
}
