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

  setClassAndContent(id: string, className: string, innerHTML: string) {
    const element = docutils.documentElement(id)
    element.className = className
    element.innerHTML = innerHTML
  },

  registerListener(id: string, eventType: string, listener: (event: Event) => void): void {
    docutils.documentElement(id).addEventListener(eventType, listener)
  },

  // FIXME use fail only for program failures, input validation should be handled differently.
  fail(message: string): never {
    alert(message)
    throw Error(message)
  },
}
