package com.bebetab.data

import android.content.Context
import androidx.datastore.preferences.core.booleanPreferencesKey
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.intPreferencesKey
import androidx.datastore.preferences.core.longPreferencesKey
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
    private val musicEnabledKey = booleanPreferencesKey("music_enabled")
    private val childNameKey = stringPreferencesKey("child_name")
    private val usedSecondsKey = intPreferencesKey("used_seconds")
    private val usageDateKey = stringPreferencesKey("usage_date")
    private val codeHashKey = stringPreferencesKey("code_hash")
    private val codeFailuresKey = intPreferencesKey("code_failures")
    private val codeLockoutsKey = intPreferencesKey("code_lockouts")
    private val codeLockedUntilKey = longPreferencesKey("code_locked_until")

    val language: Flow<String> = context.parentDataStore.data.map { prefs -> prefs[languageKey] ?: "fr" }
    val dailyMinutes: Flow<Int> = context.parentDataStore.data.map { prefs -> prefs[dailyMinutesKey] ?: 60 }
    val timerEnabled: Flow<Boolean> = context.parentDataStore.data.map { prefs -> prefs[timerEnabledKey] ?: true }
    val musicEnabled: Flow<Boolean> = context.parentDataStore.data.map { prefs -> prefs[musicEnabledKey] ?: true }
    val childName: Flow<String> = context.parentDataStore.data.map { prefs -> prefs[childNameKey] ?: "Kofi" }
    val usedSeconds: Flow<Int> = context.parentDataStore.data.map { prefs ->
        if (prefs[usageDateKey] == LocalDate.now().toString()) prefs[usedSecondsKey] ?: 0 else 0
    }
    /** Vrai tant que le parent n'a pas choisi son propre code (le code initial est alors actif). */
    val usingDefaultCode: Flow<Boolean> = context.parentDataStore.data.map { prefs -> prefs[codeHashKey] == null }

    suspend fun setLanguage(value: String) { context.parentDataStore.edit { it[languageKey] = value } }
    suspend fun setDailyMinutes(value: Int) { context.parentDataStore.edit { it[dailyMinutesKey] = value.coerceIn(5, 240) } }
    suspend fun setTimerEnabled(value: Boolean) { context.parentDataStore.edit { it[timerEnabledKey] = value } }
    suspend fun setMusicEnabled(value: Boolean) { context.parentDataStore.edit { it[musicEnabledKey] = value } }
    suspend fun setChildName(value: String) { context.parentDataStore.edit { it[childNameKey] = value.trim().take(24) } }

    /**
     * Vérifie le code parent (haché, avec verrouillage progressif après 5 erreurs).
     * L'état des essais est enregistré : fermer et rouvrir l'application ne remet pas les compteurs à zéro.
     */
    suspend fun checkCode(input: String, nowMs: Long = System.currentTimeMillis()): CodeCheck {
        var result: CodeCheck = CodeCheck.Wrong(0)
        context.parentDataStore.edit { prefs ->
            val state = ParentCodeRules.check(
                input = input,
                storedHash = prefs[codeHashKey],
                failures = prefs[codeFailuresKey] ?: 0,
                lockouts = prefs[codeLockoutsKey] ?: 0,
                lockedUntilMs = prefs[codeLockedUntilKey] ?: 0L,
                nowMs = nowMs
            )
            prefs[codeFailuresKey] = state.failures
            prefs[codeLockoutsKey] = state.lockouts
            prefs[codeLockedUntilKey] = state.lockedUntilMs
            result = state.result
        }
        return result
    }

    /** Choisit un nouveau code parent à 4 chiffres. Renvoie false si le format est invalide. */
    suspend fun changeCode(newCode: String): Boolean {
        if (!ParentCodeRules.isValidFormat(newCode)) return false
        val encoded = PinHasher.encode(newCode)
        context.parentDataStore.edit { prefs ->
            prefs[codeHashKey] = encoded
            prefs[codeFailuresKey] = 0
            prefs[codeLockoutsKey] = 0
            prefs[codeLockedUntilKey] = 0L
        }
        return true
    }

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
