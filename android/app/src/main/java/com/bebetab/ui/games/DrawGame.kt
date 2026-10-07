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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

private data class StrokeData(val color:Color,val points:List<Offset>,val width:Float)

@Composable
fun DrawGame(language:String="fr", modeTitle:String?=null){
    var strokes by remember(modeTitle){mutableStateOf(emptyList<StrokeData>())}
    var currentColor by remember{mutableStateOf(Color.Black)}
    var brushWidth by remember{mutableFloatStateOf(10f)}
    var eraser by remember{mutableStateOf(false)}
    val colors=listOf(Color.Black,Color.Red,Color.Blue,Color.Green,Color(0xFFFFC107),Color.Magenta,Color.Cyan)
    val title=modeTitle ?: if(language=="en")"Free drawing" else "Dessin libre"
    val isLetters=title.contains("letter",true)||title.contains("lettre",true)
    val isNumbers=title.contains("number",true)||title.contains("chiffre",true)
    val isShapes=title.contains("shape",true)||title.contains("forme",true)
    val isColoring=title.contains("color",true)||title.contains("colori",true)

    Column(Modifier.fillMaxSize().padding(10.dp)){
        Row(horizontalArrangement=Arrangement.spacedBy(5.dp),modifier=Modifier.fillMaxWidth()){
            colors.forEach{c->
                Button(onClick={currentColor=c;eraser=false},modifier=Modifier.height(42.dp),contentPadding=PaddingValues(horizontal=8.dp)){
                    Text("●",color=c,fontSize=20.sp)
                }
            }
            OutlinedButton(onClick={eraser=true}){Text(if(language=="en")"Eraser" else "Gomme")}
            OutlinedButton(onClick={brushWidth=5f}){Text(if(language=="en")"Thin" else "Fin")}
            OutlinedButton(onClick={brushWidth=10f}){Text(if(language=="en")"Medium" else "Moyen")}
            OutlinedButton(onClick={brushWidth=18f}){Text(if(language=="en")"Thick" else "Épais")}
            OutlinedButton(onClick={strokes=emptyList()}){Text(if(language=="en")"Clear" else "Effacer")}
        }
        Text(title,fontSize=22.sp,fontWeight=FontWeight.Black,modifier=Modifier.padding(vertical=5.dp))
        Box(Modifier.fillMaxSize()){
            Canvas(
                Modifier.fillMaxSize().background(Color.White).pointerInput(currentColor,brushWidth,eraser){
                    detectDragGestures(
                        onDragStart={offset->
                            strokes=strokes+StrokeData(if(eraser)Color.White else currentColor,listOf(offset),brushWidth)
                        },
                        onDrag={change,_->
                            change.consume()
                            val last=strokes.lastOrNull() ?: return@detectDragGestures
                            strokes=strokes.dropLast(1)+last.copy(points=last.points+change.position)
                        }
                    )
                }
            ){
                if(isLetters){
                    drawLine(Color.LightGray,Offset(size.width*.30f,size.height*.45f),Offset(size.width*.30f,size.height*.75f),12f)
                    drawLine(Color.LightGray,Offset(size.width*.30f,size.height*.45f),Offset(size.width*.46f,size.height*.45f),12f)
                    drawLine(Color.LightGray,Offset(size.width*.30f,size.height*.60f),Offset(size.width*.43f,size.height*.60f),12f)
                    drawLine(Color.LightGray,Offset(size.width*.46f,size.height*.45f),Offset(size.width*.46f,size.height*.60f),12f)
                }else if(isNumbers){
                    drawLine(Color.LightGray,Offset(size.width*.35f,size.height*.48f),Offset(size.width*.50f,size.height*.38f),12f)
                    drawLine(Color.LightGray,Offset(size.width*.50f,size.height*.38f),Offset(size.width*.50f,size.height*.75f),12f)
                    drawLine(Color.LightGray,Offset(size.width*.30f,size.height*.75f),Offset(size.width*.62f,size.height*.75f),12f)
                }else if(isShapes){
                    drawCircle(Color.LightGray, size.minDimension*.16f, Offset(size.width*.42f,size.height*.52f),style=Stroke(width=10f))
                    drawRect(Color.LightGray,Offset(size.width*.58f,size.height*.40f),androidx.compose.ui.geometry.Size(size.minDimension*.20f,size.minDimension*.20f),style=Stroke(width=10f))
                }else if(isColoring){
                    drawCircle(Color(0xFFEAF7FF),size.minDimension*.18f,Offset(size.width*.40f,size.height*.52f))
                    drawCircle(Color(0xFFFFF1D0),size.minDimension*.10f,Offset(size.width*.62f,size.height*.50f))
                    drawLine(Color.LightGray,Offset(size.width*.28f,size.height*.72f),Offset(size.width*.70f,size.height*.72f),8f)
                }
                strokes.forEach{s->
                    if(s.points.size>1){
                        val path=Path().apply{
                            moveTo(s.points.first().x,s.points.first().y)
                            s.points.drop(1).forEach{lineTo(it.x,it.y)}
                        }
                        drawPath(path,s.color,style=Stroke(width=s.width))
                    }
                }
            }
        }
    }
}
