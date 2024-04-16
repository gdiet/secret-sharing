docutils.registerListener('createSharesButton', 'click', () => createSharesBase(sharesTextCompact))

function sharesTextCompact(shares: number[][], hashShares: number[][], sharesIdent: string): string {
  const sharesText = shares
    .map((share, index) => {
      // FIXME add span class="indexClass" etc.
      return `${index + 1}::${conversions.bytesToB64(share)}:${conversions.bytesToB64(
        hashShares[index] || [],
      )}::${sharesIdent}`
    })
    .join('\n\n\n')
  return `<pre>${sharesText}</pre>`
}

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
