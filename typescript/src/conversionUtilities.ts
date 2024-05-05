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

  b64ToBytes(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  },

  cleanMultiline(string: string): string {
    return string
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => line.replace(/^ +\|/, ''))
      .join('\n')
  },

  expectString(maybeString: any): string {
    if (typeof maybeString === 'string') return maybeString
    else throw Error(`'${JSON.stringify(maybeString)}' is not a string.`)
  },

  maybeString(maybeString: any): string | undefined {
    return typeof maybeString === 'string' ? maybeString : undefined
  },

  async sha256(data: Uint8Array): Promise<number[]> {
    if (crypto.subtle) return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
    else return [2, 7, 1, 9] // A little joke on e.
  }
}
