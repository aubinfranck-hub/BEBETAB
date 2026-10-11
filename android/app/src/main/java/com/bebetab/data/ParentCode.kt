package com.bebetab.data

import java.security.MessageDigest
import java.security.SecureRandom
import java.util.Base64
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import kotlin.math.ceil

/** Résultat d'une vérification du code parent. */
sealed interface CodeCheck {
    data object Ok : CodeCheck
    data class Wrong(val attemptsLeft: Int) : CodeCheck
    data class Locked(val seconds: Int) : CodeCheck
}

/** Hachage du code parent (PBKDF2 + sel aléatoire) : le code n'est jamais stocké en clair. */
object PinHasher {
    private const val ITERATIONS = 60_000
    private const val KEY_BITS = 256

    private fun derive(code: String, salt: ByteArray): ByteArray =
        SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256")
            .generateSecret(PBEKeySpec(code.toCharArray(), salt, ITERATIONS, KEY_BITS))
            .encoded

    fun encode(code: String, salt: ByteArray = ByteArray(16).also { SecureRandom().nextBytes(it) }): String {
        val b64 = Base64.getEncoder()
        return b64.encodeToString(salt) + ":" + b64.encodeToString(derive(code, salt))
    }

    fun matches(code: String, stored: String): Boolean {
        val parts = stored.split(":")
        if (parts.size != 2) return false
        return try {
            val b64 = Base64.getDecoder()
            MessageDigest.isEqual(derive(code, b64.decode(parts[0])), b64.decode(parts[1]))
        } catch (e: IllegalArgumentException) {
            false
        }
    }
}

/**
 * Règles du code parent, sans accès au stockage (testables sur JVM) :
 * 5 erreurs de suite verrouillent la saisie 1 minute, puis 2, 4, 8 et 15 minutes au maximum.
 */
object ParentCodeRules {
    /** Code initial tant que le parent n'en a pas choisi un autre (voir « Changer le code parent »). */
    const val DEFAULT_CODE = "2580"
    const val MAX_FAILURES = 5
    private const val BASE_LOCK_MS = 60_000L
    private const val MAX_LOCK_MS = 15 * 60_000L

    data class State(val failures: Int, val lockouts: Int, val lockedUntilMs: Long, val result: CodeCheck)

    fun isValidFormat(code: String) = code.length == 4 && code.all { it.isDigit() }

    fun check(
        input: String,
        storedHash: String?,
        failures: Int,
        lockouts: Int,
        lockedUntilMs: Long,
        nowMs: Long
    ): State {
        if (lockedUntilMs > nowMs) {
            val seconds = ceil((lockedUntilMs - nowMs) / 1000.0).toInt()
            return State(failures, lockouts, lockedUntilMs, CodeCheck.Locked(seconds))
        }
        val ok = if (storedHash == null) {
            MessageDigest.isEqual(input.toByteArray(), DEFAULT_CODE.toByteArray())
        } else {
            PinHasher.matches(input, storedHash)
        }
        if (ok) return State(0, 0, 0L, CodeCheck.Ok)

        val count = failures + 1
        if (count >= MAX_FAILURES) {
            val lockMs = minOf(MAX_LOCK_MS, BASE_LOCK_MS shl lockouts.coerceIn(0, 4))
            return State(0, lockouts + 1, nowMs + lockMs, CodeCheck.Locked((lockMs / 1000).toInt()))
        }
        return State(count, lockouts, 0L, CodeCheck.Wrong(MAX_FAILURES - count))
    }
}
