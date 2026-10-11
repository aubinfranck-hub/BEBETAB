package com.bebetab.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.ParentCodeRules
import com.bebetab.data.ParentSettingsStore
import com.bebetab.data.ProgressStore
import com.bebetab.ui.components.ParentCodeEntry
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
    val musicEnabled by settings.musicEnabled.collectAsState(initial=true)
    val usingDefaultCode by settings.usingDefaultCode.collectAsState(initial=false)
    val childName by settings.childName.collectAsState(initial="Kofi")
    var unlocked by remember{mutableStateOf(false)}
    var editedName by remember(childName){mutableStateOf(childName)}
    var resetConfirm by remember{mutableStateOf(false)}
    val en=language=="en"

    if(!unlocked){
        Column(Modifier.fillMaxSize().padding(30.dp),horizontalAlignment=Alignment.CenterHorizontally,verticalArrangement=Arrangement.spacedBy(12.dp,Alignment.CenterVertically)){
            Text(if(en)"Parent area" else "Espace parents",fontSize=30.sp)
            Text(if(en)"Enter the parent code to access settings." else "Entre le code parent pour accéder aux réglages.")
            ParentCodeEntry(language,if(en)"Unlock" else "Déverrouiller"){unlocked=true}
            TextButton(onClick=onBack){Text(if(en)"Back" else "Retour")}
        }
        return
    }

    Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(28.dp),verticalArrangement=Arrangement.spacedBy(16.dp)){
        Row(verticalAlignment=Alignment.CenterVertically){
            Text(if(en)"Parent settings" else "Réglages parents",fontSize=30.sp,modifier=Modifier.weight(1f))
            TextButton(onClick=onBack){Text(if(en)"Close" else "Fermer")}
        }
        if(usingDefaultCode){
            Card(colors=CardDefaults.cardColors(containerColor=MaterialTheme.colorScheme.errorContainer)){
                Text(
                    if(en)"The default parent code is still active. Choose your own code below so your child cannot guess it."
                    else "Le code parent par défaut est encore actif. Choisis ton propre code ci-dessous pour que ton enfant ne puisse pas le deviner.",
                    Modifier.padding(14.dp),fontWeight=FontWeight.Bold
                )
            }
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text(if(en)"Language" else "Langue")
            Button(onClick={scope.launch{settings.setLanguage(if(en)"fr" else "en")}}){Text(if(en)"English" else "Français")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(10.dp)){
            OutlinedTextField(value=editedName,onValueChange={editedName=it.take(24)},label={Text(if(en)"Child name" else "Prénom de l'enfant")},modifier=Modifier.weight(1f))
            Button(onClick={scope.launch{settings.setChildName(editedName)}}){Text(if(en)"Save" else "Enregistrer")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text(if(en)"Daily time: $minutes min" else "Temps quotidien : $minutes min",modifier=Modifier.weight(1f))
            Button(onClick={scope.launch{settings.setDailyMinutes(minutes+15)}}){Text("+15")}
            Button(onClick={scope.launch{settings.setDailyMinutes(minutes-15)}}){Text("-15")}
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text(if(en)"Time limit" else "Limite de temps",modifier=Modifier.weight(1f))
            Switch(checked=timerEnabled,onCheckedChange={scope.launch{settings.setTimerEnabled(it)}})
        }
        Row(verticalAlignment=Alignment.CenterVertically,horizontalArrangement=Arrangement.spacedBy(14.dp)){
            Text(if(en)"Background music" else "Musique de fond",modifier=Modifier.weight(1f))
            Switch(checked=musicEnabled,onCheckedChange={scope.launch{settings.setMusicEnabled(it)}})
        }

        ChangeCodeSection(language,onSave={scope.launch{settings.changeCode(it)}})

        Button(onClick={resetConfirm=true}){Text(if(en)"Reset stars" else "Réinitialiser les étoiles")}
        if(resetConfirm){
            AlertDialog(
                onDismissRequest={resetConfirm=false},
                title={Text(if(en)"Confirm" else "Confirmer")},
                text={Text(if(en)"All stars will be reset." else "Toutes les étoiles seront remises à zéro.")},
                confirmButton={Button(onClick={scope.launch{progress.resetStars();resetConfirm=false}}){Text(if(en)"Confirm" else "Confirmer")}},
                dismissButton={TextButton(onClick={resetConfirm=false}){Text(if(en)"Cancel" else "Annuler")}}
            )
        }
    }
}

@Composable
private fun ChangeCodeSection(language:String,onSave:(String)->Unit){
    val en=language=="en"
    var newCode by remember{mutableStateOf("")}
    var confirm by remember{mutableStateOf("")}
    var message by remember{mutableStateOf<String?>(null)}
    Column(verticalArrangement=Arrangement.spacedBy(8.dp)){
        Text(if(en)"Change the parent code" else "Changer le code parent",fontWeight=FontWeight.Bold,fontSize=18.sp)
        Row(horizontalArrangement=Arrangement.spacedBy(10.dp),verticalAlignment=Alignment.CenterVertically){
            OutlinedTextField(
                value=newCode,onValueChange={newCode=it.filter(Char::isDigit).take(4)},
                label={Text(if(en)"New code (4 digits)" else "Nouveau code (4 chiffres)")},singleLine=true,
                visualTransformation=PasswordVisualTransformation(),
                keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.NumberPassword),modifier=Modifier.weight(1f)
            )
            OutlinedTextField(
                value=confirm,onValueChange={confirm=it.filter(Char::isDigit).take(4)},
                label={Text(if(en)"Confirm" else "Confirmer")},singleLine=true,
                visualTransformation=PasswordVisualTransformation(),
                keyboardOptions=KeyboardOptions(keyboardType=KeyboardType.NumberPassword),modifier=Modifier.weight(1f)
            )
            Button(onClick={
                when{
                    !ParentCodeRules.isValidFormat(newCode)->message=if(en)"The code must have exactly 4 digits." else "Le code doit avoir exactement 4 chiffres."
                    newCode!=confirm->message=if(en)"The two codes are different." else "Les deux codes sont différents."
                    else->{
                        onSave(newCode)
                        newCode="";confirm=""
                        message=if(en)"Code saved." else "Code enregistré."
                    }
                }
            }){Text(if(en)"Save" else "Enregistrer")}
        }
        message?.let{Text(it,fontWeight=FontWeight.Bold)}
    }
}
