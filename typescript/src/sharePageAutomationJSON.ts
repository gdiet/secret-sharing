docutils.registerListener('createSharesButton', 'click', () => createSharesBase(sharesTextJSON))

function sharesTextJSON(shares: number[][], hashShares: number[][], sharesIdent: string): string {
  const sharesText = shares
    .map((share, index) => {
      return conversions.cleanMultiline(`
        |{
        |  "part number"   : ${index + 1},
        |  "part of secret": "${conversions.bytesToB64(share)}",
        |  "part of hash"  : "${conversions.bytesToB64(hashShares[index] || [])}",
        |  "identifier"    : "${sharesIdent}"
        |}
      `)
    })
    .join('\n\n\n')
  return `<pre class="scrollable">${sharesText}\n\n\n==> ==>  you may have to scroll  ==> ==></pre>`
}
