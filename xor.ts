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
  get secretText() { return input('secretTextInput').value },
  get secretBytes() { return parseInts(input('secretBytesInput').value, 95) },
  get shareNumber() { return parseInt(input('shareNumberInput').value) },
  set shareNumber(k: number) { input('shareNumberInput').value = String(k) },
  shareInput: (index: number) => input(`share${index}Input`),
}

// document automation
listen(button, 'textToBytesButton', 'click', () => {
  input('secretBytesInput').value = fromUTF8(cont.secretText).join(',')
})
listen(button, 'bytesToTextButton', 'click', () => {
  input('secretTextInput').value = toUTF8(cont.secretBytes)
})
listen(input, 'shareNumberInput', 'change', () => {
  cont.shareNumber = limit(cont.shareNumber, 2, 7)
  for (let i = 1; i <= 5; i++)
    input(`share${i}Input`).hidden = i >= cont.shareNumber
})
listen(button, 'fillWithRandomBytesButton', 'click', () => {
  for (let i = 1; i < cont.shareNumber; i++)
    cont.shareInput(i).value = cont.secretBytes.map(() => random(0, 256)).join(",")
})
