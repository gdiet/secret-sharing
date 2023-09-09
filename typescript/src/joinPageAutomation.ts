interface Share {
  partOfSecret: string
  partOfHash: string
  identifier: string
}

const join = {
  // Basic utilities for share input UI elements
  shareId: (index: number) => `shareInput-${index}`,
  shareIndex: (shareId: string) => parseInt(shareId.substring(11)),
  shareInput(index: number): HTMLTextAreaElement {
    const input = docutils.documentElement(join.shareId(index))
    if (input instanceof HTMLTextAreaElement) return input
    else return docutils.fail(`Expected '${input}' to be a HTMLTextAreaElement.`)
  },
  shareInputs: () => Array.from(Array(256), (_, index) => join.shareInput(index)),

  // Visibility of share inputs
  updateVisibility() {
    const foundIndex = join
      .shareInputs()
      .reverse()
      .findIndex((input) => input.value.length > 0)
    const lastFilled = foundIndex == -1 ? -1 : 255 - foundIndex
    join.shareInputs().forEach((input, index) => (input.hidden = index > lastFilled + 1))
  },

  // Parse share input
  parseJsonShare(input: string): Share {
    const json = JSON.parse(input)
    return {
      partOfSecret: conversions.expectString(json['part of secret']),
      partOfHash: conversions.expectString(json['part of hash']),
      identifier: conversions.expectString(json['identifier']),
    }
  },

  // The shares currently available
  shares: Array<Share>(256),

  // React on share changes
  shareUpdated(shareInput: HTMLTextAreaElement) {
    const shareIndex = join.shareIndex(shareInput.id)
    const shareValue = shareInput.value
    if (shareValue.length === 0) {
      shareInput.className = ''
    } else
      try {
        const share: Share = join.parseJsonShare(shareInput.value)
        join.shares[shareIndex] = share
        shareInput.className = ''
      } catch (e) {
        delete join.shares[shareIndex]
        shareInput.className = 'share-problem'
      }
  },
}

// create share input UI elements
docutils.documentElement('shareInputs').innerHTML = Array.from(
  Array(256),
  (_, index) => `<p><textarea id="${join.shareId(index)}" value="" rows="6" cols="100" hidden="true"></textarea></p>`,
).join('\n')
join.shareInput(0).hidden = false

// FIXME temporary block start
join.shareInput(0).value = `{
  "part number"   : 3,
  "part of secret": "AzrC3V9NjkS7aC9KombjyDdAJe4d6r4t4e114BmOCbh1",
  "part of hash"  : "A7TXU1gcfr5dI7xV5DRfHza1206IAimy1SLoILE3BYBY",
  "identifier"    : "980363187642"
}`
join.shareInput(1).value = `{
  "part number"   : 1,
  "part of secret": "AWOA4HN5Jnox7+zPlyKoseTJ6loLr2obX1vaqf56B2ja",
  "part of hash"  : "AXf73a3X+G0db2+9Si9ZfGfTkg4rvJkQj7fRfipVcr3c",
  "identifier"    : "980363187642"
}`
join.updateVisibility()
join.shareUpdated
// FIXME temporary block end

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
