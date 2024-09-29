export const reservedKeywords: string[] = [
  "instanceof",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "else",
  "export",
  "extends",
  "finally",
  "function",
  "import",
  "return",
  "super",
  "switch",
  "this",
  "throw",
  "typeof",
  "type",
  "from",
  "void",
  "while",
  "with",
  "yield",
  "await",
  "async",
  "enum",
  "implements",
  "interface",
  "package",
  "private",
  "protected",
  "public",
  "static",
  "super",
  "readonly",
  "try",
  "var",
  "if",
  "let",
  "new",
  "for",
  "in",
  "do",
];

export const tsTypes: string[] = [
  ": number",
  ": string",
  ": boolean",
  ": void",
  ": null",
  ": undefined",
  ": any",
  ": unknown",
  ": never",
  ": object",
  ": Array<T>", // or T[]
  ": Tuple<T1, T2, ...>", // For tuple types
  ": Function", // General function type
  ": Promise<T>", // For promise types
  ": RegExp", // Regular expression type
  ": Symbol", // Symbol type
  ": bigint", // BigInt type
  ": Date", // Date object type
  ": Set<T>", // Set type
  ": Map<K, V>", // Map type
  ": WeakSet<T>", // WeakSet type
  ": WeakMap<K, V>", // WeakMap type
  ": ReadonlyArray<T>", // Read-only array type
  ": Readonly<T>", // Read-only type
];
