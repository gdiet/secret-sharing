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

  joinShares(shares: Uint8Array[]): number[] {
    // require(shares.stream().map(share -> share.length).collect(Collectors.toSet()).size() == 1, "Varying lengths of shares.");
    // require(shares.stream().map(Main::toHex).collect(Collectors.toSet()).size() == shares.size(), "Duplicate share detected.");
    if (shares[0] == undefined || shares[1] == undefined) throw new Error('At least two shares needed.')
    const length = shares[0].length
    if (length < 2) throw new Error('Shares not long enough.')
    const result: number[] = new Array(length - 1)
    for (let index = 0; index < length; index++) {
      const points: number[][] = shares.map((share) => [share[0] || 0, share[index + 1] || 0])
      result[index] = shamirShare._.interpolate(points)
    }
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

    /** @see https://en.wikipedia.org/wiki/Lagrange_polynomial */
    interpolate(data: number[][]): number {
      return data.reduce((r, [x1, y], i) => {
        const t = data.reduce((t, [x2, _], j) => {
          // The divisor x2 is (x - x2) which is (0 - x2), and 'minus' being 'xor' is just x2.
          if (i === j) {
            return t
          } else {
            return gf256.mul(t, gf256.div(x2 || 0, gf256.sub(x1 || 0, x2 || 0)))
          }
        }, 1)
        return gf256.add(r, gf256.mul(t, y || 0))
      }, 0)
    },
  },
}
