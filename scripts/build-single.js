#!/usr/bin/env node
/**
 * 把 index.html + CSS + JS + SVG 全部內嵌成一個 dist/aura-shop.html
 * 用途：丟給別人預覽、上傳到只吃單檔的地方。
 * 用法：node scripts/build-single.js
 */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

let html = read('index.html');
const css = read('assets/css/style.css');
const js = ['data.js', 'store.js', 'views.js', 'app.js'].map(f => read('assets/js/' + f)).join('\n\n');

// SVG -> data URI，讓單檔完全離線可用
const imgDir = path.join(root, 'assets/img');
const imgMap = {};
for (const f of fs.readdirSync(imgDir)) {
  const svg = fs.readFileSync(path.join(imgDir, f), 'utf8').replace(/\s*\n\s*/g, ' ').trim();
  imgMap[f] = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

// 注意：一律用「函式」當 replacement。程式碼裡有 'NT$' 這種字串，
// 直接傳字串會被 String.replace 當成 $' 之類的特殊樣式而吃掉內容。
const sub = (str, re, val) => str.replace(re, () => val);

// 單檔版把 IMG() 換成查表（先改原始碼，再內嵌）
const jsInlined = sub(js,
  "const IMG = f => 'assets/img/' + f;",
  "const IMG = f => (typeof __IMG__ !== 'undefined' && __IMG__[f]) || ('assets/img/' + f);"
);

html = sub(html, /<link rel="stylesheet" href="assets\/css\/style\.css">/, `<style>\n${css}\n</style>`);
html = html.replace(/<script src="assets\/js\/[^"]+"><\/script>\s*/g, '');
html = sub(html, /<\/body>/,
  '<script>\nconst __IMG__ = ' + JSON.stringify(imgMap) + ';\n' + jsInlined + '\n</script>\n</body>');
html = sub(html, /og:image" content="assets\/img\/hero\.svg"/, 'og:image" content=""');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/aura-shop.html'), html);
console.log('✓ dist/aura-shop.html  (' + (Buffer.byteLength(html) / 1024).toFixed(0) + ' KB)');

/* --artifact：再產一份「只有 body 內容」的版本。
   給 Claude Artifact 這類會自己包 <!doctype>/<head>/<body> 的宿主用。 */
if (process.argv.includes('--artifact')) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
  const art =
    '<title>AURA 選物</title>\n' +
    '<style>\n@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@500;600&display=swap");\n' +
    css + '\n</style>\n' + body.trim() + '\n';
  fs.writeFileSync(path.join(root, 'dist/artifact.html'), art);
  console.log('✓ dist/artifact.html   (' + (Buffer.byteLength(art) / 1024).toFixed(0) + ' KB)');
}
