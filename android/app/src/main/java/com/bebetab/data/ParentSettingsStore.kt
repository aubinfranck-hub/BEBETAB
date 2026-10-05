package com.bebetab.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.intPreferencesKey
import java.time.LocalDate
import androidx.datastore.preferences.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import androidx.datastore.preferences.core.edit
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

private val Context.parentDataStore by preferencesDataStore(name = "bebetab_parent")

class ParentSettingsStore(private val context: Context) {
    private val languageKey = stringPreferencesKey("language")
    private val dailyMinutesKey = intPreferencesKey("daily_minutes")
    private val timerEnabledKey = booleanPreferencesKey("timer_enabled")
    private val childNameKey = stringPreferencesKey("child_name")
    private val usedSecondsKey = intPreferencesKey("used_seconds")
    private val usageDateKey = stringPreferencesKey("usage_date")

    val language: Flow<String> = context.parentDataStore.data.map { it[languageKey] ?: "fr" }
    val dailyMinutes: Flow<Int> = context.parentDataStore.data.map { it[dailyMinutesKey] ?: 60 }
    val timerEnabled: Flow<Boolean> = context.parentDataStore.data.map { it[timerEnabledKey] ?: true }
    val childName: Flow<String> = context.parentDataStore.data.map { it[childNameKey] ?: "Kofi" }
    val usedSeconds: Flow<Int> = context.parentDataStore.data.map { prefs ->
        val date = prefs[usageDateKey]
        if (date == LocalDate.now().toString()) prefs[usedSecondsKey] ?: 0 else 0
    }

    suspend fun setLanguage(value: String) = context.parentDataStore.edit { it[languageKey] = value }
    suspend fun setDailyMinutes(value: Int) = context.parentDataStore.edit { it[dailyMinutesKey] = value.coerceIn(5, 240) }
    suspend fun setTimerEnabled(value: Boolean) = context.parentDataStore.edit { it[timerEnabledKey] = value }
    suspend fun setChildName(value: String) = context.parentDataStore.edit { it[childNameKey] = value.trim().take(24) }
    suspend fun addUsageSeconds(seconds: Int) = context.parentDataStore.edit { p ->
        val today = LocalDate.now().toString()
        if (p[usageDateKey] != today) { p[usageDateKey] = today; p[usedSecondsKey] = seconds.coerceAtLeast(0) }
        else p[usedSecondsKey] = (p[usedSecondsKey] ?: 0) + seconds.coerceAtLeast(0)
    }
    suspend fun resetUsage() = context.parentDataStore.edit { p -> p[usageDateKey] = LocalDate.now().toString(); p[usedSecondsKey] = 0 }
}