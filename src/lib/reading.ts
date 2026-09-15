const CODE_FENCE_RE = /```[\s\S]*?```/g;
const INLINE_CODE_RE = /`[^`]+`/g;
// CJK Unified Ideographs, Extension A, and common CJK punctuation-free letters
const CJK_RE = /[぀-ヿ㐀-䶿一-鿿-鿿豈-﫿]/g;
const LATIN_WORD_RE = /[A-Za-z0-9]+(?:['-][A-Za-z0-9]+)*/g;

export interface ReadingMetrics {
  wordCount: number;
  readingMinutes: number;
}

export function getReadingMetrics(content: string): ReadingMetrics {
  const plain = content
    .replace(CODE_FENCE_RE, " ")
    .replace(INLINE_CODE_RE, " ")
    .replace(/[#>*_\[\]()!]/g, " ");

  const cjkCount = plain.match(CJK_RE)?.length ?? 0;
  const latinCount = plain.match(LATIN_WORD_RE)?.length ?? 0;
  const wordCount = cjkCount + latinCount;
  const minutes = cjkCount / 300 + latinCount / 200;

  return {
    wordCount,
    readingMinutes: Math.max(1, Math.round(minutes || 1)),
  };
}
