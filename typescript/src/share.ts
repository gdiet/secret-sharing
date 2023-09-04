// ------------ document automation ------------

registerListener('createSharesButton', 'click', createShares)

function createShares(): void {
  const secretBytes = utf8ToBytes(inputElement('secretInput').value)
  const padToLength = parseInt(inputElement('padToLengthInput').value)
  const numberOfShares = parseInt(inputElement('numberOfSharesInput').value)
  const threshold = parseInt(inputElement('thresholdInput').value)
  ensure(numberOfShares <= 255, 'No more than 255 shares supported.')
  ensure(numberOfShares > 1, 'At least 2 shares are required.')
  ensure(threshold <= numberOfShares, 'The threshold can not be larger than the number of shares.')
  ensure(threshold >= 2, 'The threshold must be at least 2.')

  const secretPadded = [...secretBytes]
  for (let i = secretBytes.length; i < padToLength; i++) secretPadded.push(0)
  const shares = shareSecret(secretPadded, numberOfShares, threshold)
  console.log('Shares:')
  shares.forEach((share) => console.log(bytesToHex(share)))
}

// ------------ secret sharing ------------

function shareSecret(secretBytes: number[], numberOfShares: number, threshold: number): number[][] {
  const polynomials = generatePolynomials(secretBytes, threshold)
  return createSecrets(numberOfShares, polynomials)
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
  if (fakerandom != 0) return fakerandom
  else return Math.floor(Math.random() * (untilExclusive - fromInclusive) + fromInclusive)
}

function createSecrets(numOfShares: number, polynomials: number[][]): number[][] {
  const result: number[][] = []
  for (let share = 1; share <= numOfShares; share++)
    result.push(polynomials.map((polynomial) => evaluate(polynomial, share)))
  return result
}

/** @see https://en.wikipedia.org/wiki/Horner%27s_method */
function evaluate(polynomial: number[], share: number): number {
  let result = 0
  // Note: ES2023 introduces Array.prototype.toReversed() which is the combination of clone + reverse,
  // see e.g.https://tc39.es/ecma262/2023/
  for (const coefficient of Array.from(polynomial).reverse()) result = gf256add(gf256mul(result, share), coefficient)
  return result
}

// ------------ gf256 math ------------

function gf256add(a: number, b: number): number {
  ensureIsByte(a)
  ensureIsByte(b)
  return a ^ b
}

function gf256mul(a: number, b: number) {
  ensureIsByte(a)
  ensureIsByte(b)
  return gf256calculateMultiplication(a, b, 0)
}

function gf256calculateMultiplication(a: number, b: number, acc: number): number {
  if (a === 0 || b === 0) return acc
  else
    return gf256calculateMultiplication(
      (a & 0x80) !== 0 ? (a << 1) ^ 0x11b : a << 1,
      b >> 1,
      (b & 0x01) !== 0 ? gf256add(a, acc) : acc,
    )
}

function ensureIsByte(a: number) {
  ensure(a >= 0, `${a} is not a byte value.`)
  ensure(a <= 255, `${a} is not a byte value.`)
  ensure(Math.floor(a) === a, `${a} is not a byte value.`)
}

// ------------ conversion utilities ------------

function utf8ToBytes(text: string): number[] {
  return Array.from(new TextEncoder().encode(text))
}

function bytesToUtf8(bytes: number[]): string {
  return new TextDecoder().decode(new Uint8Array(bytes))
}

function bytesToHex(bytes: number[]): string {
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

// ------------ DOM utilities ------------

function documentElement(id: string): HTMLElement {
  const maybeElement = document.getElementById(id)
  if (maybeElement !== null) return maybeElement
  else {
    alert('Sorry, null check in script failed.')
    throw Error('null check failed')
  }
}

function inputElement(id: string): HTMLInputElement {
  const maybeInput = documentElement(id)
  if (maybeInput instanceof HTMLInputElement) return maybeInput
  else {
    alert('Sorry, type check in script failed.')
    throw Error('type check failed')
  }
}

function registerListener(id: string, eventType: string, listener: () => void): void {
  documentElement(id).addEventListener(eventType, listener)
}

function ensure(condition: boolean, message: string) {
  if (!condition) {
    alert(message)
    throw Error(message)
  }
}
