package com.bebetab.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.R
import com.bebetab.audio.BebeAudioEngine
import com.bebetab.data.ParentSettingsStore
import com.bebetab.data.ProgressStore
import kotlinx.coroutines.launch

/*
 * Écrans « plein art » : les illustrations 1672x941 de la maquette originale (dossier Drive BébéTab)
 * sont affichées telles quelles, avec des zones tactiles par-dessus. Seul le bandeau profil
 * (nom / étoiles / niveau) est redessiné pour afficher les vraies données de l'enfant.
 */
private data class Spot(val x: Float, val y: Float, val w: Float, val h: Float, val go: String)

private val homeSpots = buildList {
    listOf("world", "learn", "play", "stories", "live", "music", "draw", "rewards").forEachIndexed { i, r ->
        add(Spot(.01f + i * .1235f, .744f, .122f, .212f, r))
    }
    add(Spot(.36f, .573f, .273f, .153f, "world_explore"))
    add(Spot(.667f, .116f, .32f, .284f, "live"))
    listOf("videos", "play", "stories", "music").forEachIndexed { i, r ->
        add(Spot(.675f + i * .077f, .486f, .072f, .13f, r))
    }
    add(Spot(0f, .25f, .24f, .75f, "assistant"))
    add(Spot(.2375f, .318f, .14f, .165f, "assistant"))
}

private val worldSpots = buildList {
    add(Spot(.821f, .175f, .154f, .106f, "france"))
    listOf(.293f, .412f, .53f, .649f).forEach { add(Spot(.821f, it, .154f, .106f, "world_explore")) }
    listOf( // continents
        Spot(.155f, .33f, .2f, .12f, "world_explore"), Spot(.40f, .25f, .13f, .08f, "world_explore"),
        Spot(.58f, .30f, .13f, .08f, "world_explore"), Spot(.41f, .47f, .16f, .1f, "world_explore"),
        Spot(.68f, .55f, .12f, .08f, "world_explore"), Spot(.35f, .68f, .12f, .08f, "world_explore")
    ).forEach { add(it) }
    for (i in 0..10) add(Spot(.02f + i * .0828f, .867f, .078f, .111f, "world_explore"))
    add(Spot(0f, .5f, .17f, .5f, "assistant"))
}

private val franceSpots = buildList {
    listOf(.118f to "videos", .265f to "live", .4125f to "play", .548f to "quiz", .689f to "world_explore", .83f to "music")
        .forEach { (x, r) -> add(Spot(x, .793f, .13f, .17f, r)) }
    for (c in 0..2) for (r in 0..1) add(Spot(.617f + c * .127f, .205f + r * .30f, .11f, .27f, "france_explore"))
    add(Spot(0f, .45f, .2f, .55f, "assistant"))
}

@Composable
fun FullArtScreen(
    route: String,
    onBack: (() -> Unit)?,
    onSettings: () -> Unit,
    onNavigate: (String) -> Unit
) {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val settings = remember { ParentSettingsStore(context) }
    val store = remember { ProgressStore(context) }
    val name by settings.childName.collectAsState(initial = "Kofi")
    val lang by settings.language.collectAsState(initial = "fr")
    val stars by store.stars.collectAsState(initial = 2450)
    val level = stars / 50 + 1
    val progress = (stars % 50) / 50f

    val (res, spots) = when (route) {
        "world" -> R.drawable.art_full_world to worldSpots
        "france" -> R.drawable.art_full_france to franceSpots
        else -> R.drawable.art_full_home to homeSpots
    }
    // Position du bandeau profil, du sélecteur FR/EN et de l'engrenage selon l'illustration.
    val pill = when (route) { "world" -> floatArrayOf(.473f, .018f, .369f, .06f); "france" -> floatArrayOf(.392f, .015f, .429f, .07f); else -> floatArrayOf(.382f, .02f, .428f, .072f) }
    val lng = when (route) { "world" -> floatArrayOf(.848f, .021f, .082f, .07f); "france" -> floatArrayOf(.825f, .018f, .105f, .075f); else -> floatArrayOf(.818f, .02f, .112f, .075f) }
    val gear = when (route) { "world" -> floatArrayOf(.943f, .02f, .05f, .08f); "france" -> floatArrayOf(.939f, .018f, .05f, .08f); else -> floatArrayOf(.933f, .02f, .045f, .08f) }

    Box(Modifier.fillMaxSize().background(Color.Black), contentAlignment = Alignment.Center) {
        BoxWithConstraints(Modifier.aspectRatio(1672f / 941f)) {
            val W = maxWidth
            val H = maxHeight
            Image(painterResource(res), null, Modifier.fillMaxSize(), contentScale = ContentScale.FillBounds)

            @Composable
            fun Zone(x: Float, y: Float, w: Float, h: Float, action: () -> Unit) {
                Box(
                    Modifier.offset(W * x, H * y).size(W * w, H * h)
                        .clickable(remember { MutableInteractionSource() }, null) { BebeAudioEngine.click(); action() }
                )
            }
            spots.forEach { s -> Zone(s.x, s.y, s.w, s.h) { onNavigate(s.go) } }
            if (route != "home" && onBack != null) Zone(.012f, .02f, .055f, .1f) { onBack() }
            Zone(gear[0], gear[1], gear[2], gear[3]) { onSettings() }
            Zone(lng[0], lng[1], lng[2] / 2, lng[3]) { scope.launch { settings.setLanguage("fr") } }
            Zone(lng[0] + lng[2] / 2, lng[1], lng[2] / 2, lng[3]) { scope.launch { settings.setLanguage("en") } }

            // Bandeau profil avec les vraies données.
            Row(
                Modifier.offset(W * pill[0], H * pill[1]).size(W * pill[2], H * pill[3])
                    .clip(RoundedCornerShape(50)).background(Color.White).padding(horizontal = W * .012f),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                val fs = (W.value * .0135f).sp
                Text(name, fontSize = fs, fontWeight = FontWeight.Bold, color = Color(0xFF16325C), maxLines = 1)
                Text("⭐ $stars", fontSize = fs, fontWeight = FontWeight.Bold, color = Color(0xFF16325C))
                Column(horizontalAlignment = Alignment.Start) {
                    Text(if (lang == "en") "Level $level" else "Niveau $level", fontSize = fs * .8f, fontWeight = FontWeight.Bold, color = Color(0xFF16325C))
                    Box(Modifier.width(W * .1f).height(H * .014f).clip(RoundedCornerShape(50)).background(Color(0xFFE0E6EE))) {
                        Box(Modifier.fillMaxHeight().fillMaxWidth(progress.coerceIn(.05f, 1f))
                            .background(Brush.horizontalGradient(listOf(Color(0xFF2EB82E), Color(0xFFFFC107), Color(0xFFFF7043)))))
                    }
                }
            }
        }
    }
}
