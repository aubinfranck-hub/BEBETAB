package com.bebetab.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.*
import com.bebetab.ui.components.BebeTabFrame
import com.bebetab.ui.games.*
import com.bebetab.ui.theme.*
import kotlinx.coroutines.launch

@Composable
private fun currentLanguage(): String {
    val context = LocalContext.current
    return remember { ParentSettingsStore(context) }.language.collectAsState(initial = "fr").value
}

private val learnColors = listOf(
    Color(0xFFFF6D3D), Color(0xFF9C27B0), Color(0xFF26A9E0), Color(0xFF21B573),
    Color(0xFF55B83E), Color(0xFF6350D9), Color(0xFFFFA726), Color(0xFFE91E63)
)

private val gameColors = listOf(
    Color(0xFF64C94C), Color(0xFF5866E8), Color(0xFF28A9D8), Color(0xFFFFA326),
    Color(0xFFB833D8), Color(0xFF17A8B8), Color(0xFFF39A17), Color(0xFF27A96B)
)

@Composable
private fun FantiPane(message: String) {
    Surface(
        Modifier.fillMaxHeight().width(300.dp).shadow(3.dp, RoundedCornerShape(24.dp)),
        shape = RoundedCornerShape(24.dp),
        color = Color.White.copy(alpha = .72f)
    ) {
        Column(
            Modifier.fillMaxSize().padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("🐘", fontSize = 128.sp)
            Spacer(Modifier.height(4.dp))
            Surface(
                shape = RoundedCornerShape(18.dp),
                color = Color.White,
                tonalElevation = 2.dp
            ) {
                Text(
                    message,
                    Modifier.padding(14.dp),
                    textAlign = TextAlign.Center,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFF19324A),
                    fontSize = 15.sp
                )
            }
            Spacer(Modifier.weight(1f))
            Text("BébéTab", color = OutlineBlue, fontWeight = FontWeight.ExtraBold, fontSize = 13.sp)
        }
    }
}

@Composable
private fun ActivityTile(title: String, subtitle: String, emoji: String, color: Color) {
    Button(
        onClick = {},
        modifier = Modifier.fillMaxSize().shadow(3.dp, RoundedCornerShape(18.dp)),
        shape = RoundedCornerShape(18.dp),
        colors = ButtonDefaults.buttonColors(containerColor = color),
        contentPadding = PaddingValues(8.dp)
    ) {
        Column(
            Modifier.fillMaxSize(),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Text(emoji, fontSize = 34.sp)
            Spacer(Modifier.height(6.dp))
            Text(title, fontWeight = FontWeight.ExtraBold, fontSize = 16.sp, color = Color.White)
            Text(subtitle, fontWeight = FontWeight.Bold, fontSize = 10.sp, color = Color.White)
        }
    }
}

@Composable
fun LearnActivityScreen(onBack: () -> Unit, onSettings: () -> Unit = {}) {
    val language = currentLanguage()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val store = remember { ProgressStore(context) }

    BebeTabFrame(if (language == "en") "LEARN" else "APPRENDRE", onBack, onSettings) {
        Row(Modifier.fillMaxSize().padding(8.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            FantiPane(if (language == "en") "Learn, discover and have fun!" else "Apprendre, découvrir et s'amuser !")
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    ContentData.subjects.take(4).forEachIndexed { index, item ->
                        Box(Modifier.weight(1f).fillMaxHeight()) {
                            ActivityTile(item.title.text(language), item.description.text(language).take(20), item.emoji, learnColors[index])
                        }
                    }
                }
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    ContentData.subjects.drop(4).forEachIndexed { index, item ->
                        Box(Modifier.weight(1f).fillMaxHeight()) {
                            ActivityTile(item.title.text(language), item.description.text(language).take(20), item.emoji, learnColors[index + 4])
                        }
                    }
                }
            }
        }
        LaunchedEffect(Unit) {
            // The first two learning cards award stars from their quiz flows.
            scope.launch { }
        }
    }
}

