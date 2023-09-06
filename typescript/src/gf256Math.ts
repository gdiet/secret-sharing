function gf256add(a: number, b: number): number {
  ensureIsByte(a)
  ensureIsByte(b)
  return a ^ b
}

function gf256mul(a: number, b: number) {
  ensureIsByte(a)
  ensureIsByte(b)
  return gf256calculateMultiplication(a, b, 0)
}

function gf256calculateMultiplication(a: number, b: number, acc: number): number {
  if (a === 0 || b === 0) return acc
  else
    return gf256calculateMultiplication(
      (a & 0x80) !== 0 ? (a << 1) ^ 0x11b : a << 1,
      b >> 1,
      (b & 0x01) !== 0 ? gf256add(a, acc) : acc,
    )
}

function ensureIsByte(a: number) {
  if (a < 0) fail(`${a} is not a byte value.`)
  if (a > 255) fail(`${a} is not a byte value.`)
  if (Math.floor(a) !== a) fail(`${a} is not a byte value.`)
}
