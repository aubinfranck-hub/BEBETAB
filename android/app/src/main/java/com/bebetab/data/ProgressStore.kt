package com.bebetab.data

import android.content.Context
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.core.stringSetPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.datastore.preferences.core.edit
import java.time.LocalDate
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.progressDataStore by preferencesDataStore(name = "bebetab_progress")

/**
 * Règle des gains quotidiens, séparée du stockage pour pouvoir être testée.
 * Renvoie les réclamations à conserver (celles d'aujourd'hui) et si [tag] vient d'être accordé.
 */
internal fun applyDailyClaim(existing: Set<String>, today: String, tag: String): Pair<Set<String>, Boolean> {
    val kept = existing.filter { it.startsWith("$today|") }.toMutableSet()
    val granted = kept.add("$today|$tag")
    return kept to granted
}

class ProgressStore(private val context: Context) {
    private val starsKey = intPreferencesKey("stars")
    private val languageKey = stringPreferencesKey("language")
    private val dailyClaimsKey = stringSetPreferencesKey("daily_claims")

    // Un enfant commence à 0 étoile. L'ancien défaut (2450, valeur de la maquette) donnait un
    // niveau 50 et toutes les médailles dès le premier lancement, et ne correspondait pas au
    // point de départ de addStars (0), ce qui faisait retomber le compteur au premier gain.
    val stars: Flow<Int> = context.progressDataStore.data.map { it[starsKey] ?: 0 }
    val language: Flow<String> = context.progressDataStore.data.map { it[languageKey] ?: "fr" }

    suspend fun addStars(amount: Int) {
        context.progressDataStore.edit { p -> p[starsKey] = (p[starsKey] ?: 0) + amount }
    }

    /**
     * Donne [amount] étoiles au plus une fois par jour pour une même [tag]
     * (« gift », « country:france », « quiz:animals:0 »…). Renvoie true si les étoiles ont été données.
     * Empêche de gagner des étoiles à l'infini en refaisant la même chose.
     */
    suspend fun claimDaily(tag: String, amount: Int): Boolean {
        var granted = false
        context.progressDataStore.edit { p ->
            val (claims, accepted) = applyDailyClaim(p[dailyClaimsKey] ?: emptySet(), LocalDate.now().toString(), tag)
            if (accepted) {
                p[starsKey] = (p[starsKey] ?: 0) + amount
                granted = true
            }
            p[dailyClaimsKey] = claims
        }
        return granted
    }

    suspend fun setLanguage(language: String) {
        context.progressDataStore.edit { it[languageKey] = language }
    }

    suspend fun resetStars() {
        context.progressDataStore.edit {
            it[starsKey] = 0
            it[dailyClaimsKey] = emptySet()
        }
    }
}
