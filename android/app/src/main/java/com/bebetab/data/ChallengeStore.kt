package com.bebetab.data

import android.content.Context
import androidx.datastore.preferences.preferencesDataStore
import androidx.datastore.preferences.core.*
import kotlinx.coroutines.flow.map
import java.time.LocalDate

private val Context.missionDataStore by preferencesDataStore(name="bebetab_missions")
data class MissionState(val pending:String="",val baseline:Int=0,val claimed:Set<String> = emptySet())
class ChallengeStore(private val context:Context){
    private val day=stringPreferencesKey("day")
    private val pending=stringPreferencesKey("pending")
    private val baseline=intPreferencesKey("baseline")
    private val claimed=stringSetPreferencesKey("claimed")
    val state=context.missionDataStore.data.map{p->if(p[day]!=LocalDate.now().toString())MissionState()else MissionState(p[pending]?:"",p[baseline]?:0,p[claimed]?:emptySet())}
    suspend fun begin(route:String,stars:Int){context.missionDataStore.edit{p->
        if(p[day]!=LocalDate.now().toString()){p.clear();p[day]=LocalDate.now().toString()}
        p[pending]=route;p[baseline]=stars
    }}
    suspend fun claim(route:String):Boolean{
        var awarded=false
        context.missionDataStore.edit{p->
        if(p[day]==LocalDate.now().toString() && p[pending]==route){p[claimed]=(p[claimed]?:emptySet())+route;p[pending]="";awarded=true}
        }
        return awarded
    }
}
