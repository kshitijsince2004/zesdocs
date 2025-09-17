import * as cheerio from 'cheerio';

export interface ParsedMetadata {
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
  canonicalUrl?: string;
}

export function parseHtmlMetadata(html: string, baseUrl?: string): ParsedMetadata {
  const $ = cheerio.load(html);

  const title = (
    $('meta[property="og:title"]').attr('content') ||
    $('title').first().text() ||
    undefined
  )?.trim();

  const description = (
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    undefined
  )?.trim();

  const image = (
    $('meta[property="og:image"]').attr('content') ||
    $('link[rel="image_src"]').attr('href') ||
    undefined
  )?.trim();

  const siteName = (
    $('meta[property="og:site_name"]').attr('content') ||
    undefined
  )?.trim();

  const canonicalUrl = (
    $('link[rel="canonical"]').attr('href') ||
    undefined
  )?.trim();

  return { title, description, image, siteName, canonicalUrl };
}
