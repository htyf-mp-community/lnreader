const fs = require('fs')
const path = require('path')
const assetPath = path.join(__dirname, '../../../../../android/app/src/main/assets/');
const index_css = fs.readFileSync(path.join(assetPath, './css/index.css'), 'utf-8')
const icons_js = fs.readFileSync(path.join(assetPath, './js/icons.js'), 'utf-8')
const van_js = fs.readFileSync(path.join(assetPath, './js/van.js'), 'utf-8')
const text_vibe_js = fs.readFileSync(path.join(assetPath, './js/text-vibe.js'), 'utf-8')
const core_js = fs.readFileSync(path.join(assetPath, './js/core.js'), 'utf-8')
const index_js = fs.readFileSync(path.join(assetPath, './js/index.js'), 'utf-8')

fs.writeFileSync(path.join(__dirname, 'index.tsx'), `
export const index_css = "${encodeURIComponent(index_css)}"
export const icons_js = "${encodeURIComponent(icons_js)}"
export const van_js = "${encodeURIComponent(van_js)}"
export const text_vibe_js = "${encodeURIComponent(text_vibe_js)}"
export const core_js = "${encodeURIComponent(core_js)}"
export const index_js = "${encodeURIComponent(index_js)}"
`, 'utf-8')