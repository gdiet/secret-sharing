const shamirShare = {
  randomInt(fromInclusive: number, untilExclusive: number) {
    const fakerandom = parseInt(new URLSearchParams(document.location.search).get('fakerandom') || '0')
    if (fakerandom != 0) return (fakerandom % (untilExclusive - fromInclusive)) + fromInclusive
    else return Math.floor(Math.random() * (untilExclusive - fromInclusive) + fromInclusive)
  },

  shareSecret(secretBytes: number[], numberOfShares: number, threshold: number): number[][] {
    const polynomials = shamirShare._.generatePolynomials(secretBytes, threshold)
    const result: number[][] = []
    for (let share = 1; share <= numberOfShares; share++)
      result.push([share, ...polynomials.map((polynomial) => shamirShare._.evaluate(polynomial, share))])
    return result
  },

  // private methods
  _: {
    generatePolynomials(secretBytes: number[], threshold: number): number[][] {
      return secretBytes.map((secretByte) => shamirShare._.generatePolynomial(secretByte, threshold))
    },

    generatePolynomial(firstByte: number, arraySize: number): number[] {
      const polynomial: number[] = new Array(arraySize)
      polynomial[0] = firstByte
      for (let i = 1; i < arraySize - 1; i++) polynomial[i] = shamirShare.randomInt(0, 256)
      polynomial[arraySize - 1] = shamirShare.randomInt(1, 256)
      return polynomial
    },

    /** @see https://en.wikipedia.org/wiki/Horner%27s_method */
    evaluate(polynomial: number[], share: number): number {
      let result = 0
      // Note: ES2023 introduces Array.prototype.toReversed() which is the combination of clone + reverse,
      // see e.g.https://tc39.es/ecma262/2023/
      for (const coefficient of Array.from(polynomial).reverse())
        result = gf256.add(gf256.mul(result, share), coefficient)
      return result
    },
  },
}
