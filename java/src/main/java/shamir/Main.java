package shamir;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        if (args.length == 0) usage();
        else if ("share"         .equals(args[0]) && args.length == 4)
            share         (args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]));
        else if ("shareSilent"   .equals(args[0]) && args.length == 4)
            shareSilent   (args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]));
        else if ("shareHex"      .equals(args[0]) && args.length == 4)
            shareHex      (args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]));
        else if ("shareHexSilent".equals(args[0]) && args.length == 4)
            shareHexSilent(args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]));
        else if ("join"         .equals(args[0]) && args.length > 2)
            join          (args);
        else if ("verify"        .equals(args[0]) && args.length == 1)
            Verify.run();
        else usage();
    }

    final static Shamir.Random random = Optional.ofNullable(System.getenv("fakerandom"))
            .map(fakeRandom -> {
                System.err.printf("Using fake random value %s.\n", fakeRandom);
                return (Shamir.Random) (ignore1, ignore2) -> Integer.parseInt(fakeRandom);
            })
            .orElse(new SecureRandom()::nextInt);

    static void share(String stringSecret, int numberOfShares, int threshold) {
        int[] secret = toBytes(stringSecret);
        int[][] shares = Shamir.shareSecret(secret, numberOfShares, threshold, random);
        println("The secret as hex string: %s", toHex(secret));
        println("Shares for the secret '%s':", stringSecret);
        println("To recover, you need %d of %d shares.", threshold, numberOfShares);
        for (int[] share : shares) println(toHex(share));
    }

    static void shareSilent(String stringSecret, int numberOfShares, int threshold) {
        int[] secret = toBytes(stringSecret);
        int[][] shares = Shamir.shareSecret(secret, numberOfShares, threshold, random);
        for (int[] share : shares) println(toHex(share));
    }

    static void shareHex(String hexSecret, int numberOfShares, int threshold) {
        int[] secret = fromHex(hexSecret);
        int[][] shares = Shamir.shareSecret(secret, numberOfShares, threshold, random);
        println("Shares for the hex secret %s:", toHex(secret));
        println("To recover, you need %d of %d shares.", threshold, numberOfShares);
        for (int[] share : shares) println(toHex(share));
    }

    static void shareHexSilent(String hexSecret, int numberOfShares, int threshold) {
        int[] secret = fromHex(hexSecret);
        int[][] shares = Shamir.shareSecret(secret, numberOfShares, threshold, random);
        for (int[] share : shares) println(toHex(share));
    }

    static void join(String[] commandAndShares) {
        List<int[]> shares = Arrays.stream(commandAndShares).skip(1).map(Main::fromHex).toList();
        int[] recovered = Shamir.joinShares(shares);
        println("Secret recovered from joined shares:");
        println(asString(recovered));
    }

    static String toHex(int[] bytes) {
        return Arrays.stream(bytes).mapToObj(Main::toHex).collect(Collectors.joining());
    }

    static String toHex(int b) {
        return String.format("%02x", b);
    }

    static int[] fromHex(String hexString) {
        return Arrays.stream(hexString.split("(?<=\\G..)"))
                .mapToInt(hexPair -> Integer.parseInt(hexPair, 16))
                .toArray();
    }

    static int[] toBytes(String string) {
        byte[] bytes = string.getBytes(StandardCharsets.UTF_8);
        int[] result = new int[bytes.length];
        for (int i = 0; i < bytes.length; i++) {
            result[i] = toInt(bytes[i]);
        }
        return result;
    }

    static int toInt(byte b) {
        return Byte.toUnsignedInt(b);
    }

    static String asString(int[] byteValues) {
        byte[] bytes = new byte[byteValues.length];
        for (int index = 0; index < byteValues.length; index++) { bytes[index] = (byte) byteValues[index]; }
        return new String(bytes, StandardCharsets.UTF_8);
    }

    static void println(String string, Object... objects) {
        System.out.printf(string + "\n", objects);
    }

    static void usage() {
        println("Shamir's secret sharing - use with the following parameters:");
        println("'share' <secret> <number of shares> <threshold>");
        println("'shareSilent' <secret> <number of shares> <threshold>");
        println("'shareHex' <secret as hex string> <number of shares> <threshold>");
        println("'shareHexSilent' <secret as hex string> <number of shares> <threshold>");
        println("'join' <share1> <share2> ...");
        println("'joinSilent' <share1> <share2> ...");
        println("'joinHex' <share1> <share2> ...");
        println("'joinHexSilent' <share1> <share2> ...");
        println("'verify'");
    }
}
