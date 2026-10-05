package com.bebetab.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalContext
import com.bebetab.data.ParentSettingsStore
import com.bebetab.data.ProgressStore
import com.bebetab.ui.theme.*

@Composable
fun BebeTabFrame(
    title:String,
    onBack:()->Unit,
    onSettings:()->Unit = {},
    content:@Composable ColumnScope.()->Unit
){
    val context=LocalContext.current
    val progress=remember{ProgressStore(context)}
    val settings=remember{ParentSettingsStore(context)}
    val stars by progress.stars.collectAsState(initial=0)
    val childName by settings.childName.collectAsState(initial="Kofi")
    val language by settings.language.collectAsState(initial="fr")
    val level=stars/50+1
    val progressValue=(stars%50)/50f
    Column(Modifier.fillMaxSize().background(SkyLight)){
        Row(Modifier.fillMaxWidth().background(Color.White).padding(horizontal=14.dp,vertical=6.dp),verticalAlignment=Alignment.CenterVertically){
            IconButton(onClick=onBack,modifier=Modifier.size(44.dp).clip(CircleShape).background(OutlineBlue)){
                Icon(Icons.Default.ArrowBack,null,tint=Color.White)
            }
            Spacer(Modifier.width(10.dp))
            Text(title,fontSize=24.sp,color=OutlineBlue,fontWeight=androidx.compose.ui.text.font.FontWeight.ExtraBold,modifier=Modifier.weight(1f))
            Text("$childName  ⭐ $stars",fontSize=13.sp,fontWeight=androidx.compose.ui.text.font.FontWeight.Bold)
            Spacer(Modifier.width(12.dp))
            Icon(Icons.Default.CardGiftcard,null,tint=LearnOrange)
            Spacer(Modifier.width(10.dp))
            Column(horizontalAlignment=Alignment.End){
                Text(if(language=="fr")"Niveau $level" else "Level $level",fontWeight=androidx.compose.ui.text.font.FontWeight.Bold,fontSize=12.sp)
                LinearProgressIndicator(progress={progressValue},modifier=Modifier.width(80.dp))
            }
            Spacer(Modifier.width(10.dp))
            Text(if(language=="fr")"FR / EN" else "EN / FR",color=OutlineBlue,fontWeight=androidx.compose.ui.text.font.FontWeight.Bold)
            IconButton(onClick=onSettings,modifier=Modifier.size(44.dp)){
                Icon(Icons.Default.Settings,null,tint=OutlineBlue)
            }
        }
        Column(Modifier.fillMaxSize().padding(16.dp),content=content)
    }
}
