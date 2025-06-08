// @ts-check

documentElement('javascriptWarning').style.display = 'none'
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
  const shares = Array.from({ length: numberOfShares })
                      .map((_, index) => factorAB(index, maxFactorAB))
  shares.forEach(ab => {
    ab.c = secretPadded.map((s, index) =>
      calculateC(ab.a, ab.b, p1[index], q1[index], s)
    )
    ab.validation = secretPadded.map((s, index) =>
      calculateC(ab.a, ab.b, p2[index], q2[index], s)
    )
  })
  documentElement('sharesSpan').innerHTML = shareText(shares)
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

// calculate the always positive modulo
function mod257(number) {
  return (number % 257 + 257) % 257
}

function shareText(shares) {
  const localizedKey = document.documentElement.lang == 'de' ? 'Teil Nummer' : 'share number'
  return shares.map((share, index) => {
    return cleanMultiline(`
      |{
      |  "${localizedKey}": ${index + 1},
      |  "a": ${share.a},
      |  "b": ${share.b},
      |  "c": ${JSON.stringify(share.c)}"
      |  "v": ${JSON.stringify(share.validation)}"
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
