const fs = require('fs');

const jsFilePath = 'dist/component-with-mixins.js';

fs.readFile(jsFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const modifiedContent = data.replace(/^import .*?;\n*/gm, '');
  fs.writeFile(jsFilePath, modifiedContent, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    import('open').then((open) => open.default('http://localhost:8080/'));
  });
});
