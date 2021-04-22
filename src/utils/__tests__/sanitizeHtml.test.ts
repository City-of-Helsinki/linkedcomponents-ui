import sanitizeHtml from '../sanitizeHtml';

test('should sanitize html correctly', () => {
  const html = `<h1 style="text-align:start;"><span style="color: rgb(0,0,0);font-family: Times;">Heading 1</span></h1>
  <h2><span>Heading 2</span></h2>
  <h3><span>Heading 3</span></h3>
  <p style="text-align:start;">Normal text<br><strong>Bold text</strong><br><em>Italic text</em></p>
  <blockquote><em>Block quote</em></blockquote>
  <ul>
  <li>List 1</li>
  <li>List 2</li>
  </ul>
  <ol>
  <li>Ordered list 1</li>
  <li>Ordered list 2</li>
  </ol>
  <p><a href="http://google.com">Link</a></p>`;

  const sanitizedHtml = `Heading 1
  Heading 2
  Heading 3
  <p>Normal text<br /><strong>Bold text</strong><br /><em>Italic text</em></p>
  <blockquote><em>Block quote</em></blockquote>
  <ul>
  <li>List 1</li>
  <li>List 2</li>
  </ul>
  <ol>
  <li>Ordered list 1</li>
  <li>Ordered list 2</li>
  </ol>
  <p><a href="http://google.com">Link</a></p>`;

  expect(sanitizeHtml(html)).toBe(sanitizedHtml);
});
