function shareSecret(secretBytes: number[], numberOfShares: number, threshold: number): number[][] {
  const polynomials = generatePolynomials(secretBytes, threshold)
  const result: number[][] = []
  for (let share = 1; share <= numberOfShares; share++)
    result.push([share, ...polynomials.map((polynomial) => evaluate(polynomial, share))])
  return result
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

function randomInt(fromInclusive: number, untilExclusive: number) {
  const fakerandom = parseInt(new URLSearchParams(document.location.search).get('fakerandom') || '0')
  if (fakerandom != 0) return (fakerandom % (untilExclusive - fromInclusive)) + fromInclusive
  else return Math.floor(Math.random() * (untilExclusive - fromInclusive) + fromInclusive)
}

/** @see https://en.wikipedia.org/wiki/Horner%27s_method */
function evaluate(polynomial: number[], share: number): number {
  let result = 0
  // Note: ES2023 introduces Array.prototype.toReversed() which is the combination of clone + reverse,
  // see e.g.https://tc39.es/ecma262/2023/
  for (const coefficient of Array.from(polynomial).reverse()) result = gf256add(gf256mul(result, share), coefficient)
  return result
}
