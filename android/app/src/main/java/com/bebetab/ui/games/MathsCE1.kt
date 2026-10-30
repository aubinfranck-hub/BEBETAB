package com.bebetab.ui.games

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlin.random.Random

/** Maths CE1 — exercices 100 % originaux générés aléatoirement (programme CE1 / 2nd grade). */
private enum class Topic(val emoji: String, val fr: String, val en: String, val color: Long) {
    COUNT("🔢", "Nombres jusqu’à 100", "Numbers to 100", 0xFFFF6D3D),
    ADD("➕", "Additions", "Addition", 0xFF21B573),
    SUB("➖", "Soustractions", "Subtraction", 0xFF26A9E0),
    TABLES("✖️", "Tables ×2 ×5 ×10", "Times tables ×2 ×5 ×10", 0xFF9C27B0),
    COMPARE("⚖️", "Comparer", "Compare", 0xFFFFA726),
    PROBLEM("📖", "Petits problèmes", "Word problems", 0xFFE91E63),
    SHAPES("🔺", "Formes et mesures", "Shapes & measures", 0xFF6350D9)
}

private fun q(p: String, ans: Int, r: Random, spread: Int = 5): QuizQuestion {
    val set = linkedSetOf(ans)
    var guard = 0
    while (set.size < 3 && guard++ < 50) {
        val c = ans + r.nextInt(-spread, spread + 1)
        if (c >= 0) set.add(c)
    }
    var extra = 1
    while (set.size < 3) set.add(ans + extra++)
    return QuizQuestion(p, set.shuffled(r).map { it.toString() }, ans.toString())
}

private fun qs(p: String, ans: String, wrong: List<String>, r: Random) =
    QuizQuestion(p, (listOf(ans) + wrong.filter { it != ans }.take(2)).shuffled(r), ans)

private fun build(topic: Topic, en: Boolean, r: Random): List<QuizQuestion> = List(8) {
    when (topic) {
        Topic.COUNT -> when (r.nextInt(3)) {
            0 -> { val d = r.nextInt(1, 10); val u = r.nextInt(0, 10)
                q(if (en) "$d tens and $u ones = ?" else "$d dizaines et $u unités = ?", d * 10 + u, r, 10) }
            1 -> { val n = r.nextInt(1, 98)
                q(if (en) "Which number comes after $n?" else "Quel nombre vient après $n ?", n + 1, r, 2) }
            else -> { val n = r.nextInt(12, 100)
                q(if (en) "How many tens in $n?" else "Combien de dizaines dans $n ?", n / 10, r, 3) }
        }
        Topic.ADD -> if (r.nextBoolean()) { val a = r.nextInt(2, 10); val b = r.nextInt(2, 10); q("$a + $b = ?", a + b, r, 3) }
            else { val a = r.nextInt(11, 60); val b = r.nextInt(5, 35); q("$a + $b = ?", a + b, r, 10) }
        Topic.SUB -> if (r.nextBoolean()) { val a = r.nextInt(8, 20); val b = r.nextInt(2, a); q("$a − $b = ?", a - b, r, 3) }
            else { val a = r.nextInt(30, 100); val b = r.nextInt(5, 30); q("$a − $b = ?", a - b, r, 10) }
        Topic.TABLES -> { val t = listOf(2, 5, 10).random(r); val n = r.nextInt(1, 11); q("$t × $n = ?", t * n, r, t.coerceAtLeast(3)) }
        Topic.COMPARE -> { val a = r.nextInt(10, 100); var b = r.nextInt(10, 100); if (b == a) b++
            val bigger = r.nextBoolean()
            qs(if (en) "Which is ${if (bigger) "bigger" else "smaller"}?" else "Lequel est le plus ${if (bigger) "grand" else "petit"} ?",
                (if (bigger) maxOf(a, b) else minOf(a, b)).toString(), listOf(a.toString(), b.toString()) + (a + b).toString(), r) }
        Topic.PROBLEM -> when (r.nextInt(3)) {
            0 -> { val a = r.nextInt(5, 30); val b = r.nextInt(3, 20)
                q(if (en) "Lila has $a 🍎. She gets $b more. How many 🍎 now?" else "Lila a $a 🍎. Elle en reçoit $b de plus. Combien de 🍎 maintenant ?", a + b, r, 4) }
            1 -> { val a = r.nextInt(15, 40); val b = r.nextInt(3, 15)
                q(if (en) "There are $a 🐟. $b swim away. How many are left?" else "Il y a $a 🐟. $b s’en vont. Combien en reste-t-il ?", a - b, r, 4) }
            else -> { val n = r.nextInt(2, 8)
                q(if (en) "$n boxes with 5 ⭐ each. How many ⭐ in all?" else "$n boîtes avec 5 ⭐ chacune. Combien de ⭐ en tout ?", n * 5, r, 5) }
        }
        Topic.SHAPES -> when (r.nextInt(4)) {
            0 -> qs(if (en) "How many sides has a triangle?" else "Combien de côtés a un triangle ?", "3", listOf("4", "5"), r)
            1 -> qs(if (en) "How many corners has a square?" else "Combien de sommets a un carré ?", "4", listOf("3", "6"), r)
            2 -> qs(if (en) "1 meter = ? centimeters" else "1 mètre = ? centimètres", "100", listOf("10", "1000"), r)
            else -> qs(if (en) "How many minutes in 1 hour?" else "Combien de minutes dans 1 heure ?", "60", listOf("30", "100"), r)
        }
    }
}

