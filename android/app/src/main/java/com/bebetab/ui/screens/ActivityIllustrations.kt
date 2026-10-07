package com.bebetab.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import com.bebetab.ui.theme.MusicPink
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp

private fun dot(canvas: androidx.compose.ui.graphics.drawscope.DrawScope, x: Float, y: Float, r: Float, color: Color) {
    canvas.drawCircle(color, r, Offset(x, y))
}

@Composable
fun ActivityCardIllustration(modifier: Modifier = Modifier, kind: String) {
    Canvas(modifier) {
        val w = size.width
        val h = size.height
        val cx = w / 2f
        val cy = h / 2f
        when (kind.lowercase()) {
            "letters" -> {
                drawRoundRect(Color.White.copy(.92f), Offset(w*.25f,h*.12f), Size(w*.50f,h*.76f), CornerRadius(18f,18f))
                drawCircle(Color(0xFFFFC107), w*.14f, Offset(cx,cy))
                drawCircle(Color(0xFFEF5350), w*.045f, Offset(cx-w*.14f,cy-h*.14f))
                drawCircle(Color(0xFF42A5F5), w*.045f, Offset(cx+w*.14f,cy+h*.14f))
                drawLine(Color.White, Offset(cx-w*.10f,cy), Offset(cx+w*.10f,cy), w*.025f, StrokeCap.Round)
                drawLine(Color.White, Offset(cx,cy-h*.10f), Offset(cx,cy+h*.10f), w*.025f, StrokeCap.Round)
            }
            "numbers" -> {
                drawRoundRect(Color.White.copy(.9f), Offset(w*.18f,h*.10f), Size(w*.64f,h*.80f), CornerRadius(18f,18f))
                val cols = listOf(Color(0xFFEF5350),Color(0xFF42A5F5),Color(0xFF66BB6A),Color(0xFFFFCA28))
                for (i in 0..3) drawRoundRect(cols[i], Offset(w*(.27f+(i%2)*.22f), h*(.22f+(i/2)*.30f)), Size(w*.16f,h*.18f), CornerRadius(10f,10f))
            }
            "science" -> {
                drawCircle(Color.White.copy(.9f), w*.27f, Offset(cx,cy))
                drawLine(Color(0xFF80CBC4), Offset(cx-w*.10f,cy-h*.18f), Offset(cx+w*.10f,cy+h*.18f), w*.08f, StrokeCap.Round)
                drawCircle(Color(0xFF26A69A), w*.07f, Offset(cx-w*.12f,cy+h*.18f))
                drawCircle(Color(0xFF66BB6A), w*.05f, Offset(cx+w*.13f,cy-h*.16f))
                drawCircle(Color(0xFF42A5F5), w*.05f, Offset(cx+w*.17f,cy+h*.08f))
            }
            "world", "geography" -> {
                drawCircle(Color(0xFF2196F3), w*.27f, Offset(cx,cy))
                drawOval(Color(0xFF66BB6A), Offset(cx-w*.18f,cy-h*.12f), Size(w*.22f,h*.18f))
                drawOval(Color(0xFF81C784), Offset(cx+w*.03f,cy-h*.08f), Size(w*.18f,h*.14f))
                drawArc(Color.White.copy(.35f), 0f, 180f, false, Offset(cx-w*.24f,cy-h*.27f), Size(w*.48f,h*.54f), style=Stroke(w*.018f))
                drawArc(Color.White.copy(.25f), 90f, 180f, false, Offset(cx-w*.27f,cy-h*.17f), Size(w*.54f,h*.34f), style=Stroke(w*.018f))
            }
            "animals", "animals-game" -> {
                drawCircle(Color(0xFFFFC107), w*.20f, Offset(cx,cy))
                drawCircle(Color(0xFFFFC107), w*.11f, Offset(cx-w*.14f,cy-h*.13f))
                drawCircle(Color(0xFFFFC107), w*.11f, Offset(cx+w*.14f,cy-h*.13f))
                dot(this,cx-w*.07f,cy-h*.03f,w*.018f,Color(0xFF263238))
                dot(this,cx+w*.07f,cy-h*.03f,w*.018f,Color(0xFF263238))
                drawOval(Color(0xFF795548), Offset(cx-w*.08f,cy+h*.05f), Size(w*.16f,h*.10f))
            }
            "space" -> {
                drawCircle(Color(0xFF24324A), w*.29f, Offset(cx,cy))
                for (i in 0..7) dot(this,w*(.20f+(i%4)*.20f),h*(.20f+(i/4)*.55f),w*.018f,Color.White)
                drawCircle(Color(0xFFFFD54F), w*.09f, Offset(cx,cy))
                drawOval(Color(0xFF90CAF9), Offset(cx-w*.20f,cy-h*.05f), Size(w*.40f,h*.10f), style=Stroke(w*.025f))
            }
            "art" -> {
                drawRect(Color(0xFFFFF3E0), Offset(w*.20f,h*.15f), Size(w*.60f,h*.70f))
                drawCircle(Color(0xFF42A5F5), w*.07f, Offset(w*.40f,h*.43f))
                drawCircle(Color(0xFFFFCA28), w*.07f, Offset(w*.59f,h*.58f))
                drawLine(Color(0xFFEF5350), Offset(w*.28f,h*.68f), Offset(w*.70f,h*.35f), w*.05f, StrokeCap.Round)
            }
            "languages", "english", "french" -> {
                drawRoundRect(Color.White.copy(.92f), Offset(w*.18f,h*.17f), Size(w*.64f,h*.66f), CornerRadius(18f,18f))
                drawCircle(Color(0xFF42A5F5), w*.14f, Offset(w*.39f,h*.48f))
                drawCircle(Color(0xFFEF5350), w*.14f, Offset(w*.61f,h*.48f))
                drawLine(Color.White, Offset(w*.31f,h*.48f), Offset(w*.69f,h*.48f), w*.018f)
            }
            "puzzle" -> {
                val colors=listOf(Color(0xFF42A5F5),Color(0xFFFFCA28),Color(0xFFEF5350),Color(0xFF66BB6A))
                for(i in 0..3) drawRoundRect(colors[i],Offset(w*(.24f+(i%2)*.25f),h*(.20f+(i/2)*.30f)),Size(w*.24f,h*.24f),CornerRadius(8f,8f))
            }
            "math" -> {
                drawRoundRect(Color.White.copy(.9f),Offset(w*.17f,h*.13f),Size(w*.66f,h*.74f),CornerRadius(18f,18f))
                drawLine(Color(0xFF3F51B5),Offset(w*.32f,h*.50f),Offset(w*.68f,h*.50f),w*.025f)
                drawLine(Color(0xFF3F51B5),Offset(w*.50f,h*.32f),Offset(w*.50f,h*.68f),w*.025f)
                dot(this,w*.32f,h*.32f,w*.045f,Color(0xFFFF7043)); dot(this,w*.68f,h*.68f,w*.045f,Color(0xFF66BB6A))
            }
            "memory" -> {
                for(i in 0..3) drawRoundRect(if(i%2==0) Color(0xFF7E57C2) else Color(0xFF26A69A),Offset(w*(.22f+(i%2)*.28f),h*(.20f+(i/2)*.32f)),Size(w*.20f,h*.24f),CornerRadius(10f,10f))
            }
            "logic" -> {
                drawCircle(Color(0xFF42A5F5),w*.10f,Offset(w*.30f,cy))
                drawCircle(Color(0xFFFFCA28),w*.10f,Offset(w*.50f,cy))
                drawCircle(Color(0xFFEF5350),w*.10f,Offset(w*.70f,cy))
                drawLine(Color.White,Offset(w*.34f,cy),Offset(w*.46f,cy),w*.025f)
                drawLine(Color.White,Offset(w*.54f,cy),Offset(w*.66f,cy),w*.025f)
            }
            else -> {
                drawCircle(Color.White.copy(.85f),w*.22f,Offset(cx,cy))
                drawCircle(Color(0xFF42A5F5),w*.07f,Offset(cx-w*.10f,cy))
                drawCircle(Color(0xFFFFCA28),w*.07f,Offset(cx+w*.10f,cy))
            }
        }
    }
}

