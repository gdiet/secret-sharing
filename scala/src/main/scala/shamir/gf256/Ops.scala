package shamir.gf256

import scala.annotation.elidable
import scala.annotation.elidable.ASSERTION

trait Ops {
  /** The AES GF(256) addition is the 'xor' operation.
    *
    * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example */
  final def add(a: Int, b: Int): Int =
    assertIsByte(a)
    assertIsByte(b)
    a ^ b

  /** The AES GF(256) subtraction is the same 'xor' operation as the addition, because
    * the subtraction must be the inverse of the addition, and 'xor' is the inverse of itself. */
  final def sub(a: Int, b: Int): Int = add(a, b)

  /** The AES GF(256) multiplication. */
  def mul(a: Int, b: Int): Int

  /** The AES GF(256) multiplicative inverse with the identity. */
  def inv(a: Int): Int

  /** The AES GF(256) division done as multiplication with the inverse `b^-1`. */
  final def div(a: Int, b: Int): Int = mul(a, inv(b))
}

object Ops {
  @elidable(ASSERTION) def proveFunctionality(): Unit =
    TableOps.expTableProof()
    TableOps.logTableProof()
}
