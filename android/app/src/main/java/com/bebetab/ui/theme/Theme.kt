package com.bebetab.ui.theme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
private val BebeTabColors=lightColorScheme(primary=OutlineBlue,secondary=Yellow,background=SkyLight,surface=androidx.compose.ui.graphics.Color.White,onPrimary=androidx.compose.ui.graphics.Color.White,onBackground=androidx.compose.ui.graphics.Color(0xFF16324F),onSurface=androidx.compose.ui.graphics.Color(0xFF16324F))
@Composable fun BebeTabTheme(content:@Composable()->Unit){MaterialTheme(colorScheme=BebeTabColors,content=content)}
