export type Level = "Beginner" | "Intermediate" | "Advanced";

export interface Quiz {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  body: string[];
  keyPoints: string[];
  code: string;
  quiz: Quiz;
}

export interface Module {
  id: string;
  index: number;
  title: string;
  level: Level;
  description: string;
  topics: string[];
  lessons: Lesson[];
}

export const LESSON_XP = 50;

export const modules: Module[] = [
  {
    id: "java-foundations",
    index: 1,
    title: "Java Foundations",
    level: "Beginner",
    description: "How Java runs, the JVM, and writing your very first program.",
    topics: ["JVM", "JDK", "main method", "compilation"],
    lessons: [
      {
        id: "what-is-java",
        title: "What is Java?",
        minutes: 8,
        summary: "Meet the language that runs on billions of devices.",
        body: [
          "Java is a **general-purpose, object-oriented** programming language designed around one promise: *write once, run anywhere*. Instead of compiling straight to machine code, Java compiles to **bytecode** that runs on the Java Virtual Machine (JVM).",
          "Because every operating system has its own JVM, the same `.class` file runs on Windows, macOS and Linux without changes. This portability is why Java powers Android apps, banking systems and large web backends.",
        ],
        keyPoints: [
          "Source code lives in `.java` files.",
          "The compiler `javac` turns it into bytecode (`.class`).",
          "The JVM executes bytecode on any platform.",
        ],
        code: `// Java source -> bytecode -> JVM
public class Main {
    public static void main(String[] args) {
        System.out.println("Java runs everywhere!");
    }
}`,
        quiz: {
          question: "What does the Java compiler produce?",
          options: ["Machine code", "Bytecode", "HTML", "A Python script"],
          answer: 1,
          explanation: "javac compiles source into platform-independent bytecode that the JVM runs.",
        },
      },
      {
        id: "first-program",
        title: "Your First Program",
        minutes: 10,
        summary: "Write, compile and run Hello World.",
        body: [
          "Every Java application starts at a method called `main`. Its exact signature, `public static void main(String[] args)`, tells the JVM where execution begins.",
          "To print text we call `System.out.println`, which writes a line to the console. Statements end with a **semicolon**, and code blocks are wrapped in **curly braces**.",
        ],
        keyPoints: [
          "The file name must match the public class name.",
          "`println` adds a new line; `print` does not.",
          "Missing semicolons are the most common beginner error.",
        ],
        code: `public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, CodeCraft!");
        System.out.print("Learning ");
        System.out.println("Java");
    }
}`,
        quiz: {
          question: "Which method is the entry point of a Java program?",
          options: ["start()", "run()", "main()", "init()"],
          answer: 2,
          explanation: "The JVM always looks for public static void main(String[] args).",
        },
      },
      {
        id: "jdk-jre-jvm",
        title: "JDK, JRE and JVM",
        minutes: 7,
        summary: "Understand the toolkit behind every Java program.",
        body: [
          "The **JDK** (Java Development Kit) is what developers install: it includes the compiler, debugger and the runtime. The **JRE** is the runtime environment needed only to run programs.",
          "The **JVM** sits inside the JRE and actually executes bytecode, managing memory through garbage collection so you rarely free memory by hand.",
        ],
        keyPoints: [
          "JDK = tools + JRE.",
          "JRE = JVM + core libraries.",
          "The garbage collector reclaims unused objects.",
        ],
        code: `// Compile and run from a terminal
// $ javac HelloWorld.java
// $ java HelloWorld
System.out.println(System.getProperty("java.version"));`,
        quiz: {
          question: "Which one do you need to compile Java code?",
          options: ["JRE only", "JVM only", "JDK", "A web browser"],
          answer: 2,
          explanation: "Only the JDK ships the javac compiler.",
        },
      },
    ],
  },
  {
    id: "variables-types",
    index: 2,
    title: "Variables & Data Types",
    level: "Beginner",
    description: "Store values with primitives, strings and type casting.",
    topics: ["int", "double", "String", "casting"],
    lessons: [
      {
        id: "primitive-types",
        title: "Primitive Data Types",
        minutes: 12,
        summary: "The eight building blocks of every Java value.",
        body: [
          "Java is **statically typed**: every variable has a type known at compile time. There are eight primitives: `byte`, `short`, `int`, `long`, `float`, `double`, `char` and `boolean`.",
          "Use `int` for whole numbers, `double` for decimals, `boolean` for true/false and `char` for single characters wrapped in single quotes.",
        ],
        keyPoints: [
          "`int` holds 32-bit whole numbers.",
          "`double` is the default for decimals.",
          "`char` uses single quotes: `'A'`.",
        ],
        code: `int age = 21;
double price = 49.99;
boolean isActive = true;
char grade = 'A';
System.out.println("Age: " + age);`,
        quiz: {
          question: "Which type stores true or false?",
          options: ["int", "char", "boolean", "String"],
          answer: 2,
          explanation: "boolean holds exactly two values: true and false.",
        },
      },
      {
        id: "strings",
        title: "Working with Strings",
        minutes: 11,
        summary: "Create, join and inspect text.",
        body: [
          "A `String` is an object that represents a sequence of characters. Strings are **immutable**: methods like `toUpperCase()` return a new string instead of changing the original.",
          "Join strings with `+` and compare them with `.equals()` — never with `==`, which compares references, not content.",
        ],
        keyPoints: [
          "Strings use double quotes.",
          "`length()`, `charAt()` and `substring()` are everyday tools.",
          "Compare with `.equals()`.",
        ],
        code: `String name = "Ada";
String greeting = "Hello, " + name;
System.out.println(greeting.toUpperCase());
System.out.println(name.length());`,
        quiz: {
          question: "How should you compare two strings' content?",
          options: ["a == b", "a.equals(b)", "a = b", "compare(a, b)"],
          answer: 1,
          explanation: ".equals() compares characters; == compares object references.",
        },
      },
      {
        id: "type-casting",
        title: "Type Casting",
        minutes: 9,
        summary: "Convert between numeric types safely.",
        body: [
          "**Widening** casts (int to double) happen automatically because no data is lost. **Narrowing** casts (double to int) need an explicit cast and drop the decimal part.",
          "To turn text into numbers use `Integer.parseInt()` or `Double.parseDouble()`.",
        ],
        keyPoints: [
          "Widening is automatic.",
          "Narrowing needs `(type)` and may lose data.",
          "Parse strings with wrapper classes.",
        ],
        code: `double score = 9.78;
int rounded = (int) score; // 9
int count = Integer.parseInt("42");
System.out.println(rounded + count);`,
        quiz: {
          question: "What is (int) 7.9?",
          options: ["8", "7", "7.9", "Compile error"],
          answer: 1,
          explanation: "Casting to int truncates toward zero, giving 7.",
        },
      },
    ],
  },
  {
    id: "operators-control",
    index: 3,
    title: "Operators & Control Flow",
    level: "Beginner",
    description: "Make decisions with conditions, logic and switch.",
    topics: ["if/else", "switch", "logical operators", "ternary"],
    lessons: [
      {
        id: "operators",
        title: "Operators",
        minutes: 10,
        summary: "Arithmetic, comparison and logical operators.",
        body: [
          "Arithmetic operators (`+ - * / %`) compute values. Comparison operators (`== != < >`) produce booleans, and logical operators (`&& || !`) combine them.",
          "Integer division drops the remainder: `7 / 2` is `3`. Use `%` to get the remainder.",
        ],
        keyPoints: ["`%` returns the remainder.", "`&&` short-circuits.", "`++` increments by one."],
        code: `int a = 7, b = 2;
System.out.println(a / b);  // 3
System.out.println(a % b);  // 1
System.out.println(a > b && b > 0);`,
        quiz: {
          question: "What is 17 % 5?",
          options: ["3", "2", "3.4", "12"],
          answer: 1,
          explanation: "17 divided by 5 is 3 with remainder 2.",
        },
      },
      {
        id: "if-else",
        title: "If, Else and Switch",
        minutes: 12,
        summary: "Branch your program based on conditions.",
        body: [
          "`if` runs a block only when its condition is true; `else if` and `else` handle the other cases. Conditions must be booleans.",
          "Modern Java's **switch expressions** use arrows and can return a value directly, making multi-branch logic much cleaner.",
        ],
        keyPoints: [
          "Conditions must evaluate to boolean.",
          "Switch expressions use `->`.",
          "The ternary `a ? b : c` is a compact if/else.",
        ],
        code: `int score = 82;
String grade = score >= 90 ? "A" : score >= 80 ? "B" : "C";
String day = switch (3) {
    case 1 -> "Mon";
    case 3 -> "Wed";
    default -> "Other";
};
System.out.println(grade + " " + day);`,
        quiz: {
          question: "Which keyword handles every remaining switch case?",
          options: ["else", "otherwise", "default", "final"],
          answer: 2,
          explanation: "default runs when no other case matches.",
        },
      },
    ],
  },
  {
    id: "loops",
    index: 4,
    title: "Loops",
    level: "Beginner",
    description: "Repeat work with for, while and do-while loops.",
    topics: ["for", "while", "break", "continue"],
    lessons: [
      {
        id: "for-loops",
        title: "For Loops",
        minutes: 11,
        summary: "Repeat code a known number of times.",
        body: [
          "A `for` loop has three parts: an initializer, a condition and an update. It is ideal when you know how many times to repeat.",
          "The **enhanced for-each** loop iterates directly over arrays and collections without managing an index.",
        ],
        keyPoints: [
          "`for (init; condition; update)`.",
          "for-each: `for (int n : numbers)`.",
          "Off-by-one errors are common — check `<` vs `<=`.",
        ],
        code: `for (int i = 1; i <= 5; i++) {
    System.out.println("Step " + i);
}
int[] nums = {3, 6, 9};
for (int n : nums) System.out.println(n);`,
        quiz: {
          question: "How many times does for (int i = 0; i < 4; i++) run?",
          options: ["3", "4", "5", "Forever"],
          answer: 1,
          explanation: "i takes the values 0, 1, 2 and 3 — four iterations.",
        },
      },
      {
        id: "while-loops",
        title: "While & Do-While",
        minutes: 9,
        summary: "Loop until a condition changes.",
        body: [
          "A `while` loop checks its condition before each iteration, so it may run zero times. A `do-while` loop always runs at least once.",
          "Use `break` to exit a loop early and `continue` to skip to the next iteration.",
        ],
        keyPoints: ["while may run zero times.", "do-while runs at least once.", "Always update the loop variable."],
        code: `int n = 3;
while (n > 0) {
    System.out.println(n);
    n--;
}
System.out.println("Liftoff!");`,
        quiz: {
          question: "Which loop always executes its body at least once?",
          options: ["for", "while", "do-while", "for-each"],
          answer: 2,
          explanation: "do-while checks its condition after the body runs.",
        },
      },
    ],
  },
  {
    id: "arrays-methods",
    index: 5,
    title: "Arrays & Methods",
    level: "Intermediate",
    description: "Group data in arrays and organise logic into methods.",
    topics: ["arrays", "methods", "parameters", "return values"],
    lessons: [
      {
        id: "arrays",
        title: "Arrays",
        minutes: 12,
        summary: "Store many values of the same type.",
        body: [
          "An array has a **fixed length** set at creation. Elements are accessed by index starting at `0`, and `array.length` gives its size.",
          "Accessing an index outside the range throws `ArrayIndexOutOfBoundsException`.",
        ],
        keyPoints: ["Indexes start at 0.", "Length is fixed.", "`Arrays.toString()` prints contents."],
        code: `int[] scores = {88, 92, 75};
scores[2] = 80;
System.out.println(scores.length);
System.out.println(java.util.Arrays.toString(scores));`,
        quiz: {
          question: "What is the index of the last element in an array of length 5?",
          options: ["5", "4", "6", "0"],
          answer: 1,
          explanation: "Indexes run from 0 to length − 1.",
        },
      },
      {
        id: "methods",
        title: "Methods",
        minutes: 13,
        summary: "Reusable blocks of logic with inputs and outputs.",
        body: [
          "A method groups statements under a name. It declares a **return type**, a name and a list of **parameters**. Use `void` when nothing is returned.",
          "**Overloading** lets several methods share a name as long as their parameter lists differ.",
        ],
        keyPoints: ["Return type comes before the name.", "`void` returns nothing.", "Overloads differ by parameters."],
        code: `static int square(int x) {
    return x * x;
}
static double square(double x) {
    return x * x;
}
System.out.println(square(6));`,
        quiz: {
          question: "Which return type means a method returns nothing?",
          options: ["null", "empty", "void", "none"],
          answer: 2,
          explanation: "void marks methods that do not return a value.",
        },
      },
    ],
  },
  {
    id: "oop",
    index: 6,
    title: "Object-Oriented Programming",
    level: "Intermediate",
    description: "Classes, objects, inheritance, polymorphism and interfaces.",
    topics: ["classes", "inheritance", "polymorphism", "interfaces", "encapsulation"],
    lessons: [
      {
        id: "classes-objects",
        title: "Classes & Objects",
        minutes: 14,
        summary: "Model real-world things in code.",
        body: [
          "A **class** is a blueprint; an **object** is an instance created with `new`. Classes bundle fields (state) and methods (behaviour).",
          "A **constructor** initialises new objects and has the same name as the class.",
        ],
        keyPoints: ["Create objects with `new`.", "`this` refers to the current object.", "Constructors have no return type."],
        code: `class Book {
    String title;
    Book(String title) { this.title = title; }
}
Book b = new Book("Clean Code");
System.out.println(b.title);`,
        quiz: {
          question: "Which keyword creates a new object?",
          options: ["create", "make", "new", "object"],
          answer: 2,
          explanation: "new allocates memory and calls the constructor.",
        },
      },
      {
        id: "inheritance",
        title: "Inheritance & Polymorphism",
        minutes: 15,
        summary: "Reuse and specialise behaviour.",
        body: [
          "A subclass `extends` a parent class and inherits its members. It can **override** methods to provide specialised behaviour.",
          "**Polymorphism** means a parent-type reference can point to any subclass object, and the right overridden method runs at runtime.",
        ],
        keyPoints: ["Java supports single class inheritance.", "Use `@Override`.", "`super` calls the parent."],
        code: `class Animal { String sound() { return "..."; } }
class Dog extends Animal {
    @Override String sound() { return "Woof"; }
}
Animal pet = new Dog();
System.out.println(pet.sound());`,
        quiz: {
          question: "Which keyword makes a class inherit from another?",
          options: ["implements", "extends", "inherits", "super"],
          answer: 1,
          explanation: "extends is used for class inheritance; implements is for interfaces.",
        },
      },
      {
        id: "interfaces",
        title: "Interfaces & Encapsulation",
        minutes: 13,
        summary: "Define contracts and protect state.",
        body: [
          "An **interface** declares methods a class promises to implement. A class can implement many interfaces.",
          "**Encapsulation** hides fields with `private` and exposes controlled access through getters and setters.",
        ],
        keyPoints: ["A class can implement many interfaces.", "Keep fields `private`.", "Validate in setters."],
        code: `interface Shape { double area(); }
class Circle implements Shape {
    private final double r;
    Circle(double r) { this.r = r; }
    public double area() { return Math.PI * r * r; }
}`,
        quiz: {
          question: "Which access modifier best supports encapsulation for fields?",
          options: ["public", "private", "static", "default"],
          answer: 1,
          explanation: "private fields can only be accessed inside their own class.",
        },
      },
    ],
  },
  {
    id: "collections",
    index: 7,
    title: "Collections Framework",
    level: "Advanced",
    description: "Lists, sets, maps and choosing the right structure.",
    topics: ["ArrayList", "HashMap", "HashSet", "generics"],
    lessons: [
      {
        id: "lists",
        title: "ArrayList & Generics",
        minutes: 12,
        summary: "Resizable lists with type safety.",
        body: [
          "`ArrayList` grows automatically as you add elements. **Generics** like `ArrayList<String>` make the compiler check element types.",
          "Collections store objects, so primitives are auto-boxed into wrappers such as `Integer`.",
        ],
        keyPoints: ["`add`, `get`, `remove`, `size`.", "Generics prevent type errors.", "Use `List` as the variable type."],
        code: `List<String> langs = new ArrayList<>();
langs.add("Java");
langs.add("Kotlin");
System.out.println(langs.size() + " " + langs.get(0));`,
        quiz: {
          question: "Which method returns the number of elements in an ArrayList?",
          options: ["length", "length()", "size()", "count()"],
          answer: 2,
          explanation: "Collections use size(); arrays use the length field.",
        },
      },
      {
        id: "maps-sets",
        title: "HashMap & HashSet",
        minutes: 13,
        summary: "Fast lookups by key and unique values.",
        body: [
          "A `HashMap` stores **key–value pairs** with near-constant lookup time. Keys are unique; putting an existing key replaces its value.",
          "A `HashSet` stores unique elements and is perfect for removing duplicates.",
        ],
        keyPoints: ["`put`, `get`, `containsKey`.", "Sets ignore duplicates.", "Iteration order is not guaranteed."],
        code: `Map<String, Integer> xp = new HashMap<>();
xp.put("Ada", 1250);
xp.put("Linus", 980);
System.out.println(xp.get("Ada"));`,
        quiz: {
          question: "What happens when you add a duplicate to a HashSet?",
          options: ["It throws an error", "It is stored twice", "It is ignored", "The set clears"],
          answer: 2,
          explanation: "Sets keep only unique elements; add returns false.",
        },
      },
    ],
  },
  {
    id: "exceptions-streams",
    index: 8,
    title: "Exceptions & Streams",
    level: "Advanced",
    description: "Handle errors gracefully and process data functionally.",
    topics: ["try/catch", "custom exceptions", "lambdas", "Stream API"],
    lessons: [
      {
        id: "exceptions",
        title: "Exception Handling",
        minutes: 14,
        summary: "Recover from errors without crashing.",
        body: [
          "Wrap risky code in `try` and handle failures in `catch`. A `finally` block always runs, making it ideal for cleanup.",
          "**Checked** exceptions must be declared or handled; **unchecked** exceptions extend `RuntimeException`.",
        ],
        keyPoints: ["Catch specific exceptions first.", "`finally` always runs.", "Use try-with-resources for streams."],
        code: `try {
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Cannot divide by zero");
} finally {
    System.out.println("Done");
}`,
        quiz: {
          question: "Which block always executes after try/catch?",
          options: ["catch", "final", "finally", "throw"],
          answer: 2,
          explanation: "finally runs whether or not an exception occurred.",
        },
      },
      {
        id: "streams",
        title: "Lambdas & Streams",
        minutes: 15,
        summary: "Filter, map and reduce collections expressively.",
        body: [
          "A **lambda** is a short anonymous function: `x -> x * 2`. The **Stream API** chains operations like `filter`, `map` and `collect`.",
          "Streams are lazy — nothing runs until a terminal operation such as `collect` or `forEach` is called.",
        ],
        keyPoints: ["Streams don't modify the source.", "Intermediate ops are lazy.", "End with a terminal op."],
        code: `List<Integer> nums = List.of(1, 2, 3, 4, 5, 6);
List<Integer> evens = nums.stream()
    .filter(n -> n % 2 == 0)
    .map(n -> n * n)
    .toList();
System.out.println(evens);`,
        quiz: {
          question: "Which is a terminal stream operation?",
          options: ["filter", "map", "collect", "sorted"],
          answer: 2,
          explanation: "collect triggers the pipeline and produces a result.",
        },
      },
    ],
  },
];

export const allLessons = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, moduleId: m.id, moduleTitle: m.title })),
);

export function findLesson(id: string) {
  return allLessons.find((l) => l.id === id);
}

export function nextLesson(id: string) {
  const i = allLessons.findIndex((l) => l.id === id);
  return i >= 0 ? allLessons[i + 1] : undefined;
}

export function prevLesson(id: string) {
  const i = allLessons.findIndex((l) => l.id === id);
  return i > 0 ? allLessons[i - 1] : undefined;
}
