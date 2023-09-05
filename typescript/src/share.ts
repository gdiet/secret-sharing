// ------------ document automation ------------

registerListener('createSharesButton', 'click', createShares)

async function createShares(): Promise<void> {
  const secretBytes = utf8ToUint8(inputElement('secretInput').value)
  const padToLength = parseInt(inputElement('padToLengthInput').value)
  const numberOfShares = parseInt(inputElement('numberOfSharesInput').value)
  const threshold = parseInt(inputElement('thresholdInput').value)
  if (numberOfShares > 255) fail('No more than 255 shares supported.')
  if (numberOfShares < 2) fail('At least 2 shares are required.')
  if (threshold > numberOfShares) fail('The threshold can not be larger than the number of shares.')
  if (threshold < 2) fail('The threshold must be at least 2.')

  const secretPadded = [...secretBytes]
  for (let i = secretBytes.length; i < padToLength; i++) secretPadded.push(0)
  const shares = shareSecret(secretPadded, numberOfShares, threshold)

  const hashBytes = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', secretBytes)))
  const hashShares = shareSecret(hashBytes, numberOfShares, threshold)
  const sharesIdent = Array.from(Array(12), () => randomInt(0, 10)).join('')

  const sharesText = shares
    .map((share, index) => {
      return cleanMultiline(`
        |{
        |  "part number"   : ${index + 1},
        |  "part of secret": "${bytesToHex(share)}",
        |  "part of hash"  : "${bytesToHex(hashShares[index] || [])}",
        |  "identifier"    : "${sharesIdent}"
        |}
      `)
    })
    .join('\n\n\n')
  documentElement('sharesDiv').innerHTML = `<pre>${sharesText}</pre>`
}

// ------------ secret sharing ------------

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
  if (a < 0) fail(`${a} is not a byte value.`)
  if (a > 255) fail(`${a} is not a byte value.`)
  if (Math.floor(a) !== a) fail(`${a} is not a byte value.`)
}

// ------------ conversion utilities ------------

function utf8ToUint8(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

function bytesToUtf8(bytes: number[]): string {
  return new TextDecoder().decode(new Uint8Array(bytes))
}

function bytesToHex(bytes: number[]): string {
  return bytes.map((byte) => byte.toString(16).padStart(2, '0')).join('')
}

function cleanMultiline(string: string): string {
  return string
    .split('\n')
    .filter((line) => line.trim() !== '')
    .map((line) => line.replace(/^ +\|/, ''))
    .join('\n')
}

// ------------ DOM utilities ------------

function documentElement(id: string): HTMLElement {
  const maybeElement = document.getElementById(id)
  if (maybeElement !== null) return maybeElement
  else fail('Sorry, null check in script failed.')
}

function inputElement(id: string): HTMLInputElement {
  const maybeInput = documentElement(id)
  if (maybeInput instanceof HTMLInputElement) return maybeInput
  else fail('Sorry, type check in script failed.')
}

function registerListener(id: string, eventType: string, listener: () => void): void {
  documentElement(id).addEventListener(eventType, listener)
}

function fail(message: string): never {
    alert(message)
    throw Error(message)
  }
