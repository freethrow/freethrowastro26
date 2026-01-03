import { render as renderToHtml } from 'datocms-structured-text-to-html-string';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

export function renderStructuredText(structuredText: any): string {
  if (!structuredText || !structuredText.value) {
    return '';
  }

  try {
    // First render with default renderer
    let html = renderToHtml(structuredText.value);

    // Then post-process to add syntax highlighting to code blocks
    // Match both class="language-X" and data-language="X" formats from DatoCMS
    html = html.replace(
      /<pre(?:\s+data-language="([^"]+)")?><code(?:\s+class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g,
      (match, dataLang, classLang, code) => {
        const language = dataLang || classLang || 'plaintext';
        // Decode HTML entities in the code
        const decodedCode = decodeHtmlEntities(code);

        let highlightedCode: string;
        try {
          const grammar = Prism.languages[language];
          if (grammar) {
            highlightedCode = Prism.highlight(decodedCode, grammar, language);
          } else {
            highlightedCode = escapeHtml(decodedCode);
          }
        } catch (e) {
          highlightedCode = escapeHtml(decodedCode);
        }

        return `<pre class="language-${language}"><code class="language-${language}">${highlightedCode}</code></pre>`;
      }
    );

    // Also handle markdown-style code blocks that weren't converted by DatoCMS
    html = html.replace(
      /<p>```(\w*)<\/p>([\s\S]*?)<p>```<\/p>/g,
      (match, language, codeContent) => {
        const lang = language || 'plaintext';
        const code = codeContent
          .replace(/<\/?p>/g, '\n')
          .trim();
        const decodedCode = decodeHtmlEntities(code);

        let highlightedCode: string;
        try {
          const grammar = Prism.languages[lang];
          if (grammar) {
            highlightedCode = Prism.highlight(decodedCode, grammar, lang);
          } else {
            highlightedCode = escapeHtml(decodedCode);
          }
        } catch (e) {
          highlightedCode = escapeHtml(decodedCode);
        }

        return `<pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre>`;
      }
    );

    return html;
  } catch (error) {
    console.error('Error rendering structured text:', error);
    return '<p>Error rendering content</p>';
  }
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
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
