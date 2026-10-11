package com.bebetab.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class DailyClaimTest {
    @Test fun `premiere reclamation du jour accordee`() {
        val (kept, granted) = applyDailyClaim(emptySet(), "2026-10-11", "gift")
        assertTrue(granted)
        assertEquals(setOf("2026-10-11|gift"), kept)
    }

    @Test fun `meme cle le meme jour refusee`() {
        val (once, _) = applyDailyClaim(emptySet(), "2026-10-11", "gift")
        val (kept, granted) = applyDailyClaim(once, "2026-10-11", "gift")
        assertFalse(granted)
        assertEquals(once, kept)
    }

    @Test fun `autre cle le meme jour accordee`() {
        val (once, _) = applyDailyClaim(emptySet(), "2026-10-11", "gift")
        val (kept, granted) = applyDailyClaim(once, "2026-10-11", "country:france")
        assertTrue(granted)
        assertEquals(setOf("2026-10-11|gift", "2026-10-11|country:france"), kept)
    }

    @Test fun `le lendemain la meme cle est de nouveau accordee et les anciennes sont purgees`() {
        val (day1, _) = applyDailyClaim(emptySet(), "2026-10-11", "gift")
        val (kept, granted) = applyDailyClaim(day1, "2026-10-12", "gift")
        assertTrue(granted)
        assertEquals(setOf("2026-10-12|gift"), kept)
    }

    @Test fun `une cle contenant le separateur ne peut pas usurper une autre`() {
        val (once, _) = applyDailyClaim(emptySet(), "2026-10-11", "quiz:a")
        val (_, granted) = applyDailyClaim(once, "2026-10-11", "quiz:a|x")
        assertTrue(granted)
    }
}
