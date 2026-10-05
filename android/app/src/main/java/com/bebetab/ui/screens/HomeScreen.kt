package com.bebetab.ui.screens

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.LibraryBooks
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.MusicNote
import androidx.compose.material.icons.filled.Palette
import androidx.compose.material.icons.filled.Public
import androidx.compose.material.icons.filled.SportsEsports
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.ProgressStore
import com.bebetab.ui.theme.*

data class HomeTile(
    val route: String,
    val fr: String,
    val en: String,
    val color: Color,
    val icon: ImageVector
)

@Composable
fun HomeScreen(onNavigate: (String) -> Unit) {
    val context = LocalContext.current
    val progressStore = remember { ProgressStore(context) }
    val stars by progressStore.stars.collectAsState(initial = 0)
    val level = stars / 50 + 1
    val remainder = stars % 50

    val tiles = listOf(
        HomeTile("world", "Monde", "World", WorldGreen, Icons.Default.Public),
        HomeTile("learn", "Apprendre", "Learn", LearnOrange, Icons.Default.MenuBook),
        HomeTile("play", "Jouer", "Play", PlayRed, Icons.Default.SportsEsports),
        HomeTile("stories", "Histoires", "Stories", StoriesPurple, Icons.Default.LibraryBooks),
        HomeTile("live", "Live World", "Live", LiveBlue, Icons.Default.CameraAlt),
        HomeTile("music", "Musique", "Music", MusicPink, Icons.Default.MusicNote),
        HomeTile("draw", "Dessiner", "Draw", DrawYellow, Icons.Default.Palette),
        HomeTile("rewards", "Mes récompenses", "Rewards", RewardsGreen, Icons.Default.Star)
    )

    Column(
        Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(
                        SkyBlue,
                        Color(0xFFC9EEFF),
                        Color(0xFFF8E5B7)
                    )
                )
            )
            .padding(horizontal = 22.dp, vertical = 16.dp)
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(bottom = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(18.dp)
        ) {
            HomeLeftColumn(
                stars = stars,
                level = level,
                remainder = remainder
            )

            Column(
                Modifier
                    .weight(1f)
                    .fillMaxHeight(),
                verticalArrangement = Arrangement.spacedBy(18.dp)
            ) {
                Row(
                    Modifier
                        .fillMaxWidth()
                        .weight(1.2f),
                    horizontalArrangement = Arrangement.spacedBy(18.dp)
                ) {
                    WhitePanel(
                        modifier = Modifier
                            .weight(1f)
                            .fillMaxHeight()
                    ) {
                        WorldGlobe(
                            Modifier
                                .fillMaxWidth()
                                .fillMaxHeight()
                                .padding(34.dp)
                        )
                    }

                    LiveWorldCard(
                        Modifier
                            .width(250.dp)
                            .fillMaxHeight(),
                        onNavigate = onNavigate
                    )
                }

                TodayWithFanti(
                    Modifier
                        .fillMaxWidth()
                        .weight(.78f)
                )
            }
        }

        Row(
            Modifier.fillMaxWidth().height(104.dp),
            horizontalArrangement = Arrangement.spacedBy(9.dp)
        ) {
            tiles.forEach { tile ->
                HomeTileButton(
                    tile = tile,
                    modifier = Modifier.weight(1f),
                    onClick = { onNavigate(tile.route) }
                )
            }
        }
    }
}

