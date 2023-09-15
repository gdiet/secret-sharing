const sharesDescriptionTextArea = docutils.textAreaElement('sharesDescriptionInput')
sharesDescriptionTextArea.value = sharesDescriptionTextArea.value.replaceAll('  ', '')

docutils.registerListener('createSharesButton', 'click', createShares)

async function createShares(): Promise<void> {
  const secretBytes: Uint8Array = conversions.utf8ToUint8(docutils.inputElement('secretInput').value)
  const padToLength: number = parseInt(docutils.inputElement('padToLengthInput').value)
  const numberOfShares: number = parseInt(docutils.inputElement('numberOfSharesInput').value)
  const threshold: number = parseInt(docutils.inputElement('thresholdInput').value)
  if (numberOfShares > 255) docutils.fail('No more than 255 shares supported.')
  if (numberOfShares < 2) docutils.fail('At least 2 shares are required.')
  if (threshold > numberOfShares) docutils.fail('The threshold can not be larger than the number of shares.')
  if (threshold < 2) docutils.fail('The threshold must be at least 2.')

  const secretPadded = [...secretBytes]
  for (let i = secretBytes.length; i < padToLength; i++) secretPadded.push(0)
  const shares = shamirShare.shareSecret(secretPadded, numberOfShares, threshold)

  const hashBytes = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', secretBytes)))
  const hashShares = shamirShare.shareSecret(hashBytes, numberOfShares, threshold)
  const sharesIdent = Array.from(Array(12), () => shamirShare.randomInt(0, 10)).join('')

  const sharesText = shares
    .map((share, index) => {
      return conversions.cleanMultiline(`
        |{
        |  "part number"   : ${index + 1},
        |  "part of secret": "${conversions.bytesToB64(share)}",
        |  "part of hash"  : "${conversions.bytesToB64(hashShares[index] || [])}",
        |  "identifier"    : "${sharesIdent}"
        |}
      `)
    })
    .join('\n\n\n')
  docutils.documentElement('sharesDiv').innerHTML = `<pre>${sharesText}</pre>`

  const description = sharesDescriptionTextArea.value.replaceAll('\n', '')
  docutils.documentElement('sharesDescriptionSpan').innerText = `${description}`
  docutils.documentElement('numberOfSharesSpan').innerText = `${numberOfShares}`
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  docutils.documentElement('createdDateSpan').innerText = `${year}.${month}.${day}`
  docutils.documentElement('thresholdSpan').innerText = `${threshold}`
  docutils.documentElement('shareInfoDiv').hidden = false
}
