package com.bebetab.data
import android.content.Context
import androidx.datastore.preferences.core.*
import androidx.datastore.preferences.preferencesDataStore
import java.time.LocalDate
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map
private val Context.parentDataStore by preferencesDataStore(name="bebetab_parent")
class ParentSettingsStore(private val context:Context){
 private val languageKey=stringPreferencesKey("language")
 private val dailyMinutesKey=intPreferencesKey("daily_minutes")
 private val timerEnabledKey=booleanPreferencesKey("timer_enabled")
 private val childNameKey=stringPreferencesKey("child_name")
 private val usedSecondsKey=intPreferencesKey("used_seconds")
 private val usageDateKey=stringPreferencesKey("usage_date")
 val language:Flow<String>=context.parentDataStore.data.map{it[languageKey]?:"fr"}
 val dailyMinutes:Flow<Int>=context.parentDataStore.data.map{it[dailyMinutesKey]?:60}
 val timerEnabled:Flow<Boolean>=context.parentDataStore.data.map{it[timerEnabledKey]?:true}
 val childName:Flow<String>=context.parentDataStore.data.map{it[childNameKey]?:"Kofi"}
 val usedSeconds:Flow<Int>=context.parentDataStore.data.map{p->if(p[usageDateKey]==LocalDate.now().toString())p[usedSecondsKey]?:0 else 0}
 suspend fun setLanguage(v:String)=context.parentDataStore.edit{it[languageKey]=v}
 suspend fun setDailyMinutes(v:Int)=context.parentDataStore.edit{it[dailyMinutesKey]=v.coerceIn(5,240)}
 suspend fun setTimerEnabled(v:Boolean)=context.parentDataStore.edit{it[timerEnabledKey]=v}
 suspend fun setChildName(v:String)=context.parentDataStore.edit{it[childNameKey]=v.trim().take(24)}
 suspend fun addUsageSeconds(s:Int)=context.parentDataStore.edit{p->val d=LocalDate.now().toString();if(p[usageDateKey]!=d){p[usageDateKey]=d;p[usedSecondsKey]=s.coerceAtLeast(0)}else p[usedSecondsKey]=(p[usedSecondsKey]?:0)+s.coerceAtLeast(0)}
 suspend fun resetUsage()=context.parentDataStore.edit{p->p[usageDateKey]=LocalDate.now().toString();p[usedSecondsKey]=0}
}