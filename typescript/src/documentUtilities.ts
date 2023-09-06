const docutils = {
  documentElement(id: string): HTMLElement {
    const maybeElement = document.getElementById(id)
    if (maybeElement !== null) return maybeElement
    else return docutils.fail('Sorry, null check in script failed.')
  },

  inputElement(id: string): HTMLInputElement {
    const maybeInput = docutils.documentElement(id)
    if (maybeInput instanceof HTMLInputElement) return maybeInput
    else return docutils.fail('Sorry, type check in script failed.')
  },

  registerListener(id: string, eventType: string, listener: () => void): void {
    docutils.documentElement(id).addEventListener(eventType, listener)
  },

  fail(message: string): never {
    alert(message)
    throw Error(message)
  },
}
