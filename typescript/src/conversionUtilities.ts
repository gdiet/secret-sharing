namespace conversions {
  export function utf8ToUint8(text: string): Uint8Array {
    return new TextEncoder().encode(text)
  }

  export function bytesToUtf8(bytes: number[]): string {
    return new TextDecoder().decode(new Uint8Array(bytes))
  }

  // --- currently unused ---
  // bytesToHex(bytes: number[]): string {
  //   return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
  // },

  export function bytesToB64(bytes: number[]): string {
    return btoa(bytes.map((byte) => String.fromCodePoint(byte)).join(''))
  }

  export function b64ToBytes(base64: string): Uint8Array {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  }

  // FIXME find usage
  export function cleanMultiline(string: string): string {
    return string
      .split('\n')
      .filter((line) => line.trim() !== '')
      .map((line) => line.replace(/^ +\|/, ''))
      .join('\n')
  }

  export function expectString(maybeString: any): string {
    if (typeof maybeString === 'string') return maybeString
    else throw Error(`'${JSON.stringify(maybeString)}' is not a string.`)
  }

  export function maybeString(maybeString: any): string | undefined {
    return typeof maybeString === 'string' ? maybeString : undefined
  }

  export const sha256Available: boolean = crypto.subtle !== undefined

  export async function sha256(data: Uint8Array): Promise<number[]> {
    if (sha256Available) return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)))
    else return [2, 7, 1, 9] // A little joke on e.
  }
}
