package com.bebetab.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.ParentSettingsStore
import com.bebetab.data.ProgressStore
import androidx.compose.ui.platform.LocalContext
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen(onBack:()->Unit){
    val context=LocalContext.current
    val scope=rememberCoroutineScope()
    val settings=remember{ParentSettingsStore(context)}
    val progress=remember{ProgressStore(context)}
    val language by settings.language.collectAsState(initial="fr")
    val minutes by settings.dailyMinutes.collectAsState(initial=60)
    val timerEnabled by settings.timerEnabled.collectAsState(initial=true)
    var unlocked by remember{mutableStateOf(false)}
    var code by remember{mutableStateOf("")}

    if(!unlocked){
        Column(Modifier.fillMaxSize().padding(30.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
            Text("Espace parents",fontSize=30.sp)
            Text("Entre le code 2580 pour accéder aux réglages.")
            OutlinedTextField(value=code,onValueChange={code=it.take(4)},label={Text("Code parent")})
            Button(onClick={if(code=="2580") unlocked=true}){Text("Déverrouiller")}
            TextButton(onClick=onBack){Text("Retour")}
        }
        return
    }

    Column(Modifier.fillMaxSize().padding(28.dp),verticalArrangement=Arrangement.spacedBy(16.dp)){
        Row(verticalAlignment=Alignment.CenterVertically){
            Text("Réglages parents",fontSize=30.sp,modifier=Modifier.weight(1f))
            TextButton(onClick=onBack){Text("Fermer")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text("Langue")
            Button(onClick={scope.launch{settings.setLanguage(if(language=="fr")"en" else "fr")}}){Text(if(language=="fr")"Français" else "English")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text("Temps quotidien : $minutes min")
            Button(onClick={scope.launch{settings.setDailyMinutes(minutes+15)}}){Text("+15")}
            Button(onClick={scope.launch{settings.setDailyMinutes(minutes-15)}}){Text("-15")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text("Limite de temps")
            Switch(checked=timerEnabled,onCheckedChange={scope.launch{settings.setTimerEnabled(it)}})
        }
        Button(onClick={scope.launch{progress.resetStars()}}){Text("Réinitialiser les étoiles")}
    }
}
