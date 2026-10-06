package com.bebetab.ui.screens

import android.graphics.BitmapFactory
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.*
import com.bebetab.R
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

private data class Crop(val x:Int,val y:Int,val w:Int,val h:Int)

// reference_board.jpg is the 3x3 professional reference board (320x213).
// The previous build used coordinates from a different scaled board, which
// caused the home screen to show only a tiny/incorrect portion of the art.
private val crops=mapOf(
    "home" to Crop(2,2,156,69),
    "world" to Crop(160,2,158,69),
    "france" to Crop(2,74,103,68),
    "live" to Crop(107,74,104,68),
    "learn" to Crop(213,74,105,68),
    "play" to Crop(2,145,103,66),
    "stories" to Crop(107,145,104,66),
    "draw" to Crop(213,145,105,66),
    "rewards" to Crop(2,145,103,66)
)

@Composable
fun ReferenceBoardScreen(route:String,onNavigate:(String)->Unit,onBack:(()->Unit)?=null){
    val context=LocalContext.current
    var bitmap by remember{mutableStateOf<androidx.compose.ui.graphics.ImageBitmap?>(null)}

    LaunchedEffect(Unit){
        bitmap=withContext(Dispatchers.IO){
            BitmapFactory.decodeResource(context.resources,R.drawable.reference_board)?.asImageBitmap()
        }
    }

    Box(Modifier.fillMaxSize().clip(RoundedCornerShape(18.dp))){
        val b=bitmap
        if(b==null){
            Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){CircularProgressIndicator()}
        }else{
            ReferenceCropImage(b,crops[route]?:crops.getValue("home"))
            ReferenceHotspots(route,onNavigate,onBack)
        }
    }
}

@Composable
private fun ReferenceCropImage(bitmap:androidx.compose.ui.graphics.ImageBitmap,crop:Crop){
    Canvas(Modifier.fillMaxSize()){
        drawImage(
            image=bitmap,
            srcOffset=IntOffset(crop.x,crop.y),
            srcSize=IntSize(crop.w,crop.h),
            dstOffset=IntOffset.Zero,
            dstSize=IntSize(size.width.toInt(),size.height.toInt())
        )
    }
}

@Composable
private fun ReferenceHotspots(route:String,onNavigate:(String)->Unit,onBack:(()->Unit)?){
    BoxWithConstraints(Modifier.fillMaxSize()){
        @Composable
        fun Hotspot(x:Float,y:Float,w:Float,h:Float,action:()->Unit){
            Box(
                Modifier
                    .offset(maxWidth*x,maxHeight*y)
                    .width(maxWidth*w)
                    .height(maxHeight*h)
                    .pointerInput(Unit){detectTapGestures(onTap={action()})}
            )
        }

        if(route!="home" && onBack!=null){
            Hotspot(.005f,.01f,.09f,.15f){onBack()}
            Hotspot(.92f,.005f,.075f,.15f){onNavigate("settings")}
        } else if(route=="home"){
            Hotspot(.92f,.005f,.075f,.15f){onNavigate("settings")}
        }

        when(route){
            "home"->{
                listOf("world","learn","play","stories","live","music","draw","rewards").forEachIndexed{i,target->
                    Hotspot(i/8f+.004f,.77f,.12f,.23f){onNavigate(target)}
                }
                Hotspot(.32f,.43f,.35f,.30f){onNavigate("world")}
                Hotspot(.75f,.09f,.24f,.37f){onNavigate("live")}
            }
            "world"->Hotspot(.79f,.12f,.20f,.20f){onNavigate("france")}
            "learn"->{
                Hotspot(.34f,.17f,.15f,.35f){onNavigate("quiz_letters")}
                Hotspot(.50f,.17f,.15f,.35f){onNavigate("quiz_numbers")}
                Hotspot(.66f,.17f,.15f,.35f){onNavigate("mini_science")}
                Hotspot(.82f,.17f,.15f,.35f){onNavigate("world")}
                Hotspot(.34f,.53f,.15f,.34f){onNavigate("mini_animals")}
                Hotspot(.50f,.53f,.15f,.34f){onNavigate("mini_space")}
                Hotspot(.66f,.53f,.15f,.34f){onNavigate("mini_art")}
                Hotspot(.82f,.53f,.15f,.34f){onNavigate("mini_languages")}
            }
            "play"->{
                val t=listOf("mini_puzzle","mini_math","mini_geography","mini_animals","memory","mini_logic","mini_french","mini_english")
                for(i in 0..3){
                    Hotspot(.34f+i*.15f,.17f,.14f,.34f){onNavigate(t[i])}
                    Hotspot(.34f+i*.15f,.53f,.14f,.34f){onNavigate(t[i+4])}
                }
            }
            "stories"->{
                Hotspot(.36f,.22f,.20f,.43f){onNavigate("story_reader/0")}
                Hotspot(.59f,.22f,.20f,.43f){onNavigate("story_reader/1")}
                Hotspot(.81f,.22f,.18f,.43f){onNavigate("story_reader/2")}
            }
            "draw"->{
                Hotspot(.46f,.19f,.18f,.33f){onNavigate("draw_free")}
                Hotspot(.64f,.19f,.18f,.33f){onNavigate("mini_coloring")}
                Hotspot(.82f,.19f,.17f,.33f){onNavigate("mini_trace_letters")}
                Hotspot(.46f,.54f,.18f,.33f){onNavigate("quiz_numbers")}
                Hotspot(.64f,.54f,.18f,.33f){onNavigate("mini_shapes")}
                Hotspot(.82f,.54f,.17f,.33f){onNavigate("music")}
            }
            "france"->Hotspot(.43f,.77f,.16f,.20f){onNavigate("live")}
        }
    }
}
