const sharesDescriptionTextArea = documentElement('sharesDescription')
sharesDescriptionTextArea.innerHTML = sharesDescriptionTextArea.innerHTML.replaceAll('  ', '')

registerListener('createSharesButton', 'click', createShares)

async function createShares(): Promise<void> {
  const secretBytes: Uint8Array = utf8ToUint8(inputElement('secretInput').value)
  const padToLength: number = parseInt(inputElement('padToLengthInput').value)
  const numberOfShares: number = parseInt(inputElement('numberOfSharesInput').value)
  const threshold: number = parseInt(inputElement('thresholdInput').value)
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
        |  "part of secret": "${bytesToB64(share)}",
        |  "part of hash"  : "${bytesToB64(hashShares[index] || [])}",
        |  "identifier"    : "${sharesIdent}"
        |}
      `)
    })
    .join('\n\n\n')
  documentElement('sharesDiv').innerHTML = `<pre>${sharesText}</pre>`
}
