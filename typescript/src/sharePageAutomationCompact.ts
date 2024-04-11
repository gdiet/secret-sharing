registerVisibilitySwitch('includeIndex', 'indexClass')

function registerVisibilitySwitch(checkboxId: string, className: string) {
  docutils.registerListener(checkboxId, 'change', () => {
    setDisplayForClass(className, docutils.inputElement(checkboxId).checked ? '' : 'none')
  })
}

function setDisplayForClass(className: string, display: string) {
  Array.from(document.getElementsByClassName(className)).forEach((e) => {
    if (e instanceof HTMLElement) e.style.display = display
  })
}
