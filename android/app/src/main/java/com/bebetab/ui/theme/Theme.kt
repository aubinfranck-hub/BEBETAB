package com.bebetab.ui.theme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
private val BebeTabColors=lightColorScheme(primary=OutlineBlue,secondary=Yellow,background=SkyLight,surface=Color.White,onPrimary=Color.White,onBackground=Color(0xFF16324F),onSurface=Color(0xFF16324F))
@Composable fun BebeTabTheme(content:@Composable ()->Unit){MaterialTheme(colorScheme=BebeTabColors,content=content)}