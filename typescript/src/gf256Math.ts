namespace gf256 {
  export function add(a: number, b: number): number {
    ensureIsByte(a)
    ensureIsByte(b)
    return a ^ b
  }

  /**
   * The AES GF(256) subtraction is the same 'xor' operation as the addition, because the subtraction must be the
   * inverse of the addition, and 'xor' is the inverse of itself.
   */
  export function sub(a: number, b: number): number {
    return add(a, b)
  }

  export function mul(a: number, b: number) {
    ensureIsByte(a)
    ensureIsByte(b)
    return calculateMultiplication(a, b, 0)
  }

  export function div(a: number, b: number): number {
    // FIXME zero guard
    return mul(a, inverseTable[b - 1] || 0)
  }

  // private methods
  function calculateMultiplication(a: number, b: number, acc: number): number {
    if (a === 0 || b === 0) return acc
    else
      return calculateMultiplication(
        (a & 0x80) !== 0 ? (a << 1) ^ 0x11b : a << 1,
        b >> 1,
        (b & 0x01) !== 0 ? add(a, acc) : acc,
      )
  }

  function calculateInverseTable() {
    const inverseTable: number[] = []
    for (let n = 1; n <= 255; n++) {
      for (let k = 1; k <= 255; k++) {
        if (mul(k, n) === 1) {
          inverseTable.push(k)
          break
        }
      }
    }
    return inverseTable
  }

  const inverseTable = calculateInverseTable()

  function ensureIsByte(a: number) {
    if (a < 0) docutils.fail(`${a} is not a byte value.`)
    if (a > 255) docutils.fail(`${a} is not a byte value.`)
    if (Math.floor(a) !== a) docutils.fail(`${a} is not a byte value.`)
  }
}
