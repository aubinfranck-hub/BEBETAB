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
data class Spot(val x: Float, val y: Float, val w: Float, val h: Float, val go: String)
private class R4(val x: Float, val y: Float, val w: Float, val h: Float)
private class ArtCfg(val res: Int, val spots: List<Spot>, val pill: R4, val lang: R4, val gear: R4, val back: R4?)

private fun grid(ids: List<String>, cols: Int, x0: Float, y0: Float, w: Float, h: Float, dx: Float, dy: Float) =
    ids.mapIndexed { i, id -> Spot(x0 + (i % cols) * dx, y0 + (i / cols) * dy, w, h, id) }

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
    listOf(
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

private val learnSpots = grid(listOf("letters", "numbers", "science", "world", "animals", "space", "art", "languages"),
    4, .314f, .32f, .146f, .27f, .1555f, .2735f)
private val playSpots = grid(listOf("puzzle", "math", "geography", "animals", "memory", "logic", "french", "english"),
    4, .066f, .206f, .205f, .345f, .2195f, .38f)
private val storySpots = listOf(Spot(.31f, .338f, .21f, .43f, "story0"), Spot(.526f, .338f, .218f, .43f, "story1"), Spot(.756f, .338f, .218f, .43f, "story2"))
private val liveSpots = grid(List(6) { "live_explore" }, 3, .166f, .242f, .268f, .285f, .2735f, .292f)
private val drawSpots = grid(listOf("free", "color", "letters", "numbers", "shapes", "music"),
    3, .40f, .288f, .184f, .292f, .1945f, .302f)

private fun cfg(route: String): ArtCfg = when (route) {
    "world" -> ArtCfg(R.drawable.art_full_world, worldSpots, R4(.473f, .018f, .369f, .06f), R4(.848f, .021f, .082f, .07f), R4(.943f, .02f, .05f, .08f), R4(.012f, .02f, .055f, .1f))
    "france" -> ArtCfg(R.drawable.art_full_france, franceSpots, R4(.392f, .015f, .429f, .07f), R4(.825f, .018f, .105f, .075f), R4(.939f, .018f, .05f, .08f), R4(.012f, .02f, .055f, .1f))
    "learn" -> ArtCfg(R.drawable.art_full_learn, learnSpots, R4(.258f, .021f, .497f, .083f), R4(.771f, .02f, .121f, .09f), R4(.903f, .016f, .054f, .096f), R4(.045f, .016f, .055f, .1f))
    "play" -> ArtCfg(R.drawable.art_full_play, playSpots, R4(.398f, .021f, .433f, .077f), R4(.837f, .02f, .096f, .085f), R4(.939f, .018f, .048f, .09f), R4(.019f, .016f, .05f, .09f))
    "stories" -> ArtCfg(R.drawable.art_full_stories, storySpots, R4(.287f, .026f, .508f, .082f), R4(.801f, .024f, .119f, .092f), R4(.929f, .02f, .056f, .1f), R4(.019f, .024f, .055f, .095f))
    "live" -> ArtCfg(R.drawable.art_full_live, liveSpots + grid(List(6) { "live_explore" }, 6, .2f, .843f, .125f, .125f, .13f, 0f), R4(.2f, .016f, .528f, .072f), R4(.737f, .014f, .137f, .09f), R4(.896f, .012f, .052f, .095f), R4(.12f, .01f, .056f, .1f))
    "draw" -> ArtCfg(R.drawable.art_full_draw, drawSpots, R4(.188f, .018f, .567f, .08f), R4(.763f, .018f, .134f, .092f), R4(.909f, .014f, .055f, .1f), R4(.108f, .012f, .052f, .1f))
    else -> ArtCfg(R.drawable.art_full_home, homeSpots, R4(.382f, .02f, .428f, .072f), R4(.818f, .02f, .112f, .075f), R4(.933f, .02f, .045f, .08f), null)
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

    val c = cfg(route)
    val res = c.res
    val spots = c.spots
    val pill = floatArrayOf(c.pill.x, c.pill.y, c.pill.w, c.pill.h)
    val lng = floatArrayOf(c.lang.x, c.lang.y, c.lang.w, c.lang.h)
    val gear = floatArrayOf(c.gear.x, c.gear.y, c.gear.w, c.gear.h)

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
            if (c.back != null && onBack != null) Zone(c.back.x, c.back.y, c.back.w, c.back.h) { onBack() }
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
