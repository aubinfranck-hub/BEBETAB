package com.bebetab.data

import android.content.Context
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.datastore.preferences.core.edit
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.progressDataStore by preferencesDataStore(name = "bebetab_progress")

class ProgressStore(private val context: Context) {
    private val starsKey = intPreferencesKey("stars")
    private val languageKey = stringPreferencesKey("language")

    val stars: Flow<Int> = context.progressDataStore.data.map { it[starsKey] ?: 2450 }
    val language: Flow<String> = context.progressDataStore.data.map { it[languageKey] ?: "fr" }

    suspend fun addStars(amount: Int) {
        context.progressDataStore.edit { p -> p[starsKey] = (p[starsKey] ?: 0) + amount }
    }

    suspend fun setLanguage(language: String) {
        context.progressDataStore.edit { it[languageKey] = language }
    }

    suspend fun resetStars() {
        context.progressDataStore.edit { it[starsKey] = 0 }
    }
}
