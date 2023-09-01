package shamir;

import java.util.Arrays;
import java.util.List;
import java.util.function.IntBinaryOperator;
import java.util.function.IntConsumer;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

class Shamir {

    private static void require(boolean condition, String message) {
        if (!condition) throw new IllegalArgumentException(message);
    }

    /** Use when the loop index needs to be effectively final, e.g. for use in lambda expressions. */
    static void loop(int from, int until, IntConsumer action) {
        IntStream.range(from, until).forEach(action);
    }

    /** A random generator returning integers between a (inclusive) and b (exclusive). */
    interface Random extends IntBinaryOperator { }

    /**
     * Split a secret into shares using Shamir's secret sharing algorithm. Use the AES GF(256) operations for
     * calculations and assume that the `x` value of the secret is `0`. The `x` values of the shares are stored in the
     * shares' first byte.
     *
     * @param secretBytes The bytes to create shares for.
     * @param numOfShares The number of shares to create.
     * @param threshold   The minimum number of shares needed to recreate the secret.
     * @param random      The random number generator to use.
     * @return The shares created.
     * @see <a href="https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing">Wikipedia: Shamir's secret sharing</a>
     */
    static int[][] shareSecret(int[] secretBytes, int numOfShares, int threshold, Random random) {
        require(numOfShares <= 255, "No more than 255 shares supported.");
        require(numOfShares > 1, "At least 2 shares are required.");
        require(threshold <= numOfShares, "The threshold can not be larger than the number of shares.");
        require(threshold >= 2, "The threshold must be at least 2.");
        require(
                Arrays.stream(secretBytes).allMatch(byteVal -> byteVal >= 0 && byteVal <= 255),
                "Secret bytes must be in the range 0..255."
        );
        int[][] polynomials = createPolynomials(secretBytes, threshold, random);
        return createSecrets(numOfShares, polynomials);
    }

    private static int[][] createPolynomials(int[] secretBytes, int threshold, Random random) {
        return Arrays
                .stream(secretBytes).mapToObj(b -> generatePolynomial(b, random, threshold))
                .toArray(int[][]::new);
    }

    private static int[] generatePolynomial(int firstByte, IntBinaryOperator random, int arraySize) {
        int[] polynomial = new int[arraySize];
        polynomial[0] = firstByte;
        for (int i = 1; i < arraySize - 1; i++) polynomial[i] = random.applyAsInt(0, 256);
        polynomial[arraySize - 1] = random.applyAsInt(1, 256);
        return polynomial;
    }

    private static int[][] createSecrets(int numOfShares, int[][] polynomials) {
        int[][] result = new int[numOfShares][];
        Arrays.setAll(result, index -> {
            final int share = index + 1;
            IntStream evaluations = Arrays.stream(polynomials).mapToInt(polynomial -> evaluate(polynomial, share));
            return IntStream.concat(IntStream.of(share), evaluations).toArray();
        });
        return result;
    }

    /** @see <a href="https://en.wikipedia.org/wiki/Horner%27s_method">Wikipedia: Horner's method</a> */
    private static int evaluate(int[] polynomial, int share) {
        int result = 0;
        for (int i = polynomial.length - 1; i >= 0; i--) result = GF256.add(GF256.mul(result, share), polynomial[i]);
        return result;
    }

    /**
     * Join the given shares using Shamir's secret sharing algorithm to recover the original secret.
     * Use the AES GF(256) operations for calculations and assume that the `x` value of the secret is `0`.
     * The 'x' values of the shares are read from the shares' first byte.
     * <br>
     * Note: If the shares are incorrect, or their number is less than the threshold value that was used
     * when generating the shares, the output will be meaningless.
     *
     * @param shares The shares to join.
     * @return The original secret.
     *
     * @see <a href="https://en.wikipedia.org/wiki/Shamir%27s_secret_sharing">Wikipedia: Shamir's secret sharing</a>
     */
    static int[] joinShares(List<int[]> shares) {
        require(shares.size() > 1, "At least two shares needed.");
        require(
                shares.stream().map(share -> share.length).collect(Collectors.toSet()).size() == 1,
        "Varying lengths of shares."
        );
        require(
                shares.stream().flatMapToInt(Arrays::stream).allMatch(b -> b >= 0 && b <= 255),
        "Share bytes must be in the range 0..255."
        );
        require(
                shares.stream().map(Main::toHex).collect(Collectors.toSet()).size() == shares.size(),
                "Duplicate share detected."
        );
        int length = shares.get(0).length;
        require(length > 1, "Shares not long enough.");
        int[] result = new int[length - 1];
        loop(1, length, index -> {
            XY[] points = shares.stream().map(share -> new XY(share[0], share[index])).toArray(XY[]::new);
            result[index - 1] = interpolate(points);
        });
        return result;
    }

    record XY(int x, int y) {}

    /**
     * @return The Lagrange interpolation of the polynomial defined by the data values at x = 0.
     *
     * @see <a href="https://en.wikipedia.org/wiki/Lagrange_polynomial">Wikipedia: Lagrange polynomial</a>
     */
    private static int interpolate(XY[] data) {
        int y0 = 0; // Calculate the y value at x = 0
        for (int i = 0; i < data.length; i++) {
            int x1 = data[i].x;
            int y1 = data[i].y;
            int t = 1;
            for (int j = 0; j < data.length; j++) {
                int x2 = data[j].x;
                if (i != j) {
                    t = GF256.mul(t, GF256.div(x2, GF256.sub(x1, x2)));
                }
            }
            y0 = GF256.add(y0, GF256.mul(t, y1));
        }
        return y0;
    }

}
