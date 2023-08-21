package shamir;

import java.util.Arrays;
import java.util.function.IntBinaryOperator;
import java.util.stream.IntStream;

class Shamir {

    private static void require(boolean condition, String message) {
        if (!condition) throw new IllegalArgumentException(message);
    }

    interface Random extends IntBinaryOperator { }

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
                .stream(secretBytes).mapToObj(b -> generatePolynomial(b, random, threshold - 1))
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

    private static int evaluate(int[] polynomial, int share) {
        int result = 0;
        for (int i = polynomial.length - 1; i >= 0; i--) result = GF256.add(GF256.mul(result, share), polynomial[i]);
        return result;
    }

}
