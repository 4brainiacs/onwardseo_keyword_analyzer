const WEIGHTS = {
  title: 2.0,
  h1: 1.5,
  h2: 1.2,
  h3: 1.0,
  h4: 0.8,
  position: 0.9,
  maxTotal: 7.4
};

export function calculateProminence(phrase, context) {
  let score = 0;
  const lowerPhrase = phrase.toLowerCase();

  // Title score
  if (context.title.toLowerCase().includes(lowerPhrase)) {
    score += WEIGHTS.title;
  }

  // Heading scores
  if (context.headings.h1.some(h => h.toLowerCase().includes(lowerPhrase))) {
    score += WEIGHTS.h1;
  }
  if (context.headings.h2.some(h => h.toLowerCase().includes(lowerPhrase))) {
    score += WEIGHTS.h2;
  }
  if (context.headings.h3.some(h => h.toLowerCase().includes(lowerPhrase))) {
    score += WEIGHTS.h3;
  }
  if (context.headings.h4.some(h => h.toLowerCase().includes(lowerPhrase))) {
    score += WEIGHTS.h4;
  }

  // Position score
  const firstIndex = context.content.toLowerCase().indexOf(lowerPhrase);
  if (firstIndex !== -1) {
    score += WEIGHTS.position * (1 - firstIndex / context.content.length);
  }

  return Number((score / WEIGHTS.maxTotal).toFixed(4));
}