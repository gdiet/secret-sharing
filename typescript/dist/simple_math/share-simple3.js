// @ts-check
// TODO inline when ready

documentElement('javascriptWarning').style.display = 'none'

// COMBINING SHARES //

registerListener('fillExampleSharesButton', 'click', () => {
  textAreaElement('shareInput1').value = `{
  "Teil Nummer": 4,
  "a": 2,
  "b": 2,
  "c": [62,256,90,164,90,206,221,134,95,84,215,214,30,151,161,202,209,141,221,49],
  "v": [141,83,12,116,122,74,154,110,44,157,126,188,24,148,237,250,6,110,69,228]
}`
  textAreaElement('shareInput2').value = `{
  "Teil Nummer": 2,
  "a": 1,
  "b": 2,
  "c": [168,252,203,200,169,12,143,107,187,164,112,98,39,211,44,143,46,199,123,140],
  "v": [1,72,164,129,170,93,107,229,227,83,87,36,15,132,103,225,158,235,110,255]
}`
  textAreaElement('shareInput3').value = `{
  "Teil Nummer": 5,
  "a": 3,
  "b": 4,
  "c": [36,90,178,6,160,104,6,125,249,249,71,56,70,106,206,89,256,84,88,190],
  "v": [205,251,61,144,193,53,160,223,238,241,214,225,40,24,84,219,165,89,180,227]
}`
  shareInputChanged()
})

registerListener('shareInput1', 'change', () => shareInputChanged())
registerListener('shareInput2', 'change', () => shareInputChanged())
registerListener('shareInput3', 'change', () => shareInputChanged())

function shareInputChanged() {
  const share1 = shareInput(textAreaElement('shareInput1').value, documentElement('shareInput1Status'))
  const share2 = shareInput(textAreaElement('shareInput2').value, documentElement('shareInput2Status'))
  const share3 = shareInput(textAreaElement('shareInput3').value, documentElement('shareInput3Status'))
  const c = restore(share1, share2, share3, share => share.c)
  const cString = bytesToUtf8(c.filter(n => n < 256))
  const v = restore(share1, share2, share3, share => share.v)
  const vString = bytesToUtf8(v.filter(n => n < 256))
  inputElement('restoredNumbersC').value = `${c}`
  inputElement('restoredNumbersV').value = `${v}`
  inputElement('restoredStringC').value = cString
  inputElement('restoredStringV').value = vString
}

function restore(share1, share2, share3, accessor) {
  const length =
    Math.max(accessor(share1).length?.length ?? 0, accessor(share2).length?.length ?? 0, accessor(share3)?.length ?? 0)
  return Array.from({ length: length }).map((_, index) =>
    calculateShare(
      share1.a, share2.a, share3.a,
      share1.b, share2.b, share3.b,
      accessor(share1)[index], accessor(share2)[index], accessor(share3)[index]
    )
  )
}

function shareInput(share, statusSpan) {
  if (share === '') {
    statusSpan.classList.remove('problem')
    statusSpan.textContent = 'Leer'
    return undefined
  }
  try {
    const json = JSON.parse(share)
    if (!Number.isInteger(json.a) || json.a < 1 || json.a > 10) throw 'a'
    if (!Number.isInteger(json.b) || json.b < 1 || json.b > 10) throw 'b'
    if (!Array.isArray(json.c) || json.c.some(n => !Number.isInteger(n) || n < 0 || n > 256)) throw 'c'
    if (!Array.isArray(json.v) || json.v.some(n => !Number.isInteger(n) || n < 0 || n > 256))
      statusSpan.textContent = `Unerwartete Eingabe für Feld v`
    else
      statusSpan.textContent = `Eingabeformat OK`
    statusSpan.classList.remove('problem')
    return json
  } catch (e) {
    statusSpan.classList.add('problem')
    if (typeof e === "string")
      statusSpan.textContent = `Unerwartete Eingabe für Feld ${e}`
    else
      statusSpan.textContent = 'Unerwartetes Eingabeformat'
    return undefined
  }
}

/* a1 * p + b1 * q + c1 = s
 * a2 * p + b2 * q + c2 = s
 * a3 * p + b3 * q + c3 = s
 * 
 *     a1*c2*b3 + a3*c1*b2 + c3*a2*b1 - a2*c1*b3 - c2*a3*b1 - a1*c3*b2
 * s = ---------------------------------------------------------------
 *              a1*b3 + a3*b2 + a2*b1 - a2*b3 - a3*b1 - a1*b2
 */
function calculateShare(a1, a2, a3, b1, b2, b3, c1, c2, c3) {
  if ([a1, a2, a3, b1, b2, b3, c1, c2, c3].some(n =>
    !Number.isInteger(n) || n < 0 || n > 256
  )) return NaN
  const dividend = mod257(a1*c2*b3 + a3*c1*b2 + c3*a2*b1 - a2*c1*b3 - c2*a3*b1 - a1*c3*b2)
  const divisor = mod257(a1*b3 + a3*b2 + a2*b1 - a2*b3 - a3*b1 - a1*b2)
  return divisor == 0 ? NaN : div257(dividend, divisor)
}

function div257(a, b) {
  while (a % b !== 0) a += 257
  return a / b;
}

// CREATING SHARES //

registerListener('createSharesButton', 'click', () => createShares())
registerListener('secretInput', 'change', () => documentElement('shareInfoDiv').hidden = true)

