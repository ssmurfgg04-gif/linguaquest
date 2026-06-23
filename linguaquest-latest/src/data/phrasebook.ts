import type { LanguageCode } from "./mock";

export type Phrase = {
  phrase: string;
  translation: string;
  usage?: string;
};

export type PhraseCategory = {
  category: string;
  emoji: string;
  phrases: Phrase[];
};

export type PhrasebookEntry = {
  language: LanguageCode;
  categories: PhraseCategory[];
};

export const PHRASEBOOKS: PhrasebookEntry[] = [
  {
    language: "en",
    categories: [
      {
        category: "Greetings", emoji: "👋",
        phrases: [
          { phrase: "Hello!", translation: "A friendly greeting" },
          { phrase: "Good morning!", translation: "Greeting before noon" },
          { phrase: "Good afternoon!", translation: "Greeting after noon" },
          { phrase: "Good evening!", translation: "Greeting in the evening" },
          { phrase: "How are you?", translation: "Asking about someone's well-being" },
          { phrase: "I'm fine, thanks!", translation: "Common reply to 'How are you?'" },
          { phrase: "Nice to meet you!", translation: "When meeting someone for the first time", usage: "Handshake or smile" },
          { phrase: "See you later!", translation: "Saying goodbye informally" },
        ],
      },
      {
        category: "In the Classroom", emoji: "🏫",
        phrases: [
          { phrase: "I have a question.", translation: "Polite way to ask something" },
          { phrase: "Can you help me?", translation: "Asking for assistance", usage: "Raise your hand" },
          { phrase: "I don't understand.", translation: "When you need more explanation" },
          { phrase: "Can you repeat that?", translation: "Asking someone to say it again" },
          { phrase: "What does this word mean?", translation: "Asking about vocabulary" },
          { phrase: "May I go to the bathroom?", translation: "Asking for permission" },
        ],
      },
      {
        category: "Making Friends", emoji: "🤝",
        phrases: [
          { phrase: "What's your name?", translation: "Asking someone's name" },
          { phrase: "My name is...", translation: "Introducing yourself" },
          { phrase: "How old are you?", translation: "Asking age" },
          { phrase: "I am ___ years old.", translation: "Telling your age" },
          { phrase: "Do you want to play?", translation: "Inviting someone to play" },
          { phrase: "That sounds fun!", translation: "Showing excitement" },
          { phrase: "Let's be friends!", translation: "Offering friendship" },
        ],
      },
      {
        category: "Food & Shopping", emoji: "🛒",
        phrases: [
          { phrase: "How much does this cost?", translation: "Asking the price" },
          { phrase: "I would like...", translation: "Polite way to order or request" },
          { phrase: "Can I have the menu?", translation: "At a restaurant" },
          { phrase: "This is delicious!", translation: "Complimenting food" },
          { phrase: "I'm full, thank you.", translation: "After finishing a meal" },
          { phrase: "Do you have any change?", translation: "At the checkout" },
        ],
      },
      {
        category: "Weather", emoji: "🌤️",
        phrases: [
          { phrase: "It is sunny today.", translation: "Describing sunny weather" },
          { phrase: "It is raining outside.", translation: "Describing rainy weather" },
          { phrase: "It is very cold today.", translation: "Describing cold weather" },
          { phrase: "It is warm and nice.", translation: "Describing pleasant weather" },
          { phrase: "Don't forget your umbrella.", translation: "Advice for rain" },
          { phrase: "What is the temperature?", translation: "Asking about temperature" },
          { phrase: "The wind is very strong.", translation: "Describing wind" },
        ],
      },
      {
        category: "Travel", emoji: "🚌",
        phrases: [
          { phrase: "How do I get to the station?", translation: "Asking for directions" },
          { phrase: "Is it far from here?", translation: "Asking about distance" },
          { phrase: "Where does this bus go?", translation: "Asking about bus route" },
          { phrase: "I need a ticket.", translation: "Buying a ticket" },
          { phrase: "How much is the fare?", translation: "Asking about price" },
          { phrase: "Please stop here.", translation: "Asking the driver to stop" },
        ],
      },
      {
        category: "Health", emoji: "🏥",
        phrases: [
          { phrase: "I don't feel well.", translation: "Saying you are sick" },
          { phrase: "My head hurts.", translation: "Saying you have a headache" },
          { phrase: "I need to see a doctor.", translation: "Asking for medical help" },
          { phrase: "I have a cold.", translation: "Describing your illness" },
          { phrase: "Where is the pharmacy?", translation: "Finding a pharmacy" },
          { phrase: "I need some medicine.", translation: "Asking for medicine" },
        ],
      },
      {
        category: "Technology", emoji: "💻",
        phrases: [
          { phrase: "Can I use your computer?", translation: "Asking to use a device" },
          { phrase: "The internet is not working.", translation: "Troubleshooting" },
          { phrase: "How do I print this?", translation: "Asking about printing" },
          { phrase: "My phone battery is dead.", translation: "About phone" },
          { phrase: "What is your email address?", translation: "Exchanging contact" },
          { phrase: "I will send you a message.", translation: "Online communication" },
        ],
      },
    ],
  },
  {
    language: "de",
    categories: [
      {
        category: "Begrüßungen", emoji: "👋",
        phrases: [
          { phrase: "Hallo!", translation: "A friendly greeting" },
          { phrase: "Guten Morgen!", translation: "Good morning" },
          { phrase: "Guten Tag!", translation: "Good day" },
          { phrase: "Guten Abend!", translation: "Good evening" },
          { phrase: "Wie geht es dir?", translation: "How are you? (informal)" },
          { phrase: "Mir geht es gut, danke!", translation: "I'm fine, thanks" },
          { phrase: "Freut mich, dich kennenzulernen!", translation: "Nice to meet you" },
          { phrase: "Bis später!", translation: "See you later" },
        ],
      },
      {
        category: "Im Klassenzimmer", emoji: "🏫",
        phrases: [
          { phrase: "Ich habe eine Frage.", translation: "I have a question" },
          { phrase: "Kannst du mir helfen?", translation: "Can you help me?" },
          { phrase: "Ich verstehe nicht.", translation: "I don't understand" },
          { phrase: "Kannst du das wiederholen?", translation: "Can you repeat that?" },
          { phrase: "Was bedeutet dieses Wort?", translation: "What does this word mean?" },
        ],
      },
      {
        category: "Freunde finden", emoji: "🤝",
        phrases: [
          { phrase: "Wie heißt du?", translation: "What's your name?" },
          { phrase: "Ich heiße...", translation: "My name is..." },
          { phrase: "Wie alt bist du?", translation: "How old are you?" },
          { phrase: "Ich bin ___ Jahre alt.", translation: "I am ___ years old" },
          { phrase: "Willst du spielen?", translation: "Do you want to play?" },
        ],
      },
      {
        category: "Essen & Einkaufen", emoji: "🛒",
        phrases: [
          { phrase: "Was kostet das?", translation: "How much does this cost?" },
          { phrase: "Ich möchte...", translation: "I would like..." },
          { phrase: "Kann ich die Speisekarte haben?", translation: "Can I have the menu?" },
          { phrase: "Das schmeckt sehr gut!", translation: "This tastes very good!" },
          { phrase: "Ich bin satt, danke.", translation: "I'm full, thanks" },
          { phrase: "Haben Sie Wechselgeld?", translation: "Do you have change?" },
        ],
      },
      {
        category: "Wetter", emoji: "🌤️",
        phrases: [
          { phrase: "Heute ist es sonnig.", translation: "It is sunny today" },
          { phrase: "Es regnet draußen.", translation: "It is raining outside" },
          { phrase: "Es ist sehr kalt.", translation: "It is very cold" },
          { phrase: "Es ist warm und schön.", translation: "It is warm and nice" },
          { phrase: "Vergiss deinen Regenschirm nicht.", translation: "Don't forget your umbrella" },
          { phrase: "Wie ist die Temperatur?", translation: "What is the temperature?" },
        ],
      },
      {
        category: "Reisen", emoji: "🚌",
        phrases: [
          { phrase: "Wie komme ich zum Bahnhof?", translation: "How do I get to the station?" },
          { phrase: "Ist es weit von hier?", translation: "Is it far from here?" },
          { phrase: "Wo fährt dieser Bus hin?", translation: "Where does this bus go?" },
          { phrase: "Ich brauche eine Fahrkarte.", translation: "I need a ticket" },
          { phrase: "Was kostet die Fahrt?", translation: "How much is the fare?" },
          { phrase: "Bitte halten Sie hier.", translation: "Please stop here" },
        ],
      },
      {
        category: "Gesundheit", emoji: "🏥",
        phrases: [
          { phrase: "Mir geht es nicht gut.", translation: "I don't feel well" },
          { phrase: "Ich habe Kopfschmerzen.", translation: "I have a headache" },
          { phrase: "Ich muss zum Arzt.", translation: "I need to see a doctor" },
          { phrase: "Ich habe eine Erkältung.", translation: "I have a cold" },
          { phrase: "Wo ist die Apotheke?", translation: "Where is the pharmacy?" },
          { phrase: "Ich brauche Medikamente.", translation: "I need some medicine" },
        ],
      },
      {
        category: "Familie", emoji: "👨‍👩‍👧‍👦",
        phrases: [
          { phrase: "Hast du Geschwister?", translation: "Do you have siblings?" },
          { phrase: "Ich habe einen Bruder.", translation: "I have a brother" },
          { phrase: "Meine Mutter ist Lehrerin.", translation: "My mother is a teacher" },
          { phrase: "Mein Vater arbeitet im Büro.", translation: "My father works in an office" },
          { phrase: "Wir wohnen zusammen.", translation: "We live together" },
          { phrase: "Das ist meine Familie.", translation: "This is my family" },
        ],
      },
    ],
  },
  {
    language: "fr",
    categories: [
      {
        category: "Salutations", emoji: "👋",
        phrases: [
          { phrase: "Bonjour !", translation: "Hello / Good morning" },
          { phrase: "Bonsoir !", translation: "Good evening" },
          { phrase: "Comment ça va ?", translation: "How are you?" },
          { phrase: "Ça va bien, merci !", translation: "I'm fine, thanks" },
          { phrase: "Enchanté(e) !", translation: "Nice to meet you!" },
          { phrase: "À plus tard !", translation: "See you later!" },
        ],
      },
      {
        category: "En Classe", emoji: "🏫",
        phrases: [
          { phrase: "J'ai une question.", translation: "I have a question" },
          { phrase: "Tu peux m'aider ?", translation: "Can you help me?" },
          { phrase: "Je ne comprends pas.", translation: "I don't understand" },
          { phrase: "Tu peux répéter ?", translation: "Can you repeat that?" },
          { phrase: "Comment on dit ___ en français ?", translation: "How do you say ___ in French?" },
        ],
      },
      {
        category: "Nourriture & Shopping", emoji: "🛒",
        phrases: [
          { phrase: "Combien ça coûte ?", translation: "How much does this cost?" },
          { phrase: "Je voudrais...", translation: "I would like..." },
          { phrase: "Puis-je avoir le menu ?", translation: "Can I have the menu?" },
          { phrase: "C'est délicieux !", translation: "This is delicious!" },
          { phrase: "Je suis rassasié(e), merci.", translation: "I'm full, thank you" },
          { phrase: "Avez-vous de la monnaie ?", translation: "Do you have any change?" },
        ],
      },
      {
        category: "Météo", emoji: "🌤️",
        phrases: [
          { phrase: "Il fait beau aujourd'hui.", translation: "It is nice today" },
          { phrase: "Il pleut dehors.", translation: "It is raining outside" },
          { phrase: "Il fait très froid.", translation: "It is very cold" },
          { phrase: "Il fait chaud et agréable.", translation: "It is warm and pleasant" },
          { phrase: "N'oublie pas ton parapluie.", translation: "Don't forget your umbrella" },
          { phrase: "Quelle est la température ?", translation: "What is the temperature?" },
        ],
      },
      {
        category: "Voyages", emoji: "🚌",
        phrases: [
          { phrase: "Comment aller à la gare ?", translation: "How do I get to the station?" },
          { phrase: "C'est loin d'ici ?", translation: "Is it far from here?" },
          { phrase: "Où va ce bus ?", translation: "Where does this bus go?" },
          { phrase: "J'ai besoin d'un billet.", translation: "I need a ticket" },
          { phrase: "Combien coûte le trajet ?", translation: "How much is the fare?" },
          { phrase: "Arrêtez-vous ici, s'il vous plaît.", translation: "Please stop here" },
        ],
      },
      {
        category: "Santé", emoji: "🏥",
        phrases: [
          { phrase: "Je ne me sens pas bien.", translation: "I don't feel well" },
          { phrase: "J'ai mal à la tête.", translation: "I have a headache" },
          { phrase: "Je dois voir un médecin.", translation: "I need to see a doctor" },
          { phrase: "J'ai un rhume.", translation: "I have a cold" },
          { phrase: "Où est la pharmacie ?", translation: "Where is the pharmacy?" },
          { phrase: "J'ai besoin de médicaments.", translation: "I need some medicine" },
        ],
      },
      {
        category: "Famille", emoji: "👨‍👩‍👧‍👦",
        phrases: [
          { phrase: "As-tu des frères et sœurs ?", translation: "Do you have siblings?" },
          { phrase: "J'ai un frère.", translation: "I have a brother" },
          { phrase: "Ma mère est professeur.", translation: "My mother is a teacher" },
          { phrase: "Mon père travaille dans un bureau.", translation: "My father works in an office" },
          { phrase: "Nous habitons ensemble.", translation: "We live together" },
          { phrase: "Voici ma famille.", translation: "This is my family" },
        ],
      },
    ],
  },
  {
    language: "sw",
    categories: [
      {
        category: "Salamu", emoji: "👋",
        phrases: [
          { phrase: "Habari!", translation: "Hello! / How are you?" },
          { phrase: "Habari za asubuhi!", translation: "Good morning!" },
          { phrase: "Habari za jioni!", translation: "Good evening!" },
          { phrase: "Nzuri, asante!", translation: "I'm fine, thanks!" },
          { phrase: "Ninafurahi kukutana nawe!", translation: "Nice to meet you!" },
          { phrase: "Tutaonana baadaye!", translation: "See you later!" },
        ],
      },
      {
        category: "Darasani", emoji: "🏫",
        phrases: [
          { phrase: "Nina swali.", translation: "I have a question" },
          { phrase: "Unaweza kunisaidia?", translation: "Can you help me?" },
          { phrase: "Sielewi.", translation: "I don't understand" },
          { phrase: "Unaweza kurudia?", translation: "Can you repeat that?" },
          { phrase: "Neno hili linamaanisha nini?", translation: "What does this word mean?" },
        ],
      },
      {
        category: "Kupata Marafiki", emoji: "🤝",
        phrases: [
          { phrase: "Jina lako nani?", translation: "What's your name?" },
          { phrase: "Jina langu ni...", translation: "My name is..." },
          { phrase: "Una miaka mingapi?", translation: "How old are you?" },
          { phrase: "Nina miaka ___", translation: "I am ___ years old" },
          { phrase: "Unataka kucheza?", translation: "Do you want to play?" },
          { phrase: "Tuwe marafiki!", translation: "Let's be friends!" },
        ],
      },
      {
        category: "Chakula na Ununuzi", emoji: "🛒",
        phrases: [
          { phrase: "Hii ni bei gani?", translation: "How much does this cost?" },
          { phrase: "Ningependa...", translation: "I would like..." },
          { phrase: "Una menu?", translation: "Do you have the menu?" },
          { phrase: "Hii ni tamu sana!", translation: "This is very delicious!" },
          { phrase: "Nimeshiba, asante.", translation: "I'm full, thank you." },
        ],
      },
      {
        category: "Hali ya Hewa", emoji: "🌤️",
        phrases: [
          { phrase: "Kuna jua leo.", translation: "It is sunny today" },
          { phrase: "Mvua inanyesha nje.", translation: "It is raining outside" },
          { phrase: "Kuna baridi sana.", translation: "It is very cold" },
          { phrase: "Kuna joto na nzuri.", translation: "It is warm and nice" },
          { phrase: "Usisahau mwavuli wako.", translation: "Don't forget your umbrella" },
          { phrase: "Hali ya hewa iko aje?", translation: "How is the weather?" },
        ],
      },
      {
        category: "Safari", emoji: "🚌",
        phrases: [
          { phrase: "Nawezaje kufika stesheni?", translation: "How do I get to the station?" },
          { phrase: "Ni mbali kutoka hapa?", translation: "Is it far from here?" },
          { phrase: "Basi hili linakwenda wapi?", translation: "Where does this bus go?" },
          { phrase: "Nahitaji tiketi.", translation: "I need a ticket" },
          { phrase: "Nauli ni kiasi gani?", translation: "How much is the fare?" },
          { phrase: "Tafadhali simama hapa.", translation: "Please stop here" },
        ],
      },
      {
        category: "Afya", emoji: "🏥",
        phrases: [
          { phrase: "Sijisikii vizuri.", translation: "I don't feel well" },
          { phrase: "Kichwa changu kinauma.", translation: "My head hurts" },
          { phrase: "Nahitaji kuona daktari.", translation: "I need to see a doctor" },
          { phrase: "Nina homa.", translation: "I have a fever" },
          { phrase: "Duka la dawa liko wapi?", translation: "Where is the pharmacy?" },
          { phrase: "Nahitaji dawa.", translation: "I need some medicine" },
        ],
      },
      {
        category: "Teknolojia", emoji: "💻",
        phrases: [
          { phrase: "Naweza kutumia kompyuta yako?", translation: "Can I use your computer?" },
          { phrase: "Intaneti haifanyi kazi.", translation: "The internet is not working" },
          { phrase: "Betri ya simu yangu imeisha.", translation: "My phone battery is dead" },
          { phrase: "Barua pepe yako ni nini?", translation: "What is your email address?" },
          { phrase: "Nikutumie ujumbe.", translation: "I will send you a message" },
          { phrase: "Tafuta kwenye intaneti.", translation: "Search on the internet" },
        ],
      },
    ],
  },
];

export const PHRASEBOOK_BY_LANGUAGE = Object.fromEntries(
  PHRASEBOOKS.map((p) => [p.language, p])
) as Record<LanguageCode, PhrasebookEntry>;
