function documentElement(id: string): HTMLElement {
  const maybeElement = document.getElementById(id)
  if (maybeElement !== null) return maybeElement
  else fail('Sorry, null check in script failed.')
}

function inputElement(id: string): HTMLInputElement {
  const maybeInput = documentElement(id)
  if (maybeInput instanceof HTMLInputElement) return maybeInput
  else fail('Sorry, type check in script failed.')
}

function registerListener(id: string, eventType: string, listener: () => void): void {
  documentElement(id).addEventListener(eventType, listener)
}

function fail(message: string): never {
  alert(message)
  throw Error(message)
}
