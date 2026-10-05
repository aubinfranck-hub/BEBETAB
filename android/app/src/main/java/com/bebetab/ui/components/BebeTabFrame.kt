package com.bebetab.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.ParentSettingsStore
import com.bebetab.data.ProgressStore
import com.bebetab.ui.theme.*

@Composable
fun BebeTabFrame(
    title: String,
    onBack: () -> Unit,
    onSettings: () -> Unit = {},
    content: @Composable ColumnScope.() -> Unit
) {
    val context = LocalContext.current
    val progress = remember { ProgressStore(context) }
    val settings = remember { ParentSettingsStore(context) }
    val stars by progress.stars.collectAsState(0)
    val name by settings.childName.collectAsState("Kofi")
    val lang by settings.language.collectAsState("fr")
    val level = stars / 50 + 1
    val progressValue = (stars % 50) / 50f

    Column(
        Modifier
            .fillMaxSize()
            .background(SkyLight)
            .padding(8.dp)
    ) {
        Row(
            Modifier
                .fillMaxWidth()
                .height(60.dp)
                .shadow(5.dp, RoundedCornerShape(22.dp))
                .background(Color(0xFF1684E8), RoundedCornerShape(22.dp))
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onBack,
                modifier = Modifier
                    .size(46.dp)
                    .clip(CircleShape)
                    .background(Color.White)
            ) {
                Icon(Icons.Default.ArrowBack, "Retour", tint = OutlineBlue)
            }

            Spacer(Modifier.width(8.dp))
            Text(
                when (title) {
                    "EXPLORER LE MONDE" -> "🌍"
                    "FRANCE" -> "🇫🇷"
                    "LIVE WORLD" -> "📷"
                    "APPRENDRE" -> "📖"
                    "JOUER" -> "🎮"
                    "HISTOIRES" -> "📚"
                    "DESSINER" -> "🎨"
                    "MES RÉCOMPENSES" -> "⭐"
                    else -> "✨"
                },
                fontSize = 26.sp
            )
            Spacer(Modifier.width(6.dp))
            Column(Modifier.weight(1f)) {
                Text(
                    title,
                    color = Color.White,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    when (title) {
                        "EXPLORER LE MONDE" -> "Découvre les pays, les cultures, les animaux…"
                        "FRANCE" -> "Europe > France"
                        "LIVE WORLD" -> "Regarde le monde en direct !"
                        "APPRENDRE" -> "Choisis une matière et commence à apprendre !"
                        "JOUER" -> "Des jeux éducatifs pour apprendre en s'amusant !"
                        "HISTOIRES" -> "Écoute, lis et vis des histoires incroyables avec Fanti !"
                        "DESSINER" -> "Laisse libre cours à ton imagination !"
                        else -> "Tes découvertes et tes récompenses"
                    },
                    color = Color.White.copy(alpha = .94f),
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold
                )
            }

            HeaderChip("👦 $name")
            Spacer(Modifier.width(5.dp))
            HeaderChip("⭐ $stars")
            Spacer(Modifier.width(5.dp))
            IconButton(
                onClick = {},
                modifier = Modifier.size(40.dp).clip(CircleShape).background(Color.White)
            ) {
                Icon(Icons.Default.CardGiftcard, "Récompenses", tint = Color(0xFFFF1744))
            }
            Spacer(Modifier.width(4.dp))
            Column(
                modifier = Modifier.width(100.dp),
                horizontalAlignment = Alignment.End
            ) {
                Text(
                    if (lang == "fr") "Niveau $level" else "Level $level",
                    color = Color.White,
                    fontSize = 10.sp,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    if (lang == "fr") "Explorateur" else "Explorer",
                    color = Color.White,
                    fontSize = 8.sp,
                    fontWeight = FontWeight.Bold
                )
                LinearProgressIndicator(
                    progress = { progressValue },
                    modifier = Modifier.fillMaxWidth().height(6.dp).clip(RoundedCornerShape(50)),
                    color = Yellow,
                    trackColor = Color.White.copy(alpha = .35f)
                )
            }
            Spacer(Modifier.width(7.dp))
            LanguagePill(if (lang == "fr") "FR" else "EN") {
                // Language changes are handled from settings in this build.
            }
            Spacer(Modifier.width(4.dp))
            LanguagePill(if (lang == "fr") "EN" else "FR") {
                // Language changes are handled from settings in this build.
            }
            IconButton(
                onClick = onSettings,
                modifier = Modifier.size(40.dp).clip(CircleShape).background(Color.White)
            ) {
                Icon(Icons.Default.Settings, "Réglages", tint = OutlineBlue)
            }
        }

        Column(
            Modifier
                .fillMaxSize()
                .padding(top = 8.dp),
            content = content
        )
    }
}

@Composable
private fun HeaderChip(text: String) {
    Surface(
        shape = RoundedCornerShape(22.dp),
        color = Color.White,
        modifier = Modifier.height(38.dp)
    ) {
        Box(
            Modifier.padding(horizontal = 10.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(text, color = Color(0xFF1D2F44), fontSize = 11.sp, fontWeight = FontWeight.ExtraBold)
        }
    }
}

@Composable
private fun LanguagePill(text: String, onClick: () -> Unit) {
    Surface(
        onClick = onClick,
        shape = RoundedCornerShape(20.dp),
        color = Color.White,
        modifier = Modifier
            .height(34.dp)
            .border(1.dp, OutlineBlue, RoundedCornerShape(20.dp))
    ) {
        Box(Modifier.padding(horizontal = 10.dp), contentAlignment = Alignment.Center) {
            Text(text, color = OutlineBlue, fontSize = 11.sp, fontWeight = FontWeight.ExtraBold)
        }
    }
}
