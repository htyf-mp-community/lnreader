const fs = require('fs')
const path = require('path')

const jsCode = fs.readFileSync(path.join(__dirname, './js/index.js'), 'utf-8')
const cssCode = fs.readFileSync(path.join(__dirname, './css/index.css'), 'utf-8')

fs.writeFileSync(path.join(__dirname, 'index.tsx'), `
export const jsCode = "${encodeURIComponent(jsCode)}"
export const cssCode = "${encodeURIComponent(cssCode)}"
`, 'utf-8')