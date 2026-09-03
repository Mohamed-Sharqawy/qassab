const fs = require('fs');
const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('tracker.js')) {
    content = content.replace(/<head>/i, '<head>\n  <!-- Visitor & Google Ads Click Fraud Tracker -->\n  <script src="/tracker.js" defer></script>');
    fs.writeFileSync(f, content, 'utf8');
    console.log('Updated: ' + f);
  } else {
    console.log('Already has tracker: ' + f);
  }
});
