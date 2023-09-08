// utilities for share input UI elements
const shareId = (index: number) => `shareInput-${index}`
const shareIndex = (shareId: string) => parseInt(shareId.substring(11))
const shareInputHtml = (index: number) =>
  `<p><textarea id="${shareId(index)}" value="" rows="6" cols="100" hidden="true"></textarea></p>`
const shareInputsDiv = docutils.documentElement('shareInputs')
function shareInput(index: number): HTMLTextAreaElement {
  const input = docutils.documentElement(shareId(index))
  if (input instanceof HTMLTextAreaElement) return input
  else return docutils.fail('')
}
function* shareInputs() {
  for (let index = 0; index < 256; index++) yield shareInput(index)
}

// create share input UI elements
shareInputsDiv.innerHTML = Array.from(Array(256), (_, index) => shareInputHtml(index)).join('\n')
shareInput(0).hidden = false

// wire share inputs with events
for (let index = 0; index < 256; index++) {
  docutils.registerListener(`shareInput-${index}`, 'change', (event) => {
    const input = event.target
    if (input instanceof HTMLTextAreaElement) {
      //
      // visibility of share inputs
      const foundIndex = Array(...shareInputs())
        .reverse()
        .findIndex((input) => input.value.length > 0)
      const lastFilled = foundIndex == -1 ? -1 : 255 - foundIndex
      for (let index = 0; index < 256; index++) {
        shareInput(index).hidden = index > lastFilled + 1
      }
    }
  })
}
