package shamir

import scala.annotation.elidable.ASSERTION
import scala.annotation.{elidable, tailrec}

/** This is an implementation of Shamir's secret sharing using the same Galois field GF(256) that is used by the AES
  * encryption.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */
@main def main(): Unit =
  println(s"hello ${gmul(0x53, 0xca)}")

@elidable(ASSERTION) def assertByte(a: Int): Unit = assert(a >= 0 && a < 256)

/** The AES GF(256) addition is an 'xor' operation.
  *
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example */
def gadd(a: Int, b: Int): Int =
  assertByte(a)
  assertByte(b)
  a ^ b

/** The AES GF(256) multiplication.
  *
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example */
def gmul(a: Int, b: Int): Int =
  assertByte(a)
  assertByte(b)
  @tailrec def calc(a: Int, b: Int, acc: Int): Int =
    if (a == 0 || b == 0) acc
    else calc(
      if ((a & 0x80) != 0) a << 1 ^ 0x11b else a << 1,
      b >> 1,
      if ((b & 0x01) != 0) gadd(a, acc)   else acc
    )
  calc(a, b, 0)
