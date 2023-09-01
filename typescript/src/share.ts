const documentElement = (id: string) => {
  const maybeElement = document.getElementById(id)
  if (maybeElement == null) {
    document.body.innerHTML = 'Sorry, null check in script failed.'
    throw Error('null check failed')
  } else return maybeElement
}

const inputElement = (id: string) => {
  const maybeInput = documentElement(id)
  if (maybeInput instanceof HTMLInputElement) return maybeInput
  else {
    document.body.innerHTML = 'Sorry, type check in script failed.'
    throw Error('type check failed')
  }
}

const registerListener = (id: string, eventType: string, listener: EventListener) =>
  documentElement(id).addEventListener(eventType, listener)

const utf8ToBytes = (text: string) => Array.from(new TextEncoder().encode(text))
const bytesToUtf8 = (bytes: number[]) => new TextDecoder().decode(new Uint8Array(bytes))

registerListener('createSharesButton', 'click', () => alert(`${utf8ToBytes(inputElement('secretInput').value)}`))
