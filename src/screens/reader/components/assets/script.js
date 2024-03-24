const fs = require('fs')
const path = require('path')
const assetPath = path.join(__dirname, '../../../../../android/app/src/main/assets/');
const jsCode = fs.readFileSync(path.join(assetPath, './js/index.js'), 'utf-8')
const jsTextVibeCode = fs.readFileSync(path.join(assetPath, './js/text-vibe.js'), 'utf-8')
const cssCode = fs.readFileSync(path.join(assetPath, './css/index.css'), 'utf-8')

fs.writeFileSync(path.join(__dirname, 'index.tsx'), `
export const jsCode = "${encodeURIComponent(jsCode)}"
export const jsTextVibeCode = "${encodeURIComponent(jsTextVibeCode)}"
export const cssCode = "${encodeURIComponent(cssCode)}"
`, 'utf-8')