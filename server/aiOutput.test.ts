import assert from "node:assert/strict";
import test from "node:test";
import { sanitizeChatReply, sanitizeQuiz, sanitizeStory } from "./aiOutput";

test("sanitizeChatReply : humeur et couleur inconnues retombent sur des valeurs sûres", () => {
  const r = sanitizeChatReply({ text: "Salut !", mood: "evil", color: "url(javascript:1)" });
  assert.equal(r.mood, "happy");
  assert.equal(r.color, "#3B82F6");
  assert.equal(r.text, "Salut !");
});

test("sanitizeChatReply : conserve les valeurs valides, borne et nettoie le texte", () => {
  const r = sanitizeChatReply({ text: "a\u0000b".repeat(400), mood: "proud", color: "#10B981", voiceAdvice: "doucement" });
  assert.equal(r.mood, "proud");
  assert.equal(r.color, "#10B981");
  assert.ok(r.text.length <= 600);
  assert.ok(!r.text.includes("\u0000"));
  assert.equal(sanitizeChatReply(null).text, "Youpi ! Fanti t'écoute !");
});

test("sanitizeStory : valide, renumérote les scènes et borne les choix", () => {
  const s = sanitizeStory({
    title: "Le voyage",
    intro: "Il était une fois",
    scenes: [
      { sceneNumber: 9, text: "Scène A", choices: ["1", "2", "3", "4", "", 5], illustrationPrompt: "forest" },
      { text: "" },
      { sceneNumber: 3, text: "Scène B", choices: "pas un tableau" },
    ],
    moral: "Être gentil",
  });
  assert.ok(s);
  assert.deepEqual(s!.scenes.map((x) => x.sceneNumber), [1, 2]);
  assert.deepEqual(s!.scenes[0].choices, ["1", "2", "3"]);
  assert.deepEqual(s!.scenes[1].choices, []);
});

test("sanitizeStory : renvoie null sans titre ou sans scène exploitable", () => {
  assert.equal(sanitizeStory({ title: "", scenes: [{ text: "x" }] }), null);
  assert.equal(sanitizeStory({ title: "t", scenes: [] }), null);
  assert.equal(sanitizeStory({ title: "t", scenes: [{ text: "   " }] }), null);
  assert.equal(sanitizeStory(undefined), null);
});

test("sanitizeQuiz : écarte les questions invalides et renumérote", () => {
  const q = sanitizeQuiz({
    questions: [
      { question: "2+2 ?", options: ["3", "4", "5"], correctIndex: 1, explanation: "Bravo" },
      { question: "Hors limites", options: ["a", "b", "c"], correctIndex: 7 },
      { question: "Une seule option", options: ["a"], correctIndex: 0 },
      { question: "Index texte", options: ["a", "b", "c"], correctIndex: "1" },
      { question: "Trop d'options", options: ["a", "b", "c", "d", "e"], correctIndex: 0 },
      { question: "Rouge ?", options: ["Rouge", "Bleu", "Vert"], correctIndex: 0 },
    ],
  });
  assert.ok(q);
  assert.deepEqual(q!.questions.map((x) => x.id), [1, 2]);
  assert.deepEqual(q!.questions.map((x) => x.question), ["2+2 ?", "Rouge ?"]);
});

test("sanitizeQuiz : null quand rien n'est exploitable", () => {
  assert.equal(sanitizeQuiz({ questions: [] }), null);
  assert.equal(sanitizeQuiz({}), null);
  assert.equal(sanitizeQuiz("n'importe quoi"), null);
});
