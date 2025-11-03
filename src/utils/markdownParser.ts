/**
 * Simple, fast Markdown parser optimized for blog posts
 * Supports: headings, bold, italic, lists, code, blockquotes, links, images
 */

interface ParseOptions {
  sanitize?: boolean;
}

export function parseMarkdown(content: string, options: ParseOptions = {}): string {
  let html = content;

  // Escape HTML special chars (basic sanitization)
  if (options.sanitize) {
    html = html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // Headings: # H1, ## H2, ### H3, etc.
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-xl font-bold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-3xl font-black mt-10 mb-5">$1</h1>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr class="my-8 border-white/10" />');

  // Code blocks: ```language ... ```
  html = html.replace(
    /```([a-z]*)\n([\s\S]*?)```/g,
    '<pre class="bg-white/5 border border-white/10 rounded-lg p-4 overflow-x-auto my-4"><code class="text-sm text-[#00ffd1]">$2</code></pre>'
  );

  // Inline code: `code`
  html = html.replace(
    /`([^`]+)`/g,
    '<code class="bg-white/10 px-2 py-1 rounded text-[#00ffd1] text-sm">$1</code>'
  );

  // Bold: **text** or __text__
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong class="font-bold text-white">$1</strong>');

  // Italic: *text* or _text_
  html = html.replace(/\*(.*?)\*/g, '<em class="italic text-white/90">$1</em>');
  html = html.replace(/_(.+?)_/g, '<em class="italic text-white/90">$1</em>');

  // Links: [text](url)
  html = html.replace(
    /\[(.*?)\]\((.*?)\)/g,
    '<a href="$2" class="text-[#00ffd1] hover:underline">$1</a>'
  );

  // Images: ![alt](src)
  html = html.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />'
  );

  // Blockquotes: > text
  html = html.replace(
    /^> (.+)$/gm,
    '<blockquote class="border-l-4 border-[#00ffd1] pl-4 py-2 italic text-white/70 my-4">$1</blockquote>'
  );

  // Unordered lists: - item or * item
  html = html.replace(
    /^[\*\-] (.+)$/gm,
    '<li class="text-white/80 ml-4">$1</li>'
  );
  html = html.replace(
    /(<li.*?<\/li>)/s,
    '<ul class="list-disc my-4">$1</ul>'
  );

  // Ordered lists: 1. item
  html = html.replace(
    /^\d+\. (.+)$/gm,
    '<li class="text-white/80 ml-4">$1</li>'
  );
  html = html.replace(
    /(<li.*?<\/li>)/s,
    '<ol class="list-decimal my-4">$1</ol>'
  );

  // Paragraphs: split by double newlines
  html = html
    .split('\n\n')
    .map(para => {
      para = para.trim();
      // Skip if already HTML
      if (para.startsWith('<') || !para) return '';
      return `<p class="text-white/80 leading-relaxed mb-4">${para}</p>`;
    })
    .join('\n');

  return html;
}

/**
 * Extract plain text from markdown (for summaries, etc.)
 */
export function extractText(markdown: string): string {
  return markdown
    .replace(/[*_]/g, '')
    .replace(/\[(.*?)\]/g, '$1')
    .replace(/!\[.*?\]/g, '')
    .replace(/`/g, '')
    .replace(/^#+\s/gm, '')
    .replace(/^>\s/gm, '')
    .replace(/^[-*+]\s/gm, '')
    .trim();
}

/**
 * Count reading time (average 200 words per minute)
 */
export function calculateReadTime(content: string): number {
  const text = extractText(content);
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}