@Composable
private fun HomeLeftColumn(
    stars: Int,
    level: Int,
    remainder: Int
) {
    Column(
        Modifier
            .width(330.dp)
            .fillMaxHeight(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "BÉBÉ TAB",
            color = Yellow,
            fontSize = 46.sp,
            fontWeight = FontWeight.ExtraBold,
            letterSpacing = 1.sp
        )
        Text(
            text = "Jouer · Apprendre · Découvrir · Explorer",
            color = OutlineBlue,
            fontSize = 15.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center
        )

        Spacer(Modifier.height(8.dp))

        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.Center
        ) {
            Icon(Icons.Default.Star, contentDescription = null, tint = Yellow, modifier = Modifier.size(32.dp))
            Spacer(Modifier.width(8.dp))
            Text(
                text = "$stars  •  Niveau $level",
                color = OutlineBlue,
                fontSize = 22.sp,
                fontWeight = FontWeight.ExtraBold
            )
        }

        LinearProgressIndicator(
            progress = { remainder / 50f },
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 34.dp, vertical = 7.dp)
                .height(6.dp),
            color = OutlineBlue,
            trackColor = Color.White.copy(alpha = .55f)
        )

        Spacer(Modifier.height(8.dp))

        FantiElephant(
            Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(horizontal = 12.dp, vertical = 6.dp)
        )

        Surface(
            modifier = Modifier
                .fillMaxWidth()
                .height(126.dp)
                .shadow(7.dp, RoundedCornerShape(22.dp)),
            shape = RoundedCornerShape(22.dp),
            color = Color.White
        ) {
            Column(
                Modifier
                    .fillMaxSize()
                    .padding(horizontal = 24.dp, vertical = 20.dp),
                horizontalAlignment = Alignment.Start
            ) {
                Text(
                    "Bonjour ! Hello !",
                    color = Color(0xFF17324D),
                    fontSize = 23.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Spacer(Modifier.height(7.dp))
                Text(
                    "Prêt pour une nouvelle aventure ?",
                    color = Color(0xFF17324D),
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}

@Composable
private fun WhitePanel(
    modifier: Modifier,
    content: @Composable () -> Unit
) {
    Surface(
        modifier = modifier.shadow(2.dp, RoundedCornerShape(30.dp)),
        shape = RoundedCornerShape(30.dp),
        color = Color.White
    ) {
        content()
    }
}

@Composable
private fun WorldGlobe(modifier: Modifier) {
    Canvas(modifier) {
        val side = minOf(size.width, size.height)
        val center = Offset(size.width / 2f, size.height / 2f)
        val radius = side * .38f

        drawCircle(
            brush = Brush.radialGradient(
                colors = listOf(Color(0xFF2EB8FF), Color(0xFF0E67E8)),
                center = Offset(center.x - radius * .25f, center.y - radius * .25f),
                radius = radius * 1.35f
            ),
            radius = radius,
            center = center
        )

        val africa = Path().apply {
            moveTo(center.x + radius * .02f, center.y - radius * .08f)
            cubicTo(
                center.x + radius * .20f, center.y - radius * .02f,
                center.x + radius * .18f, center.y + radius * .16f,
                center.x + radius * .08f, center.y + radius * .28f
            )
            cubicTo(
                center.x + radius * .03f, center.y + radius * .43f,
                center.x - radius * .13f, center.y + radius * .54f,
                center.x - radius * .20f, center.y + radius * .39f
            )
            cubicTo(
                center.x - radius * .23f, center.y + radius * .24f,
                center.x - radius * .13f, center.y + radius * .17f,
                center.x - radius * .14f, center.y + radius * .02f
            )
            cubicTo(
                center.x - radius * .15f, center.y - radius * .10f,
                center.x - radius * .10f, center.y - radius * .17f,
                center.x + radius * .02f, center.y - radius * .08f
            )
            close()
        }
        drawPath(africa, Color(0xFF7EE081))

        drawOval(
            color = Color(0xFF7EE081),
            topLeft = Offset(center.x - radius * .66f, center.y - radius * .42f),
            size = Size(radius * .55f, radius * .34f)
        )
        drawOval(
            color = Color(0xFF7EE081),
            topLeft = Offset(center.x - radius * .25f, center.y - radius * .58f),
            size = Size(radius * .56f, radius * .24f)
        )
        drawOval(
            color = Color(0xFF7EE081),
            topLeft = Offset(center.x - radius * .52f, center.y - radius * .04f),
            size = Size(radius * .30f, radius * .19f)
        )
        drawOval(
            color = Color(0xFF7EE081),
            topLeft = Offset(center.x + radius * .18f, center.y + radius * .25f),
            size = Size(radius * .11f, radius * .25f)
        )
    }
}

@Composable
private fun LiveWorldCard(
    modifier: Modifier,
    onNavigate: (String) -> Unit
) {
    Surface(
        modifier = modifier.shadow(2.dp, RoundedCornerShape(30.dp)),
        shape = RoundedCornerShape(30.dp),
        color = Color.White
    ) {
        Column(
            Modifier
                .fillMaxSize()
                .padding(horizontal = 22.dp, vertical = 18.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Box(
                    Modifier
                        .size(22.dp)
                        .background(Color(0xFFE53935), RoundedCornerShape(50))
                )
                Spacer(Modifier.width(10.dp))
                Text(
                    "EN DIRECT",
                    color = Color(0xFFE01818),
                    fontSize = 23.sp,
                    fontWeight = FontWeight.ExtraBold
                )
            }

            GiraffeIllustration(
                Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(horizontal = 18.dp, vertical = 4.dp)
            )

            Text(
                "LIVE WORLD",
                color = OutlineBlue,
                fontSize = 22.sp,
                fontWeight = FontWeight.ExtraBold
            )

            Button(
                onClick = { onNavigate("live") },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(58.dp),
                shape = RoundedCornerShape(30.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2A90E5)),
                contentPadding = PaddingValues(0.dp)
            ) {
                Text("▶  Regarder", fontSize = 17.sp, fontWeight = FontWeight.Bold)
            }

            Spacer(Modifier.height(2.dp))

            Box(
                Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .background(LearnOrange, RoundedCornerShape(50))
            )
        }
    }
}

@Composable
private fun TodayWithFanti(modifier: Modifier) {
    Surface(
        modifier = modifier.shadow(2.dp, RoundedCornerShape(28.dp)),
        shape = RoundedCornerShape(28.dp),
        color = Color.White
    ) {
        Column(
            Modifier
                .fillMaxSize()
                .padding(horizontal = 20.dp, vertical = 16.dp)
        ) {
            Text(
                "Aujourd'hui avec Fanti",
                color = OutlineBlue,
                fontSize = 23.sp,
                fontWeight = FontWeight.ExtraBold
            )
            Spacer(Modifier.height(12.dp))
            Row(
                Modifier.fillMaxSize(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                TodayCard("1 vidéo", "▶", modifier = Modifier.weight(1f))
                TodayCard("2 jeux", "🎮", modifier = Modifier.weight(1f))
                TodayCard("1 histoire", "📖", modifier = Modifier.weight(1f))
                TodayCard("1 chanson", "♫", modifier = Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun TodayCard(
    label: String,
    symbol: String,
    modifier: Modifier
) {
    Surface(
        modifier = modifier,
        shape = RoundedCornerShape(18.dp),
        color = Color(0xFFF1EEF6)
    ) {
        Column(
            Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(symbol, fontSize = 30.sp)
            Spacer(Modifier.height(4.dp))
            Text(label, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color(0xFF30435A))
        }
    }
}

@Composable
private fun HomeTileButton(
    tile: HomeTile,
    modifier: Modifier,
    onClick: () -> Unit
) {
    Button(
        onClick = onClick,
        modifier = modifier.fillMaxHeight(),
        shape = RoundedCornerShape(22.dp),
        colors = ButtonDefaults.buttonColors(containerColor = tile.color),
        contentPadding = PaddingValues(horizontal = 7.dp, vertical = 8.dp),
        elevation = ButtonDefaults.buttonElevation(defaultElevation = 3.dp, pressedElevation = 0.dp)
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                tile.icon,
                contentDescription = null,
                modifier = Modifier.size(34.dp),
                tint = Color.White
            )
            Spacer(Modifier.height(5.dp))
            Text(tile.fr, fontWeight = FontWeight.ExtraBold, fontSize = 14.sp, color = Color.White)
            Text(tile.en, fontWeight = FontWeight.Bold, fontSize = 10.sp, color = Color.White.copy(alpha = .95f))
        }
    }
}

@Composable
private fun FantiElephant(modifier: Modifier) {
    Canvas(modifier) {
        val gray = Color(0xFFB7B7B7)
        val darkGray = Color(0xFFA7A7A7)
        val innerEar = Color(0xFFD2D2D2)

        val cx = size.width * .49f
        val cy = size.height * .47f
        val bodyW = size.width * .53f
        val bodyH = size.height * .35f

        drawOval(
            color = darkGray,
            topLeft = Offset(cx - bodyW * .46f, cy - bodyH * .05f),
            size = Size(bodyW, bodyH)
        )

        drawOval(
            color = gray,
            topLeft = Offset(cx - bodyW * .36f, cy - bodyH * .40f),
            size = Size(bodyW * .53f, bodyH * .82f)
        )

        drawOval(
            color = gray,
            topLeft = Offset(cx - bodyW * .68f, cy - bodyH * .43f),
            size = Size(bodyW * .37f, bodyH * .72f)
        )
        drawOval(
            color = innerEar,
            topLeft = Offset(cx - bodyW * .62f, cy - bodyH * .34f),
            size = Size(bodyW * .25f, bodyH * .57f)
        )

        drawCircle(
            Color.Black,
            radius = bodyW * .035f,
            center = Offset(cx - bodyW * .20f, cy - bodyH * .08f)
        )

        drawLine(
            Color(0xFF9E9E9E),
            start = Offset(cx - bodyW * .24f, cy + bodyH * .16f),
            end = Offset(cx - bodyW * .20f, cy + bodyH * .58f),
            strokeWidth = bodyW * .09f,
            cap = StrokeCap.Round
        )
        drawLine(
            Color(0xFF9E9E9E),
            start = Offset(cx + bodyW * .06f, cy + bodyH * .17f),
            end = Offset(cx + bodyW * .09f, cy + bodyH * .56f),
            strokeWidth = bodyW * .09f,
            cap = StrokeCap.Round
        )

        drawLine(
            gray,
            start = Offset(cx - bodyW * .43f, cy + bodyH * .02f),
            end = Offset(cx - bodyW * .55f, cy + bodyH * .30f),
            strokeWidth = bodyW * .11f,
            cap = StrokeCap.Round
        )

        drawLine(
            darkGray,
            start = Offset(cx + bodyW * .43f, cy + bodyH * .18f),
            end = Offset(cx + bodyW * .62f, cy + bodyH * .36f),
            strokeWidth = bodyW * .06f,
            cap = StrokeCap.Round
        )
        drawLine(
            Color(0xFF9D9D9D),
            start = Offset(cx + bodyW * .56f, cy + bodyH * .30f),
            end = Offset(cx + bodyW * .62f, cy + bodyH * .37f),
            strokeWidth = bodyW * .045f,
            cap = StrokeCap.Round
        )

        drawLine(
            gray,
            start = Offset(cx - bodyW * .64f, cy + bodyH * .05f),
            end = Offset(cx - bodyW * .67f, cy + bodyH * .35f),
            strokeWidth = bodyW * .10f,
            cap = StrokeCap.Round
        )

        drawOval(
            color = Color(0xFFFFD86B),
            topLeft = Offset(cx - bodyW * .71f, cy - bodyH * .02f),
            size = Size(bodyW * .17f, bodyH * .07f)
        )

        drawRoundRect(
            color = Color(0xFF2E7BCF),
            topLeft = Offset(cx + bodyW * .30f, cy - bodyH * .05f),
            size = Size(bodyW * .20f, bodyH * .42f),
            cornerRadius = CornerRadius(20f, 20f)
        )

        drawArc(
            color = Color(0xFFFFD54F),
            startAngle = 200f,
            sweepAngle = 140f,
            useCenter = false,
            topLeft = Offset(cx - bodyW * .75f, cy - bodyH * .62f),
            size = Size(bodyW * .34f, bodyH * .24f),
            style = Stroke(width = bodyW * .025f)
        )
    }
}

@Composable
private fun GiraffeIllustration(modifier: Modifier) {
    Canvas(modifier) {
        val c = Color(0xFFFFB52E)
        val spot = Color(0xFFB96A16)
        val brown = Color(0xFF7E4A17)
        val x = size.width * .50f

        drawRoundRect(
            color = c,
            topLeft = Offset(x - size.width * .08f, size.height * .30f),
            size = Size(size.width * .16f, size.height * .45f),
            cornerRadius = CornerRadius(40f, 40f)
        )
        drawCircle(c, radius = size.width * .10f, center = Offset(x, size.height * .24f))
        drawOval(
            color = c,
            topLeft = Offset(x + size.width * .04f, size.height * .15f),
            size = Size(size.width * .23f, size.height * .10f)
        )

        repeat(7) { i ->
            val px = x - size.width * .07f + (i % 3) * size.width * .06f
            val py = size.height * (.34f + (i / 3) * .11f)
            drawCircle(spot, radius = size.width * .018f, center = Offset(px, py))
        }

        drawLine(
            brown,
            start = Offset(x - size.width * .06f, size.height * .72f),
            end = Offset(x - size.width * .11f, size.height * .95f),
            strokeWidth = size.width * .035f,
            cap = StrokeCap.Round
        )
        drawLine(
            brown,
            start = Offset(x + size.width * .06f, size.height * .72f),
            end = Offset(x + size.width * .11f, size.height * .95f),
            strokeWidth = size.width * .035f,
            cap = StrokeCap.Round
        )
        drawLine(
            brown,
            start = Offset(x - size.width * .02f, size.height * .72f),
            end = Offset(x, size.height * .94f),
            strokeWidth = size.width * .03f,
            cap = StrokeCap.Round
        )
    }
}
