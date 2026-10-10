package com.bebetab.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.foundation.text.KeyboardOptions
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
    val childName by settings.childName.collectAsState(initial="Kofi")
    var unlocked by remember{mutableStateOf(false)}
    var code by remember{mutableStateOf("")}
    var editedName by remember(childName){mutableStateOf(childName)}
    var resetConfirm by remember{mutableStateOf(false)}

    if(!unlocked){
        Column(Modifier.fillMaxSize().padding(30.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.Center){
            com.bebetab.ui.components.Artwork("parents",Modifier.fillMaxWidth(.7f).height(125.dp))
            Text(if(language=="fr")"Espace parents" else "Parent area",fontSize=30.sp)
            Text(if(language=="fr")"Entre le code parent pour accéder aux réglages." else "Enter the parent code to access settings.")
            OutlinedTextField(value=code,onValueChange={code=it.filter(Char::isDigit).take(4)},label={Text(if(language=="fr")"Code parent" else "Parent code")},keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.NumberPassword))
            Button(onClick={if(code=="2580") unlocked=true}){Text(if(language=="fr")"Déverrouiller" else "Unlock")}
            TextButton(onClick=onBack){Text(if(language=="fr")"Retour" else "Back")}
        }
        return
    }

    Column(Modifier.fillMaxSize().padding(28.dp),verticalArrangement=Arrangement.spacedBy(16.dp)){
        Row(verticalAlignment=Alignment.CenterVertically){
            Text(if(language=="fr")"Réglages parents" else "Parent settings",fontSize=30.sp,modifier=Modifier.weight(1f))
            TextButton(onClick=onBack){Text(if(language=="fr")"Fermer" else "Close")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text(if(language=="fr")"Langue" else "Language")
            Button(onClick={scope.launch{settings.setLanguage(if(language=="fr")"en" else "fr")}}){Text(if(language=="fr")"Français" else "English")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(10.dp)){
            OutlinedTextField(value=editedName,onValueChange={editedName=it.take(24)},label={Text(if(language=="fr")"Prénom de l'enfant" else "Child name")},modifier=Modifier.weight(1f))
            Button(onClick={scope.launch{settings.setChildName(editedName)}}){Text(if(language=="fr")"Enregistrer" else "Save")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text(if(language=="fr")"Temps quotidien : $minutes min" else "Daily time: $minutes min",modifier=Modifier.weight(1f))
            Button(onClick={scope.launch{settings.setDailyMinutes(minutes+15)}}){Text("+15")}
            Button(onClick={scope.launch{settings.setDailyMinutes(minutes-15)}}){Text("-15")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text(if(language=="fr")"Limite de temps" else "Time limit",modifier=Modifier.weight(1f))
            Switch(checked=timerEnabled,onCheckedChange={scope.launch{settings.setTimerEnabled(it)}})
        }
        Button(onClick={scope.launch{resetConfirm=true}}){Text(if(language=="fr")"Réinitialiser les étoiles" else "Reset stars")}
        if(resetConfirm){
            AlertDialog(
                onDismissRequest={resetConfirm=false},
                title={Text(if(language=="fr")"Confirmer" else "Confirm")},
                text={Text(if(language=="fr")"Toutes les étoiles seront remises à zéro." else "All stars will be reset.")},
                confirmButton={Button(onClick={scope.launch{progress.resetStars();resetConfirm=false}}){Text(if(language=="fr")"Confirmer" else "Confirm")}},
                dismissButton={TextButton(onClick={resetConfirm=false}){Text(if(language=="fr")"Annuler" else "Cancel")}}
            )
        }
    }
}