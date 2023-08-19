package shamir

import scala.annotation.elidable
import scala.annotation.elidable.ASSERTION

/** This is an implementation of Shamir's secret sharing using the same Galois field GF(256) that is used by the AES
  * encryption, that is, the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with the same big-endian bit order for bytes.
  * For string from/to byte sequence conversions, UTF-8 is used.
  *
  * @see https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */
@main def main(): Unit =
  expTableProof()
  logTableProof()
  println(s"hello ${gmul(0x53, 0xca)}")
  println(s"hello ${tmul(0x53, 0xca)}")

@elidable(ASSERTION) def assertIsByte(a: Int): Unit = assert(a >= 0 && a < 256)
