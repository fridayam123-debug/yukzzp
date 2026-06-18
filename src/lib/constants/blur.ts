const _svg = '<svg xmlns="http://www.w3.org/2000/svg"><rect fill="#1A100A"/></svg>'

function _toBase64(s: string): string {
  if (typeof btoa !== 'undefined') return btoa(s)
  if (typeof Buffer !== 'undefined') return Buffer.from(s).toString('base64')
  return ''
}

// 다크 에스프레소 배경의 1px blur placeholder — LCP 전 빈 공간 대신 어두운 배경 표시
export const BLUR_DATA_URL = `data:image/svg+xml;base64,${_toBase64(_svg)}`
