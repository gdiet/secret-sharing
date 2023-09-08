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
}

// create share input UI elements
join.shareInputsDiv.innerHTML = Array.from(Array(256), (_, index) => join.shareInputHtml(index)).join('\n')
join.shareInput(0).hidden = false

// wire share inputs with events
for (let index = 0; index < 256; index++) {
  docutils.registerListener(`shareInput-${index}`, 'change', (event) => {
    const input = event.target
    if (input instanceof HTMLTextAreaElement) {
      join.updateVisibility()
    }
  })
}
