package com.bebetab.audio

import kotlin.math.PI
import kotlin.math.exp
import kotlin.math.sin

/** Génération de notes de musique : calcul pur, sans dépendance Android (donc testable sur JVM). */
object NoteSynth {
    const val SAMPLE_RATE = 22050

    /** Gamme de Do : Do4, Ré, Mi, Fa, Sol, La, Si, Do5 (fréquences en Hz). */
    val SCALE_HZ = doubleArrayOf(261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88, 523.25)

    /** Une note douce (fondamentale + 2 harmoniques atténuées), avec attaque et extinction pour éviter les « clics ». */
    fun render(frequencyHz: Double, millis: Int = 500, sampleRate: Int = SAMPLE_RATE): ShortArray {
        val total = sampleRate * millis / 1000
        val out = ShortArray(total)
        val attack = (sampleRate * 0.01).toInt().coerceAtLeast(1)
        val release = (sampleRate * 0.15).toInt().coerceAtMost(total / 2).coerceAtLeast(1)
        for (i in 0 until total) {
            val t = i.toDouble() / sampleRate
            val wave = sin(2 * PI * frequencyHz * t) +
                0.35 * sin(2 * PI * 2 * frequencyHz * t) +
                0.12 * sin(2 * PI * 3 * frequencyHz * t)
            val envelope = minOf(1.0, i / attack.toDouble(), (total - i) / release.toDouble()) * (0.6 + 0.4 * exp(-3.0 * t))
            out[i] = (wave / 1.47 * envelope * 0.8 * Short.MAX_VALUE).toInt().toShort()
        }
        return out
    }
}
