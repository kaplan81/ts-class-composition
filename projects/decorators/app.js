const fs = require('fs');
const path = require('path');

const indexFileName = 'index.html';
const indexPath = path.resolve(__dirname, indexFileName);
const version = process.argv[2];

if (!version) {
  console.error('Error: Version argument is missing.');
  process.exit(1);
}

const jsFilePath = `component-with-decorators-v${version}.js`;

fs.readFile(indexPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const distIndexPath = `dist/${indexFileName}`;
  const modifiedContent = data.replace('{{SCRIPT_PATH}}', jsFilePath);
  fs.writeFile(distIndexPath, modifiedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    import('open').then((open) => open.default('http://localhost:8080/'));
  });
});
