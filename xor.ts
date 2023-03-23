// document utilitiy functions
let input     = (id: string) => document.getElementById(id) as HTMLInputElement
let button    = (id: string) => document.getElementById(id) as HTMLButtonElement
let radio     = (id: string) => document.getElementById(id) as HTMLInputElement
let span      = (id: string) => document.getElementById(id) as HTMLSpanElement
let div       = (id: string) => document.getElementById(id) as HTMLDivElement
let paragraph = (id: string) => document.getElementById(id) as HTMLParagraphElement
let listen    = (func: (id: string) => HTMLElement, id: string, eventType: string, listener: EventListenerOrEventListenerObject) => func(id).addEventListener(eventType, listener)

// text utility functions
let fromUTF8 = (text: string)    => Array.from(new TextEncoder().encode(text))
let toUTF8   = (bytes: number[]) => new TextDecoder().decode(new Uint8Array(bytes))

// document automation
listen(button, 'textToBytesButton', 'click', () => {
  input('numbersInput').value = fromUTF8(input('textInput').value).join(',')
})
listen(button, 'bytesToTextButton', 'click', () => {
  input('textInput').value = toUTF8(input('numbersInput').value.split(',').map(n => parseInt(n) || 95))
})