@Composable
fun PlayActivityScreen(onBack: () -> Unit, onSettings: () -> Unit = {}) {
    val language = currentLanguage()
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    val store = remember { ProgressStore(context) }

    BebeTabFrame(if (language == "en") "PLAY" else "JOUER", onBack, onSettings) {
        Row(Modifier.fillMaxSize().padding(8.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            FantiPane(if (language == "en") "Let's learn while playing!" else "Des jeux éducatifs pour apprendre en s'amusant !")
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    ContentData.games.take(4).forEachIndexed { index, item ->
                        Box(Modifier.weight(1f).fillMaxHeight()) {
                            ActivityTile(item.title.text(language), item.description.text(language).take(20), item.emoji, gameColors[index])
                        }
                    }
                }
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    ContentData.games.drop(4).forEachIndexed { index, item ->
                        Box(Modifier.weight(1f).fillMaxHeight()) {
                            if (item.id == "memory") {
                                MemoryGame { stars -> scope.launch { store.addStars(stars) } }
                            } else {
                                ActivityTile(item.title.text(language), item.description.text(language).take(20), item.emoji, gameColors[index + 4])
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun StoryActivityScreen(onBack: () -> Unit, onSettings: () -> Unit = {}) {
    val language = currentLanguage()

    BebeTabFrame(if (language == "en") "STORIES" else "HISTOIRES", onBack, onSettings) {
        Row(Modifier.fillMaxSize().padding(8.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            FantiPane(if (language == "en") "Listen, read and live amazing stories with Fanti!" else "Écoute, lis et vis des histoires incroyables avec Fanti !")
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(14.dp)) {
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                    val storyEmojis = listOf("🌳", "🏜️", "🚀")
                    ContentData.stories.forEachIndexed { index, story ->
                        Surface(
                            Modifier.weight(1f).fillMaxHeight().shadow(3.dp, RoundedCornerShape(20.dp)),
                            shape = RoundedCornerShape(20.dp),
                            color = Color.White
                        ) {
                            Column(Modifier.fillMaxSize(), horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    Modifier.fillMaxWidth().weight(1f).background(
                                        Brush.verticalGradient(listOf(Color(0xFFB9EBFF), Color(0xFFFFE39E)))
                                    ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(storyEmojis[index], fontSize = 70.sp)
                                }
                                Text(story.text(language), Modifier.padding(12.dp), fontWeight = FontWeight.ExtraBold, textAlign = TextAlign.Center, fontSize = 14.sp)
                            }
                        }
                    }
                }
                Row(Modifier.fillMaxWidth().height(66.dp), horizontalArrangement = Arrangement.spacedBy(9.dp)) {
                    listOf("🏕️ Aventure", "🐾 Animaux", "🪄 Magie", "🌍 Monde", "🤝 Amitié", "🎧 Écouter").forEach { label ->
                        Surface(
                            Modifier.weight(1f).fillMaxHeight(),
                            shape = RoundedCornerShape(16.dp),
                            color = Color.White,
                            shadowElevation = 2.dp
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(label, fontSize = 11.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                            }
                        }
                    }
                }
                Box(Modifier.fillMaxWidth().height(92.dp)) { StoryReader(language) }
            }
        }
    }
}

@Composable
fun MusicActivityScreen(onBack: () -> Unit, onSettings: () -> Unit = {}) {
    val language = currentLanguage()
    BebeTabFrame(if (language == "en") "MUSIC" else "MUSIQUE", onBack, onSettings) { MusicKeyboard(language) }
}

@Composable
fun DrawActivityScreen(onBack: () -> Unit, onSettings: () -> Unit = {}) {
    val language = currentLanguage()

    BebeTabFrame(if (language == "en") "DRAW" else "DESSINER", onBack, onSettings) {
        Row(Modifier.fillMaxSize().padding(8.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Surface(
                Modifier.fillMaxHeight().width(300.dp),
                shape = RoundedCornerShape(24.dp),
                color = Color.White.copy(alpha = .78f),
                shadowElevation = 3.dp
            ) {
                Column(
                    Modifier.fillMaxSize().padding(14.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Text("🐘", fontSize = 108.sp)
                    Text("🎨", fontSize = 46.sp)
                    Text(if (language == "en") "Create with Fanti!" else "Crée avec Fanti !", fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = OutlineBlue, textAlign = TextAlign.Center)
                    Spacer(Modifier.weight(1f))
                    Text(if (language == "en") "Let your imagination fly!" else "Laisse libre cours à ton imagination !", fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                }
            }
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    DrawMode("🖌️", if (language=="en") "Free drawing" else "Dessin libre", DrawYellow)
                    DrawMode("🦋", if (language=="en") "Coloring" else "Coloriage", Color(0xFFFFB22E))
                    DrawMode("A", if (language=="en") "Trace letters" else "Tracer lettres", Color(0xFF3DA6EF))
                }
                Row(Modifier.weight(1f), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    DrawMode("1 2 3", if (language=="en") "Trace numbers" else "Tracer chiffres", Color(0xFFAA6CF2))
                    DrawMode("🔵", if (language=="en") "Shapes" else "Formes", Color(0xFF7CCB38))
                    DrawMode("🎵", if (language=="en") "Create music" else "Créer musique", MusicPink)
                }
            }
        }
    }
}

@Composable
private fun DrawMode(icon: String, label: String, color: Color) {
    Button(
        onClick = {},
        modifier = Modifier.weight(1f).fillMaxHeight().shadow(3.dp, RoundedCornerShape(20.dp)),
        shape = RoundedCornerShape(20.dp),
        colors = ButtonDefaults.buttonColors(containerColor = color)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(icon, fontSize = 30.sp, color = Color.White)
            Spacer(Modifier.height(8.dp))
            Text(label, color = Color.White, fontSize = 14.sp, fontWeight = FontWeight.ExtraBold, textAlign = TextAlign.Center)
        }
    }
}
