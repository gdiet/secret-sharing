package shamir

import scala.annotation.tailrec

/** The AES GF(256) addition is an 'xor' operation.
  *
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example */
def gadd(a: Int, b: Int): Int =
  assertIsByte(a)
  assertIsByte(b)
  a ^ b

/** The AES GF(256) subtraction is the same 'xor' operation as the addition, because the subtraction must be the inverse
  * of the addition, and 'xor' is the inverse of itself. */
def gsub(a: Int, b: Int): Int =
  assertIsByte(a)
  assertIsByte(b)
  a ^ b

/** The AES GF(256) multiplication.
  *
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example */
def gmul(a: Int, b: Int): Int =
  assertIsByte(a)
  assertIsByte(b)
  @tailrec def calc(a: Int, b: Int, acc: Int): Int =
    if (a == 0 || b == 0) acc
    else calc(
      if ((a & 0x80) != 0) a << 1 ^ 0x11b else a << 1,
      b >> 1,
      if ((b & 0x01) != 0) gadd(a, acc)   else acc
    )
  calc(a, b, 0)
