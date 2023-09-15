namespace docutils {
  export function documentElement(id: string): HTMLElement {
    const maybeElement = document.getElementById(id)
    if (maybeElement !== null) return maybeElement
    else return fail('Sorry, null check in script failed.')
  }

  export function textAreaElement(id: string): HTMLTextAreaElement {
    const maybeInput = docutils.documentElement(id)
    if (maybeInput instanceof HTMLTextAreaElement) return maybeInput
    else return fail('Sorry, type check in script failed.')
  }

  export function inputElement(id: string): HTMLInputElement {
    const maybeInput = docutils.documentElement(id)
    if (maybeInput instanceof HTMLInputElement) return maybeInput
    else return fail('Sorry, type check in script failed.')
  }

  export function setClassAndContent(id: string, className: string, innerHTML: string) {
    const element = docutils.documentElement(id)
    element.className = className
    element.innerHTML = innerHTML
  }

  export function registerListener(id: string, eventType: string, listener: (event: Event) => void): void {
    docutils.documentElement(id).addEventListener(eventType, listener)
  }

  /**
   * Don't catch this error, see below 'function fail'.
   */
  export class AssertionFailed extends Error {
    constructor(message: string) {
      super(message)
    }
  }

  /**
   * Stops the current execution, displaying an error message. The error thrown here should not be caught.
   * Only use for program failures, not for input validation.
   */ // FIXME review usage
  export function fail(message: string): never {
    alert(message)
    throw new AssertionFailed(message)
  }
}
