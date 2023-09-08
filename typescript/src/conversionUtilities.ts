const conversions = {
  utf8ToUint8(text: string): Uint8Array {
    return new TextEncoder().encode(text)
  },

  bytesToUtf8(bytes: number[]): string {
    return new TextDecoder().decode(new Uint8Array(bytes))
  },

  // --- currently unused ---
  // bytesToHex(bytes: number[]): string {
  //   return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
  // },

  bytesToB64(bytes: number[]): string {
    return btoa(bytes.map((byte) => String.fromCodePoint(byte)).join(''))
  },

  // --- currently unused ---
  // b64ToBytes(base64: string): Uint8Array {
  //   const binaryString = atob(base64)
  //   return Uint8Array.from(binaryString, (char) => {
  //     const codePoint = char.codePointAt(0)
  //     if (codePoint !== undefined) return codePoint
  //     else fail(`Decoding base64 '${base64}' failed.`)
  //   })
  // },

  cleanMultiline(string: string): string {
    return string
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => line.replace(/^ +\|/, ''))
      .join('\n')
  },

  expectString(maybeString: any): string {
    if (typeof maybeString === 'string') return maybeString
    else return docutils.fail(`'${JSON.stringify(maybeString)}' is not a string.`)
  },
  expectStringOrUndefined(maybeString: any): string | undefined {
    if (maybeString === undefined) return undefined
    else if (typeof maybeString === 'string') return maybeString
    else return docutils.fail(`'${JSON.stringify(maybeString)} is not a string.'`)
  },
}
