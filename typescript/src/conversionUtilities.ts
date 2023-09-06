function utf8ToUint8(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

function bytesToUtf8(bytes: number[]): string {
  return new TextDecoder().decode(new Uint8Array(bytes))
}

// --- currently unused ---
// function bytesToHex(bytes: number[]): string {
//   return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
// }

function bytesToB64(bytes: number[]): string {
  return btoa(bytes.map((byte) => String.fromCodePoint(byte)).join(''))
}

// --- currently unused ---
// function b64ToBytes(base64: string): Uint8Array {
//   const binaryString = atob(base64)
//   return Uint8Array.from(binaryString, (char) => {
//     const codePoint = char.codePointAt(0)
//     if (codePoint !== undefined) return codePoint
//     else fail(`Decoding base64 '${base64}' failed.`)
//   })
// }

function cleanMultiline(string: string): string {
  return string
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => line.replace(/^ +\|/, ''))
    .join('\n')
}
