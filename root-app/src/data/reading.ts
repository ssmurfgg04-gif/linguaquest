export interface ReadingQuestion {
  question: string;
  options: string[];
  correct: number;
}

export interface ReadingPassage {
  id: string;
  title: string;
  emoji: string;
  level: "beginner" | "intermediate" | "advanced";
  text: string;
  questions: ReadingQuestion[];
}

export const READING_PASSAGES: ReadingPassage[] = [
  {
    id: "morning-routine",
    title: "My Morning Routine",
    emoji: "🌅",
    level: "beginner",
    text: "Every morning, I wake up at 6 o'clock. I brush my teeth and wash my face. Then I eat breakfast with my family. I usually have bread and milk. After breakfast, I put on my school uniform and walk to school. I meet my friends on the way. School starts at 8 o'clock.",
    questions: [
      { question: "What time does the writer wake up?", options: ["5 o'clock", "6 o'clock", "7 o'clock", "8 o'clock"], correct: 1 },
      { question: "What does the writer eat for breakfast?", options: ["Rice and eggs", "Bread and milk", "Porridge", "Fruit"], correct: 1 },
      { question: "How does the writer go to school?", options: ["By bus", "By car", "Walks", "By bike"], correct: 2 },
      { question: "What time does school start?", options: ["7 o'clock", "8 o'clock", "9 o'clock", "10 o'clock"], correct: 1 },
    ],
  },
  {
    id: "shopping-trip",
    title: "A Trip to the Market",
    emoji: "🛒",
    level: "beginner",
    text: "On Saturday, I went to the market with my mother. The market was very busy. There were many people selling fruits, vegetables, and clothes. My mother bought some oranges and bananas. I saw a beautiful blue shirt and asked my mother to buy it. She said yes! I was very happy. We went home at noon.",
    questions: [
      { question: "Who did the writer go to the market with?", options: ["Father", "Sister", "Mother", "Friend"], correct: 2 },
      { question: "What did the writer's mother buy?", options: ["Apples and pears", "Oranges and bananas", "Mangoes", "Vegetables"], correct: 1 },
      { question: "What did the writer want?", options: ["A red cap", "A blue shirt", "Shoes", "A toy"], correct: 1 },
      { question: "How did the writer feel?", options: ["Sad", "Angry", "Happy", "Tired"], correct: 2 },
    ],
  },
  {
    id: "soccer-game",
    title: "The Big Soccer Game",
    emoji: "⚽",
    level: "intermediate",
    text: "Last weekend, our school team played a soccer match against Riverside Primary. The game started at 10 o'clock. In the first half, Riverside scored a goal. We were worried, but our coach told us to keep trying. In the second half, our captain scored an equaliser. Then, in the last minute, I scored the winning goal! Everyone cheered. We won 2-1. It was the best day of my life.",
    questions: [
      { question: "Who did the school team play against?", options: ["City Primary", "Riverside Primary", "Hill School", "Star Academy"], correct: 1 },
      { question: "What was the score at half time?", options: ["1-0 to us", "0-0", "1-0 to Riverside", "2-0 to Riverside"], correct: 2 },
      { question: "Who scored the winning goal?", options: ["The captain", "The coach", "The writer", "A defender"], correct: 2 },
      { question: "What was the final score?", options: ["1-0", "2-1", "2-0", "3-1"], correct: 1 },
    ],
  },
  {
    id: "saving-animals",
    title: "Saving the Forest Animals",
    emoji: "🌿",
    level: "intermediate",
    text: "In our village, there is a small forest near the river. Many animals live there - rabbits, birds, and even a family of monkeys. Last year, some people wanted to cut down the trees. Our class decided to help. We made posters about why trees are important. We showed them to our parents and neighbours. Then we planted 20 new trees near the school. Now the animals have a safe home. Our teacher said we should be proud of ourselves.",
    questions: [
      { question: "What animals live in the forest?", options: ["Lions and zebras", "Rabbits, birds and monkeys", "Elephants", "Snakes"], correct: 1 },
      { question: "What did some people want to do?", options: ["Build a school", "Cut down the trees", "Build a road", "Make a farm"], correct: 1 },
      { question: "How did the class help?", options: ["They made posters and planted trees", "They talked to the police", "They moved the animals", "They built a fence"], correct: 0 },
      { question: "How many trees did they plant?", options: ["10", "15", "20", "30"], correct: 2 },
    ],
  },
  {
    id: "space-trip",
    title: "My Dream Trip to Space",
    emoji: "🚀",
    level: "advanced",
    text: "If I could travel anywhere, I would go to space. Ever since I was little, I have been fascinated by the stars and planets. I want to see the Earth from above - a blue and green ball floating in the darkness. I have read many books about astronauts. My favourite is Sally Ride, the first American woman in space. To become an astronaut, I need to study science and maths really hard. I also need to stay healthy and exercise every day. Last week, I joined a space club at school. We learn about rockets and build small models. One day, I hope to look out of a spaceship window and see our beautiful planet.",
    questions: [
      { question: "What does the writer want to do?", options: ["Visit the Moon", "Travel to space", "Build a rocket", "Meet an astronaut"], correct: 1 },
      { question: "Who is Sally Ride?", options: ["A scientist", "The first American woman in space", "A writer", "The writer's teacher"], correct: 1 },
      { question: "What subjects does the writer need to study?", options: ["Art and music", "History and geography", "Science and maths", "English and French"], correct: 2 },
      { question: "What did the writer do last week?", options: ["Visited a space museum", "Joined a space club at school", "Built a telescope", "Read a book about planets"], correct: 1 },
      { question: "What does the writer imagine seeing from space?", options: ["Other planets", "The Sun", "The Earth", "The Moon"], correct: 2 },
    ],
  },
  {
    id: "volunteer-day",
    title: "Community Volunteer Day",
    emoji: "🤝",
    level: "advanced",
    text: "Every term, our school organises a Community Volunteer Day. Last term, we visited the local elderly home. At first, I was nervous because I didn't know what to say. But the elderly people were very kind and welcoming. I sat with a woman named Grace. She told me stories about her childhood. She grew up in a small village without electricity. She walked 5 kilometres to school every day! I told her about my school and my dream of becoming a doctor. She said I should never give up. Before we left, we sang songs together. It was a day I will never forget. I learned that listening to someone's story can be the greatest gift.",
    questions: [
      { question: "How often does the school organise Volunteer Day?", options: ["Every month", "Every term", "Every year", "Every week"], correct: 1 },
      { question: "How did the writer feel at first?", options: ["Excited", "Nervous", "Bored", "Angry"], correct: 1 },
      { question: "How far did Grace walk to school?", options: ["2 kilometres", "3 kilometres", "5 kilometres", "10 kilometres"], correct: 2 },
      { question: "What does the writer want to become?", options: ["A teacher", "A doctor", "An engineer", "A nurse"], correct: 1 },
      { question: "What did the writer learn from the experience?", options: ["Singing is fun", "Elderly people need help", "Listening to stories is a gift", "Volunteering is easy"], correct: 2 },
    ],
  },
];
