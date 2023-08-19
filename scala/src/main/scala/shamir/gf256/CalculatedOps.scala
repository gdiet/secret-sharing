package shamir.gf256

import scala.annotation.tailrec

object CalculatedOps extends Ops {

  /** The AES GF(256) multiplication.
    *
    * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example */
  override def mul(a: Int, b: Int): Int =
    assertIsByte(a)
    assertIsByte(b)

    @tailrec def calc(a: Int, b: Int, acc: Int): Int =
      if (a == 0 || b == 0) acc
      else calc(
        if ((a & 0x80) != 0) a << 1 ^ 0x11b else a << 1,
        b >> 1,
        if ((b & 0x01) != 0) add(a, acc) else acc
      )

    calc(a, b, 0)

  /** "Brute force" create the lookup table for the AES GF(256) multiplicative inverse. */
  val inverseTable: Seq[Int] =
      for (
        n <- 1 to 255;
        k <- (1 to 255).find(mul(_, n) == 1)
      ) yield k

  /** The AES GF(256) multiplicative inverse with the identity. */
  override def inv(a: Int): Int =
    assertIsByte(a)
    assert(a != 0)
    inverseTable(a - 1)

}

