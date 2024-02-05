/**
 * This script assumes that TS files have been compiled
 * to JS files and that index.html has been
 * copied to the dist folder.
 */

const fs = require('fs');
const version = process.argv[2];

if (!version) {
  console.error('Error: Version argument is missing.');
  process.exit(1);
}

const distPath = 'dist';
const indexFileName = 'index.html';
const encoding = 'utf8';
const jsFileName = `app-v${version}.component.js`;
const indexFileDistPath = `${distPath}/${indexFileName}`;
const jsFileDistPath = `${distPath}/${jsFileName}`;

fs.readFile(jsFileDistPath, encoding, (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }
  const modifiedContent = data.replace(/^import .*?;\n*/gm, '');
  fs.writeFile(jsFileDistPath, modifiedContent, encoding, (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log(
      'app-vx.component.js has been successfully compiled and modified.'
    );
    fs.readFile(indexFileDistPath, encoding, (err, data) => {
      if (err) {
        console.error('Error reading file:', err);
        return;
      }
      const distIndexPath = `dist/${indexFileName}`;
      const modifiedContent = data.replace('{{SCRIPT_PATH}}', jsFileName);
      fs.writeFile(distIndexPath, modifiedContent, 'utf8', (err) => {
        if (err) {
          console.error('Error writing file:', err);
          return;
        }
        console.log(
          `${indexFileName} has been successfully copied and modified.`
        );
      });
    });
  });
});
