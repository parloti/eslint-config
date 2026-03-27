/** Emoji prefixes allowed by the repository commit convention. */
const commitTypeEmojis = [
  "✨",
  "🐛",
  "📚",
  "💎",
  "📦",
  "🚀",
  "🚨",
  "🛠",
  "⚙️",
  "♻️",
  "🗑",
];

/** Regex-safe alternation used to parse emoji-prefixed commit headers. */
const emojiRegexPart = commitTypeEmojis.join("|");

/** Parser options shared between semantic-release commit analysis and notes generation. */
const parserOptions = {
  breakingHeaderPattern: new RegExp(
    String.raw`^(?:${emojiRegexPart})\s+(\w*)(?:\((.*)\))?!:\s+(.*)$`,
    "u",
  ),
  headerPattern: new RegExp(
    String.raw`^(?:${emojiRegexPart})\s+(\w*)(?:\((.*)\))?!?:\s+(.*)$`,
    "u",
  ),
};

/** Semantic-release configuration for automatic npm publishing from the default branches. */
const releaseConfig = {
  branches: ["master", "main"],
  plugins: [
    [
      "@semantic-release/commit-analyzer",
      {
        parserOpts: parserOptions,
        preset: "conventionalcommits",
      },
    ],
    [
      "@semantic-release/release-notes-generator",
      {
        parserOpts: parserOptions,
        preset: "conventionalcommits",
      },
    ],
    "@semantic-release/npm",
    "@semantic-release/github",
  ],
} as const;

export default releaseConfig;
