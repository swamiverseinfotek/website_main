const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');

const sectionStarts = [];
lines.forEach((l, i) => {
  if (l.includes('<section')) {
    sectionStarts.push({ line: i + 1, content: l.trim() });
  }
});
console.log(JSON.stringify(sectionStarts, null, 2));
