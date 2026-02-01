package eff;

/**
 * Operations on the Galois field GF(256) that is defined by the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial,
 * with big-endian bit order for bytes. These are the same operations as used for AES encryption.
 *
 * @see <a href="https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field">Wikipedia:
 * Rijndael's (AES) finite field</a>
 */
class GF256 {

  /**
   * Lookup table for the AES GF(256) multiplicative inverse.
   */
  private static final byte[] inverseTable = new byte[256];

  static {
    for (int n = 1; n <= 255; n++) {
      for (int k = 1; k <= 255; k++) {
        if (mul((byte) k, (byte) n) == 1) {
          inverseTable[n] = (byte) k;
          break;
        }
      }
    }
  }

  /**
   * The AES GF(256) addition is the 'xor' operation.
   *
   * @see <a href="https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example">Wikipedia:
   * C programming example</a>
   */
  static byte add(byte a, byte b) {
    return (byte) (a ^ b);
  }

//  /**
//   * The AES GF(256) subtraction is the same 'xor' operation as the addition, because the subtraction must be the
//   * inverse of the addition, and 'xor' is the inverse of itself.
//   */
//  static byte sub(byte a, byte b) {
//    return add(a, b);
//  }

  /**
   * The AES GF(256) multiplication. The constant 0x11b (binary 1.0001.1011, big-endian) represents AES' reducing
   * polynomial for multiplication `x^8 + x^4 + x^3 + x^1 + x^0` - the bits 8, 4, 3, 1, 0 are set in 0x11b.
   *
   * @see <a href="https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example">Wikipedia:
   * C programming example</a>
   */
  static byte mul(byte a, byte b) {
    return calculateMultiplication(a, b, (byte) 0);
  }

  private static byte calculateMultiplication(byte a, byte b, byte acc) {
    if (a == 0 || b == 0) return acc;
    else return calculateMultiplication(
        (byte)(a < 0 ? (a << 1) ^ 0x1b : a << 1),
        (byte)((b & 0xff) >> 1),
        (b & 0x01) != 0 ? add(a, acc) : acc
    );
  }

//  /**
//   * The AES GF(256) division done as multiplication with the inverse `b^-1`.
//   */
//  static byte div(byte a, byte b) {
//    assert b != 0;
//    return mul(a, inverseTable[b&0xFF]);
//  }

//  /**
//   * The AES GF(256) exponentiation done as repeated multiplication.
//   */
//  static byte pow(byte a, int n) {
//    byte result = 1;
//    for (int i = 0; i < n; i++) result = mul(result, a);
//    return result;
//  }
}
