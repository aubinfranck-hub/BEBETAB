package com.bebetab.ui.games

import com.bebetab.data.ContentData
import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class QuizContentTest {
    private fun check(label: String, q: QuizQuestion) {
        assertTrue("$label : énoncé vide", q.prompt.isNotBlank())
        assertTrue("$label : au moins 2 choix", q.choices.size >= 2)
        assertEquals("$label : choix en double ${q.choices}", q.choices.size, q.choices.toSet().size)
        assertTrue("$label : la réponse « ${q.answer} » n'est pas dans ${q.choices}", q.answer in q.choices)
        assertTrue("$label : un choix est vide", q.choices.none { it.isBlank() })
    }

    @Test fun `chaque activite a 3 questions valides dans les deux langues`() {
        assertTrue(allMiniActivities.isNotEmpty())
        for ((id, activity) in allMiniActivities) {
            assertEquals("$id : 3 questions", 3, activity.questions.size)
            assertTrue("$id : titre FR", activity.titleFr.isNotBlank())
            assertTrue("$id : titre EN", activity.titleEn.isNotBlank())
            activity.questions.forEachIndexed { i, q ->
                check("$id[$i] FR", q.fr)
                check("$id[$i] EN", q.en)
            }
        }
    }

    @Test fun `quiz lettres et nombres valides`() {
        assertEquals(3, letterQuestions.size)
        assertEquals(3, numberQuestions.size)
        (letterQuestions + numberQuestions).forEachIndexed { i, q ->
            check("lettres/nombres[$i] FR", q.fr)
            check("lettres/nombres[$i] EN", q.en)
        }
    }

    @Test fun `la version anglaise est vraiment traduite pour les questions de texte`() {
        // Les exercices d'anglais, calculs et suites sont volontairement identiques dans les deux langues.
        val sameOnPurpose = setOf("english", "math")
        for ((id, activity) in allMiniActivities) {
            if (id in sameOnPurpose) continue
            val untranslated = activity.questions.filter { it.fr.prompt == it.en.prompt && it.fr.prompt.any { c -> c.isLetter() } }
            // Seules les suites symboliques (ex. « 2, 4, 6, _ » ou « 🔴 🔵 🔴 🔵 _ ») peuvent rester identiques.
            assertTrue("$id : énoncé non traduit ${untranslated.map { it.fr.prompt }}", untranslated.all { q -> q.fr.prompt.count { it.isLetter() } == 0 })
        }
    }

    @Test fun `chaque matiere et chaque jeu de l'ecran a un contenu`() {
        // Écrans spéciaux gérés ailleurs : lettres/nombres (QuizGames), art (dessin), mémoire (MemoryGame).
        val special = setOf("letters", "numbers", "art", "memory")
        for (item in ContentData.subjects + ContentData.games) {
            if (item.id in special) continue
            assertTrue("l'activité « ${item.id} » n'a aucune question", item.id in allMiniActivities)
        }
    }

    @Test fun `les textes des questions ne contiennent pas d'espace insecable parasite en fin de ligne`() {
        for ((id, activity) in allMiniActivities) activity.questions.forEach { q ->
            assertEquals("$id FR", q.fr.prompt, q.fr.prompt.trim())
            assertEquals("$id EN", q.en.prompt, q.en.prompt.trim())
        }
    }
}
