package com.bebetab.ui.components

import androidx.compose.foundation.Image
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import com.bebetab.R

/** Original illustrations, independent from the native text and touch controls. */
@Composable
fun Artwork(key:String,modifier:Modifier=Modifier) {
    val resource=when(key) {
        "music" -> R.drawable.art_music
        "rewards" -> R.drawable.art_rewards
        "quiz" -> R.drawable.art_quiz
        "challenges" -> R.drawable.art_challenges
        "videos" -> R.drawable.art_videos
        "parents" -> R.drawable.art_parents
        "rest" -> R.drawable.art_rest
        "assistant" -> R.drawable.art_assistant
        else -> R.drawable.art_worlds
    }
    Image(painterResource(resource),contentDescription=null,modifier=modifier,contentScale=ContentScale.Crop)
}
