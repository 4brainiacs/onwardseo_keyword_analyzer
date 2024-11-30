export function extractKeywords(words, phraseLength) {
  const phrases = {};
  const totalWords = words.length;

  for (let i = 0; i <= words.length - phraseLength; i++) {
    const phrase = words.slice(i, i + phraseLength).join(' ');
    if (isValidPhrase(phrase)) {
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }
  }

  return Object.entries(phrases)
    .map(([keyword, count]) => ({
      keyword,
      count,
      density: Number((count / (totalWords - phraseLength + 1)).toFixed(4))
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function isValidPhrase(phrase) {
  return (
    phrase.length >= 3 &&
    !phrase.match(/^\d+$/) &&
    !phrase.match(/^[^a-z]+$/)
  );
}