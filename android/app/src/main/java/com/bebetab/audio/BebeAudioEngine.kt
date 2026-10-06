package com.bebetab.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioManager
import android.media.AudioTrack
import android.media.ToneGenerator
import kotlinx.coroutines.*

object BebeAudioEngine {
    private var music: AudioTrack? = null
    private var musicJob: Job? = null
    private var clickTone: ToneGenerator? = null

    fun startMusic() {
        if (musicJob?.isActive == true) return
        val sampleRate = 22050
        val durationSec = 16
        val samples = sampleRate * durationSec
        val data = ShortArray(samples)
        val notes = intArrayOf(262,294,330,392,330,294,262,330,392,440,392,330,294,330,262,0)
        val noteSamples = sampleRate / 2
        for (i in data.indices) {
            val noteIndex = (i / noteSamples) % notes.size
            val freq = notes[noteIndex]
            if (freq > 0) {
                val t = i.toDouble() / sampleRate
                val local = (i % noteSamples).toDouble() / noteSamples
                val attack = (local / 0.08).coerceAtMost(1.0)
                val release = ((1.0 - local) / 0.12).coerceAtMost(1.0)
                val envelope = minOf(attack, release)
                val value = kotlin.math.sin(2.0 * Math.PI * freq * t) * envelope * 0.10
                data[i] = (value * Short.MAX_VALUE).toInt().toShort()
            }
        }
        val bufferSize = AudioTrack.getMinBufferSize(
            sampleRate,
            AudioFormat.CHANNEL_OUT_MONO,
            AudioFormat.ENCODING_PCM_16BIT
        )
        music = AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_GAME)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setSampleRate(sampleRate)
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .build()
            )
            .setBufferSizeInBytes(maxOf(bufferSize, data.size * 2))
            .setTransferMode(AudioTrack.MODE_STATIC)
            .build()
            .also {
                it.write(data, 0, data.size)
                it.setLoopPoints(0, data.size, -1)
                it.setVolume(0.20f)
                it.play()
            }
        musicJob = CoroutineScope(SupervisorJob() + Dispatchers.Main.immediate).launch {
            awaitCancellation()
        }
    }

    fun stopMusic() {
        musicJob?.cancel()
        musicJob = null
        music?.stop()
        music?.release()
        music = null
    }

    fun click() {
        if (clickTone == null) clickTone = ToneGenerator(AudioManager.STREAM_MUSIC, 55)
        clickTone?.startTone(ToneGenerator.TONE_PROP_BEEP, 70)
    }

    fun success() {
        if (clickTone == null) clickTone = ToneGenerator(AudioManager.STREAM_MUSIC, 60)
        clickTone?.startTone(ToneGenerator.TONE_PROP_ACK, 100)
    }

    fun release() {
        stopMusic()
        clickTone?.release()
        clickTone = null
    }
}
