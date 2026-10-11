package com.bebetab.ui.games

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.detectDragGestures
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.snapshots.SnapshotStateList
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.BlendMode
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.CompositingStrategy
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

/** Un trait : ses points sont ajoutés sur place (pas de copie de liste à chaque mouvement du doigt). */
private class StrokeData(val color:Color,val width:Float,val eraser:Boolean,val points:SnapshotStateList<Offset>)

private val LETTERS=('A'..'Z').map{it.toString()}
private val DIGITS=('0'..'9').map{it.toString()}

/**
 * Atelier de dessin. [mode] : "free", "color", "letters", "numbers", "shapes" ou "art".
 * En mode lettres / chiffres, un modèle gris géant guide le tracé et l'enfant choisit la lettre ou le chiffre.
 */
@Composable
fun DrawGame(language:String="fr", mode:String="free"){
    val en=language=="en"
    val strokes=remember(mode){mutableStateListOf<StrokeData>()}
    var currentColor by remember{mutableStateOf(Color.Black)}
    var brushWidth by remember{mutableFloatStateOf(10f)}
    var eraser by remember{mutableStateOf(false)}
    var guideIndex by remember(mode){mutableIntStateOf(0)}
    val colors=listOf(Color.Black,Color.Red,Color.Blue,Color.Green,Color(0xFFFFC107),Color.Magenta,Color.Cyan)
    val guides=when(mode){"letters"->LETTERS;"numbers"->DIGITS;else->emptyList()}
    val title=when(mode){
        "color"->if(en)"Coloring" else "Coloriage"
        "letters"->if(en)"Trace letters" else "Tracer lettres"
        "numbers"->if(en)"Trace numbers" else "Tracer chiffres"
        "shapes"->if(en)"Shapes" else "Formes"
        "art"->if(en)"Art studio" else "Atelier d’art"
        else->if(en)"Free drawing" else "Dessin libre"
    }
    val measurer=rememberTextMeasurer()

    Column(Modifier.fillMaxSize().padding(10.dp)){
        Row(horizontalArrangement=Arrangement.spacedBy(5.dp),modifier=Modifier.fillMaxWidth()){
            colors.forEach{c->
                val selected=!eraser && c==currentColor
                val onClick={currentColor=c;eraser=false}
                if(selected) Button(onClick=onClick,modifier=Modifier.height(42.dp),contentPadding=PaddingValues(horizontal=8.dp)){Text("●",color=c,fontSize=20.sp)}
                else OutlinedButton(onClick=onClick,modifier=Modifier.height(42.dp),contentPadding=PaddingValues(horizontal=8.dp)){Text("●",color=c,fontSize=20.sp)}
            }
            if(eraser) Button(onClick={eraser=true}){Text(if(en)"Eraser" else "Gomme")}
            else OutlinedButton(onClick={eraser=true}){Text(if(en)"Eraser" else "Gomme")}
            OutlinedButton(onClick={brushWidth=5f}){Text(if(en)"Thin" else "Fin")}
            OutlinedButton(onClick={brushWidth=10f}){Text(if(en)"Medium" else "Moyen")}
            OutlinedButton(onClick={brushWidth=18f}){Text(if(en)"Thick" else "Épais")}
            OutlinedButton(onClick={strokes.clear()}){Text(if(en)"Clear" else "Effacer")}
        }
        Row(Modifier.padding(vertical=5.dp),verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(12.dp)){
            Text(title,fontSize=22.sp,fontWeight=FontWeight.Black)
            if(guides.isNotEmpty()){
                OutlinedButton(onClick={guideIndex=(guideIndex-1+guides.size)%guides.size;strokes.clear()}){Text("◀")}
                Text(guides[guideIndex],fontSize=26.sp,fontWeight=FontWeight.Black)
                OutlinedButton(onClick={guideIndex=(guideIndex+1)%guides.size;strokes.clear()}){Text("▶")}
            }
        }
        Box(Modifier.fillMaxSize().background(Color.White)){
            // Calque 1 : le modèle à suivre. Il est séparé des traits pour que la gomme ne l'efface pas.
            Canvas(Modifier.fillMaxSize()){
                when(mode){
                    "letters","numbers"->{
                        val style=TextStyle(fontSize=(size.minDimension*.85f).toSp(),fontWeight=FontWeight.Black,color=Color(0xFFE3E3E3))
                        val layout=measurer.measure(guides[guideIndex],style)
                        drawText(layout,topLeft=Offset((size.width-layout.size.width)/2f,(size.height-layout.size.height)/2f))
                    }
                    "shapes"->{
                        val r=size.minDimension*.16f
                        drawCircle(Color.LightGray,r,Offset(size.width*.25f,size.height*.5f),style=Stroke(width=10f))
                        drawRect(Color.LightGray,Offset(size.width*.42f,size.height*.5f-r),androidx.compose.ui.geometry.Size(r*2,r*2),style=Stroke(width=10f))
                        val tri=Path().apply{
                            moveTo(size.width*.75f,size.height*.5f-r)
                            lineTo(size.width*.75f+r,size.height*.5f+r)
                            lineTo(size.width*.75f-r,size.height*.5f+r)
                            close()
                        }
                        drawPath(tri,Color.LightGray,style=Stroke(width=10f))
                    }
                    "color"->{
                        drawCircle(Color(0xFFEAF7FF),size.minDimension*.18f,Offset(size.width*.40f,size.height*.52f))
                        drawCircle(Color(0xFFFFF1D0),size.minDimension*.10f,Offset(size.width*.62f,size.height*.50f))
                        drawLine(Color.LightGray,Offset(size.width*.28f,size.height*.72f),Offset(size.width*.70f,size.height*.72f),8f)
                    }
                    else->Unit
                }
            }
            // Calque 2 : les traits. Calcul hors écran pour que « Clear » (gomme) ne perce que les traits.
            Canvas(
                Modifier.fillMaxSize()
                    .graphicsLayer(compositingStrategy=CompositingStrategy.Offscreen)
                    .pointerInput(currentColor,brushWidth,eraser,mode){
                        detectDragGestures(
                            onDragStart={offset->
                                strokes.add(StrokeData(currentColor,brushWidth,eraser,mutableStateListOf(offset)))
                            },
                            onDrag={change,_->
                                change.consume()
                                strokes.lastOrNull()?.points?.add(change.position)
                            }
                        )
                    }
            ){
                strokes.forEach{s->
                    val mixing=if(s.eraser) BlendMode.Clear else BlendMode.SrcOver
                    if(s.points.size>1){
                        val path=Path().apply{
                            moveTo(s.points.first().x,s.points.first().y)
                            for(i in 1 until s.points.size) lineTo(s.points[i].x,s.points[i].y)
                        }
                        drawPath(path,s.color,style=Stroke(width=s.width,cap=StrokeCap.Round,join=StrokeJoin.Round),blendMode=mixing)
                    }else if(s.points.size==1){
                        drawCircle(s.color,s.width/2f,s.points.first(),blendMode=mixing)
                    }
                }
            }
        }
    }
}
