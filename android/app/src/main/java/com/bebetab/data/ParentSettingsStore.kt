package com.bebetab.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import java.time.LocalDate
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

    val language: Flow<String> = context.parentDataStore.data.map { prefs -> prefs[languageKey] ?: "fr" }
    val dailyMinutes: Flow<Int> = context.parentDataStore.data.map { prefs -> prefs[dailyMinutesKey] ?: 60 }
    val timerEnabled: Flow<Boolean> = context.parentDataStore.data.map { prefs -> prefs[timerEnabledKey] ?: true }
    val childName: Flow<String> = context.parentDataStore.data.map { prefs -> prefs[childNameKey] ?: "Kofi" }
    val usedSeconds: Flow<Int> = context.parentDataStore.data.map { prefs ->
        if (prefs[usageDateKey] == LocalDate.now().toString()) prefs[usedSecondsKey] ?: 0 else 0
    }

    suspend fun setLanguage(value: String) { context.parentDataStore.edit { it[languageKey] = value } }
    suspend fun setDailyMinutes(value: Int) { context.parentDataStore.edit { it[dailyMinutesKey] = value.coerceIn(5, 240) } }
    suspend fun setTimerEnabled(value: Boolean) { context.parentDataStore.edit { it[timerEnabledKey] = value } }
    suspend fun setChildName(value: String) { context.parentDataStore.edit { it[childNameKey] = value.trim().take(24) } }

    suspend fun addUsageSeconds(seconds: Int) {
        context.parentDataStore.edit { prefs ->
            val today = LocalDate.now().toString()
            val amount = seconds.coerceAtLeast(0)
            if (prefs[usageDateKey] != today) {
                prefs[usageDateKey] = today
                prefs[usedSecondsKey] = amount
            } else {
                prefs[usedSecondsKey] = (prefs[usedSecondsKey] ?: 0) + amount
            }
        }
    }

    suspend fun resetUsage() {
        context.parentDataStore.edit { prefs ->
            prefs[usageDateKey] = LocalDate.now().toString()
            prefs[usedSecondsKey] = 0
        }
    }
}