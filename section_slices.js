const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');

function findSection(startComment, nextComment) {
  const startIdx = html.indexOf(startComment);
  const endIdx = nextComment ? html.indexOf(nextComment) : html.indexOf('<!-- 11. SITE FOOTER');
  return {
    startComment,
    startIdx,
    endIdx,
    length: endIdx - startIdx,
    found: startIdx !== -1 && endIdx !== -1
  };
}

const sections = [
  '<!-- 5. PROBLEM-SOLVING PROCESS SECTION -->',
  '<!-- 6. FEATURED PROJECTS SECTION -->',
  '<!-- 7. ENGAGEMENT MODELS SECTION -->',
  '<!-- 8. WHY SWAMIVERSE INFOTEK? SECTION -->',
  '<!-- 8. INTERACTIVE PROJECT SCOPE & ARCHITECTURE ESTIMATOR -->',
  '<!-- 9. EXECUTIVE ARCHITECTURE FAQ SECTION -->',
  '<!-- 10. FINAL CONTACT SECTION WITH QUICK ARCHITECTURE FORMULATOR -->'
];

for (let i = 0; i < sections.length; i++) {
  const next = i < sections.length - 1 ? sections[i+1] : '<!-- 11. SITE FOOTER';
  console.log(findSection(sections[i], next));
}
