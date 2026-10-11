package com.bebetab.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Button
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.bebetab.data.CodeCheck
import com.bebetab.data.ParentSettingsStore
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

/**
 * Saisie du code parent, partagée par tous les écrans qui demandent une autorisation
 * (réglages, fin du temps d'écran, ouverture d'un lien externe).
 * Le code est vérifié par [ParentSettingsStore.checkCode] : haché, avec verrouillage progressif.
 */
@Composable
fun ParentCodeEntry(language: String, confirmLabel: String, onVerified: () -> Unit) {
    val en = language == "en"
    val context = LocalContext.current
    val store = remember { ParentSettingsStore(context) }
    val scope = rememberCoroutineScope()

    var code by remember { mutableStateOf("") }
    var attemptsLeft by remember { mutableStateOf<Int?>(null) }
    var lockedUntil by remember { mutableLongStateOf(0L) }
    var now by remember { mutableLongStateOf(System.currentTimeMillis()) }
    var busy by remember { mutableStateOf(false) }

    val secondsLeft = ((lockedUntil - now + 999) / 1000).toInt().coerceAtLeast(0)

    // Compte à rebours affiché pendant le verrouillage.
    LaunchedEffect(lockedUntil) {
        while (lockedUntil > System.currentTimeMillis()) {
            now = System.currentTimeMillis()
            delay(500)
        }
        now = System.currentTimeMillis()
    }

    fun submit() {
        if (busy || secondsLeft > 0 || code.length != 4) return
        busy = true
        val attempt = code
        scope.launch {
            when (val result = store.checkCode(attempt)) {
                CodeCheck.Ok -> {
                    busy = false
                    attemptsLeft = null
                    onVerified()
                }
                is CodeCheck.Wrong -> {
                    attemptsLeft = result.attemptsLeft
                    code = ""
                    busy = false
                }
                is CodeCheck.Locked -> {
                    attemptsLeft = null
                    code = ""
                    now = System.currentTimeMillis()
                    lockedUntil = now + result.seconds * 1000L
                    busy = false
                }
            }
        }
    }

    Column(verticalArrangement = Arrangement.spacedBy(10.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        OutlinedTextField(
            value = code,
            onValueChange = { code = it.filter(Char::isDigit).take(4) },
            label = { Text(if (en) "Parent code" else "Code parent") },
            singleLine = true,
            enabled = secondsLeft == 0,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.NumberPassword),
            keyboardActions = KeyboardActions(onDone = { submit() })
        )
        when {
            secondsLeft > 0 -> Text(
                if (en) "Too many mistakes. Try again in $secondsLeft s."
                else "Trop d'erreurs. Réessaie dans $secondsLeft s.",
                color = MaterialTheme.colorScheme.error
            )
            attemptsLeft != null -> Text(
                if (en) "Wrong code. $attemptsLeft attempt(s) left."
                else "Code incorrect. Il reste $attemptsLeft essai(s).",
                color = MaterialTheme.colorScheme.error
            )
        }
        Button(onClick = { submit() }, enabled = !busy && secondsLeft == 0 && code.length == 4) {
            Text(confirmLabel)
        }
    }
}
