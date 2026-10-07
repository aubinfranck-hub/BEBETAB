package com.bebetab.update

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.io.File

@Composable
fun AutoUpdateOverlay() {
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var info by remember { mutableStateOf<UpdateInfo?>(null) }
    var downloaded by remember { mutableStateOf<File?>(null) }
    var downloading by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf<String?>(null) }
    var checked by remember { mutableStateOf(false) }

    fun checkNow() {
        scope.launch {
            when (val result = UpdateManager.check(context)) {
                is UpdateResult.Available -> {
                    info = result.info
                    error = null
                }
                is UpdateResult.Error -> {
                    if (!checked) error = null
                }
                UpdateResult.UpToDate -> {
                    info = null
                    error = null
                }
            }
            checked = true
        }
    }

    LaunchedEffect(Unit) {
        checkNow()
        while (true) {
            delay(6 * 60 * 60 * 1000L)
            checkNow()
        }
    }

    LaunchedEffect(info) {
        val update = info ?: return@LaunchedEffect
        if (downloaded == null && !downloading) {
            downloading = true
            error = null
            try {
                downloaded = UpdateManager.download(context, update)
            } catch (e: Exception) {
                error = e.message ?: "Échec du téléchargement"
            } finally {
                downloading = false
            }
        }
    }

    val update = info ?: return
    Box(
        Modifier.fillMaxSize().background(Color.Black.copy(alpha = .30f)),
        contentAlignment = Alignment.Center
    ) {
        Card(
            Modifier.fillMaxWidth(.72f),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(10.dp)
        ) {
            Column(
                Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Text("🚀", fontSize = 42.sp)
                Text("Nouvelle version de BébéTab", style = MaterialTheme.typography.headlineSmall)
                Text("Version " + update.versionName, color = Color(0xFF1E88E5))
                if (update.notesFr.isNotBlank()) {
                    Text(update.notesFr, style = MaterialTheme.typography.bodyMedium)
                }

                when {
                    downloading -> {
                        CircularProgressIndicator()
                        Text("Téléchargement automatique…")
                    }
                    downloaded != null -> {
                        Text("La mise à jour est prête.")
                        Button(onClick = {
                            val file = downloaded ?: return@Button
                            if (!UpdateManager.canInstallUnknownSources(context)) {
                                UpdateManager.openUnknownSourcesSettings(context)
                            } else {
                                UpdateManager.install(context, file)
                            }
                        }) {
                            Text("Installer la mise à jour")
                        }
                    }
                    error != null -> {
                        Text(error!!, color = Color(0xFFC62828))
                        Button(onClick = {
                            downloaded = null
                            error = null
                            scope.launch {
                                downloading = true
                                try {
                                    downloaded = UpdateManager.download(context, update)
                                } catch (e: Exception) {
                                    error = e.message ?: "Échec du téléchargement"
                                } finally {
                                    downloading = false
                                }
                            }
                        }) { Text("Réessayer") }
                    }
                }
            }
        }
    }
}
