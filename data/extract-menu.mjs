import { writeFileSync } from 'fs';

const url = 'https://pcmap.place.naver.com/restaurant/2033717879/menu/list';
const res = await fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36',
    'Referer': 'https://map.naver.com/',
    'Accept-Language': 'ko-KR,ko;q=0.9',
  }
});
const html = await res.text();

// Find the state object that contains menu data
// It's embedded as a JS assignment in a <script> tag
const scriptMatch = html.match(/window\.__(?:APOLLO|REDUX|PRELOADED)_STATE__\s*=\s*(\{.+?\});\s*(?:<\/script>|window\.)/s);

let menus = [];

if (scriptMatch) {
  const state = JSON.parse(scriptMatch[1]);
  menus = Object.entries(state)
    .filter(([k]) => k.startsWith('Menu:'))
    .map(([, v]) => ({
      id: v.id,
      name: v.name,
      price: v.price ? parseInt(v.price) : 0,
      description: v.description,
      recommend: v.recommend,
      images: (v.images || []).map(img => img.replace(/\u002F/g, '/')),
    }));
} else {
  // Fallback: parse individual Menu entries from the raw HTML
  const start = html.indexOf('"Menu:2033717879_0"');
  if (start !== -1) {
    // Find the surrounding object - it's inside a script tag
    const scriptStart = html.lastIndexOf('<script', start);
    const scriptEnd = html.indexOf('</script>', start);
    const scriptContent = html.slice(scriptStart, scriptEnd);
    
    // Extract the big state object
    const objStart = scriptContent.indexOf('{');
    // Use regex to find all Menu entries
    const menuPattern = /"Menu:2033717879_(\d+)":\{([^}]+(?:\{[^}]*\}[^}]*)*)\}/g;
    for (const m of scriptContent.matchAll(/"Menu:2033717879_(\d+)":\{"__typename":"Menu","priority":(?:null|\d+),"name":"([^"]+)","price":"([^"]*)","recommend":(true|false),"nameForBlogReview":"[^"]*","change":[^,]+,"priceType":[^,]+,"description":"([^"]*)","images":\[([^\]]*)\],"id":"([^"]+)","index":(\d+)\}/g)) {
      const images = m[6] ? m[6].split(',').map(s => s.trim().replace(/"/g, '').replace(/\u002F/g, '/')) : [];
      menus.push({
        id: m[7],
        index: parseInt(m[8]),
        name: m[2],
        price: parseInt(m[3]) || 0,
        description: m[5],
        recommend: m[4] === 'true',
        images,
      });
    }
  }
}

console.log(`Found ${menus.length} menus`);
menus.forEach(m => console.log(`${m.name} | ${m.price}원`));

writeFileSync(
  new URL('./naver-menu.json', import.meta.url),
  JSON.stringify(menus, null, 2),
  'utf-8'
);