@Composable
fun StoryIllustration(modifier: Modifier = Modifier, index: Int) {
    Canvas(modifier) {
        val w=size.width; val h=size.height
        drawRect(Brush.verticalGradient(listOf(Color(0xFF9DE3FF),Color(0xFFFFE7A6))), Offset.Zero, Size(w,h))
        when(index) {
            0 -> {
                for(i in 0..4) drawCircle(Color(0xFF43A047),w*.10f,Offset(w*(.15f+i*.18f),h*.32f))
                drawRect(Color(0xFF795548),Offset(w*.45f,h*.36f),Size(w*.10f,h*.45f))
                drawCircle(Color(0xFFFFD54F),w*.07f,Offset(w*.50f,h*.28f))
            }
            1 -> {
                val sand=Color(0xFFE8B86A)
                drawOval(sand,Offset(w*.02f,h*.58f),Size(w*.96f,h*.42f))
                drawCircle(Color(0xFFFFCA28),w*.09f,Offset(w*.78f,h*.20f))
                drawPath(Path().apply{moveTo(w*.18f,h*.68f);lineTo(w*.30f,h*.40f);lineTo(w*.42f,h*.68f);close()},Color(0xFF9A6A3A))
                drawPath(Path().apply{moveTo(w*.55f,h*.72f);lineTo(w*.67f,h*.43f);lineTo(w*.79f,h*.72f);close()},Color(0xFFB57B42))
            }
            else -> {
                drawCircle(Color(0xFF26324A),w*.33f,Offset(w*.50f,h*.50f))
                drawCircle(Color(0xFFFFD54F),w*.10f,Offset(w*.50f,h*.50f))
                drawArc(Color(0xFF90CAF9),-20f,220f,false,Offset(w*.20f,h*.30f),Size(w*.60f,h*.40f),style=Stroke(w*.025f))
                for(i in 0..7) dot(this,w*(.12f+(i%4)*.25f),h*(.15f+(i/4)*.70f),w*.014f,Color.White)
            }
        }
    }
}

