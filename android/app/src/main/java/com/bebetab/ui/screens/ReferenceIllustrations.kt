package com.bebetab.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Path
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap

@Composable
fun WorldMapIllustration(modifier: Modifier=Modifier){
    Canvas(modifier){
        drawRect(Brush.verticalGradient(listOf(Color(0xFF6CCEFF),Color(0xFFDDF7FF))))
        val w=size.width; val h=size.height
        repeat(7){i-> drawCircle(Color.White.copy(alpha=.72f),18f+i*3,Offset(w*(.08f+i*.14f),h*(.08f+(i%2)*.08f))) }
        fun land(points:List<Pair<Float,Float>>,color:Color){
            val p=Path().apply{moveTo(w*points[0].first,h*points[0].second);points.drop(1).forEach{lineTo(w*it.first,h*it.second)};close()}
            drawPath(p,color)
        }
        land(listOf(.08f to .35f,.16f to .25f,.26f to .29f,.30f to .40f,.24f to .53f,.18f to .68f,.11f to .57f),Color(0xFF68C86B))
        land(listOf(.34f to .22f,.43f to .20f,.48f to .30f,.45f to .43f,.38f to .46f,.34f to .37f),Color(0xFFFFC44D))
        land(listOf(.51f to .20f,.62f to .22f,.68f to .34f,.63f to .48f,.55f to .44f,.49f to .31f),Color(0xFFFF7A59))
        land(listOf(.70f to .25f,.82f to .30f,.86f to .45f,.80f to .57f,.70f to .49f,.67f to .36f),Color(0xFFCF76E8))
        land(listOf(.66f to .58f,.75f to .56f,.83f to .65f,.77f to .75f,.68f to .70f),Color(0xFF56C8D8))
        land(listOf(.38f to .57f,.49f to .55f,.55f to .65f,.50f to .78f,.40f to .72f),Color(0xFF62B95B))
        land(listOf(.48f to .83f,.61f to .82f,.66f to .91f,.52f to .94f),Color(0xFFE9E6D8))
        // stylised travel balloons and clouds
        for(i in 0..4){
            val x=w*(.10f+i*.20f); val y=h*(.12f+(i%2)*.05f)
            drawOval(Color(0xFFFF6D6D),Offset(x,y),androidx.compose.ui.geometry.Size(28f,38f))
            drawLine(Color(0xFF7D7D7D),Offset(x+14,y+38),Offset(x+14,y+55),2f,StrokeCap.Round)
        }
    }
}

@Composable
fun FranceIllustration(modifier: Modifier=Modifier){
    Canvas(modifier){
        val w=size.width; val h=size.height
        drawRect(Brush.verticalGradient(listOf(Color(0xFF62C8FF),Color(0xFFDFF7FF),Color(0xFF86D36A)),h*.70f,h))
        drawCircle(Color.White.copy(alpha=.75f),28f,Offset(w*.18f,h*.22f))
        drawCircle(Color.White.copy(alpha=.65f),20f,Offset(w*.78f,h*.18f))
        val x=w*.52f
        val base=h*.78f
        val tower=Path().apply{moveTo(x-w*.08f,base);lineTo(x-w*.035f,h*.28f);lineTo(x,h*.18f);lineTo(x+w*.035f,h*.28f);lineTo(x+w*.08f,base);close()}
        drawPath(tower,Color(0xFF8D6E63))
        drawLine(Color(0xFF5D4037),Offset(x,h*.18f),Offset(x,h*.08f),5f)
        drawLine(Color(0xFF5D4037),Offset(x-w*.035f,h*.36f),Offset(x+w*.035f,h*.36f),3f)
        drawLine(Color(0xFF5D4037),Offset(x-w*.055f,h*.52f),Offset(x+w*.055f,h*.52f),3f)
        drawRect(Color(0xFF5AA84F),Offset(0f,h*.72f),androidx.compose.ui.geometry.Size(w,h*.28f))
        repeat(5){i->drawCircle(Color(0xFF3E8D42),22f,Offset(w*(.08f+i*.20f),h*.70f))}
    }
}

@Composable
fun LiveCityIllustration(modifier: Modifier=Modifier,kind:Int){
    Canvas(modifier){
        val w=size.width; val h=size.height
        drawRect(Brush.verticalGradient(listOf(Color(0xFF68CFFF),Color(0xFFDDF7FF),Color(0xFF79B65B))))
        when(kind){
            0->{drawRect(Color(0xFFB0B6C0),Offset(w*.18f,h*.40f),androidx.compose.ui.geometry.Size(w*.18f,h*.45f));drawRect(Color(0xFF7E8791),Offset(w*.42f,h*.30f),androidx.compose.ui.geometry.Size(w*.22f,h*.55f));drawRect(Color(0xFF59636E),Offset(w*.72f,h*.46f),androidx.compose.ui.geometry.Size(w*.16f,h*.39f))}
            1->{repeat(5){i->drawRect(Color(0xFF6C7A88),Offset(w*(.08f+i*.18f),h*(.42f-(i%2)*.12f)),androidx.compose.ui.geometry.Size(w*.13f,h*(.40f+(i%2)*.12f)))}}
            2->{repeat(6){i->drawCircle(Color(0xFF4D9B5A),30f,Offset(w*(.08f+i*.17f),h*.65f))};drawLine(Color(0xFF7D4E35),Offset(w*.55f,h*.65f),Offset(w*.55f,h*.30f),5f)}
            else->{repeat(4){i->drawCircle(Color(0xFF6AA95D),38f,Offset(w*(.15f+i*.23f),h*.70f))}}
        }
    }
}