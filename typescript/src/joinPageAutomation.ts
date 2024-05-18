namespace join {
  interface Share {
    partOfSecret: string
    partOfHash: string | undefined
    identifier: string | undefined
  }

  // Basic utilities for share input UI elements
  const shareIndex = (shareId: string) => parseInt(shareId.substring(11))
  export const shareId = (index: number) => `shareInput-${index}`
  export const shareInput = (index: number) => docutils.textAreaElement(shareId(index))
  export const shareInputs = () => Array.from(Array(256), (_, index) => shareInput(index))

  // Visibility of share inputs
  export function updateVisibility() {
    const foundIndex = shareInputs()
      .reverse()
      .findIndex((input) => input.value.length > 0)
    const lastFilled = foundIndex == -1 ? -1 : 255 - foundIndex
    shareInputs().forEach((input, index) => (input.hidden = index > lastFilled + 1))
  }

  // Parse share input
  const matcher = /^\s*((\w+)::)?(.+?)(:(.+?))?(::(.+))?\s*$/
  function parseShare(input: string): Share {
    const match = input.match(matcher)
    if (match && match[3]) {
      // part number would be match[2]
      return {
        partOfSecret: match[3],
        partOfHash: match[5],
        identifier: match[7]
      }
    } else return parseJsonShare(input)
  }

  function parseJsonShare(input: string): Share {
    const json = JSON.parse(input)
    return {
      partOfSecret: conversions.expectString(json['part of secret']),
      partOfHash: conversions.maybeString(json['part of hash']),
      identifier: conversions.maybeString(json['identifier'])
    }
  }

  // The shares currently available
  const shares = Array<Share>(256)

  // React on share changes
  export function shareUpdated(shareInput: HTMLTextAreaElement) {
    const shareIdx = shareIndex(shareInput.id)
    const shareValue = shareInput.value
    if (shareValue.length === 0) {
      delete shares[shareIdx]
      shareInput.className = 'textinput'
    } else {
      try {
        const share: Share = parseShare(shareInput.value)
        shares[shareIdx] = share
        shareInput.className = 'textinput'
      } catch (_) {
        delete shares[shareIdx]
        shareInput.className = 'textinput problem'
      }
    }
    evaluate()
  }

  const currentShares = () => shares.filter((share) => share !== undefined)

  async function evaluate() {
    if (currentShares().length > 1) {
      // restore secret
      try {
        const shares = currentShares().map((share) => conversions.b64ToBytes(share.partOfSecret))
        const restoredBytes = shamirShare.joinShares(shares)
        const validUntil =
          restoredBytes.length -
          Array.from(restoredBytes)
            .reverse()
            .findIndex((num) => num !== 0)
        const restoredValidBytes = restoredBytes.slice(0, validUntil)
        const restoredSecret = conversions.bytesToUtf8(restoredValidBytes)
        docutils.inputElement('secretInput').value = restoredSecret
        docutils.setClassAndContent('restoreStatusSpan', '', 'OK')

        // restore and validate hash
        try {
          const partsOfHash = currentShares().reduce(
            (acc, { partOfHash }) => (partOfHash ? acc.concat(partOfHash) : acc),
            [] as string[]
          )
          if (partsOfHash.length == currentShares().length) {
            const hashFromSecret = await conversions.sha256(Uint8Array.from(restoredValidBytes))
            const hashShares = partsOfHash.map((partOfHash) => conversions.b64ToBytes(partOfHash))
            const restoredHash = shamirShare.joinShares(hashShares)
            const hashIsValid =
              hashFromSecret.length === restoredHash.length &&
              hashFromSecret.every((value, index) => value === restoredHash[index])
            if (hashIsValid) docutils.setClassAndContent('hashValidSpan', '', 'OK')
            else docutils.setClassAndContent('hashValidSpan', 'problem', 'FAILED')
          } else docutils.setClassAndContent('hashValidSpan', 'problem', 'INCOMPLETE')
        } catch (e) {
          console.warn(e)
          docutils.setClassAndContent('hashValidSpan', 'problem', 'ERROR')
        }

        // validate identifier
        try {
          const identifiers = currentShares().reduce(
            (acc, { identifier }) => (identifier ? acc.concat(identifier) : acc),
            [] as string[]
          )
          if (identifiers.length == currentShares().length) {
            const sameIdentifiers = identifiers.every((identifier) => identifier === identifiers[0])
            if (sameIdentifiers) docutils.setClassAndContent('identifierValidSpan', '', 'OK')
            else docutils.setClassAndContent('identifierValidSpan', 'problem', 'FAILED')
          } else docutils.setClassAndContent('identifierValidSpan', 'problem', 'INCOMPLETE')
        } catch (e) {
          console.warn(e)
          docutils.setClassAndContent('identifierValidSpan', 'problem', 'ERROR')
        }

        // catch restore secret errors
      } catch (e) {
        console.error(e)
        docutils.inputElement('secretInput').value = ''
        docutils.setClassAndContent('hashValidSpan', '', 'Not validated')
        docutils.setClassAndContent('identifierValidSpan', '', 'Not validated')
        docutils.setClassAndContent('restoreStatusSpan', 'problem', 'ERROR')
      }
    } else {
      // invalidate output
      docutils.inputElement('secretInput').value = ''
      docutils.setClassAndContent('hashValidSpan', '', 'Not validated')
      docutils.setClassAndContent('identifierValidSpan', '', 'Not validated')
      docutils.setClassAndContent('restoreStatusSpan', 'problem', 'INCOMPLETE')
    }
  }
}

// create share input UI elements
docutils.documentElement('shareInputs').innerHTML = Array.from(
  Array(256),
  (_, index) =>
    `<p><textarea id="${join.shareId(index)}" class="textinput" value="" rows="6" cols="100" hidden="true" title="Share input ${index + 1}"></textarea></p>`
).join('\n')
join.shareInput(0).hidden = false

// Insert demo data
join.shareInput(0).value =
  `3::AzrC3V9NjkS7aC9KombjyDdAJe4d6r4t4e114BmOCbh1:A7TXU1gcfr5dI7xV5DRfHza1206IAimy1SLoILE3BYBY::demo`
join.shareInput(1).value = `{
  "part number"   : 1,
  "part of secret": "AWOA4HN5Jnox7+zPlyKoseTJ6loLr2obX1vaqf56B2ja",
  "part of hash"  : "AXf73a3X+G0db2+9Si9ZfGfTkg4rvJkQj7fRfipVcr3c",
  "identifier"    : "demo"
}`
join.updateVisibility()
join.shareUpdated(join.shareInput(0))
join.shareUpdated(join.shareInput(1))

// wire share inputs with events
join.shareInputs().forEach((input) => {
  docutils.registerListener(input.id, 'change', (event) => {
    const share = event.target
    if (share instanceof HTMLTextAreaElement) {
      join.updateVisibility()
      join.shareUpdated(share)
    }
  })
})
