export type ContentType = 'document' | 'design' | 'code' | 'video' | 'audio' | 'article' | 'other';

export function classifyContentType(url: string, htmlSnippet?: string): ContentType {
  const u = url.toLowerCase();

  if (u.endsWith('.pdf')) return 'document';
  if (u.includes('figma.com')) return 'design';
  if (u.includes('github.com') || u.includes('gitlab.com')) return 'code';
  if (u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com')) return 'video';
  if (u.includes('soundcloud.com') || u.includes('spotify.com')) return 'audio';
  if (u.includes('docs.google.com')) return 'document';

  if (htmlSnippet) {
    const h = htmlSnippet.toLowerCase();
    if (h.includes('article') || h.includes('blog')) return 'article';
  }

  return 'other';
}



