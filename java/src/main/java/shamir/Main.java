package shamir;

import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

public class Main {
    public static void main(String[] args) {
        new Main().run(args);
    }

    void run(String[] args) {
        if (args.length == 0) usage();
        else if ("share"         .equals(args[0]) && args.length == 4)
            share         (args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]), random);
        else if ("shareSilent"   .equals(args[0]) && args.length == 4)
            shareSilent   (args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]), random);
        else if ("shareHex"      .equals(args[0]) && args.length == 4)
            shareHex      (args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]), random);
        else if ("shareHexSilent".equals(args[0]) && args.length == 4)
            shareHexSilent(args[1], Integer.parseInt(args[2]), Integer.parseInt(args[3]), random);
        else usage();
    }

    final Shamir.Random random = Optional.ofNullable(System.getenv("fakerandom"))
            .map(fakeRandom -> {
                System.err.printf("Using fake random value %s.\n", fakeRandom);
                return (Shamir.Random) (ignore1, ignore2) -> Integer.parseInt(fakeRandom);
            })
            .orElse(new SecureRandom()::nextInt);

    void share(String stringSecret, int numberOfShares, int threshold, Shamir.Random random) {
        int[] secret = toBytes(stringSecret);
        int[][] shares = Shamir.shareSecret(secret, numberOfShares, threshold, random);
        println("The secret as hex string: %s", toHex(secret));
        println("Shares for the secret '%s':", stringSecret);
        for (int[] share : shares) println(toHex(share));
    }

    void shareSilent(String stringSecret, int numberOfShares, int threshold, Shamir.Random random) {
        int[] secret = toBytes(stringSecret);
        int[][] shares = Shamir.shareSecret(secret, numberOfShares, threshold, random);
        for (int[] share : shares) println(toHex(share));
    }

    void shareHex(String hexSecret, int numberOfShares, int threshold, Shamir.Random random) {
        int[] secret = fromHex(hexSecret);
        int[][] shares = Shamir.shareSecret(secret, numberOfShares, threshold, random);
        println("Shares for the hex secret %s:", toHex(secret));
        for (int[] share : shares) println(toHex(share));
    }

    void shareHexSilent(String hexSecret, int numberOfShares, int threshold, Shamir.Random random) {
        int[] secret = fromHex(hexSecret);
        int[][] shares = Shamir.shareSecret(secret, numberOfShares, threshold, random);
        for (int[] share : shares) println(toHex(share));
    }

    String toHex(int[] bytes) {
        return Arrays.stream(bytes).mapToObj(this::toHex).collect(Collectors.joining());
    }

    String toHex(int b) {
        return String.format("%02x", b);
    }

    int[] fromHex(String hexString) {
        return Arrays.stream(hexString.split("(?<=\\G..)"))
                .mapToInt(hexPair -> Integer.parseInt(hexPair, 16))
                .toArray();
    }

    int[] toBytes(String string) {
        byte[] bytes = string.getBytes(StandardCharsets.UTF_8);
        int[] result = new int[bytes.length];
        for (int i = 0; i < bytes.length; i++) {
            result[i] = toInt(bytes[i]);
        }
        return result;
    }

    int toInt(byte b) {
        return Byte.toUnsignedInt(b);
    }

    void println(String string, Object... objects) {
        System.out.printf(string + "\n", objects);
    }

    void usage() {
        println("Shamir's secret sharing - use with the following parameters:");
        println("'share' <secret> <number of shares> <threshold>");
        println("'shareSilent' <secret> <number of shares> <threshold>");
        println("'shareHex' <secret as hex string> <number of shares> <threshold>");
        println("'shareHexSilent' <secret as hex string> <number of shares> <threshold>");
        println("'join' <share1> <share2> ...");
        println("'joinSilent' <share1> <share2> ...");
        println("'joinHex' <share1> <share2> ...");
        println("'joinHexSilent' <share1> <share2> ...");
    }
}
