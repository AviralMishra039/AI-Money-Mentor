const DIRECTIVE_PHRASES = [
  { pattern: /you must buy/gi, replacement: 'you may consider buying' },
  { pattern: /you should invest in/gi, replacement: 'you could consider investing in' },
  { pattern: /guaranteed returns/gi, replacement: 'expected returns (not guaranteed)' },
  { pattern: /will definitely/gi, replacement: 'may' },
  { pattern: /I recommend buying/gi, replacement: 'one option to consider is' },
  { pattern: /best fund is/gi, replacement: 'a fund category to consider is' },
  { pattern: /you will earn/gi, replacement: 'you could potentially earn' },
]

export function runGuardrail(aiOutput: Record<string, unknown>): {
  output: Record<string, unknown>
  flagged_count: number
} {
  let flagged_count = 0
  const outputStr = JSON.stringify(aiOutput)

  let cleaned = outputStr
  for (const { pattern, replacement } of DIRECTIVE_PHRASES) {
    const before = cleaned
    cleaned = cleaned.replace(pattern, replacement)
    if (cleaned !== before) flagged_count++
  }

  return {
    output: JSON.parse(cleaned),
    flagged_count
  }
}
