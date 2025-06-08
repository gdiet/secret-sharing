// @ts-check
// TODO inline when ready

documentElement('javascriptWarning').style.display = 'none'

// COMBINING SHARES //

registerListener('shareInput1', 'change', () => shareInputChanged())
registerListener('shareInput2', 'change', () => shareInputChanged())
registerListener('shareInput3', 'change', () => shareInputChanged())

function shareInputChanged() {
  const share1 = shareInput(textAreaElement('shareInput1').value, documentElement('shareInput1Status'))
  const share2 = shareInput(textAreaElement('shareInput2').value, documentElement('shareInput2Status'))
  const share3 = shareInput(textAreaElement('shareInput3').value, documentElement('shareInput3Status'))
  // const share1 = textAreaElement('shareInput1').value
  // const statusSpan1 = documentElement('shareInput1Status')
  // if (share1 === '') {
  //   statusSpan1.classList.remove('problem')
  //   statusSpan1.textContent = 'Leer'
  //   return
  // }
  // try {
  //   const share1Json = JSON.parse(share1)
  //   // TODO continue...
  //   statusSpan1.classList.remove('problem')
  // } catch (_) {
  //   statusSpan1.classList.add('problem')
  //   statusSpan1.textContent = 'Unerwartetes Eingabeformat'
  // }
  // // shareInput1.classList.add("problem")
  // // alert(`${share1}`)
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
