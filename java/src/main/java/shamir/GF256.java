package shamir;

/**
 * Operations on the Galois field GF(256) that is defined by the `x^8 + x^4 + x^3 + x^1 + x^0` polynomial, with
 * big-endian bit order for bytes. These are the same operations as used for AES encryption.
 * <p>
 * Since the operations are for the GF(256) field, they are defined only for byte values [0..255].
 *
 * @see <a href="https://en.wikipedia.org/wiki/Finite_field_arithmetic#Rijndael's_(AES)_finite_field">Wikipedia:
 * Rijndael's (AES) finite field</a>
 */
class GF256 {

    private static void assertIsByte(int a) {
        assert a >= 0 && a < 256 : "Not a byte value";
    }

    /**
     * The AES GF(256) addition is the 'xor' operation.
     *
     * @see <a href="https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example">Wikipedia:
     * C programming example</a>
     */
    static int add(int a, int b) {
        assertIsByte(a);
        assertIsByte(b);
        return a ^ b;
    }

    /**
     * The AES GF(256) subtraction is the same 'xor' operation as the addition, because the subtraction must be the
     * inverse of the addition, and 'xor' is the inverse of itself.
     */
    static int sub(int a, int b) {
        return add(a, b);
    }

    /**
     * The AES GF(256) multiplication. The constant 0x11b (binary 1.0001.1011, big-endian) represents the AES encryption
     * `x^8 + x^4 + x^3 + x^1 + x^0` polynomial - the bits 8, 4, 3, 1, 0 are set in 0x11b.
     *
     * @see <a href="https://en.wikipedia.org/wiki/Finite_field_arithmetic#C_programming_example">Wikipedia:
     * C programming example</a>
     */
    public static int mul(int a, int b) {
        assertIsByte(a);
        assertIsByte(b);
        return calculateMultiplication(a, b, 0);
    }

    private static int calculateMultiplication(int a, int b, int acc) {
        if (a == 0 || b == 0) return acc;
        else return calculateMultiplication(
                ((a & 0x80) != 0) ? (a << 1) ^ 0x11b : a << 1,
                b >> 1,
                ((b & 0x01) != 0) ? add(a, acc) : acc
        );
    }

}