@Composable
fun MathsCE1(onStars: (Int) -> Unit, language: String = "fr") {
    val en = language == "en"
    var topic by remember { mutableStateOf<Topic?>(null) }
    val t = topic
    if (t == null) {
        Column(
            Modifier.fillMaxSize().verticalScroll(rememberScrollState()).padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            Text(if (en) "Maths 2nd grade (CE1)" else "Maths CE1", fontSize = 28.sp, fontWeight = FontWeight.Black)
            Text(if (en) "Pick a topic — 8 questions, ⭐ for each right answer" else "Choisis un thème — 8 questions, ⭐ à chaque bonne réponse",
                fontSize = 15.sp, textAlign = TextAlign.Center)
            Topic.values().toList().chunked(4).forEach { rowItems ->
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    rowItems.forEach { tp ->
                        Button(onClick = { topic = tp }, shape = RoundedCornerShape(18.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(tp.color)),
                            modifier = Modifier.weight(1f).height(84.dp)) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text(tp.emoji, fontSize = 26.sp)
                                Text(if (en) tp.en else tp.fr, fontSize = 13.sp, textAlign = TextAlign.Center)
                            }
                        }
                    }
                    repeat(4 - rowItems.size) { Spacer(Modifier.weight(1f)) }
                }
            }
        }
    } else {
        var round by remember(t) { mutableIntStateOf(0) }
        val questions = remember(t, round) { build(t, en, Random(System.nanoTime())) }
        var index by remember(t, round) { mutableIntStateOf(0) }
        var score by remember(t, round) { mutableIntStateOf(0) }
        var feedback by remember(t, round, index) { mutableStateOf<String?>(null) }
        Column(Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(14.dp)) {
            Text("${t.emoji} " + (if (en) t.en else t.fr), fontSize = 22.sp, fontWeight = FontWeight.Black)
            if (index >= questions.size) {
                Text(if (en) "Finished! $score / ${questions.size} ⭐" else "Terminé ! $score / ${questions.size} ⭐", fontSize = 28.sp, fontWeight = FontWeight.Black)
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Button(onClick = { round++ }) { Text(if (en) "Play again" else "Rejouer") }
                    OutlinedButton(onClick = { topic = null }) { Text(if (en) "Other topics" else "Autres thèmes") }
                }
            } else {
                val cur = questions[index]
                Text("${index + 1} / ${questions.size}", fontSize = 14.sp)
                Text(cur.prompt, fontSize = 28.sp, fontWeight = FontWeight.Bold, textAlign = TextAlign.Center)
                Row(horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                    cur.choices.forEach { c ->
                        Button(enabled = feedback == null, shape = RoundedCornerShape(16.dp), onClick = {
                            if (c == cur.answer) { score++; onStars(2); feedback = if (en) "Great job! ⭐ +2" else "Bravo ! ⭐ +2" }
                            else feedback = (if (en) "Answer: " else "Réponse : ") + cur.answer
                        }) { Text(c, fontSize = 24.sp) }
                    }
                }
                feedback?.let {
                    Text(it, fontSize = 20.sp, fontWeight = FontWeight.Bold)
                    Button(onClick = { index++ }) { Text(if (en) "Next" else "Suivant") }
                }
            }
        }
    }
}
