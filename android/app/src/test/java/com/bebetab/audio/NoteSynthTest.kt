package com.bebetab.audio

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import kotlin.math.abs

class NoteSynthTest {
    /** Estime la fréquence en comptant les passages par zéro. */
    private fun estimateHz(samples: ShortArray, sampleRate: Int): Double {
        var crossings = 0
        for (i in 1 until samples.size) if (samples[i - 1] < 0 && samples[i] >= 0) crossings++
        return crossings * sampleRate.toDouble() / samples.size
    }

    @Test fun `chaque note de la gamme a la bonne frequence`() {
        for (hz in NoteSynth.SCALE_HZ) {
            val estimated = estimateHz(NoteSynth.render(hz, 1000), NoteSynth.SAMPLE_RATE)
            assertTrue("attendu $hz, mesuré $estimated", abs(estimated - hz) / hz < 0.02)
        }
    }

    @Test fun `la gamme est croissante et le la vaut 440 Hz`() {
        val s = NoteSynth.SCALE_HZ
        for (i in 1 until s.size) assertTrue(s[i] > s[i - 1])
        assertEquals(440.0, s[5], 0.001)
        assertEquals(s[0] * 2, s[7], 0.5)
    }

    @Test fun `pas de clic au debut ni a la fin et pas de saturation`() {
        val data = NoteSynth.render(440.0, 500)
        assertEquals(NoteSynth.SAMPLE_RATE / 2, data.size)
        assertTrue(abs(data.first().toInt()) < 500)
        assertTrue(abs(data.last().toInt()) < 500)
        assertTrue(data.all { abs(it.toInt()) < Short.MAX_VALUE })
        assertTrue("le son ne doit pas être muet", data.any { abs(it.toInt()) > 5000 })
    }
}
