namespace shamirShare {
  export function shareSecret(secretBytes: number[], numberOfShares: number, threshold: number): number[][] {
    const polynomials = generatePolynomials(secretBytes, threshold)
    const result: number[][] = []
    for (let share = 1; share <= numberOfShares; share++)
      result.push([share, ...polynomials.map((polynomial) => evaluate(polynomial, share))])
    return result
  }

  export function joinShares(shares: Uint8Array[]): number[] {
    // require(shares.stream().map(share -> share.length).collect(Collectors.toSet()).size() == 1, "Varying lengths of shares.");
    // require(shares.stream().map(Main::toHex).collect(Collectors.toSet()).size() == shares.size(), "Duplicate share detected.");
    if (shares[0] == undefined || shares[1] == undefined) throw new Error('At least two shares needed.')
    const secretLength = shares[0].length - 1
    if (secretLength < 1) throw new Error('Shares not long enough.')
    const result: number[] = new Array(secretLength - 1)
    for (let index = 0; index < secretLength; index++) {
      const points: number[][] = shares.map((share) => [share[0] || 0, share[index + 1] || 0])
      result[index] = interpolate(points)
    }
    return result
  }

  /**
   * A random generator returning integers between a (inclusive) and b (exclusive).
   */
  function randomInt(fromInclusive: number, untilExclusive: number) {
    const fakerandom = parseInt(new URLSearchParams(document.location.search).get('fakerandom') || '0')
    if (fakerandom != 0) return (fakerandom % (untilExclusive - fromInclusive)) + fromInclusive
    else return Math.floor(Math.random() * (untilExclusive - fromInclusive) + fromInclusive)
  }

  function generatePolynomials(secretBytes: number[], threshold: number): number[][] {
    return secretBytes.map((secretByte) => generatePolynomial(secretByte, threshold))
  }

  function generatePolynomial(firstByte: number, arraySize: number): number[] {
    const polynomial: number[] = new Array(arraySize)
    polynomial[0] = firstByte
    for (let i = 1; i < arraySize - 1; i++) polynomial[i] = randomInt(0, 256)
    polynomial[arraySize - 1] = randomInt(1, 256)
    return polynomial
  }

  /** @see https://en.wikipedia.org/wiki/Horner%27s_method */
  function evaluate(polynomial: number[], share: number): number {
    let result = 0
    // Note: ES2023 introduces Array.prototype.toReversed() which is the combination of clone + reverse,
    // see e.g.https://tc39.es/ecma262/2023/
    for (const coefficient of Array.from(polynomial).reverse())
      result = gf256.add(gf256.mul(result, share), coefficient)
    return result
  }

  /** @see https://en.wikipedia.org/wiki/Lagrange_polynomial */
  function interpolate(data: number[][]): number {
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
  }
}
