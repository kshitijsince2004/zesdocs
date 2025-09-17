export function suggestTags(input: { title?: string; description?: string }, limit: number = 3): string[] {
  const text = `${input.title || ''} ${input.description || ''}`.toLowerCase();
  const tags = new Set<string>();

  const rules: Array<{ test: RegExp; tag: string }> = [
    { test: /pitch|deck/, tag: 'pitch-deck' },
    { test: /design|figma|ui|ux/, tag: 'design' },
    { test: /marketing|growth|seo|ads?/, tag: 'marketing' },
    { test: /engineering|code|github|gitlab/, tag: 'engineering' },
    { test: /product|roadmap|feature/, tag: 'product' },
    { test: /ai|ml|machine learning|llm/, tag: 'ai' },
    { test: /research|paper|arxiv|pdf/, tag: 'research' },
  ];

  for (const { test, tag } of rules) {
    if (test.test(text)) tags.add(tag);
    if (tags.size >= limit) break;
  }

  return Array.from(tags).slice(0, limit);
}



