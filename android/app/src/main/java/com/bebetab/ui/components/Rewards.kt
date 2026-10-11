package com.bebetab.ui.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.platform.LocalContext
import com.bebetab.data.ProgressStore

/** Réclame des étoiles une seule fois par jour pour une même clé ; renvoie true si elles ont été données. */
typealias Claim = suspend (key: String, stars: Int) -> Boolean

@Composable
fun rememberClaim(): Claim {
    val context = LocalContext.current
    val store = remember { ProgressStore(context) }
    // Le type attendu est annoncé explicitement pour que la lambda soit bien une lambda « suspend ».
    return remember(store) {
        val claim: Claim = { key, stars -> store.claimDaily(key, stars) }
        claim
    }
}
