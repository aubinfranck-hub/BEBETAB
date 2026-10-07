package com.bebetab.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import com.bebetab.ui.theme.OutlineBlue
import com.bebetab.ui.theme.Yellow

@Composable
fun FantiMascot(modifier: Modifier = Modifier) {
    Canvas(modifier) {
        val gray = Color(0xFFB9C0C8)
        val dark = Color(0xFF97A3AE)
        val shirt = Yellow
        val blue = Color(0xFF277ED5)
        val cx = size.width * .5f
        val cy = size.height * .48f
        val bodyW = size.width * .46f
        val bodyH = size.height * .27f

        drawOval(gray, Offset(cx-bodyW*.44f, cy-bodyH*.05f), Size(bodyW, bodyH))
        drawOval(gray, Offset(cx-bodyW*.36f, cy-bodyH*.42f), Size(bodyW*.48f, bodyH*.95f))
        drawOval(dark, Offset(cx-bodyW*.78f, cy-bodyH*.42f), Size(bodyW*.34f, bodyH*.76f))
        drawCircle(Color.Black, bodyW*.045f, Offset(cx-bodyW*.23f, cy-bodyH*.16f))
        drawLine(dark, Offset(cx-bodyW*.23f, cy+bodyH*.10f), Offset(cx-bodyW*.30f, cy+bodyH*.60f), bodyW*.10f, StrokeCap.Round)
        drawLine(dark, Offset(cx+bodyW*.06f, cy+bodyH*.10f), Offset(cx+bodyW*.02f, cy+bodyH*.60f), bodyW*.10f, StrokeCap.Round)
        drawLine(gray, Offset(cx-bodyW*.43f, cy+bodyH*.00f), Offset(cx-bodyW*.62f, cy+bodyH*.23f), bodyW*.09f, StrokeCap.Round)

        drawOval(shirt, Offset(cx-bodyW*.16f, cy+bodyH*.08f), Size(bodyW*.33f, bodyH*.30f))
        drawCircle(Color(0xFF2B8BE6), bodyW*.065f, Offset(cx+bodyW*.005f, cy+bodyH*.22f))
        drawArc(Color.White, 180f, 180f, false, Offset(cx-bodyW*.06f, cy+bodyH*.16f), Size(bodyW*.12f, bodyH*.12f), style=Stroke(width=bodyW*.012f))

        drawRoundRect(blue, Offset(cx+bodyW*.26f, cy+bodyH*.02f), Size(bodyW*.18f, bodyH*.45f), CornerRadius(16f,16f))
        drawOval(shirt, Offset(cx-bodyW*.28f, cy-bodyH*.62f), Size(bodyW*.56f, bodyH*.20f))
        drawCircle(OutlineBlue, bodyW*.035f, Offset(cx-bodyW*.01f, cy-bodyH*.52f))
    }
}