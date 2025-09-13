// Script to copy React build files to Spring Boot static folder
const fs = require('fs');
const path = require('path');
const fse = require('fs-extra');

const buildDir = path.join(__dirname, 'build');
const targetDir = path.join(__dirname, '..', 'backend', 'src', 'main', 'resources', 'static');

if (!fs.existsSync(buildDir)) {
  console.error('Build directory does not exist. Run npm run build first.');
  process.exit(1);
}

fse.emptyDirSync(targetDir);
fse.copySync(buildDir, targetDir);
console.log('Copied build files to backend static folder.');
