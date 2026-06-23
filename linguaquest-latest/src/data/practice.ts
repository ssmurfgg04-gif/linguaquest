import type { LanguageCode } from "./mock";

export type GapExercise = {
  sentence: string;
  answer: string;
  hint: string;
};

export type GapPractice = {
  id: string;
  language: LanguageCode;
  title: string;
  emoji: string;
  exercises: GapExercise[];
};

export const GAP_PRACTICES: GapPractice[] = [
  {
    id: "en-be-verbs",
    language: "en",
    title: "To Be — Fill the Gap",
    emoji: "✏️",
    exercises: [
      { sentence: "I ___ a student.", answer: "am", hint: "Use 'am' with 'I'" },
      { sentence: "You ___ my friend.", answer: "are", hint: "Use 'are' with 'you'" },
      { sentence: "She ___ very kind.", answer: "is", hint: "Use 'is' with 'she'" },
      { sentence: "We ___ in the classroom.", answer: "are", hint: "Use 'are' with 'we'" },
      { sentence: "They ___ happy today.", answer: "are", hint: "Use 'are' with 'they'" },
      { sentence: "He ___ a good teacher.", answer: "is", hint: "Use 'is' with 'he'" },
      { sentence: "It ___ a sunny day.", answer: "is", hint: "Use 'is' with 'it'" },
    ],
  },
  {
    id: "en-have-has",
    language: "en",
    title: "Have vs Has",
    emoji: "✏️",
    exercises: [
      { sentence: "I ___ a pet cat.", answer: "have", hint: "Use 'have' with 'I'" },
      { sentence: "She ___ a new book.", answer: "has", hint: "Use 'has' with 'she'" },
      { sentence: "They ___ many friends.", answer: "have", hint: "Use 'have' with 'they'" },
      { sentence: "He ___ a red bicycle.", answer: "has", hint: "Use 'has' with 'he'" },
      { sentence: "We ___ homework today.", answer: "have", hint: "Use 'have' with 'we'" },
    ],
  },
  {
    id: "en-prepositions",
    language: "en",
    title: "Prepositions of Place",
    emoji: "✏️",
    exercises: [
      { sentence: "The book is ___ the table.", answer: "on", hint: "Surface level" },
      { sentence: "The cat is ___ the box.", answer: "in", hint: "Inside something" },
      { sentence: "The school is ___ the park and the library.", answer: "between", hint: "In the middle of two things" },
      { sentence: "The pencil is ___ the desk.", answer: "under", hint: "Below something" },
      { sentence: "The board is ___ the classroom.", answer: "in", hint: "Inside a room" },
    ],
  },
  {
    id: "en-articles",
    language: "en",
    title: "A or An",
    emoji: "✏️",
    exercises: [
      { sentence: "I saw ___ elephant at the zoo.", answer: "an", hint: "Use 'an' before a vowel sound" },
      { sentence: "She has ___ red balloon.", answer: "a", hint: "Use 'a' before consonant sounds" },
      { sentence: "He is ___ honest boy.", answer: "an", hint: "'h' is silent, vowel sound follows" },
      { sentence: "We need ___ umbrella today.", answer: "an", hint: "Umbrella starts with a vowel sound" },
      { sentence: "There is ___ big tree in the garden.", answer: "a", hint: "'b' is a consonant sound" },
      { sentence: "I ate ___ apple for breakfast.", answer: "an", hint: "Apple starts with a vowel sound" },
    ],
  },
  {
    id: "en-plurals",
    language: "en",
    title: "Plurals",
    emoji: "✏️",
    exercises: [
      { sentence: "I have one cat and two ___.", answer: "cats", hint: "Add 's' for most nouns" },
      { sentence: "She has three ___.", answer: "boxes", hint: "Add 'es' after x, ch, sh, s" },
      { sentence: "The ___ are playing in the park.", answer: "children", hint: "Irregular plural of 'child'" },
      { sentence: "I saw two ___ on the grass.", answer: "mice", hint: "Irregular plural of 'mouse'" },
      { sentence: "There are many ___ in the sea.", answer: "fish", hint: "Same singular and plural" },
      { sentence: "We have five ___ on our team.", answer: "players", hint: "Add 's' to 'player'" },
    ],
  },
  {
    id: "en-adjectives",
    language: "en",
    title: "Adjectives",
    emoji: "✏️",
    exercises: [
      { sentence: "The soup is very ___.", answer: "hot", hint: "Opposite of cold" },
      { sentence: "She is a ___ girl.", answer: "happy", hint: "Feeling joyful" },
      { sentence: "The elephant is ___.", answer: "big", hint: "Opposite of small" },
      { sentence: "This bag is too ___.", answer: "heavy", hint: "Hard to lift" },
      { sentence: "The flower is ___.", answer: "beautiful", hint: "Very pretty" },
    ],
  },
  {
    id: "en-present-tense",
    language: "en",
    title: "Simple Present",
    emoji: "✏️",
    exercises: [
      { sentence: "She ___ (walk) to school every day.", answer: "walks", hint: "He/she/it takes -s" },
      { sentence: "They ___ (play) football on Saturdays.", answer: "play", hint: "They = plural, no -s" },
      { sentence: "He ___ (watch) TV in the evening.", answer: "watches", hint: "Add -es after ch/sh/s" },
      { sentence: "I ___ (study) English every Tuesday.", answer: "study", hint: "I = first person, no -s" },
      { sentence: "The cat ___ (sleep) all day.", answer: "sleeps", hint: "He/she/it takes -s" },
      { sentence: "We ___ (go) to the park on Sundays.", answer: "go", hint: "We = plural, no -s" },
      { sentence: "My brother ___ (fix) his bike.", answer: "fixes", hint: "Add -es after x" },
    ],
  },
  {
    id: "de-artikel",
    language: "de",
    title: "Bestimmter Artikel (der, die, das)",
    emoji: "✏️",
    exercises: [
      { sentence: "___ Junge spielt Fußball.", answer: "Der", hint: "Junge ist maskulin" },
      { sentence: "___ Mädchen liest ein Buch.", answer: "Das", hint: "Mädchen ist neutral" },
      { sentence: "___ Frau geht zur Schule.", answer: "Die", hint: "Frau ist feminin" },
      { sentence: "___ Kind ist glücklich.", answer: "Das", hint: "Kind ist neutral" },
      { sentence: "___ Hund bellt laut.", answer: "Der", hint: "Hund ist maskulin" },
    ],
  },
  {
    id: "de-sein-haben",
    language: "de",
    title: "Sein & Haben",
    emoji: "✏️",
    exercises: [
      { sentence: "Ich ___ glücklich.", answer: "bin", hint: "sein, 1. Person Singular" },
      { sentence: "Du ___ einen Hund.", answer: "hast", hint: "haben, 2. Person Singular" },
      { sentence: "Er ___ ein Buch.", answer: "hat", hint: "haben, 3. Person Singular" },
      { sentence: "Wir ___ in der Schule.", answer: "sind", hint: "sein, 1. Person Plural" },
      { sentence: "Sie ___ müde.", answer: "sind", hint: "sein, 3. Person Plural" },
      { sentence: "Ihr ___ eine Katze.", answer: "habt", hint: "haben, 2. Person Plural" },
    ],
  },
  {
    id: "de-praepositionen",
    language: "de",
    title: "Präpositionen",
    emoji: "✏️",
    exercises: [
      { sentence: "Das Buch liegt ___ dem Tisch.", answer: "auf", hint: "Oberfläche" },
      { sentence: "Die Katze ist ___ der Kiste.", answer: "in", hint: "Innen drin" },
      { sentence: "Der Stift ist ___ dem Tisch.", answer: "unter", hint: "Darunter" },
      { sentence: "Die Schule ist ___ dem Park.", answer: "neben", hint: "Neben etwas" },
      { sentence: "Ich sitze ___ meinem Freund.", answer: "neben", hint: "Neben jemandem" },
      { sentence: "Das Bild hängt ___ der Wand.", answer: "an", hint: "Senkrechte Fläche" },
    ],
  },
  {
    id: "de-wortstellung",
    language: "de",
    title: "Wortstellung (Word Order)",
    emoji: "✏️",
    exercises: [
      { sentence: "Heute ___ ich Tennis.", answer: "spiele", hint: "Verb an Position 2 nach Zeitwort" },
      { sentence: "___ du morgen zur Schule?", answer: "Gehst", hint: "Frage: Verb zuerst" },
      { sentence: "Ich ___ gestern einen Film.", answer: "sah", hint: "Vergangenheit von 'sehen'" },
      { sentence: "Er ___ nicht gerne Hausaufgaben.", answer: "macht", hint: "Verb an Position 2" },
      { sentence: "___ ihr am Wochenende Fußball?", answer: "Spielt", hint: "Frage mit 'ihr'" },
    ],
  },
  {
    id: "de-plural",
    language: "de",
    title: "Pluralformen",
    emoji: "✏️",
    exercises: [
      { sentence: "Ein Hund, zwei ___", answer: "Hunde", hint: "Most masculine nouns add -e" },
      { sentence: "Eine Blume, viele ___", answer: "Blumen", hint: "Feminine nouns often add -n/-en" },
      { sentence: "Ein Kind, mehrere ___", answer: "Kinder", hint: "Neuter nouns often add -er" },
      { sentence: "Ein Apfel, zwei ___", answer: "Äpfel", hint: "Umlaut + no ending for many -el nouns" },
      { sentence: "Ein Haus, viele ___", answer: "Häuser", hint: "Umlaut + -er for neuter nouns" },
      { sentence: "Ein Mädchen, die ___", answer: "Mädchen", hint: "-chen stays the same in plural" },
    ],
  },
  {
    id: "fr-etre",
    language: "fr",
    title: "Être (To Be)",
    emoji: "✏️",
    exercises: [
      { sentence: "Je ___ un élève.", answer: "suis", hint: "Je suis" },
      { sentence: "Tu ___ mon ami.", answer: "es", hint: "Tu es" },
      { sentence: "Il ___ gentil.", answer: "est", hint: "Il est" },
      { sentence: "Nous ___ en classe.", answer: "sommes", hint: "Nous sommes" },
      { sentence: "Vous ___ très sympa.", answer: "êtes", hint: "Vous êtes" },
      { sentence: "Ils ___ contents.", answer: "sont", hint: "Ils sont" },
    ],
  },
  {
    id: "fr-avoir",
    language: "fr",
    title: "Avoir (To Have)",
    emoji: "✏️",
    exercises: [
      { sentence: "J'___ un chien.", answer: "ai", hint: "J'ai" },
      { sentence: "Tu ___ un livre.", answer: "as", hint: "Tu as" },
      { sentence: "Il ___ une sœur.", answer: "a", hint: "Il a" },
      { sentence: "Nous ___ une maison.", answer: "avons", hint: "Nous avons" },
      { sentence: "Vous ___ un vélo.", answer: "avez", hint: "Vous avez" },
      { sentence: "Elles ___ des amis.", answer: "ont", hint: "Elles ont" },
    ],
  },
  {
    id: "fr-prepositions",
    language: "fr",
    title: "Prépositions",
    emoji: "✏️",
    exercises: [
      { sentence: "Le livre est ___ la table.", answer: "sur", hint: "Surface level" },
      { sentence: "Le chat est ___ la boîte.", answer: "dans", hint: "Inside something" },
      { sentence: "Je vais ___ l'école.", answer: "à", hint: "To school" },
      { sentence: "Il vient ___ France.", answer: "de", hint: "From France" },
      { sentence: "La boulangerie est ___ le parc.", answer: "près de", hint: "Near" },
      { sentence: "Le stylo est ___ le cahier.", answer: "sous", hint: "Under" },
    ],
  },
  {
    id: "fr-pluriel",
    language: "fr",
    title: "Le Pluriel",
    emoji: "✏️",
    exercises: [
      { sentence: "Un chat → des ___", answer: "chats", hint: "Add -s for most nouns" },
      { sentence: "Un chien → des ___", answer: "chiens", hint: "Add -s" },
      { sentence: "Un cheval → des ___", answer: "chevaux", hint: "Irregular: -al → -aux" },
      { sentence: "Un cadeau → des ___", answer: "cadeaux", hint: "Add -x for -eau words" },
      { sentence: "Un animal → des ___", answer: "animaux", hint: "Irregular: -al → -aux" },
      { sentence: "Une fleur → des ___", answer: "fleurs", hint: "Add -s" },
    ],
  },
  {
    id: "fr-adjectifs",
    language: "fr",
    title: "Adjectifs",
    emoji: "✏️",
    exercises: [
      { sentence: "Une fille ___ (gentil).", answer: "gentille", hint: "Feminine form adds -e" },
      { sentence: "Un garçon ___ (content).", answer: "content", hint: "Masculine stays the same" },
      { sentence: "Une maison ___ (grand).", answer: "grande", hint: "Add -e for feminine" },
      { sentence: "Des fleurs ___ (beau).", answer: "belles", hint: "Feminine plural" },
      { sentence: "Un homme ___ (heureux).", answer: "heureux", hint: "Masculine, -eux stays" },
    ],
  },
  {
    id: "sw-verb-conj",
    language: "sw",
    title: "Mnyambuliko wa Vitenzi",
    emoji: "✏️",
    exercises: [
      { sentence: "Mimi ___ (soma) kitabu.", answer: "ninasoma", hint: "NI - NA - soma" },
      { sentence: "Wewe ___ (cheza) mpira.", answer: "unacheza", hint: "U - NA - cheza" },
      { sentence: "Yeye ___ (imba) wimbo.", answer: "anaimba", hint: "A - NA - imba" },
      { sentence: "Sisi ___ (andika) barua.", answer: "tunaandika", hint: "TU - NA - andika" },
      { sentence: "Nyinyi ___ (sema) Kiswahili.", answer: "mnasema", hint: "M - NA - sema" },
      { sentence: "Wao ___ (kimbia) haraka.", answer: "wanakimbia", hint: "WA - NA - kimbia" },
    ],
  },
  {
    id: "sw-ngeli",
    language: "sw",
    title: "Ngeli za Nomino",
    emoji: "✏️",
    exercises: [
      { sentence: "___ -tu wanasoma.", answer: "Wa", hint: "Watu (people) take 'wa-'" },
      { sentence: "___ -ti inakua.", answer: "M", hint: "Mti (tree) takes 'm-'" },
      { sentence: "Ki - ___ kidogo.", answer: "kitu", hint: "Kitu (thing) takes 'ki-'" },
      { sentence: "___ -to linang'aa.", answer: "Ji", hint: "Jito (lake) takes 'ji-'" },
      { sentence: "___ -zi ni tamu.", answer: "N", hint: "Ndizi (banana) takes 'n-'" },
      { sentence: "U - ___ mrefu.", answer: "wavu", hint: "Wavu (net) takes 'u-'" },
    ],
  },
  {
    id: "sw-hali",
    language: "sw",
    title: "Vivumishi (Adjectives)",
    emoji: "✏️",
    exercises: [
      { sentence: "Miti hii ni ___ (refu).", answer: "mirefu", hint: "M-WA class adjective agreement" },
      { sentence: "Nyumba hii ni ___ (kubwa).", answer: "kubwa", hint: "N-N class stays kubwa" },
      { sentence: "Mtoto huyu ni ___ (dogo).", answer: "mdogo", hint: "M-WA class singular" },
      { sentence: "Vitabu hivi ni ___ (zuri).", answer: "vizuri", hint: "KI-VI class: vi- prefix" },
      { sentence: "Maji haya ni ___ (bora).", answer: "mazuri", hint: "MA class: ma- prefix" },
    ],
  },
  {
    id: "sw-nyakati",
    language: "sw",
    title: "Wakati — Present Tense",
    emoji: "✏️",
    exercises: [
      { sentence: "Mimi ___ (kuwa) mwanafunzi.", answer: "ni", hint: "Present of 'to be' for first person" },
      { sentence: "Wewe ___ (kuwa) rafiki yangu.", answer: "u", hint: "Present of 'to be' for second person" },
      { sentence: "Yeye ___ (kuwa) mwalimu.", answer: "yu", hint: "Present of 'to be' for third person" },
      { sentence: "Sisi ___ (enda) shuleni.", answer: "tunaenda", hint: "We go — use kuwa na + enda" },
      { sentence: "Wao ___ (cheza) mpira.", answer: "wanacheza", hint: "They play — use kuwa na + cheza" },
    ],
  },
  {
    id: "sw-nyakati-2",
    language: "sw",
    title: "Nyakati (Tenses)",
    emoji: "✏️",
    exercises: [
      { sentence: "Jana mimi ___ (enda) sokoni.", answer: "nilienda", hint: "Past tense: NI - LI - enda" },
      { sentence: "Kesho yeye ___ (fika) mapema.", answer: "atafika", hint: "Future: A - TA - fika" },
      { sentence: "Sisi ___ (pika) chakula jioni.", answer: "tunapika", hint: "Present: TU - NA - pika" },
      { sentence: "Wao ___ (cheza) mpira jana.", answer: "walicheza", hint: "Past: WA - LI - cheza" },
      { sentence: "Mimi ___ (soma) kesho asubuhi.", answer: "nitasoma", hint: "Future: NI - TA - soma" },
    ],
  },
];

export const GAP_PRACTICE_BY_ID = Object.fromEntries(GAP_PRACTICES.map((p) => [p.id, p]));
export const GAP_PRACTICES_BY_LANGUAGE = GAP_PRACTICES.reduce((acc, p) => {
  (acc[p.language] ??= []).push(p);
  return acc;
}, {} as Record<LanguageCode, GapPractice[]>);
