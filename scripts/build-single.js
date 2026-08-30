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

// 圖片 -> data URI，讓單檔完全離線可用。
// SVG 走 utf8，點陣圖一定要走 base64 —— 用 utf8 讀 PNG 會被 replacement
// character 吃掉，產出的檔案又大又不能顯示。
const MIME = {
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif', '.avif': 'image/avif',
};

/** 用檔頭判斷真實格式，不相信副檔名（repo 裡有內容是 JPEG 卻叫 .png 的檔案）。 */
function sniff(buf, fallback) {
  if (buf.length >= 12) {
    if (buf[0] === 0x89 && buf.toString('latin1', 1, 4) === 'PNG') return 'image/png';
    if (buf[0] === 0xFF && buf[1] === 0xD8 && buf[2] === 0xFF) return 'image/jpeg';
    if (buf.toString('latin1', 0, 3) === 'GIF') return 'image/gif';
    if (buf.toString('latin1', 0, 4) === 'RIFF' && buf.toString('latin1', 8, 12) === 'WEBP') return 'image/webp';
    if (buf.toString('latin1', 4, 8) === 'ftyp' && buf.toString('latin1', 8, 12).startsWith('avif')) return 'image/avif';
  }
  return fallback;
}
const imgDir = path.join(root, 'assets/img');
const imgMap = {};
let skipped = [];
for (const f of fs.readdirSync(imgDir)) {
  const ext = path.extname(f).toLowerCase();
  const mime = MIME[ext];
  if (!mime) { skipped.push(f); continue; }
  const abs = path.join(imgDir, f);
  if (ext === '.svg') {
    const svg = fs.readFileSync(abs, 'utf8').replace(/\s*\n\s*/g, ' ').trim();
    imgMap[f] = 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
  } else {
    const buf = fs.readFileSync(abs);
    const real = sniff(buf, mime);
    if (real !== mime) console.log(`  註：${f} 的內容其實是 ${real}，已用實際格式編碼`);
    imgMap[f] = `data:${real};base64,` + buf.toString('base64');
  }
}
if (skipped.length) console.log('  略過非圖片檔：' + skipped.join(', '));

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
const kb = Buffer.byteLength(html) / 1024;
console.log('✓ dist/aura-shop.html  (' + kb.toFixed(0) + ' KB)');
if (kb > 4096) {
  console.log('  ⚠ 超過 4MB。點陣圖轉 base64 會膨脹約 33%，');
  console.log('    建議先把 assets/img 的 PNG 壓成 WebP（寬度 1200px 以內）再打包。');
}

/* --artifact：再產一份「只有 body 內容」的版本。
   給 Claude Artifact 這類會自己包 <!doctype>/<head>/<body> 的宿主用。 */
if (process.argv.includes('--artifact')) {
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)[1];
  const art =
    '<title>AURA 選物</title>\n' +
    '<style>\n@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;500;600;700&family=Noto+Serif+TC:wght@500;600&family=Unna:wght@400;700&display=swap");\n' +
    css + '\n</style>\n' + body.trim() + '\n';
  fs.writeFileSync(path.join(root, 'dist/artifact.html'), art);
  console.log('✓ dist/artifact.html   (' + (Buffer.byteLength(art) / 1024).toFixed(0) + ' KB)');
}
