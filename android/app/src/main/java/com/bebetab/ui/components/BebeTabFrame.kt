package com.bebetab.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CardGiftcard
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.bebetab.ui.theme.*

@Composable
fun BebeTabFrame(
    title:String,
    onBack:()->Unit,
    onSettings:()->Unit = {},
    content:@Composable ColumnScope.()->Unit
){
    Column(Modifier.fillMaxSize().background(SkyLight)){
        Row(
            Modifier.fillMaxWidth().background(Color.White).padding(horizontal=14.dp,vertical=8.dp),
            verticalAlignment=Alignment.CenterVertically
        ){
            IconButton(onClick=onBack,modifier=Modifier.size(44.dp).clip(CircleShape).background(OutlineBlue)){
                Icon(Icons.Default.ArrowBack,null,tint=Color.White)
            }
            Spacer(Modifier.width(10.dp))
            Text(title,fontSize=24.sp,color=OutlineBlue,fontWeight=androidx.compose.ui.text.font.FontWeight.ExtraBold,modifier=Modifier.weight(1f))
            Text("Kofi  ⭐ 2 450",fontSize=13.sp,fontWeight=androidx.compose.ui.text.font.FontWeight.Bold)
            Spacer(Modifier.width(12.dp))
            Icon(Icons.Default.CardGiftcard,null,tint=LearnOrange)
            Spacer(Modifier.width(10.dp))
            Text("Niveau 3",fontWeight=androidx.compose.ui.text.font.FontWeight.Bold)
            Spacer(Modifier.width(10.dp))
            Text("FR / EN",color=OutlineBlue,fontWeight=androidx.compose.ui.text.font.FontWeight.Bold)
            Spacer(Modifier.width(8.dp))
            IconButton(onClick=onSettings,modifier=Modifier.size(44.dp)){
                Icon(Icons.Default.Settings,null,tint=OutlineBlue)
            }
        }
        Column(Modifier.fillMaxSize().padding(16.dp),content=content)
    }
}
