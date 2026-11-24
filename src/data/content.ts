export interface Challenge {
  id: string;
  date: string;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  topic: string;
  prompt: string;
  code: string;
  options: string[];
  answer: number;
  explanation: string;
}

export const CHALLENGE_XP = 100;

export const challenges: Challenge[] = [
  {
    id: "string-pool",
    date: "Today",
    title: "The String Pool Puzzle",
    difficulty: "Medium",
    topic: "Strings",
    prompt: "Predict the exact output of this program.",
    code: `String a = "java";
String b = "java";
String c = new String("java");
System.out.println(a == b);
System.out.println(a == c);
System.out.println(a.equals(c));`,
    options: ["true true true", "true false true", "false false true", "true false false"],
    answer: 1,
    explanation:
      "Literals share one object in the string pool, so a == b is true. new String creates a separate object, so a == c is false, while equals compares content and returns true.",
  },
  {
    id: "integer-cache",
    date: "Yesterday",
    title: "Integer Caching",
    difficulty: "Hard",
    topic: "Wrapper classes",
    prompt: "What does this print?",
    code: `Integer x = 127, y = 127;
Integer p = 128, q = 128;
System.out.println((x == y) + " " + (p == q));`,
    options: ["true true", "false false", "true false", "false true"],
    answer: 2,
    explanation: "Java caches Integer values from -128 to 127, so only x and y share an object.",
  },
  {
    id: "loop-sum",
    date: "2 days ago",
    title: "Loop Accumulator",
    difficulty: "Easy",
    topic: "Loops",
    prompt: "What is printed?",
    code: `int sum = 0;
for (int i = 1; i <= 4; i++) sum += i;
System.out.println(sum);`,
    options: ["4", "6", "10", "15"],
    answer: 2,
    explanation: "1 + 2 + 3 + 4 = 10.",
  },
];

export interface Project {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  hours: number;
  description: string;
  skills: string[];
  steps: string[];
}

export const projects: Project[] = [
  {
    id: "bank-account",
    title: "Bank Account System",
    level: "Beginner",
    hours: 3,
    description: "Model accounts with deposits, withdrawals and balance checks.",
    skills: ["Classes", "Encapsulation", "Validation"],
    steps: [
      "Create an Account class with private balance",
      "Add deposit and withdraw methods",
      "Prevent overdrafts with validation",
      "Print a transaction summary",
    ],
  },
  {
    id: "grade-tracker",
    title: "Student Grade Tracker",
    level: "Beginner",
    hours: 2,
    description: "Read scores, compute averages and assign letter grades.",
    skills: ["Arrays", "Loops", "Conditionals"],
    steps: ["Store scores in an array", "Calculate the average", "Map averages to letter grades", "Find the top student"],
  },
  {
    id: "library-manager",
    title: "Library Manager",
    level: "Intermediate",
    hours: 5,
    description: "Track books, members and loans using collections.",
    skills: ["ArrayList", "HashMap", "OOP"],
    steps: [
      "Design Book and Member classes",
      "Store the catalogue in an ArrayList",
      "Track loans in a HashMap",
      "Search books by title or author",
      "Handle overdue returns",
    ],
  },
  {
    id: "tic-tac-toe",
    title: "Console Tic-Tac-Toe",
    level: "Intermediate",
    hours: 4,
    description: "A two-player game with win detection on a 2D board.",
    skills: ["2D arrays", "Methods", "Game loop"],
    steps: ["Render a 3×3 board", "Alternate player turns", "Detect wins and draws", "Offer a rematch"],
  },
  {
    id: "inventory-api",
    title: "Inventory Analytics",
    level: "Advanced",
    hours: 6,
    description: "Process product data with streams and custom exceptions.",
    skills: ["Streams", "Lambdas", "Exceptions"],
    steps: [
      "Load products into a list",
      "Filter low-stock items with streams",
      "Group products by category",
      "Throw custom exceptions for invalid data",
      "Generate a summary report",
    ],
  },
  {
    id: "task-scheduler",
    title: "Multithreaded Task Scheduler",
    level: "Advanced",
    hours: 8,
    description: "Run timed jobs concurrently with an executor service.",
    skills: ["Threads", "ExecutorService", "Synchronization"],
    steps: ["Define a Task interface", "Schedule tasks with an executor", "Guard shared state", "Log results safely"],
  },
];

