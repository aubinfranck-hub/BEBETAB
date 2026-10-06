package com.bebetab.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import kotlinx.coroutines.launch
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.data.ParentSettingsStore
import com.bebetab.data.ProgressStore
import com.bebetab.ui.theme.*
 
@Composable
fun BebeTabFrame(
    title:String,
    onBack:()->Unit,
    onSettings:()->Unit={},
    content:@Composable ColumnScope.()->Unit
){
    val c = androidx.compose.ui.platform.LocalContext.current
    val p = remember{ProgressStore(c)}
    val s = remember{ParentSettingsStore(c)}
    val stars by p.stars.collectAsState(initial=2450)
    val name by s.childName.collectAsState(initial="Kofi")
    val lang by s.language.collectAsState(initial="fr")
    val level = stars/50+1
    val pv = (stars%50)/50f

    Column(Modifier.fillMaxSize().background(SkyLight)){
        Surface(color=Color.White, shadowElevation=4.dp){
            Row(
                Modifier.fillMaxWidth().height(76.dp).padding(horizontal=16.dp),
                verticalAlignment=Alignment.CenterVertically
            ){
                IconButton(
                    onClick=onBack,
                    modifier=Modifier.size(46.dp).background(OutlineBlue, CircleShape)
                ){ Icon(Icons.Default.ArrowBack,null,tint=Color.White) }

                Spacer(Modifier.width(12.dp))
                Row(verticalAlignment=Alignment.CenterVertically,modifier=Modifier.weight(1f)){
                    Text(title,fontSize=25.sp,color=OutlineBlue,fontWeight=FontWeight.Black)
                }

                Surface(Modifier.size(44.dp),shape=CircleShape,color=Color(0xFF90CAF9)){Box(contentAlignment=Alignment.Center){Text(name.take(1).uppercase(),fontWeight=FontWeight.Black,color=Color.White)}}
                Spacer(Modifier.width(8.dp))
                Text("⭐ $stars",fontSize=15.sp,fontWeight=FontWeight.Black,color=Color(0xFF34495E))
                Spacer(Modifier.width(12.dp))
                Icon(Icons.Default.CardGiftcard,null,tint=LearnOrange,modifier=Modifier.size(26.dp))
                Spacer(Modifier.width(12.dp))
                Column(horizontalAlignment=Alignment.End){
                    Text(if(lang=="fr")"Niveau $level • Explorateur" else "Level $level • Explorer",fontWeight=FontWeight.Black,fontSize=12.sp,color=OutlineBlue)
                    LinearProgressIndicator(progress={pv},modifier=Modifier.width(120.dp).height(7.dp),color=OutlineBlue,trackColor=Color(0xFFE3F2FD))
                }
                Spacer(Modifier.width(14.dp))
                Row(horizontalArrangement=Arrangement.spacedBy(4.dp)){
                    AssistChip(onClick={},label={Text("FR",fontWeight=FontWeight.Black)},enabled=true)
                    AssistChip(onClick={},label={Text("EN",fontWeight=FontWeight.Black)})
                }
                Spacer(Modifier.width(8.dp))
                IconButton(onClick=onSettings,modifier=Modifier.size(46.dp)){Icon(Icons.Default.Settings,null,tint=OutlineBlue)}
            }
        }
        Column(Modifier.fillMaxSize().padding(horizontal=18.dp,vertical=14.dp),content=content)
    }
}
