package shamir

import scala.annotation.elidable.ASSERTION
import scala.annotation.{elidable, tailrec}

/** Operations on the Galois field GF(256) that is defined by the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with
  * big-endian bit order for bytes. These are the same operations as used for AES encryption.
  *
  * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field */
object gf256:

  @elidable(ASSERTION) private def assertIsByte(a: Int): Unit = assert(a >= 0 && a < 256)

  /** The AES GF(256) addition is the 'xor' operation.
    *
    * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example */
  def add(a: Int, b: Int): Int =
    assertIsByte(a)
    assertIsByte(b)
    a ^ b

  /** The AES GF(256) subtraction is the same 'xor' operation as the addition, because
    * the subtraction must be the inverse of the addition, and 'xor' is the inverse of itself. */
  def sub(a: Int, b: Int): Int = add(a, b)

  /** The AES GF(256) multiplication. The constant 0x11b (binary 1.0001.1011, big-endian) represents the AES encryption
    * `x^8 + x^4 + x^3 + x^1 + x^0` polynomial - the bits 8, 4, 3, 1, 0 are set in 0x11b.
    *
    * @see https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example */
  def mul(a: Int, b: Int): Int =
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

  /** Lookup table for the AES GF(256) multiplicative inverse. */
  private val inverseTable: Seq[Int] =
    for (
      n <- 1 to 255;
      k <- (1 to 255).find(mul(_, n) == 1)
    ) yield k

  /** The AES GF(256) division done as multiplication with the inverse `b^-1`. */
  def div(a: Int, b: Int): Int =
    assertIsByte(b)
    assert(b != 0)
    mul(a, inverseTable(b - 1))

  /** @return The Lagrange interpolation of the polynomial defined by the data values at x = 0.
    *
    * @see https://en.wikipedia.org/wiki/Lagrange_polynomial */
  def interpolate(data: Iterable[(Int, Int)]): Int =
    data.zipWithIndex.foldLeft(0) { case (r, (x1 -> y, i)) =>
      val t = data.zipWithIndex.foldLeft(1) { case (t, (x2 -> _, j)) =>
        // The divisor x2 is (x - x2) which is (0 - x2), and 'minus' being 'xor' is just x2.
        if i == j then t else mul(t, div(x2, sub(x1, x2)))
      }
      add(r, mul(t, y))
    }
