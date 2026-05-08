/**
 * 사진을 web-safe slug 이름으로 변경 + photos/manifest.json 생성.
 * Run: node scripts/rename-photos.mjs
 */
import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('public/photos')

const yangjaeDir = path.join(root, 'locations/yangjae')
const euljiroDir = path.join(root, 'locations/euljiro')
const foodDir = path.join(root, 'food')

// 양재역점 11장 → 의미있는 영문 슬러그
const yangjaeMap = {
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (37).jpg': 'room-reed-glass.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (38).jpg': 'bonkwan-long-table.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (39).jpg': 'bonkwan-variant.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (64).jpg': 'group-11seats.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (123).jpg': 'room-diamond-booth.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (124).jpg': 'bonkwan-mood-counter.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (126).jpg': 'bonkwan-diamond-wide.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (127).jpg': 'counter-yellow-led.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (128).jpg': 'booth-diamond-close.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (129).jpg': 'bonkwan-concrete-wide.jpg',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (131).jpg': 'exterior-jirisan-signage.jpg',
}

// 더룸 을지로 — 하이라이트 8장만 명명, 나머지는 photo-XX.jpg 일관 명명
const euljiroHighlights = {
  '동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (15).jpg': 'hero-moon-room.jpg',
  '동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (5).jpg': 'long-banquet.jpg',
  '동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (35).jpg': 'wave-wall.jpg',
  '동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (40).jpg': 'moonjar-window.jpg',
  '동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (45).jpg': 'exterior-kbbq.jpg',
  '동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (25).jpg': 'entry-counter.jpg',
  '동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (1).jpg': 'booth-diamond.jpg',
  '동대문맛집 회식 단체모임 데이트 소고기 삼겹살 추천 (20).jpg': 'wide-banquet.jpg',
}

const foodMap = {
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (2).png': 'avocado-yukhoe-mini.png',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (3).png': 'modeum-platter.png',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (4).png': 'bulgogi-set.png',
  '동대문맛집 회식 단체모임 룸 소고기 삼겹살 데이트 추천 (20).jpg': 'yukhoe-bowl.jpg',
}

function renameMap(dir, map) {
  for (const [from, to] of Object.entries(map)) {
    const src = path.join(dir, from)
    const dst = path.join(dir, to)
    if (fs.existsSync(src)) {
      fs.renameSync(src, dst)
      console.log(`  ${from.slice(0, 50)}... -> ${to}`)
    }
  }
}

function renameRemainingToSequence(dir) {
  // remaining files: rename to photo-NN.jpg keeping Korean filenames out of url paths
  let counter = 1
  const files = fs.readdirSync(dir).sort()
  for (const f of files) {
    if (!/[가-힣]/.test(f)) continue // already web-safe
    const ext = path.extname(f).toLowerCase()
    let dst = `photo-${String(counter).padStart(2, '0')}${ext}`
    while (fs.existsSync(path.join(dir, dst))) {
      counter += 1
      dst = `photo-${String(counter).padStart(2, '0')}${ext}`
    }
    fs.renameSync(path.join(dir, f), path.join(dir, dst))
    console.log(`  remaining ${f.slice(0, 40)}... -> ${dst}`)
    counter += 1
  }
}

console.log('Renaming Yangjae 11 photos...')
renameMap(yangjaeDir, yangjaeMap)

console.log('\nRenaming Eulji-ro highlights (8)...')
renameMap(euljiroDir, euljiroHighlights)

console.log('\nRenaming Eulji-ro remaining (41 → photo-NN.jpg)...')
renameRemainingToSequence(euljiroDir)

console.log('\nRenaming food photos...')
renameMap(foodDir, foodMap)

console.log('\nDone.')
