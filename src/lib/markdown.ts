import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { marked } from 'marked';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

export interface MarkdownArticle {
  slug: string;
  title: string;
  short: string;
  category: string;
  cover: string;
  date: string;
  published: boolean;
  content: string;
  source: 'markdown';
}

const articlesDirectory = path.join(process.cwd(), 'src/content/articles');

export function getMarkdownArticles(): MarkdownArticle[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);
  const articles = fileNames
    .filter((fileName) => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title || slug,
        short: data.short || '',
        category: data.category || '',
        cover: data.cover || '',
        date: data.date || '',
        published: data.published !== false,
        content,
        source: 'markdown' as const,
      };
    })
    .filter((article) => article.published);

  return articles;
}

export function getMarkdownArticleBySlug(slug: string): MarkdownArticle | null {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title || slug,
    short: data.short || '',
    category: data.category || '',
    cover: data.cover || '',
    date: data.date || '',
    published: data.published !== false,
    content,
    source: 'markdown' as const,
  };
}

export function renderMarkdown(content: string): string {
  // Configure marked to use Prism for code highlighting
  const renderer = new marked.Renderer();

  renderer.code = function({ text, lang }) {
    const language = lang || 'plaintext';
    let highlighted: string;

    try {
      const grammar = Prism.languages[language];
      if (grammar) {
        highlighted = Prism.highlight(text, grammar, language);
      } else {
        highlighted = escapeHtml(text);
      }
    } catch (e) {
      highlighted = escapeHtml(text);
    }

    return `<pre class="language-${language}"><code class="language-${language}">${highlighted}</code></pre>`;
  };

  marked.setOptions({
    renderer,
    gfm: true,
    breaks: false,
  });

  return marked.parse(content) as string;
}

function escapeHtml(text: string): string {
  const htmlEscapes: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}
