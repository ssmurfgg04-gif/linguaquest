import type { LanguageCode } from "./mock";

export const PAGE_HEADINGS: Record<string, Record<LanguageCode, string>> = {
  practiceTitle: { en: "Complete the sentences", de: "Vervollständige die Sätze", fr: "Complète les phrases", sw: "Kamilisha sentensi" },
  practiceDesc: { en: "Type the missing word to practice English grammar.", de: "Schreibe das fehlende Wort für Deutsch-Übungen.", fr: "Écris le mot manquant pour pratiquer le français.", sw: "Andika neno linalokosekana kwa mazoezi ya Kiswahili." },
  matchTitle: { en: "Match words to their meanings", de: "Ordne Wörter ihren Bedeutungen zu", fr: "Associe les mots à leur sens", sw: "Linganisha maneno na maana zake" },
  matchDesc: { en: "A memory game to build your English vocabulary.", de: "Ein Gedächtnisspiel für deinen deutschen Wortschatz.", fr: "Un jeu de mémoire pour enrichir ton vocabulaire.", sw: "Mchezo wa kumbukumbu kwa msamiati wako wa Kiswahili." },
  quizTitle: { en: "Test what you know", de: "Teste dein Wissen", fr: "Teste tes connaissances", sw: "Jaribu ujuzi wako" },
  quizDesc: { en: "Multiple-choice questions to practice your English.", de: "Multiple-Choice-Fragen zum Deutsch üben.", fr: "Des questions pour pratiquer ton français.", sw: "Maswali ya kuchagua kwa mazoezi ya Kiswahili." },
  vocabTitle: { en: "Build your vocabulary", de: "Baue deinen Wortschatz auf", fr: "Enrichis ton vocabulaire", sw: "Jenga msamiati wako" },
  vocabDesc: { en: "Flip through decks and learn new words.", de: "Lerne neue Wörter auf Deutsch mit Karteikarten.", fr: "Apprends de nouveaux mots en français.", sw: "Jifunze maneno mapya kwa Kiswahili." },
  phrasebookTitle: { en: "Everyday phrases", de: "Alltägliche Ausdrücke", fr: "Expressions courantes", sw: "Vifungu vya kila siku" },
  phrasebookDesc: { en: "Useful phrases for real-life conversations, sorted by situation.", de: "Nützliche Ausdrücke für echte Gespräche, nach Situation geordnet.", fr: "Expressions utiles pour les conversations réelles, classées par situation.", sw: "Vifungu muhimu kwa mazungumzo halisi, yaliyopangwa kwa hali." },
};