function createShares() {
  const secretBytes = utf8ToUint8(inputElement('secretInput').value)
  const padToLength = parseInt(inputElement('padToLengthInput').value)
  const numberOfShares = parseInt(inputElement('numberOfSharesInput').value)
  const maxFactorAB = Math.ceil(Math.sqrt(numberOfShares))
  const paddingLength = Math.max(padToLength - secretBytes.length, 0)
  const secretPadded = [...secretBytes, ...new Array(paddingLength).fill(256)]
  const length = secretPadded.length
  const p1 = secretPadded.map(() => Math.floor(Math.random() * 257))
  const q1 = secretPadded.map(() => Math.floor(Math.random() * 257))
  const p2 = secretPadded.map(() => Math.floor(Math.random() * 257))
  const q2 = secretPadded.map(() => Math.floor(Math.random() * 257))
  const shares = [
    {"a":  1, "b":  1},   //  1, 1    X X - - - - - - - - 
    {"a":  1, "b":  2},   //  1, 2    X X - - - - - - - - 
    {"a":  2, "b":  1},   //  2, 1    - - - X X - - - - - 
    {"a":  2, "b":  2},   //  2, 2    - - X - - - - - - X 
    {"a":  3, "b":  4},   //  3, 4    - - X - - - - - - - 
    {"a":  4, "b":  3},   //  4, 3    - - - - - - - - X - 
    {"a":  3, "b":  5},   //  3, 5    - - - - - - - - X - 
    {"a":  5, "b":  3},   //  5, 3    - - - - - - - - - - 
    {"a":  6, "b":  9},   //  6, 9    - - - - - X X - - - 
    {"a":  9, "b":  6},   //  9, 6    - - - X - - - - - - 
    {"a":  7, "b":  9},   //  7, 9
    {"a":  9, "b":  7},   //  9, 7
    {"a":  4, "b": 10},   //  4,10
    {"a": 10, "b":  4},   // 10, 4
  ];
  shares.length = numberOfShares;
  shares.forEach(ab => {
    ab.c = secretPadded.map((s, index) =>
      calculateC(ab.a, ab.b, p1[index], q1[index], s)
    )
    ab.validation = secretPadded.map((s, index) =>
      calculateC(ab.a, ab.b, p2[index], q2[index], s)
    )
  })
  documentElement('sharesSpan').innerHTML = shareText(shares)
  documentElement('sharesDescriptionSpan').innerText = textAreaElement('sharesDescriptionInput').value.replaceAll(/\r?\n/g, ' ')
  documentElement('numberOfSharesSpan').innerText = `${numberOfShares}`
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const localizedDate = document.documentElement.lang == 'de' ? `${day}.${month}.${year}` : `${year}-${month}-${day}`
  documentElement('createdDateSpan').innerText = localizedDate
  documentElement('pqValuesSpan').innerHTML = `p: ${p1}<br />q: ${q1}`
  documentElement('pqValidationValuesSpan').innerHTML = `p: ${p2}<br />q: ${q2}`
  documentElement('shareInfoDiv').hidden = false
}

function factorAB(index, maxFactorAB) {
  return {a: Math.floor(index/maxFactorAB) + 1, b: index%maxFactorAB + 1}
}

// calculate c for a*p + b*q + c = s
function calculateC(a, b, p, q, s) {
  return mod257(s - a*p - b*q)
}

// GENERAL MATH FUNCTIONS //

// calculate the always positive modulo
function mod257(number) {
  return (number % 257 + 257) % 257
}

// DOCUMENT UTILITIES //

function shareText(shares) {
  const localizedKey = document.documentElement.lang == 'de' ? 'Teil Nummer' : 'share number'
  return shares.map((share, index) => {
    return cleanMultiline(`
      |{
      |  "${localizedKey}": ${index + 1},
      |  "a": ${share.a},
      |  "b": ${share.b},
      |  "c": ${JSON.stringify(share.c)},
      |  "v": ${JSON.stringify(share.validation)}
      |}
    `)
  })
  .join('<br /><br />')
}

function cleanMultiline(text) {
  return text
    .split(/\r?\n/)
    .filter((line) => line.trim() !== '')
    .map((line) => line.replace(/^ +\|/, ''))
    .join('<br />')
}

function documentElement(elementIdString) {
  const maybeElement = document.getElementById(elementIdString)
  if (maybeElement !== null) return maybeElement
  throw error('Null check in script failed')
}

function inputElement(elementIdString) {
  const maybeInput = documentElement(elementIdString)
  if (maybeInput instanceof HTMLInputElement) return maybeInput
  throw error('Type check in script failed')
}

function textAreaElement(elementIdString) {
  const maybeInput = documentElement(elementIdString)
  if (maybeInput instanceof HTMLTextAreaElement) return maybeInput
  throw error('Type check in script failed')
}

function registerListener(elementIdString, eventTypeString, eventListener) {
  documentElement(elementIdString).addEventListener(eventTypeString, eventListener)
}

function error(messageString) {
  alert(`Oh bother: ${messageString}.`)
  return new Error(messageString)
}

function utf8ToUint8(text) {
  return new TextEncoder().encode(text)
}

function bytesToUtf8(bytes) {
  return new TextDecoder().decode(new Uint8Array(bytes))
}
