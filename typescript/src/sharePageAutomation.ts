const sharesDescriptionTextArea = docutils.textAreaElement('sharesDescriptionInput')

docutils.registerListener('numberOfSharesInput', 'change', thresholdCheck)
docutils.registerListener('thresholdInput', 'change', thresholdCheck)
function thresholdCheck(): void {
  const numberOfShares: number = parseInt(docutils.inputElement('numberOfSharesInput').value)
  const threshold: number = parseInt(docutils.inputElement('thresholdInput').value)
  if (threshold > numberOfShares) docutils.inputElement('thresholdInput').value = `${numberOfShares}`
}

async function createSharesBase(shareText: typeof sharesTextJSON): Promise<void> {
  const secretBytes: Uint8Array = conversions.utf8ToUint8(docutils.inputElement('secretInput').value)
  const padToLength: number = parseInt(docutils.inputElement('padToLengthInput').value)
  const numberOfShares: number = parseInt(docutils.inputElement('numberOfSharesInput').value)
  const threshold: number = parseInt(docutils.inputElement('thresholdInput').value)

  const validation = util
    .validate(secretBytes.length > 0, 'Please provide a secret to share.')
    .validate(numberOfShares >= 2, 'At least 2 shares are required.')
    .validate(numberOfShares <= 255, 'No more than 255 shares can be created.')
    .validate(threshold >= 2, 'The threshold must be at least 2.')
    .validate(threshold <= numberOfShares, 'The threshold can not be larger than the number of shares.')
  validation.onLeft(alert)
  if (validation.isLeft) return

  const secretPadded = [...secretBytes]
  for (let i = secretBytes.length; i < padToLength; i++) secretPadded.push(0)
  const shares = shamirShare.shareSecret(secretPadded, numberOfShares, threshold)

  const hashBytes = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', secretBytes)))
  const hashShares = shamirShare.shareSecret(hashBytes, numberOfShares, threshold)
  const sharesIdent = Array.from(Array(12), () => shamirShare.randomInt(0, 10)).join('')

  docutils.documentElement('sharesDiv').innerHTML = shareText(shares, hashShares, sharesIdent)

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