@Composable
fun DrawModeIllustration(modifier: Modifier = Modifier, kind: String) {
    Canvas(modifier) {
        val w=size.width; val h=size.height
        when(kind.lowercase()) {
            "free" -> {
                drawLine(Color.White,Offset(w*.20f,h*.70f),Offset(w*.72f,h*.28f),w*.09f,StrokeCap.Round)
                drawCircle(Color(0xFFFF7043),w*.09f,Offset(w*.76f,h*.24f))
                drawLine(Color(0xFFFFCA28),Offset(w*.20f,h*.70f),Offset(w*.38f,h*.84f),w*.06f,StrokeCap.Round)
            }
            "color" -> {
                drawCircle(Color(0xFFEF5350),w*.28f,Offset(w*.34f,h*.48f))
                drawCircle(Color(0xFF42A5F5),w*.28f,Offset(w*.66f,h*.48f))
                drawCircle(Color(0xFFFFCA28),w*.13f,Offset(w*.50f,h*.28f))
                drawCircle(Color(0xFF66BB6A),w*.13f,Offset(w*.50f,h*.68f))
            }
            "letters" -> {
                drawRoundRect(Color.White.copy(.9f),Offset(w*.25f,h*.14f),Size(w*.50f,h*.72f),CornerRadius(18f,18f))
                drawLine(Color(0xFF1E88E5),Offset(w*.32f,h*.72f),Offset(w*.50f,h*.28f),w*.05f,StrokeCap.Round)
                drawLine(Color(0xFF1E88E5),Offset(w*.50f,h*.28f),Offset(w*.68f,h*.72f),w*.05f,StrokeCap.Round)
                drawLine(Color(0xFF1E88E5),Offset(w*.39f,h*.55f),Offset(w*.61f,h*.55f),w*.04f)
            }
            "numbers" -> {
                drawCircle(Color.White.copy(.9f),w*.28f,Offset(w*.50f,h*.50f))
                drawLine(Color(0xFF8E24AA),Offset(w*.38f,h*.38f),Offset(w*.62f,h*.62f),w*.07f,StrokeCap.Round)
                drawLine(Color(0xFF8E24AA),Offset(w*.62f,h*.38f),Offset(w*.38f,h*.62f),w*.07f,StrokeCap.Round)
            }
            "shapes" -> {
                drawCircle(Color(0xFF42A5F5),w*.13f,Offset(w*.30f,h*.48f))
                drawRoundRect(Color(0xFFFFCA28),Offset(w*.45f,h*.34f),Size(w*.25f,h*.25f),CornerRadius(8f,8f))
                drawPath(Path().apply{moveTo(w*.60f,h*.68f);lineTo(w*.72f,h*.40f);lineTo(w*.84f,h*.68f);close()},Color(0xFF66BB6A))
            }
            else -> {
                drawCircle(Color.White.copy(.9f),w*.50f,Offset(w*.50f,h*.50f))
                drawLine(MusicPink,Offset(w*.42f,h*.30f),Offset(w*.42f,h*.70f),w*.05f)
                drawLine(MusicPink,Offset(w*.42f,h*.30f),Offset(w*.67f,h*.23f),w*.05f)
                drawLine(MusicPink,Offset(w*.67f,h*.23f),Offset(w*.67f,h*.56f),w*.05f)
                drawCircle(MusicPink,w*.07f,Offset(w*.40f,h*.70f))
                drawCircle(MusicPink,w*.07f,Offset(w*.65f,h*.56f))
            }
        }
    }
}
