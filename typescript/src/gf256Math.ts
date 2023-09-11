/**
 * Operations on the Galois field GF(256) that is defined by the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with
 * big-endian bit order for bytes. These are the same operations as used for AES encryption.
 *
 * Since the operations are for the GF(256) field, they are defined only for byte values [0..255]. Used with
 * other values, they throw a NotAByte error.
 *
 * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field
 */
namespace gf256 {
  /**
   * The AES GF(256) addition is the 'xor' operation.
   *
   * @throws NotAByte if a or b are not byte values.
   *
   * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example
   */
  export function add(a: number, b: number): number {
    return ensureIsByte(a) ^ ensureIsByte(b)
  }

  /**
   * The AES GF(256) subtraction is the same 'xor' operation as the addition, because the subtraction must be the
   * inverse of the addition, and 'xor' is the inverse of itself.
   *
   * @throws NotAByte if a or b are not byte values.
   */
  export function sub(a: number, b: number): number {
    return add(a, b)
  }

  /**
   * The AES GF(256) multiplication. The constant 0x11b (binary 1.0001.1011, big-endian) represents AES' reducing
   * polynomial for multiplication `x^8 + x^4 + x^3 + x^1 + x^0` - the bits 8, 4, 3, 1, 0 are set in 0x11b.
   *
   * @throws NotAByte if a or b are not byte values.
   *
   * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field
   * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example
   */
  export function mul(a: number, b: number) {
    function calc(a: number, b: number, acc: number): number {
      if (a === 0 || b === 0) return acc
      else return calc((a & 0x80) !== 0 ? (a << 1) ^ 0x11b : a << 1, b >> 1, (b & 0x01) !== 0 ? add(a, acc) : acc)
    }
    return calc(ensureIsByte(a), ensureIsByte(b), 0)
  }

  /**
   * The AES GF(256) division done as multiplication with the inverse `b^-1`.
   *
   * @throws NotAByte if a or b are not byte values or if b is 0.
   */
  export function div(a: number, b: number): number {
    if (b === 0) throw new NotAByte(a / b)
    return mul(ensureIsByte(a), inverseTable[ensureIsByte(b) - 1] || 0)
  }

  /**
   * Lookup table for the AES GF(256) multiplicative inverse, shifted by one because `1/0` is not defined.
   */
  const inverseTable: number[] = []
  for (let n = 1; n <= 255; n++) {
    for (let k = 1; k <= 255; k++) {
      if (mul(k, n) === 1) {
        inverseTable.push(k)
        break
      }
    }
  }

  export class NotAByte extends Error {
    readonly value: number
    constructor(value: number) {
      super('Value is not a byte value.')
      this.value = value
    }
  }

  function ensureIsByte(a: number): number {
    if (a >= 0 && a <= 255 && Math.floor(a) === a) return a
    throw new NotAByte(a)
  }
}
