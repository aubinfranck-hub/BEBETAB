package com.bebetab.audio

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack

/** Joue les notes du clavier musical (vraies fréquences Do-Ré-Mi…, et non des tonalités de téléphone). */
class NotePlayer {
    private val tracks = HashMap<Int, AudioTrack>()

    fun play(noteIndex: Int) {
        val frequency = NoteSynth.SCALE_HZ.getOrNull(noteIndex) ?: return
        val track = tracks.getOrPut(noteIndex) { buildTrack(NoteSynth.render(frequency)) }
        try {
            track.stop()
            track.reloadStaticData()
            track.play()
        } catch (e: IllegalStateException) {
            tracks.remove(noteIndex)?.release()
        }
    }

    fun release() {
        tracks.values.forEach { it.release() }
        tracks.clear()
    }

    private fun buildTrack(data: ShortArray): AudioTrack =
        AudioTrack.Builder()
            .setAudioAttributes(
                AudioAttributes.Builder()
                    .setUsage(AudioAttributes.USAGE_GAME)
                    .setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                    .build()
            )
            .setAudioFormat(
                AudioFormat.Builder()
                    .setSampleRate(NoteSynth.SAMPLE_RATE)
                    .setEncoding(AudioFormat.ENCODING_PCM_16BIT)
                    .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
                    .build()
            )
            .setBufferSizeInBytes(data.size * 2)
            .setTransferMode(AudioTrack.MODE_STATIC)
            .build()
            .also { it.write(data, 0, data.size) }
}
