interface Share {
  partNumber: number
  partOfSecret: string
  partOfHash: string | undefined
  identifier: string | undefined
}

const join = {
  //
  // Basic utilities for share input UI elements
  shareId: (index: number) => `shareInput-${index}`,
  shareIndex: (shareId: string) => parseInt(shareId.substring(11)),
  shareInputHtml: (index: number) =>
    `<p><textarea id="${join.shareId(index)}" value="" rows="6" cols="100" hidden="true"></textarea></p>`,
  shareInputsDiv: docutils.documentElement('shareInputs'),
  shareInput(index: number): HTMLTextAreaElement {
    const input = docutils.documentElement(join.shareId(index))
    if (input instanceof HTMLTextAreaElement) return input
    else return docutils.fail('')
  },
  isString(maybeString: any): string {
    if (typeof maybeString === 'string') return maybeString
    else return docutils.fail(`'${JSON.stringify(maybeString)}' is not a string.`)
  },
  isStringOrUndefined(maybeString: any): string | undefined {
    if (maybeString === undefined) return undefined
    else if (typeof maybeString === 'string') return maybeString
    else return docutils.fail(`'${JSON.stringify(maybeString)} is not a string.'`)
  },
  shareInputs: () => Array.from(Array(256), (_, index) => join.shareInput(index)),
  //
  // Visibility of share inputs
  updateVisibility() {
    const foundIndex = join
      .shareInputs()
      .reverse()
      .findIndex((input) => input.value.length > 0)
    const lastFilled = foundIndex == -1 ? -1 : 255 - foundIndex
    join.shareInputs().forEach((input, index) => (input.hidden = index > lastFilled + 1))
  },
  //
  // React on share changes
  shareUpdated(shareInput: HTMLTextAreaElement) {
    try {
      const fromJson = () => {
        const json = JSON.parse(shareInput.value)
        return {
          partNumber: parseInt(json['part number']),
          partOfSecret: join.isString(json['part of secret']),
          partOfHash: join.isStringOrUndefined(json['part of hash']),
          identifier: join.isStringOrUndefined(json['identifier']),
        } as Share
      }
      const fromString = () => {
        return {
          partNumber: NaN,
          partOfSecret: shareInput.value,
          partOfHash: undefined,
          identifier: undefined,
        }
      }
      const s: Share = shareInput.value.startsWith('{') ? fromJson() : fromString()
      console.log(s.partOfSecret)
      if (s.partOfSecret === undefined) shareInput.className = 'share-problem'
      else {
        if (Number.isNaN(s.partNumber) || s.partOfHash === undefined || s.identifier === undefined)
          shareInput.className = 'share-warning'
        else shareInput.className = ''
      }
    } catch (e) {
      shareInput.className = 'share-problem'
    }
  },
}

// create share input UI elements
join.shareInputsDiv.innerHTML = Array.from(Array(256), (_, index) => join.shareInputHtml(index)).join('\n')
join.shareInput(0).hidden = false

// wire share inputs with events
for (let index = 0; index < 256; index++) {
  docutils.registerListener(`shareInput-${index}`, 'change', (event) => {
    const share = event.target
    if (share instanceof HTMLTextAreaElement) {
      join.updateVisibility()
      join.shareUpdated(share)
    }
  })
}
