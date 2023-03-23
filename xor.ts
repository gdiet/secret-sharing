// document utilitiy functions
let input     = (id: string) => document.getElementById(id) as HTMLInputElement
let button    = (id: string) => document.getElementById(id) as HTMLButtonElement
let radio     = (id: string) => document.getElementById(id) as HTMLInputElement
let span      = (id: string) => document.getElementById(id) as HTMLSpanElement
let div       = (id: string) => document.getElementById(id) as HTMLDivElement
let paragraph = (id: string) => document.getElementById(id) as HTMLParagraphElement
let listen    = (func: (id: string) => HTMLElement, id: string, eventType: string, listener: EventListenerOrEventListenerObject) => func(id).addEventListener(eventType, listener)

// text utility functions
let fromUTF8 = (text: string) => Array.from(new TextEncoder().encode(text))
let toUTF8 = (bytes: number[]) => new TextDecoder().decode(new Uint8Array(bytes))
let parseInts = (text: string, ifParseFails: number) => text && text.split(',').map(n => parseInt(n) || ifParseFails) || Array<number>()

// numeric utility functions - min is inclusive and max is exclusive
let random = (min: number, max: number) => Math.floor(Math.random() * (max - min) + min)
let limit = (n: number, min: number, max: number) => Math.min(max - 1, Math.max(min, n))

// document content
let cont = {
  get secretText() { return   input('secretTextInput').value },
  set secretText(s: string) { input('secretTextInput').value = s },
  get secretBytes() { return parseInts(input('secretBytesInput').value, 95) },
  set secretBytes(b: number[]) {       input('secretBytesInput').value = b.join(',') },
  get shareNumber() { return parseInt(input('shareNumberInput').value) },
  set shareNumber(k: number) {        input('shareNumberInput').value = String(k) },
  set shareKIndex(i: number) { span('shareKIndexSpan').innerHTML = String(i) },
  shareSpan:  (index: number) => span (`share${index}Span` ),
  shareInput: (index: number) => input(`share${index}Input`),
  get shareKInput() { return parseInts(input('shareKInput').value, 0) },
  set shareKInput(b: number[]) {       input('shareKInput').value = b.join(',') },
  get reconstuctedBytes() { return parseInts(input('reconstructedSecretBytesInput').value, 0) },
  set reconstuctedBytes(b: number[]) {       input('reconstructedSecretBytesInput').value = b.join(',') },
  set reconstuctedText(s: string) { input('reconstructedSecretTextInput').value = s },
}

// ss: function(index: number) { return { set hidden(b: boolean) { span(`share${index}Span`).hidden = b } } },

// document automation
listen(button, 'textToBytesButton', 'click', () => {
  cont.secretBytes = fromUTF8(cont.secretText)
})
listen(button, 'bytesToTextButton', 'click', () => {
  cont.secretText = toUTF8(cont.secretBytes)
})
listen(input, 'shareNumberInput', 'change', () => {
  cont.shareNumber = limit(cont.shareNumber, 2, 7)
  cont.shareKIndex = cont.shareNumber
  for (let i = 1; i <= 5; i++)
    cont.shareSpan(i).hidden = i >= cont.shareNumber
})
listen(button, 'fillWithRandomBytesButton', 'click', () => {
  for (let i = 1; i < cont.shareNumber; i++)
    cont.shareInput(i).value = cont.secretBytes.map(() => random(0, 256)).join(",")
})
listen(button, 'createShareKButton', 'click', () => {
  let result = cont.secretBytes
  for (let i = 1; i < cont.shareNumber; i++)
    result = result.map((value, index) =>
      value ^ parseInts(cont.shareInput(i).value, 0)[index]
    )
  cont.shareKInput = result
})
listen(button, 'reconstructSecretButton', 'click', () => {
  let result = cont.shareKInput
  for (let i = 1; i < cont.shareNumber; i++)
    result = result.map((value, index) =>
      value ^ parseInts(cont.shareInput(i).value, 0)[index]
    )
  cont.reconstuctedBytes = result
})
listen(button, 'reconstructedBytesToTextButton', 'click', () => {
  cont.reconstuctedText = toUTF8(cont.reconstuctedBytes)
})