export interface DuelQuestion {
  q: string;
  options: string[];
  answer: number;
}

export const duelQuestions: DuelQuestion[] = [
  { q: "Default value of an int field?", options: ["null", "0", "undefined", "-1"], answer: 1 },
  { q: "Which collection keeps keys unique?", options: ["List", "Map", "Array", "Queue"], answer: 1 },
  { q: "Keyword to prevent a class being extended?", options: ["static", "final", "private", "sealed off"], answer: 1 },
  { q: "Size of a Java int?", options: ["16 bits", "32 bits", "64 bits", "8 bits"], answer: 1 },
  { q: "Which is NOT a primitive?", options: ["char", "boolean", "String", "long"], answer: 2 },
  { q: "Method that starts a Thread?", options: ["run()", "go()", "start()", "execute()"], answer: 2 },
  { q: "What does 10 / 4 give with ints?", options: ["2.5", "2", "3", "2.0"], answer: 1 },
  { q: "Interface for sorting with a custom rule?", options: ["Sortable", "Comparator", "Orderable", "Iterator"], answer: 1 },
];

export const leaderboard = [
  { name: "Riya Sharma", xp: 4820, wins: 38 },
  { name: "Arjun Mehta", xp: 4510, wins: 34 },
  { name: "Sara Khan", xp: 3990, wins: 29 },
  { name: "Dev Patel", xp: 3420, wins: 25 },
  { name: "Neha Iyer", xp: 2980, wins: 21 },
];

export interface Post {
  id: string;
  author: string;
  title: string;
  body: string;
  tag: string;
  votes: number;
  replies: number;
  time: string;
}

export const seedPosts: Post[] = [
  {
    id: "p1",
    author: "Arjun Mehta",
    title: "Why does my for-each loop throw ConcurrentModificationException?",
    body: "I'm removing items from an ArrayList inside a for-each loop and it crashes. What's the right way?",
    tag: "Collections",
    votes: 24,
    replies: 6,
    time: "2h ago",
  },
  {
    id: "p2",
    author: "Sara Khan",
    title: "Finished the Bank Account project — feedback welcome!",
    body: "Added overdraft protection and a monthly interest method. Would love a code review.",
    tag: "Projects",
    votes: 18,
    replies: 9,
    time: "5h ago",
  },
  {
    id: "p3",
    author: "Dev Patel",
    title: "Interfaces vs abstract classes — when to pick which?",
    body: "Both seem to define contracts. Is there a simple rule of thumb?",
    tag: "OOP",
    votes: 31,
    replies: 12,
    time: "1d ago",
  },
  {
    id: "p4",
    author: "Neha Iyer",
    title: "Tip: use Stream.toList() instead of collect(Collectors.toList())",
    body: "Since Java 16 there's a shorter way to collect streams into an unmodifiable list.",
    tag: "Streams",
    votes: 42,
    replies: 4,
    time: "2d ago",
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export const achievements: Achievement[] = [
  { id: "first-lesson", title: "First Steps", description: "Complete your first lesson" },
  { id: "five-lessons", title: "Getting Warm", description: "Complete 5 lessons" },
  { id: "module-done", title: "Module Master", description: "Finish an entire module" },
  { id: "streak-7", title: "Week Warrior", description: "Keep a 7-day streak" },
  { id: "challenge", title: "Puzzle Solver", description: "Solve a daily challenge" },
  { id: "duel-win", title: "Duelist", description: "Win a Deathmatch" },
  { id: "xp-2000", title: "XP Collector", description: "Reach 2,000 XP" },
  { id: "project", title: "Builder", description: "Finish a project" },
];
