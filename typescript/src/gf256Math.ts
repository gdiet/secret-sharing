const gf256 = {
  add(a: number, b: number): number {
    gf256._.ensureIsByte(a)
    gf256._.ensureIsByte(b)
    return a ^ b
  },

  mul(a: number, b: number) {
    gf256._.ensureIsByte(a)
    gf256._.ensureIsByte(b)
    return gf256._.calculateMultiplication(a, b, 0)
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
