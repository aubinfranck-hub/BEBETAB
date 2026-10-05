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
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.unit.dp

private data class StrokeData(val color:Color,val points:List<Offset>,val width:Float)
@Composable fun DrawGame(language:String="fr"){
 var strokes by remember{mutableStateOf(emptyList<StrokeData>())}
 var currentColor by remember{mutableStateOf(Color.Black)}
 var brushWidth by remember{mutableFloatStateOf(10f)}
 var eraser by remember{mutableStateOf(false)}
 val colors=listOf(Color.Black,Color.Red,Color.Blue,Color.Green,Color(0xFFFFC107),Color.Magenta,Color.Cyan)
 Column(Modifier.fillMaxSize().padding(12.dp)){
  Row(horizontalArrangement=Arrangement.spacedBy(5.dp)){colors.forEach{c->Button(onClick={currentColor=c;eraser=false},modifier=Modifier.height(42.dp),contentPadding=PaddingValues(6.dp)){Text("●",color=c)}}
   OutlinedButton(onClick={eraser=true}){Text(if(language=="en")"Eraser" else "Gomme")}
   OutlinedButton(onClick={brushWidth=5f}){Text(if(language=="en")"Thin" else "Fin")}
   OutlinedButton(onClick={brushWidth=10f}){Text(if(language=="en")"Medium" else "Moyen")}
   OutlinedButton(onClick={brushWidth=18f}){Text(if(language=="en")"Thick" else "Épais")}
   OutlinedButton(onClick={strokes=emptyList()}){Text(if(language=="en")"Clear" else "Effacer")}
  }
  Spacer(Modifier.height(8.dp))
  Canvas(Modifier.fillMaxSize().background(Color.White).pointerInput(currentColor,brushWidth,eraser){
   detectDragGestures(onDragStart={offset->strokes=strokes+StrokeData(if(eraser)Color.White else currentColor,listOf(offset),brushWidth)},onDrag={change,_->change.consume();val last=strokes.lastOrNull()?:return@detectDragGestures;strokes=strokes.dropLast(1)+last.copy(points=last.points+change.position)})
  }){strokes.forEach{s->if(s.points.size>1){val path=Path().apply{moveTo(s.points.first().x,s.points.first().y);s.points.drop(1).forEach{lineTo(it.x,it.y)}};drawPath(path,s.color,style=Stroke(width=s.width))}}}
 }
}