const gf256 = {
  add(a: number, b: number): number {
    gf256._.ensureIsByte(a)
    gf256._.ensureIsByte(b)
    return a ^ b
  },

  /**
   * The AES GF(256) subtraction is the same 'xor' operation as the addition, because the subtraction must be the
   * inverse of the addition, and 'xor' is the inverse of itself.
   */
  sub: (a: number, b: number) => gf256.add(a, b),

  mul(a: number, b: number) {
    gf256._.ensureIsByte(a)
    gf256._.ensureIsByte(b)
    return gf256._.calculateMultiplication(a, b, 0)
  },

  div: (_a: number, _b: number) => {
    throw new Error('not yet implemented')
  },

  // private methods
  _: {
    calculateMultiplication(a: number, b: number, acc: number): number {
      if (a === 0 || b === 0) return acc
      else
        return gf256._.calculateMultiplication(
          (a & 0x80) !== 0 ? (a << 1) ^ 0x11b : a << 1,
          b >> 1,
          (b & 0x01) !== 0 ? gf256.add(a, acc) : acc,
        )
    },

    ensureIsByte(a: number) {
      if (a < 0) docutils.fail(`${a} is not a byte value.`)
      if (a > 255) docutils.fail(`${a} is not a byte value.`)
      if (Math.floor(a) !== a) docutils.fail(`${a} is not a byte value.`)
    },
  },
}
