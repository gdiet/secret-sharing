namespace shamirShare {
  /**
   * Split a secret into shares using Shamir's secret sharing algorithm.
   * Use the AES GF(256) operations for calculations and assume that the `x` value of the secret is `0`.
   * The `x` values of the shares are stored in the shares' first byte.
   *
   * @param secretBytes The bytes to create shares for.
   * @param numOfShares The number of shares to create.
   * @param threshold The minimum number of shares needed to recreate the secret.
   * @return The shares created.
   *
   * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
   */
  export function shareSecret(secretBytes: number[], numberOfShares: number, threshold: number): number[][] {
    // FIXME check
    // require(numOfShares <= 255, "No more than 255 shares supported.")
    // require(numOfShares > 1, "At least 2 shares are required.")
    // require(threshold <= numOfShares, "The threshold can not be larger than the number of shares.")
    // require(threshold >= 2, "The threshold must be at least 2.")
    // require(secretBytes.forall(byte => byte >= 0 && byte <= 255), "Secret bytes must be in the range 0..255.")
    const polynomials = generatePolynomials(secretBytes, threshold)
    const result: number[][] = []
    for (let share = 1; share <= numberOfShares; share++)
      result.push([share, ...polynomials.map((polynomial) => evaluate(polynomial, share))])
    return result
  }

  /**
   * Join the given shares using Shamir's secret sharing algorithm to recover the original secret.
   * Use the AES GF(256) operations for calculations and assume that the `x` value of the secret is `0`.
   * The 'x' values of the shares are read from the shares' first byte.
   *
   * Note: If the shares are incorrect, or their number is less than the threshold value that was used
   * when generating the shares, the output will be meaningless.
   *
   * @param shares The shares to join.
   * @return The original secret.
   *
   * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
   */
  export function joinShares(shares: Uint8Array[]): number[] {
    // FIXME check
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

  /**
   * @see https://en.wikipedia.org/wiki/Horner%27s_method
   */
  function evaluate(polynomial: number[], share: number): number {
    let result = 0
    // Note: ES2023 introduces Array.prototype.toReversed() which is the combination of clone + reverse,
    // see e.g.https://tc39.es/ecma262/2023/
    for (const coefficient of Array.from(polynomial).reverse())
      result = gf256.add(gf256.mul(result, share), coefficient)
    return result
  }

  /**
   * @see https://en.wikipedia.org/wiki/Lagrange_polynomial
   */
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
