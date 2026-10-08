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
        // Large ears and friendly face.
        drawOval(dark, Offset(cx-bodyW*.78f, cy-bodyH*.42f), Size(bodyW*.34f, bodyH*.76f))
        drawOval(dark, Offset(cx+bodyW*.44f, cy-bodyH*.42f), Size(bodyW*.34f, bodyH*.76f))
        // Eyes.
        drawCircle(Color.Black, bodyW*.045f, Offset(cx-bodyW*.23f, cy-bodyH*.16f))
        drawCircle(Color.Black, bodyW*.045f, Offset(cx+bodyW*.23f, cy-bodyH*.16f))
        // Small white eye highlights.
        drawCircle(Color.White, bodyW*.014f, Offset(cx-bodyW*.215f, cy-bodyH*.18f))
        drawCircle(Color.White, bodyW*.014f, Offset(cx+bodyW*.245f, cy-bodyH*.18f))
        // Trunk.
        drawLine(dark, Offset(cx, cy-bodyH*.02f), Offset(cx-bodyW*.03f, cy+bodyH*.38f), bodyW*.105f, StrokeCap.Round)
        drawCircle(dark, bodyW*.055f, Offset(cx-bodyW*.03f, cy+bodyH*.39f))
        drawLine(dark, Offset(cx-bodyW*.23f, cy+bodyH*.10f), Offset(cx-bodyW*.30f, cy+bodyH*.60f), bodyW*.10f, StrokeCap.Round)
        drawLine(dark, Offset(cx+bodyW*.06f, cy+bodyH*.10f), Offset(cx+bodyW*.02f, cy+bodyH*.60f), bodyW*.10f, StrokeCap.Round)
        drawLine(gray, Offset(cx-bodyW*.43f, cy+bodyH*.00f), Offset(cx-bodyW*.62f, cy+bodyH*.23f), bodyW*.09f, StrokeCap.Round)

        drawOval(shirt, Offset(cx-bodyW*.16f, cy+bodyH*.08f), Size(bodyW*.33f, bodyH*.30f))
        drawCircle(Color(0xFF2B8BE6), bodyW*.065f, Offset(cx+bodyW*.005f, cy+bodyH*.22f))
        drawArc(Color.White, 180f, 180f, false, Offset(cx-bodyW*.06f, cy+bodyH*.16f), Size(bodyW*.12f, bodyH*.12f), style=Stroke(width=bodyW*.012f))

        // Blue backpack.
        drawRoundRect(blue, Offset(cx+bodyW*.25f, cy+bodyH*.02f), Size(bodyW*.20f, bodyH*.48f), CornerRadius(18f,18f))
        drawLine(Color(0xFF1559A5), Offset(cx+bodyW*.28f, cy+bodyH*.05f), Offset(cx+bodyW*.28f, cy+bodyH*.43f), bodyW*.025f, StrokeCap.Round)
        // Yellow cap + blue B badge.
        drawOval(shirt, Offset(cx-bodyW*.31f, cy-bodyH*.66f), Size(bodyW*.62f, bodyH*.24f))
        drawOval(OutlineBlue.copy(alpha=.9f), Offset(cx-bodyW*.22f, cy-bodyH*.52f), Size(bodyW*.44f, bodyH*.09f))
        drawCircle(OutlineBlue, bodyW*.055f, Offset(cx, cy-bodyH*.55f))
        drawLine(shirt, Offset(cx-bodyW*.025f, cy-bodyH*.58f), Offset(cx-bodyW*.025f, cy-bodyH*.50f), bodyW*.025f, StrokeCap.Round)
        drawLine(shirt, Offset(cx+bodyW*.01f, cy-bodyH*.58f), Offset(cx+bodyW*.05f, cy-bodyH*.54f), bodyW*.025f, StrokeCap.Round)
        drawOval(shirt, Offset(cx-bodyW*.28f, cy-bodyH*.62f), Size(bodyW*.56f, bodyH*.20f))
        drawCircle(OutlineBlue, bodyW*.035f, Offset(cx-bodyW*.01f, cy-bodyH*.52f))
    }
}