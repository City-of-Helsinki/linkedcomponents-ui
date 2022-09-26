import htmlTags from 'html-tags';

const full = new RegExp(
  htmlTags.map((tag) => `<${tag}\\b[^>]*>`).join('|'),
  'i'
);

export default function isHtml(str: string): boolean {
  return full.test(str.trim());
}
