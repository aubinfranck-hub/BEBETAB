package com.bebetab.ui.screens

import android.graphics.BitmapFactory
import androidx.compose.foundation.Canvas
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.hoverable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsHoveredAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.asImageBitmap
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.FilterQuality
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.*
import com.bebetab.R
import com.bebetab.audio.BebeAudioEngine
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/*
 * The supplied reference board is the source of truth for the visual layer.
 * It is stored at its original 1536x1024 resolution and each screen is
 * displayed from its exact crop, so no emoji/vector approximation is used.
 */
private data class Crop(val x:Int,val y:Int,val w:Int,val h:Int)

private val crops=mapOf(
    "home"    to Crop(0,0,767,416),
    "world"   to Crop(775,0,760,416),
    "france"  to Crop(0,436,536,299),
    "live"    to Crop(545,436,483,299),
    "learn"   to Crop(1037,436,498,299),
    "play"    to Crop(0,755,536,260),
    "stories" to Crop(545,755,539,260),
    "draw"    to Crop(1091,755,444,260)
)

@Composable
fun ReferenceBoardScreen(
    route:String,
    onNavigate:(String)->Unit,
    onBack:(()->Unit)?=null
){
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
            Box(Modifier.fillMaxSize(),contentAlignment=Alignment.Center){
                CircularProgressIndicator()
            }
        }else{
            ReferenceCropImage(b,crops[route]?:crops.getValue("home"))
            ReferenceHotspots(route,onNavigate,onBack)
        }
    }
}

@Composable
private fun ReferenceCropImage(
    bitmap:androidx.compose.ui.graphics.ImageBitmap,
    crop:Crop
){
    Canvas(Modifier.fillMaxSize()){
        drawImage(
            image=bitmap,
            srcOffset=IntOffset(crop.x,crop.y),
            srcSize=IntSize(crop.w,crop.h),
            dstOffset=IntOffset.Zero,
            dstSize=IntSize(size.width.toInt(),size.height.toInt()),
            filterQuality = FilterQuality.High
        )
    }
}

@Composable
private fun ReferenceHotspots(
    route:String,
    onNavigate:(String)->Unit,
    onBack:(()->Unit)?
){
    BoxWithConstraints(Modifier.fillMaxSize()){
        @Composable
        fun Hotspot(
            x:Float,
            y:Float,
            w:Float,
            h:Float,
            action:()->Unit
        ){
            val interaction = remember { MutableInteractionSource() }
            val pressed by interaction.collectIsPressedAsState()
            val hovered by interaction.collectIsHoveredAsState()
            val scale by animateFloatAsState(
                targetValue = when {
                    pressed -> 0.94f
                    hovered -> 1.035f
                    else -> 1f
                },
                label = "hotspotScale"
            )
            Box(
                Modifier
                    .offset(maxWidth*x,maxHeight*y)
                    .width(maxWidth*w)
                    .height(maxHeight*h)
                    .scale(scale)
                    .hoverable(interaction)
                    .clickable(
                        interactionSource = interaction,
                        indication = null
                    ) {
                        BebeAudioEngine.click()
                        action()
                    }
            ) {
                if (hovered || pressed) {
                    Box(
                        Modifier
                            .fillMaxSize()
                            .clip(RoundedCornerShape(18.dp))
                            .background(
                                Color.White.copy(alpha = if (pressed) .20f else .08f)
                            )
                            .border(
                                2.dp,
                                Color.White.copy(alpha = if (pressed) .80f else .42f),
                                RoundedCornerShape(18.dp)
                            )
                    )
                }
            }
        }

        if(route!="home" && onBack!=null){
            Hotspot(.005f,.01f,.09f,.15f){onBack()}
            Hotspot(.92f,.005f,.075f,.15f){onNavigate("settings")}
        }else if(route=="home"){
            Hotspot(.92f,.005f,.075f,.15f){onNavigate("settings")}
        }

        when(route){
            "home"->{
                listOf("world","learn","play","stories","live","music","draw","rewards")
                    .forEachIndexed{i,target->
                        Hotspot(i/8f+.004f,.75f,.122f,.25f){onNavigate(target)}
                    }
                Hotspot(.37f,.55f,.28f,.20f){onNavigate("world")}
                Hotspot(.68f,.07f,.30f,.34f){onNavigate("live")}
            }
            "world"->{
                // Popular places panel: Paris, New York, Nairobi, Tokyo, Cairo.
                Hotspot(.79f,.15f,.19f,.17f){onNavigate("france")}
                Hotspot(.79f,.33f,.19f,.17f){onNavigate("world")}
                Hotspot(.79f,.51f,.19f,.17f){onNavigate("world")}
                Hotspot(.79f,.69f,.19f,.17f){onNavigate("world")}
            }
            "learn"->{
                Hotspot(.34f,.18f,.15f,.32f){onNavigate("quiz_letters")}
                Hotspot(.50f,.18f,.15f,.32f){onNavigate("quiz_numbers")}
                Hotspot(.66f,.18f,.15f,.32f){onNavigate("mini_science")}
                Hotspot(.82f,.18f,.15f,.32f){onNavigate("world")}
                Hotspot(.34f,.54f,.15f,.32f){onNavigate("mini_animals")}
                Hotspot(.50f,.54f,.15f,.32f){onNavigate("mini_space")}
                Hotspot(.66f,.54f,.15f,.32f){onNavigate("mini_art")}
                Hotspot(.82f,.54f,.15f,.32f){onNavigate("mini_languages")}
            }
            "play"->{
                val t=listOf(
                    "mini_puzzle","mini_math","mini_geography","mini_animals",
                    "memory","mini_logic","mini_french","mini_english"
                )
                for(i in 0..3){
                    Hotspot(.34f+i*.15f,.17f,.14f,.34f){onNavigate(t[i])}
                    Hotspot(.34f+i*.15f,.53f,.14f,.34f){onNavigate(t[i+4])}
                }
            }
            "stories"->{
                Hotspot(.36f,.21f,.20f,.45f){onNavigate("story_reader/0")}
                Hotspot(.59f,.21f,.20f,.45f){onNavigate("story_reader/1")}
                Hotspot(.81f,.21f,.18f,.45f){onNavigate("story_reader/2")}
            }
            "draw"->{
                Hotspot(.46f,.19f,.18f,.33f){onNavigate("draw_free")}
                Hotspot(.64f,.19f,.18f,.33f){onNavigate("mini_coloring")}
                Hotspot(.82f,.19f,.17f,.33f){onNavigate("mini_trace_letters")}
                Hotspot(.46f,.54f,.18f,.33f){onNavigate("quiz_numbers")}
                Hotspot(.64f,.54f,.18f,.33f){onNavigate("mini_shapes")}
                Hotspot(.82f,.54f,.17f,.33f){onNavigate("music")}
            }
            "france"->{
                Hotspot(.40f,.79f,.18f,.17f){onNavigate("live")}
                Hotspot(.58f,.79f,.15f,.17f){onNavigate("memory")}
                Hotspot(.74f,.79f,.22f,.17f){onNavigate("quiz_numbers")}
            }
        }
    }
}
