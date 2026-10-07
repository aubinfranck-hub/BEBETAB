package com.bebetab.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.ProgressStore
import com.bebetab.audio.BebeAudioEngine
import com.bebetab.ui.theme.*
import kotlinx.coroutines.launch

data class HomeTile(
    val route: String,
    val fr: String,
    val en: String,
    val color: Color,
    val icon: ImageVector
)

@Composable
fun HomeScreen(onNavigate: (String) -> Unit) {
    val context = androidx.compose.ui.platform.LocalContext.current
    val progressStore = remember { ProgressStore(context) }
    val parentSettings = remember { com.bebetab.data.ParentSettingsStore(context) }
    val language by parentSettings.language.collectAsState(initial = "fr")
    val scope = rememberCoroutineScope()
    val stars by progressStore.stars.collectAsState(initial = 2450)
    val level = stars / 50 + 1
    val progress = (stars % 50) / 50f

    val tiles = listOf(
        HomeTile("world", "MONDE", "World", WorldGreen, Icons.Default.Public),
        HomeTile("learn", "APPRENDRE", "Learn", LearnOrange, Icons.Default.MenuBook),
        HomeTile("play", "JOUER", "Play", PlayRed, Icons.Default.SportsEsports),
        HomeTile("stories", "HISTOIRES", "Stories", StoriesPurple, Icons.Default.MenuBook),
        HomeTile("live", "LIVE WORLD", "En direct", LiveBlue, Icons.Default.Videocam),
        HomeTile("music", "MUSIQUE", "Music", MusicPink, Icons.Default.MusicNote),
        HomeTile("draw", "DESSINER", "Create", DrawYellow, Icons.Default.Palette),
        HomeTile("rewards", "MES RÉCOMPENSES", "My Rewards", RewardsGreen, Icons.Default.Star)
    )

    Box(
        Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(SkyBlue, Color(0xFFBDEBFF), Color(0xFFFFE7AF))
                )
            )
            .padding(horizontal = 26.dp, vertical = 18.dp)
    ) {
        androidx.compose.material3.Surface(
            modifier = Modifier.fillMaxSize(),
            color = Color.Transparent
        ) {
            Row(Modifier.fillMaxWidth().padding(8.dp), horizontalArrangement = Arrangement.End) {
                TextButton(onClick = {
                    val next = if (language == "fr") "en" else "fr"
                    scope.launch { parentSettings.setLanguage(next) }
                }) {
                    Text(if (language == "fr") "FR • EN" else "EN • FR", color = OutlineBlue, fontWeight = FontWeight.Black, fontSize = 11.sp)
                }
            }
        }
        FloatingDecor(Modifier.fillMaxSize())
        Column(Modifier.fillMaxSize(), verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Row(Modifier.fillMaxWidth().weight(1f), horizontalArrangement = Arrangement.spacedBy(18.dp)) {

                // LEFT / FANTI
                Column(
                    Modifier.weight(.85f).fillMaxHeight(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text(
                        "BÉBÉ TAB",
                        color = Yellow,
                        fontSize = 48.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )
                    Text(
                        "LE MONDE DANS TES MAINS",
                        color = OutlineBlue,
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Black
                    )
                    Text(
                        "Jouer • Apprendre • Découvrir • Explorer",
                        color = OutlineBlue,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(Modifier.height(6.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("⭐", fontSize = 30.sp)
                        Spacer(Modifier.width(6.dp))
                        Text("$stars", color = OutlineBlue, fontSize = 24.sp, fontWeight = FontWeight.Black)
                        Text("  •  Niveau $level", color = OutlineBlue, fontSize = 20.sp, fontWeight = FontWeight.Black)
                    }
                    LinearProgressIndicator(
                        progress = { progress },
                        modifier = Modifier.fillMaxWidth(.82f).height(7.dp),
                        color = OutlineBlue,
                        trackColor = Color.White.copy(alpha = .6f)
                    )
                    Spacer(Modifier.height(4.dp))
                    Box(Modifier.weight(1f).fillMaxWidth()) {
                        FantiHero(Modifier.fillMaxSize())
                    }
                    SpeechBubble(
                        text = if (language == "en") "Hello! Ready for a new adventure?" else "Bonjour ! Hello !\nPrêt pour une nouvelle aventure ?",
                        modifier = Modifier.fillMaxWidth(.96f)
                    )
                    Spacer(Modifier.height(10.dp))
                    Button(
                        onClick = { BebeAudioEngine.click(); onNavigate("world") },
                        modifier = Modifier.fillMaxWidth(.84f).height(58.dp).hoverable(remember { MutableInteractionSource() }),
                        shape = RoundedCornerShape(28.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFF8F00)),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 5.dp)
                    ) {
                        Icon(Icons.Default.PlayArrow, contentDescription = null)
                        Spacer(Modifier.width(6.dp))
                        Text(if (language == "en") "EXPLORE THE WORLD" else "EXPLORER LE MONDE", fontSize = 18.sp, fontWeight = FontWeight.Black)
                    }
                }

                // CENTER
                Column(Modifier.weight(1.45f).fillMaxHeight(), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                    Surface(
                        Modifier.fillMaxWidth().weight(1.04f).shadow(3.dp, RoundedCornerShape(30.dp)),
                        shape = RoundedCornerShape(30.dp),
                        color = Color.White
                    ) {
                        Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                            WorldGlobe(Modifier.fillMaxSize().padding(38.dp))
                            MonumentBadge("🗼", Alignment.TopCenter)
                            MonumentBadge("🏜️", Alignment.BottomStart)
                            MonumentBadge("🗽", Alignment.CenterStart)
                            MonumentBadge("🕌", Alignment.BottomEnd)
                        }
                    }
                    Surface(
                        Modifier.fillMaxWidth().weight(.74f).shadow(3.dp, RoundedCornerShape(28.dp)),
                        shape = RoundedCornerShape(28.dp),
                        color = Color.White
                    ) {
                        Column(Modifier.fillMaxSize().padding(16.dp)) {
                            Text(if (language == "en") "Today with Fanti" else "Aujourd’hui avec Fanti", color = OutlineBlue, fontSize = 22.sp, fontWeight = FontWeight.Black)
                            Spacer(Modifier.height(10.dp))
                            Row(Modifier.fillMaxSize(), horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                TodayCard("🦁", "1 vidéo", Modifier.weight(1f))
                                TodayCard("🎮", "2 jeux", Modifier.weight(1f))
                                TodayCard("📖", "1 histoire", Modifier.weight(1f))
                                TodayCard("🎵", "1 chanson", Modifier.weight(1f))
                            }
                        }
                    }
                }

                // RIGHT / LIVE
                Surface(
                    Modifier.width(275.dp).fillMaxHeight().shadow(3.dp, RoundedCornerShape(30.dp)),
                    shape = RoundedCornerShape(30.dp),
                    color = Color.White
                ) {
                    Column(
                        Modifier.fillMaxSize().padding(16.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(7.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Box(Modifier.size(20.dp).background(Color.Red, CircleShape))
                            Spacer(Modifier.width(8.dp))
                            Text("EN DIRECT", color = Color.Red, fontSize = 20.sp, fontWeight = FontWeight.Black)
                        }
                        Box(Modifier.weight(1f).fillMaxWidth(), contentAlignment = Alignment.Center) {
                            Text("🦒", fontSize = 74.sp)
                        }
                        Text("LIVE WORLD", color = OutlineBlue, fontSize = 22.sp, fontWeight = FontWeight.Black)
                        Text(
                            "Regarde le monde\nen direct !",
                            color = Color(0xFF29415C),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            textAlign = TextAlign.Center
                        )
                        Button(
                            onClick = { BebeAudioEngine.click(); onNavigate("live") },
                            modifier = Modifier.fillMaxWidth().height(54.dp),
                            shape = RoundedCornerShape(28.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = LiveBlue)
                        ) {
                            Icon(Icons.Default.PlayArrow, contentDescription = null)
                            Spacer(Modifier.width(4.dp))
                            Text(if (language == "en") "Watch" else "Regarder", fontSize = 17.sp, fontWeight = FontWeight.Black)
                        }
                        Box(Modifier.fillMaxWidth().height(5.dp).background(LearnOrange, RoundedCornerShape(50)))
                    }
                }
            }

            Row(
                Modifier.fillMaxWidth().height(126.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                tiles.forEach { tile ->
                    val tileInteraction = remember(tile.route) { MutableInteractionSource() }
                    val tileHovered by tileInteraction.collectIsHoveredAsState()
                    val tilePressed by tileInteraction.collectIsPressedAsState()
                    val tileScale by animateFloatAsState(
                        if (tilePressed) .94f else if (tileHovered) 1.035f else 1f,
                        label = "tileScale"
                    )
                    Button(
                        onClick = { BebeAudioEngine.click(); onNavigate(tile.route) },
                        interactionSource = tileInteraction,
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                            .scale(tileScale)
                            .hoverable(tileInteraction),
                        shape = RoundedCornerShape(24.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = tile.color),
                        contentPadding = PaddingValues(8.dp),
                        elevation = ButtonDefaults.buttonElevation(defaultElevation = 4.dp, pressedElevation = 1.dp)
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            verticalArrangement = Arrangement.Center
                        ) {
                            Icon(tile.icon, null, Modifier.size(34.dp), tint = Color.White)
                            Spacer(Modifier.height(4.dp))
                            Text(tile.fr, fontSize = 13.sp, fontWeight = FontWeight.Black, color = Color.White, textAlign = TextAlign.Center)
                            Text(tile.en, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White.copy(alpha=.95f), textAlign = TextAlign.Center)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SpeechBubble(text: String, modifier: Modifier) {
    Surface(
        modifier.shadow(4.dp, RoundedCornerShape(22.dp)),
        shape = RoundedCornerShape(22.dp),
        color = Color.White
    ) {
        Text(text, modifier.padding(horizontal = 18.dp, vertical = 12.dp), color = Color(0xFF17324D), fontSize = 16.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
    }
}

@Composable
private fun MonumentBadge(icon: String, alignment: Alignment) {
    Box(Modifier.fillMaxSize(), contentAlignment = alignment) {
        Text(icon, fontSize = 48.sp)
    }
}

@Composable
private fun TodayCard(icon: String, label: String, modifier: Modifier) {
    Surface(modifier, shape = RoundedCornerShape(18.dp), color = Color(0xFFF1EEF6)) {
        Column(Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.Center) {
            Text(icon, fontSize = 31.sp)
            Spacer(Modifier.height(3.dp))
            Text(label, fontSize = 13.sp, fontWeight = FontWeight.Black, color = Color(0xFF30435A))
        }
    }
}

@Composable
private fun WorldGlobe(modifier: Modifier) {
    Canvas(modifier) {
        val side = minOf(size.width, size.height)
        val c = Offset(size.width/2f, size.height/2f)
        val r = side*.31f
        drawCircle(Brush.radialGradient(listOf(Color(0xFF32B7FF), Color(0xFF176EEB))), r, c)
        val green = Color(0xFF75DF8B)
        val p = Path().apply {
            moveTo(c.x-r*.05f,c.y-r*.52f); cubicTo(c.x+r*.23f,c.y-r*.36f,c.x+r*.20f,c.y-r*.05f,c.x+r*.10f,c.y+r*.18f)
            cubicTo(c.x+r*.05f,c.y+r*.46f,c.x-r*.11f,c.y+r*.60f,c.x-r*.22f,c.y+r*.34f)
            cubicTo(c.x-r*.32f,c.y+r*.12f,c.x-r*.18f,c.y-r*.06f,c.x-r*.18f,c.y-r*.27f)
            cubicTo(c.x-r*.18f,c.y-r*.43f,c.x-r*.10f,c.y-r*.52f,c.x-r*.05f,c.y-r*.52f)
            close()
        }
        drawPath(p, green)
        drawOval(green, Offset(c.x-r*.62f,c.y-r*.32f), Size(r*.42f,r*.24f))
        drawOval(green, Offset(c.x+r*.22f,c.y-r*.32f), Size(r*.30f,r*.17f))
        drawOval(green, Offset(c.x+r*.30f,c.y+r*.20f), Size(r*.11f,r*.28f))
    }
}

@Composable
private fun FantiHero(modifier: Modifier) {
    Canvas(modifier) {
        val gray=Color(0xFFB9C0C8); val dark=Color(0xFF97A3AE); val shirt=Color(0xFFFFD54F); val blue=Color(0xFF277ED5)
        val cx=size.width*.5f; val cy=size.height*.47f; val bodyW=size.width*.46f; val bodyH=size.height*.25f
        drawOval(gray, Offset(cx-bodyW*.44f,cy-bodyH*.05f), Size(bodyW,bodyH))
        drawOval(gray, Offset(cx-bodyW*.36f,cy-bodyH*.42f), Size(bodyW*.48f,bodyH*.95f))
        drawOval(dark, Offset(cx-bodyW*.78f,cy-bodyH*.42f), Size(bodyW*.34f,bodyH*.76f))
        drawCircle(Color.Black, bodyW*.045f, Offset(cx-bodyW*.23f,cy-bodyH*.16f))
        drawLine(dark,Offset(cx-bodyW*.23f,cy+bodyH*.10f),Offset(cx-bodyW*.30f,cy+bodyH*.60f),bodyW*.10f,StrokeCap.Round)
        drawLine(dark,Offset(cx+bodyW*.06f,cy+bodyH*.10f),Offset(cx+bodyW*.02f,cy+bodyH*.60f),bodyW*.10f,StrokeCap.Round)
        drawLine(gray,Offset(cx-bodyW*.43f,cy+bodyH*.00f),Offset(cx-bodyW*.62f,cy+bodyH*.23f),bodyW*.09f,StrokeCap.Round)
        drawOval(shirt,Offset(cx-bodyW*.16f,cy+bodyH*.08f),Size(bodyW*.33f,bodyH*.30f))
        drawRoundRect(blue,Offset(cx+bodyW*.26f,cy+bodyH*.02f),Size(bodyW*.18f,bodyH*.45f),CornerRadius(16f,16f))
        drawArc(shirt,200f,140f,false,Offset(cx-bodyW*.55f,cy-bodyH*.48f),Size(bodyW*.32f,bodyH*.24f),style=androidx.compose.ui.graphics.drawscope.Stroke(width=bodyW*.03f))
    }
}

@Composable
private fun FloatingDecor(modifier: Modifier) {
    Canvas(modifier) {
        val cloud=Color.White.copy(alpha=.6f)
        drawCircle(cloud,42f,Offset(size.width*.10f,size.height*.11f))
        drawCircle(cloud,58f,Offset(size.width*.14f,size.height*.09f))
        drawCircle(cloud,38f,Offset(size.width*.18f,size.height*.11f))
        drawCircle(cloud,40f,Offset(size.width*.87f,size.height*.13f))
        drawCircle(cloud,58f,Offset(size.width*.91f,size.height*.11f))
    }
}
