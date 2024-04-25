docutils.registerListener('createSharesButton', 'click', () => createSharesBase(sharesTextCompact))

function sharesTextCompact(shares: number[][], hashShares: number[][], sharesIdent: string): string {
  const sharesText = shares
    .map((share, index) => {
      const indexString = `<span class="indexClass">${index + 1}::</span>`
      const shareString = `<span class="shareClass">${conversions.bytesToB64(share)}</span>`
      const hashString = `<span class="hashClass">:${conversions.bytesToB64(hashShares[index] || [])}</span>`
      const identString = `<span class="identClass">::${sharesIdent}</span>`
      return `${indexString}${shareString}${hashString}${identString}`
    })
    .join('\n\n')
  return `<pre>${sharesText}</pre>`
}

registerVisibilitySwitch('includeIndexBox', 'indexClass')
registerVisibilitySwitch('includeHashBox', 'hashClass')
registerVisibilitySwitch('includeIdentifierBox', 'identClass')

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
