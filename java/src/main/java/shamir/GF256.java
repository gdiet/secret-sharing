package shamir;

class GF256 {

    private static void assertIsByte(int a) {
        assert a >= 0 && a < 256 : "Not a byte value";
    }

    static int add(int a, int b) {
        assertIsByte(a);
        assertIsByte(b);
        return a ^ b;
    }

    static int sub(int a, int b) {
        return add(a, b);
    }

    public static int mul(int a, int b) {
        assertIsByte(a);
        assertIsByte(b);
        return calcMul(a, b, 0);
    }

    private static int calcMul(int a, int b, int acc) {
        if (a == 0 || b == 0) return acc;
        else return calcMul(
                    ((a & 0x80) != 0) ? (a << 1) ^ 0x11b : a << 1,
                    b >> 1,
                    ((b & 0x01) != 0) ? add(a, acc) : acc
        );
    }


}
