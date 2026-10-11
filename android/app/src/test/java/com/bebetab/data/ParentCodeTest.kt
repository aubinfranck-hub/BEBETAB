package com.bebetab.data

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ParentCodeTest {
    private val t0 = 1_000_000L

    @Test fun `le code initial fonctionne tant qu'aucun code n'est choisi`() {
        val s = ParentCodeRules.check("2580", null, 0, 0, 0L, t0)
        assertEquals(CodeCheck.Ok, s.result)
    }

    @Test fun `un mauvais code indique les essais restants`() {
        val s = ParentCodeRules.check("0000", null, 0, 0, 0L, t0)
        assertEquals(CodeCheck.Wrong(4), s.result)
        assertEquals(1, s.failures)
    }

    @Test fun `la cinquieme erreur verrouille une minute`() {
        var failures = 0
        var state = ParentCodeRules.check("1111", null, failures, 0, 0L, t0)
        repeat(3) {
            failures = state.failures
            state = ParentCodeRules.check("1111", null, failures, 0, 0L, t0)
        }
        assertEquals(CodeCheck.Wrong(1), state.result)
        val last = ParentCodeRules.check("1111", null, state.failures, 0, 0L, t0)
        assertEquals(CodeCheck.Locked(60), last.result)
        assertEquals(t0 + 60_000L, last.lockedUntilMs)
        assertEquals(1, last.lockouts)
    }

    @Test fun `pendant le verrouillage meme le bon code est refuse`() {
        val s = ParentCodeRules.check("2580", null, 0, 1, t0 + 30_000L, t0)
        assertEquals(CodeCheck.Locked(30), s.result)
    }

    @Test fun `apres le verrouillage le bon code fonctionne et remet tout a zero`() {
        val s = ParentCodeRules.check("2580", null, 0, 2, t0 - 1, t0)
        assertEquals(CodeCheck.Ok, s.result)
        assertEquals(0, s.failures)
        assertEquals(0, s.lockouts)
    }

    @Test fun `les verrouillages successifs doublent puis plafonnent a 15 minutes`() {
        val durations = (0..6).map {
            ParentCodeRules.check("9999", null, ParentCodeRules.MAX_FAILURES - 1, it, 0L, t0).result as CodeCheck.Locked
        }.map { it.seconds }
        assertEquals(listOf(60, 120, 240, 480, 900, 900, 900), durations)
    }

    @Test fun `un code choisi par le parent est stocke hache et remplace le code initial`() {
        val stored = PinHasher.encode("4711")
        assertFalse("le code ne doit jamais apparaitre en clair", stored.contains("4711"))
        assertEquals(CodeCheck.Ok, ParentCodeRules.check("4711", stored, 0, 0, 0L, t0).result)
        assertTrue(ParentCodeRules.check("2580", stored, 0, 0, 0L, t0).result is CodeCheck.Wrong)
    }

    @Test fun `deux hachages du meme code different grace au sel`() {
        assertNotEquals(PinHasher.encode("4711"), PinHasher.encode("4711"))
        assertTrue(PinHasher.matches("4711", PinHasher.encode("4711")))
        assertFalse(PinHasher.matches("4712", PinHasher.encode("4711")))
    }

    @Test fun `une valeur stockee corrompue est refusee sans planter`() {
        assertFalse(PinHasher.matches("4711", "n'importe quoi"))
        assertFalse(PinHasher.matches("4711", "!!!:???"))
    }

    @Test fun `format du code`() {
        assertTrue(ParentCodeRules.isValidFormat("0042"))
        assertFalse(ParentCodeRules.isValidFormat("123"))
        assertFalse(ParentCodeRules.isValidFormat("12345"))
        assertFalse(ParentCodeRules.isValidFormat("12a4"))
    }
}
